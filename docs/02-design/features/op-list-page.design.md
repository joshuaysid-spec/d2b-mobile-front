---
template: design
version: 1.3
feature: op-list-page
date: 2026-06-02
author: joshuaysid-spec
project: d2b-mobile-front
project-version: 0.1.0
---

# op-list-page Design Document

> **Summary**: 조달계획 통합목록(MUI-OP-01-M01) — 기존 OpListPage 확장. 재사용 컴포넌트(Infobox·SearchCondition·ListSectionHeader·CardList) + 기존 Card 조합, 데이터/페이징 스텁은 페이지 소유.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: joshuaysid-spec · **Date**: 2026-06-02 · **Status**: Draft
> **Planning Doc**: [op-list-page.plan.md](../../01-plan/features/op-list-page.plan.md)

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 빈 목록 페이지 → 실제 조달계획 통합목록 완성 (검색조건·카드리스트·페이징 부재 해소) |
| **WHO** | 조달계획을 조회·탐색하는 모바일(웹뷰) 사용자 |
| **RISK** | 기존 Card/Badge 재사용 미세 불일치 · 신규 상세 라우트 lazy/errorElement 누락 |
| **SUCCESS** | Figma 1:1 · lint 0 · build 성공 · 가이드 등록 · 핸들러 동작(console.log/라우팅) |
| **SCOPE** | ① 컴포넌트(Infobox·SearchCondition·ListSectionHeader·CardList) → ② OpListPage 확장(업무도움+목업) → ③ 더보기/pageSize 스텁 → ④ 카드클릭 빈 상세 |

---

## 1. Overview

### 1.1 Design Goals

- Figma MUI-OP-01-M01 1:1 구현 (KRDS 토큰/간격/타이포).
- 재사용 표현 컴포넌트 4종 자산화 — 다른 목록 페이지에서도 사용 가능하도록 도메인 무관 props.
- 데이터·페이징·라우팅은 페이지가 소유 → 컴포넌트는 순수 표현(테스트·재사용 용이).

### 1.2 Design Principles

- **표현/데이터 분리**: 컴포넌트는 props 만 받고 상태·데이터·핸들러는 페이지 소유.
- **재사용 우선**: 기존 `Card` 재사용, 신규는 도메인 무관 props 로.
- **API 경계 명시**: 더보기/pageSize 는 스텁(빈 함수 + console.log) — 실제 페치는 추후 경계.
- **컨벤션 준수**: raw 직접 import 금지, 아이콘은 `Icon`(Material Symbols), 토큰 하드코딩 금지.

---

## 2. Architecture Options

### 2.0 Architecture Comparison

| Criteria | Option A: Minimal | Option B: Clean | Option C: Pragmatic |
|----------|:-:|:-:|:-:|
| **Approach** | Infobox·CardList만 분리, 검색조건/헤더 인라인 | 4종 + ProcurementCard 래퍼 + useOpList 훅 + mock 모듈 | 재사용 4종 분리, 데이터/핸들러 페이지 |
| **New Files** | ~3 | ~9 | ~5 |
| **Modified Files** | ~3 | ~3 | ~4 |
| **Complexity** | Low | High | Medium |
| **Maintainability** | Medium | High | High |
| **Effort** | Low | High(목업엔 과함) | Medium |
| **Recommendation** | 빠른 구현 | API 연동 확정 시 | **Default choice** |

**Selected**: **Option C — Pragmatic** — **Rationale**: Plan 합의 분해와 일치. 재사용 컴포넌트 4종은 분리하되, 목업·페이징 스텁·카드클릭은 페이지 소유. ProcurementCard 래퍼/서비스 레이어는 카드 매핑이 단순해 현 사이클 불필요(API 연동 시 도입).

### 2.1 Component Diagram

