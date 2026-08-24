// 입찰(BD) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// 함수명 = 백엔드 메서드명(쿼리키·훅명과 통일: bdKeys.selectXxx / useSelectXxx) — 실 API 목록(no.28~215) 기준.
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로).
// 요청 body 항목명은 상세설계 대기 — 식별자는 설계서 항목명(pbancNo/pbancOd/prcmNo/frcptlArtclNo …)으로 전달.
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
//
// 📌 함수명 충돌 규칙 — bd 는 국내/국외 컨트롤러가 같은 메서드명을 여럿 공유한다(한 객체 안에서 충돌).
//   · 국내 ↔ 국외 충돌: 국외에 `Ovs` 접두 (selectBidPbancDtl → selectOvsBidPbancDtl · insertTndrSbmsn → insertOvsTndrSbmsn)
//   · 국외 ↔ 국외 충돌(같은 메서드명이 여러 Ovs 컨트롤러에): 컨트롤러명을 접두
//     (OvsTndrSbmsnController.selectBidPbancDtl → selectOvsTndrSbmsnBidPbancDtl)
//   URL 은 어느 경우에도 실경로 그대로라 백엔드 메서드 추적은 URL 마지막 세그먼트로 1:1 가능.
//
// ⚠️ 실 API 목록에 있으나 함수 미생성(모바일 소비처가 아직 인라인 목업 — 응답 항목명이 설계서 데이터영역에만 있고
//    types/bd.ts·mocks/bd.ts 에 없다. 임의 작명 금지 규칙에 따라 그 화면을 배선할 때 함께 추가한다):
//   no.33 기초예비가격정보조회(selectBrprcInfo, /bds/bd/bidPbanc/selectBrprcInfo.do) → MUI-BD-01-T02 BidPbancDtl_Tacpg02
//   no.34 품목명세서정보조회(selectItemDtstInfo, …/selectItemDtstInfo.do) → MUI-BD-01-T03 BidPbancDtl_Tacpg03
//   no.36 계약특수조건정보조회(selectOfcctrSpclCndInfo) → MUI-BD-01-T04 BidPbancDtl_Tacpg04
//   no.39 공고문안정보조회(selectPbancDrat) → MUI-BD-01-T05 BidPbancDtl_Tacpg06
//   no.52 공지사항조회(selectOfcctrNtc, /bds/bd/ovsBidPbanc/selectOfcctrNtc.do) → 모바일 소비 화면 미확정
//   no.86 입찰참가등록반려조회(selectBidPrtcpRegRjct) → MUI-BD-03-P07 반려 신청 후 조회(화면 없음)
//   no.88 입찰보증서정보조회(selectBidWtgrInfo) → MUI-BD-04-M08 BidPrtcpAperWrtPage_Stp4(BidGrnteInfo 목업 미이관)
//   no.89/91/92 생산능력서류 제출조회·조회·상세조회(selectPrdcpDcmntSbmsn/selectPrdcpDcmnt/selectPrdcpDcmntDtl)
//     → MUI-BD-03-P06 PrdctnAbltDcmntSbmsn(현재 제출만 배선)
//   no.120 입찰포기신청서조회(selectBidAbndApfr) → MUI-BD-03 BidAbndAperDtl
//   no.122 입찰취소신청서조회(selectBidRtrcnApfr) → MUI-BD-03 BidRtrcnAperInqDtl
//   no.138/142 기술평가결과등록조회·기술평가결과조회(selectTechEvlRsltReg/selectTechEvlRslt) → MUI-BD-07-P01 TechEvlRsltInq
//   no.143 입찰공고상세조회 · no.144 기술평가결과조회(selectBidPbancDtl/selectTechEvlRsl, OvsTechEvlController)
//     → 국외 기술평가 화면 미확정(모바일 화면 없음)
//   no.170/172 입찰결과현황조회·나의입찰결과현황조회(selectBidRsltPrst/selectMyBidRsltPrst)
//     → MUI-BD-09-T72 OvsBidRsltDtl2 상단 현황(OvsBidRsltUnitPriceStatus 목업 미이관)
//   no.175/178/179 이행·적격심사 상세/결과/포기신청 정보조회 → MUI-BD-10 ImpltPage·ImpltElgblRslt_*·ImpltElgbSrngAbndAply
//   no.206 공개수의협상재입찰조회(selectRlsVltrnsNgtnRebid) → 모바일 소비 화면 미확정
//   no.214 견적서상세조회(selectEtdcDtl) → MUI-BD-12-M78 OvsRlsVltrnsNgtnEtdcDtlPage
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
  BidPbancListSrchMap,
  BidProgressRow,
  BidPrgrsDetail,
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
  EvlMbcmtTechEvlScrItem,
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
  SmprcScsbdRsltItem,
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
   * no.28 입찰공고통합목록조회 — MUI-BD-01-M01 (bidPbancIntgList/BidPbancIntgListPage).
   * 목업은 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관). 구 `selectPbancList`.
   * 요청/응답 키는 PC 실 인터페이스(TempbidPbancIntgList ISrchMap/IBidPbancList, 2026-08-24 판독본) 반영 —
   * 서버 검색 전환 시 페이지 SearchFilterValue → BidPbancListSrchMap 변환 배선 필요.
   */
  async selectBidPbancIntgList(params?: BidPbancListSrchMap): Promise<BidPbancItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pbancList)
    return apiClient.post<BidPbancItem[], BidPbancItem[]>(
      '/bds/bd/bidPbanc/selectBidPbancIntgList.do',
      params,
    )
  },

  /**
   * no.32 공고일반정보조회 — MUI-BD-01-T01 (bidPbancDtl/BidPbancDtl 일반정보 탭). 구 `selectPbancDtl`.
   * 상세 페이지(BidPbancDtlPage)의 기본 조회 — 나머지 탭(기초예비가격·품목명세서·계약특수조건·공고문안)은
   * 실 API 가 탭별로 갈린다(no.33/34/36/39 — 파일 상단 ⚠️ 미생성 목록 참고).
   */
  async selectPbancGnrlInfo(id: string): Promise<BidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pbancDetail)
    return apiClient.post<BidPbancDetail, BidPbancDetail>(
      '/bds/bd/bidPbanc/selectPbancGnrlInfo.do',
      { pbancNo: id },
    )
  },

  /**
   * 입찰공고 상세 보완 필드(연락처·계약/입찰방법·진행 플래그) 조회
   * — MUI-BD-01-M07 (bidPbancDtl/BidPbancDtlPage).
   * TODO(백엔드 확정): no.32 와 같은 URL — 공고일반 응답에 진행 플래그가 함께 실리는지 미확정이라
   *   화면 소비 단위가 달라 함수만 분리해 둔다. 별도 메서드가 확인되면 이 함수의 URL·함수명만 교체.
   */
  async selectBidPbancDtl(id: string): Promise<BidPrgrsItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsDetail)
    return apiClient.post<BidPrgrsItem, BidPrgrsItem>('/bds/bd/bidPbanc/selectPbancGnrlInfo.do', {
      pbancNo: id,
    })
  },

  /**
   * no.40 입찰진행현황목록조회 — MUI-BD-01-T06(구 M12 — v1.83 재편)
   * (bidPbancDtl/BidPbancDtl_Tacpg07). 구 `selectBidProgress`.
   */
  async selectBidPrgrsPrstList(id: string): Promise<BidProgressRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.progressList)
    return apiClient.post<BidProgressRow[], BidProgressRow[]>(
      '/bds/bd/bidPbanc/selectBidPrgrsPrstList.do',
      { pbancNo: id },
    )
  },

  /**
   * no.30 관심공고등록 — MUI-BD-01-P13 (bidPbancDtl/BidPbancDtlPage · bidRsltDtl). 구 `toggleFavorite`(국내분).
   * TODO(백엔드 확정): 실 API 목록에 '관심공고 제외(삭제)' 가 없다 — 등록/제외를 한 API 가 토글로 처리하는지
   *   미확정이라 화면 토글 값(favorite)을 그대로 보낸다. 삭제 API 가 별도면 함수를 분리한다.
   */
  async insertItrstPbanc(id: string, favorite: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPbanc/insertItrstPbanc.do', {
      pbancNo: id,
      itrstYn: favorite ? 'Y' : 'N',
    })
  },

  // ── 개찰목록 · 입찰결과 (MUI-BD-08 · MUI-BD-09) ────────────────────────────

  /**
   * no.147 개찰목록조회 — MUI-BD-08-M01 (bdopnList/BdopnListPage).
   * 목업은 전체 반환(페이지 클라이언트 필터/페이징).
   */
  async selectBdopnList(params?: BidListSearchRequest): Promise<BdopnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bdopnList)
    return apiClient.post<BdopnItem[], BdopnItem[]>('/bds/bd/bidEnfrc/selectBdopnList.do', params)
  },

  /**
   * no.165 입찰결과정보조회 — MUI-BD-09-M01 (bidRsltDtl/BidRsltDtlPage) 요약 헤더. 구 `selectBidRsltDtl`.
   * ⚠️ 함수명의 `selct` 오타는 백엔드 메서드명(URL) 그대로 — 추적 1:1 유지를 위해 보정하지 않는다.
   * 목업은 id 로 개찰목록 1건 lookup(직접진입/새로고침 대응).
   */
  async selctBidRsltInfo(id: string): Promise<BdopnItem> {
    if (USE_MOCK) return mockDelay(getBdopnById(id) ?? MOCK_BD.bdopnList[0])
    return apiClient.post<BdopnItem, BdopnItem>('/bds/bd/bidRslt/selctBidRsltInfo.do', {
      pbancNo: id,
    })
  },

  /**
   * 입찰결과(내 업체) 페이지 조회
   * — MUI-BD-09-T03(구 M03 — v1.83 재편) (bidRsltDtl/BidRsltDtl).
   * TODO(백엔드 확정): no.165 와 같은 URL — 실 API 는 입찰결과정보 하나뿐이라 탭별 응답 분리 여부가 미확정.
   *   탭 전용 메서드가 확인되면 이 함수의 URL 만 교체.
   */
  async selectBidRslt(id: string, page: number): Promise<BidRsltRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRsltList)
    return apiClient.post<BidRsltRow[], BidRsltRow[]>('/bds/bd/bidRslt/selctBidRsltInfo.do', {
      pbancNo: id,
      page,
    })
  },

  /**
   * 협상결과 페이지 조회
   * — MUI-BD-09-T04(구 M04 — v1.83 재편) (bidRsltDtl/BidRsltDtl2).
   * TODO(백엔드 확정): no.165 와 같은 URL — T03 과 동일 사유.
   */
  async selectNegoRslt(id: string, page: number): Promise<NegoRsltRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.negoList)
    return apiClient.post<NegoRsltRow[], NegoRsltRow[]>('/bds/bd/bidRslt/selctBidRsltInfo.do', {
      pbancNo: id,
      page,
    })
  },

  /**
   * 입찰결과 품목정보 페이지 조회
   * — MUI-BD-09-T02(구 M02 — v1.83 재편) (bidRsltDtl/BidRsltDtlList).
   * TODO(백엔드 확정): no.165 와 같은 URL — T03 과 동일 사유(품목은 no.34 품목명세서정보조회일 가능성도 있음).
   */
  async selectBidRsltItems(id: string, page: number): Promise<BidRsltProductItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRsltItems)
    return apiClient.post<BidRsltProductItem[], BidRsltProductItem[]>(
      '/bds/bd/bidRslt/selctBidRsltInfo.do',
      { pbancNo: id, page },
    )
  },

  /**
   * 복수예비가격 조회(생성된 예가 + 업체 선택번호) — MUI-BD-09-P02
   * (bidRsltDtl/PrprcFullPopup). 입찰결과 탭의 '복수예가조회' 버튼(slide245 이벤트표).
   * TODO(실API 미매핑): 실 API 목록에 복수예비가격 조회가 없다 — 후보 no.33 기초예비가격정보조회
   *   (`/bds/bd/bidPbanc/selectBrprcInfo.do`)이나 예가 성격이 달라 잇지 않는다. URL 은 확정 전 임시.
   */
  async selectPlrlRsrvPrcInfo(id: string): Promise<PlrlRsrvPrcInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.plrlRsrvPrcInfo)
    return apiClient.post<PlrlRsrvPrcInfo, PlrlRsrvPrcInfo>(`/v1/bds/bdopns/${id}/reserve-prices`)
  },

  /**
   * 동가낙찰결과 조회(자동추첨 + 가위바위보) — MUI-BD-09-P03
   * (bidRsltDtl/SmprcScsbdRsltFullPopup). 입찰결과 탭의 '동가낙찰결과' 버튼(slide245 이벤트표).
   * TODO(실API 미매핑): 국내 동가낙찰결과 API 가 목록에 없다 — 후보 no.173(국외 selectSmprcScsbdRsltList).
   *   URL 은 확정 전 임시.
   */
  async selectSmprcScsbdRsltInfo(id: string): Promise<SmprcScsbdRsltInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.smprcScsbdRsltInfo)
    return apiClient.post<SmprcScsbdRsltInfo, SmprcScsbdRsltInfo>(
      `/v1/bds/bdopns/${id}/same-price-results`,
    )
  },

  /**
   * no.167 평가위원별기술평가점수정보조회 — MUI-BD-09-P04
   * (bidRsltDtl/EvlMbcmtTechEvlScrDtlFullPopup). 입찰결과 탭 업체 행의 '기술점수' 버튼(slide245).
   */
  async selectEvlMbcmtTechEvlScrInfo(bidRsltId: string): Promise<EvlMbcmtTechEvlScrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.evlMbcmtTechEvlScrList)
    return apiClient.post<EvlMbcmtTechEvlScrItem[], EvlMbcmtTechEvlScrItem[]>(
      '/bds/bd/bidRslt/selectEvlMbcmtTechEvlScrInfo.do',
      { bidRsltNo: bidRsltId },
    )
  },

  // ── 이행/적격심사 (MUI-BD-10) ──────────────────────────────────────────────

  /**
   * no.177 이행/적격심사신청처리 — MUI-BD-10 (bidRsltDtl/BidRsltDtlPage '이행/적격심사 신청하기').
   * 구 `applyPfmncElgblScrn`.
   */
  async saveImpltElgbSrngAply(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/impltElgbSrng/saveImpltElgbSrngAply.do', {
      pbancNo: id,
    })
  },

  /**
   * no.176 이행/적격심사신청저장처리(임시저장) — MUI-BD-10 (bidRsltDtl/ImpltPage 단계별 저장).
   * 화면 미배선(현재 인라인 목업) — 소비처 생기면 훅 추가.
   */
  async saveImpltElgbSrngAplyStrg(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/impltElgbSrng/saveImpltElgbSrngAplyStrg.do', {
      pbancNo: id,
    })
  },

  /**
   * no.180 이행/적격심사포기처리 — MUI-BD-10-P02 (bidRsltDtl/ImpltElgbSrngAbndAply).
   * 화면 미배선(현재 인라인 목업) — 소비처 생기면 훅 추가.
   */
  async saveImpltElgbSrngAbnd(id: string, abndRsn: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/impltElgbSrng/saveImpltElgbSrngAbnd.do', {
      pbancNo: id,
      abndRsn,
    })
  },

  // ── 사전심사 (MUI-BD-02) ───────────────────────────────────────────────────

  /**
   * 사전심사(PQ) 신청 — 첨부파일 guid 목록 제출
   * — MUI-BD-02-M01 (bfhdSrngAply/BfhdSrngAplyPage).
   * TODO(실API 미매핑): 실 API 목록의 BfhdSrngController 에 업체 '신청' 등록이 없다(조회 no.67 ·
   *   결과저장 no.71 · 결과상세조회 no.72 뿐) — 후보 no.71 사전심사결과저장(insertBfhdSrngRslt).
   *   확신이 없어 잇지 않고 임시 URL 유지.
   */
  async applyBfhdSrng(pbancNo: string, fileGuids: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo}/pq-applies`, { fileGuids })
  },

  /**
   * no.67 사전심사신청조회 — MUI-BD-02-M03 (bfhdSrngRsltInq/BfhdSrngRsltInqPage mode='aply').
   * 화면 미배선(현재 인라인 목업) — 소비처 생기면 훅 추가. 응답 구성은 결과조회(no.72)와 같은 4블록.
   */
  async selectBfhdSrngAply(pbancNo: string): Promise<PqResultResponse> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pqResult)
    return apiClient.post<PqResultResponse, PqResultResponse>(
      '/bds/bd/bfhdSrng/selectBfhdSrngAply.do',
      { pbancNo },
    )
  },

  /**
   * no.71 사전심사결과저장 — 소비 화면 미확정(발주기관 결과 등록 계열로 보임). 화면 미배선.
   * TODO(백엔드 확정): 업체(모바일) 흐름에서 쓰이는지 확인 — 쓰인다면 applyBfhdSrng 를 이 함수로 대체.
   */
  async insertBfhdSrngRslt(pbancNo: string, fileGuids: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bfhdSrng/insertBfhdSrngRslt.do', {
      pbancNo,
      fileGuids,
    })
  },

  /**
   * no.72 사전심사결과상세조회 — MUI-BD-02-M02 (bfhdSrngRsltInq/BfhdSrngRsltInqPage mode='rslt').
   * 구 `selectPqResult`.
   */
  async selectBfhdSrngRsltDtl(pbancNo: string): Promise<PqResultResponse> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pqResult)
    return apiClient.post<PqResultResponse, PqResultResponse>(
      '/bds/bd/bfhdSrng/selectBfhdSrngRsltDtl.do',
      { pbancNo },
    )
  },

  /**
   * no.90 생산능력서류제출 — 첨부파일 guid 목록 제출
   * — MUI-BD-03-P06 (bfhdSrngRsltInq/PrdctnAbltDcmntSbmsn). 구 `submitProdAbilityDocs`.
   */
  async insertPrdcpDcmntSbmsn(pbancNo: string, fileGuids: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrtcpAply/insertPrdcpDcmntSbmsn.do', {
      pbancNo,
      fileGuids,
    })
  },

  // ── 입찰진행 (MUI-BD-03) ───────────────────────────────────────────────────

  /**
   * no.73 입찰진행조회(조달업체) — MUI-BD-03-M01
   * (bidPrgrsListForBzenty/BidPrgrsListForBzentyPage). 구 `selectProgressList`.
   * 목업은 전체 반환(페이지 클라이언트 필터/페이징).
   */
  async selectBidPrgrsListForBzenty(params?: BidListSearchRequest): Promise<BidPrgrsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsList)
    return apiClient.post<BidPrgrsItem[], BidPrgrsItem[]>(
      '/bds/bd/bidPrgrs/selectBidPrgrsListForBzenty.do',
      params,
    )
  },

  /**
   * no.74 입찰진행조회(발주기관) — 모바일은 업체용(no.73)만 소비. 화면 미배선(훅 없음).
   * 응답은 업체용과 같은 진행 아이템으로 잠정 사용.
   */
  async selectBidPrgrsListForOfcctr(params?: BidListSearchRequest): Promise<BidPrgrsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsList)
    return apiClient.post<BidPrgrsItem[], BidPrgrsItem[]>(
      '/bds/bd/bidPrgrs/selectBidPrgrsListForOfcctr.do',
      params,
    )
  },

  /**
   * no.75 입찰참가신청필수확인 — 입찰참가신청 진입 전 가드(MUI-BD-03-M01 → MUI-BD-04).
   * TODO(백엔드 확정): 응답(제한 사유·통과 여부) 형식 미확정 — 현재는 실패 시 ApiError 로 처리되는 전제.
   */
  async procBidPrtcpAplyEsntlIdnty(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrgrs/procBidPrtcpAplyEsntlIdnty.do', { pbancNo })
  },

  /**
   * no.76 입찰서제출필수확인 — 입찰서(견적서) 작성 진입 전 가드(MUI-BD-06).
   * TODO(백엔드 확정): 응답 형식 미확정 — no.75 와 동일 사유.
   */
  async procTndrSbmsnEsntlIdnty(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrgrs/procTndrSbmsnEsntlIdnty.do', { pbancNo })
  },

  /**
   * no.77 중복투찰제한 — 투찰 전 중복 여부 확인.
   * TODO(백엔드 확정): 응답 형식 미확정 — no.75 와 동일 사유.
   */
  async procDpcnBdngLmt(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrgrs/procDpcnBdngLmt.do', { pbancNo })
  },

  /**
   * no.78 투찰제한 — 투찰 전 자격 제한 확인.
   * TODO(백엔드 확정): 응답 형식 미확정 — no.75 와 동일 사유.
   */
  async procBdngLmt(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrgrs/procBdngLmt.do', { pbancNo })
  },

  /** no.119 입찰포기신청서제출 — MUI-BD-03-P03 (bidPrgsDtlInq/BidAbndAperWrt). 구 `submitBidAbandon`. */
  async insertBidAbndApfrSbmsn(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/tndrSbmsn/insertBidAbndApfrSbmsn.do', { pbancNo })
  },

  /**
   * no.121 입찰취소신청서제출(사유 필수) — MUI-BD-03-P04 (bidPrgsDtlInq/BidRtrcnAperInq).
   * 구 `submitBidCancel`.
   */
  async insertBidRtrcnApfrSbmsn(payload: {
    bidRtrcnAplyRsn: string
    pbancNo?: string
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/tndrSbmsn/insertBidRtrcnApfrSbmsn.do', payload)
  },

  /**
   * 입찰등록결과 조회 — MUI-BD-03-M05 (bidRegRsltInq/BidRegRsltInqPage).
   * TODO(실API 미매핑): 국내 '입찰등록결과조회' 가 목록에 없다(no.100 은 국외 OvsBidPrtcpAplyController) —
   *   후보 no.80 입찰참가신청서조회(업체)·no.100. 확신이 없어 잇지 않고 임시 URL 유지.
   */
  async selectBidRegResult(pbancNo: string): Promise<BidRegResultResponse> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRegResult)
    return apiClient.post<BidRegResultResponse, BidRegResultResponse>(
      `/v1/bds/pbancs/${pbancNo}/reg-result`,
    )
  },

  /**
   * no.85 입찰참가등록반려신청 — MUI-BD-03-P07 (bidPrtcpAperWrt/BidPrtcpAplyRjct).
   * 구 `applyBidPrtcpRegReject`.
   */
  async insertBidPrtcpRegRjctAply(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrtcpAply/insertBidPrtcpRegRjctAply.do', {
      pbancNo,
    })
  },

  // ── 입찰참가신청 (MUI-BD-04) ───────────────────────────────────────────────

  /**
   * no.80 입찰참가신청서조회(업체) — MUI-BD-04 (bidPrtcpAperDtl/BidPrtcpAperDtlPage).
   * 화면 미배선(현재 navigate state + 인라인 목업) — 소비처 생기면 훅 추가.
   */
  async selectBidPrtcpApfrForBzenty(pbancNo: string): Promise<BidPrgrsDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsDetail)
    return apiClient.post<BidPrgrsDetail, BidPrgrsDetail>(
      '/bds/bd/bidPrtcpAply/selectBidPrtcpApfrForBzenty.do',
      { pbancNo },
    )
  },

  /**
   * no.81 입찰참가신청 — MUI-BD-04 (bidPrtcpAperWrt/BidPrtcpAperWrtPage) 최종 제출.
   * 화면 미배선: 현재 모바일은 마지막 탭 → 전자서명(M21) → `signElsgn` 으로 제출을 확정한다.
   * TODO(백엔드 확정): 전자서명 서명값이 이 API 의 body 항목인지(= signElsgn 이 이 API 로 흡수되는지) 확인 필요.
   */
  async insertBidPrtcpAply(pbancNo: string, fileGuids: string[] = []): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>(
      '/bds/bd/bidPrtcpAply/insertBidPrtcpAply.do',
      { pbancNo, fileGuids },
    )
  },

  /**
   * 입찰 품목목록 페이지 조회
   * — MUI-BD-04-M06 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp2).
   * TODO(실API 미매핑): 신청서 품목목록 전용 API 가 목록에 없다 — 후보 no.34 품목명세서정보조회
   *   (공고 탭 API 라 응답 구성이 다를 수 있음). 확신이 없어 잇지 않고 임시 URL 유지.
   */
  async selectItemList(pbancNo: string, page: number): Promise<BidItemListRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.itemList)
    return apiClient.post<BidItemListRow[], BidItemListRow[]>(
      `/v1/bds/pbancs/${pbancNo}/bid-items`,
      { page },
    )
  },

  /**
   * 공사실적/면허 목록 페이지 조회
   * — MUI-BD-04-M07 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp3).
   * TODO(실API 미매핑): 대응 항목 없음. URL 임시.
   */
  async selectCnstwkLcnsList(pbancNo: string, page: number): Promise<CnstwkLcnsRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.cnstwkList)
    return apiClient.post<CnstwkLcnsRow[], CnstwkLcnsRow[]>(
      `/v1/bds/pbancs/${pbancNo}/cnstwk-licenses`,
      { page },
    )
  },

  /**
   * 입찰보증금(납부방법 등) 저장
   * — MUI-BD-04-M08 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp4).
   * TODO(실API 미매핑): 보증금 저장 API 가 목록에 없다(no.88 은 보증서 '조회') — URL 임시.
   */
  async saveBidGuarantee(
    pbancNo: string,
    payload: { payMethod: string; exemptReason?: string },
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/pbancs/${pbancNo}/guarantee`, payload)
  },

  /** no.82 공동수급동의 — MUI-BD-04-M10 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp5). 구 `agreeJointBzenty`. */
  async updateJtngpAgre(bzentyId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrtcpAply/updateJtngpAgre.do', { bzentyId })
  },

  /** no.83 공동수급동의거부 — MUI-BD-04-M10 동의 거부. 화면 미배선(훅 없음). */
  async updateJtngpDsag(bzentyId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/bidPrtcpAply/updateJtngpDsag.do', { bzentyId })
  },

  /**
   * 등록업체 상세 조회(선택 업체로 공동수급 행 채움)
   * — MUI-BD-04-M10 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp5).
   * TODO(실API 미매핑): 국내 등록업체 조회가 목록에 없다 — 후보 no.96 업체정보조회(국외 컨트롤러). URL 임시.
   */
  async selectRegBzentyDetail(bizRegNo: string): Promise<RegBzentyRow> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regBzentyList[0])
    return apiClient.post<RegBzentyRow, RegBzentyRow>(`/v1/bds/reg-bzentys/${bizRegNo}`)
  },

  /**
   * 등록업체 검색(업체명/사업자번호) — MUI-BD-04-P11 (bidPrtcpAperWrt/RegBzentySrch).
   * TODO(실API 미매핑): 대응 항목 없음. URL 임시.
   */
  async selectRegBzentyList(req: RegBzentySrchRequest): Promise<RegBzentyRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regBzentyList)
    return apiClient.post<RegBzentyRow[], RegBzentyRow[]>('/v1/bds/reg-bzentys', req)
  },

  /**
   * 캐비닛(디지털 문서함) 파일 목록 조회
   * — MUI-BD-04-P13 (bidPrtcpAperWrt/CabinetLink).
   * TODO(실API 미매핑): 대응 항목 없음(공통 문서함은 cm 도메인 소관 가능성). URL 임시.
   */
  async linkCabinet(): Promise<CabinetFile[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.cabinetFiles)
    return apiClient.post<CabinetFile[], CabinetFile[]>('/v1/bds/cabinet-files')
  },

  /**
   * 동의서 조회(입찰참가신청 M14 · 입찰서 M07 공용)
   * — MUI-BD-04-M14 · MUI-BD-06-M07 (bidPrtcpAperWrt · tndrWrt AgreementForm).
   * TODO(실API 미매핑): 대응 항목 없음. URL 임시.
   */
  async selectAgreement(agreementId: string): Promise<AgreementDoc> {
    if (USE_MOCK) return mockDelay(MOCK_BD.agreement)
    return apiClient.post<AgreementDoc, AgreementDoc>(`/v1/bds/agreements/${agreementId}`)
  },

  /** 동의서 선택 저장(라디오 변경 즉시) — MUI-BD-04-M14 · MUI-BD-06-M07. 실목록 외 — URL 임시. */
  async setAgreementChoice(agreementId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/agreements/${agreementId}/choice`, { choice })
  },

  /** 동의서 저장(확인) — MUI-BD-04-M14 · MUI-BD-06-M07. 실목록 외 — URL 임시. */
  async saveAgreement(agreementId: string, choice?: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/agreements/${agreementId}`, { choice })
  },

  // ── 전자서명 (MUI-BD-04-M21) ───────────────────────────────────────────────

  /** 전자서명 인증서 목록 조회 — MUI-BD-04-M21 (elsgn/ElsgnPage). 실목록 외 — URL 임시. */
  async selectElsgnCerts(): Promise<ElsgnCert[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.elsgnCerts)
    return apiClient.post<ElsgnCert[], ElsgnCert[]>('/v1/bds/elsgn/certs')
  },

  /**
   * 전자서명 실행 — 성공 시 접수번호/일시 반환. MUI-BD-04-M21 (elsgn/ElsgnPage).
   * TODO(실API 미매핑): '전자서명' 자체 API 가 목록에 없다. 화면은 PQ/입찰참가신청/입찰서 세 흐름이 공유하며,
   *   실제로는 각 제출 API(no.81 insertBidPrtcpAply · no.118 insertTndrSbmsn · 사전심사 신청)의 body 항목으로
   *   서명값이 들어갈 가능성이 크다. 확정 시 aplyType 별로 함수를 나누고 이 함수는 제거.
   */
  async signElsgn(certId: string, pbancNo: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>('/v1/bds/elsgn/sign', { certId, pbancNo })
  },

  // ── 견적서/입찰서 작성 (MUI-BD-06) ─────────────────────────────────────────

  /**
   * no.117 입찰서제출조회 — MUI-BD-06 (tndrInq/TndrInqPage) 제출한 입찰서 조회.
   * 화면 미배선(현재 navigate state + 인라인 목업) — 소비처 생기면 훅 추가.
   */
  async selectTndrSbmsn(pbancNo: string): Promise<BidPrgrsDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsDetail)
    return apiClient.post<BidPrgrsDetail, BidPrgrsDetail>(
      '/bds/bd/tndrSbmsn/selectTndrSbmsn.do',
      { pbancNo },
    )
  },

  /**
   * 입찰서 품목목록 페이지 조회 — MUI-BD-06-M02 (tndrWrt/TndrWrt_Stp2 · tndrInq/TndrInq_tab2).
   * TODO(실API 미매핑): 입찰서 품목목록 전용 API 가 국내 목록에 없다 — 후보 no.34 품목명세서정보조회.
   *   (국외 no.135 는 `selectOvsTndrItemList` 로 별도.) URL 임시.
   */
  async selectTndrItemList(pbancNo: string, page: number): Promise<BidItemListRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.itemList)
    return apiClient.post<BidItemListRow[], BidItemListRow[]>(
      `/v1/bds/pbancs/${pbancNo}/tndr-items`,
      { page },
    )
  },

  /**
   * no.118 입찰서제출 — MUI-BD-06-M01 (tndrWrt/TndrWrtPage · Stp3~6). 구 `saveTndr`.
   * 모바일은 마지막 탭 '신청' 에서 이 API 로 입찰서를 확정한 뒤 전자서명(M21)으로 이동한다.
   * TODO(백엔드 확정): 스탭별 부분 저장 API 는 목록에 없다 — 부분 저장이 필요하면 별도 메서드 확인 필요.
   */
  async insertTndrSbmsn(payload: TndrSavePayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/tndrSbmsn/insertTndrSbmsn.do', payload)
  },

  /**
   * 입찰서 첨부 업로드 — 서버 발급 UploadedFile 반환. MUI-BD-06-M05 (tndrWrt/TndrWrt_Stp5).
   * 실목록 외(파일 업로드는 file 도메인 소관 — RaonK 연동) — URL 임시.
   */
  async uploadTndrFile(pbancNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/tndrs/files',
      uploadForm(file, { pbancNo }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 입찰서 첨부 삭제 — MUI-BD-06-M05 (tndrWrt/TndrWrt_Stp5). 실목록 외 — URL 임시. */
  async removeTndrFile(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/tndrs/files/${id}`)
  },

  // ── 서약서 (MUI-BD-04-M01) ─────────────────────────────────────────────────

  /** 서약서 조회 — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage). 실목록 외 — URL 임시. */
  async selectWrot(wrotId: string): Promise<WrotDoc> {
    if (USE_MOCK) return mockDelay(MOCK_BD.wrot)
    return apiClient.post<WrotDoc, WrotDoc>(`/v1/bds/wrots/${wrotId}`)
  },

  /**
   * 서약서 동의 선택(라디오 변경 즉시)
   * — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage · WrotAgreForm). 실목록 외 — URL 임시.
   */
  async setWrotChoice(wrotId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/wrots/${wrotId}/choice`, { choice })
  },

  /** 서약서 저장 — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage). 실목록 외 — URL 임시. */
  async saveWrot(wrotId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/wrots/${wrotId}`, {})
  },

  // ── 공통 검색 (도메인=bd) ──────────────────────────────────────────────────

  /**
   * 면허정보 검색(면허명/코드 부분일치) — MUI-BD-01-P05 (cm/search/LcnsInfoSrch).
   * 실목록 외(공통 검색시트는 cm 도메인 소관 가능성) — URL 임시.
   */
  async searchLicenses(keyword: string): Promise<LicenseResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.licenses)
    return apiClient.post<LicenseResult[], LicenseResult[]>('/v1/bds/licenses', { keyword })
  },

  /** 지역 검색(시도/시군구 부분일치) — MUI-BD-01-P03 (cm/search/RgnSrch). 실목록 외 — URL 임시. */
  async searchRegions(keyword: string): Promise<RegionResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regions)
    return apiClient.post<RegionResult[], RegionResult[]>('/v1/bds/regions', { keyword })
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 국외(Overseas)
  // ══════════════════════════════════════════════════════════════════════════

  // ── 국외 입찰공고 상세 (MUI-BD-01-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ─────────────────────────────────

  /**
   * no.45 입찰공고상세조회(OvsBidPbancController) — MUI-BD-01-M71
   * (ovsBidPbancDtl/OvsBidPbancDtlPage). 구 `selectOvsBidPbancDetail`.
   * 백엔드 메서드명은 `selectBidPbancDtl` 이나 국내 동명 함수와 충돌하므로 Ovs 접두.
   * 요청 body = PC 실 인터페이스(ovsBidPbancDtl.ISearch, 2026-08-24 판독본) — 구 잠정 body({ pbancNo }) 해소.
   * (같은 파일 ISearchParam 판독본은 IResultPbanc+ISearch 가 이어진 형태로 스크롤 경계 누락 가능 — 원본 대조 필요.)
   */
  async selectOvsBidPbancDtl(params: {
    /** 공고번호 */ pbancNo: string
    /** 공고차수 */ pbancOd: string
    /** 조달번호 */ prcmNo?: string
    /** 공고구분 */ pbancTypeCd?: string
    /** 개찰일자 */ bidYmd?: string
  }): Promise<OvsBidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPbancDetail)
    return apiClient.post<OvsBidPbancDetail, OvsBidPbancDetail>(
      '/bds/bd/ovsBidPbanc/selectBidPbancDtl.do',
      params,
    )
  },

  /**
   * no.46 입찰품목목록조회 — MUI-BD-01-T72(구 M72 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl).
   * 구 `selectOvsBidItemList`. 응답 = PC 실 인터페이스(ovsBidPbancDtl.IResultItem, 2026-08-24 판독본).
   * body 는 판독본 ISearch(공고번호+차수 등) 공유 여부 미확정 — 잠정 { pbancNo } 유지(원본 대조 필요).
   */
  async selectBidItemList(id: string): Promise<OvsBidItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidItemList)
    return apiClient.post<OvsBidItem[], OvsBidItem[]>('/bds/bd/ovsBidPbanc/selectBidItemList.do', {
      pbancNo: id,
    })
  },

  /**
   * no.48 첨부서류목록조회 — MUI-BD-01-T73(구 M73 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl2).
   * 구 `selectOvsBidAtchDocList`. 응답 = PC 실 인터페이스(ovsBidPbancDtl.IResultAttach, 2026-08-24 판독본).
   */
  async selectAtchDocList(id: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.post<OvsAtchDoc[], OvsAtchDoc[]>('/bds/bd/ovsBidPbanc/selectAtchDocList.do', {
      pbancNo: id,
    })
  },

  /**
   * 국외 품목 첨부문서 목록 조회
   * — MUI-BD-01-P76 (ovsBidPbancDtl/OvsBidPbancDtl · OvsBidPbanc_AtchFileInq).
   * TODO(백엔드 확정): no.48 과 같은 URL — 공고 첨부(T73)와 품목 첨부(P76)가 같은 API 인지 미확정이라
   *   식별자(품목 항목번호)가 다른 만큼 함수만 분리해 둔다.
   */
  async selectOvsItemAtchFileList(frcptlArtclNo: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.post<OvsAtchDoc[], OvsAtchDoc[]>('/bds/bd/ovsBidPbanc/selectAtchDocList.do', {
      frcptlArtclNo,
    })
  },

  /** 국외 품목 첨부파일 다운로드 — MUI-BD-01-P76. 실목록 외(file 도메인) — URL 임시. 식별자는 IResultAttach.fileId. */
  async downloadOvsItemAtchFile(fileId: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-item-atch-${fileId}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/item-atch-files/${fileId}/download`, null, {
      responseType: 'blob',
    })
  },

  /** 국외 공고 첨부서류 다운로드 — MUI-BD-01-T73. 실목록 외(file 도메인) — URL 임시. 식별자는 IResultAttach.fileId. */
  async downloadOvsBidAtchDoc(fileId: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-atch-doc-${fileId}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/atch-docs/${fileId}/download`, null, {
      responseType: 'blob',
    })
  },

  /**
   * no.49 보관함추가 — MUI-BD-01-T72 (ovsBidPbancDtl/OvsBidPbancDtl) ·
   * MUI-CM-01-M73 (ovsLockerItemReg/OvsLockerItemRegPage). 구 `addOvsLockerItem`/`addLockerItem`(2개 → 1개로 통합).
   */
  async insertItemToLocker(frcptlArtclNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsBidPbanc/insertItemToLocker.do', {
      frcptlArtclNo,
    })
  },

  /**
   * no.50 보관함삭제 — MUI-BD-01-T72 · MUI-CM-01-M73.
   * 구 `deleteOvsLockerItem`/`deleteLockerItem`(2개 → 1개로 통합).
   */
  async deleteItemFromLocker(frcptlArtclNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsBidPbanc/deleteItemFromLocker.do', {
      frcptlArtclNo,
    })
  },

  /**
   * no.51 관심공고등록(OvsBidPbancController) — MUI-BD-01-M71 (ovsBidPbancDtl/OvsBidPbancDtlPage).
   * 구 `toggleFavorite`(국외분). 국내 no.30 과 메서드명이 같아 Ovs 접두. 제외(삭제) 미확정은 국내와 동일.
   */
  async insertOvsItrstPbanc(id: string, favorite: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsBidPbanc/insertItrstPbanc.do', {
      pbancNo: id,
      itrstYn: favorite ? 'Y' : 'N',
    })
  },

  // ── 국외 입찰참가신청서 (MUI-BD-04) ────────────────────────────────────────

  /**
   * no.105 사업별입찰등록결과조회 — MUI-BD-04-P83 (ovsBidPrtcpApfrDtl/OvsBidRegRsltByBiz).
   * 구 `selectOvsBidRegRsltByBiz`.
   */
  async selectBidRegRsltListByBiz(pbancNo: string): Promise<OvsBidRegRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRegRsltList)
    return apiClient.post<OvsBidRegRsltItem[], OvsBidRegRsltItem[]>(
      '/bds/bd/ovsBidPrtcpAply/selectBidRegRsltListByBiz.do',
      { pbancNo },
    )
  },

  /**
   * no.100 입찰등록결과조회(OvsBidPrtcpAplyController) — MUI-BD-04-T79 (ovsBidPrtcpApfrDtl/Tab4) 계열.
   * 화면 미배선(현재 인라인 목업) — 소비처 생기면 훅 추가.
   */
  async selectBidRegRslt(pbancNo: string): Promise<OvsBidRegRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRegRsltList)
    return apiClient.post<OvsBidRegRsltItem[], OvsBidRegRsltItem[]>(
      '/bds/bd/ovsBidPrtcpAply/selectBidRegRslt.do',
      { pbancNo },
    )
  },

  /**
   * no.104 입찰참가취소신청 — MUI-BD-04-P82 (ovsBidPrtcpApfrDtl/OvsBidPrtcpRtrcnAply).
   * 구 `submitOvsBidPrtcpRtrcn`. ⚠️ 백엔드 메서드명 `inserBidPrtcpRtrcnAply`(오타)를 그대로 둔다 — 추적 1:1.
   */
  async inserBidPrtcpRtrcnAply(payload: {
    pbancNo: string
    pbancOd: string
    targets: string[]
    rsn: string
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(
      '/bds/bd/ovsBidPrtcpAply/inserBidPrtcpRtrcnAply.do',
      payload,
    )
  },

  /**
   * no.95 입찰참가사업목록조회 — MUI-BD-04-T74 (ovsBidPrtcpAply/Stp3) 입찰보증금 사업목록.
   * 구 `selectOvsBidGrnteBizList`.
   */
  async selectBidPrtcpBizList(
    pbancNo: string,
    depositType: string,
  ): Promise<OvsBidPrtcpBizItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPrtcpBizList)
    return apiClient.post<OvsBidPrtcpBizItem[], OvsBidPrtcpBizItem[]>(
      '/bds/bd/ovsBidPrtcpAply/selectBidPrtcpBizList.do',
      { pbancNo, grnteExmptnSe: depositType },
    )
  },

  /**
   * 국외 입찰보증금 목록(면제구분별) 조회. N=비면제 / Y=면제
   * — MUI-BD-04-T78(구 M80 — v1.83 재편) (ovsBidPrtcpApfrDtl/Tab3).
   * TODO(백엔드 확정): no.95 와 같은 URL — 신청 화면(T74)과 상세 화면(T78)의 응답 구성이 달라(면제/비면제
   *   목록 분리) 함수만 분리. 상세 전용 메서드가 확인되면 URL 만 교체.
   */
  async selectOvsBidGrnteList(
    grnteExmptnSe: 'N' | 'Y',
  ): Promise<OvsBidBizItem[] | OvsBidBizExmptnItem[]> {
    if (USE_MOCK) {
      return mockDelay(grnteExmptnSe === 'Y' ? MOCK_BD.ovsBidBizExmptnList : MOCK_BD.ovsBidBizList)
    }
    return apiClient.post<
      OvsBidBizItem[] | OvsBidBizExmptnItem[],
      OvsBidBizItem[] | OvsBidBizExmptnItem[]
    >('/bds/bd/ovsBidPrtcpAply/selectBidPrtcpBizList.do', { grnteExmptnSe })
  },

  /**
   * no.103 입찰참가신청조회 — MUI-BD-04-M78 (ovsBidPrtcpApfrDtl/OvsBidPrtcpApfrDtlPage).
   * 화면 미배선(현재 navigate state + 인라인 목업) — 소비처 생기면 훅 추가.
   */
  async selectBidPrtcpApfr(pbancNo: string, pbancOd: string): Promise<OvsBidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPbancDetail)
    return apiClient.post<OvsBidPbancDetail, OvsBidPbancDetail>(
      '/bds/bd/ovsBidPrtcpAply/selectBidPrtcpApfr.do',
      { pbancNo, pbancOd },
    )
  },

  /**
   * 국외 보증서류 다운로드(연대보증서/지급각서/납부서)
   * — MUI-BD-04-T78 (ovsBidPrtcpApfrDtl/Tab3). 실목록 외(file 도메인) — URL 임시.
   */
  async downloadGrnteDoc(docNo: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-grnte-doc-${docNo}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/guarantee-docs/${docNo}/download`, null, {
      responseType: 'blob',
    })
  },

  /**
   * 국외 첨부파일 다운로드(등록결과 첨부)
   * — MUI-BD-04-T79 (ovsBidPrtcpApfrDtl/Tab4). 실목록 외(file 도메인) — URL 임시.
   */
  async downloadAtchFile(atchFileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(atchFileNm)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/atch-files/${atchFileNm}/download`, null, {
      responseType: 'blob',
    })
  },

  /**
   * no.101 첨부문서저장 — MUI-BD-04-T75(구 M77 — v1.83 재편) (ovsBidPrtcpAply/AtchDocReg).
   * 구 `uploadOvsBidPrtcpAtchDoc`. 서버 발급 UploadedFile 반환.
   */
  async saveAtchDoc(pbancNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/bds/bd/ovsBidPrtcpAply/saveAtchDoc.do',
      uploadForm(file, { pbancNo }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰참가 첨부서류 삭제 — MUI-BD-04-T75. 실목록 외(삭제 API 없음) — URL 임시. */
  async removeOvsBidPrtcpAtchDoc(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/bid-prtcp/atch-docs/${id}`)
  },

  /**
   * 국외 서약서(청렴서약) 조회
   * — MUI-BD-04-P03 (ovsBidPrtcpAply/OvsBidPrtcpAplyPage · OvsProbWrotAgre). 실목록 외 — URL 임시.
   */
  async selectOvsProbWrotAgre(wrotId: string): Promise<OvsProbWrotAgreResultInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsProbWrotAgre)
    return apiClient.post<OvsProbWrotAgreResultInfo, OvsProbWrotAgreResultInfo>(
      `/v1/bds/ovs/prob-wrots/${wrotId}`,
    )
  },

  /** 국외 서약서 저장(동의) — MUI-BD-04-P03. 실목록 외 — URL 임시. */
  async saveOvsProbWrotAgre(wrotId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/prob-wrots/${wrotId}`, {})
  },

  /** 국외 서약서 동의 선택(라디오 변경 즉시) — MUI-BD-04-P03. 실목록 외 — URL 임시. */
  async setOvsWrotChoice(wrotId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/prob-wrots/${wrotId}/choice`, { choice })
  },

  /**
   * no.97 입찰참가신청(OvsBidPrtcpAplyController) — MUI-BD-04-T75
   * (ovsBidPrtcpAply/OvsBidPrtcpAplyPage). 구 `registerOvsBidPrtcpAply`.
   * 국내 no.81 과 메서드명이 같아 Ovs 접두. 성공 시 접수번호/일시 반환.
   */
  async insertOvsBidPrtcpAply(pbancNo: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>(
      '/bds/bd/ovsBidPrtcpAply/insertBidPrtcpAply.do',
      { pbancNo },
    )
  },

  /**
   * no.102 입찰보증서정보조회(OvsBidPrtcpAplyController) — MUI-BD-04-P76
   * (ovsBidPrtcpAply/OvsBidWtgrDtlFullPopup). 구 `selectOvsBidWtgrDtl`.
   * 국내 no.88 과 메서드명이 같아 Ovs 접두.
   */
  async selectOvsBidWtgrInfo(wtgrNo: string): Promise<OvsBidWtgrInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidWtgrInfo)
    return apiClient.post<OvsBidWtgrInfo, OvsBidWtgrInfo>(
      '/bds/bd/ovsBidPrtcpAply/selectBidWtgrInfo.do',
      { wtgrNo },
    )
  },

  /**
   * no.99 입찰보증서목록조회 — MUI-BD-04-P75 (ovsBidPrtcpAply/OvsBidWtgrInqFullPopup).
   * 구 `selectOvsBidWtgrList`.
   */
  async selectBidWtgrList(): Promise<OvsBidWtgrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidWtgrList)
    return apiClient.post<OvsBidWtgrItem[], OvsBidWtgrItem[]>(
      '/bds/bd/ovsBidPrtcpAply/selectBidWtgrList.do',
    )
  },

  /**
   * no.96 업체정보조회 — MUI-BD-04-T73(구 M73 — v1.83 재편) (ovsBidPrtcpAply/Stp2).
   * 구 `selectOvsSplyInfo`. 업체코드(splyBzentyCd) 기준.
   */
  async selectBzentyDtl(splyBzentyCd: string): Promise<OvsSplyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsSplyInfo)
    return apiClient.post<OvsSplyInfo, OvsSplyInfo>(
      '/bds/bd/ovsBidPrtcpAply/selectBzentyDtl.do',
      { splyBzentyCd },
    )
  },

  /**
   * 국외 연대보증서 업로드 — MUI-BD-04-T74 (ovsBidPrtcpAply/Stp3).
   * TODO(실API 미매핑): 보증서류 업로드 4종의 대응 API 가 명시돼 있지 않다 — 후보 no.101 첨부문서저장
   *   (`saveAtchDoc`, 서류 구분값 전달). 확신이 없어 잇지 않고 임시 URL 유지.
   */
  async uploadOvsGurnAgreDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'gurnAgre' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 지급각서 업로드 — MUI-BD-04-T74. 실목록 외(uploadOvsGurnAgreDoc 와 동일 사유). */
  async uploadOvsGiveWrtprmDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'giveWrtprm' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 보증보험 보증서 업로드 — MUI-BD-04-T74. 실목록 외(uploadOvsGurnAgreDoc 와 동일 사유). */
  async uploadOvsBidWtgrDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'bidWtgr' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰보증금납부서 업로드 — MUI-BD-04-T74. 실목록 외(uploadOvsGurnAgreDoc 와 동일 사유). */
  async uploadOvsGrntePyslDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/guarantee-docs',
      uploadForm(file, { prchsDmndNo, docType: 'grntePysl' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /**
   * 국외 입찰보증서 적용(사업에 증권 연결) — MUI-BD-04-T74 (ovsBidPrtcpAply/Stp3).
   * TODO(실API 미매핑): 대응 항목 없음(신청 제출 no.97 body 에 포함될 가능성). URL 임시.
   */
  async applyOvsBidWtgr(pbancNo: string, prchsDmndNo: string, wtgrNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/v1/bds/ovs/wtgrs/applies', { pbancNo, prchsDmndNo, wtgrNo })
  },

  // ── 국외 입찰결과 (MUI-BD-09-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ──────────────────────────────────────

  /**
   * no.168 입찰공고상세조회(OvsBidRsltController) — MUI-BD-09-T71
   * (ovsBidRsltDtl/OvsBidRsltDtlPage 일반정보 탭).
   * 같은 메서드명이 여러 Ovs 컨트롤러에 있어 컨트롤러명을 접두. 화면 미배선 — 소비처 생기면 훅 추가.
   */
  async selectOvsBidRsltBidPbancDtl(pbancNo: string, pbancOd: string): Promise<OvsBidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPbancDetail)
    return apiClient.post<OvsBidPbancDetail, OvsBidPbancDetail>(
      '/bds/bd/ovsBidRslt/selectBidPbancDtl.do',
      { pbancNo, pbancOd },
    )
  },

  /**
   * no.169 항목별입찰내역목록 — MUI-BD-09-T72/T73(구 M72/M73 — v1.83 재편)
   * (ovsBidRsltDtl/OvsBidRsltDtl2 · OvsBidRsltDtl3). 구 `selectOvsBidRslt`.
   * 단가제/총액제는 응답 형태로 분기(설계서 slide404/405).
   */
  async selectBidCnListByItem(
    page: number,
  ): Promise<OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRsltUnitPriceItems)
    return apiClient.post<
      OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[],
      OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[]
    >('/bds/bd/ovsBidRslt/selectBidCnListByItem.do', { page })
  },

  /**
   * no.171 항목별나의입찰내역목록 — MUI-BD-09-T72 '나의 입찰내역' 구분.
   * 화면 미배선(현재 결과필터만 클라이언트 처리) — 소비처 생기면 훅 추가.
   */
  async selectMyBidCnList(page: number): Promise<OvsBidRsltUnitPriceItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRsltUnitPriceItems)
    return apiClient.post<OvsBidRsltUnitPriceItem[], OvsBidRsltUnitPriceItem[]>(
      '/bds/bd/ovsBidRslt/selectMyBidCnList.do',
      { page },
    )
  },

  /**
   * no.173 동가낙찰결과조회(OvsBidRsltController) — 국외 동가낙찰결과.
   * 화면 미배선(국내 P03 SmprcScsbdRsltFullPopup 의 국외판 화면 없음) — 소비처 생기면 훅 추가.
   * TODO(원본 대조): PC 실 응답(ovsSmprcScsbdRsltPopup.IDataList1, 2026-08-24 판독본)은
   * { bzentyCd, bzentyNm, smprcScsbdChcNm1~5 } — 국내 공용 SmprcScsbdRsltItem 과 다름.
   * 국외판 화면이 생기면 전용 타입으로 교체.
   */
  async selectSmprcScsbdRsltList(pbancNo: string): Promise<SmprcScsbdRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.smprcScsbdRsltInfo.smprcScsbdRslt)
    return apiClient.post<SmprcScsbdRsltItem[], SmprcScsbdRsltItem[]>(
      '/bds/bd/ovsBidRslt/selectSmprcScsbdRsltList.do',
      { pbancNo },
    )
  },

  // ── 국외 환율/목표가/보관함 (MUI-BD-01 · MUI-CM-01) ─────────────────────────

  /**
   * no.54 환율정보조회(기준일자) — MUI-BD-01-M74 (ovsExchrtList/OvsExchrtListFullPopup). 구 `selectExchangeRates`.
   * 요청 { crtrYmd }·응답 IResult 는 PC 실 인터페이스(ovsExchrtListPopup, 2026-08-24 판독본)와 정합 확인.
   */
  async selectExchrtList(crtrYmd: string): Promise<OvsExchrtItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.exchrtList)
    return apiClient.post<OvsExchrtItem[], OvsExchrtItem[]>(
      '/bds/bd/ovsBidPbanc/selectExchrtList.do',
      { crtrYmd },
    )
  },

  /**
   * no.56 목표가공개품목조회 — MUI-BD-01-M75 (ovsGoalPrcRlsItemList/OvsGoalPrcRlsItemListPage).
   * 구 `selectOvsGoalPrcRlsItemList`. 목업은 전체 반환(페이지 더보기).
   * 요청 body = PC 실 인터페이스(ovsGoalPrcRlsItemListPopup.ISearch, 2026-08-24 판독본).
   */
  async selectGoalPrcRlsItemList(params: {
    /** 공고번호 */ pbancNo: string
    /** 조달번호 */ prcmNo: string
  }): Promise<OvsGoalPrcRlsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsGoalPrcRlsList)
    return apiClient.post<OvsGoalPrcRlsItem[], OvsGoalPrcRlsItem[]>(
      '/bds/bd/ovsBidPbanc/selectGoalPrcRlsItemList.do',
      params,
    )
  },

  /**
   * no.57 보관함공고목록조회 — MUI-CM-01-M71 (ovsLockerPbanList/OvsLockerPbanListPage).
   * 구 `selectOvsLockerPbanList`. 목업은 전체 반환(페이지 클라이언트 필터/페이징).
   * 응답은 PC 실 인터페이스(ovsLockerPbanList.IDataList1, 2026-08-24 판독본) 반영 —
   * 요청(ISearch)은 판독본에 미포함이라 잠정 유지(원본 대조 필요).
   */
  async selectLockerPbancList(params?: BidListSearchRequest): Promise<OvsLockerPbanItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerPbanList)
    return apiClient.post<OvsLockerPbanItem[], OvsLockerPbanItem[]>(
      '/bds/bd/ovsBidPbanc/selectLockerPbancList.do',
      params,
    )
  },

  /**
   * 국외 보관함 공고 상세(담당자 영역) 조회
   * — MUI-CM-01-M72 (ovsLockerPbanDtl/OvsLockerPbanDtlPage).
   * TODO(실API 미매핑): 보관함 공고 '상세' API 가 없다 — 후보 no.57 목록 응답 1건 사용. URL 임시.
   */
  async selectOvsLockerPbanDtl(id: string): Promise<OvsLockerPbanItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerPbanList[0])
    return apiClient.post<OvsLockerPbanItem, OvsLockerPbanItem>(`/v1/bds/ovs/locker/pbancs/${id}`)
  },

  /**
   * 국외 보관함 입찰품목 목록 조회 — MUI-CM-01-M73 (ovsLockerItemReg/OvsLockerItemRegPage).
   * TODO(실API 미매핑): 보관함 '품목' 목록 API 가 없다 — 후보 no.46 입찰품목목록조회. URL 임시.
   *   (입찰내역 작성 화면의 목록은 no.60 `selectTmprBidCnList` 로 별도.)
   */
  async selectOvsLockerBidItemList(
    pbancNo: string,
    params?: BidListSearchRequest,
  ): Promise<OvsLockerBidItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerBidItemList)
    return apiClient.post<OvsLockerBidItem[], OvsLockerBidItem[]>(
      `/v1/bds/ovs/locker/${pbancNo}/bid-items`,
      params,
    )
  },

  // ── 국외 공개수의협상 (MUI-BD-12) ──────────────────────────────────────────

  /**
   * no.204 공개수의협상상세조회 — MUI-BD-12-T72(구 M72 — v1.83 재편)
   * (ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl2) 품목정보. 구 `selectOvsRlsVltrnsItems`.
   * TODO(백엔드 확정): 상세조회 하나가 일반정보/품목/첨부서류를 모두 싣는지 미확정 — 탭별로 함수를 나눠 둔다.
   */
  async selectRlsVltrnsNgtnDtl(pbancNo: string): Promise<OvsRlsVltrnsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsItems)
    return apiClient.post<OvsRlsVltrnsItem[], OvsRlsVltrnsItem[]>(
      '/bds/bd/ovsRlsVltrnsNgtn/selectRlsVltrnsNgtnDtl.do',
      { pbancNo },
    )
  },

  /**
   * 국외 공개수의협상 첨부서류 조회
   * — MUI-BD-12-T73(구 M73 — v1.83 재편) (ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl3).
   * TODO(백엔드 확정): no.204 와 같은 URL — T72 와 동일 사유(탭별 응답 분리 여부 미확정).
   */
  async selectOvsRlsVltrnsAtchDocs(pbancNo: string): Promise<OvsRlsVltrnsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsAtchDocs)
    return apiClient.post<OvsRlsVltrnsAtchDoc[], OvsRlsVltrnsAtchDoc[]>(
      '/bds/bd/ovsRlsVltrnsNgtn/selectRlsVltrnsNgtnDtl.do',
      { pbancNo },
    )
  },

  /**
   * no.212 견적서제출조회 — MUI-BD-12-T76(구 M76 — v1.83 재편)
   * (ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn3) 입찰품목. 구 `selectOvsRlsVltrnsEtdcItems`.
   * TODO(백엔드 확정): 실 응답이 견적서 전체(일반정보+업체+품목+첨부)인지 미확정 — 현재는 품목만 소비.
   */
  async selectEtdcSbmsn(pbancNo: string): Promise<OvsRlsVltrnsEtdcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsEtdcItems)
    return apiClient.post<OvsRlsVltrnsEtdcItem[], OvsRlsVltrnsEtdcItem[]>(
      '/bds/bd/ovsRlsVltrnsNgtn/selectEtdcSbmsn.do',
      { pbancNo },
    )
  },

  /**
   * no.213 견적서제출 — MUI-BD-12-M74
   * (ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsnPage). 구 `submitOvsRlsVltrnsEtdc`.
   */
  async insertEtdcSbmsn(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsRlsVltrnsNgtn/insertEtdcSbmsn.do', {
      intgRfrncNo: id,
    })
  },

  /**
   * no.215 견적서취소신청서제출 — MUI-BD-12-P82
   * (ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt). 구 `submitOvsRlsVltrnsEtdcRtrcn`.
   */
  async cancelEtdcRtrcnApfrSbmsn(payload: { rsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(
      '/bds/bd/ovsRlsVltrnsNgtn/cancelEtdcRtrcnApfrSbmsn.do',
      payload,
    )
  },

  /**
   * 국외 공개수의협상 첨부파일 다운로드
   * — MUI-BD-12-T81(구 M81 — v1.83 재편) (ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtl4).
   * 실목록 외(file 도메인) — URL 임시.
   */
  async downloadEtdcFile(id: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-etdc-${id}`)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/rls-vltrns/etdc-files/${id}/download`, null, {
      responseType: 'blob',
    })
  },

  /**
   * 국외 공개수의협상 심사결과 조회
   * — MUI-BD-12-T83(구 M83 — v1.83 재편) (ovsRlsVltrnsNgtnSrngRsltInq/OvsRlsVltrnsNgtnSrngRsltInq2).
   * TODO(실API 미매핑): 심사결과 조회가 목록에 없다 — 후보 no.206 공개수의협상재입찰조회. URL 임시.
   */
  async selectOvsRlsVltrnsSrngRslt(): Promise<OvsRlsVltrnsSrngRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsSrngRslt)
    return apiClient.post<OvsRlsVltrnsSrngRsltItem[], OvsRlsVltrnsSrngRsltItem[]>(
      '/v1/bds/ovs/rls-vltrns/srng-results',
    )
  },

  // ── 국외 임시입찰내역/이전공고 (MUI-BD-01-M76 · T75·T76 · P79(구 M76~M79 — v1.83 재편)) ─────────────────────────

  /**
   * no.60 임시입찰내용조회(OvsBidPbancController) — MUI-BD-01-T75/T76
   * (ovsTmprBidCnReg/BidDsctn · BidDsctn2) 입찰내역 목록.
   * 단가제=행 배열 · 총액제=단건(설계서 slide312~319).
   */
  async selectTmprBidCnList(intgRfrncNo: string): Promise<ItitbBidCnItem[] | AlonbsBidCnInfo> {
    // 목업은 빈 목록 — BidDsctn/BidDsctn2 는 아직 인라인 목업을 쓴다(배선 시 mocks/bd.ts 로 이관).
    if (USE_MOCK) return mockDelay<ItitbBidCnItem[]>([])
    return apiClient.post<
      ItitbBidCnItem[] | AlonbsBidCnInfo,
      ItitbBidCnItem[] | AlonbsBidCnInfo
    >('/bds/bd/ovsBidPbanc/selectTmprBidCnList.do', { intgRfrncNo })
  },

  /**
   * no.63 임시입찰내용저장(단가제=행 배열 · 총액제=단건)
   * — MUI-BD-01-T75/T76 (ovsTmprBidCnReg/BidDsctn · BidDsctn2). 구 `saveOvsTmprBidCn`.
   */
  async saveTmprBidCn(
    intgRfrncNo: string,
    payload: ItitbBidCnItem[] | AlonbsBidCnInfo,
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsBidPbanc/saveTmprBidCn.do', {
      intgRfrncNo,
      bidCn: payload,
    })
  },

  /**
   * no.62 임시입찰내용삭제(단가제=선택 항목번호 · 총액제=전체)
   * — MUI-BD-01-T75/T76. 구 `deleteOvsTmprBidCn`.
   */
  async deleteTmprBidCn(intgRfrncNo: string, checkedNos?: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsBidPbanc/deleteTmprBidCn.do', {
      intgRfrncNo,
      checkedNos,
    })
  },

  /**
   * no.64 보관함이전공고목록조회 — MUI-BD-01-P79(구 M79 — v1.83 재편)
   * (ovsBfrTmprBidBidCnReg/OvsBfrTmprBidBidCnRegFullPopup). 구 `selectBfrPbancLockerList`.
   */
  async selectLockerBfrPbancList(lockerId: string): Promise<BfrPbancInfoItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancLockerList)
    return apiClient.post<BfrPbancInfoItem[], BfrPbancInfoItem[]>(
      '/bds/bd/ovsBidPbanc/selectLockerBfrPbancList.do',
      { lockerId },
    )
  },

  /**
   * no.65 이전공고입찰내역목록조회 — MUI-BD-01-P80
   * (ovsBfrTmprBidBidCnReg/BfrPbancBidDsctnItemDtlFullPopup). 구 `selectBfrPbancBidCnList`.
   */
  async selectBfrTmprBidCnList(pbancNo: string, pbancOd: string): Promise<BfrPbancBidCnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancBidCnList)
    return apiClient.post<BfrPbancBidCnItem[], BfrPbancBidCnItem[]>(
      '/bds/bd/ovsBidPbanc/selectBfrTmprBidCnList.do',
      { pbancNo, pbancOd },
    )
  },

  /** no.66 이전공고입찰내역불러오기(선택 항목 적재) — MUI-BD-01-P80. 구 `loadBfrPbancBidCn`. */
  async saveBfrTmprBidCn(
    pbancNo: string,
    pbancOd: string,
    items: BfrPbancBidCnItem[],
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsBidPbanc/saveBfrTmprBidCn.do', {
      pbancNo,
      pbancOd,
      items,
    })
  },

  /**
   * 국외 이전공고 입찰내역 불러오기(통합참조번호) — MUI-BD-01-M76 (ovsTmprBidCnReg/OvsTmprBidCnRegPage).
   * TODO(실API 미매핑): 통합참조번호 단독 조회가 목록에 없다 — 후보 no.60 임시입찰내용조회 ·
   *   no.65 이전공고입찰내역목록조회(공고번호+차수 필요). URL 임시.
   */
  async selectOvsBfrPbancBidCnList(intgRfrncNo: string): Promise<BfrPbancBidCnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancBidCnList)
    return apiClient.post<BfrPbancBidCnItem[], BfrPbancBidCnItem[]>(
      `/v1/bds/ovs/tmpr-bid-cn/${intgRfrncNo}/prev-bid-cn`,
    )
  },

  /**
   * no.59 화폐단위조회(달러환산율 포함) — MUI-BD-01-T75 (ovsTmprBidCnReg/BidDsctn).
   * 구 `selectCrncList`.
   */
  async selectCrncUnitList(): Promise<CrncOption[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.crncOptions)
    return apiClient.post<CrncOption[], CrncOption[]>('/bds/bd/ovsBidPbanc/selectCrncUnitList.do')
  },

  /**
   * 국외 입찰업체 목록 조회(셀렉트 옵션) — MUI-BD-01-T75 (ovsTmprBidCnReg/BidDsctn).
   * TODO(실API 미매핑): 셀렉트 옵션용 업체 목록이 없다 — 후보 no.96 업체정보조회(단건). URL 임시.
   */
  async selectOvsBidBzentyList(): Promise<BidSelectOption[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidBzentyOptions)
    return apiClient.post<BidSelectOption[], BidSelectOption[]>('/v1/bds/ovs/bid-bzentys')
  },

  /**
   * 국외 임시입찰내역 문서 업로드(품목대체/MOQ) — MUI-BD-01-T75 (ovsTmprBidCnReg/BidDsctn).
   * 실목록 외(file 도메인) — URL 임시.
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

  // ── 국외 입찰서 상세/제출 (MUI-BD-06) ──────────────────────────────────────

  /** no.137 투찰취소신청 — MUI-BD-06-P81 (ovsTndrDtl/OvsBidRtrcnAply). 구 `submitOvsBidRtrcn`. */
  async insertAplyBdngRtrcn(payload: { rsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>('/bds/bd/ovsTndrSbmsn/insertAplyBdngRtrcn.do', payload)
  },

  /** no.134 입찰서조회 — MUI-BD-06-M75 (ovsTndrDtl/OvsTndrDtlPage). 구 `selectOvsTndrDtl`. */
  async selectTndr(id: string): Promise<OvsTndrDtlItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrDetail)
    return apiClient.post<OvsTndrDtlItem, OvsTndrDtlItem>('/bds/bd/ovsTndrSbmsn/selectTndr.do', {
      intgRfrncNo: id,
    })
  },

  /**
   * no.135 입찰서품목조회 — MUI-BD-06-T72/T77(구 M72/M77 — v1.83 재편)
   * (ovsTndrDtl/Tab3 · ovsTndrSbmsn/Stp2).
   * 백엔드 메서드명은 `selectTndrItemList` 이나 국내 동명 함수와 충돌하므로 Ovs 접두.
   */
  async selectOvsTndrItemList(
    page: number,
    pbancNo?: string,
    pbancOd?: string,
  ): Promise<OvsTndrItitbItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrItitbItems)
    return apiClient.post<OvsTndrItitbItem[], OvsTndrItitbItem[]>(
      '/bds/bd/ovsTndrSbmsn/selectTndrItemList.do',
      { page, pbancNo, pbancOd },
    )
  },

  /**
   * no.124 입찰공고상세조회(OvsTndrSbmsnController) — MUI-BD-06-T71
   * (ovsTndrSbmsn/OvsTndrSbmsnPage 일반정보 스탭).
   * 같은 메서드명이 여러 Ovs 컨트롤러에 있어 컨트롤러명을 접두. 화면 미배선 — 소비처 생기면 훅 추가.
   */
  async selectOvsTndrSbmsnBidPbancDtl(
    pbancNo: string,
    pbancOd: string,
  ): Promise<OvsBidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPbancDetail)
    return apiClient.post<OvsBidPbancDetail, OvsBidPbancDetail>(
      '/bds/bd/ovsTndrSbmsn/selectBidPbancDtl.do',
      { pbancNo, pbancOd },
    )
  },

  /**
   * no.125 임시입찰내용조회(OvsTndrSbmsnController) — MUI-BD-06-T72/T73 (ovsTndrSbmsn/Stp2)
   * 입찰참여품목의 임시 저장분. no.60(OvsBidPbancController)과 메서드명이 같아 컨트롤러명을 접두.
   * 화면 미배선 — 소비처 생기면 훅 추가.
   */
  async selectOvsTndrSbmsnTmprBidCnList(
    pbancNo: string,
    pbancOd: string,
  ): Promise<OvsTndrItitbItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrItitbItems)
    return apiClient.post<OvsTndrItitbItem[], OvsTndrItitbItem[]>(
      '/bds/bd/ovsTndrSbmsn/selectTmprBidCnList.do',
      { pbancNo, pbancOd },
    )
  },

  /**
   * no.126 입찰서제출(투찰, OvsTndrSbmsnController) — MUI-BD-06-T74(구 M74 — v1.83 재편)
   * (ovsTndrSbmsn/OvsTndrSbmsnPage). 구 `submitOvsTndr`.
   * 국내 no.118 과 메서드명이 같아 Ovs 접두. 성공 시 접수번호/일시 반환.
   */
  async insertOvsTndrSbmsn(pbancNo: string, pbancOd: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>(
      '/bds/bd/ovsTndrSbmsn/insertTndrSbmsn.do',
      { pbancNo, pbancOd },
    )
  },

  /**
   * 국외 입찰서 첨부문서 목록 조회 — MUI-BD-06-T79(구 M79 — v1.83 재편) (ovsTndrDtl/Tab4).
   * TODO(실API 미매핑): 입찰서 첨부문서 목록 API 가 없다 — 후보 no.48 첨부서류목록조회. URL 임시.
   */
  async selectOvsTndrDocList(): Promise<OvsTndrDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrDocList)
    return apiClient.post<OvsTndrDoc[], OvsTndrDoc[]>('/v1/bds/ovs/tndrs/docs')
  },

  /** 국외 입찰서 첨부문서 다운로드 — MUI-BD-06-T79. 실목록 외(file 도메인) — URL 임시. */
  async downloadOvsTndrDoc(atchFileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(atchFileNm)
    return apiClient.post<Blob, Blob>(`/v1/bds/ovs/tndrs/docs/${atchFileNm}/download`, null, {
      responseType: 'blob',
    })
  },

  /**
   * 국외 입찰서 첨부문서 조회(품목대체/MOQ 팝업) — MUI-BD-06-T72 (ovsTndrSbmsn/Stp2).
   * TODO(실API 미매핑): 후보 no.48 첨부서류목록조회(국외 공고 첨부). URL 임시.
   */
  async selectOvsAtchDoc(frcptlArtclNo: string, invtNo: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.post<OvsAtchDoc[], OvsAtchDoc[]>('/v1/bds/ovs/tndrs/atch-docs', {
      frcptlArtclNo,
      invtNo,
    })
  },

  /**
   * 국외 입찰서 파일 업로드 — MUI-BD-06-T74 (ovsTndrSbmsn/Stp3).
   * 실목록 외(file 도메인) — URL 임시.
   */
  async uploadOvsTndrFile(pbancNo: string, pbancOd: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      '/v1/bds/ovs/tndrs/files',
      uploadForm(file, { pbancNo, pbancOd }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰서 파일 삭제 — MUI-BD-06-T74. 실목록 외 — URL 임시. */
  async removeOvsTndrFile(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(`/v1/bds/ovs/tndrs/files/${id}`)
  },
}
