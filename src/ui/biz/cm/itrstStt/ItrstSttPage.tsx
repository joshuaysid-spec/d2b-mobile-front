// MUI-CM-06-M13 관심법령 (ItrstSttPage). 설계서 00.공통 v0.84 slide105·106.
// 즐겨찾기(별)한 관심 법령 목록. 카드 클릭 시 외부 브라우저로 법령 정보(sttUrl) 표시.
// 관심 해제: 별표 하이라이트 off + 현재 페이지에서는 목록 유지(이탈 후 복귀 시 즐겨찾기만 표시).
//   해제 시 토스트 "해제되었습니다." 노출(사용자 확정 2026-08-24 — 구 "해제 메시지 없음(설계서 slide105)" 대체).
// 웹경로: 메인 홈 > 마이페이지 > 관심법령. 셸 안 + sub헤더(뒤로+타이틀). 3뎁스라 BottomNav 숨김.
//
// 데이터=파일 내 목업(데이터영역 dl_itrstSttList 항목명/형식), 동작=API 경계 스텁.
import { useMemo, useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Toast } from '@/ui/common/composites/Toast'
import type { ItrstSttItem } from '@/types/cm'

// ── 목업 (설계서 slide105 예시 + 데이터영역 dl_itrstSttList 항목명/형식) ─────────────
const TOTAL = 258 // 설계서 slide105 더보기 (10/258)
const dl_itrstSttList: ItrstSttItem[] = [
  {
    id: '1',
    itrst: true,
    sttSeNm: '방위사업법 법령 모음',
    sttAbbrNm: '방위사업법/국계법',
    sttNm: '방위사업법 시행규칙',
    sttEnfcYmd: '2025-01-01',
    sttUrl: 'https://www.law.go.kr/법령/방위사업법시행규칙',
  },
  {
    id: '2',
    itrst: true,
    sttSeNm: '방위사업청(중앙조달) 주요 규정',
    sttAbbrNm: '군수품조달',
    sttNm: '군수품조달 관리규정',
    sttEnfcYmd: '2024-07-01',
    sttUrl: 'https://www.law.go.kr/행정규칙/군수품조달관리규정',
  },
  {
    id: '3',
    itrst: true,
    sttSeNm: '국방부(부대조달) 주요 규정',
    sttAbbrNm: '군시설공사',
    sttNm: '군시설공사 입찰참가자격사전심사 세부운영 기준에 관한 훈령',
    sttEnfcYmd: '2023-12-15',
    sttUrl: 'https://www.law.go.kr/행정규칙/군시설공사입찰참가자격사전심사훈령',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 페이징 로직을 통째로 교체(cmService.selectItrstSttList).
const MOCK_LIST: ItrstSttItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...dl_itrstSttList[i % dl_itrstSttList.length],
  id: String(i + 1),
}))

export function ItrstSttPage() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 관심(별) 상태 — 해제해도 페이지 유지 중엔 목록에 남고 별만 off(설계서 slide105).
  const [items, setItems] = useState<ItrstSttItem[]>(MOCK_LIST)
  // 해제 토스트(사용자 확정 2026-08-24)
  const [toastOpen, setToastOpen] = useState(false)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visible = useMemo(() => items.slice(0, loaded), [items, loaded])

  // ── 동작 스텁 ──
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[ItrstStt] pageSize →', size)
  }
  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[ItrstStt] loadMore')
  }
  const handleOpen = (it: ItrstSttItem) => {
    // 클릭 시 외부 브라우저로 법령 정보 표시(외부 URL 은 법령 등록 시 관리자가 작성).
    console.log('[ItrstStt] 법령 링크 열기', it.sttUrl) // 추후: 하이브리드 외부 브라우저 오픈 브릿지
    window.open(it.sttUrl, '_blank', 'noopener,noreferrer')
  }
  const handleToggleStar = (it: ItrstSttItem) => {
    // 별표 하이라이트만 토글 — 현재 페이지에서는 목록 유지. 해제(on→off) 시에만 토스트 노출.
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, itrst: !x.itrst } : x)))
    if (it.itrst) setToastOpen(true)
    console.log('[ItrstStt] 관심 토글', it.id) // 추후: cmService.cancelBkmSttInfo(id)
  }

  return (
    <div className="flex w-full flex-col">
      {/* 상단바 — 총건수 + 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 법령 카드 리스트 — px16, 카드 간 16(krds-8).
          카드 전체 클릭=외부 링크, 별 클릭=관심 토글. 중첩 <button> 회피 stretched-link 패턴. */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        {visible.map((it) => (
          <div
            key={it.id}
            className="relative flex w-full flex-col gap-krds-5 rounded-[12px] border border-krds-border-divider bg-background p-krds-8 shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]"
          >
            {/* 전면 nav 버튼 — 카드 전체 클릭(외부 링크). */}
            <button
              type="button"
              onClick={() => handleOpen(it)}
              aria-label={`${it.sttNm} 법령 열기`}
              className="absolute inset-0 z-0 rounded-[12px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
            />
            <div className="pointer-events-none relative z-10 flex flex-col gap-krds-5">
              <div className="flex items-start gap-krds-8">
                <div className="flex min-w-px flex-1 flex-col gap-krds-2">
                  <div className="flex flex-wrap items-center gap-krds-5">
                    <Badge type="pastel" color="blue">
                      {it.sttSeNm}
                    </Badge>
                    <Badge type="pastel" color="green">
                      {it.sttAbbrNm}
                    </Badge>
                  </div>
                  <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                    {it.sttNm}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleStar(it)}
                  aria-pressed={it.itrst}
                  aria-label={it.itrst ? '관심법령 해제' : '관심법령 등록'}
                  className="pointer-events-auto -m-1 shrink-0 rounded-full p-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
                >
                  <Icon
                    name="KidStar"
                    size={24}
                    fill={it.itrst ? 1 : 0}
                    aria-hidden
                    className={it.itrst ? 'text-krds-text-primary' : 'text-krds-text-disabled-soft'}
                  />
                </button>
              </div>
              <div className="flex items-start gap-krds-5">
                <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted">
                  시행일자
                </span>
                <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-muted">
                  {it.sttEnfcYmd}
                </span>
              </div>
            </div>
          </div>
        ))}
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

      {/* 관심 해제 토스트(사용자 확정 2026-08-24) */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        해제되었습니다.
      </Toast>
    </div>
  )
}
ItrstSttPage.displayName = 'ItrstSttPage'
