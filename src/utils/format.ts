// frontend-architecture.md §9.1 — 금액/날짜 포맷 순수 함수

export function formatAmount(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('ko-KR')
}
