// BD(입찰) 도메인 목업 — 서비스 USE_MOCK 분기 전용. 실호출 로직(services/bd.ts)과 분리 보관.
// ⚠️ 아직 서비스 미배선 페이지는 자체 인라인 MOCK_ 상수를 쓴다 — 그 페이지를 배선할 때
//    페이지의 목업 상수를 이 파일로 이동해 단일 소스로 만든다(현재는 최소 대표값 → 실데이터 교체).
// 값은 설계서 데이터영역/예시(공고번호 형식·코드값·자릿수)를 최대한 반영 — 의미 없는 더미 금지.
import type {
  AgreementDoc,
  BdopnItem,
  BidAplyReceipt,
  BidItemListRow,
  BidPbancDetail,
  BidPbancItem,
  BidProgressRow,
  BidPrgrsItem,
  BidRegResultResponse,
  BidRsltProductItem,
  BidRsltRow,
  BfrPbancBidCnItem,
  BfrPbancInfoItem,
  CabinetFile,
  CnstwkLcnsRow,
  CrncOption,
  ElsgnCert,
  EvlMbcmtTechEvlScrItem,
  LicenseResult,
  NegoRsltRow,
  OvsAtchDoc,
  OvsBidBizExmptnItem,
  OvsBidBizItem,
  OvsBidItem,
  OvsBidPbancDetail,
  OvsBidPrtcpBizItem,
  OvsBidRegRsltItem,
  OvsBidRsltTotalItem,
  OvsBidRsltUnitPriceItem,
  OvsBidWtgrInfo,
  OvsBidWtgrItem,
  OvsExchrtItem,
  OvsGoalPrcRlsItem,
  OvsLockerBidItem,
  OvsLockerPbanItem,
  OvsProbWrotAgreResultInfo,
  OvsRlsVltrnsAtchDoc,
  OvsRlsVltrnsEtdcItem,
  OvsRlsVltrnsItem,
  OvsRlsVltrnsSrngRsltItem,
  OvsSplyInfo,
  OvsTndrDoc,
  OvsTndrDtlItem,
  OvsTndrItitbItem,
  BidSelectOption,
  PlrlRsrvPrcInfo,
  PqResultResponse,
  SmprcScsbdRsltInfo,
  RegBzentyRow,
  RegionResult,
  WrotDoc,
} from '@/types/bd'

// ── 입찰공고 (MUI-BD-01) ──────────────────────────────────────────────────
// 통합목록(MUI-BD-01-M01) — PC 실 인터페이스 IBidPbancList(2026-08-24 판독본) 키 반영.
// (구 BidPbancIntgListPage 인라인 dlt_bidPbancList 를 이관 — 단일 소스.)
// 화면 미소비 공통 필드(코드류·Text류)는 대표값 1세트로 공유.
const pbancCommon = {
  bizRlmCd: 'B01',
  taskRlmCd: 'T01',
  instBidPbancNo: '',
  bidPbancOd: '01',
  jdgmtNo: '',
  bsicStat: '공개',
  bidPrtcpQlfcYn: 'N',
  bsicExptMsg: '',
  bidShpSeCd: '01',
  bidShpSeNm: '일반입찰',
  pbancRtrcnYn: 'N',
} as const

const pbancListBase: BidPbancItem[] = [
  {
    ...pbancCommon,
    rnum: '1',
    prcmNo: '2026LGM0004191',
    taskSeCd: '01',
    taskSeNm: '물품',
    bidSeCd: '01',
    bidSeNm: '경쟁입찰',
    g2bPbancNoOd: 'LDG0097-01',
    pbancSeCd: '01',
    pbancSeNm: '정상공고',
    drctnYr: '2026',
    pbancNo: 'LDG0097',
    pbancOd: '01',
    pbancYmd: '2026-02-12',
    intgRfrncNo: '2026LGM000604191',
    anmtNum: 'LDG0097-01',
    bizNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    deptCd: 'D0001',
    deptNm: '국방부조달본부',
    prchsDmndNo: '2026LGM000604191-01',
    ctrtMthdCd: '01',
    ctrtMthdNm: '일반경쟁',
    bidMthdCd: '01',
    bidMthdNm: '단가제',
    bidRegDdlnDt: '2026-03-16 15:00',
    tndrSbmsnDdlnDt: '2026-03-17 15:00',
    bdopnDt: '2026-03-26 11:00',
    bsicExpt: '184500000',
    bidSeNmText: '경쟁입찰',
    g2bPbancNoOdText: 'LDG0097-01',
    bidRegDdlnDtText: '2026-03-16 15:00',
    ctrtMthdNmText: '일반경쟁',
    pbancYmdText: '2026-02-12',
    prdcpIdntySmdocDdlnDt: '2026-03-15 15:00',
  },
  {
    ...pbancCommon,
    rnum: '2',
    prcmNo: '2026LGM0008220',
    taskSeCd: '02',
    taskSeNm: '용역',
    bidSeCd: '02',
    bidSeNm: '공개수의',
    g2bPbancNoOd: 'LDG0098-01',
    pbancSeCd: '02',
    pbancSeNm: '정정공고',
    drctnYr: '2026',
    pbancNo: 'LDG0098',
    pbancOd: '01',
    pbancYmd: '2026-02-05',
    intgRfrncNo: '2026LGM000598220',
    anmtNum: 'LDG0098-01',
    bizNm: '(26-용역-12) 정보화시스템 유지관리 용역',
    deptCd: 'D0002',
    deptNm: '방위사업청',
    prchsDmndNo: '2026LGM000598220-01',
    ctrtMthdCd: '05',
    ctrtMthdNm: '수의계약',
    bidMthdCd: '02',
    bidMthdNm: '총액제',
    bidRegDdlnDt: '2026-03-10 15:00',
    tndrSbmsnDdlnDt: '2026-03-11 15:00',
    bdopnDt: '2026-03-20 11:00',
    bsicExpt: '96000000',
    bidSeNmText: '공개수의',
    g2bPbancNoOdText: 'LDG0098-01',
    bidRegDdlnDtText: '2026-03-10 15:00',
    ctrtMthdNmText: '수의계약',
    pbancYmdText: '2026-02-05',
    prdcpIdntySmdocDdlnDt: '2026-03-09 15:00',
  },
  {
    ...pbancCommon,
    rnum: '3',
    prcmNo: '2026LGM0001077',
    taskSeCd: '03',
    taskSeNm: '공사',
    bidSeCd: '01',
    bidSeNm: '경쟁입찰',
    g2bPbancNoOd: 'LDG0099-01',
    pbancSeCd: '03',
    pbancSeNm: '취소공고',
    drctnYr: '2026',
    pbancNo: 'LDG0099',
    pbancOd: '01',
    pbancYmd: '2026-01-28',
    intgRfrncNo: '2026LGM000601077',
    anmtNum: 'LDG0099-01',
    bizNm: '(26-공사-07) 군 관사 리모델링 공사',
    deptCd: 'D0003',
    deptNm: '육군본부',
    prchsDmndNo: '2026LGM000601077-01',
    ctrtMthdCd: '03',
    ctrtMthdNm: '제한경쟁',
    bidMthdCd: '02',
    bidMthdNm: '총액제',
    bidRegDdlnDt: '2026-03-05 15:00',
    tndrSbmsnDdlnDt: '2026-03-06 15:00',
    bdopnDt: '2026-03-16 11:00',
    bsicExpt: '1250000000',
    bidSeNmText: '경쟁입찰',
    g2bPbancNoOdText: 'LDG0099-01',
    bidRegDdlnDtText: '2026-03-05 15:00',
    ctrtMthdNmText: '제한경쟁',
    pbancYmdText: '2026-01-28',
    prdcpIdntySmdocDdlnDt: '2026-03-04 15:00',
  },
  {
    ...pbancCommon,
    rnum: '4',
    prcmNo: '2026LGM0005432',
    taskSeCd: '04',
    taskSeNm: '국외',
    bidSeCd: '02',
    bidSeNm: '공개수의',
    g2bPbancNoOd: 'LDG0100-01',
    pbancSeCd: '04',
    pbancSeNm: '긴급공고',
    drctnYr: '2026',
    pbancNo: 'LDG0100',
    pbancOd: '01',
    pbancYmd: '2026-01-20',
    intgRfrncNo: '2026LGM000605432',
    anmtNum: 'LDG0100-01',
    bizNm: '(26-국외-02) 정밀부품 국외 도입',
    deptCd: 'D0004',
    deptNm: '해군본부',
    prchsDmndNo: '2026LGM000605432-01',
    ctrtMthdCd: '01',
    ctrtMthdNm: '일반경쟁',
    bidMthdCd: '01',
    bidMthdNm: '단가제',
    bidRegDdlnDt: '2026-03-02 15:00',
    tndrSbmsnDdlnDt: '2026-03-03 15:00',
    bdopnDt: '2026-03-13 11:00',
    bsicExpt: '532800000',
    bidSeNmText: '공개수의',
    g2bPbancNoOdText: 'LDG0100-01',
    bidRegDdlnDtText: '2026-03-02 15:00',
    ctrtMthdNmText: '일반경쟁',
    pbancYmdText: '2026-01-20',
    prdcpIdntySmdocDdlnDt: '2026-03-01 15:00',
  },
]

