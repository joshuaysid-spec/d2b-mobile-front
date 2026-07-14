---
template: design
version: 1.0
feature: cm-domestic01-m09
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-domestic01-m09 Design Document

> 국방조달참여절차(MUI-CM-05-M09, `Domestic01Page`) 설계. Plan: `docs/01-plan/features/cm-domestic01-m09.plan.md`.
> 핵심: Figma `10020-86472` 정적 안내 페이지. 절차 다이어그램 + 방법(1~5) 리스트 + 안내 `Infobox`. **신규 공통 0**, 색은 KRDS 토큰. [[cm-preparation01-m07]] 계열.

---

## 1. 화면 정의 (설계서 00.공통 v0.83 slide352·357)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-05-M09 |
| 화면명(한글) | 국방조달참여절차 |
| 화면명(영문) | Domestic01 Page |
| 경로(설계서) | `src/ui/biz/cm/domestic01/Domestic01Page.tsx` |
| 정의 | 국내조달 참여절차 정보를 안내한다 |
| breadcrumb | 메인 홈 > 이용안내 > 국내조달안내 > 국방조달참여절차 |
| 헤더 타이틀 | **국내조달안내** (요청 6번 — 상위 메뉴명) |
| 라우트 | `/guide/domestic01` (`ROUTES.GUIDE_DOMESTIC`) |
| Figma | `10020-86472` (360×6836) |

---

## 2. 레이아웃 (Figma 10020-86472)

```
header/2depth (AppLayout Header, variant:'sub', title:'국내조달안내')
─────────────────────────────────────────────
[절차] (섹션타이틀)  — 플로우차트 다이어그램(카드+화살표+노란 pill+네이비 목표박스)
   ┌ 카드1: 뱃지1 · 조달청 나라장터 업체등록 · www.g2b.go.kr↗
   ┌ 카드2: 뱃지2 · 국방 전자조달 사용자등록
   좌: (중앙조달)↓ → 품목등록(3년주기 갱신등록) → (중앙조달)↓
   우: (부대조달, 시설공사)↓
   ▼ 입찰참가 (네이비 박스 · folder 아이콘)

[방법] (섹션타이틀)
   방위사업청 및 각 부대의 입찰에 참여하기 위한 [업체등록] 절차는 아래와 같습니다.
   1. 아래 전자서명인증사업자에서 인증서를 발급받은 후
      ● 조달청 나라장터(www.d2b.go.kr, Tel : 1588-0800)에서 업체등록을 하셔야 합니다
      [인증사업자 카드 5개] (회사명·전화·홈페이지 — 로고는 에셋 미보유로 생략)
   2. 조달청의 나라장터 업체등록하신 후
   3. 중앙조달(방위사업청)입찰에 참여하실 경우
   4. 업체등록 및 변경 시 유의사항
   5. 입찰참가 (물품/공사/용역)  — 경쟁입찰/공개수의 진행순서 + 안내 Infobox 3종
```

### 색·치수 토큰 매핑 (Figma hex → KRDS 클래스)

| Figma | 용도 | 클래스 |
|-------|------|--------|
| `#0f316e` | 뱃지 배경 / 네이비 목표박스 / 섹션 강조 | `bg-krds-action-primary-active` |
| `#0f316e` | 섹션 강조 텍스트 / 연결선 | `text-krds-text-primary-active` |
| `#c1d1ee` | 카드 보더 | `border-krds-border-field` |
| `#ecf1fa` | 품목등록 박스 배경 / Infobox 배경 | `bg-krds-bg-primary-faint` |
| `#ffe567` | 절차 노란 pill (IntroducePage 선례) | `bg-[#ffe567]` (일회성 다이어그램 색) |
| `#0054e9` | 외부 링크 | `text-krds-text-primary` |
| `#1d1d1d` | 본문 | `text-krds-text-ink` |
| `gray-70` | 캐비엇/노트(muted) | `text-krds-text-muted` |

---

## 3. 컴포넌트 구조 (페이지 내부 로컬 조립물 + 재사용)

**재사용:** `Infobox`(안내 박스, `collapsible={false}` static) · `Icon`.

**로컬 조립물:**
- `SecTitle` — 절차/방법 섹션 타이틀(19px bold ink).
- `NumTitle` — 1~5 번호 헤더(17px bold ink, "N." 접두).
- `Bullet` — ● 채움 불릿(17px, bold 옵션).
- `Dash` — `-` 대시 하위(level 1=pl-6 / level 2=pl-12).
- `Note` — 캐비엇/결론 노트(muted, 작은 마커). Figma 의 손 모양 마커는 에셋 미보유 → muted 스타일로 근사.
- `Lnk` — 외부 URL 링크(blue underline, 새 탭).
- `PhoneBadge` — 어두운 원형 뱃지 + 흰 채움 `Call` (M07 PhoneItem 동일).
- `CertCard` — 인증사업자 카드(faint bg, 회사명·PhoneBadge·Lnk). 로고 생략.
- 절차 다이어그램: `FlowCard`(뱃지+타이틀+링크) · `Pill`(노란) · `Arrow`(연결선+arrowhead) · `FaintBox`(품목등록) · `GoalBox`(입찰참가, folder).

정적 문구라 목업 상수/서비스 스텁 없음. URL 은 `<a target="_blank" rel="noreferrer">`.

---

## 4. 배선

- `routes.ts`: `GUIDE_DOMESTIC: '/guide/domestic01'`.
- `menuLabels.ts`: `[ROUTES.GUIDE_DOMESTIC]: '국내조달안내'`.
- `MenuPage.tsx`: `guide-domestic` 라벨 = `LINKED_MENU_LABELS[ROUTES.GUIDE_DOMESTIC]`, `MENU_ROUTES['guide-domestic'] = ROUTES.GUIDE_DOMESTIC`.
- `router.tsx`: `lazy(Domestic01Page)` + `path: 'guide/domestic01'`, `handle: { header:{ variant:'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_DOMESTIC] }, scrollReset:true }`.
- `Icon.tsx`: `Folder`(입찰참가), `OpenInNew`(외부링크). (`Call` 은 M07).

---

## 5. 콘텐츠 (Figma 1:1 — 발췌, 전체는 페이지 내 상수)

**인증사업자 카드 5** — 한국무역정보통신(☎1566-2119, www.tradesign.net) · 한국전자인증(☎1566-0566, www.crosscert.com) · 한국정보인증(☎1577-8787, www.signgate.com) · (주)코스콤 인증센터(☎1577-7337, www.signkorea.com) · 금융결재원 전자인증센터(☎1577-5500, www.yessign.or.kr).

**섹션 3(품목등록)·4(유의사항)·5(입찰참가)** 는 ● 불릿 + `-` 대시(2단) + 캐비엇 노트로 구성. 섹션 5 는 경쟁입찰/공개수의 진행순서 각각에 "입찰참가신청서 작성시 유의사항 / 전자보증서 제출방법 / 입찰참가신청 진행상태 설명" 3개 `Infobox`(static) 포함.
