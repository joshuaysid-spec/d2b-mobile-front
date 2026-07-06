// 사전규격 상세 - '첨부파일' 탭 콘텐츠 (MUI-OP-01-M09_첨부서류, Figma 9300-42569).
// 제목(PageTitle) + 섹션 2개(집행계획 첨부파일 / 조달판단 첨부파일) — 각 섹션 = SectionTitle(제목 + 총건수 info slot)
//   + FileDownloadList(파일 행 — 개별 다운로드만, 일괄 다운로드 버튼 없음). 데이터는 목업 — 추후 API.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
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

export function BfhdSpcfctDtl_Doc() {
  return (
    // pb 는 우하단 FAB(48px + bottom 10px) 가 마지막 다운로드 버튼을 가리지 않도록 그만큼 비워둠.
    <div className="flex flex-col gap-8 pb-[72px]">

      {/* 집행계획 첨부파일 */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${EXEC_FILES.length}건`}>
          집행계획 첨부파일
        </SectionTitle>
        <div className="px-4">
          <FileDownloadList files={EXEC_FILES} />
        </div>
      </section>

      {/* 조달판단 첨부파일 */}
      <section className="flex flex-col gap-krds-7">
        <SectionTitle as="h3" topDivider info={`총 ${JUDGE_FILES.length}건`}>
          조달판단 첨부파일
        </SectionTitle>
        <div className="px-4">
          <FileDownloadList files={JUDGE_FILES} />
        </div>
      </section>
    </div>
  )
}
BfhdSpcfctDtl_Doc.displayName = 'BfhdSpcfctDtl_Doc'
