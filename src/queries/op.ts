// 조달(OP) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅 · 저장/제출은 useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
// queryKey 는 opKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useMutation, useQuery } from '@tanstack/react-query'
import { opService } from '@/services/op'
import type {
  OpListRequest,
  OpNotifyRequest,
  OpPlanDetail,
  WarSplInqRequest,
} from '@/types/op'

export const opKeys = {
  planList: (req: OpListRequest) => ['op', 'planList', req] as const,
  planDtl: (id: string) => ['op', 'planDtl', id] as const,
  itemSpecs: (id: string) => ['op', 'itemSpecs', id] as const,
  opinions: (id: string) => ['op', 'opinions', id] as const,
  specDtl: (id: string) => ['op', 'specDtl', id] as const,
  ovsPlanDtl: (id: string) => ['op', 'ovsPlanDtl', id] as const,
  ovsPlanResults: (id: string) => ['op', 'ovsPlanResults', id] as const,
  warSplCnfg: (req: WarSplInqRequest) => ['op', 'warSplCnfg', req] as const,
  warSplIdntf: (req: WarSplInqRequest) => ['op', 'warSplIdntf', req] as const,
  warSplRef: (req: WarSplInqRequest) => ['op', 'warSplRef', req] as const,
  warSplBzEnty: (prdctnCd: string) => ['op', 'warSplBzEnty', prdctnCd] as const,
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

// ── 목록정보조회(군수품 목록) — MUI-OP-01-T73/T74/T75/P77 ──────────────────
// 탭마다 두 번 호출한다:
//   ① 디폴트 — req.niin 없음. 해당 연간조달계획이 보유한 값(진입 시 표시).
//   ② 검색   — req.niin 있음. 화면에서 디폴트 아래에 이어붙는다. NIIN 이 비면 enabled=false 로 미호출.
// enabled 는 호출부가 Boolean(niin) 으로 넘긴다(같은 훅을 두 용도로 쓰기 위함).

/** 형상자료(T73) — 식별정보 + 참조번호. */
export function useWarSplCnfg(req: WarSplInqRequest, enabled = true) {
  return useQuery({
    queryKey: opKeys.warSplCnfg(req),
    queryFn: () => opService.getWarSplCnfg(req),
    enabled,
  })
}

/** 식별자료(T74). */
export function useWarSplIdntf(req: WarSplInqRequest, enabled = true) {
  return useQuery({
    queryKey: opKeys.warSplIdntf(req),
    queryFn: () => opService.getWarSplIdntf(req),
    enabled,
  })
}

/** 참고자료(T75). */
export function useWarSplRef(req: WarSplInqRequest, enabled = true) {
  return useQuery({
    queryKey: opKeys.warSplRef(req),
    queryFn: () => opService.getWarSplRef(req),
    enabled,
  })
}

/** 업체정보(P77) — 참조번호의 생산자부호로 조회. 시트가 열릴 때만(prdctnCd 존재) 호출. */
export function useWarSplBzEnty(prdctnCd: string) {
  return useQuery({
    queryKey: opKeys.warSplBzEnty(prdctnCd),
    queryFn: () => opService.getWarSplBzEnty(prdctnCd),
    enabled: Boolean(prdctnCd),
  })
}

// ── 제출/액션 mutation 훅 — 페이지는 서비스 직접 import 없이 이 훅만 사용. ──

/** 조달계획 알림신청(MUI-OP-01 P05 NotiAply). */
export function useApplyNotify() {
  return useMutation({ mutationFn: (req: OpNotifyRequest) => opService.applyNotify(req) })
}
