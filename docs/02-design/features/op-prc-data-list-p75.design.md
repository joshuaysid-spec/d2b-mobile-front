---
template: design
version: 1.0
feature: op-prc-data-list-p75
date: 2026-08-18
author: jhlim
project: d2b-mobile-front
plan: docs/01-plan/features/op-prc-data-list-p75.plan.md
---

# op-prc-data-list-p75 Design Document

> 품목별가격자료(MUI-OP-01-P75 `PrcDataList`) 바텀시트 — 설계서 01.조달계획 v0.82 slide72(화면)·slide73~74(항목설명).
> 결정 근거(폴더 위치·P76 분기 보류·획득구분 코드 잠정)는 plan 문서 RISK 1~3.

## 1. 컴포넌트 구조

```
PrcmPlanDtl_PrdList (T05 품목명세서 탭 — 컨테이너 소유자)
├─ SpecItemCard × N — "군급-재고번호" 행 [보기] → setPrcDataInvtNo(invtNo)
└─ BottomSheet title="품목별 가격자료" footer=닫기(ButtonGroup single)
   └─ PrcDataList invtNo={prcDataInvtNo}   ← 콘텐츠 전용(컨테이너 props 없음)
      ├─ 검색조건(dm_searchInfo)
      │  ├─ InputLabel required '획득구분' + SelectBox(7옵션, 기본 'all' 전체)
      │  ├─ InputLabel '군급'   + InputBox inputType="numeric" autoFocus
      │  ├─ InputLabel 'NIIN'   + InputBox inputType="numeric"
      │  ├─ InputLabel '부품번호' + InputBox
      │  ├─ InputLabel '품명'   + InputBox
      │  └─ Button primary [검색] (Icon Search) — Enter 키도 동일
      └─ 검색결과(dl_resultList) — 검색 확정 후에만 렌더
         ├─ 총 {total}건
         └─ '순번|구분|세부정보' 헤더 표(목업 slide72 — 사용자 확인 2026-08-18)
            ├─ 헤더 행: 순번 | 구분 | 세부정보
            └─ PrcDataItemBlock × N — 순번 열(항목 세로 스팬) + 구분/세부정보 행
               (기본 5행: 획득구분~부품번호) + '내역 펼쳐보기/접기'(21행 토글, 순번 제외 전 항목)
            ※ 항목 클릭 없음(slide72) — 행/블록에 onClick 없음
            ※ Table 컴포지트는 2열(label/value) 전용이라 미사용 — P75 전용 마크업(도메인 조립물)을
               Table 과 동일 KRDS 토큰(border-field 선·primary-faint 라벨 배경·17px Medium muted/Regular ink)으로 조립
```

- 시트 본문이 좌우 `px-16` 거터 제공(BottomSheet.tsx) → 콘텐츠에 px 래퍼 없음.
- 닫힘 시 Radix 언마운트로 폼/결과 초기화(WarSplList_Inq 와 동일, reset effect 불필요).

## 2. Props / 상태

```ts
export interface PrcDataListProps {
  /** [보기] 클릭한 행의 재고번호 — 군급/NIIN 프리필 + 자동 1회 조회. 없으면 빈 폼. */
  invtNo?: string
}
```

- 재고번호 분해: `'4240-3753116870'` → `fsc='4240'`, `niin='3753116870'` ('-' 기준, 없으면 앞 4자리/나머지).
- 로컬 state: `acqstnTypeCd('all')`·`fsc`·`niin`·`prtsNo`·`itemNm`(입력 중) + `applied: PrcDataSearchRequest | null`(검색 확정값 — null = 검색 전).
- invtNo 가 있으면 `applied` 초기값을 프리필 요청으로 세팅 → 진입 즉시 결과 표시(slide72 "진입 이전 정보가 있는 경우").
- 조회: `usePrcDataList(applied ?? EMPTY, Boolean(applied))` — WarSpl 훅의 enabled 컨벤션.
- 획득구분 'all'(전체)은 요청에서 `acqstnTypeCd` 생략.

## 3. 타입 (`types/op.ts` — 설계서 항목명 그대로)

