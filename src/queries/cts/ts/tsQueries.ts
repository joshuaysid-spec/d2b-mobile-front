// 업무지원(TS) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: tsService(services/cts/ts.ts) · tsQueries(이 파일) · tsKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
// 조회 = useQuery 훅 · 저장/제출 = useMutation 훅(핸들러에서 mutateAsync + try/catch).
// 제출 성공 시 영향받는 조회 캐시 무효화는 mutation onSuccess 에서 중앙 처리(전역 staleTime 대응).
import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { tsService } from '@/services/cts/ts'
import { tsKeys } from '@/queries/cts/ts/tsKeys'
import type {
  BfhdLoiListRequest,
  BfhdLoiOpnnRequest,
  TxivCtrtListRequest,
  TxivPrgrsPrstRequest,
} from '@/types/ts'

export const tsQueries = {
  /** 사전의향서목록(M01). */
  useSelectBfhdLoiList(req: BfhdLoiListRequest = {}) {
    return useQuery({
      queryKey: tsKeys.selectBfhdLoiList(req),
      queryFn: () => tsService.selectBfhdLoiList(req),
    })
  },

  /** 사전의향서상세(M02). */
  useSelectBfhdLoiDtl(id: string) {
    return useQuery({
      queryKey: tsKeys.selectBfhdLoiDtl(id),
      queryFn: () => tsService.selectBfhdLoiDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 품목명세서 목록(T02). */
  useSelectBfhdLoiSpcfctList(id: string) {
    return useQuery({
      queryKey: tsKeys.selectBfhdLoiSpcfctList(id),
      queryFn: () => tsService.selectBfhdLoiSpcfctList(id),
      enabled: Boolean(id),
    })
  },

  /** 세금계산서계약목록(TS-04 M01). */
  useSelectCtrtList(req: TxivCtrtListRequest = {}) {
    return useQuery({
      queryKey: tsKeys.selectCtrtList(req),
      queryFn: () => tsService.selectCtrtList(req),
    })
  },

  /** 세금계산서목록(TS-04 P02) — 바텀시트 열릴 때만 조회. */
  useSelectTxivList(ctrtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: tsKeys.selectTxivList(ctrtNo),
      queryFn: () => tsService.selectTxivList(ctrtNo),
      enabled: Boolean(ctrtNo) && enabled,
    })
  },

  /** 세금계산서상세(TS-04 M03). */
  useSelectTxivDtl(id: string) {
    return useQuery({
      queryKey: tsKeys.selectTxivDtl(id),
      queryFn: () => tsService.selectTxivDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 세금계산서진행현황(TS-04 M04). */
  useSelectTxivPrgrsPrstList(req: TxivPrgrsPrstRequest = {}) {
    return useQuery({
      queryKey: tsKeys.selectTxivPrgrsPrstList(req),
      queryFn: () => tsService.selectTxivPrgrsPrstList(req),
    })
  },

  /**
   * 의견작성 임시저장(P03) — 성공 시 품목명세서(기 작성 내역 반영)·목록(진행상태 뱃지) 캐시 무효화
   * (slide14: 임시저장/제출 클릭 시 본 화면에 내용 반영).
   */
  useSaveMnftrPrchsOpnnInpt() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (req: BfhdLoiOpnnRequest) => tsService.saveMnftrPrchsOpnnInpt(req),
      onSuccess: (_data, req) => invalidateBfhdLoi(queryClient, req.bfhdLoiNo),
    })
  },

  /** 사전의향서 제출(P03) — 무효화 대상은 임시저장과 동일. */
  useSaveBfhdLoiSbmsn() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (req: BfhdLoiOpnnRequest) => tsService.saveBfhdLoiSbmsn(req),
      onSuccess: (_data, req) => invalidateBfhdLoi(queryClient, req.bfhdLoiNo),
    })
  },
}

/** 의견 저장/제출 후 공통 무효화(품목명세서·상세·목록). */
function invalidateBfhdLoi(queryClient: QueryClient, bfhdLoiNo: string) {
  queryClient.invalidateQueries({ queryKey: tsKeys.selectBfhdLoiSpcfctList(bfhdLoiNo) })
  queryClient.invalidateQueries({ queryKey: tsKeys.selectBfhdLoiDtl(bfhdLoiNo) })
  queryClient.invalidateQueries({ queryKey: tsKeys.selectBfhdLoiListAll })
}