// 목업 확장 — 보유 4건을 인덱스로 복제해 총건수(더보기 데모)만큼 구성(공고번호·순번 고유).
const PBANC_TOTAL = 258
const pbancList: BidPbancItem[] = Array.from({ length: PBANC_TOTAL }, (_, i) => {
  const base = pbancListBase[i % pbancListBase.length]
  const pbancNo = `LDG${String(97 + i).padStart(4, '0')}`
  return {
    ...base,
    rnum: String(i + 1),
    pbancNo,
    g2bPbancNoOd: `${pbancNo}-01`,
    g2bPbancNoOdText: `${pbancNo}-01`,
  }
})

const pbancDetail: BidPbancDetail = pbancList[0]

/** getBidPbancDtl 반환 — 공고 상세에 없는 필드(연락처·계약/입찰방법·진행 플래그) 보완. */
const prgrsDetail: BidPrgrsItem = {
  rNum: '1',
  taskSeNm: '물품',
  pbancNo: '2024L0M',
  prcmNo: '2024L0M0030',
  bidNm: '(24-물품-30) 전투복 상·하의 제조 및 납품',
  rfrncNo: '2024L0M0030A1',
  orderInstTelno: '02-1234-5678',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '총액제',
  bidClrsDt: '2024-05-27 10:00',
  tndrSbmsnDdlnDt: '2024-05-28 10:00',
  bzentySeNm: '대표',
  bfhdSrng: false,
  bidPrgrsApfr: true,
  tndr: true,
  techEvl: false,
  prdcpDcmntSbms: false,
  bidRegCfmtnYn: 'Y',
  tndrSbmsnPntmCd: 'pre',
  apfrStatNm: '신청',
  tndrStatNm: '미제출',
}

const progressList: BidProgressRow[] = [
  {
    id: 'prg-1',
    pbancNo: '2024L0M',
    rebidderCnt: '0',
    itemNo: '001',
    pbancNm: '(24-물품-30) 전투복 상·하의 제조 및 납품',
    bidDocDdln: '2024-05-28 10:00',
    opbidDt: '2024-05-28 11:00',
    prgrsStas: '입찰서접수',
  },
]

// ── 개찰목록 · 입찰결과 (MUI-BD-08 · MUI-BD-09) ─────────────────────────────
// 개찰목록(MUI-BD-08-M01) 데이터영역(설계서 slide144) — 구 BdopnListPage 인라인 dlt_bdopnList 이관.
const bdopnListBase: BdopnItem[] = [
  {
    id: '1',
    bidPbancNo: '2026LGM000604191-01',
    bidPbancNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    pbancStasNm: '정상공고',
    taskSeNm: '물품',
    bidMthdNm: '경쟁입찰',
    pbancDt: '2026-02-12',
    opbidDt: '2026-03-26 11:00',
  },
  {
    id: '2',
    bidPbancNo: '2026LGM000598220-01',
    bidPbancNm: '(26-용역-12) 정보화시스템 유지관리 용역',
    pbancStasNm: '정정공고',
    taskSeNm: '용역',
    bidMthdNm: '공개수의',
    pbancDt: '2026-02-10',
    opbidDt: '2026-03-20 11:00',
  },
  {
    id: '3',
    bidPbancNo: '2026LGM000601077-01',
    bidPbancNm: '(26-공사-07) 군 관사 리모델링 공사',
    pbancStasNm: '취소공고',
    taskSeNm: '공사',
    bidMthdNm: '제한경쟁',
    pbancDt: '2026-02-05',
    opbidDt: '2026-03-16 11:00',
  },
  {
    id: '4',
    bidPbancNo: '2026LGM000605432-01',
    bidPbancNm: '(26-국외-02) 정밀부품 국외 도입',
    pbancStasNm: '긴급공고',
    taskSeNm: '국외',
    bidMthdNm: '협상에의한계약',
    pbancDt: '2026-02-14',
    opbidDt: '2026-03-12 11:00',
  },
]

// 목업 확장 — 보유 4건을 인덱스로 복제해 총건수(더보기 데모)만큼 구성(공고번호·id 고유).
const BDOPN_TOTAL = 258
const bdopnList: BdopnItem[] = Array.from({ length: BDOPN_TOTAL }, (_, i) => {
  const base = bdopnListBase[i % bdopnListBase.length]
  return { ...base, id: String(i + 1), bidPbancNo: `${base.bidPbancNo.slice(0, -3)}-${i + 1}` }
})

/**
 * id 로 개찰목록 1건 조회 — 입찰결과상세(BidRsltDtlPage)가 URL 의 :id 로 상단을 채우는 용도.
 * getBidRsltDetail 목업 분기가 이 lookup 을 사용(직접진입/새로고침에도 값 유지).
 */
