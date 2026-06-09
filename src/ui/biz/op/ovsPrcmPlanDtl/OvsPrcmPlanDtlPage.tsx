// 국외 조달계획 상세 (MUI-OP-01-M73, ovsPrcmPlanDtl). 통합목록에서 국외(taskSeNm='국외') 카드 진입.
// 국내 조달계획상세(M03)와 셸은 동일(요약+스텝+탭+useCollapsibleHeader)하나 탭이 다름:
//   2탭(집행계획상세 M73 / 결과목록 M74). 업무구분·품목명세서·계약특수조건·업체의견·첨부서류·알림신청 없음.
// 국외 전용 팝업(품목별가격자료 P75 / 목록정보조회 P76·P77)은 추후. 데이터는 목업.
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Badge } from '@/ui/common/base/Badge'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { opService } from '@/services/op'
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

// 요약정보 액션 슬롯용 유틸 아이콘 버튼 (37×37, border)
function SummaryUtilButton({
  icon,
  label,
  onClick,
}: {
  icon: IconName
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
    >
      <Icon name={icon} size={24} aria-hidden />
    </button>
  )
}

export function OvsPrcmPlanDtlPage() {
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()

  // 출력 버튼 — 서류 출력 확인 모달(MUI-BD-01-P14).
  const [outputModalOpen, setOutputModalOpen] = useState(false)
  const handleOutput = () => setOutputModalOpen(true)

  // 국외 조달계획 상세 조회(스텁). 통합목록에서 국외 카드로만 진입한다.
  const { id } = useParams()
  useEffect(() => {
    opService.getOverseasPlanDetail(id ?? '')
  }, [id])

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소. */}
      <div className="sticky top-0 z-20 bg-white">
        <SummaryInfo
          collapsed={collapsed}
          badges={
            <>
              <Badge type="pastel" color="blue">
                국외
              </Badge>
              <Badge type="pastel" color="blue">
                일반경쟁
              </Badge>
            </>
          }
          subtitle="조달요구번호 A-2026-0001"
          title="'26년 야간투시경 해외구매"
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
              <StepBar orientation="horizontal" items={STEPS} />
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="px-4">
          <TabList value={tab} onChange={setTab} items={TABS} />
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {renderTabContent(tab)}

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
      <FloatingActionButton className="fixed bottom-20 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsPrcmPlanDtlPage.displayName = 'OvsPrcmPlanDtlPage'
