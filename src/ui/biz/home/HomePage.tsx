import { Link } from 'react-router-dom'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { PageContainer } from '@/ui/common/layout/PageContainer'
import { ROUTES } from '@/constants/routes'

// 홈 = 링크 허브. 각 링크 클릭 시 해당 빈 페이지로 이동한다.
const MENU_LINKS: ReadonlyArray<{
  label: string
  desc: string
  to: string
  iconName: IconName
}> = [
  { label: '조달계획', desc: '조달계획 목록·등록', to: ROUTES.PROCUREMENT, iconName: 'Description' },
  { label: '입찰공고', desc: '입찰공고 조회', to: ROUTES.NOTICE, iconName: 'Campaign' },
  { label: '알림', desc: '알림 내역 확인', to: ROUTES.NOTIFICATION, iconName: 'Notifications' },
  { label: '마이페이지', desc: '내 정보 및 설정', to: ROUTES.MYPAGE, iconName: 'Person' },
]

export function HomePage() {
  return (
    <PageContainer title="홈">
      <ul className="space-y-3">
        {MENU_LINKS.map(({ label, desc, to, iconName }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 active:bg-accent"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Icon name={iconName} size={20} aria-hidden />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-semibold text-card-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
