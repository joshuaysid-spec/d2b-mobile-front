// 국외 입찰서 상세 — 탭4 첨부파일 (MUI-BD-06-T79(구 M79 — v1.83 재편), 설계서 slide379 · 항목설명 slide384).
// 첨부파일 목록(dl_docList) — 항목번호 + 첨부서류명(atchDocNm) 라벨 + 파일행(atchFileNm [fileSz] + 다운로드).
// 항목명(영문) 설계서 그대로. 데이터는 목업 — 추후 API: bdService.selectOvsTndrDocList.
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'

// 첨부파일 1건 (dl_docList, 설계서 slide384) — 항목명(영문) 설계서 그대로. id 는 렌더 key 용.
interface OvsTndrDoc {
  id: string
  atchDocNm: string // 첨부서류명(200)
  atchFileNm: string // 첨부파일명(200)
  fileSz: string // 파일크기(10)
}

// 목업 — 설계서 slide379 첨부서류명 4종 그대로.
const MOCK_DOC_LIST: OvsTndrDoc[] = [
  { id: 'doc-1', atchDocNm: '견적제안서', atchFileNm: '견적제안서_500MD부품.hwp', fileSz: '786KB' },
  { id: 'doc-2', atchDocNm: '공급자증명서', atchFileNm: '공급자증명서_FB해외업체.hwp', fileSz: '124KB' },
  { id: 'doc-3', atchDocNm: '제작사증명서', atchFileNm: '제작사증명서_500MD.hwp', fileSz: '1.2MB' },
  { id: 'doc-4', atchDocNm: '기타 공고요구서류', atchFileNm: '기타_공고요구서류.hwp', fileSz: '2.1MB' },
]

export function Tab4() {
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
    // pt-4: 탭과 콘텐츠 사이 상단 간격(사용자 지시 2026-08-26)
    <div className="pt-4">
      {/* v0.87 검토102 — '첨부파일 - 총 N건' 폰트를 본문 규격(17px)으로 보정(구 SectionTitle 19px) */}
      <div className="flex items-center justify-between px-4 pb-3">
        <h3 className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          첨부파일
        </h3>
        <span className="shrink-0 whitespace-nowrap text-[17px] font-bold text-krds-text-primary-active">
          총 {MOCK_DOC_LIST.length}건
        </span>
      </div>
      <div className="flex flex-col gap-krds-7 px-4 pb-4">
        {MOCK_DOC_LIST.map((doc, i) => (
          <div key={doc.id} className="flex flex-col gap-krds-3">
            <span className="text-[15px] font-medium leading-normal text-krds-text-muted">
              {i + 1}. {doc.atchDocNm}
            </span>
            <FileDownloadList
              files={[
                {
                  id: doc.id,
                  name: doc.atchFileNm,
                  size: doc.fileSz,
                  onDownload: () => handleDownload(doc.id, doc.atchFileNm),
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
Tab4.displayName = 'Tab4'
