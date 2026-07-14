// MUI-CM-03-P11 금융인증서 (설계서 로그인 slide51 p50 / Figma 10020:87143)
// 로그인-방식 선택(MainLogin)에서 '금융인증서' 진입. 금융인증서를 쓰기 위해 클라우드
// 저장소에 연결하기 전, 본인확인 정보(아이디·휴대폰번호·생년월일)를 입력하고
// [휴대폰 문자인증]으로 인증 프로세스를 시작하는 화면.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/finance-cert, header variant='sub' title='금융인증서').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 설계서/디자인 메모(보고 대상):
//   - 설계서 slide51 은 'Any-ID 금융인증 프로세스 호출'(솔루션 화면)이며 본 화면은 그 진입 폼.
//     '1 2'(2스텝) 표기가 있으나 Figma(10020:87143)에는 1스텝(본인확인 입력)만 렌더 → 그대로 구현.
//   - 항목 영문 ID 미제공 → schema 에 임시키(userId/mobileNo/birthDate) + TODO.
//   - 실제 인증서 발급/클라우드 연결/문자인증 발송은 금융인증 SDK 경계(console.log 스텁).
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { formatPhoneInput } from '@/utils/format'
import { fnstCertSchema, type FnstCertForm } from '@/ui/biz/cm/fnstCert/FnstCertPage.schema'

// 생년월일 입력 마스킹 — 숫자만 남기고 YYYY/MM/DD 슬래시 자동 삽입(Figma 표기 '1900/01/31').
// (공용 formatDateInput 은 하이픈 구분이라 디자인과 달라 이 화면 전용으로 슬래시 포맷 사용.)
function formatBirthInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts: string[] = [digits.slice(0, 4)]
  if (digits.length > 4) parts.push(digits.slice(4, 6))
  if (digits.length > 6) parts.push(digits.slice(6, 8))
  return parts.join('/')
}

/** 금융인증서 본인확인 폼 — BottomSheet 콘텐츠(로그인 방식선택에서 열림) + 페이지 공용. */
export function FnstCert({ onSuccess }: { onSuccess?: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FnstCertForm>({
    resolver: zodResolver(fnstCertSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { userId: '', mobileNo: '', birthDate: '' },
  })

  const onSubmit = (data: FnstCertForm) => {
    console.log('[fnstCert] 휴대폰 문자인증 요청', data)
    onSuccess?.()
    // 추후: 금융인증 SDK — Any-ID 금융인증 프로세스 호출(본인확인 → 클라우드 저장소 연결 → 인증서 사용)
  }

  return (
    <>
      {/* 안내 타이틀(설계서/Figma 문구 그대로) */}
      <PageTitle as="h1">금융인증서를 이용하기 위해 클라우드 저장소에 연결합니다.</PageTitle>

      {/* 본인확인 입력 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-4 pt-1" noValidate>
        {/* 아이디 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userId">아이디</InputLabel>
          <InputBox
            id="userId"
            placeholder="예) 홍길동"
            autoComplete="off"
            error={!!errors.userId}
            aria-invalid={!!errors.userId}
            onClear={() => setValue('userId', '')}
            {...register('userId')}
          />
          {errors.userId && <InputMessage type="error">{errors.userId.message}</InputMessage>}
        </div>

        {/* 휴대폰번호 — 숫자만 + 하이픈 자동 포맷 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="mobileNo">휴대폰번호</InputLabel>
          <Controller
            control={control}
            name="mobileNo"
            render={({ field }) => (
              <InputBox
                id="mobileNo"
                inputType="tel"
                format={formatPhoneInput}
                placeholder="예) 010-1234-5678"
                autoComplete="off"
                error={!!errors.mobileNo}
                aria-invalid={!!errors.mobileNo}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
              />
            )}
          />
          {errors.mobileNo && <InputMessage type="error">{errors.mobileNo.message}</InputMessage>}
        </div>

        {/* 생년월일 — 숫자만 + 슬래시 자동 포맷(YYYY/MM/DD) */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="birthDate">생년월일</InputLabel>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <InputBox
                id="birthDate"
                inputType="numeric"
                format={formatBirthInput}
                placeholder="예) 1900/01/31"
                autoComplete="off"
                error={!!errors.birthDate}
                aria-invalid={!!errors.birthDate}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
              />
            )}
          />
          {errors.birthDate && <InputMessage type="error">{errors.birthDate.message}</InputMessage>}
        </div>

        <Button type="submit" className="w-full">
          휴대폰 문자인증
        </Button>
      </form>
    </>
  )
}
FnstCert.displayName = 'FnstCert'

// 페이지(라우트 /login/finance-cert) — 직접 진입 시 셸 안 콘텐츠로. (기본은 로그인 방식선택의 BottomSheet)
// 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
export function FnstCertPage() {
  return (
    <section className="flex flex-col gap-krds-9 px-krds-8 pt-krds-9 pb-krds-8">
      <FnstCert />
    </section>
  )
}
FnstCertPage.displayName = 'FnstCertPage'
