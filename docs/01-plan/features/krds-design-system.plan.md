---
template: plan
version: 1.3
feature: krds-design-system
date: 2026-05-21
author: gongjiyeon
project: d2b-mobile-front
projectVersion: 0.1.0
---

# krds-design-system Planning Document

> **Summary**: KRDS(디지털정부 디자인 시스템) 디자인 토큰을 CSS 변수로 글로벌 정의하고 Tailwind theme에 매핑, Pretendard GOV 폰트를 적용한 뒤, shadcn base 컴포넌트를 신규 추가하며 KRDS 스타일을 입힌다.
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
| **Problem** | 피그마 디자인이 KRDS 가이드 기반인데, 코드 측에는 KRDS 토큰·폰트·컴포넌트 스타일 체계가 없어 디자인을 일관되게 반영할 수 없음. |
| **Solution** | KRDS 디자인 토큰을 CSS 변수(단일 소스)로 글로벌 정의 → `tailwind.config.ts` theme 매핑, Pretendard GOV 폰트 적용, shadcn base 컴포넌트를 신규 추가하며 KRDS 스타일을 `cva`로 입힘. Figma MCP로 디자인을 직접 참조. |
| **Function/UX Effect** | 모든 컴포넌트가 KRDS 토큰을 단일 소스로 소비 → 정부 디자인 가이드 정합성·접근성 확보. 디자인 변경 시 토큰만 수정하면 전파됨. |
| **Core Value** | KRDS 준수 + Tailwind 단일 체계 유지 → 디자인 일관성과 유지보수성을 동시에 확보. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | KRDS 기반 피그마 디자인을 코드에 일관 반영할 토큰·폰트·컴포넌트 체계가 없음 |
| **WHO** | D2B 모바일 프론트 개발자 · 정부 서비스 사용자(접근성 요구) |
| **RISK** | Figma MCP 미연결 시 디자인 정밀 반영 불가 · KRDS 전체 CSS 도입 시 Tailwind 충돌(→토큰 방식으로 회피) · npm 미설치 |
| **SUCCESS** | KRDS 토큰 CSS 변수화 + Tailwind 매핑 + Pretendard GOV 적용 + shadcn base 초기 세트 KRDS 스타일 동작 |
| **SCOPE** | Phase 1 Figma MCP 연결 → Phase 2 토큰·폰트 글로벌 세팅 → Phase 3 shadcn base 컴포넌트 + KRDS 스타일 |

---

## 1. Overview

### 1.1 Purpose

KRDS 가이드를 기반으로 디자인된 피그마 컴포넌트를 코드에 일관되게 반영하기 위해, KRDS 디자인 토큰·폰트·컴포넌트 스타일 체계를 프로젝트에 구축한다.

### 1.2 Background

- 피그마의 디자인 컴포넌트가 KRDS(krds.go.kr) 가이드를 기초로 제작됨.
- KRDS는 디자인 토큰을 3단계(Primitive → Semantic → Component)로 정의하며, 공식 워크플로우는 "디자인 툴 토큰을 JSON export → CSS 변수로 변환"이다.
- 우리 스택은 React + Vite + **TailwindCSS + shadcn/ui**. KRDS 공식 HTML Component Kit(`krds-uiux`)은 SCSS 기반 바닐라 킷이라 Tailwind와 클래스 체계가 충돌하므로 직접 도입하지 않는다.

### 1.3 Related Documents

- KRDS 개발자 가이드: https://www.krds.go.kr/html/site/outline/outline_03.html
- KRDS 디자인 토큰: https://www.krds.go.kr/html/site/style/style_07.html
- Pretendard GOV: https://github.com/orioncactus/pretendard/tree/main/packages/pretendard-gov
- 아키텍처: `docs/frontend-architecture.md`
- 선행 작업: `docs/01-plan/features/mobile-app-scaffold.plan.md`

---

## 2. Scope

### 2.1 In Scope

