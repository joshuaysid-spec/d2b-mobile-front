---
template: plan
version: 1.0
feature: cm-app-srvc-expln-m06
date: 2026-08-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-app-srvc-expln-m06 Planning Document

> **Summary**: 최초 앱 기동 시 노출되는 **앱이용안내(MUI-MS-01-M06 `AppSrvcExpln`)** 를 설계서 00.공통 **v0.86 slide22(화면 p21)** 개정안대로 재작성한다. 개정 내용(2026-07-28 "화면 수정 / 스크린샷 이미지 업데이트 / 버튼 영역 추가 및 설명 작성") = **배너 5페이지 순차 안내**(메인홈·검색필터·조달계획·입찰공고·마이페이지) + **하단 버튼 영역**([다시 보지 않기]/[이전]/[다음], 첫·중간·마지막 페이지별 구성 변화). 배너 이미지 5장은 사용자가 지정한 Figma 노드(`5M6FlyQBdHgeNrgIG2XhIN`)에서 PNG 추출해 self-host. **신규 공통 컴포넌트 0.**
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-08-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | `AppSrvcExplnPage` 가 **구 설계서(Figma 10020:83458 `MUI-MS-01-P06_앱 이용 안내`)** 기준 — 인트로 카드("국방전자조달 모바일 서비스란?") + 항목 선택 리스트. v0.86 slide22 개정안(배너 5페이지 + 버튼 영역)과 불일치. |
| **Solution** | `AppSrvcExplnPage` 본문을 5페이지 배너 안내로 **전면 교체**. 페이지 전환은 `step` state, 버튼 구성은 설계서의 첫/중간/마지막 3상태를 그대로 재현. |
| **Function/UX Effect** | 최초 기동 시 앱의 핵심 화면 5개를 순차 소개 → [다시 보지 않기] 로 이후 기동 시 미노출(localStorage 영속). |
| **Core Value** | 배너는 임의 제작이 아니라 **Figma 스토어 그래픽 원본**(사용자 지정 노드)을 1:1 추출 — 설계서 slide22 에 박힌 스크린샷 이미지와 동일 소스. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 설계서 v0.86 slide22 개정 반영 (사용자 요청 2026-08-20) |
| **WHO** | 앱을 처음 설치·기동한 조달업체 사용자 |
| **WHAT (설계서 원문 요약)** | ① "최초 기동 시 앱 이용에 대한 안내 화면 / 하단 5개 페이지 노출 - 메인홈 - 검색필터 - 조달계획 - 입찰공고 - 마이페이지" ② "화면 하단 버튼 영역 - 다시보지 않기 버튼으로 앱시작 이용안내 다시 노출하지 않음. > 이후 기동 시 앱 이용안내 화면 미노출 / 버튼은 순차적으로 - 첫 페이지 · 중간 페이지 · 마지막 페이지 순으로 표시가 변경됨. - 이전, 다음 버튼으로 순서대로 이동" |
| **RISK 1** | **`MUI-CM-05-M16`(전체메뉴 > 이용안내 > 앱 이용안내 — `AppSrvcExplnIdx` + `AppSrvcExplnCoach`) 과는 별개 화면**이다(사용자 확인 2026-08-20). 같은 `appSrvcExpln/` 폴더를 공유하지만 **M16 파일 2개는 이번 작업에서 손대지 않는다.** |
| **RISK 2** | 설계서 slide22 의 버튼은 **주석(annotation) 도형**으로만 그려져 있어 실제 비주얼(색·크기·variant) 규격이 없다 → KRDS 표준(`ButtonGroup` + `Button` primary/secondary)으로 조립하고, **폭 비율만** slide22 주석 좌표(다시보지않기 : 이전 : 다음 ≈ 2 : 1 : 1)에서 역산해 반영. |
| **RISK 3** | 배너 PNG 5장 = 900×1600 · 합계 약 1.8MB. 폐쇄망이라 self-host 필수(CDN 금지) → `src/assets/images/appSrvcExpln/` 에 커밋. 번들 청크가 아닌 **에셋 파일로 별도 emit** 되므로 JS 청크 크기에는 영향 없음. |
| **RISK 4** | 마지막 페이지엔 [다음] 이 없고 [이전]·[다시 보지 않기] 뿐 → **안내를 끝내는 유일한 경로가 [다시 보지 않기]** 다(= 항상 "이후 미노출"이 됨). 설계서 원문대로 구현하고, 별도 [닫기]/[건너뛰기] 를 임의 추가하지 않는다. |

---

## 결정 사항 / 해석

