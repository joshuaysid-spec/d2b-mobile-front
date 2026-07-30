// 앱 메인 홈(MUI-MS-01-M07, 로그인 전). Design Ref: home-m07.design.
// 구성(위→아래): 빠른조달검색 + 주요 서비스 바로가기 + 공지사항 + 배너 + 처음 방문 안내 + Footer + 맨위로 FAB.
// Header/BottomNav 는 AppLayout 셸이 제공 → 본 페이지는 콘텐츠만 렌더.
//
// 데이터는 목업 상수, 동작은 API/라우팅 경계 스텁(console.log + '// 추후 …' 주석) 또는 기존 라우트 이동.
// 캐러셀은 목업(정적), 이미지는 placeholder. 검색필터는 기존 SearchFilter(FullPopup) 재사용.
import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { Footer } from '@/ui/common/composites/Footer'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import {
  QuickProcurementSearch,
  type SearchTarget,
} from '@/ui/biz/cm/home/QuickProcurementSearch'
import {
  ServiceShortcutGrid,
  type ServiceShortcut,
} from '@/ui/biz/cm/home/ServiceShortcutGrid'
import {
  HomeNoticeSection,
  type NoticeItem,
  type NoticeTab,
} from '@/ui/biz/cm/home/HomeNoticeSection'
import { HomeBanner, type BannerSlide } from '@/ui/biz/cm/home/HomeBanner'
import { FirstVisitGuide, type GuideItem } from '@/ui/biz/cm/home/FirstVisitGuide'
import { SysExpln } from '@/ui/biz/cm/mscrn/SysExpln'
import { AppSrvcExplnPage } from '@/ui/biz/cm/appSrvcExpln/AppSrvcExplnPage'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import { ROUTES } from '@/constants/routes'
import opIcon from '@/assets/images/opIcon.svg'
import bdIcon from '@/assets/images/bdIcon.svg'
import tgIcon from '@/assets/images/tgIcon.svg'
import contractIcon from '@/assets/images/contractIcon.svg'
import rcIcon from '@/assets/images/rcIcon.svg'
import pcIcon from '@/assets/images/pcIcon.svg'
import mainBanner1 from '@/assets/images/mainBanner1.svg'
import mainBanner2 from '@/assets/images/mainBanner2.svg'
import mainBanner3 from '@/assets/images/mainBanner3.svg'

// ── 검색필터 schema (빠른조달검색 필터 버튼 → 풀팝업). 최소 구성, 추후 입찰공고 필터로 확장 ──
const HOME_FILTER: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'taskSe',
      title: '업무구분',
      fields: [
        {
          type: 'checkbox',
          key: 'taskSe',
          selectAll: true, // 상단 '전체' 칩(전체↔개별 자동 동기화) — options 에 별도 '전체' 없음
          options: [
            { value: 'goods', label: '물품' },
            { value: 'service', label: '용역' },
            { value: 'construction', label: '공사' },
            { value: 'foreign', label: '외자' },
          ],
        },
      ],
    },
  ],
}
// 기본 — 업무구분 아무것도 선택 안 함(빈 배열). selectAll '전체' 칩도 미체크로 표시된다.
const DEFAULT_FILTER: SearchFilterValue = {
  taskSe: [],
}

// ── 목업 데이터 (추후 API 로 대체) ──────────────────────────────────────────
// 서비스 바로가기 — 3열×2행 6개(슬라이드 없음, 단일 그리드).
const SERVICE_LABELS = [
  '조달',
  '입찰공고',
  '개찰',
  '계약',
  '실적증명서',
  '국내/국외 조달원 등록증',
]

// 서비스 라벨 → 아이콘 에셋. 미정의 라벨은 placeholder 박스 유지.
const SERVICE_ICONS: Record<string, string> = {
  조달: opIcon,
  입찰공고: bdIcon,
  개찰: tgIcon,
  계약: contractIcon,
  실적증명서: pcIcon,
  '국내/국외 조달원 등록증': rcIcon,
}

// 표시 라벨 오버라이드(줄바꿈 등). 키 매칭/아이콘은 원래 문자열 라벨 그대로 사용.
const SERVICE_LABEL_DISPLAY: Record<string, ReactNode> = {
  '국내/국외 조달원 등록증': (
    <>
      국내/국외
      <br />
      조달원 등록증
    </>
  ),
}

