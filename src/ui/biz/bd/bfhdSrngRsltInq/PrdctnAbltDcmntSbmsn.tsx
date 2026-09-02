// 생산능력서류제출 (MUI-BD-03-P06, 설계서 영문ID PrdctnAbltDcmntSbmsn · slide84·85·86).
// 접속: 홈 > 입찰진행 > 상세 > 생산능력서류 제출. 입찰진행 상세(M02)의 생산능력서류 '내용 보기' → 바텀시트.
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(상세 페이지)가 소유하고,
//    여기엔 본문만. footer '제출하기' 는 부모가 ref.submit() 으로 호출한다. (P03/P04 와 동일 패턴)
// 구성(설계서): 공고일반(dmt_bidPbancInfo) + 업체내역(dmt_bzentyInfo) + 생산능력서류 첨부파일(dlt_prdcpAtchFileList, 업로드).
//   항목명/형식은 데이터영역 그대로. 데이터는 목업(상세에서 넘어온 항목 기반) — 백엔드 미연동.
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

export interface PrdctnAbltDcmntSbmsnHandle {
  /** 부모 BottomSheet footer '제출하기' 가 호출 — 제출 처리 후 onSubmitted() 로 시트 닫힘 알림 */
  submit: () => void
}

interface PrdctnAbltDcmntSbmsnProps {
  /** 상세에서 넘어온 항목 — 공고 식별/표시값 시드. */
  detail: MockBidPrgrsItem
  /** 제출 완료 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

// 생산능력서류 첨부파일 초기 목업(dlt_prdcpAtchFileList) — 추후 업로드 결과로 대체.
const INIT_FILES: FileDownloadItem[] = [
  { id: 'f1', name: '생산능력증명서.hwp', size: '786KB' },
  { id: 'f2', name: '공장등록증.pdf', size: '1.2MB' },
]

const PrdctnAbltDcmntSbmsn = forwardRef<PrdctnAbltDcmntSbmsnHandle, PrdctnAbltDcmntSbmsnProps>(
  ({ detail, onSubmitted }, ref) => {
    const [files, setFiles] = useState<FileDownloadItem[]>(INIT_FILES)

    // 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — P06 자체가 시트 콘텐츠라
    //   중첩 컨테이너는 여기서 소유(ScrtyMsrmtPrsnlReg 선례).
    const [fileAddOpen, setFileAddOpen] = useState(false)
    const fileAddRef = useRef<FileAddHandle>(null)

    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          console.log('[P06] 생산능력서류 제출', { pbancNo: detail.pbancNo, files })
          // 추후 API: bdService.insertPrdcpDcmntSbmsn(detail.pbancNo, files)
          onSubmitted()
        },
      }),
      [detail, files, onSubmitted],
    )

    // 공고일반(dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 나머지 목업.
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

    return (
      <div className="flex flex-col gap-krds-7">
        <SummaryInfo
          flushX
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
          <AccordionSection value="pbanc" title="공고일반" variant="blue" borderTop={false} flush triggerClassName="px-0">
            <Table rows={pbancRows} />
          </AccordionSection>
          <AccordionSection value="bzenty" title="업체내역" variant="blue" flush triggerClassName="px-0">
            <Table rows={bzentyRows} />
          </AccordionSection>
          <AccordionSection
            value="file"
            title={`입찰서 첨부파일 (총 ${files.length}건)`}
            variant="blue"
            flush
            triggerClassName="px-0"
          >
            <FileDownloadList
              files={files.map((f) => ({
                ...f,
                onRemove: () => setFiles((prev) => prev.filter((p) => p.id !== f.id)),
              }))}
              onAddFile={() => setFileAddOpen(true)}
            />
          </AccordionSection>
        </Accordion>

        {/* 파일선택 FileAdd 공통 시트 배선(v0.87 검토46, 2026-09-02) — [공통] 파일 추가(v0.87 마지막 장).
            첨부서류명 직접입력 + 여러 파일 허용, 완료 시 목록 append. */}
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
              onComplete={({ files: picked }) =>
                setFiles((prev) => [
                  ...prev,
                  ...picked.map((p) => ({ id: p.id, name: p.name, size: p.size })),
                ])
              }
            />
          )}
        </BottomSheet>
      </div>
    )
  },
)
PrdctnAbltDcmntSbmsn.displayName = 'PrdctnAbltDcmntSbmsn'

export { PrdctnAbltDcmntSbmsn }
