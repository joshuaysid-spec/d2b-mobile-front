// 계약정보선택 — MUI-CM-04-M10 (실적증명서 신청 화면 – 계약정보선택). 설계서 slide286.
// 검색필터(MUI-CM-04-P11, CtrtInfoChc_SrchFilter)는 공통 SearchFilter 셸에 schema 주입(별도 파일 X).
// 기본 값: 1개월 이내 계약 목록. 카드 선택/해제(버튼 영역 = 카드 전체) — 선택 상태는 부모(플로우)가 소유.
// 계약구분에 따라 이후 스텝(신청정보의 사용목적/제출유형, 실적정보 분기)이 바뀐다(slide286).
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Card } from '@/ui/common/composites/Card'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { cn } from '@/utils/cn'
import type {
  SearchFilterSchema,
  SearchFilterValue,
  DateRangePresetDef,
} from '@/types/search-filter'
import type { PrfmncPrdocCtrtInfo } from '@/types/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-CM-04-P11 검색필터 schema (slide287 — P33 과 동일 구성·순서) ──────────
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]
const PRCS_STTS_OPTIONS = [{ value: 'all', label: '전체' }] // 코드값 미정 — 확정 시 채움

const SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '기간 설정',
      fields: [
        { type: 'segment', key: 'dateType', options: [{ value: 'aplyYmd', label: '검색 기간' }] },
        { type: 'dateRange', key: 'aplyYmd', required: true, presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어',
      fields: [
        { type: 'text', key: 'ctrtNo', label: '계약번호', placeholder: '계약번호를 입력하세요.' },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        {
          type: 'select',
          key: 'prcsStts',
          label: '처리상태',
          placeholder: '전체',
          options: PRCS_STTS_OPTIONS,
        },
      ],
    },
  ],
}

function buildDefaultValue(): SearchFilterValue {
  return {
    // 기본 값: 1개월 이내 계약 목록(slide286)
    aplyYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNo: '',
    prcsStts: 'all',
  }
}

const SEARCH_TARGETS = [{ value: 'ctrtNo', label: '계약번호' }]

// ── 목업 (dm_ctrtInfo 항목명/형식 — API 연동 시 교체) ─────────────────────────
// 분기 데모: 방위사업청(물품 → 사용목적·T12) + 부대·시설공사(→ 제출유형·T13 unitB).
const dl_ctrtList: PrfmncPrdocCtrtInfo[] = [
  {
    ctrtNo: '2025093455',
    CtrtOd: '00',
    ctrtCnNm: '물품',
    ctrtNm: '파카,외피 구매계약',
    rprsItemNm: '파카,외피',
    ctrtAmt: 11616000,
    orderInstNm: '방위사업청',
    picNm: '대령/운영자',
    enPicTel: '02-1234-5678',
  },
  {
    ctrtNo: '2026001234',
    CtrtOd: '00',
    ctrtCnNm: '시설공사',
    ctrtNm: '26-평 절개지 복구공사',
    rprsItemNm: '-',
    ctrtAmt: 210000000,
    orderInstNm: '육군 제1군단',
    picNm: '소령/시설담당',
    enPicTel: '02-2345-6789',
  },
  {
    ctrtNo: '2026005678',
    CtrtOd: '01',
    ctrtCnNm: '물품',
    ctrtNm: '전투화 구매계약',
    rprsItemNm: '전투화',
    ctrtAmt: 33500000,
    orderInstNm: '방위사업청',
    picNm: '대령/운영자',
    enPicTel: '02-1234-5678',
  },
  {
    ctrtNo: '2026009012',
    CtrtOd: '00',
    ctrtCnNm: '용역',
    ctrtNm: '26-시설물 유지관리 용역',
    rprsItemNm: '-',
    ctrtAmt: 47200000,
    orderInstNm: '해군본부',
    picNm: '중령/용역담당',
    enPicTel: '02-3456-7890',
  },
]

