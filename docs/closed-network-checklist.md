# 폐쇄망 반입 전 체크리스트

> 반입(폐쇄망 이관) **직전에** 이 문서를 열어 아래 항목을 확인한다. 항목이 해소되면 체크하고,
> 새로 발견된 반입 전 확인 사항은 여기에 추가한다. (갱신: 2026-07-10)

## 1. 미구현 잔여 화면

- [ ] **이행/적격심사 심사결과 — 업무유형별 변형 (MUI-BD-10-M05~M20, 15~16종)**
  - 현재 심사결과 탭(`src/ui/biz/bd/bidRsltDtl/Implt.tsx`)이 **물품(M04) 심사항목 표 하나로만** 렌더됨.
  - 용역(M05) · 10억원미만물품 계열(M06~M12, 중기청/제조/구매/연도별) · 고시금액 계열(M13~M15) ·
    공사(M16) · 기술용역(M17) · 3억원미만공사(M18) · 고시금액미만용역(M19) · 폐기물용역(M20) 의
    심사항목 라벨/키 세트를 설계서(v1.83 통합, slide169 이후 데이터영역)에서 추출해
    **유형값으로 표 데이터를 분기**해야 함. (새 페이지/탭 아님 — 구조 동일, 데이터 세트만 추가)
  - 근거: v1.83 통합 설계서 화면 목록 152건 전수 대조(2026-07-10) 결과 유일한 실질 공백.

## 2. 결정 대기 항목

- [ ] **화면ID 채번**: 연관 진행 목록(`cm/anlPrgrsList`, `/anl-prgrs`) — 설계서 미정의 화면(PC 동선 준용).
  기획 채번 확정 시 폴더/파일명 교체. (상세: `docs/02-design/features/anl-prgrs-list.design.md`)
- [ ] **잔존 화면 삭제 여부**: 국외 보관함 상세(`bd/ovsLockerPbanDtl`, `/bd/ovs/locker/:id`) —
  260706 개정에서 설계서에서 삭제됐으나 코드/라우트 잔존. 유지/삭제 결정 필요.
- [ ] **임시 영문키 교체**: 설계서 데이터영역 미정의로 임시 승인된 항목명들 — 상세설계 확정 시 교체.
  - `OvsLockerPbanItem.tmprBidCnStts` / `bidPrtcpAplyStts` (보관함 카드 상태 버튼 구동)
  - `BidPrgrsItem` 진행 상태값(apfrStatNm/tndrStatNm 등) · `bidPrcSysNm`/`ctrtMthdNm` 등
  - 각 위치는 `src/types/bd.ts` 의 "설계서 데이터영역 미정의 임시 항목" 블록 주석 참조.

## 3. 폐쇄망 환경 확인 (반입 산출물)

- [ ] **폰트 self-host** — CDN `@import url(구글폰트)` 금지. Material Symbols woff2 가
  `public/fonts/` 에 포함되고 dist 에 복사되는지 확인. (상세: `docs/closed-network-fonts.md`)
- [ ] **외부 네트워크 의존 없음** — 코드/스타일에 CDN·외부 URL fetch 없는지 확인
  (Figma 데이터·구글폰트 등은 개발 환경 전용).
- [ ] **빌드 검증** — `npm run lint && npm run build` 통과, chunk size 경고(600KB) 없는지 확인.

## 4. API 연동 경계 (반입 후 백엔드 연동 시작점)

- 모든 목록/상세는 **페이지 내 목업 + `// 추후 API: xxxService.yyy` 주석**으로 경계 표시됨.
  반입 후 연동 시 각 페이지의 목업 블록(`MOCK_*`, `dl_*`/`dlt_*` 상수)을 통째로 교체.
- 연관 진행 목록(`AnlPrgrsListPage`)의 `MOCK_ANL_ITEMS` 는 연관 건 조회 API(기준 `rfrncNo` + 세부단계)로 교체.
- 일부 상세의 진행단계(`prgrsStg`)가 고정값(사전규격·국외조달계획 `'조달'`, 국외입찰서·이행 `'입찰'`) —
  상세 조회 응답의 진행단계로 교체.

## 5. 앱실행·로그인(00공통 MS-01/CM-03) 반입 전 확인 (2026-07-14 배치)

> 화면설계서 v0.83 기준, Figma([개인용]260710) 참고로 25화면 신규 작성. 전부 목업 + `// 추후 API` 경계.

