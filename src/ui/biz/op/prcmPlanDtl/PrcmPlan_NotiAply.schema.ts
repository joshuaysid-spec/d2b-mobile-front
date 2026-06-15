// 입찰공고 알림신청(P10) 폼 검증 스키마 — 이 폼 전용이라 옆에 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천.
import { z } from 'zod'

import { phoneSchema } from '@/utils/validators'

export const notiAplySchema = z.object({
  phone: phoneSchema,
  // 수신동의 — 'no'(동의 안함) | 'yes'(동의함). 라디오라 항상 둘 중 하나(필수).
  agree: z.enum(['no', 'yes']),
})

export type NotiAplyForm = z.infer<typeof notiAplySchema>
