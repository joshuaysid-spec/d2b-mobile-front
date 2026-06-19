---
template: plan
feature: intg-search-m09
date: 2026-06-19
author: jygong
project: d2b-mobile-front
status: Draft
---

# intg-search-m09 (통합검색) Planning Document

> **Summary**: 통합검색(MUI-MS-01-M09) 화면 — 헤더 `util='search'` 에서 여는 FullPopup 오버레이. 진입 시 검색창 autoFocus + 최근 검색어/자주 찾는 서비스 → 검색어 입력 시 자동완성(토글 ON/OFF)·관련 서비스. 실제 검색 결과 목록(M10)은 범위 외.

## Executive Summary

| Perspective | Content |
|---|---|
| **Problem** | 헤더 통합검색(`onSearch`) 버튼이 미연결. 앱 전역 검색 진입 화면 부재 — 최근검색어·자주찾는서비스·자동완성 없음. |
| **Solution** | `/guide` 기존 공통(FullPopup·InputBox·Button·TagList·Empty·Switch·NavigationItemList) 조립. 최근검색어·자주찾는서비스·자동완성은 **데이터 배열**로 구동. 헤더 통합검색 → AppLayout 이 오버레이 open(M12 MenuPage 와 동일 패턴). |
| **Function/UX** | 진입=autoFocus + 최근검색어(또는 빈상태) + 자주찾는서비스. 입력 시=자동완성(검색어 하이라이트, 최대 6) 또는 자동완성 OFF 안내 + 관련 서비스. |
| **Core Value** | 전역 검색 단일 진입점. 신규 공통 컴포넌트 0, 기존 조립. |

## Context Anchor

| Key | Value |
|---|---|
| **WHY** | 통합검색 화면 부재 + 헤더 onSearch 미연결 |
| **WHO** | 모바일 웹앱 사용자(2뎁스 목록·상세 등에서 통합검색 진입) |
| **RISK** | 검색/자동완성 API 미정 → 목업 배열 + console 스텁으로 경계. 상태 3분기 누락 |
| **SUCCESS** | 3개 상태(검색어 없음 / 입력+자동완성ON / 입력+자동완성OFF) 렌더 + autoFocus + lint/build |
| **SCOPE** | M09 화면 1개(오버레이). 실제 검색 결과 목록(M10, IntgSrch_Rslt)·라우팅은 미정(스텁) |

## 1. Scope

### In
- [ ] FullPopup 오버레이로 통합검색 구현(헤더 `onSearch` → open). title="통합검색" + 기본 닫기.
- [ ] 진입 시 검색 영역 autoFocus(가상 키패드 활성).
- [ ] Hero 문구: "국방전자조달시스템, 이제 한 곳에서 찾아보세요."
- [ ] 검색 행: InputBox + 검색 버튼(secondary, icon, Search) — MenuPage 검색행과 동일. 검색어 있을 때 초기화(X) 버튼.
- [ ] 최근 검색어: TagList(closable) 최대 10개 + 개별삭제 + 전체삭제. 이력 없으면 Empty("최근 검색어가 없습니다.").
- [ ] 자주 찾는 서비스: 최대 10개(2열, 좌 1~5 / 우 6~10), 상위 3위 파랑 강조.
- [ ] 자동완성: 검색어 포함 메뉴명 최대 6개, 검색어 하이라이트. 토글 ON/OFF(Switch).
  - ON·결과 있음 → 자동완성 목록. ON·결과 없음 → "검색 결과가 없습니다." Empty.
  - OFF → 안내 Empty("자동완성 기능이 꺼져 있습니다. 보다 빠른 검색을 위해 자동완성 기능을 켜주세요").
- [ ] 관련 서비스: 검색어에 따라 NavigationItemList(chevron + onClick).
- [ ] 데이터 = 파일 내 목업 상수. 핸들러 = `console.log` + `// 추후 API: cmService.searchAll` 경계 주석.

### Out
- 실제 검색 결과 목록 화면(MUI-MS-01-M10 / IntgSrch_Rslt) — 별도 사이클.
- 검색/자동완성/최근검색어 영속(서버·로컬스토리지) — 목업 메모리 상태만.
- 자주 찾는 서비스·관련 서비스의 실제 라우팅(링크 미정 → 스텁).
- 전체메뉴(M12) 등 헤더 부가 액션.

## 2. Requirements

| ID | 요구 | 우선 |
|---|---|---|
| FR-01 | FullPopup 오버레이(헤더 onSearch → open, AppLayout 소유) + autoFocus | High |
| FR-02 | 상태 분기: ① 검색어 없음 ② 입력+자동완성ON ③ 입력+자동완성OFF | High |
| FR-03 | 최근 검색어 TagList(최대 10) + 개별/전체 삭제 + 빈상태 Empty | High |
| FR-04 | 자주 찾는 서비스(2열, 상위 3 강조, 최대 10) — 데이터 구동 | High |
| FR-05 | 자동완성 목록(최대 6, 검색어 하이라이트) + Switch 토글 ON/OFF | High |
| FR-06 | 관련 서비스 NavigationItemList(검색어 따라 표시) | Medium |
| FR-07 | 초기화(X) 버튼(검색어 있을 때) | Medium |
| FR-08 | 신규 공통 컴포넌트 0(기존 base/composites/feedback 재사용) | High |

## 3. Success Criteria

- [ ] 3개 상태 모두 정상 렌더(검색어 입력/삭제·토글 ON/OFF 로 분기 전환).
- [ ] autoFocus + 최근검색어 삭제(개별/전체) + 자동완성 하이라이트 동작.
- [ ] 모든 동작은 console.log 스텁 또는 상태 토글로 확인.
- [ ] `npm run lint && npm run build` 통과.

## 4. Risks

| Risk | 대응 |
|---|---|
| 검색/자동완성 API 미정 | 목업 배열 + console 스텁, 실제 검색=`cmService.searchAll` 경계 주석 |
| 오버레이 vs 라우트 혼동 | 자체 FullPopup header(닫기) 있어 글로벌 Header 와 충돌 → 오버레이(M12 와 동일) |
| 자동완성 하이라이트 시 XSS | 텍스트 분할 렌더(`dangerouslySetInnerHTML` 미사용) |
| 상태 3분기 누락 | 검색어 유무 × 토글 ON/OFF 매트릭스로 분기 명시 |

## 5. Architecture

- 위치: `src/ui/biz/cm/intgSrch/IntgSrchPage.tsx`(공통 cm). 목업 상수·핸들러는 페이지 소유.
- 컨테이너: `FullPopup`(open/onOpenChange, title="통합검색"). AppLayout 이 open 상태 소유 + Header `onSearch` 연결(M12 MenuPage 와 동일 오버레이 패턴):
  ```tsx
  const [searchOpen, setSearchOpen] = useState(false)
  // Header onSearch={() => setSearchOpen(true)}
  // <IntgSrchPage open={searchOpen} onOpenChange={setSearchOpen} />
  ```
- 재사용: 검색행=InputBox + Button(secondary/icon/Search) · 최근검색어=TagList(closable) · 빈/안내=Empty(info) · 자동완성토글=Switch · 관련서비스=NavigationItemList. 섹션 헤딩·자주찾는서비스 그리드·자동완성 행은 페이지 로컬 마크업.

## Next

1. `/pdca design intg-search-m09` — 컴포넌트 매핑·상태머신 상세.
2. 구현 + 검증(lint/build).
