// 보관함 품목 관리 (MUI-CM-01-M73, 설계서 slide308~311 + 최종 확정 260709). 공고입찰품목 중 보관함에 품목을 추가/삭제.
// 레퍼런스: 입찰공고 통합목록 BidPbancIntgListPage (검색·페이징 동일 패턴).
// 구성: 검색조건(SearchCondition, 필터→풀팝업) + 목록헤더 + 품목 카드 + 더보기 + FAB.
//   ※ 최종 확정(260709): 선택 버튼·일괄 추가/삭제 삭제 — 카드마다 보관함 여부에 따라 [보관함 추가]/[보관함 삭제] 단일 버튼만 노출.
// 카드에 추가/삭제 버튼이 있어 CardList(onClick=button 컨테이너) 대신 Card 를 직접 조립(중첩 버튼 방지).
// 데이터: 페이지 내 목업(dl_resultList, 항목명 설계서 그대로) — 추후 API: bdService.selectOvsLockerBidItemList.
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Card } from '@/ui/common/composites/Card'
import { CardList } from '@/ui/common/composites/CardList'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Toast } from '@/ui/common/composites/Toast'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  DateRangePresetDef,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'
// 보관함 공고 타입 — @/types/bd 공유 타입.
import type { MockOvsLockerPbanItem } from '@/types/mock/bd'

/**
 * 입찰품목 1건 (MUI-CM-01-M73, 설계서 slide310 1.2 입찰품목목록 데이터영역 dl_resultList).
 * 항목명(영문)·자리수는 설계서 그대로.
 */
export interface OvsLockerBidItem {
  /** 렌더 key/선택 식별자 — 통합참조번호+항목번호 조합(품목엔 상세 페이지 없음, slide308) */
  id: string
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 공고차수 (pbancOd, 2) */
  pbancOd: string
  /** 통합참조번호 (intgRfrncNo, 30) */
  intgRfrncNo: string
  /** 구매요청번호 (prchsDmndNo, 10) */
  prchsDmndNo: string
  /** 항목번호 (frcptlArtclNo, 5) */
  frcptlArtclNo: string
  /** 재고번호 (invtNo, 9) */
  invtNo: string
  /** 부품번호 (prtsNo, 32) */
  prtsNo: string
  /** 품명 (itemNm, 200) */
  itemNm: string
  /** 단위 (unitNm, 2) */
  unitNm: string
  /** 수량 (qty, 15) */
  qty: string
  /** 지시단가 (drctnUntprc, 25) */
  drctnUntprc: number
  /** 화폐단위 (crncNm, 100) — 예: 미달러 */
  crncNm: string
  /** 보관함여부 (lockerYn, 1) — 값(Y, N) */
  lockerYn: 'Y' | 'N'
  /** 입찰내역작성여부 (tmprBidCnEn, 1) — 값(Y, N) */
  tmprBidCnEn: 'Y' | 'N'
  // ── ⚠️ 설계서 데이터영역 미정의 임시 항목 (임시 영문키 + 주석 관례) ──────────────────
  /** 화폐코드 — 지시단가 표기 '20,767.85 USD (미달러)' 의 USD. 상세설계 확정 시 교체 */
  crncCd: string
}

// 빠른검색 대상 — 설계서 slide308 검색영역(통합참조번호/구매요청번호).
const SEARCH_TARGETS = [
  { value: 'intgRfrncNo', label: '통합참조번호' },
  { value: 'prchsDmndNo', label: '구매요청번호' },
]

