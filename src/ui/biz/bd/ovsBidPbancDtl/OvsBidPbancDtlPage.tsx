// 국외 입찰공고 상세 (MUI-BD-01-M71(컨테이너) · 탭 T71~T73(구 M71~M73 — v1.83 재편), 설계서 slide289~296). 목록 국외 카드 클릭 → /bd/ovsBidPbancDtl 진입.
// 레퍼런스: 국내 입찰공고 상세 BidPbancDtlPage (요약정보+스텝바+탭+탭콘텐츠 동일 패턴).
// 구성: 요약정보(SummaryInfo) + 스텝바(StepBar) + 탭 3개(일반정보 M71 / 품목 목록 M72 / 첨부서류 M73)
//   + 플로팅 버튼(맨위로 / + → 바로가기 바텀시트: 보관함·이전공고입찰내역·목표가공개품목·환율정보·입찰결과).
// 일반정보 탭(M71)은 페이지 컨테이너와 같은 화면 ID 라 이 파일이 함께 소유(로컬 컴포넌트).
// 데이터는 목업(상단=목록에서 넘어온 항목, 없으면 페이지 fallback 목업). 백엔드 미연동.
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout) 담당.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { useAuthStore } from '@/stores/authStore'
import type { BidPbancItem } from '@/types/bd'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
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
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsExchrtListFullPopup } from '@/ui/biz/bd/ovsExchrtList/OvsExchrtListFullPopup'
import { OvsBfrTmprBidBidCnRegFullPopup } from '@/ui/biz/bd/ovsBfrTmprBidBidCnReg/OvsBfrTmprBidBidCnRegFullPopup'
import { OvsBidPbancDtl } from '@/ui/biz/bd/ovsBidPbancDtl/OvsBidPbancDtl'
import { OvsBidPbancDtl2 } from '@/ui/biz/bd/ovsBidPbancDtl/OvsBidPbancDtl2'

// ── 도메인 타입 (설계서 항목설명 1.1~1.2 항목명 그대로 · 품목/첨부서류 타입은 @/types/bd) ──

/** 공지사항 1건 (dm_ntcInfo, 설계서 slide293 1.1) */
export interface OvsNtcInfo {
  /** 공지일자 (ntcYmd, 8) */
  ntcYmd: string
  /** 공지내용 (ntcCn, 200) */
  ntcCn: string
}

/** 공고일반 데이터 영역 (dm_bscPbancInfo, 설계서 slide293 1.2) — 일반정보 탭 + 담당자 정보 */
export interface OvsBidPbancDetail {
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 공고차수 (pbancOd, 2) */
  pbancOd: string
  /** 공고구분 (pbancType, 100) */
  pbancType: string
  /** 공고일자 (pbancRqstYmd, 8) */
  pbancRqstYmd: string
  /** 구매요청번호 (prchsDmndNo, 10) */
  prchsDmndNo: string
  /** 통합참조번호 (intgRfrncNo, 30) */
  intgRfrncNo: string
  /** 사업명 (bizNm, 100) */
  bizNm: string
  /** 입찰유형 (bidMthd, 100) — 단가제/총액제 */
  bidMthd: string
  /** 입찰매체 (bidMedia, 100) */
  bidMedia: string
  /** 계약방법 (ctrtMthdNm, 100) */
  ctrtMthdNm: string
  /** 입찰방식 (bidMth, 100) */
  bidMth: string
  /** 총금액 (sumDrctnAmt, 25) — 달러 금액 */
  sumDrctnAmt: string
  /** 환율적용일자 (exchrtAplcnYmd, 8) */
  exchrtAplcnYmd: string
  /** 공고품목수 (itemQty, 15) */
  itemQty: string
  /** 입찰참가등록마감일시 (regDdlnDt, 14) */
  regDdlnDt: string
  /** 입찰서제출마감일시 (bdngDdlnDt, 14) */
  bdngDdlnDt: string
  /** 개찰일시 (bdopnDt, 14) */
  bdopnDt: string
  /** 담당부서 (picDeptNm, 100) */
  picDeptNm: string
  /** 담당자 (picNm, 200) */
  picNm: string
  /** 연락처 (picTlno, 11) */
  picTlno: string
}

