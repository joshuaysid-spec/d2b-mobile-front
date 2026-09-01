// 입찰내역 작성 - 입찰내역(단가제) (MUI-BD-01-T75(구 M77 — v1.83 재편), 설계서 07국외입찰공고상세 slide314·317·319)
// 호스트 페이지(OvsTmprBidCnRegPage)의 '품목 목록' 탭 본문(단가제) — 요약/탭/FAB 는 페이지 소유.
// 구성: 입찰내역 일괄적용(dl_fwkInfo: 입찰업체/화폐단위 + 전체·선택 적용 — 구 PageTitle '입찰내역(단가제)' 삭제, 2026-08-25) →
//   입찰 품목(총 N건) 카드 반복(항목선택 체크 + 요약 Table + 내역 펼쳐보기/접기 폼) → 더보기 →
//   하단 액션바(입찰내역 삭제/저장).
// 이벤트(설계서 slide319):
//   - 품목대체구분 = Replace → 품목대체첨부문서·수정재고번호·수정부품번호 활성/필수
//   - MOQ구분 = Y → MOQ첨부문서·MOQ수량 활성/필수
//   - 입찰단가 변경 → 입찰금액/달러단가/달러금액 계산 · 화폐단위 변경 → 달러환산율/달러단가/달러금액 계산
//   - 업로드 클릭 → 첨부문서업로드 팝업(UI-BD-04-P75) 호출 — 목업은 console.log + 파일명 스텁
import { useState, type ReactNode } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Card } from '@/ui/common/composites/Card'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBscPbancInfo, MockItitbBidCnItem } from '@/types/mock/bd'

// ── 목업 코드값 — On-Load 입찰업체목록/화폐단위 조회 결과(설계서 slide319) ──
// 추후 API: bdService.selectOvsBidBzentyList / bdService.selectCrncUnitList
const SPLY_BZENTY_ITEMS = [
  { value: 'MD Helicopters Inc.', label: 'MD Helicopters Inc.' },
  { value: 'Boeing Global Services Co.', label: 'Boeing Global Services Co.' },
  { value: 'Kaman Aerospace Corp.', label: 'Kaman Aerospace Corp.' },
]
// 화폐단위별 달러환산율(usdExrt) — 환율적용일자 기준 목업. 추후 API 응답으로 대체.
const USD_EXRT_BY_CRNC: Record<string, number> = {
  USD: 1.0,
  EUR: 1.085,
  GBP: 1.265,
  JPY: 0.0067,
}
const CRNC_ITEMS = Object.keys(USD_EXRT_BY_CRNC).map((c) => ({ value: c, label: c }))

// 금액 표시 포맷 — 소수 2자리 + 천단위 콤마 (설계서 예시 608,000.00)
const fmtAmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
// 입력용 콤마 포맷 — InputBox format prop (숫자만 → 천단위 콤마)
const fmtComma = (raw: string) => (raw ? Number(raw).toLocaleString('en-US') : '')

// 입찰단가/화폐단위 변경 시 파생값 재계산 (설계서 slide319 이벤트)
function recalcBidCn(row: MockItitbBidCnItem): MockItitbBidCnItem {
  const exrt = USD_EXRT_BY_CRNC[row.crncNm]
  const untprc = Number(row.bdngTccrUntprc.replace(/,/g, '')) || 0
  if (!exrt || !untprc) {
    return { ...row, usdExrt: exrt ? exrt.toFixed(4) : '', bdngTccrAmt: '', bdngUsdUntprc: '', bdngUsdAmt: '' }
  }
  const qty = Number(row.qty.replace(/,/g, '')) || 0
  const amt = untprc * qty
  return {
    ...row,
    usdExrt: exrt.toFixed(4),
    bdngTccrAmt: fmtAmt(amt),
    bdngUsdUntprc: fmtAmt(untprc * exrt),
    bdngUsdAmt: fmtAmt(amt * exrt),
  }
}

// 서버 총건수 — 더보기 분모(설계서 '더보기 (10/100)'). 추후 API 응답 total 로 대체.
const PAGE_SIZE = 5

