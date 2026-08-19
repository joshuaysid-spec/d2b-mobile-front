// 입찰취소신청서조회 — 설계서 영문 화면ID MUI-BD-03-P10 (slide112, 2026-07-15 화면추가).
// 입찰서 상태가 '입찰취소'인 경우 제출한 입찰취소신청서를 그대로 호출해 보여주는 읽기전용 팝업.
// 바텀시트 콘텐츠 전용(컨테이너·footer '닫기' 는 부모 소유) — 제출 없음.
// 작성판(MUI-BD-03-P04 BidRtrcnAperInq)과 구성은 같고 취소사유(bidRtrcnAplyRsn)만 입력 → 읽기전용 표시로 바뀐다.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OathBox } from '@/ui/biz/bd/OathBox'
import type { BidPrgrsItem } from '@/types/bd'

export interface BidRtrcnAperInqDtlProps {
  /** 상세에서 넘어온 항목(navigate state) — 요약/공고일반을 이 항목으로 그린다. */
  detail: BidPrgrsItem
}

// 업체내역 (설계서 dmt_bidPbancInfo 중 업체 항목) — 로그인 업체 정보라 목록 항목에 없어 목업 유지.
const MOCK_BZENTY = {
  orderInstNm: '육군 탄약지원사령부', // 발주기관(공고 항목, 목록 미보유 → 목업)
  bzentyCd: '00000',
  bzentyNm: '㈜업체명표기영역',
  rprsvNm: '홍길동',
  brno: '123-56-78901',
}

// 제출된 취소사유(dmt_bidRtrcnAplyRsn 의 bidRtrcnAplyRsn) — 조회 화면이라 저장값 목업.
const MOCK_BID_RTRCN_APLY_RSN =
  '입찰서 작성 시 품목 단가를 잘못 기재하여 제출한 입찰서의 취소를 신청합니다.'

export function BidRtrcnAperInqDtl({ detail }: BidRtrcnAperInqDtlProps) {
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

  return (
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

      {/* 취소사유 — 조회라 disabled TextArea 로 저장값 표시(좌우 패딩은 시트 본문 제공) */}
      <div className="flex flex-col gap-krds-5 py-krds-8">
        <InputLabel htmlFor="bidRtrcnAplyRsn">취소사유</InputLabel>
        <TextArea id="bidRtrcnAplyRsn" value={MOCK_BID_RTRCN_APLY_RSN} readOnly disabled />
      </div>

      {/* 서약문 박스(Figma 9300-43269) — 좌우 패딩은 시트 본문(px-16) 제공, 하단 간격만 */}
      <div className="pb-krds-8">
        <OathBox statement="우리 회사가 귀 부대에 제출한 전자입찰서를 취소하오니 무효 처리하여 주시기 바랍니다." />
      </div>
    </div>
  )
}
BidRtrcnAperInqDtl.displayName = 'BidRtrcnAperInqDtl'
