# cm05-guide-menu-links — 이용안내 하위 안내 페이지 전체메뉴 배선

> 요청일 2026-08-25. 대상 설계서: 00.공통 v0.86 (MUI-CM-05-M11 · M13 · M14).

## 요청 판별 (Plan)

| 요청 | 설계서 ID | 판별 결과 |
|---|---|---|
| 전자대금청구절차 페이지 생성 | MUI-CM-05-M11 | **기구현** — `cm/domestic03/Domestic03Page` (/guide/domestic03), Figma 10020-86420 동일 |
| 국외조달원 등록/변경안내 페이지 생성 | MUI-CM-05-M13 | **기구현** — `cm/foreign02/Foreign02Page` (/guide/foreign02), Figma 10020-86724 동일 |
| 전자입찰절차(국외) 페이지 생성 | MUI-CM-05-M14 | **기구현** — `cm/foreign03/Foreign03Page` (/guide/foreign03), Figma 10020-86255 동일 |
| 청렴계약제 페이지 생성 (추가 요청) | MUI-CM-05-M08 | **기구현** — `cm/preparation02/Preparation02Page` (/guide/preparation02), Figma 10020-86224 동일 |

- 요청서의 "1. 검색필터 페이지 + 바텀시트 제작" 문구는 **다른 화면 템플릿의 잔여 boilerplate** —
  이 챕터(MUI-CM-05-M07~M15)는 전부 정적 안내 페이지라 무시(기확정 판별 기준, `page-request-boilerplate` 선례).
- 따라서 실작업 = 각 요청의 7번(메뉴 계층 배치)만:
  - 이용안내 > **전자입찰절차** 밑에 **전자대금청구절차**
  - 이용안내 > **국외조달원 등록절차** 밑에 **국외조달원 등록/변경안내**
  - 이용안내 > **국외조달원 등록/변경안내** 밑에 **전자입찰절차**(국외)
- 전자대금청구절차의 기준점인 **전자입찰절차(M10, /guide/domestic02)** 가 현재 전체메뉴에 없어
  함께 추가한다(요청 계층이 전제하는 항목). 청렴계약제(M08)는 요청에 없어 메뉴 미노출 유지.

## 설계 (Do 방침)

- 라벨 단일화: 메뉴에 링크되는 페이지의 라벨은 `LINKED_MENU_LABELS` 가 단일 진실원천
  (`cm-board-list-and-linked-menu` 컨벤션) — GUIDE_DOMESTIC02/03, GUIDE_FOREIGN02/03 4건을 이관하고
  router handle title 하드코딩을 참조로 교체.
- MenuPage 이용안내 children 순서(요청 계층 그대로 — M08 추가 요청 반영):
  사전준비사항 → 청렴계약제 → 국방 조달 참여절차 → 국내 전자입찰절차 → 전자대금청구절차
  → 국외조달원 등록절차 → 국외조달원 등록/변경안내 → 국외 전자입찰절차 → 관련 사이트 → 용어사전 → 앱 이용안내.
  (전자입찰절차 국내/국외 라벨은 '국내/국외 전자입찰절차'로 개정 — 사용자 확정 2026-08-25.)
- MENU_ROUTES 에 guide-prep02, guide-domestic02/03, guide-foreign02/03 leaf → 라우트 5건 추가.

## Check

- tsc/eslint 통과 + 브라우저에서 전체메뉴 이용안내 순서·각 leaf 클릭 시 해당 페이지 이동 확인.
