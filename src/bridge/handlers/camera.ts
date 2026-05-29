import { postToNative } from '../native'

// frontend-architecture.md §6.2 — 카메라 호출 인터페이스
export const camera = {
  take(): void {
    postToNative({ handler: 'camera', action: 'take' })
  },
}
