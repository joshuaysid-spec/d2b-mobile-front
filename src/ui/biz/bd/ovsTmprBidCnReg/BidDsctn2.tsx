// 입찰내역 작성 - 입찰내역(총액제) (MUI-BD-01-T76(구 M78 — v1.83 재편), 설계서 07국외입찰공고상세 slide315·318·319)
// 호스트 페이지(OvsTmprBidCnRegPage)의 '품목 목록' 탭 본문(총액제) — 요약/탭/FAB 는 페이지 소유.
// 구성: PageTitle → 입찰 품목(총 N건, ReadOnly Table 반복 · dl_alonbsItemList) → 더보기 →
//   입찰내역(dl_alonbsBidCnInfo: 입찰업체/화폐단위/입찰금액 입력 + 달러금액/달러환산율 계산) →
//   하단 액션바(입찰내역 삭제/저장).
// 이벤트(설계서 slide319): 입찰금액 변경 → 달러금액 계산 · 화폐단위 변경 → 달러금액/달러환산율 계산.
import { useEffect, useState, type ReactNode } from 'react'

import { bdQueries } from '@/queries/bds/bd/bdQueries'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockAlonbsBidCnInfo, MockAlonbsItem, MockBscPbancInfo } from '@/types/mock/bd'

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

const fmtAmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtComma = (raw: string) => (raw ? Number(raw).toLocaleString('en-US') : '')

// 입찰금액/화폐단위 변경 시 달러금액·달러환산율 재계산 (설계서 slide319 이벤트)
function recalcBidCn(info: MockAlonbsBidCnInfo): MockAlonbsBidCnInfo {
  const exrt = USD_EXRT_BY_CRNC[info.crncNm]
  const amt = Number(info.bdngTccrAmt.replace(/,/g, '')) || 0
  return {
    ...info,
    usdExrt: exrt ? exrt.toFixed(4) : '',
    bdngUsdAmt: exrt && amt ? fmtAmt(amt * exrt) : '',
  }
}

const PAGE_SIZE = 5

// ── 입찰품목(총액제) 목업 (dl_alonbsItemList, 설계서 slide315 예시값 형식) ──
const MOCK_ALONBS_ITEM_LIST: MockAlonbsItem[] = [
  { frcptlArtclNo: '1', invtNo: 'A000-A0001', prtsNo: '369A1234-5', itemNm: 'T-80U/TBE-3', unitNm: 'EA', qty: '1' },
  { frcptlArtclNo: '2', invtNo: 'A000-A0002', prtsNo: '369A5501-3', itemNm: 'MAIN ROTOR BLADE ASSY', unitNm: 'EA', qty: '2' },
  { frcptlArtclNo: '3', invtNo: 'A000-A0003', prtsNo: '369D2210-11', itemNm: 'TAIL ROTOR ASSY', unitNm: 'EA', qty: '1' },
  { frcptlArtclNo: '4', invtNo: 'A000-A0004', prtsNo: '369H9020-7', itemNm: 'ENGINE FUEL PUMP', unitNm: 'EA', qty: '4' },
  { frcptlArtclNo: '5', invtNo: 'A000-A0005', prtsNo: '369A7003-1', itemNm: 'HYDRAULIC ACTUATOR', unitNm: 'EA', qty: '2' },
  { frcptlArtclNo: '6', invtNo: 'A000-A0006', prtsNo: '369D2911-4', itemNm: 'LANDING GEAR STRUT', unitNm: 'EA', qty: '2' },
  { frcptlArtclNo: '7', invtNo: 'A000-A0007', prtsNo: '369F1105-9', itemNm: 'MAIN TRANSMISSION GEARBOX', unitNm: 'EA', qty: '1' },
]

// 입찰내역(총액제) — 진입 시 임시입찰내용조회(no.60)로 기존 저장분 로드(2026-09-02 배선,
//   구 인라인 초기값은 mocks/bd.ts tmprAlonbsBidCn 으로 이관). 조회 전 빈 폼.
const EMPTY_ALONBS_BID_CN: MockAlonbsBidCnInfo = {
  splyBzentyNm: '',
  crncNm: '',
  bdngTccrAmt: '',
  bdngUsdAmt: '',
  usdExrt: '',
}

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

