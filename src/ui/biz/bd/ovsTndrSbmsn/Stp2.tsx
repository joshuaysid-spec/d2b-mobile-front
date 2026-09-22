// 국외 입찰서제출 - 스탭2 입찰참여품목 (MUI-BD-06-T72(구 M72 — v1.83 재편) 단가제 · MUI-BD-06-T73(구 M73 — v1.83 재편) 총액제,
//   설계서 v1.88 slide477(단가제)·slide478(총액제)).
// 호스트 페이지(OvsTndrSbmsnPage)의 '입찰참여품목' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 단가제(M72)/총액제(M73)는 한 파일에서 detail.bidMthdNm 데이터 모드로 분기(설계서 화면 목록: 두 화면 모두 Stp2.tsx).
// - 단가제: 품목 카드(기본 4행 + 내역 펼쳐보기/접기, PrcmPlanDtl_PrdList 패턴). 입찰단가(E) 입력은 표 행 안 배치
//   → 입찰금액/달러단가/달러금액 자동 계산(설계서 이벤트 ibx_unitPrice_onchange). 첨부문서는 O/X 표시(O만 [보기]).
// - 총액제: 입찰내역 아코디언(위 — 입찰금액(E) 표 행 입력 → 달러금액 계산, ibx_amountPrice_onchange)
//   + 입찰 품목 목록(아래, 읽기전용) — slide478 배치 순서.
// 항목명/형식은 데이터영역(slide371 dl_ititbBidCnList · slide372 dl_alonbsItemList/dl_alonbsBidCnInfo) 그대로(types/mock/bd).
// 폼: react-hook-form + zod(ovsTndrItemSchema) — 탭마다 RHF, 페이지는 확정값만 보관(forms.md 스텝 마법사 규칙, 2026-09-16 적용).
//   [다음으로]는 페이지가 ref.submit() 으로 트리거 → 통과 시 onSubmit(값) → 페이지가 저장 후 다음 탭.
//   실패 시 이동 없이 첫 에러 품목을 더보기 범위·펼침 상태로 만든 뒤 focusField(카드 안 앵커) — shouldFocusError 는 끄고 한 경로.
import * as React from 'react'
import {
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import {
  ovsTndrItemSchema,
  type OvsTndrItemValues,
} from '@/ui/biz/bd/ovsTndrSbmsn/OvsTndrSbmsn.schema'
import {
  formatDecimal2,
  MOCK_ALONBS_BID_CN,
  MOCK_ALONBS_ITEMS,
  MOCK_ITITB_ITEMS,
  OVS_TNDR_ITEM_PAGE_SIZE,
  OVS_TNDR_ITEM_TOTAL,
} from '@/ui/biz/bd/ovsTndrSbmsn/ovsTndrSbmsnMock'
import { cn } from '@/utils/cn'
import { focusField } from '@/utils/focusField'
import type { MockOvsItitbBidCnItem, MockOvsTndrSbmsnDetail } from '@/types/mock/bd'

// ── 금액 입력/표시 헬퍼 (국내 TndrWrt_Stp3 과 동일 방식) ─────────────────────
// 천단위 콤마 포맷(formatDecimal2)은 조회 응답 정규화와 공용이라 ovsTndrSbmsnMock 에 둔다.
// 콤마 포함 표시 문자열 → 숫자
const toNumber = (v: string) => Number(v.replace(/,/g, ''))

// 숫자 → '608,000.00' 표시 문자열(소수 둘째자리 고정)
const toAmountString = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const untprcFieldId = (i: number) => `field-items-${i}-bdngTccrUntprc`
const AMT_FIELD_ID = 'field-bdngTccrAmt'

// ── 단가제(M72) 품목 카드 — 기본 4행 + 내역 펼쳐보기/접기(PrcmPlanDtl_PrdList 패턴) ──
function ItitbItemCard({
  index,
  item,
  register,
  control,
  error,
  expanded,
  onToggle,
  onOpenAtchDoc,
}: {
  index: number
  item: MockOvsItitbBidCnItem
  register: UseFormRegister<OvsTndrItemValues>
  control: Control<OvsTndrItemValues>
  /** 입찰단가 에러 문구(RHF errors.items[i].bdngTccrUntprc). */
  error?: string
  expanded: boolean
  onToggle: () => void
  onOpenAtchDoc: (kind: '품목대체', item: MockOvsItitbBidCnItem) => void
}) {
  // 이 카드의 입찰단가만 구독 — 입찰금액/달러단가/달러금액 계산(설계서 slide373 ibx_unitPrice_onchange).
  const bdngTccrUntprc = useWatch({ control, name: `items.${index}.bdngTccrUntprc` }) ?? ''
  const untprc = toNumber(bdngTccrUntprc)
  const qty = toNumber(item.qty)
  const exrt = Number(item.usdExrt)
  const hasUntprc = bdngTccrUntprc !== '' && Number.isFinite(untprc)
  const bdngTccrAmt = hasUntprc ? toAmountString(untprc * qty) : '-' // 입찰금액
  const bdngUsdUntprc = hasUntprc ? toAmountString(untprc * exrt) : '-' // 달러단가
  const bdngUsdAmt = hasUntprc ? toAmountString(untprc * qty * exrt) : '-' // 달러금액

  // 기본(접힘) 4행 — 항목번호/재고번호/부품번호/품명(설계서 slide367).
  const baseRows: TableRow[] = [
    { label: '항목번호', value: item.frcptlArtclNo },
    { label: '재고번호', value: item.invtNo },
    { label: '부품번호', value: item.prtsNo },
    { label: '품명', value: item.itemNm },
  ]

  // 펼침 시 추가 행 — 단위~달러환산율(읽기전용). 첨부문서는 O/X 표시(설계서 slide477 특이사항),
  //   'O' 는 [보기] 로 첨부문서조회 팝업(P76) 호출.
  const detailRows: TableRow[] = [
    { label: '단위', value: item.unitNm },
    { label: '수량', value: item.qty, type: 'number' },
    { label: '지시단가', value: item.drctnUntprc, type: 'number' },
    { label: '품목대체구분', value: item.itemSbstSe },
    {
      label: '품목대체첨부문서',
      type: 'combination',
      value:
        item.itemSbstDocEn === 'O' ? (
          <>
            <span>O</span>
            <div>
              <Button size="sm" variant="inner" onClick={() => onOpenAtchDoc('품목대체', item)}>
                보기
              </Button>
            </div>
          </>
        ) : (
          <span>X</span>
        ),
    },
    { label: '수정재고번호', value: item.mdfcnInvtNo || '-' },
    { label: '수정부품번호', value: item.mdfcnPrtsNo || '-' },
    // MOQ구분/수량/첨부문서 행은 국외 전 화면에서 삭제(2026-09-14 사용자 지시).
    { label: '납기(본조)', value: item.bscbgtDudtYmd },
    { label: '납기(당국)', value: item.athrtDudtYmd },
    { label: '납기(장국)', value: item.ltbndDudtYmd },
    { label: '달러환산율', value: `${item.usdExrt} USD`, type: 'number' },
    // 입찰단가(E) 입력 행 — 표 안 배치(설계서 slide477). 변경 시 아래 입찰금액/달러단가/달러금액 자동 계산.
    //   register 입력 — InputBox 의 format 이 가공값을 onChange 로 넘기므로 폼 값도 콤마 포함 표시 문자열.
    {
      label: '입찰단가',
      type: 'combination',
      value: (
        <div id={untprcFieldId(index)} className="flex w-full flex-col gap-krds-3">
          <InputBox
            inputMode="decimal"
            format={formatDecimal2}
            placeholder="입력해주세요."
            error={!!error}
            aria-invalid={!!error}
            {...register(`items.${index}.bdngTccrUntprc`)}
          />
          {error && <InputMessage type="error">{error}</InputMessage>}
        </div>
      ),
    },
    // 계산 결과 행 — 입찰금액/화폐단위/달러단가/달러금액(설계서 slide477 표시 형식).
    { label: '입찰금액', value: bdngTccrAmt, type: 'number' },
    { label: '화폐단위', value: item.crncNm },
    { label: '달러단가', value: hasUntprc ? `${bdngUsdUntprc} KRW` : '-', type: 'number' },
    { label: '달러금액', value: bdngUsdAmt, type: 'number' },
  ]

  return (
    <div className="flex flex-col">
      <Table rows={expanded ? [...baseRows, ...detailRows] : baseRows} />

      {/* 내역 펼쳐보기/접기 토글 */}
      <button
        type="button"
        onClick={onToggle}
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
    </div>
  )
}

export interface OvsTndrStp2Handle {
  /** 페이지 [다음으로]가 호출 — 검증 통과 시 onSubmit 실행. */
  submit: () => void
}
export interface OvsTndrStp2Props {
  detail: MockOvsTndrSbmsnDetail
  /** 초기값 — 페이지가 보관한 확정값(되돌아올 때) 또는 ovsTndrItemDefault(mode). */
  defaultValues: OvsTndrItemValues
  /** 검증 통과 시 확정값 전달 — 페이지가 저장 후 다음 탭으로. */
  onSubmit: (values: OvsTndrItemValues) => void
}

export const OvsTndrSbmsnPage_Stp2 = React.forwardRef<OvsTndrStp2Handle, OvsTndrStp2Props>(
  ({ detail, defaultValues, onSubmit }, ref) => {
    // 단가제(M72)/총액제(M73) 데이터 모드 분기 — 폼 값 mode(페이지가 detail.bidMthdNm 으로 초기화).
    const isUntprc = defaultValues.mode === '단가제'

    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<OvsTndrItemValues>({
      resolver: zodResolver(ovsTndrItemSchema),
      mode: 'onSubmit',
      reValidateMode: 'onBlur',
      shouldFocusError: false, // 첫 에러 포커스는 아래 handleInvalid(focusField) 한 경로로.
      defaultValues,
    })
    // defaultValues 는 마운트 때만 읽히므로, 탭이 열린 채 페이지 확정값이 바뀌면(임시입찰내용 응답 도착) 재주입한다.
    //   페이지는 최초 1회만 채우고 사용자 확정 후엔 갱신하지 않아 편집 중 리셋되지 않는다.
    React.useEffect(() => {
      reset(defaultValues)
    }, [defaultValues, reset])

    // 더보기 페이징: 현재까지 노출한 건수. 카드 펼침은 탭이 소유(실패 시 에러 카드를 강제로 펼치기 위해).
    const [visibleCount, setVisibleCount] = React.useState(OVS_TNDR_ITEM_PAGE_SIZE)
    const [expanded, setExpanded] = React.useState<Set<number>>(() => new Set())
    const toggle = (i: number) =>
      setExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(i)) next.delete(i)
        else next.add(i)
        return next
      })

    // 입찰금액(총액제, bdngTccrAmt E) — 변경 시 달러금액 계산(설계서 slide373 ibx_amountPrice_onchange).
    const bdngTccrAmt = useWatch({ control, name: 'bdngTccrAmt' }) ?? ''
    const alonbsUsdAmt =
      bdngTccrAmt !== ''
        ? toAmountString(toNumber(bdngTccrAmt) * Number(MOCK_ALONBS_BID_CN.usdExrt))
        : '-'
    const amtError = errors.bdngTccrAmt?.message

    // 실패 시: 단가제는 첫 에러 품목이 더보기 범위 밖이면 노출 확장 + 카드 펼침 후(렌더 후) 앵커 포커스, 총액제는 입찰금액 앵커.
    const pendingFocus = React.useRef<string | null>(null)
    const handleInvalid = (errs: FieldErrors<OvsTndrItemValues>) => {
      if (errs.bdngTccrAmt) {
        pendingFocus.current = AMT_FIELD_ID
        return
      }
      const list = errs.items
      if (!Array.isArray(list)) return
      const i = list.findIndex((row) => row?.bdngTccrUntprc)
      if (i < 0) return
      if (i >= visibleCount) setVisibleCount(i + 1)
      setExpanded((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
      pendingFocus.current = untprcFieldId(i)
    }
    React.useEffect(() => {
      if (!pendingFocus.current) return
      const id = pendingFocus.current
      pendingFocus.current = null
      requestAnimationFrame(() => focusField(id))
    })

    React.useImperativeHandle(ref, () => ({
      submit: () => void handleSubmit(onSubmit, handleInvalid)(),
    }))

    // 단가제/총액제 각각의 노출 목록 — 캐스트 없이 타입 안전하게 분리.
    const visibleItitbItems = MOCK_ITITB_ITEMS.slice(0, visibleCount)
    const visibleAlonbsItems = MOCK_ALONBS_ITEMS.slice(0, visibleCount)
    const listLength = isUntprc ? MOCK_ITITB_ITEMS.length : MOCK_ALONBS_ITEMS.length
    const visibleLength = isUntprc ? visibleItitbItems.length : visibleAlonbsItems.length
    const hasMore = visibleCount < listLength

    const handleLoadMore = () => {
      console.log('[M72/M73] 입찰참여품목 더보기', detail.pbancNo, visibleCount)
      // 추후 API: bdService.selectOvsTndrItemList(pbancNo, pbancOd, page) — 다음 페이지 조회 append
      setVisibleCount((c) => Math.min(c + OVS_TNDR_ITEM_PAGE_SIZE, listLength))
    }

    // 품목대체 첨부문서 [보기] → 첨부문서조회 팝업(UI-BD-05-P76) 호출 스텁(설계서 slide373).
    const handleOpenAtchDoc = (kind: '품목대체', item: MockOvsItitbBidCnItem) => {
      console.log(`[M72] ${kind}첨부문서 조회(P76)`, item.frcptlArtclNo, item.invtNo)
      // 추후 API: bdService.selectOvsAtchDoc(...) — 첨부문서조회 팝업(UI-BD-05-P76) 호출
    }

    // 입찰내역(총액제, dl_alonbsBidCnInfo) 행 — 설계서 slide478 순서(입찰업체/화폐단위/입찰금액(E)/달러금액/달러환산율).
    //   입찰금액 입력 행은 표 안 배치, 변경 시 달러금액 자동 계산(ibx_amountPrice_onchange).
    const alonbsBidCnRows: TableRow[] = [
      { label: '입찰업체', value: MOCK_ALONBS_BID_CN.splyBzentyNm },
      { label: '화폐단위', value: MOCK_ALONBS_BID_CN.crncNm },
      {
        label: '입찰금액',
        type: 'combination',
        value: (
          <div id={AMT_FIELD_ID} className="flex w-full flex-col gap-krds-3">
            <InputBox
              inputMode="decimal"
              format={formatDecimal2}
              placeholder="입력해주세요."
              error={!!amtError}
              aria-invalid={!!amtError}
              {...register('bdngTccrAmt')}
            />
            {amtError && <InputMessage type="error">{amtError}</InputMessage>}
          </div>
        ),
      },
      { label: '달러금액', value: alonbsUsdAmt, type: 'number' },
      { label: '달러환산율', value: `${MOCK_ALONBS_BID_CN.usdExrt} USD`, type: 'number' },
    ]

    return (
      // 폼 내 제출 버튼은 두지 않는다 — 페이지 액션바 [다음으로]가 ref.submit() 으로 제출.
      <form onSubmit={handleSubmit(onSubmit, handleInvalid)}>
        {/* 탭명 반복 타이틀 없음(전 탭 공통 규칙) */}

        {/* 입찰내역(총액제) — 품목 목록보다 위, 아코디언(설계서 slide478) */}
        {!isUntprc && (
          <Accordion type="multiple" defaultValue={['bidCn']} className="w-full">
            <AccordionSection value="bidCn" title="입찰내역" borderTop={false}>
              <Table rows={alonbsBidCnRows} />
            </AccordionSection>
          </Accordion>
        )}

        {/* 품목 목록(단가제) / 입찰 품목(총액제) — 총건수 */}
        <SectionTitle as="h3" topDivider info={`총 ${OVS_TNDR_ITEM_TOTAL}건`} className="bg-white">
          {isUntprc ? '품목 목록' : '입찰 품목'}
        </SectionTitle>

        <div className="flex flex-col gap-krds-7 px-4 py-4">
          {isUntprc
            ? visibleItitbItems.map((item, i) => (
                <ItitbItemCard
                  key={item.frcptlArtclNo}
                  index={i}
                  item={item}
                  register={register}
                  control={control}
                  error={errors.items?.[i]?.bdngTccrUntprc?.message}
                  expanded={expanded.has(i)}
                  onToggle={() => toggle(i)}
                  onOpenAtchDoc={handleOpenAtchDoc}
                />
              ))
            : visibleAlonbsItems.map((item) => (
                <Table
                  key={item.frcptlArtclNo}
                  rows={[
                    { label: '항목번호', value: item.frcptlArtclNo },
                    { label: '재고번호', value: item.invtNo },
                    { label: '부품번호', value: item.prtsNo },
                    { label: '품명', value: item.itemNm },
                    { label: '단위', value: item.unitNm },
                    { label: '수량', value: item.qty, type: 'number' },
                  ]}
                />
              ))}

          {/* 더보기 — 클릭 시 다음 페이지 로드(추후 API). 추가 항목 없으면 숨김. */}
          {hasMore && (
            <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
              더보기 ({visibleLength}/{OVS_TNDR_ITEM_TOTAL})
            </Button>
          )}
        </div>
      </form>
    )
  },
)
OvsTndrSbmsnPage_Stp2.displayName = 'OvsTndrSbmsnPage_Stp2'
