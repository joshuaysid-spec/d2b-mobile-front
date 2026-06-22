// 입찰공고 통합목록(MUI-BD-01-M01, node 9300-36931). Design Ref: 02입찰 설계서 1.1~1.4.
// 레퍼런스: 조달계획 통합목록 PrcmPlanIntgListPage (구성·상태·페이징 동일 패턴).
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size)
//      + 카드 리스트(CardList) + 더보기 + 맨위로 FAB.
// 데이터/페이징/검색은 페이지가 소유. 목록은 목업(dlt_bidPbancList), 핸들러는 API 경계 스텁(console.log).
// 화면 타이틀('입찰공고')은 전역 Header(라우트 handle)가 제공 → 페이지 본문엔 타이틀 안 그림(설계서 Figma 타이틀 제거).
// 상세필터 풀팝업은 공통 SearchFilter 셸 사용 — 현재는 최소 schema(업무구분), 상세 검색조건은 MUI-BD-01-M02 에서 확장.
import { useMemo, useState } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { BidPbancItem } from '@/types/bd'

// 빠른검색 대상 — 설계서 검색조건(공고명/공고번호).
const SEARCH_TARGETS = [
  { value: 'bidPbancNm', label: '공고명' },
  { value: 'bidPbancNo', label: '공고번호' },
]

// 상세필터 풀팝업 schema — MUI-BD-01-M02 에서 일자/검색어/구분설정/가격/신기술 등으로 확장 예정.
// 지금은 최소 구성(업무구분)만. 공통 SearchFilter 셸이 schema 를 받아 렌더.
const BID_FILTER_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSeNm',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeNm',
          selectAll: true, // 상단 '전체' 칩(전체↔개별 자동 동기화)
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '국외' },
          ],
        },
      ],
    },
  ],
}
const DEFAULT_FILTER: SearchFilterValue = { taskSeNm: [] }

// 입찰공고 통합목록 데이터(설계서 1.4 데이터영역) — 목업, 추후 bdService.getList 매핑.
// 필드/코드값/형식은 설계서 그대로(공고상태·업무구분·입찰방식 코드값, 공고번호 형식, 일시 형식).
const dlt_bidPbancList: BidPbancItem[] = [
  {
    id: '1',
    bidPbancNo: '2026LGM000604191-01',
    bidPbancNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    pbancStasNm: '정상공고',
    taskSeNm: '물품',
    bidMthdNm: '경쟁입찰',
    pbancDt: '2026-02-12',
    bidPtcptAplyDdlnDt: '2026-03-16 15:00',
    bidDocSbmsnDdlnDt: '2026-03-17 15:00',
    opbidDt: '2026-03-26 11:00',
  },
  {
    id: '2',
    bidPbancNo: '2026LGM000598220-01',
    bidPbancNm: '(26-용역-12) 정보화시스템 유지관리 용역',
    pbancStasNm: '정정공고',
    taskSeNm: '용역',
    bidMthdNm: '공개수의',
    pbancDt: '2026-02-10',
    bidPtcptAplyDdlnDt: '2026-03-10 15:00',
    bidDocSbmsnDdlnDt: '2026-03-11 15:00',
    opbidDt: '2026-03-20 11:00',
  },
  {
    id: '3',
    bidPbancNo: '2026LGM000601077-01',
    bidPbancNm: '(26-공사-07) 군 관사 리모델링 공사',
    pbancStasNm: '취소공고',
    taskSeNm: '공사',
    bidMthdNm: '제한경쟁',
    pbancDt: '2026-02-05',
    bidPtcptAplyDdlnDt: '2026-03-05 15:00',
    bidDocSbmsnDdlnDt: '2026-03-06 15:00',
    opbidDt: '2026-03-16 11:00',
  },
  {
    id: '4',
    bidPbancNo: '2026LGM000605432-01',
    bidPbancNm: '(26-국외-02) 정밀부품 국외 도입',
    pbancStasNm: '긴급공고',
    taskSeNm: '국외',
    bidMthdNm: '협상에의한계약',
    pbancDt: '2026-02-14',
    bidPtcptAplyDdlnDt: '2026-03-02 15:00',
    bidDocSbmsnDdlnDt: '2026-03-03 15:00',
    opbidDt: '2026-03-12 11:00',
  },
]

