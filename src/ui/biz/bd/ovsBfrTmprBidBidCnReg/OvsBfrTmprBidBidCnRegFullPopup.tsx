// 이전공고입찰내역등록 (MUI-BD-01-P79(구 M79 — v1.83 재편), 설계서 slide320·322·323 / 영문 OvsBfrTmprBidBidCnReg).
// 이전 공고 보관함 목록의 입찰내역을 현재 공고의 입찰내역으로 불러오는 풀페이지 팝업(*FullPopup 컨벤션).
// 진입: 국외 입찰공고 상세(M71) 플로팅 · 입찰내역 작성(M76) '이전공고입찰내역 불러오기' — 부모가 open 상태 소유.
// 구성: 업무도움(HelpDisclosure — 설계서 v1.88 slide428 상단 업무도움 박스, 2026-08-25 추가)
//   + 총건수 + 보관함 이전공고 카드 목록(dl_pbancInfo) + '입찰내역 품목 보기' → 이전공고입찰내역품목상세(P80) 바텀시트
//   (2026-08-25 사용자 확정 — 구 풀팝업 → 바텀시트. 컨테이너/footer([취소][불러오기])는 이 컴포넌트가 소유,
//    콘텐츠는 BfrPbancBidDsctnItemDtl(ref 핸들 loadSave)).
// 데이터는 목업(설계서 1.1 dl_pbancInfo 항목명 그대로), 핸들러는 API 경계 스텁(console.log).
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import {
  BfrPbancBidDsctnItemDtl,
  type BfrPbancBidDsctnItemDtlHandle,
} from '@/ui/biz/bd/ovsBfrTmprBidBidCnReg/BfrPbancBidDsctnItemDtl'
import type { MockBfrPbancInfoItem } from '@/types/mock/bd'

// ── 목업 — 보관함 이전공고 목록(dl_pbancInfo). 설계서 와이어프레임 '총 5건' + 예시값(VDW2523-03 등).
//    On-Load 보관함이전공고목록조회 — 추후 API: bdService.selectLockerBfrPbancList(lockerId)
const MOCK_BFR_PBANC_LIST: MockBfrPbancInfoItem[] = [
  {
    no: '1',
    pbancNo: 'VDW2523-03',
    pbancOd: '01',
    prchsDmndNo: 'BDF01823-002',
    bdopnYmd: '2024-12-25',
    prtcpItemQty: '6',
    rprsItemNm: 'RECOIL',
  },
  {
    no: '2',
    pbancNo: 'VMW2410-05',
    pbancOd: '01',
    prchsDmndNo: 'BDF01756-001',
    bdopnYmd: '2024-11-18',
    prtcpItemQty: '4',
    rprsItemNm: 'BEARING,BALL,ANNULAR',
  },
  {
    no: '3',
    pbancNo: 'VAF2508-12',
    pbancOd: '02',
    prchsDmndNo: 'BDF01698-003',
    bdopnYmd: '2024-10-02',
    prtcpItemQty: '12',
    rprsItemNm: 'VALVE,SOLENOID',
  },
  {
    no: '4',
    pbancNo: 'VNV2447-07',
    pbancOd: '01',
    prchsDmndNo: 'BDF01654-002',
    bdopnYmd: '2024-08-21',
    prtcpItemQty: '3',
    rprsItemNm: 'ACTUATOR,HYDRAULIC',
  },
  {
    no: '5',
    pbancNo: 'VGE2432-01',
    pbancOd: '01',
    prchsDmndNo: 'BDF01611-001',
    bdopnYmd: '2024-07-15',
    prtcpItemQty: '9',
    rprsItemNm: 'FILTER ELEMENT,FLUID',
  },
]

// 업무도움 — 설계서 slide428 은 박스 위치만 표기(문구 미기재)라 설계서의 화면 설명·동작 기반 문구 사용.
// ⚠️ 확정 문구 수령 시 이 상수만 교체.
const HELP_ITEMS = [
  '이전 공고 보관함 목록의 입찰내역을 현재 공고의 입찰내역으로 불러올 수 있습니다.',
  '[입찰내역 품목 보기]에서 해당 공고의 입찰내역 품목을 확인하고, 항목을 선택해 불러오기 하시기 바랍니다.',
]

export interface OvsBfrTmprBidBidCnRegFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 국외 보관함 식별자(통합참조번호) — 진입 화면이 주입(공고 상세는 rfrncNo). */
  lockerId?: string
}

export function OvsBfrTmprBidBidCnRegFullPopup({
  open,
  onOpenChange,
  lockerId,
}: OvsBfrTmprBidBidCnRegFullPopupProps) {
  // 이전공고입찰내역품목상세(P80) 바텀시트 — 열려 있는 대상 공고(행 클릭 시 설정). null = 닫힘.
  const [openPbanc, setOpenPbanc] = useState<MockBfrPbancInfoItem | null>(null)
  const dtlRef = useRef<BfrPbancBidDsctnItemDtlHandle>(null)

  // 팝업이 다시 열릴 때 중첩 팝업 상태 초기화 — 공고를 바꿔 재진입해도 이전 상태가 남지 않게.
  useEffect(() => {
    if (open) setOpenPbanc(null)
  }, [open])

  // On-Load: 보관함이전공고목록조회 — 목업. 추후 API: bdService.selectLockerBfrPbancList(lockerId)
  const list = MOCK_BFR_PBANC_LIST
  const total = list.length

  // 보관함목록행 클릭(grd_list_oncecllclick) — 클릭한 공고의 입찰내역 목록 조회(P80 팝업).
  const handlePbancClick = (item: MockBfrPbancInfoItem) => {
    console.log('[P79] 이전공고입찰내역목록조회', { lockerId, pbancNo: item.pbancNo, pbancOd: item.pbancOd })
    // 추후 API: bdService.selectBfrTmprBidCnList(item.pbancNo, item.pbancOd)
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
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="이전공고입찰내역등록"
      // v0.87 검토87 — 하단 footer [닫기] 추가
      footer={
        <ButtonGroup
          layout="single"
          items={[{ label: '닫기', variant: 'secondary', onClick: () => onOpenChange(false) }]}
        />
      }
    >
      <div className="flex w-full flex-col">
        {/* 업무도움 — 설계서 slide428 상단(총건수 위). 기본 펼침. */}
        <HelpDisclosure title="업무도움" items={HELP_ITEMS} defaultOpen />

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

        {/* 이전공고입찰내역품목상세(MUI-BD-01-P80) — 바텀시트(사용자 확정 2026-08-25, 구 풀팝업 대체).
            컨테이너/footer 는 P79 소유, 콘텐츠는 BfrPbancBidDsctnItemDtl(ref 핸들). 닫히면 언마운트 → 상태 초기화. */}
        <BottomSheet
          open={openPbanc !== null}
          onOpenChange={(next) => {
            if (!next) setOpenPbanc(null)
          }}
          title="이전공고입찰내역품목상세"
          footer={
            <ButtonGroup
              layout="asymmetric"
              items={[
                { label: '취소', variant: 'secondary', onClick: () => setOpenPbanc(null) },
                { label: '불러오기', variant: 'primary', onClick: () => dtlRef.current?.loadSave() },
              ]}
            />
          }
        >
          {openPbanc && (
            <BfrPbancBidDsctnItemDtl
              ref={dtlRef}
              pbanc={openPbanc}
              onDone={() => setOpenPbanc(null)}
            />
          )}
        </BottomSheet>
      </div>
    </FullPopup>
  )
}
OvsBfrTmprBidBidCnRegFullPopup.displayName = 'OvsBfrTmprBidBidCnRegFullPopup'
