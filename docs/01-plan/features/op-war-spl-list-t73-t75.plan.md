---
template: plan
version: 1.0
feature: op-war-spl-list-t73-t75
date: 2026-08-11
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# op-war-spl-list-t73-t75 Planning Document

> **Summary**: 연간조달계획 상세(`/op/ovs/:id`)의 탭을 **목록정보조회(군수품 목록)** 3탭 — 형상자료(MUI-OP-01-T73 `WarSplList_Cnfg`) · 식별자료(T74 `WarSplList_Idntf`) · 참고자료(T75 `WarSplList_Ref`) — 로 교체하고, 형상자료의 참조번호 블록에서 **업체정보(P77 `WarSplList_BzEnty`) 바텀시트**를 연다. 설계서 01.조달계획 v0.82 slide77~85(p76~84). **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-08-11 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 연간조달계획 카드로 진입하는 `/op/ovs/:id` 가 국외 조달계획 상세(T71 집행계획상세 / T72 결과목록) 탭을 그대로 보여줘, 설계서가 정의한 목록정보조회(형상/식별/참고자료) 화면이 없다. |
| **Solution** | 페이지 셸(요약 `SummaryInfo` + `StepBar` + `TabList` + `useCollapsibleHeader`)은 유지하고 탭 3개와 콘텐츠만 교체. NIIN 검색 상태는 페이지가 소유해 3탭 공유. |
| **Function/UX Effect** | 연간조달계획 상세 → 형상자료/식별자료/참고자료 조회, 형상자료 > 참조번호 > '업체정보 보기' → 업체정보 바텀시트. |
| **Core Value** | 신규 공통 0 — 항목명은 설계서 데이터영역(dm_itemInfo·dl_refList·dm_idntfInfo·dm_bzentyInfo) 영문 항목명 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 연간조달계획(annual) 카드 진입 화면이 설계서와 불일치 |
| **WHO** | 국외 연간조달계획의 군수품 목록정보를 조회하는 조달업체 사용자 |
| **RISK 1** | 설계서 p75(slide76)는 카드 클릭 시 **P76 목록정보조회 풀페이지 팝업**을 규정하나, 사용자 확정(2026-08-11)에 따라 **기존 페이지 `/op/ovs/:id` 의 탭 교체**로 구현한다. 따라서 P76 컨테이너 파일(`WarSplList_Inq.tsx`)은 만들지 않고 `OvsPrcmPlanDtlPage` 가 그 역할을 겸한다. |
| **RISK 2** | T71/T72 탭 콘텐츠(`OvsPrcmPlanDtl`·`OvsPrcmPlanDtl_RsltList`)는 이 경로에서 제거되어 **진입점이 없어진다**. 설계서 정의 화면이라 파일은 보존하고, 조달계획 유형의 국외 카드 동선이 확정되면 재연결한다. |
| **RISK 3** | 설계서 내부 표기 충돌 — 참고자료 '교정' 컬럼이 화면 목업은 `RNIC`, 항목설명 1.7 은 `RNJC/rnjc`. **항목설명을 권위로** `rnjc` 채택(라벨 `교정(RNJC)`). 사용자 확인 필요. |

---

## 결정 사항 / 해석

1. **진입 구조(사용자 확정)** — 연간조달계획 카드 → `/op/ovs/:id`, 헤더 타이틀 `연간조달계획 상세` 유지. 탭만 교체.
2. **영문 화면명(요청 6)** — 설계서 slide58 화면목록의 화면명(영문)·경로를 그대로 따른다.
   - T73 형상자료 `WarSplList_Cnfg` · T74 식별자료 `WarSplList_Idntf` · T75 참고자료 `WarSplList_Ref` · P77 업체정보 `WarSplList_BzEnty` — 모두 `src/ui/biz/op/ovsPrcmPlanDtl/`.
   - 설계서 ID 없는 하위 조립물(3탭 공통 NIIN 검색 바)은 상위 화면 ID 에서 파생 → `WarSplList_NiinSrch`.
