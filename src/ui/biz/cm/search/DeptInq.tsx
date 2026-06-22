// 발주부서(기관) 검색 (MUI-BD-01-P04, 입찰 설계서). 검색필터의 '발주기관' selectionField 에서 호출.
// 발주기관명으로 기관 목록(기관구분+발주기관)을 Like 검색 → 결과 클릭 시 발주기관명을 호출 필드로 반환.
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/footer(초기화·검색)는 SearchFilter 셸이 슬롯으로 소유한다.
//   폼 상태는 캡슐화하고 footer 동작만 SearchSheetHandle(ref)로 노출. 닫힘 시 언마운트로 상태 자동 초기화.
// 목록은 목업(추후 API: opService.searchDepts 로 대체). PrdcrInq 와 동일 패턴.
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import type { SearchSheetHandle } from '@/types/search-filter'

// 검색결과 1건 (dl_resultList) — 발주기관명 + 기관구분
interface DeptResult {
  instNm: string // 발주기관(부서)명
  instSe: string // 기관구분(육군/군수사/교육사/학교/경리단 등)
}

// 목업 결과 (설계서 P04 예시값 기반) — 추후 API 로 대체
const MOCK_DEPTS: DeptResult[] = [
  { instNm: '육군중앙경리단', instSe: '경리단' },
  { instNm: '육군군수사령부', instSe: '군수사' },
  { instNm: '육군교육사령부', instSe: '교육사' },
  { instNm: '육군3사관학교', instSe: '학교' },
  { instNm: '육군공병학교', instSe: '학교' },
  { instNm: '육군기계화학교', instSe: '학교' },
  { instNm: '육군대학', instSe: '학교' },
  { instNm: '육군방공학교', instSe: '학교' },
  { instNm: '2작전사 201특공여단', instSe: '육군' },
  { instNm: '2작전사 203특공여단', instSe: '육군' },
]

export interface DeptInqProps {
  /** 결과 선택 시 호출 — 선택한 발주기관명을 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (instNm: string) => void
}

const DeptInq = forwardRef<SearchSheetHandle, DeptInqProps>(({ onSelect }, ref) => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<DeptResult[] | null>(null) // null = 검색 전

  const reset = useCallback(() => {
    setKeyword('')
    setResults(null)
  }, [])

  // Like 검색(목업) — 추후 opService.searchDepts 로 대체.
  const handleSearch = useCallback(() => {
    const kw = keyword.trim().toLowerCase()
    const filtered = MOCK_DEPTS.filter(
      (d) => !kw || d.instNm.toLowerCase().includes(kw) || d.instSe.toLowerCase().includes(kw),
    )
    setResults(filtered)
    console.log('[P04] 발주부서(기관) 검색', { keyword, hit: filtered.length })
  }, [keyword])

  // footer(초기화/검색)는 셸이 소유 → 동작만 ref 로 노출.
  useImperativeHandle(ref, () => ({ reset, search: handleSearch }), [reset, handleSearch])

  const handlePick = (d: DeptResult) => onSelect(d.instNm)

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 검색 조건 (dm_searchInfo) */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel>발주기관</InputLabel>
        <InputBox
          value={keyword}
          placeholder="정보를 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />
      </div>

      {/* 검색 결과 (dl_resultList) — 행 클릭 시 발주기관명 반환 */}
      {results !== null && (
        <div className="flex flex-col gap-krds-5">
          <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((d) => (
                <li key={d.instNm}>
                  <button
                    type="button"
                    onClick={() => handlePick(d)}
                    className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                  >
                    <span className="text-[17px] font-bold text-krds-text-ink">{d.instNm}</span>
                    <span className="text-krds-body-sm text-krds-text-muted">{d.instSe}</span>
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
DeptInq.displayName = 'DeptInq'

export { DeptInq }
