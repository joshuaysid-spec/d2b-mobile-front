---
template: plan
version: 1.3
feature: date-input
date: 2026-05-27
author: gongjiyeon
project: d2b-mobile-front
projectVersion: 0.1.0
---

# date-input Planning Document

> **Summary**: 단일 날짜 / 기간 선택 입력 기능. 페이지는 `<DateInput />` 또는 `<DateRangeInput />` 한 줄만 import 하면 되고, 클릭 시 바텀시트가 열려 내부에서 텍스트 입력 + 캘린더 선택을 모두 지원. 확인 버튼으로 값이 커밋된다.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: gongjiyeon
> **Date**: 2026-05-27
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | KRDS 디자인 시스템에 날짜/기간 입력 컴포넌트가 없어 폼에서 날짜를 받을 수 없음. Figma 디자인(node 9052-1392, 9052-1551)은 클릭 → 바텀시트 → 캘린더/숫자키패드 → 확인 순서의 한 흐름으로 정의돼 있다. |
| **Solution** | 시각 아톰(`DateInputBox`/`DateRangeInputBox`/`Calendar`)을 base 에 분리, 흐름·상태·바텀시트 통합은 composite(`DateInput`/`DateRangeInput`)에서 책임. 페이지는 단일 composite 하나만 import. |
| **Function/UX Effect** | 페이지 코드 단순화 (1 줄), Figma 와 시각 1:1, 트리거 박스/시트 내부 박스가 동일 아톰이므로 디자인 변경 시 한 곳만 수정. |
| **Core Value** | Figma 의 아토믹 분해 그대로 코드 레이어링. 페이지 입장에서 BottomSheet/Calendar/박스의 존재는 숨김. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | KRDS Figma 의 Date Input / Calendar 디자인을 코드로 구현. 페이지 폼에서 날짜·기간을 받을 수 있어야 한다. |
| **WHO** | D2B 모바일 폼 화면을 만드는 프론트 개발자 · 모바일 사용자(터치 입력 + 숫자 키패드). |
| **RISK** | 신규 BottomSheet 도입(처음 만드는 오버레이) · 캘린더 날짜 로직(공휴일/주말/오늘/범위) · 시트 내부 input focus 시 숫자 키패드 활성화(`inputMode="numeric"`) · 의존성(날짜 라이브러리) 결정. |
| **SUCCESS** | (1) `<DateInput />` / `<DateRangeInput />` 한 줄로 페이지에서 사용 가능 (2) 클릭 → 바텀시트 오픈 → 캘린더 선택 또는 텍스트 입력 → 확인 → 값 반영 (3) 5 state 시각 일치 (4) 키보드 접근성 (5) Figma MCP 1:1 매칭. |
| **SCOPE** | Phase 1: 아톰(Calendar/DateInputBox/DateRangeInputBox) → Phase 2: BottomSheet composite → Phase 3: DateInput / DateRangeInput composite + 프리셋 칩 |

---

## 1. Overview

### 1.1 Purpose

KRDS 가이드 기반 Figma 디자인의 날짜 입력 기능(단일/범위 + 캘린더 + 바텀시트)을 코드로 구현, 페이지 폼에서 일관되게 재사용할 수 있게 한다.

### 1.2 Background

- Figma 디자인(`Date Input` 9052-1551, `Calendar (date/range picker)` 9052-1392)이 페이지 트리거 박스와 시트 내부 입력 박스를 **같은 `m_date_input_box` 아톰**으로 정의하고 있다 (5 state: default/filled/focus/error/error_focus).
- 캘린더 셀(`m_date_picker_date_select_button`)은 11 state (default/saturday/holiday/selected/range start/range/range end/disabled/dot(schedule)/dot_selected/today).
- 바텀시트(`m_bottom sheet`)는 이번이 첫 도입. 다른 기능(필터·확인 다이얼로그 등)에서도 재활용 가능한 일반 컴포넌트로 만든다.
- 시트 내부 input 에 focus 시 모바일 숫자 키패드가 떠야 함(`inputMode="numeric"` + `pattern`).

### 1.3 Related Documents

- Figma 디자인:
  - Date Input: https://www.figma.com/design/r4EjbQsz172SB5tQdX2bqV/mobile?node-id=9052-1551
  - Calendar: https://www.figma.com/design/r4EjbQsz172SB5tQdX2bqV/mobile?node-id=9052-1392
