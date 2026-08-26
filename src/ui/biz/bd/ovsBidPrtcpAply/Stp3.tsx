// 스탭3 입찰 보증금 (MUI-BD-04-T74(구 M74 — v1.83 재편) OvsBidPrtcpAplyPage_Stp3 · 설계서 slide335~336 · 데이터 slide339 · 이벤트 slide341).
// 호스트 페이지(OvsBidPrtcpAplyPage)의 '입찰 보증금' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 구성: 페이지타이틀 → 입찰보증금 구분 SelectBox(비면제/면제, sbx_depositType_onchange 로 데이터 영역 전환)
//   → 입찰참가사업 및 입찰보증금 목록(사업별 Table)
//     · 면제(dl_bizExmptnList): 입찰보증금(확인입력) + 연대보증서/지급각서 파일
//     · 비면제(dl_bizList): 입찰보증금(확인입력) + 보증금납부방법(보증보험/전자보증서) + 증권번호/보증기관명 + 납부서
//       - 전자보증서: 증권번호/보증기관명 입력 비활성 + [보증서선택] → 입찰보증서선택 팝업(P75, OvsBidWtgrInqFullPopup)
//       - 보증보험: 직접 입력 + 입찰보증금납부서 파일 선택 업로드
// P75 풀팝업(내부에 P76 보증서정보조회 바텀시트, 콘텐츠 OvsBidWtgrDtl)은 OvsBidWtgrInqFullPopup 이 캡슐화 — 이 탭은 open/onApply 만 소유.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsBidWtgrInqFullPopup } from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidWtgrInqFullPopup'
import type { BidPrgrsItem, OvsBidPrtcpBizItem, OvsBidWtgrItem } from '@/types/mock/bd'

// 입찰보증금 구분 — ⚠️ 값 항목명 설계서 미정의(이벤트 sbx_depositType_onchange 에서 파생한 임시 키, 관례 승인).
const DEPOSIT_TYPES = [
  { value: 'nonExmptn', label: '보증금 비면제' },
  { value: 'exmptn', label: '보증금 면제' },
]

// 보증금납부방법(grntePayMth) — 구분(보증보험, 전자보증서). 설계서 slide339.
const PAY_METHODS = [
  { value: 'insurance', label: '보증보험' },
  { value: 'eGuarantee', label: '전자보증서' },
]

// 입찰참가사업 및 입찰보증금(dl_bizList·dl_bizExmptnList 공통 R 필드) — 달러금액(설계서 형식).
const MOCK_BIZ_LIST: OvsBidPrtcpBizItem[] = [
  {
    prchsDmndNo: '2025103001',
    bizNm: 'MD부품 국외구매',
    bdngItemQty: '6',
    bdngTccrAmt: 'USD 1,234,567.00',
    bidGrnteAmt: 'USD 61,728.35',
    gurnAgreDocNo: '연대보증서.pdf',
    giveWrtprmDocNo: '지급각서.pdf',
  },
  {
    prchsDmndNo: '2025103002',
    bizNm: '항공기 수리부속 국외구매',
    bdngItemQty: '3',
    bdngTccrAmt: 'USD 250,000.00',
    bidGrnteAmt: 'USD 12,500.00',
    gurnAgreDocNo: '연대보증서.pdf',
    giveWrtprmDocNo: '지급각서.pdf',
  },
]

// 사업별 편집(E) 입력 상태 — dl_bizList 의 E 항목(chckBidGrnteAmt·grntePayMth·wtgrNo·grnteInstNm·grntePyslDocNo).
interface BizGrnteInput {
  /** 입찰보증금(확인입력) (chckBidGrnteAmt, 25) */
  chckBidGrnteAmt: string
  /** 보증금납부방법 (grntePayMth, 1) — 보증보험/전자보증서 */
  grntePayMth: string
  /** 보증금증권번호 (wtgrNo, 30) — 전자보증서인 경우 보증서 정보 자동 표시 */
  wtgrNo: string
  /** 보증기관명 (grnteInstNm, 200) — 전자보증서인 경우 보증서 정보 자동 표시 */
  grnteInstNm: string
  /** 입찰보증금납부서 파일명 (grntePyslDocNo, 38) — 보증보험인 경우 파일 업로드 */
  grntePyslDocNo: string
  /** 연대보증서 파일명(면제) — undefined=조회값(biz.gurnAgreDocNo) 사용, ''=X 로 삭제됨 */
  gurnAgreDocNo?: string
  /** 지급각서 파일명(면제) — undefined=조회값(biz.giveWrtprmDocNo) 사용, ''=X 로 삭제됨 */
  giveWrtprmDocNo?: string
}

