// 공사계약서상세 (MUI-CT-01-M10). 설계서 03.계약 v0.83 slide69~75.
// 계약통합목록 카드(공사 계약확정) 클릭 → /ct/cstrnCtrdocDtl 진입(식별자는 navigate state).
// 탭 3개: 상세정보(T19 _Cn) · 하자담보책임(T20 _Flw) · 연대보증(T21 _Grnte).
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { CstrnCtrdocDtl_Cn } from '@/ui/biz/ct/cstrnCtrdocDtl/CstrnCtrdocDtl_Cn'
import { CstrnCtrdocDtl_Grnte } from '@/ui/biz/ct/cstrnCtrdocDtl/CstrnCtrdocDtl_Grnte'
import { CstrnCtrdocDtl_Flw } from '@/ui/biz/ct/cstrnCtrdocDtl/CstrnCtrdocDtl_Flw'
import type { MockCtrtIntgListItem } from '@/types/mock/ct'

// ── 탭 (slide69 탭바: 상세정보/하자담보책임/연대보증) ──────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'flw', label: '하자담보책임' },
  { value: 'grnte', label: '연대보증' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function CstrnCtrdocDtlPage() {
  const stateItem = useLocation().state as MockCtrtIntgListItem | null
  const id = stateItem?.id ?? ''
  const navigate = useNavigate()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [outputModalOpen, setOutputModalOpen] = useState(false)

  const { data: detail } = ctQueries.useSelectCstrnCtrdocDtl(id)
  const steps = stepsByStg('계약')

  // 식별자는 목록에서만 전달 — 직접 URL 진입(state 없음)은 목록으로 되돌린다.
  if (!stateItem) return <Navigate to="/ct" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <Notice type="urgent">계약 진행, 정보 등록 변경은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky(M03 과 동일 방식) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { label: detail.taskSecd },
            { label: detail.ctrtMthdCd },
            { label: detail.ctrtStatNm ?? '' },
          ].filter((b) => b.label)}
          subtitle={`공사번호 ${detail.prcmNo} / 계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.ctrtNm}
          actions={
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setOutputModalOpen(true)} />
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
                sheetItems={buildProgressSheet('계약', (substep, prgrsStg) =>
                  navigate('/anl-prgrs', { state: { substep, prgrsStg } }),
                )}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>

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

      {/* 탭 콘텐츠 — 하자담보책임(T20)은 전용 탭 컴포넌트(M09 와 동일 데이터영역, slide74 1.2) */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <CstrnCtrdocDtl_Cn detail={detail} />}
        {tab === 'flw' && <CstrnCtrdocDtl_Flw id={id} />}
        {tab === 'grnte' && <CstrnCtrdocDtl_Grnte id={id} />}
      </div>

      {/* FAB — 맨위로 */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />

      {/* 출력 — 공사도급계약서(R35)/기술용역계약서(R36) 출력물 OZ 리포트 스텁 */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-01-M10] 공사도급계약서 출력(R35/R36) → OZ 리포트 호출'),
        }}
      />
    </div>
  )
}
CstrnCtrdocDtlPage.displayName = 'CstrnCtrdocDtlPage'
