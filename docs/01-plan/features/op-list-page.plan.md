---
template: plan
version: 1.3
feature: op-list-page
date: 2026-06-02
author: joshuaysid-spec
project: d2b-mobile-front
project-version: 0.1.0
---

# op-list-page Planning Document

> **Summary**: 조달계획 통합목록(MUI-OP-01-M01) — 기존 OpListPage(검색필터 트리거만 있는 빈 페이지)를 검색조건 인라인 영역 + 카드 리스트 + 페이징(더보기/page size) 으로 확장.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: joshuaysid-spec
> **Date**: 2026-06-02
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 기존 `OpListPage` 는 [검색필터] 트리거만 있는 빈 목록 페이지 — 실제 조달계획 목록(검색조건·카드 리스트·페이징)이 없다. |
| **Solution** | 재사용 가능한 표현 컴포넌트(기존 `Card` 재사용 + 신규 `Infobox`/`SearchCondition`/`ListSectionHeader`/`CardList`)를 조합해 목록 페이지를 구성. 데이터·페이징·더보기·카드클릭은 **페이지가 소유**. |
| **Function/UX Effect** | 사용자가 조달계획 목록을 카드로 훑고, 인라인 검색조건/필터로 좁히고, 더보기로 추가 로드, 카드 클릭으로 상세 진입. |
| **Core Value** | 디자인(Figma) 1:1 + 컴포넌트 재사용으로 다른 목록 페이지에도 쓰일 표현 컴포넌트 자산 확보. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 빈 목록 페이지를 실제 조달계획 통합목록으로 완성 — 검색조건·카드리스트·페이징 부재 해소 |
| **WHO** | 조달계획을 조회·탐색하는 모바일(웹뷰) 사용자 |
| **RISK** | 기존 `Card`/`Badge` 재사용이 Figma 카드와 미세 불일치 가능 · 신규 상세 라우트가 lazy/errorElement 규칙 누락 |
| **SUCCESS** | Figma 1:1 · lint 0 err · build 성공 · 컴포넌트 가이드 등록 · 페이징/카드클릭 핸들러 동작(console.log/라우팅) |
| **SCOPE** | ① 컴포넌트(Infobox·SearchCondition·ListSectionHeader·CardList) → ② OpListPage 확장(업무도움+목업) → ③ 더보기/pageSize 스텁 → ④ 카드클릭 빈 상세 라우트 |

---

## 1. Overview

### 1.1 Purpose

조달계획 통합목록 화면(Figma MUI-OP-01-M01, node 9300-36815)을 구현한다. 기존 `src/ui/biz/op/OpListPage.tsx`(검색필터 풀팝업 트리거만 존재)를 확장해 **검색조건 인라인 영역 + 총건수/페이지크기 헤더 + 카드 리스트 + 더보기**를 채운다.

### 1.2 Background

- 검색필터 풀팝업(`search-filter` feature)은 이미 구현됨 — 본 페이지의 필터 아이콘 버튼이 그것을 연다.
- 이번 사이클은 그 위에 **목록 본문(UI)** 을 올린다. 백엔드는 미연동 — 데이터는 **페이지 내 목업 배열**, 더보기/페이지크기는 **API 경계 스텁(빈 함수 + console.log)**.
- 컴포넌트 우선 제작 후 페이지에서 조합한다. 리스트 아이템은 기존 `Card` 재사용(디자인 1:1 확인됨).

### 1.3 Related Documents

- Figma: MUI-OP-01-M01 조달계획 통합목록 (node `9300-36815`) — 하위: 검색조건 `9300-36826`, 리스트 `9300-36847`, 리스트섹션 `9300-36835`, 업무도움 `9300-36822`
- Figma 재사용 컴포넌트: `m_Infobox` (node `9300-29649`) — 업무도움/안내사항 정보박스
- 관련 기능: `docs/02-design/features/search-filter.design.md` (필터 풀팝업 — 기구현)
- 코드: `src/ui/biz/op/OpListPage.tsx`, `src/ui/common/composites/Card.tsx`

---

## 2. Scope

### 2.1 In Scope

