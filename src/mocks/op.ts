// 조달(OP) 도메인 목업 데이터 — USE_MOCK=true 일 때 opService 가 반환.
// 설계서(조달계획 통합목록/상세) 데이터영역 항목·형식을 반영(임의 더미 금지).
// ⚠️ 폐쇄망 반입 후 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type {
  OpAnlPrcmPlanItem,
  OpDeptSearchResult,
  OpItemSearchResult,
  OpItemSpec,
  OpOpinion,
  OpPlanDetail,
  OpPlanItem,
  OpProducerSearchResult,
  PrcDataItem,
  WarSplBzEnty,
  WarSplCnfg,
  WarSplIdntf,
  WarSplRef,
} from '@/types/op'

// 통합목록 카드(설계서 dlt_prcmPlanList) — 검색유형별 대표 샘플.
// (구 PrcmPlanIntgListPage 인라인 목업 이관 — 목록 배선 시 페이지 상수 삭제, 단일 소스는 여기)
const BASE_PLAN_LIST: OpPlanItem[] = [
  {
    id: '1',
    srchType: 'plan',
    no: 1,
    taskSeNm: '물품',
    ctrtMthdCd: '수의계약',
    bidMthdCd: '전자입찰',
    prcmNo: '6000A',
    prcmPlanNm: "'26년 K5방독면",
    orderPrnmntYm: '2026-03',
    deptCd: '화력총괄계약팀',
    userNm: '김조달',
    drctnAmt: 11616000,
    implPrgrsStcd: '조달계획',
  },
  {
    id: '2',
    srchType: 'plan',
    no: 2,
    taskSeNm: '용역',
    ctrtMthdCd: '일반경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000B',
    prcmPlanNm: "'26년 정보화 유지보수 사업",
    orderPrnmntYm: '2026-04',
    deptCd: '정보화팀',
    userNm: '이정보',
    drctnAmt: 92472000,
    implPrgrsStcd: '공고게시',
  },
  {
    id: '3',
    srchType: 'plan',
    no: 3,
    taskSeNm: '공사',
    ctrtMthdCd: '제한경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000C',
    prcmPlanNm: "'26년 막사 보수 공사",
    orderPrnmntYm: '2026-02',
    deptCd: '시설관리단',
    userNm: '박시설',
    drctnAmt: 158000000,
    implPrgrsStcd: '계약대기',
  },
  {
    id: '4',
    srchType: 'plan',
    no: 4,
    taskSeNm: '국외',
    ctrtMthdCd: '일반경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000D',
    prcmPlanNm: "'26년 야간투시경 해외구매",
    orderPrnmntYm: '2026-05',
    deptCd: '해외조달팀',
    userNm: '최해외',
    drctnAmt: 540000000,
    implPrgrsStcd: '계약완료',
  },
  {
    id: '5',
    srchType: 'spec',
    no: 5,
    taskSeNm: '용역',
    ctrtMthdCd: '일반경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000E',
    prcmPlanNm: "'26년 통신장비 사전규격",
    orderPrnmntYm: '2026-03',
    deptCd: '통신정보팀',
    userNm: '정통신',
    drctnAmt: 47200000,
    implPrgrsStcd: '조달계획',
  },
  {
    id: '7',
    srchType: 'spec',
    no: 6,
    taskSeNm: '물품',
    ctrtMthdCd: '수의계약',
    bidMthdCd: '전자입찰',
    prcmNo: '6000G',
    prcmPlanNm: "'26년 전투화 사전규격",
    orderPrnmntYm: '2026-04',
    deptCd: '피복관리팀',
    userNm: '한피복',
    drctnAmt: 33500000,
    implPrgrsStcd: '조달계획',
  },
  {
    id: '8',
    srchType: 'spec',
    no: 7,
    taskSeNm: '공사',
    ctrtMthdCd: '제한경쟁',
    bidMthdCd: '전자입찰',
    prcmNo: '6000H',
    prcmPlanNm: "'26년 정비고 증축 사전규격",
    orderPrnmntYm: '2026-05',
    deptCd: '시설관리단',
    userNm: '박시설',
    drctnAmt: 210000000,
    implPrgrsStcd: '공고게시',
  },
]

// 보유 샘플(7건)을 100건으로 부풀림 — 더보기(10개씩)·검색 데모용. id·prcmNo·no 는 인덱스로 고유화.
// 실백엔드 연동 시 이 파일은 미사용(서비스 apiClient 분기)이라 그대로 두면 된다.
const PLAN_LIST: OpPlanItem[] = Array.from({ length: 100 }, (_, i) => {
  const base = BASE_PLAN_LIST[i % BASE_PLAN_LIST.length]
  return { ...base, id: String(i + 1), no: i + 1, prcmNo: `${base.prcmNo}-${i + 1}` }
})

