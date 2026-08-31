// 이전공고입찰내역품목상세 (MUI-BD-01-P80, 설계서 slide429 / 영문 BfrPbancBidDsctnItemDtl).
// 클릭한 이전 공고의 입찰내역 품목을 확인하고 현재 공고의 입찰내역으로 불러오는 **바텀시트 콘텐츠 전용** 컴포넌트
// (2026-08-25 사용자 확정 — 구 FullPopup 래퍼(BfrPbancBidDsctnItemDtlFullPopup)를 바텀시트로 전환).
// 컨테이너(BottomSheet)/footer([취소][불러오기])는 부모(P79 OvsBfrTmprBidBidCnRegFullPopup)가 소유 —
//   footer [불러오기]는 ref(useImperativeHandle) 의 loadSave() 로 호출(*Sheet 래퍼 금지 규칙).
// 품목 카드: 항목선택(Checkbox box) + 요약 4개 필드(Table), '내역 펼쳐보기/접기' 로 전체 필드(dl_bidCnList) 확장.
// 데이터는 목업(설계서 1.2 dl_bidCnList 항목명 그대로), 핸들러는 API 경계 스텁(console.log).
// 시트가 닫히면 언마운트되어 선택/펼침 상태는 자동 초기화된다(구 useEffect(open) 리셋 대체).
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { Icon } from '@/ui/common/base/Icon'
import { Card } from '@/ui/common/composites/Card'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { cn } from '@/utils/cn'

import type { MockBfrPbancBidCnItem, MockBfrPbancInfoItem } from '@/types/mock/bd'

// ── 목업 — 이전공고 입찰내역 목록(dl_bidCnList). 와이어프레임 예시값(A000-A0000·0000T-80U/TBE-3·OA 업체·10,000 USD) 기반.
//    이전공고입찰내역목록조회 — 추후 API: bdService.selectBfrTmprBidCnList(pbancNo, pbancOd)
const MOCK_BID_CN_LIST: MockBfrPbancBidCnItem[] = [
  {
    no: '1',
    invtNo: 'A000-A0000',
    prtsNo: '0000T-80U',
    itemNm: 'RECOIL MECHANISM,TBE-3',
    itemSbstSe: 'Y',
    itemSbstDocEn: 'Y',
    mdfcnInvtNo: 'A000-A0001',
    mdfcnPrtsNo: '0000T-80U/TBE-3',
    moqYn: 'Y',
    moqQty: '2',
    moqDocEn: 'Y',
    splyBzentyNm: 'OA 업체',
    bdngTccrUntprc: 10_000,
    bdngTccrAmt: 10_000,
    crncNm: 'USD',
  },
  {
    no: '2',
    invtNo: 'A000-A0002',
    prtsNo: 'MS21245-6',
    itemNm: 'BEARING,BALL,ANNULAR',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'GD Ordnance Systems',
    bdngTccrUntprc: 1_250,
    bdngTccrAmt: 25_000,
    crncNm: 'USD',
  },
  {
    no: '3',
    invtNo: 'A000-A0003',
    prtsNo: 'AN6227B-14',
    itemNm: 'PACKING,PREFORMED',
    itemSbstSe: 'Y',
    itemSbstDocEn: 'Y',
    mdfcnInvtNo: 'A000-A0013',
    mdfcnPrtsNo: 'AN6227B-14A',
    moqYn: 'Y',
    moqQty: '50',
    moqDocEn: 'N',
    splyBzentyNm: 'Elbit Systems Ltd.',
    bdngTccrUntprc: 38.5,
    bdngTccrAmt: 1_925,
    crncNm: 'USD',
  },
  {
    no: '4',
    invtNo: 'A000-A0004',
    prtsNo: '12977837',
    itemNm: 'VALVE,SOLENOID',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'Moog Inc.',
    bdngTccrUntprc: 4_820,
    bdngTccrAmt: 14_460,
    crncNm: 'USD',
  },
  {
    no: '5',
    invtNo: 'A000-A0005',
    prtsNo: '74A400302-1001',
    itemNm: 'ACTUATOR,HYDRAULIC',
    itemSbstSe: 'Y',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: 'A000-A0015',
    mdfcnPrtsNo: '74A400302-1003',
    moqYn: 'Y',
    moqQty: '1',
    moqDocEn: 'Y',
    splyBzentyNm: 'Parker Hannifin Corp.',
    bdngTccrUntprc: 21_300,
    bdngTccrAmt: 21_300,
    crncNm: 'USD',
  },
  {
    no: '6',
    invtNo: 'A000-A0006',
    prtsNo: 'CCA1500-4',
    itemNm: 'FILTER ELEMENT,FLUID',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'Pall Aerospace',
    bdngTccrUntprc: 96,
    bdngTccrAmt: 2_880,
    crncNm: 'EUR',
  },
  {
    no: '7',
    invtNo: 'A000-A0007',
    prtsNo: '3040T78-2',
    itemNm: 'GASKET,METALLIC',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'Y',
    moqQty: '20',
    moqDocEn: 'N',
    splyBzentyNm: 'OA 업체',
    bdngTccrUntprc: 12.4,
    bdngTccrAmt: 248,
    crncNm: 'USD',
  },
  {
    no: '8',
    invtNo: 'A000-A0008',
    prtsNo: 'M83248/1-014',
    itemNm: 'O-RING',
    itemSbstSe: 'Y',
    itemSbstDocEn: 'Y',
    mdfcnInvtNo: 'A000-A0018',
    mdfcnPrtsNo: 'M83248/1-014A',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'Trelleborg Sealing',
    bdngTccrUntprc: 3.2,
    bdngTccrAmt: 640,
    crncNm: 'USD',
  },
  {
    no: '9',
    invtNo: 'A000-A0009',
    prtsNo: '8TJ124GDM1',
    itemNm: 'GENERATOR,ALTERNATING CURRENT',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'GE Aviation',
    bdngTccrUntprc: 54_700,
    bdngTccrAmt: 54_700,
    crncNm: 'USD',
  },
  {
    no: '10',
    invtNo: 'A000-A0010',
    prtsNo: 'NAS1149F0432P',
    itemNm: 'WASHER,FLAT',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'Y',
    moqQty: '100',
    moqDocEn: 'Y',
    splyBzentyNm: 'OA 업체',
    bdngTccrUntprc: 0.85,
    bdngTccrAmt: 85,
    crncNm: 'USD',
  },
  {
    no: '11',
    invtNo: 'A000-A0011',
    prtsNo: 'MS28775-115',
    itemNm: 'PACKING,PREFORMED',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'Elbit Systems Ltd.',
    bdngTccrUntprc: 5.6,
    bdngTccrAmt: 560,
    crncNm: 'USD',
  },
  {
    no: '12',
    invtNo: 'A000-A0012',
    prtsNo: '145E4571-3',
    itemNm: 'HOSE ASSEMBLY,NONMETALLIC',
    itemSbstSe: 'Y',
    itemSbstDocEn: 'Y',
    mdfcnInvtNo: 'A000-A0022',
    mdfcnPrtsNo: '145E4571-5',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'Eaton Aerospace',
    bdngTccrUntprc: 780,
    bdngTccrAmt: 3_120,
    crncNm: 'EUR',
  },
  {
    no: '13',
    invtNo: 'A000-A0013',
    prtsNo: '70400-08110-041',
    itemNm: 'BLADE,ROTARY WING',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'N',
    moqQty: '',
    moqDocEn: 'N',
    splyBzentyNm: 'Sikorsky Aircraft',
    bdngTccrUntprc: 187_000,
    bdngTccrAmt: 187_000,
    crncNm: 'USD',
  },
  {
    no: '14',
    invtNo: 'A000-A0014',
    prtsNo: 'MS20470AD4-6',
    itemNm: 'RIVET,SOLID',
    itemSbstSe: 'N',
    itemSbstDocEn: 'N',
    mdfcnInvtNo: '',
    mdfcnPrtsNo: '',
    moqYn: 'Y',
    moqQty: '500',
    moqDocEn: 'N',
    splyBzentyNm: 'OA 업체',
    bdngTccrUntprc: 0.12,
    bdngTccrAmt: 60,
    crncNm: 'USD',
  },
]