// ── 탭 (설계서 slide289 — 일반정보 / 품목 목록 / 첨부서류) ─────────────────────────
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'items', label: '품목 목록' },
  { value: 'attach', label: '첨부서류' },
]

// ── 페이지 fallback 목업 (직접 URL 진입 대비) — 설계서 slide289 예시값 기반 ─────────
const MOCK_OVS_LIST_ITEM: BidPbancItem = {
  id: 'EFD0007',
  rnum: 1,
  pbancTpcd: '정상공고',
  g2BBidPbancNo: 'EFD0007',
  g2BBidPbancCycl: '2',
  rfrncNo: 'BAD83990EFD',
  rprsItemNm: '500MD부품',
  csrtName: '-',
  orderInstNm: '국제부품계약팀',
  prdcpIdntySmdocDdlnDt: '-',
  bidClrsDt: '2025-12-23 17:00',
  tndrSbmsnDdlnDt: '2025-12-24 10:00',
  brprc: 184502064, // 총금액 $126,000.18 의 원화 환산 참고값(요약에는 미표시 — 국외는 USD 총금액 사용)
  prgrsStg: '입찰',
}

// 공고일반(dm_bscPbancInfo) 목업 — 설계서 slide290 데이터영역 예시값 그대로. 추후 bdService.selectOvsBidPbancDetail
const MOCK_OVS_BID_PBANC_DETAIL: OvsBidPbancDetail = {
  pbancNo: 'EFD0007',
  pbancOd: '2',
  pbancType: '정상공고',
  pbancRqstYmd: '2025-11-22',
  prchsDmndNo: 'BAD839380-001',
  intgRfrncNo: 'BAD83990EFD',
  bizNm: '500MD부품',
  bidMthd: '단가제',
  bidMedia: '전자입찰',
  ctrtMthdNm: '일반경쟁',
  bidMth: '일반투찰',
  sumDrctnAmt: '$ 126,000.18',
  exchrtAplcnYmd: '2025-11-13',
  itemQty: '12',
  regDdlnDt: '2025-12-23 17:00:00',
  bdngDdlnDt: '2025-12-24 10:00:00',
  bdopnDt: '2025-12-24 10:30:00',
  picDeptNm: '국제부품계약팀',
  picNm: '정영금',
  picTlno: '02-1234-5678',
}

// 공지사항(dm_ntcInfo) 목업 — 설계서 slide289 '국외경쟁입찰 공지사항' 영역.
const MOCK_NTC_LIST: OvsNtcInfo[] = [
  {
    ntcYmd: '2025-12-22',
    ntcCn: '본 공고는 국외경쟁입찰 공고입니다. 입찰참가등록 및 입찰서 제출 마감일시를 반드시 확인하시기 바랍니다.',
  },
]

// ── 단계표시기(StepBar) — 국내 상세와 동일 5단계, 현재 단계는 prgrsStg 로 결정 ──────
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

/** 진행단계(prgrsStg)로 StepBar items 생성 — 이전 done / 현재 doing / 이후 todo. */
function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

