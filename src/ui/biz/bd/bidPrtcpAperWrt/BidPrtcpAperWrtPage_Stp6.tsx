// 입찰참가신청서작성 - 파일첨부 탭(MUI-BD-04-M12 · 설계서 slide ~ 첨부서류).
// 호스트 페이지(BidPrtcpAperWrtPage)의 '파일첨부' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// SectionTitle(총 N건) + FileDownloadList(업로드 변형, onAddFile/onRemove) + 안내사항 Infobox(탭 최하단).
//   onAddFile → 이 탭이 소유한 BottomSheet(파일첨부 방식 선택) + 콘텐츠 CabinetLink(P13).
//   '직접 업로드' → 숨은 <input type=file multiple> 트리거 → fbService.upload → GUID 상태 보관.
//   다건 선택 시에도 요청은 파일당 1건씩 순차 진행(모바일 망 품질 협의사항) — 대기/업로드중/실패
//   건별 상태를 같은 FileDownloadList 행에 표시하고, 실패 건만 재업로드.
// Design Ref: file-upload.design.md §2(Option C) — 업로드/검증은 fbService.
//   ⚠️ files 상태는 호스트(BidPrtcpAperWrtPage)가 소유(제출 시 fileGuids 필요) → 이 탭은 controlled.
import { useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'

import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { CabinetLink, type CabinetLinkKind } from '@/ui/biz/bd/bidPrtcpAperWrt/CabinetLink'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { validateFile } from '@/services/tss/fb'
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

/** 업로드 진행 중(미완료) 파일 1건 — 완료되면 UploadedFile 로 승격되어 호스트 files 로 이동. */
interface PendingFile {
  id: string
  file: File
  status: 'waiting' | 'uploading' | 'error'
}

export function BidPrtcpAperWrtPage_Stp6({ detail, files, onFilesChange }: Props) {
  const [addOpen, setAddOpen] = useState(false) // 파일첨부 방식 선택 바텀시트(P13)
  const [pending, setPending] = useState<PendingFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  // 순차 업로드 큐 — 프라미스 체인으로 항상 1건씩만 전송(추가 선택·재시도도 뒤에 이어붙음).
  const queueRef = useRef(Promise.resolve())
  const uploadFile = fbQueries.useUploadFile()
  const removeFile = fbQueries.useRemoveFile()

  const setStatus = (id: string, status: PendingFile['status']) =>
    setPending((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))

  // 1건 업로드 — 성공 시 pending 에서 제거하고 호스트 files 로 승격, 실패 시 '실패' 표시(재시도 대기).
  const uploadOne = async ({ id, file }: PendingFile) => {
    setStatus(id, 'uploading')
    try {
      const uploaded = await uploadFile.mutateAsync(file)
      setPending((prev) => prev.filter((p) => p.id !== id))
      onFilesChange((prev) => [...prev, uploaded])
    } catch {
      setStatus(id, 'error')
    }
  }

  const enqueue = (item: PendingFile) => {
    queueRef.current = queueRef.current.then(() => uploadOne(item))
  }

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

  // 파일 선택 완료 → 건당 10MB 검증(초과분 제외) → 순차 업로드 큐에 추가.
  const handleFilesPicked = (e: ChangeEvent<HTMLInputElement>) => {
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

    const items: PendingFile[] = valid.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'waiting',
    }))
    setPending((prev) => [...prev, ...items])
    items.forEach(enqueue)
  }

  // 실패 건 재업로드 — 큐 뒤에 이어붙여 순차 유지.
  const handleRetry = (item: PendingFile) => {
    setStatus(item.id, 'waiting')
    enqueue(item)
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
      {/* 입찰서 첨부파일 — 업로드(첨부/삭제) */}
      <SectionTitle as="h3" topDivider info={`총 ${files.length}건`} className="bg-white">
        입찰서 첨부파일
      </SectionTitle>
      <div className="px-4 py-4">
        <FileDownloadList
          files={[
            ...files.map((f) => ({
              id: f.guid,
              name: f.orgnlFileNm,
              size: formatFileSize(f.fileSz),
              onRemove: () => handleRemove(f.guid),
            })),
            // 진행 중(대기/업로드중/실패) 건 — 같은 리스트 아래에 이어서 표시.
            ...pending.map((p) => ({
              id: p.id,
              name: p.file.name,
              size: formatFileSize(p.file.size),
              status: p.status,
              onRetry: () => handleRetry(p),
              // 실패 건만 삭제(취소) 허용 — 서버 미등록이라 로컬 제거만.
              onRemove:
                p.status === 'error'
                  ? () => setPending((prev) => prev.filter((x) => x.id !== p.id))
                  : undefined,
            })),
          ]}
          onAddFile={() => setAddOpen(true)}
        />
      </div>

      {/* 안내사항 — 탭 최하단 고정(전 탭 공통) */}
      <Infobox title="안내사항" items={NOTICES} />

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
