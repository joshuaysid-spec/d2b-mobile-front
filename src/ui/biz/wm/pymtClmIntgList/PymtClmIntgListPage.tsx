// 대금청구통합목록 — MUI-WM-01-M01 PymtClmIntgList. 설계서 05.대금청구및사후 v0.83 slide16~21.
// 구성: 검색조건(SearchCondition, 대상칩 계약명/계약번호 + 필터버튼→풀팝업) + 안내문 버튼
//      + 목록헤더(총건수·page size) + 카드 리스트 + 더보기 + FAB
//      + 검색필터(SearchFilter schema 주입, MUI-WM-01-P12) + 신청목록 바텀시트(MUI-WM-01-P13).
// 데이터: wmQueries.useSelectPymtClmIntgList(queries/bds/wm) — 목업/실연동은 wmService(USE_MOCK)가 전환. 목업은 mocks/wm.ts.
// 카드 클릭(slide17): 진행중 청구 있으면 P13 바텀시트 · 없으면 토스트("진행중인 대금청구건이 없는...").
// 신청 카드 클릭(slide21): 청구서 종류별 상세 분기(M02/M03/M05~M08/M13) — 상세 구현 그룹에서 배선.
// 안내문(P09 대금청구 안내문)은 그룹 3(중앙조달 상세)에서 구현 후 배선 — 현재 콘솔 스텁.
// 업무도움(slide16 1])은 '내역이 없으면 항목을 표시하지 않음' — 안내 내역 확정 전이라 미표시(EX·CT 동일).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { wmQueries } from '@/queries/bds/wm/queries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Toast } from '@/ui/common/composites/Toast'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { PymtClmIntgAplyList } from '@/ui/biz/wm/pymtClmIntgList/PymtClmIntgAplyList'
import { PymtClmGdntcFullPopup } from '@/ui/biz/wm/centerPrcmPymtClmDtl/PymtClmGdntcFullPopup'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { PymtClmAplyItem, PymtClmListItem } from '@/types/wm'

const DATE_FORMAT = 'YYYY-MM-DD'

// ── MUI-WM-01-P12 검색필터 schema (slide18) — 키는 검색조건(dmt_PymtClmIntgSrch) 항목명 그대로 ──

// 일자 프리셋 칩 — 최근 1/3/6개월(slide18 3-3).
const DATE_PRESETS = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

const WM_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSeCd',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeCd',
          required: true, // 필수값(slide18) — default 전체
          selectAll: { value: '0' }, // '0' = '전체' 코드값 — 전체 선택 시 값 배열에 포함
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
      key: 'date',
      title: '검색 설정',
      fields: [{ type: 'dateRange', key: 'ctrtYmd', label: '계약일자', presets: DATE_PRESETS }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'ctrtNm', label: '계약명', placeholder: '계약건명을 입력하세요.' },
        // 계약번호 — 계약번호조회 공통시트(MUI-EX-02-P79, OvsCtrtNoInq). 셸이 시트를 직접 연다.
        {
          type: 'selectionField',
          key: 'ctrtNo',
          label: '계약번호',
          placeholder: '번호를 입력하세요.',
          searchSheet: 'ctrtNo',
        },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        // 대금청구구분(slide18) — ⚠️ 검색조건 항목명 미정의, 임시 키(pymtClmSeCd).
        {
          type: 'select',
          key: 'pymtClmSeCd',
          label: '대금청구구분',
          placeholder: '전체',
          options: [
            { value: 'all', label: '전체' },
            { value: 'prpay', label: '선금신청' },
            { value: 'dpsmnItrpy', label: '착중도금신청' },
            { value: 'pymtClm', label: '대금청구신청' },
            { value: 'epfcClcln', label: '사후정산청구서' },
          ],
        },
      ],
    },
  ],
}

// On-Load 기본값(slide21): 계약일자 = 현재일-1개월 ~ 현재일, 업무구분 = 전체.
function buildDefaultValue(): SearchFilterValue {
  return {
    taskSeCd: ['0', 'goods', 'service', 'construction', 'foreign'], // 전체('0' = 전체 코드값)
    ctrtYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    ctrtNm: '',
    ctrtNo: '',
    pymtClmSeCd: 'all',
  }
}

// 빠른검색 대상 칩 — slide16 목업(계약명/계약번호).
const SEARCH_TARGETS = [
  { value: 'ctrtNm', label: '계약명' },
  { value: 'ctrtNo', label: '계약번호' },
]

