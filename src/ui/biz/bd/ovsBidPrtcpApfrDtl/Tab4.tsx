// 국외 입찰참가신청서 상세 - 탭4 첨부파일 (MUI-BD-04-T79(구 M81 — v1.83 재편), 설계서 slide352·355).
// 페이지(OvsBidPrtcpApfrDtlPage)가 renderTabContent 로 렌더하는 탭 콘텐츠 — 요약/스텝/탭은 페이지 소유.
// 구성: 첨부파일 목록(dl_docList — 첨부서류명 + 첨부파일명[파일크기] + 다운로드, FileDownloadList 재사용)
//   + 하단 확약문·구비서류 안내문구('입찰 확약 및 구비서류 안내' 타이틀 삭제 — 사용자 지시 2026-08-26,
//     작성 화면(T75, AtchDocReg)과 동일한 타이틀 없는 본문 + ※ 색 강조).
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import type { OvsAtchDocItem } from '@/ui/biz/bd/ovsBidPrtcpApfrDtl/OvsBidPrtcpApfrDtlPage'

interface OvsBidPrtcpApfrDtlPage_Tab4Props {
  /** 첨부서류(dl_docList) */
  docList: OvsAtchDocItem[]
}

export function OvsBidPrtcpApfrDtlPage_Tab4({ docList }: OvsBidPrtcpApfrDtlPage_Tab4Props) {
  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
  // ⚠️ 임시 GUID(행 키 atchDocNm) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <>

      {/* 첨부파일 — 총 N건 (slide352). 서류명(항목번호) + 파일명[크기] + 다운로드 */}
      <SectionTitle topDivider>
        첨부파일<span>총 {docList.length}건</span>
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4 pb-6 pt-2">
        {docList.map((doc, i) => (
          <div key={doc.atchDocNm} className="flex flex-col gap-krds-3">
            <span className="text-[17px] font-medium leading-normal text-krds-text-muted">
              {i + 1}. {doc.atchDocNm}
            </span>
            <FileDownloadList
              files={[
                {
                  id: doc.atchDocNm,
                  name: doc.atchFileNm,
                  size: doc.fileSz,
                  onDownload: () => handleDownload(doc.atchDocNm, doc.atchFileNm),
                },
              ]}
            />
          </div>
        ))}
      </div>

      {/* 입찰 확약문·구비서류 안내(slide352) — 타이틀 없는 하단 안내문구(작성 화면 T75 와 동일 처리) */}
      <div className="flex flex-col gap-krds-5 border-t border-krds-border-divider px-4 py-6 text-[15px] leading-relaxed text-krds-text-ink">
        <p>
          본인은 위의 번호로 공고한 귀청의 일반경쟁입찰에 참가하고자 귀청에서 정한
          물품구매(용역)입찰유의서, 계약 일반조건 및 입찰 공고 사항을 모두 숙지하여 수락하고
          계약일반조건 및 계약특수조건에 따라 계약품목을 기한 내에 납부할 것을 확약하며
          입찰참가신청서 및 아래 입찰서류를 제출합니다.
        </p>
        <p>
          단, 전차입찰의 경우 아래의 구비서류를 첨부 자료로써 제출하시고, 필요시 직접방문 및
          우편으로 제출요청을 받을 경우 제시하여야 함
        </p>
        <div>
          <p>1. 입찰 구비서류</p>
          <p>가. 입찰등록시 제출서류</p>
          <ul className="list-inside list-disc">
            <li>해외업체 위임장 1부</li>
            <li>공급자증명서 1부</li>
            <li>제작자 증명서 1부</li>
            <li>계약특수조건 1부</li>
            <li>서약서 1부</li>
          </ul>
        </div>
        <p className="text-krds-text-info">
          ※ 위 제출된 서류에 만약 이상이 있을 시에는 본 입찰 건을 무효 처리 하여도 이의가 없음을
          확인합니다.
        </p>
        <p className="text-krds-action-danger">
          ※ 입찰참가신청서 작성 후 입찰 담당관의 심사를 받으셔야 입찰서제출이 가능합니다.
        </p>
      </div>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </>
  )
}
OvsBidPrtcpApfrDtlPage_Tab4.displayName = 'OvsBidPrtcpApfrDtlPage_Tab4'
