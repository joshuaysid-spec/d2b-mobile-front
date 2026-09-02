// 공개수의협상계획상세 - '첨부서류' 탭 (MUI-BD-12-T73(구 M73 — v1.83 재편), 설계서 02입찰 slide414).
// 첨부파일 목록(구분별) — 공고문안/일반조건/특수조건/기타첨부. FileDownloadList(다운로드).
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import type { MockOvsRlsVltrnsAtchDoc } from '@/types/mock/bd'

// 첨부파일 목업 — 설계서 slide414(구분·첨부파일명). 추후 bdService.selectOvsRlsVltrnsAtchDocs 매핑.
const MOCK_DOCS: MockOvsRlsVltrnsAtchDoc[] = [
  { id: 'atc-1', docSeNm: '공고문안', fileNm: '첨부파일명.hwp', fileSz: '786KB' },
  { id: 'atc-2', docSeNm: '일반조건', fileNm: '첨부파일명.hwp', fileSz: '1.2MB' },
  { id: 'atc-3', docSeNm: '특수조건', fileNm: '첨부파일명.hwp', fileSz: '540KB' },
  { id: 'atc-4', docSeNm: '기타첨부', fileNm: '첨부파일명.hwp', fileSz: '320KB' },
]

export function OvsRlsVltrnsNgtnPlanDtl3() {
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

  // 구분(공고문안 등) + 첨부파일명 을 함께 표시(설계서 첨부서류명 컬럼).
  const files: FileDownloadItem[] = MOCK_DOCS.map((d) => ({
    id: d.id,
    name: `${d.docSeNm} · ${d.fileNm}`,
    size: d.fileSz,
    onDownload: () => handleDownload(d.id, d.fileNm),
  }))

  return (
    <>
      <Accordion type="multiple" defaultValue={['file']} className="w-full">
        <AccordionSection value="file" title={`첨부파일 (총 ${MOCK_DOCS.length}건)`} borderTop={false}>
          <FileDownloadList files={files} />
        </AccordionSection>
      </Accordion>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </>
  )
}
OvsRlsVltrnsNgtnPlanDtl3.displayName = 'OvsRlsVltrnsNgtnPlanDtl3'
