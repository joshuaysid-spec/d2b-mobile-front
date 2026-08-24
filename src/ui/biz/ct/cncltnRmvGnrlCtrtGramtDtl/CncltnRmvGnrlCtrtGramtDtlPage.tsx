// 해지/해제 일반총액제계약 상세 (MUI-CT-03-M03). 설계서 03.계약 v0.83 slide115~122.
// 해지/해제 목록 카드(dtlRouteCd='gramt') 클릭 → /ct/cncltnRmvGnrlCtrtGramtDtl 진입(식별자는 navigate state).
// 탭 3개: 상세정보(T04 _Cn) · 계약명세서(T05 _Artcl) · 특수조건(T06 _Spcl).
// 데이터: ctQueries.useSelectCncltnRmvGnrlCtrtDtl(id, 'gramt') — 목업/실연동은 ctService(USE_MOCK)가 전환.
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
import { CncltnRmvGnrlCtrtGramtDtl_Cn } from '@/ui/biz/ct/cncltnRmvGnrlCtrtGramtDtl/CncltnRmvGnrlCtrtGramtDtl_Cn'
import { CncltnRmvGnrlCtrtGramtDtl_Artcl } from '@/ui/biz/ct/cncltnRmvGnrlCtrtGramtDtl/CncltnRmvGnrlCtrtGramtDtl_Artcl'
import { CncltnRmvGnrlCtrtGramtDtl_Spcl } from '@/ui/biz/ct/cncltnRmvGnrlCtrtGramtDtl/CncltnRmvGnrlCtrtGramtDtl_Spcl'
import type { CncltnRmvListItem } from '@/types/ct'

// ── 탭 (slide115 탭바: 상세정보/계약명세서/특수조건) ──────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'ctrt', label: '계약명세서' },
  { value: 'spcl', label: '특수조건' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function CncltnRmvGnrlCtrtGramtDtlPage() {
  const stateItem = useLocation().state as CncltnRmvListItem | null
  const id = stateItem?.id ?? ''
  const navigate = useNavigate()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [outputModalOpen, setOutputModalOpen] = useState(false)

  const { data: detail } = ctQueries.useSelectCncltnRmvGnrlCtrtDtl(id, 'gramt')
  const steps = stepsByStg('계약')

  // 식별자는 목록에서만 전달 — 직접 URL 진입(state 없음)은 목록으로 되돌린다.
  if (!stateItem) return <Navigate to="/ct/cncltn" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <Notice type="urgent">계약 진행, 정보 등록 변경은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { label: detail.taskSecd },
            { label: detail.bidMthdCd },
            { label: detail.ctrtStatNm ?? '' },
          ].filter((b) => b.label)}
          subtitle={`공고번호 ${detail.pbancNo} / 계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.rprsItemNm}
          actions={
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setOutputModalOpen(true)} />
          }
          rows={[
            { label: '해지해제일자', value: detail.cncltnRmvYmd },
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

      {/* 탭 콘텐츠 */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <CncltnRmvGnrlCtrtGramtDtl_Cn detail={detail} />}
        {tab === 'ctrt' && <CncltnRmvGnrlCtrtGramtDtl_Artcl id={id} />}
        {tab === 'spcl' && <CncltnRmvGnrlCtrtGramtDtl_Spcl id={id} />}
      </div>

      {/* FAB — 맨위로 */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />

      {/* 출력 — 서류 출력 확인 모달(OZ 리포트 스텁) */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-03-M03] 해지/해제 총액제계약서 출력 → OZ 리포트 호출'),
        }}
      />
    </div>
  )
}
CncltnRmvGnrlCtrtGramtDtlPage.displayName = 'CncltnRmvGnrlCtrtGramtDtlPage'
