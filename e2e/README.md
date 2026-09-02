# e2e — Playwright 스모크/접근성 테스트

> 실행: `npm run test:e2e` (또는 `npx playwright test`)
> dev 서버는 webServer 설정이 자동 기동한다(포트 5173 고정, 이미 떠 있으면 재사용) — 별도 준비 없이 명령 한 번으로 끝.
> 뷰포트: 모바일(Pixel 5) · chromium 단일 프로젝트. CI 는 GitHub 어노테이션 + HTML 리포트, 로컬은 list 리포터.

## 스펙 구성 (3개)

| 파일 | 검증 대상 | 방식 |
|------|----------|------|
| `route-smoke.spec.ts` | **앱 전 라우트**(op/bd/wm/cm 약 40개) | 각 URL 직접 진입 → ① ErrorPage/404 폴백 없음 ② pageerror(컴포넌트 크래시) 0 ③ console.error(key 누락·prop 타입 회귀) 0 |
| `guide-smoke.spec.ts` | **전 공통 컴포넌트**(/guide 카탈로그) | 모든 `<section id>` 렌더 + 런타임 에러 0 / axe 접근성 critical 차단(카탈로그 노이즈 `button-name` 제외, serious 이하는 리포트만) |
| `wheelpicker-date.spec.ts` | WheelPicker 년/월/일 데모 거동 | 년·월 변경 시 일수 변동(28~31)·윤년 반영·말일 클램프 — 옵션 클릭이 onChange 를 직접 호출해 결정적 |

## 설계 의도

- **광역 그물 2장 + 정밀 1장** 구조. 라우트 스모크는 "화면이 빠졌거나(라우트 미등록→404) 열자마자 터지는지"를, /guide 스모크는 "전 컴포넌트가 렌더되고 접근성 위반이 없는지"를 각각 한 번에 훑는다. 개별 화면 시나리오 테스트는 두지 않는다(목업 데이터 변동에 취약).
- 상세 라우트는 URL 식별자 없이 고정 경로 + `navigate(state)` 구조라(2026-08-12), state 없이 직접 진입하면 fallback 목업 또는 목록 리다이렉트가 렌더된다 — 어느 쪽이든 "크래시 없음"이 검증 대상.

## 유지보수 규칙

- **새 화면(라우트) 추가 시** → `route-smoke.spec.ts` 의 `ROUTES` 배열에 `{ path, name }` 1줄 추가.
- **새 공통 컴포넌트 추가 시** → `/guide` 카탈로그에 등록만 하면 guide 스모크에 자동 포함(스펙 수정 불필요).
- **ErrorPage 타이틀 문구 변경 시** → `route-smoke.spec.ts` 의 `ERROR_TITLES` 동기화.
- axe 차단 예외는 `guide-smoke.spec.ts` 의 `CATALOG_NOISE_RULES` 로만 관리(현재 `button-name` 1건 — 카탈로그가 컨트롤을 라벨 없이 단독 시연해 생기는 노이즈로, 실제 앱에선 InputLabel 연결로 위반 아님).
