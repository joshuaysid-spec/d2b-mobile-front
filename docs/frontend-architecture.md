# 프론트엔드 폴더 구조 문서

## 1. 프로젝트 개요

**아키텍처 정체성:** 표준 React 패턴 기반의 모바일 하이브리드 웹앱 프론트엔드 아키텍처. 웹스퀘어 백엔드와의 도메인 네이밍 정합성, 하이브리드 앱(WebView) 인프라 추상화, 페이지 평탄 구조를 핵심으로 함.

**기술 스택:** React + TypeScript + Vite + TailwindCSS + shadcn/ui + axios + React Query + zustand

**적용 환경:**
- 백엔드: 웹스퀘어
- PC: 웹스퀘어
- 모바일 프론트: React + Vite (본 아키텍처 적용 범위)
- 하이브리드 앱: iOS/Android WebView

---

## 2. 루트 디렉토리 구조

```
project-root/
├── public/                          
├── src/                             
├── .env.development                 
├── .env.production
├── .env.example
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── components.json
├── package.json
└── README.md
```

### 2.1 루트 파일/폴더 설명

| 경로 | 역할 |
|------|------|
| `public/` | 빌드 처리 없이 그대로 배포되는 정적 파일. favicon, robots.txt, PWA manifest 등 고정 URL이 필요한 파일만 위치. 코드에서 import하는 이미지는 `src/assets/`에 둠. |
| `.env.development` | 개발 환경 변수. API URL, 디버그 플래그 등 환경마다 다른 값. Vite가 빌드 시 `import.meta.env.VITE_*`로 주입. |
| `.env.production` | 운영 환경 변수. 동일 구조, 다른 값. |
| `.env.example` | 환경 변수 템플릿. Git에 커밋하여 신규 개발자가 어떤 env 변수가 필요한지 파악 가능. 실제 값은 비워둠. |
| `.gitignore` | Git 추적 제외 파일 목록. `node_modules`, `.env.development/production`, `dist` 등 포함. |
| `.eslintrc.cjs` | ESLint 설정. 코드 품질 규칙, import 제한 규칙(도메인 간 격리 강제) 포함. |
| `.prettierrc` | Prettier 설정. 코드 포매팅 규칙. |
| `index.html` | Vite 앱 엔트리 HTML. `src/main.tsx`를 로드하는 `<div id="root">` 컨테이너. |
| `vite.config.ts` | Vite 빌드 도구 설정. path alias(`@/`), 플러그인, 빌드 옵션 정의. |
| `tsconfig.json` | TypeScript 컴파일 설정. path alias와 동기화 필요. |
| `tailwind.config.ts` | TailwindCSS 설정. 디자인 토큰, 색상, 폰트 등. |
| `components.json` | shadcn/ui 설정. CLI로 컴포넌트 추가 시 어느 경로에 생성할지 정의. |
| `package.json` | 프로젝트 메타정보, 의존성, 스크립트. |
| `README.md` | 프로젝트 소개, 폴더 구조, 의존성 규칙, 시작 가이드. |

---

## 3. src/ 디렉토리 개요

`src/`는 애플리케이션의 모든 소스 코드가 위치하는 루트 폴더이다. Vite 빌드 도구가 이 폴더를 기준으로 번들링을 수행하며, 모든 TypeScript/TSX 파일과 컴포넌트 자산이 이곳에 포함된다.

### 3.1 src/의 역할

- **단일 소스 진입점:** 모든 코드의 시작점인 `main.tsx`가 위치
- **빌드 대상 범위:** Vite는 `src/` 내부 파일만 번들에 포함 (외부의 설정 파일은 제외)
- **Path Alias 기준점:** `@/`는 `src/`를 가리키도록 설정되어 모든 import 경로가 이 폴더 기준으로 작성됨
- **레이어별 관심사 분리:** 인프라/API/상태/UI/유틸을 폴더 단위로 명확히 분리

### 3.2 src/ 구성 원칙

1. **레이어 기반 분리**: 폴더는 코드의 역할(인프라, API, 상태, UI 등)에 따라 분리됨. 도메인별 분리는 각 레이어 내부의 파일/하위 폴더에서 이루어짐.

2. **단방향 의존성**: UI 레이어가 가장 위, 외부 라이브러리 래퍼(`lib/`)가 가장 아래. 위에서 아래로만 import 가능.

