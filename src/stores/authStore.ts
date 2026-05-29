import { create } from 'zustand'

// frontend-architecture.md §8.1 — 인증 클라이언트 상태
interface AuthState {
  accessToken: string | null
  isLoggedIn: boolean
  setAccessToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn: Boolean(token) }),
  logout: () => set({ accessToken: null, isLoggedIn: false }),
}))
