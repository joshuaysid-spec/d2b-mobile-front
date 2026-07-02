# 설계서 화면 ID 추출 + 앱메뉴 비교 (docs/spec)

> 각 기획서 자기 도메인 프리픽스 고유 화면 ID. 화면번호 2자리 기준(파싱 아티팩트 제거). M=화면, P=팝업.

## 1. 기획서별 요약

| 기획서         | 프리픽스 | 화면(M) | 팝업(P) |    합계 |
| -------------- | -------- | ------: | ------: | ------: |
| 공통           | CM,MS    |      82 |      40 |     122 |
| 조달계획       | OP       |      10 |      10 |      20 |
| 입찰           | BD       |      98 |      34 |     132 |
| 계약           | CT       |      23 |       7 |      30 |
| 이행           | EX       |      14 |       2 |      16 |
| 대금청구및사후 | WM       |       9 |       2 |      11 |
| 업무지원       | TS       |       5 |       2 |       7 |
| **합계**       |          |         |         | **338** |

## 2. 앱메뉴(xlsx) 비교

앱메뉴 고유 ID: 344 / 스펙 고유 ID: 338

| 도메인 | 스펙 | 앱메뉴 | 차이 |
| ------ | ---: | -----: | ---: |
| CM     |  105 |    108 |   -3 |
| MS     |   17 |     20 |   -3 |
| OP     |   20 |     20 |    0 |
| BD     |  132 |    132 |    0 |
| CT     |   30 |     30 |    0 |
| EX     |   16 |     16 |    0 |
| WM     |   11 |     11 |    0 |
| TS     |    7 |      7 |    0 |

**메뉴O 스펙X (11):** MUI-BD-03-P09, MUI-CM-01-M13, MUI-CM-01-M14, MUI-CM-01-M71, MUI-CM-01-M72, MUI-CM-01-M73, MUI-CM-04-M10, MUI-CM-04-M11, MUI-MS-01-M06, MUI-MS-02-M05, MUI-MS-02-M06

**스펙O 메뉴X (5):** MUI-BD-06-P80, MUI-CM-04-P21, MUI-CM-06-M07, MUI-CM-06-M08, MUI-CM-06-M09

> CM/MS 외 6개 도메인은 완전 일치. 차이 다수는 M/P 표기 불일치(CM-01-M13/14↔P13/14, CM-04-M10/11↔P10/11, MS-01-M06↔P06).

## 3. 문서별 ID 목록

### 공통 (CM,MS) — 122개 (M 82/P 40)

MUI-CM-01-M01, MUI-CM-01-M02, MUI-CM-01-M03, MUI-CM-01-M04, MUI-CM-01-M05, MUI-CM-01-M15, MUI-CM-01-M16, MUI-CM-01-M17, MUI-CM-01-M18, MUI-CM-01-M19, MUI-CM-01-P06, MUI-CM-01-P07, MUI-CM-01-P08, MUI-CM-01-P09, MUI-CM-01-P10, MUI-CM-01-P11, MUI-CM-01-P12, MUI-CM-01-P13, MUI-CM-01-P14, MUI-CM-01-P20, MUI-CM-01-P21, MUI-CM-02-M01, MUI-CM-02-M02, MUI-CM-02-M03, MUI-CM-02-M04, MUI-CM-02-M05, MUI-CM-02-M06, MUI-CM-02-M07, MUI-CM-02-M09, MUI-CM-02-P08, MUI-CM-02-P10, MUI-CM-03-M01, MUI-CM-03-M02, MUI-CM-03-M03, MUI-CM-03-M04, MUI-CM-03-M05, MUI-CM-03-M06, MUI-CM-03-M07, MUI-CM-03-M08, MUI-CM-03-M09, MUI-CM-03-M14, MUI-CM-03-M15, MUI-CM-03-M17, MUI-CM-03-P10, MUI-CM-03-P11, MUI-CM-03-P12, MUI-CM-03-P13, MUI-CM-03-P16, MUI-CM-03-P18, MUI-CM-03-P19, MUI-CM-04-M01, MUI-CM-04-M02, MUI-CM-04-M03, MUI-CM-04-M05, MUI-CM-04-M06, MUI-CM-04-M07, MUI-CM-04-M08, MUI-CM-04-M09, MUI-CM-04-M12, MUI-CM-04-M13, MUI-CM-04-M14, MUI-CM-04-M16, MUI-CM-04-M17, MUI-CM-04-P10, MUI-CM-04-P11, MUI-CM-04-P15, MUI-CM-04-P18, MUI-CM-04-P19, MUI-CM-04-P20, MUI-CM-04-P21, MUI-CM-05-M01, MUI-CM-05-M02, MUI-CM-05-M03, MUI-CM-05-M04, MUI-CM-05-M05, MUI-CM-05-M06, MUI-CM-05-M07, MUI-CM-05-M08, MUI-CM-05-M09, MUI-CM-05-M10, MUI-CM-05-M11, MUI-CM-05-M12, MUI-CM-05-M13, MUI-CM-05-M14, MUI-CM-05-M15, MUI-CM-06-M01, MUI-CM-06-M02, MUI-CM-06-M04, MUI-CM-06-M05, MUI-CM-06-M06, MUI-CM-06-M07, MUI-CM-06-M08, MUI-CM-06-M09, MUI-CM-06-M10, MUI-CM-06-M11, MUI-CM-06-M12, MUI-CM-06-M13, MUI-CM-06-M14, MUI-CM-06-M16, MUI-CM-06-M17, MUI-CM-06-P03, MUI-CM-06-P07, MUI-CM-06-P08, MUI-CM-06-P09, MUI-CM-06-P15, MUI-MS-01-M01, MUI-MS-01-M02, MUI-MS-01-M07, MUI-MS-01-M09, MUI-MS-01-M10, MUI-MS-01-M11, MUI-MS-01-M12, MUI-MS-01-M13, MUI-MS-01-P03, MUI-MS-01-P04, MUI-MS-01-P05, MUI-MS-01-P06, MUI-MS-01-P08, MUI-MS-01-P14, MUI-MS-02-M01, MUI-MS-02-P02, MUI-MS-02-P03

