// 업체의견 상세 / 답변 상세 (MUI-OP-01-P06, Figma 11044-29943). 풀페이지 팝업.
// variant 로 '의견 상세'와 '답변 상세'를 분기(문서 slide27/29):
//   opinion: 업체의견(제목·내용·공개여부) + 첨부 + 작성자(업체명/사번/성명/전화/이메일) + [삭제][수정]
//   reply  : 답변내역(제목·내용) + 첨부 + 작성자(담당자/전화) + 닫기만
// 표시 전용 — 읽기값은 disable 처리(기존 InputBox/TextArea 재사용). 데이터 목업.
import * as React from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import {
  FileDownloadList,
  type FileDownloadItem,
} from '@/ui/common/composites/FileDownloadList'

const FILES: FileDownloadItem[] = [
  { id: 'f1', name: '첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[P06] 다운로드 1') },
  { id: 'f2', name: '첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[P06] 다운로드 2') },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel>{label}</InputLabel>
      {children}
    </div>
  )
}

export interface OpinionDetailPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 'opinion'=업체의견 상세 / 'reply'=업체의견 답변 상세 */
  variant?: 'opinion' | 'reply'
  /** 수정 클릭(작성자) — 등록/수정 화면 진입 */
  onEdit?: () => void
  /** 삭제 클릭(작성자) — 삭제 확인 모달 */
  onDelete?: () => void
}

export function OpinionDetailPopup({
  open,
  onOpenChange,
  variant = 'opinion',
  onEdit,
  onDelete,
}: OpinionDetailPopupProps) {
  const isReply = variant === 'reply'

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
              <InputBox value="공개" disabled />
            </Field>
          )}
        </AccordionSection>

        <AccordionSection value="files" title="첨부서류" titleInfo="총 2건">
          <FileDownloadList files={FILES} onDownloadAll={() => console.log('[P06] 일괄 다운로드')} />
        </AccordionSection>

        <AccordionSection value="author" title="작성자 정보">
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
    </FullPopup>
  )
}
OpinionDetailPopup.displayName = 'OpinionDetailPopup'
