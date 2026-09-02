// 입찰공고 상세 - '일반정보' 탭 (MUI-BD-01-T01(구 M07 — v1.83 재편), Figma 9300-37570).
// 설계서 근거(02.입찰 v1.83): slide25(탭 노출 정책표) · slide26~27(일반정보 콘텐츠·공사 분기) ·
//   slide28(지역제한·공증및면허제한·시공능력평가제한·지명경쟁업체·첨부서류·문의처) ·
//   slide29~31(공고일반 데이터 영역 dmt_bidPbancGnrl 항목설명 — 영문 키·형식·비고).
// 일반정보 + 지역제한 + 공증·면허제한(업무도움) + 시공능력평가제한 + 지명경쟁업체 + 첨부서류 + 문의처 아코디언.
// 데이터는 목업(추후 bdService.selectPbancGnrlInfo) — 값은 설계서 slide26~28 예시 그대로.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'

// 일반정보 (설계서 slide26~27 콘텐츠 순서 · 영문 키는 slide29~31 dmt_bidPbancGnrl).
// ⚠️ 업무구분 '공사' 분기(slide27 특이사항) — 현재 목업은 대표 케이스(물품·제조)로 렌더:
//   - 공고명(rprsItemNm) → 공사명(cstrnNm) 으로 항목 변경
//   - 1-1] '사전심사'·'사전심사마감일시' 행 노출(단가제유형 다음 위치) — 영문 키 데이터표 미기재(잠정)
//   - 1-2] 사업설명회장소/일시 → 현장설명회장소/일시 로 항목 변경(키 동일: grndsExplnPlcNm/grndsExplnPrnmntDt)
const GENERAL_ROWS: TableRow[] = [
  { label: '공고번호-차수', value: '긴급공고 LDG0097-1' }, // pbancNo + pbancCycl
  { label: '공고일자', value: '2025-12-22' }, // pbancYmd (yyyy-mm-dd)
  { label: '게재기관', value: '인터넷' }, // pblctnInstNm
  { label: '공고명', value: '특수작전용대물타격무인항공기' }, // rprsItemNm(물품·용역) · 공사=공사명(cstrnNm)
  { label: '통합참조번호', value: '2025LDG56349' }, // ⚠️ 잠정 키 없음 — slide29 영문 항목명 미기재
  { label: '총수량', value: '1 AY' }, // totalItemCnt
  { label: '집행유형', value: '제조' }, // bizTpcd (상위코드:ETC)
  { label: '판단번호', value: '56349' }, // prcmNo
  { label: '발주기관', value: '육군 탄약지원사령부' }, // orderInstNm (상위코드:RIC)
  { label: '입찰형태', value: '전자입찰' }, // elctrNgtnYn ('1':일반입찰, '2':전자입찰)
  { label: '계약방법', value: '제한경쟁' }, // ctrtMthdNm (상위코드:CTMC)
  { label: '입찰방법', value: '-' }, // bidMthdNm (상위코드:BDTC) — 설계서 예시값 미기재
  { label: '단가제유형', value: '총액제' }, // bidTpcdNm (상위코드:BTUP)
  // { label: '사전심사', value: '' },          // ⚠️ 업무구분 '공사'일 때만 노출(slide27 1-1) — 영문 키 미기재(잠정)
  // { label: '사전심사마감일시', value: '' },  // ⚠️ 업무구분 '공사'일 때만 노출(slide27 1-1) — 영문 키 미기재(잠정)
  { label: '계약종류', value: '일반확정계약' }, // ctrtTpcdNm (상위코드:CTKC)
  { label: '낙찰자결정방법', value: '적격심사제' }, // scsbdMthdNm (상위코드:CCMT)
  { label: '적격심사여부', value: '대상' }, // elgbSrngYn (Y:대상, N:비대상)
  { label: '사업설명회장소', value: '-' }, // grndsExplnPlcNm — 공사=현장설명회장소. 설계서 예시값 미기재
  { label: '사업설명회일시', value: '-' }, // grndsExplnPrnmntDt (yyyy-mm-dd hh:mm) — 공사=현장설명회일시. 예시값 미기재
  { label: '예산금액', value: '619,520,000 원', type: 'number' }, // sumAmt
  { label: '추정가격', value: '563,200,000 원', type: 'number' }, // prsmpPrc
  { label: '생산능력제출마감일시', value: '해당없음' }, // prdcpIdntySmdocDdlnDt
  { label: '입찰참가등록마감일시', value: '2025-12-23 17:00' }, // bidClrsDt
  { label: '입찰서제출마감일시', value: '2025-12-24 10:00' }, // tndrSbmsnDdlnDt
  { label: '개찰일시', value: '2025-12-24 10:30' }, // bdopnDt
  { label: '입찰장소', value: '국방전자조달시스템' }, // bidPlcNm
  {
    label: '등록심사시점', // tndrSbmsnPntmCd (Y:등록심사, N:사전심사, F:개찰후심사)
    value:
      '입찰참가등록 후 등록심사 없이 입찰서제출 (등록심사는 입찰서제출마감 후 실시) (등록심사시점은 개찰 후 입찰등록 심사로 변경될 수 있음)',
  },
  { label: '기초예가적용여부', value: '적용' }, // bidPrtcpQlfcYn (Y:적용, N:미적용)
  { label: 'G2B공고번호-차수', value: '2025LDG56349-01' }, // g2bBidPbancNo + g2bBidPbancCycl
  { label: '복수업체연구개발대상', value: '비대상' }, // plrlBzentyRndTrgtYn (Y:대상, N:비대상)
  { label: '산업분류번호', value: '-' }, // tpbizCdNm (tpbizCd+':'+tpbizCdNm) — 설계서 예시값 미기재
  { label: '신기술공고여부', value: '비대상' }, // ntchYn (Y:대상, N:비대상)
  { label: '공동도급이행방식', value: '단독' }, // jsdShcd (상위코드:CMCT)
  { label: '하한(%)', value: '-2 %' }, // llmtAmtRt
  { label: '상한(%)', value: '+2 %' }, // ulprcRt
  { label: '낙찰하한율(%)', value: '80 %' }, // scsbdLlmtRt
  { label: '제한지역명', value: '-' }, // rgnNm (상위코드:SDCD·GU7)
  { label: '제한면허명', value: '-' }, // cnstpNm (상위코드:GU9)
]

