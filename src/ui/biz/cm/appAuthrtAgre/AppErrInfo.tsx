// MUI-MS-01-P05 앱오류안내 팝업 (설계서 00.공통 / Figma 10020:87100)
// 앱을 실행할 수 없는 사유(시스템 보안 업데이트 등)를 안내하고 [앱 종료] 만 제공하는 AlertModal 기반 팝업.
// 스플래시(M01) 실행 점검에서 "오류" 판정 시 부모가 open. 라우트 아님(호스트 미배선).
//
// 근사(보고):
//  - Figma 타이틀 좌측정렬 → 공통 AlertModal 중앙정렬로 근사. 본문/사유는 좌측정렬로 맞춤.
//  - Figma 의 [앱 종료] 는 아웃라인(라인) 버튼이나, AlertModal 단일버튼은 primary(채움) 고정이라 채움으로 근사.
import { AlertModal } from '@/ui/common/composites/AlertModal'

// 앱 실행 오류 사유 — 설계서 예시(시스템 보안 업데이트 안내). 제목 + 내용 형태로 목록 구동.
interface ErrReason {
  id: string
  /** 사유 제목 (예: 시스템 보안 업데이트) */
  title: string
  /** 사유 상세 */
  detail: string
}

const ERR_REASONS: ErrReason[] = [
  {
    id: 'security-update',
    title: '시스템 보안 업데이트',
    detail:
      '국방전자조달시스템 보안 업데이트를 진행하고 있습니다. 예정시간: 2025년 03월 13일 00시부터 04시까지 (4시간)',
  },
]

export interface AppErrInfoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppErrInfo({ open, onOpenChange }: AppErrInfoProps) {
  const handleExit = () => {
    // 추후 네이티브 브리지: 앱 종료.
    console.log('[AppErrInfo] 앱 종료')
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      variant="none"
      title="앱 실행 오류 안내"
      description={
        <div className="flex flex-col gap-krds-5 text-left">
          <p className="text-krds-body-md text-krds-text-ink">
            다음과 같은 이유로 인하여 앱을 실행할 수 없습니다.
            <br />
            서비스 사용에 불편을 드려 죄송합니다.
          </p>
          {ERR_REASONS.map((reason) => (
            <div key={reason.id} className="flex flex-col gap-krds-3">
              <span className="text-krds-body-md font-bold text-krds-text-ink">
                {reason.title}
              </span>
              <p className="text-krds-body-md text-krds-text-ink">
                {reason.detail}
              </p>
            </div>
          ))}
        </div>
      }
      primaryAction={{ label: '앱 종료', onClick: handleExit }}
    />
  )
}
AppErrInfo.displayName = 'AppErrInfo'
