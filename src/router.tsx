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
  import('@/ui/biz/home/HomePage').then((m) => ({ default: m.HomePage })),
)
// 조달계획 통합목록(MUI-OP-01-M01, 설계서 p.8) — biz/op 도메인.
const OpListPage = lazy(() =>
  import('@/ui/biz/op/OpListPage').then((m) => ({
    default: m.OpListPage,
  })),
)
const NoticePage = lazy(() =>
  import('@/ui/biz/notice/NoticePage').then((m) => ({ default: m.NoticePage })),
)
const NotificationPage = lazy(() =>
  import('@/ui/biz/notification/NotificationPage').then((m) => ({
    default: m.NotificationPage,
  })),
)
const MyPage = lazy(() =>
  import('@/ui/biz/mypage/MyPage').then((m) => ({ default: m.MyPage })),
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
      { index: true, element: <HomePage /> },
      { path: 'op', element: <OpListPage /> },
      { path: 'notice', element: <NoticePage /> },
      { path: 'notification', element: <NotificationPage /> },
      { path: 'mypage', element: <MyPage /> },
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
