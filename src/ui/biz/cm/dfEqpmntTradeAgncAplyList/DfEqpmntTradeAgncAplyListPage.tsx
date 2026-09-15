// 군수품무역대리업 신청 및 발급 목록 (MUI-CM-01-M15, DfEqpmntTradeAgncAplyListPage).
// Figma 정본 10020:83161(데이터)·10020:83191(결과없음). 설계서 00.공통 v0.84 slide178 항목명 준수.
// 구성(위→아래, Figma): 업무도움 HelpDisclosure(말소/실효 안내) → "업체 등록현황 : 적격" + [업체등록안내](FullPopup)
//   → [군수품무역대리업 등록증 발급] 라인(secondary) 풀폭 버튼(상세 M16 footer 에서 이동, 2026-09-15 — 적격일 때만 활성)
//   → m_card 리스트(배지[구분·진행상황] + 접수번호 + 요청/승인/실효말소/만료일자) → 더보기
//   → FAB(맨위로 / + 신청 → 바텀시트 [신규][갱신][변경] 버튼형 라디오, 설계서 slide188·Figma 83432 스타일). 결과없음=CardList emptyText.
//   (2026-08-24 사용자 확정 — 구 하단 sticky [신청] 바를 우하단 + 플로팅 버튼으로 대체.)
// 데이터=파일 내 목업(dl_dfEqpmntTradAgncAplyList), 동작=API 경계 스텁(console.log + '// 추후 …').
//   신규/갱신 → M17(mode), 변경 → M18, 상세 → M16(navigate state). 실효·말소면 [변경] Dim.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BzentyRegGuide } from '@/ui/biz/cm/dfEqpmntTradeAgncAplyList/BzentyRegGuide'
import { OzReportFullPopup } from '@/ui/biz/cm/ozReport/OzReportFullPopup'
import { useOzReport } from '@/ui/biz/cm/ozReport/useOzReport'
import type { MockDfEqpmntTradeAgncAplyItem } from '@/types/mock/cm'

// 구분(regAplySecd)별 배지 색 — 신규=yellow / 갱신=green / 변경=blue(Figma 10020:83161).
function kindColor(kind: string): 'blue' | 'green' | 'yellow' {
  if (kind === '갱신') return 'green'
  if (kind === '변경') return 'blue'
  return 'yellow'
}
// 진행상황(aprvSecdNm)별 배지 색 — 반려·실효·말소=red / 그 외(승인·제출·저장)=blue(Figma 10020:83161 260827 재대조).
function statusColor(status: string): 'blue' | 'red' | 'green' {
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
const dl_dfEqpmntTradAgncAplyList: MockDfEqpmntTradeAgncAplyItem[] = [
  { id: '1', regAplySecd: '신규', rcptNo: '2026-0020', rcptYmd: '2026-05-01', aprvYmd: '2026-05-22', ersrYmd: '2026-05-22', expryYmd: '2026-05-22', aprvSecdNm: '저장' },
  { id: '2', regAplySecd: '갱신', rcptNo: '2026-0021', rcptYmd: '2026-05-01', aprvYmd: '2026-05-22', ersrYmd: '2026-05-22', expryYmd: '2026-05-22', aprvSecdNm: '승인' },
  { id: '3', regAplySecd: '신규', rcptNo: '2026-0018', rcptYmd: '2026-04-01', aprvYmd: '2026-04-10', ersrYmd: '', expryYmd: '2029-04-10', aprvSecdNm: '제출' },
  { id: '4', regAplySecd: '변경', rcptNo: '2026-0017', rcptYmd: '2026-03-01', aprvYmd: '', ersrYmd: '', expryYmd: '', aprvSecdNm: '반려' },
  { id: '5', regAplySecd: '갱신', rcptNo: '2026-0016', rcptYmd: '2026-02-01', aprvYmd: '2026-02-10', ersrYmd: '2029-02-10', expryYmd: '2029-02-10', aprvSecdNm: '실효' },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 페이징 로직을 통째로 교체(cmService.selectDfEqpmntTradeAgncAplyList).
//   설계서 slide178 '더보기 (10/258)' 시연 위해 5건을 258건으로 부풀린다.
const TOTAL = 258
const MOCK_LIST: MockDfEqpmntTradeAgncAplyItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_dfEqpmntTradAgncAplyList[i % dl_dfEqpmntTradAgncAplyList.length]
  return { ...base, id: String(i + 1) }
})

