// 입찰참가신청서작성 - 서약서동의(MUI-BD-04-M01, 설계서 slide91). 입찰참가신청서 작성 마법사의 첫 스텝(서약서).
// 진입: 홈 > 입찰진행 > 상세 > 입찰참가신청서 작성 → 이 화면(서약서 동의) → '다음으로' → 신청서 작성(M05).
// 레이아웃: 요약 → 진행단계(StepBar) → 입찰안내(Infobox) → 페이지타이틀 → 서약서 동의 체크리스트(3행, '보기' → 서약서 바텀시트)
//   → 하단 액션바(취소/다음으로) + 맨위로 FAB.
// 항목명/형식은 BidPrtcpAperWrtPage 와 동일(공고 식별값은 상세 항목). 서약서 본문은 WrotAgreForm 의 WROTS(설계서 원문).
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useSaveWrot } from '@/queries/bd'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import {
  getWrotDefaultChoice,
  WROT_AGREE_VALUE,
  WrotAgreForm,
  WROTS,
  type WrotData,
} from '@/ui/biz/bd/wrotAgrePage/WrotAgreForm'
import type { ApiError } from '@/types/api'
import type { BidPrgrsItem } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 항목명/형식 그대로(BidPrtcpAperWrtPage 와 동일 형태).
const MOCK_DETAIL: BidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '긴급공고 LDG0097-1',
  prcmNo: '56349',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '031-940-0000',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '총액제',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: false,
  techEvl: false,
  prdcpDcmntSbms: false,
  apfrStatNm: '신청',
  regRjctYn: false,
}

// 진행단계(설계서 slide92): 서약서 → 신청서 → 서명 → 제출. 진입은 서약서 단계.
const STEPS: StepItem[] = [
  { label: '서약서', state: 'doing' },
  { label: '신청서', state: 'todo' },
  { label: '서명', state: 'todo' },
  { label: '제출', state: 'todo' },
]

