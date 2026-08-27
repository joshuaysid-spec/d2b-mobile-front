// 등록대상품목선택 콘텐츠 (MUI-CM-01-P08, RegTrgtItemChc). Figma 10020:84985(품류)·85060(품명) / 설계서 slide165.
//   260828 Figma 리디자인 반영: 업무도움(HelpDisclosure) → 검색조건 탭(품류/품명/업종코드 — 하나만 선택)
//   → 탭별 입력(품류=셀렉트, 품명/업종코드=검색어) + [조회/검색] → 총 N건 + [다운로드]
//   → 결과 카드(품명 타이틀 + 우측 체크박스, 삭제여부/품목코드(파랑 → P09)/품류코드/명/등록요건).
//   컨테이너(FullPopup)·타이틀('등록대상품목선택')·footer([취소][확인])는 부모(M05 폼)가 소유.
//   footer [확인] 선택 상태는 이 콘텐츠가 소유 → ref(RegTrgtItemChcHandle.apply)로 확정 동작만 노출.
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { Button } from '@/ui/common/base/Button'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { Card } from '@/ui/common/composites/Card'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import type { RegTrgtItemChcItem } from '@/types/mock/cm'

/** 부모 footer([확인])가 호출하는 확정 동작. */
export interface RegTrgtItemChcHandle {
  /** 현재 선택 항목을 onApply 로 반환. */
  apply: () => void
}

// 검색조건 탭(Figma 84985 — 품류/품명/업종코드 중 하나만 선택).
const COND_TABS: TabItem[] = [
  { value: 'knditm', label: '품류' },
  { value: 'itemNm', label: '품명' },
  { value: 'bzstat', label: '업종코드' },
]

// 품류 드롭다운 옵션(목업). 추후 API: cmService.selectKnditmList.
const KNDITM_OPTIONS = [
  { value: '05', label: '05/과자' },
  { value: '60', label: '60/총탄' },
  { value: '11', label: '11/사무용기기' },
]

// 등록대상 품목 목록 목업 (설계서 slide165 예시 항목명/형식). 추후 API.
const MOCK_ITEMS: RegTrgtItemChcItem[] = [
  {
    itemCd: '1234567890',
    itemCdNm: '물컵',
    knditmCd: '05',
    knditmCdNm: '피복',
    itemRgstrtRqmtNm: '해당업종 사업자/공장등록',
    delYn: 'N',
  },
  {
    itemCd: '1001100001',
    itemCdNm: '이불',
    knditmCd: '60',
    knditmCdNm: '총탄',
    itemRgstrtRqmtNm: '해당업종 사업자/공장등록',
    delYn: 'N',
  },
]

export interface RegTrgtItemChcProps {
  /** [확인] 시 호출 — 선택 품목 목록을 부모에 반환. */
  onApply: (items: RegTrgtItemChcItem[]) => void
  /** 품목코드(파랑 링크) 클릭 — 품목상세정보(P09 ItemInq)는 부모가 연다. */
  onDetail: (item: RegTrgtItemChcItem) => void
}

