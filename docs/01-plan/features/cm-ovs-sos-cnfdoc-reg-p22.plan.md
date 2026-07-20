---
template: plan
version: 1.0
feature: cm-ovs-sos-cnfdoc-reg-p22
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-ovs-sos-cnfdoc-reg-p22 Planning Document

> **Summary**: 국외조달원등록증신청(MUI-CM-04-P22 `OvsSosCnfdocReg`) — 국외 조달원 등록증 신청 목록(M21) 하단 [신청] 버튼에서 여는 **풀팝업**(추가 요청). 신청인 정보(자동완성·일부 readonly) + 조달원 등록증(업체 선택·발급신청사유) 입력 후 신청. 설계서 00.공통 v0.84 slide334~335. **Figma 전용 프레임 없음** → 내부 컨벤션(`FullPopup` 래퍼 + RHF+zod). **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | M21 목록 하단 [신청] 버튼이 P22 스텁이다. |
| **Solution** | slide334 기준 풀팝업 `OvsSosCnfdocRegFullPopup` 신규 — 신청인(회사명/성명 readonly + 직위*/연락처*) + 조달원 등록증(업체명* 선택 + 발급신청사유*) RHF+zod 폼 + 신청하기/취소. |
| **Function/UX Effect** | M21 [신청] → 팝업에서 정보 입력 후 신청하기 → 완료 토스트 + 목록 리프래시(신청 항목 발급 가능 상태). |
| **Core Value** | 신규 공통 0 — `FullPopup`+`InputBox`+`InputLabel`+`TextArea`+`ButtonGroup` 조립. 항목명 dm_ovsSosAplyInfo·dm_ovsSosAplyDataInfo 설계서 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 국외 조달원 등록증 신규 신청(M21 하단 버튼) 부재 해소 |
| **WHO** | 국외 조달원 등록증을 신청하는 조달업체 사용자 |
| **RISK 1** | 조달업체선택(MUI-CM-04-P23 `OvsSosCnfdocChc`) 미구현 — 업체명 선택은 스텁(선택 버튼) |
| **RISK 2** | 신청/저장 전송 API 미연동 — console 스텁 + 완료 토스트/목록 리프래시는 부모(M21) 콜백 |

---

## 결정 사항 / 해석

1. **풀팝업 래퍼**(추가 요청) — 화면 ID + `FullPopup` 접미사: `OvsSosCnfdocRegFullPopup`(`cm/ovsSosCnfdocList/` — 설계서 경로 폴더). open/onOpenChange 는 부모(M21) 소유(P20 선례).
2. **요청서 3번(항목명)** — `dm_ovsSosAplyInfo`(성명 `empNm`·회사명 `bzentyNm`·직위 `aplcntJbgdNm`·연락처 `aplcntEntlno`) + `dm_ovsSosAplyDataInfo`(업체명1 `bzentyNm1`·업체명2 `bzentyNm2`·발급신청사유 `aplyRsn`)를 `types/cm.ts` 에 추가. 폼 편집 필드는 zod 스키마(co-locate)가 진실원천.
3. **자동완성/readonly(slide334)** — 회사명(bzentyNm)·성명(empNm)은 자동완성 + Dim(disabled). 직위·연락처는 개인정보에서 비어 있으면 빈 상태로 자동완성(편집 가능). 목업 = 조달테스트 업체 / 홍길동.
4. **폼 = RHF+zod**(폼 표준) — 직위(급)*·연락처*·업체명*·발급신청사유* 필수. 연락처는 `InputBox inputType="tel" + formatPhoneInput`(내부 컨벤션 — slide 의 3분할 박스 대신 단일 입력, 추가 요청 1). 발급신청사유는 `TextArea`(4000자).
5. **업체명 선택(slide334·335)** — 조달업체선택(MUI-CM-04-P23) 팝업 호출 자리. P23 미구현 → 선택 버튼(선택값 표시)만 두고 console 스텁. (요청 범위: P22)
6. **신청하기(slide334)** — 검증 통과 시 팝업 닫기 → 부모가 완료 토스트("신청 되었습니다.") + 목록 리프래시. 취소 → 팝업 닫기.
7. **라벨 이중표기(slide334)** — "직위(급) (Position)" 처럼 한글 + 영문 병기 그대로.

## Scope

- (신규) `src/ui/biz/cm/ovsSosCnfdocList/OvsSosCnfdocRegFullPopup.tsx` + `.schema.ts`
- (수정) `src/types/cm.ts` — `OvsSosAplyInfo`·`OvsSosAplyDataInfo`
- (수정) `src/ui/biz/cm/ovsSosCnfdocList/OvsSosCnfdocListPage.tsx` — 하단 [신청] → 팝업 오픈 + 완료 토스트

## Out of Scope

- 조달업체선택(P23 `OvsSosCnfdocChc`)·신청 전송 API — 스텁. 가상 키패드(연락처는 일반 tel InputBox).

## Verification

- `npm run lint && npm run build` 통과. slide334 구성(신청인/등록증 필드·필수·업체선택·신청하기/취소·완료 토스트) 1:1 대조.
