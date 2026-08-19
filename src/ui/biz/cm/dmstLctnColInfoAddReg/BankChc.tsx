// 주거래은행 선택 콘텐츠 (MUI-CM-01-P12, BankChc). 설계서 slide173.
//   주거래은행(M23 폼 영업정보)에서 호출 → 은행명 Like 검색 → 결과 클릭 시 선택 은행 반환(부모가 시트 닫음).
//   컨테이너(BottomSheet)·타이틀('주거래은행 선택')은 부모(M23 폼)가 소유 — 여기선 본문(검색 + 결과)만.
import { useMemo, useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { Button } from '@/ui/common/base/Button'
import type { BankChcItem } from '@/types/cm'

// 은행 목록 목업 (설계서 slide173 예시 — 코드 00100000…/은행명). 추후 API: cmService.selectBankList.
const MOCK_BANK: BankChcItem[] = [
  { bankCd: '00100000', bankNm: '한국은행' },
  { bankCd: '00200000', bankNm: '산업은행' },
  { bankCd: '00300000', bankNm: '기업은행' },
  { bankCd: '00400000', bankNm: '국민은행' },
  { bankCd: '00500000', bankNm: '농협은행' },
  { bankCd: '00600000', bankNm: '우리은행' },
]

export interface BankChcProps {
  /** 결과 선택 시 호출 — 선택 은행을 부모에 반환(부모가 시트 닫음). */
  onSelect: (item: BankChcItem) => void
}

export function BankChc({ onSelect }: BankChcProps) {
  const [keyword, setKeyword] = useState('')
  const [applied, setApplied] = useState('')

  const handleSearch = () => {
    setApplied(keyword.trim())
    console.log('[P12] 주거래은행 검색', keyword) // 추후 API: cmService.selectBankList(keyword)
  }

  const results = useMemo(
    () => (applied ? MOCK_BANK.filter((it) => it.bankNm.includes(applied)) : MOCK_BANK),
    [applied],
  )

  return (
    <div className="flex flex-col gap-krds-7">
      <div className="flex items-end gap-krds-5">
        <InputBox
          autoFocus
          className="flex-1"
          value={keyword}
          placeholder="은행명을 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />
        <Button variant="primary" size="icon" aria-label="은행명 검색" onClick={handleSearch}>
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
              <li key={it.bankCd}>
                <button
                  type="button"
                  onClick={() => onSelect(it)}
                  className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                >
                  <span className="text-[17px] font-bold text-krds-text-ink">{it.bankNm}</span>
                  <span className="text-krds-body-sm text-krds-text-muted">코드 {it.bankCd}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
BankChc.displayName = 'BankChc'
