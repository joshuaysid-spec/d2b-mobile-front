---
template: design
version: 1.0
feature: intg-search-m09
date: 2026-06-19
author: jygong
project: d2b-mobile-front
project-version: 0.1.0
plan-ref: docs/01-plan/features/intg-search-m09.plan.md
---

# intg-search-m09 Design Document

> 통합검색(MUI-MS-01-M09, IntgSrch) 구현 설계. 헤더 `util='search'` 에서 여는 FullPopup 오버레이. Plan 의 상태 3분기를 컴포넌트 매핑·상태머신으로 확정. **신규 공통 컴포넌트 없음** — 기존 base/composites/feedback 조립.

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 헤더 통합검색(onSearch) 미연결 + 전역 검색 진입 화면 부재 |
| **WHO** | 2뎁스 목록·상세에서 통합검색 진입하는 모바일(웹뷰) 사용자 |
| **RISK** | 검색/자동완성 API 미정 → 목업+스텁 · 상태 3분기 누락 · 하이라이트 XSS |
| **SUCCESS** | 3상태 렌더 · autoFocus · lint/build OK · 핸들러 동작(console.log/상태토글) |
| **SCOPE** | FullPopup 오버레이 1개(IntgSrchPage). 검색 결과 목록(M10)·라우팅은 범위 외 |

---

## 1. Overview

설계서 `D2BA-AP-3CD-0601.사용자인터페이스설계서-00공통-모바일_v0.6.pptx` slide 24~25(페이지 메인 홈 > 통합검색) + Figma 4 node 기준. Header/BottomNav 는 `AppLayout` 셸 제공 → IntgSrchPage 는 **FullPopup 오버레이 콘텐츠**만 렌더(라우트 아님, M12 MenuPage 와 동일). 데이터=목업, 동작=스텁/상태토글.

- **출처 / Figma node**:
  - 설계서: slide 24~25 (통합검색)
  - 9304-77195 — 최근검색어(있음)
  - 9304-77324 — 최근검색어 없음(빈상태)
  - 9304-77443 — 자동완성 ON
  - 9304-77553 — 자동완성 OFF

## 2. Architecture Options (검토)

| Option | 요지 | 복잡도 | 유지보수 | 선택 |
|--------|------|:----:|:----:|:----:|
| A. 최소변경 | IntgSrchPage 한 파일에 모든 섹션·상태 인라인, 공통 미사용 | 낮음 | 낮음(중복·미일관) | ☐ |
| B. 클린 | 최근검색어/자주찾는서비스/자동완성을 각 신규 공통 composite 로 풀분해 | 높음 | 중간(과분해·단일사용) | ☐ |
| **C. 실용 균형** | 컨테이너·검색행·칩·빈상태·토글·관련서비스는 **기존 공통 재사용**, 화면 전용 마크업(섹션 헤딩·자주찾는서비스 그리드·자동완성 행)만 페이지 로컬 | 중간 | 높음 | ☑ |

> **선택: Option C.** CLAUDE.md "새 페이지 작성 절차"(`/guide` 기존 공통 조립 우선) + 메모리 `check-composites-before-creating`(신규 생성 전 중복 확인) + `bottomsheet-slot-composition`(전용 래퍼 금지, 페이지가 컨테이너 소유) 정합. 신규 공통 컴포넌트 0.

---

## 3. 컴포넌트 매핑 (전부 기존 재사용)

| 화면 요소 | 컴포넌트 | 경로 | New/Reuse | 비고 |
|---|---|---|:---:|---|
| 컨테이너 | `FullPopup` | `common/composites` | Reuse | title="통합검색", 기본 닫기. open/onOpenChange=AppLayout 소유 |
| 검색 입력 | `InputBox` | `common/base` | Reuse | autoFocus. 검색어 있을 때 초기화(X) |
| 검색 버튼 | `Button` | `common/base` | Reuse | variant=secondary, size=icon, `<Icon name="Search" />` — MenuPage 검색행 동일 |
| 최근 검색어 칩 | `TagList` | `common/composites` | Reuse | closable, onRemove(개별삭제). 최대 10 |
| 빈상태 / 안내 | `Empty` | `common/feedback` | Reuse | variant=info — 최근검색어 없음·자동완성OFF·검색결과 없음 |
| 자동완성 토글 | `Switch` | `common/base` | Reuse | label="자동완성" |
| 관련 서비스 | `NavigationItemList` | `common/composites` | Reuse | chevron + onClick |
| 섹션 헤딩 / 전체삭제 | (페이지 로컬 마크업) | — | Local | "최근 검색어" + 우측 "전체삭제" |
| 자주 찾는 서비스 그리드 | (페이지 로컬 마크업) | — | Local | 2열(좌 1~5 / 우 6~10), 상위 3 파랑 강조 |
| 자동완성 행(하이라이트) | (페이지 로컬 마크업) | — | Local | 검색어 부분 강조(텍스트 분할) |
| Hero 문구 | (페이지 로컬 마크업) | — | Local | "국방전자조달시스템, 이제 한 곳에서 찾아보세요." |
| 아이콘 | `Icon` | `common/base` | Reuse | Search/Close/ChevronRight 등 Material Symbols |

