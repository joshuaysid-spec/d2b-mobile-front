// 이행/적격심사포기신청 (MUI-BD-10-P02, 설계서 02입찰 v1.88 slide270~271). 풀페이지 팝업.
// 입찰결과상세 > 일반정보 > '이행/적격심사 포기하기' → 이 팝업.
// 사유 선택(포기사유구분 elgbSrngAbndRsnSe, 필수) + 포기사유(srngMnftrBzentyAbndRsn — 기타 선택 시에만 노출·필수)
//   + 첨부서류(dlt_adoc, 업로드) + 취소/제출하기. 검증 = react-hook-form + zod(팝업이 useForm 소유).
// ⚠️ readOnly = 이행/적격심사포기신청조회 (MUI-BD-10-P03, slide273~274). 설계서가 별도 화면이 아니라
//    "이행/적격심사 상태가 심사포기인 경우 조회 항목으로 속성 변경"(slide274 항목설명)으로 규정하므로
//    같은 화면의 모드로 둔다 — 저장된 포기사유·첨부서류를 읽기전용 표시, 입력/제출/파일추가·삭제 없음(footer=닫기).
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { TextArea } from '@/ui/common/base/TextArea'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import {
  ABND_RSN_ETC,
  ABND_RSN_OPTIONS,
  abndAplySchema,
  type AbndAplyForm,
} from '@/ui/biz/bd/bidRsltDtl/ImpltElgbSrngAbndAply.schema'
import type { MockBdopnItem } from '@/types/mock/bd'

const MAX_RSN = 500

// 첨부서류(dlt_adoc) 초기 목업 — 첨부파일명 fileNm · 파일크기 fileSz (설계서 slide283·284).
interface UploadFile {
  id: string
  name: string
  size: string
}
const INITIAL_FILES: UploadFile[] = [
  { id: 'f1', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'f2', name: '첨부파일명.hwp', size: '1.2MB' },
]

// 조회(P03) 모드에서 보여줄 제출값 목업 — 설계서 slide273 화면의 표시값 그대로(기타 선택 + 포기사유 문구).
const SUBMITTED_ABND_RSN: AbndAplyForm = {
  elgbSrngAbndRsnSe: ABND_RSN_ETC,
  srngMnftrBzentyAbndRsn: '이행적격 심사상 부적격하다고 판단하여 당사는 심사 포기를 신청합니다.',
}

export interface ImpltElgbSrngAbndAplyProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 상단 요약 표시용 개찰목록 항목(입찰결과상세에서 전달). 없으면 요약 생략. */
  detail?: MockBdopnItem
  /** 제출(심사포기) 콜백(추후 API). 제출 후 자동 닫힘. */
  onSubmitted?: () => void
  /** true = 이행/적격심사포기신청조회(MUI-BD-10-P03) — 제출한 내용을 읽기전용 표시(footer=닫기). */
  readOnly?: boolean
}