const PAGE_STEP = 10 // 더보기 10개씩(와이어프레임 '더보기(10/258)')

/** 빈 값(필수 아님 필드) 표시 */
const dash = (v: string) => (v ? v : '-')

export interface BfrPbancBidDsctnItemDtlHandle {
  /** 부모 BottomSheet footer [불러오기] 가 호출 — 선택 품목(미선택 시 전체)을 현재 공고 입찰내역으로 저장. */
  loadSave: () => void
}

export interface BfrPbancBidDsctnItemDtlProps {
  /** 보관함 목록에서 클릭한 이전 공고 */
  pbanc: MockBfrPbancInfoItem
  /** 불러오기 완료 시 호출(부모가 시트를 닫음) */
  onDone: () => void
}

export const BfrPbancBidDsctnItemDtl = forwardRef<
  BfrPbancBidDsctnItemDtlHandle,
  BfrPbancBidDsctnItemDtlProps
>(({ pbanc, onDone }, ref) => {
  const [visible, setVisible] = useState(PAGE_STEP) // 더보기 노출 개수
  const [checkedNos, setCheckedNos] = useState<string[]>([]) // 항목선택(불러올 품목 순번)
  const [expandedNos, setExpandedNos] = useState<string[]>([]) // 내역 펼쳐보기 상태(순번)

  // 클릭한 공고의 입찰내역 목록 — 목업. 추후 API: bdService.selectBfrTmprBidCnList(pbanc.pbancNo, pbanc.pbancOd)
  const list = MOCK_BID_CN_LIST
  const total = list.length
  const visibleList = useMemo(() => list.slice(0, visible), [list, visible])

  const toggleChecked = (no: string, checked: boolean) => {
    setCheckedNos((prev) => (checked ? [...prev, no] : prev.filter((n) => n !== no)))
  }
  const toggleExpanded = (no: string) => {
    setExpandedNos((prev) => (prev.includes(no) ? prev.filter((n) => n !== no) : [...prev, no]))
  }

  // 불러오기(btn_loadSave_onclick) — 부모 footer 가 ref 로 호출. 선택 품목(미선택 시 전체) 저장 후 onDone.
  useImperativeHandle(ref, () => ({
    loadSave: () => {
      const items = checkedNos.length > 0 ? list.filter((it) => checkedNos.includes(it.no)) : list
      console.log('[P80] 이전공고입찰내역불러오기', {
        pbancNo: pbanc.pbancNo,
        pbancOd: pbanc.pbancOd,
        count: items.length,
        items,
      })
      // 추후 API: bdService.saveBfrTmprBidCn(pbanc.pbancNo, pbanc.pbancOd, items)
      onDone()
    },
  }))

  // 품목 1건 → Table rows. 접힘 = 요약 4개(순번/재고번호/부품번호/품명), 펼침 = dl_bidCnList 전체 필드.
  const buildRows = (it: MockBfrPbancBidCnItem, expanded: boolean): TableRow[] => {
    const summary: TableRow[] = [
      { label: '순번', value: it.no, type: 'number' },
      { label: '재고번호', value: it.invtNo },
      { label: '부품번호', value: it.prtsNo },
      // 품명은 카드 타이틀로 승격(Figma 10020:85034) — 행에서 제외.
    ]
    if (!expanded) return summary
    return [
      ...summary,
      // 코드값(Y/N)은 설계서 속성값 그대로 노출 — API 연동 시 코드명 매핑.
      { label: '품목대체구분', value: it.itemSbstSe },
      { label: '품목대체첨부문서', value: dash(it.itemSbstDocEn) },
      { label: '수정재고번호', value: dash(it.mdfcnInvtNo) },
      { label: '수정부품번호', value: dash(it.mdfcnPrtsNo) },
      { label: 'MOQ구분', value: it.moqYn },
      { label: 'MOQ수량', value: it.moqQty ? Number(it.moqQty).toLocaleString() : '-', type: 'number' },
      { label: 'MOQ첨부문서', value: dash(it.moqDocEn) },
      { label: '입찰업체', value: it.splyBzentyNm },
      { label: '입찰단가', value: it.bdngTccrUntprc.toLocaleString(), type: 'number' },
      { label: '입찰금액', value: it.bdngTccrAmt.toLocaleString(), type: 'number' },
      { label: '화폐단위', value: it.crncNm },
    ]
  }

  return (
    // 좌우 패딩은 시트 본문(px-16)이 제공 — 자체 좌우 패딩 없음(2중 패딩 금지).
    <div className="flex flex-col gap-krds-7 py-krds-5">
      {/* 대상 공고 — 보관함 목록에서 클릭한 공고 */}
      <Table
        rows={[
          { label: '공고번호', value: `${pbanc.pbancNo}-${pbanc.pbancOd}` },
          { label: '구매요청번호', value: pbanc.prchsDmndNo },
        ]}
      />

      {/* 입찰내역 총 건수 */}
      <p className="text-[17px] font-bold leading-normal text-krds-text-primary-active">
        입찰내역 총 {total}건
      </p>

      {/* 입찰내역 품목 목록 — 항목선택 + 요약 Table + 내역 펼쳐보기/접기 */}
      <div className="flex w-full flex-col gap-krds-8">
        {visibleList.map((it) => {
          const expanded = expandedNos.includes(it.no)
          return (
            <Card
              key={it.no}
              title={it.itemNm}
              titleTrailing={
                <Checkbox
                  variant="box"
                  aria-label={`${it.itemNm} 선택`}
                  checked={checkedNos.includes(it.no)}
                  onCheckedChange={(c) => toggleChecked(it.no, c === true)}
                />
              }
              rows={buildRows(it, expanded)}
              footer={
                <div className="flex w-full flex-col gap-krds-5">
                  {/* 내역 펼쳐보기 ↓ / 내역 접기 ↑ */}
                  <button
                    type="button"
                    onClick={() => toggleExpanded(it.no)}
                    className="flex w-full items-center justify-center gap-krds-3 py-krds-3 text-[17px] font-medium text-krds-text-primary-active"
                  >
                    {expanded ? '내역 접기' : '내역 펼쳐보기'}
                    <Icon
                      name="ExpandMore"
                      size={20}
                      className={cn('transition-transform duration-200', expanded && 'rotate-180')}
                      aria-hidden
                    />
                  </button>
                </div>
              }
            />
          )
        })}
      </div>

      {/* 더보기 — 10개씩 추가(와이어프레임 '더보기(10/258)') */}
      {visible < total && (
        <Button variant="secondary" className="w-full" onClick={() => setVisible((v) => v + PAGE_STEP)}>
          더보기 ({visibleList.length}/{total}건)
        </Button>
      )}
    </div>
  )
})
BfrPbancBidDsctnItemDtl.displayName = 'BfrPbancBidDsctnItemDtl'
