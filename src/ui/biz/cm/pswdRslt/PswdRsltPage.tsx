// MUI-CM-03-M08 비밀번호 찾기 결과(성공/실패) (설계서 로그인 slide47 p46 / Figma 성공 10020:87117 · 실패 10020:87151)
// 본인인증 결과 화면. 인증 성공 시 새 비밀번호를 변경(재설정)하는 폼, 실패 시 안내 문구를 보여준다.
// (설계서: 'PW 찾기 성공 시 비밀번호 변경' — 성공/실패가 한 화면의 두 상태)
//
// 구성:
//   [성공 10020:87117]
//     1) PageTitle '사용자 비밀번호를 새롭게 변경해주세요.'
//     2) 아이디(읽기전용, 인증된 사용자 아이디 표시)
//     3) 비밀번호 변경 폼: 새 비밀번호 · 비밀번호 확인 (react-hook-form + zod)
//     4) 도움말 아코디언(blue) — 비밀번호 규칙/입력 불가 특수문자
//     5) 하단 [비밀번호 변경하기]
//   [실패 10020:87151]
//     1) 안내 일러스트 + '사용자를 확인할 수 없습니다.'
//     2) 안내 박스 '가입된 회원정보가 없습니다.'
//     3) 하단 [사용자 등록 안내 바로가기]
//
// 설계서/디자인 메모(보고 대상):
//   - 성공/실패 분기는 실제로는 본인인증 결과(navigate state 등)로 결정됨. 여기서는 백엔드 미연동이라
//     데모용 로컬 토글(status)로 두 상태를 미리 볼 수 있게 함(기본 success). // 추후: 인증 결과로 결정.
//   - 성공 화면 아이디 'abcdef99' 는 설계서 예시값 그대로(인증된 사용자 아이디, 실제로는 조회 결과).
//   - 실패 일러스트(신분증/뱃지 형태)는 KRDS 별도제작 에셋 — 폰트 REGISTRY 미등록 → AssignmentInd 로 근사(TODO).
//   - Figma 는 하단 CTA 를 화면 최하단 고정(full-bleed)으로 표기하나, 셸(AppLayout)이 스크롤을 소유하고
//     코드베이스에 sticky 바텀바 선례가 없어 콘텐츠 말미 전폭 버튼으로 렌더(로그인 플로우 컨벤션).
//   - 실제 라우팅(사용자 등록 안내)·비밀번호 변경 API 는 미연동 — console.log 경계 스텁.
//
// 셸(AppLayout) 안 화면 — 헤더(sub, '비밀번호 찾기')/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { pswdRsltSchema, type PswdRsltForm } from '@/ui/biz/cm/pswdRslt/PswdRsltPage.schema'

// 인증된 사용자 아이디(설계서 예시값 그대로). 실제로는 본인인증/조회 결과로 주입됨.
const AUTHED_USER_ID = 'abcdef99'

// 도움말 항목(설계서 slide47 도움말 문구 그대로). 안정적 key = 문구 자체(고정 상수).
const HELP_ITEMS = [
  '비밀번호는 9~16자 숫자, 영문 소문자, 특수문자 조합으로 입력하세요.',
  '입력 불가한 특수문자 : `~&()_{}[]|\\:;"\',.<>?/',
] as const

// 데모용 상태 구분(성공/실패). 실제로는 본인인증 결과로 결정.
const STATUS_ITEMS = [
  { value: 'success', label: '성공' },
  { value: 'fail', label: '실패' },
] as const
type PswdRsltStatus = (typeof STATUS_ITEMS)[number]['value']