const EMPTY_INPUT: BizGrnteInput = {
  chckBidGrnteAmt: '',
  grntePayMth: '',
  wtgrNo: '',
  grnteInstNm: '',
  // 목업: 업로드된 상태로 시드 — 설계서 slide446 표시(File.pdf + X 삭제)와 동일하게 X 버튼 노출.
  grntePyslDocNo: '입찰보증금납부서.pdf',
}

export function Stp3({ detail }: { detail: BidPrgrsItem }) {
  // 입찰보증금 구분 — 값 변경 시 데이터 영역(면제/비면제) 전환(설계서 slide341 sbx_depositType_onchange).
  const [depositType, setDepositType] = useState('nonExmptn')
  const isExmptn = depositType === 'exmptn'

  // 사업별(구매요청번호 key) 편집 입력 상태.
  const [inputs, setInputs] = useState<Record<string, BizGrnteInput>>({})
  const getInput = (no: string): BizGrnteInput => inputs[no] ?? EMPTY_INPUT
  const patchInput = (no: string, patch: Partial<BizGrnteInput>) =>
    setInputs((prev) => ({ ...prev, [no]: { ...getInput(no), ...patch } }))

  // 입찰보증서선택(P75) — 어느 사업(구매요청번호)에 적용할지. null=닫힘.
  const [wtgrInqFor, setWtgrInqFor] = useState<string | null>(null)

  // 보증서 적용(P75/P76 → 부모) — 전자보증서 정보(증권번호/보증기관명=발행자)를 해당 사업에 주입.
  const applyWtgr = (item: OvsBidWtgrItem) => {
    if (wtgrInqFor) {
      patchInput(wtgrInqFor, { wtgrNo: item.wtgrNo, grnteInstNm: item.isrRprsvNm })
      console.log('[M74] 보증서 적용', { prchsDmndNo: wtgrInqFor, wtgrNo: item.wtgrNo })
      // 추후 API: bdService.applyOvsBidWtgr(detail.pbancNo, wtgrInqFor, item.wtgrNo)
    }
    setWtgrInqFor(null)
  }

  // 사업 1건 → Table rows (설계서 slide335 면제 / slide336 비면제 데이터 영역).
  const buildBizRows = (biz: OvsBidPrtcpBizItem, index: number): TableRow[] => {
    const input = getInput(biz.prchsDmndNo)
    const isEGuarantee = input.grntePayMth === 'eGuarantee'

    const rows: TableRow[] = [
      { label: '순번', value: String(index + 1) },
      { label: '구매요청번호', value: biz.prchsDmndNo },
      { label: '사업명', value: biz.bizNm },
      { label: '입찰품목수', value: biz.bdngItemQty, type: 'number' },
      { label: '입찰금액', value: biz.bdngTccrAmt, type: 'number' },
      { label: '입찰보증금', value: biz.bidGrnteAmt, type: 'number' },
      {
        label: '입찰보증금(확인입력)',
        type: 'combination',
        value: (
          <InputBox
            value={input.chckBidGrnteAmt}
            onChange={(e) => patchInput(biz.prchsDmndNo, { chckBidGrnteAmt: e.target.value })}
            placeholder="입력해주세요."
          />
        ),
      },
    ]

    if (isExmptn) {
      // 보증금면제(dl_bizExmptnList) — 연대보증서/지급각서 파일. 업로드된 파일은 X 아이콘 버튼으로 삭제
      //   (설계서 slide445 특이사항 3 "삭제 버튼으로 업로드된 파일 삭제" — 사용자 지시 2026-08-26).
      //   input 상태 undefined=조회값(biz) 사용 · ''=삭제됨.
      const gurnAgreDoc = input.gurnAgreDocNo ?? biz.gurnAgreDocNo ?? ''
      const giveWrtprmDoc = input.giveWrtprmDocNo ?? biz.giveWrtprmDocNo ?? ''
      // 파일 행 value — 파일명 인풋 + (파일 있을 때) X 삭제 + 파일선택.
      //   X 버튼 !w-10 !min-w-0: sm 버튼 높이(h-10)와 같은 40px 정사각 — Table 셀의
      //   [&_button]:w-fit·min-w-[74px] 를 아이콘 버튼에서만 해제.
      const fileCell = (
        fileNm: string,
        docLabel: string,
        onRemove: () => void,
        onSelect: () => void,
      ) => (
        <>
          <InputBox value={fileNm} readOnly disabled />
          <div className="flex items-center gap-krds-3">
            {fileNm && (
              <Button
                variant="inner"
                size="sm"
                aria-label={`${docLabel} 첨부파일 삭제`}
                className="!w-10 !min-w-0 px-0"
                onClick={onRemove}
              >
                <Icon name="Close" size={16} aria-hidden />
              </Button>
            )}
            <Button variant="inner" size="sm" onClick={onSelect}>
              파일선택
            </Button>
          </div>
        </>
      )
      rows.push(
        {
          label: '연대보증서',
          type: 'combination',
          value: fileCell(
            gurnAgreDoc,
            '연대보증서',
            () => {
              patchInput(biz.prchsDmndNo, { gurnAgreDocNo: '' })
              console.log('[M74] 연대보증서 파일 삭제', biz.prchsDmndNo)
              // 추후 API: bdService.removeOvsGurnAgreDoc
            },
            () => console.log('[M74] 연대보증서 파일선택', biz.prchsDmndNo),
            // 추후: 네이티브 파일 선택 → bdService.uploadOvsGurnAgreDoc
          ),
        },
        {
          label: '지급각서',
          type: 'combination',
          value: fileCell(
            giveWrtprmDoc,
            '지급각서',
            () => {
              patchInput(biz.prchsDmndNo, { giveWrtprmDocNo: '' })
              console.log('[M74] 지급각서 파일 삭제', biz.prchsDmndNo)
              // 추후 API: bdService.removeOvsGiveWrtprmDoc
            },
            () => console.log('[M74] 지급각서 파일선택', biz.prchsDmndNo),
            // 추후: 네이티브 파일 선택 → bdService.uploadOvsGiveWrtprmDoc
          ),
        },
      )
      return rows
    }

    // 보증금비면제(dl_bizList) — 납부방법/증권번호/보증기관명/납부서.
    rows.push(
      {
        label: '보증금납부방법',
        type: 'combination',
        value: (
          <SelectBox
            items={PAY_METHODS}
            value={input.grntePayMth}
            onValueChange={(v) => {
              // 납부방법 변경(slide341 sbx_depositPaymentType_onchange) —
              // 전자보증서: 증권번호/보증기관명 입력 비활성화 + 보증서선택 버튼 노출.
              patchInput(biz.prchsDmndNo, { grntePayMth: v, wtgrNo: '', grnteInstNm: '' })
              console.log('[M74] 보증금납부방법 변경', { prchsDmndNo: biz.prchsDmndNo, grntePayMth: v })
            }}
            placeholder="선택해주세요."
          />
        ),
      },
      {
        label: '보증금증권번호',
        type: 'combination',
        value: (
          <>
            <InputBox
              value={input.wtgrNo}
              onChange={(e) => patchInput(biz.prchsDmndNo, { wtgrNo: e.target.value })}
              placeholder="입력해주세요."
              readOnly={isEGuarantee}
              disabled={isEGuarantee && !input.wtgrNo}
            />
            {/* 보증서선택(slide341 btn_openBond_onclick) — 전자보증서: P75 팝업 / 보증보험: 파일 선택 업로드 */}
            <Button
              variant="inner"
              size="sm"
              disabled={!input.grntePayMth}
              onClick={() => {
                if (isEGuarantee) {
                  setWtgrInqFor(biz.prchsDmndNo) // 입찰보증서선택 팝업(P75)
                } else {
                  console.log('[M74] 보증보험 보증서 파일 선택 업로드', biz.prchsDmndNo)
                  // 추후: 네이티브 파일 선택 → bdService.uploadOvsBidWtgrDoc
                }
              }}
            >
              보증서선택
            </Button>
          </>
        ),
      },
      {
        label: '보증기관명',
        type: 'combination',
        value: (
          <InputBox
            value={input.grnteInstNm}
            onChange={(e) => patchInput(biz.prchsDmndNo, { grnteInstNm: e.target.value })}
            placeholder="입력해주세요."
            readOnly={isEGuarantee}
            disabled={isEGuarantee && !input.grnteInstNm}
          />
        ),
      },
      {
        label: '입찰보증금납부서',
        type: 'combination',
        value: (
          <>
            {/* placeholder 제거 — 파일 없는 상태에서 File.pdf 가 첨부된 것처럼 보이던 것 정리 */}
            <InputBox value={input.grntePyslDocNo} readOnly disabled />
            <div className="flex items-center gap-krds-3">
              {/* 업로드된 파일 X 삭제(설계서 slide446 주석 4) — !w-10: 높이(h-10)와 같은 40px 정사각 */}
              {input.grntePyslDocNo && (
                <Button
                  variant="inner"
                  size="sm"
                  aria-label="입찰보증금납부서 첨부파일 삭제"
                  className="!w-10 !min-w-0 px-0"
                  onClick={() => {
                    patchInput(biz.prchsDmndNo, { grntePyslDocNo: '' })
                    console.log('[M74] 입찰보증금납부서 파일 삭제', biz.prchsDmndNo)
                    // 추후 API: bdService.removeOvsGrntePyslDoc
                  }}
                >
                  <Icon name="Close" size={16} aria-hidden />
                </Button>
              )}
              <Button
                variant="inner"
                size="sm"
                onClick={() => {
                  patchInput(biz.prchsDmndNo, { grntePyslDocNo: '입찰보증금납부서.pdf' })
                  console.log('[M74] 입찰보증금납부서 파일선택', biz.prchsDmndNo)
                  // 추후: 네이티브 파일 선택 → bdService.uploadOvsGrntePyslDoc
                }}
              >
                파일선택
              </Button>
            </div>
          </>
        ),
      },
    )
    return rows
  }

  return (
    <>
      {/* 입찰보증금 구분 — 값에 따라 면제/비면제 데이터 영역 전환. 탭명과 중복되는 큰 타이틀은 제거(260709) */}
      <div className="px-4 py-4">
        <Table
          rows={[
            {
              label: '입찰보증금 구분',
              type: 'combination',
              value: (
                <SelectBox
                  items={DEPOSIT_TYPES}
                  value={depositType}
                  onValueChange={(v) => {
                    setDepositType(v)
                    console.log('[M74] 입찰보증금 구분 변경', { pbancNo: detail.pbancNo, depositType: v })
                    // 추후 API: bdService.selectBidPrtcpBizList(detail.pbancNo, v)
                  }}
                />
              ),
            },
          ]}
        />
      </div>

      {/* 입찰참가사업 및 입찰보증금 — 사업별 Table */}
      <SectionTitle as="h3" topDivider info={`총 ${MOCK_BIZ_LIST.length}건`} className="bg-white">
        입찰참가사업 및 입찰보증금
      </SectionTitle>
      <div className="flex flex-col gap-krds-8 px-4 py-4">
        {MOCK_BIZ_LIST.map((biz, i) => (
          <Table key={biz.prchsDmndNo} rows={buildBizRows(biz, i)} />
        ))}
      </div>

      <Infobox
        title="안내사항"
        items={[
          '보증금납부방법이 전자보증서인 경우 [보증서선택]으로 전자보증서 정보를 적용하면 증권번호/보증기관명이 자동 입력됩니다.',
          '보증금납부방법이 보증보험인 경우 보증서 파일을 선택하여 업로드합니다.',
        ]}
      />

      {/* 입찰보증서선택(P75) + 보증서정보조회(P76) — 풀팝업 래퍼(OvsBidWtgrInqFullPopup)가 캡슐화 */}
      <OvsBidWtgrInqFullPopup
        open={wtgrInqFor !== null}
        onOpenChange={(open) => {
          if (!open) setWtgrInqFor(null)
        }}
        onApply={applyWtgr}
      />
    </>
  )
}
Stp3.displayName = 'Stp3'
