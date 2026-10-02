import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

// useState + sessionStorage 미러링. 뒤로가기(POP)로 화면에 되돌아올 때 떠나기 직전 상태를 되살리는 용도
//   (AppLayout 의 스크롤 위치 저장과 같은 저장소·같은 수명 — 탭/세션 동안만, WebView reload 에도 유지).
// restore=false 면 저장값을 무시하고 initial 로 시작한다(새 진입 PUSH). 값은 마운트 시 1회만 읽는다.
// try/catch 이유: 하이브리드 WebView 가 DOM 스토리지를 막은 환경에선 접근이 예외를 던진다 —
//   저장 못 해도 화면은 정상 동작해야 하므로 조용히 포기한다.
export function useSessionState<T>(
  key: string,
  initial: T,
  restore: boolean,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (!restore) return initial
    try {
      const raw = sessionStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* 스토리지 차단 환경 — 복원 못 해도 무시 */
    }
  }, [key, state])
  return [state, setState]
}
