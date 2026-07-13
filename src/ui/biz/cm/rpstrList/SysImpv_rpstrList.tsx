// 시스템개선안내(자료실 목록) — MUI-CM-04-M31. 자료실 그룹이나 항목명은 공지형(bbsTtl/wrtrNm/inqCnt).
// 검색조건은 공지형(bbsTtl/bbsCn/wrtrNm)이라 noticeBoard schema/타깃/기본값 재사용. 목업은 rpstrMock(SYSIMPV_MOCK).
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Badge } from '@/ui/common/base/Badge'
import { BoardListView } from '@/ui/biz/cm/board/BoardListView'
import type { CardListItem } from '@/ui/common/composites/CardList'
import {
  NOTICE_SEARCH_SCHEMA,
  NOTICE_SEARCH_TARGETS,
  NOTICE_DEFAULT,
} from '@/ui/biz/cm/noticeList/noticeBoard'
import { SYSIMPV_MOCK } from '@/ui/biz/cm/rpstrList/rpstrMock'
import type { SysImpvListItem } from '@/types/notice'

// 카드 매핑: 배지 구분(bizFldCd) + 제목(bbsTtl) + 작성자(wrtrNm)/작성일자(regDt).
const toCard = (it: SysImpvListItem): Omit<CardListItem, 'id' | 'onClick'> => ({
  badges: (
    <Badge type="pastel" color="blue">
      {it.bizFldCd}
    </Badge>
  ),
  title: it.bbsTtl,
  rows: [
    { label: '작성자', value: it.wrtrNm },
    { label: '작성일자', value: it.regDt },
  ],
})
const matchKeyword = (it: SysImpvListItem, keyword: string) =>
  it.bbsTtl.toLowerCase().includes(keyword.toLowerCase())

export function SysImpv_rpstrList() {
  const navigate = useNavigate()
  return (
    <BoardListView
      list={SYSIMPV_MOCK}
      getId={(it) => it.contsNo}
      toCard={toCard}
      matchKeyword={matchKeyword}
      searchTargets={NOTICE_SEARCH_TARGETS}
      searchSchema={NOTICE_SEARCH_SCHEMA}
      defaultFilter={{ ...NOTICE_DEFAULT }}
      onCardClick={(it) => navigate(`${ROUTES.SUPPORT_SYS_IMPV}/${it.contsNo}`, { state: it })}
      emptyText="자료가 없습니다."
    />
  )
}
SysImpv_rpstrList.displayName = 'SysImpv_rpstrList'
