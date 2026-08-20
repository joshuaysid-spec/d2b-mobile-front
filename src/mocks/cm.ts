// 공통관리(CM) 도메인 목업 데이터 — USE_MOCK=true 일 때 cmService(services/bds/cm.ts)가 반환.
// 설계서(00.공통) 데이터영역 항목명·형식을 반영(임의 더미 금지).
// 목업 이관 규칙: 아직 서비스에 배선되지 않은 페이지는 각 페이지의 인라인 목업을 유지하고,
//   서비스로 배선하는 시점에 그 페이지의 대표 샘플을 이 파일로 옮긴다(여기 값이 단일 진실원천).
// ⚠️ 폐쇄망 반입 후 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
// src/ui/** 를 import 하지 않는다(순수 데이터).
import type {
  // 통합검색
  SearchResult,
  RecentSearch,
  SearchServiceLink,
  // FAQ / 게시판
  FaqListItem,
  NoticeListItem,
  RpstrListItem,
  SysImpvListItem,
  NoticeDetail,
  RpstrDetail,
  // 업체정보 추가등록 선택 팝업
  AddRegItemRow,
  AsctGrpChcItem,
  BankChcItem,
  DmsAgtFscCode,
  ItemInqDetail,
  KnditmChcItem,
  RegTrgtItemChcItem,
  // 추가정보 신청
  AddRegInfoAplyItem,
  AddRegInfoAplyDetail,
  // 조달원확인서
  DmstSosCnfdocItem,
  DmstSosCnfdocAplyInfo,
  // 군수품무역대리업
  DfEqpmntTradeAgncAplyItem,
  // 연관진행현황
  AnlPrgrsItem,
  // 업체정보관리 상세
  BzentyInfo,
  BzentyGnrlDetail,
  BzentyCmdtyInfo,
  BzentyFcltDetail,
  BzentyRlsVltrnsRstric,
  // 문서함
  DocBoxItem,
  DocBoxDetail,
  IndvRcofcItem,
  // 업무캘린더
  TaskCldrItem,
  // 관심입찰공고 / 관심법령
  ItrstBidPbancItem,
  ItrstSttItem,
  // 나의업무
  MyPrgrsHstryItem,
  MyTaskHstryItem,
  // 알림 / 사용자 / 게시물
  NotiItem,
  BzentyUser,
  MyPstItem,
  // 실적증명서 제출
  SbmsnAsctnItem,
} from '@/types/cm'

// ── 통합검색 (IntgSrch·MenuPage) ──
const SEARCH_RESULTS: SearchResult[] = [
  { id: '1', title: "'26년 K5방독면 구매 입찰공고" },
  { id: '2', title: "'26년 정보화 유지보수 사업 사전규격" },
]
const RECENT_SEARCHES: RecentSearch[] = [
  { id: 'r1', keyword: '방독면' },
  { id: 'r2', keyword: '통신장비' },
]
const FREQUENT_SERVICES: SearchServiceLink[] = [
  { id: 'f1', label: '입찰공고' },
  { id: 'f2', label: '조달계획' },
  { id: 'f3', label: '계약통합목록' },
]
const RELATED_SERVICES: SearchServiceLink[] = [
  { id: 'rs1', label: '입찰진행현황' },
  { id: 'rs2', label: '개찰결과' },
]
const AUTOCOMPLETE: string[] = ['입찰공고', '입찰진행', '입찰결과']