- 아키텍처: `docs/frontend-architecture.md`
- 디자인 시스템 기반: `docs/02-design/features/krds-design-system.design.md`
- 컴포넌트 가이드 페이지(개발자 카탈로그): `src/ui/dev/ComponentGuidePage.tsx`

---

## 2. Scope

### 2.1 In Scope

**아톰 (base/)**
- [ ] `Calendar.tsx` — 월 네비게이션 + 7×6 그리드 + 셀(11 state) + 오늘 버튼. 단일/범위 모드를 prop 으로 전환.
- [ ] `DateInputBox.tsx` — Figma `m_date_input_box` 1:1 (5 state). `<input>` 또는 `<button>` 으로 동작 가능 (readOnly 트리거 vs editable).
- [ ] `DateRangeInputBox.tsx` — Figma `m_date_range_input_box` 1:1 (5 state). 시작 ~ 종료 두 입력칸.

**컴포지트 (composites/)**
- [ ] `BottomSheet.tsx` — Figma `m_bottom sheet` 1:1. title + close + contents slot + button group + 배경 dim. **다른 기능에서도 재활용 가능한 일반 컴포넌트로 설계**.
- [ ] `DateInput.tsx` — label + DateInputBox 트리거 + helper text + 클릭 시 BottomSheet { 시트 내부 DateInputBox(editable, inputMode=numeric) + Calendar + 확인 Button }.
- [ ] `DateRangeInput.tsx` — label + 프리셋 칩(1주일/1개월/3개월/기간검색) + DateRangeInputBox 트리거 + helper + 시트 { DateRangeInputBox + Calendar(range) + 확인 }.

**부속**
- [ ] 날짜 유틸 (포맷팅 `YYYY-MM-DD`, 월/년 이동, 범위 계산, 주말/오늘 판별). 라이브러리 vs 자체 작성은 §7.2 에서 결정.
- [ ] `ComponentGuidePage.tsx` 에 신규 컴포넌트 섹션 등록.
- [ ] `docs/02-design/features/` 동기화.

### 2.2 Out of Scope

- **공휴일 데이터**: 디자인에는 holiday state 가 있지만 공식 공휴일 API/데이터는 이번 사이클에서 다루지 않음. holiday 판정 함수는 인터페이스만 제공하고 빈 구현으로 시작.
- **일정 dot(schedule)**: 디자인의 `dot`/`dot_selected` state. Schedule Calendar (마이페이지) 용도라 별도 사이클.
- **다중 월 캘린더** (양옆 2개월 동시 표시).
- **시간 선택** (시:분).
- **타임존 처리** — 모두 로컬 타임존으로 가정.
- **숫자 키패드 자체 구현** — 모바일 OS 가상 키보드를 활용 (`inputMode="numeric"`).

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `<DateInput value onChange label helperText error />` API 로 페이지에서 단일 import 가능 | High | Pending |
| FR-02 | `<DateRangeInput value onChange ... />` — value 는 `{ start, end }` 형태 | High | Pending |
| FR-03 | 트리거 클릭 시 BottomSheet 오픈 (배경 dim, 외부 클릭으로 닫지 않음 — 확인/취소만) | High | Pending |
| FR-04 | 시트 내부 텍스트 입력 시 `inputMode="numeric"` 으로 모바일 숫자 키패드 활성화 | High | Pending |
| FR-05 | 시트 내부 입력값 `YYYY-MM-DD` 유효성 검증, 잘못된 형식이면 error state | High | Pending |
| FR-06 | 캘린더 셀 클릭 시 시트 내부 입력값에 즉시 반영 (단, 페이지 value 는 미반영) | High | Pending |
| FR-07 | 확인 버튼 클릭 시에만 `onChange` 호출 + 시트 닫힘 | High | Pending |
| FR-08 | 닫기(X) / 취소 / **시트 외부 클릭** 시 변경 폐기 후 닫힘 | High | Pending |
| FR-09 | 캘린더 11 state 시각 정확 매핑 (default/sat/holiday/selected/range start/range/range end/disabled/dot/dot_selected/today) | High | Pending |
| FR-09a | 공휴일은 `fetchHolidays?: (year, month) => Promise<string[]>` prop 으로 외부 주입. 미주입 시 holiday 표시 비활성 | High | Pending |
| FR-09b | BottomSheet 오픈 시 / 캘린더 월 이동 시 React Query 로 자동 fetch · refetch (queryKey: `['holidays', year, month]`) | High | Pending |
| FR-10 | DateInputBox 5 state 시각 정확 매핑 (default/filled/focus/error/error_focus) | High | Pending |
| FR-11 | DateRangeInputBox 5 state 시각 정확 매핑 | High | Pending |
| FR-12 | DateRangeInput 프리셋 칩 (1주일/1개월/3개월/기간검색) 클릭 시 시트 값 즉시 반영 | Medium | Pending |
| FR-13 | 캘린더 년/월 드롭다운으로 직접 선택 가능 | Medium | Pending |
| FR-14 | "오늘" 버튼 — 시트 내부 값을 오늘로 설정 | Medium | Pending |
| FR-15 | BottomSheet 가 `DateInput` 외 다른 컴포넌트에서도 재사용 가능한 일반 API | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 접근성 | role/aria 속성, 키보드 네비게이션 (캘린더 화살표 이동, Esc 닫기) | 스크린리더 더미 + 키보드만으로 조작 가능 확인 |
| 시각 정합성 | Figma 5 + 11 state 와 1:1 일치 | ComponentGuidePage 의 시안 시각 비교 |
| 일관성 | 모든 색/간격/타이포가 KRDS 토큰 변수 참조 | 하드코딩 색상 0 |
| 성능 | 시트 오픈/닫기 60fps 트랜지션 | Chrome devtools profiler 확인 |
| 모바일 UX | 시트 input focus 시 숫자 키패드 (iOS Safari · Android Chrome) | 실기 또는 devtools 모바일 에뮬레이션 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `src/ui/common/base/Calendar.tsx` · `DateInputBox.tsx` · `DateRangeInputBox.tsx` 추가, 모든 state 시각 정합
- [ ] `src/ui/common/composites/BottomSheet.tsx` · `DateInput.tsx` · `DateRangeInput.tsx` 추가
- [ ] `ComponentGuidePage` 에 6개 컴포넌트 섹션 추가 (NAV 갱신)
- [ ] `docs/02-design/features/date-input.design.md` 작성 — 컴포넌트 트리, prop 시그니처, state 다이어그램
- [ ] 페이지 한 줄(`<DateInput value={x} onChange={setX} />`)로 전체 플로우 동작
- [ ] `npm run lint` 0 errors, `npm run build` 성공

