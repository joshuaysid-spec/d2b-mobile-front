// 국외 입찰공고 상세 - '품목 목록' 탭 (MUI-BD-01-T72(구 M72 — v1.83 재편), 설계서 slide291·295).
// 품목별 아코디언(항목번호·품명) + 필드 테이블(dl_itemList 항목 그대로) + 보관함 추가/삭제(업체담당자).
// 첨부문서 '보기' = 파일다운로드, 재고번호 '보기' = 목록정보조회 팝업(UI-OP-01-P75, 추후 연결).
// 10개 노출 후 더보기 버튼으로 10개씩 추가 로드(설계서). 데이터는 목업(추후 bdService.selectBidItemList).
import { useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Toast } from '@/ui/common/composites/Toast'
import { OvsBidPbanc_AtchFileInq } from '@/ui/biz/bd/ovsBidPbancDtl/OvsBidPbanc_AtchFileInq'
import type { OvsAtchDoc, OvsBidItem } from '@/types/bd'

// 품목목록 목업 — PC 실 인터페이스(ovsBidPbancDtl.IResultItem) 키. 설계서 slide291 예시값 기반.
// 항목번호별로 재고·부품·규격번호와 품명만 달리해 실제 응답처럼 구성. 추후 bdService.selectBidItemList
type OvsBidItemBase = Pick<
  OvsBidItem,
  'artclNo' | 'itemNm' | 'invtNo' | 'prtsNo' | 'spcfctNo' | 'lockerYn' | 'docYn' | 'inspShpCd'
>
const MOCK_ITEM_BASE: OvsBidItemBase[] = [
  { artclNo: '1', itemNm: 'BLADE ASSY, MAIN ROTOR', invtNo: '153200369', prtsNo: 'A2093-211112', spcfctNo: '369A2093', lockerYn: 'Y', docYn: 'Y', inspShpCd: '일반' },
  { artclNo: '2', itemNm: 'HUB ASSY, MAIN ROTOR', invtNo: '153200370', prtsNo: 'A2093-211113', spcfctNo: '369A2094', lockerYn: 'N', docYn: 'Y', inspShpCd: '일반' },
  { artclNo: '3', itemNm: 'GEARBOX ASSY, TAIL ROTOR', invtNo: '162000371', prtsNo: 'A2093-211114', spcfctNo: '369A2095', lockerYn: 'N', docYn: 'N', inspShpCd: '정밀' },
  { artclNo: '4', itemNm: 'SERVO CYLINDER ASSY', invtNo: '165000372', prtsNo: 'A2093-211115', spcfctNo: '369A2096', lockerYn: 'Y', docYn: 'N', inspShpCd: '일반' },
  { artclNo: '5', itemNm: 'PUMP, FUEL, ENGINE', invtNo: '291500373', prtsNo: 'A2093-211116', spcfctNo: '369A2097', lockerYn: 'N', docYn: 'Y', inspShpCd: '정밀' },
  { artclNo: '6', itemNm: 'FILTER ELEMENT, FLUID', invtNo: '294000374', prtsNo: 'A2093-211117', spcfctNo: '369A2098', lockerYn: 'N', docYn: 'N', inspShpCd: '일반' },
  { artclNo: '7', itemNm: 'BEARING, ROLLER, CYLINDRICAL', invtNo: '311000375', prtsNo: 'A2093-211118', spcfctNo: '369A2099', lockerYn: 'N', docYn: 'N', inspShpCd: '일반' },
  { artclNo: '8', itemNm: 'VALVE, CHECK', invtNo: '481000376', prtsNo: 'A2093-211119', spcfctNo: '369A2100', lockerYn: 'N', docYn: 'Y', inspShpCd: '정밀' },
  { artclNo: '9', itemNm: 'INDICATOR, AIRSPEED', invtNo: '661000377', prtsNo: 'A2093-211120', spcfctNo: '369A2101', lockerYn: 'N', docYn: 'N', inspShpCd: '일반' },
  { artclNo: '10', itemNm: 'ANTENNA, RADIO', invtNo: '598500378', prtsNo: 'A2093-211121', spcfctNo: '369A2102', lockerYn: 'N', docYn: 'N', inspShpCd: '일반' },
  { artclNo: '11', itemNm: 'CABLE ASSY, POWER', invtNo: '614500379', prtsNo: 'A2093-211122', spcfctNo: '369A2103', lockerYn: 'N', docYn: 'Y', inspShpCd: '일반' },
  { artclNo: '12', itemNm: 'SWITCH, TOGGLE', invtNo: '593000380', prtsNo: 'A2093-211123', spcfctNo: '369A2104', lockerYn: 'N', docYn: 'N', inspShpCd: '일반' },
]
const MOCK_ITEM_LIST: OvsBidItem[] = MOCK_ITEM_BASE.map((it) => ({
  ...it,
  docId: `DOC-EFD0007-${it.artclNo}`,
  dudtYmd: '2026-11-25',
  bidUnitCd: 'EA',
  bonSumDrctnQty: '1',
  dangSumDrctnQty: '1',
  jangSumDrctnQty: '1',
  bonSumDrctnUsdAmt: '608,000.00',
  dangSumDrctnUsdAmt: '608,000.00',
  jangSumDrctnUsdAmt: '608,000.00',
  sumDrctnQty: '3',
  crncCd: '미 달러',
  drctnUntprc: 608_000,
  sumDrctnUsdAmt: '1,824,000.00',
  aplcnEqpmntCd: 'H500MD01',
  aplcnEqpmntNm: '500MD 헬기',
}))

