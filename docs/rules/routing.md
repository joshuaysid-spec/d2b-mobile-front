# 라우팅 · 코드 스플리팅 · 페이지 공통 동작

> CLAUDE.md 에서 분할된 상세 규칙. `router.tsx` 등록 · 번들/청크 · FAB · 스크롤 헤더 작업 시 반드시 먼저 읽는다.

## 라우트 handle 레퍼런스

`router.tsx` 각 라우트의 `handle` 객체로 헤더·스크롤·바텀네비 동작을 선언한다. 타입: `src/types/navigation.ts`(`RouteHandle`). AppLayout 이 매칭된 라우트들의 handle 을 읽어 적용.

| 필드 | 값 | 용도 |
|------|----|----|
| `header` | `{ variant?: 'main'\|'sub', title?: ReactNode }` | 전역 Header 설정. **2단 헤더**(2026-07-06 기획 반영): 메인바(로고+로그인/로그아웃+알림+전체메뉴)는 모든 화면 최상단 고정, `variant:'sub'`=메인바 아래 타이틀바(뒤로+가운데 타이틀) 추가. ⚠️ 구 `util:'home'|'search'` 는 deprecated(무시됨) — 새 라우트에 지정 금지. |
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
    header: { variant: 'sub', title: '조달계획' },
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
- `vendor-form` — react-hook-form, zod, @hookform/resolvers

> 참고: 과거 `vendor-mui`(@mui/material·@mui/icons-material·@emotion) 청크는 아이콘을 Material Symbols **폰트**로 전환하면서 제거됨 (@mui 미사용). `docs/rules/components.md` "아이콘 정책" 참고.

새 라이브러리가 **여러 페이지 공통 의존**이면 적절한 vendor chunk 에 추가 (또는 새 vendor chunk 신설). 단일 페이지 의존이면 vendor 에 안 넣고 그 페이지 chunk 에 자연스럽게 포함되도록.

**6) 빌드 후 chunk size 확인 습관.**

`npm run build` 출력에서:
- 단일 chunk 가 600KB 초과 → 분리 검토 (`chunkSizeWarningLimit` 가 600 이라 경고 나옴)
- vendor chunk 가 너무 크면 (>300KB) 추가 분리 검토
- 페이지 chunk 가 100KB+ 이면 페이지 내부 lazy(차트/에디터/지도 등) 적용

## 플로팅 버튼(FloatingActionButton) 위치 — 전 페이지 동일 앵커

**모든 페이지에서 `className="fixed bottom-0 right-4 z-40"` 하나로 통일한다.** 하단 여백은 페이지가 아니라 **FAB 가 스스로 계산**한다(`src/ui/common/composites/FloatingActionButton.tsx`).

- BottomNav **있음**(홈/알림/고객센터/마이페이지) → nav 높이(78px) + 10px + safe-area 만큼 자동으로 띄움.
- BottomNav **없음**(3뎁스 상세·목록 등) → 10px + safe-area.
- 판정은 `useBottomNavVisible()`(bottomNavContext)가 하므로 **페이지가 `bottom-20`/`bottom-24` 같은 값을 직접 넣으면 이중 오프셋**이 되어 버튼이 붕 뜬다. (2026-08-03 cm 13개 화면에서 실제로 발생 → 일괄 `bottom-0` 로 통일)
- **예외는 페이지가 자체 sticky 하단 바를 가진 경우뿐** — 현재 `DfEqpmntTradeAgncAplyListPage`(sticky 신청 바) 1건만 `bottom-24`. 그 화면 파일에 사유 주석이 있다. 하단 바가 없는 화면에 이 값을 복사하지 말 것.

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
