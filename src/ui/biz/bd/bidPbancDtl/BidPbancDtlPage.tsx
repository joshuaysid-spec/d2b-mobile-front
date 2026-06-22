// 입찰공고 상세 (MUI-BD-01-M07~M12, Figma 9300-37570). 목록 카드 클릭 → /bd/:id 진입.
// 레퍼런스: 조달계획 상세 PrcmPlanDtlPage (요약정보+스텝바+탭+탭콘텐츠 동일 패턴).
// 구성: 요약정보(SummaryInfo) + 스텝바(StepBar, 입찰 진행) + 탭(6개) + 탭 콘텐츠(탭별 컴포넌트 분리)
//   + 플로팅 버튼(맨위로 / + → 바로가기 바텀시트).
// 데이터는 목업 — 추후 bdService.getDetail. 헤더(뒤로/타이틀)는 전역 Header(AppLayout) 담당.
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Button } from '@/ui/common/base/Button'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { BidPbancDtl } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl'
import { BidPbancDtl_Tacpg02 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg02'
import { BidPbancDtl_Tacpg03 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg03'
import { BidPbancDtl_Tacpg04 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg04'
import { BidPbancDtl_Tacpg06 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg06'
import { BidPbancDtl_Tacpg07 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg07'

// ── 탭 (설계서 2.1 화면목록) ─────────────────────────────────────────────────
//  일반정보(고정) · 기초예비가격(경쟁입찰) · 품목명세서(업무구분 물품) · 계약특수조건 · 공고문안 · 입찰진행현황
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'tacpg02', label: '기초예비가격' },
  { value: 'tacpg03', label: '품목명세서' },
  { value: 'tacpg04', label: '계약특수조건' },
  { value: 'tacpg06', label: '공고문안' },
  { value: 'tacpg07', label: '입찰진행현황' },
]

function renderTabContent(tab: string) {
  switch (tab) {
    case 'general':
      return <BidPbancDtl />
    case 'tacpg02':
      return <BidPbancDtl_Tacpg02 />
    case 'tacpg03':
      return <BidPbancDtl_Tacpg03 />
    case 'tacpg04':
      return <BidPbancDtl_Tacpg04 />
    case 'tacpg06':
      return <BidPbancDtl_Tacpg06 />
    case 'tacpg07':
      return <BidPbancDtl_Tacpg07 />
    default:
      return null
  }
}

// ── 진행 단계 — 입찰 진행 중 ────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { label: '조달', state: 'done' },
  { label: '입찰', state: 'doing' },
  { label: '계약', state: 'todo' },
  { label: '이행', state: 'todo' },
  { label: '대금청구', state: 'todo' },
]

// ── 요약정보 (목업 — 설계서 slide26) ─────────────────────────────────────────
const SUMMARY_ROWS: SummaryInfoRow[] = [
  { label: '공고일자', value: '2025-12-22' },
  { label: '입찰참가신청 마감일시', value: '2025-12-23 17:00' },
  { label: '입찰서제출마감일시', value: '2025-12-24 10:00' },
  { label: '개찰일시', value: '2025-12-24 10:30' },
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

export function BidPbancDtlPage() {
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트(9300-36775)

  const { id } = useParams()
  useEffect(() => {
    console.log('[BidDetail] 입찰공고 상세 조회', id) // 추후 API: bdService.getDetail(id)
  }, [id])

  // 바로가기 바텀시트 항목 (Figma 9300-36775) — 각 신청서 작성/환율정보 이동(스텁).
  const shortcutItems = [
    { id: 'pq', label: '사전심사(PQ)신청서 작성하기' },
    { id: 'bid', label: '입찰서(견적서) 작성하기' },
    { id: 'apply', label: '입찰참가신청서 작성하기' },
    { id: 'giveup', label: '입찰포기 신청서 작성하기' },
    { id: 'cancel', label: '입찰취소 신청서 작성하기' },
    { id: 'fx', label: '환율정보 바로가기' },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소(infolist 숨김). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: '물품' }, { label: '경쟁입찰' }]}
          subtitle="긴급공고 LDG0097-1"
          title="특수작전용대물타격무인항공기"
          actions={
            <>
              <SummaryUtilButton
                icon="StarBorder"
                label="즐겨찾기"
                onClick={() => console.log('[BidDetail] 즐겨찾기')}
              />
              <SummaryUtilButton
                icon="Print"
                label="출력"
                onClick={() => console.log('[BidDetail] 출력')}
              />
            </>
          }
          rows={SUMMARY_ROWS}
        />

        {/* 진행 단계 — 스크롤 축소 시 함께 접힘 */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
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
      {renderTabContent(tab)}

      {/* 플로팅 버튼 — 맨위로(항상) + 바로가기(+) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 (9300-36775) — 컨테이너는 페이지가 직접 조립, NavigationItemList 슬롯 */}
      <BottomSheet
        open={shortcutOpen}
        onOpenChange={setShortcutOpen}
        title="바로가기"
        footer={
          <Button variant="primary" className="w-full" onClick={() => setShortcutOpen(false)}>
            확인
          </Button>
        }
      >
        <NavigationItemList
          items={shortcutItems.map((it) => ({
            id: it.id,
            label: it.label,
            onClick: () => {
              console.log('[BidDetail] 바로가기', it.id) // 추후: 각 신청서 작성/환율정보 화면 이동
              setShortcutOpen(false)
            },
          }))}
        />
      </BottomSheet>
    </div>
  )
}
