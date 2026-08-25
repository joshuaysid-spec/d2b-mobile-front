// 개인정보 상세/수정 — MUI-CM-02-M03(상세) · M04(수정). 마이페이지 > 사용자정보관리 > 개인정보 상세.
// 설계서 00.공통 v0.86 slide199(M03)·slide200(M04). (2026-08-25 사용자 확정 재구성)
//   - 기본정보는 Table 이 아니라 설계서처럼 input(InputLabel+InputBox) 형태.
//   - 상세(M03) 상태: 전 입력 비활성(조회 전용). 하단 [개인정보 수정하기] 클릭 시 비밀번호 재확인 없이
//     같은 화면이 바로 수정(M04) 상태로 전환 — 수정 가능 항목(이메일*·휴대전화번호*·전화번호*·팩스번호)만 활성.
//     Dim 항목(아이디/사용자명/사용자 유형/실명인증여부/부서명/업체명)은 수정 상태에서도 비활성(설계서 slide200).
//   - 수정 상태 footer [취소][저장하기]: 취소=상세 복귀(입력 원복) · 저장=검증(RHF+zod) 후 반영 + 상세 복귀
//     + 토스트 '개인정보를 수정하였습니다.'(설계서 slide200).
// 분기: 사용자 관리 목록(M07)에서 진입(navigate state { from: 'userList' }) → 헤더 타이틀 '사용자 상세정보',
//       수신설정·도움말·수정 버튼 모두 미표시(조회 전용 유지).
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout, router handle) 담당 → 본문은 콘텐츠만 렌더. 데이터는 목업(백엔드 미연동).
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Switch } from '@/ui/common/base/Switch'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { Toast } from '@/ui/common/composites/Toast'
import { formatPhoneInput } from '@/utils/format'
import {
  indvInfoMdfcnSchema,
  type IndvInfoMdfcnForm,
} from '@/ui/biz/cm/indvInfoDtl/IndvInfoDtl.schema'

// ── Dim 항목(수정 불가 — 설계서 slide200 'Dim 항목은 수정불가'. 예시값 slide199) ──
// 순서는 설계서 slide199 와이어프레임 그대로(사용자 확정 2026-08-25):
//   사용자 유형 → 아이디 → 사용자명 → 업체명 → [부서명(수정 가능)] → 실명인증여부 → 전화번호~팩스번호(수정 가능).
const DIM_FIELDS_TOP: { id: string; label: string; value: string }[] = [
  { id: 'userTy', label: '사용자 유형', value: '일반사용자' },
  { id: 'userId', label: '아이디', value: 'Test1' },
  { id: 'userNm', label: '사용자명', value: '홍길동' },
  { id: 'bzentyNm', label: '업체명', value: '조달테스트' },
]
const DIM_RNM_CERT = { id: 'rnmCert', label: '실명인증여부', value: '실명인증이 필요합니다.' }

// 수정 가능 항목 초기값(설계서 slide199 예시 — 추후 회원정보 API). 부서명 포함(사용자 확정 2026-08-25).
const INITIAL_EDITABLE: IndvInfoMdfcnForm = {
  deptNm: '총무팀',
  emlAddr: 'abcde@dapa.go.kr',
  mblTelno: '010-1234-5678',
  telno: '02-1234-5678',
  fxno: '02-2345-6789',
}

