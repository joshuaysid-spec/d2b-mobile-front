---
template: design
version: 2.0
feature: cm-prfmnc-prdoc-sbmsn-p20
date: 2026-07-29
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-prfmnc-prdoc-sbmsn-p20 Design Document

> 실적증명서 제출(MUI-CM-04-P20 `PrfmncPrdocSbmsn`) **바텀시트** 설계 (v2.0 전면 재작성).
> Plan: `docs/01-plan/features/cm-prfmnc-prdoc-sbmsn-p20.plan.md`.

## 1. 화면 정의 (설계서 00.공통 v0.84 slide335~336 · 화면 목록 slide219)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-P20 · 화면명(영문) `PrfmncPrdocSbmsn` |
| 파일 | `src/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocSbmsn.tsx` — **설계서 slide219 웹페이지 경로와 동일** |
| 컨테이너 | 공통 `BottomSheet` (부모 `PrfmncPrdocDtlPage` 소유) — 전용 래퍼 없음 |
| breadcrumb | 메인 홈 > 고객센터 > 민원서류 발급 신청 > 실적증명서 신청 목록 > 상세 > 제출 |
| 진입 | M07 (+)시트 [실적증명서 제출] |
| 유스케이스 | UC-ZZ-06-02 |

### Figma 원본 (file `5M6FlyQBdHgeNrgIG2XhIN`)

| 노드 | 상태 |
|------|------|
| `10064:16185` | 선택 전 |
| `10064:16229` | 선택 (송신완료 1건) → footer `제출취소` |
| `10064:16278` | 다중 선택 (제출취소 2건) → footer `제출하기` |
| `10064:16332` | 비고 입력 · 가상 키패드 활성 |
| `10064:16388` | 제출 확인 모달 |

> ⚠️ `get_design_context` 가 이 세션에서 3회 모두 타임아웃/전송 끊김. 아래 치수는 전부 `get_metadata` **실측 좌표/크기**이며, 색은 노드별 `get_screenshot` 과 기존 KRDS 토큰 대조로 확정했다(추측값 없음).

## 2. 레이아웃

```
BottomSheet  title "실적증명서 제출"            ← 공통(pt20 · gap16 · pb16 · close 24)
  body
    "온라인 제출 가능 협회 목록"                 ← 15 Bold ink
    카드 ×7 (gap 16)                            ← m_checkcard = P20 전용 로컬 조립물
      [체크박스 24] 협회명(17 Bold) [상태 Badge]
      ─ SectionDivider ─                        ← 선택 시 (상태 유무 무관, 전 카드 동일)
      비고(17 muted)  [InputBox h48]            ← 선택 시 (상태 유무 무관, 전 카드 동일)
  footer  ButtonGroup asymmetric [닫기 | 제출하기]
                                                 ↑ 송신완료 선택 시 '제출취소'
[확인] → AlertModal check "실적증명서를 제출하시겠습니까?" [취소 | 확인]
```

## 3. 실측표 (`get_metadata` 10064:16229 기준, 단위 px)

| 대상 | 값 |
|------|----|
| 시트 | 360×700 (y=112) · title 16,20 328×29 · body 16,65 328×555 · footer 16,636 328×48 |
| 본문 콘텐츠 폭 | **312** — `contents+scroll` 328 = 콘텐츠 312 + gap 8 + 스크롤바 8 |
| 스크롤바 거터 | **스크롤이 있을 때만** 콘텐츠 루트에 `pr-krds-5`(**8**). globals.css 가 스크롤바를 8px classic 으로 그려 이미 8을 차지하므로 312+8+8=328 이 된다. 스크롤이 없으면 거터 없이 328 전폭. 감지는 `useHasScroll`(ResizeObserver, 컴포넌트 로컬). 좌측 패딩은 시트(px16)가 제공하므로 추가 금지 |
| 헤딩 → 카드목록 | gap **8** (헤딩 h26 at y=0, 목록 y=34) |
| 카드 간 | gap **16** (y=0/150/227/304/381/458/535) |
| 카드 높이 | 접힘 **61** · 펼침 **134** |
| 카드 패딩 | **16** (card title x=16,y=16 · 280 폭) |
| 체크박스 | 24×24, 협회명까지 gap **8** (title area x=32) |
| 협회명 → 뱃지 | gap **8** (뱃지 64×27) |
| card title → divider | gap **12** (title 하단 45, divider y=57 h1) |
| divider → 비고행 | gap **12** (divider 하단 58, info y=70 h48) |
| 비고 라벨 → 입력 | gap **8** (라벨 30×26, input 242×48) |

**타이포** — line-box 높이 역산 + 글자폭 교차검증으로 확정.
KRDS body line-height = **1.5**, Pretendard 한글 advance ≈ **0.867em** (뱃지 "송신완료" 4자 52px/15px 로 캘리브레이션).

| 요소 | 실측 | 검증 | 확정 |
|------|------|------|------|
| 시트 타이틀 | h29 | 19×1.5=28.5 | 19 Bold — 공통 BottomSheet |
| "온라인 제출 가능 협회 목록" | h26 | 17×1.5=25.5 | **`text-krds-body-md` Bold (17)** |
| 협회명 | h29 · 6자 99px | 19×1.5=28.5 · 19×0.867=16.5/자 | **`text-krds-body-lg` Bold (19)** |
| 비고 라벨 | h26 · 2자 30px | 17×1.5=25.5 · 17×0.867=14.7/자 | **`text-krds-body-md` muted (17)** |
| 상태 뱃지 | h27 · 4자 64px | 15×1.5+py4 · 52+px12 | 15 — 공통 Badge 기본 |

