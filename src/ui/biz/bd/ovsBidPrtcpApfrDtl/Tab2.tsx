// 국외 입찰참가신청서 상세 - 탭2 업체정보 (MUI-BD-04-T77(구 M79 — v1.83 재편), 설계서 slide350·353).
// 페이지(OvsBidPrtcpApfrDtlPage)가 renderTabContent 로 렌더하는 탭 콘텐츠 — 요약/스텝/탭은 페이지 소유.
// 구성: 입찰업체(dm_splyInfo) Table + 입찰보증금 지급각서(LETTER OF GUARANTEE FOR PAYMENT OF BID BOND) 영문 전문.
//   영문 각서의 #입찰업체명(splyBzentyNm)·#보증금액(bidGrnteAmt)은 데이터로 치환(설계서 placeholder).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  OvsBidPrtcpApfrDetail,
  OvsSplyInfo,
} from '@/types/mock/bd'

// 달러 금액 표기 — 설계서 '000,000,000,000.00' 형식(소수 2자리).
const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

interface OvsBidPrtcpApfrDtlPage_Tab2Props {
  detail: OvsBidPrtcpApfrDetail
  splyInfo: OvsSplyInfo
}

export function OvsBidPrtcpApfrDtlPage_Tab2({ detail, splyInfo }: OvsBidPrtcpApfrDtlPage_Tab2Props) {
  // 입찰업체(dm_splyInfo, slide353)
  const splyRows: TableRow[] = [
    { label: '업체코드', value: splyInfo.splyBzentyCd },
    { label: '업체명', value: splyInfo.splyBzentyNm },
    { label: '대표자', value: splyInfo.splyRprsvNm },
    { label: '이메일', value: splyInfo.splyEmlAddr },
    { label: '전화번호', value: splyInfo.splyTlno },
    { label: '팩스', value: splyInfo.splyFxno },
    { label: '사업자등록번호', value: splyInfo.splyBzmnNo },
    { label: '주소', value: splyInfo.splyAddr },
  ]

  // 입찰보증금 지급각서 영문 전문(slide350) — #입찰업체명/#보증금액 치환.
  const letterParagraphs = [
    'Name and address of Beneficiary: Defense Acquisition Program Administration, Republic of Korea, #2-15 Younsan 2Ga-Dong, Younsan-Gu, Seoul, Korea (Whom the solicitation defines as the "DAPA" or the "Buyer")',
    `We, ${splyInfo.splyBzentyNm}, the bidder of the above referenced solicitation, have been informed of the eligibility for an exemption from establishing a bid bond, per relevant Laws and Regulation of the Republic of Korea.`,
    'Bidders are exempted from establishing bid bond unless he or she fails the following category.',
    '1. A bidder who fails to meet the bond collection of the Bidding Authorities in connection with any contract.',
    "2. A bidder who had debarred from any bid pursuant to the Art. 76 of the Enforcement Act on Contracts to Which the State is a Party and the same sanction period has not been gone by after the expiration of the debarment.",
    '3. A bidder who has not been in the business for more than one(1) year as of the closing date of bid registration.',
    `In consideration of the DAPA granting the above mentioned exemption, we hereby irrevocably and unconditionally guarantee to pay DAPA US$ ${fmtUsd(detail.bidGrnteAmt)}, the amount which would have otherwise been established as the bid bond, within 30 days upon fail to execute the contract with DAPA after the bid is awarded to us or we do not respond timely to the evaluation formalities of the bidder's qualification if we are designated as an eligible bidder.`,
    'We further agree that the DAPA is hereby authorized to deduct from any money due to us if we fail to make payment of such guaranteed amount.',
  ]

  return (
    <>
      <Accordion type="multiple" defaultValue={['sply', 'letter']} className="w-full">
        <AccordionSection value="sply" title="입찰업체" borderTop={false}>
          <Table rows={splyRows} />
        </AccordionSection>
        <AccordionSection value="letter" title="입찰보증금 지급각서">
          <div className="flex flex-col gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8">
            <p className="text-center text-[17px] font-bold leading-normal text-krds-text-info">
              LETTER OF GUARANTEE FOR PAYMENT OF BID BOND
            </p>
            {letterParagraphs.map((text) => (
              <p key={text} className="text-krds-body-sm text-krds-text-info">
                {text}
              </p>
            ))}
          </div>
        </AccordionSection>
      </Accordion>
    </>
  )
}
OvsBidPrtcpApfrDtlPage_Tab2.displayName = 'OvsBidPrtcpApfrDtlPage_Tab2'
