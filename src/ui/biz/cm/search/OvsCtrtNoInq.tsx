// 계약번호조회 (MUI-EX-02-P79, 이행 설계서 04. v0.83 slide84~86 / Figma 개인용-2607427 10020-159870·159679·159883).
// 159883(검색 후 스크롤 펼침)은 별개 화면이 아니라 시트 높이/스크롤 상태 변형 — BottomSheet 컨테이너가 처리.
// 계약연도(필수)+계약번호로 계약정보 목록을 조회해 라디오카드로 선택 → footer '계약번호 선택' 시 계약번호 반환.
// 검색필터의 '계약번호' selectionField(searchSheet:'ctrtNo')에서 호출 — 이행 상세조회 계열·계약 목록 공용.
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/footer([닫기/계약번호 선택])는 SearchFilter 셸이 슬롯으로 소유한다.
//   내부 [검색] 버튼은 Figma 원본대로 콘텐츠가 소유(검색 전엔 목록 없음). 폼 상태 캡슐화, footer 확정만 ref(confirm) 노출.
// 항목명은 설계서 slide86 그대로: 검색(dm_searchInfo)=ctrtYr·ctrtNo / 결과(dl_resultList)=ctrtNo·ctrtYmd·crncCd·ctrtBzentyCd·prcmPicNm.
// 목록은 목업 — 실 API 는 no.383 계약정보목록조회(/cts/ex/ovsLmtamtCtrt/selectCtrtInfoList.do).
//   배선 시 exService.selectCtrtInfoList + exQueries 훅을 추가하고 아래 MOCK_RESULTS 를 mocks/ex.ts 로 이동한다.
// DeptInq 패턴 + 라디오카드(Figma m_radiocard) 변형.
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import type { SearchSheetHandle } from '@/types/search-filter'

// 검색결과 1건 (dl_resultList, 설계서 slide86 항목명 그대로)
interface CtrtNoResult {
  /** 계약번호 (ctrtNo, 35) */
  ctrtNo: string
  /** 계약일자 (ctrtYmd, 8) */
  ctrtYmd: string
  /** 화폐구분 (crncCd, 3) — 표시용은 화폐구분명 */
  crncCd: string
  /** 계약업체 (ctrtBzentyCd) — 표시용은 업체명 */
  ctrtBzentyCd: string
  /** 조달담당자 (prcmPicNm) */
  prcmPicNm: string
}

// 계약연도 옵션 — 당해 년도부터 과거 10년(설계서 slide84 검색조건). On-Load 기본값=현재연도.
const THIS_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const y = String(THIS_YEAR - i)
  return { value: y, label: y }
})

// 목업 결과 (설계서 slide84·Figma 예시값 형식) — 추후 API 로 대체.
const MOCK_RESULTS: CtrtNoResult[] = Array.from({ length: 10 }, (_, i) => ({
  ctrtNo: `KD00000000${i}`,
  ctrtYmd: '2025-01-01',
  crncCd: '미달러',
  ctrtBzentyCd: '조달테스트업체',
  prcmPicNm: '홍길동',
}))

