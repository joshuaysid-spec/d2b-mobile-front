// 국외 입찰결과조회 상세(단가제) — MUI-BD-09-M71(컨테이너) · T71 일반정보 · T72 입찰결과(단가제, 구 M72 — v1.83 재편).
// 진입: 개찰목록 최상단 국외(단가제) 카드 클릭 → /bd/ovsBidRsltDtl (state = 카드 요약).
// 레퍼런스: BidRsltDtlPage / OvsTndrDtlPage (요약+탭+탭콘텐츠).
// ⚠️ 설계서 우선 — StepBar·즐겨찾기·출력·바로가기 없음(설계서 M71 레이아웃 미표기, 사용자 확정).
// 상단 요약(배지/번호/사업명/요약행)은 카드와 동일(navigate state). 일반정보 탭은 slide403 데이터영역.
import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { OvsExchrtListFullPopup } from '@/ui/biz/bd/ovsExchrtList/OvsExchrtListFullPopup'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsBidRsltDtl2 } from '@/ui/biz/bd/ovsBidRsltDtl/OvsBidRsltDtl2'
import { OvsBidRsltDtl3 } from '@/ui/biz/bd/ovsBidRsltDtl/OvsBidRsltDtl3'
import type { OvsBidRsltGeneral, OvsBidRsltSummary } from '@/types/bd'

// ── 탭 (설계서 slide397: 일반정보 M71 / 입찰결과 단가제 M72) ─────────────────
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'result', label: '입찰결과' },
]

// 상단 요약 fallback (직접 URL 진입/새로고침 — navigate state 소실 시) — 개찰목록 국외 카드와 동일 값(설계서 slide402).
const MOCK_SUMMARY: OvsBidRsltSummary = {
  taskSeNm: '국외',
  bidTypeNm: '단가제',
  bidMthdNm: '경쟁입찰',
  intgRfrncNo: 'BDF01823EFE',
  pbancNo: 'EFE00012-2',
  bizNm: '500MD 부품',
  bidBzentyNm: 'A 해외업체',
  prchsDmndNo: 'BDF01823-002',
  regDdlnDt: '2026-03-17 15:00',
  bdngDdlnDt: '2026-03-26 11:00',
  bdopnDt: '2026-03-30',
}
// 총액제 fallback — 단가제와 동일하되 입찰유형만 총액제. (직접 진입 시 ?bidTypeNm=총액제 로 분기)
const MOCK_SUMMARY_TOTAL: OvsBidRsltSummary = { ...MOCK_SUMMARY, bidTypeNm: '총액제' }

// 일반정보 탭 데이터 — 설계서 slide403 일반 데이터 영역 값·형식 그대로.
const MOCK_GENERAL: OvsBidRsltGeneral = {
  pbancNo: 'EFD0007-2',
  pbancSeNm: '정상공고',
  pbancDt: '2022-11-12',
  prchsDmndNo: 'BAD839380-001',
  intgRfrncNo: 'BAD83990EFD',
  bizNm: '500MD 부품',
  bidTypeNm: '단가제',
  bidMdmNm: '전자입찰',
  ctrtMthdNm: '일반경쟁',
  bidMth: '일반투찰',
  totAmt: '$ 126,000.18',
  exchrtAplcnYmd: '2025-02-13',
  pbancItemCnt: '100',
  bdopnDt: '2025-03-02 15:00:00',
  regDdlnDt: '2025-03-02 15:00:00',
  bdngDdlnDt: '2025-03-02 15:00:00',
  picDeptNm: '국제부품계약팀',
  picNm: '정영금',
  picTlno: '02-1234-5678',
  picMblTelno: '010-1234-5678',
}

// ── 일반정보 탭 (M71, slide403) — 일반정보 표 + 담당자 정보 표 ───────────────
// bidTypeNm(입찰유형)은 상단 배지(단가제/총액제)와 동일 값을 따른다.
function GeneralInfo({ detail, bidTypeNm }: { detail: OvsBidRsltGeneral; bidTypeNm: string }) {
  const generalRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '공고구분', value: detail.pbancSeNm },
    { label: '공고일자', value: detail.pbancDt },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '사업명', value: detail.bizNm },
    { label: '입찰유형', value: bidTypeNm },
    { label: '입찰매체', value: detail.bidMdmNm },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '입찰방식', value: detail.bidMth },
    { label: '총금액', value: detail.totAmt, type: 'number' },
    { label: '환율적용일자', value: detail.exchrtAplcnYmd },
    { label: '공고 품목수', value: detail.pbancItemCnt, type: 'number' },
    { label: '개찰일시', value: detail.bdopnDt },
    { label: '입찰참가등록마감일시', value: detail.regDdlnDt },
    { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
  ]
  const contactRows: TableRow[] = [
    { label: '담당 부서명', value: detail.picDeptNm },
    { label: '담당자', value: detail.picNm },
    {
      label: '연락처',
      value: (
        <div className="flex flex-col gap-0.5">
          <span>{detail.picTlno}</span>
          <span>{detail.picMblTelno}</span>
        </div>
      ),
      type: 'combination',
    },
  ]

  return (
    <Accordion type="multiple" defaultValue={['general', 'contact']} className="w-full">
      <AccordionSection value="general" title="일반정보" borderTop={false}>
        <Table rows={generalRows} />
      </AccordionSection>
      <AccordionSection value="contact" title="담당자 정보">
        <Table rows={contactRows} />
      </AccordionSection>
    </Accordion>
  )
}

