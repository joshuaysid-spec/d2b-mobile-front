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
//   - 발급 앱 로고 6종(카카오뱅크·토스·정부앱·네이버·NH올원뱅크·KB스타뱅크)은 각 사 브랜드
//     로고(별도 이미지 에셋)라 Material Symbols 폰트 Icon REGISTRY 에 없음 → 중립 플레이스홀더
//     타일(약칭)로 임시 근사(각 TODO). 실제 브랜드 로고 SVG/이미지로 교체 필요.
//   - 안내문 앞 아이콘은 Figma 상 확성기/안내 계열 → Campaign 으로 근사(정확 글리프 미확정).
import { Icon } from '@/ui/common/base/Icon'

// 발급 앱 목록(설계서 slide53 순서 그대로). id 는 선택 시 앱 호출 분기 기준(로컬 식별자).
// logoStub = 브랜드 로고 미확보 상태의 중립 플레이스홀더 약칭.
interface MobileIdApp {
  id: string
  label: string
  logoStub: string
}

const MOBILE_ID_APPS: MobileIdApp[] = [
  // TODO(디자인 에셋): 카카오뱅크 브랜드 로고 — REGISTRY/이미지 미확보, 약칭 타일로 근사
  { id: 'kakaobank', label: '카카오뱅크', logoStub: '카카오' },
  // TODO(디자인 에셋): 토스 브랜드 로고 — 근사
  { id: 'toss', label: '토스', logoStub: '토스' },
  // TODO(디자인 에셋): 정부앱(정부24) 브랜드 로고 — 근사
  { id: 'govApp', label: '정부앱', logoStub: '정부' },
  // TODO(디자인 에셋): 네이버 브랜드 로고 — 근사
  { id: 'naver', label: '네이버', logoStub: 'N' },
  // TODO(디자인 에셋): NH올원뱅크 브랜드 로고 — 근사
  { id: 'nhAllOne', label: 'NH올원뱅크', logoStub: 'NH' },
  // TODO(디자인 에셋): KB스타뱅크 브랜드 로고 — 근사
  { id: 'kbStar', label: 'KB스타뱅크', logoStub: 'KB' },
]

export function MobileIdntyCertPage() {
  const handleSelectApp = (app: MobileIdApp) => {
    console.log('[MobileIdntyCert] 발급 앱 선택:', app.id)
    // 추후: 모바일신분증 앱 호출 — 선택한 앱으로 행안부 모바일 신분증 발급/인증 프로세스 진입
  }

  const handleUsageGuide = () => {
    console.log('[MobileIdntyCert] 사용 가이드')
    // 추후: 모바일신분증 사용 가이드 안내 화면/외부 링크 연결
  }

  // 셸(AppLayout) 안 화면 — 콘텐츠만 렌더.
  return (
    <>
      {/* 발급 앱 선택 그리드(4열) */}
      <section className="px-krds-8 pt-krds-9">
        <div className="grid grid-cols-4 gap-x-krds-3 gap-y-krds-8">
          {MOBILE_ID_APPS.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => handleSelectApp(app)}
              className="flex flex-col items-center gap-krds-3"
            >
              {/* 브랜드 로고 자리 — 실제 로고 에셋으로 교체 예정(중립 플레이스홀더) */}
              <span
                aria-hidden
                className="flex size-14 items-center justify-center rounded-krds-xl border border-krds-border-divider bg-krds-bg-secondary text-krds-body-sm font-bold text-krds-text-ink"
              >
                {app.logoStub}
              </span>
              <span className="text-center text-krds-body-xs leading-tight text-krds-text-ink">
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 안내문 + 사용 가이드 */}
      <section className="flex flex-col gap-krds-5 px-krds-8 pt-krds-9 pb-krds-8">
        <p className="flex items-start gap-krds-2 text-krds-body-sm leading-normal text-krds-text-muted">
          <Icon name="Campaign" size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span className="min-w-px flex-1 wrap-break-word">
            모바일 신분증을 발급받을 앱을 선택해주세요.
          </span>
        </p>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUsageGuide}
            className="flex items-center gap-krds-2 text-krds-body-md font-bold text-krds-text-primary"
          >
            <Icon name="DeveloperGuide" size={20} aria-hidden />
            사용 가이드
          </button>
        </div>
      </section>
    </>
  )
}
MobileIdntyCertPage.displayName = 'MobileIdntyCertPage'
