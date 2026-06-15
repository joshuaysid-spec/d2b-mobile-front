# tailwind-v4-migration Planning Document

> **Summary**: TailwindCSS v3.4 → v4 업그레이드 (설정을 JS config → CSS `@theme`로 완전 이전)
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: joshuaysid-spec
> **Date**: 2026-05-29
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | Tailwind v3.4 사용 중. v4의 빌드 속도·CSS-first 설정·미래 대비 이점을 얻고자 함. 지원 환경(Android 14+/iOS 19+ WebView)이 v4 브라우저 요구(Chrome 111+/Safari 16.4+)를 충족해 호환성 장애물 없음. |
| **Solution** | v4로 업그레이드하며, `tailwind.config.ts`의 `theme.extend`(KRDS 토큰)를 CSS `@theme`로 완전 이전. 디렉티브·PostCSS·관련 의존성 정비. |
| **Function/UX Effect** | 최종 렌더링 결과는 동일(시각 회귀 0 목표). 개발자 빌드 속도↑, 토큰 관리가 CSS 단일 소스로 단순화. |
| **Core Value** | 동일한 UI를 유지하면서 빌드 파이프라인을 최신화하고, KRDS 토큰 정의를 CSS 한 곳(`@theme`)으로 일원화. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 빌드 최신화 + 토큰 CSS 일원화. 지원 OS가 모던이라 v4 채택 가능 |
| **WHO** | 프론트 개발자(빌드·토큰 관리), 퍼블리셔(클래스 사용 — 거의 무변) |
| **RISK** | renamed 유틸·기본값 변경으로 인한 **시각 회귀**, shadcn raw/플러그인 v4 비호환 |
| **SUCCESS** | `npm run build`·`npm run lint` 통과 + `/guide` 전 컴포넌트 시각 동일 |
| **SCOPE** | 빌드 설정·토큰 이전·의존성 정비. 컴포넌트 로직/구조 변경 없음 |

---

## 1. Overview

### 1.1 Purpose
TailwindCSS를 v3.4.19 → v4로 업그레이드한다. 핵심은 빌드 파이프라인 전환과, KRDS 디자인 토큰 정의를 JS(`tailwind.config.ts`)에서 CSS(`@theme`)로 옮기는 것.

### 1.2 Background
- 과업지시서(표 28) 기준 지원 최소사양 = Android 14 / iOS 19 → v4 브라우저 요구를 여유 있게 충족.
- 우리 토큰 아키텍처(`tokens.css`의 CSS 변수)가 이미 v4의 CSS-first 철학과 정합.

### 1.3 Related Documents
- 디자인 시스템: `docs/02-design/features/krds-design-system.design.md`
- 아키텍처: `docs/frontend-architecture.md`

---

## 2. Scope

### 2.1 In Scope
- [ ] `src/styles/tailwind.css`: `@tailwind` 3줄 → `@import "tailwindcss";`
- [ ] `postcss.config.js`: `tailwindcss`+`autoprefixer` → `@tailwindcss/postcss` (또는 `@tailwindcss/vite` 플러그인)
- [ ] `tailwind.config.ts`의 `theme.extend`(colors.krds, fontSize, spacing, borderRadius, boxShadow, keyframes/animation) → `globals.css`의 CSS `@theme`로 이전
- [ ] 의존성: `tailwindcss@4`, `@tailwindcss/postcss`(또는 vite plugin), `tailwind-merge ^3`, `tailwindcss-animate` → v4 호환(`tw-animate-css`) 정비, `autoprefixer` 제거
- [ ] renamed 유틸/기본값 점검 및 자동 변환(`npx @tailwindcss/upgrade` 활용 가능)

