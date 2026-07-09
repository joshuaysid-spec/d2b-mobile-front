---
template: design
version: 1.0
feature: bd-ovs-rls-vltrns-ngtn-srng-rslt-inq-m83
date: 2026-07-09
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-ovs-rls-vltrns-ngtn-srng-rslt-inq-m83 Design Document

> 국외 **공개수의협상 결과조회**(읽기전용) — MUI-BD-12-M83. 02.입찰 slide441~445.
> 진입: 견적서 상세(M78) 우측 하단 + 바로가기 > **공개수의협상 결과조회** → `/bd/ovs/rls-ngtn/:id/rslt`.
> 레퍼런스: 국외 입찰결과조회 상세(`OvsBidRsltDtlPage`). **설계서 우선**.

---

## 1. 화면 정의 (설계서 slide398 화면목록)

| 화면 ID | 한글 | 영문(파일) — 웹경로 |
|---------|------|-----------|
| M83 | 공개수의협상결과조회 | `OvsRlsVltrnsNgtnSrngRsltInqPage` → `ovsRlsVltrnsNgtnSrngRsltInq/OvsRlsVltrnsNgtnSrngRsltInqPage.tsx` |
| (조회 결과 탭) | 조회 결과 | `OvsRlsVltrnsNgtnSrngRsltInq2.tsx` |

M-코드(화면=라우트 페이지). 라우트 `bd/ovs/rls-ngtn/:id/rslt`, 헤더 타이틀 '공개수의협상 결과조회'.

---

## 2. 레이아웃 (OvsBidRsltDtlPage 미러)

```
useCollapsibleHeader + sticky 블록
  SummaryInfo(badges 국외·수의계약·단가제 / subtitle 통합참조번호·공고번호 / title 사업명 / rows 입찰업체·구매요청번호·공고일자·개찰일자)
  + TabList(일반정보 / 조회 결과)
+ 탭 콘텐츠
FAB = 맨위로만(onTop, 사용자 요청) — + 없음. 하단 액션바 없음.
```

---

## 3. 탭별 콘텐츠 (설계서 slide441~445)

### 3.1 일반정보 (slide442) — 공고일반 + 담당자
- 공고번호·공고구분·공고일자·구매요청번호·통합참조번호·사업명·계약방법·총금액·공고품목수·환율적용일자·개찰일시·견적서제출마감일시 + 담당자(부서명·담당자·연락처)
- 타입 `OvsRlsVltrnsGeneral` 재사용(dm_pbancGnrlInfo, 견적서 조회 M78 일반정보와 동일). Accordion(일반정보/담당자).

### 3.2 조회 결과 (slide443·445) — 업체별 결과 카드(총액제)
- 헤더: '조회 결과' 라벨 + 총건수(ListSectionHeader) + 더보기(10/258)
- 카드(기본 4행 순번/신청업체코드/신청업체명/입찰업체코드 + 내역 펼쳐보기): 순번·신청업체코드·신청업체명·입찰업체코드·입찰업체명·제출서류·견적금액·화폐단위·순위·낙찰여부·탈락사유·계약포기일자·계약포기사유
- 타입 `OvsRlsVltrnsSrngRsltItem`(dl_bidRsltList 영문: no·sbtBzentyCd·sbtBzentyNm·splyBzentyCd·splyBzentyNm·docSbmsnYn·estmtAmt·crncNm·rnk·scsbdYn·rsn·abndDt·abndRsn).
- **제출서류**: O/X 표시(좌) + **'보기' 버튼(우)** — O일 때만 보기 노출(설계서 slide443). 보기 → 첨부파일 바텀시트(다운로드 전용, 이 탭이 컨테이너 소유). 설계서에 제출서류 팝업 상세 없음 → 견적서 제출서류 4종 목업.

---

## 4. 연결
- `router.tsx`: `bd/ovs/rls-ngtn/:id/rslt` → `OvsRlsVltrnsNgtnSrngRsltInqPage`(lazy + handle header sub, title '공개수의협상 결과조회').
- 견적서 상세(M78) FAB 바로가기 **공개수의협상 결과조회** → navigate(이 라우트, state=요약).
- 데이터: navigate state(견적서 상세 요약)로 공통 식별필드 override + 결과조회 목업. service 스텁 없음.

## 5. 요청 대응
- 검색필터/바텀시트 = **없음**(결과조회는 목록/검색 화면 아님 — 필수요청 1 해당 없음)
- FAB = **맨위로만**(사용자 요청 1)
- 제출서류 보기 → 첨부파일 바텀시트(사용자 요청 2)
- Figma 9973-128764 는 입찰공고상세(M07) 오연결 → 레이아웃 참고, 내용은 M83 설계서 우선.

## 6. Definition of Done
- [x] 2 파일(Page/Inq2) + 타입(bd.ts SrngRsltSummary/SrngRsltItem, General 재사용) + 라우트 + 견적서 상세 '결과조회' 연결
- [x] 탭(일반정보/조회 결과) · 제출서류 보기 바텀시트 · FAB 맨위로만 · 검색필터 없음
- [x] 신규 공통 0 · lint 0 · build OK
