// 상업계약서상세 - '계약대상' 탭 콘텐츠 (MUI-CT-01-T79 ovsCmbzCtrdocDtl_Trgt). 설계서 slide181·183.
// 계약담당 공무원 + 계약 상대자(dm_ctrtRlt) + 무역대리점-연대보증인.
import { ctQueries } from '@/queries/bds/ct/queries'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table } from '@/ui/common/composites/Table'

export function OvsCmbzCtrdocDtl_Trgt({ id }: { id: string }) {
  const { data } = ctQueries.useSelectOvsCmbzTrgt(id)

  if (!data) return null

  return (
    <Accordion type="multiple" defaultValue={['ofcctr', 'bzenty', 'agent']} className="w-full">
      {/* 계약담당 공무원 */}
      <AccordionSection value="ofcctr" title="계약담당 공무원" borderTop={false}>
        <Table rows={[{ label: '구분', value: data.ofcctrNm }]} />
      </AccordionSection>
      {/* 계약 상대자 (dm_ctrtRlt) */}
      <AccordionSection value="bzenty" title="계약 상대자">
        <Table
          rows={[
            { label: '상호', value: data.bzenty.ctrtBzentyNm },
            { label: '주소', value: data.bzenty.ctrtBzentyAddr },
            { label: '대표자', value: data.bzenty.rprsvNm },
            { label: '연락처 TEL', value: data.bzenty.ctrtBzentyEntlno },
            { label: '연락처 FAX', value: data.bzenty.ctrtBzentyFxno },
            { label: '사업자등록번호', value: data.bzenty.enbrno },
            { label: 'DUNS NO.', value: data.bzenty.dunsNo ?? '-' },
          ]}
        />
      </AccordionSection>
      {/* 무역대리점 - 연대보증인 (없으면 미표시) */}
      {data.agent && (
        <AccordionSection value="agent" title="무역대리점 - 연대보증인">
          <Table
            rows={[
              { label: '상호', value: data.agent.bzentyNm },
              { label: '주소', value: data.agent.bzentyAddr },
              { label: '연락처 TEL', value: data.agent.bzentyEntlno },
              { label: '연락처 FAX', value: data.agent.bzentyFxno },
            ]}
          />
        </AccordionSection>
      )}
    </Accordion>
  )
}
OvsCmbzCtrdocDtl_Trgt.displayName = 'OvsCmbzCtrdocDtl_Trgt'
