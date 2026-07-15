// 공지사항(일반/방위사업청/수요부대별 — MUI-CM-04-M01·M21·M23) 공용 config.
// 세 화면은 데이터영역(dl_resultList) 항목명·검색조건이 동일하므로 schema·카드매핑·검색로직을 공유한다.
// 각 화면(NoticeListPage / D2b_NoticeListPage / Dmdfrc_NoticeListPage)은 이 config + 자기 목업만 주입.
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import type { CardListItem } from '@/ui/common/composites/CardList'
import type {
  SearchFilterSchema,
  DateRangePresetDef,
  DateRangeValue,
} from '@/types/search-filter'
import type { NoticeListItem, NoticeSearchFilter } from '@/types/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

// 빠른설정 프리셋 — 설계서(최근 1/3/6개월) + 기간검색(직접 지정).
const NOTICE_DATE_PRESETS: DateRangePresetDef[] = [
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
  { label: '기간검색', custom: true },
]

// 검색필터 schema — 구분설정(bizFldCd)은 요청에 따라 제외. 기간설정(작성일자, 필수) + 검색어(제목/내용/작성자).
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
