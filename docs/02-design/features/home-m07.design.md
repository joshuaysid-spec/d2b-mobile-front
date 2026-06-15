---
template: design
version: 1.2
feature: home-m07
date: 2026-06-05
author: joshuaysid-spec
project: d2b-mobile-front
project-version: 0.1.0
plan-ref: docs/01-plan/features/home-m07.plan.md
---

# home-m07 Design Document

> 앱 메인 홈(MUI-MS-01-M07, 로그인 전) 구현 설계. Plan 의 컴포넌트 분해를 props 스펙으로 확정.

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 임시 링크 허브 → 실제 앱 메인 홈(M07) 완성 |
| **WHO** | 앱 기동 후 진입 모바일(웹뷰) 사용자(로그인 전) |
| **RISK** | 이미지 에셋 미제공(placeholder) · 동작 목업 스텁 |
| **SUCCESS** | Figma 1:1 · lint/build OK · 가이드 등록 · 핸들러 동작 |
| **SCOPE** | 공통 CarouselIndicator → biz/home 5종 → HomePage 교체 |

---

## 1. Overview

Figma node `7077-85163`(MUI-MS-01-M07) 1:1. Header/BottomNav 는 `AppLayout` 셸 제공 → HomePage 는 **콘텐츠 + Footer + FAB** 만 렌더. 데이터=목업, 동작=스텁/라우트, 캐러셀=정적, 이미지=placeholder.

## 2. Architecture Options (검토)

| Option | 요지 | 복잡도 | 유지보수 | 선택 |
|--------|------|:----:|:----:|:----:|
| A. 최소변경 | HomePage 한 파일에 모든 섹션 인라인 | 낮음 | 낮음(거대 단일파일) | ☐ |
| B. 클린 | 모든 섹션·칩·행을 atomic 으로 풀분해 + 공통화 | 높음 | 높음(과분해 prop drilling) | ☐ |
| **C. 실용 균형** | 화면 전용 조립물은 `biz/home` 섹션 컴포넌트로, **반복되는 캐러셀 인디케이터만 공통화**. 칩/행 등은 섹션 파일 내부 인라인 | 중간 | 높음 | ☑ |

> **선택: Option C.** CLAUDE.md "상세화면 컨벤션"(마크업은 페이지/섹션 소유, 공통화는 갈라지면 안 되는 것만) 및 메모리 `check-composites-before-creating` 와 정합. 사용자 결정(캐러셀 공통화·나머지 도메인 조립)과 일치.

---

## 3. 컴포넌트 설계

### 3.0 `Carousel` (신규 공통 — `common/composites`)

scroll-snap 기반 스와이프 캐러셀. `pages: ReactNode[]` 를 가로 슬라이드로 렌더하고 하단에 `CarouselIndicator` 통합. 터치 스와이프(네이티브 overflow-x scroll-snap) + 화살표 버튼(프로그램 스크롤) 모두 동작.

```ts
interface CarouselProps {
  pages: React.ReactNode[]      // 각 페이지 full-width
  ariaLabel?: string
  showIndicator?: boolean        // 기본 true (페이지 1개면 자동 숨김)
  className?: string
}
```

> **변경 이력**: 최초엔 "목업 정적 1페이지"였으나 사용자 요청으로 **실제 스와이프**(scroll-snap) 구현. 서비스 그리드·배너가 `Carousel` 을 사용. `CarouselIndicator` 는 `Carousel` 내부 sub-component 로 편입(가이드엔 둘 다 등록).

### 3.1 `CarouselIndicator` (신규 공통 — `common/composites`)

Figma `carousel`(7077:85329 / 7077:85434): `현재 / 전체` 숫자 박스 + `< >` 화살표. `Carousel` 이 current/total + onPrev/onNext 를 주입(단독 사용도 가능).

```ts
interface CarouselIndicatorProps {
  current: number          // 1-base 현재 페이지
  total: number            // 전체 페이지 수
  onPrev?: () => void      // 미주입 시 비활성(목업)
  onNext?: () => void
  className?: string
}
```

- 레이아웃: 중앙 정렬 row. `[1 / 2]` (Base-carousel-number) + `[<][>]` (40px 원형 버튼, ArrowBackIosNew/ArrowForwardIos).
- 첫/끝 페이지에서 해당 화살표 `disabled`(목업은 current=1 고정 → prev disabled).
- 색·간격은 KRDS 토큰. h-40.

### 3.2 `QuickProcurementSearch` (신규 — `biz/home`)

Figma `7077:85210`(bg `--krds-bg-primary-faint` `#ecf1fa`, rounded, pt-20 pb-24 px-16).

```ts
type SearchTarget = 'name' | 'g2bNo'          // 공고명 | G2B 공고번호 (OR, 단일선택)
interface QuickProcurementSearchProps {
  target: SearchTarget
  onTargetChange: (t: SearchTarget) => void
  keyword: string
  onKeywordChange: (v: string) => void
  onSearch: () => void
  onOpenFilter: () => void
  filterActive: boolean                        // true → 필터 아이콘 파란 ON
}
```

- 로고: placeholder 박스(빠른조달검색 로고 자리, h-40 영역).
- OR칩 row(내부 인라인): `공고명`·`G2B 공고번호` pill. 선택=bg `#0054e9`/흰글자/check아이콘 채움, 미선택=흰bg/파란보더/파란글자. 단일선택(라디오 역할, `role="radiogroup"`).
- 필터 버튼: 42px 원형. OFF=흰bg/파란보더/파란 filter아이콘, **ON(filterActive)**=파란 채움/흰 아이콘.
- 검색입력: 흰bg + 3px 파란보더 + rounded-full + drop-shadow. placeholder = `target==='name' ? '공고명을 입력해주세요.' : 'G2B 공고번호를 입력해주세요.'`. 우측 검색 아이콘 버튼.
- 칩/필터/입력은 파일 내부 인라인(별도 atomic 분리 안 함).

