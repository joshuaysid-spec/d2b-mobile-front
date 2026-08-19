# 폐쇄망 반입 전 체크리스트

> 반입(폐쇄망 이관) **직전에** 이 문서를 열어 아래 항목을 확인한다. 항목이 해소되면 체크하고,
> 새로 발견된 반입 전 확인 사항은 여기에 추가한다. (갱신: 2026-07-10)

## 1. 미구현 잔여 화면

> 2026-08-19 개정 설계서(공통 v0.86 · 조달 v0.84 · 입찰 v1.88 · 대금 v0.85) 화면 목록 556건 전수 대조 결과.

- [x] **WM 국외 대금 화면 8종 (2026-08-13 설계서 신규 추가) — 2026-08-19 구현 완료** (`ovsCmdtyRcvCnfdocList`·`ovsElcrtTxivDtl`·`ovsRtnPymtDfryInfo`·`ovsPymtPrgrsList`, 전체메뉴 3항목 배선).
  M71 물품수령확인서목록(`OvsCmdtyRcvCnfdocList`) · P72 검색필터 · P73 전자계산서목록 ·
  M74 전자계산서상세(`OvsElcrtTxivDtl`) · M75 대금지불정보(`OvsRtnPymtDfryInfo`) · P76 검색필터 ·
  M77 대금지급현황(`OvsPymtPrgrsList`) · P78 선적품목내역(`OvsShpgItemDsctn`)
- [x] **WM T24 진행상태 탭 (2026-08-05 추가) — 2026-08-19 구현 완료** (`prcmPymtClmStts/PrcmPymtClmStts` 신설, T23 오배선 교체). 구 상황: 탭 자리(`CenterPrcmPymtClmDtlPage`·`EpfcClclnClmDtlPage`)에
  T23 지급상태 콘텐츠가 재사용됨. 설계 항목(진행상태/처리일시/처리부대·업체/처리담당자)용 신규 컴포넌트 필요.
- [x] **BD 제출 후 조회(Inq/Dtl) 화면 17종 — 2026-08-19 구현 완료** (`bidPrtcpAperDtl` M22+탭7 · `tndrInq` M09+탭6 · 포기/취소/심사포기 조회 3종, 상태 분기 배선). 구 상황: 작성(Wrt) 화면만 있고 조회 화면이 통째로 없었음.
  - BD-03-P09 입찰포기신청서조회 · BD-03-P10 입찰취소신청서조회 · BD-10-P03 이행/적격심사포기신청조회
  - BD-04-M22 입찰참가신청조회(서약서) + 하위 T01~T07 (8종)
  - BD-06-M09 입찰서(견적서)조회 + 하위 T02~T07 (7종) — `BidPrgsDtlInqPage.tsx:191` 보기 버튼이 console.log 스텁
- [x] **BD-09 입찰결과상세 팝업 3종 (2026-08-13 신규) — 2026-08-19 구현 완료** (FullPopup 3종+버튼 4종 배선. **단 P04 는 설계 슬라이드 미작성이라 골격만** — 기획 확정 시 본구현). P02 복수예비가격 · P03 동가낙찰결과 ·
  P04 평가위원별기술평가점수상세조회. 부모 T03 탭에 조회 버튼 4종(slide245)도 함께 추가돼 세트 배선 필요.
  ※ P04 는 화면목록·이벤트표에만 있고 설계 슬라이드가 없음 — 착수 전 기획 확인.
- [x] **OP-01-M78 국외연간조달계획상세 (2026-08-14 신규) — 2026-08-19 구현 완료** (`ovsPrcmPlanDtl/OvsPrcmPlanDtlPage` 신설, 카드→M78→재고번호→P76 재배선, 구 M73 사문화 탭 2파일 삭제). 잔여 확인: ①설계서에 M73/T71/T72 가 아직 살아 있음 — 폐기 여부 기획 확인 ②통합목록 annual 카드 항목이 구 조달계획용 행 그대로(slide76 정본은 조달요구번호/재고번호/부품번호 등) — 카드 드리프트 정비 필요. 구 상황: 국외 연간 카드 클릭이 P76 바텀시트 직행
  (`PrcmPlanIntgListPage.tsx:449` 구 개정 기준). M78 상세 페이지 신설 후 재고번호 클릭 → P76 으로 재배선.
  잔존 미연결 파일 `op/ovsPrcmPlanDtl/OvsPrcmPlanDtl*.tsx`(구 M73/T71/T72, import 0곳) 재활용/삭제 결정.
- [x] **OP-01-P13 연관사전규격상세 — 콘텐츠 오배선 — 2026-08-19 교정 완료** (P13 정본 `AnlBfhdSpcfctDtl` 신설, P12/P13 양방향 재배선, 중복 Sheet 래퍼 삭제). 구 상황: 조달계획상세(`PrcmPlanDtl.tsx:110`)와
  사전규격상세(`BfhdSpcfctDtl.tsx:98`)의 연관정보 시트가 둘 다 P12(연관조달계획) 콘텐츠를 렌더.
  P13 요구 콘텐츠(사전규격 요약, slide54)가 없고 두 파일 명칭·폴더도 뒤바뀜.
