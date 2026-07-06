// 이전공고입찰내역등록 (MUI-BD-01-M79, 설계서 slide320·322·323 / 영문 OvsBfrTmprBidBidCnRegPage).
// 이전 공고 보관함 목록의 입찰내역을 현재 공고의 입찰내역으로 불러오는 화면.
// 진입: 홈 > 마이페이지 > 국외 보관함 > 입찰내역 작성(/bd/ovs/locker/:id/bid-cn) > 이전공고입찰내역등록.
// 구성: 총건수 + 보관함 이전공고 카드 목록(dl_pbancInfo) + '입찰내역 품목 보기' → 이전공고입찰내역품목상세(P80) 풀팝업.
// 데이터는 목업(설계서 1.1 dl_pbancInfo 항목명 그대로), 핸들러는 API 경계 스텁(console.log).
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { BfrPbancBidDsctnItemDtlFullPopup } from '@/ui/biz/bd/ovsBfrTmprBidBidCnReg/BfrPbancBidDsctnItemDtlFullPopup'

// ── 타입 — 설계서 slide322 항목설명 그대로. 추후 src/types/bd.ts 통합 ─────────────────

/** 보관함 이전공고 1건 (1.1 보관함목록 데이터 영역 dl_pbancInfo) */
export interface BfrPbancInfoItem {
  /** 순번 */
  no: number
  /** 공고번호 (공고의 공고번호) */
  pbancNo: string
  /** 공고차수 (공고의 차수) */
  pbancOd: string
  /** 구매요청번호 (공고의 구매요청번호) */
  prchsDmndNo: string
  /** 개찰일자 (공고의 개찰일자) */
  bdopnYmd: string
  /** 참가품목수 (참가신청한 품목수) */
  prtcpItemQty: number
  /** ⚠️ 설계서 dl_pbancInfo 미정의 — 와이어프레임 카드 타이틀(RECOIL) 표기용 임시.
   *  항목명은 BD 도메인 공통 '대표품명(rprsItemNm)' 재사용. 설계서 확정 시 정리. */
  rprsItemNm: string
}

/** 입찰내역 1건 (1.2 입찰내역목록 데이터 영역 dl_bidCnList) */
export interface BfrPbancBidCnItem {
  /** 순번 */
  no: number
  /** 재고번호 */
  invtNo: string
  /** 부품번호 */
  prtsNo: string
  /** 품명 */
  itemNm: string
  /** 품목대체구분 (Y/N) */
  itemSbstSe: string
  /** 품목대체첨부문서 (Y/N, 필수 아님) */
  itemSbstDocEn: string
  /** 수정재고번호 (필수 아님) */
  mdfcnInvtNo: string
  /** 수정부품번호 (필수 아님) */
  mdfcnPrtsNo: string
  /** MOQ구분 (Y/N) */
  moqYn: string
  /** MOQ수량 (필수 아님) */
  moqQty: number | null
  /** MOQ첨부문서 (Y/N, 필수 아님) */
  moqDocEn: string
  /** 입찰업체 */
  splyBzentyNm: string
  /** 입찰단가 */
  bdngTccrUntprc: number
  /** 입찰금액 */
  bdngTccrAmt: number
  /** 화폐단위 */
  crncNm: string
}

