// 국외전자계약진행상세 - '첨부서류' 탭 콘텐츠 (MUI-CT-01-T76 ovsElctrCtrtPrgrsDtlTab_Adoc).
// 설계서 slide167~169 — 국내(T04)와 동일한 첨부서류 화면 + 직인등록정보(dl_ofslReg) 추가.
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — 국내 T04(CmdtyElctrCtrtPrgrsDtl_Adoc) 패턴 복제.

import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Table } from '@/ui/common/composites/Table'
import { showToast } from '@/stores/authStore'

type OvsAdocDoc = { id: string; ctrtDcmntNm: string; ctrtDcmntFile: string; fileSize?: string }

// 첨부서류 1건 — 계약서류명 라벨 + 파일 행(국내 T04와 동일 구성).
// 다운로드 핸들러는 부모(탭)가 소유(훅·토스트 1벌 공유) → 이 컴포넌트는 표시 전용.
function AdocItem({ doc, onDownload }: { doc: OvsAdocDoc; onDownload: (doc: OvsAdocDoc) => void }) {
  return (
    <div className="flex flex-col gap-krds-5">
      <p className="text-krds-body-md font-bold text-krds-text-ink">{doc.ctrtDcmntNm}</p>
      <FileDownloadList
        files={[
          {
            id: doc.id,
            name: doc.ctrtDcmntFile || '-',
            size: doc.fileSize ?? '-',
            onDownload: () => onDownload(doc),
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

  const downloadFile = fbQueries.useDownloadFile()

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내(slide167).
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (doc: OvsAdocDoc) => {
    if (!doc.ctrtDcmntFile || doc.ctrtDcmntFile === '-') {
      showToast('첨부된 파일이 없습니다.')
      return
    }
    try {
      saveBlob(await downloadFile.mutateAsync(doc.id), doc.ctrtDcmntFile)
    } catch {
      showToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 계약관 첨부서류(dl_ctrtRfrncDcmnt) */}
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

      {/* 계약업체 첨부서류(dl_ctrtSbmsnDcmnt) */}
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
