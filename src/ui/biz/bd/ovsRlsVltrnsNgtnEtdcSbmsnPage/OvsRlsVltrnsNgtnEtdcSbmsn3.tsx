// 공개수의협상 견적서 작성 - 스탭3 입찰품목(입찰참여품목 단가제) (MUI-BD-12-T76(구 M76 — v1.83 재편), 설계서 slide422).
// 품목 카드(기본 4행 + 내역 펼쳐보기) — 조회 항목 + 입력(품목대체구분 Y/N SelectBox·견적단가, 대체 시 수정재고/부품번호·대체첨부문서).
// 항목명 = 설계서 데이터영역 영문(dl_bidItemList).
// 폼: react-hook-form + zod(etdcItemsSchema) — 탭마다 RHF, 페이지는 확정값만 보관(forms.md 스텝 마법사 규칙, 2026-09-16 적용).
//   [다음으로]는 페이지가 ref.submit() 으로 트리거 → 통과 시 onSubmit(값) → 페이지가 저장 후 다음 탭.
//   실패 시 이동 없이 첫 에러 품목을 표시 범위(더보기)·펼침 상태로 만든 뒤 focusField(카드 안 앵커) — 셀렉트/파일 행은
//   RHF ref 가 없어 앵커 id 기준, shouldFocusError 는 끄고 한 경로로 통일. 에러는 각 입력 아래 InputMessage.
import * as React from 'react'
import {
  Controller,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import {
  etdcItemsSchema,
  type EtdcItemRow,
  type EtdcItemsValues,
} from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn.schema'
import {
  ALT_OPTIONS,
  CRNCY_OPTIONS,
  MOCK_ETDC_ITEMS,
} from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/ovsRlsVltrnsNgtnEtdcSbmsnMock'
import { cn } from '@/utils/cn'
import { focusField } from '@/utils/focusField'
import type { MockOvsRlsVltrnsEtdcItem } from '@/types/mock/bd'

// 접힘 시 노출 행수 — 항목번호/재고번호/부품번호/품명 4행(slide422).
const DEFAULT_VISIBLE = 4
// 카드 안 입력 순서 — 실패 시 이 순서로 첫 에러를 찾는다(카드 표시 순서와 동일).
const ROW_FIELD_ORDER: (keyof EtdcItemRow)[] = [
  'itemSbstSe',
  'itemSbstDocNm',
  'mdfcnInvtNo',
  'mdfcnPrtsNo',
  'estmtUntprc',
  'crncNm',
]
const rowFieldId = (i: number, key: keyof EtdcItemRow) => `field-items-${i}-${key}`
type RowErr = Partial<Record<keyof EtdcItemRow, { message?: string }>> | undefined

export interface EtdcStp3Handle {
  /** 페이지 [다음으로]가 호출 — 검증 통과 시 onSubmit 실행. */
  submit: () => void
}
export interface EtdcStp3Props {
  /** 초기값 — 페이지가 보관한 확정값(되돌아올 때) 또는 ETDC_ITEMS_DEFAULT. */
  defaultValues: EtdcItemsValues
  /** 검증 통과 시 확정값 전달 — 페이지가 저장 후 다음 탭으로. */
  onSubmit: (values: EtdcItemsValues) => void
}

interface ItemCardProps {
  index: number
  item: MockOvsRlsVltrnsEtdcItem
  register: UseFormRegister<EtdcItemsValues>
  control: Control<EtdcItemsValues>
  setDocNm: (index: number, name: string) => void
  /** 이 행의 필드별 에러(RHF errors.items[i]) — 메시지만 읽으므로 단순 형태로 받는다. */
  rowErr: RowErr
  expanded: boolean
  onToggle: () => void
}

const ItemCard = React.memo(function ItemCard({
  index,
  item,
  register,
  control,
  setDocNm,
  rowErr,
  expanded,
  onToggle,
}: ItemCardProps) {
  // 이 카드의 폼 값만 구독 — 대체구분(Y/N)·첨부 파일명 표시용.
  const itemSbstSe = useWatch({ control, name: `items.${index}.itemSbstSe` })
  const itemSbstDocNm = useWatch({ control, name: `items.${index}.itemSbstDocNm` })

  // 파일선택 FileAdd 공통 시트 — 첨부 상태가 카드 로컬이라 시트도 카드가 소유(ScrtyMsrmtPrsnlReg 중첩 소유 선례).
  const [fileAddOpen, setFileAddOpen] = React.useState(false)
  const fileAddRef = React.useRef<FileAddHandle>(null)

  const err = (key: keyof EtdcItemRow) => rowErr?.[key]?.message
  const inputId = (key: keyof EtdcItemRow) => `etdcItem-${index}-${key}`

  const rows: TableRow[] = [
    { label: '항목번호', value: item.frcptlArtclNo },
    { label: '재고번호', value: item.invtNo },
    { label: '부품번호', value: item.prtsNo },
    { label: '품명', value: item.itemNm },
    { label: '단위', value: item.unitNm },
    { label: '수량', value: item.qty, type: 'number' },
    { label: '지시단가', value: item.drctnUntprc, type: 'number' },
    // ── 입력 ──
    {
      label: '품목대체구분',
      type: 'combination',
      // SelectBox 셀 전체 폭 — Table combination 셀의 [&_button]:w-fit 를 !w-full 로 덮음.
      value: (
        <div id={rowFieldId(index, 'itemSbstSe')} className="w-full [&_button]:!w-full">
          <Controller
            control={control}
            name={`items.${index}.itemSbstSe`}
            render={({ field }) => (
              <SelectBox
                items={ALT_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
                aria-label="품목대체구분"
              />
            )}
          />
        </div>
      ),
    },
    {
      // 품목대체첨부문서 — 파일 첨부. 파일 있으면 파일명 박스 + X 삭제, 없으면 [파일선택] 버튼만. 대체 Y 면 필수.
      label: '품목대체첨부문서',
      type: 'combination',
      value: (
        <div id={rowFieldId(index, 'itemSbstDocNm')} className="flex w-full flex-col gap-krds-3">
          <FileDownloadList
            files={
              itemSbstDocNm
                ? [
                    {
                      id: `${item.frcptlArtclNo}-sbst`,
                      name: itemSbstDocNm,
                      onRemove: () => setDocNm(index, ''), // 추후 API: bdService.removeEtdcItemSbstDoc
                    },
                  ]
                : []
            }
            onAddFile={() => setFileAddOpen(true)}
            addFileLabel="파일선택"
          />
          {err('itemSbstDocNm') && <InputMessage type="error">{err('itemSbstDocNm')}</InputMessage>}
        </div>
      ),
    },
    {
      // 수정재고번호 — 숫자만(inputType=numeric). 대체 Y 면 필수.
      label: '수정재고번호',
      type: 'combination',
      value: (
        <div id={rowFieldId(index, 'mdfcnInvtNo')} className="flex w-full flex-col gap-krds-3">
          <InputBox
            id={inputId('mdfcnInvtNo')}
            inputType="numeric"
            placeholder="입력해주세요."
            error={!!err('mdfcnInvtNo')}
            aria-invalid={!!err('mdfcnInvtNo')}
            {...register(`items.${index}.mdfcnInvtNo`)}
          />
          {err('mdfcnInvtNo') && <InputMessage type="error">{err('mdfcnInvtNo')}</InputMessage>}
        </div>
      ),
    },
    {
      label: '수정부품번호',
      type: 'combination',
      value: (
        <div id={rowFieldId(index, 'mdfcnPrtsNo')} className="flex w-full flex-col gap-krds-3">
          <InputBox
            id={inputId('mdfcnPrtsNo')}
            inputType="numeric"
            placeholder="입력해주세요."
            error={!!err('mdfcnPrtsNo')}
            aria-invalid={!!err('mdfcnPrtsNo')}
            {...register(`items.${index}.mdfcnPrtsNo`)}
          />
          {err('mdfcnPrtsNo') && <InputMessage type="error">{err('mdfcnPrtsNo')}</InputMessage>}
        </div>
      ),
    },
    {
      // 견적단가 — 필수.
      label: '견적단가',
      type: 'combination',
      value: (
        <div id={rowFieldId(index, 'estmtUntprc')} className="flex w-full flex-col gap-krds-3">
          <InputBox
            id={inputId('estmtUntprc')}
            inputType="numeric"
            placeholder="입력해주세요."
            error={!!err('estmtUntprc')}
            aria-invalid={!!err('estmtUntprc')}
            {...register(`items.${index}.estmtUntprc`)}
          />
          {err('estmtUntprc') && <InputMessage type="error">{err('estmtUntprc')}</InputMessage>}
        </div>
      ),
    },
    // 견적금액 — 견적단가와 연동하지 않고 임의 숫자로 표시(목업).
    { label: '견적금액', value: '608,000.00', type: 'number' },
    {
      // 화폐단위 — SelectBox(맨 하단, 설계서 slide422).
      label: '화폐단위',
      type: 'combination',
      value: (
        <div
          id={rowFieldId(index, 'crncNm')}
          className="flex w-full flex-col gap-krds-3 [&_button]:!w-full"
        >
          <Controller
            control={control}
            name={`items.${index}.crncNm`}
            render={({ field }) => (
              <SelectBox
                items={CRNCY_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
                error={!!err('crncNm')}
                aria-label="화폐단위"
              />
            )}
          />
          {err('crncNm') && <InputMessage type="error">{err('crncNm')}</InputMessage>}
        </div>
      ),
    },
  ]
  // 대체구분 N 이면 수정재고/부품번호·첨부 행은 입력 대상이 아니지만 설계서(slide422) 대로 행은 유지한다.
  void itemSbstSe

  const visibleRows = expanded ? rows : rows.slice(0, DEFAULT_VISIBLE)

  return (
    <div className="px-4">
      <Table rows={visibleRows} />
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

      {/* 파일선택 FileAdd 공통 시트 — 서류명 고정(품목대체첨부문서)·1파일(multiple=false). */}
      <BottomSheet
        open={fileAddOpen}
        onOpenChange={setFileAddOpen}
        title="파일 추가"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setFileAddOpen(false) },
              {
                label: '완료',
                variant: 'primary',
                onClick: () => {
                  if (fileAddRef.current?.complete()) setFileAddOpen(false)
                },
              },
            ]}
          />
        }
      >
        {fileAddOpen && (
          <FileAdd
            ref={fileAddRef}
            fixedDocNm="품목대체첨부문서"
            multiple={false}
            // ⚠️ 폼에는 파일명만 보관 — 업로드 GUID 항목명 확정 시 uploaded.guid 로 교체. 추후: bdService.uploadEtdcItemSbstDoc
            onComplete={({ files }) => setDocNm(index, files[0]?.name ?? '')}
          />
        )}
      </BottomSheet>
    </div>
  )
})

