// 국외 입찰참가신청서 작성 (MUI-BD-04-M71~M77 · 설계서 09국외입찰진행 slide324~341).
// 라우트: /bd/ovs/prgrs/:id/aply — 국내(bidPrtcpAperWrt)와 동일한 '한 페이지 + 스탭 마법사' 구조(다음=다음탭).
// 흐름(설계서 slide327 화면 흐름도):
//   서약서동의 목록(M71) → [다음으로] → 신청서 4탭(M72 일반정보 / M73 업체정보 / M74 입찰 보증금 / M77 첨부파일)
//   → 마지막 탭 [신청하기](2026-07-02 화면 수정: 전자서명 → 신청하기) → 신청 완료(기존 aplyCmptn 재사용).
// 서약서 상세(P03)는 이 페이지가 BottomSheet 컨테이너/footer 를 소유하고 콘텐츠만 OvsProbWrotAgre
//   (국내 wrotAgrePage 의 WROTS '청렴 계약 이행 서약서' 본문 재사용). 저장은 '동의함' 선택 시에만 활성(설계서 slide332).
// 목록(입찰진행 목록, 국내 화면과 동일)에서 navigate state 로 넘어온 BidPrgrsItem 으로 상단 요약을 그린다.
//   직접 URL 진입(state 없음)이면 MOCK_DETAIL fallback.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { WROTS } from '@/ui/biz/bd/wrotAgrePage/WrotAgreForm'
import { AtchDocReg } from '@/ui/biz/bd/ovsBidPrtcpAply/AtchDocReg'
import { OvsProbWrotAgre } from '@/ui/biz/bd/ovsBidPrtcpAply/OvsProbWrotAgre'
import { Stp1 } from '@/ui/biz/bd/ovsBidPrtcpAply/Stp1'
import { Stp2 } from '@/ui/biz/bd/ovsBidPrtcpAply/Stp2'
import { Stp3 } from '@/ui/biz/bd/ovsBidPrtcpAply/Stp3'
import type { AplyFlowState, BidPrgrsItem } from '@/types/bd'

// ────────────────────────────────────────────────────────────────────────────
// 도메인 타입 — 설계서 데이터영역 항목명(영문) 그대로. // 추후 src/types/bd.ts 통합
// ────────────────────────────────────────────────────────────────────────────

/** 서약서 데이터 영역 (MUI-BD-04-P03, 설계서 slide332 dl_resultInfo). */
export interface OvsProbWrotAgreResultInfo {
  /** 서약일자 (wrotAgreYmd, 8) — 당일일자를 표시 */
  wrotAgreYmd: string
  /** 담당자명 (picNm, 200) — 로그인한 조달업체사용자의 명 */
  picNm: string
  /** 업체명 (sbtBzentyNm, 200) — 로그인한 조달업체사용자의 업체명 */
  sbtBzentyNm: string
  /** 발주기관명 (prcmRqtInstNm, 200) — 공고의 발주기관명 */
  prcmRqtInstNm: string
}

/** 공고일반 데이터 영역 (MUI-BD-04-M72, 설계서 slide338 dm_bscPbancInfo). */
export interface OvsBscPbancInfo {
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 공고차수 (pbancOd, 2) */
  pbancOd: string
  /** 개찰일자 (bdopnYmd, 8) — 화면 표시는 개찰일시 */
  bdopnYmd: string
  /** 입찰보증금총액 (bidGrnteAmt, 25) — 달러금액 */
  bidGrnteAmt: string
}

/** 신청업체 데이터 영역 (MUI-BD-04-M72, 설계서 slide338 dm_sbtInfo). */
export interface OvsSbtInfo {
  /** 신청업체 업체코드 (sbtBzentyCd, 5) */
  sbtBzentyCd: string
  /** 신청업체 업체명 (sbtBzentyNm, 200) */
  sbtBzentyNm: string
  /** 신청업체 대표자 (sbtRprsvNm, 200) */
  sbtRprsvNm: string
  /** 신청업체 전화번호 (sbtTlno, 11) */
  sbtTlno: string
  /** 신청업체 팩스 (sbtFxno, 40) */
  sbtFxno: string
  /** 신청업체 사업자등록번호 또는 DUNS NUM (sbtBzmnNo, 20) */
  sbtBzmnNo: string
  /** 신청업체 주소 (sbtAddr, 600) */
  sbtAddr: string
}

