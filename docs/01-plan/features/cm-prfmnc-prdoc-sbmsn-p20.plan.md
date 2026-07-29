---
template: plan
version: 2.0
feature: cm-prfmnc-prdoc-sbmsn-p20
date: 2026-07-29
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-sbmsn-p20 Planning Document

> **Summary**: 실적증명서 제출(MUI-CM-04-P20 `PrfmncPrdocSbmsn`) **전면 재작성(v2.0)**. 기존 `PrfmncPrdocSbmsnFullPopup`(풀팝업, Figma 없이 내부 컨벤션으로 추정 구현)을 **삭제**하고, Figma 현행 5개 프레임(10064-16185/16229/16278/16332/16388) 실측대로 **바텀시트 + 체크카드**로 재구현한다. 설계서 00.공통 v0.84 **slide335~336**(구 문서의 slide329~330 은 오기 — 실적증명서신청 복합공사종류 데이터영역이었음). **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-29 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 기존 P20 구현이 **컨테이너 종류(FullPopup)·행 구조·상태 표현·확인 모달**까지 Figma 현행과 어긋난다. 당시 "Figma 전용 프레임 없음"으로 판단해 내부 컨벤션으로 추정 구현했으나, 현재 `5M6FlyQBdHgeNrgIG2XhIN` 파일에 P20 전용 프레임 5종이 존재한다. |
| **Solution** | 기존 파일 삭제 후 `PrfmncPrdocSbmsn.tsx`(**콘텐츠 전용**) 신규 + 부모(M07)가 `BottomSheet`/`AlertModal` 컨테이너 소유. 카드(m_checkcard)는 P20 전용 로컬 조립물로 Figma 실측 1:1. |
| **Function/UX Effect** | 상세 (+) > 실적증명서 제출 → 바텀시트에서 협회 멀티 선택 → 확인 모달 → 서비스 실호출. |
| **Core Value** | 신규 공통 0 — `BottomSheet`·`Checkbox(box)`·`Badge`·`InputBox`·`SectionDivider`·`ButtonGroup`·`AlertModal` 조립. 항목명은 `dl_sbmsnAsctnList` 설계서 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 발급 실적증명서의 협회 온라인 제출 화면이 현행 디자인과 불일치 |
| **WHO** | 발급된 실적증명서를 협회 7곳에 온라인 제출/제출취소하는 조달업체 사용자 |
| **RISK 1** | `get_design_context` MCP 가 이 세션에서 3회 모두 타임아웃/전송 끊김 → **색상 hex 직접 추출 불가**. 대응: `get_metadata`(좌표·크기 실측)+노드별 `get_screenshot`+기존 KRDS 토큰 매칭으로 대체. 픽셀 추측 없음(치수는 전부 실측값). |
| **RISK 2** | slide335 는 미선택 시 `제출하기`가 **활성**(파란 solid)으로 그려져 있으나, 미선택 클릭 시 동작이 설계서에 없음 → 아래 "미결" 1번 |

---

## 결정 사항 / 해석

1. **컨테이너 = BottomSheet (FullPopup 아님).** Figma `10064:16229` 루트 자식이 `m_bottom sheet` 인스턴스(360×700, y=112)다. 시트 실측(pt 20 / gap 16 / footer 48 / pb 16)이 공통 `BottomSheet` 와 완전 일치 → 공통 그대로 사용.
2. **`*FullPopup`·`*Sheet` 래퍼 폐기.** CLAUDE.md "BottomSheet·AlertModal 은 전용 래퍼를 만들지 않는다" 에 따라 **콘텐츠만** 분리: `PrfmncPrdocSbmsn.tsx`. 컨테이너 props(`title`/`footer`/`open`/`onOpenChange`)와 선택 상태는 **부모 `PrfmncPrdocDtlPage` 소유**(footer 라벨이 선택 상태에 종속되므로 상태를 부모가 가져야 함).
   - 결과적으로 파일 경로가 설계서 slide219 "웹페이지 경로" 열(`src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocSbmsn.tsx`)과 **정확히 일치**한다(요청서 3번 충족).
