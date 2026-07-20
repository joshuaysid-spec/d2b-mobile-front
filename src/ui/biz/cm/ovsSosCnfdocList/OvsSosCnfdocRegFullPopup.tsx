// 국외조달원등록증신청 — MUI-CM-04-P22 (OvsSosCnfdocReg). 설계서 00.공통 v0.84 slide334~335.
// 국외 조달원 등록증 신청 목록(M21) 하단 [신청] 버튼에서 여는 풀팝업(FullPopup 래퍼 컨벤션 — ID+FullPopup).
// 신청인(회사명/성명 readonly 자동완성 + 직위*/연락처*) + 조달원 등록증(업체명* 선택 + 발급신청사유*).
// Figma 전용 프레임 없음 → 내부 폼 컨벤션(RHF+zod + InputLabel/InputBox/TextArea/InputMessage).
// 신청하기 → 검증 통과 시 팝업 닫기 + 부모 onSubmitted(완료 토스트 + 목록 리프래시). 취소 → 닫기.
// 업체 선택 → 조달업체선택(MUI-CM-04-P23 OvsSosCnfdocChc) 미구현 스텁.
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SelectBox, type SelectBoxItem } from '@/ui/common/base/SelectBox'
import { TextArea } from '@/ui/common/base/TextArea'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import {
  ovsSosRegSchema,
  OVS_SOS_REG_DEFAULTS,
  type OvsSosRegForm,
} from '@/ui/biz/cm/ovsSosCnfdocList/OvsSosCnfdocRegFullPopup.schema'

// 신청인 자동완성 — 로그인 사용자/업체 정보(readonly). 추후 API 로 교체(dm_ovsSosAplyInfo empNm/bzentyNm).
const MOCK_APLCNT = { empNm: '홍길동', bzentyNm: '조달테스트 업체' }

// 연락처 앞자리 선택(010/02) — 이후 자릿수 추가되면 여기 확장.
const TEL_PREFIX_ITEMS: SelectBoxItem[] = [
  { value: '010', label: '010' },
  { value: '02', label: '02' },
]

// 섹션 제목(한글 + 영문 병기, slide334)
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">{children}</h3>
}

// readonly 자동완성 필드 — disabled InputBox(수정 불가 Dim).
function ReadonlyField({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel>{label}</InputLabel>
      <InputBox value={value} disabled readOnly />
    </div>
  )
}

export interface OvsSosCnfdocRegFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 신청 완료 콜백 — 부모가 완료 토스트 + 목록 리프래시. */
  onSubmitted?: () => void
}

