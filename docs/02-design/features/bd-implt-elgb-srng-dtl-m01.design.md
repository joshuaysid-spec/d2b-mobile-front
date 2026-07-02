---
template: design
version: 1.0
feature: bd-implt-elgb-srng-dtl-m01
date: 2026-07-02
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-implt-elgb-srng-dtl-m01 Design Document

> 이행/적격심사상세(MUI-BD-10-M01~M04, 02.입찰 slide162~170).
> 레퍼런스 `BidRsltDtlPage`(요약+스텝+탭+탭콘텐츠). 신규 공통 컴포넌트 0.
> 진입: 입찰결과상세 > 일반정보 > **이행적격심사 신청하기** 버튼.

---

## 1. 화면 정의 (설계서 slide134 화면목록)

| 화면 ID | 한글 | 영문(파일) | 역할 |
|---------|------|-----------|------|
| MUI-BD-10-M01 | 이행/적격심사상세–1 일반정보 | `Implt1` | 일반정보 탭 콘텐츠 |
| MUI-BD-10-M02 | 이행/적격심사상세–2 입찰/반려 정보 | `Implt2` | 입찰/반려 정보 탭 콘텐츠 |
| MUI-BD-10-M03 | 이행/적격심사상세–3 파일첨부 | `Implt3` | 파일첨부 탭 콘텐츠 |
| MUI-BD-10-M04 | 이행/적격심사결과상세(물품) | `Implt` | 심사결과 탭 콘텐츠 (물품=Cmdty) |
| — | shell(요약+스텝+탭) 컨테이너 | `ImpltPage` | 페이지 컨테이너(설계서 미명명 — Page 접미사 규약) |

폴더: `src/ui/biz/bd/bidRsltDtl/`(설계서 경로). 라우트: `bd/implt/:id`.
breadcrumb(설계서): 홈 > 개찰목록 > 입찰결과상세 > 이행/적격심사상세.

> **심사결과(M04) 범위:** 물품(Cmdty, slide169)만 구현. 용역/공사 등 세부구분(M04~M19)은 데이터만 교체하면 되도록 경계 주석.
> **검색필터/바텀시트:** 상세화면이라 없음(레퍼런스 동일). **공지사항(slide162 layout note):** 레퍼런스 BidRsltDtlPage 와 동일하게 미구현(선택적 "있는 경우 표시").

---

## 2. 레이아웃 (ImpltPage shell — BidRsltDtlPage 미러)

```
ImpltPage (useCollapsibleHeader, navigate state = BdopnItem)
├── sticky: SummaryInfo(badges 공고상태·업무구분·입찰방식 / subtitle 입찰공고번호 / title 공고명 / rows 공고일자·개찰일시)
│         + StepBar(입찰 단계) + TabList(일반정보/입찰·반려정보/파일첨부/심사결과)
├── renderTabContent(tab):
│     general → <Implt1/>  (일반정보 + 참고서류 + 법위반처벌이력 확인서 양식)
│     bidRjct → <Implt2/>  (입찰결과 + 반려사유)
│     file    → <Implt3/>  (파일첨부 + 추가첨부서류 업로드)
│     result  → <Implt/>   (심사결과 — 물품)
├── 탭별 footer 버튼(ButtonGroup, 화면 하단): 다음으로/이전/취소/제출하기/목록
└── FloatingActionButton(맨위로)
```

탭 콘텐츠 패턴 = `PageTitle` + `Accordion/AccordionSection` + `Table(rows)` / `FileDownloadList`. 신규 공통 컴포넌트 없음.

---

## 3. 탭별 콘텐츠 (설계서 slide163~170 데이터영역)

### 3.1 일반정보 (M01, slide163 / 데이터영역 slide166~167)
- **공고정보** 표(dmt_pbancInfo): 입찰건명 `bidNm`·대표품명·지시년도 `drctnYr`·공고번호 `pbancNo`·통합참조번호 `rfrncNo`·발주기관 `orderInstNm`·판단번호 `prcmNo`·항목번호 `clsfNo`·계약방법 `ctrtMthdCd`·입찰방법 `bidMthdCd`·개찰일시 `bdopnDt`·신청마감일시 `srngPrgrsDdlnDt`·적용양식 `cmdtyLbsvcElgbSrngCd`·비고
- **참고서류**(dlt_refDcmnt, 총 N건): 서류명 `docNm`·첨부문서명 `fileNm`·파일크기 `fileSz` — FileDownloadList(다운로드)
- **법 위반 처벌이력 확인서 양식** 다운로드 링크
- footer: 다음으로 / 취소

### 3.2 입찰/반려 정보 (M02, slide164 / slide166)
- **입찰결과**(dmt_bidRslt): 낙찰순위 `scsbdRnk`·투찰금액 `bdngAmt`·투찰률 `scbrt`((입찰가격-A)/(예정가격-A)*100)·상태 `srngPrgrsStcd`
- **반려사유**(dmt_bidRslt): 반려사유 `rjctRsn`
- footer: 다음으로 / 이전

### 3.3 파일첨부 (M03, slide165 / slide167)
- **첨부서류**(dlt_adoc, 총 N건): 첨부파일명 `fileNm`·파일크기 `fileSz` — FileDownloadList(업로드: 파일 추가/삭제)
- **추가첨부서류**(dlt_addAdoc, 총 N건): 첨부파일명 `fileNm`·파일크기 `fileSz` — FileDownloadList(업로드)
- footer: 제출하기 / 이전

### 3.4 심사결과 (M04, slide169 / slide170) — 물품(Cmdty), 자사 정보만
- **심사결과**(dmt_srngRslt): 이행실적 `srngScr1`·제조능력 `srngScr2`·재무상태 `srngScr4`·입찰가격 `srngScr7`·신인도 `srngScr5`·결격사유 `srngScr8`·기타1·기타2·점수총계 `tscr`·판정결과 `jgmtRsltCd`
  - (물품 라벨: 제조능력=`srngScr2`, 재무상태=`srngScr4`. 용역/공사 등은 라벨만 상이 — 데이터 교체 지점)
- footer: 목록(→ 개찰목록)

---

## 4. 라우트 / 연결
- `router.tsx`: `bd/implt/:id` → `ImpltPage` (lazy + errorElement + handle: header sub/util home, title '이행/적격심사 상세')
- `BidRsltDtlPage` 일반정보 탭 "이행적격심사 신청하기" 버튼 → `navigate('/bd/implt/' + id, { state: item })` (기존 console.log 스텁 교체)

---

## 5. API 경계 스텁
| 동작 | 스텁 | 추후 |
|------|------|------|
| 상세 조회 | navigate state + 페이지 fallback 목업 | `scwin.getImpltElgbSrngDtlInfo` |
| 결과 조회 | 목업 상수 | `scwin.getImpltElgbSrngRsltDtlInfo` |
| 파일 추가/삭제 | console.log | 파일 선택 모듈 |
| 참고서류/양식 다운로드 | console.log | 파일 다운로드 |
| 임시저장/제출 | console.log | `btn_strg`/`btn_elgbSrngAply` |

---

## 6. Definition of Done
- [x] 5 파일(ImpltPage + Implt1/2/3/Implt) + 타입(bd.ts) + 라우트(`bd/implt/:id`) + 신청하기 버튼 연결
- [x] 설계서 항목명(영문 ID) 1:1 · 탭 4개 · 신규 공통 컴포넌트 0
- [x] lint 0 errors · build OK(tsc -b) · ImpltPage chunk 8.97kB(<600KB) · 설계서 재대조(요청 4) 반영
