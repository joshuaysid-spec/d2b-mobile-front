// 국외 입찰참가신청서 작성 (MUI-BD-04-M71(컨테이너) · T71 서약서동의목록 · 스탭 T72~T75(구 M72~M77 — v1.83 재편) · 설계서 v1.88 slide441~452).
// 라우트: /bd/ovsBidPrtcpAply — 국내(bidPrtcpAperWrt)와 동일한 '한 페이지 + 스탭 마법사' 구조(다음=다음탭).
// 흐름(설계서 화면 흐름도):
//   서약서동의 목록(T71) → [다음으로] → 신청서 4탭(T72 일반정보 / T73 업체정보 / T74 입찰 보증금 / T75 첨부파일)
//   → 마지막 탭 [신청하기](2026-07-02 화면 수정: 전자서명 → 신청하기) → 신청 완료(기존 aplyCmptn 재사용).
// 검증(2026-09-14 사용자 확정 — 탭마다 RHF, 페이지는 확정값만 보관):
//   · [다음으로] 마다 현재 탭만 검증. 입력 탭(T73·T74)은 자기 useForm+zod 를 갖고 ref.submit() 으로 제출,
//     통과하면 onSubmit(값)으로 페이지에 확정값을 넘기고 페이지가 다음 탭으로 이동. 실패하면 이동 없이 탭 안 첫 에러 필드 포커스.
//   · 되돌아오면 페이지가 보관한 확정값을 defaultValues 로 다시 주입(탭 언마운트로 값이 사라지던 문제 해결).
//   · T71 서약서 동의는 페이지 소유 소형 폼(ovsWrotAgreSchema) — 필수 서약서 미동의 시 차단.
//   · T72 일반정보(조회 전용)·T75 첨부파일(서류 필수 규칙 설계서 미기재)은 검증 없이 통과.
// 서약서 상세(P03)는 이 페이지가 BottomSheet 컨테이너/footer 를 소유하고 콘텐츠만 OvsProbWrotAgre
//   (국내 wrotAgrePage 의 WROTS '청렴 계약 이행 서약서' 본문 재사용). 저장은 '동의함' 선택 시에만 활성(설계서 slide443).
// 목록(입찰진행 목록, 국내 화면과 동일)에서 navigate state 로 넘어온 MockBidPrgrsItem 으로 상단 요약을 그린다.
//   직접 URL 진입(state 없음)이면 MOCK_DETAIL fallback.
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { focusField } from '@/utils/focusField'
import { InputMessage } from '@/ui/common/base/InputMessage'
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
import { Stp2, type Stp2Handle } from '@/ui/biz/bd/ovsBidPrtcpAply/Stp2'
import { Stp3, type Stp3Handle } from '@/ui/biz/bd/ovsBidPrtcpAply/Stp3'
import { BID_GRNTE_DEFAULT, SPLY_INFO_DEFAULT } from '@/ui/biz/bd/ovsBidPrtcpAply/ovsBidPrtcpAplyMock'
import {
  ovsWrotAgreSchema,
  type OvsBidGrnteValues,
  type OvsSplyInfoValues,
  type OvsWrotAgreValues,
} from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAply.schema'
import type { MockAplyFlowState, MockBidPrgrsItem, MockOvsProbWrotAgreResultInfo } from '@/types/mock/bd'

// ────────────────────────────────────────────────────────────────────────────
// 도메인 타입 — 설계서 데이터영역 항목명(영문) 그대로. 공유 타입은 @/types/bd 로 이관.
// ────────────────────────────────────────────────────────────────────────────

