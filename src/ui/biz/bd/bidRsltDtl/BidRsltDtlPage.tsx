// 입찰결과상세 컨테이너(개찰상세, MUI-BD-09-M01(구 M01 — v1.83 재편), 구성 탭 T01~T04). 개찰목록 카드 클릭 → /bd/bidRsltDtl 진입.
// 레퍼런스: 입찰공고 상세 BidPbancDtlPage (요약정보+스텝바+탭+탭콘텐츠 동일 패턴).
// 구성: 요약정보(SummaryInfo, 즐겨찾기) + 스텝바(StepBar, 입찰) + 탭4(일반정보/품목정보/입찰결과/협상결과)
//   + 탭 콘텐츠(일반정보=이 파일 인라인=T01 / 품목정보=BidRsltDtlList T02 / 입찰결과=BidRsltDtl T03 / 협상결과=BidRsltDtl2 T04)
//   + 맨위로 FAB.
// 상세화면이라 검색필터 없음. 데이터는 목업(추후 bdService.selectBidRsltDtl). 헤더는 전역 Header(AppLayout).
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import type { BdopnItem } from '@/types/bd'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { OvsExchrtListFullPopup } from '@/ui/biz/bd/ovsExchrtList/OvsExchrtListFullPopup'
import { Toast } from '@/ui/common/composites/Toast'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BidRsltDtlList } from '@/ui/biz/bd/bidRsltDtl/BidRsltDtlList'
import { BidRsltDtl } from '@/ui/biz/bd/bidRsltDtl/BidRsltDtl'
import { BidRsltDtl2 } from '@/ui/biz/bd/bidRsltDtl/BidRsltDtl2'
import { ImpltElgbSrngAbndAply } from '@/ui/biz/bd/bidRsltDtl/ImpltElgbSrngAbndAply'

// ── 탭 (설계서 6.1 화면목록 MUI-BD-09-T01~T04) ───────────────────────────────
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'item', label: '품목정보' },
  { value: 'bid', label: '입찰결과' },
  { value: 'nego', label: '협상결과' },
]

// 단계표시기(StepBar) 5단계 — 조달→입찰→계약→이행→대금청구. 입찰결과상세는 '입찰'(개찰/낙찰) 단계.
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const
function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}


// ── 일반정보 탭(M01) 데이터 (설계서 slide152~153) — 라벨은 설계서 순서 그대로, 값은 목업 ──
const GENERAL_ROWS: TableRow[] = [
  { label: '입찰건명', value: '테스트공고' },
  { label: '공고번호', value: 'MST0001-1' },
  { label: '판단번호', value: '10000' },
  { label: '발주기관', value: '테스트발주기관' },
  { label: '통합참조번호', value: '2025MST0001' },
  { label: '집행유형', value: '구매' },
  { label: '단가제유형', value: '총액제' },
  { label: '계약방법', value: '2단계경쟁(분리)' },
  { label: '입찰방법', value: '전자입찰' },
  { label: '낙찰자결정방법', value: '최저가격제' },
  { label: '예산금액', value: '100,000,000 원', type: 'number' },
  { label: '기초예가적용여부', value: '적용' },
  { label: '개찰일시', value: '2025-12-01 10:00' },
  { label: '적격심사', value: '비대상' },
  { label: '입찰서제출마감일시', value: '2025-12-01 09:00' },
  { label: '등록심사시점', value: '-' },
  { label: '기초예비가격', value: '98,000,000 원', type: 'number' },
  { label: '사정률(%)', value: '-3 ~ 3' },
  { label: '낙찰하한율', value: '예정가격 순공사원가의 100분의 98' },
  {
    label: '공사개요',
    value: (
      <div className="flex flex-col gap-0.5">
        <span>위치: 서울 용산</span>
        <span>공사기간: -</span>
        <span>예정가격: 98,000,000 원</span>
      </div>
    ),
    type: 'combination',
  },
  { label: '가격평가비중', value: '-' },
  { label: '입찰결과', value: '-' },
  { label: '협상형태', value: '전자협상' },
  { label: '협상장소', value: '테스트장소' },
  { label: '협상결과', value: '-' },
  { label: '재입찰대상구분', value: '재입찰 대상' },
  { label: '재입찰 차수', value: '01' },
  { label: '유찰사유', value: '-' },
]

// 담당자 정보 (설계서 slide153) — 업무별 담당자/연락처
const CONTACT_ROWS: TableRow[] = [
  {
    label: '구매담당',
    value: (
      <div className="flex flex-col gap-0.5">
        <span>홍길동 대령</span>
        <span>02-1234-5678</span>
        <span>010-1234-5678</span>
      </div>
    ),
    type: 'combination',
  },
  {
    label: '협상담당',
    value: (
      <div className="flex flex-col gap-0.5">
        <span>홍길순 주무관(7급)</span>
        <span>02-1234-5678</span>
        <span>010-1234-5678</span>
      </div>
    ),
    type: 'combination',
  },
  { label: '입회관', value: '-' },
]