3. **도메인 네이밍 일관성**: `services/account.ts`, `queries/account.ts`, `ui/biz/account/`처럼 동일 도메인은 동일한 폴더/파일명을 사용해 추적 용이성 확보.

4. **평탄 구조 우선**: 불필요한 폴더 중첩을 피하고 한 폴더 안에서 파일명 컨벤션으로 구분(`*Page.tsx` 등). 도메인이 비대해질 때만 하위 폴더로 분리.

### 3.3 src/ 폴더 구조 한눈에 보기

```
src/
├── main.tsx                # 앱 부트스트랩 (Vite 엔트리)
├── App.tsx                 # 최상위 Provider 래핑
├── router.tsx              # 라우트 정의
│
├── lib/                    # [인프라] 외부 라이브러리 설정
├── services/               # [API] 비즈니스 API 함수
├── queries/                # [API] React Query wrapper
├── hooks/                  # [로직] 범용 hook
├── stores/                 # [상태] 전역 상태 (zustand)
├── bridge/                 # [인프라] 네이티브 통신 추상화
│
├── utils/                  # [보조] 순수 함수 유틸
├── constants/              # [보조] 환경 무관 고정값
├── types/                  # [보조] 전역 타입
├── styles/                 # [보조] 전역 스타일
├── assets/                 # [보조] 이미지/아이콘
│
└── ui/                     # [UI] 프레젠테이션 레이어
    ├── common/             # 공통 컴포넌트 (base, composites, layout)
    └── biz/                # 도메인별 페이지/컴포넌트
```

### 3.4 src/ 레이어 분류

| 레이어 | 폴더 | 책임 | 의존 방향 |
|--------|------|------|----------|
| **진입점** | `main.tsx`, `App.tsx`, `router.tsx` | 앱 부트스트랩, 라우팅 | 모든 레이어 사용 |
| **UI** | `ui/` | 화면 렌더링, 사용자 이벤트 | API, 상태, 보조 레이어 사용 |
| **API** | `services/`, `queries/` | 백엔드 통신, 서버 상태 | 인프라 레이어 사용 |
| **상태/로직** | `stores/`, `hooks/` | 클라이언트 상태, 공통 로직 | 인프라, 보조 레이어 사용 |
| **인프라** | `lib/`, `bridge/` | 외부 시스템 연결 (HTTP, 네이티브) | 외부 라이브러리만 의존 |
| **보조** | `utils/`, `constants/`, `types/`, `styles/`, `assets/` | 유틸리티, 정적 자원 | 외부 의존 없음 |

### 3.5 src/ 외부와의 관계

| 항목 | 위치 | src/와의 관계 |
|------|------|--------------|
| 환경 변수 | `.env.*` (루트) | `import.meta.env`로 `lib/apiClient.ts` 등에서 읽음 |
| Vite 설정 | `vite.config.ts` (루트) | `src/`의 path alias, 빌드 옵션 정의 |
| TS 설정 | `tsconfig.json` (루트) | `src/`의 path alias, 컴파일 옵션 정의 |
| 정적 파일 | `public/` (루트) | 빌드 시 그대로 복사. `src/` 코드에서 import 불가, URL로만 참조 |
| 의존성 | `node_modules/` (루트) | `src/` 코드가 `import`로 사용 |

### 3.6 src/ 작업 시 주의사항

1. **import는 항상 `@/`로 시작**: 상대경로(`../../`) 대신 path alias 사용 → `@/services/account`
2. **`src/` 외부 파일은 import 불가**: 루트의 `.env`나 `public/`의 파일은 import 대상이 아님 (다른 방식으로 접근)
3. **빌드 결과물 위치**: `src/`의 코드는 빌드 시 루트의 `dist/` 폴더로 출력됨
4. **HMR 대상**: 개발 서버 실행 시 `src/` 내부 파일 변경만 Hot Module Replacement 적용

---

## 4. src/ 전체 디렉토리 구조

