// 이행(EX) 도메인 목업 데이터 — USE_MOCK=true 일 때 exService 가 반환.
// 설계서(04.이행 v0.83) 항목설명 항목·형식·slide10/13/14 목업값을 반영(임의 더미 금지).
// ⚠️ 폐쇄망 반입 후 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type {
  DlvgdsAvtsmtItem,
  InspDlvdocCmdtyItem,
  InspDlvdocDtl,
  InspDlvdocItem,
  InspIntgListItem,
} from '@/types/ex'

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M01 검사통합목록 — slide10 목업(계약번호 2025000000-01 · 계약금액 11,616,000 ·
// 진행상태 저장/검사의뢰완료/검사반려/검사저장/검사완료/출납완료/조달접수/조달반려/납품조서반려/청구저장/대금청구).
// 업무구분(물품/용역/공사) × 예산구분(전년국채/본조/당년국채) × 진행상태 대표 조합.
// ────────────────────────────────────────────────────────────────────────────
const INSP_INTG_LIST: InspIntgListItem[] = [
  {
    id: '20250000001-01',
    no: 1,
    taskSecd: '물품',
    ctrtYmd: '2026-02-10',
    ctrtNo: '20250000001',
    ctrtCycl: '01',
    ctrtNm: '관사 비품 구매',
    ctrtBzentyNm: '조달테스트업체',
    ctrtAmt: 11616000,
    inspYmd: '2026-06-10',
    bgtSecdNm: '전년국채',
    dlvdocPrgrsStcd: '검사의뢰완료',
  },
  {
    id: '20250000002-01',
    no: 2,
    taskSecd: '용역',
    ctrtYmd: '2026-02-10',
    ctrtNo: '20250000002',
    ctrtCycl: '01',
    ctrtNm: '시설 경비 용역',
    ctrtBzentyNm: '한국시큐리티',
    ctrtAmt: 52000000,
    inspYmd: '2026-04-10',
    bgtSecdNm: '본조',
    dlvdocPrgrsStcd: '검사완료',
  },
  {
    id: '20250000003-01',
    no: 3,
    taskSecd: '공사',
    ctrtYmd: '2026-01-03',
    ctrtNo: '20250000003',
    ctrtCycl: '01',
    pxcndCycl: '2',
    pxcndCmcnSecd: '기성',
    ctrtNm: '막사 보수 공사',
    ctrtBzentyNm: '대한건설',
    ctrtAmt: 385000000,
    dlvgdsPxcndAmt: 120000000,
    inspYmd: '2026-03-15',
    bgtSecdNm: '당년국채',
    dlvdocPrgrsStcd: '검사저장',
  },
  {
    id: '20250000004-01',
    no: 4,
    taskSecd: '물품',
    ctrtYmd: '2025-12-22',
    ctrtNo: '20250000004',
    ctrtCycl: '01',
    ctrtNm: '전산 소모품 구매',
    ctrtBzentyNm: '오피스원',
    ctrtAmt: 8250000,
    inspYmd: '2026-02-01',
    bgtSecdNm: '본조',
    dlvdocPrgrsStcd: '조달접수',
  },
  {
    id: '20250000005-01',
    no: 5,
    taskSecd: '공사',
    ctrtYmd: '2025-11-14',
    ctrtNo: '20250000005',
    ctrtCycl: '01',
    pxcndCycl: '1',
    pxcndCmcnSecd: '준공',
    ctrtNm: '급수시설 개선 공사',
    ctrtBzentyNm: '한빛종합건설',
    ctrtAmt: 174000000,
    dlvgdsPxcndAmt: 174000000,
    inspYmd: '2026-01-20',
    bgtSecdNm: '전년국채',
    dlvdocPrgrsStcd: '출납완료',
  },
  {
    id: '20250000006-01',
    no: 6,
    taskSecd: '물품',
    ctrtYmd: '2025-10-02',
    ctrtNo: '20250000006',
    ctrtCycl: '01',
    ctrtNm: '동계 피복류 구매',
    ctrtBzentyNm: '대성섬유',
    ctrtAmt: 96400000,
    bgtSecdNm: '본조',
    dlvdocPrgrsStcd: '납품조서반려',
  },
  {
    id: '20250000007-01',
    no: 7,
    taskSecd: '용역',
    ctrtYmd: '2025-09-18',
    ctrtNo: '20250000007',
    ctrtCycl: '01',
    ctrtNm: '정보시스템 유지관리 용역',
    ctrtBzentyNm: '아이티솔루션',
    ctrtAmt: 240000000,
    inspYmd: '2025-12-30',
    bgtSecdNm: '당년국채',
    dlvdocPrgrsStcd: '대금청구',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-P10 납품통지목록 — slide13 목업(통지번호 100/99 · 관사 비품 구매 ·
// 계약수량 1,000 · 계약금액 200,000,000 · 계약단가 100,000 · 납기 2025-12-01 · 납지 001부대).
// ────────────────────────────────────────────────────────────────────────────
const DLVGDS_AVTSMT_LIST: DlvgdsAvtsmtItem[] = [
  {
    id: '20250000001-100',
    no: 1,
    avtsmtNo: '100',
    ctrtNm: '관사 비품 구매',
    bgtSecdNm: '본조',
    ctrtQty: 1000,
    wrtQty: 1000,
    dlvgdsCmptnQty: 0,
    ctrtAmt: 200000000,
    ctrtUprc: 100000,
    dudtYmd: '2025-12-01',
    plcdlvNm: '001부대',
    taskSecd: '물품',
  },
  {
    id: '20250000001-099',
    no: 2,
    avtsmtNo: '99',
    ctrtNm: '관사 비품 구매',
    bgtSecdNm: '본조',
    ctrtQty: 1000,
    wrtQty: 1000,
    dlvgdsCmptnQty: 0,
    ctrtAmt: 200000000,
    ctrtUprc: 100000,
    dudtYmd: '2025-12-01',
    plcdlvNm: '001부대',
    taskSecd: '용역',
  },
  {
    id: '20250000001-098',
    no: 3,
    avtsmtNo: '98',
    ctrtNm: '관사 비품 구매',
    bgtSecdNm: '전년국채',
    ctrtQty: 500,
    wrtQty: 300,
    dlvgdsCmptnQty: 300,
    ctrtAmt: 50000000,
    ctrtUprc: 100000,
    dudtYmd: '2025-10-15',
    plcdlvNm: '002부대',
    taskSecd: '물품',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-P11 검사및납품조서목록 — slide14 목업(계약차수 00 · 조서발행번호
// M2025MST000200-0001 · 납품금액 1,000,000 · 작성수량 100 · 납지 002부대 · 지체일수 10 · 지체상금 10,000).
// ────────────────────────────────────────────────────────────────────────────
const INSP_DLVDOC_LIST: InspDlvdocItem[] = [
  {
    id: 'M2025MST000200-0001',
    no: 1,
    ctrtCycl: '00',
    recrdPblcnNo: 'M2025MST000200-0001',
    bgtSecdNm: '본조',
    dlvgdsAmt: 1000000,
    wrtQty: 100,
    dlvdocPrgrsStcd: '조달접수',
    plcdlvNm: '002부대',
    arrsDayCnt: 10,
    lqdmg: 10000,
    taskSecd: '물품',
    sbsdPrcmYn: 'Y',
  },
  {
    id: 'M2025MST000200-0002',
    no: 2,
    ctrtCycl: '00',
    recrdPblcnNo: 'M2025MST000200-0002',
    bgtSecdNm: '본조',
    dlvgdsAmt: 2500000,
    wrtQty: 250,
    dlvdocPrgrsStcd: '검사완료',
    plcdlvNm: '001부대',
    arrsDayCnt: 0,
    lqdmg: 0,
    taskSecd: '물품',
    sbsdPrcmYn: 'N',
  },
  {
    id: 'M2025MST000200-0003',
    no: 3,
    ctrtCycl: '01',
    recrdPblcnNo: 'M2025MST000200-0003',
    bgtSecdNm: '전년국채',
    dlvgdsAmt: 800000,
    wrtQty: 80,
    dlvdocPrgrsStcd: '검사저장',
    plcdlvNm: '003부대',
    arrsDayCnt: 3,
    lqdmg: 4500,
    taskSecd: '물품',
    sbsdPrcmYn: 'Y',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M02 검사및납품조서상세(중앙조달) — slide17 목업(계약번호 2025 0000 00 (01) ·
// 통지번호 12345 6789 · 예산구분 전년국채 · 납지 제8385부대 · 납품요구일시 2026-10-15 08:00).
// ────────────────────────────────────────────────────────────────────────────
const INSP_DLVDOC_DTL: InspDlvdocDtl = {
  ctrtNo: '20250000001',
  ctrtCycl: '01',
  avtsmtNo: '100',
  bgtSecdNm: '전년국채',
  dudtYmd: '2026-12-30',
  plcdlvNm: '제8385부대',
  dlvgdsDmndDt: '2026-10-15 08:00',
  rmrkCn: '납품 시 검사관 입회 필요. 부분 납품 가능 여부는 담당자와 협의.',
  taskSecd: '물품',
  dlvdocPrgrsStcd: '대금청구',
  ctrtNm: '관사 비품 구매',
  ctrtYmd: '2026-02-10',
  ctrtAmt: 11616000,
}

// MUI-EX-01-T02 물품목록 — slide19 목업(깍두기(임가공)(3지역)[1412F] · kg · 49,230,000 · 0 · 49,230).
const INSP_DLVDOC_CMDTY_LIST: InspDlvdocCmdtyItem[] = [
  {
    id: '000000000000001-000000001',
    prcmRqtNo: '000000000000001',
    invtNo: '000000001',
    itemNm: '깍두기(임가공)(3지역)[1412F]',
    unitCd: 'kg',
    ctrtQty: 49230000,
    acmlWrtQty: 0,
    tstmDlvgdsQty: 49230,
  },
  {
    id: '000000000000002-000000002',
    prcmRqtNo: '000000000000002',
    invtNo: '000000002',
    itemNm: '배추김치(임가공)(3지역)[1412F]',
    unitCd: 'kg',
    ctrtQty: 12500000,
    acmlWrtQty: 3200000,
    tstmDlvgdsQty: 125000,
  },
]

export const MOCK_EX = {
  inspIntgList: INSP_INTG_LIST,
  dlvgdsAvtsmtList: DLVGDS_AVTSMT_LIST,
  inspDlvdocList: INSP_DLVDOC_LIST,
  inspDlvdocDtl: INSP_DLVDOC_DTL,
  inspDlvdocCmdtyList: INSP_DLVDOC_CMDTY_LIST,
}