// 상세 헤더/요약 — 목록 카드와 동일 필드(목록→상세 표준). 상세 전용 섹션은 페이지 목업 소관.
const PLAN_DETAIL: OpPlanDetail = PLAN_LIST[0]

// 품목명세서(설계서 slide25) — 단가/금액 비공개.
const ITEM_SPECS: OpItemSpec[] = [
  { no: 1, invtNo: '4240-3753116870', itemNm: '방독면,화학-생물학전용(K5)', specNo: '4240-4009', qty: '25', unit: 'EA' },
  { no: 2, invtNo: '4240-3753116871', itemNm: '정화통,방독면용(K5)', specNo: '4240-4010', qty: '30', unit: 'EA' },
  { no: 3, invtNo: '4240-3753116872', itemNm: '휴대낭,방독면용(K5)', specNo: '4240-4011', qty: '50', unit: 'EA' },
]

// 업체의견(설계서 slide26) — 비공개/공개 혼합.
const OPINIONS: OpOpinion[] = [
  { id: '1', isPublic: false, company: '㈜미래회사', title: '업체의 의견이 있습니다', name: '홍길동', datetime: '2026-01-03 14:50' },
  { id: '2', isPublic: true, company: '㈜미래회사', title: '업체의 의견이 있습니다', name: '홍길동', datetime: '2026-01-03 14:50' },
  { id: '3', isPublic: true, company: '㈜미래회사', title: '업체의 의견이 있습니다', name: '성춘향', datetime: '2026-01-03 14:50' },
]

// 연간조달계획(dlt_anlPrcmPlanList) — 통합목록 annual 카드 + 국외 연간조달계획상세(M78) 공용.
// 설계서 slide76(카드 2건: 육군/공군) · slide77(상세 전체 항목) 목업값 그대로.
const BASE_ANNUAL_LIST: OpAnlPrcmPlanItem[] = [
  {
    id: 'a1',
    srchType: 'annual',
    no: 1,
    taskSeNm: '국외',
    prcmRqtInstCd: '육군',
    prcmRqtNo: 'ABCD1234',
    fscCdNtnItemIdntfNo: 'A1234567890',
    prtsNo: 'AA',
    inspShcd: '-',
    prdcrSgn: 'A123',
    prdcrDpcn: '2',
    unitCd: 'EA',
    drctnQty: 1600,
    drctnUntprc: 4000,
    drctnAmt: 6400000,
    itemNm: 'GBU-12 신관 FMU-139급(비)',
    spcfctNo: '-',
    aplcnEqpmntCd: '-',
    aplcnEqpmntNm: '-',
    prgrNo: '-',
    clsfNo: '-',
    functnNm: '-',
    frcptlItemMsprgStcd: '지시중',
    itemFwkCd: '-',
    rcptPd: '2026-02-10 ~ 2026-02-12',
  },
  {
    id: 'a2',
    srchType: 'annual',
    no: 2,
    taskSeNm: '국외',
    prcmRqtInstCd: '공군',
    prcmRqtNo: 'EFGH1234',
    fscCdNtnItemIdntfNo: 'F987654123',
    prtsNo: 'BB',
    inspShcd: '-',
    prdcrSgn: 'B123',
    prdcrDpcn: '1',
    unitCd: 'EA',
    drctnQty: 320,
    drctnUntprc: 12500,
    drctnAmt: 4000000,
    itemNm: 'AIM-9 발사대 LAU-129급(비)',
    spcfctNo: '-',
    aplcnEqpmntCd: '-',
    aplcnEqpmntNm: '-',
    prgrNo: '-',
    clsfNo: '-',
    functnNm: '-',
    frcptlItemMsprgStcd: '지시중',
    itemFwkCd: '-',
    rcptPd: '2026-01-03 ~ 2026-01-14',
  },
]

// 조달계획 목록과 같은 방식으로 100건 부풀림(더보기 데모). id 는 'a' 접두사로 조달계획 id 와 분리.
const ANNUAL_LIST: OpAnlPrcmPlanItem[] = Array.from({ length: 100 }, (_, i) => {
  const base = BASE_ANNUAL_LIST[i % BASE_ANNUAL_LIST.length]
  return { ...base, id: `a${i + 1}`, no: i + 1, prcmRqtNo: `${base.prcmRqtNo}-${i + 1}` }
})

