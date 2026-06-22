// 지역검색 (MUI-BD-01-P03). 검색필터의 '지역' selectionField 에서 호출.
// 주소(시/도·시군구)를 Like 검색 → 결과 클릭 시 지역명(시도+시군구)을 호출 필드로 반환(시군구까지).
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/footer(초기화·검색)는 SearchFilter 셸이 슬롯으로 소유한다.
//   폼 상태는 캡슐화하고 footer 동작만 SearchSheetHandle(ref)로 노출. 닫힘 시 언마운트로 상태 자동 초기화.
// 목록은 목업(추후 API: bdService.searchRegions). DeptInq 와 동일 패턴.
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import type { SearchSheetHandle } from '@/types/search-filter'

// 검색결과 1건 (dl_resultList) — 시/도 + 시군구
interface RegionResult {
  sido: string // 시/도
  sigungu: string // 시/군/구
}

// 목업 결과 (설계서 P03 예시값 기반) — 추후 API 로 대체
const MOCK_REGIONS: RegionResult[] = [
  { sido: '서울특별시', sigungu: '종로구' },
  { sido: '서울특별시', sigungu: '중구' },
  { sido: '부산광역시', sigungu: '해운대구' },
  { sido: '대구광역시', sigungu: '수성구' },
  { sido: '인천광역시', sigungu: '연수구' },
  { sido: '경기도', sigungu: '성남시 분당구' },
  { sido: '경기도', sigungu: '수원시 영통구' },
  { sido: '강원특별자치도', sigungu: '춘천시' },
  { sido: '충청남도', sigungu: '천안시 서북구' },
  { sido: '경상남도', sigungu: '창원시 의창구' },
]

export interface RgnSrchProps {
  /** 결과 선택 시 호출 — 선택한 지역명(시도+시군구)을 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (region: string) => void
}

const RgnSrch = forwardRef<SearchSheetHandle, RgnSrchProps>(({ onSelect }, ref) => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<RegionResult[] | null>(null) // null = 검색 전

  const reset = useCallback(() => {
    setKeyword('')
    setResults(null)
  }, [])

  // Like 검색(목업) — 추후 bdService.searchRegions 로 대체.
  const handleSearch = useCallback(() => {
    const kw = keyword.trim()
    const filtered = MOCK_REGIONS.filter(
      (r) => !kw || r.sido.includes(kw) || r.sigungu.includes(kw),
    )
    setResults(filtered)
    console.log('[P03] 지역검색', { keyword, hit: filtered.length })
  }, [keyword])

  // footer(초기화/검색)는 셸이 소유 → 동작만 ref 로 노출.
  useImperativeHandle(ref, () => ({ reset, search: handleSearch }), [reset, handleSearch])

  const handlePick = (r: RegionResult) => onSelect(`${r.sido} ${r.sigungu}`)

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 검색 조건 (dm_searchInfo) */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel>지역</InputLabel>
        <InputBox
          value={keyword}
          placeholder="시/도, 시/군/구를 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />
      </div>

      {/* 검색 결과 (dl_resultList) — 행 클릭 시 지역명 반환 */}
      {results !== null && (
        <div className="flex flex-col gap-krds-5">
          <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((r) => (
                <li key={`${r.sido} ${r.sigungu}`}>
                  <button
                    type="button"
                    onClick={() => handlePick(r)}
                    className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                  >
                    <span className="text-[17px] font-bold text-krds-text-ink">
                      {r.sido} {r.sigungu}
                    </span>
                    <span className="text-krds-body-sm text-krds-text-muted">{r.sido}</span>
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
RgnSrch.displayName = 'RgnSrch'

export { RgnSrch }
