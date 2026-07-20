---
template: design
version: 1.0
feature: cm-prfmnc-prdoc-dtl-m07
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-dtl-m07 Design Document

> 실적증명서 확인(상세)(MUI-CM-04-M07 + T01·T03) 설계. Plan: `docs/01-plan/features/cm-prfmnc-prdoc-dtl-m07.plan.md`.
> 핵심: 상세 컨벤션(`PrcmPlanDtlPage`) — sticky 요약 + 탭 + 탭별 컴포넌트(Accordion+Table 데이터 구동). **신규 공통 0**.

---

## 1. 화면 정의 (설계서 00.공통 v0.84 slide243~250 · 항목설명 slide266~270 · 화면 목록 slide212)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-M07(공통) · T01(계약정보) · T03(신청정보 unitB) |
| 화면명(영문) | `PrfmncPrdocDtlPage` · `PrfmncPrdocDtl_Cn` · `PrfmncPrdocDtl_UnitB` (화면 목록 slide212 그대로) |
| 경로(설계서) | `src/ui/biz/cm/prfmncPrdocDtl/` |
| breadcrumb | 메인 홈 > 고객센터 > 민원서류 발급 신청 > 실적증명서 신청 목록 > 상세 |
| 헤더 타이틀 | **실적증명서 확인** (slide243 타이틀바) |
| 라우트 | `/support/dcmnt-issu-aply/prfmnc-prdoc/:prfmncRcptNo` — 목록 카드 navigate(state) |
| Figma | 전용 프레임 없음 — 상세 컨벤션 준수(추가 요청 1) |

---

## 2. 레이아웃 (M07 공통 — slide243)

```
sticky 상단 (useCollapsibleHeader, 스크롤 시 축소)
  SummaryInfo — badges[계약구분(ctrtSe)·진행상태(prgrsStcd)] +
                subtitle "접수번호 {prfmncRcptNo} · 계약번호 {ctrtNo}" + title 품명 +
                rows[실적 신청금액/발급기관/신청일자/처리일자]   ← M06 카드와 동일(state 전달)
  TabList — [계약정보 | 신청정보]
탭 콘텐츠 (min-h-100dvh)
  계약정보  → PrfmncPrdocDtl_Cn (T01)
  신청정보  → PrfmncPrdocDtl_UnitB (T03) ※ 계약구분 분기(T02/T04~)는 추후 — switch 주석 경계
하단 발급 버튼 — 진행상태 '발급'일 때만 "실적증명서 발급"(PDF 진본성 — 스텁)
FAB — 맨위로 + (+) 버튼 **항상 노출**(2026-07-20 수정 요청) → 액션 시트(BottomSheet):
  [신청 및 수정] **항상 노출**(2026-07-20 수정 요청 — 설계서 원문은 '저장' 상태 한정)
  · 발급 상태 → [발급][제출→P20 스텁] · 반려/저장/회송 → [삭제→AlertModal 확인]
```

## 3. T01 계약정보 (slide244 · dm_ctrtInfo slide266)

| 섹션 | 행(label → 항목명) |
|------|--------------------|
| 계약정보 | 계약번호(차수)→`ctrtNo`(`CtrtOd`) "98765432101(00)" · 계약구분→`ctrtCnNm` · 계약건명/대표물품→`ctrtNm`(`rprsItemNm`) · 계약금액(원)→`ctrtAmt`(number) · 발주기관→`orderInstNm` |
| 계약담당관(연락처) | 기관 부서명→`orderInstNm` · 담당자→`picNm` · 연락처→`enPicTel` |

## 4. T03 신청정보(unitB — 계약 부대+시설공사) (slide246~250 · 항목설명 slide266~270)

섹션 구성 — **2026-07-20 사용자 확정 순서**(설계서 '공동도급 여부'는 요청에 따라 제외). 데이터 없으면 숨김(slide249 "정보가 없는 경우 빈칸을 노출하지 않고 숨김"):

