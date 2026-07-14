---
template: plan
version: 1.0
feature: cm-foreign01-m12
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-foreign01-m12 Planning Document

> **Summary**: 국외조달원 등록절차(MUI-CM-05-M12, `Foreign01Page`) — 이용안내 > 국외조달안내 하위의 **정적 안내(가이드) 페이지**. 국외소재상사/국내소재상사 두 유형별 등록절차를 번호 카드(단계별)로 안내한다. Figma `10020-86658`(높이 1551px). **신규 공통 컴포넌트 0** — [[cm-preparation01-m07]] 번호 카드 패턴 + [[cm-domestic01-m09]] sub_notice 노트 재사용(페이지 내부 조립물).
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-14 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 국외 조달원(국외소재상사·국내소재상사)이 국방전자조달에 등록하기 위한 단계별 절차를 모바일에서 안내하는 화면이 없다. |
| **Solution** | Figma `10020-86658` 기준 정적 안내 페이지 `Foreign01Page` 신규. 2개 섹션(1.국외소재상사 / 2.국내소재상사) 각각에 번호 카드(단계) — 뱃지+제목+본문(링크·sub_notice 노트·※ 안내). 고정 안내라 목업/API 없음. |
| **Function/UX Effect** | 전체메뉴 > 이용안내 > 국외조달안내 진입 시 표시. 나라장터/국방전자조달/국군방첩사 등 외부 링크 안내. |
| **Core Value** | 신규 공통 0 — M07 카드 패턴 + M09 sub_notice 재사용, KRDS 토큰. 설계서 ↔ 코드 1:1(`Foreign01Page`). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 이용안내 > 국외조달안내(MUI-CM-05-M12) 부재 해소 — 국외조달원 등록 절차 안내 |
| **WHO** | 국외소재상사/국내소재상사 등 국외조달 참여를 준비하는 모바일(웹뷰) 사용자 |
| **RISK** | 요청서 1·2번(검색필터/바텀시트)은 이 화면(정적 안내)과 무관 — Figma 기준 진행([[cm-preparation01-m07]]·[[cm-domestic01-m09]] 동일 판단) |

---

## 결정 사항 / 해석

1. **요청서 1·2번(검색필터+바텀시트) 해당 없음** — M12 는 설계서(slide352·360)·Figma 모두 정적 안내 페이지. Figma 기준 제작.
2. **요청서 4번(입찰결과 상세와 유사)** — 실제는 안내 페이지 계열(번호 카드). M07/M09 컨벤션을 따른다.
3. **요청서 6번(타이틀 "국외조달안내")** — Figma 타이틀바는 "국외조달원 등록절차"나, 요청대로 헤더 타이틀은 상위 메뉴명 **"국외조달안내"**. 전체메뉴 leaf `guide-foreign` 연결, `LINKED_MENU_LABELS` 단일화.
4. **요청서 3번(항목명 영문)** — 정적 안내라 데이터 필드 없음. 영문 화면 ID `Foreign01`(설계서 slide352)만 파일/폴더명 반영.

---

## Scope

- (신규) `src/ui/biz/cm/foreign01/Foreign01Page.tsx`
- (수정) `src/constants/routes.ts` — `GUIDE_FOREIGN`
- (수정) `src/constants/menuLabels.ts` — 국외조달안내
- (수정) `src/ui/biz/cm/menu/MenuPage.tsx` — `guide-foreign` leaf 연결
- (수정) `src/router.tsx` — lazy 등록 + handle(sub, 국외조달안내, scrollReset)

## Out of Scope

- MUI-CM-05-M13(등록/변경안내)·M14(국외 전자입찰절차) 등 국외조달안내 나머지 하위 — 별도.
- API 연동(정적 안내라 없음).

## Verification

- `npm run lint && npm run build` 통과, chunk 경고 없음.
- Figma `10020-86658` 문구·색·굵기 1:1 대조.
