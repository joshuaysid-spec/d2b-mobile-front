// MUI-CM-06-M05 관심입찰공고 (ItrstBidPbancPage). 설계서 00.공통 v0.84 slide81·82 / Figma 10020:87664.
// 즐겨찾기(찜)한 입찰공고 목록. 셸(AppLayout) 안 + sub헤더(뒤로+타이틀 '관심입찰공고'). 3뎁스라 BottomNav 숨김.
//
// 구성(위→아래): 상단바(list section_top = 검색필터 버튼 + 표시개수 셀렉트) → 카드 리스트(ItrstBidPbancCard)
//   → 더보기(loaded/total) → 맨위로 FAB. 검색필터 버튼=SearchFilter 풀팝업(slide82 검색조건).
//   별(관심) 토글=해제 확인 AlertModal("다음부터 묻지 않기") → 해제 시 별 off + Toast(설계서 slide81 상태 2~4).
//
// 데이터=파일 내 목업(설계서 항목명/형식), 동작=API 경계 스텁(console.log + '// 추후 …').
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { ItrstBidPbancCard } from '@/ui/biz/cm/itrstBidPbanc/ItrstBidPbancCard'
import type {
  SearchFilterSchema,
  SearchFilterValue,
  DateRangePresetDef,
} from '@/types/search-filter'
import type { MockItrstBidPbancItem } from '@/types/mock/cm'
import { TASK_SE_CD } from '@/constants/codes'
import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { cmQueries } from '@/queries/cbs/cm/cmQueries'
import { useAuthStore, showToast } from '@/stores/authStore'

// ── 검색필터 schema (설계서 slide82 검색조건 dm_searchInfo) ────────────────────
// 개찰일자(FROM/TO 범위) + 통합참조번호 + 공고번호 + 입찰건명/사업명.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]
const SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '개찰일자',
      fields: [{ type: 'dateRange', key: 'bdopnYmd', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        {
          type: 'text',
          key: 'intgRfrncNo',
          label: '통합참조번호',
          placeholder: '통합참조번호를 입력하세요.',
        },
        { type: 'text', key: 'pbancNo', label: '공고번호', placeholder: '공고번호를 입력하세요.' },
        {
          type: 'text',
          key: 'pbancItemNm',
          label: '입찰건명/사업명',
          placeholder: '입찰건명을 입력하세요.',
        },
      ],
    },
  ],
}
const SEARCH_DEFAULT: SearchFilterValue = {
  bdopnYmd: { start: '', end: '' },
  intgRfrncNo: '',
  pbancNo: '',
  pbancItemNm: '',
}

// ── 목업 (설계서 slide81 예시 + 항목명/형식) ──────────────────────────────────
const TOTAL = 258 // 총 건수(목업 — slide81 더보기 10/258)
const dl_itrstBidPbancList: MockItrstBidPbancItem[] = [
  {
    id: '1',
    itrst: true,
    taskSeCd: TASK_SE_CD.GOODS,
    taskSeNm: '물품',
    ctrtMthd: '수의계약',
    pbancStasNm: '정상공고',
    pbancNoCycl: '2026LGM000604191-01',
    bidNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    orderPrnmntYm: '2026-03',
    orderInstNm: '화력총괄계약팀',
    bidMthd: '총액제',
    bdgtAmt: 11616000,
  },
  {
    id: '2',
    itrst: true,
    taskSeCd: TASK_SE_CD.CONSTRUCTION,
    taskSeNm: '공사',
    ctrtMthd: '제한경쟁',
    pbancStasNm: '정상공고',
    pbancNoCycl: '2026LGM000604191-01',
    bidNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    orderPrnmntYm: '2026-02',
    orderInstNm: '제9911부대',
    bidMthd: '총액제',
    bdgtAmt: 92472000,
  },
  {
    id: '3',
    itrst: true,
    taskSeCd: TASK_SE_CD.SERVICE,
    taskSeNm: '용역',
    ctrtMthd: '일반경쟁',
    pbancStasNm: '정정공고',
    pbancNoCycl: '2026LGS000712station-02',
    bidNm: "'26년 정보시스템 유지관리 용역",
    orderPrnmntYm: '2026-04',
    orderInstNm: '정보화팀',
    bidMthd: '총액제',
    bdgtAmt: 47200000,
  },
  {
    // 국외 건 — 카드 클릭 국외 상세(M71) 분기·별 재등록 no.51 분기 확인용.
    id: '4',
    itrst: true,
    taskSeCd: TASK_SE_CD.OVERSEAS,
    taskSeNm: '국외',
    ctrtMthd: '일반경쟁',
    pbancStasNm: '정상공고',
    pbancNoCycl: 'EFD0007-2',
    bidNm: '500MD HELICOPTER SPARE PARTS',
    orderPrnmntYm: '2026-05',
    orderInstNm: '국제부품계약팀',
    bidMthd: '단가제',
    bdgtAmt: 60800000,
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 페이징 로직을 통째로 교체(cmService.selectItrstBidPbancList).
const MOCK_LIST: MockItrstBidPbancItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_itrstBidPbancList[i % dl_itrstBidPbancList.length]
  return { ...base, id: String(i + 1) }
})

