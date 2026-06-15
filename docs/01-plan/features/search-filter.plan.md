---
template: plan
version: 1.3
feature: search-filter
date: 2026-06-01
author: joshuaysid-spec
project: d2b-mobile-front
projectVersion: 0.1.0
---

# search-filter Planning Document

> **Summary**: 도메인 무관 **범용 검색필터(SearchFilter)** 를 `src/ui/biz/cm/search/` 에 config 구동 방식으로 구현한다. 컴포넌트는 어떤 도메인도 모르고, 사용처가 "그릴 필드 정의(config)"만 넘기면 `common/` 컴포넌트로 폼을 렌더한다. 첫 소비자는 설계서 p.11 **조달계획 검색필터(MUI-OP-01-M02)** config 1개이며, 검색 결과(API) 연동은 주석 스텁으로 남긴다.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: joshuaysid-spec
> **Date**: 2026-06-01
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 조달/입찰/계약 등 여러 화면이 동일한 "풀페이지 검색필터" UX(검색유형·업무구분·기간·검색어·구분설정 + 초기화/검색/닫기)를 필요로 한다(설계서 MUI-OP-01-M02, UC-OP-01/02/03). 도메인마다 따로 만들면 중복·불일치. |
| **Solution** | `biz/cm/search/SearchFilter` 를 **config 구동 범용 셸**로 구현. 셸은 FullPopup + 초기화/검색/닫기 + 섹션 레이아웃을 담당하고, 각 도메인은 "필드 정의 config"만 넘긴다. 필드 타입(segmented/select/dateRange/date/searchTerm/text)별로 기존 `common/` 컴포넌트에 매핑. |
| **Function/UX Effect** | 한 컴포넌트를 조달·입찰·계약·공지 어디서나 config만 바꿔 재사용. 첫 적용으로 조달계획 검색필터(p.11)가 ProcurementPage 임시 트리거에서 동작. |
| **Core Value** | 검색필터 UX 일관성 + 신규 도메인은 config 한 벌로 즉시 검색필터 확보. KRDS `common/` 컴포넌트 재사용 극대화. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 여러 도메인이 공통으로 쓸 풀페이지 검색필터가 없음. 도메인별 중복 제작 방지 필요 |
| **WHO** | D2B 모바일 프론트 개발자(검색 화면 제작자) · 조달/입찰/계약 등 검색 사용자 |
| **RISK** | config↔value 타입 안전성 약화(제네릭) · 발주예정월 YYYY-MM 월 단위인데 기존 DateInput 은 일 단위 · 공통팝업(발주기관/품목 검색) 미구현 · 백엔드 미연동 |
| **SUCCESS** | config 구동 SearchFilter 가 6개 필드 타입을 `common/` 컴포넌트로 렌더 · 초기화/재진입 복원/검색 콜백 동작 · 조달계획 config(p.11)로 ProcurementPage 에서 동작 · lint·build 통과 |
| **SCOPE** | Phase 1 config·value 타입 정의(`types/search-filter.ts`) → Phase 2 SearchFilter 셸 + 필드 렌더러 → Phase 3 조달계획 config + ProcurementPage 임시 트리거 + API 주석 스텁 |

---

## 1. Overview

### 1.1 Purpose

도메인에 종속되지 않는 **범용 검색필터 컴포넌트**를 만들어, 조달계획·입찰·계약 등 여러 화면이 동일한 검색필터 UX 를 config 한 벌로 재사용하게 한다. 본 사이클은 범용 셸 + 첫 소비자(조달계획 p.11)까지를 구현하고, 실제 목록 조회(API)는 주석 스텁으로 남긴다.

### 1.2 Background

