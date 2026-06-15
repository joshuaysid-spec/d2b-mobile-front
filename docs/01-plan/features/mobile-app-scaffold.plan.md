---
template: plan
version: 1.3
feature: mobile-app-scaffold
date: 2026-05-21
author: gongjiyeon
project: d2b-mobile-front
projectVersion: 0.1.0
---

# mobile-app-scaffold Planning Document

> **Summary**: `docs/frontend-architecture.md` 구조를 그대로 따르는 React 모바일 웹앱 초기 스캐폴딩 — 보일러플레이트 설정 + 전체 레이어 폴더 골격 + BottomNav/홈 링크 허브/빈 페이지
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: gongjiyeon
> **Date**: 2026-05-21
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | D2B 모바일 프론트 프로젝트가 빈 상태(`docs/`만 존재). 표준화된 폴더 구조와 화면 골격이 없어 기능 개발에 착수할 수 없음. |
| **Solution** | `frontend-architecture.md`의 레이어 구조를 1:1로 스캐폴딩하고, shadcn/ui 기반 BottomNav + 홈 링크 허브 + 빈 페이지로 모바일 앱 셸을 구성. |
| **Function/UX Effect** | 바텀네비가 달린 모바일 앱 셸이 동작하고, 홈 화면의 링크로 4개 빈 페이지를 오갈 수 있음. 개발자는 도메인별 빈 폴더/페이지를 즉시 채워나갈 수 있음. |
| **Core Value** | 아키텍처 문서 ↔ 코드 구조 1:1 정합성 확보, 일관된 기준으로 빠른 기능 개발 착수. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 빈 프로젝트에 표준 폴더 구조·화면 골격이 없어 개발 착수 불가 |
| **WHO** | D2B 모바일 프론트 개발자 (조달 업무 하이브리드 웹앱) |
| **RISK** | Node.js 미설치로 빌드/lint 검증 지연 · 아키텍처 문서와 폴더 구조 불일치 |
| **SUCCESS** | 5개 라우트 동작 · 폴더 구조가 문서와 1:1 · (설치 후) lint·build 통과 |
| **SCOPE** | Phase 1 보일러플레이트 설정 → Phase 2 전체 레이어 폴더 골격 → Phase 3 UI(BottomNav/Home/빈 페이지) |

---

## 1. Overview

### 1.1 Purpose

빈 상태의 `d2b-mobile-front` 프로젝트에 `docs/frontend-architecture.md`에 정의된 폴더 구조와 컨벤션을 그대로 적용하여, 이후 모든 기능 개발이 일관된 기준 위에서 진행되도록 초기 골격을 만든다. 동시에 모바일 앱 셸(바텀네비 + 라우팅 + 홈 링크 허브)이 실제로 동작하는 것까지 확인한다.

### 1.2 Background

- 백엔드/PC는 웹스퀘어, 모바일 프론트만 React + Vite로 신규 구축 (하이브리드 앱 WebView 탑재 예정).
- `docs/`에 아키텍처 문서와 UI 설계서(PPT: 공통/조달계획)가 이미 존재하나 코드 베이스는 0% 상태.
- 아키텍처 문서가 폴더 구조·네이밍·의존성 규칙을 상세히 규정하고 있어, 설계 자유도가 낮고 "문서대로 구현"이 핵심.

### 1.3 Related Documents

- 아키텍처: `docs/frontend-architecture.md`
- UI 설계서: `docs/D2BA-AP-3CD-0601.사용자인터페이스설계서-00공통-모바일_v0.6.pptx`, `...-01조달계획-모바일_v0.6.pptx`

---

## 2. Scope

### 2.1 In Scope

