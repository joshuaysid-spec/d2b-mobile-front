# 컴포넌트 규칙 — 파일 명명 · shadcn/ui · 아이콘

> CLAUDE.md 에서 분할된 상세 규칙. 컴포넌트 생성/이름 결정 · raw/base 수정 · 아이콘 추가 시 반드시 먼저 읽는다.

## 파일 명명 규칙 (컴포넌트 추가 시)

| 위치 | 케이스 | 예 | 비고 |
|------|------|----|------|
| `src/ui/raw/` | **kebab-case / lowercase** | `button.tsx`, `radio-group.tsx`, `switch.tsx` | shadcn CLI 출력 그대로 — 임의로 바꾸지 말 것. `components.json` `aliases.ui` 가 이 경로를 지정. |
| `src/ui/common/base/` | **PascalCase** (한 단어 = 그대로, 복합어 = 단어 경계마다 대문자) | `Button.tsx`, `Checkbox.tsx`, `InputBox.tsx`, `RadioButton.tsx`, `SegmentedControl.tsx`, `TextArea.tsx` | 파일명 = 주요 export 컴포넌트명. |
| `src/ui/common/composites/` | **PascalCase**, 그룹/리스트는 보통 `XxxGroup` | `ButtonGroup.tsx`, `RadioButtonGroup.tsx` | base + 도메인 합성. |
| `src/ui/biz/{도메인}/` | **설계서 화면 ID 기반 PascalCase** | `prcmPlanIntgList/PrcmPlanIntgListPage.tsx`, `prcmPlanDtl/PrcmPlanDtl_PrdList.tsx` | 아래 "설계서 화면 ID → 파일명 변환 규칙" 참고. |

**biz 도메인 폴더 코드 (`src/ui/biz/{도메인}/`):**

도메인 폴더명은 아래 약어로 **고정**한다(백엔드 API 도메인과 일치). 새 화면은 반드시 해당 도메인 폴더 아래에 둔다.

| 폴더 | 도메인 |
|------|--------|
| `op` | 조달 |
| `bd` | 입찰 |
| `ct` | 계약 |
| `ex` | 이행 |
| `wm` | 대금청구/사후 |
| `ts` | 업무지원 |
| `st` | 통계 |
| `cm` | 공통관리 |
| `fb` | dapa-fpbis (영문) |

> **공통관리(`cm`)**: 특정 업무 도메인에 속하지 않는 공통 화면은 전부 `cm/` 아래에 둔다 — `cm/home`(메인) · `cm/mypage` · `cm/notice` · `cm/notification` · `cm/support` · `cm/auth` · `cm/terms` · `cm/error` · `cm/search`. (메인/마이페이지/공지/알림/고객센터를 `biz/` 최상위에 두지 말 것.)

**설계서 화면 ID → 파일명 변환 규칙 (biz 도메인 화면):**

- `src/ui/biz/{도메인}/` 의 화면(페이지·탭·팝업·시트)은 **설계서(사용자인터페이스설계서) 영문 화면 ID 를 따른다.**
- 규칙: **설계서 화면 ID 를 그대로 쓰되 첫 글자만 대문자로** 올려 PascalCase 규약을 만족시킨다. **언더스코어·내부 대소문자는 설계서 그대로 보존**(설계서 ↔ 코드 1:1 추적).
  - `prcmPlanDtl_PrdList` → `PrcmPlanDtl_PrdList` · `prcmPlanDtl_spclCtrt` → `PrcmPlanDtl_spclCtrt` · `prcmPlanDtl_OpnnDtl` → `PrcmPlanDtl_OpnnDtl`
