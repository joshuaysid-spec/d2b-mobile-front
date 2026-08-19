// 해지/해제 공사계약 상세 - '첨부서류' 탭 콘텐츠 (MUI-CT-03-T14). 설계서 slide142·143.
// 해지해제 첨부서류/계약업체 첨부서류 2섹션(각 총 N건) — 계약서류명 라벨 + 파일행(파일명 [크기] + 다운로드).
// 파일 크기·파일명 없으면 '-' 표시(slide142). 데이터: ctQueries.useSelectCstrnCncltnRmvAdocs(CtrtAdocResult 재사용).
import { ctQueries } from '@/queries/bds/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { CtrtAdocFile } from '@/types/ct'

function AdocItem({ doc }: { doc: CtrtAdocFile }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <p className="text-krds-body-md font-bold text-krds-text-ink">{doc.ctrtAdocCd}</p>
      <FileDownloadList
        files={[
          {
            id: doc.id,
            name: doc.fileNm || '-',
            size: doc.fileSize ?? '-',
            // 추후 API: fileService 다운로드 연동 + 성공/실패 토스트(slide142 5]).
            onDownload: () => console.log('[CT-03-T14] 다운로드:', doc.ctrtAdocCd, doc.fileNm),
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

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 해지해제 첨부서류 — 첨부 파일이 있는 경우에만 목록 노출(slide142) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${refDocs.length}건`}>
          해지해제 첨부서류
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {refDocs.map((doc) => (
            <AdocItem key={doc.id} doc={doc} />
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
            <AdocItem key={doc.id} doc={doc} />
          ))}
        </div>
      </section>
    </div>
  )
}
CstrnCtrtCncltnRmvDtl_Adoc.displayName = 'CstrnCtrtCncltnRmvDtl_Adoc'
