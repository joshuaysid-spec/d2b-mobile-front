import { detectOS } from '../native'

// frontend-architecture.md §6.2 — 네이티브 → 웹 인바운드 핸들러.
// 아웃바운드(postToNative: 웹→네이티브)와 달리 "구독" 형태다 — 네이티브 하드웨어 백(Android)/
// 스와이프백(iOS)이 눌리면 네이티브 셸이 웹의 전역 훅을 호출하고, 그게 등록된 콜백을 실행한다.
// 실제 연동(전역 훅 규약·셸 측 호출)은 네이티브 개발자가 채운다. 여기선 인터페이스 + 브라우저 no-op 만.

interface NativeBackWindow {
  /** 네이티브 셸이 하드웨어 백 시 호출하는 전역 훅(웹이 콜백을 등록). */
  __onNativeBack?: () => void
}

export const navigation = {
  /**
   * 네이티브 하드웨어 백/스와이프백 콜백 등록. 반환값 = 해제 함수.
   * - ios/android: `window.__onNativeBack` 에 연결 — 네이티브 셸이 백 시 이 훅을 호출한다
   *   (전역 훅 이름·호출 규약은 네이티브 개발자와 확정 후 이 분기만 교체).
   * - web(브라우저): 네이티브 백 이벤트 소스가 없으므로 no-op(빈 구현) — 등록만 되고 콜백은 안 불린다.
   */
  onBack(cb: () => void): () => void {
    const os = detectOS()
    if (os === 'ios' || os === 'android') {
      const w = window as unknown as NativeBackWindow
      w.__onNativeBack = cb
      return () => {
        if (w.__onNativeBack === cb) w.__onNativeBack = undefined
      }
    }
    // 브라우저용 빈 구현 — 네이티브 백 소스가 없어 아무것도 안 한다.
    return () => {}
  },
}
