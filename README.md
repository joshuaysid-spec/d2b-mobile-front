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

> 상세: `docs/frontend-architecture.md` §3 (레이어 분류·의존성 방향 포함)

```
src/
├── main.tsx · App.tsx · router.tsx   # 진입점 — 부트스트랩·Provider·라우트 정의
│
├── lib/          # [인프라] 외부 라이브러리 설정 (apiClient, queryClient)
├── bridge/       # [인프라] 네이티브(WebView) 통신 추상화
├── services/     # [API] 비즈니스 API 함수 — {대메뉴}/{도메인}.ts (bds·cbs·cts·tss = 실 URL 1단), URL 인라인·목업 분기는 여기만
├── queries/      # [API] React Query wrapper — services 와 동일 체계 (페이지는 이것만 호출)
├── stores/       # [상태] zustand 전역 상태 (authStore 단일)
├── hooks/        # [로직] 범용 hook
│
├── utils/        # [보조] 순수 함수 유틸 (format, validators, cn …)
├── constants/    # [보조] 환경 무관 고정값 (routes, menuLabels, codes …)
├── types/        # [보조] 전역 타입 — {도메인}.ts = tobe(실응답 확정분) · mock/ = 더미, 아래 "타입 이원화" 참조
├── styles/       # [보조] 전역 스타일 (KRDS 토큰)
├── assets/       # [보조] 이미지·아이콘·폰트 (폐쇄망 — 전부 self-host)
│
└── ui/           # [UI] 프레젠테이션 레이어
    ├── raw/      # shadcn CLI 정본 (직접 수정 금지)
    ├── common/   # 공통 컴포넌트 — base(raw 래핑) · composites · layout · feedback
    ├── biz/      # 도메인별 화면 — op(조달계획) bd(입찰) ct(계약) ex(이행) wm(대금청구)
    │             #   ts(업무지원) st(통계) fb(자유게시판) cm(공통·인증·마이페이지)
    └── dev/      # 개발용 (/guide 컴포넌트 가이드)
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

## 타입 이원화 — Mock / tobe (2026-08-25, 폐쇄망 연동 대비)

폐쇄망에서 페이지를 **하나씩** 실 API 로 붙일 때, 공유 타입을 고치면 같은 타입을 쓰는
다른 페이지들이 연쇄 컴파일 에러로 깨지는 문제를 막기 위해 타입을 두 계층으로 분리했다.

```
src/types/
├── mock/{도메인}.ts   # 더미(설계서 기반) 타입 — 타입명은 원명 그대로(경로로 구분)
├── {도메인}.ts        # tobe — 폐쇄망 실응답으로 확인한 타입만 정의 (추정 정의 금지)
└── api.ts · file.ts · search-filter.ts   # 확정분 — Mock 대상 아님(봉투·파일업로드·UI 설정)
```

**페이지 전환 절차 (폐쇄망에서 한 페이지당):**

1. 실응답 확인 → `types/{도메인}.ts`(tobe)에 진짜 타입 정의
2. **그 페이지 + 그 페이지가 쓰는 서비스 함수·훅만** import 경로를 `@/types/mock/{도메인}` → `@/types/{도메인}` 으로 교체
   (+ 해당 서비스 함수의 `if (USE_MOCK)` 분기 제거 = 그 함수만 실호출 확정)
3. 나머지 페이지들은 Mock 타입·목업으로 계속 동작 — 연쇄 에러 없음
4. 전 화면 전환 완료 시 `types/mock/` 폴더째 + 잔여 목업(mocks/) 통삭제

새 화면을 지금(외부) 만들 때의 더미 타입도 `types/mock/` 에 추가한다(타입명은 원명 그대로 — 더미/확정 구분은 폴더 경로가 담당).
상세 규칙: `docs/rules/api.md` "타입 정의" 절.

## 참고 문서

- 아키텍처: `docs/frontend-architecture.md`
- UI 설계서: `docs/D2BA-AP-3CD-0601.사용자인터페이스설계서-*.pptx`