// ── 일반정보 탭 (MUI-BD-01-T71(구 M71 — v1.83 재편)) — 페이지와 같은 화면 ID 라 이 파일이 소유 ────────────
function GeneralInfoTab({
  detail,
  onOpenExchrt,
}: {
  detail: OvsBidPbancDetail
  onOpenExchrt: () => void
}) {
  // 일반정보 (설계서 slide290 데이터영역 순서 그대로)
  const generalRows: TableRow[] = [
    { label: '공고번호-차수', value: `${detail.pbancNo}-${detail.pbancOd}` },
    { label: '공고구분', value: detail.pbancType },
    { label: '공고일자', value: detail.pbancRqstYmd },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '사업명', value: detail.bizNm },
    { label: '입찰유형', value: detail.bidMthd },
    { label: '입찰매체', value: detail.bidMedia },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '입찰방식', value: detail.bidMth },
    { label: '총금액', value: detail.sumDrctnAmt, type: 'number' },
    {
      label: '환율적용일자',
      value: (
        <div className="flex items-center justify-between gap-2">
          <span>{detail.exchrtAplcnYmd}</span>
          <Button size="sm" variant="inner" onClick={onOpenExchrt}>
            환율정보
          </Button>
        </div>
      ),
      type: 'combination',
    },
    { label: '공고품목수', value: detail.itemQty, type: 'number' },
    { label: '입찰참가등록마감일시', value: detail.regDdlnDt },
    { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
    { label: '개찰일시', value: detail.bdopnDt },
  ]

  // 담당자 정보 (설계서 slide290 우측)
  const contactRows: TableRow[] = [
    { label: '담당 부서명', value: detail.picDeptNm },
    { label: '담당자', value: detail.picNm },
    { label: '연락처', value: detail.picTlno },
  ]

  return (
    <>
      {/* 공지사항 (dm_ntcInfo) — 국외경쟁입찰 공지 영역 */}
      <div className="px-4 pb-2">
        <Infobox
          title="공지사항"
          items={MOCK_NTC_LIST.map((n) => `[${n.ntcYmd}] ${n.ntcCn}`)}
        />
      </div>
      <Accordion type="multiple" defaultValue={['general', 'contact']} className="w-full">
        <AccordionSection value="general" title="일반정보" borderTop={false}>
          <Table rows={generalRows} />
        </AccordionSection>
        <AccordionSection value="contact" title="담당자 정보">
          <Table rows={contactRows} />
        </AccordionSection>
      </Accordion>
    </>
  )
}

