// 공개수의협상계획상세 - '첨부서류' 탭 (MUI-BD-12-T73(구 M73 — v1.83 재편), 설계서 02입찰 slide414).
// 첨부파일 목록(구분별) — 공고문안/일반조건/특수조건/기타첨부. FileDownloadList(다운로드).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import type { OvsRlsVltrnsAtchDoc } from '@/types/bd'

// 첨부파일 목업 — 설계서 slide414(구분·첨부파일명). 추후 bdService.getOvsRlsVltrnsAtchDocs 매핑.
const MOCK_DOCS: OvsRlsVltrnsAtchDoc[] = [
  { id: 'atc-1', docSeNm: '공고문안', fileNm: '첨부파일명.hwp', fileSz: '786KB' },
  { id: 'atc-2', docSeNm: '일반조건', fileNm: '첨부파일명.hwp', fileSz: '1.2MB' },
  { id: 'atc-3', docSeNm: '특수조건', fileNm: '첨부파일명.hwp', fileSz: '540KB' },
  { id: 'atc-4', docSeNm: '기타첨부', fileNm: '첨부파일명.hwp', fileSz: '320KB' },
]

export function OvsRlsVltrnsNgtnPlanDtl3() {
  // 구분(공고문안 등) + 첨부파일명 을 함께 표시(설계서 첨부서류명 컬럼). 다운로드 스텁.
  const files: FileDownloadItem[] = MOCK_DOCS.map((d) => ({
    id: d.id,
    name: `${d.docSeNm} · ${d.fileNm}`,
    size: d.fileSz,
    onDownload: () => console.log('[M73] 첨부파일 다운로드', d.id),
  }))

  return (
    <Accordion type="multiple" defaultValue={['file']} className="w-full">
      <AccordionSection value="file" title={`첨부파일 (총 ${MOCK_DOCS.length}건)`} borderTop={false}>
        <FileDownloadList files={files} />
      </AccordionSection>
    </Accordion>
  )
}
OvsRlsVltrnsNgtnPlanDtl3.displayName = 'OvsRlsVltrnsNgtnPlanDtl3'
