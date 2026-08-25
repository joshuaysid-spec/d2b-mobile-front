// MUI-CM-06-M04 나의업무이력현황 (MyTaskHstryPage). 설계서 00.공통 v0.84 slide80. **디자인 없음 → 기존 공통 재사용.**
// 종료된(완료/취소/포기) 업무 이력 목록. 셸 안 + sub헤더(뒤로+타이틀 '나의 업무 이력 현황'). 3뎁스라 BottomNav 숨김.
//
// 구성: 상단 분기 탭(입찰참가신청/입찰서제출/공개수의협상/계약, slide80 '상단 분기 버튼 추가') → 상단바(총건수+표시개수)
//   → 카드 리스트(공통 Card: 상태/업무/계약 배지 + 판단번호 + 공고명 + 발주예정월/발주기관/계약방법/예산금액) → 더보기 → FAB.
//   카드 클릭 → 상세: 입찰 계열(입찰참가신청/입찰서제출/공개수의협상)=입찰진행상세(MUI-BD-03-M02) · 계약=계약상세(분기, slide80).
//
// 데이터=파일 내 목업(설계서 slide80 형식), 동작=API 경계 스텁(console.log + '// 추후 …').
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import type { MyTaskHstryItem } from '@/types/mock/cm'
import type { BidPrgrsDetail } from '@/types/mock/bd'

// 상단 분기 탭 — 업무 이력 4가지 현황(설계서 slide80). taskSttsNm 으로 목록 필터.
const STTS_TABS: TabItem[] = [
  { value: '입찰참가신청', label: '입찰참가신청' },
  { value: '입찰서제출', label: '입찰서제출' },
  { value: '공개수의협상', label: '공개수의협상' },
  { value: '계약', label: '계약' },
]

