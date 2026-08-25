// MUI-BD-03-P04 입찰취소신청서작성 — 입찰취소신청서 작성 바텀시트 콘텐츠 전용(컨테이너는 부모 소유).
// Figma 9300-43228(작성)·9300-43569(제출확인) 참고. 내용은 설계서대로.
// 부모가 BottomSheet 컨테이너(title/footer/open/onOpenChange)를 소유하고, 여기엔 콘텐츠만.
// footer '제출' 은 부모가 ref(useImperativeHandle)로 submit() 을 호출 → 제출확인 모달.
import { forwardRef, useImperativeHandle, useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OathBox } from '@/ui/biz/bd/OathBox'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

export interface BidRtrcnAperInqHandle {
  /** 부모 BottomSheet footer '제출' 이 호출 — 제출확인 모달을 띄운다 */
  submit: () => void
}

interface BidRtrcnAperInqProps {
  /** 상세에서 넘어온 항목(navigate state) — 요약/공고일반을 이 항목으로 그린다. */
  detail: MockBidPrgrsItem
  /** 제출 완료(확인) 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

const BID_RTRCN_RSN_MAX = 500

// 업체내역 (설계서 dmt_bzentyInfo) — 로그인 업체 정보라 목록 항목에 없어 목업 유지.
const MOCK_BZENTY = {
  orderInstNm: '육군 탄약지원사령부', // 발주기관(공고 항목, 목록 미보유 → 목업)
  bzentyCd: '00000',
  bzentyNm: '㈜업체명표기영역',
  rprsvNm: '홍길동',
  brno: '123-56-78901',
}

const BidRtrcnAperInq = forwardRef<BidRtrcnAperInqHandle, BidRtrcnAperInqProps>(
  ({ detail, onSubmitted }, ref) => {
    // 공고일반(dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 업체내역은 목업.
    const pbancRows: TableRow[] = [
      { label: '공고번호', value: detail.pbancNo },
      { label: '발주기관', value: MOCK_BZENTY.orderInstNm },
      { label: '판단번호/공사번호', value: detail.prcmNo },
      { label: '통합참조번호', value: detail.rfrncNo },
      { label: '업체코드', value: MOCK_BZENTY.bzentyCd },
      { label: '업체명', value: MOCK_BZENTY.bzentyNm },
      { label: '대표자', value: MOCK_BZENTY.rprsvNm },
      { label: '사업자등록번호', value: MOCK_BZENTY.brno },
    ]
    // 취소사유(bidRtrcnAplyRsn) — 필수, 최대 500자.
    const [bidRtrcnAplyRsn, setBidRtrcnAplyRsn] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)

    // footer '제출' → 제출확인 모달 오픈
    useImperativeHandle(ref, () => ({ submit: () => setConfirmOpen(true) }), [])

    const handleConfirm = () => {
      console.log('[P04] 입찰취소신청서 제출', { bidRtrcnAplyRsn })
      // 추후 API: bdService.insertBidRtrcnApfrSbmsn
      setConfirmOpen(false)
      onSubmitted()
    }

    return (
      <div className="flex flex-col gap-krds-7">
        <div className="flex flex-col">
          <SummaryInfo
            flushX
            badges={[
              { key: 'task', label: detail.taskSeNm },
              { key: 'ctrt', label: detail.ctrtMthdNm },
              ...(detail.bfhdSrng ? [{ key: 'bfhd', label: '사전심사' }] : []),
              ...(detail.bidPrgrsApfr ? [{ key: 'apfr', label: '입찰참가' }] : []),
            ]}
            subtitle={detail.pbancNo}
            title={detail.bidNm}
          />

          {/* 공고일반 — flush: 시트 본문(px-16) 안이라 아코디언 콘텐츠 좌우 패딩 제거(2중 패딩 방지) */}
          <Accordion type="multiple" defaultValue={['pbanc']}>
            <AccordionSection value="pbanc" title="공고일반" borderTop={false} flush>
              <Table rows={pbancRows} />
            </AccordionSection>
          </Accordion>

          {/* 취소사유 — 좌우 패딩은 시트 본문(px-16)이 제공, 여기선 상하 간격만(py) */}
          <div className="flex flex-col gap-krds-5 py-krds-8">
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

          {/* 서약문 박스(Figma 9300-43269) — 좌우 패딩은 시트 본문(px-16) 제공, 상하 간격만 */}
          <div className="pb-krds-8 pt-krds-5">
            <OathBox statement="우리 회사가 귀 부대에 제출한 전자입찰서를 취소하오니 무효 처리하여 주시기 바랍니다." />
          </div>
        </div>

        {/* 제출확인 — Figma 9300-43569 */}
        <AlertModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          variant="check"
          title="입찰취소 신청서를 제출하시겠습니까?"
          secondaryAction={{ label: '취소' }}
          primaryAction={{ label: '확인', onClick: handleConfirm }}
        />
      </div>
    )
  },
)
BidRtrcnAperInq.displayName = 'BidRtrcnAperInq'

export { BidRtrcnAperInq }
