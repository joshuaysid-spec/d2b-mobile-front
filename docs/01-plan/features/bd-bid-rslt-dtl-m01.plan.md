---
template: plan
version: 1.0
feature: bd-bid-rslt-dtl-m01
date: 2026-06-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-bid-rslt-dtl-m01 Planning Document

> **Summary**: 입찰결과상세(개찰상세, MUI-BD-09-M01~M04) — 개찰목록 카드 클릭 진입. 조달/입찰공고 상세와 동일한 4뎁스 패턴(요약+스텝+탭4+탭콘텐츠). 탭: 일반정보·품목정보·입찰결과·협상결과. 신규 공통 컴포넌트 없음(전부 기존 재사용).
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-06-24 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 개찰목록 카드 클릭 후 개찰·낙찰 처리 결과(입찰결과)를 확인할 상세 화면이 없다. |
| **Solution** | `BidRsltDtlPage`(shell+일반정보) + 탭콘텐츠 3종(`BidRsltDtlListPage` 품목정보 · `BidRsltDtl` 입찰결과 · `BidRsltDtl2` 협상결과). `useCollapsibleHeader`+`SummaryInfo`+`StepBar`+`TabList`+`Accordion`+`Table`+`FileDownloadList` 조립. |
| **Function/UX Effect** | 요약정보 축소 sticky, 탭 전환, 일반/담당자/첨부 표, 품목·입찰결과·협상결과 목록(더보기 10개씩) 조회. |
| **Core Value** | 신규 컴포넌트 0 — 기존 상세 화면 자산 재사용. 설계서(MUI-BD-09) 항목 1:1. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 개찰 결과 확인 진입점(입찰결과상세) 부재 해소 |
| **WHO** | 개찰목록에서 자사 입찰 결과를 확인하려는 업체 사용자 |
| **RISK** | 일반정보 28필드의 라벨↔값 매핑이 설계서 텍스트 추출상 일부 모호 → 라벨은 설계서 순서 그대로, 값은 목업(추후 보정) |
| **SUCCESS** | 설계서 MUI-BD-09-M01~M04 1:1 · lint 0 err · build 성공 · 신규 컴포넌트 0 · 개찰목록 카드→상세 연결 |
| **SCOPE** | ① 4 파일(bidRsltDtl) → ② 라우트 bd/result/:id → ③ 개찰목록 카드 연결 |

---

## 1. Overview

### 1.1 Purpose
입찰결과상세(개찰상세, 설계서 02입찰 7.1 / MUI-BD-09-M01~M04)를 구현한다. "개찰 및 낙찰 처리 후 입찰결과를 조회"(설계서 정의).

### 1.2 Background
- 레퍼런스: 입찰공고 상세 `BidPbancDtlPage`(요약+스텝+탭+탭콘텐츠) = 조달계획 상세와 동일 패턴.
- 백엔드 미연동 — 데이터 목업, 핸들러 API 경계 스텁(`console.log` + `// 추후 API: bdService.xxx`).
- 상세화면이라 **검색필터/검색바텀시트 없음**(사용자 확정).

### 1.3 Related Documents
- 설계서: slide135(화면목록), slide150~156(M01~M04 layout/데이터영역)
- Figma: node `9527-43847`(상세 — 프레임명 입찰공고상세지만 탭/콘텐츠는 입찰결과상세 기준 = 설계서 따름)
- 코드 레퍼런스: `src/ui/biz/bd/bidPbancDtl/BidPbancDtlPage.tsx` + `BidPbancDtl*.tsx`

---

## 2. Scope