export function getBdopnById(id: string | undefined): BdopnItem | undefined {
  if (!id) return undefined
  return bdopnList.find((it) => it.id === id)
}

const bidRsltList: BidRsltRow[] = [
  {
    id: 'rslt-1',
    seq: '1',
    cycle: '1',
    bizCode: '0001234',
    bizRegNo: '123-45-67890',
    bizName: '가나다물산',
    ceo: '홍길동',
    result: '낙찰',
  },
]

const negoList: NegoRsltRow[] = [
  {
    id: 'nego-1',
    cycle: '1',
    bizCode: '0001234',
    bizName: '가나다물산',
    ceo: '홍길동',
    estPrice: '180,000,000',
    winRate: '97.5600',
    result: '낙찰',
  },
]

const bidRsltItems: BidRsltProductItem[] = [
  {
    id: 'ritem-1',
    itemNo: '001',
    stockNo: '8405-00-000-0001',
    name: '전투복 상의',
    spec: 'KDS-1234',
    unit: 'EA',
    qty: '1,000',
    unitPrice: '85,000',
    amount: '85,000,000',
  },
]

// 복수예비가격 (MUI-BD-09-P02, slide246 예시값 그대로 — 15개 생성 + 업체 선택번호 8건).
const plrlRsrvPrcInfo: PlrlRsrvPrcInfo = {
  plrlRsrvPrc: [
    { regSn: '1', prprc: 97813420, chcNmtm: 0 },
    { regSn: '2', prprc: 102547340, chcNmtm: 7 },
    { regSn: '3', prprc: 101246870, chcNmtm: 6 },
    { regSn: '4', prprc: 98431560, chcNmtm: 2 },
    { regSn: '5', prprc: 97564100, chcNmtm: 0 },
    { regSn: '6', prprc: 102548230, chcNmtm: 1 },
    { regSn: '7', prprc: 100123980, chcNmtm: 3 },
    { regSn: '8', prprc: 99870000, chcNmtm: 6 },
    { regSn: '9', prprc: 97587700, chcNmtm: 1 },
    { regSn: '10', prprc: 101254450, chcNmtm: 2 },
    { regSn: '11', prprc: 101350470, chcNmtm: 3 },
    { regSn: '12', prprc: 98954910, chcNmtm: 0 },
    { regSn: '13', prprc: 102645450, chcNmtm: 1 },
    { regSn: '14', prprc: 102912370, chcNmtm: 2 },
    { regSn: '15', prprc: 99547560, chcNmtm: 0 },
  ],
  chcNo: [
    { regSn: '2', prprc: 102547340, bzentyNm: '테스트업체1' },
    { regSn: '3', prprc: 101246870, bzentyNm: '테스트업체2' },
    { regSn: '2', prprc: 102547340, bzentyNm: '테스트업체3' },
    { regSn: '4', prprc: 98431560, bzentyNm: '테스트업체4' },
    { regSn: '7', prprc: 100123980, bzentyNm: '테스트업체5' },
    { regSn: '8', prprc: 99870000, bzentyNm: '테스트업체6' },
    { regSn: '14', prprc: 102912370, bzentyNm: '테스트업체7' },
    { regSn: '11', prprc: 101350470, bzentyNm: '테스트업체8' },
  ],
}

// 동가낙찰결과 (MUI-BD-09-P03, slide249 예시값 그대로 — 자동추첨 2건 + 가위바위보 5차).
const smprcScsbdRsltInfo: SmprcScsbdRsltInfo = {
  smprcScsbdRslt: [
    {
      no: '0',
      brno: '123-12-31230',
      bzentyNm: '테스트업체1',
      regDt: '2025-12-01 10:00:00',
      smprcScsbdBzentyYn: '당첨',
    },
    {
      no: '1',
      brno: '222-11-33333',
      bzentyNm: '테스트업체25',
      regDt: '2025-12-01 10:00:00',
      smprcScsbdBzentyYn: '-',
    },
  ],
  rps: [
    {
      bzentyCd: '123',
      bzentyNm: '테스트업체1',
      smprcScsbdRslt1: '가위',
      smprcScsbdRslt2: '바위',
      smprcScsbdRslt3: '보',
      smprcScsbdRslt4: '가위',
      smprcScsbdRslt5: '바위',
    },
    {
      bzentyCd: '456',
      bzentyNm: '테스트업체25',
      smprcScsbdRslt1: '바위',
      smprcScsbdRslt2: '가위',
      smprcScsbdRslt3: '가위',
      smprcScsbdRslt4: '보',
      smprcScsbdRslt5: '보',
    },
  ],
}

// 평가위원별 기술평가점수 (MUI-BD-09-P04, slide251 예시값 — 공개 3건 + 비공개 1건).
const evlMbcmtTechEvlScrList: EvlMbcmtTechEvlScrItem[] = [
  { bzentyNm: '테스트업체1', evlMbcmtNm: '평가위원1', evlScr: 99 },
  { bzentyNm: '테스트업체1', evlMbcmtNm: '평가위원2', evlScr: 91 },
  { bzentyNm: '테스트업체1', evlMbcmtNm: '평가위원3', evlScr: 89 },
  { bzentyNm: '테스트업체1', prvtRsn: '비공개' },
]

// ── 사전심사 (MUI-BD-02) ───────────────────────────────────────────────────
const pqResult: PqResultResponse = {
  pbancInfo: [
    { label: '공고번호', value: '2024L0M' },
    { label: '판단번호', value: '2024L0M0030' },
    { label: '발주기관', value: '방위사업청' },
    { label: '계약방법', value: '경쟁입찰' },
    { label: '입찰방법', value: '총액제' },
  ],
  bzentyInfo: [
    { label: '업체코드', value: '0001234' },
    { label: '업체명', value: '가나다물산' },
    { label: '대표자', value: '홍길동' },
    { label: '사업자등록번호', value: '123-45-67890' },
  ],
  srngRslt: [
    { label: '사전심사점수', value: '95.00' },
    { label: '심사통과여부', value: '통과' },
    { label: '사전심사확정일시', value: '2024-05-22 15:00' },
  ],
  atchFiles: [{ id: 'pq-f1', fileNm: '사전심사결과통지서.pdf', fileSz: '256 KB' }],
}

