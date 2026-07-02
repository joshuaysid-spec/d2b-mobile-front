---
template: design
version: 1.0
feature: bd-implt-elgb-srng-abnd-aply-p21
date: 2026-07-02
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# bd-implt-elgb-srng-abnd-aply-p21 Design Document

> 이행/적격심사포기신청(MUI-BD-10-P21, 02.입찰 slide283~284). 풀팝업(FullPopup).
> 진입: 입찰결과상세 > 일반정보 > **이행/적격심사 포기하기** 버튼. 신규 공통 컴포넌트 0.

---

## 1. 화면 정의 (설계서 slide136 화면목록)

| 화면 ID | 한글 | 영문(파일) | 역할 |
|---------|------|-----------|------|
| MUI-BD-10-P21 | 이행/적격심사포기신청 | `ImpltElgbSrngAbndAply` | 포기 신청 풀팝업 |

폴더: `src/ui/biz/bd/bidRsltDtl/`(설계서 경로). breadcrumb: 홈 > 개찰목록 > 입찰결과상세.
컨테이너 타입: **FullPopup**(긴 폼·필수검증이라 풀팝업 래퍼로 캡슐화 — `*FullPopup` 규약).

> **검색필터/바텀시트:** 팝업이라 없음 → 요청 1·2 해당 없음.

---

## 2. 레이아웃 (ImpltElgbSrngAbndAply — FullPopup)

```
FullPopup(title '이행/적격심사 포기신청', footer 취소/제출하기)
├── SummaryInfo(badges 공고상태·업무구분·입찰방식 / subtitle 입찰공고번호 / title 공고명)  ← detail prop
├── Accordion
│   ├── '사유 선택' : RadioButtonGroup(vertical, 5) — 포기사유구분 elgbSrngAbndRsnSe (필수)
│   │        └ '기타(직접 입력)' 선택 시에만 → 포기사유 TextArea (srngMnftrBzentyAbndRsn, 필수*)
│   └── '첨부서류'(총 N건) : FileDownloadList 업로드(파일 추가/삭제) — dlt_adoc
└── footer: [취소(secondary), 제출하기(primary)]
```

검증 = react-hook-form + zod(팝업이 useForm 소유). 첫 에러 스크롤(Radix 그룹 수동 focus, main#app-scroll).

---

## 3. 콘텐츠 / 데이터영역 (설계서 slide283~284)

### 3.1 사유 선택 (dmt_impltElgbSrngAbndRsn)
- **포기사유구분** `elgbSrngAbndRsnSe` (E/Y, 1자리) — 라디오 5개, **필수 선택**:
  1. 업체 자체심사 결과 기준 점수 미달
  2. 참여의사 없음
  3. 구매선 미확보
  4. 납기준수 제한
  9. 기타(직접 입력)
  - (코드값 1~4·9 = 상세설계 예정 임시 — 설계서 항목명 `elgbSrngAbndRsnSe` 는 그대로)
- **포기사유** `srngMnftrBzentyAbndRsn` (E, 500자) — 기타(직접 입력) 선택 시에만 노출·**필수입력**. placeholder "내용을 입력하세요."

### 3.2 첨부서류 (dlt_adoc)
- 첨부서류명 `docNm`·첨부파일명 `fileNm`·파일크기 `fileSz` — 업로드(파일 추가/선택삭제)

---

## 4. 연결
- `BidRsltDtlPage` 일반정보 탭 "이행/적격심사 포기하기" 버튼 → `setAbndOpen(true)` (기존 console.log 스텁 교체)
- 팝업은 `detail`(BdopnItem) prop 으로 상단 요약 표시.

---

## 5. API 경계 스텁
| 동작 | 스텁 | 추후 |
|------|------|------|
| 조회 | 목업 | `scwin.getImpltElgbSrngAbndAplyInfo` |
| 파일 추가/삭제 | console.log | `btn_fileAdd`/`btn_chcDel` |
| 심사포기(제출) | console.log + reset + 닫힘 | `scwin.btn_srngAbnd_onclick` |
| 닫기 | onOpenChange(false) | `btn_close` |

---

## 6. Definition of Done
- [x] `ImpltElgbSrngAbndAply.tsx` + `.schema.ts` + 포기하기 버튼 연결(BidRsltDtlPage)
- [x] 기타 선택 시에만 포기사유 노출·필수검증(zod refine) · 설계서 항목명(영문) 1:1 · 신규 공통 컴포넌트 0
- [x] lint 0 errors · build OK(tsc -b)
