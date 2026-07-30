// 공통관리(CM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅 · 저장/제출은 useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
// queryKey 는 cmKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useMutation, useQuery } from '@tanstack/react-query'
import { cmService, prfmncPrdocService } from '@/services/cm'

export const cmKeys = {
  /** 실적증명서 제출 협회 목록(MUI-CM-04-P20). */
  sbmsnAsctnList: (prfmncRcptNo: string) => ['cm', 'sbmsnAsctnList', prfmncRcptNo] as const,
}

/**
 * 실적증명서 제출 — 제출 협회 목록(dl_sbmsnAsctnList) 조회.
 * slide336 On-Load(scwin.onpageload). 제출 시트가 열릴 때만 조회한다(enabled).
 */
export function useSbmsnAsctnList(prfmncRcptNo: string, enabled = true) {
  return useQuery({
    queryKey: cmKeys.sbmsnAsctnList(prfmncRcptNo),
    queryFn: () => prfmncPrdocService.getSbmsnAsctnList(prfmncRcptNo),
    enabled: enabled && !!prfmncRcptNo,
  })
}

// ── 제출/액션 mutation 훅 — 페이지는 서비스 직접 import 없이 이 훅만 사용. ──

/** 통합검색(전체메뉴 M12) — 이벤트성 조회라 mutation 훅으로 노출. */
export function useSearchAll() {
  return useMutation({ mutationFn: (keyword: string) => cmService.searchAll(keyword) })
}

/** 실적증명서 제출(MUI-CM-04-P20). */
export function usePrfmncSubmit() {
  return useMutation({
    mutationFn: (params: { prfmncRcptNo: string; sbmsnSttsNms: string[] }) =>
      prfmncPrdocService.submit(params),
  })
}

/** 실적증명서 제출취소(MUI-CM-04-P20) — 비고(rmrkCn)에 취소사유를 담아 재전송. */
export function usePrfmncCancelSubmit() {
  return useMutation({
    mutationFn: (params: {
      prfmncRcptNo: string
      items: { sbmsnSttsNm: string; rmrkCn?: string }[]
    }) => prfmncPrdocService.cancelSubmit(params),
  })
}
