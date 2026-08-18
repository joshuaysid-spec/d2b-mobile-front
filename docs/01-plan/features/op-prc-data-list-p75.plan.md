---
template: plan
version: 1.0
feature: op-prc-data-list-p75
date: 2026-08-18
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# op-prc-data-list-p75 Planning Document

> **Summary**: 조달계획 상세 > 품목명세서 탭(MUI-OP-01-T05 `PrcmPlanDtl_PrdList`)의 "군급-재고번호" 행 **[보기] 버튼 클릭 시** 품목별가격자료(MUI-OP-01-P75 `PrcDataList`) **바텀시트**를 연다. 설계서 01.조달계획 v0.82 slide72(화면 p71) + slide73~74(항목설명 p72~73). 피그마 디자인 없음 → 기존 검색 바텀시트(ItemInq·WarSplList_Inq) UI 재사용. **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-08-18 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 품목명세서 탭의 재고번호 [보기]가 `console.log` 스텁 — 설계서가 정의한 품목별가격자료조회(P75) 화면이 없다. |
| **Solution** | 콘텐츠 전용 컴포넌트 `PrcDataList`(검색조건 dm_searchInfo + 결과 dl_resultList) 신설, 컨테이너(`BottomSheet`)는 부모 탭 콘텐츠(`PrcmPlanDtl_PrdList`)가 소유. |
| **Function/UX Effect** | 재고번호 [보기] → 군급/NIIN 자동 입력 + 즉시 검색 결과 표시, 획득구분·부품번호·품명으로 재검색. |
| **Core Value** | 항목명은 설계서 항목설명(slide73~74) 영문 항목명 그대로(`acqstnTypeCd`·`fsc`·`niin`·`prtsNo`·`itemNm`·`untprc` 등). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 재고번호 [보기] 스텁을 설계서 P75 로 실체화 (사용자 요청 2026-08-18) |
| **WHO** | 조달계획 품목의 과거 획득(가격) 실적을 조회하는 조달업체 사용자 |
| **RISK 1** | 설계서 화면목록(slide58)의 경로는 `ovsPrcmPlanDtl/PrcDataList.tsx` 이나, P75 는 국내 품목명세서(slide29)와 국외 결과목록(slide68) **양쪽에서 호출되는 공용 시트**다. P76(`warSplList_Inq/` 자체 폴더) 선례를 따라 **`src/ui/biz/op/prcDataList/`** 자체 폴더로 둔다(폴더명 = 화면 ID camelCase). |
| **RISK 2** | 설계서 이벤트(slide71): 재고번호 클릭 시 실적 'Y' → P75, 그 외 → P76(목록정보조회). 품목명세서 목업(slide29)에는 실적 컬럼이 없어 분기 기준 데이터가 미확정 → **이번 작업은 [보기] → P75 고정**, P76 분기는 실적 필드 확정 시 후속(코드 주석 TODO). |
| **RISK 3** | 획득구분 코드값(acqstnTypeCd, 자리수 8)은 설계서에 라벨만 있고 코드 미정("상세설계 기간 작성 예정") → 목업 코드 `01`~`06` + `TODO(백엔드 확정)`. |

---

## 결정 사항 / 해석

1. **영문 화면명** — 설계서 slide58 화면목록: MUI-OP-01-P75 품목별가격자료 = **`PrcDataList`**. 파일 = `src/ui/biz/op/prcDataList/PrcDataList.tsx` (RISK 1 의 폴더 결정).
2. **컨테이너 소유** — CLAUDE.md "*Sheet 래퍼 금지": `BottomSheet`(타이틀 '품목별 가격자료', footer '닫기' 단일 버튼)는 **부모 `PrcmPlanDtl_PrdList` 가 직접 렌더**, `PrcDataList` 는 콘텐츠 전용.
3. **검색조건(dm_searchInfo, slide73)** — 획득구분 `acqstnTypeCd`(필수, 기본 '전체', SelectBox: 전체/상업실적사/FMS실적가/BOA청구가/CSP구매가/업체공표(견적)가/무관정보가) · 군급 `fsc` · NIIN `niin` · 부품번호 `prtsNo` · 품명 `itemNm`. **부분 입력 가능**(전 필드 선택 입력, 검증 없음) → RHF/zod 불필요, 로컬 state.
4. **진입 동작(slide72)** — "진입 시 군급 입력 가능 상태로 가상 키패드 활성화" → 군급 InputBox `inputType="numeric"` + autoFocus(웹은 디바이스 키보드). "진입 이전 정보가 있는 경우 해당 정보 입력 후 검색 결과 표시" → [보기] 클릭한 행의 재고번호(`invtNo`)를 prop 으로 받아 군급/NIIN 분해('-' 앞 4자리 = fsc, 뒤 = niin) 자동 입력 + **자동 1회 조회**.
5. **검색 결과(dl_resultList, slide74)** — "총 N건" + 건별 `Table`(label/value) 반복. 기본 노출 6행(순번·획득구분·획득구분명·군급·NIIN·부품번호) + "내역 펼쳐보기/접기"로 22항목 전체 토글(품목명세서 `SpecItemCard` 패턴 재사용). **항목 클릭 없음**(slide72 명시 — onSelect 없음).
6. **데이터 연결** — CLAUDE.md API 컨벤션: `queries/op.ts` 의 `usePrcDataList`(useQuery, `enabled` = 검색 확정값 존재) 훅만 소비. EP = `services/op.ts` 상단, 목업 = `mocks/op.ts`(설계서 항목명·형식 그대로, 품목명세서 목업 재고번호와 정합).
7. **UI 재사용** — 기존 공통만 조립: `BottomSheet`·`ButtonGroup`·`SelectBox`·`InputBox`·`InputLabel`·`Button`·`Icon`·`Table`. 검색 폼 레이아웃은 `ItemInq`(P71), 시트 구성은 `WarSplList_Inq`(P76) 준용.

## Scope

- (신규) `src/ui/biz/op/prcDataList/PrcDataList.tsx` — P75 바텀시트 콘텐츠(검색조건 + 결과 목록)
- (수정) `src/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_PrdList.tsx` — [보기] 스텁 제거 → BottomSheet 컨테이너 + PrcDataList 배선
- (수정) `src/types/op.ts` — `PrcDataSearchRequest` · `PrcDataItem` · `PrcDataResult`
- (수정) `src/mocks/op.ts` — `MOCK_OP.prcDataList`
- (수정) `src/services/op.ts` — `EP.PRC_DATA` + `opService.getPrcDataList`
- (수정) `src/queries/op.ts` — `opKeys.prcDataList` + `usePrcDataList`

## Out of Scope

- 실적('Y') 여부에 따른 P75/P76 분기(slide71) — 실적 필드 미확정, [보기] → P75 고정 (RISK 2).
- 국외 결과목록(T72 `OvsPrcmPlanDtl_RsltList`) 재고번호 클릭 배선 — 해당 탭 진입점 부활 시 후속.
- 품목명세서 탭 자체의 useQuery 전환(현 인라인 목업 유지) — 별도 배선 작업.

## Verification

- `npm run lint && npm run build` 통과 · chunk size 확인.
- 설계서 slide72(화면) / slide73~74(항목설명) 1:1 대조: 검색조건 5필드 · 획득구분 7옵션 · 결과 22항목 · 내역 펼쳐보기 · 항목 클릭 없음 · 진입 시 군급/NIIN 프리필 + 자동 조회.
