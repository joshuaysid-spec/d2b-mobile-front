// 조달(OP) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅 · 저장/제출은 useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
// queryKey 는 opKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useMutation, useQuery } from '@tanstack/react-query'
import { opService } from '@/services/op'
import type { OpListRequest, OpNotifyRequest, OpPlanDetail } from '@/types/op'

export const opKeys = {
  planList: (req: OpListRequest) => ['op', 'planList', req] as const,
  planDtl: (id: string) => ['op', 'planDtl', id] as const,
  itemSpecs: (id: string) => ['op', 'itemSpecs', id] as const,
  opinions: (id: string) => ['op', 'opinions', id] as const,
  specDtl: (id: string) => ['op', 'specDtl', id] as const,
  ovsPlanDtl: (id: string) => ['op', 'ovsPlanDtl', id] as const,
  ovsPlanResults: (id: string) => ['op', 'ovsPlanResults', id] as const,
}

/** 조달계획 통합목록 — 검색 확정값(appliedSearch)별 캐시. 키워드 세부 필터/페이징은 페이지 클라이언트 로직 유지. */
export function useOpPlanList(req: OpListRequest) {
  return useQuery({
    queryKey: opKeys.planList(req),
    queryFn: () => opService.getList(req),
  })
}

/** 조달계획 상세 — 목록에서 navigate state 로 넘어온 항목을 placeholder 로 즉시 렌더. */
export function useOpPlanDetail(id: string, placeholder?: OpPlanDetail) {
  return useQuery({
    queryKey: opKeys.planDtl(id),
    queryFn: () => opService.getDetail(id),
    placeholderData: placeholder,
    enabled: Boolean(id),
  })
}

/** 품목명세서 탭. */
export function useOpItemSpecs(id: string) {
  return useQuery({
    queryKey: opKeys.itemSpecs(id),
    queryFn: () => opService.getItemSpecs(id),
    enabled: Boolean(id),
  })
}

/** 업체의견 탭(조달계획·사전규격 공용). */
export function useOpOpinions(id: string) {
  return useQuery({
    queryKey: opKeys.opinions(id),
    queryFn: () => opService.getOpinions(id),
    enabled: Boolean(id),
  })
}

// ── 제출/액션 mutation 훅 — 페이지는 서비스 직접 import 없이 이 훅만 사용. ──

/** 조달계획 알림신청(MUI-OP-01 P05 NotiAply). */
export function useApplyNotify() {
  return useMutation({ mutationFn: (req: OpNotifyRequest) => opService.applyNotify(req) })
}
