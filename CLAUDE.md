# CLAUDE.md — d2b-mobile-front

> Claude Code 작업 시 반드시 따를 프로젝트 규칙. 세션마다 자동 로드됨.
> 목적: 아래 항목들은 과거에 실제로 틀렸던 부분이다. 반복하지 말 것.

## 프로젝트 정체성

- **모바일 하이브리드 웹앱** — React **Native 아님**. 순수 웹(React + Vite)이며 하이브리드 앱 WebView 에 탑재 예정.
- 스택: React 18 + TypeScript + Vite + **TailwindCSS 4 (CSS-first `@theme`)** + shadcn/ui + axios + React Query + zustand
- 아키텍처 단일 기준 문서: `docs/frontend-architecture.md` (폴더 구조 · 네이밍 · 의존성 방향 규칙)
- Node 설치됨 (v24). `npm run lint` / `npm run build` 로 검증 가능.

## 새 페이지 작성 절차 (기획서 → 화면)

> 여럿이 기획서 보고 페이지를 칠 때의 표준 순서. **새 컴포넌트를 만들지 말고 `/guide` 의 기존 공통을 조립**하는 게 기본.

**문서 위치:**
- 설계서(=기획서) 원본: **`docs/spec/`** (조달계획 pptx 등). 위치·화면목록·슬라이드 오프셋·추출법은 `docs/spec/README.md`.
  - slide5 "화면 목록" = 화면ID↔영문ID↔한글명 → 폴더/파일명 근거. "기획서 pXX" = `slide(XX+1).xml`.
- 기능별 plan/design: `docs/01-plan/features/`, `docs/02-design/features/`.

**순서:**
1. **설계서에서 화면 확인** — 담당 화면의 화면ID·구성(섹션/필드/탭)·동작을 `docs/spec/` 에서 읽는다.
2. **`/guide` 에서 쓸 컴포넌트 고르기** — 브라우저로 `/guide`(ComponentGuidePage) 열어 공통 base/composites 카탈로그 확인. **여기 있는 걸 조립**(FullPopup·BottomSheet·AlertModal·Accordion·Table·InputBox·TextArea·RadioButtonGroup·CheckboxGroup·ButtonGroup·FileDownloadList·SummaryInfo·StepBar·TabList 등). 신규 생성 전 `common/composites`·`base` 중복 확인 필수.
3. **폴더/파일 생성** — "파일 명명 규칙"의 화면ID→파일명 변환 + 도메인 폴더 코드(op/bd/ct/...) 준수.
   - **새 화면은 먼저 설계서/앱메뉴 문서에서 해당 화면의 영문 화면 ID 를 확인해 파일/폴더명에 반영**(예: 알림현황 MUI-MS-01-M13 → `cm/notiPrst/NotiPrstPage`). 임의 영문명(`NotificationPage` 등) 금지 — MS/CM 공통 화면도 동일.
4. **조립 + 목업** — 표/필드는 데이터 배열로 구동. 데이터는 파일 내 목업 상수, 핸들러는 `console.log` + `// 추후 API: xxxService.yyy` 주석으로 경계 표시.
   - **목업은 기획서(설계서)의 "데이터영역·항목설명·검색조건·속성값"을 참고해 실제 API 응답처럼 만든다.** 필드명(키)·코드값·자릿수·형식(날짜·번호 마스킹 등)을 설계서 그대로 맞추고(예: 입찰공고번호 `2024L0M0030A1F1-01` 형식·코드값 `정상공고`), 도메인 타입(`src/types/{도메인}.ts`)에 그 필드를 정의한다. **의미 없는 더미("test", `aaa`, 무작위 숫자) 금지** — API 연동 시 키/형식만 바꾸면 되도록.
5. **`router.tsx` 등록** — `lazy()` + `errorElement={<ErrorPage />}` + `handle`(아래 "라우트 handle 레퍼런스").
6. **검증** — `npm run lint && npm run build`. chunk size 확인.

**Figma 는 선택(대부분 불필요):**
- 대부분의 페이지 작업 = `/guide` 조립이라 **Figma MCP 안 써도 된다.**
- Figma MCP 가 필요한 경우 = **`/guide` 에 없는 새 공통 컴포넌트를 디자인 원본대로 새로 만들 때**뿐.
- **Figma MCP 연결 안 될 때:**
  - 새 컴포넌트가 꼭 필요한 게 아니면 → `/guide` 의 가장 가까운 기존 컴포넌트로 진행.
  - 정말 새 비주얼이 필요한데 Figma 를 못 읽으면 → **픽셀값 임의 추측 금지.** 기존 토큰(`tokens.css`)·컴포넌트로 근사하거나, 사용자에게 디자인 확인(스크린샷/값) 요청 후 진행.
  - Figma 데이터는 웹 fetch 불가 — 반드시 데스크톱 앱 + Dev Mode MCP (file key 등은 "Figma" 섹션).

## 라우트 handle 레퍼런스

`router.tsx` 각 라우트의 `handle` 객체로 헤더·스크롤·바텀네비 동작을 선언한다. 타입: `src/types/navigation.ts`(`RouteHandle`). AppLayout 이 매칭된 라우트들의 handle 을 읽어 적용.

| 필드 | 값 | 용도 |
|------|----|----|
| `header` | `{ variant?: 'main'\|'sub', util?: 'home'\|'search', title?: ReactNode }` | 전역 Header 설정. `variant:'sub'`=뒤로+타이틀(없으면 'main'=로고), `util:'search'`=우측 통합검색(보통 2뎁스), `util:'home'`=우측 홈(보통 상세). |
| `scrollReset` | `boolean` | 뒤로(POP)로 복귀 시 스크롤 복원 대신 항상 맨 위. 목록 화면에 true. |
| `showBottomNav` | `boolean` | 하단 BottomNav 노출. **홈/알림/고객센터/마이페이지에만 true.** 생략=숨김(opt-in). |

