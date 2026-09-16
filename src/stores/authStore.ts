import { create } from 'zustand'
import { STORAGE_KEYS } from '@/constants/storage'
import { USE_MOCK } from '@/lib/env'
import type { MockUser } from '@/types/mock/domain'

// frontend-architecture.md §8.1 — 클라이언트 전역 상태(통합 store).
// 인증(토큰/로그인) · 사용자 프로필 · 알림 배지를 한 store 로 관리한다.
// BottomNav 등 범용 컴포넌트는 이 store 를 직접 import 하지 않는다 — AppLayout 이 구독해 prop 으로 주입.
// 알림 갱신 소스(초기 조회 / 네이티브 푸시 브리지 / 읽음 처리)가 여러 개라 setter 를 함께 둠.
// 전역 토스트도 여기 둔다 — 화면별 store 분리 금지 규칙에 따라 store 는 이 하나로 유지.
interface AuthState {
  // --- 인증 ---
  accessToken: string | null
  isLoggedIn: boolean
  setAccessToken: (token: string | null) => void
  /** 로그아웃 — 토큰/유저/알림 등 클라이언트 상태 전체 초기화. */
  logout: () => void

  // --- 사용자 프로필 ---
  user: MockUser | null
  setUser: (user: MockUser | null) => void

  // --- 알림 배지 ---
  /** 새(미읽음) 알림 존재 여부 → 알림 탭 빨강 dot. */
  hasUnread: boolean
  setHasUnread: (hasUnread: boolean) => void
  /** 알림 화면 진입 등 읽음 처리 시 dot 제거용 단축 setter. */
  markAllRead: () => void

  // --- 전역 토스트 ---
  /** 현재 안내 토스트(null=없음). 렌더는 App 최상위의 GlobalToast 하나가 담당. */
  toast: ToastState | null
  /** 토스트 띄우기 — 화면·훅 어디서든. 모듈 함수 showToast 로도 호출된다. */
  showToast: (message: string, duration?: number) => void
  hideToast: () => void
}

/** 전역 토스트 1건. seq 는 같은 문구 연속 호출도 다시 뜨게 하는 구분자. */
interface ToastState {
  message: string
  duration?: number
  seq: number
}

// 목업 모드: 로그인 상태 기본값 — 업체담당자 전용 화면(국외 보관함 등) 테스트용.
// 실모드: localStorage 토큰으로 부팅(WebView 재로드 후 세션 유지). apiClient 요청 인터셉터도
// localStorage 를 읽으므로 setAccessToken/logout 이 store·localStorage 를 함께 갱신한다(브리지).
const initialToken = USE_MOCK
  ? 'mock-access-token'
  : localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initialToken,
  isLoggedIn: Boolean(initialToken),
  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    }
    set({ accessToken: token, isLoggedIn: Boolean(token) })
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    set({ accessToken: null, isLoggedIn: false, user: null, hasUnread: false })
  },

  user: USE_MOCK
    ? { customerNo: '0012345678', name: '홍길동', lastLoginAt: '2026-08-30 09:12:45' }
    : null, // 목업 사용자
  setUser: (user) => set({ user }),

  hasUnread: false,
  setHasUnread: (hasUnread) => set({ hasUnread }),
  markAllRead: () => set({ hasUnread: false }),

  toast: null,
  showToast: (message, duration) =>
    set((s) => ({ toast: { message, duration, seq: (s.toast?.seq ?? 0) + 1 } })),
  hideToast: () => set({ toast: null }),
}))

/**
 * 전역 토스트 단축 호출 — React 컴포넌트 밖(쿼리 훅 onSuccess, 이벤트 핸들러)에서도 쓴다.
 *   showToast('저장되었습니다.')
 * 화면마다 useState + <Toast> 를 두지 않는다(렌더는 GlobalToast 하나).
 */
export const showToast = (message: string, duration?: number) =>
  useAuthStore.getState().showToast(message, duration)
