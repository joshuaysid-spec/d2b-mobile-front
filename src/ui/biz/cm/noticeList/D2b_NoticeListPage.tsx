// 방위사업청공지사항(공지사항 목록) — MUI-CM-04-M21. 공용 BoardListView + noticeBoard config + 공유 목업.
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { BoardListView } from '@/ui/biz/cm/board/BoardListView'
import {
  NOTICE_SEARCH_SCHEMA,
  NOTICE_SEARCH_TARGETS,
  NOTICE_DEFAULT,
  noticeToCard,
  noticeMatchKeyword,
  noticeIsPinned,
} from './noticeBoard'
import { D2B_NOTICE_MOCK } from './noticeMock'

export function D2b_NoticeListPage() {
  const navigate = useNavigate()
  return (
    <BoardListView
      list={D2B_NOTICE_MOCK}
      getId={(it) => it.contsNo}
      toCard={noticeToCard}
      matchKeyword={noticeMatchKeyword}
      isPinned={noticeIsPinned}
      searchTargets={NOTICE_SEARCH_TARGETS}
      searchSchema={NOTICE_SEARCH_SCHEMA}
      defaultFilter={{ ...NOTICE_DEFAULT }}
      onCardClick={(it) => navigate(`${ROUTES.SUPPORT_NOTICE_DAPA}/${it.contsNo}`, { state: it })}
      emptyText="공지사항이 없습니다."
    />
  )
}
D2b_NoticeListPage.displayName = 'D2b_NoticeListPage'
