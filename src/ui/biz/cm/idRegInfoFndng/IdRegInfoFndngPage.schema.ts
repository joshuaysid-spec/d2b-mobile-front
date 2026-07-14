// MUI-CM-03-M04 ID 등록정보로 찾기 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// TODO(설계서 확인): 사업자등록번호/사용자명/사용자 생년월일 항목의 영문 항목 ID 는
//   설계서 데이터영역에 미제공. idPswdLogin 규약(userId 등)에 맞춰 임시 키(bizRegNo/userName/birthDate)
//   사용 — 백엔드 아이디찾기 API 스펙 확정 시 키만 교체. (사용자 구분 '조달업체'는 표시 전용이라 스키마 제외)
import { z } from 'zod'

export const idRegInfoFndngSchema = z.object({
  // 사업자등록번호 — 필수, '-' 없이 숫자만(설계서 콘텐츠영역: "'-' 없이 입력해주세요").
  bizRegNo: z.string().min(1, { error: '사업자등록번호를 입력해주세요' }),
  // 사용자명 — 필수, 공백없이(설계서: "공백없이 입력해주세요").
  userName: z.string().min(1, { error: '사용자명을 입력해주세요' }),
  // 사용자 생년월일 — 필수, 6자리(설계서 2026-07-01 개정: 주민등록번호 삭제 → 생년월일 6자리).
  birthDate: z
    .string()
    .regex(/^\d{6}$/, { error: '생년월일 6자리를 입력해주세요' }),
})

export type IdRegInfoFndngForm = z.infer<typeof idRegInfoFndngSchema>
