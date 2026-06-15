# 컴포넌트에 디자인 입히기 (상세 가이드)

## 1. 폴더 구조

### ① raw (원본) — `src/ui/raw/`

- shadcn 도구가 자동 생성한 **기능만 있는 뼈대 컴포넌트**. 접근성·동작이 검증돼 있음.
- **🚫 절대 수정 금지.** 보기만 하세요.

### ② base (우리 컴포넌트) — `src/ui/common/base/` ← **여기를 작업합니다**

- raw를 가져와서 **우리 디자인(색/크기/모양)을 입힌 레이어.** 당신이 디자인을 입히는 곳.

### ③ styles 디자인 토큰 — src/styles 2개 파일로 나뉨 (v4)

- **`src/styles/tokens.css`** — 색/간격/둥글기 **값에 이름을 붙여둔 사전.** (실제 hex가 사는 곳)
- **`src/styles/tailwind.css` 의 `@theme {}`** — 그 토큰을 **Tailwind 클래스로 노출**하는 곳. (v4에서 예전 `tailwind.config.ts` 역할)
- **왜 토큰을 쓰나:** 색을 직접 박으면 바뀔 때 수백 군데를 고쳐야 함. 토큰(이름)으로 쓰면 한 줄만 고치면 전체가 바뀜. → **색·숫자 직접 입력 금지, 항상 토큰 클래스로.**

> 흐름: `tokens.css`(값) → `tailwind.css @theme`(클래스로 노출) → 당신은 **클래스 이름만** 적음.
> 예: `bg-primary`, `text-krds-text-primary`, `rounded-krds-8`.

---

## 2. 환경 준비 (최초 1회)

```bash
npm install
npm run dev          # → http://localhost:5173 (포트 사용 중이면 5174… 자동 증가)
# 브라우저에서 http://localhost:5173/guide 열기 (작업 결과 확인)
```

- **`/guide` 페이지가 작업 거울입니다.** 모든 컴포넌트 상태가 한 화면에. 파일 저장 시 자동 새로고침.
- 좌측 메뉴(base/composites/feedback/layout)는 그룹을 눌러 펼침.

---

## 3. 폴더 지도 (만질 곳 / 절대 안 만질 곳)

| 경로                                 | 무엇                         | 당신이?                                          |
| ------------------------------------ | ---------------------------- | ------------------------------------------------ |
| `src/ui/raw/`                        | shadcn 원본 뼈대             | 🚫 **절대 수정 금지**                            |
| **`src/ui/common/base/`**            | 우리 단일 컴포넌트           | ✅ **여기에 디자인 입힘**                        |
| `src/ui/common/composites/`          | base 조합 복합 컴포넌트      | ✅ 필요 시                                       |
| `src/styles/tokens.css`              | 토큰 값(hex) 사전            | ⚠️ 새 색 필요 시만, 리드 확인 후                 |
| `src/styles/tailwind.css` (`@theme`) | 토큰 → 클래스 노출           | ⚠️ 새 토큰 추가 시만                             |
| `src/utils/cn.ts`                    | 클래스 병합 + krds 토큰 등록 | ⚠️ 새 krds 색/폰트 토큰 추가 시 함께 등록 (§7-B) |

---

## 4. 디자인 입히는 실제 절차 (컴포넌트 1개 기준)

**예: Button — `src/ui/common/base/Button.tsx`**

### STEP 1. Figma에서 값 읽기

배경색·글자색·테두리색(상태별), 높이·padding·gap, 둥글기, 글자 크기/굵기.

### STEP 2. Figma 값을 "토큰 클래스"로 번역

`#256ef4` 같은 실제 값을 직접 쓰지 말고 §6 치트시트로 **클래스 이름**으로. 예: 파란 배경 → `bg-primary`, 둥글기 8px → `rounded-krds-8`, 높이 48px → `h-12`.

### STEP 3. base 파일 `cva`에 클래스 채우기

당신은 **따옴표 안 클래스 문자열만** 손봅니다:

