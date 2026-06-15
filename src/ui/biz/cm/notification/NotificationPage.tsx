import { useEffect } from 'react'

import { PageContainer } from '@/ui/common/layout/PageContainer'
import { useAuthStore } from '@/stores/authStore'

// 빈 페이지 — 알림 도메인. 기능 구현 시 이 파일을 채운다.
export function NotificationPage() {
  const markAllRead = useAuthStore((s) => s.markAllRead)

  // 알림 화면 진입 = 읽음 처리 → BottomNav dot 제거.
  // 추후 API: notificationService.markAllRead() 호출 후 store 동기화.
  useEffect(() => {
    markAllRead()
  }, [markAllRead])

  return (
    <PageContainer title="알림">
      <p className="text-sm text-muted-foreground">준비 중인 화면입니다.</p>
    </PageContainer>
  )
}
