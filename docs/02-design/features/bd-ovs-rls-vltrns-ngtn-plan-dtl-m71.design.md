---
template: design
version: 1.0
feature: bd-ovs-rls-vltrns-ngtn-plan-dtl-m71
date: 2026-07-08
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-ovs-rls-vltrns-ngtn-plan-dtl-m71 Design Document

> 국외 개찰 공개수의협상계획상세 — MUI-BD-12-M71(T71 일반정보) · T72(품목정보) · T73(첨부서류). 02.입찰 slide397·411~414.
> 진입: 개찰목록 **국외·수의계약 카드** 클릭(수의계약 배지 조건일 때만). 레퍼런스: OvsBidRsltDtlPage / OvsTndrDtlPage.
> **설계서 우선 — StepBar·즐겨찾기·출력 제외**(사용자 확정).

---

## 1. 화면 정의 (설계서 slide397 화면목록 · 12. 국외)

| 화면 ID | 한글 | 영문(파일) |
|---------|------|-----------|
| MUI-BD-12-M71 / T71 | 공개수의협상계획상세 - 일반정보 | `OvsRlsVltrnsNgtnPlanDtl` → `OvsRlsVltrnsNgtnPlanDtlPage.tsx` |
| MUI-BD-12-M72 / T72 | 공개수의협상계획상세 - 품목정보 | `OvsRlsVltrnsNgtnPlanDtl2.tsx` |
| MUI-BD-12-M73 / T73 | 공개수의협상계획상세 - 첨부서류 | `OvsRlsVltrnsNgtnPlanDtl3.tsx` |

폴더: `src/ui/biz/bd/ovsRlsVltrnsNgtnPlanDtl/`. 라우트: `bd/ovs/rls-ngtn/:id`. breadcrumb: 홈 > 개찰 > 공개수의협상계획상세.

---

## 2. 레이아웃 (OvsRlsVltrnsNgtnPlanDtlPage shell — StepBar 없음)

```
OvsRlsVltrnsNgtnPlanDtlPage (useCollapsibleHeader)
├── sticky: SummaryInfo(badges 국외·수의계약 / subtitle 통합참조번호·공고번호 / title 사업명
│            / rows 구매요청번호·총 금액·견적서제출마감일시·개찰일자)  ← 부가버튼 없음
│         + TabList(일반정보 / 품목정보 / 첨부서류)
├── renderTabContent:
│     general → 일반정보(인라인, T71): 일반정보 표 + 담당자 정보 표
│     item    → <OvsRlsVltrnsNgtnPlanDtl2/> (품목정보 T72)
│     file    → <OvsRlsVltrnsNgtnPlanDtl3/> (첨부서류 T73)
├── FloatingActionButton(맨위로 + 바로가기 +) → 바로가기 바텀시트: 견적서 작성 / 견적서 조회
```

---

## 3. 콘텐츠 / 데이터영역 (설계서 slide411~414)

### 3.1 일반정보 (M71/T71, slide412 공고일반)
- 공고번호 `pbancNo`·공고구분 `pbancSeNm`·공고일자 `pbancDt`·구매요청번호 `prchsDmndNo`·통합참조번호 `intgRfrncNo`·사업명 `bizNm`·계약방법 `ctrtMthdNm`·총금액 `totAmt`(USD)·공고품목수 `pbancItemCnt`·환율적용일자 `exchrtAplcnYmd`·개찰일시 `bdopnDt`·견적서제출마감일시 `etdcDdlnDt`
- 담당자 정보: 담당 부서명 `picDeptNm`·담당자 `picNm`·연락처 `picTlno`(+`picMblTelno`)

### 3.2 품목정보 (M72/T72, slide413) — 품목명세서 탭 패턴(ListSectionHeader + 카드 4행 + 펼쳐보기/접기 + 더보기)
- 항목번호 `clsfNo`·품질등급 `qltyGrd`·첨부문서 `atchDocYn`·재고번호 `stckNo`·부품번호 `partNo`·규격번호 `specNo`·품명 `prdctNm`·납기기준일자 `dlvyBaseYmd`·단위 `unit`·본조수량 `mainQty`·당국수량 `currQty`·장국수량 `futrQty`·본조예산 `mainBdgt`·당국예산 `currBdgt`·장국예산 `futrBdgt`·수량합계 `qtySum`·화폐단위 `crncyUnit`·지시단가 `drctnUprc`·지시금액 `drctnAmt`·장비부호 `equipCd`·장비명 `equipNm`

### 3.3 첨부서류 (M73/T73, slide414) — 첨부파일 목록(구분별)
- 구분 `docSeNm`(공고문안/일반조건/특수조건/기타첨부)·첨부파일명 `fileNm`·파일크기 `fileSz` + 다운로드

> ⚠️ 영문 항목명 = 국외 상세(OvsTndrDtl/OvsBidRslt) 관례 차용(설계서 데이터영역에 영문 미표기).

---

## 4. 연결
- `router.tsx`: `bd/ovs/rls-ngtn/:id` → `OvsRlsVltrnsNgtnPlanDtlPage` (lazy + handle header sub, title '공개수의협상 계획상세')
- 개찰목록 **국외·수의계약 카드**(OVS_NGTN_SUMMARY) onClick → navigate(state=요약). 수의계약 배지 조건일 때만 진입.
- FAB 바로가기: 견적서 작성 / 견적서 조회 (console 스텁 — 추후 공개수의협상견적서제출 M74 등 연결)

## 5. 요청 대응
- 검색필터/바텀시트(1·2): 상세라 없음 → 해당 없음.
- 영문명·경로(3): slide397 그대로.
- 구조(4): op/bd 상세 패턴 준수.
- 설계서 우선(추가): StepBar·즐겨찾기·출력 제외 · 탭 콘텐츠 타이틀 없음.
- 플로팅 버튼(추가): 다른 상세와 동일(맨위로 + 바로가기) — 바로가기 = 견적서 작성/조회.

## 6. Definition of Done
- [x] 3 파일(Page/2/3) + 타입(bd.ts) + 라우트(`bd/ovs/rls-ngtn/:id`) + 국외·수의계약 카드 연결 + FAB(견적서 작성/조회)
- [x] StepBar/즐겨찾기/출력 없음 · 탭 콘텐츠 타이틀 없음 · 신규 공통 0 · lint 0 · build OK(chunk 7.74kB)
- [x] 수의계약 배지 카드에서만 진입(사용자 확정)
