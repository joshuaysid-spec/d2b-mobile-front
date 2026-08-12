// 계약관련서식자료실(자료실 목록) — MUI-CM-04-M29. 공용 BoardListView + rpstrBoard config + 공유 목업.
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { BoardListView } from '@/ui/biz/cm/board/BoardListView'
import {
  RPSTR_SEARCH_SCHEMA,
  RPSTR_SEARCH_TARGETS,
  RPSTR_DEFAULT,
  rpstrToCard,
  rpstrMatchKeyword,
} from './rpstrBoard'
import { CTRT_RPSTR_MOCK } from './rpstrMock'

export function Ctrt_rpstrList() {
  const navigate = useNavigate()
  return (
    <BoardListView
      list={CTRT_RPSTR_MOCK}
      getId={(it) => it.contsNo}
      toCard={rpstrToCard}
      matchKeyword={rpstrMatchKeyword}
      searchTargets={RPSTR_SEARCH_TARGETS}
      searchSchema={RPSTR_SEARCH_SCHEMA}
      defaultFilter={{ ...RPSTR_DEFAULT }}
      onCardClick={(it) => navigate(ROUTES.SUPPORT_ARCHIVE_CTRT_DETAIL, { state: it })}
      emptyText="자료가 없습니다."
    />
  )
}
Ctrt_rpstrList.displayName = 'Ctrt_rpstrList'
