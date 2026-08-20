---
template: design
version: 1.0
feature: cm-app-srvc-expln-m06
date: 2026-08-20
author: jhlim
project: d2b-mobile-front
plan: docs/01-plan/features/cm-app-srvc-expln-m06.plan.md
---

# cm-app-srvc-expln-m06 Design Document

> 앱이용안내(MUI-MS-01-M06 `AppSrvcExpln`) — 설계서 00.공통 **v0.86 slide22(화면 p21)**.
> 최초 앱 기동 시 배너 5페이지 온보딩 + 하단 버튼 영역(첫/중간/마지막 3상태).
> 결정 근거(기존 화면 전면 교체·contain 배치·localStorage 영속·버튼 폭 비율 역산)는 plan 문서 「결정 사항」·RISK 1~4.
> ⚠️ 전체메뉴 > 이용안내 > **앱 이용안내(MUI-CM-05-M16 `AppSrvcExplnIdx` + `AppSrvcExplnCoach`)는 별개 화면** — 같은 폴더를 쓰지만 서로 참조하지 않는다.

## 1. 컴포넌트 구조

```
AppSrvcExplnPage({ onClose? })              ← h-dvh 풀스크린 · bg-krds-bg-primary-faint
├─ 배너 영역 (flex-1 min-h-0)
│  └─ <img src={BANNERS[step].src} className="size-full object-contain object-top" />
│                                              900×1600 PNG · 잘림 없음 · 상단 정렬
└─ 하단 버튼 영역 (shrink-0 · px-krds-8 pb-krds-9 pt-krds-7)
   └─ ButtonGroup layout="split"             ← step 에 따라 items 가 바뀜(§3)
```

- **신규 컴포넌트 0** — `ButtonGroup`(기존 composite) + `<img>` 만으로 조립.
- 공통 `Carousel` 미사용: 내부 index 를 외부에 노출하지 않아 버튼 3상태와 동기화할 수 없다(공통 컴포넌트 API 변경 회피 — plan 결정 7). 스와이프 제스처는 설계서에 없어 미구현.
- 페이지 전환 = `useState<number>` (`step`, 0-base). 한 번에 배너 1장만 렌더 → 이미지도 자연히 지연 로드.

## 2. 배너 에셋

`src/assets/images/appSrvcExpln/` (Figma file key `5M6FlyQBdHgeNrgIG2XhIN`, `download_assets` png scale 1)

| step | 페이지 | Figma 노드 | 파일 | alt (= 배너 각인 문구) |
|---|---|---|---|---|
| 0 | 메인홈 | `10064:17560` | `guideMscrn.png` | 빠르고 편리한 국방조달 업무의 시작 — 홈 |
| 1 | 검색필터 | `10064:17506` | `guideSrchFilter.png` | 복잡한 조건을 쉽게 필터링할 수 있는 — 검색필터 |
| 2 | 조달계획 | `10064:17524` | `guidePrcmPlan.png` | 예정된 조달을 미리 확인할 수 있는 — 조달계획 |
| 3 | 입찰공고 | `10064:17542` | `guideBidPbanc.png` | 놓치기 쉬운 세부 정보까지 투명하게 — 입찰공고 |
| 4 | 마이페이지 | `10064:17488` | `guideMyPage.png` | 나의 입찰 및 업무 진행 현황을 한눈에 — 마이페이지 |

- 각 900×1600(9:16) RGBA PNG, 350~390KB (합계 약 1.8MB). Vite 가 **JS 청크가 아닌 별도 asset 으로 emit** → 청크 크기 영향 없음. 폐쇄망 대비 CDN 없이 번들 포함.
- 배너 자체 배경 = 옅은 청색 수직 그라디언트 **#ecf1fb(상단) → #e6effd(하단)**. 화면 배경 토큰 `bg-krds-bg-primary-faint`(`--krds-d2b-blue-faint` **#ecf1fa**)와 사실상 동일(ΔRGB ≤ 6) → contain 여백이 배너와 이어져 이음선이 드러나지 않는다. **새 색 토큰 추가 없음.**