export interface OvsCtrtNoInqProps {
  /** footer '계약번호 선택' 확정 시 호출 — 선택한 계약번호를 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (ctrtNo: string) => void
}

const OvsCtrtNoInq = forwardRef<SearchSheetHandle, OvsCtrtNoInqProps>(({ onSelect }, ref) => {
  const [ctrtYr, setCtrtYr] = useState(String(THIS_YEAR)) // On-Load: 현재연도
  const [ctrtNo, setCtrtNo] = useState('')
  const [results, setResults] = useState<CtrtNoResult[] | null>(null) // null = 검색 전
  const [picked, setPicked] = useState<string | null>(null) // 선택(하이라이트)된 계약번호

  const reset = useCallback(() => {
    setCtrtYr(String(THIS_YEAR))
    setCtrtNo('')
    setResults(null)
    setPicked(null)
  }, [])

  // 계약연도 And 계약번호 검색(목업) — 추후 exService.selectCtrtInfoList(no.383) 실호출로 대체.
  const handleSearch = useCallback(() => {
    const kw = ctrtNo.trim().toLowerCase()
    const filtered = MOCK_RESULTS.filter((r) => !kw || r.ctrtNo.toLowerCase().includes(kw))
    setResults(filtered)
    setPicked(null)
    console.log('[P79] 계약번호조회 검색', { ctrtYr, ctrtNo, hit: filtered.length })
  }, [ctrtYr, ctrtNo])

  // footer '계약번호 선택'(확정) — 선택값 반환. 선택 없으면 무시.
  const confirm = useCallback(() => {
    if (picked) onSelect(picked)
  }, [picked, onSelect])

  useImperativeHandle(ref, () => ({ reset, search: handleSearch, confirm }), [
    reset,
    handleSearch,
    confirm,
  ])

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 검색 조건 (dm_searchInfo) — 라벨(70px) 옆 인라인 배치(Figma) */}
      <div className="flex flex-col gap-krds-7">
        <div className="flex items-center gap-krds-5">
          <InputLabel required className="w-[70px] shrink-0">
            계약연도
          </InputLabel>
          <div className="min-w-px flex-1">
            <SelectBox
              items={YEAR_OPTIONS}
              value={ctrtYr}
              onValueChange={setCtrtYr}
              aria-label="계약연도"
            />
          </div>
        </div>
        <div className="flex items-center gap-krds-5">
          <InputLabel className="w-[70px] shrink-0">계약번호</InputLabel>
          <InputBox
            value={ctrtNo}
            placeholder="번호를 입력해주세요."
            inputType="numeric"
            className="min-w-px flex-1"
            onChange={(e) => setCtrtNo(e.target.value)}
            onClear={() => setCtrtNo('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
        </div>
        {/* 내부 검색 버튼 — Figma 원본(primary + search 아이콘) */}
        <Button variant="primary" className="w-full" onClick={handleSearch}>
          <Icon name="Search" size={20} aria-hidden />
          검색
        </Button>
      </div>

      {/* 검색 결과 (dl_resultList) — 라디오카드, 선택 시 하이라이트(slide85) */}
      {results !== null && (
        <div className="flex flex-col gap-krds-5">
          <p className="text-[17px] font-bold leading-normal text-krds-text-primary-active">
            총 {results.length}건
          </p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
              검색 결과가 없습니다.
            </p>
          ) : (
            <>
              {/* 컬럼 라벨 (Figma top label group, 13px) */}
              <div className="flex gap-krds-8 px-4 text-[13px] leading-normal text-krds-text-muted">
                <span className="w-[26px] shrink-0 text-center">번호</span>
                <span className="min-w-px flex-1">계약번호/업체</span>
                <span className="shrink-0">화폐구분/계약일</span>
              </div>
              <ul className="flex flex-col gap-krds-8">
                {results.map((r, i) => {
                  const selected = picked === r.ctrtNo
                  return (
                    <li key={r.ctrtNo}>
                      {/* m_radiocard — bg-white·border #d1d7e0·shadow·rounded-12·p-16, 선택 시 하이라이트 */}
                      <button
                        type="button"
                        onClick={() => setPicked(r.ctrtNo)}
                        aria-pressed={selected}
                        className={`flex w-full items-start gap-4 rounded-[12px] bg-background p-4 text-left shadow-krds-card ${
                          selected
                            ? 'border-2 border-krds-action-primary bg-krds-bg-primary-faint'
                            : 'border border-krds-border-divider'
                        }`}
                      >
                        {/* 번호 열(26px) — 라디오 + 순번 */}
                        <span className="flex w-[26px] shrink-0 flex-col items-center gap-2.5">
                          <span
                            aria-hidden
                            className={`mt-1 flex size-5 items-center justify-center rounded-full border ${
                              selected
                                ? 'border-krds-action-primary'
                                : 'border-krds-border-field'
                            }`}
                          >
                            {selected && (
                              <span className="size-3 rounded-full bg-krds-action-primary" />
                            )}
                          </span>
                          <span className="text-[15px] leading-normal text-krds-text-muted">
                            {results.length - i}
                          </span>
                        </span>
                        {/* 좌: 계약번호/업체/조달담당자 */}
                        <span className="flex min-w-px flex-1 flex-col gap-1">
                          <span className="text-[17px] leading-normal text-krds-text-ink">
                            {r.ctrtNo}
                          </span>
                          <span className="text-[19px] font-bold leading-normal text-krds-text-ink">
                            {r.ctrtBzentyCd}
                          </span>
                          <span className="text-[15px] leading-normal text-krds-text-muted">
                            조달담당자 : {r.prcmPicNm}
                          </span>
                        </span>
                        {/* 우: 화폐구분/계약일 */}
                        <span className="flex shrink-0 flex-col items-end justify-end gap-1 self-stretch">
                          <span className="text-[15px] leading-normal text-krds-text-muted">
                            {r.crncCd}
                          </span>
                          <span className="text-[15px] leading-normal text-krds-text-muted">
                            {r.ctrtYmd}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              {/* 더보기 (Figma 10/258) — 목업이라 표시만, 추후 페이징 API */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => console.log('[P79] 더보기')}
              >
                더보기 (10/258)
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
})
OvsCtrtNoInq.displayName = 'OvsCtrtNoInq'

export { OvsCtrtNoInq }
