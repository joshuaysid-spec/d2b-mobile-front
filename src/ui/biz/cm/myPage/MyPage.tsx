// MUI-CM-06-M01 마이페이지 (MyPage) — 설계서 00.공통 slide75~76 / Figma 10020:83891.
// 마이페이지 목록·서브 메인 화면(웹경로: 메인 홈 > 마이페이지). 셸(AppLayout) 안 + sub헤더 라우트
// (header variant='sub' title='마이페이지', showBottomNav=true). 헤더·스크롤(#app-scroll)·뒤로가기는
// AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// Figma 실측(px, 1:1):
//   행: min-h 56 · px 16 · gap 16 · border-top 1px(#d1d7e0=border-divider) · 텍스트 전부 Bold.
//   섹션 헤더(진행업무현황/업무 캘린더/문서함) = bg #ecf1fa(primary-faint) + 건수 navy(#0f316e=primary-active).
//   단독 이동 행(업무이력/관심공고/관심법령) = 흰 배경 + 건수 blue(#0054e9=primary). 건수 '숫자'만 underline.
//   제목 19px Bold · 건수 17px · 하위항목 17px Bold · 사용자명 22px(heading-md) Bold.
//   하위 그룹: px16 pt16 pb16, 행 gap 8, 행 py 4. 링크행 우측 ArrowForwardIos 20px.
//
// 데이터는 파일 내 목업(설계서 데이터영역 형식), 동작은 라우팅/API 경계 스텁(console.log + '// 추후 …').
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { Icon } from '@/ui/common/base/Icon'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Badge } from '@/ui/common/base/Badge'
import { MyPageCalendar } from '@/ui/biz/cm/myPage/MyPage_Calendar'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import type { MyPageSchedule } from '@/types/mypage'

// ── 목업 (설계서 데이터영역 형식 — API 연동 시 교체) ─────────────────────────
const MOCK_BZENTY_NM = '가온산업' // 추후: 업체 정보 API(로그인 업체)

const PRGRS_ITEMS = [
  { key: 'bidAply', label: '입찰참가신청', count: 16 },
  { key: 'qlfcExam', label: '적격심사', count: 5 },
  { key: 'techEval', label: '기술평가', count: 5 },
  { key: 'specEval', label: '사양서평가', count: 5 },
]
const PRGRS_TOTAL = 31

const DOC_ITEMS = [
  { key: 'received', label: '받은 문서', count: 24 },
  { key: 'sent', label: '보낸 문서', count: 10 },
  { key: 'rejected', label: '반려 문서', count: 1 },
  { key: 'temp', label: '임시저장', count: 0 },
]
const DOC_TOTAL = 35

// 5) 업무 캘린더 — 관심(찜) 입찰공고 + 개인 스케줄(합쳐 최대 3건 카드).
// 날짜는 '오늘' 기준 상대값(목업) — 캘린더 기본 노출 월에 표식이 보이도록. API 연동 시 실제 일자로 교체.
const schdlDt = (offset: number) => dayjs().add(offset, 'day').format('YYYY-MM-DD')
const MOCK_SCHEDULES: MyPageSchedule[] = [
  {
    id: 'sc1',
    schdlSeCd: 'goods',
    schdlDt: schdlDt(0), // 오늘
    pbancNo: '공고번호 000 00 0000',
    pbancNm: '즐겨찾기(찜)한 입찰공고 표시',
  },
  {
    id: 'sc2',
    schdlSeCd: 'construction',
    schdlDt: schdlDt(3),
    pbancNo: '공고번호 000 00 0000',
    pbancNm: '즐겨찾기(찜)한 입찰공고 표시',
  },
  {
    id: 'sc3',
    schdlSeCd: 'personal',
    schdlDt: schdlDt(6),
    schdlCn: '작성한 스케줄이 있는 경우 표시됩니다',
  },
]

// ── 행 프리미티브 (Figma 실측 1:1) ───────────────────────────────────────────
// 공통 행 — min-h 56 · px16 · gap16 · border-top 1px.
const ROW = 'flex min-h-[56px] w-full items-center gap-krds-8 border-t border-krds-border-divider px-krds-8'

