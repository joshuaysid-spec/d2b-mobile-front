// 입찰공고 상세 - '품목명세서' 탭 (MUI-BD-01-T03(구 M09 — v1.83 재편), 설계서 02.입찰 v1.83 slide36~37·42~45).
// 구성:
//  1) 품목명세서 목록 — dlt_ItemDtst. 업무구분 물품/용역일 때만 탭 노출(컨테이너 제어).
//     · 입찰방법(계약유형) 총액제 → slide36 좌측 목업 + slide42 항목표
//     · 입찰방법(계약유형) 단가제 → slide36 우측 목업 + slide43 항목표
//  2) 품목명세서 상세 — dmt_ItemDtstDtl. 인터페이스 수신 공고일 때만 노출.
//     · 통합사업관리시스템(방위사업청·조달본부) 수신 → slide37 좌측 목업 + slide44 항목표
//     · 부대조달정보체계 수신 → slide37 우측 목업 + slide45 항목표
//  이벤트(slide36~37·45): 군급-재고번호/조달요구번호/품보형태 클릭 → 목록정보조회(MUI-OP-01-T73) 팝업
//    (NIIN·식별자료·참고자료·업체정보 팝업 slide38~41 은 별도 화면 — 이번 범위 밖, 스텁 처리)
//    · 출력 클릭(scwin.btn_itemListOtpt_onclick, OZ 리포트 PDB025BC/BD.ozr)은 모바일 미배선.
// 데이터는 목업(추후 bdService.selectPbancGnrlInfo) — 분기 메타 포함 인라인.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 분기 메타 (목업) ─────────────────────────────────────────────────────────
// 컨테이너(BidPbancDtlPage)가 prop 을 안 내려주는 현 구조라 인라인 목업으로 분기.
// 추후 공고 상세 응답으로 대체(입찰방법 키는 기존 bd 관례 bidMthdNm: '총액제'|'단가제').
interface PbancItemDtstMeta {
  /** 입찰방법(계약유형) — 총액제/단가제 목록 분기 (BidPrgrsItem.bidMthdNm 관례) */
  bidMthdNm: '총액제' | '단가제'
  /** 인터페이스 수신 시스템 — 품목명세서 상세 노출 분기. null=미수신(상세 미노출).
   *  ⚠️ 잠정 키 — 설계서(slide36~37)는 노출조건 텍스트만 있고 항목명(영문) 미정의. */
  rcvSysNm: '통합사업관리시스템' | '부대조달정보체계' | null
}

const MOCK_META: PbancItemDtstMeta = {
  bidMthdNm: '총액제',
  rcvSysNm: '통합사업관리시스템',
}

// ── 타입 (설계서 데이터영역 항목명 그대로 — 탭 전용이라 인라인) ─────────────

/** 품목명세서(총액제) 1건 — dlt_ItemDtst (slide42) */
interface ItemDtstGramt {
  rnum: string // 순번 (ROWNUM)
  inspShcd: string // 품보형태 (상위코드 ITC)
  prcmRqtNo: string // 조달요구번호
  spcfctNo: string // 규격번호
  spcfctKndCd: string // 규격종류 (상위코드 CSC)
  unitCd: string // 단위 (상위코드 UI)
  dlvgdsQty: string // 수량
  fscNtnItemIdntfNo: string // 군급-재고번호 (fscCd+"-"+ntnItemIdntfNo, 14자리)
  prtsNo: string // 부품번호
  aplcnEqpmntCdNm: string // 적용장비명
  plcdlvNm: string // 납지
  drctnUntprc: string // 단가
  itemName: string // 품명
  rfrncCn: string // 참조번호
  bgtCd: string // 예산구분 (상위코드 UZ03)
  dudtYmd: string // 납기
  drctnAmt: string // 금액
}

/** 품목명세서(단가제) 1건 — dlt_ItemDtst (slide43) */
interface ItemDtstUntprc {
  clsfNo: string // 항목번호
  fscNtnItemIdntfNo: string // 군급-재고번호
  spcfctNo: string // 규격번호
  spcfctKndCd: string // 규격종류
  unitCd: string // 단위
  dlvgdsQty: string // 수량
  itemName: string // 품명
  prtsNo: string // 부품번호
  rfrncCn: string // 참조번호
  aplcnEqpmntCdNm: string // 적용장비명
  drctnUntprc: string // 단가
  drctnAmt: string // 총금액
}

