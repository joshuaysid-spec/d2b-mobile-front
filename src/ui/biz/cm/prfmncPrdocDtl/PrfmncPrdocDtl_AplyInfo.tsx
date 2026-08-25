// 실적증명서 확인(상세) — 신청정보 탭 · 부대+비시설공사(T11, MUI-CM-04-T11).
// 설계서 00.공통 v0.84 slide271(화면) · 항목 설명 slide290(1.34 추가사항 dm_prfmncPrdocAplyAddMttrInfo).
// 표/필드는 데이터 구동. 신청정보는 공통 사항(사용목적·연락처·제출처·발급수량) 모두 표시.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockPrfmncPrdocAddMttrInfo } from '@/types/mock/cm'

const won = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 원`)

// ── 목업 (설계서 표시값 그대로 — API 연동 시 교체) ───────────────────────────
const ADD: MockPrfmncPrdocAddMttrInfo = {
  prfmncYr1: '2021',
  prfmncYr2: '2023',
  prfmncSeCd: '계약목적과 동등이상물품',
  PrfmncDmndRt: 10,
  PrfmncDmndAmt: 10000000000,
  spcfct: '규격',
  dlvgdsYmd: '2023-01-01',
  unitNm: '톤',
  prfmncQty: 10,
  scl: '10 EA',
  lbsvcScp: '용역범위 및 기준 내용',
  etcCn: '비고사항 내용',
}

const ADD_ROWS: TableRow[] = [
  { label: '실적년도', value: `${ADD.prfmncYr1 ?? '-'} ~ ${ADD.prfmncYr2 ?? '-'}` },
  { label: '실적구분', value: ADD.prfmncSeCd ?? '-' },
  { label: '실적비율(%)', value: ADD.PrfmncDmndRt != null ? `${ADD.PrfmncDmndRt} %` : '-' },
  { label: '실적금액', value: won(ADD.PrfmncDmndAmt), type: 'number' },
  { label: '규격(품질, 성능통)', value: ADD.spcfct ?? '-' },
  { label: '납품일자', value: ADD.dlvgdsYmd ?? '-' },
  { label: '단위', value: ADD.unitNm ?? '-' },
  { label: '수량', value: ADD.prfmncQty != null ? ADD.prfmncQty.toLocaleString() : '-', type: 'number' },
  { label: '규모', value: ADD.scl ?? '-' },
  { label: '용역범위 및 기준 (면적, 금액(원) 등)', value: ADD.lbsvcScp ?? '-' },
  { label: '비고', value: ADD.etcCn ?? '-' },
]

const APLY_ROWS: TableRow[] = [
  { label: '사용목적', value: '기타 - 실적확인용' },
  { label: '신청인 연락처', value: '02-1234-5678' },
  { label: '제출처', value: '방위사업청' },
  { label: '발급수량', value: '1부' },
]

export function PrfmncPrdocDtl_AplyInfo() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['add', 'aply']}>
        <AccordionSection value="add" title="추가사항" borderTop={false}>
          <Table rows={ADD_ROWS} />
        </AccordionSection>
        <AccordionSection value="aply" title="신청정보">
          <Table rows={APLY_ROWS} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocDtl_AplyInfo.displayName = 'PrfmncPrdocDtl_AplyInfo'
