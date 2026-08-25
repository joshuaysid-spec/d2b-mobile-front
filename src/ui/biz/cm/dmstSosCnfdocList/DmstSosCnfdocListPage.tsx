// 국내 조달원 확인서 신청 목록 (MUI-CM-01-M19, Figma 10020:82626 / empty 10020:82677).
// 설계서 00.공통 v0.85 slide138(문서 P137). 웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 국내조달원확인서신청목록.
// 구성(위→아래): 검색필터 버튼 → 목록헤더(총건수·표시개수)
//   → 카드 리스트(발급 배지 + 접수번호 + 신청인/신청사유/신청일자/연락처) → 더보기 → 하단 [신청하기](→ P20 시트).
// 검색조건은 인라인 영역이 아니라 **공통 SearchFilter 셸**(schema 주입)로 띄운다 — 설계서 slide138 mock 의
//   '검색필터'(초기화 / 기간 설정* / 검색어(일부 입력 가능) / 검색·닫기)와 동일 구성, 국외(OvsSosCnfdocListPage)와 같은 패턴.
// 데이터/페이징/검색은 페이지가 소유. 목록은 목업(dl_resultList), 더보기·표시개수·검색은 API 경계 스텁
//   (핸들러 실행 + console.log). 신청 팝업(P20, DmstSosCnfdocAply)은 BottomSheet 컨테이너를 페이지가 소유.
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Toast } from '@/ui/common/composites/Toast'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { DmstSosCnfdocAply } from '@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocAply'
import {
  dmstSosCnfdocAplySchema,
  type DmstSosCnfdocAplyForm,
} from '@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocAply.schema'
import { cn } from '@/utils/cn'
import type { DmstSosCnfdocItem } from '@/types/mock/cm'
import type {
  DateRangePresetDef,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── 검색필터 schema (설계서 slide138 mock — 기간 설정* → 검색어(신청인)) ─────────
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]

const SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '기간 설정',
      fields: [
        { type: 'segment', key: 'dateType', options: [{ value: 'edpPrcsYmd', label: '검색 기간' }] },
        { type: 'dateRange', key: 'edpPrcsYmd', required: true, presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        {
          type: 'text',
          key: 'aplcntNm',
          label: '신청인',
          placeholder: '신청인을 입력하세요.',
        },
      ],
    },
  ],
}

function buildDefaultValue(): SearchFilterValue {
  return {
    dateType: 'edpPrcsYmd',
    edpPrcsYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    aplcntNm: '',
  }
}

// 로그인 사용자(신청인) 자동완성 값 — P20 신청 팝업 read-only 표시(설계서 slide133 '신청인 정보 자동완성').
//   추후 authStore(로그인 업체 담당자)에서 주입. 현재는 목업.
const APPLICANT = {
  aplcntNm: '홍길동',
  aplcntTelno: '010-1234-5678',
}

// 조달원확인서 신청 목록 데이터(dl_resultList, 설계서 slide134 항목명 영문) — 목업, 추후 API(cmService.selectDmstSosCnfdocAplyList).
//   상태(aplyRcptStts)는 '발급'으로 고정(신청 시 바로 발급, 설계서 slide134 비고). 신청사유(aplyRsn)=입찰참가용/확인용.
const dl_resultList: DmstSosCnfdocItem[] = [
  {
    id: '1',
    aplyRcptNo: '2026051812',
    aplcntNm: '홍길동',
    aplyRsn: '입찰참가용',
    edpPrcsYmd: '2026-05-18',
    aplcntTelno: '010-1234-5678',
    aplyRcptStts: '발급',
  },
  {
    id: '2',
    aplyRcptNo: '2026051745',
    aplcntNm: '고길동',
    aplyRsn: '확인용',
    edpPrcsYmd: '2026-05-17',
    aplcntTelno: '010-2345-6789',
    aplyRcptStts: '발급',
  },
  {
    id: '3',
    aplyRcptNo: '2026051602',
    aplcntNm: '홍길동',
    aplyRsn: '입찰참가용',
    edpPrcsYmd: '2026-05-16',
    aplcntTelno: '010-1234-5678',
    aplyRcptStts: '발급',
  },
  {
    id: '4',
    aplyRcptNo: '2026051533',
    aplcntNm: '김방산',
    aplyRsn: '확인용',
    edpPrcsYmd: '2026-05-15',
    aplcntTelno: '010-3456-7890',
    aplyRcptStts: '발급',
  },
  {
    id: '5',
    aplyRcptNo: '2026051421',
    aplcntNm: '홍길동',
    aplyRsn: '입찰참가용',
    edpPrcsYmd: '2026-05-14',
    aplcntTelno: '010-1234-5678',
    aplyRcptStts: '발급',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 filteredList/visibleList 로직을 서버 조회로 교체.
//   보유한 5건을 TOTAL 건으로 부풀려 더보기(page*pageSize slice)를 시연한다(설계서 slide132 '더보기 (10/258)').
const TOTAL = 258
const MOCK_LIST: DmstSosCnfdocItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_resultList[i % dl_resultList.length]
  return { ...base, id: String(i + 1), aplyRcptNo: `${base.aplyRcptNo}${String(i + 1).padStart(2, '0')}`.slice(0, 12) }
})

