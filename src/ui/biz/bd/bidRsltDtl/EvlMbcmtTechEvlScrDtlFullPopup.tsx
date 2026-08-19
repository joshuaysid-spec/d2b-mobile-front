// 평가위원별기술평가점수상세조회 — MUI-BD-09-P04 EvlMbcmtTechEvlScrDtl.
// 입찰결과 탭(T03) 각 업체 행의 '기술점수' 버튼(slide245 scwin.grid_onclick)으로 진입.
//
// ⚠️ 설계 미작성 — 기획 확정 대기.
//   설계서 02.입찰 v1.88 에 이 화면의 설계 슬라이드가 없다(slide217 화면목록 · slide245 이벤트표에만 존재).
//   데이터영역·항목명(영문)·표 구성이 미정이라 팝업 골격 + 최소 목업만 둔다.
//   확정 후 할 일: 설계서 항목명으로 타입(types/bd.ts)·목업(mocks/bd.ts)·서비스·쿼리 훅 배선
//   (P02 PrprcFullPopup / P03 SmprcScsbdRsltFullPopup 과 동일 패턴).
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'

export interface EvlMbcmtTechEvlScrDtlFullPopupProps {
  /** 기술점수를 조회할 입찰결과 행(업체) 식별자. */
  bidRsltId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 설계 확정 전 임시 목업 — 평가위원별 점수 최소 형태(항목명은 설계 확정 시 교체).
const MOCK_SCORES: { id: string; rows: TableRow[] }[] = [
  {
    id: 'evl-1',
    rows: [
      { label: '평가위원', value: '평가위원 1' },
      { label: '기술점수', value: '88.50', type: 'number' },
    ],
  },
  {
    id: 'evl-2',
    rows: [
      { label: '평가위원', value: '평가위원 2' },
      { label: '기술점수', value: '91.00', type: 'number' },
    ],
  },
]

export function EvlMbcmtTechEvlScrDtlFullPopup({
  bidRsltId,
  open,
  onOpenChange,
}: EvlMbcmtTechEvlScrDtlFullPopupProps) {
  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="평가위원별 기술평가점수"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-krds-7 pb-8">
        <SectionTitle as="h3" info={`총 ${MOCK_SCORES.length}건`}>
          평가위원별 기술평가점수
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {MOCK_SCORES.map((it) => (
            <Table key={`${bidRsltId}-${it.id}`} rows={it.rows} />
          ))}
        </div>
      </div>
    </FullPopup>
  )
}
EvlMbcmtTechEvlScrDtlFullPopup.displayName = 'EvlMbcmtTechEvlScrDtlFullPopup'