// ── 입찰진행 (MUI-BD-03) ───────────────────────────────────────────────────
// 입찰진행 목록(MUI-BD-03-M01) 데이터영역(설계서 v1.83 slide71 dlt_bidPrgrsList) — 구 BidPrgrsListForBzentyPage 인라인 이관.
// ⚠️ pbancYmd(공고일자)·bdopnDt(개찰일시)는 카드 표시 항목(slide69) — 7건 모두 공고일자가 과거 + 신청유형
//    플래그 보유라 목업에서는 상세 진입 제한(토스트)이 걸리지 않는다(상세 버튼분기 데모 유지 목적).
// 각 아이템 = (업무구분 + 진행상태 + 실데이터)를 담은 완결 객체 → 그대로 상세(navigate state)로 넘겨 버튼 분기 구동.
const prgrsListBase: BidPrgrsItem[] = [
  // 1) 사전심사 대상·결과 없음 + 입찰참가 신청전 → [사전심사 신청하기]·[입찰참가신청서 작성하기]·[등록반려]
  {
    rNum: '1',
    taskSeNm: '물품',
    pbancNo: '2026LGM000604191-01',
    prcmNo: '2026LGM000604191',
    bidNm: '(26-물품-04) 간편한 아침식 제조 및 납품',
    rfrncNo: '2026LGM56349',
    orderInstTelno: '02-1234-5678',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-16 15:00',
    tndrSbmsnDdlnDt: '2026-03-17 15:00',
    pbancYmd: '2026-02-12',
    bdopnDt: '2026-03-26 11:00',
    bzentySeNm: '대표',
    bfhdSrng: true,
    bidPrgrsApfr: true,
    tndr: false,
    techEvl: false,
    prdcpDcmntSbms: false,
    apfrStatNm: '신청',
    tndrSbmsnPntmCd: 'pre',
    regRjctYn: false,
    bfhdSrngRsltYn: false,
  },
  // 2) 입찰참가 등록확정(사전등록심사) → [입찰서(견적서) 작성하기]·[반려신청조회]
  {
    rNum: '2',
    taskSeNm: '물품',
    pbancNo: '2026LGM000598220-01',
    prcmNo: '2026LGM000598220',
    bidNm: '(26-물품-07) 전투피복류 외 12종 구매',
    rfrncNo: '2026LGM58220',
    orderInstTelno: '02-2345-6789',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-10 15:00',
    tndrSbmsnDdlnDt: '2026-03-11 15:00',
    pbancYmd: '2026-02-06',
    bdopnDt: '2026-03-20 11:00',
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: false,
    prdcpDcmntSbms: false,
    bidRegCfmtnYn: 'Y',
    tndrStatNm: '미제출',
    tndrSbmsnPntmCd: 'pre',
    regRjctYn: true,
  },
  // 3) 입찰서 제출 완료 → 작성류 버튼 숨김(완료 상태)
  {
    rNum: '3',
    taskSeNm: '용역',
    pbancNo: '2026LGM000591033-01',
    prcmNo: '2026LGM000591033',
    bidNm: '(26-용역-12) 정보화시스템 유지관리 용역',
    rfrncNo: '2026LGM59103',
    orderInstTelno: '02-3456-7890',
    ctrtMthdNm: '공개수의',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-08 15:00',
    tndrSbmsnDdlnDt: '2026-03-09 15:00',
    pbancYmd: '2026-02-04',
    bdopnDt: '2026-03-18 11:00',
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: false,
    prdcpDcmntSbms: false,
    bidRegCfmtnYn: 'Y',
    tndrStatNm: '완료',
    tndrSbmsnPntmCd: 'pre',
    regRjctYn: false,
  },
  // 4) 사전심사 합격 + 기술평가 결과 있음 → [사전심사 결과조회]·[기술평가 결과조회]
  {
    rNum: '4',
    taskSeNm: '공사',
    pbancNo: '2026LDG000560349-01',
    prcmNo: '2026LDG000560349',
    bidNm: '(26-공사-03) ○○부대 정비고 신축공사',
    rfrncNo: '2026LDG56034',
    orderInstTelno: '042-123-4567',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-20 15:00',
    tndrSbmsnDdlnDt: '2026-03-21 15:00',
    pbancYmd: '2026-02-16',
    bdopnDt: '2026-03-30 11:00',
    bzentySeNm: '구성',
    bfhdSrng: true,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: true,
    prdcpDcmntSbms: false,
    bidRegCfmtnYn: 'Y',
    tndrStatNm: '제출',
    tndrSbmsnPntmCd: 'pre',
    regRjctYn: false,
    bfhdSrngRsltYn: true,
    techEvlRsltYn: true,
  },
  // 5) 생산능력서류제출 대상 + 사후등록심사 → [생산능력서류 제출]·[입찰서 작성하기]
  {
    rNum: '5',
    taskSeNm: '물품',
    pbancNo: '2026LGM000572118-01',
    prcmNo: '2026LGM000572118',
    bidNm: '(26-물품-09) 방한복 상·하의 세트 제조',
    rfrncNo: '2026LGM57211',
    orderInstTelno: '02-4567-8901',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-18 15:00',
    tndrSbmsnDdlnDt: '2026-03-19 15:00',
    pbancYmd: '2026-02-14',
    bdopnDt: '2026-03-28 11:00',
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: false,
    prdcpDcmntSbms: true,
    apfrStatNm: '신청',
    tndrStatNm: '미제출',
    tndrSbmsnPntmCd: 'post',
    regRjctYn: false,
  },
  // 6) 입찰참가 미동의(반려신청 후) → [반려신청조회]
  {
    rNum: '6',
    taskSeNm: '물품',
    pbancNo: '2026LGM000585277-01',
    prcmNo: '2026LGM000585277',
    bidNm: '(26-물품-11) 야전침대 및 부속품 구매',
    rfrncNo: '2026LGM58527',
    orderInstTelno: '02-5678-9012',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-14 15:00',
    tndrSbmsnDdlnDt: '2026-03-15 15:00',
    pbancYmd: '2026-02-10',
    bdopnDt: '2026-03-24 11:00',
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: true,
    tndr: false,
    techEvl: false,
    prdcpDcmntSbms: false,
    apfrStatNm: '미동의',
    tndrSbmsnPntmCd: 'pre',
    regRjctYn: true,
  },
  // 7) 국외(사후등록심사) — [입찰참가신청서 작성하기]·[입찰서 작성하기] → 국외 화면 분기.
  {
    rNum: '7',
    taskSeNm: '국외',
    pbancNo: 'EFD0007-2500',
    prcmNo: '83990',
    bidNm: 'MD부품국외경쟁입찰',
    rfrncNo: 'BAD83990EFD',
    orderInstTelno: '02-2079-5100',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '총액제',
    bidClrsDt: '2025-12-23 15:00',
    tndrSbmsnDdlnDt: '2025-12-24 10:00',
    pbancYmd: '2025-11-20',
    bdopnDt: '2025-12-24 10:30',
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: false,
    prdcpDcmntSbms: false,
    apfrStatNm: '신청',
    tndrStatNm: '미제출',
    tndrSbmsnPntmCd: 'post',
    regRjctYn: false,
  },
  // 8) 입찰참가신청서 제출완료(신청완료) → [내용 보기]가 입찰참가신청조회(MUI-BD-04-M22)로 분기.
  {
    rNum: '8',
    taskSeNm: '물품',
    pbancNo: '2026LGM000611845-01',
    prcmNo: '2026LGM000611845',
    bidNm: '(26-물품-15) 특수작전용 대물타격 무인항공기 구매',
    rfrncNo: '2026LGM61184',
    orderInstTelno: '02-3456-7890',
    ctrtMthdNm: '경쟁입찰',
    bidMthdNm: '전자입찰',
    bidClrsDt: '2026-03-18 15:00',
    tndrSbmsnDdlnDt: '2026-03-19 15:00',
    pbancYmd: '2026-02-14',
    bdopnDt: '2026-03-27 11:00',
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: false,
    prdcpDcmntSbms: false,
    apfrStatNm: '신청완료',
    tndrStatNm: '미제출',
    tndrSbmsnPntmCd: 'post',
    regRjctYn: false,
  },
]

