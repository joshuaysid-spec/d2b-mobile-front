// 국외조달원등록증신청목록 — MUI-CM-04-M21. 설계서 00.공통 v0.84 slide331~333 (화면 목록 slide214).
// 고객센터 > 민원서류발급신청(M04 허브) 하위. Figma 전용 프레임 없음 → 목록 컨벤션.
// 기 신청 내역 카드 목록(진행상태 신청/반려/승인). **상세 화면 없음**.
// 카드 클릭: 신청(P)/승인(A) → 서류 출력 확인 팝업(MUI-BD-01-P14, AlertModal 인라인) → OZ 리포트(스텁).
//   반려(R) → 카드에 반려사유만 표시, 클릭 무동작(팝업/상세 없음). (2026-07-20 요청)
// (+) FAB → 국외조달원등록증신청(MUI-CM-04-M22 OvsSosCnfdocRegPage) 페이지로 이동
//   (2026-07-20 팝업→페이지 · 2026-07-31 하단 고정 [신청] 바 → FAB (+) 이동 요청).
// 검색필터는 공통 SearchFilter 셸 schema 주입(기간*/검색어 발급 업체명/구분 진행상태).
// mock 상단은 빠른검색 없이 필터 버튼만 — SearchCondition 필터 버튼과 동일 스타일 로컬 버튼.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/constants/routes'
import type {
  SearchFilterSchema,
  SearchFilterValue,
  DateRangePresetDef,
} from '@/types/search-filter'
import type { OvsSosCnfdocItem, OvsSosPrcsStcd } from '@/types/mock/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

// 진행상태(prcsStcd) 코드 → 표시명 (slide332 — 신청(P)/반려(R)/승인(A))
const PRCS_STCD_NM: Record<OvsSosPrcsStcd, string> = { P: '신청', R: '반려', A: '승인' }

// ── 검색필터 schema (slide331 — 기간* → 검색어 → 구분) ───────────────────────
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
        { type: 'segment', key: 'dateType', options: [{ value: 'aplyYmd', label: '검색 기간' }] },
        { type: 'dateRange', key: 'aplyYmd', required: true, presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        {
          type: 'text',
          key: 'trgtBzentyCdNm',
          label: '발급 업체명',
          placeholder: '발급 대상 업체명을 입력하세요.',
        },
      ],
    },
    {
      key: 'category',
      title: '구분 설정',
      fields: [
        {
          type: 'select',
          key: 'prcsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: [
            { value: 'all', label: '전체' },
            { value: 'P', label: '신청' },
            { value: 'R', label: '반려' },
            { value: 'A', label: '승인' },
          ],
        },
      ],
    },
  ],
}

function buildDefaultValue(): SearchFilterValue {
  return {
    aplyYmd: {
      start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
      end: dayjs().format(DATE_FORMAT),
    },
    trgtBzentyCdNm: '',
    prcsStcd: 'all',
  }
}

// ── 목업 (dl_resultList + dm_ovsSosAplyDtlInfo 항목명/형식 — API 연동 시 교체) ─
const dl_resultList: OvsSosCnfdocItem[] = [
  {
    aplyRcptNo: '2020101010',
    trgtBzentyCdNm: '발급 대상업체명',
    prcsStcd: 'P',
    aplyYmd: '2020-10-10',
    aprvYmd: undefined,
    aplyRsn: '작성한 발급 사유가 표시됩니다. 여러줄 인 경우 2줄까지 표시합니다.',
    aplcntEntlno: '010-1234-5678',
    aplcntNm: '홍길동',
    bzentyNm: '조달업체명 표시',
  },
  {
    aplyRcptNo: '2020101011',
    trgtBzentyCdNm: '발급 대상업체명',
    prcsStcd: 'A',
    aplyYmd: '2020-10-10',
    aprvYmd: '2020-10-15',
    aplyRsn: '작성한 발급 사유가 표시됩니다. 여러줄 인 경우 2줄까지 표시합니다.',
    aplcntEntlno: '010-1234-5678',
    aplcntNm: '홍길동',
    bzentyNm: '조달업체명 표시',
  },
  {
    aplyRcptNo: '2020101012',
    trgtBzentyCdNm: '발급 대상업체명',
    prcsStcd: 'R',
    aplyYmd: '2020-10-12',
    aprvYmd: undefined,
    aplyRsn: '작성한 발급 사유가 표시됩니다.',
    rjctRsn: '반려 사유가 표시됩니다. 신청 정보를 보완하여 다시 신청해 주세요.',
    aplcntEntlno: '010-1234-5678',
    aplcntNm: '홍길동',
    bzentyNm: '조달업체명 표시',
  },
]

// ⚠️ 임시 목업 — API 연동 시 서버 조회(page/pageSize/검색조건)로 교체(목록 컨벤션).
const TOTAL = 24
const MOCK_LIST: OvsSosCnfdocItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_resultList[i % dl_resultList.length]
  return { ...base, aplyRcptNo: `20201010${String(i + 10)}` }
})