export function PswdRsltPage() {
  // 성공/실패 결과 상태 — 기본 success. (데모용 로컬 토글, 추후 인증 결과로 대체)
  const [status, setStatus] = useState<PswdRsltStatus>('success')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PswdRsltForm>({
    resolver: zodResolver(pswdRsltSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { password: '', passwordConfirm: '' },
  })

  const onSubmit = (data: PswdRsltForm) => {
    console.log('[pw-result] 비밀번호 변경', { userId: AUTHED_USER_ID, ...data }) // 추후 API: authService.changePassword
  }

  const handleUserRegisterGuide = () => {
    console.log('[pw-result] 사용자 등록 안내 바로가기') // 추후 라우팅: 사용자 등록 안내(MUI-CM-03-M09)
  }

  return (
    <>
      {/* 데모용 결과 상태 토글 — 실제 화면에는 없음(본인인증 결과로 성공/실패 결정) */}
      <div className="px-4 pt-4">
        <SegmentedControl
          items={STATUS_ITEMS.map((s) => ({ value: s.value, label: s.label }))}
          value={status}
          onValueChange={(v) => setStatus(v as PswdRsltStatus)}
        />
      </div>

      {status === 'success' ? (
        /* ── 성공: 비밀번호 변경 폼 ───────────────────────────── */
        <>
          <PageTitle as="h1">사용자 비밀번호를 새롭게 변경해주세요.</PageTitle>

          {/* 아이디(읽기전용) */}
          <div className="flex flex-col gap-2 px-4 pt-1">
            <InputLabel htmlFor="userId">아이디</InputLabel>
            <InputBox id="userId" value={AUTHED_USER_ID} readOnly disabled />
          </div>

          {/* 비밀번호 변경 폼 */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 px-4 pt-5"
            noValidate
          >
            {/* 새 비밀번호 */}
            <div className="flex flex-col gap-2">
              <InputLabel htmlFor="password" required>
                비밀번호
              </InputLabel>
              <InputBox
                id="password"
                type="password"
                placeholder="새 비밀번호를 입력해주세요"
                autoComplete="new-password"
                error={!!errors.password}
                aria-invalid={!!errors.password}
                onClear={() => setValue('password', '')}
                {...register('password')}
              />
              {errors.password && (
                <InputMessage type="error">{errors.password.message}</InputMessage>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-2">
              <InputLabel htmlFor="passwordConfirm" required>
                비밀번호 확인
              </InputLabel>
              <InputBox
                id="passwordConfirm"
                type="password"
                placeholder="새 비밀번호를 한번 더 입력해주세요"
                autoComplete="new-password"
                error={!!errors.passwordConfirm}
                aria-invalid={!!errors.passwordConfirm}
                onClear={() => setValue('passwordConfirm', '')}
                {...register('passwordConfirm')}
              />
              {errors.passwordConfirm && (
                <InputMessage type="error">{errors.passwordConfirm.message}</InputMessage>
              )}
            </div>

            {/* 도움말 아코디언(blue) — 기본 펼침 */}
            <Accordion type="single" collapsible defaultValue="help" className="pt-1">
              <AccordionSection
                value="help"
                variant="blue"
                borderTop={false}
                triggerClassName="text-krds-text-primary-active"
                contentClassName="bg-krds-bg-primary-faint"
                title={
                  <span className="flex items-center gap-2">
                    <Icon
                      name="Info"
                      size={24}
                      fill={1}
                      className="text-krds-text-primary"
                      aria-hidden
                    />
                    도움말
                  </span>
                }
              >
                <ul className="flex flex-col gap-2">
                  {HELP_ITEMS.map((text) => (
                    <li key={text} className="flex items-start gap-1">
                      <span
                        aria-hidden
                        className="mt-[7px] size-1.5 shrink-0 rounded-sm bg-krds-text-info"
                      />
                      <span className="min-w-px flex-1 text-krds-body-md leading-normal text-krds-text-info wrap-break-word">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>
            </Accordion>

            {/* 하단 CTA — Figma 는 최하단 고정 표기이나 콘텐츠 말미 전폭 버튼으로 렌더 */}
            <Button type="submit" className="mt-1 w-full">
              비밀번호 변경하기
            </Button>
          </form>
        </>
      ) : (
        /* ── 실패: 사용자 확인 불가 안내 ──────────────────────── */
        <div className="flex flex-col items-center px-4 pt-16">
          {/* 안내 일러스트 — KRDS 별도제작 에셋 근사(AssignmentInd) */}
          <div className="flex size-20 items-center justify-center rounded-krds-xl bg-krds-bg-primary-faint">
            {/* TODO(디자인 에셋): 신분증/뱃지 별도제작 일러스트 — REGISTRY 미등록, AssignmentInd 로 근사 */}
            <Icon name="AssignmentInd" size={40} className="text-krds-text-primary" aria-hidden />
          </div>

          <h1 className="mt-6 text-center text-krds-heading-sm font-bold leading-normal text-krds-text-ink wrap-break-word">
            사용자를 확인할 수 없습니다.
          </h1>

          {/* 안내 박스 */}
          <div className="mt-6 flex w-full flex-col items-center gap-2 rounded-krds-xl bg-krds-bg-secondary px-4 py-8">
            {/* TODO(디자인 에셋): 안내 아이콘(느낌표 원형) — Error 글리프로 근사, 중립색 적용 */}
            <Icon name="Error" size={24} fill={1} className="text-krds-text-disabled" aria-hidden />
            <p className="text-center text-krds-body-md leading-normal text-krds-text-ink wrap-break-word">
              가입된 회원정보가 없습니다.
            </p>
          </div>

          {/* 하단 CTA — 사용자 등록 안내 바로가기 */}
          <Button
            type="button"
            className="mt-8 w-full"
            onClick={handleUserRegisterGuide}
          >
            사용자 등록 안내 바로가기
          </Button>
        </div>
      )}
    </>
  )
}
PswdRsltPage.displayName = 'PswdRsltPage'