export function OvsBidPbancDtlPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트
  // 관심공고(즐겨찾기) 등록 여부 — 추후 bdService.selectOvsBidPbancDetail 응답으로 초기화. 현재 mock false.
  const [favorite, setFavorite] = useState(false)
  const [loginGuideOpen, setLoginGuideOpen] = useState(false) // 로그인 안내(MUI-MS-03-P15)
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보조회 풀팝업(MUI-BD-01-M74, UI-BD-01-P73)
  const [bfrBidOpen, setBfrBidOpen] = useState(false) // 이전공고입찰내역등록 풀팝업(MUI-BD-01-P79)
  // 관심공고 등록/제외 토스트(MUI-BD-01-P13)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' })

  // 로그인 필요 동작(업체담당자 노출 버튼) — 비로그인 시 로그인 안내(P15) 노출하고 동작 차단.
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  // 목록 → 상세 데이터 전달: 통합목록 국외 카드에서 navigate(state)로 넘어온 항목(BidPbancItem)으로 상단을 그린다.
  //   직접 URL 진입(state 없음)이면 페이지 목업(MOCK_OVS_LIST_ITEM)으로 대체. (백엔드 미연동)
  const passed = (useLocation().state as BidPbancItem | null) ?? MOCK_OVS_LIST_ITEM
  const id = passed.id
  // 국외 전용 상세 필드(총금액 USD·환율적용일자·담당자 등)는 목록 아이템에 없어 페이지 목업으로 보완.
  const ovsDetail = MOCK_OVS_BID_PBANC_DETAIL
  // 진행단계(prgrsStg) — detail 기반. 미정 시 입찰공고이므로 '입찰' 기본.
  const steps = stepsByStg(passed.prgrsStg ?? '입찰')

  // 즐겨찾기(관심공고) 토글 — 관심공고등록 이벤트(scnwin.btn_favorite_onclick). 업체담당자 노출.
  const handleToggleFavorite = () => {
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
    console.log('[M71] 관심공고', next ? '등록' : '제외', id) // 추후 API: bdService.toggleFavorite
  }

  // 바로가기 바텀시트 항목 — 설계서 이벤트 설명(slide296) 기반.
  //   보관함/이전공고입찰내역 = 업체담당자(로그인) 전용 → 비로그인 시 로그인 안내(P15).
  const shortcutItems: {
    id: string
    label: string
    variant: 'primary' | 'secondary' | 'tertiary'
    needLogin?: boolean
  }[] = [
    { id: 'locker', label: '국외 보관함 바로가기', variant: 'primary', needLogin: true },
    { id: 'prevBid', label: '이전공고입찰내역 불러오기', variant: 'primary', needLogin: true },
    { id: 'goalPrc', label: '목표가공개품목조회', variant: 'secondary' },
    { id: 'bidResult', label: '입찰결과 조회', variant: 'secondary' },
    { id: 'fx', label: '환율정보 바로가기', variant: 'tertiary' },
  ]

  const handleShortcut = (itemId: string) => {
    setShortcutOpen(false)
    const item = shortcutItems.find((it) => it.id === itemId)
    if (item?.needLogin && !isLoggedIn) {
      setLoginGuideOpen(true)
      return
    }
    switch (itemId) {
      case 'locker':
        navigate('/bd/ovs/locker') // 국외 보관함 목록(MUI-CM-01-M71)
        break
      case 'prevBid':
        setBfrBidOpen(true) // 이전공고입찰내역등록(MUI-BD-01-P79) — 풀페이지 팝업
        break
      case 'goalPrc':
        navigate('/bd/ovs/goal-prc-items') // 목표가공개품목조회(MUI-BD-01-M75)
        break
      case 'bidResult':
        // 국외 입찰결과상세(UI-BD-09-M71) 미구축 — 라우트 등록 후 연결.
        console.log('[M71] 입찰결과 조회 이동', id) // 추후: navigate(국외 입찰결과상세)
        break
      case 'fx':
        setExchrtOpen(true) // 환율정보조회 풀팝업(M74)
        break
    }
  }

  function renderTabContent(current: string) {
    switch (current) {
      case 'general':
        return <GeneralInfoTab detail={ovsDetail} onOpenExchrt={() => setExchrtOpen(true)} />
      case 'items':
        return <OvsBidPbancDtl />
      case 'attach':
        return <OvsBidPbancDtl2 />
      default:
        return null
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
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: passed.pbancTpcd }, { label: '국외경쟁입찰' }]}
          subtitle={`공고번호 ${ovsDetail.pbancNo}-${ovsDetail.pbancOd}`}
          title={passed.rprsItemNm}
          actions={
            <SummaryUtilButton
              icon="KidStar"
              label={favorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
              active={favorite}
              onClick={handleToggleFavorite}
            />
          }
          rows={[
            { label: '공고일자', value: ovsDetail.pbancRqstYmd },
            { label: '입찰참가등록 마감일시', value: passed.bidClrsDt },
            { label: '입찰서제출 마감일시', value: passed.tndrSbmsnDdlnDt },
            { label: '개찰일시', value: ovsDetail.bdopnDt },
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
                sheetItems={buildProgressSheet(passed.prgrsStg ?? '입찰', (substep, prgrsStg) => navigate('/anl-prgrs', { state: { substep, prgrsStg } }))}
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(국내 상세와 동일 사유) */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 플로팅 버튼 — 맨위로(항상) + 바로가기(+) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 — 컨테이너는 페이지가 직접 조립, 항목은 세로 버튼 리스트 */}
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

      {/* 환율정보 조회 풀팝업 (MUI-BD-01-M74) — 일반정보 탭 '환율정보' / 바로가기 '환율정보 바로가기' */}
      <OvsExchrtListFullPopup open={exchrtOpen} onOpenChange={setExchrtOpen} />

      {/* 이전공고입찰내역등록 (MUI-BD-01-P79) — 풀페이지 팝업. */}
      <OvsBfrTmprBidBidCnRegFullPopup
        open={bfrBidOpen}
        onOpenChange={setBfrBidOpen}
        lockerId={passed.rfrncNo}
      />

      {/* 로그인 안내 (MUI-MS-03-P15) — 업체담당자 전용 동작을 비로그인 사용자가 시도할 때. */}
      <AlertModal
        open={loginGuideOpen}
        onOpenChange={setLoginGuideOpen}
        variant="info"
        title="로그인 안내"
        description="서비스를 사용하기 위해서 로그인이 필요합니다. 지금 로그인할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[M71] 로그인 화면 이동'), // 추후: 로그인 화면(cm/auth) 이동
        }}
      />

      {/* 관심공고 등록/제외 토스트 (MUI-BD-01-P13) */}
      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        {toast.message}
      </Toast>
    </div>
  )
}
OvsBidPbancDtlPage.displayName = 'OvsBidPbancDtlPage'
