import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/ui/common/layout/AppLayout'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { ErrorPage } from '@/ui/biz/cm/error/ErrorPage'
import { ROUTES } from '@/constants/routes'
import { LINKED_MENU_LABELS } from '@/constants/menuLabels'

// frontend-architecture.md §5 — 라우트 정의 단일 파일
// 모든 페이지는 React.lazy 로 코드 스플리팅 — 첫 진입 시 해당 페이지 chunk 만 다운로드.
// 페이지가 named export 이므로 .then(m => ({ default: m.X })) 로 default 매핑 필요.
const HomePage = lazy(() =>
  import('@/ui/biz/cm/home/HomePage').then((m) => ({ default: m.HomePage })),
)
// 조달계획 통합목록(MUI-OP-01-M01, 설계서 p.8) — biz/op/prcmPlanIntgList.
const PrcmPlanIntgListPage = lazy(() =>
  import('@/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage').then((m) => ({
    default: m.PrcmPlanIntgListPage,
  })),
)
// 조달계획 상세(MUI-OP-01-M03, /op/:id) — biz/op/prcmPlanDtl.
const PrcmPlanDtlPage = lazy(() =>
  import('@/ui/biz/op/prcmPlanDtl/PrcmPlanDtlPage').then((m) => ({
    default: m.PrcmPlanDtlPage,
  })),
)
// 사전규격 상세(MUI-OP-01-M11, /op/spec/:id) — biz/op/bfhdSpcfctDtl.
const BfhdSpcfctDtlPage = lazy(() =>
  import('@/ui/biz/op/bfhdSpcfctDtl/BfhdSpcfctDtlPage').then((m) => ({
    default: m.BfhdSpcfctDtlPage,
  })),
)
// 국외 조달계획 상세(MUI-OP-01-M73, /op/ovs/:id) — biz/op/ovsPrcmPlanDtl.
const OvsPrcmPlanDtlPage = lazy(() =>
  import('@/ui/biz/op/ovsPrcmPlanDtl/OvsPrcmPlanDtlPage').then((m) => ({
    default: m.OvsPrcmPlanDtlPage,
  })),
)
// 입찰공고 통합목록(MUI-BD-01-M01, /bd) — biz/bd/bidPbancIntgList.
const BidPbancIntgListPage = lazy(() =>
  import('@/ui/biz/bd/bidPbancIntgList/BidPbancIntgListPage').then((m) => ({
    default: m.BidPbancIntgListPage,
  })),
)
// 입찰진행 목록(MUI-BD-03-M01, /bd/prgrs) — biz/bd/bidPrgrsListForBzenty.
const BidPrgrsListForBzentyPage = lazy(() =>
  import('@/ui/biz/bd/bidPrgrsListForBzenty/BidPrgrsListForBzentyPage').then((m) => ({
    default: m.BidPrgrsListForBzentyPage,
  })),
)
// 입찰진행 상세(MUI-BD-03-M02, /bd/prgrs/:id) — biz/bd/bidPrgsDtlInq.
const BidPrgsDtlInqPage = lazy(() =>
  import('@/ui/biz/bd/bidPrgsDtlInq/BidPrgsDtlInqPage').then((m) => ({
    default: m.BidPrgsDtlInqPage,
  })),
)
// 입찰등록심사 결과조회(MUI-BD-03-M05, /bd/reg-rslt) — biz/bd/bidRegRsltInq.
const BidRegRsltInqPage = lazy(() =>
  import('@/ui/biz/bd/bidRegRsltInq/BidRegRsltInqPage').then((m) => ({
    default: m.BidRegRsltInqPage,
  })),
)
// 사전심사(PQ) 결과조회(MUI-BD-02-M02, /bd/srng-rslt) — biz/bd/bfhdSrngRsltInq.
const BfhdSrngRsltInqPage = lazy(() =>
  import('@/ui/biz/bd/bfhdSrngRsltInq/BfhdSrngRsltInqPage').then((m) => ({
    default: m.BfhdSrngRsltInqPage,
  })),
)
// 서약서동의(MUI-BD-04-M01, /bd/prgrs/:id/apfr) — biz/bd/wrotAgrePage. 입찰참가신청서 진입(서약서 스텝). P02/P03/P04 서약서 호스트.
const WrotAgrePage = lazy(() =>
  import('@/ui/biz/bd/wrotAgrePage/WrotAgrePage').then((m) => ({
    default: m.WrotAgrePage,
  })),
)
// 입찰참가신청서작성 신청서(MUI-BD-04-M05~M14, /bd/prgrs/:id/apfr/form) — biz/bd/bidPrtcpAperWrt. 7탭 + 등록반려/반려신청조회(P07) 호스트.
const BidPrtcpAperWrtPage = lazy(() =>
  import('@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage').then((m) => ({
    default: m.BidPrtcpAperWrtPage,
  })),
)
// 입찰서(견적서) 작성(MUI-BD-06-M01~M07, /bd/prgrs/:id/tndr-wrt) — biz/bd/tndrWrt. 7탭 마법사(일반정보~약관동의). 신청 → 전자서명 → 신청완료.
const TndrWrtPage = lazy(() =>
  import('@/ui/biz/bd/tndrWrt/TndrWrtPage').then((m) => ({ default: m.TndrWrtPage })),
)
// 전자서명(MUI-BD-04-M21, /bd/prgrs/:id/elsgn) — biz/bd/elsgn. 사전심사/입찰참가/입찰서 공용 전자서명. 견적서작성하기·신청서 제출 → 이 화면 → 신청완료.
const ElsgnPage = lazy(() =>
  import('@/ui/biz/bd/elsgn/ElsgnPage').then((m) => ({ default: m.ElsgnPage })),
)
// 신청 완료(MUI-BD-06-M08, /bd/prgrs/:id/aply-cmptn) — biz/bd/aplyCmptn. 전자서명 완료 후 작성완료 표시(유형별 텍스트).
const AplyCmptnPage = lazy(() =>
  import('@/ui/biz/bd/aplyCmptn/AplyCmptnPage').then((m) => ({ default: m.AplyCmptnPage })),
)
// 사전심사(PQ)신청(MUI-BD-02-M01, /bd/bfhd-srng-aply) — biz/bd/bfhdSrngAply.
const BfhdSrngAplyPage = lazy(() =>
  import('@/ui/biz/bd/bfhdSrngAply/BfhdSrngAplyPage').then((m) => ({
    default: m.BfhdSrngAplyPage,
  })),
)
// 입찰공고 상세(MUI-BD-01-M07~M12, /bd/:id) — biz/bd/bidPbancDtl.
const BidPbancDtlPage = lazy(() =>
  import('@/ui/biz/bd/bidPbancDtl/BidPbancDtlPage').then((m) => ({
    default: m.BidPbancDtlPage,
  })),
)
// 개찰목록(MUI-BD-08-M01, /bd/opbid) — biz/bd/bdopnList.
const BdopnListPage = lazy(() =>
  import('@/ui/biz/bd/bdopnList/BdopnListPage').then((m) => ({
    default: m.BdopnListPage,
  })),
)
// 입찰결과상세(개찰상세, MUI-BD-09-M01~M04, /bd/result/:id) — biz/bd/bidRsltDtl.
const BidRsltDtlPage = lazy(() =>
  import('@/ui/biz/bd/bidRsltDtl/BidRsltDtlPage').then((m) => ({
    default: m.BidRsltDtlPage,
  })),
)
// 이행/적격심사상세(MUI-BD-10-M01~M04, /bd/implt/:id) — biz/bd/bidRsltDtl. 입찰결과상세 > 이행적격심사 신청하기 진입.
const ImpltPage = lazy(() =>
  import('@/ui/biz/bd/bidRsltDtl/ImpltPage').then((m) => ({
    default: m.ImpltPage,
  })),
)
// 국외 입찰결과조회 상세(단가제, MUI-BD-09-M71·M72, /bd/ovs/result/:id) — biz/bd/ovsBidRsltDtl. 개찰목록 국외(단가제) 카드 진입.
const OvsBidRsltDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsBidRsltDtl/OvsBidRsltDtlPage').then((m) => ({
    default: m.OvsBidRsltDtlPage,
  })),
)
// 국외 공개수의협상계획상세(MUI-BD-12-M71·T71~T73, /bd/ovs/rls-ngtn/:id) — biz/bd/ovsRlsVltrnsNgtnPlanDtl. 개찰목록 국외·수의계약 카드 진입.
const OvsRlsVltrnsNgtnPlanDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtlPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnPlanDtlPage,
  })),
)
// 국외 공개수의협상 견적서 작성(4스텝, MUI-BD-12-M74~M77, /bd/ovs/rls-ngtn/:id/etdc) — biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage. 계획상세 바로가기 진입.
const OvsRlsVltrnsNgtnEtdcSbmsnPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsnPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnEtdcSbmsnPage,
  })),
)
// 국외 공개수의협상 견적서 조회(상세 읽기, MUI-BD-12-M78~M81, /bd/ovs/rls-ngtn/:id/etdc-dtl) — biz/bd/ovsRlsVltrnsNgtnEtdcDtl. 계획상세 바로가기 진입.
const OvsRlsVltrnsNgtnEtdcDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtlPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnEtdcDtlPage,
  })),
)
// 국외 공개수의협상 결과조회(MUI-BD-12-M83, /bd/ovs/rls-ngtn/:id/rslt) — biz/bd/ovsRlsVltrnsNgtnSrngRsltInq. 견적서 상세 바로가기 진입.
const OvsRlsVltrnsNgtnSrngRsltInqPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnSrngRsltInq/OvsRlsVltrnsNgtnSrngRsltInqPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnSrngRsltInqPage,
  })),
)
// 국외 입찰공고 상세(MUI-BD-01-M71~M73, /bd/ovs/:id) — biz/bd/ovsBidPbancDtl.
const OvsBidPbancDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsBidPbancDtl/OvsBidPbancDtlPage').then((m) => ({
    default: m.OvsBidPbancDtlPage,
  })),
)
// 목표가공개품목조회(MUI-BD-01-M75, /bd/ovs/goal-prc-items) — biz/bd/ovsGoalPrcRlsItemList.
const OvsGoalPrcRlsItemListPage = lazy(() =>
  import('@/ui/biz/bd/ovsGoalPrcRlsItemList/OvsGoalPrcRlsItemListPage').then((m) => ({
    default: m.OvsGoalPrcRlsItemListPage,
  })),
)
// 국외 보관함 목록(MUI-CM-01-M71, /bd/ovs/locker) — biz/bd/ovsLockerPbanList.
const OvsLockerPbanListPage = lazy(() =>
  import('@/ui/biz/bd/ovsLockerPbanList/OvsLockerPbanListPage').then((m) => ({
    default: m.OvsLockerPbanListPage,
  })),
)
// 국외 보관함 상세(MUI-CM-01-M72, /bd/ovs/locker/:id) — biz/bd/ovsLockerPbanDtl.
const OvsLockerPbanDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsLockerPbanDtl/OvsLockerPbanDtlPage').then((m) => ({
    default: m.OvsLockerPbanDtlPage,
  })),
)
// 보관함 품목 관리(MUI-CM-01-M73, /bd/ovs/locker/:id/items) — biz/bd/ovsLockerItemReg.
const OvsLockerItemRegPage = lazy(() =>
  import('@/ui/biz/bd/ovsLockerItemReg/OvsLockerItemRegPage').then((m) => ({
    default: m.OvsLockerItemRegPage,
  })),
)
// 입찰내역 작성(MUI-BD-01-M76~M78, /bd/ovs/locker/:id/bid-cn) — biz/bd/ovsTmprBidCnReg. 단가제/총액제 분기.
const OvsTmprBidCnRegPage = lazy(() =>
  import('@/ui/biz/bd/ovsTmprBidCnReg/OvsTmprBidCnRegPage').then((m) => ({
    default: m.OvsTmprBidCnRegPage,
  })),
)
// 이전공고입찰내역등록(MUI-BD-01-M79, /bd/ovs/locker/:id/bfr-bid-cn) — biz/bd/ovsBfrTmprBidBidCnReg.
const OvsBfrTmprBidBidCnRegPage = lazy(() =>
  import('@/ui/biz/bd/ovsBfrTmprBidBidCnReg/OvsBfrTmprBidBidCnRegPage').then((m) => ({
    default: m.OvsBfrTmprBidBidCnRegPage,
  })),
)
// 국외 입찰참가신청서 작성(MUI-BD-04-M71~M77, /bd/ovs/prgrs/:id/aply) — biz/bd/ovsBidPrtcpAply. 서약서 → 신청서 4탭 마법사.
const OvsBidPrtcpAplyPage = lazy(() =>
  import('@/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAplyPage').then((m) => ({
    default: m.OvsBidPrtcpAplyPage,
  })),
)
// 국외 입찰참가신청서 상세(MUI-BD-04-M78~M81, /bd/ovs/prgrs/:id/apfr) — biz/bd/ovsBidPrtcpApfrDtl.
const OvsBidPrtcpApfrDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsBidPrtcpApfrDtl/OvsBidPrtcpApfrDtlPage').then((m) => ({
    default: m.OvsBidPrtcpApfrDtlPage,
  })),
)
// 국외 입찰서제출(MUI-BD-06-M71~M74, /bd/ovs/prgrs/:id/tndr-sbmsn) — biz/bd/ovsTndrSbmsn. 3스탭 마법사.
const OvsTndrSbmsnPage = lazy(() =>
  import('@/ui/biz/bd/ovsTndrSbmsn/OvsTndrSbmsnPage').then((m) => ({
    default: m.OvsTndrSbmsnPage,
  })),
)
// 국외 입찰서 상세(MUI-BD-06-M75~M79, /bd/ovs/prgrs/:id/tndr) — biz/bd/ovsTndrDtl.
const OvsTndrDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsTndrDtl/OvsTndrDtlPage').then((m) => ({
    default: m.OvsTndrDtlPage,
  })),
)
const NotiPrstPage = lazy(() =>
  import('@/ui/biz/cm/notiPrst/NotiPrstPage').then((m) => ({
    default: m.NotiPrstPage,
  })),
)
const SupportPage = lazy(() =>
  import('@/ui/biz/cm/support/SupportPage').then((m) => ({ default: m.SupportPage })),
)
// 고객센터 게시판 목록(MUI-CM-04) — 공지사항(일반/방위사업청/수요부대별) · 자료실(일반/수요부대별/계약관련서식) · 시스템개선안내.
const NoticeListPage = lazy(() =>
  import('@/ui/biz/cm/noticeList/NoticeListPage').then((m) => ({ default: m.NoticeListPage })),
)
const NoticeDtlPage = lazy(() =>
  import('@/ui/biz/cm/noticeDtl/NoticeDtlPage').then((m) => ({ default: m.NoticeDtlPage })),
)
const D2bNoticeDtlPage = lazy(() =>
  import('@/ui/biz/cm/noticeDtl/D2b_NoticeDtlPage').then((m) => ({ default: m.D2b_NoticeDtlPage })),
)
const DmdfrcNoticeDtlPage = lazy(() =>
  import('@/ui/biz/cm/noticeDtl/Dmdfrc_NoticeDtlPage').then((m) => ({
    default: m.Dmdfrc_NoticeDtlPage,
  })),
)
const RpstrDtlPage = lazy(() =>
  import('@/ui/biz/cm/rpstrDtl/RpstrDtl').then((m) => ({ default: m.RpstrDtl })),
)
const DmdfrcRpstrDtlPage = lazy(() =>
  import('@/ui/biz/cm/rpstrDtl/Dmdfrc_rpstrDtl').then((m) => ({ default: m.Dmdfrc_rpstrDtl })),
)
const CtrtRpstrDtlPage = lazy(() =>
  import('@/ui/biz/cm/rpstrDtl/Ctrt_rpstrDtl').then((m) => ({ default: m.Ctrt_rpstrDtl })),
)
const SysImpvRpstrDtlPage = lazy(() =>
  import('@/ui/biz/cm/rpstrDtl/SysImpv_rpstrDtl').then((m) => ({ default: m.SysImpv_rpstrDtl })),
)
const D2bNoticeListPage = lazy(() =>
  import('@/ui/biz/cm/noticeList/D2b_NoticeListPage').then((m) => ({ default: m.D2b_NoticeListPage })),
)
const DmdfrcNoticeListPage = lazy(() =>
  import('@/ui/biz/cm/noticeList/Dmdfrc_NoticeListPage').then((m) => ({
    default: m.Dmdfrc_NoticeListPage,
  })),
)
const RpstrListPage = lazy(() =>
  import('@/ui/biz/cm/rpstrList/RpstrList').then((m) => ({ default: m.RpstrList })),
)
const DmdfrcRpstrListPage = lazy(() =>
  import('@/ui/biz/cm/rpstrList/Dmdfrc_rpstrList').then((m) => ({ default: m.Dmdfrc_rpstrList })),
)
const CtrtRpstrListPage = lazy(() =>
  import('@/ui/biz/cm/rpstrList/Ctrt_rpstrList').then((m) => ({ default: m.Ctrt_rpstrList })),
)
const SysImpvRpstrListPage = lazy(() =>
  import('@/ui/biz/cm/rpstrList/SysImpv_rpstrList').then((m) => ({ default: m.SysImpv_rpstrList })),
)
// 자주묻는질문(FAQ, MUI-CM-04-M03, /support/faq) — biz/cm/faqList.
const FaqListPage = lazy(() =>
  import('@/ui/biz/cm/faqList/FaqListPage').then((m) => ({ default: m.FaqListPage })),
)
// 인증센터(MUI-CM-04-M13, /cert) — biz/cm/certMng. 홈 유관기관 바로가기 진입.
const CertMngPage = lazy(() =>
  import('@/ui/biz/cm/certMng/CertMngPage').then((m) => ({ default: m.CertMngPage })),
)
// 인증서 관리(MUI-CM-04-M14, /cert/manage) — biz/cm/crtfMng. 인증센터 > 인증서 관리.
const CrtfMngPage = lazy(() =>
  import('@/ui/biz/cm/crtfMng/CrtfMngPage').then((m) => ({ default: m.CrtfMngPage })),
)
// 인증서 가져오기(MUI-CM-04-M16, /cert/receive) — biz/cm/crtfReceive.
const CrtfReceivePage = lazy(() =>
  import('@/ui/biz/cm/crtfReceive/CrtfReceivePage').then((m) => ({ default: m.CrtfReceivePage })),
)
// 인증서 내보내기(MUI-CM-04-M17, /cert/send) — biz/cm/crtfSend.
const CrtfSendPage = lazy(() =>
  import('@/ui/biz/cm/crtfSend/CrtfSendPage').then((m) => ({ default: m.CrtfSendPage })),
)
// 시스템소개(MUI-CM-05-M01, /intro/system) — biz/cm/introduce. 국방전자조달 소개 > 시스템소개.
const IntroducePage = lazy(() =>
  import('@/ui/biz/cm/introduce/IntroducePage').then((m) => ({ default: m.IntroducePage })),
)
// 주요특징(MUI-CM-05-M02, /intro/feature) — biz/cm/feature.
const FeaturePage = lazy(() =>
  import('@/ui/biz/cm/feature/FeaturePage').then((m) => ({ default: m.FeaturePage })),
)
// 연혁(MUI-CM-05-M03, /intro/history) — biz/cm/history.
const HistoryPage = lazy(() =>
  import('@/ui/biz/cm/history/HistoryPage').then((m) => ({ default: m.HistoryPage })),
)
// 관련시스템(MUI-CM-05-M05, /intro/related) — biz/cm/system.
const SystemPage = lazy(() =>
  import('@/ui/biz/cm/system/SystemPage').then((m) => ({ default: m.SystemPage })),
)
// 사전준비사항(MUI-CM-05-M07, /guide/preparation01) — biz/cm/preparation01. 이용안내 > 조달사전준비안내.
const Preparation01Page = lazy(() =>
  import('@/ui/biz/cm/preparation01/Preparation01Page').then((m) => ({
    default: m.Preparation01Page,
  })),
)
// 국방조달참여절차(MUI-CM-05-M09, /guide/domestic01) — biz/cm/domestic01. 이용안내 > 국내조달안내.
const Domestic01Page = lazy(() =>
  import('@/ui/biz/cm/domestic01/Domestic01Page').then((m) => ({
    default: m.Domestic01Page,
  })),
)
// 국외조달원 등록절차(MUI-CM-05-M12, /guide/foreign01) — biz/cm/foreign01. 이용안내 > 국외조달안내.
const Foreign01Page = lazy(() =>
  import('@/ui/biz/cm/foreign01/Foreign01Page').then((m) => ({
    default: m.Foreign01Page,
  })),
)
// 이용문의(MUI-CM-05-M06, /intro/inquiry) — biz/cm/inquiry.
const InquiryPage = lazy(() =>
  import('@/ui/biz/cm/inquiry/InquiryPage').then((m) => ({ default: m.InquiryPage })),
)
// 연관 진행 목록(설계서 미정의 — 진행현황 시트 세부단계 클릭 진입, /anl-prgrs) — biz/cm/anlPrgrsList.
const AnlPrgrsListPage = lazy(() =>
  import('@/ui/biz/cm/anlPrgrsList/AnlPrgrsListPage').then((m) => ({
    default: m.AnlPrgrsListPage,
  })),
)
const MyPage = lazy(() => import('@/ui/biz/cm/mypage/MyPage').then((m) => ({ default: m.MyPage })))
const ComponentGuidePage = lazy(() =>
  import('@/ui/dev/ComponentGuidePage').then((m) => ({
    default: m.ComponentGuidePage,
  })),
)

