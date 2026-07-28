// 국외 입찰서 상세 — 탭3 입찰참여품목 (MUI-BD-06-T77(구 M77 — v1.83 재편) 단가제 · MUI-BD-06-T78(구 M78 — v1.83 재편) 총액제, 설계서 slide377~378 · 항목설명 slide382~383).
// 단가제/총액제를 한 파일에서 분기(alonbsYn) — 설계서 화면목록(slide326)의 파일 중복 지정은 오기라 Tab3 로 정리.
//   단가제(M77): 품목 목록(dl_ititbBidCnList) — 항목당 아코디언(내역 펼쳐보기/접기) + 구분/내용 표 + 더보기(10개씩).
//   총액제(M78): 입찰 품목(dl_alonbsItemList) 목록 + 입찰내역(dl_alonbsBidCnInfo) 단건 표.
// 항목명(영문)·코드값(As it is/Replace, Y/N, 'O' 표시) 설계서 그대로. 데이터는 목업 — 추후 API: bdService.getOvsTndrItemList.
// 첨부문서 '보기' 는 첨부문서조회 팝업(UI-BD-05-P76, 타 유닛) 연계 예정 — console.log 스텁.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 입찰참여품목(단가제) 1건 (dl_ititbBidCnList, 설계서 slide382) — 항목명(영문) 설계서 그대로.
interface OvsItitbBidCnItem {
  frcptlArtclNo: string // 항목번호(5)
  invtNo: string // 재고번호(9)
  prtsNo: string // 부품번호(32)
  itemNm: string // 품명(200)
  unitNm: string // 단위(2)
  qty: string // 수량(15)
  drctnUntprc: string // 지시단가(25)
  crncNm: string // 화폐단위(100)
  itemSbstSe: string // 품목대체구분(1) — As it is / Replace
  itemSbstDocEn: 'O' | '' // 품목대체첨부문서 — 있으면 'O', 그 외 표시 없음
  mdfcnInvtNo: string // 수정재고번호(13)
  mdfcnPrtsNo: string // 수정부품번호(32)
  moqYn: 'Y' | 'N' // MOQ구분(1)
  moqQty: string // MOQ수량(15)
  moqDocEn: 'O' | '' // MOQ첨부문서 — 있으면 'O', 그 외 표시 없음
  bscbgtDudtYmd: string // 납기(본조)(8)
  athrtDudtYmd: string // 납기(당국)(8)
  ltbndDudtYmd: string // 납기(장국)(8)
  usdExrt: string // 달러환산율(15)
  bdngTccrUntprc: string // 입찰단가(25)
  bdngTccrAmt: string // 입찰금액(25)
  bdngUsdUntprc: string // 달러단가(25)
  bdngUsdAmt: string // 달러금액(25)
}

// 단가제 목업 — 설계서 slide377 예시값 기반 12건(더보기 확인용). 추후 API 응답으로 교체.
const ITITB_BASE: Omit<OvsItitbBidCnItem, 'frcptlArtclNo'> = {
  invtNo: '101537518',
  prtsNo: 'T-80U/TBE-3',
  itemNm: '500MD 헬기 수리부속',
  unitNm: 'EA',
  qty: '1',
  drctnUntprc: '608,000.00',
  crncNm: '미 달러',
  itemSbstSe: 'Replace',
  itemSbstDocEn: 'O',
  mdfcnInvtNo: '101537519',
  mdfcnPrtsNo: 'T-80U/TBE-3R',
  moqYn: 'Y',
  moqQty: '1',
  moqDocEn: 'O',
  bscbgtDudtYmd: '2025-03-25',
  athrtDudtYmd: '2025-03-25',
  ltbndDudtYmd: '2025-03-25',
  usdExrt: '1.0000',
  bdngTccrUntprc: '608,000.00',
  bdngTccrAmt: '608,000.00',
  bdngUsdUntprc: '608,000.00',
  bdngUsdAmt: '608,000.00',
}
const ITITB_TOTAL = 12
const MOCK_ITITB_LIST: OvsItitbBidCnItem[] = Array.from({ length: ITITB_TOTAL }, (_, i) => ({
  ...ITITB_BASE,
  frcptlArtclNo: String(i + 1),
  // 짝수 항목은 원안(As it is)·첨부 없음으로 변형 — 'O'/보기 버튼 유무 확인용.
  ...(i % 2 === 1
    ? { itemSbstSe: 'As it is', itemSbstDocEn: '' as const, mdfcnInvtNo: '', mdfcnPrtsNo: '', moqYn: 'N' as const, moqQty: '', moqDocEn: '' as const }
    : {}),
}))

