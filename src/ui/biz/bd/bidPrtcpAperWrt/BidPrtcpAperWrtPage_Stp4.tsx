// 입찰참가신청서작성 - 입찰보증금 탭 (MUI-BD-04-M08, 설계서 slide105 · 데이터영역 dmt_bidGrnte slide121).
// 입찰참가신청서 작성(M05)의 '입찰보증금' 하위 탭 콘텐츠 — 페이지(BidPrtcpAperWrtPage)가 렌더하는 중간 본문만 담당.
// ⚠️ 요약/진행단계(StepBar)/탭(TabList)/하단 액션바는 페이지 소유 → 여기서 만들지 않는다.
// 구성: SectionTitle('입찰보증금') → 입찰보증금 Table → 안내사항 Infobox.
//   ⚠️ 설계서 slide105 는 안내사항이 표 위지만, 안내사항은 전 탭 공통으로 탭 최하단에 둔다(사용자 지시 2026-08-10).
// 처리조건(설계서 slide105 설명 및 특이사항):
//   - 보증금납부방법 선택 후 입찰보증금을 입력하면 투찰가능금액이 계산됨(안내사항의 '20배' 규칙).
//   - 보증금납부방법을 '보증금면제'로 선택할 경우 보증금면제사유가 활성화되고 선택 가능.
//   - 조회된 증권번호가 1개면 자동 입력, 2개 이상이면 셀렉트박스 선택, 없으면 직접 입력.
//   - 조회된 증권번호가 1개 이상인 경우에만 개찰일자/보증금액/계약자/발행자를 노출.
// 면제사유 우측 [면제여부 상세설명 보기] → 보증금면제사유 바텀시트(P09, ExmptnYnDtl).
//   이 탭이 BottomSheet 컨테이너(title='보증금면제사유', footer 닫기)를 직접 소유하고 콘텐츠로 ExmptnYnDtl 렌더.
// 값은 설계서 형식대로 목업(개찰일자 2025-11-25 13:00, 보증금액 619,520,000 원 등) — 백엔드 미연동.
import { useState, type ReactNode } from 'react'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { ExmptnYnDtl } from '@/ui/biz/bd/bidPrtcpAperWrt/ExmptnYnDtl'
import type { BidGrnteInfo } from '@/types/mock/bd'

// 보증금 납부방법(depsPayMthdCd, 상위코드 GMCB) — 실제 코드값은 상세설계 예정이라 의미값으로 임시 표기.
const PAY_METHODS = [
  { value: 'cash', label: '현금' },
  { value: 'guarantee', label: '전자보증서' },
  { value: 'exempt', label: '보증금면제' },
]

// 보증금 면제사유(depsExmptnRncd, 상위코드 ERGA) — 시행령 제37조 ③항 각 호. 납부방법 '보증금면제' 선택 시 활성.
const EXEMPT_REASONS = [
  { value: '1', label: '제1호 국가기관 및 지방자치단체' },
  { value: '2', label: '제2호 공공기관의 운영에 관한 법률에 따른 공공기관' },
  { value: '3', label: '제3호 정부가 기본재산의 100분의 50 이상을 출연한 법인' },
  { value: '4', label: '제4호 농업·수산업·산림·중소기업협동조합 및 한국농어촌공사 등' },
]

// 입찰보증금 조회결과 목업(dmt_bidGrnte R 항목) — 증권번호 2건이라 셀렉트박스 분기.
const MOCK_BID_GRNTE: BidGrnteInfo = {
  scrtNoList: ['EG-2025-0012345', 'EG-2025-0012346'],
  bidYmd: '2025-11-25 13:00',
  grnteAmt: '619,520,000 원',
  ctrtrBzentyNm: '홍길동',
  isrBzentyNm: '서울보증보험㈜',
}

// 투찰가능금액 배수 — 안내사항의 '합계인 5,000원의 20배 100,000원까지 투찰 가능'(보증금 = 입찰금액의 5%).
const BDNG_PSBLTY_RATE = 20

