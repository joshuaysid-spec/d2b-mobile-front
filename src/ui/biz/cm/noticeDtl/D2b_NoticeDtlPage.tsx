// 방위사업청공지사항상세 — MUI-CM-04-M26. 공유 NoticeDtlView + 방위사업청 목업 조립.
import { ROUTES } from '@/constants/routes'
import { NoticeDtlView } from './NoticeDtlView'
import { D2B_NOTICE_MOCK } from '@/ui/biz/cm/noticeList/noticeMock'

export function D2b_NoticeDtlPage() {
  return <NoticeDtlView mock={D2B_NOTICE_MOCK} base={ROUTES.SUPPORT_NOTICE_DAPA} />
}
D2b_NoticeDtlPage.displayName = 'D2b_NoticeDtlPage'
