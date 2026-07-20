---
template: design
version: 1.0
feature: cm-prfmnc-prdoc-m06
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-m06 Design Document

> 실적증명서 신청 목록(MUI-CM-04-M06, `PrfmncPrdocPage`) 설계. Plan: `docs/01-plan/features/cm-prfmnc-prdoc-m06.plan.md`.
> 핵심: 목록 컨벤션(`PrcmPlanIntgListPage`) 조립 + 검색필터(P33)는 공통 `SearchFilter` schema 주입 + (+)FAB 신청 바텀시트. **신규 공통 0**.

---

## 1. 화면 정의 (설계서 00.공통 v0.84 slide240~242 · 화면 목록 slide212)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-M06 (검색필터: MUI-CM-04-P33) |
| 화면명(한글) | 실적증명서신청목록 |
| 화면명(영문) | PrfmncPrdocPage |
| 경로(설계서) | `src/ui/biz/cm/prfmncPrdoc/PrfmncPrdocPage.tsx` |
| breadcrumb | 메인 홈 > 고객센터 > 민원서류 발급 신청 > 실적증명서 신청 목록 |
| 헤더 타이틀 | **실적증명서 신청 목록** (허브 카드 진입 전용) |
| 라우트 | `/support/dcmnt-issu-aply/prfmnc-prdoc` (`ROUTES.SUPPORT_PRFMNC_PRDOC`) |
| Figma | 전용 프레임 없음 — 목록 컨벤션 준수(추가 요청 1) |
| 이벤트 | slide242 "상세설계 기간에 작성 예정" — 클릭 시 상세 이동·(+) 신청 시트만 확정 |

---

## 2. 레이아웃 (slide240 · PrcmPlanIntgListPage 표준 조립)

```
header/2depth (title: 실적증명서 신청 목록)
─────────────────────────────────────────────
Infobox 업무도움 (full-bleed, 목록 화면 공통 문구)
SearchCondition  — 빠른검색어 + 대상 칩[계약번호] + 검색필터 버튼
ListSectionHeader — 총 N건 · 표시 개수
CardList — 카드(아래 §3) · 클릭 시 상세(M07, 스텁)
더보기 Button (loaded/total)
FloatingActionButton — 맨위로(top) + 신청(+, plus)
  (+) → BottomSheet "실적증명서 신청" : ButtonGroup vertical [실적증명서 신청] 1종 → M08 플로우(스텁)
SearchFilter (풀팝업, 공통 셸 schema 주입)
  기간 설정 *  : dateRange(aplyYmd) + 빠른 설정 [최근 1개월|최근 3개월|최근 6개월]
  검색어       : text 계약번호(ctrtNo) "계약번호를 입력하세요."
  구분 설정    : select 처리상태(prcsStts) — 전체/신청/접수/처리중/발급/반려/보류
  (2026-07-20 수정 요청: 검색어 ↔ 구분 설정 순서 교체 — 검색어가 먼저)
```

### 카드 (slide240 mock 1:1)

| 슬롯 | 값 |
|------|----|
| badges | `Badge` 계약구분(ctrtSe: 물품/공사) + 진행상태(prgrsStcd: 신청/발급 …) |
| subtitle | `접수번호 {prfmncRcptNo} · 계약번호 {ctrtNo}` (mock "판단번호"는 항목설명에 없어 계약번호로 통일) |
| title | 물품=대표품명(rprsItemNm) · 공사=계약건명(ctrtNm) |
| rows | 실적 신청금액(ctrtAmt, number) / 발급기관(orderInst) / 신청일자(aplyYmd) / 처리일자(prcsYmd ?? '-') |

---

## 3. 데이터 (slide241 — 항목명 영문 설계서 그대로)

**검색조건 `dm_searchInfo`** → `PrfmncPrdocSearchFilter`(types/cm.ts)

| 항목명(한글) | 항목명(영문) | 타입 표현 |
|--------------|--------------|-----------|
| 기간(F)/기간(T) | `aplyYmdFrom`/`aplyYmdTo` | `aplyYmd: DateRangeValue` 1키로 묶음(기존 regDt 컨벤션) |
| 계약번호 | `ctrtNo` | string |
| 처리상태 | `prcsStts` | string — 전체/신청/접수/처리중/발급/반려/보류(코드값 미정 → 임시) |

**데이터영역 `dl_resultList`** → `PrfmncPrdocItem`(types/cm.ts): `prfmncRcptNo`·`ctrtNo`·`ctrtSe`·`ctrtNm`·`rprsItemNm`·`ctrtAmt`·`orderInst`·`aplyYmd`·`prcsYmd?`·`prgrsStcd`

- 목업: slide240 표시값 그대로 2건(파카,외피 / 26-평 절개지 복구공사) + 처리상태 변형 시드 → 부풀려 페이징 데모(PrcmPlanIntgListPage MOCK 패턴 — API 연동 시 블록 통째 교체).
- `dm_prfmncPrdocAplyBzentyInfo`(신청 업체)는 목업 표시 위치 없음 → M08 플로우 작업 시 정의.

---

## 4. 배선

- `routes.ts`: `SUPPORT_PRFMNC_PRDOC: '/support/dcmnt-issu-aply/prfmnc-prdoc'`.
- `router.tsx`: lazy + `handle: { header:{ variant:'sub', title:'실적증명서 신청 목록' }, scrollReset:true }`.
- `DcmntIssuAplyPage.tsx`: `prfmncPrdocList` 카드 → `navigate(ROUTES.SUPPORT_PRFMNC_PRDOC)`.
- 아이콘: 신규 없음.
