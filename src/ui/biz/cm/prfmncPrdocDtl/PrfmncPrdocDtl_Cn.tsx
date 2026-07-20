// 실적증명서 확인(상세) — 계약정보 탭 (MUI-CM-04-T01). 설계서 00.공통 v0.84 slide244 ·
// 항목 설명 slide266 1.2(dm_ctrtInfo). 표/필드는 데이터(rows) 구동 — API 연동 시 목업만 교체.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PrfmncPrdocCtrtInfo } from '@/types/cm'

// 목업 — slide244 표시값 그대로 (추후 API: 상세 조회 dm_ctrtInfo)
const CTRT_INFO: PrfmncPrdocCtrtInfo = {
  ctrtNo: '98765432101',
  CtrtOd: '00',
  ctrtCnNm: '물품',
  ctrtNm: '휴지',
  rprsItemNm: '휴지',
  ctrtAmt: 10000000,
  orderInstNm: '방위사업청',
  picNm: '대령/운영자',
  enPicTel: '02-1234-5678',
}

// 계약정보 표 행 — 라벨은 slide244 화면 표기 그대로
const CTRT_ROWS: TableRow[] = [
  { label: '계약번호(차수)', value: `${CTRT_INFO.ctrtNo}(${CTRT_INFO.CtrtOd})` },
  { label: '계약구분', value: CTRT_INFO.ctrtCnNm },
  { label: '계약건명/대표물품', value: CTRT_INFO.ctrtNm },
  { label: '계약금액(원)', value: `${CTRT_INFO.ctrtAmt.toLocaleString()} 원`, type: 'number' },
  { label: '발주기관', value: CTRT_INFO.orderInstNm },
]

// 계약담당관(연락처) 표 행
const PIC_ROWS: TableRow[] = [
  { label: '기관 부서명', value: CTRT_INFO.orderInstNm },
  { label: '담당자', value: CTRT_INFO.picNm },
  { label: '연락처', value: CTRT_INFO.enPicTel },
]

export function PrfmncPrdocDtl_Cn() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['ctrt', 'pic']}>
        <AccordionSection value="ctrt" title="계약정보" borderTop={false}>
          <Table rows={CTRT_ROWS} />
        </AccordionSection>
        <AccordionSection value="pic" title="계약담당관(연락처)">
          <Table rows={PIC_ROWS} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocDtl_Cn.displayName = 'PrfmncPrdocDtl_Cn'
