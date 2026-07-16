// MUI-CM-06-M04 나의업무이력현황 (MyTaskHstryPage). 설계서 00.공통 v0.84 slide80. **디자인 없음 → 기존 공통 재사용.**
// 종료된(완료/취소/포기) 업무 이력 목록. 셸 안 + sub헤더(뒤로+타이틀 '나의 업무 이력 현황'). 3뎁스라 BottomNav 숨김.
//
// 구성: 상단 분기 탭(입찰참가신청/입찰서제출/공개수의협상/계약, slide80 '상단 분기 버튼 추가') → 상단바(총건수+표시개수)
//   → 카드 리스트(공통 Card: 상태/업무/계약 배지 + 판단번호 + 공고명 + 발주예정월/발주기관/계약방법/예산금액) → 더보기 → FAB.
//   카드 클릭 → 상세: 입찰 계열(입찰참가신청/입찰서제출/공개수의협상)=입찰진행상세(MUI-BD-03-M02) · 계약=계약상세(분기, slide80).
//
// 데이터=파일 내 목업(설계서 slide80 형식), 동작=API 경계 스텁(console.log + '// 추후 …').
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import type { MyTaskHstryItem } from '@/types/cm'

// 상단 분기 탭 — 업무 이력 4가지 현황(설계서 slide80). taskSttsNm 으로 목록 필터.
const STTS_TABS: TabItem[] = [
  { value: '입찰참가신청', label: '입찰참가신청' },
  { value: '입찰서제출', label: '입찰서제출' },
  { value: '공개수의협상', label: '공개수의협상' },
  { value: '계약', label: '계약' },
]

// ── 목업 (설계서 slide80 예시/형식) ──────────────────────────────────────────
const dl_myTaskList: MyTaskHstryItem[] = [
  {
    id: '1',
    taskSttsNm: '입찰참가신청',
    prcmNo: '6000A',
    bidNm: "'26년 K5방독면",
    orderPrnmntYm: '2026-03',
    orderInstNm: '화력총괄계약팀',
    bidMthd: '총액제',
    bdgtAmt: 11616000,
    taskSeNm: '물품',
    ctrtMthd: '수의계약',
  },
  {
    id: '2',
    taskSttsNm: '입찰서제출',
    prcmNo: '2026-00590',
    bidNm: '26-평 절개지 복구공사',
    orderPrnmntYm: '2026-02',
    orderInstNm: '제9911부대',
    bidMthd: '총액제',
    bdgtAmt: 92472000,
    taskSeNm: '공사',
    ctrtMthd: '제한경쟁',
  },
  {
    id: '3',
    taskSttsNm: '계약',
    prcmNo: '6000C',
    bidNm: "'26년 전투화 납품",
    orderPrnmntYm: '2026-04',
    orderInstNm: '피복관리팀',
    bidMthd: '총액제',
    bdgtAmt: 33500000,
    taskSeNm: '물품',
    ctrtMthd: '일반경쟁',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 페이징 로직을 통째로 교체(myTaskService.getTaskHstryList).
const MOCK_LIST: MyTaskHstryItem[] = Array.from({ length: 99 }, (_, i) => ({
  ...dl_myTaskList[i % dl_myTaskList.length],
  id: String(i + 1),
}))

export function MyTaskHstryPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<string>('입찰참가신청')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // 탭(현황) 필터 → 페이징.
  const filtered = useMemo(() => MOCK_LIST.filter((it) => it.taskSttsNm === tab), [tab])
  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visible = filtered.slice(0, loaded)

  // ── 동작 스텁 ──
  const handleTab = (next: string) => {
    setTab(next)
    setPage(1)
    console.log('[MyTaskHstry] 탭', next) // 추후: myTaskService.getTaskHstryList({ stts: next })
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[MyTaskHstry] pageSize →', size)
  }
  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[MyTaskHstry] loadMore')
  }
  const handleCardClick = (it: MyTaskHstryItem) => {
    // 입찰 계열 → 입찰진행상세(MUI-BD-03-M02) · 계약 → 계약상세(조건 분기, slide80). 현재 스텁 라우팅.
    if (it.taskSttsNm === '계약') {
      console.log('[MyTaskHstry] 계약상세 이동(분기)', it.id) // 추후: 계약종류별 MUI-CT-01-M03~M10 분기
      return
    }
    navigate(`/bd/prgrs/${it.id}`, { state: it })
  }

  const cardItems: CardListItem[] = visible.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSttsNm}</Badge>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.ctrtMthd}</Badge>
      </>
    ),
    subtitle: `판단번호 ${it.prcmNo}`,
    title: it.bidNm,
    rows: [
      { label: '발주예정월', value: it.orderPrnmntYm },
      { label: '발주기관', value: it.orderInstNm },
      { label: '계약방법', value: it.bidMthd },
      { label: '예산금액', value: `${it.bdgtAmt.toLocaleString()} 원` },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 상단 분기 탭 — 4가지 현황(입찰참가신청/입찰서제출/공개수의협상/계약).
          6글자 한글 라벨 4개는 360px 폭에 균등(fitted)으로 안 들어가 잘리므로,
          가로 스크롤(스와이프 + 좌/우 화살표, scrollButtons 기본 'auto')로 노출한다. */}
      <TabList variant="button" value={tab} onChange={handleTab} items={STTS_TABS} scrollButtons="auto" />

      {/* 상단바 — 총건수 + 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        <CardList items={cardItems} emptyText="이력이 없습니다." />
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
    </div>
  )
}
MyTaskHstryPage.displayName = 'MyTaskHstryPage'
