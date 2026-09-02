// 공개수의협상 견적서 작성 - 스탭4 첨부파일 (MUI-BD-12-T77(구 M77 — v1.83 재편), 설계서 slide423). 업로드.
// 구분 4종(견적제안서/공급자증명서/제작사증명서/기타 공고요구서류) 파일 추가/삭제 + 유의사항.
import { useRef, useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'

interface UploadFile {
  id: string
  docSeNm: string // 구분(첨부서류명)
  name: string
  size: string
}
// 첨부파일 초기 목업 — 설계서 slide423 구분·첨부파일명.
const INIT_FILES: UploadFile[] = [
  { id: 'f1', docSeNm: '견적제안서', name: '첨부파일명.hwp', size: '786KB' },
  { id: 'f2', docSeNm: '공급자증명서', name: '첨부파일명.hwp', size: '1.2MB' },
  { id: 'f3', docSeNm: '제작사증명서', name: '첨부파일명.hwp', size: '540KB' },
  { id: 'f4', docSeNm: '기타 공고요구서류', name: '첨부파일명.hwp', size: '320KB' },
]

// 유의사항 — 설계서 slide423 원문 2건. 파일 목록 하단에 노출.
// 확약 문구는 입찰서 작성(TndrWrt_Stp7 slide127)과 동일 계열이며 말미만 '견적서를 제출합니다'.
const NOTICE_ITEMS = [
  '견적서(가격제안서)는 제출 후 수정할 수 없습니다. 입찰내역을 주의하여 작성하시기 바랍니다.',
  '본인은 국가를 당사자로 하는 계약에 관한 법률시행규칙에 의한 공사 입찰유의서에 따라 응찰하여 이 입찰이 귀 기관에 의하여 수락되면 공사 계약일반조건, 계약특수조건, 설계서 및 현장 설명 사항에 따라 위의 입찰금액으로 준공기한내에 공사를 완공할 것을 확약하오며 견적서를 제출합니다.',
]

export function OvsRlsVltrnsNgtnEtdcSbmsn4() {
  const [files, setFiles] = useState<UploadFile[]>(INIT_FILES)

  // 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — [공통] 파일 추가 시트 열기.
  const [fileAddOpen, setFileAddOpen] = useState(false)
  const fileAddRef = useRef<FileAddHandle>(null)

  const rows: FileDownloadItem[] = files.map((f) => ({
    id: f.id,
    name: `${f.docSeNm} · ${f.name}`,
    size: f.size,
    onRemove: () => setFiles((list) => list.filter((x) => x.id !== f.id)),
  }))

  return (
    <div className="py-4">
      <Accordion type="multiple" defaultValue={['file']} className="w-full">
        <AccordionSection value="file" title={`첨부파일 (총 ${files.length}건)`} borderTop={false}>
          {/* 업로드 목록 — 삭제(X) + 파일 추가 (설계서 slide423) */}
          <FileDownloadList files={rows} onAddFile={() => setFileAddOpen(true)} />
        </AccordionSection>
      </Accordion>

      {/* 유의사항 — 파일 목록 하단(설계서 slide423). static(chevron 없이 항상 펼침). */}
      <Infobox title="유의사항" items={NOTICE_ITEMS} collapsible={false} className="mt-4" />

      {/* 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — [공통] 파일 추가(v0.87 마지막 장).
          첨부서류명 직접입력(구분으로 사용) + 여러 파일 허용. */}
      <BottomSheet
        open={fileAddOpen}
        onOpenChange={setFileAddOpen}
        title="파일 추가"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setFileAddOpen(false) },
              {
                label: '완료',
                variant: 'primary',
                onClick: () => {
                  if (fileAddRef.current?.complete()) setFileAddOpen(false)
                },
              },
            ]}
          />
        }
      >
        {fileAddOpen && (
          <FileAdd
            ref={fileAddRef}
            onComplete={({ docNm, files: picked }) =>
              // 추후: bdService.uploadEtdcAtchDoc — 목업은 목록 append 만.
              setFiles((prev) => [
                ...prev,
                ...picked.map((p) => ({ id: p.id, docSeNm: docNm, name: p.name, size: p.size })),
              ])
            }
          />
        )}
      </BottomSheet>
    </div>
  )
}
OvsRlsVltrnsNgtnEtdcSbmsn4.displayName = 'OvsRlsVltrnsNgtnEtdcSbmsn4'
