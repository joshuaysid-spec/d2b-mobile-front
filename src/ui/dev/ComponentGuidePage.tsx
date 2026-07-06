/**
 * ComponentGuidePage — 개발자용 컴포넌트 카탈로그
 * 모바일 앱 셸(AppLayout) 밖의 최상위 라우트(`/guide`) — PC 해상도 전용.
 * base / composites 컴포넌트의 variant/size/state 를 한눈에 확인하기 위한 개발 참고 화면.
 */
import { useState } from 'react'

import { cn } from '@/utils/cn'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Calendar } from '@/ui/common/base/Calendar'
import { WheelPicker } from '@/ui/common/base/WheelPicker'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { DateInputBox } from '@/ui/common/base/DateInputBox'
import { DateRangeInputBox } from '@/ui/common/base/DateRangeInputBox'
import { Icon } from '@/ui/common/base/Icon'
import { Image } from '@/ui/common/base/Image'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { Label } from '@/ui/common/base/Label'
import { Logo } from '@/ui/common/base/Logo'
import { NavigationItem } from '@/ui/common/base/NavigationItem'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { RadioButton } from '@/ui/common/base/RadioButton'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { SelectionFieldBox } from '@/ui/common/base/SelectionFieldBox'
import { Spinner } from '@/ui/common/base/Spinner'
import { Switch } from '@/ui/common/base/Switch'
import { Tab } from '@/ui/common/base/Tab'
import { Tag } from '@/ui/common/base/Tag'
import { TextArea } from '@/ui/common/base/TextArea'
import { Empty } from '@/ui/common/feedback/Empty'
import { Skeleton } from '@/ui/common/feedback/Skeleton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomNav } from '@/ui/common/composites/BottomNav'
import { Footer } from '@/ui/common/composites/Footer'
import { Header } from '@/ui/common/composites/Header'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { DateInput } from '@/ui/common/composites/DateInput'
import { DateRangeInput } from '@/ui/common/composites/DateRangeInput'
import { RangeSliderInput } from '@/ui/common/composites/RangeSliderInput'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { Card } from '@/ui/common/composites/Card'
import { List } from '@/ui/common/composites/List'
import { MenuAccordion } from '@/ui/common/composites/MenuAccordion'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { Notice } from '@/ui/common/composites/Notice'
import { StepBar } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Toast } from '@/ui/common/composites/Toast'
import { Table } from '@/ui/common/composites/Table'
import { TabList } from '@/ui/common/composites/TabList'
import { TagList } from '@/ui/common/composites/TagList'
import { RadioGroup } from '@/ui/raw/radio-group'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { CheckboxGroup } from '@/ui/common/composites/CheckboxGroup'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList } from '@/ui/common/composites/CardList'
import { CarouselIndicator } from '@/ui/common/composites/CarouselIndicator'
import { Carousel } from '@/ui/common/composites/Carousel'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { Slider } from '@/ui/common/base/Slider'

const NAV = [
  {
    group: 'base',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'inputbox', label: 'InputBox' },
      { id: 'textarea', label: 'TextArea' },
      { id: 'radiobutton', label: 'RadioButton' },
      { id: 'switch', label: 'Switch' },
      { id: 'segmentedcontrol', label: 'SegmentedControl' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'dateinputbox', label: 'DateInputBox' },
      { id: 'daterangeinputbox', label: 'DateRangeInputBox' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'wheelpicker', label: 'WheelPicker' },
      { id: 'icon', label: 'Icon' },
      { id: 'image', label: 'Image' },
      { id: 'badge', label: 'Badge' },
      { id: 'label', label: 'Label' },
      { id: 'inputlabel', label: 'InputLabel' },
      { id: 'inputmessage', label: 'InputMessage' },
      { id: 'selectbox', label: 'SelectBox' },
      { id: 'selectionfieldbox', label: 'SelectionFieldBox' },
      { id: 'slider', label: 'Slider' },
      { id: 'pagetitle', label: 'PageTitle' },
      { id: 'sectiontitle', label: 'SectionTitle' },
      { id: 'sectiondivider', label: 'SectionDivider' },
      { id: 'tag', label: 'Tag' },
      { id: 'tab', label: 'Tab' },
      { id: 'navigationitem', label: 'NavigationItem' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'logo', label: 'Logo' },
    ],
  },
  {
    group: 'composites',
    items: [
      { id: 'radiobuttongroup', label: 'RadioButtonGroup' },
      { id: 'checkboxgroup', label: 'CheckboxGroup' },
      { id: 'agreementlist', label: 'AgreementList' },
      { id: 'infobox', label: 'Infobox' },
      { id: 'searchcondition', label: 'SearchCondition' },
      { id: 'listsectionheader', label: 'ListSectionHeader' },
      { id: 'cardlist', label: 'CardList' },
      { id: 'carouselindicator', label: 'CarouselIndicator' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'filedownloadlist', label: 'FileDownloadList' },
      { id: 'buttongroup', label: 'ButtonGroup' },
      { id: 'bottomsheet', label: 'BottomSheet' },
      { id: 'alertmodal', label: 'AlertModal' },
      { id: 'fullpopup', label: 'FullPopup' },
      { id: 'dateinput', label: 'DateInput' },
      { id: 'daterangeinput', label: 'DateRangeInput' },
      { id: 'rangesliderinput', label: 'RangeSliderInput' },
      { id: 'floatingactionbutton', label: 'FloatingActionButton' },
      { id: 'taglist', label: 'TagList' },
      { id: 'tablist', label: 'TabList' },
      { id: 'navigationitemlist', label: 'NavigationItemList' },
      { id: 'stepbar', label: 'StepBar' },
      { id: 'notice', label: 'Notice' },
      { id: 'table', label: 'Table' },
      { id: 'card', label: 'Card' },
      { id: 'menuaccordion', label: 'MenuAccordion' },
      { id: 'list', label: 'List' },
      { id: 'summaryinfo', label: 'SummaryInfo' },
      { id: 'summaryutilbutton', label: 'SummaryUtilButton' },
      { id: 'toast', label: 'Toast' },
      { id: 'header', label: 'Header' },
      { id: 'bottomnav', label: 'BottomNav' },
      { id: 'footer', label: 'Footer' },
    ],
  },
  {
    group: 'feedback',
    items: [
      { id: 'empty', label: 'Empty' },
      { id: 'skeleton', label: 'Skeleton' },
    ],
  },
]

