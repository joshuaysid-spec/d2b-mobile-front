// MUI-CM-03-P10 간편인증 (설계서 p50 / Figma 10020:87374)
// 간편인증 제공사 선택 → 선택 시 Any-ID 간편인증 프로세스(SDK) 호출.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/simple-cert, handle: header variant='sub' title='간편인증').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 디자인/설계서 메모(보고 대상):
//   - 설계서는 이 화면을 "간편인증 선택 팝업"으로, Figma(10020:87374)는 BottomSheet(4열 그리드)로 표현.
//     확정결정(BUILD-GUIDE #1)에 따라 CM-03 은 전부 셸 안 sub헤더 페이지 → 팝업이 아닌 콘텐츠 페이지로 구현.
//     비주얼(4열 제공사 그리드)만 Figma 를 따름.
//   - 제공사 브랜드 로고 11종은 Figma 에셋에서 추출해 self-host(src/assets/images/cert/brand/*.png —
//     폐쇄망 대응, CDN 금지). 박스 54px · rounded-12 · border #d1d7e0 · 이미지 cover(토스만 contain).
//   - 제공사 목록/순서는 설계서(p50) 및 Figma 와 일치(11종).
import banksaladLogo from '@/assets/images/cert/brand/banksalad.png'
import hanaLogo from '@/assets/images/cert/brand/hana.png'
import kakaobankLogo from '@/assets/images/cert/brand/kakaobank.png'
import kakaotalkLogo from '@/assets/images/cert/brand/kakaotalk.png'
import kbLogo from '@/assets/images/cert/brand/kb.png'
import naverLogo from '@/assets/images/cert/brand/naver.png'
import nhCertLogo from '@/assets/images/cert/brand/nhCert.png'
import passLogo from '@/assets/images/cert/brand/pass.png'
import shinhanLogo from '@/assets/images/cert/brand/shinhan.png'
import tossLogo from '@/assets/images/cert/brand/toss.png'
import wooriLogo from '@/assets/images/cert/brand/woori.png'
import { cn } from '@/utils/cn'

interface SimpleCertProvider {
  /** 제공사 식별자 — 선택 시 SDK 호출 분기 기준. */
  id: string
  /** 제공사 라벨(설계서/Figma 문구 그대로). */
  label: string
  /** 브랜드 로고(Figma 추출 에셋). */
  logo: string
  /** 이미지 맞춤 — 여백 보존 에셋(토스)만 contain, 기본 cover(Figma 실측). */
  fit?: 'contain'
}

// 설계서 p50 · Figma 10020:87374 의 간편인증 제공사 목록(순서 그대로, 11종).
const SIMPLE_CERT_PROVIDERS: SimpleCertProvider[] = [
  { id: 'kb', label: '국민인증서', logo: kbLogo },
  { id: 'telco', label: '통신사PASS', logo: passLogo },
  { id: 'toss', label: '토스', logo: tossLogo, fit: 'contain' },
  { id: 'kakaobank', label: '카카오뱅크', logo: kakaobankLogo },
  { id: 'naver', label: '네이버', logo: naverLogo },
  { id: 'hana', label: '하나인증서', logo: hanaLogo },
  { id: 'banksalad', label: '뱅크샐러드', logo: banksaladLogo },
  { id: 'woori', label: '우리인증서', logo: wooriLogo },
  { id: 'shinhan', label: '신한인증서', logo: shinhanLogo },
  { id: 'nh', label: 'NH인증서', logo: nhCertLogo },
  { id: 'kakaotalk', label: '카카오톡', logo: kakaotalkLogo },
]

/** 간편인증 제공사 그리드 — BottomSheet 콘텐츠(로그인 방식선택에서 열림) + 페이지 공용. */
export function SimpleCert({ onSuccess }: { onSuccess?: () => void }) {
  const handleSelectProvider = (provider: SimpleCertProvider) => {
    console.log('[SimpleCert] 간편인증 제공사 선택:', provider.id)
    // 추후: Any-ID 간편인증 프로세스(SDK) 호출 → 성공 시 onSuccess
    onSuccess?.()
  }

  // Figma 10020:87374 그리드 실측: 4열 · gap-x 16 · gap-y 20 · 아이콘 박스 54px · 라벨 14px.
  return (
    <div className="grid grid-cols-4 gap-x-krds-8 gap-y-krds-9">
      {SIMPLE_CERT_PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => handleSelectProvider(provider)}
          className="flex flex-col items-center gap-krds-3"
        >
          <span className="size-[54px] shrink-0 overflow-hidden rounded-krds-xl border border-krds-border-divider bg-white">
            <img
              src={provider.logo}
              alt=""
              aria-hidden
              className={cn('size-full', provider.fit === 'contain' ? 'object-contain' : 'object-cover')}
            />
          </span>
          <span className="text-center text-[14px] leading-normal text-krds-text-ink">
            {provider.label}
          </span>
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
