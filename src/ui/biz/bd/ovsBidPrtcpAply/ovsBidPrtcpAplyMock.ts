// 국외 입찰참가신청서 작성(MUI-BD-04-M71) 탭 목업 + 탭 폼 초기값 — 페이지(확정값 보관)와 탭(표시)이 공유한다.
// 컴포넌트 파일에서 상수를 export 하면 react-refresh 경고가 나므로 여기(비컴포넌트 파일)로 분리.
// 값은 설계서 v1.88 항목명/형식 그대로. 추후 API(bdService.selectBidPrtcpBizList / selectBzentyDtl) 응답으로 교체.
import {
  DEPOSIT_TYPE,
  type OvsBidGrnteValues,
  type OvsSplyInfoValues,
} from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAply.schema'
import type { MockOvsBidPrtcpBizItem, MockOvsSplyInfo } from '@/types/mock/bd'

// ── T73 업체정보 — 입찰업체(dm_splyInfo), 설계서 slide445 표시값 형식 그대로(2026-07-01 화면 수정: 주민등록번호 삭제). ──
export const MOCK_SPLY_INFO: MockOvsSplyInfo = {
  splyBzentyCd: '7004',
  splyBzentyNm: 'FB해외업체',
  splyRprsvNm: '홍길동',
  splyEmlAddr: 'bid@fb-overseas.com',
  splyTlno: '02-1234-5678',
  splyFxno: '02-2345-6789',
  splyBzmnNo: '123-45-67890',
  splyAddr: '서울특별시 종로구 세종대로 209',
}

/** T73 폼 초기값 — 페이지가 확정값이 없을 때 주입(조회된 업체코드). */
export const SPLY_INFO_DEFAULT: OvsSplyInfoValues = { splyBzentyCd: MOCK_SPLY_INFO.splyBzentyCd }

// ── T74 입찰보증금 — 입찰참가사업 및 입찰보증금(dl_bizList·dl_bizExmptnList 공통 R 필드), 달러금액(설계서 형식). ──
// On-Load 입찰참가사업목록 조회 — 추후 API: bdService.selectBidPrtcpBizList(pbancNo, depositType)
export const MOCK_BIZ_LIST: MockOvsBidPrtcpBizItem[] = [
  {
    prchsDmndNo: '2025103001',
    bizNm: 'MD부품 국외구매',
    bdngItemQty: '6',
    bdngTccrAmt: 'USD 1,234,567.00',
    bidGrnteAmt: 'USD 61,728.35',
    gurnAgreDocNo: '연대보증서.pdf',
    giveWrtprmDocNo: '지급각서.pdf',
  },
  {
    prchsDmndNo: '2025103002',
    bizNm: '항공기 수리부속 국외구매',
    bdngItemQty: '3',
    bdngTccrAmt: 'USD 250,000.00',
    bidGrnteAmt: 'USD 12,500.00',
    gurnAgreDocNo: '연대보증서.pdf',
    giveWrtprmDocNo: '지급각서.pdf',
  },
]

/** T74 폼 초기값 — 조회된 사업 목록(R) + 편집 항목 빈값(파일은 조회된 서류명 시드). */
export const BID_GRNTE_DEFAULT: OvsBidGrnteValues = {
  depositType: DEPOSIT_TYPE.nonExmptn,
  bizList: MOCK_BIZ_LIST.map((biz) => ({
    prchsDmndNo: biz.prchsDmndNo,
    bidGrnteAmt: biz.bidGrnteAmt,
    chckBidGrnteAmt: '',
    grntePayMth: '',
    wtgrNo: '',
    grnteInstNm: '',
    // 목업: 업로드된 상태로 시드 — 설계서 slide447 표시(File.pdf + X 삭제)와 동일하게 X 버튼 노출.
    grntePyslDocNo: '입찰보증금납부서.pdf',
    gurnAgreDocNo: biz.gurnAgreDocNo ?? '',
    giveWrtprmDocNo: biz.giveWrtprmDocNo ?? '',
  })),
}
