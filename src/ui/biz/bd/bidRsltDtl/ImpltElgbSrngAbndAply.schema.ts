// 이행/적격심사포기신청(MUI-BD-10-P02, 구 P21) 폼 검증 스키마 — 이 폼 전용이라 co-locate.
// zod 스키마 = 검증 규칙 + 타입(z.infer)의 단일 진실원천. (설계서 slide284 데이터영역 dmt_impltElgbSrngAbndRsn)
import { z } from 'zod'

/** 기타(직접 입력) 포기사유구분 코드 — 이 값일 때만 포기사유 입력 필수. (코드값 상세설계 예정) */
export const ABND_RSN_ETC = '9'

/** 포기사유구분(elgbSrngAbndRsnSe) 라디오 항목 — 설계서 slide283. 코드값 1~4·9 는 상세설계 예정 임시. */
export const ABND_RSN_OPTIONS = [
  { value: '1', label: '업체 자체심사 결과 기준 점수 미달' },
  { value: '2', label: '참여의사 없음' },
  { value: '3', label: '구매선 미확보' },
  { value: '4', label: '납기준수 제한' },
  { value: ABND_RSN_ETC, label: '기타(직접 입력)' },
] as const

export const abndAplySchema = z
  .object({
    // 포기사유구분 — 라디오 선택 필수(초기값 '' → 미선택)
    elgbSrngAbndRsnSe: z.string().min(1, { error: '포기 사유를 선택하세요.' }),
    // 포기사유 — 기타 선택 시에만 필수(아래 refine). 500자 제한. 빈 문자열은 통과(defaultValues '').
    srngMnftrBzentyAbndRsn: z.string().max(500, { error: '500자 이내로 입력하세요.' }),
  })
  .refine(
    (d) => d.elgbSrngAbndRsnSe !== ABND_RSN_ETC || d.srngMnftrBzentyAbndRsn.trim().length > 0,
    { error: '포기 사유를 입력하세요.', path: ['srngMnftrBzentyAbndRsn'] },
  )

export type AbndAplyForm = z.infer<typeof abndAplySchema>
