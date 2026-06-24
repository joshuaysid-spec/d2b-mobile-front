// MUI-BD-03-P04 입찰취소신청서작성 — 입찰취소신청서 작성 FullPopup.
// Figma 9300-43228(작성)·9300-43569(제출확인) 참고. 내용은 설계서대로.
// 기존 공통(FullPopup·SummaryInfo·Accordion·Table·TextArea·InputLabel·ButtonGroup·AlertModal)만 조립.
import * as React from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'

export interface BidRtrcnAperInqProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BID_RTRCN_RSN_MAX = 500

// 공고일반 — 설계서 dmt_bidPbancInfo 항목명/형식 그대로(목업).
const PBANC_ROWS: TableRow[] = [
  { label: '공고번호', value: '긴급공고 LDG0097-1' }, // pbancNo
  { label: '발주기관', value: '육군 탄약지원사령부' }, // orderInstNm
  { label: '판단번호/공사번호', value: '56349' }, // prcmNo
  { label: '통합참조번호', value: '2025LDG56349' }, // rfrncNo
  { label: '업체코드', value: '00000' }, // bzentyCd
  { label: '업체명', value: '㈜업체명표기영역' }, // bzentyNm
  { label: '대표자', value: '홍길동' }, // rprsvNm
  { label: '사업자등록번호', value: '123-56-78901' }, // brno
]

const BidRtrcnAperInq = ({ open, onOpenChange }: BidRtrcnAperInqProps) => {
  // 취소사유(bidRtrcnAplyRsn) — 필수, 최대 500자.
  const [bidRtrcnAplyRsn, setBidRtrcnAplyRsn] = React.useState('')
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const handleSubmit = () => {
    console.log('[P04] 입찰취소신청서 제출', { bidRtrcnAplyRsn })
    // 추후 API: bdService.submitBidCancel
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <FullPopup
        open={open}
        onOpenChange={onOpenChange}
        title="입찰취소신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              {
                label: '취소',
                variant: 'secondary',
                onClick: () => onOpenChange(false),
              },
              {
                label: '제출',
                variant: 'primary',
                onClick: () => setConfirmOpen(true),
              },
            ]}
          />
        }
      >
        <div className="flex flex-col">
          <SummaryInfo
            badges={[
              { label: '물품' },
              { label: '경쟁입찰' },
              { label: '사전심사' },
              { label: '입찰참가' },
            ]}
            subtitle="긴급공고 LDG0097-1"
            title="특수작전용대물타격무인항공기"
          />

          {/* 공고일반 */}
          <Accordion type="multiple" defaultValue={['pbanc']}>
            <AccordionSection value="pbanc" title="공고일반" borderTop={false}>
              <Table rows={PBANC_ROWS} />
            </AccordionSection>
          </Accordion>

          {/* 취소사유 */}
          <div className="flex flex-col gap-krds-5 p-krds-8">
            <InputLabel htmlFor="bidRtrcnAplyRsn" required>
              취소사유
            </InputLabel>
            <TextArea
              id="bidRtrcnAplyRsn"
              value={bidRtrcnAplyRsn}
              onChange={(e) => setBidRtrcnAplyRsn(e.target.value)}
              maxLength={BID_RTRCN_RSN_MAX}
              placeholder="내용을 입력하세요."
            />
            <div className="text-right text-krds-body-sm text-krds-text-muted tabular-nums">
              {bidRtrcnAplyRsn.length} / {BID_RTRCN_RSN_MAX}
            </div>
          </div>

          {/* 서약문(설계서 그대로, 가운데 정렬) */}
          <div className="flex flex-col items-center gap-krds-7 px-krds-8 pb-krds-9 pt-krds-5 text-center">
            <p className="text-krds-body-md leading-relaxed text-krds-text-ink">
              우리 회사가 귀 부대에 제출한 전자입찰서를 취소하오니, 무효 처리하여
              주시기 바랍니다.
            </p>
            <p className="text-krds-body-md text-krds-text-ink">
              0000 년 00 월 00 일
            </p>
            <p className="text-krds-body-md font-bold text-krds-text-ink">
              000000 재무관 귀하
            </p>
          </div>
        </div>
      </FullPopup>

      {/* 제출확인 — Figma 9300-43569 */}
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="check"
        title="입찰취소 신청서를 제출하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: handleSubmit }}
      />
    </>
  )
}
BidRtrcnAperInq.displayName = 'BidRtrcnAperInq'

export { BidRtrcnAperInq }
