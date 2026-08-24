// 대금청구신청목록 — MUI-WM-01-P13 PymtClmIntgAplyList. 설계서 05.대금청구및사후 v0.83 slide19~21.
// 대금청구통합목록(M01)에서 진행중 청구가 있는 계약 카드 클릭 → 해당 계약의 신청 목록 바텀시트.
// 바텀시트 콘텐츠 전용 — BottomSheet 컨테이너(title/footer)는 부모(M01 페이지)가 소유.
// 카드 클릭 시 청구서 종류별 상세 분기(M02/M03/M05~M08/M13, slide21 이벤트)는 부모 콜백으로 위임.
import { useState } from 'react'

import { wmQueries } from '@/queries/cts/wm/wmQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import type { PymtClmAplyItem } from '@/types/wm'

export interface PymtClmIntgAplyListProps {
  /** 조회 대상 계약번호 — M01 목록 카드에서 주입. */
  ctrtNo: string
  /** 선택 계약번호차수 — 상단 계약 정보 표기. */
  ctrtCycl: string
  /** 선택 계약명 — 상단 계약 정보 표기(slide19: 계약번호 + 계약명 + 총 N건). */
  ctrtNm: string
  /** 바텀시트 열림 여부 — 열릴 때만 조회(enabled). */
  open: boolean
  /** 신청 카드 클릭 — 청구서 종류별 상세 분기는 부모가 담당. */
  onItemClick: (item: PymtClmAplyItem) => void
}

export function PymtClmIntgAplyList({
  ctrtNo,
  ctrtCycl,
  ctrtNm,
  open,
  onItemClick,
}: PymtClmIntgAplyListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: items = [], isLoading } = wmQueries.useSelectPymtClmAplyList(ctrtNo, open)

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 신청 카드 매핑 — slide19 목업: 뱃지(진행상태) + 청구번호-차수 + title(청구서 종류) +
  // 행(청구금액/확정구분/세액여부/작성일자/청구일자).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.prgrsStNm}</Badge>,
    subtitle: `청구번호 ${it.clmNo} - ${it.clmOdr}`,
    title: it.clmDocNm,
    rows: [
      { label: '청구금액', value: `${it.clmAmt.toLocaleString()} 원` },
      { label: '확정구분', value: it.cnfmSeNm },
      { label: '세액여부', value: `${it.txamt.toLocaleString()} 원` },
      { label: '작성일자', value: it.wrtYmd },
      { label: '청구일자', value: it.clmYmd },
    ],
    onClick: () => onItemClick(it),
  }))

  return (
    <div className="flex flex-col gap-krds-7">
      {/* 선택 계약 정보 + 건수(slide19 상단) */}
      <div className="flex flex-col gap-krds-3">
        <p className="text-krds-body-sm text-krds-text-muted">
          계약번호 {ctrtNo} - {ctrtCycl}
        </p>
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">{ctrtNm}</p>
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {total}건</p>
      </div>

      <CardList items={cardItems} loading={isLoading} />

      {/* 더보기 — 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
          더보기 ({loaded}/{total}건)
        </Button>
      )}
    </div>
  )
}
PymtClmIntgAplyList.displayName = 'PymtClmIntgAplyList'
