// 입찰진행 목록 (MUI-BD-03-M01, 설계서 02입찰 v1.83 slide69 화면 · slide71 데이터영역). "조달업체가 신청한 입찰 내역" 목록.
// 레퍼런스: 입찰공고 통합목록 BidPbancIntgListPage (구성·상태·페이징 동일 패턴).
// 구성: 업무도움(Infobox) + 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더 + 카드 리스트 + 더보기 + FAB.
// 데이터는 useBidProgressList(queries/bd) — 목업/실연동은 bdService(USE_MOCK)가 전환. 목업 데이터는 mocks/bd.ts.
// 키워드 검색·더보기(페이징)는 페이지 클라이언트 로직(서버 페이징 전환 시 훅 파라미터로 이행).
// ⚠️ 2026-06-18 개정('공고 목록 설명 변경', slide69 주석 ②): 목록은 공고 전체를 보여주되 상세 진입을 제한한다.
//    - 입찰 진행 일시 미도래 → 토스트 '입찰 진행 일이 아닙니다.'
//    - 입찰(신청) 이력 없음 → 토스트 '입찰 진행 이력이 없습니다.'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { useBidProgressList } from '@/queries/bd'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Toast } from '@/ui/common/composites/Toast'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  DateRangePresetDef,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'
import type { BidPrgrsItem } from '@/types/bd'

// 빠른검색 대상 — 설계서 검색조건(공고명/공고번호).
const SEARCH_TARGETS = [
  { value: 'bidNm', label: '공고명' },
  { value: 'pbancNo', label: '공고번호' },
]

// 상세필터 schema — 설계서 검색조건(dm_searchInfo): 업무구분/개찰일자/입찰건명/발주기관/통합참조번호.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
  { label: '12개월', months: 12 },
]
const PRGRS_FILTER_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSecd',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSecd',
          selectAll: true,
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '국외' },
          ],
        },
      ],
    },
    {
      key: 'bdopnYmd',
      title: '개찰일자',
      fields: [{ type: 'dateRange', key: 'bdopnYmd', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'bidNm', label: '입찰건명', placeholder: '입찰건명을 입력하세요.' },
        // 발주기관 → 발주부서(기관)검색(공통 시트)
        { type: 'selectionField', key: 'orderInstNm', label: '발주기관', placeholder: '발주기관을 입력하세요.', searchSheet: 'dept' },
        { type: 'text', key: 'rfrncNo', label: '통합참조번호', placeholder: '통합참조번호를 입력하세요.' },
      ],
    },
  ],
}
const DEFAULT_FILTER: SearchFilterValue = {
  taskSecd: [],
  bdopnYmd: { start: '', end: '' },
  bidNm: '',
  orderInstNm: '',
  rfrncNo: '',
}

// 목록 데이터는 useBidProgressList(bdService.getBidProgressList) 가 공급 — 목업은 mocks/bd.ts(구 인라인 이관).
// (구 인라인 dlt_bidPrgrsList 7건 + 확장은 mocks/bd.ts 로 이관 — 단일 소스. 각 아이템 = 업무구분/진행상태/실데이터
//  를 담은 완결 객체라 그대로 상세 navigate state 로 넘기면 상세가 상태값으로 버튼을 분기해 굴러간다.)

// 신청유형 배지(설계서 slide69: 사전심사/입찰참가/견적서) — 해당 플래그가 true 인 것만.
function aplyBadges(it: BidPrgrsItem): string[] {
  const out: string[] = []
  if (it.bfhdSrng) out.push('사전심사')
  if (it.bidPrgrsApfr) out.push('입찰참가')
  if (it.tndr) out.push('견적서')
  return out
}

// 상세 진입 제한(설계서 slide69 주석 ②) — 막을 사유가 있으면 토스트 문구, 없으면 null.
//   ① 입찰 진행 일시 미도래 = 공고일자(pbancYmd)가 아직 오지 않음(사용자 확정 판정 기준).
//   ② 입찰 진행 이력 없음 = 신청유형 플래그(입찰참가/입찰서/사전심사/기술평가/생산능력서류)가 모두 false.
function entryBlockMessage(it: BidPrgrsItem): string | null {
  if (it.pbancYmd && dayjs(it.pbancYmd).isAfter(dayjs(), 'day')) return '입찰 진행 일이 아닙니다.'
  const hasHistory =
    it.bidPrgrsApfr || it.tndr || it.bfhdSrng || it.techEvl || it.prdcpDcmntSbms
  if (!hasHistory) return '입찰 진행 이력이 없습니다.'
  return null
}