**⚠️ 세 필드는 `handle` 직속 형제다 — `header` 안에 넣지 말 것.**
`showBottomNav`/`scrollReset` 을 `header: {...}` 안에 넣으면 AppLayout 은 `handle.showBottomNav` 를 읽으므로 **무시되어 동작 안 함**(자주 하는 실수). `header` 는 헤더 설정 전용.

```tsx
{
  path: 'op',
  element: <PrcmPlanIntgListPage />,
  errorElement: <ErrorPage />,
  handle: {
    header: { variant: 'sub', util: 'search', title: '조달계획' },
    scrollReset: true,     // ← header 밖, handle 직속
    // showBottomNav 생략 = 숨김
  },
},
```

- **상세(3뎁스) 화면은 `showBottomNav` 생략** → 자동 숨김. 굳이 `false` 도 안 적어도 됨(opt-in).

## 코드 스플리팅 컨벤션 — 대형 프로젝트 필수

**1) 새 페이지는 반드시 `React.lazy()` 로 추가한다.**

`src/router.tsx` 에 페이지 등록 시 `import { lazy } from 'react'` 사용:

```tsx
const NewPage = lazy(() =>
  import('@/ui/biz/foo/NewPage').then((m) => ({ default: m.NewPage })),
)
```

- `.then(m => ({ default: m.NewPage }))` 가 붙는 이유: `React.lazy` 는 default export 만 받음. 우리 페이지는 모두 named export.
- 일반 `import` 로 추가하면 main bundle 에 합쳐져 코드 스플리팅 효과 소실.

**2) Suspense fallback 은 `AppLayout` 의 `<PageLoading />` 으로 공통 처리.**

- 기본 fallback = `src/ui/common/feedback/PageLoading.tsx` (KRDS primary 회전 스피너)
- AppLayout 안 라우트는 자동으로 PageLoading 표시 → 페이지별 추가 작업 불필요
- AppLayout 밖 라우트(`/guide` 같은)는 `router.tsx` 에서 직접 `<Suspense fallback={<PageLoading />}>` 감쌈

**3) 특정 페이지에 정교한 스켈레톤이 필요하면 페이지에서 오버라이드.**

페이지 내부에서 `<Suspense>` 다시 감싸면 됨:

```tsx
// e.g. ProcurementPage.tsx
import { Suspense } from 'react'

export function ProcurementPage() {
  return (
    <Suspense fallback={<ProcurementSkeleton />}>
      <ProcurementContent />
    </Suspense>
  )
}
```

또는 page 자체에 lazy child 가 있을 때 그 자식에 Suspense.

**4) 청크 로드 실패·렌더 throw·404 는 라우터 `errorElement` (`ErrorPage`) 가 처리.**

- `router.tsx` 의 각 라우트에 `errorElement={<ErrorPage />}` 로 연결 (root + `/guide`)
- `src/ui/biz/cm/error/ErrorPage.tsx` — `useRouteError` 로 에러 읽고 "다시 시도"(캐시 무시 리로드) / "홈으로". 404(`isRouteErrorResponse` 또는 catch-all `path:'*'`)는 별도 문구.
- 네트워크 끊김·배포 후 캐시된 구버전 등 청크 로드 실패도 errorElement 가 잡음 (별도 ErrorBoundary 불필요 — 기존 ChunkErrorBoundary 흡수됨)
- 새 최상위 라우트 추가 시 그 라우트에 `errorElement` 달기

**5) 새 외부 라이브러리 추가 시 `vite.config.ts` `manualChunks` 도 함께 갱신.**

