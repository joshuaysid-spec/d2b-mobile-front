// MUI-CM-03-M23 통합로그인 계정등록완료 (설계서 00.공통 v0.86 slide36)
// 통합로그인 계정등록(MUI-CM-03-M22, NewIdPwReg)에서 등록 완료 시 이동하는 완료 화면.
// 등록한 통합 ID 를 표시하고 [로그인 바로가기](M01) / [메인홈 바로가기]로 분기.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/new-id/result, header variant='sub' title='통합 로그인 계정 등록 완료').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 데이터: 등록한 통합 ID 는 M22 에서 navigate state 로 전달. 직접 URL 진입 시 설계서 예시값 폴백.
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'

export function NewIdCmptn() {
  const navigate = useNavigate()
  const location = useLocation()
  // 등록한 통합 계정 아이디 — M22 에서 전달. 직접 URL 진입 시 설계서 slide36 예시값(userID1234) 폴백.
  const userId = (location.state as { userId?: string } | null)?.userId ?? 'userID1234'

  return (
    <div className="flex min-h-full flex-col px-krds-8 pb-krds-8">
      {/* 본문 — 완료 아이콘 + 헤딩 + 계정 카드 (세로 중앙) */}
      <div className="flex flex-1 flex-col items-center pt-krds-14">
        <Icon name="CheckCircle" size={72} className="text-krds-text-primary" aria-hidden />

        <h1 className="mt-krds-8 text-center text-krds-heading-sm font-bold leading-normal text-krds-text-ink">
          통합 로그인 계정을 확인해주세요.
        </h1>

        {/* 계정 카드 */}
        <div className="mt-krds-8 w-full rounded-krds-xl bg-krds-bg-secondary px-krds-8 py-krds-9">
          <dl className="flex flex-col gap-krds-2 text-center">
            <dt className="text-krds-body-md font-bold text-krds-text-ink">통합 로그인 계정 아이디</dt>
            <dd className="text-krds-body-md text-krds-text-ink">{userId}</dd>
          </dl>
        </div>
      </div>

      {/* 하단 액션바 — 로그인 바로가기(M01) / 메인홈 바로가기 */}
      <div className="flex flex-col gap-krds-3 pt-krds-9">
        <Button size="lg" className="w-full" onClick={() => navigate('/login')}>
          로그인 바로가기
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/')}>
          메인홈 바로가기
        </Button>
      </div>
    </div>
  )
}
NewIdCmptn.displayName = 'NewIdCmptn'
