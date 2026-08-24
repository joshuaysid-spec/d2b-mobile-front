// 군수품무역대리업 신청 내역 상세 (MUI-CM-01-M16, DfEqpmntTradeAgncAplyDtlPage).
// Figma 정본 10020:83224 1:1. 설계서 00.공통 v0.84 slide179~181 항목명 준수.
// 구성(위→아래, Figma): 요약(SummaryInfo: 구분 배지 + 접수번호 + 신청일자/처리일시) → 기본정보(SectionTitle+Table)
//   → 연락처/이메일(SectionTitle+Table) → 반려사유(SectionTitle+TextArea) → 첨부파일(SectionTitle 총N건 + FileDownloadList)
//   → footer [군수품무역대리업 등록증 발급](primary) / [군수품무역대리업 신청하기](secondary).
// 상단은 목록에서 넘어온 항목(navigate state)으로 그리고(service 스텁 없음), 본문/첨부는 페이지 목업(설계서 항목명 준수).
//   직접 URL 진입(state 없음) 대비 페이지 fallback 목업. 데이터 연동 시 목업만 실제 조회로 교체.
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { TextArea } from '@/ui/common/base/TextArea'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  DfEqpmntTradeAgncAplyInfo,
  DfEqpmntTradeAgncAplyItem,
  DfEqpmntTradeAgncAtchFile,
} from '@/types/cm'

// ── 페이지 fallback 목업(직접 URL 진입 시) — 목록 카드(dl_dfEqpmntTradAgncAplyList) 1건 형식. ──
const FALLBACK_ITEM: DfEqpmntTradeAgncAplyItem = {
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
const MOCK_INFO: DfEqpmntTradeAgncAplyInfo = {
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
  atrzRjctRsn: '', // 반려 시에만 값(설계서 slide179 '반려 사유가 있는 경우 내역 표시')
}

// ── 첨부서류(dl_dfEqpmntTradAgncAplyAtchFileList, Figma 총 1건) — 첨부서류명(fileTtl)+첨부파일명(fileNm)+첨부일자. ──
const MOCK_FILES: DfEqpmntTradeAgncAtchFile[] = [
  { id: '1', fileTtl: '이력서', fileNm: '신분증.jpg', size: '2.01MB', regYmd: '2026-01-01' },
]

function baseRows(info: DfEqpmntTradeAgncAplyInfo): TableRow[] {
  return [
    { label: '업태', value: info.bzstatCdNm },
    { label: '상호', value: info.bzentyNm },
    { label: '대표자성명', value: info.rprsvNm },
    { label: '사업자번호', value: info.brno },
    { label: '설립일자', value: info.fndnYmd },
    { label: '주소', value: info.bzentyAddr },
  ]
}
function contactRows(info: DfEqpmntTradeAgncAplyInfo): TableRow[] {
  return [
    { label: '연락처', value: info.bzentyTelno },
    { label: '팩스', value: info.bzentyFxno },
    { label: '이메일', value: info.bzentyEmlAddr },
  ]
}

export function DfEqpmntTradeAgncAplyDtlPage() {
  const navigate = useNavigate()
  // 목록에서 넘어온 항목으로 상단을 그린다. 직접 진입(state 없음)이면 페이지 fallback 목업.
  const item = (useLocation().state as DfEqpmntTradeAgncAplyItem | null) ?? FALLBACK_ITEM

  const downloadFiles: FileDownloadItem[] = MOCK_FILES.map((f) => ({
    id: f.id,
    name: f.fileNm as string,
    size: f.size,
    onDownload: () => console.log('[M16] 첨부파일 다운로드', f.fileNm), // 추후: fbService.download(fileGuid)
  }))

  // ── 액션 스텁 ──
  const handleIssue = () => console.log('[M16] 군수품무역대리업 등록증 발급(OZPrint PVB021)') // 추후: 등록증 발급(승인 시)
  const goApply = () => navigate(ROUTES.DF_EQPMNT_TRADE_AGNC) // 신청하기 → 목록(신규/갱신/변경 선택)

  return (
    <div className="flex w-full flex-col">
      {/* 상단 요약 — 구분 배지 + 접수번호 title + 신청일자/처리일시. */}
      <SummaryInfo
        badges={[{ label: item.regAplySecd }]}
        title={`접수번호 ${item.rcptNo}`}
        rows={[
          { label: '신청일자', value: item.rcptYmd || MOCK_INFO.rcptYmd },
          { label: '처리일시', value: MOCK_INFO.atrzYmd || '-' },
        ]}
      />

      {/* 기본정보 */}
      <SectionTitle topDivider>기본정보</SectionTitle>
      <div className="px-4 py-krds-7">
        <Table rows={baseRows(MOCK_INFO)} />
      </div>

      {/* 연락처 / 이메일 */}
      <SectionTitle topDivider>연락처 / 이메일</SectionTitle>
      <div className="px-4 py-krds-7">
        <Table rows={contactRows(MOCK_INFO)} />
      </div>

      {/* 반려사유 — 조회 전용(disabled TextArea). 반려 사유가 있으면 표시(설계서 slide179). */}
      <SectionTitle topDivider>반려사유</SectionTitle>
      <div className="px-4 py-krds-7">
        <TextArea
          disabled
          value={MOCK_INFO.atrzRjctRsn ?? ''}
          placeholder="내용을 입력하세요."
          aria-label="반려사유"
        />
      </div>

      {/* 첨부파일 — 총 N건 + 다운로드. */}
      <SectionTitle topDivider info={`총 ${MOCK_FILES.length}건`}>
        첨부파일
      </SectionTitle>
      <div className="flex flex-col gap-krds-8 px-4 py-krds-7">
        {MOCK_FILES.map((f) => (
          <div key={f.id} className="flex flex-col gap-krds-3">
            <div className="flex items-center justify-between gap-krds-5">
              <span className="text-[17px] font-medium leading-normal text-krds-text-ink">{f.fileTtl}</span>
              <span className="shrink-0 text-[15px] leading-normal text-krds-text-muted">{f.regYmd}</span>
            </div>
            <FileDownloadList files={downloadFiles.filter((d) => d.id === f.id)} />
          </div>
        ))}
      </div>

      {/* 하단 액션 — [등록증 발급](primary) / [신청하기](secondary). Figma 10020:83224 세로 2버튼.
          ※ Figma 는 두 버튼 모두 표시. 설계서/이전 지시는 등록증 발급을 '승인 시' 조건 — 조건 배선은 추후. */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="vertical"
          items={[
            { label: '군수품무역대리업 등록증 발급', variant: 'primary', onClick: handleIssue },
            { label: '군수품무역대리업 신청하기', variant: 'secondary', onClick: goApply },
          ]}
        />
      </div>
    </div>
  )
}
DfEqpmntTradeAgncAplyDtlPage.displayName = 'DfEqpmntTradeAgncAplyDtlPage'
