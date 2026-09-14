// 스탭3 입찰 보증금 (MUI-BD-04-T74(구 M74 — v1.83 재편) OvsBidPrtcpAplyPage_Stp3 · 설계서 slide446~447 · 데이터 slide450 · 이벤트 slide452).
// 호스트 페이지(OvsBidPrtcpAplyPage)의 '입찰 보증금' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 구성: 입찰보증금 구분 라디오(비면제/면제, sbx_depositType_onchange 로 데이터 영역 전환 — v0.87 검토90 SelectBox→버튼형 라디오)
//   → 입찰참가사업 및 입찰보증금 목록(사업별 Table)
//     · 면제(dl_bizExmptnList): 입찰보증금(확인입력 — R 표시, 설계서 항목표 기준·사용자 확정 2026-09-14) + 연대보증서/지급각서 파일(필수)
//     · 비면제(dl_bizList): 입찰보증금(확인입력, 필수·입찰보증금과 일치) + 보증금납부방법(필수) + 증권번호/보증기관명(필수) + 납부서(선택)
//       - 전자보증서: 증권번호/보증기관명 입력 비활성 + [보증서선택] → 입찰보증서선택 팝업(P75, OvsBidWtgrInqFullPopup)
//       - 보증보험: 직접 입력 + 입찰보증금납부서 파일 선택 업로드
// 폼: react-hook-form + zod(ovsBidGrnteSchema) — 탭마다 RHF, 페이지는 확정값만 보관(2026-09-14 사용자 확정).
//   [다음으로]는 페이지가 ref.submit() 으로 트리거 → 통과 시 onSubmit(값). 실패 시 이동 없이 첫 에러 필드로 포커스+스크롤
//   (focusField — 셀렉트/파일 행은 RHF ref 가 없어 앵커 id 기준, shouldFocusError 는 끄고 한 경로로 통일).
// P75 풀팝업(내부에 P76 보증서정보조회 바텀시트, 콘텐츠 OvsBidWtgrDtl)은 OvsBidWtgrInqFullPopup 이 캡슐화 — 이 탭은 open/onApply 만 소유.
import * as React from 'react'
import { Controller, useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { focusField } from '@/utils/focusField'
import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import { OvsBidWtgrInqFullPopup } from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidWtgrInqFullPopup'
import {
  DEPOSIT_TYPE,
  PAY_METHOD,
  ovsBidGrnteSchema,
  type OvsBidGrnteValues,
  type OvsBizGrnteRow,
} from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAply.schema'
import { MOCK_BIZ_LIST } from '@/ui/biz/bd/ovsBidPrtcpAply/ovsBidPrtcpAplyMock'
import type { MockBidPrgrsItem, MockOvsBidPrtcpBizItem, MockOvsBidWtgrItem } from '@/types/mock/bd'

// 입찰보증금 구분 — ⚠️ 값 항목명 설계서 미정의(이벤트 sbx_depositType_onchange 에서 파생한 임시 키, 관례 승인).
const DEPOSIT_TYPES = [
  { value: DEPOSIT_TYPE.nonExmptn, label: '보증금 비면제' },
  { value: DEPOSIT_TYPE.exmptn, label: '보증금 면제' },
]

// 보증금납부방법(grntePayMth) — 구분(보증보험, 전자보증서). 설계서 slide450.
const PAY_METHODS = [
  { value: PAY_METHOD.insurance, label: '보증보험' },
  { value: PAY_METHOD.eGuarantee, label: '전자보증서' },
]

// 사업 행 안 에러 우선순위(표 행 순서) — 첫 에러 필드 포커스용.
const ROW_FIELD_ORDER: (keyof OvsBizGrnteRow)[] = [
  'chckBidGrnteAmt',
  'grntePayMth',
  'wtgrNo',
  'grnteInstNm',
  'gurnAgreDocNo',
  'giveWrtprmDocNo',
]
const rowFieldId = (i: number, key: keyof OvsBizGrnteRow) => `field-bizList-${i}-${key}`

export interface Stp3Handle {
  /** 페이지 [다음으로]가 호출 — 검증 통과 시 onSubmit 실행. */
  submit: () => void
}

export interface Stp3Props {
  detail: MockBidPrgrsItem
  /** 초기값 — 페이지가 보관한 확정값(되돌아올 때) 또는 BID_GRNTE_DEFAULT. */
  defaultValues: OvsBidGrnteValues
  /** 검증 통과 시 확정값 전달 — 페이지가 저장 후 다음 탭으로. */
  onSubmit: (values: OvsBidGrnteValues) => void
}

const Stp3 = React.forwardRef<Stp3Handle, Stp3Props>(({ detail, defaultValues, onSubmit }, ref) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<OvsBidGrnteValues>({
    resolver: zodResolver(ovsBidGrnteSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    shouldFocusError: false, // 첫 에러 포커스는 아래 handleInvalid(focusField) 한 경로로.
    defaultValues,
  })
  const depositType = watch('depositType')
  const rows = watch('bizList')
  const isExmptn = depositType === DEPOSIT_TYPE.exmptn

  // 실패 시 표 행 순서대로 첫 에러 필드 포커스+스크롤.
  const handleInvalid = React.useCallback((errs: FieldErrors<OvsBidGrnteValues>) => {
    const list = errs.bizList
    if (!Array.isArray(list)) return
    for (let i = 0; i < list.length; i++) {
      const rowErr = list[i]
      if (!rowErr) continue
      const key = ROW_FIELD_ORDER.find((k) => rowErr[k])
      if (key) {
        focusField(rowFieldId(i, key))
        return
      }
    }
  }, [])

  React.useImperativeHandle(ref, () => ({
    submit: () => void handleSubmit(onSubmit, handleInvalid)(),
  }))

  // 편집값 갱신 — 파일/보증서 적용처럼 컨트롤 밖에서 값을 넣는 경로. 제출 후엔 즉시 재검증해 에러 해제.
  const patchRow = (i: number, patch: Partial<OvsBizGrnteRow>) =>
    (Object.keys(patch) as (keyof OvsBizGrnteRow)[]).forEach((k) =>
      setValue(`bizList.${i}.${k}`, patch[k] ?? '', { shouldDirty: true, shouldValidate: true }),
    )

  // 입찰보증서선택(P75) — 어느 사업(행 index)에 적용할지. null=닫힘.
  const [wtgrInqFor, setWtgrInqFor] = React.useState<number | null>(null)

  // 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — 어느 사업(행 index)의
  //   어느 서류(연대보증서/지급각서/입찰보증금납부서)를 여는지 대상 1개로 공용. null=닫힘.
  const [fileAddFor, setFileAddFor] = React.useState<{
    index: number
    field: 'gurnAgreDocNo' | 'giveWrtprmDocNo' | 'grntePyslDocNo'
    docNm: string
  } | null>(null)
  const fileAddRef = React.useRef<FileAddHandle>(null)

  // 보증서 적용(P75/P76 → 부모) — 전자보증서 정보(증권번호/보증기관명=발행자)를 해당 사업에 주입.
  const applyWtgr = (item: MockOvsBidWtgrItem) => {
    if (wtgrInqFor !== null) {
      patchRow(wtgrInqFor, { wtgrNo: item.wtgrNo, grnteInstNm: item.isrRprsvNm })
      console.log('[T74] 보증서 적용', { prchsDmndNo: getValues(`bizList.${wtgrInqFor}.prchsDmndNo`), wtgrNo: item.wtgrNo })
      // 추후 API: bdService.applyOvsBidWtgr(detail.pbancNo, prchsDmndNo, item.wtgrNo)
    }
    setWtgrInqFor(null)
  }

  // 에러 문구 — 행 index + 필드.
  const rowError = (i: number, key: keyof OvsBizGrnteRow) => errors.bizList?.[i]?.[key]?.message

  // 파일 행 value — 파일 UI FileDownloadList 통일(2026-09-01 사용자 확정):
  //   파일 있으면 파일명/용량 박스 + X 삭제, 없으면 목록 없이 [파일선택] 버튼만. 에러는 아래 InputMessage.
  const fileCell = (
    i: number,
    field: 'gurnAgreDocNo' | 'giveWrtprmDocNo' | 'grntePyslDocNo',
    docNm: string,
  ) => {
    const fileNm = rows[i]?.[field] ?? ''
    const err = rowError(i, field)
    return (
      <div id={rowFieldId(i, field)} className="flex flex-col gap-krds-3">
        <FileDownloadList
          files={
            fileNm
              ? [
                  {
                    id: docNm,
                    name: fileNm,
                    onRemove: () => {
                      patchRow(i, { [field]: '' })
                      console.log(`[T74] ${docNm} 파일 삭제`, rows[i]?.prchsDmndNo)
                      // 추후 API: bdService.removeOvs{Doc}
                    },
                  },
                ]
              : []
          }
          // 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02)
          onAddFile={() => setFileAddFor({ index: i, field, docNm })}
          addFileLabel="파일선택"
        />
        {err && <InputMessage type="error">{err}</InputMessage>}
      </div>
    )
  }

  // 사업 1건 → Table rows (설계서 slide446 면제 / slide447 비면제 데이터 영역).
  const buildBizRows = (biz: MockOvsBidPrtcpBizItem, i: number): TableRow[] => {
    const row = rows[i]
    const isEGuarantee = row?.grntePayMth === PAY_METHOD.eGuarantee

    const base: TableRow[] = [
      { label: '순번', value: String(i + 1) },
      { label: '구매요청번호', value: biz.prchsDmndNo },
      { label: '사업명', value: biz.bizNm },
      { label: '입찰품목수', value: biz.bdngItemQty, type: 'number' },
      { label: '입찰금액', value: biz.bdngTccrAmt, type: 'number' },
      { label: '입찰보증금', value: biz.bidGrnteAmt, type: 'number' },
    ]

    if (isExmptn) {
      // 보증금면제(dl_bizExmptnList) — 확인입력은 R(입찰보증금 표시), 연대보증서/지급각서 파일 필수.
      //   업로드된 파일은 X 아이콘 버튼으로 삭제(설계서 slide446 특이사항 — 사용자 지시 2026-08-26).
      return [
        ...base,
        { label: '입찰보증금(확인입력)', value: biz.bidGrnteAmt, type: 'number' },
        { label: '연대보증서', type: 'combination', value: fileCell(i, 'gurnAgreDocNo', '연대보증서') },
        { label: '지급각서', type: 'combination', value: fileCell(i, 'giveWrtprmDocNo', '지급각서') },
      ]
    }

    // 보증금비면제(dl_bizList) — 확인입력(필수·일치)/납부방법/증권번호/보증기관명(필수)/납부서(선택).
    const chckErr = rowError(i, 'chckBidGrnteAmt')
    const payErr = rowError(i, 'grntePayMth')
    const wtgrErr = rowError(i, 'wtgrNo')
    const instErr = rowError(i, 'grnteInstNm')
    return [
      ...base,
      {
        label: '입찰보증금(확인입력)',
        type: 'combination',
        value: (
          <div id={rowFieldId(i, 'chckBidGrnteAmt')} className="flex flex-col gap-krds-3">
            <InputBox
              placeholder="입력해주세요."
              inputMode="decimal"
              maxLength={25}
              error={!!chckErr}
              aria-invalid={!!chckErr}
              {...register(`bizList.${i}.chckBidGrnteAmt`)}
            />
            {chckErr && <InputMessage type="error">{chckErr}</InputMessage>}
          </div>
        ),
      },
      {
        label: '보증금납부방법',
        type: 'combination',
        value: (
          <div id={rowFieldId(i, 'grntePayMth')} className="flex flex-col gap-krds-3">
            <Controller
              control={control}
              name={`bizList.${i}.grntePayMth`}
              render={({ field }) => (
                <SelectBox
                  items={PAY_METHODS}
                  value={field.value}
                  error={!!payErr}
                  onValueChange={(v) => {
                    // 납부방법 변경(slide452 sbx_depositPaymentType_onchange) —
                    // 전자보증서: 증권번호/보증기관명 입력 비활성화 + 보증서선택 버튼 노출. 값은 초기화.
                    field.onChange(v)
                    patchRow(i, { wtgrNo: '', grnteInstNm: '' })
                    console.log('[T74] 보증금납부방법 변경', { prchsDmndNo: biz.prchsDmndNo, grntePayMth: v })
                  }}
                  placeholder="선택해주세요."
                />
              )}
            />
            {payErr && <InputMessage type="error">{payErr}</InputMessage>}
          </div>
        ),
      },
      {
        label: '보증금증권번호',
        type: 'combination',
        value: (
          <div id={rowFieldId(i, 'wtgrNo')} className="flex flex-col gap-krds-3">
            <InputBox
              placeholder="입력해주세요."
              maxLength={30}
              readOnly={isEGuarantee}
              disabled={isEGuarantee && !row?.wtgrNo}
              error={!!wtgrErr}
              aria-invalid={!!wtgrErr}
              {...register(`bizList.${i}.wtgrNo`)}
            />
            {/* 보증서선택(slide452 btn_openBond_onclick) — 전자보증서: P75 팝업 / 보증보험: 파일 선택 업로드 */}
            <Button
              variant="inner"
              size="sm"
              disabled={!row?.grntePayMth}
              onClick={() => {
                if (isEGuarantee) {
                  setWtgrInqFor(i) // 입찰보증서선택 팝업(P75)
                } else {
                  setFileAddFor({ index: i, field: 'grntePyslDocNo', docNm: '입찰보증금납부서' })
                }
              }}
            >
              보증서선택
            </Button>
            {wtgrErr && <InputMessage type="error">{wtgrErr}</InputMessage>}
          </div>
        ),
      },
      {
        label: '보증기관명',
        type: 'combination',
        value: (
          <div id={rowFieldId(i, 'grnteInstNm')} className="flex flex-col gap-krds-3">
            <InputBox
              placeholder="입력해주세요."
              maxLength={200}
              readOnly={isEGuarantee}
              disabled={isEGuarantee && !row?.grnteInstNm}
              error={!!instErr}
              aria-invalid={!!instErr}
              {...register(`bizList.${i}.grnteInstNm`)}
            />
            {instErr && <InputMessage type="error">{instErr}</InputMessage>}
          </div>
        ),
      },
      {
        // 업로드된 파일 X 삭제(설계서 slide447 주석 4). 선택 항목(N).
        label: '입찰보증금납부서',
        type: 'combination',
        value: fileCell(i, 'grntePyslDocNo', '입찰보증금납부서'),
      },
    ]
  }

  return (
    // 폼 내 제출 버튼은 두지 않는다 — 페이지 액션바 [다음으로]가 ref.submit() 으로 제출.
    <form onSubmit={handleSubmit(onSubmit, handleInvalid)}>
      {/* 입찰보증금 구분 — 값에 따라 면제/비면제 데이터 영역 전환.
          SelectBox → 버튼형 라디오(v0.87 검토90, 상세 화면 Tab3 관례와 동일 가로 배치). */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
        {/* 라디오 그룹은 labelable 요소가 아니라 htmlFor 미사용(aria-label 로 연결) */}
        <InputLabel>입찰보증금 구분</InputLabel>
        <Controller
          control={control}
          name="depositType"
          render={({ field }) => (
            <RadioButtonGroup
              aria-label="입찰보증금 구분"
              items={DEPOSIT_TYPES}
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v)
                console.log('[T74] 입찰보증금 구분 변경', { pbancNo: detail.pbancNo, depositType: v })
                // 추후 API: bdService.selectBidPrtcpBizList(detail.pbancNo, v)
              }}
            />
          )}
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

      {/* '안내사항' Infobox 는 삭제 — v0.87 검토90 */}

      {/* 입찰보증서선택(P75) + 보증서정보조회(P76) — 풀팝업 래퍼(OvsBidWtgrInqFullPopup)가 캡슐화 */}
      <OvsBidWtgrInqFullPopup
        open={wtgrInqFor !== null}
        onOpenChange={(open) => {
          if (!open) setWtgrInqFor(null)
        }}
        onApply={applyWtgr}
      />

      {/* 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — [공통] 파일 추가(v0.87 마지막 장).
          서류명 고정(fixedDocNm)·서류당 1파일(multiple=false). 완료 시 대상 사업 행에 파일명 반영. */}
      <BottomSheet
        open={fileAddFor !== null}
        onOpenChange={(open) => {
          if (!open) setFileAddFor(null)
        }}
        title="파일 추가"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setFileAddFor(null) },
              {
                label: '완료',
                variant: 'primary',
                onClick: () => {
                  if (fileAddRef.current?.complete()) setFileAddFor(null)
                },
              },
            ]}
          />
        }
      >
        {fileAddFor && (
          <FileAdd
            ref={fileAddRef}
            fixedDocNm={fileAddFor.docNm}
            multiple={false}
            onComplete={({ files }) =>
              patchRow(fileAddFor.index, { [fileAddFor.field]: files[0]?.name ?? '' })
            }
          />
        )}
      </BottomSheet>
    </form>
  )
})
Stp3.displayName = 'Stp3'

export { Stp3 }