- [ ] Figma MCP 서버 연결 설정 (`.mcp.json` 또는 settings) — 디자인 직접 참조용
- [ ] KRDS **Primitive 토큰** CSS 변수 정의 (color / typography / spacing / radius / shadow)
- [ ] KRDS **Semantic 토큰** CSS 변수 정의 (background / text / border / icon 등 맥락 토큰)
- [ ] 토큰 전용 파일 신설: `src/styles/tokens.css` → `globals.css`에서 `@import`
- [ ] `tailwind.config.ts` `theme.extend`에 토큰 매핑 (colors / spacing / borderRadius / fontSize / boxShadow)
- [ ] Pretendard GOV 폰트: `pretendard-gov` 의존성 추가 + CSS import + `fontFamily` 설정
- [ ] shadcn base 컴포넌트 **초기 세트** 신규 추가 → `src/ui/common/base/` (Button, Input, Checkbox, Label 등)
- [ ] 각 base 컴포넌트에 KRDS 스타일을 `cva`(class-variance-authority) 변형으로 적용
- [ ] `globals.css` `@layer base/components` 구조 정리
- [ ] 토큰 사용 가이드 주석/문서화

### 2.2 Out of Scope

- KRDS 43종 컴포넌트 전체 구현 (이번엔 초기 세트만, 이후 동일 패턴 반복)
- 페이지/도메인(`ui/biz/*`) 컴포넌트 리디자인
- 다크모드 KRDS 토큰 정밀 매핑 (별도 사이클)
- 공식 `krds-uiux` SCSS 킷 도입 (Tailwind 충돌로 채택 안 함)
- 실제 빌드 검증 — 단, Figma MCP·`pretendard-gov`·shadcn 의존성은 설치 필요

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Figma MCP 서버 연결 설정 (디자인 참조 환경 구성) | High | Pending |
| FR-02 | KRDS Primitive 토큰 CSS 변수 정의 (color/typo/space/radius/shadow) | High | Pending |
| FR-03 | KRDS Semantic 토큰 CSS 변수 정의 (맥락 토큰) | High | Pending |
| FR-04 | `tailwind.config.ts` theme.extend에 토큰 매핑 | High | Pending |
| FR-05 | Pretendard GOV 폰트 설치 + import + fontFamily 설정 | High | Pending |
| FR-06 | shadcn base 컴포넌트 초기 세트 신규 추가 (`ui/common/base/`) | High | Pending |
| FR-07 | base 컴포넌트에 KRDS 스타일을 cva 변형으로 적용 | High | Pending |
| FR-08 | `globals.css` @layer 구조 정리 + tokens.css 분리 | Medium | Pending |
| FR-09 | 토큰 네이밍/사용 가이드 문서화 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 접근성 | KRDS 접근성 기준 — 명도 대비, 포커스 표시 | 토큰 명도대비 검토, 키보드 포커스 확인 |
| 일관성 | 모든 스타일이 KRDS 토큰 CSS 변수 단일 소스를 참조 | 하드코딩 색상/수치 0 |
| 유지보수성 | Tailwind 단일 체계 (별도 CSS 파일 분산 없음) | 컴포넌트 스타일은 cva + 유틸로만 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] KRDS Primitive·Semantic 토큰이 `tokens.css`에 CSS 변수로 정의됨
- [ ] `tailwind.config.ts`가 토큰 변수를 참조 (하드코딩 없음)
- [ ] Pretendard GOV 폰트가 앱 전역에 적용됨
- [ ] shadcn base 초기 세트가 `ui/common/base/`에 추가되고 KRDS 스타일 반영
- [ ] Figma MCP 연결되어 디자인 참조 가능

### 4.2 Quality Criteria

- [ ] 컴포넌트 스타일에 하드코딩된 색상/간격 값 0
- [ ] `npm run build` 성공 (사용자 검증)
- [ ] cva 변형(variant/size)이 KRDS 컴포넌트 타입과 매핑됨

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Figma MCP 연결에 Figma 파일 접근 권한·토큰 필요 | High | High | Phase 1에서 사용자와 함께 설정. 파일 URL·접근 방식 확인 필요 |
| KRDS 정확한 토큰 수치 확보 어려움 | Medium | Medium | KRDS 공식 토큰 페이지 + Figma MCP export 병행. 불명확 값은 Semantic 변수로 추상화 |
| KRDS 전체 CSS 킷 도입 시 Tailwind 충돌 | High | Low | 토큰 방식 채택으로 원천 회피 (`krds-uiux` 미도입 확정) |
| npm install 미수행 — pretendard-gov/shadcn 의존성 부재 | Medium | High | Plan/README에 설치 절차 명시. Do 단계 전 설치 안내 |
| Pretendard GOV / KRDS 토큰 라이선스 | Low | Low | Pretendard OFL, KRDS 공공 활용 허용 — 확인 완료 |

