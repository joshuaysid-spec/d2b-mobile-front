// 입찰참가신청서작성 - 파일첨부 탭(MUI-BD-04-M12 · 설계서 slide ~ 첨부서류).
// 호스트 페이지(BidPrtcpAperWrtPage)의 '파일첨부' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// SectionTitle(총 N건) + FileDownloadList(업로드 변형, onAddFile/onRemove) + 안내사항 Infobox(탭 최하단).
//   onAddFile → 이 탭이 소유한 BottomSheet('파일 추가') + 콘텐츠 [공통] FileAdd(cm/fileAdd).
//   업로드(파일당 1요청 순차 큐)·10MB 검증·재시도·캐비닛 선택은 전부 FileAdd 안에서 처리되고,
//   [완료] 시 첨부파일명(docNm) + 업로드 응답(uploaded)만 이 탭으로 넘어온다.
// Design Ref: file-upload.design.md §2(Option C) — 업로드/검증은 fbService.
//   ⚠️ files 상태는 호스트(BidPrtcpAperWrtPage)가 소유(제출 시 fileGuids 필요) → 이 탭은 controlled.
import { useRef, useState, type Dispatch, type SetStateAction } from 'react'

import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { formatFileSize } from '@/utils/format'
import type { UploadedFile } from '@/types/file'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 첨부서류 안내사항(설계서 slide107 파일첨부 유의사항).
const NOTICES = [
  '대표 및 등기임원의 청렴서약서를 반드시 첨부하시기 바랍니다.',
  '법인등기부등본(등기사항 전부증명서)을 반드시 첨부하시기 바랍니다.',
  '건당 크기 10MB 미만 파일만 첨부가능합니다.',
  '스캔 파일은 파일압축해서 업로드 부탁드립니다.',
  '규격입찰서 관련 전자파일은 입찰서 작성 시 제출해 주시기 바랍니다.',
]

/** 첨부파일 1건 — 첨부파일명(파일 추가 시트 입력) + 업로드 응답 통째(제출 시 uploaded.guid). */
export interface BidPrtcpAperAtchFile {
  docNm: string
  uploaded: UploadedFile
}

interface Props {
  detail: MockBidPrgrsItem
  /** 업로드 목록 — 호스트가 소유(제출 시 fileGuids). */
  files: BidPrtcpAperAtchFile[]
  /** 업로드 목록 갱신 — 호스트 setState. */
  onFilesChange: Dispatch<SetStateAction<BidPrtcpAperAtchFile[]>>
}

export function BidPrtcpAperWrtPage_Stp6({ detail, files, onFilesChange }: Props) {
  const [addOpen, setAddOpen] = useState(false) // [공통] 파일 추가 바텀시트
  const fileAddRef = useRef<FileAddHandle>(null)
  const removeFile = fbQueries.useRemoveFile()

  // 삭제(X) → 삭제 훅 호출 + 목록 제거.
  const handleRemove = (guid: string) => {
    // 추후 API: 삭제 훅 결과 확인 후 제거(목업은 낙관적 제거)
    removeFile.mutate(guid)
    onFilesChange((prev) => prev.filter((f) => f.uploaded.guid !== guid))
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
          files={files.map((f) => ({
            id: f.uploaded.guid,
            // 첨부파일명(서류명) + 실제 파일명 — 정본(OvsRlsVltrnsNgtnEtdcSbmsn4) 표기 방식.
            name: `${f.docNm} · ${f.uploaded.orgnlFileNm}`,
            size: formatFileSize(f.uploaded.fileSz),
            onRemove: () => handleRemove(f.uploaded.guid),
          }))}
          onAddFile={() => setAddOpen(true)}
        />
      </div>

      {/* 안내사항 — 탭 최하단 고정(전 탭 공통) */}
      <Infobox title="안내사항" items={NOTICES} />

      {/* [공통] 파일 추가 — 이 탭이 컨테이너(BottomSheet)·타이틀·footer 소유, 콘텐츠는 FileAdd.
          ⚠️ 서류명 목록 확정 시 docNmOptions 로 교체 — 현재는 첨부파일명 직접입력(설계서에 서류명 목록 미정의). */}
      <BottomSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        title="파일 추가"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setAddOpen(false) },
              {
                label: '완료',
                variant: 'primary',
                onClick: () => {
                  if (fileAddRef.current?.complete()) setAddOpen(false)
                },
              },
            ]}
          />
        }
      >
        {addOpen && (
          <FileAdd
            ref={fileAddRef}
            onComplete={({ docNm, files: picked }) =>
              onFilesChange((prev) => [
                ...prev,
                ...picked.map((p) => ({ docNm, uploaded: p.uploaded })),
              ])
            }
          />
        )}
      </BottomSheet>
    </>
  )
}
BidPrtcpAperWrtPage_Stp6.displayName = 'BidPrtcpAperWrtPage_Stp6'
