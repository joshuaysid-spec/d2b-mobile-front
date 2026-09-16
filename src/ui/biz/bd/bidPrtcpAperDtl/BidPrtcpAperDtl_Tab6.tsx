// 입찰진행상세 - 입찰참가신청조회 파일첨부 (MUI-BD-04-T06, 설계서 영문ID BidPrtcpAperDtl_Tab6 · slide188).
// 호스트 페이지(BidPrtcpAperDtlPage)의 '6. 파일첨부' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 조회판이라 작성판(M12)의 업로드/삭제(파일 추가·X 버튼)가 없고 제출된 첨부파일 다운로드만 제공한다.

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { showToast } from '@/stores/authStore'

// 첨부서류 안내사항(설계서 slide188).
const NOTICES = [
  '대표 및 등기임원의 청렴서약서를 반드시 첨부하시기 바랍니다.',
  '법인등기부등본(등기사항 전부증명서)을 반드시 첨부하시기 바랍니다.',
  '건당 크기 10MB 미만 파일만 첨부가능합니다.',
  '스캔 파일은 파일압축해서 업로드 부탁드립니다.',
  '규격입찰서 관련 전자파일은 입찰서 작성 시 제출해 주시기 바랍니다.',
]

// 제출된 입찰서 첨부파일 목업 — 설계서 slide188 첨부서류명 형식 그대로.
const ATTACHED_FILES: FileDownloadItem[] = [
  { id: 'a1', name: '청렴서약서.hwp', size: '512KB' },
  { id: 'a2', name: '법인등기부등본.pdf', size: '1.2MB' },
]

export function BidPrtcpAperDtl_Tab6() {
  const downloadFile = fbQueries.useDownloadFile()

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      showToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <>
      <SectionTitle as="h3" topDivider info={`총 ${ATTACHED_FILES.length}건`} className="bg-white">
        입찰서 첨부파일
      </SectionTitle>
      <div className="px-4 py-4">
        {/* 일괄 다운로드 버튼 미노출 — onDownloadAll 미주입(개별 다운로드만) */}
        <FileDownloadList
          files={ATTACHED_FILES.map((f) => ({
            ...f,
            onDownload: () => handleDownload(String(f.id), f.name),
          }))}
        />
      </div>

      {/* 안내사항 — 탭 최하단 고정(전 탭 공통) */}
      <Infobox title="안내사항" items={NOTICES} />
    </>
  )
}
BidPrtcpAperDtl_Tab6.displayName = 'BidPrtcpAperDtl_Tab6'
