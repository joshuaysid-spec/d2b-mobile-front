// MUI-CM-03-M04 ID 등록정보로 찾기 (설계서 로그인 slide41 p40 / Figma 10020:87248)
// 아이디 찾기 인증 방식 중 '등록정보로 찾기' — 회원가입 시 등록한 정보를 입력해 아이디를 찾는 화면.
// 셸(AppLayout) 안 sub헤더 라우트(/login/find-id/reg-info). 헤더/스크롤/뒤로가기는 AppLayout 소유.
//
// 구성(Figma 위→아래):
//   1) PageTitle '아이디 등록정보로 찾기'
//   2) 설명 '회원가입시 등록한 정보를 정확히 입력해주세요.'
//   3) 폼: 사용자 구분(조달업체·표시전용) · 사업자등록번호* · 사용자명* · 사용자 생년월일* · [아이디 찾기]
//      — react-hook-form + zod
//
// 설계서 반영 메모:
//   - '사용자 구분'은 조달업체로 고정 표시(비활성 InputBox). 로그인 진입 대상에서 결정되므로 표시 전용.
//   - 2026-07-01 화면 수정: '사용자 주민등록번호' 삭제 → '사용자 생년월일'(6자리)로 대체(설계서).
//     ※ Figma(10020:87248) 라벨은 아직 '사용자 주민등록번호'로 남아있으나 placeholder 는 '생년월일 6자리…'
//        → 설계서 최신 개정을 우선해 라벨 '사용자 생년월일' 적용(리턴 보고에 불일치 플래그).
//   - StepBar 미표시(Figma 기준, M03/M06 일관).
//   - 아이디 찾기 실행/결과화면(MUI-CM-03-M05) 라우팅은 백엔드·후속화면 미연동 — console.log 경계 스텁.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import {
  idRegInfoFndngSchema,
  type IdRegInfoFndngForm,
} from '@/ui/biz/cm/idRegInfoFndng/IdRegInfoFndngPage.schema'

// 사용자 구분 — 로그인 진입 대상(조달업체)에서 확정되는 표시 전용 값(설계서 '사용자 구분'/Figma 비활성 박스).
const USER_SE_LABEL = '조달업체'

export function IdRegInfoFndngPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IdRegInfoFndngForm>({
    resolver: zodResolver(idRegInfoFndngSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { bizRegNo: '', userName: '', birthDate: '' },
  })

  const onSubmit = (data: IdRegInfoFndngForm) => {
    console.log('[login] ID 등록정보로 찾기', { ...data, userSe: USER_SE_LABEL }) // 추후 API: authService.selectIdFndngByRegInfo
    navigate('/login/find-id/result') // 결과화면(MUI-CM-03-M05)
  }

  // 셸(AppLayout) 안 화면 — 콘텐츠만 렌더.
  return (
    <>
      {/* 페이지 타이틀 + 설명 */}
      <PageTitle as="h1">아이디 등록정보로 찾기</PageTitle>
      <p className="px-4 pb-4 text-krds-body-md leading-normal text-krds-text-ink wrap-break-word">
        회원가입시 등록한 정보를 정확히 입력해주세요.
      </p>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-4 pt-2" noValidate>
        {/* 사용자 구분 — 조달업체 고정(표시 전용) */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userSe">사용자 구분</InputLabel>
          <InputBox id="userSe" disabled defaultValue={USER_SE_LABEL} />
        </div>

        {/* 사업자등록번호 — 필수, '-' 없이 숫자만 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="bizRegNo" required>
            사업자등록번호
          </InputLabel>
          <InputBox
            id="bizRegNo"
            inputType="numeric"
            placeholder="'-' 없이 입력해주세요"
            autoComplete="off"
            error={!!errors.bizRegNo}
            aria-invalid={!!errors.bizRegNo}
            onClear={() => setValue('bizRegNo', '')}
            {...register('bizRegNo')}
          />
          {errors.bizRegNo && <InputMessage type="error">{errors.bizRegNo.message}</InputMessage>}
        </div>

        {/* 사용자명 — 필수, 공백없이 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userName" required>
            사용자명
          </InputLabel>
          <InputBox
            id="userName"
            placeholder="공백없이 입력해주세요"
            autoComplete="off"
            error={!!errors.userName}
            aria-invalid={!!errors.userName}
            onClear={() => setValue('userName', '')}
            {...register('userName')}
          />
          {errors.userName && <InputMessage type="error">{errors.userName.message}</InputMessage>}
        </div>

        {/* 사용자 생년월일 — 필수, 6자리(설계서 2026-07-01 개정: 주민등록번호 삭제) */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="birthDate" required>
            사용자 생년월일
          </InputLabel>
          <InputBox
            id="birthDate"
            inputType="numeric"
            maxLength={6}
            placeholder="생년월일 6자리를 입력해주세요"
            autoComplete="off"
            error={!!errors.birthDate}
            aria-invalid={!!errors.birthDate}
            onClear={() => setValue('birthDate', '')}
            {...register('birthDate')}
          />
          {errors.birthDate && <InputMessage type="error">{errors.birthDate.message}</InputMessage>}
        </div>

        <Button type="submit" className="mt-1 w-full">
          아이디 찾기
        </Button>
      </form>
    </>
  )
}
IdRegInfoFndngPage.displayName = 'IdRegInfoFndngPage'