> 협회명 폭은 7곳 전부 **16.5px/자**로 일치(99/6·115/7·132/8·165/10·148/9) → 19px 확정.
> 카드 높이 재검산: 접힘 16+29+16=**61** ✓ · 펼침 16+29+12+1+12+48+16=**134** ✓

**색 (토큰 매핑)**

| 대상 | 토큰 |
|------|------|
| 카드 기본 | `bg-background` + 1px `border-krds-border-field` + `rounded-krds-8` |
| 카드 선택 | `bg-krds-bg-primary-faint`(**#ecf1fa**) + `border-krds-border-primary` + inset 1px = 시각 2px (레이아웃 시프트 방지 — Checkbox 칩과 동일 기법) |
| 구분선 | `SectionDivider` (`krds-border-divider` #d1d7e0) |
| 협회명 | `krds-text-ink` |
| 비고 라벨 | `krds-text-muted` |
| 뱃지 `송신완료` | `Badge type="pastel" color="blue"` |
| 뱃지 `제출취소` | `Badge type="pastel" color="red"` |

## 4. 데이터 (slide336 — 항목명 영문 그대로)

`dl_sbmsnAsctnList` → `SbmsnAsctnItem` (`types/cm.ts`)

| 항목(한글) | 항목(영문) | 속성 | 필수 | 자리수 | 비고 |
|---|---|---|---|---|---|
| 제출협회명 | `sbmsnSttsNm` | R | Y | 100 | 온라인 제출 대상 협회 7곳 |
| 상태 | `sttsVl` | R | N | 2 | 전송중 / 송신완료 / 실패 / 제출취소. 미제출이면 없음(레이블 미표시) |
| 비고 | `rmrkCn` | E | N | 4000 | 제출상태 취소시 취소사유. 송신완료시 버튼 활성화 |

`dm_prfmncPrdocAplyInfo`: 발급번호 `issuNo`(R,Y,20) · 접수번호 `prfmncRcptNo`(R,Y,11).

**협회 7곳(slide335)** — 대한건설협회 · 건설산업정보원 · 대한전문건설협회 · 한국전기공사협회 · 한국정보통신공사협회 · 한국건설기술인협회 · 한국소방시설협회.

## 5. 이벤트 (slide336)

| 이벤트 | 영문 | 처리 |
|---|---|---|
| On-Load | `scwin.onpageload` | `useSbmsnAsctnList(prfmncRcptNo)` — 제출 협회 목록 조회 |
| 제출하기 클릭 | `scwin.btn_sbmsn_onclick` | 선택 협회로 제출(**멀티 선택 가능**) → `prfmncPrdocService.submit` |
| 제출취소 클릭 | `scwin.btn_sbmsnRtrcn_onclick` | 비고에 취소사유 입력 후 협회로 재전송 → `prfmncPrdocService.cancelSubmit` |

- 표시 규칙(slide335): 제출되지 않은 상태에서는 레이블(뱃지) 미표시 · 비고 클릭 시 가상 키패드 활성 · footer 기본값 `제출하기`, 송신완료 건 선택 시 `제출취소` 로 명칭 변경.

## 6. 서비스 / 목업

- `services/cm.ts` › `prfmncPrdocService` — `getSbmsnAsctnList(prfmncRcptNo)` · `submit({ prfmncRcptNo, sbmsnSttsNms })` · `cancelSubmit({ prfmncRcptNo, items })`.
- EP: `PRFMNC_PRDOC_SBMSN_ASCTNS` / `PRFMNC_PRDOC_SBMSN` / `PRFMNC_PRDOC_SBMSN_CANCEL` (추정 REST — 반입 후 EP 맵만 수정).
- `mocks/cm.ts` › `sbmsnAsctnList` — Figma 현행 표시값(대한건설협회 송신완료 / 건설산업정보원·대한전문건설협회 제출취소 / 나머지 상태 없음).
- `queries/cm.ts` — `cmKeys.sbmsnAsctnList(prfmncRcptNo)` + `useSbmsnAsctnList`(cm 도메인 첫 훅 파일).

## 7. v1.0 대비 변경점

| 항목 | v1.0 (삭제) | v2.0 |
|---|---|---|
| 컨테이너 | `FullPopup` 래퍼 `PrfmncPrdocSbmsnFullPopup` | 공통 `BottomSheet`(부모 소유) + 콘텐츠 `PrfmncPrdocSbmsn` |
| 행 구조 | 1행 텍스트 + 우측 [선택] 칩 | `m_checkcard` 카드(좌측 24 체크박스 + 뱃지, 선택 시 비고 확장) |
| 비고 노출 | 송신완료면 항상 | **선택 시(전 카드 동일, 상태 유무 무관)** — 2026-07-29 확정 |
| 행별 제출취소 버튼 | 있음 | **제거**(Figma 미존재) — footer 단일 경로 |
| 제출 확인 | 없음 | `AlertModal check` "실적증명서를 제출하시겠습니까?" |
| 데이터 | 파일 상단 인라인 배열 | 서비스 실호출 + `mocks/cm.ts` |
| 설계서 참조 | slide329~330 (오기) | **slide335~336** |