// ── 상세필터 schema — 설계서 slide417·418 1.1 보관함품목 검색조건(dm_searchInfo) ──
// 일자구분(srchYmdSe) — 설계서 slide417 '개찰일자, 공고일자 토글 스위치' 2종(구 3종
//   개찰일자/입찰참가/입찰서제출에서 축소). ⚠️ 항목설명(slide418)의 구분코드 GTSB0001 설명은
//   아직 구 3종 표기라 코드값은 상세설계 확정 시 대조 필요 — '공고'는 임시 코드값(pbanc).
// 빠른 설정 칩 — 설계서 slide417: 최근 1개월/최근 3개월/최근 6개월.
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]
const ITEM_FILTER_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '일자 설정',
      fields: [
        {
          type: 'segment',
          key: 'srchYmdSe',
          options: [
            { value: 'bdopn', label: '개찰' },
            { value: 'pbanc', label: '공고' },
          ],
        },
        // 기준일자시작(srchEndYmd)~기준일자끝(srchBgngYmd) — value 는 { start, end } 로 관리.
        { type: 'dateRange', key: 'date', presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'intgRfrncNo', label: '통합참조번호', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'prchsDmndNo', label: '구매요청번호', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'invtNo', label: '재고번호', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'prtsNo', label: '부품번호', placeholder: '번호를 입력하세요.' },
      ],
    },
    {
      // 보관함여부(lockerYn) — 보관함에 추가된 품목인지 여부(설계서 slide310 1.1).
      key: 'lockerYn',
      title: '보관함여부',
      fields: [
        {
          // v0.87 검토85 — radio → select 전환.
          type: 'select',
          key: 'lockerYn',
          options: [
            { value: 'all', label: '전체' },
            { value: 'Y', label: '보관' },
            { value: 'N', label: '미보관' },
          ],
        },
      ],
    },
  ],
}
const DEFAULT_FILTER: SearchFilterValue = {
  srchYmdSe: 'bdopn',
  date: { start: '', end: '' },
  intgRfrncNo: '',
  prchsDmndNo: '',
  invtNo: '',
  prtsNo: '',
  lockerYn: 'all',
}

const TOTAL = 258 // 총 건수(목업 — 설계서 slide308 '더보기(10/258)'. 실제 API total)

// 입찰품목 목록 목업 생성 — 상위(보관함 상세)에서 넘어온 공고 항목이 있으면 그 공고 번호를 반영.
// 값 형식은 설계서 slide308 그대로(재고번호 9자리·부품번호·지시단가 20,767.85 USD (미달러)).
// 추후 API: bdService.selectOvsLockerBidItemList(pbancNo, ...) 응답으로 교체.
function buildMockItems(pbanc: MockOvsLockerPbanItem | null): OvsLockerBidItem[] {
  const base = {
    pbancNo: pbanc?.pbancNo ?? 'EFE00012',
    pbancOd: pbanc?.pbancOd ?? '2',
    intgRfrncNo: pbanc?.intgRfrncNo ?? 'BDF01823EFE',
    prchsDmndNo: pbanc?.prchsDmndNo ?? 'BDF01823-002',
  }
  const seeds: Array<
    Pick<OvsLockerBidItem, 'itemNm' | 'prtsNo' | 'unitNm' | 'qty' | 'drctnUntprc' | 'lockerYn' | 'tmprBidCnEn'>
  > = [
    { itemNm: 'RECOIL', prtsNo: 'A46MSB0', unitNm: 'EA', qty: '2', drctnUntprc: 20767.85, lockerYn: 'Y', tmprBidCnEn: 'N' },
    { itemNm: 'RECOIL', prtsNo: 'A46MSB1', unitNm: 'EA', qty: '2', drctnUntprc: 20767.85, lockerYn: 'N', tmprBidCnEn: 'N' },
    { itemNm: 'BREECH ASSEMBLY', prtsNo: 'B12KTA7-01', unitNm: 'EA', qty: '16', drctnUntprc: 608000.0, lockerYn: 'Y', tmprBidCnEn: 'Y' },
    { itemNm: 'SEAL RING KIT', prtsNo: 'C03QRS22', unitNm: 'SE', qty: '40', drctnUntprc: 132.5, lockerYn: 'N', tmprBidCnEn: 'N' },
  ]
  return Array.from({ length: TOTAL }, (_, i) => {
    const seed = seeds[i % seeds.length]
    const frcptlArtclNo = String(i + 1)
    return {
      ...base,
      ...seed,
      id: `${base.intgRfrncNo}-${frcptlArtclNo}`,
      frcptlArtclNo,
      invtNo: String(101537518 + i), // 재고번호 9자리
      crncNm: '미달러',
      crncCd: 'USD',
    }
  })
}

