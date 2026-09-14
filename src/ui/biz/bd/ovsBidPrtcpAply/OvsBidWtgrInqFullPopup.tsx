// 입찰보증서선택 (MUI-BD-04-P75 ovsBidWtgrInq · 설계서 v1.88 slide453~459) — 보증서정보조회(P76) 통합.
// 스탭3 입찰 보증금(T74, Stp3)의 [보증서선택](전자보증서) → 진입하는 풀팝업(FullPopup) 래퍼.
// 구성: 총건수 + 전자입찰보증서 카드 목록(dl_resultList)
//   — 카드별 [보증서 정보 보기/접기](→ 카드 아래로 보증서정보(P76, OvsBidWtgrDtl) 펼침) / [보증서 적용](→ onApply).
// P76 통합(PC 개정 메모 반영, 사용자 지시 2026-09-14): 구 바텀시트(2026-08-26) 대신 같은 화면에서 카드 밑에 이어서 표시.
//   한 번에 한 카드만 펼침(다른 카드 펼치면 이전 카드는 접힘).
// 확인(보증서 적용) 클릭 시 선택한 입찰보증서를 부모화면에 적용(scwin.btn_confirm_onclick) — 닫기는 부모(Stp3)가 처리.
import { useState } from 'react'

import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { OvsBidWtgrDtl } from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidWtgrDtl'
import type { MockOvsBidWtgrItem } from '@/types/mock/bd'

// 입찰보증서 목록 목업(dl_resultList) — 설계서 slide342 예시값(총 5건) 그대로.
const MOCK_WTGR_LIST: MockOvsBidWtgrItem[] = [
  {
    wtgrNo: '00800107204AA2003BJ00011150000',
    bdopnYmd: '2003-09-08',
    bidNm: '00지역 전기공사',
    grnteAmt: '3,000,000',
    crdtrRprsvNm: '제6685부대',
    ctrtrNm: '금동전기',
    isrRprsvNm: '전기공사공제조합',
  },
  {
    wtgrNo: '00800107204AA2003BJ00011150001',
    bdopnYmd: '2003-09-08',
    bidNm: '00지역 내무생활관 전기공사',
    grnteAmt: '2,700,000',
    crdtrRprsvNm: '제6950부대',
    ctrtrNm: '(주) 선일이이앤써사',
    isrRprsvNm: '서울보증보험주식회사',
  },
  {
    wtgrNo: '00800107204AA2003BJ00011150002',
    bdopnYmd: '2003-09-15',
    bidNm: '00지역 통신설비 공사',
    grnteAmt: '5,200,000',
    crdtrRprsvNm: '제3702부대',
    ctrtrNm: '한빛전설',
    isrRprsvNm: '전기공사공제조합',
  },
  {
    wtgrNo: '00800107204AA2003BJ00011150003',
    bdopnYmd: '2003-09-22',
    bidNm: '00지역 급수펌프 교체공사',
    grnteAmt: '1,850,000',
    crdtrRprsvNm: '제1117부대',
    ctrtrNm: '금동전기',
    isrRprsvNm: '건설공제조합',
  },
  {
    wtgrNo: '00800107204AA2003BJ00011150004',
    bdopnYmd: '2003-10-02',
    bidNm: '00지역 경계등 설치공사',
    grnteAmt: '960,000',
    crdtrRprsvNm: '제6685부대',
    ctrtrNm: '한빛전설',
    isrRprsvNm: '전기공사공제조합',
  },
]

export interface OvsBidWtgrInqFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 보증서 적용 — 선택한 입찰보증서를 부모화면(M74 해당 사업)에 적용. */
  onApply: (item: MockOvsBidWtgrItem) => void
}

export function OvsBidWtgrInqFullPopup({ open, onOpenChange, onApply }: OvsBidWtgrInqFullPopupProps) {
  // 보증서정보(P76) 펼침 대상 보증서번호 — null=모두 접힘. 한 번에 한 카드만.
  const [expandedNo, setExpandedNo] = useState<string | null>(null)

  // On-Load 입찰보증서 목록 조회(scwin.onpageload) — 목업.
  // 추후 API: bdService.selectBidWtgrList
  const list = MOCK_WTGR_LIST

  // 보증서 적용(scwin.btn_confirm_onclick).
  const applyWtgr = (item: MockOvsBidWtgrItem) => {
    console.log('[P75] 보증서 적용', item.wtgrNo)
    setExpandedNo(null)
    onApply(item)
  }

  // 보증서 목록 → Card props 매핑(설계서: 보증서번호·입찰건명 + 개찰일자/보증금액/보증채권자/계약자·발행자).
  // footer = (펼침 시) 보증서정보 상세 + [정보 보기/접기][보증서 적용].
  const cardItems: CardListItem[] = list.map((it) => {
    const expanded = expandedNo === it.wtgrNo
    return {
      id: it.wtgrNo,
      subtitle: `보증서번호 ${it.wtgrNo}`,
      title: it.bidNm,
      rows: [
        { label: '개찰일자', value: it.bdopnYmd },
        { label: '보증금액', value: it.grnteAmt },
        { label: '보증채권자', value: it.crdtrRprsvNm },
        { label: '계약자 / 발행자', value: `${it.ctrtrNm} / ${it.isrRprsvNm}` },
      ],
      footer: (
        <div className="flex flex-col gap-krds-7">
          {/* 보증서정보조회(P76) — 카드 밑에 이어서 펼침(통합) */}
          {expanded && (
            <div id={`wtgr-dtl-${it.wtgrNo}`} role="region" aria-label="보증서 정보">
              <OvsBidWtgrDtl item={it} />
            </div>
          )}
          <ButtonGroup
            layout="split"
            items={[
              {
                label: expanded ? '보증서 정보 접기' : '보증서 정보 보기',
                variant: 'secondary',
                onClick: () => {
                  console.log('[P75] 보증서정보(P76) 펼침', it.wtgrNo, !expanded)
                  setExpandedNo(expanded ? null : it.wtgrNo)
                },
              },
              { label: '보증서 적용', variant: 'primary', onClick: () => applyWtgr(it) },
            ]}
          />
        </div>
      ),
    }
  })

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="입찰보증서 선택"
      footer={
        // 하단 [닫기] — v0.87 검토91
        <ButtonGroup
          layout="single"
          items={[{ label: '닫기', variant: 'secondary', onClick: () => onOpenChange(false) }]}
        />
      }
    >
      {/* 업무도움 — v0.87 검토91 (문구는 구 Stp3 '안내사항' 보증서 안내 재사용) */}
      <HelpDisclosure
        items={[
          '보증금납부방법이 전자보증서인 경우 [보증서 적용]으로 전자보증서 정보를 적용하면 증권번호/보증기관명이 자동 입력됩니다.',
        ]}
      />
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {/* 총 건수 */}
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {list.length}건</p>

        {/* 전자입찰보증서 목록 — 카드별 정보 보기(카드 밑 펼침)/적용 */}
        <CardList items={cardItems} />
      </div>
    </FullPopup>
  )
}
OvsBidWtgrInqFullPopup.displayName = 'OvsBidWtgrInqFullPopup'
