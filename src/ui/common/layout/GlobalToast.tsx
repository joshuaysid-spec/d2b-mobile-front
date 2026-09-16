// 전역 토스트 — 앱에 하나만 떠 있는 안내 토스트(2026-09-16 사용자 확정).
//   화면마다 useState + <Toast> 를 두던 중복(71곳)을 대체한다. 부르는 쪽은 문구만 던진다:
//     import { showToast } from '@/stores/authStore'
//     showToast('저장되었습니다.')
//   React 밖(쿼리 훅 onSuccess 등)에서도 같은 함수로 호출된다.
//
// 이 컴포넌트를 App 최상위(RouterProvider 형제)에 두는 이유:
//   ① Toast 가 position:fixed 라 트리 위치와 무관하게 화면 하단에 뜬다.
//   ② 시트·팝업이 닫히면서 그 안의 컴포넌트가 사라져도 안내가 남는다(저장 후 시트 닫힘 사례).
//   ③ 셸(AppLayout) 밖 라우트(스플래시·앱 이용안내·가이드)까지 덮는다.
//
// 띄울지 말지는 부르는 쪽이 정한다 — 같은 훅을 여러 화면이 쓰고 화면마다 안내 방식이 다르기 때문.
//   문구가 그 동작에 늘 따라붙는 경우(관심공고 등록/해제 등)에만 쿼리 훅 onSuccess 에서 부른다.
import { Toast } from '@/ui/common/composites/Toast'
import { useAuthStore } from '@/stores/authStore'

export function GlobalToast() {
  const toast = useAuthStore((s) => s.toast)
  const hideToast = useAuthStore((s) => s.hideToast)

  return (
    // key=seq — 같은 문구를 연달아 띄워도 자동 닫힘 타이머가 다시 시작된다.
    <Toast
      key={toast?.seq}
      open={toast !== null}
      onClose={hideToast}
      duration={toast?.duration ?? 2000}
    >
      {toast?.message}
    </Toast>
  )
}
GlobalToast.displayName = 'GlobalToast'
