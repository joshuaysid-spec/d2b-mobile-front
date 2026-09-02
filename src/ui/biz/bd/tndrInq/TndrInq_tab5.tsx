// 입찰진행상세 - 입찰서(견적서)조회 파일첨부 (MUI-BD-06-T05, 설계서 영문ID TndrInq_tab5 · 02입찰 v1.88 slide176).
// 호스트 페이지(TndrInqPage)의 '5. 파일첨부' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 조회판이라 작성판(M05)의 '파일 추가'·삭제(X)·파일첨부 방식 선택 시트가 없고 제출된 첨부파일 다운로드만 제공한다.
// 행 구성(설계서 slide176): 첨부서류명 + 항목번호 + 첨부파일 칩. 서류항목은 작성판(TndrWrt_Stp5)과 동일 4종.
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'

// 제출된 입찰서 첨부파일 목업 — 설계서 slide176 첨부서류명/항목번호 형식 그대로.
// 항목명(영문)은 작성판 데이터영역(dlt_tndrAtchFileList, slide134) 그대로: adocNm·fileNm·fileSz.
const ATTACHED_FILES = [
  { id: 'atch1', clsfNo: '1', adocNm: '규격제안서', fileNm: '첨부파일명.hwp', fileSz: '786KB' },
  { id: 'atch2', clsfNo: '2', adocNm: '공종별 산출내역서', fileNm: '첨부파일명.hwp', fileSz: '786KB' },
  { id: 'atch3', clsfNo: '3', adocNm: '자기평가기술서', fileNm: '첨부파일명.hwp', fileSz: '786KB' },
  { id: 'atch4', clsfNo: '4', adocNm: '기타참조서류', fileNm: '첨부파일명.hwp', fileSz: '786KB' },
]

export function TndrInq_tab5() {
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

  return (
    <>
      <SectionTitle as="h3" topDivider info={`총 ${ATTACHED_FILES.length}건`} className="bg-white">
        입찰서 첨부파일
      </SectionTitle>

      <div className="flex flex-col gap-krds-8 px-4 py-4">
        {ATTACHED_FILES.map((file) => (
          <div key={file.id} className="flex flex-col gap-krds-3">
            <div className="flex items-center justify-between gap-krds-3">
              <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                {file.adocNm}
              </span>
              <span className="shrink-0 text-[17px] leading-normal text-krds-text-muted">
                {file.clsfNo}
              </span>
            </div>
            {/* 개별 다운로드만 — onDownloadAll 미주입(일괄 다운로드 버튼 숨김) */}
            <FileDownloadList
              files={[
                {
                  id: file.id,
                  name: file.fileNm,
                  size: file.fileSz,
                  onDownload: () => handleDownload(file.id, file.fileNm),
                },
              ]}
            />
          </div>
        ))}
      </div>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </>
  )
}
TndrInq_tab5.displayName = 'TndrInq_tab5'
