// 입찰(BD) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: bdService(services/bds/bd.ts) · bdQueries(이 파일) · bdKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
// 조회는 useQuery 훅 · 저장/제출은 useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
// 무효화(invalidate)는 mutation 훅 onSuccess 에서 중앙 처리.
// (여기 훅은 실제로 소비하는 페이지 것만 둔다 — 투기적 훅 금지.)
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { bdService } from '@/services/bds/bd'
import { bdKeys } from '@/queries/bds/bd/keys'
import type { BidListSearchRequest, BidPbancDetail, BdopnItem, TndrSavePayload } from '@/types/bd'

export const bdQueries = {
  /** 입찰공고 통합목록 — 목업은 전체 반환, 키워드/페이징은 페이지 클라이언트 로직 유지. */
  useSelectPbancList(req?: BidListSearchRequest) {
    return useQuery({
      queryKey: bdKeys.selectPbancList(req),
      queryFn: () => bdService.selectPbancList(req),
    })
  },

  /** 입찰공고 상세 — 목록에서 navigate state 로 넘어온 항목을 placeholder 로 즉시 렌더. */
  useSelectPbancDtl(id: string, placeholder?: BidPbancDetail) {
    return useQuery({
      queryKey: bdKeys.selectPbancDtl(id),
      queryFn: () => bdService.selectPbancDtl(id),
      placeholderData: placeholder,
      enabled: Boolean(id),
    })
  },

  /** 입찰진행 목록(조달업체) — 목업 전체 반환, 검색/페이징은 페이지 클라이언트 로직 유지. */
  useSelectProgressList(req?: BidListSearchRequest) {
    return useQuery({
      queryKey: bdKeys.selectProgressList(req),
      queryFn: () => bdService.selectProgressList(req),
    })
  },

  /** 개찰목록 — 목업 전체 반환, 검색/페이징은 페이지 클라이언트 로직 유지. */
  useSelectBdopnList(req?: BidListSearchRequest) {
    return useQuery({
      queryKey: bdKeys.selectBdopnList(req),
      queryFn: () => bdService.selectBdopnList(req),
    })
  },

  /** 개찰(입찰결과) 상세 — 목록에서 넘어온 항목을 placeholder 로 즉시 렌더(없으면 id 조회). */
  useSelectBidRsltDtl(id: string, placeholder?: BdopnItem) {
    return useQuery({
      queryKey: bdKeys.selectBidRsltDtl(id),
      queryFn: () => bdService.selectBidRsltDtl(id),
      placeholderData: placeholder,
      enabled: Boolean(id),
    })
  },

  /** 입찰참가신청 품목목록(M06). */
  useSelectItemList(pbancNo: string, page = 1) {
    return useQuery({
      queryKey: bdKeys.selectItemList(pbancNo, page),
      queryFn: () => bdService.selectItemList(pbancNo, page),
      enabled: Boolean(pbancNo),
    })
  },

  /** 입찰서 품목목록(M02). */
  useSelectTndrItemList(pbancNo: string, page = 1) {
    return useQuery({
      queryKey: bdKeys.selectTndrItemList(pbancNo, page),
      queryFn: () => bdService.selectTndrItemList(pbancNo, page),
      enabled: Boolean(pbancNo),
    })
  },

  /** 전자서명 인증서 목록(M21). */
  useSelectElsgnCerts() {
    return useQuery({
      queryKey: bdKeys.selectElsgnCerts(),
      queryFn: () => bdService.selectElsgnCerts(),
    })
  },

  // ── 제출/액션 mutation 훅 — 페이지는 서비스 직접 import 없이 이 훅만 사용. ──

  /** 관심공고 등록/해제(MUI-BD-01-M03 즐겨찾기 토글) — 페이지가 낙관적 갱신/롤백 소유. */
  useToggleFavorite() {
    return useMutation({
      mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
        bdService.toggleFavorite(id, favorite),
    })
  },

  /** 전자서명(MUI-BD-04-M21) — 성공 시 진행목록 캐시 무효화(제출 성공 invalidate 규칙). */
  useSignElsgn() {
    return useMutation({
      mutationFn: ({ certId, pbancNo }: { certId: string; pbancNo: string }) =>
        bdService.signElsgn(certId, pbancNo),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: bdKeys.selectProgressListAll }),
    })
  },

  /** 서약서 저장(MUI-BD-04 WrotAgre). */
  useSaveWrot() {
    return useMutation({ mutationFn: (wrotId: string) => bdService.saveWrot(wrotId) })
  },

  /** 동의서 저장(입찰참가신청 Stp7). */
  useSaveAgreement() {
    return useMutation({
      mutationFn: ({ agreementId, choice }: { agreementId: string; choice?: string }) =>
        bdService.saveAgreement(agreementId, choice),
    })
  },

  /** 사전심사(PQ) 신청(MUI-BD-02-M01) — 성공 시 진행목록 캐시 무효화(신청 상태 변경). */
  useApplyBfhdSrng() {
    return useMutation({
      mutationFn: ({ pbancNo, fileGuids }: { pbancNo: string; fileGuids: string[] }) =>
        bdService.applyBfhdSrng(pbancNo, fileGuids),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: bdKeys.selectProgressListAll }),
    })
  },

  /** 입찰서 저장(MUI-BD-05 TndrWrt) — 성공 시 진행목록 캐시 무효화. */
  useSaveTndr() {
    return useMutation({
      mutationFn: (payload: TndrSavePayload) => bdService.saveTndr(payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: bdKeys.selectProgressListAll }),
    })
  },
}