```tsx
const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-krds-3 rounded-krds-8',
    'font-bold transition-colors',
    'disabled:bg-krds-bg-disabled disabled:text-krds-text-disabled',
  ),
  {
    variants: {
      variant: {
        // Figma style 명과 1:1
        primary: 'bg-primary text-white active:bg-krds-action-primary-active',
        secondary: 'border border-krds-border-primary bg-background text-krds-text-primary',
        inner: 'border border-krds-border-primary bg-background font-medium text-krds-text-primary',
      },
      size: {
        default: 'h-12 min-w-[76px] px-krds-5 text-krds-body-md', // 높이 48
        sm: 'h-10 px-krds-4 text-krds-body-sm',
        lg: 'h-14 px-krds-8 text-krds-body-lg',
        icon: 'size-12',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)
```

- 공통은 위 `cn(...)`, 종류별은 `variants.variant`, 상태는 접두사(`hover:`/`active:`/`disabled:`/`focus-visible:`).

### STEP 4. 저장 → `/guide`에서 즉시 확인

variant × size × 상태 **모든 조합**을 Figma와 대조.

---

## 5. 토큰 매핑 치트시트 (Figma 값 → 적을 클래스)

**색상**
| 의도 | 클래스 |
|------|------|
| 기본 파랑 배경 | `bg-primary` |
| 흰 글자 | `text-white` |
| 기본 텍스트(잉크) | `text-krds-text-ink` / `text-krds-text-primary` |
| 보조 텍스트(연회색) | `text-krds-text-muted` |
| 흰 배경 / 연회색 배경 | `bg-background` / `bg-muted` |
| 기본 테두리 | `border border-krds-border-primary` |
| 비활성 배경/글자 | `bg-krds-bg-disabled` / `text-krds-text-disabled` |
| 에러(빨강) | `text-krds-feedback-danger` |

**간격 / 둥글기 / 타이포**
| 의도 | 클래스 |
|------|------|
| 좌우 여백 | `px-krds-4` `px-krds-5` `px-krds-8` |
| 요소 간 간격 | `gap-krds-3` 등 |
| 모서리 8px | `rounded-krds-8` |
| 높이 40/48/56 | `h-10` / `h-12` / `h-14` |
| 본문 글자 | `text-krds-body-sm/md/lg` |
| 굵기 | `font-medium` / `font-bold` |

> 토큰 이름이 헷갈리면 **값은 `src/styles/tokens.css`**, **클래스 노출은 `src/styles/tailwind.css`의 `@theme`** 에서 검색. 없는 토큰은 지어내지 말고 비슷한 기존 토큰 사용 또는 리드 확인.

---

## 6. [실전 예제] 버튼 색 바꾸기 — 토큰부터 컴포넌트까지 (v4)

> 시나리오: "기본 버튼(primary) 배경이 새 남색 `#0b3d91`으로 바뀜."

**흐름:** `tokens.css`(값) → `tailwind.css @theme`(클래스 노출) → (새 토큰이면) `cn.ts`(등록) → `Button.tsx`(적용)

### 6-A. 기존 색을 통째로 바꾸기 — `tokens.css` 한 줄 (가장 간단)

"기본 파랑(primary)" 역할이 가리키는 색만 교체:

```css
/* src/styles/tokens.css — SEMANTIC 구역 */
/* before */
--krds-action-primary: var(--krds-d2b-blue);
/* after  */
--krds-action-primary: var(--krds-color-brand-navy);
```

```css
/* src/styles/tokens.css — :root PRIMITIVE 구역 (실제 hex는 여기에만) */
--krds-color-brand-navy: #0b3d91;
```

✅ `Button.tsx`도 `tailwind.css`도 안 건드려도 됨. `primary`가 이미 `bg-primary`(→ `--primary` → `--krds-action-primary`)를 쓰므로 자동 반영. 같은 토큰 쓰는 모든 곳이 한꺼번에 바뀜.

### 6-B. 버튼에만 별도 색 주기 — 파일 3~4개 순서대로

#### 1단계 — `src/styles/tokens.css` (값 정의)

