// 국외 입찰참가신청서 작성 (MUI-BD-04-M71(컨테이너) · T71 서약서동의목록 · 스탭 T72~T75(구 M72~M77 — v1.83 재편) · 설계서 09국외입찰진행 slide324~341).
// 라우트: /bd/ovsBidPrtcpAply — 국내(bidPrtcpAperWrt)와 동일한 '한 페이지 + 스탭 마법사' 구조(다음=다음탭).
// 흐름(설계서 slide327 화면 흐름도):
//   서약서동의 목록(M71) → [다음으로] → 신청서 4탭(M72 일반정보 / M73 업체정보 / M74 입찰 보증금 / M77 첨부파일)
//   → 마지막 탭 [신청하기](2026-07-02 화면 수정: 전자서명 → 신청하기) → 신청 완료(기존 aplyCmptn 재사용).
// 서약서 상세(P03)는 이 페이지가 BottomSheet 컨테이너/footer 를 소유하고 콘텐츠만 OvsProbWrotAgre
//   (국내 wrotAgrePage 의 WROTS '청렴 계약 이행 서약서' 본문 재사용). 저장은 '동의함' 선택 시에만 활성(설계서 slide332).
// 목록(입찰진행 목록, 국내 화면과 동일)에서 navigate state 로 넘어온 MockBidPrgrsItem 으로 상단 요약을 그린다.
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
import type { MockAplyFlowState, MockBidPrgrsItem, MockOvsProbWrotAgreResultInfo } from '@/types/mock/bd'

// ────────────────────────────────────────────────────────────────────────────
// 도메인 타입 — 설계서 데이터영역 항목명(영문) 그대로. 공유 타입은 @/types/bd 로 이관.
// ────────────────────────────────────────────────────────────────────────────

/** 첨부서류 1건 (MUI-BD-04-T75(구 M77 — v1.83 재편), 설계서 slide340 dl_docList). id 는 목록 key 용(고유).
 *  ⚠️ 상세 화면(ovsBidPrtcpApfrDtl)의 동명 OvsAtchDocItem 과 필드가 다름(그쪽은 id 없음)
 *     — 설계서 기반 이름이라 개명하지 않고 화면별로 각자 유지. */
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

// ────────────────────────────────────────────────────────────────────────────
// 목업 — 설계서 항목명/형식 그대로(통합참조번호 BAD83990EFD · 공고번호 EFD0007-2500 · MD부품국외경쟁입찰).
// ────────────────────────────────────────────────────────────────────────────

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 국외 입찰진행 목록(국내 화면과 동일) 아이템 형태.
const MOCK_DETAIL: MockBidPrgrsItem = {
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
const WROT_RESULT_INFO: MockOvsProbWrotAgreResultInfo = {
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
  // 진입 경로가 여럿(입찰진행 상세 = MockBidPrgrsItem 전체 / 국외보관함 목록 = 매핑된 부분 필드)이라
  // fallback 목업 위에 병합 — 부분 state 로 들어와도 요약이 비지 않는다.
  const stateItem = useLocation().state as Partial<MockBidPrgrsItem> | null
  const detail: MockBidPrgrsItem = { ...MOCK_DETAIL, ...(stateItem ?? {}) }

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
    console.log('[M71] 서약서 열람', WROT_ID) // 추후 API: bdService.selectOvsProbWrotAgre
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
    // 추후 API: bdService.insertOvsBidPrtcpAply
    navigate('/bd/aplyCmptn', {
      state: {
        detail,
        aplyType: 'apfr',
        rcptNo: '2025 120 0042',
        rcptDt: '2025-12-01 10:30',
      } satisfies MockAplyFlowState,
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
    // min-h-full + 액션바 mt-auto — 콘텐츠가 짧은 서약서 단계에서도 하단 버튼이 화면 맨 아래 붙는다
    // (mbWithdrawal 확정 패턴 2026-08-25).
    <div className="flex min-h-full w-full flex-col">
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

          {/* 사후심사대상 입찰안내 — 서약서 동의 하단 배치(사용자 지시 2026-08-26, 원 설계서 slide330 은 상단) */}
          <Infobox title="사후심사대상 입찰안내" items={NOTICE_ITEMS} />

          {/* 하단 액션바 — 취소/다음으로. 화면 하단 고정(sticky, cm 페이지 공통 패턴) */}
          <div
            className="sticky bottom-0 z-30 mt-auto border-t border-krds-border-divider bg-background px-4 pt-3"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          >
            <ButtonGroup
              layout="asymmetric"
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

          {/* 하단 액션바 — 이전/다음으로(마지막 탭=신청하기, 2026-07-02 화면 수정). 화면 하단 고정(sticky) */}
          <div
            className="sticky bottom-0 z-30 mt-auto border-t border-krds-border-divider bg-background px-4 pt-3"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          >
            <ButtonGroup
              layout="asymmetric"
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
        title="서약서 상세" // v0.87 검토80 — 팝업 타이틀은 '서약서 상세', 서약서명은 본문 제목으로

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
        {/* v0.87 검토80 — 기존 타이틀(서약서명)을 본문 제목으로 */}
        <p className="pt-2 text-center text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {WROT_TITLE}
        </p>
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
