// 국외 입찰공고 상세 - '첨부파일' 탭 (MUI-BD-01-M73, 설계서 slide292·294).
// 첨부서류(dl_docList) 목록 — 순번·첨부서류명 라벨 + 첨부파일 행(파일명 [크기] + 다운로드).
// 데이터는 목업(추후 bdService.getOvsBidAtchDocList). 다운로드 클릭 = 파일다운로드 스텁.
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
// 추후 src/types/bd.ts 통합
import type { OvsAtchDoc } from '@/ui/biz/bd/ovsBidPbancDtl/OvsBidPbancDtlPage'

// 첨부서류(dl_docList) 목업 — 설계서 slide292 Layout(첨부서류명 + 첨부파일명.hwp [파일크기]) 기반.
const MOCK_DOC_LIST: OvsAtchDoc[] = [
  { no: 1, atchDocNm: '입찰공고문', atchFileNm: '입찰공고문(EFD0007-2).hwp', fileSz: '786KB' },
  { no: 2, atchDocNm: '입찰유의서', atchFileNm: '국외입찰유의서.hwp', fileSz: '1.2MB' },
  { no: 3, atchDocNm: '계약특수조건', atchFileNm: '계약특수조건(500MD부품).pdf', fileSz: '2.4MB' },
]

export function OvsBidPbancDtl2() {
  return (
    <>
      {/* 총 건수 */}
      <p className="px-4 pb-2 text-krds-body-sm text-krds-text-primary-active">
        총 {MOCK_DOC_LIST.length}건
      </p>
      <div className="flex flex-col gap-krds-7 px-4 pb-4">
        {MOCK_DOC_LIST.map((doc) => (
          <div key={doc.no} className="flex flex-col gap-krds-3">
            {/* 순번 · 첨부서류명(atchDocNm) */}
            <p className="text-krds-body-sm font-medium text-krds-text-muted">
              {doc.no}. {doc.atchDocNm}
            </p>
            {/* 첨부파일명(atchFileNm) [파일크기(fileSz)] + 다운로드 */}
            <FileDownloadList
              files={[
                {
                  id: `doc-${doc.no}`,
                  name: doc.atchFileNm,
                  size: doc.fileSz,
                  // 추후 API: bdService.downloadOvsBidAtchDoc(doc.no)
                  onDownload: () => console.log('[M73] 첨부파일 다운로드', doc.atchFileNm),
                },
              ]}
            />
          </div>
        ))}
      </div>
    </>
  )
}
OvsBidPbancDtl2.displayName = 'OvsBidPbancDtl2'
