// MUI-CM-03-M02 ID/PW 로그인 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// TODO(설계서 확인): 로그인 아이디/비밀번호 항목의 영문 항목 ID 는 설계서 데이터영역에 미제공.
//   임시로 userId / password 사용 — 백엔드 로그인 API 스펙 확정 시 키만 교체.
import { z } from 'zod'

export const idPswdLoginSchema = z.object({
  // 아이디 — 미입력 시 설계서 문구 그대로 안내(placeholder = 유효성 메시지 영역).
  userId: z.string().min(1, { error: '아이디를 입력해주세요' }),
  // 비밀번호 — 미입력 시 안내. 5회 오입력 3분 제한은 서버 검증(프론트는 사전 UX 검증만).
  password: z.string().min(1, { error: '비밀번호를 입력해주세요' }),
})

export type IdPswdLoginForm = z.infer<typeof idPswdLoginSchema>
