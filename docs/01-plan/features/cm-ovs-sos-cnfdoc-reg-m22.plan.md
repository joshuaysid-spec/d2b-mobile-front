---
template: plan
version: 2.0
feature: cm-ovs-sos-cnfdoc-reg-m22
date: 2026-07-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-ovs-sos-cnfdoc-reg-m22 Planning Document

> **Summary**: 국외조달원등록증신청(**MUI-CM-04-M22** `ovsSosCnfdocReg`) — 국외 조달원 등록증 신청 목록(M21) 하단 [신청] 버튼에서 진입하는 **페이지**(설계서 slide339 "2026-07-20 화면 수정: 팝업에서 페이지로 변경"). 신청인 정보(자동완성·일부 readonly) + 조달원 등록증(업체 선택·발급신청사유) 입력 후 신청. 이번 차수에 **조달업체선택(MUI-CM-04-P23 `ovsSosCnfdocChc`) 바텀시트**까지 함께 구현(업체선택 버튼 → 바텀시트). 설계서 00.공통 v0.84 slide339~342. **Figma 전용 프레임 없음** → 내부 컨벤션(RHF+zod, BottomSheet 부모 소유). **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-24 · **Status**: Draft
>
> ⚠️ **v1→v2 변경**: 구 v1(2026-07-20)은 **풀팝업**(`OvsSosCnfdocRegFullPopup`)·**P23 out-of-scope**로 설계했으나, 설계서 개정(팝업→페이지)과 사용자 요청(P23 포함)에 맞춰 **페이지 + P23 바텀시트**로 재설계. 파일명 `-p22`는 구 오표기 → `-m22`로 정정(앱메뉴 xlsx row662 = `MUI-CM-04-M22`).

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | M21 목록 하단 [신청] 버튼이 스텁(`console.log`)이라 신규 신청 화면이 없다. 업체선택 바텀시트(P23)도 없다. |
| **Solution** | slide340 기준 신청서 **페이지** `OvsSosCnfdocRegPage` 신규(라우트 `.../ovs-sos-cnfdoc/reg`) — 신청인(회사명/성명 readonly + 직위*/연락처*) + 조달원 등록증(업체명1*/업체명2* 선택 + 발급신청사유*) RHF+zod 폼. slide342 기준 **조달업체선택 바텀시트** `OvsSosCnfdocChc`(검색+결과목록) 신규 — 업체선택 버튼이 연다. |
| **Function/UX Effect** | M21 [신청] → 신청서 페이지 → [업체선택] → P23 바텀시트에서 업체 검색·선택(→ 필드 반영·시트 닫힘) → 신청하기 → 완료 토스트 + 목록(M21) 복귀. |
| **Core Value** | 신규 공통 0 — `SelectionFieldBox`+`InputBox`+`InputLabel`+`TextArea`+`InputMessage`+`ButtonGroup`+`BottomSheet`+`SegmentedControl` 조립. 항목명 `dm_ovsSosAplyInfo`·`dm_ovsSosAplyDataInfo`·P23 `dl_resultList` 설계서 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 국외 조달원 등록증 신규 신청(M21 하단 버튼) + 업체선택 부재 해소 |
| **WHO** | 국외 조달원 등록증을 신청하는 조달업체 사용자 |
| **RISK 1** | 신청 전송 API 미연동 — 제출은 목록 복귀 + 완료 토스트(전송은 `// TODO(백엔드 확정)`). M21 목록도 목업이라 신규 항목 실반영은 없음. |
| **RISK 2** | 업체명1/업체명2 2필드 여부 — 설계서 데이터영역(slide341)은 `bzentyNm1`·`bzentyNm2` 둘 다 E/Y(필수)로 정의, 목업 화면(slide340)은 [업체선택] 1개만 노출. → **데이터영역(2필드) 기준**으로 구현하고 각 필드가 동일 P23을 연다(해석 결정 §3.5). 단일 필드가 맞으면 1줄 축소. |

---

## 결정 사항 / 해석

