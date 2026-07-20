---
template: design
version: 1.0
feature: cm-ovs-sos-cnfdoc-list-m21
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-ovs-sos-cnfdoc-list-m21 Design Document

> 국외조달원등록증신청목록(MUI-CM-04-M21 `OvsSosCnfdocListPage`) 설계. Plan: `docs/01-plan/features/cm-ovs-sos-cnfdoc-list-m21.plan.md`.

## 1. 화면 정의 (설계서 00.공통 v0.84 slide331~333 · 화면 목록 slide214)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-M21 (허브 slide238 표기는 M09 — 화면 목록 기준 M21) |
| 화면명(영문) | OvsSosCnfdocListPage · 경로 `cm/ovsSosCnfdocList/OvsSosCnfdocListPage.tsx` |
| breadcrumb | 메인 홈 > 고객센터 > 민원서류 발급 신청 > 국외 조달원 등록증 목록 |
| 헤더 타이틀 | **국외 조달원 등록증** (slide331 타이틀바) |
| 라우트 | `/support/dcmnt-issu-aply/ovs-sos-cnfdoc` |
| 특이 | **상세 화면 없음** — 카드 클릭 = OZ 리포트 연결(P14 확인 팝업), 미승인 시 토스트 |

## 2. 레이아웃 (slide331)

```
필터 버튼 행(우측 정렬 — mock 은 빠른검색 없음) + ListSectionHeader(총건수·표시 개수)
CardList — 배지[진행상태 신청/반려/승인] + 접수번호 + 발급 대상업체명 +
           발급사유(2줄 클램프, 반려 시 반려 사유) + 신청인/회사명/연락처/신청일자/승인일자
더보기 (loaded/total)
하단 [신청] 바 — sticky bottom-0 하단 고정. 클릭 → 국외조달원등록증신청(MUI-CM-04-P22) 새 신청(스텁)
FAB — 맨위로
SearchFilter(공통 셸): 기간 설정*(빠른 설정 1/3/6개월) → 검색어(발급 업체명) → 구분 설정(진행상태)
카드 클릭(상세 화면 없음):
  - 신청(P)/승인(A) → AlertModal "서류 출력 확인"(MUI-BD-01-P14 — OZ 리포트 확인 후 스텁)
  - 반려(R) → 카드에 반려사유(rjctRsn)만 표시, 클릭 무동작(팝업/상세 없음)

> 2026-07-20 요청: P14 팝업을 신청/승인 카드 클릭에서 표시. 반려 카드는 반려사유 표시·클릭 무동작. 하단 [신청] 버튼은 새 신청(P22)용. (초기 안의 카드 클릭 토스트 "승인된 후 확인 가능합니다."는 미적용)
```

## 3. 데이터 (slide332 — 항목명 영문 그대로)

- 검색조건 `dm_searchInfo` → `OvsSosCnfdocSearchFilter`: 기간 `aplyYmdFrom/To`(=`aplyYmd: DateRangeValue`) · 진행상태 `prcsStcd`(전체/P신청/R반려/A승인) · 발급대상 업체명 `trgtBzentyCdNm`
- 목록 `dl_resultList` → `OvsSosCnfdocItem`: 접수번호 `aplyRcptNo`(12) · 발급대상 업체 `trgtBzentyCdNm` · 진행상태 `prcsStcd`(P/R/A 코드 그대로 + 표시명 매핑) · 신청일자 `aplyYmd` · 승인일자 `aprvYmd`
- 카드 표시 보강(상세 영역 `dm_ovsSosAplyDtlInfo` 항목명 재사용): 발급신청 사유 `aplyRsn` · 반려 사유 `rjctRsn` · 신청인 연락처 `aplcntEntlno`
- ⚠️ 신청인 성명·회사명은 설계서 영문 항목명 미정의 → 잠정 `aplcntNm`·`bzentyNm`(주석, 확정 시 교체 — CertItem 선례)

## 4. 배선

- `routes.ts` `SUPPORT_OVS_SOS_CNFDOC` + `router.tsx`(lazy, sub '국외 조달원 등록증', scrollReset) + 허브 카드 navigate. 아이콘 신규 없음.
