// MUI-CM-03-M15 생체인증 등록 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// 설계서(slide55) 회원 정보 입력: 성명 * 필수 · 아이디 * 필수.
//   Figma(10020:87131) 표시 순서는 아이디 → 성명. (필드 자체는 설계서·Figma 동일)
//
// TODO(설계서 확인): 성명/아이디 항목의 영문 항목 ID 는 로그인 설계서 데이터영역에 미제공.
//   임시로 userName / userId 사용 — 백엔드 회원인증 API 스펙 확정 시 키만 교체.
import { z } from 'zod'

export const bioInfoCertRegSchema = z.object({
  // 아이디 — 미입력 시 설계서 placeholder 문구 그대로 안내.
  userId: z.string().min(1, { error: '아이디를 입력해주세요' }),
  // 성명 — 미입력 시 설계서 placeholder 문구 그대로 안내.
  userName: z.string().min(1, { error: '성명을 입력해주세요' }),
})

export type BioInfoCertRegForm = z.infer<typeof bioInfoCertRegSchema>
