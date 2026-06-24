---
template: design
version: 1.0
feature: bd-bdopn-list-m01
date: 2026-06-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-bdopn-list-m01 Design Document

> 개찰목록(MUI-BD-08-M01, `BdopnListPage`) 설계. Plan: `docs/01-plan/features/bd-bdopn-list-m01.plan.md`.
> 핵심: 입찰공고 통합목록(`BidPbancIntgListPage`)과 동일 조립, **카드 정보행만 설계서대로 2행(공고일자·개찰일시)**, 신규 컴포넌트/시트 0.

---

## 1. 화면 정의 (설계서 MUI-BD-08-M01)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-BD-08-M01 |
| 화면명(한글) | 개찰목록 |
| 화면명(영문) | BdopnListPage |
| 경로(설계서) | `src/ui/biz/bd/bdopnList/BdopnListPage.tsx` |
| 정의 | 개찰일시가 도래한 이후 개찰 처리 및 결과를 확인하기 위한 통합 목록조회 화면 |
| breadcrumb | 홈 > 개찰목록 |
| 라우트 | `bd/opbid` |

---

## 2. 레이아웃 (위 → 아래)

```
BdopnListPage (데이터/검색/페이징/카드클릭 상태·핸들러 소유)
├── Infobox(업무도움, full-bleed)                         (기존 재사용)
├── SectionTitle(검색조건, blue)                          (기존 재사용)
├── SearchCondition  공고명/공고번호 칩 + 검색어 + 필터버튼   (기존 재사용)
├── ListSectionHeader  총 N건 + page size                 (기존 재사용)
├── CardList(items) → Card × N                            (기존 재사용)
│     └── Card: 뱃지3 + 공고번호 + 공고명 + [공고일자·개찰일시]
├── 더보기 Button(secondary)                              (기존 재사용)
├── FloatingActionButton(맨위로, #app-scroll)            (기존 재사용)
└── SearchFilter(상세필터 풀팝업, 개찰 schema)            (기존 재사용)
```

신규 컴포넌트 없음. `SearchFilter` 셸이 소유한 공통 바텀시트(발주기관/지역/면허/품목/생산자)는 기구현 — 추가 제작 없음.

---

## 3. 카드 사양 (설계서 slide144 기준 — 입찰공고와 정보행만 다름)

| 슬롯 | 내용 | 항목명 |
|------|------|--------|
| badges | 공고상태 / 업무구분 / 입찰방식 | `pbancStasNm` / `taskSeNm` / `bidMthdNm` |
| subtitle | `입찰공고번호 {번호}` | `bidPbancNo` |
| title | 공고명(2줄 말줄임) | `bidPbancNm` |
| rows[0] | 공고일자 | `pbancDt` |
| rows[1] | 개찰일시 | `opbidDt` |

> 입찰공고 목록은 4행(+입찰참가신청/입찰서제출 마감일시)이나, 개찰목록은 설계서 Layout 대로 **2행**(사용자 확정).

---

## 4. 상세필터 schema (개찰목록 MUI-BD-08-M02 = 입찰공고 필터 MUI-BD-01-M02)

설계서 개찰 검색필터(slide145)가 "입찰 공고와 동일한 검색 필터"라고 명시 → `BidPbancIntgListPage` 의 `BID_FILTER_SCHEMA` 와 **항목·라벨·placeholder·옵션을 그대로 일치**시킨다. 개찰 고유 차이는 **일자 토글뿐**(개찰/공고 → 개찰/협상). key 는 입찰공고 필터와 동일.

| 섹션 | 필드 (입찰공고 필터와 동일) |
|------|------|
| 업무구분 | `taskSeNm` checkbox(전체/물품/용역/공사/국외, selectAll) |
| 일자 설정 | `dateType` segment(**개찰 `opbid`/협상 `ngtn`**, 기본 개찰) + `date` dateRange(1/3/6개월·기간검색) |
| 검색어 | `bidPbancNm`(입찰건명) · **`bidNoType` segment(공고번호/통합참조)** + `bidNo`(번호 입력) · `prdctNm`(품명) · `deptNm`(발주기관, dept 시트) · `lcnsNm`(면허정보, license 시트) · `regionNm`(지역, region 시트) |
| 구분 설정 | `bidSe`(입찰구분) · `pbancSe`(공고구분) · `prgrsStas`(진행상태) · `fnc`(기능) · `bidMdm`(입찰매체) · `bidForm`(입찰형태) · `ctrtMthd`(계약방법) · `bidWinMthd`(낙찰방법) — **8종** |
| 가격 설정 | `estPrice` priceRange(추정가격, 0~1억, step 100만) |
| 신기술여부 | `newTech` radio(예/아니오, 기본 아니오) |

> 이전 버전(항목설명 dmt 단독)의 분리된 번호입력(통합참조/판단공사/G2B공고)·품목명(item)·입찰결과·협상진행상태·낙찰자결정방법은 **제거** — 설계서 개찰 화면(slide145)이 입찰공고와 동일한 UI 라서.
> selectionField → 셸 내장 검색시트: 발주기관(`dept`)·면허(`license`)·지역(`region`) — 모두 기구현, 신규 시트 없음.

---

## 5. 라우트 (router.tsx)

```tsx
const BdopnListPage = lazy(() =>
  import('@/ui/biz/bd/bdopnList/BdopnListPage').then((m) => ({ default: m.BdopnListPage })),
)
// ...
{
  path: 'bd/opbid',
  element: <BdopnListPage />,
  errorElement: <ErrorPage />,
  handle: {
    header: { variant: 'sub', util: 'search', title: '개찰목록' },
    scrollReset: true,
    showBottomNav: true,   // 입찰공고 목록(peer)과 동일
  },
},
```

---

## 6. API 경계 스텁

| 동작 | 스텁 | 추후 |
|------|------|------|
| 목록 조회 | 목업 `MOCK_BDOPN_LIST` | `bdService.getBdopnList(req)` |
| 빠른검색 | `appliedSearch` 로컬 필터 | 서버 검색 |
| 더보기/pageSize | 목업 슬라이싱 | 서버 페이징 |
| 카드 클릭 | `console.log` + 주석 | 입찰결과상세(MUI-BD-09-M01) 라우팅 |

---

## 7. Definition of Done

- [ ] 카드 2행(공고일자·개찰일시) · 뱃지3 · 설계서 항목명
- [ ] 신규 컴포넌트/시트 0
- [ ] 라우트 lazy + errorElement + handle
- [ ] lint 0 error · build 성공