export function PymtClmIntgListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업(MUI-WM-01-P12)
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [keyword, setKeyword] = useState('')
  const [targets, setTargets] = useState<string[]>(['ctrtNm'])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterApplied, setFilterApplied] = useState(false)
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )
  // P13 신청목록 바텀시트 — 선택한 계약(진행중 청구 보유 건). null=닫힘.
  const [pickedCtrt, setPickedCtrt] = useState<PymtClmListItem | null>(null)
  // 진행중 청구 없음 토스트(slide17)
  const [toastOpen, setToastOpen] = useState(false)
  // 대금청구 안내문(MUI-WM-01-P09) 풀팝업
  const [gdntcOpen, setGdntcOpen] = useState(false)

  const { data: listData, isLoading } = wmQueries.useSelectPymtClmIntgList()

  // P13 콘텐츠 내부 상태(페이징)는 key=선택 계약 id 리마운트로 초기화(P10 stale 버그 선례 예방).
  const sheetOpen = pickedCtrt !== null

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'ctrtNm'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
  }
  // 카드 클릭(slide17) — 진행중 청구 있으면 P13 바텀시트, 없으면 토스트.
  const handleCardClick = (item: PymtClmListItem) => {
    if (item.pymtClmExstYn !== 'Y') {
      setToastOpen(true)
      return
    }
    setPickedCtrt(item)
  }
  // 신청 카드 클릭(slide21) — 청구서 종류(clmDocNm, 임시 키)별 상세 분기.
  const handleAplyClick = (item: PymtClmAplyItem) => {
    if (item.clmDocNm === '선금신청서') {
      navigate('/wm/prpayApfrDtl', { state: item })
      return
    }
    if (item.clmDocNm === '착중도금신청서') {
      navigate('/wm/dpsmnItrpyApfrDtl', { state: item })
      return
    }
    if (item.clmDocNm === '대금청구서') {
      // 유형 구분(prcmSeNm, 임시 키)으로 중앙(M05)/부대(M06)/공사(M07)/기성대가(M08) 분기.
      const path =
        item.prcmSeNm === '부대'
          ? '/wm/sbsdPrcmPymtClmDtl'
          : item.prcmSeNm === '공사'
            ? '/wm/cstrnPymtClmDtl'
            : item.prcmSeNm === '기성대가'
              ? '/wm/pxcndCstPymtClmDtl'
              : '/wm/centerPrcmPymtClmDtl'
      navigate(path, { state: item })
      return
    }
    if (item.clmDocNm === '사후정산청구서') {
      navigate('/wm/epfcClclnClmDtl', { state: item })
      return
    }
    console.log('[P13] 상세 이동 — 미확인 청구서 종류', item.clmDocNm, item.id)
  }

  // ── 키워드 필터 + 더보기 슬라이스 — 클라이언트 로직(서버 페이징 전환 시 삭제) ──
  const filteredList = useMemo(() => {
    const list = listData?.list ?? []
    if (!appliedSearch || !appliedSearch.keyword) return list
    const kw = appliedSearch.keyword.toLowerCase()
    return list.filter((it) => {
      const field = appliedSearch.target === 'ctrtNm' ? it.ctrtNm : `${it.ctrtNo}-${it.ctrtCycl}`
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch, listData])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 카드 매핑 — slide16 목업: 뱃지(업무구분/계약방법 + 입찰구분/계약종류) +
  // subtitle(계약번호+회차, 4-2]) + title(계약명, 4-3]) + 행(계약일자/발주기관/계약금액).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSeCd}</Badge>
        <Badge>{it.ctrtMthdCd}</Badge>
        <Badge>{it.bidMthdNm}</Badge>
        {it.jntCtrtCdNm && <Badge>{it.jntCtrtCdNm}</Badge>}
      </>
    ),
    subtitle: `계약번호 ${it.ctrtNo} - ${it.ctrtCycl}`,
    title: it.ctrtNm,
    rows: [
      { label: '계약일자', value: it.ctrtYmd },
      { label: '발주기관', value: it.orderInstNm },
      { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 대상칩(계약명/계약번호) + 필터버튼 + 검색어 입력 + 검색 버튼 */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
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
        {/* 안내문(MUI-WM-01-P09 대금청구 안내문, slide16 6]) */}
        <Button variant="secondary" size="sm" className="self-end" onClick={() => setGdntcOpen(true)}>
          안내문
        </Button>
      </div>

      {/* 목록 헤더 — 총건수 + 표시개수(10/30/50) */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* 카드 목록 */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} loading={isLoading} />
      </div>

      {/* 더보기 — 표시개수만큼 추가 로드. 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
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

      {/* 상세필터 풀팝업(MUI-WM-01-P12) — 공통 SearchFilter 셸에 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={WM_SEARCH_SCHEMA}
        value={filter}
        defaultValue={buildDefaultValue()}
        onSearch={handleFilterSearch}
      />

      {/* 대금청구신청목록(MUI-WM-01-P13) 바텀시트 — 컨테이너는 페이지 소유, 콘텐츠만 분리.
          key=계약번호: 다른 계약으로 재오픈 시 콘텐츠(페이징 등) 리마운트로 초기화(P10 stale 버그 예방). */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPickedCtrt(null)
        }}
        title="대금청구 신청목록"
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setPickedCtrt(null)}>
            닫기
          </Button>
        }
      >
        <PymtClmIntgAplyList
          key={pickedCtrt?.id ?? 'none'}
          ctrtNo={pickedCtrt?.ctrtNo ?? ''}
          ctrtCycl={pickedCtrt?.ctrtCycl ?? ''}
          ctrtNm={pickedCtrt?.ctrtNm ?? ''}
          open={sheetOpen}
          onItemClick={handleAplyClick}
        />
      </BottomSheet>

      {/* 대금청구 안내문(MUI-WM-01-P09) 풀팝업 */}
      <PymtClmGdntcFullPopup open={gdntcOpen} onOpenChange={setGdntcOpen} />

      {/* 진행중 청구 없음 토스트(slide17) */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)} duration={2000}>
        진행중인 대금청구건이 없는 계약입니다.
      </Toast>
    </div>
  )
}
PymtClmIntgListPage.displayName = 'PymtClmIntgListPage'
