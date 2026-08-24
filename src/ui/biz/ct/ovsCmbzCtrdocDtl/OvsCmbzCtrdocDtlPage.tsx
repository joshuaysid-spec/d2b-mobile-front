// 상업계약서상세 (MUI-CT-01-M77 OvsCmbzCtrdocDtlPage). 설계서 03.계약 v0.83 slide178~184.
// 국외전자계약진행상세(M71) 바로가기 → /ct/ovsCmbzCtrdocDtl 진입(흐름도 slide147, 식별자는 navigate state).
// 탭 3개: 계약현황(T77 _Stts) · 계약명세서(T78 _Ctrt → P78 팝업) · 계약대상(T79 _Trgt).
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
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Button } from '@/ui/common/base/Button'
import { OvsCmbzCtrdocDtl_Stts } from '@/ui/biz/ct/ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Stts'
import { OvsCmbzCtrdocDtl_Ctrt } from '@/ui/biz/ct/ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Ctrt'
import { OvsCmbzCtrdocDtl_Trgt } from '@/ui/biz/ct/ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtl_Trgt'
import { OvsCmbzCtrtDtst } from '@/ui/biz/ct/ovsCmbzCtrdocDtl/OvsCmbzCtrtDtst'
import type { CtrtIntgListItem } from '@/types/ct'

// ── 탭 (slide178 탭바: 계약현황/계약명세서/계약대상) ───────────────────────────
const TABS: TabItem[] = [
  { value: 'stts', label: '계약현황' },
  { value: 'ctrt', label: '계약명세서' },
  { value: 'trgt', label: '계약대상' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function OvsCmbzCtrdocDtlPage() {
  const stateItem = useLocation().state as CtrtIntgListItem | null
  const id = stateItem?.id ?? ''
  const navigate = useNavigate()
  const [tab, setTab] = useState('stts')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [dtstOpen, setDtstOpen] = useState(false) // P78 상업계약서명세서
  const [outputModalOpen, setOutputModalOpen] = useState(false)

  const { data: detail } = ctQueries.useSelectCmbzCtrdocDtlInfo(id)
  const steps = stepsByStg('계약')

  // 식별자는 목록/상위 상세에서만 전달 — 직접 URL 진입(state 없음)은 목록으로 되돌린다.
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
          badges={[{ label: detail.taskSecd }, { label: detail.ctrtShpCd }]}
          subtitle={`공고번호 ${detail.pbancNo ?? '-'} / 계약번호 ${detail.ctrtNo}`}
          title={detail.itemNm}
          actions={
            // 출력 — 상업계약서출력물(UI-CT-01-R84, slide184)
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setOutputModalOpen(true)} />
          }
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '발주기관', value: detail.orderInstNm },
            { label: '계약금액', value: detail.summaryAmt },
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
        {tab === 'stts' && <OvsCmbzCtrdocDtl_Stts detail={detail} />}
        {tab === 'ctrt' && (
          <OvsCmbzCtrdocDtl_Ctrt id={id} onOpenDtst={() => setDtstOpen(true)} />
        )}
        {tab === 'trgt' && <OvsCmbzCtrdocDtl_Trgt id={id} />}
      </div>

      {/* FAB — 맨위로 */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />

      {/* 출력 — 상업계약서출력물(R84) OZ 리포트 스텁 */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-01-M77] 상업계약서 출력(R84) → OZ 리포트 호출'),
        }}
      />

      {/* P78 상업계약서명세서 — 계약명세서 탭 그룹 클릭 시(디자인 10020:154303 = 바텀시트) */}
      <BottomSheet
        open={dtstOpen}
        onOpenChange={setDtstOpen}
        title="계약명세서 상세"
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setDtstOpen(false)}>
            닫기
          </Button>
        }
      >
        <OvsCmbzCtrtDtst id={id} open={dtstOpen} />
      </BottomSheet>
    </div>
  )
}
OvsCmbzCtrdocDtlPage.displayName = 'OvsCmbzCtrdocDtlPage'
