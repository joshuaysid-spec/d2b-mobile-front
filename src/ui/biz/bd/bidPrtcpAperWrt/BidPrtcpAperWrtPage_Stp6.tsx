// 입찰참가신청서작성 - 파일첨부 탭(MUI-BD-04-M12 · 설계서 slide ~ 첨부서류).
// 호스트 페이지(BidPrtcpAperWrtPage)의 '파일첨부' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 안내사항 Infobox + SectionTitle(총 N건) + FileDownloadList(업로드 변형, onAddFile/onRemove).
//   onAddFile → 이 탭이 소유한 BottomSheet(파일첨부 방식 선택) + 콘텐츠 CabinetLink(P13).
//   '직접 업로드' → 숨은 <input type=file multiple> 트리거 → fileService.upload → GUID 상태 보관.
// Design Ref: file-upload.design.md §2(Option C) — 업로드/검증은 fileService.
//   ⚠️ files 상태는 호스트(BidPrtcpAperWrtPage)가 소유(제출 시 fileGuids 필요) → 이 탭은 controlled.
import { useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { CabinetLink, type CabinetLinkKind } from '@/ui/biz/bd/bidPrtcpAperWrt/CabinetLink'
import { useRemoveFile, useUploadFile } from '@/queries/file'
import { validateFile } from '@/services/file'
import { formatFileSize } from '@/utils/format'
import type { UploadedFile } from '@/types/file'
import type { BidPrgrsItem } from '@/types/bd'

// 첨부서류 안내사항(설계서 slide107 파일첨부 유의사항).
const NOTICES = [
  '대표 및 등기임원의 청렴서약서를 반드시 첨부하시기 바랍니다.',
  '법인등기부등본(등기사항 전부증명서)을 반드시 첨부하시기 바랍니다.',
  '건당 크기 10MB 미만 파일만 첨부가능합니다.',
  '스캔 파일은 파일압축해서 업로드 부탁드립니다.',
  '규격입찰서 관련 전자파일은 입찰서 작성 시 제출해 주시기 바랍니다.',
]

interface Props {
  detail: BidPrgrsItem
  /** 업로드 목록 — 호스트가 소유(제출 시 fileGuids). */
  files: UploadedFile[]
  /** 업로드 목록 갱신 — 호스트 setState. */
  onFilesChange: Dispatch<SetStateAction<UploadedFile[]>>
}

export function BidPrtcpAperWrtPage_Stp6({ detail, files, onFilesChange }: Props) {
  const [addOpen, setAddOpen] = useState(false) // 파일첨부 방식 선택 바텀시트(P13)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadFile = useUploadFile()
  const removeFile = useRemoveFile()

  // 방식 선택 — '직접 업로드'면 시트 닫고 파일 선택기 열기(사용자 제스처 내 호출).
  const handleSelectMethod = (kind: CabinetLinkKind) => {
    setAddOpen(false)
    if (kind === 'direct') {
      inputRef.current?.click()
    } else {
      // 캐비닛 선택 — 이번 스코프 제외(보관함 조회 API 미확정). 추후 API: bdService.linkCabinet
      console.log('[M12] 캐비닛 선택 (미배선)', kind)
    }
  }

  // 파일 선택 완료 → 건당 10MB 검증(초과분 제외) → 업로드 → 목록 추가.
  const handleFilesPicked = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = '' // 같은 파일 재선택 허용
    if (picked.length === 0) return

    const rejected = picked.map(validateFile).filter((msg): msg is string => msg !== null)
    const valid = picked.filter((f) => validateFile(f) === null)
    if (rejected.length > 0) {
      // 추후: 토스트로 교체
      alert(rejected.join('\n'))
    }
    if (valid.length === 0) return

    setUploading(true)
    try {
      // 추후 API: 업로드 훅이 실제 multipart 업로드 → 서버 GUID 반환
      const uploaded = await Promise.all(valid.map((f) => uploadFile.mutateAsync(f)))
      onFilesChange((prev) => [...prev, ...uploaded])
    } catch {
      alert('파일 업로드에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setUploading(false)
    }
  }

  // 삭제(X) → 삭제 훅 호출 + 목록 제거.
  const handleRemove = (guid: string) => {
    // 추후 API: 삭제 훅 결과 확인 후 제거(목업은 낙관적 제거)
    removeFile.mutate(guid)
    onFilesChange((prev) => prev.filter((f) => f.guid !== guid))
    console.log('[M12] 첨부파일 삭제', guid, detail.pbancNo)
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
            id: f.guid,
            name: f.orgnlFileNm,
            size: formatFileSize(f.fileSz),
            onRemove: () => handleRemove(f.guid),
          }))}
          onAddFile={() => setAddOpen(true)}
        />
        {uploading && (
          <p className="pt-2 text-[15px] leading-normal text-krds-text-muted">업로드 중…</p>
        )}
      </div>

      {/* 숨은 파일 선택기 — '직접 업로드'로 트리거(다중 선택) */}
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFilesPicked} />

      {/* 파일첨부 방식 선택(P13) — 이 탭이 컨테이너 소유 */}
      <BottomSheet open={addOpen} onOpenChange={setAddOpen} title="파일첨부 방식 선택">
        <CabinetLink onSelect={handleSelectMethod} />
      </BottomSheet>
    </>
  )
}
BidPrtcpAperWrtPage_Stp6.displayName = 'BidPrtcpAperWrtPage_Stp6'
