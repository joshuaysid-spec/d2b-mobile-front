// 계약관련서식자료실상세 — MUI-CM-04-M30. 공유 RpstrDtlView + 계약관련서식자료실 목업 조립.
import { ROUTES } from '@/constants/routes'
import { RpstrDtlView } from './RpstrDtlView'
import { CTRT_RPSTR_MOCK } from '@/ui/biz/cm/rpstrList/rpstrMock'

export function Ctrt_rpstrDtl() {
  return <RpstrDtlView mock={CTRT_RPSTR_MOCK} base={ROUTES.SUPPORT_ARCHIVE_CTRT} deptNm="계약관리과" />
}
Ctrt_rpstrDtl.displayName = 'Ctrt_rpstrDtl'
