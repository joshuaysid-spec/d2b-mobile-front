// 국외 입찰서제출 - 스탭3 첨부파일 (MUI-BD-06-T74(구 M74 — v1.83 재편), 설계서 slide369·373).
// 호스트 페이지(OvsTndrSbmsnPage)의 '첨부파일' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바(신청하기)는 페이지 소유.
// 구성(국내 TndrWrt_Stp5 패턴 그대로): SectionTitle(총 N건) + '파일 추가' 버튼
//   + 서류항목 행 N개(견적제안서/공급자증명서/제작사증명서/기타 공고요구서류 — 파일칩 + 삭제).
// 항목명/형식은 첨부파일 데이터영역(dl_docList, 설계서 slide373) 그대로.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { OvsTndrSbmsnDetail } from '@/types/bd'

// ── 첨부파일 데이터 영역(dl_docList, 설계서 slide373) ──
export interface OvsTndrDocItem {
  /** 식별자(고유) — 파일명 중복 가능하므로 목록 key 는 id 사용 */
  id: string
  /** 첨부서류명 (atchDocNm, 200) */
  atchDocNm: string
  /** 첨부파일명 (atchFileNm, 200) */
  atchFileNm: string
  /** 파일크기 (fileSz, 10) — 대괄호 없이(표시 시 [ ] 로 감쌈) */
  fileSz: string
}

// 첨부파일 목록 목업 — 설계서 slide369 서류항목(견적제안서/공급자증명서/제작사증명서/기타 공고요구서류) 그대로.
const INITIAL_FILES: OvsTndrDocItem[] = [
  { id: 'doc1', atchDocNm: '견적제안서', atchFileNm: '견적제안서_500MD부품.hwp', fileSz: '786KB' },
  { id: 'doc2', atchDocNm: '공급자증명서', atchFileNm: '공급자증명서_A해외업체.hwp', fileSz: '512KB' },
  { id: 'doc3', atchDocNm: '제작사증명서', atchFileNm: '제작사증명서_MDHI.hwp', fileSz: '324KB' },
  {
    id: 'doc4',
    atchDocNm: '기타 공고요구서류',
    atchFileNm: '기타공고요구서류_EFD0007-2.hwp',
    fileSz: '1.2MB',
  },
]

export function OvsTndrSbmsnPage_Stp3({ detail }: { detail: OvsTndrSbmsnDetail }) {
  const [files, setFiles] = useState<OvsTndrDocItem[]>(INITIAL_FILES)

  const handleAdd = () => {
    console.log('[M74] 국외 입찰서 파일 추가', detail.pbancNo, detail.pbancOd)
    // 추후 API: bdService.uploadOvsTndrFile
  }

  const handleRemove = (id: string) => {
    console.log('[M74] 국외 입찰서 첨부파일 삭제', id, detail.pbancNo)
    // 추후 API: bdService.removeOvsTndrFile
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <>
      {/* 첨부파일 — 총 건수(설계서 slide369 '첨부파일 – 총 0건') */}
      <SectionTitle as="h3" info={`총 ${files.length}건`} className="bg-white">
        첨부파일
      </SectionTitle>

      <div className="flex flex-col gap-krds-8 px-4 py-4">
        {/* 파일 추가 */}
        <div className="flex flex-col gap-krds-3">
          <h4 className="text-[17px] font-bold leading-normal text-krds-text-ink">파일첨부</h4>
          <Button variant="inner" className="w-full" onClick={handleAdd}>
            <Icon name="Add" size={20} aria-hidden />
            파일 추가
          </Button>
        </div>

        {/* 서류항목별 행 — 첨부서류명 + 파일칩(FileDownloadList 업로드 변형: onRemove 로 삭제 X 버튼) */}
        {files.map((file) => (
          <div key={file.id} className="flex flex-col gap-krds-3">
            <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
              {file.atchDocNm}
            </span>
            <FileDownloadList
              files={[
                {
                  id: file.id,
                  name: file.atchFileNm,
                  size: file.fileSz,
                  onRemove: () => handleRemove(file.id),
                },
              ]}
            />
          </div>
        ))}
      </div>
    </>
  )
}
OvsTndrSbmsnPage_Stp3.displayName = 'OvsTndrSbmsnPage_Stp3'