### 2.2 Out of Scope
- 컴포넌트 로직·JSX 구조·props 변경
- 디자인 값(색/간격) 자체 변경 — 동일 값 유지
- 다크모드 정밀 토큰(기존 임시 매핑 유지)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | v4 패키지 설치 및 PostCSS/Vite 파이프라인 전환 | High | Pending |
| FR-02 | `@tailwind` 디렉티브 → `@import "tailwindcss"` | High | Pending |
| FR-03 | KRDS 토큰 `theme.extend` → CSS `@theme` 이전 (색/타이포/간격/라운드/그림자/애니메이션) | High | Pending |
| FR-04 | shadcn 브리지(`--primary` 등) v4에서 동작 확인/정비 | High | Pending |
| FR-05 | `tailwind-merge ^3`로 업그레이드 (cn() v4 클래스 인식) | Medium | Pending |
| FR-06 | `tailwindcss-animate` → v4 호환 대체/유지 (스피너·아코디언 애니메이션) | Medium | Pending |
| FR-07 | renamed 유틸/기본값(테두리색, ring, shadow/rounded scale) 점검·수정 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement |
|----------|----------|-------------|
| 호환성 | Android 14+/iOS 19+ WebView 렌더 정상 | /guide 육안 + 빌드 |
| 시각 회귀 | 전 컴포넌트 렌더 v3와 동일 | /guide 전수 비교 |
| 빌드 | 에러 0 | `npm run build` |
| 린트 | 에러 0 | `npm run lint` |

---

## 4. Success Criteria

### 4.1 Definition of Done
- [ ] `npm run build` 성공 (타입 + 프로덕션 빌드)
- [ ] `npm run lint` 에러 0
- [ ] `/guide` 전 컴포넌트(base/composites/feedback/layout) 시각 회귀 없음
- [ ] KRDS 토큰 클래스(`bg-primary`, `rounded-krds-8`, `text-krds-body-md`, `gap-krds-3` 등) 정상 동작

### 4.2 Quality Criteria
- [ ] 하드코딩 색/수치 신규 유입 없음 (토큰 유지)
- [ ] shadcn raw 컴포넌트 정상 렌더

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| renamed 유틸/기본값(테두리색 currentColor화 등)로 시각 회귀 | High | Medium | `@tailwindcss/upgrade` 자동 변환 + `/guide` 전수 육안 검수, 베이스라인 커밋(`fabcc67`)으로 즉시 롤백 |
| `theme.extend` → `@theme` 이전 중 토큰 누락 | High | Medium | 토큰 항목 1:1 체크리스트화, 빌드 후 클래스 생성 확인 |
| `tailwindcss-animate` v4 비호환 | Medium | Medium | `tw-animate-css` 대체 또는 keyframes를 `@theme`/CSS로 이전 |
| shadcn raw가 v3 가정으로 생성됨 | Medium | Low | 기존 클래스 문자열 대부분 호환, 재생성은 보류 |
| git 안전망 외 push 미설정 | Low | Low | 로컬 베이스라인 커밋 존재, 필요 시 원격 push |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change |
|----------|------|--------|
| `src/styles/tailwind.css` | CSS 진입 | 디렉티브 교체 |
| `src/styles/globals.css` | CSS | `@theme` 추가, `@layer` 재정비 |
| `tailwind.config.ts` | Config | `theme.extend` 제거/축소 (CSS로 이전) |
| `postcss.config.js` | Build | 플러그인 교체 |
| `package.json` | Deps | tailwind v4, postcss 플러그인, tailwind-merge, animate |

### 6.2 Current Consumers
- **전 컴포넌트**(`src/ui/**`)가 Tailwind 클래스 사용 → 토큰 클래스명 유지가 핵심.
- `src/utils/cn.ts`(tailwind-merge 사용) → v4판 필요.
- `/guide`(`ComponentGuidePage.tsx`)가 전 컴포넌트 시각 검수 지점.

### 6.3 Verification
- [ ] 토큰 클래스 생성 여부 빌드 후 확인
- [ ] `/guide`에서 전 컴포넌트 육안 비교 (v3 베이스라인 대비)
- [ ] cn() 병합 정상 (tailwind-merge v3)

---

## 7. Architecture Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| 설정 방식 | CSS `@theme` 완전 이전 | 사용자 결정 — v4 정석, 토큰 CSS 일원화 |
| PostCSS vs Vite plugin | (Do 단계서 확정) | Vite 6 환경 → `@tailwindcss/vite`가 더 단순할 수 있음 |
| animate 플러그인 | `tw-animate-css` 또는 CSS 이전 | v4 호환 |
| 안전망 | git 베이스라인 커밋 `fabcc67` | 회귀 시 즉시 롤백 |

---

## 8. Next Steps

1. [ ] 본 Plan 승인 (Checkpoint)
2. [ ] Design 문서 (선택 — 마이그레이션이라 Plan→Do 직행 가능)
3. [ ] Do: 마이그레이션 실행
4. [ ] Check: build/lint/guide 시각 회귀 검증

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-29 | Initial draft | joshuaysid-spec |