- 설계서 `01.조달계획` p.11(검색필터/조달계획)이 검색필터 UX 의 기준 화면. 동일 검색필터(MUI-OP-01-M02)가 UC-OP-01/02/03(조달·입찰·계약)에서 공통 사용됨 → 특정 도메인이 아닌 `biz/cm/`(공통 업무)에 둔다.
- 검색필터는 별도 라우트가 아니라 **풀페이지 팝업**("검색 필터 풀페이지 팝업 호출"). 목록 페이지(M01)가 아직 placeholder 라, 본 사이클은 `ProcurementPage` 임시 트리거로 동작 검증.
- KRDS 디자인시스템에 필요한 빌딩블록(FullPopup·SegmentedControl·SelectBox·InputBox·DateRangeInput·DateInput·ButtonGroup·Tag 등)이 이미 존재 → 신규 제작이 아니라 **config→common 매핑**이 핵심.
- **config 구동**: 컴포넌트는 도메인을 모름. 사용처가 `{ sections: [{ type, key, label, required, options/presets/fields ... }] }` 형태의 설정 객체를 넘기면, 셸이 타입별로 `common/` 컴포넌트를 렌더하고 값을 모아 `onSearch(value)` 로 돌려준다.

### 1.3 Related Documents

- UI 설계서: `.../D2BA-AP-3CD-0601.사용자인터페이스설계서-01조달계획-모바일_v0.6_상세.pptx` — p.11(검색필터/조달계획), p.14·15(`dml_prcmPlanSrch` 항목 정의)
- 아키텍처: `docs/frontend-architecture.md` (§10.1 composites=도메인 무관 / §10.2 biz/cm=공통 업무 / §14 위치 판단)
- 디자인 시스템: `docs/02-design/features/krds-design-system.design.md`
- 날짜 입력: `docs/01-plan/features/date-input.plan.md` (발주예정월 월 단위 개선 선행 컨텍스트)

---

## 2. Scope

### 2.1 In Scope

**범용 셸 (`src/ui/biz/cm/search/`)**
- [ ] `SearchFilter.tsx` — config 구동 풀페이지 검색필터. `FullPopup` 래핑(타이틀 + 우측 [초기화]/[닫기] + 하단 플로팅 [검색]/[닫기]).
- [ ] **필드 타입 렌더러** — config 의 각 섹션 `type` 을 `common/` 컴포넌트에 매핑:
  - `segmented` → SegmentedControl(트랙 합성) — 검색유형/업무구분
  - `select` → SelectBox — 진행상태 등
  - `dateRange` → DateRangeInput(빠른설정 칩 포함) — 발주예정월(임시 일 단위)
  - `date` → DateInput — 단일 날짜
  - `searchTerm` → SelectBox(필드 선택) + InputBox(필드별 placeholder) — 제목/판단번호/대표품명/발주기관/담당자
  - `text` → InputBox — 자유 입력
- [ ] **상태 동작** — `value`/`defaultValue` controlled, 내부 작업 상태, 초기화(→defaultValue), 검색 클릭 시 `onSearch(value)` + 닫힘, **재진입 시 value 복원**.
- [ ] **타입 정의** — `src/types/search-filter.ts` 에 `SearchFilterConfig`, `SearchFilterSection`(필드 타입 discriminated union), `SearchFilterValue` 정의.

**첫 소비자 — 조달계획 (`src/ui/biz/procurement/`)**
- [ ] **조달계획 검색 config** — p.11 기준 섹션 구성(검색유형* / 업무구분* / 발주예정월* / 검색어 / 진행상태). 초기 상태값(검색유형 조달계획·업무구분 전체·기간 최근 1개월·검색어 빈값·진행상태 전체).
- [ ] **`ProcurementPage.tsx`** — 임시 "검색필터" 트리거 버튼 + 적용 필터 요약 표시 + **목록 조회 API 호출부 주석 스텁**.
- [ ] **`src/types/procurement.ts`** — 조달계획 검색조건 value 타입(`dml_prcmPlanSrch` 영문명: `srchType`, `taskSeNm`, `orderPrnmntYmFr/To`, `prcmPlanNm`, `prcmNo`, `deptCd`, `userNm`, `rprsItemNm`, `implPrgrsStcd`).
- [ ] **ComponentGuidePage 등록** (선택) — SearchFilter 데모(샘플 config).

### 2.2 Out of Scope

