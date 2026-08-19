// 국외 입찰서 상세 — 탭2 업체정보 (MUI-BD-06-T76(구 M76 — v1.83 재편), 설계서 slide376 · 항목설명 slide380~381).
// 신청업체(dm_sbtInfo) + 입찰업체(dm_splyInfo) 아코디언 + 구분/내용 표. 항목명(영문) 설계서 그대로.
// 데이터는 로그인 업체(입찰서 제출 업체) 정보라 목업 상수 — 추후 API: bdService.selectOvsTndrDtl 응답 매핑.
// ※ 2026-07-01 화면 수정 반영: 주민등록번호 항목 없음(삭제), 사업자번호 = 사업자등록번호 또는 DUNS NUM.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 신청업체 (dm_sbtInfo, 설계서 slide380) — 목업.
const MOCK_SBT_INFO = {
  sbtBzentyCd: '7001', // 신청업체 업체코드(5)
  sbtBzentyNm: 'FA무역대리점', // 신청업체 업체명(200)
  sbtRprsvNm: '홍길동', // 신청업체 대표자(200)
  sbtTlno: '02-1234-5678', // 신청업체 전화번호(11)
  sbtFxno: '02-2345-6789', // 신청업체 팩스(40)
  sbtBzmnNo: '123-45-67890', // 신청업체 사업자번호 — 사업자등록번호 또는 DUNS NUM(20)
  sbtAddr: '서울특별시 종로구 세종대로 100', // 신청업체 주소(600)
}

// 입찰업체 (dm_splyInfo, 설계서 slide381) — 목업.
const MOCK_SPLY_INFO = {
  splyBzentyCd: '7004', // 입찰업체 업체코드(5)
  splyBzentyNm: 'FB해외업체', // 입찰업체 업체명(200)
  splyRprsvNm: '홍길동', // 입찰업체 대표자(200)
  splyEmlAddr: 'overseas@fbcorp.com', // 입찰업체 이메일(100)
  splyTlno: '02-1234-5678', // 입찰업체 전화번호(11)
  splyFxno: '02-2345-6789', // 입찰업체 팩스(40)
  splyBzmnNo: '123-45-67890', // 입찰업체 사업자번호 — 사업자등록번호 또는 DUNS NUM(20)
  splyAddr: '서울특별시 종로구 세종대로 100', // 입찰업체 주소(600)
}

const SBT_ROWS: TableRow[] = [
  { label: '업체코드', value: MOCK_SBT_INFO.sbtBzentyCd },
  { label: '업체명', value: MOCK_SBT_INFO.sbtBzentyNm },
  { label: '대표자', value: MOCK_SBT_INFO.sbtRprsvNm },
  { label: '전화번호', value: MOCK_SBT_INFO.sbtTlno },
  { label: '팩스', value: MOCK_SBT_INFO.sbtFxno },
  { label: '사업자번호 (DUNS NUM)', value: MOCK_SBT_INFO.sbtBzmnNo },
  { label: '주소', value: MOCK_SBT_INFO.sbtAddr },
]

const SPLY_ROWS: TableRow[] = [
  { label: '업체코드', value: MOCK_SPLY_INFO.splyBzentyCd },
  { label: '업체명', value: MOCK_SPLY_INFO.splyBzentyNm },
  { label: '대표자', value: MOCK_SPLY_INFO.splyRprsvNm },
  { label: '이메일', value: MOCK_SPLY_INFO.splyEmlAddr },
  { label: '전화번호', value: MOCK_SPLY_INFO.splyTlno },
  { label: '팩스', value: MOCK_SPLY_INFO.splyFxno },
  { label: '사업자번호 (DUNS NUM)', value: MOCK_SPLY_INFO.splyBzmnNo },
  { label: '주소', value: MOCK_SPLY_INFO.splyAddr },
]

export function Tab2() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['sbt', 'sply']} className="w-full">
        <AccordionSection value="sbt" title="신청업체" borderTop={false}>
          <Table rows={SBT_ROWS} />
        </AccordionSection>
        <AccordionSection value="sply" title="입찰업체">
          <Table rows={SPLY_ROWS} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
Tab2.displayName = 'Tab2'
