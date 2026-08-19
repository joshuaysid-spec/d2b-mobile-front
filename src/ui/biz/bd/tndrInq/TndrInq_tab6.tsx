// 입찰진행상세 - 입찰서(견적서)조회 동가낙찰선추첨 (MUI-BD-06-T06, 설계서 영문ID TndrInq_tab6 · 02입찰 v1.88 slide177).
// 호스트 페이지(TndrInqPage)의 '6. 동가낙찰 선추첨' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 설계서 slide177: "입찰서작성중 동가낙찰선추첨(MUI-BD-06-M06) 화면 내용" — 작성판의 [가위][바위][보] 선택
//   버튼이 조회판에서는 제출된 차수별 선택값 표시로 바뀐다.
// 항목명은 데이터영역(slide130 dmt_smprcScsbdChc) 그대로: 1차~5차 = smprcScsbdChcCd1~smprcScsbdChcCd5.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 제출된 선추첨 선택값(dmt_smprcScsbdChc) 목업 — 설계서 slide177 예시(가위/바위/가위/바위/가위).
const ROWS: TableRow[] = [
  { label: '1차', value: '가위' }, // smprcScsbdChcCd1
  { label: '2차', value: '바위' }, // smprcScsbdChcCd2
  { label: '3차', value: '가위' }, // smprcScsbdChcCd3
  { label: '4차', value: '바위' }, // smprcScsbdChcCd4
  { label: '5차', value: '가위' }, // smprcScsbdChcCd5
]

export function TndrInq_tab6() {
  return (
    <>
      {/* 안내사항 — 설계서 slide177 원문 */}
      <Infobox
        title="안내사항"
        defaultOpen
        items={['동가입찰시 낙찰자 결정을 위해 [가위, 바위, 보]를 5차까지 선택합니다.']}
      />

      <SectionTitle as="h3" topDivider>
        동가낙찰 선추첨
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={ROWS} />
      </div>
    </>
  )
}
TndrInq_tab6.displayName = 'TndrInq_tab6'