// 목업 확장 — 보유 8건을 인덱스로 복제해 총건수(더보기 데모)만큼 구성.
// 국외 공고번호(EFD0007-2500)는 '-차수' 재접미사 규칙이 안 맞으므로 원형 유지(설계서 형식 보존).
const PRGRS_TOTAL = 2010
const prgrsList: BidPrgrsItem[] = Array.from({ length: PRGRS_TOTAL }, (_, i) => {
  const base = prgrsListBase[i % prgrsListBase.length]
  const pbancNo = base.taskSeNm === '국외' ? base.pbancNo : `${base.pbancNo.slice(0, -3)}-${i + 1}`
  return { ...base, rNum: String(i + 1), pbancNo }
})

const bidRegResult: BidRegResultResponse = {
  pbancInfo: [
    { label: '공고번호', value: '2024L0M' },
    { label: '입찰건명', value: '(24-물품-30) 전투복 상·하의 제조 및 납품' },
  ],
  bzentyInfo: [
    { label: '업체명', value: '가나다물산' },
    { label: '대표자', value: '홍길동' },
  ],
  bidGrnte: [
    { label: '입찰보증금', value: '1,845,020' },
    { label: '납부방법', value: '보증보험' },
  ],
  jsdBzentyList: [
    { jsdBzentyNm: '가나다물산', bzentyNm: '가나다물산', jsdShNm: '공동이행', invstRt: '60' },
    { jsdBzentyNm: '라마바산업', bzentyNm: '라마바산업', jsdShNm: '공동이행', invstRt: '40' },
  ],
  regSrngRslt: [{ label: '등록심사결과', value: '적격' }],
}

// ── 전자서명 (MUI-BD-04-M21) ───────────────────────────────────────────────
const elsgnCerts: ElsgnCert[] = [
  { id: 'cert-1', certNm: '가나다물산 (사업자범용)', vldPdEndDt: '2026-12-31' },
  { id: 'cert-2', certNm: '홍길동 (개인범용)', vldPdEndDt: '2026-08-15' },
]

/** 전자서명/제출 후 접수결과 — signElsgn·registerOvsBidPrtcpAply·submitOvsTndr 공용. */
const receipt: BidAplyReceipt = { rcptNo: '2024 001 0030', rcptDt: '2024-05-28 12:30' }

// ── 입찰참가신청 / 입찰서 품목 (MUI-BD-04-M06 · MUI-BD-06-M02) ──────────────
// 품목내역(dlt_itemList, 설계서 slide99·129) — 구 BidPrtcpAperWrtPage_Stp2 · TndrWrt_Stp2 인라인 이관.
// getBidItemList(M06) · getBidTndrItemList(M02) 공용.
const itemList: BidItemListRow[] = [
  {
    rNum: '1',
    clsfNo: '001',
    fscCdNtnItemIdntfNo: '1005-37-000-1234',
    itemNm: '특수작전용대물타격무인항공기 기체',
    spcfctNo: 'SPEC-UAV-001',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '619,520,000.00 원',
    drctnAmt: '619,520,000.00 원',
  },
  {
    rNum: '2',
    clsfNo: '002',
    fscCdNtnItemIdntfNo: '1005-37-000-1235',
    itemNm: '특수작전용대물타격무인항공기 지상통제장비',
    spcfctNo: 'SPEC-GCS-002',
    unitNm: 'SET',
    drctnQty: '2',
    drctnUntprc: '312,750,000.00 원',
    drctnAmt: '625,500,000.00 원',
  },
  {
    rNum: '3',
    clsfNo: '003',
    fscCdNtnItemIdntfNo: '1005-37-000-1236',
    itemNm: '특수작전용대물타격무인항공기 정비지원장비',
    spcfctNo: 'SPEC-MNT-003',
    unitNm: 'SET',
    drctnQty: '1',
    drctnUntprc: '184,300,000.00 원',
    drctnAmt: '184,300,000.00 원',
  },
  {
    rNum: '4',
    clsfNo: '004',
    fscCdNtnItemIdntfNo: '1005-37-000-1237',
    itemNm: '특수작전용대물타격무인항공기 대물타격탄',
    spcfctNo: 'SPEC-WHD-004',
    unitNm: 'EA',
    drctnQty: '12',
    drctnUntprc: '27,600,000.00 원',
    drctnAmt: '331,200,000.00 원',
  },
  {
    rNum: '5',
    clsfNo: '005',
    fscCdNtnItemIdntfNo: '1005-37-000-1238',
    itemNm: '특수작전용대물타격무인항공기 데이터링크세트',
    spcfctNo: 'SPEC-DLK-005',
    unitNm: 'SET',
    drctnQty: '2',
    drctnUntprc: '96,400,000.00 원',
    drctnAmt: '192,800,000.00 원',
  },
  {
    rNum: '6',
    clsfNo: '006',
    fscCdNtnItemIdntfNo: '1005-37-000-1239',
    itemNm: '특수작전용대물타격무인항공기 광학감시장비',
    spcfctNo: 'SPEC-EOS-006',
    unitNm: 'EA',
    drctnQty: '3',
    drctnUntprc: '58,900,000.00 원',
    drctnAmt: '176,700,000.00 원',
  },
  {
    rNum: '7',
    clsfNo: '007',
    fscCdNtnItemIdntfNo: '1005-37-000-1240',
    itemNm: '특수작전용대물타격무인항공기 발사대',
    spcfctNo: 'SPEC-LNC-007',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '143,200,000.00 원',
    drctnAmt: '143,200,000.00 원',
  },
  {
    rNum: '8',
    clsfNo: '008',
    fscCdNtnItemIdntfNo: '1005-37-000-1241',
    itemNm: '특수작전용대물타격무인항공기 예비추진체',
    spcfctNo: 'SPEC-PRP-008',
    unitNm: 'EA',
    drctnQty: '6',
    drctnUntprc: '18,450,000.00 원',
    drctnAmt: '110,700,000.00 원',
  },
  {
    rNum: '9',
    clsfNo: '009',
    fscCdNtnItemIdntfNo: '1005-37-000-1242',
    itemNm: '특수작전용대물타격무인항공기 지상운용 소프트웨어',
    spcfctNo: 'SPEC-SW-009',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '74,800,000.00 원',
    drctnAmt: '74,800,000.00 원',
  },
  {
    rNum: '10',
    clsfNo: '010',
    fscCdNtnItemIdntfNo: '1005-37-000-1243',
    itemNm: '특수작전용대물타격무인항공기 운용요원 교육훈련',
    spcfctNo: 'SPEC-EDU-010',
    unitNm: 'EA',
    drctnQty: '1',
    drctnUntprc: '42,300,000.00 원',
    drctnAmt: '42,300,000.00 원',
  },
]

