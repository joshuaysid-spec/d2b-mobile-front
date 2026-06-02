// 조달계획 상세 — 빈 화면(이번 사이클은 라우팅 동작 확인용, 콘텐츠 추후).
// Design Ref: op-list-page.design §5.3 — 카드 클릭 → /op/:id 진입.
import { useParams } from 'react-router-dom'

import { PageContainer } from '@/ui/common/layout/PageContainer'

export function OpDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <PageContainer title="조달계획 상세">
      <p className="text-krds-body-md text-krds-text-subtle">
        상세 화면 (준비 중) — id: {id}
      </p>
    </PageContainer>
  )
}