### 조달계획 (OP) — 20개 (M 10/P 10)

MUI-OP-01-M01, MUI-OP-01-M02, MUI-OP-01-M03, MUI-OP-01-M04, MUI-OP-01-M05, MUI-OP-01-M08, MUI-OP-01-M09, MUI-OP-01-M11, MUI-OP-01-M73, MUI-OP-01-M74, MUI-OP-01-P06, MUI-OP-01-P07, MUI-OP-01-P10, MUI-OP-01-P12, MUI-OP-01-P13, MUI-OP-01-P71, MUI-OP-01-P72, MUI-OP-01-P75, MUI-OP-01-P76, MUI-OP-01-P77

### 입찰 (BD) — 132개 (M 98/P 34)

MUI-BD-01-M01, MUI-BD-01-M02, MUI-BD-01-M07, MUI-BD-01-M08, MUI-BD-01-M09, MUI-BD-01-M10, MUI-BD-01-M11, MUI-BD-01-M12, MUI-BD-01-M71, MUI-BD-01-M72, MUI-BD-01-M73, MUI-BD-01-M74, MUI-BD-01-M75, MUI-BD-01-M76, MUI-BD-01-M77, MUI-BD-01-M78, MUI-BD-01-M79, MUI-BD-01-P03, MUI-BD-01-P04, MUI-BD-01-P05, MUI-BD-01-P06, MUI-BD-01-P13, MUI-BD-01-P14, MUI-BD-01-P17, MUI-BD-01-P80, MUI-BD-02-M01, MUI-BD-02-M02, MUI-BD-03-M01, MUI-BD-03-M02, MUI-BD-03-M05, MUI-BD-03-P03, MUI-BD-03-P04, MUI-BD-03-P06, MUI-BD-03-P07, MUI-BD-04-M01, MUI-BD-04-M05, MUI-BD-04-M06, MUI-BD-04-M07, MUI-BD-04-M08, MUI-BD-04-M10, MUI-BD-04-M12, MUI-BD-04-M14, MUI-BD-04-M21, MUI-BD-04-M71, MUI-BD-04-M72, MUI-BD-04-M73, MUI-BD-04-M74, MUI-BD-04-M77, MUI-BD-04-M78, MUI-BD-04-M79, MUI-BD-04-M80, MUI-BD-04-M81, MUI-BD-04-P02, MUI-BD-04-P03, MUI-BD-04-P04, MUI-BD-04-P09, MUI-BD-04-P11, MUI-BD-04-P13, MUI-BD-04-P15, MUI-BD-04-P16, MUI-BD-04-P17, MUI-BD-04-P18, MUI-BD-04-P19, MUI-BD-04-P20, MUI-BD-04-P75, MUI-BD-04-P76, MUI-BD-04-P82, MUI-BD-04-P83, MUI-BD-06-M01, MUI-BD-06-M02, MUI-BD-06-M03, MUI-BD-06-M04, MUI-BD-06-M05, MUI-BD-06-M06, MUI-BD-06-M07, MUI-BD-06-M08, MUI-BD-06-M71, MUI-BD-06-M72, MUI-BD-06-M73, MUI-BD-06-M74, MUI-BD-06-M75, MUI-BD-06-M76, MUI-BD-06-M77, MUI-BD-06-M78, MUI-BD-06-M79, MUI-BD-06-M80, MUI-BD-06-P80, MUI-BD-06-P81, MUI-BD-07-P01, MUI-BD-07-P71, MUI-BD-08-M01, MUI-BD-09-M01, MUI-BD-09-M02, MUI-BD-09-M03, MUI-BD-09-M04, MUI-BD-09-M71, MUI-BD-09-M72, MUI-BD-09-M73, MUI-BD-10-M01, MUI-BD-10-M02, MUI-BD-10-M03, MUI-BD-10-M04, MUI-BD-10-M05, MUI-BD-10-M06, MUI-BD-10-M07, MUI-BD-10-M08, MUI-BD-10-M09, MUI-BD-10-M10, MUI-BD-10-M11, MUI-BD-10-M12, MUI-BD-10-M13, MUI-BD-10-M14, MUI-BD-10-M15, MUI-BD-10-M16, MUI-BD-10-M17, MUI-BD-10-M18, MUI-BD-10-M19, MUI-BD-10-M20, MUI-BD-10-P21, MUI-BD-12-M71, MUI-BD-12-M72, MUI-BD-12-M73, MUI-BD-12-M74, MUI-BD-12-M75, MUI-BD-12-M76, MUI-BD-12-M77, MUI-BD-12-M78, MUI-BD-12-M79, MUI-BD-12-M80, MUI-BD-12-M81, MUI-BD-12-M83, MUI-BD-12-P82

