---
template: plan
version: 1.3
feature: home-m07
date: 2026-06-05
author: joshuaysid-spec
project: d2b-mobile-front
project-version: 0.1.0
---

# home-m07 Planning Document

> **Summary**: 앱 메인 홈(MUI-MS-01-M07, 로그인 전) — 현재 임시 링크 허브인 `HomePage.tsx` 를 Figma(node 7077-85163) 1:1 의 메인 홈(빠른조달검색·주요서비스·공지사항·배너·처음방문안내·푸터)으로 전면 교체.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: joshuaysid-spec
> **Date**: 2026-06-05
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | `HomePage.tsx` 가 4개 링크만 있는 임시 허브 — 실제 메인 홈(빠른검색·서비스 바로가기·공지·배너·안내)이 없다. |
| **Solution** | Header/BottomNav/Footer/TabList/Image/FAB 등 기존 공통을 재사용하고, `biz/cm/home` 도메인 조립 컴포넌트(빠른조달검색·서비스그리드·공지섹션·배너·처음방문안내) + 공통 `CarouselIndicator` 1종만 신규 제작해 페이지를 구성. |
| **Function/UX Effect** | 사용자가 홈에서 공고를 빠르게 검색(공고명/공고번호 OR + 필터), 주요 서비스로 바로 이동, 최근 공지 3건 확인, 배너·이용안내 열람. |
| **Core Value** | Figma 1:1 + 기존 컴포넌트 최대 재사용. 캐러셀 인디케이터를 공통화해 다른 화면에서도 재사용 가능한 자산 확보. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 임시 링크 허브를 실제 앱 메인 홈(M07)으로 완성 — 빠른검색·서비스·공지·배너·안내 부재 해소 |
| **WHO** | 앱 기동 후 진입하는 모바일(웹뷰) 사용자 (로그인 전 상태 우선) |
| **RISK** | 실제 이미지 에셋(로고·서비스아이콘·배너) 미제공 → placeholder · 검색/이동 동작은 목업 스텁 |
| **SUCCESS** | Figma 1:1 · lint 0 err · build 성공 · 컴포넌트 가이드 등록 · 검색/필터/이동 핸들러 동작(console.log/라우팅) |
| **SCOPE** | ① 공통 `CarouselIndicator` → ② biz/cm/home 조립 컴포넌트 5종 → ③ `HomePage` 전면 교체(목업+스텁) |

---

## 1. Overview

### 1.1 Purpose

앱 메인 홈 화면(Figma MUI-MS-01-M07, node `7077-85163`, 로그인 전)을 구현한다. 현재 `src/ui/biz/cm/home/HomePage.tsx`(임시 링크 허브)를 **빠른조달검색 + 주요 서비스 바로가기 + 공지사항 + 배너 + 처음 방문 안내 + 푸터** 로 전면 교체한다.

### 1.2 Background

- Header(메인·로그인 전)·BottomNav(홈/알림/고객센터/마이페이지)는 **`AppLayout` 셸이 이미 렌더** → HomePage 는 **콘텐츠만** 담당.
- Footer 는 기존 `Footer` 컴포넌트 그대로 콘텐츠 하단에 배치.
- 백엔드 미연동 — 데이터는 **페이지 내 목업 배열**, 검색/필터/카드이동은 **API/라우팅 경계 스텁(console.log + 주석)**.
- 캐러셀은 **목업(정적 1페이지 + 인디케이터 시각만)**. 실제 슬라이드는 추후.
- 이미지 에셋(빠른조달검색 로고·서비스 아이콘 6개·배너 통이미지)은 미제공 → **전부 placeholder 박스**(src 주입 가능 구조). 배너는 통이미지 하나.

### 1.3 Related Documents

- Figma: MUI-MS-01-M07 메인 홈(로그인 전) — node `7077-85163`. 하위: 빠른조달검색 `7077:85210`, 주요서비스 `7077:85249`, 공지사항 `7077:85348`, 배너(알림판) `7077:85383`, 처음방문 `7077:85457`, 푸터 `7077:85504`
- 설계서: `D2BA-AP-3CD-0601.사용자인터페이스설계서-00공통-모바일_v0.6.pptx` (slide 20 — M07 메인 홈, slide 21 — 이벤트)
- 코드: `src/ui/biz/cm/home/HomePage.tsx`, `src/ui/common/composites/{Header,Footer,BottomNav,TabList,FloatingActionButton}.tsx`, `src/ui/biz/cm/search/SearchFilter.tsx`

---

## 2. Scope

### 2.1 In Scope

