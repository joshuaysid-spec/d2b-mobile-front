// 공개수의협상 견적서 조회(상세) - 첨부파일 (MUI-BD-12-T81(구 M81 — v1.83 재편), 설계서 slide433). 다운로드 전용.
// 구분 4종(견적제안서/공급자증명서/제작사증명서/기타 공고요구서류) 다운로드 + 유의사항(2건).
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Toast } from '@/ui/common/composites/Toast'

// 항목명 = 설계서 데이터영역 영문(dl_docList). id 는 목록 React key 용(설계서 필드 아님).
interface AtchFile {
  id: string
  /** 첨부서류명 (atchDocNm) — 구분 */
  atchDocNm: string
  /** 첨부파일명 (atchFileNm) */
  atchFileNm: string
  /** 파일크기 (fileSz) */
  fileSz: string
}
// 첨부파일 목업 — 설계서 slide433 구분·첨부파일명.
const FILES: AtchFile[] = [
  { id: 'f1', atchDocNm: '견적제안서', atchFileNm: '첨부파일명.hwp', fileSz: '786KB' },
  { id: 'f2', atchDocNm: '공급자증명서', atchFileNm: '첨부파일명.hwp', fileSz: '1.2MB' },
  { id: 'f3', atchDocNm: '제작사증명서', atchFileNm: '첨부파일명.hwp', fileSz: '540KB' },
  { id: 'f4', atchDocNm: '기타 공고요구서류', atchFileNm: '첨부파일명.hwp', fileSz: '320KB' },
]

// 유의사항 — 설계서 slide433 원문 2건(견적서 작성 M77과 동일). static(항상 펼침).
const NOTICE_ITEMS = [
  '견적서(가격제안서)는 제출 후 수정할 수 없습니다. 입찰내역을 주의하여 작성하시기 바랍니다.',
  '본인은 국가를 당사자로 하는 계약에 관한 법률시행규칙에 의한 공사 입찰유의서에 따라 응찰하여 이 입찰이 귀 기관에 의하여 수락되면 공사 계약일반조건, 계약특수조건, 설계서 및 현장 설명 사항에 따라 위의 입찰금액으로 준공기한내에 공사를 완공할 것을 확약하오며 견적서를 제출합니다.',
]

export function OvsRlsVltrnsNgtnEtdcDtl4() {
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

  const rows: FileDownloadItem[] = FILES.map((f) => ({
    id: f.id,
    name: `${f.atchDocNm} · ${f.atchFileNm}`,
    size: f.fileSz,
    onDownload: () => handleDownload(f.id, f.atchFileNm),
  }))

  return (
    <div className="py-4">
      <Accordion type="multiple" defaultValue={['file']} className="w-full">
        <AccordionSection value="file" title={`첨부파일 (총 ${FILES.length}건)`} borderTop={false}>
          {/* 다운로드 전용 목록 (설계서 slide433) */}
          <FileDownloadList files={rows} />
        </AccordionSection>
      </Accordion>

      {/* 유의사항 — 파일 목록 하단(설계서 slide433). static(chevron 없이 항상 펼침). */}
      <Infobox title="유의사항" items={NOTICE_ITEMS} collapsible={false} className="mt-4" />

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </div>
  )
}
OvsRlsVltrnsNgtnEtdcDtl4.displayName = 'OvsRlsVltrnsNgtnEtdcDtl4'
