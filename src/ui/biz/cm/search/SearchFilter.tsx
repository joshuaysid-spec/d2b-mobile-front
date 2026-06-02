// Design Ref: search-filter.design.md §2.1 / §5 (v2) — schema 구동 범용 검색필터 셸.
// 책임: FullPopup 래핑 + 아코디언 섹션 렌더 + draft 상태 + 초기화/검색/닫기.
// 필드 렌더는 SearchFilterField 에 위임(도메인·필드 무관). value(확정) ↔ draft(작업중) 분리.
// common/(base·composites)만 사용 — raw 직접 import 금지.
import * as React from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SearchFilterField } from './SearchFilterField'
import type {
  SearchFilterSchema,
  SearchFilterFieldValue,
  SearchFilterValue,
} from '@/types/search-filter'

export interface SearchFilterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 그릴 아코디언/필드 정의 (도메인이 주입) */
  schema: SearchFilterSchema
  /** 확정값 — 재진입 시 이 값으로 복원 (controlled) */
  value?: SearchFilterValue
  /** 초기/초기화 기준값 */
  defaultValue: SearchFilterValue
  /** 검색 클릭 시 호출 + 팝업 닫힘 */
  onSearch: (value: SearchFilterValue) => void
  /** 초기화 클릭 시 추가 동작 (옵션) */
  onReset?: () => void
}

const SearchFilter = ({
  open,
  onOpenChange,
  schema,
  value,
  defaultValue,
  onSearch,
  onReset,
}: SearchFilterProps) => {
  const [draft, setDraft] = React.useState<SearchFilterValue>(value ?? defaultValue)

  // open 시 확정값으로 동기화 — 미확정 편집 폐기, 재진입 시 직전 검색값 복원.
  React.useEffect(() => {
    if (open) setDraft(value ?? defaultValue)
  }, [open, value, defaultValue])

  const setField = (key: string, v: SearchFilterFieldValue) =>
    setDraft((cur) => ({ ...cur, [key]: v }))

  const handleReset = () => {
    setDraft(defaultValue)
    onReset?.()
  }

  const handleSearch = () => {
    onSearch(draft)
    onOpenChange(false)
  }

  // 초기 열림 섹션(defaultOpen !== false) → Radix multiple defaultValue
  const openKeys = schema.sections.filter((s) => s.defaultOpen !== false).map((s) => s.key)

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title={schema.title ?? '검색필터'}
      rightActions={[
        { icon: 'Refresh', label: '초기화', onClick: handleReset },
        { icon: 'Close', label: '닫기', onClick: () => onOpenChange(false) },
      ]}
      footer={
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '닫기', variant: 'secondary', onClick: () => onOpenChange(false) },
            { label: '검색', variant: 'primary', onClick: handleSearch },
          ]}
        />
      }
    >
      <Accordion type="multiple" defaultValue={openKeys} className="w-full">
        {schema.sections.map((section, i) => (
          <AccordionSection
            key={section.key}
            value={section.key}
            title={section.title}
            titleInfo={section.titleInfo}
            borderTop={i > 0}
            variant={'blue'}
          >
            {section.fields.length === 0 ? (
              <p className="text-krds-body-sm text-krds-text-subtle">준비 중입니다.</p>
            ) : (
              section.fields.map((field) => (
                <SearchFilterField
                  key={field.key}
                  field={field}
                  value={draft[field.key]}
                  onChange={(v) => setField(field.key, v)}
                />
              ))
            )}
          </AccordionSection>
        ))}
      </Accordion>
    </FullPopup>
  )
}
SearchFilter.displayName = 'SearchFilter'

export { SearchFilter }