const cnstwkList: CnstwkLcnsRow[] = [
  {
    id: 'cw-1',
    no: '1',
    cnstwkNm: '전기공사업',
    lcnsInfo: '제2020-1234호',
    admDspsInstSe: '없음',
    regDt: '2020-03-01',
    cnstrcAbltEvlAmt: '5,000,000,000',
    stdYr: '2024',
  },
]

const regBzentyList: RegBzentyRow[] = [
  { id: 'rb-1', bizRegNo: '123-45-67890', bizNm: '가나다물산' },
  { id: 'rb-2', bizRegNo: '234-56-78901', bizNm: '라마바산업' },
]

const cabinetFiles: CabinetFile[] = [
  { id: 'cab-1', fileNm: '사업자등록증.pdf', fileSz: 128_000 },
  { id: 'cab-2', fileNm: '공동수급협정서.pdf', fileSz: 256_000 },
]

const agreement: AgreementDoc = {
  id: 'depsPayCert',
  title: '입찰보증금 지급각서',
  body: ['본인은 입찰보증금 납부에 갈음하여 입찰보증금 지급을 확약합니다.'],
  variant: 'agree',
}

const wrot: WrotDoc = {
  id: 'w_p02',
  title: '청렴서약서',
  body: ['본인은 공정한 입찰 참여를 서약합니다.'],
  variant: 'agree',
}

// ── 공통 검색(면허·지역) (MUI-BD-01-P05 · P03) ─────────────────────────────
const licenses: LicenseResult[] = [
  { lcnsCd: '0201', lcnsNm: '전기공사업' },
  { lcnsCd: '0202', lcnsNm: '정보통신공사업' },
]

const regions: RegionResult[] = [
  { sido: '서울특별시', sigungu: '중구' },
  { sido: '경기도', sigungu: '성남시 분당구' },
]

// ══════════════════════════════════════════════════════════════════════════
// 국외(Overseas) 클러스터
// ══════════════════════════════════════════════════════════════════════════

// ── 국외 입찰공고 상세 (MUI-BD-01-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ─────────────────────────────────
const ovsBidPbancDetail: OvsBidPbancDetail = {
  pbancNo: 'EFD0007',
  pbancOd: '2',
  pbancNoOd: 'EFD0007-2',
  pbancTypeNm: '정상공고',
  pbancRqstYmd: '2025-11-22',
  exchrtAplcnYmd: '2025-11-13',
  prchsDmndNo: 'BAD839380-001',
  referNumb: 'BAD83990EFD',
  dtlBizNm: '500MD부품',
  bdopnDt: '2025-12-24 10:30:00',
  bidRegDdlnDt: '2025-12-23 17:00:00',
  tndrSbmsnDdlnDt: '2025-12-24 10:00:00',
  bidTypeNm: '단가제',
  bidMediaNm: '전자입찰',
  ctrtMthdNm: '일반경쟁',
  scsbdMthdNm: '최저가',
  itemCnt: 12,
  deptNm: '국제부품계약팀',
  picNm: '정영금',
  tlno: '02-1234-5678',
  exrtCnt: '14',
  ecrtCnt: '1',
  bidRegEndYn: 'N',
  docId: 'DOC-EFD0007',
  prcmNo: 'BAD83990',
  bidMth: '일반투찰',
  sumDrctnAmt: '$ 126,000.18',
}

const ovsBidItemList: OvsBidItem[] = [
  {
    artclNo: '1',
    inspShpCd: 'A',
    docYn: 'Y',
    docId: 'DOC-EFD0007-1',
    lockerYn: 'N',
    invtNo: '101537518',
    prtsNo: 'T-80U/TBE-3',
    spcfctNo: 'MIL-DTL-45932',
    itemNm: '500MD 헬기 수리부속',
    dudtYmd: '2026-03-25',
    bidUnitCd: 'EA',
    bonSumDrctnQty: '10',
    dangSumDrctnQty: '10',
    jangSumDrctnQty: '10',
    bonSumDrctnUsdAmt: '1,000.00',
    dangSumDrctnUsdAmt: '1,000.00',
    jangSumDrctnUsdAmt: '1,000.00',
    sumDrctnQty: '30',
    crncCd: '미 달러',
    drctnUntprc: 100,
    sumDrctnUsdAmt: '3,000.00',
    aplcnEqpmntCd: '33100401',
    aplcnEqpmntNm: '500MD',
  },
]

const ovsAtchDocList: OvsAtchDoc[] = [
  { docTitl: '공고문안', fileNm: 'notice.pdf', fileSz: 262_144, fileId: 'ATCH-0001' },
  { docTitl: '일반조건', fileNm: 'general.pdf', fileSz: 131_072, fileId: 'ATCH-0002' },
]

// ── 국외 입찰참가신청서 (MUI-BD-04-M71·M78 컨테이너 · T71~T79 · P75/P76/P82/P83(구 M72~M81 — v1.83 재편)) ────────────────────────────────
const ovsBidRegRsltList: OvsBidRegRsltItem[] = [
  { no: '1', prchsDmndNo: 'BAD839380-001', bizNm: '500MD부품', cfmtnRslt: '적격', cfmtnYmd: '2025-12-24' },
]

const ovsBidBizList: OvsBidBizItem[] = [
  {
    prchsDmndNo: 'BAD839380-001',
    bizNm: '500MD부품',
    bdngItemQty: 12,
    bdngTccrAmt: 126_000.18,
    bidGrnteAmt: 6_300.0,
    chckBidGrnteAmt: 6_300.0,
    grntePayMth: '보증보험',
    wtgrNo: 'WTGR-0001',
    grnteInstNm: '서울보증보험',
  },
]

const ovsBidBizExmptnList: OvsBidBizExmptnItem[] = [
  {
    prchsDmndNo: 'BAD839380-002',
    bizNm: 'MD부품 추가',
    bdngItemQty: 3,
    bdngTccrAmt: 30_000.0,
    bidGrnteAmt: 1_500.0,
    chckBidGrnteAmt: 1_500.0,
    gurnAgreDocNo: '연대보증서.pdf',
    giveWrtprmDocNo: '지급각서.pdf',
  },
]

const ovsBidPrtcpBizList: OvsBidPrtcpBizItem[] = [
  {
    prchsDmndNo: 'BAD839380-001',
    bizNm: '500MD부품',
    bdngItemQty: '12',
    bdngTccrAmt: '126,000.18',
    bidGrnteAmt: '6,300.00',
  },
]

const ovsProbWrotAgre: OvsProbWrotAgreResultInfo = {
  wrotAgreYmd: '2025-12-20',
  picNm: '정영금',
  sbtBzentyNm: 'A 해외업체',
  prcmRqtInstNm: '방위사업청',
}

