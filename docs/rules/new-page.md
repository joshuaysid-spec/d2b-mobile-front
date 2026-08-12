# 새 페이지 작성 절차 (기획서 → 화면)

> CLAUDE.md 에서 분할된 상세 규칙. 새 화면/페이지 추가 · 미구현 화면 체크 시 반드시 먼저 읽는다.
> 여럿이 기획서 보고 페이지를 칠 때의 표준 순서. **새 컴포넌트를 만들지 말고 `/guide` 의 기존 공통을 조립**하는 게 기본.

**문서 위치:**
- 설계서(=기획서) 원본: **`docs/spec/`** (조달계획 pptx 등). 위치·화면목록·슬라이드 오프셋·추출법은 `docs/spec/README.md`.
  - slide5 "화면 목록" = 화면ID↔영문ID↔한글명 → 폴더/파일명 근거. "기획서 pXX" = `slide(XX+1).xml`.
- 기능별 plan/design: `docs/01-plan/features/`, `docs/02-design/features/`.

## 미작업(미구현) 화면 ID 체크 · 진척 카운트

**⚠️ 기준 — 설계서 pptx 원본이 유일 기준.**
- 추출 스냅샷 md 를 만들어 카운트 근거로 삼지 말 것 — 설계서 개정(신규 화면·M↔P 전환·T 탭 재편)을 못 따라가 오도한다(구 `화면ID-목록.md` 가 그래서 삭제됨. 예: 공통 v0.84 는 169개인데 스냅샷은 122개).
- 절차: 해당 도메인 pptx 를 zip 으로 풀어 전 슬라이드 `<a:t>` 텍스트 추출 → 텍스트 런이 쪼개져 있으므로 **공백/구분자 제거 후** `MUI-XX-##-[MPT]##` 정규식으로 **"화면 목록 (N/M)" 표 슬라이드들**에서 ID 집합을 만든다(목차·흐름도 슬라이드 제외, 중복 제거). 화면 목록 표가 여러 섹션에 흩어져 있으니(공통은 7~9·67~71·217~220·346·356·365·378) 전 슬라이드를 스캔해 찾는다.
- 구현 여부 대조: `src/ui/biz/**` 파일 내 화면 ID 주석 grep 을 1차 근거로 하되, **ID 미스매치**(설계서 개정으로 구 ID 태깅된 파일, 예: 업무캘린더 M07/M08/M09 ↔ 코드 P07/P08/P09)가 있으니 미구현 판정 전에 **영문 화면명으로 파일 존재를 재확인**한다. `router.tsx`/`routes.ts`/서비스의 ID 참조만으로는 구현으로 치지 않는다.

## 순서

1. **설계서에서 화면 확인** — 담당 화면의 화면ID·구성(섹션/필드/탭)·동작을 `docs/spec/` 에서 읽는다.
2. **`/guide` 에서 쓸 컴포넌트 고르기** — 브라우저로 `/guide`(ComponentGuidePage) 열어 공통 base/composites 카탈로그 확인. **여기 있는 걸 조립**(FullPopup·BottomSheet·AlertModal·Accordion·Table·InputBox·TextArea·RadioButtonGroup·CheckboxGroup·ButtonGroup·FileDownloadList·SummaryInfo·StepBar·TabList 등). 신규 생성 전 `common/composites`·`base` 중복 확인 필수.
   - **⚠️ 기존 공통에 없어 새 공통 컴포넌트(`base`/`composites`)나 새 variant 를 만들어야 하면, 만들기 전에 사용자에게 "새로 만들어도 되는지" 먼저 물어본다.** (도메인 전용 조립물 — `biz/{도메인}/` 의 페이지·탭·바텀시트 콘텐츠·`*FullPopup` 등 — 은 예외로 바로 생성)
3. **폴더/파일 생성** — `docs/rules/components.md` 의 화면ID→파일명 변환 + 도메인 폴더 코드(op/bd/ct/...) 준수.
   - **새 화면은 먼저 설계서/앱메뉴 문서에서 해당 화면의 영문 화면 ID 를 확인해 파일/폴더명에 반영**(예: 알림현황 MUI-MS-01-M13 → `cm/notiPrst/NotiPrstPage`). 임의 영문명(`NotificationPage` 등) 금지 — MS/CM 공통 화면도 동일.
