// 공통관리(CM) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 화면 클러스터별 소형 서비스(bzentyService·docBoxService 등)도 이 파일에서 export
//   — types/cm.ts 통합과 동일 원칙(도메인당 1파일).
// apiClient 응답 인터셉터가 공통 봉투를 벗겨 data 알맹이를 반환하므로, axios 2번째 제네릭 R 에
//   inner 타입을 넣어(`get<T, T>`) 반환형이 AxiosResponse 가 아닌 도메인 타입으로 떨어지게 한다.
//   (svc-op-auth 확립 패턴 — 다운로드는 `get<Blob, Blob>`, void 뮤테이션은 `post/put/delete<void, void>`.)
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_CM } from '@/mocks/cm'
import type {
  // 통합검색
  SearchResult,
  RecentSearch,
  SearchServiceLink,
  // FAQ / 게시판
  FaqListItem,
  FaqListRequest,
  BoardKind,
  BoardListItem,
  BoardListRequest,
  NoticeDetail,
  RpstrDetail,
  // 업체정보 추가등록
  AddRegItemRow,
  AddRegPayload,
  AddRegDmsAgtPayload,
  RegTrgtItemSearch,
  AsctGrpChcItem,
  BankChcItem,
  DmsAgtFscCode,
  KnditmChcItem,
  RegTrgtItemChcItem,
  PicInfo,
  // 추가정보 신청
  AddRegInfoAplyItem,
  AddRegInfoAplySearch,
  AddRegInfoAplyDetail,
  // 조달원확인서
  DmstSosCnfdocItem,
  DmstSosCnfdocSearch,
  DmstSosCnfdocAplyInfo,
  // 군수품무역대리업
  DfEqpmntTradeAgncAplyItem,
  DfEqpmntTradeAgncAplyPayload,
  DfEqpmntTradeAgncChgPayload,
  // 기타 cm
  AnlPrgrsItem,
  SatisfactionPayload,
  // 업체정보관리 상세
  BzentyGnrlDetail,
  BzentyCmdtyInfo,
  BzentyFcltDetail,
  BzentyRlsVltrnsRstric,
  // 문서함
  DocBoxItem,
  DocBoxListRequest,
  DocBoxDetail,
  IndvRcofcItem,
  // 업무캘린더
  TaskCldrItem,
  TaskCldrRegValues,
  // 관심입찰공고 / 관심법령
  ItrstBidPbancItem,
  ItrstBidListRequest,
  ItrstSttItem,
  // 나의업무
  MyPrgrsHstryItem,
  MyTaskHstryItem,
  // 알림 / 사용자 / 캐비닛 / 게시물
  NotiItem,
  BzentyUser,
  BzentyUserSearch,
  UserSttsCd,
  DigitalCabinetAuthrtSe,
  MyPstItem,
  // 실적증명서 제출
  SbmsnAsctnItem,
} from '@/types/cm'

