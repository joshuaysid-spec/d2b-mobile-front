// 국외 입찰공고 상세 - '첨부파일' 탭 (MUI-BD-01-T73(구 M73 — v1.83 재편), 설계서 slide292·294).
// 첨부서류 — 공통 FileDownloadList 그대로(파일명 [크기] + 다운로드 행 스택).
// 행별 넘버링·서류명 라벨과 타이틀 topDivider 는 두지 않는다(사용자 확정 2026-08-24).
// 데이터는 목업(추후 bdService.selectAtchDocList).
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제. 키 = fileId.

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { showToast } from '@/stores/authStore'
import { formatFileSize } from '@/utils/format'
import type { MockOvsAtchDoc } from '@/types/mock/bd'

// 첨부서류 목업 — PC 실 인터페이스(ovsBidPbancDtl.IResultAttach) 키. 설계서 slide292 Layout 값 기반.
const MOCK_DOC_LIST: MockOvsAtchDoc[] = [
  {
    docTitl: '입찰공고문',
    fileNm: '입찰공고문(EFD0007-2).hwp',
    fileSz: 804_864,
    fileId: 'ATCH-1001',
  },
  { docTitl: '입찰유의서', fileNm: '국외입찰유의서.hwp', fileSz: 1_258_291, fileId: 'ATCH-1002' },
  {
    docTitl: '계약특수조건',
    fileNm: '계약특수조건(500MD부품).pdf',
    fileSz: 2_516_582,
    fileId: 'ATCH-1003',
  },
]

export function OvsBidPbancDtl2() {
  const downloadFile = fbQueries.useDownloadFile()

  // 다운로드 — fileId(GUID) 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      showToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <>
      {/* 타이틀 + 건수 — Figma m_section title(9973-131169) 우측 건수 슬롯(총 N건). 배경은 흰색(사용자 확정 — info 기본 블루 강조 제거)
          topDivider 없음 — 탭(TabList) 바로 아래 붙는 라인 제거(사용자 확정 2026-08-24) */}
      <SectionTitle info={`총 ${MOCK_DOC_LIST.length}건`} className="bg-white">
        첨부서류
      </SectionTitle>
      <div className="px-4 pt-2 pb-4">
        {/* 첨부파일명(fileNm) [파일크기(fileSz)] + 다운로드 — 공통 컴포넌트 그대로(넘버링·서류명 라벨 없음) */}
        <FileDownloadList
          files={MOCK_DOC_LIST.map((doc) => ({
            id: `doc-${doc.fileId}`,
            name: doc.fileNm,
            size: formatFileSize(doc.fileSz),
            onDownload: () => handleDownload(doc.fileId, doc.fileNm),
          }))}
        />
      </div>
    </>
  )
}
OvsBidPbancDtl2.displayName = 'OvsBidPbancDtl2'
