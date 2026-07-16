// MUI-CM-06-M17 나의 게시물 (MyPstPage). 설계서 00.공통 v0.84 slide107.
// 내가 작성한 게시물 목록(제목 + 작성일). 클릭 시 해당 게시물 화면으로 이동해 콘텐츠 표시.
//   (설계서 2026-07-13 수정: '작성 위치정보 표시' 삭제 → 제목·작성일만 노출.)
// 웹경로: 메인 홈 > 마이페이지 > 나의 게시물. 셸 안 + sub헤더(뒤로+타이틀). 3뎁스라 BottomNav 숨김.
//
// ⚠️ slide107 엔 데이터영역(항목명 영문) 표가 없다. 아래 필드명(pstTtl/wrtYmd)은 화면 표기 기준
//    잠정 영문키(관례: cm) — API 연동 시 실제 데이터영역 매핑 확인 필요.
// 데이터=파일 내 목업, 동작=API/라우팅 경계 스텁.
import { useMemo, useState } from 'react'

import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Button } from '@/ui/common/base/Button'
import type { MyPstItem } from '@/types/cm'

// ── 목업 (설계서 slide107 예시/형식) ─────────────────────────────────────────
const TOTAL = 258 // 설계서 slide107 더보기 (10/258)
const dl_myPstList: MyPstItem[] = [
  { id: '1', pstTtl: '작성한 제목 표시 영역', wrtYmd: '2025-12-01' },
  {
    id: '2',
    pstTtl: '작성한 제목 표시 영역 두줄이 되는 경우 두줄까지 표시됩니다 세줄부터는 말줄임 처리',
    wrtYmd: '2025-12-01',
  },
  { id: '3', pstTtl: '작성한 제목 표시 영역', wrtYmd: '2025-11-28' },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 페이징 로직을 통째로 교체(myPstService.getList).
const MOCK_LIST: MyPstItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...dl_myPstList[i % dl_myPstList.length],
  id: String(i + 1),
}))

export function MyPstPage() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const total = MOCK_LIST.length
  const loaded = Math.min(page * pageSize, total)
  const visible = useMemo(() => MOCK_LIST.slice(0, loaded), [loaded])

  // ── 동작 스텁 ──
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[MyPst] pageSize →', size)
  }
  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[MyPst] loadMore')
  }
  const handleCardClick = (it: MyPstItem) => {
    // 클릭 시 해당 게시물 화면으로 이동(게시판 종류별 상세). 진입 화면 확정 시 라우팅으로 교체.
    console.log('[MyPst] 게시물 이동', it.id) // 추후: navigate(해당 게시물 상세)
  }

  const cardItems: CardListItem[] = visible.map((it) => ({
    id: it.id,
    title: it.pstTtl,
    rows: [{ label: '작성일', value: it.wrtYmd }],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 상단바 — 총건수 + 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). 카드 클릭 → 게시물 화면. */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        <CardList items={cardItems} emptyText="작성한 게시물이 없습니다." />
      </div>

      {/* 더보기 (loaded/total) */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-20 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
MyPstPage.displayName = 'MyPstPage'