// ── FAQ / 게시판 ──
const FAQ_LIST: FaqListItem[] = [
  {
    no: 1,
    bbsId: '000123',
    bizFldCd: '01',
    qstnTtl: '입찰참가신청은 어떻게 하나요?',
    regDt: '2026-03-02',
    inqNocs: 152,
    contsCn: '입찰공고 상세에서 [입찰참가신청] 버튼을 눌러 진행합니다.',
  },
  {
    no: 2,
    bbsId: '000124',
    bizFldCd: '02',
    qstnTtl: '인증서 등록이 안 됩니다.',
    regDt: '2026-02-27',
    inqNocs: 98,
    contsCn: '인증센터 > 인증서 가져오기에서 인증서를 등록해 주세요.',
  },
]
const NOTICE_LIST: NoticeListItem[] = [
  {
    no: 1,
    contsNo: '000301',
    bizFldCd: '01',
    emrg: '긴급',
    upFix: 'Y',
    bbsTtl: "'26년 상반기 전자입찰 시스템 점검 안내",
    fileCnt: 1,
    tkcgDeptNm: '정보화팀',
    wrtrNm: '김공지',
    regDt: '2026-03-10',
    inqCnt: 340,
  },
  {
    no: 2,
    contsNo: '000302',
    bizFldCd: '02',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '전자조달 이용약관 개정 안내',
    fileCnt: 0,
    tkcgDeptNm: '계약관리팀',
    wrtrNm: '이계약',
    regDt: '2026-03-05',
    inqCnt: 120,
  },
]
const RPSTR_LIST: RpstrListItem[] = [
  {
    no: 1,
    contsNo: '000401',
    bizFldCd: '01',
    rpstrTtl: '입찰참가신청서 서식 (2026 개정)',
    fileCnt: 2,
    rgtrId: 'admin01',
    regDt: '2026-03-08',
    inqNocs: 210,
  },
]
const SYS_IMPV_LIST: SysImpvListItem[] = [
  {
    no: 1,
    contsNo: '000501',
    bizFldCd: '01',
    bbsTtl: '모바일 입찰 알림 기능 개선 안내',
    fileCnt: 0,
    wrtrNm: '박개선',
    regDt: '2026-03-01',
    inqCnt: 75,
  },
]
const NOTICE_DETAIL: NoticeDetail = {
  contsNo: '000301',
  bbsTtl: "'26년 상반기 전자입찰 시스템 점검 안내",
  emrg: '긴급',
  upFix: 'Y',
  wrtrNm: '김공지',
  tkcgDeptNm: '정보화팀',
  bizFldCd: '01',
  pstgBgngYmd: '2026-03-10',
  pstgEndYmd: '2026-03-31',
  bbsCn: '3월 15일(토) 00:00~06:00 시스템 점검이 예정되어 있습니다. 이용에 참고 바랍니다.',
  files: [{ fileSn: '1', fileName: '점검안내.hwp', fileSize: '786KB' }],
}
const RPSTR_DETAIL: RpstrDetail = {
  contsNo: '000401',
  rpstrTtl: '입찰참가신청서 서식 (2026 개정)',
  wrtrNm: '관리자',
  deptNm: '계약관리팀',
  bizFldCd: '01',
  contsCn: '2026년 개정된 입찰참가신청서 서식입니다. 첨부파일을 내려받아 작성해 주세요.',
  files: [
    { fileSn: '1', fileName: '입찰참가신청서.hwp', fileSize: '256KB' },
    { fileSn: '2', fileName: '작성예시.pdf', fileSize: '512KB' },
  ],
}