- [x] **BD 국외 보관함품목 검색필터 드리프트 — 2026-08-19 정합 완료** (개찰/공고 2종, '공고' 코드값 `pbanc` 임시 — slide418 항목설명 구판 표기라 상세설계 시 대조). 구 상황: `OvsLockerItemRegPage.tsx:91-98` 일자 세그먼트가
  구 기준 3종(개찰/참가/제출) — v1.88 slide417 은 개찰/공고 2종.
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
  - **CT(계약) 임시 키** (`src/types/ct.ts`, 2026-07-23 CT-01 전 화면 구현 시 BD 선례로 추가):
    - `CtrtIntgListItem.ctrtStatNm`(계약상태 뱃지: 계약진행/수정/최종/확정 — 목록·상세 분기 구동)
    - `CtrtIntgListItem.ctrdocTpNm`(계약서유형 — 계약최종 카드의 M05/M07/M08 분기, CRTC 확정 시 교체)
    - `CmdtyMdfcnCtrdocDtl.pbancNo` · `OvsElctrCtrtDtl.pbancNo`(문서정보 공고번호 — 항목표 미정의)
    - `CmdtyElctrCtrtPrgrsDtl.itemSumAmt`(계약금액 표 '품목별 합계' — 항목표 미정의)
    - T10 계약업체 '계약유형'(대표/구성) = `bzentySeCd` 재사용 · T03 반송/취소사유 탭 영문 ID 파생(`_RjctRsn`)
    - M73/M74(보증서/인지세 확인팝업) 영문 화면 ID 미기재 — 임시 파일명 `GrnteCnfrm`/`StmtxCnfrm`
- [ ] **CT 상세 분기 기준 확정**: 목록 카드 → 상세 분기(slide22)가 목록 데이터영역에 없는 항목
  (계약상태·계약서유형)에 의존 — 백엔드 응답 확정 시 `CtrtIntgListPage.handleCardClick` 분기 정비.
  바로가기 시트(M03/M09)의 진행단계별 버튼 노출 매트릭스(slide32/47)도 상태코드 확정 시 데이터 구동 전환.
- [x] **상세 이동 시 URL 식별자 제거 (PC 정합) — 2026-08-12 전환 완료**: 상세 라우트 70개를
  고정 경로(element 파일명 기반, 예 `/op/prcmPlanDtl`)로 전환, 식별자는 `navigate(state)` 로만 전달,
  state 부재 시 목록으로 `<Navigate>` 가드. 패턴: `docs/rules/api.md` "목록 → 상세 데이터 전달".
  잔여 확인: 푸시 딥링크 요구 확정 시 네이티브 브리지로 payload 전달 설계(URL 재도입 금지).

## 2-1. 반입 직전 마지막 결정 — EP 맵 구조 유지 여부

- [ ] **엔드포인트 경로를 `EP = {}` 맵으로 취합해 둘지, 각 메서드에 인라인으로 풀지 결정**
  - 현재: 서비스 파일(`src/services/{bd,cm,op,auth,file}.ts`) **상단에 `const EP = {...} as const` 로 경로 일괄 취합**.
    고정 경로는 문자열, 파라미터 경로는 화살표 함수. 각 엔트리 JSDoc 에 화면 ID + 소비 파일 표기.
  - **유지 시 이점**: 반입 후 대조 대상이 파일당 한 블록(bd 96 · cm 55 · op 12 · auth 10 · file 4)으로 모여 있어
    누락 없이 훑을 수 있다. 메서드 본문은 건드리지 않는다.
  - **인라인 전환 시**: 메서드를 읽을 때 경로가 그 자리에서 보이지만, 반입 후 경로 대조가 파일 전역 grep 이 되어
    누락 위험이 생긴다(빠뜨린 경로 = 그 화면만 조용히 404).
  - **참고(불편함 완화)**: 고정 경로는 `EP.PLAN_LIST` 에 hover 하면 `as const` 덕에 실제 경로 문자열이 그대로 표시된다.
    단 **파라미터 경로(화살표 함수)는 hover 시 `(id: string) => string` 만 보이므로** 정의로 점프해야 한다
    (필요하면 템플릿 리터럴 타입 명시로 hover 노출 가능 — 소규모 작업).
  - **판단 시점 주의**: 바꾸려면 **반입 전에** 결정한다(190개 일괄 치환은 기계적). 대조 작업이 시작된 뒤 구조를
    바꾸면 진행 중인 대조와 뒤섞인다.

## 3. 폐쇄망 환경 확인 (반입 산출물)

- [ ] **폰트 self-host** — CDN `@import url(구글폰트)` 금지. Material Symbols woff2 가
  `public/fonts/` 에 포함되고 dist 에 복사되는지 확인. (상세: `docs/closed-network-fonts.md`)
- [ ] **외부 네트워크 의존 없음** — 코드/스타일에 CDN·외부 URL fetch 없는지 확인
  (Figma 데이터·구글폰트 등은 개발 환경 전용).
