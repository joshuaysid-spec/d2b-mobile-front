// 업체의견 등록/수정 (MUI-OP-01-P07, Figma 11044-29911). 풀페이지 팝업.
// 업체의견(제목*·내용*·공개여부*) + 첨부서류(삭제·파일추가, 다운로드 없음 — slide31 수정) + 작성자정보
//   (업체명/사번/성명 readonly, 전화/이메일 입력) + 취소/저장. 저장 → 닫힘. 데이터 목업.
import * as React from 'react'
import { useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { TextArea } from '@/ui/common/base/TextArea'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'

interface UploadFile {
  id: string
  name: string
  size: string
}
const INITIAL_FILES: UploadFile[] = [
  { id: 'f1', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'f2', name: '첨부파일명.hwp', size: '786KB' },
]
const MAX_CONTENT = 2000

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel required={required}>{label}</InputLabel>
      {children}
    </div>
  )
}

export interface BfhdSpcfctDtl_OpnnRegPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 저장 콜백(추후 API). 저장 후 자동 닫힘. */
  onSave?: () => void
}

export function BfhdSpcfctDtl_OpnnRegPopup({
  open,
  onOpenChange,
  onSave,
}: BfhdSpcfctDtl_OpnnRegPopupProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState('Y') // 공개/비공개 — 등록/수정 시 선택 가능(기본 공개)
  const [files, setFiles] = useState<UploadFile[]>(INITIAL_FILES)
  const [phone, setPhone] = useState('010-1234-5678')
  const [email, setEmail] = useState('abcde@naver.com')

  const removeFile = (id: string) => setFiles((fs) => fs.filter((f) => f.id !== id))
  const addFile = () => console.log('[P07] 파일 추가 (파일 선택 스텁)')

  const handleSave = () => {
    console.log('[P07] 저장', { title, content, isPublic, phone, email, files: files.length })
    onSave?.()
    onOpenChange(false)
  }

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="업체의견 등록/수정"
      footer={
        <ButtonGroup
          layout="split"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => onOpenChange(false) },
            { label: '저장', variant: 'primary', onClick: handleSave },
          ]}
        />
      }
    >
      <Accordion type="multiple" defaultValue={['op', 'files', 'author']} className="w-full">
        {/* 업체의견 */}
        <AccordionSection value="op" title="업체의견" variant="blue" borderTop={false}>
          <Field label="제목" required>
            <InputBox
              value={title}
              placeholder="업체의견이 있습니다."
              onChange={(e) => setTitle(e.target.value)}
              onClear={() => setTitle('')}
            />
          </Field>
          <Field label="내용" required>
            <TextArea
              value={content}
              maxLength={MAX_CONTENT}
              placeholder="업체의견이 있습니다."
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-right text-krds-body-sm text-krds-text-subtle">
              {content.length} / {MAX_CONTENT}
            </p>
          </Field>
          <Field label="공개여부" required>
            <SegmentedControl
              value={isPublic}
              onValueChange={setIsPublic}
              items={[
                { value: 'Y', label: '공개' },
                { value: 'N', label: '비공개' },
              ]}
            />
          </Field>
        </AccordionSection>

        {/* 첨부서류 — 삭제 + 파일추가 (다운로드 없음) */}
        <AccordionSection
          value="files"
          title="첨부서류"
          titleInfo={`총 ${files.length}건`}
          variant="blue"
        >
          {/* 업로드 목록 — FileDownloadList 의 삭제(X) 변형(onRemove) + 하단 '파일 추가' 버튼(onAddFile) */}
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

        {/* 작성자 정보 — 업체명/사번/성명 readonly, 전화/이메일 입력 */}
        <AccordionSection value="author" title="작성자 정보" variant="blue">
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
            <InputBox
              value={phone}
              inputMode="tel"
              onChange={(e) => setPhone(e.target.value)}
              onClear={() => setPhone('')}
            />
          </Field>
          <Field label="이메일">
            <InputBox
              value={email}
              inputMode="email"
              onChange={(e) => setEmail(e.target.value)}
              onClear={() => setEmail('')}
            />
          </Field>
        </AccordionSection>
      </Accordion>
    </FullPopup>
  )
}
BfhdSpcfctDtl_OpnnRegPopup.displayName = 'BfhdSpcfctDtl_OpnnRegPopup'
