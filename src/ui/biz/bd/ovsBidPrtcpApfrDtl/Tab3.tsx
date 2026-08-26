// 국외 입찰참가신청서 상세 - 탭3 입찰 보증금 (MUI-BD-04-T78(구 M80 — v1.83 재편), 설계서 v1.88 slide461(면제)·462(비면제)).
// 페이지(OvsBidPrtcpApfrDtlPage)가 renderTabContent 로 렌더하는 탭 콘텐츠 — 요약/스텝/탭은 페이지 소유.
// 구성(2026-08-26 사용자 지시로 아코디언 → 카드 전환): 입찰보증금 구분(비면제/면제 라디오 — 표시 목록 전환)
//   + 사업별 카드(Card + Checkbox '선택' 다중 선택 — BfrPbancBidDsctnItemDtl 입찰품목 카드 패턴) + 더보기
//   + 하단 고정(sticky) [선택 입찰취소]/[전체 입찰취소] (설계서 slide461 주석 4 — 개별(선택 건)/전체 모두
//     입찰참가신청서취소 P82 팝업 호출, 컨테이너는 페이지 소유).
// ⚠️ '입찰보증금 구분' 라디오 값의 영문 항목명은 설계서 미정의(상세설계 예정) — 임시 키 grnteExmptnSe 사용.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Card } from '@/ui/common/composites/Card'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  OvsBidBizExmptnItem,
  OvsBidBizItem,
  OvsRtrcnTarget,
} from '@/types/mock/bd'

// 달러 금액 표기 — 설계서 '000,000,000,000.00' 형식(소수 2자리).
const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// 한 번에 보여줄 사업 건수(더보기 단위) — 설계서 '더보기(10/100)' 패턴, 목업이라 소단위.
const PAGE_SIZE = 2

// 파일명 + [다운로드] combination 셀 (slide461·462 File.pdf 다운로드)
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
function bizRows(item: OvsBidBizItem, no: number): TableRow[] {
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
function bizExmptnRows(item: OvsBidBizExmptnItem, no: number): TableRow[] {
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
  bizList: OvsBidBizItem[]
  /** 입찰참가사업 및 입찰보증금 — 보증금면제(dl_bizExmptnList) */
  bizExmptnList: OvsBidBizExmptnItem[]
  /** [선택 입찰취소] — 선택 사업 건들로 입찰참가신청서취소(P82) 호출(컨테이너는 페이지 소유) */
  onRtrcn: (targets: OvsRtrcnTarget[]) => void
  /** [전체 입찰취소] — 전체 건으로 P82 호출(페이지의 전체취소 로직 재사용) */
  onRtrcnAll: () => void
}

export function OvsBidPrtcpApfrDtlPage_Tab3({
  bizList,
  bizExmptnList,
  onRtrcn,
  onRtrcnAll,
}: OvsBidPrtcpApfrDtlPage_Tab3Props) {
  // 입찰보증금 구분 — ⚠️ 설계서 미정의 임시 키 grnteExmptnSe ('N'=비면제 / 'Y'=면제). 목록 표시 전환.
  const [grnteExmptnSe, setGrnteExmptnSe] = useState<'N' | 'Y'>('N')
  const [page, setPage] = useState(1) // 더보기 페이징
  // 선택 사업(구매요청번호 key) — 카드 Checkbox 다중 선택(설계서 주석 3 '선택 버튼 ON/OFF').
  const [checkedNos, setCheckedNos] = useState<string[]>([])
  const isExmptn = grnteExmptnSe === 'Y'

  const list = isExmptn ? bizExmptnList : bizList
  const total = list.length
  const loaded = Math.min(page * PAGE_SIZE, total)

  const toggleChecked = (no: string, checked: boolean) =>
    setCheckedNos((prev) => (checked ? [...prev, no] : prev.filter((n) => n !== no)))

  // 선택 입찰취소(설계서 주석 4 '개별 건(선택 건) 입찰 취소') — 선택 사업들로 P82 호출.
  const handleRtrcnChecked = () => {
    const targets: OvsRtrcnTarget[] = list
      .filter((b) => checkedNos.includes(b.prchsDmndNo))
      .map((b) => ({ prchsDmndNo: b.prchsDmndNo, bizNm: b.bizNm, rtrcnItemQty: b.bdngItemQty }))
    if (targets.length === 0) return
    onRtrcn(targets)
  }

  // 전체 입찰취소 — 카드 체크박스를 전체 체크로 반영(사용자 지시 2026-08-26)한 뒤 P82(전체 건) 호출.
  const handleRtrcnAll = () => {
    setCheckedNos(list.map((b) => b.prchsDmndNo))
    onRtrcnAll()
  }

  return (
    <>
      {/* 입찰보증금 구분 (slide461·462) — 구분 변경 시 목록/항목 전환(선택 초기화) */}
      <div className="flex flex-col gap-krds-5 px-4 pb-4">
        {/* 라디오 그룹은 labelable 요소가 아니라 htmlFor 미사용(aria-label 로 연결) */}
        <InputLabel>입찰보증금 구분</InputLabel>
        <RadioButtonGroup
          aria-label="입찰보증금 구분"
          value={grnteExmptnSe}
          onValueChange={(v) => {
            setGrnteExmptnSe(v as 'N' | 'Y')
            setPage(1)
            setCheckedNos([])
            console.log('[M80] 입찰보증금 구분 변경', v) // 추후 API: bdService.selectOvsBidGrnteList
          }}
          items={[
            { value: 'N', label: '보증금 비면제' },
            { value: 'Y', label: '보증금 면제' },
          ]}
        />
      </div>

      {/* 입찰참가사업 및 입찰보증금 — 사업별 카드(Checkbox 다중 선택, BfrPbancBidDsctnItemDtl 패턴) */}
      <div className="flex w-full flex-col gap-krds-8 px-4">
        {list.slice(0, loaded).map((item, i) => (
          <Card
            key={item.prchsDmndNo}
            badges={
              <Checkbox
                variant="box"
                label="선택"
                checked={checkedNos.includes(item.prchsDmndNo)}
                onCheckedChange={(c) => toggleChecked(item.prchsDmndNo, c === true)}
              />
            }
            footer={
              <Table
                rows={
                  isExmptn
                    ? bizExmptnRows(item as OvsBidBizExmptnItem, i + 1)
                    : bizRows(item as OvsBidBizItem, i + 1)
                }
              />
            }
          />
        ))}
      </div>

      {/* 더보기 — 모두 노출됐으면 숨김 (설계서 '더보기(10/100)') */}
      {loaded < total && (
        <div className="px-4 pb-6 pt-4">
          <Button variant="secondary" className="w-full" onClick={() => setPage((p) => p + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 하단 고정 액션바 — [선택 입찰취소]/[전체 입찰취소] → P82(설계서 slide461 주석 4, cm sticky 패턴) */}
      <div
        className="sticky bottom-0 z-30 mt-4 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="split"
          items={[
            {
              label: '선택 입찰취소',
              variant: 'secondary',
              disabled: checkedNos.length === 0,
              onClick: handleRtrcnChecked,
            },
            { label: '전체 입찰취소', variant: 'primary', onClick: handleRtrcnAll },
          ]}
        />
      </div>
    </>
  )
}
OvsBidPrtcpApfrDtlPage_Tab3.displayName = 'OvsBidPrtcpApfrDtlPage_Tab3'
