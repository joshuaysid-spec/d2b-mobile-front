// 조달(OP) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/op.ts)과 통일.
// 구조: ['op', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['op'])·함수 prefix 무효화 모두 가능.
// 훅 파일(opQueries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type { OpListRequest, PrcDataSearchRequest, WarSplInqRequest } from '@/types/op'

export const opKeys = {
  // 통합목록 — 실 API 는 검색유형별로 3개(no.1/no.5/no.13)라 키도 함수명 그대로 3개.
  selectPrcmPlanList: (req: OpListRequest) => ['op', 'selectPrcmPlanList', req] as const,
  selectBfhdSpcfctList: (req: OpListRequest) => ['op', 'selectBfhdSpcfctList', req] as const,
  selectAnlPrcmPlanList: (req: OpListRequest) => ['op', 'selectAnlPrcmPlanList', req] as const,

  selectPrcmPlanDtl: (id: string) => ['op', 'selectPrcmPlanDtl', id] as const,
  selectItemSpecs: (id: string) => ['op', 'selectItemSpecs', id] as const,
  selectBzentyOpnn: (id: string) => ['op', 'selectBzentyOpnn', id] as const,
  selectBfhdSpcfcDtl: (id: string) => ['op', 'selectBfhdSpcfcDtl', id] as const,
  selectOvsPrcmPlanDtl: (id: string) => ['op', 'selectOvsPrcmPlanDtl', id] as const,
  selectCnfgInfo: (req: WarSplInqRequest) => ['op', 'selectCnfgInfo', req] as const,
  selectIdntfInfo: (req: WarSplInqRequest) => ['op', 'selectIdntfInfo', req] as const,
  selectRefInfo: (req: WarSplInqRequest) => ['op', 'selectRefInfo', req] as const,
  selectPrdcrDtl: (prdctnCd: string) => ['op', 'selectPrdcrDtl', prdctnCd] as const,
  selectPrcDataListByItem: (req: PrcDataSearchRequest) =>
    ['op', 'selectPrcDataListByItem', req] as const,
}
