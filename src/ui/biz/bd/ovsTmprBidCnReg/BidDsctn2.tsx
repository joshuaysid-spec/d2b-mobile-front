// 입찰내역 작성 - 입찰내역(총액제) (MUI-BD-01-T76(구 M78 — v1.83 재편), 설계서 07국외입찰공고상세 slide315·318·319)
// 호스트 페이지(OvsTmprBidCnRegPage)의 '품목 목록' 탭 본문(총액제) — 요약/탭/FAB 는 페이지 소유.
// 구성: PageTitle → 입찰 품목(총 N건, ReadOnly Table 반복 · dl_alonbsItemList) → 더보기 →
//   입찰내역(dl_alonbsBidCnInfo: 입찰업체/화폐단위/입찰금액 입력 + 달러금액/달러환산율 계산) →
//   하단 액션바(입찰내역 삭제/저장).
// 폼: react-hook-form + zod(alonbsBidCnSchema) — 단건 폼(2026-09-16, 구 useState 수작업 검증 + AlertModal 안내 폐기).
//   [입찰내역 저장]이 handleSubmit 을 트리거 → 실패 시 항목별 에러를 입력 아래 InputMessage 로 표시하고
//   첫 에러 필드로 focusField 포커스+스크롤(셀렉트는 RHF ref 가 없어 앵커 id 기준, shouldFocusError 는 끄고 한 경로로 통일).
// 이벤트(설계서 slide319): 입찰금액 변경 → 달러금액 계산 · 화폐단위 변경 → 달러금액/달러환산율 계산
//   (폼 값이 아니라 입력값에서 매 렌더 파생 계산 — calcAlonbsBidCn).
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { bdQueries } from '@/queries/bds/bd/bdQueries'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import {
  alonbsBidCnSchema,
  type AlonbsBidCnValues,
} from '@/ui/biz/bd/ovsTmprBidCnReg/OvsTmprBidCnReg.schema'
import {
  CRNC_ITEMS,
  EMPTY_ALONBS_BID_CN,
  MOCK_ALONBS_ITEM_LIST,
  SPLY_BZENTY_ITEMS,
  calcAlonbsBidCn,
  fmtComma,
  toNum,
} from '@/ui/biz/bd/ovsTmprBidCnReg/ovsTmprBidCnRegMock'
import { focusField } from '@/utils/focusField'
import type { MockAlonbsItem, MockBscPbancInfo } from '@/types/mock/bd'

const PAGE_SIZE = 5

// 화면 표시 순서 — 실패 시 이 순서로 첫 에러를 찾는다.
const FIELD_ORDER: (keyof AlonbsBidCnValues)[] = ['splyBzentyNm', 'crncNm', 'bdngTccrAmt']
const fieldId = (key: keyof AlonbsBidCnValues) => `field-${key}`

// 폼 필드 블록 — InputLabel + 컨트롤 + 에러 메시지 세로 스택 (파일 내부 전용 헬퍼).
// id 는 첫 에러 포커스 앵커(focusField) — 셀렉트처럼 RHF ref 가 없는 필드용.
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