export function ComponentGuidePage() {
  const [clearable, setClearable] = useState('지울 수 있는 입력값')
  const [opKeyword, setOpKeyword] = useState('')
  const [opTargets, setOpTargets] = useState<string[]>(['name'])
  const [opPageSize, setOpPageSize] = useState(10)
  const [dateValue, setDateValue] = useState('2026-05-01')
  const [rangeValue, setRangeValue] = useState({ start: '2026-05-01', end: '2026-05-30' })
  const [priceRange, setPriceRange] = useState({ min: 10_000_000, max: 20_000_000 })
  const [calSingle, setCalSingle] = useState<string>('2026-05-13')
  const [calRange, setCalRange] = useState<{ start: string | null; end: string | null }>({
    start: '2026-05-11',
    end: '2026-05-18',
  })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetConfirmOpen, setSheetConfirmOpen] = useState(false)
  const [alertSingleOpen, setAlertSingleOpen] = useState(false)
  const [alertSplitOpen, setAlertSplitOpen] = useState(false)
  const [alertErrorOpen, setAlertErrorOpen] = useState(false)
  const [alertNoIconOpen, setAlertNoIconOpen] = useState(false)
  const [fullPopupBasicOpen, setFullPopupBasicOpen] = useState(false)
  const [fullPopupResetOpen, setFullPopupResetOpen] = useState(false)
  const [dateInputValue, setDateInputValue] = useState('2026-05-01')
  const [rangeInputValue, setRangeInputValue] = useState({
    start: '2026-05-01',
    end: '2026-05-30',
  })
  const [sfFilled, setSfFilled] = useState('발주기관명')
  const [sfError, setSfError] = useState('발주기관명')
  const [fabPlusCount, setFabPlusCount] = useState(0)
  const [fabTopCount, setFabTopCount] = useState(0)
  const [tagListItems, setTagListItems] = useState<{ id: string; label: string }[]>([
    { id: '1', label: '입찰서' },
    { id: '2', label: '공고' },
    { id: '3', label: '낙찰' },
    { id: '4', label: '계약' },
  ])
  const [navClicked, setNavClicked] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState('bid')
  const [tabManyValue, setTabManyValue] = useState('t1')
  const [listSwitch1, setListSwitch1] = useState(true)
  const [listSwitch2, setListSwitch2] = useState(false)
  const [listSwitch3, setListSwitch3] = useState(true)
  const [toastShortOpen, setToastShortOpen] = useState(false)
  const [toastLongOpen, setToastLongOpen] = useState(false)
  const [toastManualOpen, setToastManualOpen] = useState(false)
  const [carouselPage, setCarouselPage] = useState(1)

  // 좌측 목차(메뉴) 그룹별 접힘/펼침 — 기본 전체 접힘으로 메뉴를 짧게.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const toggleGroup = (group: string) =>
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))

  return (
    <div className="min-h-screen bg-muted">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1200px] items-baseline gap-3 px-8 py-5">
          <h1 className="text-krds-heading-md font-bold text-foreground">D2B 컴포넌트 가이드</h1>
          <span className="text-krds-body-sm text-krds-text-muted">개발자용 컴포넌트 카탈로그</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] gap-8 px-8 py-10">
        {/* 좌측 목차 */}
        <nav className="sticky top-24 hidden h-fit w-44 shrink-0 lg:block">
          <p className="mb-3 text-krds-label-xs font-bold uppercase text-krds-text-subtle">
            Components
          </p>
          {NAV.map(({ group, items }) => {
            const expanded = openGroups[group] ?? false
            return (
              <div key={group} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-1 rounded-krds-sm px-3 py-1 text-left text-krds-label-xs font-bold text-krds-text-muted hover:bg-muted"
                >
                  <Icon
                    name="ExpandMore"
                    size={16}
                    className={cn('shrink-0 transition-transform', !expanded && '-rotate-90')}
                    aria-hidden
                  />
                  <span>{group}</span>
                  <span className="text-krds-text-disabled">({items.length})</span>
                </button>
                {expanded &&
                  (items.length === 0 ? (
                    <p className="px-3 py-1 text-krds-label-xs text-krds-text-disabled">—</p>
                  ) : (
                    <ul className="mt-0.5 flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto overscroll-contain pr-1">
                      {items.map((s) => (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            className="block rounded-krds-sm px-3 py-1.5 pl-8 text-krds-body-sm text-krds-text-muted hover:bg-muted hover:text-krds-text-primary"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ))}
              </div>
            )
          })}
        </nav>

        {/* 본문 */}
        <main className="flex min-w-0 flex-1 flex-col gap-12">
          {/* ═══════════ base ═══════════ */}
          <GroupHeading>base</GroupHeading>

          {/* ───────── Button ───────── */}
          <Section
            id="button"
            title="Button"
            desc="Figma m_button(9052-233) 1:1. variant 4종 · size 4종 · 아이콘은 children 으로 전달."
          >
            <Row label="variant">
              <Specimen caption='variant="primary"'>
                <Button variant="primary">버튼</Button>
              </Specimen>
              <Specimen caption='variant="secondary"'>
                <Button variant="secondary">버튼</Button>
              </Specimen>
              <Specimen caption='variant="inner"'>
                <Button variant="inner">버튼</Button>
              </Specimen>
              <Specimen caption='variant="tertiary"'>
                <Button variant="tertiary">버튼</Button>
              </Specimen>
            </Row>

            <Row label="size">
              <Specimen caption='size="sm"'>
                <Button size="sm">버튼</Button>
              </Specimen>
              <Specimen caption='size="default" (h-48)'>
                <Button size="default">버튼</Button>
              </Specimen>
              <Specimen caption='size="lg"'>
                <Button size="lg">버튼</Button>
              </Specimen>
            </Row>

            <Row label="아이콘">
              <Specimen caption="아이콘 앞">
                <Button>
                  <Icon name="Search" />
                  검색
                </Button>
              </Specimen>
              <Specimen caption="아이콘 뒤">
                <Button variant="secondary">
                  다음
                  <Icon name="ArrowForward" />
                </Button>
              </Specimen>
              <Specimen caption='size="icon"'>
                <Button size="icon" aria-label="추가">
                  <Icon name="Add" />
                </Button>
              </Specimen>
            </Row>
            <Row label="state: disabled">
              <Specimen caption="primary · disabled">
                <Button disabled>버튼</Button>
              </Specimen>
              <Specimen caption="secondary · disabled">
                <Button variant="secondary" disabled>
                  버튼
                </Button>
              </Specimen>
              <Specimen caption="inner · disabled">
                <Button variant="inner" disabled>
                  버튼
                </Button>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Checkbox ───────── */}
          <Section
            id="checkbox"
            title="Checkbox"
            desc="Figma m_checkbox — variant='chip'(기본): 라벨 포함 선택 칩, 선택 시 연파랑 배경 + 보더 2px + Bold. variant='box': 24px 사각 체크박스 + 옆 일반 텍스트 라벨(약관/서약서 동의 목록용), 선택 시 파란 배경 + 흰 체크."
          >
            <Row label="chip (기본)">
              <Specimen caption="기본 (미선택)">
                <Checkbox label="선택항목" />
              </Specimen>
              <Specimen caption="defaultChecked (선택)">
                <Checkbox label="선택항목" defaultChecked />
              </Specimen>
              <Specimen caption="disabled">
                <Checkbox label="선택항목" disabled />
              </Specimen>
              <Specimen caption="disabled + checked">
                <Checkbox label="선택항목" disabled defaultChecked />
              </Specimen>
            </Row>
            <Row label="box">
              <Specimen caption="기본 (미선택)">
                <Checkbox variant="box" label="동의항목" />
              </Specimen>
              <Specimen caption="defaultChecked (선택)">
                <Checkbox variant="box" label="동의항목" defaultChecked />
              </Specimen>
              <Specimen caption="disabled">
                <Checkbox variant="box" label="동의항목" disabled />
              </Specimen>
              <Specimen caption="라벨 없음">
                <Checkbox variant="box" aria-label="선택" />
              </Specimen>
            </Row>
          </Section>

          {/* ───────── InputBox ───────── */}
          <Section
            id="inputbox"
            title="InputBox"
            desc="Figma m_text input_box — <input> 컴포지트. error prop · onClear(clearable) 지원."
          >
            <Row label="state">
              <Specimen caption="default (placeholder)">
                <div className="w-[260px]">
                  <InputBox aria-label="입력 예시 (default)" placeholder="내용을 입력하세요." />
                </div>
              </Specimen>
              <Specimen caption="error">
                <div className="w-[260px]">
                  <InputBox aria-label="입력 예시 (error)" defaultValue="내용이 표시됩니다." error />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[260px]">
                  <InputBox aria-label="입력 예시 (disabled)" defaultValue="내용입니다." disabled />
                </div>
              </Specimen>
            </Row>
            <Row label="clearable">
              <Specimen caption="onClear — focus 시 X 노출">
                <div className="w-[260px]">
                  <InputBox
                    aria-label="입력 예시 (clearable)"
                    value={clearable}
                    onChange={(e) => setClearable(e.target.value)}
                    onClear={() => setClearable('')}
                    placeholder="내용을 입력하세요."
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── TextArea ───────── */}
          <Section
            id="textarea"
            title="TextArea"
            desc="Figma m_text area_box(9052-1133) 1:1. error prop · 모든 HTML textarea 속성 지원."
          >
            <Row label="state">
              <Specimen caption="default (placeholder)">
                <div className="w-[260px]">
                  <TextArea aria-label="텍스트영역 예시 (default)" placeholder="내용을 입력하세요." />
                </div>
              </Specimen>
              <Specimen caption="error">
                <div className="w-[260px]">
                  <TextArea aria-label="텍스트영역 예시 (error)" defaultValue="내용이 표시됩니다." error />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[260px]">
                  <TextArea aria-label="텍스트영역 예시 (disabled)" defaultValue="내용이 표시됩니다." disabled />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── RadioButton ───────── */}
          <Section
            id="radiobutton"
            title="RadioButton"
            desc="Figma m_radiobutton(9052-1234) 1:1. 칩형 라디오. RadioButtonGroup 안에서 사용."
          >
            <Row label="state">
              <Specimen caption="unchecked">
                <RadioGroup value="">
                  <RadioButton value="a" label="선택항목" />
                </RadioGroup>
              </Specimen>
              <Specimen caption="checked">
                <RadioGroup value="b">
                  <RadioButton value="b" label="선택항목" />
                </RadioGroup>
              </Specimen>
              <Specimen caption="disabled">
                <RadioGroup value="">
                  <RadioButton value="c" label="선택항목" disabled />
                </RadioGroup>
              </Specimen>
              <Specimen caption="disabled + checked">
                <RadioGroup value="d">
                  <RadioButton value="d" label="선택항목" disabled />
                </RadioGroup>
              </Specimen>
            </Row>
            <Row label="showIndicator (원형 ○ 표시 유무)">
              <Specimen caption="false (기본 · pill)">
                <RadioGroup value="a">
                  <RadioButton value="a" label="선택항목" />
                </RadioGroup>
              </Specimen>
              <Specimen caption="true (원형 표시)">
                <RadioGroup value="a">
                  <RadioButton value="a" label="선택항목" showIndicator />
                </RadioGroup>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Switch ───────── */}
          <Section
            id="switch"
            title="Switch"
            desc="Figma m_toggle switch(9052-1289) 1:1. 56×28 트랙 + 20px thumb. label 옵션."
          >
            <Row label="state">
              <Specimen caption="unchecked">
                <Switch aria-label="스위치 예시 (unchecked)" />
              </Specimen>
              <Specimen caption="defaultChecked">
                <Switch aria-label="스위치 예시 (checked)" defaultChecked />
              </Specimen>
              <Specimen caption="disabled (unchecked)">
                <Switch aria-label="스위치 예시 (disabled)" disabled />
              </Specimen>
              <Specimen caption="disabled + checked">
                <Switch aria-label="스위치 예시 (disabled checked)" disabled defaultChecked />
              </Specimen>
            </Row>
            <Row label="label">
              <Specimen caption="label 텍스트">
                <Switch label="스위치" />
              </Specimen>
              <Specimen caption="label + checked">
                <Switch label="스위치" defaultChecked />
              </Specimen>
              <Specimen caption="label + disabled">
                <Switch label="스위치" disabled />
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SegmentedControl ───────── */}
          <Section
            id="segmentedcontrol"
            title="SegmentedControl"
            desc="Figma m_segmented control(9300-28006) 1:1. 트랙 + 옵션을 합친 단일 선택 컨트롤. items + value/defaultValue + onValueChange(선택 value 방출). RadioButtonGroup 과 동일한 controlled/uncontrolled 패턴. disabled 로 그룹 전체 비활성, itemClassName='flex-1' 로 균등 분할."
          >
            <Row label="기본 (uncontrolled, value 방출)">
              <Specimen caption="2-option (클릭 시 onValueChange)">
                <SegmentedControl
                  defaultValue="a"
                  onValueChange={(v) => console.log('[SegmentedControl]', v)}
                  items={[
                    { value: 'a', label: '선택항목' },
                    { value: 'b', label: '선택항목' },
                  ]}
                />
              </Specimen>
              <Specimen caption="3-option">
                <SegmentedControl
                  defaultValue="b"
                  items={[
                    { value: 'a', label: '전체' },
                    { value: 'b', label: '진행중' },
                    { value: 'c', label: '완료' },
                  ]}
                />
              </Specimen>
            </Row>
            <Row label="disabled (그룹 전체)">
              <Specimen caption="비활성 트랙">
                <SegmentedControl
                  disabled
                  defaultValue="a"
                  items={[
                    { value: 'a', label: '선택항목' },
                    { value: 'b', label: '선택항목' },
                  ]}
                />
              </Specimen>
            </Row>
            <Row label="full-width 균등 분할 (itemClassName)">
              <Specimen caption="flex-1 로 옵션 균등">
                <SegmentedControl
                  defaultValue="a"
                  className="flex w-[280px]"
                  itemClassName="flex-1"
                  items={[
                    { value: 'a', label: '국내' },
                    { value: 'b', label: '국외' },
                  ]}
                />
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Accordion ───────── */}
          <Section
            id="accordion"
            title="Accordion"
            desc="Figma m_accordian(9300-28556) 1:1. 섹션 아코디언 — raw/accordion 래핑. 타이틀바(56h · blue(bg-primary-faint)/white · 19px Bold · chevron 20px 회전) + content(white · 좌우/하단 16 · 상단 0(타이틀 바 하단 여백으로 충분) · 세로 stack gap-16). AccordionSection props: value · title · titleInfo? · variant(blue/white) · borderTop · flush · contentClassName(예: pt-2 로 상단 간격 추가)."
          >
            <Row label="기본 (multiple · blue)">
              <Specimen caption="2 섹션 · 독립 접기/펴기">
                <div className="w-[360px] border border-krds-border-divider">
                  <Accordion type="multiple" defaultValue={['a']}>
                    <AccordionSection value="a" title="아코디언 타이틀" borderTop={false}>
                      <p className="text-krds-body-md text-krds-text-ink">콘텐츠 영역 A</p>
                    </AccordionSection>
                    <AccordionSection value="b" title="아코디언 타이틀" titleInfo="총 2건">
                      <p className="text-krds-body-md text-krds-text-ink">콘텐츠 영역 B</p>
                    </AccordionSection>
                  </Accordion>
                </div>
              </Specimen>
            </Row>
            <Row label="variant=white (single · collapsible)">
              <Specimen caption="흰색 타이틀 바">
                <div className="w-[360px] border border-krds-border-divider">
                  <Accordion type="single" collapsible defaultValue="w">
                    <AccordionSection
                      value="w"
                      title="아코디언 타이틀"
                      variant="white"
                      borderTop={false}
                    >
                      <p className="text-krds-body-md text-krds-text-ink">콘텐츠 영역</p>
                    </AccordionSection>
                  </Accordion>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Spinner ───────── */}
          <Section
            id="spinner"
            title="Spinner"
            desc="Figma m_spinner(9300-28055) 1:1. 48×48 컨테이너에 8 dot 시계방향 배치 — 활성 1개만 D2B blue, 나머지 7개 border-field 회색. 부모 steps(8) 1초 회전 → 활성 dot 이 시계방향 이동. props: size(px, 기본 48) · percent(0-100 — 주어지면 아래 '%' 텍스트, progressbar role) · label(가로 정렬 텍스트) · srLabel."
          >
            <Row label="size (48 기준 scale)">
              <Specimen caption="size={24}">
                <Spinner size={24} />
              </Specimen>
              <Specimen caption="size={32}">
                <Spinner size={32} />
              </Specimen>
              <Specimen caption="size={48} (default)">
                <Spinner />
              </Specimen>
              <Specimen caption="size={72}">
                <Spinner size={72} />
              </Specimen>
            </Row>
            <Row label="percent (진행률 표시)">
              <Specimen caption="percent={70} — Figma 가이드">
                <Spinner percent={70} />
              </Specimen>
              <Specimen caption="percent={0}">
                <Spinner percent={0} />
              </Specimen>
              <Specimen caption="percent={100}">
                <Spinner percent={100} />
              </Specimen>
              <Specimen caption="percent + size 변형">
                <Spinner size={64} percent={45} />
              </Specimen>
            </Row>
            <Row label="label (시각 텍스트 — 가로 정렬)">
              <Specimen caption='label="저장 중..."'>
                <Spinner size={32} label="저장 중..." />
              </Specimen>
              <Specimen caption="label + 작은 size">
                <Spinner size={24} label="조회 중..." />
              </Specimen>
            </Row>
            <Row label="사용 예시 (스플래시/페이지 로딩)">
              <Specimen caption="중앙 정렬 (PageLoading 패턴)">
                <div className="flex h-40 w-[280px] items-center justify-center rounded-krds-8 border border-border bg-background">
                  <Spinner size={48} />
                </div>
              </Specimen>
              <Specimen caption="진행률 + 부가 텍스트 (다운로드 중)">
                <div className="flex h-40 w-[280px] flex-col items-center justify-center gap-2 rounded-krds-8 border border-border bg-background">
                  <Spinner size={48} percent={70} />
                  <span className="text-krds-body-sm text-krds-text-muted">
                    파일 다운로드 중...
                  </span>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Empty ───────── */}
          <Section
            id="empty"
            title="Empty"
            desc="Figma m_empty_data(9300-28084) 1:1. 빈 상태(no data) 콘텐츠. 카드 / div / BottomSheet 내부에 들어가는 콘텐츠이므로 너비는 부모 폭을 따른다(w-full). props: variant(info | check) · icon(IconName | ReactNode) · iconColor · iconSize(기본 36) · title(또는 children) · description · action."
          >
            <Row label="variant (Figma 1:1)">
              <Specimen caption='variant="info" (default) — 검색 결과 없음'>
                <div className="w-[328px] rounded-krds-8 border border-border bg-background p-krds-9">
                  <Empty>검색 결과가 없습니다.</Empty>
                </div>
              </Specimen>
              <Specimen caption='variant="check" — 완료 상태'>
                <div className="w-[328px] rounded-krds-8 border border-border bg-background p-krds-9">
                  <Empty variant="check">처리가 완료되었습니다.</Empty>
                </div>
              </Specimen>
            </Row>
            <Row label="description (보조 설명)">
              <Specimen caption="info + 보조 설명">
                <div className="w-[328px] rounded-krds-8 border border-border bg-background p-krds-9">
                  <Empty description="다른 조건으로 검색해보세요.">검색 결과가 없습니다.</Empty>
                </div>
              </Specimen>
            </Row>
            <Row label="action (하단 액션 영역)">
              <Specimen caption="새로고침 버튼 포함">
                <div className="w-[328px] rounded-krds-8 border border-border bg-background p-krds-9">
                  <Empty
                    description="입찰 공고 후 다시 시도해주세요."
                    action={
                      <Button variant="secondary" size="sm">
                        새로고침
                      </Button>
                    }
                  >
                    조회된 공고가 없습니다.
                  </Empty>
                </div>
              </Specimen>
            </Row>
            <Row label="컨테이너 폭 적응 (w-full)">
              <Specimen caption="좁은 카드">
                <div className="w-[200px] rounded-krds-8 border border-border bg-background p-krds-7">
                  <Empty>데이터 없음</Empty>
                </div>
              </Specimen>
              <Specimen caption="넓은 div">
                <div className="w-[480px] rounded-krds-8 border border-border bg-muted p-krds-9">
                  <Empty description="확장된 컨테이너에서도 중앙 정렬 유지">
                    표시할 항목이 없습니다.
                  </Empty>
                </div>
              </Specimen>
            </Row>
            <Row label="iconSize 조절">
              <Specimen caption="iconSize={28} 컴팩트">
                <div className="w-[260px] rounded-krds-8 border border-border bg-background p-krds-7">
                  <Empty iconSize={28}>데이터 없음</Empty>
                </div>
              </Specimen>
              <Specimen caption="iconSize={48} 강조">
                <div className="w-[328px] rounded-krds-8 border border-border bg-background p-krds-9">
                  <Empty iconSize={48} description="새 알림이 도착하면 여기에 표시됩니다.">
                    알림이 없습니다.
                  </Empty>
                </div>
              </Specimen>
            </Row>
            <Row label="커스텀 아이콘 (icon prop)">
              <Specimen caption='icon="Notifications"'>
                <div className="w-[328px] rounded-krds-8 border border-border bg-background p-krds-9">
                  <Empty icon="Notifications" description="새 알림이 없습니다.">
                    알림함이 비어있습니다.
                  </Empty>
                </div>
              </Specimen>
              <Specimen caption='icon="Description" (문서)'>
                <div className="w-[328px] rounded-krds-8 border border-border bg-background p-krds-9">
                  <Empty icon="Description">등록된 문서가 없습니다.</Empty>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Skeleton ───────── */}
          <Section
            id="skeleton"
            title="Skeleton"
            desc="범용 로딩 스켈레톤(shimmer). variant: rect(기본·사각 블록) / text(count 줄, 마지막 줄 60%) / circle(원형 아바타). width·height·count props. animate-pulse + bg-muted. 데이터 로딩 중 자리표시 — 성공 시 실제 콘텐츠로 교체."
          >
            <Row label="variant">
              <Specimen caption='variant="text" count={3}'>
                <div className="w-[260px]">
                  <Skeleton variant="text" count={3} />
                </div>
              </Specimen>
              <Specimen caption='variant="circle" width={48}'>
                <Skeleton variant="circle" width={48} />
              </Specimen>
              <Specimen caption='variant="rect" 120×80'>
                <Skeleton variant="rect" width={120} height={80} className="rounded-krds-8" />
              </Specimen>
            </Row>
            <Row label="조합 예시 (리스트 카드 placeholder)">
              <Specimen caption="아바타 + 2줄 텍스트">
                <div className="flex w-[280px] items-center gap-3 rounded-krds-8 border border-border p-4">
                  <Skeleton variant="circle" width={40} />
                  <div className="flex-1">
                    <Skeleton variant="text" count={2} />
                  </div>
                </div>
              </Specimen>
              <Specimen caption="썸네일 + 제목">
                <div className="w-[160px]">
                  <Skeleton variant="rect" height={100} className="w-full rounded-krds-8" />
                  <div className="mt-3">
                    <Skeleton variant="text" count={2} />
                  </div>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── DateInputBox ───────── */}
          <Section
            id="dateinputbox"
            title="DateInputBox"
            desc="Figma m_date_input_box(9052-1579) 1:1. 단일 날짜 입력 박스(아톰). 5 state(default/filled/focus/error/error_focus). 텍스트 가운데 정렬, 모바일 숫자 키패드(inputMode=numeric)."
          >
            <Row label="state">
              <Specimen caption="default (placeholder)">
                <div className="w-[260px]">
                  <DateInputBox placeholder="일자를 선택해주세요." />
                </div>
              </Specimen>
              <Specimen caption="filled (value)">
                <div className="w-[260px]">
                  <DateInputBox
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    onClear={() => setDateValue('')}
                  />
                </div>
              </Specimen>
              <Specimen caption="error">
                <div className="w-[260px]">
                  <DateInputBox defaultValue="2026-05-01" error />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[260px]">
                  <DateInputBox defaultValue="2026-05-01" disabled />
                </div>
              </Specimen>
            </Row>
            <Row label="withCalendar (클릭 시 달력)">
              <Specimen caption="single 모드 — input 클릭 시 바로 아래 달력">
                <div className="w-[260px]">
                  <DateInputBox
                    withCalendar
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    onClear={() => setDateValue('')}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── DateRangeInputBox ───────── */}
          <Section
            id="daterangeinputbox"
            title="DateRangeInputBox"
            desc="Figma m_date_range_input_box(9052-1558) 1:1. 시작/종료 두 input + ~ 구분자. 한 박스 안에서 양쪽 어느 한 쪽 focus 시 박스 focus 스타일."
          >
            <Row label="state">
              <Specimen caption="default (둘 다 빈 값)">
                <div className="w-[280px]">
                  <DateRangeInputBox />
                </div>
              </Specimen>
              <Specimen caption="filled (양쪽 값)">
                <div className="w-[280px]">
                  <DateRangeInputBox
                    value={rangeValue}
                    onChange={setRangeValue}
                    onClear={(side) => setRangeValue((v) => ({ ...v, [side]: '' }))}
                  />
                </div>
              </Specimen>
              <Specimen caption="error">
                <div className="w-[280px]">
                  <DateRangeInputBox value={{ start: '2026-05-30', end: '2026-05-01' }} error />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[280px]">
                  <DateRangeInputBox value={{ start: '2026-05-01', end: '2026-05-30' }} disabled />
                </div>
              </Specimen>
            </Row>
            <Row label="withCalendar (클릭 시 달력)">
              <Specimen caption="range 모드 — input 클릭 시 바로 아래 달력(start~end)">
                <div className="w-[280px]">
                  <DateRangeInputBox
                    withCalendar
                    value={rangeValue}
                    onChange={setRangeValue}
                    onClear={(side) => setRangeValue((v) => ({ ...v, [side]: '' }))}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Calendar ───────── */}
          <Section
            id="calendar"
            title="Calendar"
            desc="Figma m_date_range_picker_calendar(9052-1421) + m_date_picker_date_select_button(11 state) 1:1. 단일/범위 모드. 공휴일은 fetchHolidays prop 으로 외부 주입 + React Query 가 월별 자동 fetch/refetch. 상단 년/월 UI 는 yearMonthMode='wheel'(기본, 토글→휠) | 'select'(SelectBox) 선택."
          >
            <Row label="mode: single">
              <Specimen caption="단일 날짜 선택">
                <div className="w-[328px] rounded-krds-lg border border-border bg-background p-3">
                  <Calendar
                    mode="single"
                    value={calSingle}
                    onChange={(v) => setCalSingle(v as string)}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="mode: range">
              <Specimen caption="기간 선택 (start~end 셀 클릭)">
                <div className="w-[328px] rounded-krds-lg border border-border bg-background p-3">
                  <Calendar
                    mode="range"
                    value={calRange}
                    onChange={(v) => setCalRange(v as { start: string | null; end: string | null })}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="yearMonthMode: select (base SelectBox)">
              <Specimen caption="상단 년/월을 휠 대신 SelectBox 로">
                <div className="w-[328px] rounded-krds-lg border border-border bg-background p-3">
                  <Calendar
                    mode="single"
                    yearMonthMode="select"
                    value={calSingle}
                    onChange={(v) => setCalSingle(v as string)}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="fetchHolidays (mock)">
              <Specimen caption="공휴일 mock — 5/5, 5/25 빨강 표시">
                <div className="w-[328px] rounded-krds-lg border border-border bg-background p-3">
                  <Calendar
                    mode="single"
                    value={calSingle}
                    onChange={(v) => setCalSingle(v as string)}
                    fetchHolidays={async (y, m) =>
                      y === 2026 && m === 5 ? ['2026-05-05', '2026-05-25'] : []
                    }
                    scheduledDates={['2026-05-10', '2026-05-20']}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── WheelPicker ───────── */}
          <Section
            id="wheelpicker"
            title="WheelPicker"
            desc="Figma m_date_wheel picker(9300-29375) 1:1. iOS 스타일 휠 — 컬럼별 세로 스크롤(scroll-snap), 중앙 밴드(bg-primary-faint)에 오는 값이 선택(navy)·나머지는 회색. columns + value + onChange(컬럼키, 값). Calendar 의 상단 년/월 토글이 이 휠을 펼친다."
          >
            <Row label="년/월/일 (date)">
              <Specimen caption="스크롤하면 중앙값이 선택됨">
                <div className="rounded-krds-lg border border-border bg-background px-4 py-2">
                  <WheelPickerDemo mode="date" />
                </div>
              </Specimen>
            </Row>
            <Row label="년/월 (month)">
              <Specimen caption="2-column">
                <div className="rounded-krds-lg border border-border bg-background px-4 py-2">
                  <WheelPickerDemo mode="month" />
                </div>
              </Specimen>
            </Row>
            <Row label="년 (year)">
              <Specimen caption="1-column">
                <div className="rounded-krds-lg border border-border bg-background px-4 py-2">
                  <WheelPickerDemo mode="year" />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Icon ───────── */}
          <Section
            id="icon"
            title="Icon"
            desc="Material Symbols Outlined 아이콘 폰트(self-host, 폐쇄망 대응) registry + 커스텀 children fallback. <Icon name='Search' /> 또는 <Icon><CustomSvg /></Icon>. 가변 축 fill(0/1)·weight(100~700) 제어. REGISTRY 에 없는 아이콘은 children 으로 직접 전달 가능."
          >
            <Row label="name (Material)">
              <Specimen caption='name="Search"'>
                <Icon name="Search" />
              </Specimen>
              <Specimen caption='name="Home"'>
                <Icon name="Home" />
              </Specimen>
              <Specimen caption='name="Settings"'>
                <Icon name="Settings" />
              </Specimen>
              <Specimen caption='name="Favorite"'>
                <Icon name="Favorite" color="var(--krds-feedback-danger)" />
              </Specimen>
            </Row>
            <Row label="size">
              <Specimen caption="size={16}">
                <Icon name="KidStar" size={16} />
              </Specimen>
              <Specimen caption="size={24} (default)">
                <Icon name="KidStar" size={24} />
              </Specimen>
              <Specimen caption="size={32}">
                <Icon name="KidStar" size={32} />
              </Specimen>
              <Specimen caption="size={48}">
                <Icon name="KidStar" size={48} />
              </Specimen>
            </Row>
            <Row label="color">
              <Specimen caption="primary">
                <Icon name="CheckCircle" color="var(--krds-d2b-blue-check)" />
              </Specimen>
              <Specimen caption="danger">
                <Icon name="Warning" color="var(--krds-d2b-pink)" />
              </Specimen>
              <Specimen caption="disabled">
                <Icon name="Error" color="var(--krds-d2b-blue-border)" />
              </Specimen>
              <Specimen caption='name="SoundDetection"'>
                <Icon name="SoundDetection" color="#0054E9" fill={1} />
              </Specimen>
            </Row>
            <Row label="children (커스텀)">
              <Specimen caption="REGISTRY 미등록 — children 사용">
                <Icon size={24}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </Icon>
              </Specimen>
              <Specimen caption="이모지도 OK">
                <Icon size={24}>🎉</Icon>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Image ───────── */}
          <Section
            id="image"
            title="Image"
            desc="native <img> 래퍼. loading='lazy' 기본 · alt 필수(접근성) · fallback src(load 실패 시 자동 교체) · objectFit prop(cover/contain/fill/none/scale-down)."
          >
            <Row label="기본 (objectFit cover)">
              <Specimen caption="cover">
                <div className="size-32 overflow-hidden rounded-krds-8 border border-border">
                  <Image
                    src="https://picsum.photos/seed/d2b1/200/200"
                    alt="샘플 이미지 1"
                    className="size-full"
                  />
                </div>
              </Specimen>
              <Specimen caption="contain">
                <div className="size-32 overflow-hidden rounded-krds-8 border border-border bg-muted">
                  <Image
                    src="https://picsum.photos/seed/d2b2/400/200"
                    alt="샘플 이미지 2"
                    objectFit="contain"
                    className="size-full"
                  />
                </div>
              </Specimen>
              <Specimen caption="fill">
                <div className="size-32 overflow-hidden rounded-krds-8 border border-border">
                  <Image
                    src="https://picsum.photos/seed/d2b3/200/200"
                    alt="샘플 이미지 3"
                    objectFit="fill"
                    className="size-full"
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="fallback (로드 실패 시)">
              <Specimen caption="잘못된 src → fallback 대체">
                <div className="size-32 overflow-hidden rounded-krds-8 border border-border">
                  <Image
                    src="https://invalid.example.com/missing.jpg"
                    fallback="https://picsum.photos/seed/d2b-fb/200/200"
                    alt="실패 시 대체 이미지"
                    className="size-full"
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="loading">
              <Specimen caption='loading="lazy" (default)'>
                <div className="size-32 overflow-hidden rounded-krds-8 border border-border">
                  <Image
                    src="https://picsum.photos/seed/d2b4/200/200"
                    alt="lazy load"
                    className="size-full"
                  />
                </div>
              </Specimen>
              <Specimen caption='loading="eager"'>
                <div className="size-32 overflow-hidden rounded-krds-8 border border-border">
                  <Image
                    src="https://picsum.photos/seed/d2b5/200/200"
                    alt="eager load"
                    loading="eager"
                    className="size-full"
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Badge ───────── */}
          <Section
            id="badge"
            title="Badge"
            desc="Figma m_label_badge(9300-27132) 1:1. props: type(pastel | solid) × color(blue | red | yellow | green). pastel = 옅은 배경 + 보더 + 진한 텍스트. solid = 진한 배경 + 흰 텍스트."
          >
            <Row label='type="pastel"'>
              <Specimen caption='color="blue"'>
                <Badge type="pastel" color="blue">
                  구분명
                </Badge>
              </Specimen>
              <Specimen caption='color="red"'>
                <Badge type="pastel" color="red">
                  구분명
                </Badge>
              </Specimen>
              <Specimen caption='color="yellow"'>
                <Badge type="pastel" color="yellow">
                  구분명
                </Badge>
              </Specimen>
              <Specimen caption='color="green"'>
                <Badge type="pastel" color="green">
                  구분명
                </Badge>
              </Specimen>
            </Row>
            <Row label='type="solid"'>
              <Specimen caption='color="blue"'>
                <Badge type="solid" color="blue">
                  구분명
                </Badge>
              </Specimen>
              <Specimen caption='color="red"'>
                <Badge type="solid" color="red">
                  구분명
                </Badge>
              </Specimen>
              <Specimen caption='color="yellow" (Figma 미정의 — fallback)'>
                <Badge type="solid" color="yellow">
                  구분명
                </Badge>
              </Specimen>
              <Specimen caption='color="green" (Figma 미정의 — fallback)'>
                <Badge type="solid" color="green">
                  구분명
                </Badge>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Label ───────── */}
          <Section
            id="label"
            title="Label"
            desc="폼 라벨. required 시 필수 표시(*). htmlFor 로 컨트롤과 연결."
          >
            <Row label="기본 / 필수">
              <Specimen caption="기본">
                <Label>이름</Label>
              </Specimen>
              <Specimen caption="required">
                <Label required>이름</Label>
              </Specimen>
            </Row>
            <Row label="InputBox 결합">
              <Specimen caption="htmlFor 연결">
                <div className="flex w-[260px] flex-col gap-1.5">
                  <Label htmlFor="guide-name" required>
                    이름
                  </Label>
                  <InputBox id="guide-name" placeholder="이름을 입력하세요." />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── InputLabel ───────── */}
          <Section
            id="inputlabel"
            title="InputLabel"
            desc="Figma m_input_label(9300-27867) 1:1. Input 위에 붙는 17px Bold 라벨. required 디폴트 false — 필수 필드에만 required 로 좌측 빨강 * 를 켠다. Label(15px Medium)은 라디오/체크박스 옆 짧은 칩 라벨용으로 분리."
          >
            <Row label="기본 / 필수">
              <Specimen caption="기본 (default, 별표 없음)">
                <InputLabel>레이블</InputLabel>
              </Specimen>
              <Specimen caption="required (필수, 빨강 *)">
                <InputLabel required>레이블</InputLabel>
              </Specimen>
            </Row>
            <Row label="InputBox 결합">
              <Specimen caption="htmlFor 연결">
                <div className="flex w-[260px] flex-col gap-1.5">
                  <InputLabel htmlFor="guide-inputlabel-email">이메일</InputLabel>
                  <InputBox id="guide-inputlabel-email" placeholder="이메일을 입력하세요." />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── InputMessage ───────── */}
          <Section
            id="inputmessage"
            title="InputMessage"
            desc="Figma m_input_message(9300-27870) 1:1. 폼 필드 아래 한 줄 메시지. type=info(파랑 텍스트 + SoundDetection 아이콘) | error(ink 텍스트 + error.svg 분홍원·흰X 아이콘). 20px 아이콘 + 15px Medium 텍스트. error 는 role=alert."
          >
            <Row label="type">
              <Specimen caption='type="info" (default)'>
                <div className="w-[280px]">
                  <InputMessage>안내 메시지를 표시합니다.</InputMessage>
                </div>
              </Specimen>
              <Specimen caption='type="error"'>
                <div className="w-[280px]">
                  <InputMessage type="error">에러 메시지를 표시합니다.</InputMessage>
                </div>
              </Specimen>
            </Row>
            <Row label="InputBox 결합 (Label + Input + Message)">
              <Specimen caption="error 상태 폼 필드">
                <div className="flex w-[280px] flex-col gap-1.5">
                  <InputLabel htmlFor="guide-msg-email">이메일</InputLabel>
                  <InputBox id="guide-msg-email" defaultValue="hello" error />
                  <InputMessage type="error">올바른 이메일 형식이 아닙니다.</InputMessage>
                </div>
              </Specimen>
              <Specimen caption="info 상태 (가이드 텍스트)">
                <div className="flex w-[280px] flex-col gap-1.5">
                  <InputLabel htmlFor="guide-msg-pw" required={false}>
                    비밀번호
                  </InputLabel>
                  <InputBox id="guide-msg-pw" type="password" />
                  <InputMessage>영문/숫자 8자 이상.</InputMessage>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SelectBox ───────── */}
          <Section
            id="selectbox"
            title="SelectBox"
            desc="Figma m_select_box(9052-45) 1:1. items 배열로 옵션 구성. error · disabled 지원."
          >
            <Row label="state">
              <Specimen caption="default (placeholder)">
                <div className="w-[260px]">
                  <SelectBox
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                      { value: 'c', label: '항목 3' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="error">
                <div className="w-[260px]">
                  <SelectBox
                    error
                    defaultValue="a"
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[260px]">
                  <SelectBox
                    disabled
                    defaultValue="a"
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="항목 비활성">
              <Specimen caption="개별 disabled">
                <div className="w-[260px]">
                  <SelectBox
                    defaultValue="a"
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2 (비활성)', disabled: true },
                      { value: 'c', label: '항목 3' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Slider ───────── */}
          <Section
            id="slider"
            title="Slider"
            desc="Figma m_range slider(9300-28028) 1:1. value 배열 길이만큼 핸들 렌더 → 단일/듀얼(범위) 모두 지원. track bg-primary-subtle · active bg-primary-strong · 30px 흰 thumb. 추정가격(검색필터) 등 범위 입력에 사용."
          >
            <Row label="range (듀얼 핸들)">
              <Specimen caption="defaultValue={[20, 60]} · step 5">
                <div className="w-[300px]">
                  <Slider
                    defaultValue={[20, 60]}
                    min={0}
                    max={100}
                    step={5}
                    minStepsBetweenThumbs={1}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="single (단일 핸들)">
              <Specimen caption="defaultValue={[50]}">
                <div className="w-[300px]">
                  <Slider defaultValue={[50]} min={0} max={100} />
                </div>
              </Specimen>
            </Row>
            <Row label="disabled">
              <Specimen caption="disabled">
                <div className="w-[300px]">
                  <Slider defaultValue={[30, 70]} min={0} max={100} disabled />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Tag ───────── */}
          <Section
            id="tag"
            title="Tag"
            desc="Figma m_tag(9300-27119) 1:1. 칩형 태그 — bg-white + 1px field 보더 + rounded-full · 15px Regular ink. closable prop 또는 onClose 핸들러 제공 시 우측 X 노출. onClose 없이 closable 만 true 면 X 표시되나 클릭 비활성(읽기 전용 표시)."
          >
            <Row label="closable">
              <Specimen caption="기본 (X 없음)">
                <Tag>태그</Tag>
              </Specimen>
              <Specimen caption="closable + onClose (활성)">
                <Tag closable onClose={() => alert('close')}>
                  태그
                </Tag>
              </Specimen>
              <Specimen caption="closable only (읽기 전용 X)">
                <Tag closable>태그</Tag>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Tab ───────── */}
          <Section
            id="tab"
            title="Tab"
            desc="Figma tab_atomic(9300-28533/28537) 1:1. 단일 탭 atom — h-48 · 19px Bold + 3px 하단 border. selected=false 면 border-field 회색, selected=true 면 D2B blue. 보통은 직접 쓰지 않고 TabList 가 매핑."
          >
            <Row label="selected">
              {/* Tab(role=tab)은 tablist 부모가 필요(axe aria-required-parent) — 데모용 래퍼. */}
              <Specimen caption="selected=false (default)">
                <div role="tablist" aria-label="탭 예시">
                  <Tab>탭제목</Tab>
                </div>
              </Specimen>
              <Specimen caption="selected=true (활성)">
                <div role="tablist" aria-label="탭 예시">
                  <Tab selected>탭제목</Tab>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── NavigationItem ───────── */}
          <Section
            id="navigationitem"
            title="NavigationItem"
            desc="Figma m_navigation item(9300-28612) 1:1. 리스트 행 — 좌측 19px Medium 텍스트 + 우측 > 화살표. min-h 56 · py 10 · :active 시 bg-primary-faint (pressed state). borderTop/borderBottom 옵션(1px divider)."
          >
            <Row label="기본">
              <Specimen caption="단독 (border 위/아래)">
                <div className="w-[328px]">
                  <NavigationItem borderTop onClick={() => setNavClicked('단독')}>
                    바로가기 이름
                  </NavigationItem>
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[328px]">
                  <NavigationItem borderTop disabled>
                    바로가기 이름
                  </NavigationItem>
                </div>
              </Specimen>
              <Specimen caption="마지막 클릭">
                <code className="text-krds-body-md font-bold text-krds-text-primary">
                  {navClicked ?? '(아직 없음)'}
                </code>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SelectionFieldBox ───────── */}
          <Section
            id="selectionfieldbox"
            title="SelectionFieldBox"
            desc="Figma m_selection field_box(9300-29018) 1:1. 클릭 시 외부에서 시트/모달이 열려 값을 받는 트리거 박스(아톰). 우측 항상 > 화살표. 7 state(default/focus/filled/error/error_focus/read-only/disabled)는 value/error/readOnly/disabled prop 조합 + 사용자 focus 로 자동 도출. onClear 제공 시 value 있고 활성 상태에서만 X 노출."
          >
            <Row label="state (props 조합)">
              <Specimen caption="default (placeholder)">
                <div className="w-[260px]">
                  <SelectionFieldBox placeholder="내용을 입력하세요." />
                </div>
              </Specimen>
              <Specimen caption="filled (value)">
                <div className="w-[260px]">
                  <SelectionFieldBox value={sfFilled} onClear={() => setSfFilled('')} />
                </div>
              </Specimen>
              <Specimen caption="error (no value)">
                <div className="w-[260px]">
                  <SelectionFieldBox placeholder="내용을 입력하세요." error />
                </div>
              </Specimen>
              <Specimen caption="error + value">
                <div className="w-[260px]">
                  <SelectionFieldBox value={sfError} onClear={() => setSfError('')} error />
                </div>
              </Specimen>
              <Specimen caption="read-only">
                <div className="w-[260px]">
                  <SelectionFieldBox value="공개 [#사전규격번호]" readOnly />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[260px]">
                  <SelectionFieldBox value="입력한 내용입니다." disabled />
                </div>
              </Specimen>
            </Row>
            <Row label="focus (브라우저에서 Tab 또는 클릭 시 2px 보더)">
              <Specimen caption="focus 시 보더 강조 — Tab 으로 이동해보세요">
                <div className="w-[260px]">
                  <SelectionFieldBox placeholder="발주기관을 입력하세요." />
                </div>
              </Specimen>
            </Row>
            <Row label="적용예시 (Label + Box + Message)">
              <Specimen caption="기본 (required + placeholder)">
                <div className="flex w-[260px] flex-col gap-1.5">
                  <InputLabel htmlFor="guide-sf-org">발주기관</InputLabel>
                  <SelectionFieldBox id="guide-sf-org" placeholder="발주기관을 입력하세요." />
                </div>
              </Specimen>
              <Specimen caption="에러 + 메시지">
                <div className="flex w-[260px] flex-col gap-1.5">
                  <InputLabel htmlFor="guide-sf-org-err">발주기관</InputLabel>
                  <SelectionFieldBox id="guide-sf-org-err" value="발주기관명" error />
                  <InputMessage type="error">발주기관을 다시 확인하세요.</InputMessage>
                </div>
              </Specimen>
              <Specimen caption="read-only + 라벨">
                <div className="flex w-[260px] flex-col gap-1.5">
                  <InputLabel htmlFor="guide-sf-ro" required={false}>
                    사전규격 (read-only)
                  </InputLabel>
                  <SelectionFieldBox id="guide-sf-ro" value="공개 [#사전규격번호]" readOnly />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── PageTitle ───────── */}
          <Section
            id="pagetitle"
            title="PageTitle"
            desc="Figma m_page title_24(9300-27179) 1:1. 페이지/최상위 영역 타이틀. 24px Bold · padding 20px 16px. 기본 태그 h1, as 로 변경 가능."
          >
            <Row label="기본">
              <Specimen caption="페이지 제목">
                <div className="w-[360px] border-y border-border bg-background">
                  <PageTitle>페이지 제목</PageTitle>
                </div>
              </Specimen>
              <Specimen caption='as="h2" (의미적 레벨 변경)'>
                <div className="w-[360px] border-y border-border bg-background">
                  <PageTitle as="h2">조달업무</PageTitle>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SectionTitle ───────── */}
          <Section
            id="sectiontitle"
            title="SectionTitle"
            desc="Figma m_section title_19(9300-27190) 1:1. 하위 영역/아코디언/테이블 타이틀. 19px Bold · min-h 56 · padding 10px 16px. bgColor white|blue · topDivider · info(우측 슬롯, 17px primary-active)."
          >
            <Row label="bgColor">
              <Specimen caption='bgColor="white" (default)'>
                <div className="w-[328px] border-y border-border bg-background">
                  <SectionTitle>하위 영역 제목</SectionTitle>
                </div>
              </Specimen>
              <Specimen caption='bgColor="blue"'>
                <div className="w-[328px] border-y border-border bg-background overflow-hidden">
                  <SectionTitle bgColor="blue">하위 영역 제목</SectionTitle>
                </div>
              </Specimen>
            </Row>
            <Row label="topDivider">
              <Specimen caption="topDivider 상단 1px">
                <div className="w-[328px] border-b border-border bg-background pt-6">
                  <SectionTitle topDivider>하위 영역 제목</SectionTitle>
                </div>
              </Specimen>
            </Row>
            <Row label="info slot (우측 보조)">
              <Specimen caption="건수 표시">
                <div className="w-[328px] border-y border-border bg-background">
                  <SectionTitle info="총 2건">입찰 공고</SectionTitle>
                </div>
              </Specimen>
              <Specimen caption="아코디언 아이콘">
                <div className="w-[328px] border-y border-border bg-background">
                  <SectionTitle
                    info={<Icon name="ArrowForwardIos" size={20} className="rotate-90" />}
                  >
                    상세 정보
                  </SectionTitle>
                </div>
              </Specimen>
              <Specimen caption="복합 (텍스트 + 아이콘)">
                <div className="w-[328px] border-y border-border bg-background">
                  <SectionTitle
                    info={
                      <>
                        <span>총 2건</span>
                        <Icon name="ChevronRight" size={20} />
                      </>
                    }
                  >
                    공지사항
                  </SectionTitle>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SectionDivider ───────── */}
          <Section
            id="sectiondivider"
            title="SectionDivider"
            desc="Figma m_section divider(9300-27188) 1:1. 영역 구분선 — 1px 가로 라인, color = krds-border-divider(#d1d7e0). SectionTitle topDivider 옵션도 내부적으로 이걸 사용."
          >
            <Row label="기본">
              <Specimen caption="단독 사용">
                <div className="w-[328px]">
                  <SectionDivider />
                </div>
              </Specimen>
              <Specimen caption="콘텐츠 사이">
                <div className="flex w-[328px] flex-col gap-3">
                  <p className="text-krds-body-md text-krds-text-ink">위 영역</p>
                  <SectionDivider />
                  <p className="text-krds-body-md text-krds-text-ink">아래 영역</p>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ═══════════ composites ═══════════ */}
          <GroupHeading>composites</GroupHeading>

          {/* ───────── RadioButtonGroup ───────── */}
          <Section
            id="radiobuttongroup"
            title="RadioButtonGroup"
            desc="RadioButton을 items 배열로 구성. direction: horizontal(기본) | vertical. showIndicator(기본 false)로 좌측 원형(○) 표시 여부 제어."
          >
            <Row label="showIndicator (원형 표시)">
              <Specimen caption="true (원형 ○)">
                <div className="w-[260px]">
                  <RadioButtonGroup
                    defaultValue="a"
                    showIndicator
                    items={[
                      { value: 'a', label: '항목' },
                      { value: 'b', label: '항목' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="horizontal">
              <Specimen caption="2항목">
                <div className="w-[260px]">
                  <RadioButtonGroup
                    defaultValue="a"
                    showIndicator
                    items={[
                      { value: 'a', label: '항목' },
                      { value: 'b', label: '항목' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="4항목 한 줄">
                <div className="w-[360px]">
                  <RadioButtonGroup
                    defaultValue="a"
                    showIndicator
                    items={[
                      { value: 'a', label: '항목' },
                      { value: 'b', label: '항목' },
                      { value: 'c', label: '항목' },
                      { value: 'd', label: '항목' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="vertical">
              <Specimen caption="3항목">
                <div className="w-[260px]">
                  <RadioButtonGroup
                    defaultValue="b"
                    direction="vertical"
                    showIndicator
                    items={[
                      { value: 'a', label: '항목' },
                      { value: 'b', label: '항목' },
                      { value: 'c', label: '항목' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="disabled">
              <Specimen caption="개별 항목 비활성">
                <div className="flex w-[300px] items-start gap-2">
                  <RadioButtonGroup
                    className="flex-[2]"
                    defaultValue="a"
                    showIndicator
                    items={[
                      { value: 'a', label: '항목' },
                      { value: 'b', label: '항목', disabled: true },
                    ]}
                  />
                  {/* 선택(checked)된 채로 disabled — 단일선택 제약상 별도 그룹으로 표현.
                      회색 비활성 톤은 RadioButton 컴포넌트가 처리(disabled 가 checked 강조를 덮음).
                      flex-1 : 옆 그룹(flex-[2], 2칩)과 비율 맞춰 칩 너비 동일. */}
                  <RadioButtonGroup
                    className="flex-1"
                    defaultValue="c"
                    showIndicator
                    items={[{ value: 'c', label: '항목', disabled: true }]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── CheckboxGroup ───────── */}
          <Section
            id="checkboxgroup"
            title="CheckboxGroup"
            desc="Figma checkbox group container(9300-27895) 1:1. base Checkbox 칩을 items 배열로 구성한 다중 선택 그룹. direction: horizontal(기본) | vertical. swipeable(기본 false)로 가로 스크롤 + 좌우 스와이프 화살표 on/off. selectAll 로 상단 '전체' 칩 노출 — 전체↔개별 자동 동기화. single 로 라디오처럼 1개만 선택(selectAll 무시)."
          >
            <Row label="horizontal (기본 wrap)">
              <Specimen caption="2항목">
                <div className="w-[260px]">
                  <CheckboxGroup
                    defaultValue={['a']}
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="3항목 wrap">
                <div className="w-[328px]">
                  <CheckboxGroup
                    defaultValue={['a', 'c']}
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                      { value: 'c', label: '항목 3' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="swipeable (가로 스크롤 + 좌우 화살표)">
              <Specimen caption="오버플로우 시 화살표 자동 노출">
                <div className="w-[260px]">
                  <CheckboxGroup
                    swipeable
                    defaultValue={['b']}
                    items={[
                      { value: 'a', label: '선택항목 1' },
                      { value: 'b', label: '선택항목 2' },
                      { value: 'c', label: '선택항목 3' },
                      { value: 'd', label: '선택항목 4' },
                      { value: 'e', label: '선택항목 5' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="vertical">
              <Specimen caption="3항목">
                <div className="w-[260px]">
                  <CheckboxGroup
                    defaultValue={['b']}
                    direction="vertical"
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                      { value: 'c', label: '항목 3' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="disabled">
              <Specimen caption="개별 항목 비활성 (비활성 / 비활성+선택)">
                <div className="w-[328px]">
                  <CheckboxGroup
                    defaultValue={['a', 'c']}
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2', disabled: true },
                      { value: 'c', label: '항목 3', disabled: true },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="selectAll (상단 '전체' 칩 — 전체↔개별 자동 동기화)">
              <Specimen caption="‘전체’ 체크/해제 → 모두 / 개별 모두 체크 시 ‘전체’ 자동 체크">
                <div className="w-[328px]">
                  <CheckboxGroup
                    selectAll
                    defaultValue={['a']}
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                      { value: 'c', label: '항목 3' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="vertical + selectAll">
                <div className="w-[260px]">
                  <CheckboxGroup
                    selectAll
                    direction="vertical"
                    items={[
                      { value: 'a', label: '항목 1' },
                      { value: 'b', label: '항목 2' },
                      { value: 'c', label: '항목 3' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="single (라디오처럼 1개만 선택 — 모양은 체크박스)">
              <Specimen caption="다른 항목 체크 시 기존 선택 자동 해제 (재클릭 시 해제 가능)">
                <div className="w-[328px]">
                  <CheckboxGroup
                    single
                    defaultValue={['a']}
                    items={[
                      { value: 'a', label: '조달명' },
                      { value: 'b', label: '판단번호' },
                      { value: 'c', label: '담당자' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── AgreementList ───────── */}
          <Section
            id="agreementlist"
            title="AgreementList"
            desc="Figma m_agreemen(9300-40702) 1:1. 테두리 카드(radius 12·padding 16·gap 16) 안에 '전체 동의' → 구분선 → 항목 리스트. 각 행: 사각 체크박스(box) + [필수](빨강)/[선택](네이비) 색상 텍스트 + 제목 + ArrowForwardIos(행 클릭=상세 열기). 서약서 동의·약관 동의 등 동의 체크리스트 공용. requirement 생략 시 태그 없음, checkAll=false 로 '전체 동의' 숨김."
          >
            <Row label="전체 동의 + [필수]/[선택]">
              <Specimen caption="행 클릭=상세 / 체크박스=동의 토글 / 전체동의 indeterminate">
                <div className="w-[328px]">
                  <AgreementListDemo />
                </div>
              </Specimen>
            </Row>
            <Row label="checkAll=false (태그 없음)">
              <Specimen caption="전체 동의 행 숨김 + 태그 없는 단순 목록">
                <div className="w-[328px]">
                  <AgreementListDemo checkAll={false} plain />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Infobox ───────── */}
          <Section
            id="infobox"
            title="Infobox"
            desc="Figma m_Infobox(9300-29649) 1:1. ⓘ+타이틀+불릿 본문. collapsible(기본, opened/closed) / static(항상 펼침). 업무도움·안내사항 등 재사용."
          >
            <Row label="collapsible (기본 closed)">
              <Specimen caption="헤더 클릭 토글">
                <div className="w-[328px]">
                  <Infobox
                    title="업무도움"
                    items={[
                      '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
                      '1577-1118 대표전화로 전화주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.',
                      '내용입니다.',
                      <>
                        내용입니다.{' '}
                        <a href="#" className="text-primary underline">
                          링크버튼
                        </a>{' '}
                        들어가는 경우
                      </>,
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="defaultOpen / static">
              <Specimen caption="defaultOpen">
                <div className="w-[328px]">
                  <Infobox title="업무도움" defaultOpen items={['내용입니다.', '내용입니다.']} />
                </div>
              </Specimen>
              <Specimen caption="static (chevron 없음, 항상 펼침)">
                <div className="w-[328px]">
                  <Infobox
                    title="안내사항"
                    collapsible={false}
                    items={['내용입니다.', '내용입니다.']}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SearchCondition ───────── */}
          <Section
            id="searchcondition"
            title="SearchCondition"
            desc="Figma 검색조건(9300-36826) 1:1. 검색대상 칩(CheckboxGroup) + 필터 아이콘 버튼(→풀팝업) + 검색어 InputBox + 검색 버튼. 도메인 무관 props/콜백."
          >
            <Row label="기본">
              <Specimen caption="대상 다중선택 + 검색/필터 콜백(console)">
                <div className="w-[328px]">
                  <SearchCondition
                    targets={[
                      { value: 'name', label: '조달명' },
                      { value: 'no', label: '판단번호' },
                    ]}
                    selectedTargets={opTargets}
                    onTargetsChange={setOpTargets}
                    keyword={opKeyword}
                    onKeywordChange={setOpKeyword}
                    onFilterClick={() => console.log('[guide] filter open')}
                    onSearch={() => console.log('[guide] search', { opKeyword, opTargets })}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── ListSectionHeader ───────── */}
          <Section
            id="listsectionheader"
            title="ListSectionHeader"
            desc="Figma list section_top(9300-36835) 1:1. 총건수 + page size 컴팩트 텍스트 셀렉트('10개 ∨')."
          >
            <Row label="기본">
              <Specimen caption="page size 변경 → onPageSizeChange(console)">
                <div className="w-[328px]">
                  <ListSectionHeader
                    total={100}
                    pageSize={opPageSize}
                    onPageSizeChange={(n) => {
                      setOpPageSize(n)
                      console.log('[guide] pageSize', n)
                    }}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="background">
              <Specimen caption="배경 바: bg #ECF1FA + 상단 1px #D1D7E0 + 높이 56px + 좌측 텍스트 #0F316E">
                <div className="w-[328px]">
                  <ListSectionHeader
                    variant="background"
                    total={100}
                    pageSize={opPageSize}
                    onPageSizeChange={(n) => {
                      setOpPageSize(n)
                      console.log('[guide] pageSize', n)
                    }}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── FileDownloadList ───────── */}
          <Section
            id="filedownloadlist"
            title="FileDownloadList"
            desc="Figma m_file_download(9300-36444) 1:1. 파일 행(파일명+용량 박스 + 다운로드 아이콘 버튼) + 구분선 + 하단 버튼. files / onDownloadAll(일괄 다운로드) 주입. 항목에 onRemove 주입 시 X(삭제) 버튼 노출, onAddFile 주입 시 하단에 '파일 추가' 버튼 노출(업로드 목록 용도)."
          >
            <Row label="기본 (2건 + 일괄 다운로드)">
              <Specimen caption="다운로드 클릭 → console">
                <div className="w-[328px]">
                  <FileDownloadList
                    files={[
                      {
                        name: '첨부파일명.hwp',
                        size: '786KB',
                        onDownload: () => console.log('[guide] download 1'),
                      },
                      {
                        name: '첨부파일명.hwp',
                        size: '786KB',
                        onDownload: () => console.log('[guide] download 2'),
                      },
                    ]}
                    onDownloadAll={() => console.log('[guide] download all')}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="업로드 목록 (onRemove + onAddFile)">
              <Specimen caption="X 삭제 버튼 + 하단 구분선·'파일 추가' 버튼">
                <div className="w-[328px]">
                  <FileDownloadList
                    files={[
                      {
                        name: '첨부파일명.hwp',
                        size: '786KB',
                        onRemove: () => console.log('[guide] remove 1'),
                      },
                      {
                        name: '첨부파일명.hwp',
                        size: '786KB',
                        onRemove: () => console.log('[guide] remove 2'),
                      },
                    ]}
                    onAddFile={() => console.log('[guide] add file')}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── CardList ───────── */}
          <Section
            id="cardlist"
            title="CardList"
            desc="Figma card list(9300-36838). items(Card props + id)→Card 매핑 + 빈/로딩. 데이터 미소유(페이지가 items 주입)."
          >
            <Row label="기본 (Card 재사용)">
              <Specimen caption="2건 · 카드 클릭 console">
                <div className="w-[328px]">
                  <CardList
                    items={[
                      {
                        id: '1',
                        badges: (
                          <>
                            <Badge>물품</Badge>
                            <Badge>수의계약</Badge>
                          </>
                        ),
                        subtitle: '판단번호 6000A',
                        title: "'26년 K5방독면",
                        rows: [
                          { label: '발주예정월', value: '2026-03' },
                          { label: '발주기관', value: '화력총괄계약팀' },
                          { label: '계약방법', value: '총액제' },
                          { label: '예산금액', value: '11,616,000 원' },
                        ],
                        onClick: () => console.log('[guide] card 1'),
                      },
                      {
                        id: '2',
                        badges: (
                          <>
                            <Badge>용역</Badge>
                            <Badge>일반경쟁</Badge>
                          </>
                        ),
                        subtitle: '판단번호 6000B',
                        title: "'26년 정보화 사업",
                        rows: [
                          { label: '발주예정월', value: '2026-04' },
                          { label: '발주기관', value: '정보화팀' },
                          { label: '계약방법', value: '총액제' },
                          { label: '예산금액', value: '92,472,000 원' },
                        ],
                        onClick: () => console.log('[guide] card 2'),
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="빈 목록 / 로딩">
              <Specimen caption="empty">
                <div className="w-[328px]">
                  <CardList items={[]} />
                </div>
              </Specimen>
              <Specimen caption="loading">
                <div className="w-[328px]">
                  <CardList items={[]} loading />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── CarouselIndicator ───────── */}
          <Section
            id="carouselindicator"
            title="CarouselIndicator"
            desc="Figma carousel(7077:85329 / 7077:85434). 현재/전체 숫자(현재=primary) + 이전/다음 화살표. 메인 홈 주요서비스·배너 공통."
          >
            <Row label="목업 (정적 · 핸들러 없음 → 화살표 비활성)">
              <Specimen caption="1 / 2">
                <CarouselIndicator current={1} total={2} />
              </Specimen>
            </Row>
            <Row label="인터랙티브 (이전/다음)">
              <Specimen caption={`${carouselPage} / 3`}>
                <CarouselIndicator
                  current={carouselPage}
                  total={3}
                  onPrev={() => setCarouselPage((p) => Math.max(1, p - 1))}
                  onNext={() => setCarouselPage((p) => Math.min(3, p + 1))}
                />
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Carousel ───────── */}
          <Section
            id="carousel"
            title="Carousel"
            desc="scroll-snap 스와이프 + 화살표(CarouselIndicator 통합). pages(ReactNode[]) 주입. autoPlayInterval(ms) 주입 시 자동 슬라이드(끝→처음 순환, 조작 중 일시정지). 메인 홈 서비스·배너."
          >
            <Row label="스와이프 / 화살표 (3페이지)">
              <Specimen caption="드래그 또는 ◀▶">
                <div className="w-[328px]">
                  <Carousel
                    ariaLabel="데모"
                    pages={['A', 'B', 'C'].map((t) => (
                      <div className="flex h-24 items-center justify-center rounded-2xl bg-krds-bg-primary-faint text-[22px] font-bold text-krds-action-primary">
                        페이지 {t}
                      </div>
                    ))}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="자동 슬라이드 (autoPlayInterval=5000)">
              <Specimen caption="5초마다 자동 전환 · 조작 중 일시정지 · 끝→처음 순환">
                <div className="w-[328px]">
                  <Carousel
                    ariaLabel="자동 슬라이드 데모"
                    autoPlayInterval={5000}
                    pages={['A', 'B', 'C'].map((t) => (
                      <div className="flex h-24 items-center justify-center rounded-2xl bg-krds-bg-primary-faint text-[22px] font-bold text-krds-action-primary">
                        페이지 {t}
                      </div>
                    ))}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── BottomSheet ───────── */}
          <Section
            id="bottomsheet"
            title="BottomSheet"
            desc="Figma m_bottom sheet(9300-28974) 1:1. 타이틀(19 Bold) + close X + scrollable body + 옵션 footer. 4 닫힘 경로 — 배경(dim) 클릭 / X 버튼 / Esc / 확인 버튼. onConfirm prop 주입 시 자동 풀폭 primary '확인' 버튼이 footer 에 렌더되고 클릭 시 onConfirm 호출 + 자동 닫힘. footer prop 명시 시 onConfirm 보다 우선. safe-area-bottom 자동 보호(iOS 홈 인디케이터)."
          >
            <Row label="footer prop (커스텀 footer)">
              <Specimen caption="열기 → Esc / dim / X 닫힘 + 긴 본문 스크롤">
                <div className="w-[260px]">
                  <Button onClick={() => setSheetOpen(true)}>시트 열기</Button>
                  <BottomSheet
                    open={sheetOpen}
                    onOpenChange={setSheetOpen}
                    title="바텀시트 타이틀"
                    footer={
                      <Button className="w-full" onClick={() => setSheetOpen(false)}>
                        확인
                      </Button>
                    }
                  >
                    <p className="text-krds-body-md text-krds-text-ink">
                      바텀시트 본문 영역입니다. 여러 줄이 들어가면 스크롤됩니다.
                    </p>
                    <div className="mt-4 space-y-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="rounded-krds-8 bg-muted p-3 text-krds-body-sm">
                          항목 {i + 1}
                        </div>
                      ))}
                    </div>
                  </BottomSheet>
                </div>
              </Specimen>
            </Row>
            <Row label="onConfirm prop (자동 확인 버튼 + console.log 데모)">
              <Specimen caption='확인 클릭 → console.log("[BottomSheet] confirmed") + 자동 닫힘'>
                <div className="w-[260px]">
                  <Button onClick={() => setSheetConfirmOpen(true)}>onConfirm 시트 열기</Button>
                  <BottomSheet
                    open={sheetConfirmOpen}
                    onOpenChange={setSheetConfirmOpen}
                    title="확인이 필요합니다"
                    onConfirm={() => {
                      console.log('[BottomSheet] confirmed')
                    }}
                  >
                    <p className="text-krds-body-md text-krds-text-ink">
                      이 작업을 진행하시겠습니까? 확인 버튼을 누르면 콘솔에
                      <code className="mx-1 rounded bg-muted px-1 text-krds-body-sm">
                        [BottomSheet] confirmed
                      </code>
                      가 출력됩니다.
                    </p>
                  </BottomSheet>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── AlertModal ───────── */}
          <Section
            id="alertmodal"
            title="AlertModal"
            desc="Figma m_modal(9300-28651) 1:1. dim 배경 + 중앙 카드(328w). 36px 알림 아이콘(variant: check / error / info / none) + 17 Bold 메인 + 17 Regular 보조 + ButtonGroup(single|split). dismissable=false 기본(명시적 액션 필요). props: open · onOpenChange · variant · icon · title · description · primaryAction(필수) · secondaryAction(주입 시 2버튼). 모바일 360 안전 — w-[328px] + max-w-[calc(100vw-32px)] + max-h-[calc(100dvh-32px)]."
          >
            <Row label="variant + 1버튼 (single)">
              <Specimen caption='variant="check" — 완료 안내, primary 풀폭'>
                <div className="w-[260px]">
                  <Button onClick={() => setAlertSingleOpen(true)}>완료 알럿 열기</Button>
                  <AlertModal
                    open={alertSingleOpen}
                    onOpenChange={setAlertSingleOpen}
                    variant="check"
                    title="신청이 완료되었습니다"
                    description="처리 결과는 알림에서 확인할 수 있습니다."
                    primaryAction={{
                      label: '확인',
                      onClick: () => console.log('[AlertModal] check confirmed'),
                    }}
                  />
                </div>
              </Specimen>
              <Specimen caption='variant="none" — 아이콘 없는 안내'>
                <div className="w-[260px]">
                  <Button variant="secondary" onClick={() => setAlertNoIconOpen(true)}>
                    아이콘 없는 알럿
                  </Button>
                  <AlertModal
                    open={alertNoIconOpen}
                    onOpenChange={setAlertNoIconOpen}
                    variant="none"
                    title="저장되었습니다"
                    primaryAction={{ label: '확인' }}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="variant + 2버튼 (split)">
              <Specimen caption='variant="info" — 일반 확인(취소+확인)'>
                <div className="w-[260px]">
                  <Button onClick={() => setAlertSplitOpen(true)}>info 알럿 열기</Button>
                  <AlertModal
                    open={alertSplitOpen}
                    onOpenChange={setAlertSplitOpen}
                    variant="info"
                    title="페이지를 이동하시겠습니까?"
                    description="작성 중인 내용은 저장되지 않습니다."
                    secondaryAction={{
                      label: '취소',
                      onClick: () => console.log('[AlertModal] cancelled'),
                    }}
                    primaryAction={{
                      label: '이동',
                      onClick: () => console.log('[AlertModal] navigated'),
                    }}
                  />
                </div>
              </Specimen>
              <Specimen caption='variant="error" — 위험 액션(삭제 등)'>
                <div className="w-[260px]">
                  <Button variant="secondary" onClick={() => setAlertErrorOpen(true)}>
                    삭제 알럿 열기
                  </Button>
                  <AlertModal
                    open={alertErrorOpen}
                    onOpenChange={setAlertErrorOpen}
                    variant="error"
                    title="삭제하시겠습니까?"
                    description="삭제된 데이터는 복구할 수 없습니다."
                    secondaryAction={{ label: '취소' }}
                    primaryAction={{
                      label: '삭제',
                      onClick: () => console.log('[AlertModal] deleted'),
                    }}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── FullPopup ───────── */}
          <Section
            id="fullpopup"
            title="FullPopup"
            desc="Figma m_popup_header(9300-28484) 1:1. 화면 전체를 덮는 풀스크린 팝업 — 헤더(h-72 bg-primary-faint + 19 Bold + 우측 utility 1~2개) + flex-1 scrollable body + 옵션 footer. 슬라이드-업 애니메이션(duration-300 ease-out). safe-area-top(헤더) + safe-area-bottom(footer) 자동 보호. props: open · onOpenChange · title · rightActions[](미주입 시 자동 닫기 1개) · footer · dismissable · children."
          >
            <Row label="기본 (rightActions 미주입 — 닫기 자동 1개)">
              <Specimen caption="열기 → 우측 닫기 버튼 1개 자동 표시">
                <div className="w-[260px]">
                  <Button onClick={() => setFullPopupBasicOpen(true)}>풀팝업 열기</Button>
                  <FullPopup
                    open={fullPopupBasicOpen}
                    onOpenChange={setFullPopupBasicOpen}
                    title="공지사항"
                  >
                    <div className="space-y-4 p-krds-8">
                      <p className="text-krds-body-md text-krds-text-ink">
                        풀팝업 본문 영역입니다. 화면 전체를 덮는 구조이며, body 영역은 자동으로
                        스크롤됩니다.
                      </p>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="rounded-krds-8 bg-muted p-4">
                          공지 항목 {i + 1} — 긴 본문 스크롤 검증용
                        </div>
                      ))}
                    </div>
                  </FullPopup>
                </div>
              </Specimen>
            </Row>
            <Row label="rightActions 2개 + footer (필터/검색 패턴)">
              <Specimen caption="초기화 + 닫기 + 하단 검색 버튼">
                <div className="w-[260px]">
                  <Button variant="secondary" onClick={() => setFullPopupResetOpen(true)}>
                    필터 팝업 열기
                  </Button>
                  <FullPopup
                    open={fullPopupResetOpen}
                    onOpenChange={setFullPopupResetOpen}
                    title="조건 검색"
                    rightActions={[
                      {
                        icon: 'Refresh',
                        label: '초기화',
                        onClick: () => console.log('[FullPopup] reset'),
                      },
                      {
                        icon: 'Close',
                        label: '닫기',
                        onClick: () => setFullPopupResetOpen(false),
                      },
                    ]}
                    footer={
                      <Button
                        className="w-full"
                        onClick={() => {
                          console.log('[FullPopup] search submitted')
                          setFullPopupResetOpen(false)
                        }}
                      >
                        검색
                      </Button>
                    }
                  >
                    <div className="space-y-4 p-krds-8">
                      <p className="text-krds-body-md text-krds-text-ink">
                        필터 조건을 선택한 뒤 하단 "검색" 을 누르세요.
                      </p>
                      <div className="rounded-krds-8 border border-border p-4 text-krds-body-sm text-krds-text-muted">
                        필터 UI 자리 (SelectBox, DateRangeInput 등)
                      </div>
                    </div>
                  </FullPopup>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── ButtonGroup ───────── */}
          <Section
            id="buttongroup"
            title="ButtonGroup"
            desc="Figma button group layout(9300-27107) 1:1. items 배열 + layout prop. layout='single'(1버튼 풀폭) / 'asymmetric'(첫 100px + 마지막 flex-1, 기본) / 'split'(모두 균등) / 'vertical'(세로 스택). 가로는 items 순서 [secondary, ..., primary], 세로는 [primary, ..., secondary] 컨벤션."
          >
            <Row label='layout="single" (풀폭 1버튼)'>
              <Specimen caption="더보기 / 다음 페이지 같은 단일 액션">
                <div className="w-[328px]">
                  <ButtonGroup
                    layout="single"
                    items={[{ label: '더보기 (10/100)', variant: 'secondary' }]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label='layout="asymmetric" (기본 — 첫 100px + 마지막 flex-1)'>
              <Specimen caption="2버튼 (취소 + 확인)">
                <div className="w-[328px]">
                  <ButtonGroup
                    items={[
                      { label: '버튼', variant: 'secondary' },
                      { label: '버튼', variant: 'primary' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="3버튼">
                <div className="w-[328px]">
                  <ButtonGroup
                    items={[
                      { label: '이전', variant: 'inner' },
                      { label: '취소', variant: 'secondary' },
                      { label: '확인', variant: 'primary' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label='layout="split" (모두 flex-1 균등)'>
              <Specimen caption="50:50 분할">
                <div className="w-[328px]">
                  <ButtonGroup
                    layout="split"
                    items={[
                      { label: '버튼', variant: 'secondary' },
                      { label: '버튼', variant: 'primary' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label='layout="vertical" (세로 스택, primary 위)'>
              <Specimen caption="세로 — primary 위, secondary 아래">
                <div className="w-[328px]">
                  <ButtonGroup
                    layout="vertical"
                    items={[
                      { label: '버튼', variant: 'primary' },
                      { label: '버튼', variant: 'secondary' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="state">
              <Specimen caption="primary disabled (회색 처리)">
                <div className="w-[328px]">
                  <ButtonGroup
                    items={[
                      { label: '취소', variant: 'secondary' },
                      { label: '확인', variant: 'primary', disabled: true },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── DateInput ───────── */}
          <Section
            id="dateinput"
            title="DateInput"
            desc="Figma m_date_input 1:1 — 단일 날짜. 페이지는 <DateInput value onChange label /> 한 줄만 import. 클릭 시 바텀시트 열려 텍스트 입력 + 캘린더, 확인 클릭 시 onChange. 외부 클릭/Esc 시 변경 폐기."
          >
            <Row label="기본">
              <Specimen caption="레이블 + value + helper">
                <div className="w-[320px]">
                  <DateInput
                    label="일자"
                    value={dateInputValue}
                    onChange={setDateInputValue}
                    helperText="일자를 클릭하면 캘린더가 열립니다."
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="state">
              <Specimen caption="empty">
                <div className="w-[320px]">
                  <DateInput label="일자" />
                </div>
              </Specimen>
              <Specimen caption="error">
                <div className="w-[320px]">
                  <DateInput
                    label="일자"
                    value="2026-05-01"
                    error
                    helperText="잘못된 형식입니다."
                  />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[320px]">
                  <DateInput label="일자" value="2026-05-01" disabled />
                </div>
              </Specimen>
            </Row>
            <Row label="공휴일 mock fetcher">
              <Specimen caption="5/5, 5/25 공휴일 표시">
                <div className="w-[320px]">
                  <DateInput
                    label="일자"
                    value={dateInputValue}
                    onChange={setDateInputValue}
                    fetchHolidays={async (y, m) =>
                      y === 2026 && m === 5 ? ['2026-05-05', '2026-05-25'] : []
                    }
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── DateRangeInput ───────── */}
          <Section
            id="daterangeinput"
            title="DateRangeInput"
            desc="Figma m_date_range_input 1:1 — 기간. 프리셋 칩(1주일/1개월/3개월/기간검색) + 시작~종료 트리거 + 시트(범위 캘린더 + 확인)."
          >
            <Row label="기본">
              <Specimen caption="레이블 + value + helper">
                <div className="w-[320px]">
                  <DateRangeInput
                    label="기간"
                    value={rangeInputValue}
                    onChange={setRangeInputValue}
                    helperText="시작일/종료일을 선택하세요."
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="state">
              <Specimen caption="empty">
                <div className="w-[320px]">
                  <DateRangeInput label="기간" />
                </div>
              </Specimen>
              <Specimen caption="error">
                <div className="w-[320px]">
                  <DateRangeInput
                    label="기간"
                    value={{ start: '2026-05-30', end: '2026-05-01' }}
                    error
                    helperText="시작일이 종료일보다 늦습니다."
                  />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[320px]">
                  <DateRangeInput
                    label="기간"
                    value={{ start: '2026-05-01', end: '2026-05-30' }}
                    disabled
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── RangeSliderInput ───────── */}
          <Section
            id="rangesliderinput"
            title="RangeSliderInput"
            desc="base/Slider(듀얼 핸들) + min/max 입력 박스를 합친 합성 컴포넌트. 슬라이더와 두 입력이 같은 {min,max} 값을 양방향 공유(min ≤ max). unit·format·step·도메인 min/max 를 prop 으로 — 가격 외 임의 숫자 범위에 범용. 검색필터 priceRange 필드가 이걸 사용."
          >
            <Row label="default (추정가격 예시)">
              <Specimen caption="unit='원' · step 100만 · 0~1억">
                <div className="w-[340px]">
                  <RangeSliderInput
                    value={priceRange}
                    onChange={setPriceRange}
                    min={0}
                    max={100_000_000}
                    step={1_000_000}
                    unit="원"
                    ariaLabel="추정가격"
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="error · disabled">
              <Specimen caption="error">
                <div className="w-[340px]">
                  <RangeSliderInput
                    value={{ min: 30, max: 20 }}
                    onChange={() => {}}
                    min={0}
                    max={100}
                    error
                  />
                </div>
              </Specimen>
              <Specimen caption="disabled">
                <div className="w-[340px]">
                  <RangeSliderInput
                    value={{ min: 20, max: 70 }}
                    onChange={() => {}}
                    min={0}
                    max={100}
                    disabled
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="슬라이더만 (showInputs=false)">
              <Specimen caption="입력 박스 숨김">
                <div className="w-[340px]">
                  <RangeSliderInput
                    value={priceRange}
                    onChange={setPriceRange}
                    min={0}
                    max={100_000_000}
                    step={1_000_000}
                    showInputs={false}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── TagList ───────── */}
          <Section
            id="taglist"
            title="TagList"
            desc="Figma m_tag_list(9300-27122) 1:1. items 배열을 Tag 로 매핑. flex-wrap + gap 8. onRemove 전달 시 자동으로 모든 태그 closable + X 클릭 핸들러 wire-up. closable=true 만 주면 모두 X 표시(클릭 비활성)."
          >
            <Row label="onRemove (활성 X)">
              <Specimen caption="X 클릭 시 해당 태그 제거">
                <div className="w-[360px]">
                  <TagList
                    items={tagListItems}
                    onRemove={(id) => setTagListItems((prev) => prev.filter((t) => t.id !== id))}
                  />
                  {tagListItems.length === 0 && (
                    <p className="mt-2 text-krds-body-sm text-krds-text-muted">
                      (모두 제거됨 — 새로고침으로 복구)
                    </p>
                  )}
                </div>
              </Specimen>
            </Row>
            <Row label="closable 만 (읽기 전용)">
              <Specimen caption="X 표시되나 클릭 비활성">
                <div className="w-[360px]">
                  <TagList
                    closable
                    items={[{ label: '읽기전용1' }, { label: '읽기전용2' }, { label: '읽기전용3' }]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="closable 없음 (단순 태그)">
              <Specimen caption="X 없는 평문 태그 목록">
                <div className="w-[360px]">
                  <TagList
                    items={[
                      { label: '카테고리1' },
                      { label: '카테고리2' },
                      { label: '카테고리3' },
                      { label: '카테고리4' },
                      { label: '카테고리5' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── TabList ───────── */}
          <Section
            id="tablist"
            title="TabList"
            desc="Figma m_tab(9300-28541) 1:1. items 배열 + value/onChange · 가로 스크롤(overflow-x-auto) + gap 8. 활성 탭 변경 시 자동 scrollIntoView. scrollButtons: 'auto'(기본, 스크롤 가능할 때만 좌/우 화살표 자동) / 'always' / 'none'. 화살표 옆 그라데이션 fade 포함."
          >
            <Row label="기본 (적은 탭, 화살표 미노출)">
              <Specimen caption="2~3 탭 — 화면 안에 들어와 스크롤 불필요">
                <div className="w-[360px]">
                  <TabList
                    value={tabValue}
                    onChange={setTabValue}
                    items={[
                      { value: 'bid', label: '입찰' },
                      { value: 'notice', label: '공고' },
                      { value: 'contract', label: '계약' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="많은 탭 (overflow → auto 화살표)">
              <Specimen caption="스크롤 가능 시 끝쪽 화살표 자동 노출">
                <div className="w-[360px]">
                  <TabList
                    value={tabManyValue}
                    onChange={setTabManyValue}
                    items={[
                      { value: 't1', label: '탭제목1' },
                      { value: 't2', label: '탭제목2' },
                      { value: 't3', label: '탭제목3' },
                      { value: 't4', label: '탭제목4' },
                      { value: 't5', label: '탭제목5' },
                      { value: 't6', label: '탭제목6' },
                      { value: 't7', label: '탭제목7' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label='scrollButtons="always"'>
              <Specimen caption="스크롤 불필요해도 양쪽 화살표 강제 노출">
                <div className="w-[360px]">
                  <TabList
                    value={tabValue}
                    onChange={setTabValue}
                    scrollButtons="always"
                    items={[
                      { value: 'bid', label: '입찰' },
                      { value: 'notice', label: '공고' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label='scrollButtons="none"'>
              <Specimen caption="화살표 완전 미노출 (자연 스와이프만)">
                <div className="w-[360px]">
                  <TabList
                    value={tabManyValue}
                    onChange={setTabManyValue}
                    scrollButtons="none"
                    items={[
                      { value: 't1', label: '탭제목1' },
                      { value: 't2', label: '탭제목2' },
                      { value: 't3', label: '탭제목3' },
                      { value: 't4', label: '탭제목4' },
                      { value: 't5', label: '탭제목5' },
                      { value: 't6', label: '탭제목6' },
                      { value: 't7', label: '탭제목7' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── NavigationItemList ───────── */}
          <Section
            id="navigationitemlist"
            title="NavigationItemList"
            desc="Figma m_navigation item_list(9300-28625) 1:1. items 배열을 NavigationItem 으로 매핑. divider 자동: 첫 항목 상단 + 모든 항목 하단 (N+1 라인이 N행을 감쌈). 각 item.onClick 으로 라우팅 처리."
          >
            <Row label="기본 (6항목)">
              <Specimen caption="입찰 관련 바로가기 목록">
                <div className="w-[328px]">
                  <NavigationItemList
                    items={[
                      {
                        id: 'pq',
                        label: '사전심사(PQ)신청서 작성하기',
                        onClick: () => setNavClicked('사전심사(PQ)'),
                      },
                      {
                        id: 'bid',
                        label: '입찰서(견적서) 작성하기',
                        onClick: () => setNavClicked('입찰서(견적서)'),
                      },
                      {
                        id: 'join',
                        label: '입찰참가신청서 작성하기',
                        onClick: () => setNavClicked('입찰참가신청서'),
                      },
                      {
                        id: 'abandon',
                        label: '입찰포기 신청서 작성하기',
                        onClick: () => setNavClicked('입찰포기'),
                      },
                      {
                        id: 'cancel',
                        label: '입찰취소 신청서 작성하기',
                        onClick: () => setNavClicked('입찰취소'),
                      },
                      {
                        id: 'rate',
                        label: '환율정보 바로가기',
                        onClick: () => setNavClicked('환율정보'),
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="긴 텍스트 (말줄임)">
              <Specimen caption="overflow → ellipsis">
                <div className="w-[328px]">
                  <NavigationItemList
                    items={[
                      {
                        id: 'long',
                        label:
                          '아주 긴 바로가기 이름 텍스트가 들어가면 truncate 처리되어 말줄임됩니다 끝까지 표시되지 않음',
                        onClick: () => setNavClicked('긴 텍스트'),
                      },
                      {
                        id: 'short',
                        label: '짧은 이름',
                        onClick: () => setNavClicked('짧은 이름'),
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── StepBar ───────── */}
          <Section
            id="stepbar"
            title="StepBar"
            desc="Figma Step bar(9300-28323·28417) 1:1. atomic 분리 없이 한 composite 파일에 통합. items[{label, state, depth?}] + orientation. state: done/doing/todo/done-red. depth: 1(chip-pill 19 Bold) / 2(connector line + 14 dot + 17 text). vertical 에서 연속된 2depth 사이에 connector 자동 연결. horizontal 은 가로 스와이프 + 우측 펼침(▾) 버튼 → '진행현황' 바텀시트(세로 StepBar 전체 + 확인). sheetItems 로 상세(1·2depth) 목록을 시트에 주입(생략 시 가로 항목 그대로)."
          >
            <Row label="orientation='vertical' (혼합 depth — 진행현황 예시)">
              <Specimen caption="입찰 프로세스 진행 흐름">
                <div className="w-[280px]">
                  <StepBar
                    items={[
                      { label: '조달계획', state: 'done', depth: 1 },
                      { label: '조달계획', state: 'done', depth: 2 },
                      { label: '사전규격', state: 'done', depth: 2 },
                      { label: '입찰', state: 'doing', depth: 1 },
                      { label: '입찰공고', state: 'done-red', depth: 2 },
                      { label: '입찰진행', state: 'doing', depth: 2 },
                      { label: '개찰', state: 'todo', depth: 2 },
                      { label: '계약', state: 'todo', depth: 1 },
                      { label: '전자계약', state: 'todo', depth: 2 },
                      { label: '이행', state: 'todo', depth: 1 },
                      { label: '검사 및 납품조서', state: 'todo', depth: 2 },
                      { label: '대금사후', state: 'todo', depth: 1 },
                      { label: '대금청구', state: 'todo', depth: 2 },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="orientation='horizontal' (1depth only)">
              <Specimen caption="간단한 3-step 가로 진행 표시">
                <div className="w-[420px]">
                  <StepBar
                    orientation="horizontal"
                    items={[
                      { label: '스텝제목', state: 'done' },
                      { label: '스텝제목', state: 'doing' },
                      { label: '스텝제목', state: 'todo' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="horizontal — 가로 스와이프 + 우측 펼침(▾) → 진행현황 바텀시트">
              <Specimen caption="▾ 터치 시 세로 StepBar 전체가 바텀시트로 (sheetItems 생략 = 가로 항목 그대로)">
                <div className="w-[320px]">
                  <StepBar
                    orientation="horizontal"
                    items={[
                      { label: '조달계획', state: 'done' },
                      { label: '사전규격', state: 'done' },
                      { label: '입찰', state: 'doing' },
                      { label: '계약', state: 'todo' },
                      { label: '이행', state: 'todo' },
                      { label: '대금사후', state: 'todo' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="sheetItems — 시트에 상세 진행현황(1·2depth) 주입">
                <div className="w-[320px]">
                  <StepBar
                    orientation="horizontal"
                    items={[
                      { label: '조달계획', state: 'done' },
                      { label: '입찰', state: 'doing' },
                      { label: '계약', state: 'todo' },
                      { label: '이행', state: 'todo' },
                      { label: '대금사후', state: 'todo' },
                    ]}
                    sheetItems={[
                      { label: '조달계획', state: 'done', depth: 1 },
                      { label: '사전규격', state: 'done', depth: 2 },
                      { label: '입찰', state: 'doing', depth: 1 },
                      { label: '입찰공고', state: 'done-red', depth: 2 },
                      { label: '입찰진행', state: 'doing', depth: 2 },
                      { label: '개찰', state: 'todo', depth: 2 },
                      { label: '계약', state: 'todo', depth: 1 },
                      { label: '이행', state: 'todo', depth: 1 },
                      { label: '대금사후', state: 'todo', depth: 1 },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="state 4종 (atomic 단독 노출)">
              <Specimen caption="1depth — done / doing / todo">
                <div className="flex flex-wrap gap-2">
                  <StepBar
                    orientation="horizontal"
                    items={[
                      { label: 'done', state: 'done' },
                      { label: 'doing', state: 'doing' },
                      { label: 'todo', state: 'todo' },
                    ]}
                  />
                </div>
              </Specimen>
              <Specimen caption="2depth — done / done-red / doing / todo">
                <div className="w-[280px]">
                  <StepBar
                    items={[
                      { label: 'done', state: 'done', depth: 2 },
                      { label: 'done-red', state: 'done-red', depth: 2 },
                      { label: 'doing', state: 'doing', depth: 2 },
                      { label: 'todo', state: 'todo', depth: 2 },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Notice ───────── */}
          <Section
            id="notice"
            title="Notice"
            desc="Figma m_noticebox(9300-29118) + m_notice_urgent(9300-29103) 통합. `type` prop 으로 2가지 분기. default = bg-primary-faint + 좌측 40 아이콘 버튼 + 17 Medium 멀티라인. urgent = bg-danger-subtle + Badge solid red(이미 있는 Badge 재사용) + 17 Bold 텍스트. 아이콘은 `icon` prop 으로 교체, 클릭은 onIconClick."
          >
            <Row label='type="default"'>
              <Specimen caption="알림 안내 (아이콘 + 본문)">
                <div className="w-[328px]">
                  <Notice onIconClick={() => alert('알림 설정')}>
                    입찰 · 계약 관련 주요 업무 알림을 모바일로 받을 수 있습니다.
                  </Notice>
                </div>
              </Specimen>
              <Specimen caption="아이콘 교체 (icon='Settings')">
                <div className="w-[328px]">
                  <Notice icon="Settings" onIconClick={() => alert('설정')}>
                    설정에서 알림 받을 항목을 골라보세요.
                  </Notice>
                </div>
              </Specimen>
              <Specimen caption="아이콘 비활성 (onIconClick 없음)">
                <div className="w-[328px]">
                  <Notice>클릭 핸들러 없이 시각만 — 정보 전달용.</Notice>
                </div>
              </Specimen>
            </Row>
            <Row label='type="urgent"'>
              <Specimen caption="중요 공지">
                <div className="w-[360px]">
                  <Notice type="urgent">중요공지 내용이 표시됩니다.</Notice>
                </div>
              </Specimen>
              <Specimen caption='badgeLabel="긴급"'>
                <div className="w-[360px]">
                  <Notice type="urgent" badgeLabel="긴급">
                    서버 점검으로 일시 접속 제한 — 09:00 ~ 11:00
                  </Notice>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Table ───────── */}
          <Section
            id="table"
            title="Table"
            desc="Figma m_table(9300-28667) 1:1. atomic 분리 없이 한 composite 안에 통합. rows[{label, value, type?}] · type: default(좌측) / number(우측 정렬, tabular-nums) / combination(value 가 자유 ReactNode — 여러 줄, 버튼, Input 등). 행 사이 1px divider 자동."
          >
            <Row label="기본 (default 행)">
              <Specimen caption="라벨/내용 5행">
                <div className="w-[328px]">
                  <Table
                    rows={[
                      { label: '레이블', value: '내용' },
                      { label: '레이블', value: '내용' },
                      { label: '레이블', value: '내용' },
                      { label: '레이블', value: '내용' },
                      { label: '레이블', value: '내용' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label='type="number" (우측 정렬)'>
              <Specimen caption="금액/숫자 컬럼">
                <div className="w-[328px]">
                  <Table
                    rows={[
                      { label: '요구년도', value: '2026' },
                      { label: '발주기관', value: '화력총괄계약팀' },
                      { label: '발주예정월', value: '2026-03' },
                      { label: '국제', value: '100,000,000 원', type: 'number' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label='type="combination" (자유 컨텐츠)'>
              <Specimen caption="긴 텍스트 + 버튼 조합">
                <div className="w-[328px]">
                  <Table
                    rows={[
                      {
                        label: '수의계약사유',
                        value:
                          '국계법시행령 제26조 제1항 제5호 가목2) 추정가격 2천만원이하(제조, 구매, 용역)',
                      },
                      { label: '기타', value: '-' },
                      {
                        label: '레이블',
                        value: (
                          <>
                            <span>4240-3753116870</span>
                            <Button size="sm" variant="inner">
                              보기
                            </Button>
                          </>
                        ),
                        type: 'combination',
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Card ───────── */}
          <Section
            id="card"
            title="Card"
            desc="Figma m_card(9300-28728) 1:1. 이미 만든 다른 base/composites(Badge, Icon, ButtonGroup …)를 슬롯 props 로 받아 다양한 type 표현. 슬롯: badges · subtitle · title · rows[] · trailing · footer · onClick. 채우는 슬롯에 따라 type1~4 모두 표현 가능."
          >
            <Row label="default_list (badges + title + 4행)">
              <Specimen caption="입찰 카드 — 다중 뱃지 + 라벨/데이터 4행">
                <div className="w-[328px]">
                  <Card
                    badges={
                      <>
                        <Badge type="pastel" color="blue">
                          구분명
                        </Badge>
                        <Badge type="pastel" color="blue">
                          구분명
                        </Badge>
                        <Badge type="pastel" color="blue">
                          구분명
                        </Badge>
                      </>
                    }
                    subtitle="주요 정보"
                    title="카드 제목"
                    rows={[
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '100,000,000 원' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="type2 (compact — rows + trailing)">
              <Specimen caption="라벨/데이터 2행 + 우측 Badge + 화살표">
                <div className="w-[328px]">
                  <Card
                    onClick={() => alert('카드 클릭')}
                    rows={[
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '데이터' },
                    ]}
                    trailing={
                      <>
                        <Badge type="pastel" color="blue">
                          구분명
                        </Badge>
                        <Icon name="ChevronRight" size={20} aria-hidden />
                      </>
                    }
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="type3 (긴 제목 + 줄바꿈 — 풀 슬롯)">
              <Specimen caption="제목 멀티라인 + 9뱃지 + 4행">
                <div className="w-[328px]">
                  <Card
                    badges={
                      <>
                        {Array.from({ length: 9 }).map((_, i) => (
                          <Badge key={i} type="pastel" color="blue">
                            구분명
                          </Badge>
                        ))}
                      </>
                    }
                    subtitle="주요 정보"
                    title="카드 제목이 길어지는 경우 줄바꿈 처리하여 모두 노출합니다."
                    rows={[
                      { label: '레이블', value: '데이터' },
                      {
                        label: '레이블',
                        value: '데이터가 길어지는 경우 줄바꿈 처리',
                      },
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '100,000,000 원' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="type4 (footer — ButtonGroup)">
              <Specimen caption="카드 + 하단 액션">
                <div className="w-[328px]">
                  <Card
                    badges={
                      <>
                        <Badge type="pastel" color="blue">
                          구분명
                        </Badge>
                        <Badge type="pastel" color="blue">
                          구분명
                        </Badge>
                      </>
                    }
                    subtitle="주요 정보"
                    title="카드 제목"
                    rows={[
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '데이터' },
                    ]}
                    footer={
                      <ButtonGroup
                        layout="split"
                        items={[
                          { label: '취소', variant: 'secondary' },
                          { label: '확인', variant: 'primary' },
                        ]}
                      />
                    }
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── List ───────── */}
          <Section
            id="list"
            title="List"
            desc="Figma list(9300-29812) 1:1. items 배열 — 행마다 layout='text'(아이콘+제목+우측 Switch+설명) 또는 layout='keyvalue'(아이콘+제목+메타 행+하단 풀폭 버튼) 선택. 행 사이 1px divider 자동(마지막 안 그림). position(top/middle/bottom)은 인덱스로 자동 처리. Switch/Button/Icon 재사용."
          >
            <Row label="layout='text' (Switch 행)">
              <Specimen caption="알림 설정 같은 토글 리스트 (3행)">
                <div className="w-[328px]">
                  <List
                    items={[
                      {
                        layout: 'text',
                        icon: 'Notifications',
                        title: '리스트 제목',
                        description:
                          '리스트 설명글 설명글 최대 두줄까지 노출되며 그 이상은 말줄임 처리 됨',
                        switch: {
                          checked: listSwitch1,
                          onCheckedChange: setListSwitch1,
                        },
                      },
                      {
                        layout: 'text',
                        icon: 'Notifications',
                        title: '리스트 제목',
                        description:
                          '리스트 설명글 설명글 최대 두줄까지 노출되며 그 이상은 말줄임 처리 됨',
                        switch: {
                          checked: listSwitch2,
                          onCheckedChange: setListSwitch2,
                        },
                      },
                      {
                        layout: 'text',
                        icon: 'Notifications',
                        title: '리스트 제목',
                        description:
                          '리스트 설명글 설명글 최대 두줄까지 노출되며 그 이상은 말줄임 처리 됨',
                        switch: {
                          checked: listSwitch3,
                          onCheckedChange: setListSwitch3,
                        },
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="layout='keyvalue' (메타 + 버튼)">
              <Specimen caption="폴더 목록 같은 카드 + 액션">
                <div className="w-[328px]">
                  <List
                    items={[
                      {
                        layout: 'keyvalue',
                        icon: 'Notifications',
                        title: '폴더명이 표시됩니다',
                        meta: ['수정 2025-01-31 12:12', '폴더 10MB'],
                        button: { label: '버튼', variant: 'inner' },
                      },
                      {
                        layout: 'keyvalue',
                        icon: 'Notifications',
                        title: '폴더명이 표시됩니다',
                        meta: ['수정 2025-01-31 12:12', '폴더 10MB'],
                        button: { label: '버튼', variant: 'inner' },
                      },
                      {
                        layout: 'keyvalue',
                        icon: 'Notifications',
                        title: '폴더명이 표시됩니다',
                        meta: ['수정 2025-01-31 12:12', '폴더 10MB'],
                        button: { label: '버튼', variant: 'inner' },
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="layout 혼합 (한 리스트에 두 타입 동시)">
              <Specimen caption="text + keyvalue 섞어 쓰기">
                <div className="w-[328px]">
                  <List
                    items={[
                      {
                        layout: 'text',
                        icon: 'Notifications',
                        title: '알림 설정',
                        description: '주요 업무 알림 ON/OFF',
                        switch: { defaultChecked: true },
                      },
                      {
                        layout: 'keyvalue',
                        icon: 'Description',
                        title: '내 문서함',
                        meta: ['수정 2025-01-31 12:12', '폴더 10MB'],
                        button: { label: '열기', variant: 'inner' },
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="icon 없이">
              <Specimen caption="icon 미주입 시 좌측 들여쓰기 없이">
                <div className="w-[328px]">
                  <List
                    items={[
                      {
                        layout: 'text',
                        title: '리스트 제목 (아이콘 없음)',
                        description: '간단한 toggle 리스트',
                        switch: { defaultChecked: false },
                      },
                      {
                        layout: 'text',
                        title: '리스트 제목 2',
                        description: '한 줄 설명',
                        switch: { defaultChecked: true },
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Toast ───────── */}
          <Section
            id="toast"
            title="Toast"
            desc="Figma m_toast_popup(9300-28497) 1:1. 위치: fixed bottom-4 + inset-x-4 (페이지 하단 16px 위 + 좌우 여백 16px) · z-100. bg rgba(15,49,110,0.9) + rounded-8 + 15 Bold white. open + onClose + duration(기본 2000ms, 0/undefined 면 자동 닫힘 없음) props. opacity transition(200ms) 으로 fade in/out."
          >
            <Row label="기본 (duration 2초 자동 닫힘)">
              <Specimen caption="버튼 클릭 → 2초 후 자동 사라짐">
                <Button onClick={() => setToastShortOpen(true)}>토스트 표시</Button>
                <Toast open={toastShortOpen} onClose={() => setToastShortOpen(false)}>
                  저장되었습니다.
                </Toast>
              </Specimen>
            </Row>
            <Row label="긴 메시지 (duration={4000})">
              <Specimen caption="4초간 유지 — 긴 안내문">
                <Button variant="secondary" onClick={() => setToastLongOpen(true)}>
                  긴 토스트
                </Button>
                <Toast open={toastLongOpen} onClose={() => setToastLongOpen(false)} duration={4000}>
                  토스트 팝업 메시지를 표시합니다. 메시지가 길어질 경우 줄바꿈 예시입니다.
                </Toast>
              </Specimen>
            </Row>
            <Row label="수동 닫힘 (duration={0})">
              <Specimen caption="자동 닫힘 없음 — 외부에서 토글">
                <div className="flex gap-2">
                  <Button onClick={() => setToastManualOpen(true)}>열기</Button>
                  <Button variant="secondary" onClick={() => setToastManualOpen(false)}>
                    닫기
                  </Button>
                </div>
                <Toast
                  open={toastManualOpen}
                  duration={0}
                  onClose={() => setToastManualOpen(false)}
                >
                  자동으로 사라지지 않습니다. 직접 닫아주세요.
                </Toast>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SummaryInfo ───────── */}
          <Section
            id="summaryinfo"
            title="SummaryInfo"
            desc="Figma m_summary info(9300-29058) 1:1. 기존 base(Badge, Icon, Button) 조합으로 구성. 슬롯 props: badges(가로 스크롤 + overflow 시 우측 화살표 자동) · subtitle · title · actions(우측 아이콘 버튼들) · rows[{label,value}]. ResizeObserver+scroll 감지로 badge swipe 자동."
          >
            <Row label="실제 디자인 풀 케이스 (badges + actions + rows)">
              <Specimen caption="조달 카드 — 7뱃지 + 판단번호/제목 + 액션 2개 + 4행">
                <div className="w-[360px] rounded-krds-8 border border-border bg-background">
                  <SummaryInfo
                    badges={Array.from({ length: 7 }, () => ({ label: '구분명' }))}
                    subtitle="판단번호 4000A"
                    title="2026 K5 방독면 수리부속(구매)"
                    actions={
                      <>
                        <button
                          type="button"
                          aria-label="알림 신청"
                          onClick={() => alert('notify')}
                          className="flex size-[37px] items-center justify-center rounded-krds-8 border border-krds-border-field text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring"
                        >
                          <Icon name="NotificationAdd" size={24} aria-hidden />
                        </button>
                        <button
                          type="button"
                          aria-label="즐겨찾기"
                          onClick={() => alert('star')}
                          className="flex size-[37px] items-center justify-center rounded-krds-8 border border-krds-border-field text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring"
                        >
                          <Icon name="KidStar" size={24} aria-hidden />
                        </button>
                        <button
                          type="button"
                          aria-label="출력"
                          onClick={() => alert('print')}
                          className="flex size-[37px] items-center justify-center rounded-krds-8 border border-krds-border-field text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring"
                        >
                          <Icon name="Print" size={24} aria-hidden />
                        </button>
                      </>
                    }
                    rows={[
                      { label: '발주예정월', value: '2026-03' },
                      { label: '발주기관', value: '화력총괄계약팀' },
                      { label: '계약방법', value: '총액제' },
                      { label: '예산금액', value: '225,337,550 원' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="badges 만 (간단한 헤더)">
              <Specimen caption="제목 + 4행, 뱃지/액션 없음">
                <div className="w-[360px] rounded-krds-8 border border-border bg-background">
                  <SummaryInfo
                    subtitle="주요 정보"
                    title="카드 제목"
                    rows={[
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '데이터' },
                      { label: '레이블', value: '데이터' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="badges overflow → swipe 화살표 자동">
              <Specimen caption="좁은 폭에서 화살표 노출">
                <div className="w-[280px] rounded-krds-8 border border-border bg-background">
                  <SummaryInfo
                    badges={Array.from({ length: 6 }, () => ({ label: '구분명' }))}
                    subtitle="주요 정보"
                    title="좁은 폭이라 뱃지가 overflow"
                    rows={[{ label: '레이블', value: '데이터' }]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── SummaryUtilButton ───────── */}
          <Section
            id="summaryutilbutton"
            title="SummaryUtilButton"
            desc="Figma m_button icon_page utility(9300-27080) 1:1. 요약정보(SummaryInfo) 액션 슬롯용 37×37 아이콘 버튼. state: default(흰 배경+field 보더+ink 라인 아이콘) · pressed(:active=faint-blue 배경) · disabled(회색 배경·보더 제거·회색 아이콘). selected(active) 토글 시 아이콘 채움(fill 1)+navy(primary-active). 상세 화면(조달계획·국외·사전규격·입찰공고) 공통."
          >
            <Row label="state / selected">
              <Specimen caption="default (off)">
                <SummaryUtilButton icon="KidStar" label="즐겨찾기" onClick={() => {}} />
              </Specimen>
              <Specimen caption="selected (on) — 채움 + navy">
                <SummaryUtilButton icon="KidStar" label="즐겨찾기" active onClick={() => {}} />
              </Specimen>
              <Specimen caption="disabled">
                <SummaryUtilButton icon="Print" label="출력" disabled onClick={() => {}} />
              </Specimen>
              <Specimen caption="아이콘 종류 (NotificationAdd / Print)">
                <div className="flex gap-2">
                  <SummaryUtilButton icon="NotificationAdd" label="알림 신청" onClick={() => {}} />
                  <SummaryUtilButton icon="Print" label="출력" onClick={() => {}} />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── MenuAccordion ───────── */}
          <Section
            id="menuaccordion"
            title="MenuAccordion"
            desc="Figma menu accordian(9300-29486) 1:1. 트리(children 재귀) items 받아 1/2/3 depth 자동 렌더. 1depth(45·border·19 Bold) / 2depth(34·17 Regular, 자식 있을 때만 chevron) / 3depth(31·15 Regular muted·· 불릿). chevron 은 ExpandMore + 열림 시 rotate-180. uncontrolled(defaultOpenIds) / controlled(openIds + onOpenChange) 둘 다 지원."
          >
            <Row label="기본 (실제 디자인 트리 일부 — 8 group)">
              <Specimen caption="조달 메뉴 트리 (defaultOpenIds=['plan','contract','support'])">
                <div className="w-[328px]">
                  <MenuAccordion
                    defaultOpenIds={['plan', 'contract', 'support']}
                    items={[
                      {
                        id: 'plan',
                        label: '조달계획',
                        children: [{ id: 'plan-mgmt', label: '조달계획관리' }],
                      },
                      {
                        id: 'bid',
                        label: '조달계획',
                        children: [
                          { id: 'bid-notice', label: '입찰공고' },
                          { id: 'bid-progress', label: '입찰진행' },
                          { id: 'bid-open', label: '개찰' },
                        ],
                      },
                      {
                        id: 'contract',
                        label: '계약',
                        children: [
                          {
                            id: 'ec',
                            label: '전자계약',
                            children: [
                              { id: 'sign-1', label: '개인동의특약' },
                              { id: 'sign-2', label: '에디나의 약속' },
                            ],
                          },
                        ],
                      },
                      {
                        id: 'execute',
                        label: '이행',
                        children: [{ id: 'inspect', label: '검사및납품조서' }],
                      },
                      {
                        id: 'payment',
                        label: '대금사후',
                        children: [{ id: 'pay-req', label: '대금청구' }],
                      },
                      {
                        id: 'support',
                        label: '업무지원',
                        children: [
                          { id: 's1', label: '사전의향서' },
                          { id: 's2', label: '물품납품및물량배정' },
                          { id: 's3', label: '하자관리' },
                          { id: 's4', label: '관급자산관리' },
                          { id: 's5', label: '세금계산서' },
                          { id: 's6', label: '하도급관리' },
                          { id: 's7', label: '전자보증서체계' },
                          { id: 's8', label: '보증서통합관리' },
                          { id: 's9', label: '사업구조별품목조회' },
                          { id: 's10', label: '국산화개발품목조회' },
                          { id: 's11', label: '모의심사' },
                        ],
                      },
                      {
                        id: 'cs',
                        label: '고객센터',
                        children: [
                          { id: 'cs-1', label: '공지사항' },
                          { id: 'cs-2', label: '자료실' },
                          { id: 'cs-3', label: '자주묻는질문' },
                          { id: 'cs-4', label: '민원사항답글신청' },
                          { id: 'cs-5', label: '방행조회' },
                          { id: 'cs-6', label: '국민신문고' },
                          { id: 'cs-7', label: '설문조사' },
                        ],
                      },
                      {
                        id: 'my',
                        label: '고객센터',
                        children: [
                          { id: 'my-1', label: '나의진행업무현황' },
                          { id: 'my-2', label: '나의업무이력현황' },
                          { id: 'my-3', label: '나의게시물' },
                          { id: 'my-4', label: '관심입찰공고' },
                          { id: 'my-5', label: '업무캘린더' },
                          { id: 'my-6', label: '문서함' },
                          { id: 'my-7', label: '알림현황' },
                          { id: 'my-8', label: '관심법령' },
                          { id: 'my-9', label: '나의메뉴현황' },
                          { id: 'my-10', label: '국산화개발품목조회' },
                          { id: 'my-11', label: '공고폭독조회' },
                        ],
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="2depth 안에 3depth 까지">
              <Specimen caption="3단계 트리 (1→2→3depth · 점 불릿)">
                <div className="w-[328px]">
                  <MenuAccordion
                    defaultOpenIds={['contract', 'ec']}
                    items={[
                      {
                        id: 'contract',
                        label: '계약',
                        children: [
                          {
                            id: 'ec',
                            label: '전자계약',
                            children: [
                              { id: 'sign-1', label: '개인동의특약' },
                              { id: 'sign-2', label: '에디나의 약속' },
                            ],
                          },
                          { id: 'paper', label: '서면계약(자식 없음 = leaf)' },
                        ],
                      },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── FloatingActionButton ───────── */}
          <Section
            id="floatingactionbutton"
            title="FloatingActionButton"
            desc="Figma m_button_plus(9300-26913) + m_button_top(9300-26911) 통합. 48 원형 + 흰 배경 + 30px Material 아이콘(Add/Upgrade) + drop-shadow. 핸들러 prop(onPlus/onTop)으로 1개/2개 노출 자동 분기. 두 개일 때 세로 스택(top 위 / plus 아래). 좌우/z-index 는 사용처(fixed bottom-0 등) 책임이고, 하단 간격은 컴포넌트가 BottomNav 유무에 맞춰 자동(있으면 그 위 10px, 없으면 화면 하단 10px)."
          >
            <Row label="노출 (핸들러 유무)">
              <Specimen caption="plus 1개 (onPlus 만)">
                <FloatingActionButton onPlus={() => setFabPlusCount((c) => c + 1)} />
              </Specimen>
              <Specimen caption="top 1개 (onTop 만)">
                <FloatingActionButton onTop={() => setFabTopCount((c) => c + 1)} />
              </Specimen>
              <Specimen caption="둘 다 (세로 스택)">
                <FloatingActionButton
                  onTop={() => setFabTopCount((c) => c + 1)}
                  onPlus={() => setFabPlusCount((c) => c + 1)}
                />
              </Specimen>
              <Specimen caption="핸들러 0개 → null 렌더">
                <div className="text-krds-body-sm text-krds-text-muted">
                  (렌더 결과 없음)
                  <FloatingActionButton />
                </div>
              </Specimen>
            </Row>
            <Row label="이벤트 카운트">
              <Specimen caption="onPlus 호출 수">
                <code className="text-krds-body-md font-bold text-krds-text-primary">
                  {fabPlusCount}
                </code>
              </Specimen>
              <Specimen caption="onTop 호출 수">
                <code className="text-krds-body-md font-bold text-krds-text-primary">
                  {fabTopCount}
                </code>
              </Specimen>
            </Row>
            <Row label="실제 사용 (fixed 컨테이너)">
              <Specimen caption="사용처에서 fixed bottom-X right-X 으로 감싸기">
                <div className="relative h-40 w-[280px] overflow-hidden rounded-krds-8 border border-border bg-muted">
                  <p className="p-4 text-krds-body-sm text-krds-text-muted">
                    페이지 컨테이너 (스크롤 영역)
                  </p>
                  <div className="absolute bottom-4 right-4">
                    <FloatingActionButton
                      onTop={() => setFabTopCount((c) => c + 1)}
                      onPlus={() => setFabPlusCount((c) => c + 1)}
                    />
                  </div>
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Header ───────── */}
          <Section
            id="header"
            title="Header"
            desc="Figma Header(9300-26861) 기반 + 2026-07-06 2단 헤더 전환(카톡 기획 이미지). 메인바(로고+로그인/로그아웃+알림+전체메뉴, h-72)는 main/sub 공통 최상단 고정 — isLoggedIn 으로 로그인/로그아웃 버튼 토글. variant='sub' 는 메인바 아래 타이틀바(뒤로+가운데 타이틀, h-56) 한 줄 추가. 구 util(search|home) prop 은 deprecated(무시). 통합검색↔알림현황 위치 스왑으로 유틸 슬롯=알림현황(hasNotification dot). utility menu(70×66) 인라인 아톰. Logo·Icon base 재사용. sticky top-0 + safe-area-top. 미리보기는 360px 프레임."
          >
            <Row label="main — 로그인 전 / 후">
              <Specimen caption="variant='main' isLoggedIn={false} (기본 · 로그인 버튼)">
                <div className="w-[360px]">
                  <Header onLogin={() => console.log('[Header] login')} />
                </div>
              </Specimen>
              <Specimen caption="variant='main' isLoggedIn={true} + hasNotification (로그아웃 버튼 · 알림 dot)">
                <div className="w-[360px]">
                  <Header
                    isLoggedIn
                    hasNotification
                    onLogout={() => console.log('[Header] logout')}
                    onNotification={() => console.log('[Header] notification')}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="sub — 메인바 + 타이틀바(뒤로+가운데 타이틀)">
              <Specimen caption="variant='sub' 로그인 전 (메인바 로그인 버튼 + 타이틀바)">
                <div className="w-[360px]">
                  <Header
                    variant="sub"
                    title="메뉴 타이틀"
                    onBack={() => console.log('[Header] back')}
                    onLogin={() => console.log('[Header] login')}
                  />
                </div>
              </Specimen>
              <Specimen caption="variant='sub' 로그인 후 · 긴 타이틀 말줄임">
                <div className="w-[360px]">
                  <Header
                    variant="sub"
                    isLoggedIn
                    title="긴 메뉴 타이틀이 들어가면 말줄임 처리됩니다 가나다라마바사"
                    onBack={() => console.log('[Header] back')}
                    onLogout={() => console.log('[Header] logout')}
                  />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── BottomNav ───────── */}
          <Section
            id="bottomnav"
            title="BottomNav"
            desc="Figma Tab bar(9300-27700) 1:1. 하단 고정 탭바. 4탭(홈/통합검색/챗봇/마이페이지 — 통합검색↔알림현황 위치 스왑 · 고객센터→챗봇 교체) · 선택 시 상단 4px #0F316E border + #ECF1FA 배경 + navy 색(비선택 transparent border 로 높이 점프 방지) · to 없는 액션 탭(통합검색/챗봇)은 button 렌더 + onAction(id) · 아토믹 인라인 · safe-area-bottom. 실제론 fixed bottom-0 — 미리보기는 프레임 안에 정적 렌더. 라우트 밖(/guide)이라 activeId 로 선택 탭을 강제해 디자인을 보여줌."
          >
            <Row label="기본(홈 active) / 액션 탭">
              <Specimen caption="activeId='home' — 홈 탭 선택 디자인(상단 border + #ECF1FA 배경)">
                <div className="w-[360px] [&>nav]:static! [&>nav]:w-full! [&>nav]:translate-x-0!">
                  <BottomNav activeId="home" />
                </div>
              </Specimen>
              <Specimen caption="액션 탭 클릭 → onAction(id) — 통합검색/챗봇은 라우트 아님(콘솔 확인)">
                <div className="w-[360px] [&>nav]:static! [&>nav]:w-full! [&>nav]:translate-x-0!">
                  <BottomNav activeId="search" onAction={(id) => console.log('[BottomNav]', id)} />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Footer ───────── */}
          <Section
            id="footer"
            title="Footer"
            desc="Figma Footer(9300-27758) 1:1. 페이지 하단 일반 블록(고정 아님). 아코디언(유관기관 바로가기) + Logo(Image 기반) + 기관정보 + SNS + 정책링크 + copyright. 아토믹 인라인 · 동적 부분만 props(relatedSites·snsLinks·policyLinks·defaultAccordionOpen). SNS 브랜드 아이콘은 임시 Material(에셋 확정 시 교체)."
          >
            <Row label="기본 (아코디언 펼침 + SNS 5종)">
              <Specimen caption="defaultAccordionOpen + snsLinks 5개">
                <div className="w-[360px]">
                  <Footer
                    snsLinks={[
                      { type: 'instagram', href: '#' },
                      { type: 'youtube', href: '#' },
                      { type: 'x', href: '#' },
                      { type: 'facebook', href: '#' },
                      { type: 'blog', href: '#' },
                    ]}
                  />
                </div>
              </Specimen>
            </Row>
            <Row label="아코디언 접힘 (defaultAccordionOpen={false})">
              <Specimen caption="유관기관 목록 접힌 상태로 시작">
                <div className="w-[360px]">
                  <Footer defaultAccordionOpen={false} />
                </div>
              </Specimen>
            </Row>
          </Section>

          {/* ───────── Logo ───────── */}
          <Section
            id="logo"
            title="Logo"
            desc="국방전자조달시스템 로고 — Image 베이스 컴포넌트 위에 얹은 브랜드 아톰. size(header 126×21 | footer 196×32) 또는 className 으로 크기 조정. 기본 src 는 placeholder SVG(src/assets/images/logo-datbis.svg) — 실제 브랜드 로고 확정 시 교체."
          >
            <Row label="size 프리셋">
              <Specimen caption='size="header" (126×21, 기본)'>
                <Logo />
              </Specimen>
              <Specimen caption='size="footer" (196×32)'>
                <Logo size="footer" />
              </Specimen>
            </Row>
            <Row label="className 직접 크기">
              <Specimen caption="h-10 w-auto">
                <Logo className="h-10 w-auto" />
              </Specimen>
            </Row>
          </Section>
        </main>
      </div>
    </div>
  )
}

/* ── 내부 레이아웃 헬퍼 ─────────────────────────────── */

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-krds-heading-sm font-bold text-foreground">{children}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// AgreementList 데모 — 상태(checked) 보유. plain=태그 없는 단순 목록.
function AgreementListDemo({
  checkAll = true,
  plain = false,
}: {
  checkAll?: boolean
  plain?: boolean
}) {
  const items = plain
    ? [
        { id: 'a', title: '국방규격 및 계약이행 가능성 확인 동의' },
        { id: 'b', title: '약관동의' },
      ]
    : [
        { id: 'a', title: '국방규격 및 계약이행 가능성 확인 동의', requirement: 'required' as const },
        { id: 'b', title: '약관동의', requirement: 'required' as const },
        { id: 'c', title: '하도급대금의 지급관련 확인 및 확약서', requirement: 'optional' as const },
      ]
  const [checked, setChecked] = useState<string[]>(['a'])
  return (
    <AgreementList
      items={items}
      checked={checked}
      checkAll={checkAll}
      onToggle={(id, on) =>
        setChecked((prev) => (on ? [...new Set([...prev, id])] : prev.filter((v) => v !== id)))
      }
      onCheckAll={(on) => setChecked(on ? items.map((i) => i.id) : [])}
      onView={(id) => console.log('[guide] AgreementList view', id)}
    />
  )
}

interface SectionProps {
  id: string
  title: string
  desc: string
  children: React.ReactNode
}

function Section({ id, title, desc, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="text-krds-heading-xs font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-krds-body-sm text-krds-text-muted">{desc}</p>
      <div className="mt-4 rounded-krds-lg border border-border bg-background px-6">{children}</div>
    </section>
  )
}

interface RowProps {
  label: string
  children: React.ReactNode
}

function Row({ label, children }: RowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 last:border-0 md:flex-row md:gap-6">
      <div className="w-32 shrink-0 pt-1 text-krds-label-sm font-bold text-krds-text-subtle">
        {label}
      </div>
      <div className="flex flex-wrap items-start gap-x-6 gap-y-5">{children}</div>
    </div>
  )
}

interface SpecimenProps {
  caption: string
  children: React.ReactNode
}

function Specimen({ caption, children }: SpecimenProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex min-h-[48px] items-center">{children}</div>
      <code className="text-krds-label-xs text-krds-text-subtle">{caption}</code>
    </div>
  )
}

// WheelPicker 데모 — controlled 라 로컬 상태로 구동.
// mode 로 컬럼 구성: 'year'=년만 · 'month'=년/월 · 'date'=년/월/일.
// 일 컬럼은 선택된 년/월의 실제 일수(28~31, 윤년 반영)만큼만 노출하고,
// 년/월이 바뀌어 일이 말일을 넘으면 클램프한다(실제 Calendar 휠과 동일한 거동).
function WheelPickerDemo({ mode = 'month' }: { mode?: 'date' | 'month' | 'year' }) {
  const withMonth = mode === 'date' || mode === 'month'
  const withDay = mode === 'date'
  const [val, setVal] = useState<Record<string, number>>(
    mode === 'date'
      ? { year: 2025, month: 8, day: 4 }
      : mode === 'month'
        ? { year: 2025, month: 8 }
        : { year: 2025 },
  )
  // new Date(y, m, 0).getDate() = m월(1-based)의 말일 → 윤년 2월(29) 포함 정확.
  const daysInMonth = new Date(val.year, val.month ?? 1, 0).getDate()
  const columns = [
    {
      key: 'year',
      ariaLabel: '연도',
      width: 100,
      // 년만 있는 단일 컬럼(year)일 땐 가운데 정렬, 년/월·년/월/일은 기존 우측 정렬.
      align: mode === 'year' ? ('center' as const) : ('end' as const),
      items: Array.from({ length: 11 }, (_, i) => ({ value: 2016 + i, label: `${2016 + i}년` })),
    },
    ...(withMonth
      ? [
          {
            key: 'month',
            ariaLabel: '월',
            width: 80,
            items: Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` })),
          },
        ]
      : []),
    ...(withDay
      ? [
          {
            key: 'day',
            ariaLabel: '일',
            width: 80,
            items: Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: `${i + 1}일` })),
          },
        ]
      : []),
  ]
  // 년/월 변경 시 day 가 새 달의 말일을 넘으면 클램프(예: 1/31 → 2월 = 28/29일).
  const handleChange = (k: string, v: number) =>
    setVal((p) => {
      const next = { ...p, [k]: v }
      if (withDay && (k === 'year' || k === 'month')) {
        const max = new Date(next.year, next.month, 0).getDate()
        if (next.day > max) next.day = max
      }
      return next
    })
  return (
    <div className="flex flex-col items-center gap-2">
      <WheelPicker columns={columns} value={val} onChange={handleChange} />
      <code className="text-krds-label-xs text-krds-text-subtle">{JSON.stringify(val)}</code>
    </div>
  )
}