/** 첨부서류 1건 (MUI-BD-04-T75(구 M77 — v1.83 재편), 설계서 slide451 dl_docList). id 는 목록 key 용(고유).
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

// 서약서 데이터(P03 dl_resultInfo) — 서약일자는 당일일자 표시(설계서 slide443).
const WROT_RESULT_INFO: MockOvsProbWrotAgreResultInfo = {
  wrotAgreYmd: dayjs().format('YYYY 년 MM 월 DD 일'),
  picNm: '홍길동',
  sbtBzentyNm: 'FA무역대리점',
  prcmRqtInstNm: '방위사업청',
}

// 사후심사대상 입찰안내(T71 설계서 slide441 원문).
const NOTICE_ITEMS = [
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

// 서약서 동의 항목(T71) — 청렴 계약 이행 서약서 1건([필수]). 본문은 국내 WROTS(w_p03) 재사용.
// (행정정보 공동이용 사전동의서는 국외 입찰서 제출(ovsTndrSbmsn)에만 추가 — 2026-09-14 사용자 정정, 여기엔 두지 않는다.)
const WROT_ID = 'w_p03'
const WROT_TITLE = WROTS.find((w) => w.id === WROT_ID)?.title ?? '청렴 계약 이행 서약서'
const WROT_ITEMS = [{ id: WROT_ID, title: WROT_TITLE, requirement: 'required' as const }]
const REQUIRED_WROT_IDS = WROT_ITEMS.map((w) => w.id)
const wrotSchema = ovsWrotAgreSchema(REQUIRED_WROT_IDS)

// 신청서 하위 탭(T72~T75). 국내 마법사와 동일하게 탭=스탭.
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

  // 마법사 국면 — 'wrot'(T71 서약서동의 목록) → 'aper'(T72~T75 신청서 4탭).
  const [phase, setPhase] = useState<'wrot' | 'aper'>('wrot')
  const [tab, setTab] = useState('일반정보')

  // ── 서약서 동의(T71) 폼 — 페이지 소유(AgreementList 는 인라인). 필수 서약서 동의 체크 검증. ──
  const wrotForm = useForm<OvsWrotAgreValues>({
    resolver: zodResolver(wrotSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange', // 체크 즉시 에러 해제
    shouldFocusError: false, // AgreementList 는 RHF ref 없음 → focusField 로 통일
    defaultValues: { wrotChecked: [] },
  })
  const wrotError = wrotForm.formState.errors.wrotChecked?.message
  // 서약서 상세 바텀시트(P03) — 열람 중인 서약/동의서 id(null=닫힘). 청렴서약서·사전동의서가 같은 시트를 공유.
  const [wrotTarget, setWrotTarget] = useState<string | null>(null)
  const wrotTargetTitle = WROT_ITEMS.find((w) => w.id === wrotTarget)?.title ?? ''
  // P03 동의 선택 — 기본값 '동의안함'(설계서 slide442). '동의함'일 때만 저장 버튼 활성화(slide443).
  const [wrotChoice, setWrotChoice] = useState('동의안함')

  // ── 신청서 탭 확정값(페이지 보관) — 되돌아올 때 defaultValues 로 재주입. ──
  const [splyValues, setSplyValues] = useState<OvsSplyInfoValues>(SPLY_INFO_DEFAULT)
  const [grnteValues, setGrnteValues] = useState<OvsBidGrnteValues>(BID_GRNTE_DEFAULT)
  const stp2Ref = useRef<Stp2Handle>(null)
  const stp3Ref = useRef<Stp3Handle>(null)

  // 진행단계(T71 설계서 slide441): 서약서 → 신청서 → 서명 → 제출.
  const steps: StepItem[] = [
    { label: '서약서', state: phase === 'wrot' ? 'doing' : 'done' },
    { label: '신청서', state: phase === 'wrot' ? 'todo' : 'doing' },
    { label: '서명', state: 'todo' },
    { label: '제출', state: 'todo' },
  ]

  const scrollTop = () =>
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })

  // ── 서약서동의(T71) 핸들러 ────────────────────────────────────────────────
  const openWrot = (id: string) => {
    setWrotChoice('동의안함') // 기본값: 동의안함(설계서 slide442)
    setWrotTarget(id)
    console.log('[T71] 서약서 열람', id) // 추후 API: bdService.selectOvsProbWrotAgre
  }

  // 저장 클릭(P03) — 동의함 선택 시에만 활성. 저장 후 목록 체크 반영(폼 값 갱신 + 재검증으로 에러 해제).
  const saveWrot = () => {
    if (!wrotTarget) return
    const prev = wrotForm.getValues('wrotChecked')
    wrotForm.setValue('wrotChecked', [...new Set([...prev, wrotTarget])], { shouldValidate: true })
    console.log('[P03] 서약서 저장(동의)', wrotTarget) // 추후 API: bdService.saveOvsProbWrotAgre
    setWrotTarget(null)
  }

  // [다음으로] — 필수 서약서 동의 검증 통과 시 신청서 탭으로. 실패 시 목록 아래 에러 + 목록으로 포커스.
  const handleWrotNext = wrotForm.handleSubmit(
    (values) => {
      console.log('[T71] 다음으로(신청서 작성)', { pbancNo: detail.pbancNo, agreed: values.wrotChecked })
      setPhase('aper')
      setTab('일반정보')
      scrollTop()
    },
    () => focusField('field-wrotChecked'),
  )

  // ── 신청서 탭(T72~T75) 핸들러 — 다음=다음탭(현재 탭 검증), 마지막 탭=신청하기 ───────────
  const tabOrder = TABS.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isLastTab = tabIdx === tabOrder.length - 1
  const goTab = (next: string) => {
    setTab(next)
    scrollTop()
  }
  const goNextTab = () => goTab(tabOrder[tabIdx + 1])
  const handleNext = () => {
    switch (tab) {
      case '업체정보':
        stp2Ref.current?.submit() // 통과 → onSubmit 에서 저장 + 다음 탭
        return
      case '입찰 보증금':
        stp3Ref.current?.submit()
        return
      case '첨부파일': {
        // 신청 클릭(T75 설계서 slide452 btn_submit_onclick) — 입찰참가신청서 등록. 모의입찰 상태인 경우 모의입찰참가신청.
        // 서류별 필수 규칙 설계서 미기재 → 첨부 검증 없음(사용자 확정 2026-09-14).
        console.log('[T75] 입찰참가신청서 등록', { pbancNo: detail.pbancNo, splyValues, grnteValues })
        // 추후 API: bdService.insertOvsBidPrtcpAply({ ...splyValues, ...grnteValues })
        navigate('/bd/aplyCmptn', {
          state: {
            detail,
            aplyType: 'apfr',
            rcptNo: '2025 120 0042',
            rcptDt: '2025-12-01 10:30',
          } satisfies MockAplyFlowState,
        })
        return
      }
      default:
        goNextTab() // 일반정보(조회 전용) — 검증 없음
    }
  }
  const handlePrev = () => {
    if (tabIdx > 0) {
      goTab(tabOrder[tabIdx - 1])
      return
    }
    // 첫 탭의 이전 = 서약서동의 목록(T71)으로.
    setPhase('wrot')
    scrollTop()
  }

  // 탭별 콘텐츠(T72 일반정보 / T73 업체정보 / T74 입찰 보증금 / T75 첨부파일).
  // 입력 탭은 defaultValues(확정값) 주입 + onSubmit 에서 저장 후 다음 탭.
  const renderTab = () => {
    switch (tab) {
      case '업체정보':
        return (
          <Stp2
            ref={stp2Ref}
            detail={detail}
            defaultValues={splyValues}
            onSubmit={(v) => {
              setSplyValues(v)
              goNextTab()
            }}
          />
        )
      case '입찰 보증금':
        return (
          <Stp3
            ref={stp3Ref}
            detail={detail}
            defaultValues={grnteValues}
            onSubmit={(v) => {
              setGrnteValues(v)
              goNextTab()
            }}
          />
        )
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
        <StepBar orientation="horizontal" items={steps} className="bg-transparent" expandable={false} />
      </div>

      {phase === 'wrot' ? (
        <>
          {/* 서약서 동의 섹션 */}
          <SectionTitle as="h2" topDivider>
            서약서 동의
          </SectionTitle>

          {/* 서약서 동의 목록 — 청렴 계약 이행 서약서 1건(보기 → P03 바텀시트).
              폼 값(wrotChecked)은 Controller 로 연결, 에러(필수 미동의)는 목록 아래 InputMessage + 앵커 블록으로 포커스. */}
          <div id="field-wrotChecked" className="m-4 flex flex-col gap-krds-3">
            <Controller
              control={wrotForm.control}
              name="wrotChecked"
              render={({ field }) => (
                <AgreementList
                  checkAll={false}
                  items={WROT_ITEMS}
                  checked={field.value}
                  onToggle={(id, on) =>
                    field.onChange(
                      on ? [...new Set([...field.value, id])] : field.value.filter((v) => v !== id),
                    )
                  }
                  onView={openWrot}
                />
              )}
            />
            {wrotError && <InputMessage type="error">{wrotError}</InputMessage>}
          </div>

          {/* 사후심사대상 입찰안내 — 서약서 동의 하단 배치(사용자 지시 2026-08-26, 원 설계서 slide441 은 상단) */}
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
                { label: '다음으로', variant: 'primary', onClick: () => void handleWrotNext() },
              ]}
            />
          </div>
        </>
      ) : (
        <>
          {/* 신청서 하위 탭 — 탭 직접 클릭은 자유 이동(검증은 [다음으로] 때만) */}
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
          저장 후 닫기는 '동의함' 선택 시에만 활성화(설계서 slide443 이벤트). */}
      <BottomSheet
        open={wrotTarget !== null}
        onOpenChange={(open) => {
          if (!open) setWrotTarget(null)
        }}
        title="서약서 상세" // v0.87 검토80 — 팝업 타이틀은 '서약서 상세', 서약서명은 본문 제목으로
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setWrotTarget(null) },
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
          {wrotTargetTitle}
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