### 4.2 Quality Criteria

- [ ] 하드코딩 색상/날짜 형식 0
- [ ] cva variant/state 가 Figma 의 state 명과 1:1
- [ ] `<DateInput />` API 가 controlled / uncontrolled 모두 지원
- [ ] 시트 외부 클릭으로 닫히지 않음 (확인/취소 명시 필수 — Figma 요구사항)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 캘린더 날짜 로직 자체 작성 부담 | High | Medium | §7.2 에서 `date-fns` 도입 결정. 자체 작성 시 핵심 함수만 (월 채우기/포맷/유효성). |
| BottomSheet 가 첫 도입이라 패턴 부재 | Medium | High | Radix `Dialog` 프리미티브 활용해 접근성·focus trap 무료 획득 → bottom-positioned 스타일만 입힘. |
| 시트 내부 input ↔ 캘린더 양방향 동기화 (입력 → 캘린더 / 캘린더 → 입력) | Medium | Medium | 내부 임시 상태(`tempValue`)를 시트 안에서만 관리. 외부 `value`/`onChange` 는 확인 시에만 반영. |
| 숫자 키패드 모바일 동작 검증 어려움 | Medium | Medium | `inputMode="numeric"` 표준 활용. PC dev 환경에서 시뮬레이션 한계 명시. |
| 공휴일 데이터 부재 | Low | High | holiday 판정은 인터페이스(prop 으로 `isHoliday(date)` 받기)로 외부 위임. 자체 데이터 미포함. |
| BottomSheet 의 사용처가 늘어나면 책임 비대 | Low | Medium | 첫 도입 시 일반 API(`title`/`children`/`footer`/`onClose`)만 제공. 도메인 특화는 사용처 wrapper 에서. |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `src/ui/common/base/` | Component | 3개 신규 (Calendar / DateInputBox / DateRangeInputBox) |
| `src/ui/common/composites/` | Component | 3개 신규 (BottomSheet / DateInput / DateRangeInput) |
| `src/ui/dev/ComponentGuidePage.tsx` | Catalog | 6개 컴포넌트 섹션 추가 |
| `src/utils/` 또는 `src/lib/` | Util | 날짜 유틸 신규 (또는 `date-fns` import) |
| `package.json` | Config | `date-fns` 추가 가능성 (§7.2 결정) |
| `docs/02-design/features/` | Design | `date-input.design.md` 신규 |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| 기존 base 컴포넌트 (Button/InputBox 등) | READ | `DateInput` composite 내부에서 import | 무영향 (기존 API 그대로 소비) |
| 페이지 (현재 없음) | — | — | 신규 기능. 기존 페이지 영향 없음 |

