// OZ 리포트 출력 풀팝업 — 전 화면 [출력]/[등록증 발급] 공용 껍데기(2026-09-15 사용자 확정 구조).
//   출력 버튼은 이 팝업만 열고, 팝업은 OzReportViewer 를 담기만 한다. 뷰어 스크립트 로드·OZ 서버 통신은 전부 OzReportViewer 안.
//   OZ HTML5 JS 뷰어는 별도 화면이 아니라 우리 div 안에 렌더되는 방식 → 모달(우리) 안에 뷰어(OZ) 를 넣는 구조가 정본.
//   반입 후 할 일: .env.production 의 VITE_OZ_VIEWER_URL/VITE_OZ_SERVLET_URL 기입 + OzReportViewer 의 ⚠️ 항목 설치본 대조. 32개 화면 무수정.
// 사용: const oz = useOzReport() → 버튼 onClick={() => oz.open('PVB021', { rcptNo })} → <OzReportFullPopup {...oz.popupProps} />
//   (훅은 ./useOzReport — 컴포넌트 파일에서 훅을 export 하면 react-refresh 경고라 분리.)
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { OzReportViewer } from '@/ui/biz/cm/ozReport/OzReportViewer'

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

export function OzReportFullPopup({ request, onOpenChange }: OzReportFullPopupProps) {
  return (
    <FullPopup open={request !== null} onOpenChange={onOpenChange} title={request?.title ?? '출력'}>
      {request && <OzReportViewer request={request} />}
    </FullPopup>
  )
}
OzReportFullPopup.displayName = 'OzReportFullPopup'