// ── 업체정보 추가등록 선택 팝업 ──
const REG_ITEM_LIST: AddRegItemRow[] = [
  {
    id: '1',
    itemCd: '1234567890',
    knditmCd: '05',
    knditmCdNm: '피복',
    itemCdNm: 'K5 방독면',
    itemRgstrtSecdNm: '제조',
    itemRgstrtRqmtNm: '공장등록',
    itemRvwRsltCn: '적격',
    aprvYmd: '2025-01-10',
    expryYmd: '2028-01-09',
    rnwlReqYmd: '',
    rcptSttsNm: '승인',
  },
]
const ASCT_GRP_LIST: AsctGrpChcItem[] = [
  { asctCd: '11000', asctCdNm: '한국피복공업협동조합' },
  { asctCd: '11001', asctCdNm: '한국정밀화학공업진흥회' },
]
const BANK_LIST: BankChcItem[] = [
  { bankCd: '00500000', bankNm: '농협은행' },
  { bankCd: '00400000', bankNm: '우리은행' },
]
const FSC_LIST: DmsAgtFscCode[] = [
  { fscCd: '1111', gunGrdNm: '기타 항공기 부수품' },
  { fscCd: '8415', gunGrdNm: '개인 피복류' },
]
const KNDITM_LIST: KnditmChcItem[] = [
  { knditmCd: '05', knditmCdNm: '피복' },
  { knditmCd: '11', knditmCdNm: '화학물질' },
]
const REG_TRGT_ITEMS: RegTrgtItemChcItem[] = [
  {
    itemCd: '1234567890',
    itemCdNm: '물컵',
    knditmCd: '05',
    knditmCdNm: '피복',
    itemRgstrtRqmtNm: '해당업종 사업자 / 공장등록',
    delYn: 'N',
  },
]

// ── 추가정보 신청 (MUI-CM-01-M03) ──
const ADD_REG_INFO_APLY_LIST: AddRegInfoAplyItem[] = [
  {
    id: '1',
    rcptNo: '2026051801',
    aplyYmd: '2026-05-18',
    rprsvTelno: '02-1234-5678',
    bizCdNm: '물품(내자)',
    addInfoCdNm: '물품(내자)',
    prgrsSttsNm: '승인',
  },
  {
    id: '2',
    rcptNo: '2026051802',
    aplyYmd: '2026-05-18',
    rprsvTelno: '02-2345-6789',
    bizCdNm: '외자',
    addInfoCdNm: '국내소재상사',
    prgrsSttsNm: '접수',
  },
]
const ADD_REG_INFO_APLY_DETAIL: AddRegInfoAplyDetail = {
  regTrgtItemList: [
    {
      itemCd: '1234567890',
      knditmCd: '05',
      knditmCdNm: '피복',
      itemRgstrtSecdNm: '제조',
      itemCdNm: 'K5 방독면',
      itemRgstrtRqmtNm: '공장등록',
      itemRvwRsltCn: '적격',
    },
  ],
  picInfo: {
    picNm: '김담당',
    picEntlno: '02-1234-5678',
    picFxno: '02-1234-5679',
    picEmlAddr: 'pic@corp.co.kr',
  },
  knditmAsctGrpList: [
    {
      knditmCd: '05',
      knditmCdNm: '05 / 피복',
      bzstatCdNm: '제조',
      asctCd: '110',
      asctCdNm: '한국피복공업협동조합',
    },
  ],
}

// ── 조달원확인서 (MUI-CM-01-M19) ──
const DMST_SOS_CNFDOC_LIST: DmstSosCnfdocItem[] = [
  {
    id: '1',
    aplyRcptNo: '2026051812',
    aplcntNm: '홍길동',
    aplyRsn: '입찰참가용',
    edpPrcsYmd: '2026-05-18',
    aplcntTelno: '02-1234-5678',
    aplyRcptStts: '발급',
  },
]

// ── 군수품무역대리업 (MUI-CM-01-M15) ──
const DF_EQPMNT_TRADE_AGNC_APLY_LIST: DfEqpmntTradeAgncAplyItem[] = [
  {
    id: '1',
    regAplySecd: '신규',
    rcptNo: '2026-0020',
    rcptYmd: '2026-04-01',
    aprvYmd: '2026-04-10',
    ersrYmd: '',
    expryYmd: '2029-04-09',
    aprvSecdNm: '승인',
  },
]

// ── 연관진행현황 ──
const ANL_PRGRS_LIST: AnlPrgrsItem[] = [
  {
    id: '1',
    taskSeNm: '물품',
    rfrncNo: '2025LDG56349',
    bizNm: "'26년 K5방독면 구매",
    rows: [
      { label: '진행상태', value: '입찰공고' },
      { label: '공고일자', value: '2026-03-10' },
    ],
  },
]

