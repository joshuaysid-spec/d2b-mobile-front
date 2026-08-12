// 대금청구 상세(중앙조달) — MUI-WM-01-M05 CenterPrcmPymtClmDtl. 설계서 05.대금청구및사후 v0.83 slide38~45.
// P13 대금청구신청목록에서 대금청구서 카드 클릭 → /wm/centerPrcmPymtClmDtl 진입(식별자는 navigate state).
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T05 계약정보 · T06 공급자정보 · T07 대금신청금액
//   · T08 세금계산서 · 진행상태(T23 공용)) — M02/M03 셸 준용. 안내문 버튼 → P09 풀팝업.
// 데이터: useCenterPrcmPymtClmDtl — 조회 완료까지 PageLoading.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useCenterPrcmPymtClmDtl } from '@/queries/wm'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { CenterPrcmPymtClmDtl_Ctrt } from '@/ui/biz/wm/centerPrcmPymtClmDtl/CenterPrcmPymtClmDtl_Ctrt'
import { CenterPrcmPymtClmDtl_Splr } from '@/ui/biz/wm/centerPrcmPymtClmDtl/CenterPrcmPymtClmDtl_Splr'
import { CenterPrcmPymtClmDtl_Pymt } from '@/ui/biz/wm/centerPrcmPymtClmDtl/CenterPrcmPymtClmDtl_Pymt'
import { CenterPrcmPymtClmDtl_Txiv } from '@/ui/biz/wm/centerPrcmPymtClmDtl/CenterPrcmPymtClmDtl_Txiv'
import { PymtClmGdntcFullPopup } from '@/ui/biz/wm/centerPrcmPymtClmDtl/PymtClmGdntcFullPopup'
import { PrpayDpsmnItrpyGiveStts } from '@/ui/biz/wm/prpayDpsmnItrpyGiveStts/PrpayDpsmnItrpyGiveStts'

// ── 탭 (slide38 탭 영역: 계약정보 · 공급자정보 · 대금신청금액 · 세금계산서 · 진행상태) ──
const TABS: TabItem[] = [
  { value: 'ctrt', label: '계약정보' },
  { value: 'splr', label: '공급자 정보' },
  { value: 'pymt', label: '대금신청 금액' },
  { value: 'txiv', label: '세금계산서' },
  { value: 'give', label: '진행상태' },
]

// ── 진행 단계 — 대금/사후 상세는 '대금청구' 단계 고정(M02/M03 과 동일). ──────
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('대금청구')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function CenterPrcmPymtClmDtlPage() {
  const navigate = useNavigate()
  // 식별자는 목록에서 navigate state 로 전달(URL 노출 금지).
  const stateItem = useLocation().state as { id: string } | null
  const id = stateItem?.id ?? ''
  const [tab, setTab] = useState('ctrt')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [gdntcOpen, setGdntcOpen] = useState(false) // P09 대금청구 안내문

  const { data: detail } = useCenterPrcmPymtClmDtl(id)
  const steps = buildSteps()

  if (!stateItem) return <Navigate to="/wm" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 대금 신청/청구는 PC 전용(slide38) */}
      <Notice type="urgent">대금 신청, 청구는 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소 + StepBar 접힘(M02/M03 과 동일 방식) */}
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
            // 공지사항(대금청구 안내문, MUI-WM-01-P09) — slide38 공지사항 버튼.
            <SummaryUtilButton icon="Campaign" label="안내문" onClick={() => setGdntcOpen(true)} />
          }
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '발주기관', value: detail.orderInstNm },
            { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원` },
          ]}
        />

        {/* 진행 단계 — 축소 시 함께 접힘 */}
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지) */}
      <div className="min-h-[100dvh]">
        {tab === 'ctrt' && <CenterPrcmPymtClmDtl_Ctrt detail={detail} />}
        {tab === 'splr' && <CenterPrcmPymtClmDtl_Splr detail={detail} />}
        {tab === 'pymt' && <CenterPrcmPymtClmDtl_Pymt detail={detail} />}
        {tab === 'txiv' && <CenterPrcmPymtClmDtl_Txiv detail={detail} />}
        {tab === 'give' && <PrpayDpsmnItrpyGiveStts id={id} />}
      </div>

      {/* 대금청구 안내문(MUI-WM-01-P09) 풀팝업 */}
      <PymtClmGdntcFullPopup open={gdntcOpen} onOpenChange={setGdntcOpen} />

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
CenterPrcmPymtClmDtlPage.displayName = 'CenterPrcmPymtClmDtlPage'