4. **조립 + 데이터 연결** — 표/필드는 데이터 배열로 구동. **조회/저장은 서비스 실호출**(조회 = `queries/{도메인}.ts` useQuery 훅, 저장/제출 = useMutation 훅 — `docs/rules/api.md`). 필요한 메서드가 서비스에 없으면 해당 `services/{도메인}.ts` 에 EP+USE_MOCK 분기 패턴으로 추가하고 목업은 `mocks/{도메인}.ts` 에 둔다.
   - **목업은 기획서(설계서)의 "데이터영역·항목설명·검색조건·속성값"을 참고해 실제 API 응답처럼 만든다.** 필드명(키)·코드값·자릿수·형식(날짜·번호 마스킹 등)을 설계서 그대로 맞추고(예: 입찰공고번호 `2024L0M0030A1F1-01` 형식·코드값 `정상공고`), 도메인 타입(`src/types/{도메인}.ts`)에 그 필드를 정의한다. **의미 없는 더미("test", `aaa`, 무작위 숫자) 금지** — API 연동 시 키/형식만 바꾸면 되도록.
   - **⚠️ 항목명(변수·필드·키)은 반드시 설계서 항목명(영문 ID)을 그대로 쓴다 — 임의 작명 금지.** 목데이터든 상태 변수든 새 키를 만들 때 먼저 설계서(데이터영역/항목설명 표의 "항목명(영문)")에서 해당 항목을 찾는다(예: 진행상태 = `implPrgrsStcd`, 입찰진행상태명 = `bidStatNm`). `LifecycleStage` 처럼 문서에 없는 이름을 새로 지어내지 말 것. 그 값은 한 아이템의 속성 1개일 뿐이면 별도 추상화 모듈로 빼지 말고 해당 **도메인 아이템 타입의 필드**로 둔다.
   - **검증 단계에서 새로 만든 항목명이 설계서에 실제로 있는지 확인**한다. 문서에서 못 찾은 항목명을 써야 하면, 임의로 만들지 말고 **사용자에게 "이 이름으로 만들어도 되는지" 먼저 물어본다.**
5. **`router.tsx` 등록** — `lazy()` + `errorElement={<ErrorPage />}` + `handle`(`docs/rules/routing.md` "라우트 handle 레퍼런스").
6. **검증** — `npm run lint && npm run build`. chunk size 확인.
   - **⚠️ Figma 화면은 "폰트 두께(weight)·마진·패딩·gap·radius·색·정렬"까지 섬세하게 대조**한다. `get_design_context` 로 각 요소의 실측값(`font-['Pretendard_GOV:Bold'/'Medium'/'Regular']`, `p-[..]`, `gap-[..]`, `text-[..px]`, `#hex`)을 뽑아 **1:1**로 맞춘다(느낌으로 근사 금지). px→토큰 매핑: 2/4/6/8/10/12/16px = `krds-2/3/4/5/6/7/8`, 16px 패딩=`krds-8`.
   - **구현 → 스크린샷(`get_screenshot`)과 재대조 → 어긋난 두께/간격/색을 재구현**하는 2패스로 마감한다. 특히 **숫자/뱃지/서브타이틀의 font-weight** 와 **섹션 배경색·행 값 색(muted vs ink)** 은 자주 틀리니 반드시 확인(예: M05 카드 subtitle=ink+Medium, 행 값=muted #555).

## Figma MCP 사용 여부

- 대부분의 페이지 작업 = `/guide` 조립이라 **Figma MCP 안 써도 된다.**
- Figma MCP 가 필요한 경우 = **`/guide` 에 없는 새 공통 컴포넌트를 디자인 원본대로 새로 만들 때**뿐.
- **Figma MCP 연결 안 될 때:**
  - 새 컴포넌트가 꼭 필요한 게 아니면 → `/guide` 의 가장 가까운 기존 컴포넌트로 진행.
  - 정말 새 비주얼이 필요한데 Figma 를 못 읽으면 → **픽셀값 임의 추측 금지.** 기존 토큰(`tokens.css`)·컴포넌트로 근사하거나, 사용자에게 디자인 확인(스크린샷/값) 요청 후 진행.
  - Figma 데이터는 웹 fetch 불가 — 반드시 데스크톱 앱 + Dev Mode MCP (file key 등은 `docs/rules/design-tokens.md` "Figma" 절).
