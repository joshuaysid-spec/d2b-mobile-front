---
template: plan
version: 1.3
feature: form-validation
date: 2026-06-15
author: jygong
project: d2b-mobile-front
status: Draft
---

# form-validation Planning Document

> **Summary**: 폐쇄망 + eGovFrame 백엔드 환경에서 프론트 폼 입력 검증을 팀 공통 방식으로 표준화한다.
>
> **Project**: d2b-mobile-front
> **Author**: jygong
> **Date**: 2026-06-15
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 폼이 늘어나는데 입력 검증의 표준이 없다. 검증 로직은 사실상 미구현(시각적 `required *`·안내 메시지만 존재)이고, 각자 구현하면 폼마다 방식이 갈린다. |
| **Solution** | 검증 **방식·트리거·에러표시·규칙 세트**를 하나의 공통 컨벤션으로 고정. 구현체(경량 수동 훅 vs react-hook-form+zod)는 Design 3안 비교로 확정. KRDS UI 인프라(InputLabel·InputMessage·필드 error 상태) 위에 얹는다. |
| **Function/UX Effect** | 제출 시 전체 검증 + 이후 blur 재검증, 에러는 필드 하단 빨강 메시지 + 첫 에러 필드 포커스. 모든 폼이 동일하게 동작. |
| **Core Value** | 폐쇄망에서 안전(전부 번들, 외부 런타임 의존 0)하고, 팀 누가 짜도 일관된 검증 UX. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 검증 표준 부재 → 폼마다 제각각·빈약. 다수 조달 폼이 추가될수록 악화. |
| **WHO** | 프론트 팀(여러 명)이 기획서 보고 폼 화면을 친다. 최종 사용자 = 모바일 웹앱 이용자. |
| **RISK** | (a) 수동 훅은 복잡 폼에서 빈약·불일치. (b) 라이브러리 도입은 번들↑·러닝커브. |
| **SUCCESS** | 공통 검증 컨벤션 문서화 + 대표 폼 1~2개에 표준 적용 + 빌드/번들 영향 허용범위. |
| **SCOPE** | 클라이언트(프론트) 검증만. 서버 검증(eGovFrame)은 대체 아님, 별도 책임. |

---

## 1. Overview

### 1.1 Purpose

여러 명이 기획서 기반으로 폼 화면을 작성할 때, **입력 검증을 동일한 방식·UX로** 하도록 공통 표준을 정하고 적용한다.

### 1.2 Background

- 현재 검증 라이브러리 없음(react-hook-form·zod·yup 미설치).
- KRDS UI 인프라는 준비됨: `InputLabel`(required `*`), `InputMessage`(type=error 빨강), `InputBox`/`TextArea` 에러 상태.
- 그러나 **실제 검증 로직은 어디에도 없음**(`PrcmPlan_NotiAply`조차 시각 표시 + 안내문만). `required` 플래그는 SearchFilter 필드·날짜입력·의견등록 팝업 등에 흩어져 있으나 동작은 미연결.
- 백엔드는 **전자정부프레임워크(Java/Spring)** — 서버단 검증을 수행하므로, 프론트 검증은 **UX용 사전 검증**(즉시 피드백)이 목적. zod 등 프론트 검증 라이브러리는 백엔드 스택과 무관하게 사용 가능.
- 배포는 **폐쇄망** — 외부 CDN/런타임 페치 금지. (npm 의존성은 빌드 시 번들되므로 폐쇄망과 무관, 단 번들 크기 영향은 고려.)

### 1.3 Related Documents

- 아키텍처: `docs/frontend-architecture.md`
- 컨벤션: `CLAUDE.md` (UI 인프라·타입 위치·페이지 작성 절차)
- 설계서: `docs/spec/` (화면별 필드·필수여부 출처)

---

## 2. Scope

### 2.1 In Scope