- [ ] Vite + React + TypeScript 보일러플레이트 설정 파일 일체 (`package.json`, `vite.config.ts`, `tsconfig*.json`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, `index.html`, `.env.example`/`.env.development`, `.eslintrc.cjs`, `.prettierrc`, `.gitignore`)
- [ ] `src/` 전체 레이어 폴더 골격 — `lib/ services/ queries/ hooks/ stores/ bridge/ utils/ constants/ types/ styles/ assets/ ui/` 및 하위 구조 (`.gitkeep`)
- [ ] 진입점 3종: `main.tsx`, `App.tsx`(Provider 래핑), `router.tsx`
- [ ] path alias `@/` 설정 (vite.config.ts ↔ tsconfig.json 동기화)
- [ ] 인프라 최소 골격: `lib/apiClient.ts`, `lib/queryClient.ts`, `bridge/` mock 뼈대
- [ ] 레이아웃: `ui/common/layout/` — `BottomNav.tsx`, `Header.tsx`, `PageContainer.tsx`
- [ ] `ui/biz/home/HomePage.tsx` — 4개 메뉴 링크를 가진 링크 허브
- [ ] 빈 페이지 4종: `procurement`, `notice`, `notification`, `mypage` (각 `*Page.tsx`)
- [ ] 라우트 5개: `/`, `/procurement`, `/notice`, `/notification`, `/mypage`
- [ ] `constants/routes.ts` 경로 상수
- [ ] zustand store 골격(`authStore.ts`), React Query Provider 연결
- [ ] `README.md` (구조/시작 가이드)

### 2.2 Out of Scope

- `npm install` 및 dev 서버 기동 — 사용자가 직접 수행 (본 작업은 파일 골격까지)
- shadcn `base/` 컴포넌트 실제 추가(`npx shadcn add`) — 설치 후 수행, 본 작업은 `components.json` 설정까지
- 실제 백엔드 API 연동, `services/`·`queries/` 도메인 로직 (파일 골격/예시만)
- `bridge/` 네이티브 실제 연동 (브라우저 mock 뼈대만)
- UI 설계서(PPT) 디자인 픽셀 단위 반영 — 빈 화면 수준
- 인증/약관/에러 페이지 실제 구현 (`cm/` 폴더 골격만)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Vite+React+TS 보일러플레이트 설정 파일 일체 생성 | High | Pending |
| FR-02 | `src/` 전체 레이어 폴더 골격을 문서와 1:1로 생성 (`.gitkeep`) | High | Pending |
| FR-03 | 진입점 3종(`main.tsx`/`App.tsx`/`router.tsx`) + Provider 래핑 | High | Pending |
| FR-04 | path alias `@/` 를 vite·tsconfig에 동기 설정 | High | Pending |
| FR-05 | `BottomNav` 컴포넌트 — 4탭(홈/조달/알림/My), 현 단계 모두 `/`로 이동 | High | Pending |
| FR-06 | `HomePage` 링크 허브 — 4개 메뉴 링크 렌더링 | High | Pending |
| FR-07 | 빈 페이지 4종 + 라우팅 5개 등록 | High | Pending |
| FR-08 | shadcn `components.json` 설정 (`aliases.ui = @/ui/common/base`) | High | Pending |
| FR-09 | `lib/apiClient.ts`·`lib/queryClient.ts`·`bridge/` mock 골격 | Medium | Pending |
| FR-10 | `constants/routes.ts` 경로 상수 + zustand `authStore` 골격 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 호환성 | 모바일 뷰포트 기준 레이아웃 (최대폭 컨테이너 + 하단 고정 네비) | 브라우저 모바일 뷰 육안 확인 |
| 아키텍처 정합성 | `frontend-architecture.md` §11 의존성 방향 규칙 준수 | import 경로 검토 |
| 코드 품질 | ESLint 0 error (설치 후) | `npm run lint` |
| 빌드 | 타입 에러 0, build 성공 (설치 후) | `npm run build` |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `src/` 폴더 구조가 `frontend-architecture.md` §4와 1:1 일치
- [ ] 보일러플레이트 설정 파일 일체 생성 완료
- [ ] 라우트 5개(`/`, `/procurement`, `/notice`, `/notification`, `/mypage`) 정의
- [ ] 홈 링크 클릭 시 해당 빈 페이지로 이동, BottomNav 4탭 노출
- [ ] `README.md`에 시작 가이드 작성

### 4.2 Quality Criteria

- [ ] `npm install` 후 dev 서버 기동 시 콘솔 에러 0 (사용자 검증)
- [ ] 의존성 방향 규칙 위반 import 0
- [ ] path alias `@/` 정상 해석

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Node.js 미설치로 lint/build 검증 불가 | Medium | High | 파일 골격까지만 작성, 검증 절차를 README에 명시. 필요 시 Node 설치 안내 |
| shadcn CLI 미실행으로 `base/` 컴포넌트 부재 | Low | High | BottomNav 등은 순수 Tailwind로 작성(shadcn base 비의존), `components.json`만 준비 → 설치 후 `npx shadcn add` |
| 아키텍처 문서 예시 도메인(account/transfer)과 실제 도메인 혼동 | Medium | Medium | 실제 도메인(home/procurement/notice/notification/mypage + cm)으로 대체, 문서에 명시 |
| BottomNav 탭이 모두 홈으로 가는 임시 구조 | Low | Medium | 스캐폴드 단계 임시 동작임을 코드 주석·README에 명시, 추후 탭 라우팅 확정 |

