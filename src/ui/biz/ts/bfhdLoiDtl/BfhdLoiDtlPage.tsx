// 사전의향서상세 — MUI-TS-01-M02 BfhdLoiDtl. 설계서 06.업무지원 v0.82 slide12~17.
// 사전의향서목록(M01) 카드 클릭 → /ts/bfhdLoiDtl 진입(식별자는 navigate state).
// 구성: sticky(요약 SummaryInfo + 탭 TabList) + 탭(T01 상세내용 · T02 품목명세서) —
//   업무지원 상세는 진행 단계(StepBar) 없음(slide12).
// 타이틀 우측 출력 버튼 → 출력 가능 레포트 목록 바텀시트(slide12, OZ 연계 스텁).
// 공지사항(업무도움)은 내역 확정 전 미표시. 데이터: useSelectBfhdLoiDtl — 조회 완료까지 PageLoading.
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { tsQueries } from '@/queries/bds/ts/queries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Button } from '@/ui/common/base/Button'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BfhdLoiDtl } from '@/ui/biz/ts/bfhdLoiDtl/BfhdLoiDtl'
import { BfhdLoiDtl_ItemList } from '@/ui/biz/ts/bfhdLoiDtl/BfhdLoiDtl_ItemList'

// ── 탭 (slide12 탭 메뉴: 상세내용 · 품목명세서) ──────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세내용' },
  { value: 'item', label: '품목명세서' },
]

export function BfhdLoiDtlPage() {
  // 식별자는 목록에서 navigate state 로 전달(URL 노출 금지).
  const stateItem = useLocation().state as { id: string } | null
  const id = stateItem?.id ?? ''
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [outputOpen, setOutputOpen] = useState(false) // 출력 레포트 목록 바텀시트(slide12)

  const { data: detail } = tsQueries.useSelectBfhdLoiDtl(id)

  if (!stateItem) return <Navigate to="/ts/loi" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky. 스크롤 시 요약 축소(형제 상세와 동일 방식, StepBar 없음) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            // 진행상태(제출/미제출 — 빈값 미노출) + 접수 만료(slide12 표시 레이블)
            ...(detail.prgrsStcd ? [{ label: detail.prgrsStcd }] : []),
            ...(detail.expryYn === 'Y' ? [{ label: '만료' }] : []),
          ]}
          subtitle={`접수일자 ${detail.rcptBgngYmd} ~ ${detail.rcptEndYmd}`}
          title={detail.bfhdLoiTtl}
          actions={
            // 출력(slide12 타이틀 우측 버튼) — 바텀시트에서 출력 가능 레포트 목록 호출.
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setOutputOpen(true)} />
          }
          rows={[
            { label: '발주부서', value: detail.deptCd },
            { label: '담당자', value: detail.userNm },
          ]}
        />

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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지) */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <BfhdLoiDtl detail={detail} />}
        {tab === 'item' && <BfhdLoiDtl_ItemList id={id} expired={detail.expryYn === 'Y'} />}
      </div>

      {/* 출력 레포트 목록 바텀시트(slide12) — OZ 리포트 연계 스텁 */}
      <BottomSheet
        open={outputOpen}
        onOpenChange={setOutputOpen}
        title="출력물"
        footer={
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              console.log('[M02] 사전의향서 출력 OZ리포트 연계')
              setOutputOpen(false)
            }}
          >
            사전의향서 출력
          </Button>
        }
      />

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
BfhdLoiDtlPage.displayName = 'BfhdLoiDtlPage'
