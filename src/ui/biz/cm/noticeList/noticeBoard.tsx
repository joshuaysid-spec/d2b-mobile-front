// 공지사항(일반/방위사업청/수요부대별 — MUI-CM-04-M01·M21·M23) 공용 config.
// 세 화면은 데이터영역(dl_resultList) 항목명·검색조건이 동일하므로 schema·카드매핑·검색로직을 공유한다.
// 각 화면(NoticeListPage / D2b_NoticeListPage / Dmdfrc_NoticeListPage)은 이 config + 자기 목업만 주입.
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import type { CardListItem } from '@/ui/common/composites/CardList'
import type {
  SearchFilterSchema,
  SearchFilterSection,
  SearchFilterValue,
  DateRangePresetDef,
  DateRangeValue,
} from '@/types/search-filter'
import type { NoticeListItem, NoticeSearchFilter } from '@/types/mock/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

// 빠른설정 프리셋 — 설계서(최근 1/3/6개월).
const NOTICE_DATE_PRESETS: DateRangePresetDef[] = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

// 상태(emrg) 옵션 — 긴급/일반(설계서 데이터영역 emrg). 'all'=전체(기본).
export const NOTICE_STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '긴급', label: '긴급' },
  { value: '일반', label: '일반' },
]

// '구분 설정' 섹션(설계서 slide226) — 필드 라벨 '상태', 긴급/일반 구분(key=emrg). select(전체+긴급+일반).
const NOTICE_CATEGORY_SECTION: SearchFilterSection = {
  key: 'category',
  title: '구분 설정',
  fields: [
    {
      type: 'select',
      key: 'emrg',
      label: '상태',
      placeholder: '전체',
      options: NOTICE_STATUS_OPTIONS,
    },
  ],
}

// 검색필터 schema(기본) — 기간설정(작성일자, 필수) + 검색어(제목/내용/작성자). 구분 설정 미노출(방위사업청 공지 등).
export const NOTICE_SEARCH_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '기간 설정',
      fields: [
        {
          type: 'dateRange',
          key: 'regDt',
          label: '작성일자',
          required: true,
          presets: NOTICE_DATE_PRESETS,
        },
      ],
    },
    {
      key: 'keyword',
      title: '검색어',
      fields: [
        { type: 'text', key: 'bbsTtl', label: '제목', placeholder: '제목을 입력하세요.' },
        { type: 'text', key: 'bbsCn', label: '내용', placeholder: '내용을 입력하세요.' },
        { type: 'text', key: 'wrtrNm', label: '작성자', placeholder: '작성자를 입력하세요.' },
      ],
    },
  ],
}

// 구분 설정 포함 변형(순서: 기간 → 검색어 → 구분 설정, 요청 2026-07-27) — 일반/수요부대별 공지(MUI-CM-04-M01·M23).
export const NOTICE_SEARCH_SCHEMA_WITH_CATEGORY: SearchFilterSchema = {
  ...NOTICE_SEARCH_SCHEMA,
  sections: [
    ...NOTICE_SEARCH_SCHEMA.sections, // 기간 설정 + 검색어
    NOTICE_CATEGORY_SECTION, // 구분 설정 (검색어 아래로)
  ],
}

// On-Load: 작성일자를 한달전~현재일로 기본값 설정(설계서 이벤트 설명).
export const RECENT_1M = (): DateRangeValue => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})
export const NOTICE_DEFAULT: NoticeSearchFilter = {
  regDt: RECENT_1M(),
  bbsTtl: '',
  bbsCn: '',
  wrtrNm: '',
}
// 구분 설정 포함 화면의 기본/초기화 값 — 상태(emrg)는 '전체'.
export const NOTICE_DEFAULT_WITH_CATEGORY: NoticeSearchFilter = {
  ...NOTICE_DEFAULT,
  emrg: 'all',
}

// 상단 빠른검색 대상 칩(single — 제목/내용, 기본 제목). 값 = 검색 필드명.
export const NOTICE_SEARCH_TARGETS = [
  { value: 'bbsTtl', label: '제목' },
  { value: 'bbsCn', label: '내용' },
]

// 카드 매핑(설계서 slide216 표시레이블): 배지 긴급(emrg)+구분(bizFldCd) + 제목 + 담당부서/작성자/작성일자/첨부.
export const noticeToCard = (it: NoticeListItem): Omit<CardListItem, 'id' | 'onClick'> => ({
  badges: (
    <>
      <Badge type="pastel" color={it.emrg === '긴급' ? 'red' : 'blue'}>
        {it.emrg}
      </Badge>
      <Badge type="pastel" color="blue">
        {it.bizFldCd}
      </Badge>
    </>
  ),
  title: it.bbsTtl,
  rows: [
    { label: '담당부서', value: it.tkcgDeptNm },
    { label: '작성자', value: it.wrtrNm },
    { label: '작성일자', value: it.regDt },
  ],
})

// 상단 검색어 필터 — 제목(bbsTtl). 내용(bbsCn)은 목록 목업에 본문이 없어 제목으로 대체(API 연동 시 매핑).
export const noticeMatchKeyword = (it: NoticeListItem, keyword: string) =>
  it.bbsTtl.toLowerCase().includes(keyword.toLowerCase())

// 상세필터 '구분 설정 > 상태'(emrg 긴급/일반) 부합 여부 — 미선택/'all'=전체 통과. (API 연동 시 서버 조회로 대체)
export const noticeMatchFilter = (it: NoticeListItem, filter: SearchFilterValue) => {
  const st = filter.emrg as string | undefined
  return !st || st === 'all' || it.emrg === st
}

// 상위고정(upFix='Y') → 목록 상단 고정.
export const noticeIsPinned = (it: NoticeListItem) => it.upFix === 'Y'

// 목업 부풀리기 — 보유 seed 를 total 건으로. contsNo/no 고유화, 첫 건만 상위고정 유지.
export function inflateNotice(seeds: NoticeListItem[], total: number): NoticeListItem[] {
  return Array.from({ length: total }, (_, i) => {
    const base = seeds[i % seeds.length]
    return {
      ...base,
      no: i + 1,
      contsNo: String(101 + i).padStart(6, '0'),
      upFix: i === 0 ? base.upFix : 'N',
    }
  })
}