// 입찰품목(총액제) 1건 (dl_alonbsItemList, 설계서 slide383).
interface OvsAlonbsItem {
  frcptlArtclNo: string // 항목번호(5)
  invtNo: string // 재고번호(9)
  prtsNo: string // 부품번호(32)
  itemNm: string // 품명(200)
  unitNm: string // 단위(2)
  qty: string // 수량(15)
}

// 총액제 목업 — 설계서 slide378 예시값 기반.
const MOCK_ALONBS_ITEM_LIST: OvsAlonbsItem[] = [
  { frcptlArtclNo: '1', invtNo: '101537518', prtsNo: 'T-80U/TBE-3', itemNm: '500MD 헬기 수리부속', unitNm: 'EA', qty: '1' },
  { frcptlArtclNo: '2', invtNo: '101537520', prtsNo: 'T-80U/TBE-5', itemNm: '500MD 로터 블레이드', unitNm: 'EA', qty: '2' },
  { frcptlArtclNo: '3', invtNo: '101537521', prtsNo: 'T-80U/TBE-7', itemNm: '500MD 엔진 필터', unitNm: 'EA', qty: '4' },
]

// 입찰내역(총액제) (dl_alonbsBidCnInfo, 설계서 slide383) — 단건.
const MOCK_ALONBS_BID_CN = {
  splyBzentyNm: 'FB해외업체', // 입찰업체(200)
  crncNm: 'USD', // 화폐단위(100)
  bdngTccrAmt: '608,000.00', // 입찰금액(25)
  bdngUsdAmt: '608,000.00', // 달러금액(25)
  usdExrt: '1.0000', // 달러환산율(15)
}

// 첨부문서 표시 셀 — 'O' 면 O + [보기] 버튼(첨부문서조회 팝업 UI-BD-05-P76 연계 예정), 아니면 '-'.
const docCell = (en: 'O' | '', onView: () => void) =>
  en === 'O' ? (
    <div className="flex items-center justify-between gap-2">
      <span>O</span>
      <Button size="sm" variant="inner" onClick={onView}>
        보기
      </Button>
    </div>
  ) : (
    '-'
  )

// 단가제 품목 1건 → 구분/내용 표 rows (설계서 slide377 노출 순서 그대로).
function buildItitbRows(it: OvsItitbBidCnItem): TableRow[] {
  return [
    { label: '항목번호', value: it.frcptlArtclNo },
    { label: '재고번호', value: it.invtNo },
    { label: '부품번호', value: it.prtsNo },
    { label: '품명', value: it.itemNm },
    { label: '단위', value: it.unitNm },
    { label: '수량', value: it.qty, type: 'number' },
    { label: '지시단가', value: it.drctnUntprc, type: 'number' },
    { label: '품목대체구분', value: it.itemSbstSe },
    {
      label: '품목대체첨부문서',
      value: docCell(it.itemSbstDocEn, () =>
        console.log('[M77] 품목대체첨부문서 조회', it.frcptlArtclNo),
      ), // 추후 첨부문서조회 팝업(UI-BD-05-P76)
      type: it.itemSbstDocEn === 'O' ? 'combination' : 'default',
    },
    { label: '수정재고번호', value: it.mdfcnInvtNo || '-' },
    { label: '수정부품번호', value: it.mdfcnPrtsNo || '-' },
    { label: 'MOQ구분', value: it.moqYn },
    { label: 'MOQ수량', value: it.moqQty || '-', type: it.moqQty ? 'number' : 'default' },
    {
      label: 'MOQ첨부문서',
      value: docCell(it.moqDocEn, () => console.log('[M77] MOQ첨부문서 조회', it.frcptlArtclNo)), // 추후 첨부문서조회 팝업(UI-BD-05-P76)
      type: it.moqDocEn === 'O' ? 'combination' : 'default',
    },
    { label: '납기(본조)', value: it.bscbgtDudtYmd },
    { label: '납기(당국)', value: it.athrtDudtYmd },
    { label: '납기(장국)', value: it.ltbndDudtYmd },
    { label: '달러환산율', value: `${it.usdExrt} USD`, type: 'number' },
    { label: '입찰단가', value: it.bdngTccrUntprc, type: 'number' },
    { label: '입찰금액', value: it.bdngTccrAmt, type: 'number' },
    { label: '화폐단위', value: it.crncNm },
    { label: '달러단가', value: it.bdngUsdUntprc, type: 'number' },
    { label: '달러금액', value: it.bdngUsdAmt, type: 'number' },
  ]
}

