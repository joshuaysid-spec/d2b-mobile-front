// 검사및납품조서결과상세 — MUI-EX-01-M07 DlvdocRsltDtl. 설계서 04.이행 v0.83 slide36~40.
// 검사및납품조서현황목록(M05)에서 중앙조달(비공사) 카드 클릭 → /ex/dlvdocRsltDtl 진입.
// 구성: 중요 안내(Notice urgent) + sticky(요약 SummaryInfo + 스텝 StepBar + 탭 TabList)
//   + 탭 콘텐츠(T05 상세정보 DlvdocRsltDtl · T06 물품목록 DlvdocRsltDtl_CmdtyList) — M02/M03 셸 준용.
// 요약 행은 M05 카드와 동일 구성(계약일자/계약금액/합격일자/납품일자, slide36).
// 데이터: exQueries.useSelectDlvdocRsltDtl — 조회 완료까지 PageLoading.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { exQueries } from '@/queries/bds/ex/exQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { DlvdocRsltDtl } from '@/ui/biz/ex/dlvdocRsltDtl/DlvdocRsltDtl'
import { DlvdocRsltDtl_CmdtyList } from '@/ui/biz/ex/dlvdocRsltDtl/DlvdocRsltDtl_CmdtyList'

// ── 탭 (slide36 탭 영역: 상세정보 · 물품목록) ────────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'cmdty', label: '물품목록' },
]

// ── 진행 단계 — 이행 상세는 '이행' 단계 고정(형제 화면과 동일). ──────────────
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('이행')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function DlvdocRsltDtlPage() {
  const navigate = useNavigate()
  // 목록 → 상세: 식별자는 URL 이 아니라 navigate state(클릭 항목)로 받는다.
  const id = (useLocation().state as { id: string } | null)?.id ?? ''
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  const { data: detail } = exQueries.useSelectDlvdocRsltDtl(id)
  const steps = buildSteps()

  // state 없이 직접 진입 = 식별자를 알 수 없음 → 조서현황목록으로.
  if (!id) return <Navigate to="/ex/prst" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 이행 정보 신청/수정은 PC 전용(slide36) */}
      <Notice type="urgent">이행 정보 신청, 수정은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소 + StepBar 접힘(M02/M03 과 동일 방식) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { label: detail.taskSeNm },
            { label: detail.bgtSeNm },
            { label: detail.dlvdocPrgrsStcd },
          ].filter((b) => b.label)}
          subtitle={`계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.ctrtNm}
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원` },
            { label: '합격일자', value: detail.passYmd || '-' },
            { label: '납품일자', value: detail.dlvgdsYmd || '-' },
          ]}
        />

        {/* 진행 단계 — 축소 시 함께 접힘 */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar
                orientation="horizontal"
                items={steps}
                sheetItems={buildProgressSheet('이행', (substep, prgrsStg) =>
                  navigate('/anl-prgrs', { state: { substep, prgrsStg } }),
                )}
                className="bg-transparent"
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지) */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <DlvdocRsltDtl detail={detail} />}
        {tab === 'cmdty' && <DlvdocRsltDtl_CmdtyList id={id} />}
      </div>

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
DlvdocRsltDtlPage.displayName = 'DlvdocRsltDtlPage'