// 진행상태 배지(타이틀 영역에서 상태를 알 수 있게) — 색으로 상태 강조.
//   반려신청(미동의/반려후)=red · 등록확정/완료=green · 그 외(신청/제출)=blue.
function statusBadge(it: BidPrgrsItem): { label: string; color: 'blue' | 'green' | 'red' } | null {
  if (it.regRjctYn) return { label: '입찰참가등록반려', color: 'red' }
  if (it.tndrStatNm === '완료') return { label: '입찰서 완료', color: 'green' }
  if (it.tndrStatNm === '제출') return { label: '입찰서 제출', color: 'blue' }
  if (it.bidRegCfmtnYn === 'Y') return { label: '등록확정', color: 'green' }
  if (it.apfrStatNm) return { label: `입찰참가 ${it.apfrStatNm}`, color: 'blue' }
  return null
}

export function BidPrgrsListForBzentyPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['bidNm'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )
  const [toastMsg, setToastMsg] = useState<string | null>(null) // 진입 제한 안내(null=닫힘)

  // 목록 조회 — 전체 목록(목업/실연동은 bdService.getBidProgressList 의 USE_MOCK 분기가 전환).
  const { data } = useBidProgressList()

  // ── 목록 핸들러 — 확정값 상태만 갱신(조회는 useBidProgressList + 아래 클라이언트 필터가 담당) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'bidNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }
  const handleLoadMore = () => {
    setPage(page + 1)
  }
  // 카드 클릭 → 진입 제한 검사 후 입찰진행 상세(MUI-BD-03-M02). 결과/작성 화면은 상세의 보기 버튼에서 연계.
  const handleCardClick = (it: BidPrgrsItem) => {
    const blocked = entryBlockMessage(it)
    if (blocked) {
      setToastMsg(blocked)
      return
    }
    navigate(`/bd/prgrs/${it.rNum}`, { state: it })
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 이 블록 삭제) ──
  const filteredList = useMemo(() => {
    const list = data ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field = appliedSearch.target === 'pbancNo' ? it.pbancNo : it.bidNm
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, data])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  const cardItems: CardListItem[] = visibleList.map((it) => {
    const status = statusBadge(it)
    return {
    id: it.rNum,
    badges: (
      <>
        {/* 진행상태 — 색으로 강조해 타이틀 영역에서 바로 상태 파악 */}
        {status && (
          <Badge type="solid" color={status.color}>
            {status.label}
          </Badge>
        )}
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.ctrtMthdNm}</Badge>
        {aplyBadges(it).map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
      </>
    ),
    subtitle: `공고번호 ${it.pbancNo}`, // 입찰공고 통합목록(BidPbancIntgListPage)과 동일 표기 유지
    title: it.bidNm,
    // 정보행 — 설계서 slide69 카드 4행 그대로(라벨 '일참서제출마감일시'는 설계서 오타로 보고
    // 데이터영역 항목설명(tndrSbmsnDdlnDt='입찰서제출마감일시') 표기를 따른다).
    rows: [
      { label: '공고일자', value: it.pbancYmd ?? '-' },
      { label: '입찰참가신청 마감일시', value: it.bidClrsDt },
      { label: '입찰서제출마감일시', value: it.tndrSbmsnDdlnDt },
      { label: '개찰일시', value: it.bdopnDt ?? '-' },
    ],
    onClick: () => handleCardClick(it),
    }
  })

  return (
    <div className="flex w-full flex-col">
      <Infobox
        className="rounded-none"
        title="업무도움"
        items={[
          '조달업체가 신청한 입찰 내역을 조회하는 화면입니다.',
          '상세 정보 보기를 누르면 신청한 입찰의 상세 내역을 확인할 수 있습니다.',
        ]}
      />

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

      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={PRGRS_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />

      {/* 상세 진입 제한 안내(설계서 slide69 주석 ②) */}
      <Toast open={toastMsg !== null} onClose={() => setToastMsg(null)} duration={2000}>
        {toastMsg}
      </Toast>
    </div>
  )
}