- 검색유형 **사전규격(p.12)·연간조달계획(p.13)** config — 다음 사이클(셸은 미리 수용 가능하도록 설계).
- **발주예정월 월 단위(YYYY-MM) 전용 피커** — 기존 `DateRangeInput`(일 단위) 그대로 배치 + 주석. date-input 월 단위 개선 시 config/페이지 수정(사용자 결정).
- **공통팝업 연계** — 대표품명→품목별 검색(MUI-OP-01-P71), 발주기관→발주부서 검색(MUI-BD-01-P04). 일반 입력으로 대체, 트리거 자리 주석만.
- **실제 목록 조회 / 백엔드 API / services·queries 실구현** — 주석 스텁만.
- **목록 페이지(M01) 본 구현** — 임시 트리거까지.
- **완전한 제네릭 타입 안전(config 키↔value 키 컴파일 타임 보장)** — value 는 `Record` 기반, 소비자가 자기 타입으로 캐스팅. 과한 타입 마법 지양(YAGNI).

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `SearchFilterConfig`/`SearchFilterSection`/`SearchFilterValue` 타입을 `src/types/search-filter.ts` 에 정의 | High | Pending |
| FR-02 | `SearchFilter` 셸 — FullPopup 래핑(타이틀, 우측 [초기화]/[닫기], 하단 [검색]/[닫기]) | High | Pending |
| FR-03 | 필드 타입 렌더러 — `segmented`/`select`/`dateRange`/`date`/`searchTerm`/`text` 를 `common/` 컴포넌트로 렌더 | High | Pending |
| FR-04 | `required` 필드 라벨에 필수 표시(*) | High | Pending |
| FR-05 | `value`/`defaultValue` controlled, 검색 클릭 시 `onSearch(value)` + 닫힘 | High | Pending |
| FR-06 | 초기화 → defaultValue 로 리셋. 재진입(value 주입) 시 직전 설정 복원 | High | Pending |
| FR-07 | 조달계획 검색 config(p.11) 작성 — 검색유형/업무구분/발주예정월/검색어/진행상태 | High | Pending |
| FR-08 | ProcurementPage 임시 트리거 + 적용 필터 요약 표시 | Medium | Pending |
| FR-09 | 목록 조회 API 호출부를 주석 스텁으로 명시(services/queries 시그니처 가이드 포함) | Medium | Pending |
| FR-10 | `searchTerm` 의 대표품명/발주기관은 일반 입력 + 공통팝업 연계 `// TODO` 주석 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 컴포넌트 규칙 | `src/ui/raw/*` 직접 import 0 — `common/`(base·composites)만 사용 | import 경로 검토 |
| 범용성 | SearchFilter 가 특정 도메인 타입/문자열 하드코딩 0 (조달계획은 config 로만 주입) | 코드 검토 |
| 디자인 정합성 | 설계서 p.11 영역 구성과 1:1 (라벨·필수표시·플로팅 버튼) | 설계서 대조 |
| 일관성 | 색상/간격/타이포 하드코딩 0 — KRDS 토큰 유틸만 | `#`/임의 px 스캔 |
| 접근성 | 필수 표시, 포커스 표시, 키보드 조작 | 키보드 순회 확인 |
| 빌드/린트 | 에러 0 | `npm run lint`, `npm run build` (사용자 검증) |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] config 구동 `SearchFilter` 가 6개 필드 타입을 `common/` 컴포넌트로 렌더
- [ ] FullPopup 타이틀/초기화/닫기 + 하단 검색/닫기 + 초기화/재진입 복원/`onSearch` 동작
- [ ] `src/types/search-filter.ts` 범용 타입 정의
- [ ] 조달계획 config(p.11)로 ProcurementPage 임시 트리거에서 동작 + 필터 요약 표시
- [ ] `src/types/procurement.ts` 검색조건 value 타입 정의
- [ ] 목록 조회 API 주석 스텁 명시

### 4.2 Quality Criteria

