---
template: plan
version: 1.0
feature: cm-domestic01-m09
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-domestic01-m09 Planning Document

> **Summary**: 국방조달참여절차(MUI-CM-05-M09, `Domestic01Page`) — 이용안내 > 국내조달안내 하위의 **정적 안내(가이드) 페이지**. 국내조달 참여절차(업체등록 → 사용자등록 → 품목등록 → 입찰참가)를 절차 다이어그램 + 방법(1~5단계) 으로 안내한다. Figma `10020-86472`(높이 6836px, 대형). **신규 공통 컴포넌트 0** — 기존 `Infobox`(안내 박스) 재사용 + 도메인 전용 조립물(절차 다이어그램·인증사업자 카드·리스트)만 페이지 내부에 둔다.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-14 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 국내 조달업체가 방위사업청/부대 입찰에 참여하기 위한 전체 절차(인증서·업체등록·사용자등록·품목등록·입찰참가)를 모바일에서 안내하는 화면이 없다. |
| **Solution** | Figma `10020-86472` 기준 정적 안내 페이지 `Domestic01Page` 신규 생성. 상단 **절차 다이어그램**(플로우차트) + **방법** 섹션(1~5 단계 번호 헤더 + ● 불릿/대시 리스트 + 안내 Infobox). 고정 안내 문구라 목업/API 경계 없음. |
| **Function/UX Effect** | 전체메뉴 > 이용안내 > 국내조달안내 진입 시 표시. 나라장터/인증사업자 링크·콜센터 안내. |
| **Core Value** | 신규 공통 컴포넌트 0 — `Infobox` 재사용 + KRDS 토큰. 설계서 ↔ 코드 1:1(화면 ID 기반 파일명 `Domestic01Page`). [[cm-preparation01-m07]] 안내 페이지 계열과 동일 컨벤션. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 이용안내 > 국내조달안내(MUI-CM-05-M09) 부재 해소 — 국내조달 참여 전체 절차 안내 |
| **WHO** | 국내 조달(중앙조달/부대조달/시설공사) 참여를 준비하는 모바일(웹뷰) 조달업체 |
| **RISK 1** | 요청서 1·2번(검색필터/바텀시트)은 이 화면(정적 안내)과 무관 — Figma 기준 진행(사전준비사항 M07 과 동일 판단) |
| **RISK 2** | 인증사업자 카드의 **브랜드 로고 이미지**는 레포에 에셋이 없음 → 1차 구현에서 로고 생략, 회사명/전화/링크만 렌더(사용자 확인 후 에셋 추가 가능) |

---

## 결정 사항 / 해석

1. **요청서 1·2번(검색필터 + 바텀시트) 해당 없음** — M09 는 설계서(slide352·357)·Figma 모두 정적 안내 페이지. [[cm-preparation01-m07]] 과 동일하게 Figma 기준으로 제작.
2. **요청서 4번(입찰결과 상세와 유사)** — 실제 레이아웃은 요약/탭 구조가 아니라 안내 페이지 계열. 국방전자조달소개(`IntroducePage`)/사전준비사항(`Preparation01Page`) 컨벤션을 따른다.
3. **요청서 6번(타이틀 "국내조달안내")** — Figma 타이틀바는 "국방조달참여절차"나, 요청대로 헤더 타이틀은 상위 메뉴명 **"국내조달안내"**. 전체메뉴 leaf `guide-domestic` 를 이 화면으로 연결, `LINKED_MENU_LABELS` 로 메뉴명 ↔ 타이틀 단일화.
4. **요청서 3번(항목명 영문)** — 정적 안내라 데이터 필드 없음. 영문 화면 ID `Domestic01`(설계서 slide352) 만 파일/폴더명 반영.
5. **브랜드 로고** — 5개 인증사업자(한국무역정보통신/한국전자인증/한국정보인증/코스콤/금융결재원) 로고 이미지 에셋 미보유 → 카드에 회사명(굵게)·전화·홈페이지 링크만 렌더. 로고는 사용자 승인·에셋 확보 후 추가.

---

## Scope

- (신규) `src/ui/biz/cm/domestic01/Domestic01Page.tsx`
- (수정) `src/constants/routes.ts` — `GUIDE_DOMESTIC` 라우트 상수
- (수정) `src/constants/menuLabels.ts` — `LINKED_MENU_LABELS` 국내조달안내
- (수정) `src/ui/biz/cm/menu/MenuPage.tsx` — `guide-domestic` leaf 연결 + 라벨 단일화
- (수정) `src/router.tsx` — lazy 등록 + `handle`(sub 헤더 "국내조달안내", scrollReset)
- (수정) `src/ui/common/base/Icon.tsx` — `Folder`(입찰참가), `OpenInNew`(외부링크) 추가 (`Call` 은 M07 에서 추가됨)

## Out of Scope

- MUI-CM-05-M10~M15(전자입찰절차/대금청구/국외조달/관련사이트) — 별도 작업.
- 인증사업자 브랜드 로고 이미지 에셋.
- API 연동(정적 안내라 없음).

## Verification

- `npm run lint && npm run build` 통과, chunk size 경고 없음.
- Figma `10020-86472` 문구(절차/방법 1~5/Infobox)와 렌더 텍스트 1:1 대조.