### 6.3 Verification

- [ ] ComponentGuidePage 에서 6개 컴포넌트 모든 state 렌더링 확인
- [ ] 기존 컴포넌트 카탈로그 섹션은 변경 없이 동작
- [ ] Figma MCP 로 5+11 state 시각 대조

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Selected |
|-------|:--------:|
| Starter | ☐ |
| **Dynamic** | ☑ (기존 유지) |
| Enterprise | ☐ |

### 7.2 Key Architectural Decisions

| Decision | Options | Selected (제안) | Rationale |
|----------|---------|-----------------|-----------|
| 아키텍처 분리 | A. 단일 `DateInput`(mode prop) / **B. base 아톰 + composite 분리** | **B** | Figma 의 아토믹 분해와 1:1. base 는 시각만, composite 는 흐름 책임. |
| 단일/범위 컴포넌트 | 단일 `DateInput`(range prop) / **두 composite 분리** | **두 composite 분리** | Figma 가 `m_date_input` / `m_date_range_input` 두 컴포지트로 정의. 프리셋 칩이 range 에만 있어 API 가 갈라짐. 내부 base 는 공유. |
| BottomSheet 베이스 | 자체 구현 / **Radix Dialog primitive** | **Radix Dialog (`@radix-ui/react-dialog`)** | focus trap/Esc/접근성 무료. shadcn 패턴과 일관 (`raw/dialog.tsx` 추가). |
| BottomSheet 외부 클릭 | 무시(확인/취소만) / **닫힘** | **닫힘** | 사용자 결정. DateInput 시트는 외부 클릭 시 변경값 폐기 후 닫힘 (확인 안 누르면 저장 X). |
| 캘린더 라이브러리 | 자체 / date-fns / **dayjs** / react-day-picker | **dayjs** | 사용자 결정. ~7KB 코어, 체이닝 API 가독성 우수. 트리쉐이킹은 미지원이지만 절대 크기가 작아 무방. |
| 캘린더 셀 컴포넌트 분리 | 인라인 / **별도 export** | 인라인 (`Calendar` 내부) | 외부에서 단독으로 셀 쓸 일 없음. 11 state 는 cva 로 표현. |
| 페이지 value 동기화 시점 | 캘린더 변경 즉시 / **확인 클릭 시** | **확인 클릭 시** | Figma 가 "확인 눌러야 창이 닫힘" 명시. 시트 내부는 `tempValue` 로 격리. |
| value 형식 | `Date` 객체 / **`YYYY-MM-DD` 문자열** / number | **`YYYY-MM-DD` 문자열** | API 응답 형식과 일치, 시리얼라이즈 쉬움, 타임존 모호함 회피. |
| 공휴일 판정 | 내장 데이터 / isHoliday 함수 prop / **fetcher prop + React Query** | **`fetchHolidays?: (year, month) => Promise<string[]>` + React Query** | 사용자 결정. BottomSheet 오픈 / 월 이동 시 자동 호출, queryKey 로 자동 캐시. 미주입 시 비활성. 실제 API 엔드포인트는 추후 합의 (인터페이스만 미리 확정). |

### 7.3 Component Tree

```
페이지
└── <DateInput value onChange label helperText ... />          (composite)
    ├── Label                                                   (base, 기존)
    ├── DateInputBox  (readOnly, role=trigger)                  (base, 신규)
    ├── HelperText (or error message)
    └── BottomSheet (open ↔ trigger click)                      (composite, 신규)
        ├── title "일자 선택" + close icon
        ├── contents:
        │   ├── DateInputBox  (editable, inputMode=numeric)     (base, 신규 — 트리거와 동일 아톰)
        │   └── Calendar  (mode="single", value=tempValue)      (base, 신규)
        │       ├── Year/Month dropdown
        │       ├── 7×6 cell grid (11 state)
        │       └── Today button
        └── footer: Button "확인"                                 (base, 기존)
```

`DateRangeInput` 도 동일 구조 + 프리셋 칩 + `DateRangeInputBox` + `Calendar mode="range"`.

### 7.4 Naming (CLAUDE.md 명명 규칙 적용)