> **신규 공통 컴포넌트 없음.** 자주찾는서비스 그리드·자동완성 행·섹션 헤딩은 화면 전용이라 페이지 로컬(별도 atomic 분리 안 함 — Option C).

---

## 4. 상태 머신 (Plan 3분기)

검색어 유무(`keyword`) × 자동완성 토글(`autocompleteOn`) 로 본문 분기:

```
keyword === ''  ───────────────► [상태 ①] 최근검색어 + 자주찾는서비스
keyword !== '' & autocompleteOn ─► [상태 ②] 자동완성 목록 + 토글 + 관련서비스
keyword !== '' & !autocompleteOn ► [상태 ③] 자동완성 OFF 안내 + 토글 + 관련서비스
```

| 상태 | 조건 | 본문 구성 |
|---|---|---|
| ① 검색어 없음 | `keyword === ''` | 최근 검색어(TagList — 이력 있으면 칩 최대 10 + 개별/전체삭제 · 없으면 Empty "최근 검색어가 없습니다.") + 자주 찾는 서비스(2열, 상위 3 강조) |
| ② 입력·자동완성 ON | `keyword !== '' && autocompleteOn` | 자동완성 토글(Switch on) + 자동완성 목록(최대 6, 검색어 하이라이트 · 결과 없으면 Empty "검색 결과가 없습니다.") + 관련 서비스(NavigationItemList) |
| ③ 입력·자동완성 OFF | `keyword !== '' && !autocompleteOn` | 자동완성 토글(Switch off) + 안내 Empty("자동완성 기능이 꺼져 있습니다. 보다 빠른 검색을 위해 자동완성 기능을 켜주세요") + 관련 서비스 |

- **autoFocus**: FullPopup open 시 검색 InputBox 에 포커스 → 가상 키패드 활성(설계서 slide24).
- **초기화(X)**: `keyword !== ''` 일 때 입력 우측 X → `setKeyword('')` → 상태 ① 복귀.
- **전체삭제 / 개별삭제**: 최근검색어 전체 비우기 / TagList `onRemove(id)` 1건 제거 → 0건이면 Empty.
- **검색 실행**: 검색 버튼/Enter → `cmService.searchAll(keyword)`(스텁, 추후 M10 IntgSrch_Rslt 이동).

```
state: keyword, autocompleteOn, recentKeywords[], (파생) suggestions = mockMenus.filter(포함)
핸들러(스텁): onSearch / onClearKeyword / onRemoveRecent(id) / onClearAllRecent /
              onToggleAutocomplete / onPickSuggestion / onPickFreqService / onPickRelated
              → console.log + '// 추후 API: cmService.searchAll'
```

---

## 5. 레이아웃 구조

```
┌─ FullPopup  [ 통합검색            ✕ ]─┐   ← title + 닫기 (컨테이너)
│ ┌────────────────────────────────────┐ │
│ │ [ 검색어를 입력하세요.      ✕ ] [🔍]│ │ ← InputBox(autoFocus, X) + Button(secondary/icon)
│ └────────────────────────────────────┘ │
│  국방전자조달시스템,                     │ ← Hero (페이지 로컬)
│  이제 한 곳에서 찾아보세요.               │
├──────────────────────────────────────┤
│ [상태 ① keyword='']                    │
│  최근 검색어            전체삭제         │ ← 섹션 헤딩(로컬)
│  [방독면 ✕][K5 ✕][계약 ✕] …(≤10)       │ ← TagList(closable)  ／ 없으면 Empty
│                                        │
│  자주 찾는 서비스                       │ ← 섹션 헤딩(로컬)
│   1 조달계획 (파랑)   6 실적증명서       │ ← 2열 그리드, 상위 3 파랑 강조
│   2 입찰공고 (파랑)   7 …               │
│   3 개찰     (파랑)   8 …               │
│   4 계약             9 …               │
│   5 …               10 …               │
├──────────────────────────────────────┤
│ [상태 ②③ keyword!='']                  │
│  자동완성                    [ON/OFF]   │ ← Switch (label="자동완성")
│  ② 방독면 → 「방독면」 K5방독면 …(≤6)    │ ← 자동완성 행(하이라이트) ／ 없으면 Empty
│  ③ (Empty) 자동완성 기능이 꺼져 있습니다 │ ← 안내 Empty(info)
│  관련 서비스                            │
│   조달계획 통합목록                  ›  │ ← NavigationItemList(chevron)
│   입찰공고 목록                      ›  │
└──────────────────────────────────────┘
```

