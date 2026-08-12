// 물품전자계약진행상세 - '첨부서류' 탭 콘텐츠 (MUI-CT-01-T04, Figma 10020-154807/154870). 설계서 slide27·30.
// 계약관 첨부서류/계약업체 첨부서류 2섹션(각 총 N건) — 항목: 계약서류명 라벨 + 파일행(파일명 [크기] + 다운로드).
// 파일 크기·파일명 없으면 '-' 표시(slide27).
//
// 다운로드 배선(260730, 첨부서류 탭 시범 — 타 탭도 이 패턴 복제):
//   행 클릭 → useDownloadFile.mutateAsync(키) 로 Blob 수신 → utils/download.saveBlob 으로 저장 트리거.
//   실패 시 Toast 안내(slide27 4] 다운로드 실패 안내). 파일명 없는 행(fileNm '-')은 안내만.
import { useState } from 'react'

import { useCtrtAdocs } from '@/queries/ct'
import { useDownloadFile } from '@/queries/file'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import type { CtrtAdocFile } from '@/types/ct'

// 첨부서류 1건 — 계약서류명 라벨(Figma file label) + 파일 행(FileDownloadList 단건).
// 다운로드 핸들러는 부모(탭)가 소유(훅·토스트 1벌 공유) → 이 컴포넌트는 표시 전용.
function AdocItem({ doc, onDownload }: { doc: CtrtAdocFile; onDownload: (doc: CtrtAdocFile) => void }) {
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

export function CmdtyElctrCtrtPrgrsDtl_Adoc({ id }: { id: string }) {
  const { data } = useCtrtAdocs(id)
  const refDocs = data?.refDocs ?? []
  const sbmsnDocs = data?.sbmsnDocs ?? []

  const downloadFile = useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패/안내 토스트(null=닫힘)

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내.
  // ⚠️ CtrtAdocFile 에 파일 GUID 필드가 아직 없어 임시로 행 id 를 키로 사용 —
  //    백엔드 응답 확정 시 guid 필드 추가 후 교체(types/ct.ts TODO 섹션 참조).
  const handleDownload = async (doc: CtrtAdocFile) => {
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
      {/* 계약관 첨부서류(계약참조서류) — 첨부 파일이 있는 경우에만 목록 노출(slide27 1]) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${refDocs.length}건`}>
          계약관 첨부서류
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {refDocs.map((doc) => (
            <AdocItem key={doc.id} doc={doc} onDownload={handleDownload} />
          ))}
        </div>
      </section>

      {/* 계약업체 첨부서류(계약제출서류) — 표시 상동(slide27 5]) */}
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
CmdtyElctrCtrtPrgrsDtl_Adoc.displayName = 'CmdtyElctrCtrtPrgrsDtl_Adoc'
