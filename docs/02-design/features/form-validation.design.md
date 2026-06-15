---
template: design
version: 1.3
feature: form-validation
date: 2026-06-15
author: jygong
project: d2b-mobile-front
status: Draft
---

# form-validation Design Document

> **Summary**: react-hook-form + zod(+@hookform/resolvers)로 프론트 폼 검증을 표준화. 기존 KRDS UI(InputLabel·InputMessage·필드 error)에 얹는다.
>
> **Project**: d2b-mobile-front
> **Author**: jygong · **Date**: 2026-06-15 · **Status**: Draft
> **Planning Doc**: [form-validation.plan.md](../../01-plan/features/form-validation.plan.md)

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 검증 표준 부재 → 폼마다 제각각·빈약. 조달 폼이 늘수록 악화. |
| **WHO** | 프론트 팀(여러 명)이 기획서 보고 폼을 친다. 사용자 = 모바일 웹앱 이용자. |
| **RISK** | 수동 구현은 빈약/불일치 → **라이브러리(RHF+zod) 채택으로 해소**. 잔여 리스크 = 번들↑·러닝커브·버전 호환. |
| **SUCCESS** | 공통 검증 컨벤션 문서화 + 대표 폼 적용 + 빌드/번들 영향 허용범위. |
| **SCOPE** | 클라이언트(프론트) 검증만. 서버(eGovFrame) 검증 대체 아님. |

---

## 1. Overview

### 1.1 Design Goals

- 한 가지 표준 방식으로 모든 폼 검증(트리거·에러표시·규칙)을 통일.
- zod 스키마를 **단일 진실원천**으로: 검증 규칙 + TS 타입(`z.infer`)을 한 곳에서.
- 기존 KRDS 컴포넌트 **무수정 최대 재사용**(필요한 최소 보강만 식별).

### 1.2 Design Principles

- **스키마 = 타입**: 규칙과 타입이 갈리지 않게 `z.infer`로 도출.
- **컴포넌트는 표현, 폼 로직은 RHF**: KRDS UI는 그대로, RHF가 상태/검증/제출 담당.
- **폐쇄망 안전**: npm 의존성은 빌드 시 번들 → 외부 런타임/CDN 의존 0.

---

## 2. Architecture (결정: 라이브러리 채택 — 3안 비교 생략, 사용자 결정)

> Plan 후보 중 **react-hook-form + zod** 채택 확정(사용자). 수동 훅은 복잡·다수 폼에서 빈약/불일치 우려로 탈락. 아래는 그 위의 통합 설계.

### 2.0 의존성 / 버전 (npm 검증, 2026-06-15)

| 패키지 | 버전 | 호환 |
|--------|------|------|
| `react-hook-form` | `^7.79.0` | peer react `^16.8 \|\| 17 \|\| 18 \|\| 19` → React 18.3 ✓, 런타임 의존성 0 |
| `zod` | `^4.4.3` (v4) | — |
| `@hookform/resolvers` | `^5.4.0` | peer RHF `^7.55` ✓ · **v5.1+가 zod v4 지원**(단일 `@hookform/resolvers/zod`, 버전 자동감지) |

