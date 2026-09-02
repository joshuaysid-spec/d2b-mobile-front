// 첨부파일조회 (MUI-BD-01-P76, 국외 설계서(v1.82_국외) slide15 — 2026-07-06 신규 추가 화면).
// 국외 입찰공고 상세 '품목 목록' 탭에서 첨부문서 O 인 품목의 [보기] 클릭 시 바텀시트로 표시되는 콘텐츠.
// 컨테이너(BottomSheet)/footer(닫기)는 부모(OvsBidPbancDtl)가 소유 — 이 컴포넌트는 콘텐츠 전용(*Sheet 래퍼 금지 규칙).
// 시트 본문이 좌우 패딩(px-16)을 제공하므로 자체 좌우 패딩을 두지 않는다(2중 패딩 금지).
// 구성(설계서 Layout): "첨부서류 - 총 N건" + 순번·첨부서류명 + 첨부파일명.hwp [파일크기] + 다운로드.
// 파일명 클릭 = 뷰어 솔루션 호출(추후 연동).
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제. 키 = fileId.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import { formatFileSize } from '@/utils/format'
import type { MockOvsAtchDoc } from '@/types/mock/bd'

interface OvsBidPbanc_AtchFileInqProps {
  /** 선택된 품목의 첨부서류 목록 (dl_docList 형태) */
  docs: MockOvsAtchDoc[]
}

export function OvsBidPbanc_AtchFileInq({ docs }: OvsBidPbanc_AtchFileInqProps) {
  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 — fileId(GUID) 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex flex-col gap-krds-3 pb-2">
      {/* 타이틀 + 건수 — 시트 좌우 패딩과 겹치지 않게 px-0, 배경 흰색(사용자 확정) */}
      <SectionTitle info={`총 ${docs.length}건`} className="bg-white px-0">
        첨부서류
      </SectionTitle>
      <div className="flex flex-col gap-krds-7">
        {docs.map((doc, i) => (
          <div key={doc.fileId} className="flex flex-col gap-krds-3">
            {/* 순번 · 첨부서류명(docTitl) */}
            <p className="text-krds-body-sm font-medium text-krds-text-muted">
              {i + 1}. {doc.docTitl}
            </p>
            {/* 첨부파일명(fileNm) [파일크기(fileSz)] + 다운로드 */}
            <FileDownloadList
              files={[
                {
                  id: `p76-${doc.fileId}`,
                  name: doc.fileNm,
                  size: formatFileSize(doc.fileSz),
                  onDownload: () => handleDownload(doc.fileId, doc.fileNm),
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
    </div>
  )
}
OvsBidPbanc_AtchFileInq.displayName = 'OvsBidPbanc_AtchFileInq'