const PAGE_STEP = 10 // 더보기 10개씩(설계서)

// 첨부파일조회(MUI-BD-01-P76) 목업 — 선택 품목의 첨부서류 목록(IResultAttach 형태).
// 설계서 slide15 Layout(순번·첨부서류명 + 첨부파일명.hwp [파일크기]) 그대로. 추후 API: bdService.selectOvsItemAtchFileList
const buildAtchDocs = (item: OvsBidItem): OvsAtchDoc[] => [
  { docTitl: '규격서', fileNm: `규격서(${item.spcfctNo}).hwp`, fileSz: 804_864, fileId: `${item.docId}-1` },
  { docTitl: '도면', fileNm: `도면(${item.prtsNo}).pdf`, fileSz: 1_258_291, fileId: `${item.docId}-2` },
]

export function OvsBidPbancDtl() {
  // 보관함 추가/삭제 로컬 토글 — 추후 API 연동 시 서버 상태로 교체.
  const [items, setItems] = useState<OvsBidItem[]>(MOCK_ITEM_LIST)
  const [visible, setVisible] = useState(PAGE_STEP)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' })

  const total = items.length
  const visibleItems = items.slice(0, visible)

  // 보관함 추가/삭제 (scnwin.btn_addItem_onclick / btn_deleteItem_onclick) — 업체담당자인 경우 노출.
  const handleToggleLocker = (item: OvsBidItem) => {
    const next = item.lockerYn === 'Y' ? 'N' : 'Y'
    setItems((prev) =>
      prev.map((it) => (it.artclNo === item.artclNo ? { ...it, lockerYn: next } : it)),
    )
    setToast({
      open: true,
      message: next === 'Y' ? '보관함에 추가 되었습니다.' : '보관함에서 삭제 되었습니다.',
    })
    // 추후 API: bdService.insertItemToLocker / bdService.deleteItemFromLocker
    console.log('[M72] 보관함', next === 'Y' ? '추가' : '삭제', item.artclNo)
  }

  // 첨부문서 보기 (scwin.btn_openAtchDoc_onlick) — 첨부파일조회(MUI-BD-01-P76) 바텀시트 호출(국외 설계서 slide14·20).
  const [atchItem, setAtchItem] = useState<OvsBidItem | null>(null)
  const handleOpenAtchDoc = (item: OvsBidItem) => {
    setAtchItem(item)
    console.log('[M72] 첨부파일조회(P76) 열기', item.artclNo) // 추후 API: bdService.selectOvsItemAtchFileList
  }

  // 재고번호 클릭 (scwin.grd_list_oncellclick) — 목록정보조회 팝업(UI-OP-01-P75) 호출.
  const handleOpenInvtNo = (item: OvsBidItem) => {
    console.log('[M72] 재고번호 목록정보조회', item.invtNo) // 추후: 목록정보조회 팝업(UI-OP-01-P75)
  }

  const itemRows = (it: OvsBidItem): TableRow[] => [
    { label: '항목번호', value: it.artclNo, type: 'number' },
    { label: '품질등급', value: it.inspShpCd },
    {
      label: '첨부문서',
      value:
        it.docYn === 'Y' ? (
          <div className="flex items-center justify-between gap-2">
            <span>있음</span>
            <Button size="sm" variant="inner" onClick={() => handleOpenAtchDoc(it)}>
              보기
            </Button>
          </div>
        ) : (
          '없음'
        ),
      type: it.docYn === 'Y' ? 'combination' : 'default',
    },
    {
      label: '재고번호',
      value: (
        <div className="flex items-center justify-between gap-2">
          <span>{it.invtNo}</span>
          <Button size="sm" variant="inner" onClick={() => handleOpenInvtNo(it)}>
            보기
          </Button>
        </div>
      ),
      type: 'combination',
    },
    { label: '부품번호', value: it.prtsNo },
    { label: '규격번호', value: it.spcfctNo },
    { label: '품명', value: it.itemNm },
    { label: '납기기준일자', value: it.dudtYmd },
    { label: '단위', value: it.bidUnitCd },
    { label: '본조수량', value: it.bonSumDrctnQty, type: 'number' },
    { label: '당국수량', value: it.dangSumDrctnQty, type: 'number' },
    { label: '장국수량', value: it.jangSumDrctnQty, type: 'number' },
    { label: '본조예산', value: `${it.bonSumDrctnUsdAmt} USD`, type: 'number' },
    { label: '당국예산', value: `${it.dangSumDrctnUsdAmt} USD`, type: 'number' },
    { label: '장국예산', value: `${it.jangSumDrctnUsdAmt} USD`, type: 'number' },
    { label: '수량합계', value: it.sumDrctnQty, type: 'number' },
    { label: '화폐단위', value: it.crncCd },
    { label: '지시단가', value: `${it.drctnUntprc.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`, type: 'number' },
    { label: '지시금액', value: `${it.sumDrctnUsdAmt} USD`, type: 'number' },
    { label: '장비부호', value: it.aplcnEqpmntCd },
    { label: '장비명', value: it.aplcnEqpmntNm },
    { label: '보관함 여부', value: it.lockerYn },
  ]

  return (
    <>
      {/* 타이틀 + 건수 — Figma m_section title(9973-131169) 우측 건수 슬롯(총 N건). 배경은 흰색(사용자 확정 — info 기본 블루 강조 제거) */}
      <SectionTitle topDivider info={`총 ${total}건`} className="bg-white">
        품목 목록
      </SectionTitle>
      <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
        {visibleItems.map((it) => (
          <AccordionSection
            key={it.artclNo}
            value={`item-${it.artclNo}`}
            title={`항목번호 ${it.artclNo} · ${it.itemNm}`}
            borderTop={it.artclNo !== '1'}
          >
            <Table rows={itemRows(it)} />
            {/* 보관함 추가/삭제 — 업체담당자인 경우에만 노출(추후 권한 연동) */}
            <Button
              variant={it.lockerYn === 'Y' ? 'secondary' : 'primary'}
              className="mt-3 w-full"
              onClick={() => handleToggleLocker(it)}
            >
              {it.lockerYn === 'Y' ? '보관함 삭제' : '보관함 추가'}
            </Button>
          </AccordionSection>
        ))}
      </Accordion>

      {/* 더보기 — 10개씩 추가 로드(설계서) */}
      {visible < total && (
        <div className="px-4 py-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setVisible((v) => v + PAGE_STEP)}
          >
            더보기 ({visibleItems.length}/{total}건)
          </Button>
        </div>
      )}

      {/* 첨부파일조회(MUI-BD-01-P76) 바텀시트 — 컨테이너/footer(닫기)는 부모 소유, 콘텐츠만 분리 */}
      <BottomSheet
        open={atchItem !== null}
        onOpenChange={(o) => {
          if (!o) setAtchItem(null)
        }}
        title="첨부파일 조회"
        onConfirm={() => setAtchItem(null)}
        confirmLabel="닫기"
      >
        {atchItem && <OvsBidPbanc_AtchFileInq docs={buildAtchDocs(atchItem)} />}
      </BottomSheet>

      {/* 보관함 추가/삭제 토스트 */}
      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        {toast.message}
      </Toast>
    </>
  )
}
OvsBidPbancDtl.displayName = 'OvsBidPbancDtl'
