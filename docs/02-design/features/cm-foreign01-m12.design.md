---
template: design
version: 1.0
feature: cm-foreign01-m12
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-foreign01-m12 Design Document

> 국외조달원 등록절차(MUI-CM-05-M12, `Foreign01Page`) 설계. Plan: `docs/01-plan/features/cm-foreign01-m12.plan.md`.
> 핵심: Figma `10020-86658` 정적 안내 페이지. 2섹션 × 번호 카드(뱃지+제목+본문). **신규 공통 0**, 색은 KRDS 토큰. [[cm-preparation01-m07]] 카드 패턴 + [[cm-domestic01-m09]] sub_notice 재사용.

---

## 1. 화면 정의 (설계서 00.공통 v0.83 slide352·360)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-05-M12 |
| 화면명(한글) | 국외조달원 등록절차 |
| 화면명(영문) | Foreign01 Page |
| 경로(설계서) | `src/ui/biz/cm/foreign01/Foreign01Page.tsx` |
| 정의 | 국외조달원 등록절차 정보를 안내한다 |
| breadcrumb | 메인 홈 > 이용안내 > 국외조달안내 > 국외조달원 등록절차 |
| 헤더 타이틀 | **국외조달안내** (요청 6번 — 상위 메뉴명) |
| 라우트 | `/guide/foreign01` (`ROUTES.GUIDE_FOREIGN`) |
| Figma | `10020-86658` (360×1551) |

---

## 2. 레이아웃 (Figma 10020-86658)

```
header/2depth (title: 국외조달안내)
─────────────────────────────────────────────
[블록1] p-4 gap-2
  1. 국외소재상사(제조업, 공급업체)              (섹션 타이틀 19px bold ink)
  ┌카드1 [1] 필요서류 제출 · 필요서류 : (링크)국외조달등록/정보변경안내
  ┌카드2 [2] 신용정보 확인 (D&B사) · 본문 + (gray)정상업체 확인
  └카드3 [3] 등록완료  (뱃지+제목만)
[블록2] p-4 gap-2
  2. 국내소재상사(공급업체, 국외업체의 국내지사, 군수품무역업체(군수품무역중개업체 포함)
  ┌카드1 [1] 조달청 업체 외자업무 등록 · (링크)www.g2b.go.kr · (gray)1일 후 2번단계로 진행
  ┌카드2 [2] 국방전자조달 사용자등록 · (링크)www.d2b.go.kr
  ┌카드3 [3] 보안측정요청(국군방첩사령부) · (링크)www.dcc.mil.kr · (red)신원조사… · (gray)적격판정…
  ┌카드4 [4] 추가정보입력(국방전자조달시스템) · ※안내 2줄 + 각 하위 대시
  └카드5 [5] 등록완료
```

### 색·치수 토큰 매핑 (Figma hex → KRDS)

| Figma | 용도 | 클래스 |
|-------|------|--------|
| `#0f316e` | 번호 뱃지 배경(rounded-4) | `bg-krds-action-primary-active` |
| `#0f316e` | 카드 제목 | `text-krds-text-primary-active` |
| `#c1d1ee` | 카드 보더 | `border-krds-border-field` |
| `#0054e9` | 링크 | `text-krds-text-primary` |
| `#1d1d1d` | 본문 | `text-krds-text-ink` |
| `#425679` | ※ 안내 라인 | `text-krds-text-info` |
| `#717171` | gray sub_notice 노트 | `text-[#717171]` (일회성) |
| `#db083e` | red sub_notice 노트 | `text-[#db083e]` (일회성) |

---

## 3. 컴포넌트 구조 (페이지 내부 로컬 조립물)

- `NumBadge` — 네이비 rounded-[4px] size-8 + 흰 번호(17px bold).
- `GuideCard({ n, title, children? })` — 보더 카드(rounded-12, p-4). 헤더(뱃지+제목 19px bold #0f316e) + 선택 본문(gap-4). children 없으면 등록완료형(헤더만).
- `SubNoticeIcon` — Figma sub_notice 아이콘(인라인 SVG, fill=currentColor). [[cm-domestic01-m09]] 와 동일(로컬 복제).
- `Note({ tone, children })` — sub_notice 마커 + 14px 색(red #db083e / gray #717171). 카드 본문용(pl 없음).
- `InfoLine`(※) — `text-krds-text-info` 17px, ※ 마커(w-5 center) + 텍스트.
- `Dash` — `-` 대시 하위(pl-6, ink).
- `Lnk` — 외부 URL 링크(blue underline, 새 탭).

정적 문구라 목업/서비스 스텁 없음. 링크는 `<a target="_blank" rel="noreferrer">`.

---

## 4. 배선

- `routes.ts`: `GUIDE_FOREIGN: '/guide/foreign01'`.
- `menuLabels.ts`: `[ROUTES.GUIDE_FOREIGN]: '국외조달안내'`.
- `MenuPage.tsx`: `guide-foreign` 라벨 = `LINKED_MENU_LABELS[ROUTES.GUIDE_FOREIGN]`, `MENU_ROUTES['guide-foreign'] = ROUTES.GUIDE_FOREIGN`.
- `router.tsx`: `lazy(Foreign01Page)` + `path: 'guide/foreign01'`, `handle: { header:{ variant:'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_FOREIGN] }, scrollReset:true }`.
- 아이콘: 신규 없음(sub_notice 인라인 SVG, 링크는 텍스트).

---

## 5. 콘텐츠 주의 (Figma 1:1)

- 섹션 타이틀·카드 문구·링크 URL·노트 색을 Figma 그대로. 카드 제목 뒤 "(D&B사)" 앰퍼샌드 포함.
- 국외조달등록/정보변경안내 링크 = `https://www.d2b.go.kr/contents/info/foreign02.do?key=519`(카드4 하위는 `#link01`).
- 섹션2 타이틀은 Figma 원문 그대로(괄호 불균형도 설계서 준수).
