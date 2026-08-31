// 이행/적격심사상세 - '일반정보' 탭 (MUI-BD-10-T01(구 M01 탭 — v1.83 재편), 설계서 02입찰 slide163 / 데이터영역 slide166~167).
// 공고정보(dmt_pbancInfo) 표 + 참고서류(dlt_refDcmnt) 다운로드 + 법 위반 처벌이력 확인서 양식.
// 데이터는 목업(추후 API: scwin.getImpltElgbSrngDtlInfo). 항목명은 설계서 그대로.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import type { MockImpltElgbSrngPbancInfo } from '@/types/mock/bd'

// 공고정보 목업 (설계서 slide163 값·slide166 항목명) — 추후 API 매핑.
const MOCK_PBANC_INFO: MockImpltElgbSrngPbancInfo = {
  bidNm: '테스트공고',
  rprsCmdtyNm: '테스트품목',
  drctnYr: '2025',
  pbancNo: 'MST0001-1',
  rfrncNo: '2025MST0001',
  orderInstNm: '테스트발주기관',
  prcmNo: '10000',
  clsfNo: '001',
  ctrtMthdNm: '2단계경쟁(분리)',
  bidMthdNm: '전자입찰',
  bdopnDt: '2025-12-01 10:00',
  srngPrgrsDdlnDt: '2025-12-01 09:00',
  cmdtyLbsvcElgbSrngNm: '물품 적격심사',
  rmrk: '-',
}

// 참고서류(dlt_refDcmnt) 목업 — 설계서 slide163·167. 서류명/첨부문서명/파일크기.
// 법 위반 처벌이력 확인서 양식도 참고서류 목록에 파일로 포함(추후 API: scwin.btn_lawVltnHstryCnfdocForm_onclick).
const REF_DOCS: FileDownloadItem[] = [
  { id: 'ref-1', name: '첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[Implt] 참고서류 다운로드: ref-1') },
  { id: 'ref-2', name: '첨부파일명.hwp', size: '1.2MB', onDownload: () => console.log('[Implt] 참고서류 다운로드: ref-2') },
  { id: 'law-form', name: '법 위반 처벌이력 확인서 양식.hwp', size: '120KB', onDownload: () => console.log('[Implt] 법 위반 처벌이력 확인서 양식 다운로드') },
]

const pbancRows = (it: MockImpltElgbSrngPbancInfo): TableRow[] => [
  { label: '입찰건명', value: it.bidNm },
  { label: '대표품명', value: it.rprsCmdtyNm },
  { label: '지시년도', value: it.drctnYr },
  { label: '공고번호', value: it.pbancNo },
  { label: '통합참조번호', value: it.rfrncNo },
  { label: '발주기관', value: it.orderInstNm },
  { label: '판단번호', value: it.prcmNo },
  { label: '항목번호', value: it.clsfNo },
  { label: '계약방법', value: it.ctrtMthdNm },
  { label: '입찰방법', value: it.bidMthdNm },
  { label: '개찰일시', value: it.bdopnDt },
  { label: '신청마감일시', value: it.srngPrgrsDdlnDt },
  { label: '적용양식', value: it.cmdtyLbsvcElgbSrngNm },
  { label: '비고', value: it.rmrk },
]

export function Implt1() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['pbanc', 'ref']} className="w-full">
        <AccordionSection value="pbanc" title="일반정보" borderTop={false}>
          <Table rows={pbancRows(MOCK_PBANC_INFO)} />
        </AccordionSection>
        <AccordionSection value="ref" title={`참고서류 (총 ${REF_DOCS.length}건)`}>
          <FileDownloadList files={REF_DOCS} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
Implt1.displayName = 'Implt1'