### 계약 (CT) — 30개 (M 23/P 7)

MUI-CT-01-M01, MUI-CT-01-M02, MUI-CT-01-M03, MUI-CT-01-M05, MUI-CT-01-M06, MUI-CT-01-M07, MUI-CT-01-M08, MUI-CT-01-M09, MUI-CT-01-M10, MUI-CT-01-M15, MUI-CT-01-M71, MUI-CT-01-M72, MUI-CT-01-M73, MUI-CT-01-M74, MUI-CT-01-M75, MUI-CT-01-M76, MUI-CT-01-M77, MUI-CT-01-P04, MUI-CT-01-P11, MUI-CT-01-P12, MUI-CT-01-P13, MUI-CT-01-P14, MUI-CT-01-P16, MUI-CT-01-P78, MUI-CT-03-M01, MUI-CT-03-M02, MUI-CT-03-M03, MUI-CT-03-M04, MUI-CT-03-M05, MUI-CT-03-M06

### 이행 (EX) — 16개 (M 14/P 2)

MUI-EX-01-M01, MUI-EX-01-M02, MUI-EX-01-M03, MUI-EX-01-M04, MUI-EX-01-M05, MUI-EX-01-M07, MUI-EX-01-P06, MUI-EX-02-M71, MUI-EX-02-M72, MUI-EX-02-M73, MUI-EX-02-M74, MUI-EX-02-M75, MUI-EX-02-M76, MUI-EX-02-M77, MUI-EX-02-M78, MUI-EX-02-P79

### 대금청구및사후 (WM) — 11개 (M 9/P 2)

MUI-WM-01-M01, MUI-WM-01-M02, MUI-WM-01-M03, MUI-WM-01-M05, MUI-WM-01-M06, MUI-WM-01-M07, MUI-WM-01-M08, MUI-WM-01-M10, MUI-WM-01-M11, MUI-WM-01-P04, MUI-WM-01-P09

### 업무지원 (TS) — 7개 (M 5/P 2)

MUI-TS-01-M01, MUI-TS-01-M02, MUI-TS-01-P03, MUI-TS-04-M01, MUI-TS-04-M03, MUI-TS-04-M04, MUI-TS-04-P02

###

공통(CM): 108개
메인(MS): 20개
조달계획(OP): 20개(완료, 기존25에서 20으로 변경)
입찰(BD): 132개
계약(CT): 30개
이행(EX): 16개
대금청구(WM): 11개
업무지원(TS): 7개
전체 합계:344개

## 4. 앱메뉴 260629a(탭ID추가본) 재집계 — 2026-07-02

기준 파일: `공유)앱메뉴_모바일_260629a_탭아이디추가_권순태.xlsx` / 시트 `앱 메뉴 260615` / B열 `app-page-ID` 고유 ID.
이 버전에서 상세 서브화면이 **탭(T) ID 체계로 재편**됨(파일명 "탭아이디추가", T 182건 신규).
**화면 본수 = M(화면)+P(팝업)+T(탭) = 502** 기준으로 집계(동일 ID 다중 메뉴 배치는 고유 1건).