/** 입찰업체 데이터 영역 (MUI-BD-04-M73, 설계서 slide338 dm_splyInfo). */
export interface OvsSplyInfo {
  /** 입찰업체 업체코드 (splyBzentyCd, 5) — 속성 E */
  splyBzentyCd: string
  /** 입찰업체 업체명 (splyBzentyNm, 200) */
  splyBzentyNm: string
  /** 입찰업체 대표자 (splyRprsvNm, 200) */
  splyRprsvNm: string
  /** 입찰업체 이메일 (splyEmlAddr, 100) */
  splyEmlAddr: string
  /** 입찰업체 전화번호 (splyTlno, 11) */
  splyTlno: string
  /** 입찰업체 팩스 (splyFxno, 40) */
  splyFxno: string
  /** 입찰업체 사업자등록번호 또는 DUNS NUM (splyBzmnNo, 20) */
  splyBzmnNo: string
  /** 입찰업체 주소 (splyAddr, 600) */
  splyAddr: string
}

/**
 * 입찰참가사업 및 입찰보증금 1건 (MUI-BD-04-M74, 설계서 slide339 dl_bizList·dl_bizExmptnList 공통 R 필드).
 * 편집(E) 필드(chckBidGrnteAmt·grntePayMth·wtgrNo·grnteInstNm·grntePyslDocNo)는 Stp3 의 입력 상태로 관리.
 */
export interface OvsBidPrtcpBizItem {
  /** 구매요청번호 (prchsDmndNo, 10) — 목록 key */
  prchsDmndNo: string
  /** 사업명 (bizNm, 100) */
  bizNm: string
  /** 입찰품목수 (bdngItemQty, 15) */
  bdngItemQty: string
  /** 입찰총금액 (bdngTccrAmt, 25) — 달러금액 */
  bdngTccrAmt: string
  /** 입찰보증금 (bidGrnteAmt, 25) — 달러금액 */
  bidGrnteAmt: string
  /** 연대보증서 파일명 (gurnAgreDocNo, 38) — 보증금면제 목록(dl_bizExmptnList) 전용 */
  gurnAgreDocNo?: string
  /** 지급각서 파일명 (giveWrtprmDocNo, 38) — 보증금면제 목록(dl_bizExmptnList) 전용 */
  giveWrtprmDocNo?: string
}

/** 첨부서류 1건 (MUI-BD-04-M77, 설계서 slide340 dl_docList). id 는 목록 key 용(고유). */
export interface OvsAtchDocItem {
  /** 안정적 고유 식별자(목록 key) */
  id: string
  /** 첨부서류명 (atchDocNm, 200) — 제출해야 할 서류명(해외업체위임장 등) */
  atchDocNm: string
  /** 첨부파일명 (atchFileNm, 200) */
  atchFileNm: string
  /** 파일크기 (fileSz, 10) */
  fileSz: string
}

/** 입찰보증서 1건 (MUI-BD-04-P75, 설계서 slide343 dl_resultList). */
export interface OvsBidWtgrItem {
  /** 보증서번호 (wtgrNo, 30) — 목록 key */
  wtgrNo: string
  /** 개찰일자 (bdopnYmd, 8) */
  bdopnYmd: string
  /** 입찰건명 (bidNm, 100) */
  bidNm: string
  /** 보증금액 (grnteAmt, 25) */
  grnteAmt: string
  /** 보증채권자 (crdtrRprsvNm, 200) */
  crdtrRprsvNm: string
  /** 계약자 (ctrtrNm, 200) */
  ctrtrNm: string
  /** 발행자 (isrRprsvNm, 200) */
  isrRprsvNm: string
}

