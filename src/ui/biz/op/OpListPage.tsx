// Design Ref: search-filter.design.md §5 / Figma MUI-OP-01-M02(node 9300-37302) · 설계서 p.8(조달계획 통합목록).
// 본 사이클: 빈 목록 페이지에 [검색필터] 트리거 → 범용 SearchFilter(아코디언 풀팝업) 표시.
// Header / BottomNav 는 AppLayout 제공 → 페이지는 콘텐츠(버튼 + 적용 요약)만 렌더.
// 목록 조회(API)는 주석 스텁(§4) — 백엔드 연동 시 활성화.
import { useState } from 'react'
import dayjs from 'dayjs'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { PageContainer } from '@/ui/common/layout/PageContainer'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  DateRangeValue,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'
import type { OpSearchFilter } from '@/types/op'

const DATE_FORMAT = 'YYYY-MM-DD'

// 조달계획 검색 schema (Figma MUI-OP-01-M02) — 아코디언 5섹션.
const OP_SEARCH: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'srchType',
      title: '검색유형',
      fields: [
        {
          type: 'radio',
          key: 'srchType',
          showIndicator: true, // 검색유형은 원형 라디오(○) 표시 — Figma M02
          options: [
            { value: 'plan', label: '조달계획' },
            { value: 'spec', label: '사전규격' },
            { value: 'annual', label: '연간조달계획' },
          ],
        },
      ],
    },
    // 업무구분 — 다중 선택(가로 스와이프). 코드값은 백엔드 연동 시 확정(현재 잠정).
    {
      key: 'taskSeNm',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSeNm',
          options: [
            { value: 'all', label: '전체' },
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '외자' },
          ],
        },
      ],
    },
    {
      key: 'date',
      title: '일자 설정',
      // TODO: 발주예정월 월 단위(YYYY-MM) 피커로 교체 — date-input 개선 시
      fields: [{ type: 'dateRange', key: 'orderPrnmntYm' }],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'prcmPlanNm', label: '제목', placeholder: '제목을 입력하세요.' },
        { type: 'text', key: 'prcmNo', label: '판단번호', placeholder: '번호를 입력하세요.' },
        // 선택필드(`>`) — 클릭 시 공통팝업(자리만, 팝업 TODO)
        { type: 'selectionField', key: 'rprsItemNm', label: '품명', placeholder: '품명을 입력하세요.' },
        { type: 'selectionField', key: 'deptCd', label: '발주기관', placeholder: '발주기관을 입력하세요.' },
        { type: 'text', key: 'userNm', label: '담당자', placeholder: '담당자를 입력하세요.' },
      ],
    },
    {
      key: 'category',
      title: '구분설정',
      fields: [
        {
          type: 'select',
          key: 'implPrgrsStcd',
          label: '진행상태',
          placeholder: '전체',
          options: [
            { value: 'all', label: '전체' },
            { value: 'plan', label: '조달계획' },
            { value: 'posted', label: '공고게시' },
            { value: 'waiting', label: '계약대기' },
            { value: 'done', label: '계약완료' },
          ],
        },
        // 기능/입찰형태/계약방법 — 옵션 추후 확정(TODO). 현재 '전체'만
        { type: 'select', key: 'inspShcd', label: '기능', placeholder: '전체', options: [{ value: 'all', label: '전체' }] },
        { type: 'select', key: 'bidSecd', label: '입찰형태', placeholder: '전체', options: [{ value: 'all', label: '전체' }] },
        { type: 'select', key: 'ctrtMthdCd', label: '계약방법', placeholder: '전체', options: [{ value: 'all', label: '전체' }] },
      ],
    },
  ],
}

// 초기/초기화 기준값 (검색유형 조달계획 · 발주예정월 최근 1개월 · 나머지 전체/빈값)
const DEFAULT_VALUE: OpSearchFilter = {
  srchType: 'plan',
  taskSeNm: ['all'], // 업무구분 기본 — 전체
  orderPrnmntYm: {
    start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
    end: dayjs().format(DATE_FORMAT),
  },
  prcmPlanNm: '',
  prcmNo: '',
  rprsItemNm: '',
  deptCd: '',
  userNm: '',
  implPrgrsStcd: 'all',
  inspShcd: 'all',
  bidSecd: 'all',
  ctrtMthdCd: 'all',
}

// 적용 필터 요약(검증용) — schema 를 순회해 필드 타입별로 사람이 읽을 값으로 변환(제네릭).
function summarize(
  schema: SearchFilterSchema,
  value: SearchFilterValue,
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = []
  for (const section of schema.sections) {
    for (const field of section.fields) {
      const v = value[field.key]
      let display = ''
      if (field.type === 'radio' || field.type === 'select') {
        display =
          (field.options.find((o) => o.value === v)?.label as string) ??
          String(v ?? '')
      } else if (field.type === 'checkbox') {
        const arr = (v as string[]) ?? []
        display =
          arr
            .map((x) => (field.options.find((o) => o.value === x)?.label as string) ?? x)
            .join(', ') || '(없음)'
      } else if (field.type === 'dateRange') {
        const r = v as DateRangeValue | undefined
        display = r && (r.start || r.end) ? `${r.start} ~ ${r.end}` : '(없음)'
      } else {
        display = (v as string) || '(없음)'
      }
      const label =
        typeof field.label === 'string'
          ? field.label
          : typeof section.title === 'string'
            ? section.title
            : field.key
      rows.push({ label, value: display })
    }
  }
  return rows
}

export function OpListPage() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_VALUE)

  const handleSearch = (value: SearchFilterValue) => {
    setFilter(value)
    // --- API 주석 스텁 (백엔드 연동 시 활성화) ---
    // Design Ref: §4 — services/queries 실구현은 범위 외. onSearch 가 백엔드 경계.
    // services/op.ts: opService.getList(toRequest(value))
    // queries/op.ts : useOpList(value as OpSearchFilter)
    //   const { data } = useOpList(filter)  → 목록 렌더
  }

  return (
    <PageContainer title="조달계획 통합목록">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <Icon name="Search" size={20} aria-hidden />
        검색필터
      </Button>

      {/* 적용 필터 요약 — 검증용. 실제 목록은 API 연동(주석 스텁) 후 렌더 */}
      <dl className="mt-krds-8 flex flex-col gap-krds-4 rounded-krds-8 border border-krds-border-divider p-krds-6">
        <p className="text-krds-body-sm font-bold text-krds-text-subtle">적용된 검색 조건</p>
        {summarize(OP_SEARCH, filter).map((row) => (
          <div key={row.label} className="flex gap-krds-5 text-krds-body-md">
            <dt className="w-[80px] shrink-0 text-krds-text-subtle">{row.label}</dt>
            <dd className="min-w-0 flex-1 break-words text-krds-text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={OP_SEARCH}
        value={filter}
        defaultValue={DEFAULT_VALUE}
        onSearch={handleSearch}
      />
    </PageContainer>
  )
}
