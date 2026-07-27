// 입찰참가신청서작성 > 공동수급업체(MUI-BD-04-M10) > 등록업체검색 팝업(MUI-BD-04-P11).
// 바텀시트 콘텐츠 전용 컴포넌트 — 컨테이너(<BottomSheet title="업체 검색">)는 부모(BidPrtcpAperWrtPage_Stp5)가 소유.
// 단순 조회/선택 팝업이라 forwardRef/useImperativeHandle 불필요 — onSelect 콜백만 노출.
// 상단 검색바(구분 SelectBox 업체명/사업자번호 + 검색어 InputBox + 검색 Button) → 결과 총건수 → 결과 리스트(클릭 시 onSelect).
// 목값은 설계서 형식 그대로(사업자번호 `123-45-67890`, 업체명 `㈜업체명 표시 영역`). 실제 조회는 추후 API 연동.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SelectBox } from '@/ui/common/base/SelectBox'

// 검색 결과 1건(팝업 로컬 표시값). 부모는 선택 시 업체명을 공동수급업체 행에 주입한다.
interface RegBzentyRow {
  id: string
  bizRegNo: string // 사업자번호
  bizNm: string // 업체명
}

interface Props {
  onSelect: (row: RegBzentyRow) => void
}

// 검색 구분 — 업체명(기본) / 사업자번호.
const SRCH_TYPES = [
  { value: '업체명', label: '업체명' },
  { value: '사업자번호', label: '사업자번호' },
]

// 조회 결과 목업 3건 — 추후 bdService.getRegBzentyList 로 교체.
const MOCK_RESULTS: RegBzentyRow[] = [
  { id: 'b1', bizRegNo: '123-45-67890', bizNm: '㈜업체명 표시 영역' },
  { id: 'b2', bizRegNo: '234-56-78901', bizNm: '㈜방산테크' },
  { id: 'b3', bizRegNo: '345-67-89012', bizNm: '대한정밀공업㈜' },
]

export function RegBzentySrch({ onSelect }: Props) {
  const [srchType, setSrchType] = useState('업체명')
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<RegBzentyRow[]>(MOCK_RESULTS)

  const handleSearch = () => {
    // 추후 API: bdService.getRegBzentyList({ srchType, keyword })
    console.log('[P11] 등록업체검색', { srchType, keyword })
    setResults(MOCK_RESULTS)
  }

  return (
    <div className="flex flex-col gap-krds-6">
      {/* 검색바 — 구분 + 검색어 + 검색 */}
      <div className="flex flex-col gap-krds-4">
        <div className="flex items-center gap-krds-3">
          <div className="w-[120px] shrink-0">
            <SelectBox items={SRCH_TYPES} value={srchType} onValueChange={setSrchType} />
          </div>
          <InputBox
            className="flex-1"
            placeholder="검색어를 입력하세요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
          />
        </div>
        <Button variant="primary" className="w-full" onClick={handleSearch}>
          <Icon name="Search" size={20} />
          검색
        </Button>
      </div>

      {/* 결과 총건수 */}
      <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
        총 {results.length} 건
      </p>

      {/* 결과 리스트 — 클릭 시 부모가 시트 닫고 업체명 주입 */}
      <ul className="flex flex-col">
        {results.map((row) => (
          <li key={row.id} className="border-t border-krds-border-field last:border-b">
            <button
              type="button"
              onClick={() => {
                // 추후 API: 선택 업체 상세(이행방식/시공능력 등) 동반 조회
                console.log('[P11] 업체 선택', row)
                onSelect(row)
              }}
              className="flex w-full flex-col gap-krds-2 px-krds-3 py-krds-5 text-left active:bg-krds-bg-primary-faint"
            >
              <span className="text-[15px] leading-normal text-krds-text-muted">
                {row.bizRegNo}
              </span>
              <span className="text-[17px] leading-normal text-krds-text-ink">{row.bizNm}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
RegBzentySrch.displayName = 'RegBzentySrch'
