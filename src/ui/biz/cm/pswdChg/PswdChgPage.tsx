// MUI-CM-02-M05 비밀번호 변경 (공통설계서 v0.84 slide197)
// 마이페이지 > 사용자정보관리 > 비밀번호 변경. 현재/새/새 확인 3개 필드를 입력받아 비밀번호를 변경한다.
//
// 구성(위→아래):
//   1) PageTitle 안내문 '사용자 비밀번호를 새롭게 변경해주세요.'
//   2) 입력 폼(3개, 모두 필수·마스킹 + 눈 아이콘 토글): 현재 비밀번호 · 새 비밀번호 · 새 비밀번호 확인
//   3) 도움말(HelpDisclosure) — 비밀번호 규칙 / 입력 불가 특수문자 / 새 비밀번호로 로그인 안내
//   4) 하단 [비밀번호 변경하기] → 검증 통과 시 완료 모달(AlertModal) → [확인] → 이전 화면으로
//
// 폼 검증 = react-hook-form + zod(PswdChgPage.schema). 네이티브 입력은 register.
// 눈 아이콘: InputBox 는 우측 슬롯을 지원하지 않아 개조하지 않고 래핑(PasswordInput)으로 처리 —
//   래퍼가 로컬 show state 로 InputBox type 을 password↔text 토글하고 우측에 눈 버튼을 절대배치로 얹는다.
//
// 셸(AppLayout) 안 화면 — 헤더(sub, '비밀번호 변경')/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox, type InputBoxProps } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { pswdChgSchema, type PswdChgForm } from '@/ui/biz/cm/pswdChg/PswdChgPage.schema'
import { cn } from '@/utils/cn'

// 도움말 항목(설계서 slide197 문구 그대로). 안정적 key = 문구 자체(고정 상수).
const HELP_ITEMS = [
  '비밀번호는 9~16자 숫자, 영문 소문자, 특수문자 조합으로 입력하세요.',
  '입력 불가한 특수문자 : `~&()_{}[]\\:;"\',.<>?/',
  '새로운 비밀번호로 로그인 하실 수 있습니다.',
] as const

// 비밀번호 입력 래퍼 — InputBox(개조 금지) 를 감싸 우측에 마스킹 해제(눈) 토글을 얹는다.
// register 의 ref 가 내부 InputBox → RawInput 까지 닿도록 forwardRef 로 통과시킨다.
const PasswordInput = forwardRef<HTMLInputElement, InputBoxProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false)
    return (
      <div className="relative">
        {/* pr-12: 우측 눈 버튼과 텍스트가 겹치지 않도록 오른쪽 여백 확보. */}
        <InputBox
          ref={ref}
          type={show ? 'text' : 'password'}
          className={cn('pr-12', className)}
          {...props}
        />
        <button
          type="button"
          aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
          aria-pressed={show}
          onClick={() => setShow((v) => !v)}
          className="absolute right-krds-6 top-1/2 flex -translate-y-1/2 items-center text-krds-text-disabled"
        >
          <Icon name={show ? 'VisibilityOff' : 'Visibility'} size={20} aria-hidden />
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export function PswdChgPage() {
  const navigate = useNavigate()
  // 변경 완료 모달(설계서 slide197: '비밀번호가 변경되었습니다.' + [확인]).
  const [doneOpen, setDoneOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PswdChgForm>({
    resolver: zodResolver(pswdChgSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { currentPassword: '', newPassword: '', newPasswordConfirm: '' },
  })

  // 검증 통과 → 완료 모달 오픈. (추후 API: authService.changePassword — 실패 시 서버 검증 메시지 반영)
  const onSubmit = (data: PswdChgForm) => {
    console.log('[pw-change] 비밀번호 변경', data) // 추후 API: authService.changePassword
    setDoneOpen(true)
  }

  // 완료 모달 [확인] → 상위 목록(사용자정보관리)으로 복귀.
  const handleDoneConfirm = () => {
    console.log('[pw-change] 변경 완료 → 이전 화면') // 추후: navigate(마이페이지 사용자정보관리 경로)
    navigate(-1)
  }

  return (
    <>
      {/* 안내문 */}
      <PageTitle as="h1">사용자 비밀번호를 새롭게 변경해주세요.</PageTitle>

      {/* 비밀번호 변경 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-4 pt-1" noValidate>
        {/* 현재 비밀번호 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="currentPassword" required>
            현재 비밀번호
          </InputLabel>
          <PasswordInput
            id="currentPassword"
            placeholder="*********"
            autoComplete="current-password"
            error={!!errors.currentPassword}
            aria-invalid={!!errors.currentPassword}
            {...register('currentPassword')}
          />
          {errors.currentPassword && (
            <InputMessage type="error">{errors.currentPassword.message}</InputMessage>
          )}
        </div>

        {/* 새 비밀번호 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="newPassword" required>
            새 비밀번호
          </InputLabel>
          <PasswordInput
            id="newPassword"
            placeholder="새 비밀번호를 입력해주세요"
            autoComplete="new-password"
            error={!!errors.newPassword}
            aria-invalid={!!errors.newPassword}
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <InputMessage type="error">{errors.newPassword.message}</InputMessage>
          )}
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="newPasswordConfirm" required>
            새 비밀번호 확인
          </InputLabel>
          <PasswordInput
            id="newPasswordConfirm"
            placeholder="새 비밀번호를 한번 더 입력해주세요"
            autoComplete="new-password"
            error={!!errors.newPasswordConfirm}
            aria-invalid={!!errors.newPasswordConfirm}
            {...register('newPasswordConfirm')}
          />
          {errors.newPasswordConfirm && (
            <InputMessage type="error">{errors.newPasswordConfirm.message}</InputMessage>
          )}
        </div>

        {/* 도움말(업무도움) — 비밀번호 규칙 안내 */}
        <HelpDisclosure title="도움말" items={[...HELP_ITEMS]} className="pt-1" />

        {/* 하단 CTA — 콘텐츠 말미 전폭 버튼(로그인/비번찾기 플로우 컨벤션) */}
        <Button type="submit" className="mt-1 w-full">
          비밀번호 변경하기
        </Button>
      </form>

      {/* 변경 완료 모달 — [확인] 시 이전 화면으로 복귀. */}
      <AlertModal
        open={doneOpen}
        onOpenChange={setDoneOpen}
        variant="check"
        title="비밀번호가 변경되었습니다."
        primaryAction={{ label: '확인', onClick: handleDoneConfirm }}
      />
    </>
  )
}
PswdChgPage.displayName = 'PswdChgPage'