- [ ] `src/ui/raw/*` 직접 import 0
- [ ] SearchFilter 셸에 도메인 하드코딩 0
- [ ] 하드코딩 색상/수치 0 (KRDS 토큰만)
- [ ] `npm run lint` 0 errors, `npm run build` 성공

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| config↔value 제네릭으로 타입 안전성 약화 | Medium | Medium | value 는 `Record<string, FieldValue>` + 소비자 타입(`ProcurementSearchFilter`)으로 캐스팅. 완전 타입 마법은 범위 외(YAGNI). 필드 타입은 discriminated union 으로 렌더러만 안전화 |
| 발주예정월 YYYY-MM 월 단위 vs 기존 DateRangeInput 일 단위 | Medium | High | DateRangeInput 임시 배치 + `// TODO: 월 단위 피커 교체 — date-input 개선 시`. config 의 dateRange 섹션 옵션으로 격리 |
| 필드 타입 추상화 과설계 | Medium | Medium | 이번 사이클은 p.11 에 실제 필요한 6타입만. 새 타입은 필요 시 추가 |
| raw 직접 사용 유혹 | Medium | Low | 필요한 빌딩블록 모두 `common/` 에 존재 확인됨. 부재 시 base 래퍼 신설 후 사용(사용자 확인) |
| 공통팝업(발주기관/품목 검색) 미구현 | Low | Medium | 일반 입력 대체 + `// TODO` 주석(MUI-OP-01-P71 / MUI-BD-01-P04) |
| 백엔드 미연동 | Medium | High | API 호출부 주석 스텁 + 타입만. `onSearch` 콜백으로 경계 고정 |

---

## 6. Impact Analysis

> 신규 기능 — 기존 코드 소비자 거의 없음(ProcurementPage 만 수정).

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `src/ui/biz/cm/search/` | Component | 신규 — `SearchFilter.tsx`(+ 필요 시 필드 렌더러 분리). 범용·도메인 무관 |
| `src/types/search-filter.ts` | Type | 신규 — config/section/value 범용 타입 |
| `src/types/procurement.ts` | Type | 신규 — 조달계획 검색조건 value 타입 |
| `src/ui/biz/procurement/ProcurementPage.tsx` | Component | 수정 — 임시 트리거 + 조달계획 config + 필터 요약 + API 주석 스텁 |
| `src/ui/dev/ComponentGuidePage.tsx` | Catalog | (선택) SearchFilter 데모 섹션 |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| `ProcurementPage` | READ | `router.tsx` → `/procurement` lazy | 무영향 (placeholder 내용만 교체) |
| `common/` 컴포넌트(FullPopup, SegmentedControl, SelectBox, InputBox, DateRangeInput, DateInput, ButtonGroup 등) | READ | SearchFilter 내부 import | 무영향 (기존 API 그대로 소비) |

### 6.3 Verification

