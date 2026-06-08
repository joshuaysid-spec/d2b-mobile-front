// 조달계획 상세 (MUI-OP-01-M03, Figma 9300-37444). 카드 클릭 → /op/:id 진입.
// 구성(Figma contents area): 요약정보(SummaryInfo) + 스텝바(StepBar) + 탭(TabList)
//   + 탭 콘텐츠(탭별 컴포넌트 분리: PrcmPlanDtl / PrcmPlanDtl_PrdList / PrcmPlanDtl_OpnnList / PrcmPlanDtl_spclCtrt / PrcmPlanDtl_Doc).
// 데이터는 목업 — 추후 API(opService.getDetail)로 대체.
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout) 담당이라 본문은 콘텐츠만 렌더.
import { useState } from 'react'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { PrcmPlan_NotiAplySheet } from '@/ui/biz/op/prcmPlanDtl/PrcmPlan_NotiAplySheet'
import { PrcmPlanDtl } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl'
import { PrcmPlanDtl_PrdList } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_PrdList'
import { PrcmPlanDtl_OpnnList } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_OpnnList'
import { PrcmPlanDtl_spclCtrt } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_spclCtrt'
import { PrcmPlanDtl_Doc } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_Doc'

// ── 탭 (Figma m_tab) ──────────────────────────────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세내용' },
  { value: 'item', label: '품목명세서' },
  { value: 'opinion', label: '업체의견' },
  { value: 'contract', label: '계약특수조건' },
  { value: 'file', label: '첨부파일' },
]

// 탭 value → 콘텐츠 컴포넌트
function renderTabContent(tab: string) {
  switch (tab) {
    case 'detail':
      return <PrcmPlanDtl />
    case 'item':
      return <PrcmPlanDtl_PrdList />
    case 'opinion':
      return <PrcmPlanDtl_OpnnList />
    case 'contract':
      return <PrcmPlanDtl_spclCtrt />
    case 'file':
      return <PrcmPlanDtl_Doc />
    default:
      return null
  }
}

// ── 진행 단계 (Figma m_stepbar_horizontal_1depth) — 조달 진행 중 ──────────────
const STEPS: StepItem[] = [
  { label: '조달', state: 'doing' },
  { label: '입찰', state: 'todo' },
  { label: '계약', state: 'todo' },
  { label: '이행', state: 'todo' },
  { label: '대금청구', state: 'todo' },
]

// ── 요약정보 (목업) ────────────────────────────────────────────────────────
const SUMMARY_ROWS: SummaryInfoRow[] = [
  { label: '발주예정월', value: '2026-03' },
  { label: '발주기관', value: '화력총괄계약팀' },
  { label: '계약방법', value: '총액제' },
  { label: '예산금액', value: '11,616,000 원' },
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

export function PrcmPlanDtlPage() {
  const [tab, setTab] = useState('detail')
  // 스크롤 시 상단 블록(요약+스텝+탭) 축소 + sticky 동작 — 로직은 훅에서. (overflow-anchor 진동방지 포함)
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()
  const [outputOpen, setOutputOpen] = useState(false) // + 버튼 → 출력물 바텀시트(P17)
  const [notifyOpen, setNotifyOpen] = useState(false) // 알림 아이콘 → 알림신청 바텀시트(P10)

  // 출력 버튼 — 서류 출력 확인 모달(MUI-BD-01-P14) 표시. 확인 시 OZ 리포트 호출(콘솔 스텁).
  const [outputModalOpen, setOutputModalOpen] = useState(false)
  const handleOutput = () => setOutputModalOpen(true)

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보가 축소(infolist 숨김)되며 높이 감소. */}
      <div className="sticky top-0 z-20 bg-white">
        <SummaryInfo
          collapsed={collapsed}
          badges={
            <>
              <Badge type="pastel" color="blue">
                물품
              </Badge>
              <Badge type="pastel" color="blue">
                수의계약
              </Badge>
            </>
          }
          subtitle="판단번호 6000A"
          title="'26년 K5방독면"
          actions={
            <>
              <SummaryUtilButton
                icon="NotificationAdd"
                label="알림 신청"
                onClick={() => setNotifyOpen(true)}
              />
              <SummaryUtilButton icon="Print" label="출력" onClick={handleOutput} />
            </>
          }
          rows={SUMMARY_ROWS}
        />

        {/* 진행 단계 */}
        <div className="px-4 py-4">
          <StepBar orientation="horizontal" items={STEPS} />
        </div>

        {/* 탭 */}
        <div className="px-4">
          <TabList value={tab} onChange={setTab} items={TABS} />
        </div>
      </div>

      {/* 탭 콘텐츠 (탭별 컴포넌트) */}
      {renderTabContent(tab)}

      {/* 알림 아이콘 → 입찰공고 알림신청 바텀시트 (P10) */}
      <PrcmPlan_NotiAplySheet open={notifyOpen} onOpenChange={setNotifyOpen} />

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
          onClick: () => console.log('[출력] 서류 출력 확인 → OZ 리포트 호출 (loginYn = y 상태)'),
        }}
      />

      {/* 플로팅 버튼 — 맨위로(항상) + 추가(품목명세서 탭: 출력물 바텀시트) */}
      <FloatingActionButton
        className="fixed bottom-20 right-4 z-40"
        onTop={scrollToTop}
        onPlus={tab === 'item' ? () => setOutputOpen(true) : undefined}
        plusLabel="출력물"
      />

      {/* + 출력물 바텀시트 (MUI-BD-01-P17) — 출력물 명칭 버튼(품목명세서 출력 → OZ리포트 R10 연계 스텁).
          액션 버튼은 footer 슬롯에 배치(스크롤 본문의 overflow 클리핑으로 하단 border 잘리는 문제 방지). */}
      <BottomSheet
        open={outputOpen}
        onOpenChange={setOutputOpen}
        title="출력물"
        footer={
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              console.log('[M04] 품목명세서 출력(R10) OZ리포트 연계')
              setOutputOpen(false)
            }}
          >
            품목명세서 출력
          </Button>
        }
      />
    </div>
  )
}