```
src/
├── main.tsx
├── App.tsx
├── router.tsx
├── lib/
│   ├── apiClient.ts
│   └── queryClient.ts
├── services/
│   ├── account.ts
│   ├── transfer.ts
│   ├── auth.ts
│   └── common.ts
├── queries/
│   ├── account.ts
│   ├── transfer.ts
│   ├── auth.ts
│   └── common.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useBridge.ts
│   └── useScrollLock.ts
├── stores/
│   └── authStore.ts            # 인증·사용자 프로필·알림 배지 통합 store
├── bridge/
│   ├── native.ts
│   ├── handlers/
│   │   ├── camera.ts
│   │   ├── auth.ts
│   │   ├── push.ts
│   │   └── storage.ts
│   ├── types.ts
│   └── index.ts
├── utils/
│   ├── format.ts
│   ├── validate.ts
│   └── mask.ts
├── constants/
│   ├── codes.ts
│   ├── routes.ts
│   ├── regex.ts
│   ├── storage.ts
│   └── business.ts
├── types/
│   ├── api.ts
│   └── domain.ts
├── styles/
│   ├── globals.css
│   └── tailwind.css
├── assets/
│   ├── images/
│   └── icons/
└── ui/
    ├── common/
    │   ├── base/
    │   ├── composites/
    │   └── layout/
    └── biz/
        ├── home/
        ├── cm/
        │   ├── auth/
        │   ├── terms/
        │   └── error/
        ├── account/
        └── transfer/
```

---

## 5. 진입점 파일

| 파일 | 역할 |
|------|------|
| `src/main.tsx` | Vite 앱 엔트리포인트. `ReactDOM.createRoot()` 호출하여 `App.tsx`를 DOM에 마운트. 수정 거의 없음. |
| `src/App.tsx` | 최상위 앱 컴포넌트. QueryClientProvider, RouterProvider, 전역 ErrorBoundary 등 Provider 래핑. |
| `src/router.tsx` | 라우트 정의 단일 파일. `createBrowserRouter`로 페이지-경로 매핑. lazy loading 적용. |

---

## 6. 인프라 레이어

### 6.1 `lib/` - 외부 라이브러리 래퍼

외부 라이브러리(axios, React Query 등)의 인스턴스 생성과 설정을 담당하는 인프라 레이어. 비즈니스 로직 없이 라이브러리 초기화만 수행.

| 파일 | 역할 |
|------|------|
| `lib/apiClient.ts` | axios 인스턴스 생성 + 인터셉터 설정. baseURL은 `.env`에서 가져옴. 요청 시 인증 토큰 자동 첨부, 응답 시 웹스퀘어 공통 응답 포맷(`{code, message, data}`) 언래핑, 세션 만료 처리 담당. |
| `lib/queryClient.ts` | React Query의 QueryClient 인스턴스. 전역 staleTime, retry 정책 등 기본 옵션 정의. |

**의존 방향:** `services/`가 `lib/apiClient`를 import해서 사용. `lib/`은 외부 라이브러리만 의존.

### 6.2 `bridge/` - 네이티브 통신 추상화

하이브리드 앱 환경에서 WebView와 네이티브(iOS/Android) 간 통신을 추상화하는 레이어. OS별 분기 처리, 브라우저 개발 환경에서의 mock 응답을 담당.

| 파일/폴더 | 역할 |
|----------|------|
| `bridge/native.ts` | OS 감지 + postMessage 추상화. iOS의 `webkit.messageHandlers`, Android의 `AndroidBridge` 차이를 흡수. |
| `bridge/handlers/camera.ts` | 카메라 호출 인터페이스. `bridge.camera.take()` 형태로 노출. |
| `bridge/handlers/auth.ts` | 생체인증(지문/얼굴) 호출. |
| `bridge/handlers/push.ts` | 푸시 알림 토큰 조회/등록. |
| `bridge/handlers/storage.ts` | 네이티브 보안저장소(Keychain/Keystore) 접근. 인증 토큰 등 민감 정보 저장. |
| `bridge/types.ts` | 네이티브 통신 메시지 타입 정의. |
| `bridge/index.ts` | 통합 export. 컴포넌트에서 `import { bridge } from '@/bridge'`로 사용. |

---

## 7. API 레이어

### 7.1 `services/` - 비즈니스 API 함수

도메인별 API 호출 함수 모음. `lib/apiClient`를 사용해 HTTP 요청을 보내고, 백엔드 응답을 프론트 도메인 모델로 변환. 순수 async 함수로 React hook이 아님.

| 파일 | 역할 |
|------|------|
| `services/account.ts` | 계좌 도메인 API. `accountService` 객체로 export. `getList()`, `getDetail()`, `close()` 등 메소드 포함. |
| `services/transfer.ts` | 이체 도메인 API. `transferService` 객체. |
| `services/auth.ts` | 인증 도메인 API. 로그인/로그아웃/토큰 갱신. |
| `services/common.ts` | 공통 API. 코드값 조회, 약관 조회, 공지사항 등 도메인 무관 공통 API. `commonService` 객체. |

