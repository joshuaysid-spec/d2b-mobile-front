---
template: design
version: 2.0
feature: cm-ovs-sos-cnfdoc-reg-m22
date: 2026-07-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-ovs-sos-cnfdoc-reg-m22 Design Document

> 국외조달원등록증신청(**MUI-CM-04-M22** `ovsSosCnfdocReg`) 신청서 **페이지** + 조달업체선택(**MUI-CM-04-P23** `ovsSosCnfdocChc`) 바텀시트 설계. Plan: `docs/01-plan/features/cm-ovs-sos-cnfdoc-reg-m22.plan.md`. (v1 풀팝업 설계 폐기 — §0 참고)

## 0. v1→v2 변경 이력

- v1(2026-07-20): 풀팝업 `OvsSosCnfdocRegFullPopup`, P23 out-of-scope.
- **v2(2026-07-24)**: 설계서 slide339 "팝업→페이지 변경" + 사용자 요청(P23 포함) 반영 → **라우트 페이지** `OvsSosCnfdocRegPage` + **P23 바텀시트** `OvsSosCnfdocChc`. 화면 ID 정정 P22→**M22**(앱메뉴 xlsx).

## 1. 화면 정의 (설계서 00.공통 v0.84 slide339~342)

| 항목 | M22 신청서 | P23 조달업체선택 |
|------|-----------|------------------|
| 화면 ID / 영문 | MUI-CM-04-M22 · `ovsSosCnfdocReg` | MUI-CM-04-P23 · `ovsSosCnfdocChc` |
| 파일 | `cm/ovsSosCnfdocReg/OvsSosCnfdocRegPage.tsx` (+`OvsSosCnfdocReg.schema.ts`) | `cm/ovsSosCnfdocReg/OvsSosCnfdocChc.tsx` (콘텐츠 전용, 컨테이너는 부모 소유) |
| 유형 | 라우트 페이지(`.../ovs-sos-cnfdoc/reg`) | BottomSheet(부모=M22 페이지가 open/컨테이너 소유) |
| breadcrumb | … > 국외 조달원 등록증 목록 > 신청 | … > 신청 > 조달업체 선택 |
| 진입 | M21 목록 하단 [신청] | M22 [업체선택] 버튼 |

## 2. M22 레이아웃 (slide340)

```
Page (헤더 variant:sub, title "국외 조달원 등록증 신청")
  [신청인 (Applicant)]              ← SectionTitle
    회사명 (Company Name)      — bzentyNm   (InputBox disabled, 자동완성: 조달테스트 업체)
    성명 (Name)               — empNm      (InputBox disabled, 자동완성: 홍길동)
    직위(급) (Position) *      — aplcntJbgdNm (InputBox text, 필수)
    연락처 (Phone Number) *    — aplcntEntlno (InputBox tel + formatPhoneInput, 필수)
  [조달원 등록증 (Certificate of Registration)]   ← SectionTitle
    업체명1 (Company Name) *   — bzentyNm1  (SelectionFieldBox → [업체선택] P23, 필수)
    업체명2 (Company Name) *   — bzentyNm2  (SelectionFieldBox → [업체선택] P23, 필수)
    발급신청사유 (Reason of Application) * — aplyRsn (TextArea 4000자, 필수)
  하단 sticky bar: ButtonGroup [취소 | 신청하기]
신청하기 → 검증 통과 → Toast "신청 되었습니다." → navigate 목록(M21)
취소 → navigate(-1)
```

- 스타일: Figma 없음 → 내부 폼 컨벤션. `InputLabel required` `*` + `InputBox`/`TextArea`/`SelectionFieldBox` + `InputMessage type="error"`. 라벨은 한글+영문 병기(slide 그대로). 섹션 배경/간격은 `krds-*` 토큰.
- 폼: RHF `mode:'onSubmit'`+`reValidateMode:'onBlur'`, `Controller`로 각 필드 연결, 첫 에러 `id="field-<name>"` + `#app-scroll` 스크롤(Radix 아님이라 입력류는 자동 포커스지만 SelectionField/TextArea 안전용 id 부여).

### 2.5 업체명1/업체명2 (해석 결정)

- 데이터영역(slide341) `dm_ovsSosAplyDataInfo` 는 `bzentyNm1`·`bzentyNm2` **둘 다 E/Y(편집·필수)**. 목업 화면(slide340)은 [업체선택] 1개만 그려져 있으나 데이터 계약이 2필드이므로 **2개 SelectionFieldBox**로 구현(각각 필수). 클릭 시 `activeField`('bzentyNm1'|'bzentyNm2')를 세팅하고 동일 P23 시트를 열어, 선택 결과의 업체명을 해당 필드에 반영. (실제 화면이 단일 업체명이면 bzentyNm2 제거 + 스키마 1줄 축소.)

## 3. P23 레이아웃 (slide342)

```
BottomSheet title "조달업체 선택"  (컨테이너·타이틀 = M22 페이지 소유)
  OvsSosCnfdocChc (콘텐츠):
    SegmentedControl [업체명 | 업체코드]   ← 검색 대상 전환(slide342 두 상태)
    InputBox (선택된 대상: 업체명 text / 업체코드 numeric max5) + [검색] Button
    ListSectionHeader (총 N건 · 표시개수)
    결과 목록(button rows): 업체명(bold) · 대표자명 · 대표전화 / 업체코드
  row 클릭 → onSelect(item) → 상위 필드 반영 + 시트 닫힘
```

- Like 검색(입력 포함 매칭). 검색 전에는 기본 목록(목업) 노출. key = `bzentyCd`(안정 고유값).
- 콘텐츠는 자체 좌우 패딩 금지(BottomSheet가 px-16 제공) — 상하 gap만.

## 4. 데이터 (설계서 항목명 영문 그대로)

- `dm_ovsSosAplyInfo` → **`OvsSosAplyInfo`**(기존): 성명 `empNm`(R,100)·회사명 `bzentyNm`(R,100)·직위 `aplcntJbgdNm`(E,100)·연락처 `aplcntEntlno`(E,88)
- `dm_ovsSosAplyDataInfo` → **`OvsSosAplyDataInfo`**(기존): 업체명1 `bzentyNm1`(E,100)·업체명2 `bzentyNm2`(E,100)·발급신청사유 `aplyRsn`(E,4000)
- P23 `dl_resultList`(slide343) → **`OvsSosBzentyChcItem`**(신규): 업체코드 `bzentyCd`(R,5)·업체명 `bzentyNm`(R,100)·대표자명 `rprsvNm`(R,100)·대표전화 `rprsvTelno`(R,25)
- 폼 편집 필드(`aplcntJbgdNm`·`aplcntEntlno`·`bzentyNm1`·`bzentyNm2`·`aplyRsn`) = zod 스키마(`OvsSosCnfdocReg.schema.ts`, co-locate) 진실원천. 신청 전송은 `// TODO(백엔드 확정)`.

## 5. 배선

- M21 `OvsSosCnfdocListPage`: 하단 [신청] → `navigate('/support/dcmnt-issu-aply/ovs-sos-cnfdoc/reg')` (구 `console.log` 교체).
- `router.tsx`: `support/dcmnt-issu-aply/ovs-sos-cnfdoc/reg` = `OvsSosCnfdocRegPage`, `handle: { header:{variant:'sub', title:'국외 조달원 등록증 신청'}, scrollReset:true }`. 정적 세그먼트라 형제 목록 라우트와 충돌 없음(상세 `:param` 없음).
- 신규 아이콘 없음(SelectionFieldBox의 ArrowForwardIos·Search 등 기존 REGISTRY).
