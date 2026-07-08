---
template: design
version: 1.0
feature: bd-ovs-rls-vltrns-ngtn-etdc-sbmsn-m74
date: 2026-07-08
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-ovs-rls-vltrns-ngtn-etdc-sbmsn-m74 Design Document

> 국외 공개수의협상 견적서 작성(제출) 4스텝 마법사 — MUI-BD-12-M74~M77 (T74~T77). 02.입찰 slide398·419~423.
> 진입: 공개수의협상계획상세 > 우측 하단 + 바로가기 > **견적서 작성**. 레퍼런스: OvsTndrSbmsnPage(국외 입찰서제출 마법사).
> **설계서 우선** · 페이지(헤더) 타이틀 = **견적서 작성** · FAB 없음(스텝 footer만).

---

## 1. 화면 정의 (설계서 slide397~398 화면목록)

| 화면 ID | 한글 | 영문(파일) |
|---------|------|-----------|
| M74 / T74 | 견적서제출 - 스탭1 일반정보 | `OvsRlsVltrnsNgtnEtdcSbmsnPage` → `OvsRlsVltrnsNgtnEtdcSbmsnPage.tsx` |
| M75 / T75 | 스탭2 업체정보 | `OvsRlsVltrnsNgtnEtdcSbmsn2.tsx` |
| M76 / T76 | 스탭3 입찰품목 | `OvsRlsVltrnsNgtnEtdcSbmsn3.tsx` |
| M77 / T77 | 스탭4 첨부파일 | `OvsRlsVltrnsNgtnEtdcSbmsn4.tsx` |

폴더: `src/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/`(설계서 경로). 라우트: `bd/ovs/rls-ngtn/:id/etdc`.

---

## 2. 레이아웃 (OvsRlsVltrnsNgtnEtdcSbmsnPage — OvsTndrSbmsnPage 미러)

```
SummaryInfo(badges 국외·수의계약 / subtitle 통합참조번호·공고번호 / title 사업명)
+ StepBar(신청서→서명→제출, doing=신청서)   ← 설계서 slide419 진행단계
+ TabList(1.일반정보 / 2.업체정보 / 3.입찰품목 / 4.첨부파일)  ← 스텝 이동
+ 스텝 콘텐츠
+ 하단 액션바 ButtonGroup layout="asymmetric" (이전 100px + 다음으로/제출하기 flex-1)
  - 1~3스텝: 이전 / 다음으로 · 4스텝: 이전 / 제출하기
FAB 없음(사용자 확정).
```

---

## 3. 스텝별 콘텐츠 (설계서 slide419~423)

### 3.1 일반정보 (M74/T74, slide420) — 계획상세 일반정보와 동일(OvsRlsVltrnsGeneral 재사용)
- 공고번호·공고구분·공고일자·구매요청번호·통합참조번호·사업명·계약방법·총금액·공고품목수·환율적용일자·개찰일시·견적서제출마감일시 + 담당자 정보

### 3.2 업체정보 (M75/T75, slide421) — 조회
- 신청업체: 업체코드·업체명·대표자·전화번호·팩스·사업자등록번호·주소
- 입찰업체: 업체코드·업체명·대표자·이메일·전화번호·팩스·주소·사업자번호·DUNS NUM

### 3.3 입찰품목 (M76/T76, slide422) — 입찰참여품목(단가제), 입력
- 조회: 항목번호·재고번호·부품번호·품명·단위·수량·지시단가·화폐단위
- 입력: **품목대체구분(Y/N SelectBox)** · 견적단가(InputBox) · 견적금액
- 품목대체구분=Y 시: 품목대체첨부문서(파일첨부) · 수정재고번호·수정부품번호(InputBox) 입력폼 노출
- 카드(기본 4행: 항목번호/재고번호/부품번호/품명 + 내역 펼쳐보기) + 더보기

### 3.4 첨부파일 (M77/T77, slide423) — 업로드
- 구분 4종: 견적제안서·공급자증명서·제작사증명서·기타 공고요구서류 (파일 추가/삭제)
- 유의사항: "견적서(가격제안서)는 제출 후 수정할 수 없습니다 …"

> ⚠️ 영문 항목명 = 국외 상세 관례 차용(설계서 데이터영역 영문 미표기).

---

## 4. 연결
- `router.tsx`: `bd/ovs/rls-ngtn/:id/etdc` → `OvsRlsVltrnsNgtnEtdcSbmsnPage` (lazy + handle header sub, title '견적서 작성')
- 공개수의협상계획상세 FAB 바로가기 **견적서 작성** → navigate(이 라우트)
- 4스텝 마지막 [제출하기] → console 스텁(추후 견적서 제출 API/신청완료)

## 5. 요청 대응
- 페이지 타이틀 = **견적서 작성**(입찰서 제출 아님)
- 품목대체구분 = **Y/N SelectBox**
- 이전/다음으로·이전/제출하기 = **asymmetric**
- FAB = 없음(스텝 footer만) · 4스텝(설계서대로)

## 6. Definition of Done
- [x] 4 파일(Page/2/3/4) + 타입(bd.ts) + 라우트(`bd/ovs/rls-ngtn/:id/etdc`) + 계획상세 '견적서 작성' 연결
- [x] 헤더 타이틀 '견적서 작성' · 품목대체구분 Y/N SelectBox · asymmetric footer · FAB 없음 · 4스텝
- [x] 신규 공통 0 · lint 0 · build OK(chunk 9.53kB)