```
src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx  (페이지 — 상태·목업·핸들러 소유)
│
├── PageTitle "조달계획 통합목록"                    (common/base)        [기존]
├── Infobox  업무도움(collapsible, closed)           (common/composites)  [신규·재사용]
├── SearchCondition  대상칩+필터버튼+검색어+검색       (common/composites)  [신규]
│     └─ CheckboxGroup · Icon(필터) · InputBox · ButtonGroup  [기존 재사용]
├── ListSectionHeader  "총 N건" + page size select    (common/composites)  [신규]
│     └─ SelectBox  [기존 재사용]
├── CardList(items)                                  (common/composites)  [신규 얇은 래퍼]
│     └─ Card × N  (badges/subtitle/title/rows/onClick)  [기존 재사용]
├── ButtonGroup "더보기"                              (common/composites)  [기존]
└── FloatingActionButton 맨위로                        (common/composites)  [기존]

라우팅: router.tsx → /op/:id (lazy) → PrcmPlanDtlPage(prcmPlanDtl)  [신규]
```

### 2.2 Data Flow

```
[목업 OP_ITEMS(페이지 const)] → CardList(items) → Card × N
사용자 액션 →
  더보기 클릭     → handleLoadMore()  → console.log(nextPage)   (API 경계 스텁)
  page size 변경  → handlePageSize(n)  → console.log(size)       (API 경계 스텁)
  검색 클릭       → handleSearch()      → console.log(keyword,targets) (스텁)
  필터 아이콘     → setFilterOpen(true) → 기존 SearchFilter 풀팝업
  카드 클릭       → navigate(`/op/${id}`) → PrcmPlanDtlPage
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| PrcmPlanIntgListPage | Infobox, SearchCondition, ListSectionHeader, CardList, SearchFilter, FAB | 페이지 조합 |
| CardList | Card | 아이템 렌더 |
| SearchCondition | CheckboxGroup, Icon, InputBox, ButtonGroup | 검색 입력 |
| ListSectionHeader | SelectBox | page size |
| Infobox | Icon | ⓘ + chevron |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// src/types/op.ts 에 추가 — 조달계획 목록 카드 1건(목업/추후 API 응답 매핑)
export interface OpPlanItem {
  id: string            // 카드 식별자(상세 라우팅 키)
  taskSe: string        // 업무구분 뱃지 (예: '물품')
  ctrtMthdNm: string    // 계약방법 뱃지 (예: '수의계약')  ※ rows 의 계약방법과 별개 표기 가능
  prcmNo: string        // 판단번호 (예: '6000A')  — subtitle(주요 정보)
  title: string         // 카드 제목 (예: "'26년 K5방독면")
  orderPrnmntYm: string // 발주예정월 (예: '2026-03')
  orderDeptNm: string   // 발주기관 (예: '화력총괄계약팀')
  ctrtMthd: string      // 계약방법 (예: '총액제')
  budgetAmt: number     // 예산금액 (예: 11616000) — 표시 시 천단위 콤마 + ' 원'
}
```

### 3.2 카드 ↔ Card props 매핑

| OpPlanItem | Card prop | 비고 |
|------------|-----------|------|
| taskSe, ctrtMthdNm | `badges` | `<Badge>` 2개 |
| prcmNo | `subtitle` | "판단번호 6000A" (주요 정보) |
| title | `title` | 19 Bold |
| orderPrnmntYm/orderDeptNm/ctrtMthd/budgetAmt | `rows` | 4행 label/value (예산금액 = `11,616,000 원`) |
| id | `onClick` | `() => navigate('/op/'+id)` |

### 3.3 Database Schema

N/A — 백엔드 미연동. 목업 배열(`OP_ITEMS: OpPlanItem[]`)을 페이지 const 로 둔다.

---

## 4. API Specification

> **N/A (백엔드 미연동)** — UI/상태/타입만. 더보기·page size·검색은 **API 경계 스텁**.

```typescript
// 더보기/페이지크기/검색 = 추후 API 호출 경계. 현재는 빈 함수 + console.log.
// services/op.ts (추후): opService.getList({ page, pageSize, keyword, targets, ...filter })
// queries/op.ts  (추후): useOpList(params)
const handleLoadMore = () => { console.log('[OpList] loadMore → page', nextPage) }
const handlePageSize = (n: number) => { console.log('[OpList] pageSize →', n) }
const handleSearch   = () => { console.log('[OpList] search', { keyword, targets }) }
```

---

## 5. UI/UX Design

### 5.1 Screen Layout