3. **요청서 1·2번(검색필터 + 그 안의 바텀시트) 해당 없음.** slide335~336 에 검색조건(`dm_searchInfo`) 영역이 없고 Figma 5프레임에도 검색 UI 가 없다 — [[page-request-boilerplate]] 판별로 무시. 시트 컨테이너는 이미 공통에 존재하므로 신규 제작 불필요(요청서 2번).
4. **행 = `m_checkcard`(P20 전용 로컬 조립물).** Figma 에서 `frame`(인스턴스 아님) → 공통 컴포넌트가 아니다. 추가 요청 1대로 P20 파일 안에서 실측 조립하며, **공통 `base`/`composites` 에 올리지 않는다**(사용자 승인 필요 대상 아님).
5. **비고(rmrkCn) 노출 조건 = 선택됨(모든 카드 동일).** Figma 3개 사례(16229/16278/16332)는 마침 상태가 있는 카드만 선택돼 있어 초안에서는 "선택 + 상태 있음"으로 좁게 해석했으나, **2026-07-29 사용자 확정으로 상태 유무와 무관하게 선택된 카드는 모두 비고를 연다.**
6. **footer 라벨 전환** — `송신완료` 상태 항목이 하나라도 선택되면 `제출하기` → `제출취소`(slide335 기능버튼 설명 + Figma 16229 vs 16278 대조로 확증).
7. **제출 확인 모달**(Figma `10064:16388`) — `AlertModal variant="check"` + "실적증명서를 제출하시겠습니까?" + [취소 | 확인]. 기존 구현에 없던 단계.
8. **행별 [제출취소] 버튼 제거** — 기존 구현이 카드 안에 넣었던 버튼은 Figma 어느 프레임에도 없다. 제출취소는 **footer 단일 경로**.
9. **console.log 스텁 폐기 → 서비스 실호출**(CLAUDE.md "API 연동 컨벤션" 1번). `prfmncPrdocService`(services/cm.ts) 신규 + EP 맵 + `mocks/cm.ts` 목업 + `queries/cm.ts` 신규(On-Load 조회 훅). 목업 값은 **Figma 현행 표시값**을 따른다(대한건설협회=송신완료, 건설산업정보원·대한전문건설협회=제출취소, 나머지 4곳 상태 없음).
10. **slide 참조 정정** — 코드/문서의 `slide329~330` 주석을 **`slide335~336`** 으로 교정(구 번호는 무관한 슬라이드였음).

## Scope

- (삭제) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocSbmsnFullPopup.tsx`
- (신규) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocSbmsn.tsx` — 바텀시트 **콘텐츠 전용**
- (신규) `src/queries/cm.ts` — `cmKeys` + `useSbmsnAsctnList`
- (수정) `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtlPage.tsx` — BottomSheet/AlertModal 컨테이너 + 선택 상태 + 제출/제출취소 await
- (수정) `src/types/cm.ts` — `SbmsnAsctnItem` 주석·상태 유니온 정비(slide336)
- (수정) `src/services/cm.ts` — `prfmncPrdocService` + EP 3건
- (수정) `src/mocks/cm.ts` — `sbmsnAsctnList`

## Out of Scope

- 가상 키패드(Figma 16332) — OS 기본 키패드 동작. 시트는 `maxHeightVh` 로 이미 키보드 대응(BottomSheet 주석 참고).
- P20 판 `dm_ctrtInfo`(계약정보 8항목) — Figma 5프레임 어디에도 표시되지 않음 → 타입 미정의 유지.

## 미결 (기획 확인 필요)

1. **미선택 상태에서 [제출하기] 클릭 시 동작** — Figma 는 버튼을 활성으로 그렸으나 설계서에 미선택 클릭 처리가 없다. 이번 구현은 Figma 대로 **활성 유지 + 미선택이면 확인 모달을 열지 않음**(무동작)으로 두었다. 안내 문구가 필요하면 문구 확정 후 반영.
2. **`전송중`·`실패` 상태 뱃지 색** — Figma 에 `송신완료`(pastel blue)·`제출취소`(pastel red)만 존재. 나머지 2개는 의미상 근접색(전송중=blue, 실패=red)으로 매핑.

## Verification

- `npm run lint && npm run build` 통과 + chunk size 확인.
- Figma 5프레임 vs 구현 스크린샷 2패스 대조(치수는 `get_metadata` 실측표 기준 — design 문서 §3).
