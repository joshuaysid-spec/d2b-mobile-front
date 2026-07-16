// 군수품무역대리업 신규(갱신) 신청 폼 스키마 (MUI-CM-01-M17) — react-hook-form + zod.
// 업체/접수 정보는 ReadOnly(조회결과)라 검증 대상이 아니고, 사용자가 조작하는 값은
//   ① 첨부파일(필수 서류 첨부 여부) ② 행정정보 공동이용 동의(agree) 뿐이다.
//   첨부는 파일 상태(useState)로 다루므로 스키마는 동의(agree)만 강제한다(제출 게이트).
import { z } from 'zod'

// zod v4: 에러 메시지는 { error }.
export const dfEqpmntTradeAgncAplySchema = z.object({
  // 행정정보 공동이용 동의서(MUI-CM-01-P13) 동의 여부 — 제출 필수.
  agree: z.literal(true, { error: '행정정보 공동이용에 동의해주세요.' }),
})

export type DfEqpmntTradeAgncAplyForm = z.infer<typeof dfEqpmntTradeAgncAplySchema>
