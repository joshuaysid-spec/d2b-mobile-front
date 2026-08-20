// 평가위원별기술평가점수상세조회 — MUI-BD-09-P04 EvlMbcmtTechEvlScrDtl.
// 설계서 02.입찰 v1.88 slide251~252 (2026-08-13 화면 추가).
// ⚠️ slide251 에 찍힌 화면 ID 는 MUI-BD-09-P03(동가낙찰결과와 중복) 으로 설계서 오기 — 화면목록(slide217)의 P04 가 정본.
// 입찰결과 탭(T03) 각 업체 행의 '기술점수' 버튼(slide245 scwin.grid_onclick)으로 진입.
// 비공개 건은 evlMbcmtNm·evlScr 대신 prvtRsn 만 내려온다(slide252 비고) — 라벨/값 모두 그에 맞춰 분기.
import { bdQueries } from '@/queries/bds/bd/bdQueries'
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

export function EvlMbcmtTechEvlScrDtlFullPopup({
  bidRsltId,
  open,
  onOpenChange,
}: EvlMbcmtTechEvlScrDtlFullPopupProps) {
  const { data: items = [] } = bdQueries.useSelectEvlMbcmtTechEvlScrInfo(bidRsltId, open)

  // 업체정보 — 목록 전체가 한 업체 것이라 첫 건의 업체명 사용(slide251 업체정보 영역).
  const bzentyRows: TableRow[] = [{ label: '업체명', value: items[0]?.bzentyNm ?? '-' }]

  // 평가점수 — 평가위원별 1행. 비공개면 위원명 자리에 '비공개', 점수 자리에 비공개사유(slide251 헤더 '평가점수 / 비공개사유').
  const scoreRows: TableRow[] = items.map((it) => ({
    label: it.evlMbcmtNm ?? '비공개',
    value: it.evlScr !== undefined ? `${it.evlScr}점` : (it.prvtRsn ?? '-'),
    type: it.evlScr !== undefined ? 'number' : 'default',
  }))

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
      <div className="flex flex-col gap-8 pb-8">
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3">업체정보</SectionTitle>
          <div className="px-4">
            <Table rows={bzentyRows} />
          </div>
        </section>

        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" info={`총 ${items.length}건`}>
            평가점수
          </SectionTitle>
          <div className="px-4">
            <Table rows={scoreRows} />
          </div>
        </section>
      </div>
    </FullPopup>
  )
}
EvlMbcmtTechEvlScrDtlFullPopup.displayName = 'EvlMbcmtTechEvlScrDtlFullPopup'
