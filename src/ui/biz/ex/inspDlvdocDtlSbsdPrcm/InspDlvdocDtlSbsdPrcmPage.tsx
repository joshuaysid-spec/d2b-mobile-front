// 검사및납품조서상세(부대조달) — MUI-EX-01-M03 InspDlvdocDtlSbsdPrcm. 설계서 04.이행 v0.83 slide21~26.
// P11 검사및납품조서목록에서 부대조달 조서 카드 클릭 → /ex/inspDlvdocDtlSbsdPrcm 진입.
// 구성: 중요 안내(Notice urgent) + sticky(요약 SummaryInfo + 스텝 StepBar + 탭 TabList)
//   + 탭 콘텐츠(T03 상세정보 InspDlvdocDtlSbsdPrcm · T04 물품목록 InspDlvdocDtlSbsdPrcm_CmdtyList)
//   — 중앙조달(M02)과 셸 동일, 탭 콘텐츠(3섹션·증명문구)와 데이터가 다름(설계서 별도 화면 ID·폴더).
// 인쇄 이벤트(slide26, R13 검사및납품조서): SummaryInfo 출력 버튼 → 확인 모달 → OZ 리포트 연계(스텁).
// 데이터: exQueries.useSelectInspDlvdocSbsdDtl — 조회 완료까지 PageLoading(목록 state 는 필드 구성이 달라 placeholder 부적합).
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { exQueries } from '@/queries/bds/ex/exQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { InspDlvdocDtlSbsdPrcm } from '@/ui/biz/ex/inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcm'
import { InspDlvdocDtlSbsdPrcm_CmdtyList } from '@/ui/biz/ex/inspDlvdocDtlSbsdPrcm/InspDlvdocDtlSbsdPrcm_CmdtyList'

// ── 탭 (slide21 탭 영역: 상세정보 · 물품목록) ────────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'cmdty', label: '물품목록' },
]

// ── 진행 단계 — 이행 상세는 '이행' 단계 고정(M02 와 동일). ──────────────────
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('이행')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function InspDlvdocDtlSbsdPrcmPage() {
  const navigate = useNavigate()
  // 목록 → 상세: 식별자는 URL 이 아니라 navigate state(클릭 항목)로 받는다 — 조회 키는 조서발행번호
  //   (진입 경로 2개: P11 조서목록 · M05 조서현황목록. M05 카드의 id 는 `계약번호-통지번호` 합성값이라 쓰지 않는다).
  const id = (useLocation().state as { recrdPblcnNo: string } | null)?.recrdPblcnNo ?? ''
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  // 인쇄(R13) 확인 모달
  const [printModalOpen, setPrintModalOpen] = useState(false)

  const { data: detail } = exQueries.useSelectInspDlvdocSbsdDtl(id)
  const steps = buildSteps()

  // state 없이 직접 진입 = 식별자를 알 수 없음 → 검사통합목록으로.
  if (!id) return <Navigate to="/ex" replace />
  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 이행 정보 신청/수정은 PC 전용(slide21) */}
      <Notice type="urgent">이행 정보 신청, 수정은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소 + StepBar 접힘(M02 와 동일 방식) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { label: detail.taskSecd },
            { label: detail.bgtSecdNm },
            { label: detail.dlvdocPrgrsStcd },
          ].filter((b) => b.label)}
          subtitle={`계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.ctrtNm}
          actions={
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setPrintModalOpen(true)} />
          }
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원` },
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
        {tab === 'detail' && <InspDlvdocDtlSbsdPrcm detail={detail} />}
        {tab === 'cmdty' && <InspDlvdocDtlSbsdPrcm_CmdtyList id={id} />}
      </div>

      {/* 인쇄(R13 검사및납품조서) — 확인 모달 → OZ 리포트 연계(스텁, slide26 인쇄 이벤트) */}
      <AlertModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[M03] 검사및납품조서 출력(R13) OZ리포트 연계'),
        }}
      />

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
InspDlvdocDtlSbsdPrcmPage.displayName = 'InspDlvdocDtlSbsdPrcmPage'
