---
template: design
version: 1.0
feature: cm-prfmnc-prdoc-sbmsn-p20
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-sbmsn-p20 Design Document

> 실적증명서 제출(MUI-CM-04-P20 `PrfmncPrdocSbmsn`) 풀팝업 설계. Plan: `docs/01-plan/features/cm-prfmnc-prdoc-sbmsn-p20.plan.md`.

## 1. 화면 정의 (설계서 00.공통 v0.84 slide329~330 · 화면 목록 slide213)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-P20 · 화면명(영문) PrfmncPrdocSbmsn |
| 파일 | `cm/prfmncPrdocDtl/PrfmncPrdocSbmsnFullPopup.tsx` (FullPopup 래퍼 컨벤션 — ID+FullPopup) |
| breadcrumb | … > 실적증명서 신청 목록 > 상세 > 제출 |
| 진입 | M07 (+)시트 [실적증명서 제출] — open/onOpenChange 는 부모(M07) 소유 |

## 2. 레이아웃 (slide329)

```
FullPopup title "실적증명서 제출"
  섹션 타이틀 "온라인 제출 가능 협회 목록"
  협회 행 ×7 (대한건설협회/건설산업정보원/대한전문건설협회/한국전기공사협회/
              한국정보통신공사협회/한국건설기술인협회/한국소방시설협회)
    협회명(17 Bold) + 상태 Badge(sttsVl — 미제출 시 미표시) + [선택] 토글(멀티, 우측)
    송신완료 건 → 비고(rmrkCn) InputBox 활성 + [제출취소] 버튼(비고에 취소사유 입력 후 재전송)
  footer [닫기 | 제출하기]  ※ 송신완료 건 선택 시 '제출하기' → '제출취소' 라벨 변경
```

## 3. 데이터 (slide330 — 항목명 영문 그대로)

- `dl_sbmsnAsctnList` → `SbmsnAsctnItem`(types/cm.ts): 제출협회명 `sbmsnSttsNm`(R,100) · 상태 `sttsVl`(R,2 — 전송중/송신완료/실패/제출취소) · 비고 `rmrkCn`(E,4000 — 송신완료 시 활성).
- `dm_prfmncPrdocAplyInfo`: 발급번호 `issuNo`(R,20) 기존 타입 보강(+prfmncRcptNo).
- P20 판 dm_ctrtInfo(ctrtNo/dmndNo/ctrtPrgrsCd/ctrtNm/rprsItemNm/ctrtAmt/orderInstNm/ofcctrNm)는 목업 화면에 미표시 → 타입 미정의(표시 확정 시 추가).
- 제출/제출취소: console 스텁(`// 추후 API: 협회 전송`).

## 4. M07 (+)시트 연결 (2026-07-20 요청)

- [실적증명서 신청 및 수정] → 신청 플로우(기연결) · [실적증명서 제출] → 이 풀팝업 · [실적증명서 삭제] → AlertModal "실적증명서를 삭제 하시겠습니까?" (아니오/삭제).
