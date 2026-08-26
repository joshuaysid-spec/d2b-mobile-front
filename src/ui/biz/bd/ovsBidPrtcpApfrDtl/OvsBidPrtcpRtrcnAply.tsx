// MUI-BD-04-P82 입찰참가신청서취소 — 바텀시트 콘텐츠 전용(컨테이너/footer 는 부모 페이지 소유).
// 설계서 slide357~359. 레퍼런스: 국내 입찰취소신청서 BidRtrcnAperInq(콘텐츠+ref 핸들 패턴) — 디자인 통일.
// 구성: 취소신청내역(dl_resultInfo — 공고/사업/신청업체/입찰업체) + 취소사유(rsn, 최대 4000자)
//   + 서약문 + 제출확인 AlertModal. footer '제출하기' 는 부모가 ref(useImperativeHandle)로 submit() 호출.
// 개별 건(탭3 개별 입찰참가취소) / 전체 건(플로팅 전체 입찰참가취소) 모두 targets 배열로 받는다.
import { forwardRef, useImperativeHandle, useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  OvsBidPrtcpApfrDetail,
  OvsRtrcnTarget,
  OvsSbtInfo,
  OvsSplyInfo,
} from '@/types/mock/bd'

export interface OvsBidPrtcpRtrcnAplyHandle {
  /** 부모 BottomSheet footer '제출하기' 가 호출 — 제출확인 모달을 띄운다 */
  submit: () => void
}

interface OvsBidPrtcpRtrcnAplyProps {
  /** 공고일반 — 페이지 detail 로 취소신청내역 상단(공고 식별값)을 그린다 */
  detail: OvsBidPrtcpApfrDetail
  /** 신청업체(dm_sbtInfo) */
  sbtInfo: OvsSbtInfo
  /** 입찰업체(dm_splyInfo) */
  splyInfo: OvsSplyInfo
  /** 취소 대상 사업(개별 1건 또는 전체 건) — 사업명/구매요청번호/취소신청품목수 산출 */
  targets: OvsRtrcnTarget[]
  /** 제출 완료(확인) 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

// 취소사유(rsn) 최대 길이 — 설계서 slide358 자리수 4000.
const RTRCN_RSN_MAX = 4000

// 대상이 여러 건이면 '첫 값 외 N건' 으로 요약 표기.
const summarize = (values: string[]) =>
  values.length > 1 ? `${values[0]} 외 ${values.length - 1}건` : (values[0] ?? '-')

const OvsBidPrtcpRtrcnAply = forwardRef<OvsBidPrtcpRtrcnAplyHandle, OvsBidPrtcpRtrcnAplyProps>(
  ({ detail, sbtInfo, splyInfo, targets, onSubmitted }, ref) => {
    // 취소사유(dl_sbmsnInfo.rsn) — 필수 입력.
    const [rsn, setRsn] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)

    // footer '제출하기' → 제출확인 모달 오픈
    useImperativeHandle(ref, () => ({ submit: () => setConfirmOpen(true) }), [])

    const handleConfirm = () => {
      console.log('[P82] 입찰참가신청서취소 제출', {
        pbancNo: detail.pbancNo,
        pbancOd: detail.pbancOd,
        targets: targets.map((t) => t.prchsDmndNo),
        rsn,
      })
      // 추후 API: bdService.inserBidPrtcpRtrcnAply
      setConfirmOpen(false)
      onSubmitted()
    }

    // 취소신청내역(dl_resultInfo, slide358) — 공고 + 대상 사업 요약.
    const rtrcnRows: TableRow[] = [
      { label: '공고번호-차수', value: `${detail.pbancNo}-${detail.pbancOd}` },
      { label: '사업명', value: summarize(targets.map((t) => t.bizNm)) },
      { label: '구매요청번호', value: summarize(targets.map((t) => t.prchsDmndNo)) },
      { label: '통합참조번호', value: detail.intgRfrncNo },
      { label: '개찰일자', value: detail.bdopnYmd },
      {
        label: '취소신청품목수',
        value: targets.reduce((sum, t) => sum + t.rtrcnItemQty, 0).toLocaleString(),
        type: 'number',
      },
    ]
    // 신청업체(dl_resultInfo sbt*)
    const sbtRows: TableRow[] = [
      { label: '업체코드', value: sbtInfo.sbtBzentyCd },
      { label: '업체명', value: sbtInfo.sbtBzentyNm },
      { label: '대표자', value: sbtInfo.sbtRprsvNm },
      { label: '사업자번호', value: sbtInfo.sbtBzmnNo },
    ]
    // 입찰업체(dl_resultInfo sply*)
    const splyRows: TableRow[] = [
      { label: '업체코드', value: splyInfo.splyBzentyCd },
      { label: '업체명', value: splyInfo.splyBzentyNm },
      { label: '대표자', value: splyInfo.splyRprsvNm },
      { label: '사업자번호', value: splyInfo.splyBzmnNo },
    ]

    return (
      <div className="flex flex-col">
        {/* 취소신청내역 — flush(콘텐츠) + triggerClassName px-0(타이틀 바): 시트 본문(px-16) 안이라
            아코디언 좌우 패딩 전부 제거(2중 패딩 방지 — 타이틀 왼쪽 여백 제거는 사용자 지시 2026-08-26) */}
        <Accordion type="multiple" defaultValue={['rtrcn', 'sbt', 'sply']}>
          <AccordionSection value="rtrcn" title="취소신청내역" borderTop={false} flush triggerClassName="px-0">
            <Table rows={rtrcnRows} />
          </AccordionSection>
          <AccordionSection value="sbt" title="신청업체" flush triggerClassName="px-0">
            <Table rows={sbtRows} />
          </AccordionSection>
          <AccordionSection value="sply" title="입찰업체" flush triggerClassName="px-0">
            <Table rows={splyRows} />
          </AccordionSection>
        </Accordion>

        {/* 취소사유(rsn) — 좌우 패딩은 시트 본문(px-16) 제공, 여기선 상하 간격만 */}
        <div className="flex flex-col gap-krds-5 py-krds-8">
          <InputLabel htmlFor="rsn" required>
            취소사유
          </InputLabel>
          <TextArea
            id="rsn"
            value={rsn}
            onChange={(e) => setRsn(e.target.value)}
            maxLength={RTRCN_RSN_MAX}
            placeholder="내용을 입력하세요."
          />
          <div className="text-right text-krds-body-sm text-krds-text-muted tabular-nums">
            {rsn.length} / {RTRCN_RSN_MAX}
          </div>
        </div>

        {/* 서약문(slide357) — OathBox 와 동일 스타일(귀하 행이 '방위사업청장'이라 로컬 렌더) */}
        <div className="pb-krds-8 pt-krds-5">
          <div className="flex flex-col items-center justify-center gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8 text-center">
            <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
              우리 회사가 귀 청에 제출한 전자입찰서를 취소하오니, 무효 처리하여 주시기 바랍니다.
            </p>
            <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
              0000 년 00 월 00 일
            </p>
            <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
              방위사업청장 귀하
            </p>
          </div>
        </div>

        {/* 제출확인 */}
        <AlertModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          variant="check"
          title="입찰참가신청서 취소를 제출하시겠습니까?"
          secondaryAction={{ label: '취소' }}
          primaryAction={{ label: '확인', onClick: handleConfirm }}
        />
      </div>
    )
  },
)
OvsBidPrtcpRtrcnAply.displayName = 'OvsBidPrtcpRtrcnAply'

export { OvsBidPrtcpRtrcnAply }
