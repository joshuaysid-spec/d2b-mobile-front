# 화면 조립 컨벤션 — 목록 · 상세 · 팝업

> CLAUDE.md 에서 분할된 상세 규칙. 목록/상세 화면 · BottomSheet/FullPopup/AlertModal · 검색필터 작업 시 반드시 먼저 읽는다.

## 상세(detail) 화면 & 팝업 컨벤션 — 조달계획 상세(M03~) 작업에서 확립

> **새 상세(detail) 화면은 조달계획 상세 `PrcmPlanDtlPage` 를 레퍼런스로 조립한다** (`src/ui/biz/op/prcmPlanDtl/PrcmPlanDtlPage.tsx`, 국외는 `ovsPrcmPlanDtl/OvsPrcmPlanDtlPage` · 사전규격은 `bfhdSpcfctDtl/BfhdSpcfctDtlPage`). 아래 구조/컨벤션은 그 페이지에서 확립된 것. (목록 화면은 아래 "목록 화면 & 검색필터 컨벤션" 의 `PrcmPlanIntgListPage` 레퍼런스 참고.)

**1) 다중 탭 상세 화면 구조.**
- 상단: `useCollapsibleHeader()` + sticky 블록(요약 `SummaryInfo` + 스텝 `StepBar` + 탭 `TabList`).
- 탭 콘텐츠는 **탭별 컴포넌트로 분리**(같은 biz 폴더), 페이지는 `renderTabContent(tab)` switch 로 렌더. (예: `DetailContent`/`ItemSpec`/`VendorOpinion`/`ContractTerms`/`Attachment`)
- 각 탭 콘텐츠 = `PageTitle`(탭명) + `Accordion`/`AccordionSection` + `Table`(rows 데이터 구동). 표·필드는 **데이터로 구동**(라벨/값을 배열로) — 국내/국외/공사 변형은 데이터만 갈아끼움.
- **목록 `key` 는 안정적 고유 식별자(`id`·고유 문자열)를 쓴다. 배열 인덱스 `key={i}` 금지** — 동적 목록(API 연동) 에서 삽입/삭제/정렬 시 React 가 다른 항목을 같은 노드로 오인 재사용해 입력값·포커스·애니메이션이 꼬인다. 고유 ID 가 없으면 데이터 타입에 `id` 를 추가한다(예: `FileDownloadItem.id` — 파일명은 중복 가능). (전역 적용, 상세화면 한정 아님)

**2) 기존 컴포넌트 재사용 — 신규 생성 최소화 (사용자 반복 지시).**
화면/팝업은 반드시 기존 공통부터 조립한다: `FullPopup`·`BottomSheet`·`AlertModal`·`Accordion`·`Table`·`InputBox`·`TextArea`·`InputLabel`·`InputMessage`·`RadioButtonGroup`·`ButtonGroup`·`FileDownloadList`·`SummaryInfo`·`StepBar`·`TabList`·`SearchFilter`. 신규는 **도메인 전용 조립물**(예: `OpinionCard`, `*FullPopup` 풀팝업 래퍼, 바텀시트 콘텐츠 컴포넌트)만. 신규 생성 전 `common/composites`·`base` 중복 확인 필수.
- **새 공통 컴포넌트(`base`/`composites`)·새 variant 는 만들기 전 사용자에게 먼저 물어본다**(도메인 전용 조립물은 예외). → `docs/rules/new-page.md` step 2 참고.
- **팝업 종류 선택**: 선택/검색/짧은 입력 → `BottomSheet` · 상세/긴 폼(여러 섹션) → `FullPopup` · 단순 확인(예/아니오) → `AlertModal`.
- 읽기전용 표시 필드는 `InputBox`/`TextArea` 에 `disabled` 로 재사용.
- 액션 버튼은 시트 `footer` 슬롯에 둔다(스크롤 본문에 두면 overflow 로 하단 border 잘림).

**3) 데이터 연결 — 서비스 실호출 (`docs/rules/api.md`).**
조회는 `queries/{도메인}.ts` useQuery 훅, 저장/제출은 useMutation 훅. 목업↔실연동은 서비스(`USE_MOCK`)가 전환하므로 페이지에 `console.log` 스텁·인라인 목업을 새로 만들지 않는다.
- **목업 값(mocks/{도메인}.ts)은 설계서의 데이터영역·항목설명·검색조건·속성값을 그대로 반영**해 실제 API 응답처럼 만든다(필드명·코드값·자릿수·형식 일치, 임의 더미 금지). → `docs/rules/new-page.md` step 4 참고.

