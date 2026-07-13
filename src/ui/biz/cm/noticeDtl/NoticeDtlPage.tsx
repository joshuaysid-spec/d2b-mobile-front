// 일반공지사항상세 — MUI-CM-04-M02. 공유 NoticeDtlView + 일반공지 목업(NOTICE_MOCK) 조립.
import { ROUTES } from '@/constants/routes'
import { NoticeDtlView } from './NoticeDtlView'
import { NOTICE_MOCK } from '@/ui/biz/cm/noticeList/noticeMock'

export function NoticeDtlPage() {
  return <NoticeDtlView mock={NOTICE_MOCK} base={ROUTES.SUPPORT_NOTICE} />
}
NoticeDtlPage.displayName = 'NoticeDtlPage'