export function OvsSosCnfdocRegFullPopup({
  open,
  onOpenChange,
  onSubmitted,
}: OvsSosCnfdocRegFullPopupProps) {
  const form = useForm<OvsSosRegForm>({
    resolver: zodResolver(ovsSosRegSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: OVS_SOS_REG_DEFAULTS,
  })

  // 연락처 3분할 입력(앞자리 select + 중간/끝 숫자). 폼 값 aplcntEntlno 는 하이픈 결합 문자열로 동기화
  //   — 중간·끝이 모두 있어야 유효(빈 값이면 '' → 필수 검증 실패).
  const [telPrefix, setTelPrefix] = useState('010')
  const [telMid, setTelMid] = useState('')
  const [telLast, setTelLast] = useState('')
  const resetTel = () => {
    setTelPrefix('010')
    setTelMid('')
    setTelLast('')
  }

  const handleApply = form.handleSubmit(
    (data) => {
      console.log('[OvsSosCnfdocReg] 국외조달원 등록증 신청(API 미연동)', data)
      form.reset(OVS_SOS_REG_DEFAULTS)
      resetTel()
      onOpenChange(false)
      onSubmitted?.() // 부모: 완료 토스트("신청 되었습니다.") + 목록 리프래시
    },
    (errors) => {
      // 첫 에러 필드로 스크롤(Radix/버튼형 필드 수동). 팝업 내부 스크롤 컨테이너 기준.
      const first = Object.keys(errors)[0]
      requestAnimationFrame(() =>
        document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    },
  )

  const handleCancel = () => {
    form.reset(OVS_SOS_REG_DEFAULTS)
    resetTel()
    onOpenChange(false)
  }

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="조달원 등록증 신청서"
      footer={
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '취소', variant: 'secondary', onClick: handleCancel },
            { label: '신청하기', variant: 'primary', onClick: handleApply },
          ]}
        />
      }
    >
      {/* FullPopup body 는 무패딩 — 컨벤션대로 px-4 py-4(16px) 여백을 콘텐츠에서 부여 */}
      <div className="flex flex-col gap-6 p-4">
        {/* 신청인 (Applicant) */}
        <section className="flex flex-col gap-4">
          <SectionTitle>신청인 (Applicant)</SectionTitle>
          <ReadonlyField label="성명 (Name)" value={MOCK_APLCNT.empNm} />
          <ReadonlyField label="회사명 (Company Name)" value={MOCK_APLCNT.bzentyNm} />

          {/* 직위(급) (Position) * */}
          <Controller
            control={form.control}
            name="aplcntJbgdNm"
            render={({ field, fieldState }) => (
              <div id="field-aplcntJbgdNm" className="flex flex-col gap-krds-5">
                <InputLabel htmlFor="ovs-jbgd" required>
                  직위(급) (Position)
                </InputLabel>
                <InputBox
                  id="ovs-jbgd"
                  placeholder="직위를 입력해주세요."
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onClear={() => field.onChange('')}
                  error={!!fieldState.error}
                  aria-invalid={fieldState.error ? true : undefined}
                />
                {fieldState.error && (
                  <InputMessage type="error">{fieldState.error.message}</InputMessage>
                )}
              </div>
            )}
          />

          {/* 연락처 (PhoneNumber) * — 앞자리 select(010/02) + 중간/끝 숫자 3분할, 하이픈 구분.
              폼 값 aplcntEntlno = "010-1234-5678"(중간·끝 모두 있을 때만, 아니면 '' → 필수 검증). */}
          <Controller
            control={form.control}
            name="aplcntEntlno"
            render={({ field, fieldState }) => {
              const sync = (prefix: string, mid: string, last: string) =>
                field.onChange(mid && last ? `${prefix}-${mid}-${last}` : '')
              return (
                <div id="field-aplcntEntlno" className="flex flex-col gap-krds-5">
                  <InputLabel required>연락처 (PhoneNumber)</InputLabel>
                  <div className="flex items-center gap-krds-3">
                    <div className="w-[92px] shrink-0">
                      <SelectBox
                        items={TEL_PREFIX_ITEMS}
                        value={telPrefix}
                        onValueChange={(v) => {
                          setTelPrefix(v)
                          sync(v, telMid, telLast)
                        }}
                        error={!!fieldState.error}
                      />
                    </div>
                    <span aria-hidden className="shrink-0 text-krds-text-muted">
                      -
                    </span>
                    <InputBox
                      className="flex-1 [&_input]:text-center"
                      inputType="numeric"
                      maxLength={4}
                      placeholder="1234"
                      value={telMid}
                      onChange={(e) => {
                        setTelMid(e.target.value)
                        sync(telPrefix, e.target.value, telLast)
                      }}
                      onBlur={field.onBlur}
                      error={!!fieldState.error}
                      aria-invalid={fieldState.error ? true : undefined}
                    />
                    <span aria-hidden className="shrink-0 text-krds-text-muted">
                      -
                    </span>
                    <InputBox
                      className="flex-1 [&_input]:text-center"
                      inputType="numeric"
                      maxLength={4}
                      placeholder="5678"
                      value={telLast}
                      onChange={(e) => {
                        setTelLast(e.target.value)
                        sync(telPrefix, telMid, e.target.value)
                      }}
                      onBlur={field.onBlur}
                      error={!!fieldState.error}
                      aria-invalid={fieldState.error ? true : undefined}
                    />
                  </div>
                  {fieldState.error && (
                    <InputMessage type="error">{fieldState.error.message}</InputMessage>
                  )}
                </div>
              )
            }}
          />
        </section>

        {/* 조달원 등록증 (Certificate of Registration) */}
        <section className="flex flex-col gap-4">
          <SectionTitle>조달원 등록증 (Certificate of Registration)</SectionTitle>

          {/* 업체명 (Company Name) * — 선택값 표시 InputBox(readonly) + 하단 [업체선택] 버튼(secondary).
              [업체선택] → 조달업체선택(MUI-CM-04-P23 OvsSosCnfdocChc) 팝업 호출 자리(미구현 스텁). */}
          <Controller
            control={form.control}
            name="bzentyNm1"
            render={({ field, fieldState }) => (
              <div id="field-bzentyNm1" className="flex flex-col gap-krds-5">
                <InputLabel required>업체명 (Company Name)</InputLabel>
                {/* 업체 선택 전에는 disabled(회색), 선택되면 값 표시(readOnly). 입력은 항상 [업체선택] 버튼으로만. */}
                <InputBox
                  readOnly
                  disabled={!field.value}
                  placeholder="업체를 선택해주세요."
                  value={field.value}
                  error={!!fieldState.error}
                  aria-invalid={fieldState.error ? true : undefined}
                />
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    // 추후: 조달업체선택(MUI-CM-04-P23 OvsSosCnfdocChc) 팝업 → 선택 결과를 field 로 주입.
                    console.log('[OvsSosCnfdocReg] 조달업체선택(P23 미구현)')
                    field.onChange('조달업체명 표시') // 스텁: P23 이 반환할 선택 업체명 자리
                  }}
                >
                  업체선택
                </Button>
                {fieldState.error && (
                  <InputMessage type="error">{fieldState.error.message}</InputMessage>
                )}
              </div>
            )}
          />

          {/* 발급신청사유 (Reason of Application) * */}
          <Controller
            control={form.control}
            name="aplyRsn"
            render={({ field, fieldState }) => (
              <div id="field-aplyRsn" className="flex flex-col gap-krds-5">
                <InputLabel htmlFor="ovs-rsn" required>
                  발급신청사유 (Reason of Application)
                </InputLabel>
                <TextArea
                  id="ovs-rsn"
                  placeholder="사유를 입력해주세요."
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  maxLength={4000}
                  error={!!fieldState.error}
                  aria-invalid={fieldState.error ? true : undefined}
                />
                {fieldState.error && (
                  <InputMessage type="error">{fieldState.error.message}</InputMessage>
                )}
              </div>
            )}
          />
        </section>
      </div>
    </FullPopup>
  )
}
OvsSosCnfdocRegFullPopup.displayName = 'OvsSosCnfdocRegFullPopup'