1. **영문 화면명 / 파일 위치** — 설계서 slide7 화면목록: MUI-MS-01-M06 앱이용안내 = **`AppSrvcExpln`**. 기존 파일 `src/ui/biz/cm/appSrvcExpln/AppSrvcExplnPage.tsx` 유지(폴더명 = 화면 ID camelCase — `components.md` 규칙). 설계서 경로 칸(`src/ui/biz/cm/AppAuthrtAgre/AppSrvcExpln.tsx`)은 각주 1) "상세설계 기간에 작성 예정" 대상이라 코드 컨벤션을 따른다.
2. **기존 화면 처리(사용자 확정 2026-08-20)** — **5페이지 배너 캐러셀로 전면 교체.** 구 인트로 카드/항목 리스트는 v0.86 에 존재하지 않으므로 삭제.
3. **배너 표시 방식(사용자 확정)** — **전체폭 `object-contain` 상단 정렬 + 하단 버튼 영역 별도.** 이미지 잘림 없음. 화면 배경 = `bg-krds-bg-secondary`(#eef2f7 — 배너 원본 배경 #ecf0fa 근사, 프리로그인 화면(스플래시·권한동의) 과 동일 토큰).
4. **'다시 보지 않기' 영속화(사용자 확정)** — `sessionStorage` → **`localStorage`**. 키는 기존 `appLaunchGuideSeen` 유지하되 상수 `APP_SRVC_EXPLN_SEEN_KEY` 로 export 해 `HomePage` 와 단일화. 하이브리드 앱 탑재 시 네이티브 저장으로 교체할 지점에 주석.
5. **배너 이미지 출처(사용자 지정 Figma 노드 — file key `5M6FlyQBdHgeNrgIG2XhIN`)**

   | 순서 | 페이지 | Figma 노드 | 프레임명 | 배너 문구(이미지에 각인) | 파일 |
   |---|---|---|---|---|---|
   | 1 | 메인홈 | `10064:17560` | `[AOS-구글플레이스토어] 1) 홈` | 빠르고 편리한 국방조달 업무의 시작 / **홈** | `guideMscrn.png` |
   | 2 | 검색필터 | `10064:17506` | `[AOS-구글플레이스토어] 2) 검색필터` | 복잡한 조건을 쉽게 필터링할 수 있는 / **검색필터** | `guideSrchFilter.png` |
   | 3 | 조달계획 | `10064:17524` | `[AOS-구글플레이스토어] 3) 조달계획` | 예정된 조달을 미리 확인할 수 있는 / **조달계획** | `guidePrcmPlan.png` |
   | 4 | 입찰공고 | `10064:17542` | `[AOS-구글플레이스토어] 4) 입찰공고 (상세)` | 놓치기 쉬운 세부 정보까지 투명하게 / **입찰공고** | `guideBidPbanc.png` |
   | 5 | 마이페이지 | `10064:17488` | `[AOS-구글플레이스토어] 5) 마이페이지` | 나의 입찰 및 업무 진행 현황을 한눈에 / **마이페이지** | `guideMyPage.png` |

   - `download_assets`(png, scale 1) 로 추출 → 900×1600 RGBA PNG. 설계서 slide22 에 삽입된 이미지 5장(pptx `media/image5~9.png`)과 동일 소스임을 대조 확인.
   - 파일명은 해당 화면의 설계서 영문 화면 ID 기반(`Mscrn`=MUI-MS-01-M07 메인홈, `PrcmPlan`=MUI-OP-01-M01, `BidPbanc`=MUI-BD-01-M01, `MyPage`=MUI-CM-02, `SrchFilter`=검색필터 공통).
6. **버튼 구성(설계서 slide22 3상태)**

   | 페이지 | 버튼(좌→우) | variant |
   |---|---|---|
   | 첫(1/5) | [다시 보지 않기] [다음] | secondary, primary |
   | 중간(2~4/5) | [다시 보지 않기] [이전] [다음] | secondary, secondary, primary |
   | 마지막(5/5) | [이전] [다시 보지 않기] | secondary, primary |

   `ButtonGroup layout="split"` + `itemClassName` 으로 폭 비율(RISK 2) 조정. **마지막 페이지의 [다시 보지 않기] 가 주 액션 위치(우측)** — `ButtonGroup` items 순서 컨벤션(가로 = 마지막이 primary)과 일치.
7. **페이지 전환** — 설계서는 "이전, 다음 버튼으로 순서대로 이동"만 정의. 스와이프 제스처는 설계서에 없어 **미구현**(공통 `Carousel` 은 index 를 외부에 노출하지 않아 버튼 3상태와 동기화 불가 — 공통 컴포넌트 API 변경 없이 `step` state 로 1장씩 렌더).
8. **진입 경로 2개(기존 유지)** — ① 라우트 `/app-guide`(`ROUTES.APP_GUIDE`, 셸 밖 풀스크린) ② 홈 첫 진입 오버레이(`HomePage` → 닫으면 중요공지 `SysExpln` P08). prop 은 `onClose`(구 `onLaunch` — 액션이 '앱 실행하기'가 아니게 되어 개명).
9. **요청서 boilerplate 판별** — 요청 항목 "1. 검색필터 페이지와 그안에 들어가는 바텀시트제작" 은 페이지 제작 요청서의 정형 문구. MUI-MS-01-M06 은 온보딩 안내 화면으로 **검색조건·바텀시트가 설계서에 없다** → 해당 항목 미해당(메모리 `page-request-boilerplate` 기준). 3페이지 배너의 소재가 '검색필터'인 것과는 무관.
10. **API 없음** — 정적 안내 화면. 서비스/queries/타입/목업 추가 없음.

---

## 검증 계획

- `npm run lint && npm run build` — 에러 0, 청크 크기 확인(배너는 asset emit).
- 라우트 `/app-guide` 직접 진입 + 홈 첫 진입 오버레이 2경로 모두 5페이지 순회·버튼 3상태 확인.
- [다시 보지 않기] → `localStorage.appLaunchGuideSeen='1'` → 재진입 시 미노출(홈은 바로 P08).
- 배너 5장 alt 텍스트가 각 배너 각인 문구와 일치.
