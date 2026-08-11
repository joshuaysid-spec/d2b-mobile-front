---
template: design
version: 1.0
feature: op-war-spl-list-t73-t75
date: 2026-08-11
author: jhlim
project: d2b-mobile-front
project-version: 0.1.0
---

# op-war-spl-list-t73-t75 Design Document

> 연간조달계획 상세(`/op/ovs/:id`)의 목록정보조회 3탭 + 업체정보 시트. Plan: `docs/01-plan/features/op-war-spl-list-t73-t75.plan.md`
> 설계서: `docs/spec/D2BA-AP-3CD-0601.사용자인터페이스설계서-01.조달계획-모바일_v0.82.pptx` slide58(화면목록) · slide77~81(화면) · slide82~85(항목설명/이벤트)

---

## 1. 화면 구성

```
/op/ovs/:id  OvsPrcmPlanDtlPage   (헤더 '연간조달계획 상세')
├─ sticky: SummaryInfo(요약, collapsed) + StepBar(진행단계) + TabList
├─ [형상자료] WarSplList_Cnfg     (MUI-OP-01-T73)
│    ├─ WarSplList_NiinSrch       NIIN 입력 + 검색
│    └─ Accordion(multiple, 기본 전체 펼침)
│         ├─ AccordionSection 식별정보   Table × (디폴트 1 + 검색 1)
│         └─ AccordionSection 참조번호   건별 Table + [업체정보 보기](w-full), 2건째부터 상단 구분선
│              └─ BottomSheet 업체정보 → WarSplList_BzEnty  (MUI-OP-01-P77)
├─ [식별자료] WarSplList_Idntf    (T74) 검색 + SectionTitle 식별자료 + Table × (디폴트 1 + 검색 1), 23행
└─ [참고자료] WarSplList_Ref      (T75) 검색 + AccordionSection 참고자료(titleInfo="총 N건")
                                        + Table × (디폴트 N + 검색 M), 10행
```

**레이아웃 조정(2026-08-11 요청)**
- 탭 콘텐츠 루트에 `pt-krds-8`(16px) — sticky 탭과 NIIN 검색 섹션 사이 여백. 3탭 공통.
- 참조번호 '업체정보 보기' = `w-full`. 건 사이 혼동 방지로 2건째부터 `border-t border-krds-border-divider pt-krds-7`.
- 식별정보·참조번호·참고자료는 `Accordion`/`AccordionSection`. 참고자료 총 건수는 `titleInfo` 슬롯 사용(별도 span 제거).
- ⚠️ 식별자료(T74) 섹션은 요청 목록에 없어 `SectionTitle` 유지 — 아코디언 통일 여부는 확인 필요.

**파일 위치·명명** — 설계서 slide58 "화면 목록"의 화면명(영문)·경로 그대로.
`src/ui/biz/op/ovsPrcmPlanDtl/{WarSplList_Cnfg, WarSplList_Idntf, WarSplList_Ref, WarSplList_BzEnty}.tsx`
설계서 ID 없는 하위 조립물은 상위 ID 파생 → `WarSplList_NiinSrch.tsx`.

## 2. 표시 규칙 — 디폴트 값 + 검색 결과 이어붙이기

사용자 확정(2026-08-11): **각 영역의 내용은 해당 연간조달계획이 보유한 디폴트 값**이고,
NIIN 검색 시 **디폴트 값 아래로 검색 결과가 이어붙는다**(교체 아님).

```tsx
const { data: base }  = useWarSplCnfg({ planId })                                  // 디폴트
const { data: found } = useWarSplCnfg({ planId, niin: appliedNiin }, Boolean(appliedNiin)) // 검색
const refList = [...(base?.refList ?? []), ...(found?.refList ?? [])]               // 영역별 concat
```

- 훅은 같은 것을 두 번 호출하고, 두 번째는 `enabled = Boolean(appliedNiin)` 으로 검색 전 미호출.
- **재검색 시 이어붙은 블록은 마지막 검색 결과로 교체**된다(검색마다 무한 누적 아님).
- 목업은 디폴트/검색을 서로 다른 품목으로 반환(`warSplCnfg` vs `warSplCnfgSrch`)해 동작이 화면에 드러난다.

## 3. NIIN 상태 소유

설계서 slide78: *"다른 탭 페이지에서 NIIN 설정 시 탭에 모두 NIIN 유지"* → **페이지가 소유**.

| 상태 | 소유 | 역할 |
|---|---|---|
| `niin` | `OvsPrcmPlanDtlPage` | 입력 중 값. 3탭에 동일하게 전달 → 탭 전환해도 유지 |
| `appliedNiin` | 〃 | 검색 실행 시에만 확정. 조회 파라미터(queryKey) |
| `planId` | 〃 (`useParams`) | 디폴트 조회 기준 |

