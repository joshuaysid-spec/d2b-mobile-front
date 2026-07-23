// 물품수정계약명세서 풀팝업 — MUI-CT-01-P13 CmdtyMdfcnCtrdocDtst. 설계서 slide93~97.
// 수정계약 상세(M06)의 바로가기 '계약명세서 조회'에서 진입.
// 구성: 계약정보 + 수정항목 + 계약품목정보(총 N건, 반복) + 계약품목 합계 + footer 닫기.
import { useParams } from 'react-router-dom'

import { useCmdtyMdfcnCtrdocDtst } from '@/queries/ct'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtMdfcnDtstItem } from '@/types/ct'

export interface CmdtyMdfcnCtrdocDtstFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** 값이 있을 때만 행 포함. */
function optionalRow(label: string, value?: string): TableRow[] {
  return value === undefined || value === '' ? [] : [{ label, value }]
}

// 품목 1건 → 표 행(slide93·96 계약품목정보 순서).
function itemRows(it: CtrtMdfcnDtstItem): TableRow[] {
  return [
    { label: '순번', value: String(it.rnum), type: 'number' },
    { label: '구분', value: it.se },
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '군급 재고번호', value: it.invtNo ?? '-' },
    { label: '군구분', value: it.prcmRqtInstCd },
    { label: '품명', value: it.fscCd },
    { label: '예산구분', value: it.bgtCd },
    ...optionalRow('사업 ID', it.biz),
    ...optionalRow('단위', it.unitCd),
    ...(it.ctrtQty !== undefined
      ? [{ label: '수량', value: it.ctrtQty.toLocaleString(), type: 'number' as const }]
      : []),
    ...(it.itemAmt !== undefined
      ? [{ label: '금액', value: `${it.itemAmt.toLocaleString()} 원`, type: 'number' as const }]
      : []),
    ...(it.ctrtUntprc !== undefined
      ? [{ label: '단가', value: `${it.ctrtUntprc.toLocaleString()} 원`, type: 'number' as const }]
      : []),
    ...optionalRow('규격번호', it.spcfctNo),
    ...(it.plcdlvQty !== undefined
      ? [{ label: '납지별수량', value: it.plcdlvQty.toLocaleString(), type: 'number' as const }]
      : []),
    ...(it.qtyIcdcDsctn !== undefined
      ? [
          {
            label: '증감내역(수량)',
            value: `+ ${it.qtyIcdcDsctn.toLocaleString()}`,
            type: 'number' as const,
          },
        ]
      : []),
    ...(it.amtIcdcDsctn !== undefined
      ? [
          {
            label: '증감내역(금액)',
            value: `+ ${it.amtIcdcDsctn.toLocaleString()} 원`,
            type: 'number' as const,
          },
        ]
      : []),
    ...optionalRow('검사형태', it.inspShp),
    ...optionalRow('납기', it.dudt),
    ...optionalRow('납지', it.plcdlv),
  ]
}

export function CmdtyMdfcnCtrdocDtstFullPopup({
  open,
  onOpenChange,
}: CmdtyMdfcnCtrdocDtstFullPopupProps) {
  const { id = '' } = useParams()
  const { data } = useCmdtyMdfcnCtrdocDtst(id, open)
  const items = data?.items ?? []

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="물품수정계약명세서"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        {/* 계약정보 (slide95 1.1) */}
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3">계약정보</SectionTitle>
          <div className="px-4">
            <Table
              rows={[
                { label: '계약번호', value: data?.ctrtInfo.ctrtNo ?? '-' },
                { label: '수정계약차수', value: data?.ctrtInfo.mdfcnCtrtCycl ?? '-' },
                { label: '계약명', value: data?.ctrtInfo.ctrtNm ?? '-' },
                { label: '업체명', value: data?.ctrtInfo.bzentyNm ?? '-' },
                { label: '수정항목', value: data?.mdfcnArtclNm ?? '-' },
              ]}
            />
          </div>
        </section>

        {/* 계약품목정보 (slide96 1.3 — 반복) */}
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" topDivider info={`총 ${items.length}건`}>
            계약품목정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {items.map((it) => (
              <Table key={it.id} rows={itemRows(it)} />
            ))}
          </div>
        </section>

        {/* 계약품목 합계 (slide94) */}
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" topDivider>
            계약품목 합계
          </SectionTitle>
          <div className="px-4">
            <Table
              rows={[
                {
                  label: '수량 합계',
                  value: data ? data.sums.sumCtrtQty.toLocaleString() : '-',
                  type: 'number',
                },
                {
                  label: '금액 합계',
                  value: data ? `${data.sums.sumCtrtAmt.toLocaleString()} 원` : '-',
                  type: 'number',
                },
                {
                  label: '증감내역(수량) 합계',
                  value: data ? `+ ${data.sums.sumQqtyIcdcDsctn.toLocaleString()}` : '-',
                  type: 'number',
                },
                {
                  label: '증감내역(금액) 합계',
                  value: data ? `+ ${data.sums.sumAmtIcdcDsctn.toLocaleString()} 원` : '-',
                  type: 'number',
                },
              ]}
            />
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
CmdtyMdfcnCtrdocDtstFullPopup.displayName = 'CmdtyMdfcnCtrdocDtstFullPopup'
