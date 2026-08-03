// 군수품무역대리업 신청 및 발급 목록 (MUI-CM-01-M15, DfEqpmntTradeAgncAplyListPage).
// Figma 정본 10020:83161(데이터)·10020:83191(결과없음). 설계서 00.공통 v0.84 slide178 항목명 준수.
// 구성(위→아래, Figma): 업무도움 HelpDisclosure(말소/실효 안내) → "업체 등록현황 : 적격" + [업체등록안내](FullPopup)
//   → 목록 헤더(총건수·표시개수) → m_card 리스트(배지[구분·진행상황] + 접수번호 + 신청/승인/실효말소/만료일자) → 더보기 → FAB
//   → 하단 [신청] 바(→ 바텀시트 [신규][갱신][변경], 실효·말소면 [변경] Dim). 결과없음=CardList emptyText.
// 데이터=파일 내 목업(dl_dfEqpmntTradAgncAplyList), 동작=API 경계 스텁(console.log + '// 추후 …').
//   신규/갱신 → M17(mode), 변경 → M18, 상세 → M16(navigate state).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BzentyRegGuide } from '@/ui/biz/cm/dfEqpmntTradeAgncAplyList/BzentyRegGuide'
import type { DfEqpmntTradeAgncAplyItem } from '@/types/cm'

// 구분(regAplySecd)별 배지 색 — 신규=yellow / 갱신=green / 변경=blue(Figma 10020:83161).
function kindColor(kind: string): 'blue' | 'green' | 'yellow' {
  if (kind === '갱신') return 'green'
  if (kind === '변경') return 'blue'
  return 'yellow'
}
// 진행상황(aprvSecdNm)별 배지 색 — 승인=green / 반려·실효·말소=red / 제출·저장=blue(설계서 slide180 값).
function statusColor(status: string): 'blue' | 'red' | 'green' {
  if (status === '승인') return 'green'
  if (status === '반려' || status === '실효' || status === '말소') return 'red'
  return 'blue'
}

// ── 업체 등록현황(적격/부적격) — 설계서 slide178. 로그인 업체 기준(추후 API). 목업 '적격'. ──
const REG_STTS = '적격' as '적격' | '부적격'

// 업무도움(HelpDisclosure) — 말소/실효 안내(Figma 10020:83161 상단 업무도움).
const HELP_ITEMS = [
  '말소 : 관리자의 직권으로 군수품무역대리업 관련 업무를 할 수 없음.',
  '실효 : 갱신기간이 지나 군수품무역대리업 관련 업무를 할 수 없음.',
]

// ── 목록 목업(dl_dfEqpmntTradAgncAplyList, 설계서 slide178·180 항목명 영문) ─────────────────
// 진행상황(aprvSecdNm): 말소/실효/승인/제출/반려/저장. 최신순(신청일자 desc).
const dl_dfEqpmntTradAgncAplyList: DfEqpmntTradeAgncAplyItem[] = [
  { id: '1', regAplySecd: '신규', rcptNo: '2026-0020', rcptYmd: '2026-05-01', aprvYmd: '2026-05-22', ersrYmd: '2026-05-22', expryYmd: '2026-05-22', aprvSecdNm: '저장' },
  { id: '2', regAplySecd: '갱신', rcptNo: '2026-0021', rcptYmd: '2026-05-01', aprvYmd: '2026-05-22', ersrYmd: '2026-05-22', expryYmd: '2026-05-22', aprvSecdNm: '승인' },
  { id: '3', regAplySecd: '신규', rcptNo: '2026-0018', rcptYmd: '2026-04-01', aprvYmd: '2026-04-10', ersrYmd: '', expryYmd: '2029-04-10', aprvSecdNm: '제출' },
  { id: '4', regAplySecd: '변경', rcptNo: '2026-0017', rcptYmd: '2026-03-01', aprvYmd: '', ersrYmd: '', expryYmd: '', aprvSecdNm: '반려' },
  { id: '5', regAplySecd: '갱신', rcptNo: '2026-0016', rcptYmd: '2026-02-01', aprvYmd: '2026-02-10', ersrYmd: '2029-02-10', expryYmd: '2029-02-10', aprvSecdNm: '실효' },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 페이징 로직을 통째로 교체(cmService.getDfEqpmntTradeAgncAplyList).
//   설계서 slide178 '더보기 (10/258)' 시연 위해 5건을 258건으로 부풀린다.
const TOTAL = 258
const MOCK_LIST: DfEqpmntTradeAgncAplyItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_dfEqpmntTradAgncAplyList[i % dl_dfEqpmntTradAgncAplyList.length]
  return { ...base, id: String(i + 1) }
})