export const OvsRlsVltrnsNgtnEtdcSbmsn3 = React.forwardRef<EtdcStp3Handle, EtdcStp3Props>(
  ({ defaultValues, onSubmit }, ref) => {
    const {
      register,
      control,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<EtdcItemsValues>({
      resolver: zodResolver(etdcItemsSchema),
      mode: 'onSubmit',
      reValidateMode: 'onBlur',
      shouldFocusError: false, // 첫 에러 포커스는 아래 handleInvalid(focusField) 한 경로로.
      defaultValues,
    })

    const total = MOCK_ETDC_ITEMS.length
    const [pageSize, setPageSize] = React.useState(10)
    const [page, setPage] = React.useState(1)
    const [expanded, setExpanded] = React.useState<Set<number>>(() => new Set())
    const loaded = Math.min(page * pageSize, total)
    const visible = MOCK_ETDC_ITEMS.slice(0, loaded)

    const toggle = React.useCallback(
      (i: number) =>
        setExpanded((prev) => {
          const next = new Set(prev)
          if (next.has(i)) next.delete(i)
          else next.add(i)
          return next
        }),
      [],
    )
    const setDocNm = React.useCallback(
      (i: number, name: string) =>
        setValue(`items.${i}.itemSbstDocNm`, name, { shouldValidate: true }),
      [setValue],
    )

    // 실패 시: 첫 에러 품목이 더보기 범위 밖이면 그 페이지까지 펼치고, 카드를 펼친 뒤(렌더 후) 앵커로 포커스+스크롤.
    const pendingFocus = React.useRef<string | null>(null)
    const handleInvalid = React.useCallback(
      (errs: FieldErrors<EtdcItemsValues>) => {
        const list = errs.items
        if (!Array.isArray(list)) return
        for (let i = 0; i < list.length; i++) {
          const rowErr = list[i]
          if (!rowErr) continue
          const key = ROW_FIELD_ORDER.find((k) => rowErr[k])
          if (!key) continue
          if (i >= loaded) setPage(Math.ceil((i + 1) / pageSize))
          setExpanded((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
          pendingFocus.current = rowFieldId(i, key)
          return
        }
      },
      [loaded, pageSize],
    )
    React.useEffect(() => {
      if (!pendingFocus.current) return
      const id = pendingFocus.current
      pendingFocus.current = null
      requestAnimationFrame(() => focusField(id))
    })

    React.useImperativeHandle(ref, () => ({
      submit: () => void handleSubmit(onSubmit, handleInvalid)(),
    }))

    return (
      // 폼 내 제출 버튼은 두지 않는다 — 페이지 액션바 [다음으로]가 ref.submit() 으로 제출.
      <form
        onSubmit={handleSubmit(onSubmit, handleInvalid)}
        className="flex flex-col gap-krds-7 py-4"
      >
        <div className="px-4">
          <ListSectionHeader
            // v0.87 검토108 — '총 N건' → '품목 목록 - 총 N건'
            leftSlot={
              <span className="text-[17px] font-bold leading-normal text-krds-text-primary-active">
                품목 목록 - 총 {total.toLocaleString()}건
              </span>
            }
            pageSize={pageSize}
            pageSizeOptions={[10, 30, 50]}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>
        <div className="flex flex-col gap-krds-8">
          {visible.map((item, i) => (
            <ItemCard
              key={item.frcptlArtclNo}
              index={i}
              item={item}
              register={register}
              control={control}
              setDocNm={setDocNm}
              rowErr={errors.items?.[i] as RowErr}
              expanded={expanded.has(i)}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
        {loaded < total && (
          <div className="px-4">
            <Button variant="secondary" className="w-full" onClick={() => setPage((p) => p + 1)}>
              더보기 ({loaded}/{total})
            </Button>
          </div>
        )}
      </form>
    )
  },
)
OvsRlsVltrnsNgtnEtdcSbmsn3.displayName = 'OvsRlsVltrnsNgtnEtdcSbmsn3'
