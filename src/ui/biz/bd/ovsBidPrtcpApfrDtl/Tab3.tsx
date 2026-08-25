// 국외 입찰참가신청서 상세 - 탭3 입찰 보증금 (MUI-BD-04-T78(구 M80 — v1.83 재편), 설계서 slide350·351·354).
// 페이지(OvsBidPrtcpApfrDtlPage)가 renderTabContent 로 렌더하는 탭 콘텐츠 — 요약/스텝/탭은 페이지 소유.
// 구성: 입찰보증금 구분(보증금 비면제/면제 라디오 — 표시 목록 전환) + 입찰참가사업 및 입찰보증금 목록
//   (사업별 AccordionSection + Table, 비면제=dl_bizList / 면제=dl_bizExmptnList) + 더보기
//   + 사업별 [개별 입찰참가취소] → 부모 콜백(onRtrcn)으로 P82 바텀시트 호출(컨테이너는 페이지 소유).
// ⚠️ '입찰보증금 구분' 라디오 값의 영문 항목명은 설계서 미정의(상세설계 예정) — 임시 키 grnteExmptnSe 사용.
import { useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  MockOvsBidBizExmptnItem,
  MockOvsBidBizItem,
  MockOvsRtrcnTarget,
} from '@/types/mock/bd'

// 달러 금액 표기 — 설계서 '000,000,000,000.00' 형식(소수 2자리).
const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// 한 번에 보여줄 사업 건수(더보기 단위) — 설계서 '더보기(10/100)' 패턴, 목업이라 소단위.
const PAGE_SIZE = 2

// 파일명 + [다운로드] combination 셀 (slide350·351 File.pdf 다운로드)
function fileCell(docNo: string | undefined, label: string) {
  if (!docNo) return '-'
  return (
    <div className="flex flex-col items-start gap-krds-3">
      <span>{docNo}</span>
      <Button
        size="sm"
        variant="inner"
        onClick={() => console.log('[M80] 다운로드', label, docNo)} // 추후 API: bdService.downloadGrnteDoc
      >
        다운로드
      </Button>
    </div>
  )
}

// 보증금비면제(dl_bizList) 사업 1건 → Table rows
function bizRows(item: MockOvsBidBizItem, no: number): TableRow[] {
  return [
    { label: '순번', value: String(no), type: 'number' },
    { label: '구매요청번호', value: item.prchsDmndNo },
    { label: '사업명', value: item.bizNm },
    { label: '입찰품목수', value: item.bdngItemQty.toLocaleString(), type: 'number' },
    { label: '입찰금액', value: `US$ ${fmtUsd(item.bdngTccrAmt)}`, type: 'number' },
    { label: '입찰보증금', value: `US$ ${fmtUsd(item.bidGrnteAmt)}`, type: 'number' },
    { label: '입찰보증금(확인입력)', value: `US$ ${fmtUsd(item.chckBidGrnteAmt)}`, type: 'number' },
    { label: '보증금납부방법', value: item.grntePayMth },
    { label: '보증금증권번호', value: item.wtgrNo },
    { label: '보증기관명', value: item.grnteInstNm },
    { label: '입찰보증금납부서', value: fileCell(item.grntePyslDocNo, '입찰보증금납부서'), type: 'combination' },
  ]
}

// 보증금면제(dl_bizExmptnList) 사업 1건 → Table rows
function bizExmptnRows(item: MockOvsBidBizExmptnItem, no: number): TableRow[] {
  return [
    { label: '순번', value: String(no), type: 'number' },
    { label: '구매요청번호', value: item.prchsDmndNo },
    { label: '사업명', value: item.bizNm },
    { label: '입찰품목수', value: item.bdngItemQty.toLocaleString(), type: 'number' },
    { label: '입찰금액', value: `US$ ${fmtUsd(item.bdngTccrAmt)}`, type: 'number' },
    { label: '입찰보증금', value: `US$ ${fmtUsd(item.bidGrnteAmt)}`, type: 'number' },
    { label: '입찰보증금(확인입력)', value: `US$ ${fmtUsd(item.chckBidGrnteAmt)}`, type: 'number' },
    { label: '연대보증서', value: fileCell(item.gurnAgreDocNo, '연대보증서'), type: 'combination' },
    { label: '지급각서', value: fileCell(item.giveWrtprmDocNo, '지급각서'), type: 'combination' },
  ]
}

