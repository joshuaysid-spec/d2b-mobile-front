---
template: design
version: 1.0
feature: bd-ovs-rls-vltrns-ngtn-etdc-dtl-m78
date: 2026-07-08
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-ovs-rls-vltrns-ngtn-etdc-dtl-m78 Design Document

> 국외 공개수의협상 **견적서 조회**(읽기전용 상세) 4탭 — MUI-BD-12-M78~M81 (T78~T81). 02.입찰 slide398·429~433.
> 진입: 개찰 > 공개수의협상 계획상세(M71) > 우측 하단 + 바로가기 > **견적서 조회**.
> 레퍼런스: 견적서 작성(OvsRlsVltrnsNgtnEtdcSbmsnPage). **본 화면은 견적서 작성의 상세(읽기) 페이지**.
> **설계서 우선** · 페이지(헤더) 타이틀 = **견적서 조회**(입찰서 제출 아님) · 설계서에 없는 요소는 제거.

---

## 1. 화면 정의 (설계서 slide398 화면목록 — 영문 화면명·웹경로 그대로)

| 화면 ID | 한글 | 영문(파일) — 설계서 웹경로 |
|---------|------|-----------|
| M78 / T78 | 공개수의협상견적서상세 - 일반정보 | `OvsRlsVltrnsNgtnEtdcDtlPage` → `ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtlPage.tsx` |
| M79 / T79 | 상세 - 업체정보 | `OvsRlsVltrnsNgtnEtdcDtl2` → `.../OvsRlsVltrnsNgtnEtdcDtl2.tsx` |
| M80 / T80 | 상세 - 입찰품목 | `OvsRlsVltrnsNgtnEtdcDtl3` → `.../OvsRlsVltrnsNgtnEtdcDtl3.tsx` |
| M81 / T81 | 상세 - 첨부파일 | `OvsRlsVltrnsNgtnEtdcDtl4` → `.../OvsRlsVltrnsNgtnEtdcDtl4.tsx` |

폴더: `src/ui/biz/bd/ovsRlsVltrnsNgtnEtdcDtl/`(설계서 경로). 라우트: `bd/ovs/rls-ngtn/:id/etdc-dtl`.

> ⚠️ P82(견적서취소신청서작성)·M83(결과조회)은 같은 폴더 계열이나 **이번 작업 범위 아님**.

---

## 2. 레이아웃 (OvsRlsVltrnsNgtnEtdcDtlPage — 견적서 작성 셸 미러, 읽기전용)

```
SummaryInfo(badges 국외·수의계약 / subtitle 통합참조번호·공고번호 / title 사업명)
+ StepBar(신청서→서명→제출, 전부 done)   ← 설계서 slide429 "신청서 전체 진행단계 표시"
+ TabList(1.일반정보 / 2.업체정보 / 3.입찰품목 / 4.첨부파일)  ← 탭 이동(탭 클릭)
+ 탭 콘텐츠(읽기전용)
하단 액션바 없음(설계서에 이전/다음/제출 없음 — 조회) · FAB 없음(견적서 작성과 동일)
```

- 견적서 **작성** 대비 차이(= 읽기전용):
  - 입찰품목: 입력(SelectBox/InputBox) 없음 → **견적단가·견적금액·품목대체구분·화폐단위 값 표시만**.
  - 첨부파일: 추가/삭제 없음 → **다운로드만**(FileDownloadList onDownload).
  - 업체정보: 입찰업체 업체코드 SelectBox 없음 → **값 표시**. (신청업체는 작성과 동일)
  - 하단 [이전/다음으로/제출하기] 액션바 제거.

---

## 3. 탭별 콘텐츠 (설계서 slide429~433)

### 3.1 일반정보 (M78, slide429~430) — 담당자 정보 + 일반정보 표
- 담당자 정보: 담당 부서명·담당자·연락처(전화/휴대 2줄)
- 일반정보: 공고번호·공고구분·공고일자·구매요청번호·통합참조번호·사업명·계약방법·총금액·공고품목수·환율적용일자·개찰일시·견적서제출마감일시
- 타입 `OvsRlsVltrnsGeneral` 재사용. 견적서 작성 스탭1과 동일.