현재 vendor chunk 분리:
- `vendor-react` — react, react-dom, react-router-dom
- `vendor-radix` — @radix-ui/* (7개)
- `vendor-data` — @tanstack/react-query, axios, dayjs, zustand

> 참고: 과거 `vendor-mui`(@mui/material·@mui/icons-material·@emotion) 청크는 아이콘을 Material Symbols **폰트**로 전환하면서 제거됨 (@mui 미사용). 아래 "아이콘 정책" 참고.

새 라이브러리가 **여러 페이지 공통 의존**이면 적절한 vendor chunk 에 추가 (또는 새 vendor chunk 신설). 단일 페이지 의존이면 vendor 에 안 넣고 그 페이지 chunk 에 자연스럽게 포함되도록.

**6) 빌드 후 chunk size 확인 습관.**

`npm run build` 출력에서:
- 단일 chunk 가 600KB 초과 → 분리 검토 (`chunkSizeWarningLimit` 가 600 이라 경고 나옴)
- vendor chunk 가 너무 크면 (>300KB) 추가 분리 검토
- 페이지 chunk 가 100KB+ 이면 페이지 내부 lazy(차트/에디터/지도 등) 적용

## 아이콘 정책 — 가장 자주 헷갈리는 부분

**모든 신규 아이콘은 `Material Symbols Outlined` **폰트** 기반 `Icon` 컴포넌트로만 추가한다.**

> ⚠️ 과거엔 `@mui/icons-material`(구 Material **Icons**) 기반이었으나, 디자인 원본(Figma)이 Google **Material Symbols**(신) 기준이라 모양이 안 맞아 **아이콘 폰트(self-host)** 방식으로 전환함. 이제 `@mui/*` 는 미사용(import 금지).

```tsx
import { Icon } from '@/ui/common/base/Icon'

<Icon name="Search" size={20} />                    // ✅ REGISTRY 키(PascalCase)
<Icon name="Close" size={20} className="text-..." />// ✅ className 통과 · 색은 currentColor(text-*)
<Icon name="Star" fill={1} weight={700} />          // ✅ 가변 축 FILL(0/1)·wght(100~700) 제어
<Icon><MyCustomSvg /></Icon>                        // ✅ REGISTRY 미등록 아이콘은 children(SVG)
```

**작동 원리**: `Icon` 은 `name`(PascalCase) → **ligature(snake_case)** 로 매핑해 `<span className="material-symbols-outlined">home</span>` 로 렌더한다. 폰트의 `liga` 기능이 `home` → 🏠 글리프로 합자.

**폰트 self-host (폐쇄망 대응 — 중요)**: (상세: `docs/closed-network-fonts.md`)
- 폰트 실파일: `public/fonts/material-symbols-outlined.woff2` (전체 가변폰트 ~3.8MB). `@font-face` 와 `.material-symbols-outlined` 클래스는 `src/styles/globals.css` 에서 직접 정의.
- **CDN `@import url(구글폰트)` 금지** — 폐쇄망에서 폰트 404 → 아이콘이 "home" 같은 텍스트로 깨짐.
- 폰트 원본은 `material-symbols` npm 패키지. 갱신 시 `node_modules/material-symbols/material-symbols-outlined.woff2` → `public/fonts/` 재복사.
- 서브셋(용량 축소)은 현재 미적용 — 나이브한 ligature 텍스트 서브셋은 'liga' 클로저로 거의 안 줄어드니 함부로 시도 말 것.

**금지**: 새 코드에서 `import { X } from 'lucide-react'` 처럼 lucide 를 import 하지 말 것. 기존에 남아있는 lucide 는 `src/ui/raw/*` 4개 파일뿐이며, 이건 **shadcn CLI 가 강제로 박은 정본 코드라서 수정 금지** (raw 규칙 = CLAUDE.md "shadcn/ui — 가장 자주 틀리는 부분" 참고).

**REGISTRY 에 없는 아이콘이 필요할 때 추가 절차 (import/번들 작업 불필요 — 폰트에 모든 글리프 포함):**

1. https://fonts.google.com/icons 에서 **Material Symbols** 아이콘 찾기 → 상세의 코드명(snake_case) 확인 (예: `location_on`).
2. `src/ui/common/base/Icon.tsx` 의 `REGISTRY` 에 한 줄 추가 (알파벳 순서 유지). 키=PascalCase, 값=ligature:
   ```ts
   LocationOn: 'location_on',
   ```
3. 사용처에서 `<Icon name="LocationOn" />` 호출.

**아이콘 이름 매핑 참고** (lucide ≠ Material Symbols · 키=REGISTRY PascalCase, 괄호=ligature):

| lucide | REGISTRY 키 (ligature) |
|--------|------------------------|
| `X` | `Close` (`close`) |
| `Check` | `Check` (`check`) |
| `ChevronDown` | `ExpandMore` (`expand_more`) |
| `ChevronLeft/Right` | `ChevronLeft/Right` (`chevron_left/right`) |
| `ChevronsLeft/Right` | `KeyboardDoubleArrowLeft/Right` (`keyboard_double_arrow_left/right`) |
| `Bell` | `Notifications` (`notifications`) |
| `FileText` | `Description` (`description`) |
| `Megaphone` | `Campaign` (`campaign`) |
| `User` | `Person` (`person`) |
| `ArrowRight` | `ArrowForward` (`arrow_forward`) |
| `Plus` | `Add` (`add`) |
| `Search` | `Search` (`search`) |
| `Home` | `Home` (`home`) |

> 참고: Material Symbols 는 채움/아웃라인을 별도 이름이 아닌 **FILL 축**으로 구분한다. `Favorite`/`Star`(채움)·`FavoriteBorder`/`StarBorder`(아웃라인)는 같은 ligature(`favorite`/`star`)에 `Icon.tsx` 의 `FILLED_BY_DEFAULT` 로 기본 FILL 만 다르게 매핑돼 있음.

## 파일 명명 규칙 (컴포넌트 추가 시)

| 위치 | 케이스 | 예 | 비고 |
|------|------|----|------|
| `src/ui/raw/` | **kebab-case / lowercase** | `button.tsx`, `radio-group.tsx`, `switch.tsx` | shadcn CLI 출력 그대로 — 임의로 바꾸지 말 것. `components.json` `aliases.ui` 가 이 경로를 지정. |
| `src/ui/common/base/` | **PascalCase** (한 단어 = 그대로, 복합어 = 단어 경계마다 대문자) | `Button.tsx`, `Checkbox.tsx`, `InputBox.tsx`, `RadioButton.tsx`, `SegmentedControl.tsx`, `TextArea.tsx` | 파일명 = 주요 export 컴포넌트명. |
| `src/ui/common/composites/` | **PascalCase**, 그룹/리스트는 보통 `XxxGroup` | `ButtonGroup.tsx`, `RadioButtonGroup.tsx` | base + 도메인 합성. |
| `src/ui/biz/{도메인}/` | **설계서 화면 ID 기반 PascalCase** | `prcmPlanIntgList/PrcmPlanIntgListPage.tsx`, `prcmPlanDtl/PrcmPlanDtl_PrdList.tsx` | 아래 "설계서 화면 ID → 파일명 변환 규칙" 참고. |

**biz 도메인 폴더 코드 (`src/ui/biz/{도메인}/`):**

도메인 폴더명은 아래 약어로 **고정**한다(백엔드 API 도메인과 일치). 새 화면은 반드시 해당 도메인 폴더 아래에 둔다.

| 폴더 | 도메인 |
|------|--------|
| `op` | 조달 |
| `bd` | 입찰 |
| `ct` | 계약 |
| `ex` | 이행 |
| `wm` | 대금청구/사후 |
| `ts` | 업무지원 |
| `st` | 통계 |
| `cm` | 공통관리 |
| `fb` | dapa-fpbis (영문) |

> **공통관리(`cm`)**: 특정 업무 도메인에 속하지 않는 공통 화면은 전부 `cm/` 아래에 둔다 — `cm/home`(메인) · `cm/mypage` · `cm/notice` · `cm/notification` · `cm/support` · `cm/auth` · `cm/terms` · `cm/error` · `cm/search`. (메인/마이페이지/공지/알림/고객센터를 `biz/` 최상위에 두지 말 것.)

**설계서 화면 ID → 파일명 변환 규칙 (biz 도메인 화면):**

- `src/ui/biz/{도메인}/` 의 화면(페이지·탭·팝업·시트)은 **설계서(사용자인터페이스설계서) 영문 화면 ID 를 따른다.**
- 규칙: **설계서 화면 ID 를 그대로 쓰되 첫 글자만 대문자로** 올려 PascalCase 규약을 만족시킨다. **언더스코어·내부 대소문자는 설계서 그대로 보존**(설계서 ↔ 코드 1:1 추적).
  - `prcmPlanDtl_PrdList` → `PrcmPlanDtl_PrdList` · `prcmPlanDtl_spclCtrt` → `PrcmPlanDtl_spclCtrt` · `prcmPlanDtl_OpnnDtl` → `PrcmPlanDtl_OpnnDtl`
- **폴더명 = 화면 ID(camelCase 그대로)**, 그 안의 파일/컴포넌트 = 위 규칙(첫 글자 대문자). 폴더(`prcmPlanDtl`)와 파일(`PrcmPlanDtl`)이 대소문자만 다른 중첩은 허용.
- **페이지**(통합목록 컨테이너 등)는 화면 ID + `Page` 접미사: `PrcmPlanIntgListPage`, `PrcmPlanDtlPage`. (접미사 덕에 같은 ID 의 탭 콘텐츠 `PrcmPlanDtl` 과 충돌 안 함 — 탭에는 `Content` 등 군더더기 접미사 붙이지 말 것.)
- 설계서 ID 가 없는 하위 조립물(예: 의견 카드)은 가장 가까운 상위 화면 ID 에서 파생: `PrcmPlanDtl_OpnnCard`.
- **컨테이너 타입 접미사 — 규칙: wrapper 접미사 = 감싸는 컨테이너 컴포넌트명. 그리고 wrapper 를 만드는 컨테이너는 `FullPopup` 하나뿐이다.** 따라서 전용 래퍼는 화면 ID 뒤에 **언더스코어 없이** `FullPopup` 을 붙인다(예전 `Popup` 접미사는 폐기 — 'Popup'은 바텀시트·모달까지 포함하는 카테고리 단어라 종류를 특정 못 함): `PrcmPlanDtl_OpnnDtlFullPopup`(P06 의견상세) · `PrcmPlanDtl_OpnnRegFullPopup`(의견등록) · `BfhdSpcfctDtl_OpnnDtlFullPopup`. 풀팝업만 래퍼로 캡슐화하는 이유 = 본문이 화면급으로 무겁고(긴 폼·variant·검증) footer/title 이 화면 고유라 부모로 끌어올리면 페이지가 비대해지기 때문. 탭 콘텐츠·페이지엔 안 붙임(페이지는 `Page`).
- **⚠️ BottomSheet · AlertModal 은 전용 래퍼(`*Sheet`)를 만들지 않는다.** 부모(페이지 또는 탭 콘텐츠)가 컨테이너(`BottomSheet`/`AlertModal`)를 직접 렌더하고, 그 사이에 **콘텐츠만 분리한 컴포넌트**(아코디언/테이블 등)를 끼워 넣는다. 컨테이너 props(`title`/`footer`/`open`/`onOpenChange`)는 **부모가 소유**한다.
  - 콘텐츠 컴포넌트는 화면 ID 그대로(접미사 없이): P12 연관조달 콘텐츠 = `AnlPrcmPlanDtl`(컨테이너는 부모의 `<BottomSheet>`). 적용 예: `src/ui/biz/op/prcmPlanDtl/PrcmPlanDtl.tsx`(BottomSheet+`AnlPrcmPlanDtl` 직접 조립) · `PrcmPlanDtlPage.tsx`(AlertModal·출력물 BottomSheet 인라인).
  - 단순 확인(예/아니오) AlertModal 은 `description` prop 으로 끝나면 별도 콘텐츠 컴포넌트도 불필요 — 페이지에 인라인.
  - 과거 `*Sheet` 래퍼(예전 `AnlPrcmPlanDtlSheet`)는 이 패턴으로 전환됨. 신규 BottomSheet/AlertModal 에 `Sheet` 접미사 래퍼를 새로 만들지 말 것. (관련: 메모리 `bottomsheet-slot-composition`)
- 파일명 = 주요 export 컴포넌트명 = `displayName` 문자열 모두 동일하게 맞춘다. 공유 데이터 타입(`OpinionData` 등)은 화면 ID 로 바꾸지 않는다.
- **MS/CM 공통 화면도 동일 규칙** — 메뉴/공통(`cm/`) 화면도 영문 화면 ID 를 따른다. 출처는 설계서(사용자인터페이스설계서) + `docs/spec/` 앱메뉴 문서(xlsx). 예: 알림현황 MUI-MS-01-M13 → `NotiPrst`(`cm/notiPrst/NotiPrstPage.tsx`) · 햄버거메뉴 MUI-MS-01-M12 → `menu`. 영문 ID 를 먼저 찾아 파일/폴더명에 반영하고, 임의 영문명(`NotificationPage` 등) 금지.
- 화면 ID 출처: 설계서 각 "화면 목록" 표(화면ID/한글명/영문ID).

**Figma → 파일명 변환 규칙:**

- Figma 컴포넌트명은 보통 `m_` 접두사 + 소문자 + 공백/언더바 (예: `m_segmented control_option`, `m_text input_box`, `m_radiobutton`).
- 변환: `m_` 제거 → 단어 경계 PascalCase 화 → 의미 단순화 가능.
  - `m_segmented control_option` → `SegmentedControl` (아톰이면 `Option` 생략 가능, 트랙 컴포지트가 따로 있을 때만 구분)
  - `m_text input_box` → `InputBox`
  - `m_text area_box` → `TextArea`
  - `m_select_box` → `SelectBox`
  - `m_radiobutton` → `RadioButton`
- Figma 명을 그대로 영문 옮기되 한국어 약칭은 풀어 적기 (`m_segmented_ctrl` 같이 줄여진 경우라도 풀네임 `SegmentedControl` 사용).

**새 컴포넌트 추가 시 필수 절차:**

1. raw 가 필요한 컴포넌트: `npx shadcn@latest add <name> --yes --overwrite` → `src/ui/raw/<name>.tsx` 생성 (CLI 가 알아서 kebab-case 처리).
2. `src/ui/common/base/<PascalCase>.tsx` 작성 — raw import + KRDS 토큰 / Figma 스타일.
3. `src/ui/dev/ComponentGuidePage.tsx` 에 (a) import (b) `NAV.base.items` 한 줄 (c) Section 데모 추가. **PostToolUse 훅이 자동으로 상기시켜 줌.**
4. `docs/02-design/features/krds-design-system.design.md` 의 base 컴포넌트 목록도 동기화.

## shadcn/ui — 가장 자주 틀리는 부분

- shadcn/ui 는 **npm 의존성이 아니다.** `npx shadcn add <컴포넌트>` CLI 가 컴포넌트 **소스 코드를 레포에 복사**하고, 복사된 코드는 우리가 소유·수정한다.
- base 컴포넌트는 **반드시 `npx shadcn add` 로 정본을 받은 뒤** KRDS 토큰/Figma 값을 입힌다.
  **손으로 shadcn 흉내 내서 새로 작성하지 말 것** (검증된 접근성·Slot·variant 구조를 잃는다).
- **컴포넌트 경로 (2층 구조):**
  - `src/ui/raw/` — `npx shadcn add` 결과물. **절대 직접 수정 금지.** (`components.json` `aliases.ui` 가 여기를 지정)
  - `src/ui/common/base/` — raw 를 import 해서 KRDS 토큰/Figma 스타일을 입힌 커스텀 레이어. 다른 파일은 여기서 import.
- **스타일 커스텀은 오직 base 에서만 (raw 는 원본 그대로).**
  - raw 에 박힌 클래스(`buttonVariants`, accordion 의 `animate-accordion-*` 등)는 **전부 shadcn 원본**이다 — 우리 커스텀이 아니다. 건드리지 말 것.
  - **raw 의 스타일을 비우거나 base 로 "이관"하지 말 것.** raw 기본값 + base 오버라이드가 **중첩되는 건 정상**이고, `cn()`(tailwind-merge)이 충돌 클래스를 정리해 최종 출력엔 base 값만 남는다. 중첩은 비효율이 아니다.
  - 즉 색·크기·여백·radius 등은 **base 의 `className`(KRDS 토큰) 오버라이드**로만 커스텀한다. (className 으로 못 바꾸는 고정 자식/구조 케이스만 아래 "raw 우회" 규칙 적용)
- **새 shadcn 컴포넌트 추가 절차 (반드시 이 순서):**
  1. `npx shadcn@latest add <컴포넌트> --yes --overwrite` → `src/ui/raw/<컴포넌트>.tsx` 생성
  2. `src/ui/common/base/<컴포넌트>.tsx` 작성 — raw import + KRDS className 오버라이드
  3. 다른 파일은 `@/ui/common/base/<컴포넌트>` 에서 import
- **설치 예:** `npx shadcn@latest add button --yes --overwrite`
- **raw → base 커스텀 패턴:**
  ```tsx
  // src/ui/common/base/Button.tsx
  import { Button as RawButton } from '@/ui/raw/button'

  // 1) 우리 variant cva 정의 (Figma style 명과 1:1)
  const buttonVariants = cva('...KRDS 베이스...', { variants: { variant: { primary: '...', ... } } })

  // 2) raw의 variant/size 타입을 Omit하고 우리 타입으로 교체
  interface ButtonProps extends Omit<ComponentPropsWithoutRef<typeof RawButton>, 'variant'|'size'>,
    VariantProps<typeof buttonVariants> {}

  // 3) className으로 KRDS 스타일 주입 — tailwind-merge가 충돌 해결
  const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
    <RawButton ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ))
  ```
- **raw 우회가 필요해 보일 때 — 임의로 Radix 직접 사용하지 말고 사용자에게 먼저 물어본다.**
  raw shadcn 컴포넌트가 내부 JSX 자식을 고정해서 구조 자체를 못 바꾸는 상황(예: `Checkbox` 칩 디자인이
  `CheckboxPrimitive.Indicator` 구조를 오버라이드 못 함)이 보이면, **곧장 `@radix-ui/*` 프리미티브로 새로 짜지 말고**
  "raw 를 못 쓰는 이유 + Radix 직접 사용 제안"을 사용자에게 제시하고 승인을 받은 뒤에 진행한다.
  - 이미 승인되어 Radix 직접 사용 중인 기존 예외(코드에 사유 주석 있음): `Checkbox`, `RadioButton`, `SelectBox`(트리거 칩),
    `Switch`, `BottomSheet`, `AlertModal`, `FullPopup`. 이들은 재승인 불필요 — 그대로 둔다.
  - 승인 후 Radix 직접 사용 시에는 해당 파일 상단에 사유 주석을 남긴다.
- **shadcn 규약을 따른다 — 임의 API 발명 금지:**
  - 아이콘은 **children** 으로 전달, 위치는 자식 순서로 결정 (`<Button><Icon />텍스트</Button>`).
    `leftIcon` / `rightIcon` 같은 props 를 만들지 말 것.
  - 아이콘 전용 버튼 = `size="icon"`.
  - variant 이름은 해당 Figma 컴포넌트 디자인을 따른다 (예: Button = `primary`/`secondary`/`inner`).
    stock shadcn 이름을 그대로 강제하지 않고, Figma `style` 명칭과 1:1 로 맞춘다.

## 디자인 시스템 (krds-design-system 기능)

- KRDS 디자인 토큰: `src/styles/tokens.css` — Primitive → Semantic CSS 변수. **색상/수치 하드코딩 금지.**
- 진입점은 `src/styles/globals.css` (main.tsx 가 import). 로드 순서: 폰트 → `tokens.css` → `tailwind.css`, 이어서 shadcn 호환 토큰명(`--primary`/`--border` 등)을 KRDS Semantic 으로 브리지.
- **Tailwind v4 — CSS-first.** 토큰을 Tailwind 유틸로 노출하는 건 `tailwind.config.ts`(없음, v4 는 `@config` 없으면 JS config 안 읽음)가 아니라 **`src/styles/tailwind.css` 의 `@theme` 블록**이다. 네임스페이스 → 유틸: `--color-*`→`bg-/text-/border-`, `--spacing-*`→`p-/m-/gap-/w-`, `--text-*`→`text-`(폰트크기, `--text-x--line-height` 동봉), `--radius-*`→`rounded-`, `--shadow-*`→`shadow-`, `--animate-*`→`animate-`(+`@keyframes`).
- **새 토큰 추가 절차 (반드시 순서대로):**
  1. `tokens.css` 에 값 정의 (필요시 Primitive + Semantic)
  2. `tailwind.css` `@theme` 에 네임스페이스로 등록 (예: `--color-krds-xxx: var(--krds-xxx);`)
  3. **색/폰트크기 토큰이면 `src/utils/cn.ts` 의 `KRDS_COLOR_NAMES`/`KRDS_FONT_SIZES` 에도 등록.** 누락 시 `text-*` 패턴을 twMerge 가 색 그룹으로 오분류 → 인접 색 클래스가 같이 제거되는 회귀(5/22·5/28 발생). spacing/radius/shadow 는 cn.ts 등록 불필요.
- 컴포넌트 스타일은 Tailwind 유틸 + `cva` 로만. 컴포넌트별 `.css` 파일 금지.

## Figma (디자인 원본)

- Figma Dev Mode MCP 사용. file key: `r4EjbQsz172SB5tQdX2bqV` (mobile).
- 디자인 읽기 도구: `mcp__figma-dev-mode__get_design_context` / `get_metadata` / `get_screenshot` / `get_variable_defs`.
- Figma 디자인 데이터는 웹페이지 fetch 로 못 읽는다 — 반드시 MCP 사용. Figma 데스크톱 앱 실행 + Dev Mode MCP Server 활성화 필요.
- **D2B 색상**: 별도 색상 팔레트 프레임이 없어, 컴포넌트 디자인에서 추출한 실측값을
  `tokens.css` 의 `--krds-d2b-*` Primitive 블록에 확정함. Semantic 토큰이 이를 참조.
  새 색이 필요하면 이 블록에 추가하고 Semantic 에서 참조할 것 (컴포넌트에 hex 직접 금지).
- radius 8px = `--krds-radius-d2b` / `rounded-krds-8` 클래스.

## 타입 정의 (`src/types/`)

여러 파일에서 공유하는 TypeScript 타입은 반드시 `src/types/` 에 정의하고 `@/types/xxx` 로 import 한다.

| 파일 | 무엇을 넣나 |
|------|-----------|
| `types/api.ts` | 백엔드 응답/요청 원형 타입 (`AccountResponse`, `ApiError` 등) |
| `types/domain.ts` | 프론트 도메인 모델 (`Account`, `Transfer` 등) |
| `types/{도메인}.ts` | 새 도메인 추가 시 파일 신설 |

**어디에 둘지 판단 기준:**

| 상황 | 위치 |
|------|------|
| 2개 이상 파일에서 import | `src/types/` |
| 컴포넌트 props 타입 (`interface XxxProps`) | 컴포넌트 파일 내 |
| 파일 내부에서만 쓰이는 로컬 타입 | 해당 파일 내 inline |

**import 방법:** `import type { Account } from '@/types/domain'`

## 스크롤 시 축소되는 sticky 헤더 — 훅 재사용

스크롤하면 상단 요약/헤더가 축소(collapse)되며 sticky 로 고정되는 동작은 **`src/hooks/useCollapsibleHeader.ts`** 에 있다. **페이지에서 직접 다시 구현하지 말고 이 훅에서 가져다 쓴다.**

- 반환 `{ collapsed, rootRef, scrollToTop }`:
  - `collapsed` → `<SummaryInfo collapsed={collapsed} />` 등 축소 대상에 전달
  - `rootRef` → 페이지 루트 `<div ref={rootRef}>` 에 부착(스크롤 컨테이너 탐지 기준점)
  - `scrollToTop` → 맨위로 FAB `onTop`
- **마크업(요약+스텝+탭 sticky 블록)은 페이지가 직접 소유**하고, 갈라지면 안 되는 **로직만** 훅에서 공유한다(국내/국외·사전규격 등 여러 상세 화면 공통 — 래퍼 컴포넌트 한 겹 안 씌움).
- 훅이 ① 실제 스크롤 컨테이너(`main#app-scroll` 또는 window) 탐지 ② 히스테리시스 임계로 collapse 토글 ③ **scroll-anchoring 진동 차단**(`rootRef` 에 `overflow-anchor:none` 자동 적용)까지 처리하므로 페이지에 따로 쓰지 않는다.
  - 스크롤 주체가 `main#app-scroll` 인 이유는 `AppLayout`(내부 스크롤 셸) 참고 — `window.scrollTo` 금지.
- 적용 예: `src/ui/biz/op/OpDetailPage.tsx`.

## 상세(detail) 화면 & 팝업 컨벤션 — 조달계획 상세(M03~) 작업에서 확립

> **새 상세(detail) 화면은 조달계획 상세 `PrcmPlanDtlPage` 를 레퍼런스로 조립한다** (`src/ui/biz/op/prcmPlanDtl/PrcmPlanDtlPage.tsx`, 국외는 `ovsPrcmPlanDtl/OvsPrcmPlanDtlPage` · 사전규격은 `bfhdSpcfctDtl/BfhdSpcfctDtlPage`). 아래 구조/컨벤션은 그 페이지에서 확립된 것. (목록 화면은 "목록 화면 & 검색필터 컨벤션" 의 `PrcmPlanIntgListPage` 레퍼런스 참고.)

**1) 다중 탭 상세 화면 구조.**
- 상단: `useCollapsibleHeader()` + sticky 블록(요약 `SummaryInfo` + 스텝 `StepBar` + 탭 `TabList`).
- 탭 콘텐츠는 **탭별 컴포넌트로 분리**(같은 biz 폴더), 페이지는 `renderTabContent(tab)` switch 로 렌더. (예: `DetailContent`/`ItemSpec`/`VendorOpinion`/`ContractTerms`/`Attachment`)
- 각 탭 콘텐츠 = `PageTitle`(탭명) + `Accordion`/`AccordionSection` + `Table`(rows 데이터 구동). 표·필드는 **데이터로 구동**(라벨/값을 배열로) — 국내/국외/공사 변형은 데이터만 갈아끼움.
- **목록 `key` 는 안정적 고유 식별자(`id`·고유 문자열)를 쓴다. 배열 인덱스 `key={i}` 금지** — 동적 목록(API 연동) 에서 삽입/삭제/정렬 시 React 가 다른 항목을 같은 노드로 오인 재사용해 입력값·포커스·애니메이션이 꼬인다. 고유 ID 가 없으면 데이터 타입에 `id` 를 추가한다(예: `FileDownloadItem.id` — 파일명은 중복 가능). (전역 적용, 상세화면 한정 아님)

**2) 기존 컴포넌트 재사용 — 신규 생성 최소화 (사용자 반복 지시).**
화면/팝업은 반드시 기존 공통부터 조립한다: `FullPopup`·`BottomSheet`·`AlertModal`·`Accordion`·`Table`·`InputBox`·`TextArea`·`InputLabel`·`InputMessage`·`RadioButtonGroup`·`ButtonGroup`·`FileDownloadList`·`SummaryInfo`·`StepBar`·`TabList`·`SearchFilter`. 신규는 **도메인 전용 조립물**(예: `OpinionCard`, `*FullPopup` 풀팝업 래퍼, 바텀시트 콘텐츠 컴포넌트)만. 신규 생성 전 `common/composites`·`base` 중복 확인 필수.
- **팝업 종류 선택**: 선택/검색/짧은 입력 → `BottomSheet` · 상세/긴 폼(여러 섹션) → `FullPopup` · 단순 확인(예/아니오) → `AlertModal`.
- 읽기전용 표시 필드는 `InputBox`/`TextArea` 에 `disabled` 로 재사용.
- 액션 버튼은 시트 `footer` 슬롯에 둔다(스크롤 본문에 두면 overflow 로 하단 border 잘림).

**3) 목업 + API 경계 스텁.**
데이터는 파일 내 목업 상수, 핸들러는 `console.log` + `// 추후 API: opService.xxx` 주석으로 경계 표시. (실제 fetch/라우팅 미구현 자리를 명확히)
- **목업 값은 설계서의 데이터영역·항목설명·검색조건·속성값을 그대로 반영**해 실제 API 응답처럼 만든다(필드명·코드값·자릿수·형식 일치, 임의 더미 금지). → "새 페이지 작성 절차" step 4 참고.

**4) 유사 화면 = 페이지를 함부로 나누지 않는다 (API 다른 건 분리 사유 아님).**
- **같은 구조 + API/값/라벨만 다름**(국내·국외 조달계획상세) → **1 페이지** + `type` 파라미터로 service 선택 + config 로 라벨/탭 차이 흡수. 페이지 복제 금지.
- **다른 도메인 + 레이아웃만 유사**(조달계획상세 vs 사전규격상세) → **페이지 분리하되 로직은 공유**: 갈라지면 안 되는 동작(`useCollapsibleHeader`)은 훅으로, 마크업은 각 페이지가 소유. 래퍼 셸 컴포넌트로 한 겹 더 씌우지 않는다(과잉 prop 방지).

## 목록 화면 & 검색필터 컨벤션 — 조달계획 통합목록(MUI-OP-01-M02) 에서 확립

**1) 목록 화면(검색 + 카드 리스트)은 `PrcmPlanIntgListPage` 를 레퍼런스로 조립한다.**
- 레퍼런스: `src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx`.
- 표준 조립(위→아래): `SectionTitle`(검색조건 바) → `SearchCondition`(빠른검색어 + 대상칩 + 필터버튼) → `ListSectionHeader`(총건수·페이지크기) → `CardList`(카드 목록, `Badge`) → 더보기 `Button` → `FloatingActionButton`(맨위로) → `SearchFilter`(상세필터 풀팝업). 전부 기존 공통 — 신규 생성 금지.
- 상태 분리: `filter`(상세필터 확정값) · `keyword`/`targets`(빠른검색 입력 중) · `appliedSearch`(검색 실행 시에만 확정) · `page`/`pageSize`(더보기). **빠른검색은 입력 중 거르지 않고 검색 실행(버튼/Enter) 시에만** `appliedSearch` 로 확정한다.
- 데이터/페이징은 목업 + API 경계 스텁: `MOCK_LIST` → `filteredList`(useMemo) → `visibleList`(slice). 핸들러는 `console.log` + `// opService.getList(...)` 주석. API 연동 시 이 블록을 통째로 교체.
- 카드 클릭 라우팅은 **데이터 필드(예: `srchType`)로 분기** — 라벨 문자열 하드코딩 분기 금지. 맨위로 스크롤은 `#app-scroll`(window 아님).

**2) 검색필터 화면은 새로 만들지 말고 cm 의 `SearchFilter` 를 사용한다.**
- 위치: `src/ui/biz/cm/search/SearchFilter.tsx` — **schema 구동 범용 풀팝업 셸**(도메인 무관, Home·조달계획 등 공용). 페이지는 **`SearchFilter` 하나만 import** 하면 된다.
- 페이지가 주입하는 것: `schema`(정적 `SearchFilterSchema` **또는** 입력값에 따라 섹션이 바뀌면 `resolver` 함수) · `value`/`defaultValue` · `onSearch` · (한 필드가 종속 필드를 바꿔야 하면) `normalize`. 필드 정의 타입은 `@/types/search-filter`.
- 필드 렌더는 셸 내부 `SearchFilterField` 담당 — 페이지는 **schema(데이터)만 선언**하고 컨트롤을 직접 그리지 않는다.
- **공통 검색 바텀시트(품목별 `ItemInq`·생산자 `PrdcrInq`·발주부서 `DeptInq`)는 셸(`SearchFilter`)이 직접 소유**한다. selectionField 에 `searchSheet: 'item'|'producer'|'dept'` 만 선언하면 셸이 `BottomSheet` 컨테이너를 열고(슬롯 조합) 선택 결과를 그 필드 값으로 주입한다 — **페이지는 시트를 import·관여하지 않는다.** (시트는 cm/search 의 콘텐츠 전용 컴포넌트, `*Sheet` 래퍼 금지)
- **새 공통 검색시트 추가 절차 (페이지가 아니라 셸에 추가):** 앞으로 검색필터에서 파생되는 바텀시트가 늘어나도 **소비 페이지가 아니라 `SearchFilter` 셸에 배선**한다.
  1. `src/ui/biz/cm/search/` 에 **콘텐츠 전용 컴포넌트** 신설 — `forwardRef` + `useImperativeHandle` 로 `SearchSheetHandle`(footer `reset`/`search`) 노출, 내부에 `BottomSheet`/footer/`open` 두지 않음(컨테이너는 셸 소유).
  2. `@/types/search-filter` 의 `SearchSheetKind` 유니온에 새 종류 추가.
  3. `SearchFilter.tsx` 에 종류별 `<BottomSheet>`(타이틀/footer/open) + 콘텐츠 컴포넌트 + 전용 `ref` 한 벌 추가.
  4. 사용 화면은 selectionField 의 `searchSheet` 에 새 종류만 선언 — **시트 파일을 페이지에서 import 하지 않는다.**
- 적용 예: `PrcmPlanIntgListPage`(검색유형별 `buildOpSearchSchema` resolver + `normalizeOpSearch`) · `HomePage`(정적 schema).

## 폼 검증 (react-hook-form + zod)

폼 입력 검증은 **react-hook-form(RHF) + zod**로 표준화한다. 직접 `useState`로 검증 로직 짜지 말 것. (상세: `docs/02-design/features/form-validation.design.md`)

- **설치됨**: `react-hook-form`·`zod`·`@hookform/resolvers` (vite `vendor-form` chunk). import: `import { useForm, Controller } from 'react-hook-form'` · `import { zodResolver } from '@hookform/resolvers/zod'`(서브패스 없음) · `import { z } from 'zod'`.
- **스키마 = 진실원천**: zod 스키마로 규칙 + 타입(`z.infer`)을 한 곳에서. 위치: 단일 폼은 옆에 `XxxForm.schema.ts`(co-locate) · 2개+ 공유는 `src/types/` · 재사용 필드 규칙은 `src/utils/validators.ts`.
- **zod v4 주의**: 에러 메시지는 `{ error: '...' }` (구 `message:` 아님). 형식은 `z.email()` 등 top-level.
- **트리거 고정**: `useForm({ resolver: zodResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })` — 제출 시 전체 검증, 이후 에러 필드는 blur 재검증.
- **연동**: 네이티브 입력(`InputBox`/`TextArea`) = `register`. **Radix 그룹**(`Checkbox`/`RadioButtonGroup`/`CheckboxGroup`)·마스킹 입력 = **`<Controller>`** (value/onChange/onBlur 수동 연결, Checkbox 는 `c === true` 정규화).
- **에러 표시(KRDS 재사용)**: `<InputMessage type="error">{message}</InputMessage>` + `InputBox`의 `error` prop + `aria-invalid`/`aria-describedby`. 필수는 `InputLabel`의 `required`(`*`).
- **첫 에러 포커스**: 입력류는 RHF `shouldFocusError` 자동. **Radix 그룹은 ref 없어 자동 안 됨** → 필드 블록을 `<div id={`field-${name}`}>`로 감싸고 `onInvalid`에서 `scrollIntoView`(main#app-scroll). `window.scrollTo` 금지.
- **서버 검증 대체 아님**: 프론트는 UX 사전검증. 권위 검증은 백엔드(eGovFrame).
- **적용 예시**: `PrcmPlanDtlPage`(페이지가 `useForm` 소유) + `PrcmPlan_NotiAply`(`control` 받아 Controller) + `PrcmPlan_NotiAply.schema.ts`.

### 입력 종류(마스킹·IME 가드) — `InputBox`의 `inputType`

숫자/전화/영문처럼 **허용 문자 제한이 있는 입력**은 `InputBox` 의 `inputType` prop 으로 처리한다. **거르기·키패드·IME 가드를 InputBox 가 내부에서 자동 처리**하므로, 페이지/콘텐츠는 prop 만 넘긴다(가공 로직을 직접 짜지 말 것).

| `inputType` | 허용 | IME 가드 | 키패드(inputMode) | 용도 |
|---|---|---|---|---|
| `text`(기본) | 전부(한글 OK) | ❌ | 일반 | 이름·주소·메모 등 자유 입력 |
| `numeric` | 숫자만 | ✅ | numeric | 금액·수량·숫자코드 |
| `tel` | 숫자만 | ✅ | tel | 휴대번호·전화 |
| `english` | 영문/영숫자 | ✅ | 일반 | 영문 ID·코드 |

- **IME 가드**란: 한글 등 조합문자가 마스킹(거르기)에 의해 조합 도중 삭제되어 커서 튐·글자 깨짐이 나는 것을 막는 장치(`compositionstart~end` 동안 가공 보류). `text` 기본값은 가드를 타지 않아 **기존 InputBox 사용처는 무영향**.
- **표시 포맷**(전화 하이픈·금액 콤마)은 `format?: (filtered) => string` prop 으로. 예: `<InputBox inputType="tel" format={formatPhoneInput} ... />`.
- Controller 와 그대로 호환: `value={field.value} onChange={field.onChange}` 만 넘기면 InputBox 가 가공해 반영한다(콘텐츠가 `formatPhoneInput` 직접 호출하지 않음).
- **적용 예시**: `PrcmPlan_NotiAply` 휴대번호(`inputType="tel" format={formatPhoneInput}`).

## PDCA / 문서

- bkit PDCA 워크플로우 사용. 기능별 plan/design 문서: `docs/01-plan/features/`, `docs/02-design/features/`.
- 활성 기능: `mobile-app-scaffold`(스캐폴딩 — 코드 구현 완료), `krds-design-system`(토큰 + base 컴포넌트 — DO 단계).
- 코드를 바꾸면 해당 design 문서도 동기화한다.
