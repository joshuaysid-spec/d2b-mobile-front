---
template: design
version: 1.0
feature: cm-preparation01-m07
date: 2026-07-14
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# cm-preparation01-m07 Design Document

> 사전준비사항(MUI-CM-05-M07, `Preparation01Page`) 설계. Plan: `docs/01-plan/features/cm-preparation01-m07.plan.md`.
> 핵심: Figma `10020-86138` 정적 안내 페이지. 번호 카드 3 + "업체 추가 정보 등록" 블록. **신규 공통 컴포넌트/시트 0**, 색은 전부 KRDS 토큰.

---

## 1. 화면 정의 (설계서 00.공통 v0.83 slide352·355)

| 항목 | 값 |
|------|----|
| 화면 ID | MUI-CM-05-M07 |
| 화면명(한글) | 사전준비사항 |
| 화면명(영문) | Preparation01 Page |
| 경로(설계서) | `src/ui/biz/cm/preparation01/Preparation01Page.tsx` |
| 정의 | 사전준비사항 정보를 안내한다 |
| breadcrumb | 메인 홈 > 이용안내 > 조달사전준비안내 > 사전준비사항 |
| 헤더 타이틀 | **조달사전준비안내** (요청 6번 — 상위 메뉴명 사용) |
| 라우트 | `/guide/preparation01` (`ROUTES.GUIDE_PREPARATION`) |
| Figma | `10020-86138` |
| UC | UC-ZZ-18-03 |

---

## 2. 레이아웃 (Figma 10020-86138)

```
header/2depth (전역 AppLayout Header, variant:'sub', title:'조달사전준비안내')
─────────────────────────────────────────────
[블록 A] p-4, gap-2  — 번호 카드 3개
  ┌ 카드(rounded-12, border krds-border-field, p-4, gap-4)
  │  [뱃지 1] 인증서 신청/발급
  │  1. 국방전자조달시스템 …
  │  2. 공동인증서 발급사업자
  │     - 한국정보인증(주) / http://www.d2b.signra.com / ☎ 1566-0566
  │     - 한국전자인증(주) / http://www.crosscert.com / ☎ 1566-0566
  │     - 금융결제원 / http://www.yessign.or.kr / ☎ 1577-5500
  │     - Tradesign / http://www.tradesign.net / ☎ 1577-5500
  │     - 한국정보인증(주) / http://www.signkorea.com / ☎ 1577-7337
  ├ 카드 [뱃지 2] 업체등록 …
  └ 카드 [뱃지 3] 사용자 등록 …
[블록 B] p-4, gap-2  — "업체 추가 정보 등록" (카드 아님, 제목 + 리스트)
```

### 색·치수 토큰 매핑 (Figma hex → KRDS 클래스)

| Figma | 용도 | 클래스 |
|-------|------|--------|
| `#0f316e` | 번호 뱃지 배경 | `bg-krds-action-primary-active` |
| `#0f316e` | 섹션 제목 텍스트 | `text-krds-text-primary-active` |
| `#c1d1ee` | 카드 보더 | `border-krds-border-field` |
| `#0054e9` | 외부 링크 텍스트 | `text-krds-text-primary` |
| `#1d1d1d` | 본문 텍스트 | `text-krds-text-ink` |
| radius 12 / 4 | 카드 / 뱃지 | `rounded-[12px]` / `rounded-[4px]` |
| 폰트 19/17/14 | 제목 / 본문 / 대시마커 | `text-[19px]`/`text-[17px]`/`text-[14px]` (IntroducePage 선례) |

---

## 3. 컴포넌트 구조 (페이지 내부 로컬 조립물)

- `GuideCard({ n, title, children })` — 번호 뱃지 + 제목 + 본문. 카드 3개 공용.
- `NumItem({ n, children })` — `N.` 시작 항목(들여쓰기 기준선).
- `DashItem({ children })` — `-` 대시 하위 항목(pl-6).
- `LinkItem({ href })` — 외부 링크(pl-9, 새 탭, blue underline).
- `PhoneItem({ tel })` — `<Icon name="Call">` + 번호(pl-9).
- `BulletItem({ children })` — 채움 원형 불릿(하단 블록 전용).

정적 문구라 목업 상수/서비스 스텁 없음. 링크 클릭 = 실제 `<a target="_blank" rel="noreferrer">`, 전화는 텍스트 표시(호출 액션 없음, Figma 동일).

---

## 4. 배선

- `routes.ts`: `GUIDE_PREPARATION: '/guide/preparation01'`.
- `menuLabels.ts`: `[ROUTES.GUIDE_PREPARATION]: '조달사전준비안내'`.
- `MenuPage.tsx`: `guide-prep` 라벨 = `LINKED_MENU_LABELS[ROUTES.GUIDE_PREPARATION]`, `MENU_ROUTES['guide-prep'] = ROUTES.GUIDE_PREPARATION`.
- `router.tsx`: `lazy(Preparation01Page)` + `path: 'guide/preparation01'`, `handle: { header: { variant:'sub', title: LINKED_MENU_LABELS[ROUTES.GUIDE_PREPARATION] }, scrollReset: true }`. `showBottomNav` 생략(3뎁스 안내 화면).
- `Icon.tsx`: `Call: 'call'` (알파벳 순서 — CalendarToday 다음).

---

## 5. 콘텐츠 (Figma 1:1)

**카드1 인증서 신청/발급** — (위 레이아웃 참조)
**카드2 업체등록**
1. 나라장터 국가종합전자조달 (www.g2b.go.kr) 에 업체 등록을 해야합니다.
   - 등록 대상업체 : 내자업체, 시설업체, 국내상사 (무역대리점)
   - 등록방법 : 인터넷으로 국가종합전자조달(www.g2b.go.kr)에 접속하여 등록을 신청하면 됩니다.
   - 유의사항 : 업체등록 승인일 다음날 국방전자조달시스템에 전송되므로 마감일 3일전까지 업체등록 및 승인을 마쳐야 합니다.
2. 문의 전화번호
   - 나라장터 국가종합전자조달 콜센터 : 1588-0800

**카드3 사용자 등록**
1. 등록 대상자
   - 전자입찰, 전자계약, 대금청구등 국방조달업무 이용자
2. 등록 방법
   - 대표자 : 나라장터 국가종합전자조달에 대표자 등록 후 사용자 등록
   - 입찰대리인 : 나라장터 국가종합전자조달에 입찰대리인 등록 후 사용자 등록 후 대표자승인
   - 일반사용자 : 사용자 등록 후 대표자 승인

**블록B 업체 추가 정보 등록**
1. (bold) 나라장터 국가종합전자조달에 업체등록 후 국방전자조달시스템에서 업체정보를 확인하고, 필요한 추가정보를 반드시 등록해야 합니다.
- ● 나라장터 국가종합전자조달에 등록한 업체정보는 다음날 국방전자조달시스템에 전송되므로 업체정보 확인 및 추가정보 등록이 가능합니다.
- ● 원활한 국방전자조달시스템 이용을 위해서는 마감 3일전까지 업체등록 및 추가정보 등록을 마쳐야 합니다.
- ● 국방전자조달시스템에 등록할 추가 정보(예시)
  - 국내조달업체 : 품목코드 등재 등
  - 국외조달(무역대리점) : 해외 관련 업체 등
