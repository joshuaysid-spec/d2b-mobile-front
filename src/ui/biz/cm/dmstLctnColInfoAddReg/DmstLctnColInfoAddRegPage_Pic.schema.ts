// 담당자 정보 추가등록(MUI-CM-01-M22) 폼 스키마 — react-hook-form + zod.
//   설계서 slide149: 담당자명*·전화번호*·팩스번호·이메일주소*. 담당자정보는 [저장] 시 승인 없이 변경(즉시 완료).
//   항목명(영문)은 업체정보 상세 담당자정보(dm_picInfo, types/cm) 준수: picNm·picEntlno·picFxno·picEmlAddr.
import { z } from 'zod'

import { emailSchema } from '@/utils/validators'

// zod v4: 에러 메시지는 { error }.
export const dmstLctnColInfoAddRegPicSchema = z.object({
  // 담당자명(picNm) — 필수, 100자.
  picNm: z
    .string()
    .trim()
    .min(1, { error: '담당자명을 입력해주세요.' })
    .max(100, { error: '담당자명은 100자 이내로 입력해주세요.' }),
  // 전화번호(picEntlno) — 필수. 하이픈 포함 숫자/전화 형식(02-1234-5678 등).
  picEntlno: z
    .string()
    .trim()
    .min(1, { error: '전화번호를 입력해주세요.' })
    .regex(/^\d{2,4}-\d{3,4}-\d{4}$/, { error: '올바른 전화번호 형식이 아닙니다.' }),
  // 팩스번호(picFxno) — 선택. 입력 시에만 형식 검증.
  picFxno: z
    .string()
    .trim()
    .regex(/^\d{2,4}-\d{3,4}-\d{4}$/, { error: '올바른 팩스번호 형식이 아닙니다.' })
    .or(z.literal('')),
  // 이메일주소(picEmlAddr) — 필수, 50자.
  picEmlAddr: emailSchema,
})

export type DmstLctnColInfoAddRegPicForm = z.infer<typeof dmstLctnColInfoAddRegPicSchema>