export function DmstSosCnfdocListPage() {
  // 검색필터(dm_searchInfo) — 셸이 draft 를 갖고, [검색] 시에만 이 확정값이 갱신된다.
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [filterApplied, setFilterApplied] = useState(false) // 필터 적용 → 버튼 강조
  const defaultValue = useMemo(() => buildDefaultValue(), [])
  // 목록에 실제로 적용된 신청인 검색어.
  const appliedNm = typeof filter.aplcntNm === 'string' ? filter.aplcntNm.trim() : ''
  // 정렬(목록 헤더 우측, Figma "최신순 ▼") — 신청날짜 기준 최신순/과거순. pageSize(10)는 더보기 슬라이스용 고정.
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest')
  const pageSize = 10
  const [page, setPage] = useState(1)

  // P20 신청 팝업(BottomSheet) — 컨테이너/폼은 페이지가 소유(설계서 slide133).
  const [aplyOpen, setAplyOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  // 서류 출력 확인(MUI-BD-01-P14) — 신청 제출 성공 시 호출(사용자 확정 2026-08-25, 신청 즉시 발급이라 출력 확인으로 이어짐).
  const [outputOpen, setOutputOpen] = useState(false)
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<DmstSosCnfdocAplyForm>({
    resolver: zodResolver(dmstSosCnfdocAplySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { aplyRsn: '' },
  })

  // ── API 경계 스텁 (백엔드 연동 시 services/cm·queries/cm 로 대체). console 로 동작 확인 ──
  // 검색필터 [검색] — 셸이 확정한 값을 받아 목록에 적용(초기화는 셸 내부에서 defaultValue 로 되돌림).
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    console.log('[DmstSosCnfdoc] 검색필터 조회', value)
    // cmService.selectDmstSosCnfdocAplyList({ edpPrcsYmdFrom, edpPrcsYmdTo, aplcntNm })
  }
  const handleSort = (value: string) => {
    setSort(value as 'latest' | 'oldest')
    setPage(1)
    console.log('[DmstSosCnfdoc] 정렬 →', value)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[DmstSosCnfdoc] loadMore → page', next)
  }
  // 카드 클릭 → OZ 리포트 조달원 확인서 연결 > 서류 확인 팝업(MUI-BD-01-P14) 호출(설계서 slide132). 현재 스텁.
  const handleCardClick = (item: DmstSosCnfdocItem) => {
    console.log('[DmstSosCnfdoc] 조달원 확인서 출력(OZ리포트/서류확인 P14)', item.aplyRcptNo)
    // 추후: OZ 리포트 실행 + 서류확인 팝업(MUI-BD-01-P14)
  }
  // 하단 [신청하기] → P20 신청 팝업 오픈(폼 초기화 후).
  const openAply = () => {
    resetForm({ aplyRsn: '' })
    setAplyOpen(true)
  }
  // P20 [신청하기] 제출 성공 → 팝업 닫기 > 완료 토스트 > 서류 출력 확인 팝업(MUI-BD-01-P14) 호출
  // (사용자 확정 2026-08-25 — 신청 시 바로 발급(설계서 slide134 비고)이라 출력 확인으로 이어짐).
  const onAplySubmit = (values: DmstSosCnfdocAplyForm) => {
    setAplyOpen(false)
    setToastOpen(true)
    setOutputOpen(true)
    console.log('[DmstSosCnfdoc] 신청', { ...APPLICANT, aplyRsn: values.aplyRsn })
    // cmService.insertDmstSosCnfdocAply({ aplcntNm, aplcntTelno, aplyRsn }) → 성공 시 목록 재조회
  }
  // 제출 실패(신청사유 미입력) — 시트 스크롤 컨테이너에서 첫 에러 필드로 스크롤.
  const onAplyInvalid = () => {
    document.getElementById('field-aplyRsn')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 삭제 후 재작성) ⚠️ ──────────
  //   신청인(aplcntNm) 부분일치로 거른다(대소문자 무시). 검색 실행 전이거나 검색어가 비면 전체.
  //   신청기간(edpPrcsYmd)은 목업 단계에선 필터하지 않는다(API 연동 시 FROM~TO 범위 조회).
  //   정렬(sort): 신청날짜(edpPrcsYmd) 기준 최신순(desc)/과거순(asc).
  const filteredList = useMemo(() => {
    const base = appliedNm ? MOCK_LIST.filter((it) => it.aplcntNm.includes(appliedNm)) : MOCK_LIST
    return [...base].sort((a, b) =>
      sort === 'latest'
        ? b.edpPrcsYmd.localeCompare(a.edpPrcsYmd)
        : a.edpPrcsYmd.localeCompare(b.edpPrcsYmd),
    )
  }, [appliedNm, sort])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑. 접수번호(제목)는 번호만 primary 색(Figma), 상태(aplyRcptStts=발급)는 배지.
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.aplyRcptStts}</Badge>,
    title: (
      <>
        접수번호 <span className="text-krds-text-primary-active">{it.aplyRcptNo}</span>
      </>
    ),
    rows: [
      { label: '신청인', value: it.aplcntNm },
      { label: '신청사유', value: it.aplyRsn },
      { label: '신청일자', value: it.edpPrcsYmd },
      { label: '연락처', value: it.aplcntTelno },
    ],
    onClick: () => handleCardClick(it),
  }))

  // 검색 결과 없음 — 검색한 신청인 기준 안내(Figma empty 10020:82677 '"가나다"에 대한 / 검색 결과가 없습니다.').
  const emptyText = appliedNm ? (
    <>
      &ldquo;{appliedNm}&rdquo;에 대한
      <br />
      검색 결과가 없습니다.
    </>
  ) : (
    '신청 내역이 없습니다.'
  )

  return (
    <div className="flex w-full flex-col">
      {/* 검색필터 버튼 행 — 설계서 slide138 상단 '검색필터'. 누르면 공통 SearchFilter 셸이 열린다.
          (국외 조달원등록증 목록 OvsSosCnfdocListPage 와 동일 스타일 — 빠른검색 없이 필터 버튼만) */}
      <div className="flex justify-end px-4 py-4">
        <button
          type="button"
          aria-label="검색필터"
          aria-pressed={filterApplied}
          onClick={() => setFilterOpen(true)}
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-primary text-krds-text-primary',
            'bg-background active:bg-krds-bg-primary-subtle',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
            filterApplied && 'border-2 bg-krds-bg-primary-subtle',
          )}
        >
          <Icon name="Tune" size={24} aria-hidden />
        </button>
      </div>

      {/* 목록 헤더 — 총건수 + 정렬 셀렉트(Figma 10020:82626 "최신순 ▼"). 신청날짜 기준 최신순/과거순. */}
      <ListSectionHeader
        variant="background"
        total={total}
        sortValue={sort}
        sortOptions={[
          { value: 'latest', label: '최신순' },
          { value: 'oldest', label: '과거순' },
        ]}
        onSortChange={handleSort}
      />

      {/* 카드 목록 (px-4 인셋). 빈 목록은 CardList emptyText(검색어 기준 안내). */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} emptyText={emptyText} />
      </div>

      {/* 더보기 (loaded/total — 스텁). 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-4">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 하단 액션 바 — [신청하기](→ P20 신청 팝업). sticky 로 하단 고정(BottomNav 없음).
          safe-area: pb 는 max(12px, env(safe-area-inset-bottom)) — Tailwind 가 env() 콤마를 못 다뤄 inline style. */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <Button variant="primary" className="w-full" onClick={openAply}>
          신청하기
        </Button>
      </div>

      {/* P20 조달원 확인서 신청서 바텀시트(설계서 slide139 / Figma 10020:82699) — 컨테이너/footer 는 페이지 소유.
          콘텐츠는 DmstSosCnfdocAply. 타이틀 '조달원 확인서 신청서' · footer [취소][신청하기](설계서 mock 그대로). */}
      <BottomSheet
        open={aplyOpen}
        onOpenChange={setAplyOpen}
        title="조달원 확인서 신청서"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setAplyOpen(false) },
              { label: '신청하기', variant: 'primary', onClick: handleSubmit(onAplySubmit, onAplyInvalid) },
            ]}
          />
        }
      >
        <DmstSosCnfdocAply
          control={control}
          aplcntNm={APPLICANT.aplcntNm}
          aplcntTelno={APPLICANT.aplcntTelno}
        />
      </BottomSheet>

      {/* 검색필터 — 공통 셸에 schema 주입(초기화/검색/닫기는 셸이 처리, 설계서 slide138 mock) */}
      <SearchFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        schema={SEARCH_SCHEMA}
        value={filter}
        defaultValue={defaultValue}
        onSearch={handleFilterSearch}
      />

      {/* 서류 출력 확인 (MUI-BD-01-P14) — 신청 제출 성공 시 호출. 확인=OZ 리포트 조달원 확인서 출력(스텁).
          국외 조달원등록증 목록(OvsSosCnfdocListPage)의 P14 인라인 AlertModal 패턴과 동일. */}
      <AlertModal
        open={outputOpen}
        onOpenChange={setOutputOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () =>
            console.log('[DmstSosCnfdoc] 조달원 확인서 출력 — OZ 리포트 호출(스텁)'),
        }}
      />

      {/* 신청 완료 토스트(설계서 slide139 '신청 되었습니다.') */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        신청 되었습니다.
      </Toast>
    </div>
  )
}
DmstSosCnfdocListPage.displayName = 'DmstSosCnfdocListPage'