const ovsSplyInfo: OvsSplyInfo = {
  splyBzentyCd: 'S0001',
  splyBzentyNm: 'A 해외업체',
  splyRprsvNm: 'John Doe',
  splyEmlAddr: 'contact@a-ovs.com',
  splyTlno: '02-9876-5432',
  splyFxno: '02-9876-5433',
  splyBzmnNo: '123456789',
  splyAddr: '1 Defense Ave, Seoul',
}

const ovsBidWtgrList: OvsBidWtgrItem[] = [
  {
    wtgrNo: 'WTGR-0001',
    bdopnYmd: '2025-12-24',
    bidNm: '500MD부품 국외경쟁입찰',
    grnteAmt: '6,300.00',
    crdtrRprsvNm: '방위사업청장',
    ctrtrNm: 'A 해외업체',
    isrRprsvNm: '서울보증보험',
  },
]

const ovsBidWtgrInfo: OvsBidWtgrInfo = {
  wtgrNo: 'WTGR-0001',
  grnteAmt: '6,300.00',
  grnteBgngPrd: '2025-12-24 ~ 2026-03-24',
  grfe: '63.00',
  grnteAmtDepstRt: '5',
  ctrtBzentyNm: 'A 해외업체',
  ctrtRprsvNm: 'John Doe',
  crdtrBzentyNm: '방위사업청',
  crdtrRprsvNm: '방위사업청장',
  spcltMttr: '-',
  grntePhrsCn: '보증문 내용',
  pblcnYmd: '2025-12-20',
  isrBzentyNm: '서울보증보험',
  isrRprsvNm: '보증대표',
  isrAddr: '서울시 종로구',
  agtNm: '대리인',
  agtDeptNm: '보증부',
  picNm: '담당자',
  picTlno: '02-1111-2222',
  picFxno: '02-1111-2223',
  bidNm: '500MD부품 국외경쟁입찰',
  bdngTccrAmt: '126,000.18',
  bidNo: 'EFD0007-2',
  bdngDdlnDt: '2025-12-24 10:00:00',
}

// ── 국외 입찰결과 (MUI-BD-09-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ──────────────────────────────────────
const ovsBidRsltUnitPriceItems: OvsBidRsltUnitPriceItem[] = [
  {
    clsfNo: '1',
    prdctNm: '500MD',
    stckNo: '101537518',
    partNo: 'T-80U/TBE-3',
    unit: 'EA',
    qty: '1',
    drctnUprc: '608,000',
    bidUprc: '600,000',
    usdUprc: '450.00',
    usdAmt: '450.00',
    bidRsltNm: '낙찰',
  },
]

const ovsBidRsltTotalItems: OvsBidRsltTotalItem[] = [
  {
    seq: '1',
    bidBzentyNm: 'A 국외업체',
    bizRegNo: '123-45-67890',
    drctnAmt: '126,000,000',
    bidAmt: '120,000,000',
    usdAmt: '90,000.00',
    bidRsltNm: '낙찰',
  },
]

// ── 국외 환율/목표가/보관함 (MUI-BD-01-M74·M75 · MUI-CM-01-M71~M73) ─────────
const exchrtList: OvsExchrtItem[] = [
  { rnum: '1', crncNm: 'USD', ntnNm: '미국', ttsrt: 1_320.5, trdStdrt: 1_310.0, usdExrt: 1.0 },
  { rnum: '2', crncNm: 'EUR', ntnNm: '유럽연합', ttsrt: 1_430.2, trdStdrt: 1_420.0, usdExrt: 1.08 },
]

const ovsGoalPrcRlsList: OvsGoalPrcRlsItem[] = [
  {
    artclNo: '1',
    invtNo: '101537518',
    prtsNo: '59108730001-P400',
    spcfctNo: 'MIL-DTL-45932',
    itemNm: 'COLLAR,BREECH RING',
    dudtYmd: '2026-12-13',
    unitCd: 'EA',
    bscbgtQty: '10',
    athrtQty: '10',
    ltbndQty: '10',
    bscbgtDrctnAmt: 1_000.0,
    athrtDrctnAmt: '1,000.00',
    ltbndDrctnAmt: '1,000.00',
    sumQty: '30',
    drctnUntprc: 100,
    drctnAmt: 3_000.0,
    aplcnEqpmntCd: '33100401',
    aplcnEqpmntNm: '발칸 20미리',
    goalAmt: 3_100.0,
  },
]

const ovsLockerBidItemList: OvsLockerBidItem[] = [
  {
    id: 'BAD83990EFD-1',
    pbancNo: 'EFD0007',
    pbancOd: '2',
    intgRfrncNo: 'BAD83990EFD',
    prchsDmndNo: 'BAD839380-001',
    frcptlArtclNo: '1',
    invtNo: '101537518',
    prtsNo: 'T-80U/TBE-3',
    itemNm: '500MD 헬기 수리부속',
    unitNm: 'EA',
    qty: '1',
    drctnUntprc: 20_767.85,
    crncNm: '미달러',
    lockerYn: 'N',
    tmprBidCnEn: 'N',
    crncCd: 'USD',
  },
]

const ovsLockerPbanList: OvsLockerPbanItem[] = [
  {
    id: 'BAD83990EFD',
    intgRfrncNo: 'BAD83990EFD',
    pbancNo: 'EFD0007',
    pbancOd: '02',
    pbancYr: '2025',
    prchsDmndNo: 'BAD839380-001',
    bizNm: '500MD부품',
    tmprBidCn: 'N',
    splyBzentyNm: '미작성',
    bidPrtcpAply: 'N',
    creditYn: 'N',
    regDdlnDt: '2025-12-23 17:00',
    bdngDdlnDt: '2025-12-24 10:00',
    bdopnYmd: '2025-12-24',
    exchrtAplcnYmd: '2025-11-13',
    bidMth: '경쟁입찰',
    lockerItemQty: '12',
    tmprBidCnStts: '미작성',
    bidPrtcpAplyStts: '미신청',
    bidPrcSysNm: '단가제',
    ctrtMthdNm: '일반경쟁',
  },
]

// ── 국외 공개수의협상 (MUI-BD-12) ──────────────────────────────────────────
const ovsRlsVltrnsItems: OvsRlsVltrnsItem[] = [
  {
    clsfNo: '1',
    qltyGrd: 'A',
    atchDocYn: 'O',
    stckNo: '101537518',
    partNo: 'T-80U/TBE-3',
    specNo: 'MIL-DTL-45932',
    prdctNm: '500MD 헬기 수리부속',
    dlvyBaseYmd: '2026-03-25',
    unit: 'EA',
    mainQty: '10',
    currQty: '10',
    futrQty: '10',
    mainBdgt: '1,000.00',
    currBdgt: '1,000.00',
    futrBdgt: '1,000.00',
    qtySum: '30',
    crncyUnit: '미 달러',
    drctnUprc: '100.00',
    drctnAmt: '3,000.00',
    equipCd: '33100401',
    equipNm: '500MD',
  },
]

const ovsRlsVltrnsAtchDocs: OvsRlsVltrnsAtchDoc[] = [
  { id: 'rvd-1', docSeNm: '공고문안', fileNm: 'notice.pdf', fileSz: '256 KB' },
]

