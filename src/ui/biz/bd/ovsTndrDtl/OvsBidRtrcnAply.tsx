// 입찰취소신청서작성 (MUI-BD-06-P81, 설계서 slide389 · 항목설명 slide390~391).
// 국외 입찰서 상세 바로가기 '투찰취소' → 업체담당자가 입찰 취소신청을 하는 화면.
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(OvsTndrDtlPage)가 소유, 여기엔 본문만.
//    footer '제출하기' 는 부모가 ref(useImperativeHandle)로 submit() 호출 → 제출확인 모달.
//    (국내 입찰취소신청서작성 BidRtrcnAperInq 와 동일 패턴)
// 구성: 취소신청내역(dl_resultInfo — 공고/신청업체/입찰업체/취소 신청건 품목)
//    + 취소사유(dl_sbmsnInfo.rsn, 필수·4000자) + 서약문 박스 + 제출확인(AlertModal).
//    (상단 요약 SummaryInfo 는 삭제 — 사용자 지시 2026-08-26)
import { forwardRef, useImperativeHandle, useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockOvsTndrDtlItem } from '@/types/mock/bd'

export interface OvsBidRtrcnAplyHandle {
  /** 부모 BottomSheet footer '제출하기' 가 호출 — 제출확인 모달을 띄운다 */
  submit: () => void
}

