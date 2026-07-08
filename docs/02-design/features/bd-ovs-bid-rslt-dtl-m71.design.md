---
template: design
version: 1.0
feature: bd-ovs-bid-rslt-dtl-m71
date: 2026-07-08
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-ovs-bid-rslt-dtl-m71 Design Document

> 국외 개찰 입찰결과조회 상세(단가제) — MUI-BD-09-M71(일반정보) · M72(입찰결과 단가제). 02.입찰 slide397·402~404.
> 진입: 개찰목록 최상단 **국외(단가제) 카드** 클릭. 레퍼런스: BidRsltDtlPage / OvsTndrDtlPage.
> **설계서 우선 — 설계서에 없는 요소(StepBar·즐겨찾기·출력)는 제외**(사용자 확정).

---

## 1. 화면 정의 (설계서 slide397 화면목록 · 9. 국외 개찰)

| 화면 ID | 한글 | 영문(파일) | 역할 |
|---------|------|-----------|------|
| MUI-BD-09-M71 | 입찰결과조회 - 일반정보 | `OvsBidRsltDtlPage` | shell(요약+탭) + 일반정보 탭 |
| MUI-BD-09-M72 | 입찰결과조회 - 입찰결과(단가제) | `OvsBidRsltDtl2` | 입찰결과(단가제) 탭 콘텐츠 |
| (범위 밖) M73 | 입찰결과(총액제) | `OvsBidRsltDtl3` | 이번 미구현 |

폴더: `src/ui/biz/bd/ovsBidRsltDtl/`. 라우트: `bd/ovs/result/:id`. breadcrumb(설계서): 홈 > 개찰 > 입찰 결과 조회.

---

## 2. 레이아웃 (OvsBidRsltDtlPage shell — StepBar 없음)

```
OvsBidRsltDtlPage (useCollapsibleHeader)
├── sticky: SummaryInfo(badges 국외·단가제·경쟁입찰 / subtitle 통합참조번호·공고번호 / title 사업명)  ← 부가버튼 없음
│         + TabList(일반정보 / 입찰결과)
├── renderTabContent:
│     general → 일반정보(인라인, M71): 일반정보 표 + 담당자 정보 표
│     result  → <OvsBidRsltDtl2/> (입찰결과 단가제, M72)
└── FloatingActionButton(맨위로만 — 바로가기 없음)
```

탭 콘텐츠 패턴 = `PageTitle`(탭명) 없이 `Accordion/AccordionSection` + `Table`. 신규 공통 컴포넌트 0.
(탭 콘텐츠 상단 타이틀은 최근 규칙대로 미표시.)

---

## 3. 콘텐츠 / 데이터영역 (설계서 slide402~404)

### 3.1 일반정보 (M71, slide403 일반 데이터 영역)
- **일반정보** 표: 공고번호 `pbancNo`·공고구분 `pbancSeNm`·공고일자 `pbancDt`·구매요청번호 `prchsDmndNo`·통합참조번호 `intgRfrncNo`·사업명 `bizNm`·입찰유형 `bidTypeNm`(단가제)·입찰매체 `bidMdmNm`·계약방법 `ctrtMthdNm`·입찰방식 `bidMth`·총금액 `totAmt`(USD)·환율적용일자 `exchrtAplcnYmd`·공고 품목수 `pbancItemCnt`·개찰일시 `bdopnDt`·입찰참가등록마감일시 `regDdlnDt`·입찰서제출마감일시 `bdngDdlnDt`
- **담당자 정보** 표: 담당 부서명 `picDeptNm`·담당자 `picNm`·연락처 `picTlno`(+`picMblTelno`)
- ⚠️ 영문 항목명 = 국외 입찰서 상세(`OvsTndrDtlItem`) 관례 차용(M71 데이터영역에 영문 미표기).

### 3.2 입찰결과 (M72 단가제, slide404)
- **입찰결과현황(단가제)**: 총 참여품목수 `totItemCnt` + 결과품목 소계(낙찰/조건부/동가낙찰) `scsbdCnt`/`cndlCnt`/`eqvCnt`/`subCnt` + 원금액/달러금액 소계(`krwAmt*`/`usdAmt*`)
- **입찰결과 목록(단가제)**: 항목번호 `clsfNo`·품명 `prdctNm`·재고번호 `stckNo`·부품번호 `partNo`·단위 `unit`·수량 `qty`·지시단가 `drctnUprc`·입찰단가 `bidUprc`·달러단가 `usdUprc`·달러금액 `usdAmt`·입찰결과 `bidRsltNm` + 항목당 아코디언(펼쳐보기/접기) + 더보기(10개씩)

---

## 4. 연결
- `router.tsx`: `bd/ovs/result/:id` → `OvsBidRsltDtlPage` (lazy + handle header sub, title '입찰결과 조회')
- 개찰목록 최상단 **국외 카드(OVS_BDOPN_CARD)** onClick → `navigate('/bd/ovs/result/ovs-m71')` (기존 console 스텁 교체)
- 데이터: 페이지 fallback 목업(설계서 slide403/404 값·형식 그대로) — 백엔드 미연동이라 service 스텁 없음.

---

## 5. 요청사항 대응
- **검색필터/바텀시트(요청1·2)**: 상세화면이라 없음 → 해당 없음.
- **영문 화면명(요청3)**: 설계서 slide397 그대로(OvsBidRsltDtlPage / OvsBidRsltDtl2).
- **구조(요청4)**: op/bd 상세 패턴(useCollapsibleHeader + SummaryInfo + TabList) 준수.
- **설계서 우선(추가요청)**: StepBar·즐겨찾기·출력·바로가기 제외.

## 6. Definition of Done
- [x] `OvsBidRsltDtlPage`(+일반정보 M71) + `OvsBidRsltDtl2`(단가제 M72) + 타입(bd.ts) + 라우트(`bd/ovs/result/:id`) + 국외카드 연결
- [x] StepBar/즐겨찾기/출력/바로가기 없음 · 탭 콘텐츠 타이틀 없음 · 신규 공통 0
- [x] lint 0 errors · build OK(tsc, chunk 6.05kB)
