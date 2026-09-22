// Design Ref: search-filter.design.md §2.1 / §5 (v2) — schema 구동 범용 검색필터 셸.
// 책임: FullPopup 래핑 + 아코디언 섹션 렌더 + 값/검증 상태 + 초기화/검색/닫기.
// 검증 = react-hook-form + zod (2026-08-07 전환 — 폼 검증 레인과 엔진 통일):
//   필드 정의(required)에서 zod 스키마를 자동 생성(buildZodSchema)하고 각 필드를 Controller 로
//   RHF에 등록. 검증 실패 시 검색 차단 + 필드 아래 에러 + 첫 에러 필드로 스크롤.
//   페이지는 schema 에 규칙(required · text 의 minLength/maxLength/pattern)만 선언 — 매핑은 searchFilterSchema.ts.
// 페이지→셸 명령형 제어는 ref(SearchFilterHandle — submit/reset)로도 가능.
// 필드 렌더는 SearchFilterField 에 위임(도메인·필드 무관). value(확정) ↔ RHF 폼값(작업중 draft) 분리.
// common/(base·composites)만 사용 — raw 직접 import 금지.
import * as React from 'react'
import { Controller, useForm, type FieldPath, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SearchFilterField } from './SearchFilterField'
import { buildZodSchema, isEmptyLike } from './searchFilterSchema'
import { ItemInq } from './ItemInq'
import { PrdcrInq } from './PrdcrInq'
import { DeptInq } from './DeptInq'
import { OvsCtrtNoInq } from './OvsCtrtNoInq'
import { RecrdPblcnNoInfoInq } from './RecrdPblcnNoInfoInq'
import { RgnSrch } from './RgnSrch'
import { LcnsInfoSrch } from './LcnsInfoSrch'
import type {
  SearchFilterSchema,
  SearchFilterSchemaResolver,
  SearchFilterFieldValue,
  SearchFilterValue,
  SearchSheetHandle,
  SearchSheetKind,
} from '@/types/search-filter'

export interface SearchFilterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * 그릴 아코디언/필드 정의 (도메인이 주입).
   * - 정적 객체: 항상 같은 섹션/필드.
   * - resolver 함수: 현재 입력값(draft)에 따라 섹션/필드가 달라짐(검색유형 분기 등, MUI-OP-01-M02).
   */
  schema: SearchFilterSchema | SearchFilterSchemaResolver
  /** 확정값 — 재진입 시 이 값으로 복원 (controlled) */
  value?: SearchFilterValue
  /** 초기/초기화 기준값 */
  defaultValue: SearchFilterValue
  /** 검색 클릭 시 호출 + 팝업 닫힘 */
  onSearch: (value: SearchFilterValue) => void
  /**
   * 필드 편집으로 draft 가 바뀔 때마다 호출돼 "보정된 draft"를 돌려주는 훅(옵션).
   * 검색유형처럼 한 필드가 바뀌면 종속 필드(업무구분 등)를 그 유형 기본값으로 갈아끼울 때 사용.
   * (도메인 로직이라 소비자가 주입 — 셸은 어떤 key 가 종속인지 모른다.)
   */
  normalize?: (next: SearchFilterValue, prev: SearchFilterValue) => SearchFilterValue
  /** 초기화 클릭 시 추가 동작 (옵션) */
  onReset?: () => void
  /**
   * selectionField(`>`) 터치 시 호출 — field.searchSheet(셸 내장 공통 검색시트)에 해당하지 않는
   * 커스텀 팝업을 외부에서 열고 싶을 때만 사용. searchSheet 가 지정된 필드는 셸이 직접 처리하므로
   * 이 콜백은 호출되지 않는다(페이지는 보통 SearchFilter 하나만 import 하면 됨).
   */
  onSelectionClick?: (key: string, current: string, commit: (value: string) => void) => void
}

