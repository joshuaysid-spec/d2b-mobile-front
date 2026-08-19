// 대금청구상세(부대조달) — MUI-WM-01-M06 SbsdPrcmPymtClmDtl. 설계서 05.대금청구및사후 v0.83 slide46~54.
// P13 대금청구신청목록에서 대금청구서(부대) 카드 클릭 → /wm/sbsdPrcmPymtClmDtl 진입(식별자는 navigate state).
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T09 계약정보 · T10 대금신청업체정보 ·
//   T11 대금신청금액 · T12 첨부파일) — M05 셸 준용. 인쇄(R31/R32) 확인모달 스텁(slide54).
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { wmQueries } from '@/queries/bds/wm/queries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SbsdPrcmPymtClmDtl_Ctrt } from '@/ui/biz/wm/sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtl_Ctrt'
import { SbsdPrcmPymtClmDtl_PymtBzenty } from '@/ui/biz/wm/sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtl_PymtBzenty'
import { SbsdPrcmPymtClmDtl_PymtAply } from '@/ui/biz/wm/sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtl_PymtAply'
import { SbsdPrcmPymtClmDtl_Atch } from '@/ui/biz/wm/sbsdPrcmPymtClmDtl/SbsdPrcmPymtClmDtl_Atch'

// ── 탭 (slide47 탭 영역) ─────────────────────────────────────────────────────
const TABS: TabItem[] = [
  { value: 'ctrt', label: '계약정보' },
  { value: 'bzenty', label: '대금신청업체 정보' },
  { value: 'pymt', label: '대금신청 금액' },
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

export function SbsdPrcmPymtClmDtlPage() {
  const navigate = useNavigate()
  // 식별자는 목록에서 navigate state 로 전달(URL 노출 금지).
  const stateItem = useLocation().state as { id: string } | null
  const id = stateItem?.id ?? ''
  const [tab, setTab] = useState('ctrt')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [printModalOpen, setPrintModalOpen] = useState(false)

  const { data: detail } = wmQueries.useSelectSbsdPrcmPymtClmDtl(id)
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
          actions={
            // 인쇄(slide54) — 대금청구신청서(R31/R32) OZ 리포트 연계 스텁.
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setPrintModalOpen(true)} />
          }
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
        {tab === 'ctrt' && <SbsdPrcmPymtClmDtl_Ctrt detail={detail} />}
        {tab === 'bzenty' && <SbsdPrcmPymtClmDtl_PymtBzenty detail={detail} />}
        {tab === 'pymt' && <SbsdPrcmPymtClmDtl_PymtAply detail={detail} />}
        {tab === 'atch' && <SbsdPrcmPymtClmDtl_Atch adocs={detail.adocs} />}
      </div>

      <AlertModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[M06] 대금청구신청서 출력(R31/R32) OZ리포트 연계'),
        }}
      />

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
SbsdPrcmPymtClmDtlPage.displayName = 'SbsdPrcmPymtClmDtlPage'
