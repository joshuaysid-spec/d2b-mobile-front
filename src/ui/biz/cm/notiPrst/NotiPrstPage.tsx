import { useEffect } from 'react'

import { PageContainer } from '@/ui/common/layout/PageContainer'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { Badge } from '@/ui/common/base/Badge'
import { useAuthStore } from '@/stores/authStore'

// 알림현황(MUI-MS-01-M13, 영문ID NotiPrst) — 카테고리별 알림 목록.
// 기존 공통(CardList + Card 슬롯 + Badge)을 조립. 신규 컴포넌트 없음.

interface NotiItem {
  id: string
  category: string
  title: string
  date: string
  read: boolean
}

// 카테고리 → Badge 색상 매핑. 디자인 토큰(Badge color)만 사용, 하드코딩 색 금지.
const CATEGORY_COLOR: Record<string, 'blue' | 'red' | 'yellow' | 'green'> = {
  입찰공고: 'blue',
  계약: 'green',
  공지: 'yellow',
  대금청구: 'red',
}

// 추후 API: cmService.selectNotiList()
const MOCK_NOTIFICATIONS: NotiItem[] = [
  {
    id: 'noti-1',
    category: '입찰공고',
    title: '[긴급] 사무용 가구 구매 입찰공고가 등록되었습니다.',
    date: '2026-06-18 09:12',
    read: false,
  },
  {
    id: 'noti-2',
    category: '계약',
    title: '계약서 검토 요청 — 정보시스템 유지보수 용역',
    date: '2026-06-17 16:40',
    read: false,
  },
  {
    id: 'noti-3',
    category: '대금청구',
    title: '대금청구 건이 승인 처리되었습니다.',
    date: '2026-06-17 11:05',
    read: true,
  },
  {
    id: 'noti-4',
    category: '공지',
    title: '시스템 정기 점검 안내 (06/20 00:00 ~ 04:00)',
    date: '2026-06-16 18:30',
    read: true,
  },
  {
    id: 'noti-5',
    category: '입찰공고',
    title: '관심 입찰공고의 마감일이 임박했습니다.',
    date: '2026-06-15 10:22',
    read: true,
  },
  {
    id: 'noti-6',
    category: '계약',
    title: '계약 이행 단계가 변경되었습니다 — 착수 → 진행중',
    date: '2026-06-14 13:58',
    read: true,
  },
]

// 알림 화면 진입 = 읽음 처리. 미읽음 구분(점/볼드)은 진입 시점의 목업 상태로 표시.
function buildItems(items: NotiItem[]): CardListItem[] {
  return items.map((noti) => ({
    id: noti.id,
    // 뱃지 = 카테고리 + (미확인일 때만) '미확인' 뱃지. 읽음(확인)은 별도 표기 없음.
    badges: (
      <>
        <Badge type="pastel" color={CATEGORY_COLOR[noti.category] ?? 'blue'}>
          {noti.category}
        </Badge>
        {!noti.read && (
          <Badge type="pastel" color="red">
            미확인
          </Badge>
        )}
      </>
    ),
    title: noti.title,
    // 날짜 = label 슬롯(좌측 muted) 으로 두어 제목·뱃지와 좌측 정렬 통일. Card 무수정.
    rows: [{ label: noti.date, value: '' }],
    // 추후 라우팅: 알림 상세/대상 화면 (링크 미정)
    onClick: () => {
      /* 추후 라우팅: 알림 상세/대상 화면 (링크 미정) */
    },
  }))
}

export function NotiPrstPage() {
  const markAllRead = useAuthStore((s) => s.markAllRead)

  // 알림 화면 진입 = 읽음 처리 → BottomNav dot 제거.
  // 추후 API: cmService.markAllRead() 호출 후 store 동기화.
  useEffect(() => {
    markAllRead()
  }, [markAllRead])

  const items = buildItems(MOCK_NOTIFICATIONS)

  return (
    <PageContainer title="알림현황">
      <CardList items={items} emptyText="알림이 없습니다." />
    </PageContainer>
  )
}
