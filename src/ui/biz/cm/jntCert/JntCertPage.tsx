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
//   - 뱃지(80px 흰 배경 + #c1d1ee 보더 + 파란 점 데코)는 아이디찾기 결과(IdRsltPage)와 동일 정형.
//     방패/체크 글리프는 공동인증서 원본 SVG(jntCertIcon.svg — 2026-08-03 VerifiedUser 근사 교체).
//     원형'!' 는 Error 글리프 근사(m_empty data 패턴).
//   - CTA 는 min-h-full flex 로 화면 최하단 배치(Figma, 2026-08-03 페이지 전환 정합).
//   - '인증서 가져오기'·인증 진행은 미연동 — console.log 경계 스텁.
import { Button } from '@/ui/common/base/Button'
import jntCertBadgeIcon from '@/assets/images/jntCertBadgeIcon.svg'
import alertErrorIcon from '@/assets/images/alertErrorIcon.svg'

/** 공동인증서 안내/진입 — JntCertPage 콘텐츠.
 *  (구 로그인 방식선택 BottomSheet 공용 — 2026-08-03 페이지 전환으로 시트 사용처 제거,
 *   plan: cm-jnt-cert-p12-page. onSuccess 는 공동인증 SDK 연동 시 성공 후 이동용으로 유지.) */
export function JntCert({ onSuccess }: { onSuccess?: () => void }) {
  const handleImportCert = () => {
    console.log('[JntCert] 인증서 가져오기') // 추후: 공동인증 SDK(Any-ID 공동인증 프로세스 호출)
    onSuccess?.()
  }

  // 안내 영역은 중앙 정렬 + 하단 CTA. 바깥 패딩(px/pb)은 호스트(페이지 래퍼)가 소유.
  // ⚠️ min-h-full 을 중첩하면 부모(section) height 가 auto 라 % 가 풀리지 않아 중앙정렬/하단 고정이
  //    동작 안 함 → flex-1 로 페이지 래퍼(min-h-full flex-col)의 높이를 그대로 채운다.
  return (
    <div className="flex flex-1 flex-col">
      {/* 안내 영역(중앙) — 뱃지 + 타이틀 + '인증서 없음' 카드 (그룹 간 24px) */}
      <div className="flex flex-1 flex-col items-center justify-center gap-krds-10 py-krds-8">
        <div className="flex flex-col items-center gap-krds-7">
          {/* 공동인증서 뱃지 — 80px 흰 배경 + border-field(#c1d1ee) 1.33px + radius 27 +
              파란 점 데코(24px) 위에 공동인증서 원본 글리프 50px (Figma 10020:87163) */}
          <div className="relative flex size-20 items-center justify-center rounded-[27px] border-[1.33px] border-krds-border-field bg-background">
            {/* 점 데코는 글리프 좌상단(15,15) 정렬 — Figma 10020:87169 실측 */}
            <span
              aria-hidden
              className="absolute left-[15px] top-[15px] size-6 rounded-full bg-krds-border-primary-soft"
            />
            {/* 배지 글리프 — 50px 남색(#0F316E) 전용 인스턴스(10020:87170) 원본 SVG */}
            <img src={jntCertBadgeIcon} alt="" aria-hidden className="relative size-[50px]" />
          </div>

          {/* 타이틀 — 24px Bold */}
          <h1 className="text-center text-[24px] font-bold leading-normal text-krds-text-ink">
            공동인증서
          </h1>
        </div>

        {/* 인증서 없음 안내 카드 — bg-primary-faint · radius 8 · p 20 + m_empty data
            (alert_error 원본 SVG 30px + 17 Medium ink) */}
        <div className="flex w-full flex-col items-center gap-krds-5 rounded-krds-8 bg-krds-bg-primary-faint p-krds-9">
          <img src={alertErrorIcon} alt="" aria-hidden className="size-[30px]" />
          <p className="text-center text-krds-body-md font-medium leading-normal text-krds-text-ink wrap-break-word">
            인증서가 없습니다.
          </p>
        </div>
      </div>

      {/* 하단 CTA — 화면 최하단(Figma) */}
      <Button type="button" className="w-full" onClick={handleImportCert}>
        인증서 가져오기
      </Button>
    </div>
  )
}
JntCert.displayName = 'JntCert'

// 페이지(라우트 /login/joint-cert) — 로그인 방식선택의 '공동인증서' 카드가 이 페이지로 이동
// (2026-08-03 바텀시트 → 페이지 전환). min-h-full 로 CTA 최하단 배치, 이중 패딩 없이 px/pb 만 소유.
export function JntCertPage() {
  return (
    <section className="flex min-h-full flex-col px-krds-8 pb-krds-8">
      <JntCert />
    </section>
  )
}
JntCertPage.displayName = 'JntCertPage'