| 도메인 | 본수(M+P+T) | M | P | T | (구)손계수 | 차이 |
| ------ | ----------: | --: | --: | --: | -------: | ---: |
| CM | 159 | 90 | 39 | 30 | 108 | +51 |
| MS | 18 | 10 | 8 | 0 | 20 | -2 |
| OP | 32 | 7 | 11 | 14 | 20 | +12 |
| BD | 145 | 47 | 36 | 62 | 132 | +13 |
| CT | 72 | 22 | 9 | 41 | 30 | +42 |
| EX | 34 | 14 | 6 | 14 | 16 | +18 |
| WM | 31 | 9 | 3 | 19 | 11 | +20 |
| TS | 11 | 5 | 4 | 2 | 7 | +4 |
| **합계** | **502** | **204** | **116** | **182** | **344** | **+158** |

**도메인 설명** (앱메뉴 시트의 1Depth·그룹 기준):

- **CM (공통관리, 159)** — 업무 도메인에 속하지 않는 공통 화면 전체. CM-01 보관함·문서함(마이페이지 하위, M15/P13/T6) · CM-02 마이페이지 개인정보 관리(M9/P3) · CM-03 로그인·인증(방식선택, PC QR 로그인 등 M13/P7) · CM-04 고객센터·인증센터(M26/P7/T21 — **신규 CM-04-M21~M32 12화면 추가로 최다 그룹**) · CM-05 국방전자조달 소개·이용안내(M15) · CM-06 마이페이지 설정 등(M12/P9/T3). 신규 화면 26건 추가가 +51 증가의 주원인.
- **MS (메인·앱 기동, 18)** — 앱 셸 계열: 스플래시, 보안/권한 동의, 업데이트·오류 안내 팝업, 메인홈, 햄버거 메뉴, 통합검색, 업체선택 팝업(MS-01, M9/P6) + 설정·모바일앱서비스 안내(MS-02, M1/P2). 탭(T) 없음. 구 손계수 20과의 -2는 수기 보정 오차(구버전 시트도 18).
- **OP (조달, 32)** — 조달계획관리 단일 그룹(OP-01): 조달계획 통합목록·상세(국내/국외), 사전규격, 의견등록 팝업 등 M7/P11. 상세 화면의 탭 14건이 T로 분리되어 T 비중이 큼.
- **BD (입찰, 145)** — 입찰공고(BD-01) · 사전심사(BD-02) · 입찰진행 목록/상세(BD-03) · 입찰참가신청서(BD-04) · 입찰서(견적서) 작성(BD-06) · 입찰포기/취소(BD-07) · 개찰목록(BD-08) · 개찰결과(BD-09/10) · 국외 개찰(BD-12). 개찰 상세(BD-10 T21)·국외(BD-12 T13) 등 상세 화면 재편으로 **T 62건 = 전 도메인 최다**.
- **CT (계약, 72)** — 전자계약: 계약 목록·상세(CT-01, M16/P8/T27) + 계약 조회(CT-03, M6/P1/T14). 상세 탭 41건이 T.
- **EX (이행, 34)** — 검사 및 납품조서(EX-01, M6/P3/T6) + 한도액계약(EX-02, M8/P3/T8).
- **WM (대금청구/사후, 31)** — 대금청구 통합목록·대금청구진행현황·대금지불정보(반납) — WM-01 단일 그룹(M9/P3), 상세 탭 19건이 T.
- **TS (업무지원, 11)** — 업무지원 메뉴 하위 화면(TS-01 M2/P2/T2 · TS-04 M3/P2).

> - 탭 제외 시 M+P = 320. 구 손계수 344(위 "###" 절)는 구버전 배치(BD M98/P33/R1=132) 기준이라 직접 비교 불가.
> - **BD**: 상세 화면 블록(BD-10-M02~M20, BD-04/06/09/12 의 M72~M81 계열 등 54건)이 개별 M ID 를 잃고 **T-계열 신규 번호로 재편** → M/P 는 132→83 감소, 대신 T 62건.
> - **CM**: 신규 화면 26건 추가(CM-04-M21~M32, CM-01-M22/23/74 등) → M/P 108→129 증가.
> - 도메인 코드는 CM·MS·OP·BD·CT·EX·WM·TS 8종만 등장(FB 없음). MUI-MS-\* 실재 — MS 는 CM 과 별도 도메인.
> - 구버전에만 있던 R(구역) 접미(BD-01-R15 1건)는 현행 시트에 없어 미포함.
