// 공개수의협상견적서취소신청서작성 (MUI-BD-12-P82, 설계서 slide438 · 항목설명 slide439).
// 견적서 상세(M78) 우측 하단 + 바로가기 '공개수의협상견적서 취소 신청서 작성' → 이 풀팝업.
// ⚠️ FullPopup 래퍼(컨테이너/헤더/footer 자체 소유) — Figma 9973-132825 는 m_popup_header 기반 풀스크린 팝업.
//    섹션은 아코디언이 아니라 SectionTitle + Table 구조(Figma m_section title_19). 항목명 = 설계서 데이터영역 영문(dm_rtrcnAplyDsctn).
import { useState } from 'react'

import { InputLabel } from '@/ui/common/base/InputLabel'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { TextArea } from '@/ui/common/base/TextArea'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsRlsVltrnsSummary } from '@/types/bd'

export interface OvsRlsVltrnsNgtnEtdcRtrcnApfrWrtProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 견적서 상세에서 넘어온 요약 — 취소신청내역(공고 식별값)을 이 값으로 그린다. */
  detail: OvsRlsVltrnsSummary
}

// 취소사유(rsn) — 필수, 자리수 4000 (설계서 slide439 dm_rtrcnAplyDsctn).
const RTRCN_RSN_MAX = 4000

// 신청업체 (sbt*, 설계서 slide438~439) — 로그인 업체 정보라 목업.
const MOCK_SBT_INFO = {
  sbtBzentyCd: '7001F',
  sbtBzentyNm: 'A 무역대리점',
  sbtRprsvNm: '홍길동',
  sbtBzmnNo: '123-45-67890',
}

// 입찰업체 - 제작자/공급자 (sply*, 설계서 slide438~439) — 목업.
const MOCK_SPLY_INFO = {
  splyBzentyCd: '7004F',
  splyBzentyNm: 'B 해외업체',
  splyRprsvNm: '홍길동',
  splyBzmnNo: '123-45-67890',
}

// 서약문 날짜 — 오늘 날짜(제출일). 'YYYY 년 MM 월 DD 일'.
function todayLabel() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()} 년 ${mm} 월 ${dd} 일`
}

export function OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt({
  open,
  onOpenChange,
  detail,
}: OvsRlsVltrnsNgtnEtdcRtrcnApfrWrtProps) {
  const [rsn, setRsn] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  // 취소신청내역 — 공고 식별값(pbancNo/bizNm/prchsDmndNo/intgRfrncNo)은 상세 요약으로 구동.
  const pbancRows: TableRow[] = [
    { label: '공고번호-차수', value: detail.pbancNo },
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

  const handleConfirm = () => {
    console.log('[P82] 견적서 취소 신청서 제출', { rsn }) // 추후 API: bdService.cancelEtdcRtrcnApfrSbmsn
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <FullPopup
        open={open}
        onOpenChange={onOpenChange}
        title="공개수의협상견적서 취소신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => onOpenChange(false) },
              { label: '제출하기', variant: 'primary', onClick: () => setConfirmOpen(true) },
            ]}
          />
        }
      >
        {/* 취소신청내역 / 신청업체 / 입찰업체 — 아코디언 없이 섹션 제목 + 표 (Figma m_section title) */}
        <SectionTitle as="h3">취소신청내역</SectionTitle>
        <div className="px-4 py-4">
          <Table rows={pbancRows} />
        </div>

        <SectionTitle as="h3">신청업체</SectionTitle>
        <div className="px-4 py-4">
          <Table rows={sbtRows} />
        </div>

        <SectionTitle as="h3">입찰업체 - 제작자/공급자</SectionTitle>
        <div className="px-4 py-4">
          <Table rows={splyRows} />
        </div>

        {/* 취소사유 — 필수, 최대 4000자 */}
        <div className="flex flex-col gap-krds-5 px-4 py-4">
          <InputLabel htmlFor="ovsEtdcRtrcnRsn" required>
            취소사유
          </InputLabel>
          <TextArea
            id="ovsEtdcRtrcnRsn"
            value={rsn}
            onChange={(e) => setRsn(e.target.value)}
            maxLength={RTRCN_RSN_MAX}
            placeholder="내용을 입력하세요."
          />
          <div className="text-right text-krds-body-sm text-krds-text-muted tabular-nums">
            {rsn.length} / {RTRCN_RSN_MAX}
          </div>
        </div>

        {/* 서약문 박스 — 설계서 slide438 원문(귀 청 / 방위사업청장 귀하), 날짜=오늘(제출일) */}
        <div className="px-4 pb-krds-8 pt-krds-5">
          <div className="flex flex-col items-center justify-center gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8 text-center">
            <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
              우리 회사가 귀 청에 제출한 전자입찰서를 취소하오니, 무효 처리하여 주시기 바랍니다.
            </p>
            <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
              {todayLabel()}
            </p>
            <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
              방위사업청장 귀하
            </p>
          </div>
        </div>
      </FullPopup>

      {/* 제출확인 — 설계서 제출 이벤트 알럿(Figma 9973-132885, check variant) */}
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="check"
        title="견적서 취소 신청서를 제출하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: handleConfirm }}
      />
    </>
  )
}
OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt.displayName = 'OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt'
