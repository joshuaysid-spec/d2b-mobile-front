// 품목별 가격자료 (MUI-OP-01-P75, PrcDataList) — 설계서 01.조달계획 v0.82 slide72(화면)·slide73~74(항목설명).
// 품목명세서 탭(T05)의 "군급-재고번호" [보기] 클릭 시 열리는 바텀시트의 **콘텐츠 전용** 컴포넌트.
// 컨테이너(<BottomSheet title="품목별 가격자료" footer={닫기}>)는 부모(PrcmPlanDtl_PrdList)가 소유한다
// — CLAUDE.md "BottomSheet 는 전용 래퍼(*Sheet)를 만들지 않는다".
// 폴더 위치: 설계서 화면목록(slide58)은 ovsPrcmPlanDtl/ 로 표기하나, P75 는 국내 품목명세서(slide29)와
//   국외 결과목록(slide68) 양쪽에서 호출되는 공용 시트라 P76(warSplList_Inq/) 선례대로 자체 폴더에 둔다
//   (op-prc-data-list-p75.plan.md RISK 1).
// 구성: 검색조건(dm_searchInfo — 획득구분·군급·NIIN·부품번호·품명, 부분 입력 가능) + 검색 버튼
//       + 검색결과(dl_resultList — 총 N건 + '순번|구분|세부정보' 헤더 표. 순번은 항목 블록을 세로
//         스팬하는 열, 기본 5행(획득구분~부품번호) + 내역 펼쳐보기로 21행(설계서 22항목-순번) 토글).
// 설계서 규칙(slide72):
//   - 진입 시 군급 입력 가능 상태(가상 키패드는 하이브리드 네이티브 영역 — 웹은 디바이스 키보드)
//   - 진입 이전 정보(재고번호)가 있으면 군급/NIIN 자동 입력 후 검색 결과 표시
//   - 검색결과 항목 클릭 없음(행/카드 onClick 없음)
// 닫힘 시 Radix 가 콘텐츠를 언마운트 → 재진입 시 폼/결과 자동 초기화(별도 reset effect 불필요).
import { memo, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'

import { opQueries } from '@/queries/bds/op/opQueries'
import type { MockPrcDataItem, MockPrcDataSearchRequest } from '@/types/mock/op'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { cn } from '@/utils/cn'

// 획득구분(acqstnTypeCd) — 설계서 slide73 라벨. 코드값은 잠정('01'~'06') — TODO(백엔드 확정).
// 'all'(전체)은 요청에서 acqstnTypeCd 를 생략하는 UI 전용 센티널.
const ACQSTN_TYPE_ALL = 'all'
const ACQSTN_TYPES = [
  { value: ACQSTN_TYPE_ALL, label: '전체' },
  { value: '01', label: '상업실적사' },
  { value: '02', label: 'FMS실적가' },
  { value: '03', label: 'BOA청구가' },
  { value: '04', label: 'CSP구매가' },
  { value: '05', label: '업체공표(견적)가' },
  { value: '06', label: '무관정보가' },
]

// 재고번호 → 군급(fsc, 앞 4자리) + NIIN(나머지) 분해.
// 품목명세서 표기 '4240-3753116870' 은 '-' 기준, 국외 결과목록 표기(13자리 연속)는 자리수 기준.
function parseInvtNo(invtNo?: string): { fsc: string; niin: string } {
  if (!invtNo) return { fsc: '', niin: '' }
  const dash = invtNo.indexOf('-')
  if (dash >= 0) return { fsc: invtNo.slice(0, dash), niin: invtNo.slice(dash + 1) }
  return { fsc: invtNo.slice(0, 4), niin: invtNo.slice(4) }
}

// 결과 표의 필드 행 — 순번은 행이 아니라 별도 열(목업 '순번|구분|세부정보' 헤더 표).
interface PrcDataRow {
  label: string
  value: string
  /** 'number' = 우측 정렬(숫자/금액) — Table 컴포지트의 type 과 동일 규칙. */
  type?: 'number'
}

// 검색결과 1건 → 구분/세부정보 행 21개(설계서 slide74 항목설명 순서 — 순번 제외).
function buildRows(item: MockPrcDataItem): PrcDataRow[] {
  return [
    { label: '획득구분', value: item.acqstnTypeCd },
    { label: '획득구분명', value: item.acqstnTypeNm },
    { label: '군급', value: item.fsc },
    { label: 'NIIN', value: item.niin },
    { label: '부품번호', value: item.prtsNo },

    { label: '단위', value: item.unitNm },
    { label: '규격번호', value: item.spcfctNo },
    { label: '적용장비', value: item.aplcnEqpmntCd },
    { label: '적용장비명', value: item.aplcnEqpmntNm },
    { label: '품명', value: item.itemNm },
    { label: '화폐', value: item.crncNm },
    { label: '화폐구분명', value: item.crncEngNm },
    { label: '국가', value: item.ntnCd },
    { label: '국가명', value: item.ntnNm },
    { label: '단가', value: item.untprc, type: 'number' },
    { label: '수량', value: item.qty, type: 'number' },
    { label: '계약일자', value: item.ctrtYmd },
    { label: '업체', value: item.bzentyCd },
    { label: '업체명', value: item.bzentyNm },
    { label: '획득일자', value: item.acqstnYmd },
    { label: '계약번호(획득근거)', value: item.ctrtNo },
  ]
}

// 기본 노출 행수 — slide72 목업(획득구분~부품번호 5행, 순번은 열). 나머지는 "내역 펼쳐보기"로 토글.
const DEFAULT_VISIBLE = 5

// 결과 표 셀 공통 클래스 — Table 컴포지트와 동일 토큰(border-field 선 · primary-faint 라벨 배경 ·
// 17px Medium muted 라벨 / 17px Regular ink 값). 목업이 '순번|구분|세부정보' 3열 헤더 표라
// 2열(label/value) 전용인 Table 을 못 쓰고 P75 전용 마크업으로 조립한다(도메인 전용 조립물).
// 순번 셀: items-start — 세로 중앙이 아니라 첫 행(구분/세부정보 td)과 상단 정렬(2026-08-18 요청).
//   양쪽 py-krds-5 가 같아 첫 행 텍스트와 줄이 맞고, 내역 펼쳐보기로 행이 늘어도 위치가 고정된다.
const CELL_NO = 'flex w-12 shrink-0 items-start justify-center border-r border-krds-border-field px-krds-3 py-krds-5'
const CELL_LABEL =
  'flex w-[104px] shrink-0 items-center border-r border-krds-border-field bg-krds-bg-primary-faint px-krds-5 py-krds-5 text-[17px] font-medium leading-normal text-krds-text-muted'

// 검색결과 1건 블록 — 순번 열(항목 전체 세로 스팬) + 구분/세부정보 행들 + 내역 펼쳐보기/접기.
// 항목 클릭 없음(slide72) — 토글 버튼 외 인터랙션 없음.
const PrcDataItemBlock = memo(function PrcDataItemBlock({ item }: { item: MockPrcDataItem }) {
  const [expanded, setExpanded] = useState(false)
  const allRows = useMemo(() => buildRows(item), [item])
  const rows = expanded ? allRows : allRows.slice(0, DEFAULT_VISIBLE)

  return (
    <div className="flex flex-col border-t border-krds-border-field">
      <div role="row" className="flex items-stretch">
        {/* 순번 — 항목 블록 전체를 세로로 차지하는 열 */}
        <div role="cell" className={cn(CELL_NO, 'text-[17px] leading-normal text-krds-text-ink tabular-nums')}>
          {item.no}
        </div>
        <div className="flex min-w-px flex-1 flex-col">
          {rows.map((row, i) => (
            <div
              role="row"
              key={row.label}
              className={cn('flex items-stretch', i > 0 && 'border-t border-krds-border-field')}
            >
              <div role="rowheader" className={CELL_LABEL}>
                {row.label}
              </div>
              <div
                role="cell"
                className={cn(
                  'flex min-w-px flex-1 items-center px-krds-5 py-krds-5 text-[17px] leading-normal text-krds-text-ink',
                  row.type === 'number' ? 'justify-end text-right tabular-nums' : 'wrap-break-word',
                )}
              >
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 내역 펼쳐보기/접기 — 항목 블록 전폭(순번+구분+세부정보 아래) */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-center gap-krds-3 border-t border-krds-border-field py-krds-6 text-[17px] font-medium text-krds-text-ink"
      >
        {expanded ? '내역 접기' : '내역 펼쳐보기'}
        <Icon
          name="ExpandMore"
          size={20}
          aria-hidden
          className={cn('transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>
    </div>
  )
})

export interface PrcDataListProps {
  /** [보기] 클릭한 행의 재고번호 — 군급/NIIN 프리필 + 진입 즉시 1회 조회. 없으면 빈 폼. */
  invtNo?: string
}

export function PrcDataList({ invtNo }: PrcDataListProps) {
  const init = useMemo(() => parseInvtNo(invtNo), [invtNo])

  // 검색조건(dm_searchInfo) — 입력 중 값. 전 필드 부분 입력 가능(검증 없음).
  const [acqstnTypeCd, setAcqstnTypeCd] = useState(ACQSTN_TYPE_ALL)
  const [fsc, setFsc] = useState(init.fsc)
  const [niin, setNiin] = useState(init.niin)
  const [prtsNo, setPrtsNo] = useState('')
  const [itemNm, setItemNm] = useState('')

  // 검색 확정값 — null = 검색 전. 진입 정보(invtNo)가 있으면 즉시 조회(slide72 "진입 이전 정보가 있는 경우").
  const [applied, setApplied] = useState<MockPrcDataSearchRequest | null>(() =>
    init.fsc || init.niin
      ? { fsc: init.fsc || undefined, niin: init.niin || undefined }
      : null,
  )
  const { data } = opQueries.useSelectPrcDataListByItem(applied ?? {}, applied !== null)

  // 진입 시 군급 입력 가능 상태(slide72) — Radix Dialog 가 마운트 직후 첫 포커서블(닫기 X)로 포커스를
  // 옮기므로, 그 뒤 태스크에서 군급 입력으로 이동시킨다(autoFocus 속성만으론 밀려남).
  const fscRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const t = window.setTimeout(() => fscRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [])

  const handleSearch = () => {
    setApplied({
      acqstnTypeCd: acqstnTypeCd === ACQSTN_TYPE_ALL ? undefined : acqstnTypeCd,
      fsc: fsc.trim() || undefined,
      niin: niin.trim() || undefined,
      prtsNo: prtsNo.trim() || undefined,
      itemNm: itemNm.trim() || undefined,
    })
  }
  const searchOnEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      <p className="text-krds-body-md text-krds-text-muted">
        품목별 가격자료 정보를 입력해주세요.
      </p>

      {/* 검색 조건 (dm_searchInfo) — 각 입력 폼은 부분 입력 가능(slide72) */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel required>획득구분</InputLabel>
        <SelectBox items={ACQSTN_TYPES} value={acqstnTypeCd} onValueChange={setAcqstnTypeCd} />
      </div>
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="prc-data-fsc">군급</InputLabel>
        <InputBox
          id="prc-data-fsc"
          ref={fscRef}
          value={fsc}
          inputType="numeric"
          placeholder="정보를 입력해주세요."
          onChange={(e) => setFsc(e.target.value)}
          onClear={fsc ? () => setFsc('') : undefined}
          onKeyDown={searchOnEnter}
        />
      </div>
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="prc-data-niin">NIIN</InputLabel>
        <InputBox
          id="prc-data-niin"
          value={niin}
          inputType="numeric"
          placeholder="정보를 입력해주세요."
          onChange={(e) => setNiin(e.target.value)}
          onClear={niin ? () => setNiin('') : undefined}
          onKeyDown={searchOnEnter}
        />
      </div>
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="prc-data-prts-no">부품번호</InputLabel>
        <InputBox
          id="prc-data-prts-no"
          value={prtsNo}
          placeholder="정보를 입력해주세요."
          onChange={(e) => setPrtsNo(e.target.value)}
          onClear={prtsNo ? () => setPrtsNo('') : undefined}
          onKeyDown={searchOnEnter}
        />
      </div>
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="prc-data-item-nm">품명</InputLabel>
        <InputBox
          id="prc-data-item-nm"
          value={itemNm}
          placeholder="정보를 입력해주세요."
          onChange={(e) => setItemNm(e.target.value)}
          onClear={itemNm ? () => setItemNm('') : undefined}
          onKeyDown={searchOnEnter}
        />
      </div>
      <Button variant="primary" className="w-full" onClick={handleSearch}>
        <Icon name="Search" size={20} />
        검색
      </Button>

      {/* 검색 결과 (dl_resultList) — 항목 클릭 없음 */}
      {data && (
        <div className="flex flex-col gap-krds-5 border-t border-krds-border-divider pt-krds-7">
          <p className="text-krds-body-sm text-krds-text-primary-active">총 {data.total}건</p>
          {data.list.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            // 목업(slide72) '순번|구분|세부정보' 헤더 표 — 항목 블록들이 한 표 안에 이어진다.
            <div role="table" className="flex w-full flex-col border-y border-krds-border-field bg-background">
              <div
                role="row"
                className="flex items-stretch bg-krds-bg-primary-faint text-[17px] font-medium leading-normal text-krds-text-muted"
              >
                <div role="columnheader" className={cn(CELL_NO, 'bg-transparent')}>
                  순번
                </div>
                <div role="columnheader" className={cn(CELL_LABEL, 'bg-transparent')}>
                  구분
                </div>
                <div role="columnheader" className="flex min-w-px flex-1 items-center px-krds-5 py-krds-5">
                  세부정보
                </div>
              </div>
              {data.list.map((item) => (
                <PrcDataItemBlock key={item.no} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
PrcDataList.displayName = 'PrcDataList'