- [ ] **빌드 검증** — `npm run lint && npm run build` 통과, chunk size 경고(600KB) 없는지 확인.

## 4. API 연동 절차 (반입 후 — 2026-07-20 서비스 레이어 구축으로 개정)

> **서비스 레이어가 전 도메인에 구축됨**: `src/services/{bd,cm,op,auth,file}.ts` (15개 서비스 객체,
> 페이지 주석이 참조하던 ~190 메서드 전부 실존). 각 메서드는 `if (USE_MOCK) 목업 : apiClient 실호출`
> 분기이며, 목업 데이터는 `src/mocks/{도메인}.ts`. 반입 후 연동은 아래 3단계.

### 4-1. `.env.production` 채우기 (필수, 2줄)

```
VITE_API_BASE_URL=http://<내부 API 서버>   ← 기입
VITE_USE_MOCK=false                        ← 확인
```

### 4-2. EP(엔드포인트) 맵 대조 — `src/services/*.ts` 5개 파일 상단

- 각 서비스 파일 상단 `const EP = {...}` 가 **추정 REST 경로**(JSDoc 에 화면 ID + 소비 파일 명시).
  실백엔드 경로와 다른 엔트리만 수정 — **메서드 본문은 건드리지 않는다.**
- 요청/응답 필드 중 미확정분은 `src/types/*.ts` 의 `TODO(백엔드 확정)` 섹션 참조.
  응답 형태가 다르면 서비스 메서드 안에서 도메인 타입으로 매핑(페이지 무변경 원칙).
- 봉투: apiClient 응답 인터셉터가 `{metadata:{status},data}` 를 벗겨 `data` 반환.
  봉투 형식이 다르면 `src/lib/apiClient.ts` 인터셉터 한 곳만 수정.
- 인증: 로그인 응답 → `LoginResult`(`types/domain.ts`) 매핑은 `services/auth.ts` 에 격리.
  refresh 토큰 재발급 플로우는 미구현(`apiClient.ts` 401 처리의 TODO) — 백엔드 스펙 확정 시 확장.

### 4-3. 잔여 페이지 배선 (기계적 — 핵심 플로우는 배선 완료)

- **배선 완료(참조 예시)**: 로그인(`IdPswdLoginPage`) · 조달계획 목록/상세(`PrcmPlanIntgListPage`·
  `PrcmPlanDtlPage`) · bd 메인 플로우 · 파일업로드(`BidPrtcpAperWrtPage_Stp6`).
- 잔여 페이지는 인라인 목업 유지 중 — `// 추후 API: xxxService.yyy` 주석의 메서드가 전부 실존하므로
  ① 조회는 `queries/{도메인}.ts` 에 useQuery 훅 추가 후 호출 ② 저장/제출은 서비스 직접 `await`
  ③ 페이지 `MOCK_*` 상수를 `src/mocks/{도메인}.ts` 로 이동(단일 소스) 순으로 교체한다.
  (컨벤션 상세: `docs/frontend-architecture.md` §7)
- 연관 진행 목록(`AnlPrgrsListPage`)의 `MOCK_ANL_ITEMS` → `cmService.getAnlPrgrsList(rfrncNo, substep)`.
- 일부 상세의 진행단계(`prgrsStg`) 고정값(사전규격·국외조달계획 `'조달'`, 국외입찰서·이행 `'입찰'`) —
  상세 조회 응답의 진행단계로 교체.

### 4-3-1. 목업 걷어내기 (전 화면 연동 안정화 후 — 서두르지 말 것)

- 연동 기간에는 목업을 유지한다 — 백엔드 장애/미완성 시 `VITE_USE_MOCK=true` 로 되돌려 화면 개발을 계속하는 보험.
  실모드에서 목업 분기는 실행되지 않으며(빌드가 일부 분기 자동 제거), 부담은 mocks/ 데이터 수십 KB 번들 무게뿐.
- 전 화면 연동 완료 후 정리(삭제만, 수정 없음 — 리그레션 저위험):
  - [ ] 각 서비스 메서드의 `if (USE_MOCK) ...` 분기 삭제 (`grep -rn USE_MOCK src/` 로 전수 확인)
  - [ ] `src/mocks/` 폴더 · `src/lib/env.ts` · `.env*` 의 `VITE_USE_MOCK` 줄 삭제
  - [ ] 미배선 페이지에 남은 인라인 `MOCK_*` 상수도 그 페이지 배선 시점에 함께 제거됐는지 확인

### 4-4. 전환 스모크 (반입 직전/직후)

- 목업 모드(`VITE_USE_MOCK=true`): 로그인 → 업체선택 → 홈 / 조달계획 목록 → 상세 / bd 공고 → 신청 → 투찰 흐름 확인.
- 실모드(`VITE_USE_MOCK=false`, 백엔드 연결 전): 로그아웃 상태로 부팅되고, 배선 페이지가 에러/빈 상태를
  안내(백화면·크래시 없음)하는지 확인. 401 수신 시 `/login` 이동.

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