- [ ] `Infobox` 컴포넌트 (신규, **재사용** — Figma `m_Infobox` node 9300-29649) — ⓘ아이콘 + 타이틀 + 본문(불릿 리스트 + 링크버튼), variant: collapsible(opened/closed, 우측 chevron) · static(default, 항상 펼침)
- [ ] 페이지 **업무도움 영역**(Figma `m_help_disclosure` node 9300-36822) = `Infobox`(collapsible, 기본 closed) 인스턴스로 구성
- [ ] `SearchCondition` 컴포넌트 (신규) — 검색대상 체크칩(조달명/판단번호) + 필터 아이콘 버튼(→기존 풀팝업) + 검색어 InputBox + 검색 버튼
- [ ] `ListSectionHeader` 컴포넌트 (신규) — "총 N건" + page size select("10개 ∨")
- [ ] `CardList` 컴포넌트 (신규, 얇은 래퍼) — `items` 받아 기존 `Card` 렌더 + 빈상태/gap. **데이터 미소유**
- [ ] `OpListPage` 확장 — 위 컴포넌트 조합 + **목업 카드 배열(페이지 내 상수)** 렌더 + 맨위로 FAB
- [ ] 더보기 버튼 + page size 변경 → **빈 스텁 핸들러(console.log 로 변경 변수 확인)** (실제 API/슬라이싱 X)
- [ ] 카드 클릭 → **빈 상세 페이지 라우트**로 이동(router lazy + errorElement 규칙 준수)
- [ ] 컴포넌트 가이드(`ComponentGuidePage`) 등록 + 디자인 문서 동기화

### 2.2 Out of Scope

- 실제 백엔드 API 연동(services/queries) — 경계 주석/스텁만
- page size·더보기의 실제 데이터 슬라이싱/페치 (API 연동 시 구현)
- 상세 페이지 실제 콘텐츠 (이번엔 빈 화면)
- 업무도움 본문 텍스트의 실제 도메인 문구 확정 (디자인 더미 텍스트로 구현, 실문구는 추후)
- 무한 스크롤

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-00 | `Infobox`(m_Infobox 9300-29649) 신규 재사용 컴포넌트 — ⓘ+타이틀+본문(불릿+링크), collapsible(opened/closed)/static variant. 페이지 업무도움 영역에 사용(기본 closed) | High | Pending |
| FR-01 | `Card` 재사용으로 조달 카드(badges 2 + 판단번호 + 제목 + 4행) 렌더 | High | Pending |
| FR-02 | `CardList` 가 items 배열을 Card 로 매핑(빈상태 처리), 데이터는 페이지 소유 | High | Pending |
| FR-03 | `SearchCondition` — 체크칩 다중선택 + 필터버튼(풀팝업 open) + 검색어 + 검색버튼 | High | Pending |
| FR-04 | `ListSectionHeader` — 총건수 표시 + page size select | Medium | Pending |
| FR-05 | 더보기 버튼 클릭 → 스텁 핸들러 실행 + `console.log`(다음 페이지 변수) | Medium | Pending |
| FR-06 | page size 변경 → 스텁 핸들러 실행 + `console.log`(새 size) | Medium | Pending |
| FR-07 | 카드 클릭 → 빈 상세 페이지 라우트로 이동 | Medium | Pending |
| FR-08 | 맨 위로(FAB) 노출/동작 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Design Fidelity | Figma MUI-OP-01-M01 1:1 (토큰/간격/타이포) | 스크린샷 대조 |
| Code Quality | lint 0 error · build 성공 | `npm run lint` / `npm run build` |
| Convention | raw 직접 import 0 · common(base/composites)만 · 아이콘은 Icon · 토큰 하드코딩 0 | 코드 리뷰 |
| Accessibility | 카드 클릭 button 시맨틱 · 포커스 링 | 수동 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] FR-00~08 구현
- [ ] 신규 컴포넌트 4종(Infobox·SearchCondition·ListSectionHeader·CardList) `ComponentGuidePage` 등록(import + NAV + 데모)
- [ ] 디자인 문서(`op-list-page.design.md`)와 코드 동기화
- [ ] 더보기/pageSize 핸들러 console.log 동작 · 카드클릭 라우팅 동작

### 4.2 Quality Criteria

- [ ] `npm run lint` 0 error
- [ ] `npm run build` 성공 (폰트 121개 복사 정상)
- [ ] Figma 1:1 (육안)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 기존 `Card` 슬롯이 조달 카드와 미세 불일치(badge 색/inforow 정렬) | Medium | Medium | Card 슬롯 props 로 충분히 커버되는지 design 단계서 1:1 확인, 부족 시 className 오버라이드 |
| 신규 상세 라우트가 lazy/errorElement 규칙 누락 | Medium | Low | CLAUDE.md 코드스플리팅 규칙(§lazy + errorElement) 준수 |
| 더보기/pageSize 를 실제 구현으로 오해 | Low | Medium | 스텁(빈 함수+console.log)임을 design/do 에 명시 |
| 검색조건 인라인 vs 풀팝업 책임 혼동 | Low | Low | 인라인=빠른검색, 필터아이콘=풀팝업(기구현) 으로 역할 분리 명시 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `OpListPage.tsx` | Page | 빈 목록 → 검색조건+헤더+카드리스트+더보기+FAB 추가(기존 검색필터 트리거 유지) |
| `router.tsx` | Route | 상세 페이지 라우트 신규(lazy + errorElement) |
| `ComponentGuidePage.tsx` | Dev | 신규 컴포넌트 4종 데모 등록 |
| 신규 컴포넌트 파일 | Component | `Infobox`(재사용), `SearchCondition`, `ListSectionHeader`, `CardList`, 빈 상세 페이지 |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| `OpListPage` | READ(route) | `router.tsx` → `/op` 등 기존 라우트 | None (확장만, 기존 트리거 유지) |
| `Card` | READ | (현재 ComponentGuidePage 데모) | None (props 추가 없이 재사용) |
| `SearchFilter` | OPEN | OpListPage 의 필터 아이콘 | None (기존 연동 유지) |

