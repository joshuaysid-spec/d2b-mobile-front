// 입찰서(견적서) 작성 - 파일첨부 (MUI-BD-06-M05, Figma 9973-63627 · 설계서 02입찰 slide125·130)
// 호스트 페이지(TndrWrtPage)의 '파일첨부' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 설계서 slide125: "입찰참가신청서작성 – 파일첨부와 같은 구성임(서류항목이 다름)".
//   레퍼런스 BidPrtcpAperWrtPage_Stp6 재사용하되, Figma(9973:63627) 기준으로 서류항목별 행 구성.
// 구성: SectionTitle(총 N건) + '파일 추가' 버튼 + 서류항목 행 N개(서류명/일자 + 파일칩(FileDownloadList)).
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { BidPrgrsItem } from '@/types/bd'

// 입찰서 첨부파일 데이터 영역(dlt_tndrAtchFileList, 설계서 slide130). 항목명(영문) 그대로.
interface TndrAtchFile {
  /** 식별자(고유) — 파일명 중복 가능하므로 목록 key 는 id 사용 */
  id: string
  /** 첨부서류명 (adocNm) — 첨부파일 구분 */
  adocNm: string
  /** 첨부파일명 (fileNm) */
  fileNm: string
  /** 파일크기 (fileSz) — 대괄호 없이(표시 시 [ ] 로 감쌈) */
  fileSz: string
  /** 첨부일자 — Figma 표시값(2026-01-01). ⚠️ dlt_tndrAtchFileList 미정의(상세설계 예정), 임시 항목 */
  atchDt: string
}

// 입찰서 첨부파일 목록 목업(Figma 9973:63627). 서류항목별 노출 조건(설계서 slide130 비고)은 주석으로만 남기고
// 목업은 4건 모두 표시(실제로는 부서부호·계약방법·입찰방법 분기로 노출 여부 결정).
const INITIAL_FILES: TndrAtchFile[] = [
  // 규격제안서 — 부서부호 'E' 시작, 계약방법 'G'/'H', 2단계경쟁(분리/동시) 첨부파일 제출여부 'Y'
  { id: 'atch1', adocNm: '규격제안서', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
  // 공종별 산출내역서 — 내역입찰(최저가/적격심사)+산출내역서적용, 또는 내역입찰(종합심사)+공사구분≠감리용역 등
  { id: 'atch2', adocNm: '공종별 산출내역서', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
  // 자기평가기술서 — 내역입찰(최저가/적격심사)+산출내역서적용
  { id: 'atch3', adocNm: '자기평가기술서', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
  // 기타참조서류 — 내역입찰(종합심사)+감리용역+산출내역서 비적용
  { id: 'atch4', adocNm: '기타참조서류', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
]

export function TndrWrt_Stp5({ detail }: { detail: BidPrgrsItem }) {
  const [files, setFiles] = useState<TndrAtchFile[]>(INITIAL_FILES)

  // 추후 API: bdService.uploadTndrFile
  const handleAdd = () => {
    console.log('[M05] 입찰서 파일 추가', detail.pbancNo)
  }

  // 추후 API: bdService.removeTndrFile
  const handleRemove = (id: string) => {
    console.log('[M05] 입찰서 첨부파일 삭제', id, detail.pbancNo)
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <>
      {/* 입찰서 첨부파일 — 총 건수 */}
      <SectionTitle as="h3" info={`총 ${files.length}건`}>
        입찰서 첨부파일
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

        {/* 서류항목별 행 — 서류명/일자 + 파일칩(FileDownloadList 업로드 변형: onRemove 로 삭제 X 버튼) */}
        {files.map((file) => (
          <div key={file.id} className="flex flex-col gap-krds-3">
            <div className="flex items-center justify-between gap-krds-3">
              <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                {file.adocNm}
              </span>
              <span className="shrink-0 text-[17px] leading-normal text-krds-text-muted">
                {file.atchDt}
              </span>
            </div>
            <FileDownloadList
              files={[
                {
                  id: file.id,
                  name: file.fileNm,
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
TndrWrt_Stp5.displayName = 'TndrWrt_Stp5'