export function ImpltElgbSrngAbndAply({
  open,
  onOpenChange,
  detail,
  onSubmitted,
  readOnly = false,
}: ImpltElgbSrngAbndAplyProps) {
  const [files, setFiles] = useState<UploadFile[]>(INITIAL_FILES)

  // 팝업이 useForm 소유. mode:onSubmit + reValidateMode:onBlur → 제출 시 전체 검증, 이후 에러 필드는 blur 재검증.
  // 조회 모드는 제출값을 defaultValues 로 넣고 컨트롤을 disabled 로만 두므로 검증이 돌지 않는다.
  const { control, handleSubmit, watch, reset } = useForm<AbndAplyForm>({
    resolver: zodResolver(abndAplySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: readOnly
      ? SUBMITTED_ABND_RSN
      : { elgbSrngAbndRsnSe: '', srngMnftrBzentyAbndRsn: '' },
  })

  // 기타(직접 입력) 선택 시에만 포기사유 TextArea 노출.
  const isEtc = watch('elgbSrngAbndRsnSe') === ABND_RSN_ETC

  const removeFile = (id: string) => setFiles((fs) => fs.filter((f) => f.id !== id))
  const addFile = () => console.log('[P21] 파일 추가 (파일 선택 스텁)') // 추후 API: btn_fileAdd

  const closeAndReset = () => {
    reset()
    setFiles(INITIAL_FILES)
    onOpenChange(false)
  }

  const onSubmit = handleSubmit(
    (data) => {
      console.log('[P21] 이행/적격심사 포기신청', { ...data, files: files.length }) // 추후 API: scwin.btn_srngAbnd_onclick
      onSubmitted?.()
      closeAndReset()
    },
    (errs) => {
      // 첫 에러 필드로 스크롤(Radix 그룹은 자동 포커스 불가 → 수동). main#app-scroll 셸 기준.
      const first = Object.keys(errs)[0]
      requestAnimationFrame(() =>
        document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    },
  )

  return (
    <FullPopup
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : closeAndReset())}
      title="이행/적격심사 포기신청"
      footer={
        readOnly ? (
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: closeAndReset }]}
          />
        ) : (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: closeAndReset },
              { label: '제출하기', variant: 'primary', onClick: onSubmit },
            ]}
          />
        )
      }
    >
      {/* 상단 요약 — 입찰결과상세에서 넘어온 항목(공고상태·업무구분·입찰방식 뱃지 + 공고번호 + 공고명).
          SummaryInfo 자체 px/py-krds-8 보유 → 별도 패딩 X. 하단 구분선으로 아코디언과 경계. */}
      {detail && (
        <SummaryInfo
          className="border-b border-krds-border-divider"
          badges={[{ label: detail.pbancStasNm }, { label: detail.taskSeNm }, { label: detail.bidMthdNm }]}
          subtitle={`입찰공고번호 ${detail.bidPbancNo}`}
          title={detail.bidPbancNm}
        />
      )}

      <Accordion type="multiple" defaultValue={['rsn', 'files']} className="w-full">
        {/* 사유 선택 (포기사유구분 + 기타 시 포기사유) */}
        <AccordionSection
          value="rsn"
          title="사유 선택"
          variant="blue"
          borderTop={false}
          contentClassName="pt-krds-6"
        >
          <Controller
            control={control}
            name="elgbSrngAbndRsnSe"
            render={({ field, fieldState }) => (
              <div id="field-elgbSrngAbndRsnSe" className="flex flex-col gap-krds-5">
                <InputLabel required={!readOnly}>사유 선택</InputLabel>
                <RadioButtonGroup
                  showIndicator
                  direction="vertical"
                  disabled={readOnly}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  items={ABND_RSN_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                />
                {fieldState.error && (
                  <InputMessage type="error">{fieldState.error.message}</InputMessage>
                )}
              </div>
            )}
          />

          {/* 포기사유 — 기타(직접 입력) 선택 시에만 노출·필수 */}
          {isEtc && (
            <Controller
              control={control}
              name="srngMnftrBzentyAbndRsn"
              render={({ field, fieldState }) => (
                <div id="field-srngMnftrBzentyAbndRsn" className="flex flex-col gap-krds-5">
                  <InputLabel required={!readOnly}>포기사유</InputLabel>
                  <TextArea
                    value={field.value}
                    maxLength={MAX_RSN}
                    placeholder="내용을 입력하세요."
                    disabled={readOnly}
                    readOnly={readOnly}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    aria-invalid={fieldState.error ? true : undefined}
                  />
                  {!readOnly && (
                    <div className="flex items-center justify-between">
                      {fieldState.error ? (
                        <InputMessage type="error">{fieldState.error.message}</InputMessage>
                      ) : (
                        <span />
                      )}
                      <span className="text-krds-body-sm text-krds-text-subtle">
                        {field.value.length} / {MAX_RSN}
                      </span>
                    </div>
                  )}
                </div>
              )}
            />
          )}
        </AccordionSection>

        {/* 첨부서류 — 업로드(파일 추가/삭제) */}
        <AccordionSection
          value="files"
          title="첨부서류"
          titleInfo={`총 ${files.length}건`}
          variant="blue"
          contentClassName="pt-krds-6"
        >
          {/* 조회(P03)는 다운로드만 — 파일 추가/삭제 없음(slide273) */}
          <FileDownloadList
            files={files.map((file) => ({
              id: file.id,
              name: file.name,
              size: file.size,
              ...(readOnly
                ? { onDownload: () => console.log('[P03] 첨부파일 다운로드', file.name) } // 추후 API: scwin.btn_atchFileNm_onclick
                : { onRemove: () => removeFile(file.id) }),
            }))}
            onAddFile={readOnly ? undefined : addFile}
          />
        </AccordionSection>
      </Accordion>
    </FullPopup>
  )
}
ImpltElgbSrngAbndAply.displayName = 'ImpltElgbSrngAbndAply'
