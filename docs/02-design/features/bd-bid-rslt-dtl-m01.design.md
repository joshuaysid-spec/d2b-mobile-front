---
template: design
version: 1.0
feature: bd-bid-rslt-dtl-m01
date: 2026-06-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-bid-rslt-dtl-m01 Design Document

> 입찰결과상세(개찰상세, MUI-BD-09-M01~M04). Plan: `docs/01-plan/features/bd-bid-rslt-dtl-m01.plan.md`.
> 레퍼런스 `BidPbancDtlPage`(요약+스텝+탭+탭콘텐츠). 신규 컴포넌트 0.

---

## 1. 화면 정의 (설계서 slide135 화면목록)

| 화면 ID | 한글 | 영문(파일) | 역할 |
|---------|------|-----------|------|
| MUI-BD-09-M01 | 입찰결과상세-일반정보 | `BidRsltDtlPage` | shell(요약+스텝+탭) + 일반정보 탭 |
| MUI-BD-09-M02 | 입찰결과상세-품목정보 | `BidRsltDtlListPage` | 품목정보 탭 콘텐츠 |
| MUI-BD-09-M03 | 입찰결과상세-입찰결과 | `BidRsltDtl` | 입찰결과 탭 콘텐츠 |
| MUI-BD-09-M04 | 입찰결과상세-협상결과 | `BidRsltDtl2` | 협상결과 탭 콘텐츠 |

폴더: `src/ui/biz/bd/bidRsltDtl/`. 라우트: `bd/result/:id`. breadcrumb(설계서): 홈 > 개찰목록 > 입찰결과상세.

---

## 2. 레이아웃 (BidRsltDtlPage shell)

```
BidRsltDtlPage (useCollapsibleHeader)
├── sticky: SummaryInfo(badges 물품·경쟁입찰 / subtitle 긴급공고 LDG0097-1 / title 공고명 / actions 출력 / rows 공고일자·개찰일시)
│         + StepBar(입찰 단계) + TabList(일반정보/품목정보/입찰결과/협상결과)
├── renderTabContent(tab):
│     general → 일반정보(인라인): 일반정보 표 + 담당자정보 표 + 첨부서류
│     item    → <BidRsltDtlListPage/>  (품목정보)
│     bid     → <BidRsltDtl/>          (입찰결과)
│     nego    → <BidRsltDtl2/>         (협상결과)
├── FloatingActionButton(맨위로)
└── AlertModal(서류 출력 확인)
```

탭 콘텐츠 패턴 = `PageTitle` + `Accordion/AccordionSection` + `Table(rows)`. 신규 컴포넌트 없음.

---

## 3. 탭별 콘텐츠 (설계서 slide151~156)

### 3.1 일반정보 (M01, slide152~153)
- **일반정보** 표(28): 입찰건명·공고번호·판단번호·발주기관·통합참조번호·집행유형·단가제유형·계약방법·입찰방법·낙찰자결정방법·예산금액·기초예가적용여부·개찰일시·적격심사·입찰서제출마감일시·등록심사시점·기초예비가격·사정률(%)·낙찰하한율·공사개요(위치/공사기간/예정가격)·가격평가비중·입찰결과·협상형태·협상장소·협상결과·재입찰대상구분·재입찰차수·유찰사유
- **담당자 정보** 표: 업무/담당자/연락처 (구매담당·협상담당·입회관)
- **첨부서류** (총 N건): FileDownloadList

### 3.2 품목정보 (M02, slide154)
- 항목당 표: 항목번호·재고번호·품명·규격·단위·수량·단가·금액 + 더보기(10개씩)

### 3.3 입찰결과 (M03, slide155) — 자사 정보만
- 항목당 표: 순번·차수·업체코드·사업자등록번호·업체명·대표자·결과 + 첨부서류[보기]·서약서[보기] + 더보기

### 3.4 협상결과 (M04, slide156) — 자사 정보만
- 항목당 표: 차수·업체코드·업체명·대표자·견적단가·낙찰률·결과 + 더보기

---

## 4. 라우트 / 연결
- `routes.ts`: `BD_RESULT_DETAIL: '/bd/result/:id'`
- `router.tsx`: `bd/result/:id` → `BidRsltDtlPage` (lazy + handle: header sub/util home, title '입찰결과 상세')
- `BdopnListPage` 카드 클릭 → `navigate('/bd/result/' + id)` (기존 스텁 교체)

---

## 5. API 경계 스텁
| 동작 | 스텁 | 추후 |
|------|------|------|
| 상세 조회 | 목업 상수 | `bdService.getBidRsltDetail(id)` |
| 더보기 | 목업 슬라이싱 | 서버 페이징 |
| 출력 | AlertModal → console.log | OZ 리포트 연계 |
| 첨부/서약서 보기 | console.log | 파일 뷰어/다운로드 |

---

## 6. Definition of Done
- [ ] 4 파일 + 라우트 + 개찰목록 연결 · 설계서 라벨/탭 1:1 · 신규 컴포넌트 0 · lint 0 · build OK · 설계서 재대조(요청 6) 반영