```
┌────────────────────────────────────────┐
│ Header(AppLayout)                       │
│ PageTitle  조달계획관리         [업무구분∨]│
│ ⓘ 업무도움                          ∨   │ ← Infobox(collapsible, closed)
├────────────────────────────────────────┤
│ 검색조건                                 │ ← SectionTitle
│  [✓조달명] [✓판단번호]            [필터] │ ← SearchCondition (CheckboxGroup + 필터버튼)
│  [ 내용을 입력하세요.            ]        │   InputBox
│  [           🔍 검색            ]        │   ButtonGroup(검색)
├────────────────────────────────────────┤
│ 총 100건                       [10개 ∨] │ ← ListSectionHeader
│ ┌────────────────────────────────────┐ │
│ │ [물품][수의계약]                    │ │ ← Card × N (CardList)
│ │ 판단번호 6000A                      │ │
│ │ '26년 K5방독면                      │ │
│ │ 발주예정월            2026-03       │ │
│ │ 발주기관       화력총괄계약팀        │ │
│ │ 계약방법              총액제        │ │
│ │ 예산금액        11,616,000 원       │ │
│ └────────────────────────────────────┘ │
│            [ 더보기 (10/100건) ]         │ ← ButtonGroup, 스텁
│                                  [⬆]    │ ← FAB 맨위로
└────────────────────────────────────────┘
```

### 5.2 User Flow

```
목록 진입 → (업무도움 펼쳐보기) → 검색조건 입력/필터 → 검색(스텁 log)
         → 카드 훑기 → 더보기(스텁 log, 누적은 API 시) → 카드 클릭 → 빈 상세
```

### 5.3 Component List

| Component | Location | Responsibility | New/Reuse |
|-----------|----------|----------------|-----------|
| `Infobox` | `src/ui/common/composites/Infobox.tsx` | ⓘ+타이틀+본문(불릿/링크), collapsible/static | **New** (m_Infobox 9300-29649) |
| `SearchCondition` | `src/ui/common/composites/SearchCondition.tsx` | 대상칩+필터버튼+검색어+검색 (props/콜백) | **New** |
| `ListSectionHeader` | `src/ui/common/composites/ListSectionHeader.tsx` | 총건수 + page size select | **New** |
| `CardList` | `src/ui/common/composites/CardList.tsx` | items→Card 매핑 + 빈/로딩/gap | **New** |
| `Card` | `src/ui/common/composites/Card.tsx` | 카드 아이템 | Reuse |
| `PageTitle` | `src/ui/common/base/PageTitle.tsx` | m_page title_24(24px Bold). 페이지 셸(full-bleed 플러시)을 직접 구성 — 과거 OpPageLayout 래퍼는 인라인 후 제거됨 | Reuse |
| `PrcmPlanIntgListPage` | `src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx` | PageTitle 인라인 셸 + 상태·목업·핸들러 | Modify |
| `PrcmPlanDtlPage` | `src/ui/biz/op/prcmPlanDtl/PrcmPlanDtlPage.tsx` | 상세 페이지(요약·스텝·탭) | **New** |

#### 컴포넌트 props 스펙

```typescript
// Infobox — collapsible 정보박스 (Notice 와 별개: 접기 + ⓘ + 불릿 본문)
interface InfoboxProps {
  title: React.ReactNode
  icon?: IconName                 // 기본 'Info'
  items?: React.ReactNode[]       // 불릿 본문(각 항목, 링크 포함 가능)
  children?: React.ReactNode      // items 대신 자유 본문
  collapsible?: boolean           // 기본 true. false=static(항상 펼침, chevron 없음)
  defaultOpen?: boolean           // 기본 false(=closed). collapsible 일 때 초기 상태
  open?: boolean                  // controlled
  onOpenChange?: (open: boolean) => void
}

// SearchCondition — 빠른 검색 영역 (도메인 무관)
interface SearchConditionProps {
  targets: { value: string; label: React.ReactNode }[]  // 검색대상 칩(조달명/판단번호)
  selectedTargets: string[]
  onTargetsChange: (v: string[]) => void
  keyword: string
  onKeywordChange: (v: string) => void
  onFilterClick: () => void       // 필터 아이콘 → 풀팝업 open
  onSearch: () => void
  placeholder?: string            // 기본 '내용을 입력하세요.'
}

// ListSectionHeader — 총건수 + page size
interface ListSectionHeaderProps {
  total: number                   // "총 {total}건"
  pageSize: number
  pageSizeOptions?: number[]      // 기본 [10, 20, 50]
  onPageSizeChange: (size: number) => void
  unit?: string                   // 기본 '건'
}

// CardList — items → Card (데이터 미소유)
interface CardListItem extends Omit<CardProps, 'className'> { id: string }
interface CardListProps {
  items: CardListItem[]
  loading?: boolean
  emptyText?: React.ReactNode     // 기본 '데이터가 없습니다.'
}
```

