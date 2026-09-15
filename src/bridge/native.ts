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

// 하이브리드 앱(WebView) 안인지 — 앱이 주입하는 브리지 객체(iOS webkit.messageHandlers / Android AndroidBridge) 유무로 판정.
//   브라우저(PC·모바일 웹)에서는 둘 다 없어 false. 앱에서만 보일 UI(최초 기동 온보딩 등)의 게이트.
//   ⚠️ 앱 쪽이 페이지 로드 전에 브리지를 주입하는 게 전제 — 안 되면 UA 토큰(예 'D2BApp/') 합의 후 아래 조건에 추가.
//   개발망 브라우저 테스트: DEV 에서 ?app=1 로 진입하면 앱으로 간주.
export function isNativeApp(): boolean {
  const w = window as unknown as NativeWindow
  if (w.AndroidBridge || w.webkit?.messageHandlers) return true
  return import.meta.env.DEV && new URLSearchParams(location.search).has('app')
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
