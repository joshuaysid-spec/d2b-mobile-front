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
/** priceRange 값 — 추정가격 범위(원, 정수). min ≤ max. */
export interface PriceRangeValue {
  min: number
  max: number
}
/** 필드 하나의 값 — 단일 문자열 / 다중 선택(checkbox) / 기간 / 가격범위 */
export type SearchFilterFieldValue = string | string[] | DateRangeValue | PriceRangeValue

/**
 * 공통 검색 바텀시트 종류 — selectionField 가 SearchFilter 셸에서 직접 여는 검색 시트.
 * 'item'=품목별조회(MUI-OP-01-P71, ItemInq) · 'producer'=생산자조회(P72, PrdcrInq) ·
 * 'dept'=발주부서(기관)조회(MUI-BD-01-P04, DeptInq) · 'region'=지역검색(MUI-BD-01-P03, RgnSrch) ·
 * 'license'=면허정보검색(MUI-BD-01-P05, LcnsInfoSrch) · 'ctrtNo'=계약번호조회(MUI-EX-02-P79, OvsCtrtNoInq) ·
 * 'recrdPblcnNo'=조서발행번호정보조회(MUI-EX-01-P06, RecrdPblcnNoInfoInq).
 * 콘텐츠 컴포넌트는 biz/cm/search 에 있으며(BottomSheet 컨테이너는 SearchFilter 셸이 슬롯으로 소유),
 * 종류만 config 로 선언한다(도메인 문자열 하드코딩 회피).
 */
export type SearchSheetKind =
  | 'item'
  | 'producer'
  | 'dept'
  | 'region'
  | 'license'
  | 'ctrtNo'
  | 'recrdPblcnNo'

/**
 * 공통 검색 시트 콘텐츠(ItemInq/PrdcrInq/DeptInq)의 명령형 핸들.
 * 시트 footer(초기화/검색)는 SearchFilter 셸(BottomSheet 컨테이너)이 소유하므로,
 * 폼 상태를 가진 콘텐츠가 ref 로 동작만 노출한다(상태는 콘텐츠 안에 캡슐화).
 * ('ctrtNo'=계약번호조회(MUI-EX-02-P79, OvsCtrtNoInq)는 footer 가 [닫기/계약번호 선택]이라 confirm 사용)
 */
export interface SearchSheetHandle {
  /** footer '초기화' — 입력값/검색결과 초기화 */
  reset: () => void
  /** footer '검색' — 현재 조건으로 목록 조회 */
  search: () => void
  /** footer 확정 버튼(예: P79 '계약번호 선택') — 라디오 선택값을 호출 필드로 반환. 확정형 시트만 구현. */
  confirm?: () => void
}

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
  type: 'radio' // 라디오 그룹 — value: string
  options: FieldOption[]
  /** 좌측 원형 라디오(○/●) 표시 유무. 기본 false(pill). */
  showIndicator?: boolean
  /** 배치 방향. 'vertical'(세로 스택, 기본 — 검색유형) / 'horizontal'(가로, 예: 신기술여부 예/아니오). */
  direction?: 'horizontal' | 'vertical'
}
export interface CheckboxFieldDef extends BaseField {
  type: 'checkbox' // 다중 선택 — value: string[]
  options: FieldOption[]
  /** 가로 스크롤 + 좌우 스와이프 화살표(오버플로우 시 자동). 기본 true. */
  swipeable?: boolean
  /**
   * 상단 '전체' 칩 — 체크 시 모든 항목 선택/해제, 개별↔전체 자동 동기화(CheckboxGroup.selectAll).
   * true 또는 { label, disabled } 객체. 사용 시 options 에 별도 '전체' 항목을 두지 않는다.
   * disabled: '전체' 칩만 비활성(선택 가능 항목이 하나뿐이라 '전체'가 무의미할 때 등).
   */
  selectAll?: boolean | { label?: ReactNode; disabled?: boolean }
}
/** DateRangeInput 프리셋 칩 정의 — DateRangePreset 와 구조 호환(레이어링 위해 inline). */
export type DateRangePresetDef =
  | { label: string; days: number }
  | { label: string; months: number }
export interface DateRangeFieldDef extends BaseField {
  type: 'dateRange' // 기간(DateRangeInput) — value: DateRangeValue
  /** 빠른선택 프리셋 칩(1주일/1개월/…) 표시 여부. 기본 true. */
  showPresets?: boolean
  /** 프리셋 칩 목록 커스텀. 미지정 시 DateRangeInput 기본(1주일/1개월/3개월). */
  presets?: DateRangePresetDef[]
}
export interface MonthRangeFieldDef extends BaseField {
  type: 'monthRange' // 월 범위(MonthRangeInput, 휠) — value: DateRangeValue('YYYY-MM'). 조달계획 발주예정월 등 월 단위 기간.
  /** 빠른선택 프리셋 칩(최근 1/3/6개월 등) 표시 여부. 기본 true. */
  showPresets?: boolean
  /** 프리셋 칩 목록 커스텀. 미지정 시 MonthRangeInput 기본(최근 1/3/6개월). */
  presets?: { label: string; months: number }[]
}
export interface YearFieldDef extends BaseField {
  type: 'year' // 연도 선택 피커(YearInput, 휠) — value: string 'YYYY'
  placeholder?: string
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
export interface SegmentFieldDef extends BaseField {
  type: 'segment' // 세그먼트(SegmentedControl) — 옵션 중 택1. value: string. 단일 옵션이면 라벨/지표.
  options: FieldOption[]
}
export interface PriceRangeFieldDef extends BaseField {
  type: 'priceRange' // 가격 범위(Slider + min/max 입력) — value: PriceRangeValue. (MUI-BD-01-M02 추정가격)
  /** 슬라이더 도메인 최소 (기본 0) */
  rangeMin?: number
  /** 슬라이더 도메인 최대 (기본 100_000_000 = 1억) */
  rangeMax?: number
  /** 스텝 (기본 1_000_000 = 100만, 설계서 '최소값 100만') */
  step?: number
  /** 값 뒤 단위 표기 (기본 '원') */
  unit?: ReactNode
}

export type SearchFilterField =
  | RadioFieldDef
  | CheckboxFieldDef
  | DateRangeFieldDef
  | MonthRangeFieldDef
  | DateFieldDef
  | YearFieldDef
  | TextFieldDef
  | SelectionFieldDef
  | SegmentFieldDef
  | SelectFieldDef
  | PriceRangeFieldDef

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

/**
 * 동적 schema resolver — 현재 입력값(검색유형 등)에 따라 섹션/필드가 달라질 때,
 * 정적 SearchFilterSchema 대신 "값 → schema" 함수를 넘긴다. SearchFilter 가 draft 변경마다
 * 재호출해 화면을 다시 그린다.
 * 예) MUI-OP-01-M02 검색유형(조달계획/사전규격/연간조달계획)에 따라 날짜·검색어·구분설정 섹션이 바뀜.
 */
export type SearchFilterSchemaResolver = (value: SearchFilterValue) => SearchFilterSchema