// 지역제한 (설계서 slide28 ①) — 그룹/지역/지역코드 반복 그룹.
// 지역명=rgnNm(상위코드:SDCD). ⚠️ 잠정 키: grpNo(그룹)·rgnCd(지역코드) — 데이터표에 영문 항목명 미기재
const REGION_GROUPS = [{ grpNo: '1', rgnNm: '서울특별시', rgnCd: '[11000]' }]
const REGION_ROWS: TableRow[] = REGION_GROUPS.flatMap((g): TableRow[] => [
  { label: '그룹', value: g.grpNo },
  { label: '지역', value: g.rgnNm },
  { label: '지역코드', value: g.rgnCd },
])

// 공증 및 면허제한 (설계서 slide28 ②) — 그룹/명칭/면허코드 반복 그룹.
// 명칭=cnstpNm(제한면허명, 상위코드:GU9) · 면허코드=cnstpCd(제한면허코드). ⚠️ 잠정 키: grpNo
const LICENSE_GROUPS = [
  { grpNo: '1', cnstpNm: '[면허제한] 의료기기판매업', cnstpCd: '[5312]' },
  { grpNo: '2', cnstpNm: '[공증] 의료기기판매업', cnstpCd: '[5312]' },
]
const LICENSE_ROWS: TableRow[] = LICENSE_GROUPS.flatMap((g): TableRow[] => [
  { label: '그룹', value: g.grpNo },
  { label: '명칭', value: g.cnstpNm },
  { label: '면허코드', value: g.cnstpCd },
])

// 시공능력평가제한 (설계서 slide28 ③) — 그룹/공종(업종)명/제한금액 반복 그룹(그룹당 업종 복수 가능).
// 공종(업종)명=cnstpNm · 제한금액=cnstAbltEvlLmtAmt. 값은 설계서 자리표시 예시 그대로. ⚠️ 잠정 키: grpNo
const CNSTR_CPCTY_GROUPS = [
  { grpNo: '1', items: [{ cnstpNm: '업종명칭', cnstAbltEvlLmtAmt: '000,000,000,000 원' }] },
  {
    grpNo: '2',
    items: [
      { cnstpNm: '업종명칭 1', cnstAbltEvlLmtAmt: '000,000,000,000 원' },
      { cnstpNm: '업종명칭 2', cnstAbltEvlLmtAmt: '000,000,000,000 원' },
    ],
  },
]
const CNSTR_CPCTY_ROWS: TableRow[] = CNSTR_CPCTY_GROUPS.flatMap((g): TableRow[] => [
  { label: '그룹', value: g.grpNo },
  {
    label: '공종(업종)명',
    value:
      g.items.length === 1 ? (
        g.items[0].cnstpNm
      ) : (
        <div className="flex flex-col gap-krds-2">
          {g.items.map((it) => (
            <span key={it.cnstpNm}>{it.cnstpNm}</span>
          ))}
        </div>
      ),
    type: g.items.length === 1 ? 'default' : 'combination',
  },
  {
    label: '제한금액',
    value:
      g.items.length === 1 ? (
        g.items[0].cnstAbltEvlLmtAmt
      ) : (
        <div className="flex flex-col gap-krds-2 text-right tabular-nums">
          {g.items.map((it) => (
            <span key={it.cnstpNm}>{it.cnstAbltEvlLmtAmt}</span>
          ))}
        </div>
      ),
    type: g.items.length === 1 ? 'number' : 'combination',
  },
])