const ovsRlsVltrnsEtdcItems: OvsRlsVltrnsEtdcItem[] = [
  {
    frcptlArtclNo: '1',
    invtNo: '101537518',
    prtsNo: 'T-80U/TBE-3',
    itemNm: '500MD 헬기 수리부속',
    unitNm: 'EA',
    qty: '1',
    drctnUntprc: '608,000.00',
    crncNm: '미 달러',
    itemSbstSe: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    estmtUntprc: '',
  },
]

const ovsRlsVltrnsSrngRslt: OvsRlsVltrnsSrngRsltItem[] = [
  {
    no: '1',
    sbtBzentyCd: 'S0001',
    sbtBzentyNm: 'A 해외업체',
    splyBzentyCd: 'B0001',
    splyBzentyNm: 'A 국외업체',
    docSbmsnYn: 'O',
    estmtAmt: '120,000.00',
    crncNm: '미 달러',
    rnk: '1',
    scsbdYn: '낙찰',
    rsn: '',
    abndDt: '',
    abndRsn: '',
  },
]

// ── 국외 입찰서 상세/제출 (MUI-BD-06) ──────────────────────────────────────
const ovsTndrDetail: OvsTndrDtlItem = {
  pbancNo: 'EFD0007',
  pbancOd: '2',
  prchsDmndNo: 'BAD839380-001',
  intgRfrncNo: 'BAD83990EFD',
  bizNm: '500MD부품',
  bidMth: '일반투찰',
  ctrtMthdNm: '일반경쟁',
  regDdlnDt: '2025-12-23 17:00:00',
  bdngDdlnDt: '2025-12-24 10:00:00',
  bdopnDt: '2025-12-24 10:30:00',
  exchrtAplcnYmd: '2025-11-13',
  picDeptNm: '국제부품계약팀',
  picNm: '정영금',
  picTlno: '02-1234-5678',
  taskSeNm: '국외',
  tndrStatNm: '제출',
  alonbsYn: 'N',
  picMblTelno: '010-1234-5678',
}

const ovsTndrItitbItems: OvsTndrItitbItem[] = [
  {
    frcptlArtclNo: '1',
    invtNo: '101537518',
    prtsNo: 'T-80U/TBE-3',
    itemNm: '500MD 헬기 수리부속',
    unitNm: 'EA',
    qty: '1',
    drctnUntprc: '608,000.00',
    crncNm: '미 달러',
    itemSbstSe: 'Replace',
    itemSbstDocEn: 'O',
    mdfcnInvtNo: '101537519',
    mdfcnPrtsNo: 'T-80U/TBE-3R',
    moqYn: 'Y',
    moqQty: '1',
    moqDocEn: 'O',
    bscbgtDudtYmd: '2025-03-25',
    athrtDudtYmd: '2025-03-25',
    ltbndDudtYmd: '2025-03-25',
    usdExrt: '1.0000',
    splyBzentyNm: 'A 해외업체',
    bdngTccrUntprc: '608,000.00',
    bdngTccrAmt: '608,000.00',
    bdngUsdUntprc: '608,000.00',
    bdngUsdAmt: '608,000.00',
  },
]

const ovsTndrDocList: OvsTndrDoc[] = [
  { id: 'otd-1', atchDocNm: '입찰서', atchFileNm: 'tender.pdf', fileSz: '256 KB' },
]

// ── 국외 이전공고 입찰내역 (MUI-BD-01-M76 · P79(구 M79 — v1.83 재편)) ─────────────────────────────
const bfrPbancLockerList: BfrPbancInfoItem[] = [
  {
    no: '1',
    pbancNo: 'EFD0006',
    pbancOd: '1',
    prchsDmndNo: 'BAD839379-001',
    bdopnYmd: '2025-06-24',
    prtcpItemQty: '5',
    rprsItemNm: 'RECOIL',
  },
]

const bfrPbancBidCnList: BfrPbancBidCnItem[] = [
  {
    no: '1',
    invtNo: '101537518',
    prtsNo: 'T-80U/TBE-3',
    itemNm: '500MD 헬기 수리부속',
    itemSbstSe: 'N',
    itemSbstDocEn: '',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: '',
    splyBzentyNm: 'A 해외업체',
    bdngTccrUntprc: 608_000,
    bdngTccrAmt: 608_000,
    crncNm: '미 달러',
  },
]

// ── 셀렉트 옵션 (통화·입찰업체) ────────────────────────────────────────────
const crncOptions: CrncOption[] = [
  { value: 'USD', label: '미 달러', usdExrt: 1.0 },
  { value: 'EUR', label: '유로', usdExrt: 1.08 },
]

const ovsBidBzentyOptions: BidSelectOption[] = [
  { value: 'S0001', label: 'A 해외업체' },
  { value: 'S0002', label: 'B 해외업체' },
]

/** BD 도메인 목업 단일 소스 — 서비스 USE_MOCK 분기 전용. */
export const MOCK_BD = {
  // 입찰공고
  pbancList,
  pbancDetail,
  prgrsDetail,
  progressList,
  // 개찰·입찰결과
  bdopnList,
  bidRsltList,
  negoList,
  bidRsltItems,
  plrlRsrvPrcInfo,
  smprcScsbdRsltInfo,
  evlMbcmtTechEvlScrList,
  // 사전심사
  pqResult,
  // 입찰진행
  prgrsList,
  bidRegResult,
  // 전자서명·접수
  elsgnCerts,
  receipt,
  // 입찰참가신청/입찰서 품목
  itemList,
  cnstwkList,
  regBzentyList,
  cabinetFiles,
  agreement,
  wrot,
  // 공통 검색
  licenses,
  regions,
  // 국외 공고 상세
  ovsBidPbancDetail,
  ovsBidItemList,
  ovsAtchDocList,
  // 국외 입찰참가신청
  ovsBidRegRsltList,
  ovsBidBizList,
  ovsBidBizExmptnList,
  ovsBidPrtcpBizList,
  ovsProbWrotAgre,
  ovsSplyInfo,
  ovsBidWtgrList,
  ovsBidWtgrInfo,
  // 국외 입찰결과
  ovsBidRsltUnitPriceItems,
  ovsBidRsltTotalItems,
  // 국외 환율/목표가/보관함
  exchrtList,
  ovsGoalPrcRlsList,
  ovsLockerBidItemList,
  ovsLockerPbanList,
  // 국외 공개수의협상
  ovsRlsVltrnsItems,
  ovsRlsVltrnsAtchDocs,
  ovsRlsVltrnsEtdcItems,
  ovsRlsVltrnsSrngRslt,
  // 국외 입찰서 상세/제출
  ovsTndrDetail,
  ovsTndrItitbItems,
  ovsTndrDocList,
  // 국외 이전공고 입찰내역
  bfrPbancLockerList,
  bfrPbancBidCnList,
  // 셀렉트 옵션
  crncOptions,
  ovsBidBzentyOptions,
}
