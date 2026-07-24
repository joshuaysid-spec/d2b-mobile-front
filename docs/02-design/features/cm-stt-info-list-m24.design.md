---
template: design
version: 1.0
feature: cm-stt-info-list-m24
date: 2026-07-24
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-stt-info-list-m24 Design Document

> 법령조회(=법령정보, **MUI-CM-04-M24** `SttInfoListPage`) 목록 화면 설계. Plan: `docs/01-plan/features/cm-stt-info-list-m24.plan.md`.

## 1. 화면 정의 (설계서 00.공통 v0.84 slide344~345 · 화면목록 slide220)

| 항목 | 값 |
|------|----|
| 화면 ID / 영문 | MUI-CM-04-M24 · `SttInfoListPage` (요청 "P24" 는 오ID — 설계서/앱메뉴 M24) |
| 파일 | `cm/sttInfoList/SttInfoListPage.tsx` |
| 라우트 | `/support/stt-info-list` (`ROUTES.SUPPORT_STT_INFO_LIST`) |
| 타이틀 | 법령조회 (전체메뉴 `support-law` 라벨) |
| breadcrumb | 메인 홈 > 고객센터 > 법령조회 |
| 진입 | 전체메뉴 > 고객센터 > 법령조회 |

## 2. 레이아웃 (slide344)

```
Page (헤더 variant:sub, title "법령조회", 3뎁스 → BottomNav 숨김)
  [검색 영역]
    법령구분 TabList (variant=button, 스크롤) — 전체 · 법령 · 대통령령 · 부령 · 조례 · 행정규칙 · 훈령 · 예규 · 고시 · 지침 · 공고 · 임의법령  (싱글 셀렉트 → 목록 재구성)
    법령명 검색: InputBox("검색할 내용을 입력하세요.") + [검색] Button  (Enter 지원, Like)
  ListSectionHeader (총 N건 · 표시개수 10/20/50)
  법령 카드 목록:
    ┌ Badge(sttType 법령구분) Badge(sttAbbrNm 법령약어)      ★(sttItrst 토글)
    │ sttNm 법령명 (19 Bold)
    │ 시행일자                                   sttEnfcYmd
    └ (카드 전면 클릭 → window.open(sttUrl) 외부 브라우저)
  더보기 (loaded/total)
  FloatingActionButton (맨 위로 — #app-scroll)
```

- 스타일: Figma 없음 → 목록 화면 내부 컨벤션(관심법령 `ItrstSttPage` 카드/별/외부링크 패턴 재사용, `krds-*` 토큰). 카드 = 전면 nav 버튼(absolute inset-0) + 별 버튼(pointer-events-auto)로 중첩 `<button>` 회피.
- 법령구분 12종이라 스크롤 TabList(`scrollButtons='auto'`). 설계서 "탭 싱글 셀렉트" 반영.

## 3. 데이터 (slide345 — 항목명 영문 그대로)

- 검색조건 `dm_searchInfo` → **`SttInfoSearchFilter`**: 법령구분 `sttType`(E,Y,200) · 법령명 `sttNm`(E,N,300).
- 목록 `dl_resultList` → **`SttInfoItem`**: 순번 `no`(로컬 key `id` 로 대체) · 법령구분 `sttType`(R,200, 코드 GTSC0017) · 법령약어 `sttAbbrNm`(R,200) · 법령명 `sttNm`(R,300) · 시행일자 `sttEnfcYmd`(R,8) · 링크 `sttUrl`(R,500) · 즐겨찾기 `sttItrst`(R,1 → UI boolean).
- 법령구분 코드값 `STT_TYPES` = [법령·대통령령·부령·조례·행정규칙·훈령·예규·고시·지침·공고·임의법령] (전체는 필터 전용, 데이터값 아님).
- ⚠️ 관심법령(`ItrstSttItem`)은 slide106 오기로 법령구분을 `sttSeNm` 으로 뒀으나, M24 는 slide345 정본대로 **`sttType`**. 두 타입은 별개.
- 조회/즐겨찾기/외부링크 = 목업 + `// TODO(백엔드 확정)`. 별 토글은 로컬 상태(관심법령 선례 — 해제해도 페이지 유지 중 목록 잔류).

## 4. 이벤트 (slide345)

- On-Load: 공통코드 로드, 법령구분 '전체' 기본. (목업 즉시 렌더)
- 검색(`scwin.grd_sttList_oncellclick`): 검색조건 부합 데이터 조회 → 클라 필터.
- 항목 클릭(`scwin.grd_sttUrl_oncellclick`): 해당 법령 링크 화면 이동 → `window.open(sttUrl,'_blank','noopener,noreferrer')`.
- 즐겨찾기(`scwin.grd_sttItrst_oncellclick`): 등록/해제 토글 → 로컬 상태.

## 5. 배선

- `router.tsx`: `support/stt-info-list` = `SttInfoListPage`, `handle:{ header:{variant:'sub', title:'법령조회'}, scrollReset:true }`.
- `MenuPage`: `support-law` 라벨 `LINKED_MENU_LABELS[ROUTES.SUPPORT_STT_INFO_LIST]`(='법령조회') + `MENU_ROUTES['support-law']=ROUTES.SUPPORT_STT_INFO_LIST`.
- 신규 아이콘: 없음(별 `KidStar`·검색 `Search` 기존 REGISTRY).
