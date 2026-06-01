// Design Ref: search-filter.design.md §3 (v2) — 범용 검색필터 config/value 타입 (도메인 무관).
// 레이아웃: 아코디언 섹션(접기/펴기) → 각 섹션이 필드 N개를 가짐. (Figma MUI-OP-01-M02, node 9300-37302)
// 컴포넌트(biz/cm/search)는 도메인을 모르고, 사용처가 SearchFilterSchema 로 "그릴 필드"를 선언한다.
import type { ReactNode } from 'react'

// ── 필드 값 ────────────────────────────────────────────────────────────
/** dateRange 값 — 'YYYY-MM-DD' (DateRangeInput 의 DateRange 와 구조 호환) */
export interface DateRangeValue {
  start: string
  end: string
}
/** 필드 하나의 값 — 단일 문자열 / 다중 선택(checkbox) / 기간 */
export type SearchFilterFieldValue = string | string[] | DateRangeValue

// ── 필드 정의 — `type` 으로 분기되는 discriminated union ──────────────────
interface FieldOption {
  value: string
  label: ReactNode
  disabled?: boolean
}
interface BaseField {
  /** value 맵의 키. 소비자 도메인 value 와 1:1 */
  key: string
  /** 필드 라벨(InputLabel). 미지정 시 라벨 없이 컨트롤만 렌더 */
  label?: ReactNode
  required?: boolean
}

export interface RadioFieldDef extends BaseField {
  type: 'radio' // 세로 라디오 그룹 — value: string
  options: FieldOption[]
  /** 좌측 원형 라디오(○/●) 표시 유무. 기본 false(pill). */
  showIndicator?: boolean
}
export interface CheckboxFieldDef extends BaseField {
  type: 'checkbox' // 다중 선택 — value: string[]
  options: FieldOption[]
}
export interface DateRangeFieldDef extends BaseField {
  type: 'dateRange' // 기간(DateRangeInput) — value: DateRangeValue
  /** 빠른선택 프리셋 칩(1주일/1개월/…) 표시 여부. 기본 true. */
  showPresets?: boolean
}
export interface DateFieldDef extends BaseField {
  type: 'date' // 단일 날짜(DateInput) — value: string
  placeholder?: string
}
export interface TextFieldDef extends BaseField {
  type: 'text' // 자유 입력(InputBox) — value: string
  placeholder?: string
}
export interface SelectionFieldDef extends BaseField {
  type: 'selectionField' // 선택 트리거(SelectionFieldBox, `>` 팝업) — value: string
  placeholder?: string
}
export interface SelectFieldDef extends BaseField {
  type: 'select' // 드롭다운(SelectBox) — value: string
  options: FieldOption[]
  placeholder?: string
}

export type SearchFilterField =
  | RadioFieldDef
  | CheckboxFieldDef
  | DateRangeFieldDef
  | DateFieldDef
  | TextFieldDef
  | SelectionFieldDef
  | SelectFieldDef

// ── 아코디언 섹션 ────────────────────────────────────────────────────────
export interface SearchFilterSection {
  /** 섹션(아코디언) 고유 키 */
  key: string
  title: ReactNode
  /** 타이틀 우측 부가 정보 */
  titleInfo?: ReactNode
  /** 초기 열림 여부 (기본 true) */
  defaultOpen?: boolean
  /** 섹션 내 필드들. 빈 배열이면 "준비 중" 플레이스홀더 렌더 */
  fields: SearchFilterField[]
}

// ── schema / value ─────────────────────────────────────────────────────
export interface SearchFilterSchema {
  /** 팝업 타이틀. 기본 '검색필터' */
  title?: ReactNode
  sections: SearchFilterSection[]
}

/**
 * key → value 맵. 셸이 이 형태로 값을 관리하고 onSearch 로 돌려준다.
 * 소비자는 자기 도메인 타입(예: ProcurementSearchFilter)으로 캐스팅해 읽는다.
 */
export type SearchFilterValue = Record<string, SearchFilterFieldValue>