---

## 6. Impact Analysis

> 기존 스캐폴드(`mobile-app-scaffold`) 산출물을 일부 수정한다.

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `src/styles/globals.css` | Config / Style | shadcn 기본 토큰 → KRDS 토큰 기반으로 재정의, @import tokens.css 추가 |
| `tailwind.config.ts` | Config | theme.extend를 KRDS 토큰 변수로 교체/확장, fontFamily 추가 |
| `package.json` | Config | `pretendard-gov` 등 의존성 추가 |
| `src/ui/common/base/` | Component | shadcn base 컴포넌트 신규 추가 (현재 비어있음) |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| `globals.css` 토큰 | READ | `main.tsx` import → 전역 | Needs verification — 색상 토큰명 유지 시 무영향 |
| `tailwind.config.ts` 색상 | READ | `BottomNav`/`Header`/`HomePage` 등 `bg-*`/`text-*` 클래스 | Needs verification — `primary`/`border`/`muted` 등 토큰명 유지하면 무영향 |

### 6.3 Verification

- [ ] 기존 layout/page 컴포넌트의 Tailwind 클래스가 KRDS 토큰 매핑 후에도 정상 렌더 확인
- [ ] 토큰명(`primary`, `border`, `muted` 등) 호환 유지 또는 일괄 교체

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Selected |
|-------|:--------:|
| Starter | ☐ |
| **Dynamic** | ☑ (기존 유지) |
| Enterprise | ☐ |

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 스타일링 방식 | KRDS CSS킷 전체 / 컴포넌트별 CSS / **토큰→CSS변수→Tailwind** | **토큰→CSS변수→Tailwind+cva** | Tailwind 단일 체계 유지, KRDS 공식 권장(JSON→CSS변수)과 일치, 충돌 회피 |
| 폰트 | Pretendard / **Pretendard GOV** / 시스템 폰트 | **Pretendard GOV** | KRDS 공공서비스 표준 폰트 |
| 컴포넌트 베이스 | krds-uiux / krds-react / **shadcn base** | **shadcn base + cva** | 기존 스택 유지, components.json 설정 완료, cva 이미 의존성 |
| 디자인 참조 | 가이드만 / export / **Figma MCP** | **Figma MCP** | 피그마 디자인 직접 참조로 정밀 반영 |

### 7.3 Token Layer Structure

```
src/styles/
├── tokens.css     # [신설] KRDS Primitive + Semantic 토큰 (CSS 변수)
├── globals.css    # @import tokens.css + @layer base(리셋/폰트) + @layer components
└── tailwind.css   # @tailwind 지시문

tailwind.config.ts # theme.extend → var(--krds-*) 참조
src/ui/common/base/ # shadcn 컴포넌트 + cva (KRDS 변형)
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `docs/frontend-architecture.md` §9.4 — `styles/`는 globals.css, tailwind.css. → `tokens.css` 추가는 확장
- [x] `components.json` — shadcn alias 설정 완료 (`ui` → `@/ui/common/base`)
- [x] `tailwind.config.ts` — shadcn 토큰 매핑 존재 (KRDS 토큰으로 확장)

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| 토큰 네이밍 | 미정의 | `--krds-{category}-{scale}` (primitive), `--krds-{semantic}` 규칙 | High |
| 컴포넌트 변형 | 미정의 | cva variant/size 네이밍을 KRDS 컴포넌트 타입과 일치 | High |
| 스타일 위치 | 미정의 | 컴포넌트 스타일은 cva + Tailwind 유틸로만, 별도 .css 금지 | Medium |

### 8.3 Environment / Prerequisites

| 항목 | 용도 | 비고 |
|------|------|------|
| Figma MCP 서버 | 디자인 참조 | Figma 파일 URL + 접근 방식(Dev Mode / 토큰) 필요 |
| `pretendard-gov` npm | 폰트 | `npm install` 필요 |
| shadcn 의존성 | base 컴포넌트 | `npx shadcn add` 또는 수동 추가 |

---

## 9. Next Steps

1. [ ] **Figma MCP 연결** (Phase 1) — Figma 파일 URL·접근 방식 확인 후 설정
2. [ ] 설계 문서 작성 (`/pdca design krds-design-system`) — 토큰 목록·컴포넌트 세트 확정
3. [ ] 구현 (`/pdca do krds-design-system`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-21 | 초안 작성 | gongjiyeon |
