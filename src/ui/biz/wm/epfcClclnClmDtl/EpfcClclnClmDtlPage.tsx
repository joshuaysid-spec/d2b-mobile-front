// 사후정산청구상세 — MUI-WM-01-M13 EpfcClclnClm. 설계서 05.대금청구및사후 v0.83 slide72~79.
// P13 대금청구신청목록에서 사후정산청구서 카드 클릭 → /wm/epfcClclnClmDtl 진입(식별자는 navigate state).
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T20 계약정보 · T21 신청내역 · T22 세금계산서
//   · 진행상태(T23 공용)) — M02/M05 셸 준용.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { wmQueries } from '@/queries/bds/wm/queries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { EpfcClclnClmDtl_CN } from '@/ui/biz/wm/epfcClclnClmDtl/EpfcClclnClmDtl_CN'
import { EpfcClclnClmDtl_AplyAmt } from '@/ui/biz/wm/epfcClclnClmDtl/EpfcClclnClmDtl_AplyAmt'
import { EpfcClclnClmDtl_Txiv } from '@/ui/biz/wm/epfcClclnClmDtl/EpfcClclnClmDtl_Txiv'
import { PrpayDpsmnItrpyGiveStts } from '@/ui/biz/wm/prpayDpsmnItrpyGiveStts/PrpayDpsmnItrpyGiveStts'

// ── 탭 (slide73 탭 영역: 계약정보 · 신청내역 · 세금계산서 · 진행상태) ────────
const TABS: TabItem[] = [
  { value: 'ctrt', label: '계약정보' },
  { value: 'aply', label: '신청내역' },
  { value: 'txiv', label: '세금계산서' },
  { value: 'give', label: '진행상태' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('대금청구')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function EpfcClclnClmDtlPage() {
  const navigate = useNavigate()
  // 식별자는 목록에서 navigate state 로 전달(URL 노출 금지).
  const stateItem = useLocation().state as { id: string } | null
  const id = stateItem?.id ?? ''
  const [tab, setTab] = useState('ctrt')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  const { data: detail } = wmQueries.useSelectEpfcClclnClmDtl(id)
  const steps = buildSteps()

  if (!stateItem) return <Navigate to="/wm" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <Notice type="urgent">대금 신청, 청구는 PC 버전에서 가능합니다.</Notice>

      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.taskSeCd }, { label: detail.ctrtMthdCd }].filter(
            (b) => b.label,
          )}
          subtitle={`계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.ctrtNm}
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '발주기관', value: detail.orderInstNm },
            { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원` },
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
                sheetItems={buildProgressSheet('대금청구', (substep, prgrsStg) =>
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
        {tab === 'ctrt' && <EpfcClclnClmDtl_CN detail={detail} />}
        {tab === 'aply' && <EpfcClclnClmDtl_AplyAmt detail={detail} />}
        {tab === 'txiv' && <EpfcClclnClmDtl_Txiv detail={detail} />}
        {tab === 'give' && <PrpayDpsmnItrpyGiveStts id={id} />}
      </div>

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
EpfcClclnClmDtlPage.displayName = 'EpfcClclnClmDtlPage'
