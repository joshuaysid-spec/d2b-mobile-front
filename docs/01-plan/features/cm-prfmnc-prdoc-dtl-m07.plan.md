---
template: plan
version: 1.0
feature: cm-prfmnc-prdoc-dtl-m07
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-dtl-m07 Planning Document

> **Summary**: 실적증명서 확인(상세)(MUI-CM-04-M07 `PrfmncPrdocDtlPage`) + 계약정보 탭(T01 `PrfmncPrdocDtl_Cn`) + 신청정보 unitB 탭(T03 `PrfmncPrdocDtl_UnitB`). 설계서 00.공통 v0.84 slide243~250(화면)·266~270(항목설명). 목록(M06) 카드 클릭 → 상세. 상단 요약(sticky·축소) + 탭 2개(계약정보/신청정보) + 상태별 하단 발급 버튼·(+)액션 시트. **Figma 전용 프레임 없음** → 상세 컨벤션(`PrcmPlanDtlPage` 레퍼런스). **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | M06 목록 카드 클릭이 스텁 — 실적증명서 상세를 볼 수 없다. |
| **Solution** | 상세 컨벤션대로 M07 페이지 + 탭 콘텐츠 2종(T01·T03) 신규. 목록 state 전달 + 페이지 fallback 목업. |
| **Function/UX Effect** | 목록 카드 → 상세(요약 sticky + 계약정보/신청정보 탭). 발급 상태면 하단 "실적증명서 발급" 버튼, (+) 버튼으로 상태별 액션(신청및수정/발급/제출/삭제). |
| **Core Value** | 신규 공통 0 — `useCollapsibleHeader`+`SummaryInfo`+`TabList`+`Accordion`+`Table` 조립. 항목명은 dm_* 데이터영역 설계서 영문 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 실적증명서 신청 목록(M06)의 상세 진입(M07) 부재 해소 |
| **WHO** | 신청한 실적증명서의 계약/신청정보·진행상태를 확인하는 조달업체 사용자 |
| **RISK 1** | 신청정보 탭은 계약구분별 분기(T02 방위사업청/T03 unitB/T04~T11) — 이번 범위는 **T03(unitB)만**, 나머지는 추후(요청 화면 ID: M07·T01·T03) |
| **RISK 2** | 제출유형·실적증명서 제출(P20)·발급(PDF 진본성) 연동 미확정 — 스텁 |

---

## 결정 사항 / 해석

1. **요청서 1번(검색필터) 해당 없음** — 상세 화면(slide243~250)에 검색조건 없음.
2. **요청서 2번(바텀시트)** — (+) FAB 의 상태별 액션 시트는 공통 `BottomSheet`+`ButtonGroup` 인라인 조립(신규 시트 파일 0). 삭제 확인은 공통 `AlertModal`("정말 삭제하시겠습니까?" — slide243).
3. **요청서 3번(항목명 영문)** — slide266~270 데이터영역 그대로 `types/cm.ts` 에 추가: `dm_prfmncPrdocAplyInfo`(prfmncRcptNo/prfmncPrgrsSttsCd)·`dm_ctrtInfo`(ctrtNo/CtrtOd/ctrtCnNm/ctrtNm/rprsItemNm/ctrtAmt/orderInstNm/picNm/enPicTel)·`dm_prfmncPrdocAplyInptInfo`(entlno/dmndQty/submOrgn/usePrpsCd/etcUsePrps + prfmncYr~clclnYmd)·시공자(대표)(bzentyNm/lcnsNoVl/rprsvNm/salsLctnAddr/telno)·총공사/금차공사(ctrtYmd·bgncstYmd·cmcnYmd·cstrnAmt·cmcnAmt·gvspAmt, 금차는 `*2`)·공사설정(cnstrDivs/eltyDivs)·공동도급(jntCtrcCd)·실적의종류/시공자카드(rsltDivs/cnstBzentyNm/enbrno/…/cnstBcoGvspAmtCn)·하도급(sbctrSeNm/sbctrCstrnSclCn/sbctrAmt)·최저가자료(cnstCn/useEqpmntNm/…/etcRefMttr). 차수 항목명은 설계서 표기 그대로 **`CtrtOd`**(대문자 C — 설계서 "ctrtNo/CtrtOd").
4. **제출유형은 영문 항목명이 설계서에 없음**(mock 에만 존재, 항목설명 표 미정의) → 도메인 타입에 임의 명칭을 만들지 않고 **탭 로컬 목업 상수**로 표기. 항목명 확정 시 타입 추가.
5. **신청정보 탭 분기** — M07 공통 탭은 계약정보/신청정보 2개. 신청정보 콘텐츠는 계약구분별 3분류(방위사업청 T02 / 부대+시설공사 unitB T03 / 부대+비시설공사) 중 **T03(unitB)만 구현**, 분기 스위치에 주석으로 경계 표시.
6. **상태별 액션(slide243)** — 발급 버튼: 진행상태 '발급'만. (+)시트: 신청및수정=저장 · 발급/제출=발급(제출→P20 스텁) · 삭제=반려/저장/회송(AlertModal). 목록 아이템의 표시 상태(prgrsStcd)로 구동.
7. **T03 조건부 표기(제출유형 1/2/5별 라벨·노출 변경, 정보 없으면 섹션 숨김)** — 데이터 유무로 섹션 숨김은 구현, 제출유형별 라벨 전환은 mock(제출유형 1) 기준 + 주석으로 규칙 기록(API 연동 시 반영).

## Scope

- (신규) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtlPage.tsx` (M07)
- (신규) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_Cn.tsx` (T01 계약정보)
- (신규) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitB.tsx` (T03 신청정보 unitB)
- (수정) `src/types/cm.ts` — 상세 데이터영역 타입 추가
- (수정) `src/constants/routes.ts` — `SUPPORT_PRFMNC_PRDOC_DTL: '/support/dcmnt-issu-aply/prfmnc-prdoc/:prfmncRcptNo'`
- (수정) `src/router.tsx` — lazy + handle(sub, 실적증명서 확인, scrollReset)
- (수정) `src/ui/biz/cm/prfmncPrdoc/PrfmncPrdocPage.tsx` — 카드 클릭 → 상세 navigate(state)

## Out of Scope

- 신청정보 타 분기 탭(T02 방위사업청, T04~T11 unitC~I)·실적증명서 제출(P20)·신청/수정 플로우(M08·M12)·PDF 발급(진본성) — 스텁.

## Verification

- `npm run lint && npm run build` 통과.
- slide243(공통)·244(T01)·246~250(T03) 섹션/항목/값 형식 1:1 대조.
