// 공사전자계약진행상세 - '첨부서류' 탭 콘텐츠 (MUI-CT-01-T12). 설계서 slide42(= 국내 M03 slide27 동일 구조).
// 계약관 첨부서류/계약업체 첨부서류 2섹션(각 총 N건) — 항목: 계약서류명 라벨 + 파일행(파일명 [크기] + 다운로드).
// 파일 크기·파일명 없으면 '-' 표시(slide42). 다운로드 실패/성공 토스트는 실연동 시 — 현재 console.log 경계 스텁.
// 데이터영역이 M03 첨부서류(_Adoc)와 동일하여 동일 데이터 훅(useCtrtAdocs)으로 구동.
import { useCtrtAdocs } from '@/queries/ct'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { CtrtAdocFile } from '@/types/ct'

// 첨부서류 1건 — 계약서류명 라벨 + 파일 행(FileDownloadList 단건).
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
            // 추후 API: fileService 다운로드 연동 + 성공/실패 토스트(slide42 4]).
            onDownload: () => console.log('[CT-01-T12] 다운로드:', doc.ctrtAdocCd, doc.fileNm),
          },
        ]}
      />
    </div>
  )
}

export function CstrnElctrCtrtPrgrsDtl_Adoc({ id }: { id: string }) {
  const { data } = useCtrtAdocs(id)
  const refDocs = data?.refDocs ?? []
  const sbmsnDocs = data?.sbmsnDocs ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 계약관 첨부서류(계약참조서류) — 첨부 파일이 있는 경우에만 목록 노출(slide42 1]) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${refDocs.length}건`}>
          계약관 첨부서류
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {refDocs.map((doc) => (
            <AdocItem key={doc.id} doc={doc} />
          ))}
        </div>
      </section>

      {/* 계약업체 첨부서류(계약제출서류) — 표시 상동(slide42 5]) */}
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
CstrnElctrCtrtPrgrsDtl_Adoc.displayName = 'CstrnElctrCtrtPrgrsDtl_Adoc'