// ── 업체정보관리 상세 (MUI-CM-01-M02) ──
const BZENTY_GNRL_DETAIL: BzentyGnrlDetail = {
  gnrlInfo: {
    bzentyCd: '100F',
    bzentyNm: '한국방산㈜',
    bzentyEngNm: 'KOREA DEFENSE CO., LTD.',
    brno: '123-45-67890',
    ntnCd: '대한민국',
    opbizYmd: '1999-05-10',
    hmpgAddr: 'https://kdefense.co.kr',
    bzentyAddr: '(06234) 서울특별시 강남구 테헤란로 1',
    rprsvTelno: '02-1234-5678',
    rprsvFxno: '02-1234-5679',
    fndnYmd: '1999-05-01',
    crno: '110111-1234567',
    hdofcBrno: '123-45-67890',
    empCnt: '250 명',
    bizCd: ['물품(내자)', '공사'],
    entTpcd: '제조',
    entShcd1: '중소기업',
    entSeRlvtYr: '1999',
    rgnCd: '11-서울특별시',
    fctryFndnSpcsYn: '해당',
    bplcSecd: '1-본사',
  },
  sttsList: [
    {
      bzentyStcd: '01',
      bzentyStNm: '양도,양수',
      crtrYmd: '2025-01-01',
      bgngYmd: '2025-01-01',
      endYmd: '2025-12-31',
      rmrkCn: '-',
    },
  ],
  rlsVltrnsList: [],
  rprsvList: [
    {
      rprsvYn: 'Y',
      rprsvNm: '김대표',
      rprsvEngNm: 'KIM DAEPYO',
      rprsvEmlAddr: 'ceo@kdefense.co.kr',
    },
  ],
  bidAgtList: [{ agtJbpsNm: '과장', agtNm: '이대리', agtEntlno: '02-1234-5680' }],
}
const BZENTY_CMDTY_INFO: BzentyCmdtyInfo = {
  regTrgtItemList: [
    {
      itemCd: '1234567890',
      knditmCd: '05',
      knditmCdNm: '피복',
      itemRgstrtSecdNm: '제조',
      itemCdNm: 'K5 방독면',
      itemRgstrtRqmtNm: '공장등록',
      itemRvwRsltCn: '적격',
    },
  ],
  picInfo: {
    picNm: '김담당',
    picEntlno: '02-1234-5678',
    picFxno: '02-1234-5679',
    picEmlAddr: 'pic@kdefense.co.kr',
  },
  knditmAsctGrpList: [
    {
      knditmCd: '05',
      knditmCdNm: '05 / 피복',
      bzstatCdNm: '제조',
      asctCd: '110',
      asctCdNm: '한국피복공업협동조합',
    },
  ],
}
const BZENTY_FCLT_DETAIL: BzentyFcltDetail = {
  fcltInfo: { bzstatCdNm: '제조', lcofcTelno: '02-1234-5678' },
  lcnsList: [
    {
      cnstpCdNm: '소방공사업',
      cnstpCd: '0001',
      lcnsNo: 'SF-2025-001',
      cnstAbltEvlAmt: '5000000000',
      lcnsAcqsYmd: '2025-01-01',
      lcnsExpryYmd: '2030-12-31',
      bzentyStcd: '01',
    },
  ],
  mfrcList: [
    {
      cnstpCdNm: '소방공사업',
      cnstpCd: '0001',
      mfrcFldNm: '소방설비',
      mfrcFldCd: '001',
      mfrcFldRmvYmd: '-',
      cnstAbltEvlAmt: '5000000000',
      evlAmtCrtrYr: '2025',
      mfrcFldDsgnYmd: '2025-01-01',
      mdfcnDt: '2025-01-01 09:00',
      excptnMttrCd: '-',
    },
  ],
}
const RLS_VLTRNS_RSTRIC: BzentyRlsVltrnsRstric[] = [
  {
    pbancNo: '2026001',
    prcmNo: '2026-00590',
    pbancNm: "'26년 K5방독면 구매",
    bdopnYmd: '2026-03-20',
    orderInstNm: '방위사업청',
    exclPrd: '2026-04-01~2026-06-30',
    exclRsn: '계약 포기',
    regDt: '2026-04-01',
  },
]