```ts
/** 검색조건(dm_searchInfo, slide73) — 전 필드 부분 입력 가능. */
export interface PrcDataSearchRequest {
  acqstnTypeCd?: string // 획득구분(전체 = 생략) — 코드 TODO(백엔드 확정)
  fsc?: string          // 군급
  niin?: string         // NIIN(국가식별코드)
  prtsNo?: string       // 부품번호
  itemNm?: string       // 품명
}

/** 검색결과 1건(dl_resultList, slide74 — 22항목). */
export interface PrcDataItem {
  no: number            // 순번
  acqstnTypeCd: string  // 획득구분
  acqstnTypeNm: string  // 획득구분명
  fsc: string           // 군급
  niin: string          // NIIN
  prtsNo: string        // 부품번호
  unitNm: string        // 단위
  spcfctNo: string      // 규격번호
  aplcnEqpmntCd: string // 적용장비
  aplcnEqpmntNm: string // 적용장비명
  itemNm: string        // 품명
  crncNm: string        // 화폐
  crncEngNm: string     // 화폐구분명
  ntnCd: string         // 국가
  ntnNm: string         // 국가명
  untprc: string        // 단가
  qty: string           // 수량
  ctrtYmd: string       // 계약일자
  bzentyCd: string      // 업체
  bzentyNm: string      // 업체명
  acqstnYmd: string     // 획득일자
  ctrtNo: string        // 계약번호(획득근거)
}

export interface PrcDataResult { list: PrcDataItem[]; total: number }
```

## 4. 데이터 계층

| 레이어 | 추가 내용 |
|--------|----------|
| `services/op.ts` | `EP.PRC_DATA = '/v1/ops/price-data'`(추정 REST) · `getPrcDataList(req)` — USE_MOCK 이면 mocks 를 요청값으로 부분일치 필터(acqstnTypeCd 는 일치) |
| `mocks/op.ts` | `MOCK_OP.prcDataList` 4건 — 품목명세서 목업 재고번호(4240-3753116870/-71/-72)와 정합, 획득구분·화폐·국가·계약번호 형식은 설계서 표기 준수 |
| `queries/op.ts` | `opKeys.prcDataList(req)` · `usePrcDataList(req, enabled)` |

## 5. 결과 표 행 구성 (순번|구분|세부정보 헤더 표)

- **순번**은 구분 행이 아니라 **항목 블록을 세로 스팬하는 별도 열**(목업 slide72 — 사용자 확인 2026-08-18).
  세로 중앙이 아니라 **첫 행(구분/세부정보 td)과 상단 정렬** 고정 — 내역 펼쳐보기로 행이 늘어도 위치 불변(2026-08-18 요청).
- 순번(no)은 "검색결과 순번"(slide74) — 서비스 목업이 필터 후 **1부터 재부여**. 목업 데이터는 재고번호(NIIN)당 2건씩이라 어떤 [보기] 진입도 목업 slide72 처럼 순번 1·2 두 건이 표시된다.
- 구분/세부정보 기본 노출 5행(slide72 목업 순서): 획득구분 · 획득구분명 · 군급 · NIIN · 부품번호.
- 펼침 시 이어서(slide74 항목설명 순서): 단위 · 규격번호 · 적용장비 · 적용장비명 · 품명 · 화폐 · 화폐구분명 · 국가 · 국가명 · 단가(number 우측정렬) · 수량(number 우측정렬) · 계약일자 · 업체 · 업체명 · 획득일자 · 계약번호(획득근거).
- '내역 펼쳐보기/접기'는 항목 블록 전폭(순번+구분+세부정보 아래) 행.

## 6. 검증 체크리스트

- [ ] 검색조건 5필드 + 획득구분 7옵션(전체 기본) + 부분 입력 검색
- [ ] [보기] → 군급/NIIN 프리필 + 자동 조회 결과 표시
- [ ] 결과 카드 22항목 · 기본 6행 · 내역 펼쳐보기/접기 · 항목 클릭 없음
- [ ] `npm run lint && npm run build` 통과
