// MUI-CM-03-M02 ID/PW 로그인 (설계서 로그인 slide38 p37 / Figma 10020:81949)
// 회원가입 시 등록한 아이디·비밀번호로 로그인하는 화면.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/id-pw) — 헤더·스크롤·뒤로가기는 AppLayout 이 소유,
// 페이지는 콘텐츠만 렌더한다.
//
// 구성(위→아래):
//   1) 업체/기관 선택(SegmentedControl) — '기관' 선택 시 아이디/비번 찾기 숨김(설계서 2026-06-22 개정)
//   2) PageTitle '아이디/비밀번호 로그인'(아이디/비밀번호=파랑) + 설명
//   3) 로그인 폼: 아이디 · 비밀번호(마스킹 보기 토글) · [로그인] — react-hook-form + zod
//   4) 도움말 아코디언(blue) — 로그인 제한 안내 3항목
//   5) '아이디 또는 비밀번호를 잊어버렸나요?' — 아이디 찾기 / 비밀번호 찾기 링크 카드('업체'일 때만)
//   6) '처음 방문하셨나요?' — 사용자 등록 안내 바로가기 링크 카드
//
// 설계서 반영 메모:
//   - '비밀번호 마스킹 - 비밀번호 입력 시 마스킹 보기 아이콘 표시'(설계서 콘텐츠영역) → 눈 아이콘 토글.
//   - 로그인 = authService.login → 소속 업체 2건 이상이면 업체선택(P14) → loginWith 로 확정 →
//     authStore(토큰+유저) 저장 → 홈 이동. 실패는 AlertModal 안내(ApiError.message).
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { authService } from '@/services/auth'
import { useAuthStore } from '@/stores/authStore'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { BzentyChc } from '@/ui/biz/cm/bzentyChc/BzentyChc'
import { NewIdChgInfo } from '@/ui/biz/cm/newId/NewIdChgInfo'
import {
  idPswdLoginSchema,
  type IdPswdLoginForm,
} from '@/ui/biz/cm/idPswdLogin/IdPswdLoginPage.schema'
import type { ApiError } from '@/types/api'
import type { BzentyChcItem, LoginResult } from '@/types/domain'

// 로그인 대상 구분(설계서 2026-06-22 개정: 업체·기관 선택 추가).
// 기관 선택 시 아이디/비밀번호 찾기 섹션 숨김.
const LOGIN_TARGETS = [
  { value: 'bzenty', label: '업체' },
  { value: 'inst', label: '기관' },
] as const

// 도움말 아코디언 항목(설계서 도움말 문구 그대로). 안정적 key = 문구 자체(고정 상수).
const HELP_ITEMS = [
  '비밀번호를 5회 이상 잘못 입력할 경우 3분간 로그인이 제한됩니다.',
  '비밀번호찾기를 통해 비밀번호를 변경할 경우 로그인 제한이 해제됩니다.',
  '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
] as const

// 링크 카드(Figma m_button_) — bg-white · border-divider · rounded 12 · 카드 그림자 · 좌측 라벨 + 우측 긴 화살표.
// /guide 공통에 정확히 대응하는 컴포넌트가 없어(NavigationItem=구분선 행 / Button=중앙정렬) 페이지 로컬 조립.
interface LinkCardProps {
  label: string
  /** 좌측 선행 아이콘(사용자 등록 카드 등). 없으면 라벨만. */
  leadingIcon?: IconName
  onClick?: () => void
}
const LinkCard = ({ label, leadingIcon, onClick }: LinkCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-[74px] w-full items-center gap-2 rounded-krds-xl border border-krds-border-divider bg-background px-6 text-left shadow-krds-card active:bg-krds-bg-primary-faint focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
  >
    {leadingIcon && (
      <Icon name={leadingIcon} size={24} className="shrink-0 text-krds-text-ink" aria-hidden />
    )}
    <span className="min-w-px flex-1 text-krds-body-lg font-bold leading-normal text-krds-text-ink wrap-break-word">
      {label}
    </span>
    {/* 긴 오른쪽 화살표(Figma trending_flat) */}
    <Icon name="TrendingFlat" size={20} className="shrink-0 text-krds-text-ink" aria-hidden />
  </button>
)

