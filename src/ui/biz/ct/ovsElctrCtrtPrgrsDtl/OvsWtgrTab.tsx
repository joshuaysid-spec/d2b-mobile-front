// 국외전자계약진행상세 - '보증서' 탭 콘텐츠 (MUI-CT-01-T73 ovsWtgrTab). 설계서 slide160~161.
// 데이터영역은 보증서 확인팝업(M73)과 동일(dm_ctrtInfo + dm_wtgrInfo)하나 실 API 는 국외 전용(no.341 보증서조회).
import { ctQueries } from '@/queries/bds/ct/ctQueries'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtGrnteInfo } from '@/types/ct'

// 보증서 1건 → 표 행(slide161 dm_wtgrInfo 순서 — M73 팝업과 동일).
function wtgrRows(w: CtrtGrnteInfo): TableRow[] {
  return [
    { label: '계약업체', value: w.ctrtBzentyCd },
    { label: '업체구분', value: w.bzentySeCd },
    { label: '납부방법', value: w.payMthdCd },
    { label: '납부일자', value: w.payYmd },
    { label: '보증서증권번호', value: w.wtgrScrtNo },
    { label: '보증시작일자', value: w.grnteBgngYmd },
    { label: '보증종료일자', value: w.grnteEndYmd },
    { label: '보증금', value: `${w.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '보증기관명', value: w.grnteInstNm },
    { label: '보증금면제사유', value: w.depsExmptnRsnCd ?? '-' },
    { label: '계약일자', value: w.ctrtYmd },
  ]
}

export function OvsWtgrTab({ id }: { id: string }) {
  const { data } = ctQueries.useSelectWtgr(id)

  return (
    <div className="flex flex-col pb-[72px]">
      <Accordion type="multiple" defaultValue={['ctrt', 'wtgr']} className="w-full">
        <AccordionSection value="ctrt" title="계약 정보" borderTop={false}>
          <Table
            rows={[
              { label: '계약번호', value: data?.ctrtInfo.ctrtNo ?? '-' },
              { label: '계약일자', value: data?.ctrtInfo.ctrtYmd ?? '-' },
            ]}
          />
        </AccordionSection>
        <AccordionSection value="wtgr" title="보증서 정보">
          <div className="flex flex-col gap-krds-7">
            {(data?.wtgrInfos ?? []).map((w) => (
              <Table key={w.id} rows={wtgrRows(w)} />
            ))}
          </div>
        </AccordionSection>
      </Accordion>

      <HelpDisclosure
        title="이용안내"
        items={[
          "보증회사에 보증서 발급 요청 시 조회하는 계약번호(계약참조번호)는 'dapa'+계약번호+계약차수 입니다. (Ex. Dapa2008xxx00100)",
        ]}
      />
    </div>
  )
}
OvsWtgrTab.displayName = 'OvsWtgrTab'