// ─────────────────────────────────────────────────────────────────────────────
// 엔드포인트 맵 — /v1/cms/... REST 추정(백엔드 확정 시 이 맵만 수정).
// 파라미터 경로는 화살표 함수, 고정 경로는 문자열 상수.
// ─────────────────────────────────────────────────────────────────────────────
const EP = {
  // ── 통합검색 (MUI-MS-01-M09/M10 IntgSrch·menu/MenuPage) ──
  /** 통합검색. */
  SEARCH_ALL: '/v1/cms/search',
  /** 자동완성. */
  SEARCH_AUTOCOMPLETE: '/v1/cms/search/autocomplete',
  /** 최근 검색어 목록/전체삭제. */
  RECENT_SEARCHES: '/v1/cms/search/recent',
  /** 최근 검색어 1건 삭제. */
  RECENT_SEARCH: (id: string) => `/v1/cms/search/recent/${id}`,
  /** 자주 찾는 서비스. */
  FREQUENT_SERVICES: '/v1/cms/search/frequent',
  /** 연관 서비스. */
  RELATED_SERVICES: '/v1/cms/search/related',

  // ── FAQ / 게시판 (faqList·board·noticeList·rpstrList) ──
  /** 자주묻는질문 목록 — MUI-CM-04-M03. */
  FAQ_LIST: '/v1/cms/faqs',
  /** 게시판(공지/자료실/시스템개선) 목록 — 종류별 분기. */
  BOARD_LIST: (kind: BoardKind) => `/v1/cms/boards/${kind}`,
  /** 공지사항 상세 — MUI-CM-04-M02. */
  NOTICE_DETAIL: (contsNo: string) => `/v1/cms/notices/${contsNo}`,
  /** 자료실 상세 — MUI-CM-04-M26. */
  RPSTR_DETAIL: (contsNo: string) => `/v1/cms/rpstrs/${contsNo}`,

  // ── 업체정보 추가등록 (dmstLctnColInfoAddReg, MUI-CM-01-M05/M22/M23) ──
  /** 등록품목명세 목록. */
  REG_ITEM_LIST: '/v1/cms/add-regs/items',
  /** 물품(내자) 추가등록 신청. */
  ADD_REG_APPLY: '/v1/cms/add-regs/cmdty',
  /** 국내소재상사 추가등록 신청. */
  ADD_REG_DMS_AGT_APPLY: '/v1/cms/add-regs/dms-agt',
  /** 담당자정보 저장 — MUI-CM-01-M22. */
  PIC_INFO: '/v1/cms/add-regs/pic',
  /** 조합/단체 검색 — P07. */
  ASCT_GRP_LIST: '/v1/cms/asct-grps',
  /** 주거래은행 검색 — P12. */
  BANK_LIST: '/v1/cms/banks',
  /** FSC 코드 검색. */
  FSC_LIST: '/v1/cms/fscs',
  /** 품류 검색/목록 — P06. */
  KNDITM_LIST: '/v1/cms/knditms',
  /** 등록대상 품목 검색 — P08. */
  REG_TRGT_ITEM_SEARCH: '/v1/cms/add-regs/reg-trgt-items',

  // ── 추가정보 신청 (addRegInfoAply, MUI-CM-01-M03) ──
  /** 추가정보 신청 목록. */
  ADD_REG_INFO_APLY_LIST: '/v1/cms/add-reg-infos',
  /** 추가정보 신청 상세 — T05/T06. */
  ADD_REG_INFO_APLY_DETAIL: (rcptNo: string) => `/v1/cms/add-reg-infos/${rcptNo}`,

  // ── 조달원확인서 (dmstSosCnfdoc, MUI-CM-01-M19) ──
  /** 조달원확인서 신청 목록/신청. */
  DMST_SOS_CNFDOC: '/v1/cms/dmst-sos-cnfdocs',
  /** 국외조달원확인서 서식 다운로드. */
  OVS_SOS_FORM: '/v1/cms/dmst-sos-cnfdocs/ovs-form',

  // ── 군수품무역대리업 (dfEqpmntTradeAgnc, MUI-CM-01-M15~M18) ──
  /** 무역대리업 신청 목록 — M15. */
  DF_EQPMNT_TRADE_AGNC_LIST: '/v1/cms/df-eqpmnt-trade-agncs',
  /** 무역대리업 신규/갱신 신청 저장 — M17. */
  DF_EQPMNT_TRADE_AGNC_APLY: '/v1/cms/df-eqpmnt-trade-agncs',
  /** 무역대리업 신규/갱신 제출 — M17. */
  DF_EQPMNT_TRADE_AGNC_APLY_SUBMIT: '/v1/cms/df-eqpmnt-trade-agncs/submit',
  /** 무역대리업 변경 신청 저장 — M18. */
  DF_EQPMNT_TRADE_AGNC_CHG: '/v1/cms/df-eqpmnt-trade-agncs/chg',
  /** 무역대리업 변경 제출 — M18. */
  DF_EQPMNT_TRADE_AGNC_CHG_SUBMIT: '/v1/cms/df-eqpmnt-trade-agncs/chg/submit',

  // ── 기타 cm ──
  /** 연관진행현황(연관 건) 조회. */
  ANL_PRGRS_LIST: '/v1/cms/anl-prgrs',
  /** 푸시 알림 on/off 설정 — 앱설정. */
  PUSH_NOTI: '/v1/cms/settings/push-noti',
  /** 개인 비밀번호 검증 — 인증/개인정보수정 진입. */
  VERIFY_INDV_PSWD: '/v1/cms/indv/verify-pswd',
  /** 만족도 조사 제출. */
  SATISFACTION: '/v1/cms/satisfaction',
  /** 알림 수신수단 설정. */
  NOTI_MEANS: (id: string) => `/v1/cms/noti-service/means/${id}`,
  /** 알림 수신항목 설정. */
  NOTI_ITEM: (id: string) => `/v1/cms/noti-service/items/${id}`,
  /** PC QR 로그인 스캔. */
  PC_QR_LOGIN: '/v1/cms/pc-qr-login',

  // ── 업체정보관리 상세 (bzentyService, MUI-CM-01-M02) ──
  /** 업체일반(T01). */
  BZENTY_GNRL: (bzentyCd: string) => `/v1/cms/bzentys/${bzentyCd}/gnrl`,
  /** 물품(내자)(T02). */
  BZENTY_CMDTY: (bzentyCd: string) => `/v1/cms/bzentys/${bzentyCd}/cmdty`,
  /** 시설(T03). */
  BZENTY_FCLT: (bzentyCd: string) => `/v1/cms/bzentys/${bzentyCd}/fclt`,
  /** 수의계약배제(조회기간 분기). */
  BZENTY_RLS_VLTRNS: (bzentyCd: string) => `/v1/cms/bzentys/${bzentyCd}/rls-vltrns`,
  /** 나라장터(G2B) 조달업체정보 갱신. */
  BZENTY_REFRESH_G2B: '/v1/cms/bzentys/refresh-g2b',

  // ── 문서함 (docBoxService, MUI-CM-06-M10/M11) ──
  /** 문서함 목록. */
  DOC_BOX_LIST: '/v1/cms/doc-boxes',
  /** 문서함 상세 — M11. */
  DOC_BOX_DETAIL: (id: string) => `/v1/cms/doc-boxes/${id}`,
  /** 문서함 첨부 다운로드 — T03. */
  DOC_BOX_ATCH: (edmsDocId: string) => `/v1/cms/doc-boxes/atch/${edmsDocId}`,
  /** 개인별수신처 목록 — MUI-CM-06-M12. */
  INDV_RCOFC_LIST: '/v1/cms/indv-rcofcs',

  // ── 업무캘린더 (taskCldrService, MUI-CM-06-M06) ──
  /** 업무캘린더 목록. */
  TASK_CLDR_LIST: '/v1/cms/task-schdls',
  /** 업무캘린더 일정 등록. */
  TASK_CLDR_CREATE: '/v1/cms/task-schdls',
  /** 업무캘린더 일정 수정/삭제. */
  TASK_CLDR_ITEM: (id: string) => `/v1/cms/task-schdls/${id}`,

  // ── 관심입찰공고 (itrstBidService, MUI-CM-06-M05) ──
  /** 관심입찰공고 목록. */
  ITRST_BID_LIST: '/v1/cms/favorites/bids',
  /** 관심입찰공고 1건(등록/해제). */
  ITRST_BID_ITEM: (id: string) => `/v1/cms/favorites/bids/${id}`,

  // ── 관심법령 (itrstSttService, MUI-CM-06-M13) ──
  /** 관심법령 목록. */
  ITRST_STT_LIST: '/v1/cms/favorites/stts',
  /** 관심법령 1건(토글). */
  ITRST_STT_ITEM: (id: string) => `/v1/cms/favorites/stts/${id}`,

  // ── 나의업무 (myTaskService, MUI-CM-06-M02/M04) ──
  /** 나의진행업무현황 목록. */
  MY_PRGRS_LIST: '/v1/cms/my-tasks/prgrs',
  /** 나의업무이력현황 목록. */
  MY_TASK_HSTRY_LIST: '/v1/cms/my-tasks/hstry',

  // ── 알림현황 (notificationService, MUI-MS-01-M13) ──
  /** 알림 목록. */
  NOTIFICATION_LIST: '/v1/cms/notifications',
  /** 알림 전체 읽음 처리. */
  NOTIFICATION_READ_ALL: '/v1/cms/notifications/read-all',

  // ── 조달업체 사용자 관리 (userService) ──
  /** 조달업체 소속 사용자 목록. */
  BZENTY_USER_LIST: '/v1/cms/bzenty-users',
  /** 조달업체 사용자 상태 변경. */
  BZENTY_USER_STATUS: (userId: string) => `/v1/cms/bzenty-users/${userId}/status`,

  // ── 디지털캐비닛 (digitalCabinetService, MUI-CM-06-M14) ──
  /** 폴더 권한 저장 — P15. */
  CABINET_AUTHRT: (fldrSn: string) => `/v1/cms/cabinets/${fldrSn}/authrts`,

  // ── 나의 게시물 (myPstService, MUI-CM-06-M17) ──
  /** 나의 게시물 목록. */
  MY_POST_LIST: '/v1/cms/my-posts',

  // ── 실적증명서 제출 (prfmncPrdocService, MUI-CM-04-P20) ──
  /** 제출 협회 목록(dl_sbmsnAsctnList) — On-Load. */
  PRFMNC_PRDOC_SBMSN_ASCTNS: (prfmncRcptNo: string) =>
    `/v1/cms/prfmnc-prdocs/${prfmncRcptNo}/sbmsn-asctns`,
  /** 제출하기 — 선택 협회로 실적증명서 제출(멀티). */
  PRFMNC_PRDOC_SBMSN: (prfmncRcptNo: string) =>
    `/v1/cms/prfmnc-prdocs/${prfmncRcptNo}/sbmsn`,
  /** 제출취소 — 비고(취소사유) 입력 후 협회로 재전송. */
  PRFMNC_PRDOC_SBMSN_CANCEL: (prfmncRcptNo: string) =>
    `/v1/cms/prfmnc-prdocs/${prfmncRcptNo}/sbmsn/cancel`,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// cmService — 공통관리 메인 서비스.
// ─────────────────────────────────────────────────────────────────────────────
export const cmService = {
  // ── 통합검색 (IntgSrch·MenuPage) ──
  /** 통합검색 — 키워드로 결과 조회. */
  async searchAll(keyword: string): Promise<SearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.searchResults)
    return apiClient.get<SearchResult[], SearchResult[]>(EP.SEARCH_ALL, { params: { keyword } })
  },
  /** 자동완성 — 키워드 부분일치 메뉴명. */
  async getAutocomplete(keyword: string): Promise<string[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.autocomplete)
    return apiClient.get<string[], string[]>(EP.SEARCH_AUTOCOMPLETE, { params: { keyword } })
  },
  /** 최근 검색어 목록. */
  async getRecentSearches(): Promise<RecentSearch[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.recentSearches)
    return apiClient.get<RecentSearch[], RecentSearch[]>(EP.RECENT_SEARCHES)
  },
  /** 최근 검색어 1건 삭제. */
  async removeRecentSearch(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.delete<void, void>(EP.RECENT_SEARCH(id))
  },
  /** 최근 검색어 전체 삭제. */
  async clearRecentSearches(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.delete<void, void>(EP.RECENT_SEARCHES)
  },
  /** 자주 찾는 서비스 목록. */
  async getFrequentServices(): Promise<SearchServiceLink[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.frequentServices)
    return apiClient.get<SearchServiceLink[], SearchServiceLink[]>(EP.FREQUENT_SERVICES)
  },
  /** 연관 서비스 목록. */
  async getRelatedServices(keyword: string): Promise<SearchServiceLink[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.relatedServices)
    return apiClient.get<SearchServiceLink[], SearchServiceLink[]>(EP.RELATED_SERVICES, {
      params: { keyword },
    })
  },

  // ── FAQ / 게시판 (faqList·board·noticeList·rpstrList) ──
  /** 자주묻는질문 목록 — MUI-CM-04-M03. */
  async getFaqList(params: FaqListRequest): Promise<FaqListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.faqList)
    return apiClient.get<FaqListItem[], FaqListItem[]>(EP.FAQ_LIST, { params })
  },
  /** 게시판(공지/자료실/시스템개선) 목록 — 종류별. */
  async getBoardList(kind: BoardKind, params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) {
      const byKind: Record<BoardKind, BoardListItem[]> = {
        notice: MOCK_CM.noticeList,
        rpstr: MOCK_CM.rpstrList,
        sysImpv: MOCK_CM.sysImpvList,
      }
      return mockDelay(byKind[kind])
    }
    return apiClient.get<BoardListItem[], BoardListItem[]>(EP.BOARD_LIST(kind), { params })
  },
  /** 공지사항 상세 — MUI-CM-04-M02. */
  async getNoticeDetail(contsNo: string): Promise<NoticeDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.noticeDetail)
    return apiClient.get<NoticeDetail, NoticeDetail>(EP.NOTICE_DETAIL(contsNo))
  },
  /** 자료실 상세 — MUI-CM-04-M26. */
  async getRpstrDetail(contsNo: string): Promise<RpstrDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rpstrDetail)
    return apiClient.get<RpstrDetail, RpstrDetail>(EP.RPSTR_DETAIL(contsNo))
  },

  // ── 업체정보 추가등록 (dmstLctnColInfoAddReg) ──
  /** 등록품목명세 목록 — M05. */
  async getRegItemList(): Promise<AddRegItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.regItemList)
    return apiClient.get<AddRegItemRow[], AddRegItemRow[]>(EP.REG_ITEM_LIST)
  },
  /** 물품(내자) 추가등록 신청 — M05. */
  async applyAddReg(payload: AddRegPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.ADD_REG_APPLY, payload)
  },
  /** 국내소재상사 추가등록 신청 — M23. */
  async applyAddRegDmsAgt(payload: AddRegDmsAgtPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.ADD_REG_DMS_AGT_APPLY, payload)
  },
  /** 담당자정보 저장 — M22. */
  async savePicInfo(payload: PicInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.PIC_INFO, payload)
  },
  /** 조합/단체 검색 — P07. */
  async getAsctGrpList(keyword: string): Promise<AsctGrpChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.asctGrpList)
    return apiClient.get<AsctGrpChcItem[], AsctGrpChcItem[]>(EP.ASCT_GRP_LIST, {
      params: { keyword },
    })
  },
  /** 주거래은행 검색 — P12. */
  async getBankList(keyword: string): Promise<BankChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bankList)
    return apiClient.get<BankChcItem[], BankChcItem[]>(EP.BANK_LIST, { params: { keyword } })
  },
  /** FSC 코드 검색. */
  async getFscList(keyword: string): Promise<DmsAgtFscCode[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.fscList)
    return apiClient.get<DmsAgtFscCode[], DmsAgtFscCode[]>(EP.FSC_LIST, { params: { keyword } })
  },
  /** 품류 검색/목록 — P06(keyword 생략 시 전체). */
  async getKnditmList(keyword?: string): Promise<KnditmChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.knditmList)
    return apiClient.get<KnditmChcItem[], KnditmChcItem[]>(EP.KNDITM_LIST, { params: { keyword } })
  },
  /** 등록대상 품목 검색 — P08. */
  async searchRegTrgtItems(params: RegTrgtItemSearch): Promise<RegTrgtItemChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.regTrgtItems)
    return apiClient.get<RegTrgtItemChcItem[], RegTrgtItemChcItem[]>(EP.REG_TRGT_ITEM_SEARCH, {
      params,
    })
  },

  // ── 추가정보 신청 (addRegInfoAply, MUI-CM-01-M03) ──
  /** 추가정보 신청 목록. */
  async getAddRegInfoAplyList(params: AddRegInfoAplySearch): Promise<AddRegInfoAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.addRegInfoAplyList)
    return apiClient.get<AddRegInfoAplyItem[], AddRegInfoAplyItem[]>(EP.ADD_REG_INFO_APLY_LIST, {
      params,
    })
  },
  /** 추가정보 신청 상세 — T05 물품(내자)/T06 국내소재상사. */
  async getAddRegInfoAplyDtl(rcptNo: string): Promise<AddRegInfoAplyDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.addRegInfoAplyDetail)
    return apiClient.get<AddRegInfoAplyDetail, AddRegInfoAplyDetail>(
      EP.ADD_REG_INFO_APLY_DETAIL(rcptNo),
    )
  },

  // ── 조달원확인서 (dmstSosCnfdoc, MUI-CM-01-M19) ──
  /** 조달원확인서 신청 목록. */
  async getDmstSosCnfdocList(params: DmstSosCnfdocSearch): Promise<DmstSosCnfdocItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.dmstSosCnfdocList)
    return apiClient.get<DmstSosCnfdocItem[], DmstSosCnfdocItem[]>(EP.DMST_SOS_CNFDOC, { params })
  },
  /** 조달원확인서 신청. */
  async applyDmstSosCnfdoc(payload: DmstSosCnfdocAplyInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.DMST_SOS_CNFDOC, payload)
  },
  /** 국외조달원확인서 서식 다운로드(.hwp). */
  async downloadOvsSosForm(): Promise<Blob> {
    if (USE_MOCK) return mockDelay(new Blob(['mock']))
    return apiClient.get<Blob, Blob>(EP.OVS_SOS_FORM, { responseType: 'blob' })
  },

  // ── 군수품무역대리업 (dfEqpmntTradeAgnc, MUI-CM-01-M15~M18) ──
  /** 무역대리업 신청 목록 — M15. */
  async getDfEqpmntTradeAgncAplyList(): Promise<DfEqpmntTradeAgncAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.dfEqpmntTradeAgncAplyList)
    return apiClient.get<DfEqpmntTradeAgncAplyItem[], DfEqpmntTradeAgncAplyItem[]>(
      EP.DF_EQPMNT_TRADE_AGNC_LIST,
    )
  },
  /** 무역대리업 신규/갱신 신청 저장 — M17. */
  async saveDfEqpmntTradeAgncAply(payload: DfEqpmntTradeAgncAplyPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.DF_EQPMNT_TRADE_AGNC_APLY, payload)
  },
  /** 무역대리업 신규/갱신 제출 — M17. */
  async submitDfEqpmntTradeAgncAply(payload: DfEqpmntTradeAgncAplyPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.DF_EQPMNT_TRADE_AGNC_APLY_SUBMIT, payload)
  },
  /** 무역대리업 변경 신청 저장 — M18. */
  async saveDfEqpmntTradeAgncChg(payload: DfEqpmntTradeAgncChgPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.DF_EQPMNT_TRADE_AGNC_CHG, payload)
  },
  /** 무역대리업 변경 제출 — M18. */
  async submitDfEqpmntTradeAgncChg(payload: DfEqpmntTradeAgncChgPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.DF_EQPMNT_TRADE_AGNC_CHG_SUBMIT, payload)
  },

  // ── 기타 cm ──
  /** 연관진행현황(연관 건) 조회. */
  async getAnlPrgrsList(rfrncNo: string, substep: string): Promise<AnlPrgrsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.anlPrgrsList)
    return apiClient.get<AnlPrgrsItem[], AnlPrgrsItem[]>(EP.ANL_PRGRS_LIST, {
      params: { rfrncNo, substep },
    })
  },
  /** 푸시 알림 on/off 설정. */
  async setPushNoti(on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.PUSH_NOTI, { on })
  },
  /** 개인 비밀번호 검증 — 성공 시 true. */
  async verifyIndvPswd(pswd: string): Promise<boolean> {
    if (USE_MOCK) return mockDelay(true)
    return apiClient.post<boolean, boolean>(EP.VERIFY_INDV_PSWD, { pswd })
  },
  /** 만족도 조사 제출. */
  async submitSatisfaction(payload: SatisfactionPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.SATISFACTION, payload)
  },
  /** 알림 수신수단 설정(id 단위 on/off). */
  async setNotiMeans(id: string, on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.NOTI_MEANS(id), { on })
  },
  /** 알림 수신항목 설정(id 단위 on/off). */
  async setNotiItem(id: string, on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.NOTI_ITEM(id), { on })
  },
  /** PC QR 로그인 — 스캔한 토큰 전송. */
  async scanPcQr(qrToken: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.PC_QR_LOGIN, { qrToken })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// bzentyService — 업체정보관리 상세(MUI-CM-01-M02, bzentyGnrlInfoDtl).
