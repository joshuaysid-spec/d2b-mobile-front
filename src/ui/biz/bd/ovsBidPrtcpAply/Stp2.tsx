// 스탭2 업체정보 (MUI-BD-04-T73(구 M73 — v1.83 재편) OvsBidPrtcpAplyPage_Stp2 · 설계서 slide445 · 데이터 slide449 dm_splyInfo).
// 호스트 페이지(OvsBidPrtcpAplyPage)의 '업체정보' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 구성: 입찰업체 Table(dm_splyInfo — 업체코드만 편집 E, 나머지 R)
//   → LETTER OF GUARANTEE FOR PAYMENT OF BID BOND 본문 박스(설계서 영문 원문, #입찰업체명·#보증금액 자리는 목업값 치환).
// 폼: react-hook-form + zod(ovsSplyInfoSchema) — 탭마다 RHF, 페이지는 확정값만 보관(2026-09-14 사용자 확정).
//   [다음으로]는 페이지가 ref.submit() 으로 트리거 → 통과 시 onSubmit(값) → 페이지가 저장 후 다음 탭.
//   실패 시 이동 없이 업체코드 필드에 RHF 자동 포커스(register) + 에러 문구.
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { ovsSplyInfoSchema, type OvsSplyInfoValues } from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAply.schema'
import { MOCK_SPLY_INFO } from '@/ui/biz/bd/ovsBidPrtcpAply/ovsBidPrtcpAplyMock'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// LETTER OF GUARANTEE FOR PAYMENT OF BID BOND — 설계서 slide445 영문 원문.
// #입찰업체명 → splyBzentyNm, #보증금액 → 입찰보증금 목업값 치환.
const GUARANTEE_LETTER: string[] = [
  'Name and address of Beneficiary',
  'Defense Acquisition Program Administration, Republic of Korea, #2-15 Younsan 2Ga-Dong, Younsan-Gu, Seoul, Korea (Whom the solicitation defines as the "DAPA" or the "Buyer")',
  `We, ${MOCK_SPLY_INFO.splyBzentyNm}, the bidder of the above referenced solicitation, have been informed of the eligibility for an exemption from establishing a bid bond, per Relevant Laws and Regulation of the Republic of Korea.`,
  'Bidders are exempted from establishing bid bond unless he or she fails the following category.',
  '1. A bidder who fails to meet the bond collection of the Bidding Authorities in connection with any contract.',
  '2. A bidder who had debarred from any bid pursuant to the Art. 76 of the Enforcement Act on Contracts to Which the State is a Party and the same sanction period has not been gone by after the expiration of the debarment.',
  '3. A bidder who has not been in the business for more than one(1) year as of the closing date of bid registration.',
  "In consideration of the DAPA granting the above mentioned exemption, we hereby irrevocably and unconditionally guarantee to pay DAPA US$(511.18) the amount which would have otherwise been established as the bid bond, within 30 days upon fail to execute the contract with DAPA after the bid is awarded to us or we do not respond timely to the evaluation formalities of the bidder's qualification if we are designated as an eligible bidder.",
  'We further agree that the DAPA is hereby authorized to deduct from any money due to us if we fail to make payment of such guaranteed amount.',
]

export interface Stp2Handle {
  /** 페이지 [다음으로]가 호출 — 검증 통과 시 onSubmit 실행. */
  submit: () => void
}

export interface Stp2Props {
  detail: MockBidPrgrsItem
  /** 초기값 — 페이지가 보관한 확정값(되돌아올 때) 또는 SPLY_INFO_DEFAULT. */
  defaultValues: OvsSplyInfoValues
  /** 검증 통과 시 확정값 전달 — 페이지가 저장 후 다음 탭으로. */
  onSubmit: (values: OvsSplyInfoValues) => void
}

const Stp2 = React.forwardRef<Stp2Handle, Stp2Props>(({ detail, defaultValues, onSubmit }, ref) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OvsSplyInfoValues>({
    resolver: zodResolver(ovsSplyInfoSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues,
  })

  React.useImperativeHandle(ref, () => ({
    // 업체코드는 register 입력이라 실패 시 RHF shouldFocusError 가 자동 포커스.
    submit: () => void handleSubmit(onSubmit)(),
  }))

  // 입찰업체(dm_splyInfo) — 업체코드(splyBzentyCd)만 편집(E).
  const splyRows: TableRow[] = [
    {
      label: '업체코드',
      type: 'combination',
      value: (
        <div id="field-splyBzentyCd" className="flex flex-col gap-krds-3">
          <InputBox
            id="ovsSply-splyBzentyCd"
            placeholder="업체코드를 입력하세요."
            maxLength={5}
            error={!!errors.splyBzentyCd}
            aria-invalid={!!errors.splyBzentyCd}
            aria-describedby={errors.splyBzentyCd ? 'ovsSply-splyBzentyCd-error' : undefined}
            {...register('splyBzentyCd', {
              onChange: (e) => {
                console.log('[T73] 입찰업체 업체코드 입력', { pbancNo: detail.pbancNo, splyBzentyCd: e.target.value })
                // 추후 API: bdService.selectBzentyDtl(splyBzentyCd)
              },
            })}
          />
          {errors.splyBzentyCd && (
            <InputMessage type="error" id="ovsSply-splyBzentyCd-error">
              {errors.splyBzentyCd.message}
            </InputMessage>
          )}
        </div>
      ),
    },
    { label: '업체명', value: MOCK_SPLY_INFO.splyBzentyNm },
    { label: '대표자', value: MOCK_SPLY_INFO.splyRprsvNm },
    { label: '이메일', value: MOCK_SPLY_INFO.splyEmlAddr },
    { label: '전화번호', value: MOCK_SPLY_INFO.splyTlno },
    { label: '팩스', value: MOCK_SPLY_INFO.splyFxno },
    { label: '사업자번호/DUNS NUM', value: MOCK_SPLY_INFO.splyBzmnNo },
    { label: '주소', value: MOCK_SPLY_INFO.splyAddr },
  ]

  return (
    // 폼 내 제출 버튼은 두지 않는다 — 페이지 액션바 [다음으로]가 ref.submit() 으로 제출.
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 입찰업체 — dm_splyInfo. 탭명과 중복되는 큰 타이틀은 제거(260709) */}
      <SectionTitle as="h3" topDivider>
        입찰업체
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={splyRows} />
      </div>

      {/* 입찰보증금 지급각서(영문) — 설계서 slide445 원문 */}
      <SectionTitle as="h3" topDivider>
        LETTER OF GUARANTEE FOR PAYMENT OF BID BOND
      </SectionTitle>
      <div className="px-4 py-4">
        <div className="flex flex-col gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8">
          {GUARANTEE_LETTER.map((p, i) => (
            <p
              key={i}
              className="text-left text-[15px] leading-relaxed text-krds-text-info wrap-break-word"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </form>
  )
})
Stp2.displayName = 'Stp2'

export { Stp2 }