// M78 상세 — 목록 첫 건과 동일(설계서 slide77 '목록 데이터 전체 표시').
const ANL_PRCM_PLAN_DTL: OpAnlPrcmPlanItem = ANNUAL_LIST[0]

// 품목별 검색 결과(P71).
const ITEM_SEARCH: OpItemSearchResult[] = [
  { invtNo: '152302089999', prtsNo: '502323-12542-032', itemNm: 'BELLCOSRA ASSEMBTL' },
  { invtNo: '152302081234', prtsNo: '502323-12542-001', itemNm: 'K5 방독면 정화통' },
  { invtNo: '843012005678', prtsNo: '770110-00021-100', itemNm: '전투화 깔창' },
]

// 생산자 검색 결과(P72).
const PRODUCER_SEARCH: OpProducerSearchResult[] = [
  { cage: '00000', prdctnNm: 'ORDNANCE CORPS' },
  { cage: '00001', prdctnNm: 'A B MGC CO' },
  { cage: '00003', prdctnNm: 'A B C PRODUCTS CO INC' },
]

// 발주부서(기관) 검색 결과(P04).
const DEPT_SEARCH: OpDeptSearchResult[] = [
  { instNm: '육군중앙경리단', instSe: '경리단' },
  { instNm: '육군군수사령부', instSe: '군수사' },
  { instNm: '육군교육사령부', instSe: '교육사' },
  { instNm: '육군3사관학교', instSe: '학교' },
]

// ── 목록정보조회(군수품 목록) — P76 3탭 + P77. 설계서 slide77~81 목업값 그대로. ──

// 형상자료(T73) — 식별정보(dm_itemInfo) + 참조번호(dl_refList).
const WAR_SPL_CNFG: WarSplCnfg = {
  itemInfo: {
    invtNo: '1523-12-1251232',
    itemNmEng: 'BELSCDFE ASSEMVGBY',
    itemNmKor: '밸크랭크 조립체',
    fsc: '1612',
  },
  refList: [
    {
      id: '1',
      rfrncNo: '70400-01230-023',
      type: '도면번호',
      prdctnCd: '78245',
      prdctnNm: 'SIBSK ERKAS EKCORPO',
    },
    {
      id: '2',
      rfrncNo: '70400-01230-024',
      type: '기타',
      prdctnCd: '23129',
      prdctnNm: 'US ARPY ACLHGET ASLTM',
    },
  ],
}

// 식별자료(T74) — dm_idntfInfo. 설계서 목업에서 식별 가능한 값(INC 111 · 대체재고 A12000 ·
// CS 11112 · 군급분류 1000 · MODEL-Y/모델Y · 1980-01-05 · 2026-03-06)은 그대로,
// 나머지 코드성 항목은 설계서 자리수/형식(1자리 코드)에 맞춘 값.
const WAR_SPL_IDNTF: WarSplIdntf = {
  fsc: '1000',
  itemNmEng: 'MODEL-Y',
  itemNmKor: '모델Y',
  fcc: 'M',
  drc: '9',
  fiigNo: 'A231',
  inc: '111',
  adpec: 'A',
  pmic: 'B',
  rpdmrc: '0',
  sbstInvtNo: 'A12000',
  tiic: 'A',
  cs: '11112',
  ntl: '1',
  ls: '0',
  demil: 'A',
  esdc: '0',
  nsc: '0',
  hmic: 'A',
  hcc: '0',
  picNm: '홍길동',
  niinYmd: '1980-01-05',
  chgYmd: '2026-03-06',
}

// 참고자료(T75) — dl_refList. 설계서 목업이 동일 값 3건 반복.
const WAR_SPL_REF: WarSplRef[] = [
  {
    id: '1',
    refNo: '10000-012345-123',
    nscm: '12345',
    rnfc: '4',
    rncc: '3',
    rnvc: '2',
    dac: '1',
    rnaa: 'KE',
    rnsc: '0',
    rnjc: '0',
    sadc: 'A',
  },
  {
    id: '2',
    refNo: '10000-012345-124',
    nscm: '12345',
    rnfc: '4',
    rncc: '3',
    rnvc: '2',
    dac: '1',
    rnaa: 'KE',
    rnsc: '0',
    rnjc: '0',
    sadc: 'A',
  },
  {
    id: '3',
    refNo: '10000-012345-125',
    nscm: '12345',
    rnfc: '4',
    rncc: '3',
    rnvc: '2',
    dac: '1',
    rnaa: 'KE',
    rnsc: '0',
    rnjc: '0',
    sadc: 'A',
  },
]

// ── NIIN 검색 결과 — 디폴트 값 아래에 이어붙는 블록. 디폴트와 구분되는 다른 품목 값. ──

