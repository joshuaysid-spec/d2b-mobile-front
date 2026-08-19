// 품목별 검색 (MUI-OP-01-P71, 문서 slide 56-57). 검색필터의 '품명' selectionField 에서 호출.
// 요구년도(필수)·품명·재고번호·부품번호로 품목을 조회 → 결과 클릭 시 품명을 호출 필드로 반환.
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/footer(초기화·검색)는 SearchFilter 셸이 슬롯으로 소유한다.
//   폼 상태는 이 컴포넌트가 캡슐화하고, footer 동작(reset/search)만 SearchSheetHandle(ref)로 노출.
//   닫힘 시 Radix 가 콘텐츠를 언마운트 → 재진입 시 상태가 자동 초기화(별도 reset effect 불필요).
// 목록은 목업(추후 API: opService.selectItemSearch 로 대체).
// "가상 키패드"는 하이브리드 네이티브 영역 — 웹은 디바이스 기본 키보드 사용(별도 구현 X).
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import dayjs from 'dayjs'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import type { SearchSheetHandle } from '@/types/search-filter'

// 검색결과 1건 (dl_resultList) — 추후 API 응답 매핑
interface ItemResult {
  invtNo: string // 재고번호
  prtsNo: string // 부품번호
  itemNm: string // 품명
}

// 목업 결과 (문서 예시값 기반) — 추후 API 로 대체
const MOCK_ITEMS: ItemResult[] = [
  { invtNo: '152302089999', prtsNo: '502323-12542-032', itemNm: 'BELLCOSRA ASSEMBTL' },
  { invtNo: '152302081234', prtsNo: '502323-12542-001', itemNm: 'K5 방독면 정화통' },
  { invtNo: '843012005678', prtsNo: '770110-00021-100', itemNm: '전투화 깔창' },
  { invtNo: '841511009876', prtsNo: '880220-00045-210', itemNm: '야전상의 단추' },
]

export interface ItemInqProps {
  /** 결과 선택 시 호출 — 선택한 품명을 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (itemNm: string) => void
}

const ItemInq = forwardRef<SearchSheetHandle, ItemInqProps>(({ onSelect }, ref) => {
  const [year, setYear] = useState(String(dayjs().year())) // 요구년도 — 당해년도 기본(On-Load)
  const [itemNm, setItemNm] = useState('')
  const [invtNo, setInvtNo] = useState('')
  const [prtsNo, setPrtsNo] = useState('')
  const [results, setResults] = useState<ItemResult[] | null>(null) // null = 검색 전

  const reset = useCallback(() => {
    setYear(String(dayjs().year()))
    setItemNm('')
    setInvtNo('')
    setPrtsNo('')
    setResults(null)
  }, [])

  // Like 검색(목업) — 입력된 필드만 부분일치. 추후 opService.selectItemSearch 로 대체.
  const handleSearch = useCallback(() => {
    const filtered = MOCK_ITEMS.filter(
      (it) =>
        (!itemNm || it.itemNm.includes(itemNm)) &&
        (!invtNo || it.invtNo.includes(invtNo)) &&
        (!prtsNo || it.prtsNo.includes(prtsNo)),
    )
    setResults(filtered)
    console.log('[P71] 품목별 검색', { year, itemNm, invtNo, prtsNo, hit: filtered.length })
  }, [year, itemNm, invtNo, prtsNo])

  // footer(초기화/검색)는 셸이 소유 → 동작만 ref 로 노출.
  useImperativeHandle(ref, () => ({ reset, search: handleSearch }), [reset, handleSearch])

  const handlePick = (it: ItemResult) => onSelect(it.itemNm)

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 검색 조건 (dm_searchInfo) */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel required>요구년도</InputLabel>
        <InputBox
          value={year}
          inputMode="numeric"
          maxLength={4}
          placeholder="요구년도"
          onChange={(e) => setYear(e.target.value)}
          onClear={() => setYear('')}
        />
      </div>
      <div className="flex flex-col gap-krds-5">
        <InputLabel>품명</InputLabel>
        <InputBox
          value={itemNm}
          placeholder="정보를 입력해주세요."
          onChange={(e) => setItemNm(e.target.value)}
          onClear={() => setItemNm('')}
        />
      </div>
      <div className="flex flex-col gap-krds-5">
        <InputLabel>재고번호</InputLabel>
        <InputBox
          value={invtNo}
          placeholder="정보를 입력해주세요."
          onChange={(e) => setInvtNo(e.target.value)}
          onClear={() => setInvtNo('')}
        />
      </div>
      <div className="flex flex-col gap-krds-5">
        <InputLabel>부품번호</InputLabel>
        <InputBox
          value={prtsNo}
          placeholder="정보를 입력해주세요."
          onChange={(e) => setPrtsNo(e.target.value)}
          onClear={() => setPrtsNo('')}
        />
      </div>

      {/* 검색 결과 (dl_resultList) — 행 클릭 시 품명 반환 */}
      {results !== null && (
        <div className="flex flex-col gap-krds-5">
          <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((it) => (
                <li key={it.invtNo}>
                  <button
                    type="button"
                    onClick={() => handlePick(it)}
                    className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                  >
                    <span className="text-[17px] font-bold text-krds-text-ink">
                      {it.itemNm}
                    </span>
                    <span className="text-krds-body-sm text-krds-text-muted">
                      재고번호 {it.invtNo}
                    </span>
                    <span className="text-krds-body-sm text-krds-text-muted">
                      부품번호 {it.prtsNo}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
})
ItemInq.displayName = 'ItemInq'

export { ItemInq }
