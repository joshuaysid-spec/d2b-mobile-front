import { create } from 'zustand'
import type { User } from '@/types/domain'

// frontend-architecture.md §8.1 — 클라이언트 전역 상태(통합 store).
// 인증(토큰/로그인) · 사용자 프로필 · 알림 배지를 한 store 로 관리한다.
// BottomNav 등 범용 컴포넌트는 이 store 를 직접 import 하지 않는다 — AppLayout 이 구독해 prop 으로 주입.
// 알림 갱신 소스(초기 조회 / 네이티브 푸시 브리지 / 읽음 처리)가 여러 개라 setter 를 함께 둠.
interface AuthState {
  // --- 인증 ---
  accessToken: string | null
  isLoggedIn: boolean
  setAccessToken: (token: string | null) => void
  /** 로그아웃 — 토큰/유저/알림 등 클라이언트 상태 전체 초기화. */
  logout: () => void

  // --- 사용자 프로필 ---
  user: User | null
  setUser: (user: User | null) => void

  // --- 알림 배지 ---
  /** 새(미읽음) 알림 존재 여부 → 알림 탭 빨강 dot. */
  hasUnread: boolean
  setHasUnread: (hasUnread: boolean) => void
  /** 알림 화면 진입 등 읽음 처리 시 dot 제거용 단축 setter. */
  markAllRead: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn: Boolean(token) }),
  logout: () => set({ accessToken: null, isLoggedIn: false, user: null, hasUnread: false }),

  user: null,
  setUser: (user) => set({ user }),

  hasUnread: false,
  setHasUnread: (hasUnread) => set({ hasUnread }),
  markAllRead: () => set({ hasUnread: false }),
}))
