// 국외전자계약진행상세 - '계좌정보' 탭 콘텐츠 (MUI-CT-01-T72 ovsBacntInfoTab). 설계서 slide156~159.
// 섹션 5개: 계약 정보 · 계약 업체 · 계좌정보 · 지정운송인정보 · 제조사정보 — 전부 조회 전용 표.
import { ctQueries } from '@/queries/bds/ct/ctQueries'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table } from '@/ui/common/composites/Table'

export function OvsBacntInfoTab({ id }: { id: string }) {
  const { data } = ctQueries.useSelectBacntInfo(id)

  if (!data) return null

  return (
    <Accordion
      type="multiple"
      defaultValue={['ctrt', 'bzenty', 'bacnt', 'ptr', 'mkr']}
      className="w-full"
    >
      {/* 계약 정보 (dm_ctrtInfo) */}
      <AccordionSection value="ctrt" title="계약 정보" borderTop={false}>
        <Table
          rows={[
            { label: '계약번호', value: data.ctrtInfo.ctrtNo },
            { label: '발주기관', value: data.ctrtInfo.orderInstNm },
            { label: '계약건명', value: data.ctrtInfo.crtrNm },
            { label: '집행유형', value: data.ctrtInfo.bizTypeCd },
          ]}
        />
      </AccordionSection>
      {/* 계약 업체 (dm_ctrtBzentyInfo) */}
      <AccordionSection value="bzenty" title="계약 업체">
        <Table
          rows={[
            { label: '업체명', value: data.bzentyInfo.ctrtBzentyNm },
            { label: '사업자등록번호', value: data.bzentyInfo.enbrno },
            { label: '대표자', value: data.bzentyInfo.rprsvNm },
            { label: '업체주소', value: data.bzentyInfo.bzentyAddr },
            { label: '간이주소', value: data.bzentyInfo.bzentyAddr2 ?? '-' },
          ]}
        />
      </AccordionSection>
      {/* 계좌정보 (dm_bacntInfo) */}
      <AccordionSection value="bacnt" title="계좌정보">
        <Table
          rows={[
            { label: '은행코드', value: data.bacntInfo.fnstCd },
            { label: '은행사업자번호', value: data.bacntInfo.fnstEnbrno },
            { label: '은행명', value: data.bacntInfo.fnstNm },
            { label: '결재방식', value: data.bacntInfo.atrzMthCd },
            { label: '예금주', value: data.bacntInfo.dpstrNm },
            { label: '계좌실명번호', value: data.bacntInfo.bacntRlnmNo ?? '-' },
            { label: '계좌번호', value: data.bacntInfo.enacno },
          ]}
        />
      </AccordionSection>
      {/* 지정운송인정보 (dm_dsgnPtr) */}
      <AccordionSection value="ptr" title="지정운송인정보">
        <Table
          rows={[
            { label: '지정운송인', value: data.dsgnPtr?.dsgnPtrNm ?? '-' },
            { label: '운송인주소', value: data.dsgnPtr?.ptrAddr ?? '-' },
            { label: '운송인전화번호', value: data.dsgnPtr?.ptrEntlno ?? '-' },
            { label: '운송인팩스번호', value: data.dsgnPtr?.ptrFxno ?? '-' },
          ]}
        />
      </AccordionSection>
      {/* 제조사정보 (dm_mkrPtr) */}
      <AccordionSection value="mkr" title="제조사정보">
        <Table
          rows={[
            { label: '제조사명', value: data.mkrPtr?.mkrNm ?? '-' },
            { label: '제조사국가', value: data.mkrPtr?.mkrNtnNm ?? '-' },
          ]}
        />
      </AccordionSection>
    </Accordion>
  )
}
OvsBacntInfoTab.displayName = 'OvsBacntInfoTab'
