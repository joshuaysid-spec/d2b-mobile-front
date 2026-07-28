// 입찰(BD) 도메인 API — frontend-architecture.md §7.1.
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로 확정 시 EP 맵만 수정한다(메서드 본문 불변).
// 응답 인터셉터가 공통 봉투({metadata,data})를 벗겨 data 알맹이를 반환하므로,
// apiClient.get/post 의 2번째 제네릭(R)에 알맹이 타입을 지정해 반환 타입을 맞춘다.
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
  PqResultResponse,
  RegBzentyRow,
  RegBzentySrchRequest,
  RegionResult,
  TndrSavePayload,
  WrotDoc,
} from '@/types/bd'

// ── EP: 엔드포인트 경로(추정 REST). 반입 후 이 맵만 실제 경로로 교체(메서드 본문 불변). ──
const EP = {
  // 입찰공고 (MUI-BD-01)
  /** 입찰공고 통합목록 — MUI-BD-01-M01 (bidPbancIntgList/BidPbancIntgListPage) */
  PBANC_LIST: '/v1/bds/pbancs',
  /** 입찰공고 상세 — MUI-BD-01-M07 (bidPbancDtl/BidPbancDtl) */
  PBANC_DTL: (id: string) => `/v1/bds/pbancs/${id}`,
  /** 입찰공고 상세(보완 필드) — MUI-BD-01-M07 (bidPbancDtl/BidPbancDtlPage) */
  PBANC_PRGRS_DTL: (id: string) => `/v1/bds/pbancs/${id}/progress-detail`,
  /** 입찰진행 현황 — MUI-BD-01-T06(구 M12 — v1.83 재편) (bidPbancDtl/BidPbancDtl_Tacpg07) */
  PBANC_PROGRESS: (id: string) => `/v1/bds/pbancs/${id}/progress`,
  /** 관심공고 토글 — MUI-BD-01-P13 (bidPbancDtl/BidPbancDtlPage · bidRsltDtl · ovsBidPbancDtl) */
  FAVORITE: (id: string) => `/v1/bds/pbancs/${id}/favorite`,

  // 개찰목록 · 입찰결과 (MUI-BD-08 · MUI-BD-09)
  /** 개찰목록 — MUI-BD-08-M01 (bdopnList/BdopnListPage) */
  BDOPN_LIST: '/v1/bds/bdopns',
  /** 개찰(입찰결과) 상세 — MUI-BD-09-M01 (bidRsltDtl/BidRsltDtlPage) */
  BDOPN_DTL: (id: string) => `/v1/bds/bdopns/${id}`,
  /** 입찰결과(내 업체) — MUI-BD-09-T03(구 M03 — v1.83 재편) (bidRsltDtl/BidRsltDtl) */
  BID_RSLT: (id: string) => `/v1/bds/bdopns/${id}/results`,
  /** 협상결과 — MUI-BD-09-T04(구 M04 — v1.83 재편) (bidRsltDtl/BidRsltDtl2) */
  NEGO_RSLT: (id: string) => `/v1/bds/bdopns/${id}/nego-results`,
  /** 입찰결과 품목정보 — MUI-BD-09-T02(구 M02 — v1.83 재편) (bidRsltDtl/BidRsltDtlList) */
  BID_RSLT_ITEMS: (id: string) => `/v1/bds/bdopns/${id}/items`,
  /** 이행/적격심사 신청 — MUI-BD-10 (bidRsltDtl/BidRsltDtlPage) */
  PFMNC_ELGBL_SCRN: (id: string) => `/v1/bds/bdopns/${id}/elgbl-screenings`,

  // 사전심사 (MUI-BD-02)
  /** 사전심사 신청 — MUI-BD-02-M01 (bfhdSrngAply/BfhdSrngAplyPage) */
  BFHD_SRNG_APPLY: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/pq-applies`,
  /** 사전심사 결과조회 — MUI-BD-02-M02 (bfhdSrngRsltInq/BfhdSrngRsltInqPage) */
  PQ_RESULT: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/pq-result`,
  /** 생산능력서류 제출 — MUI-BD-03-P06 (bfhdSrngRsltInq/PrdctnAbltDcmntSbmsn) */
  PROD_ABILITY_DOCS: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/prod-ability-docs`,

  // 입찰진행 (MUI-BD-03)
  /** 입찰진행 목록 — MUI-BD-03-M01 (bidPrgrsListForBzenty/BidPrgrsListForBzentyPage) */
  PROGRESS_LIST: '/v1/bds/progresses',
  /** 입찰포기 신청 — MUI-BD-03-P03 (bidPrgsDtlInq/BidAbndAperWrt) */
  BID_ABANDON: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/abandon`,
  /** 입찰취소 신청 — MUI-BD-03-P04 (bidPrgsDtlInq/BidRtrcnAperInq) */
  BID_CANCEL: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/cancel`,
  /** 입찰등록결과 — MUI-BD-03-M05 (bidRegRsltInq/BidRegRsltInqPage) */
  BID_REG_RESULT: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/reg-result`,
  /** 입찰참가등록반려 신청 — MUI-BD-03-P07 (bidPrtcpAperWrt/BidPrtcpAplyRjct) */
  REG_REJECT: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/reg-reject`,

  // 입찰참가신청 (MUI-BD-04)
  /** 입찰 품목목록 — MUI-BD-04-M06 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp2) */
  BID_ITEM_LIST: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/bid-items`,
  /** 공사실적/면허 — MUI-BD-04-M07 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp3) */
  CNSTWK_LCNS_LIST: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/cnstwk-licenses`,
  /** 입찰보증금 저장 — MUI-BD-04-M08 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp4) */
  BID_GUARANTEE: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/guarantee`,
  /** 공동수급업체 동의 — MUI-BD-04-M10 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp5) */
  JOINT_BZENTY_AGREE: '/v1/bds/joint-bzentys/agreements',
  /** 등록업체 상세 — MUI-BD-04-M10 (bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp5) */
  REG_BZENTY_DTL: (bizRegNo: string) => `/v1/bds/reg-bzentys/${bizRegNo}`,
  /** 등록업체 검색 — MUI-BD-04-P11 (bidPrtcpAperWrt/RegBzentySrch) */
  REG_BZENTY_LIST: '/v1/bds/reg-bzentys',
  /** 캐비닛 파일 선택 — MUI-BD-04-P13 (bidPrtcpAperWrt/CabinetLink) */
  CABINET_LINK: '/v1/bds/cabinet-files',
  /** 동의서 조회 — MUI-BD-04-M14 · MUI-BD-06-M07 (bidPrtcpAperWrt · tndrWrt AgreementForm) */
  AGREEMENT: (agreementId: string) => `/v1/bds/agreements/${agreementId}`,
  /** 동의서 선택/저장 — MUI-BD-04-M14 · MUI-BD-06-M07 */
  AGREEMENT_CHOICE: (agreementId: string) => `/v1/bds/agreements/${agreementId}/choice`,

  // 전자서명 (MUI-BD-04-M21)
  /** 전자서명 인증서 목록 — MUI-BD-04-M21 (elsgn/ElsgnPage) */
  ELSGN_CERTS: '/v1/bds/elsgn/certs',
  /** 전자서명 실행 — MUI-BD-04-M21 (elsgn/ElsgnPage) */
  ELSGN_SIGN: '/v1/bds/elsgn/sign',

  // 견적서/입찰서 작성 (MUI-BD-06)
  /** 입찰서 품목목록 — MUI-BD-06-M02 (tndrWrt/TndrWrt_Stp2) */
  TNDR_ITEM_LIST: (pbancNo: string) => `/v1/bds/pbancs/${pbancNo}/tndr-items`,
  /** 입찰서 저장 — MUI-BD-06-M01 (tndrWrt/TndrWrtPage · Stp3~6) */
  TNDR_SAVE: '/v1/bds/tndrs',
  /** 입찰서 첨부 업로드 — MUI-BD-06-M05 (tndrWrt/TndrWrt_Stp5) */
  TNDR_FILE: '/v1/bds/tndrs/files',
  /** 입찰서 첨부 삭제 — MUI-BD-06-M05 (tndrWrt/TndrWrt_Stp5) */
  TNDR_FILE_ITEM: (id: string) => `/v1/bds/tndrs/files/${id}`,

  // 서약서 (MUI-BD-04-M01)
  /** 서약서 조회 — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage) */
  WROT: (wrotId: string) => `/v1/bds/wrots/${wrotId}`,
  /** 서약서 선택/저장 — MUI-BD-04-M01 (wrotAgrePage/WrotAgrePage · WrotAgreForm) */
  WROT_CHOICE: (wrotId: string) => `/v1/bds/wrots/${wrotId}/choice`,

  // 공통 검색 (cm/search 이나 도메인=bd)
  /** 면허정보 검색 — MUI-BD-01-P05 (cm/search/LcnsInfoSrch) */
  LICENSE_SEARCH: '/v1/bds/licenses',
  /** 지역 검색 — MUI-BD-01-P03 (cm/search/RgnSrch) */
  REGION_SEARCH: '/v1/bds/regions',

  // ── 국외(Overseas) ──
  /** 국외 입찰공고 상세 — MUI-BD-01-M71 (ovsBidPbancDtl/OvsBidPbancDtlPage) */
  OVS_PBANC_DTL: (id: string) => `/v1/bds/ovs/pbancs/${id}`,
  /** 국외 품목 목록 — MUI-BD-01-T72(구 M72 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl) */
  OVS_BID_ITEMS: (id: string) => `/v1/bds/ovs/pbancs/${id}/items`,
  /** 국외 품목 첨부문서 — MUI-BD-01-P76 (ovsBidPbancDtl/OvsBidPbancDtl · OvsBidPbanc_AtchFileInq) */
  OVS_ITEM_ATCH: (frcptlArtclNo: string) => `/v1/bds/ovs/items/${frcptlArtclNo}/atch-files`,
  /** 국외 품목 첨부파일 다운로드 — MUI-BD-01-P76 */
  OVS_ITEM_ATCH_FILE: (no: number) => `/v1/bds/ovs/item-atch-files/${no}/download`,
  /** 국외 공고 첨부서류 목록 — MUI-BD-01-T73(구 M73 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl2) */
  OVS_BID_ATCH_DOCS: (id: string) => `/v1/bds/ovs/pbancs/${id}/atch-docs`,
  /** 국외 공고 첨부서류 다운로드 — MUI-BD-01-T73(구 M73 — v1.83 재편) */
  OVS_BID_ATCH_DOC_FILE: (no: number) => `/v1/bds/ovs/atch-docs/${no}/download`,
  /** 국외 보관함 품목 추가/삭제 — MUI-BD-01-T72(구 M72 — v1.83 재편) (ovsBidPbancDtl/OvsBidPbancDtl) */
  OVS_LOCKER_ITEM: (frcptlArtclNo: string) => `/v1/bds/ovs/locker/items/${frcptlArtclNo}`,

  /** 국외 입찰참가신청 등록결과 — MUI-BD-04-P83 (ovsBidPrtcpApfrDtl/OvsBidRegRsltByBiz) */
  OVS_BID_REG_RSLT: '/v1/bds/ovs/bid-prtcp/reg-results',
  /** 국외 입찰참가신청 취소 — MUI-BD-04-P82 (ovsBidPrtcpApfrDtl/OvsBidPrtcpRtrcnAply) */
  OVS_BID_PRTCP_RTRCN: '/v1/bds/ovs/bid-prtcp/retractions',
  /** 국외 입찰보증금 목록(면제구분) — MUI-BD-04-T78(구 M80 — v1.83 재편) (ovsBidPrtcpApfrDtl/Tab3) */
  OVS_BID_GRNTE_LIST: '/v1/bds/ovs/bid-prtcp/guarantees',
  /** 국외 보증서류 다운로드 — MUI-BD-04-T78(구 M80 — v1.83 재편) (ovsBidPrtcpApfrDtl/Tab3) */
  OVS_GRNTE_DOC: (docNo: string) => `/v1/bds/ovs/guarantee-docs/${docNo}/download`,
  /** 국외 첨부파일 다운로드 — MUI-BD-04-T79(구 M81 — v1.83 재편) (ovsBidPrtcpApfrDtl/Tab4) */
  OVS_ATCH_FILE: (atchFileNm: string) => `/v1/bds/ovs/atch-files/${atchFileNm}/download`,
  /** 국외 입찰참가 첨부서류 업로드 — MUI-BD-04-T75(구 M77 — v1.83 재편) (ovsBidPrtcpAply/AtchDocReg) */
  OVS_BID_PRTCP_ATCH: '/v1/bds/ovs/bid-prtcp/atch-docs',
  /** 국외 입찰참가 첨부서류 삭제 — MUI-BD-04-T75(구 M77 — v1.83 재편) */
  OVS_BID_PRTCP_ATCH_ITEM: (id: string) => `/v1/bds/ovs/bid-prtcp/atch-docs/${id}`,
  /** 국외 서약서 조회/저장 — MUI-BD-04-P03 (ovsBidPrtcpAply/OvsBidPrtcpAplyPage · OvsProbWrotAgre) */
  OVS_PROB_WROT: (wrotId: string) => `/v1/bds/ovs/prob-wrots/${wrotId}`,
  /** 국외 서약서 선택 — MUI-BD-04-P03 */
  OVS_PROB_WROT_CHOICE: (wrotId: string) => `/v1/bds/ovs/prob-wrots/${wrotId}/choice`,
  /** 국외 입찰참가신청서 등록 — MUI-BD-04-T75(구 M77 — v1.83 재편) (ovsBidPrtcpAply/OvsBidPrtcpAplyPage) */
  OVS_BID_PRTCP_APLY: '/v1/bds/ovs/bid-prtcp/applies',
  /** 국외 입찰보증서 상세 — MUI-BD-04-P76 (ovsBidPrtcpAply/OvsBidWtgrDtlFullPopup) */
  OVS_WTGR_DTL: (wtgrNo: string) => `/v1/bds/ovs/wtgrs/${wtgrNo}`,
  /** 국외 입찰보증서 목록 — MUI-BD-04-P75 (ovsBidPrtcpAply/OvsBidWtgrInqFullPopup) */
  OVS_WTGR_LIST: '/v1/bds/ovs/wtgrs',
  /** 국외 입찰업체 정보 — MUI-BD-04-T73(구 M73 — v1.83 재편) (ovsBidPrtcpAply/Stp2) */
  OVS_SPLY_INFO: (splyBzentyCd: string) => `/v1/bds/ovs/sply-bzentys/${splyBzentyCd}`,
  /** 국외 보증문서 업로드(연대보증서/지급각서/보증보험/납부서) — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3) */
  OVS_GRNTE_UPLOAD: '/v1/bds/ovs/guarantee-docs',
  /** 국외 입찰보증금 사업목록(구분) — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3) */
  OVS_GRNTE_BIZ_LIST: '/v1/bds/ovs/bid-prtcp/guarantee-bizs',
  /** 국외 입찰보증서 적용 — MUI-BD-04-T74(구 M74 — v1.83 재편) (ovsBidPrtcpAply/Stp3) */
  OVS_WTGR_APPLY: '/v1/bds/ovs/wtgrs/applies',

  /** 국외 입찰결과 — MUI-BD-09-T72/T73(구 M72/M73 — v1.83 재편) (ovsBidRsltDtl/OvsBidRsltDtl2 · OvsBidRsltDtl3) */
  OVS_BID_RSLT: '/v1/bds/ovs/bid-results',
  /** 국외 환율정보 — MUI-BD-01-M74 (ovsExchrtList/OvsExchrtListFullPopup) */
  OVS_EXCHANGE_RATES: '/v1/bds/ovs/exchange-rates',
  /** 국외 목표가공개품목 — MUI-BD-01-M75 (ovsGoalPrcRlsItemList/OvsGoalPrcRlsItemListPage) */
  OVS_GOAL_PRC_ITEMS: '/v1/bds/ovs/goal-price-items',
  /** 국외 보관함 입찰품목 — MUI-CM-01-M73 (ovsLockerItemReg/OvsLockerItemRegPage) */
  OVS_LOCKER_BID_ITEMS: (pbancNo: string) => `/v1/bds/ovs/locker/${pbancNo}/bid-items`,
  /** 국외 보관함 품목 추가/삭제 — MUI-CM-01-M73 */
  OVS_LOCKER_BID_ITEM: (id: string) => `/v1/bds/ovs/locker/bid-items/${id}`,
  /** 국외 보관함 공고 상세 — MUI-CM-01-M72 (ovsLockerPbanDtl/OvsLockerPbanDtlPage) */
  OVS_LOCKER_PBAN_DTL: (id: string) => `/v1/bds/ovs/locker/pbancs/${id}`,
  /** 국외 보관함 공고 목록 — MUI-CM-01-M71 (ovsLockerPbanList/OvsLockerPbanListPage) */
  OVS_LOCKER_PBAN_LIST: '/v1/bds/ovs/locker/pbancs',

  /** 국외 공개수의협상 견적서 취소 — MUI-BD-12-P82 (ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt) */
  OVS_RLS_VLTRNS_ETDC_RTRCN: '/v1/bds/ovs/rls-vltrns/etdc-retractions',
  /** 국외 공개수의협상 견적서 품목 — MUI-BD-12-T76(구 M76 — v1.83 재편) (ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn3) */
  OVS_RLS_VLTRNS_ETDC_ITEMS: '/v1/bds/ovs/rls-vltrns/etdc-items',
  /** 국외 공개수의협상 견적서 제출 — MUI-BD-12-M74 (ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsnPage) */
  OVS_RLS_VLTRNS_ETDC: (id: string) => `/v1/bds/ovs/rls-vltrns/${id}/etdc`,
  /** 국외 공개수의협상 품목정보 — MUI-BD-12-T72(구 M72 — v1.83 재편) (ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl2) */
  OVS_RLS_VLTRNS_ITEMS: '/v1/bds/ovs/rls-vltrns/items',
  /** 국외 공개수의협상 첨부서류 — MUI-BD-12-T73(구 M73 — v1.83 재편) (ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtl3) */
  OVS_RLS_VLTRNS_ATCH_DOCS: '/v1/bds/ovs/rls-vltrns/atch-docs',
  /** 국외 공개수의협상 심사결과 — MUI-BD-12-T83(구 M83 — v1.83 재편) (ovsRlsVltrnsNgtnSrngRsltInq/OvsRlsVltrnsNgtnSrngRsltInq2) */
  OVS_RLS_VLTRNS_SRNG_RSLT: '/v1/bds/ovs/rls-vltrns/srng-results',
  /** 국외 공개수의협상 첨부파일 다운로드 — MUI-BD-12-T81(구 M81 — v1.83 재편) (ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtl4) */
  OVS_ETDC_FILE: (id: string) => `/v1/bds/ovs/rls-vltrns/etdc-files/${id}/download`,

  /** 국외 임시입찰내역 문서 업로드 — MUI-BD-01-T75(구 M77 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn) */
  OVS_BID_CN_DOC: '/v1/bds/ovs/tmpr-bid-cn/docs',
  /** 국외 통화 목록 — MUI-BD-01-T75(구 M77 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn) */
  OVS_CRNC_LIST: '/v1/bds/ovs/currencies',
  /** 국외 입찰업체 목록 — MUI-BD-01-T75(구 M77 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn) */
  OVS_BID_BZENTY_LIST: '/v1/bds/ovs/bid-bzentys',
  /** 국외 임시입찰내역 저장/삭제 — MUI-BD-01-T75/T76(구 M77/M78 — v1.83 재편) (ovsTmprBidCnReg/BidDsctn · BidDsctn2) */
  OVS_TMPR_BID_CN: (intgRfrncNo: string) => `/v1/bds/ovs/tmpr-bid-cn/${intgRfrncNo}`,
  /** 국외 이전공고 입찰내역(통합참조번호) — MUI-BD-01-M76 (ovsTmprBidCnReg/OvsTmprBidCnRegPage) */
  OVS_BFR_PBANC_BID_CN: (intgRfrncNo: string) => `/v1/bds/ovs/tmpr-bid-cn/${intgRfrncNo}/prev-bid-cn`,

  /** 국외 이전공고 보관함목록 — MUI-BD-01-P79(구 M79 — v1.83 재편) (ovsBfrTmprBidBidCnReg/OvsBfrTmprBidBidCnRegPage) */
  BFR_PBANC_LOCKER_LIST: (lockerId: string) => `/v1/bds/ovs/locker/${lockerId}/prev-pbancs`,
  /** 국외 이전공고 입찰내역목록 — MUI-BD-01-P80 (ovsBfrTmprBidBidCnReg/BfrPbancBidDsctnItemDtlFullPopup) */
  BFR_PBANC_BID_CN: (pbancNo: string) => `/v1/bds/ovs/prev-pbancs/${pbancNo}/bid-cn`,
  /** 국외 이전공고 입찰내역 불러오기 — MUI-BD-01-P80 */
  BFR_PBANC_BID_CN_LOAD: (pbancNo: string) => `/v1/bds/ovs/prev-pbancs/${pbancNo}/bid-cn/load`,

  /** 국외 입찰취소(투찰취소) 신청 — MUI-BD-06-P81 (ovsTndrDtl/OvsBidRtrcnAply) */
  OVS_BID_RTRCN: '/v1/bds/ovs/tndrs/retractions',
  /** 국외 입찰서 상세 — MUI-BD-06-M75 (ovsTndrDtl/OvsTndrDtlPage) */
  OVS_TNDR_DTL: (id: string) => `/v1/bds/ovs/tndrs/${id}`,
  /** 국외 입찰서 입찰참여품목 — MUI-BD-06-T72/T77(구 M72/M77 — v1.83 재편) (ovsTndrDtl/Tab3 · ovsTndrSbmsn/Stp2) */
  OVS_TNDR_ITEMS: '/v1/bds/ovs/tndrs/items',
  /** 국외 입찰서 첨부문서 목록 — MUI-BD-06-T79(구 M79 — v1.83 재편) (ovsTndrDtl/Tab4) */
  OVS_TNDR_DOCS: '/v1/bds/ovs/tndrs/docs',
  /** 국외 입찰서 첨부문서 다운로드 — MUI-BD-06-T79(구 M79 — v1.83 재편) */
  OVS_TNDR_DOC_FILE: (atchFileNm: string) => `/v1/bds/ovs/tndrs/docs/${atchFileNm}/download`,
  /** 국외 입찰서 제출(투찰) — MUI-BD-06-T74(구 M74 — v1.83 재편) (ovsTndrSbmsn/OvsTndrSbmsnPage) */
  OVS_TNDR_SUBMIT: '/v1/bds/ovs/tndrs',
  /** 국외 입찰서 첨부문서 조회(품목대체/MOQ) — MUI-BD-06-T72(구 M72 — v1.83 재편) (ovsTndrSbmsn/Stp2) */
  OVS_ATCH_DOC: '/v1/bds/ovs/tndrs/atch-docs',
  /** 국외 입찰서 파일 업로드 — MUI-BD-06-T74(구 M74 — v1.83 재편) (ovsTndrSbmsn/Stp3) */
  OVS_TNDR_FILE: '/v1/bds/ovs/tndrs/files',
  /** 국외 입찰서 파일 삭제 — MUI-BD-06-T74(구 M74 — v1.83 재편) */
  OVS_TNDR_FILE_ITEM: (id: string) => `/v1/bds/ovs/tndrs/files/${id}`,
} as const

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

  /** 입찰공고 통합목록 조회 — 목업은 전체 반환(키워드/페이징은 페이지 클라이언트 로직 소관). */
  async getList(params?: BidListSearchRequest): Promise<BidPbancItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pbancList)
    return apiClient.get<BidPbancItem[], BidPbancItem[]>(EP.PBANC_LIST, { params })
  },

  /** 입찰공고 상세 조회(탭 콘텐츠 데이터). */
  async getDetail(id: string): Promise<BidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pbancDetail)
    return apiClient.get<BidPbancDetail, BidPbancDetail>(EP.PBANC_DTL(id))
  },

  /** 입찰공고 상세 보완 필드(연락처·계약/입찰방법·진행 플래그) 조회. */
  async getBidPbancDtl(id: string): Promise<BidPrgrsItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsDetail)
    return apiClient.get<BidPrgrsItem, BidPrgrsItem>(EP.PBANC_PRGRS_DTL(id))
  },

  /** 입찰진행 현황 조회(입찰진행 탭). */
  async getBidProgress(id: string): Promise<BidProgressRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.progressList)
    return apiClient.get<BidProgressRow[], BidProgressRow[]>(EP.PBANC_PROGRESS(id))
  },

  /** 관심공고 등록/제외 토글(입찰공고·입찰결과·국외 공고 공용). */
  async toggleFavorite(id: string, favorite: boolean): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.put<void, void>(EP.FAVORITE(id), { favorite })
  },

  // ── 개찰목록 · 입찰결과 (MUI-BD-08 · MUI-BD-09) ────────────────────────────

  /** 개찰목록 조회 — 목업은 전체 반환(페이지 클라이언트 필터/페이징). */
  async getBdopnList(params?: BidListSearchRequest): Promise<BdopnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bdopnList)
    return apiClient.get<BdopnItem[], BdopnItem[]>(EP.BDOPN_LIST, { params })
  },

  /** 개찰(입찰결과) 상세 조회(요약 헤더) — 목업은 id 로 개찰목록 1건 lookup(직접진입/새로고침 대응). */
  async getBidRsltDetail(id: string): Promise<BdopnItem> {
    if (USE_MOCK) return mockDelay(getBdopnById(id) ?? MOCK_BD.bdopnList[0])
    return apiClient.get<BdopnItem, BdopnItem>(EP.BDOPN_DTL(id))
  },

  /** 입찰결과(내 업체) 페이지 조회. */
  async getBidRslt(id: string, page: number): Promise<BidRsltRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRsltList)
    return apiClient.get<BidRsltRow[], BidRsltRow[]>(EP.BID_RSLT(id), { params: { page } })
  },

  /** 협상결과 페이지 조회. */
  async getNegoRslt(id: string, page: number): Promise<NegoRsltRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.negoList)
    return apiClient.get<NegoRsltRow[], NegoRsltRow[]>(EP.NEGO_RSLT(id), { params: { page } })
  },

  /** 입찰결과 품목정보 페이지 조회. */
  async getBidRsltItems(id: string, page: number): Promise<BidRsltProductItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRsltItems)
    return apiClient.get<BidRsltProductItem[], BidRsltProductItem[]>(EP.BID_RSLT_ITEMS(id), {
      params: { page },
    })
  },

  /** 이행/적격심사 신청. */
  async applyPfmncElgblScrn(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.PFMNC_ELGBL_SCRN(id), {})
  },

  // ── 사전심사 (MUI-BD-02) ───────────────────────────────────────────────────

  /** 사전심사(PQ) 신청 — 첨부파일 guid 목록 제출. */
  async applyBfhdSrng(pbancNo: string, fileGuids: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.BFHD_SRNG_APPLY(pbancNo), { fileGuids })
  },

  /** 사전심사 결과조회. */
  async getPqResult(pbancNo: string): Promise<PqResultResponse> {
    if (USE_MOCK) return mockDelay(MOCK_BD.pqResult)
    return apiClient.get<PqResultResponse, PqResultResponse>(EP.PQ_RESULT(pbancNo))
  },

  /** 생산능력서류 제출 — 첨부파일 guid 목록 제출. */
  async submitProdAbilityDocs(pbancNo: string, fileGuids: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.PROD_ABILITY_DOCS(pbancNo), { fileGuids })
  },

  // ── 입찰진행 (MUI-BD-03) ───────────────────────────────────────────────────

  /** 입찰진행 목록 조회 — 목업은 전체 반환(페이지 클라이언트 필터/페이징). */
  async getBidProgressList(params?: BidListSearchRequest): Promise<BidPrgrsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.prgrsList)
    return apiClient.get<BidPrgrsItem[], BidPrgrsItem[]>(EP.PROGRESS_LIST, { params })
  },

  /** 입찰포기 신청. */
  async submitBidAbandon(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.BID_ABANDON(pbancNo), {})
  },

  /** 입찰취소 신청(사유 필수). */
  async submitBidCancel(payload: { bidRtrcnAplyRsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    const { pbancNo, ...body } = payload
    return apiClient.post<void, void>(EP.BID_CANCEL(pbancNo ?? ''), body)
  },

  /** 입찰등록결과 조회. */
  async getBidRegResult(pbancNo: string): Promise<BidRegResultResponse> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bidRegResult)
    return apiClient.get<BidRegResultResponse, BidRegResultResponse>(EP.BID_REG_RESULT(pbancNo))
  },

  /** 입찰참가등록반려 신청. */
  async applyBidPrtcpRegReject(pbancNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.REG_REJECT(pbancNo), {})
  },

  // ── 입찰참가신청 (MUI-BD-04) ───────────────────────────────────────────────

  /** 입찰 품목목록 페이지 조회. */
  async getBidItemList(pbancNo: string, page: number): Promise<BidItemListRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.itemList)
    return apiClient.get<BidItemListRow[], BidItemListRow[]>(EP.BID_ITEM_LIST(pbancNo), {
      params: { page },
    })
  },

  /** 공사실적/면허 목록 페이지 조회. */
  async getCnstwkLcnsList(pbancNo: string, page: number): Promise<CnstwkLcnsRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.cnstwkList)
    return apiClient.get<CnstwkLcnsRow[], CnstwkLcnsRow[]>(EP.CNSTWK_LCNS_LIST(pbancNo), {
      params: { page },
    })
  },

  /** 입찰보증금(납부방법 등) 저장. */
  async saveBidGuarantee(
    pbancNo: string,
    payload: { payMethod: string; exemptReason?: string },
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.BID_GUARANTEE(pbancNo), payload)
  },

  /** 공동수급업체 동의. */
  async agreeJointBzenty(bzentyId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.JOINT_BZENTY_AGREE, { bzentyId })
  },

  /** 등록업체 상세 조회(선택 업체로 공동수급 행 채움). */
  async getRegBzentyDetail(bizRegNo: string): Promise<RegBzentyRow> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regBzentyList[0])
    return apiClient.get<RegBzentyRow, RegBzentyRow>(EP.REG_BZENTY_DTL(bizRegNo))
  },

  /** 등록업체 검색(업체명/사업자번호). */
  async getRegBzentyList(req: RegBzentySrchRequest): Promise<RegBzentyRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regBzentyList)
    return apiClient.get<RegBzentyRow[], RegBzentyRow[]>(EP.REG_BZENTY_LIST, { params: req })
  },

  /** 캐비닛(디지털 문서함) 파일 목록 조회. */
  async linkCabinet(): Promise<CabinetFile[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.cabinetFiles)
    return apiClient.get<CabinetFile[], CabinetFile[]>(EP.CABINET_LINK)
  },

  /** 동의서 조회(입찰참가신청 M14 · 입찰서 M07 공용). */
  async getAgreement(agreementId: string): Promise<AgreementDoc> {
    if (USE_MOCK) return mockDelay(MOCK_BD.agreement)
    return apiClient.get<AgreementDoc, AgreementDoc>(EP.AGREEMENT(agreementId))
  },

  /** 동의서 선택 저장(라디오 변경 즉시). */
  async setAgreementChoice(agreementId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.put<void, void>(EP.AGREEMENT_CHOICE(agreementId), { choice })
  },

  /** 동의서 저장(확인). */
  async saveAgreement(agreementId: string, choice?: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.AGREEMENT(agreementId), { choice })
  },

  // ── 전자서명 (MUI-BD-04-M21) ───────────────────────────────────────────────

  /** 전자서명 인증서 목록 조회. */
  async getElsgnCertList(): Promise<ElsgnCert[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.elsgnCerts)
    return apiClient.get<ElsgnCert[], ElsgnCert[]>(EP.ELSGN_CERTS)
  },

  /** 전자서명 실행 — 성공 시 접수번호/일시 반환. */
  async signElsgn(certId: string, pbancNo: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>(EP.ELSGN_SIGN, { certId, pbancNo })
  },

  // ── 견적서/입찰서 작성 (MUI-BD-06) ─────────────────────────────────────────

  /** 입찰서 품목목록 페이지 조회. */
  async getBidTndrItemList(pbancNo: string, page: number): Promise<BidItemListRow[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.itemList)
    return apiClient.get<BidItemListRow[], BidItemListRow[]>(EP.TNDR_ITEM_LIST(pbancNo), {
      params: { page },
    })
  },

  /** 입찰서 저장(스탭별 부분 저장 → 제출 시 전체). */
  async saveTndr(payload: TndrSavePayload): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.TNDR_SAVE, payload)
  },

  /** 입찰서 첨부 업로드 — 서버 발급 UploadedFile 반환. */
  async uploadTndrFile(pbancNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(EP.TNDR_FILE, uploadForm(file, { pbancNo }), {
      headers: { 'Content-Type': undefined },
    })
  },

  /** 입찰서 첨부 삭제. */
  async removeTndrFile(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.delete<void, void>(EP.TNDR_FILE_ITEM(id))
  },

  // ── 서약서 (MUI-BD-04-M01) ─────────────────────────────────────────────────

  /** 서약서 조회. */
  async getWrot(wrotId: string): Promise<WrotDoc> {
    if (USE_MOCK) return mockDelay(MOCK_BD.wrot)
    return apiClient.get<WrotDoc, WrotDoc>(EP.WROT(wrotId))
  },

  /** 서약서 동의 선택(라디오 변경 즉시). */
  async setWrotChoice(wrotId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.put<void, void>(EP.WROT_CHOICE(wrotId), { choice })
  },

  /** 서약서 저장. */
  async saveWrot(wrotId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.WROT(wrotId), {})
  },

  // ── 공통 검색 (도메인=bd) ──────────────────────────────────────────────────

  /** 면허정보 검색(면허명/코드 부분일치). */
  async searchLicenses(keyword: string): Promise<LicenseResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.licenses)
    return apiClient.get<LicenseResult[], LicenseResult[]>(EP.LICENSE_SEARCH, { params: { keyword } })
  },

  /** 지역 검색(시도/시군구 부분일치). */
  async searchRegions(keyword: string): Promise<RegionResult[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.regions)
    return apiClient.get<RegionResult[], RegionResult[]>(EP.REGION_SEARCH, { params: { keyword } })
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 국외(Overseas)
  // ══════════════════════════════════════════════════════════════════════════

  // ── 국외 입찰공고 상세 (MUI-BD-01-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ─────────────────────────────────

  /** 국외 입찰공고 상세(공고일반) 조회. */
  async getOvsBidPbancDetail(id: string): Promise<OvsBidPbancDetail> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPbancDetail)
    return apiClient.get<OvsBidPbancDetail, OvsBidPbancDetail>(EP.OVS_PBANC_DTL(id))
  },

  /** 국외 품목 목록 조회. */
  async getOvsBidItemList(id: string): Promise<OvsBidItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidItemList)
    return apiClient.get<OvsBidItem[], OvsBidItem[]>(EP.OVS_BID_ITEMS(id))
  },

  /** 국외 품목 첨부문서 목록 조회. */
  async getOvsItemAtchFileList(frcptlArtclNo: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.get<OvsAtchDoc[], OvsAtchDoc[]>(EP.OVS_ITEM_ATCH(frcptlArtclNo))
  },

  /** 국외 품목 첨부파일 다운로드. */
  async downloadOvsItemAtchFile(no: number): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-item-atch-${no}`)
    return apiClient.get<Blob, Blob>(EP.OVS_ITEM_ATCH_FILE(no), { responseType: 'blob' })
  },

  /** 국외 보관함 품목 추가(상세 화면). */
  async addOvsLockerItem(frcptlArtclNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_LOCKER_ITEM(frcptlArtclNo), {})
  },

  /** 국외 보관함 품목 삭제(상세 화면). */
  async deleteOvsLockerItem(frcptlArtclNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.delete<void, void>(EP.OVS_LOCKER_ITEM(frcptlArtclNo))
  },

  /** 국외 공고 첨부서류 목록 조회. */
  async getOvsBidAtchDocList(id: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.get<OvsAtchDoc[], OvsAtchDoc[]>(EP.OVS_BID_ATCH_DOCS(id))
  },

  /** 국외 공고 첨부서류 다운로드. */
  async downloadOvsBidAtchDoc(no: number): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-atch-doc-${no}`)
    return apiClient.get<Blob, Blob>(EP.OVS_BID_ATCH_DOC_FILE(no), { responseType: 'blob' })
  },

  // ── 국외 입찰참가신청서 (MUI-BD-04) ────────────────────────────────────────

  /** 국외 입찰참가신청 등록결과(사업별) 조회. */
  async getOvsBidRegRsltByBiz(): Promise<OvsBidRegRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRegRsltList)
    return apiClient.get<OvsBidRegRsltItem[], OvsBidRegRsltItem[]>(EP.OVS_BID_REG_RSLT)
  },

  /** 국외 입찰참가신청서 취소 신청. */
  async submitOvsBidPrtcpRtrcn(payload: {
    pbancNo: string
    pbancOd: string
    targets: string[]
    rsn: string
  }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_BID_PRTCP_RTRCN, payload)
  },

  /** 국외 입찰보증금 목록(면제구분별) 조회. N=비면제 / Y=면제. */
  async getOvsBidGrnteList(
    grnteExmptnSe: 'N' | 'Y',
  ): Promise<OvsBidBizItem[] | OvsBidBizExmptnItem[]> {
    if (USE_MOCK) {
      return mockDelay(grnteExmptnSe === 'Y' ? MOCK_BD.ovsBidBizExmptnList : MOCK_BD.ovsBidBizList)
    }
    return apiClient.get<OvsBidBizItem[] | OvsBidBizExmptnItem[], OvsBidBizItem[] | OvsBidBizExmptnItem[]>(
      EP.OVS_BID_GRNTE_LIST,
      { params: { grnteExmptnSe } },
    )
  },

  /** 국외 보증서류 다운로드(연대보증서/지급각서/납부서). */
  async downloadGrnteDoc(docNo: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-grnte-doc-${docNo}`)
    return apiClient.get<Blob, Blob>(EP.OVS_GRNTE_DOC(docNo), { responseType: 'blob' })
  },

  /** 국외 첨부파일 다운로드(등록결과 첨부). */
  async downloadAtchFile(atchFileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(atchFileNm)
    return apiClient.get<Blob, Blob>(EP.OVS_ATCH_FILE(atchFileNm), { responseType: 'blob' })
  },

  /** 국외 입찰참가 첨부서류 업로드 — 서버 발급 UploadedFile 반환. */
  async uploadOvsBidPrtcpAtchDoc(pbancNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      EP.OVS_BID_PRTCP_ATCH,
      uploadForm(file, { pbancNo }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰참가 첨부서류 삭제. */
  async removeOvsBidPrtcpAtchDoc(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.delete<void, void>(EP.OVS_BID_PRTCP_ATCH_ITEM(id))
  },

  /** 국외 서약서(청렴서약) 조회. */
  async getOvsProbWrotAgre(wrotId: string): Promise<OvsProbWrotAgreResultInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsProbWrotAgre)
    return apiClient.get<OvsProbWrotAgreResultInfo, OvsProbWrotAgreResultInfo>(
      EP.OVS_PROB_WROT(wrotId),
    )
  },

  /** 국외 서약서 저장(동의). */
  async saveOvsProbWrotAgre(wrotId: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_PROB_WROT(wrotId), {})
  },

  /** 국외 서약서 동의 선택(라디오 변경 즉시). */
  async setOvsWrotChoice(wrotId: string, choice: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.put<void, void>(EP.OVS_PROB_WROT_CHOICE(wrotId), { choice })
  },

  /** 국외 입찰참가신청서 등록 — 성공 시 접수번호/일시 반환. */
  async registerOvsBidPrtcpAply(pbancNo: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>(EP.OVS_BID_PRTCP_APLY, { pbancNo })
  },

  /** 국외 입찰보증서 상세 조회. */
  async getOvsBidWtgrDtl(wtgrNo: string): Promise<OvsBidWtgrInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidWtgrInfo)
    return apiClient.get<OvsBidWtgrInfo, OvsBidWtgrInfo>(EP.OVS_WTGR_DTL(wtgrNo))
  },

  /** 국외 입찰보증서 목록 조회. */
  async getOvsBidWtgrList(): Promise<OvsBidWtgrItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidWtgrList)
    return apiClient.get<OvsBidWtgrItem[], OvsBidWtgrItem[]>(EP.OVS_WTGR_LIST)
  },

  /** 국외 입찰업체 정보 조회(업체코드). */
  async getOvsSplyInfo(splyBzentyCd: string): Promise<OvsSplyInfo> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsSplyInfo)
    return apiClient.get<OvsSplyInfo, OvsSplyInfo>(EP.OVS_SPLY_INFO(splyBzentyCd))
  },

  /** 국외 연대보증서 업로드. */
  async uploadOvsGurnAgreDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      EP.OVS_GRNTE_UPLOAD,
      uploadForm(file, { prchsDmndNo, docType: 'gurnAgre' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 지급각서 업로드. */
  async uploadOvsGiveWrtprmDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      EP.OVS_GRNTE_UPLOAD,
      uploadForm(file, { prchsDmndNo, docType: 'giveWrtprm' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 보증보험 보증서 업로드. */
  async uploadOvsBidWtgrDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      EP.OVS_GRNTE_UPLOAD,
      uploadForm(file, { prchsDmndNo, docType: 'bidWtgr' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰보증금납부서 업로드. */
  async uploadOvsGrntePyslDoc(prchsDmndNo: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      EP.OVS_GRNTE_UPLOAD,
      uploadForm(file, { prchsDmndNo, docType: 'grntePysl' }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰보증금 사업목록(면제구분) 조회. */
  async getOvsBidGrnteBizList(pbancNo: string, depositType: string): Promise<OvsBidPrtcpBizItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidPrtcpBizList)
    return apiClient.get<OvsBidPrtcpBizItem[], OvsBidPrtcpBizItem[]>(EP.OVS_GRNTE_BIZ_LIST, {
      params: { pbancNo, depositType },
    })
  },

  /** 국외 입찰보증서 적용(사업에 증권 연결). */
  async applyOvsBidWtgr(pbancNo: string, prchsDmndNo: string, wtgrNo: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_WTGR_APPLY, { pbancNo, prchsDmndNo, wtgrNo })
  },

  // ── 국외 입찰결과 (MUI-BD-09-M71 · T71~T73(구 M71~M73 — v1.83 재편)) ──────────────────────────────────────

  /** 국외 입찰결과 페이지 조회(단가제/총액제는 응답 형태로 분기). */
  async getOvsBidRslt(page: number): Promise<OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidRsltUnitPriceItems)
    return apiClient.get<
      OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[],
      OvsBidRsltUnitPriceItem[] | OvsBidRsltTotalItem[]
    >(EP.OVS_BID_RSLT, { params: { page } })
  },

  // ── 국외 환율/목표가/보관함 (MUI-BD-01 · MUI-CM-01) ─────────────────────────

  /** 국외 환율정보 조회(기준일자). */
  async getExchangeRates(crtrYmd: string): Promise<OvsExchrtItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.exchrtList)
    return apiClient.get<OvsExchrtItem[], OvsExchrtItem[]>(EP.OVS_EXCHANGE_RATES, {
      params: { crtrYmd },
    })
  },

  /** 국외 목표가공개품목 목록 조회 — 목업은 전체 반환(페이지 더보기). */
  async getOvsGoalPrcRlsItemList(params?: BidListSearchRequest): Promise<OvsGoalPrcRlsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsGoalPrcRlsList)
    return apiClient.get<OvsGoalPrcRlsItem[], OvsGoalPrcRlsItem[]>(EP.OVS_GOAL_PRC_ITEMS, { params })
  },

  /** 국외 보관함 입찰품목 목록 조회 — 목업은 전체 반환(페이지 클라이언트 필터/페이징). */
  async getOvsLockerBidItemList(
    pbancNo: string,
    params?: BidListSearchRequest,
  ): Promise<OvsLockerBidItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerBidItemList)
    return apiClient.get<OvsLockerBidItem[], OvsLockerBidItem[]>(EP.OVS_LOCKER_BID_ITEMS(pbancNo), {
      params,
    })
  },

  /** 국외 보관함 품목 추가(보관함 관리 화면). */
  async addLockerItem(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_LOCKER_BID_ITEM(id), {})
  },

  /** 국외 보관함 품목 삭제(보관함 관리 화면). */
  async deleteLockerItem(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.delete<void, void>(EP.OVS_LOCKER_BID_ITEM(id))
  },

  /** 국외 보관함 공고 상세(담당자 영역) 조회. */
  async getOvsLockerPbanDtl(id: string): Promise<OvsLockerPbanItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerPbanList[0])
    return apiClient.get<OvsLockerPbanItem, OvsLockerPbanItem>(EP.OVS_LOCKER_PBAN_DTL(id))
  },

  /** 국외 보관함 공고 목록 조회 — 목업은 전체 반환(페이지 클라이언트 필터/페이징). */
  async getOvsLockerPbanList(params?: BidListSearchRequest): Promise<OvsLockerPbanItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsLockerPbanList)
    return apiClient.get<OvsLockerPbanItem[], OvsLockerPbanItem[]>(EP.OVS_LOCKER_PBAN_LIST, {
      params,
    })
  },

  // ── 국외 공개수의협상 (MUI-BD-12) ──────────────────────────────────────────

  /** 국외 공개수의협상 첨부파일 다운로드. */
  async downloadEtdcFile(id: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(`ovs-etdc-${id}`)
    return apiClient.get<Blob, Blob>(EP.OVS_ETDC_FILE(id), { responseType: 'blob' })
  },

  /** 국외 공개수의협상 견적서 취소 신청. */
  async submitOvsRlsVltrnsEtdcRtrcn(payload: { rsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_RLS_VLTRNS_ETDC_RTRCN, payload)
  },

  /** 국외 공개수의협상 견적서 품목 조회. */
  async getOvsRlsVltrnsEtdcItems(): Promise<OvsRlsVltrnsEtdcItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsEtdcItems)
    return apiClient.get<OvsRlsVltrnsEtdcItem[], OvsRlsVltrnsEtdcItem[]>(EP.OVS_RLS_VLTRNS_ETDC_ITEMS)
  },

  /** 국외 공개수의협상 견적서 제출. */
  async submitOvsRlsVltrnsEtdc(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_RLS_VLTRNS_ETDC(id), {})
  },

  /** 국외 공개수의협상 품목정보 조회. */
  async getOvsRlsVltrnsItems(): Promise<OvsRlsVltrnsItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsItems)
    return apiClient.get<OvsRlsVltrnsItem[], OvsRlsVltrnsItem[]>(EP.OVS_RLS_VLTRNS_ITEMS)
  },

  /** 국외 공개수의협상 첨부서류 조회. */
  async getOvsRlsVltrnsAtchDocs(): Promise<OvsRlsVltrnsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsAtchDocs)
    return apiClient.get<OvsRlsVltrnsAtchDoc[], OvsRlsVltrnsAtchDoc[]>(EP.OVS_RLS_VLTRNS_ATCH_DOCS)
  },

  /** 국외 공개수의협상 심사결과 조회. */
  async getOvsRlsVltrnsSrngRslt(): Promise<OvsRlsVltrnsSrngRsltItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsRlsVltrnsSrngRslt)
    return apiClient.get<OvsRlsVltrnsSrngRsltItem[], OvsRlsVltrnsSrngRsltItem[]>(
      EP.OVS_RLS_VLTRNS_SRNG_RSLT,
    )
  },

  // ── 국외 임시입찰내역/이전공고 (MUI-BD-01-M76 · T75·T76 · P79(구 M76~M79 — v1.83 재편)) ─────────────────────────

  /** 국외 임시입찰내역 문서 업로드(품목대체/MOQ). */
  async uploadOvsBidCnDoc(
    frcptlArtclNo: string,
    field: 'itemSbstDocEn' | 'moqDocEn',
    file: File,
  ): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      EP.OVS_BID_CN_DOC,
      uploadForm(file, { frcptlArtclNo, field }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 통화 목록 조회(달러환산율 포함). */
  async getCrncList(): Promise<CrncOption[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.crncOptions)
    return apiClient.get<CrncOption[], CrncOption[]>(EP.OVS_CRNC_LIST)
  },

  /** 국외 입찰업체 목록 조회(셀렉트 옵션). */
  async getOvsBidBzentyList(): Promise<BidSelectOption[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsBidBzentyOptions)
    return apiClient.get<BidSelectOption[], BidSelectOption[]>(EP.OVS_BID_BZENTY_LIST)
  },

  /** 국외 임시입찰내역 저장(단가제=행 배열 · 총액제=단건). */
  async saveOvsTmprBidCn(
    intgRfrncNo: string,
    payload: ItitbBidCnItem[] | AlonbsBidCnInfo,
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_TMPR_BID_CN(intgRfrncNo), payload)
  },

  /** 국외 임시입찰내역 삭제(단가제=선택 항목번호 · 총액제=전체). */
  async deleteOvsTmprBidCn(intgRfrncNo: string, checkedNos?: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.delete<void, void>(EP.OVS_TMPR_BID_CN(intgRfrncNo), {
      params: { checkedNos },
    })
  },

  /** 국외 이전공고 입찰내역 불러오기(통합참조번호). */
  async getOvsBfrPbancBidCnList(intgRfrncNo: string): Promise<BfrPbancBidCnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancBidCnList)
    return apiClient.get<BfrPbancBidCnItem[], BfrPbancBidCnItem[]>(EP.OVS_BFR_PBANC_BID_CN(intgRfrncNo))
  },

  /** 국외 이전공고 보관함목록 조회(보관함 ID). */
  async getBfrPbancLockerList(lockerId: string): Promise<BfrPbancInfoItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancLockerList)
    return apiClient.get<BfrPbancInfoItem[], BfrPbancInfoItem[]>(EP.BFR_PBANC_LOCKER_LIST(lockerId))
  },

  /** 국외 이전공고 입찰내역목록 조회(공고번호·차수). */
  async getBfrPbancBidCnList(pbancNo: string, pbancOd: string): Promise<BfrPbancBidCnItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.bfrPbancBidCnList)
    return apiClient.get<BfrPbancBidCnItem[], BfrPbancBidCnItem[]>(EP.BFR_PBANC_BID_CN(pbancNo), {
      params: { pbancOd },
    })
  },

  /** 국외 이전공고 입찰내역 불러오기(선택 항목 적재). */
  async loadBfrPbancBidCn(
    pbancNo: string,
    pbancOd: string,
    items: BfrPbancBidCnItem[],
  ): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.BFR_PBANC_BID_CN_LOAD(pbancNo), { pbancOd, items })
  },

  // ── 국외 입찰서 상세/제출 (MUI-BD-06) ──────────────────────────────────────

  /** 국외 입찰취소(투찰취소) 신청. */
  async submitOvsBidRtrcn(payload: { rsn: string; pbancNo?: string }): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.OVS_BID_RTRCN, payload)
  },

  /** 국외 입찰서 상세 조회. */
  async getOvsTndrDtl(id: string): Promise<OvsTndrDtlItem> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrDetail)
    return apiClient.get<OvsTndrDtlItem, OvsTndrDtlItem>(EP.OVS_TNDR_DTL(id))
  },

  /** 국외 입찰서 입찰참여품목 페이지 조회. */
  async getOvsTndrItemList(
    page: number,
    pbancNo?: string,
    pbancOd?: string,
  ): Promise<OvsTndrItitbItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrItitbItems)
    return apiClient.get<OvsTndrItitbItem[], OvsTndrItitbItem[]>(EP.OVS_TNDR_ITEMS, {
      params: { page, pbancNo, pbancOd },
    })
  },

  /** 국외 입찰서 첨부문서 목록 조회. */
  async getOvsTndrDocList(): Promise<OvsTndrDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsTndrDocList)
    return apiClient.get<OvsTndrDoc[], OvsTndrDoc[]>(EP.OVS_TNDR_DOCS)
  },

  /** 국외 입찰서 첨부문서 다운로드. */
  async downloadOvsTndrDoc(atchFileNm: string): Promise<Blob> {
    if (USE_MOCK) return mockBlob(atchFileNm)
    return apiClient.get<Blob, Blob>(EP.OVS_TNDR_DOC_FILE(atchFileNm), { responseType: 'blob' })
  },

  /** 국외 입찰서 제출(투찰) — 성공 시 접수번호/일시 반환. */
  async submitOvsTndr(pbancNo: string, pbancOd: string): Promise<BidAplyReceipt> {
    if (USE_MOCK) return mockDelay(MOCK_BD.receipt)
    return apiClient.post<BidAplyReceipt, BidAplyReceipt>(EP.OVS_TNDR_SUBMIT, { pbancNo, pbancOd })
  },

  /** 국외 입찰서 첨부문서 조회(품목대체/MOQ 팝업). */
  async getOvsAtchDoc(frcptlArtclNo: string, invtNo: string): Promise<OvsAtchDoc[]> {
    if (USE_MOCK) return mockDelay(MOCK_BD.ovsAtchDocList)
    return apiClient.get<OvsAtchDoc[], OvsAtchDoc[]>(EP.OVS_ATCH_DOC, {
      params: { frcptlArtclNo, invtNo },
    })
  },

  /** 국외 입찰서 파일 업로드 — 서버 발급 UploadedFile 반환. */
  async uploadOvsTndrFile(pbancNo: string, pbancOd: string, file: File): Promise<UploadedFile> {
    if (USE_MOCK) return mockUpload(file)
    return apiClient.post<UploadedFile, UploadedFile>(
      EP.OVS_TNDR_FILE,
      uploadForm(file, { pbancNo, pbancOd }),
      { headers: { 'Content-Type': undefined } },
    )
  },

  /** 국외 입찰서 파일 삭제. */
  async removeOvsTndrFile(id: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.delete<void, void>(EP.OVS_TNDR_FILE_ITEM(id))
  },
}
