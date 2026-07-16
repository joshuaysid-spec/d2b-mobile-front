// 품목 조회(품목상세정보) 콘텐츠 (MUI-CM-01-P09, 화면목록 영문 ID = ItemInq). Figma 10020:85135 / 설계서 slide167.
//   ⚠️ 설계서 deck 은 이 화면을 P08 로도 표기하나, 화면목록(slide63)의 영문 ID/유스케이스 기준 P09 품목조회(ItemInq).
//      (P08 = 등록대상품목선택 RegTrgtItemChc — 별도 컴포넌트.)
//   컨테이너(BottomSheet)·타이틀('품목상세정보')·footer([닫기])는 부모(M05 폼)가 소유 — 여기선 본문만.
//   Figma 1:1: infolist(품목코드 우측 muted) + m_table(업종코드 / 업종명(파란 링크)).
//   품목코드는 상위(등록대상품목선택/등록품목명세)에서 품목코드로 진입했을 때만 노출(slide167).
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { ItemInqDetail } from '@/types/cm'

export interface ItemInqProps {
  /** 상위에서 선택한 품목 상세(품목코드 + 업종코드/업종명). */
  detail: ItemInqDetail
  /** 업종명(링크) 클릭 — 업종 상세 이동 스텁. */
  onBzstatClick?: (bzstatCd: string) => void
}

export function ItemInq({ detail, onBzstatClick }: ItemInqProps) {
  const rows: TableRow[] = [
    { label: '업종코드', value: detail.bzstatCd },
    {
      label: '업종명',
      // Figma: 업종명은 파란 링크(업종 상세 이동). 클릭 요소는 button(전역 cursor·a11y 규칙 커버).
      value: (
        <button
          type="button"
          className="text-left text-krds-text-primary-active underline-offset-2 hover:underline"
          onClick={() => onBzstatClick?.(detail.bzstatCd)}
        >
          {detail.bzstatNm}
        </button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-krds-7">
      {/* infolist — 품목코드(라벨 좌 muted / 값 우측 muted). Figma m_card_inforow. */}
      <div className="flex w-full items-start gap-krds-5">
        <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted">
          품목 코드
        </span>
        <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-muted">
          {detail.itemCd}
        </span>
      </div>

      {/* m_table — 업종코드 / 업종명(링크) */}
      <Table rows={rows} />
    </div>
  )
}
ItemInq.displayName = 'ItemInq'