/** 보증서정보 상세 (MUI-BD-04-P76, 설계서 slide346~347 dl_wtgrInfo + dl_IsrInfo + dl_ctrtInfo). */
export interface OvsBidWtgrInfo {
  /** 증권번호 (wtgrNo, 30) */
  wtgrNo: string
  /** 보증금액 (grnteAmt, 25) */
  grnteAmt: string
  /** 보증기간 (grnteBgngPrd, 16) */
  grnteBgngPrd: string
  /** 보증료 (grfe, 21) */
  grfe: string
  /** 보증금율 (grnteAmtDepstRt, 5) */
  grnteAmtDepstRt: string
  /** 보증계약자 상호 (ctrtBzentyNm, 200) */
  ctrtBzentyNm: string
  /** 보증계약자 대표자 (ctrtRprsvNm, 200) */
  ctrtRprsvNm: string
  /** 보증채권자 상호 (crdtrBzentyNm, 200) */
  crdtrBzentyNm: string
  /** 보증채권자 대표자 (crdtrRprsvNm, 200) */
  crdtrRprsvNm: string
  /** 특기사항 (spcltMttr, 500) */
  spcltMttr: string
  /** 보증문 (grntePhrsCn, 1000) */
  grntePhrsCn: string
  /** 발행일자 (pblcnYmd, 8) */
  pblcnYmd: string
  // ── 발행자 데이터 영역 (dl_IsrInfo) ──────────────────────────────────────
  /** 발행자 상호 (isrBzentyNm, 200) */
  isrBzentyNm: string
  /** 발행자 대표자 (isrRprsvNm, 200) */
  isrRprsvNm: string
  /** 발행자 주소 (isrAddr, 100) */
  isrAddr: string
  /** 대리인 성명 (agtNm, 200) */
  agtNm: string
  /** 대리인 부서 (agtDeptNm, 100) */
  agtDeptNm: string
  /** 담당자 성명 (picNm, 200) */
  picNm: string
  /** 담당자 전화 (picTlno, 11) */
  picTlno: string
  /** 담당자 FAX (picFxno, 40) */
  picFxno: string
  // ── 보증계약 데이터 영역 (dl_ctrtInfo, 주계약) ───────────────────────────
  /** 입찰건명 (bidNm, 100) */
  bidNm: string
  /** 입찰금액 (bdngTccrAmt, 25) */
  bdngTccrAmt: string
  /** 입찰번호 (bidNo, 27) */
  bidNo: string
  /** 입찰서제출마감일자 (bdngDdlnDt, 14) */
  bdngDdlnDt: string
}

// ────────────────────────────────────────────────────────────────────────────
// 목업 — 설계서 항목명/형식 그대로(통합참조번호 BAD83990EFD · 공고번호 EFD0007-2500 · MD부품국외경쟁입찰).
// ────────────────────────────────────────────────────────────────────────────

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 국외 입찰진행 목록(국내 화면과 동일) 아이템 형태.
const MOCK_DETAIL: BidPrgrsItem = {
  rNum: '1',
  taskSeNm: '국외',
  pbancNo: 'EFD0007-2500',
  prcmNo: '83990',
  bidNm: 'MD부품국외경쟁입찰',
  rfrncNo: 'BAD83990EFD',
  orderInstTelno: '02-2079-5100',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '총액제',
  bidClrsDt: '2025-12-23 15:00',
  tndrSbmsnDdlnDt: '2025-12-24 10:00',
  bzentySeNm: '대표',
  bfhdSrng: false,
  bidPrgrsApfr: true,
  tndr: false,
  techEvl: false,
  prdcpDcmntSbms: false,
  apfrStatNm: '신청',
  regRjctYn: false,
}

// 서약서 데이터(P03 dl_resultInfo) — 서약일자는 당일일자 표시(설계서 slide331).
const WROT_RESULT_INFO: OvsProbWrotAgreResultInfo = {
  wrotAgreYmd: dayjs().format('YYYY 년 MM 월 DD 일'),
  picNm: '홍길동',
  sbtBzentyNm: 'FA무역대리점',
  prcmRqtInstNm: '방위사업청',
}