// ── 문서함 (MUI-CM-06-M10/M11) + 개인별수신처(M12) ──
const DOC_BOX_LIST: DocBoxItem[] = [
  {
    id: 'received-1',
    docSeCd: 'received',
    docSeNm: '받은 문서',
    docNm: '2026년 K5방독면 구매 계약 통보서',
    trsmOgnzCd: '방위사업청',
    rcptnDt: '2026-03-10',
    rcptIdntyDt: '2026-03-11',
    addCn: '납품 일정 관련 협의가 필요하니 담당자에게 연락 바랍니다.',
    edmsDocId: 'EDMS20260310001',
  },
  {
    id: 'sent-1',
    docSeCd: 'sent',
    docSeNm: '보낸 문서',
    docNm: '입찰참가신청서 제출',
    rcptnOgnzCd: '방위사업청',
    docWrtDt: '2026-03-07',
    rcptIdntyDt: '2026-03-08',
  },
]
const DOC_BOX_DETAIL: DocBoxDetail = {
  docCn: '2026년 K5방독면 구매 계약 체결을 통보합니다. 상세 내용은 첨부문서를 확인해 주세요.',
  atchList: [
    { fileTtl: '계약통보서', fileNm: '계약통보서.hwp', fileSize: '786KB', edmsDocId: 'EDMS20260310001' },
  ],
}
const INDV_RCOFC_LIST: IndvRcofcItem[] = [
  {
    id: '1',
    eldocNm: '물량배정서',
    deptNm: '화력총괄계약팀',
    rcvrId: 'recv001',
    rcptnOgnzNm: '방위사업청',
    rcvrNm: '홍길동',
  },
]

// ── 업무캘린더 (MUI-CM-06-M06) ──
const TASK_CLDR_LIST: TaskCldrItem[] = [
  {
    id: '1',
    schdlSeCd: 'goods',
    schdlDt: '2026-03-20',
    pbancNo: '2026LGM000604191-01',
    pbancNm: "'26년 K5방독면 구매 입찰",
  },
  {
    id: '2',
    schdlSeCd: 'personal',
    schdlDt: '2026-03-22',
    schdlTtl: '입찰서 제출 마감',
    schdlCn: '오후 3시까지 입찰서 제출',
    wrtYmd: '2026-03-15',
  },
]

// ── 관심입찰공고 (MUI-CM-06-M05) ──
const ITRST_BID_LIST: ItrstBidPbancItem[] = [
  {
    id: '1',
    itrst: true,
    taskSeNm: '물품',
    ctrtMthd: '일반경쟁',
    pbancStasNm: '정상공고',
    pbancNoCycl: '2026LGM000604191-01',
    bidNm: "'26년 K5방독면 구매",
    orderPrnmntYm: '2026-03',
    orderInstNm: '방위사업청',
    bidMthd: '총액제',
    bdgtAmt: 11616000,
  },
]

// ── 관심법령 (MUI-CM-06-M13) ──
const ITRST_STT_LIST: ItrstSttItem[] = [
  {
    id: '1',
    itrst: true,
    sttSeNm: '법률',
    sttAbbrNm: '방위사업법',
    sttNm: '방위사업법',
    sttEnfcYmd: '2025-01-01',
    sttUrl: 'https://www.law.go.kr/방위사업법',
  },
]