### 2.1 In Scope
- [ ] `bidRsltDtl/BidRsltDtlPage.tsx` — shell(요약+스텝+탭4) + **일반정보 탭(M01)** (일반정보 표 + 담당자정보 표 + 첨부서류)
- [ ] `bidRsltDtl/BidRsltDtlListPage.tsx` — **품목정보 탭(M02)** (품목 표 + 더보기)
- [ ] `bidRsltDtl/BidRsltDtl.tsx` — **입찰결과 탭(M03)** (자사 입찰결과 표 + 첨부서류/서약서 보기 + 더보기)
- [ ] `bidRsltDtl/BidRsltDtl2.tsx` — **협상결과 탭(M04)** (협상결과 표 + 더보기)
- [ ] SummaryInfo actions: 출력(SummaryUtilButton) · 출력 확인(AlertModal) · 공지사항(설계서 표기) — 입찰공고 상세 동작 재사용
- [ ] 라우트 `bd/result/:id` (lazy + handle) + `routes.ts` 상수
- [ ] 개찰목록(BdopnListPage) 카드 클릭 → `/bd/result/:id` 연결

### 2.2 Out of Scope
- 신규 공통 컴포넌트/variant/바텀시트(전부 재사용)
- 검색필터(상세화면 — 없음)
- 실제 API 연동(services/queries) · 첨부/서약서 실제 뷰어 · OZ 출력 실연계 — 스텁
- 입찰결과/협상결과의 실제 페이징 서버 재페치 — 목업 슬라이싱

---

## 3. Requirements (FR)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | shell: useCollapsibleHeader + SummaryInfo(출력) + StepBar(입찰) + TabList(일반/품목/입찰결과/협상결과) | High |
| FR-02 | 일반정보 탭: 일반정보 표(설계서 28필드) + 담당자정보 표 + 첨부서류(FileDownloadList) | High |
| FR-03 | 품목정보 탭: 품목 표(항목번호/재고번호/품명/규격/단위/수량/단가/금액) + 더보기 | High |
| FR-04 | 입찰결과 탭: 자사 결과 표(순번/차수/업체코드/사업자번호/업체명/대표자/결과/첨부서류[보기]/서약서[보기]) + 더보기 | High |
| FR-05 | 협상결과 탭: 협상 표(차수/업체코드/업체명/대표자/견적단가/낙찰률/결과) + 더보기 | High |
| FR-06 | 출력 → 출력 확인 AlertModal (스텁) | Medium |
| FR-07 | 라우트 등록 + 개찰목록 카드 클릭 연결 | High |

### 3.2 NFR
- Design Fidelity: 설계서 MUI-BD-09 1:1(라벨/표/탭) · Code: lint 0 err · build OK · Reuse: 신규 컴포넌트 0 · raw 직접 import 0

---

## 4. Success Criteria
- [ ] FR-01~07 · lint 0 error · build 성공 · 설계서 재확인(요청 6) 후 차이 수정 · 개찰목록→상세 동작

---

## 5. Risks
| Risk | Mitigation |
|------|-----------|
| 일반정보 라벨↔값 매핑 모호 | 라벨=설계서 순서 그대로, 값=목업. 제작 후 설계서 재대조(요청 6)로 보정 |
| 다중컬럼 목록의 모바일 표현 | 항목당 세로 key-value Table 블록(기존 품목명세서 패턴) + 더보기 |
| Figma 프레임명이 입찰공고상세로 표기 | 콘텐츠는 설계서(slide150~156) 기준으로 구현 |

---

## 6. Architecture Decisions
| Decision | Selected | Rationale |
|----------|----------|-----------|
| 파일 구조 | bidRsltDtl/ 폴더 + 화면목록 영문명 4파일 | 사용자 지시(요청 4) |
| 일반정보 위치 | BidRsltDtlPage 내(=M01 화면명이 BidRsltDtlPage) | 화면목록 영문명 |
| 데이터 표현 | TableRow[] 목업(라벨/값) | 기존 상세탭(BidPbancDtl) 컨벤션 — 설계서에 영문 항목명 미제공 |
| 상세 분리 | 입찰공고 상세와 별도 페이지, 로직(useCollapsibleHeader) 공유 | 도메인/내용 상이 |

---

## 9. Next Steps
1. [ ] Design 문서(`bd-bid-rslt-dtl-m01.design.md`)
2. [ ] 4 컴포넌트 + 라우트 + 개찰목록 연결
3. [ ] 설계서 재대조(요청 6) → 차이 수정 → lint/build

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-24 | Initial — 2 clarifications(검색필터 없음·카드연결 /bd/result/:id) 반영 | jhlim |
