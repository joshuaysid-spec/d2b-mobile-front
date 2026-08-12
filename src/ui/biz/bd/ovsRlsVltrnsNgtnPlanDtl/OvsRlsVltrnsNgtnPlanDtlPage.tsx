// 국외 공개수의협상계획상세 — MUI-BD-12-M71(컨테이너) · 탭 T71 일반정보 · T72 품목정보 · T73 첨부서류(구 M71~M73 — v1.83 재편). 설계서 slide411~414.
// 진입: 개찰목록 국외·수의계약 카드 클릭(수의계약 배지 조건일 때만) → /bd/ovsRlsVltrnsNgtnPlanDtl (state = 카드 요약).
// 레퍼런스: OvsBidRsltDtlPage / OvsTndrDtlPage. ⚠️ 설계서 우선 — StepBar·즐겨찾기·출력 없음(사용자 확정).
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsRlsVltrnsNgtnPlanDtl2 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl2'
import { OvsRlsVltrnsNgtnPlanDtl3 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl3'
import type { OvsRlsVltrnsGeneral, OvsRlsVltrnsSummary } from '@/types/bd'

// ── 탭 (설계서 T71 일반정보 / T72 품목정보 / T73 첨부서류) ─────────────────
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'item', label: '품목정보' },
  { value: 'file', label: '첨부서류' },
]

// 상단 요약 fallback (직접 URL 진입/새로고침) — 개찰목록 국외·수의계약 카드와 동일 값(설계서 slide411).
const MOCK_SUMMARY: OvsRlsVltrnsSummary = {
  taskSeNm: '국외',
  ctrtMthdNm: '수의계약',
  intgRfrncNo: 'BDF01823EFE',
  pbancNo: 'EFE00012-2',
  bizNm: '500MD 부품',
  prchsDmndNo: 'BDF01823-002',
  sumDrctnAmt: '$ 126,000.18',
  etdcDdlnDt: '2026-03-26 11:00',
  bdopnDt: '2026-03-30',
}

// 일반정보 탭 데이터 — 설계서 slide412 공고일반 데이터영역 값·형식 그대로.
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

// ── 일반정보 탭 (T71, slide412) — 일반정보 표 + 담당자 정보 표 ───────────────
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

export function OvsRlsVltrnsNgtnPlanDtlPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트

  // 상단 요약 — 카드에서 넘어온 값(navigate state) 우선, 없으면 fallback 목업.
  const summary = (useLocation().state as OvsRlsVltrnsSummary | null) ?? MOCK_SUMMARY

  const summaryRows: SummaryInfoRow[] = [
    { label: '구매요청번호', value: summary.prchsDmndNo },
    { label: '총 금액', value: summary.sumDrctnAmt },
    { label: '견적서제출마감일시', value: summary.etdcDdlnDt },
    { label: '개찰일자', value: summary.bdopnDt },
  ]

  // 바로가기 항목 (사용자 요청) — 견적서 작성 / 견적서 조회. 추후 공개수의협상견적서제출(M74) 등 연결.
  const shortcutItems: { id: string; label: string; variant: 'primary' | 'secondary' }[] = [
    { id: 'etdcWrt', label: '견적서 작성', variant: 'primary' },
    { id: 'etdcInq', label: '견적서 조회', variant: 'secondary' },
  ]

  const renderTabContent = (current: string) => {
    switch (current) {
      case 'general':
        return <GeneralInfo detail={MOCK_GENERAL} />
      case 'item':
        return <OvsRlsVltrnsNgtnPlanDtl2 />
      case 'file':
        return <OvsRlsVltrnsNgtnPlanDtl3 />
      default:
        return null
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
          badges={[{ label: summary.taskSeNm }, { label: summary.ctrtMthdNm }]}
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

      {/* 플로팅 버튼 — 맨위로 + 바로가기(+). 다른 상세와 동일. */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 — 견적서 작성 / 견적서 조회 (사용자 요청) */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={shortcutItems.map((it) => ({
            label: it.label,
            variant: it.variant,
            onClick: () => {
              setShortcutOpen(false)
              if (it.id === 'etdcWrt') {
                // 견적서 작성 → 공개수의협상 견적서제출 마법사(M74). 요약을 state 로 전달.
                navigate('/bd/ovsRlsVltrnsNgtnEtdcSbmsn', { state: summary })
                return
              }
              if (it.id === 'etdcInq') {
                // 견적서 조회 → 공개수의협상 견적서상세(M78~M81). 요약을 state 로 전달.
                navigate('/bd/ovsRlsVltrnsNgtnEtdcDtl', { state: summary })
                return
              }
              console.log('[M71] 바로가기', it.id)
            },
          }))}
        />
      </BottomSheet>
    </div>
  )
}
OvsRlsVltrnsNgtnPlanDtlPage.displayName = 'OvsRlsVltrnsNgtnPlanDtlPage'
