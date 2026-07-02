// 이행/적격심사상세 - '입찰/반려 정보' 탭 (MUI-BD-10-M02, 설계서 02입찰 slide164 / 데이터영역 slide166).
// 입찰결과(dmt_bidRslt) 표 + 반려사유(rjctRsn). "내 업체 정보만 표시". 데이터는 목업(추후 API).
import { PageTitle } from '@/ui/common/base/PageTitle'
import { TextArea } from '@/ui/common/base/TextArea'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { ImpltElgbSrngBidRslt } from '@/types/bd'

// 입찰결과·반려사유 목업 (설계서 slide164 값·slide166 항목명) — 추후 API 매핑.
const MOCK_BID_RSLT: ImpltElgbSrngBidRslt = {
  scsbdRnk: '1순위',
  bdngAmt: '89,000,000 원',
  scbrt: '89.8 %',
  srngPrgrsStNm: '대상통보',
  rjctRsn: '',
}

const bidRsltRows = (it: ImpltElgbSrngBidRslt): TableRow[] => [
  { label: '낙찰순위', value: it.scsbdRnk },
  { label: '투찰금액', value: it.bdngAmt, type: 'number' },
  { label: '투찰률', value: it.scbrt, type: 'number' },
  { label: '상태', value: it.srngPrgrsStNm },
]

export function Implt2() {
  const it = MOCK_BID_RSLT
  return (
    <>
      <PageTitle as="h2">입찰/반려 정보</PageTitle>
      <Accordion type="multiple" defaultValue={['bidRslt', 'rjct']} className="w-full">
        <AccordionSection value="bidRslt" title="입찰결과" borderTop={false}>
          <Table rows={bidRsltRows(it)} />
        </AccordionSection>
        <AccordionSection value="rjct" title="반려 사유">
          {/* 반려사유(rjctRsn) — 읽기전용. 반려 시에만 값. */}
          <TextArea
            disabled
            value={it.rjctRsn || '반려 사유 없음'}
            aria-label="반려 사유"
          />
        </AccordionSection>
      </Accordion>
    </>
  )
}
Implt2.displayName = 'Implt2'
