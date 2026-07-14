// MUI-CM-03-P10 간편인증 (설계서 p50 / Figma 10020:87374)
// 간편인증 제공사 선택 → 선택 시 Any-ID 간편인증 프로세스(SDK) 호출.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/simple-cert, handle: header variant='sub' title='간편인증').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 디자인/설계서 메모(보고 대상):
//   - 설계서는 이 화면을 "간편인증 선택 팝업"으로, Figma(10020:87374)는 BottomSheet(4열 그리드)로 표현.
//     확정결정(BUILD-GUIDE #1)에 따라 CM-03 은 전부 셸 안 sub헤더 페이지 → 팝업이 아닌 콘텐츠 페이지로 구현.
//     비주얼(4열 제공사 그리드)만 Figma 를 따름.
//   - 제공사 브랜드 로고(KB국민/PASS/토스/카카오뱅크/네이버/하나/뱅크샐러드/우리/신한/NH/카카오톡)는
//     KRDS 폰트 아이콘 REGISTRY 에 없음 → 공통 근사 글리프(VerifiedUser)로 임시 표기.
//     실제 브랜드 로고 SVG 에셋으로 교체 필요(각 항목 TODO(디자인 에셋)).
//   - 제공사 목록/순서는 설계서(p50) 및 Figma 와 일치(11종).
import { Icon } from '@/ui/common/base/Icon'

interface SimpleCertProvider {
  /** 제공사 식별자 — 선택 시 SDK 호출 분기 기준. */
  id: string
  /** 제공사 라벨(설계서/Figma 문구 그대로). */
  label: string
}

// 설계서 p50 · Figma 10020:87374 의 간편인증 제공사 목록(순서 그대로, 11종).
const SIMPLE_CERT_PROVIDERS: SimpleCertProvider[] = [
  { id: 'kb', label: '국민인증서' },
  { id: 'telco', label: '통신사PASS' },
  { id: 'toss', label: '토스' },
  { id: 'kakaobank', label: '카카오뱅크' },
  { id: 'naver', label: '네이버' },
  { id: 'hana', label: '하나인증서' },
  { id: 'banksalad', label: '뱅크샐러드' },
  { id: 'woori', label: '우리인증서' },
  { id: 'shinhan', label: '신한인증서' },
  { id: 'nh', label: 'NH인증서' },
  { id: 'kakaotalk', label: '카카오톡' },
]

/** 간편인증 제공사 그리드 — BottomSheet 콘텐츠(로그인 방식선택에서 열림) + 페이지 공용. */
export function SimpleCert({ onSuccess }: { onSuccess?: () => void }) {
  const handleSelectProvider = (provider: SimpleCertProvider) => {
    console.log('[SimpleCert] 간편인증 제공사 선택:', provider.id)
    // 추후: Any-ID 간편인증 프로세스(SDK) 호출 → 성공 시 onSuccess
    onSuccess?.()
  }

  return (
    <div className="grid grid-cols-4 gap-x-krds-5 gap-y-krds-8">
      {SIMPLE_CERT_PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => handleSelectProvider(provider)}
          className="flex flex-col items-center gap-krds-3"
        >
          {/* TODO(디자인 에셋): 브랜드 로고 SVG (예: KB국민/PASS/토스…) — 현재 근사 글리프로 임시 표기 */}
          <span className="flex size-[56px] items-center justify-center rounded-krds-xl border border-krds-border-divider bg-background shadow-krds-card">
            <Icon name="VerifiedUser" size={28} aria-hidden className="text-krds-text-primary" />
          </span>
          <span className="text-krds-body-sm text-krds-text-ink">{provider.label}</span>
        </button>
      ))}
    </div>
  )
}
SimpleCert.displayName = 'SimpleCert'

// 페이지(라우트 /login/simple-cert) — 직접 진입 시 셸 안 콘텐츠로. (기본은 로그인 방식선택의 BottomSheet)
export function SimpleCertPage() {
  return (
    <section className="flex flex-col gap-krds-9 px-krds-8 pt-krds-9 pb-krds-8">
      <SimpleCert />
    </section>
  )
}
SimpleCertPage.displayName = 'SimpleCertPage'
