// 대금청구상세(부대조달) - '첨부파일' 탭 콘텐츠 (MUI-WM-01-T12). 설계서 slide51, 53.
// 첨부서류명별 아코디언 + FileDownloadList — 첨부된 파일이 있는 경우에만 목록 노출(slide51).
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import type { MockWmAdocItem } from '@/types/mock/wm'

export interface SbsdPrcmPymtClmDtl_AtchProps {
  adocs: MockWmAdocItem[]
}

export function SbsdPrcmPymtClmDtl_Atch({ adocs }: SbsdPrcmPymtClmDtl_AtchProps) {
  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패/안내 토스트(null=닫힘)

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (adoc: MockWmAdocItem) => {
    if (!adoc.fileNm || adoc.fileNm === '-') {
      setToast('첨부된 파일이 없습니다.')
      return
    }
    try {
      saveBlob(await downloadFile.mutateAsync(adoc.id), adoc.fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  if (adocs.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-krds-body-md text-krds-text-subtle">
        첨부된 파일이 없습니다.
      </p>
    )
  }

  return (
    <>
      <Accordion type="multiple" defaultValue={adocs.map((a) => a.id)} className="w-full">
        {adocs.map((adoc, i) => (
          <AccordionSection key={adoc.id} value={adoc.id} title={adoc.docNm} borderTop={i > 0}>
            <FileDownloadList
              files={[
                {
                  id: adoc.id,
                  name: adoc.fileNm || '-',
                  size: adoc.fileSize !== '-' ? adoc.fileSize : undefined,
                  onDownload: () => handleDownload(adoc),
                },
              ]}
            />
          </AccordionSection>
        ))}
      </Accordion>

      {/* 다운로드 실패/안내 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </>
  )
}
SbsdPrcmPymtClmDtl_Atch.displayName = 'SbsdPrcmPymtClmDtl_Atch'