// ── 목업 (설계서 slide80 예시/형식) ──────────────────────────────────────────
const dl_myTaskList: MyTaskHstryItem[] = [
  {
    id: '1',
    taskSttsNm: '입찰참가신청',
    prcmNo: '6000A',
    bidNm: "'26년 K5방독면",
    orderPrnmntYm: '2026-03',
    orderInstNm: '화력총괄계약팀',
    bidMthd: '총액제',
    bdgtAmt: 11616000,
    taskSeNm: '물품',
    ctrtMthd: '수의계약',
  },
  {
    id: '2',
    taskSttsNm: '입찰서제출',
    prcmNo: '2026-00590',
    bidNm: '26-평 절개지 복구공사',
    orderPrnmntYm: '2026-02',
    orderInstNm: '제9911부대',
    bidMthd: '총액제',
    bdgtAmt: 92472000,
    taskSeNm: '공사',
    ctrtMthd: '제한경쟁',
  },
  {
    id: '3',
    taskSttsNm: '공개수의협상',
    prcmNo: '6000B',
    bidNm: "'26년 K600 구난전차 정비부속",
    orderPrnmntYm: '2026-05',
    orderInstNm: '기동총괄계약팀',
    bidMthd: '총액제',
    bdgtAmt: 25300000,
    taskSeNm: '물품',
    ctrtMthd: '수의계약',
  },
  {
    // 계약 카드 — 상세(M03 /ct/:id)는 state 가 아니라 id 조회(목업 CTRT_PRGRS_DTL)로 렌더되므로,
    // 카드 값(건명/판단번호/기관/금액/뱃지)을 그 목업 건과 일치시켜 둔다(API 연동 시 서버가 동일 건 공급).
    id: '4',
    taskSttsNm: '계약',
    prcmNo: '99001',
    bidNm: '물품 구매',
    orderPrnmntYm: '2026-02',
    orderInstNm: '제8385부대',
    bidMthd: '경쟁입찰',
    bdgtAmt: 11616000,
    taskSeNm: '물품',
    ctrtMthd: '제한경쟁',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 페이징 로직을 통째로 교체(cmService.selectBidPrtcpAplyList).
const MOCK_LIST: MyTaskHstryItem[] = Array.from({ length: 99 }, (_, i) => ({
  ...dl_myTaskList[i % dl_myTaskList.length],
  id: String(i + 1),
}))

export function MyTaskHstryPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<string>('입찰참가신청')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // 탭(현황) 필터 → 페이징.
  const filtered = useMemo(() => MOCK_LIST.filter((it) => it.taskSttsNm === tab), [tab])
  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visible = filtered.slice(0, loaded)

  // ── 동작 스텁 ──
  const handleTab = (next: string) => {
    setTab(next)
    setPage(1)
    console.log('[MyTaskHstry] 탭', next) // 추후: cmService.selectBidPrtcpAplyList({ stts: next })
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[MyTaskHstry] pageSize →', size)
  }
  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[MyTaskHstry] loadMore')
  }
  // 카드 → 입찰진행상세(M02) state 매핑 — 상세 요약(뱃지/입찰건명/판단번호)·표(계약·입찰방법)가 카드와
  // 같은 값으로 뜨도록 BidPrgrsDetail 항목명으로 변환한다. 카드에 없는 상세 전용 항목은 '-'(API 연동 시
  // 상세 조회가 공급). taskSttsNm 은 M02 가 현황 뱃지(카드 1번 뱃지)로 그대로 노출.
  const toBidPrgrsState = (it: MyTaskHstryItem): BidPrgrsDetail & { taskSttsNm: string } => ({
    taskSttsNm: it.taskSttsNm,
    rNum: it.id,
    taskSeNm: it.taskSeNm,
    pbancNo: '', // 카드에 없음 → M02 요약 부제는 카드와 동일한 '판단번호 …'로 표기
    prcmNo: it.prcmNo,
    bidNm: it.bidNm,
    rfrncNo: '-',
    orderInstTelno: '-',
    ctrtMthdNm: it.ctrtMthd,
    bidMthdNm: it.bidMthd,
    bidClrsDt: '-',
    tndrSbmsnDdlnDt: '-',
    bzentySeNm: '-',
    // 종료된 이력 — 신청/제출 대상 플래그를 모두 끄면 M02 가 작성·신청 바로가기 없이 조회 전용으로 렌더.
    bfhdSrng: false,
    bidPrgrsApfr: false,
    tndr: false,
    techEvl: false,
    prdcpDcmntSbms: false,
  })
  const handleCardClick = (it: MyTaskHstryItem) => {
    // 계약 → 물품전자계약진행상세(MUI-CT-01-M03). URL 에 식별자를 두지 않아 항목을 state 로 넘긴다
    // (⚠️ 이력 아이템은 계약 상세가 기대하는 아이템 타입이 아님 — API 연동 시 계약 조회로 대체).
    // 추후: 계약상태/유형별 M03~M10 분기(계약통합목록 선례).
    if (it.taskSttsNm === '계약') {
      navigate('/ct/cmdtyElctrCtrtPrgrsDtl', { state: it })
      return
    }
    // 입찰 계열(입찰참가신청/입찰서제출/공개수의협상) → 입찰진행상세(MUI-BD-03-M02).
    navigate('/bd/bidPrgsDtlInq', { state: toBidPrgrsState(it) })
  }

  const cardItems: CardListItem[] = visible.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSttsNm}</Badge>
        <Badge>{it.taskSeNm}</Badge>
        <Badge>{it.ctrtMthd}</Badge>
      </>
    ),
    subtitle: `판단번호 ${it.prcmNo}`,
    title: it.bidNm,
    rows: [
      { label: '발주예정월', value: it.orderPrnmntYm },
      { label: '발주기관', value: it.orderInstNm },
      { label: '계약방법', value: it.bidMthd },
      { label: '예산금액', value: `${it.bdgtAmt.toLocaleString()} 원` },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 상단 분기 탭 — 4가지 현황(입찰참가신청/입찰서제출/공개수의협상/계약).
          line 탭 + fitted(4등분 균등 폭, 스크롤 없음) — 구 button 칩·가로 스크롤에서 전환(사용자 확정).
          ⚠️ 6글자 라벨이 좁은 기기(360px)에서 빠듯할 수 있음 — 잘리면 scrollButtons 복귀 검토. */}
      <TabList fitted value={tab} onChange={handleTab} items={STTS_TABS} />

      {/* 상단바 — 총건수 + 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        <CardList items={cardItems} emptyText="이력이 없습니다." />
      </div>

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <button
            type="button"
            onClick={handleLoadMore}
            className="flex h-12 w-full items-center justify-center rounded-krds-8 border border-krds-border-primary bg-background text-krds-body-md font-bold text-krds-text-primary"
          >
            더보기 ({loaded}/{total})
          </button>
        </div>
      )}

      {/* 맨 위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
MyTaskHstryPage.displayName = 'MyTaskHstryPage'
