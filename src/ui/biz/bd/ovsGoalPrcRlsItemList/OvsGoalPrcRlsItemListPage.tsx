// 목표가공개품목조회 (MUI-BD-01-M75, 설계서 slide299·300 / 영문 OvsGoalPrcRlsItemListPage).
// 홈 > 입찰 공고 > 목표가공개품목조회 — 국외 입찰공고의 목표가공개 품목 목록을 On-Load 로 조회(scwin.onpageload).
// 설계서상 별도 검색조건 없음(진입 즉시 목록) — 목록헤더(총건수·표시개수) + 카드 리스트 + 더보기 + 맨위로 FAB.
// 레퍼런스: BidPbancIntgListPage(목록 조립)·OvsExchrtListFullPopup(국외 조회성 화면 톤).
// 데이터는 목업(dl_resultList, 설계서 항목명/형식 그대로) — 추후 bdService.selectGoalPrcRlsItemList 로 대체.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 조회결과 1건 (dl_resultList, 설계서 slide300 항목설명 표)
export interface OvsGoalPrcRlsItem {
  frcptlArtclNo: string // 항목번호 (5)
  invtNo: string // 재고번호 (9)
  prtsNo: string // 부품번호 (32)
  spcfctNo: string // 규격번호 (20)
  itemNm: string // 품명 (200)
  dudtYmd: string // 납기기준일자 (8, YYYY-MM-DD 표기)
  unitNm: string // 단위 (2)
  bscbgtQty: number // 본조수량 — 국가 예산 수량
  athrtQty: number // 당국수량 — 당해년도 국채 수량
  ltbndQty: number // 장국수량 — 장기국채 수량
  bscbgtDrctnAmt: number // 본조예산 — 국가 예산
  athrtDrctnAmt: number // 당국예산 — 당해년도 국채 예산
  ltbndDrctnAmt: number // 장국예산 — 장기국채 예산
  sumQty: number // 수량합계 (본조수량+당국수량+장국수량)
  drctnUntprc: number // 지시단가
  drctnAmt: number // 지시금액
  aplcnEqpmntCd: string // 장비부호 (8)
  aplcnEqpmntNm: string // 장비명 (100)
}

// 금액(예산·단가·금액) 표기 — 설계서 예시 '1,000.00' / '3,000.00' (소수 2자리).
const formatAmt = (n: number) =>
  n.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// 목업 기본 행 — 설계서 slide299 예시행(COLLAR,BREECH RING·발칸 20미리) 기반 실전형 값.
const dl_resultListBase: Omit<OvsGoalPrcRlsItem, 'frcptlArtclNo' | 'invtNo'>[] = [
  {
    prtsNo: '59108730001-P400',
    spcfctNo: 'MIL-DTL-45932',
    itemNm: 'COLLAR,BREECH RING',
    dudtYmd: '2026-12-13',
    unitNm: 'EA',
    bscbgtQty: 10,
    athrtQty: 10,
    ltbndQty: 10,
    bscbgtDrctnAmt: 1_000.0,
    athrtDrctnAmt: 1_000.0,
    ltbndDrctnAmt: 1_000.0,
    sumQty: 30,
    drctnUntprc: 100,
    drctnAmt: 3_000.0,
    aplcnEqpmntCd: '33100401',
    aplcnEqpmntNm: '발칸 20미리',
  },
  {
    prtsNo: '7791079',
    spcfctNo: 'MIL-B-46176B',
    itemNm: 'BARREL,GUN,20MM',
    dudtYmd: '2026-11-30',
    unitNm: 'EA',
    bscbgtQty: 6,
    athrtQty: 4,
    ltbndQty: 2,
    bscbgtDrctnAmt: 4_200.0,
    athrtDrctnAmt: 2_800.0,
    ltbndDrctnAmt: 1_400.0,
    sumQty: 12,
    drctnUntprc: 700,
    drctnAmt: 8_400.0,
    aplcnEqpmntCd: '33100401',
    aplcnEqpmntNm: '발칸 20미리',
  },
  {
    prtsNo: '12977844-P100',
    spcfctNo: 'MIL-P-45662A',
    itemNm: 'PIN,FIRING',
    dudtYmd: '2027-01-20',
    unitNm: 'EA',
    bscbgtQty: 50,
    athrtQty: 30,
    ltbndQty: 20,
    bscbgtDrctnAmt: 2_500.0,
    athrtDrctnAmt: 1_500.0,
    ltbndDrctnAmt: 1_000.0,
    sumQty: 100,
    drctnUntprc: 50,
    drctnAmt: 5_000.0,
    aplcnEqpmntCd: '33100401',
    aplcnEqpmntNm: '발칸 20미리',
  },
  {
    prtsNo: '10554321-A200',
    spcfctNo: 'MIL-H-46855',
    itemNm: 'HOUSING,RECOIL MECHANISM',
    dudtYmd: '2027-03-05',
    unitNm: 'EA',
    bscbgtQty: 3,
    athrtQty: 2,
    ltbndQty: 1,
    bscbgtDrctnAmt: 9_000.0,
    athrtDrctnAmt: 6_000.0,
    ltbndDrctnAmt: 3_000.0,
    sumQty: 6,
    drctnUntprc: 3_000,
    drctnAmt: 18_000.0,
    aplcnEqpmntCd: '33200105',
    aplcnEqpmntNm: 'K-55 자주포',
  },
  {
    prtsNo: '11734289',
    spcfctNo: 'MIL-V-24578',
    itemNm: 'VALVE,SOLENOID',
    dudtYmd: '2026-10-15',
    unitNm: 'EA',
    bscbgtQty: 8,
    athrtQty: 8,
    ltbndQty: 4,
    bscbgtDrctnAmt: 1_600.0,
    athrtDrctnAmt: 1_600.0,
    ltbndDrctnAmt: 800.0,
    sumQty: 20,
    drctnUntprc: 200,
    drctnAmt: 4_000.0,
    aplcnEqpmntCd: '33200105',
    aplcnEqpmntNm: 'K-55 자주포',
  },
  {
    prtsNo: '8448291-P300',
    spcfctNo: 'MIL-C-83488',
    itemNm: 'CABLE ASSEMBLY,SPECIAL PURPOSE',
    dudtYmd: '2026-09-28',
    unitNm: 'EA',
    bscbgtQty: 15,
    athrtQty: 10,
    ltbndQty: 5,
    bscbgtDrctnAmt: 3_750.0,
    athrtDrctnAmt: 2_500.0,
    ltbndDrctnAmt: 1_250.0,
    sumQty: 30,
    drctnUntprc: 250,
    drctnAmt: 7_500.0,
    aplcnEqpmntCd: '35100207',
    aplcnEqpmntNm: 'TPS-830K 레이더',
  },
]