/** 품목명세서상세(통합사업관리시스템) 1건 — dmt_ItemDtstDtl (slide44) */
interface ItemDtstDtlIpms {
  rnum: string // 순번
  inspShcd: string // 품보형태 (상위코드 ITC)
  prcmRqtNo: string // 조달요구번호
  bgtCd: string // 예산구분 (상위코드 UZ03)
  aplcnEqpmntCdNm: string // 적용장비명 (상위코드 AC)
  prcmRqtInstCd: string // 군구분 (상위코드 RS)
  busiName: string // 사업명 (설계서 비고: 매핑영문명 없음 — Asis 작성, 추후 수정)
  plcdlvNm: string // 납지
  dudtYmd: string // 납기
  dlvgdsQty: string // 수량
  drctnUntprc: string // 단가
  drctnAmt: string // 총금액
}

/** 품목명세서상세(부대조달정보체계) 1건 — dmt_ItemDtstDtl (slide45 1.4표) */
interface ItemDtstDtlSbsd {
  rnum: string // 순번
  inspShcd: string // 품보형태 (상위코드 ITC)
  prcmRqtNo: string // 조달요구번호
  bgtCd: string // 예산구분 (상위코드 UZ03)
  plcdlvNm: string // 납지
  dlvgdsQty: string // 수량
  drctnUntprc: string // 단가
  drctnAmt: string // 금액
}

// ── 목업 (설계서 목업 예시값 — slide36~37) ──────────────────────────────────

const MOCK_GRAMT_ITEMS: ItemDtstGramt[] = [
  {
    rnum: '1',
    inspShcd: '소요군검사',
    prcmRqtNo: 'MB201639962A001',
    spcfctNo: '-',
    spcfctKndCd: '-',
    unitCd: '-',
    dlvgdsQty: '1',
    fscNtnItemIdntfNo: '000-A0000 0000', // slide36 마스킹 예시 그대로 (형식: fscCd-ntnItemIdntfNo)
    prtsNo: '-',
    aplcnEqpmntCdNm: '-',
    plcdlvNm: '-',
    drctnUntprc: '31,608,000.00 원',
    itemName: '풋살경기장 인조잔디 제조-설치납품',
    rfrncCn: '-',
    bgtCd: '-',
    dudtYmd: '2016-11-25',
    drctnAmt: '31,608,000 원',
  },
]

const MOCK_UNTPRC_ITEMS: ItemDtstUntprc[] = [
  {
    clsfNo: '1',
    fscNtnItemIdntfNo: '000-A0000 0000', // slide36 마스킹 예시 그대로
    spcfctNo: '-',
    spcfctKndCd: '-',
    unitCd: '-',
    dlvgdsQty: '5',
    itemName: '풋살경기장 인조잔디 제조-설치납품',
    prtsNo: '-',
    rfrncCn: '-',
    aplcnEqpmntCdNm: '가나다라마바사아자차카타파하',
    drctnUntprc: '31,608,000 원',
    drctnAmt: '- 원',
  },
]

// slide37 목업 텍스트 런이 쪼개져 값-항목 1:1 매핑 불가 → 동일 공고 예시값으로 재구성(잠정)
const MOCK_IPMS_DTL_ITEMS: ItemDtstDtlIpms[] = [
  {
    rnum: '1',
    inspShcd: '소요군검사',
    prcmRqtNo: 'MB201639962A001',
    bgtCd: '-',
    aplcnEqpmntCdNm: '가나다라마바사아자차카타파하',
    prcmRqtInstCd: '-',
    busiName: '-',
    plcdlvNm: '-',
    dudtYmd: '2016-11-25',
    dlvgdsQty: '5',
    drctnUntprc: '31,608,000 원',
    drctnAmt: '- 원',
  },
]

