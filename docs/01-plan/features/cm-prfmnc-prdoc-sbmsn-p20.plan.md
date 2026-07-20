---
template: plan
version: 1.0
feature: cm-prfmnc-prdoc-sbmsn-p20
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-sbmsn-p20 Planning Document

> **Summary**: 실적증명서 제출(MUI-CM-04-P20 `PrfmncPrdocSbmsn`) — 실적증명서 확인(M07) (+)시트의 [실적증명서 제출]에서 여는 **풀팝업**(추가 요청 2). 온라인 제출 가능 협회 7곳 멀티 선택 제출 + 송신완료 건 비고 입력·제출취소. 설계서 00.공통 v0.84 slide329~330. **Figma 전용 프레임 없음** → 내부 컨벤션(`FullPopup` 래퍼). **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | M07 (+)시트의 [실적증명서 제출]이 console.log 스텁이다. |
| **Solution** | slide329 기준 풀팝업 `PrfmncPrdocSbmsnFullPopup` 신규 — 협회 목록(선택 토글·상태 표시·송신완료 건 비고/제출취소) + footer 제출하기(송신완료 선택 시 '제출취소'로 라벨 변경)/닫기. |
| **Function/UX Effect** | 상세 (+) > 실적증명서 제출 → 풀팝업에서 협회 멀티 선택 후 제출(스텁 토스트 없이 console — API 경계). |
| **Core Value** | 신규 공통 0 — `FullPopup`+`Checkbox(box)`+`InputBox`+`Badge`+`ButtonGroup` 조립. 항목명 `dl_sbmsnAsctnList` 설계서 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 발급된 실적증명서의 협회 온라인 제출(M07 하위 액션) 부재 해소 |
| **WHO** | 발급 실적증명서를 협회(대한건설협회 등 7곳)에 제출하는 조달업체 사용자 |
| **RISK 1** | 제출/제출취소 전송 API 미연동 — console 스텁 + 경계 주석 |
| **RISK 2** | slide330 의 dm_ctrtInfo(P20판)는 T01 dm_ctrtInfo 와 항목명이 다름(dmndNo/ctrtPrgrsCd/ofcctrNm) — 화면 목업에 미표시라 **이번 범위에서 타입 미정의**(표시 요구 확정 시 추가) |

---

## 결정 사항 / 해석

1. **풀팝업 래퍼**(추가 요청 2) — 컨벤션대로 화면 ID + `FullPopup` 접미사: `PrfmncPrdocSbmsnFullPopup`(`cm/prfmncPrdocDtl/` — 설계서 경로 폴더). 컨테이너/open 은 부모(M07)가 소유.
2. **요청서 1·2번(검색필터/바텀시트) 해당 없음** — slide329 는 협회 목록 팝업(검색 없음).
3. **요청서 3번(항목명)** — `dl_sbmsnAsctnList`(제출협회명 `sbmsnSttsNm` · 상태 `sttsVl`(전송중/송신완료/실패/제출취소) · 비고 `rmrkCn`)를 `types/cm.ts` 에 추가. 실적증명서 영역(dm_prfmncPrdocAplyInfo)의 발급번호 `issuNo` 는 기존 타입에 보강.
4. **행 구성(slide329)** — 협회명 + [선택] 토글(멀티) + 상태 레이블(미제출 시 미표시). 송신완료 건: 비고 입력(rmrkCn, 활성) + [제출취소] 버튼(비고에 취소사유 입력 후 재전송 — 이벤트 설명).
5. **footer** — [닫기 | 제출하기]. 송신완료 건이 선택되면 '제출하기' → '제출취소' 라벨 변경(slide329).
6. **M07 (+)시트 연결(요청)** — 신청 및 수정=신청 플로우(기연결) · 제출=이 풀팝업 오픈 · 삭제=확인 팝업 문구 "실적증명서를 삭제 하시겠습니까?" (아니오/삭제).

## Scope

- (신규) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocSbmsnFullPopup.tsx`
- (수정) `src/types/cm.ts` — `SbmsnAsctnItem`(dl_sbmsnAsctnList) + `PrfmncPrdocAplyInfo.issuNo`
- (수정) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtlPage.tsx` — 제출 액션 → 팝업 오픈, 삭제 팝업 문구/버튼(아니오/삭제)

## Out of Scope

- 제출/제출취소 전송 API·가상 키패드(비고 입력은 일반 InputBox) — 스텁.

## Verification

- `npm run lint && npm run build` 통과. slide329 구성(협회 7·선택·상태·비고·제출취소·footer 라벨 변경) 1:1 대조.
