import { create } from 'zustand'
import type { User } from '@/types/domain'

// frontend-architecture.md §8.1 — 사용자 정보 상태
interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