// 지명경쟁업체 (설계서 slide28 ④) — 항목번호 / 업체정보([업체코드] 업체명·대표자·사업자등록번호·주소).
// 업체코드=bzentyCd(5자리)·업체명=bzentyNm(slide31). ⚠️ 잠정 키: itemNo(항목번호)·rprsvNm(대표자)·brno(사업자등록번호)·addr(주소)
const DSGNT_BIDDERS = [
  {
    itemNo: '1',
    bzentyCd: '7004F',
    bzentyNm: '주식회사 국방전자조달',
    rprsvNm: '홍길동',
    brno: '123-45-67890',
    addr: '서울특별시 용산구 한강대로 1',
  },
]
const DSGNT_BIDDER_ROWS: TableRow[] = DSGNT_BIDDERS.flatMap((b): TableRow[] => [
  { label: '항목번호', value: b.itemNo },
  {
    label: '업체정보',
    value: (
      <div className="flex flex-col gap-krds-2">
        <span>{`[${b.bzentyCd}] ${b.bzentyNm}`}</span>
        <span>{b.rprsvNm}</span>
        <span>{b.brno}</span>
        <span>{b.addr}</span>
      </div>
    ),
    type: 'combination',
  },
])

// 첨부서류 (설계서 slide28 ⑤ — 총 N건 표시, 개별 리스트 탭으로 개별 다운로드)
const ATTACH_FILES: FileDownloadItem[] = [
  { id: 'att-1', name: '입찰공고문.hwp', size: '786KB' },
  { id: 'att-2', name: '규격서.hwp', size: '1.2MB' },
]

// 문의처 (설계서 slide28 ⑥ — 기관 부서명/담당자/연락처)
const CONTACT_ROWS: TableRow[] = [
  { label: '기관 부서명', value: '방위사업청' },
  { label: '담당자', value: '홍길동 주무관' },
  {
    label: '연락처',
    value: (
      <div className="flex flex-col gap-krds-2">
        <span>02-1234-5678</span>
        <span>010-1234-5678</span>
      </div>
    ),
    type: 'combination',
  },
]

export function BidPbancDtl() {
  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={['general', 'region', 'license', 'cnstrCpcty', 'dsgntBidder', 'attach', 'contact']}
        className="w-full"
      >
        <AccordionSection value="general" title="일반정보" borderTop={false}>
          <Table rows={GENERAL_ROWS} />
        </AccordionSection>
        <AccordionSection value="region" title="지역제한">
          <Table rows={REGION_ROWS} />
        </AccordionSection>
        <AccordionSection value="license" title="공증 및 면허제한">
          {/* 업무도움 문구 — 설계서 slide28 원문 그대로 */}
          <Infobox
            title="업무도움"
            items={[
              '최대 16개의 그룹이 나타날 수 있으며, 동일그룹의 면허는 모두 보유해야 하며 여러 개의 그룹인 경우에는 한 개 이상의 그룹면허를 가지고 있어야 합니다.',
              'G2b에 등록된 면허정보는 「업체정보관리_국내업체관리_국내업체정보조회_시설정보」에서 확인하시고 면허 설정의 오류 또는 공고내용과 상이한 면허 제한에 이의 있으면 하단의 문의처로 연락하시기 바랍니다.',
            ]}
          />
          <Table rows={LICENSE_ROWS} />
        </AccordionSection>
        <AccordionSection value="cnstrCpcty" title="시공능력평가제한">
          <Table rows={CNSTR_CPCTY_ROWS} />
        </AccordionSection>
        <AccordionSection value="dsgntBidder" title="지명경쟁업체">
          <Table rows={DSGNT_BIDDER_ROWS} />
        </AccordionSection>
        {/* 건수는 우측 titleInfo 슬롯(Figma m_section title 9973-131169 — 17px Bold 남색). 배경 흰색(사용자 확정) */}
        <AccordionSection value="attach" title="첨부서류" titleInfo={`총 ${ATTACH_FILES.length}건`}>
          <FileDownloadList
            files={ATTACH_FILES.map((f) => ({ ...f, onDownload: () => handleDownload(String(f.id), f.name) }))}
          />
        </AccordionSection>
        <AccordionSection value="contact" title="문의처">
          <Table rows={CONTACT_ROWS} />
        </AccordionSection>
      </Accordion>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </>
  )
}
BidPbancDtl.displayName = 'BidPbancDtl'
