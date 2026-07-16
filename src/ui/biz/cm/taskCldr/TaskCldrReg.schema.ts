// MUI-CM-06-P08 업무캘린더 등록/수정 폼 스키마 (react-hook-form + zod).
// 설계서 00.공통 v0.84 slide87 — 선택 날짜*·제목* 필수, 내용 선택. (미입력 유효성 정보 표시)
// zod v4: 에러 메시지는 { error: '...' }. 값 타입은 TaskCldrRegValues(@/types/cm)와 정합.
import { z } from 'zod'

export const taskCldrRegSchema = z.object({
  /** 선택 날짜(schdlDt) 'YYYY-MM-DD' — 필수. */
  schdlDt: z.string().min(1, { error: '선택 날짜를 선택해주세요.' }),
  /** 제목(schdlTtl) — 필수(최대 100자, 설계서 자리수). */
  schdlTtl: z
    .string()
    .min(1, { error: '제목을 입력해주세요.' })
    .max(100, { error: '제목은 100자 이내로 입력해주세요.' }),
  /** 내용(schdlCn) — 선택(빈 문자열 허용). defaultValues 로 항상 문자열이 주입돼 optional 대신 z.string() 사용. */
  schdlCn: z.string(),
})

export type TaskCldrRegSchemaValues = z.infer<typeof taskCldrRegSchema>