const NOTICE_SAMPLE: NoticeItem[] = [
  {
    id: 'n1',
    title:
      "'26년도 현존전력 성능 극대화 「해군전술 C4I체계(KNCCS) 전투효율성 개선사업」 규격입찰요청서(안) 사전 공개",
    date: '2026-03-11',
  },
  {
    id: 'n2',
    title:
      "'26년 대공표적기 용역업체 적합성평가(미스트랄, 신궁지원용역)를 위한 신청 안내문",
    date: '2026-03-09',
  },
  {
    id: 'n3',
    title: '5.56mm 총류탄 발사약통 물품 구매 요구서(안) 사전 공개',
    date: '2026-03-09',
  },
]

const NOTICE_TABS: NoticeTab[] = [
  { value: 'dapa', label: '방위사업청', items: NOTICE_SAMPLE },
  { value: 'unit', label: '수요부대', items: NOTICE_SAMPLE },
  { value: 'general', label: '일반', items: NOTICE_SAMPLE },
]

// 배너 — 통이미지 여러 장(목업, 에셋 미제공 → placeholder). 스와이프/화살표로 전환.
const BANNERS: BannerSlide[] = [
  { id: 'b1', src: mainBanner1, alt: '방위사업청 익명신고센터 안내 배너' },
  { id: 'b2', src: mainBanner2, alt: '국방조달 안내 배너' },
  { id: 'b3', src: mainBanner3, alt: '전자입찰 이용 안내 배너' },
]

