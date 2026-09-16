// 사전심사(PQ)신청 (MUI-BD-02-M01, 설계서 영문ID BfhdSrngAplyPage · 02.입찰 v1.83 slide93·94·95).
// 접속: 홈 > 입찰진행 > 사전심사 진행. 입찰진행 상세(M02) 바로가기 '사전심사 신청하기' → 이 화면.
// 구성(설계서 slide93 주석 1~5): ① 업무도움 → ② 공고일반(dmt_bidPbancInfo) → ③ 업체내역(dmt_bzentyInfo)
//   → ④ 첨부파일(dlt_atchFileList, 파일 추가/삭제) → ⑤ 확약문 + footer(신청하기/취소). 항목명/형식은 데이터영역 그대로.
//   ⚠️ v1.83 개정(2026-07-01 화면 수정 '주민등록번호 삭제') 반영 — 업체내역은 데이터영역 6항목만.
// '파일 추가' 클릭 → [공통] 파일 추가 시트(cm/fileAdd/FileAdd) — 이 페이지가 컨테이너(BottomSheet)·footer 소유.
//   업로드(파일당 1요청 순차 큐)·10MB 검증·재시도·캐비닛 선택은 FileAdd 안에서 처리되고,
//   [완료] 시 첨부파일명(adocNm) + 업로드 응답(uploaded)만 이 페이지로 넘어온다.
// '신청하기' 클릭 → 제출확인 AlertModal → 확인 시 bdQueries.useApplyBfhdSrng(pbancNo, fileGuids) 제출.
import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import { formatFileSize } from '@/utils/format'
import type { ApiError } from '@/types/api'
import type { UploadedFile } from '@/types/file'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 항목명/형식 그대로.
const MOCK_DETAIL: MockBidPrgrsItem = {
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

// 업무도움(설계서 slide93 주석 1 '업무도움 내용이 있는 경우 표시').
const HELP_ITEMS = [
  '사전심사 대상 공고에 입찰참가자격심사서류를 첨부하여 사전심사를 신청하는 화면입니다.',
  '신청마감일시 이후에는 신청서를 제출할 수 없습니다.',
]

/** 첨부파일 1건 — 설계서 데이터영역 dlt_atchFileList(항목명 영문 그대로) + 업로드 응답. */
interface BfhdSrngAtchFile {
  /** 첨부서류명 (adocNm) — 파일 추가 시트에서 입력받은 첨부파일명 */
  adocNm: string
  /** 업로드 응답 통째 — 제출 시 fileGuids 는 uploaded.guid, 표시(fileNm/fileSz)는 orgnlFileNm/fileSz. */
  uploaded: UploadedFile
}

export function BfhdSrngAplyPage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as MockBidPrgrsItem | null) ?? MOCK_DETAIL
  // 첨부파일은 사용자가 추가하는 목록 — 설계서 mockup 초기 '총 0건'.
  const [files, setFiles] = useState<BfhdSrngAtchFile[]>([])
  const [addOpen, setAddOpen] = useState(false) // [공통] 파일 추가 시트
  const [confirmOpen, setConfirmOpen] = useState(false) // 제출확인 모달
  // 실패 안내 모달(null=닫힘) — 신청 제출 실패 안내.
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null)
  const fileAddRef = useRef<FileAddHandle>(null)
  const removeFile = fbQueries.useRemoveFile()
  const applyBfhdSrng = bdQueries.useApplyBfhdSrng()

  // 공고일반(dmt_bidPbancInfo) — 설계서 slide94 표 1 항목 순서/명칭 그대로.
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

  // 업체내역(dmt_bzentyInfo) — 설계서 slide94 표 2. 주민등록번호는 v1.83 개정에서 삭제됨.
  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: '00000' },
    { label: '업체명', value: '㈜업체명표기영역' },
    { label: '대표자', value: '홍길동' },
    { label: '사업자등록번호', value: '123-56-78901' },
    { label: '전화번호', value: '02-1234-5678' },
    { label: '주소', value: '서울특별시 …' },
  ]

  const handleRemove = (guid: string) => {
    removeFile.mutate(guid)
    setFiles((prev) => prev.filter((f) => f.uploaded.guid !== guid))
  }

  // 제출확인 모달 확정 → 사전심사 신청 제출. 실패 시 AlertModal 안내.
  const handleConfirmApply = async () => {
    try {
      await applyBfhdSrng.mutateAsync({
        pbancNo: detail.pbancNo,
        fileGuids: files.map((f) => f.uploaded.guid),
      })
      navigate(-1)
    } catch (err) {
      setAlert({
        title: '사전심사 신청 실패',
        message:
          (err as ApiError | null)?.message ??
          '사전심사 신청에 실패했습니다. 잠시 후 다시 시도해주세요.',
      })
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 페이지 표준: full-bleed(자체 px-krds-8 가 페이지 좌우 패딩 제공). px 래퍼로 감싸지 않는다. */}
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

      {/* ① 업무도움 — 접힘 기본 */}
      <Infobox title="업무도움" items={HELP_ITEMS} />

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <Accordion type="multiple" defaultValue={['pbanc', 'bzenty', 'file']}>
          {/* ② 공고일반 */}
          <AccordionSection value="pbanc" title="공고일반" variant="blue" borderTop={false} flush>
            <Table rows={pbancRows} />
          </AccordionSection>
          {/* ③ 업체내역 */}
          <AccordionSection value="bzenty" title="업체내역" variant="blue" flush>
            <Table rows={bzentyRows} />
          </AccordionSection>
          {/* ④ 첨부파일 — 파일 추가([공통] FileAdd) + 서류명/파일칩 행 */}
          <AccordionSection
            value="file"
            title="첨부파일"
            titleInfo={`총 ${files.length}건`}
            variant="blue"
            flush
          >
            <div className="flex flex-col gap-krds-8">
              {files.map((file) => (
                <div key={file.uploaded.guid} className="flex flex-col gap-krds-3">
                  <span className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                    {file.adocNm}
                  </span>
                  <FileDownloadList
                    files={[
                      {
                        id: file.uploaded.guid,
                        name: file.uploaded.orgnlFileNm,
                        size: formatFileSize(file.uploaded.fileSz),
                        onRemove: () => handleRemove(file.uploaded.guid),
                      },
                    ]}
                  />
                </div>
              ))}

              {/* '파일 추가' 버튼 — [공통] 파일 추가 시트 열기 */}
              <FileDownloadList files={[]} onAddFile={() => setAddOpen(true)} />
            </div>
          </AccordionSection>
        </Accordion>

        {/* ⑤ 사전심사 신청 확약문 — 설계서 문구 그대로 */}
        <p className="px-krds-5 text-krds-body-md leading-relaxed text-krds-text-ink">
          위 공사에 대한 입찰참가자격심사서류를 붙임과 같이 제출하오니 우리회사(공동수급체구성원
          포함)에 대하여 붙임 자료에 의거 입찰참가자격을 심사(향후 적격심사 포함)하여 주시기 바라며,
          만일 제출 서류가 귀 부대 심사기준 제10조 제2항의 기준에 저촉되면 귀 부대 심사기준에 따라
          조치하여도 아무런 이의를 제기하지 않겠음을 확약합니다.
        </p>

        {/* footer — 신청하기/취소 */}
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '신청하기', variant: 'primary', onClick: () => setConfirmOpen(true) },
          ]}
        />
      </div>

      {/* [공통] 파일 추가 — 이 페이지가 컨테이너(BottomSheet)·타이틀·footer 소유, 콘텐츠는 FileAdd.
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
              setFiles((prev) => [
                ...prev,
                ...picked.map((p) => ({ adocNm: docNm, uploaded: p.uploaded })),
              ])
            }
          />
        )}
      </BottomSheet>

      {/* 제출확인 */}
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="check"
        title="사전심사 신청서를 제출하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: handleConfirmApply }}
      />

      {/* 첨부 검증/신청 제출 실패 안내 */}
      <AlertModal
        open={alert !== null}
        onOpenChange={(open) => {
          if (!open) setAlert(null)
        }}
        variant="error"
        title={alert?.title ?? ''}
        description={alert?.message}
        primaryAction={{ label: '확인', onClick: () => setAlert(null) }}
      />
    </div>
  )
}
BfhdSrngAplyPage.displayName = 'BfhdSrngAplyPage'
