---
template: plan
version: 1.0
feature: cm-stt-info-list-m24
date: 2026-07-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-stt-info-list-m24 Planning Document

> **Summary**: 법령조회(=법령정보, **MUI-CM-04-M24** `SttInfoListPage`) — 고객센터 > 법령조회. 법령구분(싱글 셀렉트 탭) + 법령명 검색으로 법령 목록을 조회, 카드 클릭 시 외부 브라우저로 법령 원문 이동, 즐겨찾기(별) 토글. 설계서 00.공통 v0.84 slide343~344(mockup)·slide344~345(데이터). **Figma 전용 프레임 없음** → 내부 컨벤션(목록 화면 조립). **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-24 · **Status**: Draft

---

## 요청 ID 정정 / 해석

- **요청 ID `MUI-CM-04-P24` 는 설계서에 존재하지 않는다.** 00.공통 v0.84 어디에도 CM-04-P24 없음(P24 는 CM-01-P24 뿐). "법령조회" 화면의 실제 ID = **MUI-CM-04-M24**(화면명 한글 "법령정보", 영문 `SttInfoListPage`) — 설계서 화면목록(slide220) + 앱메뉴 xlsx(sheet1 row664 `E=SttInfoListPage`, sheet3 row448 `G열=법령조회`) 일치. 사용자 호칭 "법령조회" = 앱메뉴 메뉴명(전체메뉴 `support-law`), 화면 타이틀 = 그 메뉴명. 관련 [[cm04-screen-id-conflict]].
- **필수 요청 1(검색필터 페이지 + 바텀시트) = boilerplate.** 설계서 법령조회의 검색조건(dm_searchInfo)은 법령구분(sttType)·법령명(sttNm) 2개뿐이고 **목록 상단 인라인**(별도 풀팝업/바텀시트 없음, slide344). → 검색필터 풀팝업/바텀시트 **미생성**. 관련 [[cm05-guide-pages]] · [[page-request-boilerplate]].
- **추가 요청 2(MUI-BD-01-P14) = 사용자 철회.** ("추가 요청내용중 2번은 안해도된다.") 미구현.

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 전체메뉴 `support-law`(법령조회)가 라우트 미연결(라벨만 존재). 법령조회 화면 자체가 없음. |
| **Solution** | `SttInfoListPage`(`cm/sttInfoList/`) 신규 — 법령구분 TabList(전체+11종, 싱글 셀렉트, 스크롤) + 법령명 검색 + 법령 카드 목록(배지 법령구분/법령약어 + 법령명 + 시행일자 + 즐겨찾기 별) + 더보기 + 맨위로 FAB. 카드 클릭 → 외부 브라우저 법령 원문(sttUrl). |
| **Function/UX Effect** | 고객센터/전체메뉴 > 법령조회 진입 → 법령구분·법령명으로 필터 → 카드 클릭 시 외부 법령 페이지 열림, 별 토글로 관심 등록/해제. |
| **Core Value** | 신규 공통 0 — `TabList`+`InputBox`+`Button`+`Badge`+`Icon`+`ListSectionHeader`+`FloatingActionButton` 조립(관심법령 `ItrstSttPage` 레퍼런스). 항목명 dl_resultList(sttType/sttAbbrNm/sttNm/sttEnfcYmd/sttUrl/sttItrst) 설계서 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 법령조회 화면 부재 + 전체메뉴 링크 미연결 해소 |
| **WHO** | 방위사업 관련 법령을 찾아보는 조달업체/발주기관 사용자 |
| **RISK 1** | 조회/즐겨찾기 실 API 미연동 — 목업(설계서 형식) + 클라 필터/페이징 + 별 토글 로컬 상태(관심법령 선례). `// TODO(백엔드 확정)`. |
| **RISK 2** | 법령구분 컨트롤 형태 — 설계서 "탭 싱글 셀렉트"이나 12종(전체+11)이라 모바일에서 스크롤 TabList(`variant='button'`, scrollButtons auto)로 구현(관심법령엔 없던 컨트롤). 외부링크는 `window.open`(추후 하이브리드 브릿지). |

---

## 결정 사항 / 해석

1. **화면 = 목록 페이지**(`SttInfoListPage`, 폴더 `cm/sttInfoList/`). 라우트 `support/stt-info-list`(고객센터 하위, 형제 `support/faq`·`support/notice` 컨벤션). 타이틀 "법령조회"(메뉴명). 3뎁스 → BottomNav 숨김.
2. **항목명(요청 3)** — 설계서 slide345 dl_resultList 그대로 `types/cm.ts` 신규 `SttInfoItem`: 법령구분 `sttType`·법령약어 `sttAbbrNm`·법령명 `sttNm`·시행일자 `sttEnfcYmd`·링크 `sttUrl`·즐겨찾기 `sttItrst`(+ 로컬 key `id`). 검색조건 `SttInfoSearchFilter`: `sttType`·`sttNm`. ⚠️ 관심법령(`ItrstSttItem`)은 slide106 오기로 법령구분을 `sttSeNm` 으로 잠정 부여했으나, **M24 는 slide345 정본대로 `sttType`** 사용(재사용 안 함).
3. **법령구분 TabList**(싱글 셀렉트) — 전체 + 11종(법령·대통령령·부령·조례·행정규칙·훈령·예규·고시·지침·공고·임의법령, `STT_TYPES` 상수). 선택 시 목록 재구성(클라 필터).
4. **법령명 검색** — InputBox + 검색 버튼(Enter 지원). Like 검색(클라). 검색 실행 시에만 확정(목록 컨벤션).
5. **카드** — Badge(법령구분)+Badge(법령약어) + 법령명(19 Bold) + 시행일자 행 + 즐겨찾기 별(토글). 카드 전면 클릭 = 외부 링크(`window.open`), 별 클릭 = 관심 토글(stretched-link 중첩 버튼 회피 — 관심법령 패턴).
6. **전체메뉴 연결** — `MenuPage` `support-law` 를 `LINKED_MENU_LABELS`/`MENU_ROUTES` 로 배선(라벨 "법령조회").

## Scope

- (신규) `src/ui/biz/cm/sttInfoList/SttInfoListPage.tsx`
- (수정) `src/types/cm.ts` — `SttInfoItem`·`SttInfoSearchFilter`·`STT_TYPES`
- (수정) `src/constants/routes.ts` — `SUPPORT_STT_INFO_LIST`
- (수정) `src/constants/menuLabels.ts` — `LINKED_MENU_LABELS[SUPPORT_STT_INFO_LIST]='법령조회'`
- (수정) `src/ui/biz/cm/menu/MenuPage.tsx` — `support-law` 라벨 링크 + `MENU_ROUTES`
- (수정) `src/router.tsx` — lazy 라우트 `support/stt-info-list`

## Out of Scope

- 검색필터 풀팝업/바텀시트(설계서에 없음). 조회·즐겨찾기 실 API. 법령 원문 상세(외부 링크 위임). MUI-BD-01-P14(철회). 관심법령(MUI-CM-06-M13, 별도 기구현).

## Verification

- `npm run lint && npm run build` 통과 · chunk size 확인.
- slide344 구성(법령구분·법령명 검색·카드·즐겨찾기·외부링크·더보기) 1:1 대조. 항목명(sttType/sttAbbrNm/sttNm/sttEnfcYmd/sttUrl/sttItrst) 설계서 일치 재확인.
