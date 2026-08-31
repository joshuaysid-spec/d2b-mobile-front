// 수요부대별공지사항(공지사항 목록) — MUI-CM-04-M27. 공용 BoardListView + noticeBoard config + 공유 목업.
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { BoardListView } from '@/ui/biz/cm/board/BoardListView'
import {
  NOTICE_SEARCH_SCHEMA_WITH_CATEGORY,
  NOTICE_SEARCH_TARGETS,
  NOTICE_DEFAULT_WITH_CATEGORY,
  noticeToCard,
  noticeMatchKeyword,
  noticeMatchFilter,
  noticeIsPinned,
} from './noticeBoard'
import { DMDFRC_NOTICE_MOCK } from './noticeMock'

export function Dmdfrc_NoticeListPage() {
  const navigate = useNavigate()
  return (
    <BoardListView
      list={DMDFRC_NOTICE_MOCK}
      getId={(it) => it.contsNo}
      toCard={noticeToCard}
      matchKeyword={noticeMatchKeyword}
      matchFilter={noticeMatchFilter}
      isPinned={noticeIsPinned}
      searchTargets={NOTICE_SEARCH_TARGETS}
      searchSchema={NOTICE_SEARCH_SCHEMA_WITH_CATEGORY}
      defaultFilter={{ ...NOTICE_DEFAULT_WITH_CATEGORY }}
      onCardClick={(it) => navigate(ROUTES.SUPPORT_NOTICE_DMDFRC_DETAIL, { state: it })}
      emptyText="공지사항이 없습니다."
    />
  )
}
Dmdfrc_NoticeListPage.displayName = 'Dmdfrc_NoticeListPage'
