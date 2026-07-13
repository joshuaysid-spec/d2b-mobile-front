// 일반자료실상세 — MUI-CM-04-M26. 공유 RpstrDtlView + 일반자료실 목업(RPSTR_MOCK) 조립.
import { ROUTES } from '@/constants/routes'
import { RpstrDtlView } from './RpstrDtlView'
import { RPSTR_MOCK } from '@/ui/biz/cm/rpstrList/rpstrMock'

export function RpstrDtl() {
  return <RpstrDtlView mock={RPSTR_MOCK} base={ROUTES.SUPPORT_ARCHIVE} deptNm="총무부" />
}
RpstrDtl.displayName = 'RpstrDtl'
