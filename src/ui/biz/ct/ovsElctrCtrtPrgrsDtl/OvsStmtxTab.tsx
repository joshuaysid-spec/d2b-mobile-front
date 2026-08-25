// 국외전자계약진행상세 - '인지세' 탭 콘텐츠 (MUI-CT-01-T74 ovsStmtxTab). 설계서 slide162~163.
// 데이터영역은 인지세 확인팝업(M74)과 동일(dm_ctrtInfo + dl_stmtxPayInfo + dm_payAmt)하나
// 실 API 는 국외 전용(no.345 인지세납부목록조회).
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCtrtStmtxPayInfo } from '@/types/mock/ct'

// 납부정보 1건 → 표 행(slide163 dl_stmtxPayInfo 순서 — M74 팝업과 동일).
function payInfoRows(p: MockCtrtStmtxPayInfo): TableRow[] {
  return [
    { label: '계약번호', value: p.ctrtNo },
    { label: '사용여부', value: p.useYn },
    { label: '업체코드', value: p.bzentyCd },
    { label: '업체명', value: p.bzentyNm },
    { label: '사업자번호', value: p.enbrno },
    { label: '납부번호', value: p.payNo },
    { label: '납부일자', value: p.payYmd },
    { label: '납부금액', value: `${p.payAmt.toLocaleString()} 원`, type: 'number' },
    { label: '비고', value: p.rmrkCn ?? '-' },
  ]
}

export function OvsStmtxTab({ id }: { id: string }) {
  const { data } = ctQueries.useSelectStmtxPayList(id)

  return (
    <div className="flex flex-col pb-[72px]">
      <Accordion type="multiple" defaultValue={['ctrt', 'pay', 'amt']} className="w-full">
        <AccordionSection value="ctrt" title="계약 정보" borderTop={false}>
          <Table
            rows={[
              { label: '계약년도', value: data?.ctrtInfo.ctrtYr ?? '-' },
              { label: '계약번호', value: data?.ctrtInfo.ctrtNo ?? '-' },
              { label: '계약차수', value: data?.ctrtInfo.ctrtOd ?? '-' },
            ]}
          />
        </AccordionSection>
        <AccordionSection value="pay" title="인지세 정보">
          <div className="flex flex-col gap-krds-7">
            {(data?.payInfos ?? []).map((p) => (
              <Table key={p.id} rows={payInfoRows(p)} />
            ))}
          </div>
        </AccordionSection>
        <AccordionSection value="amt" title="납부금액 정보">
          <Table
            rows={[
              {
                label: '납부대상액',
                value: data ? `${data.payAmt.payTrgtAmt.toLocaleString()} 원` : '-',
                type: 'number',
              },
              {
                label: '납부액',
                value: data ? `${data.payAmt.payAmt.toLocaleString()} 원` : '-',
                type: 'number',
              },
              {
                label: '부족액',
                value: data ? `${data.payAmt.unpaidAmt.toLocaleString()} 원` : '-',
                type: 'number',
              },
            ]}
          />
        </AccordionSection>
      </Accordion>

      <HelpDisclosure
        title="유의사항"
        items={[
          '[인지세 납부방법] 인지세 납부는 전자수입인지구매 또는 기획재정부 전자수입인지 구매사이트(www.edoc-revenuestamp.or.kr)에서 가능합니다.',
          '[필독] 기획재정부에 납부하신 경우 전자수입인지구매 버튼 클릭 시 구매요청서에서 기납부금액 확인 후 닫기를 하셔야 정상납부처리가 됩니다.',
          '[인지세 환급방법] PC 버전 - 국외 > 인지세관리 - 인지세 미사용 관리 탭에서 환급처리를 할 수 있습니다. 전산처리 후 환급은 관할세무서에서 가능합니다.',
          '인지세 업무는 PC 버전에서 사용할 수 있습니다.',
        ]}
      />
    </div>
  )
}
OvsStmtxTab.displayName = 'OvsStmtxTab'