// 천단위 콤마(정수). inputType='numeric' 과 함께 사용 — 숫자만 넘어온 문자열에 콤마만 삽입.
function fmtComma(raw: string): string {
  return raw
    .replace(/[^0-9]/g, '')
    .replace(/^0+(?=\d)/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 콤마 포함 표시 문자열 → 숫자
const toNumber = (v: string) => Number(v.replace(/,/g, ''))

// 조회/저장 실연동 시 공고번호(pbancNo)를 받도록 props 를 되살린다 — 현재는 목업이라 무인자.
export function BidPrtcpAperWrtPage_Stp4() {
  const grnte = MOCK_BID_GRNTE
  const [depsPayMthdCd, setDepsPayMthdCd] = useState('') // 보증금 납부방법
  const [depsExmptnRncd, setDepsExmptnRncd] = useState('') // 보증금 면제사유
  // 증권번호 — 조회결과가 1개면 자동 입력, 2개 이상/없음이면 사용자가 선택·입력.
  const [scrtNo, setScrtNo] = useState(grnte.scrtNoList.length === 1 ? grnte.scrtNoList[0] : '')
  const [bidGrnteAmt, setBidGrnteAmt] = useState('') // 입찰보증금
  const [exmptOpen, setExmptOpen] = useState(false) // P09 면제여부상세 바텀시트

  const isExempt = depsPayMthdCd === 'exempt'
  const hasScrt = grnte.scrtNoList.length > 0
  // 투찰가능금액(bdngPsbltyAmt) — 입찰보증금 입력 시 계산.
  const bdngPsbltyAmt = bidGrnteAmt ? fmtComma(String(toNumber(bidGrnteAmt) * BDNG_PSBLTY_RATE)) : ''

  // 추후 API: bdService.saveBidGuarantee(pbancNo, { depsPayMthdCd, depsExmptnRncd, scrtNo, bidGrnteAmt })

  // 증권번호 셀 — 조회 건수별 분기(설계서 slide105·121).
  const scrtNoCell =
    grnte.scrtNoList.length === 1 ? (
      // 1개 = 자동 입력(수정 불가)
      <InputBox value={scrtNo} disabled readOnly />
    ) : grnte.scrtNoList.length > 1 ? (
      // 2개 이상 = 셀렉트박스로 선택
      <SelectBox
        items={grnte.scrtNoList.map((no) => ({ value: no, label: no }))}
        value={scrtNo}
        onValueChange={setScrtNo}
        placeholder="선택해주세요."
      />
    ) : (
      // 조회결과 없음 = 직접 입력
      <InputBox
        value={scrtNo}
        placeholder="입력해주세요."
        maxLength={30}
        onChange={(e) => setScrtNo(e.target.value)}
      />
    )

  // 입찰보증금(설계서 slide105) — 항목 순서는 데이터영역 dmt_bidGrnte 그대로.
  const guaranteeRows: TableRow[] = [
    {
      label: '보증금 납부방법',
      type: 'combination',
      value: (
        <FullWidthCell>
          <SelectBox
            items={PAY_METHODS}
            value={depsPayMthdCd}
            onValueChange={(v) => {
              setDepsPayMthdCd(v)
              if (v !== 'exempt') setDepsExmptnRncd('')
            }}
            placeholder="선택해주세요."
          />
        </FullWidthCell>
      ),
    },
    { label: '증권번호', type: 'combination', value: <FullWidthCell>{scrtNoCell}</FullWidthCell> },
    // 조회된 증권번호가 1개 이상인 경우에만 노출(설계서 slide105).
    ...(hasScrt
      ? ([
          { label: '개찰일자', value: grnte.bidYmd },
          { label: '보증금액', value: grnte.grnteAmt, type: 'number' },
          { label: '계약자', value: grnte.ctrtrBzentyNm },
          { label: '발행자', value: grnte.isrBzentyNm },
        ] as TableRow[])
      : []),
    {
      label: '보증금면제사유',
      type: 'combination',
      value: (
        <FullWidthCell>
          <SelectBox
            items={EXEMPT_REASONS}
            value={depsExmptnRncd}
            onValueChange={setDepsExmptnRncd}
            placeholder="선택해주세요."
            disabled={!isExempt}
          />
          <Button variant="inner" size="sm" onClick={() => setExmptOpen(true)}>
            면제여부 상세설명 보기
          </Button>
        </FullWidthCell>
      ),
    },
    {
      label: '입찰보증금',
      type: 'combination',
      value: (
        <AmountCell>
          <InputBox
            className="flex-1"
            inputType="numeric"
            format={fmtComma}
            value={bidGrnteAmt}
            placeholder="입력해주세요."
            onChange={(e) => setBidGrnteAmt(e.target.value)}
          />
        </AmountCell>
      ),
    },
    {
      label: '투찰가능금액',
      type: 'combination',
      // 읽기전용 — 입찰보증금 입력 시 계산된 값 표시.
      value: (
        <AmountCell>
          <InputBox className="flex-1" value={bdngPsbltyAmt} placeholder="입력해주세요." disabled readOnly />
        </AmountCell>
      ),
    },
  ]

  return (
    <>
      <SectionTitle as="h3" topDivider>
        입찰보증금
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={guaranteeRows} />
      </div>

      {/* 안내사항 — 설계서 문구 그대로. 탭 최하단 고정(전 탭 공통) */}
      <Infobox
        title="안내사항"
        defaultOpen
        items={[
          '보증금면제사유는 발주기관으로 문의하시기 바랍니다.',
          '전자보증서를 신청하신 경우, 납부방법을 전자보증서로 선택하면 전자보증서가 자동으로 입력됩니다. (여러 개의 보증서를 신청하신 경우 그 중 한 개를 선택하셔야 합니다.)',
          '전자보증서 발급 이후, 해당 전자보증서 정보에 대한 수신은 약 15분 정도 소요됩니다.',
          '전자보증서가 아닌 경우에는 보증금 납부방법을 보증보험으로 선택하시고 증권번호와 입찰보증금을 직접 입력하시면 됩니다.',
          // 분담이행 방식 입력방법 — 설계서상 여러 줄 블록이라 한 항목 안에서 줄바꿈.
          <span key="jsd" className="flex flex-col">
            <span>분담이행 방식 입찰보증금 입력방법</span>
            <span>업체명, 분담비율, 입찰보증금이 각각 아래와 같은 경우</span>
            <span>A업체 20%(1,000원), B업체 30%(1,500원), C업체 50%(2,500원)</span>
            <span>
              의 입찰보증금을 등록하면 합계인 5,000원의 20배 100,000원까지 투찰 가능 합니다.
            </span>
          </span>,
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

/**
 * combination 셀 안에서 SelectBox/Button 을 셀 전체 폭으로 펼치는 래퍼.
 * Table value 셀의 `[&_button]:w-fit`(보기 버튼 규칙)이 트리거(button)를 줄이므로 !w-full 로 덮는다.
 */
function FullWidthCell({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col gap-krds-5 [&_button]:!w-full">{children}</div>
}

/** 금액 입력 셀 — 입력창 + 우측 '원' 단위(설계서 slide105). */
function AmountCell({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-krds-3">
      {children}
      <span className="shrink-0 text-[17px] text-krds-text-ink">원</span>
    </div>
  )
}