| Figma 명 | 파일명 | 위치 |
|---------|--------|------|
| `m_date_input_box` | `DateInputBox.tsx` | `base/` |
| `m_date_range_input_box` | `DateRangeInputBox.tsx` | `base/` |
| `m_date_range_picker_calendar` | `Calendar.tsx` | `base/` |
| `m_bottom sheet` | `BottomSheet.tsx` | `composites/` |
| `m_date_input` | `DateInput.tsx` | `composites/` |
| `m_date_range_input` | `DateRangeInput.tsx` | `composites/` |

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `docs/frontend-architecture.md` — base / composites 2층 구조 준수
- [x] CLAUDE.md "파일 명명 규칙" — PascalCase, Figma 1:1 매핑
- [x] CLAUDE.md "shadcn 절차" — raw 컴포넌트는 CLI 로 추가, base 는 cva 변형
- [x] `ComponentGuidePage` 동기화 (PostToolUse 훅이 상기)

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| 날짜 형식 표준 | 미정 | `YYYY-MM-DD` 문자열, 시: 미사용 | High |
| 캘린더 첫 요일 | 미정 | 일요일 시작 (Figma 와 동일) | High |
| BottomSheet API | 미정 | `<BottomSheet open onClose title footer>{children}</BottomSheet>` 기본형. focus trap·Esc·외부 클릭 정책 명시 | High |
| 날짜 유틸 위치 | 미정 | `src/utils/date.ts` 또는 `src/lib/date.ts` (기존 `cn.ts` 위치 따라) | Medium |

### 8.3 Environment / Prerequisites

| 항목 | 용도 | 비고 |
|------|------|------|
| `@radix-ui/react-dialog` | BottomSheet 베이스 | `npx shadcn add dialog` 로 자동 설치 |
| `dayjs` | 날짜 유틸 | `npm install dayjs` (~7KB 코어, 체이닝 API) |
| `@tanstack/react-query` | 공휴일 fetcher 캐시·refetch | 이미 설치됨 (CLAUDE.md 명시) |
| Figma MCP | 디자인 1:1 참조 | 이미 연결됨 |

---

## 9. Phase Breakdown (구현 순서)

> Phase 사이마다 사용자 검토·머지 단위로 분리 권장.

### Phase 1 — Base 아톰 (외부 의존성 없음)
1. `Calendar.tsx` — Figma `m_date_range_picker_calendar` + `m_date_picker_date_select_button` (11 state) + 년/월 드롭다운 + 오늘 버튼. `mode: 'single' | 'range'`, controlled value.
2. `DateInputBox.tsx` — 5 state. native `<input>` 베이스, `readOnly` 시 트리거처럼 보임.
3. `DateRangeInputBox.tsx` — 5 state. 두 입력 + `~` 구분자.
4. ComponentGuidePage 등록.

### Phase 2 — BottomSheet (composite, 일반 컴포넌트)
1. `npx shadcn add dialog` → `raw/dialog.tsx`
2. `BottomSheet.tsx` — bottom positioned + dim + title + close + footer slot. focus trap, Esc 닫기, 외부 클릭은 `dismissable` prop 으로 옵션화.
3. ComponentGuidePage 등록 (오픈/닫기 데모).

### Phase 3 — DateInput / DateRangeInput composite
1. `DateInput.tsx` — Phase 1 + 2 조립. 내부 `tempValue` 상태, 확인 시 `onChange`. label + helper + error.
2. `DateRangeInput.tsx` — 위 + 프리셋 칩 (1주일/1개월/3개월/기간검색).
3. ComponentGuidePage 등록 (controlled / uncontrolled / error 케이스).
4. `docs/02-design/features/date-input.design.md` 작성.

---

## 10. Next Steps

1. [ ] 이 Plan 검토·승인
2. [ ] 설계 문서 (`/pdca design date-input`) — Calendar prop 시그니처 · BottomSheet API · state 다이어그램 확정
3. [ ] Phase 1 구현 (Calendar/DateInputBox/DateRangeInputBox)
4. [ ] Phase 2 구현 (BottomSheet)
5. [ ] Phase 3 구현 (DateInput / DateRangeInput)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-27 | 초안 작성 — Figma 9052-1392 (Calendar) · 9052-1551 (Date Input) 기반 | gongjiyeon |
| 0.2 | 2026-05-27 | 결정 반영: 라이브러리 dayjs · BottomSheet 외부클릭 닫힘 · 공휴일 fetcher prop + React Query | gongjiyeon |
