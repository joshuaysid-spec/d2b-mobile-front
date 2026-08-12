// 물품계약명세서 풀팝업 — MUI-CT-01-P11 CmdtyCtrtDtst (Figma 10020-155376). 설계서 slide87~90.
// 바로가기 바텀시트 '계약명세서'에서 진입(slide31 계약명세서조회 클릭 — 물품 진행상세는 P11).
// P14 물품일반계약명세서(slide98~99)는 데이터영역이 P11 과 동일 — title 만 바꿔 재사용한다.
// 구성: 계약정보 Table + 계약품목정보(총 N건, 품목별 반복 Table) + footer 닫기.
import { useCmdtyCtrtDtst } from '@/queries/ct'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtDtstItem } from '@/types/ct'

export interface CmdtyCtrtDtstFullPopupProps {
  /** 계약 식별자 — 부모 상세 페이지가 navigate state 에서 받아 전달. */
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 팝업 타이틀 — 기본 '물품계약명세서'(P11). P14 재사용 시 '물품일반계약명세서'. */
  title?: string
}

/** 값이 있을 때만 행 포함 — 260623 추가 항목(군급-재고번호·부품번호·적용장비·단가·참조번호)용. */
function optionalRow(label: string, value?: string): TableRow[] {
  return value === undefined || value === '' ? [] : [{ label, value }]
}

// 품목 1건 → 표 행(slide88~89 계약 품목정보 순서).
function itemRows(it: CtrtDtstItem): TableRow[] {
  return [
    { label: '순번', value: String(it.rnum), type: 'number' },
    { label: '항목번호', value: it.clsfNo },
    { label: '예산구분', value: it.bgtCd },
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '품명', value: it.fscCd },
    { label: '규격번호', value: it.spcfctNo },
    { label: '규격종류', value: it.spcfctKndCd },
    { label: '단위', value: it.unitCd },
    { label: '수량', value: it.ctrtQty.toLocaleString(), type: 'number' },
    ...optionalRow('군급-재고번호', it.invtNo),
    ...optionalRow('부품번호', it.prtsNo),
    ...optionalRow('적용장비', it.aplyEqpmnt),
    { label: '납지', value: it.plcdlv },
    ...(it.ctrtUntprc !== undefined
      ? [{ label: '단가', value: `${it.ctrtUntprc.toLocaleString()} 원`, type: 'number' as const }]
      : []),
    ...optionalRow('참조번호', it.flrplnNo),
    { label: '납지별수량', value: it.dlvQty.toLocaleString(), type: 'number' },
    { label: '납기', value: it.dudt },
    { label: '금액', value: `${it.itemAmt.toLocaleString()} 원`, type: 'number' },
  ]
}

export function CmdtyCtrtDtstFullPopup({
  id,
  open,
  onOpenChange,
  title = '물품계약명세서',
}: CmdtyCtrtDtstFullPopupProps) {
  const { data } = useCmdtyCtrtDtst(id, open)
  const items = data?.items ?? []

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col">
        {/* 계약정보 (slide88 1.1) */}
        <section className="flex flex-col">
          <SectionTitle as="h3">계약정보</SectionTitle>
          <div className="px-4 pb-krds-8">
            <Table
              rows={[
                {
                  label: '계약번호',
                  value: data ? `${data.ctrtInfo.ctrtNo} (${data.ctrtInfo.ctrtCycl})` : '-',
                },
                { label: '판단번호', value: data?.ctrtInfo.prcmNo ?? '-' },
                { label: '발주기관', value: data?.ctrtInfo.orderInstNm ?? '-' },
                { label: '계약명', value: data?.ctrtInfo.ctrtNm ?? '-' },
                { label: '집행유형', value: data?.ctrtInfo.bizTpcd ?? '-' },
                {
                  label: '계약금액',
                  value: data ? `${data.ctrtInfo.ctrtAmt.toLocaleString()} 원` : '-',
                  type: 'number',
                },
                {
                  label: '일반예산금액',
                  value: data ? `${data.ctrtInfo.bscbgtCtrtAmt.toLocaleString()} 원` : '-',
                  type: 'number',
                },
                {
                  label: '국채금액',
                  value: data ? `${data.ctrtInfo.govbndCtrtAmt.toLocaleString()} 원` : '-',
                  type: 'number',
                },
              ]}
            />
          </div>
        </section>

        {/* 계약품목정보 (slide88 1.2 — 품목별 반복) */}
        <section className="flex flex-col">
          <SectionTitle as="h3" topDivider info={`총 ${items.length}건`}>
            계약품목정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-8 px-4 pb-krds-8">
            {items.map((it) => (
              <Table key={it.id} rows={itemRows(it)} />
            ))}
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
CmdtyCtrtDtstFullPopup.displayName = 'CmdtyCtrtDtstFullPopup'
