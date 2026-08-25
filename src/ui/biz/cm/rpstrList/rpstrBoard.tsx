// 자료실(일반/수요부대별/계약관련서식 — MUI-CM-04-M25·M27·M29) 공용 config.
// 세 화면은 데이터영역(dl_resultList)·검색조건이 동일하므로 schema·카드매핑·검색로직을 공유한다.
// 공지사항과 달리 긴급·상위고정·담당부서 없음. 제목=rpstrTtl·작성자=rgtrId·조회=inqNocs(설계서 slide220~222).
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import type { CardListItem } from '@/ui/common/composites/CardList'
import type {
  SearchFilterSchema,
  DateRangePresetDef,
  DateRangeValue,
} from '@/types/search-filter'
import type { MockRpstrListItem, MockRpstrSearchFilter } from '@/types/mock/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

const RPSTR_DATE_PRESETS: DateRangePresetDef[] = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
]

// 검색필터 schema — 기간설정(작성일자, 필수) + 검색어(제목 rpstrTtl/내용 contsCn/작성자 wrtrNm).
// 구분 설정(bizFldCd)은 자료실에는 미노출(요청, 2026-07-27) — 공지사항 목록에만 적용.
export const RPSTR_SEARCH_SCHEMA: SearchFilterSchema = {
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
          presets: RPSTR_DATE_PRESETS,
        },
      ],
    },
    {
      key: 'keyword',
      title: '검색어',
      fields: [
        { type: 'text', key: 'rpstrTtl', label: '제목', placeholder: '제목을 입력하세요.' },
        { type: 'text', key: 'contsCn', label: '내용', placeholder: '내용을 입력하세요.' },
        { type: 'text', key: 'wrtrNm', label: '작성자', placeholder: '작성자를 입력하세요.' },
      ],
    },
  ],
}

export const RECENT_1M = (): DateRangeValue => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})
export const RPSTR_DEFAULT: MockRpstrSearchFilter = {
  regDt: RECENT_1M(),
  rpstrTtl: '',
  contsCn: '',
  wrtrNm: '',
}

// 상단 빠른검색 대상 칩(single — 제목/내용, 기본 제목). 값 = 검색 필드명.
export const RPSTR_SEARCH_TARGETS = [
  { value: 'rpstrTtl', label: '제목' },
  { value: 'contsCn', label: '내용' },
]

// 카드 매핑: 배지 구분(bizFldCd) + 제목(rpstrTtl) + 작성자(rgtrId)/작성일자(regDt)/첨부. (긴급·담당부서 없음)
export const rpstrToCard = (it: MockRpstrListItem): Omit<CardListItem, 'id' | 'onClick'> => ({
  badges: (
    <Badge type="pastel" color="blue">
      {it.bizFldCd}
    </Badge>
  ),
  title: it.rpstrTtl,
  rows: [
    { label: '작성자', value: it.rgtrId },
    { label: '작성일자', value: it.regDt },
  ],
})

// 상단 검색어 필터 — 제목(rpstrTtl). 내용(contsCn)은 목록 목업에 본문이 없어 제목으로 대체.
export const rpstrMatchKeyword = (it: MockRpstrListItem, keyword: string) =>
  it.rpstrTtl.toLowerCase().includes(keyword.toLowerCase())

// 목업 부풀리기 — 보유 seed 를 total 건으로. contsNo/no 고유화.
export function inflateRpstr(seeds: MockRpstrListItem[], total: number): MockRpstrListItem[] {
  return Array.from({ length: total }, (_, i) => {
    const base = seeds[i % seeds.length]
    return { ...base, no: i + 1, contsNo: String(101 + i).padStart(6, '0') }
  })
}
