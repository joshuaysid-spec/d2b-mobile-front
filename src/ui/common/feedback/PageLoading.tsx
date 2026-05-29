// Suspense fallback — 페이지 전체 로딩 상태.
// 재사용 가능한 base/Spinner 아톰을 가운데에 배치만 함. 색·사이즈 변경은 Spinner 의 prop 으로.
import { Spinner } from '@/ui/common/base/Spinner'

export function PageLoading() {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <Spinner size={32} srLabel="페이지를 불러오는 중입니다." />
    </div>
  )
}
