// frontend-architecture.md §9.1 — 금액/날짜 포맷 순수 함수

export function formatAmount(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('ko-KR')
}

/**
 * 날짜 입력 마스킹 — 숫자만 남기고 YYYY-MM-DD 형태로 하이픈 자동 삽입.
 * 최대 8자리(YYYYMMDD). 입력 도중 부분 상태도 그대로 반환한다.
 *   '2024'       → '2024'
 *   '20240'      → '2024-0'
 *   '202401'     → '2024-01'
 *   '20240131'   → '2024-01-31'
 *   '2024a01b31' → '2024-01-31'  (비숫자 제거 후 재포맷)
 */
export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts: string[] = [digits.slice(0, 4)]
  if (digits.length > 4) parts.push(digits.slice(4, 6))
  if (digits.length > 6) parts.push(digits.slice(6, 8))
  return parts.join('-')
}
