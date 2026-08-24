// MUI-CM-03-M17 PC QR 로그인 (Figma 10020:87652)
// PC 화면에 표시된 QR 코드를 모바일 앱 카메라로 스캔해 PC(웹) 로그인을 처리하는 화면.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/pc-qr, handle: header variant='sub' title='PC QR 로그인').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 구성(Figma 위→아래, 헤더 제외):
//   - Overlay_Area: 카메라 프리뷰 위에 덮이는 어두운 스크림(Subtract bg) 전면 배경.
//   - QR_Scanner_Frame(280x280): 중앙 스캐너 가이드 — 4개 흰색 코너 브래킷.
//     안쪽 사각형 = 실제로는 카메라 스트림이 비치는 투명 영역, 목업에선 밝은 회색 플레이스홀더.
//   - 안내 문구(흰색 볼드): "카메라에 PC 화면 QR 코드를 스캔해주세요."(설계서/Figma 문구 그대로)
//
// 디자인/설계서 메모(보고 대상):
//   - 화면설계서(로그인 slide 추출본)에 MUI-CM-03-M17 항목이 없어(M01~M09·P10~P13·M14·M15·M20만 존재)
//     문구/구성은 Figma(10020:87652) 기준으로 반영. 필드/코드값 정의는 설계서 확정 시 보강 필요.
//   - 카메라 프리뷰의 어두운 스크림·밝은 프리뷰 색은 순수 카메라 배경으로, 대응하는 KRDS 색 토큰이
//     없어 표준 Tailwind neutral 로 근사(bg-neutral-600 / bg-neutral-300). 실제 연동 시 <video> 로 대체.
//   - 카메라 스캔은 미연동 목업 — 프레임 안은 정적 플레이스홀더.
export function PcQRLgnPage() {
  // 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
  // 카메라 프리뷰 전면 배경이라 콘텐츠 높이가 뷰포트를 채우도록 min-h-full 로 스크롤 영역을 가득 채운다.
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-krds-9 bg-neutral-600 px-krds-8 py-krds-14">
      {/* QR 스캐너 프레임(280x280) — 4개 흰색 코너 브래킷 + 카메라 프리뷰 자리 */}
      <div className="relative size-70 shrink-0">
        {/* 카메라 프리뷰 자리(목업). 실제로는 <video> 카메라 스트림이 이 영역에 렌더됨.
            // 추후: QR 스캔 — 후면 카메라 스트림 연결 + QR 디코드(예: cmService.procQrLogin) */}
        <div aria-hidden className="absolute inset-0 rounded-krds-xl bg-neutral-300" />
        {/* 코너 브래킷 4개 — 흰색 L자 가이드 */}
        <span
          aria-hidden
          className="absolute left-0 top-0 size-10 rounded-tl-krds-xl border-l-4 border-t-4 border-white"
        />
        <span
          aria-hidden
          className="absolute right-0 top-0 size-10 rounded-tr-krds-xl border-r-4 border-t-4 border-white"
        />
        <span
          aria-hidden
          className="absolute bottom-0 left-0 size-10 rounded-bl-krds-xl border-b-4 border-l-4 border-white"
        />
        <span
          aria-hidden
          className="absolute bottom-0 right-0 size-10 rounded-br-krds-xl border-b-4 border-r-4 border-white"
        />
      </div>

      {/* 안내 문구 */}
      <p className="text-center text-krds-body-md font-bold leading-normal text-white wrap-break-word">
        카메라에 PC 화면 QR 코드를 스캔해주세요.
      </p>
    </div>
  )
}
PcQRLgnPage.displayName = 'PcQRLgnPage'
