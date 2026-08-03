# 금융인증서 (MUI-CM-03-P11) 바텀시트 → 페이지 전환 — plan

> PDCA: Plan(본 문서) → Do → Check(lint/tsc) → Act(주석·문서 동기화)
> 상태: **Do·Check 완료(2026-08-03)**

## 요청 (2026-08-03)

- 로그인 > 금융인증서: 기존 바텀시트로 열리던 것을 **페이지로 변경**, 바텀시트는 삭제.
- 설계서: 00.공통 MUI-CM-03-P11 · Figma `5M6FlyQBdHgeNrgIG2XhIN` node `10020:87143`.

## 현황 판정

- 페이지·라우트 **기 존재**: `cm/fnstCert/FnstCertPage`(Figma 10020:87143 기준 구현) +
  `/login/finance-cert`(sub 헤더 '금융인증서'). 영문 화면명 `FnstCert` 는 서비스 주석
  (services/auth "금융인증서 — MUI-CM-03-P11 (fnstCert/FnstCertPage)")과 일치 — 신규 생성 불필요.
- 로그인 방식 선택(`MainLoginPage`)의 `financeCert` 카드만 `sheet: true` 로 바텀시트를 열고 있었음.

## 요청서 boilerplate 판정 (memory/page-request-boilerplate)

- "검색필터 페이지와 바텀시트 제작" → **해당 없음.** P11 은 본인확인 입력 폼(아이디/휴대폰/생년월일)
  화면으로 설계서에 검색조건·데이터영역 목록이 없다.

## Do

1. `MainLoginPage`: `financeCert` 의 `sheet: true` 제거 → 카드 클릭 시 `/login/finance-cert` 페이지 이동.
2. `MainLoginPage`: 금융인증서 `BottomSheet` 블록·`FnstCert` import 제거(간편/공동/모바일신분증 시트는 유지).
3. `FnstCertPage.tsx` 주석 동기화 — "BottomSheet 콘텐츠 공용" 문구 → 페이지 전용.

## 참고

- 시트 흐름의 `onSuccess`(인증 성공 → 홈)는 페이지 흐름에선 금융인증 SDK 경계 스텁 그대로
  (문자인증 요청 console.log) — SDK 연동 시 성공 후 이동을 페이지에서 처리.
