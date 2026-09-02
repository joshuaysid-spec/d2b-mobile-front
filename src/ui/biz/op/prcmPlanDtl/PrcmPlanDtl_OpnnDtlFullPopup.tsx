// 업체의견 상세 / 답변 상세 (MUI-OP-01-P06, Figma 11044-29943). 풀페이지 팝업.
// variant 로 '의견 상세'와 '답변 상세'를 분기(문서 slide27/29):
//   opinion: 업체의견(제목·내용·공개여부) + 첨부 + 작성자(업체명/사번/성명/전화/이메일) + [삭제][수정]
//   reply  : 답변내역(제목·내용) + 첨부 + 작성자(담당자/전화) + 닫기만
// 표시 전용 — 읽기값은 disable 처리(기존 InputBox/TextArea 재사용). 데이터 목업.
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import * as React from 'react'
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { Toast } from '@/ui/common/composites/Toast'

const FILES: FileDownloadItem[] = [
  { id: 'f1', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'f2', name: '첨부파일명.hwp', size: '786KB' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel>{label}</InputLabel>
      {children}
    </div>
  )
}

export interface PrcmPlanDtl_OpnnDtlFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 'opinion'=업체의견 상세 / 'reply'=업체의견 답변 상세 */
  variant?: 'opinion' | 'reply'
  /** 수정 클릭(작성자) — 등록/수정 화면 진입 */
  onEdit?: () => void
  /** 삭제 클릭(작성자) — 삭제 확인 모달 */
  onDelete?: () => void
}

export function PrcmPlanDtl_OpnnDtlFullPopup({
  open,
  onOpenChange,
  variant = 'opinion',
  onEdit,
  onDelete,
}: PrcmPlanDtl_OpnnDtlFullPopupProps) {
  const isReply = variant === 'reply'

  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title={isReply ? '업체의견 답변 상세' : '업체의견 상세'}
      footer={
        isReply ? undefined : (
          <ButtonGroup
            layout="split"
            items={[
              { label: '삭제', variant: 'secondary', onClick: () => onDelete?.() },
              { label: '수정', variant: 'primary', onClick: () => onEdit?.() },
            ]}
          />
        )
      }
    >
      <Accordion type="multiple" defaultValue={['content', 'files', 'author']} className="w-full">
        <AccordionSection
          value="content"
          title={isReply ? '답변내역' : '업체의견'}
          variant="blue"
          borderTop={false}
        >
          <Field label="제목">
            <InputBox value="업체의견이 있습니다." disabled />
          </Field>
          <Field label="내용">
            <TextArea value="업체의견이 있습니다." disabled />
          </Field>
          {!isReply && (
            <Field label="공개여부">
              <SegmentedControl
                disabled
                defaultValue="Y"
                onValueChange={(v) => console.log('[SegmentedControl]', v)}
                items={[
                  { value: 'Y', label: '공개' },
                  { value: 'N', label: '비공개' },
                ]}
              />
            </Field>
          )}
        </AccordionSection>

        <AccordionSection value="files" title="첨부서류" titleInfo="총 2건" variant="blue">
          {/* 일괄 다운로드 버튼 미노출 — onDownloadAll 미주입(개별 다운로드만). */}
          <FileDownloadList
            files={FILES.map((f) => ({ ...f, onDownload: () => handleDownload(String(f.id), f.name) }))}
          />
        </AccordionSection>

        <AccordionSection value="author" title="작성자 정보" variant="blue">
          {isReply ? (
            <>
              <Field label="담당자">
                <InputBox value="김길동" disabled />
              </Field>
              <Field label="전화번호">
                <InputBox value="010-1234-5678" disabled />
              </Field>
            </>
          ) : (
            <>
              <Field label="업체명">
                <InputBox value="㈜길동주식회사" disabled />
              </Field>
              <Field label="사업자번호">
                <InputBox value="123-45-67890" disabled />
              </Field>
              <Field label="성명">
                <InputBox value="김길동" disabled />
              </Field>
              <Field label="전화번호">
                <InputBox value="010-1234-5678" disabled />
              </Field>
              <Field label="이메일">
                <InputBox value="abcde@naver.com" disabled />
              </Field>
            </>
          )}
        </AccordionSection>
      </Accordion>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </FullPopup>
  )
}
PrcmPlanDtl_OpnnDtlFullPopup.displayName = 'PrcmPlanDtl_OpnnDtlFullPopup'
