---
template: plan
version: 1.0
feature: cm-prfmnc-prdoc-reg-m10
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-reg-m10 Planning Document

> **Summary**: 실적증명서 신청 플로우 — 계약정보선택(MUI-CM-04-M10 `CtrtInfoChc`) + 검색필터(P11 `CtrtInfoChc_SrchFilter`) + 신청정보입력(M12 `PrfmncPrdocReg_AplyInpt`) + 실적정보 입력(T12 방위사업청 `PrfmncPrdocReg_D2b` · T13 unitB `PrfmncPrdocReg_UnitB`). 설계서 00.공통 v0.84 slide286~294(화면)·266~270(항목설명 공유). 3-스텝 플로우(계약 정보 선택 → 신청정보 입력 → 실적정보 입력)를 한 라우트의 컨테이너 페이지가 소유. **Figma 전용 프레임 없음** → 내부 컨벤션. **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 실적증명서 신청(M06 (+)시트·M07 신청 및 수정·허브 카드)이 전부 console.log 스텁이다. |
| **Solution** | 3-스텝 신청 플로우 구현 — 계약 선택(검색+카드 선택) → 신청정보(RHF+zod 폼) → 계약구분별 실적정보(방위사업청/unitB) 입력 + 저장/신청(토스트). |
| **Function/UX Effect** | 목록 (+) 실적증명서 신청 → 계약 선택 → 정보 입력 → 저장/신청. 신청 완료 시 목록 복귀. |
| **Core Value** | 신규 공통 0 — StepBar·SearchCondition·SearchFilter·CardList·InputBox·SelectBox·DateInput·YearInput·Checkbox(box)·Infobox·Toast 조립. 항목명은 설계서 dm_* 그대로(기정의 타입 재사용 — 신규 타입 0). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 민원서류발급신청의 핵심 업무(실적증명서 신청 작성) 부재 해소 |
| **WHO** | 계약 실적증명서를 신청·저장하는 조달업체 사용자 |
| **RISK 1** | 실적정보 분기 3종 중 **T12(방위사업청)·T13(unitB)만 구현**(추가 요청 2 "unitB까지만") — 부대+비시설공사(unitC~) 분기는 스텁 |
| **RISK 2** | 실적정보(T12/T13) 검증 규칙 미정("상세설계 기간 작성 예정") — 입력 UI만 구성, 저장/신청은 스텁 |

---

## 결정 사항 / 해석

1. **플로우 컨테이너 `PrfmncPrdocRegPage`** — 설계서에 플로우 전체를 감싸는 화면 ID 가 없어(스텝 화면 M10/M12/T12/T13 만 정의) 폴더명(prfmncPrdocReg) 기반 컨테이너 페이지(도메인 전용 조립물)를 신설, 한 라우트에서 StepBar(계약 정보 선택→신청정보 입력→실적정보 입력) + 스텝 상태 + footer 버튼 + 팝업/토스트를 소유한다. 헤더 타이틀 = **실적증명서 신청**(slide286 타이틀바).
2. **요청서 1번(검색필터 P11)** — M06 P33 과 동일하게 **공통 `SearchFilter` 셸 schema 주입**(기간 설정* + 검색어(계약번호) + 구분 설정(처리상태) — M06 에서 확정된 순서 적용). 별도 파일 없음.
3. **요청서 2번(바텀시트)** — 이 플로우의 신규 바텀시트 없음(날짜/연도 선택은 DateInput/YearInput 내장 시트).
4. **요청서 3번(항목명)** — 전부 기정의 타입 재사용: 계약 카드 = `PrfmncPrdocCtrtInfo`(dm_ctrtInfo) · 신청정보 = `PrfmncPrdocAplyInptInfo`(entlno/dmndQty/submOrgn/usePrpsCd/etcUsePrps) · 실적정보(T12) = 동일 영역 1.4(prfmncYr/prfmncIdntyAmt/prpamtIdntyAmt/clclnAmt/otstDmndAmt/mdwyDmndAmt/grnteInsrncNo/idntyDmndMttr/clclnYmd) · unitB(T13) = 확인(T03)과 동일 dm_* 영역들. **신규 타입 추가 없음.** 제출유형은 항목명 미정의 → 폼 로컬 필드(주석).
5. **계약구분 분기(slide286)** — 방위사업청(발주기관='방위사업청') → 사용목적 select + T12 · 부대+시설공사(계약구분='시설공사') → 제출유형 select + T13(unitB) · 부대+비시설공사 → **미구현 스텁**(추가 요청 2).
6. **M12 폼 = RHF+zod**(프로젝트 폼 표준) — 신청인 연락처*/발급수량*(1~10통)/제출처*/사용목적·제출유형* + 기타 시 상세 내용(refine). 스키마 co-locate(`PrfmncPrdocReg_AplyInpt.schema.ts`). T12/T13 은 검증 규칙 미정 → 표시·입력 UI 만(검증 없음, 주석 경계).
7. **팝업/토스트(slide286·289)** — 계약 변경/취소 확인 AlertModal("작성하신 내용이 사라집니다. …(N/Y)") · 저장/신청 Toast("저장 되었습니다."/"신청이 완료되었습니다." → 신청 후 목록 복귀).

## Scope

- (신규) `src/ui/biz/cm/prfmncPrdocReg/` — `PrfmncPrdocRegPage.tsx`(컨테이너) · `CtrtInfoChc.tsx`(M10+P11 schema) · `PrfmncPrdocReg_AplyInpt.tsx`+`.schema.ts`(M12) · `PrfmncPrdocReg_D2b.tsx`(T12) · `PrfmncPrdocReg_UnitB.tsx`(T13)
- (수정) `routes.ts` — `SUPPORT_PRFMNC_PRDOC_REG: '/support/dcmnt-issu-aply/prfmnc-prdoc/reg'`
- (수정) `router.tsx` — lazy + handle(sub, 실적증명서 신청)
- (수정) 진입점 3곳: `PrfmncPrdocPage`((+)시트) · `PrfmncPrdocDtlPage`(신청 및 수정) · `DcmntIssuAplyPage`(실적 증명서 신청 카드) → navigate

## Out of Scope

- 부대+비시설공사 실적정보 분기(T14~ unitC 이후)·미리보기/제출(P20)·저장/신청 API — 스텁.

## Verification

- `npm run lint && npm run build` 통과.
- slide286(선택/모달)·287(필터)·288(폼·유의사항)·289(T12 필드)·290~294(T13 섹션) 1:1 대조.
