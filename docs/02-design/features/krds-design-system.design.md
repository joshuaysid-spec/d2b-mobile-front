---
template: design
version: 1.3
feature: krds-design-system
date: 2026-05-21
author: gongjiyeon
project: d2b-mobile-front
projectVersion: 0.1.0
---

# krds-design-system Design Document

> **Summary**: KRDS(디지털정부 디자인 시스템) Primitive·Semantic 토큰을 단일 `tokens.css`에 CSS 변수로 정의하고, `globals.css`가 이를 shadcn 호환 토큰명으로 브리지하며, `tailwind.config.ts` theme에 매핑한다. Pretendard GOV 폰트를 전역 적용하고, shadcn base 컴포넌트 초기 세트를 `cva`로 KRDS 스타일화한다.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: gongjiyeon
> **Date**: 2026-05-21
> **Status**: Draft
> **Planning Doc**: [krds-design-system.plan.md](../../01-plan/features/krds-design-system.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A (스타일/토큰 전용 기능) |
| Phase 2 | Coding Conventions | `docs/frontend-architecture.md` §12, §14 참조 |
| Phase 3 | Mockup | N/A (Figma Dev Mode MCP 직접 참조로 대체) |
| Phase 4 | API Spec | N/A (백엔드 통신 없음) |

---

## Context Anchor

> Plan 문서에서 복사. Design→Do 핸드오프 시 전략적 맥락 유지.

| Key | Value |
|-----|-------|
| **WHY** | KRDS 기반 피그마 디자인을 코드에 일관 반영할 토큰·폰트·컴포넌트 체계가 없음 |
| **WHO** | D2B 모바일 프론트 개발자 · 정부 서비스 사용자(접근성 요구) |
| **RISK** | Figma MCP 미연결 시 디자인 정밀 반영 불가 · KRDS 전체 CSS 도입 시 Tailwind 충돌(→토큰 방식으로 회피) · npm 미설치 |
| **SUCCESS** | KRDS 토큰 CSS 변수화 + Tailwind 매핑 + Pretendard GOV 적용 + shadcn base 초기 세트 KRDS 스타일 동작 |
| **SCOPE** | Phase 1 Figma MCP 연결 → Phase 2 토큰·폰트 글로벌 세팅 → Phase 3 shadcn base 컴포넌트 + KRDS 스타일 |

> **Status update**: Figma Dev Mode MCP가 현재 세션에 연결되어 있음(`get_variable_defs`, `get_design_context` 등 사용 가능). 따라서 RISK의 "Figma MCP 미연결" 항목은 대부분 해소됨 — 남은 작업은 디자인 파일 선택/참조 절차 확인.

---

## 1. Overview

### 1.1 Design Goals

- KRDS 디자인 토큰을 **단일 소스(`src/styles/tokens.css`)** 로 정의해 모든 스타일이 이를 참조하게 한다.
- 기존 shadcn 토큰명(`--primary`, `--border`, `--muted` 등)과의 **호환 브리지**를 유지해, 이미 작성된 layout/page 컴포넌트의 Tailwind 클래스가 깨지지 않게 한다.
- KRDS 컴포넌트 스타일을 별도 CSS 파일 없이 **`cva` 변형**으로만 표현해 Tailwind 단일 체계를 유지한다.
- Pretendard GOV 폰트를 앱 전역에 적용한다.

### 1.2 Design Principles

- **단일 토큰 소스 (Single Source of Truth)**: 색상/간격/타이포 수치는 `tokens.css`의 CSS 변수에만 존재. 컴포넌트·config는 변수를 참조만 한다.
- **2계층 토큰 (Primitive → Semantic)**: Primitive는 원시 팔레트/스케일, Semantic은 용도별 맥락 토큰. Component 계층은 별도 CSS 파일 대신 `cva`가 담당.
- **비파괴적 확장 (Non-breaking extension)**: 기존 shadcn 토큰명을 KRDS Semantic 토큰으로 재정의(remap)하되 토큰명은 유지 → 기존 소비처 무영향.
- **Tailwind 단일 체계**: 컴포넌트 스타일은 `cva` + Tailwind 유틸로만. 컴포넌트별 `.css` 금지.

---

## 2. Architecture Options

### 2.0 Architecture Comparison

| Criteria | Option A: Minimal | Option B: Clean 3-tier | Option C: Pragmatic |
|----------|:-:|:-:|:-:|
| **Approach** | KRDS 값 직접 `globals.css :root` | primitive/semantic/component CSS 분리 | 단일 `tokens.css` (Primitive+Semantic) |
| **New Files** | ~6 | ~10 | ~7 |
| **Modified Files** | 2 | 3 | 3 |
| **Complexity** | Low | High | Medium |
| **Maintainability** | Medium | High | High |
| **Effort** | Low | High | Medium |
| **Risk** | Low (coupled) | Low (clean) | Low (balanced) |
| **Recommendation** | Quick prototype | Component 토큰 필요 시 | **Default choice** |

**Selected**: **Option C — Pragmatic** — **Rationale**: Plan §7.3가 이미 단일 `tokens.css` 구조를 제안. KRDS의 Primitive→Semantic 계층을 보존하면서 Component 계층은 `cva`로 위임해 프로젝트가 아직 필요로 하지 않는 세 번째 CSS 파일을 만들지 않는다. Tailwind 단일 체계 제약을 충족한다.

### 2.1 Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  src/styles/tokens.css                                        │
│  ┌─────────────────┐      ┌──────────────────────────────┐    │
│  │ Primitive Tokens │ ──▶ │ Semantic Tokens               │    │
│  │ --krds-color-*   │      │ --krds-bg-*, --krds-text-*,   │    │
│  │ --krds-space-*   │      │ --krds-border-*, --krds-...   │    │
│  │ --krds-radius-*  │      └──────────────┬───────────────┘    │
│  │ --krds-font-*    │                     │                    │
│  │ --krds-shadow-*  │                     ▼                    │
│  └─────────────────┘      ┌──────────────────────────────┐    │
│                            │ globals.css :root             │    │
│                            │ shadcn 호환 브리지             │    │
│                            │ --primary, --border, --muted… │    │
│                            │   = var(--krds-* semantic)    │    │
│                            └──────────────┬───────────────┘    │
└───────────────────────────────────────────┼───────────────────┘
                                             ▼
                          ┌──────────────────────────────┐
                          │ tailwind.config.ts theme      │
                          │ colors / spacing / radius /   │
                          │ fontSize / fontFamily / shadow│
                          └──────────────┬───────────────┘
                                         ▼
              ┌───────────────────────────────────────────┐
              │ src/ui/common/base/*  (shadcn + cva)        │
              │ Button / Input / Checkbox / Label / ...     │
              │ cva variants ↔ KRDS 컴포넌트 타입            │
              └───────────────────────────────────────────┘
                                         ▼
              기존 소비처: ui/common/layout/*, ui/biz/*
```

### 2.2 Data Flow (토큰 해석 흐름)

```
KRDS 공식 토큰 / Figma MCP variable defs
   │  (Do 단계에서 값 확정)
   ▼
tokens.css  Primitive 변수 정의 (원시 값)
   ▼
tokens.css  Semantic 변수 = var(Primitive 참조)
   ▼
globals.css :root  shadcn 호환명 = var(Semantic 참조)
   ▼
tailwind.config.ts  theme.extend = var(...) 참조
   ▼
컴포넌트  Tailwind 유틸 클래스 / cva → 최종 렌더 색상·수치
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `globals.css` | `tokens.css` | `@import`로 KRDS 토큰 로드 후 shadcn 호환명 브리지 |
| `tailwind.config.ts` | `globals.css`/`tokens.css` CSS 변수 | `theme.extend`에서 `var(--*)` 참조 |
| `ui/common/base/*` | `tailwind.config.ts`, `cva`, `utils/cn` | Tailwind 유틸 + cva 변형으로 스타일 |
| Pretendard GOV | `pretendard-gov` npm 패키지 | 폰트 파일 + CSS `@import` |
| 디자인 참조 | Figma Dev Mode MCP | 토큰 값·컴포넌트 스펙 확정 |

---

## 3. Data Model

> **N/A** — 본 기능은 디자인 토큰/스타일 체계 구축이며 런타임 데이터 모델이 없다.
> 대신 **토큰 모델(Token Model)** 을 §3.1에 정의한다.

### 3.1 Token Model

#### Primitive 토큰 (`--krds-{category}-{scale}`)

| Category | 변수 패턴 | 예시 | 비고 |
|----------|-----------|------|------|
| Color | `--krds-color-{hue}-{step}` | `--krds-color-primary-50` … `-900` | KRDS 색상 스케일. step은 50/100…900 |
| Color (gray) | `--krds-color-gray-{step}` | `--krds-color-gray-0` ~ `-900` | 중립 스케일 |
| Spacing | `--krds-space-{n}` | `--krds-space-1`(4px) … `--krds-space-12` | 4px 그리드 기준 |
| Radius | `--krds-radius-{size}` | `--krds-radius-sm/md/lg/full` | |
| Font size | `--krds-font-size-{token}` | `--krds-font-size-body/title/display` | KRDS 타이포 스케일 |
| Font weight | `--krds-font-weight-{token}` | `regular/medium/bold` | |
| Line height | `--krds-line-height-{token}` | `tight/normal/loose` | |
| Shadow | `--krds-shadow-{level}` | `--krds-shadow-1` ~ `-3` | |

#### Semantic 토큰 (`--krds-{role}-{variant}`)

| Role | 변수 예시 | 참조하는 Primitive |
|------|-----------|--------------------|
| Background | `--krds-bg-default`, `--krds-bg-subtle`, `--krds-bg-primary`, `--krds-bg-inverse` | `--krds-color-gray-*`, `--krds-color-primary-*` |
| Text | `--krds-text-default`, `--krds-text-muted`, `--krds-text-on-primary`, `--krds-text-disabled` | `--krds-color-gray-*` |
| Border | `--krds-border-default`, `--krds-border-strong`, `--krds-border-focus` | `--krds-color-gray-*`, `--krds-color-primary-*` |
| Action | `--krds-action-primary`, `--krds-action-primary-hover`, `--krds-action-danger` | `--krds-color-primary-*`, `--krds-color-danger-*` |
| Feedback | `--krds-feedback-success/warning/danger/info` | 해당 hue 스케일 |
| Focus | `--krds-focus-ring` | `--krds-color-primary-*` (접근성 포커스 표시) |

> **값 확정 출처**: Primitive 값은 Do 단계에서 ① KRDS 공식 디자인 토큰 페이지(style_07), ② Figma Dev Mode MCP `get_variable_defs` 두 경로를 병행해 확정한다. 불명확한 값은 가장 가까운 KRDS 스케일로 매핑하고 주석으로 표시한다.

### 3.2 Token Layer Relationship

```
[Primitive]  --krds-color-primary-600: #0b50d0;   (원시 값 — 유일한 하드코딩 지점)
     │
     ▼
[Semantic]   --krds-action-primary: var(--krds-color-primary-600);
     │
     ▼
[shadcn 브리지]  --primary: var(--krds-action-primary);
     │
     ▼
[Tailwind]   colors.primary.DEFAULT: 'var(--primary)'
     │
     ▼
[Component]  <Button className="bg-primary text-primary-foreground">
```

### 3.3 Color Format 결정

현재 `tailwind.config.ts`는 `hsl(var(--border))` 형식(HSL 채널값 + 래퍼)을 사용한다. KRDS 토큰은 hex/스케일 기반이라 HSL 채널 분해가 번거롭다.

**결정**: `tokens.css`·`globals.css`의 색상 변수는 **완성된 색상 값(hex)** 으로 저장하고, `tailwind.config.ts`의 색상 참조를 `hsl(var(--x))` → `var(--x)` 로 변경한다. (최신 shadcn도 동일 패턴.) `src/ui/common/base/`가 비어 있어 영향 소비처가 없고, layout/page는 토큰명만 유지되면 무영향이므로 안전한 일회성 변경이다.

---

## 4. API Specification

> **N/A** — 백엔드 통신 없음.

---

## 5. UI/UX Design

### 5.1 영향 범위 (시각)

본 기능은 화면을 신규 추가하지 않는다. 토큰 적용 결과는 **기존 화면 + 신규 base 컴포넌트**에 반영된다.

```
┌────────────────────────────────────┐
│  Header   (기존 — 토큰 재매핑 영향)  │
├────────────────────────────────────┤
│                                    │
│  Page Content                      │
│   └ <Button>, <Input> 등 신규 base  │
│                                    │
├────────────────────────────────────┤
│  BottomNav (기존 — 토큰 재매핑 영향) │
└────────────────────────────────────┘
```

### 5.2 폰트 적용 흐름

```
pretendard-gov 패키지 설치
  → tokens.css 또는 globals.css 에서 폰트 CSS @import
  → tailwind.config.ts fontFamily.sans = ['Pretendard GOV', ...fallback]
  → globals.css body font-family 를 var/유틸로 정리
  → 앱 전역 Pretendard GOV 렌더
```

### 5.3 Component List (신규 — shadcn base 초기 세트)

| Component | Location | Responsibility | cva 변형 |
|-----------|----------|----------------|----------|
| `Button` | `src/ui/common/base/Button.tsx` | 액션 버튼 (Figma m_button 1:1) | `variant`: primary / secondary / inner · `size`: default / sm / lg / icon · primary 텍스트는 `text-white` 명시(shadcn `--primary-foreground` 체인 회피 — 5/22, 5/28 동일 회귀 2회) |
| `InputBox` | `src/ui/common/base/InputBox.tsx` | 텍스트 입력창 (Figma m_text input_box) | `error` · `onClear`(clearable) · 상태: default/focus/filled/error/disabled |
| `Checkbox` | `src/ui/common/base/Checkbox.tsx` | 선택 칩 (Figma m_checkbox) | `label` · 상태: checked / disabled |
| `Label` | `src/ui/common/base/Label.tsx` | 폼 라벨 | `required` 표시 변형 |
| `Badge` | `src/ui/common/base/Badge.tsx` | 상태 표시 | `variant`: info / success / warning / danger / neutral |
| `InputLabel` | `src/ui/common/base/InputLabel.tsx` | Input 위 17px Bold 라벨 (Figma m_input_label 9300-27867) | `required` 디폴트 true · 좌측 빨강 `*` |
| `InputMessage` | `src/ui/common/base/InputMessage.tsx` | 폼 필드 하단 메시지 (Figma m_input_message 9300-27870) | `type`: info(파랑·Info 아이콘) / error(빨강·Cancel 아이콘) |
| `PageTitle` | `src/ui/common/base/PageTitle.tsx` | 페이지/최상위 영역 타이틀 (Figma m_page title_24 9300-27179) | 24px Bold · `as` 헤딩 레벨 변경 |
| `SectionTitle` | `src/ui/common/base/SectionTitle.tsx` | 하위 영역/아코디언/테이블 타이틀 (Figma m_section title 9140:3760 — 구 9300-27190의 'info 시 #ECF1FA 강조' 규칙은 폐기) | `bgColor`: white / blue · `topDivider` · `info` 우측 슬롯(배경 무관) |
| `SectionDivider` | `src/ui/common/base/SectionDivider.tsx` | 영역 구분선 (Figma m_section divider 9300-27188) | 1px · color = `krds-border-divider` (#d1d7e0) |
| `SelectionFieldBox` | `src/ui/common/base/SelectionFieldBox.tsx` | 선택 트리거 박스(아톰) — 클릭 시 외부 시트/모달이 열려 값 수신 (Figma m_selection field_box 9300-29018) | `value` · `placeholder` · `error` · `readOnly` · `disabled` · `onClear`(value 있고 활성 시 X 노출) · 우측 `>` 항상 표시 · 7 state(default/focus/filled/error/error_focus/read-only/disabled) props 조합 + `:focus-visible` 로 자동 도출 |
| `Tag` | `src/ui/common/base/Tag.tsx` | 칩형 태그 (Figma m_tag 9300-27119) | bg-white + 1px field 보더 + rounded-full · 15px Regular ink · `closable` 또는 `onClose` 제공 시 우측 X(Cancel) 노출 · onClose 없이 closable 만 true 면 X 표시되나 클릭 비활성 |
| `NavigationItem` | `src/ui/common/base/NavigationItem.tsx` | 리스트 행 (Figma m_navigation item 9300-28612) | 좌측 19px Medium + 우측 `>` 화살표 · min-h 56 · `:active` / `:focus-visible` 시 bg-primary-faint (pressed state) · `borderTop` · `borderBottom` 옵션 |
| `Tab` | `src/ui/common/base/Tab.tsx` | 단일 탭 atom (Figma tab_atomic 9300-28533/28537 · tab_btntype atomic 10005-5894) | `variant`: line(기본, h-48 · 19px Bold + 3px 하단 border · `selected` false → border-field 회색, true → action-primary D2B blue) / button(라운드 8px 칩 · 17px · 보더 #0f316e border-tertiary · selected=채움 #0f316e + Bold 흰색, 비선택=흰 배경 + Medium #0f316e) |
| `Accordion` | `src/ui/common/base/Accordion.tsx` | 섹션 아코디언 (Figma m_accordian 9300-28556) — raw/accordion 래핑. `Accordion`(Root 재노출) + `AccordionSection`(`value`·`title`·`titleInfo`·`variant` blue/white·`borderTop`·`flush`) · 타이틀바 56h · blue(bg-primary-faint)/white · 19px Bold · chevron 20px(`[&>svg]:size-5`) 회전 · content white p-16 |
| `Empty` | `src/ui/common/feedback/Empty.tsx` | 빈 상태(no data) 콘텐츠 (Figma m_empty data 9300-28084) — 카드 / div / BottomSheet 내부 콘텐츠로 들어감, 너비는 부모 폭 따름(w-full + center) | 36 아이콘 + gap 8 + 17 Medium 메시지 + (옵션 4 gap) 15 muted 보조 설명 + (옵션 16 gap) 액션 영역 · `variant`: info(default — Info 아이콘, feedback-info 색) / check(CheckCircle, success-60) / error(Error, action-danger) / none · `icon`(IconName 또는 ReactNode) · `iconColor` · `iconSize`(기본 36) · `title`(또는 children) · `description` · `action` |
| `Skeleton` | `src/ui/common/feedback/Skeleton.tsx` | 범용 로딩 스켈레톤(shimmer) | `variant`: rect(기본) / text(count 줄, 마지막 60%) / circle · `width` · `height` · `count` · `animate-pulse bg-muted` |
| `PageLoading` | `src/ui/common/feedback/PageLoading.tsx` | Suspense fallback 전체 로딩 화면 (Spinner 래핑) | size 32 Spinner 중앙 정렬 |
| `FloatingActionButton` | `src/ui/common/composites/FloatingActionButton.tsx` | 플로팅 액션 버튼 — Figma m_button_plus(9300-26913) + m_button_top(9300-26911) 통합 | `onPlus` · `onTop` 핸들러 prop 으로 1개/2개 노출 자동 분기(둘 다 없으면 null) · 두 개일 때 세로 스택(top 위 / plus 아래) · 48 원형 · 30px Material 아이콘(Add/Upgrade) · drop-shadow · 위치(fixed 등)는 사용처 책임 |
| `ButtonGroup` | `src/ui/common/composites/ButtonGroup.tsx` | 버튼 그룹 배치 (Figma button group layout 9300-27107) | `items[]` · `layout`: single(풀폭 1버튼) / asymmetric(첫 100px + 마지막 flex-1, 기본) / split(균등) / vertical(세로 스택) · gap 8 |
| `TagList` | `src/ui/common/composites/TagList.tsx` | 태그 wrap 리스트 (Figma m_tag_list 9300-27122) | `items[]` · `onRemove(id)` 전달 시 자동 closable + X wire-up · flex-wrap + gap 8 |
| `NavigationItemList` | `src/ui/common/composites/NavigationItemList.tsx` | 네비게이션 행 세로 리스트 (Figma m_navigation item_list 9300-28625) | `items[]` (각 item 에 onClick) · divider 자동(첫 항목 상단 + 모든 항목 하단) |
| `TabList` | `src/ui/common/composites/TabList.tsx` | 가로 탭 리스트 (Figma m_tab 9300-28541 · tab_btntype 10005-5888) | `items[{value,label}]` · `value` · `onChange` · 가로 스크롤(overflow-x-auto, gap 8) · 활성 탭 자동 scrollIntoView · `scrollButtons`: auto(기본, ResizeObserver+scroll 감지) / always / none · 화살표 옆 그라데이션 fade · `variant`: line(기본) / button(라운드 칩 탭, 컨테이너 p-16 + 하단 1px divider) · `label`(button 용 선행 레이블 17px Bold #0f316e, 생략 가능) |
| `StepBar` | `src/ui/common/composites/StepBar.tsx` | 진행 단계 표시 (Figma Step bar 9300-28323) — **atomic 별도 파일 분리 없이 한 composite 안에 모두 정의** (사용자 명시) | `items[{label,state,depth?}]` · `orientation`: vertical(기본) / horizontal · state: done/doing/todo/done-red · depth: 1(chip-pill) / 2(connector line + dot) · vertical 에서 연속 2depth 사이 connector 자동 · 색은 `krds-step-blue`(#3271e3, D2B blue 와 다른 별도 톤) + `krds-action-danger` |
| `Notice` | `src/ui/common/composites/Notice.tsx` | 안내/공지 박스 (Figma m_noticebox 9300-29118 + m_notice_urgent 9300-29103) | `type`: default(bg-primary-faint + 40 아이콘 버튼 + 17 Medium) / urgent(bg-danger-subtle + Badge solid red + 17 Bold) · `icon` · `onIconClick` · `badgeLabel`(urgent) · Badge 컴포넌트 재사용 |
| `Table` | `src/ui/common/composites/Table.tsx` | 라벨/데이터 행 테이블 (Figma m_table 9300-28667) — **atomic 별도 파일 분리 없이 한 composite 안에 통합** (사용자 명시) | `rows[{label,value,type?}]` · type: default(좌) / number(우측 정렬, tabular-nums) / combination(value 자유 ReactNode) · 행 사이 1px `krds-border-divider` 자동 |
| `Card` | `src/ui/common/composites/Card.tsx` | 슬롯 카드 (Figma m_card 9300-28728) — **이미 만든 다른 base/composites(Badge, Icon, ButtonGroup …)를 재사용** (사용자 명시) | 슬롯 props: `badges` · `subtitle` · `title` · `rows[]` · `trailing` · `footer` · `onClick` · 채우는 슬롯에 따라 type1~4 표현, onClick 주어지면 button role + focus ring |
| `MenuAccordion` | `src/ui/common/composites/MenuAccordion.tsx` | 메뉴 아코디언 (Figma menu accordian 9300-29486) | `items[{id,label,children?,onClick?}]` 트리 데이터 받아 1/2/3 depth 자동 재귀 렌더 · 1depth(45·border·19 Bold) / 2depth(34·17·자식 있을 때 chevron) / 3depth(31·15 muted·· 불릿) · uncontrolled(`defaultOpenIds`) / controlled(`openIds`+`onOpenChange`) · chevron 은 ExpandMore + 열림 시 rotate-180 |
| `List` | `src/ui/common/composites/List.tsx` | 행 리스트 (Figma list 9300-29812) | `items[]` 행마다 `layout`: text(아이콘+제목+우측 Switch+설명) / keyvalue(아이콘+제목+메타[]+풀폭 버튼) · position(top/middle/bottom)은 인덱스로 자동 처리(divider) · Switch/Button/Icon 재사용 · 한 리스트에 두 layout 혼합 가능 |
| `SummaryInfo` | `src/ui/common/composites/SummaryInfo.tsx` | 요약 정보 박스 (Figma m_summary info 9300-29058) — **기존 base(Badge, Icon, Button) 조합** (사용자 명시) | 슬롯 props: `badges`(가로 스크롤 + overflow 시 우측 화살표 자동) · `subtitle` · `title` · `actions`(우측 아이콘 버튼들) · `rows[{label,value}]` · badge swipe 는 ResizeObserver+scroll 자동 감지 |
| `Toast` | `src/ui/common/composites/Toast.tsx` | 토스트 팝업 (Figma m_toast_popup 9300-28497) | 위치: `fixed bottom-4 inset-x-4` (페이지 하단 16px 위 + 좌우 여백 16px, 해상도 유동), z-100 · bg `rgba(15,49,110,0.9)` + rounded-8 + 15 Bold white · `open` + `onClose` + `duration`(기본 2000ms, 0/undefined 면 자동 닫힘 없음) · opacity transition 200ms · `role="status"` `aria-live="polite"` |
| `AlertModal` | `src/ui/common/composites/AlertModal.tsx` | 가운데 정렬 알림 모달 (Figma m_modal 9300-28651) — Radix Dialog 직접 사용 | dim(`bg-black/50`) + 328 카드 + (옵션 36 아이콘 variant: `check`(success-60) / `error`(action-danger) / `info`(d2b-blue-border) / `none`) + 17 Bold 메인 + 17 Regular 보조 + ButtonGroup(`primaryAction` 필수 → single, `secondaryAction` 주입 시 split [secondary, primary]) · `dismissable` 기본 false(명시적 액션 필요) · 모바일 안전: `w-[328px] max-w-[calc(100vw-32px)] max-h-[calc(100dvh-32px)]` · 애니메이션 fade-in + zoom-in-95 duration-200 · `DialogPrimitive.Title` 항상 렌더(title 없으면 sr-only) |
| `FullPopup` | `src/ui/common/composites/FullPopup.tsx` | 화면 전체를 덮는 풀스크린 팝업 (Figma m_popup_header 9300-28484) — Radix Dialog 직접 사용 | 헤더(h-72 + `bg-krds-bg-primary-faint` + 하단 border-divider + 19 Bold ink title `min-w-0 flex-1 truncate` + 우측 utility 1~2개[70w × 66h: 24 아이콘 + 15 Bold]) + `flex-1 overflow-y-auto` body + 옵션 footer · `rightActions` 미주입 시 자동 닫기 1개(Close, label='닫기', onClick=onOpenChange(false)) · 슬라이드-업 애니메이션 `slide-in-from-bottom duration-300 ease-out` · safe-area: 헤더 `pt-[max(16px,env(safe-area-inset-top))]` + footer `pb-[max(16px,env(safe-area-inset-bottom))]` |
| `BottomSheet` | `src/ui/common/composites/BottomSheet.tsx` | 하단 슬라이드 시트 (Figma m_bottom sheet 9300-28974) — Radix Dialog 직접 사용 | bg-white + `rounded-t-[16px]` + `pt-[20px] px-[16px]` + 영역 gap-16 · 타이틀 19 Bold ink + close X(24, 살짝 pt-[3px]) · `flex-1 overflow-y-auto` body(17 Regular ink) · footer 우선순위: `footer` 명시 > `onConfirm` 자동 풀폭 primary 버튼(라벨 기본 "확인", 클릭 시 onConfirm 호출 + 자동 닫힘) > 없음 · 4 닫힘 경로: dim 클릭 / X / Esc / 확인 · `dismissable` 기본 true · `maxHeightVh` 기본 90 · safe-area-bottom 자동 보호(inline style — Tailwind arbitrary 가 env() 콤마 못 다룸) · 컴포넌트는 console.log 안 함(사용처 책임) |

> Plan §2.1 "초기 세트만, 이후 동일 패턴 반복"에 따라 시작했고, 필요 시 Figma m_* 디자인이 추가될 때마다 base/composites 컴포넌트를 1:1 로 보강한다. KRDS 43종 전체 도입은 여전히 Out of Scope.

### 5.4 Page UI Checklist

> 신규 페이지 없음. 대신 **base 컴포넌트별 필수 요소 체크리스트**로 대체 — Gap Detector가 각 항목을 검증.

#### Button (`base/Button.tsx`)

- [ ] shadcn 정본 기반 (`npx shadcn add button`) — 손으로 재작성 금지
- [ ] cva variant: `primary`, `secondary`, `inner` — Figma m_button `style` 과 1:1
- [ ] cva size: `default`(h-48), `sm`, `lg`, `icon`(48×48 정사각)
- [ ] 아이콘은 children 으로 전달, 위치는 자식 순서로 결정 (`<Icon/>텍스트` / `텍스트<Icon/>`)
- [ ] 아이콘 전용 버튼은 `size="icon"` + `aria-label`
- [ ] 색상/간격은 KRDS 토큰 유틸 클래스 참조 (하드코딩 금지)
- [ ] 상태: `pressed`=`active:`, `disabled`=`disabled:` (Figma 정의대로 hover 없음)
- [ ] 포커스 표시: `focus-visible` 링이 `--krds-focus-ring` 사용
- [ ] `forwardRef` + `asChild`(Slot) 지원

> **Figma 참조**: file `r4EjbQsz172SB5tQdX2bqV` — node 9052-147(Button) · 9052-233(m_button) · 9052-339(m_button_icon). `버튼 그룹`은 별도 컴포넌트로 분리(본 기능 범위 외).
> **색상 확정 (Do 단계)**: 별도 Figma 색상 팔레트 프레임이 없어, Button/Checkbox/Input 디자인에서 추출한 D2B 실측값을 `tokens.css` 의 `--krds-d2b-*` Primitive 로 확정하고 Semantic 토큰을 재매핑함. radius 8px 는 `--krds-radius-d2b` / `rounded-krds-8` 로 추가.

#### InputBox (`base/InputBox.tsx`)

- [ ] shadcn 정본 (`npx shadcn add input`) `<input>` 을 컨테이너로 감싼 컴포지트
- [ ] 상태: default / focus(`:focus-within` → 보더 2px) / filled / error / error+focus / disabled
- [ ] `error` prop → `--krds-border-danger` + `--krds-bg-danger-subtle`
- [ ] `disabled` → `--krds-border-disabled` + `--krds-bg-disabled-soft`
- [ ] placeholder 색상이 `--krds-text-disabled`, 입력 텍스트가 `--krds-text-ink` 참조
- [ ] `onClear` 지정 시 focus 상태에서 X(clear) 버튼 노출
- [ ] Figma node 9052-866 / 9052-869 (m_text input_box)

#### Checkbox (`base/Checkbox.tsx`)

- [ ] shadcn 정본 (`npx shadcn add checkbox`, Radix) 기반 — 라벨 포함 선택 칩 형태
- [ ] 선택(checked) → 연한 파랑 배경 + 보더 2px + Bold 텍스트
- [ ] 비활성(disabled) → `--krds-border-disabled` + `--krds-bg-disabled-soft`
- [ ] 포커스 표시 (`focus-visible` 링, `--krds-focus-ring`)
- [ ] 키보드 토글(Space) 동작 (Radix 내장)
- [ ] `label` prop 으로 칩 라벨 전달 · Figma node 9052-1191 / 9052-1192 (m_checkbox)

#### Label (`base/Label.tsx`)

- [ ] `htmlFor` 연결 지원
- [ ] `required` 시 KRDS 필수 표시(별표/색상)
- [ ] 텍스트 색상이 `--krds-text-default` 참조

#### Badge (`base/Badge.tsx`)

- [ ] cva variant: `info`, `success`, `warning`, `danger`, `neutral` 5종
- [ ] 각 variant가 `--krds-feedback-*` Semantic 토큰 참조
- [ ] 명도 대비 확보 (텍스트 vs 배경)

---

## 6. Error Handling

> 런타임 에러 코드는 없음. **구성/빌드 단계 실패 처리**를 정의한다.

| 상황 | 원인 | 처리 |
|------|------|------|
| `pretendard-gov` 미설치 | `npm install` 누락 | Do 단계 착수 전 설치 안내. import 실패 시 fallback 폰트(`-apple-system`, `Malgun Gothic`)로 graceful degrade |
| KRDS 토큰 값 미확정 | 공식 페이지/Figma에서 값 확보 불가 | 가장 가까운 KRDS 스케일로 잠정 매핑 + `/* TODO: KRDS 확정 */` 주석 |
| 기존 클래스 깨짐 | shadcn 토큰명 변경 시 | §6 Impact: 토큰명 유지 원칙 → 깨지면 layout/page 클래스 일괄 교체 |
| Tailwind 빌드 실패 | `var()` 참조 오타/누락 변수 | `npm run build`(사용자 검증)로 확인, 누락 변수 보강 |
| Figma MCP 디자인 미선택 | Figma 데스크톱 선택 없음 | 사용자에게 대상 프레임 선택 요청 후 `get_variable_defs` 재시도 |

---

## 7. Security Considerations

본 기능은 사용자 입력/인증/네트워크를 다루지 않아 일반적 보안 항목 대부분 N/A. 관련 항목만:

- [x] 외부 CSS 킷(`krds-uiux`) 미도입 — 서드파티 SCSS 주입 표면 없음
- [x] 폰트 패키지(`pretendard-gov`) 라이선스 확인 — OFL (Plan §5)
- [ ] `pretendard-gov` npm 패키지 무결성 — 설치 시 공식 패키지명 확인
- [ ] CSS 변수에 민감정보 미포함 (해당 없음 — 색상/수치만)

---

## 8. Test Plan

> 디자인 토큰/스타일 기능은 표준 L1/L2/L3(API/E2E)보다 **시각·구조 검증** 중심. 아래로 재정의.

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L1: 빌드/구조 검증 | 토큰 변수 존재, config 참조, 빌드 통과 | `npm run build`, grep | Do |
| L2: 컴포넌트 렌더 검증 | base 컴포넌트 cva 변형 렌더 | 수동 / Vite dev 서버 | Do |
| L3: 시각 회귀 검증 | 기존 화면 KRDS 토큰 적용 후 정상 렌더 | 수동 (브라우저) | Check |

### 8.2 L1: 빌드/구조 테스트 시나리오

| # | 항목 | 검증 내용 | 기대 결과 |
|---|------|-----------|-----------|
| 1 | `tokens.css` 존재 | Primitive + Semantic 변수 정의됨 | 파일 존재, `--krds-` 변수 N개 이상 |
| 2 | `globals.css` import | `@import './tokens.css'` 존재 | shadcn 브리지 변수가 `var(--krds-*)` 참조 |
| 3 | `tailwind.config.ts` | colors/spacing/radius/fontSize가 `var(--*)` 참조 | 하드코딩 색상값 0 |
| 4 | `fontFamily` 설정 | `Pretendard GOV` 가 sans 최상단 | config에 존재 |
| 5 | 하드코딩 스캔 | base 컴포넌트에 hex/임의 px 없음 | `#`/`px` 리터럴 0 (토큰 유틸만) |
| 6 | 빌드 | `npm run build` | 성공 (사용자 검증) |

### 8.3 L2: 컴포넌트 렌더 테스트 시나리오

| # | 컴포넌트 | 액션 | 기대 결과 |
|---|----------|------|-----------|
| 1 | Button | variant 5종 렌더 | 각기 다른 KRDS 색상 적용, 포커스 링 표시 |
| 2 | Input | `error` state | 위험색 보더 + 포커스 링 |
| 3 | Checkbox | 체크/언체크/indeterminate | 3상태 시각 구분 |
| 4 | Badge | variant 5종 | feedback 토큰 색상 + 명도 대비 |
| 5 | 전 컴포넌트 | 키보드 포커스 | `focus-visible` 링 노출 |

### 8.4 L3: 시각 회귀 시나리오

| # | 시나리오 | 단계 | 성공 기준 |
|---|----------|------|-----------|
| 1 | 기존 화면 정합성 | Home/Header/BottomNav 렌더 | 토큰 재매핑 후 레이아웃·색상 깨짐 없음 |
| 2 | 폰트 적용 | 앱 전역 텍스트 | Pretendard GOV로 렌더 |
| 3 | 접근성 포커스 | Tab 키 순회 | 모든 인터랙티브 요소에 포커스 표시 |

### 8.5 Seed Data Requirements

> **N/A** — 데이터 불필요.

---

## 9. Clean Architecture

### 9.1 Layer Structure

본 기능은 `docs/frontend-architecture.md`의 **보조 레이어(`styles/`)** 와 **UI 레이어(`ui/common/base/`)** 에 한정된다.

| Layer | Responsibility | Location |
|-------|---------------|----------|
| 보조 (Styles) | 전역 토큰·스타일 정의 | `src/styles/` |
| UI (Base) | 원자 컴포넌트 | `src/ui/common/base/` |
| Config | Tailwind 토큰 매핑 | `tailwind.config.ts` |

### 9.2 Dependency Rules

```
tailwind.config.ts ──참조──▶ globals.css / tokens.css (CSS 변수)
ui/common/base/*   ──사용──▶ Tailwind 유틸, cva, utils/cn
globals.css        ──@import▶ tokens.css
tokens.css         ──(의존 없음, 원시 값)

규칙: tokens.css 는 어떤 것도 import 하지 않는 최하위 소스.
      base 컴포넌트는 토큰을 직접 참조하지 않고 Tailwind 유틸/cva 경유.
```

### 9.3 File Import Rules

| From | Can Import | Cannot Import |
|------|-----------|---------------|
| `tokens.css` | (없음) | 모든 것 |
| `globals.css` | `tokens.css`, `tailwind.css` | 컴포넌트 |
| `ui/common/base/*` | `utils/cn`, `class-variance-authority` | `services/`, `queries/`, 도메인 컴포넌트 |
| `tailwind.config.ts` | `tailwindcss-animate` | 컴포넌트 |

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `tokens.css` | 보조 (Styles) | `src/styles/tokens.css` |
| `globals.css` (수정) | 보조 (Styles) | `src/styles/globals.css` |
| `tailwind.config.ts` (수정) | Config | `tailwind.config.ts` |
| `Button`/`Input`/`Checkbox`/`Label`/`Badge` | UI (Base) | `src/ui/common/base/*` |

---

## 10. Coding Convention Reference

> Reference: `docs/frontend-architecture.md` §12 네이밍, §14 컴포넌트 위치

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| base 컴포넌트 파일 | PascalCase.tsx | `Button.tsx`, `Checkbox.tsx` |
| Primitive 토큰 | `--krds-{category}-{scale}` | `--krds-color-primary-600`, `--krds-space-4` |
| Semantic 토큰 | `--krds-{role}-{variant}` | `--krds-action-primary`, `--krds-text-muted` |
| shadcn 브리지 토큰 | 기존 shadcn 명 유지 | `--primary`, `--border`, `--muted` |
| cva 변형 키 | camelCase, KRDS 컴포넌트 타입과 일치 | `variant: 'primary'`, `size: 'md'` |

### 10.2 Import Order

`docs/frontend-architecture.md` 컨벤션 준수. base 컴포넌트 예:

```typescript
import * as React from 'react'                        // 1. 외부
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'                        // 2. 내부 절대경로
import type { ButtonHTMLAttributes } from 'react'      // 4. 타입
```

### 10.3 Environment Variables

> **N/A** — 환경 변수 불필요.

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|--------------------|
| 컴포넌트 네이밍 | PascalCase 파일 + `forwardRef` |
| 스타일 위치 | `cva` + Tailwind 유틸만. 컴포넌트별 `.css` 금지 (Plan §8.2) |
| 토큰 참조 | 컴포넌트는 유틸 클래스로, config는 `var(--*)` 로만 |
| 하드코딩 | 색상/간격 리터럴 금지 — 원시 값은 `tokens.css` Primitive 한 곳만 |

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── styles/
│   ├── tokens.css        # [신설] KRDS Primitive + Semantic 토큰
│   ├── globals.css       # [수정] @import tokens.css + shadcn 브리지 + 폰트/리셋
│   └── tailwind.css      # [유지] @tailwind 지시문
└── ui/common/base/
    ├── Button.tsx        # [신설]
    ├── InputBox.tsx      # [신설]
    ├── Checkbox.tsx      # [신설]
    ├── Label.tsx         # [신설]
    └── Badge.tsx         # [신설]

tailwind.config.ts        # [수정] theme.extend KRDS 토큰 매핑 + fontFamily
package.json              # [수정] pretendard-gov 의존성 추가
docs/01-plan/.../krds-design-system - 토큰 사용 가이드 주석은 tokens.css 상단에
```

### 11.2 Implementation Order

1. [ ] **의존성 설치**: `npm install pretendard-gov`, shadcn 의존성(`@radix-ui/*` 등 컴포넌트별)
2. [ ] **Figma MCP 디자인 참조**: `get_variable_defs`로 토큰 값 확보 (KRDS 공식 페이지 병행)
3. [ ] **`tokens.css` 작성**: Primitive → Semantic 순서로 CSS 변수 정의
4. [ ] **`globals.css` 수정**: `@import './tokens.css'`, shadcn 브리지 토큰 재매핑, Pretendard GOV `@import`, `@layer base` 정리
5. [ ] **`tailwind.config.ts` 수정**: `hsl(var(--x))` → `var(--x)`, spacing/fontSize/boxShadow 확장, `fontFamily.sans` 추가
6. [ ] **base 컴포넌트 작성**: Button → Input → Checkbox → Label → Badge (cva 변형 포함)
7. [ ] **기존 화면 검증**: Home/Header/BottomNav 렌더 확인
8. [ ] **빌드 검증**: `npm run build` (사용자)

### 11.3 Session Guide

> Design 구조에서 자동 생성. `/pdca do krds-design-system --scope module-N` 으로 모듈 단위 구현 가능.

#### Module Map

| Module | Scope Key | Description | Estimated Turns |
|--------|-----------|-------------|:---------------:|
| 토큰 기반 세팅 | `module-1` | 의존성 설치 + Figma 토큰 참조 + `tokens.css` 작성 + `globals.css`/`tailwind.config.ts` 수정 + Pretendard GOV 적용 | 25-35 |
| base 컴포넌트 | `module-2` | shadcn base 5종 신설 + KRDS `cva` 스타일 적용 + 컴포넌트 렌더 검증 | 35-45 |

#### Recommended Session Plan

| Session | Phase | Scope | Turns |
|---------|-------|-------|:-----:|
| Session 1 | Design | 전체 | (완료) |
| Session 2 | Do | `--scope module-1` | 25-35 |
| Session 3 | Do | `--scope module-2` | 35-45 |
| Session 4 | Check + Report | 전체 | 25-35 |

> module-1은 module-2의 선행 조건(토큰이 있어야 컴포넌트가 토큰을 소비). 순차 진행 필수.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-21 | 초안 작성 — Option C (Pragmatic) 채택 | gongjiyeon |