// ─────────────────────────────────────────────────────────────────────────────
export const bzentyService = {
  /** 업체일반(T01) — 일반+상태+수배+대표자+입찰대리인. */
  async getGnrlInfo(bzentyCd: string): Promise<BzentyGnrlDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyGnrlDetail)
    return apiClient.get<BzentyGnrlDetail, BzentyGnrlDetail>(EP.BZENTY_GNRL(bzentyCd))
  },
  /** 물품(내자)(T02) — 등록품목+담당자+대표품류/조합. */
  async getCmdtyInfo(bzentyCd: string): Promise<BzentyCmdtyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyCmdtyInfo)
    return apiClient.get<BzentyCmdtyInfo, BzentyCmdtyInfo>(EP.BZENTY_CMDTY(bzentyCd))
  },
  /** 시설(T03) — 시설정보+면허+주력분야. */
  async getFcltInfo(bzentyCd: string): Promise<BzentyFcltDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyFcltDetail)
    return apiClient.get<BzentyFcltDetail, BzentyFcltDetail>(EP.BZENTY_FCLT(bzentyCd))
  },
  /** 수의계약배제 — 조회기간('3m'|'all') 분기. */
  async getRlsVltrnsRstric(
    bzentyCd: string,
    period: '3m' | 'all',
  ): Promise<BzentyRlsVltrnsRstric[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rlsVltrnsRstric)
    return apiClient.get<BzentyRlsVltrnsRstric[], BzentyRlsVltrnsRstric[]>(
      EP.BZENTY_RLS_VLTRNS(bzentyCd),
      { params: { period } },
    )
  },
  /** 나라장터(G2B) 조달업체정보 갱신(1일 1회 제한은 UI 측). */
  async refreshG2b(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.BZENTY_REFRESH_G2B)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// docBoxService — 문서함(MUI-CM-06-M10/M11) + 개인별수신처(M12).
