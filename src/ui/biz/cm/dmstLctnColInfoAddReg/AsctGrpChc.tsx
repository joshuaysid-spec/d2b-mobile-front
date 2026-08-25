// 조합/단체 선택 콘텐츠 (MUI-CM-01-P07, AsctGrpChc). 설계서 slide163.
//   조합/단체(M05 폼)에서 호출 → 단체명 Like 검색 → 결과 클릭 시 선택 조합/단체 반환(부모가 시트 닫음).
//   컨테이너(BottomSheet)·타이틀('조합/단체 선택')은 부모(M05 폼)가 소유 — 여기선 본문(검색 + 결과)만.
import { useMemo, useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { Button } from '@/ui/common/base/Button'
import type { AsctGrpChcItem } from '@/types/mock/cm'

// 조합/단체 목록 목업 (설계서 slide163 예시 — 조합코드/단체명). 추후 API: cmService.selectAsctGrpList.
const MOCK_ASCT: AsctGrpChcItem[] = [
  { asctCd: '11000', asctCdNm: '한국피복공업협동조합' },
  { asctCd: '11740', asctCdNm: '대한기계설비건설협회' },
  { asctCd: '11140', asctCdNm: '한국정보통신공사협회' },
  { asctCd: '11170', asctCdNm: '한국전자정보통신산업진흥회' },
  { asctCd: '11200', asctCdNm: '한국방위산업진흥회' },
  { asctCd: '11215', asctCdNm: '중소기업중앙회' },
]

export interface AsctGrpChcProps {
  /** 결과 선택 시 호출 — 선택 조합/단체를 부모에 반환(부모가 시트 닫음). */
  onSelect: (item: AsctGrpChcItem) => void
}

export function AsctGrpChc({ onSelect }: AsctGrpChcProps) {
  const [keyword, setKeyword] = useState('')
  const [applied, setApplied] = useState('')

  const handleSearch = () => {
    setApplied(keyword.trim())
    console.log('[P07] 조합/단체 검색', keyword) // 추후 API: cmService.selectAsctGrpList(keyword)
  }

  const results = useMemo(
    () => (applied ? MOCK_ASCT.filter((it) => it.asctCdNm.includes(applied)) : MOCK_ASCT),
    [applied],
  )

  return (
    <div className="flex flex-col gap-krds-7">
      <div className="flex items-end gap-krds-5">
        <InputBox
          autoFocus
          className="flex-1"
          value={keyword}
          placeholder="단체명을 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />
        <Button variant="primary" size="icon" aria-label="단체명 검색" onClick={handleSearch}>
          <Icon name="Search" size={20} aria-hidden />
        </Button>
      </div>

      <div className="flex flex-col gap-krds-5">
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
        {results.length === 0 ? (
          <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col">
            {results.map((it) => (
              <li key={it.asctCd}>
                <button
                  type="button"
                  onClick={() => onSelect(it)}
                  className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                >
                  <span className="text-[17px] font-bold text-krds-text-ink">{it.asctCdNm}</span>
                  <span className="text-krds-body-sm text-krds-text-muted">조합코드 {it.asctCd}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
AsctGrpChc.displayName = 'AsctGrpChc'
