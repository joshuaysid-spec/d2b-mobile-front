// 업체정보 상세 (MUI-CM-01-M02) — 마이페이지 > 업체정보관리 > 상세. 설계서 v0.86 slide125~138 / Figma 10020:82706.
// 자신이 속한 업체 정보를 탭으로 표시(업체일반/물품(내자)/시설/국내소재상사).
// 260827 Figma 리디자인 반영: 상단 = 업체 요약 카드(BzentySummaryCard — 아이콘+업체명+코드 뱃지+사업구분 뱃지
//   +최신 수신일자). G2B 갱신하기 버튼은 리디자인에 없으나 설계서 기능(1일 1회)이라 수신일자 행 우측에 유지(사용자 확정).
// 구성: useCollapsibleHeader + sticky 블록[요약 카드(접힘) + 탭(TabList)] + 탭별 콘텐츠 switch.
//   ⚠️ 사업구분(물품/공사/용역)에 따라 탭 노출이 달라질 수 있으나(설계서 미확정), 목업은 물품(내자) 기준 4탭 모두 노출.
//   (Figma 탭 목록의 '입찰진행현황' 5번째 탭은 설계서 v0.86 에 없어 미반영 — 확인 필요.)
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout) 담당 → 본문은 콘텐츠만 렌더. 데이터는 목업(백엔드 미연동).
import { useState } from 'react'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { BzentySummaryCard } from '@/ui/biz/cm/bzentyInfo/BzentySummaryCard'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Button } from '@/ui/common/base/Button'
import { showToast } from '@/stores/authStore'
import { BzentyGnrlInfoDtl_Gnrl } from '@/ui/biz/cm/bzentyGnrlInfoDtl/BzentyGnrlInfoDtl_Gnrl'
import { BzentyGnrlInfoDtl_Cmdty } from '@/ui/biz/cm/bzentyGnrlInfoDtl/BzentyGnrlInfoDtl_Cmdty'
import { BzentyGnrlInfoDtl_Fclt } from '@/ui/biz/cm/bzentyGnrlInfoDtl/BzentyGnrlInfoDtl_Fclt'
import { BzentyGnrlInfoDtl_DmsAgt } from '@/ui/biz/cm/bzentyGnrlInfoDtl/BzentyGnrlInfoDtl_DmsAgt'

// 상단 요약(업체 요약) 목업 — 설계서 slide115/118 dm_bzentyGnrlInfo 예시값. 로그인 업체 정보(추후 API).
const SUMMARY = {
  bzentyNm: '조달테스트업체',
  brno: '123-45-67890',
  bzentyCd: '100F',
  ntnCd: '대한민국',
  opbizYmd: '1999-12-31',
  // 사업구분(bizCd) — 여러 개 노출 가능(설계서). 배지로 표시.
  bizCd: ['물품(내자)', '공사', '용역'],
}

// 나라장터(G2B) 조달업체정보 최근 수신(갱신) 일시 — 설계서 slide115 예시값(추후 API).
const G2B_LAST_RECV_DT = '2000-12-31 12:00'

// ── 탭 (설계서 slide115 m_tab) ────────────────────────────────────────────────
const TABS: TabItem[] = [
  { value: 'gnrl', label: '업체일반' },
  { value: 'cmdty', label: '물품(내자)' },
  { value: 'fclt', label: '시설' },
  { value: 'dmsAgt', label: '국내소재상사' },
]

function renderTabContent(tab: string) {
  switch (tab) {
    case 'gnrl':
      return <BzentyGnrlInfoDtl_Gnrl />
    case 'cmdty':
      return <BzentyGnrlInfoDtl_Cmdty />
    case 'fclt':
      return <BzentyGnrlInfoDtl_Fclt />
    case 'dmsAgt':
      return <BzentyGnrlInfoDtl_DmsAgt />
    default:
      return null
  }
}

export function BzentyGnrlInfoDtlPage() {
  const [tab, setTab] = useState('gnrl')
  // 스크롤 시 상단 블록(요약+G2B밴드+탭) 축소 + sticky 동작 — 로직은 훅에서.
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 나라장터(G2B) 갱신 — 1일 1회 제한(설계서 slide115/121). 로컬 플래그 스텁.
  const [refreshedToday, setRefreshedToday] = useState(false)
  const handleRefreshG2b = () => {
    if (refreshedToday) {
      showToast('갱신은 1일 1회로 제한됩니다.')
      return
    }
    console.log('[M02] 나라장터(G2B) 조달업체정보 갱신') // 추후 API: cmService.refreshG2b
    setRefreshedToday(true)
    showToast('갱신되었습니다.')
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약 카드가 축소되며 높이 감소(탭만 남아 붙음). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        {/* 업체 요약 카드(Figma m_summary info_card) — 스크롤 축소(collapsed) 시 접힘(grid-rows 0fr). */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none ${
            collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-4 pb-0">
              <BzentySummaryCard
                name={SUMMARY.bzentyNm}
                code={SUMMARY.bzentyCd}
                bizCd={SUMMARY.bizCd}
                infos={[
                  {
                    label: '최신 수신일자',
                    value: `${G2B_LAST_RECV_DT} (나라장터)`,
                    // 갱신하기 — 리디자인에 없으나 설계서 기능(1일 1회 제한)이라 유지(260827 사용자 확정).
                    action: (
                      <Button variant="secondary" size="sm" onClick={handleRefreshG2b}>
                        갱신하기
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="px-4">
          <TabList
            value={tab}
            onChange={(next) => {
              setTab(next)
              goToContentTop()
            }}
            items={TABS}
          />
        </div>
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지). 여백은 탭 콘텐츠가 소유(px-4 py-5). */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 맨위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
BzentyGnrlInfoDtlPage.displayName = 'BzentyGnrlInfoDtlPage'
