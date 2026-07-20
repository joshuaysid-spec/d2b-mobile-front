// 실적증명서 신청 플로우 컨테이너 — 설계서 00.공통 v0.84 slide286~294.
// 스텝 화면: 계약정보선택(MUI-CM-04-M10 CtrtInfoChc) → 신청정보입력(M12 PrfmncPrdocReg_AplyInpt)
//   → 실적정보 입력(계약구분 분기: 방위사업청 T12 PrfmncPrdocReg_D2b / 부대+시설공사 T13 PrfmncPrdocReg_UnitB).
// 설계서에 플로우 전체 화면 ID 가 없어(스텝 화면만 정의) 폴더명(prfmncPrdocReg) 기반 컨테이너(도메인 조립물).
// 부대+비시설공사 분기는 미구현(요청 범위: unitB 까지) — 안내 스텁.
// 팝업/토스트(slide286·289): 취소/계약변경 확인 AlertModal · 저장/신청 Toast(신청 후 목록 복귀).
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ROUTES } from '@/constants/routes'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Toast } from '@/ui/common/composites/Toast'
import { CtrtInfoChc } from '@/ui/biz/cm/prfmncPrdocReg/CtrtInfoChc'
import { PrfmncPrdocReg_AplyInpt } from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocReg_AplyInpt'
import { PrfmncPrdocReg_D2b } from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocReg_D2b'
import { PrfmncPrdocReg_UnitB } from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocReg_UnitB'
import {
  aplyInptSchema,
  APLY_INPT_DEFAULTS,
  type AplyInptForm,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocReg_AplyInpt.schema'
import type { PrfmncPrdocCtrtInfo } from '@/types/cm'

const STEP_LABELS = ['계약 정보 선택', '신청정보 입력', '실적정보 입력'] as const

export function PrfmncPrdocRegPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCtrt, setSelectedCtrt] = useState<PrfmncPrdocCtrtInfo | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false) // 취소 확인(작성 내용 有)
  const [changeOpen, setChangeOpen] = useState(false) // 계약 변경/해제 확인(작성 내용 有)
  const pendingCtrtRef = useRef<PrfmncPrdocCtrtInfo | null>(null)
  const [toast, setToast] = useState<{ msg: string; then?: () => void } | null>(null)

  // 신청정보(M12) 폼 — 페이지가 useForm 소유(폼 표준), 콘텐츠는 control 로 연결.
  const form = useForm<AplyInptForm>({
    resolver: zodResolver(aplyInptSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: APLY_INPT_DEFAULTS,
  })
  const usePrpsCd = form.watch('usePrpsCd')

  // 계약구분 분기(slide286): 방위사업청 → 사용목적+T12 · 부대+시설공사 → 제출유형+T13(unitB) ·
  // 부대+비시설공사 → 미구현(unitC~ — 추후).
  const branch: 'd2b' | 'unitB' | 'other' =
    !selectedCtrt || selectedCtrt.orderInstNm === '방위사업청'
      ? 'd2b'
      : selectedCtrt.ctrtCnNm === '시설공사'
        ? 'unitB'
        : 'other'

  const scrollTop = () =>
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })

  const goStep = (next: 1 | 2 | 3) => {
    setStep(next)
    scrollTop()
  }

  // 카드 선택/해제 — 신청정보가 입력된 상태(isDirty)면 확인 팝업(slide286) 후 폼 리셋.
  const handleSelect = (ctrt: PrfmncPrdocCtrtInfo | null) => {
    if (form.formState.isDirty) {
      pendingCtrtRef.current = ctrt
      setChangeOpen(true)
      return
    }
    setSelectedCtrt(ctrt)
  }
  const confirmChange = () => {
    setSelectedCtrt(pendingCtrtRef.current)
    form.reset(APLY_INPT_DEFAULTS) // 작성 내용 폐기(실적정보 입력은 스텝 unmount 로 초기화)
  }

  // 취소(step1) — 작성 내용 있으면 확인 팝업, 없으면 목록 복귀.
  const handleCancel = () => {
    if (form.formState.isDirty) {
      setCancelOpen(true)
      return
    }
    navigate(-1)
  }

  // step2 다음으로 — 검증 통과 시 실적정보로. 실패 시 첫 에러 필드로 스크롤(Radix 그룹 수동).
  const handleAplyNext = form.handleSubmit(
    (data) => {
      console.log('[PrfmncPrdocReg] 신청정보 입력 완료', data) // 추후 API 경계
      goStep(3)
    },
    (errors) => {
      const first = Object.keys(errors)[0]
      requestAnimationFrame(() =>
        document
          .getElementById(`field-${first}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    },
  )

  // step3 저장/신청 — API 미연동 스텁 + 토스트(slide289). 신청 완료 시 목록 복귀.
  const handleSave = () => {
    console.log('[PrfmncPrdocReg] 저장(API 미연동)', { ctrt: selectedCtrt, aply: form.getValues() })
    setToast({ msg: '저장 되었습니다.' })
  }
  const handleApply = () => {
    console.log('[PrfmncPrdocReg] 신청(API 미연동)', { ctrt: selectedCtrt, aply: form.getValues() })
    setToast({ msg: '신청이 완료되었습니다.', then: () => navigate(ROUTES.SUPPORT_PRFMNC_PRDOC) })
  }

  const steps: StepItem[] = STEP_LABELS.map((label, i) => ({
    label,
    state: i + 1 < step ? 'done' : i + 1 === step ? 'doing' : 'todo',
  }))

  return (
    // min-h-full — 콘텐츠가 짧아도 페이지 컬럼이 스크롤 셸(main#app-scroll) 높이를 채워
    // flex-1 스페이서 + sticky footer 가 화면 하단에 붙는다.
    <div className="flex min-h-full w-full flex-col">
      {/* 진행 스텝 — 계약 정보 선택 → 신청정보 입력 → 실적정보 입력 */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={steps} className="bg-transparent" />
      </div>

      {/* 스텝 콘텐츠 */}
      {step === 1 && <CtrtInfoChc selected={selectedCtrt} onSelect={handleSelect} />}
      {step === 2 && (
        <PrfmncPrdocReg_AplyInpt control={form.control} branch={branch} usePrpsCd={usePrpsCd} />
      )}
      {step === 3 &&
        (branch === 'unitB' ? (
          <PrfmncPrdocReg_UnitB />
        ) : branch === 'd2b' ? (
          <PrfmncPrdocReg_D2b />
        ) : (
          // 부대+비시설공사(unitC~) — 미구현(요청 범위: unitB 까지)
          <p className="p-4 text-[17px] leading-normal text-krds-text-subtle">
            해당 계약 구분의 실적정보 입력 화면은 준비 중입니다.
          </p>
        ))}

      {/* 스텝 콘텐츠가 짧아도 footer 가 뜨지 않게 나머지 공간 채움 */}
      <div className="flex-1" />

      {/* 스텝별 footer 버튼(slide286·288·289) — sticky 하단 고정(확립 패턴).
          safe-area: pb 는 max(12px, env(safe-area-inset-bottom)) — Tailwind 가 env() 콤마를 못 다뤄 inline style. */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {step === 1 && (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: handleCancel },
              {
                label: '다음으로',
                variant: 'primary',
                disabled: !selectedCtrt, // 미선택 시 비활성(slide286)
                onClick: () => goStep(2),
              },
            ]}
          />
        )}
        {step === 2 && (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '이전', variant: 'secondary', onClick: () => goStep(1) },
              { label: '다음으로', variant: 'primary', onClick: handleAplyNext },
            ]}
          />
        )}
        {step === 3 && (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '저장', variant: 'secondary', onClick: handleSave },
              { label: '신청', variant: 'primary', onClick: handleApply },
            ]}
          />
        )}
      </div>

      {/* 계약 변경/해제 확인(slide286) */}
      <AlertModal
        open={changeOpen}
        onOpenChange={setChangeOpen}
        variant="info"
        title="계약 변경"
        description="작성하신 내용이 사라집니다. 정말 계약을 변경하시겠습니까?"
        secondaryAction={{ label: '아니오' }}
        primaryAction={{ label: '예', onClick: confirmChange }}
      />

      {/* 작성 취소 확인(slide286) */}
      <AlertModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        variant="info"
        title="작성 취소"
        description="작성하신 내용이 사라집니다. 정말 작성을 취소하시겠습니까?"
        secondaryAction={{ label: '아니오' }}
        primaryAction={{ label: '예', onClick: () => navigate(-1) }}
      />

      {/* 저장/신청 토스트 — 닫힌 뒤 후속 동작(신청=목록 복귀) */}
      <Toast
        open={toast !== null}
        onClose={() => {
          const t = toast
          setToast(null)
          t?.then?.()
        }}
      >
        {toast?.msg}
      </Toast>
    </div>
  )
}
PrfmncPrdocRegPage.displayName = 'PrfmncPrdocRegPage'
