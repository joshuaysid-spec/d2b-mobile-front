// MUI-CM-06-M02 나의진행업무현황 (MyPrgrsHstryPage). 설계서 00.공통 v0.84 slide78. **디자인 없음 → 기존 공통 재사용.**
// 진행중인 업무(입찰참가신청/적격심사 등) 목록. 셸 안 + sub헤더(뒤로+타이틀 '나의 진행 업무 현황'). 3뎁스라 BottomNav 숨김.
//
// 구성: 상단바(표시개수 셀렉트 — 검색필터 삭제됨, slide78 2026-07-08) → 카드 리스트(공통 Card: 진행상태/업무/계약 배지
//   + 판단번호 + 공고명 + 신청일시 + [진행 단계 보기][바로가기] 버튼) → 더보기 → 맨위로 FAB.
//   [진행 단계 보기] → 세부 스텝 팝업(P03, MyPrgrsHstryDtl) BottomSheet(컨테이너/footer 는 이 페이지가 소유).
//
// 데이터=파일 내 목업(설계서 slide78 형식), 동작=API 경계 스텁(console.log + '// 추후 …').
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import type { StepItem, StepState } from '@/ui/common/composites/StepBar'
import { MyPrgrsHstryDtl } from '@/ui/biz/cm/myPrgrsHstryDtl/MyPrgrsHstryDtl'
import type { MyPrgrsHstryItem } from '@/types/cm'

// 진행 단계 라벨(고정 순서) — 세부 스텝 팝업(P03)의 StepBar 구동값. 아이템의 currentStage 로 done/doing/todo 결정.
const STAGES = ['조달계획', '입찰공고', '입찰진행', '개찰', '계약', '이행', '대금청구'] as const

// ── 목업 (설계서 slide78 예시/형식) ──────────────────────────────────────────
const TOTAL = 99 // 총 건수(목업 — slide78 총 99건 / 더보기 10/258 은 예시라 총건수 99 채택)
const dl_myPrgrsList: MyPrgrsHstryItem[] = [
  {
    id: '1',
    prcmNo: '6000A',
    bidNm: "'26년 K5방독면",
    aplyDt: '2026-03-30 16:30',
    prgrsSttsNm: '입찰참가신청',
    taskSeNm: '물품',
    ctrtMthd: '수의계약',
    currentStage: '입찰진행',
  },
  {
    id: '2',
    prcmNo: '2026-00590',
    bidNm: '26-평 절개지 복구공사',
    aplyDt: '2026-03-15 11:30',
    prgrsSttsNm: '적격심사',
    taskSeNm: '공사',
    ctrtMthd: '제한경쟁',
    currentStage: '개찰',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 페이징 로직을 통째로 교체(myTaskService.getPrgrsList).
const MOCK_LIST: MyPrgrsHstryItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...dl_myPrgrsList[i % dl_myPrgrsList.length],
  id: String(i + 1),
}))

export function MyPrgrsHstryPage() {
  const navigate = useNavigate()
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // 세부 스텝 팝업(P03) — 대상 아이템 + 선택 단계. 컨테이너/footer 는 이 페이지가 소유.
  const [stepItem, setStepItem] = useState<MyPrgrsHstryItem | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const total = MOCK_LIST.length
  const loaded = Math.min(page * pageSize, total)
  const visible = useMemo(() => MOCK_LIST.slice(0, loaded), [loaded])

  // ── 동작 스텁 ──
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[MyPrgrsHstry] pageSize →', size) // 추후: myTaskService.getPrgrsList(...)
  }
  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[MyPrgrsHstry] loadMore')
  }
  const handleShowSteps = (item: MyPrgrsHstryItem) => {
    setSelectedStage(null)
    setStepItem(item)
  }
  const handleGoto = (item: MyPrgrsHstryItem) => {
    // 공고 바로가기 → 입찰진행 상세(MUI-BD-03-M02, /bd/prgrs/:id).
    // ⚠️ 진행업무현황 아이템(MyPrgrsHstryItem)은 입찰진행 상세가 기대하는 BidPrgrsItem 형태가 아니라,
    //    navigate state 로 넘기면 상단 요약이 빈 값으로 깨진다(상세는 state 를 BidPrgrsItem 으로 캐스팅).
    //    → state 없이 이동해 상세 페이지의 fallback 목업으로 정상 렌더한다. (API 연동 시 실제 조회로 대체)
    console.log('[MyPrgrsHstry] 바로가기', item.id) // 추후: bd 진행 상세 조회(prcmNo/공고번호 매핑)
    navigate(`/bd/prgrs/${item.id}`)
  }
  // 세부 스텝 팝업의 '바로가기' — 선택 단계에 해당하는 목록으로 이동(설계서 slide79).
  const handleStepGoto = () => {
    console.log('[MyPrgrsHstry] 단계 바로가기', selectedStage) // 추후: 단계별 목록 라우팅
    setStepItem(null)
  }

  // 세부 스텝 팝업용 StepBar 항목 — 아이템의 currentStage 기준 done/doing/todo.
  const stepItems: StepItem[] = useMemo(() => {
    if (!stepItem) return []
    const curIdx = STAGES.indexOf(stepItem.currentStage as (typeof STAGES)[number])
    return STAGES.map((label, i) => {
      const state: StepState = i < curIdx ? 'done' : i === curIdx ? 'doing' : 'todo'
      return { label, state, onClick: () => setSelectedStage(label) }
    })
  }, [stepItem])

  const cardItems: CardListItem[] = visible.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.prgrsSttsNm}</Badge>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.ctrtMthd}</Badge>
      </>
    ),
    subtitle: `판단번호 ${it.prcmNo}`,
    title: it.bidNm,
    rows: [{ label: '신청일시', value: it.aplyDt }],
    footer: (
      <ButtonGroup
        layout="split"
        items={[
          { label: '진행 단계 보기', variant: 'secondary', onClick: () => handleShowSteps(it) },
          { label: '바로가기', variant: 'primary', onClick: () => handleGoto(it) },
        ]}
      />
    ),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 상단바 — 표시개수 셀렉트(검색필터 삭제됨). 좌측 "총 N건". */}
      <ListSectionHeader
        className="px-4 pt-4"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        <CardList items={cardItems} />
      </div>

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <button
            type="button"
            onClick={handleLoadMore}
            className="flex h-12 w-full items-center justify-center rounded-krds-8 border border-krds-border-primary bg-background text-krds-body-md font-bold text-krds-text-primary"
          >
            더보기 ({loaded}/{total})
          </button>
        </div>
      )}

      {/* 맨 위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-20 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 세부 스텝 팝업(P03) — 컨테이너/footer 를 페이지가 소유, 콘텐츠는 MyPrgrsHstryDtl. */}
      <BottomSheet
        open={stepItem !== null}
        onOpenChange={(open) => !open && setStepItem(null)}
        title="진행 단계 확인"
        footer={
          <ButtonGroup
            layout="split"
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => setStepItem(null) },
              { label: '바로가기', variant: 'primary', onClick: handleStepGoto },
            ]}
          />
        }
      >
        <MyPrgrsHstryDtl items={stepItems} selectedLabel={selectedStage ?? undefined} />
      </BottomSheet>
    </div>
  )
}
MyPrgrsHstryPage.displayName = 'MyPrgrsHstryPage'
