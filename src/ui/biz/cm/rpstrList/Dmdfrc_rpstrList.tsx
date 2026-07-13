// 수요부대별자료실(자료실 목록) — MUI-CM-04-M27. 공용 BoardListView + rpstrBoard config + 공유 목업.
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
import { DMDFRC_RPSTR_MOCK } from './rpstrMock'

export function Dmdfrc_rpstrList() {
  const navigate = useNavigate()
  return (
    <BoardListView
      list={DMDFRC_RPSTR_MOCK}
      getId={(it) => it.contsNo}
      toCard={rpstrToCard}
      matchKeyword={rpstrMatchKeyword}
      searchTargets={RPSTR_SEARCH_TARGETS}
      searchSchema={RPSTR_SEARCH_SCHEMA}
      defaultFilter={{ ...RPSTR_DEFAULT }}
      onCardClick={(it) => navigate(`${ROUTES.SUPPORT_ARCHIVE_DMDFRC}/${it.contsNo}`, { state: it })}
      emptyText="자료가 없습니다."
    />
  )
}
Dmdfrc_rpstrList.displayName = 'Dmdfrc_rpstrList'
