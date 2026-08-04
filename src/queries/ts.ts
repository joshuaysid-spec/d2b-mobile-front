// 업무지원(TS) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회 = useQuery 훅 · 저장/제출 = useMutation 훅(핸들러에서 mutateAsync + try/catch).
// 제출 성공 시 영향받는 조회 캐시 무효화는 mutation onSuccess 에서 중앙 처리(전역 staleTime 대응).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tsService } from '@/services/ts'
import type { BfhdLoiListRequest, BfhdLoiOpnnRequest } from '@/types/ts'

export const tsKeys = {
  bfhdLoiList: (req: BfhdLoiListRequest) => ['ts', 'bfhdLoiList', req] as const,
  /** 목록 prefix — 의견 저장/제출 후 무효화용. */
  bfhdLoiListAll: ['ts', 'bfhdLoiList'] as const,
  bfhdLoiDtl: (id: string) => ['ts', 'bfhdLoiDtl', id] as const,
  bfhdLoiSpcfcts: (id: string) => ['ts', 'bfhdLoiSpcfcts', id] as const,
}

/** 사전의향서목록(M01). */
export function useBfhdLoiList(req: BfhdLoiListRequest = {}) {
  return useQuery({
    queryKey: tsKeys.bfhdLoiList(req),
    queryFn: () => tsService.getBfhdLoiList(req),
  })
}

/** 사전의향서상세(M02). */
export function useBfhdLoiDtl(id: string) {
  return useQuery({
    queryKey: tsKeys.bfhdLoiDtl(id),
    queryFn: () => tsService.getBfhdLoiDtl(id),
    enabled: Boolean(id),
  })
}

/** 품목명세서 목록(T02). */
export function useBfhdLoiSpcfcts(id: string) {
  return useQuery({
    queryKey: tsKeys.bfhdLoiSpcfcts(id),
    queryFn: () => tsService.getBfhdLoiSpcfcts(id),
    enabled: Boolean(id),
  })
}

/**
 * 의견작성 임시저장/제출(P03) — 성공 시 품목명세서(기 작성 내역 반영)·목록(진행상태 뱃지) 캐시 무효화
 * (slide14: 임시저장/제출 클릭 시 본 화면에 내용 반영).
 */
export function useSaveBfhdLoiOpnn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: BfhdLoiOpnnRequest) => tsService.saveBfhdLoiOpnn(req),
    onSuccess: (_data, req) => {
      queryClient.invalidateQueries({ queryKey: tsKeys.bfhdLoiSpcfcts(req.bfhdLoiNo) })
      queryClient.invalidateQueries({ queryKey: tsKeys.bfhdLoiDtl(req.bfhdLoiNo) })
      queryClient.invalidateQueries({ queryKey: tsKeys.bfhdLoiListAll })
    },
  })
}