// ─────────────────────────────────────────────────────────────────────────────
export const docBoxService = {
  /** 문서함 목록 — 문서구분(탭)별. */
  async getDocBoxList(params: DocBoxListRequest): Promise<DocBoxItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxList)
    return apiClient.get<DocBoxItem[], DocBoxItem[]>(EP.DOC_BOX_LIST, { params })
  },
  /** 문서함 상세 — M11(문서내용+첨부). */
  async getDocDetail(id: string): Promise<DocBoxDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxDetail)
    return apiClient.get<DocBoxDetail, DocBoxDetail>(EP.DOC_BOX_DETAIL(id))
  },
  /** 첨부 다운로드 — T03. */
  async downloadAtch(edmsDocId: string, fileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockDelay(new Blob(['mock']))
    return apiClient.get<Blob, Blob>(EP.DOC_BOX_ATCH(edmsDocId), {
      params: { fileNm },
      responseType: 'blob',
    })
  },
  /** 개인별수신처 목록 — MUI-CM-06-M12. */
  async getIndvRcofcList(): Promise<IndvRcofcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.indvRcofcList)
    return apiClient.get<IndvRcofcItem[], IndvRcofcItem[]>(EP.INDV_RCOFC_LIST)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// taskCldrService — 업무캘린더(MUI-CM-06-M06/P07/P08/P09).