// ── 검색 버튼 활성화 판정(260729 확정): draft 가 기본값(defaultValue)과 다를 때만 검색 가능. ──
// 빈값 동치(isEmptyLike — searchFilterSchema)로 비교해, 미입력 필드가 ''/undefined 로
// 표기만 다른 경우는 "같다"로 본다(예: 입력했다 지운 텍스트 필드).
const isSameValue = (a: unknown, b: unknown): boolean => {
  if (isEmptyLike(a) || isEmptyLike(b)) return isEmptyLike(a) && isEmptyLike(b)
  if (Object.is(a, b)) return true
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((x, i) => isSameValue(x, b[i]))
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null)
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].every((k) =>
      isSameValue((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
    )
  return false
}

// 필드 정의 → zod 스키마 자동 생성은 searchFilterSchema.ts(buildZodSchema) — 규칙 확장은 그 파일에서.

/** 페이지→셸 명령형 핸들 — footer 버튼과 동일 동작을 밖에서 트리거할 때. */
export interface SearchFilterHandle {
  /** [검색]과 동일 — RHF+zod 검증 후 통과 시 onSearch 호출. */
  submit: () => void
  /** [초기화]와 동일 — defaultValue 로 리셋. */
  reset: () => void
}

const SearchFilter = React.forwardRef<SearchFilterHandle, SearchFilterProps>(function SearchFilter(
  {
    open,
    onOpenChange,
    schema,
    value,
    defaultValue,
    onSearch,
    normalize,
    onReset,
    onSelectionClick,
  },
  handleRef,
) {
  // 값/검증 상태는 RHF 소유. zod 스키마는 "현재 resolved schema" 기준으로 검증 시점에 생성
  // (동적 schema — resolver 로 섹션이 바뀌면 required 집합도 바뀌므로 ref 로 최신 참조).
  const schemaRef = React.useRef<SearchFilterSchema | null>(null)
  const formResolver = React.useMemo<Resolver<SearchFilterValue>>(
    () => (values, ctx, opts) => {
      // zodResolver 의 값 제네릭(looseObject 추론)과 SearchFilterValue 를 맞추기 위한 단언
      // (키/값 형태는 동일 — zod 스키마가 필드 정의에서 생성되므로 런타임 불일치 없음).
      const resolve = zodResolver(
        buildZodSchema(schemaRef.current!),
      ) as unknown as Resolver<SearchFilterValue>
      return resolve(values, ctx, opts)
    },
    [],
  )
  const form = useForm<SearchFilterValue>({
    resolver: formResolver,
    mode: 'onSubmit',
    reValidateMode: 'onChange', // 검증 실패 필드는 값이 채워지는 즉시 에러 해제(기존 동작 유지)
    defaultValues: value ?? defaultValue,
  })
  // draft = RHF 폼의 현재 값(편집 중) — watch 로 구독해 resolver/버튼 활성 판정에 사용.
  const draft: SearchFilterValue = { ...form.watch() }

  // 정적 schema 면 그대로, resolver 면 현재 draft 로 매 렌더 재계산 → 검색유형 변경 시 섹션/필드가 바뀜.
  const resolved: SearchFilterSchema = typeof schema === 'function' ? schema(draft) : schema
  schemaRef.current = resolved

  // 공통 검색시트(품목별/생산자) — selectionField.searchSheet 가 셸에서 직접 연다.
  // sheet 가 set 되면 해당 시트가 열리고, 선택 결과는 sheet.commit 으로 해당 필드에 주입된다.
  const [sheet, setSheet] = React.useState<{
    kind: SearchSheetKind
    commit: (value: string) => void
  } | null>(null)

  // 콘텐츠 전용 검색 시트(ItemInq/PrdcrInq/DeptInq)의 명령형 핸들 — footer(초기화/검색)는
  // 셸이 소유하므로 동작만 ref 로 받아 호출한다. 시트는 한 번에 하나만 열리지만, 닫힘 애니메이션
  // 동안 Radix presence 가 콘텐츠를 유지하도록 종류별 BottomSheet 를 따로 둔다(종류별 ref).
  const itemRef = React.useRef<SearchSheetHandle>(null)
  const prdcrRef = React.useRef<SearchSheetHandle>(null)
  const deptRef = React.useRef<SearchSheetHandle>(null)
  const regionRef = React.useRef<SearchSheetHandle>(null)
  const licenseRef = React.useRef<SearchSheetHandle>(null)
  const ctrtNoRef = React.useRef<SearchSheetHandle>(null)
  const recrdPblcnNoRef = React.useRef<SearchSheetHandle>(null)

  const closeSheet = (nextOpen: boolean) => {
    if (!nextOpen) setSheet(null)
  }
  // 결과 선택 → 호출 필드에 주입 + 시트 닫힘.
  const handleSheetSelect = (value: string) => {
    sheet?.commit(value)
    setSheet(null)
  }
  // 세 시트 공통 footer(초기화/검색) — 동작은 해당 콘텐츠 ref 로 위임.
  const sheetFooter = (ref: React.RefObject<SearchSheetHandle | null>) => (
    <ButtonGroup
      layout="asymmetric"
      items={[
        { label: '초기화', variant: 'secondary', onClick: () => ref.current?.reset() },
        { label: '검색', variant: 'primary', onClick: () => ref.current?.search() },
      ]}
    />
  )

  // resolved schema 의 selectionField 중 searchSheet 가 지정된 key → 시트 종류 매핑.
  // (동적 schema 라 매 렌더 재계산 — 섹션 수가 적어 비용 무시 가능)
  const sheetKindByKey: Record<string, SearchSheetKind> = {}
  resolved.sections.forEach((s) =>
    s.fields.forEach((f) => {
      if (f.type === 'selectionField' && f.searchSheet) sheetKindByKey[f.key] = f.searchSheet
    }),
  )

  // 필드의 selectionField 터치 → searchSheet 지정이면 셸이 직접 열고, 아니면 외부 콜백 위임.
  const handleSelectionClick = (key: string, current: string, commit: (value: string) => void) => {
    const kind = sheetKindByKey[key]
    if (kind) {
      setSheet({ kind, commit })
      return
    }
    onSelectionClick?.(key, current, commit)
  }

  // open 시 확정값으로 동기화 — 미확정 편집 폐기(에러 포함), 재진입 시 직전 검색값 복원.
  React.useEffect(() => {
    if (open) form.reset(value ?? defaultValue)
  }, [open, value, defaultValue, form])

  // 필드 변경 후처리 — normalize 가 있으면 종속 필드 보정(예: 검색유형 변경 → 업무구분 기본값 교체).
  // Controller 의 rf.onChange 가 해당 필드를 반영한 뒤, 보정으로 달라진 다른 키만 setValue.
  const applyNormalize = (key: string, v: SearchFilterFieldValue, prev: SearchFilterValue) => {
    if (!normalize) return
    const next = { ...prev, [key]: v }
    const fixed = normalize(next, prev)
    Object.keys(fixed).forEach((k) => {
      if (!Object.is(fixed[k], next[k])) form.setValue(k as FieldPath<SearchFilterValue>, fixed[k])
    })
  }

  const handleReset = () => {
    form.reset(defaultValue)
    onReset?.()
  }

  // 검색 — RHF handleSubmit: zod 검증 통과 시에만 onSearch, 실패 시 첫 에러 필드로 스크롤.
  const handleSearch = form.handleSubmit(
    (data) => {
      onSearch(data)
      onOpenChange(false)
    },
    (errors) => {
      const first = resolved.sections
        .flatMap((s) => s.fields.map((f) => f.key))
        .find((k) => errors[k])
      // FullPopup 내부 스크롤 컨테이너 기준 — window.scrollTo 금지(레포 규칙), scrollIntoView 사용.
      if (first)
        document
          .getElementById(`sf-field-${first}`)
          ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    },
  )

  // 페이지→셸 명령형 핸들 — footer 버튼과 동일 동작.
  React.useImperativeHandle(handleRef, () => ({
    submit: () => void handleSearch(),
    reset: handleReset,
  }))

  // 검색 버튼 — draft 가 기본값 그대로면 비활성(바꾼 게 있어야 검색 가능).
  // draft 는 watch 스프레드라 매 렌더 새 객체 → useMemo 무의미, 직접 계산(키 수가 적어 비용 무시).
  const isDefaultDraft = [...new Set([...Object.keys(draft), ...Object.keys(defaultValue)])].every(
    (k) => isSameValue(draft[k], defaultValue[k]),
  )

  // 초기 열림 섹션(defaultOpen !== false) → Radix multiple defaultValue
  const openKeys = resolved.sections.filter((s) => s.defaultOpen !== false).map((s) => s.key)
  // 섹션 구성이 바뀌면(검색유형 전환) Accordion 을 remount 해 새 섹션의 기본 열림 상태를 재적용한다.
  // (Radix defaultValue 는 mount 시 1회만 적용되므로, 동적 섹션은 key 변경으로 다시 열어줌.
  //  섹션 key 집합이 같으면 remount 안 돼 사용자가 접/펴둔 상태 보존)
  const accordionKey = resolved.sections.map((s) => s.key).join('|')

  return (
    <>
      <FullPopup
        open={open}
        onOpenChange={onOpenChange}
        title={resolved.title ?? '검색필터'}
        rightActions={[
          { icon: 'Refresh', label: '초기화', onClick: handleReset },
          { icon: 'Close', label: '닫기', onClick: () => onOpenChange(false) },
        ]}
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => onOpenChange(false) },
              {
                label: '검색',
                variant: 'primary',
                onClick: handleSearch,
                disabled: isDefaultDraft,
              },
            ]}
          />
        }
      >
        <Accordion key={accordionKey} type="multiple" defaultValue={openKeys} className="w-full">
          {resolved.sections.map((section, i) => (
            <AccordionSection
              key={section.key}
              value={section.key}
              title={section.title}
              titleInfo={section.titleInfo}
              borderTop={i > 0}
              variant={'blue'}
              // 검색필터는 상단 간격 필요 → py 보강(공통 기본 pt-0 위에 덮어씀). py-4=상하 16px, 표준값이라 twMerge 가 raw pt-0 확실히 덮음.
              contentClassName="py-4"
            >
              {section.fields.length === 0 ? (
                <p className="text-krds-body-sm text-krds-text-subtle">준비 중입니다.</p>
              ) : (
                section.fields.map((field) => (
                  // Controller = RHF에 필드 등록(값·검증 연결). SearchFilterField 디스패처는 그대로
                  // value/onChange 만 받음. div id = 에러 스크롤 앵커(항상 감싸 remount 방지).
                  <Controller
                    key={field.key}
                    control={form.control}
                    name={field.key as FieldPath<SearchFilterValue>}
                    render={({ field: rf, fieldState }) => (
                      <div id={`sf-field-${field.key}`} className="flex flex-col gap-krds-3">
                        <SearchFilterField
                          field={field}
                          value={rf.value as SearchFilterFieldValue | undefined}
                          onChange={(v) => {
                            const prev = form.getValues()
                            rf.onChange(v)
                            applyNormalize(field.key, v, prev)
                          }}
                          onSelectionClick={handleSelectionClick}
                          error={!!fieldState.error} // 빨간 테두리 — 문구(아래 InputMessage)와 함께
                        />
                        {fieldState.error && (
                          <InputMessage type="error">
                            {fieldState.error.message ?? '필수 입력 항목입니다.'}
                          </InputMessage>
                        )}
                      </div>
                    )}
                  />
                ))
              )}
            </AccordionSection>
          ))}
        </Accordion>
      </FullPopup>

      {/* 공통 검색 바텀시트 — selectionField.searchSheet 가 셸에서 직접 연다(페이지 관여 X).
          셸이 BottomSheet 컨테이너(타이틀/footer/open)를 소유하고, 콘텐츠 전용 컴포넌트를 슬롯에 끼운다. */}
      <BottomSheet
        open={sheet?.kind === 'item'}
        onOpenChange={closeSheet}
        title="품목별 검색"
        footer={sheetFooter(itemRef)}
      >
        <ItemInq ref={itemRef} onSelect={handleSheetSelect} />
      </BottomSheet>
      <BottomSheet
        open={sheet?.kind === 'producer'}
        onOpenChange={closeSheet}
        title="생산자 검색"
        footer={sheetFooter(prdcrRef)}
      >
        <PrdcrInq ref={prdcrRef} onSelect={handleSheetSelect} />
      </BottomSheet>
      {/* 발주부서(기관) 검색(P04) — Figma 10020:129198·129208: footer 없음(검색 버튼은 콘텐츠가 소유, 닫기는 타이틀 X). */}
      <BottomSheet
        open={sheet?.kind === 'dept'}
        onOpenChange={closeSheet}
        title="발주부서(기관) 검색"
      >
        <DeptInq ref={deptRef} onSelect={handleSheetSelect} />
      </BottomSheet>
      <BottomSheet
        open={sheet?.kind === 'region'}
        onOpenChange={closeSheet}
        title="지역검색"
        footer={sheetFooter(regionRef)}
      >
        <RgnSrch ref={regionRef} onSelect={handleSheetSelect} />
      </BottomSheet>
      <BottomSheet open={sheet?.kind === 'license'} onOpenChange={closeSheet} title="면허정보 검색">
        {/* 면허정보 검색(P05) — P04 와 동일하게 footer 없음(검색 버튼은 콘텐츠 소유, 닫기는 타이틀 X). */}
        <LcnsInfoSrch ref={licenseRef} onSelect={handleSheetSelect} />
      </BottomSheet>
      {/* 계약번호조회(MUI-EX-02-P79) — 확정형 시트: 내부 [검색]은 콘텐츠 소유, footer=[닫기/계약번호 선택](Figma·설계서 slide84). */}
      <BottomSheet
        open={sheet?.kind === 'ctrtNo'}
        onOpenChange={closeSheet}
        title="계약번호조회"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => setSheet(null) },
              {
                label: '계약번호 선택',
                variant: 'primary',
                onClick: () => ctrtNoRef.current?.confirm?.(),
              },
            ]}
          />
        }
      >
        <OvsCtrtNoInq ref={ctrtNoRef} onSelect={handleSheetSelect} />
      </BottomSheet>
      {/* 조서발행번호정보조회(MUI-EX-01-P06) — 확정형 시트: 내부 [검색]은 콘텐츠 소유,
          footer=[닫기/조서발행번호 선택](설계서 slide34, P79 패턴). */}
      <BottomSheet
        open={sheet?.kind === 'recrdPblcnNo'}
        onOpenChange={closeSheet}
        title="조서발행번호정보조회"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => setSheet(null) },
              {
                label: '조서발행번호 선택',
                variant: 'primary',
                onClick: () => recrdPblcnNoRef.current?.confirm?.(),
              },
            ]}
          />
        }
      >
        <RecrdPblcnNoInfoInq ref={recrdPblcnNoRef} onSelect={handleSheetSelect} />
      </BottomSheet>
    </>
  )
})
SearchFilter.displayName = 'SearchFilter'

export { SearchFilter }