// 첨부서류 (설계서 slide151~152 — 총 N건, 개별 다운로드)
const ATTACH_FILES: FileDownloadItem[] = [
  { id: 'att-1', name: '첨부서류명.hwp', size: '786KB', onDownload: () => console.log('[BidRsltDtl] 다운로드: 첨부서류1') },
  { id: 'att-2', name: '첨부서류명.hwp', size: '1.2MB', onDownload: () => console.log('[BidRsltDtl] 다운로드: 첨부서류2') },
]

// 일반정보 탭(M01) — 설계서 순서: 일반정보 → 첨부서류 → 담당자 정보 (slide152 일반정보·첨부서류, slide153 담당자).
function GeneralInfo({ item }: { item: BdopnItem }) {
  const navigate = useNavigate()
  // 이행/적격심사 포기신청 풀팝업(MUI-BD-10-P02) 열림 상태.
  const [abndOpen, setAbndOpen] = useState(false)
  // 이미 심사포기한 건은 같은 팝업이 조회 모드로 열린다(MUI-BD-10-P03 이행/적격심사포기신청조회, slide273~274).
  const srngAbnd = item.impltElgbSrngStatNm === '심사포기'

  return (
    <>
      <Accordion type="multiple" defaultValue={['general', 'attach', 'contact']} className="w-full">
        <AccordionSection value="general" title="일반정보" borderTop={false}>
          <Table rows={GENERAL_ROWS} />
        </AccordionSection>
        <AccordionSection value="attach" title={`첨부서류 (총 ${ATTACH_FILES.length}건)`}>
          <FileDownloadList files={ATTACH_FILES} />
        </AccordionSection>
        <AccordionSection value="contact" title="담당자 정보">
          <Table rows={CONTACT_ROWS} />
        </AccordionSection>
      </Accordion>

      {/* 이행/적격심사 액션 — 담당자 정보와 간격 두고 균등 분할(포기하기/신청하기) + 풀폭 제출내용 확인. 추후 API: bdService.applyPfmncElgblScrn */}
      {/* 하단 여백: 우측 플로팅 버튼(48px + 하단 10px + safe-area)에 안 가리도록 확보. */}
      <div
        className="flex flex-col gap-krds-5 px-4 pt-krds-8"
        style={{ paddingBottom: 'calc(48px + 10px + 16px + env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="split"
          items={[
            {
              label: srngAbnd ? '이행/적격심사 포기신청 조회' : '이행/적격심사 포기하기',
              variant: 'secondary',
              itemClassName: 'h-auto min-h-12 whitespace-normal break-keep py-2 text-center leading-tight',
              onClick: () => setAbndOpen(true),
            },
            {
              label: '이행/적격심사 신청하기',
              variant: 'primary',
              itemClassName: 'h-auto min-h-12 whitespace-normal break-keep py-2 text-center leading-tight',
              onClick: () => navigate('/bd/implt', { state: item }),
            },
          ]}
        />
        <ButtonGroup
          layout="single"
          items={[
            {
              label: '이행/적격심사 제출내용 확인',
              variant: 'primary',
              itemClassName: 'h-auto min-h-12 whitespace-normal break-keep py-2 text-center leading-tight',
              onClick: () => console.log('[BidRsltDtl] 이행/적격심사 제출내용 확인'),
            },
          ]}
        />
      </div>

      {/* 이행/적격심사 포기신청 풀팝업 — 작성 MUI-BD-10-P02 / 심사포기 상태면 조회 MUI-BD-10-P03 */}
      <ImpltElgbSrngAbndAply
        open={abndOpen}
        onOpenChange={setAbndOpen}
        detail={item}
        readOnly={srngAbnd}
      />
    </>
  )
}

function renderTabContent(tab: string, item: BdopnItem) {
  switch (tab) {
    case 'general':
      return <GeneralInfo item={item} />
    case 'item':
      return <BidRsltDtlList />
    case 'bid':
      return <BidRsltDtl id={item.id} />
    case 'nego':
      return <BidRsltDtl2 />
    default:
      return null
  }
}

export function BidRsltDtlPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  // 관심공고(즐겨찾기) 등록 여부 — 추후 bdService 응답으로 초기화. 현재 mock false.
  const [favorite, setFavorite] = useState(false)
  // 관심공고 등록/제외 토스트.
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' })
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트(입찰공고 상세와 동일)
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보 조회 풀팝업(MUI-BD-01-M74)

  // 바로가기 바텀시트 항목 — 입찰공고 상세(BidPbancDtlPage)와 동일. 작성류 primary · 포기/취소 secondary · 환율정보 tertiary.
  const shortcutItems: { id: string; label: string; variant: 'primary' | 'secondary' | 'tertiary' }[] = [
    { id: 'pq', label: '사전심사(PQ)신청서 작성하기', variant: 'primary' },
    { id: 'bid', label: '입찰서(견적서) 작성하기', variant: 'primary' },
    { id: 'apply', label: '입찰참가신청서 작성하기', variant: 'primary' },
    { id: 'giveup', label: '입찰포기 신청서 작성하기', variant: 'secondary' },
    { id: 'cancel', label: '입찰취소 신청서 작성하기', variant: 'secondary' },
    { id: 'fx', label: '환율정보 바로가기', variant: 'tertiary' },
  ]

  // 즐겨찾기(관심공고) 토글 — 등록/제외에 따라 아이콘(라인↔채움) + 토스트.
  const handleToggleFavorite = () => {
    const next = !favorite
    setFavorite(next)
    setToast({
      open: true,
      message: next ? '관심공고에 등록 되었습니다.' : '관심공고에서 제외 되었습니다.',
    })
    console.log('[BidRsltDtl] 관심공고', next ? '등록' : '제외', id) // 추후 API: bdService.toggleFavorite
  }

  // navigate state 가 식별자 원천(URL 미포함). 개찰목록 카드는 항목 전체를 넘겨 placeholder 로 즉시 렌더하고,
  //   입찰진행현황 탭의 '입찰결과 바로가기' 는 id 만 넘기므로 조회 완료까지 PageLoading.
  const stateItem = useLocation().state as BdopnItem | { id: string } | null
  const id = stateItem?.id ?? ''
  const { data: item } = bdQueries.useSelectBidRsltDtl(id, stateItem && 'bidPbancNo' in stateItem ? stateItem : undefined)
  // 진행단계(prgrsStg) — 입찰결과상세이므로 '입찰'(개찰/낙찰). 추후 bdService 응답으로 대체.
  const [prgrsStg] = useState('입찰')
  const steps = stepsByStg(prgrsStg)

  if (!stateItem) return <Navigate to="/bd/opbid" replace />
  if (!item) return <PageLoading />

  // 요약정보 행(공고일자·개찰일시) — 선택 카드와 동일 값.
  const summaryRows: SummaryInfoRow[] = [
    { label: '공고일자', value: item.pbancDt ?? '-' },
    { label: '개찰일시', value: item.opbidDt ?? '-' },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소(infolist 숨김). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          // 뱃지·공고번호·타이틀은 클릭한 개찰목록 카드(item)와 동일하게 표시 (카드와 동일: 뱃지 3개 + '입찰공고번호 …').
          badges={
            item
              ? [{ label: item.pbancStasNm }, { label: item.taskSeNm }, { label: item.bidMthdNm }]
              : []
          }
          subtitle={item ? `입찰공고번호 ${item.bidPbancNo}` : '-'}
          title={item?.bidPbancNm ?? '-'}
          actions={
            <SummaryUtilButton
              icon="KidStar"
              label={favorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
              active={favorite}
              onClick={handleToggleFavorite}
            />
          }
          rows={summaryRows}
        />

        {/* 진행 단계 — 스크롤 축소 시 함께 접힘 */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar
                orientation="horizontal"
                items={steps}
                sheetItems={buildProgressSheet(prgrsStg, (substep, prgrsStg) => navigate('/anl-prgrs', { state: { substep, prgrsStg } }))}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>

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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘 지탱 위해 최소 높이 확보(진동 방지).
          가로 패딩은 각 콘텐츠(PageTitle px-4 / Accordion p-krds-8)가 자체 처리. */}
      <div className="min-h-[100dvh]">{renderTabContent(tab, item)}</div>

      {/* 플로팅 버튼 — 맨위로(항상) + 바로가기(+). 입찰공고 상세와 동일. 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 — 컨테이너는 페이지가 직접 조립, 항목은 세로 버튼 리스트(입찰공고 상세와 동일) */}
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
              console.log('[BidRsltDtl] 바로가기', it.id) // 추후: 각 신청서 작성 화면 이동
            },
          }))}
        />
      </BottomSheet>

      {/* 환율정보 조회 풀팝업 (MUI-BD-01-M74) — 바로가기 '환율정보 바로가기' 로 진입 */}
      <OvsExchrtListFullPopup open={exchrtOpen} onOpenChange={setExchrtOpen} />

      {/* 관심공고 등록/제외 토스트 */}
      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        {toast.message}
      </Toast>
    </div>
  )
}
