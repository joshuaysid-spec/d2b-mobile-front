---
template: plan
version: 1.0
feature: cm-prfmnc-prdoc-m06
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-m06 Planning Document

> **Summary**: 실적증명서 신청 목록(MUI-CM-04-M06, `PrfmncPrdocPage`) — 고객센터 > 민원서류발급신청 > 실적증명서 신청 목록. **검색 + 카드 목록 화면**(설계서 00.공통 v0.84 slide240~242). 검색필터(MUI-CM-04-P33)는 공통 `SearchFilter` 셸에 schema 주입 — **신규 바텀시트 0**(공통 검색시트 불필요, 신청 시트는 공통 `BottomSheet` 조립). **Figma 전용 프레임 없음** → 목록 컨벤션(`PrcmPlanIntgListPage` 레퍼런스)으로 스타일. **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 민원서류발급신청 허브의 "실적 증명서 신청 목록" 카드가 스텁이다. |
| **Solution** | slide240~241 기준 목록 페이지 `PrfmncPrdocPage` 신규 — 업무도움 + 빠른검색(계약번호) + 검색필터(P33, 공통 SearchFilter) + 카드 목록 + 더보기 + (+)FAB 신청 바텀시트. |
| **Function/UX Effect** | 허브 > 실적 증명서 신청 목록 탭 → 신청/접수 목록 조회·검색, (+) 버튼으로 실적증명서 신청 진입(스텁). |
| **Core Value** | 신규 공통 0 — 목록 화면 표준 조립(`PrcmPlanIntgListPage` 패턴) + 항목명은 dm_searchInfo·dl_resultList 설계서 영문 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 민원서류발급신청(M04) 허브 바로가기 2번째 화면(M06) 부재 해소 |
| **WHO** | 실적증명서 신청 내역을 조회/신청하는 조달업체 모바일(웹뷰) 사용자 |
| **RISK 1** | 상세(M07)·신청 플로우(M08/P21) 미구현 — 카드 클릭·신청 버튼은 console.log 스텁 |
| **RISK 2** | 처리상태(prcsStts) 코드값 미확정(자리수 1) — 임시 값으로 두고 백엔드 코드 확정 시 교체 |

---

## 결정 사항 / 해석

1. **요청서 1번(검색필터) 적용** — slide240 검색필터(MUI-CM-04-P33 `PrfmncPrdocPage_SrchFilter`)는 **공통 `SearchFilter` 셸에 schema 주입**으로 구현(별도 풀팝업 파일 생성 X — 검색필터 컨벤션). 섹션: 기간 설정*(빠른 설정 최근 1/3/6개월) · 구분 설정(처리상태) · 검색어(계약번호).
2. **요청서 2번(바텀시트)** — 검색필터 안에서 여는 공통 검색시트(품목/생산자/부서 등)는 이 화면에 **해당 없음**(필드가 dateRange/select/text 뿐). (+) FAB 의 "실적증명서 신청" 시트는 공통 `BottomSheet` + `ButtonGroup` 인라인 조립(컨테이너는 페이지 소유 — `*Sheet` 래퍼 금지 규칙).
3. **요청서 3번(항목명 영문)** — 검색조건 `dm_searchInfo`(aplyYmdFrom/aplyYmdTo/ctrtNo/prcsStts) · 데이터영역 `dl_resultList`(prfmncRcptNo/ctrtNo/ctrtSe/ctrtNm/rprsItemNm/ctrtAmt/orderInst/aplyYmd/prcsYmd/prgrsStcd) 설계서 그대로 `types/cm.ts` 에 정의. 기간 FROM/TO 쌍은 기존 컨벤션(NoticeSearchFilter.regDt)대로 `DateRangeValue` 1키(aplyYmd)로 묶고 주석으로 aplyYmdFrom/To 매핑 명시.
4. **추가 요청 1(Figma 없음)** — 목록 컨벤션 레퍼런스 `PrcmPlanIntgListPage` 조립 그대로(업무도움 Infobox → SearchCondition → ListSectionHeader → CardList → 더보기 → FAB → SearchFilter).
5. **카드 표기(설계서 mock 기준)** — 타이틀: 물품=대표품명(rprsItemNm)·공사=계약건명(ctrtNm)(mock 카드 표기). 정보행: 실적 신청금액/발급기관/신청일자/처리일자. mock 의 "판단번호" 라벨은 항목설명에 없어 **계약번호(ctrtNo)로 통일**(불일치 기록).
6. **실적증명서 신청 업체(dm_prfmncPrdocAplyBzentyInfo)** — slide241 1.3 에 정의되나 slide240 목업에 표시 위치가 없음 → **신청 플로우(M08/P21) 작업 시 타입 추가·사용**(이번 범위 제외).

## Scope

- (신규) `src/ui/biz/cm/prfmncPrdoc/PrfmncPrdocPage.tsx`
- (수정) `src/types/cm.ts` — `PrfmncPrdocItem`(dl_resultList)·`PrfmncPrdocSearchFilter`(dm_searchInfo)
- (수정) `src/constants/routes.ts` — `SUPPORT_PRFMNC_PRDOC: '/support/dcmnt-issu-aply/prfmnc-prdoc'`
- (수정) `src/router.tsx` — lazy 등록 + handle(sub, 실적증명서 신청 목록, scrollReset)
- (수정) `src/ui/biz/cm/dcmntIssuAply/DcmntIssuAplyPage.tsx` — 실적 증명서 신청 목록 카드 → navigate

## Out of Scope

- 실적증명서 상세(M07 `PrfmncPrdocDtlPage`)·신청 플로우(M08, P21 `CtrtInfoChc`, M12 `PrfmncPrdocReg_AplyInpt`) — 별도 작업(카드/신청 버튼은 스텁).
- 처리상태 코드값 확정·API 연동(목업 + 경계 스텁).

## Verification

- `npm run lint && npm run build` 통과.
- slide240 구성(빠른검색 계약번호 / 필터 3섹션 / 카드 필드·배지 / 더보기 / (+)신청 시트) 1:1 대조.
