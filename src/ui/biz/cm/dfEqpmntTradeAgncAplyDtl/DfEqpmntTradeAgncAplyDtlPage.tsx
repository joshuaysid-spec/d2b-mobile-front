// 군수품무역대리업 신청 내역 상세 (MUI-CM-01-M16, DfEqpmntTradeAgncAplyDtlPage).
// Figma 정본 10020:83224(군수품무역대리업 상세정보, 260827 재대조). 설계서 v0.86 slide184~185 항목명 준수.
// 구성(위→아래, Figma): 요약(SummaryInfo: 구분 배지 + 접수번호 + 신청일자/처리일자)
//   → 기본정보(Table: 업태/상호/대표자성명/사업자번호/설립일자/주소)
//   → 연락처 / 이메일(Table: 연락처/팩스/이메일)
//   → 반려사유(TextArea ReadOnly — 반려 아니어도 영역 표시, Figma)
//   → 첨부파일(총 N건 — 서류명·일자 + 다운로드)
//   → footer [군수품무역대리업 등록증 발급](primary) 1종([신청하기]는 검토 45번으로 제외 — 신청은 목록 M15 하단 바에서).
// 상단은 목록에서 넘어온 항목(navigate state)으로 그리고(service 스텁 없음), 본문/첨부는 페이지 목업(설계서 항목명 준수).
//   직접 URL 진입(state 없음) 대비 페이지 fallback 목업. 데이터 연동 시 목업만 실제 조회로 교체.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { TextArea } from '@/ui/common/base/TextArea'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Toast } from '@/ui/common/composites/Toast'
import type {
  MockDfEqpmntTradeAgncAplyInfo,
  MockDfEqpmntTradeAgncAplyItem,
  MockDfEqpmntTradeAgncAtchFile,
} from '@/types/mock/cm'

// ── 페이지 fallback 목업(직접 URL 진입 시) — 목록 카드(dl_dfEqpmntTradAgncAplyList) 1건 형식. ──
const FALLBACK_ITEM: MockDfEqpmntTradeAgncAplyItem = {
  id: '0',
  regAplySecd: '신규',
  rcptNo: '2026-0020',
  rcptYmd: '2026-05-01',
  aprvYmd: '',
  ersrYmd: '',
  expryYmd: '',
  aprvSecdNm: '저장',
}

// ── 신청 접수·업체 정보(dm_dfEqpmntTradAgncAplyInfo, Figma 10020:83224 예시값) — 추후 API. ──
const MOCK_INFO: MockDfEqpmntTradeAgncAplyInfo = {
  rcptNo: '2026-0020',
  rcptYmd: '2026-05-01',
  atrzYmd: '2026-05-22',
  atrzStcd: '신규',
  regAplySecd: '신규',
  bzstatCdNm: '제조',
  bzentyNm: '조달테스트',
  rprsvNm: '홍길동',
  bzentyTelno: '02-1234-5678',
  bzentyFxno: '02-1234-7890',
  bzentyEmlAddr: 'test@dapa.go.kr',
  brno: '123-45-67890',
  fndnYmd: '2026-05-22',
  bzentyAddr: '대전광역시 서부 월평중로 21 방위사업청',
  atrzRjctRsn: '', // 반려 시에만 값 — Figma 는 빈 값이어도 반려사유 영역 표시
}

// ── 첨부서류(dl_dfEqpmntTradAgncAplyAtchFileList, 설계서 slide184 예시) — 첨부서류명(fileTtl)+첨부파일명(fileNm). ──
const MOCK_FILES: MockDfEqpmntTradeAgncAtchFile[] = [
  { id: '1', fileTtl: '등록신청서', fileNm: '등록신청서.hwp', size: '786KB', regYmd: '2026-05-01' },
  { id: '2', fileTtl: '이력서', fileNm: '이력서(홍길동).hwp', size: '512KB', regYmd: '2026-05-01' },
  { id: '3', fileTtl: '청렴서약서', fileNm: '청렴서약서.hwp', size: '324KB', regYmd: '2026-05-01' },
  { id: '4', fileTtl: '고용현황', fileNm: '고용현황.hwp', size: '1.02MB', regYmd: '2026-05-01' },
  { id: '5', fileTtl: '기타', fileNm: '기타증빙.hwp', size: '2.01MB', regYmd: '2026-05-01' },
]