// ⚠️ 임시 목업 — API 연동 시 서버 조회(page/pageSize/검색조건)로 교체(목록 컨벤션 동일).
const TOTAL = 24
const MOCK_LIST: PrfmncPrdocCtrtInfo[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_ctrtList[i % dl_ctrtList.length]
  return { ...base, ctrtNo: `${base.ctrtNo.slice(0, 6)}${String(i + 1000)}` }
})

// 선택 비교 키 — 계약번호+차수.
const ctrtKey = (c: PrfmncPrdocCtrtInfo) => `${c.ctrtNo}-${c.CtrtOd}`

export interface CtrtInfoChcProps {
  /** 현재 선택된 계약(부모 소유). */
  selected: PrfmncPrdocCtrtInfo | null
  /** 카드 선택/해제(같은 카드 재클릭 = 해제 요청). 작성내용 보호 팝업은 부모 담당. */
  onSelect: (ctrt: PrfmncPrdocCtrtInfo | null) => void
}

export function CtrtInfoChc({ selected, onSelect }: CtrtInfoChcProps) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string } | null>(null)

  const defaultValue = useMemo(() => buildDefaultValue(), [])

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[CtrtInfoChc] 상세필터 검색', value)
    // 추후 API: 계약 목록 조회(dm_ctrtInfo)
  }
  const handleQuickSearch = () => {
    setAppliedSearch({ keyword: keyword.trim() })
    setPage(1)
    console.log('[CtrtInfoChc] 빠른검색(계약번호)', keyword)
  }

  // ── ⚠️ 임시 목업 검색/페이징 ──
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return MOCK_LIST
    const kw = appliedSearch.keyword.toLowerCase()
    return MOCK_LIST.filter((it) => it.ctrtNo.toLowerCase().includes(kw))
  }, [appliedSearch])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  return (
    <div className="flex w-full flex-col">
      {/* 안내(slide286) */}
      <div className="flex flex-col gap-1 px-4 pt-4">
        <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">계약 정보 선택</h3>
        <p className="text-[17px] leading-normal text-krds-text-ink">
          계약 정보로 실적 증명서를 신청할 수 있습니다.
        </p>
      </div>

      {/* 빠른검색(계약번호) + 검색필터(P11) */}
      <div className="px-4 py-4">
        <SearchCondition
          targets={SEARCH_TARGETS}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onFilterClick={() => setOpen(true)}
          filterActive={filterApplied}
          onSearch={handleQuickSearch}
        />
      </div>

      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* 계약 카드 — 카드 전체가 선택 토글 버튼(slide286). footer 는 선택표시(ON/OFF) 시각 요소. */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        {visibleList.map((it) => {
          const isSelected = selected !== null && ctrtKey(selected) === ctrtKey(it)
          return (
            <Card
              key={ctrtKey(it)}
              badges={<Badge>{it.ctrtCnNm}</Badge>}
              subtitle={`계약번호 ${it.ctrtNo} (${it.CtrtOd})`}
              title={it.ctrtCnNm === '물품' ? it.rprsItemNm : it.ctrtNm}
              rows={[
                { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
                { label: '발주기관', value: it.orderInstNm },
              ]}
              footer={
                <span
                  aria-hidden
                  className={cn(
                    'flex h-10 w-full items-center justify-center rounded-krds-8 border text-[17px] font-bold',
                    isSelected
                      ? 'border-transparent bg-krds-action-primary-active text-white'
                      : 'border-krds-border-field bg-background text-krds-text-ink',
                  )}
                >
                  {isSelected ? '선택됨' : '선택'}
                </span>
              }
              onClick={() => onSelect(isSelected ? null : it)}
              className={cn(isSelected && 'border-2 border-krds-action-primary-active')}
            />
          )
        })}
      </div>

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setPage(page + 1)}
          >
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 검색필터 풀팝업(MUI-CM-04-P11) — 공통 셸 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={SEARCH_SCHEMA}
        value={filter}
        defaultValue={defaultValue}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
CtrtInfoChc.displayName = 'CtrtInfoChc'
