// 조달계획 상세 - '첨부파일' 탭 콘텐츠 (MUI-OP-01-M09_첨부서류, Figma 9300-42569).
// 제목(PageTitle) + 섹션 2개(집행계획 첨부파일 / 조달판단 첨부파일) — 각 섹션 = 헤더(제목 + 총건수)
//   + FileDownloadList(파일 행 + 일괄 다운로드). 데이터는 목업 — 추후 API.
import { PageTitle } from '@/ui/common/base/PageTitle'
import {
  FileDownloadList,
  type FileDownloadItem,
} from '@/ui/common/composites/FileDownloadList'

const EXEC_FILES: FileDownloadItem[] = [
  { id: 'exec-1', name: '첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[M09] 다운로드: 집행계획 1') },
  { id: 'exec-2', name: '첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[M09] 다운로드: 집행계획 2') },
]
const JUDGE_FILES: FileDownloadItem[] = [
  { id: 'judge-1', name: '첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[M09] 다운로드: 조달판단 1') },
  { id: 'judge-2', name: '첨부파일명.hwp', size: '786KB', onDownload: () => console.log('[M09] 다운로드: 조달판단 2') },
]

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-krds-5">
      <span className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</span>
      <span className="shrink-0 text-[17px] leading-normal text-krds-text-muted">
        총 {count}건
      </span>
    </div>
  )
}

export function Attachment() {
  return (
    <div className="flex flex-col gap-8 pb-6">
      <PageTitle as="h2">첨부파일</PageTitle>

      {/* 집행계획 첨부파일 */}
      <section className="flex flex-col gap-krds-7 px-4">
        <SectionHeader title="집행계획 첨부파일" count={EXEC_FILES.length} />
        <FileDownloadList
          files={EXEC_FILES}
          onDownloadAll={() => console.log('[M09] 집행계획 일괄 다운로드')}
        />
      </section>

      {/* 조달판단 첨부파일 */}
      <section className="flex flex-col gap-krds-7 px-4">
        <SectionHeader title="조달판단 첨부파일" count={JUDGE_FILES.length} />
        <FileDownloadList
          files={JUDGE_FILES}
          onDownloadAll={() => console.log('[M09] 조달판단 일괄 다운로드')}
        />
      </section>
    </div>
  )
}
Attachment.displayName = 'Attachment'