const WAR_SPL_CNFG_SRCH: WarSplCnfg = {
  itemInfo: {
    invtNo: '1612-12-3387451',
    itemNmEng: 'ROTOR HEAD ASSEMBLY',
    itemNmKor: '회전익 두부 조립체',
    fsc: '1615',
  },
  refList: [
    {
      id: 's1',
      rfrncNo: '70400-01230-118',
      type: '도면번호',
      prdctnCd: '55129',
      prdctnNm: 'HANWHA AEROSPACE CO LTD',
    },
  ],
}

const WAR_SPL_IDNTF_SRCH: WarSplIdntf = {
  fsc: '1615',
  itemNmEng: 'ROTOR HEAD ASSEMBLY',
  itemNmKor: '회전익 두부 조립체',
  fcc: 'K',
  drc: '2',
  fiigNo: 'A118',
  inc: '204',
  adpec: 'N',
  pmic: 'A',
  rpdmrc: '1',
  sbstInvtNo: 'B33874',
  tiic: 'B',
  cs: '22140',
  ntl: '2',
  ls: '1',
  demil: 'B',
  esdc: '1',
  nsc: '0',
  hmic: 'N',
  hcc: '1',
  picNm: '김목록',
  niinYmd: '1992-11-20',
  chgYmd: '2026-05-14',
}

const WAR_SPL_REF_SRCH: WarSplRef[] = [
  {
    id: 's1',
    refNo: '20000-033874-511',
    nscm: '55129',
    rnfc: '2',
    rncc: '1',
    rnvc: '3',
    dac: '2',
    rnaa: 'KD',
    rnsc: '1',
    rnjc: '1',
    sadc: 'B',
  },
]

// 업체정보(P77) — dm_bzentyInfo. 생산자부호(prdctnCd)별 조회 결과.
const WAR_SPL_BZ_ENTY: WarSplBzEnty = {
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  addr: '서울특별시 종로구 세종대로 209',
  bzmnNo: '123-45-67890',
  tlno: '02-1234-5678',
  fxno: '02-1234-6789',
}