export function HomePage() {
  const navigate = useNavigate()

  // 빠른조달검색
  const [target, setTarget] = useState<SearchTarget>('name')
  const [keyword, setKeyword] = useState('')

  // 검색필터 풀팝업
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterValue, setFilterValue] = useState<SearchFilterValue>(DEFAULT_FILTER)

  // 공지 탭
  const [noticeTab, setNoticeTab] = useState('dapa')
  // 홈 첫 진입 흐름: 앱 이용안내(MUI-MS-01-M06, 구 P06) → 중요 공지(MUI-MS-01-P08).
  // 첫 진입이면 M06 먼저(오버레이) → 닫으면 P08. 이미 봤으면 바로 P08. (세션 기준 — 추후 localStorage/서버)
  const [guideOpen, setGuideOpen] = useState(() => !sessionStorage.getItem('appLaunchGuideSeen'))
  const [noticeOpen, setNoticeOpen] = useState(() => !!sessionStorage.getItem('appLaunchGuideSeen'))
  const handleGuideClose = () => {
    sessionStorage.setItem('appLaunchGuideSeen', '1')
    setGuideOpen(false)
    setNoticeOpen(true) // 공지 있으면(데모: 항상 노출)
  }

  // 설정값이 기본과 다르면 ON (설계서 rule 5)
  const filterActive = useMemo(
    () => JSON.stringify(filterValue) !== JSON.stringify(DEFAULT_FILTER),
    [filterValue],
  )

  // ── 동작 스텁 (백엔드/추가 화면 연동 시 교체) ──
  const handleSearch = () => {
    console.log('[Home] 빠른조달검색', { target, keyword, filterValue })
    // 추후: 입찰공고 통합목록(UI-BD-01-M01) 이동 + 검색어/필터 적용
  }
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilterValue(value)
    console.log('[Home] 검색필터 적용', value)
  }

  // 서비스 바로가기 — 일부는 기존 라우트, 나머지는 스텁
  const handleService = (label: string) => {
    if (label === '조달') {
      navigate(ROUTES.OP)
      return
    }
    if (label === '입찰공고') {
      navigate(ROUTES.BD)
      return
    }
    if (label === '개찰') {
      navigate(ROUTES.BD_OPBID)
      return
    }
    if (label === '실적증명서') {
      navigate(ROUTES.SUPPORT_DCMNT_ISSU_APLY)
      return
    }
    if (label === '국내/국외 조달원 등록증') {
      navigate(ROUTES.SUPPORT_OVS_SOS_CNFDOC)
      return
    }
    console.log('[Home] 서비스 바로가기', label) // 추후: 각 서비스 화면 이동
  }

  const handleNoticeMore = () => {
    console.log('[Home] 공지 더보기', noticeTab) // 추후: 공지 목록 화면 이동
  }
  const handleNoticeItem = (item: NoticeItem) => {
    console.log('[Home] 공지 상세', item.id) // 추후: 공지 상세 화면 이동
  }
  const handleGuideDetail = (id: string) => {
    console.log('[Home] 이용안내', id) // 추후: 사전준비/국내·국외 조달안내 화면 이동
  }

  const serviceItems: ServiceShortcut[] = SERVICE_LABELS.map((label, i) => ({
    id: `svc-${i}`,
    label: SERVICE_LABEL_DISPLAY[label] ?? label,
    iconSrc: SERVICE_ICONS[label],
    onClick: () => handleService(label),
  }))

  const guideItems: GuideItem[] = [
    {
      id: 'g-ready',
      iconName: 'DeveloperGuide',
      title: '사전준비안내',
      desc: '인증서 신청/발급, 업체 등록, 사용자 등록 안내',
      onDetail: () => handleGuideDetail('ready'),
    },
    {
      id: 'g-domestic',
      iconName: 'AssignmentInd',
      title: '국내조달안내',
      desc: '국방조달참여, 전자입찰, 대금청구에 대한 절차 안내',
      onDetail: () => handleGuideDetail('domestic'),
    },
    {
      id: 'g-foreign',
      iconName: 'AssignmentGlobe',
      title: '국외조달안내',
      desc: '국외조달원등록 및 변경, 전자입찰에 대한 절차 안내',
      onDetail: () => handleGuideDetail('foreign'),
    },
  ]

  return (
    <div className="flex flex-col">
      {/* 페이지 대표 제목(WCAG 1.3.1/2.4.6) — 시각상 로고가 브랜드라 sr-only 로 제공 */}
      <h1 className="sr-only">국방전자조달 메인 홈</h1>

      {/* 빠른조달검색 — full-bleed(자체 bg/패딩) */}
      <QuickProcurementSearch
        target={target}
        onTargetChange={setTarget}
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
        onOpenFilter={() => setFilterOpen(true)}
        filterActive={filterActive}
      />

      {/* 중간 섹션 — px-4 인셋 + 세로 간격(디자인 섹션 간 40px) */}
      <div className="flex flex-col gap-10 px-4 pb-10 pt-6">
        <ServiceShortcutGrid items={serviceItems} />
        <HomeNoticeSection
          tabs={NOTICE_TABS}
          activeTab={noticeTab}
          onTabChange={setNoticeTab}
          onMore={handleNoticeMore}
          onItemClick={handleNoticeItem}
        />
        <HomeBanner banners={BANNERS} />
        <FirstVisitGuide items={guideItems} />
      </div>

      {/* Footer — full-bleed. 유관기관 바로가기 '인증센터' → 인증센터(MUI-CM-04-M13) 이동. */}
      <Footer
        relatedSites={[
          { label: '전자조달시스템(타기관)' },
          { label: '방위사업청' },
          { label: '국방관련사이트' },
          { label: '조달관련사이트' },
          { label: '인증센터', onClick: () => navigate(ROUTES.CERT) },
        ]}
        snsLinks={[
          { type: 'instagram', href: '#' },
          { type: 'youtube', href: '#' },
          { type: 'x', href: '#' },
          { type: 'facebook', href: '#' },
          { type: 'blog', href: '#' },
        ]}
      />

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 검색필터 풀팝업 */}
      <SearchFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        schema={HOME_FILTER}
        value={filterValue}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />

      {/* 홈 첫 진입: 앱 이용안내(P06) 오버레이 → 닫으면 공지(P08) */}
      {guideOpen && (
        <div className="fixed inset-0 z-[60]">
          <AppSrvcExplnPage onLaunch={handleGuideClose} />
        </div>
      )}

      {/* 중요 공지/시스템 안내 팝업(MUI-MS-01-P08) */}
      <SysExpln open={noticeOpen} onOpenChange={setNoticeOpen} type="notice" />
    </div>
  )
}
