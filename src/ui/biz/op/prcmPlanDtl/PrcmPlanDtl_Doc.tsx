// 조달계획 상세 - '첨부파일' 탭 콘텐츠 (MUI-OP-01-M09_첨부서류, Figma 9300-42569).
// 제목(PageTitle) + 섹션 2개(집행계획 첨부파일 / 조달판단 첨부파일) — 각 섹션 = SectionTitle(제목 + 총건수 info slot)
//   + FileDownloadList(파일 행 — 개별 다운로드만, 일괄 다운로드 버튼 없음). 데이터는 목업 — 추후 API.
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import {
  FileDownloadList,
  type FileDownloadItem,
} from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'

const EXEC_FILES: FileDownloadItem[] = [
  { id: 'exec-1', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'exec-2', name: '첨부파일명.hwp', size: '786KB' },
]
const JUDGE_FILES: FileDownloadItem[] = [
  { id: 'judge-1', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'judge-2', name: '첨부파일명.hwp', size: '786KB' },
]

export function PrcmPlanDtl_Doc() {
  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const withDownload = (files: FileDownloadItem[]) =>
    files.map((f) => ({ ...f, onDownload: () => handleDownload(String(f.id), f.name) }))

  return (
    // pb 는 우하단 FAB(48px + bottom 10px) 가 마지막 다운로드 버튼을 가리지 않도록 그만큼 비워둠.
    <div className="flex flex-col gap-8 pb-[72px]">

      {/* 집행계획 첨부파일 */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${EXEC_FILES.length}건`}>
          집행계획 첨부파일
        </SectionTitle>
        <div className="px-4">
          <FileDownloadList files={withDownload(EXEC_FILES)} />
        </div>
      </section>

      {/* 조달판단 첨부파일 */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${JUDGE_FILES.length}건`}>
          조달판단 첨부파일
        </SectionTitle>
        <div className="px-4">
          <FileDownloadList files={withDownload(JUDGE_FILES)} />
        </div>
      </section>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </div>
  )
}
PrcmPlanDtl_Doc.displayName = 'PrcmPlanDtl_Doc'
