// 입찰진행 상세조회 (MUI-BD-03-M02, Figma 9300-38114). 입찰진행 목록 카드 → /bd/prgrs/:id 진입.
// 구성(Figma): 요약 헤더(badges + 공고번호 + 출력 + 입찰건명) + 단일 구분/내용 표 + 플로팅(맨위로/바로가기).
//   바로가기 시트는 Figma 9300-43180(NavigationItemList + 확인).
//   데이터는 목업(상단/표=목록에서 넘어온 항목, 없으면 페이지 fallback 목업). 백엔드 미연동.
// 항목명은 설계서 dlt_bidPrgrsList(slide66·67) 기준. 상태값(신청/미동의/등록확정 등)은 설계서 영문 항목명이
//   없어(상세설계 예정) Figma 표기 텍스트를 그대로 노출.
import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { OvsExchrtListFullPopup } from '@/ui/biz/bd/ovsExchrtList/OvsExchrtListFullPopup'
import { BidAbndAperWrt, type BidAbndAperWrtHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidAbndAperWrt'
import { BidRtrcnAperInq, type BidRtrcnAperInqHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidRtrcnAperInq'
import type { BidPrgrsItem, BidPrgrsDetail } from '@/types/bd'

// 직접 URL 진입(목록 state 없음) 대비 fallback 목업 — 설계서 dlt_bidPrgrsList 항목명 그대로.
const MOCK_BID_PRGRS_DETAIL: BidPrgrsDetail = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '000 000 0000',
  prcmNo: '00 00 00 00',
  clsfNo: '00 00 00000',
  bidNm: '간편한 아침식 제조 및 납품',
  rfrncNo: '0000 0000',
  orderInstTelno: '000-0000-0000',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '-',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: true,
}

// 구분/내용 표 — Figma 9300-38114 행 순서/항목 그대로. 일부 행은 상태텍스트 + 보기 버튼(combination).
function buildRows(
  it: BidPrgrsDetail,
  onView: (key: string) => void,
): TableRow[] {
  // 상태 + 버튼 셀(예: "신청 / 미동의 / 등록확정" 위, [내용 보기] 아래)
  const statusCell = (status: string, btnLabel: string, key: string) => (
    <div className="flex flex-col items-start gap-krds-3">
      <span>{status}</span>
      <Button size="sm" variant="inner" onClick={() => onView(key)}>
        {btnLabel}
      </Button>
    </div>
  )
  return [
    { label: '번호', value: it.rNum },
    { label: '업무구분', value: it.taskSeNm },
    {
      label: '공고번호',
      value: (
        <div className="flex flex-col items-start gap-krds-3">
          <span>{it.pbancNo}</span>
          <Button size="sm" variant="inner" onClick={() => onView('pbanc')}>
            공고 보기
          </Button>
        </div>
      ),
      type: 'combination',
    },
    { label: '판단번호', value: it.prcmNo },
    { label: '항목번호', value: it.clsfNo ?? '-' },
    { label: '입찰건명', value: it.bidNm },
    { label: '통합참조번호', value: it.rfrncNo },
    { label: '발주기관 연락처', value: it.orderInstTelno },
    { label: '계약방법', value: it.ctrtMthdNm },
    { label: '입찰방법', value: it.bidMthdNm },
    { label: '업체구분', value: it.bzentySeNm },
    { label: '입찰참가신청서', value: statusCell('신청 / 미동의 / 등록확정', '내용 보기', 'apfr'), type: 'combination' },
    { label: '입찰서', value: statusCell('제출 / 완료 / 입찰취소', '내용 보기', 'tndr'), type: 'combination' },
    { label: '사전심사(PQ)', value: statusCell('결과', '내용 보기', 'pq'), type: 'combination' },
    { label: '기술평가', value: statusCell('결과', '내용 보기', 'techEvl'), type: 'combination' },
    { label: '생산능력서류', value: statusCell('제출', '내용 보기', 'prdcp'), type: 'combination' },
    { label: '입찰참가등록 마감일시', value: it.bidClrsDt },
    { label: '입찰서제출 마감일시', value: it.tndrSbmsnDdlnDt },
  ]
}

export function BidPrgsDtlInqPage() {
  const navigate = useNavigate()
  // 목록에서 navigate(state)로 넘어온 항목으로 상단/표를 그린다. 없으면(직접 URL 진입) 페이지 목업.
  const detail = (useLocation().state as BidPrgrsItem | null) ?? MOCK_BID_PRGRS_DETAIL
  const [shortcutOpen, setShortcutOpen] = useState(false) // 바로가기 시트(9300-43180)
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보 조회(M74)
  const [abandonOpen, setAbandonOpen] = useState(false) // 입찰포기신청서(P03)
  const [cancelOpen, setCancelOpen] = useState(false) // 입찰취소신청서(P04)
  // P03/P04 는 바텀시트 콘텐츠 전용 — 컨테이너/footer 는 여기(부모)가 소유, 제출은 ref 핸들로 호출.
  const abandonRef = useRef<BidAbndAperWrtHandle>(null)
  const cancelRef = useRef<BidRtrcnAperInqHandle>(null)

  // 보기 버튼 → 결과조회 화면 연계. 입찰참가신청서→입찰등록심사 결과조회(M05) · 사전심사(PQ)→사전심사 결과조회(M02).
  const handleView = (key: string) => {
    if (key === 'apfr') navigate('/bd/reg-rslt')
    else if (key === 'pq') navigate('/bd/srng-rslt')
    else console.log('[M02] 보기', key) // 공고/입찰서 등 — 추후 연계
  }
  const rows = buildRows(detail, handleView)

  // 바로가기 시트 항목 — 입찰공고상세(M07)와 동일한 버튼 리스트 형식.
  // 색: 작성류(입찰서/입찰참가) primary · 포기/취소 secondary · 환율정보 tertiary(라인).
  const shortcutItems: { id: string; label: string; variant: 'primary' | 'secondary' | 'tertiary' }[] = [
    { id: 'bid', label: '입찰서(견적서) 작성하기', variant: 'primary' },
    { id: 'apply', label: '입찰참가신청서 작성하기', variant: 'primary' },
    { id: 'giveup', label: '입찰포기 신청서 작성하기', variant: 'secondary' },
    { id: 'cancel', label: '입찰취소 신청서 작성하기', variant: 'secondary' },
    { id: 'fx', label: '환율정보 바로가기', variant: 'tertiary' },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 요약 헤더 — badges(업무구분/입찰방식/신청유형) + 공고번호 + 출력 + 입찰건명 (Figma 9300-38114) */}
      <SummaryInfo
        badges={[
          { label: detail?.taskSeNm ?? '' },
          { label: detail?.ctrtMthdNm ?? '' },
          { label: '사전심사' },
          { label: '입찰참가' },
        ]}
        subtitle={detail?.pbancNo ?? ''}
        title={detail?.bidNm ?? ''}
        actions={
          <button
            type="button"
            aria-label="출력"
            onClick={() => console.log('[M02] 출력')}
            className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <Icon name="Print" size={24} aria-hidden />
          </button>
        }
      />

      {/* 구분/내용 단일 표 */}
      <PageTitle as="h2" className="sr-only">
        입찰진행 상세정보
      </PageTitle>
      <div className="px-4 pb-4">
        <Table rows={rows} />
      </div>

      {/* 플로팅 — 맨위로 + 바로가기(+) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 시트 — 입찰공고상세(M07)와 동일한 세로 버튼 리스트(ButtonGroup) */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={shortcutItems.map((it) => ({
            label: it.label,
            variant: it.variant,
            onClick: () => {
              setShortcutOpen(false)
              if (it.id === 'fx') setExchrtOpen(true) // 환율정보 바로가기 → 환율정보 조회(M74)
              else if (it.id === 'giveup') setAbandonOpen(true) // 입찰포기신청서(P03)
              else if (it.id === 'cancel') setCancelOpen(true) // 입찰취소신청서(P04)
              else console.log('[M02] 바로가기', it.id) // 추후: 입찰서/입찰참가신청서 작성 화면 이동
            },
          }))}
        />
      </BottomSheet>

      {/* 환율정보 조회 풀팝업 (M74) */}
      <OvsExchrtListFullPopup open={exchrtOpen} onOpenChange={setExchrtOpen} />
      {/* 입찰포기신청서(P03) — 바텀시트(컨테이너/footer 부모 소유, 콘텐츠는 ref 핸들) */}
      <BottomSheet
        open={abandonOpen}
        onOpenChange={setAbandonOpen}
        title="입찰포기신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setAbandonOpen(false) },
              { label: '제출하기', variant: 'primary', onClick: () => abandonRef.current?.submit() },
            ]}
          />
        }
      >
        <BidAbndAperWrt ref={abandonRef} onSubmitted={() => setAbandonOpen(false)} />
      </BottomSheet>

      {/* 입찰취소신청서(P04) — 바텀시트(제출확인 모달은 콘텐츠 내부) */}
      <BottomSheet
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="입찰취소신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setCancelOpen(false) },
              { label: '제출', variant: 'primary', onClick: () => cancelRef.current?.submit() },
            ]}
          />
        }
      >
        <BidRtrcnAperInq ref={cancelRef} onSubmitted={() => setCancelOpen(false)} />
      </BottomSheet>
    </div>
  )
}
