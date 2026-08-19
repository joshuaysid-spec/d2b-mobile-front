// 물품단가계약서상세 (MUI-CT-01-M08). 설계서 03.계약 v0.83 slide56~62.
// 총액제(M07 CmdtyGramtCtrdocDtlPage)와 3탭 셸이 동일하나, 설계서가 별도 화면ID(M08)·전용 파일로
// 정의하여 단가제 전용 컨테이너로 분리한다. 계약통합목록 카드(물품 계약최종 — 단가 계약서)
//   → /ct/cmdtyUntprcCtrdocDtl (식별자는 navigate state).
// 탭: 상세정보(T16 _Cn) · 계약명세서(T17 _Ctrt) · 특수조건(T18 _Spcl). 탭 콘텐츠 로직은 총액제와
//   동일 데이터영역이라 전용 탭 컴포넌트가 총액제 컴포넌트를 단일 소스로 재사용한다(로직 중복 방지).
// 데이터: ctQueries.useSelectCmdtyCtrdocDtl(id, 'untprc') — 목업/실연동은 ctService(USE_MOCK)가 전환. 목업은 mocks/ct.ts.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ctQueries } from '@/queries/bds/ct/ctQueries'
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
import { CmdtyUntprcCtrdocDtl_Cn } from '@/ui/biz/ct/cmdtyUntprcCtrdocDtl/CmdtyUntprcCtrdocDtl_Cn'
import { CmdtyUntprcCtrdocDtl_Ctrt } from '@/ui/biz/ct/cmdtyUntprcCtrdocDtl/CmdtyUntprcCtrdocDtl_Ctrt'
import { CmdtyUntprcCtrdocDtl_Spcl } from '@/ui/biz/ct/cmdtyUntprcCtrdocDtl/CmdtyUntprcCtrdocDtl_Spcl'
import type { CtrtIntgListItem } from '@/types/ct'

// ── 탭 (slide56 탭바: 상세정보/계약명세서/특수조건) ─────────────────────────────
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

export function CmdtyUntprcCtrdocDtlPage() {
  const stateItem = useLocation().state as CtrtIntgListItem | null
  const id = stateItem?.id ?? ''
  const navigate = useNavigate()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [outputModalOpen, setOutputModalOpen] = useState(false)

  const { data: detail } = ctQueries.useSelectCmdtyCtrdocDtl(id, 'untprc')
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
            { label: detail.bidMthdCd },
            { label: detail.ctrtMthdCd },
            { label: detail.ctrtStatNm ?? '' },
          ].filter((b) => b.label)}
          subtitle={`공고번호 ${detail.pbancNo} / 계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.rprsItemNm}
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

      {/* 탭 콘텐츠 */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <CmdtyUntprcCtrdocDtl_Cn detail={detail} />}
        {tab === 'ctrt' && <CmdtyUntprcCtrdocDtl_Ctrt id={id} />}
        {tab === 'spcl' && <CmdtyUntprcCtrdocDtl_Spcl id={id} />}
      </div>

      {/* FAB — 맨위로 */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />

      {/* 출력 — 물품구매계약서 출력물(R39~R42 계열) OZ 리포트 스텁 */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-01-M08] 물품단가계약서 출력 → OZ 리포트 호출'),
        }}
      />
    </div>
  )
}
CmdtyUntprcCtrdocDtlPage.displayName = 'CmdtyUntprcCtrdocDtlPage'
