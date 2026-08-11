// 입찰공고 알림신청 콘텐츠 (MUI-OP-01-P10, Figma 9300-37419). 컨테이너(BottomSheet)는 부모가 소유.
// 서비스 안내 + 수신자 휴대번호 + 수신동의 라디오.
// 폼은 부모(페이지)가 useForm 소유 → control 을 받아 Controller 로 필드 연결(react-hook-form + zod).
// 기존 컴포넌트 활용: InputBox · InputLabel · InputMessage · RadioButtonGroup.
import { Controller, type Control } from 'react-hook-form'

import { formatPhoneInput } from '@/utils/format'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import type { NotiAplyForm } from '@/ui/biz/op/prcmPlanDtl/PrcmPlan_NotiAply.schema'

// 안내문 (Figma intro section)
const GUIDE = [
  {
    title: '서비스 개요',
    body: '연초에 공개되는 조달계획에서 알림 신청한 품목에 대한 입찰공고가 시스템에 게시되면 알려드리는 서비스입니다.',
  },
  {
    title: '신청방법',
    body: "조달계획 상세화면에서 '공고게시알림신청' 버튼이 보이는 경우, 버튼을 눌러 신청하시면 됩니다.",
  },
  {
    title: '유의사항',
    body: '입찰공고는 국계법에 따라 조달업체가 직접 전자조달시스템에서 확인, 미전송, 스팸처리 등으로 사용자가 제대로 인지하지 못하였을 경우에 발생하는 문제에 대해 본 시스템은 책임지지 않습니다.',
  },
]

export interface PrcmPlan_NotiAplyProps {
  /** 부모(페이지)가 소유한 react-hook-form control. 필드는 Controller 로 연결. */
  control: Control<NotiAplyForm>
}

export function PrcmPlan_NotiAply({ control }: PrcmPlan_NotiAplyProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 서비스 안내 */}
      <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">
        입찰공고 알림신청 서비스 안내
      </h3>
      <p className="flex gap-1 text-[15px] font-medium leading-normal text-krds-action-danger">
        <span aria-hidden>※</span>
        <span className="min-w-px flex-1">본 조달계획은 조달판단 과정에서 변동될 수 있습니다.</span>
      </p>
      {GUIDE.map((g) => (
        <section key={g.title} className="flex flex-col gap-1">
          <p className="text-[17px] font-bold leading-normal text-krds-text-ink">{g.title}</p>
          <p className="text-[17px] leading-relaxed text-krds-text-ink">{g.body}</p>
        </section>
      ))}

      {/* 입력 폼 (Figma form section 9419-29933 — primary-faint 배경).
          배경 블록이 시트 가장자리·footer 에 붙어 보여 여백 + radius 4px 를 준다(2026-08-11 요청).
          ⚠️ 좌우는 음수 마진(-mx-*)으로 넓히지 않는다 — 시트 Body(overflow-y-auto)의 폭을 넘겨
             가로 스크롤이 생긴다. 좌우 여백은 시트 공통 거터(16px)를 그대로 쓰고(다른 시트의 flushX 관례와 동일),
             하단만 mb-krds-6(10px)으로 footer(신청하기)와 띄운다. p-4 는 배경 안쪽 콘텐츠 패딩. */}
      <div className="mb-krds-6 flex flex-col gap-4 rounded-krds-sm bg-krds-bg-primary-faint p-4">
        {/* 휴대번호 — inputType='tel' 로 숫자만+키패드+IME 가드는 InputBox 가 처리, 하이픈은 format. field-* id 는 제출 실패 시 스크롤 타깃. */}
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <div id="field-phone" className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="noti-phone" required>
                수신자 휴대번호
              </InputLabel>
              <InputBox
                id="noti-phone"
                inputType="tel"
                format={formatPhoneInput}
                value={field.value}
                maxLength={13}
                placeholder="번호를 입력하세요."
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
                error={!!fieldState.error}
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby="noti-phone-msg"
              />
              {fieldState.error ? (
                <InputMessage type="error" id="noti-phone-msg">
                  {fieldState.error.message}
                </InputMessage>
              ) : (
                <InputMessage id="noti-phone-msg">
                  휴대폰 변경은 마이페이지(조달업체) &gt; 알림서비스신청 에서 변경이 가능합니다.
                </InputMessage>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="agree"
          render={({ field, fieldState }) => (
            <div id="field-agree" className="flex flex-col gap-krds-5">
              <InputLabel>입찰 단계별 안내 수신동의</InputLabel>
              <RadioButtonGroup
                showIndicator
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                items={[
                  { value: 'no', label: '동의 안함' },
                  { value: 'yes', label: '동의함' },
                ]}
              />
              {fieldState.error && (
                <InputMessage type="error">{fieldState.error.message}</InputMessage>
              )}
            </div>
          )}
        />
      </div>
    </div>
  )
}
PrcmPlan_NotiAply.displayName = 'PrcmPlan_NotiAply'
