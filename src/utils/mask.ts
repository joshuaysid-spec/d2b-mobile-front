// frontend-architecture.md §9.1 — 민감정보 마스킹 순수 함수

export function maskPhone(phone: string): string {
  return phone.replace(/(\d{2,3})\d{3,4}(\d{4})/, '$1****$2')
}

export function maskName(name: string): string {
  if (name.length < 2) return name
  return `${name[0]}${'*'.repeat(name.length - 1)}`
}
