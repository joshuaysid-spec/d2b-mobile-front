// 수요부대별공지사항상세 — MUI-CM-04-M24. 공유 NoticeDtlView + 수요부대별 목업 조립.
import { ROUTES } from '@/constants/routes'
import { NoticeDtlView } from './NoticeDtlView'
import { DMDFRC_NOTICE_MOCK } from '@/ui/biz/cm/noticeList/noticeMock'

export function Dmdfrc_NoticeDtlPage() {
  return <NoticeDtlView mock={DMDFRC_NOTICE_MOCK} base={ROUTES.SUPPORT_NOTICE_DMDFRC} />
}
Dmdfrc_NoticeDtlPage.displayName = 'Dmdfrc_NoticeDtlPage'