// '다음부터 묻지 않기' — 계정별 localStorage 저장(2026-09-01 사용자 확인: 기기+계정 단위).
//   서버 사용자 설정 API 미확정이라 로컬 저장에 계정키(customerNo)를 붙인다. API 확정 시 서버 저장으로 이관.
const dontAskKey = (customerNo?: string) =>
  `itrstBidPbanc.unfavorite.dontAsk:${customerNo ?? 'anon'}`

export function ItrstBidPbancPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user) // '다음부터 묻지 않기' 계정별 키용
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(SEARCH_DEFAULT)
  const [filterApplied, setFilterApplied] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // 관심 상태(별 on/off) — 페이지 유지 중엔 해제해도 목록에 남고 별만 off(설계서 slide81).
  const [items, setItems] = useState<MockItrstBidPbancItem[]>(MOCK_LIST)
  // 해제 확인 대상 id(모달 open) · 토스트 · '다음부터 묻지 않기' 체크값.
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [dontAskChecked, setDontAskChecked] = useState(false)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = useMemo(() => items.slice(0, loaded), [items, loaded])

  // ── 동작 스텁 (API 연동 시 services/queries 로 교체) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    console.log('[ItrstBidPbanc] 검색필터', value) // 추후: cmService.selectItrstBidPbancList(toRequest(value))
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[ItrstBidPbanc] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[ItrstBidPbanc] loadMore → page', next)
  }
  const handleOpen = (item: MockItrstBidPbancItem) => {
    // 클릭한 항목을 state 로 전달 — 업무구분코드(GTSA0001)로 국내(M02)/국외(M71) 상세 분기(통합목록과 동일 규칙).
    const to = item.taskSeCd === TASK_SE_CD.OVERSEAS ? '/bd/ovsBidPbancDtl' : '/bd/bidPbancDtl'
    navigate(to, { state: item })
  }

  // 별 토글 API — 해제 = cm no.758(분기 없음) · 재등록 = 업무구분코드(GTSA0001)로 국내/국외 분기(no.30/51).
  //   화면은 낙관적 갱신(별 즉시 반영), 실패 시에만 롤백. USE_MOCK 모드에선 목업 지연 후 성공 처리.
  const deleteItrst = cmQueries.useDeleteItrstBidPbanc()
  const insertItrst = bdQueries.useInsertItrstPbanc()
  const insertOvsItrst = bdQueries.useInsertOvsItrstPbanc()

  // 별 토글 — 켜기: 즉시 재등록 / 끄기: (다음부터 묻지않기면 즉시) 해제 확인 모달.
  const setItrst = (id: string, next: boolean) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, itrst: next } : it)))

  const unfavorite = (id: string) => {
    setItrst(id, false)
    showToast('관심공고에서 제외 되었습니다.') // 설계서: 즐겨찾기 해제 시 토스트("관심공고에서 제외 되었습니다.")
    // ⚠️ 식별자: 목업은 id — 실응답 확정 시 공고번호(pbancNoCycl 분해 등)로 교체 확인.
    deleteItrst.mutate(id, { onError: () => setItrst(id, true) }) // no.758 — 실패 시 별 롤백
  }
  const handleToggleStar = (item: MockItrstBidPbancItem) => {
    if (!item.itrst) {
      setItrst(item.id, true) // off→on: 재등록(확인 없이)
      // 업무구분코드로 국내/국외 등록 API 분기(설계서 GTSA0001 — 코드값 잠정, constants/codes.ts).
      const insert = item.taskSeCd === TASK_SE_CD.OVERSEAS ? insertOvsItrst : insertItrst
      insert.mutate(
        { id: item.id, favorite: true },
        { onError: () => setItrst(item.id, false) }, // 실패 시 별 롤백
      )
      return
    }
    // on→off: '다음부터 묻지 않기'(계정별) 저장돼 있으면 바로 해제, 아니면 확인 모달.
    if (localStorage.getItem(dontAskKey(user?.customerNo)) === 'Y') {
      unfavorite(item.id)
      return
    }
    setDontAskChecked(false)
    setConfirmId(item.id)
  }
  const handleConfirmUnfavorite = () => {
    if (!confirmId) return
    if (dontAskChecked) localStorage.setItem(dontAskKey(user?.customerNo), 'Y') // 계정별 로컬 저장
    unfavorite(confirmId)
    setConfirmId(null)
  }

  return (
    <div className="flex w-full flex-col">
      {/* 상단바(list section_top) — 좌: 검색필터 버튼 / 우: 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
        leftSlot={
          <Button
            variant="secondary"
            size="icon"
            aria-label="검색필터"
            onClick={() => setFilterOpen(true)}
            aria-pressed={filterApplied}
          >
            <Icon name="Tune" aria-hidden />
          </Button>
        }
      />

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        {visibleList.map((it) => (
          <ItrstBidPbancCard
            key={it.id}
            item={it}
            onOpen={() => handleOpen(it)}
            onToggleStar={() => handleToggleStar(it)}
          />
        ))}
      </div>

      {/* 더보기 (loaded/total). 모두 노출되면 숨김. */}
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

      {/* 검색필터 풀팝업 (slide82 검색조건) */}
      <SearchFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        schema={SEARCH_SCHEMA}
        value={filter}
        defaultValue={SEARCH_DEFAULT}
        onSearch={handleFilterSearch}
      />

      {/* 관심공고 해제 확인 모달 — Figma 10020:87083 1:1(v0.87 검토 7번, 2026-09-01 사용자 확정):
          아이콘 없이 타이틀+X(titleClose), 본문 좌측 정렬 2문단, '다음부터 묻지 않기'(17 Bold) 체크. */}
      <AlertModal
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
        titleClose
        dismissable
        title="관심공고 해제"
        description={
          <span className="flex flex-col items-start gap-krds-7">
            <span className="whitespace-pre-line">
              {
                '관심공고를 해제하면 관심입찰공고 목록과 업무 캘린더에서 선택하신 입찰공고가 사라집니다.\n정말 관심공고를 해제할까요?'
              }
            </span>
            <Checkbox
              variant="box"
              checked={dontAskChecked}
              onCheckedChange={(c) => setDontAskChecked(c === true)}
            >
              <span className="font-bold">다음부터 묻지 않기</span>
            </Checkbox>
          </span>
        }
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '해제', onClick: handleConfirmUnfavorite }}
      />
    </div>
  )
}
ItrstBidPbancPage.displayName = 'ItrstBidPbancPage'
