import { postToNative } from '../native'

// frontend-architecture.md §6.2 — 생체인증(지문/얼굴) 호출
export const auth = {
  authenticate(): void {
    postToNative({ handler: 'auth', action: 'authenticate' })
  },
}
