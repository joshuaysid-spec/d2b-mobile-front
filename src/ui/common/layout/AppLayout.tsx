import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { BottomNav } from '@/ui/common/composites/BottomNav'
import { Header } from '@/ui/common/composites/Header'
import { PageLoading } from '@/ui/common/feedback/PageLoading'

// 모바일 앱 셸 — Header(고정 크롬) + 본문(Outlet, 내부 스크롤) + BottomNav(fixed).
// 스크롤 구조: 외곽을 h-dvh + overflow-hidden 으로 뷰포트에 고정하고, main 만 min-h-0 + overflow-y-auto
//   로 내부 스크롤시킨다. → Header/BottomNav 가 스크롤 영역 밖 고정 크롬이 되고, 페이지의 sticky top-0
//   블록이 Header 아래에 자연히 붙는다(window 스크롤 시 겹치던 문제 해소). 맨위로 FAB 는 #app-scroll 참조.
// 본문(Outlet)은 lazy chunk 라서 Suspense 로 감싸 PageLoading 표시.
// 에러(청크 로드 실패·렌더 throw)는 router 의 errorElement(ErrorPage)가 처리한다.
export function AppLayout() {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-background">
      <Header />
      <main id="app-scroll" className="min-h-0 flex-1 overflow-y-auto pb-16">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}