**처리 흐름:**
1. 프론트 변수명 → 백엔드 변수명 변환 (예: `customerNo` → `custNo`)
2. `apiClient.post()` 호출
3. 백엔드 응답을 프론트 도메인 모델로 매핑 (예: `acntNo` → `accountNumber`)
4. 도메인 모델 반환

**파일 내부 구조 예시:**
```typescript
// services/account.ts
import { apiClient } from '@/lib/apiClient'
import type { Account } from '@/types/domain'

export const accountService = {
  async getList(params: { customerNo: string }): Promise<Account[]> {
    const response = await apiClient.post('/account/list', {
      custNo: params.customerNo,
    })
    return response.map(toAccount)
  },

  async getDetail(accountNo: string): Promise<Account> {
    const response = await apiClient.post('/account/detail', {
      acntNo: accountNo,
    })
    return toAccount(response)
  },

  async close(accountNo: string, reason: string): Promise<void> {
    await apiClient.post('/account/close', {
      acntNo: accountNo,
      closeRsnCd: reason,
    })
  },
}

function toAccount(res: any): Account {
  return {
    accountNumber: res.acntNo,
    balance: Number(res.blncAmt),
    // ...
  }
}
```

### 7.2 `queries/` - React Query Wrapper

`services/`의 함수를 `useQuery`/`useMutation`으로 감싸 캐싱, 로딩/에러 상태, 캐시 무효화를 담당하는 hook 모음. 페이지에서 직접 호출하는 인터페이스.

| 파일 | 역할 |
|------|------|
| `queries/account.ts` | 계좌 도메인 hook. `useAccountList()`, `useAccountDetail()`, `useCloseAccount()` 등. queryKey 중앙 관리(`accountKeys`). |
| `queries/transfer.ts` | 이체 도메인 hook. |
| `queries/auth.ts` | 인증 도메인 hook. |
| `queries/common.ts` | 공통 API hook. `useCodeList()`, `useTerms()` 등. |

**`services/` ↔ `queries/` 1:1 매칭 원칙:** 도메인 단위로 두 폴더에 같은 이름의 파일이 짝지어짐.

**파일 내부 구조 예시:**
```typescript
// queries/account.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account'

export const accountKeys = {
  all: ['accounts'] as const,
  list: (customerNo: string) => [...accountKeys.all, 'list', customerNo] as const,
  detail: (id: string) => [...accountKeys.all, 'detail', id] as const,
}

export function useAccountList(customerNo: string) {
  return useQuery({
    queryKey: accountKeys.list(customerNo),
    queryFn: () => accountService.getList({ customerNo }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCloseAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ accountNo, reason }: { accountNo: string; reason: string }) =>
      accountService.close(accountNo, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
    },
  })
}
```

---

## 8. 상태/로직 레이어

### 8.1 `stores/` - 전역 상태

zustand 기반 전역 상태 관리. 서버 데이터가 아닌 클라이언트 상태(인증 토큰, 사용자 정보, UI 상태)만 관리. 서버 데이터는 React Query가 담당.

| 파일 | 역할 |
|------|------|
| `stores/authStore.ts` | 인증 상태(로그인 여부, 토큰). |
| `stores/userStore.ts` | 사용자 정보(고객번호, 이름 등). |

### 8.2 `hooks/` - 범용 hook

도메인과 무관한 범용 커스텀 hook. API 호출과 관련 없음.

| 파일 | 역할 |
|------|------|
| `hooks/useDebounce.ts` | 입력값 debounce 처리. |
| `hooks/useBridge.ts` | bridge 호출을 컴포넌트에서 쉽게 쓰는 wrapper. |
| `hooks/useScrollLock.ts` | 모달 오픈 시 배경 스크롤 잠금. |

---

## 9. 보조 레이어

### 9.1 `utils/` - 순수 함수 유틸

부수효과 없는 순수 함수 모음. React에 의존하지 않음.

| 파일 | 역할 |
|------|------|
| `utils/format.ts` | 금액(`1500000` → `1,500,000원`), 날짜 포맷 함수. |
| `utils/validate.ts` | 입력값 검증 함수(이메일, 전화번호, 주민번호 등). |
| `utils/mask.ts` | 민감정보 마스킹(계좌번호, 전화번호 일부 가림). |

### 9.2 `constants/` - 환경 무관 고정값