- **자주 찾는 서비스**: 1~10 을 2열(좌 1~5 / 우 6~10)로 배치. 순위 1~3 은 파랑(`--krds-action-primary` 계열) 강조, 4~10 기본색.
- **자동완성 하이라이트**: 메뉴명 중 `keyword` 일치 구간만 강조색. 텍스트를 일치/비일치로 분할 렌더(`<mark>`/`<span>`) — `dangerouslySetInnerHTML` 금지.
- **액션/푸터**: FullPopup 자체 header(닫기) 외 별도 footer 불필요(검색 행이 본문 상단 고정).

---

## 6. 데이터/스텁 경계

- 목업 상수(페이지 상단): `RECENT_KEYWORDS`(최근검색어, 메모리 상태 초기값) · `FREQ_SERVICES`(자주 찾는 서비스 1~10, `{ id, rank, label }`) · `MOCK_MENUS`(자동완성·관련서비스 소스 메뉴명 배열).
- 파생: `suggestions = MOCK_MENUS.filter(m => m.includes(keyword)).slice(0, 6)` · `relatedServices`(검색어 기반 목업).
- 핸들러: `console.log` + `// 추후 API: cmService.searchAll` 경계 주석. 실제 검색 = `cmService.searchAll(keyword)` → M10(IntgSrch_Rslt).
- 영속(서버/로컬스토리지) 미적용 — 최근검색어는 메모리 상태(`useState`)만.

## 7. 접근성

- **autoFocus**: open 시 검색 입력 포커스(키보드 즉시). FullPopup 포커스 트랩(기존 컨테이너) 활용.
- **닫기**: FullPopup ESC/닫기 버튼(컨테이너 제공).
- **검색**: InputBox 는 `<form>` 또는 Enter 키 submit 으로 검색 실행 — 버튼 미클릭 접근 보장.
- **TagList 삭제**: 각 칩 X 는 `aria-label`("최근 검색어 삭제: {키워드}").
- **Switch**: `label="자동완성"` 연결(`aria-checked` Radix 기본).
- **NavigationItemList**: 각 항목 버튼 시맨틱 + 포커스 링.
- **하이라이트**: `<mark>` 시맨틱(색 + 스크린리더 자연 읽힘), 색만으로 구분하지 않음.

## 8. 스타일/토큰

- 색: `--krds-action-primary`(자주찾는서비스 상위 3·하이라이트), `--krds-text-ink/muted`, `--krds-border-field/divider`. **하드코딩 금지** — 토큰 없으면 추가 절차(tokens.css → tailwind.css `@theme` → cn.ts) 준수.
- 간격/라운드: `--spacing-*` / `--radius-*`(`rounded-krds-8` 등).

## 9. 라우팅/영향

- `router.tsx` **변경 없음** — IntgSrchPage 는 라우트가 아닌 FullPopup 오버레이(M12 MenuPage 와 동일). AppLayout 이 Header `onSearch` → `setSearchOpen(true)` + `<IntgSrchPage open onOpenChange />` 소유.
- `ComponentGuidePage` 변경 없음(신규 공통 0).

## 10. Test Plan (수동)

| # | Action | Expected |
|---|---|---|
| 1 | 헤더 통합검색 클릭 | FullPopup open + 검색 입력 autoFocus |
| 2 | 진입(검색어 없음) | 최근검색어(또는 Empty) + 자주찾는서비스(상위 3 파랑) — 상태 ① |
| 3 | 최근검색어 칩 X | 해당 칩 제거. 전체삭제 → Empty "최근 검색어가 없습니다." |
| 4 | 검색어 입력(자동완성 ON) | 자동완성 목록(검색어 하이라이트, ≤6) + 관련서비스 — 상태 ② |
| 5 | 매칭 없는 검색어 | Empty "검색 결과가 없습니다." |
| 6 | 자동완성 토글 OFF | 안내 Empty + 관련서비스 — 상태 ③ |
| 7 | 초기화(X) | keyword='' → 상태 ① 복귀 |
| 8 | 검색 실행(버튼/Enter) | console.log `cmService.searchAll` 스텁 |
| 9 | 정적 | `npm run lint` 0 err · `npm run build` 성공 · 설계서/Figma 육안 대조 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-19 | Initial — Option C 선택, 상태 3분기 머신 + 컴포넌트 매핑(신규 공통 0) 확정 | jygong |