1. **페이지(구 풀팝업 폐기)** — 설계서 slide339 "팝업에서 페이지로 변경". 폴더 = 화면 ID `ovsSosCnfdocReg/`(신규), 페이지 `OvsSosCnfdocRegPage.tsx`(라우트 페이지라 `Page` 접미사 — 형제 `OvsSosCnfdocListPage` 규약 일치). 라우트 `support/dcmnt-issu-aply/ovs-sos-cnfdoc/reg`(형제 `prfmnc-prdoc/reg` 선례, 정적 세그먼트).
2. **P23 조달업체선택 바텀시트(이번 차수 포함)** — 콘텐츠 전용 컴포넌트 `OvsSosCnfdocChc.tsx`(같은 폴더). **컨테이너(BottomSheet)·타이틀은 부모(M22 페이지)가 소유**(`*Sheet` 래퍼 금지 규칙). 업체선택 버튼 → 시트 open → row 클릭 → `onSelect(업체)` 로 상위 필드 반영 + 시트 닫힘.
3. **요청서 3번(항목명 영문)** — 설계서 그대로: `dm_ovsSosAplyInfo`(성명 `empNm`·회사명 `bzentyNm`·직위 `aplcntJbgdNm`·연락처 `aplcntEntlno`) + `dm_ovsSosAplyDataInfo`(업체명1 `bzentyNm1`·업체명2 `bzentyNm2`·발급신청사유 `aplyRsn`) 는 `types/cm.ts`에 **이미 존재**. P23 결과 `dl_resultList`(업체코드 `bzentyCd`·업체명 `bzentyNm`·대표자명 `rprsvNm`·대표전화 `rprsvTelno`)는 **신규 타입 `OvsSosBzentyChcItem`** 추가.
4. **자동완성/readonly(slide340)** — 회사명(`bzentyNm`)·성명(`empNm`)은 자동완성 + Dim(disabled). 직위·연락처는 개인정보에서 비어 있으면 빈 상태로 자동완성(편집 가능). 목업 = 조달테스트 업체 / 홍길동.
5. **폼 = RHF+zod**(폼 표준) — 직위(급)*·연락처*·업체명1*·업체명2*·발급신청사유* 필수. 연락처는 `InputBox inputType="tel" + formatPhoneInput`(내부 컨벤션 — slide의 3분할 박스 대신 단일 입력, 추가 요청 1). 발급신청사유는 `TextArea`(4000자). 업체명은 `SelectionFieldBox`(클릭=시트 오픈). 첫 에러 포커스 `id="field-*"` + `#app-scroll` 스크롤.
6. **신청하기(slide340)** — 검증 통과 시 완료 토스트("신청 되었습니다.") 후 목록(M21)으로 `navigate`. 취소 → 뒤로. 전송 API 는 `// TODO(백엔드 확정)`.
7. **라벨 이중표기(slide340)** — "직위(급) (Position)" 처럼 한글 + 영문 병기 그대로.

## Scope

- (신규) `src/ui/biz/cm/ovsSosCnfdocReg/OvsSosCnfdocRegPage.tsx` + `OvsSosCnfdocReg.schema.ts` — M22 신청서 페이지 + 폼 스키마
- (신규) `src/ui/biz/cm/ovsSosCnfdocReg/OvsSosCnfdocChc.tsx` — P23 조달업체선택 바텀시트 콘텐츠
- (수정) `src/types/cm.ts` — `OvsSosBzentyChcItem` 추가(P23 결과)
- (수정) `src/router.tsx` — lazy 라우트 `.../ovs-sos-cnfdoc/reg` 등록
- (수정) `src/ui/biz/cm/ovsSosCnfdocList/OvsSosCnfdocListPage.tsx` — 하단 [신청] `console.log` → `navigate('.../ovs-sos-cnfdoc/reg')`

## Out of Scope

- 신청 전송·업체 검색 실 API — 목업(설계서 형식) + `// TODO`. M21 목록 실반영(신규 항목 push). 가상 키패드(연락처는 일반 tel InputBox). MUI-BD-01-P14 서류출력확인은 M21에 이미 인라인 구현됨(이번 차수 무관).

## Verification

- `npm run lint && npm run build` 통과 · chunk size 확인.
- slide340 구성(신청인/등록증 필드·필수·업체선택·신청하기/취소) + slide342 구성(검색조건·결과목록·row 선택) 1:1 대조.
- 항목명 영문(`empNm`/`bzentyNm`/`aplcntJbgdNm`/`aplcntEntlno`/`bzentyNm1`/`bzentyNm2`/`aplyRsn`/`bzentyCd`/`rprsvNm`/`rprsvTelno`)이 설계서와 일치하는지 재확인.