### 6.3 Verification

- [ ] 기존 OpListPage 검색필터 트리거 동작 유지 확인
- [ ] `Card` 재사용이 타 사용처(가이드)에 영향 없음
- [ ] 신규 라우트가 기존 라우팅/AppLayout 에 영향 없음

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Selected |
|-------|:--------:|
| Starter | ☐ |
| **Dynamic** (React+Vite 모바일 웹앱, feature 기반) | ☑ |
| Enterprise | ☐ |

### 7.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Framework | React 18 + Vite | 프로젝트 표준 |
| State Management | 페이지 로컬 `useState` (데이터/페이징/검색 페이지 소유) | 이번 사이클 목업+스텁 — 전역/서버상태 불필요. API 연동 시 React Query 로 승격 |
| 데이터 소스 | **페이지 내 목업 배열** | 백엔드 미연동 — search-filter 와 동일 패턴(경계 주석) |
| 페이징/더보기 | **빈 스텁 핸들러 + console.log** | API 호출 경계(최초 데이터 슬라이싱이 아니라 재페치 전제) — 동작 배선만 확인 |
| 리스트 아이템 | 기존 `Card` 재사용 | Figma 카드와 슬롯 1:1 일치 |
| 리스트 렌더 | 페이지가 `CardList` 에 items 전달(map) | 데이터는 페이지 소유, CardList 는 표현만 |
| Styling | Tailwind v4 (@theme) + KRDS 토큰 + cva | 프로젝트 표준 |

### 7.3 컴포넌트 분해 (확정)

```
OpListPage (페이지 — 데이터/검색/페이징/더보기/카드클릭 상태·핸들러 소유)
├── PageTitle(조달계획 통합목록)                         (기존)
├── Infobox(업무도움, collapsible/closed)                (신규·재사용 m_Infobox)
├── SearchCondition   검색대상칩 + 필터버튼 + 검색어 + 검색  (신규)
├── ListSectionHeader 총 N건 + page size select          (신규)
├── CardList(items)   → Card × N (+ 빈상태/gap)           (신규 얇은 래퍼)
│     └── Card                                            (기존 재사용)
├── 더보기 버튼(ButtonGroup) → onLoadMore 스텁            (기존 + 페이지 소유)
└── 맨위로 FAB                                            (신규 or 기존 FAB)
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `CLAUDE.md` 코딩/아이콘/컴포넌트 컨벤션 존재
- [x] `docs/frontend-architecture.md` (폴더/네이밍/의존성 방향)
- [x] ESLint / Prettier / TypeScript 구성 존재

### 8.2 Conventions to Verify

| Category | Current State | To Apply |
|----------|---------------|----------|
| Naming | exists | base/composites=PascalCase, biz 페이지=XxxPage |
| Folder | exists | 컴포넌트=common/composites, 페이지=biz/op |
| 아이콘 | exists | `Icon` 컴포넌트(Material Symbols) — lucide/@mui 금지 |
| 라우팅 | exists | `React.lazy` + `errorElement` (CLAUDE.md 코드스플리팅) |

### 8.3 Environment Variables Needed

해당 없음(목업, API 미연동).

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`op-list-page.design.md`) — 3가지 설계안 + 선택, 컴포넌트 props 스펙, 라우트
2. [ ] 컴포넌트 우선 구현(SearchCondition / ListSectionHeader / CardList) → 가이드 등록
3. [ ] OpListPage 확장 + 목업 + 스텁 핸들러 + 카드클릭 라우트

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-02 | Initial draft — 4 clarifications 반영(목업 인페이지·페이징 스텁+console.log·카드클릭 빈 상세) | joshuaysid-spec |
| 0.2 | 2026-06-02 | 업무도움 영역 추가 + `Infobox`(m_Infobox 9300-29649) 재사용 컴포넌트 신규(FR-00) | joshuaysid-spec |