// 총액제 품목 1건 → 구분/내용 표 rows (설계서 slide378).
function buildAlonbsItemRows(it: OvsAlonbsItem): TableRow[] {
  return [
    { label: '항목번호', value: it.frcptlArtclNo },
    { label: '재고번호', value: it.invtNo },
    { label: '부품번호', value: it.prtsNo },
    { label: '품명', value: it.itemNm },
    { label: '단위', value: it.unitNm },
    { label: '수량', value: it.qty, type: 'number' },
  ]
}

const ALONBS_BID_CN_ROWS: TableRow[] = [
  { label: '입찰업체', value: MOCK_ALONBS_BID_CN.splyBzentyNm },
  { label: '화폐단위', value: MOCK_ALONBS_BID_CN.crncNm },
  { label: '입찰금액', value: MOCK_ALONBS_BID_CN.bdngTccrAmt, type: 'number' },
  { label: '달러금액', value: MOCK_ALONBS_BID_CN.bdngUsdAmt, type: 'number' },
  { label: '달러환산율', value: `${MOCK_ALONBS_BID_CN.usdExrt} USD`, type: 'number' },
]

const PAGE_SIZE = 10 // 더보기 10개씩(설계서 slide377 "더보기(10/100)")

// ── 단가제 (M77) ─────────────────────────────────────────────────────────────
function ItitbList() {
  const [page, setPage] = useState(1)
  const total = MOCK_ITITB_LIST.length
  const loaded = Math.min(page * PAGE_SIZE, total)
  const visible = MOCK_ITITB_LIST.slice(0, loaded)

  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[M77] 품목 목록 더보기') // 추후 API: bdService.getOvsTndrItemList(page+1)
  }

  return (
    <>
      <p className="px-4 pb-krds-5 text-krds-body-sm text-krds-text-primary-active">
        품목 목록 · 총 {total}건
      </p>
      {/* 항목당 아코디언 — 접힘 헤더가 '내역 펼쳐보기', 펼침이 '내역 접기' 역할(설계서 slide377). 첫 건만 펼침. */}
      <Accordion type="multiple" defaultValue={[MOCK_ITITB_LIST[0].frcptlArtclNo]} className="w-full">
        {visible.map((it, i) => (
          <AccordionSection
            key={it.frcptlArtclNo}
            value={it.frcptlArtclNo}
            title={`${it.frcptlArtclNo}. ${it.itemNm}`}
            borderTop={i > 0}
          >
            <Table rows={buildItitbRows(it)} />
          </AccordionSection>
        ))}
      </Accordion>
      {loaded < total && (
        <div className="px-4 pb-4 pt-krds-7">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}
    </>
  )
}

// ── 총액제 (M78) ─────────────────────────────────────────────────────────────
function AlonbsList() {
  const [page, setPage] = useState(1)
  const total = MOCK_ALONBS_ITEM_LIST.length
  const loaded = Math.min(page * PAGE_SIZE, total)
  const visible = MOCK_ALONBS_ITEM_LIST.slice(0, loaded)

  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[M78] 입찰 품목 더보기') // 추후 API: bdService.getOvsTndrItemList(page+1)
  }

  return (
    <>
      <p className="px-4 pb-krds-5 text-krds-body-sm text-krds-text-primary-active">
        입찰 품목 · 총 {total}건
      </p>
      <Accordion
        type="multiple"
        defaultValue={MOCK_ALONBS_ITEM_LIST.map((it) => it.frcptlArtclNo)}
        className="w-full"
      >
        {visible.map((it, i) => (
          <AccordionSection
            key={it.frcptlArtclNo}
            value={it.frcptlArtclNo}
            title={`${it.frcptlArtclNo}. ${it.itemNm}`}
            borderTop={i > 0}
          >
            <Table rows={buildAlonbsItemRows(it)} />
          </AccordionSection>
        ))}
      </Accordion>
      {loaded < total && (
        <div className="px-4 pb-4 pt-krds-7">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}
      {/* 입찰내역 — 총액제 단건(설계서 slide378) */}
      <Accordion type="multiple" defaultValue={['bidCn']} className="w-full">
        <AccordionSection value="bidCn" title="입찰내역">
          <Table rows={ALONBS_BID_CN_ROWS} />
        </AccordionSection>
      </Accordion>
    </>
  )
}

export interface Tab3Props {
  /** 총액제 여부 — 'Y' 총액제(M78) / 'N' 단가제(M77). ⚠️ 설계서 미정의 임시 구동값(OvsTndrDtlItem.alonbsYn) */
  alonbsYn: 'Y' | 'N'
}

export function Tab3({ alonbsYn }: Tab3Props) {
  return alonbsYn === 'Y' ? <AlonbsList /> : <ItitbList />
}
Tab3.displayName = 'Tab3'
