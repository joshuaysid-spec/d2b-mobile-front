---
template: design
version: 1.3
feature: search-filter
date: 2026-06-01
author: joshuaysid-spec
project: d2b-mobile-front
projectVersion: 0.1.0
---

# search-filter Design Document

> **Summary**: config 구동 범용 검색필터 `SearchFilter` 를 `src/ui/biz/cm/search/` 에 구현한다. Figma MUI-OP-01-M02(node 9300-37302)에 맞춰 **아코디언 섹션** 레이아웃으로, 셸(`SearchFilter`)이 FullPopup·상태·아코디언 렌더를, 디스패처(`SearchFilterField`)가 `field.type`→`common/` 컴포넌트 매핑을 담당한다(C: Pragmatic). 도메인은 config 로만 주입되며, 첫 소비자는 조달계획(p.8 OpListPage)이고 목록 조회 API 는 주석 스텁이다.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: joshuaysid-spec
> **Date**: 2026-06-01
> **Status**: Draft
> **Planning Doc**: [search-filter.plan.md](../../01-plan/features/search-filter.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A (UI 컴포넌트 기능) |
| Phase 2 | Coding Conventions | `docs/frontend-architecture.md` §10·§12·§14 / `CLAUDE.md` |
| Phase 3 | Mockup | Figma MUI-OP-01-M02 (node `9300-37302`) · 아코디언 `9300-28556` (Dev Mode MCP) |
| Phase 4 | API Spec | N/A (백엔드 미연동 — 주석 스텁) |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 여러 도메인이 공통으로 쓸 풀페이지 검색필터가 없음. 도메인별 중복 제작 방지 필요 |
| **WHO** | D2B 모바일 프론트 개발자(검색 화면 제작자) · 조달/입찰/계약 등 검색 사용자 |
| **RISK** | config↔value 타입 안전성 약화(제네릭) · 발주예정월 YYYY-MM 월 단위인데 기존 DateInput 은 일 단위 · 공통팝업(발주기관/품목 검색) 미구현 · 백엔드 미연동 |
| **SUCCESS** | config 구동 SearchFilter 가 아코디언 섹션 + 필드 타입을 `common/` 으로 렌더 · 초기화/재진입 복원/검색 콜백 · 조달계획(p.8)에서 동작 · lint·build 통과 |
| **SCOPE** | Phase 1 config·value 타입 → Phase 2 Accordion base + SearchFilter 셸 + 필드 디스패처 → Phase 3 조달계획 config + OpListPage + API 주석 스텁 |

---

## 1. Overview

### 1.1 Design Goals

- **도메인 무관 셸**: `SearchFilter`/`SearchFilterField` 는 어떤 도메인 문자열·타입도 하드코딩하지 않고, `SearchFilterConfig` 로만 주입된다.
- **Figma M02 정합**: 헤더(초기화/닫기) + **아코디언 5섹션**(검색유형·업무구분·일자설정·검색어·구분설정) + 하단 플로팅(닫기/검색)을 1:1 반영.
- **`common/` 재사용 극대화**: 필드 타입별로 기존 `common/`(base·composites) 컴포넌트에 매핑. `raw/` 직접 사용 0.
- **확장 용이**: 새 도메인은 config 한 벌, 새 필드 타입은 union + 디스패처 case 한 개 추가.

### 1.2 Design Principles

- **단일 책임 분리**: 셸(FullPopup·상태·아코디언) ↔ 디스패처(타입→컴포넌트) ↔ 타입(계약).
- **선언형 config**: "무엇을 그릴지"는 데이터(config), "어떻게 그릴지"는 디스패처.
- **controlled + 작업 격리**: 외부 `value`(확정)와 내부 `draft`(작업 중) 분리 → 검색 클릭 시에만 `onSearch` 커밋.
- **Tailwind 단일 체계**: cva + KRDS 토큰 유틸. 컴포넌트별 `.css` 금지.

---

## 2. Architecture Options (v1.7.0)

### 2.0 Architecture Comparison

**Selected**: **Option C — Pragmatic** — 셸/디스패처 2파일 분리 + 신규 base `Accordion`. config 구동의 도메인·필드 무관성을 확보하면서 필드 타입별 파일 폭증(B)은 회피.

### 2.1 Component Diagram

```
ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx   (소비자 / 도메인, 설계서 p.8)
  PROCUREMENT_SEARCH: SearchFilterConfig  +  DEFAULT_VALUE
  [검색필터] 버튼 → open · 적용 필터 요약 · // TODO(API)
        │ (config / value / onSearch)
        ▼
ui/biz/cm/search/SearchFilter.tsx            (셸 — 도메인·필드 무관)
  FullPopup(title, [초기화]/[닫기], footer=ButtonGroup[닫기,검색])
  draft 작업상태 · Accordion(type=multiple, defaultValue=열린섹션)
    sections.map → AccordionSection(title, borderTop) →
        │
        ▼
ui/biz/cm/search/SearchFilterField.tsx        (디스패처 — switch field.type)
  radio → RadioButtonGroup(vertical)   checkbox → CheckboxGroup(swipeable, 다중선택)
  dateRange → DateRangeInput            date → DateInput
  text → InputBox                       selectionField → SelectionFieldBox(`>`)
  select → SelectBox                    (+ InputLabel)
        │
        ▼
ui/common/base/Accordion.tsx (신규, raw/accordion 래핑) · common/base·composites
```

### 2.2 Data Flow (v0.6 — RHF+zod)

```
[열기] → open=true → form.reset(value ?? defaultValue)   ← 값/검증 상태는 RHF(useForm)가 소유
[필드 편집] Controller(rf.onChange) → RHF 폼값 갱신 (+ normalize 로 종속 필드 보정 setValue)
[초기화] → form.reset(defaultValue)
[검색] → form.handleSubmit:
          zod 검증(buildZodSchema — required 필드 빈값 거부)
          ├ 실패 → 검색 차단·필드 아래 에러 표시·첫 에러 필드로 scrollIntoView (팝업 유지)
          └ 통과 → onSearch(data) → 부모 setFilter + 닫힘
[값 입력] reValidateMode:'onChange' → 실패했던 필드는 채워지는 즉시 에러 해제
[닫기/Esc/외부클릭] → 편집분 폐기(reset), value 유지 → 재진입 복원
[아코디언] 각 섹션 독립 접기/펴기 (Radix multiple, defaultValue=초기 열림)
[명령형] SearchFilterHandle(ref) — submit()/reset() 을 페이지에서 직접 트리거 가능
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `SearchFilter` | `FullPopup`, `ButtonGroup`, `Accordion`/`AccordionSection`, `SearchFilterField`, `types/search-filter` | 셸 레이아웃·상태·아코디언 |
| `Accordion` (신규 base) | `raw/accordion`(Radix) | 섹션 아코디언(타이틀바+chevron+content) |
| `SearchFilterField` | `RadioButtonGroup`, `SelectBox`, `SelectionFieldBox`, `DateRangeInput`, `DateInput`, `InputBox`, `InputLabel` | 타입→컴포넌트 매핑 |
| `PrcmPlanIntgListPage` | `SearchFilter`, `Button`, `Icon`, `types/*` | config 주입 + 트리거 + 요약 + API 주석 |

---

## 3. Data Model

> 런타임 DB 모델 없음. **타입 모델(config v2/value)** 정의 (`src/types/search-filter.ts`).

### 3.1 Section / Field / Value 타입 (v2)

```typescript
export interface DateRangeValue { start: string; end: string }       // 'YYYY-MM-DD'
export type SearchFilterFieldValue = string | string[] | DateRangeValue

// 필드 — discriminated union by `type`
type SearchFilterField =
  | { type:'radio';          key; label?; required?; options[] }   // value: string (세로 라디오)
  | { type:'checkbox';       key; label?; required?; options[] }   // value: string[] (다중)
  | { type:'dateRange';      key; label?; required? }              // value: DateRangeValue
  | { type:'date';           key; label?; required?; placeholder? }// value: string
  | { type:'text';           key; label?; required?; placeholder?; minLength?; maxLength?; pattern?:{regex,message} }// value: string
  | { type:'selectionField'; key; label?; required?; placeholder? }// value: string (`>` 팝업)
  | { type:'select';         key; label?; required?; placeholder?; options[] } // value: string

// 아코디언 섹션
interface SearchFilterSection {
  key; title; titleInfo?; defaultOpen?  // 기본 열림
  fields: SearchFilterField[]           // 빈 배열 → "준비 중" placeholder
}
export interface SearchFilterConfig { title?; sections: SearchFilterSection[] }
export type SearchFilterValue = Record<string, SearchFilterFieldValue>

// (v0.4) 동적 schema — 현재 입력값에 따라 섹션/필드가 달라질 때 resolver 함수로 주입
export type SearchFilterSchemaResolver = (value: SearchFilterValue) => SearchFilterSchema
```

#### 3.1.1 검색유형별 동적 schema (v0.4 — 설계서 MUI-OP-01-M02 p11~13)

검색유형(`srchType`)에 따라 **날짜·검색어·구분설정 섹션이 통째로 바뀐다.** `SearchFilter.schema` 는 정적 객체뿐 아니라 `SearchFilterSchemaResolver`(함수)도 받으며, 셸이 `draft` 변경마다 재호출해 섹션을 다시 그린다. 검색유형 전환 시 종속 필드 보정은 `SearchFilter.normalize?(next, prev)` 콜백으로 소비자(페이지)가 처리한다(셸은 도메인 key 를 모름).

| 섹션 | 조달계획(plan, p11) | 사전규격(spec, p12) | 연간조달(annual, p13) |
|------|---------------------|---------------------|------------------------|
| 업무구분 | 전체(물품·용역·공사·국외) | 국외 **비활성** | 국외만 활성(타 비활성) |
| 날짜 | 월 설정(`orderPrnmntYm`, dateRange) | 일자 설정(`rcptPeriod`) + 공개일 설정(`opnDt`, date 단일) | 연도 설정(`stdYr`, text·지시년도) |
| 검색어 | 제목·판단번호·대표품명·발주기관·담당자 | 제목·판단번호·발주기관·담당자(**품명 삭제**) | 군구분·품질등급·재고번호(P71)·부품번호 |
| 구분설정 | 진행상태·기능·입찰형태·계약방법 | **없음** | 부서·기능·진행상태·품류 |

> 구현: 페이지 `buildOpSearchSchema(value)` resolver + `normalizeOpSearch(next, prev)`(검색유형 전환 시 `taskSeNm` 을 유형 기본값으로 교체). 셸은 섹션 key 집합이 바뀌면 Accordion 을 remount 해 새 섹션 기본 열림을 재적용.

### 3.2 조달계획 검색조건 value 타입 (`src/types/op.ts`)

> 빡빡한 union interface 대신 **느슨한 alias** — 검색필터 공통 value 타입 그대로(캐스팅 불필요). 동적 검색폼 값에 적합.

```typescript
// src/types/op.ts
import type { SearchFilterValue } from '@/types/search-filter'

// 값 키(참고): srchType · taskSeNm · orderPrnmntYm · prcmPlanNm · prcmNo ·
//             rprsItemNm · deptCd · userNm · implPrgrsStcd · inspShcd · bidSecd · ctrtMthdCd
export type OpSearchFilter = SearchFilterValue
```

> alias 라 `OpSearchFilter === SearchFilterValue` → `OpListPage` 의 `value`/`defaultValue`/`onSearch` 에 **`as unknown as` 캐스팅 없음**. (대가: 필드별 union 검증 없음 — 동적 폼값이라 허용)

### 3.3 Figma 섹션 ↔ 필드 ↔ 컴포넌트 매핑

| 아코디언 섹션 | 필드(key) | field.type | → common |
|---|---|---|---|
| 검색유형 | srchType | radio | RadioButtonGroup(vertical) |
| 업무구분 | taskSeNm | checkbox | CheckboxGroup(swipeable, 다중선택) |
| 일자 설정 | orderPrnmntYm | dateRange | DateRangeInput |
| 검색어 | prcmPlanNm·prcmNo·userNm | text | InputBox |
| 검색어 | rprsItemNm·deptCd | selectionField | SelectionFieldBox(`>`, 팝업 TODO) |
| 구분설정 | implPrgrsStcd·inspShcd·bidSecd·ctrtMthdCd | select | SelectBox |

---

## 4. API Specification

> **N/A (백엔드 미연동)** — UI/상태/타입만. 목록 조회는 `OpListPage` 에 주석 스텁.

```typescript
// services/op.ts (추후): opService.getList(toRequest(value))
// queries/op.ts  (추후): useOpList(value as OpSearchFilter)
```
`onSearch(value)` 가 백엔드 경계.

---

## 5. UI/UX Design

### 5.1 Screen Layout (FullPopup + 아코디언)

```
┌────────────────────────────────────────────┐
│ 검색필터                  [초기화] [닫기]   │ ← FullPopup 헤더
├────────────────────────────────────────────┤
│ ▼ 검색유형                                  │ ← AccordionSection (bg-primary-faint 56h + chevron20)
│   ○ 조달계획  ○ 사전규격  ○ 연간조달계획     │   radio(vertical)
│ ▼ 업무구분                                  │
│   ✓전체 ✓물품 ✓용역  …  [>]                  │   CheckboxGroup(swipeable·다중)
│ ▼ 일자 설정                                 │
│   [접수기간] (1/3/6개월·기간검색) [기간입력] │   DateRangeInput
│ ▼ 검색어 (일부 입력 가능)                    │
│   제목 [____]  판단번호 [____]               │   text
│   품명 [____ >]  발주기관 [____ >]           │   selectionField
│   담당자 [____]                              │   text
│ ▼ 구분설정                                  │
│   진행상태[전체▾] 기능[전체▾] 입찰형태[▾] …  │   select ×4
├────────────────────────────────────────────┤
│        [ 닫기 ]      [    검색    ]           │ ← footer ButtonGroup(플로팅)
└────────────────────────────────────────────┘
```

### 5.2 User Flow

```
OpListPage [검색필터] → 아코디언 팝업(초기 전 섹션 열림)
  → 섹션 접기/펴기 + 필드 편집(draft)
  → [검색] onSearch + 닫힘 → 적용 요약 갱신 / [초기화] default / [닫기] 폐기·복원
```

### 5.3 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `Accordion` / `AccordionSection` | `src/ui/common/base/Accordion.tsx` (신규) | 섹션 아코디언 — raw/accordion 래핑, 타이틀바(56h `bg-primary-faint` 19 Bold chevron20)+content(white p-16) |
| `SearchFilter` | `src/ui/biz/cm/search/SearchFilter.tsx` | 셸: FullPopup + draft + Accordion 렌더 |
| `SearchFilterField` | `src/ui/biz/cm/search/SearchFilterField.tsx` | 디스패처: field.type → common + InputLabel |
| `PrcmPlanIntgListPage` | `src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx` | config 주입 + 트리거 + 요약 + API 주석 |

### 5.4 Page UI Checklist

#### Accordion (신규 base, 도메인 무관)

- [ ] 타이틀 바: h-56 · `bg-krds-bg-primary-faint`(blue) / white · 19px Bold · 좌측 타이틀 truncate
- [ ] chevron 20px(`[&>svg]:size-5`), 열림 시 180° 회전 (raw 동작)
- [ ] 상단 1px divider(`borderTop`, 첫 섹션 false)
- [ ] 콘텐츠: bg-white · p-16 · 세로 stack gap-16
- [ ] `raw/accordion` 래핑(직접 Radix 신규 사용 0) · raw 미수정

#### SearchFilter 셸

- [ ] FullPopup 타이틀 + 우측 [초기화]/[닫기] + 하단 [닫기]/[검색]
- [ ] Accordion `type="multiple"` · `defaultValue`=defaultOpen 섹션
- [ ] 검색→`onSearch(draft)`+닫힘 / 초기화→default / 닫기→폐기·복원
- [ ] 빈 fields 섹션 → "준비 중" placeholder
- [ ] `raw/*` 직접 import 0 · 도메인 하드코딩 0

#### SearchFilterField 디스패처

- [ ] `radio`→RadioButtonGroup(vertical) · `dateRange`→DateRangeInput · `date`→DateInput
- [ ] `text`→InputBox(clear) · `selectionField`→SelectionFieldBox(`>`, 팝업 TODO) · `select`→SelectBox
- [x] `checkbox`→ CheckboxGroup(swipeable, 다중선택 + 가로 스와이프)
- [ ] field.label 있을 때 InputLabel(required 기본 false)

#### OpListPage (조달계획 consumer)

- [ ] config 5섹션(검색유형/업무구분/일자설정/검색어/구분설정) · 업무구분 checkbox 5옵션(전체/물품/용역/공사/외자)
- [ ] 검색유형 radio 3옵션 · 검색어 5필드(text×3 + selectionField×2) · 구분설정 select×4
- [ ] DEFAULT_VALUE(srchType=plan, orderPrnmntYm=최근1개월, 나머지 전체/빈값)
- [ ] [검색필터] 트리거 + 적용 필터 제네릭 요약
- [ ] selectionField/dateRange/구분설정 옵션에 `// TODO` 주석 · API 주석 스텁

---

## 6. Error Handling / Validation (v0.6 — RHF+zod)

**검증 엔진 = react-hook-form + zod (입력 폼 레인과 엔진 통일, 2026-08-07).** 단, 페이지가 zod 스키마를 직접 작성하지 않는다 — **셸이 필드 정의에서 자동 생성**한다.

- **사용법(페이지)**: schema 필드에 `required: true` 선언만. 그러면 [검색] 시 빈값이면 차단 + 해당 필드 아래 "필수 입력 항목입니다."(`InputMessage type="error"`) + 첫 에러 필드로 스크롤. 값이 채워지면 에러 즉시 해제.
- **동작(셸)**: `buildZodSchema(resolved)` 가 required 필드 → `z.custom(빈값 거부)` 매핑으로 zod 스키마 생성(비 required 는 `z.any()`, `looseObject` 라 타 유형 키 통과). 각 필드는 `Controller` 로 RHF 등록. 동적 schema(resolver)여도 검증 시점의 resolved 기준(ref 참조).
- **text 필드 규칙(2026-09-11)**: `minLength`/`maxLength`/`pattern:{regex,message}` 선언 시 `buildZodSchema` 가 `z.string().optional().superRefine` 으로 매핑 — 빈값은 required 만 검사, 길이/형식은 입력이 있을 때만(선택 항목 비움 = 통과). 기본 문구 "N자 이상 입력해주세요." / "N자 이내로 입력해주세요.", pattern 은 message 필수. `maxLength` 는 InputBox native 속성으로도 전달(타이핑 차단, 미지정 시 InputBox 기본 100).
- **규칙 확장**: 다른 타입 규칙(기간 제한 등)이 생기면 **필드 정의 옵션 → `buildZodSchema` 매핑 추가**(`cm/search/searchFilterSchema.ts` 한 곳 — SearchFilter.tsx 에서 분리한 순수 모듈) — 기존 화면들은 무수정 유지. 페이지별 zod 스키마 작성 금지(CLAUDE.md 검증 레인 규칙).
- **명령형 핸들**: `SearchFilterHandle`(ref) — `submit()`(검증 포함 검색)/`reset()`. footer 버튼과 동일 동작을 페이지에서 트리거할 때만 사용.

```tsx
// 페이지 사용 예 — required 선언(검증은 셸이 수행)
{ type: 'checkbox', key: 'taskSeNm', required: true, ... }

// 명령형 제어가 필요할 때(옵션)
const filterRef = useRef<SearchFilterHandle>(null)
<SearchFilter ref={filterRef} ... />
filterRef.current?.submit()   // footer [검색]과 동일
```

| 상황 | 처리 |
|------|------|
| required 필드 빈값 검색 | zod 검증 실패 → 차단 + 필드 에러 + 첫 에러 스크롤(위 참조) |
| dateRange 형식 오류 | DateRangeInput 내부 검증(error state) |
| 알 수 없는 field.type | 디스패처 default: DEV 콘솔 경고 + null |

---

## 7. Security Considerations

- [x] 입력/인증/네트워크 미처리(API 미연동) — 대부분 N/A
- [ ] 검색어 표시·콜백만, innerHTML 미사용

---

## 8. Test Plan

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L1 빌드/구조 | 파일 존재, 타입 컴파일, raw 직접 import 0 | build/grep | Do |
| L2 컴포넌트 | 아코디언 접기/펴기, 필드 타입 렌더, 초기화/검색/복원 | 수동/Vite | Do |
| L3 플로우 | 트리거→편집→검색→요약 / 닫기→복원 | 수동 | Check |

### 8.2 L2 시나리오

| # | 대상 | 액션 | 기대 |
|---|------|------|------|
| 1 | Accordion | 타이틀 클릭 | 해당 섹션 접힘/펴짐, chevron 회전 |
| 2 | radio | 옵션 선택 | 단일 선택 전환 |
| 3 | dateRange | 빠른설정/기간 | start/end 갱신 |
| 4 | selectionField | 클릭 | (팝업 TODO) onClear 동작, `>` 표시 |
| 5 | select | 선택 | 값 반영 |
| 6 | 셸 | 검색 | onSearch(draft)+닫힘, 요약 갱신 |
| 7 | 셸 | 닫기 후 재오픈 | 확정값 복원, 미확정 폐기 |

### 8.5 Seed Data

> **N/A**

---

## 9. Clean Architecture

### 9.1 Layer / 9.2 Dependency

```
biz/op/prcmPlanIntgList/PrcmPlanIntgListPage → biz/cm/search/SearchFilter, types/*
biz/cm/search/SearchFilter  → base/Accordion, composites/*, SearchFilterField, types/search-filter
biz/cm/search/SearchFilterField → common/base·composites, types/search-filter
base/Accordion → raw/accordion (래핑)
규칙: cm/search 는 도메인(biz/*) import 금지. raw/* 직접 import 금지(Accordion 만 raw 래핑).
```

### 9.4 Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `Accordion` | UI(base) | `src/ui/common/base/Accordion.tsx` |
| `SearchFilter`/`SearchFilterField` | UI(공통 업무) | `src/ui/biz/cm/search/*` |
| 타입 | Domain | `src/types/search-filter.ts`, `src/types/op.ts` |
| `PrcmPlanIntgListPage` | UI(도메인) | `src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx` |

---

## 10. Coding Convention Reference

| Item | Convention |
|------|-----------|
| 컴포넌트 출처 | `common/`(base·composites)만 — `raw/*` 직접 import 금지(Accordion 은 raw 래핑 base) |
| 도메인 격리 | `cm/search` 도메인 무관(config 주입) |
| 상태 | RHF `useForm`(편집 draft = 폼값) + controlled value + onSearch. 검증 = zod 자동 생성(`buildZodSchema`) |
| API | 주석 스텁(`// TODO(API)`) |
| 스타일 | KRDS 토큰 유틸, 하드코딩 0 (chevron 20=`[&>svg]:size-5`) |

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── types/
│   ├── search-filter.ts          # config v2(아코디언+필드 union)/value
│   └── op.ts                     # 조달계획 value (OpSearchFilter = SearchFilterValue alias)
└── ui/
    ├── common/base/Accordion.tsx # [신규] 섹션 아코디언(raw 래핑)
    └── biz/
        ├── cm/search/SearchFilter.tsx        # 셸(아코디언 렌더)
        ├── cm/search/SearchFilterField.tsx   # 디스패처
        └── op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx  # 조달계획 config + 트리거 + 요약 + API 주석
```

### 11.2 Implementation Order

1. [x] `types/search-filter.ts` v2 (아코디언 섹션 + 필드 union)
2. [x] `common/base/Accordion.tsx` (raw/accordion 래핑)
3. [x] `SearchFilterField.tsx` (필드 타입 디스패처)
4. [x] `SearchFilter.tsx` (셸 — 아코디언 렌더)
5. [x] `types/op.ts` + `OpListPage.tsx` (config·트리거·요약·API 주석)
6. [ ] ComponentGuidePage 에 Accordion 데모 등록 / krds 디자인 문서 base 목록 동기화
7. [x] `npm run lint` / `npm run build`

### 11.3 Session Guide

| Module | Scope Key | Description |
|--------|-----------|-------------|
| 범용 셸 | `module-1` | types + Accordion + SearchFilterField + SearchFilter |
| 조달계획 consumer | `module-2` | types/op + OpListPage |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-01 | 초안 — Option C, config 구동(segmented/searchTerm 기반) | joshuaysid-spec |
| 0.2 | 2026-06-01 | **v2 재설계** — Figma MUI-OP-01-M02(9300-37302) 아코디언 레이아웃. 신규 base `Accordion`(9300-28556), 필드 타입 radio/checkbox/dateRange/date/text/selectionField/select, biz/op/OpListPage(p.8). chevron 20px | joshuaysid-spec |
| 0.3 | 2026-06-08 | **공통 검색시트 구현 + 셸 내장.** 품목별조회(P71 `ItemInqSheet`)·생산자조회(P72 `PrdcrInqSheet`) BottomSheet 를 `biz/cm/search/` 에 두고, `SelectionFieldDef.searchSheet:'item'|'producer'` 식별자로 **SearchFilter 셸이 직접 open/commit**(페이지 위임 `onSelectionClick` 제거 — 소비자는 SearchFilter 하나만 import). 위 §본문의 "팝업 TODO/공통팝업 미구현"(v0.2 시점 스텁)은 본 버전에서 해소됨. op 폴더 설계서 화면ID 재편(PrcmPlanIntgListPage/PrcmPlanDtl*) 반영 | joshuaysid-spec |
| 0.4 | 2026-06-09 | **검색유형별 동적 schema(MUI-OP-01-M02 p11~13).** `schema` 가 `SearchFilterSchema \| SearchFilterSchemaResolver`(함수)도 받도록 확장 + `normalize?(next,prev)` 콜백 추가. 검색유형(조달계획/사전규격/연간조달)에 따라 날짜·검색어·구분설정 섹션이 달라짐(§3.1.1 표). 페이지에 `buildOpSearchSchema` resolver + `normalizeOpSearch`(유형 전환 시 업무구분 보정). 섹션 key 변경 시 Accordion remount. 기존 정적 schema 사용처 하위호환 | joshuaysid-spec |
| 0.5 | 2026-08-06 | **required 강제(셸 자체 검증).** 필드 `required: true` 가 표시(별표)뿐 아니라 검색 차단까지 — 빈값이면 onSearch 미호출·필드 아래 에러·첫 에러 스크롤·입력 시 해제. 페이지는 선언만(무수정 원칙 확립) | joshuaysid-spec |
| 0.6 | 2026-08-07 | **검증 엔진 RHF+zod 전환(폼 레인과 통일).** draft useState → `useForm`(RHF 소유), 검증 → 필드 정의에서 zod 스키마 자동 생성(`buildZodSchema`) + `handleSubmit` 흐름, 전 필드 `Controller` 등록. 페이지 계약(schema/value/onSearch·required 선언) 불변 — required 사용 14화면 무수정. `SearchFilterHandle`(ref: submit/reset) 신설. §2.2·§6·§10 갱신 | joshuaysid-spec |