const TOTAL = 258 // 총 건수(목업 — 실제 API total)
// 목업 확장 — 보유 4건을 인덱스로 복제해 TOTAL 건 구성(공고번호·id 는 고유하게).
const MOCK_LIST: BidPbancItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dlt_bidPbancList[i % dlt_bidPbancList.length]
  return { ...base, id: String(i + 1), bidPbancNo: `${base.bidPbancNo.slice(0, -3)}-${i + 1}` }
})

export function BidPbancIntgListPage() {
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['bidPbancNm']) // 빠른검색 대상(single — 1개만)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 빠른검색 '적용' 상태 — 검색 버튼(또는 Enter) 실행 시에만 확정(입력 중에는 목록 안 걸러짐).
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // ── API 경계 스텁 (백엔드 연동 시 services/bd·queries/bd 로 대체). console 로 동작 확인 ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[BidList] 상세필터 검색', value)
    // bdService.getList(toRequest(value)) → 목록 재조회
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'bidPbancNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
    console.log('[BidList] 빠른검색', { keyword, target })
    // bdService.getList({ keyword, searchTarget: target, ... }) 로 서버 검색.
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[BidList] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[BidList] loadMore → page', next)
  }
  const handleCardClick = (it: BidPbancItem) => {
    // 추후: 입찰공고상세(MUI-BD-01-M07, /bd/:id) 라우팅. 상세 미구현이라 현재는 경계 스텁.
    //   navigate(`/bd/${it.id}`) — 상세 라우트 추가 시 연결.
    console.log('[BidList] 카드 클릭 → 입찰공고상세(M07) 예정', it.id)
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 교체) ⚠️ ─────────────────────
  //   filteredList: 검색대상(공고명→bidPbancNm · 공고번호→bidPbancNo)으로 부분일치(대소문자 무시).
  //   visibleList: 더보기 누른 만큼(page*pageSize)만 노출.
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return MOCK_LIST
    const kw = appliedSearch.keyword.toLowerCase()
    return MOCK_LIST.filter((it) => {
      const field = appliedSearch.target === 'bidPbancNo' ? it.bidPbancNo : it.bidPbancNm
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.pbancStasNm}</Badge>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.bidMthdNm}</Badge>
      </>
    ),
    subtitle: `입찰공고번호 ${it.bidPbancNo}`,
    title: it.bidPbancNm,
    rows: [
      { label: '공고일자', value: it.pbancDt },
      { label: '입찰참가신청 마감일시', value: it.bidPtcptAplyDdlnDt },
      { label: '입찰서제출 마감일시', value: it.bidDocSbmsnDdlnDt },
      { label: '개찰일시', value: it.opbidDt },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 업무도움 — full-bleed 블루 바 */}
      <Infobox
        className="rounded-none"
        title="업무도움"
        items={[
          '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
          '1577-1118 대표전화로 전화주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.',
        ]}
      />

      {/* 검색조건 — 블루 바(full-bleed) + 폼(px-4 인셋) */}
      <SectionTitle as="h2" bgColor="blue">
        검색조건
      </SectionTitle>
      <div className="px-4 py-4">
        <SearchCondition
          targets={SEARCH_TARGETS}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onFilterClick={() => setOpen(true)}
          onSearch={handleQuickSearch}
        />
      </div>

      {/* 목록 헤더 — 총건수·표시개수 */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />
      {/* 카드 (px-4 인셋) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {/* 더보기 — 모두 노출됐으면 숨김 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
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

      {/* 상세필터 풀팝업 — 공통 SearchFilter 셸(MUI-BD-01-M02 에서 schema 확장 예정). */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={BID_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
