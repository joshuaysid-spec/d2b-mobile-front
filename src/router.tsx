import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/ui/common/layout/AppLayout'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { ErrorPage } from '@/ui/biz/cm/error/ErrorPage'
import { ROUTES } from '@/constants/routes'

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
const NotiPrstPage = lazy(() =>
  import('@/ui/biz/cm/notiPrst/NotiPrstPage').then((m) => ({
    default: m.NotiPrstPage,
  })),
)
const SupportPage = lazy(() =>
  import('@/ui/biz/cm/support/SupportPage').then((m) => ({ default: m.SupportPage })),
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
      // 2뎁스(메뉴) → sub/util='search'(뒤로+타이틀+통합검색) · 상세 → sub/util='home'(뒤로+타이틀+홈)
      {
        path: 'op',
        element: <PrcmPlanIntgListPage />,
        // 목록 → 상세 → 뒤로 시 스크롤 복원 대신 항상 맨 위(scrollReset).
        handle: {
          header: { variant: 'sub', util: 'search', title: '조달계획' },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'bd',
        element: <BidPbancIntgListPage />,
        handle: {
          header: { variant: 'sub', util: 'search', title: '입찰공고' },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'bd/opbid',
        element: <BdopnListPage />,
        handle: {
          header: { variant: 'sub', util: 'search', title: '개찰목록' },
        },
      },
      {
        path: 'bd/prgrs',
        element: <BidPrgrsListForBzentyPage />,
        handle: {
          header: { variant: 'sub', util: 'search', title: '입찰진행' },
          scrollReset: true,
          showBottomNav: true,
        },
      },
      {
        path: 'bd/prgrs/:id',
        element: <BidPrgsDtlInqPage />,
        handle: { header: { variant: 'sub', util: 'home', title: '입찰진행 상세' } },
      },
      {
        path: 'bd/reg-rslt',
        element: <BidRegRsltInqPage />,
        handle: { header: { variant: 'sub', util: 'home', title: '입찰등록심사 결과조회' } },
      },
      {
        path: 'bd/srng-rslt',
        element: <BfhdSrngRsltInqPage />,
        handle: { header: { variant: 'sub', util: 'home', title: '사전심사(PQ) 결과조회' } },
      },
      {
        path: 'bd/:id',
        element: <BidPbancDtlPage />,
        handle: { header: { variant: 'sub', util: 'home', title: '입찰공고 상세' } },
      },
      {
        path: 'op/:id',
        element: <PrcmPlanDtlPage />,
        handle: {
          header: { variant: 'sub', util: 'home', title: '조달계획 상세' },
        },
      },
      {
        path: 'op/spec/:id',
        element: <BfhdSpcfctDtlPage />,
        handle: { header: { variant: 'sub', util: 'home', title: '사전규격 상세' } },
      },
      {
        path: 'op/ovs/:id',
        element: <OvsPrcmPlanDtlPage />,
        handle: { header: { variant: 'sub', util: 'home', title: '국외 조달계획 상세' } },
      },
      {
        path: 'notification',
        element: <NotiPrstPage />,
        handle: { scrollReset: true, showBottomNav: true },
      },
      { path: 'support', element: <SupportPage />, handle: { showBottomNav: true } },
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