// 건수 배지 — '숫자'만 underline + 'N 건'. tone: section=navy(primary-active) / nav=blue(primary).
function CountBadge({ count, tone }: { count: number; tone: 'section' | 'nav' }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-1 text-krds-body-md leading-normal',
        tone === 'section' ? 'text-krds-text-primary-active' : 'text-krds-text-primary',
      )}
    >
      <span className="underline">{count}</span>
      <span>건</span>
    </span>
  )
}

// 건수 행 — 섹션 헤더(진행업무현황/문서함, bg-faint·정적) + 단독 이동 행(업무이력/관심공고/관심법령).
function CountRow({
  title,
  count,
  variant = 'nav',
  onClick,
}: {
  title: string
  count: number
  variant?: 'section' | 'nav'
  onClick?: () => void
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        ROW,
        variant === 'section' && 'bg-krds-bg-primary-faint',
        onClick && 'text-left focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden',
      )}
    >
      <span className="min-w-px flex-1 text-krds-body-lg font-bold leading-normal text-krds-text-ink">
        {title}
      </span>
      <CountBadge count={count} tone={variant} />
    </Comp>
  )
}

// 링크 행(바로가기) — 19px Bold + 우측 ArrowForwardIos 20px. last=하단선으로 목록 닫음.
function LinkRow({ label, onClick, last }: { label: string; onClick: () => void; last?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        ROW,
        last && 'border-b',
        'text-left focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden',
      )}
    >
      <span className="min-w-px flex-1 text-krds-body-lg font-bold leading-normal text-krds-text-ink">
        {label}
      </span>
      <Icon name="ArrowForwardIos" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
    </button>
  )
}

// 하위 메뉴 그룹 — 헤더 아래 하위 항목(입찰참가신청 등). 17px Bold + 건수(blue).
function SubMenuGroup({
  items,
  onSelect,
}: {
  items: { key: string; label: string; count: number }[]
  onSelect: (key: string) => void
}) {
  return (
    <div className="flex flex-col gap-krds-5 px-krds-8 pb-krds-8 pt-krds-8">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => onSelect(it.key)}
          className="flex min-h-[34px] w-full items-center gap-krds-5 rounded-krds-8 py-krds-3 text-left focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden"
        >
          <span className="min-w-px flex-1 text-krds-body-md font-bold leading-normal text-krds-text-ink">
            {it.label}
          </span>
          <CountBadge count={it.count} tone="nav" />
        </button>
      ))}
    </div>
  )
}

