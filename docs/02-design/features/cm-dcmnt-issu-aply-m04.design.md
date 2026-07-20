---
template: design
version: 1.0
feature: cm-dcmnt-issu-aply-m04
date: 2026-07-20
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-dcmnt-issu-aply-m04 Design Document

> 민원서류발급신청(MUI-CM-04-M04, `DcmntIssuAplyPage`) 설계. Plan: `docs/01-plan/features/cm-dcmnt-issu-aply-m04.plan.md`.
> 핵심: 업체정보 아코디언(dm_bzentyInfo 재사용) + 바로가기 카드 5개(Figma M13 카드 버튼, 선행 아이콘 제외). **신규 공통 0**.

---

## 1. 화면 정의 (설계서 00.공통 v0.84 slide238)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-04-M04 (2026-07-13 화면 추가 — 하위 화면 진입점) |
| 화면명(한글) | 민원서류발급신청 |
| 화면명(영문) | DcmntIssuAplyPage |
| 경로 | `src/ui/biz/cm/dcmntIssuAply/DcmntIssuAplyPage.tsx` |
| 정의 | 민원서류 발급 신청 메뉴 화면 |
| breadcrumb | 메인 홈 > 고객센터 > 민원서류발급신청 |
| 헤더 타이틀 | **민원서류발급신청** (요청서 5번 "관련사이트"는 M15 잔여 boilerplate — 미적용) |
| 라우트 | `/support/dcmnt-issu-aply` (`ROUTES.SUPPORT_DCMNT_ISSU_APLY`) |
| Figma | `10020-87972` (MUI-CM-04-M13 인증센터 — 카드 버튼 스타일 참조. M04 전용 프레임 없음) |

---

## 2. 레이아웃

```
header/2depth (title: 민원서류발급신청)
─────────────────────────────────────────────
[업체정보] Accordion(single, 기본 열림)
  AccordionSection value="bzentyInfo" title="업체정보" variant="blue"
    Table rows = dm_bzentyInfo 6항목 (label/value)
[바로가기] px-16 py-20 gap-16  ← Figma 10020-87975 m_button_
  ┌ 카드 버튼 ×5 — h-74 · rounded-12 · border divider · shadow-krds-card
  │   라벨(19px Bold ink, 좌) + TrendingFlat 20px(우)   ※ 선행 아이콘 없음(추가 요청 2)
  └ 신청 절차 및 안내 / 실적 증명서 신청 목록 / 실적 증명서 신청
     / 국외 조달원 등록증 신청 목록 / 국외 조달원 등록증 신청
```

### 색·치수 토큰 매핑 (Figma m_button_ → KRDS, CertMngPage 와 동일)

| Figma | 용도 | 클래스 |
|-------|------|--------|
| `#1d1d1d` 19px Bold | 카드 라벨 | `text-[19px] font-bold text-krds-text-ink` |
| `#d1d7e0` border | 카드 테두리 | `border-krds-border-divider` |
| radius 12 / h 74 | 카드 | `rounded-[12px] h-[74px]` |
| drop-shadow(23,43,77,0.1) | 카드 그림자 | `shadow-krds-card` |
| trending_flat 20px | 이동 화살표 | `Icon name="TrendingFlat"` |

---

## 3. 데이터 (설계서 slide191 dm_bzentyInfo — MUI-CM-02-M01 재사용)

| 항목명(한글) | 항목명(영문) | 속성 | 목업값(slide238 그대로) |
|--------------|--------------|------|--------------------------|
| 업체명 | `bzentyNm` | R/Y/100 | 주식회사 국방전자조달 |
| 사업자등록번호 | `brno` | R/Y/10 | 123-45-67890 |
| 업체코드 | `bzentyCd` | R/Y/5 | 7004F |
| 대표자명 | `rprsvNm` | R/Y/100 | 홍길동 |
| 등록일 | `bzentyRgstrtYmd` | R/Y/8 | 2026-02-02 |
| 법인등록번호 | `crno` | R/N/13 | 123456-7890123 |

- 타입: `src/types/cm.ts` 에 `BzentyInfo` 섹션 추가(도메인당 1파일 — 파일 신설 X). CM-02-M01 구현 시 공유.
- 검색조건/데이터영역(목록) 없음 → **검색필터·바텀시트 미생성**(요청서 1·2번 해당 없음).

---

## 4. 바로가기 (slide238 — 클릭 시 해당 화면 이동, 전부 미구현 → 스텁)

| 라벨 | 대상 화면 | 스텁 |
|------|-----------|------|
| 신청 절차 및 안내 | MUI-CM-04-M05 `AplyStepInfoPage` | `console.log` + `// 추후: navigate` |
| 실적 증명서 신청 목록 | MUI-CM-04-M06 `PrfmncPrdocPage` | 〃 |
| 실적 증명서 신청 | MUI-CM-04-M08 (실적증명서 신청 플로우) | 〃 |
| 국외 조달원 등록증 신청 목록 | MUI-CM-04-M09(=화면목록 M21) `OvsSosCnfdocListPage` | 〃 |
| 국외 조달원 등록증 신청 | MUI-CM-04-P10(=화면목록 P22) `OvsSosCnfdocReg` | 〃 |

---

## 5. 배선

- `routes.ts`: `SUPPORT_DCMNT_ISSU_APLY: '/support/dcmnt-issu-aply'`.
- `menuLabels.ts`: `[ROUTES.SUPPORT_DCMNT_ISSU_APLY]: '민원서류발급신청'`.
- `MenuPage.tsx`: `support-civil-doc` 라벨 = `LINKED_MENU_LABELS[...]`, `MENU_ROUTES['support-civil-doc']` 연결.
- `router.tsx`: lazy 등록 + `handle: { header:{ variant:'sub', title: LINKED_MENU_LABELS[...] }, scrollReset:true }`.
- 아이콘: 신규 없음(`TrendingFlat` 기존 REGISTRY).
