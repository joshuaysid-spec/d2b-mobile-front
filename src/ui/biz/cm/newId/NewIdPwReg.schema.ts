// MUI-CM-03-M22 통합로그인 계정등록 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// 설계서(00.공통 v0.84 slide35·slide36) 유효성 규칙/문구 그대로:
//   - 주민등록번호(userRrno): 13자리(######-#######). '본인인증하기' 전 단계에서만 검증.
//   - 통합계정아이디(userId): 필수(미입력 안내) + 최대 16자.
//   - 비밀번호(userEnpswd): 9~16자 + 숫자·영문 소문자·특수문자 조합. 입력 불가 특수문자 우선 안내.
//   - 비밀번호 확인(userEnpswdChk): 상기 비밀번호와 일치(일치 시 메시지 없음).
//
// TODO(설계서 확인): 통합계정아이디 항목의 영문 항목 ID 는 slide36 데이터영역에 미제공(빈 칸).
//   로그인 계열 규약(userId)에 맞춰 임시 키 userId 사용 — 백엔드 통합계정 API 스펙 확정 시 키만 교체.
//   (성명 userNm·주민등록번호 userRrno·비밀번호 userEnpswd·비밀번호확인 userEnpswdChk 는 slide36 데이터영역 그대로)
import { z } from 'zod'

// 입력 불가 특수문자(설계서 slide35): `~&()_{}[]|\:;"',.<>?/
const FORBIDDEN_SPECIAL = /[`~&()_{}[\]|\\:;"',.<>?/]/
// 조합 규칙: 숫자 + 영문 소문자 + 특수문자(영숫자 외 문자)
const HAS_DIGIT = /[0-9]/
const HAS_LOWER = /[a-z]/
const HAS_SPECIAL = /[^a-zA-Z0-9]/

// 설계서 slide35 안내 문구 그대로.
const MSG_RRNO_REQUIRED = '주민등록번호를 입력하세요.'
const MSG_RRNO_FORMAT = '주민등록번호 13자리를 정확히 입력해주세요.'
const MSG_ID_REQUIRED = '통합 계정 아이디를 입력해주세요.'
const MSG_PW_FORBIDDEN = '입력 불가 특수문자를 제외하고 비밀번호를 입력해주세요.'
const MSG_PW_RULE = '9~16자 숫자, 영문 소문자, 특수문자 조합으로 입력해주세요.'
// 비밀번호 확인 — slide35 는 '일치 시 메시지 없음' 만 규정, 불일치 문구 미제공(로그인 계열 UX 문구 재사용).
const MSG_PW_MISMATCH = '동일한 비밀번호를 다시 한번 입력해주세요.'

// 비밀번호: 입력 불가 특수문자 검사(우선) → 조합/길이 규칙 검사. 체인 순서 = 에러 우선순위.
const passwordField = z
  .string()
  .refine((val) => !FORBIDDEN_SPECIAL.test(val), { error: MSG_PW_FORBIDDEN })
  .refine(
    (val) =>
      val.length >= 9 &&
      val.length <= 16 &&
      HAS_DIGIT.test(val) &&
      HAS_LOWER.test(val) &&
      HAS_SPECIAL.test(val),
    { error: MSG_PW_RULE },
  )

export const newIdPwRegSchema = z
  .object({
    // 주민등록번호 — 13자리(######-#######). '본인인증하기' 단계에서만 trigger.
    userRrno: z
      .string()
      .min(1, { error: MSG_RRNO_REQUIRED })
      .regex(/^\d{6}-\d{7}$/, { error: MSG_RRNO_FORMAT }),
    // 통합계정아이디 — 필수 + 최대 16자.
    userId: z.string().min(1, { error: MSG_ID_REQUIRED }).max(16, { error: MSG_ID_REQUIRED }),
    // 비밀번호 — 9~16자 조합 규칙 + 입력 불가 특수문자 제외.
    userEnpswd: passwordField,
    // 비밀번호 확인 — 미입력/불일치 시 동일 문구 안내.
    userEnpswdChk: z.string().min(1, { error: MSG_PW_MISMATCH }),
  })
  // 비밀번호 확인 불일치 검사 — 에러는 확인 필드에 표시.
  .refine((data) => data.userEnpswd === data.userEnpswdChk, {
    error: MSG_PW_MISMATCH,
    path: ['userEnpswdChk'],
  })

export type NewIdPwRegForm = z.infer<typeof newIdPwRegSchema>