export function IndvInfoDtlPage() {
  // 진입 출처 판별 — 사용자 관리 목록(M07)에서 진입 시 { from: 'userList' } state 전달.
  const fromUserList = (useLocation().state as { from?: string } | null)?.from === 'userList'

  // 상세(M03) ↔ 수정(M04) 상태 — [개인정보 수정하기]로 즉시 전환(비밀번호 재확인 없음, 사용자 확정 2026-08-25).
  const [editMode, setEditMode] = useState(false)
  // 저장된 수정 가능 항목 값 — 저장 시 갱신(추후 API 응답으로 교체).
  const [info, setInfo] = useState<IndvInfoMdfcnForm>(INITIAL_EDITABLE)
  const [toastOpen, setToastOpen] = useState(false)

  // 수신 설정 — 상세에선 조회만, 수정 상태에서 토글 가능(설계서 slide200 수신 설정 포함).
  const [recv, setRecv] = useState({ mbtlnum: true, email: true })

  const { control, handleSubmit, reset } = useForm<IndvInfoMdfcnForm>({
    resolver: zodResolver(indvInfoMdfcnSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: info,
  })

  // [개인정보 수정하기] — 재인증 게이트 없이 바로 수정 상태로(입력값은 현재 저장값으로 초기화).
  const goEdit = () => {
    reset(info)
    setEditMode(true)
  }
  // [취소] — 입력 원복 후 상세 복귀(설계서 slide200 '취소 클릭 시 개인정보 상세 화면 이동').
  const handleCancel = () => {
    reset(info)
    setEditMode(false)
  }
  // [저장하기] — 검증 통과 시 반영 + 상세 복귀 + 토스트(설계서 slide200).
  const onSaveValid = (values: IndvInfoMdfcnForm) => {
    setInfo(values)
    setEditMode(false)
    setToastOpen(true)
    console.log('[IndvInfoDtl] 개인정보 수정 저장', { ...values, recv }) // 추후 API: cmService.updateIndvInfo
  }
  const onSaveInvalid = () => {
    document.getElementById('field-emlAddr')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // 수정 가능 필드 공통 렌더 — Controller + InputBox(에러 표시는 InputMessage).
  const editableField = (
    name: keyof IndvInfoMdfcnForm,
    label: string,
    placeholder: string,
    opts?: { required?: boolean; tel?: boolean },
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div id={`field-${name}`} className="flex flex-col gap-krds-3">
          <InputLabel htmlFor={`indv-${name}`} required={editMode && opts?.required}>
            {label}
          </InputLabel>
          <InputBox
            id={`indv-${name}`}
            disabled={!editMode}
            placeholder={placeholder}
            inputType={opts?.tel ? 'tel' : 'text'}
            format={opts?.tel ? formatPhoneInput : undefined}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={!!fieldState.error}
            aria-invalid={fieldState.error ? true : undefined}
            aria-describedby={fieldState.error ? `indv-${name}-msg` : undefined}
          />
          {fieldState.error && (
            <InputMessage type="error" id={`indv-${name}-msg`}>
              {fieldState.error.message}
            </InputMessage>
          )}
        </div>
      )}
    />
  )

  return (
    <div className="flex w-full flex-col pb-6">
      {/* 기본정보 — 설계서 slide199/200 순서 그대로 input 형태(사용자 확정 2026-08-25, 구 Table 대체). */}
      <SectionTitle>기본정보</SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4 pt-2">
        {DIM_FIELDS_TOP.map((f) => (
          <div key={f.id} className="flex flex-col gap-krds-3">
            <InputLabel htmlFor={`indv-${f.id}`}>{f.label}</InputLabel>
            <InputBox id={`indv-${f.id}`} disabled value={f.value} readOnly />
          </div>
        ))}
        {/* 부서명 — 수정 가능(사용자 확정 2026-08-25). 설계서 위치(업체명 다음) 유지 */}
        {editableField('deptNm', '부서명', '부서명을 입력해주세요')}
        <div className="flex flex-col gap-krds-3">
          <InputLabel htmlFor={`indv-${DIM_RNM_CERT.id}`}>{DIM_RNM_CERT.label}</InputLabel>
          <InputBox id={`indv-${DIM_RNM_CERT.id}`} disabled value={DIM_RNM_CERT.value} readOnly />
        </div>
        {/* 수정 가능 항목 — 설계서 slide199 순서: 전화번호 → 휴대전화번호 → 이메일 주소 → 팩스번호 */}
        {editableField('telno', '전화번호', '전화번호를 입력해주세요', { required: true })}
        {editableField('mblTelno', '휴대전화번호', '휴대전화번호를 입력해주세요', {
          required: true,
          tel: true,
        })}
        {editableField('emlAddr', '이메일 주소', '이메일 주소를 입력해주세요', { required: true })}
        {editableField('fxno', '팩스번호', '팩스번호를 입력해주세요')}
      </div>

      {/* 수신 설정 — 마이페이지 진입 시에만 표시(목록 진입 시 숨김) */}
      {!fromUserList && (
        <>
          <SectionTitle className="mt-2">수신 설정</SectionTitle>
          <div className="flex flex-col gap-1 px-4">
            {(
              [
                { id: 'mbtlnum', label: '휴대전화 수신' },
                { id: 'email', label: '이메일 수신' },
              ] as const
            ).map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-krds-5 py-krds-5">
                <span className="min-w-px flex-1 text-[17px] font-medium leading-normal text-krds-text-ink">
                  {row.label}
                </span>
                {/* 상세=조회 전용(disabled), 수정 상태에서 토글 가능(설계서 slide200) */}
                <Switch
                  checked={recv[row.id]}
                  disabled={!editMode}
                  onCheckedChange={(on) => setRecv((prev) => ({ ...prev, [row.id]: on === true }))}
                  aria-label={row.label}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>

          {/* 도움말 — 수신 설정 변경 안내 */}
          <div className="mt-2">
            <HelpDisclosure
              items={[
                'SMS 수신서비스 설정은 홈 > 마이페이지 > 알림서비스신청 화면에서 가능합니다.',
              ]}
            />
          </div>

          {/* 하단 버튼 — 상세: [개인정보 수정하기](즉시 수정 전환) / 수정: [취소][저장하기](설계서 slide200) */}
          <div className="mt-6 px-4">
            {editMode ? (
              <ButtonGroup
                layout="asymmetric"
                items={[
                  { label: '취소', variant: 'secondary', onClick: handleCancel },
                  {
                    label: '저장하기',
                    variant: 'primary',
                    onClick: handleSubmit(onSaveValid, onSaveInvalid),
                  },
                ]}
              />
            ) : (
              <Button variant="primary" size="lg" className="w-full" onClick={goEdit}>
                개인정보 수정하기
              </Button>
            )}
          </div>
        </>
      )}

      {/* 저장 완료 토스트(설계서 slide200 '개인정보를 수정하였습니다.') */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        개인정보를 수정하였습니다.
      </Toast>
    </div>
  )
}
IndvInfoDtlPage.displayName = 'IndvInfoDtlPage'