3. **NIIN 검색(요청 2·4)** — slide78 이벤트 규칙 "다른 탭에서 NIIN 설정 시 탭에 모두 NIIN 유지" → **NIIN 상태는 페이지(`OvsPrcmPlanDtlPage`)가 소유**하고 3탭에 전달. 검색 실행 시에만 확정값(`appliedNiin`)이 조회 훅 파라미터로 들어간다(목록 화면의 `appliedSearch` 컨벤션 동일).
   - "내용 있으면 X 버튼, 없으면 숨김" → 공통 `InputBox` 를 고치지 않고 `onClear={niin ? clear : undefined}` 로 처리(값 없을 때 버튼 자체가 렌더되지 않음).
4. **형상자료(요청 2)** — 검색 + 식별정보(dm_itemInfo, 1테이블) + 참조번호(dl_refList, 건별 테이블 반복 + 건별 '업체정보 보기' 버튼).
5. **식별자료(요청 3)** — 검색 + dm_idntfInfo **단일 테이블**(23행, 항목설명 1.6 순서 그대로).
6. **참고자료(요청 4)** — 검색 + 참고자료 건별 테이블 반복(dl_refList, 항목설명 1.7 = 10행). 목업 3건(목업 이미지와 동일).
7. **업체정보(요청 5)** — `BottomSheet` 컨테이너는 **부모 탭 콘텐츠(`WarSplList_Cnfg`)가 소유**, 콘텐츠만 `WarSplList_BzEnty` 로 분리(CLAUDE.md — `*Sheet` 래퍼 금지). footer = '닫기'. 조회 키 = 생산자부호(`prdctnCd`).
8. **데이터 연결(요청 7)** — CLAUDE.md API 컨벤션 준수: 페이지/탭은 서비스 직접 import 금지, `queries/op.ts` useQuery 훅만 사용. 목업은 `mocks/op.ts`, EP 맵은 `services/op.ts` 상단.
9. **레이아웃** — 신규 컴포넌트 없이 `SectionTitle` + `Table`(label/value) + `InputBox` + `Button` + `InputLabel` 조립. 기존 `OvsPrcmPlanDtl_RsltList`(건별 Table 반복) 패턴 재사용.

## Scope

- (신규) `src/ui/biz/op/ovsPrcmPlanDtl/WarSplList_NiinSrch.tsx` — 3탭 공통 NIIN 검색 바
- (신규) `WarSplList_Cnfg.tsx` (T73) · `WarSplList_Idntf.tsx` (T74) · `WarSplList_Ref.tsx` (T75) · `WarSplList_BzEnty.tsx` (P77)
- (수정) `OvsPrcmPlanDtlPage.tsx` — TABS/renderTabContent 교체 + NIIN 상태 소유
- (수정) `src/types/op.ts` — 목록정보조회 섹션(`WarSplItemInfo`·`WarSplRefNo`·`WarSplCnfg`·`WarSplIdntf`·`WarSplRef`·`WarSplBzEnty`)
- (수정) `src/mocks/op.ts` · `src/services/op.ts`(EP 4건 + 메서드 4건) · `src/queries/op.ts`(opKeys + 훅 4건)

## Out of Scope

- P76 목록정보조회 풀페이지 팝업 컨테이너(`WarSplList_Inq.tsx`) — 사용자 확정에 따라 페이지가 대체.
- T71/T72(집행계획상세·결과목록) 재연결 동선 — 파일만 보존.
- 품목별가격자료(P75 `PrcDataList`) — 미구현 유지.

## Verification

- `npm run lint && npm run build` 통과 · chunk size 확인.
- 설계서 slide77~81(화면) / slide82~84(항목설명) 과 1:1 대조: 탭 3종 · 검색 · 식별정보 4항목 · 참조번호 4항목+업체정보 보기 · 식별자료 23항목 · 참고자료 10항목 · 업체정보 6항목.
