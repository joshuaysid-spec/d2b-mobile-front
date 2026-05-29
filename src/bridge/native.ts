import type { BridgeMessage, NativeOS } from './types'

// frontend-architecture.md §6.2 — OS 감지 + postMessage 추상화
const DEBUG = import.meta.env.VITE_BRIDGE_DEBUG === 'true'

interface NativeWindow {
  webkit?: {
    messageHandlers?: Record<string, { postMessage: (msg: unknown) => void }>
  }
  AndroidBridge?: { postMessage: (msg: string) => void }
}

export function detectOS(): NativeOS {
  const ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  return 'web'
}

// iOS(webkit.messageHandlers) / Android(AndroidBridge) 차이를 흡수.
// 브라우저(web) 환경에서는 mock 으로 콘솔 출력만 수행.
export function postToNative(message: BridgeMessage): void {
  const os = detectOS()
  const w = window as unknown as NativeWindow

  if (os === 'ios' && w.webkit?.messageHandlers?.[message.handler]) {
    w.webkit.messageHandlers[message.handler].postMessage(message)
    return
  }
  if (os === 'android' && w.AndroidBridge) {
    w.AndroidBridge.postMessage(JSON.stringify(message))
    return
  }
  if (DEBUG) {
    console.info('[bridge:mock]', message)
  }
}
