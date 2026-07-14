---
template: design
version: 1.0
feature: cm-app-stng-ms02-m01
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-app-stng-ms02-m01 Design Document

> 설정(MUI-MS-02-M01, `AppStngPage`) 설계. Plan: `docs/01-plan/features/cm-app-stng-ms02-m01.plan.md`.
> 핵심: Figma `10020-87979`. 3섹션(알림 설정·앱 설정·약관) + 앱 캐시 삭제 확인 팝업(AlertModal). **신규 공통 0**, `Switch`/`AlertModal` 재사용.

---

## 1. 화면 정의 (설계서 00.공통 v0.83 slide365·368)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-MS-02-M01 (+ 팝업 MUI-MS-02-P02) |
| 화면명(한글) | 설정 (+ 앱 캐시 삭제) |
| 화면명(영문) | AppStng (+ AppCashDel) |
| 경로(설계서) | `src/ui/biz/ms/appStng/AppStngPage.tsx` → **레포 컨벤션상 `cm/appStng`** |
| 정의 | 앱 설정 정보를 안내한다 |
| breadcrumb | 메인 홈 > 설정 |
| 헤더 타이틀 | **설정** (요청 5번의 "관련사이트"는 오기) |
| 라우트 | `/settings` (`ROUTES.SETTINGS`) |
| Figma | `10020-87979`(설정) · `10020-88049`(캐시삭제 팝업) |

---

## 2. 레이아웃 (Figma 10020-87979)

```
header/2depth (title: 설정)
─────────────────────────────────────────────
[알림 설정] (24px bold)
  앱 푸시 알림(19px bold) ──── [Switch ON]
  모바일 앱으로 알림 (muted)
  ┌카드  🔔 알림 서비스 신청 및 해지            →
[앱 설정] (24px bold)
  ┌카드
  │  📱 앱 권한 설정                            →
  │  ────────────────
  │  📱 앱 버전정보                    v1.0.1  ⌃  (아코디언, 기본 펼침)
  │     └ [bg-blue-pastel 박스] 현재 앱 버전=V 1.0.1 / 내 기기 정보=iPhone 16.2 / 내 기기 OS=ios
  │  ────────────────
  │  📱 앱 캐시 삭제                            →  (클릭 → 확인 팝업)
[약관] (24px bold)
  ┌카드  📄 개인정보처리방침  →  ──  📄 저작권 정책  →   (외부 브라우저 링크)

[앱 캐시 삭제 팝업]  AlertModal — "앱 캐시 삭제" / "앱에 임시 보관된 캐시를 삭제할까요?" / [취소][삭제]
```

### 색·치수 토큰 매핑 (Figma hex → KRDS)

| Figma | 용도 | 클래스 |
|-------|------|--------|
| `#1d1d1d` | 제목/라벨 | `text-krds-text-ink` |
| `#555` | 부제/버전 info 텍스트 | `text-krds-text-muted` |
| `#d1d7e0` | 카드 보더/행 구분선 | `border-krds-border-divider` / `bg-krds-border-divider` |
| `#f5f9ff` | 버전정보 박스 배경 | `bg-krds-bg-blue-pastel` |
| `#0f316e` | 버전 값(v1.0.1) | `text-krds-text-primary-active` |
| `#0054e9` | 토글 ON 트랙 | `Switch`(기본 checked = bg-primary) |
| shadow | 카드 그림자 | `shadow-[0_0_5px_rgba(23,43,77,0.1)]` |

---

## 3. 컴포넌트 구조 (재사용 + 페이지 내부 조립물)

**재사용:** `Switch`(푸시 토글) · `AlertModal`(캐시삭제 확인) · `Icon`.

**로컬 조립물:**
- `SectionTitle` — 24px bold 섹션 제목.
- `SettingCard` — 흰 배경 + border-divider + 미세 그림자 카드.
- `SettingRow({ icon, label, onClick })` — 아이콘 + 라벨(17px bold) + `TrendingFlat`(→) 이동 화살표.
- `RowDivider` — 카드 내부 행 구분선.
- `AppVersionAccordion` — 버전정보 아코디언(로컬 useState 디스클로저; base Accordion 은 h-56/19px 고정이라 이 카드 행 스타일과 상충 → 로컬 처리). 펼침 시 `bg-blue-pastel` 박스 + 3 info 행.

아이콘: `NotificationsActive`(알림) · `Smartphone`(앱 관련, 신규 추가) · `Description`(약관) · `TrendingFlat`(이동) · `ExpandMore`(펼침 회전).

정적 안내 + 로컬 상태(토글/아코디언). 네이티브 연동(권한/캐시)·알림설정 이동은 `console.log` 스텁.

---

## 4. 배선

- `routes.ts`: `SETTINGS: '/settings'`.
- `MenuPage.tsx`: '설정' 퀵아이콘 onClick → `onOpenChange(false)` + `navigate(ROUTES.SETTINGS)`.
- `router.tsx`: `lazy(AppStngPage)` + `path: 'settings'`, `handle: { header:{ variant:'sub', title:'설정' }, scrollReset:true }`(showBottomNav 생략).
- `Icon.tsx`: `Smartphone: 'smartphone'` 추가.

---

## 5. 팝업 (MUI-MS-02-P02 앱 캐시 삭제)

- `AlertModal`(변형 none) 인라인 — title "앱 캐시 삭제", description "앱에 임시 보관된 캐시를 삭제할까요?", secondary "취소", primary "삭제".
- 삭제 클릭 = `console.log` 스텁(추후 네이티브 캐시 삭제 브릿지) 후 닫힘. Figma 팝업의 X/좌측정렬 크롬은 AlertModal(중앙정렬)과 소폭 차이 — 공통 컴포넌트 재사용 우선(필요 시 전용 다이얼로그로 정합 가능).