export function IdPswdLoginPage() {
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setUser = useAuthStore((s) => s.setUser)
  const [pwVisible, setPwVisible] = useState(false)
  // 로그인 대상(업체/기관). '기관' 선택 시 아이디/비밀번호 찾기 섹션 숨김(설계서 2026-06-22 개정).
  const [loginTarget, setLoginTarget] = useState<string>('bzenty')
  // 로그인 성공 후 소속 업체 선택(P14) 바텀시트 — 목록은 로그인 응답(bzentyList)으로 채움.
  const [bzentyOpen, setBzentyOpen] = useState(false)
  const [bzentyList, setBzentyList] = useState<BzentyChcItem[]>([])
  const [bzentyCd, setBzentyCd] = useState('')
  // 로그인 실패 안내(AlertModal) — null 이면 닫힘.
  const [loginError, setLoginError] = useState<string | null>(null)
  // 통합 로그인 계정등록안내(P21) 팝업 — 구버전 아이디 로그인 시 노출. null 이면 닫힘.
  const [newIdInfo, setNewIdInfo] = useState<{ userNm: string } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IdPswdLoginForm>({
    resolver: zodResolver(idPswdLoginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { userId: '', password: '' },
  })

  // 로그인 확정 — 토큰/유저를 authStore 에 저장(store 가 localStorage 브리지 소유) 후 홈 이동.
  const finalizeLogin = (result: LoginResult) => {
    setAccessToken(result.accessToken)
    setUser(result.user)
    setBzentyOpen(false)
    navigate('/')
  }

  const toErrorMessage = (err: unknown) =>
    (err as ApiError | null)?.message ?? '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'

  const onSubmit = async (data: IdPswdLoginForm) => {
    try {
      const result = await authService.login({ ...data, loginTarget })
      if (result.intgAcntRegRqrdYn) {
        // 구버전 아이디 로그인 → 통합 로그인 계정등록안내(P21) 팝업으로 통합계정등록(M22) 유도.
        setNewIdInfo({ userNm: result.user.name })
        return
      }
      if (result.bzentyList.length > 1) {
        // 소속 업체가 여럿 → 업체 선택(P14) 팝업에서 확정.
        setBzentyList(result.bzentyList)
        setBzentyCd(result.bzentyList[0].bzentyCd)
        setBzentyOpen(true)
        return
      }
      finalizeLogin(result)
    } catch (err) {
      setLoginError(toErrorMessage(err))
    }
  }

  const handleBzentyLogin = async () => {
    try {
      finalizeLogin(await authService.loginWith(bzentyCd))
    } catch (err) {
      setBzentyOpen(false)
      setLoginError(toErrorMessage(err))
    }
  }

  // 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
  return (
    <>
      {/* 업체·기관 선택(설계서 2026-06-22 개정 — 기관 선택 시 아이디/비번 찾기 숨김) */}
      <div className="px-4 pt-4">
        <SegmentedControl
          items={LOGIN_TARGETS.map((t) => ({ value: t.value, label: t.label }))}
          value={loginTarget}
          onValueChange={setLoginTarget}
        />
      </div>

      {/* 페이지 타이틀 + 설명 */}
      <PageTitle as="h1">
        <span className="text-krds-text-primary">아이디/비밀번호</span> 로그인
      </PageTitle>
      <p className="px-4 pb-4 text-krds-body-md leading-normal text-krds-text-ink wrap-break-word">
        회원가입시 등록한 아이디와 비밀번호를 이용하여 로그인합니다.
      </p>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-4 pt-5" noValidate>
        {/* 아이디 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userId">아이디</InputLabel>
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

        {/* 비밀번호 — 마스킹 + 보기 토글 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <div className="relative">
            <InputBox
              id="password"
              type={pwVisible ? 'text' : 'password'}
              placeholder="비밀번호를 입력해주세요"
              autoComplete="off"
              error={!!errors.password}
              aria-invalid={!!errors.password}
              className="pr-[52px]"
              onClear={() => setValue('password', '')}
              {...register('password')}
            />
            {/* 마스킹 보기 토글(설계서 콘텐츠영역: 비밀번호 입력 시 마스킹 보기 아이콘) */}
            <button
              type="button"
              onClick={() => setPwVisible((v) => !v)}
              aria-label={pwVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
              aria-pressed={pwVisible}
              className="absolute right-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-krds-text-disabled focus-visible:outline-hidden"
            >
              <Icon name={pwVisible ? 'VisibilityOff' : 'Visibility'} size={20} aria-hidden />
            </button>
          </div>
          {errors.password && <InputMessage type="error">{errors.password.message}</InputMessage>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중…' : '로그인'}
        </Button>
      </form>

      {/* 도움말 아코디언(blue) — 기본 펼침 */}
      <Accordion type="single" collapsible defaultValue="help" className="pt-6">
        <AccordionSection
          value="help"
          variant="blue"
          triggerClassName="text-krds-text-primary-active"
          contentClassName="bg-krds-bg-primary-faint"
          title={
            <span className="flex items-center gap-2">
              <Icon name="Info" size={24} fill={1} className="text-krds-text-primary" aria-hidden />
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

      {/* 아이디/비밀번호 찾기 — '기관' 선택 시 숨김(설계서 개정) */}
      {loginTarget === 'bzenty' && (
        <section className="pt-2">
          <SectionTitle as="h2">아이디 또는 비밀번호를 잊어버렸나요?</SectionTitle>
          <div className="flex flex-col gap-2 px-4 pt-1">
            <LinkCard
              label="아이디 찾기"
              onClick={() => {
                navigate('/login/find-id') // 아이디 찾기(MUI-CM-03-M03)
              }}
            />
            <LinkCard
              label="비밀번호 찾기"
              onClick={() => {
                navigate('/login/find-pw') // 비밀번호 찾기(MUI-CM-03-M06)
              }}
            />
          </div>
        </section>
      )}

      {/* 처음 방문 안내 */}
      <section className="pb-6 pt-2">
        <PageTitle as="h2">
          <span className="text-krds-text-primary">처음 </span>방문하셨나요?
        </PageTitle>
        <p className="px-4 pb-4 text-krds-body-md leading-normal text-krds-text-ink wrap-break-word">
          사용자 등록 방법을 자세하게 안내드립니다. 모바일에서는 업체등록, 사용자등록을 지원하지
          않습니다.
        </p>
        <div className="px-4">
          <LinkCard
            label="사용자 등록 안내 바로가기"
            leadingIcon="Person"
            onClick={() => {
              navigate('/login/user-reg-info') // 사용자 등록 안내(MUI-CM-03-M09)
            }}
          />
        </div>
      </section>

      {/* 로그인 성공 → 업체 선택(P14) 바텀시트. 선택 로그인 → 홈 */}
      <BottomSheet
        open={bzentyOpen}
        onOpenChange={setBzentyOpen}
        title="업체 설정"
        footer={
          <div className="flex gap-krds-5">
            <Button variant="secondary" className="shrink-0" onClick={() => setBzentyOpen(false)}>
              로그아웃
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleBzentyLogin}>
              선택 로그인
            </Button>
          </div>
        }
      >
        <BzentyChc items={bzentyList} value={bzentyCd} onValueChange={setBzentyCd} />
      </BottomSheet>

      {/* 로그인 실패 안내 */}
      <AlertModal
        open={loginError !== null}
        onOpenChange={(open) => {
          if (!open) setLoginError(null)
        }}
        variant="error"
        title="로그인 실패"
        description={loginError}
        primaryAction={{ label: '확인', onClick: () => setLoginError(null) }}
      />

      {/* 통합 로그인 계정등록안내(MUI-CM-03-P21) — 구버전 아이디 로그인 시. 확인 → 통합계정등록(M22) */}
      <AlertModal
        open={newIdInfo !== null}
        onOpenChange={(open) => {
          if (!open) setNewIdInfo(null)
        }}
        variant="info"
        title="통합 로그인 계정 등록 안내"
        description={<NewIdChgInfo />}
        secondaryAction={{ label: '취소', onClick: () => setNewIdInfo(null) }}
        primaryAction={{
          label: '통합 로그인 계정 등록',
          onClick: () => navigate('/login/new-id', { state: { userNm: newIdInfo?.userNm } }),
        }}
      />
    </>
  )
}
IdPswdLoginPage.displayName = 'IdPswdLoginPage'