const MOCK_SBSD_DTL_ITEMS: ItemDtstDtlSbsd[] = [
  {
    rnum: '1',
    inspShcd: '소요군검사',
    prcmRqtNo: 'MB201639962A001',
    bgtCd: '-',
    plcdlvNm: '-',
    dlvgdsQty: '5',
    drctnUntprc: '31,608,000 원',
    drctnAmt: '- 원',
  },
]

// ── 행 빌더 ─────────────────────────────────────────────────────────────────

// 목록정보조회(MUI-OP-01-T73) 팝업 스텁 — NIIN 정보 등 팝업(slide38~41)은 별도 화면
function openItemInfoPopup(from: string, value: string) {
  console.log('[T03] 목록정보조회(MUI-OP-01-T73) 팝업', from, value)
}

/** 값 + [보기] 버튼 셀 (군급-재고번호·품보형태 → T73 팝업) */
function viewCell(label: string, value: string): TableRow {
  return {
    label,
    type: 'combination',
    value: (
      <div className="flex items-center justify-between gap-2">
        <span>{value}</span>
        <Button size="sm" variant="inner" onClick={() => openItemInfoPopup(label, value)}>
          보기
        </Button>
      </div>
    ),
  }
}

/** 총액제 목록 행 — slide36 좌측 목업 순서 (slide42 dlt_ItemDtst) */
function buildGramtRows(it: ItemDtstGramt): TableRow[] {
  return [
    { label: '순번', value: it.rnum, type: 'number' },
    { label: '품보형태', value: it.inspShcd },
    // 설계서(slide36): 조달요구번호 클릭 → 목록정보조회(T73) 팝업 — 목업엔 버튼 없음(값 클릭), 스텁 미배선
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '규격번호', value: it.spcfctNo },
    { label: '규격종류', value: it.spcfctKndCd },
    { label: '단위', value: it.unitCd },
    { label: '수량', value: it.dlvgdsQty, type: 'number' },
    viewCell('군급-재고번호', it.fscNtnItemIdntfNo),
    { label: '부품번호', value: it.prtsNo },
    { label: '적용장비명', value: it.aplcnEqpmntCdNm },
    { label: '납지', value: it.plcdlvNm },
    { label: '단가', value: it.drctnUntprc, type: 'number' },
    { label: '품명', value: it.itemName },
    { label: '참조번호', value: it.rfrncCn },
    { label: '예산구분', value: it.bgtCd },
    { label: '납기', value: it.dudtYmd },
    { label: '금액', value: it.drctnAmt, type: 'number' },
  ]
}

/** 단가제 목록 행 — slide36 우측 목업 순서 (slide43 dlt_ItemDtst) */
function buildUntprcRows(it: ItemDtstUntprc): TableRow[] {
  return [
    { label: '항목번호', value: it.clsfNo, type: 'number' },
    viewCell('군급-재고번호', it.fscNtnItemIdntfNo),
    { label: '규격번호', value: it.spcfctNo },
    { label: '규격종류', value: it.spcfctKndCd },
    { label: '단위', value: it.unitCd },
    { label: '수량', value: it.dlvgdsQty, type: 'number' },
    { label: '품명', value: it.itemName },
    { label: '부품번호', value: it.prtsNo },
    { label: '참조번호', value: it.rfrncCn },
    { label: '적용장비명', value: it.aplcnEqpmntCdNm },
    { label: '단가', value: it.drctnUntprc, type: 'number' },
    { label: '총금액', value: it.drctnAmt, type: 'number' },
  ]
}

/** 품목명세서 상세(통합사업관리시스템) 행 — slide44 dmt_ItemDtstDtl 순서. 품보형태 [보기] → T73(slide37) */
function buildIpmsDtlRows(it: ItemDtstDtlIpms): TableRow[] {
  return [
    { label: '순번', value: it.rnum, type: 'number' },
    viewCell('품보형태', it.inspShcd),
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '예산구분', value: it.bgtCd },
    { label: '적용장비명', value: it.aplcnEqpmntCdNm },
    { label: '군구분', value: it.prcmRqtInstCd },
    { label: '사업명', value: it.busiName },
    { label: '납지', value: it.plcdlvNm },
    { label: '납기', value: it.dudtYmd },
    { label: '수량', value: it.dlvgdsQty, type: 'number' },
    { label: '단가', value: it.drctnUntprc, type: 'number' },
    { label: '총금액', value: it.drctnAmt, type: 'number' },
  ]
}

