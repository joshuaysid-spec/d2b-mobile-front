# CLAUDE.md — d2b-mobile-front

> Claude Code 작업 시 반드시 따를 프로젝트 규칙. 세션마다 자동 로드됨.
> 목적: 아래 항목들은 과거에 실제로 틀렸던 부분이다. 반복하지 말 것.
> **상세 규칙은 `docs/rules/*.md` 로 분할됨** — 아래 인덱스의 "읽는 시점"에 해당하는 작업을 시작하면
> **코드를 만지기 전에 해당 파일을 먼저 Read 한다.** (인덱스만 보고 아는 척 진행 금지)

## 프로젝트 정체성

- **모바일 하이브리드 웹앱** — React **Native 아님**. 순수 웹(React + Vite)이며 하이브리드 앱 WebView 에 탑재 예정.
- 스택: React 18 + TypeScript + Vite + **TailwindCSS 4 (CSS-first `@theme`)** + shadcn/ui + axios + React Query + zustand + react-hook-form + zod
- 아키텍처 단일 기준 문서: `docs/frontend-architecture.md` (폴더 구조 · 네이밍 · 의존성 방향 규칙)
- **폐쇄망(에어갭) 반입 예정** — CDN 금지, 모든 에셋(폰트·아이콘) self-host.
- Node 설치됨 (v24). 검증: `npm run lint && npm run build` (+ chunk size 확인).

## 규칙 인덱스 (`docs/rules/`) — 언제 어떤 파일을 읽나

| 파일 | 내용 | 반드시 읽는 시점 |
|------|------|----------------|
| `new-page.md` | 새 페이지 작성 절차(설계서→화면 6단계) · 미구현 화면 카운트 기준 · Figma 실측 대조 2패스 · Figma MCP fallback | **새 화면/페이지 추가** · 미작업 화면 체크·진척 카운트 |
| `components.md` | 파일 명명 규칙(raw/base/composites/biz) · 도메인 폴더 코드 · 화면ID→파일명 변환 · FullPopup/Sheet 접미사 규칙 · shadcn 2층 구조 · 아이콘(Material Symbols) 정책 | **컴포넌트 생성/이름 결정** · raw/base 수정 · 아이콘 추가 |
| `routing.md` | 라우트 `handle`(header/scrollReset/showBottomNav) · 코드 스플리팅(lazy·errorElement·manualChunks) · FAB 앵커 · `useCollapsibleHeader` | **router.tsx 등록** · 번들/청크 · FAB/스크롤 헤더 |
| `screens.md` | 목록(검색+카드) · 상세(다중 탭) · 팝업(BottomSheet/FullPopup/AlertModal) 조립 컨벤션 · SearchFilter 셸 사용법 · 검색시트 추가 절차 · selectAll `'0'` 규격 | **목록/상세 화면 조립** · 팝업/바텀시트 · 검색필터 |
| `forms.md` | RHF+zod 검증 2레인 · 입력 폼 작성 규칙 · `InputBox` inputType(마스킹·IME 가드) | **폼/검증** · 마스킹 입력 |
| `api.md` | 서비스/queries 훅 구조 · 캐시 무효화·staleTime · EP 맵 · 목업 규칙 · navigate state=placeholder · `src/types/` 도메인당 1파일 원칙 | **API 배선** · 목업 작성 · 타입 추가 |
| `design-tokens.md` | KRDS 토큰 · Tailwind v4 `@theme` · 새 토큰 절차(cn.ts 등록 포함) · Figma file key/MCP | **토큰 추가** · 스타일 · Figma 대조 |

## 절대 규칙 (요약 — 상세·이유는 해당 rules 파일)

**사용자에게 먼저 물어보고 진행할 것:**
- 새 **공통 컴포넌트**(`base`/`composites`)·새 variant 생성 (도메인 전용 조립물은 예외 — 바로 생성)
- raw shadcn 을 우회한 **Radix 프리미티브 직접 사용** (기존 승인 예외 7종은 재승인 불필요)
- 설계서에서 못 찾은 **항목명(영문 키)을 새로 만들어야 할 때**

**금지:**
- `src/ui/raw/**` 직접 수정 (shadcn CLI 정본 — 스타일 커스텀은 base 에서만)
- `lucide-react`·`@mui/*` import (아이콘 = `Icon` 컴포넌트, Material Symbols 폰트)
- 색상/수치 하드코딩 (KRDS 토큰만 — `tokens.css` → `tailwind.css @theme`)
- CDN `@import`/외부 리소스 (폐쇄망 — self-host)
- `window.scrollTo` (스크롤 주체는 `main#app-scroll`)
- 페이지에서 서비스 직접 import·URL 문자열 (API 는 `queries/bds/{도메인}/queries.ts` 의 `{도메인}Queries` 훅으로만, URL 은 서비스 함수 안에만 — EP 맵 폐기)
- 검증 로직 useState 수작업·제3의 검증 방식 (RHF+zod 2레인만: 입력 폼=직접 스키마, 검색필터=셸 자동 생성)
- 목록 `key={i}` (안정적 고유 id 사용)
- 상세 이동 URL 에 식별자(path 변수·쿼리) — 상세 라우트는 고정 경로 + `navigate(state)` 전달(`api.md`)
- 임의 영문 화면명·임의 항목명 작명 (설계서 영문 화면 ID·항목명 그대로)
- 의미 없는 목업 더미("test", `aaa`) — 설계서 데이터영역 기준으로 실제 응답처럼
- 화면(폴더)별 타입 파일 신설 (`src/types/{도메인}.ts` 도메인당 1파일)
- 컴포넌트별 `.css` 파일 · 개별 `cursor-pointer` (전역 규칙 있음)
- 새 BottomSheet/AlertModal 의 `*Sheet` 전용 래퍼 (컨테이너는 부모 소유, 콘텐츠만 분리)

**기본 원칙:**
- 새 화면 = `/guide` 의 기존 공통 컴포넌트 **조립**이 기본. 신규 생성 전 `base`/`composites` 중복 확인.
- 새 페이지는 `lazy()` + `errorElement={<ErrorPage />}` + `handle` 로 `router.tsx` 등록. `showBottomNav`/`scrollReset` 은 `handle` 직속(`header` 안 X).
- 표/필드는 데이터 배열로 구동. 유사 화면은 페이지 복제 대신 파라미터/config/훅 공유.
- 레퍼런스 화면: 목록 = `PrcmPlanIntgListPage` · 상세 = `PrcmPlanDtlPage`.
- 전역 상태는 `authStore` 하나 (도메인별 store 분리 금지). 코드성 데이터 캐시는 React Query(`staleTime: Infinity`)가 담당 — 별도 store 에 이중 저장 금지.

## PDCA / 문서

- **반입(폐쇄망 이관) 직전에 `docs/closed-network-checklist.md` 를 확인한다** — 미구현 잔여 화면(BD-10 유형별 심사결과 등)·결정 대기 항목·폐쇄망 환경 확인 목록. 반입 전 확인이 필요한 사항이 생기면 이 문서에 추가.
- bkit PDCA 워크플로우 사용. 기능별 plan/design 문서: `docs/01-plan/features/`, `docs/02-design/features/`.
- 활성 기능: `mobile-app-scaffold`(스캐폴딩 — 코드 구현 완료), `krds-design-system`(토큰 + base 컴포넌트 — DO 단계).
- 코드를 바꾸면 해당 design 문서도 동기화한다. 설계서(기획서) 원본은 `docs/spec/` (`docs/spec/README.md` 참고).
