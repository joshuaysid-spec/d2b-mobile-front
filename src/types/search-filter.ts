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

/**
 * 공통 검색 바텀시트 종류 — selectionField 가 SearchFilter 셸에서 직접 여는 검색 시트.
 * 'item'=품목별조회(MUI-OP-01-P71, ItemInqSheet) · 'producer'=생산자조회(P72, PrdcrInqSheet).
 * 시트 구현은 biz/cm/search 에 있으며, 종류만 config 로 선언한다(도메인 문자열 하드코딩 회피).
 */
export type SearchSheetKind = 'item' | 'producer'

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
  /** 가로 스크롤 + 좌우 스와이프 화살표(오버플로우 시 자동). 기본 true. */
  swipeable?: boolean
  /**
   * 상단 '전체' 칩 — 체크 시 모든 항목 선택/해제, 개별↔전체 자동 동기화(CheckboxGroup.selectAll).
   * true 또는 { label } 객체. 사용 시 options 에 별도 '전체' 항목을 두지 않는다.
   */
  selectAll?: boolean | { label?: ReactNode }
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
  type: 'selectionField' // 선택 트리거(SelectionFieldBox, `>`) — value: string
  placeholder?: string
  /** 터치 시 뜨는 선택 바텀시트 제목. 미지정 시 label 사용. */
  sheetTitle?: ReactNode
  /**
   * 선택 바텀시트(NavigationItemList)에 띄울 목록 — 사용 화면의 schema 에 하드코딩.
   * 주어지면 selectionField 터치 시 BottomSheet 가 열리고, 항목 선택 시 그 label 이
   * 필드 값으로 채워진다. 없으면 터치 무동작(추후 커스텀 팝업 연계용 자리).
   */
  sheetItems?: { value: string; label: string }[]
  /**
   * 공통 검색 시트(품목별/생산자 조회)를 SearchFilter 셸이 직접 연다. 지정 시 터치하면
   * 해당 시트가 뜨고, 선택 결과가 이 필드 값으로 주입된다(페이지는 관여 안 함).
   * sheetItems(내장 nav 시트)가 있으면 그쪽이 우선.
   */
  searchSheet?: SearchSheetKind
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
 * 소비자는 자기 도메인 타입(예: OpSearchFilter)으로 캐스팅해 읽는다.
 */
export type SearchFilterValue = Record<string, SearchFilterFieldValue>
