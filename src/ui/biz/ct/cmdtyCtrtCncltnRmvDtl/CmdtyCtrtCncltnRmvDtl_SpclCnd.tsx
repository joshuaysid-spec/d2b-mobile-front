// 해지/해제 물품일반계약 상세 - '해지해제 정보' 탭 콘텐츠 (MUI-CT-03-T03). 설계서 slide111·113.
// 화면목록(slide10)상 명칭은 '특수조건'이나, 레이아웃(slide111)은 해지해제 통보내용 + 참조서류(다운로드).
// 데이터: ctQueries.useSelectCmdtyCncltnRmvNoti — 목업/실연동은 ctService(USE_MOCK)가 전환.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { CncltnRmvNoti, CtrtAdocFile } from '@/types/ct'

// 통보내용 1건 → 표 행(slide113 1.5).
function notiRows(n: CncltnRmvNoti): TableRow[] {
  return [
    { label: '통보차수', value: n.ctrtCycl },
    { label: '통지일시', value: n.ctrtPrgrsSttsDt },
    { label: '통보메일내용', value: n.rjctRsn },
  ]
}

// 참조서류 1건 — 계약서류명 라벨 + 파일 행(FileDownloadList 단건).
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
            // 추후 API: fbService 다운로드 연동 + 성공/실패 토스트(slide111 5]).
            onDownload: () => console.log('[CT-03-T03] 다운로드:', doc.ctrtAdocCd, doc.fileNm),
          },
        ]}
      />
    </div>
  )
}

export function CmdtyCtrtCncltnRmvDtl_SpclCnd({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCmdtyCncltnRmvNoti(id)
  const notis = data?.notis ?? []
  const adocs = data?.adocs ?? []

  return (
    <div className="flex flex-col gap-8 pb-[72px]">
      {/* 해지해제 통보내용 (slide111) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider>
          해지해제 통보내용
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {notis.map((n) => (
            <Table key={n.id} rows={notiRows(n)} />
          ))}
        </div>
      </section>

      {/* 해지해제 첨부서류 — 첨부 파일이 있는 경우에만 목록 노출(slide111) */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${adocs.length}건`}>
          해지해제 첨부서류
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4">
          {adocs.map((doc) => (
            <AdocItem key={doc.id} doc={doc} />
          ))}
        </div>
      </section>
    </div>
  )
}
CmdtyCtrtCncltnRmvDtl_SpclCnd.displayName = 'CmdtyCtrtCncltnRmvDtl_SpclCnd'