### 5.4 Page UI Checklist

> Gap Detector 가 항목별 검증. **모든** 필수 UI 요소 나열.

#### 조달계획 통합목록 (OpListPage)

- [ ] PageTitle: "조달계획관리" (m_page title_24, 24px Bold) (+ 업무구분 표시 영역 — 추후)
- [ ] Infobox: 업무도움 (ⓘ 아이콘 + "업무도움" 타이틀 + 우측 chevron, 기본 closed → 클릭 시 본문 불릿 펼침)
- [ ] SectionTitle: "검색조건"
- [ ] SearchCondition · CheckboxGroup: 검색대상 칩 2개(조달명/판단번호, 다중선택)
- [ ] SearchCondition · Button(icon): 필터 아이콘 → SearchFilter 풀팝업 open
- [ ] SearchCondition · InputBox: 검색어 (placeholder "내용을 입력하세요.")
- [ ] SearchCondition · Button: "검색" (primary, full-width) → handleSearch console.log
- [ ] ListSectionHeader: "총 100건" 텍스트
- [ ] ListSectionHeader · SelectBox: page size "10개"(옵션 10/20/50) → handlePageSize console.log
- [ ] CardList · Card(×N): badges(업무구분/계약방법) + subtitle(판단번호) + title(제목) + rows 4행(발주예정월/발주기관/계약방법/예산금액 — 금액 천단위 콤마+' 원')
- [ ] Card onClick → `/op/:id` 라우팅
- [ ] Button: "더보기 (n/total건)" → handleLoadMore console.log
- [ ] FloatingActionButton: 맨 위로(scroll to top)

#### 상세 (OpDetailPage)

- [ ] 빈 화면 (PageContainer + 타이틀 정도, 콘텐츠 추후)

---

## 6. Error Handling

| 상황 | 처리 |
|------|------|
| 목록 빈 배열 | CardList `emptyText` 플레이스홀더 |
| 로딩(추후 API) | CardList `loading` → 스켈레톤(이번엔 자리만) |
| 잘못된 상세 id / 청크 로드 실패 | 라우터 `errorElement`(ErrorPage) — CLAUDE.md 규칙 |
| 알 수 없는 page size | 옵션 외 값 무시(기본 유지) |

---

## 7. Security Considerations

- 해당 없음(목업 UI, 입력은 로컬 상태만). XSS: 사용자 입력은 텍스트 바인딩만(dangerouslySetInnerHTML 미사용).

---

## 8. Test Plan

> 백엔드 미연동 — L1(API) N/A. L2(UI) 중심, 이번 사이클은 수동 확인 + lint/build.

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L2: UI Action | 컴포넌트 렌더·핸들러 동작 | 수동 + 콘솔 확인 | Do |
| 정적 | lint/build/Figma 대조 | npm run lint/build | Do/Check |

### 8.3 L2: UI Action Test Scenarios

| # | Page | Action | Expected Result |
|---|------|--------|-----------------|
| 1 | OpListPage | 로드 | §5.4 체크리스트 요소 전부 렌더(목업 카드 N개) |
| 2 | OpListPage | 업무도움 헤더 클릭 | 본문 불릿 펼침/접힘 토글 |
| 3 | OpListPage | "검색" 클릭 | 콘솔 `[OpList] search {keyword,targets}` |
| 4 | OpListPage | 필터 아이콘 클릭 | SearchFilter 풀팝업 open |
| 5 | OpListPage | page size 변경 | 콘솔 `[OpList] pageSize → N` |
| 6 | OpListPage | "더보기" 클릭 | 콘솔 `[OpList] loadMore → page N` |
| 7 | OpListPage | 카드 클릭 | `/op/:id` 이동 → 빈 상세 렌더 |

