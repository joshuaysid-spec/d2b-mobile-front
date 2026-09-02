// 해지/해제 공사계약 상세 - '첨부서류' 탭 콘텐츠 (MUI-CT-03-T14). 설계서 slide142·143.
// 해지해제 첨부서류/계약업체 첨부서류 2섹션(각 총 N건) — 계약서류명 라벨 + 파일행(파일명 [크기] + 다운로드).
// 파일 크기·파일명 없으면 '-' 표시(slide142). 데이터: ctQueries.useSelectCstrnCncltnRmvAdocs(CtrtAdocResult 재사용).
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — 물품 T04(CmdtyElctrCtrtPrgrsDtl_Adoc) 패턴 복제.
import { useState } from 'react'

import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import type { MockCtrtAdocFile } from '@/types/mock/ct'

// 다운로드 핸들러는 부모(탭)가 소유(훅·토스트 1벌 공유) → 이 컴포넌트는 표시 전용.
function AdocItem({ doc, onDownload }: { doc: MockCtrtAdocFile; onDownload: (doc: MockCtrtAdocFile) => void }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <p className="text-krds-body-md font-bold text-krds-text-ink">{doc.ctrtAdocCd}</p>
      <FileDownloadList
        files={[
          {
            id: doc.id,
            name: doc.fileNm || '-',
            size: doc.fileSize ?? '-',
            onDownload: () => onDownload(doc),
          },
        ]}
      />
    </div>
  )
}

export function CstrnCtrtCncltnRmvDtl_Adoc({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCstrnCncltnRmvAdocs(id)
  const refDocs = data?.refDocs ?? []
  const sbmsnDocs = data?.sbmsnDocs ?? []

  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패/안내 토스트(null=닫힘)

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내(slide142 5]).
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (doc: MockCtrtAdocFile) => {
    if (!doc.fileNm || doc.fileNm === '-') {
      setToast('첨부된 파일이 없습니다.')
      return
    }
    try {
      saveBlob(await downloadFile.mutateAsync(doc.id), doc.fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 해지해제 첨부서류 — 첨부 파일이 있는 경우에만 목록 노출(slide142) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${refDocs.length}건`}>
          해지해제 첨부서류
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {refDocs.map((doc) => (
            <AdocItem key={doc.id} doc={doc} onDownload={handleDownload} />
          ))}
        </div>
      </section>

      {/* 계약업체 첨부서류 — 표시 상동(slide142) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${sbmsnDocs.length}건`}>
          계약업체 첨부서류
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {sbmsnDocs.map((doc) => (
            <AdocItem key={doc.id} doc={doc} onDownload={handleDownload} />
          ))}
        </div>
      </section>

      {/* 다운로드 실패/안내 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </div>
  )
}
CstrnCtrtCncltnRmvDtl_Adoc.displayName = 'CstrnCtrtCncltnRmvDtl_Adoc'
