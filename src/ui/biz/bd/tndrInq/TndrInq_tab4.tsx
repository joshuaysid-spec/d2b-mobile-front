// 입찰진행상세 - 입찰서(견적서)조회 복수예비가격 (MUI-BD-06-T04, 설계서 영문ID TndrInq_tab4 · 02입찰 v1.88 slide175).
// 호스트 페이지(TndrInqPage)의 '4. 복수예비가격' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 설계서 slide175: "입찰서작성중 복수예비가격(MUI-BD-06-M04) 화면 내용" — 작성판의 1~15번 선택 버튼이
//   조회판에서는 제출된 선택 회차/번호 표시로 바뀐다.
// 항목명은 데이터영역(slide129 dmt_rsrbPrcChc) 그대로: 1회=rsrvPrcChcNo1 · 2회=rsrvPrcChcNo2.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 제출된 복수예비가격 선택값(dmt_rsrbPrcChc) 목업 — 설계서 slide175 예시(15번).
const ROWS: TableRow[] = [
  { label: '1회', value: '15번' }, // rsrvPrcChcNo1
  { label: '2회', value: '15번' }, // rsrvPrcChcNo2
]

export function TndrInq_tab4() {
  return (
    <>
      {/* 안내사항 — 복수예비가격 2개 추첨 안내(설계서 slide175 원문) */}
      <Infobox
        title="안내사항"
        defaultOpen
        items={['예정가격 결정을 위한 복수예비가격 2개를 추첨합니다.']}
      />

      <SectionTitle as="h3" topDivider>
        복수예비가격 선택
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={ROWS} />
      </div>
    </>
  )
}
TndrInq_tab4.displayName = 'TndrInq_tab4'