### 8.5 Seed Data Requirements

| Entity | Min Count | Key Fields |
|--------|:---------:|-----------|
| OP_ITEMS(목업) | 10 | id, taskSe, ctrtMthdNm, prcmNo, title, orderPrnmntYm, orderDeptNm, ctrtMthd, budgetAmt |

---

## 9. Clean Architecture

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| Infobox / SearchCondition / ListSectionHeader / CardList | Presentation | `src/ui/common/composites/` |
| PrcmPlanIntgListPage / PrcmPlanDtlPage | Presentation | `src/ui/biz/op/prcmPlanIntgList/`, `prcmPlanDtl/` |
| OpPlanItem (type) | Domain | `src/types/op.ts` |
| 목업 OP_ITEMS | Presentation(페이지 const, 임시) | `PrcmPlanIntgListPage.tsx` (추후 services/infra 이관) |
| (추후) opService/useOpList | Application | `src/services/op.ts` / `src/queries/op.ts` |

> 의존성 방향: Presentation → Domain(types). Infrastructure(API) 는 이번 범위 외(스텁 경계).

---

## 10. Coding Convention Reference

> 기준: `CLAUDE.md` + `docs/frontend-architecture.md`

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| 컴포넌트 네이밍 | PascalCase, composites=재사용, biz=XxxPage |
| 파일 위치 | 재사용=common/composites, 페이지=biz/op |
| 아이콘 | `Icon`(Material Symbols) — lucide/@mui 금지 |
| 스타일 | Tailwind v4 + KRDS 토큰 + cva, 하드코딩 금지 |
| 라우팅 | `React.lazy` + `errorElement`(CLAUDE.md 코드스플리팅) |
| raw import | 금지 — base/composites 경유 |

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── ui/common/composites/
│   ├── Infobox.tsx            (신규)
│   ├── SearchCondition.tsx    (신규)
│   ├── ListSectionHeader.tsx  (신규)
│   └── CardList.tsx           (신규)
├── ui/biz/op/
│   ├── prcmPlanIntgList/PrcmPlanIntgListPage.tsx  (통합목록 — 확장)
│   └── prcmPlanDtl/PrcmPlanDtlPage.tsx            (상세)
├── types/op.ts                (수정 — OpPlanItem 추가)
├── router.tsx                 (수정 — /op/:id lazy + errorElement)
└── ui/dev/ComponentGuidePage.tsx (수정 — 4종 등록)
```

### 11.2 Implementation Order

1. [ ] `types/op.ts` — `OpPlanItem` 추가
2. [ ] `Infobox` (m_Infobox 9300-29649) → 가이드 등록
3. [ ] `SearchCondition` → 가이드 등록
4. [ ] `ListSectionHeader` → 가이드 등록
5. [ ] `CardList` → 가이드 등록
6. [ ] `OpDetailPage`(빈) + `router.tsx` 라우트(lazy+errorElement)
7. [ ] `OpListPage` 확장 — 목업 OP_ITEMS + 컴포넌트 조합 + 스텁 핸들러(console.log) + 카드클릭 navigate + FAB
8. [ ] lint/build + Figma 대조

### 11.3 Session Guide

#### Module Map

| Module | Scope Key | Description | Est. Turns |
|--------|-----------|-------------|:----------:|
| 컴포넌트 4종 + 타입 | `module-1` | types/op, Infobox·SearchCondition·ListSectionHeader·CardList + 가이드 등록 | 20-30 |
| 페이지 조합 | `module-2` | OpDetailPage+라우트, OpListPage 확장(목업·스텁·카드클릭·FAB) | 15-25 |

#### Recommended Session Plan

| Session | Phase | Scope | Turns |
|---------|-------|-------|:-----:|
| (현) | Plan + Design | 전체 | done |
| 다음 | Do | `--scope module-1` (컴포넌트) | 20-30 |
| 다음 | Do | `--scope module-2` (페이지) | 15-25 |
| 이후 | Check + Report | 전체 | 20-30 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-02 | Initial — Option C 선택, 컴포넌트 4종 props 스펙 + 페이지 조합 + 스텁 경계 | joshuaysid-spec |
