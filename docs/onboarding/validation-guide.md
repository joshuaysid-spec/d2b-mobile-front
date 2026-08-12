# 폼 검증 실전 가이드 (RHF + zod) — 팀 공유용

> "내 화면에 밸리데이션을 넣어야 한다"일 때 보는 실전 순서. 규칙 원문은 `docs/rules/forms.md`,
> 설계 배경은 `docs/02-design/features/form-validation.design.md`.

## 0. 먼저 판단 — 내 화면은 어느 레인인가

| 내 화면 | 레인 | 내가 할 일 |
|---|---|---|
| **목록 화면의 검색필터** (SearchFilter 셸 사용) | A | schema 필드에 `required: true` 한 줄. **끝.** |
| **제출 폼** (신청서·등록·로그인·비밀번호 등) | B | `*.schema.ts` 작성 + `useForm` 배선 (아래 절차) |

⚠️ 이 2개가 전부다. useState 로 직접 검증 로직을 짜거나, 제3의 방식을 만들지 말 것.

---

## 레인 A — 검색필터 (내 코드에 검증 로직 0줄)

### A-1. 필수값 지정

페이지의 `SearchFilterSchema` 필드 정의에 `required: true`만 선언한다:

```ts
{
  type: 'checkbox',
  key: 'taskSeCd',
  required: true,   // ← 이 한 줄이 검증 전부
  selectAll: { value: '0' },
  options: [...],
}
```

이것만으로 셸(`cm/search/SearchFilter.tsx`)이 자동 처리하는 것:
- [검색] 클릭 시 zod 검증 (`buildZodSchema` 가 필드 정의에서 자동 생성)
- 실패 시 검색 차단 + 해당 필드 아래 `"필수 입력 항목입니다."` 표시 + 첫 에러 필드로 스크롤
- 값을 채우면 에러 즉시 해제
- 통과 시에만 페이지 `onSearch(value)` 호출

### A-2. required 이상의 규칙이 필요하면 (기간 제한 등)

**페이지에서 zod 를 직접 만들지 않는다.** 셸의 `buildZodSchema`(SearchFilter.tsx)에
"필드 정의 옵션 → zod 규칙" 매핑을 추가한다 — 그래야 required 쓰는 기존 화면 전부가 무수정 유지된다.
(예: 필드 정의에 `maxRangeMonths: 3` 옵션 신설 → buildZodSchema 에서 해당 규칙 생성)

### A-3. 밖에서 검색/초기화를 트리거해야 하면

`SearchFilterHandle`(ref) 사용: `ref.current?.submit()` = [검색]과 동일(검증 포함), `reset()` = 초기화.

---

## 레인 B — 입력 폼 (5단계)

적용 완료 예시를 옆에 놓고 따라가면 빠르다:
`cm/pswdChg/PswdChgPage(.schema).ts` · `op/prcmPlanDtl/PrcmPlan_NotiAply(.schema).ts`

### B-1. 스키마 파일 작성 — `XxxPage.schema.ts` (폼 옆에 co-locate)

```ts
// XxxPage.schema.ts — 검증 규칙 + 타입의 단일 진실원천
import { z } from 'zod'
import { phoneSchema } from '@/utils/validators' // 공용 규칙은 재사용

export const xxxSchema = z.object({
  userNm: z.string().min(1, { error: '이름을 입력하세요.' }),
  phone: phoneSchema,
  agree: z.enum(['no', 'yes']),          // 라디오 — 항상 둘 중 하나(필수)
  reason: z.string().min(10, { error: '10자 이상 입력하세요.' }),
})
export type XxxForm = z.infer<typeof xxxSchema>   // 타입도 여기서 파생 (중복 정의 X)
```

- **zod v4**: 에러 메시지는 `{ error: '...' }` (구 `message:` 아님). 이메일은 `z.email()` (top-level).
- 여러 폼이 같은 필드 규칙을 쓰면 → `src/utils/validators.ts` 로 올린다 (현재 `phoneSchema`·`emailSchema`).
- 2개+ 화면이 같은 폼 스키마를 공유하면 → `src/types/` 로.

### B-2. useForm 배선 (트리거 옵션 고정)

```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { xxxSchema, type XxxForm } from './XxxPage.schema'

const form = useForm<XxxForm>({
  resolver: zodResolver(xxxSchema),
  mode: 'onSubmit',          // 제출할 때 전체 검증
  reValidateMode: 'onBlur',  // 에러난 필드는 blur 시 재검증
  defaultValues: { userNm: '', phone: '', agree: 'no', reason: '' },
})
```

