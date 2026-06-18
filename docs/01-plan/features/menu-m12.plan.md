---
template: plan
feature: menu-m12
date: 2026-06-18
author: jygong
project: d2b-mobile-front
status: Draft
---

# menu-m12 (햄버거 메뉴) Planning Document

> **Summary**: 전체메뉴(MUI-MS-01-M12) 화면 — 로그인 상태별 상단(유저/로그인 안내) + 퀵아이콘 4 + 통합검색 + 도메인별 아코디언 메뉴 + 하단 로그인/로그아웃.

## Executive Summary

| Perspective | Content |
|---|---|
| **Problem** | 헤더 '전체메뉴' 버튼(`onMenu`)이 미연결. 앱 전체 메뉴 트리를 보여주는 화면 부재. |
| **Solution** | `/guide` 기존 공통(FullPopup·Accordion·NavigationItem·InputBox) 조립. 메뉴는 앱메뉴 문서 기반 **데이터 배열**로 구동. 로그인 상태는 AppLayout 이 prop 주입. |
| **Function/UX** | 로그인 전=‘로그인 해주세요’+하단 로그인 / 로그인 후=유저명·최근로그인+하단 로그아웃. 본문(퀵아이콘·검색·아코디언 메뉴) 공통. |
| **Core Value** | 전 메뉴 한 화면 탐색. 신규 컴포넌트 0, 기존 조립. |

## Context Anchor

| Key | Value |
|---|---|
| **WHY** | 전체메뉴 화면 부재 + 헤더 onMenu 미연결 |
| **WHO** | 모바일 웹앱 사용자(로그인 전/후 모두) |
| **RISK** | 메뉴 항목·링크 다수 미정 → 데이터 배열 + console 스텁으로 경계. 로그인 분기 누락 |
| **SUCCESS** | 두 상태(로그인 전/후) 렌더 + 아코디언 메뉴 데이터 구동 + lint/build |
| **SCOPE** | M12 화면 1개(오버레이). 각 메뉴의 실제 라우팅은 미정(스텁) |

## 1. Scope

### In
- [ ] FullPopup 오버레이로 전체메뉴 구현(헤더 `onMenu` → open). 자체 header(전체메뉴+닫기).
- [ ] 상단: 로그인 분기(유저정보 / 로그인 안내) — AppLayout 이 `isLoggedIn`·`user` prop 주입.
- [ ] 퀵아이콘 4(마이페이지·인증센터·챗봇상담·설정).
- [ ] 통합검색 입력 + 검색 버튼(스텁).
- [ ] 도메인별 아코디언(1뎁스) → 2뎁스 메뉴 항목(NavigationItem). 일부 3뎁스 중첩.
- [ ] 하단 버튼: 로그인 전=로그인 / 후=로그아웃(`authStore.logout`).
- [ ] 메뉴 데이터 = 앱메뉴 문서 기반 상수 배열. onClick = `console.log` + `// 추후 라우팅`.

### Out
- 각 메뉴의 실제 페이지 라우팅(링크 미정).
- 통합검색 결과(별도 화면 M09/M10).
- QR 로그인 등 헤더 부가 액션.

## 2. Requirements

| ID | 요구 | 우선 |
|---|---|---|
| FR-01 | 로그인 전/후 상단·하단 분기 렌더 | High |
| FR-02 | 퀵아이콘 4(기존 아이콘: Person/Settings + chatbot.svg/certification.svg) | High |
| FR-03 | 도메인별 아코디언 + 2뎁스 항목(데이터 구동) | High |
| FR-04 | 하단 로그아웃 시 `authStore.logout()` | High |
| FR-05 | 헤더 onMenu → 오버레이 open(AppLayout 소유) | High |
| FR-06 | 신규 컴포넌트 0(FullPopup·Accordion·NavigationItem·InputBox 재사용) | High |

## 3. Success Criteria

- [ ] 두 상태 모두 정상 렌더(로그인 전/후 토글).
- [ ] 아코디언 펼침/접힘 + 2뎁스 항목 클릭 스텁.
- [ ] `npm run lint && build` 통과.

## 4. Risks

| Risk | 대응 |
|---|---|
| 메뉴 항목/링크 다수 미정 | 데이터 배열 + console 스텁, 라우팅은 후속 |
| authStore 직접 import 금지(메모리 규칙) | AppLayout 이 isLoggedIn·user·logout prop 주입 |
| 오버레이 vs 라우트 | 자체 popup header(닫기) 있어 글로벌 Header 와 충돌 → 오버레이(FullPopup) |

## 5. Architecture

- 위치: `src/ui/biz/cm/menu/MenuPage.tsx`(공통 cm). 메뉴 데이터: 같은 폴더 `menuData.ts`.
- 컨테이너: `FullPopup`(open/onOpenChange/ footer 슬롯). AppLayout 이 open 상태 소유 + Header `onMenu` 연결 + `isLoggedIn`/`user` 주입.
- 메뉴: `Accordion`(type=multiple) + `AccordionSection`(도메인) + `NavigationItem`(2뎁스).

## Next

1. `/pdca design menu-m12` — 컴포넌트 조립 상세.
2. 구현 + 검증.
