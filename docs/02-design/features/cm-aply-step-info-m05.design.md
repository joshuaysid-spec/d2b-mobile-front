---
template: design
version: 1.0
feature: cm-aply-step-info-m05
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-aply-step-info-m05 Design Document

> 신청절차 및 안내(MUI-CM-04-M05, `AplyStepInfoPage`) 설계. Plan: `docs/01-plan/features/cm-aply-step-info-m05.plan.md`.
> 핵심: 정적 안내 페이지 — 안내 페이지 컨벤션(`Domestic01Page` 계열) + 담당부서/연락처는 공통 `Table`. **신규 공통 0**.

---

## 1. 화면 정의 (설계서 00.공통 v0.84 slide239 · 화면 목록 slide212)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-M05 |
| 화면명(한글) | 신청절차및안내 (민원서류 신청절차 및 안내) |
| 화면명(영문) | AplyStepInfoPage |
| 경로(설계서) | `src/ui/biz/cm/aplyStepInfo/AplyStepInfoPage.tsx` |
| breadcrumb | 메인 홈 > 고객센터 > 민원서류 발급 신청 > 신청절차 및 안내 |
| 헤더 타이틀 | **신청절차 및 안내** (허브 카드 진입 전용 — 전체메뉴 leaf 아님 → LINKED_MENU_LABELS 미등록) |
| 라우트 | `/support/dcmnt-issu-aply/aply-step-info` (`ROUTES.SUPPORT_APLY_STEP_INFO`) |
| Figma | 전용 프레임 없음 — 내부 안내 페이지 스타일 준수(추가 요청 1) |

---

## 2. 레이아웃 (slide239 1:1)

```
header/2depth (title: 신청절차 및 안내)
─────────────────────────────────────────────
p-4 gap-4
  [실적증명서 신청 절차 및 안내]  SecTitle 19px Bold
    ● (Bold) 국방전자조달 로그인 > 고객센터 > 민원서류발급신청 > 실적증명서 > … > 실적증명 확인 및 신청   ← 절차 플로우
    ● (Reg) 증명원의 사용목적에 따라서 … 실적비율 및 실적금액을 넣을 수 있습니다.
    ● (Reg) 실적증명 확인 후 반드시 신청을 하셔야 … 처리됩니다.
    ● (Reg) 접수번호를 클릭하여 상세정보를 확인합니다.
    ● (Reg) 실적증명서는 상세정보 하단의 발급버튼을 클릭하여 가능합니다.
  [담당부서 및 연락처]  SecTitle 19px Bold
    Table (공통 composites — 추가 요청 2)
      방위사업청 계약            | 1577-1118(①번)
      방위사업청 계약 발급담당자 | 기반전력사업총괄팀 윤준혁 주무관 (☎02-2079-4793)   ← combination(2줄)
                                 | 미래전력사업총괄팀 서정화 주무관 (☎02-2079-4021)
      국방부 및 각 군 계약       | 국방부 및 각 군 계약담당부서
    ● (Reg) 국방부 및 각군에서 발급된 실적증명서는 진본성 정보가 포함 … (PDF 진본성 파일 미검증시 조치 방법)
    ● (Reg) 물품(내자) 납품실적증명서 발급은 방위사업청과 계약한 건에 한해 … 요청하셔야 합니다.
```

### 스타일 (내부 규칙 — Domestic01Page 로컬 조립물 컨벤션)

| 요소 | 클래스 |
|------|--------|
| 섹션 타이틀 | `text-[19px] font-bold text-krds-text-ink` |
| ● 불릿 | `size-[5px] rounded-full bg-krds-text-ink` + 본문 `text-[17px] text-krds-text-ink` (플로우만 Bold) |
| 연락처 표 | 공통 `Table`(label bg-primary-faint / value ink) |

---

## 3. 데이터

- 데이터영역 없음(정적 안내) → 타입/목업/서비스 스텁 없음. 문구는 slide239 원문 그대로 파일 내 상수.
- "PDF 진본성 파일 미검증시 조치 방법"은 설계서에 링크 대상 정의가 없어 텍스트로만 표기.

---

## 4. 배선

- `routes.ts`: `SUPPORT_APLY_STEP_INFO: '/support/dcmnt-issu-aply/aply-step-info'`.
- `router.tsx`: lazy 등록 + `handle: { header:{ variant:'sub', title:'신청절차 및 안내' }, scrollReset:true }`.
- `DcmntIssuAplyPage.tsx`: `aplyStepInfo` 카드 `console.log` 스텁 → `navigate(ROUTES.SUPPORT_APLY_STEP_INFO)` 교체.
- 아이콘: 신규 없음.