1. **신청정보** — 제출유형(영문 항목명 설계서 미정의 → 로컬 목업 상수) · 신청인 연락처 `entlno` · 제출처 `submOrgn` · 발급수량 `dmndQty`
2. **시공자(대표)** `dm_prfmncPrdocAplyRprsInfo` — 회사명 `bzentyNm` · 면허번호 `lcnsNoVl` · 대표자 `rprsvNm` · 전화번호 `telno` · 영업소재지 `salsLctnAddr`
3. **계약 및 준공 (총공사 기준)** `dm_prfmncPrdocAplyWholCstrnInfo` — 계약일자 `ctrtYmd` · 착공일자 `bgncstYmd` · 준공일자 `cmcnYmd` · 준공금액 `cmcnAmt` · 관급금액 `gvspAmt` · 공사금액[준공+관급] `cstrnAmt`
4. **계약 및 준공 (금차공사 기준)** `dm_prfmncPrdocAplyCstrnInfo` — 항목명 `*2`(ctrtYmd2 …)
5. **공사성질** `dm_prfmncPrdocAplyCstrnTypeInfo` — 건설공사 `cnstrDivs`(신규/확장/개보수) · 전기/그 밖의 `eltyDivs`(신규/증설/이설/개설/보수) — **사각 체크박스(base Checkbox `variant="box"` — AgreementList 동일 모양, 읽기전용 disabled) 재현**(2026-07-20 요청 — 칩형 CheckboxGroup → box 로 교체)
6. **공동도급 여부** `dm_prfmncPrdocAplyJntCtrcInfo.jntCtrcCd` — 공동이행방식/분담이행방식/단독도급 체크박스(2026-07-20 재추가)
7. **실적의 종류** `dm_prfmncPrdocAplyprfmncTypeInfo.rsltDivs`(다중) — 개념설계/기본설계/실시설계/시공/감리/품질, 공사관리/시운전/기자재제작설치/기자재설치/기타 체크박스
8~10. **시공자 (대표)/시공자 1/시공자 2** — 회사명 `cnstBzentyNm` · 사업자등록번호 `enbrno` · 대표자명 `rprsvNm` · 공시금액 `cstrnAmt`(지분율) · 준공금액 `cmcnAmt`(지분율) · 관급금액 `gvspAmt` · 전체공사 시공금액(관급포함) `wholCstrnCnstAmt`
10~14. **텍스트 영역 5종(정적 블록 — 긴 헤딩이라 아코디언 미사용)** — 전체공사 시공규모 `wholCstrnCnstSclExpln` · 시공회사별 실적공종/PQ공종 시공규모·방법 `cnstBcoSclMthdCn` · 금액 `cnstBcoCnstAmtCn` · 준공금액 `cnstBcoCmcnAmtCn` · 관급금액 `cnstBcoGvspAmtCn` (제출유형 1/2/5별 라벨·노출 규칙은 주석 기록)
15~17. **하도급자 ×3** `dm_prfmncPrdocAplySbctrInfo` — 헤딩 "하도급자 : {sbctrSeNm}" · 규모및내용 `sbctrCstrnSclCn` · 하도금금액[준공+관급] `sbctrAmt`
18. **실적증명 발급일 기준 시공내용**(텍스트 영역) ※ 항목명이 `cnstBcoGvspAmtCn` 로 **설계서 중복 정의**(오기 추정) — 주석 기록
19. **최저가 적정성심사관련 시공실적자료** `dm_prfmncPrdocAplyLwprcInfo` — 시공내용 `cnstCn` · 사용장비명 `useEqpmntNm` · 장비규격 `eqpmntSpcfctCn` · 투입대수 누계 `inputCntomCn` · 작업량 누계 `wkqtyActotCn` · 작업시간 누계 `jobHrActotCn` · 시간당 작업량 `ptmWkqtyCn` · 기타 참고사항 `etcRefMttr`

## 5. 배선

- `routes.ts`: `SUPPORT_PRFMNC_PRDOC_DTL: '/support/dcmnt-issu-aply/prfmnc-prdoc/:prfmncRcptNo'`
- `router.tsx`: lazy + `handle: { header:{ variant:'sub', title:'실적증명서 확인' }, scrollReset:true }`
- `PrfmncPrdocPage.tsx`: 카드 클릭 → `navigate(경로, { state: item })` (목록→상세 표준)
- 아이콘: 신규 없음.