- [ ] `CarouselIndicator` 컴포넌트 (신규 **공통 composite**) — `현재 / 전체` 숫자 + 이전/다음 화살표. 주요서비스·배너 두 곳 재사용. (목업: page=1 고정, 핸들러 optional)
- [ ] `QuickProcurementSearch` (신규, biz/cm/home) — 로고 placeholder + OR칩(공고명/G2B공고번호, 단일선택 check pill) + 검색필터 버튼(설정값 있으면 파란 ON·없으면 OFF) + 검색입력(선택칩 따라 placeholder 변경) + 검색 버튼
- [ ] `ServiceShortcutGrid` (신규, biz/cm/home) — 아이콘(placeholder 박스) + 라벨 그리드 3열 + `CarouselIndicator`(1/2). 항목: 조달/입찰공고/개찰/계약/실적증명서/국내외 조달원 등록증
- [ ] `HomeNoticeSection` (신규, biz/cm/home) — 섹션타이틀 + 더보기 + `TabList`(방위사업청/수요부대/일반) + 공지 카드 3개(제목+날짜)
- [ ] `HomeBanner` (신규, biz/cm/home) — 배너 **통이미지 하나**(Image, placeholder) + `CarouselIndicator`(1/3)
- [ ] `FirstVisitGuide` (신규, biz/cm/home) — 섹션타이틀 + 가이드 행 3개(아이콘+제목+설명+자세히보기 링크): 사전준비안내/국내조달안내/국외조달안내
- [ ] `HomePage` 전면 교체 — 위 컴포넌트 조합 + `Footer` + 맨위로 FAB(onTop) + **목업 상수**
- [ ] 검색/필터/서비스이동/공지이동/자세히보기 → **스텁 핸들러(console.log + `// 추후: …` 주석)** 또는 기존 라우트 이동
- [ ] 검색필터 버튼 → 기존 `SearchFilter` 풀팝업 연동(스키마 최소), 적용값 유무로 ON/OFF 토글
- [ ] 컴포넌트 가이드(`ComponentGuidePage`) 등록(공통 `CarouselIndicator` 1종) + 디자인 문서 동기화

### 2.2 Out of Scope

- 로그인 후(isLoggedIn=true) 메인 홈 변형 — 이번엔 로그인 전만
- 실제 백엔드 API 연동(services/queries) — 경계 주석/스텁만
- 실제 캐러셀 슬라이드/스와이프 (목업 정적 1페이지)
- 실제 이미지 에셋 (placeholder 박스, 추후 src 교체)
- 통합검색·전체메뉴·로그인 동작 (Header 소관, 본 사이클 외)
- 빠른조달검색의 실제 입찰공고 화면 이동·검색어 전달 (스텁)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-00 | `CarouselIndicator`(공통) — 현재/전체 + 이전/다음 화살표 | High | Pending |
| FR-00b | `Carousel`(공통) — scroll-snap 스와이프 + CarouselIndicator 통합. 서비스·배너에서 실제 슬라이드(터치/화살표) | High | Pending |
| FR-01 | `QuickProcurementSearch` — OR칩(공고명/공고번호 단일선택) + 필터버튼(ON/OFF) + 검색입력 + 검색버튼 | High | Pending |
| FR-02 | 검색필터 버튼 → 기존 `SearchFilter` 풀팝업 open, 적용값 있으면 아이콘 파란 ON·없으면 OFF | High | Pending |
| FR-03 | `ServiceShortcutGrid` — 아이콘(placeholder)+라벨 3열 그리드 + CarouselIndicator(1/2), 클릭 시 이동 스텁/라우트 | High | Pending |
| FR-04 | `HomeNoticeSection` — TabList(3탭) + 공지 카드 3개(제목+날짜) + 더보기, 탭/카드/더보기 클릭 스텁 | High | Pending |
| FR-05 | `HomeBanner` — 통이미지 1개(placeholder) + CarouselIndicator(1/3) | Medium | Pending |
| FR-06 | `FirstVisitGuide` — 가이드 행 3개(아이콘+제목+설명+자세히보기 링크), 클릭 스텁 | Medium | Pending |
| FR-07 | `HomePage` 가 위 + 기존 Footer + 맨위로 FAB(onTop) 조합 | High | Pending |
| FR-08 | 모든 동작은 console.log 스텁 또는 기존 라우트 이동(입찰공고/공지 등) | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Design Fidelity | Figma MUI-MS-01-M07 1:1 (토큰/간격/타이포/색) | 스크린샷 대조 |
| Code Quality | lint 0 error · build 성공 | `npm run lint` / `npm run build` |
| Convention | raw 직접 import 0 · common(base/composites)만 · 아이콘은 Icon · 토큰 하드코딩 0 · key=안정 ID | 코드 리뷰 |
| Accessibility | 칩/버튼/탭 시맨틱 · 포커스 링 · 이미지 alt | 수동 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] FR-00~08 구현
- [ ] 공통 신규 `CarouselIndicator` `ComponentGuidePage` 등록(import + NAV + 데모)
- [ ] 디자인 문서(`home-m07.design.md`)와 코드 동기화
- [ ] 검색/필터/이동/더보기 핸들러 동작(console.log/라우팅), 필터 ON/OFF 토글 동작

### 4.2 Quality Criteria