export function DfEqpmntTradeAgncAplyListPage() {
  const navigate = useNavigate()
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [guideOpen, setGuideOpen] = useState(false) // 업체등록안내 FullPopup
  const [aplyOpen, setAplyOpen] = useState(false) // 신청(신규/갱신/변경) 선택 시트

  const total = MOCK_LIST.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = useMemo(() => MOCK_LIST.slice(0, loaded), [loaded])

  // 실효·말소 상태면 [변경] 불가(설계서 slide178 'Dim 처리'). 최신(첫) 신청의 진행상황 기준.
  const latestStatus = dl_dfEqpmntTradAgncAplyList[0]?.aprvSecdNm ?? ''
  const changeDisabled = latestStatus === '실효' || latestStatus === '말소'

  // ── API 경계 스텁 (백엔드 연동 시 services/queries 로 대체) ──
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[DfEqpmntTradeAgnc] loadMore → page', next)
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[DfEqpmntTradeAgnc] pageSize →', size)
  }
  // 카드 클릭 → 신청 내역 상세(M16). 클릭 항목을 state 로 전달해 상단 즉시표시(service 없이 목업 fallback).
  const handleCardClick = (item: DfEqpmntTradeAgncAplyItem) => {
    navigate(ROUTES.DF_EQPMNT_TRADE_AGNC_DTL, { state: item })
  }
  // 신청 선택(신규/갱신 → M17 mode / 변경 → M18).
  const goApply = (mode: 'new' | 'renew') => {
    setAplyOpen(false)
    navigate(ROUTES.DF_EQPMNT_TRADE_AGNC_APLY, { state: { mode } })
  }
  const goChange = () => {
    setAplyOpen(false)
    navigate(ROUTES.DF_EQPMNT_TRADE_AGNC_CHG)
  }

  // 목업 → Card props. 접수번호(번호만 primary 색), 배지=구분 + 진행상황.
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge color={kindColor(it.regAplySecd)}>{it.regAplySecd}</Badge>
        <Badge color={statusColor(it.aprvSecdNm)}>{it.aprvSecdNm}</Badge>
      </>
    ),
    title: (
      <>
        접수번호 <span className="text-krds-text-primary-active">{it.rcptNo}</span>
      </>
    ),
    rows: [
      { label: '신청일자', value: it.rcptYmd || '-' },
      { label: '승인일자', value: it.aprvYmd || '-' },
      { label: '실효말소일자', value: it.ersrYmd || '-' },
      { label: '만료일자', value: it.expryYmd || '-' },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 업무도움 — 말소/실효 안내(HelpDisclosure, 기본 펼침). 기존 blue Accordion 도움말 대체(라운드 border 버그 해소). */}
      <HelpDisclosure title="군수품무역대리업 등록 신청목록" items={HELP_ITEMS} defaultOpen />

      {/* 업체 등록현황 : 적격 + [업체등록안내](→ FullPopup) — Figma 10020:83161. */}
      <div className="flex items-center justify-between gap-krds-5 px-4 py-4">
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
          업체 등록현황 :{' '}
          <span className={REG_STTS === '적격' ? 'text-krds-color-success-60' : 'text-krds-feedback-danger'}>
            {REG_STTS}
          </span>
        </span>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="flex shrink-0 items-center gap-krds-3 text-[17px] font-medium leading-normal text-krds-text-primary-active"
        >
          업체등록안내
          <Icon name="ArrowForwardIos" size={16} aria-hidden />
        </button>
      </div>

      {/* 목록 헤더 — 총건수 + 표시개수(설계서 slide178 '더보기 (10/258)'). */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 목록 (px-4 인셋). 결과없음=emptyText(Figma 10020:83191). */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} emptyText="신청 목록이 없습니다" />
      </div>

      {/* 더보기 (loaded/total). 10개 미만이면 숨김(설계서 slide178). */}
      {loaded < total && (
        <div className="px-4 pb-4">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main).
          ⚠️ 앵커 예외: 표준은 `bottom-0`(FAB 가 BottomNav 유무를 컨텍스트로 보정)이지만, 이 화면은
          아래 sticky 신청 바를 페이지가 직접 갖고 있어 그 높이(≈72px)만큼 더 띄운다. 신청 바가 없는
          화면에 이 값을 복사하지 말 것. */}
      <FloatingActionButton
        className="fixed bottom-24 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 하단 신청 바 — [신청](→ 신규/갱신/변경 선택 시트). sticky 고정(BottomNav 없음). */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <Button variant="primary" className="w-full" onClick={() => setAplyOpen(true)}>
          <Icon name="Add" size={20} aria-hidden />
          신청
        </Button>
      </div>

      {/* 업체등록안내 FullPopup(Figma 10020:83204) — 컨테이너는 컴포넌트 소유, open 만 주입. */}
      <BzentyRegGuide open={guideOpen} onOpenChange={setGuideOpen} />

      {/* 신청 선택 바텀시트 — [신규][갱신][변경]. 실효·말소면 [변경] Dim(설계서 slide178). */}
      <BottomSheet open={aplyOpen} onOpenChange={setAplyOpen} title="군수품무역대리업 신청">
        <div className="py-krds-5">
          <ButtonGroup
            layout="vertical"
            items={[
              { label: '신규', variant: 'primary', onClick: () => goApply('new') },
              { label: '갱신', variant: 'secondary', onClick: () => goApply('renew') },
              { label: '변경', variant: 'secondary', disabled: changeDisabled, onClick: goChange },
            ]}
          />
        </div>
      </BottomSheet>
    </div>
  )
}
DfEqpmntTradeAgncAplyListPage.displayName = 'DfEqpmntTradeAgncAplyListPage'
