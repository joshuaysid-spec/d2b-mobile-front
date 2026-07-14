---
template: plan
version: 1.0
feature: cm-site-m15
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-site-m15 Planning Document

> **Summary**: 관련사이트(MUI-CM-05-M15, `SitePage`) — 이용안내 > 관련사이트의 **정적 안내(가이드) 페이지**. 방위사업청·국방·전자조달·조달·공인인증·중소/여성/장애인·전자보증서·신용정보·기타 9개 그룹의 외부 사이트 링크(총 76개)를 그룹별 네비게이션 리스트로 안내하고, 하단에 만족도평가를 둔다. Figma `10020-85148`(높이 5624px). **신규 공통 컴포넌트 0** — 링크 항목은 페이지 내부 조립물, 만족도평가는 `SatisfactionSurvey` 재사용.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-14 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 조달업체가 자주 찾는 관계기관/시스템 사이트를 모바일에서 모아 보는 화면이 없다. |
| **Solution** | Figma `10020-85148` 기준 정적 링크 안내 페이지 `SitePage` 신규. 9개 그룹 × 사이트 링크(외부 새 탭) + 하단 만족도평가. 고정 링크라 목업/API 없음. |
| **Function/UX Effect** | 전체메뉴 > 이용안내 > 관련사이트 진입 시 표시. 각 항목 탭 → 해당 사이트 새 탭 이동. |
| **Core Value** | 신규 공통 0 — 네비게이션 리스트는 페이지 조립물, 만족도평가는 [[cm-preparation01-m07]] 계열 공통(`SatisfactionSurvey`) 재사용. 설계서 ↔ 코드 1:1(`SitePage`). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 이용안내 > 관련사이트(MUI-CM-05-M15) 부재 해소 — 관계기관 사이트 모음 |
| **WHO** | 국방조달 관계기관/인증/보증 사이트를 찾는 모바일(웹뷰) 사용자 |
| **RISK 1** | 요청서 1·2번(검색필터/바텀시트)은 이 화면(정적 링크 목록)과 무관 — Figma 기준 진행([[cm-foreign01-m12]] 등 동일 판단) |
| **RISK 2** | Figma 일부 href 오타(`hhttps://…`) → 동작하도록 교정(사이트명은 원문 유지) |

---

## 결정 사항 / 해석

1. **요청서 1·2번(검색필터+바텀시트) 해당 없음** — M15 는 설계서(slide352·363)·Figma 모두 정적 링크 안내 페이지. Figma 기준 제작.
2. **요청서 5번(타이틀 "관련사이트")** — Figma 타이틀바도 "관련사이트"이며 상위 메뉴명과 동일. 전체메뉴 leaf `guide-related-site` 연결, `LINKED_MENU_LABELS` 단일화.
3. **요청서 3번(항목명 영문)** — 정적 링크라 데이터 필드 없음. 영문 화면 ID `Site`(설계서 slide352)만 파일/폴더명 반영.
4. **href 오타 교정** — 방위사업청 > 통합사업관리정보체계 href 가 Figma 에 `hhttps://vpn.dapa.go.kr/` 로 오타 → `https://vpn.dapa.go.kr/` 로 교정(사이트명·나머지 URL 은 원문 그대로).

---

## Scope

- (신규) `src/ui/biz/cm/site/SitePage.tsx`
- (수정) `src/constants/routes.ts` — `GUIDE_SITE`
- (수정) `src/constants/menuLabels.ts` — 관련사이트
- (수정) `src/ui/biz/cm/menu/MenuPage.tsx` — `guide-related-site` leaf 연결
- (수정) `src/router.tsx` — lazy 등록 + handle(sub, 관련사이트, scrollReset)

## Out of Scope

- API 연동(정적 링크라 없음). 링크 URL 유지보수는 추후 CMS/상수 관리로 확장 가능.

## Verification

- `npm run lint && npm run build` 통과, chunk 경고 없음.
- Figma `10020-85148` 그룹·사이트명·URL 1:1 대조(76개 링크).
