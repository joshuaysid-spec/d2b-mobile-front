// 국외전자계약진행상세 - '첨부서류' 탭 콘텐츠 (MUI-CT-01-T76 ovsElctrCtrtPrgrsDtlTab_Adoc).
// 설계서 slide167~169 — 국내(T04)와 동일한 첨부서류 화면 + 직인등록정보(dl_ofslReg) 추가.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Table } from '@/ui/common/composites/Table'

// 첨부서류 1건 — 계약서류명 라벨 + 파일 행(국내 T04와 동일 구성).
function AdocItem({
  doc,
}: {
  doc: { id: string; ctrtDcmntNm: string; ctrtDcmntFile: string; fileSize?: string }
}) {
  return (
    <div className="flex flex-col gap-krds-5">
      <p className="text-krds-body-md font-bold text-krds-text-ink">{doc.ctrtDcmntNm}</p>
      <FileDownloadList
        files={[
          {
            id: doc.id,
            name: doc.ctrtDcmntFile || '-',
            size: doc.fileSize ?? '-',
            // 추후 API: fbService 다운로드 연동 + 실패 토스트(slide167).
            onDownload: () =>
              console.log('[CT-01-T76] 다운로드:', doc.ctrtDcmntNm, doc.ctrtDcmntFile),
          },
        ]}
      />
    </div>
  )
}

export function OvsElctrCtrtPrgrsDtlTab_Adoc({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCtrtDcmntList(id)
  const refDocs = data?.refDocs ?? []
  const sbmsnDocs = data?.sbmsnDocs ?? []
  const ofslRegs = data?.ofslRegs ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 계약관 첨부서류(dl_ctrtRfrncDcmnt) */}
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

      {/* 계약업체 첨부서류(dl_ctrtSbmsnDcmnt) */}
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

      {/* 직인등록정보(dl_ofslReg) — 국외 전용 추가 섹션(slide167 직인등록사항) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          직인등록정보
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {ofslRegs.map((o) => (
            <Table
              key={o.id}
              rows={[
                { label: '업체', value: o.bzentyNm },
                { label: '직인파일명', value: o.ofslFileNm },
                { label: '직인파일등록여부', value: o.ofslFileRegYn },
              ]}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
OvsElctrCtrtPrgrsDtlTab_Adoc.displayName = 'OvsElctrCtrtPrgrsDtlTab_Adoc'
