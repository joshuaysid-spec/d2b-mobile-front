---
template: plan
version: 1.0
feature: cm-aply-step-info-m05
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-aply-step-info-m05 Planning Document

> **Summary**: 신청절차 및 안내(MUI-CM-04-M05, `AplyStepInfoPage`) — 고객센터 > 민원서류발급신청 > 신청절차 및 안내의 **정적 안내 페이지**. 실적증명서 신청 절차/안내 본문 + 담당부서 및 연락처(`Table`) + 하단 유의 2건. 설계서 00.공통 v0.84 slide239. **Figma 전용 프레임 없음** → 내부 안내 페이지 컨벤션(`Domestic01Page` 계열)으로 스타일. **신규 공통 컴포넌트 0**.
>
> **Project**: d2b-mobile-front · **Version**: 0.1.0 · **Author**: jhlim · **Date**: 2026-07-20 · **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 민원서류발급신청 허브의 "신청 절차 및 안내" 카드가 스텁(console.log)이다. |
| **Solution** | slide239 기준 정적 안내 페이지 `AplyStepInfoPage` 신규 + 허브 카드에서 navigate 연결. |
| **Function/UX Effect** | 허브 > 신청 절차 및 안내 탭 → 실적증명서 신청 절차·담당부서 연락처 안내 표시. |
| **Core Value** | 신규 공통 0 — 불릿/섹션타이틀은 안내 페이지 로컬 조립물 컨벤션, 연락처는 공통 `Table` 재사용(추가 요청 2). |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 민원서류발급신청(M04) 허브 바로가기 1번째 화면(M05) 부재 해소 |
| **WHO** | 실적증명서 신청 절차·문의처를 찾는 조달업체 모바일(웹뷰) 사용자 |
| **RISK 1** | 요청서 1·2번(검색필터/바텀시트)은 정적 안내 화면과 무관 — [[page-request-boilerplate]] 판별로 무시 |
| **RISK 2** | Figma 전용 프레임 없음(추가 요청 1) — 픽셀 추측 금지 원칙에 따라 기존 안내 페이지(`Domestic01Page`) 확립 스타일·토큰만 사용 |

---

## 결정 사항 / 해석

1. **요청서 1·2번(검색필터+바텀시트) 해당 없음** — slide239 는 검색조건·데이터영역 없는 정적 안내 화면. (검색필터는 다음 화면 M06 실적증명서 신청 목록의 것 — slide240.)
2. **요청서 3번(항목명 영문)** — M05 는 데이터영역이 없어 데이터 항목명 없음. 영문 화면 ID `AplyStepInfoPage`(설계서 slide212 화면 목록)만 폴더/파일명 반영: `cm/aplyStepInfo/AplyStepInfoPage.tsx`.
3. **추가 요청 1(Figma 없음)** — `Domestic01Page`/`Preparation01Page` 안내 페이지 컨벤션 재사용: `SecTitle`(19px Bold) + ● 불릿(17px) 로컬 조립물, KRDS 토큰만.
4. **추가 요청 2(담당부서 및 연락처 = Table)** — 공통 `Table`(label/value) 사용. 발급담당자 2명은 `combination` 행(두 줄).
5. **타이틀 = 신청절차 및 안내** — slide239 타이틀바 그대로. 전체메뉴 leaf 가 아니므로 `LINKED_MENU_LABELS` 미등록(허브 카드 진입 전용), router handle 에 직접 지정.

## Scope

- (신규) `src/ui/biz/cm/aplyStepInfo/AplyStepInfoPage.tsx`
- (수정) `src/constants/routes.ts` — `SUPPORT_APLY_STEP_INFO: '/support/dcmnt-issu-aply/aply-step-info'`
- (수정) `src/router.tsx` — lazy 등록 + handle(sub, 신청절차 및 안내, scrollReset)
- (수정) `src/ui/biz/cm/dcmntIssuAply/DcmntIssuAplyPage.tsx` — 신청 절차 및 안내 카드 스텁 → navigate

## Out of Scope

- 허브의 나머지 바로가기 4종(M06/M08/M09/P10) — 별도 작업.
- "PDF 진본성 파일 미검증시 조치 방법" 링크 동작 — 설계서에 대상 정의 없음 → 텍스트로만 표기.

## Verification

- `npm run lint && npm run build` 통과.
- slide239 문구(절차 1 + 안내 4 + 연락처 3행 + 유의 2) 1:1 대조.