### 5-1. 무디자인/근사 화면 (디자인 확정 시 반영)
- [ ] **M11 챗봇(`cm/chatbot/ChatbotPage`)** — 설계서 "솔루션"(외부 챗봇 임베드). 파일만 자리확보, 실제 UI 없음. 외부 솔루션 연동 시 임베드.
- [ ] **P19 로그인필요서비스안내(`cm/lgnSrvcInfo/LgnSrvcInfo`)** — 설계서·Figma **둘 다 없음** → AlertModal로 전면 근사. 임시 문구 "로그인이 필요한 서비스입니다." — 확정 문구 확인 필요.

### 5-2. 디자인 에셋 필요 (근사 → 실제 에셋 교체)
- [ ] **스플래시 태그라인** "투명한 전자입찰" — Figma 손글씨 그래픽(SVG). 현재 텍스트 근사(`cm/splash`). `get_design_context` 타임아웃으로 미추출.
- [ ] **간편/모바일신분증 인증사 브랜드 로고**(KB·토스·카카오뱅크·네이버·NH·정부앱 등) — 컬러 SVG 에셋. `cm/simpleCert`·`cm/mobileIdntyCert` 플레이스홀더 타일 근사.
- [ ] **커스텀 인증 아이콘**(간편/공동/금융/모바일신분증 KRDS 별도제작 SVG) — `cm/mainLogin`·`cm/idFndng`·`cm/pswdFndng`·`cm/jntCert` 등에서 Material Symbols 근사(각 `// TODO(디자인 에셋)`).
- [ ] **PC QR 카메라 스크림 색** — `cm/pcQRLgn`에서 KRDS 중간회색 토큰 부재로 `bg-neutral-600/300` 근사. 카메라 연동 시 `<video>` 대체 + 필요시 토큰 신설.

### 5-3. 결정 대기 (설계서↔Figma·구조)
- [ ] **P10/P12/P13 인증화면**: 설계서·Figma는 **BottomSheet(팝업)**인데 셸 결정에 따라 **페이지 라우트**로 구현(`/login/simple-cert`·`joint-cert`·`mobile-id`). 방식선택(M01)→인증 트리거 배선 시 BottomSheet 전환 검토.
- [ ] **P16 인증결과·P18 로그아웃**: Figma는 **토스트 바**인데 공통 토스트 컴포넌트 부재로 AlertModal 근사(`cm/certRslt`·`cm/lgoInfo`). 토스트 도입 시 재검토.
- [ ] **M20 생체등록완료**: 설계서는 별도 화면ID지만 M15(`cm/bioInfoCertReg`)의 상태전환(verified)으로 통합 구현. 별도 라우트 분리 필요 시 재작업.
- [ ] **M05 아이디 마스킹**: 설계서·Figma 모두 미마스킹(`abcdef1234`) → 미마스킹 구현. 마스킹 정책 필요 시 `maskUserId` 스텁 활성화.
- [ ] **하단 CTA 고정바**: 여러 화면(M08·P12 등) Figma는 화면 하단 고정(sticky) 버튼이나 셸 스크롤 소유 + sticky 바텀바 선례 없어 콘텐츠 말미 전폭 버튼으로 구현. sticky 필요 시 공통 패턴 신설.
- [ ] **AlertModal 한계**: 좌측정렬 타이틀·닫기(X)·아웃라인 단일버튼 미지원 → 팝업들 근사. 반복되면 AlertModal variant 확장 검토(공통 변경이라 승인 필요).

### 5-4. 임시 영문 항목키 (설계서 데이터영역 미정의 → 확정 시 교체)
- [ ] 로그인/찾기 폼: `userId`·`password`·`passwordConfirm`·`bizRegNo`·`userName`·`birthDate`·`mobileNo`·`blngBzentyNm` (각 `.schema.ts`/페이지 `// TODO(설계서 확인)`).
- [ ] 업체선택 `BzentyChc`: `bzentyCd`·`bzentyNm`·`bizRegNo` (공용화 시 `src/types/`로 승격).
- [ ] 통합검색결과 M10: BD 설계서 항목명(`taskSeNm`·`bidPbancNm`·`pbancNo` 등) 재사용 + 카드→상세 라우트(개찰결과 임시 `/bd/:id`) 확정 필요.

### 5-5. 미배선(호스트 대기) 팝업 컴포넌트
- [ ] 아래는 **부모 소유** 설계라 라우트 없이 컴포넌트만 존재(아직 어디서도 import 안 됨) — 트리거 화면 확정 시 부모가 `open`/`onOpenChange`로 배선:
  `appAuthrtAgre/{AppAuthrtAgre(P03)·AppUpdateInfo(P04)·AppErrInfo(P05)}` · `mscrn/SysExpln(P08)` · `certRslt/CertRslt(P16)` · `lgoInfo/LgoInfo(P18)` · `lgnSrvcInfo/LgnSrvcInfo(P19)` · `bzentyChc/BzentyChc(P14)`.