const TOTAL = 43 // 총 건수(설계서 예시 '총 43건') — 실제 API total
// 목업 확장 — 기본 6건을 인덱스로 복제해 TOTAL 건 구성(항목번호·재고번호는 고유하게).
const MOCK_LIST: OvsGoalPrcRlsItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_resultListBase[i % dl_resultListBase.length]
  return {
    ...base,
    frcptlArtclNo: String((i + 1) * 10).padStart(5, '0'), // 항목번호 — 10단위 채번(5자리)
    invtNo: String(5295585 + i * 137).padStart(9, '0'), // 재고번호 — 9자리 고유
  }
})

const PAGE_STEP_DEFAULT = 10 // 표시 개수 초기값(설계서 '표시 개수 10 개')

export function OvsGoalPrcRlsItemListPage() {
  const [pageSize, setPageSize] = useState(PAGE_STEP_DEFAULT)
  const [page, setPage] = useState(1)

  // ── API 경계 스텁 (백엔드 연동 시 services/bd 로 대체) ──
  // On-Load: 입찰공고의 목표가공개 품목 목록 조회 — 추후 API: bdService.selectGoalPrcRlsItemList()
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[M75] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[M75] loadMore → page', next) // 추후 API: bdService.selectGoalPrcRlsItemList({ page: next })
  }

  const total = MOCK_LIST.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = MOCK_LIST.slice(0, loaded)

  // 목업 → Table rows 매핑 — 설계서 데이터영역(dl_resultList) 항목 순서 그대로 노출. 숫자/금액은 우측 정렬(type: number).
  const itemRows = (it: OvsGoalPrcRlsItem): TableRow[] => [
    { label: '항목번호', value: it.frcptlArtclNo },
    { label: '재고번호', value: it.invtNo },
    { label: '부품번호', value: it.prtsNo },
    { label: '규격번호', value: it.spcfctNo },
    { label: '품명', value: it.itemNm },
    { label: '납기기준일자', value: it.dudtYmd },
    { label: '단위', value: it.unitNm },
    { label: '본조수량', value: it.bscbgtQty.toLocaleString(), type: 'number' },
    { label: '당국수량', value: it.athrtQty.toLocaleString(), type: 'number' },
    { label: '장국수량', value: it.ltbndQty.toLocaleString(), type: 'number' },
    { label: '본조예산', value: formatAmt(it.bscbgtDrctnAmt), type: 'number' },
    { label: '당국예산', value: formatAmt(it.athrtDrctnAmt), type: 'number' },
    { label: '장국예산', value: formatAmt(it.ltbndDrctnAmt), type: 'number' },
    { label: '수량합계', value: it.sumQty.toLocaleString(), type: 'number' },
    { label: '지시단가', value: it.drctnUntprc.toLocaleString(), type: 'number' },
    { label: '지시금액', value: formatAmt(it.drctnAmt), type: 'number' },
    { label: '장비부호', value: it.aplcnEqpmntCd },
    { label: '장비명', value: it.aplcnEqpmntNm },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 목록 헤더 — 총건수·표시개수(10/20/50) */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 조회결과 — 품목별 테이블 (px-4 인셋). 카드 → Table 전환(사용자 확정) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        {visibleList.map((it) => (
          <Table key={it.frcptlArtclNo} rows={itemRows(it)} />
        ))}
      </div>

      {/* 더보기 — 모두 노출됐으면 숨김 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
OvsGoalPrcRlsItemListPage.displayName = 'OvsGoalPrcRlsItemListPage'
