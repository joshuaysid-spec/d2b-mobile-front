// 대금청구상세(기성대가) - '첨부파일' 탭 콘텐츠 (MUI-WM-01-T19). 설계서 slide66~68 — T12/T15 와 동일 구성.
// TODO(파일 다운로드 배선): 문서 GUID 확정 시 useDownloadFile 훅 연결(현재 콘솔 스텁).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { WmAdocItem } from '@/types/mock/wm'

export interface PxcndCstPymtClmDtl_AtchProps {
  adocs: WmAdocItem[]
}

export function PxcndCstPymtClmDtl_Atch({ adocs }: PxcndCstPymtClmDtl_AtchProps) {
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
                onDownload: () => console.log('[T19] 첨부파일 다운로드(미배선)', adoc.fileNm),
              },
            ]}
          />
        </AccordionSection>
      ))}
    </Accordion>
  )
}
PxcndCstPymtClmDtl_Atch.displayName = 'PxcndCstPymtClmDtl_Atch'
