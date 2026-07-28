// 국외 공개수의협상결과조회 — MUI-BD-12-M83 컨테이너 · 탭 T82 일반정보 · T83 조회결과(구 M83 — v1.83 재편) (설계서 slide441~445).
// 진입: 견적서 상세(M78) 우측 하단 + 바로가기 '공개수의협상 결과조회' → /bd/ovs/rls-ngtn/:id/rslt (state=요약).
// 레퍼런스: 국외 입찰결과조회 상세(OvsBidRsltDtlPage) — 요약(collapsible)+탭+탭콘텐츠. ⚠️ 설계서 우선.
// 탭: 일반정보(공고+담당자) / 조회 결과(업체별 결과 카드). FAB=맨위로만(사용자 요청).
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsRlsVltrnsNgtnSrngRsltInq2 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnSrngRsltInq/OvsRlsVltrnsNgtnSrngRsltInq2'
import type { OvsRlsVltrnsGeneral, OvsRlsVltrnsSrngRsltSummary, OvsRlsVltrnsSummary } from '@/types/bd'

// 탭 (설계서 slide441: 일반정보 / 조회 결과)
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'result', label: '조회 결과' },
]

// 상단 요약 fallback (직접 URL 진입/새로고침) — 설계서 slide441 값.
const MOCK_SUMMARY: OvsRlsVltrnsSrngRsltSummary = {
  taskSeNm: '국외',
  ctrtMthdNm: '수의계약',
  bidTypeNm: '단가제',
  intgRfrncNo: 'BDF01823EFE',
  pbancNo: 'EFE00012-2',
  bizNm: '500MD 부품',
  splyBzentyNm: 'A 해외업체',
  prchsDmndNo: 'BDF01823-002',
  pbancRqstYmd: '2026-03-17',
  bdopnDt: '2026-03-30',
}

// 일반정보 탭 데이터 — 설계서 slide442 공고일반 값·형식 그대로.
const MOCK_GENERAL: OvsRlsVltrnsGeneral = {
  pbancNo: 'EFD0007-2',
  pbancType: '정상공고',
  pbancRqstYmd: '2022-11-12',
  prchsDmndNo: 'BAD839380-001',
  intgRfrncNo: 'BAD83990EFD',
  bizNm: '500MD 부품',
  ctrtMthdNm: '수의계약',
  sumDrctnAmt: '$ 126,000.18',
  itemQty: '100',
  exchrtAplcnYmd: '2025-03-02',
  bdopnDt: '2025-03-02 15:00:00',
  etdcDdlnDt: '2025-03-02 15:00:00',
  picDeptNm: '국제부품계약팀',
  picNm: '정영금',
  picTlno: '02-1234-5678',
  picMblTelno: '010-1234-5678',
}

// ── 일반정보 탭 (slide442) — 일반정보 표 + 담당자 정보 표 ───────────────
function GeneralInfo({ detail }: { detail: OvsRlsVltrnsGeneral }) {
  const generalRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '공고구분', value: detail.pbancType },
    { label: '공고일자', value: detail.pbancRqstYmd },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '사업명', value: detail.bizNm },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '총금액', value: detail.sumDrctnAmt, type: 'number' },
    { label: '공고품목수', value: detail.itemQty, type: 'number' },
    { label: '환율적용일자', value: detail.exchrtAplcnYmd },
    { label: '개찰일시', value: detail.bdopnDt },
    { label: '견적서제출마감일시', value: detail.etdcDdlnDt },
  ]
  const contactRows: TableRow[] = [
    { label: '담당 부서명', value: detail.picDeptNm },
    { label: '담당자', value: detail.picNm },
    {
      label: '연락처',
      value: (
        <div className="flex flex-col gap-0.5">
          <span>{detail.picTlno}</span>
          <span>{detail.picMblTelno}</span>
        </div>
      ),
      type: 'combination',
    },
  ]

  return (
    <Accordion type="multiple" defaultValue={['general', 'contact']} className="w-full">
      <AccordionSection value="general" title="일반정보" borderTop={false}>
        <Table rows={generalRows} />
      </AccordionSection>
      <AccordionSection value="contact" title="담당자 정보">
        <Table rows={contactRows} />
      </AccordionSection>
    </Accordion>
  )
}

export function OvsRlsVltrnsNgtnSrngRsltInqPage() {
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 상단 요약 — 넘어온 값(navigate state = 견적서 상세 요약)으로 공통 식별필드 override, 나머지는 결과조회 목업.
  const passed = useLocation().state as OvsRlsVltrnsSummary | null
  const summary: OvsRlsVltrnsSrngRsltSummary = passed
    ? {
        ...MOCK_SUMMARY,
        taskSeNm: passed.taskSeNm,
        ctrtMthdNm: passed.ctrtMthdNm,
        intgRfrncNo: passed.intgRfrncNo,
        pbancNo: passed.pbancNo,
        bizNm: passed.bizNm,
        prchsDmndNo: passed.prchsDmndNo,
      }
    : MOCK_SUMMARY

  // 요약 정보행 (설계서 slide441) — 입찰업체·구매요청번호·공고일자·개찰일자.
  const summaryRows: SummaryInfoRow[] = [
    { label: '입찰업체', value: summary.splyBzentyNm },
    { label: '구매요청번호', value: summary.prchsDmndNo },
    { label: '공고일자', value: summary.pbancRqstYmd },
    { label: '개찰일자', value: summary.bdopnDt },
  ]

  const renderTabContent = (current: string) => {
    switch (current) {
      case 'result':
        return <OvsRlsVltrnsNgtnSrngRsltInq2 />
      default:
        return <GeneralInfo detail={MOCK_GENERAL} />
    }
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소. StepBar 없음(설계서 우선). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: summary.taskSeNm }, { label: summary.ctrtMthdNm }, { label: summary.bidTypeNm }]}
          subtitle={`통합참조번호 ${summary.intgRfrncNo} / 공고번호 ${summary.pbancNo}`}
          title={summary.bizNm}
          rows={summaryRows}
        />

        {/* 탭 */}
        <div className="px-4">
          <TabList
            value={tab}
            onChange={(next) => {
              setTab(next)
              goToContentTop()
            }}
            items={TABS}
          />
        </div>
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘 지탱 위해 최소 높이 확보(진동 방지). */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 플로팅 버튼 — 맨위로만(사용자 요청). 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsRlsVltrnsNgtnSrngRsltInqPage.displayName = 'OvsRlsVltrnsNgtnSrngRsltInqPage'
