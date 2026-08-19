// 조달(OP) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/op.ts)과 통일.
// 구조: ['op', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['op'])·함수 prefix 무효화 모두 가능.
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type { OpListRequest, PrcDataSearchRequest, WarSplInqRequest } from '@/types/op'

export const opKeys = {
  selectPlanList: (req: OpListRequest) => ['op', 'selectPlanList', req] as const,
  selectPlanDtl: (id: string) => ['op', 'selectPlanDtl', id] as const,
  selectItemSpecs: (id: string) => ['op', 'selectItemSpecs', id] as const,
  selectOpinions: (id: string) => ['op', 'selectOpinions', id] as const,
  selectSpecDtl: (id: string) => ['op', 'selectSpecDtl', id] as const,
  selectOvsPlanDtl: (id: string) => ['op', 'selectOvsPlanDtl', id] as const,
  selectWarSplCnfg: (req: WarSplInqRequest) => ['op', 'selectWarSplCnfg', req] as const,
  selectWarSplIdntf: (req: WarSplInqRequest) => ['op', 'selectWarSplIdntf', req] as const,
  selectWarSplRef: (req: WarSplInqRequest) => ['op', 'selectWarSplRef', req] as const,
  selectWarSplBzEnty: (prdctnCd: string) => ['op', 'selectWarSplBzEnty', prdctnCd] as const,
  selectPrcDataList: (req: PrcDataSearchRequest) => ['op', 'selectPrcDataList', req] as const,
}
