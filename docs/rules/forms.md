# 폼 검증 (react-hook-form + zod) · 입력 마스킹

> CLAUDE.md 에서 분할된 상세 규칙. 폼/검증/마스킹 입력 작업 시 반드시 먼저 읽는다.

폼 입력 검증은 **react-hook-form(RHF) + zod**로 표준화한다. 직접 `useState`로 검증 로직 짜지 말 것. (상세: `docs/02-design/features/form-validation.design.md`)

**⚠️ 검증 엔진은 전부 RHF+zod 로 통일(2026-08-07), 레인은 딱 2개 — 제3의 방식을 만들지 말 것.**

| 화면 종류 | 검증 방식 | 규칙 수정 위치 |
|---|---|---|
| **입력 폼**(신청서·의견등록 등 제출 화면) | zod 스키마를 **직접 작성** + RHF (이 문서) | 해당 `*.schema.ts` |
| **검색필터**(SearchFilter 셸 쓰는 목록 화면) | 셸 내부 RHF+zod — **zod 스키마는 필드 정의에서 자동 생성**(`buildZodSchema`), 페이지는 schema 필드에 `required: true` 선언만 | 필수 지정=페이지 schema · 검증 동작/규칙 확장=`cm/search/SearchFilter.tsx` `buildZodSchema` |

- **검색필터 페이지에서 zod 스키마를 직접 만들지 말 것** — required 쓰는 14개 화면이 무수정으로 유지되는 구조(셸이 자동 생성)를 지킨다. required 이상의 규칙(기간 제한 등)이 생기면 필드 정의 옵션 → `buildZodSchema` 매핑으로 셸에 추가.
- 페이지→셸 명령형 제어가 필요하면 `SearchFilterHandle`(ref — `submit`/`reset`) 사용.
- 반대로 입력 폼을 useState 수동 검증이나 검색필터 방식(자동 생성)으로 짜지 말 것.

## 입력 폼 작성 규칙

- **설치됨**: `react-hook-form`·`zod`·`@hookform/resolvers` (vite `vendor-form` chunk). import: `import { useForm, Controller } from 'react-hook-form'` · `import { zodResolver } from '@hookform/resolvers/zod'`(서브패스 없음) · `import { z } from 'zod'`.
- **스키마 = 진실원천**: zod 스키마로 규칙 + 타입(`z.infer`)을 한 곳에서. 위치: 단일 폼은 옆에 `XxxForm.schema.ts`(co-locate) · 2개+ 공유는 `src/types/` · 재사용 필드 규칙은 `src/utils/validators.ts`.
- **zod v4 주의**: 에러 메시지는 `{ error: '...' }` (구 `message:` 아님). 형식은 `z.email()` 등 top-level.
- **트리거 고정**: `useForm({ resolver: zodResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })` — 제출 시 전체 검증, 이후 에러 필드는 blur 재검증.
- **연동**: 네이티브 입력(`InputBox`/`TextArea`) = `register`. **Radix 그룹**(`Checkbox`/`RadioButtonGroup`/`CheckboxGroup`)·마스킹 입력 = **`<Controller>`** (value/onChange/onBlur 수동 연결, Checkbox 는 `c === true` 정규화).
- **에러 표시(KRDS 재사용)**: `<InputMessage type="error">{message}</InputMessage>` + `InputBox`의 `error` prop + `aria-invalid`/`aria-describedby`. 필수는 `InputLabel`의 `required`(`*`).
- **첫 에러 포커스**: 입력류는 RHF `shouldFocusError` 자동. **Radix 그룹은 ref 없어 자동 안 됨** → 필드 블록을 `<div id={`field-${name}`}>`로 감싸고 `onInvalid`에서 `scrollIntoView`(main#app-scroll). `window.scrollTo` 금지.
- **서버 검증 대체 아님**: 프론트는 UX 사전검증. 권위 검증은 백엔드(eGovFrame).
- **적용 예시**: `PrcmPlanDtlPage`(페이지가 `useForm` 소유) + `PrcmPlan_NotiAply`(`control` 받아 Controller) + `PrcmPlan_NotiAply.schema.ts`.

## 입력 종류(마스킹·IME 가드) — `InputBox`의 `inputType`

숫자/전화/영문처럼 **허용 문자 제한이 있는 입력**은 `InputBox` 의 `inputType` prop 으로 처리한다. **거르기·키패드·IME 가드를 InputBox 가 내부에서 자동 처리**하므로, 페이지/콘텐츠는 prop 만 넘긴다(가공 로직을 직접 짜지 말 것).

| `inputType` | 허용 | IME 가드 | 키패드(inputMode) | 용도 |
|---|---|---|---|---|
| `text`(기본) | 전부(한글 OK) | ❌ | 일반 | 이름·주소·메모 등 자유 입력 |
| `numeric` | 숫자만 | ✅ | numeric | 금액·수량·숫자코드 |
| `tel` | 숫자만 | ✅ | tel | 휴대번호·전화 |
| `english` | 영문/영숫자 | ✅ | 일반 | 영문 ID·코드 |

- **IME 가드**란: 한글 등 조합문자가 마스킹(거르기)에 의해 조합 도중 삭제되어 커서 튐·글자 깨짐이 나는 것을 막는 장치(`compositionstart~end` 동안 가공 보류). `text` 기본값은 가드를 타지 않아 **기존 InputBox 사용처는 무영향**.
- **표시 포맷**(전화 하이픈·금액 콤마)은 `format?: (filtered) => string` prop 으로. 예: `<InputBox inputType="tel" format={formatPhoneInput} ... />`.
- Controller 와 그대로 호환: `value={field.value} onChange={field.onChange}` 만 넘기면 InputBox 가 가공해 반영한다(콘텐츠가 `formatPhoneInput` 직접 호출하지 않음).
- **적용 예시**: `PrcmPlan_NotiAply` 휴대번호(`inputType="tel" format={formatPhoneInput}`).

## 최대 글자수(`maxLength`) — 기본값 내장 (2026-09-10)

`InputBox`·`TextArea` 는 **`maxLength` 를 안 넘겨도 기본값이 적용**된다. 설계서 항목설명의 자릿수가 다르면 prop 으로 명시한다.

| 컴포넌트 | 기본값(상수) | 근거 |
|---|---|---|
| `InputBox` | `INPUT_BOX_MAX_LENGTH` = 100 | 제목·이름류 단일행 컬럼 |
| `TextArea` | `TEXT_AREA_MAX_LENGTH` = 4000 | 사유·내용류 컬럼 |

- 기본값보다 **짧아야 하는 항목은 반드시 명시**(사업자번호 10·인증번호 6 등). 길이 무제한은 없음 — 더 길면 큰 값을 명시.
- `maxLength` 는 **타이핑만 막는다**(붙여넣기·프로그램 세팅은 통과) → RHF+zod 폼은 스키마 `.max(N, { error })` 에 같은 값을 둔다(2레인 규칙의 검증 레인이 최종 방어).
- 글자수 카운터는 내장 안 함 — 필요한 화면만 상수를 import 해 `{v.length} / {MAX}` 한 줄 표시(레퍼런스 `PrcmPlanDtl_OpnnRegFullPopup`).
- 단위는 UTF-16(한글 1자). 백엔드 컬럼이 byte 기준이면 자릿수 확정 시 사용자와 확인.