코드 전체에서 사용하는 매직 넘버/스트링 제거용. `.env`와 달리 환경마다 바뀌지 않는 값.

| 파일 | 역할 |
|------|------|
| `constants/codes.ts` | 백엔드 응답코드/에러코드 상수. `RESPONSE_CODE.SUCCESS = '0000'` 등. |
| `constants/routes.ts` | 라우트 경로 상수. `ROUTES.ACCOUNT.LIST = '/account'` 등. |
| `constants/regex.ts` | 정규식 상수. 전화번호/주민번호/계좌번호 패턴. |
| `constants/storage.ts` | localStorage/sessionStorage 키 상수. |
| `constants/business.ts` | 비즈니스 규칙 상수. 이체 한도, 세션 타임아웃, 페이지네이션 크기 등. |

### 9.3 `types/` - 전역 타입

여러 파일에서 공유하는 TypeScript 타입 정의.

| 파일 | 역할 |
|------|------|
| `types/api.ts` | API 요청/응답 타입. 백엔드 모델(`AccountResponse` 등) 정의. |
| `types/domain.ts` | 프론트 도메인 모델(`Account`, `Transfer` 등) 정의. |

### 9.4 `styles/` - 전역 스타일

| 파일 | 역할 |
|------|------|
| `styles/globals.css` | 전역 CSS 리셋, 기본 스타일. |
| `styles/tailwind.css` | Tailwind 지시문(`@tailwind base/components/utilities`). |

### 9.5 `assets/` - 정적 파일

코드에서 import하여 사용하는 이미지/아이콘. Vite가 빌드 시 해시 처리 및 최적화.

| 폴더 | 역할 |
|------|------|
| `assets/images/` | 일반 이미지(로고, 배너 등). |
| `assets/icons/` | SVG 아이콘. |

---

## 10. UI 레이어 (`ui/`)

프레젠테이션 레이어. 모든 화면 관련 컴포넌트가 위치. 비즈니스 로직은 `queries/`, `stores/`, `hooks/`에 위임하고 UI 렌더링만 담당.

### 10.1 `ui/common/` - 공통 UI

#### `ui/common/base/` - 1차 베이스 컴포넌트
shadcn/ui에서 가져와 디자인 토큰에 맞춰 1차 커스텀한 원자 단위 컴포넌트. `components.json`의 `aliases.ui` 설정으로 `npx shadcn add` 시 자동 배치.

예: `Button.tsx`, `Input.tsx`, `Dialog.tsx`, `Select.tsx`, `Checkbox.tsx`

#### `ui/common/composites/` - 조합 컴포넌트
`base/` 컴포넌트를 2개 이상 조합한 컴포넌트. **도메인 무관** 컴포넌트만 위치(도메인 타입을 props로 받지 않음).

예: `SearchBar.tsx` (Input + Button), `FormField.tsx` (Label + Input + ErrorText), `ConfirmModal.tsx` (Dialog + Button)

#### `ui/common/layout/` - 레이아웃 컴포넌트
앱 전체 레이아웃 컴포넌트.

예: `Header.tsx`, `BottomNav.tsx`, `PageContainer.tsx`

### 10.2 `ui/biz/` - 도메인별 페이지

비즈니스 도메인별 페이지와 도메인 전용 컴포넌트. 폴더명은 백엔드 API 도메인과 일치.

**구조 원칙: 평탄 구조**
- 페이지 파일은 `*Page.tsx` 접미사
- 그 외는 도메인 내 공유 컴포넌트
- `pages/`와 `components/`로 분리하지 않음
- 예외적으로 복잡한 페이지(전용 컴포넌트 3개 이상, 다단계 마법사)는 PascalCase 폴더로 묶음

#### `ui/biz/home/` - 메인
| 파일 | 역할 |
|------|------|
| `HomePage.tsx` | 메인 페이지 |
| `HomeBanner.tsx` | 메인 전용 컴포넌트 |

#### `ui/biz/cm/` - 공통업무
로그인, 약관, 에러 등 도메인에 속하지 않는 공통 화면.

| 하위 폴더 | 내용 |
|----------|------|
| `cm/auth/` | 로그인, 생체인증, 간편비밀번호 페이지/컴포넌트 |
| `cm/terms/` | 약관 동의/조회 |
| `cm/error/` | 404, 에러 페이지 |

