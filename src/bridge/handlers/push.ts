import { postToNative } from '../native'

// frontend-architecture.md §6.2 — 푸시 알림 토큰 조회/등록
export const push = {
  getToken(): void {
    postToNative({ handler: 'push', action: 'getToken' })
  },
}
