// 입찰(BD) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: bdKeys.selectXxx / useSelectXxx) — 실규격 확정 전 임시 명명(select~ 스타일).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_BD, getBdopnById } from '@/mocks/bd'
import type { UploadedFile } from '@/types/file'
import type {
  AgreementDoc,
  AlonbsBidCnInfo,
  BdopnItem,
  BidAplyReceipt,
  BidItemListRow,
  BidListSearchRequest,
  BidPbancDetail,
  BidPbancItem,
  BidProgressRow,
  BidPrgrsItem,
  BidRegResultResponse,
  BidRsltProductItem,
  BidRsltRow,
  BidSelectOption,
  BfrPbancBidCnItem,
  BfrPbancInfoItem,
  CabinetFile,
  CnstwkLcnsRow,
  CrncOption,
  ElsgnCert,
  ItitbBidCnItem,
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
  PlrlRsrvPrcInfo,
  PqResultResponse,
  SmprcScsbdRsltInfo,
  RegBzentyRow,
  RegBzentySrchRequest,
  RegionResult,
  TndrSavePayload,
  WrotDoc,
} from '@/types/bd'

/** 업로드 multipart 폼 — Content-Type 은 호출부에서 비워 브라우저가 boundary 자동 생성. */
function uploadForm(file: File, extra?: Record<string, string>): FormData {
  const form = new FormData()
  form.append('file', file)
  form.append('bizDivCd', 'BD') // 백엔드 요구 파라미터
  if (extra) for (const [k, v] of Object.entries(extra)) form.append(k, v)
  return form
}

/** 목업 업로드 응답 — 서버 GUID 형식 값 생성(File 인자에서 계산). */
const mockUpload = (file: File): Promise<UploadedFile> =>
  mockDelay({ guid: crypto.randomUUID(), orgnlFileNm: file.name, fileSz: file.size }, 400)

/** 목업 다운로드 응답 — 바이너리(Blob) 자리표시. 실제 저장/뷰어는 호출측 담당. */
const mockBlob = (name: string): Promise<Blob> =>
  mockDelay(new Blob([`mock ${name}`], { type: 'application/octet-stream' }))