/** 지시단가 표기 — '20,767.85 USD (미달러)' (설계서 slide308). */
function formatUntprc(it: OvsLockerBidItem) {
  const amount = it.drctnUntprc.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${amount} ${it.crncCd} (${it.crncNm})`
}

export function OvsLockerItemRegPage() {
  // 상위(보관함 상세)에서 navigate state 로 넘어온 공고 — 직접 URL 진입이면 null(목업 기본값 사용).
  const pbanc = useLocation().state as MockOvsLockerPbanItem | null
  const [items, setItems] = useState<OvsLockerBidItem[]>(() => buildMockItems(pbanc))

  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['intgRfrncNo'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' })

  // ── API 경계 스텁 (백엔드 연동 시 services/bd 로 대체) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[OvsLockerItem] 상세필터 검색', value) // 추후 API: bdService.selectOvsLockerBidItemList
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'intgRfrncNo'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
    console.log('[OvsLockerItem] 빠른검색', { keyword, target }) // 추후 API: bdService.selectOvsLockerBidItemList
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[OvsLockerItem] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[OvsLockerItem] loadMore → page', next)
  }

  // 보관함 추가/삭제 — 설계서 이벤트 btn_addItem/btn_deleteItem_onclick.
  //   단건 추가/삭제만(2026-09-01 사용자 재확정 — 검토84 의 체크박스·일괄 버튼은 도입하지 않음, 260709 확정 유지).
  const toggleLocker = (target: OvsLockerBidItem) => {
    const adding = target.lockerYn === 'N'
    setItems((prev) =>
      prev.map((it) => (it.id === target.id ? { ...it, lockerYn: adding ? 'Y' : 'N' } : it)),
    )
    setToast({
      open: true,
      message: adding ? '보관함에 추가되었습니다.' : '보관함에서 삭제되었습니다.',
    })
    console.log('[OvsLockerItem]', adding ? '보관함 추가' : '보관함 삭제', target.id)
    // 추후 API: bdService.insertItemToLocker / bdService.deleteItemFromLocker
  }

  // ── 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 교체) ──
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return items
    const kw = appliedSearch.keyword.toLowerCase()
    return items.filter((it) => {
      const field = appliedSearch.target === 'prchsDmndNo' ? it.prchsDmndNo : it.intgRfrncNo
      return field.toLowerCase().includes(kw)
    })
  }, [items, appliedSearch])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  return (
    <div className="flex w-full flex-col">
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
          placeholder="검색할 내용을 입력하세요."
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

      {/* 품목 카드 — 상세 페이지 없음. 보관함 여부에 따라 [보관함 추가]/[보관함 삭제] 단일 버튼(최종 확정 260709). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-krds-7">
        {visibleList.length === 0 ? (
          <CardList items={[]} emptyText="데이터가 없습니다." />
        ) : (
          visibleList.map((it) => {
            return (
              <Card
                key={it.id}
                className="shadow-krds-card"
                badges={
                  <>
                    {it.lockerYn === 'Y' ? (
                      <Badge type="solid" color="blue">보관함 보관</Badge>
                    ) : (
                      <Badge>보관함 미보관</Badge>
                    )}
                    {it.tmprBidCnEn === 'Y' ? (
                      <Badge type="solid" color="green">입찰내역 작성</Badge>
                    ) : (
                      <Badge type="pastel" color="yellow">입찰내역 미작성</Badge>
                    )}
                  </>
                }
                subtitle={`통합참조번호 ${it.intgRfrncNo} / 공고번호 ${it.pbancNo}-${it.pbancOd}`}
                title={it.itemNm}
                rows={[
                  { label: '구매요청번호', value: it.prchsDmndNo },
                  { label: '재고번호', value: it.invtNo },
                  { label: '부품번호', value: it.prtsNo },
                  { label: '수량 / 단위', value: `${Number(it.qty).toLocaleString()} ${it.unitNm}` },
                  { label: '지시단가 / 화폐단위', value: formatUntprc(it) },
                  { label: '보관함 여부', value: it.lockerYn === 'Y' ? 'O' : 'X' },
                  { label: '입찰내역 작성 여부', value: it.tmprBidCnEn === 'Y' ? 'O' : 'X' },
                ]}
                footer={
                  <ButtonGroup
                    layout="single"
                    items={[
                      {
                        label: it.lockerYn === 'Y' ? '보관함 삭제' : '보관함 추가',
                        variant: 'secondary',
                        onClick: () => toggleLocker(it),
                      },
                    ]}
                  />
                }
              />
            )
          })
        )}
      </div>

      {/* 더보기 — 모두 노출됐으면 숨김 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}


      {/* 맨 위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 상세필터 풀팝업 — 공통 SearchFilter 셸(설계서 slide309 검색필터) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={ITEM_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />

      {/* 보관함 추가/삭제 토스트 */}
      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        {toast.message}
      </Toast>
    </div>
  )
}
OvsLockerItemRegPage.displayName = 'OvsLockerItemRegPage'
