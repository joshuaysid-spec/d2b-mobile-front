// 입찰(BD, MUI-BD) 도메인 API. 현재 백엔드 미연동 — 목업 반환 스텁(API 경계 표시).
// 목록→상세 표준(CLAUDE.md "목록 → 상세 데이터 전달"): 상세는 id 로 getXxxDetail(id) 조회.
//   추후 실제 연동 시 Promise.resolve(MOCK) 자리를 apiClient.post(...) + 응답 매핑으로 대체한다.
import type { BidPbancDetail, BidPrgrsDetail } from '@/types/bd'

// 입찰공고 상세(M07) 헤더/요약 목업 — 설계서 항목명/형식. 추후 API 응답으로 대체.
const MOCK_BID_PBANC_DETAIL: BidPbancDetail = {
  id: '0',
  bidPbancNo: 'LDG0097-1',
  bidPbancNm: '특수작전용대물타격무인항공기',
  pbancStasNm: '긴급공고',
  taskSeNm: '물품',
  bidMthdNm: '경쟁입찰',
  pbancDt: '2025-12-22',
  bidPtcptAplyDdlnDt: '2025-12-23 17:00',
  bidDocSbmsnDdlnDt: '2025-12-24 10:00',
  opbidDt: '2025-12-24 10:30',
  bidStatNm: '개찰전',
  prgrsStg: '입찰',
}

// 입찰진행 상세(M02) 목업 — 설계서 dlt_bidPrgrsList 항목명. 추후 API 응답으로 대체.
const MOCK_BID_PRGRS_DETAIL: BidPrgrsDetail = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '000 000 0000',
  prcmNo: '00 00 00 00',
  clsfNo: '00 00 00000',
  bidNm: '간편한 아침식 제조 및 납품',
  rfrncNo: '0000 0000',
  orderInstTelno: '000-0000-0000',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '-',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: true,
}

export const bdService = {
  /**
   * 입찰공고 상세 조회 (MUI-BD-01-M07~). 현재 목업 스텁.
   * 추후: return apiClient.post('/bd/pbanc/detail', { pbancNo: id }).then(toBidPbancDetail)
   */
  getBidPbancDetail(id: string): Promise<BidPbancDetail> {
    console.log('[bdService] 입찰공고 상세 조회 (API 스텁)', { id })
    return Promise.resolve({ ...MOCK_BID_PBANC_DETAIL, id })
  },

  /**
   * 입찰진행 상세 조회 (MUI-BD-03-M02). 현재 목업 스텁.
   * 추후: return apiClient.post('/bd/prgrs/detail', { rNum: id }).then(toBidPrgrsDetail)
   */
  getBidProgressDetail(id: string): Promise<BidPrgrsDetail> {
    console.log('[bdService] 입찰진행 상세 조회 (API 스텁)', { id })
    return Promise.resolve({ ...MOCK_BID_PRGRS_DETAIL, rNum: id })
  },
}
