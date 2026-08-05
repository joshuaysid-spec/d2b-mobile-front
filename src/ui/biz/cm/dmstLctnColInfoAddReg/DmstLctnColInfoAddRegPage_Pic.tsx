// 담당자 정보 추가등록 (MUI-CM-01-M22, dmstLctnColInfoAddReg_Pic). 설계서 slide149(문서 P148).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 업체정보 추가 등록(담당자 정보).
//   담당자명*·전화번호*·팩스번호·이메일주소* 입력 → [저장] 시 승인 없이 즉시 변경(완료) → 목록 이동 + '저장되었습니다' 토스트.
//   폼 검증: react-hook-form + zod(DmstLctnColInfoAddRegPage_Pic.schema). 헤더(뒤로/타이틀)는 전역 Header(AppLayout).
//   ⚠️ 디자인(Figma) 없음 → 설계서(pptx)로 작업. 데이터/저장은 목업 + API 경계 스텁(console.log).
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Toast } from '@/ui/common/composites/Toast'
import {
  dmstLctnColInfoAddRegPicSchema,
  type DmstLctnColInfoAddRegPicForm,
} from '@/ui/biz/cm/dmstLctnColInfoAddReg/DmstLctnColInfoAddRegPage_Pic.schema'

// 로그인 업체 담당자 자동완성(수정 진입 시) — 추후 authStore/업체정보 조회로 주입. 현재 빈 값 목업(신규 입력).
const DEFAULT_VALUES: DmstLctnColInfoAddRegPicForm = {
  picNm: '',
  picEntlno: '',
  picFxno: '',
  picEmlAddr: '',
}

export function DmstLctnColInfoAddRegPage_Pic() {
  const navigate = useNavigate()
  const [toastOpen, setToastOpen] = useState(false)
  const {
    control,
    handleSubmit,
  } = useForm<DmstLctnColInfoAddRegPicForm>({
    resolver: zodResolver(dmstLctnColInfoAddRegPicSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: DEFAULT_VALUES,
  })

  // [저장] — 승인 없이 즉시 완료(slide149). 성공 → 토스트 후 목록(이전 화면)으로.
  const onSubmit = (values: DmstLctnColInfoAddRegPicForm) => {
    console.log('[M22] 담당자 정보 저장', values) // 추후 API: cmService.savePicInfo(values)
    setToastOpen(true)
    window.setTimeout(() => navigate(-1), 1200)
  }
  // 제출 실패 — 첫 에러 필드로 스크롤(입력류는 RHF shouldFocusError 자동, 컨테이너 정렬만 보조).
  const onInvalid = (errors: Record<string, unknown>) => {
    const first = Object.keys(errors)[0]
    if (first) document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-4 px-4 py-4">
        {/* 담당자명* */}
        <Controller
          control={control}
          name="picNm"
          render={({ field, fieldState }) => (
            <div id="field-picNm" className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="pic-picNm" required>
                담당자명
              </InputLabel>
              <InputBox
                id="pic-picNm"
                value={field.value}
                maxLength={100}
                placeholder="입력해주세요"
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
                error={!!fieldState.error}
                aria-invalid={fieldState.error ? true : undefined}
              />
              {fieldState.error && <InputMessage type="error">{fieldState.error.message}</InputMessage>}
            </div>
          )}
        />

        {/* 전화번호* */}
        <Controller
          control={control}
          name="picEntlno"
          render={({ field, fieldState }) => (
            <div id="field-picEntlno" className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="pic-picEntlno" required>
                전화번호
              </InputLabel>
              <InputBox
                id="pic-picEntlno"
                inputMode="tel"
                value={field.value}
                maxLength={14}
                placeholder="입력해주세요"
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
                error={!!fieldState.error}
                aria-invalid={fieldState.error ? true : undefined}
              />
              {fieldState.error && <InputMessage type="error">{fieldState.error.message}</InputMessage>}
            </div>
          )}
        />

        {/* 팩스번호 */}
        <Controller
          control={control}
          name="picFxno"
          render={({ field, fieldState }) => (
            <div id="field-picFxno" className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="pic-picFxno">팩스번호</InputLabel>
              <InputBox
                id="pic-picFxno"
                inputMode="tel"
                value={field.value}
                maxLength={14}
                placeholder="입력해주세요"
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
                error={!!fieldState.error}
                aria-invalid={fieldState.error ? true : undefined}
              />
              {fieldState.error && <InputMessage type="error">{fieldState.error.message}</InputMessage>}
            </div>
          )}
        />

        {/* 이메일주소* */}
        <Controller
          control={control}
          name="picEmlAddr"
          render={({ field, fieldState }) => (
            <div id="field-picEmlAddr" className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="pic-picEmlAddr" required>
                이메일주소
              </InputLabel>
              <InputBox
                id="pic-picEmlAddr"
                inputMode="email"
                value={field.value}
                maxLength={50}
                placeholder="입력해주세요"
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
                error={!!fieldState.error}
                aria-invalid={fieldState.error ? true : undefined}
              />
              {fieldState.error && <InputMessage type="error">{fieldState.error.message}</InputMessage>}
            </div>
          )}
        />
      </div>

      {/* 하단 액션 바 — [취소][추가등록]. sticky 하단 고정. (버튼명 저장→추가등록, 2026-08-05 요청) */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '추가등록', variant: 'primary', onClick: handleSubmit(onSubmit, onInvalid) },
          ]}
        />
      </div>

      {/* 저장 완료 토스트(slide149 '저장되었습니다.') */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        저장되었습니다.
      </Toast>
    </div>
  )
}
DmstLctnColInfoAddRegPage_Pic.displayName = 'DmstLctnColInfoAddRegPage_Pic'