// 품목별 가격자료(P75) — dl_resultList(설계서 slide74 22항목).
// 품목명세서 목업 재고번호(4240-3753116870/-71/-72)와 정합 — [보기] 프리필 조회가 결과를 갖도록.
// 재고번호(NIIN)마다 2건씩 — 목업 slide72 결과 표시(순번 1·2)와 동일하게 어떤 [보기] 진입도 2건.
//   순번(no)은 "검색결과 순번"이라 서비스(getPrcDataList)가 필터 후 1부터 재부여한다 — 여기 no 는 자리채움.
// 획득구분 코드값은 잠정('01'~'06') — TODO(백엔드 확정), types/op.ts PrcDataSearchRequest 참고.
const PRC_DATA_LIST: PrcDataItem[] = [
  {
    no: 1,
    acqstnTypeCd: '01',
    acqstnTypeNm: '상업실적사',
    fsc: '4240',
    niin: '3753116870',
    prtsNo: 'A7005265',
    unitNm: 'EA',
    spcfctNo: '4240-4009',
    aplcnEqpmntCd: 'EQ001',
    aplcnEqpmntNm: '화생방보호장비',
    itemNm: '방독면,화학-생물학전용(K5)',
    crncNm: 'KRW',
    crncEngNm: '원화',
    ntnCd: 'KR',
    ntnNm: '대한민국',
    untprc: '152,000',
    qty: '25',
    ctrtYmd: '2025-11-20',
    bzentyCd: '55129',
    bzentyNm: '에스지생활안전(주)',
    acqstnYmd: '2025-12-15',
    ctrtNo: '2025L0M0030A1F1-01',
  },
  {
    no: 2,
    acqstnTypeCd: '02',
    acqstnTypeNm: 'FMS실적가',
    fsc: '4240',
    niin: '3753116870',
    prtsNo: 'A7005265',
    unitNm: 'EA',
    spcfctNo: '4240-4009',
    aplcnEqpmntCd: 'EQ001',
    aplcnEqpmntNm: '화생방보호장비',
    itemNm: 'MASK,CHEMICAL-BIOLOGICAL',
    crncNm: 'USD',
    crncEngNm: '미국달러',
    ntnCd: 'US',
    ntnNm: '미국',
    untprc: '112.50',
    qty: '100',
    ctrtYmd: '2024-08-01',
    bzentyCd: '81349',
    bzentyNm: 'AVON PROTECTION SYSTEMS',
    acqstnYmd: '2024-10-30',
    ctrtNo: '2024L0M0030A1F1-01',
  },
  {
    no: 3,
    acqstnTypeCd: '01',
    acqstnTypeNm: '상업실적사',
    fsc: '4240',
    niin: '3753116871',
    prtsNo: 'A7005266',
    unitNm: 'EA',
    spcfctNo: '4240-4010',
    aplcnEqpmntCd: 'EQ001',
    aplcnEqpmntNm: '화생방보호장비',
    itemNm: '정화통,방독면용(K5)',
    crncNm: 'KRW',
    crncEngNm: '원화',
    ntnCd: 'KR',
    ntnNm: '대한민국',
    untprc: '28,500',
    qty: '30',
    ctrtYmd: '2025-06-10',
    bzentyCd: '55129',
    bzentyNm: '에스지생활안전(주)',
    acqstnYmd: '2025-07-22',
    ctrtNo: '2025L0M0041B2F1-02',
  },
  {
    no: 4,
    acqstnTypeCd: '05',
    acqstnTypeNm: '업체공표(견적)가',
    fsc: '4240',
    niin: '3753116872',
    prtsNo: 'A7005267',
    unitNm: 'EA',
    spcfctNo: '4240-4011',
    aplcnEqpmntCd: 'EQ001',
    aplcnEqpmntNm: '화생방보호장비',
    itemNm: '휴대낭,방독면용(K5)',
    crncNm: 'KRW',
    crncEngNm: '원화',
    ntnCd: 'KR',
    ntnNm: '대한민국',
    untprc: '12,000',
    qty: '50',
    ctrtYmd: '2025-03-05',
    bzentyCd: '61234',
    bzentyNm: '대한안전산업(주)',
    acqstnYmd: '2025-04-18',
    ctrtNo: '2025L0M0052C1F1-03',
  },
  {
    no: 5,
    acqstnTypeCd: '02',
    acqstnTypeNm: 'FMS실적가',
    fsc: '4240',
    niin: '3753116871',
    prtsNo: 'A7005266',
    unitNm: 'EA',
    spcfctNo: '4240-4010',
    aplcnEqpmntCd: 'EQ001',
    aplcnEqpmntNm: '화생방보호장비',
    itemNm: 'CANISTER,CHEMICAL-BIOLOGICAL MASK',
    crncNm: 'USD',
    crncEngNm: '미국달러',
    ntnCd: 'US',
    ntnNm: '미국',
    untprc: '21.80',
    qty: '200',
    ctrtYmd: '2024-05-14',
    bzentyCd: '81349',
    bzentyNm: 'AVON PROTECTION SYSTEMS',
    acqstnYmd: '2024-07-02',
    ctrtNo: '2024L0M0041B2F1-05',
  },
  {
    no: 6,
    acqstnTypeCd: '01',
    acqstnTypeNm: '상업실적사',
    fsc: '4240',
    niin: '3753116872',
    prtsNo: 'A7005267',
    unitNm: 'EA',
    spcfctNo: '4240-4011',
    aplcnEqpmntCd: 'EQ001',
    aplcnEqpmntNm: '화생방보호장비',
    itemNm: '휴대낭,방독면용(K5)',
    crncNm: 'KRW',
    crncEngNm: '원화',
    ntnCd: 'KR',
    ntnNm: '대한민국',
    untprc: '11,500',
    qty: '80',
    ctrtYmd: '2024-09-26',
    bzentyCd: '55129',
    bzentyNm: '에스지생활안전(주)',
    acqstnYmd: '2024-11-07',
    ctrtNo: '2024L0M0052C1F1-02',
  },
]

export const MOCK_OP = {
  planList: [...PLAN_LIST, ...ANNUAL_LIST],
  planDetail: PLAN_DETAIL,
  itemSpecs: ITEM_SPECS,
  opinions: OPINIONS,
  anlPrcmPlanDtl: ANL_PRCM_PLAN_DTL,
  itemSearch: ITEM_SEARCH,
  producerSearch: PRODUCER_SEARCH,
  deptSearch: DEPT_SEARCH,
  warSplCnfg: WAR_SPL_CNFG,
  warSplIdntf: WAR_SPL_IDNTF,
  warSplRef: WAR_SPL_REF,
  warSplCnfgSrch: WAR_SPL_CNFG_SRCH,
  warSplIdntfSrch: WAR_SPL_IDNTF_SRCH,
  warSplRefSrch: WAR_SPL_REF_SRCH,
  warSplBzEnty: WAR_SPL_BZ_ENTY,
  prcDataList: PRC_DATA_LIST,
} as const
