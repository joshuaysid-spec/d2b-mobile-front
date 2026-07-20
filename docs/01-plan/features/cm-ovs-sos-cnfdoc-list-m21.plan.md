---
template: plan
version: 1.0
feature: cm-ovs-sos-cnfdoc-list-m21
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-ovs-sos-cnfdoc-list-m21 Planning Document

> **Summary**: 국외조달원등록증신청목록(MUI-CM-04-M21 `OvsSosCnfdocListPage`) — 고객센터 > 민원서류발급신청 > 국외 조달원 등록증 신청 목록. 기 신청 내역 카드 목록 + 검색필터 + 카드 클릭 시 OZ 리포트 연결(서류 출력 확인 팝업 **MUI-BD-01-P14** — 추가 요청 2) / 미승인 건 토스트. **상세 화면 없음**(리포트 연결). 설계서 00.공통 v0.84 slide331~333. **Figma 전용 프레임 없음** → 목록 컨벤션. **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 민원서류발급신청 허브의 "국외 조달원 등록증 신청 목록" 카드가 스텁이다. |
| **Solution** | slide331 기준 목록 페이지 신규 — 검색필터 버튼 + 표시개수 + 신청내역 카드(진행상태 신청/반려/승인) + 더보기 + (+)신청 + P14 출력 확인 모달 + 미승인 토스트. |
| **Function/UX Effect** | 허브 > 국외 조달원 등록증 신청 목록 → 신청 내역 조회, 승인 건 클릭 시 등록증(OZ 리포트) 발급 확인. |
| **Core Value** | 신규 공통 0 — 항목명 dm_searchInfo·dl_resultList·dm_ovsSosAplyDtlInfo 설계서 그대로. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 민원서류발급신청 허브 바로가기 4번째 화면(M21 — 허브 표기 M09) 부재 해소 |
| **WHO** | 국외 조달원 등록증을 신청/발급받는 조달업체 사용자 |
| **RISK 1** | 신청 팝업(MUI-CM-04-P22 `OvsSosCnfdocReg`) 미구현 — (+)신청은 스텁 |
| **RISK 2** | 카드의 신청인 성명·회사명은 설계서에 영문 항목명 미정의 → 잠정 명칭(aplcntNm·bzentyNm, ⚠️ 주석)으로 두고 확정 시 교체(CertItem 선례) |

---

## 결정 사항 / 해석

1. **요청서 1번(검색필터)** — 공통 `SearchFilter` 셸 schema 주입: 기간 설정*(aplyYmdFrom/To, 최근 1/3/6개월) → 검색어(일부 입력 가능 — 발급 업체명 `trgtBzentyCdNm`) → 구분 설정(진행상태 `prcsStcd`: 전체/신청(P)/반려(R)/승인(A)). 목록 상단은 mock 대로 **빠른검색 없이 필터 버튼만**(SearchCondition 필터 버튼과 동일 스타일의 로컬 버튼).
2. **요청서 2번(바텀시트)** — 검색시트 불필요(필드 dateRange/select/text). 신규 바텀시트 0.
3. **추가 요청 2(MUI-BD-01-P14)** — 서류 출력 확인 팝업은 **공통 `AlertModal` 인라인**(기확립 패턴 — `PrcmPlanDtlPage` 동일 문구: "OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"). 승인(A) 카드 클릭 시 호출 → 확인 시 OZ 리포트 스텁.
4. **미승인 카드 클릭** — Toast "승인된 후 확인 가능합니다."(slide331).
5. **카드(slide331)** — 배지(진행상태) + 접수번호(aplyRcptNo) + 발급 대상업체명(trgtBzentyCdNm) + 발급사유(aplyRsn, 2줄 클램프 — **반려 시 반려 사유(rjctRsn) 표시**) + 신청인/회사명/연락처/신청일자/승인일자.
6. **진행상태 코드** — 설계서 코드값 그대로 `prcsStcd: 'P'|'R'|'A'`(신청/반려/승인) 저장 + 표시명 매핑.
7. **(+) 신청** — FAB(+) 클릭 → 국외조달원등록증신청(MUI-CM-04-P22) 미구현 스텁.

## Scope

- (신규) `src/ui/biz/cm/ovsSosCnfdocList/OvsSosCnfdocListPage.tsx`
- (수정) `src/types/cm.ts` — `OvsSosCnfdocItem`·`OvsSosCnfdocSearchFilter`
- (수정) `routes.ts` — `SUPPORT_OVS_SOS_CNFDOC: '/support/dcmnt-issu-aply/ovs-sos-cnfdoc'`
- (수정) `router.tsx` — lazy + handle(sub, 국외 조달원 등록증)
- (수정) `DcmntIssuAplyPage.tsx` — 국외 조달원 등록증 신청 목록 카드 → navigate

## Out of Scope

- 국외조달원등록증신청 팝업(P22 `OvsSosCnfdocReg`)·조달업체선택(P23)·OZ 리포트 연동 — 스텁.

## Verification

- `npm run lint && npm run build` 통과. slide331 구성(카드 필드/상태 3종/P14 팝업/토스트/신청) 1:1 대조.