### 3.3 `ServiceShortcutGrid` (신규 — `biz/home`)

Figma `7077:85249`. 섹션타이틀 "주요 서비스 바로가기" + 3열 그리드를 `itemsPerPage`(기본 6=3열×2행)로 나눠 `Carousel` 로 스와이프.

```ts
interface ServiceShortcut { id: string; label: string; onClick?: () => void } // 아이콘=placeholder
interface ServiceShortcutGridProps {
  items: ServiceShortcut[]
  itemsPerPage?: number          // 기본 6 — 페이지 분할 → Carousel 슬라이드
}
```

- 각 항목: 60×60 아이콘 placeholder 박스(rounded) + 라벨(중앙, 멀티라인 허용). 3열, row-gap.
- 6항목 초과면 Carousel 이 2페이지(1/2) — 스와이프/화살표 전환.

### 3.4 `HomeNoticeSection` (신규 — `biz/home`)

Figma `7077:85348`. 섹션타이틀 "공지사항" + 더보기 + `TabList`(방위사업청/수요부대/일반) + 공지카드 3.

```ts
interface NoticeItem { id: string; title: string; date: string }
interface NoticeTab { value: string; label: string; items: NoticeItem[] }
interface HomeNoticeSectionProps {
  tabs: NoticeTab[]
  activeTab: string
  onTabChange: (v: string) => void
  onMore: () => void
  onItemClick: (item: NoticeItem) => void
}
```

- 더보기: `button_text`(텍스트 + Add 아이콘) 우상단.
- 공지카드: 제목(2줄 클램프, 19 Bold) + 날짜(17 muted). 하단 divider 행. 클릭=onItemClick. **key=item.id**.

### 3.5 `HomeBanner` (신규 — `biz/home`)

Figma `7077:85383`(알림판). 배너 **통이미지**(각 1장, Image) 여러 장을 `Carousel` 로 스와이프.

```ts
interface BannerSlide { id: string; src?: string; alt: string; onClick?: () => void }
interface HomeBannerProps { banners: BannerSlide[] }
```

- 통이미지: rounded 박스, 비율 고정(약 328×448 → aspect 유지). src 없으면 placeholder 박스(중앙 라벨 "배너").
- 3장 → Carousel 인디케이터 1/3, 스와이프/화살표 전환.

### 3.6 `FirstVisitGuide` (신규 — `biz/home`)

Figma `7077:85457`. 섹션타이틀 "처음 방문하셨나요?" + 가이드 행 3.

```ts
interface GuideItem { id: string; iconName: IconName; title: string; desc: string; onDetail?: () => void }
interface FirstVisitGuideProps { items: GuideItem[] }
```

- 행: 아이콘(24, Icon) + 제목(19 Bold) + 설명(17) + 자세히보기(button_text + TrendingFlat 아이콘).
- 기본 3항목: 사전준비안내/국내조달안내/국외조달안내. (아이콘은 REGISTRY 매핑 — DeveloperGuide/AssignmentInd/AssignmentGlobe 미등록 시 근접 아이콘 대체, 필요 시 REGISTRY 추가)

### 3.7 `HomePage` (교체 — `biz/home`)

목업·상태·핸들러 소유, 위 6개 + Footer + FAB 조합.

```
state: target, keyword, activeNoticeTab, filterOpen, filterValue(SearchFilterValue)
파생: filterActive = JSON.stringify(filterValue) !== JSON.stringify(defaultFilterValue)
핸들러(스텁): onSearch/onService/onMore/onItemClick/onDetail → console.log + '// 추후: …'
                일부는 기존 라우트 이동(navigate(ROUTES.NOTICE) 등)
FAB: useRef 스크롤 감지 불필요 — onTop 으로 #app-scroll scrollTo(0)
```

---

## 4. 데이터/스텁 경계

- 목업 상수: `SERVICE_ITEMS`, `NOTICE_TABS`, `GUIDE_ITEMS` (HomePage 또는 각 섹션 파일 상단).
- 핸들러: `console.log` + `// 추후 API: xxxService.yyy` 주석.
- 검색필터: 기존 `SearchFilter`(FullPopup) 재사용. 최소 스키마(예: 업무구분) 1개 섹션. defaultValue 와 비교해 filterActive 산출.

## 5. 스타일/토큰

- 색: `--krds-action-primary`(#0054e9 계열), `--krds-bg-primary-faint`(#ecf1fa), `--krds-text-ink/muted`, `--krds-border-field/divider`. **하드코딩 금지** — 토큰에 없으면 추가 절차(tokens.css→tailwind.css@theme→cn.ts) 따름.
- 간격/라운드: `--spacing-*`/`--radius-*` (rounded-krds-8 등). pill=rounded-full.

## 6. 라우팅/영향

- `router.tsx` 변경 없음(홈 index 유지, named export `HomePage`).
- 신규 공통 `CarouselIndicator` → `ComponentGuidePage` 등록(import + NAV.composites + 데모).

## 7. Test Plan (수동)

- 칩 단일선택 토글 + placeholder 변경
- 필터 풀팝업 open/적용 → 아이콘 ON, 초기화 → OFF
- 탭 전환 → 카드 목록 변경
- 더보기/서비스/자세히보기 → console.log
- FAB → 최상단 스크롤
- lint/build 통과 · Figma 육안 1:1

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-06-05 | Initial — Option C 선택, 컴포넌트 7종 props 스펙 확정 | joshuaysid-spec |
