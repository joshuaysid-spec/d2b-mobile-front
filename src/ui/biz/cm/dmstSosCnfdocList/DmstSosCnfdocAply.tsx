// 조달원 확인서 신청(신청사유) 콘텐츠 (MUI-CM-01-P20/P17 신청사유 바텀시트, Figma 10020:82699). 컨테이너(BottomSheet)는 부모(M19 페이지)가 소유.
// Figma 1:1: 상단 info 2행(성명/연락처, 값 우측·muted) + m_text area_box(신청사유, placeholder "신청사유를 입력해주세요") + footer([취소][등록하기]).
//   데이터영역 dm_sosCnfdocAplyInfo(설계서 slide134): 신청인 성명(aplcntNm)·연락처(aplcntTelno) 자동완성 표시 + 신청사유(aplyRsn) 필수.
// 폼은 부모가 useForm 소유 → control 을 받아 Controller 로 신청사유만 연결(react-hook-form + zod).
//   진입 시 신청사유에 포커스(가상 키패드 활성화, 설계서 slide133). 라벨(*)은 Figma 미표기라 aria-label 로만 부여(검증은 유지).
import { Controller, type Control } from 'react-hook-form'

import { InputMessage } from '@/ui/common/base/InputMessage'
import { TextArea } from '@/ui/common/base/TextArea'
import type { DmstSosCnfdocAplyForm } from '@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocAply.schema'

export interface DmstSosCnfdocAplyProps {
  /** 부모(페이지)가 소유한 react-hook-form control — 신청사유(aplyRsn)를 Controller 로 연결. */
  control: Control<DmstSosCnfdocAplyForm>
  /** 신청인 성명(aplcntNm) — 자동완성 표시값. */
  aplcntNm: string
  /** 신청인 연락처(aplcntTelno) — 자동완성 표시값. */
  aplcntTelno: string
}

// 성명/연락처 info 행 — Figma m_card_inforow_atomic: 라벨(좌, muted) + 값(우측 정렬, muted).
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-start gap-krds-5">
      <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted">{label}</span>
      <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-muted">
        {value}
      </span>
    </div>
  )
}

export function DmstSosCnfdocAply({ control, aplcntNm, aplcntTelno }: DmstSosCnfdocAplyProps) {
  return (
    // infolist — 성명/연락처 행 + 신청사유 TextArea (Figma gap-8)
    <div className="flex flex-col gap-krds-5">
      <InfoRow label="성명" value={aplcntNm} />
      <InfoRow label="연락처" value={aplcntTelno} />

      {/* 신청사유 — 필수(Editable). 진입 시 포커스(autoFocus). field-* id 는 제출 실패 시 스크롤 타깃. */}
      <Controller
        control={control}
        name="aplyRsn"
        render={({ field, fieldState }) => (
          <div id="field-aplyRsn" className="flex flex-col gap-krds-5">
            <TextArea
              aria-label="신청사유"
              autoFocus
              maxLength={4000}
              placeholder="신청사유를 입력해주세요"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error}
              aria-invalid={fieldState.error ? true : undefined}
              aria-describedby={fieldState.error ? 'aply-aplyRsn-msg' : undefined}
            />
            {fieldState.error && (
              <InputMessage type="error" id="aply-aplyRsn-msg">
                {fieldState.error.message}
              </InputMessage>
            )}
          </div>
        )}
      />
    </div>
  )
}
DmstSosCnfdocAply.displayName = 'DmstSosCnfdocAply'