/** 품목명세서 상세(부대조달정보체계) 행 — slide45 1.4표 순서. 품보형태 [보기] → T73(slide37) */
function buildSbsdDtlRows(it: ItemDtstDtlSbsd): TableRow[] {
  return [
    { label: '순번', value: it.rnum, type: 'number' },
    viewCell('품보형태', it.inspShcd),
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '예산구분', value: it.bgtCd },
    { label: '납지', value: it.plcdlvNm },
    { label: '수량', value: it.dlvgdsQty, type: 'number' },
    { label: '단가', value: it.drctnUntprc, type: 'number' },
    { label: '금액', value: it.drctnAmt, type: 'number' },
  ]
}

// ── 컴포넌트 ────────────────────────────────────────────────────────────────

export function BidPbancDtl_Tacpg03() {
  const isGramt = MOCK_META.bidMthdNm === '총액제'
  const listCount = isGramt ? MOCK_GRAMT_ITEMS.length : MOCK_UNTPRC_ITEMS.length
  const dtlItems =
    MOCK_META.rcvSysNm === '통합사업관리시스템'
      ? MOCK_IPMS_DTL_ITEMS
      : MOCK_META.rcvSysNm === '부대조달정보체계'
        ? MOCK_SBSD_DTL_ITEMS
        : null

  return (
    <>
      {/* 품목명세서 목록 — 총액제/단가제 분기(dlt_ItemDtst). 타이틀 우측 건수(총 N건), 배경 흰색(사용자 확정) */}
      <SectionTitle topDivider info={`총 ${listCount}건`} className="bg-white">
        품목명세서
      </SectionTitle>
      <Accordion
        type="multiple"
        defaultValue={[isGramt ? 'gramt-1' : 'untprc-1']}
        className="w-full"
      >
        {isGramt
          ? MOCK_GRAMT_ITEMS.map((it, i) => (
              <AccordionSection
                key={it.rnum}
                value={`gramt-${it.rnum}`}
                title={`순번 ${it.rnum}`}
                borderTop={i !== 0}
              >
                <Table rows={buildGramtRows(it)} />
              </AccordionSection>
            ))
          : MOCK_UNTPRC_ITEMS.map((it, i) => (
              <AccordionSection
                key={it.clsfNo}
                value={`untprc-${it.clsfNo}`}
                title={`항목번호 ${it.clsfNo}`}
                borderTop={i !== 0}
              >
                <Table rows={buildUntprcRows(it)} />
              </AccordionSection>
            ))}
      </Accordion>

      {/* 품목명세서 상세 — 인터페이스 수신 공고에만 노출(dmt_ItemDtstDtl, slide37) */}
      {dtlItems && (
        <>
          <SectionTitle topDivider info={`총 ${dtlItems.length}건`} className="bg-white">
            품목명세서 상세
          </SectionTitle>
          <Accordion type="multiple" defaultValue={['dtl-1']} className="w-full">
            {MOCK_META.rcvSysNm === '통합사업관리시스템'
              ? MOCK_IPMS_DTL_ITEMS.map((it, i) => (
                  <AccordionSection
                    key={it.rnum}
                    value={`dtl-${it.rnum}`}
                    title={`순번 ${it.rnum}`}
                    borderTop={i !== 0}
                  >
                    <Table rows={buildIpmsDtlRows(it)} />
                  </AccordionSection>
                ))
              : MOCK_SBSD_DTL_ITEMS.map((it, i) => (
                  <AccordionSection
                    key={it.rnum}
                    value={`dtl-${it.rnum}`}
                    title={`순번 ${it.rnum}`}
                    borderTop={i !== 0}
                  >
                    <Table rows={buildSbsdDtlRows(it)} />
                  </AccordionSection>
                ))}
          </Accordion>
        </>
      )}
    </>
  )
}
BidPbancDtl_Tacpg03.displayName = 'BidPbancDtl_Tacpg03'
