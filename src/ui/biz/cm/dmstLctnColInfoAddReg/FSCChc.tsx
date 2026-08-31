// FSC(Federal Supply Classification) 선택 콘텐츠 (MUI-CM-01-P11, FSCChc). 설계서 slide171.
//   FSC(M23 폼)에서 호출 → 군급명 Like 검색 → 결과 복수 선택 → [등록] 시 선택 목록 반환(부모가 시트 닫음).
//   컨테이너(BottomSheet)·타이틀('FSC 선택')·footer([등록][닫기])는 부모(M23 폼)가 소유.
//   footer [등록] 은 부모가 렌더하지만 선택 상태는 이 콘텐츠가 소유 → ref(FSCChcHandle.register)로 확정 동작만 노출.
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { Button } from '@/ui/common/base/Button'
import { cn } from '@/utils/cn'
import type { MockDmsAgtFscCode } from '@/types/mock/cm'

/** 부모 footer([등록])가 호출하는 확정 동작. */
export interface FSCChcHandle {
  /** 현재 선택 항목을 onRegister 로 반환. */
  register: () => void
}

// FSC 목록 목업 (설계서 slide171 예시 — 군급 1000·1001…/군급명). 추후 API: cmService.selectFscList.
const MOCK_FSC: MockDmsAgtFscCode[] = [
  { fscCd: '1000', gunGrdNm: '군급명 1000' },
  { fscCd: '1001', gunGrdNm: '군급명 1001' },
  { fscCd: '1002', gunGrdNm: '군급명 1002' },
  { fscCd: '1003', gunGrdNm: '군급명 1003' },
  { fscCd: '1111', gunGrdNm: '기타 항공기 부수품' },
]

export interface FSCChcProps {
  /** [등록] 시 호출 — 선택한 FSC 목록을 부모에 반환. */
  onRegister: (items: MockDmsAgtFscCode[]) => void
}

const FSCChc = forwardRef<FSCChcHandle, FSCChcProps>(({ onRegister }, ref) => {
  const [keyword, setKeyword] = useState('')
  const [applied, setApplied] = useState('')
  const [selected, setSelected] = useState<string[]>([]) // 선택된 fscCd 목록(복수)

  const handleSearch = () => {
    setApplied(keyword.trim())
    console.log('[P11] FSC 검색', keyword) // 추후 API: cmService.selectFscList(keyword)
  }

  const results = useMemo(
    () => (applied ? MOCK_FSC.filter((it) => it.gunGrdNm.includes(applied)) : MOCK_FSC),
    [applied],
  )

  const toggle = (fscCd: string) =>
    setSelected((prev) => (prev.includes(fscCd) ? prev.filter((c) => c !== fscCd) : [...prev, fscCd]))

  useImperativeHandle(
    ref,
    () => ({
      register: () => onRegister(MOCK_FSC.filter((it) => selected.includes(it.fscCd))),
    }),
    [onRegister, selected],
  )

  return (
    <div className="flex flex-col gap-krds-7">
      <div className="flex items-end gap-krds-5">
        <InputBox
          autoFocus
          className="flex-1"
          value={keyword}
          placeholder="군급명을 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />
        <Button variant="primary" size="icon" aria-label="군급명 검색" onClick={handleSearch}>
          <Icon name="Search" size={20} aria-hidden />
        </Button>
      </div>

      <div className="flex flex-col gap-krds-5">
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
        <ul className="flex flex-col">
          {results.map((it) => {
            const on = selected.includes(it.fscCd)
            return (
              <li key={it.fscCd}>
                {/* 복수 선택 — 행 클릭 시 선택 토글(좌측 체크 아이콘 on/off). */}
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(it.fscCd)}
                  className="flex w-full items-center gap-krds-5 border-b border-krds-border-divider py-krds-6 text-left active:bg-krds-bg-primary-faint"
                >
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                      on
                        ? 'border-primary bg-primary text-white'
                        : 'border-krds-border-field text-transparent',
                    )}
                  >
                    <Icon name="Check" size={16} aria-hidden />
                  </span>
                  <span className="flex min-w-px flex-1 flex-col gap-1">
                    <span className="text-[17px] font-bold text-krds-text-ink">{it.gunGrdNm}</span>
                    <span className="text-krds-body-sm text-krds-text-muted">군급 {it.fscCd}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})
FSCChc.displayName = 'FSCChc'

export { FSCChc }
