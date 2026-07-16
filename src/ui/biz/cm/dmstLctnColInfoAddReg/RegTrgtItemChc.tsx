// 등록대상 품목 선택 콘텐츠 (MUI-CM-01-P08, RegTrgtItemChc). 설계서 slide165.
//   등록품목명세(M05 폼)의 [신규 추가]에서 호출 → 품류/품명/업종코드 조건 검색 → 결과 복수 선택
//   → [적용하기] 시 선택 품목 목록 반환(부모가 시트 닫음). 행 [상세보기] → 품목 조회(P09 ItemInq)는 부모가 연다.
//   컨테이너(BottomSheet)·타이틀('등록대상 품목 선택')·footer([적용하기])는 부모(M05 폼)가 소유.
//   footer [적용하기] 선택 상태는 이 콘텐츠가 소유 → ref(RegTrgtItemChcHandle.apply)로 확정 동작만 노출.
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { Button } from '@/ui/common/base/Button'
import { cn } from '@/utils/cn'
import type { RegTrgtItemChcItem } from '@/types/cm'

/** 부모 footer([적용하기])가 호출하는 확정 동작. */
export interface RegTrgtItemChcHandle {
  /** 현재 선택 항목을 onApply 로 반환. */
  apply: () => void
}

// 품류 드롭다운 옵션(목업, slide165 '품류를 선택해주세요.'). 추후 API: cmService.getKnditmList.
const KNDITM_OPTIONS = [
  { value: '05', label: '05 / 피복' },
  { value: '60', label: '60 / 총탄' },
  { value: '11', label: '11 / 사무용기기' },
]

// 등록대상 품목 목록 목업 (설계서 slide165 예시 — 품목코드 1234567890/품명 물컵/품류 05 피복/등록요건). 추후 API.
const MOCK_ITEMS: RegTrgtItemChcItem[] = [
  {
    itemCd: '1234567890',
    itemCdNm: '물컵',
    knditmCd: '05',
    knditmCdNm: '피복',
    itemRgstrtRqmtNm: '해당업종 사업자 / 공장등록',
    delYn: 'N',
  },
  {
    itemCd: '1001100001',
    itemCdNm: '이불',
    knditmCd: '60',
    knditmCdNm: '총탄',
    itemRgstrtRqmtNm: '해당업종 사업자 / 공장등록',
    delYn: 'N',
  },
]

export interface RegTrgtItemChcProps {
  /** [적용하기] 시 호출 — 선택 품목 목록을 부모에 반환. */
  onApply: (items: RegTrgtItemChcItem[]) => void
  /** 행 [상세보기] — 품목 조회(P09 ItemInq)는 부모가 연다. */
  onDetail: (item: RegTrgtItemChcItem) => void
}

const RegTrgtItemChc = forwardRef<RegTrgtItemChcHandle, RegTrgtItemChcProps>(
  ({ onApply, onDetail }, ref) => {
    const [knditmCd, setKnditmCd] = useState('')
    const [itemNm, setItemNm] = useState('')
    const [bzstatCd, setBzstatCd] = useState('') // 업종코드
    const [applied, setApplied] = useState(false)
    const [selected, setSelected] = useState<string[]>([]) // 선택 itemCd 목록(복수)

    const handleSearch = () => {
      setApplied(true)
      console.log('[P08] 등록대상 품목 검색', { knditmCd, itemNm, bzstatCd }) // 추후 API: cmService.searchRegTrgtItems
    }

    // Like 검색(목업) — 검색 실행 전엔 결과 미노출(설계서: 조건 검색 후 목록).
    const results = useMemo(() => {
      if (!applied) return []
      return MOCK_ITEMS.filter(
        (it) =>
          (!knditmCd || it.knditmCd === knditmCd) && (!itemNm || it.itemCdNm.includes(itemNm)),
      )
    }, [applied, knditmCd, itemNm])

    const toggle = (itemCd: string) =>
      setSelected((prev) =>
        prev.includes(itemCd) ? prev.filter((c) => c !== itemCd) : [...prev, itemCd],
      )

    useImperativeHandle(
      ref,
      () => ({
        apply: () => onApply(MOCK_ITEMS.filter((it) => selected.includes(it.itemCd))),
      }),
      [onApply, selected],
    )

    return (
      <div className="flex flex-col gap-krds-7">
        {/* 검색조건 — 품류(드롭다운) / 품명 / 업종코드 (slide165) */}
        <div className="flex flex-col gap-krds-6">
          <div className="flex flex-col gap-krds-5">
            <InputLabel>품류</InputLabel>
            <SelectBox
              placeholder="품류를 선택해주세요."
              value={knditmCd}
              onValueChange={setKnditmCd}
              items={KNDITM_OPTIONS}
            />
          </div>
          <div className="flex flex-col gap-krds-5">
            <InputLabel htmlFor="regtrgt-itemNm">품명</InputLabel>
            <InputBox
              id="regtrgt-itemNm"
              value={itemNm}
              placeholder="품명을 입력해주세요."
              onChange={(e) => setItemNm(e.target.value)}
              onClear={() => setItemNm('')}
            />
          </div>
          <div className="flex flex-col gap-krds-5">
            <InputLabel htmlFor="regtrgt-bzstatCd">업종코드</InputLabel>
            <InputBox
              id="regtrgt-bzstatCd"
              value={bzstatCd}
              placeholder="업종코드를 입력해주세요."
              onChange={(e) => setBzstatCd(e.target.value)}
              onClear={() => setBzstatCd('')}
            />
          </div>
          <Button variant="secondary" className="w-full" onClick={handleSearch}>
            <Icon name="Search" size={20} aria-hidden />
            검색
          </Button>
        </div>

        {/* 검색 결과 — 총 N건 + 복수 선택 목록. 행 [상세보기] → 품목 조회(P09). */}
        {applied && (
          <div className="flex flex-col gap-krds-5">
            <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
            {results.length === 0 ? (
              <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
                검색 결과가 없습니다.
              </p>
            ) : (
              <ul className="flex flex-col gap-krds-5">
                {results.map((it) => {
                  const on = selected.includes(it.itemCd)
                  return (
                    <li
                      key={it.itemCd}
                      className="flex items-start gap-krds-5 rounded-krds-8 border border-krds-border-divider p-krds-6"
                    >
                      {/* 선택 토글(복수) */}
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${it.itemCdNm} 선택`}
                        onClick={() => toggle(it.itemCd)}
                        className={cn(
                          'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                          on
                            ? 'border-primary bg-primary text-white'
                            : 'border-krds-border-field text-transparent',
                        )}
                      >
                        <Icon name="Check" size={16} aria-hidden />
                      </button>
                      <div className="flex min-w-px flex-1 flex-col gap-1">
                        <span className="text-[17px] font-bold text-krds-text-ink">
                          {it.itemCdNm}
                        </span>
                        <span className="text-krds-body-sm text-krds-text-muted">
                          품목코드 {it.itemCd}
                        </span>
                        <span className="text-krds-body-sm text-krds-text-muted">
                          품류 {it.knditmCd} / {it.knditmCdNm}
                        </span>
                        <span className="text-krds-body-sm text-krds-text-muted">
                          등록요건 {it.itemRgstrtRqmtNm}
                        </span>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => onDetail(it)}>
                        상세보기
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    )
  },
)
RegTrgtItemChc.displayName = 'RegTrgtItemChc'

export { RegTrgtItemChc }