export function OvsSosCnfdocListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 검색필터 풀팝업
  const [aplySheetOpen, setAplySheetOpen] = useState(false) // (+) 신청 바텀시트
  const [filter, setFilter] = useState<SearchFilterValue>(() => buildDefaultValue())
  const [filterApplied, setFilterApplied] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [outputOpen, setOutputOpen] = useState(false) // 서류 출력 확인(MUI-BD-01-P14)
  const [outputTarget, setOutputTarget] = useState<OvsSosCnfdocItem | null>(null)

  const defaultValue = useMemo(() => buildDefaultValue(), [])

  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setFilterApplied(true)
    setPage(1)
    console.log('[OvsSosCnfdocList] 상세필터 검색', value)
    // 추후 API: scwin.btn_ovsSosAplyListSrch — 검색조건으로 신청 정보 검색
  }

  // 카드 클릭 — 신청(P)/승인(A) → 서류 출력 확인(P14). 반려(R)는 클릭 무동작(반려사유만 카드 표시).
  const handleCardClick = (item: OvsSosCnfdocItem) => {
    setOutputTarget(item)
    setOutputOpen(true)
  }

  const total = MOCK_LIST.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = MOCK_LIST.slice(0, loaded)

  // 카드(slide331) — 배지(진행상태) + 접수번호 + 발급 대상업체명 + 발급사유(2줄, 반려 시 반려 사유) + 정보행.
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.aplyRcptNo,
    badges: <Badge>{PRCS_STCD_NM[it.prcsStcd]}</Badge>,
    subtitle: `접수번호 ${it.aplyRcptNo}`,
    title: it.trgtBzentyCdNm,
    rows: [
      {
        label: it.prcsStcd === 'R' ? '반려 사유' : '발급사유',
        value: (
          <span className="line-clamp-2">
            {it.prcsStcd === 'R' ? (it.rjctRsn ?? '-') : it.aplyRsn}
          </span>
        ),
      },
      { label: '신청인', value: it.aplcntNm },
      { label: '회사명', value: it.bzentyNm },
      { label: '연락처', value: it.aplcntEntlno },
      { label: '신청일자', value: it.aplyYmd },
      { label: '승인일자', value: it.aprvYmd ?? '-' },
    ],
    // 상세 화면 없음(slide331). 신청(P)/승인(A) 클릭 → 서류 출력 확인(P14).
    // 반려(R)는 클릭 무동작(onClick 미부여) — 카드에 반려사유만 표시.
    onClick: it.prcsStcd === 'R' ? undefined : () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 필터 버튼 행 — mock 은 빠른검색 없이 검색필터 버튼만(SearchCondition 필터 버튼 스타일) */}
      {/* 상단바 — 좌: 검색필터 버튼 / 우: 표시개수(추가정보신청목록 M03 과 통일, 260828 사용자 확정). */}
      <ListSectionHeader
        className="px-4 pt-4"
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        leftSlot={
          <Button variant="secondary" onClick={() => setOpen(true)} aria-pressed={filterApplied}>
            <Icon name="Tune" aria-hidden />
            검색필터
          </Button>
        }
      />

      {/* 신청 내역 카드 */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* FAB — 맨위로 + 더하기. (+) → 신청 바텀시트(PrfmncPrdocPage 동일 패턴). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
        onPlus={() => setAplySheetOpen(true)}
        plusLabel="국외 조달원 등록증 신청"
      />

      {/* 신청 바텀시트 — 컨테이너는 페이지 소유(공통 BottomSheet 조립).
          [신청] → 국외조달원등록증신청(MUI-CM-04-M22 OvsSosCnfdocRegPage) 이동. */}
      <BottomSheet
        open={aplySheetOpen}
        onOpenChange={setAplySheetOpen}
        title="국외 조달원 등록증 신청"
      >
        <ButtonGroup
          layout="vertical"
          items={[
            {
              label: '국외 조달원 등록증 신청',
              variant: 'secondary',
              onClick: () => {
                setAplySheetOpen(false)
                navigate(ROUTES.SUPPORT_OVS_SOS_CNFDOC_REG)
              },
            },
          ]}
        />
      </BottomSheet>

      {/* 검색필터 풀팝업 — 공통 셸 schema 주입 */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={SEARCH_SCHEMA}
        value={filter}
        defaultValue={defaultValue}
        onSearch={handleFilterSearch}
      />

      {/* 서류 출력 확인 (MUI-BD-01-P14) — 신청/승인 카드 클릭 시 OZ 리포트 확인 후 등록증 발급(스텁) */}
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
            console.log(
              '[OvsSosCnfdocList] 국외 조달원 등록증 발급 — OZ 리포트 호출(스텁)',
              outputTarget?.aplyRcptNo,
            ),
        }}
      />
    </div>
  )
}
OvsSosCnfdocListPage.displayName = 'OvsSosCnfdocListPage'