- [ ] **검증 트리거 표준**: 제출 시 전체 검증 + 이후(에러 발생한 필드는) blur/입력 시 재검증.
- [ ] **에러 표시 표준**: `InputMessage type="error"` + 필드 error 상태 + 첫 에러 필드로 포커스/스크롤 + `aria-invalid`/`aria-describedby` 연결.
- [ ] **공통 검증 규칙 세트**: required, 길이(min/max), 숫자/전화/이메일 형식, 날짜 범위(start≤end), 선택 최소개수(체크박스 그룹) 등 재사용 가능한 규칙.
- [ ] **구현체 후보 비교 준비**: (1) 경량 수동 훅(무의존) vs (2) react-hook-form + zod. 최종 선택은 Design.
- [ ] **대표 폼 적용**: 알림신청(`PrcmPlan_NotiAply`)·검색필터(`SearchFilter`) 등 1~2개에 표준 적용해 검증.
- [ ] **컨벤션 문서화**: CLAUDE.md "폼 검증" 섹션 + 페이지 작성 절차에 연결.

### 2.2 Out of Scope

- 서버단 검증(eGovFrame 책임) — 대체하지 않음. 서버 에러 응답의 폼 매핑은 후속 과제.
- 비동기/서버 왕복 검증(중복확인 등) — 이번엔 동기 클라이언트 검증만.
- 모든 화면의 폼을 일괄 전환 — 표준 확정 + 대표 적용까지. 전수 적용은 각 화면 작업 시.

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 제출 시 전체 검증, 에러 시 제출 차단 + 첫 에러 필드로 포커스/스크롤 | High | Pending |
| FR-02 | 에러난 필드는 이후 blur(또는 재입력) 시 재검증해 메시지 갱신 | High | Pending |
| FR-03 | 에러 UI = `InputMessage type="error"` + 필드 error 상태로 통일(컴포넌트 재사용) | High | Pending |
| FR-04 | 재사용 검증 규칙 세트(required·길이·숫자/전화/이메일·날짜범위·체크박스 최소선택) | High | Pending |
| FR-05 | 접근성: 에러 필드에 `aria-invalid`, 메시지에 `aria-describedby` 연결 | Medium | Pending |
| FR-06 | 다중 폼 동일 패턴(검색필터·알림신청·의견등록 등에서 같은 사용법) | High | Pending |
| FR-07 | 폐쇄망 안전: 외부 CDN/런타임 페치 없이 전부 번들로 동작 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|--------------------|
| 번들 영향 | 라이브러리 도입 시 추가 gzip 증가 허용범위 확인(vendor chunk) | `npm run build` chunk size |
| 학습비용 | 팀원이 예시 폼 1개 보고 새 폼에 적용 가능 | 사용법 1페이지 + 예시 |
| 유지보수 | 규칙 변경이 한 곳(규칙 세트/스키마)에서 이뤄짐 | 코드리뷰 |
| 접근성 | 에러 상태 스크린리더 인지(aria-invalid/desribedby) | 수동 점검 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 검증 트리거·에러표시·규칙 세트 표준 확정(Design에서 구현체 선택 포함).
- [ ] 대표 폼 1~2개(알림신청·검색필터)에 표준 적용 — 제출 차단·메시지·포커스 동작.
- [ ] CLAUDE.md "폼 검증" 컨벤션 섹션 작성.
- [ ] `npm run lint && npm run build` 통과, chunk size 영향 확인.

### 4.2 Quality Criteria

