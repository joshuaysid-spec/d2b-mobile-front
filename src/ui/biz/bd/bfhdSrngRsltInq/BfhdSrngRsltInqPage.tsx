// 사전심사(PQ) 결과조회 (MUI-BD-02-M02, Figma 9300-38197 참고 — 내용은 설계서대로).
// 사전심사(PQ) 신청 현황 및 심사결과를 조회하는 읽기전용 라우팅 페이지.
// 구성(설계서 slide78~80): 요약 헤더 + 업무도움(Infobox) + 공고일반/업체내역/사전심사결과/첨부파일 아코디언.
// 데이터는 목업 — 추후 API: bdService.getPqResult.
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Icon } from '@/ui/common/base/Icon'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'

// 공고일반 (설계서 dmt_bidPbancInfo) — 필드/값/형식 설계서 기준 목업.
interface BidPbancInfo {
  pbancNo: string
  prcmNo: string
  orderInstNm: string
  rfrncNo: string
  cstrnSenm: string
  ctrtMthdNm: string
  bidMthdNm: string
  bgtAmt: string
  bfhdSrngEnfrcYn: string
  elgbSrngEnfrcYn: string
  bfhdSrngAplyDdlnDt: string
  bdopnDt: string
}
const PBANC_INFO: BidPbancInfo = {
  pbancNo: '긴급공고 LDG0097-1',
  prcmNo: '56349',
  orderInstNm: '육군 탄약지원사령부',
  rfrncNo: '2025LDG56349',
  cstrnSenm: '-',
  ctrtMthdNm: '일반확정계약',
  bidMthdNm: '전자입찰',
  bgtAmt: '619,520,000 원',
  bfhdSrngEnfrcYn: '실시',
  elgbSrngEnfrcYn: '적격',
  bfhdSrngAplyDdlnDt: '2025-12-23 17:00',
  bdopnDt: '2025-12-24 10:30',
}

// 업체내역 (설계서 dmt_bzentyInfo)
interface BzentyInfo {
  bzentyCd: string
  bzentyNm: string
  rprsvNm: string
  brno: string
  bzentyTelno: string
  bzentyAddr: string
}
const BZENTY_INFO: BzentyInfo = {
  bzentyCd: '00000',
  bzentyNm: '㈜업체명표기영역',
  rprsvNm: '홍길동',
  brno: '123-56-78901',
  bzentyTelno: '02-1234-5678',
  bzentyAddr: '서울특별시 용산구 한강대로 1',
}

// 사전심사결과 (설계서 dmt_bfhdSrngRslt)
interface BfhdSrngRslt {
  bfhdSrngScr: string
  srngPassYn: string
  bfhdSrngCfmtnDt: string
}
const SRNG_RSLT: BfhdSrngRslt = {
  bfhdSrngScr: '95.50',
  srngPassYn: '합격',
  bfhdSrngCfmtnDt: '2025-12-24 10:30',
}

// 첨부파일 (설계서 dlt_atchFileList)
const ATCH_FILES: FileDownloadItem[] = [
  {
    id: 'pq-1',
    name: '사전심사신청서.hwp',
    size: '786KB',
    onDownload: () => console.log('[M02-PQ] 다운로드: 사전심사신청서'),
  },
  {
    id: 'pq-2',
    name: '심사결과통지서.pdf',
    size: '1.2MB',
    onDownload: () => console.log('[M02-PQ] 다운로드: 심사결과통지서'),
  },
]

// 공고일반 표 행 — 항목명(설계서 한글) + 목업 값.
const PBANC_ROWS: TableRow[] = [
  { label: '공고번호', value: PBANC_INFO.pbancNo },
  { label: '공사번호', value: PBANC_INFO.prcmNo },
  { label: '발주기관', value: PBANC_INFO.orderInstNm },
  { label: '통합참조번호', value: PBANC_INFO.rfrncNo },
  { label: '공사구분', value: PBANC_INFO.cstrnSenm },
  { label: '계약방법', value: PBANC_INFO.ctrtMthdNm },
  { label: '입찰방법', value: PBANC_INFO.bidMthdNm },
  { label: '예산금액', value: PBANC_INFO.bgtAmt, type: 'number' },
  { label: '사전심사', value: PBANC_INFO.bfhdSrngEnfrcYn },
  { label: '적격심사', value: PBANC_INFO.elgbSrngEnfrcYn },
  { label: '신청마감일시', value: PBANC_INFO.bfhdSrngAplyDdlnDt },
  { label: '개찰일시', value: PBANC_INFO.bdopnDt },
]

// 업체내역 표 행
const BZENTY_ROWS: TableRow[] = [
  { label: '업체코드', value: BZENTY_INFO.bzentyCd },
  { label: '업체명', value: BZENTY_INFO.bzentyNm },
  { label: '대표자', value: BZENTY_INFO.rprsvNm },
  { label: '사업자등록번호', value: BZENTY_INFO.brno },
  { label: '전화번호', value: BZENTY_INFO.bzentyTelno },
  { label: '주소', value: BZENTY_INFO.bzentyAddr },
]

// 사전심사결과 표 행
const RSLT_ROWS: TableRow[] = [
  { label: '심사점수', value: SRNG_RSLT.bfhdSrngScr, type: 'number' },
  { label: '합격여부', value: SRNG_RSLT.srngPassYn },
  { label: '심사확정일시', value: SRNG_RSLT.bfhdSrngCfmtnDt },
]

export function BfhdSrngRsltInqPage() {
  return (
    <div className="flex w-full flex-col">
      {/* 요약 헤더 — badges(업무구분/계약방식/심사/참가유형) + 공고번호 + 출력 + 공고명 (Figma 9300-38197) */}
      <SummaryInfo
        badges={[
          { label: '물품' },
          { label: '경쟁입찰' },
          { label: '사전심사' },
          { label: '입찰참가' },
        ]}
        subtitle="긴급공고 LDG0097-1"
        title="특수작전용대물타격무인항공기"
        actions={
          <button
            type="button"
            aria-label="출력"
            onClick={() => console.log('[M02-PQ] 출력')}
            className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <Icon name="Print" size={24} aria-hidden />
          </button>
        }
      />

      <PageTitle as="h2" className="sr-only">
        사전심사(PQ) 결과조회
      </PageTitle>

      <div className="px-4 pb-4">
        <Infobox
          title="업무도움"
          items={['사전심사(PQ) 신청 현황 및 심사결과를 조회하는 화면입니다.']}
        />
      </div>

      <Accordion
        type="multiple"
        defaultValue={['pbanc', 'bzenty', 'result', 'atch']}
        className="w-full"
      >
        <AccordionSection value="pbanc" title="공고일반" borderTop={false}>
          <Table rows={PBANC_ROWS} />
        </AccordionSection>
        <AccordionSection value="bzenty" title="업체내역">
          <Table rows={BZENTY_ROWS} />
        </AccordionSection>
        <AccordionSection value="result" title="사전심사결과">
          <Table rows={RSLT_ROWS} />
        </AccordionSection>
        <AccordionSection value="atch" title={`첨부파일 (총 ${ATCH_FILES.length}건)`}>
          <FileDownloadList files={ATCH_FILES} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
BfhdSrngRsltInqPage.displayName = 'BfhdSrngRsltInqPage'
