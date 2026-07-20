// 입찰(BD) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅, 저장/제출은 페이지 핸들러에서 서비스 직접 await(useMutation 미도입).
// queryKey 는 bdKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
// (여기 훅은 실제로 소비하는 페이지 것만 둔다 — 투기적 훅 금지.)
import { useQuery } from '@tanstack/react-query'
import { bdService } from '@/services/bd'
import type { BidListSearchRequest, BidPbancDetail, BdopnItem } from '@/types/bd'

export const bdKeys = {
  pbancList: (req?: BidListSearchRequest) => ['bd', 'pbancList', req] as const,
  pbancDtl: (id: string) => ['bd', 'pbancDtl', id] as const,
  progressList: (req?: BidListSearchRequest) => ['bd', 'progressList', req] as const,
  bdopnList: (req?: BidListSearchRequest) => ['bd', 'bdopnList', req] as const,
  bidRsltDtl: (id: string) => ['bd', 'bidRsltDtl', id] as const,
  itemList: (pbancNo: string, page: number) => ['bd', 'itemList', pbancNo, page] as const,
  tndrItemList: (pbancNo: string, page: number) => ['bd', 'tndrItemList', pbancNo, page] as const,
  elsgnCerts: () => ['bd', 'elsgnCerts'] as const,
}

/** 입찰공고 통합목록 — 목업은 전체 반환, 키워드/페이징은 페이지 클라이언트 로직 유지. */
export function useBidPbancList(req?: BidListSearchRequest) {
  return useQuery({
    queryKey: bdKeys.pbancList(req),
    queryFn: () => bdService.getList(req),
  })
}

/** 입찰공고 상세 — 목록에서 navigate state 로 넘어온 항목을 placeholder 로 즉시 렌더. */
export function useBidPbancDetail(id: string, placeholder?: BidPbancDetail) {
  return useQuery({
    queryKey: bdKeys.pbancDtl(id),
    queryFn: () => bdService.getDetail(id),
    placeholderData: placeholder,
    enabled: Boolean(id),
  })
}

/** 입찰진행 목록(조달업체) — 목업 전체 반환, 검색/페이징은 페이지 클라이언트 로직 유지. */
export function useBidProgressList(req?: BidListSearchRequest) {
  return useQuery({
    queryKey: bdKeys.progressList(req),
    queryFn: () => bdService.getBidProgressList(req),
  })
}

/** 개찰목록 — 목업 전체 반환, 검색/페이징은 페이지 클라이언트 로직 유지. */
export function useBdopnList(req?: BidListSearchRequest) {
  return useQuery({
    queryKey: bdKeys.bdopnList(req),
    queryFn: () => bdService.getBdopnList(req),
  })
}

/** 개찰(입찰결과) 상세 — 목록에서 넘어온 항목을 placeholder 로 즉시 렌더(없으면 id 조회). */
export function useBidRsltDetail(id: string, placeholder?: BdopnItem) {
  return useQuery({
    queryKey: bdKeys.bidRsltDtl(id),
    queryFn: () => bdService.getBidRsltDetail(id),
    placeholderData: placeholder,
    enabled: Boolean(id),
  })
}

/** 입찰참가신청 품목목록(M06). */
export function useBidItemList(pbancNo: string, page = 1) {
  return useQuery({
    queryKey: bdKeys.itemList(pbancNo, page),
    queryFn: () => bdService.getBidItemList(pbancNo, page),
    enabled: Boolean(pbancNo),
  })
}

/** 입찰서 품목목록(M02). */
export function useBidTndrItemList(pbancNo: string, page = 1) {
  return useQuery({
    queryKey: bdKeys.tndrItemList(pbancNo, page),
    queryFn: () => bdService.getBidTndrItemList(pbancNo, page),
    enabled: Boolean(pbancNo),
  })
}

/** 전자서명 인증서 목록(M21). */
export function useElsgnCertList() {
  return useQuery({
    queryKey: bdKeys.elsgnCerts(),
    queryFn: () => bdService.getElsgnCertList(),
  })
}
