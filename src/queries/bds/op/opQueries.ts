// 조달(OP) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: opService(services/bds/op.ts) · opQueries(이 파일) · opKeys(opKeys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = opKeys(함수명 동일).
// 조회는 useQuery 훅 · 저장/제출은 useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
import { useMutation, useQuery } from '@tanstack/react-query'
import { opService } from '@/services/bds/op'
import { opKeys } from '@/queries/bds/op/opKeys'
import type {
  MockOpAnlPrcmPlanItem,
  MockOpListRequest,
  MockOpNotifyRequest,
  MockOpPlanDetail,
  MockPrcDataSearchRequest,
  MockWarSplInqRequest,
} from '@/types/mock/op'

// 통합목록(MUI-OP-01-M02)은 화면상 탭 하나짜리 목록이지만 실 API 는 검색유형별로 3개다
// (no.1 조달계획 / no.5 사전규격 / no.13 연간조달계획). 훅은 조건부 호출이 불가하므로
// 훅 하나가 srchType 으로 키·서비스 함수를 함께 고른다.
const PLAN_LIST_API = {
  plan: { key: opKeys.selectPrcmPlanList, fn: opService.selectPrcmPlanList },
  spec: { key: opKeys.selectBfhdSpcfctList, fn: opService.selectBfhdSpcfctList },
  annual: { key: opKeys.selectAnlPrcmPlanList, fn: opService.selectAnlPrcmPlanList },
}

export const opQueries = {
  /** 조달계획 통합목록 — 검색 확정값(appliedSearch)별 캐시. 키워드 세부 필터/페이징은 페이지 클라이언트 로직 유지. */
  useSelectPrcmPlanList(req: MockOpListRequest) {
    const api = PLAN_LIST_API[req.srchType]
    return useQuery({
      queryKey: api.key(req),
      queryFn: () => api.fn(req),
    })
  },

  /** 조달계획 상세 — 목록에서 navigate state 로 넘어온 항목을 placeholder 로 즉시 렌더. */
  useSelectPrcmPlanDtl(id: string, placeholder?: MockOpPlanDetail) {
    return useQuery({
      queryKey: opKeys.selectPrcmPlanDtl(id),
      queryFn: () => opService.selectPrcmPlanDtl(id),
      placeholderData: placeholder,
      enabled: Boolean(id),
    })
  },

  /** 품목명세서 탭. */
  useSelectItemSpecs(id: string) {
    return useQuery({
      queryKey: opKeys.selectItemSpecs(id),
      queryFn: () => opService.selectItemSpecs(id),
      enabled: Boolean(id),
    })
  },

  /** 국외 연간조달계획 상세(MUI-OP-01-M78) — 목록에서 navigate state 로 넘어온 항목을 placeholder 로 즉시 렌더. */
  useSelectOvsPrcmPlanDtl(id: string, placeholder?: MockOpAnlPrcmPlanItem) {
    return useQuery({
      queryKey: opKeys.selectOvsPrcmPlanDtl(id),
      queryFn: () => opService.selectOvsPrcmPlanDtl(id),
      placeholderData: placeholder,
      enabled: Boolean(id),
    })
  },

  /** 업체의견 탭(조달계획·사전규격 공용). ⚠️ 실 URL 미확정(no.8) — 실호출 모드에선 에러. */
  useSelectBzentyOpnn(id: string) {
    return useQuery({
      queryKey: opKeys.selectBzentyOpnn(id),
      queryFn: () => opService.selectBzentyOpnn(id),
      enabled: Boolean(id),
    })
  },

  // ── 목록정보조회(군수품 목록) — MUI-OP-01-T73/T74/T75/P77 ──────────────────
  // 탭마다 두 번 호출한다:
  //   ① 디폴트 — req.niin 없음. 해당 연간조달계획이 보유한 값(진입 시 표시).
  //   ② 검색   — req.niin 있음. 화면에서 디폴트 아래에 이어붙는다. NIIN 이 비면 enabled=false 로 미호출.
  // enabled 는 호출부가 Boolean(niin) 으로 넘긴다(같은 훅을 두 용도로 쓰기 위함).

  /** 형상자료(T73) — 식별정보 + 참조번호. */
  useSelectCnfgInfo(req: MockWarSplInqRequest, enabled = true) {
    return useQuery({
      queryKey: opKeys.selectCnfgInfo(req),
      queryFn: () => opService.selectCnfgInfo(req),
      enabled,
    })
  },

  /** 식별자료(T74). */
  useSelectIdntfInfo(req: MockWarSplInqRequest, enabled = true) {
    return useQuery({
      queryKey: opKeys.selectIdntfInfo(req),
      queryFn: () => opService.selectIdntfInfo(req),
      enabled,
    })
  },

  /** 참고자료(T75). */
  useSelectRefInfo(req: MockWarSplInqRequest, enabled = true) {
    return useQuery({
      queryKey: opKeys.selectRefInfo(req),
      queryFn: () => opService.selectRefInfo(req),
      enabled,
    })
  },

  /** 업체정보(P77) — 참조번호의 생산자부호로 조회. 시트가 열릴 때만(prdctnCd 존재) 호출. */
  useSelectPrdcrDtl(prdctnCd: string) {
    return useQuery({
      queryKey: opKeys.selectPrdcrDtl(prdctnCd),
      queryFn: () => opService.selectPrdcrDtl(prdctnCd),
      enabled: Boolean(prdctnCd),
    })
  },

  /** 품목별 가격자료(P75) — 검색 확정값(applied)이 있을 때만 호출(enabled 는 호출부가 넘김). */
  useSelectPrcDataListByItem(req: MockPrcDataSearchRequest, enabled = true) {
    return useQuery({
      queryKey: opKeys.selectPrcDataListByItem(req),
      queryFn: () => opService.selectPrcDataListByItem(req),
      enabled,
    })
  },

  // ── 제출/액션 mutation 훅 — 페이지는 서비스 직접 import 없이 이 훅만 사용. ──

  /** 공고게시알림 신청(MUI-OP-01-P10 PrcmPlan_NotiAply). */
  useSavePbancPstgNotiAply() {
    return useMutation({
      mutationFn: (req: MockOpNotifyRequest) => opService.savePbancPstgNotiAply(req),
    })
  },
}
