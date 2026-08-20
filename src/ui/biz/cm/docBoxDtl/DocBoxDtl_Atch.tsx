// 문서함 상세 - '첨부파일' 탭 콘텐츠 (MUI-CM-06-T03). 설계서 00.공통 v0.84 slide95·98.
// 첨부문서다운로드 목록(dl_atchDocList) — 파일명 + [파일크기] + 개별 다운로드 버튼(FileDownloadList 재사용).
// 첨부가 있는 문서에서만 탭이 노출된다(페이지가 분기). 데이터는 페이지 목업 → 추후 API 로 대체.
import { PageTitle } from '@/ui/common/base/PageTitle'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import type { DocBoxAtchFile } from '@/types/cm'

export function DocBoxDtl_Atch({ files }: { files: DocBoxAtchFile[] }) {
  // 첨부문서(dl_atchDocList) → FileDownloadList 항목. 파일명(fileNm) 표시, 개별 다운로드는 콘솔 스텁.
  const items: FileDownloadItem[] = files.map((f, i) => ({
    id: f.edmsDocId ?? `${f.fileNm}-${i}`, // 파일명 중복 가능 → 고유 id
    name: f.fileNm,
    size: f.fileSize,
    onDownload: () => console.log('[DocBoxDtl] 첨부 다운로드', f.fileNm), // 추후: cmService.downloadAtchFile(edmsDocId, fileNm)
  }))

  return (
    <div className="flex w-full flex-col">
      <PageTitle>첨부파일</PageTitle>
      <div className="px-4 pb-6">
        <FileDownloadList files={items} />
      </div>
    </div>
  )
}
DocBoxDtl_Atch.displayName = 'DocBoxDtl_Atch'
