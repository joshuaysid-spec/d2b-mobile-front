---
template: plan
version: 1.0
feature: bd-bdopn-list-m01
date: 2026-06-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-bdopn-list-m01 Planning Document

> **Summary**: 개찰목록(MUI-BD-08-M01, `BdopnListPage`) — 입찰 도메인의 신규 통합 목록조회 화면. 입찰공고 통합목록(`BidPbancIntgListPage`)을 레퍼런스로 검색조건 + 카드 리스트 + 페이징 + 상세필터 풀팝업을 조립한다. **신규 공통 컴포넌트·바텀시트 없음(전부 기존 재사용).**
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: jhlim
> **Date**: 2026-06-24
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 개찰일시가 도래해 개찰 처리·결과 확인이 필요한 공고건을 모아 보는 화면(개찰목록)이 없다. |
| **Solution** | 기존 목록 화면 자산(`Infobox`/`SearchCondition`/`ListSectionHeader`/`CardList`/`SearchFilter`)을 조합해 `BdopnListPage` 신규 생성. 카드 내용은 설계서 MUI-BD-08-M01 기준(공고일자·개찰일시 2행). 데이터/검색/페이징은 페이지 소유(목업 + API 경계 스텁). |
| **Function/UX Effect** | 빠른검색(공고명/공고번호) + 상세필터(풀팝업)로 좁히고, 더보기로 추가 로드, 카드 클릭으로 상세 진입(스텁). |
| **Core Value** | 신규 컴포넌트 0 — 기존 공통 재사용만으로 도메인 목록 1종 추가. 설계서 ↔ 코드 1:1 추적(화면 ID 기반 파일명·항목명). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 개찰목록(MUI-BD-08-M01) 부재 해소 — 개찰 결과 확인 진입점 마련 |
| **WHO** | 업체 신청 공고건 중 개찰 결과를 확인하려는 모바일(웹뷰) 사용자 |
| **RISK** | 카드 행 구성이 설계서(2행)와 Figma(입찰공고 4행) 상이 → 사용자 확정으로 해소(설계서 2행 채택) |
| **SUCCESS** | 설계서 1:1 · lint 0 err · build 성공 · 신규 컴포넌트/시트 0 · 라우트 lazy+errorElement 준수 |
| **SCOPE** | ① `BdopnItem` 타입 → ② `BdopnListPage`(검색조건+카드+더보기+FAB+필터풀팝업) → ③ 라우트 등록 |

---

## 1. Overview

### 1.1 Purpose

개찰목록 화면(설계서 02입찰 7.1 / MUI-BD-08-M01, 영문 `BdopnListPage`)을 구현한다. "개찰일시가 도래한 이후 개찰 처리 및 결과를 확인하기 위한 통합 목록조회 화면"(설계서 정의).

### 1.2 Background

- 레퍼런스: 입찰공고 통합목록 `BidPbancIntgListPage`(MUI-BD-01-M01) — 구성·상태·페이징 패턴 동일.
- 검색 상세필터는 공통 `SearchFilter` 셸 재사용. 셸이 소유한 공통 바텀시트(발주기관/지역/면허/품목/생산자)는 **이미 제작됨** → 신규 시트 불필요.
- 백엔드 미연동 — 데이터는 페이지 내 목업, 핸들러는 API 경계 스텁(`console.log` + `// 추후 API: bdService.xxx`).

### 1.3 Related Documents

- 설계서: `docs/spec/...02입찰...pptx` slide135(7.1 화면목록), slide144(MUI-BD-08-M01 Layout/데이터영역)
- Figma: node `9527-43539`(프레임명 `MUI-BD-01-M01_입찰공고` — 입찰공고 4행 카드. 개찰목록 카드는 설계서 2행 기준으로 맞춤)
- 코드 레퍼런스: `src/ui/biz/bd/bidPbancIntgList/BidPbancIntgListPage.tsx`
- 공통: `docs/02-design/features/search-filter.design.md`(필터 풀팝업·검색시트 — 기구현)

---

## 2. Scope

### 2.1 In Scope

- [ ] `BdopnItem` 도메인 타입(`src/types/bd.ts`) — 개찰목록 카드 1건(설계서 항목명 기준)
- [ ] `BdopnListPage`(`src/ui/biz/bd/bdopnList/BdopnListPage.tsx`) — 업무도움(Infobox) + 검색조건(SearchCondition) + 목록헤더(ListSectionHeader) + 카드리스트(CardList) + 더보기 + 맨위로 FAB + 상세필터(SearchFilter)
- [ ] 카드 = 뱃지(공고상태/업무구분/입찰방식) + 공고번호(subtitle) + 공고명(title) + **공고일자·개찰일시 2행**(설계서 MUI-BD-08-M01)
- [ ] 상세필터 schema(개찰목록용) — 입찰공고 필터와 동일 구성, 일자유형 기본 '개찰'
- [ ] `router.tsx` 라우트 등록(`bd/opbid`, lazy + errorElement + handle)

