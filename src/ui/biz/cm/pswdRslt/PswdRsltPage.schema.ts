// MUI-CM-03-M08 비밀번호 찾기 결과(성공) — 비밀번호 변경 폼 검증 스키마. 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// 규칙 출처: 설계서 slide47(도움말) 그대로
//   - '비밀번호는 9~16자 숫자, 영문 소문자, 특수문자 조합으로 입력하세요.'
//   - '입력 불가한 특수문자 : `~&()_{}[]|\:;"\',.<>?/'
//
// TODO(설계서 확인): 새 비밀번호/비밀번호 확인 항목의 영문 항목 ID 는 설계서 데이터영역에 미제공.
//   임시로 password / passwordConfirm 사용 — 백엔드 비밀번호 변경 API 스펙 확정 시 키만 교체.
import { z } from 'zod'

// 입력 불가 특수문자(설계서 slide47 목록 그대로): ` ~ & ( ) _ { } [ ] | \ : ; " ' , . < > ? /
const FORBIDDEN_SPECIAL = /[`~&()_{}[\]|\\:;"',.<>?/]/

// 조합 안내 문구(설계서 도움말) — 규칙 위반 시 공통으로 노출.
const COMBINATION_MESSAGE = '9~16자 숫자, 영문 소문자, 특수문자를 조합해주세요.'

export const pswdRsltSchema = z
  .object({
    // 새 비밀번호 — 9~16자 + 영문 소문자/숫자/특수문자 조합 + 입력 불가 특수문자 제외.
    password: z
      .string()
      .min(9, { error: COMBINATION_MESSAGE })
      .max(16, { error: COMBINATION_MESSAGE })
      .regex(/[a-z]/, { error: COMBINATION_MESSAGE }) // 영문 소문자 포함
      .regex(/[0-9]/, { error: COMBINATION_MESSAGE }) // 숫자 포함
      .regex(/[^A-Za-z0-9]/, { error: COMBINATION_MESSAGE }) // 특수문자 포함
      .refine((v) => !FORBIDDEN_SPECIAL.test(v), {
        error: '입력 불가한 특수문자가 포함되어 있습니다.',
      }),
    // 새 비밀번호 확인 — 미입력 안내 후, 아래 refine 으로 일치 검증.
    passwordConfirm: z.string().min(1, { error: '새 비밀번호를 한번 더 입력해주세요.' }),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    error: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })

export type PswdRsltForm = z.infer<typeof pswdRsltSchema>