export function MyPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const userNm = user?.name ?? ''

  // 6~7) 개인 스케줄 상세 바텀시트 — 페이지가 컨테이너 소유.
  const [detail, setDetail] = useState<MyPageSchedule | null>(null)

  // ── 동작 스텁 (백엔드/하위 화면 연동 시 교체) ──
  const goSettings = () => {
    console.log('[MyPage] 사용자 정보관리') // 추후: navigate(사용자 정보관리)
  }
  const goPrgrs = (key: string) => {
    // 입찰참가신청/적격심사/기술평가/사양서평가 → 입찰진행 목록(MUI-BD-03-M01)에 해당 업무 필터로 진입.
    navigate(ROUTES.BD_PRGRS, { state: { prgrsFilter: key } })
  }
  const goWorkHstry = () => {
    console.log('[MyPage] 나의 업무이력현황') // 추후: MUI-CM-06-M02 진행업무현황
  }
  const goStaredBid = () => {
    console.log('[MyPage] 관심입찰공고') // 추후: 관심 입찰공고 목록
  }
  const goDoc = (key: string) => {
    console.log('[MyPage] 문서함 →', key) // 추후: 문서함 목록 이동 + 필터
  }
  const goStaredLaw = () => {
    console.log('[MyPage] 관심 법령') // 추후: 관심 법령 목록
  }
  const goCalendarMore = () => {
    console.log('[MyPage] 업무 캘린더 더보기') // 추후: 업무 캘린더 전체 화면
  }
  // 일정 카드 — 입찰공고면 해당 공고 이동, 개인 스케줄이면 바텀시트 상세.
  const onSelectSchedule = (s: MyPageSchedule) => {
    if (s.schdlSeCd === 'personal') {
      setDetail(s)
      return
    }
    // 관심(찜)한 입찰공고 → 해당 입찰공고 상세(MUI-BD-01-M02). 상세는 자체 fallback 목업으로 상단 렌더.
    navigate(`/bd/${s.id}`)
  }

  // 하단 바로가기(9) — 각 버튼 클릭 시 해당 페이지/팝업 호출(현재 스텁).
  const shortcuts = [
    { id: 'myPosts', label: '나의 게시물', onClick: () => console.log('[MyPage] 나의 게시물') },
    { id: 'bzentyInfo', label: '업체 정보관리', onClick: () => console.log('[MyPage] 업체 정보관리') },
    { id: 'userInfo', label: '사용자 정보관리', onClick: () => console.log('[MyPage] 사용자 정보관리') },
    { id: 'cabinet', label: '디지털 캐비닛', onClick: () => console.log('[MyPage] 디지털 캐비닛') },
    { id: 'noti', label: '알림 서비스 신청 및 해지', onClick: () => console.log('[MyPage] 알림 서비스 신청 및 해지') },
    { id: 'withdraw', label: '회원탈퇴', onClick: () => console.log('[MyPage] 회원탈퇴') },
  ]

  return (
    <div className="flex flex-col">
      {/* 1) 사용자 인사([업체] 홍길동 님) + ⚙ — 22px Bold, min-h 65, px16 py16 */}
      <div className="flex min-h-[65px] w-full items-center gap-krds-5 px-krds-8 py-krds-8">
        <p className="min-w-px flex-1 text-krds-heading-md font-bold leading-normal text-krds-text-ink">
          [{MOCK_BZENTY_NM}] {userNm} 님
        </p>
        <button
          type="button"
          onClick={goSettings}
          aria-label="사용자 정보관리"
          className="shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
        >
          <Icon name="Settings" size={24} aria-hidden className="text-krds-text-ink" />
        </button>
      </div>

      {/* 2) 나의 진행업무현황(섹션 헤더) + 하위 */}
      <CountRow title="나의 진행업무현황" count={PRGRS_TOTAL} variant="section" />
      <SubMenuGroup items={PRGRS_ITEMS} onSelect={goPrgrs} />

      {/* 3) 나의 업무이력현황  4) 관심입찰공고 */}
      <CountRow title="나의 업무이력현황" count={5} onClick={goWorkHstry} />
      <CountRow title="관심입찰공고" count={5} onClick={goStaredBid} />

      {/* 5~7) 업무 캘린더(섹션 헤더 bg-faint) + 캘린더 + 일정 카드 */}
      <MyPageCalendar
        schedules={MOCK_SCHEDULES}
        onMore={goCalendarMore}
        onSelectSchedule={onSelectSchedule}
      />

      {/* 8) 문서함(섹션 헤더) + 하위 */}
      <CountRow title="문서함" count={DOC_TOTAL} variant="section" />
      <SubMenuGroup items={DOC_ITEMS} onSelect={goDoc} />

      {/* 관심 법령 */}
      <CountRow title="관심 법령" count={5} onClick={goStaredLaw} />

      {/* 9) 하단 바로가기 — 19px Bold + ArrowForwardIos, 마지막 행 하단선 */}
      {shortcuts.map((s, i) => (
        <LinkRow
          key={s.id}
          label={s.label}
          onClick={s.onClick}
          last={i === shortcuts.length - 1}
        />
      ))}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main) */}
      <FloatingActionButton
        className="fixed bottom-20 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 6~7) 개인 스케줄 상세 바텀시트 */}
      <BottomSheet
        open={detail !== null}
        onOpenChange={(open) => !open && setDetail(null)}
        title="스케줄 상세"
      >
        {detail && (
          <div className="flex flex-col gap-krds-5">
            <Badge type="pastel" color="yellow" className="self-start">
              개인
            </Badge>
            <p className="text-krds-body-lg font-bold text-krds-text-ink">{detail.schdlCn}</p>
            <p className="text-krds-body-md text-krds-text-muted">{detail.schdlDt}</p>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
MyPage.displayName = 'MyPage'