**4) 유사 화면 = 페이지를 함부로 나누지 않는다 (API 다른 건 분리 사유 아님).**
- **같은 구조 + API/값/라벨만 다름**(국내·국외 조달계획상세) → **1 페이지** + `type` 파라미터로 service 선택 + config 로 라벨/탭 차이 흡수. 페이지 복제 금지.
- **다른 도메인 + 레이아웃만 유사**(조달계획상세 vs 사전규격상세) → **페이지 분리하되 로직은 공유**: 갈라지면 안 되는 동작(`useCollapsibleHeader`)은 훅으로, 마크업은 각 페이지가 소유. 래퍼 셸 컴포넌트로 한 겹 더 씌우지 않는다(과잉 prop 방지).

## 목록 화면 & 검색필터 컨벤션 — 조달계획 통합목록(MUI-OP-01-M02) 에서 확립

**1) 목록 화면(검색 + 카드 리스트)은 `PrcmPlanIntgListPage` 를 레퍼런스로 조립한다.**
- 레퍼런스: `src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx`.
- 표준 조립(위→아래): `SectionTitle`(검색조건 바) → `SearchCondition`(빠른검색어 + 대상칩 + 필터버튼) → `ListSectionHeader`(총건수·페이지크기) → `CardList`(카드 목록, `Badge`) → 더보기 `Button` → `FloatingActionButton`(맨위로) → `SearchFilter`(상세필터 풀팝업). 전부 기존 공통 — 신규 생성 금지.
- 상태 분리: `filter`(상세필터 확정값) · `keyword`/`targets`(빠른검색 입력 중) · `appliedSearch`(검색 실행 시에만 확정) · `page`/`pageSize`(더보기). **빠른검색은 입력 중 거르지 않고 검색 실행(버튼/Enter) 시에만** `appliedSearch` 로 확정한다.
- 데이터: **목록 useQuery 훅**(`useOpPlanList` 등)이 공급 — 키워드 필터/더보기 페이징은 당분간 클라이언트 로직(`filteredList` useMemo → `visibleList` slice) 유지, 서버 페이징 전환 시 훅 파라미터로 이행. 목업 데이터는 `mocks/{도메인}.ts`.
- 카드 클릭 라우팅은 **데이터 필드(예: `srchType`)로 분기** — 라벨 문자열 하드코딩 분기 금지. 맨위로 스크롤은 `#app-scroll`(window 아님).

**2) 검색필터 화면은 새로 만들지 말고 cm 의 `SearchFilter` 를 사용한다.**
- 위치: `src/ui/biz/cm/search/SearchFilter.tsx` — **schema 구동 범용 풀팝업 셸**(도메인 무관, Home·조달계획 등 공용). 페이지는 **`SearchFilter` 하나만 import** 하면 된다.
- 페이지가 주입하는 것: `schema`(정적 `SearchFilterSchema` **또는** 입력값에 따라 섹션이 바뀌면 `resolver` 함수) · `value`/`defaultValue` · `onSearch` · (한 필드가 종속 필드를 바꿔야 하면) `normalize`. 필드 정의 타입은 `@/types/search-filter`.
- 필드 렌더는 셸 내부 `SearchFilterField` 담당 — 페이지는 **schema(데이터)만 선언**하고 컨트롤을 직접 그리지 않는다.
- 검증(필수값·길이·형식)은 셸 내부 RHF+zod 가 담당 — 페이지는 필드에 `required: true`, text 필드는 `minLength`/`maxLength`/`pattern` 선언만. 상세는 `docs/rules/forms.md`.
- **공통 검색 바텀시트(품목별 `ItemInq`·생산자 `PrdcrInq`·발주부서 `DeptInq`)는 셸(`SearchFilter`)이 직접 소유**한다. selectionField 에 `searchSheet: 'item'|'producer'|'dept'` 만 선언하면 셸이 `BottomSheet` 컨테이너를 열고(슬롯 조합) 선택 결과를 그 필드 값으로 주입한다 — **페이지는 시트를 import·관여하지 않는다.** (시트는 cm/search 의 콘텐츠 전용 컴포넌트, `*Sheet` 래퍼 금지)
- **새 공통 검색시트 추가 절차 (페이지가 아니라 셸에 추가):** 앞으로 검색필터에서 파생되는 바텀시트가 늘어나도 **소비 페이지가 아니라 `SearchFilter` 셸에 배선**한다.
  1. `src/ui/biz/cm/search/` 에 **콘텐츠 전용 컴포넌트** 신설 — `forwardRef` + `useImperativeHandle` 로 `SearchSheetHandle`(footer `reset`/`search`) 노출, 내부에 `BottomSheet`/footer/`open` 두지 않음(컨테이너는 셸 소유).
  2. `@/types/search-filter` 의 `SearchSheetKind` 유니온에 새 종류 추가.
  3. `SearchFilter.tsx` 에 종류별 `<BottomSheet>`(타이틀/footer/open) + 콘텐츠 컴포넌트 + 전용 `ref` 한 벌 추가.
  4. 사용 화면은 selectionField 의 `searchSheet` 에 새 종류만 선언 — **시트 파일을 페이지에서 import 하지 않는다.**