export function OvsBidRsltDtlPage() {
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트(국내 상세와 동일)
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보 조회 풀팝업(MUI-BD-01-M74)

  // 바로가기 바텀시트 항목 — 국내 입찰결과상세(BidRsltDtlPage)와 동일. 작성류 primary · 포기/취소 secondary · 환율정보 tertiary.
  const shortcutItems: { id: string; label: string; variant: 'primary' | 'secondary' | 'tertiary' }[] = [
    { id: 'pq', label: '사전심사(PQ)신청서 작성하기', variant: 'primary' },
    { id: 'bid', label: '입찰서(견적서) 작성하기', variant: 'primary' },
    { id: 'apply', label: '입찰참가신청서 작성하기', variant: 'primary' },
    { id: 'giveup', label: '입찰포기 신청서 작성하기', variant: 'secondary' },
    { id: 'cancel', label: '입찰취소 신청서 작성하기', variant: 'secondary' },
    { id: 'fx', label: '환율정보 바로가기', variant: 'tertiary' },
  ]

  // 상단 요약 — 카드에서 넘어온 값(navigate state) 우선, 없으면 fallback 목업.
  //   단가제/총액제 분기 테스트: 직접 URL 진입 시 ?bidTypeNm=총액제 쿼리로 총액제 확인 가능.
  const [searchParams] = useSearchParams()
  const summary =
    (useLocation().state as OvsBidRsltSummary | null) ??
    (searchParams.get('bidTypeNm') === '총액제' ? MOCK_SUMMARY_TOTAL : MOCK_SUMMARY)

  // 요약 정보행 (설계서 slide402) — 입찰업체·구매요청번호·마감일시·개찰일자.
  const summaryRows: SummaryInfoRow[] = [
    { label: '입찰업체', value: summary.bidBzentyNm },
    { label: '구매요청번호', value: summary.prchsDmndNo },
    { label: '입찰참가등록마감일시', value: summary.regDdlnDt },
    { label: '입찰서제출마감일시', value: summary.bdngDdlnDt },
    { label: '개찰일자', value: summary.bdopnDt },
  ]

  const renderTabContent = (current: string) => {
    switch (current) {
      case 'general':
        // 입찰유형은 상단 배지(단가제/총액제)를 그대로 반영.
        return <GeneralInfo detail={MOCK_GENERAL} bidTypeNm={summary.bidTypeNm} />
      case 'result':
        // 입찰유형 배지에 따라 단가제(M72)/총액제(M73) 결과 탭 분기. 라벨도 배지를 따름.
        return summary.bidTypeNm === '총액제' ? (
          <OvsBidRsltDtl3 bidTypeNm={summary.bidTypeNm} />
        ) : (
          <OvsBidRsltDtl2 bidTypeNm={summary.bidTypeNm} />
        )
      default:
        return null
    }
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소. StepBar 없음(설계서 우선). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          // 배지는 개찰목록 국외 카드와 동일 — 업무구분(국외)·입찰유형(단가제)·입찰방식(경쟁입찰).
          badges={[{ label: summary.taskSeNm }, { label: summary.bidTypeNm }, { label: summary.bidMthdNm }]}
          subtitle={`통합참조번호 ${summary.intgRfrncNo} / 공고번호 ${summary.pbancNo}`}
          title={summary.bizNm}
          rows={summaryRows}
        />

        {/* 탭 */}
        <div className="px-4">
          <TabList
            value={tab}
            onChange={(next) => {
              setTab(next)
              goToContentTop()
            }}
            items={TABS}
          />
        </div>
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘 지탱 위해 최소 높이 확보(진동 방지). */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 플로팅 버튼 — 맨위로(항상) + 바로가기(+). 국내 입찰결과상세와 동일. 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 — 컨테이너는 페이지가 직접 조립, 항목은 세로 버튼 리스트(국내 상세와 동일) */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={shortcutItems.map((it) => ({
            label: it.label,
            variant: it.variant,
            onClick: () => {
              setShortcutOpen(false)
              if (it.id === 'fx') {
                setExchrtOpen(true) // 환율정보 바로가기 → 환율정보 조회 풀팝업(M74)
                return
              }
              console.log('[OvsBidRslt] 바로가기', it.id) // 추후: 각 신청서 작성 화면 이동
            },
          }))}
        />
      </BottomSheet>

      {/* 환율정보 조회 풀팝업 (MUI-BD-01-M74) — 바로가기 '환율정보 바로가기' 로 진입 */}
      <OvsExchrtListFullPopup open={exchrtOpen} onOpenChange={setExchrtOpen} />
    </div>
  )
}
OvsBidRsltDtlPage.displayName = 'OvsBidRsltDtlPage'
