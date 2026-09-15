// 물품수정계약서상세 (MUI-CT-01-M06). 설계서 03.계약 v0.83 slide76~82.
// 계약통합목록 카드(물품 '계약수정') 클릭 → /ct/cmdtyMdfcnCtrdocDtl 진입(식별자는 navigate state).
// 탭 3개: 상세정보(T22 _Cn) · 수정계약명세서(T23 _MdfcnCtrt) · 특수조건(T24 _Spcl).
// FAB '+' 바로가기 → 계약명세서 조회(P13 물품수정계약명세서) + 출력.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Button } from '@/ui/common/base/Button'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { OzReportFullPopup } from '@/ui/biz/cm/ozReport/OzReportFullPopup'
import { useOzReport } from '@/ui/biz/cm/ozReport/useOzReport'
import { CmdtyMdfcnCtrdocDtl_Cn } from '@/ui/biz/ct/cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtl_Cn'
import { CmdtyMdfcnCtrdocDtl_MdfcnCtrt } from '@/ui/biz/ct/cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtl_MdfcnCtrt'
import { CmdtyMdfcnCtrdocDtl_Spcl } from '@/ui/biz/ct/cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtl_Spcl'
import { CmdtyMdfcnCtrdocDtstFullPopup } from '@/ui/biz/ct/cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtstFullPopup'
import type { MockCtrtIntgListItem } from '@/types/mock/ct'

// ── 탭 (slide76 탭바: 상세정보/수정계약명세서/특수조건) ────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'mdfcnCtrt', label: '수정계약명세서' },
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

export function CmdtyMdfcnCtrdocDtlPage() {
  const stateItem = useLocation().state as MockCtrtIntgListItem | null
  const id = stateItem?.id ?? ''
  const navigate = useNavigate()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기
  const [dtstOpen, setDtstOpen] = useState(false) // P13 물품수정계약명세서
  const [outputModalOpen, setOutputModalOpen] = useState(false)
  const oz = useOzReport()

  const { data: detail } = ctQueries.useSelectCmdtyMdfcnCtrdocDtl(id)
  const steps = stepsByStg('계약')

  // 식별자는 목록에서만 전달 — 직접 URL 진입(state 없음)은 목록으로 되돌린다.
  if (!stateItem) return <Navigate to="/ct" replace />
  if (!detail) return <PageLoading />

  const openFromSheet = (open: (v: boolean) => void) => {
    setShortcutOpen(false)
    open(true)
  }

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
          // 공고번호(slide76 문서정보) — 설계서 항목표 미정의 임시 키(pbancNo). 없으면 계약번호만.
          subtitle={
            detail.pbancNo
              ? `공고번호 ${detail.pbancNo} / 계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`
              : `계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`
          }
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
        {tab === 'detail' && <CmdtyMdfcnCtrdocDtl_Cn detail={detail} />}
        {tab === 'mdfcnCtrt' && <CmdtyMdfcnCtrdocDtl_MdfcnCtrt id={id} />}
        {tab === 'spcl' && <CmdtyMdfcnCtrdocDtl_Spcl id={id} />}
      </div>

      {/* FAB — 맨위로 + '+' 바로가기(상세정보 탭) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={tab === 'detail' ? () => setShortcutOpen(true) : undefined}
        plusLabel="바로가기"
      />

      {/* 바로가기 — 계약명세서 조회(수정계약 → P13 물품수정계약명세서) */}
      <BottomSheet
        open={shortcutOpen}
        onOpenChange={setShortcutOpen}
        title="바로가기"
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setShortcutOpen(false)}>
            확인
          </Button>
        }
      >
        <NavigationItemList
          items={[
            { id: 'dtst', label: '계약명세서 조회', onClick: () => openFromSheet(setDtstOpen) },
          ]}
        />
      </BottomSheet>

      {/* 출력 — 물품수정계약서(방위사업청) 출력물(R43, slide23) → OZ 리포트 뷰어(실연동은 OzReportFullPopup 안에서) */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () =>
            oz.open('R43', { ctrtNo: detail.ctrtNo, ctrtCycl: detail.ctrtCycl }, '물품수정계약서'),
        }}
      />
      <OzReportFullPopup {...oz.popupProps} />

      {/* P13 물품수정계약명세서 */}
      <CmdtyMdfcnCtrdocDtstFullPopup id={id} open={dtstOpen} onOpenChange={setDtstOpen} />
    </div>
  )
}
CmdtyMdfcnCtrdocDtlPage.displayName = 'CmdtyMdfcnCtrdocDtlPage'