- 적용 예: `PrcmPlanIntgListPage`(검색유형별 `buildOpSearchSchema` resolver + `normalizeOpSearch`) · `HomePage`(정적 schema).

**3) checkbox '전체' 칩의 코드값 — `selectAll: { value: '0' }`.**
- 업무구분 등 checkbox 필드의 '전체' 칩은 PC 웹과 전송 규격을 맞추기 위해 **코드값 `'0'`** 을 갖는다(전체 선택 = `"0 1 2 3 4"`). schema 필드에 `selectAll: { value: '0' }` 선언 시 `CheckboxGroup` 이 전체 선택 여부에 따라 값 배열에 `'0'` 을 자동 포함/제거한다.
- 기본값이 "전체 선택"인 화면은 default 배열에도 `'0'` 을 포함시킨다. 전체 칩이 비활성(`disabled`)이거나 `single` 모드면 값 주입 없음.
- 필터 값 배열을 개수로 판정하는 로직은 `'0'` 을 제외하고 센다(적용 예: `BidPbancIntgListPage` resolver).

## 다중 선택 카드 목록 컨벤션 — 선택 UI 통일(2026-08-28 사용자 확정, 같은 날 Figma 10020:85034 로 재개정)

목록 항목을 체크박스로 다중 선택하는 화면(선택 삭제/갱신/불러오기/신청 등)은 **전부 아래 한 가지 조립**으로 통일한다.

**표준 조립 — 공통 `Card`: 타이틀(대표 필드) + titleTrailing 슬롯 체크박스 + rows:**

```tsx
<Card
  key={it.id}
  title={it.itemCdNm}                    // 대표 필드(품명/성명/사업명 등)를 타이틀로 승격 — 행에서 제외
  titleTrailing={
    <Checkbox
      variant="box"
      aria-label={`${it.itemCdNm} 선택`} // 시각 라벨 없음 — 접근성 구분은 aria-label
      checked={checkedIds.includes(it.id)}
      onCheckedChange={(c) => toggle(it.id, c === true)}
    />
  }
  rows={rows(it)}                        // 정보행(label 좌 muted / value 우) — 파란 라벨 Table 금지
/>
```

- 구 A(맨몸 Checkbox+Table)·구 B(badges 슬롯 Checkbox 'label=선택'+footer Table)는 모두 폐기 — 이 형태로만.
- 펼침/입력 폼이 있는 편집 카드는 rows 에 요약 행, footer 에 폼·토글(`BidDsctn` 참조).
- 행 안 이동 링크(품목코드 → 상세 팝업)는 value 를 파랑 버튼으로(`RegTrgtItemChc` 참조).
- 선택 상태 하이라이트(행 배경 변경)는 하지 않는다 — 체크박스가 유일한 선택 표시.
- 레퍼런스: `cm/dmstLctnColInfoAddReg/RegTrgtItemChc`(P08 정본) · `bd/ovsTmprBidCnReg/BidDsctn`(편집형) ·
  `bd/ovsBidPrtcpApfrDtl/Tab3` · `bd/ovsBfrTmprBidBidCnReg/BfrPbancBidDsctnItemDtl` ·
  `cm/dmstLctnColInfoAddReg` 등록품목명세/보안측정인원/FSC.
- 예외: 디지털캐비닛 파일목록(attach 모드)의 "행 전체 토글 + 체크 아이콘"은 파일 선택 전용 설계라 대상 아님.
