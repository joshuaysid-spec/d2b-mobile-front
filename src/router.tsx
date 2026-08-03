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
// 앱 실행 스플래시(MUI-MS-01-M01, /splash) — 셸(AppLayout) 밖 독립 풀스크린. biz/cm/splash.
const SplashPage = lazy(() =>
  import('@/ui/biz/cm/splash/SplashPage').then((m) => ({ default: m.SplashPage })),
)
// 앱 접근권한 동의(MUI-MS-01-M02, /app-authrt-agre) — 셸 밖 풀스크린. biz/cm/appAuthrtAgre.
const AppAuthrtAgrePage = lazy(() =>
  import('@/ui/biz/cm/appAuthrtAgre/AppAuthrtAgrePage').then((m) => ({
    default: m.AppAuthrtAgrePage,
  })),
)
// 앱 이용안내(MUI-MS-01-M06, /app-guide) — 셸 밖 풀스크린. biz/cm/appSrvcExpln. (설계서 slide7 목록 기준 M06 — slide365 는 P06 표기, 문서 내 불일치)
const AppSrvcExplnPage = lazy(() =>
  import('@/ui/biz/cm/appSrvcExpln/AppSrvcExplnPage').then((m) => ({
    default: m.AppSrvcExplnPage,
  })),
)
// 로그인-방식 선택(MUI-CM-03-M01, /login) — 셸 안 + sub헤더. biz/cm/mainLogin.
const MainLoginPage = lazy(() =>
  import('@/ui/biz/cm/mainLogin/MainLoginPage').then((m) => ({ default: m.MainLoginPage })),
)
// ID/PW 로그인(MUI-CM-03-M02, /login/id-pw) — 셸 안 + sub헤더. biz/cm/idPswdLogin.
const IdPswdLoginPage = lazy(() =>
  import('@/ui/biz/cm/idPswdLogin/IdPswdLoginPage').then((m) => ({ default: m.IdPswdLoginPage })),
)
// 아이디 찾기(MUI-CM-03-M03, /login/find-id) — 셸 안 + sub헤더. biz/cm/idFndng.
const IdFndngPage = lazy(() =>
  import('@/ui/biz/cm/idFndng/IdFndngPage').then((m) => ({ default: m.IdFndngPage })),
)
// 비밀번호 찾기(MUI-CM-03-M06, /login/find-pw) — 셸 안 + sub헤더. biz/cm/pswdFndng.
const PswdFndngPage = lazy(() =>
  import('@/ui/biz/cm/pswdFndng/PswdFndngPage').then((m) => ({ default: m.PswdFndngPage })),
)
// 사용자 등록 안내(MUI-CM-03-M09, /login/user-reg-info) — 셸 안 + sub헤더. biz/cm/userRegInfo.
const UserRegInfoPage = lazy(() =>
  import('@/ui/biz/cm/userRegInfo/UserRegInfoPage').then((m) => ({ default: m.UserRegInfoPage })),
)
// 생체인증(MUI-CM-03-M14, /login/biometric) — 셸 안 + sub헤더. biz/cm/bioInfoCert.
const BioInfoCertPage = lazy(() =>
  import('@/ui/biz/cm/bioInfoCert/BioInfoCertPage').then((m) => ({ default: m.BioInfoCertPage })),
)
// PC QR 로그인(MUI-CM-03-M17, /login/pc-qr) — 셸 안 + sub헤더. biz/cm/pcQRLgn.
const PcQRLgnPage = lazy(() =>
  import('@/ui/biz/cm/pcQRLgn/PcQRLgnPage').then((m) => ({ default: m.PcQRLgnPage })),
)
// ID 등록정보로 찾기(MUI-CM-03-M04, /login/find-id/reg-info) — biz/cm/idRegInfoFndng.
const IdRegInfoFndngPage = lazy(() =>
  import('@/ui/biz/cm/idRegInfoFndng/IdRegInfoFndngPage').then((m) => ({
    default: m.IdRegInfoFndngPage,
  })),
)
// 아이디 찾기 결과(MUI-CM-03-M05, /login/find-id/result) — biz/cm/idRslt.
const IdRsltPage = lazy(() =>
  import('@/ui/biz/cm/idRslt/IdRsltPage').then((m) => ({ default: m.IdRsltPage })),
)
// PW 등록정보로 찾기(MUI-CM-03-M07, /login/find-pw/reg-info) — biz/cm/pswdRegInfoFndng.
const PswdRegInfoFndngPage = lazy(() =>
  import('@/ui/biz/cm/pswdRegInfoFndng/PswdRegInfoFndngPage').then((m) => ({
    default: m.PswdRegInfoFndngPage,
  })),
)
// PW 찾기 결과(MUI-CM-03-M08, /login/find-pw/result) — biz/cm/pswdRslt.
const PswdRsltPage = lazy(() =>
  import('@/ui/biz/cm/pswdRslt/PswdRsltPage').then((m) => ({ default: m.PswdRsltPage })),
)
// 생체인증 등록(MUI-CM-03-M15, /login/biometric/register) — biz/cm/bioInfoCertReg.
const BioInfoCertRegPage = lazy(() =>
  import('@/ui/biz/cm/bioInfoCertReg/BioInfoCertRegPage').then((m) => ({
    default: m.BioInfoCertRegPage,
  })),
)
// 생체인증 등록완료(MUI-CM-03-M20, /login/biometric/register/result) — biz/cm/bioInfoCertReg.
const BioInfoCertRsltPage = lazy(() =>
  import('@/ui/biz/cm/bioInfoCertReg/BioInfoCertRsltPage').then((m) => ({
    default: m.BioInfoCertRsltPage,
  })),
)
// 통합로그인 계정등록(MUI-CM-03-M22, /login/new-id) — biz/cm/newId.
const NewIdPwReg = lazy(() =>
  import('@/ui/biz/cm/newId/NewIdPwReg').then((m) => ({ default: m.NewIdPwReg })),
)
// 통합로그인 계정등록완료(MUI-CM-03-M23, /login/new-id/result) — biz/cm/newId.
const NewIdCmptn = lazy(() =>
  import('@/ui/biz/cm/newId/NewIdCmptn').then((m) => ({ default: m.NewIdCmptn })),
)
// 간편인증(MUI-CM-03-P10, /login/simple-cert) — 인증프로세스. biz/cm/simpleCert.
// (설계서·Figma는 BottomSheet — 트리거 배선 시 시트로 전환 가능. 현재는 페이지 라우팅.)
const SimpleCertPage = lazy(() =>
  import('@/ui/biz/cm/simpleCert/SimpleCertPage').then((m) => ({ default: m.SimpleCertPage })),
)
// 금융인증서(MUI-CM-03-P11, /login/finance-cert) — biz/cm/fnstCert.
const FnstCertPage = lazy(() =>
  import('@/ui/biz/cm/fnstCert/FnstCertPage').then((m) => ({ default: m.FnstCertPage })),
)
// 공동인증서(MUI-CM-03-P12, /login/joint-cert) — biz/cm/jntCert.
const JntCertPage = lazy(() =>
  import('@/ui/biz/cm/jntCert/JntCertPage').then((m) => ({ default: m.JntCertPage })),
)
// 모바일 신분증(MUI-CM-03-P13, /login/mobile-id) — biz/cm/mobileIdntyCert.
const MobileIdntyCertPage = lazy(() =>
  import('@/ui/biz/cm/mobileIdntyCert/MobileIdntyCertPage').then((m) => ({
    default: m.MobileIdntyCertPage,
  })),
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
// 계약 통합목록(MUI-CT-01-M01, /ct) — biz/ct/ctrtIntgList.
const CtrtIntgListPage = lazy(() =>
  import('@/ui/biz/ct/ctrtIntgList/CtrtIntgListPage').then((m) => ({
    default: m.CtrtIntgListPage,
  })),
)
// 검사통합목록(MUI-EX-01-M01, /ex) — biz/ex/inspIntgListInq.
const InspIntgListInqPage = lazy(() =>
  import('@/ui/biz/ex/inspIntgListInq/InspIntgListInqPage').then((m) => ({
    default: m.InspIntgListInqPage,
  })),
)
// 검사및납품조서상세(중앙조달)(MUI-EX-01-M02, /ex/dlvdoc/:id) — biz/ex/inspDlvdocDtl.
const InspDlvdocDtlPage = lazy(() =>
  import('@/ui/biz/ex/inspDlvdocDtl/InspDlvdocDtlPage').then((m) => ({
    default: m.InspDlvdocDtlPage,
  })),
)
// 검사및납품조서상세(부대조달)(MUI-EX-01-M03, /ex/dlvdoc/sbsd/:id) — biz/ex/inspDlvdocDtlSbsdPrcm.
const InspDlvdocDtlSbsdPrcmPage = lazy(() =>
  import('@/ui/biz/ex/inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcmPage').then((m) => ({
    default: m.InspDlvdocDtlSbsdPrcmPage,
  })),
)
// 기성및준공검사상세(MUI-EX-01-M04, /ex/pxcnd/:id) — biz/ex/pxcndCmcnInspDtl.
const PxcndCmcnInspDtlPage = lazy(() =>
  import('@/ui/biz/ex/pxcndCmcnInspDtl/PxcndCmcnInspDtlPage').then((m) => ({
    default: m.PxcndCmcnInspDtlPage,
  })),
)
// 물품전자계약진행상세(MUI-CT-01-M03, /ct/:id) — biz/ct/cmdtyElctrCtrtPrgrsDtl.
const CmdtyElctrCtrtPrgrsDtlPage = lazy(() =>
  import('@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtlPage').then((m) => ({
    default: m.CmdtyElctrCtrtPrgrsDtlPage,
  })),
)
// 공사전자계약진행상세(MUI-CT-01-M09, /ct/cstrn/:id) — biz/ct/cstrnElctrCtrtPrgrsDtl.
const CstrnElctrCtrtPrgrsDtlPage = lazy(() =>
  import('@/ui/biz/ct/cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtlPage').then((m) => ({
    default: m.CstrnElctrCtrtPrgrsDtlPage,
  })),
)
// 물품일반계약서상세(MUI-CT-01-M05, /ct/gnrl/:id) — biz/ct/cmdtyGnrlCtrdocDtl.
const CmdtyGnrlCtrdocDtlPage = lazy(() =>
  import('@/ui/biz/ct/cmdtyGnrlCtrdocDtl/CmdtyGnrlCtrdocDtlPage').then((m) => ({
    default: m.CmdtyGnrlCtrdocDtlPage,
  })),
)
// 물품수정계약서상세(MUI-CT-01-M06, /ct/mdfcn/:id) — biz/ct/cmdtyMdfcnCtrdocDtl.
const CmdtyMdfcnCtrdocDtlPage = lazy(() =>
  import('@/ui/biz/ct/cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtlPage').then((m) => ({
    default: m.CmdtyMdfcnCtrdocDtlPage,
  })),
)
// 물품총액계약서상세(MUI-CT-01-M07, /ct/gramt/:id).
const CmdtyGramtCtrdocDtlPage = lazy(() =>
  import('@/ui/biz/ct/cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtlPage').then((m) => ({
    default: m.CmdtyGramtCtrdocDtlPage,
  })),
)
// 물품단가계약서상세(MUI-CT-01-M08, /ct/untprc/:id) — biz/ct/cmdtyUntprcCtrdocDtl(전용 컨테이너+탭 T16~T18).
const CmdtyUntprcCtrdocDtlPage = lazy(() =>
  import('@/ui/biz/ct/cmdtyUntprcCtrdocDtl/CmdtyUntprcCtrdocDtlPage').then((m) => ({
    default: m.CmdtyUntprcCtrdocDtlPage,
  })),
)
// 물품전자계약확정상세(MUI-CT-01-M04, /ct/cfmtn/:id) — biz/ct/cmdtyElctrCtrtCfmtnDtl.
const CmdtyElctrCtrtCfmtnDtlPage = lazy(() =>
  import('@/ui/biz/ct/cmdtyElctrCtrtCfmtnDtl/CmdtyElctrCtrtCfmtnDtlPage').then((m) => ({
    default: m.CmdtyElctrCtrtCfmtnDtlPage,
  })),
)
// 국외전자계약확정상세(MUI-CT-01-M72, /ct/ovs/cfmtn/:id) — biz/ct/ovsElctrCtrtCfmtn.
const OvsElctrCtrtCfmtnPage = lazy(() =>
  import('@/ui/biz/ct/ovsElctrCtrtCfmtn/OvsElctrCtrtCfmtnPage').then((m) => ({
    default: m.OvsElctrCtrtCfmtnPage,
  })),
)
// 공사계약서상세(MUI-CT-01-M10, /ct/cstrn-doc/:id) — biz/ct/cstrnCtrdocDtl.
const CstrnCtrdocDtlPage = lazy(() =>
  import('@/ui/biz/ct/cstrnCtrdocDtl/CstrnCtrdocDtlPage').then((m) => ({
    default: m.CstrnCtrdocDtlPage,
  })),
)
// 대금지불정보목록(MUI-CT-01-M15, /ct/pymt) — biz/ct/pymtDfryInfoList.
const PymtDfryInfoListPage = lazy(() =>
  import('@/ui/biz/ct/pymtDfryInfoList/PymtDfryInfoListPage').then((m) => ({
    default: m.PymtDfryInfoListPage,
  })),
)
// 국외전자계약진행상세(MUI-CT-01-M71, /ct/ovs/:id — M72 확정상세 겸용) — biz/ct/ovsElctrCtrtPrgrsDtl.
const OvsElctrCtrtPrgrsDtlPage = lazy(() =>
  import('@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlPage').then((m) => ({
    default: m.OvsElctrCtrtPrgrsDtlPage,
  })),
)
// 상업계약서상세(MUI-CT-01-M77, /ct/ovs/cmbz/:id) — biz/ct/ovsCmbzCtrdocDtl.
const OvsCmbzCtrdocDtlPage = lazy(() =>
  import('@/ui/biz/ct/ovsCmbzCtrdocDtl/OvsCmbzCtrdocDtlPage').then((m) => ({
    default: m.OvsCmbzCtrdocDtlPage,
  })),
)
// 해지/해제 목록(MUI-CT-03-M01, /ct/cncltn) — biz/ct/ctrtCncltnRmvList.
const CtrtCncltnRmvListPage = lazy(() =>
  import('@/ui/biz/ct/ctrtCncltnRmvList/CtrtCncltnRmvListPage').then((m) => ({
    default: m.CtrtCncltnRmvListPage,
  })),
)
// 해지/해제 물품일반계약 상세(MUI-CT-03-M02, /ct/cncltn/:id) — biz/ct/cmdtyCtrtCncltnRmvDtl.
const CmdtyCtrtCncltnRmvDtlPage = lazy(() =>
  import('@/ui/biz/ct/cmdtyCtrtCncltnRmvDtl/CmdtyCtrtCncltnRmvDtlPage').then((m) => ({
    default: m.CmdtyCtrtCncltnRmvDtlPage,
  })),
)
// 해지/해제 일반총액제계약 상세(MUI-CT-03-M03, /ct/cncltn/gramt/:id) — biz/ct/cncltnRmvGnrlCtrtGramtDtl.
const CncltnRmvGnrlCtrtGramtDtlPage = lazy(() =>
  import('@/ui/biz/ct/cncltnRmvGnrlCtrtGramtDtl/CncltnRmvGnrlCtrtGramtDtlPage').then((m) => ({
    default: m.CncltnRmvGnrlCtrtGramtDtlPage,
  })),
)
// 해지/해제 일반단가제계약 상세(MUI-CT-03-M04, /ct/cncltn/untprc/:id) — biz/ct/cncltnRmvGnrlCtrtUntprcDtl.
const CncltnRmvGnrlCtrtUntprcDtlPage = lazy(() =>
  import('@/ui/biz/ct/cncltnRmvGnrlCtrtUntprcDtl/CncltnRmvGnrlCtrtUntprcDtlPage').then((m) => ({
    default: m.CncltnRmvGnrlCtrtUntprcDtlPage,
  })),
)
// 해지/해제 수정계약 상세(MUI-CT-03-M05, /ct/cncltn/mdfcn/:id) — biz/ct/cncltnRmvMdfcnCtrtDtl.
const CncltnRmvMdfcnCtrtDtlPage = lazy(() =>
  import('@/ui/biz/ct/cncltnRmvMdfcnCtrtDtl/CncltnRmvMdfcnCtrtDtlPage').then((m) => ({
    default: m.CncltnRmvMdfcnCtrtDtlPage,
  })),
)
// 해지/해제 공사계약 상세(MUI-CT-03-M06, /ct/cncltn/cstrn/:id) — biz/ct/cstrnCtrtCncltnRmvDtl.
const CstrnCtrtCncltnRmvDtlPage = lazy(() =>
  import('@/ui/biz/ct/cstrnCtrtCncltnRmvDtl/CstrnCtrtCncltnRmvDtlPage').then((m) => ({
    default: m.CstrnCtrtCncltnRmvDtlPage,
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
// 입찰공고 상세(MUI-BD-01-M07 · 탭 T01~T06(구 M07~M12 — v1.83 재편), /bd/:id) — biz/bd/bidPbancDtl.
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
// 입찰결과상세(개찰상세, MUI-BD-09-M01 · 탭 T01~T04(구 M01~M04 — v1.83 재편), /bd/result/:id) — biz/bd/bidRsltDtl.
const BidRsltDtlPage = lazy(() =>
  import('@/ui/biz/bd/bidRsltDtl/BidRsltDtlPage').then((m) => ({
    default: m.BidRsltDtlPage,
  })),
)
// 이행/적격심사상세(MUI-BD-10-M01 · 탭 T01~T05(구 M01~M04 — v1.83 재편), /bd/implt/:id) — biz/bd/bidRsltDtl. 입찰결과상세 > 이행적격심사 신청하기 진입.
const ImpltPage = lazy(() =>
  import('@/ui/biz/bd/bidRsltDtl/ImpltPage').then((m) => ({
    default: m.ImpltPage,
  })),
)
// 국외 입찰결과조회 상세(단가제, MUI-BD-09-M71 · T71·T72(구 M71·M72 — v1.83 재편), /bd/ovs/result/:id) — biz/bd/ovsBidRsltDtl. 개찰목록 국외(단가제) 카드 진입.
const OvsBidRsltDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsBidRsltDtl/OvsBidRsltDtlPage').then((m) => ({
    default: m.OvsBidRsltDtlPage,
  })),
)
// 국외 공개수의협상계획상세(MUI-BD-12-M71 · T71~T73(구 M71~M73 — v1.83 재편), /bd/ovs/rls-ngtn/:id) — biz/bd/ovsRlsVltrnsNgtnPlanDtl. 개찰목록 국외·수의계약 카드 진입.
const OvsRlsVltrnsNgtnPlanDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnPlanDtl/OvsRlsVltrnsNgtnPlanDtlPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnPlanDtlPage,
  })),
)
// 국외 공개수의협상 견적서 작성(4스텝, MUI-BD-12-M74 · 스탭 T74~T77(구 M74~M77 — v1.83 재편), /bd/ovs/rls-ngtn/:id/etdc) — biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage. 계획상세 바로가기 진입.
const OvsRlsVltrnsNgtnEtdcSbmsnPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsnPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnEtdcSbmsnPage,
  })),
)
// 국외 공개수의협상 견적서 조회(상세 읽기, MUI-BD-12-M78 · 탭 T78~T81(구 M78~M81 — v1.83 재편), /bd/ovs/rls-ngtn/:id/etdc-dtl) — biz/bd/ovsRlsVltrnsNgtnEtdcDtl. 계획상세 바로가기 진입.
const OvsRlsVltrnsNgtnEtdcDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtlPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnEtdcDtlPage,
  })),
)
// 국외 공개수의협상 결과조회(MUI-BD-12-M83 · 탭 T82·T83(구 M83 — v1.83 재편), /bd/ovs/rls-ngtn/:id/rslt) — biz/bd/ovsRlsVltrnsNgtnSrngRsltInq. 견적서 상세 바로가기 진입.
const OvsRlsVltrnsNgtnSrngRsltInqPage = lazy(() =>
  import('@/ui/biz/bd/ovsRlsVltrnsNgtnSrngRsltInq/OvsRlsVltrnsNgtnSrngRsltInqPage').then((m) => ({
    default: m.OvsRlsVltrnsNgtnSrngRsltInqPage,
  })),
)
// 국외 입찰공고 상세(MUI-BD-01-M71 · 탭 T71~T73(구 M71~M73 — v1.83 재편), /bd/ovs/:id) — biz/bd/ovsBidPbancDtl.
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
// 입찰내역 작성(MUI-BD-01-M76 · 탭 T74~T76(구 M76~M78 — v1.83 재편), /bd/ovs/locker/:id/bid-cn) — biz/bd/ovsTmprBidCnReg. 단가제/총액제 분기.
const OvsTmprBidCnRegPage = lazy(() =>
  import('@/ui/biz/bd/ovsTmprBidCnReg/OvsTmprBidCnRegPage').then((m) => ({
    default: m.OvsTmprBidCnRegPage,
  })),
)
// 이전공고입찰내역등록(MUI-BD-01-P79(구 M79 — v1.83 재편), /bd/ovs/locker/:id/bfr-bid-cn) — biz/bd/ovsBfrTmprBidBidCnReg.
const OvsBfrTmprBidBidCnRegPage = lazy(() =>
  import('@/ui/biz/bd/ovsBfrTmprBidBidCnReg/OvsBfrTmprBidBidCnRegPage').then((m) => ({
    default: m.OvsBfrTmprBidBidCnRegPage,
  })),
)
// 국외 입찰참가신청서 작성(MUI-BD-04-M71 · T71~T75(구 M71~M77 — v1.83 재편), /bd/ovs/prgrs/:id/aply) — biz/bd/ovsBidPrtcpAply. 서약서 → 신청서 4탭 마법사.
const OvsBidPrtcpAplyPage = lazy(() =>
  import('@/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAplyPage').then((m) => ({
    default: m.OvsBidPrtcpAplyPage,
  })),
)
// 국외 입찰참가신청서 상세(MUI-BD-04-M78 · 탭 T76~T79(구 M78~M81 — v1.83 재편), /bd/ovs/prgrs/:id/apfr) — biz/bd/ovsBidPrtcpApfrDtl.
const OvsBidPrtcpApfrDtlPage = lazy(() =>
  import('@/ui/biz/bd/ovsBidPrtcpApfrDtl/OvsBidPrtcpApfrDtlPage').then((m) => ({
    default: m.OvsBidPrtcpApfrDtlPage,
  })),
)
// 국외 입찰서제출(MUI-BD-06-M71 · 스탭 T71~T74(구 M71~M74 — v1.83 재편), /bd/ovs/prgrs/:id/tndr-sbmsn) — biz/bd/ovsTndrSbmsn. 3스탭 마법사.
const OvsTndrSbmsnPage = lazy(() =>
  import('@/ui/biz/bd/ovsTndrSbmsn/OvsTndrSbmsnPage').then((m) => ({
    default: m.OvsTndrSbmsnPage,
  })),
)
// 국외 입찰서 상세(MUI-BD-06-M75 · 탭 T75~T79(구 M75~M79 — v1.83 재편), /bd/ovs/prgrs/:id/tndr) — biz/bd/ovsTndrDtl.
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
// 민원서류발급신청(MUI-CM-04-M04, /support/dcmnt-issu-aply) — biz/cm/dcmntIssuAply. 고객센터 허브.
const DcmntIssuAplyPage = lazy(() =>
  import('@/ui/biz/cm/dcmntIssuAply/DcmntIssuAplyPage').then((m) => ({
    default: m.DcmntIssuAplyPage,
  })),
)
// 신청절차 및 안내(MUI-CM-04-M05, /support/dcmnt-issu-aply/aply-step-info) — biz/cm/aplyStepInfo.
const AplyStepInfoPage = lazy(() =>
  import('@/ui/biz/cm/aplyStepInfo/AplyStepInfoPage').then((m) => ({
    default: m.AplyStepInfoPage,
  })),
)
// 실적증명서 신청 목록(MUI-CM-04-M06, /support/dcmnt-issu-aply/prfmnc-prdoc) — biz/cm/prfmncPrdoc.
const PrfmncPrdocPage = lazy(() =>
  import('@/ui/biz/cm/prfmncPrdoc/PrfmncPrdocPage').then((m) => ({
    default: m.PrfmncPrdocPage,
  })),
)
// 실적증명서 확인(상세)(MUI-CM-04-M07, /support/dcmnt-issu-aply/prfmnc-prdoc/:prfmncRcptNo).
const PrfmncPrdocDtlPage = lazy(() =>
  import('@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtlPage').then((m) => ({
    default: m.PrfmncPrdocDtlPage,
  })),
)
// 실적증명서 신청 플로우(MUI-CM-04-P21/M12/T12/T13, /support/dcmnt-issu-aply/prfmnc-prdoc/reg).
const PrfmncPrdocRegPage = lazy(() =>
  import('@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegPage').then((m) => ({
    default: m.PrfmncPrdocRegPage,
  })),
)
// 국외조달원등록증신청목록(MUI-CM-04-M21, /support/dcmnt-issu-aply/ovs-sos-cnfdoc).
const OvsSosCnfdocListPage = lazy(() =>
  import('@/ui/biz/cm/ovsSosCnfdocList/OvsSosCnfdocListPage').then((m) => ({
    default: m.OvsSosCnfdocListPage,
  })),
)
// 국외조달원등록증신청(MUI-CM-04-M22, /support/dcmnt-issu-aply/ovs-sos-cnfdoc/reg) — biz/cm/ovsSosCnfdocReg.
const OvsSosCnfdocRegPage = lazy(() =>
  import('@/ui/biz/cm/ovsSosCnfdocReg/OvsSosCnfdocRegPage').then((m) => ({
    default: m.OvsSosCnfdocRegPage,
  })),
)
// 법령조회=법령정보(MUI-CM-04-M24, /support/stt-info-list) — biz/cm/sttInfoList.
const SttInfoListPage = lazy(() =>
  import('@/ui/biz/cm/sttInfoList/SttInfoListPage').then((m) => ({
    default: m.SttInfoListPage,
  })),
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
// 청렴계약제(MUI-CM-05-M08, /guide/preparation02) — biz/cm/preparation02. 이용안내 > 국내조달안내.
const Preparation02Page = lazy(() =>
  import('@/ui/biz/cm/preparation02/Preparation02Page').then((m) => ({
    default: m.Preparation02Page,
  })),
)
// 전자입찰절차 국내(MUI-CM-05-M10, /guide/domestic02) — biz/cm/domestic02. 이용안내 > 국내조달안내.
const Domestic02Page = lazy(() =>
  import('@/ui/biz/cm/domestic02/Domestic02Page').then((m) => ({
    default: m.Domestic02Page,
  })),
)
// 전자대금청구절차(MUI-CM-05-M11, /guide/domestic03) — biz/cm/domestic03. 이용안내 > 국내조달안내.
const Domestic03Page = lazy(() =>
  import('@/ui/biz/cm/domestic03/Domestic03Page').then((m) => ({
    default: m.Domestic03Page,
  })),
)
// 국외조달원 등록/변경안내(MUI-CM-05-M13, /guide/foreign02) — biz/cm/foreign02. 이용안내 > 국외조달안내.
const Foreign02Page = lazy(() =>
  import('@/ui/biz/cm/foreign02/Foreign02Page').then((m) => ({
    default: m.Foreign02Page,
  })),
)
// 전자입찰절차 국외(MUI-CM-05-M14, /guide/foreign03) — biz/cm/foreign03. 이용안내 > 국외조달안내.
const Foreign03Page = lazy(() =>
  import('@/ui/biz/cm/foreign03/Foreign03Page').then((m) => ({
    default: m.Foreign03Page,
  })),
)
// 관련사이트(MUI-CM-05-M15, /guide/site) — biz/cm/site. 이용안내 > 관련사이트.
const SitePage = lazy(() =>
  import('@/ui/biz/cm/site/SitePage').then((m) => ({ default: m.SitePage })),
)
// 설정(MUI-MS-02-M01, /settings) — biz/cm/appStng. 전체메뉴 > 설정.
const AppStngPage = lazy(() =>
  import('@/ui/biz/cm/appStng/AppStngPage').then((m) => ({ default: m.AppStngPage })),
)
// 챗봇문의(MUI-MS-01-M11, /chatbot) — biz/cm/chatbot. BottomNav 챗봇 / 전체메뉴 챗봇상담 진입(외부 솔루션 임베드 자리).
const ChatbotPage = lazy(() =>
  import('@/ui/biz/cm/chatbot/ChatbotPage').then((m) => ({ default: m.ChatbotPage })),
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
const MyPage = lazy(() => import('@/ui/biz/cm/myPage/MyPage').then((m) => ({ default: m.MyPage })))
// 업체정보관리 허브(MUI-CM-01-M01, /mypage/bzenty-info-mng) — biz/cm/bzentyGnrlInfoMng. 진입 버튼 목록.
const BzentyGnrlInfoMngPage = lazy(() =>
  import('@/ui/biz/cm/bzentyGnrlInfoMng/BzentyGnrlInfoMngPage').then((m) => ({
    default: m.BzentyGnrlInfoMngPage,
  })),
)
// 업체정보 상세(MUI-CM-01-M02, /mypage/bzenty-info) — biz/cm/bzentyGnrlInfoDtl. 업체일반/물품(내자)/시설/국내소재상사 탭 호스트.
const BzentyGnrlInfoDtlPage = lazy(() =>
  import('@/ui/biz/cm/bzentyGnrlInfoDtl/BzentyGnrlInfoDtlPage').then((m) => ({
    default: m.BzentyGnrlInfoDtlPage,
  })),
)
// 국내 조달원 확인서 신청 목록(MUI-CM-01-M19, /mypage/dmst-sos-cnfdoc) — biz/cm/dmstSosCnfdocList. 신청 팝업 P20 포함.
const DmstSosCnfdocListPage = lazy(() =>
  import('@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocListPage').then((m) => ({
    default: m.DmstSosCnfdocListPage,
  })),
)
// 추가정보 신청 목록(MUI-CM-01-M03, /mypage/add-reg-info-aply) — biz/cm/addRegInfoAplyList. 검색필터 P24(공통 SearchFilter).
const AddRegInfoAplyListPage = lazy(() =>
  import('@/ui/biz/cm/addRegInfoAplyList/AddRegInfoAplyListPage').then((m) => ({
    default: m.AddRegInfoAplyListPage,
  })),
)
// 추가정보 신청내역상세(MUI-CM-01-M03 상세, T05/T06) — biz/cm/addRegInfoAplyDtl. 추가정보구분별 물품(내자)/국내소재상사 콘텐츠.
const AddRegInfoAplyDtlPage = lazy(() =>
  import('@/ui/biz/cm/addRegInfoAplyDtl/AddRegInfoAplyDtlPage').then((m) => ({
    default: m.AddRegInfoAplyDtlPage,
  })),
)
// 업체정보 추가등록 폼(MUI-CM-01-M05/M22/M23) — biz/cm/dmstLctnColInfoAddReg. 선택 팝업(P06~P14)은 각 폼이 소유.
const DmstLctnColInfoAddRegPage = lazy(() =>
  import('@/ui/biz/cm/dmstLctnColInfoAddReg/DmstLctnColInfoAddRegPage').then((m) => ({
    default: m.DmstLctnColInfoAddRegPage,
  })),
)
const DmstLctnColInfoAddRegPagePic = lazy(() =>
  import('@/ui/biz/cm/dmstLctnColInfoAddReg/DmstLctnColInfoAddRegPage_Pic').then((m) => ({
    default: m.DmstLctnColInfoAddRegPage_Pic,
  })),
)
const DmstLctnColInfoAddRegPageCmbz = lazy(() =>
  import('@/ui/biz/cm/dmstLctnColInfoAddReg/DmstLctnColInfoAddRegPage_Cmbz').then((m) => ({
    default: m.DmstLctnColInfoAddRegPage_Cmbz,
  })),
)
// 국외조달원등록증신청안내(MUI-CM-01-P21, /mypage/ovs-dmst-sos) — biz/cm/dmstSosCnfdocList/OvsdmstSosCnfdoc.
const OvsdmstSosCnfdoc = lazy(() =>
  import('@/ui/biz/cm/dmstSosCnfdocList/OvsdmstSosCnfdoc').then((m) => ({
    default: m.OvsdmstSosCnfdoc,
  })),
)
// 군수품무역대리업 신청 및 발급(MUI-CM-01-M15~M18) — biz/cm/dfEqpmntTradeAgncAply*. 목록/상세/신규(갱신)/변경.
const DfEqpmntTradeAgncAplyListPage = lazy(() =>
  import('@/ui/biz/cm/dfEqpmntTradeAgncAplyList/DfEqpmntTradeAgncAplyListPage').then((m) => ({
    default: m.DfEqpmntTradeAgncAplyListPage,
  })),
)
const DfEqpmntTradeAgncAplyDtlPage = lazy(() =>
  import('@/ui/biz/cm/dfEqpmntTradeAgncAplyDtl/DfEqpmntTradeAgncAplyDtlPage').then((m) => ({
    default: m.DfEqpmntTradeAgncAplyDtlPage,
  })),
)
const DfEqpmntTradeAgncAplyPage = lazy(() =>
  import('@/ui/biz/cm/dfEqpmntTradeAgncAply/DfEqpmntTradeAgncAplyPage').then((m) => ({
    default: m.DfEqpmntTradeAgncAplyPage,
  })),
)
const DfEqpmntTradeAgncChgPage = lazy(() =>
  import('@/ui/biz/cm/dfEqpmntTradeAgncChg/DfEqpmntTradeAgncChgPage').then((m) => ({
    default: m.DfEqpmntTradeAgncChgPage,
  })),
)
const ItrstBidPbancPage = lazy(() =>
  import('@/ui/biz/cm/itrstBidPbanc/ItrstBidPbancPage').then((m) => ({
    default: m.ItrstBidPbancPage,
  })),
)
// 업무캘린더(MUI-CM-06-M06, /mypage/task-cldr) — biz/cm/taskCldr. 마이페이지 > 업무캘린더.
const TaskCldrPage = lazy(() =>
  import('@/ui/biz/cm/taskCldr/TaskCldrPage').then((m) => ({
    default: m.TaskCldrPage,
  })),
)
// 나의진행업무현황(MUI-CM-06-M02, /mypage/prgrs-hstry) — biz/cm/myPrgrsHstry. 세부스텝팝업 P03 호스트.
const MyPrgrsHstryPage = lazy(() =>
  import('@/ui/biz/cm/myPrgrsHstry/MyPrgrsHstryPage').then((m) => ({
    default: m.MyPrgrsHstryPage,
  })),
)
// 나의업무이력현황(MUI-CM-06-M04, /mypage/task-hstry) — biz/cm/myTaskHstry.
const MyTaskHstryPage = lazy(() =>
  import('@/ui/biz/cm/myTaskHstry/MyTaskHstryPage').then((m) => ({
    default: m.MyTaskHstryPage,
  })),
)
// 개인별수신처 관리(MUI-CM-06-M12, /mypage/indv-rcofc-mng) — biz/cm/indvRcofcMng. 조회 전용 목록.
const IndvRcofcMngPage = lazy(() =>
  import('@/ui/biz/cm/indvRcofcMng/IndvRcofcMngPage').then((m) => ({
    default: m.IndvRcofcMngPage,
  })),
)
// 관심법령(MUI-CM-06-M13, /mypage/itrst-stt) — biz/cm/itrstStt. 즐겨찾기 법령 목록(외부 링크).
const ItrstSttPage = lazy(() =>
  import('@/ui/biz/cm/itrstStt/ItrstSttPage').then((m) => ({
    default: m.ItrstSttPage,
  })),
)
// 나의 게시물(MUI-CM-06-M17, /mypage/my-pst) — biz/cm/myPst. 내가 작성한 게시물 목록.
const MyPstPage = lazy(() =>
  import('@/ui/biz/cm/myPst/MyPstPage').then((m) => ({
    default: m.MyPstPage,
  })),
)
// 디지털캐비닛(MUI-CM-06-M14, /mypage/digital-cabinet) — biz/cm/digitalCabinet. 폴더 목록 + P15 권한설정 시트.
const DigitalCabinetPage = lazy(() =>
  import('@/ui/biz/cm/digitalCabinet/DigitalCabinetPage').then((m) => ({
    default: m.DigitalCabinetPage,
  })),
)
// 폴더 내 파일 목록(MUI-CM-06-M16, /mypage/digital-cabinet/:fldrSn) — biz/cm/digitalCabinet.
const DigitalCabinetFileListPage = lazy(() =>
  import('@/ui/biz/cm/digitalCabinet/DigitalCabinetFileListPage').then((m) => ({
    default: m.DigitalCabinetFileListPage,
  })),
)
// 문서함 목록(MUI-CM-06-M10, /mypage/doc-box) — biz/cm/docBox.
const DocBoxPage = lazy(() =>
  import('@/ui/biz/cm/docBox/DocBoxPage').then((m) => ({
    default: m.DocBoxPage,
  })),
)
// 문서함 상세(MUI-CM-06-M11, /mypage/doc-box/:id) — biz/cm/docBoxDtl. T01/T02/T03 탭 호스트.
const DocBoxDtlPage = lazy(() =>
  import('@/ui/biz/cm/docBoxDtl/DocBoxDtlPage').then((m) => ({
    default: m.DocBoxDtlPage,
  })),
)
// 개인정보수정(MUI-CM-02-M04, /mypage/indv-info-mdfcn) — 비밀번호 인증 게이트.
const IndvInfoMdfcnPage = lazy(() =>
  import('@/ui/biz/cm/indvInfoMdfcn/IndvInfoMdfcnPage').then((m) => ({
    default: m.IndvInfoMdfcnPage,
  })),
)
// 알림서비스 신청 및 해지(MUI-CM-02-M09, /mypage/noti-srvc-aply) — 알림 수단/항목 설정.
const NotiSrvcAplyPage = lazy(() =>
  import('@/ui/biz/cm/notiSrvcAply/NotiSrvcAplyPage').then((m) => ({
    default: m.NotiSrvcAplyPage,
  })),
)
// 사용자정보관리 허브(MUI-CM-02-M01, /mypage/indv-info-mng).
const IndvInfoMngPage = lazy(() =>
  import('@/ui/biz/cm/indvInfoMng/IndvInfoMngPage').then((m) => ({
    default: m.IndvInfoMngPage,
  })),
)
// 개인(생체)/비밀번호 인증(MUI-CM-02-M02, /mypage/indv-cert).
const IndvCertPage = lazy(() =>
  import('@/ui/biz/cm/indvCert/IndvCertPage').then((m) => ({
    default: m.IndvCertPage,
  })),
)
// 개인정보상세(MUI-CM-02-M03, /mypage/indv-info-dtl) — 조회. 목록 진입 시 수신설정/버튼 숨김.
const IndvInfoDtlPage = lazy(() =>
  import('@/ui/biz/cm/indvInfoDtl/IndvInfoDtlPage').then((m) => ({
    default: m.IndvInfoDtlPage,
  })),
)
// 비밀번호 변경(MUI-CM-02-M05, /mypage/pswd-chg) — RHF+zod 폼.
const PswdChgPage = lazy(() =>
  import('@/ui/biz/cm/pswdChg/PswdChgPage').then((m) => ({
    default: m.PswdChgPage,
  })),
)
// 개인 신원 확인(MUI-CM-02-M06, /mypage/indv-idnt-idnty) — 인증서 기반.
const IndvIdntIdntyPage = lazy(() =>
  import('@/ui/biz/cm/indvIdntIdnty/IndvIdntIdntyPage').then((m) => ({
    default: m.IndvIdntIdntyPage,
  })),
)
// 업체 소속 사용자 목록(MUI-CM-02-M07, /mypage/prcm-bzenty-user-mng) — 상태변경 시트 P08 포함.
const PrcmBzentyUserMngPage = lazy(() =>
  import('@/ui/biz/cm/prcmBzentyUserMng/PrcmBzentyUserMngPage').then((m) => ({
    default: m.PrcmBzentyUserMngPage,
  })),
)
// 회원탈퇴(MUI-CM-02-P10, /mypage/mb-withdrawal).
const MbWithdrawalPage = lazy(() =>
  import('@/ui/biz/cm/mbWithdrawal/MbWithdrawalPage').then((m) => ({
    default: m.MbWithdrawalPage,
  })),
)
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
        path: 'ct',
        element: <CtrtIntgListPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.CT] },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'ex',
        element: <InspIntgListInqPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.EX] },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'ex/dlvdoc/:id',
        element: <InspDlvdocDtlPage />,
        handle: { header: { variant: 'sub', title: '상세 조회' } },
      },
      {
        path: 'ex/dlvdoc/sbsd/:id',
        element: <InspDlvdocDtlSbsdPrcmPage />,
        handle: { header: { variant: 'sub', title: '상세 조회' } },
      },
      {
        path: 'ex/pxcnd/:id',
        element: <PxcndCmcnInspDtlPage />,
        handle: { header: { variant: 'sub', title: '상세 조회' } },
      },
      {
        path: 'ct/cstrn/:id',
        element: <CstrnElctrCtrtPrgrsDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/gnrl/:id',
        element: <CmdtyGnrlCtrdocDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/mdfcn/:id',
        element: <CmdtyMdfcnCtrdocDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/gramt/:id',
        element: <CmdtyGramtCtrdocDtlPage type="gramt" />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/untprc/:id',
        element: <CmdtyUntprcCtrdocDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        // 물품전자계약확정상세 (MUI-CT-01-M04) — 목록 물품 '계약확정' 카드 진입.
        path: 'ct/cfmtn/:id',
        element: <CmdtyElctrCtrtCfmtnDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '전자계약상세' } },
      },
      {
        // 국외전자계약확정상세 (MUI-CT-01-M72) — 목록 국외 '계약확정' 카드 진입.
        path: 'ct/ovs/cfmtn/:id',
        element: <OvsElctrCtrtCfmtnPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/cstrn-doc/:id',
        element: <CstrnCtrdocDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/pymt',
        element: <PymtDfryInfoListPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.CT_PYMT] },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'ct/ovs/cmbz/:id',
        element: <OvsCmbzCtrdocDtlPage />,
        handle: { header: { variant: 'sub', title: '상업계약서 상세' } },
      },
      {
        path: 'ct/ovs/:id',
        element: <OvsElctrCtrtPrgrsDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/cncltn',
        element: <CtrtCncltnRmvListPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.CT_CNCLTN] },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'ct/cncltn/gramt/:id',
        element: <CncltnRmvGnrlCtrtGramtDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/cncltn/untprc/:id',
        element: <CncltnRmvGnrlCtrtUntprcDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/cncltn/mdfcn/:id',
        element: <CncltnRmvMdfcnCtrtDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/cncltn/cstrn/:id',
        element: <CstrnCtrtCncltnRmvDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/cncltn/:id',
        element: <CmdtyCtrtCncltnRmvDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
      },
      {
        path: 'ct/:id',
        element: <CmdtyElctrCtrtPrgrsDtlPage />,
        handle: { header: { variant: 'sub', title: '계약 상세조회' } },
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
        // 민원서류발급신청 (MUI-CM-04-M04) — 전체메뉴 고객센터 > 민원서류발급신청 진입
        path: 'support/dcmnt-issu-aply',
        element: <DcmntIssuAplyPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.SUPPORT_DCMNT_ISSU_APLY] },
          scrollReset: true,
        },
      },
      {
        // 신청절차 및 안내 (MUI-CM-04-M05) — 민원서류발급신청 허브 > 신청 절차 및 안내 진입
        path: 'support/dcmnt-issu-aply/aply-step-info',
        element: <AplyStepInfoPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '신청절차 및 안내' },
          scrollReset: true,
        },
      },
      {
        // 실적증명서 신청 목록 (MUI-CM-04-M06) — 민원서류발급신청 허브 > 실적 증명서 신청 목록 진입
        path: 'support/dcmnt-issu-aply/prfmnc-prdoc',
        element: <PrfmncPrdocPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '실적증명서 신청 목록' },
          scrollReset: true,
        },
      },
      {
        // 실적증명서 신청 플로우 (MUI-CM-04-P21 계약선택 → M12 신청정보 → T12/T13 실적정보)
        // 정적 세그먼트('reg')라 아래 ':prfmncRcptNo' 상세보다 우선 매칭(RRv6 랭킹).
        path: 'support/dcmnt-issu-aply/prfmnc-prdoc/reg',
        element: <PrfmncPrdocRegPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '실적증명서 신청' },
          scrollReset: true,
        },
      },
      {
        // 실적증명서 확인(상세) (MUI-CM-04-M07) — 실적증명서 신청 목록 카드 클릭 진입
        path: 'support/dcmnt-issu-aply/prfmnc-prdoc/:prfmncRcptNo',
        element: <PrfmncPrdocDtlPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '실적증명서 확인' },
          scrollReset: true,
        },
      },
      {
        // 국외조달원등록증신청목록 (MUI-CM-04-M21) — 민원서류발급신청 허브 진입
        path: 'support/dcmnt-issu-aply/ovs-sos-cnfdoc',
        element: <OvsSosCnfdocListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '국외 조달원 등록증' },
          scrollReset: true,
        },
      },
      {
        // 국외조달원등록증신청 (MUI-CM-04-M22) — 목록(M21) 하단 [신청] 진입.
        // 정적 세그먼트 'reg' — 상세 :param 라우트 없음(형제 목록과 충돌 없음).
        path: 'support/dcmnt-issu-aply/ovs-sos-cnfdoc/reg',
        element: <OvsSosCnfdocRegPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '국외 조달원 등록증 신청' },
          scrollReset: true,
        },
      },
      {
        // 법령조회=법령정보 (MUI-CM-04-M24) — 고객센터 > 법령조회(전체메뉴 support-law).
        path: 'support/stt-info-list',
        element: <SttInfoListPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '법령조회' },
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
      {
        // 청렴계약제 (MUI-CM-05-M08) — 이용안내 > 국내조달안내 > 청렴계약제
        path: 'guide/preparation02',
        element: <Preparation02Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '청렴계약제' },
          scrollReset: true,
        },
      },
      {
        // 전자입찰절차 국내 (MUI-CM-05-M10) — 이용안내 > 국내조달안내 > 전자입찰절차
        path: 'guide/domestic02',
        element: <Domestic02Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '전자입찰절차' },
          scrollReset: true,
        },
      },
      {
        // 전자대금청구절차 (MUI-CM-05-M11) — 이용안내 > 국내조달안내 > 전자대금청구절차
        path: 'guide/domestic03',
        element: <Domestic03Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '전자대금청구절차' },
          scrollReset: true,
        },
      },
      {
        // 국외조달원 등록/변경안내 (MUI-CM-05-M13) — 이용안내 > 국외조달안내 > 국외조달원 등록/변경안내
        path: 'guide/foreign02',
        element: <Foreign02Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '국외조달원 등록/변경안내' },
          scrollReset: true,
        },
      },
      {
        // 전자입찰절차 국외 (MUI-CM-05-M14) — 이용안내 > 국외조달안내 > 전자입찰절차
        path: 'guide/foreign03',
        element: <Foreign03Page />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '전자입찰절차' },
          scrollReset: true,
        },
      },
      {
        // 관련사이트 (MUI-CM-05-M15) — 전체메뉴 이용안내 > 관련사이트
        path: 'guide/site',
        element: <SitePage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_SITE] },
          scrollReset: true,
        },
      },
      {
        // 설정 (MUI-MS-02-M01) — 전체메뉴 > 설정
        path: 'settings',
        element: <AppStngPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '설정' },
          scrollReset: true,
        },
      },
      {
        // 챗봇문의 (MUI-MS-01-M11) — BottomNav 챗봇 / 전체메뉴 챗봇상담
        path: 'chatbot',
        element: <ChatbotPage />,
        errorElement: <ErrorPage />,
        handle: {
          header: { variant: 'sub', title: '챗봇문의' },
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
      // 마이페이지(MUI-CM-06-M01) — 셸 안 + sub헤더(뒤로+타이틀) + 하단 BottomNav 탭.
      {
        path: 'mypage',
        element: <MyPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '마이페이지' }, showBottomNav: true, scrollReset: true },
      },
      // 업체정보관리 허브(MUI-CM-01-M01) — 마이페이지 > 업체정보관리. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/bzenty-info-mng',
        element: <BzentyGnrlInfoMngPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '업체정보관리' }, scrollReset: true },
      },
      // 업체정보 상세(MUI-CM-01-M02) — 마이페이지 > 업체정보관리 > 상세. 3뎁스라 BottomNav 숨김(opt-in 생략).
      {
        path: 'mypage/bzenty-info',
        element: <BzentyGnrlInfoDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '업체정보 상세' }, scrollReset: true },
      },
      // 국내 조달원 확인서 신청 목록(MUI-CM-01-M19) — 마이페이지 > 업체정보관리 > 국내조달원확인서신청목록.
      //   진입점: 업체정보관리(MUI-CM-01-M01)·홈 바로가기('조달원 등록증(국내)') — M01 미구현이라 라우트만 등록(진입 배선은 추후).
      //   3뎁스라 BottomNav 숨김(opt-in 생략). 목록 화면이라 scrollReset.
      {
        path: 'mypage/dmst-sos-cnfdoc',
        element: <DmstSosCnfdocListPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '국내 조달원 확인서 신청 목록' }, scrollReset: true },
      },
      // 추가정보 신청 목록(MUI-CM-01-M03) — 마이페이지 > 업체정보관리 > 추가정보 신청 목록.
      //   진입점: 업체정보관리(MUI-CM-01-M01) 미구현이라 라우트만 등록(진입 배선은 추후). 3뎁스라 BottomNav 숨김, 목록이라 scrollReset.
      {
        path: 'mypage/add-reg-info-aply',
        element: <AddRegInfoAplyListPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '추가정보 신청 목록' }, scrollReset: true },
      },
      // 추가정보 신청내역상세(MUI-CM-01-M03 상세, T05/T06) — 목록에서 navigate state(항목)로 진입. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/add-reg-info-aply/:id',
        element: <AddRegInfoAplyDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '신청 내역 상세' }, scrollReset: true },
      },
      // 업체정보 추가등록 — 물품(내자)/담당자정보/국내소재상사(MUI-CM-01-M05/M22/M23).
      //   진입점: 업체정보관리(MUI-CM-01-M01) 미구현이라 라우트만 등록(진입 배선은 추후 M01 경유). 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/bzenty-add-reg/cmdty',
        element: <DmstLctnColInfoAddRegPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '업체정보 추가 등록' } },
      },
      {
        path: 'mypage/bzenty-add-reg/pic',
        element: <DmstLctnColInfoAddRegPagePic />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '업체정보 추가 등록' } },
      },
      {
        path: 'mypage/bzenty-add-reg/dms-agt',
        element: <DmstLctnColInfoAddRegPageCmbz />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '업체정보 추가 등록' } },
      },
      // 국외조달원등록증신청안내(MUI-CM-01-P21) — 마이페이지 > 업체정보관리 진입 안내(M01 미구현이라 라우트만 등록).
      //   3뎁스라 BottomNav 숨김(opt-in 생략).
      {
        path: 'mypage/ovs-dmst-sos',
        element: <OvsdmstSosCnfdoc />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '국외조달원등록증신청안내' } },
      },
      // 군수품무역대리업 신청 및 발급(MUI-CM-01-M15~M18) — 마이페이지 > 업체정보관리 > 군수품무역대리업 신청 목록.
      //   진입점: 업체정보관리(MUI-CM-01-M01) 미구현이라 라우트만 등록(진입 배선은 추후). 3뎁스라 BottomNav 숨김.
      //   M15 목록만 scrollReset(목록). M16 상세는 목록 카드→navigate state, M17/M18 은 목록 신청 시트에서 진입.
      {
        path: 'mypage/df-eqpmnt-trade-agnc',
        element: <DfEqpmntTradeAgncAplyListPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '군수품무역대리업 신청 및 발급' }, scrollReset: true },
      },
      {
        path: 'mypage/df-eqpmnt-trade-agnc/dtl',
        element: <DfEqpmntTradeAgncAplyDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '군수품무역대리업 상세정보' }, scrollReset: true },
      },
      {
        path: 'mypage/df-eqpmnt-trade-agnc/aply',
        element: <DfEqpmntTradeAgncAplyPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '군수품무역대리업 신규(갱신)' }, scrollReset: true },
      },
      {
        path: 'mypage/df-eqpmnt-trade-agnc/chg',
        element: <DfEqpmntTradeAgncChgPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '군수품무역대리업 변경' }, scrollReset: true },
      },
      // 관심입찰공고(MUI-CM-06-M05) — 마이페이지 > 관심입찰공고. 3뎁스라 BottomNav 숨김(opt-in 생략).
      {
        path: 'mypage/itrst-bid-pbanc',
        element: <ItrstBidPbancPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '관심입찰공고' }, scrollReset: true },
      },
      // 업무캘린더(MUI-CM-06-M06) — 마이페이지 > 업무캘린더. 3뎁스라 BottomNav 숨김(opt-in 생략).
      {
        path: 'mypage/task-cldr',
        element: <TaskCldrPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '업무캘린더' }, scrollReset: true },
      },
      // 나의진행업무현황(MUI-CM-06-M02) — 마이페이지 > 나의 진행 업무 현황. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/prgrs-hstry',
        element: <MyPrgrsHstryPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '나의 진행 업무 현황' }, scrollReset: true },
      },
      // 나의업무이력현황(MUI-CM-06-M04) — 마이페이지 > 나의 업무 이력 현황. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/task-hstry',
        element: <MyTaskHstryPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '나의 업무 이력 현황' }, scrollReset: true },
      },
      // 개인별수신처 관리(MUI-CM-06-M12) — 마이페이지 > 문서함 > 개인별수신처관리. 조회 전용, BottomNav 숨김.
      {
        path: 'mypage/indv-rcofc-mng',
        element: <IndvRcofcMngPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '개인별 수신처 관리' }, scrollReset: true },
      },
      // 관심법령(MUI-CM-06-M13) — 마이페이지 > 관심법령. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/itrst-stt',
        element: <ItrstSttPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '관심법령' }, scrollReset: true },
      },
      // 나의 게시물(MUI-CM-06-M17) — 마이페이지 > 나의 게시물. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/my-pst',
        element: <MyPstPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '나의 게시물' }, scrollReset: true },
      },
      // 디지털캐비닛(MUI-CM-06-M14) — 마이페이지 > 디지털캐비닛(폴더 목록). 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/digital-cabinet',
        element: <DigitalCabinetPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '디지털캐비닛' }, scrollReset: true },
      },
      // 폴더 내 파일 목록(MUI-CM-06-M16) — 마이페이지 > 디지털캐비닛 > 폴더. 정적 목록이 먼저 매칭.
      {
        path: 'mypage/digital-cabinet/:fldrSn',
        element: <DigitalCabinetFileListPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '폴더 내 파일 목록' }, scrollReset: true },
      },
      // 문서함 목록(MUI-CM-06-M10) — 마이페이지 > 문서함. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/doc-box',
        element: <DocBoxPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '문서함' }, scrollReset: true },
      },
      // 문서함 상세(MUI-CM-06-M11) — 마이페이지 > 문서함 > 문서함 상세. 정적 'doc-box' 목록이 먼저 매칭.
      {
        path: 'mypage/doc-box/:id',
        element: <DocBoxDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '문서함 상세' }, scrollReset: true },
      },
      // 개인정보수정(MUI-CM-02-M04) — 사용자정보관리 > 개인정보수정(비밀번호 인증 게이트). 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/indv-info-mdfcn',
        element: <IndvInfoMdfcnPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '개인정보수정' }, scrollReset: true },
      },
      // 알림서비스 신청 및 해지(MUI-CM-02-M09) — 마이페이지 > 알림 서비스 신청 및 해지.
      {
        path: 'mypage/noti-srvc-aply',
        element: <NotiSrvcAplyPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '알림서비스 신청' }, scrollReset: true },
      },
      // 사용자정보관리 허브(MUI-CM-02-M01) — 마이페이지 > 사용자 정보관리. 3뎁스라 BottomNav 숨김.
      {
        path: 'mypage/indv-info-mng',
        element: <IndvInfoMngPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '사용자 정보관리' }, scrollReset: true },
      },
      // 개인(생체)/비밀번호 인증(MUI-CM-02-M02) — 사용자정보관리 > 개인정보 접근 전 본인 인증.
      {
        path: 'mypage/indv-cert',
        element: <IndvCertPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '개인 인증' }, scrollReset: true },
      },
      // 개인정보상세(MUI-CM-02-M03) — 사용자정보관리 > 개인정보 상세(조회).
      {
        path: 'mypage/indv-info-dtl',
        element: <IndvInfoDtlPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '개인정보 상세' }, scrollReset: true },
      },
      // 비밀번호 변경(MUI-CM-02-M05) — 사용자정보관리 > 비밀번호 변경.
      {
        path: 'mypage/pswd-chg',
        element: <PswdChgPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '비밀번호 변경' }, scrollReset: true },
      },
      // 개인 신원 확인(MUI-CM-02-M06) — 사용자정보관리 > 개인신원확인(인증서 기반).
      {
        path: 'mypage/indv-idnt-idnty',
        element: <IndvIdntIdntyPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '개인 신원 확인' }, scrollReset: true },
      },
      // 업체 소속 사용자 목록(MUI-CM-02-M07) — 사용자정보관리 > 소속 사용자 목록(상태변경 P08 시트).
      {
        path: 'mypage/prcm-bzenty-user-mng',
        element: <PrcmBzentyUserMngPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '소속 사용자 목록' }, scrollReset: true },
      },
      // 회원탈퇴(MUI-CM-02-P10) — 사용자정보관리 > 회원탈퇴.
      {
        path: 'mypage/mb-withdrawal',
        element: <MbWithdrawalPage />,
        errorElement: <ErrorPage />,
        handle: { header: { variant: 'sub', title: '회원탈퇴' }, scrollReset: true },
      },
      // 로그인 방식선택(MUI-CM-03-M01) — 셸 안 + sub헤더(뒤로+타이틀). 헤더는 AppLayout 소유.
      {
        path: 'login',
        element: <MainLoginPage />,
        handle: { header: { variant: 'sub', title: '로그인' }, scrollReset: true },
      },
      // ID/PW 로그인(MUI-CM-03-M02) — 셸 안 + sub헤더.
      {
        path: 'login/id-pw',
        element: <IdPswdLoginPage />,
        handle: { header: { variant: 'sub', title: 'ID/PW 로그인' }, scrollReset: true },
      },
      // 아이디 찾기(MUI-CM-03-M03)
      {
        path: 'login/find-id',
        element: <IdFndngPage />,
        handle: { header: { variant: 'sub', title: '아이디 찾기' }, scrollReset: true },
      },
      // 비밀번호 찾기(MUI-CM-03-M06)
      {
        path: 'login/find-pw',
        element: <PswdFndngPage />,
        handle: { header: { variant: 'sub', title: '비밀번호 찾기' }, scrollReset: true },
      },
      // 사용자 등록 안내(MUI-CM-03-M09)
      {
        path: 'login/user-reg-info',
        element: <UserRegInfoPage />,
        handle: { header: { variant: 'sub', title: '사용자 등록 안내' }, scrollReset: true },
      },
      // 생체인증(MUI-CM-03-M14)
      {
        path: 'login/biometric',
        element: <BioInfoCertPage />,
        handle: { header: { variant: 'sub', title: '생체인증' } },
      },
      // PC QR 로그인(MUI-CM-03-M17)
      {
        path: 'login/pc-qr',
        element: <PcQRLgnPage />,
        handle: { header: { variant: 'sub', title: 'PC QR 로그인' } },
      },
      // ID 등록정보로 찾기(MUI-CM-03-M04)
      {
        path: 'login/find-id/reg-info',
        element: <IdRegInfoFndngPage />,
        handle: { header: { variant: 'sub', title: 'ID 등록정보로 찾기' }, scrollReset: true },
      },
      // 아이디 찾기 결과(MUI-CM-03-M05)
      {
        path: 'login/find-id/result',
        element: <IdRsltPage />,
        handle: { header: { variant: 'sub', title: '아이디 찾기' }, scrollReset: true },
      },
      // PW 등록정보로 찾기(MUI-CM-03-M07)
      {
        path: 'login/find-pw/reg-info',
        element: <PswdRegInfoFndngPage />,
        handle: { header: { variant: 'sub', title: '비밀번호 찾기' }, scrollReset: true },
      },
      // PW 찾기 결과(MUI-CM-03-M08)
      {
        path: 'login/find-pw/result',
        element: <PswdRsltPage />,
        handle: { header: { variant: 'sub', title: '비밀번호 찾기' }, scrollReset: true },
      },
      // 생체인증 등록(MUI-CM-03-M15)
      {
        path: 'login/biometric/register',
        element: <BioInfoCertRegPage />,
        handle: { header: { variant: 'sub', title: '생체인증 등록' } },
      },
      // 생체인증 등록완료(MUI-CM-03-M20)
      {
        path: 'login/biometric/register/result',
        element: <BioInfoCertRsltPage />,
        handle: { header: { variant: 'sub', title: '생체인증 등록' } },
      },
      // 통합로그인 계정등록(MUI-CM-03-M22)
      {
        path: 'login/new-id',
        element: <NewIdPwReg />,
        handle: { header: { variant: 'sub', title: '통합 로그인 계정 등록' }, scrollReset: true },
      },
      // 통합로그인 계정등록완료(MUI-CM-03-M23)
      {
        path: 'login/new-id/result',
        element: <NewIdCmptn />,
        handle: { header: { variant: 'sub', title: '통합 로그인 계정 등록 완료' }, scrollReset: true },
      },
      // 간편인증(MUI-CM-03-P10)
      {
        path: 'login/simple-cert',
        element: <SimpleCertPage />,
        handle: { header: { variant: 'sub', title: '간편인증' } },
      },
      // 금융인증서(MUI-CM-03-P11)
      {
        path: 'login/finance-cert',
        element: <FnstCertPage />,
        handle: { header: { variant: 'sub', title: '금융인증서' } },
      },
      // 공동인증서(MUI-CM-03-P12)
      {
        path: 'login/joint-cert',
        element: <JntCertPage />,
        handle: { header: { variant: 'sub', title: '공동인증서' } },
      },
      // 모바일 신분증(MUI-CM-03-P13)
      {
        path: 'login/mobile-id',
        element: <MobileIdntyCertPage />,
        handle: { header: { variant: 'sub', title: '모바일 신분증' } },
      },
      // 매칭 안 되는 경로 → 404 (errorElement 가 isRouteErrorResponse 404 로 렌더)
      { path: '*', element: <ErrorPage /> },
    ],
  },
  // 앱 실행 스플래시 — 셸(AppLayout) 밖 독립 풀스크린(헤더·바텀네비 없음).
  // lazy chunk 라서 Suspense 로 감싸고, 에러는 errorElement 로 처리.
  {
    path: ROUTES.SPLASH,
    element: (
      <Suspense fallback={<PageLoading />}>
        <SplashPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  // 앱 접근권한 동의 — 셸 밖 풀스크린.
  {
    path: ROUTES.APP_AUTHRT_AGRE,
    element: (
      <Suspense fallback={<PageLoading />}>
        <AppAuthrtAgrePage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  // 앱 이용안내 — 셸 밖 풀스크린.
  {
    path: ROUTES.APP_GUIDE,
    element: (
      <Suspense fallback={<PageLoading />}>
        <AppSrvcExplnPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
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
