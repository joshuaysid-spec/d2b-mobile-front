// MUI-CM-03-M06 비밀번호 찾기 (설계서 로그인 slide44 p43 / Figma 10020:82011)
// 본인인증을 통해 비밀번호를 변경(재설정)하는 화면의 1단계. 아이디를 입력하고 인증방식을 선택하면
// 선택한 인증수단으로 본인인증 흐름이 이어진다(등록정보로 찾기 → MUI-CM-03-M07).
//
// 구성(Figma 위→아래):
//   1) PageTitle '인증을 통해 비밀번호를 변경할 수 있습니다.'
//   2) 아이디 입력 — InputLabel + InputBox + 유효성 메시지(InputMessage error)
//   3) 인증방식 선택 — 5개 카드 그리드(간편인증·모바일신분증·공동인증서·금융인증서·등록정보로 찾기)
//
// 설계서 반영 메모:
//   - slide44 유효성: '아이디 미 입력, 없는 아이디로 인증방식 클릭 시 → 아이디를 정확히 입력해주세요.'
//     → 인증방식 카드 클릭이 곧 제출 트리거. handleSubmit 으로 아이디 검증 후 인증 흐름 진행.
//   - Figma 노드(10020:82011)에는 하단 [비밀번호 찾기] 버튼이 렌더되지 않음 → 인증방식 카드 자체가 액션.
//     설계서 텍스트의 '비밀번호 찾기' 는 화면 타이틀로 해석(별도 제출 버튼 없음).
//   - StepBar('1/3')는 설계서 콜아웃 표기이나 Figma 노드에 미렌더 → 미구현(보고 대상).
//   - 실제 인증/라우팅은 백엔드·후속화면 미연동 — console.log 경계 스텁.
//
// 셸(AppLayout) 안 화면 — 헤더(sub, '비밀번호 찾기')/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import {
  pswdFndngSchema,
  type PswdFndngForm,
} from '@/ui/biz/cm/pswdFndng/PswdFndngPage.schema'
import simpleCertIcon from '@/assets/images/simpleCertIcon.svg'
import mobileIdntyCertIcon from '@/assets/images/mobileIdntyCertIcon.svg'
import jntCertIcon from '@/assets/images/jntCertIcon.svg'
import fnstCertIcon from '@/assets/images/fnstCertIcon.svg'

// 인증방식(설계서 slide44 라벨 그대로). 안정적 key = 코드값(value).
// TODO(설계서 확인): 인증방식 코드(영문 항목값)는 설계서 데이터영역에 미제공 — 임시 코드, API 스펙 확정 시 교체.
// 아이콘: 간편/모바일신분증/공동/금융 4종은 KRDS 별도제작 커스텀 SVG — Figma(10020:87229 계열) 원본
//   에셋(src/assets/images/*CertIcon.svg) 사용(2026-08-03 근사 글리프 → 원본 교체, 아이디찾기와 동일).
interface AuthMethod {
  value: string
  label: string
  /** Material Symbols REGISTRY 글리프(폰트 존재 시). */
  icon?: IconName
  /** KRDS 별도제작 커스텀 아이콘 에셋(Figma 원본 SVG). */
  iconSrc?: string
  /** 이동 경로(있으면 검증 통과 후 라우팅). 라벨 아닌 데이터로 분기. */
  path?: string
}
const AUTH_METHODS: readonly AuthMethod[] = [
  { value: 'simpleAuth', label: '간편인증', iconSrc: simpleCertIcon },
  { value: 'mobileId', label: '모바일신분증', iconSrc: mobileIdntyCertIcon },
  { value: 'jointCert', label: '공동인증서', iconSrc: jntCertIcon },
  { value: 'financialCert', label: '금융인증서', iconSrc: fnstCertIcon },
  {
    value: 'registeredInfo',
    label: '등록정보로 찾기',
    icon: 'AssignmentInd', // assignment_ind — Material Symbols 폰트 존재, 그대로 사용.
    path: '/login/find-pw/reg-info',
  },
] as const

// 인증방식 카드(Figma) — 흰 카드 · divider 보더 · rounded 12 · 카드 그림자 · 아이콘 위 + 라벨 아래(세로 중앙).
// /guide 공통에 정확히 대응하는 컴포넌트가 없어(NavigationItem=행 / Button=텍스트만) 페이지 로컬 조립(도메인 전용).
interface AuthMethodCardProps {
  label: string
  icon?: IconName
  iconSrc?: string
  onClick?: () => void
}
const AuthMethodCard = ({ label, icon, iconSrc, onClick }: AuthMethodCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-krds-xl border border-krds-border-divider bg-background px-2 text-center shadow-krds-card active:bg-krds-bg-primary-faint focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
  >
    {iconSrc ? (
      <img src={iconSrc} alt="" aria-hidden className="size-7" />
    ) : (
      icon && <Icon name={icon} size={28} className="text-krds-text-ink" aria-hidden />
    )}
    <span className="text-krds-body-md font-bold text-krds-text-ink wrap-break-word">
      {label}
    </span>
  </button>
)

export function PswdFndngPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PswdFndngForm>({
    resolver: zodResolver(pswdFndngSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { userId: '' },
  })

  // 인증방식 카드 클릭 = 제출 트리거. 아이디 검증 통과 시: path 있으면 이동(등록정보로 찾기 → M07), 없으면 인증 SDK.
  const pickMethod = (method: AuthMethod) =>
    handleSubmit((data) => {
      console.log('[pw-find] 인증방식 선택', { method: method.value, ...data })
      if (method.path) navigate(method.path) // 등록정보로 찾기 → M07
      else navigate('/login/find-pw/result') // 본인인증 → 결과(M08)
    })

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      {/* 페이지 타이틀 */}
      <PageTitle as="h1">인증을 통해 비밀번호를 변경할 수 있습니다.</PageTitle>

      {/* 아이디 입력 */}
      <div className="flex flex-col gap-2 px-4 pt-2">
        <InputLabel htmlFor="userId">아이디 입력</InputLabel>
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

      {/* 인증방식 선택 */}
      <div className="flex flex-col gap-2 px-4 pb-6 pt-6">
        <InputLabel id="auth-method-label">인증방식 선택</InputLabel>
        <div
          role="group"
          aria-labelledby="auth-method-label"
          className="grid grid-cols-2 gap-2"
        >
          {AUTH_METHODS.map((m) => (
            <AuthMethodCard
              key={m.value}
              label={m.label}
              icon={m.icon}
              iconSrc={m.iconSrc}
              onClick={pickMethod(m)}
            />
          ))}
        </div>
      </div>
    </form>
  )
}
PswdFndngPage.displayName = 'PswdFndngPage'
