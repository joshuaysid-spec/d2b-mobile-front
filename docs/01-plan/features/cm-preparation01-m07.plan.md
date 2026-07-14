---
template: plan
version: 1.0
feature: cm-preparation01-m07
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-preparation01-m07 Planning Document

> **Summary**: 사전준비사항(MUI-CM-05-M07, `Preparation01Page`) — 이용안내 > 조달사전준비안내 하위의 **정적 안내(가이드) 페이지**. 국방전자조달시스템 이용 전 준비사항(인증서 신청/발급 · 업체등록 · 사용자 등록 · 업체 추가 정보 등록)을 안내한다. Figma 원본 `10020-86138`. **신규 공통 컴포넌트 0 — 도메인 전용 조립물(안내 카드/리스트)만 페이지 내부에 둔다.**
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-14 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 신규 조달업체가 국방전자조달 서비스 이용 전에 밟아야 하는 준비 절차(인증서/업체등록/사용자등록/추가정보)를 모바일에서 안내하는 화면이 없다. |
| **Solution** | Figma `10020-86138` 기준 정적 안내 페이지 `Preparation01Page` 신규 생성. 데이터가 아닌 **고정 안내 문구**라 목업/API 경계 없음. 번호 카드(1~3)와 하단 "업체 추가 정보 등록" 블록을 페이지 내부 조립물로 렌더. |
| **Function/UX Effect** | 전체메뉴 > 이용안내 > 조달사전준비안내 진입 시 이 화면 표시. 발급사업자 홈페이지 링크(외부 새 탭) + 콜센터 번호 안내. |
| **Core Value** | 신규 공통 컴포넌트 0 — 기존 토큰/아이콘만 사용. 설계서 ↔ 코드 1:1(화면 ID 기반 파일명 `Preparation01Page`). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 이용안내 > 조달사전준비안내(MUI-CM-05-M07) 부재 해소 — 조달 참여 준비 절차 안내 |
| **WHO** | 국방전자조달 서비스를 처음 이용하려는 모바일(웹뷰) 조달업체 사용자 |
| **RISK** | 요청서의 "검색필터/바텀시트" 문구는 이 화면(정적 안내 페이지)과 무관 — Figma 원본을 기준으로 진행(아래 결정 참고) |

---

## 결정 사항 / 해석

1. **요청서 1·2번(검색필터 페이지 + 바텀시트)은 이 화면에 해당 없음.** MUI-CM-05-M07 은 설계서(00.공통 slide352·355)·Figma(`10020-86138`) 모두 **정적 안내 페이지**다. 검색필터/바텀시트는 다른 화면 템플릿의 잔여 문구로 판단, Figma 원본 기준으로 안내 페이지를 제작한다.
2. **요청서 4번(입찰결과 상세와 유사)** — 실제 레이아웃은 요약/탭 구조가 아니라 국방전자조달소개(`IntroducePage` 등, CM-05-M01~M06)와 동일한 **정적 안내 페이지 계열**이다. 그쪽 컨벤션(px-4 블록 + 토큰 색)을 따른다.
3. **요청서 6번(페이지 타이틀 "조달사전준비안내")** — Figma 타이틀바는 "사전준비사항"이나, 요청대로 헤더 타이틀은 상위 메뉴명 **"조달사전준비안내"** 로 한다. 전체메뉴 leaf `guide-prep`(이미 라벨 "조달사전준비안내") 를 이 화면으로 연결하며, `LINKED_MENU_LABELS` 단일 진실원천으로 메뉴명 ↔ 헤더 타이틀을 일치시킨다.
4. **항목명(요청서 3번)** — 정적 안내 문구라 데이터 필드가 없다. 영문 화면 ID `Preparation01`(설계서 slide352 화면목록)만 파일/폴더명에 반영.

---

## Scope

- (신규) `src/ui/biz/cm/preparation01/Preparation01Page.tsx`
- (수정) `src/constants/routes.ts` — `GUIDE_PREPARATION` 라우트 상수
- (수정) `src/constants/menuLabels.ts` — `LINKED_MENU_LABELS` 에 조달사전준비안내 추가
- (수정) `src/ui/biz/cm/menu/MenuPage.tsx` — `guide-prep` leaf 를 라우트에 연결 + 라벨 단일화
- (수정) `src/router.tsx` — lazy 등록 + `handle`(sub 헤더 "조달사전준비안내", scrollReset)
- (수정) `src/ui/common/base/Icon.tsx` — `Call`(전화) 아이콘 REGISTRY 추가

## Out of Scope

- MUI-CM-05-M08~M15(청렴계약제/국내·국외조달안내/관련사이트 등) 나머지 이용안내 하위 페이지 — 별도 작업.
- API 연동(정적 안내라 없음).

## Verification

- `npm run lint && npm run build` 통과, chunk size 경고 없음.
- Figma `10020-86138` 문구와 렌더 텍스트 1:1 대조.
