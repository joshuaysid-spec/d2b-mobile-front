// MUI-CM-03-P12 공동인증 (공동인증서) (설계서 로그인 slide52 p51 / Figma 10020:87163)
// 'Any-ID 공동인증 프로세스 호출' — 공동인증서(구 공인인증서)로 로그인하는 인증 솔루션 화면.
// 설계서: "솔루션 화면에 따름 · 인증서 유무에 따라 표출 화면이 달라짐". Figma 는 '인증서 없음' 상태를 표기.
// 셸(AppLayout) 안 화면 — 헤더(sub, '공동인증서')/스크롤/뒤로가기는 AppLayout(라우트 코디네이터)이 소유.
// 페이지는 콘텐츠만 렌더(/login/joint-cert 배선은 코디네이터가 담당).
//
// 구성(Figma 위→아래, 헤더 제외):
//   - 중앙: 공동인증서 뱃지(둥근 사각 배경 + 방패/체크 아이콘) + '공동인증서' 타이틀
//   - 안내 카드(연파랑): 원형 '!' 아이콘 + '인증서가 없습니다.'  ← 인증서 미보유 상태
//   - 하단 CTA(전폭 primary): '인증서 가져오기'
//
// 디자인/설계서 메모(보고 대상):
//   - 이 화면은 Any-ID 공동인증 SDK(솔루션) 진입점이다. '인증서 선택 목록 + 비밀번호 입력'은
//     인증서 보유 시 SDK 솔루션 화면이 처리하며 Figma(10020:87163)엔 '인증서 없음' 상태만 그려져
//     그대로 구현. (인증서 보유 변형·비밀번호 입력은 SDK 연동 시점에 보강)
//   - 공동인증서 뱃지/원형'!' 아이콘은 KRDS 별도제작 에셋 — 폰트 REGISTRY 미등록 → 의미가 가까운
//     Material Symbols(VerifiedUser / Error)로 근사(각 TODO).
//   - Figma 는 하단 CTA 를 화면 최하단 고정(full-bleed)으로 표기하나, 셸(AppLayout)이 스크롤을
//     소유하고 코드베이스에 sticky 바텀바 선례가 없어 콘텐츠 말미 전폭 버튼으로 렌더(로그인 플로우 컨벤션).
//   - '인증서 가져오기'·인증 진행은 미연동 — console.log 경계 스텁.
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'

/** 공동인증서 안내/진입 — BottomSheet 콘텐츠(로그인 방식선택에서 열림) + 페이지 공용. */
export function JntCert() {
  const handleImportCert = () => {
    console.log('[JntCert] 인증서 가져오기') // 추후: 공동인증 SDK(Any-ID 공동인증 프로세스 호출)
  }

  // 안내 영역은 중앙 정렬 + 하단 CTA. 바깥 패딩(px/pt/pb)은 호스트(BottomSheet/페이지 래퍼)가 소유.
  return (
    <div className="flex min-h-full flex-col">
      {/* 안내 영역(중앙) — 뱃지 + 타이틀 + '인증서 없음' 카드 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-krds-8">
        {/* 공동인증서 뱃지 — 둥근 사각 배경 + 방패/체크 아이콘 */}
        <div className="flex size-20 items-center justify-center rounded-krds-xl bg-krds-bg-primary-faint">
          {/* TODO(디자인 에셋): 공동인증서 별도제작 아이콘 — REGISTRY 미등록, VerifiedUser 로 근사 */}
          <Icon
            name="VerifiedUser"
            size={44}
            fill={1}
            className="text-krds-text-primary"
            aria-hidden
          />
        </div>

        {/* 타이틀 */}
        <h1 className="text-krds-heading-sm font-bold leading-normal text-krds-text-ink">
          공동인증서
        </h1>

        {/* 인증서 없음 안내 카드 */}
        <div className="flex w-full flex-col items-center gap-krds-3 rounded-krds-xl bg-krds-bg-primary-faint px-krds-8 py-krds-10">
          {/* TODO(디자인 에셋): 원형 안내 아이콘 — REGISTRY 미등록, Error(원형 '!')로 근사 */}
          <Icon name="Error" size={28} className="text-krds-text-muted" aria-hidden />
          <p className="text-krds-body-md leading-normal text-krds-text-muted wrap-break-word">
            인증서가 없습니다.
          </p>
        </div>
      </div>

      {/* 하단 CTA — Figma 는 최하단 고정 표기이나 콘텐츠 말미 전폭 버튼으로 렌더 */}
      <Button type="button" size="lg" className="mt-krds-9 w-full" onClick={handleImportCert}>
        인증서 가져오기
      </Button>
    </div>
  )
}
JntCert.displayName = 'JntCert'

// 페이지(라우트 /login/joint-cert) — 직접 진입 시 셸 안 콘텐츠로. (기본은 로그인 방식선택의 BottomSheet)
export function JntCertPage() {
  return (
    <section className="flex flex-col gap-krds-9 px-krds-8 pt-krds-9 pb-krds-8">
      <JntCert />
    </section>
  )
}
JntCertPage.displayName = 'JntCertPage'
