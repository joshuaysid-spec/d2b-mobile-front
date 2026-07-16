// 품류 선택 콘텐츠 (MUI-CM-01-P06, KnditmChc). 설계서 slide161.
//   대표품류(M05 폼)에서 호출 → 품류명 Like 검색 → 결과 클릭 시 선택 품류 반환(부모가 시트 닫음).
//   컨테이너(BottomSheet)·타이틀('품류 선택')은 부모(M05 폼)가 소유 — 여기선 본문(검색 + 결과)만.
//   "가상 키패드"는 하이브리드 네이티브 영역 — 웹은 디바이스 기본 키보드 사용(별도 구현 X).
import { useMemo, useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { Button } from '@/ui/common/base/Button'
import type { KnditmChcItem } from '@/types/cm'

// 품류 목록 목업 (설계서 slide161 예시 — 품류코드 11000·11740…/품류명). 추후 API: cmService.getKnditmList.
const MOCK_KNDITM: KnditmChcItem[] = [
  { knditmCd: '11000', knditmCdNm: '사무용기기' },
  { knditmCd: '11740', knditmCdNm: '피복' },
  { knditmCd: '11140', knditmCdNm: '전투장구' },
  { knditmCd: '11170', knditmCdNm: '의무장비' },
  { knditmCd: '11200', knditmCdNm: '통신전자' },
  { knditmCd: '11215', knditmCdNm: '탄약' },
]

export interface KnditmChcProps {
  /** 결과 선택 시 호출 — 선택 품류를 부모에 반환(부모가 시트 닫음). */
  onSelect: (item: KnditmChcItem) => void
}

export function KnditmChc({ onSelect }: KnditmChcProps) {
  const [keyword, setKeyword] = useState('')
  const [applied, setApplied] = useState('') // 검색 실행 시에만 확정

  const handleSearch = () => {
    setApplied(keyword.trim())
    console.log('[P06] 품류 검색', keyword) // 추후 API: cmService.getKnditmList(keyword)
  }

  // Like 검색(목업) — 검색 실행 전(applied 공백)엔 전체 노출.
  const results = useMemo(
    () => (applied ? MOCK_KNDITM.filter((it) => it.knditmCdNm.includes(applied)) : MOCK_KNDITM),
    [applied],
  )

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 검색 — 입력 + 검색 버튼(오픈 시 포커스, slide161) */}
      <div className="flex items-end gap-krds-5">
        <InputBox
          autoFocus
          className="flex-1"
          value={keyword}
          placeholder="품류명을 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />
        <Button variant="primary" size="icon" aria-label="품류명 검색" onClick={handleSearch}>
          <Icon name="Search" size={20} aria-hidden />
        </Button>
      </div>

      {/* 검색 결과 — 총 N건 + 목록(번호/품류명/품류코드). 클릭 시 반환. */}
      <div className="flex flex-col gap-krds-5">
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
        {results.length === 0 ? (
          <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col">
            {results.map((it) => (
              <li key={it.knditmCd}>
                <button
                  type="button"
                  onClick={() => onSelect(it)}
                  className="flex w-full flex-col gap-1 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                >
                  <span className="text-[17px] font-bold text-krds-text-ink">{it.knditmCdNm}</span>
                  <span className="text-krds-body-sm text-krds-text-muted">
                    품류코드 {it.knditmCd}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
KnditmChc.displayName = 'KnditmChc'
