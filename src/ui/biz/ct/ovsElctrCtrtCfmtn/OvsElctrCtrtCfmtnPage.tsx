// 국외전자계약확정상세 (MUI-CT-01-M72). 설계서 03.계약 v0.83 slide146 참고사항
//   '일반현황·계좌정보·보증서·인지세·계약명세서 탭은 국외전자계약진행상세와 동일함' →
//   진행상세(M71)와 화면이 동일하므로 페이지를 재사용한다(CLAUDE.md '같은 구조 = 1페이지' — 위임).
// 확정 상태는 상세 조회 응답(elctrCtrtPrgrsSttsCd)으로 데이터 구동된다.
// 진입: 국외 계약통합목록 카드(국외 계약확정) 클릭 → 확정 전용 라우트로 이 페이지 진입(라우트 배선은 메인 세션).
import { OvsElctrCtrtPrgrsDtlPage } from '@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlPage'

export function OvsElctrCtrtCfmtnPage() {
  return <OvsElctrCtrtPrgrsDtlPage />
}
OvsElctrCtrtCfmtnPage.displayName = 'OvsElctrCtrtCfmtnPage'
