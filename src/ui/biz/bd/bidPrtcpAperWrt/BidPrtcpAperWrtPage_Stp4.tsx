// 입찰참가신청서작성 - 입찰보증금 탭 (MUI-BD-04-M08, 설계서 slide).
// 입찰참가신청서 작성(M05)의 '입찰보증금' 하위 탭 콘텐츠 — 페이지(BidPrtcpAperWrtPage)가 렌더하는 중간 본문만 담당.
// ⚠️ 요약/진행단계(StepBar)/탭(TabList)/하단 액션바는 페이지 소유 → 여기서 만들지 않는다.
// 구성(설계서 M08): 페이지타이틀 + 입찰보증금 Table(combination: SelectBox/InputBox/보기 Button) + 안내사항 Infobox.
//   납부방법 '보증금면제' 선택 시 면제사유 행 활성화 + [보기] → 보증금면제사유 바텀시트(P09, ExmptnYnDtl).
// 이 탭이 BottomSheet 컨테이너(title='보증금면제사유', footer 닫기)를 직접 소유하고 콘텐츠로 ExmptnYnDtl 렌더.
// 값은 설계서 형식대로 목업(개찰일자 2025-11-25 13:00, 보증금액 619,520,000 원 등) — 백엔드 미연동.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { ExmptnYnDtl } from '@/ui/biz/bd/bidPrtcpAperWrt/ExmptnYnDtl'
import type { BidPrgrsItem } from '@/types/bd'

// 보증금 납부방법(설계서 M08) — 현금/전자보증서/보증금면제.
const PAY_METHODS = [
  { value: 'cash', label: '현금' },
  { value: 'guarantee', label: '전자보증서' },
  { value: 'exempt', label: '보증금면제' },
]

// 보증금 면제사유(시행령 제37조 ③항) — 납부방법 '보증금면제' 선택 시 활성.
const EXEMPT_REASONS = [
  { value: '1', label: '제1호 국가기관 및 지방자치단체' },
  { value: '2', label: '제2호 공공기관의 운영에 관한 법률에 따른 공공기관' },
  { value: '3', label: '제3호 정부가 기본재산의 100분의 50 이상을 출연한 법인' },
  { value: '4', label: '제4호 농업·수산업·산림·중소기업협동조합 및 한국농어촌공사 등' },
]

export function BidPrtcpAperWrtPage_Stp4({ detail }: { detail: BidPrgrsItem }) {
  const [payMethod, setPayMethod] = useState('') // 보증금 납부방법
  const [exemptReason, setExemptReason] = useState('') // 보증금 면제사유
  const [exmptOpen, setExmptOpen] = useState(false) // P09 면제여부상세 바텀시트
  const isExempt = payMethod === 'exempt'

  // 입찰보증금(설계서 M08) — combination 셀에 SelectBox/InputBox/보기 Button.
  const guaranteeRows: TableRow[] = [
    {
      label: '보증금 납부방법',
      type: 'combination',
      value: (
        <SelectBox
          items={PAY_METHODS}
          value={payMethod}
          onValueChange={(v) => {
            setPayMethod(v)
            if (v !== 'exempt') setExemptReason('')
            console.log('[M08] 납부방법 선택', { pbancNo: detail.pbancNo, payMethod: v })
            // 추후 API: bdService.saveBidGuarantee(detail.pbancNo, { payMethod: v })
          }}
          placeholder="납부방법을 선택하세요."
        />
      ),
    },
    {
      label: '보증금면제사유',
      type: 'combination',
      value: (
        <>
          <SelectBox
            items={EXEMPT_REASONS}
            value={exemptReason}
            onValueChange={(v) => {
              setExemptReason(v)
              console.log('[M08] 면제사유 선택', v)
            }}
            placeholder="면제사유를 선택하세요."
            disabled={!isExempt}
          />
          <Button
            variant="inner"
            size="sm"
            disabled={!isExempt}
            onClick={() => setExmptOpen(true)}
          >
            보기
          </Button>
        </>
      ),
    },
    {
      label: '증권번호',
      type: 'combination',
      // 조회결과 1개 = 자동입력(disabled). 2개+면 SelectBox, 없으면 직접입력 InputBox.
      value: <InputBox value="EG-2025-0012345" disabled readOnly />,
    },
    { label: '개찰일자', value: '2025-11-25 13:00' },
    { label: '보증금액', value: '619,520,000 원', type: 'number' },
    { label: '계약자', value: '홍길동' },
    { label: '발행자', value: '서울보증보험㈜' },
  ]

  return (
    <>
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        입찰보증금
      </PageTitle>

      <div className="px-4 py-4">
        <Table rows={guaranteeRows} />
      </div>

      <Infobox
        title="안내사항"
        items={[
          '보증금면제사유는 발주기관으로 문의하시기 바랍니다.',
          '전자보증서를 신청하신 경우, 납부방법을 전자보증서로 선택하면 전자보증서가 자동으로 입력됩니다. (여러 개의 보증서를 신청하신 경우 그 중 한 개를 선택하셔야 합니다.)',
        ]}
      />

      {/* 보증금면제사유(P09) — 바텀시트 컨테이너는 이 탭이 소유, 콘텐츠는 ExmptnYnDtl(조회 전용). */}
      <BottomSheet
        open={exmptOpen}
        onOpenChange={setExmptOpen}
        title="보증금면제사유"
        footer={
          <Button variant="primary" className="w-full" onClick={() => setExmptOpen(false)}>
            닫기
          </Button>
        }
      >
        <ExmptnYnDtl />
      </BottomSheet>
    </>
  )
}
BidPrtcpAperWrtPage_Stp4.displayName = 'BidPrtcpAperWrtPage_Stp4'
