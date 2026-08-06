// 발주부서(기관) 검색 (MUI-BD-01-P04, 입찰 설계서 v1.83 slide14). 검색필터의 '발주기관' selectionField 에서 호출.
// 디자인: Figma 10020:129198(검색 전)·10020:129208(검색 후) — 라벨 인라인 입력행 + 콘텐츠 내 검색 버튼(footer 없음),
//   결과 = 총 N건(navy Bold) + 컬럼 라벨(13px subtle) + 행(구분 Regular / 기관명 Bold, 행 사이 divider).
// 내용(설계서 slide14): 검색조건 = 기관구분(select, 기본 전체) + 발주기관(input) · Like 검색 · Enter 검색 가능
//   · 입력 2글자 미만이면 검색 버튼 비활성 · 특수문자 불가(IME 가드 이슈로 입력 거르기 대신 검색 시 제거)
//   · 정렬 = 기관구분 오름차순 → 발주기관 가나다 오름차순 · 발주기관명이 길면 말줄임(…).
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/닫기(X)는 SearchFilter 셸이 소유(이 시트는 footer 미사용).
//   SearchSheetHandle(ref)은 셸 인터페이스 호환용으로 유지. 닫힘 시 언마운트로 상태 자동 초기화.
// 목록은 목업(추후 API: opService.searchDepts 로 대체).
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import type { SearchSheetHandle } from '@/types/search-filter'

// 검색결과 1건 (dl_resultList) — 발주기관명 + 기관구분. ⚠️ slide14 에 데이터영역 표 미정의 — 잠정 영문키.
interface DeptResult {
  instNm: string // 발주기관(부서)명
  instSe: string // 기관구분(육군/경리단/군수사/교육사/학교 등)
}

// 기관구분 select 옵션 — 설계서 slide14 예시값 기준(⚠️ 코드값 미확정, 추후 백엔드 코드 보완).
const INST_SE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '육군', label: '육군' },
  { value: '경리단', label: '경리단' },
  { value: '군수사', label: '군수사' },
  { value: '교육사', label: '교육사' },
  { value: '학교', label: '학교' },
]

// 목업 결과 (설계서 slide14 검색 후 예시값) — 추후 API 로 대체
const MOCK_DEPTS: DeptResult[] = [
  { instNm: '육군 2작사 201특공여단', instSe: '육군' },
  { instNm: '육군 2작사 203특공여단', instSe: '육군' },
  { instNm: '육군중앙경리단', instSe: '경리단' },
  { instNm: '육군군수사령부', instSe: '군수사' },
  { instNm: '육군교육사령부', instSe: '교육사' },
  { instNm: '육군3사관학교', instSe: '학교' },
  { instNm: '육군공병학교', instSe: '학교' },
  { instNm: '육군기계화학교', instSe: '학교' },
  { instNm: '육군대학', instSe: '학교' },
  { instNm: '육군방공학교', instSe: '학교' },
]

// 특수문자 제거 — 설계서 '특수문자 입력 불가'(한글/영문/숫자/공백만 허용).
const stripSpecial = (v: string) => v.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s]/g, '')

export interface DeptInqProps {
  /** 결과 선택 시 호출 — 선택한 발주기관명을 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (instNm: string) => void
}

const DeptInq = forwardRef<SearchSheetHandle, DeptInqProps>(({ onSelect }, ref) => {
  const [instSe, setInstSe] = useState('all') // 기관구분(기본 전체)
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<DeptResult[] | null>(null) // null = 검색 전

  // 최소 2글자 이상 입력 시 검색 가능(설계서) — 특수문자 제거 후 기준.
  const canSearch = stripSpecial(keyword).trim().length >= 2

  const reset = useCallback(() => {
    setInstSe('all')
    setKeyword('')
    setResults(null)
  }, [])

  // Like 검색(목업) — 기관구분 + 발주기관명 부분일치. 정렬: 기관구분 오름차순 → 발주기관 가나다(설계서).
  //   결과가 많은 경우 무한 스크롤(설계서)은 API 연동 시 페이징과 함께 반영(목업 10건이라 미적용).
  const handleSearch = useCallback(() => {
    if (!canSearch) return
    const kw = stripSpecial(keyword).trim().toLowerCase()
    const filtered = MOCK_DEPTS.filter(
      (d) => (instSe === 'all' || d.instSe === instSe) && d.instNm.toLowerCase().includes(kw),
    ).sort(
      (a, b) => a.instSe.localeCompare(b.instSe, 'ko') || a.instNm.localeCompare(b.instNm, 'ko'),
    )
    setResults(filtered)
    console.log('[P04] 발주부서(기관) 검색', { instSe, keyword: kw, hit: filtered.length })
  }, [canSearch, instSe, keyword])

  // 셸 인터페이스 호환(SearchSheetHandle) — 이 시트는 footer 미사용이나 ref 계약은 유지.
  useImperativeHandle(ref, () => ({ reset, search: handleSearch }), [reset, handleSearch])

  return (
    <div className="flex flex-col gap-krds-8">
      {/* 검색 조건 (dm_searchInfo) — 라벨 인라인(Figma m_input_label + 컨트롤 flex-1, gap 8) */}
      <div className="flex flex-col gap-krds-8">
        <div className="flex items-center gap-krds-5">
          <InputLabel className="w-[64px] shrink-0">기관구분</InputLabel>
          <div className="min-w-px flex-1">
            <SelectBox items={INST_SE_OPTIONS} value={instSe} onValueChange={setInstSe} />
          </div>
        </div>
        <div className="flex items-center gap-krds-5">
          <InputLabel className="w-[64px] shrink-0">발주기관</InputLabel>
          <InputBox
            className="min-w-px flex-1"
            value={keyword}
            placeholder="정보를 입력해주세요."
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
        </div>

        {/* 검색 — 콘텐츠 내 full-width primary(Search 아이콘, Figma). 입력 2글자 미만 비활성(설계서). */}
        <Button variant="primary" className="w-full" disabled={!canSearch} onClick={handleSearch}>
          <Icon name="Search" size={20} aria-hidden />
          검색
        </Button>
      </div>

      {/* 검색 결과 (dl_resultList) — 총 N건 + 컬럼 라벨 + 행 클릭 시 발주기관명 반환 */}
      {results !== null && (
        <div className="flex flex-col">
          <p className="py-krds-5 text-[17px] font-bold leading-normal text-krds-text-primary-active">
            총 {results.length}건
          </p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            <>
              {/* 컬럼 라벨(top label group) — 13px subtle */}
              <div className="flex items-center gap-krds-8 pb-krds-3 text-[13px] leading-normal text-krds-text-subtle">
                <span className="w-[64px] shrink-0 text-center">기관구분</span>
                <span className="min-w-px flex-1">발주기관</span>
              </div>
              <ul className="flex flex-col">
                {results.map((d) => (
                  <li key={d.instNm}>
                    <button
                      type="button"
                      onClick={() => onSelect(d.instNm)}
                      className="flex w-full items-center gap-krds-8 border-t border-krds-border-divider py-krds-8 text-left active:bg-krds-bg-primary-faint"
                    >
                      <span className="w-[64px] shrink-0 text-center text-[17px] leading-normal text-krds-text-ink">
                        {d.instSe}
                      </span>
                      <span className="min-w-px flex-1 truncate text-[17px] font-bold leading-normal text-krds-text-ink">
                        {d.instNm}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
})
DeptInq.displayName = 'DeptInq'

export { DeptInq }
