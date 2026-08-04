// 업무지원(TS) 도메인 목업 데이터 — USE_MOCK=true 일 때 tsService 가 반환.
// 설계서(06.업무지원 v0.82) 항목설명 항목·형식·slide9/12/14 목업값을 반영(임의 더미 금지).
// ⚠️ 폐쇄망 반입 후 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type {
  BfhdLoiDtl,
  BfhdLoiItem,
  BfhdLoiSpcfctItem,
  TxivCtrtItem,
  TxivDtl,
  TxivItem,
  TxivPrgrsPrstItem,
} from '@/types/ts'

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-01-M01 사전의향서목록 — slide9 목업(변속기 부품 2025-05-01~2025-08-15 총괄계약팀 홍길동 제출 /
// 장갑차 부품 2025-07-01~2025-10-30 운영계약팀 홍길순 미제출). 진행상태 빈값 케이스 포함.
// ────────────────────────────────────────────────────────────────────────────
const BFHD_LOI_LIST: BfhdLoiItem[] = [
  {
    id: '20250000000001',
    no: 1,
    rcptYmd: '2025-05-01 ~ 2025-08-15',
    bfhdLoiTtl: '변속기 부품',
    prgrsStcd: '제출',
    deptCd: '총괄계약팀',
    userNm: '홍길동',
  },
  {
    id: '20250000000002',
    no: 2,
    rcptYmd: '2025-07-01 ~ 2025-10-30',
    bfhdLoiTtl: '장갑차 부품',
    prgrsStcd: '미제출',
    deptCd: '운영계약팀',
    userNm: '홍길순',
  },
  {
    id: '20250000000003',
    no: 3,
    rcptYmd: '2025-09-01 ~ 2025-12-15',
    bfhdLoiTtl: '항공기 정비부품',
    prgrsStcd: '', // 빈값 — 임시저장/제출 전(slide9 진행상태 처리절차)
    deptCd: '총괄계약팀',
    userNm: '김길동',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-01-M02 사전의향서상세 — slide12~13 목업(변속기 부품 · 접수 2025-05-01~2025-08-15 ·
// 문의처 총괄계약팀/홍길동/02-1234-5678, 010-1234-5678).
// ────────────────────────────────────────────────────────────────────────────
const BFHD_LOI_DTL: BfhdLoiDtl = {
  bfhdLoiNo: '20250000000001',
  bfhdLoiTtl: '변속기 부품',
  rcptBgngYmd: '2025-05-01',
  rcptEndYmd: '2025-08-15',
  deptCd: '총괄계약팀',
  userNm: '홍길동',
  telNum: '02-1234-5678, 010-1234-5678',
  prgrsStcd: '제출',
  expryYn: 'N',
}

// MUI-TS-01-T02 품목명세서 — slide14 목업(제조/의견 123 · A7005265 · 4240-3753116870 · AA · EA ·
// 총괄계약팀 · 최초조달원 2025-08).
const BFHD_LOI_SPCFCT_LIST: BfhdLoiSpcfctItem[] = [
  {
    id: 'A7005265-1',
    no: 1,
    mnftrPrchsSecd: '제조',
    etcOpnnCn: '의견 123',
    prcmRqtNo: 'A7005265',
    mdfcnInvtNo: '4240-3753116870',
    itemNm: 'AA',
    unitCd: 'EA',
    deptCd: '총괄계약팀',
    frstSosCd: '2025-08',
    implInstCd: '조달청',
    lshtmSecd: '일반',
    bgtSecd: '본조',
    mtncItemSecd: '일반',
    spcfctNo: '4240-4009',
    rqtYmd: '2025-08-01',
    prcmDrctnSecd: '일반',
    rqtQty: 25,
    rqtUntprc: 100000,
    rqtAmt: 2500000,
  },
  {
    id: 'A7005266-2',
    no: 2,
    mnftrPrchsSecd: '', // 미선택 — 의견작성 전
    etcOpnnCn: '',
    prcmRqtNo: 'A7005266',
    mdfcnInvtNo: '4240-3753116871',
    itemNm: 'BB',
    unitCd: 'EA',
    deptCd: '총괄계약팀',
    frstSosCd: '2025-08',
    implInstCd: '조달청',
    lshtmSecd: '일반',
    bgtSecd: '본조',
    mtncItemSecd: '일반',
    spcfctNo: '4240-4010',
    rqtYmd: '2025-08-01',
    prcmDrctnSecd: '일반',
    rqtQty: 30,
    rqtUntprc: 120000,
    rqtAmt: 3600000,
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-TS-04-M01 세금계산서계약목록 — slide22 목업(계약번호 2025 000 000-01 · 변속기 부품 계약의 건 ·
// A 업체 · 홍길동 · 계약종류 bidxMtnm).
// ────────────────────────────────────────────────────────────────────────────
const TXIV_CTRT_LIST: TxivCtrtItem[] = [
  {
    id: '20250000001',
    ctrtNo: '20250000001',
    ctrtYmd: '2025-01-10',
    bidxMtnm: '총액제',
    rpstItnm: '변속기 부품 계약의 건',
    bzentyCd: 'A0001',
    bzentyNm: 'A 업체',
    userNm: '홍길동',
  },
  {
    id: '20250000002',
    ctrtNo: '20250000002',
    ctrtYmd: '2025-03-15',
    bidxMtnm: '단가제',
    rpstItnm: '장갑차 부품 계약의 건',
    bzentyCd: 'B0002',
    bzentyNm: 'B 업체',
    userNm: '홍길순',
  },
]

// MUI-TS-04-P02 세금계산서목록 — slide23 목업(발행번호 2118F-0000-0000 · 일반/국세청승인 ·
// 수정/저장/기재사항 착오정정 조합).
const TXIV_LIST: TxivItem[] = [
  {
    id: '2118F-0000-0001',
    reqDivsNm: '일반',
    txivPrgrsStcd: '국세청승인',
    txivMdfcnRncd: undefined,
    pblcnNo: '2118F-0000-0001',
    ctrtNo: '20250000001',
    bllPblcnYmd: '2025-10-15',
    rpstItnm: '변속기 부품 계약의 건',
    contAmnt: 120000000,
    splyEqvl: 109090909,
    userNm: '홍길동',
  },
  {
    id: '2118F-0000-0002',
    reqDivsNm: '수정',
    txivPrgrsStcd: '저장',
    txivMdfcnRncd: '기재사항 착오정정',
    pblcnNo: '2118F-0000-0002',
    ctrtNo: '20250000001',
    bllPblcnYmd: '2025-11-01',
    rpstItnm: '변속기 부품 계약의 건',
    contAmnt: 120000000,
    splyEqvl: 109090909,
    userNm: '홍길동',
  },
]

// MUI-TS-04-M03 세금계산서상세 — slide28 목업(책번호/일련번호 · 공급자/공급받는자 123-45-67890 ·
// 세액구분 과세 · 신고구분 확정 · 품목 변속기 부품).
const TXIV_DTL: TxivDtl = {
  ctrtNo: '20250000001',
  pblcnNo: '2118F-0000-0001',
  bookNo: '00',
  regSn: '00000-00000',
  splrBrno: '123-45-67890',
  splrRprsvNm: '홍길동',
  splrBzentyNm: 'A 업체',
  splrBzstatCd: '제조',
  splrAddr: '서울특별시 종로구 세종대로 1',
  splrTpbizNm: '제조',
  splrPicNm: '홍길동',
  splrEntlno: '010-1234-5678',
  splrTkcgDeptNm: '총괄계약팀',
  splrEmlAddr: 'hong@d2b.go.kr',
  splrcpBrno: '123-45-67890',
  splrcpRprsvNm: '홍길동',
  splrcpBzentyNm: 'A 업체',
  splrcpBzstatCd: '제조',
  splrcpAddr: '서울특별시 종로구 세종대로 1',
  splrcpTpbizNm: '제조',
  vatSecd: '과세',
  cfmtnYn: '확정',
  splyYmd: '2025-01-10',
  itemNm: '변속기 부품',
  dlvgdsQty: 10,
  ctrtUntprc: 10000000,
  splyEqvl: 100000000,
  vatAmt: 10000000,
  rmrkCn: '-',
  reqDivsNm: '일반',
  txivPrgrsStcd: '국세청승인',
  txivMdfcnRncd: undefined,
  rpstItnm: '변속기 부품 계약의 건',
  contAmnt: 120000000,
  bllPblcnYmd: '2025-10-15',
}

// MUI-TS-04-M04 세금계산서진행현황 — slide31 목업(제출일시 2025-10-15 · 국세청결과 '-').
const TXIV_PRGRS_PRST_LIST: TxivPrgrsPrstItem[] = [
  {
    id: '2118F-0000-0001',
    reqDivsNm: '일반',
    txivPrgrsStcd: '국세청승인',
    txivMdfcnRncd: undefined,
    pblcnNo: '2118F-0000-0001',
    ctrtNo: '20250000001',
    bllPblcnYmd: '2025-10-15',
    rpstItnm: '변속기 부품 계약의 건',
    contAmnt: 120000000,
    splyEqvl: 109090909,
    rmrkCn: '-',
    splrWrtDt: '2025-10-15',
    elsgnRsltCd: '-',
  },
  {
    id: '2118F-0000-0002',
    reqDivsNm: '수정',
    txivPrgrsStcd: '저장',
    txivMdfcnRncd: '기재사항 착오정정',
    pblcnNo: '2118F-0000-0002',
    ctrtNo: '20250000001',
    bllPblcnYmd: '2025-11-01',
    rpstItnm: '변속기 부품 계약의 건',
    contAmnt: 120000000,
    splyEqvl: 109090909,
    rmrkCn: '-',
    splrWrtDt: '2025-11-01',
    elsgnRsltCd: '-',
  },
]

export const MOCK_TS = {
  bfhdLoiList: BFHD_LOI_LIST,
  bfhdLoiDtl: BFHD_LOI_DTL,
  bfhdLoiSpcfctList: BFHD_LOI_SPCFCT_LIST,
  txivCtrtList: TXIV_CTRT_LIST,
  txivList: TXIV_LIST,
  txivDtl: TXIV_DTL,
  txivPrgrsPrstList: TXIV_PRGRS_PRST_LIST,
}