// ── 목업 — 보관함 이전공고 목록(dl_pbancInfo). 설계서 와이어프레임 '총 5건' + 예시값(VDW2523-03 등).
//    On-Load 보관함이전공고목록조회 — 추후 API: bdService.getBfrPbancLockerList(lockerId)
const MOCK_BFR_PBANC_LIST: BfrPbancInfoItem[] = [
  {
    no: 1,
    pbancNo: 'VDW2523-03',
    pbancOd: '01',
    prchsDmndNo: 'BDF01823-002',
    bdopnYmd: '2024-12-25',
    prtcpItemQty: 6,
    rprsItemNm: 'RECOIL',
  },
  {
    no: 2,
    pbancNo: 'VMW2410-05',
    pbancOd: '01',
    prchsDmndNo: 'BDF01756-001',
    bdopnYmd: '2024-11-18',
    prtcpItemQty: 4,
    rprsItemNm: 'BEARING,BALL,ANNULAR',
  },
  {
    no: 3,
    pbancNo: 'VAF2508-12',
    pbancOd: '02',
    prchsDmndNo: 'BDF01698-003',
    bdopnYmd: '2024-10-02',
    prtcpItemQty: 12,
    rprsItemNm: 'VALVE,SOLENOID',
  },
  {
    no: 4,
    pbancNo: 'VNV2447-07',
    pbancOd: '01',
    prchsDmndNo: 'BDF01654-002',
    bdopnYmd: '2024-08-21',
    prtcpItemQty: 3,
    rprsItemNm: 'ACTUATOR,HYDRAULIC',
  },
  {
    no: 5,
    pbancNo: 'VGE2432-01',
    pbancOd: '01',
    prchsDmndNo: 'BDF01611-001',
    bdopnYmd: '2024-07-15',
    prtcpItemQty: 9,
    rprsItemNm: 'FILTER ELEMENT,FLUID',
  },
]

export function OvsBfrTmprBidBidCnRegPage() {
  const { id: lockerId } = useParams() // 국외 보관함 id (/bd/ovs/locker/:id/bfr-bid-cn)
  // 이전공고입찰내역품목상세(P80) — 열려 있는 대상 공고(행 클릭 시 설정). null = 닫힘.
  const [openPbanc, setOpenPbanc] = useState<BfrPbancInfoItem | null>(null)

  // On-Load: 보관함이전공고목록조회 — 목업. 추후 API: bdService.getBfrPbancLockerList(lockerId)
  const list = MOCK_BFR_PBANC_LIST
  const total = list.length

  // 보관함목록행 클릭(grd_list_oncecllclick) — 클릭한 공고의 입찰내역 목록 조회(P80 팝업).
  const handlePbancClick = (item: BfrPbancInfoItem) => {
    console.log('[M79] 이전공고입찰내역목록조회', { lockerId, pbancNo: item.pbancNo, pbancOd: item.pbancOd })
    // 추후 API: bdService.getBfrPbancBidCnList(item.pbancNo, item.pbancOd)
    setOpenPbanc(item)
  }

  // 목업 → Card props 매핑 — 와이어프레임: 공고번호(윗줄)·대표품명(타이틀)·구매요청번호/개찰일자/참가 품목수 + 보기 버튼.
  const cardItems: CardListItem[] = list.map((it) => ({
    id: `${it.pbancNo}-${it.pbancOd}`,
    subtitle: `공고번호 ${it.pbancNo}-${it.pbancOd}`,
    title: it.rprsItemNm,
    rows: [
      { label: '구매요청번호', value: it.prchsDmndNo },
      { label: '개찰일자', value: it.bdopnYmd },
      { label: '참가 품목수', value: `${it.prtcpItemQty}건` },
    ],
    footer: (
      <Button variant="secondary" className="w-full" onClick={() => handlePbancClick(it)}>
        입찰내역 품목 보기
      </Button>
    ),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 총 건수 */}
      <div className="px-4 pt-4">
        <p className="text-[17px] font-bold leading-normal text-krds-text-primary-active">
          총 {total}건
        </p>
      </div>

      {/* 보관함 이전공고 카드 목록 (px-4 인셋) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-6 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {/* 이전공고입찰내역품목상세(MUI-BD-01-P80) — 풀팝업. 컨테이너 상태는 페이지가 소유. */}
      <BfrPbancBidDsctnItemDtlFullPopup
        open={openPbanc !== null}
        onOpenChange={(open) => {
          if (!open) setOpenPbanc(null)
        }}
        pbanc={openPbanc}
      />
    </div>
  )
}
OvsBfrTmprBidBidCnRegPage.displayName = 'OvsBfrTmprBidBidCnRegPage'
