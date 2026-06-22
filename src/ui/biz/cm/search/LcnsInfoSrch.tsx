// 면허정보검색 (MUI-BD-01-P05). 검색필터의 '면허정보' selectionField 에서 호출.
// 면허명/면허코드를 Like 검색 → 결과 클릭 시 면허명을 호출 필드로 반환.
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/footer(초기화·검색)는 SearchFilter 셸이 슬롯으로 소유한다.
//   폼 상태는 캡슐화하고 footer 동작만 SearchSheetHandle(ref)로 노출. 닫힘 시 언마운트로 상태 자동 초기화.
// 목록은 목업(추후 API: bdService.searchLicenses). DeptInq 와 동일 패턴.
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import type { SearchSheetHandle } from '@/types/search-filter'

// 검색결과 1건 (dl_resultList) — 면허코드 + 면허명
interface LicenseResult {
  lcnsCd: string // 면허코드
  lcnsNm: string // 면허명
}

// 목업 결과 (설계서 P05 예시값 기반) — 추후 API 로 대체
const MOCK_LICENSES: LicenseResult[] = [
  { lcnsCd: '0101', lcnsNm: '토목공사업' },
  { lcnsCd: '0102', lcnsNm: '건축공사업' },
  { lcnsCd: '0103', lcnsNm: '토목건축공사업' },
  { lcnsCd: '0201', lcnsNm: '전기공사업' },
  { lcnsCd: '0202', lcnsNm: '정보통신공사업' },
  { lcnsCd: '0203', lcnsNm: '소방시설공사업' },
  { lcnsCd: '0301', lcnsNm: '조경공사업' },
  { lcnsCd: '0302', lcnsNm: '산업·환경설비공사업' },
]

export interface LcnsInfoSrchProps {
  /** 결과 선택 시 호출 — 선택한 면허명을 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (lcnsNm: string) => void
}

const LcnsInfoSrch = forwardRef<SearchSheetHandle, LcnsInfoSrchProps>(({ onSelect }, ref) => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<LicenseResult[] | null>(null) // null = 검색 전

  const reset = useCallback(() => {
    setKeyword('')
    setResults(null)
  }, [])

  // Like 검색(목업) — 추후 bdService.searchLicenses 로 대체.
  const handleSearch = useCallback(() => {
    const kw = keyword.trim()
    const filtered = MOCK_LICENSES.filter(
      (l) => !kw || l.lcnsNm.includes(kw) || l.lcnsCd.includes(kw),
    )
    setResults(filtered)
    console.log('[P05] 면허정보검색', { keyword, hit: filtered.length })
  }, [keyword])

  // footer(초기화/검색)는 셸이 소유 → 동작만 ref 로 노출.
  useImperativeHandle(ref, () => ({ reset, search: handleSearch }), [reset, handleSearch])

  const handlePick = (l: LicenseResult) => onSelect(l.lcnsNm)

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 검색 조건 (dm_searchInfo) */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel>면허정보</InputLabel>
        <InputBox
          value={keyword}
          placeholder="면허명 또는 면허코드를 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />
      </div>

      {/* 검색 결과 (dl_resultList) — 행 클릭 시 면허명 반환 */}
      {results !== null && (
        <div className="flex flex-col gap-krds-5">
          <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((l) => (
                <li key={l.lcnsCd}>
                  <button
                    type="button"
                    onClick={() => handlePick(l)}
                    className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                  >
                    <span className="text-[17px] font-bold text-krds-text-ink">{l.lcnsNm}</span>
                    <span className="text-krds-body-sm text-krds-text-muted">
                      면허코드 {l.lcnsCd}
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
LcnsInfoSrch.displayName = 'LcnsInfoSrch'

export { LcnsInfoSrch }