```css
/* PRIMITIVE — 실제 hex */
--krds-color-brand-navy: #0b3d91;
/* SEMANTIC — 역할 토큰 신설 */
--krds-bg-button: var(--krds-color-brand-navy);
```

#### 2단계 — `src/styles/tailwind.css` 의 `@theme` (클래스로 노출)

```css
@theme {
  /* ...기존 --color-krds-* 줄들... */
  --color-krds-bg-button: var(--krds-bg-button); /* → 클래스: bg-krds-bg-button */
}
```

- 규칙: `@theme`의 `--color-{이름}` → 클래스 `bg-{이름}` / `text-{이름}` / `border-{이름}`.
- ✅ **v4에서는 `@theme`도 CSS라 저장하면 dev 서버 그대로 즉시 반영**(예전 config처럼 재시작 불필요).

#### 3단계 — `src/utils/cn.ts` (⚠️ v4 필수 — 새 krds 색/폰트 토큰이면 꼭)

`cn()`이 클래스를 올바르게 병합하려면 새 krds 색 토큰을 등록해야 합니다. 빠뜨리면 **다른 색 클래스를 같은 그룹으로 오인해 지워버리는 회귀**가 납니다(과거 Button 흰 글자 사라진 사건).

```ts
const KRDS_COLOR_NAMES = [
  // ...기존...
  'krds-bg-button', // ← 추가
] as const
```

#### 4단계 — `src/ui/common/base/Button.tsx` (적용)

```tsx
// before
primary: 'bg-primary text-white active:bg-krds-action-primary-active',
// after
primary: 'bg-krds-bg-button text-white active:bg-krds-action-primary-active',
```

### 정리표 — 무엇을 바꾸려면 어느 파일

| 바꾸려는 것                         | 고치는 파일                                                          |
| ----------------------------------- | -------------------------------------------------------------------- |
| "기본 파랑" 자체를 새 색으로 (전역) | `tokens.css` 1~2줄 (§7-A)                                            |
| 버튼에만 별도 색 (새 토큰)          | `tokens.css` → `tailwind.css @theme` → `cn.ts` → `Button.tsx` (§7-B) |
| 색은 그대로, 크기/여백/모양만       | `Button.tsx` 만 (§5)                                                 |

> 황금률: **실제 hex는 `tokens.css` PRIMITIVE에만.** 나머지는 전부 이름(`var()`/클래스)으로 참조 — 컴포넌트에 hex 직접 금지(§9).

### 7-C. `@theme` 네임스페이스 전체 레퍼런스 (색 외 타입까지)

§7-B는 **색**(`--color-*`) 예시였습니다. `@theme` 변수의 **접두사**가 어떤 Tailwind 클래스를 만들지 결정합니다 — 타입별로 접두사가 다릅니다.

| `@theme` 접두사 | 만들어지는 클래스                                               | `cn.ts` 등록?               |
| --------------- | --------------------------------------------------------------- | --------------------------- |
| `--color-*`     | `bg- text- border- ring- fill- stroke- outline-`                | ✅ 필요 (§7-B 3단계)        |
| `--text-*`      | `text-`(**폰트 크기**)                                          | ✅ 필요 (`KRDS_FONT_SIZES`) |
| `--spacing-*`   | `p- m- gap- space- w- h- size- min-w- max-w- inset- top- left-` | ❌ 불필요                   |
| `--radius-*`    | `rounded-*`                                                     | ❌ 불필요                   |
| `--shadow-*`    | `shadow-*`                                                      | ❌ 불필요                   |
| `--font-*`      | `font-*`(패밀리)                                                | ❌ 불필요                   |
| `--animate-*`   | `animate-*`                                                     | ❌ 불필요                   |

> ⚠️ **`cn.ts` 등록은 색·폰트크기만.** 둘은 `text-*` 패턴이 겹쳐 twMerge 가 오분류하기 때문(§7-B 3단계). 간격/라운드/그림자/애니메이션은 이름 충돌이 없어 등록 안 해도 됩니다.

