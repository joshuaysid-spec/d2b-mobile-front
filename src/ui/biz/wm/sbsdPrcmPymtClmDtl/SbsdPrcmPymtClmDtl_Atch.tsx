// 대금청구상세(부대조달) - '첨부파일' 탭 콘텐츠 (MUI-WM-01-T12). 설계서 slide51, 53.
// 첨부서류명별 아코디언 + FileDownloadList — 첨부된 파일이 있는 경우에만 목록 노출(slide51).
// TODO(파일 다운로드 배선): 문서 GUID 확정 시 useDownloadFile 훅 연결(현재 콘솔 스텁).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { MockWmAdocItem } from '@/types/mock/wm'

export interface SbsdPrcmPymtClmDtl_AtchProps {
  adocs: MockWmAdocItem[]
}

export function SbsdPrcmPymtClmDtl_Atch({ adocs }: SbsdPrcmPymtClmDtl_AtchProps) {
  if (adocs.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-krds-body-md text-krds-text-subtle">
        첨부된 파일이 없습니다.
      </p>
    )
  }

  return (
    <Accordion type="multiple" defaultValue={adocs.map((a) => a.id)} className="w-full">
      {adocs.map((adoc, i) => (
        <AccordionSection key={adoc.id} value={adoc.id} title={adoc.docNm} borderTop={i > 0}>
          <FileDownloadList
            files={[
              {
                id: adoc.id,
                name: adoc.fileNm || '-',
                size: adoc.fileSize !== '-' ? adoc.fileSize : undefined,
                onDownload: () => console.log('[T12] 첨부파일 다운로드(미배선)', adoc.fileNm),
              },
            ]}
          />
        </AccordionSection>
      ))}
    </Accordion>
  )
}
SbsdPrcmPymtClmDtl_Atch.displayName = 'SbsdPrcmPymtClmDtl_Atch'