- **폴더명 = 화면 ID(camelCase 그대로)**, 그 안의 파일/컴포넌트 = 위 규칙(첫 글자 대문자). 폴더(`prcmPlanDtl`)와 파일(`PrcmPlanDtl`)이 대소문자만 다른 중첩은 허용.
- **페이지**(통합목록 컨테이너 등)는 화면 ID + `Page` 접미사: `PrcmPlanIntgListPage`, `PrcmPlanDtlPage`. (접미사 덕에 같은 ID 의 탭 콘텐츠 `PrcmPlanDtl` 과 충돌 안 함 — 탭에는 `Content` 등 군더더기 접미사 붙이지 말 것.)
- 설계서 ID 가 없는 하위 조립물(예: 의견 카드)은 가장 가까운 상위 화면 ID 에서 파생: `PrcmPlanDtl_OpnnCard`.
- **컨테이너 타입 접미사 — 규칙: wrapper 접미사 = 감싸는 컨테이너 컴포넌트명. 그리고 wrapper 를 만드는 컨테이너는 `FullPopup` 하나뿐이다.** 따라서 전용 래퍼는 화면 ID 뒤에 **언더스코어 없이** `FullPopup` 을 붙인다(예전 `Popup` 접미사는 폐기 — 'Popup'은 바텀시트·모달까지 포함하는 카테고리 단어라 종류를 특정 못 함): `PrcmPlanDtl_OpnnDtlFullPopup`(P06 의견상세) · `PrcmPlanDtl_OpnnRegFullPopup`(의견등록) · `BfhdSpcfctDtl_OpnnDtlFullPopup`. 풀팝업만 래퍼로 캡슐화하는 이유 = 본문이 화면급으로 무겁고(긴 폼·variant·검증) footer/title 이 화면 고유라 부모로 끌어올리면 페이지가 비대해지기 때문. 탭 콘텐츠·페이지엔 안 붙임(페이지는 `Page`).
- **⚠️ BottomSheet · AlertModal 은 전용 래퍼(`*Sheet`)를 만들지 않는다.** 부모(페이지 또는 탭 콘텐츠)가 컨테이너(`BottomSheet`/`AlertModal`)를 직접 렌더하고, 그 사이에 **콘텐츠만 분리한 컴포넌트**(아코디언/테이블 등)를 끼워 넣는다. 컨테이너 props(`title`/`footer`/`open`/`onOpenChange`)는 **부모가 소유**한다.
  - 콘텐츠 컴포넌트는 화면 ID 그대로(접미사 없이): P12 연관조달 콘텐츠 = `AnlPrcmPlanDtl`(컨테이너는 부모의 `<BottomSheet>`). 적용 예: `src/ui/biz/op/prcmPlanDtl/PrcmPlanDtl.tsx`(BottomSheet+`AnlPrcmPlanDtl` 직접 조립) · `PrcmPlanDtlPage.tsx`(AlertModal·출력물 BottomSheet 인라인).
  - 단순 확인(예/아니오) AlertModal 은 `description` prop 으로 끝나면 별도 콘텐츠 컴포넌트도 불필요 — 페이지에 인라인.
  - 과거 `*Sheet` 래퍼(예전 `AnlPrcmPlanDtlSheet`)는 이 패턴으로 전환됨. 신규 BottomSheet/AlertModal 에 `Sheet` 접미사 래퍼를 새로 만들지 말 것. (관련: 메모리 `bottomsheet-slot-composition`)
- 파일명 = 주요 export 컴포넌트명 = `displayName` 문자열 모두 동일하게 맞춘다. 공유 데이터 타입(`OpinionData` 등)은 화면 ID 로 바꾸지 않는다.
- **MS/CM 공통 화면도 동일 규칙** — 메뉴/공통(`cm/`) 화면도 영문 화면 ID 를 따른다. 출처는 설계서(사용자인터페이스설계서) + `docs/spec/` 앱메뉴 문서(xlsx). 예: 알림현황 MUI-MS-01-M13 → `NotiPrst`(`cm/notiPrst/NotiPrstPage.tsx`) · 햄버거메뉴 MUI-MS-01-M12 → `menu`. 영문 ID 를 먼저 찾아 파일/폴더명에 반영하고, 임의 영문명(`NotificationPage` 등) 금지.
- 화면 ID 출처: 설계서 각 "화면 목록" 표(화면ID/한글명/영문ID).

**Figma → 파일명 변환 규칙:**

- Figma 컴포넌트명은 보통 `m_` 접두사 + 소문자 + 공백/언더바 (예: `m_segmented control_option`, `m_text input_box`, `m_radiobutton`).
- 변환: `m_` 제거 → 단어 경계 PascalCase 화 → 의미 단순화 가능.
  - `m_segmented control_option` → `SegmentedControl` (아톰이면 `Option` 생략 가능, 트랙 컴포지트가 따로 있을 때만 구분)
  - `m_text input_box` → `InputBox`
  - `m_text area_box` → `TextArea`
  - `m_select_box` → `SelectBox`
  - `m_radiobutton` → `RadioButton`
- Figma 명을 그대로 영문 옮기되 한국어 약칭은 풀어 적기 (`m_segmented_ctrl` 같이 줄여진 경우라도 풀네임 `SegmentedControl` 사용).

**새 컴포넌트 추가 시 필수 절차:**

1. raw 가 필요한 컴포넌트: `npx shadcn@latest add <name> --yes --overwrite` → `src/ui/raw/<name>.tsx` 생성 (CLI 가 알아서 kebab-case 처리).
2. `src/ui/common/base/<PascalCase>.tsx` 작성 — raw import + KRDS 토큰 / Figma 스타일.
3. `src/ui/dev/ComponentGuidePage.tsx` 에 (a) import (b) `NAV.base.items` 한 줄 (c) Section 데모 추가. **PostToolUse 훅이 자동으로 상기시켜 줌.**
4. `docs/02-design/features/krds-design-system.design.md` 의 base 컴포넌트 목록도 동기화.

