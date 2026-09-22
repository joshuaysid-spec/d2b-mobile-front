// 입찰(BD) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: bdService(services/bds/bd.ts) · bdQueries(이 파일) · bdKeys(bdKeys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = bdKeys(함수명 동일).
// 조회는 useQuery 훅 · 저장/제출은 useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
// 무효화(invalidate)는 mutation 훅 onSuccess 에서 중앙 처리.
// (여기 훅은 실제로 소비하는 페이지 것만 둔다 — 투기적 훅 금지.)
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { bdService } from '@/services/bds/bd'
import { bdKeys } from '@/queries/bds/bd/bdKeys'
import type {
  MockBidListSearchRequest,
  MockBidPbancDetail,
  MockBidPbancListSrchMap,
  MockBdopnItem,
  MockTndrSavePayload,
} from '@/types/mock/bd'

export const bdQueries = {
  /** 입찰공고 통합목록(no.28) — 목업은 전체 반환, 키워드/페이징은 페이지 클라이언트 로직 유지. */
  useSelectBidPbancIntgList(req?: MockBidPbancListSrchMap) {
    return useQuery({
      queryKey: bdKeys.selectBidPbancIntgList(req),
      queryFn: () => bdService.selectBidPbancIntgList(req),
    })
  },

  /** 입찰공고 상세 공고일반(no.32) — 목록에서 navigate state 로 넘어온 항목을 placeholder 로 즉시 렌더. */
  useSelectPbancGnrlInfo(id: string, placeholder?: MockBidPbancDetail) {
    return useQuery({
      queryKey: bdKeys.selectPbancGnrlInfo(id),
      queryFn: () => bdService.selectPbancGnrlInfo(id),
      placeholderData: placeholder,
      enabled: Boolean(id),
    })
  },

  /** 입찰진행 목록(조달업체, no.73) — 목업 전체 반환, 검색/페이징은 페이지 클라이언트 로직 유지. */
  useSelectBidPrgrsListForBzenty(req?: MockBidListSearchRequest) {
    return useQuery({
      queryKey: bdKeys.selectBidPrgrsListForBzenty(req),
      queryFn: () => bdService.selectBidPrgrsListForBzenty(req),
    })
  },

  /** 개찰목록(no.147) — 목업 전체 반환, 검색/페이징은 페이지 클라이언트 로직 유지. */
  useSelectBdopnList(req?: MockBidListSearchRequest) {
    return useQuery({
      queryKey: bdKeys.selectBdopnList(req),
      queryFn: () => bdService.selectBdopnList(req),
    })
  },

  /**
   * 임시입찰내용조회(no.60) — 입찰내역 작성(T75/T76) 진입 시 기존 저장분 로드(2026-09-02 배선).
   * 단가제=행 배열 · 총액제=단건. bidMthdNm 은 목업 분기용(실서버는 intgRfrncNo 로 판별).
   */
  useSelectTmprBidCnList(intgRfrncNo: string, bidMthdNm?: '단가제' | '총액제') {
    return useQuery({
      queryKey: bdKeys.selectTmprBidCnList(intgRfrncNo, bidMthdNm),
      queryFn: () => bdService.selectTmprBidCnList(intgRfrncNo, bidMthdNm),
      enabled: Boolean(intgRfrncNo),
    })
  },

  /**
   * 임시입찰내용조회(no.125, OvsTndrSbmsnController) — 국외 입찰서 제출(MUI-BD-06-M71) On-Load(설계서 slide485).
   * 보관함 입찰내역 작성(ovsTmprBidCnReg)에서 저장해 둔 품목별 입찰단가/입찰금액을 입찰참여품목 탭 초기값으로 채운다.
   */
  useSelectOvsTndrSbmsnTmprBidCnList(pbancNo: string, pbancOd: string) {
    return useQuery({
      queryKey: bdKeys.selectOvsTndrSbmsnTmprBidCnList(pbancNo, pbancOd),
      queryFn: () => bdService.selectOvsTndrSbmsnTmprBidCnList(pbancNo, pbancOd),
      enabled: Boolean(pbancNo),
    })
  },

  /** 입찰결과정보(no.165) — 목록에서 넘어온 항목을 placeholder 로 즉시 렌더(없으면 id 조회). */
  useSelctBidRsltInfo(id: string, placeholder?: MockBdopnItem) {
    return useQuery({
      queryKey: bdKeys.selctBidRsltInfo(id),
      queryFn: () => bdService.selctBidRsltInfo(id),
      placeholderData: placeholder,
      enabled: Boolean(id),
    })
  },

  /** 복수예비가격(P02) — 팝업 열릴 때만 조회. */
  useSelectPlrlRsrvPrcInfo(id: string, enabled: boolean) {
    return useQuery({
      queryKey: bdKeys.selectPlrlRsrvPrcInfo(id),
      queryFn: () => bdService.selectPlrlRsrvPrcInfo(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 동가낙찰결과(P03) — 팝업 열릴 때만 조회. */
  useSelectSmprcScsbdRsltInfo(id: string, enabled: boolean) {
    return useQuery({
      queryKey: bdKeys.selectSmprcScsbdRsltInfo(id),
      queryFn: () => bdService.selectSmprcScsbdRsltInfo(id),
      enabled: Boolean(id) && enabled,
    })
  },

  /** 평가위원별 기술평가점수(no.167, P04) — 팝업 열릴 때만 조회. */
  useSelectEvlMbcmtTechEvlScrInfo(bidRsltId: string, enabled: boolean) {
    return useQuery({
      queryKey: bdKeys.selectEvlMbcmtTechEvlScrInfo(bidRsltId),
      queryFn: () => bdService.selectEvlMbcmtTechEvlScrInfo(bidRsltId),
      enabled: Boolean(bidRsltId) && enabled,
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

  /** 관심공고 등록/해제(no.30, MUI-BD-01-M03 즐겨찾기 토글) — 페이지가 낙관적 갱신/롤백 소유. */
  useInsertItrstPbanc() {
    return useMutation({
      mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
        bdService.insertItrstPbanc(id, favorite),
    })
  },

  /** 관심공고 등록 — 국외(no.51). 관심공고 화면(MUI-CM-06-M05) 재등록의 taskSeCd 국외 분기용. */
  useInsertOvsItrstPbanc() {
    return useMutation({
      mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
        bdService.insertOvsItrstPbanc(id, favorite),
    })
  },

  /** 전자서명(MUI-BD-04-M21) — 성공 시 진행목록 캐시 무효화(제출 성공 invalidate 규칙). */
  useSignElsgn() {
    return useMutation({
      mutationFn: ({ certId, pbancNo }: { certId: string; pbancNo: string }) =>
        bdService.signElsgn(certId, pbancNo),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: bdKeys.selectBidPrgrsListForBzentyAll }),
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
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: bdKeys.selectBidPrgrsListForBzentyAll }),
    })
  },

  /** 입찰서제출(no.118, MUI-BD-06 TndrWrt) — 성공 시 진행목록 캐시 무효화. */
  useInsertTndrSbmsn() {
    return useMutation({
      mutationFn: (payload: MockTndrSavePayload) => bdService.insertTndrSbmsn(payload),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: bdKeys.selectBidPrgrsListForBzentyAll }),
    })
  },
}
