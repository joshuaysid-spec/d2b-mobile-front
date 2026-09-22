// 입찰내역 작성 - 입찰내역(단가제) (MUI-BD-01-T75(구 M77 — v1.83 재편), 설계서 07국외입찰공고상세 slide314·317·319)
// 호스트 페이지(OvsTmprBidCnRegPage)의 '품목 목록' 탭 본문(단가제) — 요약/탭/FAB 는 페이지 소유.
// 구성: 입찰내역 일괄적용(dl_fwkInfo: 입찰업체/화폐단위 + 전체·선택 적용 — 구 PageTitle '입찰내역(단가제)' 삭제, 2026-08-25) →
//   입찰 품목(총 N건) 카드 반복(항목선택 체크 + 요약 Table + 내역 펼쳐보기/접기 폼) → 더보기 →
//   하단 액션바(입찰내역 삭제/저장).
// 폼: react-hook-form + zod(ititbBidCnSchema) — 품목 배열 폼(2026-09-16, 구 useState 수작업 검증 + AlertModal 안내 폐기).
//   [입찰내역 저장]이 handleSubmit 을 트리거 → 실패 시 항목별 에러를 입력 아래 InputMessage 로 표시하고
//   첫 에러 품목을 더보기 범위·펼침 상태로 만든 뒤 focusField(카드 안 앵커)로 포커스+스크롤
//   (셀렉트/라디오/파일 행은 RHF ref 가 없어 앵커 id 기준, shouldFocusError 는 끄고 한 경로로 통일).
//   품목 기본정보(R 항목)는 폼 밖(조회 결과 items)에 두고, 편집 항목만 폼 값(rows[i])으로 가진다.
// 이벤트(설계서 slide319):
//   - 품목대체구분 = Replace → 품목대체첨부문서·수정재고번호·수정부품번호 활성/필수
//   (MOQ구분/수량/첨부문서는 국외 전 화면에서 삭제 — 2026-09-14 사용자 지시)
//   - 입찰단가 변경 → 입찰금액/달러단가/달러금액 계산 · 화폐단위 변경 → 달러환산율/달러단가/달러금액 계산
//     (폼 값이 아니라 입력값에서 매 렌더 파생 계산 — calcItitbBidCn)
//   - 업로드 클릭 → 첨부문서업로드 팝업(UI-BD-04-P75) 호출 — 목업은 console.log + 파일명 스텁
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '@/stores/authStore'
import { Controller, useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { bdQueries } from '@/queries/bds/bd/bdQueries'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Card } from '@/ui/common/composites/Card'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import {
  ititbBidCnSchema,
  type ItitbBidCnRow,
  type ItitbBidCnValues,
} from '@/ui/biz/bd/ovsTmprBidCnReg/OvsTmprBidCnReg.schema'
import {
  CRNC_ITEMS,
  EMPTY_ITITB_ROW,
  ITEM_SBST_ITEMS,
  SPLY_BZENTY_ITEMS,
  calcItitbBidCn,
  fmtComma,
  toItitbFormRow,
  toNum,
} from '@/ui/biz/bd/ovsTmprBidCnReg/ovsTmprBidCnRegMock'
import { focusField } from '@/utils/focusField'
import type { MockBscPbancInfo, MockItitbBidCnItem } from '@/types/mock/bd'

// 서버 총건수 — 더보기 분모(설계서 '더보기 (10/100)'). 추후 API 응답 total 로 대체.
const PAGE_SIZE = 5

// 카드 안 입력 순서 — 실패 시 이 순서로 첫 에러를 찾는다(카드 표시 순서와 동일).
const ROW_FIELD_ORDER: (keyof ItitbBidCnRow)[] = [
  'itemSbstDocEn',
  'mdfcnInvtNo',
  'mdfcnPrtsNo',
  'splyBzentyNm',
  'crncNm',
  'bdngTccrUntprc',
]
const rowFieldId = (i: number, key: keyof ItitbBidCnRow) => `field-rows-${i}-${key}`
type RowErr = Partial<Record<keyof ItitbBidCnRow, { message?: string }>> | undefined

