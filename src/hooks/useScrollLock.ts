import { useEffect } from 'react'

// frontend-architecture.md §8.2 — 모달 오픈 시 배경 스크롤 잠금
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [locked])
}
