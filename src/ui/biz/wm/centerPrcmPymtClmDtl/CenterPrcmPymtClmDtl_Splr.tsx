// 대금청구 상세(중앙조달) - '공급자정보' 탭 콘텐츠 (MUI-WM-01-T06). 설계서 05.대금청구및사후 v0.83 slide40, 43.
// 공급자 정보 Table + SMS 수신번호 안내문구.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCenterPrcmPymtClmDtl } from '@/types/mock/wm'

export interface CenterPrcmPymtClmDtl_SplrProps {
  detail: MockCenterPrcmPymtClmDtl
}

export function CenterPrcmPymtClmDtl_Splr({ detail }: CenterPrcmPymtClmDtl_SplrProps) {
  // ── 공급자정보 (dmt_splrInfo, slide43 1.3) ────────────────────────────────
  const splrRows: TableRow[] = [
    { label: '상호(업체명)', value: detail.bzentyNm },
    { label: '대표명', value: detail.rprsvNm },
    { label: '청구인성명', value: detail.clmtNm },
    { label: '연락처', value: detail.clmtTelno },
    { label: 'SMS 수신번호', value: detail.enmtno },
    { label: '주소', value: detail.bzentyAddr },
  ]

  return (
    <Accordion type="multiple" defaultValue={['splr']} className="w-full">
      <AccordionSection value="splr" title="공급자 정보" borderTop={false}>
        <div className="flex flex-col gap-krds-5">
          <Table rows={splrRows} />
          {/* SMS 수신번호 안내(slide40) */}
          <p className="text-krds-body-sm text-krds-text-muted">
            * SMS 수신번호는 [SMS 서비스신청] 시 등록된 번호가 자동으로 입력됩니다.
          </p>
        </div>
      </AccordionSection>
    </Accordion>
  )
}
CenterPrcmPymtClmDtl_Splr.displayName = 'CenterPrcmPymtClmDtl_Splr'
