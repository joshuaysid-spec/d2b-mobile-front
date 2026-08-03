// 대금청구상세(공사) — MUI-WM-01-M07 CstrnPymtClmDtl. 설계서 05.대금청구및사후 v0.83 slide55~60.
// P13 대금청구신청목록에서 대금청구서(공사) 카드 클릭 → /wm/pymt-clm/cstrn/:id 진입.
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T13 계약정보 · T14 대가지급업체 · T15 첨부파일)
//   — M05/M06 셸 준용.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useCstrnPymtClmDtl } from '@/queries/wm'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { CstrnPymtClmDtl_Ctrt } from '@/ui/biz/wm/cstrnPymtClmDtl/CstrnPymtClmDtl_Ctrt'
import { CstrnPymtClmDtl_GiveBzenty } from '@/ui/biz/wm/cstrnPymtClmDtl/CstrnPymtClmDtl_GiveBzenty'
import { CstrnPymtClmDtl_Atch } from '@/ui/biz/wm/cstrnPymtClmDtl/CstrnPymtClmDtl_Atch'

// ── 탭 (slide56 탭 영역) ─────────────────────────────────────────────────────
const TABS: TabItem[] = [
  { value: 'ctrt', label: '계약정보' },
  { value: 'bzenty', label: '대가지급업체' },
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

export function CstrnPymtClmDtlPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const [tab, setTab] = useState('ctrt')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  const { data: detail } = useCstrnPymtClmDtl(id)
  const steps = buildSteps()

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
        {tab === 'ctrt' && <CstrnPymtClmDtl_Ctrt detail={detail} />}
        {tab === 'bzenty' && <CstrnPymtClmDtl_GiveBzenty detail={detail} />}
        {tab === 'atch' && <CstrnPymtClmDtl_Atch adocs={detail.adocs} />}
      </div>

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
CstrnPymtClmDtlPage.displayName = 'CstrnPymtClmDtlPage'
