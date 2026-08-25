// 보유 인증서 목업 — 인증서 관리(M14)·내보내기(M17) 등이 공유. 추후 스마트PKI 솔루션 연동.
import type { MockCertItem } from '@/types/mock/cm'

export const MOCK_CERTS: MockCertItem[] = [
  { id: '1', issuer: '한국정보인증', certNm: '인증서 타이틀명 1', validUntil: '2026-07-11' },
  { id: '2', issuer: '한국정보인증', certNm: '인증서 타이틀명 2', validUntil: '2026-07-11' },
  { id: '3', issuer: '코스콤', certNm: '인증서 타이틀명 3', validUntil: '2026-07-11' },
]