// '/' 레이아웃 라우트 아래에 페이지들을 children 으로 배치.
// Suspense(로딩)는 AppLayout 내부에서, 에러(청크 로드 실패·렌더 throw·404)는
// errorElement(ErrorPage)가 라우트 레벨에서 처리한다.
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      // BottomNav 노출 = 홈/알림/고객센터/마이페이지 4개 메뉴에만(showBottomNav).
      { index: true, element: <HomePage />, handle: { showBottomNav: true } },
      // 2뎁스 이하 = variant:'sub' → 메인바(로고+로그인/로그아웃+알림+전체메뉴) 아래 타이틀바(뒤로+타이틀) 추가.
      // (2026-07-06 2단 헤더 전환 — 구 util:'home'|'search' 는 deprecated, 지정 금지)
      {
        path: 'op',
        element: <PrcmPlanIntgListPage />,
        // 목록 → 상세 → 뒤로 시 스크롤 복원 대신 항상 맨 위(scrollReset).
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.OP] },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'bd',
        element: <BidPbancIntgListPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.BD] },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'bd/opbid',
        element: <BdopnListPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.BD_OPBID] },
        },
      },
      {
        path: 'bd/prgrs',
        element: <BidPrgrsListForBzentyPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.BD_PRGRS] },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'bd/prgrs/:id',
        element: <BidPrgsDtlInqPage />,
        handle: { header: { variant: 'sub', title: '입찰진행 상세' } },
      },
      {
        path: 'bd/prgrs/:id/apfr',
        element: <WrotAgrePage />,
        handle: { header: { variant: 'sub', title: '입찰참가신청서' } },
      },
      {
        path: 'bd/prgrs/:id/apfr/form',
        element: <BidPrtcpAperWrtPage />,
        handle: { header: { variant: 'sub', title: '입찰참가신청서' } },
      },
      {
        path: 'bd/prgrs/:id/tndr-wrt',
        element: <TndrWrtPage />,
        handle: { header: { variant: 'sub', title: '입찰서 작성' } },
      },
      {
        path: 'bd/prgrs/:id/elsgn',
        element: <ElsgnPage />,
        handle: { header: { variant: 'sub', title: '전자서명' } },
      },
      {
        path: 'bd/prgrs/:id/aply-cmptn',
        element: <AplyCmptnPage />,
        handle: { header: { variant: 'sub', title: '신청완료' } },
      },
      {
        path: 'bd/bfhd-srng-aply',
        element: <BfhdSrngAplyPage />,
        handle: { header: { variant: 'sub', title: '사전심사신청' } },
      },
      {
        path: 'bd/reg-rslt',
        element: <BidRegRsltInqPage />,
        handle: { header: { variant: 'sub', title: '입찰등록심사 결과조회' } },
      },
      {
        path: 'bd/srng-rslt',
        element: <BfhdSrngRsltInqPage />,
        handle: { header: { variant: 'sub', title: '사전심사(PQ) 결과조회' } },
      },
      {
        path: 'bd/result/:id',
        element: <BidRsltDtlPage />,
        handle: { header: { variant: 'sub', title: '입찰결과 상세' } },
      },
      {
        path: 'bd/implt/:id',
        element: <ImpltPage />,
        handle: { header: { variant: 'sub', title: '이행/적격심사' } },
      },
      {
        // 국외 입찰결과조회 상세(단가제) — 정적 'ovs/result' 세그먼트가 bd/:id·bd/ovs/:id 보다 먼저 매칭.
        path: 'bd/ovs/result/:id',
        element: <OvsBidRsltDtlPage />,
        handle: { header: { variant: 'sub', title: '입찰결과 조회' } },
      },
      {
        // 국외 공개수의협상계획상세 — 정적 'ovs/rls-ngtn' 세그먼트가 bd/:id·bd/ovs/:id 보다 먼저 매칭.
        path: 'bd/ovs/rls-ngtn/:id',
        element: <OvsRlsVltrnsNgtnPlanDtlPage />,
        handle: { header: { variant: 'sub', title: '공개수의협상 계획상세' } },
      },
      {
        // 공개수의협상 견적서 작성(4스텝) — 정적 'etdc' 세그먼트가 :id 보다 먼저 매칭. 헤더 타이틀 '견적서 작성'.
        path: 'bd/ovs/rls-ngtn/:id/etdc',
        element: <OvsRlsVltrnsNgtnEtdcSbmsnPage />,
        handle: { header: { variant: 'sub', title: '견적서 작성' } },
      },
      {
        // 공개수의협상 견적서 조회(상세 읽기, 4탭) — 정적 'etdc-dtl' 세그먼트. 헤더 타이틀 '견적서 조회'.
        path: 'bd/ovs/rls-ngtn/:id/etdc-dtl',
        element: <OvsRlsVltrnsNgtnEtdcDtlPage />,
        handle: { header: { variant: 'sub', title: '견적서 조회' } },
      },
      {
        // 공개수의협상 결과조회 — 정적 'rslt' 세그먼트. 헤더 타이틀 '공개수의협상 결과조회'.
        path: 'bd/ovs/rls-ngtn/:id/rslt',
        element: <OvsRlsVltrnsNgtnSrngRsltInqPage />,
        handle: { header: { variant: 'sub', title: '공개수의협상 결과조회' } },
      },
      {
        path: 'bd/:id',
        element: <BidPbancDtlPage />,
        handle: { header: { variant: 'sub', title: '입찰공고 상세' } },
      },
      // ── 국외 입찰(bd/ovs) — 정적 세그먼트(goal-prc-items·locker·prgrs)가 :id 보다 먼저 매칭됨 ──
      {
        path: 'bd/ovs/goal-prc-items',
        element: <OvsGoalPrcRlsItemListPage />,
        handle: {
          header: { variant: 'sub', title: '목표가공개품목조회' },
          scrollReset: true,
        },
      },
      {
        path: 'bd/ovs/locker',
        element: <OvsLockerPbanListPage />,
        handle: {
          header: { variant: 'sub', title: '국외 보관함' },
          scrollReset: true,
        },
      },
      {
        path: 'bd/ovs/locker/:id',
        element: <OvsLockerPbanDtlPage />,
        handle: { header: { variant: 'sub', title: '국외 보관함 상세' } },
      },
      {
        path: 'bd/ovs/locker/:id/items',
        element: <OvsLockerItemRegPage />,
        handle: {
          header: { variant: 'sub', title: '보관함 품목 관리' },
          scrollReset: true,
        },
      },
      {
        path: 'bd/ovs/locker/:id/bid-cn',
        element: <OvsTmprBidCnRegPage />,
        handle: { header: { variant: 'sub', title: '입찰내역 작성' } },
      },
      {
        path: 'bd/ovs/locker/:id/bfr-bid-cn',
        element: <OvsBfrTmprBidBidCnRegPage />,
        handle: { header: { variant: 'sub', title: '이전공고입찰내역등록' } },
      },
      {
        path: 'bd/ovs/prgrs/:id/aply',
        element: <OvsBidPrtcpAplyPage />,
        handle: { header: { variant: 'sub', title: '입찰참가신청서' } },
      },
      {
        path: 'bd/ovs/prgrs/:id/apfr',
        element: <OvsBidPrtcpApfrDtlPage />,
        handle: { header: { variant: 'sub', title: '입찰참가신청서 상세' } },
      },
      {
        path: 'bd/ovs/prgrs/:id/tndr-sbmsn',
        element: <OvsTndrSbmsnPage />,
        handle: { header: { variant: 'sub', title: '입찰서제출' } },
      },
      {
        path: 'bd/ovs/prgrs/:id/tndr',
        element: <OvsTndrDtlPage />,
        handle: { header: { variant: 'sub', title: '입찰서 상세' } },
      },
      {
        path: 'bd/ovs/:id',
        element: <OvsBidPbancDtlPage />,
        handle: { header: { variant: 'sub', title: '국외 입찰공고 상세' } },
      },
      {
        path: 'op/:id',
        element: <PrcmPlanDtlPage />,
        handle: {
          header: { variant: 'sub', title: '조달계획 상세' },
        },
      },
      {
        path: 'op/spec/:id',
        element: <BfhdSpcfctDtlPage />,
        handle: { header: { variant: 'sub', title: '사전규격 상세' } },
      },
      {
        path: 'op/ovs/:id',
        element: <OvsPrcmPlanDtlPage />,
        handle: { header: { variant: 'sub', title: '국외 조달계획 상세' } },
      },
      {
        path: 'notification',
        element: <NotiPrstPage />,
        handle: { scrollReset: true, showBottomNav: true },
      },
      {
        // 연관 진행 목록 — 상세 진행현황 시트의 세부단계 클릭 진입(설계서 미정의, 화면ID 채번 대기)
        path: 'anl-prgrs',
        element: <AnlPrgrsListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '연관 목록' },
          scrollReset: true,
        },
      },
      { path: 'support', element: <SupportPage />, handle: { showBottomNav: true } },
      {
        // 일반공지사항(공지사항 목록) — 전체메뉴 고객센터 > 일반공지사항 진입(MUI-CM-04-M01)
        path: 'support/notice',
        element: <NoticeListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_NOTICE] },
          scrollReset: true,
        },
      },
      {
        // 일반공지사항 상세 — 목록 카드 클릭 진입(MUI-CM-04-M02). 정적 dapa/dmdfrc 목록이 우선 매칭됨.
        path: 'support/notice/:contsNo',
        element: <NoticeDtlPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '공지사항 상세' },
          scrollReset: true,
        },
      },
      {
        // 방위사업청공지사항 (MUI-CM-04-M21)
        path: 'support/notice/dapa',
        element: <D2bNoticeListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_NOTICE_DAPA] },
          scrollReset: true,
        },
      },
      {
        // 수요부대별공지사항 (MUI-CM-04-M23)
        path: 'support/notice/dmdfrc',
        element: <DmdfrcNoticeListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_NOTICE_DMDFRC] },
          scrollReset: true,
        },
      },
      {
        // 일반자료실 (MUI-CM-04-M25)
        path: 'support/archive',
        element: <RpstrListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_ARCHIVE] },
          scrollReset: true,
        },
      },
      {
        // 수요부대별자료실 (MUI-CM-04-M27)
        path: 'support/archive/dmdfrc',
        element: <DmdfrcRpstrListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_ARCHIVE_DMDFRC] },
          scrollReset: true,
        },
      },
      {
        // 계약관련서식자료실 (MUI-CM-04-M29)
        path: 'support/archive/ctrt',
        element: <CtrtRpstrListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_ARCHIVE_CTRT] },
          scrollReset: true,
        },
      },
      {
        // 시스템개선안내 (MUI-CM-04-M31)
        path: 'support/sys-impv',
        element: <SysImpvRpstrListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_SYS_IMPV] },
          scrollReset: true,
        },
      },
      {
        // 자주묻는질문 (MUI-CM-04-M03) — 전체메뉴 고객센터 > 자주묻는 질문 진입
        path: 'support/faq',
        element: <FaqListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_FAQ] },
          scrollReset: true,
        },
      },
      {
        // 인증센터 (MUI-CM-04-M13) — 홈 유관기관 바로가기 > 인증센터 진입
        path: 'cert',
        element: <CertMngPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '인증센터' },
          scrollReset: true,
        },
      },
      {
        // 인증서 관리 (MUI-CM-04-M14) — 인증센터/전체메뉴 > 인증서 관리 진입
        path: 'cert/manage',
        element: <CrtfMngPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '인증서 관리' },
          scrollReset: true,
        },
      },
      {
        // 인증서 가져오기 (MUI-CM-04-M16) — 인증센터/전체메뉴 > 인증서 가져오기
        path: 'cert/receive',
        element: <CrtfReceivePage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '인증서 가져오기' },
          scrollReset: true,
        },
      },
      {
        // 인증서 내보내기 (MUI-CM-04-M17) — 인증센터/전체메뉴 > 인증서 내보내기
        path: 'cert/send',
        element: <CrtfSendPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '인증서 내보내기' },
          scrollReset: true,
        },
      },
      {
        // 시스템소개 (MUI-CM-05-M01) — 전체메뉴 국방전자조달소개 > 시스템소개
        path: 'intro/system',
        element: <IntroducePage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '시스템소개' },
          scrollReset: true,
        },
      },
      {
        // 주요특징 (MUI-CM-05-M02) — 전체메뉴 국방전자조달소개 > 주요특징
        path: 'intro/feature',
        element: <FeaturePage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '주요특징' },
          scrollReset: true,
        },
      },
      {
        // 연혁 (MUI-CM-05-M03) — 전체메뉴 국방전자조달소개 > 연혁
        path: 'intro/history',
        element: <HistoryPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '연혁' },
          scrollReset: true,
        },
      },
      {
        // 관련시스템 (MUI-CM-05-M05) — 전체메뉴 국방전자조달소개 > 관련시스템
        path: 'intro/related',
        element: <SystemPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '관련시스템' },
          scrollReset: true,
        },
      },
      {
        // 이용문의 (MUI-CM-05-M06) — 전체메뉴 국방전자조달소개 > 이용문의
        path: 'intro/inquiry',
        element: <InquiryPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '이용문의' },
          scrollReset: true,
        },
      },
      {
        // 사전준비사항 (MUI-CM-05-M07) — 전체메뉴 이용안내 > 조달사전준비안내
        path: 'guide/preparation01',
        element: <Preparation01Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_PREPARATION] },
          scrollReset: true,
        },
      },
      {
        // 국방조달참여절차 (MUI-CM-05-M09) — 전체메뉴 이용안내 > 국내조달안내
        path: 'guide/domestic01',
        element: <Domestic01Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_DOMESTIC] },
          scrollReset: true,
        },
      },
      {
        // 국외조달원 등록절차 (MUI-CM-05-M12) — 전체메뉴 이용안내 > 국외조달안내
        path: 'guide/foreign01',
        element: <Foreign01Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_FOREIGN] },
          scrollReset: true,
        },
      },
      // 게시판 상세 — 목록 카드 클릭 진입. 정적 목록경로(dapa/dmdfrc/ctrt 등)가 RRv6 랭킹으로 우선 매칭됨.
      {
        // 방위사업청공지사항 상세 (MUI-CM-04-M22)
        path: 'support/notice/dapa/:contsNo',
        element: <D2bNoticeDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '방위사업청 공지사항 상세' }, scrollReset: true },
      },
      {
        // 수요부대별공지사항 상세 (MUI-CM-04-M24)
        path: 'support/notice/dmdfrc/:contsNo',
        element: <DmdfrcNoticeDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '수요부대별 공지사항 상세' }, scrollReset: true },
      },
      {
        // 일반자료실 상세 (MUI-CM-04-M26)
        path: 'support/archive/:contsNo',
        element: <RpstrDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '자료실 상세' }, scrollReset: true },
      },
      {
        // 수요부대별자료실 상세 (MUI-CM-04-M28)
        path: 'support/archive/dmdfrc/:contsNo',
        element: <DmdfrcRpstrDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '자료실 상세' }, scrollReset: true },
      },
      {
        // 계약관련서식자료실 상세 (MUI-CM-04-M30)
        path: 'support/archive/ctrt/:contsNo',
        element: <CtrtRpstrDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '자료실 상세' }, scrollReset: true },
      },
      {
        // 시스템개선안내 상세 (MUI-CM-04-M32)
        path: 'support/sys-impv/:contsNo',
        element: <SysImpvRpstrDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '시스템개선안내 상세' }, scrollReset: true },
      },
      { path: 'mypage', element: <MyPage />, handle: { showBottomNav: true } },
      // 매칭 안 되는 경로 → 404 (errorElement 가 isRouteErrorResponse 404 로 렌더)
      { path: '*', element: <ErrorPage /> },
    ],
  },
  // 개발자용 컴포넌트 가이드 — 모바일 셸(AppLayout) 밖, PC 해상도 전용.
  // lazy chunk 라서 Suspense 로 감싸고, 에러는 errorElement 로 처리.
  {
    path: ROUTES.GUIDE,
    element: (
      <Suspense fallback={<PageLoading />}>
        <ComponentGuidePage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
])
