// 업무지원(TS) 도메인 목업 데이터 — USE_MOCK=true 일 때 tsService 가 반환.
// 설계서(06.업무지원 v0.82) 항목설명 항목·형식·slide9/12/14 목업값을 반영(임의 더미 금지).
// ⚠️ 폐쇄망 반입 후 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type { BfhdLoiDtl, BfhdLoiItem, BfhdLoiSpcfctItem } from '@/types/ts'

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

export const MOCK_TS = {
  bfhdLoiList: BFHD_LOI_LIST,
  bfhdLoiDtl: BFHD_LOI_DTL,
  bfhdLoiSpcfctList: BFHD_LOI_SPCFCT_LIST,
}
