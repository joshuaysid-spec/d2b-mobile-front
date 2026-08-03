// MUI-CM-03-M03 아이디 찾기 (설계서 로그인 slide40 p39 / Figma 10020:87220)
// 본인인증(간편/모바일신분증/공동인증서/금융인증서) 또는 등록정보로 아이디를 찾는 인증방식 선택 화면.
// 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
//
// 구성(Figma 위→아래):
//   1) PageTitle '본인인증을 통해 아이디를 찾을 수 있습니다.'
//   2) '인증방식 선택' 라벨
//   3) 인증방식 카드 2열 그리드(간편인증·모바일신분증·공동인증서·금융인증서·등록정보로 찾기)
//
// 설계서 반영 메모:
//   - 인증방식 5종은 설계서 slide40 콘텐츠영역 문구 그대로. 카드 클릭 라우팅은 후속 화면/솔루션 미연동 → console.log 경계 스텁.
//   - 이 화면은 입력 폼이 아니라 선택 화면이므로 react-hook-form/zod 미사용(입력 필드 없음).
// 아이콘: 간편/모바일신분증/공동/금융 4종은 KRDS 별도제작 커스텀 SVG — Figma(10020:87229 등)에서
//   그대로 추출한 에셋(src/assets/images/*CertIcon.svg) 사용(2026-08-03 근사 글리프 → 원본 교체).
//   assignment_ind(등록정보로 찾기)만 Material Symbols 폰트 존재 → Icon REGISTRY 사용.
import { useNavigate } from 'react-router-dom'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { PageTitle } from '@/ui/common/base/PageTitle'
import simpleCertIcon from '@/assets/images/simpleCertIcon.svg'
import mobileIdntyCertIcon from '@/assets/images/mobileIdntyCertIcon.svg'
import jntCertIcon from '@/assets/images/jntCertIcon.svg'
import fnstCertIcon from '@/assets/images/fnstCertIcon.svg'

// 인증방식(설계서 slide40 콘텐츠영역 문구 그대로). 안정적 key = 라벨 문자열(고정 상수).
// iconSrc(커스텀 SVG 에셋) 또는 icon(Material Symbols REGISTRY) 중 하나로 지정.
interface AuthMethod {
  label: string
  /** Material Symbols REGISTRY 글리프(폰트 존재 시). */
  icon?: IconName
  /** KRDS 별도제작 커스텀 아이콘 에셋(Figma 원본 SVG). */
  iconSrc?: string
  /** 이동 경로(있으면 라우팅, 없으면 본인인증 SDK 호출 자리). 라벨 아닌 데이터로 분기. */
  path?: string
}
const AUTH_METHODS: readonly AuthMethod[] = [
  { label: '간편인증', iconSrc: simpleCertIcon },
  { label: '모바일신분증', iconSrc: mobileIdntyCertIcon },
  { label: '공동인증서', iconSrc: jntCertIcon },
  { label: '금융인증서', iconSrc: fnstCertIcon },
  // Figma 'assignment_ind' — Material Symbols 폰트 존재(REGISTRY: AssignmentInd), 그대로 사용.
  { label: '등록정보로 찾기', icon: 'AssignmentInd', path: '/login/find-id/reg-info' },
] as const

// 인증방식 카드(Figma login option group > box) — bg-white · border-divider · rounded 12 · 카드 그림자 ·
// 세로 중앙 정렬(아이콘 + 라벨). /guide 공통에 대응 카드가 없어 페이지 로컬 조립(도메인 전용).
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
    className="flex min-h-[86px] flex-col items-center justify-center gap-1 rounded-krds-xl border border-krds-border-divider bg-background shadow-krds-card active:bg-krds-bg-primary-faint focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
  >
    {iconSrc ? (
      <img src={iconSrc} alt="" aria-hidden className="size-6" />
    ) : (
      icon && <Icon name={icon} size={24} className="text-krds-text-ink" aria-hidden />
    )}
    <span className="text-krds-body-lg font-bold leading-normal text-krds-text-ink wrap-break-word">
      {label}
    </span>
  </button>
)

export function IdFndngPage() {
  const navigate = useNavigate()

  const handleSelect = (method: AuthMethod) => {
    // path 있으면 이동(등록정보로 찾기 → M04). 나머지 본인인증 수단(간편/모바일/공동/금융)은
    // 본인인증 성공 후 결과화면(M05)으로.
    if (method.path) {
      navigate(method.path)
      return
    }
    console.log('[idFndng] 본인인증', method.label) // 추후 API: authService.startIdInquiry
    navigate('/login/find-id/result')
  }

  // 셸(AppLayout) 안 화면 — 콘텐츠만 반환.
  return (
    <>
      {/* 페이지 타이틀 — '본인인증을 통해' 뒤 줄바꿈(2026-08-03 요청). span 으로 감싸 flex 분리 방지. */}
      <PageTitle as="h1">
        <span>
          본인인증을 통해
          <br />
          아이디를 찾을 수 있습니다.
        </span>
      </PageTitle>

      {/* 인증방식 선택 그룹 */}
      <section className="flex flex-col gap-2 px-4 pb-4">
        <p id="authMethodLabel" className="text-krds-body-md font-bold leading-normal text-krds-text-ink">
          인증방식 선택
        </p>
        <div
          role="group"
          aria-labelledby="authMethodLabel"
          className="grid grid-cols-2 gap-4"
        >
          {AUTH_METHODS.map((m) => (
            <AuthMethodCard
              key={m.label}
              label={m.label}
              icon={m.icon}
              iconSrc={m.iconSrc}
              onClick={() => handleSelect(m)}
            />
          ))}
        </div>
      </section>
    </>
  )
}
IdFndngPage.displayName = 'IdFndngPage'
