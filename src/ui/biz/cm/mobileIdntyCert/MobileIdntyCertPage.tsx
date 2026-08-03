// MUI-CM-03-P13 모바일 신분증 (로그인 slide53 p52 / Figma 10020:87422)
// 모바일 신분증(행정안전부 모바일 신분증)을 발급받을 앱을 선택하는 화면.
// 앱 선택 시 해당 발급 앱(행안부 모바일신분증 프로세스)을 호출한다.
// 셸(AppLayout) 안 + sub헤더 라우트(코디네이터가 /login/mobile-id, header variant='sub'
// title='모바일 신분증' 배선). 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 →
// 페이지는 콘텐츠만 렌더(내부 타이틀/X 닫기 버튼은 sub헤더가 제공하므로 렌더하지 않음).
//
// 설계서 ↔ Figma 메모(보고 대상):
//   - 설계서(slide53)·Figma 모두 P13 을 "모바일 신분증 선택 팝업"(하단 바텀시트)으로 분류.
//     본 화면은 코디네이터 결정에 따라 셸 안 sub헤더 페이지로 구현 → 분류 불일치는 리턴에 플래그.
//   - 발급 앱 로고 6종·안내(sub_notice 회색)·사용 가이드 문서 아이콘은 Figma(10020:87422) 원본
//     에셋으로 추출해 사용(2026-08-03 근사 플레이스홀더 → 원본 교체).
//   - 안내 캡션 색 #717171 은 신규 토큰 text-krds-text-caption(--krds-d2b-gray-caption) 등록.
import kakaoBankLogo from '@/assets/images/mobileIdKakaoBank.png'
import tossLogo from '@/assets/images/mobileIdToss.png'
import govAppLogo from '@/assets/images/mobileIdGovApp.png'
import naverLogo from '@/assets/images/mobileIdNaver.png'
import nhAllOneLogo from '@/assets/images/mobileIdNhAllOne.png'
import kbStarLogo from '@/assets/images/mobileIdKbStar.png'
import subNoticeGrayIcon from '@/assets/images/subNoticeGrayIcon.svg'
import useGuideIcon from '@/assets/images/useGuideIcon.svg'

// 발급 앱 목록(설계서 slide53 순서 그대로). id 는 선택 시 앱 호출 분기 기준(로컬 식별자).
interface MobileIdApp {
  id: string
  label: string
  /** 브랜드 로고 — Figma(10020:87422) 원본 PNG 에셋. */
  logoSrc: string
}

const MOBILE_ID_APPS: MobileIdApp[] = [
  { id: 'kakaobank', label: '카카오뱅크', logoSrc: kakaoBankLogo },
  { id: 'toss', label: '토스', logoSrc: tossLogo },
  { id: 'govApp', label: '정부앱', logoSrc: govAppLogo },
  { id: 'naver', label: '네이버', logoSrc: naverLogo },
  { id: 'nhAllOne', label: 'NH올원뱅크', logoSrc: nhAllOneLogo },
  { id: 'kbStar', label: 'KB스타뱅크', logoSrc: kbStarLogo },
]

/** 모바일 신분증 발급 앱 그리드 + 안내 — BottomSheet 콘텐츠(로그인 방식선택에서 열림) + 페이지 공용. */
export function MobileIdntyCert({ onSuccess }: { onSuccess?: () => void }) {
  const handleSelectApp = (app: MobileIdApp) => {
    console.log('[MobileIdntyCert] 발급 앱 선택:', app.id)
    // 추후: 모바일신분증 앱 호출 — 발급/인증 프로세스 진입 → 성공 시 onSuccess
    onSuccess?.()
  }

  const handleUsageGuide = () => {
    console.log('[MobileIdntyCert] 사용 가이드')
    // 추후: 모바일신분증 사용 가이드 안내 화면/외부 링크 연결
  }

  // 바깥 페이지 패딩(px-*/pt-*/pb-*)은 호스트(BottomSheet/래퍼)가 소유 — 콘텐츠는 구조만 렌더.
  // 레이아웃은 Figma(10020:87422) 실측: 그리드 4열 gap x16/y20 · 타일 54px(r12, divider 보더) ·
  //   라벨 14 Regular · 안내(sub_notice 20px + 14px caption) · 사용 가이드(상단 구분선 + 우측 정렬).
  return (
    <div className="flex flex-col gap-krds-8">
      {/* 발급 앱 선택 그리드(4열) */}
      <div className="grid grid-cols-4 gap-x-krds-8 gap-y-krds-9 py-krds-5">
        {MOBILE_ID_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => handleSelectApp(app)}
            className="flex flex-col items-center gap-krds-5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            {/* 브랜드 로고 타일 — 54px · r12 · divider 보더 (Figma 원본 PNG) */}
            <span
              aria-hidden
              className="size-[54px] overflow-hidden rounded-krds-xl border border-krds-border-divider bg-background"
            >
              <img src={app.logoSrc} alt="" className="size-full object-cover" />
            </span>
            <span className="text-center text-[14px] leading-normal text-krds-text-ink">
              {app.label}
            </span>
          </button>
        ))}
      </div>

      {/* 안내문(m_list) — sub_notice(회색) 20px 박스 + 14px caption(#717171) */}
      <div className="flex gap-krds-3">
        <span aria-hidden className="flex size-5 shrink-0 items-center justify-center">
          <img src={subNoticeGrayIcon} alt="" className="size-[14px]" />
        </span>
        <p className="min-w-px flex-1 text-[14px] leading-normal text-krds-text-caption wrap-break-word">
          모바일 신분증을 발급받을 앱을 선택해주세요.
        </p>
      </div>

      {/* 사용 가이드 — 상단 구분선 + pt8, 우측 정렬 · 문서 아이콘(원본 SVG) + 17 Regular 파랑 밑줄 */}
      <div className="flex flex-col items-end border-t border-krds-border-divider pt-krds-5">
        <button
          type="button"
          onClick={handleUsageGuide}
          className="flex items-center gap-krds-3 text-krds-body-md leading-normal text-krds-text-primary underline"
        >
          <span aria-hidden className="flex size-5 shrink-0 items-center justify-center">
            <img src={useGuideIcon} alt="" className="h-[17px] w-auto" />
          </span>
          사용 가이드
        </button>
      </div>
    </div>
  )
}
MobileIdntyCert.displayName = 'MobileIdntyCert'

// 페이지(라우트 /login/mobile-id) — 직접 진입 시 셸 안 콘텐츠로. (기본은 로그인 방식선택의 BottomSheet)
export function MobileIdntyCertPage() {
  return (
    <section className="flex flex-col gap-krds-9 px-krds-8 pt-krds-9 pb-krds-8">
      <MobileIdntyCert />
    </section>
  )
}
MobileIdntyCertPage.displayName = 'MobileIdntyCertPage'