- [ ] 에러 0(lint), 빌드 성공.
- [ ] 동일 검증 규칙이 폼마다 복붙되지 않고 재사용됨.

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **경량 수동 훅이 복잡/다수 폼에서 빈약·불일치** (사용자 우려) | High | Medium | Design에서 RHF+zod와 정면 비교. 수동 채택 시에도 규칙 세트를 스키마 객체로 선언형화해 일관성 확보. |
| 라이브러리(RHF+zod) 도입 시 번들↑·러닝커브 | Medium | Medium | 번들 영향 측정(vendor-data 등 별도 chunk). 예시 폼 + 1페이지 가이드로 러닝커브 완화. |
| 폐쇄망에서 외부 의존 문제 | High | Low | npm 의존성은 빌드 시 번들 → 런타임 외부 페치 없음. CDN/동적 로드만 금지(아이콘 폰트 정책과 동일). |
| 클라/서버 검증 규칙 불일치(eGovFrame) | Medium | Medium | 프론트는 UX 사전검증으로 한정. 서버 에러 응답 매핑은 별도 후속 과제로 명시. |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| 폼 검증 방식(신규 표준) | Convention / Hook or Lib | 검증 트리거·에러표시·규칙 세트 신설 |
| `InputMessage`/`InputBox`/`TextArea` | Component | 에러 상태 연결(이미 지원, 사용 패턴 표준화) |
| (선택) `package.json` | Config | RHF+zod 채택 시 의존성 추가 + `vite.config.ts` manualChunks |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| required 플래그 | READ | `SearchFilter`/`SearchFilterField` 필드 정의 | 검증 연결 시 동작 추가(비파괴) |
| 폼 입력 | WRITE | `PrcmPlan_NotiAply`(알림신청 전화/동의) | 표준 적용 대상(대표 폼) |
| 폼 입력 | WRITE | `PrcmPlanDtl_OpnnRegFullPopup`·`BfhdSpcfctDtl_OpnnRegFullPopup`(의견등록) | 후속 적용 |
| 날짜 | WRITE | `DateInput`/`DateRangeInput`/`YearInput` | 날짜범위 규칙 연결 |

### 6.3 Verification

- [ ] 표준 적용이 기존 폼의 제출/표시를 깨지 않음(대표 폼으로 확인).
- [ ] 라이브러리 도입 시 빌드/번들 영향 확인.

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Selected |
|-------|:--------:|
| Starter | ☐ |
| **Dynamic** (feature 모듈, React+Vite) | ☑ |
| Enterprise | ☐ |

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Form/Validation | (1) 무의존 수동(useFormValidation+규칙세트) / (2) react-hook-form + zod | **TBD (Design Checkpoint 3)** | 폐쇄망 번들·팀 일관성·폼 복잡도·유지보수로 3안 비교 후 결정 |
| 검증 트리거 | submit-only / submit+blur / realtime | **submit + 이후 blur** | 과도한 실시간 경고 없이 즉시 피드백 |
| 에러 표시 | 신규 / 기존 KRDS | **기존 KRDS**(InputMessage·필드 error) | 인프라 재사용, 디자인 일관성 |
| Styling | Tailwind v4 | Tailwind | 기존 |

### 7.3 검증 책임 경계

```
[클라이언트 / 프론트]  ← 이번 Scope
  - 즉시 UX 검증(required/형식/범위) → 제출 차단 + 메시지
[서버 / eGovFrame]     ← 별도 책임(대체 아님)
  - 권위 있는 검증(보안·비즈니스 규칙) → 에러 응답
  - (후속) 서버 에러 응답을 폼 필드에 매핑
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `CLAUDE.md` 코딩 컨벤션 존재(UI 인프라·페이지 작성 절차·타입 위치).
- [x] ESLint / TypeScript 설정 존재.
- [ ] **폼 검증 컨벤션 — 신설 대상(이 PDCA 산출물).**

### 8.2 Conventions to Define

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| 검증 트리거 | 없음 | submit + blur 표준 | High |
| 에러 표시 | 부분(컴포넌트만) | InputMessage error + 필드 error + 포커스 패턴 | High |
| 규칙 세트 | 없음 | required·길이·형식·범위·최소선택 재사용 규칙 | High |
| 구현체 | 없음 | 수동 훅 vs RHF+zod (Design 확정) | High |

---

## 9. Next Steps

1. [ ] `/pdca design form-validation` — 3안(수동 / RHF+zod / 하이브리드) 비교 + Checkpoint 3 선택.
2. [ ] 대표 폼 적용 범위 확정.
3. [ ] 구현(Do) 후 검증.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-15 | Initial draft (Plan) | jygong |
