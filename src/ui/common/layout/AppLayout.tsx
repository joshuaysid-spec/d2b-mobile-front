import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { BottomNav } from '@/ui/common/composites/BottomNav'
import { Header } from '@/ui/common/composites/Header'
import { PageLoading } from '@/ui/common/feedback/PageLoading'

// 모바일 앱 셸 — Header + 본문(Outlet) + BottomNav.
// 본문(Outlet)은 lazy chunk 라서 Suspense 로 감싸 PageLoading 표시.
// 에러(청크 로드 실패·렌더 throw)는 router 의 errorElement(ErrorPage)가 처리한다.
// 개별 페이지가 더 정교한 fallback(예: 페이지별 스켈레톤)을 원하면 페이지 안에서
// 또 다른 <Suspense fallback={<XxxSkeleton/>}> 로 자식 lazy 청크를 감싸면 됨.
export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-16">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}