- 삭제(X) 버튼: 공통 `InputBox` 를 수정하지 않고 `onClear={value ? clear : undefined}` 로
  값이 없을 때 버튼 자체를 렌더하지 않아 설계서 "내용이 없는 경우 삭제 버튼 숨김" 을 만족.

## 4. 데이터 계층 (CLAUDE.md API 컨벤션)

| 레이어 | 추가분 |
|---|---|
| `types/op.ts` | `WarSplInqRequest` · `WarSplItemInfo` · `WarSplRefNo` · `WarSplCnfg` · `WarSplIdntf` · `WarSplRef` · `WarSplBzEnty` |
| `mocks/op.ts` | `warSplCnfg(Srch)` · `warSplIdntf(Srch)` · `warSplRef(Srch)` · `warSplBzEnty` |
| `services/op.ts` | EP 4건(`WAR_SPL_CNFG/IDNTF/REF/BZ_ENTY`) + 메서드 4건. 목업은 `req.niin` 유무로 분기 |
| `queries/op.ts` | `opKeys.warSpl*` + `useWarSplCnfg/Idntf/Ref/BzEnty`(모두 useQuery) |

- 탭/페이지는 서비스를 직접 import 하지 않는다(훅만 사용).
- 업체정보(P77)만 `enabled: Boolean(prdctnCd)` — 시트를 열 때만 조회.

## 5. 항목명 — 설계서 그대로 (임의 작명 없음)

| 데이터영역 | 항목 |
|---|---|
| `dm_itemInfo` | invtNo · itemNmEng · itemNmKor · fsc |
| `dl_refList`(참조번호) | rfrncNo · type · prdctnCd · prdctnNm |
| `dm_idntfInfo` | fsc · itemNmEng · itemNmKor · fcc · drc · fiigNo · inc · adpec · pmic · rpdmrc · sbstInvtNo · tiic · cs · ntl · **ls** · demil · esdc · nsc · hmic · hcc · picNm · niinYmd · chgYmd |
| `dl_refList`(참고자료) | refNo · nscm · rnfc · rncc · rnvc · dac · rnaa · rnsc · **rnjc** · sadc |
| `dm_bzentyInfo` | bzentyNm · rprsvNm · addr · bzmnNo · tlno · fxno |

**설계서 표기 이슈 3건(확인 필요)**
1. 재고번호 식별부호(IS) 항목명이 설계서에 `ls`(소문자 L) — 오타로 보이나 설계서 그대로 유지.
2. 참고자료 '교정' 이 화면 목업은 `RNIC`, 항목설명 1.7 은 `RNJC/rnjc` — **항목설명 채택**.
3. 참고자료 '설계(SADC)' 는 항목설명에만 있고 화면 목업 컬럼에 없음 — 데이터영역 기준으로 **표시**.
4. `id` 는 설계서 미정의 — 목록 React key 용(참조번호/참고번호 중복 가능).

## 6. 검증 결과 (2026-08-11)

- `npx tsc --noEmit` · `npm run lint`(error 0) · `npm run build` 통과. `OvsPrcmPlanDtlPage` chunk 9.11 kB(gzip 3.61 kB).
- 헤드리스 브라우저 실측(`/op/ovs/6`, 콘솔 에러 0 · 실패 요청 0):
  - 탭 3개 렌더 · 형상자료 진입 시 Table 3개(식별정보 1 + 참조번호 2), 업체정보 보기 2개
  - NIIN 검색 후 Table 3 → 5, 디폴트(BELSCDFE ASSEMVGBY) 유지 + 검색(ROTOR HEAD ASSEMBLY) 추가, 버튼 3개
  - 탭 전환 시 NIIN 유지 확인 — 식별자료 Table 2 / rowheader 46(23×2), 참고자료 Table 4 / rowheader 40(10×4)
  - 업체정보 시트: 업체명·대표자·본사주소·사업자번호·전화번호·FAX + 닫기 렌더
- 레이아웃 조정 후 재측정: 탭 하단↔검색 섹션 간격 17px(pt 16 + border 1) · 아코디언 트리거 식별정보/참조번호 `aria-expanded=true`
  · '업체정보 보기' 폭 = 부모 폭(100%) · 참조번호 블록 border-top `0px, 1px, 1px`(첫 건 제외) · 참고자료 트리거 "참고자료 총 3건"

## 7. 남은 작업

- T71/T72(`OvsPrcmPlanDtl`·`OvsPrcmPlanDtl_RsltList`)는 파일 보존 상태로 **진입점 없음** — 국외 조달계획 동선 확정 시 재연결.
- 품목별가격자료(P75 `PrcDataList`) 미구현.
- 반입 후 EP 4건 실경로 대조 + `WarSplInqRequest.planId` 실제 파라미터명 확정.