// 사후심사대상 입찰안내(M71 설계서 slide330 원문).
const NOTICE_ITEMS = [
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

// 서약서 동의 항목(M71) — 청렴 계약 이행 서약서 1건. 본문은 국내 WROTS(w_p03) 재사용.
const WROT_ID = 'w_p03'
const WROT_TITLE = WROTS.find((w) => w.id === WROT_ID)?.title ?? '청렴 계약 이행 서약서'

// 신청서 하위 탭(M72~M77). 국내 마법사와 동일하게 탭=스탭.
const TABS: TabItem[] = [
  { value: '일반정보', label: '일반정보' },
  { value: '업체정보', label: '업체정보' },
  { value: '입찰 보증금', label: '입찰 보증금' },
  { value: '첨부파일', label: '첨부파일' },
]

export function OvsBidPrtcpAplyPage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as BidPrgrsItem | null) ?? MOCK_DETAIL

  // 마법사 국면 — 'wrot'(M71 서약서동의 목록) → 'aper'(M72~M77 신청서 4탭).
  const [phase, setPhase] = useState<'wrot' | 'aper'>('wrot')
  const [tab, setTab] = useState('일반정보')

  // 서약서 동의 상태(M71) + 서약서 상세 바텀시트(P03).
  const [wrotChecked, setWrotChecked] = useState<string[]>([])
  const [wrotOpen, setWrotOpen] = useState(false)
  // P03 동의 선택 — 기본값 '동의안함'(설계서 slide331). '동의함'일 때만 저장 버튼 활성화(slide332).
  const [wrotChoice, setWrotChoice] = useState('동의안함')

  // 진행단계(M71 설계서 slide330): 서약서 → 신청서 → 서명 → 제출.
  const steps: StepItem[] = [
    { label: '서약서', state: phase === 'wrot' ? 'doing' : 'done' },
    { label: '신청서', state: phase === 'wrot' ? 'todo' : 'doing' },
    { label: '서명', state: 'todo' },
    { label: '제출', state: 'todo' },
  ]

  const scrollTop = () =>
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })

  // ── 서약서동의(M71) 핸들러 ────────────────────────────────────────────────
  const openWrot = () => {
    setWrotChoice('동의안함') // 기본값: 동의안함(설계서 slide331)
    setWrotOpen(true)
    console.log('[M71] 서약서 열람', WROT_ID) // 추후 API: bdService.getOvsProbWrotAgre
  }

  // 저장 클릭(P03) — 동의함 선택 시에만 활성. 저장 후 목록 체크 반영.
  const saveWrot = () => {
    setWrotChecked((prev) => [...new Set([...prev, WROT_ID])])
    setWrotOpen(false)
    console.log('[P03] 서약서 저장(동의)', WROT_ID) // 추후 API: bdService.saveOvsProbWrotAgre
  }

  const handleWrotNext = () => {
    console.log('[M71] 다음으로(신청서 작성)', { pbancNo: detail.pbancNo, agreed: wrotChecked })
    // 추후: 필수 서약서 동의 검증 후 이동
    setPhase('aper')
    setTab('일반정보')
    scrollTop()
  }

  // ── 신청서 탭(M72~M77) 핸들러 — 다음=다음탭, 마지막 탭=신청하기 ───────────
  const tabOrder = TABS.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isLastTab = tabIdx === tabOrder.length - 1
  const goTab = (next: string) => {
    setTab(next)
    scrollTop()
  }
  const handleNext = () => {
    if (!isLastTab) {
      goTab(tabOrder[tabIdx + 1])
      return
    }
    // 신청 클릭(M77 설계서 slide341) — 입찰참가신청서 등록. 모의입찰 상태인 경우 모의입찰참가신청.
    console.log('[M77] 입찰참가신청서 등록', { pbancNo: detail.pbancNo })
    // 추후 API: bdService.registerOvsBidPrtcpAply
    navigate(`/bd/prgrs/${detail.rNum}/aply-cmptn`, {
      state: {
        detail,
        aplyType: 'apfr',
        rcptNo: '2025 120 0042',
        rcptDt: '2025-12-01 10:30',
      } satisfies AplyFlowState,
    })
  }
  const handlePrev = () => {
    if (tabIdx > 0) {
      goTab(tabOrder[tabIdx - 1])
      return
    }
    // 첫 탭의 이전 = 서약서동의 목록(M71)으로.
    setPhase('wrot')
    scrollTop()
  }

  // 탭별 콘텐츠(M72 일반정보 / M73 업체정보 / M74 입찰 보증금 / M77 첨부파일).
  const renderTab = () => {
    switch (tab) {
      case '업체정보':
        return <Stp2 detail={detail} />
      case '입찰 보증금':
        return <Stp3 detail={detail} />
      case '첨부파일':
        return <AtchDocReg detail={detail} />
      default:
        return <Stp1 detail={detail} />
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/계약방법 + 통합참조번호·공고번호 + 입찰건명(설계서: 통합참조번호 BAD83990EFD / 공고번호 EFD0007-2500) */}
      <SummaryInfo
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={`${detail.rfrncNo} / ${detail.pbancNo}`}
        title={detail.bidNm}
      />

      {/* 진행단계 표시기 — 서약서/신청서/서명/제출 */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={steps} className="bg-transparent" />
      </div>

      {phase === 'wrot' ? (
        <>
          {/* 사후심사대상 입찰안내 — 입찰전 꼭 확인(설계서 slide330) */}
          <Infobox title="사후심사대상 입찰안내" items={NOTICE_ITEMS} />

          {/* 서약서 동의 섹션 */}
          <SectionTitle as="h2" topDivider>
            서약서 동의
          </SectionTitle>

          {/* 서약서 동의 목록 — 청렴 계약 이행 서약서 1건(보기 → P03 바텀시트) */}
          <AgreementList
            className="m-4"
            checkAll={false}
            items={[{ id: WROT_ID, title: WROT_TITLE, requirement: 'required' }]}
            checked={wrotChecked}
            onToggle={(id, on) =>
              setWrotChecked((prev) => (on ? [...new Set([...prev, id])] : prev.filter((v) => v !== id)))
            }
            onView={openWrot}
          />

          {/* 하단 액션바 — 취소/다음으로(설계서 slide330) */}
          <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
            <ButtonGroup
              layout="split"
              items={[
                { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
                { label: '다음으로', variant: 'primary', onClick: handleWrotNext },
              ]}
            />
          </div>
        </>
      ) : (
        <>
          {/* 신청서 하위 탭 — 다음/이전으로 스텝 이동 */}
          <TabList items={TABS} value={tab} onChange={goTab} />

          {renderTab()}

          {/* 하단 액션바 — 이전/다음으로(마지막 탭=신청하기, 2026-07-02 화면 수정) */}
          <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
            <ButtonGroup
              layout="split"
              items={[
                { label: '이전', variant: 'secondary', onClick: handlePrev },
                {
                  label: isLastTab ? '신청하기' : '다음으로',
                  variant: 'primary',
                  onClick: handleNext,
                },
              ]}
            />
          </div>
        </>
      )}

      {/* 맨위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollTop} />

      {/* 서약서 상세(P03) — 컨테이너/footer 는 페이지 소유, 콘텐츠만 OvsProbWrotAgre.
          저장 후 닫기는 '동의함' 선택 시에만 활성화(설계서 slide332 이벤트). */}
      <BottomSheet
        open={wrotOpen}
        onOpenChange={setWrotOpen}
        title={WROT_TITLE}
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setWrotOpen(false) },
              {
                label: '저장 후 닫기',
                variant: 'primary',
                disabled: wrotChoice !== '동의함',
                onClick: saveWrot,
              },
            ]}
          />
        }
      >
        <OvsProbWrotAgre
          resultInfo={WROT_RESULT_INFO}
          choice={wrotChoice}
          onChoiceChange={setWrotChoice}
        />
      </BottomSheet>
    </div>
  )
}
OvsBidPrtcpAplyPage.displayName = 'OvsBidPrtcpAplyPage'
