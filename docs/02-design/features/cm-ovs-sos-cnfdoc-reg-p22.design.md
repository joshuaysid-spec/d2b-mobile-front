---
template: design
version: 1.0
feature: cm-ovs-sos-cnfdoc-reg-p22
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-ovs-sos-cnfdoc-reg-p22 Design Document

> 국외조달원등록증신청(MUI-CM-04-P22 `OvsSosCnfdocReg`) 풀팝업 설계. Plan: `docs/01-plan/features/cm-ovs-sos-cnfdoc-reg-p22.plan.md`.

## 1. 화면 정의 (설계서 00.공통 v0.84 slide334~335 · 화면 목록 slide214)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-P22 · 화면명(영문) OvsSosCnfdocReg |
| 파일 | `cm/ovsSosCnfdocList/OvsSosCnfdocRegFullPopup.tsx`(+`.schema.ts`) — FullPopup 래퍼 컨벤션(ID+FullPopup) |
| breadcrumb | … > 국외 조달원 등록증 목록 > 신청 |
| 진입 | M21 목록 하단 [신청] 버튼 — open/onOpenChange 는 부모(M21) 소유 |

## 2. 레이아웃 (slide334)

```
FullPopup title "조달원 등록증 신청서"
  [신청인 (Applicant)]
    회사명 (Company Name)      — bzentyNm  (readonly/disabled, 자동완성: 조달테스트 업체)
    성명 (Name)               — empNm     (readonly/disabled, 자동완성: 홍길동)
    직위(급) (Position) *      — aplcntJbgdNm  (InputBox, 필수)
    연락처 (PhoneNumber) *     — aplcntEntlno  (InputBox tel + formatPhoneInput, 필수)
  [조달원 등록증 (Certificate of Registration)]
    업체명 (Company Name) *    — bzentyNm1/2  (선택 버튼 → 조달업체선택 P23 스텁, 필수)
    발급신청사유 (Reason of Application) * — aplyRsn (TextArea 4000자, 필수)
  footer [취소 | 신청하기]
신청하기 → 검증 통과 시 팝업 닫기 → 부모: 완료 토스트 "신청 되었습니다." + 목록 리프래시
취소 → 팝업 닫기
```

- 스타일: Figma 없음 → 내부 폼 컨벤션(InputLabel required `*` + InputBox/TextArea + InputMessage 에러). 라벨은 한글+영문 병기(slide 그대로).

## 3. 데이터 (slide335 — 항목명 영문 그대로)

- `dm_ovsSosAplyInfo` → `OvsSosAplyInfo`: 성명 `empNm`(R,100) · 회사명 `bzentyNm`(R,100) · 직위 `aplcntJbgdNm`(E,100) · 연락처 `aplcntEntlno`(E,88)
- `dm_ovsSosAplyDataInfo` → `OvsSosAplyDataInfo`: 업체명1 `bzentyNm1`(E,100) · 업체명2 `bzentyNm2`(E,100) · 발급신청사유 `aplyRsn`(E,4000)
- 폼 편집 필드(aplcntJbgdNm·aplcntEntlno·bzentyNm1·aplyRsn) = zod 스키마(co-locate) 진실원천. 신청/전송은 console 스텁.

## 4. 배선

- M21 `OvsSosCnfdocListPage`: 하단 [신청] → `setRegOpen(true)` → `OvsSosCnfdocRegFullPopup` 렌더. onSubmitted → 완료 Toast + 목록 리프래시(스텁).
- 업체선택 → 조달업체선택(MUI-CM-04-P23 `OvsSosCnfdocChc`) 미구현 스텁. 아이콘 신규 없음.
