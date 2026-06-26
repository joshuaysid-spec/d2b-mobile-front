// 사전심사(PQ)신청 (MUI-BD-02-M01, 설계서 영문ID BfhdSrngAplyPage · slide89·90·91).
// 접속: 홈 > 입찰진행 > 사전심사 진행. 입찰진행 상세(M02) 바로가기 '사전심사 신청하기' → 이 화면.
// 구성(설계서): 공고일반(dmt_bidPbancInfo=공사내역) + 업체내역(dmt_bzentyInfo) + 첨부파일(dlt_atchFileList, 업로드)
//   + 사전심사 신청 서약문 + footer(신청하기/취소). 항목명/형식은 데이터영역 그대로.
//   데이터는 목업(상세에서 넘어온 항목 기반) — 백엔드 미연동. 신청/첨부는 console.log 스텁.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 항목명/형식 그대로.
const MOCK_DETAIL: BidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '2026LDG000560349-01',
  prcmNo: '2026LDG000560349',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '042-123-4567',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '전자입찰',
  bidClrsDt: '2026-03-20 15:00',
  tndrSbmsnDdlnDt: '2026-03-21 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: false,
  techEvl: false,
  prdcpDcmntSbms: false,
}

// 첨부파일 초기 목업(dlt_atchFileList) — 업로드 변형.
const INIT_FILES: FileDownloadItem[] = [
  { id: 'f1', name: '입찰참가자격심사서류.hwp', size: '512KB' },
]

export function BfhdSrngAplyPage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as BidPrgrsItem | null) ?? MOCK_DETAIL
  const [files, setFiles] = useState<FileDownloadItem[]>(INIT_FILES)

  // 공고일반(dmt_bidPbancInfo=공사내역) — 항목명/형식 설계서 그대로(상세 항목 + 목업 보완).
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '공사번호', value: detail.prcmNo },
    { label: '발주기관', value: '육군 탄약지원사령부' },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '공사구분', value: '제조' },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '입찰방법', value: detail.bidMthdNm },
    { label: '예산금액', value: '619,520,000 원', type: 'number' },
    { label: '사전심사', value: '대상' },
    { label: '적격심사', value: '대상' },
    { label: '신청마감일시', value: detail.bidClrsDt },
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

  const handleApply = () => {
    console.log('[M01-사전심사] 신청', { pbancNo: detail.pbancNo, files })
    // 추후 API: bdService.applyBfhdSrng(detail.pbancNo, files)
    navigate(-1)
  }

  return (
    <div className="flex w-full flex-col">
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
            title={`첨부파일 (총 ${files.length}건)`}
            variant="blue"
            flush
          >
            <FileDownloadList
              files={files.map((f) => ({
                ...f,
                onRemove: () => setFiles((prev) => prev.filter((p) => p.id !== f.id)),
              }))}
              onAddFile={() => console.log('[M01-사전심사] 파일 추가')}
            />
          </AccordionSection>
        </Accordion>

        {/* 사전심사 신청 서약문 — 설계서 문구 그대로 */}
        <p className="px-krds-5 text-krds-body-md leading-relaxed text-krds-text-ink">
          위 공사에 대한 입찰참가자격심사서류를 붙임과 같이 제출하오니 우리회사(공동수급체구성원 포함)에 대하여
          붙임 자료에 의거 입찰참가자격을 심사(향후 적격심사 포함)하여 주시기 바라며, 만일 제출 서류가 귀 부대
          심사기준 제10조 제2항의 기준에 저촉되면 귀 부대 심사기준에 따라 조치하여도 아무런 이의를 제기하지 않겠음을
          확약합니다.
        </p>

        {/* footer — 신청하기/취소 */}
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '신청하기', variant: 'primary', onClick: handleApply },
          ]}
        />
      </div>
    </div>
  )
}
BfhdSrngAplyPage.displayName = 'BfhdSrngAplyPage'