### B-3. 입력 연결 — register 냐 Controller 냐

| 컴포넌트 | 연결 방법 | 이유 |
|---|---|---|
| `InputBox` / `TextArea` | `{...form.register('userNm')}` | 내부가 네이티브 input — ref 로 직접 연결됨 |
| `RadioButtonGroup` / `CheckboxGroup` / `SelectBox` / `Checkbox` | `<Controller>` | Radix 기반 — DOM value 가 없어 register 불가 |
| 마스킹 입력 (`inputType` 사용) | `<Controller>` | value/onChange 로 가공값 왕복 필요 |

```tsx
{/* 네이티브 → register */}
<InputBox {...form.register('userNm')} error={!!form.formState.errors.userNm} />

{/* Radix 그룹 → Controller */}
<Controller
  control={form.control}
  name="agree"
  render={({ field, fieldState }) => (
    <div id="field-agree">   {/* ← 에러 스크롤 앵커 (B-5) */}
      <RadioButtonGroup value={field.value} onValueChange={field.onChange} items={...} />
      {fieldState.error && <InputMessage type="error">{fieldState.error.message}</InputMessage>}
    </div>
  )}
/>

{/* 마스킹 입력 → Controller + inputType (가공 로직 직접 짜지 말 것) */}
<Controller
  control={form.control}
  name="phone"
  render={({ field }) => (
    <InputBox inputType="tel" format={formatPhoneInput}
      value={field.value} onChange={field.onChange} />
  )}
/>
```

### B-4. 에러 표시 (KRDS 컴포넌트 재사용)

- 메시지: `<InputMessage type="error">{errors.xxx?.message}</InputMessage>`
- 입력 테두리: `InputBox` 의 `error` prop
- 필수 표시(`*`): `InputLabel` 의 `required`
- 접근성: `aria-invalid` / `aria-describedby` (InputBox 가 처리)

### B-5. 제출 — handleSubmit 로 감싸고, 통과 시에만 API

```tsx
const saveXxx = useSaveXxx()   // queries/{도메인}.ts 의 useMutation 훅

const onSubmit = form.handleSubmit(async (data) => {
  // 여기 도달 = 프론트 검증 전부 통과. data 는 XxxForm 타입.
  try {
    await saveXxx.mutateAsync(data)
    // 성공 처리 (이동/AlertModal). 캐시 무효화는 mutation 훅 onSuccess 가 담당.
  } catch (e) {
    setServerError((e as ApiError).message)  // 서버 검증 실패 → AlertModal/InputMessage 로 표시
  }
})

<Button variant="primary" onClick={onSubmit}>신청</Button>
```

- 첫 에러 포커스: input 류는 RHF 가 자동(`shouldFocusError`). **Radix 그룹은 ref 가 없어 자동 안 됨** →
  필드 블록을 `<div id={...}>` 로 감싸고 `handleSubmit` 의 2번째 인자(onInvalid)에서
  `scrollIntoView` 로 스크롤한다 (스크롤 컨테이너는 `main#app-scroll` — `window.scrollTo` 금지).
- 프론트 검증은 UX 사전검증일 뿐 — **권위 검증은 백엔드(eGovFrame)**. 서버 에러 표시 경로를 반드시 남길 것.

---

## 자주 하는 실수 (하지 말 것)

1. **useState 로 `errors` 상태 만들고 직접 if 검증** — 구버전 방식, 폐기됨. RHF 레인으로.
2. **검색필터 페이지에서 zod 스키마 직접 작성** — 셸 자동 생성 구조가 깨진다. required 는 선언만, 규칙 확장은 buildZodSchema.
3. **Radix 그룹에 register 스프레드** — 조용히 아무 동작 안 함. Controller 로.
4. **`message:` 로 에러 문구 지정** — zod v4 는 `{ error: '...' }`.
5. **폼 타입을 interface 로 따로 정의** — `z.infer` 로 파생 (규칙과 타입이 어긋나는 원인).
6. **전화/금액 가공 함수를 페이지에서 직접 호출** — `InputBox inputType`/`format` prop 에 맡긴다 (IME 가드 내장).
7. **버튼 활성 조건(글자수 등 UI 게이팅)을 zod 로 옮기기** — 설계서가 "버튼 비활성"으로 정의한 건 `disabled` 조건으로 유지 (검증 레인과 별개).
