// 사전의향서상세 - '품목명세서' 탭 콘텐츠 (MUI-TS-01-T02). 설계서 06.업무지원 v0.82 slide14~15, 17.
// 품목 카드(기본 9행 + 내역 펼쳐보기) + [의견작성] 버튼 → 의견작성 바텀시트(MUI-TS-01-P03).
// P03 컨테이너(BottomSheet·footer 임시저장/제출)와 폼 상태는 이 탭이 소유, 콘텐츠는 BfhdLoiWrt.
// 검증·안내 메시지는 설계서(slide15)가 확인 모달로 정의 — AlertModal 로 처리(RHF 인라인 검증 부적합).
// 접수기간 만료(expired) 시 의견작성 버튼 미노출·기 작성 내역만 표시(slide14).
// 재고번호 [보기](품목별검색 P71 팝업)는 상세설계 미확정 — 콘솔 스텁.
import { memo, useMemo, useState } from 'react'

import { tsQueries } from '@/queries/cts/ts/tsQueries'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BfhdLoiWrt } from '@/ui/biz/ts/bfhdLoiDtl/BfhdLoiWrt'
import { cn } from '@/utils/cn'
import type { ApiError } from '@/types/api'
import type { BfhdLoiSpcfctItem } from '@/types/mock/ts'

// 기본 노출 행수(순번~최초조달원, slide14 목록 노출) — 나머지는 "내역 펼쳐보기"로 토글.
const DEFAULT_VISIBLE = 9

function buildRows(item: BfhdLoiSpcfctItem, onView: (invtNo: string) => void): TableRow[] {
  return [
    { label: '순번', value: String(item.no) },
    { label: '제조/구매', value: item.mnftrPrchsSecd || '-' },
    { label: '의견', value: item.etcOpnnCn || '-' },
    { label: '조달요구번호', value: item.prcmRqtNo },
    {
      label: '재고번호',
      type: 'combination',
      value: (
        <>
          <span>{item.mdfcnInvtNo}</span>
          <div>
            <Button size="sm" variant="inner" onClick={() => onView(item.mdfcnInvtNo)}>
              보기
            </Button>
          </div>
        </>
      ),
    },
    { label: '품명', value: item.itemNm },
    { label: '단위', value: item.unitCd },
    { label: '부서', value: item.deptCd },
    { label: '최초조달원', value: item.frstSosCd },
    { label: '현재조달원', value: item.implInstCd },
    { label: '장기사업구분', value: item.lshtmSecd },
    { label: '예산구분', value: item.bgtSecd },
    { label: '정비품목구분', value: item.mtncItemSecd },
    { label: '규격번호', value: item.spcfctNo },
    { label: '요구일자', value: item.rqtYmd },
    { label: '조달지시구분', value: item.prcmDrctnSecd },
    { label: '요구수량', value: item.rqtQty.toLocaleString(), type: 'number' },
    { label: '요구단가', value: `${item.rqtUntprc.toLocaleString()} 원`, type: 'number' },
    { label: '요구금액', value: `${item.rqtAmt.toLocaleString()} 원`, type: 'number' },
  ]
}

