# 공동인증서 (MUI-CM-03-P12) 바텀시트 → 페이지 전환 — plan

> PDCA: Plan(본 문서) → Do → Check(lint/tsc) → Act(주석 동기화)
> 상태: **Do·Check 완료(2026-08-03)** — 금융인증서(cm-fnst-cert-p11-page)와 동일 전환.

## 요청 (2026-08-03)

- 로그인 > 공동인증서: 바텀시트 → **페이지 전환**, 바텀시트 삭제.
- 설계서: 00.공통 MUI-CM-03-P12 · Figma `5M6FlyQBdHgeNrgIG2XhIN` node `10020:87163`.

## 현황 판정

- 페이지·라우트 **기 존재**: `cm/jntCert/JntCertPage` + `/login/joint-cert`(sub 헤더 '공동인증서').
  영문 화면명 `JntCert` 는 설계서 매핑과 일치 — 신규 생성 불필요.
- `MainLoginPage` 의 `jointCert` 카드만 `sheet: true` 로 시트를 열고 있었음.

## 요청서 boilerplate 판정

- "검색필터 페이지와 바텀시트 제작" → **해당 없음.** P12 는 인증 솔루션 진입 화면(입력/검색조건 없음).

## Do

1. `MainLoginPage`: `jointCert` 의 `sheet: true` 제거 → 페이지 이동. 공동인증서 시트 블록·import 삭제.
2. `JntCert` 콘텐츠를 Figma(10020:87163) 정형으로 정합 — 아이디찾기 결과(IdRsltPage)와 동일:
   - 배지: 80px 흰 배경 + #c1d1ee 1.33px 보더 + radius 27 + 파란 점 데코 + **공동인증서 원본 SVG
     (jntCertIcon.svg) 50px** (구: faint 배경 + VerifiedUser 근사 → 원본 에셋으로 교체, TODO 해소)
   - 타이틀 24px Bold · 안내 카드 bg-primary-faint/radius 8/p 20 + Error(원형 !) + 17 Medium ink
   - CTA '인증서 가져오기' 화면 최하단(min-h-full flex), 기본 높이 48
3. `JntCertPage` 래퍼: 이중 패딩 제거(px-16 만, min-h-full) — 금융인증서 페이지와 동일 수정.
