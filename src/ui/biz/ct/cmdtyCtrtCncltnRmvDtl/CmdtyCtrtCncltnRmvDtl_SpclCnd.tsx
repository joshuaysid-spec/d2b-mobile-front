// 해지/해제 물품일반계약 상세 - '해지해제 정보' 탭 콘텐츠 (MUI-CT-03-T03). 설계서 slide111·113.
// 화면목록(slide10)상 명칭은 '특수조건'이나, 레이아웃(slide111)은 해지해제 통보내용 + 참조서류(다운로드).
// 데이터: ctQueries.useSelectCmdtyCncltnRmvNoti — 목업/실연동은 ctService(USE_MOCK)가 전환.
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — 물품 T04(CmdtyElctrCtrtPrgrsDtl_Adoc) 패턴 복제.
import { useState } from 'react'

import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import type { MockCncltnRmvNoti, MockCtrtAdocFile } from '@/types/mock/ct'

// 통보내용 1건 → 표 행(slide113 1.5).
function notiRows(n: MockCncltnRmvNoti): TableRow[] {
  return [
    { label: '통보차수', value: n.ctrtCycl },
    { label: '통지일시', value: n.ctrtPrgrsSttsDt },
    { label: '통보메일내용', value: n.rjctRsn },
  ]
}

// 참조서류 1건 — 계약서류명 라벨 + 파일 행(FileDownloadList 단건).
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

export function CmdtyCtrtCncltnRmvDtl_SpclCnd({ id }: { id: string }) {
  const { data } = ctQueries.useSelectCmdtyCncltnRmvNoti(id)
  const notis = data?.notis ?? []
  const adocs = data?.adocs ?? []

  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패/안내 토스트(null=닫힘)

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내(slide111 5]).
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
CmdtyCtrtCncltnRmvDtl_SpclCnd.displayName = 'CmdtyCtrtCncltnRmvDtl_SpclCnd'
