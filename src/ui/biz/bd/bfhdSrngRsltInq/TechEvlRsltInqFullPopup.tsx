// 기술평가결과조회 (MUI-BD-07-P01, 설계서 영문ID TechEvlRsltInq · slide82·83).
// 접속: 홈 > 입찰진행 > 상세 > 기술평가결과조회. 입찰진행 상세(M02)의 기술평가 '내용 보기' → 풀팝업.
// 레이아웃은 slide82(총 N건 목록 + 더보기), 항목명은 데이터영역(dmt_bidPbancInfo + dmt_techEvlRslt) 그대로.
//   기술평가점수(techEvlScr)·기술평가결과(techEvlPasYn). 데이터는 목업(상세에서 넘어온 항목 기반) — 백엔드 미연동.
import { useMemo, useState } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import type { BidPrgrsItem } from '@/types/bd'

// 기술평가 결과 1건 (slide82 컬럼 + dmt_techEvlRslt 항목명)
interface TechEvlRsltRow {
  pbancNo: string // 공고번호
  rfrncNo: string // 통합참조번호
  prcmNo: string // 공사번호(판단번호)
  bidNm: string // 공사명(입찰건명)
  orderInstNm: string // 발주기관
  ctrtMthdNm: string // 계약방법
  tndrSbmsnDdlnDt: string // 견적서제출마감일시
  techEvlScr: string // 기술평가점수 (8,5)
  techEvlPasYn: boolean // 기술평가통과여부 → 합격/불합격
}

const PAGE_STEP = 10 // 더보기 10개씩(설계서 10/100)

export interface TechEvlRsltInqFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 상세에서 넘어온 항목 — 공고 식별/표시값 시드. */
  detail: BidPrgrsItem
}

export function TechEvlRsltInqFullPopup({
  open,
  onOpenChange,
  detail,
}: TechEvlRsltInqFullPopupProps) {
  const [visible, setVisible] = useState(PAGE_STEP)

  // 조회결과(목업) — 상세 항목 기반으로 구성. 추후 bdService.getTechEvlResult(pbancNo).
  const list: TechEvlRsltRow[] = useMemo(
    () => [
      {
        pbancNo: detail.pbancNo,
        rfrncNo: detail.rfrncNo,
        prcmNo: detail.prcmNo,
        bidNm: detail.bidNm,
        orderInstNm: '방위사업청',
        ctrtMthdNm: detail.ctrtMthdNm,
        tndrSbmsnDdlnDt: detail.tndrSbmsnDdlnDt,
        techEvlScr: '77.30000',
        techEvlPasYn: true,
      },
    ],
    [detail],
  )
  const total = list.length

  const cardItems: CardListItem[] = list.slice(0, visible).map((it) => ({
    id: it.pbancNo,
    subtitle: `공고번호 ${it.pbancNo}`,
    title: it.bidNm,
    badges: (
      <Badge type="solid" color={it.techEvlPasYn ? 'green' : 'red'}>
        {it.techEvlPasYn ? '합격' : '불합격'}
      </Badge>
    ),
    rows: [
      { label: '통합참조번호', value: it.rfrncNo },
      { label: '공사번호', value: it.prcmNo },
      { label: '발주기관', value: it.orderInstNm },
      { label: '계약방법', value: it.ctrtMthdNm },
      { label: '견적서제출마감일시', value: it.tndrSbmsnDdlnDt },
      { label: '기술평가점수', value: it.techEvlScr },
      { label: '기술평가결과', value: it.techEvlPasYn ? '합격' : '불합격' },
    ],
  }))

  return (
    <FullPopup open={open} onOpenChange={onOpenChange} title="기술평가결과조회">
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {total}건</p>
        <CardList items={cardItems} />
        {visible < total && (
          <Button variant="secondary" className="w-full" onClick={() => setVisible((v) => v + PAGE_STEP)}>
            더보기 ({cardItems.length}/{total}건)
          </Button>
        )}
      </div>
    </FullPopup>
  )
}
TechEvlRsltInqFullPopup.displayName = 'TechEvlRsltInqFullPopup'