// ── 나의업무 (MUI-CM-06-M02/M04) ──
const MY_PRGRS_LIST: MyPrgrsHstryItem[] = [
  {
    id: '1',
    prcmNo: '2026-00590',
    bidNm: "'26년 K5방독면 구매",
    aplyDt: '2026-03-15 10:20',
    prgrsSttsNm: '입찰참가신청',
    taskSeNm: '물품',
    ctrtMthd: '일반경쟁',
    currentStage: '입찰',
  },
]
const MY_TASK_HSTRY_LIST: MyTaskHstryItem[] = [
  {
    id: '1',
    taskSttsNm: '입찰참가신청',
    prcmNo: '2026-00520',
    bidNm: "'25년 전투화 구매",
    orderPrnmntYm: '2025-11',
    orderInstNm: '방위사업청',
    bidMthd: '총액제',
    bdgtAmt: 92472000,
    taskSeNm: '물품',
    ctrtMthd: '일반경쟁',
  },
]

// ── 알림현황 (MUI-MS-01-M13) ──
const NOTIFICATIONS: NotiItem[] = [
  {
    id: '1',
    category: '입찰',
    title: "'26년 K5방독면 구매 입찰공고가 게시되었습니다.",
    date: '2026-03-10 09:00',
    read: false,
  },
  {
    id: '2',
    category: '계약',
    title: '계약 통보서가 도착했습니다.',
    date: '2026-03-11 14:30',
    read: true,
  },
]

// ── 조달업체 사용자 관리 ──
const BZENTY_USER_LIST: BzentyUser[] = [
  {
    id: '1',
    userId: 'kdefense01',
    userNm: '김대표',
    deptNm: '경영지원팀',
    telno: '02-1234-5678',
    mbtlNo: '010-1234-5678',
    rmrk: '-',
    userTyNm: '관리자',
    userSttsCd: 'Y',
    userSttsNm: '정상',
  },
  {
    id: '2',
    userId: 'kdefense02',
    userNm: '이담당',
    deptNm: '영업팀',
    telno: '02-1234-5679',
    mbtlNo: '010-2345-6789',
    rmrk: '-',
    userTyNm: '일반',
    userSttsCd: 'T',
    userSttsNm: '임시',
  },
]

// ── 나의 게시물 (MUI-CM-06-M17) ──
const MY_PST_LIST: MyPstItem[] = [
  { id: '1', pstTtl: '입찰 관련 문의드립니다.', wrtYmd: '2026-03-12' },
  { id: '2', pstTtl: '전자입찰 오류 신고', wrtYmd: '2026-03-08' },
]

// ── 실적증명서 제출 (MUI-CM-04-P20, dl_sbmsnAsctnList) ──
// 온라인 제출 대상 협회 7곳은 slide335 고정 목록. 상태(sttsVl)는 Figma 현행 표시값
//   (대한건설협회=송신완료 · 건설산업정보원/대한전문건설협회=제출취소 · 나머지 미제출),
//   비고(rmrkCn)는 slide335 표기값("계약 금액이 다름")을 취소사유로 사용.
const SBMSN_ASCTN_LIST: SbmsnAsctnItem[] = [
  { sbmsnSttsNm: '대한건설협회', sttsVl: '송신완료' },
  { sbmsnSttsNm: '건설산업정보원', sttsVl: '제출취소', rmrkCn: '계약 금액이 다름' },
  { sbmsnSttsNm: '대한전문건설협회', sttsVl: '제출취소' },
  { sbmsnSttsNm: '한국전기공사협회' },
  { sbmsnSttsNm: '한국정보통신공사협회' },
  { sbmsnSttsNm: '한국건설기술인협회' },
  { sbmsnSttsNm: '한국소방시설협회' },
]

// ── 업체 기본정보 / 품목상세 / 국내조달원확인서 신청인 (실 API 배선분, 소비 화면 대기) ──
// no.677 업체기본정보조회 · no.644 조달업체목록조회 응답 1건. 다른 목업(BZENTY_GNRL_DETAIL)과 같은 업체.
const BZENTY_BSC_INFO: BzentyInfo = {
  bzentyNm: '(주)대한방산',
  brno: '1234567890',
  bzentyCd: 'BZ001',
  rprsvNm: '김대표',
  bzentyRgstrtYmd: '20180312',
  crno: '1101110012345',
}

