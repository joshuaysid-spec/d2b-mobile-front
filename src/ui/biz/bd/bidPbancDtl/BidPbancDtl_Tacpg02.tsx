// 입찰공고 상세 - '기초예비가격' 탭 (MUI-BD-01-M08, Figma 9300-41466).
// 업무도움(Infobox) + 기초예비가격 산출 항목 테이블. 경쟁입찰일 때만 노출(컨테이너에서 제어).
// 데이터는 목업(추후 bdService.getDetail).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

const PRICE_ROWS: TableRow[] = [
  { label: '기초예비가격', value: '1,000,000 원', type: 'number' },
  { label: '하한(%)', value: '0 %', type: 'number' },
  { label: '상한(%)', value: '0 %', type: 'number' },
  { label: '낙찰하한율', value: '-' },
  { label: '국민건강보험료', value: '1,000,000 원', type: 'number' },
  { label: '국민연금보험료', value: '1,000,000 원', type: 'number' },
  { label: '평가가격금액', value: '1,000,000 원', type: 'number' },
  { label: '토목기초금액', value: '1,000,000 원', type: 'number' },
  { label: '건축기초금액', value: '1,000,000 원', type: 'number' },
  { label: '노무기준율(%)', value: '0 %', type: 'number' },
  { label: '기타경비기준율(%)', value: '0 %', type: 'number' },
  { label: '일반관리비기준비(%)', value: '0 %', type: 'number' },
  { label: '이윤기준율(%)', value: '0 %', type: 'number' },
  { label: '적용난이도계수', value: '-' },
  { label: '요양보험료', value: '1,000,000 원', type: 'number' },
  { label: '산업안전보건관리비', value: '1,000,000 원', type: 'number' },
  { label: '퇴직급여충당금', value: '1,000,000 원', type: 'number' },
  { label: '퇴직공제부금', value: '1,000,000 원', type: 'number' },
  { label: '안전관리비', value: '1,000,000 원', type: 'number' },
  { label: '재료비', value: '1,000,000 원', type: 'number' },
  { label: '노무비', value: '1,000,000 원', type: 'number' },
  { label: '경비', value: '1,000,000 원', type: 'number' },
  { label: '부가가치세', value: '1,000,000 원', type: 'number' },
  { label: '품질관리비', value: '1,000,000 원', type: 'number' },
]

export function BidPbancDtl_Tacpg02() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['price']} className="w-full">
        <AccordionSection value="price" title="기초예비가격" borderTop={false}>
          <Infobox
            title="업무도움"
            items={[
              '기획재정부 계약예규 정부 입찰·계약 집행기준 제2조의5(순공사원가 기준 등의 공고) 및 적격심사기준 제7조(심사방법)에 따라 예정가격이 100억원 미만인 공사의 경우 예정가격 중 재료비·노무비·경비 및 이에 대한 부가가치세를 합산한 금액의 100분의 98미만으로 입찰한 자는 낙찰자로 결정하지 않습니다. (단서신설 ‘20.4.7.)',
            ]}
          />
          <Table rows={PRICE_ROWS} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
BidPbancDtl_Tacpg02.displayName = 'BidPbancDtl_Tacpg02'