export const bdService = {
  // ── 입찰공고 (MUI-BD-01) ───────────────────────────────────────────────────

  /**
   * 입찰공고 통합목록 조회 — MUI-BD-01-M01 (bidPbancIntgList/BidPbancIntgListPage).
   * 목업은 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관).
   */
  async selectPbancList(params?: BidListSearchRequest): Promise<BidPbancItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pbancList)
    return apiClient.post<BidPbancItem[], BidPbancItem[]>('/v1/bds/pbancs', params)
  },

  /** 입찰공고 상세 조회(탭 콘텐츠 데이터) — MUI-BD-01-M07 (bidPbancDtl/BidPbancDtl). */
  async selectPbancDtl(id: string): Promise<BidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pbancDetail)
    return apiClient.post<BidPbancDetail, BidPbancDetail>(`/v1/bds/pbancs/${id}`)
  },

  /**
   * 입찰공고 상세 보완 필드(연락처·계약/입찰방법·진행 플래그) 조회
   * — MUI-BD-01-M07 (bidPbancDtl/BidPbancDtlPage).
   */
  async selectBidPbancDtl(id: string): Promise<BidPrgrsItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsDetail)
    return apiClient.post<BidPrgrsItem, BidPrgrsItem>(`/v1/bds/pbancs/${id}/progress-detail`)
  },

  /**
   * 입찰진행 현황 조회(입찰진행 탭)
   * — MUI-BD-01-T06(구 M12 — v1.83 재편) (bidPbancDtl/BidPbancDtl_Tacpg07).
   */
  async selectBidProgress(id: string): Promise<BidProgressRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.progressList)
    return apiClient.post<BidProgressRow[], BidProgressRow[]>(`/v1/bds/pbancs/${id}/progress`)
  },

  /**
   * 관심공고 등록/제외 토글(입찰공고·입찰결과·국외 공고 공용)
   * — MUI-BD-01-P13 (bidPbancDtl/BidPbancDtlPage · bidRsltDtl · ovsBidPbancDtl).
   */
  async toggleFavorite(id: string, favorite: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${id}/favorite`, { favorite })
  },

  // ── 개찰목록 · 입찰결과 (MUI-BD-08 · MUI-BD-09) ────────────────────────────

  /**
   * 개찰목록 조회 — MUI-BD-08-M01 (bdopnList/BdopnListPage).
   * 목업은 전체 반환(페이지 클라이언트 필터/페이징).
   */
  async selectBdopnList(params?: BidListSearchRequest): Promise<BdopnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bdopnList)
    return apiClient.post<BdopnItem[], BdopnItem[]>('/v1/bds/bdopns', params)
  },

  /**
   * 개찰(입찰결과) 상세 조회(요약 헤더) — MUI-BD-09-M01 (bidRsltDtl/BidRsltDtlPage).
   * 목업은 id 로 개찰목록 1건 lookup(직접진입/새로고침 대응).
   */
  async selectBidRsltDtl(id: string): Promise<BdopnItem> {
    if (USE_MOCK) return mockDelay(getBdopnById(id) ?? MOCK_BD.bdopnList[0])
    return apiClient.post<BdopnItem, BdopnItem>(`/v1/bds/bdopns/${id}`)
  },

  /**
   * 입찰결과(내 업체) 페이지 조회
   * — MUI-BD-09-T03(구 M03 — v1.83 재편) (bidRsltDtl/BidRsltDtl).
   */
  async selectBidRslt(id: string, page: number): Promise<BidRsltRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRsltList)
    return apiClient.post<BidRsltRow[], BidRsltRow[]>(`/v1/bds/bdopns/${id}/results`, { page })
  },

  /**
   * 협상결과 페이지 조회
   * — MUI-BD-09-T04(구 M04 — v1.83 재편) (bidRsltDtl/BidRsltDtl2).
   */
  async selectNegoRslt(id: string, page: number): Promise<NegoRsltRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.negoList)
    return apiClient.post<NegoRsltRow[], NegoRsltRow[]>(`/v1/bds/bdopns/${id}/nego-results`, { page })
  },

  /**
   * 입찰결과 품목정보 페이지 조회
   * — MUI-BD-09-T02(구 M02 — v1.83 재편) (bidRsltDtl/BidRsltDtlList).
   */
  async selectBidRsltItems(id: string, page: number): Promise<BidRsltProductItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRsltItems)
    return apiClient.post<BidRsltProductItem[], BidRsltProductItem[]>(`/v1/bds/bdopns/${id}/items`, { page })
  },

  /**
   * 복수예비가격 조회(생성된 예가 + 업체 선택번호) — MUI-BD-09-P02
   * (bidRsltDtl/PrprcFullPopup). 입찰결과 탭의 '복수예가조회' 버튼(slide245 이벤트표).
   */
  async selectPlrlRsrvPrcInfo(id: string): Promise<PlrlRsrvPrcInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.plrlRsrvPrcInfo)
    return apiClient.post<PlrlRsrvPrcInfo, PlrlRsrvPrcInfo>(`/v1/bds/bdopns/${id}/reserve-prices`)
  },

  /**
   * 동가낙찰결과 조회(자동추첨 + 가위바위보) — MUI-BD-09-P03
   * (bidRsltDtl/SmprcScsbdRsltFullPopup). 입찰결과 탭의 '동가낙찰결과' 버튼(slide245 이벤트표).
   */
  async selectSmprcScsbdRsltInfo(id: string): Promise<SmprcScsbdRsltInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.smprcScsbdRsltInfo)
    return apiClient.post<SmprcScsbdRsltInfo, SmprcScsbdRsltInfo>(
      `/v1/bds/bdopns/${id}/same-price-results`,
    )
  },

  /** 이행/적격심사 신청 — MUI-BD-10 (bidRsltDtl/BidRsltDtlPage). */
  async applyPfmncElgblScrn(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/bdopns/${id}/elgbl-screenings`, {})
  },

  // ── 사전심사 (MUI-BD-02) ───────────────────────────────────────────────────

  /**
   * 사전심사(PQ) 신청 — 첨부파일 guid 목록 제출
   * — MUI-BD-02-M01 (bfhdSrngAply/BfhdSrngAplyPage).
   */
  async applyBfhdSrng(pbancNo: string, fileGuids: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo}/pq-applies`, { fileGuids })
  },

  /** 사전심사 결과조회 — MUI-BD-02-M02 (bfhdSrngRsltInq/BfhdSrngRsltInqPage). */
  async selectPqResult(pbancNo: string): Promise<PqResultResponse> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pqResult)
    return apiClient.post<PqResultResponse, PqResultResponse>(`/v1/bds/pbancs/${pbancNo}/pq-result`)
  },

  /**
   * 생산능력서류 제출 — 첨부파일 guid 목록 제출
   * — MUI-BD-03-P06 (bfhdSrngRsltInq/PrdctnAbltDcmntSbmsn).
   */
  async submitProdAbilityDocs(pbancNo: string, fileGuids: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo}/prod-ability-docs`, { fileGuids })
  },

  // ── 입찰진행 (MUI-BD-03) ───────────────────────────────────────────────────

  /**
   * 입찰진행 목록 조회 — MUI-BD-03-M01 (bidPrgrsListForBzenty/BidPrgrsListForBzentyPage).
   * 목업은 전체 반환(페이지 클라이언트 필터/페이징).
   */
  async selectProgressList(params?: BidListSearchRequest): Promise<BidPrgrsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsList)
    return apiClient.post<BidPrgrsItem[], BidPrgrsItem[]>('/v1/bds/progresses', params)
  },

  /** 입찰포기 신청 — MUI-BD-03-P03 (bidPrgsDtlInq/BidAbndAperWrt). */
  async submitBidAbandon(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo}/abandon`, {})
  },

  /** 입찰취소 신청(사유 필수) — MUI-BD-03-P04 (bidPrgsDtlInq/BidRtrcnAperInq). */
  async submitBidCancel(payload: { bidRtrcnAplyRsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    const { pbancNo, ...body } = payload
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo ?? ''}/cancel`, body)
  },

  /** 입찰등록결과 조회 — MUI-BD-03-M05 (bidRegRsltInq/BidRegRsltInqPage). */
  async selectBidRegResult(pbancNo: string): Promise<BidRegResultResponse> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRegResult)
    return apiClient.post<BidRegResultResponse, BidRegResultResponse>(`/v1/bds/pbancs/${pbancNo}/reg-result`)
  },

  /** 입찰참가등록반려 신청 — MUI-BD-03-P07 (bidPrtcpAperWrt/BidPrtcpAplyRjct). */
  async applyBidPrtcpRegReject(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo}/reg-reject`, {})
  },

  // ── 입찰참가신청 (MUI-BD-04) ───────────────────────────────────────────────

  /**
   * 입찰 품목목록 페이지 조회
   * — MUI-BD-04-M06 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp2).
   */
  async selectItemList(pbancNo: string, page: number): Promise<BidItemListRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.itemList)
    return apiClient.post<BidItemListRow[], BidItemListRow[]>(`/v1/bds/pbancs/${pbancNo}/bid-items`, { page })
  },

  /**
   * 공사실적/면허 목록 페이지 조회
   * — MUI-BD-04-M07 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp3).
   */
  async selectCnstwkLcnsList(pbancNo: string, page: number): Promise<CnstwkLcnsRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.cnstwkList)
    return apiClient.post<CnstwkLcnsRow[], CnstwkLcnsRow[]>(`/v1/bds/pbancs/${pbancNo}/cnstwk-licenses`, { page })
  },

  /**
   * 입찰보증금(납부방법 등) 저장
   * — MUI-BD-04-M08 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp4).
   */
  async saveBidGuarantee(
    pbancNo: string,
    payload: { payMethod: string; exemptReason?: string },
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo}/guarantee`, payload)
  },

  /** 공동수급업체 동의 — MUI-BD-04-M10 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp5). */
  async agreeJointBzenty(bzentyId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/bds/joint-bzentys/agreements', { bzentyId })
  },

  /**
   * 등록업체 상세 조회(선택 업체로 공동수급 행 채움)
   * — MUI-BD-04-M10 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp5).
   */
  async selectRegBzentyDetail(bizRegNo: string): Promise<RegBzentyRow> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regBzentyList[0])
    return apiClient.post<RegBzentyRow, RegBzentyRow>(`/v1/bds/reg-bzentys/${bizRegNo}`)
  },

  /** 등록업체 검색(업체명/사업자번호) — MUI-BD-04-P11 (bidPrtcpAperWrt/RegBzentySrch). */
  async selectRegBzentyList(req: RegBzentySrchRequest): Promise<RegBzentyRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regBzentyList)
    return apiClient.post<RegBzentyRow[], RegBzentyRow[]>('/v1/bds/reg-bzentys', req)
  },

  /**
   * 캐비닛(디지털 문서함) 파일 목록 조회
   * — MUI-BD-04-P13 (bidPrtcpAperWrt/CabinetLink).
   */
  async linkCabinet(): Promise<CabinetFile[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.cabinetFiles)
    return apiClient.post<CabinetFile[], CabinetFile[]>('/v1/bds/cabinet-files')
  },

  /**
   * 동의서 조회(입찰참가신청 M14 · 입찰서 M07 공용)
   * — MUI-BD-04-M14 · MUI-BD-06-M07 (bidPrtcpAperWrt · tndrWrt AgreementForm).
   */
  async selectAgreement(agreementId: string): Promise<AgreementDoc> {
    if (USE_MOCK) return mockDelay(MOCK_BD.agreement)
    return apiClient.post<AgreementDoc, AgreementDoc>(`/v1/bds/agreements/${agreementId}`)
  },

  /** 동의서 선택 저장(라디오 변경 즉시) — MUI-BD-04-M14 · MUI-BD-06-M07. */
  async setAgreementChoice(agreementId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/agreements/${agreementId}/choice`, { choice })
  },

  /** 동의서 저장(확인) — MUI-BD-04-M14 · MUI-BD-06-M07. */
  async saveAgreement(agreementId: string, choice?: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/agreements/${agreementId}`, { choice })
  },

  // ── 전자서명 (MUI-BD-04-M21) ───────────────────────────────────────────────

  /** 전자서명 인증서 목록 조회 — MUI-BD-04-M21 (elsgn/ElsgnPage). */
  async selectElsgnCerts(): Promise<ElsgnCert[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.elsgnCerts)
    return apiClient.post<ElsgnCert[], ElsgnCert[]>('/v1/bds/elsgn/certs')
  },

  /** 전자서명 실행 — 성공 시 접수번호/일시 반환. MUI-BD-04-M21 (elsgn/ElsgnPage). */
  async signElsgn(certId: string, pbancNo: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>('/v1/bds/elsgn/sign', { certId, pbancNo })
  },

  // ── 견적서/입찰서 작성 (MUI-BD-06) ─────────────────────────────────────────

  /** 입찰서 품목목록 페이지 조회 — MUI-BD-06-M02 (tndrWrt/TndrWrt_Stp2). */
  async selectTndrItemList(pbancNo: string, page: number): Promise<BidItemListRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.itemList)
    return apiClient.post<BidItemListRow[], BidItemListRow[]>(`/v1/bds/pbancs/${pbancNo}/tndr-items`, { page })
  },

  /**
   * 입찰서 저장(스탭별 부분 저장 → 제출 시 전체)
   * — MUI-BD-06-M01 (tndrWrt/TndrWrtPage · Stp3~6).
   */
  async saveTndr(payload: TndrSavePayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/bds/tndrs', payload)
  },

  /**
   * 입찰서 첨부 업로드 — 서버 발급 UploadedFile 반환.
   * MUI-BD-06-M05 (tndrWrt/TndrWrt_Stp5).
   */
  async uploadTndrFile(pbancNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>('/v1/bds/tndrs/files', uploadForm(file, { pbancNo }), {
      headers: { 'Content-Type': undefined },
    })
  },

  /** 입찰서 첨부 삭제 — MUI-BD-06-M05 (tndrWrt/TndrWrt_Stp5). */
  async removeTndrFile(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/tndrs/files/${id}`)
  },

  // ── 서약서 (MUI-BD-04-M01) ─────────────────────────────────────────────────

  /** 서약서 조회 — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage). */
  async selectWrot(wrotId: string): Promise<WrotDoc> {
    if (USE_MOCK) return mockDelay(MOCK_BD.wrot)
    return apiClient.post<WrotDoc, WrotDoc>(`/v1/bds/wrots/${wrotId}`)
  },

  /**
   * 서약서 동의 선택(라디오 변경 즉시)
   * — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage · WrotAgreForm).
   */
  async setWrotChoice(wrotId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/wrots/${wrotId}/choice`, { choice })
  },

  /** 서약서 저장 — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage). */
  async saveWrot(wrotId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/wrots/${wrotId}`, {})
  },

  // ── 공통 검색 (도메인=bd) ──────────────────────────────────────────────────

  /** 면허정보 검색(면허명/코드 부분일치) — MUI-BD-01-P05 (cm/search/LcnsInfoSrch). */
  async searchLicenses(keyword: string): Promise<LicenseResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.licenses)
    return apiClient.post<LicenseResult[], LicenseResult[]>('/v1/bds/licenses', { keyword })
  },

  /** 지역 검색(시도/시군구 부분일치) — MUI-BD-01-P03 (cm/search/RgnSrch). */
  async searchRegions(keyword: string): Promise<RegionResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regions)
    return apiClient.post<RegionResult[], RegionResult[]>('/v1/bds/regions', { keyword })
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 국외(Overseas)
  // ══════════════════════════════════════════════════════════════════════════

  // ── 국외 입찰공고 상세 (MUI-BD-01-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ─────────────────────────────────

  /** 국외 입찰공고 상세(공고일반) 조회 — MUI-BD-01-M71 (ovsBidPbancDtl/OvsBidPbancDtlPage). */
  async selectOvsBidPbancDetail(id: string): Promise<OvsBidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPbancDetail)
    return apiClient.post<OvsBidPbancDetail, OvsBidPbancDetail>(`/v1/bds/ovs/pbancs/${id}`)
  },

  /**
   * 국외 품목 목록 조회
   * — MUI-BD-01-T72(구 M72 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl).
   */
  async selectOvsBidItemList(id: string): Promise<OvsBidItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidItemList)
    return apiClient.post<OvsBidItem[], OvsBidItem[]>(`/v1/bds/ovs/pbancs/${id}/items`)
  },

  /**
   * 국외 품목 첨부문서 목록 조회
   * — MUI-BD-01-P76 (ovsBidPbancDtl/OvsBidPbancDtl · OvsBidPbanc_AtchFileInq).
   */
  async selectOvsItemAtchFileList(frcptlArtclNo: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.post<OvsAtchDoc[], OvsAtchDoc[]>(`/v1/bds/ovs/items/${frcptlArtclNo}/atch-files`)
  },

  /** 국외 품목 첨부파일 다운로드 — MUI-BD-01-P76. */
  async downloadOvsItemAtchFile(no: number): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-item-atch-${no}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/item-atch-files/${no}/download`, null, { responseType: 'blob' })
  },

  /**
   * 국외 보관함 품목 추가(상세 화면)
   * — MUI-BD-01-T72(구 M72 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl).
   */
  async addOvsLockerItem(frcptlArtclNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/locker/items/${frcptlArtclNo}`, {})
  },

  /**
   * 국외 보관함 품목 삭제(상세 화면)
   * — MUI-BD-01-T72(구 M72 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl).
   */
  async deleteOvsLockerItem(frcptlArtclNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/locker/items/${frcptlArtclNo}`)
  },

  /**
   * 국외 공고 첨부서류 목록 조회
   * — MUI-BD-01-T73(구 M73 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl2).
   */
  async selectOvsBidAtchDocList(id: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.post<OvsAtchDoc[], OvsAtchDoc[]>(`/v1/bds/ovs/pbancs/${id}/atch-docs`)
  },

  /** 국외 공고 첨부서류 다운로드 — MUI-BD-01-T73(구 M73 — v1.83 재편). */
  async downloadOvsBidAtchDoc(no: number): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-atch-doc-${no}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/atch-docs/${no}/download`, null, { responseType: 'blob' })
  },

  // ── 국외 입찰참가신청서 (MUI-BD-04) ────────────────────────────────────────

  /**
   * 국외 입찰참가신청 등록결과(사업별) 조회
   * — MUI-BD-04-P83 (ovsBidPrtcpApfrDtl/OvsBidRegRsltByBiz).
   */
  async selectOvsBidRegRsltByBiz(): Promise<OvsBidRegRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRegRsltList)
    return apiClient.post<OvsBidRegRsltItem[], OvsBidRegRsltItem[]>('/v1/bds/ovs/bid-prtcp/reg-results')
  },

  /**
   * 국외 입찰참가신청서 취소 신청
   * — MUI-BD-04-P82 (ovsBidPrtcpApfrDtl/OvsBidPrtcpRtrcnAply).
   */
  async submitOvsBidPrtcpRtrcn(payload: {
    pbancNo: string
    pbancOd: string
    targets: string[]
    rsn: string
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/bds/ovs/bid-prtcp/retractions', payload)
  },

  /**
   * 국외 입찰보증금 목록(면제구분별) 조회. N=비면제 / Y=면제
   * — MUI-BD-04-T78(구 M80 — v1.83 재편) (ovsBidPrtcpApfrDtl/Tab3).
   */
  async selectOvsBidGrnteList(
    grnteExmptnSe: 'N' | 'Y',
  ): Promise<OvsBidBizItem[] | OvsBidBizExmptnItem[]> {
    if (USE_MOCK) {
      return mockDelay(grnteExmptnSe === 'Y' ? MOCK_BD.ovsBidBizExmptnList : MOCK_BD.ovsBidBizList)
    }
    return apiClient.post<OvsBidBizItem[] | OvsBidBizExmptnItem[], OvsBidBizItem[] | OvsBidBizExmptnItem[]>('/v1/bds/ovs/bid-prtcp/guarantees', { grnteExmptnSe })
  },

  /**
   * 국외 보증서류 다운로드(연대보증서/지급각서/납부서)
   * — MUI-BD-04-T78(구 M80 — v1.83 재편) (ovsBidPrtcpApfrDtl/Tab3).
   */
  async downloadGrnteDoc(docNo: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-grnte-doc-${docNo}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/guarantee-docs/${docNo}/download`, null, { responseType: 'blob' })
  },

  /**
   * 국외 첨부파일 다운로드(등록결과 첨부)
   * — MUI-BD-04-T79(구 M81 — v1.83 재편) (ovsBidPrtcpApfrDtl/Tab4).
   */
  async downloadAtchFile(atchFileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(atchFileNm)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/atch-files/${atchFileNm}/download`, null, { responseType: 'blob' })
  },

  /**
   * 국외 입찰참가 첨부서류 업로드 — 서버 발급 UploadedFile 반환.
   * MUI-BD-04-T75(구 M77 — v1.83 재편) (ovsBidPrtcpAply/AtchDocReg).
   */
  async uploadOvsBidPrtcpAtchDoc(pbancNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/bid-prtcp/atch-docs',
      uploadForm(file, { pbancNo }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰참가 첨부서류 삭제 — MUI-BD-04-T75(구 M77 — v1.83 재편). */
  async removeOvsBidPrtcpAtchDoc(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/bid-prtcp/atch-docs/${id}`)
  },

  /**
   * 국외 서약서(청렴서약) 조회
   * — MUI-BD-04-P03 (ovsBidPrtcpAply/OvsBidPrtcpAplyPage · OvsProbWrotAgre).
   */
  async selectOvsProbWrotAgre(wrotId: string): Promise<OvsProbWrotAgreResultInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsProbWrotAgre)
    return apiClient.post<OvsProbWrotAgreResultInfo, OvsProbWrotAgreResultInfo>(`/v1/bds/ovs/prob-wrots/${wrotId}`)
  },

  /** 국외 서약서 저장(동의) — MUI-BD-04-P03. */
  async saveOvsProbWrotAgre(wrotId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/prob-wrots/${wrotId}`, {})
  },

  /** 국외 서약서 동의 선택(라디오 변경 즉시) — MUI-BD-04-P03. */
  async setOvsWrotChoice(wrotId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/prob-wrots/${wrotId}/choice`, { choice })
  },

  /**
   * 국외 입찰참가신청서 등록 — 성공 시 접수번호/일시 반환.
   * MUI-BD-04-T75(구 M77 — v1.83 재편) (ovsBidPrtcpAply/OvsBidPrtcpAplyPage).
   */
  async registerOvsBidPrtcpAply(pbancNo: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>('/v1/bds/ovs/bid-prtcp/applies', { pbancNo })
  },

  /** 국외 입찰보증서 상세 조회 — MUI-BD-04-P76 (ovsBidPrtcpAply/OvsBidWtgrDtlFullPopup). */
  async selectOvsBidWtgrDtl(wtgrNo: string): Promise<OvsBidWtgrInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidWtgrInfo)
    return apiClient.post<OvsBidWtgrInfo, OvsBidWtgrInfo>(`/v1/bds/ovs/wtgrs/${wtgrNo}`)
  },

  /** 국외 입찰보증서 목록 조회 — MUI-BD-04-P75 (ovsBidPrtcpAply/OvsBidWtgrInqFullPopup). */
  async selectOvsBidWtgrList(): Promise<OvsBidWtgrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidWtgrList)
    return apiClient.post<OvsBidWtgrItem[], OvsBidWtgrItem[]>('/v1/bds/ovs/wtgrs')
  },

  /**
   * 국외 입찰업체 정보 조회(업체코드)
   * — MUI-BD-04-T73(구 M73 — v1.83 재편) (ovsBidPrtcpAply/Stp2).
   */
  async selectOvsSplyInfo(splyBzentyCd: string): Promise<OvsSplyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsSplyInfo)
    return apiClient.post<OvsSplyInfo, OvsSplyInfo>(`/v1/bds/ovs/sply-bzentys/${splyBzentyCd}`)
  },

  /**
   * 국외 연대보증서 업로드
   * — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3).
   */
  async uploadOvsGurnAgreDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'gurnAgre' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /**
   * 국외 지급각서 업로드
   * — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3).
   */
  async uploadOvsGiveWrtprmDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'giveWrtprm' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /**
   * 국외 보증보험 보증서 업로드
   * — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3).
   */
  async uploadOvsBidWtgrDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'bidWtgr' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /**
   * 국외 입찰보증금납부서 업로드
   * — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3).
   */
  async uploadOvsGrntePyslDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'grntePysl' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /**
   * 국외 입찰보증금 사업목록(면제구분) 조회
   * — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3).
   */
  async selectOvsBidGrnteBizList(pbancNo: string, depositType: string): Promise<OvsBidPrtcpBizItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPrtcpBizList)
    return apiClient.post<OvsBidPrtcpBizItem[], OvsBidPrtcpBizItem[]>('/v1/bds/ovs/bid-prtcp/guarantee-bizs', { pbancNo, depositType })
  },

  /**
   * 국외 입찰보증서 적용(사업에 증권 연결)
   * — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3).
   */
  async applyOvsBidWtgr(pbancNo: string, prchsDmndNo: string, wtgrNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/bds/ovs/wtgrs/applies', { pbancNo, prchsDmndNo, wtgrNo })
  },

  // ── 국외 입찰결과 (MUI-BD-09-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ──────────────────────────────────────

  /**
   * 국외 입찰결과 페이지 조회(단가제/총액제는 응답 형태로 분기)
   * — MUI-BD-09-T72/T73(구 M72/M73 — v1.83 재편) (ovsBidRsltDtl/OvsBidRsltDtl2 · OvsBidRsltDtl3).
   */
  async selectOvsBidRslt(page: number): Promise<OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRsltUnitPriceItems)
    return apiClient.post<
      OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[],
      OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[]
    >('/v1/bds/ovs/bid-results', { page })
  },

  // ── 국외 환율/목표가/보관함 (MUI-BD-01 · MUI-CM-01) ─────────────────────────

  /** 국외 환율정보 조회(기준일자) — MUI-BD-01-M74 (ovsExchrtList/OvsExchrtListFullPopup). */
  async selectExchangeRates(crtrYmd: string): Promise<OvsExchrtItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.exchrtList)
    return apiClient.post<OvsExchrtItem[], OvsExchrtItem[]>('/v1/bds/ovs/exchange-rates', { crtrYmd })
  },

  /**
   * 국외 목표가공개품목 목록 조회 — 목업은 전체 반환(페이지 더보기).
   * MUI-BD-01-M75 (ovsGoalPrcRlsItemList/OvsGoalPrcRlsItemListPage).
   */
  async selectOvsGoalPrcRlsItemList(params?: BidListSearchRequest): Promise<OvsGoalPrcRlsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsGoalPrcRlsList)
    return apiClient.post<OvsGoalPrcRlsItem[], OvsGoalPrcRlsItem[]>('/v1/bds/ovs/goal-price-items', params)
  },

  /**
   * 국외 보관함 입찰품목 목록 조회 — 목업은 전체 반환(페이지 클라이언트 필터/페이징).
   * MUI-CM-01-M73 (ovsLockerItemReg/OvsLockerItemRegPage).
   */
  async selectOvsLockerBidItemList(
    pbancNo: string,
    params?: BidListSearchRequest,
  ): Promise<OvsLockerBidItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerBidItemList)
    return apiClient.post<OvsLockerBidItem[], OvsLockerBidItem[]>(`/v1/bds/ovs/locker/${pbancNo}/bid-items`, params)
  },

  /** 국외 보관함 품목 추가(보관함 관리 화면) — MUI-CM-01-M73. */
  async addLockerItem(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/locker/bid-items/${id}`, {})
  },

  /** 국외 보관함 품목 삭제(보관함 관리 화면) — MUI-CM-01-M73. */
  async deleteLockerItem(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/locker/bid-items/${id}`)
  },

  /**
   * 국외 보관함 공고 상세(담당자 영역) 조회
   * — MUI-CM-01-M72 (ovsLockerPbanDtl/OvsLockerPbanDtlPage).
   */
  async selectOvsLockerPbanDtl(id: string): Promise<OvsLockerPbanItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerPbanList[0])
    return apiClient.post<OvsLockerPbanItem, OvsLockerPbanItem>(`/v1/bds/ovs/locker/pbancs/${id}`)
  },

  /**
   * 국외 보관함 공고 목록 조회 — 목업은 전체 반환(페이지 클라이언트 필터/페이징).
   * MUI-CM-01-M71 (ovsLockerPbanList/OvsLockerPbanListPage).
   */
  async selectOvsLockerPbanList(params?: BidListSearchRequest): Promise<OvsLockerPbanItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerPbanList)
    return apiClient.post<OvsLockerPbanItem[], OvsLockerPbanItem[]>('/v1/bds/ovs/locker/pbancs', params)
  },

  // ── 국외 공개수의협상 (MUI-BD-12) ──────────────────────────────────────────

  /**
   * 국외 공개수의협상 첨부파일 다운로드
   * — MUI-BD-12-T81(구 M81 — v1.83 재편) (ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtl4).
   */
  async downloadEtdcFile(id: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-etdc-${id}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/rls-vltrns/etdc-files/${id}/download`, null, { responseType: 'blob' })
  },

  /**
   * 국외 공개수의협상 견적서 취소 신청
   * — MUI-BD-12-P82 (ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt).
   */
  async submitOvsRlsVltrnsEtdcRtrcn(payload: { rsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/bds/ovs/rls-vltrns/etdc-retractions', payload)
  },

  /**
   * 국외 공개수의협상 견적서 품목 조회
   * — MUI-BD-12-T76(구 M76 — v1.83 재편) (ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn3).
   */
  async selectOvsRlsVltrnsEtdcItems(): Promise<OvsRlsVltrnsEtdcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsEtdcItems)
    return apiClient.post<OvsRlsVltrnsEtdcItem[], OvsRlsVltrnsEtdcItem[]>('/v1/bds/ovs/rls-vltrns/etdc-items')
  },

  /**
   * 국외 공개수의협상 견적서 제출
   * — MUI-BD-12-M74 (ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsnPage).
   */
  async submitOvsRlsVltrnsEtdc(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/rls-vltrns/${id}/etdc`, {})
  },

  /**
   * 국외 공개수의협상 품목정보 조회
   * — MUI-BD-12-T72(구 M72 — v1.83 재편) (ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl2).
   */
  async selectOvsRlsVltrnsItems(): Promise<OvsRlsVltrnsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsItems)
    return apiClient.post<OvsRlsVltrnsItem[], OvsRlsVltrnsItem[]>('/v1/bds/ovs/rls-vltrns/items')
  },

  /**
   * 국외 공개수의협상 첨부서류 조회
   * — MUI-BD-12-T73(구 M73 — v1.83 재편) (ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl3).
   */
  async selectOvsRlsVltrnsAtchDocs(): Promise<OvsRlsVltrnsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsAtchDocs)
    return apiClient.post<OvsRlsVltrnsAtchDoc[], OvsRlsVltrnsAtchDoc[]>('/v1/bds/ovs/rls-vltrns/atch-docs')
  },

  /**
   * 국외 공개수의협상 심사결과 조회
   * — MUI-BD-12-T83(구 M83 — v1.83 재편) (ovsRlsVltrnsNgtnSrngRsltInq/OvsRlsVltrnsNgtnSrngRsltInq2).
   */
  async selectOvsRlsVltrnsSrngRslt(): Promise<OvsRlsVltrnsSrngRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsSrngRslt)
    return apiClient.post<OvsRlsVltrnsSrngRsltItem[], OvsRlsVltrnsSrngRsltItem[]>('/v1/bds/ovs/rls-vltrns/srng-results')
  },

  // ── 국외 임시입찰내역/이전공고 (MUI-BD-01-M76 · T75·T76 · P79(구 M76~M79 — v1.83 재편)) ─────────────────────────

  /**
   * 국외 임시입찰내역 문서 업로드(품목대체/MOQ)
   * — MUI-BD-01-T75(구 M77 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn).
   */
  async uploadOvsBidCnDoc(
    frcptlArtclNo: string,
    field: 'itemSbstDocEn' | 'moqDocEn',
    file: File,
  ): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/tmpr-bid-cn/docs',
      uploadForm(file, { frcptlArtclNo, field }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /**
   * 국외 통화 목록 조회(달러환산율 포함)
   * — MUI-BD-01-T75(구 M77 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn).
   */
  async selectCrncList(): Promise<CrncOption[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.crncOptions)
    return apiClient.post<CrncOption[], CrncOption[]>('/v1/bds/ovs/currencies')
  },

  /**
   * 국외 입찰업체 목록 조회(셀렉트 옵션)
   * — MUI-BD-01-T75(구 M77 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn).
   */
  async selectOvsBidBzentyList(): Promise<BidSelectOption[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidBzentyOptions)
    return apiClient.post<BidSelectOption[], BidSelectOption[]>('/v1/bds/ovs/bid-bzentys')
  },

  /**
   * 국외 임시입찰내역 저장(단가제=행 배열 · 총액제=단건)
   * — MUI-BD-01-T75/T76(구 M77/M78 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn · BidDsctn2).
   */
  async saveOvsTmprBidCn(
    intgRfrncNo: string,
    payload: ItitbBidCnItem[] | AlonbsBidCnInfo,
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/tmpr-bid-cn/${intgRfrncNo}`, payload)
  },

  /**
   * 국외 임시입찰내역 삭제(단가제=선택 항목번호 · 총액제=전체)
   * — MUI-BD-01-T75/T76(구 M77/M78 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn · BidDsctn2).
   */
  async deleteOvsTmprBidCn(intgRfrncNo: string, checkedNos?: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/tmpr-bid-cn/${intgRfrncNo}`, { checkedNos })
  },

  /**
   * 국외 이전공고 입찰내역 불러오기(통합참조번호)
   * — MUI-BD-01-M76 (ovsTmprBidCnReg/OvsTmprBidCnRegPage).
   */
  async selectOvsBfrPbancBidCnList(intgRfrncNo: string): Promise<BfrPbancBidCnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancBidCnList)
    return apiClient.post<BfrPbancBidCnItem[], BfrPbancBidCnItem[]>(`/v1/bds/ovs/tmpr-bid-cn/${intgRfrncNo}/prev-bid-cn`)
  },

  /**
   * 국외 이전공고 보관함목록 조회(보관함 ID)
   * — MUI-BD-01-P79(구 M79 — v1.83 재편) (ovsBfrTmprBidBidCnReg/OvsBfrTmprBidBidCnRegPage).
   */
  async selectBfrPbancLockerList(lockerId: string): Promise<BfrPbancInfoItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancLockerList)
    return apiClient.post<BfrPbancInfoItem[], BfrPbancInfoItem[]>(`/v1/bds/ovs/locker/${lockerId}/prev-pbancs`)
  },

  /**
   * 국외 이전공고 입찰내역목록 조회(공고번호·차수)
   * — MUI-BD-01-P80 (ovsBfrTmprBidBidCnReg/BfrPbancBidDsctnItemDtlFullPopup).
   */
  async selectBfrPbancBidCnList(pbancNo: string, pbancOd: string): Promise<BfrPbancBidCnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancBidCnList)
    return apiClient.post<BfrPbancBidCnItem[], BfrPbancBidCnItem[]>(`/v1/bds/ovs/prev-pbancs/${pbancNo}/bid-cn`, { pbancOd })
  },

  /** 국외 이전공고 입찰내역 불러오기(선택 항목 적재) — MUI-BD-01-P80. */
  async loadBfrPbancBidCn(
    pbancNo: string,
    pbancOd: string,
    items: BfrPbancBidCnItem[],
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/prev-pbancs/${pbancNo}/bid-cn/load`, { pbancOd, items })
  },

  // ── 국외 입찰서 상세/제출 (MUI-BD-06) ──────────────────────────────────────

  /** 국외 입찰취소(투찰취소) 신청 — MUI-BD-06-P81 (ovsTndrDtl/OvsBidRtrcnAply). */
  async submitOvsBidRtrcn(payload: { rsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/bds/ovs/tndrs/retractions', payload)
  },

  /** 국외 입찰서 상세 조회 — MUI-BD-06-M75 (ovsTndrDtl/OvsTndrDtlPage). */
  async selectOvsTndrDtl(id: string): Promise<OvsTndrDtlItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrDetail)
    return apiClient.post<OvsTndrDtlItem, OvsTndrDtlItem>(`/v1/bds/ovs/tndrs/${id}`)
  },

  /**
   * 국외 입찰서 입찰참여품목 페이지 조회
   * — MUI-BD-06-T72/T77(구 M72/M77 — v1.83 재편) (ovsTndrDtl/Tab3 · ovsTndrSbmsn/Stp2).
   */
  async selectOvsTndrItemList(
    page: number,
    pbancNo?: string,
    pbancOd?: string,
  ): Promise<OvsTndrItitbItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrItitbItems)
    return apiClient.post<OvsTndrItitbItem[], OvsTndrItitbItem[]>('/v1/bds/ovs/tndrs/items', { page, pbancNo, pbancOd })
  },

  /**
   * 국외 입찰서 첨부문서 목록 조회
   * — MUI-BD-06-T79(구 M79 — v1.83 재편) (ovsTndrDtl/Tab4).
   */
  async selectOvsTndrDocList(): Promise<OvsTndrDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrDocList)
    return apiClient.post<OvsTndrDoc[], OvsTndrDoc[]>('/v1/bds/ovs/tndrs/docs')
  },

  /** 국외 입찰서 첨부문서 다운로드 — MUI-BD-06-T79(구 M79 — v1.83 재편). */
  async downloadOvsTndrDoc(atchFileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(atchFileNm)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/tndrs/docs/${atchFileNm}/download`, null, { responseType: 'blob' })
  },

  /**
   * 국외 입찰서 제출(투찰) — 성공 시 접수번호/일시 반환.
   * MUI-BD-06-T74(구 M74 — v1.83 재편) (ovsTndrSbmsn/OvsTndrSbmsnPage).
   */
  async submitOvsTndr(pbancNo: string, pbancOd: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>('/v1/bds/ovs/tndrs', { pbancNo, pbancOd })
  },

  /**
   * 국외 입찰서 첨부문서 조회(품목대체/MOQ 팝업)
   * — MUI-BD-06-T72(구 M72 — v1.83 재편) (ovsTndrSbmsn/Stp2).
   */
  async selectOvsAtchDoc(frcptlArtclNo: string, invtNo: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.post<OvsAtchDoc[], OvsAtchDoc[]>('/v1/bds/ovs/tndrs/atch-docs', { frcptlArtclNo, invtNo })
  },

  /**
   * 국외 입찰서 파일 업로드 — 서버 발급 UploadedFile 반환.
   * MUI-BD-06-T74(구 M74 — v1.83 재편) (ovsTndrSbmsn/Stp3).
   */
  async uploadOvsTndrFile(pbancNo: string, pbancOd: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/tndrs/files',
      uploadForm(file, { pbancNo, pbancOd }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰서 파일 삭제 — MUI-BD-06-T74(구 M74 — v1.83 재편). */
  async removeOvsTndrFile(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/tndrs/files/${id}`)
  },
}
