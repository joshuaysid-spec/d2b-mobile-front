# D2B Mobile Front

D2B 모바일 하이브리드 웹앱 프론트엔드. `docs/frontend-architecture.md` 아키텍처를 따른다.

## 기술 스택

React 18 · TypeScript · Vite · TailwindCSS · shadcn/ui · axios · React Query · zustand · React Router

## 시작하기

> ⚠️ 현재는 **스캐폴딩 단계**로, 의존성이 설치되어 있지 않다. 아래 순서로 셋업한다.

```bash
# 1. 의존성 설치
npm install

# 2. shadcn 베이스 컴포넌트 추가 (필요 시)
npx shadcn@latest add button input dialog

# 3. 개발 서버 실행
npm run dev          # http://localhost:5173

# 기타
npm run build        # 타입 체크 + 프로덕션 빌드
npm run lint         # ESLint
npm run format       # Prettier
```

환경 변수는 `.env.example` 를 참고해 `.env.development` / `.env.production` 에 작성한다.

## 폴더 구조

```
src/
├── main.tsx · App.tsx · router.tsx   # 진입점
├── lib/          # [인프라] apiClient, queryClient
├── services/     # [API] 비즈니스 API 함수 (도메인별 추가)
├── queries/      # [API] React Query wrapper (services 와 1:1)
├── hooks/        # [로직] 범용 hook
├── stores/       # [상태] zustand 전역 상태
├── bridge/       # [인프라] 네이티브(WebView) 통신 추상화
├── utils/ constants/ types/ styles/ assets/   # [보조]
└── ui/
    ├── common/   # base(shadcn) · composites · layout
    └── biz/      # home · procurement · notice · notification · mypage · cm
```

## 화면 구성 (스캐폴드)

- 모바일 앱 셸: `AppLayout` = `Header` + 본문 + `BottomNav`
- 라우트 5개: `/`(홈) · `/procurement` · `/notice` · `/notification` · `/mypage`
- **홈**은 링크 허브 — 4개 메뉴 링크로 각 빈 페이지로 이동
- **BottomNav** 4탭(홈/조달/알림/마이) — 현재는 모두 홈으로 이동(추후 탭별 목적지 확정)

## 의존성 방향 규칙 (frontend-architecture.md §11)

```
ui/biz/* → queries, stores, hooks, bridge, utils, constants, types
queries  → services, lib/queryClient
services → lib/apiClient, types, utils, constants
lib/     → (외부 라이브러리만)
```

- 위 레이어는 아래 레이어를 import 가능, 역방향 금지
- 도메인 간 직접 import 금지 (`ui/biz/procurement` ↔ `ui/biz/notice`)
- Page 는 axios 직접 호출 금지 → 반드시 `queries/` 경유
- import 경로는 항상 `@/` alias 사용

## 참고 문서

- 아키텍처: `docs/frontend-architecture.md`
- UI 설계서: `docs/D2BA-AP-3CD-0601.사용자인터페이스설계서-*.pptx`