### 3.2 업체정보 (M79, slide431) — 조회
- 신청업체: 업체코드·업체명·대표자·전화번호·팩스·사업자등록번호·주소
- 입찰업체: 업체코드·업체명·대표자·이메일·전화번호·팩스·주소·사업자번호·DUNS NUM
- 타입 `OvsRlsVltrnsEtdcBzenty` 재사용. **주민등록번호 없음(2026-07-01 설계 수정 반영).** 입찰업체 업체코드=값 표시(SelectBox 아님).

### 3.3 입찰품목 (M80, slide432) — 입찰참여품목(단가제) 조회
- 조회: 항목번호·재고번호·부품번호·품명·단위·수량·지시단가·품목대체구분·품목대체첨부문서·수정재고번호·수정부품번호·견적단가·견적금액·화폐단위
- 카드(기본 4행: 항목번호/재고번호/부품번호/품명 + 내역 펼쳐보기) + 더보기(10/100)
- 신규 타입 `OvsRlsVltrnsEtdcDtlItem`(작성 `OvsRlsVltrnsEtdcItem` + 조회 표시필드 itemSbstDocNm·etdcAmt).

### 3.4 첨부파일 (M81, slide433) — 다운로드
- 구분 4종: 견적제안서·공급자증명서·제작사증명서·기타 공고요구서류 (**다운로드만**)
- 유의사항 2건(static Infobox, M77과 동일): 견적서 수정불가 + 공사 입찰유의서 확약.

> 항목명(변수·필드·키) = **설계서 데이터영역 영문 그대로**(slide434~436): 신청업체 `sbt*`(dm_aplyBzenty)·입찰업체 `sply*`(dm_bidBzenty)·품목 `frcptlArtclNo/invtNo/prtsNo/itemNm/unitNm/drctnUntprc/itemSbstSe/itemSbstDocEn/mdfcnInvtNo/mdfcnPrtsNo/estmtUntprc/estmtAmt/crncNm`(dl_bidItemList)·첨부 `atchDocNm/atchFileNm/fileSz`(dl_docList). 공용 타입 `OvsRlsVltrnsEtdcBzenty` 리네임으로 작성 화면(Sbmsn2)도 동일 적용.

---

## 4. 연결
- `router.tsx`: `bd/ovs/rls-ngtn/:id/etdc-dtl` → `OvsRlsVltrnsNgtnEtdcDtlPage`(lazy + handle header sub, title '견적서 조회'). 정적 'etdc-dtl' 세그먼트가 `:id`보다 먼저 매칭.
- 계획상세(M71) FAB 바로가기 **견적서 조회** → navigate(이 라우트, state=summary).
- 데이터: navigate state(요약) ?? 페이지 fallback 목업. service 스텁 없음(폐쇄망 표준).

## 5. 요청 대응
- 페이지 타이틀 = **견적서 조회**(입찰서 제출 아님)
- 검색필터/바텀시트 = **없음**(설계서에 목록/검색 화면 없음 — 사용자 확정: 바로 상세 진입)
- StepBar = **포함**(신청서→서명→제출, 사용자 확정)
- 하단 액션바 = **없음**(설계서 우선) · FAB = **없음**(견적서 작성과 동일)
- 설계서에 없는 요소 제거, 항목명은 설계서 데이터영역 기준.

## 6. Definition of Done
- [x] 4 파일(Page/2/3/4) + 타입(bd.ts OvsRlsVltrnsEtdcDtlItem) + 라우트(`bd/ovs/rls-ngtn/:id/etdc-dtl`) + 계획상세 '견적서 조회' 연결
- [x] 헤더 타이틀 '견적서 조회' · 읽기전용(입력/추가/삭제 없음) · StepBar 포함 · 하단 액션바 없음 · FAB 없음 · 4탭
- [x] 신규 공통 0 · lint 0 · build OK(chunk 8.51kB)
