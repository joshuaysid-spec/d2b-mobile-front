// 대금청구/사후(WM) 도메인 목업 데이터 — USE_MOCK=true 일 때 wmService 가 반환.
// 설계서(05.대금청구및사후 v0.83) 항목설명 항목·형식·slide16/17/19 목업값을 반영(임의 더미 금지).
// ⚠️ 폐쇄망 반입 후 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type {
  MockOvsCmdtyRcvCnfdocItem,
  MockOvsElcrtTxivDtl,
  MockOvsElcrtTxivItem,
  MockOvsElcrtTxivItemRow,
  MockOvsPymtPrgrsItem,
  MockOvsRtnPymtDfryInfoItem,
  MockOvsShpgItemDsctnItem,
  MockCenterPrcmPymtClmDtl,
  MockCstrnPymtClmDtl,
  MockDpsmnItrpyAplyDsctnItem,
  MockDpsmnItrpyApfrDtl,
  MockEpfcClclnClmDtl,
  MockGiveSttsItem,
  MockPrpayAplyDsctnItem,
  MockPrpayApfrDtl,
  MockPxcndCstPymtClmDtl,
  MockPymtClmAplyItem,
  MockPymtClmListItem,
  MockPymtClmPrgrsPrstItem,
  MockPymtClmPrgrsSttItem,
  MockRtnPymtDfryInfoItem,
  MockSbsdPrcmPymtClmDtl,
  MockWmAdocItem,
} from '@/types/mock/wm'

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M01 대금청구통합목록 — slide16 목업(계약번호 2025000000-01 · 물품 구매 ·
// 계약일자 2026-02-10 · 발주기관 제8385부대 · 계약금액 11,616,000 · 뱃지 물품/수의계약).
// 업무구분 × 입찰구분(총액제/단가제) × 진행중 청구 유무 대표 조합.
// ────────────────────────────────────────────────────────────────────────────
const PYMT_CLM_INTG_LIST: MockPymtClmListItem[] = [
  {
    id: '20250000001-01',
    no: 1,
    taskSeCd: '물품',
    ctrtNo: '20250000001',
    ctrtCycl: '01',
    ctrtNm: '물품 구매',
    bzentyNm: '조달테스트업체',
    bidMthdNm: '총액제',
    jntCtrtCdNm: '주계약',
    ctrtYmd: '2026-02-10',
    ctrtAmt: 11616000,
    ctrtMthdCd: '수의계약',
    orderInstNm: '제8385부대',
    pymtClmExstYn: 'Y',
  },
  {
    id: '20250000002-01',
    no: 2,
    taskSeCd: '용역',
    ctrtNo: '20250000002',
    ctrtCycl: '01',
    ctrtNm: '시설 경비 용역',
    bzentyNm: '한국시큐리티',
    bidMthdNm: '단가제',
    jntCtrtCdNm: '주계약',
    ctrtYmd: '2026-01-15',
    ctrtAmt: 52000000,
    ctrtMthdCd: '일반경쟁',
    orderInstNm: '제1120부대',
    pymtClmExstYn: 'N',
  },
  {
    id: '20250000003-01',
    no: 3,
    taskSeCd: '공사',
    ctrtNo: '20250000003',
    ctrtCycl: '01',
    ctrtNm: '막사 보수 공사',
    bzentyNm: '대한건설',
    bidMthdNm: '총액제',
    jntCtrtCdNm: '공동계약',
    ctrtYmd: '2026-01-03',
    ctrtAmt: 385000000,
    ctrtMthdCd: '제한경쟁',
    orderInstNm: '제3651부대',
    pymtClmExstYn: 'Y',
  },
  {
    id: '20250000004-01',
    no: 4,
    taskSeCd: '물품',
    ctrtNo: '20250000004',
    ctrtCycl: '01',
    ctrtNm: '변속기 부품 계약의 건',
    bzentyNm: '한국정공',
    bidMthdNm: '단가제',
    jntCtrtCdNm: '주계약',
    ctrtYmd: '2025-12-22',
    ctrtAmt: 8250000,
    ctrtMthdCd: '지명경쟁',
    orderInstNm: '제8385부대',
    pymtClmExstYn: 'Y',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-P13 대금청구신청목록 — slide19 목업(청구번호 12315-42 · 대금청구서/선금신청서 ·
// 작성일자 2025-10-15 · 청구일자 2025-11-20 · 진행중/진행완료).
// 청구서 종류(선금/착중도금/대금청구/사후정산) 대표 조합 — 상세 분기(M02/M03/M05~/M13) 테스트용.
// ────────────────────────────────────────────────────────────────────────────
const PYMT_CLM_APLY_LIST: MockPymtClmAplyItem[] = [
  {
    id: '12315-42',
    no: 1,
    clmNo: '12315',
    clmOdr: '42',
    clmDocNm: '대금청구서',
    clmAmt: 120000000,
    cnfmSeNm: '-',
    txamt: 12000000,
    wrtYmd: '2025-10-15',
    clmYmd: '2025-11-20',
    prgrsStNm: '진행중',
    taskSeCd: '물품',
    prcmSeNm: '중앙',
  },
  {
    id: '12315-41',
    no: 2,
    clmNo: '12315',
    clmOdr: '41',
    clmDocNm: '선금신청서',
    clmAmt: 55000000,
    cnfmSeNm: '확정',
    txamt: 5500000,
    wrtYmd: '2025-10-15',
    clmYmd: '2025-11-20',
    prgrsStNm: '진행완료',
    taskSeCd: '물품',
    prcmSeNm: '중앙',
  },
  {
    id: '12315-40',
    no: 3,
    clmNo: '12315',
    clmOdr: '40',
    clmDocNm: '착중도금신청서',
    clmAmt: 30000000,
    cnfmSeNm: '확정',
    txamt: 3000000,
    wrtYmd: '2025-09-01',
    clmYmd: '2025-09-20',
    prgrsStNm: '진행완료',
    taskSeCd: '물품',
    prcmSeNm: '중앙',
  },
  {
    id: '12315-39',
    no: 4,
    clmNo: '12315',
    clmOdr: '39',
    clmDocNm: '대금청구서',
    clmAmt: 80000000,
    cnfmSeNm: '확정',
    txamt: 8000000,
    wrtYmd: '2025-08-01',
    clmYmd: '2025-08-20',
    prgrsStNm: '진행완료',
    taskSeCd: '물품',
    prcmSeNm: '부대',
  },
  {
    id: '12315-38',
    no: 5,
    clmNo: '12315',
    clmOdr: '38',
    clmDocNm: '대금청구서',
    clmAmt: 250000000,
    cnfmSeNm: '확정',
    txamt: 25000000,
    wrtYmd: '2025-07-01',
    clmYmd: '2025-07-20',
    prgrsStNm: '진행완료',
    taskSeCd: '공사',
    prcmSeNm: '공사',
  },
  {
    id: '12315-37',
    no: 6,
    clmNo: '12315',
    clmOdr: '37',
    clmDocNm: '대금청구서',
    clmAmt: 120000000,
    cnfmSeNm: '확정',
    txamt: 12000000,
    wrtYmd: '2025-06-01',
    clmYmd: '2025-06-20',
    prgrsStNm: '진행완료',
    taskSeCd: '공사',
    prcmSeNm: '기성대가',
  },
  {
    id: '12315-36',
    no: 7,
    clmNo: '12315',
    clmOdr: '36',
    clmDocNm: '사후정산청구서',
    clmAmt: 10000000,
    cnfmSeNm: '확정',
    txamt: 1000000,
    wrtYmd: '2025-05-01',
    clmYmd: '2025-05-20',
    prgrsStNm: '진행완료',
    taskSeCd: '물품',
    prcmSeNm: '중앙',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M02 선금신청서상세 — slide22 목업(작성자 홍길동 대리 · 010-1234-5678 ·
// 계약 2025-11-23/20257135021/배추김치/10,000,000원 · 신청 2026-01-30/1,000,000원/일백만 원정).
// ────────────────────────────────────────────────────────────────────────────
const PRPAY_APFR_DTL: MockPrpayApfrDtl = {
  taskSeCd: '물품',
  ctrtMthdCd: '수의계약',
  ctrtNo: '20250000001',
  ctrtCycl: '01',
  ctrtNm: '물품구매',
  ctrtYmd: '2026-02-10',
  orderInstNm: '제8385부대',
  ctrtAmt: 11616000,
  wrtrNm: '홍길동',
  wrtrJbttlNm: '대리',
  wrtrEnmtno: '010-1234-5678',
  dlvgdsYmd: '2026-01-01 ~ 2026-12-31',
  mainBizCn: '-',
  aplyCtrtCycl: '20250000001-01',
  rcptnOgnzCd: '방위사업청 계약관리본부 재무관 귀하',
  dmndDt: '2026-01-30',
  aplyAmt: 1000000,
  aplyAmtHngl: '일백만 원정',
  expndCauseAmt: 1000000,
}

// MUI-WM-01-T02 선금 세부신청내역 — slide24~25 구분 목록(재료비 수입/국내/간접 · 노무비 직접/간접 ·
// 경비 직접/간접 · 일반관리비 · 기타 · 합계).
const PRPAY_APLY_DSCTNS: MockPrpayAplyDsctnItem[] = [
  '재료비 - 수입 재료비',
  '재료비 - 국내 재료비',
  '재료비 - 간접 재료비',
  '노무비 - 직접 노무비',
  '노무비 - 간접 노무비',
  '경비 - 직접 경비',
  '경비 - 간접 경비',
  '일반 관리비',
  '기타',
  '합계',
].map((se, i) => ({
  id: se,
  prpayAplyDsctnAmtSeNm: se,
  trgtAmt: 100000000 + i * 1000000,
  arusAplyAmt: 20000000,
  usePrnmntAplyAmt: 30000000,
  aplySumAmt: 50000000,
  aplyAmtRt: 50,
}))

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M03 착·중도금신청서상세 — slide29 목업(선금과 동형 + 품명/납기(최종)/신청구분 착수금).
// ────────────────────────────────────────────────────────────────────────────
const DPSMN_ITRPY_APFR_DTL: MockDpsmnItrpyApfrDtl = {
  taskSeCd: '물품',
  ctrtMthdCd: '수의계약',
  ctrtNo: '20250000004',
  ctrtCycl: '01',
  ctrtNm: '변속기 부품 계약의 건',
  ctrtYmd: '2026-02-10',
  orderInstNm: '제8385부대',
  ctrtAmt: 11616000,
  wrtrNm: '홍길동',
  wrtrJbttlNm: '대리',
  wrtrEnmtno: '010-1234-5678',
  itemNm: '배추김치',
  dudtYmd: '2026-01-01 ~ 2026-12-31',
  mainBizCn: '-',
  fravItrpySecd: '1',
  aplyCtrtCycl: '20250000004-01',
  rcptnOgnzCd: '방위사업청 계약관리본부 재무관 귀하',
  dmndDt: '2026-01-30',
  aplyAmt: 1000000,
  aplyAmtHngl: '일백만 원정',
}

// MUI-WM-01-T04 착·중도금 세부신청내역 — slide31~33(신청금액·승인된 전 차수 수령금액 합계).
const DPSMN_ITRPY_APLY_DSCTNS: MockDpsmnItrpyAplyDsctnItem[] = [
  '재료비 - 수입 재료비',
  '재료비 - 국내 재료비',
  '재료비 - 간접 재료비',
  '노무비 - 직접 노무비',
  '노무비 - 간접 노무비',
  '경비 - 직접 경비',
  '경비 - 간접 경비',
  '일반 관리비',
  '기타',
  '합계',
].map((se, i) => ({
  id: se,
  dpsmnItrpyAplyDsctnSeNm: se,
  trgtAmt: 100000000 + i * 1000000,
  aplyAmt: 30000000,
  aplyStotAmt: 20000000,
  aplyAmtRt: 30,
}))

// MUI-WM-01-T23 지급상태 — slide36 목업(2025 / 20250000 / 01 / 10,000,000원 / 진행중).
const GIVE_STTS_LIST: MockGiveSttsItem[] = [
  {
    id: '20250000001-01',
    rqstYr: '2025',
    ctrtNo: '20250000001',
    ctrtCycl: '01',
    giveClmAmt: 10000000,
    expndStcd: '진행중',
  },
  {
    id: '20250000001-02',
    rqstYr: '2025',
    ctrtNo: '20250000001',
    ctrtCycl: '02',
    giveClmAmt: 5000000,
    expndStcd: '지급완료',
  },
]

// MUI-WM-01-T24 진행상태 (slide80~81) — 부대조달 대금청구 진행상태(UA34) 처리 이력.
// 최신 처리건이 위로 오도록 역순.
const PYMT_CLM_PRGRS_STT_LIST: MockPymtClmPrgrsSttItem[] = [
  {
    no: '3',
    dlvdocPrgrsSt: '대금확정',
    prcsDt: '2026-02-20 14:30',
    prcsUnitBzentyNm: '제8385부대',
    prcsPicNm: '홍길동',
  },
  {
    no: '2',
    dlvdocPrgrsSt: '대금청구',
    prcsDt: '2026-02-12 09:10',
    prcsUnitBzentyNm: 'A 업체',
    prcsPicNm: '김철수',
  },
  {
    no: '1',
    dlvdocPrgrsSt: '선금신청',
    prcsDt: '2026-02-05 16:45',
    prcsUnitBzentyNm: 'A 업체',
    prcsPicNm: '김철수',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M05 대금청구 상세(중앙조달) — slide38~42 목업(청구번호 00000000 · 배추김치 ·
// 대금신청대상 통지 20257135021 · 공급자 A 업체/홍길동 · 세금계산서 1234-5678-9012).
// ────────────────────────────────────────────────────────────────────────────
const CENTER_PRCM_PYMT_CLM_DTL: MockCenterPrcmPymtClmDtl = {
  taskSeCd: '물품',
  ctrtMthdCd: '수의계약',
  ctrtNo: '20250000001',
  ctrtCycl: '01',
  ctrtNm: '물품구매',
  ctrtYmd: '2026-02-10',
  orderInstNm: '제8385부대',
  ctrtAmt: 11616000,
  regDt: '2026-01-30',
  birqNo: '00000000',
  pymtAplyTrgts: [
    {
      id: '100-M2025MST000200',
      avtsmtNo: '100',
      dlvdocNo: 'M2025MST000200',
      srngYmd: '2026-01-01',
      dlvgdsYmd: undefined,
      bgtSecd: '본조',
      dlvgdsAmt: 100000000,
      ctbkAmt: -1000000,
      lqdmg: 500000,
    },
  ],
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  clmtNm: '홍길동',
  clmtTelno: '010-1234-5678',
  enmtno: '010-1234-5678',
  bzentyAddr: '서울특별시 종로구 세종대로 1',
  ymdSeCd: 'I',
  aplyYmd: '2026-01-30',
  vatSecd: 'A',
  dlvgdsAmt: 100000000,
  dlvgdsSplyEqvl: 90909091,
  dlvgdsTxamt: 9090909,
  ddcAmt: 1500000,
  ddcSplyEqvl: 1363636,
  ddcTxamt: 136364,
  ddcDsctnNm: '-',
  clmAmt: 98500000,
  exmptnSbmsnYn: '-',
  grnteInsrncScrtSbmsnYn: '-',
  rmrkCn: '-',
  txivChcYn: 'Y',
  txivNo: '1234-5678-9012',
  txBlls: [
    {
      id: '2026-02-03-1',
      bllPblcnYmd: '02-03',
      itemNm: '-',
      dlvgdsQty: 100,
      ctrtUntprc: 909091,
      splyEqvl: 90909091,
      txamt: 9090909,
    },
  ],
}

// 첨부서류 공통 목업 — slide51 목업(물품제조구매계약서/계약명세서, 파일크기 표기).
const WM_ADOCS: MockWmAdocItem[] = [
  { id: '1', docNm: '물품제조구매계약서', fileNm: '첨부파일명.hwp', fileSize: '786KB' },
  { id: '2', docNm: '계약명세서', fileNm: '첨부파일명이너무길면어떻게노출.hwp', fileSize: '-' },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M06 대금청구상세(부대조달) — slide47~51 목업.
// ────────────────────────────────────────────────────────────────────────────
const SBSD_PRCM_PYMT_CLM_DTL: MockSbsdPrcmPymtClmDtl = {
  taskSeCd: '물품',
  ctrtMthdCd: '수의계약',
  ctrtNo: '20250000001',
  ctrtCycl: '01',
  ctrtNm: '배추김치',
  ctrtYmd: '2026-02-10',
  orderInstNm: '제8385부대',
  ctrtAmt: 11616000,
  aplyYmd: '2026-01-30',
  birqNo: '00000000',
  pymtAplyTrgts: [
    {
      id: '100-M2025MST000200',
      avtsmtNo: '100',
      recrdPblcnNo: 'M2025MST000200-0001',
      rcpmDt: '2026-01-01',
      dlvgdsYmd: undefined,
      bgtCd: '본조',
      dlvgdsAmt: 100000000,
      ctbkAmt: -1000000,
      lqdmg: 500000,
    },
  ],
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  clmtNm: '홍길동',
  clmtTelno: '010-1234-5678',
  bzentyAddr: '서울특별시 종로구 세종대로 1',
  giveSecd: '선금',
  vatSecd: '과세',
  dlvgdsAmt: 100000000,
  splyEqvl: 90909091,
  vatAmt: 9090909,
  ddcAmt: 1500000,
  ddcSplyEqvl: 1363636,
  txamtDdcAmt: 136364,
  ddcDsctnNm: '-',
  giveClmAmt: 98500000,
  cfmtnYn: '확정',
  birqRmrkCn: '-',
  adocs: WM_ADOCS,
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M07 대금청구상세(공사) — slide56~59 목업(공사기간 2026-01-30~2026-12-30 ·
// 대가지급업체 농협 1100-12345-02).
// ────────────────────────────────────────────────────────────────────────────
const CSTRN_PYMT_CLM_DTL: MockCstrnPymtClmDtl = {
  taskSeCd: '공사',
  ctrtMthdCd: '제한경쟁',
  ctrtNo: '20250000003',
  ctrtCycl: '01',
  ctrtNm: '막사 보수 공사',
  ctrtYmd: '2026-01-03',
  orderInstNm: '제3651부대',
  ctrtAmt: 385000000,
  bgncstYmd: '2026-01-30 ~ 2026-12-30',
  rprsvNm: 'A 업체',
  inspYmd: '2026-01-30',
  giveSecd: '-',
  pxcndAmt: 120000000,
  aplyAmt: 120000000,
  birqRmrkCn: '1. 변경내역 표시',
  giveBzentys: [
    {
      id: 'A업체-1100-12345-02',
      fbctnSecd: '-',
      bzentyNm: 'A 업체',
      aplyAmt: 120000000,
      dlngFnstNm: '농협',
      enacno: '1100-12345-02',
      enacnoRlnm: '11000-11200',
      dpstrNm: 'A 업체',
    },
  ],
  adocs: WM_ADOCS,
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M08 대금청구상세(기성대가) — slide62~67 목업(총기성율/총기성금/선금·금회정산액).
// ────────────────────────────────────────────────────────────────────────────
const PXCND_CST_PYMT_CLM_DTL: MockPxcndCstPymtClmDtl = {
  taskSeCd: '공사',
  ctrtMthdCd: '제한경쟁',
  ctrtNo: '20250000003',
  ctrtCycl: '01',
  ctrtNm: '배추김치',
  ctrtYmd: '2026-01-03',
  orderInstNm: '제3651부대',
  ctrtAmt: 385000000,
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  clmtNm: '홍길동',
  clmtTelno: '010-1234-5678',
  giveSecd: '기성대가',
  vatSecd: '과세',
  dlvgdsAmt: 120000000,
  dlvgdsSplyEqvl: 109090909,
  dlvgdsTxamt: 10909091,
  ddcAmt: 1500000,
  ddcSplyEqvl: 1363636,
  ddcTxamt: 136364,
  ddcDsctnNm: '-',
  giveClmAmt: 118500000,
  cfmtnYn: '확정',
  prpamt: 50000000,
  tpxcndRt: 31.2,
  tpxcndAmt: 120000000,
  prpayClclnAmt: 15000000,
  tstmClclnAmt: 10000000,
  birqRmrkCn: '-',
  txivChcYn: 'Y',
  txivNo: '1234-5678-9012',
  txBlls: [
    {
      id: '2026-02-03-1',
      bllPblcnYmd: '02-03',
      itemNm: '-',
      dlvgdsQty: 100,
      ctrtUntprc: 1090909,
      splyEqvl: 109090909,
      txamt: 10909091,
    },
  ],
  adocs: WM_ADOCS,
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M13 사후정산청구상세 — slide73~74 목업(배추김치 · 납기 2026-01-01~2026-12-31 ·
// 일금 10,000,000원/일천만 원정 · 신청내역 구분 목록은 선금(T02)과 동형).
// ────────────────────────────────────────────────────────────────────────────
const EPFC_CLCLN_CLM_DTL: MockEpfcClclnClmDtl = {
  taskSeCd: '물품',
  ctrtMthdCd: '수의계약',
  ctrtNo: '20250000001',
  ctrtCycl: '01',
  ctrtNm: '배추김치',
  ctrtYmd: '2026-01-30',
  orderInstNm: '제8385부대',
  ctrtAmt: 10000000,
  bzentyNm: 'A 업체',
  wrtrNm: '홍길동',
  wrtrJbttlNm: '대리',
  wrtrEnmtno: '010-1234-5678',
  bzentyAddr: '서울특별시 종로구 세종대로 1',
  dudtPrdCn: '2026-01-01 ~ 2026-12-31',
  rmrkCn: '-',
  aplyCtrtCycl: '20250000001-01',
  rcptnOgnzCd: '방위사업청 계약관리본부 재무관 귀하',
  aplyYmd: '2026-01-30',
  aplyAmt: 10000000,
  aplyAmtHngl: '일천만 원정',
  expndCsAmt: 10000000,
  aplyDsctns: [
    '재료비 - 수입 재료비',
    '재료비 - 국내 재료비',
    '재료비 - 간접 재료비',
    '노무비 - 직접 노무비',
    '노무비 - 간접 노무비',
    '경비 - 직접 경비',
    '경비 - 간접 경비',
    '일반 관리비',
    '기타',
    '합계',
  ].map((se, i) => ({
    id: se,
    aplySeCd: se,
    trgtAmt: 100000000 + i * 1000000,
    arusAplyAmt: 20000000,
    usePrnmntAplyAmt: 30000000,
    aplySumAmt: 50000000,
    aplyAmtRt: 50,
  })),
  txivChcYn: 'Y',
  txivNo: '1234-5678-9012',
  txBlls: [
    {
      id: '2026-02-03-1',
      bllPblcnYmd: '02-03',
      itemNm: '-',
      dlvgdsQty: 100,
      ctrtUntprc: 100000,
      splyEqvl: 10000000,
      txamt: 1000000,
    },
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M11 대금청구진행현황 — slide81 목업(신청번호 1234-5678 / 계약번호 2025000000-01 ·
// 계약금액/수령액/청구금액 11,616,000원 · 대금상태 표시레이블).
// ────────────────────────────────────────────────────────────────────────────
const PYMT_CLM_PRGRS_PRST_LIST: MockPymtClmPrgrsPrstItem[] = [
  {
    id: '12345678-01',
    no: 1,
    taskSeCd: '물품',
    birqNo: '1234-5678',
    clmYmd: '2025-11-20',
    ctrtNo: '20250000001',
    ctrtCycl: '01',
    ctrtNm: '물품 구매',
    ctrtAmt: 11616000,
    trgtAmt: 11616000,
    clmAmt: 11616000,
    pymtStNm: '대금청구',
    prcmSeNm: '중앙',
  },
  {
    id: '12345679-01',
    no: 2,
    taskSeCd: '공사',
    birqNo: '1234-5679',
    clmYmd: '2025-10-15',
    ctrtNo: '20250000003',
    ctrtCycl: '01',
    ctrtNm: '막사 보수 공사',
    ctrtAmt: 385000000,
    trgtAmt: 120000000,
    clmAmt: 120000000,
    pymtStNm: '대금확정',
    prcmSeNm: '공사',
  },
  {
    id: '12345680-01',
    no: 3,
    taskSeCd: '용역',
    birqNo: '1234-5680',
    clmYmd: '2025-09-01',
    ctrtNo: '20250000002',
    ctrtCycl: '01',
    ctrtNm: '시설 경비 용역',
    ctrtAmt: 52000000,
    trgtAmt: 26000000,
    clmAmt: 26000000,
    pymtStNm: '선금신청',
    prcmSeNm: '중앙',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M10 대금지불정보(반납) — slide82 목업(계약금액/수령금액/반납금액 11,616,000원).
// ────────────────────────────────────────────────────────────────────────────
const RTN_PYMT_DFRY_INFO_LIST: MockRtnPymtDfryInfoItem[] = [
  {
    id: '12345678-01',
    no: 1,
    taskSeCd: '물품',
    birqNo: '1234-5678',
    ctrtNo: '20250000001',
    ctrtCycl: '01',
    ctrtNm: '물품 구매',
    ctrtAmt: 11616000,
    trgtAmt: 11616000,
    rtnAmt: 11616000,
    bidMthdNm: '단가제',
  },
  {
    id: '12345679-01',
    no: 2,
    taskSeCd: '용역',
    birqNo: '1234-5679',
    ctrtNo: '20250000002',
    ctrtCycl: '01',
    ctrtNm: '시설 경비 용역',
    ctrtAmt: 52000000,
    trgtAmt: 26000000,
    rtnAmt: 1500000,
    bidMthdNm: '총액제',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M71 물품수령확인서목록 — slide89 목업(L/C·B/L 2025000000-01 · 계약 품목수 1 ·
// 계약금액/송장금액/수령금액 1,100.00 · INVOICE 123456).
// ────────────────────────────────────────────────────────────────────────────
const OVS_CMDTY_RCV_CNFDOC_LIST: MockOvsCmdtyRcvCnfdocItem[] = [
  {
    id: '2025000000-01-123456',
    invcNo: 'INVOICE 123456',
    lcNo: '2025000000 - 01',
    blNo: '2025000000 - 01',
    ctrtItemNmbt: 1,
    ctrtAmt: 1100,
    shpgItemCnt: 1,
    invcAmtmn: 1100,
    rcptItemQty: 1,
    rcptAmtmn: 1100,
    ctrtNo: '2025 0000 00',
    ctrtCycl: '01',
  },
  {
    id: '2025000000-02-123457',
    invcNo: 'INVOICE 123457',
    lcNo: '2025000000 - 02',
    blNo: '2025000000 - 02',
    ctrtItemNmbt: 12,
    ctrtAmt: 259300.5,
    shpgItemCnt: 10,
    invcAmtmn: 210800,
    rcptItemQty: 8,
    rcptAmtmn: 180400,
    ctrtNo: '2025 0000 00',
    ctrtCycl: '02',
  },
  {
    id: '2025000001-01-123460',
    invcNo: 'INVOICE 123460',
    lcNo: '2025000001 - 01',
    blNo: '2025000001 - 01',
    ctrtItemNmbt: 3,
    ctrtAmt: 48000,
    shpgItemCnt: 3,
    invcAmtmn: 48000,
    rcptItemQty: 0,
    rcptAmtmn: 0,
    ctrtNo: '2025 0001 00',
    ctrtCycl: '01',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-P73 전자계산서목록 — slide91 목업(계산서 발행번호 1234567890 · 발행일자
// 2025-11-20 · 구분 일반/수정 · 진행상태 국세청승인/작성/저장 · 총 3건).
// ────────────────────────────────────────────────────────────────────────────
const OVS_ELCRT_TXIV_LIST: MockOvsElcrtTxivItem[] = [
  {
    id: '1234567890',
    billSe: '일반',
    prgrsSttsCd: '국세청승인',
    bilPblcnNo: '1234567890',
    ctrtNo: '2025 0000 00',
    pblcnYmd: '2025-11-20',
    ctrtNm: '변속기 부품 계약의 건',
    ctrtAmt: 1100,
    splyEqvl: 1000,
  },
  {
    id: '1234567891',
    billSe: '수정',
    prgrsSttsCd: '작성',
    mdfcnRsn: '기재사항 착오정정',
    bilPblcnNo: '1234567891',
    ctrtNo: '2025 0000 00',
    pblcnYmd: '2025-11-25',
    ctrtNm: '변속기 부품 계약의 건',
    ctrtAmt: 1100,
    splyEqvl: 1000,
  },
  {
    id: '1234567892',
    billSe: '일반',
    prgrsSttsCd: '저장',
    bilPblcnNo: '1234567892',
    ctrtNo: '2025 0000 00',
    pblcnYmd: '2025-12-01',
    ctrtNm: '변속기 부품 계약의 건',
    ctrtAmt: 259300.5,
    splyEqvl: 235727.72,
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M74 전자계산서상세 — slide94~95 목업(공급자 조달업체A · 공급받는자 방위사업청 ·
// 일반정보 계약번호 2025 0000 00-01/책번호 000/일련번호 0000 0000 000/발행번호 1 ·
// 품목 배추김치 2025-11-23 계산서번호 20257135021).
// ────────────────────────────────────────────────────────────────────────────
const OVS_ELCRT_TXIV_DTL: MockOvsElcrtTxivDtl = {
  ...OVS_ELCRT_TXIV_LIST[0],
  bookNo: '000',
  regSn: '0000 0000 000',
  txivNo: '1',
  vatSecd: '과세',
  cfmtnYn: '확정',
  splr: {
    brno: '123-45-67890',
    rprsvNm: '홍길동',
    bzentyNm: '조달업체A',
    bzstatCd: '제조',
    splrAddr: '서울특별시 종로구 세종대로 209',
    splrTpbizNm: '개발',
    splrPicNm: '홍길동',
    splrEntlno: '02-1234-5678',
    splrTkcgDeptNm: '영업개발',
  },
  splrcp: {
    brno: '123-45-67890',
    rprsvNm: '홍길순',
    bzentyNm: '방위사업청',
    splrAddr: '경기도 과천시 관문로 47',
  },
}

const OVS_ELCRT_TXIV_ITEMS: MockOvsElcrtTxivItemRow[] = [
  {
    id: '20257135021-1',
    wrtYmd: '2025-11-23',
    issuNo: '20257135021',
    itemNm: '배추김치',
    brno: '조달업체A',
    dlvgdsQty: 1,
    ctrtUntprc: 10000000,
    splyEqvl: 10000000,
    vatAmt: 1000000,
    rmrkCn: '',
  },
  {
    id: '20257135021-2',
    wrtYmd: '2025-11-23',
    issuNo: '20257135021',
    itemNm: '변속기 조립체',
    brno: '조달업체A',
    dlvgdsQty: 2,
    ctrtUntprc: 5500000,
    splyEqvl: 11000000,
    vatAmt: 1100000,
    rmrkCn: '분할 납품',
  },
  {
    id: '20257135022-1',
    wrtYmd: '2025-11-24',
    issuNo: '20257135022',
    itemNm: '유압 실린더',
    brno: '조달업체A',
    dlvgdsQty: 4,
    ctrtUntprc: 1250000,
    splyEqvl: 5000000,
    vatAmt: 0, // 영세율 — 화면에서 하이픈(-)으로 표시(slide95)
    rmrkCn: '',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-M75 대금지불정보 — slide99 목업(B/L 2025000000-01 · 계약번호 KD0000 0000 00 ·
// L/C XX은행 · 심사 2026-01-20 · 이체/지불 2026-03-10 · INVOICE 123456 · 지불/이체완료).
// ────────────────────────────────────────────────────────────────────────────
const OVS_RTN_PYMT_DFRY_INFO_LIST: MockOvsRtnPymtDfryInfoItem[] = [
  {
    id: '2025000000-01-123456',
    dfryYmd: '2026-03-10',
    expndStts: '지불',
    prgrsSttn: '이체완료',
    payYmd: '2026-03-10',
    cmcUnit: 'USD',
    dfryAmt: 1234567.89,
    arrsPrmny: 12345.67,
    giveAmt: 1222222.22,
    srngYmd: '2026-01-20',
    ctrtNo: 'KD2025 0001 00',
    lcNo: 'XX은행',
    blNo: '2025000000 - 01',
    invcNo: 'INVOICE 123456',
  },
  {
    id: '2025000000-02-123457',
    dfryYmd: '2026-02-14',
    expndStts: '지불',
    prgrsSttn: '이체요청',
    payYmd: '2026-02-14',
    cmcUnit: 'USD',
    dfryAmt: 259300.5,
    arrsPrmny: 0,
    giveAmt: 259300.5,
    srngYmd: '2026-01-05',
    ctrtNo: 'KD2025 0001 00',
    lcNo: 'XX은행',
    blNo: '2025000000 - 02',
    invcNo: 'INVOICE 123457',
  },
  {
    id: '2025000001-01-123460',
    dfryYmd: '2026-01-30',
    expndStts: '심사',
    prgrsSttn: '심사중',
    payYmd: '',
    cmcUnit: 'EUR',
    dfryAmt: 48000,
    arrsPrmny: 480,
    giveAmt: 47520,
    srngYmd: '2026-01-28',
    ctrtNo: 'KD2025 0002 00',
    lcNo: 'YY은행',
    blNo: '2025000001 - 01',
    invcNo: 'INVOICE 123460',
  },
]

// MUI-WM-01-M77 대금지급현황 — 카드/항목이 M75와 동일(slide103). 계약번호로 조회된 건만 표시.
const OVS_PYMT_PRGRS_LIST: MockOvsPymtPrgrsItem[] = OVS_RTN_PYMT_DFRY_INFO_LIST

// ────────────────────────────────────────────────────────────────────────────
// MUI-WM-01-P78 선적품목내역 — slide104 목업(재고번호 1234567890 · 부품번호 259 ·
// 선적수량 12 · 선적단가/선적금액 USD · 총 3건).
// ────────────────────────────────────────────────────────────────────────────
const OVS_SHPG_ITEM_DSCTNS: MockOvsShpgItemDsctnItem[] = [
  {
    id: '2025000000-01-1234567890',
    ctrtNo: 'KD2025 0001 00',
    blNo: '2025000000 - 01',
    invcNo: 'INVOICE 123456',
    invtNo: '1234567890',
    prtsNo: '259',
    itemNm: '변속기 조립체',
    shpgQty: 12,
    shpgUntprc: 102880.65,
    shpgAmt: 1234567.8,
  },
  {
    id: '2025000000-01-1234567891',
    ctrtNo: 'KD2025 0001 00',
    blNo: '2025000000 - 01',
    invcNo: 'INVOICE 123456',
    invtNo: '1234567891',
    prtsNo: '260-A',
    itemNm: '유압 실린더',
    shpgQty: 4,
    shpgUntprc: 12500,
    shpgAmt: 50000,
  },
  {
    id: '2025000000-01-1234567892',
    ctrtNo: 'KD2025 0001 00',
    blNo: '2025000000 - 01',
    invcNo: 'INVOICE 123456',
    invtNo: '1234567892',
    prtsNo: '261-B',
    itemNm: '오일 필터',
    shpgQty: 30,
    shpgUntprc: 320.5,
    shpgAmt: 9615,
  },
]

export const MOCK_WM = {
  pymtClmIntgList: PYMT_CLM_INTG_LIST,
  pymtClmAplyList: PYMT_CLM_APLY_LIST,
  prpayApfrDtl: PRPAY_APFR_DTL,
  prpayAplyDsctns: PRPAY_APLY_DSCTNS,
  dpsmnItrpyApfrDtl: DPSMN_ITRPY_APFR_DTL,
  dpsmnItrpyAplyDsctns: DPSMN_ITRPY_APLY_DSCTNS,
  giveSttsList: GIVE_STTS_LIST,
  pymtClmPrgrsSttList: PYMT_CLM_PRGRS_STT_LIST,
  centerPrcmPymtClmDtl: CENTER_PRCM_PYMT_CLM_DTL,
  sbsdPrcmPymtClmDtl: SBSD_PRCM_PYMT_CLM_DTL,
  cstrnPymtClmDtl: CSTRN_PYMT_CLM_DTL,
  pxcndCstPymtClmDtl: PXCND_CST_PYMT_CLM_DTL,
  epfcClclnClmDtl: EPFC_CLCLN_CLM_DTL,
  pymtClmPrgrsPrstList: PYMT_CLM_PRGRS_PRST_LIST,
  rtnPymtDfryInfoList: RTN_PYMT_DFRY_INFO_LIST,
  ovsCmdtyRcvCnfdocList: OVS_CMDTY_RCV_CNFDOC_LIST,
  ovsElcrtTxivList: OVS_ELCRT_TXIV_LIST,
  ovsElcrtTxivDtl: OVS_ELCRT_TXIV_DTL,
  ovsElcrtTxivItems: OVS_ELCRT_TXIV_ITEMS,
  ovsRtnPymtDfryInfoList: OVS_RTN_PYMT_DFRY_INFO_LIST,
  ovsPymtPrgrsList: OVS_PYMT_PRGRS_LIST,
  ovsShpgItemDsctns: OVS_SHPG_ITEM_DSCTNS,
}