설치:
```bash
npm install react-hook-form@^7.79.0 zod@^4.4.3 @hookform/resolvers@^5.4.0
```
- **번들**: RHF ~8.6kB · resolvers ~1kB · zod ~17kB(풀, tree-shaking). `zod/mini` 미사용(API 번거로움, 폼 적으면 불필요).
- **vite manualChunks**(CLAUDE.md 규칙 #5): 여러 폼 공통 의존이므로 `vendor-data`에 `react-hook-form`·`zod`·`@hookform/resolvers` 추가(또는 신규 `vendor-form`).

### 2.1 데이터 흐름

```
zod schema ──(zodResolver)──▶ react-hook-form ──▶ KRDS 컴포넌트(register | Controller)
   │  (규칙+타입 z.infer)              │  formState.errors             │
   └──────────────── 타입 ────────────┘   └─▶ InputMessage type=error ◀┘
제출(onSubmit) → 전체검증 → 통과 onValid / 실패 onInvalid(첫 에러 포커스·스크롤)
에러난 필드 → 이후 blur 재검증(reValidateMode)
```

### 2.2 RHF 연동 방식 (컴포넌트별 — 리서치 검증)

| 컴포넌트 | 방식 | 비고 |
|----------|------|------|
| `InputBox` / `TextArea` | **`register`** | 네이티브 input/textarea로 ref·onChange·onBlur 전달됨 |
| `InputBox`(마스킹/onClear 필요, 예: 전화) | **`Controller`** | onChange에서 `formatPhoneInput` 변환 필요 |
| `Checkbox`(단일) | **`Controller`** | Radix, `checked`/`onCheckedChange(CheckedState)` → `c === true` 정규화 |
| `RadioButtonGroup` | **`Controller`** | `value`/`onValueChange`. `...props`로 `onBlur` 전달됨 ✓ |
| `CheckboxGroup` | **`Controller`** | `value:string[]`/`onValueChange`. ⚠️ onBlur 미전달(§7) |

### 2.3 트리거 설정 (요청 = 제출 + 이후 blur)

```ts
useForm({ mode: 'onSubmit', reValidateMode: 'onBlur', resolver: zodResolver(schema) })
```
- `mode:'onSubmit'` → 첫 제출 전엔 검증 안 함. `reValidateMode:'onBlur'` → 첫 제출 실패 후 에러 필드는 blur 시 재검증(매 키 입력 X).

---

## 3. Data Model — zod 스키마 = 진실원천

```ts
// 예: 알림신청 (PrcmPlan_NotiAply.schema.ts)
import { z } from 'zod'
export const notiAplySchema = z.object({
  // zod v4: 에러는 message 가 아니라 error
  phone: z.string().min(1, { error: '휴대번호를 입력하세요.' })
                   .regex(/^\d{3}-\d{3,4}-\d{4}$/, { error: '올바른 휴대번호 형식이 아닙니다.' }),
  agree: z.enum(['no', 'yes']),
})
export type NotiAplyForm = z.infer<typeof notiAplySchema>   // 타입 자동 도출
```

**규칙 위치 컨벤션:**
- **단일 사용 폼 스키마**: 폼과 **co-locate** — `XxxForm.schema.ts`(같은 biz 폴더). (CLAUDE.md "목업+API 경계"와 동일 결).
- **2개 이상 파일 공유**: `src/types/{도메인}.ts`로 승격(기존 타입 규칙). `z.infer`를 도메인 모델로 재사용 가능.
- **재사용 필드 규칙**(전화·이메일·날짜범위 등): `src/utils/validators.ts`(기존 `format.ts`·`cn.ts` 옆)에 zod 조각으로 export. `src/lib/` 신설 안 함(레포 관행 없음).

---

## 4. API Specification

해당 없음 — 클라이언트 검증 전용. (서버 검증/에러 응답 매핑은 eGovFrame 연동 시 별도 과제, Out of Scope.)

---

## 5. UI/UX Design

### 5.1 에러 표시 패턴 (register 필드)

```tsx
<InputLabel htmlFor="phone" required>수신자 휴대번호</InputLabel>
<InputBox id="phone" {...register('phone')}
  error={!!errors.phone}                              // 빨강 스타일(별도 prop)
  aria-invalid={!!errors.phone || undefined}
  aria-describedby={errors.phone ? 'phone-error' : undefined} />
{errors.phone
  ? <InputMessage type="error" id="phone-error">{errors.phone.message}</InputMessage>
  : <InputMessage>안내 문구…</InputMessage>}
```
- `error`(시각)와 `aria-invalid`(접근성)는 **독립** → 둘 다 전달.
- `InputMessage type="error"`는 내부적으로 `role="alert"` → 스크린리더 자동 안내.

### 5.2 Controller 필드 (Radix 그룹)

```tsx
<Controller control={control} name="agree" render={({ field, fieldState }) => (<>
  <RadioButtonGroup name={field.name} value={field.value}
    onValueChange={field.onChange} onBlur={field.onBlur}
    items={[{value:'no',label:'동의 안함'},{value:'yes',label:'동의함'}]} />
  {fieldState.error && <InputMessage type="error">{fieldState.error.message}</InputMessage>}
</>)} />
```

### 5.3 첫 에러 포커스/스크롤

- `shouldFocusError: true`(기본) → **register 입력류는 자동 포커스** ✓.
- Radix 그룹은 focus 가능한 ref가 없어 자동 포커스 무효 → **수동 스크롤 폴백**: 필드 블록을 `<div id={`field-${name}`}>`로 감싸고, `onInvalid`에서 첫 에러로 `scrollIntoView`(rAF). `main#app-scroll` 기준(`window.scrollTo` 금지 — app-scroll 관행).

```tsx
const onInvalid = (errs) => {
  const first = Object.keys(errs)[0]
  requestAnimationFrame(() =>
    document.getElementById(`field-${first}`)?.scrollIntoView({ behavior:'smooth', block:'center' }))
}
<form onSubmit={handleSubmit(onValid, onInvalid)} />
```

### 5.4 Page UI Checklist (대표 폼)

#### 알림신청(PrcmPlan_NotiAply) — 검증 적용
- [ ] 휴대번호 InputBox: required + 형식(`010-1234-5678`) 검증, 에러 시 빨강 메시지
- [ ] 수신동의 RadioButtonGroup: 필수 선택(`no`/`yes`)
- [ ] 제출(부모 BottomSheet footer "신청하기", `type=submit form="noti-aply-form"`) → 실패 시 제출 차단 + 첫 에러 포커스/스크롤
- [ ] 첫 제출 실패 후: 에러 필드 blur 시 재검증

### 5.5 폼 소유권 (footer 버튼이 부모 컨테이너에 있을 때)

- 콘텐츠 컴포넌트가 `useForm` 소유 + `<form id="xxx">`. 부모(BottomSheet) footer 버튼은 `type="submit" form="xxx"`로 연결 → 콘텐츠 자족 + 부모 버튼이 제출. (BottomSheet props 소유 패턴 유지.)

---

## 6. Error Handling

| 상황 | 처리 |
|------|------|
| 클라 검증 실패 | 제출 차단, `InputMessage type=error` + 필드 error, 첫 에러 포커스/스크롤 |
| (후속) 서버 검증 실패 | eGovFrame 응답 → `setError(field, ...)`로 폼 매핑(Out of Scope, 패턴만 예고) |

---

## 7. 컴포넌트 보강(설계 결정 — Radix 갭)

리서치가 찾은 실제 갭. **Do 단계에서 최소 보강:**

1. **`CheckboxGroup`에 `onBlur` prop 추가** — 그룹 컨테이너 focus-out 시 발화. (현재 미전달 → `reValidateMode:'onBlur'`/touched 미동작.) base `Checkbox`도 동일 필요 시 추가.
2. **Radix 그룹 첫-에러 포커스** — ref 포워딩 대신 §5.3 수동 스크롤 채택(저비용, 모바일 적합). 그룹 ref 포워딩은 과한 변경이라 보류.
3. **`Checkbox.onCheckedChange`는 `CheckedState`** → Controller에서 `c === true` 정규화(공용 헬퍼화 고려).

> 1번 외엔 KRDS 컴포넌트 무수정으로 RHF 매핑 가능(InputBox/TextArea ref·onChange·onBlur 전달, InputMessage role=alert).

---

## 8. Test Plan

### 8.1 Scope
| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L2: UI Action | 대표 폼 제출/에러 표시 | (수동 또는 Playwright) | Do |

### 8.2 L2 시나리오 (알림신청)
| # | Action | Expected |
|---|--------|----------|
| 1 | 빈 값 제출 | 제출 차단, 휴대번호/동의 에러 메시지, 첫 에러로 포커스/스크롤 |
| 2 | 잘못된 번호 형식 제출 | 형식 에러 메시지 |
| 3 | 에러 후 올바른 값 입력+blur | 에러 메시지 사라짐 |
| 4 | 유효 값 제출 | onValid 호출(콘솔 스텁), 시트 닫힘 |

> 폐쇄망/모바일이라 우선 수동 점검 + (가능 시) Playwright. 서버 검증은 범위 밖.

---

## 9. 의존성 방향 (frontend-architecture 준수)

| 요소 | 레이어 | 위치 |
|------|--------|------|
| zod 스키마(폼별) | Domain(규칙/타입) | 폼 옆 `*.schema.ts` 또는 `src/types/` |
| 재사용 검증 규칙 | Domain | `src/utils/validators.ts` |
| RHF 사용 폼 | Presentation | `src/ui/biz/**` |
| KRDS 입력 컴포넌트 | Presentation(base/composites) | 기존 |

- `ui/biz → utils/types` import OK(기존 방향). 역방향 없음.

---

## 10. Coding Convention (이 기능)

| 항목 | 컨벤션 |
|------|--------|
| 스키마 파일 | `XxxForm.schema.ts`(폼 옆), 공유 시 `src/types/` |
| 에러 옵션 | **zod v4 `error:`** (not `message:`), 문자열 형식은 `z.email()` 등 |
| import | `import { zodResolver } from '@hookform/resolvers/zod'` · `import { z } from 'zod'` (서브패스 X) |
| 트리거 | `mode:'onSubmit', reValidateMode:'onBlur'` 고정 |
| 에러 UI | `InputMessage type="error"` + `error` prop + `aria-invalid`/`aria-describedby` |

→ 확정 후 **CLAUDE.md "폼 검증" 섹션**으로 요약 반영(페이지 작성 절차에 연결).

---

## 11. Implementation Guide

### 11.1 File Structure (추가/변경)

```
package.json                         # +RHF +zod +resolvers
vite.config.ts                       # manualChunks: vendor-data(또는 vendor-form)에 추가
src/utils/validators.ts              # (신규) 재사용 zod 필드 규칙(phone 등)
src/ui/common/composites/CheckboxGroup.tsx   # (보강) onBlur prop
src/ui/biz/op/prcmPlanDtl/
  ├ PrcmPlan_NotiAply.schema.ts       # (신규) zod 스키마
  └ PrcmPlan_NotiAply.tsx             # (변경) RHF+Controller 적용
CLAUDE.md                            # (문서) "폼 검증" 컨벤션 섹션
```

### 11.2 Implementation Order

1. [ ] deps 설치 + `vite.config.ts` manualChunks + 빌드 확인.
2. [ ] `src/utils/validators.ts` 공용 규칙(phone 등).
3. [ ] `CheckboxGroup` onBlur prop 보강.
4. [ ] 대표 폼 `PrcmPlan_NotiAply` → RHF+zod 적용(schema + Controller + 에러 UI + 제출/포커스).
5. [ ] 동작 점검(§8) + lint/build.
6. [ ] CLAUDE.md "폼 검증" 컨벤션 반영.

### 11.3 Session Guide

| Module | Scope Key | Description |
|--------|-----------|-------------|
| 기반 | `module-1` | deps+chunk, validators, CheckboxGroup onBlur, 컨벤션 |
| 적용 | `module-2` | 대표 폼(PrcmPlan_NotiAply) 검증 적용 + 점검 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-15 | Initial draft (Design, RHF+zod 확정) | jygong |
