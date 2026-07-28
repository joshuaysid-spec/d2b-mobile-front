// 물품전자계약확정상세 (MUI-CT-01-M04). 설계서 03.계약 v0.83 slide33 참고사항
//   '물품전자계약진행상세와 화면이 동일함' → 진행상세(M03)와 100% 동일 화면이므로 페이지를 재사용한다
//   (CLAUDE.md '같은 구조 = 1페이지' 원칙 — 렌더링을 복제하지 않고 위임).
// 확정 상태는 상세 조회 응답(ctrtStatNm='계약확정')으로 데이터 구동되며, 이때 M03 페이지 내부에서
//   바로가기 '계약명세서'가 P12 물품최종계약명세서(CmdtyLastCtrdocDtst)로 분기된다.
// 진입: 계약통합목록 카드(물품 계약확정) 클릭 → 확정 전용 라우트로 이 페이지 진입(라우트 배선은 메인 세션).
import { CmdtyElctrCtrtPrgrsDtlPage } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtlPage'

export function CmdtyElctrCtrtCfmtnDtlPage() {
  return <CmdtyElctrCtrtPrgrsDtlPage />
}
CmdtyElctrCtrtCfmtnDtlPage.displayName = 'CmdtyElctrCtrtCfmtnDtlPage'
