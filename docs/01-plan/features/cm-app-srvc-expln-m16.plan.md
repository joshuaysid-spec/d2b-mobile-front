# 앱 이용안내 (MUI-CM-05-M16) — plan

> PDCA: Plan(본 문서) → Do(구현) → Check(lint/build·설계서 대조) → Act(문서 동기화)
> 상태: **Do·Check 완료(2026-07-31)** — lint 에러 0 · build 통과. 잔여: 코디네이터 근사 보고(아래 "근사").

## 근거 문서

- 설계서: 00.공통 v0.85 slide378(인덱스)·379~381(코치마크 목업) — 2026-07-24 신규 추가 화면.
- Figma: `5M6FlyQBdHgeNrgIG2XhIN` node `10076:23346` — 프레임명 `MUI-MS-01-M06_앱 이용 안내_0)인덱스`
  (디자인팀도 기존 M06 앱 이용안내 흐름의 확장으로 취급).
- 공통 컴포넌트: `CoachMark`(composites, Figma 10066-21724 1:1) 기 구현 — 재사용.

## 화면 정의 (설계서)

1. **인덱스(slide378)** — 홈 위 딤 + 중앙 모달. "안내를 원하시는 항목을 선택해주세요." +
   항목 리스트(메인 홈/마이페이지/메뉴/조달계획/입찰, `>`) + [앱 이용안내 닫기].
   항목 클릭 → 각 화면 1번 안내 표시. 닫기 → 메인 페이지 이동/이용안내 닫기.
2. **코치마크(slide379~381)** — 각 화면 위 말풍선 단계 안내. 이전/다음(첫/끝 disable — 공통
   CoachMark 는 clamp 로 확정됨), 레이어 최상단 [앱 이용안내 닫기] → 메인 홈 이동.
   문구 앞 숫자는 제거하고 표시(단계 숫자는 CoachMark 의 n/total 이 담당).

## 사용자 확정 사항 (2026-07-31)

- **영문 화면명**: 설계서 화면목록(slide357·366)·앱메뉴 xlsx(260723B) 어디에도 M16 영문명 없음
  → 기존 앱이용안내 매핑(`AppSrvcExpln`, MUI-MS-01-M06/P06) **파생 사용**.
  `cm/appSrvcExpln/` 폴더에 `AppSrvcExplnIdx`(인덱스 모달) · `AppSrvcExplnCoach`(코치마크 오버레이) 추가.
- **코치마크 방식**: 실제 화면(홈/마이페이지/전체메뉴/조달계획목록/입찰목록) 위 오버레이.
  말풍선 위치는 화면별 고정 근사값(pub) — 요소 앵커링은 기능 연동 시 재검토.

## 요청서 boilerplate 판정 (설계서 기준 — memory/page-request-boilerplate)

- "검색필터 페이지와 바텀시트 제작" → **해당 없음.** M16 은 안내 화면으로 설계서에 검색조건·
  데이터영역이 없다(slide378~381). 미적용.

## 구현 구조

- 라우트 신설 없음 — URL 쿼리 `?appGuide=` 로 구동되는 **AppLayout 오버레이**(MenuPage/IntgSrch 동일 패턴).
  - `appGuide=index` → `AppSrvcExplnIdx`(AlertModal 조립, 홈 위) 표시.
  - `appGuide=home|mypage|menu|op|bd` → `AppSrvcExplnCoach`(딤 z-[60], FullPopup z-50 위) 표시.
- 진입: 전체메뉴 이용안내 > 앱 이용안내(`guide-app`) → `/?appGuide=index`.
  (M06 스플래시 `/app-guide` = `AppSrvcExplnPage` 는 기존 유지 — 홈 첫 진입 오버레이 용도.)
- 인덱스 항목 → 대상 화면 이동 + `?appGuide=<key>`: home=`/` · mypage=`/mypage` · menu=`/`+
  `state.openMenu`(전체메뉴는 AppLayout 오버레이) · op=`/op` · bd=`/bd`.
- 코치마크 닫기/그만보기 → `navigate(ROUTES.HOME)`(쿼리 제거 = 닫힘 + 메인 홈, 설계서 동작).
- 단계 문구: slide379~381 원문(앞 숫자 제거). home 4 · mypage 4 · menu 3 · op 5 · bd 3.

## 근사(코디네이터 보고 대상)

- Figma 인덱스 닫기 버튼은 outline(white+blue border)이나 AlertModal 단일 액션은 primary 고정
  (SysExpln 과 동일한 AlertModal 재사용 근사).
- AlertModal description 은 `<p>`(DialogDescription) — div 중첩 불가라 리스트는
  NavigationItemList 대신 phrasing-safe `<button>` 행으로 동일 비주얼 재현.
- 말풍선 위치 = 화면별 고정 근사(top/middle/bottom 프리셋).

## Check

- `npm run lint && npm run build`.
- 설계서 문구 1:1 대조(인덱스 안내문·항목명·닫기 라벨·코치마크 단계 문구).