// 폼 필드 블록 — InputLabel + 컨트롤 + 에러 메시지 세로 스택 (파일 내부 전용 헬퍼).
// id 는 첫 에러 포커스 앵커(focusField) — 셀렉트/라디오/파일처럼 RHF ref 가 없는 필드용.
function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id?: string
  label: React.ReactNode
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="flex flex-col gap-krds-3">
      <InputLabel required={required}>{label}</InputLabel>
      {children}
      {error && <InputMessage type="error">{error}</InputMessage>}
    </div>
  )
}

interface NoticeModal {
  open: boolean
  title: string
  variant: 'info' | 'check'
}

export function BidDsctn({ detail }: { detail: MockBscPbancInfo }) {
  // 기존 저장분 조회(no.60) — 재진입 시 임시저장된 입찰내역을 그대로 복원(사용자 확정 2026-09-02).
  const { data: savedRows } = bdQueries.useSelectTmprBidCnList(detail.intgRfrncNo, '단가제')
  // 품목 기본정보(R 항목) — 폼 밖. 편집 항목은 아래 useForm 의 rows[i] 가 소유.
  const [items, setItems] = React.useState<MockItitbBidCnItem[]>([])

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<ItitbBidCnValues>({
    resolver: zodResolver(ititbBidCnSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    shouldFocusError: false, // 첫 에러 포커스는 아래 handleInvalid(focusField) 한 경로로.
    defaultValues: { rows: [] },
  })
  const formRows = watch('rows')

  // 항목선택 체크 상태 — key 는 항목번호(frcptlArtclNo)
  const [checkedNos, setCheckedNos] = React.useState<string[]>([])
  // 내역 펼쳐보기/접기 상태
  const [expandedNos, setExpandedNos] = React.useState<string[]>([])
  // 조회 응답 도착 시 품목 목록 + 폼 값을 재주입(첫 항목 펼침). 이후 편집은 폼이 소유.
  React.useEffect(() => {
    if (!Array.isArray(savedRows)) return
    setItems(savedRows)
    reset({ rows: savedRows.map(toItitbFormRow) })
    setExpandedNos(savedRows[0] ? [savedRows[0].frcptlArtclNo] : [])
  }, [savedRows, reset])

  // 더보기 페이징
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  // 입찰내역 일괄적용(dl_fwkInfo) — 입찰업체/화폐단위
  const [fwkSplyBzentyNm, setFwkSplyBzentyNm] = React.useState('')
  const [fwkCrncNm, setFwkCrncNm] = React.useState('')

  const [notice, setNotice] = React.useState<NoticeModal>({
    open: false,
    variant: 'info',
    title: '',
  })
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  // 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — 어느 품목의 품목대체첨부를 여는지. null=닫힘.
  const [uploadFor, setUploadFor] = React.useState<number | null>(null)
  const fileAddRef = React.useRef<FileAddHandle>(null)

  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

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

  // 컨트롤 밖에서 폼 값을 넣는 경로(일괄적용·파일첨부·삭제) — 제출 이후엔 즉시 재검증해 해소된 에러를 지운다.
  const patchRow = (i: number, key: 'splyBzentyNm' | 'crncNm' | 'itemSbstDocEn', value: string) =>
    setValue(`rows.${i}.${key}`, value, { shouldDirty: true, shouldValidate: isSubmitted })

  // ── 일괄적용 — 선택된 입찰업체/화폐단위를 전체 또는 선택 항목 행에 반영 (slide319) ──
  const applyFwk = (target: 'all' | 'selected') => {
    if (!fwkSplyBzentyNm && !fwkCrncNm) {
      setNotice({
        open: true,
        variant: 'info',
        title: '적용할 입찰업체 또는 화폐단위를 선택해주세요.',
      })
      return
    }
    if (target === 'selected' && checkedNos.length === 0) {
      setNotice({ open: true, variant: 'info', title: '적용할 품목을 선택해주세요.' })
      return
    }
    console.log('[T75] 입찰내역 일괄적용', target, fwkSplyBzentyNm, fwkCrncNm, checkedNos)
    items.forEach((item, i) => {
      if (target !== 'all' && !checkedNos.includes(item.frcptlArtclNo)) return
      if (fwkSplyBzentyNm) patchRow(i, 'splyBzentyNm', fwkSplyBzentyNm)
      if (fwkCrncNm) patchRow(i, 'crncNm', fwkCrncNm)
    })
  }

  // ── 입찰내역 저장 — 필수값(입찰업체·화폐단위·입찰단가) + 조건부 필수(Replace) 는 zod 스키마가 검증 ──
  //   2026-09-01 사용자 확정: 필수값이 모두 입력되어야 저장 가능.
  const navigate = useNavigate()

  const handleSave = (values: ItitbBidCnValues) => {
    // 저장 payload — 품목 기본정보 + 편집값 + 파생 계산값(입찰금액/달러환산율/달러단가/달러금액).
    const payload: MockItitbBidCnItem[] = items.map((item, i) => ({
      ...item,
      ...values.rows[i],
      bdngTccrUntprc: String(toNum(values.rows[i].bdngTccrUntprc)),
      ...calcItitbBidCn(values.rows[i], item.qty),
    }))
    console.log('[T75] 입찰내역 저장(암호화)', detail.intgRfrncNo, payload)
    // 추후 API: bdService.saveTmprBidCn(intgRfrncNo, payload) — 임시입찰내용저장
    // 설계서 slide423: 토스트 '저장되었습니다' → 닫히면 국외 보관함 목록(MUI-CM-01-M71)으로 이동.
    showToast('저장되었습니다.', { duration: 1500, onClose: () => navigate('/bd/ovs/locker') })
  }

  // 실패 시: 첫 에러 품목이 더보기 범위 밖이면 그 페이지까지 늘리고, 카드를 펼친 뒤(렌더 후) 앵커로 포커스+스크롤.
  const pendingFocus = React.useRef<string | null>(null)
  const handleInvalid = (errs: FieldErrors<ItitbBidCnValues>) => {
    const list = errs.rows
    if (!Array.isArray(list)) return
    for (let i = 0; i < list.length; i++) {
      const rowErr = list[i] as RowErr
      if (!rowErr) continue
      const key = ROW_FIELD_ORDER.find((k) => rowErr[k])
      if (!key) continue
      if (i >= visibleCount) setVisibleCount(Math.ceil((i + 1) / PAGE_SIZE) * PAGE_SIZE)
      const no = items[i]?.frcptlArtclNo
      if (no) setExpandedNos((prev) => (prev.includes(no) ? prev : [...prev, no]))
      pendingFocus.current = rowFieldId(i, key)
      return
    }
  }
  React.useEffect(() => {
    if (!pendingFocus.current) return
    const id = pendingFocus.current
    pendingFocus.current = null
    requestAnimationFrame(() => focusField(id))
  })

  // ── 입찰내역 삭제 — 선택한 품목의 입찰내역(작성값)만 초기화 (slide319 임시입찰내용삭제) ──
  const handleDeleteClick = () => {
    if (checkedNos.length === 0) {
      setNotice({ open: true, variant: 'info', title: '삭제할 품목을 선택해주세요.' })
      return
    }
    setDeleteOpen(true)
  }
  const handleDeleteConfirm = () => {
    console.log('[T75] 입찰내역 삭제', detail.intgRfrncNo, checkedNos)
    // 추후 API: bdService.deleteTmprBidCn(intgRfrncNo, checkedNos) — 임시입찰내용삭제
    items.forEach((item, i) => {
      if (!checkedNos.includes(item.frcptlArtclNo)) return
      setValue(
        `rows.${i}`,
        { ...EMPTY_ITITB_ROW, frcptlArtclNo: item.frcptlArtclNo },
        { shouldDirty: true, shouldValidate: isSubmitted },
      )
    })
    setCheckedNos([])
  }

  const handleLoadMore = () => {
    console.log('[T75] 입찰 품목 더보기', detail.intgRfrncNo, visibleCount)
    // 추후 API: bdService.selectTmprBidCnList(intgRfrncNo) — no.60 임시입찰내용조회(다음 페이지 append)
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, items.length))
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
      <SectionTitle as="h3" topDivider info={`총 ${items.length}건`}>
        입찰 품목
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {visibleItems.map((item, i) => {
          const value = formRows?.[i]
          if (!value) return null
          const isReplace = value.itemSbstSe === 'R'
          const isExpanded = expandedNos.includes(item.frcptlArtclNo)
          const rowErr = errors.rows?.[i] as RowErr
          const err = (key: keyof ItitbBidCnRow) => rowErr?.[key]?.message
          // 파생값(ReadOnly) — 입찰단가/화폐단위/수량에서 매 렌더 계산(slide319 이벤트).
          const calc = calcItitbBidCn(value, item.qty)

          // 접힘 요약 — 항목번호/재고번호/부품번호/품명 (설계서 slide314 접힘 카드)
          const summaryRows: TableRow[] = [
            { label: '항목번호', value: item.frcptlArtclNo },
            { label: '재고번호', value: item.invtNo },
            { label: '부품번호', value: item.prtsNo },
            // 품명은 카드 타이틀로 승격(Figma 10020:85034) — 행에서 제외.
          ]
          // 펼침 시 품목 기본정보(ReadOnly)
          const itemInfoRows: TableRow[] = [
            { label: '단위', value: item.unitNm },
            { label: '수량', value: item.qty, type: 'number' },
            { label: '지시단가', value: item.drctnUntprc, type: 'number' },
          ]

          return (
            <Card
              key={item.frcptlArtclNo}
              title={item.itemNm}
              titleTrailing={
                <Checkbox
                  variant="box"
                  aria-label={`${item.itemNm} 선택`}
                  checked={checkedNos.includes(item.frcptlArtclNo)}
                  onCheckedChange={(c) => toggleChecked(item.frcptlArtclNo, c === true)}
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
                        <Field id={rowFieldId(i, 'itemSbstSe')} label="품목대체구분" required>
                          <Controller
                            control={control}
                            name={`rows.${i}.itemSbstSe`}
                            render={({ field }) => (
                              <RadioButtonGroup
                                items={ITEM_SBST_ITEMS}
                                value={field.value}
                                onValueChange={field.onChange}
                              />
                            )}
                          />
                        </Field>
                        <Field
                          id={rowFieldId(i, 'itemSbstDocEn')}
                          label="품목대체첨부문서"
                          required={isReplace}
                          error={err('itemSbstDocEn')}
                        >
                          {value.itemSbstDocEn ? (
                            <FileDownloadList
                              files={[
                                {
                                  id: `${item.frcptlArtclNo}-sbst`,
                                  name: value.itemSbstDocEn,
                                  onRemove: () => patchRow(i, 'itemSbstDocEn', ''),
                                },
                              ]}
                            />
                          ) : (
                            <Button
                              variant="secondary"
                              disabled={!isReplace}
                              onClick={() => setUploadFor(i)}
                            >
                              <Icon name="Add" size={20} aria-hidden />
                              업로드
                            </Button>
                          )}
                        </Field>
                        <Field
                          id={rowFieldId(i, 'mdfcnInvtNo')}
                          label="수정재고번호"
                          required={isReplace}
                          error={err('mdfcnInvtNo')}
                        >
                          <InputBox
                            placeholder="입력해주세요."
                            disabled={!isReplace}
                            error={!!err('mdfcnInvtNo')}
                            aria-invalid={!!err('mdfcnInvtNo')}
                            {...register(`rows.${i}.mdfcnInvtNo`)}
                          />
                        </Field>
                        <Field
                          id={rowFieldId(i, 'mdfcnPrtsNo')}
                          label="수정부품번호"
                          required={isReplace}
                          error={err('mdfcnPrtsNo')}
                        >
                          <InputBox
                            placeholder="입력해주세요."
                            disabled={!isReplace}
                            error={!!err('mdfcnPrtsNo')}
                            aria-invalid={!!err('mdfcnPrtsNo')}
                            {...register(`rows.${i}.mdfcnPrtsNo`)}
                          />
                        </Field>

                        {/* ── 납기 ── */}
                        <Field label="납기(본조)">
                          <InputBox
                            placeholder="YYYY-MM-DD"
                            {...register(`rows.${i}.bscbgtDudtYmd`)}
                          />
                        </Field>
                        <Field label="납기(당국)">
                          <InputBox
                            placeholder="YYYY-MM-DD"
                            {...register(`rows.${i}.athrtDudtYmd`)}
                          />
                        </Field>
                        <Field label="납기(장국)">
                          <InputBox
                            placeholder="YYYY-MM-DD"
                            {...register(`rows.${i}.ltbndDudtYmd`)}
                          />
                        </Field>

                        {/* ── 입찰내역 — 입찰단가/화폐단위 변경 시 파생값 자동 계산(slide319) ── */}
                        <Field
                          id={rowFieldId(i, 'splyBzentyNm')}
                          label="입찰업체"
                          required
                          error={err('splyBzentyNm')}
                        >
                          <Controller
                            control={control}
                            name={`rows.${i}.splyBzentyNm`}
                            render={({ field }) => (
                              <SelectBox
                                items={SPLY_BZENTY_ITEMS}
                                placeholder="미선택"
                                value={field.value || undefined}
                                onValueChange={field.onChange}
                                error={!!err('splyBzentyNm')}
                              />
                            )}
                          />
                        </Field>
                        <Field
                          id={rowFieldId(i, 'crncNm')}
                          label="화폐단위"
                          required
                          error={err('crncNm')}
                        >
                          <Controller
                            control={control}
                            name={`rows.${i}.crncNm`}
                            render={({ field }) => (
                              <SelectBox
                                items={CRNC_ITEMS}
                                placeholder="미선택"
                                value={field.value || undefined}
                                onValueChange={field.onChange}
                                error={!!err('crncNm')}
                              />
                            )}
                          />
                        </Field>
                        <Field
                          id={rowFieldId(i, 'bdngTccrUntprc')}
                          label="입찰단가"
                          required
                          error={err('bdngTccrUntprc')}
                        >
                          <InputBox
                            inputType="numeric"
                            format={fmtComma}
                            placeholder="입력해주세요."
                            error={!!err('bdngTccrUntprc')}
                            aria-invalid={!!err('bdngTccrUntprc')}
                            {...register(`rows.${i}.bdngTccrUntprc`)}
                          />
                        </Field>

                        {/* 계산 결과(ReadOnly) — disabled InputBox 재사용 컨벤션 */}
                        <Field label="입찰금액">
                          <InputBox disabled value={calc.bdngTccrAmt} />
                        </Field>
                        <Field label="달러환산율">
                          <InputBox disabled value={calc.usdExrt} />
                        </Field>
                        <Field label="달러단가">
                          <InputBox disabled value={calc.bdngUsdUntprc} />
                        </Field>
                        <Field label="달러금액">
                          <InputBox disabled value={calc.bdngUsdAmt} />
                        </Field>
                      </div>
                    </>
                  )}

                  {/* 내역 펼쳐보기 ↓ / 내역 접기 ↑ */}
                  <Button
                    variant="inner"
                    className="w-full"
                    onClick={() => toggleExpanded(item.frcptlArtclNo)}
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
            더보기 ({visibleItems.length}/{items.length})
          </Button>
        )}
      </div>

      {/* 하단 액션바 — 입찰내역 삭제(선택 품목) / 입찰내역 저장 */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '입찰내역 삭제', variant: 'secondary', onClick: handleDeleteClick },
            {
              label: '입찰내역 저장',
              variant: 'primary',
              onClick: () => void handleSubmit(handleSave, handleInvalid)(),
            },
          ]}
        />
      </div>

      {/* 안내 모달 — 필수 미입력은 항목별 InputMessage 로 표시(모달 안내 폐기, 2026-09-16) */}

      <AlertModal
        open={notice.open}
        onOpenChange={(o) => setNotice((m) => ({ ...m, open: o }))}
        variant={notice.variant}
        title={notice.title}
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

      {/* 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — [공통] 파일 추가(v0.87 마지막 장).
          서류명 고정(fixedDocNm)·서류당 1파일(multiple=false). 완료 시 해당 품목 행에 파일명 세팅. */}
      <BottomSheet
        open={uploadFor !== null}
        onOpenChange={(open) => {
          if (!open) setUploadFor(null)
        }}
        title="파일 추가"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setUploadFor(null) },
              {
                label: '완료',
                variant: 'primary',
                onClick: () => {
                  if (fileAddRef.current?.complete()) setUploadFor(null)
                },
              },
            ]}
          />
        }
      >
        {uploadFor !== null && (
          <FileAdd
            ref={fileAddRef}
            fixedDocNm="품목대체첨부문서"
            onComplete={({ files }) => {
              // 추후 API: bdService.uploadOvsBidCnDoc(...)
              patchRow(uploadFor, 'itemSbstDocEn', files[0]?.name ?? '')
            }}
          />
        )}
      </BottomSheet>
    </>
  )
}
BidDsctn.displayName = 'BidDsctn'
