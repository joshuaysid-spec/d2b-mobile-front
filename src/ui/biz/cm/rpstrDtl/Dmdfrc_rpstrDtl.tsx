// 수요부대별자료실상세 — MUI-CM-04-M28. 공유 RpstrDtlView + 수요부대별자료실 목업 조립.
import { ROUTES } from '@/constants/routes'
import { RpstrDtlView } from './RpstrDtlView'
import { DMDFRC_RPSTR_MOCK } from '@/ui/biz/cm/rpstrList/rpstrMock'

export function Dmdfrc_rpstrDtl() {
  return <RpstrDtlView mock={DMDFRC_RPSTR_MOCK} base={ROUTES.SUPPORT_ARCHIVE_DMDFRC} deptNm="군수참모부" />
}
Dmdfrc_rpstrDtl.displayName = 'Dmdfrc_rpstrDtl'
