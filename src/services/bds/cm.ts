// 공통관리(CM) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: cmKeys.selectXxx / useSelectXxx) — 실 API 목록 기준.
//   대상: /cbs/cm/*(no.619~764, PrcmBzentyInfoMng·CvlcptDcmntMng·Com·WdgtMng·MyTaskMng·DocBox·
//   DigitalCabinetMng·ItrstBidPbanc·SttInfo·TaskHstryMng) + /tss/cm/board/*(no.925~936 공지/자료실/FAQ).
//   ※ 로그인·본인확인·사용자정보(/cbs/cm/login/*, userReg·userInfoMng 일부)는 authService(services/bds/auth.ts).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
// 화면 클러스터별 소형 서비스(bzenty·docBox·taskCldr 등)를 cmService 하나로 통합
//   — types/cm.ts 통합과 동일 원칙(도메인당 1파일 · 1서비스).
// apiClient 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
//   axios 2번째 제네릭 R 에 inner 타입을 넣어(`post<T, T>`) 반환형이 AxiosResponse 가 아닌 도메인 타입으로 떨어지게 한다.
//   (다운로드는 `post<Blob, Blob>`, void 뮤테이션은 `post<void, void>`.)
// 식별자는 전부 body 로 전달한다(구 path 변수 `/{id}` 폐기 — URL 에 식별자 노출 금지 규칙과 동일 취지).
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
  BzentyInfo,
  DmsAgtFscCode,
  ItemInqDetail,
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
  OvsSosAplyInfo,
  OvsSosCnfdocItem,
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
  DocBoxAtchFile,
  DocBoxItem,
  DocBoxListRequest,
  DocBoxDetail,
  IndvRcofcItem,
  // 디지털캐비닛
  DigitalCabinetAuthrtSe,
  DigitalCabinetFile,
  DigitalCabinetFldr,
  // 업무캘린더
  TaskCldrItem,
  TaskCldrRegValues,
  // 관심입찰공고 / 관심법령
  ItrstBidPbancItem,
  ItrstBidListRequest,
  ItrstSttItem,
  SttInfoItem,
  SttInfoSearchFilter,
  // 나의업무
  MyPrgrsHstryItem,
  MyTaskHstryItem,
  // 알림 / 사용자 / 게시물
  NotiItem,
  BzentyUser,
  BzentyUserSearch,
  UserSttsCd,
  MyPstItem,
  // 실적증명서
  PrfmncPrdocAplyInfo,
  PrfmncPrdocCtrtInfo,
  PrfmncPrdocItem,
  SbmsnAsctnItem,
} from '@/types/cm'