// ── 입찰내역(단가제) 목업 (dl_ititbBidCnList, 설계서 slide314 예시값 형식) ──
// 첫 항목은 입찰내역이 입력된 상태(단가 608,000.00 USD) — 계산 필드 확인용.
const EMPTY_BID_FIELDS = {
  itemSbstSe: 'A' as const,
  itemSbstDocEn: '',
  mdfcnInvtNo: '',
  mdfcnPrtsNo: '',
  moqYn: 'N' as const,
  moqQty: '',
  moqDocEn: '',
  bscbgtDudtYmd: '',
  athrtDudtYmd: '',
  ltbndDudtYmd: '',
  usdExrt: '',
  splyBzentyNm: '',
  bdngTccrUntprc: '',
  bdngTccrAmt: '',
  crncNm: '',
  bdngUsdUntprc: '',
  bdngUsdAmt: '',
}
const MOCK_ITITB_BID_CN_LIST: MockItitbBidCnItem[] = [
  {
    frcptlArtclNo: '1',
    invtNo: 'A000-A0001',
    prtsNo: '369A1234-5',
    itemNm: 'T-80U/TBE-3',
    unitNm: 'EA',
    qty: '1',
    drctnUntprc: '608,000.00',
    ...EMPTY_BID_FIELDS,
    bscbgtDudtYmd: '2025-03-25',
    athrtDudtYmd: '2025-03-25',
    ltbndDudtYmd: '2025-03-25',
    usdExrt: '1.0000',
    splyBzentyNm: 'MD Helicopters Inc.',
    bdngTccrUntprc: '608000',
    bdngTccrAmt: '608,000.00',
    crncNm: 'USD',
    bdngUsdUntprc: '608,000.00',
    bdngUsdAmt: '608,000.00',
  },
  {
    frcptlArtclNo: '2',
    invtNo: 'A000-A0002',
    prtsNo: '369A5501-3',
    itemNm: 'MAIN ROTOR BLADE ASSY',
    unitNm: 'EA',
    qty: '2',
    drctnUntprc: '142,500.00',
    ...EMPTY_BID_FIELDS,
  },
  {
    frcptlArtclNo: '3',
    invtNo: 'A000-A0003',
    prtsNo: '369D2210-11',
    itemNm: 'TAIL ROTOR ASSY',
    unitNm: 'EA',
    qty: '1',
    drctnUntprc: '86,300.00',
    ...EMPTY_BID_FIELDS,
  },
  {
    frcptlArtclNo: '4',
    invtNo: 'A000-A0004',
    prtsNo: '369H9020-7',
    itemNm: 'ENGINE FUEL PUMP',
    unitNm: 'EA',
    qty: '4',
    drctnUntprc: '23,900.00',
    ...EMPTY_BID_FIELDS,
  },
  {
    frcptlArtclNo: '5',
    invtNo: 'A000-A0005',
    prtsNo: '369A7003-1',
    itemNm: 'HYDRAULIC ACTUATOR',
    unitNm: 'EA',
    qty: '2',
    drctnUntprc: '51,700.00',
    ...EMPTY_BID_FIELDS,
  },
  {
    frcptlArtclNo: '6',
    invtNo: 'A000-A0006',
    prtsNo: '369D2911-4',
    itemNm: 'LANDING GEAR STRUT',
    unitNm: 'EA',
    qty: '2',
    drctnUntprc: '18,200.00',
    ...EMPTY_BID_FIELDS,
  },
  {
    frcptlArtclNo: '7',
    invtNo: 'A000-A0007',
    prtsNo: '369F1105-9',
    itemNm: 'MAIN TRANSMISSION GEARBOX',
    unitNm: 'EA',
    qty: '1',
    drctnUntprc: '312,400.00',
    ...EMPTY_BID_FIELDS,
  },
]

// 폼 필드 블록 — InputLabel + 컨트롤 세로 스택 (파일 내부 전용 헬퍼)
function Field({
  label,
  required = false,
  children,
}: {
  label: ReactNode
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-krds-3">
      <InputLabel required={required}>{label}</InputLabel>
      {children}
    </div>
  )
}

interface NoticeModal {
  open: boolean
  variant: 'info' | 'error' | 'check'
  title: string
  description?: string
}

