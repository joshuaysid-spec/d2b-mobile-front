// 대금청구상세(기성대가) — MUI-WM-01-M08 PxcndCstPymtClmDtl. 설계서 05.대금청구및사후 v0.83 slide61~68.
// P13 대금청구신청목록에서 대금청구서(기성대가) 카드 클릭 → /wm/pxcndCstPymtClmDtl 진입(식별자는 navigate state).
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T16 계약정보 · T17 기성대가신청금액 ·
//   T18 세금계산서 · T19 첨부파일) — M05/M06 셸 준용.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { wmQueries } from '@/queries/bds/wm/wmQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { PxcndCstPymtClmDtl_Ctrt } from '@/ui/biz/wm/pxcndCstPymtClmDtl/PxcndCstPymtClmDtl_Ctrt'
import { PxcndCstPymtClmDtl_PxcndPymt } from '@/ui/biz/wm/pxcndCstPymtClmDtl/PxcndCstPymtClmDtl_PxcndPymt'
import { PxcndCstPymtClmDtl_Txiv } from '@/ui/biz/wm/pxcndCstPymtClmDtl/PxcndCstPymtClmDtl_Txiv'
import { PxcndCstPymtClmDtl_Atch } from '@/ui/biz/wm/pxcndCstPymtClmDtl/PxcndCstPymtClmDtl_Atch'

// ── 탭 (slide62 탭 영역) ─────────────────────────────────────────────────────
const TABS: TabItem[] = [
  { value: 'ctrt', label: '계약정보' },
  { value: 'pymt', label: '기성대가 신청금액' },
  { value: 'txiv', label: '세금계산서' },
  { value: 'atch', label: '첨부파일' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('대금청구')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function PxcndCstPymtClmDtlPage() {
  const navigate = useNavigate()
  // 식별자는 목록에서 navigate state 로 전달(URL 노출 금지).
  const stateItem = useLocation().state as { id: string } | null
  const id = stateItem?.id ?? ''
  const [tab, setTab] = useState('ctrt')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  const { data: detail } = wmQueries.useSelectPxcndCstPymtClmDtl(id)
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
        {tab === 'ctrt' && <PxcndCstPymtClmDtl_Ctrt detail={detail} />}
        {tab === 'pymt' && <PxcndCstPymtClmDtl_PxcndPymt detail={detail} />}
        {tab === 'txiv' && <PxcndCstPymtClmDtl_Txiv detail={detail} />}
        {tab === 'atch' && <PxcndCstPymtClmDtl_Atch adocs={detail.adocs} />}
      </div>

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
PxcndCstPymtClmDtlPage.displayName = 'PxcndCstPymtClmDtlPage'
