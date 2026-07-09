// 입찰참가신청서작성 - 파일첨부 탭(MUI-BD-04-M12 · 설계서 slide ~ 첨부서류).
// 호스트 페이지(BidPrtcpAperWrtPage)의 '파일첨부' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 안내사항 Infobox + SectionTitle(총 N건) + FileDownloadList(업로드 변형, onAddFile/onRemove).
//   onAddFile → 이 탭이 소유한 BottomSheet(파일첨부 방식 선택) + 콘텐츠 CabinetLink(P13).
import { useState } from 'react'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { CabinetLink } from '@/ui/biz/bd/bidPrtcpAperWrt/CabinetLink'
import type { BidPrgrsItem } from '@/types/bd'

// 첨부서류 안내사항(설계서 slide107 파일첨부 유의사항).
const NOTICES = [
  '대표 및 등기임원의 청렴서약서를 반드시 첨부하시기 바랍니다.',
  '법인등기부등본(등기사항 전부증명서)을 반드시 첨부하시기 바랍니다.',
  '건당 크기 10MB 미만 파일만 첨부가능합니다.',
  '스캔 파일은 파일압축해서 업로드 부탁드립니다.',
  '규격입찰서 관련 전자파일은 입찰서 작성 시 제출해 주시기 바랍니다.',
]

// 입찰서 첨부파일 — 업로드 목록 목업(첨부서류명 = name, 용량 = size).
const INITIAL_FILES: FileDownloadItem[] = [
  { id: 'att1', name: '청렴서약서.hwp', size: '512KB' },
  { id: 'att2', name: '법인등기부등본.pdf', size: '1.2MB' },
]

export function BidPrtcpAperWrtPage_Stp6({ detail }: { detail: BidPrgrsItem }) {
  const [files, setFiles] = useState<FileDownloadItem[]>(INITIAL_FILES)
  const [addOpen, setAddOpen] = useState(false) // 파일첨부 방식 선택 바텀시트(P13)

  // 추후 API: bdService.removeAperFile / bdService.uploadAperFile
  const handleRemove = (id: FileDownloadItem['id']) => {
    console.log('[M12] 첨부파일 삭제', id, detail.pbancNo)
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <>
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        파일첨부
      </PageTitle>

      {/* 안내사항 */}
      <Infobox title="안내사항" items={NOTICES} />

      {/* 입찰서 첨부파일 — 업로드(첨부/삭제) */}
      <SectionTitle as="h3" topDivider info={`총 ${files.length}건`} className="bg-white">
        입찰서 첨부파일
      </SectionTitle>
      <div className="px-4 py-4">
        <FileDownloadList
          files={files.map((f) => ({
            ...f,
            onRemove: () => handleRemove(f.id),
          }))}
          onAddFile={() => setAddOpen(true)}
        />
      </div>

      {/* 파일첨부 방식 선택(P13) — 이 탭이 컨테이너 소유 */}
      <BottomSheet open={addOpen} onOpenChange={setAddOpen} title="파일첨부 방식 선택">
        <CabinetLink
          onSelect={(kind) => {
            console.log('[M12] 파일첨부 방식 선택 완료', kind)
            setAddOpen(false)
          }}
        />
      </BottomSheet>
    </>
  )
}
BidPrtcpAperWrtPage_Stp6.displayName = 'BidPrtcpAperWrtPage_Stp6'
