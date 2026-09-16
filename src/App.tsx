import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'
import { GlobalToast } from '@/ui/common/layout/GlobalToast'

// frontend-architecture.md §5 — 최상위 Provider 래핑
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* 전역 안내 토스트 — position:fixed 라 라우터 밖에 둬도 화면 하단에 뜬다(셸 밖 라우트까지 커버). */}
      <GlobalToast />
    </QueryClientProvider>
  )
}
