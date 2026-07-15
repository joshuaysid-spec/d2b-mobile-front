// frontend-architecture.md §9.1 — 금액/날짜 포맷 순수 함수

export function formatAmount(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

/**
 * 파일 크기(byte)를 표시 문자열로 변환.
 *   524288  → '512KB'
 *   1258291 → '1.2MB'
 *   800     → '800B'
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)}KB`
  return `${(kb / 1024).toFixed(1)}MB`
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

/**
 * 휴대번호 입력 마스킹 — 숫자만 남기고 010-1234-5678 형태로 하이픈 자동 삽입.
 * 최대 11자리. 10자리(구번호)는 3-3-4, 11자리는 3-4-4 로 끊는다.
 * 입력 도중 부분 상태도 그대로 반환한다.
 *   '010'         → '010'
 *   '0101234'     → '010-1234'      (입력 중)
 *   '01012345678' → '010-1234-5678'
 *   '0111234567'  → '011-123-4567'
 *   '010a1234'    → '010-1234'      (비숫자 제거 후 재포맷)
 */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length < 11) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}
