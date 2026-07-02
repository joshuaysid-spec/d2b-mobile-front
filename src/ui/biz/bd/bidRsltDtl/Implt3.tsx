// 이행/적격심사상세 - '파일첨부' 탭 (MUI-BD-10-M03, 설계서 02입찰 slide165 / 데이터영역 slide167).
// 첨부서류(dlt_adoc) + 추가첨부서류(dlt_addAdoc) — 업로드 변형(파일 추가/삭제). 데이터는 목업(추후 API).
import { useState } from 'react'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'

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

  // 파일 추가/삭제 — 추후 API: 파일 선택 모듈(btn_fileAdd/btn_addAdocFileAdd) · 삭제(btn_chcDel/btn_addAdocChcDel)
  const removeFrom = (
    set: React.Dispatch<React.SetStateAction<FileDownloadItem[]>>,
    id: FileDownloadItem['id'],
  ) => set((list) => list.filter((f) => f.id !== id))

  const adocRows = adoc.map((f) => ({ ...f, onRemove: () => removeFrom(setAdoc, f.id) }))
  const addAdocRows = addAdoc.map((f) => ({ ...f, onRemove: () => removeFrom(setAddAdoc, f.id) }))

  return (
    <>
      <PageTitle as="h2">파일첨부</PageTitle>
      <Accordion type="multiple" defaultValue={['adoc', 'addAdoc']} className="w-full">
        <AccordionSection value="adoc" title={`첨부서류 (총 ${adoc.length}건)`} borderTop={false}>
          <FileDownloadList
            files={adocRows}
            onAddFile={() => console.log('[Implt] 첨부서류 파일 추가')}
          />
        </AccordionSection>
        <AccordionSection value="addAdoc" title={`추가첨부서류 (총 ${addAdoc.length}건)`}>
          <FileDownloadList
            files={addAdocRows}
            onAddFile={() => console.log('[Implt] 추가첨부서류 파일 추가')}
          />
        </AccordionSection>
      </Accordion>
    </>
  )
}
Implt3.displayName = 'Implt3'