// 기본정보(Figma 83224 — 연락처류 제외)
function basicRows(info: MockDfEqpmntTradeAgncAplyInfo): TableRow[] {
  return [
    { label: '업태', value: info.bzstatCdNm },
    { label: '상호', value: info.bzentyNm },
    { label: '대표자성명', value: info.rprsvNm },
    { label: '사업자번호', value: info.brno },
    { label: '설립일자', value: info.fndnYmd },
    { label: '주소', value: info.bzentyAddr },
  ]
}
// 연락처 / 이메일(Figma 83224)
function contactRows(info: MockDfEqpmntTradeAgncAplyInfo): TableRow[] {
  return [
    { label: '연락처', value: info.bzentyTelno },
    { label: '팩스', value: info.bzentyFxno },
    { label: '이메일', value: info.bzentyEmlAddr },
  ]
}

export function DfEqpmntTradeAgncAplyDtlPage() {
  // 목록에서 넘어온 항목으로 상단을 그린다. 직접 진입(state 없음)이면 페이지 fallback 목업.
  const item = (useLocation().state as MockDfEqpmntTradeAgncAplyItem | null) ?? FALLBACK_ITEM

  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const downloadFiles: FileDownloadItem[] = MOCK_FILES.map((f) => ({
    id: f.id,
    name: f.fileNm as string,
    size: f.size,
    onDownload: () => handleDownload(f.id, f.fileNm as string),
  }))

  // ── 액션 스텁 ──
  const handleIssue = () => console.log('[M16] 군수품무역대리업 등록증 발급(OZPrint PVB021)') // 추후: 등록증 발급(승인 시)

  return (
    <div className="flex w-full flex-col">
      {/* 상단 요약 — 구분 배지 + 접수번호 + 신청일자/처리일자(Figma 83224). */}
      <SummaryInfo
        badges={[{ label: item.regAplySecd }]}
        title={`접수번호 ${item.rcptNo}`}
        rows={[
          { label: '신청일자', value: item.rcptYmd || MOCK_INFO.rcptYmd },
          { label: '처리일자', value: MOCK_INFO.atrzYmd || '-' },
        ]}
      />

      {/* 기본정보 */}
      <SectionTitle topDivider>기본정보</SectionTitle>
      <div className="px-4 pt-krds-7">
        <Table rows={basicRows(MOCK_INFO)} />
      </div>

      {/* 연락처 / 이메일 */}
      <SectionTitle topDivider className="mt-krds-8">
        연락처 / 이메일
      </SectionTitle>
      <div className="px-4 pt-krds-7">
        <Table rows={contactRows(MOCK_INFO)} />
      </div>

      {/* 반려사유 — 반려 아니어도 영역 표시(Figma 83224), ReadOnly. */}
      <SectionTitle topDivider className="mt-krds-8">
        반려사유
      </SectionTitle>
      <div className="px-4 pt-krds-7">
        <TextArea
          readOnly
          value={MOCK_INFO.atrzRjctRsn}
          placeholder="내용을 입력하세요."
          aria-label="반려사유"
        />
      </div>

      {/* 첨부파일 — 총 N건 + 서류명·첨부일자 + 다운로드(Figma 83224). */}
      <SectionTitle topDivider info={`총 ${MOCK_FILES.length}건`} className="mt-krds-8">
        첨부파일
      </SectionTitle>
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-krds-7">
        {MOCK_FILES.map((f) => (
          <div key={f.id} className="flex flex-col gap-krds-3">
            <div className="flex items-center justify-between gap-krds-5">
              <span className="text-[17px] font-bold leading-normal text-krds-text-ink">{f.fileTtl}</span>
              <span className="shrink-0 text-[15px] leading-normal text-krds-text-muted">{f.regYmd}</span>
            </div>
            <FileDownloadList files={downloadFiles.filter((d) => d.id === f.id)} />
          </div>
        ))}
      </div>

      {/* 하단 액션 — [등록증 발급] 1종. [신청하기]는 제외(v0.87 검토 45번 기획 결론, 사용자 확정 2026-09-15 —
          신규/갱신 신청은 목록(M15) 하단 바에서 진입). 반려사유 위치는 현행(Figma 83224) 유지. */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="single"
          items={[{ label: '군수품무역대리업 등록증 발급', variant: 'primary', onClick: handleIssue }]}
        />
      </div>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </div>
  )
}
DfEqpmntTradeAgncAplyDtlPage.displayName = 'DfEqpmntTradeAgncAplyDtlPage'
