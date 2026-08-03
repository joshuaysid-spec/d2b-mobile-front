// 검사및납품조서상세(중앙조달) — MUI-EX-01-M02 InspDlvdocDtl. 설계서 04.이행 v0.83 slide17~20.
// P11 검사및납품조서목록에서 중앙조달 조서 카드 클릭 → /ex/dlvdoc/:id 진입.
// 구성: 중요 안내(Notice urgent, PC 안내) + sticky(요약 SummaryInfo + 스텝 StepBar + 탭 TabList)
//   + 탭 콘텐츠(T01 상세정보 InspDlvdocDtl · T02 물품목록 InspDlvdocDtl_CmdtyList) — CT 상세(M03) 구조 준용.
// 데이터: useInspDlvdocDtl — 목록 state 는 요약 즉시표시에 안 쓰고 조회로 확정(필드 구성이 목록과 달라
//   placeholder 부적합) → 조회 완료까지 PageLoading. 목업/실연동은 exService(USE_MOCK)가 전환.
// 업무도움(slide17)은 '내역이 있는 경우만 표시' — 안내 내역 확정 전이라 미표시(M01·CT 동일 판단).
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useInspDlvdocDtl } from '@/queries/ex'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { InspDlvdocDtl } from '@/ui/biz/ex/inspDlvdocDtl/InspDlvdocDtl'
import { InspDlvdocDtl_CmdtyList } from '@/ui/biz/ex/inspDlvdocDtl/InspDlvdocDtl_CmdtyList'

// ── 탭 (slide17 탭 영역: 상세정보 · 물품목록) ────────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'cmdty', label: '물품목록' },
]

// ── 진행 단계 — 이행 상세는 '이행' 단계 고정(slide17 목업: 조달→입찰→계약→이행). ──
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('이행')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function InspDlvdocDtlPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const [tab, setTab] = useState('detail')
  // 스크롤 시 상단 블록(요약+스텝+탭) 축소 + sticky 동작 — 로직은 훅에서.
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  const { data: detail } = useInspDlvdocDtl(id)
  const steps = buildSteps()

  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 이행 정보 신청/수정은 PC 전용(slide17) */}
      <Notice type="urgent">이행 정보 신청, 수정은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소(collapsed) + StepBar 접힘(OP/CT 상세와 동일 방식) */}
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지, OP/CT 상세와 동일) */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <InspDlvdocDtl detail={detail} />}
        {tab === 'cmdty' && <InspDlvdocDtl_CmdtyList id={id} />}
      </div>

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
InspDlvdocDtlPage.displayName = 'InspDlvdocDtlPage'
