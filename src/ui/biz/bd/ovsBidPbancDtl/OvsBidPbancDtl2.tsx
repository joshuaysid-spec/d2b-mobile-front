// 국외 입찰공고 상세 - '첨부파일' 탭 (MUI-BD-01-T73(구 M73 — v1.83 재편), 설계서 slide292·294).
// 첨부서류(dl_docList) 목록 — 순번·첨부서류명 라벨 + 첨부파일 행(파일명 [크기] + 다운로드).
// 데이터는 목업(추후 bdService.selectOvsBidAtchDocList). 다운로드 클릭 = 파일다운로드 스텁.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { OvsAtchDoc } from '@/types/bd'

// 첨부서류(dl_docList) 목업 — 설계서 slide292 Layout(첨부서류명 + 첨부파일명.hwp [파일크기]) 기반.
const MOCK_DOC_LIST: OvsAtchDoc[] = [
  { no: 1, atchDocNm: '입찰공고문', atchFileNm: '입찰공고문(EFD0007-2).hwp', fileSz: '786KB' },
  { no: 2, atchDocNm: '입찰유의서', atchFileNm: '국외입찰유의서.hwp', fileSz: '1.2MB' },
  { no: 3, atchDocNm: '계약특수조건', atchFileNm: '계약특수조건(500MD부품).pdf', fileSz: '2.4MB' },
]

export function OvsBidPbancDtl2() {
  return (
    <>
      {/* 타이틀 + 건수 — Figma m_section title(9973-131169) 우측 건수 슬롯(총 N건). 배경은 흰색(사용자 확정 — info 기본 블루 강조 제거) */}
      <SectionTitle topDivider info={`총 ${MOCK_DOC_LIST.length}건`} className="bg-white">
        첨부서류
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4 pt-2 pb-4">
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
