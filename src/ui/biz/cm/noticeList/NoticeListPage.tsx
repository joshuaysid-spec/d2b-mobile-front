// 일반공지사항(공지사항 목록) — MUI-CM-04-M01. Figma 10020-82108 / 설계서 00.공통 v0.83 slide216·217.
// 공용 BoardListView + 공지사항 config(noticeBoard) + 공유 목업(noticeMock) 조립.
// 카드 클릭 시 상세(NoticeDtlPage)로 이동하며 클릭 항목을 navigate state 로 전달(목록→상세 데이터 전달).
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
import { NOTICE_MOCK } from './noticeMock'

export function NoticeListPage() {
  const navigate = useNavigate()
  return (
    <BoardListView
      list={NOTICE_MOCK}
      getId={(it) => it.contsNo}
      toCard={noticeToCard}
      matchKeyword={noticeMatchKeyword}
      isPinned={noticeIsPinned}
      searchTargets={NOTICE_SEARCH_TARGETS}
      searchSchema={NOTICE_SEARCH_SCHEMA}
      defaultFilter={{ ...NOTICE_DEFAULT }}
      onCardClick={(it) => navigate(`${ROUTES.SUPPORT_NOTICE}/${it.contsNo}`, { state: it })}
      emptyText="공지사항이 없습니다."
    />
  )
}
NoticeListPage.displayName = 'NoticeListPage'
