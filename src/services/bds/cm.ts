// 공통관리(CM) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: cmKeys.selectXxx / useSelectXxx) — 실규격 확정 전 임시 명명(select~ 스타일).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
// 화면 클러스터별 소형 서비스(bzenty·docBox·taskCldr 등)를 cmService 하나로 통합
//   — types/cm.ts 통합과 동일 원칙(도메인당 1파일 · 1서비스).
// apiClient 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
//   axios 2번째 제네릭 R 에 inner 타입을 넣어(`post<T, T>`) 반환형이 AxiosResponse 가 아닌 도메인 타입으로 떨어지게 한다.
//   (다운로드는 `post<Blob, Blob>`, void 뮤테이션은 `post<void, void>`.)
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

export const cmService = {
  // ── 통합검색 (MUI-MS-01-M09/M10 IntgSrch·menu/MenuPage) ───────────────────

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
    await apiClient.post<void, void>(`/v1/cms/search/recent/${id}`)
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

  // ── FAQ / 게시판 (faqList·board·noticeList·rpstrList) ─────────────────────

  /** 자주묻는질문 목록 — MUI-CM-04-M03. */
  async selectFaqList(params: FaqListRequest): Promise<FaqListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.faqList)
    return apiClient.post<FaqListItem[], FaqListItem[]>('/v1/cms/faqs', params)
  },

  /** 게시판(공지/자료실/시스템개선) 목록 조회 — 종류별 분기. */
  async selectBoardList(kind: BoardKind, params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) {
      const byKind: Record<BoardKind, BoardListItem[]> = {
        notice: MOCK_CM.noticeList,
        rpstr: MOCK_CM.rpstrList,
        sysImpv: MOCK_CM.sysImpvList,
      }
      return mockDelay(byKind[kind])
    }
    return apiClient.post<BoardListItem[], BoardListItem[]>(`/v1/cms/boards/${kind}`, params)
  },

  /** 공지사항 상세 — MUI-CM-04-M02. */
  async selectNoticeDetail(contsNo: string): Promise<NoticeDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.noticeDetail)
    return apiClient.post<NoticeDetail, NoticeDetail>(`/v1/cms/notices/${contsNo}`)
  },

  /** 자료실 상세 — MUI-CM-04-M26. */
  async selectRpstrDetail(contsNo: string): Promise<RpstrDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rpstrDetail)
    return apiClient.post<RpstrDetail, RpstrDetail>(`/v1/cms/rpstrs/${contsNo}`)
  },

  // ── 업체정보 추가등록 (dmstLctnColInfoAddReg, MUI-CM-01-M05/M22/M23) ──────

  /** 등록품목명세 목록 — M05. */
  async selectRegItemList(): Promise<AddRegItemRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.regItemList)
    return apiClient.post<AddRegItemRow[], AddRegItemRow[]>('/v1/cms/add-regs/items')
  },

  /** 물품(내자) 추가등록 신청 — M05. */
  async applyAddReg(payload: AddRegPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/add-regs/cmdty', payload)
  },

  /** 국내소재상사 추가등록 신청 — M23. */
  async applyAddRegDmsAgt(payload: AddRegDmsAgtPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/add-regs/dms-agt', payload)
  },

  /** 담당자정보 저장 — MUI-CM-01-M22. */
  async savePicInfo(payload: PicInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/add-regs/pic', payload)
  },

  /** 조합/단체 검색 — P07. */
  async selectAsctGrpList(keyword: string): Promise<AsctGrpChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.asctGrpList)
    return apiClient.post<AsctGrpChcItem[], AsctGrpChcItem[]>('/v1/cms/asct-grps', { keyword })
  },

  /** 주거래은행 검색 — P12. */
  async selectBankList(keyword: string): Promise<BankChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bankList)
    return apiClient.post<BankChcItem[], BankChcItem[]>('/v1/cms/banks', { keyword })
  },

  /** FSC 코드 검색 — P11. */
  async selectFscList(keyword: string): Promise<DmsAgtFscCode[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.fscList)
    return apiClient.post<DmsAgtFscCode[], DmsAgtFscCode[]>('/v1/cms/fscs', { keyword })
  },

  /** 품류 검색/목록 — P06(keyword 생략 시 전체). */
  async selectKnditmList(keyword?: string): Promise<KnditmChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.knditmList)
    return apiClient.post<KnditmChcItem[], KnditmChcItem[]>('/v1/cms/knditms', { keyword })
  },

  /** 등록대상 품목 검색 — P08. */
  async selectRegTrgtItemList(params: RegTrgtItemSearch): Promise<RegTrgtItemChcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.regTrgtItems)
    return apiClient.post<RegTrgtItemChcItem[], RegTrgtItemChcItem[]>(
      '/v1/cms/add-regs/reg-trgt-items',
      params,
    )
  },

  // ── 추가정보 신청 (addRegInfoAply, MUI-CM-01-M03) ─────────────────────────

  /** 추가정보 신청 목록. */
  async selectAddRegInfoAplyList(params: AddRegInfoAplySearch): Promise<AddRegInfoAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.addRegInfoAplyList)
    return apiClient.post<AddRegInfoAplyItem[], AddRegInfoAplyItem[]>(
      '/v1/cms/add-reg-infos',
      params,
    )
  },

  /** 추가정보 신청 상세 — T05 물품(내자)/T06 국내소재상사. */
  async selectAddRegInfoAplyDtl(rcptNo: string): Promise<AddRegInfoAplyDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.addRegInfoAplyDetail)
    return apiClient.post<AddRegInfoAplyDetail, AddRegInfoAplyDetail>(
      `/v1/cms/add-reg-infos/${rcptNo}`,
    )
  },

  // ── 조달원확인서 (dmstSosCnfdoc, MUI-CM-01-M19) ───────────────────────────

  /** 조달원확인서 신청 목록. */
  async selectDmstSosCnfdocList(params: DmstSosCnfdocSearch): Promise<DmstSosCnfdocItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.dmstSosCnfdocList)
    return apiClient.post<DmstSosCnfdocItem[], DmstSosCnfdocItem[]>(
      '/v1/cms/dmst-sos-cnfdocs',
      params,
    )
  },

  /** 조달원확인서 신청. */
  async applyDmstSosCnfdoc(payload: DmstSosCnfdocAplyInfo): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/dmst-sos-cnfdocs', payload)
  },

  /** 국외조달원확인서 서식 다운로드(.hwp). */
  async downloadOvsSosForm(): Promise<Blob> {
    if (USE_MOCK) return mockDelay(new Blob(['mock']))
    return apiClient.post<Blob, Blob>('/v1/cms/dmst-sos-cnfdocs/ovs-form', null, {
      responseType: 'blob',
    })
  },

  // ── 군수품무역대리업 (dfEqpmntTradeAgnc, MUI-CM-01-M15~M18) ───────────────

  /** 무역대리업 신청 목록 — M15. */
  async selectDfEqpmntTradeAgncAplyList(): Promise<DfEqpmntTradeAgncAplyItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.dfEqpmntTradeAgncAplyList)
    return apiClient.post<DfEqpmntTradeAgncAplyItem[], DfEqpmntTradeAgncAplyItem[]>(
      '/v1/cms/df-eqpmnt-trade-agncs',
    )
  },

  /** 무역대리업 신규/갱신 신청 저장 — M17. */
  async saveDfEqpmntTradeAgncAply(payload: DfEqpmntTradeAgncAplyPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/df-eqpmnt-trade-agncs', payload)
  },

  /** 무역대리업 신규/갱신 제출 — M17. */
  async submitDfEqpmntTradeAgncAply(payload: DfEqpmntTradeAgncAplyPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/df-eqpmnt-trade-agncs/submit', payload)
  },

  /** 무역대리업 변경 신청 저장 — M18. */
  async saveDfEqpmntTradeAgncChg(payload: DfEqpmntTradeAgncChgPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/df-eqpmnt-trade-agncs/chg', payload)
  },

  /** 무역대리업 변경 제출 — M18. */
  async submitDfEqpmntTradeAgncChg(payload: DfEqpmntTradeAgncChgPayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/df-eqpmnt-trade-agncs/chg/submit', payload)
  },

  // ── 기타 cm (연관진행현황·앱설정·인증·만족도·알림설정·QR) ─────────────────

  /** 연관진행현황(연관 건) 조회. */
  async selectAnlPrgrsList(rfrncNo: string, substep: string): Promise<AnlPrgrsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.anlPrgrsList)
    return apiClient.post<AnlPrgrsItem[], AnlPrgrsItem[]>('/v1/cms/anl-prgrs', {
      rfrncNo,
      substep,
    })
  },

  /** 푸시 알림 on/off 설정 — 앱설정. */
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

  /** 알림 수신수단 설정(id 단위 on/off). */
  async setNotiMeans(id: string, on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/noti-service/means/${id}`, { on })
  },

  /** 알림 수신항목 설정(id 단위 on/off). */
  async setNotiItem(id: string, on: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/noti-service/items/${id}`, { on })
  },

  /** PC QR 로그인 — 스캔한 토큰 전송. */
  async scanPcQr(qrToken: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/pc-qr-login', { qrToken })
  },

  // ── 업체정보관리 상세 (bzentyGnrlInfoDtl, MUI-CM-01-M02) ──────────────────

  /** 업체일반(T01) — 일반+상태+수배+대표자+입찰대리인. */
  async selectBzentyGnrlInfo(bzentyCd: string): Promise<BzentyGnrlDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyGnrlDetail)
    return apiClient.post<BzentyGnrlDetail, BzentyGnrlDetail>(`/v1/cms/bzentys/${bzentyCd}/gnrl`)
  },

  /** 물품(내자)(T02) — 등록품목+담당자+대표품류/조합. */
  async selectBzentyCmdtyInfo(bzentyCd: string): Promise<BzentyCmdtyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyCmdtyInfo)
    return apiClient.post<BzentyCmdtyInfo, BzentyCmdtyInfo>(`/v1/cms/bzentys/${bzentyCd}/cmdty`)
  },

  /** 시설(T03) — 시설정보+면허+주력분야. */
  async selectBzentyFcltInfo(bzentyCd: string): Promise<BzentyFcltDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyFcltDetail)
    return apiClient.post<BzentyFcltDetail, BzentyFcltDetail>(`/v1/cms/bzentys/${bzentyCd}/fclt`)
  },

  /** 수의계약배제 — 조회기간('3m'|'all') 분기. */
  async selectBzentyRlsVltrnsRstric(
    bzentyCd: string,
    period: '3m' | 'all',
  ): Promise<BzentyRlsVltrnsRstric[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rlsVltrnsRstric)
    return apiClient.post<BzentyRlsVltrnsRstric[], BzentyRlsVltrnsRstric[]>(
      `/v1/cms/bzentys/${bzentyCd}/rls-vltrns`,
      { period },
    )
  },

  /** 나라장터(G2B) 조달업체정보 갱신(1일 1회 제한은 UI 측). */
  async refreshG2b(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/bzentys/refresh-g2b')
  },

  // ── 문서함 (docBox, MUI-CM-06-M10/M11) + 개인별수신처(M12) ────────────────

  /** 문서함 목록 — 문서구분(탭)별. */
  async selectDocBoxList(params: DocBoxListRequest): Promise<DocBoxItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxList)
    return apiClient.post<DocBoxItem[], DocBoxItem[]>('/v1/cms/doc-boxes', params)
  },

  /** 문서함 상세 — M11(문서내용+첨부). */
  async selectDocBoxDetail(id: string): Promise<DocBoxDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.docBoxDetail)
    return apiClient.post<DocBoxDetail, DocBoxDetail>(`/v1/cms/doc-boxes/${id}`)
  },

  /** 문서함 첨부 다운로드 — T03. */
  async downloadAtch(edmsDocId: string, fileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockDelay(new Blob(['mock']))
    return apiClient.post<Blob, Blob>(
      `/v1/cms/doc-boxes/atch/${edmsDocId}`,
      { fileNm },
      { responseType: 'blob' },
    )
  },

  /** 개인별수신처 목록 — MUI-CM-06-M12. */
  async selectIndvRcofcList(): Promise<IndvRcofcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.indvRcofcList)
    return apiClient.post<IndvRcofcItem[], IndvRcofcItem[]>('/v1/cms/indv-rcofcs')
  },

  // ── 업무캘린더 (taskCldr, MUI-CM-06-M06/P07/P08/P09) ──────────────────────

  /** 업무캘린더 목록(관심 입찰공고 + 개인 일정). */
  async selectTaskCldrList(): Promise<TaskCldrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.taskCldrList)
    return apiClient.post<TaskCldrItem[], TaskCldrItem[]>('/v1/cms/task-schdls')
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
    return apiClient.post<TaskCldrItem, TaskCldrItem>('/v1/cms/task-schdls', values)
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
    return apiClient.post<TaskCldrItem, TaskCldrItem>(`/v1/cms/task-schdls/${id}`, values)
  },

  /** 일정 삭제 — P09. */
  async deleteSchdl(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/task-schdls/${id}`)
  },

  // ── 관심입찰공고 (itrstBidPbanc, MUI-CM-06-M05) ───────────────────────────

  /** 관심입찰공고 목록. */
  async selectItrstBidList(params?: ItrstBidListRequest): Promise<ItrstBidPbancItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstBidList)
    return apiClient.post<ItrstBidPbancItem[], ItrstBidPbancItem[]>(
      '/v1/cms/favorites/bids',
      params,
    )
  },

  /** 관심공고 등록(찜). */
  async addFavorite(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/favorites/bids/${id}`)
  },

  /** 관심공고 해제. */
  async removeFavorite(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/favorites/bids/${id}`)
  },

  // ── 관심법령 (itrstStt, MUI-CM-06-M13) ────────────────────────────────────

  /** 관심법령 목록. */
  async selectItrstSttList(): Promise<ItrstSttItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.itrstSttList)
    return apiClient.post<ItrstSttItem[], ItrstSttItem[]>('/v1/cms/favorites/stts')
  },

  /** 관심법령 토글(등록/해제). */
  async toggleFavorite(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/favorites/stts/${id}`)
  },

  // ── 나의업무 (MUI-CM-06-M02 진행업무 / M04 업무이력) ──────────────────────

  /** 나의진행업무현황(진행중) 목록. */
  async selectMyPrgrsList(): Promise<MyPrgrsHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myPrgrsList)
    return apiClient.post<MyPrgrsHstryItem[], MyPrgrsHstryItem[]>('/v1/cms/my-tasks/prgrs')
  },

  /** 나의업무이력현황(종료) 목록 — 현황 구분(stts)별. */
  async selectMyTaskHstryList(params: { stts: string }): Promise<MyTaskHstryItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myTaskHstryList)
    return apiClient.post<MyTaskHstryItem[], MyTaskHstryItem[]>('/v1/cms/my-tasks/hstry', params)
  },

  // ── 알림현황 (notiPrst, MUI-MS-01-M13) ────────────────────────────────────

  /** 알림 목록. */
  async selectNotiList(): Promise<NotiItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.notifications)
    return apiClient.post<NotiItem[], NotiItem[]>('/v1/cms/notifications')
  },

  /** 알림 전체 읽음 처리. */
  async markAllRead(): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>('/v1/cms/notifications/read-all')
  },

  // ── 조달업체 사용자 관리 (prcmBzentyUserMng) ──────────────────────────────

  /** 조달업체 소속 사용자 목록. */
  async selectBzentyUserList(params: BzentyUserSearch): Promise<BzentyUser[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.bzentyUserList)
    return apiClient.post<BzentyUser[], BzentyUser[]>('/v1/cms/bzenty-users', params)
  },

  /** 조달업체 사용자 상태 변경. */
  async changeBzentyUserStatus(userId: string, code: UserSttsCd): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/bzenty-users/${userId}/status`, { code })
  },

  // ── 디지털캐비닛 (digitalCabinet, MUI-CM-06-P15) ──────────────────────────

  /** 폴더 접근권한 저장(사용자별 권한 draft). */
  async saveAuthrt(
    fldrSn: string,
    authrtDraft: Record<string, DigitalCabinetAuthrtSe>,
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/cabinets/${fldrSn}/authrts`, { authrtDraft })
  },

  // ── 나의 게시물 (myPst, MUI-CM-06-M17) ────────────────────────────────────

  /** 나의 게시물 목록. */
  async selectMyPstList(): Promise<MyPstItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.myPstList)
    return apiClient.post<MyPstItem[], MyPstItem[]>('/v1/cms/my-posts')
  },

  // ── 실적증명서 제출 (MUI-CM-04-P20 PrfmncPrdocSbmsn) ──────────────────────
  // 설계서 00.공통 v0.84 slide336 "2. 이벤트 설명" 3건과 1:1.
  //   소비: src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtlPage.tsx (+ PrfmncPrdocSbmsn 콘텐츠)

  /** On-Load(scwin.onpageload) — 제출 협회 목록(dl_sbmsnAsctnList) 조회. */
  async selectSbmsnAsctnList(prfmncRcptNo: string): Promise<SbmsnAsctnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.sbmsnAsctnList)
    return apiClient.post<SbmsnAsctnItem[], SbmsnAsctnItem[]>(
      `/v1/cms/prfmnc-prdocs/${prfmncRcptNo}/sbmsn-asctns`,
    )
  },

  /** 제출하기(scwin.btn_sbmsn_onclick) — 발급된 실적증명서를 선택 협회로 제출(멀티). */
  async submitPrfmncPrdoc(params: { prfmncRcptNo: string; sbmsnSttsNms: string[] }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/prfmnc-prdocs/${params.prfmncRcptNo}/sbmsn`, {
      sbmsnSttsNms: params.sbmsnSttsNms,
    })
  },

  /**
   * 제출취소(scwin.btn_sbmsnRtrcn_onclick) — 협회로 제출된 건에 오류가 있어
   * 비고(rmrkCn)에 취소사유를 입력한 뒤 다시 협회로 전송한다.
   */
  async cancelSubmitPrfmncPrdoc(params: {
    prfmncRcptNo: string
    items: { sbmsnSttsNm: string; rmrkCn?: string }[]
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    await apiClient.post<void, void>(`/v1/cms/prfmnc-prdocs/${params.prfmncRcptNo}/sbmsn/cancel`, {
      items: params.items,
    })
  },
}