interface OvsBidPrtcpApfrDtlPage_Tab3Props {
  /** 입찰참가사업 및 입찰보증금 — 보증금비면제(dl_bizList) */
  bizList: MockOvsBidBizItem[]
  /** 입찰참가사업 및 입찰보증금 — 보증금면제(dl_bizExmptnList) */
  bizExmptnList: MockOvsBidBizExmptnItem[]
  /** 개별 입찰참가취소 클릭 → 입찰참가신청서취소(P82) 호출(컨테이너는 페이지 소유) */
  onRtrcn: (target: MockOvsRtrcnTarget) => void
}

export function OvsBidPrtcpApfrDtlPage_Tab3({
  bizList,
  bizExmptnList,
  onRtrcn,
}: OvsBidPrtcpApfrDtlPage_Tab3Props) {
  // 입찰보증금 구분 — ⚠️ 설계서 미정의 임시 키 grnteExmptnSe ('N'=비면제 / 'Y'=면제). 목록 표시 전환.
  const [grnteExmptnSe, setGrnteExmptnSe] = useState<'N' | 'Y'>('N')
  const [page, setPage] = useState(1) // 더보기 페이징
  const isExmptn = grnteExmptnSe === 'Y'

  const total = isExmptn ? bizExmptnList.length : bizList.length
  const loaded = Math.min(page * PAGE_SIZE, total)

  return (
    <>

      {/* 입찰보증금 구분 (slide350·351) — 구분 변경 시 목록/항목 전환 */}
      <div className="flex flex-col gap-krds-5 px-4 pb-4">
        {/* 라디오 그룹은 labelable 요소가 아니라 htmlFor 미사용(aria-label 로 연결) */}
        <InputLabel>입찰보증금 구분</InputLabel>
        <RadioButtonGroup
          aria-label="입찰보증금 구분"
          value={grnteExmptnSe}
          onValueChange={(v) => {
            setGrnteExmptnSe(v as 'N' | 'Y')
            setPage(1)
            console.log('[M80] 입찰보증금 구분 변경', v) // 추후 API: bdService.selectOvsBidGrnteList
          }}
          items={[
            { value: 'N', label: '보증금 비면제' },
            { value: 'Y', label: '보증금 면제' },
          ]}
        />
      </div>

      {/* 입찰참가사업 및 입찰보증금 — 사업별 아코디언 + 개별 입찰참가취소 */}
      <Accordion type="multiple" defaultValue={['biz-0']} className="w-full">
        {(isExmptn ? bizExmptnList : bizList).slice(0, loaded).map((item, i) => (
          <AccordionSection
            key={item.prchsDmndNo}
            value={`biz-${i}`}
            title={`입찰참가사업 및 입찰보증금 (순번 ${i + 1})`}
            titleInfo={item.prchsDmndNo}
            borderTop={i === 0 ? false : undefined}
          >
            <Table
              rows={
                isExmptn
                  ? bizExmptnRows(item as MockOvsBidBizExmptnItem, i + 1)
                  : bizRows(item as MockOvsBidBizItem, i + 1)
              }
            />
            {/* 개별 건 입찰참가 취소(slide350) — 입찰참가신청서취소 팝업(P82) 호출 */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                onRtrcn({
                  prchsDmndNo: item.prchsDmndNo,
                  bizNm: item.bizNm,
                  rtrcnItemQty: item.bdngItemQty,
                })
              }
            >
              개별 입찰참가취소
            </Button>
          </AccordionSection>
        ))}
      </Accordion>

      {/* 더보기 — 모두 노출됐으면 숨김 (설계서 '더보기(10/100)') */}
      {loaded < total && (
        <div className="px-4 pb-6 pt-4">
          <Button variant="secondary" className="w-full" onClick={() => setPage((p) => p + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}
    </>
  )
}
OvsBidPrtcpApfrDtlPage_Tab3.displayName = 'OvsBidPrtcpApfrDtlPage_Tab3'