**타입별 등록 문법** (값은 항상 `var(--krds-*)` 참조 — hex 직접 금지):

```css
/* src/styles/tailwind.css 의 @theme {} 안 */

/* 간격 — p-/m-/gap-/w- 등 */
--spacing-krds-5: var(--krds-space-5); /* → p-krds-5, gap-krds-5 ... */

/* 폰트 크기 — 줄높이 "동봉"(권장). 크기+줄높이가 한 클래스로 */
--text-krds-body-md: var(--krds-font-size-body-md);
--text-krds-body-md--line-height: var(--krds-line-height-body);
/* (선택) --text-krds-body-md--font-weight / --letter-spacing 도 가능 */

/* 라운드 */
--radius-krds-8: var(--krds-radius-d2b); /* → rounded-krds-8 */

/* 그림자 */
--shadow-krds-3: var(--krds-shadow-3); /* → shadow-krds-3 */

/* 애니메이션 — @keyframes 도 @theme 안에 같이 둔다 */
--animate-accordion-down: accordion-down 0.2s ease-out; /* → animate-accordion-down */
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}
```

**폰트 크기 추가 전체 예** (줄높이 + cn.ts):

```css
/* ① tokens.css */
--krds-font-size-body-2xl: 1.375rem; /* 22px */
/* ② tailwind.css @theme */
--text-krds-body-2xl: var(--krds-font-size-body-2xl);
--text-krds-body-2xl--line-height: var(--krds-line-height-body);
```

```ts
/* ③ cn.ts (폰트크기라 필수) */ const KRDS_FONT_SIZES = [/* ... */ 'krds-body-2xl']
```

→ 사용: `text-krds-body-2xl` (크기+줄높이 한 번에)

> 핵심 한 줄: **접두사가 유틸 종류를 정한다.** 색은 `--color-`, 크기는 `--text-`, 간격은 `--spacing-`. `--color-`에 크기 넣거나 `--text-`에 색 넣으면 안 됨.

---

## 7. 아이콘 규칙

```tsx
import { Icon } from '@/ui/common/base/Icon'
;<Icon name="Search" size={20} />
```

- 이름은 **Google Material 기준** (닫기=`Close`, 펼침=`ExpandMore`, 알림=`Notifications`).
- 🚫 `lucide-react` import 금지. 버튼 안 아이콘은 **자식으로** (`<Button><Icon name="Search" />검색</Button>`).

---

## 8. 🚫 절대 하지 말 것

1. **색·숫자 직접 박기 금지** (`#256ef4`, `16px` ❌) → 항상 토큰 클래스.
2. **`src/ui/raw/` 수정 금지.**
3. **`.css` 파일 새로 만들기 금지.**
4. **`lucide-react` import 금지.**
5. **컴포넌트 동작/구조(JSX·props·로직) 변경 금지** — "스타일 클래스"만. 구조 변경은 개발자에게 문의.
6. **variant 이름 임의 변경 금지** (Figma style 명과 1:1).
7. **새 krds 색/폰트 토큰 추가 시 `cn.ts` 등록 누락 금지** (§7-B 3단계).

---

## 9. 끝내기 전 체크리스트

- [ ] `/guide`에서 해당 컴포넌트의 모든 variant × size × 상태가 Figma와 일치
- [ ] 하드코딩 색(`#`)·px 숫자 없음
- [ ] raw 안 건드림 / `.css` 안 만듦 / lucide 안 씀
- [ ] (새 krds 토큰 추가 시) `tokens.css` + `tailwind.css @theme` + `cn.ts` 3곳 모두 등록
- [ ] `npm run lint` · `npm run build` 에러 없음

---

## 10. 막히면

- 토큰 모름 → `src/styles/tokens.css`(값) / `src/styles/tailwind.css @theme`(클래스) 검색 → 없으면 리드.
- Figma 값이 기존 토큰과 미묘하게 다름 → 임의로 새 색 만들지 말고 가장 가까운 토큰 + 리드 확인.
- 구조 변경 필요 → 개발자에게 문의 (퍼블 단독으로 JSX 변경 금지).