export function DfEqpmntTradeAgncAplyListPage() {
  const navigate = useNavigate()
  const [pageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [guideOpen, setGuideOpen] = useState(false) // 업체등록안내 FullPopup
  // 등록증 발급(리포트 PVB021) — 상세(M16)에서 목록 상단 버튼으로 이동(2026-09-15). 뷰어 실연동은 OzReportFullPopup 안에서.
  const oz = useOzReport()
  const handleIssue = () => oz.open('PVB021', undefined, '군수품무역대리업 등록증')
  const [aplyOpen, setAplyOpen] = useState(false) // 신청(신규/갱신/변경) 선택 시트

  const total = MOCK_LIST.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = useMemo(() => MOCK_LIST.slice(0, loaded), [loaded])

  // ── API 경계 스텁 (백엔드 연동 시 services/queries 로 대체) ──
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[DfEqpmntTradeAgnc] loadMore → page', next)
  }
  // 카드 클릭 → 신청 내역 상세(M16). 클릭 항목을 state 로 전달해 상단 즉시표시(service 없이 목업 fallback).
  const handleCardClick = (item: MockDfEqpmntTradeAgncAplyItem) => {
    navigate(ROUTES.DF_EQPMNT_TRADE_AGNC_DTL, { state: item })
  }
  // 신청 시트 — [신규][갱신][변경] 버튼형 라디오(설계서 slide188·Figma 10020:83432 스타일, 260828 사용자 확정).
  //   실효·말소 상태면 [변경] Dim. [신청하기] → 선택 구분으로 이동(신규/갱신=M17 mode, 변경=M18).
  // ⚠️ 기획 확인 대기(2026-09-15): 업체당 자격 1개 규칙(자격 없음=신규만 / 만료 1개월 미만=갱신 / 유효=변경)으로
  //   구분 버튼을 상태별 활성/비활성 하려 하나, 설계서 v0.87 slide188 규칙은 "실효·말소면 [변경] Dim" 하나뿐이고
  //   자격 상태값(유효/만료임박/실효/말소/없음)도 응답 항목에 없음. 확정되면 아래 disabled 조건만 교체:
  //   신규 = 유효 승인 건 있으면 비활성 · 갱신 = 승인 건 만료일자(expryYmd) 1개월 이내만 활성 · 변경 = 유효 승인 건 있을 때만 활성.
  const [aplyKind, setAplyKind] = useState<'new' | 'renew' | 'change'>('new')
  const latestStatus = dl_dfEqpmntTradAgncAplyList[0]?.aprvSecdNm ?? ''
  const changeDisabled = latestStatus === '실효' || latestStatus === '말소'
  const handleAplyConfirm = () => {
    setAplyOpen(false)
    if (aplyKind === 'change') navigate(ROUTES.DF_EQPMNT_TRADE_AGNC_CHG)
    else navigate(ROUTES.DF_EQPMNT_TRADE_AGNC_APLY, { state: { mode: aplyKind } })
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
    // 정보행 라벨 — 설계서 v0.86 slide183 카드·slide185 항목설명 그대로(2026-08-24 대조):
    //   신청일자(rcptYmd, 구 '신청일자') · 승인일자 · 실효, 말소 일자(구 '실효말소일자') · 만료일자.
    rows: [
      { label: '신청일자', value: it.rcptYmd || '-' },
      { label: '승인일자', value: it.aprvYmd || '-' },
      { label: '실효, 말소 일자', value: it.ersrYmd || '-' },
      { label: '만료일자', value: it.expryYmd || '-' },
    ],
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 업무도움 — 말소/실효 안내(HelpDisclosure, 기본 펼침). 기존 blue Accordion 도움말 대체(라운드 border 버그 해소). */}
      <HelpDisclosure title="군수품무역대리업 등록 신청목록" items={HELP_ITEMS} defaultOpen />

      {/* 업체 등록현황 : 적격 + [업체등록안내](→ FullPopup) — Figma 10020:83161(값 ink·링크 primary, 260827 재대조). */}
      <div className="flex items-center justify-between gap-krds-5 px-4 py-4">
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
          업체 등록현황 : {REG_STTS}
        </span>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="flex shrink-0 items-center gap-krds-3 text-[17px] font-medium leading-normal text-krds-action-primary"
        >
          업체등록안내
          <Icon name="ArrowForwardIos" size={16} aria-hidden />
        </button>
      </div>

      {/* 군수품무역대리업 등록증 발급 — 상세(M16) footer 에서 이동(사용자 지시 2026-09-15). 업체등록안내 아래·카드 목록 위 큰 버튼.
          등록현황이 적격(승인)일 때만 활성 — 추후 등록현황 API 값으로 분기. */}
      <div className="px-4 pb-krds-3">
        <Button variant="secondary" className="w-full" disabled={REG_STTS !== '적격'} onClick={handleIssue}>
          군수품무역대리업 등록증 발급
        </Button>
      </div>

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

      {/* 플로팅 버튼 — 맨위로(항상) + 신청(+) → 신규/갱신/변경 선택 시트.
          구 하단 sticky [신청] 바 대체(사용자 확정 2026-08-24) — 표준 앵커(bottom-0) 복원. */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
        onPlus={() => setAplyOpen(true)}
        plusLabel="신청"
      />

      {/* 업체등록안내 FullPopup(Figma 10020:83204) — 컨테이너는 컴포넌트 소유, open 만 주입. */}
      <BzentyRegGuide open={guideOpen} onOpenChange={setGuideOpen} />
      <OzReportFullPopup {...oz.popupProps} />

      {/* 신청 선택 바텀시트 — [신규][갱신][변경] 버튼형 라디오(설계서 slide188, Figma 83432 스타일) + [신청하기][취소]. */}
      <BottomSheet
        open={aplyOpen}
        onOpenChange={setAplyOpen}
        title="군수품무역대리업 신청"
        footer={
          <ButtonGroup
            layout="vertical"
            items={[
              { label: '신청하기', variant: 'primary', onClick: handleAplyConfirm },
              { label: '취소', variant: 'secondary', onClick: () => setAplyOpen(false) },
            ]}
          />
        }
      >
        <div className="py-krds-5">
          <RadioButtonGroup
            direction="vertical"
            showIndicator
            value={aplyKind}
            onValueChange={(v) => setAplyKind(v as 'new' | 'renew' | 'change')}
            items={[
              { value: 'new', label: '신규' },
              { value: 'renew', label: '갱신' },
              // 실효·말소 상태면 [변경] Dim(설계서 slide188).
              { value: 'change', label: '변경', disabled: changeDisabled },
            ]}
          />
        </div>
      </BottomSheet>
    </div>
  )
}
DfEqpmntTradeAgncAplyListPage.displayName = 'DfEqpmntTradeAgncAplyListPage'