// no.632 품목상세조회 — 등록대상품목 선택(P08) 후 품목코드/업종 확정값.
const ITEM_DTL_INFO: ItemInqDetail = {
  itemCd: '8415101234',
  bzstatCd: '2822',
  bzstatNm: '제조업',
}

// no.624 국내조달원확인서조회 — 신청인 정보(자동완성 read-only 2건 + 신청사유).
const DMST_SOS_CNFDOC_INFO: DmstSosCnfdocAplyInfo = {
  aplcntNm: '홍길동',
  aplcntTelno: '02-1234-5678',
  aplyRsn: '군수품 납품을 위한 국내조달원 확인서 발급을 신청합니다.',
}

export const MOCK_CM = {
  // 통합검색
  searchResults: SEARCH_RESULTS,
  recentSearches: RECENT_SEARCHES,
  frequentServices: FREQUENT_SERVICES,
  relatedServices: RELATED_SERVICES,
  autocomplete: AUTOCOMPLETE,
  // FAQ / 게시판
  faqList: FAQ_LIST,
  noticeList: NOTICE_LIST,
  rpstrList: RPSTR_LIST,
  sysImpvList: SYS_IMPV_LIST,
  noticeDetail: NOTICE_DETAIL,
  rpstrDetail: RPSTR_DETAIL,
  // 업체정보 추가등록 선택 팝업
  regItemList: REG_ITEM_LIST,
  asctGrpList: ASCT_GRP_LIST,
  bankList: BANK_LIST,
  fscList: FSC_LIST,
  knditmList: KNDITM_LIST,
  regTrgtItems: REG_TRGT_ITEMS,
  // 추가정보 신청
  addRegInfoAplyList: ADD_REG_INFO_APLY_LIST,
  addRegInfoAplyDetail: ADD_REG_INFO_APLY_DETAIL,
  // 조달원확인서
  dmstSosCnfdocList: DMST_SOS_CNFDOC_LIST,
  // 군수품무역대리업
  dfEqpmntTradeAgncAplyList: DF_EQPMNT_TRADE_AGNC_APLY_LIST,
  // 연관진행현황
  anlPrgrsList: ANL_PRGRS_LIST,
  // 업체정보관리 상세
  bzentyGnrlDetail: BZENTY_GNRL_DETAIL,
  bzentyCmdtyInfo: BZENTY_CMDTY_INFO,
  bzentyFcltDetail: BZENTY_FCLT_DETAIL,
  rlsVltrnsRstric: RLS_VLTRNS_RSTRIC,
  // 문서함
  docBoxList: DOC_BOX_LIST,
  docBoxDetail: DOC_BOX_DETAIL,
  indvRcofcList: INDV_RCOFC_LIST,
  // 업무캘린더
  taskCldrList: TASK_CLDR_LIST,
  // 관심입찰공고 / 관심법령
  itrstBidList: ITRST_BID_LIST,
  itrstSttList: ITRST_STT_LIST,
  // 나의업무
  myPrgrsList: MY_PRGRS_LIST,
  myTaskHstryList: MY_TASK_HSTRY_LIST,
  // 알림 / 사용자 / 게시물
  notifications: NOTIFICATIONS,
  bzentyUserList: BZENTY_USER_LIST,
  myPstList: MY_PST_LIST,
  // 실적증명서 제출(MUI-CM-04-P20)
  sbmsnAsctnList: SBMSN_ASCTN_LIST,
  // 실 API 배선분(소비 화면 대기)
  bzentyBscInfo: BZENTY_BSC_INFO,
  itemDtlInfo: ITEM_DTL_INFO,
  dmstSosCnfdocInfo: DMST_SOS_CNFDOC_INFO,
} as const
