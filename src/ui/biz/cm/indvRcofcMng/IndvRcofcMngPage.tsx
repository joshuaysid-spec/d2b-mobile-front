// MUI-CM-06-M12 개인별수신처 관리 (IndvRcofcMngPage). 설계서 00.공통 v0.84 slide103·104.
// 개인별 수신처 정보 목록. **모바일은 조회만** 가능(등록/수정/삭제는 PC). 상세화면 없음.
// 웹경로: 메인 홈 > 마이페이지 > 문서함 - 개인별수신처관리. 셸 안 + sub헤더(뒤로+타이틀). 3뎁스라 BottomNav 숨김.
//
// 구성(위→아래): 상단바(총건수 + 표시개수) → 카드 리스트(전자문서명 제목 + 부서/수신부서/수신자 행)
//   → 더보기(loaded/total) → 맨위로 FAB. 카드 클릭 없음(상세 없음).
//
// 데이터=파일 내 목업(설계서 데이터영역 dl_indvRcofcList 항목명/형식), 동작=API 경계 스텁.
import { useMemo, useState } from 'react'

import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Button } from '@/ui/common/base/Button'
import type { IndvRcofcItem } from '@/types/cm'

// ── 목업 (설계서 slide103 예시 + 데이터영역 dl_indvRcofcList 항목명/형식) ──────────
const dl_indvRcofcList: IndvRcofcItem[] = [
  {
    id: '1',
    eldocNm: '물량배정서',
    deptNm: '방위사업청',
    rcvrId: 'hong01',
    rcptnOgnzNm: '방위사업청',
    rcvrNm: '홍길동',
  },
  {
    id: '2',
    eldocNm: '물량배정서',
    deptNm: '방위사업청',
    rcvrId: 'kim02',
    rcptnOgnzNm: '화력총괄계약팀',
    rcvrNm: '김철수',
  },
  {
    id: '3',
    eldocNm: '계약통보서',
    deptNm: '국방부',
    rcvrId: 'lee03',
    rcptnOgnzNm: '피복관리팀',
    rcvrNm: '이영희',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 페이징 로직을 통째로 교체(cmService.selectIndvRcofcList).
const TOTAL = 258 // 설계서 slide103 더보기 (10/258)
const MOCK_LIST: IndvRcofcItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...dl_indvRcofcList[i % dl_indvRcofcList.length],
  id: String(i + 1),
  rcvrId: `${dl_indvRcofcList[i % dl_indvRcofcList.length].rcvrId}-${i + 1}`,
}))

export function IndvRcofcMngPage() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const total = MOCK_LIST.length
  const loaded = Math.min(page * pageSize, total)
  const visible = useMemo(() => MOCK_LIST.slice(0, loaded), [loaded])

  // ── 동작 스텁 ──
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[IndvRcofcMng] pageSize →', size)
  }
  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[IndvRcofcMng] loadMore')
  }

  const cardItems: CardListItem[] = visible.map((it) => ({
    id: it.id,
    title: it.eldocNm,
    rows: [
      { label: '부서', value: it.deptNm },
      { label: '수신부서', value: it.rcptnOgnzNm },
      { label: '수신자', value: it.rcvrNm },
    ],
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

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). 조회 전용(클릭 없음). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        <CardList items={cardItems} emptyText="개인별 수신처가 없습니다." />
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
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
IndvRcofcMngPage.displayName = 'IndvRcofcMngPage'