// ─────────────────────────────────────────────────────────────────────────────
export const taskCldrService = {
  /** 업무캘린더 목록(관심 입찰공고 + 개인 일정). */
  async getList(): Promise<TaskCldrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.taskCldrList)
    return apiClient.get<TaskCldrItem[], TaskCldrItem[]>(EP.TASK_CLDR_LIST)
  },
  /** 일정 등록 — P08. */
  async createSchdl(values: TaskCldrRegValues): Promise<TaskCldrItem> {
    if (USE_MOCK) {
      return mockDelay({
        id: `local-${Date.now()}`,
        schdlSeCd: 'personal',
        schdlDt: values.schdlDt,
        schdlTtl: values.schdlTtl,
        schdlCn: values.schdlCn,
        wrtYmd: values.schdlDt,
      })
    }
    return apiClient.post<TaskCldrItem, TaskCldrItem>(EP.TASK_CLDR_CREATE, values)
  },
  /** 일정 수정 — P08. */
  async updateSchdl(id: string, values: TaskCldrRegValues): Promise<TaskCldrItem> {
    if (USE_MOCK) {
      return mockDelay({
        id,
        schdlSeCd: 'personal',
        schdlDt: values.schdlDt,
        schdlTtl: values.schdlTtl,
        schdlCn: values.schdlCn,
        wrtYmd: values.schdlDt,
      })
    }
    return apiClient.put<TaskCldrItem, TaskCldrItem>(EP.TASK_CLDR_ITEM(id), values)
  },
  /** 일정 삭제 — P09. */
  async deleteSchdl(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.delete<void, void>(EP.TASK_CLDR_ITEM(id))
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// itrstBidService — 관심입찰공고(MUI-CM-06-M05).
// ─────────────────────────────────────────────────────────────────────────────
export const itrstBidService = {
  /** 관심입찰공고 목록. */
  async getList(params?: ItrstBidListRequest): Promise<ItrstBidPbancItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstBidList)
    return apiClient.get<ItrstBidPbancItem[], ItrstBidPbancItem[]>(EP.ITRST_BID_LIST, { params })
  },
  /** 관심공고 등록(찜). */
  async addFavorite(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.ITRST_BID_ITEM(id))
  },
  /** 관심공고 해제. */
  async removeFavorite(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.delete<void, void>(EP.ITRST_BID_ITEM(id))
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// itrstSttService — 관심법령(MUI-CM-06-M13).
// ─────────────────────────────────────────────────────────────────────────────
export const itrstSttService = {
  /** 관심법령 목록. */
  async getList(): Promise<ItrstSttItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstSttList)
    return apiClient.get<ItrstSttItem[], ItrstSttItem[]>(EP.ITRST_STT_LIST)
  },
  /** 관심법령 토글(등록/해제). */
  async toggleFavorite(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.ITRST_STT_ITEM(id))
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// myTaskService — 나의진행업무현황(M02) / 나의업무이력현황(M04).
// ─────────────────────────────────────────────────────────────────────────────
export const myTaskService = {
  /** 나의진행업무현황(진행중) 목록. */
  async getPrgrsList(): Promise<MyPrgrsHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myPrgrsList)
    return apiClient.get<MyPrgrsHstryItem[], MyPrgrsHstryItem[]>(EP.MY_PRGRS_LIST)
  },
  /** 나의업무이력현황(종료) 목록 — 현황 구분(stts)별. */
  async getTaskHstryList(params: { stts: string }): Promise<MyTaskHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myTaskHstryList)
    return apiClient.get<MyTaskHstryItem[], MyTaskHstryItem[]>(EP.MY_TASK_HSTRY_LIST, { params })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// notificationService — 알림현황(MUI-MS-01-M13).
