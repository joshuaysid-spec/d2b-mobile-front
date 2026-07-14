// MUI-CM-03-M06 비밀번호 찾기 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// TODO(설계서 확인): 아이디 항목의 영문 항목 ID 는 설계서 데이터영역에 미제공.
//   idPswdLogin 과 동일하게 임시로 userId 사용 — 백엔드 로그인/비번찾기 API 스펙 확정 시 키만 교체.
import { z } from 'zod'

export const pswdFndngSchema = z.object({
  // 아이디 — 미입력/없는 아이디로 인증방식 클릭 시 설계서 문구 그대로 안내(slide44 유효성 메시지).
  userId: z.string().min(1, { error: '아이디를 정확히 입력해주세요.' }),
})

export type PswdFndngForm = z.infer<typeof pswdFndngSchema>