const RegTrgtItemChc = forwardRef<RegTrgtItemChcHandle, RegTrgtItemChcProps>(
  ({ onApply, onDetail }, ref) => {
    const [cond, setCond] = useState('knditm') // 검색조건 탭
    const [knditmCd, setKnditmCd] = useState('')
    const [keyword, setKeyword] = useState('') // 품명/업종코드 검색어(탭 공용)
    const [applied, setApplied] = useState(false)
    const [selected, setSelected] = useState<string[]>([]) // 선택 itemCd 목록(복수)

    const handleCond = (next: string) => {
      setCond(next)
      setKeyword('')
    }
    const handleSearch = () => {
      setApplied(true)
      console.log('[P08] 등록대상 품목 검색', { cond, knditmCd, keyword }) // 추후 API: cmService.selectRegTrgtItemList
    }
    const handleDownload = () => {
      console.log('[P08] 목록 다운로드') // 추후 API: 등록대상 품목 목록 다운로드
    }

    // Like 검색(목업) — 검색 실행 전엔 결과 미노출(설계서: 조건 검색 후 목록). 선택 조건 하나만 적용.
    const results = useMemo(() => {
      if (!applied) return []
      return MOCK_ITEMS.filter((it) => {
        if (cond === 'knditm') return !knditmCd || it.knditmCd === knditmCd
        if (cond === 'itemNm') return !keyword || it.itemCdNm.includes(keyword)
        return true // 업종코드 — 목업 항목에 없어 전체(추후 서버 조회)
      })
    }, [applied, cond, knditmCd, keyword])

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
      <div className="flex w-full flex-col">
        {/* 업무도움 (Figma 84985 상단) */}
        <HelpDisclosure
          items={[
            '조회하고자 하는 검색조건을 하나 선택해주세요.',
            '검색조건은 품류, 품명, 업종코드 중 하나를 선택하여 검색하실 수 있습니다.',
            '선택한 조건으로 등록된 품목을 조회합니다.',
          ]}
          defaultOpen
        />

        {/* 검색조건 탭 — 품류/품명/업종코드 중 하나(Figma 라인 탭) */}
        <div className="px-4 pt-4">
          <TabList value={cond} onChange={handleCond} items={COND_TABS} fitted />
        </div>

        {/* 탭별 입력 + 조회/검색 버튼 */}
        <div className="flex flex-col gap-krds-7 px-4 pt-4">
          {cond === 'knditm' ? (
            <SelectBox
              placeholder="품류를 선택해주세요."
              value={knditmCd}
              onValueChange={setKnditmCd}
              items={KNDITM_OPTIONS}
            />
          ) : (
            <InputBox
              value={keyword}
              placeholder="검색어를 입력해주세요"
              aria-label={cond === 'itemNm' ? '품명 검색어' : '업종코드 검색어'}
              onChange={(e) => setKeyword(e.target.value)}
              onClear={() => setKeyword('')}
            />
          )}
          <Button variant="primary" className="w-full" onClick={handleSearch}>
            <Icon name="Search" size={20} aria-hidden />
            {cond === 'knditm' ? '조회' : '검색'}
          </Button>
        </div>

        {/* 검색 결과 — 총 N건(bold) + [다운로드] + 결과 카드 목록 */}
        {applied && (
          <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-5">
            <div className="flex items-center justify-between gap-krds-5">
              <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
                총 {results.length}건
              </p>
              <Button variant="secondary" size="sm" onClick={handleDownload}>
                다운로드
              </Button>
            </div>

            {results.length === 0 ? (
              <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
                검색 결과가 없습니다.
              </p>
            ) : (
              <ul className="flex flex-col gap-krds-7">
                {results.map((it) => {
                  const on = selected.includes(it.itemCd)
                  return (
                    <li key={it.itemCd}>
                      {/* Figma 10020:85034 다중 선택 카드 — 타이틀(품명)+우측 체크박스+정보행(공통 Card). */}
                      <Card
                        title={it.itemCdNm}
                        titleTrailing={
                          <Checkbox
                            variant="box"
                            aria-label={`${it.itemCdNm} 선택`}
                            checked={on}
                            onCheckedChange={() => toggle(it.itemCd)}
                          />
                        }
                        rows={[
                          { label: '삭제여부', value: it.delYn },
                          {
                            label: '품목코드',
                            value: (
                              <button
                                type="button"
                                className="text-right text-[17px] leading-normal text-krds-action-primary underline-offset-2 hover:underline"
                                onClick={() => onDetail(it)}
                              >
                                {it.itemCd}
                              </button>
                            ),
                          },
                          { label: '품류코드/명', value: `${it.knditmCd}/${it.knditmCdNm}` },
                          { label: '등록요건', value: it.itemRgstrtRqmtNm },
                        ]}
                      />
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
