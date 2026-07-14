---
template: design
version: 1.0
feature: cm-site-m15
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-site-m15 Design Document

> 관련사이트(MUI-CM-05-M15, `SitePage`) 설계. Plan: `docs/01-plan/features/cm-site-m15.plan.md`.
> 핵심: Figma `10020-85148` 정적 링크 안내 페이지. 9개 그룹 × 네비게이션 리스트 + 만족도평가. **신규 공통 0**, 색은 KRDS 토큰. [[cm-preparation01-m07]] 계열.

---

## 1. 화면 정의 (설계서 00.공통 v0.83 slide352·363)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-05-M15 |
| 화면명(한글) | 관련사이트 |
| 화면명(영문) | Site Page |
| 경로(설계서) | `src/ui/biz/cm/site/SitePage.tsx` |
| 정의 | 관련사이트 정보를 안내한다 |
| breadcrumb | 메인 홈 > 이용안내 > 관련사이트 |
| 헤더 타이틀 | **관련사이트** (요청 5번 — 상위 메뉴명과 동일) |
| 라우트 | `/guide/site` (`ROUTES.GUIDE_SITE`) |
| Figma | `10020-85148` (360×5624) |

---

## 2. 레이아웃 (Figma 10020-85148)

```
header/2depth (title: 관련사이트)
─────────────────────────────────────────────
[그룹 반복] p-4 gap-2
  <그룹 제목>  (19px bold ink)
  ┌ 리스트(border-t divider)
  │  <a> 사이트명(Medium 19px ink, truncate)  ……  chevron(arrow_forward_ios 20px, muted)   (border-b divider)
  │  … (그룹별 N개)
  └
그룹: 방위사업청(5) · 국방 관련 사이트(8) · 전자조달 시스템 (타기관)(23) · 조달 관련 사이트(7)
     · 공인인증 사이트(5) · 중소 / 여성 / 장애인 기업(6) · 전자보증서 발급기관(10) · 신용정보회사(8) · 기타(4)
[만족도평가]  SatisfactionSurvey (재사용)
```

### 색·치수 토큰 매핑 (Figma hex → KRDS)

| Figma | 용도 | 클래스 |
|-------|------|--------|
| `#1d1d1d` | 그룹 제목 / 사이트명 | `text-krds-text-ink` |
| `#d1d7e0` | divider(항목 구분선) | `border-krds-border-divider` |
| chevron | 우측 이동 표시 | `Icon name="ArrowForwardIos"` (`text-krds-text-muted`) |
| 항목 높이 | min-h-56 / py-10 | `min-h-14 py-2.5` |

---

## 3. 컴포넌트 구조 (페이지 내부 로컬 조립물 + 재사용)

**재사용:** `SatisfactionSurvey`(이용안내/소개 공통 하단 설문) · `Icon`.

**로컬 조립물:**
- `NavItem({ name, href })` — `<a target="_blank">`(사이트명 truncate) + `ArrowForwardIos` chevron. 하단 border-divider.
- `SiteGroup({ title, items })` — 그룹 제목 + 리스트(상단 border-t + 항목별 border-b).
- `SITE_GROUPS` — 9개 그룹 × 링크 데이터 상수(Figma 사이트명·URL 그대로).

정적 링크라 목업/서비스 스텁 없음. 클릭 시 외부 새 탭 이동.

---

## 4. 배선

- `routes.ts`: `GUIDE_SITE: '/guide/site'`.
- `menuLabels.ts`: `[ROUTES.GUIDE_SITE]: '관련사이트'`.
- `MenuPage.tsx`: `guide-related-site` 라벨 = `LINKED_MENU_LABELS[ROUTES.GUIDE_SITE]`, `MENU_ROUTES['guide-related-site'] = ROUTES.GUIDE_SITE`.
- `router.tsx`: `lazy(SitePage)` + `path: 'guide/site'`, `handle: { header:{ variant:'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_SITE] }, scrollReset:true }`.
- 아이콘: 신규 없음(`ArrowForwardIos` 기존 REGISTRY).

---

## 5. 콘텐츠 주의 (Figma 1:1)

- 9개 그룹·76개 사이트명·URL 을 Figma 그대로. 사이트명은 원문 유지.
- 방위사업청 > 통합사업관리정보체계 href 는 Figma 오타(`hhttps://…`) → `https://vpn.dapa.go.kr/` 로 교정.
- 전자보증서 발급기관·신용정보회사 그룹은 Figma 상 중간 `m_section divider`(5개 후)로 서브그룹 구분 — 각 항목이 이미 divider 로 구분되므로 연속 리스트로 렌더(시각 차 미미).