## shadcn/ui — 가장 자주 틀리는 부분

- shadcn/ui 는 **npm 의존성이 아니다.** `npx shadcn add <컴포넌트>` CLI 가 컴포넌트 **소스 코드를 레포에 복사**하고, 복사된 코드는 우리가 소유·수정한다.
- base 컴포넌트는 **반드시 `npx shadcn add` 로 정본을 받은 뒤** KRDS 토큰/Figma 값을 입힌다.
  **손으로 shadcn 흉내 내서 새로 작성하지 말 것** (검증된 접근성·Slot·variant 구조를 잃는다).
- **컴포넌트 경로 (2층 구조):**
  - `src/ui/raw/` — `npx shadcn add` 결과물. **절대 직접 수정 금지.** (`components.json` `aliases.ui` 가 여기를 지정)
  - `src/ui/common/base/` — raw 를 import 해서 KRDS 토큰/Figma 스타일을 입힌 커스텀 레이어. 다른 파일은 여기서 import.
- **스타일 커스텀은 오직 base 에서만 (raw 는 원본 그대로).**
  - raw 에 박힌 클래스(`buttonVariants`, accordion 의 `animate-accordion-*` 등)는 **전부 shadcn 원본**이다 — 우리 커스텀이 아니다. 건드리지 말 것.
  - **raw 의 스타일을 비우거나 base 로 "이관"하지 말 것.** raw 기본값 + base 오버라이드가 **중첩되는 건 정상**이고, `cn()`(tailwind-merge)이 충돌 클래스를 정리해 최종 출력엔 base 값만 남는다. 중첩은 비효율이 아니다.
  - 즉 색·크기·여백·radius 등은 **base 의 `className`(KRDS 토큰) 오버라이드**로만 커스텀한다. (className 으로 못 바꾸는 고정 자식/구조 케이스만 아래 "raw 우회" 규칙 적용)
- **새 shadcn 컴포넌트 추가 절차 (반드시 이 순서):**
  1. `npx shadcn@latest add <컴포넌트> --yes --overwrite` → `src/ui/raw/<컴포넌트>.tsx` 생성
  2. `src/ui/common/base/<컴포넌트>.tsx` 작성 — raw import + KRDS className 오버라이드
  3. 다른 파일은 `@/ui/common/base/<컴포넌트>` 에서 import
- **설치 예:** `npx shadcn@latest add button --yes --overwrite`
- **raw → base 커스텀 패턴:**
  ```tsx
  // src/ui/common/base/Button.tsx
  import { Button as RawButton } from '@/ui/raw/button'

  // 1) 우리 variant cva 정의 (Figma style 명과 1:1)
  const buttonVariants = cva('...KRDS 베이스...', { variants: { variant: { primary: '...', ... } } })

  // 2) raw의 variant/size 타입을 Omit하고 우리 타입으로 교체
  interface ButtonProps extends Omit<ComponentPropsWithoutRef<typeof RawButton>, 'variant'|'size'>,
    VariantProps<typeof buttonVariants> {}

  // 3) className으로 KRDS 스타일 주입 — tailwind-merge가 충돌 해결
  const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
    <RawButton ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ))
  ```
- **raw 우회가 필요해 보일 때 — 임의로 Radix 직접 사용하지 말고 사용자에게 먼저 물어본다.**
  raw shadcn 컴포넌트가 내부 JSX 자식을 고정해서 구조 자체를 못 바꾸는 상황(예: `Checkbox` 칩 디자인이
  `CheckboxPrimitive.Indicator` 구조를 오버라이드 못 함)이 보이면, **곧장 `@radix-ui/*` 프리미티브로 새로 짜지 말고**
  "raw 를 못 쓰는 이유 + Radix 직접 사용 제안"을 사용자에게 제시하고 승인을 받은 뒤에 진행한다.
  - 이미 승인되어 Radix 직접 사용 중인 기존 예외(코드에 사유 주석 있음): `Checkbox`, `RadioButton`, `SelectBox`(트리거 칩),
    `Switch`, `BottomSheet`, `AlertModal`, `FullPopup`. 이들은 재승인 불필요 — 그대로 둔다.
  - 승인 후 Radix 직접 사용 시에는 해당 파일 상단에 사유 주석을 남긴다.
- **shadcn 규약을 따른다 — 임의 API 발명 금지:**
  - 아이콘은 **children** 으로 전달, 위치는 자식 순서로 결정 (`<Button><Icon />텍스트</Button>`).
    `leftIcon` / `rightIcon` 같은 props 를 만들지 말 것.
  - 아이콘 전용 버튼 = `size="icon"`.
  - variant 이름은 해당 Figma 컴포넌트 디자인을 따른다 (예: Button = `primary`/`secondary`/`inner`).
    stock shadcn 이름을 그대로 강제하지 않고, Figma `style` 명칭과 1:1 로 맞춘다.

