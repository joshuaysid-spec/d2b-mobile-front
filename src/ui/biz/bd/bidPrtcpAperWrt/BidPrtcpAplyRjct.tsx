// 입찰참가등록반려(신청/조회) (MUI-BD-03-P07, 설계서 영문ID BidPrtcpAplyRjct · slide87·88).
// 접속: 홈 > 입찰진행 > 상세 > 입찰참가신청서 작성(M05)의 플로팅 [등록반려]/[반려신청조회] → 바텀시트.
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(M05 페이지)가 소유, 여기엔 본문만.
//    footer 는 mode 에 따라 부모가 구성: 'apply'=제출하기/취소(제출은 ref.submit()) · 'view'=출력/닫기.
// 구성(설계서): 공고일반(dmt_bidPbancInfo) + 반려 서약문(OathBox). 항목명/형식 데이터영역 그대로. 백엔드 미연동(스텁).
import { forwardRef, useImperativeHandle } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OathBox } from '@/ui/biz/bd/OathBox'
import type { BidPrgrsItem } from '@/types/bd'

export interface BidPrtcpAplyRjctHandle {
  /** 부모 BottomSheet footer '제출하기'(apply 모드)가 호출 — 신청 처리 후 onSubmitted() */
  submit: () => void
}

interface BidPrtcpAplyRjctProps {
  /** 입찰참가신청서 화면에서 넘겨준 항목 — 공고 식별/표시값 시드. */
  detail: BidPrgrsItem
  /** 신청 완료 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

const BidPrtcpAplyRjct = forwardRef<BidPrtcpAplyRjctHandle, BidPrtcpAplyRjctProps>(
  ({ detail, onSubmitted }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          console.log('[P07] 입찰참가등록반려 신청', { pbancNo: detail.pbancNo })
          // 추후 API: bdService.insertBidPrtcpRegRjctAply(detail.pbancNo)
          onSubmitted()
        },
      }),
      [detail, onSubmitted],
    )

    // 공고일반(dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 업체내역 목업.
    const pbancRows: TableRow[] = [
      { label: '공고번호', value: detail.pbancNo },
      { label: '발주기관', value: '육군 탄약지원사령부' },
      { label: '판단번호/공사번호', value: detail.prcmNo },
      { label: '통합참조번호', value: detail.rfrncNo },
      { label: '업체코드', value: '00000' },
      { label: '업체명', value: '㈜업체명표기영역' },
      { label: '대표자', value: '홍길동' },
      { label: '사업자등록번호', value: '123-56-78901' },
    ]

    return (
      <div className="flex flex-col gap-krds-7">
        <SummaryInfo
          flushX
          badges={[
            { key: 'task', label: detail.taskSeNm },
            { key: 'ctrt', label: detail.ctrtMthdNm },
            { key: 'bfhd', label: '사전심사' },
            { key: 'apfr', label: '입찰참가' },
          ]}
          subtitle={detail.pbancNo}
          title={detail.bidNm}
        />

        <Accordion type="multiple" defaultValue={['pbanc']}>
          <AccordionSection value="pbanc" title="공고일반" variant="blue" borderTop={false} flush>
            <Table rows={pbancRows} />
          </AccordionSection>
        </Accordion>

        {/* 반려 서약문 박스(Figma 9300-43269) */}
        <OathBox statement="우리 회사가 귀 부대에 제출한 전자입찰서를 취소하오니 무효 처리하여 주시기 바랍니다." />
      </div>
    )
  },
)
BidPrtcpAplyRjct.displayName = 'BidPrtcpAplyRjct'

export { BidPrtcpAplyRjct }