// 입찰안내(사후심사대상) — 설계서 안내사항 원문.
const NOTICE_ITEMS = [
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

// 서약서 동의 항목(설계서 slide91) — 필수/선택 + 본문은 WROTS(WrotAgreForm)와 id 로 연결.
const WROT_ITEMS: Array<{ id: string; required: boolean }> = [
  { id: 'w_p02', required: true }, // '조세포탈' 사실이 없음을 확약하는 서약서
  { id: 'w_p03', required: true }, // 청렴 계약 이행 서약서
  { id: 'w_p04', required: false }, // 하도급대금의 지급관련 확인 및 확약서
]
const ALL_IDS = WROT_ITEMS.map((i) => i.id) // 전체 동의 토글용 — 모듈 상수(매 렌더 재계산 방지)

export function WrotAgrePage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as BidPrgrsItem | null) ?? MOCK_DETAIL
  const [checked, setChecked] = useState<string[]>([]) // 동의 완료된 서약서 id
  const [selected, setSelected] = useState<WrotData | null>(null) // 현재 열람 중인 서약서
  const [sheetOpen, setSheetOpen] = useState(false) // 서약서 바텀시트
  const [choice, setChoice] = useState('') // 바텀시트 '동의 선택' 라디오 값(열람 시작 시 기본값 리셋)
  const [agreeWarnOpen, setAgreeWarnOpen] = useState(false) // 필수 서약서 '동의함' 미체크 경고
  const [saveError, setSaveError] = useState<string | null>(null) // 서약서 저장 실패 안내(null=닫힘)
  const saveWrot = useSaveWrot()

  const toggle = (id: string, on: boolean) =>
    setChecked((prev) => (on ? [...new Set([...prev, id])] : prev.filter((v) => v !== id)))

  // 전체 동의 토글 — 전체 on·off(전체/부분 상태 계산은 AgreementList 내부에서 처리).
  const toggleAll = (on: boolean) => setChecked(on ? [...ALL_IDS] : [])

  // 서약서 열람 — 본문은 설계서 원문(WROTS 로컬 상수)으로 렌더(getWrot 목업은 단건 제네릭이라 다건 콘텐츠 미대체).
  const openWrot = (w: WrotData) => {
    setSelected(w)
    setChoice(getWrotDefaultChoice(w)) // 열람마다 기본값(동의안함/선택1)으로 리셋
    setSheetOpen(true)
  }

  // 저장 후 닫기 → 필수 서약서는 '동의함' 체크 검증 후 mutation 훅 await,
  // 성공 시 해당 서약서를 동의 완료 처리. 실패 시 AlertModal 안내.
  const handleSaveWrot = async () => {
    if (!selected) {
      setSheetOpen(false)
      return
    }
    // 필수 서약서(agree 변형)를 '동의안함' 상태로 저장 시도 → 경고 후 차단(시트 유지)
    const required = WROT_ITEMS.find((i) => i.id === selected.id)?.required
    if (required && selected.variant === 'agree' && choice !== WROT_AGREE_VALUE) {
      setAgreeWarnOpen(true)
      return
    }
    try {
      await saveWrot.mutateAsync(selected.id)
      setChecked((prev) => [...new Set([...prev, selected.id])])
      setSheetOpen(false)
    } catch (err) {
      setSaveError(
        (err as ApiError | null)?.message ?? '서약서 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  }

  const handleNext = () => {
    console.log('[M01] 다음으로(신청서 작성)', { pbancNo: detail.pbancNo, agreed: checked })
    // 추후: 필수 서약서 동의 검증 후 이동
    navigate(`/bd/prgrs/${detail.rNum}/apfr/form`, { state: detail })
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/계약방법 + 공고번호 + 입찰건명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />

      {/* 진행단계 표시기 — Figma: 배경 #ECF1FA(krds-bg-primary-faint) + px16/py16 */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
      </div>

      {/* 서약서 동의 섹션 헤더 — Figma m_section title(9300-40694, borderTop, 19px Bold, 카운트 없음) */}
      <SectionTitle as="h2" topDivider>
        서약서 동의
      </SectionTitle>

      {/* 서약서 동의 카드 — 공통 AgreementList(Figma m_agreemen). 내용은 설계서(slide92) 3건 유지.
          항목 행 클릭 → 서약서 바텀시트(WrotAgreForm) 는 이 페이지가 소유. */}
      <AgreementList
        className="m-4"
        items={WROT_ITEMS.map((item) => ({
          id: item.id,
          title: WROTS.find((w) => w.id === item.id)?.title ?? '',
          requirement: item.required ? 'required' : 'optional',
        }))}
        checked={checked}
        onToggle={toggle}
        onCheckAll={toggleAll}
        onView={(id) => {
          const wrot = WROTS.find((w) => w.id === id)
          if (wrot) openWrot(wrot)
        }}
      />

      {/* 사후심사대상 입찰안내 — 설계서 안내사항 원문 */}
      <Infobox title="사후심사대상 입찰안내" items={NOTICE_ITEMS} />

      {/* 하단 액션바 — 취소/다음으로 */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '다음으로', variant: 'primary', onClick: handleNext },
          ]}
        />
      </div>

      {/* 맨위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 서약서 바텀시트 — 컨테이너/footer 는 페이지가 소유, 콘텐츠만 WrotAgreForm */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={selected?.title ?? '서약서'}
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setSheetOpen(false) },
              { label: '저장 후 닫기', variant: 'primary', onClick: handleSaveWrot },
            ]}
          />
        }
      >
        {selected && (
          <WrotAgreForm
            key={selected.id}
            wrot={selected}
            choice={choice}
            onChoiceChange={setChoice}
          />
        )}
      </BottomSheet>

      {/* 필수 서약서 '동의함' 미체크 경고 — 저장 차단, 확인 시 시트로 복귀 */}
      <AlertModal
        open={agreeWarnOpen}
        onOpenChange={setAgreeWarnOpen}
        variant="info"
        title="서약서 동의 안내"
        description="필수 서약서입니다. '동의함'에 체크해야 저장할 수 있습니다."
        primaryAction={{ label: '확인', onClick: () => setAgreeWarnOpen(false) }}
      />

      {/* 서약서 저장 실패 안내 */}
      <AlertModal
        open={saveError !== null}
        onOpenChange={(open) => {
          if (!open) setSaveError(null)
        }}
        variant="error"
        title="서약서 저장 실패"
        description={saveError}
        primaryAction={{ label: '확인', onClick: () => setSaveError(null) }}
      />
    </div>
  )
}
WrotAgrePage.displayName = 'WrotAgrePage'