- [ ] `npm run lint` 0 error
- [ ] `npm run build` 성공
- [ ] Figma 1:1 (육안)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 이미지 에셋 부재로 placeholder 가 디자인과 시각 차이 | Low | High | placeholder 를 디자인 영역 크기/비율로 맞춤, src prop 으로 추후 무손실 교체 |
| 캐러셀을 실제 슬라이드로 오해 | Low | Medium | design/do 에 목업(정적)임 명시, 인디케이터는 시각/스텁 |
| 검색필터 ON/OFF 판정 로직 모호 | Medium | Medium | "defaultValue 와 다른 값이 적용되면 ON" 으로 정의(설계서 명시) |
| biz/cm/home 조립 컴포넌트가 과도하게 잘게 쪼개짐 | Low | Medium | 화면 전용 조립물은 biz/cm/home 에만, 공통화는 CarouselIndicator 1종으로 한정 |
| HomePage 교체로 기존 라우트 영향 | Low | Low | export 시그니처 유지(named export `HomePage`), router 변경 불필요 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `HomePage.tsx` | Page | 임시 링크 허브 → 메인 홈 전면 교체(named export 유지) |
| `CarouselIndicator.tsx` | Component (공통) | 신규 common/composites |
| `biz/cm/home/*` | Component | 신규 5종(QuickProcurementSearch·ServiceShortcutGrid·HomeNoticeSection·HomeBanner·FirstVisitGuide) |
| `ComponentGuidePage.tsx` | Dev | 공통 `CarouselIndicator` 데모 등록 |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| `HomePage` | READ(route) | `router.tsx` → `/`(index) | None (named export 유지, 내용만 교체) |
| `AppLayout` | RENDER | Header/BottomNav 셸 | None (홈은 콘텐츠만, 셸 그대로) |
| `SearchFilter` | OPEN | QuickProcurementSearch 필터버튼 | None (기존 연동 패턴 재사용) |

### 6.3 Verification

- [ ] 기존 `/`(홈) 라우트·셸(Header/BottomNav) 정상
- [ ] Footer·TabList·FAB 재사용이 타 사용처에 영향 없음
- [ ] 신규 공통 CarouselIndicator 가 가이드에 정상 등록

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
| State Management | 페이지/컴포넌트 로컬 `useState` | 목업+스텁 — 전역/서버상태 불필요. API 시 React Query 승격 |
| 데이터 소스 | **페이지 내 목업 배열** | 백엔드 미연동 — op-list-page 와 동일 패턴 |
| 캐러셀 | **공통 CarouselIndicator + 목업 정적** | 반복 컴포넌트(서비스+배너) 공통화, 슬라이드는 추후 |
| 이미지 | **placeholder 박스 + src prop** | 에셋 미제공, 추후 무손실 교체 |
| OR칩 | **신규 도메인 칩(디자인 그대로)** | check아이콘 pill — SegmentedControl 과 시각 상이 |
| 필터 ON/OFF | 적용값 ≠ defaultValue → ON | 설계서 rule 5 |
| Styling | Tailwind v4(@theme) + KRDS 토큰 + cva | 프로젝트 표준 |

### 7.3 컴포넌트 분해 (확정)

```
HomePage (페이지 — 검색/필터/탭/이동 상태·핸들러 + 목업 소유)
├── QuickProcurementSearch   OR칩 + 필터버튼(→SearchFilter) + 검색입력 + 검색   (신규 biz/cm/home)
├── ServiceShortcutGrid      아이콘그리드 3열 → Carousel(스와이프, 1/2)           (신규 biz/cm/home)
│     └── Carousel → CarouselIndicator                                            (신규 공통)
├── HomeNoticeSection        섹션타이틀+더보기 + TabList(3) + 공지카드 3          (신규 biz/cm/home)
│     └── TabList                                                                 (기존)
├── HomeBanner               통이미지(Image) → Carousel(스와이프, 1/3)            (신규 biz/cm/home)
│     └── Carousel → (Image × N) + CarouselIndicator                              (신규 공통)
├── FirstVisitGuide          섹션타이틀 + 가이드행 3                               (신규 biz/cm/home)
├── Footer                                                                        (기존)
└── 맨위로 FAB (onTop, #app-scroll)                                               (기존)
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
| Naming | exists | composites=PascalCase, biz=XxxPage/도메인조립명, key=안정 ID |
| Folder | exists | 공통=common/composites, 화면전용=biz/cm/home |
| 아이콘 | exists | `Icon`(Material Symbols) — lucide/@mui 금지 |
| 라우팅 | exists | 변경 없음(홈 index 유지) |

### 8.3 Environment Variables Needed

해당 없음(목업, API 미연동).

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`home-m07.design.md`) — 3가지 설계안 + 선택, 컴포넌트 props 스펙
2. [ ] 공통 `CarouselIndicator` 구현 → 가이드 등록
3. [ ] biz/cm/home 조립 컴포넌트 5종 구현
4. [ ] `HomePage` 전면 교체 + 목업 + 스텁 + Footer + FAB

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-05 | Initial draft — 4 clarifications 반영(캐러셀 공통화·목업 정적·전부 placeholder·신규 OR칩) | joshuaysid-spec |
