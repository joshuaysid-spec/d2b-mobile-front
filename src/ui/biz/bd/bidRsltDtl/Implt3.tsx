// 이행/적격심사상세 - '파일첨부' 탭 (MUI-BD-10-T03(구 M03 — v1.83 재편), 설계서 02입찰 slide165 / 데이터영역 slide167).
// 첨부서류(dlt_adoc) + 추가첨부서류(dlt_addAdoc) — 업로드 변형(파일 추가/삭제). 데이터는 목업(추후 API).
import { useRef, useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'

// 첨부서류/추가첨부서류 초기 목업 (설계서 slide165·167) — 첨부파일명 fileNm · 파일크기 fileSz.
const INIT_ADOC: FileDownloadItem[] = [
  { id: 'adoc-1', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'adoc-2', name: '첨부파일명.hwp', size: '1.2MB' },
]
const INIT_ADD_ADOC: FileDownloadItem[] = [
  { id: 'add-1', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'add-2', name: '첨부파일명.hwp', size: '1.2MB' },
]

export function Implt3() {
  const [adoc, setAdoc] = useState<FileDownloadItem[]>(INIT_ADOC)
  const [addAdoc, setAddAdoc] = useState<FileDownloadItem[]>(INIT_ADD_ADOC)

  // 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — 어느 목록(첨부서류/추가첨부서류)에
  //   추가하는지 대상 1개. null=닫힘.
  const [fileAddFor, setFileAddFor] = useState<'adoc' | 'addAdoc' | null>(null)
  const fileAddRef = useRef<FileAddHandle>(null)

  // 파일 추가/삭제 — 추후 API: 파일 선택 모듈(btn_fileAdd/btn_addAdocFileAdd) · 삭제(btn_chcDel/btn_addAdocChcDel)
  const removeFrom = (
    set: React.Dispatch<React.SetStateAction<FileDownloadItem[]>>,
    id: FileDownloadItem['id'],
  ) => set((list) => list.filter((f) => f.id !== id))

  const adocRows = adoc.map((f) => ({ ...f, onRemove: () => removeFrom(setAdoc, f.id) }))
  const addAdocRows = addAdoc.map((f) => ({ ...f, onRemove: () => removeFrom(setAddAdoc, f.id) }))

  return (
    <>
      <Accordion type="multiple" defaultValue={['adoc', 'addAdoc']} className="w-full">
        <AccordionSection value="adoc" title={`첨부서류 (총 ${adoc.length}건)`} borderTop={false}>
          {/* 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) */}
          <FileDownloadList files={adocRows} onAddFile={() => setFileAddFor('adoc')} />
        </AccordionSection>
        <AccordionSection value="addAdoc" title={`추가첨부서류 (총 ${addAdoc.length}건)`}>
          <FileDownloadList files={addAdocRows} onAddFile={() => setFileAddFor('addAdoc')} />
        </AccordionSection>
      </Accordion>

      {/* 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — [공통] 파일 추가(v0.87 마지막 장).
          첨부서류명 직접입력 + 여러 파일 허용, 완료 시 대상 목록 append. */}
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
            onComplete={({ files: picked }) => {
              const set = fileAddFor === 'adoc' ? setAdoc : setAddAdoc
              set((prev) => [
                ...prev,
                ...picked.map((p) => ({ id: p.id, name: p.name, size: p.size })),
              ])
            }}
          />
        )}
      </BottomSheet>
    </>
  )
}
Implt3.displayName = 'Implt3'