### 2.2 Out of Scope

- 신규 공통 컴포넌트·신규 variant·신규 바텀시트(전부 기존 재사용 — 만들지 않음)
- 실제 백엔드 API 연동(services/queries) — 경계 스텁만
- 카드 클릭 연결 상세화면(입찰결과상세 MUI-BD-09-M01) 구현 — **스텁(console.log)** 만(사용자 확정)
- 더보기/pageSize 의 실제 서버 재페치 — 목업 슬라이싱만

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `BdopnItem` 타입 — 설계서 항목명(bidPbancNo/bidPbancNm/pbancStasNm/taskSeNm/bidMthdNm/pbancDt/opbidDt) | High | Pending |
| FR-02 | 카드 = 뱃지3 + 공고번호 + 공고명(2줄 말줄임) + 공고일자/개찰일시 2행 | High | Pending |
| FR-03 | `SearchCondition` — 빠른검색(공고명/공고번호 칩 + 검색어 + 필터버튼) | High | Pending |
| FR-04 | 상세필터 풀팝업(`SearchFilter`) — 개찰목록 schema(일자유형 기본 개찰) | High | Pending |
| FR-05 | `ListSectionHeader` — 총건수 + page size | Medium | Pending |
| FR-06 | 더보기 → 목업 슬라이싱(page+1) + console.log | Medium | Pending |
| FR-07 | 카드 클릭 → 스텁(console.log + `// 추후: 입찰결과상세 MUI-BD-09-M01`) | Medium | Pending |
| FR-08 | 맨 위로 FAB(#app-scroll) | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Design Fidelity | 설계서 MUI-BD-08-M01 카드/검색 1:1 | slide144 대조 |
| Code Quality | lint 0 error · build 성공 | `npm run lint` / `npm run build` |
| Convention | raw 직접 import 0 · common(base/composites)만 · Icon 컴포넌트 · 토큰 하드코딩 0 · 화면ID 파일명/항목명 | 코드 리뷰 |
| Reuse | 신규 컴포넌트/시트 0 | 변경 파일 검토 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] FR-01~08 구현
- [ ] 신규 공통 컴포넌트/바텀시트 0 (재사용만)
- [ ] 라우트 lazy + errorElement + handle 등록
- [ ] design 문서(`bd-bdopn-list-m01.design.md`)와 코드 동기화

### 4.2 Quality Criteria

- [ ] `npm run lint` 0 error
- [ ] `npm run build` 성공
- [ ] 설계서 카드 행(공고일자·개찰일시) 일치

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 설계서(2행) vs Figma(4행) 카드 불일치 | Medium | High | 사용자 확정 — 설계서 2행 채택(공고일자·개찰일시) |
| 상세필터 schema 가 입찰공고와 중복 | Low | High | 목록 페이지가 자기 schema 소유하는 기존 컨벤션 유지(BidPbancIntgList 와 동일) — 인라인 정의 |
| 카드클릭 대상 미구현 | Low | High | 스텁(console.log) — 상세 구현 시 라우팅 연결 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `src/types/bd.ts` | Type | `BdopnItem` 인터페이스 추가 |
| `src/ui/biz/bd/bdopnList/BdopnListPage.tsx` | Page | 신규 |
| `src/router.tsx` | Route | `bd/opbid` 라우트 신규(lazy + errorElement) |

### 6.2 Current Consumers

| Resource | Operation | Impact |
|----------|-----------|--------|
| `SearchFilter`/`SearchCondition`/`CardList`/`Infobox`/`ListSectionHeader` | READ(reuse) | None (props 추가 없음) |
| 기존 bd 라우트(`bd`, `bd/:id`) | — | None (신규 정적 경로 추가만) |

---

## 7. Architecture Considerations

### 7.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| 페이지 분리 vs 공유 | 입찰공고와 **별도 페이지** | 같은 레이아웃이나 도메인 의미·카드 행·기본필터 상이. 마크업은 각 페이지 소유(래퍼 셸 안 씌움) |
| 상세필터 schema | 페이지 인라인 정의 | 기존 컨벤션(각 목록 페이지가 schema 소유) 일치 |
| 데이터/페이징 | 페이지 로컬 useState + 목업 + 스텁 | 백엔드 미연동 |
| 카드 행 | 설계서 2행(공고일자·개찰일시) | MUI-BD-08-M01 Layout |

---

## 9. Next Steps

1. [ ] Design 문서(`bd-bdopn-list-m01.design.md`) — 카드/schema/라우트 스펙
2. [ ] `BdopnItem` 타입 + `BdopnListPage` 구현
3. [ ] 라우트 등록 + lint/build 검증

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-24 | Initial draft — 2 clarifications 반영(카드 2행·카드클릭 스텁) | jhlim |
