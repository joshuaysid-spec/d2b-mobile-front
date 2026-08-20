// 입찰(BD) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/bd.ts)과 통일.
// 구조: ['bd', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['bd'])·함수 prefix 무효화 모두 가능.
// 훅 파일(bdQueries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type { BidListSearchRequest } from '@/types/bd'

export const bdKeys = {
  selectBidPbancIntgList: (req?: BidListSearchRequest) =>
    ['bd', 'selectBidPbancIntgList', req] as const,
  selectPbancGnrlInfo: (id: string) => ['bd', 'selectPbancGnrlInfo', id] as const,
  selectBidPrgrsListForBzenty: (req?: BidListSearchRequest) =>
    ['bd', 'selectBidPrgrsListForBzenty', req] as const,
  /** 진행목록 전체 무효화용 prefix — 제출(전자서명·입찰서 제출) 성공 시 invalidateQueries 에 사용. */
  selectBidPrgrsListForBzentyAll: ['bd', 'selectBidPrgrsListForBzenty'] as const,
  selectBdopnList: (req?: BidListSearchRequest) => ['bd', 'selectBdopnList', req] as const,
  selctBidRsltInfo: (id: string) => ['bd', 'selctBidRsltInfo', id] as const,
  selectPlrlRsrvPrcInfo: (id: string) => ['bd', 'selectPlrlRsrvPrcInfo', id] as const,
  selectSmprcScsbdRsltInfo: (id: string) => ['bd', 'selectSmprcScsbdRsltInfo', id] as const,
  selectEvlMbcmtTechEvlScrInfo: (bidRsltId: string) =>
    ['bd', 'selectEvlMbcmtTechEvlScrInfo', bidRsltId] as const,
  selectItemList: (pbancNo: string, page: number) =>
    ['bd', 'selectItemList', { pbancNo, page }] as const,
  selectTndrItemList: (pbancNo: string, page: number) =>
    ['bd', 'selectTndrItemList', { pbancNo, page }] as const,
  selectElsgnCerts: () => ['bd', 'selectElsgnCerts'] as const,
}
