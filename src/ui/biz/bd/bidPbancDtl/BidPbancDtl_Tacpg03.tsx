// 입찰공고 상세 - '품목명세서' 탭 (MUI-BD-01-M09, Figma 9300-41867).
// 품목 명세 테이블(군급-재고번호는 '보기' 버튼). 업무구분 [물품]일 때만 노출(컨테이너에서 제어).
// 데이터는 목업(추후 bdService.getDetail).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'

const ITEM_ROWS: TableRow[] = [
  { label: '순번', value: '1', type: 'number' },
  { label: '품보형태', value: '소요군검사' },
  { label: '조달요구번호', value: 'MB201639962A001' },
  { label: '규격번호', value: '-' },
  { label: '규격종류', value: '-' },
  { label: '단위', value: '-' },
  { label: '수량', value: '1', type: 'number' },
  {
    label: '군급-재고번호',
    value: (
      <div className="flex items-center justify-between gap-2">
        <span>4240-3753116870</span>
        <Button
          size="sm"
          variant="inner"
          onClick={() => console.log('[M09] 군급-재고번호 보기')}
        >
          보기
        </Button>
      </div>
    ),
    type: 'combination',
  },
  { label: '부품번호', value: '-' },
  { label: '적용장비명', value: '-' },
  { label: '납지', value: '-' },
  { label: '단가', value: '31,608,000.00 원', type: 'number' },
  { label: '품명', value: '풋살경기장 인조잔디 제조-설치 납품' },
  { label: '참조번호', value: '-' },
  { label: '예산구분', value: '-' },
  { label: '납기', value: '2026-12-15' },
  { label: '금액', value: '31,608,000.00 원', type: 'number' },
]

export function BidPbancDtl_Tacpg03() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['item']} className="w-full">
        <AccordionSection value="item" title="품목명세서 (순번 1)" borderTop={false}>
          <Table rows={ITEM_ROWS} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
BidPbancDtl_Tacpg03.displayName = 'BidPbancDtl_Tacpg03'
