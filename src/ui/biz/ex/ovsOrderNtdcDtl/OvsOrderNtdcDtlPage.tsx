// 발주통보서상세 — MUI-EX-02-M78 OvsOrderNtdcDtl. 설계서 04.이행 v0.83 slide78~83.
// 발주통보서목록(M77) 카드 클릭 → /ex/ovsOrderNtdcDtl 진입.
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T77 상세정보 · T78 물품목록) — M74 셸 준용.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { exQueries } from '@/queries/bds/ex/exQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { OvsOrderNtdcDtl } from '@/ui/biz/ex/ovsOrderNtdcDtl/OvsOrderNtdcDtl'
import { OvsOrderNtdcDtl_CmdtyList } from '@/ui/biz/ex/ovsOrderNtdcDtl/OvsOrderNtdcDtl_CmdtyList'

const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'cmdty', label: '물품목록' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('이행')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function OvsOrderNtdcDtlPage() {
  const navigate = useNavigate()
  // 목록 → 상세: 식별자는 URL 이 아니라 navigate state(클릭 항목)로 받는다.
  const id = (useLocation().state as { id: string } | null)?.id ?? ''
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  const { data: detail } = exQueries.useSelectOvsOrderNtdcDtl(id)
  const steps = buildSteps()

  // state 없이 직접 진입 = 식별자를 알 수 없음 → 발주통보서목록으로.
  if (!id) return <Navigate to="/ex/order-ntdc" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <Notice type="urgent">이행 정보 신청, 수정은 PC 버전에서 가능합니다.</Notice>

      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.docSttsCd }].filter((b) => b.label)}
          subtitle={`RQ No ${detail.orderSeq}`}
          title={detail.bizNm}
          rows={[
            { label: '항목 수', value: `${detail.itemSeq.toLocaleString()} 개` },
            { label: '무역대리점', value: detail.bzentyCd },
            { label: '작성일', value: detail.wrtYmd },
            { label: '수신자', value: detail.rcvrNm },
          ]}
        />

        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar
                orientation="horizontal"
                items={steps}
                sheetItems={buildProgressSheet('이행', (substep, prgrsStg) =>
                  navigate('/anl-prgrs', { state: { substep, prgrsStg } }),
                )}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>

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

      <div className="min-h-[100dvh]">
        {tab === 'detail' && <OvsOrderNtdcDtl detail={detail} />}
        {tab === 'cmdty' && <OvsOrderNtdcDtl_CmdtyList id={id} detail={detail} />}
      </div>

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsOrderNtdcDtlPage.displayName = 'OvsOrderNtdcDtlPage'