#### `ui/biz/account/` - 계좌 도메인 (예시)
```
account/
├── AccountPage.tsx                   # 메인 페이지 (단순)
├── AccountDetail/                    # 복잡한 페이지 (폴더화)
│   ├── AccountDetailPage.tsx
│   └── AccountDetailList.tsx
├── AccountCreate/                    # 다단계 페이지
│   ├── AccountCreatePage.tsx
│   ├── TypeStep.tsx
│   ├── TermsStep.tsx
│   └── InfoStep.tsx
├── AccountClosePage.tsx              # 단순 페이지
├── AccountTransactionListPage.tsx
├── AccountCard.tsx                   # 도메인 내 공유 컴포넌트
├── BalanceCard.tsx
└── AccountTypeBadge.tsx
```

#### `ui/biz/transfer/` - 이체 도메인
동일 구조 적용.

---

## 11. 의존성 방향 규칙

```
ui/biz/* ─→ queries/, stores/, hooks/, bridge/, utils/, constants/, types/
queries/ ─→ services/, lib/queryClient
services/ ─→ lib/apiClient, types/, utils/, constants/
lib/ ─→ (외부) axios, React Query, import.meta.env
bridge/ ─→ types/, constants/
```

**규칙:**
1. 위 레이어는 아래 레이어를 import 가능
2. 아래 레이어는 위 레이어 import 금지
3. 도메인 간 직접 import 금지 (`ui/biz/account/` ↔ `ui/biz/transfer/` 금지)
4. Page는 axios 직접 호출 금지 → 반드시 `queries/` 거침
5. Service는 React hook 사용 금지

---

## 12. 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 페이지 컴포넌트 | `{Domain}{Function}Page.tsx` | `AccountListPage.tsx` |
| 일반 컴포넌트 | PascalCase, 도메인 prefix | `AccountCard.tsx` |
| 도메인 폴더 | lowercase | `account/`, `transfer/` |
| 페이지 폴더 (예외) | PascalCase | `AccountDetail/` |
| Service 객체 | `{도메인}Service` | `accountService` |
| Service 메소드 | camelCase 동사 | `getList()`, `close()` |
| React Query hook | `use{대상}` 또는 `use{동사}{대상}` | `useAccountList()`, `useCloseAccount()` |
| 범용 hook | `use{기능}` | `useDebounce()` |
| Store | `{도메인}Store` | `authStore` |
| 상수 객체 | UPPER_SNAKE | `RESPONSE_CODE`, `ROUTES` |
| 타입 | PascalCase | `Account`, `AccountResponse` |
| 환경변수 | `VITE_` prefix | `VITE_API_BASE_URL` |
| 오버레이 래퍼 (풀팝업) | `{Screen}FullPopup.tsx` | `PrcmPlanDtl_OpnnDtlFullPopup.tsx` |
| 오버레이 콘텐츠 (바텀시트/모달) | `{Screen}.tsx` (래퍼 없음) | `AnlPrcmPlanDtl.tsx`, `PrcmPlan_NotiAply.tsx` |

> **오버레이 컨테이너 조립 규칙:** 전용 래퍼는 **`FullPopup`(화면급 무거운 풀팝업)에만** 만들고 접미사는 감싸는 컨테이너명 그대로 `FullPopup`. **`BottomSheet`·`AlertModal`은 래퍼를 만들지 않고**, 부모(페이지/탭 콘텐츠)가 컨테이너를 직접 렌더한 뒤 콘텐츠만 분리한 컴포넌트를 슬롯에 끼운다(컨테이너 `title`/`footer`/`open` props 는 부모 소유). 상세·근거는 `CLAUDE.md` "컨테이너 타입 접미사" 참조(단일 출처).

---

## 13. 값 분류 기준

| 값의 성격 | 위치 |
|----------|------|
| 환경별로 달라짐(API URL, 디버그 플래그) | `.env` |
| 환경 무관 고정값(응답코드, 정규식, 비즈니스 규칙) | `constants/` |
| 빌드 후 변경 불가, 코드에서 import | `assets/` 또는 `constants/` |
| 사용자별/세션별 변경 | `stores/` |
| 서버에서 받음 | `queries/`로 조회 |

---

## 14. 컴포넌트 위치 판단 기준

