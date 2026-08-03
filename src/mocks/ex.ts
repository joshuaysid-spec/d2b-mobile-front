// 이행(EX) 도메인 목업 데이터 — USE_MOCK=true 일 때 exService 가 반환.
// 설계서(04.이행 v0.83) 항목설명 항목·형식·slide10/13/14 목업값을 반영(임의 더미 금지).
// ⚠️ 폐쇄망 반입 후 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type {
  DlvdocRsltCmdtyItem,
  DlvdocRsltDtl,
  DlvgdsAvtsmtItem,
  OvsEstmtNtdcDtl,
  OvsEstmtNtdcItem,
  OvsEstmtNtdcItemRow,
  OvsEstmtNtdcCtrtInfo,
  OvsEstmtRqdcDtl,
  OvsEstmtRqdcItem,
  OvsEstmtRqdcItemRow,
  InspDlvdocCmdtyItem,
  InspDlvdocDtl,
  InspDlvdocDtlSbsdPrcm,
  InspDlvdocItem,
  InspDlvdocPrstItem,
  InspDlvdocSbsdCmdtyItem,
  InspIntgListItem,
  PxcndCmcnInspDtl,
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

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M03 검사및납품조서상세(부대조달) — slide21~22 목업(A 업체 · 서울특별시 종로구 ·
// 홍길동 · CJ대한통운 · 개시/검수/납품/합격일자 2025-10-15 · 출납번호 1234 5678 등).
// ────────────────────────────────────────────────────────────────────────────
const INSP_DLVDOC_SBSD_DTL: InspDlvdocDtlSbsdPrcm = {
  ctrtNo: '20250000004',
  ctrtCycl: '01',
  avtsmtNo: '123456789',
  bgtSecdNm: '전년국채',
  dlvdocNo: 'M2025MST000200-0001',
  dudtYmd: '2026-12-30',
  plcdlvNm: '제8385부대',
  inspHopeYmd: '2026-10-15 08:00',
  rmrkCn: '부분 납품 완료분 우선 검사 요청.',
  ctrtBzentyNm: 'A 업체',
  ctrtBzentyAddr: '서울특별시 종로구 세종대로 1',
  rprsvNm: '홍길동',
  dlvBzentyNm: 'CJ대한통운',
  strtYmd: '2025-10-15',
  igiYmd: '2025-10-15',
  dlvgdsYmd: '2025-10-15',
  rcpmNo: '12345678',
  passYmd: '2025-10-15',
  techInspInstNm: '00000 기관',
  techInsptrNm: '홍길동',
  amtmtrInsptrOgdpNm: '0000000 부대',
  amtmtrInsptrNm: '김길동',
  acofOgdpNm: '0000000 부대',
  acofNm: '박길동',
  acofTelno: '000-0000-0000',
  taskSecd: '물품',
  dlvdocPrgrsStcd: '조달접수',
  ctrtNm: '전산 소모품 구매',
  ctrtYmd: '2025-12-22',
  ctrtAmt: 8250000,
}

// MUI-EX-01-T04 부대조달 물품목록 — slide23 목업(중앙 T02 와 동일 형식, 총계약수량).
const INSP_DLVDOC_SBSD_CMDTY_LIST: InspDlvdocSbsdCmdtyItem[] = [
  {
    id: '000000000000003-000000003',
    prcmRqtNo: '000000000000003',
    invtNo: '000000003',
    itemNm: '깍두기(임가공)(3지역)[1412F]',
    unitCd: 'kg',
    tctrtQty: 49230000,
    acmlWrtQty: 0,
    tstmDlvgdsQty: 49230,
  },
  {
    id: '000000000000004-000000004',
    prcmRqtNo: '000000000000004',
    invtNo: '000000004',
    itemNm: '총각김치(임가공)(3지역)[1412F]',
    unitCd: 'kg',
    tctrtQty: 8500000,
    acmlWrtQty: 1200000,
    tstmDlvgdsQty: 85000,
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M04 기성및준공검사상세 — slide27 목업(기성차수 002 · 착공 2025-02-15 ·
// 실준공 2025-03-15 · 준공기한 2025-10-15 · 준공계제출 2025-11-01 · 검사관/감독관 계약담당 홍길동 주무관).
// ────────────────────────────────────────────────────────────────────────────
const PXCND_CMCN_INSP_DTL: PxcndCmcnInspDtl = {
  ctrtNo: '20250000003',
  ctrtCycl: '01',
  ctrtNm: '막사 보수 공사',
  ctrtYmd: '2025-01-01',
  ctrtAmt: 385000000,
  pxcndCycl: '002',
  pxcndCmcnSecd: '기성',
  inspYmd: '2025-01-01',
  pxcndAmt: 120000000,
  pxcndRt: 31.2,
  bgncstYmd: '2025-02-15',
  rlccYmd: '2025-03-15',
  cmcnTermYmd: '2025-10-15',
  cmdocSbmsnYmd: '2025-11-01',
  cmcnCn: '막사 외벽 보수 및 방수 공사 1차분 완료.',
  insptrs: [
    { insptrOgdpNm: '계약담당', insptrEchlnNm: '주무관', insptrNm: '홍길동' },
    { insptrOgdpNm: '시설담당', insptrEchlnNm: '주무관', insptrNm: '김길동' },
  ],
  sprvs: [{ sprvOgdpNm: '계약담당', sprvEchlnNm: '주무관', sprvNm: '홍길동' }],
  taskSecd: '공사',
  bgtSecdNm: '당년국채',
  dlvdocPrgrsStcd: '검사저장',
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M05 검사및납품조서현황목록 — slide30 목업(계약번호 2025000000-01 · 계약금액 11,616,000 ·
// 합격일자 2026-06-10/'-' · 납품일자 '-'/2026-08-15 · 진행상태 코드표(slide33) 표시명).
// ────────────────────────────────────────────────────────────────────────────
const INSP_DLVDOC_PRST_LIST: InspDlvdocPrstItem[] = [
  {
    id: '20250000001-100',
    no: 1,
    taskSeNm: '물품',
    ctrtNo: '20250000001',
    ctrtCycl: '01',
    ctrtNm: '관사 비품 구매',
    avtsmtNo: '100',
    recrdPblcnNo: 'M2025MST000200-0001',
    passYmd: '2026-06-10',
    dlvgdsYmd: undefined,
    dlvgdsAmt: 11616000,
    plcdlvNm: '001부대',
    dlvdocPrgrsStcd: '검사완료',
    ctrtYmd: '2026-02-10',
    ctrtAmt: 11616000,
    bgtSecdNm: '전년국채',
    sbsdPrcmYn: 'N',
  },
  {
    id: '20250000002-101',
    no: 2,
    taskSeNm: '용역',
    ctrtNo: '20250000002',
    ctrtCycl: '01',
    ctrtNm: '시설 경비 용역',
    avtsmtNo: '101',
    recrdPblcnNo: 'M2025MST000200-0002',
    passYmd: '2026-04-10',
    dlvgdsYmd: '2026-08-15',
    dlvgdsAmt: 52000000,
    plcdlvNm: '002부대',
    dlvdocPrgrsStcd: '출납완료',
    ctrtYmd: '2026-02-10',
    ctrtAmt: 52000000,
    bgtSecdNm: '본조',
    sbsdPrcmYn: 'Y',
  },
  {
    id: '20250000003-102',
    no: 3,
    taskSeNm: '공사',
    ctrtNo: '20250000003',
    ctrtCycl: '01',
    ctrtNm: '막사 보수 공사',
    avtsmtNo: '102',
    recrdPblcnNo: 'M2025MST000200-0003',
    passYmd: undefined,
    dlvgdsYmd: undefined,
    dlvgdsAmt: 120000000,
    plcdlvNm: '003부대',
    dlvdocPrgrsStcd: '검사저장',
    ctrtYmd: '2026-01-03',
    ctrtAmt: 385000000,
    bgtSecdNm: '당년국채',
    sbsdPrcmYn: 'N',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-EX-01-M07 검사및납품조서결과상세 — slide36~37 목업(납품장소 제8385부대 · 정비 20일/10일 ·
// 입고 2025-01-30/정비지시 2025-02-15/출고 2025-03-10 · 이행 정보는 M03 과 동일 구성).
// ────────────────────────────────────────────────────────────────────────────
const DLVDOC_RSLT_DTL: DlvdocRsltDtl = {
  ctrtNo: '20250000001',
  ctrtCycl: '01',
  avtsmtNo: '123456789',
  bgtSeNm: '전년국채',
  dlvgdsPlcNm: '제8385부대',
  dlvtrmYmd: '2026-12-30',
  recrdPblcnNo: 'M2025MST000200-0001',
  rmrkCn: '검사 완료. 출납 처리 대기.',
  ctrtBzentyNm: 'A 업체',
  ctrtBzentyAddr: '서울특별시 종로구 세종대로 1',
  rprsvNm: '홍길동',
  dlvBzentyNm: 'CJ대한통운',
  ctrtMtncDayCnt: 20,
  rlmtDayCnt: 10,
  wrhsYmd: '2025-01-30',
  mtncDrctnYmd: '2025-02-15',
  spmtYmd: '2025-03-10',
  strtYmd: '2025-10-15',
  igiYmd: '2025-10-15',
  dlvgdsYmd: '2025-10-15',
  rcpmNo: '12345678',
  passYmd: '2025-10-15',
  techInspInstNm: '00000 기관',
  techInsptrNm: '홍길동',
  amtmtrInsptrOgdpNm: '0000000 부대',
  amtmtrInsptrNm: '김길동',
  acofOgdpNm: '0000000 부대',
  acofNm: '박길동',
  acofTelno: '000-0000-0000',
  taskSeNm: '물품',
  dlvdocPrgrsStcd: '대금청구',
  ctrtNm: '관사 비품 구매',
  ctrtYmd: '2026-02-10',
  ctrtAmt: 11616000,
}

// MUI-EX-01-T06 물품목록 — T04 와 동일 형식(slide38).
const DLVDOC_RSLT_CMDTY_LIST: DlvdocRsltCmdtyItem[] = [
  {
    id: '000000000000005-000000005',
    prcmRqtNo: '000000000000005',
    invtNo: '000000005',
    itemNm: '깍두기(임가공)(3지역)[1412F]',
    unitCd: 'kg',
    tctrtQty: 49230000,
    acmlWrtQty: 0,
    tstmDlvgdsQty: 49230,
  },
]

// ════════════════════════════════════════════════════════════════════════════
// EX-02 한도액계약 목업
// ════════════════════════════════════════════════════════════════════════════

// MUI-EX-02-M71 견적의뢰서목록 — slide46 목업(견적번호 01/02 · F-15 부품구매 · 항목수 3개 ·
// A 업체 · 납기/작성 2026-02-10 · 통보서상태 작성/미작성/송신).
const OVS_ESTMT_RQDC_LIST: OvsEstmtRqdcItem[] = [
  {
    id: '01',
    clmSeq: '01',
    itemSeq: 3,
    bzentyCd: 'A 업체',
    bizNm: 'F-15 부품구매',
    dudtYmd: '2026-02-10',
    wrtYmd: '2026-02-10',
    ntdcStts: '작성',
  },
  {
    id: '02',
    clmSeq: '02',
    itemSeq: 3,
    bzentyCd: 'A 업체',
    bizNm: 'F-15 부품구매',
    dudtYmd: '2026-02-10',
    wrtYmd: '2026-02-10',
    ntdcStts: '미작성',
  },
  {
    id: '03',
    clmSeq: '03',
    itemSeq: 5,
    bzentyCd: '조달테스트업체',
    bizNm: 'KF-16 정비부품 구매',
    dudtYmd: '2026-04-01',
    wrtYmd: '2026-01-15',
    ntdcStts: '송신',
  },
]

// MUI-EX-02-M72 견적의뢰서상세 — slide49 목업(KD111111111 · 견적/유효/계약일자 2025-03-01 ·
// 공군/A 업체/조달테스트업체/홍길동/미 달러).
const OVS_ESTMT_RQDC_DTL: OvsEstmtRqdcDtl = {
  ctrtNo: 'KD111111111',
  clmSeq: '01',
  clmYmd: '2025-03-01',
  vldYmd: '2025-03-01',
  ctrtYmd: '2025-03-01',
  bizNm: 'F-15 부품구매',
  prcmRqtInstCd: '공군',
  ctrtBzentyCd: 'A 업체',
  miltPicId: '공군',
  bzentyCd: '조달테스트업체',
  picId: '홍길동',
  crncCd: '미 달러',
  rmrkCn: '-',
  itemSeq: 3,
  dudtYmd: '2026-02-10',
  wrtYmd: '2026-02-10',
  ntdcStts: '작성',
}

// MUI-EX-02-T72 견적의뢰서 품목 — slide50 목업(1111111111111 · 00000-010000-123 · F-15K ·
// 항공 · 2025-05-01 · 12345 · IRST LRU-1 · EA · 1 · AFLC IM : IG(6급 홍길동)).
const OVS_ESTMT_RQDC_ITEMS: OvsEstmtRqdcItemRow[] = [
  {
    id: '1111111111111-1',
    no: 1,
    invtNo: '1111111111111',
    itemNo: '00000-010000-123',
    aplcnEqpmntCd: 'F-15K',
    trnsMthdCd: '항공',
    dlvgdsRqtYmd: '2025-05-01',
    rcptNo: '12345',
    itemNm: 'IRST LRU-1',
    unitNm: 'EA',
    clmQty: 1,
    rmrkCn: 'AFLC IM : IG(6급 홍길동)',
  },
  {
    id: '1111111111112-2',
    no: 2,
    invtNo: '1111111111112',
    itemNo: '00000-010000-124',
    aplcnEqpmntCd: 'F-15K',
    trnsMthdCd: '항공',
    dlvgdsRqtYmd: '2025-05-01',
    rcptNo: '12346',
    itemNm: 'IRST LRU-2',
    unitNm: 'EA',
    clmQty: 2,
    rmrkCn: '-',
  },
]

// MUI-EX-02-M73 견적통보서목록 — slide55 목업(TESLA · 2025-03-01 · 미 달러 ·
// 5,000,000.00/100,000.00/2,000.00 · RQ No 1/2 · 작성/송신).
const OVS_ESTMT_NTDC_CTRT_INFO: OvsEstmtNtdcCtrtInfo = {
  ctrtBzentyCd: 'TESLA',
  ctrtYmd: '2025-03-01',
  crncCd: '미 달러',
  ctrtAmt: 5000000,
  clmAmt: 100000,
  uclmAmt: 2000,
}

const OVS_ESTMT_NTDC_LIST: OvsEstmtNtdcItem[] = [
  {
    id: '1',
    clmSeq: '1',
    itemSeq: 3,
    tradeSbtBzentyNm: 'A 업체',
    bizNm: 'F-15 부품구매',
    wrtYmd: '2026-02-10',
    docSttsCd: '작성',
    rcvrNm: '김길동',
  },
  {
    id: '2',
    clmSeq: '2',
    itemSeq: 3,
    tradeSbtBzentyNm: 'A 업체',
    bizNm: 'F-15 부품구매',
    wrtYmd: '2026-02-10',
    docSttsCd: '송신',
    rcvrNm: '김길동',
  },
]

// MUI-EX-02-M74 견적통보서상세 — slide58·59 목업(M72 동형 + 품목수 1/변경 0/총액 1,000.00).
const OVS_ESTMT_NTDC_DTL: OvsEstmtNtdcDtl = {
  ctrtNo: 'KD111111111',
  clmSeq: '1',
  clmYmd: '2025-03-01',
  vldYmd: '2025-03-01',
  ctrtYmd: '2025-03-01',
  bizNm: 'F-15 부품구매',
  prcmRqtInstCd: '공군',
  ctrtBzentyCd: 'A 업체',
  miltPicId: '공군',
  bzentyCd: '조달테스트업체',
  picId: '홍길동',
  crncCd: '미 달러',
  rmrkCn: '-',
  titemCnt: 1,
  chgItemCnt: 0,
  gramt: 1000,
  itemSeq: 3,
  dudtYmd: '2026-02-10',
  wrtYmd: '2026-02-10',
  docSttsCd: '작성',
}

// MUI-EX-02-T74 견적통보서 품목 — slide59 목업(단가/금액 1,000.00 포함).
const OVS_ESTMT_NTDC_ITEMS: OvsEstmtNtdcItemRow[] = [
  {
    id: '1111111111113-1',
    no: 1,
    invtNo: '111111111',
    itemNo: '00000-010000-123',
    aplcnEqpmntCd: 'F-15K',
    clmUntprc: 1000,
    trnsMthdCd: '항공',
    dlvgdsRqtYmd: '2025-05-01',
    rcptNo: '12345',
    itemNm: 'IRST LRU-1',
    unitNm: 'EA',
    clmAmt: 1000,
    clmQty: 1,
    estmtChgSeCd: '-',
    rmrkCn: 'AFLC IM : IG(6급 홍길동)',
  },
]

export const MOCK_EX = {
  inspIntgList: INSP_INTG_LIST,
  dlvgdsAvtsmtList: DLVGDS_AVTSMT_LIST,
  inspDlvdocList: INSP_DLVDOC_LIST,
  inspDlvdocDtl: INSP_DLVDOC_DTL,
  inspDlvdocCmdtyList: INSP_DLVDOC_CMDTY_LIST,
  inspDlvdocSbsdDtl: INSP_DLVDOC_SBSD_DTL,
  inspDlvdocSbsdCmdtyList: INSP_DLVDOC_SBSD_CMDTY_LIST,
  pxcndCmcnInspDtl: PXCND_CMCN_INSP_DTL,
  inspDlvdocPrstList: INSP_DLVDOC_PRST_LIST,
  dlvdocRsltDtl: DLVDOC_RSLT_DTL,
  dlvdocRsltCmdtyList: DLVDOC_RSLT_CMDTY_LIST,
  ovsEstmtRqdcList: OVS_ESTMT_RQDC_LIST,
  ovsEstmtRqdcDtl: OVS_ESTMT_RQDC_DTL,
  ovsEstmtRqdcItems: OVS_ESTMT_RQDC_ITEMS,
  ovsEstmtNtdcCtrtInfo: OVS_ESTMT_NTDC_CTRT_INFO,
  ovsEstmtNtdcList: OVS_ESTMT_NTDC_LIST,
  ovsEstmtNtdcDtl: OVS_ESTMT_NTDC_DTL,
  ovsEstmtNtdcItems: OVS_ESTMT_NTDC_ITEMS,
}
