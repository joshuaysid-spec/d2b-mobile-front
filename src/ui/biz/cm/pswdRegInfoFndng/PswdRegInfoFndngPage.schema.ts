// MUI-CM-03-M07 PW 등록정보로 찾기 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (zod v4 — 에러는 { error })
//
// TODO(설계서 확인): 아이디/사업자등록번호/사용자명/생년월일 항목의 영문 항목 ID 는
//   설계서 데이터영역에 미제공. 임시로 userId / bizRegNo / userName / birthDate 사용 —
//   백엔드 비밀번호찾기 API 스펙 확정 시 키만 교체.
// TODO(정책 확정): 설계서 slide45 주석 "정책이 정해지면 화면 변경이 필요함" · "1 사용자당 1 아이디로
//   개편되어 사용자 구분/사업자 아이디가 무의미해질 수 있음" → 아이디 체계 확정 시 필드 재검토.
import { z } from 'zod'

export const pswdRegInfoFndngSchema = z.object({
  // 아이디 — 미입력 시 안내(설계서 유효성 메시지 영역).
  userId: z.string().min(1, { error: '아이디를 입력해주세요' }),
  // 사업자등록번호 — '-' 없이 숫자만. 미입력 시 안내.
  bizRegNo: z.string().min(1, { error: '사업자등록번호를 입력해주세요' }),
  // 사용자명 — 공백없이. 미입력 시 안내.
  userName: z.string().min(1, { error: '사용자명을 입력해주세요' }),
  // 생년월일 — 6자리 숫자(YYMMDD). 미입력 시 안내.
  birthDate: z.string().min(1, { error: '생년월일 6자리를 입력해주세요' }),
})

export type PswdRegInfoFndngForm = z.infer<typeof pswdRegInfoFndngSchema>
