// 국외 입찰공고 상세 - '첨부파일' 탭 (MUI-BD-01-T73(구 M73 — v1.83 재편), 설계서 slide292·294).
// 첨부서류(dl_docList) 목록 — 순번·첨부서류명 라벨 + 첨부파일 행(파일명 [크기] + 다운로드).
// 데이터는 목업(추후 bdService.selectAtchDocList). 다운로드 클릭 = 파일다운로드 스텁.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { formatFileSize } from '@/utils/format'
import type { OvsAtchDoc } from '@/types/bd'

// 첨부서류 목업 — PC 실 인터페이스(ovsBidPbancDtl.IResultAttach) 키. 설계서 slide292 Layout 값 기반.
const MOCK_DOC_LIST: OvsAtchDoc[] = [
  { docTitl: '입찰공고문', fileNm: '입찰공고문(EFD0007-2).hwp', fileSz: 804_864, fileId: 'ATCH-1001' },
  { docTitl: '입찰유의서', fileNm: '국외입찰유의서.hwp', fileSz: 1_258_291, fileId: 'ATCH-1002' },
  { docTitl: '계약특수조건', fileNm: '계약특수조건(500MD부품).pdf', fileSz: 2_516_582, fileId: 'ATCH-1003' },
]

export function OvsBidPbancDtl2() {
  return (
    <>
      {/* 타이틀 + 건수 — Figma m_section title(9973-131169) 우측 건수 슬롯(총 N건). 배경은 흰색(사용자 확정 — info 기본 블루 강조 제거) */}
      <SectionTitle topDivider info={`총 ${MOCK_DOC_LIST.length}건`} className="bg-white">
        첨부서류
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4 pt-2 pb-4">
        {MOCK_DOC_LIST.map((doc, i) => (
          <div key={doc.fileId} className="flex flex-col gap-krds-3">
            {/* 순번 · 첨부서류명(docTitl) */}
            <p className="text-krds-body-sm font-medium text-krds-text-muted">
              {i + 1}. {doc.docTitl}
            </p>
            {/* 첨부파일명(fileNm) [파일크기(fileSz)] + 다운로드 */}
            <FileDownloadList
              files={[
                {
                  id: `doc-${doc.fileId}`,
                  name: doc.fileNm,
                  size: formatFileSize(doc.fileSz),
                  // 추후 API: bdService.downloadOvsBidAtchDoc(doc.fileId)
                  onDownload: () => console.log('[M73] 첨부파일 다운로드', doc.fileNm),
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