| 조건 | 위치 |
|------|------|
| shadcn에서 가져와 커스텀한 원자 컴포넌트 | `ui/common/base/` |
| `base/` 조합 + 도메인 타입 의존 없음 + 여러 도메인에서 사용 | `ui/common/composites/` |
| 앱 전체 레이아웃 | `ui/common/layout/` |
| 특정 도메인 페이지들이 공유 | `ui/biz/{도메인}/` 평탄 위치 |
| 특정 페이지에서만 사용(폴더화된 페이지) | 해당 페이지 폴더 안 |

---

## 15. 데이터 흐름

### 15.1 조회 흐름 (Query)

```
[Page] useAccountList(customerNo)
  ↓
[queries/account.ts] useQuery 실행, 캐시 확인
  ↓ (캐시 없으면)
[services/account.ts] accountService.getList() 호출
  ↓ 파라미터 가공 (custNo 등)
[lib/apiClient.ts] axios.post(), 인터셉터로 토큰 첨부
  ↓
[백엔드 응답]
  ↓
[lib/apiClient.ts] 응답 인터셉터: code 확인, data 언래핑
  ↓
[services/account.ts] 응답 매핑 (백엔드 모델 → 도메인 모델)
  ↓
[queries/account.ts] useQuery가 캐시 저장 + data 반환
  ↓
[Page] data 렌더링
```

### 15.2 변경 흐름 (Mutation)

```
[Page] useCloseAccount의 mutate() 호출
  ↓
[queries] mutation 실행
  ↓
[services] accountService.close() 호출
  ↓
[apiClient] 요청 → 응답
  ↓
[queries] onSuccess: 캐시 무효화 (invalidateQueries)
  ↓
[Page] 자동 재조회 + 후속 처리
```

### 15.3 페이지 코드 예시

```typescript
// ui/biz/account/AccountListPage.tsx
import { useAccountList } from '@/queries/account'
import { useAuthStore } from '@/stores/authStore'
import { AccountCard } from './AccountCard'

export function AccountListPage() {
  const customerNo = useAuthStore((s) => s.user.customerNo)
  const { data, isLoading, error } = useAccountList(customerNo)

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />

  return (
    <div className="p-4 space-y-3">
      {data?.map(account => (
        <AccountCard key={account.accountNumber} account={account} />
      ))}
    </div>
  )
}
```

---

## 16. 시작 가이드

### 16.1 초기 셋업 순서

1. **Vite + TS + Tailwind 보일러플레이트 생성**
2. **위 폴더 구조 빈 폴더로 생성** (`.gitkeep`)
3. **path alias 설정** (`vite.config.ts`, `tsconfig.json`)
4. **shadcn init + `components.json` alias 수정**
5. **`lib/apiClient.ts` 작성** - axios 인스턴스 + 인터셉터
6. **`bridge/` 뼈대 + mock 구현** - 브라우저에서도 개발 가능
7. **`services/common.ts` 작성** - 공통코드 조회 등
8. **`queries/common.ts` 작성** - React Query wrapper
9. **`constants/codes.ts`, `routes.ts`** - 백엔드 협의 후
10. **`ui/common/layout/` 구축** - Header, BottomNav
11. **첫 페이지 (`home/HomePage.tsx`) 만들면서 전체 흐름 검증**
12. **README 작성**

### 16.2 핵심 설정 파일

**`vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**`components.json` (shadcn):**
```json
{
  "aliases": {
    "ui": "@/ui/common/base",
    "components": "@/ui/common",
    "utils": "@/utils",
    "lib": "@/lib"
  }
}
```

**`.env.example`:**
```bash
VITE_API_BASE_URL=https://api.example.com
VITE_BRIDGE_DEBUG=false
```

---

## 17. 아키텍처 정체성 요약

**한 줄 정의:**
> 표준 React 패턴(`services/` + `queries/`) + 웹스퀘어 도메인 네이밍(`biz`, `cm`) + 하이브리드 앱 인프라(`bridge/`) + 평탄 UI 구조를 결합한 모바일 프론트 아키텍처

**6가지 핵심 결정:**
1. **`lib/apiClient.ts`** - 외부 라이브러리 래퍼 분리 (axios)
2. **`services/` + `queries/` 1:1 매칭** - API 호출과 React Query 분리
3. **`ui/biz/` 도메인 격리** - 웹스퀘어 메뉴 단위와 매핑
4. **평탄 페이지 구조** - `pages/`+`components/` 분리 안 함, `*Page.tsx` 네이밍으로 구분
5. **`base/` + `composites/` 2단 디자인 시스템** - shadcn 기반
6. **`bridge/` 1급 시민** - 네이티브 통신 명시 추상화
