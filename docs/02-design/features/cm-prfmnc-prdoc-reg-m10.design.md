---
template: design
version: 1.0
feature: cm-prfmnc-prdoc-reg-m10
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-reg-m10 Design Document

> 실적증명서 신청 플로우(M10·P11·M12·T12·T13) 설계. Plan: `docs/01-plan/features/cm-prfmnc-prdoc-reg-m10.plan.md`.
> 핵심: 한 라우트 + 3-스텝 컨테이너. 스텝 화면은 설계서 영문 화면명 파일로 분리. **신규 공통 0 · 신규 타입 0**.

---

## 1. 화면 정의 (설계서 00.공통 v0.84 slide286~294 · 화면 목록 slide213)

| 화면 ID | 화면명(영문) | 파일 |
|---------|--------------|------|
| MUI-CM-04-M10 | 계약정보선택 `CtrtInfoChc` | `cm/prfmncPrdocReg/CtrtInfoChc.tsx` |
| MUI-CM-04-P11 | 검색필터-계약정보 `CtrtInfoChc_SrchFilter` | 공통 `SearchFilter` schema 주입(CtrtInfoChc 내) — 별도 파일 없음 |
| MUI-CM-04-M12 | 신청정보입력 `PrfmncPrdocReg_AplyInpt` | `cm/prfmncPrdocReg/PrfmncPrdocReg_AplyInpt.tsx`(+`.schema.ts`) |
| MUI-CM-04-T12 | 실적정보(방위사업청) `PrfmncPrdocReg_D2b` | `cm/prfmncPrdocReg/PrfmncPrdocReg_D2b.tsx` |
| MUI-CM-04-T13 | 실적정보(unitB) `PrfmncPrdocReg_UnitB` | `cm/prfmncPrdocReg/PrfmncPrdocReg_UnitB.tsx` |
| (컨테이너) | `PrfmncPrdocRegPage` — 설계서 ID 없음(도메인 조립물) | `cm/prfmncPrdocReg/PrfmncPrdocRegPage.tsx` |

- breadcrumb: 메인 홈 > 고객센터 > 민원서류 발급 신청 > 실적증명서 신청 목록 > 신청
- 라우트: `/support/dcmnt-issu-aply/prfmnc-prdoc/reg` (`ROUTES.SUPPORT_PRFMNC_PRDOC_REG`) · 헤더 타이틀 **실적증명서 신청**
- 진입점: M06 (+)시트 [실적증명서 신청] · M07 [신청 및 수정] · M04 허브 [실적 증명서 신청]

## 2. 플로우 (컨테이너 소유)

```
StepBar [1 계약 정보 선택 → 2 신청정보 입력 → 3 실적정보 입력]
footer 버튼 바 = sticky bottom-0 하단 고정(border-t + bg + safe-area pb — 확립 패턴, 2026-07-20 요청)
step1 CtrtInfoChc — 안내 + 빠른검색(계약번호) + 총건수 + 계약 카드(선택 토글, 카드 전체 버튼) + 더보기 + SearchFilter(P11)
  footer [취소 | 다음으로(미선택 비활성)]
  · 취소(작성내용 有) → AlertModal "작성하신 내용이 사라집니다. 정말 작성을 취소하시겠습니까? (N/Y)"
  · 작성내용 有 상태에서 선택 해제/변경 → AlertModal "…정말 계약을 변경하시겠습니까? (N/Y)" → 폼 리셋
step2 PrfmncPrdocReg_AplyInpt — RHF+zod: 신청인 연락처*(tel)/발급수량*(1~10통 select)/제출처*/
  사용목적*(방위사업청, 10종·기타 시 상세 내용) 또는 제출유형*(부대, 10종) + 유의사항 Infobox
  footer [이전 | 다음으로(handleSubmit)]
step3 분기(slide286): 방위사업청 → PrfmncPrdocReg_D2b(T12) · 부대+시설공사 → PrfmncPrdocReg_UnitB(T13) ·
  부대+비시설공사 → 미구현 안내(스텁)
  footer [저장 | 신청] → Toast "저장 되었습니다." / "신청이 완료되었습니다."(닫힌 뒤 목록 복귀)
```

## 3. 스텝 상세

- **T12(방위사업청)**: 실적정보 — 납품/지출년도 `prfmncYr`(YearInput) · 납품금액 `prfmncIdntyAmt` · 선금금액 `prpamtIdntyAmt` · 정산금액 `clclnAmt` · 착수금액 `otstDmndAmt` · 중도금액 `mdwyDmndAmt`(numeric+콤마, 단위 '원') · 보증보험번호 `grnteInsrncNo` · 확인요청사항 `idntyDmndMttr` · 납품일자 `clclnYmd`(DateInput). 사용목적별 노출 규칙(slide289)은 주석 — 목업 '기타'=전부 표시. 검증 규칙 미정 → UI 만.
- **T13(unitB)**: 확인 탭(T03)과 동일 섹션의 **입력판** — 섹션 순서(2026-07-20 사용자 확정): 시공자(대표: 불러온 정보 read-only) → 계약및준공(총공사: 계약일자*·공사금액* → 금차공사) → 공사성질·공동도급 여부·실적의 종류(box 체크박스, 편집 가능) → 시공자 (대표)/시공자 1/시공자 2(지분율 % 입력) → 텍스트영역 5종(TextArea) → **하도급 내용**(단일 섹션 안에 3건 입력 그룹) → 실적증명 발급일 기준 시공내용 → 최저가 적정성심사관련 시공실적자료(제출유형 5). 제출유형(1/2/5)별 라벨·노출 규칙은 주석(목업 유형 1).
- **P11 schema**: 기간 설정*(aplyYmd, 최근 1/3/6개월) → 검색어(ctrtNo) → 구분 설정(prcsStts) — M06 확정 순서.

## 4. 데이터 — 신규 타입 0 (기정의 재사용)

`PrfmncPrdocCtrtInfo`(계약 카드) · `PrfmncPrdocAplyInptInfo`(신청/실적정보 1.3+1.4) · `PrfmncPrdocAplyRprsInfo`/`WholCstrnInfo`/`CstrnInfo`/`CstrnTypeInfo`/`JntCtrcInfo`/`PrfmncTypeInfo`/`SbctrInfo`/`LwprcInfo`(unitB). 제출유형은 항목명 미정의 → 폼 로컬 필드(usePrpsCd 에 겸용 저장, 주석 경계 — 항목명 확정 시 분리).

## 5. 배선

- `routes.ts` + `router.tsx`(lazy, sub 헤더 '실적증명서 신청') · 진입점 3곳 navigate 교체. 아이콘 신규 없음.
