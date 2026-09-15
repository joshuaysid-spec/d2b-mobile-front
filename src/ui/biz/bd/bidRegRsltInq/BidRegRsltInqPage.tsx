// 입찰등록심사 결과조회 (MUI-BD-03-M05, Figma 9300-38197 참고 — 내용은 설계서대로, slide73~76).
// 읽기전용 라우팅 페이지: 요약 헤더(SummaryInfo + 출력) + 업무도움(Infobox) +
//   공고일반/업체내역/입찰보증금/공동수급업체/등록결과 아코디언(Accordion + Table). 데이터는 목업.
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Icon } from '@/ui/common/base/Icon'
import { OzReportFullPopup } from '@/ui/biz/cm/ozReport/OzReportFullPopup'
import { useOzReport } from '@/ui/biz/cm/ozReport/useOzReport'

// 공동수급업체 1건(목업 타입) — dlt_jsdBzentyList 항목(설계서 slide75).
interface JsdBzenty {
  jsdBzentyNm: string // 구분(대표/구성)
  bzentyNm: string // 공동수급업체명
  jsdShNm: string // 이행방식
  invstRt: string // 출자비율
}

// 공고일반 (설계서 slide73 — dmt_bidPbancInfo)
const PBANC_ROWS: TableRow[] = [
  { label: '공고번호', value: '긴급공고 LDG0097-1' },
  { label: '판단번호', value: '56349' },
  { label: '발주기관', value: '육군 탄약지원사령부' },
  { label: '통합참조번호', value: '2025LDG56349' },
  { label: '집행유형', value: '제조' },
  { label: '계약방법', value: '일반확정계약' },
  { label: '입찰방법', value: '전자입찰' },
  { label: '총수량', value: '1 AY' },
  { label: '예산금액', value: '619,520,000 원', type: 'number' },
  { label: '적격심사', value: '적격' },
  { label: '개찰일시', value: '2025-12-24 10:30' },
]

// 업체내역 (설계서 slide74 — dmt_bzentyInfo)
const BZENTY_ROWS: TableRow[] = [
  { label: '업체코드', value: '00000' },
  { label: '업체명', value: '㈜업체명표기영역' },
  { label: '대표자', value: '홍길동' },
  { label: '사업자등록번호', value: '123-56-78901' },
  { label: '전화번호', value: '02-1234-5678' },
  { label: '주소', value: '서울특별시 용산구 한강대로 1' },
]

// 입찰보증금 (설계서 slide74 — dmt_bidGrnte)
const GRNTE_ROWS: TableRow[] = [
  { label: '보증금납부방법', value: '현금' },
  { label: '보증금면제사유', value: '면제' },
  { label: '입찰보증금', value: '500,000,000 원', type: 'number' },
  { label: '증권번호', value: '0000 0000 0000' },
]

// 공동수급업체 (설계서 slide75 — dlt_jsdBzentyList) 대표/구성 2건
const JSD_BZENTY_LIST: JsdBzenty[] = [
  {
    jsdBzentyNm: '대표',
    bzentyNm: '㈜업체명표기영역',
    jsdShNm: '공동이행',
    invstRt: '60 %',
  },
  {
    jsdBzentyNm: '구성',
    bzentyNm: '㈜업체명표기영역',
    jsdShNm: '공동이행',
    invstRt: '40 %',
  },
]

// 공동수급업체 1건 → Table rows
function buildJsdRows(it: JsdBzenty): TableRow[] {
  return [
    { label: '구분', value: it.jsdBzentyNm },
    { label: '공동수급업체', value: it.bzentyNm },
    { label: '이행방식', value: it.jsdShNm },
    { label: '출자비율', value: it.invstRt, type: 'number' },
  ]
}

// 등록결과 (설계서 slide76 — dmt_bidRegSrngRslt)
const RESULT_ROWS: TableRow[] = [
  { label: '등록확정여부', value: '-' },
  { label: '등록불가사유', value: '-' },
  { label: '등록확정일시', value: '2025-12-24 10:30' },
]

export function BidRegRsltInqPage() {
  const oz = useOzReport() // 출력 → OZ 리포트 뷰어(실연동은 OzReportFullPopup 안에서)
  return (
    <div className="flex w-full flex-col">
      {/* 요약 헤더 — badges + 공고번호(subtitle) + 출력 + 공고명(title) (Figma 9300-38197) */}
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
            // ⚠️ 리포트 코드 미확정(설계서 출력물 코드 확인 후 교체). 식별값은 상세 API(bdService.selectBidRegResult) 연동 후 params 로 전달.
            onClick={() => oz.open('MUI-BD-03-M05')}
            className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <Icon name="Print" size={24} aria-hidden />
          </button>
        }
      />

      <PageTitle as="h2" className="sr-only">
        입찰등록심사 결과조회
      </PageTitle>

      <div className="px-4 pb-4">
        <Infobox
          title="업무도움"
          items={['입찰등록심사 결과를 조회하는 화면입니다.']}
        />
      </div>

      <Accordion
        type="multiple"
        defaultValue={['pbanc', 'bzenty', 'grnte', 'jsd', 'result']}
        className="w-full"
      >
        <AccordionSection value="pbanc" title="공고일반" borderTop={false}>
          <Table rows={PBANC_ROWS} />
        </AccordionSection>
        <AccordionSection value="bzenty" title="업체내역">
          <Table rows={BZENTY_ROWS} />
        </AccordionSection>
        <AccordionSection value="grnte" title="입찰보증금">
          <Table rows={GRNTE_ROWS} />
        </AccordionSection>
        <AccordionSection value="jsd" title="공동수급업체">
          {JSD_BZENTY_LIST.map((it) => (
            <Table key={`${it.jsdBzentyNm}-${it.bzentyNm}`} rows={buildJsdRows(it)} />
          ))}
        </AccordionSection>
        <AccordionSection value="result" title="등록결과">
          <Table rows={RESULT_ROWS} />
        </AccordionSection>
      </Accordion>
      <OzReportFullPopup {...oz.popupProps} />
    </div>
  )
}
BidRegRsltInqPage.displayName = 'BidRegRsltInqPage'
