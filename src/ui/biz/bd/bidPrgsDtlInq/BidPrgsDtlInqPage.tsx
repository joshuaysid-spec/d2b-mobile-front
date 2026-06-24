// 입찰진행 상세조회 (MUI-BD-03-M02, Figma 9300-38114). 입찰진행 목록 카드 → /bd/prgrs/:id 진입.
// 구성(Figma): 요약 헤더(badges + 공고번호 + 출력 + 입찰건명) + 단일 구분/내용 표 + 플로팅(맨위로/바로가기).
//   바로가기 시트는 Figma 9300-43180(NavigationItemList + 확인). 데이터는 목업 — 추후 bdService.getBidProgressDetail.
// 항목명은 설계서 dlt_bidPrgrsList(slide66·67) 기준. 상태값(신청/미동의/등록확정 등)은 설계서 영문 항목명이
//   없어(상세설계 예정) Figma 표기 텍스트를 그대로 노출.
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { OvsExchrtListFullPopup } from '@/ui/biz/bd/ovsExchrtList/OvsExchrtListFullPopup'
import type { BidPrgrsItem } from '@/types/bd'

// 상세 대상(목업) — Figma 9300-38114 예시값 + dlt_bidPrgrsList 항목명. 추후 bdService.getBidProgressDetail(id).
const DETAIL: BidPrgrsItem & { clsfNo: string } = {
  rNum: '1',
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
  it: typeof DETAIL,
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
    { label: '항목번호', value: it.clsfNo },
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
  const { id } = useParams()
  const [shortcutOpen, setShortcutOpen] = useState(false) // 바로가기 시트(9300-43180)
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보 조회(M74)
  useEffect(() => {
    console.log('[M02] 입찰진행 상세 조회', id) // 추후 API: bdService.getBidProgressDetail(id)
  }, [id])

  const handleView = (key: string) => console.log('[M02] 보기', key) // 추후: 작성 화면 읽기모드 연계
  const rows = buildRows(DETAIL, handleView)

  // 바로가기 시트 항목 (Figma 9300-43180) — 작성 화면/환율정보 이동(스텁).
  const shortcutItems = [
    { id: 'bid', label: '입찰서(견적서) 작성하기' },
    { id: 'apply', label: '입찰참가신청서 작성하기' },
    { id: 'giveup', label: '입찰포기 신청서 작성하기' },
    { id: 'cancel', label: '입찰취소 신청서 작성하기' },
    { id: 'fx', label: '환율정보 바로가기' },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 요약 헤더 — badges(업무구분/입찰방식/신청유형) + 공고번호 + 출력 + 입찰건명 (Figma 9300-38114) */}
      <SummaryInfo
        badges={[
          { label: DETAIL.taskSeNm },
          { label: DETAIL.ctrtMthdNm },
          { label: '사전심사' },
          { label: '입찰참가' },
        ]}
        subtitle="긴급공고 LDG0097-1"
        title="특수작전용대물타격무인항공기"
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

      {/* 바로가기 시트 (Figma 9300-43180) — NavigationItemList(> 행) + 확인 footer */}
      <BottomSheet
        open={shortcutOpen}
        onOpenChange={setShortcutOpen}
        title="바로가기"
        footer={
          <Button variant="primary" className="w-full" onClick={() => setShortcutOpen(false)}>
            확인
          </Button>
        }
      >
        <NavigationItemList
          items={shortcutItems.map((it) => ({
            id: it.id,
            label: it.label,
            onClick: () => {
              setShortcutOpen(false)
              if (it.id === 'fx') {
                setExchrtOpen(true) // 환율정보 바로가기 → 환율정보 조회(M74)
                return
              }
              console.log('[M02] 바로가기', it.id) // 추후: 각 신청서 작성 화면 이동
            },
          }))}
        />
      </BottomSheet>

      {/* 환율정보 조회 풀팝업 (M74) */}
      <OvsExchrtListFullPopup open={exchrtOpen} onOpenChange={setExchrtOpen} />
    </div>
  )
}
