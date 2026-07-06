// 기술평가결과조회 (MUI-BD-07-P71, 설계서 slide392 · 항목설명 slide393~394).
// 국외 입찰서 상세 바로가기 → 기술평가 점수 및 결과 조회. 읽기전용(footer=닫기, 부모 소유).
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(OvsTndrDtlPage)가 소유, 여기엔 본문만.
//    (국내 기술평가결과조회 TechEvlRsltInq 와 동일 패턴)
// 구성: 요약(SummaryInfo flushX) + 일반정보(dm_bscPbancInfo)/신청업체(dm_sbtInfo)/입찰업체(dm_splyInfo)/
//    평가결과(dl_resultInfo) 아코디언 + 구분/내용 표. 항목명(영문) 설계서 그대로.
// ※ 2026-07-01 화면 수정 반영: 주민등록번호 항목 삭제.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsTndrDtlItem } from '@/ui/biz/bd/ovsTndrDtl/OvsTndrDtlPage'

export interface OvsTechEvlRsltProps {
  /** 상세에서 넘어온 항목 — 공고 식별/표시값 시드. */
  detail: OvsTndrDtlItem
}

// 신청업체 (dm_sbtInfo, 설계서 slide393) — 로그인 업체 정보라 목업.
const MOCK_SBT_INFO = {
  sbtBzentyCd: '7001',
  sbtBzentyNm: 'FA무역대리점',
  sbtRprsvNm: '홍길동',
  sbtTlno: '02-1234-5678',
  sbtFxno: '02-2345-6789',
  sbtBzmnNo: '123-45-67890',
  sbtAddr: '서울특별시 종로구 세종대로 100',
}

// 입찰업체 (dm_splyInfo, 설계서 slide394) — 목업.
const MOCK_SPLY_INFO = {
  splyBzentyCd: '7004',
  splyBzentyNm: 'FB해외업체',
  splyRprsvNm: '홍길동',
  splyEmlAddr: 'overseas@fbcorp.com',
  splyTlno: '02-1234-5678',
  splyFxno: '02-2345-6789',
  splyBzmnNo: '123-45-67890',
  splyAddr: '서울특별시 종로구 세종대로 100',
}

// 평가결과 (dl_resultInfo, 설계서 slide394) — 목업(설계서 slide392 예시값 그대로).
// ⚠️ 기술평가점수는 설계서 데이터영역 미정의(레이아웃에만 표시) — 국내 기술평가결과조회의 techEvlScr 임시 차용.
const MOCK_TECH_EVL_RESULT = {
  prtcpItemQty: '1', // 참여품목수(15)
  techEvlScr: '77.3', // 기술평가점수 — 임시 영문키(techEvlScr)
  techEvlRslt: '합격', // 기술평가결과(100)
}

export function OvsTechEvlRslt({ detail }: OvsTechEvlRsltProps) {
  // 일반정보 (dm_bscPbancInfo, slide393) — 공고 식별값은 상세 항목으로 구동.
  const pbancRows: TableRow[] = [
    { label: '공고번호-차수', value: `${detail.pbancNo}-${detail.pbancOd}` },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '사업명', value: detail.bizNm },
    { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
    { label: '개찰일자', value: detail.bdopnDt },
  ]
  const sbtRows: TableRow[] = [
    { label: '업체코드', value: MOCK_SBT_INFO.sbtBzentyCd },
    { label: '업체명', value: MOCK_SBT_INFO.sbtBzentyNm },
    { label: '대표자', value: MOCK_SBT_INFO.sbtRprsvNm },
    { label: '전화번호', value: MOCK_SBT_INFO.sbtTlno },
    { label: '팩스', value: MOCK_SBT_INFO.sbtFxno },
    { label: '사업자번호 (DUNS NUM)', value: MOCK_SBT_INFO.sbtBzmnNo },
    { label: '주소', value: MOCK_SBT_INFO.sbtAddr },
  ]
  const splyRows: TableRow[] = [
    { label: '업체코드', value: MOCK_SPLY_INFO.splyBzentyCd },
    { label: '업체명', value: MOCK_SPLY_INFO.splyBzentyNm },
    { label: '대표자', value: MOCK_SPLY_INFO.splyRprsvNm },
    { label: '이메일', value: MOCK_SPLY_INFO.splyEmlAddr },
    { label: '전화번호', value: MOCK_SPLY_INFO.splyTlno },
    { label: '팩스', value: MOCK_SPLY_INFO.splyFxno },
    { label: '사업자번호 (DUNS NUM)', value: MOCK_SPLY_INFO.splyBzmnNo },
    { label: '주소', value: MOCK_SPLY_INFO.splyAddr },
  ]
  const resultRows: TableRow[] = [
    { label: '참여 품목수', value: `${MOCK_TECH_EVL_RESULT.prtcpItemQty} 건`, type: 'number' },
    { label: '기술평가점수', value: MOCK_TECH_EVL_RESULT.techEvlScr, type: 'number' },
    { label: '기술평가결과', value: MOCK_TECH_EVL_RESULT.techEvlRslt },
  ]

  return (
    <div className="flex flex-col gap-krds-7">
      <SummaryInfo
        flushX
        badges={[
          { key: 'task', label: detail.taskSeNm ?? '국외' },
          { key: 'mth', label: detail.bidMth },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={`통합참조번호 ${detail.intgRfrncNo} / 공고번호 ${detail.pbancNo}-${detail.pbancOd}`}
        title={detail.bizNm}
      />

      {/* flush: 시트 본문(px-16) 안이라 아코디언 콘텐츠 좌우 패딩 제거(2중 패딩 방지) */}
      <Accordion type="multiple" defaultValue={['pbanc', 'sbt', 'sply', 'result']}>
        <AccordionSection value="pbanc" title="일반정보" borderTop={false} flush>
          <Table rows={pbancRows} />
        </AccordionSection>
        <AccordionSection value="sbt" title="신청업체" flush>
          <Table rows={sbtRows} />
        </AccordionSection>
        <AccordionSection value="sply" title="입찰업체" flush>
          <Table rows={splyRows} />
        </AccordionSection>
        <AccordionSection value="result" title="평가결과" flush>
          <Table rows={resultRows} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
OvsTechEvlRslt.displayName = 'OvsTechEvlRslt'