export function BidDsctn2({ detail }: { detail: MockBscPbancInfo }) {
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  // 기존 저장분 조회(no.60) — 재진입 시 임시저장된 입찰내역 복원(사용자 확정 2026-09-02).
  const { data: saved } = bdQueries.useSelectTmprBidCnList(detail.intgRfrncNo, '총액제')

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AlonbsBidCnValues>({
    resolver: zodResolver(alonbsBidCnSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    shouldFocusError: false, // 첫 에러 포커스는 아래 handleInvalid(focusField) 한 경로로.
    defaultValues: EMPTY_ALONBS_BID_CN,
  })
  // 조회 응답 도착 시 폼 값 재주입. 입찰금액은 입력 표시 포맷(콤마)으로.
  React.useEffect(() => {
    if (!saved || Array.isArray(saved)) return
    reset({
      splyBzentyNm: saved.splyBzentyNm,
      crncNm: saved.crncNm,
      bdngTccrAmt: fmtComma(saved.bdngTccrAmt),
    })
  }, [saved, reset])

  const navigate = useNavigate()
  // 저장 완료 안내 — 확인 시 국외 보관함 목록으로(설계서 slide424 '저장 후 목록 이동').
  const [savedOpen, setSavedOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  // 파생값(ReadOnly) — 입찰금액/화폐단위에서 매 렌더 계산(slide319 이벤트).
  const calc = calcAlonbsBidCn(watch('crncNm'), watch('bdngTccrAmt'))
  const err = (key: keyof AlonbsBidCnValues) => errors[key]?.message

  const visibleItems = MOCK_ALONBS_ITEM_LIST.slice(0, visibleCount)
  const hasMore = visibleCount < MOCK_ALONBS_ITEM_LIST.length

  const itemRows = (item: MockAlonbsItem): TableRow[] => [
    { label: '항목번호', value: item.frcptlArtclNo },
    { label: '재고번호', value: item.invtNo },
    { label: '부품번호', value: item.prtsNo },
    { label: '품명', value: item.itemNm },
    { label: '단위', value: item.unitNm },
    { label: '수량', value: item.qty, type: 'number' },
  ]

  const handleLoadMore = () => {
    console.log('[T76] 입찰 품목 더보기', detail.intgRfrncNo, visibleCount)
    // 추후 API: bdService.selectTmprBidCnList(intgRfrncNo) — no.60 임시입찰내용조회(다음 페이지 append)
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, MOCK_ALONBS_ITEM_LIST.length))
  }

  // ── 입찰내역 저장 — 필수(입찰업체/화폐단위/입찰금액, 설계서 slide318 필수 Y) 는 zod 스키마가 검증 ──
  const handleSave = (values: AlonbsBidCnValues) => {
    // 저장 payload — 편집값 + 파생 계산값(달러환산율/달러금액).
    const payload = {
      ...values,
      bdngTccrAmt: String(toNum(values.bdngTccrAmt)),
      ...calcAlonbsBidCn(values.crncNm, values.bdngTccrAmt),
    }
    console.log('[T76] 입찰내역 저장(암호화)', detail.intgRfrncNo, payload)
    // 추후 API: bdService.saveTmprBidCn(intgRfrncNo, payload) — 임시입찰내용저장
    setSavedOpen(true)
  }

  // 실패 시 화면 순서대로 첫 에러 필드 포커스+스크롤.
  const handleInvalid = (errs: FieldErrors<AlonbsBidCnValues>) => {
    const key = FIELD_ORDER.find((k) => errs[k])
    if (key) focusField(fieldId(key))
  }

  // ── 입찰내역 삭제 — 작성한 입찰내역 초기화 (slide319 임시입찰내용삭제) ──
  const handleDeleteConfirm = () => {
    console.log('[T76] 입찰내역 삭제', detail.intgRfrncNo)
    // 추후 API: bdService.deleteTmprBidCn(intgRfrncNo) — 임시입찰내용삭제
    reset(EMPTY_ALONBS_BID_CN)
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
        <Field id={fieldId('splyBzentyNm')} label="입찰업체" required error={err('splyBzentyNm')}>
          <Controller
            control={control}
            name="splyBzentyNm"
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
        <Field id={fieldId('crncNm')} label="화폐단위" required error={err('crncNm')}>
          <Controller
            control={control}
            name="crncNm"
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
        <Field id={fieldId('bdngTccrAmt')} label="입찰금액" required error={err('bdngTccrAmt')}>
          <InputBox
            inputType="numeric"
            format={fmtComma}
            placeholder="입력해주세요."
            error={!!err('bdngTccrAmt')}
            aria-invalid={!!err('bdngTccrAmt')}
            {...register('bdngTccrAmt')}
          />
        </Field>

        {/* 계산 결과(ReadOnly) — disabled InputBox 재사용 컨벤션 */}
        <Field label="달러금액">
          <InputBox disabled value={calc.bdngUsdAmt} />
        </Field>
        <Field label="달러환산율">
          <InputBox disabled value={calc.usdExrt} />
        </Field>
      </div>

      {/* 하단 액션바 — 입찰내역 삭제 / 입찰내역 저장 */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '입찰내역 삭제', variant: 'secondary', onClick: () => setDeleteOpen(true) },
            {
              label: '입찰내역 저장',
              variant: 'primary',
              onClick: () => void handleSubmit(handleSave, handleInvalid)(),
            },
          ]}
        />
      </div>

      {/* 저장완료 모달 — 필수 미입력은 항목별 InputMessage 로 표시(모달 안내 폐기, 2026-09-16) */}
      <AlertModal
        open={savedOpen}
        onOpenChange={setSavedOpen}
        variant="check"
        title="입찰내역이 저장되었습니다."
        primaryAction={{ label: '확인', onClick: () => navigate('/bd/ovs/locker') }}
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
