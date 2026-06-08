// Design Ref: search-filter.design.md §2.1 / §5 (v2) — schema 구동 범용 검색필터 셸.
// 책임: FullPopup 래핑 + 아코디언 섹션 렌더 + draft 상태 + 초기화/검색/닫기.
// 필드 렌더는 SearchFilterField 에 위임(도메인·필드 무관). value(확정) ↔ draft(작업중) 분리.
// common/(base·composites)만 사용 — raw 직접 import 금지.
import * as React from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SearchFilterField } from './SearchFilterField'
import { ItemInqSheet } from './ItemInqSheet'
import { PrdcrInqSheet } from './PrdcrInqSheet'
import type {
  SearchFilterSchema,
  SearchFilterFieldValue,
  SearchFilterValue,
  SearchSheetKind,
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
  /**
   * selectionField(`>`) 터치 시 호출 — field.searchSheet(셸 내장 공통 검색시트)에 해당하지 않는
   * 커스텀 팝업을 외부에서 열고 싶을 때만 사용. searchSheet 가 지정된 필드는 셸이 직접 처리하므로
   * 이 콜백은 호출되지 않는다(페이지는 보통 SearchFilter 하나만 import 하면 됨).
   */
  onSelectionClick?: (
    key: string,
    current: string,
    commit: (value: string) => void,
  ) => void
}

const SearchFilter = ({
  open,
  onOpenChange,
  schema,
  value,
  defaultValue,
  onSearch,
  onReset,
  onSelectionClick,
}: SearchFilterProps) => {
  const [draft, setDraft] = React.useState<SearchFilterValue>(value ?? defaultValue)

  // 공통 검색시트(품목별/생산자) — selectionField.searchSheet 가 셸에서 직접 연다.
  // sheet 가 set 되면 해당 시트가 열리고, 선택 결과는 sheet.commit 으로 해당 필드에 주입된다.
  const [sheet, setSheet] = React.useState<{
    kind: SearchSheetKind
    commit: (value: string) => void
  } | null>(null)

  // schema 의 selectionField 중 searchSheet 가 지정된 key → 시트 종류 매핑.
  const sheetKindByKey = React.useMemo(() => {
    const map: Record<string, SearchSheetKind> = {}
    schema.sections.forEach((s) =>
      s.fields.forEach((f) => {
        if (f.type === 'selectionField' && f.searchSheet) map[f.key] = f.searchSheet
      }),
    )
    return map
  }, [schema])

  // 필드의 selectionField 터치 → searchSheet 지정이면 셸이 직접 열고, 아니면 외부 콜백 위임.
  const handleSelectionClick = (
    key: string,
    current: string,
    commit: (value: string) => void,
  ) => {
    const kind = sheetKindByKey[key]
    if (kind) {
      setSheet({ kind, commit })
      return
    }
    onSelectionClick?.(key, current, commit)
  }

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
    <>
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
                  onSelectionClick={handleSelectionClick}
                />
              ))
            )}
          </AccordionSection>
        ))}
      </Accordion>
    </FullPopup>

      {/* 공통 검색 바텀시트 — selectionField.searchSheet 가 셸에서 직접 연다(페이지 관여 X). */}
      <ItemInqSheet
        open={sheet?.kind === 'item'}
        onOpenChange={(o) => {
          if (!o) setSheet(null)
        }}
        onSelect={(v) => {
          sheet?.commit(v)
          setSheet(null)
        }}
      />
      <PrdcrInqSheet
        open={sheet?.kind === 'producer'}
        onOpenChange={(o) => {
          if (!o) setSheet(null)
        }}
        onSelect={(v) => {
          sheet?.commit(v)
          setSheet(null)
        }}
      />
    </>
  )
}
SearchFilter.displayName = 'SearchFilter'

export { SearchFilter }
