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
//   - 실패 화면(10020:87151)은 아이디찾기 결과(IdRsltPage)와 동일 정형으로 재현(2026-08-03):
//     신분증 배지(80px 흰 배경+#c1d1ee 보더+파란 점) · 타이틀 24px 2줄 · 안내 카드(bg-primary-faint,
//     Error+ink Medium) 세로 중앙 · [사용자 등록 안내 바로가기] 최하단(min-h-full flex 로 하단 배치).
//   - 실제 라우팅(사용자 등록 안내)·비밀번호 변경 API 는 미연동 — console.log 경계 스텁.
//
// 셸(AppLayout) 안 화면 — 헤더(sub, '비밀번호 찾기')/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { pswdRsltSchema, type PswdRsltForm } from '@/ui/biz/cm/pswdRslt/PswdRsltPage.schema'
import alertErrorIcon from '@/assets/images/alertErrorIcon.svg'

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
  const navigate = useNavigate()
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
    console.log('[pw-result] 비밀번호 변경', { userId: AUTHED_USER_ID, ...data }) // 추후 API: authService.procPswdStng
    navigate('/login/id-pw') // 변경 완료 → 새 비밀번호로 로그인(MUI-CM-03-M02)
  }

  const handleUserRegisterGuide = () => {
    navigate('/login/user-reg-info') // 사용자 등록 안내(MUI-CM-03-M09)
  }

  return (
    // min-h-full flex — 실패 화면의 하단 CTA 를 화면 최하단에 붙이기 위한 컬럼 셸(Figma 10020:87151).
    <div className="flex min-h-full flex-col">
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
          {/* 타이틀 — '사용자 비밀번호를' 뒤 줄바꿈(2026-08-03 요청). span 으로 감싸 flex 분리 방지. */}
          <PageTitle as="h1">
            <span>
              사용자 비밀번호를
              <br />
              새롭게 변경해주세요.
            </span>
          </PageTitle>

          {/* 아이디(읽기전용) */}
          <div className="flex flex-col gap-2 px-4 pt-1">
            <InputLabel htmlFor="userId">아이디</InputLabel>
            <InputBox id="userId" value={AUTHED_USER_ID} readOnly disabled />
          </div>

          {/* 비밀번호 변경 폼 */}
          {/* pb-4: [비밀번호 변경하기] 하단 여백 = 좌우 여백(16px)과 동일(2026-08-03 요청) */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 px-4 pb-4 pt-5"
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
        /* ── 실패: 사용자 확인 불가 안내 (Figma 10020:87151 — IdRsltPage 실패와 동일 정형) ── */
        <div className="flex flex-1 flex-col px-4 pb-4">
          {/* 본문 — 신분증 배지 + 헤딩 + 안내 카드 (세로 중앙, 그룹 간 24px) */}
          <div className="flex flex-1 flex-col items-center justify-center gap-krds-10 py-krds-8">
            <div className="flex flex-col items-center gap-krds-7">
              {/* 신분증 배지 — 80px 흰 배경 + border-field(#c1d1ee) 1.33px + radius 27 +
                  파란 점 데코(24px, border-primary-soft — 글리프 좌상단 15,15 정렬) 위에 assignment_ind 50px */}
              <div className="relative flex size-20 items-center justify-center rounded-[27px] border-[1.33px] border-krds-border-field bg-background">
                <span
                  aria-hidden
                  className="absolute left-[15px] top-[15px] size-6 rounded-full bg-krds-border-primary-soft"
                />
                {/* 글리프 색 = #0f316e(primary-active) — Figma 배지 글리프 실측(2026-08-03) */}
                <Icon
                  name="AssignmentInd"
                  size={50}
                  className="relative text-krds-text-primary-active"
                  aria-hidden
                />
              </div>

              <h1 className="text-center text-[24px] font-bold leading-normal text-krds-text-ink">
                사용자를
                <br />
                확인할 수 없습니다
              </h1>
            </div>

            {/* 안내 카드 — bg-primary-faint · radius 8 · p 20 + m_empty data
                (alert_error 원본 SVG 30px + 17 Medium ink) */}
            <div className="flex w-full flex-col items-center gap-krds-5 rounded-krds-8 bg-krds-bg-primary-faint p-krds-9">
              <img src={alertErrorIcon} alt="" aria-hidden className="size-[30px]" />
              <p className="text-center text-krds-body-md font-medium leading-normal text-krds-text-ink wrap-break-word">
                가입된 회원정보가 없습니다.
              </p>
            </div>
          </div>

          {/* 하단 CTA — 화면 최하단(Figma) */}
          <Button type="button" className="w-full" onClick={handleUserRegisterGuide}>
            사용자 등록 안내 바로가기
          </Button>
        </div>
      )}
    </div>
  )
}
PswdRsltPage.displayName = 'PswdRsltPage'
