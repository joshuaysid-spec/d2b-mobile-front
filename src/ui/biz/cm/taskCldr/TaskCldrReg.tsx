// MUI-CM-06-M08 업무캘린더 등록/수정 — 바텀시트 콘텐츠(컨테이너 BottomSheet·footer 는 부모 TaskCldrPage 소유). (구 P08 — v0.84 에서 M08 로 재편)
// 설계서 00.공통 v0.84 slide87 / Figma 10020:87484(등록)·10020:87490(수정). 등록/수정 동일 폼.
//
// Figma 실측(px, 1:1):
//   필드 컨테이너 gap 16(krds-8) · 각 필드 label→control gap 8(krds-5).
//   label = m_input_label(17 Bold, 필수는 좌측 빨강 * ) — 선택 날짜*·제목* 필수, 내용 선택.
//   선택 날짜 = m_date_input(DateInputBox 트리거, 가운데정렬 placeholder '일자를 선택해주세요.').
//   제목 = m_text input(InputBox, 좌측정렬 '제목을 입력해주세요.').
//   내용 = m_text area(TextArea, h-200 '내용을 입력해주세요.').
//
// 폼: react-hook-form + zod(CLAUDE.md 규칙). 제출은 부모 footer 버튼이 ref.submit() 으로 트리거.
// 컨테이너/footer/open 은 두지 않는다(부모 소유) — 콘텐츠는 필드 폼만.
import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { DateInput } from '@/ui/common/composites/DateInput'
import { InputBox } from '@/ui/common/base/InputBox'
import { TextArea } from '@/ui/common/base/TextArea'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { taskCldrRegSchema, type TaskCldrRegSchemaValues } from '@/ui/biz/cm/taskCldr/TaskCldrReg.schema'

export interface TaskCldrRegHandle {
  /** 부모 footer 등록/수정 버튼이 호출 — 검증 통과 시 onSubmit 실행. */
  submit: () => void
}

export interface TaskCldrRegProps {
  /** 초기값(수정 시 기존 일정, 등록 시 선택 날짜만 채운 값). */
  defaultValues: TaskCldrRegSchemaValues
  /** 검증 통과 시 확정 값 전달 — 부모가 목업 반영 + 시트 닫기. */
  onSubmit: (values: TaskCldrRegSchemaValues) => void
}

const TaskCldrReg = React.forwardRef<TaskCldrRegHandle, TaskCldrRegProps>(
  ({ defaultValues, onSubmit }, ref) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<TaskCldrRegSchemaValues>({
      resolver: zodResolver(taskCldrRegSchema),
      mode: 'onSubmit',
      reValidateMode: 'onBlur',
      defaultValues,
    })

    // 첫 에러 필드로 스크롤(입력류는 RHF shouldFocusError 자동, DateInput 은 ref 없어 수동 보정).
    const handleInvalid = React.useCallback(() => {
      const firstKey = ['schdlDt', 'schdlTtl', 'schdlCn'].find(
        (k) => (errors as Record<string, unknown>)[k],
      )
      if (firstKey) {
        document
          .getElementById(`field-${firstKey}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, [errors])

    React.useImperativeHandle(ref, () => ({
      submit: () => void handleSubmit(onSubmit, handleInvalid)(),
    }))

    return (
      <form
        onSubmit={handleSubmit(onSubmit, handleInvalid)}
        className="flex w-full flex-col gap-krds-8"
      >
        {/* 선택 날짜* — DateInput(라벨은 InputLabel 로 통일해 17 Bold 유지). */}
        <div id="field-schdlDt" className="flex w-full flex-col gap-krds-5">
          <InputLabel required>선택 날짜</InputLabel>
          <Controller
            control={control}
            name="schdlDt"
            render={({ field }) => (
              <DateInput
                value={field.value}
                onChange={field.onChange}
                placeholder="일자를 선택해주세요."
                sheetTitle="일자 선택"
                error={!!errors.schdlDt}
              />
            )}
          />
          {errors.schdlDt && (
            <InputMessage type="error">{errors.schdlDt.message}</InputMessage>
          )}
        </div>

        {/* 제목* — InputBox(좌측정렬). */}
        <div id="field-schdlTtl" className="flex w-full flex-col gap-krds-5">
          <InputLabel htmlFor="taskCldr-schdlTtl" required>
            제목
          </InputLabel>
          <InputBox
            id="taskCldr-schdlTtl"
            placeholder="제목을 입력해주세요."
            maxLength={100}
            error={!!errors.schdlTtl}
            aria-invalid={!!errors.schdlTtl}
            aria-describedby={errors.schdlTtl ? 'taskCldr-schdlTtl-error' : undefined}
            {...register('schdlTtl')}
          />
          {errors.schdlTtl && (
            <InputMessage type="error" id="taskCldr-schdlTtl-error">
              {errors.schdlTtl.message}
            </InputMessage>
          )}
        </div>

        {/* 내용 — TextArea(선택, h-200). 여러 줄 입력. */}
        <div id="field-schdlCn" className="flex w-full flex-col gap-krds-5">
          <InputLabel htmlFor="taskCldr-schdlCn">내용</InputLabel>
          <TextArea
            id="taskCldr-schdlCn"
            placeholder="내용을 입력해주세요."
            {...register('schdlCn')}
          />
        </div>

        {/* 부모 footer 버튼(등록/수정)이 ref.submit() 으로 제출 — 폼 내 제출 버튼은 두지 않는다. */}
      </form>
    )
  },
)
TaskCldrReg.displayName = 'TaskCldrReg'

export { TaskCldrReg }