---

## 6. Impact Analysis

> 신규 빈 프로젝트 — 기존 코드 소비자 없음.

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| 프로젝트 전체 | Config / Schema | 신규 생성 (기존 코드 자산 0) |

### 6.2 Current Consumers

해당 없음 (N/A) — 신규 프로젝트로 기존 소비자가 존재하지 않음.

### 6.3 Verification

- [x] 기존 코드 영향 없음 확인 (빈 프로젝트)

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | 단순 구조 (`components/`, `lib/`, `types/`) | 정적 사이트, 포트폴리오 | ☐ |
| **Dynamic** | 레이어/도메인 기반 모듈, 백엔드 연동 | 백엔드 연동 웹앱 | ☑ |
| **Enterprise** | 엄격한 레이어 분리, DI, 마이크로서비스 | 고트래픽·복잡 아키텍처 | ☐ |

**선택: Dynamic** — 레이어 분리 구조 + 웹스퀘어 백엔드 연동 SPA. 마이크로서비스/DI가 없어 Enterprise는 아니며, 구조가 Starter 범위를 크게 초과.

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | **React + Vite** | 아키텍처 문서 확정 사항 |
| State Management | Context / Zustand / Redux | **Zustand + React Query** | 클라이언트 상태/서버 상태 분리 (문서 §8) |
| API Client | fetch / axios / react-query | **axios + React Query** | `lib/apiClient` 인터셉터 + `queries/` wrapper (문서 §6,§7) |
| Form Handling | react-hook-form / formik / native | **미도입 (추후)** | 스캐폴드 단계 범위 외 |
| Styling | Tailwind / CSS Modules | **TailwindCSS + shadcn/ui** | 아키텍처 문서 확정 사항 |
| Testing | Jest / Vitest / Playwright | **Vitest + Playwright (추후)** | 스캐폴드 단계 범위 외 |
| Backend | BaaS / Custom Server | **Custom (웹스퀘어)** | 사내 백엔드 |

### 7.3 Folder Structure Preview

```
d2b-mobile-front/
├── public/
├── src/
│   ├── main.tsx · App.tsx · router.tsx
│   ├── lib/        (apiClient, queryClient)
│   ├── services/ queries/ hooks/ stores/ bridge/
│   ├── utils/ constants/ types/ styles/ assets/
│   └── ui/
│       ├── common/ (base · composites · layout)
│       └── biz/    (home · procurement · notice · notification · mypage · cm)
├── 설정 파일 (vite/tsconfig/tailwind/components.json/eslint/prettier/env)
└── README.md
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `docs/frontend-architecture.md` — 폴더 구조·네이밍·의존성 규칙 정의됨 (핵심 기준 문서)
- [ ] `tsconfig.json` / ESLint / Prettier — 미생성 (본 작업에서 생성)
- [ ] `CLAUDE.md` / `CONVENTIONS.md` — 없음

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| Naming | 문서에 정의됨 (§12) | `*Page.tsx`, `{도메인}Service` 등 그대로 적용 | High |
| Folder structure | 문서에 정의됨 (§4) | 문서 1:1 적용 | High |
| Import order | 미정의 | `@/` alias 강제, 상대경로 지양 | Medium |
| Environment variables | 미정의 | `VITE_*` prefix | Medium |
| Error handling | 미정의 | 추후 `cm/error/` 에서 정의 | Low |

### 8.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `VITE_API_BASE_URL` | 웹스퀘어 API 엔드포인트 | Client | ☑ |
| `VITE_BRIDGE_DEBUG` | 브라우저 bridge mock 디버그 플래그 | Client | ☑ |

---

## 9. Next Steps

1. [ ] 설계 문서 작성 (`/pdca design mobile-app-scaffold`) — 아키텍처 문서가 상세하므로 경량 진행
2. [ ] 구현 시작 (`/pdca do mobile-app-scaffold`)
3. [ ] 사용자 `npm install` → dev 서버로 동작 검증

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-21 | 초안 작성 | gongjiyeon |