// ─────────────────────────────────────────────────────────────────────────────
export const notificationService = {
  /** 알림 목록. */
  async getList(): Promise<NotiItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.notifications)
    return apiClient.get<NotiItem[], NotiItem[]>(EP.NOTIFICATION_LIST)
  },
  /** 알림 전체 읽음 처리. */
  async markAllRead(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.NOTIFICATION_READ_ALL)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// userService — 조달업체 사용자 관리(PrcmBzentyUserMngPage).
// ─────────────────────────────────────────────────────────────────────────────
export const userService = {
  /** 조달업체 소속 사용자 목록. */
  async getBzentyUserList(params: BzentyUserSearch): Promise<BzentyUser[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyUserList)
    return apiClient.get<BzentyUser[], BzentyUser[]>(EP.BZENTY_USER_LIST, { params })
  },
  /** 사용자 상태 변경. */
  async changeStatus(userId: string, code: UserSttsCd): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.BZENTY_USER_STATUS(userId), { code })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// digitalCabinetService — 디지털캐비닛 폴더 권한(MUI-CM-06-P15).
// ─────────────────────────────────────────────────────────────────────────────
export const digitalCabinetService = {
  /** 폴더 접근권한 저장(사용자별 권한 draft). */
  async saveAuthrt(
    fldrSn: string,
    authrtDraft: Record<string, DigitalCabinetAuthrtSe>,
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.put<void, void>(EP.CABINET_AUTHRT(fldrSn), { authrtDraft })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// myPstService — 나의 게시물(MUI-CM-06-M17).
// ─────────────────────────────────────────────────────────────────────────────
export const myPstService = {
  /** 나의 게시물 목록. */
  async getList(): Promise<MyPstItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myPstList)
    return apiClient.get<MyPstItem[], MyPstItem[]>(EP.MY_POST_LIST)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// prfmncPrdocService — 실적증명서 제출(MUI-CM-04-P20 PrfmncPrdocSbmsn).
// 설계서 00.공통 v0.84 slide336 "2. 이벤트 설명" 3건과 1:1.
//   소비: src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtlPage.tsx (+ PrfmncPrdocSbmsn 콘텐츠)
// ─────────────────────────────────────────────────────────────────────────────
export const prfmncPrdocService = {
  /** On-Load(scwin.onpageload) — 제출 협회 목록(dl_sbmsnAsctnList) 조회. */
  async getSbmsnAsctnList(prfmncRcptNo: string): Promise<SbmsnAsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.sbmsnAsctnList)
    return apiClient.get<SbmsnAsctnItem[], SbmsnAsctnItem[]>(
      EP.PRFMNC_PRDOC_SBMSN_ASCTNS(prfmncRcptNo),
    )
  },
  /** 제출하기(scwin.btn_sbmsn_onclick) — 발급된 실적증명서를 선택 협회로 제출(멀티). */
  async submit(params: { prfmncRcptNo: string; sbmsnSttsNms: string[] }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.PRFMNC_PRDOC_SBMSN(params.prfmncRcptNo), {
      sbmsnSttsNms: params.sbmsnSttsNms,
    })
  },
  /**
   * 제출취소(scwin.btn_sbmsnRtrcn_onclick) — 협회로 제출된 건에 오류가 있어
   * 비고(rmrkCn)에 취소사유를 입력한 뒤 다시 협회로 전송한다.
   */
  async cancelSubmit(params: {
    prfmncRcptNo: string
    items: { sbmsnSttsNm: string; rmrkCn?: string }[]
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(EP.PRFMNC_PRDOC_SBMSN_CANCEL(params.prfmncRcptNo), {
      items: params.items,
    })
  },
}
