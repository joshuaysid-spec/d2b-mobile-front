// 이행/적격심사포기신청 (MUI-BD-10-P21, 설계서 02입찰 slide283~284). 풀페이지 팝업.
// 입찰결과상세 > 일반정보 > '이행/적격심사 포기하기' → 이 팝업.
// 사유 선택(포기사유구분 elgbSrngAbndRsnSe, 필수) + 포기사유(srngMnftrBzentyAbndRsn — 기타 선택 시에만 노출·필수)
//   + 첨부서류(dlt_adoc, 업로드) + 취소/제출하기. 검증 = react-hook-form + zod(팝업이 useForm 소유).
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
import type { BdopnItem } from '@/types/bd'

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

export interface ImpltElgbSrngAbndAplyProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 상단 요약 표시용 개찰목록 항목(입찰결과상세에서 전달). 없으면 요약 생략. */
  detail?: BdopnItem
  /** 제출(심사포기) 콜백(추후 API). 제출 후 자동 닫힘. */
  onSubmitted?: () => void
}

export function ImpltElgbSrngAbndAply({
  open,
  onOpenChange,
  detail,
  onSubmitted,
}: ImpltElgbSrngAbndAplyProps) {
  const [files, setFiles] = useState<UploadFile[]>(INITIAL_FILES)

  // 팝업이 useForm 소유. mode:onSubmit + reValidateMode:onBlur → 제출 시 전체 검증, 이후 에러 필드는 blur 재검증.
  const { control, handleSubmit, watch, reset } = useForm<AbndAplyForm>({
    resolver: zodResolver(abndAplySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { elgbSrngAbndRsnSe: '', srngMnftrBzentyAbndRsn: '' },
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
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '취소', variant: 'secondary', onClick: closeAndReset },
            { label: '제출하기', variant: 'primary', onClick: onSubmit },
          ]}
        />
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
                <InputLabel required>사유 선택</InputLabel>
                <RadioButtonGroup
                  showIndicator
                  direction="vertical"
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
                  <InputLabel required>포기사유</InputLabel>
                  <TextArea
                    value={field.value}
                    maxLength={MAX_RSN}
                    placeholder="내용을 입력하세요."
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={!!fieldState.error}
                    aria-invalid={fieldState.error ? true : undefined}
                  />
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
          <FileDownloadList
            files={files.map((file) => ({
              id: file.id,
              name: file.name,
              size: file.size,
              onRemove: () => removeFile(file.id),
            }))}
            onAddFile={addFile}
          />
        </AccordionSection>
      </Accordion>
    </FullPopup>
  )
}
ImpltElgbSrngAbndAply.displayName = 'ImpltElgbSrngAbndAply'
