// 납품통지목록 풀팝업 — MUI-EX-01-P10 DlvgdsAvtsmtList. 설계서 04.이행 v0.83 slide13, 15~16.
// 검사통합목록(M01)에서 물품/용역 계약 카드 클릭 → 해당 계약에 물린 납품통지 전체 목록(기간 제한 없음).
// 구성: 건수·표시개수 + 통지 카드 목록 + 더보기 + footer 닫기.
// 통지 카드 클릭 → 검사및납품조서목록(P11) 바텀시트 — 컨테이너(BottomSheet)는 이 풀팝업이 소유,
// 콘텐츠는 InspDlvdocList(슬롯 조합, *Sheet 래퍼 금지).
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDlvgdsAvtsmtList } from '@/queries/ex'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { InspDlvdocList } from '@/ui/biz/ex/inspIntgListInq/InspDlvdocList'
import type { InspDlvdocItem } from '@/types/ex'

export interface DlvgdsAvtsmtListFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 조회 대상 계약번호 — M01 목록 카드에서 주입. */
  ctrtNo: string
  /** 선택 계약명 — P11 바텀시트 타이틀("{계약명} 목록", slide14 1]). */
  ctrtNm: string
}

export function DlvgdsAvtsmtListFullPopup({
  open,
  onOpenChange,
  ctrtNo,
  ctrtNm,
}: DlvgdsAvtsmtListFullPopupProps) {
  const navigate = useNavigate()
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // P11 바텀시트 — 선택한 통지번호(null=닫힘)
  const [pickedAvtsmtNo, setPickedAvtsmtNo] = useState<string | null>(null)

  const { data: items = [], isLoading } = useDlvgdsAvtsmtList(ctrtNo, open)

  // 닫힘 시 로컬 상태 초기화 — 이 래퍼는 부모(M01)가 open prop 으로만 토글하고 항상 마운트라
  // 리셋 없이는 재오픈 때 이전 계약의 P11 시트(stale avtsmtNo)·더보기 진행 상태가 남는다.
  useEffect(() => {
    if (!open) {
      setPage(1)
      setPageSize(10)
      setPickedAvtsmtNo(null)
    }
  }, [open])

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 조서 카드 클릭(P11) — 중앙조달(M02)/부대조달(M03) 상세 분기(slide16 이벤트, sbsdPrcmYn 임시 키).
  const handleDlvdocClick = (item: InspDlvdocItem) => {
    if (item.sbsdPrcmYn === 'Y') {
      navigate(`/ex/dlvdoc/sbsd/${item.id}`, { state: item })
      return
    }
    navigate(`/ex/dlvdoc/${item.id}`, { state: item })
  }

  // 통지 카드 매핑 — slide13 목업: 뱃지(업무구분/예산구분) + 통지번호 + title(계약명) +
  // 행(계약수량/작성수량/납품완료수량/계약금액/계약단가/납기일자/납지명).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSecd}</Badge>
        <Badge>{it.bgtSecdNm}</Badge>
      </>
    ),
    subtitle: `통지번호 ${it.avtsmtNo}`,
    title: it.ctrtNm,
    rows: [
      { label: '계약수량', value: it.ctrtQty.toLocaleString() },
      { label: '작성수량', value: it.wrtQty.toLocaleString() },
      { label: '납품완료수량', value: it.dlvgdsCmptnQty.toLocaleString() },
      { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원` },
      { label: '계약단가', value: `${it.ctrtUprc.toLocaleString()} 원` },
      { label: '납기일자', value: it.dudtYmd },
      { label: '납지명', value: it.plcdlvNm },
    ],
    onClick: () => setPickedAvtsmtNo(it.avtsmtNo),
  }))

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="납품통지목록"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col pb-8">
        {/* 건수·표시개수(slide13 2]) */}
        <ListSectionHeader
          variant="background"
          total={total}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />

        <div className="flex flex-col gap-krds-7 px-4 pt-krds-7">
          <CardList items={cardItems} loading={isLoading} />

          {/* 더보기 — 표시개수만큼 추가 로드. 모두 노출됐으면 숨김. */}
          {loaded < total && (
            <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
              더보기 ({loaded}/{total}건)
            </Button>
          )}
        </div>
      </div>

      {/* 검사및납품조서목록(P11) 바텀시트 — 타이틀=선택 계약명(slide14 1]) */}
      <BottomSheet
        open={pickedAvtsmtNo !== null}
        onOpenChange={(sheetOpen) => {
          if (!sheetOpen) setPickedAvtsmtNo(null)
        }}
        title={`${ctrtNm} 목록`}
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setPickedAvtsmtNo(null)}>
            닫기
          </Button>
        }
      >
        <InspDlvdocList
          ctrtNo={ctrtNo}
          avtsmtNo={pickedAvtsmtNo ?? ''}
          open={pickedAvtsmtNo !== null}
          onItemClick={handleDlvdocClick}
        />
      </BottomSheet>
    </FullPopup>
  )
}
DlvgdsAvtsmtListFullPopup.displayName = 'DlvgdsAvtsmtListFullPopup'