## 아이콘 정책 — 가장 자주 헷갈리는 부분

**모든 신규 아이콘은 `Material Symbols Outlined` **폰트** 기반 `Icon` 컴포넌트로만 추가한다.**

> ⚠️ 과거엔 `@mui/icons-material`(구 Material **Icons**) 기반이었으나, 디자인 원본(Figma)이 Google **Material Symbols**(신) 기준이라 모양이 안 맞아 **아이콘 폰트(self-host)** 방식으로 전환함. 이제 `@mui/*` 는 미사용(import 금지).

```tsx
import { Icon } from '@/ui/common/base/Icon'

<Icon name="Search" size={20} />                    // ✅ REGISTRY 키(PascalCase)
<Icon name="Close" size={20} className="text-..." />// ✅ className 통과 · 색은 currentColor(text-*)
<Icon name="Star" fill={1} weight={700} />          // ✅ 가변 축 FILL(0/1)·wght(100~700) 제어
<Icon><MyCustomSvg /></Icon>                        // ✅ REGISTRY 미등록 아이콘은 children(SVG)
```

**작동 원리**: `Icon` 은 `name`(PascalCase) → **ligature(snake_case)** 로 매핑해 `<span className="material-symbols-outlined">home</span>` 로 렌더한다. 폰트의 `liga` 기능이 `home` → 🏠 글리프로 합자.

**폰트 self-host (폐쇄망 대응 — 중요)**: (상세: `docs/closed-network-fonts.md`)
- 폰트 실파일: `public/fonts/material-symbols-outlined.woff2` (전체 가변폰트 ~3.8MB). `@font-face` 와 `.material-symbols-outlined` 클래스는 `src/styles/globals.css` 에서 직접 정의.
- **CDN `@import url(구글폰트)` 금지** — 폐쇄망에서 폰트 404 → 아이콘이 "home" 같은 텍스트로 깨짐.
- 폰트 원본은 `material-symbols` npm 패키지. 갱신 시 `node_modules/material-symbols/material-symbols-outlined.woff2` → `public/fonts/` 재복사.
- 서브셋(용량 축소)은 현재 미적용 — 나이브한 ligature 텍스트 서브셋은 'liga' 클로저로 거의 안 줄어드니 함부로 시도 말 것.

**금지**: 새 코드에서 `import { X } from 'lucide-react'` 처럼 lucide 를 import 하지 말 것. 기존에 남아있는 lucide 는 `src/ui/raw/*` 4개 파일뿐이며, 이건 **shadcn CLI 가 강제로 박은 정본 코드라서 수정 금지** (raw 규칙 = 위 "shadcn/ui" 절).

**REGISTRY 에 없는 아이콘이 필요할 때 추가 절차 (import/번들 작업 불필요 — 폰트에 모든 글리프 포함):**

1. https://fonts.google.com/icons 에서 **Material Symbols** 아이콘 찾기 → 상세의 코드명(snake_case) 확인 (예: `location_on`).
2. `src/ui/common/base/Icon.tsx` 의 `REGISTRY` 에 한 줄 추가 (알파벳 순서 유지). 키=PascalCase, 값=ligature:
   ```ts
   LocationOn: 'location_on',
   ```
3. 사용처에서 `<Icon name="LocationOn" />` 호출.

**아이콘 이름 매핑 참고** (lucide ≠ Material Symbols · 키=REGISTRY PascalCase, 괄호=ligature):

| lucide | REGISTRY 키 (ligature) |
|--------|------------------------|
| `X` | `Close` (`close`) |
| `Check` | `Check` (`check`) |
| `ChevronDown` | `ExpandMore` (`expand_more`) |
| `ChevronLeft/Right` | `ChevronLeft/Right` (`chevron_left/right`) |
| `ChevronsLeft/Right` | `KeyboardDoubleArrowLeft/Right` (`keyboard_double_arrow_left/right`) |
| `Bell` | `Notifications` (`notifications`) |
| `FileText` | `Description` (`description`) |
| `Megaphone` | `Campaign` (`campaign`) |
| `User` | `Person` (`person`) |
| `ArrowRight` | `ArrowForward` (`arrow_forward`) |
| `Plus` | `Add` (`add`) |
| `Search` | `Search` (`search`) |
| `Home` | `Home` (`home`) |

> 참고: Material Symbols 는 채움/아웃라인을 별도 이름이 아닌 **FILL 축**으로 구분한다. `Favorite`/`Star`(채움)·`FavoriteBorder`/`StarBorder`(아웃라인)는 같은 ligature(`favorite`/`star`)에 `Icon.tsx` 의 `FILLED_BY_DEFAULT` 로 기본 FILL 만 다르게 매핑돼 있음.