export function BidDsctn({ detail }: { detail: MockBscPbancInfo }) {
  const [rows, setRows] = useState<MockItitbBidCnItem[]>(MOCK_ITITB_BID_CN_LIST)
  // 항목선택 체크 상태 — key 는 항목번호(frcptlArtclNo)
  const [checkedNos, setCheckedNos] = useState<string[]>([])
  // 내역 펼쳐보기/접기 상태
  const [expandedNos, setExpandedNos] = useState<string[]>([MOCK_ITITB_BID_CN_LIST[0].frcptlArtclNo])
  // 더보기 페이징
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  // 입찰내역 일괄적용(dl_fwkInfo) — 입찰업체/화폐단위
  const [fwkSplyBzentyNm, setFwkSplyBzentyNm] = useState('')
  const [fwkCrncNm, setFwkCrncNm] = useState('')

  const [notice, setNotice] = useState<NoticeModal>({ open: false, variant: 'info', title: '' })
  const [deleteOpen, setDeleteOpen] = useState(false)

  const visibleRows = rows.slice(0, visibleCount)
  const hasMore = visibleCount < rows.length

  const updateRow = (frcptlArtclNo: string, patch: Partial<MockItitbBidCnItem>) =>
    setRows((prev) =>
      prev.map((r) => (r.frcptlArtclNo === frcptlArtclNo ? recalcBidCn({ ...r, ...patch }) : r)),
    )

  const toggleChecked = (frcptlArtclNo: string, checked: boolean) =>
    setCheckedNos((prev) =>
      checked ? [...prev, frcptlArtclNo] : prev.filter((no) => no !== frcptlArtclNo),
    )

  const toggleExpanded = (frcptlArtclNo: string) =>
    setExpandedNos((prev) =>
      prev.includes(frcptlArtclNo)
        ? prev.filter((no) => no !== frcptlArtclNo)
        : [...prev, frcptlArtclNo],
    )

  // ── 일괄적용 — 선택된 입찰업체/화폐단위를 전체 또는 선택 항목 행에 반영 (slide319) ──
  const applyFwk = (target: 'all' | 'selected') => {
    if (!fwkSplyBzentyNm && !fwkCrncNm) {
      setNotice({ open: true, variant: 'info', title: '적용할 입찰업체 또는 화폐단위를 선택해주세요.' })
      return
    }
    if (target === 'selected' && checkedNos.length === 0) {
      setNotice({ open: true, variant: 'info', title: '적용할 품목을 선택해주세요.' })
      return
    }
    console.log('[M77] 입찰내역 일괄적용', target, fwkSplyBzentyNm, fwkCrncNm, checkedNos)
    setRows((prev) =>
      prev.map((r) =>
        target === 'all' || checkedNos.includes(r.frcptlArtclNo)
          ? recalcBidCn({
              ...r,
              ...(fwkSplyBzentyNm ? { splyBzentyNm: fwkSplyBzentyNm } : {}),
              ...(fwkCrncNm ? { crncNm: fwkCrncNm } : {}),
            })
          : r,
      ),
    )
  }

  // ── 업로드 — 첨부문서업로드 팝업(UI-BD-04-P75) 호출 자리. 목업은 파일명 스텁 주입 ──
  const handleUpload = (frcptlArtclNo: string, field: 'itemSbstDocEn' | 'moqDocEn') => {
    console.log('[M77] 첨부문서업로드 팝업 호출(UI-BD-04-P75)', frcptlArtclNo, field)
    // 추후 API: bdService.uploadOvsBidCnDoc(...)
    updateRow(frcptlArtclNo, {
      [field]: field === 'itemSbstDocEn' ? '품목대체증빙.pdf' : 'MOQ증빙.pdf',
    } as Partial<MockItitbBidCnItem>)
  }

  // ── 입찰내역 저장 — 필수값(입찰업체·화폐단위·입찰단가) + 조건부 필수(Replace/MOQ=Y) 검증 후 저장(암호화) ──
  //   2026-09-01 사용자 확정: 필수값이 모두 입력되어야 저장 가능.
  const handleSave = () => {
    for (const r of rows) {
      if (!r.splyBzentyNm || !r.crncNm || !r.bdngTccrUntprc) {
        setNotice({
          open: true,
          variant: 'error',
          title: `항목 ${r.frcptlArtclNo} 필수 항목 미입력`,
          description: '입찰업체·화폐단위·입찰단가를 모두 입력해주세요.',
        })
        return
      }
      if (r.itemSbstSe === 'R' && (!r.itemSbstDocEn || !r.mdfcnInvtNo || !r.mdfcnPrtsNo)) {
        setNotice({
          open: true,
          variant: 'error',
          title: `항목 ${r.frcptlArtclNo} 품목대체 필수 항목 미입력`,
          description: '품목대체구분이 Replace인 경우 품목대체첨부문서·수정재고번호·수정부품번호를 입력해주세요.',
        })
        return
      }
      if (r.moqYn === 'Y' && (!r.moqQty || !r.moqDocEn)) {
        setNotice({
          open: true,
          variant: 'error',
          title: `항목 ${r.frcptlArtclNo} MOQ 필수 항목 미입력`,
          description: 'MOQ구분이 Y인 경우 MOQ수량·MOQ첨부문서를 입력해주세요.',
        })
        return
      }
    }
    console.log('[M77] 입찰내역 저장(암호화)', detail.intgRfrncNo, rows)
    // 추후 API: bdService.saveTmprBidCn(intgRfrncNo, rows) — 임시입찰내용저장
    setNotice({ open: true, variant: 'check', title: '입찰내역이 저장되었습니다.' })
  }

  // ── 입찰내역 삭제 — 선택한 품목의 입찰내역(작성값)만 초기화 (slide319 임시입찰내용삭제) ──
  const handleDeleteClick = () => {
    if (checkedNos.length === 0) {
      setNotice({ open: true, variant: 'info', title: '삭제할 품목을 선택해주세요.' })
      return
    }
    setDeleteOpen(true)
  }
  const handleDeleteConfirm = () => {
    console.log('[M77] 입찰내역 삭제', detail.intgRfrncNo, checkedNos)
    // 추후 API: bdService.deleteTmprBidCn(intgRfrncNo, checkedNos) — 임시입찰내용삭제
    setRows((prev) =>
      prev.map((r) => (checkedNos.includes(r.frcptlArtclNo) ? { ...r, ...EMPTY_BID_FIELDS } : r)),
    )
    setCheckedNos([])
  }

  const handleLoadMore = () => {
    console.log('[M77] 입찰 품목 더보기', detail.intgRfrncNo, visibleCount)
    // 추후 API: bdService.selectTmprBidCnList(intgRfrncNo) — no.60 임시입찰내용조회(다음 페이지 append)
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, rows.length))
  }

  return (
    <>
      {/* '입찰내역(단가제)' PageTitle 삭제(사용자 확정 2026-08-25 — 탭명이 '입찰내역'으로 개명돼 중복).
          topDivider 없음 — 탭(TabList) 바로 아래 붙는 라인 제거(기확정 규칙). */}
      {/* 입찰내역 일괄적용 (dl_fwkInfo) — 접힘/펼침 아코디언(2026-09-01 사용자 요청, 기본 펼침).
          입찰업체/화폐단위 선택 후 전체·선택 적용. */}
      <Accordion type="multiple" defaultValue={['fwk']} className="w-full">
        <AccordionSection value="fwk" title="입찰내역 일괄적용" borderTop={false}>
          <div className="flex flex-col gap-krds-6">
            <Field label="입찰업체">
              <SelectBox
                items={SPLY_BZENTY_ITEMS}
                placeholder="미선택"
                value={fwkSplyBzentyNm || undefined}
                onValueChange={setFwkSplyBzentyNm}
              />
            </Field>
            <Field label="화폐단위">
              <SelectBox
                items={CRNC_ITEMS}
                placeholder="미선택"
                value={fwkCrncNm || undefined}
                onValueChange={setFwkCrncNm}
              />
            </Field>
            <ButtonGroup
              layout="split"
              items={[
                { label: '전체 적용', variant: 'secondary', onClick: () => applyFwk('all') },
                { label: '선택 적용', variant: 'primary', onClick: () => applyFwk('selected') },
              ]}
            />
          </div>
        </AccordionSection>
      </Accordion>

      {/* 입찰 품목 — 총 N건 */}
      <SectionTitle as="h3" topDivider info={`총 ${rows.length}건`}>
        입찰 품목
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {visibleRows.map((row) => {
          const isReplace = row.itemSbstSe === 'R'
          const isMoq = row.moqYn === 'Y'
          const isExpanded = expandedNos.includes(row.frcptlArtclNo)

          // 접힘 요약 — 항목번호/재고번호/부품번호/품명 (설계서 slide314 접힘 카드)
          const summaryRows: TableRow[] = [
            { label: '항목번호', value: row.frcptlArtclNo },
            { label: '재고번호', value: row.invtNo },
            { label: '부품번호', value: row.prtsNo },
            // 품명은 카드 타이틀로 승격(Figma 10020:85034) — 행에서 제외.
          ]
          // 펼침 시 품목 기본정보(ReadOnly)
          const itemInfoRows: TableRow[] = [
            { label: '단위', value: row.unitNm },
            { label: '수량', value: row.qty, type: 'number' },
            { label: '지시단가', value: row.drctnUntprc, type: 'number' },
          ]

          return (
            <Card
              key={row.frcptlArtclNo}
              title={row.itemNm}
              titleTrailing={
                <Checkbox
                  variant="box"
                  aria-label={`${row.itemNm} 선택`}
                  checked={checkedNos.includes(row.frcptlArtclNo)}
                  onCheckedChange={(c) => toggleChecked(row.frcptlArtclNo, c === true)}
                />
              }
              rows={summaryRows}
              footer={
                <div className="flex flex-col gap-krds-5">

              {isExpanded && (
                <>
                  <Table rows={itemInfoRows} />

                  {/* ── 품목대체 (Replace 시 첨부/수정재고·부품번호 활성+필수, slide319) ── */}
                  <div className="flex flex-col gap-krds-6 pt-krds-3">
                    <Field label="품목대체구분" required>
                      <RadioButtonGroup
                        items={[
                          { value: 'A', label: 'As it is' },
                          { value: 'R', label: 'Replace' },
                        ]}
                        value={row.itemSbstSe}
                        onValueChange={(v) =>
                          updateRow(row.frcptlArtclNo, { itemSbstSe: v as 'A' | 'R' })
                        }
                      />
                    </Field>
                    <Field label="품목대체첨부문서" required={isReplace}>
                      {row.itemSbstDocEn ? (
                        <FileDownloadList
                          files={[
                            {
                              id: `${row.frcptlArtclNo}-sbst`,
                              name: row.itemSbstDocEn,
                              onRemove: () => updateRow(row.frcptlArtclNo, { itemSbstDocEn: '' }),
                            },
                          ]}
                        />
                      ) : (
                        <Button
                          variant="secondary"
                          disabled={!isReplace}
                          onClick={() => handleUpload(row.frcptlArtclNo, 'itemSbstDocEn')}
                        >
                          <Icon name="Add" size={20} aria-hidden />
                          업로드
                        </Button>
                      )}
                    </Field>
                    <Field label="수정재고번호" required={isReplace}>
                      <InputBox
                        placeholder="입력해주세요."
                        disabled={!isReplace}
                        value={row.mdfcnInvtNo}
                        onChange={(e) =>
                          updateRow(row.frcptlArtclNo, { mdfcnInvtNo: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="수정부품번호" required={isReplace}>
                      <InputBox
                        placeholder="입력해주세요."
                        disabled={!isReplace}
                        value={row.mdfcnPrtsNo}
                        onChange={(e) =>
                          updateRow(row.frcptlArtclNo, { mdfcnPrtsNo: e.target.value })
                        }
                      />
                    </Field>

                    {/* ── MOQ (Y 시 수량/첨부 활성+필수, slide319) ── */}
                    <Field label="MOQ구분" required>
                      <RadioButtonGroup
                        items={[
                          { value: 'Y', label: 'Y' },
                          { value: 'N', label: 'N' },
                        ]}
                        value={row.moqYn}
                        onValueChange={(v) => updateRow(row.frcptlArtclNo, { moqYn: v as 'Y' | 'N' })}
                      />
                    </Field>
                    <Field label="MOQ수량" required={isMoq}>
                      <InputBox
                        inputType="numeric"
                        format={fmtComma}
                        placeholder="입력해주세요."
                        disabled={!isMoq}
                        value={fmtComma(row.moqQty)}
                        onChange={(e) =>
                          updateRow(row.frcptlArtclNo, { moqQty: e.target.value.replace(/,/g, '') })
                        }
                      />
                    </Field>
                    <Field label="MOQ첨부문서" required={isMoq}>
                      {row.moqDocEn ? (
                        <FileDownloadList
                          files={[
                            {
                              id: `${row.frcptlArtclNo}-moq`,
                              name: row.moqDocEn,
                              onRemove: () => updateRow(row.frcptlArtclNo, { moqDocEn: '' }),
                            },
                          ]}
                        />
                      ) : (
                        <Button
                          variant="secondary"
                          disabled={!isMoq}
                          onClick={() => handleUpload(row.frcptlArtclNo, 'moqDocEn')}
                        >
                          <Icon name="Add" size={20} aria-hidden />
                          업로드
                        </Button>
                      )}
                    </Field>

                    {/* ── 납기 ── */}
                    <Field label="납기(본조)">
                      <InputBox
                        placeholder="YYYY-MM-DD"
                        value={row.bscbgtDudtYmd}
                        onChange={(e) =>
                          updateRow(row.frcptlArtclNo, { bscbgtDudtYmd: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="납기(당국)">
                      <InputBox
                        placeholder="YYYY-MM-DD"
                        value={row.athrtDudtYmd}
                        onChange={(e) =>
                          updateRow(row.frcptlArtclNo, { athrtDudtYmd: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="납기(장국)">
                      <InputBox
                        placeholder="YYYY-MM-DD"
                        value={row.ltbndDudtYmd}
                        onChange={(e) =>
                          updateRow(row.frcptlArtclNo, { ltbndDudtYmd: e.target.value })
                        }
                      />
                    </Field>

                    {/* ── 입찰내역 — 입찰단가/화폐단위 변경 시 파생값 자동 계산(slide319) ── */}
                    <Field label="입찰업체" required>
                      <SelectBox
                        items={SPLY_BZENTY_ITEMS}
                        placeholder="미선택"
                        value={row.splyBzentyNm || undefined}
                        onValueChange={(v) => updateRow(row.frcptlArtclNo, { splyBzentyNm: v })}
                      />
                    </Field>
                    <Field label="화폐단위" required>
                      <SelectBox
                        items={CRNC_ITEMS}
                        placeholder="미선택"
                        value={row.crncNm || undefined}
                        onValueChange={(v) => updateRow(row.frcptlArtclNo, { crncNm: v })}
                      />
                    </Field>
                    <Field label="입찰단가" required>
                      <InputBox
                        inputType="numeric"
                        format={fmtComma}
                        placeholder="입력해주세요."
                        value={fmtComma(row.bdngTccrUntprc)}
                        onChange={(e) =>
                          updateRow(row.frcptlArtclNo, {
                            bdngTccrUntprc: e.target.value.replace(/,/g, ''),
                          })
                        }
                      />
                    </Field>

                    {/* 계산 결과(ReadOnly) — disabled InputBox 재사용 컨벤션 */}
                    <Field label="입찰금액">
                      <InputBox disabled value={row.bdngTccrAmt} />
                    </Field>
                    <Field label="달러환산율">
                      <InputBox disabled value={row.usdExrt} />
                    </Field>
                    <Field label="달러단가">
                      <InputBox disabled value={row.bdngUsdUntprc} />
                    </Field>
                    <Field label="달러금액">
                      <InputBox disabled value={row.bdngUsdAmt} />
                    </Field>
                  </div>
                </>
              )}

              {/* 내역 펼쳐보기 ↓ / 내역 접기 ↑ */}
              <Button
                variant="inner"
                className="w-full"
                onClick={() => toggleExpanded(row.frcptlArtclNo)}
              >
                {isExpanded ? '내역 접기' : '내역 펼쳐보기'}
                <Icon
                  name="ExpandMore"
                  size={20}
                  className={isExpanded ? 'rotate-180' : undefined}
                  aria-hidden
                />
              </Button>
                </div>
              }
            />
          )
        })}

        {/* 더보기 — 클릭 시 다음 페이지 로드(추후 API). 추가 항목 없으면 숨김. */}
        {hasMore && (
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({visibleRows.length}/{rows.length})
          </Button>
        )}
      </div>

      {/* 하단 액션바 — 입찰내역 삭제(선택 품목) / 입찰내역 저장 */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '입찰내역 삭제', variant: 'secondary', onClick: handleDeleteClick },
            { label: '입찰내역 저장', variant: 'primary', onClick: handleSave },
          ]}
        />
      </div>

      {/* 안내/검증 모달 */}
      <AlertModal
        open={notice.open}
        onOpenChange={(o) => setNotice((m) => ({ ...m, open: o }))}
        variant={notice.variant}
        title={notice.title}
        description={notice.description}
        primaryAction={{ label: '확인' }}
      />

      {/* 삭제 확인 모달 — 선택한 품목의 입찰내역 초기화 */}
      <AlertModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        variant="error"
        title="선택한 품목의 입찰내역을 삭제하시겠습니까?"
        description={`선택 품목 ${checkedNos.length}건의 작성 내역이 초기화됩니다.`}
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '삭제', onClick: handleDeleteConfirm }}
      />
    </>
  )
}
BidDsctn.displayName = 'BidDsctn'
