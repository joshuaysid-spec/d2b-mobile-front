// 국외 조달계획 상세 (MUI-OP-01-M73, ovsPrcmPlanDtl). 통합목록에서 국외(taskSeNm='국외') 카드 진입.
// 국내 조달계획상세(M03)와 셸은 동일(요약+스텝+탭+useCollapsibleHeader)하나 탭이 다름:
//   2탭(집행계획상세 M73 / 결과목록 M74). 업무구분·품목명세서·계약특수조건·업체의견·첨부서류·알림신청 없음.
// 국외 전용 팝업(품목별가격자료 P75 / 목록정보조회 P76·P77)은 추후. 데이터는 목업.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import type { OpPlanItem } from '@/types/op'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { OvsPrcmPlanDtl } from '@/ui/biz/op/ovsPrcmPlanDtl/OvsPrcmPlanDtl'
import { OvsPrcmPlanDtl_RsltList } from '@/ui/biz/op/ovsPrcmPlanDtl/OvsPrcmPlanDtl_RsltList'

// ── 탭 (국외 — 집행계획상세 M73 / 결과목록 M74) ──────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '집행계획상세' },
  { value: 'result', label: '결과목록' },
]

function renderTabContent(tab: string) {
  switch (tab) {
    case 'detail':
      return <OvsPrcmPlanDtl />
    case 'result':
      return <OvsPrcmPlanDtl_RsltList />
    default:
      return null
  }
}

// ── 진행 단계 ──────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { label: '조달', state: 'doing' },
  { label: '입찰', state: 'todo' },
  { label: '계약', state: 'todo' },
  { label: '이행', state: 'todo' },
  { label: '대금청구', state: 'todo' },
]

// ── 요약정보 (목업) ────────────────────────────────────────────────────────
const SUMMARY_ROWS: SummaryInfoRow[] = [
  { label: '지시년도', value: '2026' },
  { label: '발주기관', value: '해외조달팀' },
  { label: '계약방법', value: '일반경쟁' },
  { label: '지시예산(USD)', value: '$ 540,000.00' },
]

export function OvsPrcmPlanDtlPage() {
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 출력 버튼 — 서류 출력 확인 모달(MUI-BD-01-P14).
  const [outputModalOpen, setOutputModalOpen] = useState(false)
  const handleOutput = () => setOutputModalOpen(true)

  // 통합목록에서 국외 카드 클릭 시 navigate(state)로 넘어온 항목(OpPlanItem). 백엔드 미연동.
  //   국외 요약 전용필드(지시예산 USD·조달요구번호 등)는 통합목록 아이템에 없어 페이지 목업으로 보완.
  const passed = useLocation().state as OpPlanItem | null

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소. */}
      {/* 축소(collapsed=위에 붙음) 시 하단(=TabList 아래) 1px #D1D7E0 divider 노출.
          항상 border-b 를 두되 색만 transparent↔divider 로 전환(1px 점프 방지 + transition). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: '국외' }, { label: passed?.ctrtMthdCd ?? '일반경쟁' }]}
          subtitle="조달요구번호 A-2026-0001"
          title={passed?.prcmPlanNm ?? "'26년 야간투시경 해외구매"}
          actions={
            // 국외(M73)은 알림신청 없음 — 출력만.
            <SummaryUtilButton icon="Print" label="출력" onClick={handleOutput} />
          }
          rows={SUMMARY_ROWS}
        />

        {/* 진행 단계 — 스크롤 축소(collapsed) 시 StepBar 도 함께 접힘(grid-rows 0fr 전환, SummaryInfo 와 동일 방식). */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none ${
            collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 py-4">
              <StepBar orientation="horizontal" items={STEPS} sheetItems={buildProgressSheet('조달')} />
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="px-4">
          {/* 탭 전환 시 본문을 맨 위로 — 단, 접힘(collapsed) 상태였으면 헤더는 접힌 채 유지(goToContentTop). */}
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(상단 튕김 진동 방지, bd 상세와 동일) */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 출력 — 서류 출력 확인 모달 (MUI-BD-01-P14) */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[출력] 국외 서류 출력 확인 → OZ 리포트 호출'),
        }}
      />

      {/* 플로팅 버튼 — 맨위로 */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsPrcmPlanDtlPage.displayName = 'OvsPrcmPlanDtlPage'