// 품목 1건 카드 — 기본 9행 + 펼쳐보기/접기 + 의견작성 버튼(만료 시 미노출).
const SpcfctItemCard = memo(function SpcfctItemCard({
  item,
  expired,
  onView,
  onWrite,
}: {
  item: BfhdLoiSpcfctItem
  expired: boolean
  onView: (invtNo: string) => void
  onWrite: (item: BfhdLoiSpcfctItem) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const allRows = useMemo(() => buildRows(item, onView), [item, onView])
  const rows = expanded ? allRows : allRows.slice(0, DEFAULT_VISIBLE)

  return (
    <div className="flex flex-col px-4">
      <Table rows={rows} />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-center gap-krds-3 py-krds-6 text-[17px] font-medium text-krds-text-ink"
      >
        {expanded ? '내역 접기' : '내역 펼쳐보기'}
        <Icon
          name="ExpandMore"
          size={20}
          aria-hidden
          className={cn('transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>
      {/* 의견작성(P03) — 제출 기간 경과 시 입력폼 미노출(slide14) */}
      {!expired && (
        <Button variant="secondary" className="w-full" onClick={() => onWrite(item)}>
          의견작성
        </Button>
      )}
    </div>
  )
})

export interface BfhdLoiDtl_ItemListProps {
  /** 조회 대상 사전의향서 번호 — 페이지(navigate state id)가 주입. */
  id: string
  /** 접수기간 만료 여부(detail.expryYn) — 만료 시 의견작성 미노출. */
  expired: boolean
}

export function BfhdLoiDtl_ItemList({ id, expired }: BfhdLoiDtl_ItemListProps) {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // ── 의견작성(P03) 시트 상태 — 선택 품목(null=닫힘) + 폼 값 ──
  const [pickedItem, setPickedItem] = useState<BfhdLoiSpcfctItem | null>(null)
  const [mnftrPrchsSecd, setMnftrPrchsSecd] = useState('')
  const [etcOpnnCn, setEtcOpnnCn] = useState('')
  // 안내 확인 모달(slide15) — null=닫힘. onConfirm 은 확인 클릭 시 추가 동작(시트 닫기 등).
  const [notice, setNotice] = useState<{ message: string; onConfirm?: () => void } | null>(null)
  // 저장 없이 닫기(내용 있음) Y/N 확인
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)

  const { data: items = [] } = tsQueries.useSelectBfhdLoiSpcfctList(id)
  // 임시저장/제출이 각각 별도 API(no.481/no.482) — mode 로 분기.
  const saveOpnn = tsQueries.useSaveMnftrPrchsOpnnInpt()
  const submitLoi = tsQueries.useSaveBfhdLoiSbmsn()

  const total = items.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = items.slice(0, loaded)

  // 재고번호 [보기] — 품목별검색(MUI-OP-01-P71) 팝업 호출(상세설계 미확정, 스텁).
  const handleView = (invtNo: string) => {
    console.log('[T02] 재고번호 품목별검색(P71) 팝업(미배선)', invtNo)
  }

  // 의견작성 열기 — 기 작성 내역을 폼에 반영(slide14).
  const handleWrite = (item: BfhdLoiSpcfctItem) => {
    setMnftrPrchsSecd(item.mnftrPrchsSecd)
    setEtcOpnnCn(item.etcOpnnCn)
    setPickedItem(item)
  }

  // 임시저장/제출 공통 — 검증(제조·구매 선택 → 의견 입력) 후 mutation(slide15).
  const handleSave = async (mode: 'save' | 'submit') => {
    if (!pickedItem) return
    if (!mnftrPrchsSecd) {
      setNotice({ message: '제조/구매를 먼저 선택해주세요.' })
      return
    }
    if (!etcOpnnCn.trim()) {
      setNotice({ message: '의견을 작성하고 임시저장 또는 제출을 해주시길 바랍니다.' })
      return
    }
    try {
      await (mode === 'save' ? saveOpnn : submitLoi).mutateAsync({
        bfhdLoiNo: id,
        prcmRqtNo: pickedItem.prcmRqtNo,
        mnftrPrchsSecd,
        etcOpnnCn: etcOpnnCn.trim(),
        mode,
      })
      setNotice({
        message: mode === 'save' ? '임시저장 되었습니다.' : '제출되었습니다.',
        onConfirm: () => setPickedItem(null), // 확인 → 팝업 닫기(내용은 캐시 무효화로 반영)
      })
    } catch (err) {
      setNotice({
        message: (err as ApiError | null)?.message ?? '처리에 실패했습니다. 잠시 후 다시 시도해주세요.',
      })
    }
  }

  // 시트 닫기 시도 — 내용이 있으면 저장 없이 닫을지 Y/N 확인(slide15).
  const handleSheetClose = (nextOpen: boolean) => {
    if (nextOpen) return
    if (mnftrPrchsSecd || etcOpnnCn.trim()) {
      setCloseConfirmOpen(true)
      return
    }
    setPickedItem(null)
  }

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      <div className="px-4">
        <ListSectionHeader
          total={total}
          pageSize={pageSize}
          onPageSizeChange={(s) => {
            setPageSize(s)
            setPage(1)
          }}
        />
      </div>

      {/* 품목 카드 목록 */}
      <div className="flex flex-col gap-krds-8">
        {visibleList.map((item) => (
          <SpcfctItemCard
            key={item.id}
            item={item}
            expired={expired}
            onView={handleView}
            onWrite={handleWrite}
          />
        ))}
      </div>

      {/* 안내(slide14 4]) */}
      <p className="px-4 text-krds-body-sm text-krds-text-muted">
        ※ 제조/구매에서 [의견작성] 선택 시 의견 작성 가능합니다.
      </p>

      {/* 더보기 */}
      {loaded < total && (
        <div className="px-4">
          <Button variant="secondary" className="w-full" onClick={() => setPage(page + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 의견작성(MUI-TS-01-P03) 바텀시트 — 컨테이너·footer([임시저장/제출])는 이 탭이 소유 */}
      <BottomSheet
        open={pickedItem !== null}
        onOpenChange={handleSheetClose}
        title="의견작성"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '임시저장', variant: 'secondary', onClick: () => handleSave('save') },
              { label: '제출', variant: 'primary', onClick: () => handleSave('submit') },
            ]}
          />
        }
      >
        <BfhdLoiWrt
          mnftrPrchsSecd={mnftrPrchsSecd}
          onMnftrPrchsSecdChange={setMnftrPrchsSecd}
          etcOpnnCn={etcOpnnCn}
          onEtcOpnnCnChange={setEtcOpnnCn}
        />
      </BottomSheet>

      {/* 안내 확인 모달(slide15 — 검증/저장/제출 결과) */}
      <AlertModal
        open={notice !== null}
        onOpenChange={(open) => {
          if (!open) setNotice(null)
        }}
        variant="info"
        title="의견작성"
        description={notice?.message}
        primaryAction={{
          label: '확인',
          onClick: () => {
            notice?.onConfirm?.()
            setNotice(null)
          },
        }}
      />

      {/* 저장 없이 닫기 확인(Y/N, slide15) */}
      <AlertModal
        open={closeConfirmOpen}
        onOpenChange={setCloseConfirmOpen}
        variant="info"
        title="의견작성"
        description="작성한 내용이 있습니다. 저장하지 않고 닫으시겠습니까?"
        secondaryAction={{ label: '아니오' }}
        primaryAction={{
          label: '예',
          onClick: () => {
            setCloseConfirmOpen(false)
            setPickedItem(null)
          },
        }}
      />
    </div>
  )
}
BfhdLoiDtl_ItemList.displayName = 'BfhdLoiDtl_ItemList'
