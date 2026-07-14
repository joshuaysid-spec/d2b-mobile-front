---
template: plan
version: 1.0
feature: cm-app-stng-ms02-m01
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-app-stng-ms02-m01 Planning Document

> **Summary**: 설정(MUI-MS-02-M01, `AppStngPage`) — 전체메뉴 > 설정. 앱 설정 정보를 안내/제어한다: 알림 설정(앱 푸시 토글 + 알림 서비스 바로가기) · 앱 설정(앱 권한 설정 · 앱 버전정보 아코디언 · 앱 캐시 삭제) · 약관(개인정보처리방침 · 저작권 정책). 앱 캐시 삭제 클릭 시 확인 팝업(MUI-MS-02-P02 `AppCashDel`). Figma `10020-87979`(설정) · `10020-88049`(캐시삭제 팝업). **신규 공통 컴포넌트 0** — `Switch`·`AlertModal` 재사용 + 페이지 내부 조립물.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-14 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 앱 알림/권한/버전/캐시/약관을 한곳에서 관리하는 설정 화면이 없다(전체메뉴 '설정' 미연결). |
| **Solution** | Figma 기준 `AppStngPage` 신규 + 앱 캐시 삭제 확인 팝업. 전체메뉴 '설정' 퀵아이콘을 라우트에 연결. |
| **Function/UX Effect** | 전체메뉴 > 설정 진입. 푸시 토글, 알림/권한 바로가기, 버전정보 펼침, 캐시삭제 확인 팝업, 약관 외부링크. |
| **Core Value** | 신규 공통 0 — 기존 `Switch`/`AlertModal` 재사용. 설계서 ↔ 코드 1:1(`AppStngPage`/`AppCashDel`). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 전체메뉴 '설정'(MUI-MS-02-M01) 화면 부재 + 미연결 해소 |
| **WHO** | 앱 알림/권한/캐시/약관을 관리하려는 모바일(웹뷰/네이티브) 사용자 |
| **RISK 1** | 요청서 1·2번(검색필터/바텀시트)은 설정 화면과 무관 — Figma 기준 진행 |
| **RISK 2** | 요청서 5번 타이틀 "관련사이트"는 직전 작업 잔여 문구 → 실제 화면은 **설정**, 타이틀 "설정" |
| **RISK 3** | 설계서 경로는 `ms/appStng` 이나 레포에 `ms` 도메인 폴더 없음(MS 화면은 모두 `cm/` 하위) → `cm/appStng` 에 둠(영문 ID 유지) |

---

## 결정 사항 / 해석

1. **타이틀 = "설정"** — 요청서 5번의 "관련사이트"는 직전 M15 작업의 잔여 오기. Figma 타이틀바·breadcrumb(메인 홈 > 설정) 모두 "설정".
2. **도메인 폴더 ms → cm** — 설계서 경로 `src/ui/biz/ms/appStng/` 이지만 레포에 `ms` 폴더가 없고 MS 챕터 화면(MS-01 등)이 모두 `cm/` 하위에 있음(CLAUDE.md: MS/CM 공통은 cm). 따라서 `src/ui/biz/cm/appStng/AppStngPage.tsx`·`AppCashDel`(팝업은 AlertModal 인라인). 영문 화면 ID(AppStng)는 유지.
3. **앱 캐시 삭제 팝업(P02)** — 단순 확인(취소/삭제)이라 CLAUDE.md 컨벤션대로 `AlertModal` 을 페이지에 인라인(별도 `AppCashDel` 래퍼 파일 미생성). Figma 팝업의 X/좌측정렬 크롬은 AlertModal(중앙정렬·X없음)과 소폭 차이 — 공통 컴포넌트 재사용 우선.
4. **약관 2번째 항목** — Figma 렌더는 "개인정보처리방침" 중복 표기이나 설계서(slide368)는 "개인정보처리방침 / 저작권 정책"으로 구분 → **저작권 정책** 으로 반영.
5. **네이티브 연동 자리** — 앱 권한 설정(시스템 설정)·캐시 삭제(네이티브 브릿지)·알림 서비스 이동은 `console.log` 스텁 + 주석으로 경계 표시.

---

## Scope

- (신규) `src/ui/biz/cm/appStng/AppStngPage.tsx`
- (수정) `src/constants/routes.ts` — `SETTINGS`
- (수정) `src/ui/biz/cm/menu/MenuPage.tsx` — '설정' 퀵아이콘 onClick → `navigate(ROUTES.SETTINGS)` + 메뉴 닫기
- (수정) `src/router.tsx` — lazy 등록 + handle(sub, '설정', scrollReset)
- (수정) `src/ui/common/base/Icon.tsx` — `Smartphone` 추가

## Out of Scope

- MUI-MS-02-P03(모바일앱서비스 안내) — 별도.
- 실제 알림설정/캐시삭제 API·네이티브 브릿지 — 스텁만.

## Verification

- `npm run lint && npm run build` 통과, chunk 경고 없음.
- Figma `10020-87979`/`10020-88049` 문구·구성 대조.
