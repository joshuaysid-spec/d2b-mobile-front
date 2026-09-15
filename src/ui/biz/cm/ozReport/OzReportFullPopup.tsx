// OZ 리포트 뷰어 풀팝업 — 전 화면 [출력]/[등록증 발급] 공용 (2026-09-15 사용자 확정 구조).
//   출력 버튼은 이 팝업만 연다. OZ 서버·뷰어는 폐쇄망 내부에만 있어 개발망에서 연동 불가 →
//   지금은 자리 화면(요청 정보 표시)이고, **반입 후 이 컴포넌트 안(renderViewer)만 채우면** 32개 화면 무수정.
//   연동 후보(반입 시 결정): ① OZ 웹뷰어 iframe(뷰어 URL + 리포트 파라미터) ② 서버가 PDF 렌더 → fbQueries 다운로드/뷰어
//   ③ 하이브리드 브리지로 OZ 앱 뷰어 호출. 어느 쪽이든 입력은 OzReportRequest(reportId + params) 하나로 고정.
// 사용: const oz = useOzReport() → 버튼 onClick={() => oz.open('PVB021', { rcptNo })} → <OzReportFullPopup {...oz.popupProps} />
//   (훅은 ./useOzReport — 컴포넌트 파일에서 훅을 export 하면 react-refresh 경고라 분리.)
import { Notice } from '@/ui/common/composites/Notice'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Table, type TableRow } from '@/ui/common/composites/Table'

/** 출력 요청 — 리포트 ID(OZ 리포트 파일/서식 코드, 예 'PVB021'·'R37') + 리포트 파라미터. */
export interface OzReportRequest {
  /** 리포트 식별자 — 설계서 출력물 코드(PVB021, R37~R46 …). 미확정이면 화면 ID 로 잠정. */
  reportId: string
  /** 리포트 파라미터(접수번호·공고번호 등). 값은 문자열/숫자만. */
  params?: Record<string, string | number | undefined>
  /** 팝업 타이틀(출력물명). 기본 '출력'. */
  title?: string
}

export interface OzReportFullPopupProps {
  /** 현재 출력 요청 — null 이면 닫힘. */
  request: OzReportRequest | null
  onOpenChange: (open: boolean) => void
}

// ── 반입 후 연동 지점 — 뷰어 실구현은 이 함수만 교체한다. ──
function renderViewer(req: OzReportRequest) {
  const paramRows: TableRow[] = [
    { label: '리포트 ID', value: req.reportId },
    ...Object.entries(req.params ?? {}).map(([k, v]) => ({ label: k, value: v == null ? '-' : String(v) })),
  ]
  return (
    <div className="flex flex-col gap-krds-7 px-4 py-4">
      <Notice type="urgent" badgeLabel="안내" className="flex-col">
        OZ 리포트 뷰어는 폐쇄망 반입 후 연동됩니다. 아래 요청 정보로 리포트가 호출됩니다.
      </Notice>
      <Table rows={paramRows} />
    </div>
  )
}

export function OzReportFullPopup({ request, onOpenChange }: OzReportFullPopupProps) {
  return (
    <FullPopup open={request !== null} onOpenChange={onOpenChange} title={request?.title ?? '출력'}>
      {request && renderViewer(request)}
    </FullPopup>
  )
}
OzReportFullPopup.displayName = 'OzReportFullPopup'
