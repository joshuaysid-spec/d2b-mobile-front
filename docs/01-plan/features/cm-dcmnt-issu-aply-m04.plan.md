---
template: plan
version: 1.0
feature: cm-dcmnt-issu-aply-m04
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-dcmnt-issu-aply-m04 Planning Document

> **Summary**: 민원서류발급신청(MUI-CM-04-M04, `DcmntIssuAplyPage`) — 고객센터 > 민원서류발급신청의 **메뉴(허브) 화면**. 상단 업체정보(MUI-CM-02-M01 `dm_bzentyInfo` 재사용) 아코디언 + 하단 민원서류 하위 화면 바로가기 카드 버튼 5개. 설계서 00.공통 v0.84 slide238(2026-07-13 화면 추가) / Figma `10020-87972`(MUI-CM-04-M13 인증센터 — 카드 버튼 스타일 참조). **신규 공통 컴포넌트 0** — `Accordion`+`Table` 조립 + 카드 버튼은 `CertMngPage` 확립 패턴(아이콘 제외) 재사용.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 고객센터의 민원서류(실적증명서·국외조달원등록증) 신청 하위 화면들로 들어가는 진입점 화면이 없다. |
| **Solution** | 설계서 slide238 기준 허브 페이지 `DcmntIssuAplyPage` 신규 — 업체정보 아코디언(설계서 목업값 그대로) + 바로가기 카드 5개(하위 화면 미구현 → 스텁). |
| **Function/UX Effect** | 전체메뉴 > 고객센터 > 민원서류발급신청 진입 시 표시. 각 카드 탭 → 하위 화면(M05/M06/M08/M09/P10) 이동(추후). |
| **Core Value** | 신규 공통 0 — 아코디언·테이블·카드 버튼 모두 기존 패턴 재사용. 항목명은 `dm_bzentyInfo` 설계서 영문 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 고객센터 > 민원서류발급신청(MUI-CM-04-M04) 진입점 부재 해소 (설계서 2026-07-13 화면 추가분) |
| **WHO** | 실적증명서/국외조달원등록증을 신청하려는 조달업체 모바일(웹뷰) 사용자 |
| **RISK 1** | 요청서 1·2번(검색필터/바텀시트)·5번(타이틀 "관련사이트")·6번(앱 캐시 삭제 팝업)은 다른 화면 템플릿의 잔여 boilerplate — 이 화면은 메뉴 허브라 해당 없음([[cm-site-m15]] 결정 1·2 선례) |
| **RISK 2** | 하위 화면 5종 전부 미구현 — 카드 클릭은 console.log 스텁, 라우트 확정 시 navigate 로 교체 |

---

## 결정 사항 / 해석

1. **요청서 1·2번(검색필터+바텀시트) 해당 없음** — slide238 은 검색조건/데이터영역 없는 메뉴 화면. 요청서 2번 스스로도 "없는 경우 만들 필요 없음" 명시.
2. **요청서 5번(타이틀 "관련사이트") 미적용** — M15 관련사이트 요청의 잔여 boilerplate. 설계서 화면명·메뉴명 = **민원서류발급신청** 을 타이틀로 사용(`LINKED_MENU_LABELS` 단일화).
3. **요청서 6번(앱 캐시 삭제 팝업) 해당 없음** — 설정(MUI-MS-02-M01) 화면 요청의 잔여 boilerplate. slide238 에 관련 요소 없음.
4. **업체정보 = 아코디언**(추가 요청 1) — 공통 `Accordion`/`AccordionSection` + `Table`(label/value) 조립. 항목명·목업값은 MUI-CM-02-M01 `dm_bzentyInfo`(slide191) 그대로: `bzentyNm`·`brno`·`bzentyCd`·`rprsvNm`·`bzentyRgstrtYmd`·`crno`.
5. **바로가기 카드 = Figma M13 카드 버튼에서 선행 아이콘 제외**(추가 요청 2) — `CertMngPage`(MUI-CM-04-M13, 동일 Figma) 확립 스타일에서 좌측 아이콘만 빼고 우측 이동 화살표(`TrendingFlat`)는 유지.
6. **영문 화면 ID `DcmntIssuAply`** (요청서 3번) — 폴더 `cm/dcmntIssuAply/`, 파일 `DcmntIssuAplyPage.tsx`.

## Scope

- (신규) `src/ui/biz/cm/dcmntIssuAply/DcmntIssuAplyPage.tsx`
- (수정) `src/types/cm.ts` — `BzentyInfo`(dm_bzentyInfo) 섹션 추가
- (수정) `src/constants/routes.ts` — `SUPPORT_DCMNT_ISSU_APLY: '/support/dcmnt-issu-aply'`
- (수정) `src/constants/menuLabels.ts` — 민원서류발급신청
- (수정) `src/ui/biz/cm/menu/MenuPage.tsx` — `support-civil-doc` leaf 라벨 단일화 + MENU_ROUTES 연결
- (수정) `src/router.tsx` — lazy 등록 + handle(sub, 민원서류발급신청)

## Out of Scope

- 하위 화면 5종: 신청절차및안내(M05 `AplyStepInfoPage`)·실적증명서신청목록(M06 `PrfmncPrdocPage`)·실적증명서신청(M08)·국외조달원등록증신청목록(M09/M21 `OvsSosCnfdocListPage`)·국외조달원등록증신청(P10/P22 `OvsSosCnfdocReg`) — 별도 작업.
- 업체정보 API 연동(로그인 업체) — 폐쇄망 단계 목업.

## Verification

- `npm run lint && npm run build` 통과, chunk 경고 없음.
- 설계서 slide238 구성(업체정보 6항목 + 바로가기 5개) 1:1 대조.