export interface OvsBidRtrcnAplyProps {
  /** 상세에서 넘어온 항목 — 취소신청내역(공고 식별값)을 이 항목으로 그린다. */
  detail: MockOvsTndrDtlItem
  /** 제출 완료(확인) 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

// 취소사유(rsn) — 필수, 자리수 4000 (설계서 slide391 dl_sbmsnInfo).
const BID_RTRCN_RSN_MAX = 4000

// 신청업체 (dl_resultInfo sbt*, 설계서 slide391) — 로그인 업체 정보라 목업.
const MOCK_SBT_INFO = {
  sbtBzentyCd: '7001',
  sbtBzentyNm: 'FA무역대리점',
  sbtRprsvNm: '홍길동',
  sbtBzmnNo: '123-45-67890',
}

// 입찰업체 (dl_resultInfo sply*, 설계서 slide391) — 목업.
const MOCK_SPLY_INFO = {
  splyBzentyCd: '7004',
  splyBzentyNm: 'FB해외업체',
  splyRprsvNm: '홍길동',
  splyBzmnNo: '123-45-67890',
}

// 취소 신청건 품목 1건 (dl_resultInfo frcptlArtclNo/invtNo/prtsNo/itemNm, 설계서 slide390~391) — 목업.
interface OvsRtrcnItem {
  frcptlArtclNo: string // 항목번호(5)
  invtNo: string // 재고번호(9)
  prtsNo: string // 부품번호(32)
  itemNm: string // 품명(200)
}
const MOCK_RTRCN_ITEM_LIST: OvsRtrcnItem[] = [
  { frcptlArtclNo: '1', invtNo: '101537518', prtsNo: '9752A46MSB07', itemNm: '500MD 헬기 수리부속' },
]

// 취소 신청건 품목 1건 → 구분/내용 표 rows.
const buildRtrcnItemRows = (it: OvsRtrcnItem): TableRow[] => [
  { label: '항목번호', value: it.frcptlArtclNo },
  { label: '재고번호', value: it.invtNo },
  { label: '부품번호', value: it.prtsNo },
  { label: '품명', value: it.itemNm },
]

const OvsBidRtrcnAply = forwardRef<OvsBidRtrcnAplyHandle, OvsBidRtrcnAplyProps>(
  ({ detail, onSubmitted }, ref) => {
    // 취소신청내역 — 공고 식별값(pbancNo/pbancOd/bizNm/prchsDmndNo/intgRfrncNo)은 상세 항목으로 구동.
    const pbancRows: TableRow[] = [
      { label: '공고번호-차수', value: `${detail.pbancNo}-${detail.pbancOd}` },
      { label: '사업명', value: detail.bizNm },
      { label: '구매요청번호', value: detail.prchsDmndNo },
      { label: '통합참조번호', value: detail.intgRfrncNo },
    ]
    const sbtRows: TableRow[] = [
      { label: '업체코드', value: MOCK_SBT_INFO.sbtBzentyCd },
      { label: '업체명', value: MOCK_SBT_INFO.sbtBzentyNm },
      { label: '대표자', value: MOCK_SBT_INFO.sbtRprsvNm },
      { label: '사업자번호 (DUNS NUM)', value: MOCK_SBT_INFO.sbtBzmnNo },
    ]
    const splyRows: TableRow[] = [
      { label: '업체코드', value: MOCK_SPLY_INFO.splyBzentyCd },
      { label: '업체명', value: MOCK_SPLY_INFO.splyBzentyNm },
      { label: '대표자', value: MOCK_SPLY_INFO.splyRprsvNm },
      { label: '사업자번호 (DUNS NUM)', value: MOCK_SPLY_INFO.splyBzmnNo },
    ]

    // 취소사유(rsn) — 필수, 최대 4000자.
    const [rsn, setRsn] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)

    // footer '제출하기' → 제출확인 모달 오픈
    useImperativeHandle(ref, () => ({ submit: () => setConfirmOpen(true) }), [])

    const handleConfirm = () => {
      console.log('[P81] 입찰취소 신청서 제출', { rsn }) // 추후 API: bdService.insertAplyBdngRtrcn — 투찰취소신청
      setConfirmOpen(false)
      onSubmitted()
    }

    return (
      <div className="flex flex-col gap-krds-7">
        <div className="flex flex-col">
          {/* 상단 요약(SummaryInfo)은 삭제 — 바로 취소신청내역부터 시작(사용자 지시 2026-08-26) */}
          {/* 취소신청내역 — flush: 시트 본문(px-16) 안이라 아코디언 콘텐츠 좌우 패딩 제거(2중 패딩 방지) */}
          <Accordion type="multiple" defaultValue={['pbanc', 'sbt', 'sply', 'item']}>
            <AccordionSection value="pbanc" title="취소신청내역" borderTop={false} flush triggerClassName="px-0">
              <Table rows={pbancRows} />
            </AccordionSection>
            <AccordionSection value="sbt" title="신청업체" flush triggerClassName="px-0">
              <Table rows={sbtRows} />
            </AccordionSection>
            <AccordionSection value="sply" title="입찰업체" flush triggerClassName="px-0">
              <Table rows={splyRows} />
            </AccordionSection>
            <AccordionSection
              value="item"
              title={`취소 신청건 (총 ${MOCK_RTRCN_ITEM_LIST.length}건)`}
              flush
              triggerClassName="px-0"
            >
              {MOCK_RTRCN_ITEM_LIST.map((it) => (
                <Table key={it.frcptlArtclNo} rows={buildRtrcnItemRows(it)} />
              ))}
            </AccordionSection>
          </Accordion>

          {/* 취소사유 — 좌우 패딩은 시트 본문(px-16)이 제공, 여기선 상하 간격만 */}
          <div className="flex flex-col gap-krds-5 py-krds-8">
            <InputLabel htmlFor="ovsBidRtrcnRsn" required>
              취소사유
            </InputLabel>
            <TextArea
              id="ovsBidRtrcnRsn"
              value={rsn}
              onChange={(e) => setRsn(e.target.value)}
              maxLength={BID_RTRCN_RSN_MAX}
              placeholder="내용을 입력하세요."
            />
            <div className="text-right text-krds-body-sm text-krds-text-muted tabular-nums">
              {rsn.length} / {BID_RTRCN_RSN_MAX}
            </div>
          </div>

          {/* 서약문 박스 — 국내 OathBox 와 동일 시각(마지막 행이 '방위사업청장 귀하'라 재사용 불가, 설계서 slide389).
              OathBox 는 '재무관 귀하' 고정이라 수신처 prop 필요 → newComponentRequests 보고, 여기선 인라인 구성. */}
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
        </div>

        {/* 제출확인 */}
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
OvsBidRtrcnAply.displayName = 'OvsBidRtrcnAply'

export { OvsBidRtrcnAply }
