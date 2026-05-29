// 공통 에러 화면 — router errorElement 로 연결되는 풀페이지 페이지.
// 라우트(또는 그 하위 lazy 청크) 렌더/로더에서 throw 되면 React Router 가 이 화면으로 대체한다.
// 흔한 케이스: lazy 청크 로드 실패(네트워크 끊김·배포 후 캐시된 구버전), 404, 렌더 throw.
//   → "다시 시도"(캐시 무시 리로드) / "홈으로".
//
// 기존 ChunkErrorBoundary 의 재시도 UX 를 흡수 — 청크 실패도 errorElement 가 잡는다.
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { ROUTES } from '@/constants/routes'

export function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  // 추후 Sentry 등 외부 로거 연동 자리 — 실제 에러일 때만 로깅.
  if (error) console.error('[ErrorPage]', error)

  // errorElement 로 잡힌 404 응답이거나, catch-all(path:'*') element 로 렌더돼
  // 에러 객체가 없는 경우(= 경로 미매칭) 둘 다 404 화면으로 본다.
  const is404 = isRouteErrorResponse(error) ? error.status === 404 : error == null

  const title = is404 ? '페이지를 찾을 수 없습니다.' : '페이지를 불러오지 못했습니다.'
  const desc = is404
    ? '주소가 변경되었거나 삭제된 페이지일 수 있습니다.'
    : '네트워크 연결을 확인하시거나 다시 시도해주세요.'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center gap-krds-8 bg-background p-krds-10 text-center">
      <Icon
        name={is404 ? 'Search' : 'Warning'}
        size={40}
        color="var(--krds-feedback-danger)"
        aria-hidden
      />
      <div className="flex flex-col gap-krds-3">
        <h1 className="text-krds-body-md font-bold text-krds-text-ink">{title}</h1>
        <p className="text-krds-body-sm text-krds-text-muted">{desc}</p>
      </div>
      <div className="flex gap-krds-5">
        <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)}>
          <Icon name="Home" />
          홈으로
        </Button>
        {!is404 && (
          // 캐시 무시 리로드 — 배포 후 구버전 청크 path 못 찾는 케이스 해소.
          <Button variant="primary" onClick={() => window.location.reload()}>
            <Icon name="Refresh" />
            다시 시도
          </Button>
        )}
      </div>
    </main>
  )
}