export const cmService = {
  // ── 통합검색 (MUI-MS-01-M09/M10 IntgSrch·menu/MenuPage) ───────────────────
  // TODO(백엔드 확정): 통합검색·자동완성·최근검색어는 실 API 목록에 대응 메서드가 없다(모바일 전용 추정).
  //   아래 7개 함수 URL 은 전부 임시 — 반입 전 확인 필요.

  /** 통합검색 — 키워드로 결과 조회. */
  async selectSearchAll(keyword: string): Promise<SearchResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.searchResults)
    return apiClient.post<SearchResult[], SearchResult[]>('/v1/cms/search', { keyword })
  },

  /** 자동완성 — 키워드 부분일치 메뉴명. */
  async selectAutocomplete(keyword: string): Promise<string[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.autocomplete)
    return apiClient.post<string[], string[]>('/v1/cms/search/autocomplete', { keyword })
  },

  /** 최근 검색어 목록. */
  async selectRecentSearches(): Promise<RecentSearch[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.recentSearches)
    return apiClient.post<RecentSearch[], RecentSearch[]>('/v1/cms/search/recent')
  },

  /** 최근 검색어 1건 삭제. */
  async removeRecentSearch(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/search/recent/delete', { id })
  },

  /** 최근 검색어 전체 삭제. */
  async clearRecentSearches(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/search/recent')
  },

  /** 자주 찾는 서비스 목록. */
  async selectFrequentServices(): Promise<SearchServiceLink[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.frequentServices)
    return apiClient.post<SearchServiceLink[], SearchServiceLink[]>('/v1/cms/search/frequent')
  },

  /** 연관 서비스 목록. */
  async selectRelatedServices(keyword: string): Promise<SearchServiceLink[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.relatedServices)
    return apiClient.post<SearchServiceLink[], SearchServiceLink[]>('/v1/cms/search/related', {
      keyword,
    })
  },

  // ── 게시판 / FAQ (/tss/cm/board, no.925~936) ──────────────────────────────
  // 구 `selectBoardList(kind, params)` 은 종류별 URL 이 달라 3개(notice/rpstr/sysImpv)로 분리.

  /** no.935 자주묻는질문목록조회 — MUI-CM-04-M03 (faqList/FaqListPage). */
  async selectFaqList(params: FaqListRequest): Promise<FaqListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.faqList)
    return apiClient.post<FaqListItem[], FaqListItem[]>('/tss/cm/board/selectFaqList.do', params)
  },

  /** no.936 자주묻는질문상세 — MUI-CM-04-M03 아코디언 본문(목록 응답에 포함 시 미사용). 소비처 대기. */
  async selectFaqDtl(contsNo: string): Promise<FaqListItem> {
    if (USE_MOCK) return mockDelay(MOCK_CM.faqList[0])
    return apiClient.post<FaqListItem, FaqListItem>('/tss/cm/board/selectFaqDtl.do', { contsNo })
  },

  /** no.925 공지사항목록조회 — MUI-CM-04-M01 (noticeList/board/BoardListView). 구 `selectBoardList('notice')`. */
  async selectNoticeList(params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.noticeList)
    return apiClient.post<BoardListItem[], BoardListItem[]>(
      '/tss/cm/board/selectNoticeList.do',
      params,
    )
  },

  /** no.926 공지사항상세조회 — MUI-CM-04-M02. 구 `selectNoticeDetail`. */
  async selectNoticeDtl(contsNo: string): Promise<NoticeDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.noticeDetail)
    return apiClient.post<NoticeDetail, NoticeDetail>('/tss/cm/board/selectNoticeDtl.do', {
      contsNo,
    })
  },

  /** no.930 자료실목록조회 — MUI-CM-04-M25 (rpstrList/board/BoardListView). 구 `selectBoardList('rpstr')`. */
  async selectRpstrList(params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rpstrList)
    return apiClient.post<BoardListItem[], BoardListItem[]>(
      '/tss/cm/board/selectRpstrList.do',
      params,
    )
  },

  /** no.931 자료실상세조회 — MUI-CM-04-M26. 구 `selectRpstrDetail`. */
  async selectRpstrDtl(contsNo: string): Promise<RpstrDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rpstrDetail)
    return apiClient.post<RpstrDetail, RpstrDetail>('/tss/cm/board/selectRpstrDtl.do', { contsNo })
  },

  /**
   * 시스템개선 목록 — 구 `selectBoardList('sysImpv')`.
   * TODO(백엔드 확정): /tss/cm/board 실 API 는 공지/자료실/FAQ 3종뿐 — 시스템개선 게시판 URL 임시.
   */
  async selectSysImpvList(params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.sysImpvList)
    return apiClient.post<BoardListItem[], BoardListItem[]>('/v1/cms/boards/sysImpv', params)
  },

  // ── 업체정보관리 상세 (bzentyGnrlInfoDtl, MUI-CM-01-M02) ──────────────────

  /** no.619 업체일반정보조회 — T01 일반+상태+수배+대표자+입찰대리인. */
  async selectBzentyGnrlInfo(bzentyCd: string): Promise<BzentyGnrlDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyGnrlDetail)
    return apiClient.post<BzentyGnrlDetail, BzentyGnrlDetail>(
      '/cbs/cm/mnufmgt/selectBzentyGnrlInfo.do',
      { bzentyCd },
    )
  },

  /** no.621 업체물품(내자)정보 조회 — T02 등록품목+담당자+대표품류/조합. 구 `selectBzentyCmdtyInfo`. */
  async selectBzentyDmscptInfo(bzentyCd: string): Promise<BzentyCmdtyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyCmdtyInfo)
    return apiClient.post<BzentyCmdtyInfo, BzentyCmdtyInfo>(
      '/cbs/cm/mnufmgt/selectBzentyDmscptInfo.do',
      { bzentyCd },
    )
  },

  /** no.625 업체시설정보조회 — T03 시설정보+면허+주력분야. */
  async selectBzentyFcltInfo(bzentyCd: string): Promise<BzentyFcltDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyFcltDetail)
    return apiClient.post<BzentyFcltDetail, BzentyFcltDetail>(
      '/cbs/cm/mnufmgt/selectBzentyFcltInfo.do',
      { bzentyCd },
    )
  },

  /**
   * no.620 업체공개수의배제목록조회 — 조회기간('3m'|'all') 분기. 구 `selectBzentyRlsVltrnsRstric`.
   * TODO(백엔드 확정): 조회기간 요청 항목명 미확정(현재 period) — 상세설계 확인 후 교체.
   */
  async selectBzentyRlsVltrnsRstrcList(
    bzentyCd: string,
    period: '3m' | 'all',
  ): Promise<BzentyRlsVltrnsRstric[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rlsVltrnsRstric)
    return apiClient.post<BzentyRlsVltrnsRstric[], BzentyRlsVltrnsRstric[]>(
      '/cbs/cm/mnufmgt/selectBzentyRlsVltrnsRstrcList.do',
      { bzentyCd, period },
    )
  },

  /** no.644 조달업체목록조회 — 업체 선택 팝업 공용. 소비처 대기. */
  async selectPrcmBzentyList(keyword?: string): Promise<BzentyInfo[]> {
    if (USE_MOCK) return mockDelay([MOCK_CM.bzentyBscInfo])
    return apiClient.post<BzentyInfo[], BzentyInfo[]>('/cbs/cm/mnufmgt/selectPrcmBzentyList.do', {
      keyword,
    })
  },

  /**
   * 나라장터(G2B) 조달업체정보 갱신(1일 1회 제한은 UI 측).
   * TODO(백엔드 확정): 실 API 목록에 대응 메서드 없음 — URL 임시.
   */
  async refreshG2b(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/bzentys/refresh-g2b')
  },

  // ── 업체정보 추가등록 (dmstLctnColInfoAddReg, MUI-CM-01-M05/M22/M23) ──────

  /**
   * 등록품목명세 목록 — M05.
   * TODO(백엔드 확정): 실 API 목록에 대응 메서드 없음(no.621 업체물품(내자)정보 응답에 포함될 가능성) — URL 임시.
   */
  async selectRegItemList(): Promise<AddRegItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.regItemList)
    return apiClient.post<AddRegItemRow[], AddRegItemRow[]>('/v1/cms/add-regs/items')
  },

  /** no.627 업체물품(내자)정보추가등록 — M05. 구 `applyAddReg`. */
  async insertBzentyDmscptInfoAddReg(payload: AddRegPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/insertBzentyDmscptInfoAddReg.do', payload)
  },

  /** no.633 업체국내소재상사정보추가등록 — M23. 구 `applyAddRegDmsAgt`. */
  async insertBzentyDmstLctnCoInfoAddReg(payload: AddRegDmsAgtPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(
      '/cbs/cm/mnufmgt/insertBzentyDmstLctnCoInfoAddReg.do',
      payload,
    )
  },

  /** no.628 담당자정보저장 — MUI-CM-01-M22. */
  async savePicInfo(payload: PicInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/savePicInfo.do', payload)
  },

  /** no.630 조합/단체정보조회 — P07. */
  async selectAsctGrpList(keyword: string): Promise<AsctGrpChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.asctGrpList)
    return apiClient.post<AsctGrpChcItem[], AsctGrpChcItem[]>(
      '/cbs/cm/mnufmgt/selectAsctGrpList.do',
      { keyword },
    )
  },

  /** no.635 은행정보조회 — P12. */
  async selectBankList(keyword: string): Promise<BankChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bankList)
    return apiClient.post<BankChcItem[], BankChcItem[]>('/cbs/cm/mnufmgt/selectBankList.do', {
      keyword,
    })
  },

  /** no.634 FSC정보조회 — P11. */
  async selectFscList(keyword: string): Promise<DmsAgtFscCode[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.fscList)
    return apiClient.post<DmsAgtFscCode[], DmsAgtFscCode[]>('/cbs/cm/mnufmgt/selectFscList.do', {
      keyword,
    })
  },

  /** no.629 품류정보조회 — P06(keyword 생략 시 전체). */
  async selectKnditmList(keyword?: string): Promise<KnditmChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.knditmList)
    return apiClient.post<KnditmChcItem[], KnditmChcItem[]>(
      '/cbs/cm/mnufmgt/selectKnditmList.do',
      { keyword },
    )
  },

  /** no.631 등록대상품목정보 조회 — P08. */
  async selectRegTrgtItemList(params: RegTrgtItemSearch): Promise<RegTrgtItemChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.regTrgtItems)
    return apiClient.post<RegTrgtItemChcItem[], RegTrgtItemChcItem[]>(
      '/cbs/cm/mnufmgt/selectRegTrgtItemList.do',
      params,
    )
  },

  /** no.632 품목상세조회 — P08 품목 선택 후 상세(품목코드/업종). 소비처 대기. */
  async selectItemDtlInfo(itemCd: string): Promise<ItemInqDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itemDtlInfo)
    return apiClient.post<ItemInqDetail, ItemInqDetail>('/cbs/cm/mnufmgt/selectItemDtlInfo.do', {
      itemCd,
    })
  },

  // ── 추가정보 신청 (addRegInfoAply, MUI-CM-01-M03) ─────────────────────────

  /** no.636 업체정보추가정보신청목록조회 — 구 `selectAddRegInfoAplyList`. */
  async selectBzentyInfoAddRegAplyList(
    params: AddRegInfoAplySearch,
  ): Promise<AddRegInfoAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.addRegInfoAplyList)
    return apiClient.post<AddRegInfoAplyItem[], AddRegInfoAplyItem[]>(
      '/cbs/cm/mnufmgt/selectBzentyInfoAddRegAplyList.do',
      params,
    )
  },

  /** no.637 업체정보추가정보신청상세조회 — T05 물품(내자)/T06 국내소재상사. 구 `selectAddRegInfoAplyDtl`. */
  async selectBzentyInfoAddRegAplyDtl(rcptNo: string): Promise<AddRegInfoAplyDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.addRegInfoAplyDetail)
    return apiClient.post<AddRegInfoAplyDetail, AddRegInfoAplyDetail>(
      '/cbs/cm/mnufmgt/selectBzentyInfoAddRegAplyDtl.do',
      { rcptNo },
    )
  },

  // ── 조달원확인서 (dmstSosCnfdoc, MUI-CM-01-M19 / 국외 MUI-CM-04-M22) ──────

  /** no.622 국내조달원확인서신청이력조회 — 구 `selectDmstSosCnfdocList`. */
  async selectDmstSosCnfdocAplyList(params: DmstSosCnfdocSearch): Promise<DmstSosCnfdocItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.dmstSosCnfdocList)
    return apiClient.post<DmstSosCnfdocItem[], DmstSosCnfdocItem[]>(
      '/cbs/cm/mnufmgt/selectDmstSosCnfdocAplyList.do',
      params,
    )
  },

  /** no.623 국내조달원확인서신청 — 구 `applyDmstSosCnfdoc`. */
  async insertDmstSosCnfdocAply(payload: DmstSosCnfdocAplyInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/insertDmstSosCnfdocAply.do', payload)
  },

  /** no.624 국내조달원확인서조회 — 신청 1건 상세(신청인 자동완성). 소비처 대기. */
  async selectDmstSosCnfdocInfo(aplyRcptNo: string): Promise<DmstSosCnfdocAplyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CM.dmstSosCnfdocInfo)
    return apiClient.post<DmstSosCnfdocAplyInfo, DmstSosCnfdocAplyInfo>(
      '/cbs/cm/mnufmgt/selectDmstSosCnfdocInfo.do',
      { aplyRcptNo },
    )
  },

  /** no.642 국외조달원신청목록조회 — MUI-CM-04-M22. 소비처 대기(목업 미정). */
  async selectOvsSosCrtfList(params: { aplyYmdFrom?: string; aplyYmdTo?: string } = {}): Promise<
    OvsSosCnfdocItem[]
  > {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<OvsSosCnfdocItem[], OvsSosCnfdocItem[]>(
      '/cbs/cm/mnufmgt/selectOvsSosCrtfList.do',
      params,
    )
  },

  /** no.643 조달원등록신청 — MUI-CM-04-P22 국외조달원등록증신청. 소비처 대기. */
  async insertOvsSosCrtf(payload: OvsSosAplyInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/insertOvsSosCrtf.do', payload)
  },

  /**
   * 국외조달원확인서 서식 다운로드(.hwp) — MUI-CM-01-P21.
   * TODO(백엔드 확정): 서식 다운로드 전용 API 가 실목록에 없다 — no.700 첨부파일다운로드(fileSn 지정)로
   *   대체될 가능성. URL 임시.
   */
  async downloadOvsSosForm(): Promise<Blob> {
    if (USE_MOCK) return mockDelay(new Blob(['mock']))
    return apiClient.post<Blob, Blob>('/v1/cms/dmst-sos-cnfdocs/ovs-form', null, {
      responseType: 'blob',
    })
  },

  // ── 군수품무역대리업 (dfEqpmntTradeAgnc, MUI-CM-01-M15~M18) ───────────────

  /** no.638 군수품무역대리업신청목록조회 — M15. */
  async selectDfEqpmntTradeAgncAplyList(): Promise<DfEqpmntTradeAgncAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.dfEqpmntTradeAgncAplyList)
    return apiClient.post<DfEqpmntTradeAgncAplyItem[], DfEqpmntTradeAgncAplyItem[]>(
      '/cbs/cm/mnufmgt/selectDfEqpmntTradeAgncAplyList.do',
    )
  },

  /** no.640 군수품무역대리업 신청(갱신) 저장 — M17. 구 `saveDfEqpmntTradeAgncAply`. */
  async saveDfEqpmntTradeAgnc(payload: DfEqpmntTradeAgncAplyPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/saveDfEqpmntTradeAgnc.do', payload)
  },

  /**
   * 군수품무역대리업 신규/갱신 제출 — M17.
   * TODO(백엔드 확정): 실 API 는 no.640 하나뿐(임시저장/제출 구분 없음) — 같은 URL 을 쓰되 화면 버튼이
   *   둘이라 함수를 분리해 둔다. 제출 전용 메서드 확인 시 URL 교체.
   */
  async submitDfEqpmntTradeAgncAply(payload: DfEqpmntTradeAgncAplyPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/saveDfEqpmntTradeAgnc.do', payload)
  },

  /** no.641 군수품무역대리업 변경 저장 — M18. 구 `saveDfEqpmntTradeAgncChg`. */
  async updateDfEqpmntTradeAgnc(payload: DfEqpmntTradeAgncChgPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/updateDfEqpmntTradeAgnc.do', payload)
  },

  /** 군수품무역대리업 변경 제출 — M18. TODO(백엔드 확정): no.641 과 같은 URL — M17 과 동일 사유. */
  async submitDfEqpmntTradeAgncChg(payload: DfEqpmntTradeAgncChgPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mnufmgt/updateDfEqpmntTradeAgnc.do', payload)
  },

  // ── 알림서비스 / 조달업체 사용자 관리 (/cbs/cm/userInfoMng) ────────────────
  // 로그인·본인확인 계열과 달리 소비 화면이 cm(마이페이지)이라 cmService 에 둔다.

  /**
   * no.664 알림서비스변경 — 알림 수신수단(id 단위 on/off), MUI-CM-02 notiSrvcAply.
   * TODO(백엔드 확정): 수단/항목이 한 API(no.664)라 같은 URL 을 쓰되 화면 토글이 둘이라 함수를 분리해 둔다.
   */
  async setNotiMeans(id: string, on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/userInfoMng/updateNotiSrvcInfo.do', { id, on })
  },

  /** no.664 알림서비스변경 — 알림 수신항목(id 단위 on/off). TODO: setNotiMeans 와 같은 URL(동일 사유). */
  async setNotiItem(id: string, on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/userInfoMng/updateNotiSrvcInfo.do', { id, on })
  },

  /** no.665 업체사용자조회 — prcmBzentyUserMng. 구 `selectBzentyUserList`. */
  async selectPrcmBzentyUserList(params: BzentyUserSearch): Promise<BzentyUser[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyUserList)
    return apiClient.post<BzentyUser[], BzentyUser[]>(
      '/cbs/cm/userInfoMng/selectPrcmBzentyUserList.do',
      params,
    )
  },

  /** no.666 업체사용자상태변경 — 구 `changeBzentyUserStatus`(실 API 는 다건 규격). */
  async updatePrcmBzentyUserSttsList(userId: string, code: UserSttsCd): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/userInfoMng/updatePrcmBzentyUserSttsList.do', {
      userId,
      code,
    })
  },

  // ── 실적증명서(민원문서, /cbs/cm/minwon) — MUI-CM-04-M27~M30·P20 ───────────

  /** no.677 업체기본정보조회 — 실적증명서 신청서 상단 신청업체(자동완성). 소비처 대기. */
  async selectBzentyBscInfo(): Promise<BzentyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyBscInfo)
    return apiClient.post<BzentyInfo, BzentyInfo>('/cbs/cm/minwon/selectBzentyBscInfo.do')
  },

  /** no.678 계약정보조회 — 실적증명서 신청 대상 계약. 실 fn 은 `selectCtrtList`(no.764 와 충돌해 접두). 소비처 대기. */
  async selectPrfmncPrdocCtrtList(params: { ctrtNo?: string } = {}): Promise<PrfmncPrdocCtrtInfo[]> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<PrfmncPrdocCtrtInfo[], PrfmncPrdocCtrtInfo[]>(
      '/cbs/cm/minwon/selectCtrtList.do',
      params,
    )
  },

  /** no.679 실적증명서신청목록조회 — MUI-CM-04-M27 (prfmncPrdoc/PrfmncPrdocPage). 소비처 대기(목업 미정). */
  async selectPrfmncPrdocAplyList(
    params: { aplyYmdFrom?: string; aplyYmdTo?: string; ctrtNo?: string; prcsStts?: string } = {},
  ): Promise<PrfmncPrdocItem[]> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<PrfmncPrdocItem[], PrfmncPrdocItem[]>(
      '/cbs/cm/minwon/selectPrfmncPrdocAplyList.do',
      params,
    )
  },

  /** no.683 실적증명서신청 — MUI-CM-04-M28 신규 신청. 소비처 대기. */
  async insertPrfmncPrdoc(payload: PrfmncPrdocAplyInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/minwon/insertPrfmncPrdoc.do', payload)
  },

  /** no.682 실적증명서신청수정 — MUI-CM-04-M28. 소비처 대기. */
  async updatePrfmncPrdoc(payload: PrfmncPrdocAplyInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/minwon/updatePrfmncPrdoc.do', payload)
  },

  /** no.681 실적증명서신청삭제 — MUI-CM-04-M27 목록 삭제. 소비처 대기. */
  async deletePrfmncPrdoc(prfmncRcptNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/minwon/deletePrfmncPrdoc.do', { prfmncRcptNo })
  },

  /** no.684 실적증명서발급 — MUI-CM-04-M29 발급 버튼. 소비처 대기. */
  async procPrfmncPrdocIssu(prfmncRcptNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/minwon/procPrfmncPrdocIssu.do', { prfmncRcptNo })
  },

  // 설계서 00.공통 v0.84 slide336 "2. 이벤트 설명" 3건과 1:1.
  //   소비: src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtlPage.tsx (+ PrfmncPrdocSbmsn 콘텐츠)

  /**
   * no.686 실적증명서제출목록조회 — On-Load(scwin.onpageload)로 제출 협회 목록(dl_sbmsnAsctnList) 조회.
   * 구 `selectSbmsnAsctnList`.
   */
  async selectPrfmncPrdocSbmsnList(prfmncRcptNo: string): Promise<SbmsnAsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.sbmsnAsctnList)
    return apiClient.post<SbmsnAsctnItem[], SbmsnAsctnItem[]>(
      '/cbs/cm/minwon/selectPrfmncPrdocSbmsnList.do',
      { prfmncRcptNo },
    )
  },

  /**
   * no.685 실적증명서제출(scwin.btn_sbmsn_onclick) — 발급된 실적증명서를 선택 협회로 제출(멀티).
   * 구 `submitPrfmncPrdoc`.
   */
  async procPrfmncPrdocSbmsn(params: {
    prfmncRcptNo: string
    sbmsnSttsNms: string[]
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/minwon/procPrfmncPrdocSbmsn.do', params)
  },

  /**
   * 제출취소(scwin.btn_sbmsnRtrcn_onclick) — 협회로 제출된 건에 오류가 있어
   * 비고(rmrkCn)에 취소사유를 입력한 뒤 다시 협회로 전송한다.
   * TODO(백엔드 확정): 취소 전용 API 가 실목록에 없어 no.685 와 같은 URL(재전송) — 전용 메서드 확인 시 교체.
   */
  async cancelSubmitPrfmncPrdoc(params: {
    prfmncRcptNo: string
    items: { sbmsnSttsNm: string; rmrkCn?: string }[]
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/minwon/procPrfmncPrdocSbmsn.do', params)
  },

  // ── 법령정보 / 관심법령 (itrstStt, MUI-CM-06-M13) ─────────────────────────

  /** no.688 법령정보조회 — 법령 검색 목록. 소비처 대기(목업 미정). */
  async selectSttInfoList(params: Partial<SttInfoSearchFilter> = {}): Promise<SttInfoItem[]> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<SttInfoItem[], SttInfoItem[]>('/cbs/cm/board/selectSttInfoList.do', params)
  },

  /** no.692 법령정보즐겨찾기등록 — 구 `toggleFavorite`(등록). */
  async insertBkmSttInfo(sttSn: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/board/insertBkmSttInfo.do', { sttSn })
  },

  /** no.693 법령정보즐겨찾기해제 — 구 `toggleFavorite`(해제). */
  async cancelBkmSttInfo(sttSn: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/board/cancelBkmSttInfo.do', { sttSn })
  },

  /** no.759 관심법령조회 — MUI-CM-06-M13 (itrstStt/ItrstSttPage). */
  async selectItrstSttList(): Promise<ItrstSttItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstSttList)
    return apiClient.post<ItrstSttItem[], ItrstSttItem[]>('/cbs/cm/mytask/selectItrstSttList.do')
  },

  /** no.760 관심법령삭제 — M13 목록에서 관심 해제. */
  async deleteItrstStt(sttSn: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mytask/deleteItrstStt.do', { sttSn })
  },

  // ── 콘텐츠 / 앱 공통 (ComController) ──────────────────────────────────────

  /** no.699 첨부파일조회 — 게시물·문서 첨부 목록. 소비처 대기(목업 미정). */
  async selectAtchFile(atchFileId: string): Promise<DocBoxAtchFile[]> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<DocBoxAtchFile[], DocBoxAtchFile[]>(
      '/cbs/cm/contents/selectAtchFile.do',
      { atchFileId },
    )
  },

  /** no.700 첨부파일다운로드 — 문서함 T03 등 공용. 구 `downloadAtch`. */
  async downloadAtchFile(edmsDocId: string, fileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockDelay(new Blob(['mock']))
    return apiClient.post<Blob, Blob>(
      '/cbs/cm/contents/downloadAtchFile.do',
      { edmsDocId, fileNm },
      { responseType: 'blob' },
    )
  },

  /** no.702 push이력조회 — 알림(푸시) 발송 이력. 소비처 대기. */
  async selectPushList(): Promise<NotiItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.notifications)
    return apiClient.post<NotiItem[], NotiItem[]>('/cbs/cm/contents/selectPushList.do')
  },

  // ── 위젯 (WdgtMngController, 마이페이지 홈) ───────────────────────────────

  /** no.723 (위젯)나의업무진행현황조회 — MUI-CM-06-M02. 구 `selectMyPrgrsList`. */
  async selectMyTaskPrgrsPrstList(): Promise<MyPrgrsHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myPrgrsList)
    return apiClient.post<MyPrgrsHstryItem[], MyPrgrsHstryItem[]>(
      '/cbs/cm/mytask/selectMyTaskPrgrsPrstList.do',
    )
  },

  /** no.724 (위젯)나의게시물조회 — MUI-CM-06-M17 (myPst/MyPstPage). */
  async selectMyPstList(): Promise<MyPstItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myPstList)
    return apiClient.post<MyPstItem[], MyPstItem[]>('/cbs/cm/mytask/selectMyPstList.do')
  },

  /** no.725 (위젯)관심공고조회 — 마이페이지 홈 위젯(M05 목록과 별도 API). 소비처 대기. */
  async selectItrstPbancList(): Promise<ItrstBidPbancItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstBidList)
    return apiClient.post<ItrstBidPbancItem[], ItrstBidPbancItem[]>(
      '/cbs/cm/mytask/selectItrstPbancList.do',
    )
  },

  /** no.726 (위젯)업무캘린더조회 — 홈 위젯(최대 3건). 소비처 대기. */
  async selectWdgtTaskCldrList(): Promise<TaskCldrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.taskCldrList)
    return apiClient.post<TaskCldrItem[], TaskCldrItem[]>(
      '/cbs/cm/mytask/selectWdgtTaskCldrList.do',
    )
  },

  /** no.727 (위젯)나의문서함조회 — 홈 위젯. 소비처 대기. */
  async selectMyDocBoxList(): Promise<DocBoxItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxList)
    return apiClient.post<DocBoxItem[], DocBoxItem[]>('/cbs/cm/mytask/selectMyDocBoxList.do')
  },

  /** no.728 (위젯)알림현황조회 — 홈 위젯. 소비처 대기. */
  async selectWdgtNotiPrstList(): Promise<NotiItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.notifications)
    return apiClient.post<NotiItem[], NotiItem[]>('/cbs/cm/mytask/selectWdgtNotiPrstList.do')
  },

  /** no.729 (위젯)관심법령조회 — 홈 위젯. 소비처 대기. */
  async selectWdgtItrstSttList(): Promise<ItrstSttItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstSttList)
    return apiClient.post<ItrstSttItem[], ItrstSttItem[]>(
      '/cbs/cm/mytask/selectWdgtItrstSttList.do',
    )
  },

  // ── 업무캘린더 (taskCldr, MUI-CM-06-M06/P07/P08/P09) ──────────────────────

  /** no.730 업무캘린더조회 — 관심 입찰공고 + 개인 일정. */
  async selectTaskCldrList(): Promise<TaskCldrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.taskCldrList)
    return apiClient.post<TaskCldrItem[], TaskCldrItem[]>('/cbs/cm/mytask/selectTaskCldrList.do')
  },

  /** no.731 업무캘린더상세조회 — P07 일정 상세. 소비처 대기. */
  async selectTaskCldrDtl(id: string): Promise<TaskCldrItem> {
    if (USE_MOCK) return mockDelay(MOCK_CM.taskCldrList[0])
    return apiClient.post<TaskCldrItem, TaskCldrItem>('/cbs/cm/mytask/selectTaskCldrDtl.do', { id })
  },

  /** no.732 업무캘린더저장 — P08 일정 등록. 구 `createSchdl`. */
  async insertTaskCldr(values: TaskCldrRegValues): Promise<TaskCldrItem> {
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
    return apiClient.post<TaskCldrItem, TaskCldrItem>('/cbs/cm/mytask/insertTaskCldr.do', values)
  },

  /**
   * 일정 수정 — P08.
   * TODO(백엔드 확정): 실 API 는 no.732 저장 하나뿐(등록/수정 구분 없음) — 같은 URL 에 id 를 실어 보낸다.
   */
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
    return apiClient.post<TaskCldrItem, TaskCldrItem>('/cbs/cm/mytask/insertTaskCldr.do', {
      id,
      ...values,
    })
  },

  /** 일정 삭제 — P09. TODO(백엔드 확정): 실 API 목록에 삭제 메서드 없음 — URL 임시. */
  async deleteSchdl(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/task-schdls/delete', { id })
  },

  // ── 알림현황 (notiPrst, MUI-MS-01-M13) ────────────────────────────────────

  /** no.734 알림현황조회 — 구 `selectNotiList`. */
  async selectNotiPrstList(): Promise<NotiItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.notifications)
    return apiClient.post<NotiItem[], NotiItem[]>('/cbs/cm/mytask/selectNotiPrstList.do')
  },

  /** 알림 전체 읽음 처리. TODO(백엔드 확정): 실 API 목록에 대응 메서드 없음 — URL 임시. */
  async markAllRead(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/notifications/read-all')
  },

  // ── 문서함 (docBox, MUI-CM-06-M10/M11) + 개인별수신처(M12) ────────────────
  // 구 `selectDocBoxList(docSeCd)` 는 탭별 URL 이 달라 분리. 반려(rejected) 탭은 실 API 미대응.

  /** no.735 받은문서함조회 — M10 '받은 문서' 탭. */
  async selectRcvDocBoxList(params: Omit<DocBoxListRequest, 'docSeCd'> = {}): Promise<DocBoxItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxList)
    return apiClient.post<DocBoxItem[], DocBoxItem[]>(
      '/cbs/cm/mytask/selectRcvDocBoxList.do',
      params,
    )
  },

  /** no.736 보낸문서함조회 — M10 '보낸 문서' 탭. */
  async selectTrsmDocBoxList(
    params: Omit<DocBoxListRequest, 'docSeCd'> = {},
  ): Promise<DocBoxItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxList)
    return apiClient.post<DocBoxItem[], DocBoxItem[]>(
      '/cbs/cm/mytask/selectTrsmDocBoxList.do',
      params,
    )
  },

  /** no.737(=738 중복 등재) 임시저장함조회 — M10 '임시저장' 탭. */
  async selectTmprDocBoxList(
    params: Omit<DocBoxListRequest, 'docSeCd'> = {},
  ): Promise<DocBoxItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxList)
    return apiClient.post<DocBoxItem[], DocBoxItem[]>(
      '/cbs/cm/mytask/selectTmprDocBoxList.do',
      params,
    )
  },

  /**
   * 문서함 상세 — M11(문서내용+첨부).
   * TODO(백엔드 확정): 실 API 목록에 문서함 상세 메서드 없음(목록 응답에 포함 가능성) — URL 임시.
   */
  async selectDocBoxDetail(id: string): Promise<DocBoxDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxDetail)
    return apiClient.post<DocBoxDetail, DocBoxDetail>('/v1/cms/doc-boxes/detail', { id })
  },

  /** no.739 개인별수신처정보조회 — MUI-CM-06-M12. 구 `selectIndvRcofcList`. */
  async selectIndvRcofcInfoList(): Promise<IndvRcofcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.indvRcofcList)
    return apiClient.post<IndvRcofcItem[], IndvRcofcItem[]>(
      '/cbs/cm/mytask/selectIndvRcofcInfoList.do',
    )
  },

  // ── 디지털캐비닛 (digitalCabinet, MUI-CM-06-M14~P15) ──────────────────────

  /** no.749 디지털캐비닛폴더조회 — 폴더 트리. 소비처 대기(목업 미정). */
  async selectDigitalCabinetFldrList(): Promise<DigitalCabinetFldr[]> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<DigitalCabinetFldr[], DigitalCabinetFldr[]>(
      '/cbs/cm/mytask/selectDigitalCabinetFldrList.do',
    )
  },

  /** no.752 디지털캐비닛조회 — 폴더 내 파일 목록. 소비처 대기(목업 미정). */
  async selectDigitalCabinet(fldrSn: string): Promise<DigitalCabinetFile[]> {
    if (USE_MOCK) return mockDelay([])
    return apiClient.post<DigitalCabinetFile[], DigitalCabinetFile[]>(
      '/cbs/cm/mytask/selectDigitalCabinet.do',
      { fldrSn },
    )
  },

  /**
   * 폴더 접근권한 저장(사용자별 권한 draft) — P15.
   * TODO(백엔드 확정): 실 API 목록에 권한 저장 메서드 없음 — URL 임시.
   */
  async saveAuthrt(
    fldrSn: string,
    authrtDraft: Record<string, DigitalCabinetAuthrtSe>,
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/cabinets/authrts', { fldrSn, authrtDraft })
  },

  // ── 관심입찰공고 (itrstBidPbanc, MUI-CM-06-M05) ───────────────────────────

  /** no.757 관심입찰공고조회 — 구 `selectItrstBidList`. */
  async selectItrstBidPbancList(params?: ItrstBidListRequest): Promise<ItrstBidPbancItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstBidList)
    return apiClient.post<ItrstBidPbancItem[], ItrstBidPbancItem[]>(
      '/cbs/cm/mytask/selectItrstBidPbancList.do',
      params,
    )
  },

  /** no.758 관심입찰공고삭제 — 관심공고 해제. 구 `removeFavorite`. */
  async deleteItrstBidPbanc(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/cbs/cm/mytask/deleteItrstBidPbanc.do', { pbancNo })
  },

  /**
   * 관심공고 등록(찜) — 입찰공고 카드 별표.
   * TODO(백엔드 확정): 실 API 목록에 등록 메서드 없음(삭제 no.758 만 존재) — URL 임시.
   */
  async addFavorite(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/favorites/bids', { pbancNo })
  },

  // ── 나의업무이력 (TaskHstryMngController, MUI-CM-06-M04) ──────────────────
  // 구 `selectMyTaskHstryList({ stts })` 는 현황(탭)별 URL 이 달라 4개로 분리.

  /** no.761 입찰참가신청목록조회 — M04 '입찰참가신청' 탭. */
  async selectBidPrtcpAplyList(): Promise<MyTaskHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myTaskHstryList)
    return apiClient.post<MyTaskHstryItem[], MyTaskHstryItem[]>(
      '/cbs/cm/mytask/selectBidPrtcpAplyList.do',
    )
  },

  /** no.762 입찰서제출목록조회 — M04 '입찰서제출' 탭. */
  async selectTndrSbmsnList(): Promise<MyTaskHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myTaskHstryList)
    return apiClient.post<MyTaskHstryItem[], MyTaskHstryItem[]>(
      '/cbs/cm/mytask/selectTndrSbmsnList.do',
    )
  },

  /** no.763 공개수의협상목록조회 — M04 '공개수의협상' 탭. */
  async selectRlsVltrnsNgtnList(): Promise<MyTaskHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myTaskHstryList)
    return apiClient.post<MyTaskHstryItem[], MyTaskHstryItem[]>(
      '/cbs/cm/mytask/selectRlsVltrnsNgtnList.do',
    )
  },

  /** no.764 계약목록조회 — M04 '계약' 탭. 실 fn 은 `selectCtrtList`(no.678 과 충돌해 접두). */
  async selectTaskHstryCtrtList(): Promise<MyTaskHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myTaskHstryList)
    return apiClient.post<MyTaskHstryItem[], MyTaskHstryItem[]>('/cbs/cm/mytask/selectCtrtList.do')
  },

  // ── 기타 cm (연관진행현황·앱설정·인증·만족도·QR) ───────────────────────────
  // TODO(백엔드 확정): 아래 4개는 실 API 목록에 대응 메서드가 없다 — URL 전부 임시.

  /** 연관진행현황(연관 건) 조회. */
  async selectAnlPrgrsList(rfrncNo: string, substep: string): Promise<AnlPrgrsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.anlPrgrsList)
    return apiClient.post<AnlPrgrsItem[], AnlPrgrsItem[]>('/v1/cms/anl-prgrs', {
      rfrncNo,
      substep,
    })
  },

  /** 푸시 알림 on/off 설정 — 앱설정(단말 단위, no.664 알림서비스변경과 별개). */
  async setPushNoti(on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/settings/push-noti', { on })
  },

  /** 개인 비밀번호 검증 — 인증/개인정보수정 진입. 성공 시 true. */
  async verifyIndvPswd(pswd: string): Promise<boolean> {
    if (USE_MOCK) return mockDelay(true)
    return apiClient.post<boolean, boolean>('/v1/cms/indv/verify-pswd', { pswd })
  },

  /** 만족도 조사 제출. */
  async submitSatisfaction(payload: SatisfactionPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/satisfaction', payload)
  },
}