- [ ] ProcurementPage 라우트 정상 렌더 (트리거 → 팝업 → 검색/초기화/닫기)
- [ ] SearchFilter 가 `common/` 만 사용 (raw 직접 사용 0), 도메인 하드코딩 0

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Selected |
|-------|:--------:|
| Starter | ☐ |
| **Dynamic** | ☑ (기존 유지) |
| Enterprise | ☐ |

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 컴포넌트 위치 | common/composites / biz/{도메인} / **biz/cm/search** | **biz/cm/search** | 도메인 의미를 config 로 받지만 여러 도메인 공통 업무 컴포넌트 → 공통업무(cm). 사용자 결정 |
| 범용 방식 | 도메인별 / slot(children) / **config 구동** | **config 구동** | 사용처는 필드 정의만 선언, 셸이 렌더. "모든 도메인이 동일하게 쓴다" 의도에 부합. 사용자 결정 |
| 화면 형태 | 별도 라우트 / **FullPopup** | **FullPopup** | 설계서 "풀페이지 팝업" + FullPopup 의 초기화/닫기·footer 구조 1:1 |
| 트리거 위치 | M01 목록 / **ProcurementPage 임시** / 가이드 | **ProcurementPage 임시 트리거** | M01 미구현 — 임시 버튼으로 검증, M01 구현 시 재사용 |
| 첫 소비자 범위 | 3 유형 / **조달계획만** | **조달계획만** | 유형별 폼 상이 — 사이클 분리. 사용자 결정 |
| 발주예정월 입력 | 월 전용 피커 / **DateRangeInput 임시** / SelectBox | **DateRangeInput 임시** | 컴포넌트 수정 없이 진행, date-input 개선 시 수정. 사용자 결정 |
| 컴포넌트 출처 | raw 직접 / **common/ 조합** | **common/(base·composites)만** | CLAUDE.md raw 직접 금지. 사용자 명시 |
| value 타입 | 완전 제네릭 / **Record + 소비자 캐스팅** | **Record 기반** | 과한 타입 마법 지양. 필드 타입만 discriminated union 으로 안전화 |
| 상태 관리 | zustand / **로컬 + onSearch 콜백** | **로컬 + 콜백** | 단일 UI 상태. 목록 연동 시 승격 검토 |
| API 연동 | 실구현 / **주석 스텁** | **주석 스텁** | 백엔드 미연동. 사용자 결정 |
| 폼 핸들링 | react-hook-form / **native useState** | **native useState** | 의존성 미도입, 스캐폴드 컨벤션 유지 |

### 7.3 Clean Architecture Approach

```
Selected Level: Dynamic

src/
├── types/
│   ├── search-filter.ts        # [신설] SearchFilterConfig / Section(union) / Value
│   └── procurement.ts          # [신설] 조달계획 검색조건 value 타입
└── ui/
    ├── biz/cm/search/
    │   └── SearchFilter.tsx     # [신설] config 구동 범용 셸 (도메인 무관)
    │                            #         (필요 시 필드 렌더러 내부 분리)
    └── biz/procurement/
        └── ProcurementPage.tsx  # [수정] 조달계획 config + 임시 트리거 + 요약 + API 주석 스텁

의존 방향:
  biz/cm/search/SearchFilter  → common/*(base·composites), types/search-filter   (도메인 무관)
  biz/procurement/Procurement → biz/cm/search/SearchFilter, types/procurement, types/search-filter
  (raw 직접 import 금지)
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `CLAUDE.md` — 아이콘/shadcn 2층/코드 스플리팅/명명 규칙
- [x] `docs/frontend-architecture.md` — 레이어·네이밍·의존성·위치 판단(§10·§14)
- [x] ESLint / Prettier / tsconfig
- [x] KRDS 토큰 + `common/` 컴포넌트 세트

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| 범용 타입 위치 | 미정 | `src/types/search-filter.ts`(config/value), 조달계획은 `src/types/procurement.ts` | High |
| 컴포넌트 위치 | 규칙 존재 | 범용 셸 = `biz/cm/search/`, raw 직접 금지 | High |
| config 스키마 | 미정 | section discriminated union(type 별 필수 옵션) — Design 에서 확정 | High |
| API 스텁 표기 | 미정 | 호출부 주석 + `// TODO:` 마커 | Medium |

### 8.3 Environment Variables Needed

> **N/A** — UI/상태/타입만. API 미연동.

---

## 9. Next Steps

1. [ ] 본 Plan 확정 (Checkpoint)
2. [ ] 설계 문서 (`/pdca design search-filter`) — config 스키마(section union)·SearchFilter prop 시그니처·필드 타입↔common 컴포넌트 매핑·상태/리셋 다이어그램·조달계획 config 예시 확정
3. [ ] 구현 (`/pdca do search-filter`)
4. [ ] Check (`/pdca analyze search-filter`) — 설계 대비 정합 + lint/build

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-01 | 초안 — 조달계획 한정 검색필터(procurement-search-filter) | joshuaysid-spec |
| 0.2 | 2026-06-01 | 범용 config 구동 SearchFilter 로 재정의, 위치 biz/cm/search, feature명 search-filter, 조달계획은 첫 소비자 config | joshuaysid-spec |
