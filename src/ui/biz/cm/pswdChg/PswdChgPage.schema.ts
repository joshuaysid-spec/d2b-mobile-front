// MUI-CM-02-M05 비밀번호 변경 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// 설계서(공통설계서 v0.84 slide197) 유효성 규칙/문구 그대로:
//   - 새 비밀번호: 9~16자 + 숫자·영문 소문자·특수문자 조합.
//   - 입력 불가 특수문자 포함 시 별도 안내(조합 규칙보다 우선 표시).
//   - 새 비밀번호 확인 불일치 시 안내.
//
// TODO(설계서 확인): 현재/새 비밀번호 항목의 영문 항목 ID 는 설계서 데이터영역에 미제공.
//   idPswdLogin·pswdRslt 와 동일하게 임시로 currentPassword/newPassword/newPasswordConfirm 사용
//   — 백엔드 비밀번호변경 API 스펙 확정 시 키만 교체.
import { z } from 'zod'

// 입력 불가 특수문자(설계서 slide197): `~&()_{}[]\:;"',.<>?/
const FORBIDDEN_SPECIAL = /[`~&()_{}[\]\\:;"',.<>?/]/
// 조합 규칙: 숫자 + 영문 소문자 + 특수문자(영숫자 외 문자)
const HAS_DIGIT = /[0-9]/
const HAS_LOWER = /[a-z]/
const HAS_SPECIAL = /[^a-zA-Z0-9]/

// 설계서 slide197 안내 문구 그대로.
const MSG_RULE = '비밀번호는 9~16자로 숫자, 영문 소문자, 특수문자 조합으로 입력해주세요.'
const MSG_FORBIDDEN = '입력 불가능한 특수문자를 제외하고 비밀번호를 입력해주세요.'
const MSG_MISMATCH = '동일한 비밀번호를 다시 한번 입력해주세요.'
// 현재 비밀번호 필수 안내(설계서 미제공 UX 문구 — 미입력 방지용).
const MSG_CURRENT_REQUIRED = '현재 비밀번호를 입력해주세요.'

// 새 비밀번호: 입력 불가 특수문자 검사(우선) → 조합/길이 규칙 검사.
// 체인 순서 = 에러 우선순위(입력 불가 특수문자가 있으면 그 메시지가 먼저 표시됨).
const newPasswordField = z
  .string()
  .refine((val) => !FORBIDDEN_SPECIAL.test(val), { error: MSG_FORBIDDEN })
  .refine(
    (val) =>
      val.length >= 9 &&
      val.length <= 16 &&
      HAS_DIGIT.test(val) &&
      HAS_LOWER.test(val) &&
      HAS_SPECIAL.test(val),
    { error: MSG_RULE },
  )

export const pswdChgSchema = z
  .object({
    // 현재 비밀번호 — 필수(권위 검증은 서버, 프론트는 미입력 방지).
    currentPassword: z.string().min(1, { error: MSG_CURRENT_REQUIRED }),
    // 새 비밀번호 — 9~16자 조합 규칙 + 입력 불가 특수문자 제외.
    newPassword: newPasswordField,
    // 새 비밀번호 확인 — 미입력/불일치 시 동일 문구 안내.
    newPasswordConfirm: z.string().min(1, { error: MSG_MISMATCH }),
  })
  // 새 비밀번호 확인 불일치 검사 — 에러는 확인 필드에 표시.
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    error: MSG_MISMATCH,
    path: ['newPasswordConfirm'],
  })

export type PswdChgForm = z.infer<typeof pswdChgSchema>