## 3. 버튼 영역 상태 (설계서 slide22 원문)

| step | 버튼(좌 → 우) | variant | 폭 |
|---|---|---|---|
| 0 (첫) | [다시 보지 않기] [다음] | secondary, primary | 2 : 1 |
| 1~3 (중간) | [다시 보지 않기] [이전] [다음] | secondary, secondary, primary | 2 : 1 : 1 |
| 4 (마지막) | [이전] [다시 보지 않기] | secondary, primary | 1 : 2 |

- 폭 비율은 slide22 주석 도형의 x 좌표에서 역산(다시보지않기 ≈ 이전/다음의 2배). `ButtonGroup layout="split"`(전 항목 `flex-1`) + `itemClassName="flex-[2]"` 로 구현 — twMerge 가 `flex-1` → `flex-[2]` 로 대체.
- **마지막 페이지의 [다시 보지 않기] 가 우측(주 액션) = primary** — `ButtonGroup` items 순서 컨벤션(가로 배치는 마지막이 primary)과 일치.
- 설계서에 [닫기]/[건너뛰기] 가 없어 안내 종료 경로는 [다시 보지 않기] 하나뿐(plan RISK 4).

## 4. 상태 / 영속화

| 항목 | 값 |
|---|---|
| `step` | `useState(0)` — [이전]/[다음] 이 ±1 |
| 저장 키 | `APP_SRVC_EXPLN_SEEN_KEY = 'appLaunchGuideSeen'` (**AppSrvcExplnPage 가 소유·export**) |
| 저장소 | `localStorage` (설계서 "이후 기동 시 앱 이용안내 화면 미노출") |
| 기록 시점 | `dismiss()` = [다시 보지 않기] 클릭 시 1회 |

`TODO(하이브리드 앱 탑재)`: 재설치와 무관하게 유지해야 하면 네이티브 저장(브릿지)으로 교체 — 코드 주석에 명시.

## 5. 진입 경로 2개

| 경로 | 렌더 | 종료 동작 |
|---|---|---|
| 라우트 `/app-guide` (`ROUTES.APP_GUIDE`, 셸 밖 풀스크린) | `<AppSrvcExplnPage />` (prop 없음) | `navigate('/')` — 메인 홈 |
| 홈 첫 진입 오버레이 (`HomePage`, `fixed inset-0 z-[60]`) | `<AppSrvcExplnPage onClose={handleGuideClose} />` | 오버레이 닫고 중요공지(MUI-MS-01-P08 `SysExpln`) 오픈 — 단, [더 이상 안보기] 처리된 공지(`isSysExplnDismissed('notice')`, 키 `sysExplnDismissed:notice`·공지 1건 단위)면 스킵 |

- prop 명 `onLaunch` → **`onClose`** 로 개명(액션이 더 이상 '앱 실행하기'가 아님).
- `HomePage` 의 첫 진입 판정도 `sessionStorage` → `localStorage.getItem(APP_SRVC_EXPLN_SEEN_KEY)` 로 변경. 저장은 `AppSrvcExplnPage.dismiss()` 가 단독 담당(중복 기록 제거).

## 6. 검증 결과 (2026-08-20)

- `npm run lint` — 0 error / 35 warning(전부 기존 `react-refresh/only-export-components`).
- `npm run build` — 성공(8.15s). 배너 5장은 `dist/assets/guide*.png` 로 개별 emit(합계 1.8MB), JS 청크 증가 없음.
- 헤드리스 브라우저(360×812, `/app-guide`) 실측:
  - 접근성 트리 버튼 구성이 설계서 3상태와 일치 — step1 `[다시 보지 않기][다음]` / step2 `[다시 보지 않기][이전][다음]` / step5 `[이전][다시 보지 않기]`.
  - 배너 5장 순회 정상, console error 0 · 실패 요청 0.
  - [다시 보지 않기] → `localStorage.appLaunchGuideSeen === '1'` + `/` 이동 확인.
  - 렌더 픽셀 실측: 배너 하단(#e6effd) ↔ 페이지 배경(#ecf1fa) 경계 ΔRGB ≤ 6 (지각 한계 이하).
