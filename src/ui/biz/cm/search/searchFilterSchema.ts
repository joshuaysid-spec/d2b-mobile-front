// 검색필터 셸의 "필드 정의 → zod 스키마" 자동 생성 (SearchFilter.tsx 에서 분리 — 순수 함수라 React 없이 검증 가능).
// 페이지는 schema 에 규칙(required · text 의 minLength/maxLength/pattern)만 선언하고 zod 를 직접 쓰지 않는다
//   (docs/rules/forms.md 2레인 규칙). 새 규칙(기간 제한 등)은 필드 정의 옵션 → 여기 매핑 추가로 확장한다.
import { z } from 'zod'

import type { SearchFilterSchema, TextFieldDef } from '@/types/search-filter'

/** 빈값 동치 — undefined·''·빈 배열·모든 값이 빈 객체. required 판정과 검색 버튼 활성 비교에 공용. */
export const isEmptyLike = (v: unknown): boolean =>
  v == null ||
  v === '' ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && Object.values(v as object).every(isEmptyLike))

const REQUIRED_MSG = '필수 입력 항목입니다.'

// text 필드 규칙 — 빈값은 required 만 검사, 길이/형식은 입력이 있을 때만(선택 항목을 비워 두면 통과).
const textRule = (f: TextFieldDef) =>
  z
    .string()
    .optional()
    .superRefine((v, ctx) => {
      if (!v) {
        if (f.required) ctx.addIssue({ code: 'custom', message: REQUIRED_MSG })
        return
      }
      if (f.minLength && v.length < f.minLength)
        ctx.addIssue({ code: 'custom', message: `${f.minLength}자 이상 입력해주세요.` })
      if (f.maxLength && v.length > f.maxLength)
        ctx.addIssue({ code: 'custom', message: `${f.maxLength}자 이내로 입력해주세요.` })
      if (f.pattern && !f.pattern.regex.test(v))
        ctx.addIssue({ code: 'custom', message: f.pattern.message })
    })

// looseObject: 다른 탭/유형의 키가 값에 남아 있어도 통과.
// 비필수는 z.any().optional() — zod 4 는 z.any() 도 키 존재를 요구해, defaultValue 에 없는 키(동적 schema 로
//   추가된 필드)가 undefined 면 "expected nonoptional" 로 막히던 것을 방지.
export const buildZodSchema = (s: SearchFilterSchema) => {
  const shape: Record<string, z.ZodType> = {}
  s.sections.forEach((sec) =>
    sec.fields.forEach((f) => {
      if (f.type === 'text' && (f.minLength || f.maxLength || f.pattern)) shape[f.key] = textRule(f)
      else
        shape[f.key] = f.required
          ? z.custom((v) => !isEmptyLike(v), { error: REQUIRED_MSG })
          : z.any().optional()
    }),
  )
  return z.looseObject(shape)
}
