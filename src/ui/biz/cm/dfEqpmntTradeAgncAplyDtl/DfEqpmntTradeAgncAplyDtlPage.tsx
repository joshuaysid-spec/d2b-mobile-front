// 군수품무역대리업 신청 내역 상세 (MUI-CM-01-M16, DfEqpmntTradeAgncAplyDtlPage).
// 설계서 00.공통 v0.86 slide184(레이아웃)·185(항목설명 dm_dfEqpmntTradAgncAplyInfo) 준수.
// 구성(위→아래, 설계서 그대로 — 아코디언, 사용자 확정 2026-08-24):
//   요약(SummaryInfo: 구분·진행상황 배지 + 접수번호)
//   → Accordion [업체정보(업태~주소 + 반려사유(있는 경우만)) / 접수정보(접수번호/신청일시/처리일시/처리구분) /
//      첨부파일 - 총 N건(등록신청서·이력서·청렴서약서·고용현황·기타 + 다운로드)]
//      — 섹션 순서 설계서 slide184 그대로: 업체정보 → 접수정보 → 첨부파일(사용자 확정 2026-08-25).
//   → footer [군수품무역대리업 등록증 발급](primary). ([신청하기] 버튼은 삭제 — 사용자 확정 2026-08-24.)
// 상단은 목록에서 넘어온 항목(navigate state)으로 그리고(service 스텁 없음), 본문/첨부는 페이지 목업(설계서 항목명 준수).
//   직접 URL 진입(state 없음) 대비 페이지 fallback 목업. 데이터 연동 시 목업만 실제 조회로 교체.
import { useLocation } from 'react-router-dom'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  DfEqpmntTradeAgncAplyInfo,
  DfEqpmntTradeAgncAplyItem,
  DfEqpmntTradeAgncAtchFile,
} from '@/types/mock/cm'

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


// ── 첨부서류(dl_dfEqpmntTradAgncAplyAtchFileList, 설계서 slide184 예시 5종) — 첨부서류명(fileTtl)+첨부파일명(fileNm). ──
const MOCK_FILES: DfEqpmntTradeAgncAtchFile[] = [
  { id: '1', fileTtl: '등록신청서', fileNm: '등록신청서.hwp', size: '786KB', regYmd: '2026-05-01' },
  { id: '2', fileTtl: '이력서', fileNm: '이력서(홍길동).hwp', size: '512KB', regYmd: '2026-05-01' },
  { id: '3', fileTtl: '청렴서약서', fileNm: '청렴서약서.hwp', size: '324KB', regYmd: '2026-05-01' },
  { id: '4', fileTtl: '고용현황', fileNm: '고용현황.hwp', size: '1.02MB', regYmd: '2026-05-01' },
  { id: '5', fileTtl: '기타', fileNm: '기타증빙.hwp', size: '2.01MB', regYmd: '2026-05-01' },
]

// 접수정보(설계서 slide184 ① — 접수번호/신청일시/처리일시/처리구분)
function rcptRows(
  item: DfEqpmntTradeAgncAplyItem,
  info: DfEqpmntTradeAgncAplyInfo,
): TableRow[] {
  return [
    { label: '접수번호', value: item.rcptNo || info.rcptNo },
    { label: '신청일시', value: item.rcptYmd || info.rcptYmd },
    { label: '처리일시', value: info.atrzYmd || '-' },
    { label: '처리구분', value: info.atrzStcd || '-' },
  ]
}
// 업체정보(설계서 slide184 — 업태~주소 + 반려사유(반려 사유가 있는 경우 내역 표시))
function bzentyRows(info: DfEqpmntTradeAgncAplyInfo): TableRow[] {
  return [
    { label: '업태', value: info.bzstatCdNm },
    { label: '상호', value: info.bzentyNm },
    { label: '대표자성명', value: info.rprsvNm },
    { label: '전화번호', value: info.bzentyTelno },
    { label: '팩스번호', value: info.bzentyFxno },
    { label: 'E-mail', value: info.bzentyEmlAddr },
    { label: '사업자번호', value: info.brno },
    { label: '설립일자', value: info.fndnYmd },
    { label: '주소', value: info.bzentyAddr },
    ...(info.atrzRjctRsn ? [{ label: '반려사유', value: info.atrzRjctRsn }] : []),
  ]
}

export function DfEqpmntTradeAgncAplyDtlPage() {
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

  return (
    <div className="flex w-full flex-col">
      {/* 상단 요약 — 구분·진행상황 배지 + 접수번호 title(설계서 slide184 상단 카드). */}
      <SummaryInfo
        badges={[{ label: item.regAplySecd }, { label: item.aprvSecdNm }]}
        title={`접수번호 ${item.rcptNo}`}
      />

      {/* 본문 — 설계서 slide184 섹션 순서 그대로(업체정보 → 접수정보 → 첨부파일), 아코디언. */}
      <Accordion type="multiple" defaultValue={['bzenty', 'rcpt', 'atch']} className="w-full">
        {/* 업체정보 — 업태~주소 + 반려사유(반려 사유가 있는 경우 내역 표시) */}
        <AccordionSection value="bzenty" title="업체정보" borderTop={false}>
          <Table rows={bzentyRows(MOCK_INFO)} />
        </AccordionSection>
        {/* 접수정보 — 접수번호/신청일시/처리일시/처리구분 */}
        <AccordionSection value="rcpt" title="접수정보">
          <Table rows={rcptRows(item, MOCK_INFO)} />
        </AccordionSection>
        {/* 첨부파일 — 총 N건(설계서 5종: 등록신청서·이력서·청렴서약서·고용현황·기타) + 다운로드 */}
        <AccordionSection value="atch" title={`첨부파일 - 총 ${MOCK_FILES.length}건`}>
          <div className="flex flex-col gap-krds-8">
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
        </AccordionSection>
      </Accordion>

      {/* 하단 액션 — [등록증 발급](primary) 단독. [신청하기] 삭제(사용자 확정 2026-08-24).
          ※ 설계서/이전 지시는 등록증 발급을 '승인 시' 조건 — 조건 배선은 추후. */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="vertical"
          items={[{ label: '군수품무역대리업 등록증 발급', variant: 'primary', onClick: handleIssue }]}
        />
      </div>
    </div>
  )
}
DfEqpmntTradeAgncAplyDtlPage.displayName = 'DfEqpmntTradeAgncAplyDtlPage'
