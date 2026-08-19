// 생산자 검색 (MUI-OP-01-P72, 문서 slide 58-59). 검색필터의 '발주기관' selectionField 에서 호출.
// 생산자명으로 생산자 목록(CAGE 코드)을 조회 → 결과 클릭 시 생산자명을 호출 필드로 반환.
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/footer(초기화·검색)는 SearchFilter 셸이 슬롯으로 소유한다.
//   폼 상태는 캡슐화하고 footer 동작만 SearchSheetHandle(ref)로 노출. 닫힘 시 언마운트로 상태 자동 초기화.
// 목록은 목업(추후 API: opService.selectProducerSearch 로 대체).
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import type { SearchSheetHandle } from '@/types/search-filter'

// 검색결과 1건 (dl_resultList)
interface ProducerResult {
  cage: string // 생산자코드(CAGE)
  prdctnNm: string // 생산자명
}

// 목업 결과 (문서 예시값 기반) — 추후 API 로 대체
const MOCK_PRODUCERS: ProducerResult[] = [
  { cage: '00000', prdctnNm: 'ORDNANCE CORPS' },
  { cage: '00001', prdctnNm: 'A B MGC CO' },
  { cage: '00003', prdctnNm: 'A B C PRODUCTS CO INC' },
  { cage: '00004', prdctnNm: 'STOUGHTON YOUTH COMMISSION' },
]

export interface PrdcrInqProps {
  /** 결과 선택 시 호출 — 선택한 생산자명을 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (prdctnNm: string) => void
}

const PrdcrInq = forwardRef<SearchSheetHandle, PrdcrInqProps>(({ onSelect }, ref) => {
  const [prdctnNm, setPrdctnNm] = useState('')
  const [results, setResults] = useState<ProducerResult[] | null>(null) // null = 검색 전

  const reset = useCallback(() => {
    setPrdctnNm('')
    setResults(null)
  }, [])

  // Like 검색(목업) — 추후 opService.selectProducerSearch 로 대체.
  const handleSearch = useCallback(() => {
    const filtered = MOCK_PRODUCERS.filter(
      (p) => !prdctnNm || p.prdctnNm.toLowerCase().includes(prdctnNm.toLowerCase()),
    )
    setResults(filtered)
    console.log('[P72] 생산자 검색', { prdctnNm, hit: filtered.length })
  }, [prdctnNm])

  // footer(초기화/검색)는 셸이 소유 → 동작만 ref 로 노출.
  useImperativeHandle(ref, () => ({ reset, search: handleSearch }), [reset, handleSearch])

  const handlePick = (p: ProducerResult) => onSelect(p.prdctnNm)

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 검색 조건 (dm_searchInfo) */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel>생산자명</InputLabel>
        <InputBox
          value={prdctnNm}
          placeholder="정보를 입력해주세요."
          onChange={(e) => setPrdctnNm(e.target.value)}
          onClear={() => setPrdctnNm('')}
        />
      </div>

      {/* 검색 결과 (dl_resultList) — 행 클릭 시 생산자명 반환 */}
      {results !== null && (
        <div className="flex flex-col gap-krds-5">
          <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((p) => (
                <li key={p.cage}>
                  <button
                    type="button"
                    onClick={() => handlePick(p)}
                    className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                  >
                    <span className="text-[17px] font-bold text-krds-text-ink">
                      {p.prdctnNm}
                    </span>
                    <span className="text-krds-body-sm text-krds-text-muted">
                      CAGE {p.cage}
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
PrdcrInq.displayName = 'PrdcrInq'

export { PrdcrInq }
