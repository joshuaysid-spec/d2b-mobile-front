// 생산능력서류제출 (MUI-BD-03-P06, 설계서 영문ID PrdctnAbltDcmntSbmsn · slide84·85·86).
// 접속: 홈 > 입찰진행 > 상세 > 생산능력서류 제출. 입찰진행 상세(M02)의 생산능력서류 '내용 보기' → 풀팝업.
// 구성(설계서): 공고일반(dmt_bidPbancInfo) + 업체내역(dmt_bzentyInfo) + 생산능력서류 첨부파일(dlt_prdcpAtchFileList, 업로드).
//   항목명/형식은 데이터영역 그대로. 데이터는 목업(상세에서 넘어온 항목 기반) — 백엔드 미연동.
//   제출/취소는 footer(부모=풀팝업이 소유). 첨부 추가/삭제는 console.log 스텁(추후 bdService.submitProdAbilityDocs).
import { useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem } from '@/types/bd'

export interface PrdctnAbltDcmntSbmsnFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 상세에서 넘어온 항목 — 공고 식별/표시값 시드. */
  detail: BidPrgrsItem
}

// 생산능력서류 첨부파일 초기 목업(dlt_prdcpAtchFileList) — 추후 업로드 결과로 대체.
const INIT_FILES: FileDownloadItem[] = [
  { id: 'f1', name: '생산능력증명서.hwp', size: '786KB' },
  { id: 'f2', name: '공장등록증.pdf', size: '1.2MB' },
]

export function PrdctnAbltDcmntSbmsnFullPopup({
  open,
  onOpenChange,
  detail,
}: PrdctnAbltDcmntSbmsnFullPopupProps) {
  const [files, setFiles] = useState<FileDownloadItem[]>(INIT_FILES)

  // 공고일반(dmt_bidPbancInfo) — 항목명/형식 설계서 그대로(일부 값은 상세 항목, 나머지는 목업).
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: '육군 탄약지원사령부' },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '집행유형', value: '제조' },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '입찰방법', value: detail.bidMthdNm },
    { label: '총수량', value: '1 AY', type: 'number' },
    { label: '예산금액', value: '619,520,000 원', type: 'number' },
    { label: '적격심사', value: '대상' },
    { label: '개찰일시', value: '2026-03-26 11:00' },
  ]

  // 업체내역(dmt_bzentyInfo)
  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: '00000' },
    { label: '업체명', value: '㈜업체명표기영역' },
    { label: '대표자', value: '홍길동' },
    { label: '사업자등록번호', value: '123-56-78901' },
    { label: '전화번호', value: '02-1234-5678' },
    { label: '주소', value: '서울특별시 …' },
  ]

  const handleSubmit = () => {
    console.log('[P06] 생산능력서류 제출', { pbancNo: detail.pbancNo, files })
    // 추후 API: bdService.submitProdAbilityDocs(detail.pbancNo, files)
    onOpenChange(false)
  }

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="생산능력서류 제출"
      footer={
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => onOpenChange(false) },
            { label: '제출하기', variant: 'primary', onClick: handleSubmit },
          ]}
        />
      }
    >
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <SummaryInfo
          badges={[
            { key: 'task', label: detail.taskSeNm },
            { key: 'ctrt', label: detail.ctrtMthdNm },
            { key: 'bfhd', label: '사전심사' },
            { key: 'apfr', label: '입찰참가' },
          ]}
          subtitle={detail.pbancNo}
          title={detail.bidNm}
        />

        <Accordion type="multiple" defaultValue={['pbanc', 'bzenty', 'file']}>
          <AccordionSection value="pbanc" title="공고일반" variant="blue" borderTop={false} flush>
            <Table rows={pbancRows} />
          </AccordionSection>
          <AccordionSection value="bzenty" title="업체내역" variant="blue" flush>
            <Table rows={bzentyRows} />
          </AccordionSection>
          <AccordionSection
            value="file"
            title={`입찰서 첨부파일 (총 ${files.length}건)`}
            variant="blue"
            flush
          >
            <FileDownloadList
              files={files.map((f) => ({
                ...f,
                onRemove: () => setFiles((prev) => prev.filter((p) => p.id !== f.id)),
              }))}
              onAddFile={() => console.log('[P06] 파일 추가')}
            />
          </AccordionSection>
        </Accordion>
      </div>
    </FullPopup>
  )
}
PrdctnAbltDcmntSbmsnFullPopup.displayName = 'PrdctnAbltDcmntSbmsnFullPopup'