export function BidDsctn2({ detail }: { detail: MockBscPbancInfo }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  // 기존 저장분 조회(no.60) — 재진입 시 임시저장된 입찰내역 복원(사용자 확정 2026-09-02).
  const { data: saved } = bdQueries.useSelectTmprBidCnList(detail.intgRfrncNo, '총액제')
  const [bidCn, setBidCn] = useState<MockAlonbsBidCnInfo>(EMPTY_ALONBS_BID_CN)
  useEffect(() => {
    if (saved && !Array.isArray(saved)) setBidCn(saved)
  }, [saved])
  const [notice, setNotice] = useState<NoticeModal>({ open: false, variant: 'info', title: '' })
  const [deleteOpen, setDeleteOpen] = useState(false)

  const visibleItems = MOCK_ALONBS_ITEM_LIST.slice(0, visibleCount)
  const hasMore = visibleCount < MOCK_ALONBS_ITEM_LIST.length

  const updateBidCn = (patch: Partial<MockAlonbsBidCnInfo>) =>
    setBidCn((prev) => recalcBidCn({ ...prev, ...patch }))

  const itemRows = (item: MockAlonbsItem): TableRow[] => [
    { label: '항목번호', value: item.frcptlArtclNo },
    { label: '재고번호', value: item.invtNo },
    { label: '부품번호', value: item.prtsNo },
    { label: '품명', value: item.itemNm },
    { label: '단위', value: item.unitNm },
    { label: '수량', value: item.qty, type: 'number' },
  ]

  const handleLoadMore = () => {
    console.log('[M78] 입찰 품목 더보기', detail.intgRfrncNo, visibleCount)
    // 추후 API: bdService.selectTmprBidCnList(intgRfrncNo) — no.60 임시입찰내용조회(다음 페이지 append)
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, MOCK_ALONBS_ITEM_LIST.length))
  }

  // ── 입찰내역 저장 — 필수(입찰업체/화폐단위/입찰금액, 설계서 slide318 필수 Y) 검증 후 저장(암호화) ──
  const handleSave = () => {
    if (!bidCn.splyBzentyNm || !bidCn.crncNm || !bidCn.bdngTccrAmt) {
      setNotice({
        open: true,
        variant: 'error',
        title: '필수 항목 미입력',
        description: '입찰업체·화폐단위·입찰금액을 입력해주세요.',
      })
      return
    }
    console.log('[M78] 입찰내역 저장(암호화)', detail.intgRfrncNo, bidCn)
    // 추후 API: bdService.saveTmprBidCn(intgRfrncNo, bidCn) — 임시입찰내용저장
    setNotice({ open: true, variant: 'check', title: '입찰내역이 저장되었습니다.' })
  }

  // ── 입찰내역 삭제 — 작성한 입찰내역 초기화 (slide319 임시입찰내용삭제) ──
  const handleDeleteConfirm = () => {
    console.log('[M78] 입찰내역 삭제', detail.intgRfrncNo)
    // 추후 API: bdService.deleteTmprBidCn(intgRfrncNo) — 임시입찰내용삭제
    setBidCn({ splyBzentyNm: '', crncNm: '', bdngTccrAmt: '', bdngUsdAmt: '', usdExrt: '' })
  }

  return (
    <>
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        입찰내역(총액제)
      </PageTitle>

      {/* 입찰 품목 — 총 N건 (ReadOnly) */}
      <SectionTitle as="h3" topDivider info={`총 ${MOCK_ALONBS_ITEM_LIST.length}건`}>
        입찰 품목
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {visibleItems.map((item) => (
          <Table key={item.frcptlArtclNo} rows={itemRows(item)} />
        ))}

        {/* 더보기 — 클릭 시 다음 페이지 로드(추후 API). 추가 항목 없으면 숨김. */}
        {hasMore && (
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({visibleItems.length}/{MOCK_ALONBS_ITEM_LIST.length})
          </Button>
        )}
      </div>

      {/* 입찰내역 (dl_alonbsBidCnInfo) — 입찰금액/화폐단위 변경 시 달러금액·달러환산율 자동 계산 */}
      <SectionTitle as="h3" topDivider>
        입찰내역
      </SectionTitle>
      <div className="flex flex-col gap-krds-6 px-4 pb-4">
        <Field label="입찰업체" required>
          <SelectBox
            items={SPLY_BZENTY_ITEMS}
            placeholder="미선택"
            value={bidCn.splyBzentyNm || undefined}
            onValueChange={(v) => updateBidCn({ splyBzentyNm: v })}
          />
        </Field>
        <Field label="화폐단위" required>
          <SelectBox
            items={CRNC_ITEMS}
            placeholder="미선택"
            value={bidCn.crncNm || undefined}
            onValueChange={(v) => updateBidCn({ crncNm: v })}
          />
        </Field>
        <Field label="입찰금액" required>
          <InputBox
            inputType="numeric"
            format={fmtComma}
            placeholder="입력해주세요."
            value={fmtComma(bidCn.bdngTccrAmt)}
            onChange={(e) => updateBidCn({ bdngTccrAmt: e.target.value.replace(/,/g, '') })}
          />
        </Field>

        {/* 계산 결과(ReadOnly) — disabled InputBox 재사용 컨벤션 */}
        <Field label="달러금액">
          <InputBox disabled value={bidCn.bdngUsdAmt} />
        </Field>
        <Field label="달러환산율">
          <InputBox disabled value={bidCn.usdExrt} />
        </Field>
      </div>

      {/* 하단 액션바 — 입찰내역 삭제 / 입찰내역 저장 */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '입찰내역 삭제', variant: 'secondary', onClick: () => setDeleteOpen(true) },
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

      {/* 삭제 확인 모달 — 작성한 입찰내역 초기화 */}
      <AlertModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        variant="error"
        title="입찰내역을 삭제하시겠습니까?"
        description="작성한 입찰내역이 초기화됩니다."
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '삭제', onClick: handleDeleteConfirm }}
      />
    </>
  )
}
BidDsctn2.displayName = 'BidDsctn2'
