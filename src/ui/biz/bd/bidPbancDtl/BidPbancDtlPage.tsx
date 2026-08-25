// 입찰공고 상세 (MUI-BD-01-M07(컨테이너) · 탭 T01~T06(구 M07~M12 — v1.83 재편), Figma 9300-37570). 목록 카드 클릭 → /bd/bidPbancDtl 진입.
// 레퍼런스: 조달계획 상세 PrcmPlanDtlPage (요약정보+스텝바+탭+탭콘텐츠 동일 패턴).
// 구성: 요약정보(SummaryInfo) + 스텝바(StepBar, 입찰 진행) + 탭(6개) + 탭 콘텐츠(탭별 컴포넌트 분리)
//   + 플로팅 버튼(맨위로 / + → 바로가기 바텀시트).
// 데이터는 목업(상단=목록에서 넘어온 항목, 없으면 페이지 fallback 목업). 백엔드 미연동.
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout) 담당.
import { useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { useAuthStore } from '@/stores/authStore'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import type { BidPbancItem, BidPrgrsItem } from '@/types/mock/bd'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Toast } from '@/ui/common/composites/Toast'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { BidPbancDtl } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl'
import { BidPbancDtl_Tacpg02 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg02'
import { BidPbancDtl_Tacpg03 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg03'
import { BidPbancDtl_Tacpg04 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg04'
import { BidPbancDtl_Tacpg06 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg06'
import { BidPbancDtl_Tacpg07 } from '@/ui/biz/bd/bidPbancDtl/BidPbancDtl_Tacpg07'
import { OvsExchrtListFullPopup } from '@/ui/biz/bd/ovsExchrtList/OvsExchrtListFullPopup'
import { BidAbndAperWrt, type BidAbndAperWrtHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidAbndAperWrt'
import { BidRtrcnAperInq, type BidRtrcnAperInqHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidRtrcnAperInq'

// ── 탭 (설계서 2.1 화면목록) ─────────────────────────────────────────────────
//  일반정보(고정) · 기초예비가격(경쟁입찰) · 품목명세서(업무구분 물품) · 계약특수조건 · 공고문안 · 입찰진행현황
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'tacpg02', label: '기초예비가격' },
  { value: 'tacpg03', label: '품목명세서' },
  { value: 'tacpg04', label: '계약특수조건' },
  { value: 'tacpg06', label: '공고문안' },
  { value: 'tacpg07', label: '입찰진행현황' },
]

function renderTabContent(tab: string) {
  switch (tab) {
    case 'general':
      return <BidPbancDtl />
    case 'tacpg02':
      return <BidPbancDtl_Tacpg02 />
    case 'tacpg03':
      return <BidPbancDtl_Tacpg03 />
    case 'tacpg04':
      return <BidPbancDtl_Tacpg04 />
    case 'tacpg06':
      return <BidPbancDtl_Tacpg06 />
    case 'tacpg07':
      return <BidPbancDtl_Tacpg07 />
    default:
      return null
  }
}

// 단계표시기(StepBar) 5단계 라벨 — 설계서 단계표시기(조달→입찰→계약→이행→대금청구).
// 현재 단계는 아이템 속성 prgrsStg(진행단계) 값으로 결정. (bidStatNm 은 입찰 세부상태로 별개)
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

/** 진행단계(prgrsStg)로 StepBar items 생성 — 이전 done / 현재 doing / 이후 todo. */
function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function BidPbancDtlPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트(9300-36775)
  // 입찰포기(P03)/입찰취소(P04) 신청서 바텀시트 — 진행상세(BidPrgsDtlInqPage)와 동일 조립.
  const [abandonOpen, setAbandonOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const abandonRef = useRef<BidAbndAperWrtHandle>(null)
  const cancelRef = useRef<BidRtrcnAperInqHandle>(null)
  // 관심공고(즐겨찾기) 등록 여부 — 추후 bdService.selectPbancGnrlInfo 응답(관심공고 등록 여부)으로 초기화. 현재 mock false.
  const [favorite, setFavorite] = useState(false)
  const [loginGuideOpen, setLoginGuideOpen] = useState(false) // 로그인 안내(MUI-MS-03-P15)
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보 조회 풀팝업(MUI-BD-01-M74)
  // 관심공고 등록/제외 토스트(MUI-BD-01-P13)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' })

  // 로그인 필요 동작 — 비로그인 시 로그인 안내(P15) 노출하고 동작 차단. authStore 직접 구독.
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  // 목록 → 상세 데이터 전달: navigate state 를 placeholder 로 즉시 렌더 + id 조회로 확정.
  //   URL 에 식별자를 두지 않으므로 state 없이 직접 진입하면 목록으로 되돌린다(아래 early return).
  const stateItem = useLocation().state as BidPbancItem | null
  const id = stateItem?.pbancNo ?? ''
  const { data: detail } = bdQueries.useSelectPbancGnrlInfo(id, stateItem ?? undefined)
  const insertItrstPbanc = bdQueries.useInsertItrstPbanc()

  // 즐겨찾기(관심공고) 토글 — 로그인 필요. 등록/제외에 따라 아이콘(라인↔채움) + 토스트(P13).
  // 낙관적 갱신(즉시 반영) 후 mutation 훅 await, 실패 시 이전 상태로 복원.
  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      setLoginGuideOpen(true)
      return
    }
    const next = !favorite
    setFavorite(next)
    setToast({
      open: true,
      message: next ? '관심공고에 등록 되었습니다.' : '관심공고에서 제외 되었습니다.',
    })
    try {
      await insertItrstPbanc.mutateAsync({ id, favorite: next })
    } catch {
      setFavorite(!next) // 실패 → 낙관적 갱신 롤백
    }
  }

  if (!stateItem) return <Navigate to="/bd" replace />
  if (!detail) return <PageLoading />

  // 진행단계(prgrsStg) — detail 기반. 미정 시 입찰공고이므로 '입찰' 기본.
  const steps = stepsByStg(detail.prgrsStg ?? '입찰')

  // 바로가기 바텀시트 항목 (Figma 9300-36775) — 각 신청서 작성/환율정보 이동.
  // 버튼 색: 작성류 상위 3개 primary · 포기/취소 2개 secondary · 환율정보 1개 tertiary(라인).
  const shortcutItems: { id: string; label: string; variant: 'primary' | 'secondary' | 'tertiary' }[] = [
    { id: 'pq', label: '사전심사(PQ)신청서 작성하기', variant: 'primary' },
    { id: 'bid', label: '입찰서(견적서) 작성하기', variant: 'primary' },
    { id: 'apply', label: '입찰참가신청서 작성하기', variant: 'primary' },
    { id: 'giveup', label: '입찰포기 신청서 작성하기', variant: 'secondary' },
    { id: 'cancel', label: '입찰취소 신청서 작성하기', variant: 'secondary' },
    { id: 'fx', label: '환율정보 조회', variant: 'tertiary' },
  ]

  // 신청서 화면들(사전심사/입찰서/참가신청서/포기·취소)은 입찰진행 아이템(BidPrgrsItem) 형태를 기대 —
  // 공고 아이템을 매핑해 전달한다. 공고 아이템에 없는 필드(연락처·진행 플래그)는
  // 목업으로 보완(추후 API: bdService.selectBidPbancDtl 응답으로 교체).
  const prgrsDetail: BidPrgrsItem = {
    rNum: detail.rnum,
    taskSeNm: detail.taskSeNm ?? '물품',
    pbancNo: detail.g2bPbancNoOd,
    prcmNo: detail.prcmNo,
    bidNm: detail.bizNm,
    rfrncNo: detail.intgRfrncNo,
    orderInstTelno: '02-2079-5100',
    ctrtMthdNm: detail.ctrtMthdNm,
    bidMthdNm: detail.bidMthdNm,
    bidClrsDt: detail.bidRegDdlnDt,
    tndrSbmsnDdlnDt: detail.tndrSbmsnDdlnDt,
    bzentySeNm: '대표',
    bfhdSrng: true,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: false,
    prdcpDcmntSbms: false,
  }

  // 바로가기 이동 — 국내 진행 화면 라우트(진행상세 BidPrgsDtlInqPage 의 handleShortcut 과 동일 목적지).
  const handleShortcut = (sid: string) => {
    setShortcutOpen(false)
    switch (sid) {
      case 'pq': // 사전심사(PQ)신청서 작성(MUI-BD-02)
        navigate('/bd/bfhd-srng-aply', { state: prgrsDetail })
        break
      case 'bid': // 입찰서(견적서) 작성 마법사(MUI-BD-06-M01~M07)
        navigate('/bd/tndrWrt', { state: prgrsDetail })
        break
      case 'apply': // 입찰참가신청서 — 서약서(WrotAgrePage) → 작성 폼
        navigate('/bd/wrotAgre', { state: prgrsDetail })
        break
      case 'giveup': // 입찰포기신청서(P03) — 바텀시트
        setAbandonOpen(true)
        break
      case 'cancel': // 입찰취소신청서(P04) — 바텀시트
        setCancelOpen(true)
        break
      case 'fx': // 환율정보 조회 풀팝업(M74)
        setExchrtOpen(true)
        break
    }
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소(infolist 숨김). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        {/* 요약 — 목록 카드(MUI-BD-01-M01)와 동일 구성(2026-08-06 요청): 뱃지 3종(업무구분·입찰구분·공고구분),
            공고번호-차수, 발주기관→기초예가금액→생산능력/입찰참가등록/입찰서제출 마감일시(년-월-일) 순. */}
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            ...(detail?.taskSeNm ? [{ key: 'taskSeNm', label: detail.taskSeNm }] : []),
            ...(detail?.bidSeNm ? [{ key: 'bidSeNm', label: detail.bidSeNm }] : []),
            { key: 'pbancSeNm', label: detail?.pbancSeNm ?? '' },
          ]}
          subtitle={`공고번호 ${detail?.g2bPbancNoOd ?? ''}`}
          title={detail?.bizNm ?? ''}
          actions={
            <SummaryUtilButton
              icon="KidStar"
              label={favorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
              active={favorite}
              onClick={handleToggleFavorite}
            />
          }
          rows={[
            { label: '발주기관', value: detail?.deptNm ?? '-' },
            { label: '기초예가금액', value: detail ? `${Number(detail.bsicExpt).toLocaleString()} 원` : '-' },
            { label: '생산능력 제출 마감일시', value: detail?.prdcpIdntySmdocDdlnDt?.slice(0, 10) ?? '-' },
            { label: '입찰참가등록 마감일시', value: detail?.bidRegDdlnDt?.slice(0, 10) ?? '-' },
            { label: '입찰서제출 마감일시', value: detail?.tndrSbmsnDdlnDt?.slice(0, 10) ?? '-' },
          ]}
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
                sheetItems={buildProgressSheet(detail.prgrsStg ?? '입찰', (substep, prgrsStg) => navigate('/anl-prgrs', { state: { substep, prgrsStg } }))}
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

      {/* 탭 콘텐츠 — 짧은 탭(공고문안/계약특수조건 등)도 헤더 접힘을 지탱할 만큼 스크롤 높이를 확보한다.
          min-h 가 없으면 접힐 때 줄어든 헤더 높이만큼 스크롤이 부족해져 top 이 클램프→재펼침으로 진동("팅김").
          긴 탭은 콘텐츠가 이미 더 커서 영향 없음(min-height 비활성). */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 플로팅 버튼 — 맨위로(항상) + 바로가기(+) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 (9300-36775) — 컨테이너는 페이지가 직접 조립, 항목은 세로 버튼 리스트 */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={shortcutItems.map((it) => ({
            label: it.label,
            variant: it.variant,
            onClick: () => handleShortcut(it.id),
          }))}
        />
      </BottomSheet>

      {/* 환율정보 조회 풀팝업 (MUI-BD-01-M74) — 바로가기 '환율정보 바로가기' 로 진입 */}
      <OvsExchrtListFullPopup open={exchrtOpen} onOpenChange={setExchrtOpen} />

      {/* 로그인 안내 (MUI-MS-03-P15) — 로그인 필요 동작을 비로그인 사용자가 시도할 때. */}
      <AlertModal
        open={loginGuideOpen}
        onOpenChange={setLoginGuideOpen}
        variant="info"
        title="로그인 안내"
        description="서비스를 사용하기 위해서 로그인이 필요합니다. 지금 로그인할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[BidDetail] 로그인 화면 이동'), // 추후: 로그인 화면(cm/auth) 이동
        }}
      />

      {/* 관심공고 등록/제외 토스트 (MUI-BD-01-P13) */}
      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        {toast.message}
      </Toast>

      {/* 입찰포기신청서(P03) — 바텀시트(컨테이너/footer 부모 소유, 콘텐츠는 ref 핸들 · 진행상세와 동일 조립) */}
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
        <BidAbndAperWrt ref={abandonRef} detail={prgrsDetail} onSubmitted={() => setAbandonOpen(false)} />
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
        <BidRtrcnAperInq ref={cancelRef} detail={prgrsDetail} onSubmitted={() => setCancelOpen(false)} />
      </BottomSheet>
    </div>
  )
}
