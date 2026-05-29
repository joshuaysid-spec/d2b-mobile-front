import { bridge } from '@/bridge'

// frontend-architecture.md §8.2 — bridge 호출을 컴포넌트에서 쉽게 쓰는 wrapper
export function useBridge() {
  return bridge
}
