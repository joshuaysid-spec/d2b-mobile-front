// 입찰진행상세 - 입찰참가신청조회 입찰보증금 (MUI-BD-04-T04, 설계서 영문ID BidPrtcpAperDtl_Tab4 · slide186).
// 호스트 페이지(BidPrtcpAperDtlPage)의 '4. 입찰보증금' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 조회판이라 작성판(M08)의 셀렉트박스/입력창이 전부 값 표시로 바뀐다(납부방법·면제사유·보증금액 모두 제출된 값).
//   면제사유 우측 [면제여부 상세설명 보기] → 보증금면제사유 바텀시트(P09)는 조회 전용이라 작성판 콘텐츠
//   컴포넌트(ExmptnYnDtl)를 그대로 재사용하고, 컨테이너(title/footer/open)만 이 탭이 소유한다.
// 항목명은 설계서 데이터영역 dmt_bidGrnte(slide121) 그대로, 값 형식은 slide186 예시대로.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { ExmptnYnDtl } from '@/ui/biz/bd/bidPrtcpAperWrt/ExmptnYnDtl'

// 제출된 입찰보증금 내역 목업(dmt_bidGrnte) — 값 형식은 설계서 slide186 그대로.
const MOCK_BID_GRNTE = {
  depsPayMthdCd: '계좌이체', // 보증금 납부방법
  scrtNo: '812-572-27853', // 증권번호
  bidYmd: '2025-11-25 13:00', // 개찰일자
  grnteAmt: '619,520,000 원', // 보증금액
  ctrtrBzentyNm: '홍길동', // 계약자
  isrBzentyNm: '기관명', // 발행자
  depsExmptnRncd: '특정 상황에 의한 보증금 면제', // 보증금면제사유
  bidGrnteAmt: '100,000 원', // 입찰보증금
  bdngPsbltyAmt: '251,102 원', // 투찰가능금액
}

export function BidPrtcpAperDtl_Tab4() {
  const [exmptOpen, setExmptOpen] = useState(false) // P09 면제여부상세 바텀시트
  const grnte = MOCK_BID_GRNTE

  const guaranteeRows: TableRow[] = [
    { label: '보증금 납부방법', value: grnte.depsPayMthdCd },
    { label: '증권번호', value: grnte.scrtNo },
    { label: '개찰일자', value: grnte.bidYmd },
    { label: '보증금액', value: grnte.grnteAmt, type: 'number' },
    { label: '계약자', value: grnte.ctrtrBzentyNm },
    { label: '발행자', value: grnte.isrBzentyNm },
    {
      label: '보증금면제사유',
      type: 'combination',
      value: (
        <div className="flex flex-col items-start gap-krds-3">
          <span>{grnte.depsExmptnRncd}</span>
          <Button variant="inner" size="sm" onClick={() => setExmptOpen(true)}>
            면제여부 상세설명 보기
          </Button>
        </div>
      ),
    },
    { label: '입찰보증금', value: grnte.bidGrnteAmt, type: 'number' },
    { label: '투찰가능금액', value: grnte.bdngPsbltyAmt, type: 'number' },
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
            <span>의 입찰보증금을 등록하면 합계인 5,000원의 20배 100,000원까지 투찰 가능 합니다.</span>
          </span>,
        ]}
      />

      {/* 보증금면제사유(P09) — 컨테이너는 이 탭이 소유, 콘텐츠는 작성판과 공용(조회 전용). */}
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
BidPrtcpAperDtl_Tab4.displayName = 'BidPrtcpAperDtl_Tab4'
