// MUI-CM-03-M07 PW 등록정보로 찾기 (비밀번호 등록정보로 찾기) (설계서 로그인 slide45 p44 / Figma 10020:87259)
// 회원가입 시 등록한 정보(아이디·사업자등록번호·사용자명·생년월일)를 입력해 비밀번호를 찾는 화면.
// 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
//
// 구성(Figma 위→아래):
//   1) PageTitle '등록정보로 비밀번호 찾기' + 설명
//   2) 입력 폼: 사용자 구분(조달업체 고정) · 아이디 · 사업자등록번호 · 사용자명 · 생년월일 · [비밀번호 찾기]
//      — react-hook-form + zod
//
// 설계서 반영 메모:
//   - 2026-07-01 화면 수정: 주민등록번호 삭제 → 생년월일(6자리)로 대체.
//   - slide45 주석 "1 사용자당 1 아이디로 개편 · 사용자 구분/사업자 아이디 무의미해짐 · 정책 확정 시
//     화면 변경 필요" → 사용자 구분은 '조달업체' 고정 표시(disabled). 정책 확정 시 재검토(schema TODO).
//   - Figma 10020:87259 는 헤더/타이틀 텍스트가 'ID 등록정보로 찾기'(구 카피)로 남아 있으나,
//     아이디 입력 필드 + '비밀번호 찾기' 버튼을 포함하므로 M07(PW 찾기) 디자인이다.
//     콘텐츠/필드/타이틀은 설계서 우선(등록정보로 비밀번호 찾기). ↔ 리턴에 불일치 플래그.
//   - 비밀번호찾기 실행/후속(결과 MUI-CM-03-M08) 라우팅은 백엔드 미연동 — console.log 경계 스텁.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import {
  pswdRegInfoFndngSchema,
  type PswdRegInfoFndngForm,
} from '@/ui/biz/cm/pswdRegInfoFndng/PswdRegInfoFndngPage.schema'

export function PswdRegInfoFndngPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PswdRegInfoFndngForm>({
    resolver: zodResolver(pswdRegInfoFndngSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { userId: '', bizRegNo: '', userName: '', birthDate: '' },
  })

  const onSubmit = (data: PswdRegInfoFndngForm) => {
    console.log('[login] 등록정보로 비밀번호 찾기', data) // 추후 API: authService.selectPswdFndng
    navigate('/login/find-pw/result') // 결과화면(MUI-CM-03-M08)
  }

  return (
    <>
      {/* 페이지 타이틀 + 설명 */}
      <PageTitle as="h1">등록정보로 비밀번호 찾기</PageTitle>
      <p className="px-4 pb-2 text-krds-body-md leading-normal text-krds-text-ink wrap-break-word">
        회원가입시 등록한 정보를 정확히 입력해주세요.
      </p>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-4 pt-5" noValidate>
        {/* 사용자 구분 — '조달업체' 고정 표시(설계서: 정책 확정 시 변경). disabled 읽기전용. */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userSe">사용자 구분</InputLabel>
          <InputBox id="userSe" value="조달업체" readOnly disabled />
        </div>

        {/* 아이디 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userId" required>
            아이디
          </InputLabel>
          <InputBox
            id="userId"
            placeholder="아이디를 입력해주세요"
            autoComplete="off"
            error={!!errors.userId}
            aria-invalid={!!errors.userId}
            onClear={() => setValue('userId', '')}
            {...register('userId')}
          />
          {errors.userId && <InputMessage type="error">{errors.userId.message}</InputMessage>}
        </div>

        {/* 사업자등록번호 — '-' 없이 숫자만 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="bizRegNo" required>
            사업자등록번호
          </InputLabel>
          <InputBox
            id="bizRegNo"
            inputType="numeric"
            placeholder="‘-’ 없이 입력해주세요"
            autoComplete="off"
            error={!!errors.bizRegNo}
            aria-invalid={!!errors.bizRegNo}
            onClear={() => setValue('bizRegNo', '')}
            {...register('bizRegNo')}
          />
          {errors.bizRegNo && <InputMessage type="error">{errors.bizRegNo.message}</InputMessage>}
        </div>

        {/* 사용자명 — 공백없이 */}
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

        {/* 생년월일 — 6자리 숫자(YYMMDD). 2026-07-01 개정: 주민등록번호 삭제 → 생년월일 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="birthDate" required>
            생년월일
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

        <Button type="submit" className="w-full">
          비밀번호 찾기
        </Button>
      </form>
    </>
  )
}
PswdRegInfoFndngPage.displayName = 'PswdRegInfoFndngPage'
