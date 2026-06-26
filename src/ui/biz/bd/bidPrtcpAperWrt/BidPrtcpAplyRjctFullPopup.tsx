// 입찰참가등록반려(신청/조회) (MUI-BD-03-P07, 설계서 영문ID BidPrtcpAplyRjct · slide87·88).
// 접속: 홈 > 입찰진행 > 상세 > 입찰참가신청서 작성 화면(M01)의 플로팅 [등록반려]/[반려신청조회] → 풀팝업.
//   - mode 'apply' : 등록반려 신청(입찰등록심사 전) — footer 제출하기/취소.
//   - mode 'view'  : 반려신청조회(신청 후)        — footer 출력/닫기(읽기전용).
// 구성(설계서): 공고일반(dmt_bidPbancInfo) + 반려 서약문. 항목명/형식 데이터영역 그대로. 백엔드 미연동(스텁).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem } from '@/types/bd'

export interface BidPrtcpAplyRjctFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 신청(apply) / 신청후 조회(view). 'view' 면 읽기전용(출력/닫기). */
  mode: 'apply' | 'view'
  /** 입찰참가신청서 화면에서 넘겨준 항목 — 공고 식별/표시값 시드. */
  detail: BidPrgrsItem
}

export function BidPrtcpAplyRjctFullPopup({
  open,
  onOpenChange,
  mode,
  detail,
}: BidPrtcpAplyRjctFullPopupProps) {
  // 공고일반(dmt_bidPbancInfo) — 항목명/형식 설계서 그대로(상세 항목 + 업체내역 목업).
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

  const handleSubmit = () => {
    console.log('[P07] 입찰참가등록반려 신청', { pbancNo: detail.pbancNo })
    // 추후 API: bdService.applyBidPrtcpRegReject(detail.pbancNo)
    onOpenChange(false)
  }
  const handlePrint = () => console.log('[P07] 입찰참가등록반려 신청서 출력')

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="입찰참가등록반려"
      footer={
        mode === 'apply' ? (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => onOpenChange(false) },
              { label: '제출하기', variant: 'primary', onClick: handleSubmit },
            ]}
          />
        ) : (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '출력', variant: 'secondary', onClick: handlePrint },
              { label: '닫기', variant: 'primary', onClick: () => onOpenChange(false) },
            ]}
          />
        )
      }
    >
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <SummaryInfo
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

        {/* 반려 서약문 — 설계서 문구 그대로, 가운데 정렬 */}
        <div className="flex flex-col items-center gap-krds-7 px-krds-8 py-krds-10 text-center">
          <p className="text-krds-body-md text-krds-text-ink">
            우리 회사가 귀 부대에 제출한 전자입찰서를 취소하오니, 무효 처리하여 주시기 바랍니다.
          </p>
          <p className="text-krds-body-md text-krds-text-ink">0000 년 00 월 00 일</p>
          <p className="text-krds-body-md text-krds-text-ink">000000 재무관 귀하</p>
        </div>
      </div>
    </FullPopup>
  )
}
BidPrtcpAplyRjctFullPopup.displayName = 'BidPrtcpAplyRjctFullPopup'
