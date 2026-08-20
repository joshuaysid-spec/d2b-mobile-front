// MUI-CM-03-P21 통합로그인 계정등록안내 (설계서 00.공통 v0.86 slide33)
// 구버전 아이디로 로그인한 조달업체 사용자에게 통합 로그인 계정 등록을 안내하는 팝업 콘텐츠.
// 컨테이너(AlertModal)는 부모(로그인 페이지, IdPswdLoginPage)가 소유하고, 이 컴포넌트는 본문만 렌더한다
// (CLAUDE.md: BottomSheet/AlertModal 전용 래퍼 금지 — 콘텐츠만 분리). AlertModal 의 description 슬롯에 주입.
//   부모 배선: title='통합 로그인 계정 등록 안내' · secondary='취소' · primary='통합 로그인 계정 등록'(→ M22 이동).

export function NewIdChgInfo() {
  // 설계서 slide33 안내 문구 그대로.
  return (
    <span className="block">
      국방전자조달시스템에서 통합 로그인 계정을 도입합니다.
      <br />
      기존 아이디로 로그인하신 조달업체 사용자께서는 원활한 서비스 사용을 위해서 통합 로그인 계정을 새로
      등록해 주시길 바랍니다.
    </span>
  )
}
NewIdChgInfo.displayName = 'NewIdChgInfo'
