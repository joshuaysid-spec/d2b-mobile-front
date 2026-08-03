// 견적의뢰서상세 — MUI-EX-02-M72 OvsEstmtRqdcDtl. 설계서 04.이행 v0.83 slide49~53.
// 견적의뢰서목록(M71) 카드 클릭 → /ex/estmt-rqdc/:id 진입.
// 구성: 중요 안내 + sticky(요약 SummaryInfo + 스텝 StepBar + 탭 TabList)
//   + 탭(T71 상세정보 · T72 물품목록) — EX-01 상세 셸 준용.
// 출력 이벤트(slide53, R85 견적의뢰서출력물): SummaryInfo 출력 버튼 → 확인 모달 → OZ 연계 스텁.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useOvsEstmtRqdcDtl } from '@/queries/ex'
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
import { OvsEstmtRqdcDtl } from '@/ui/biz/ex/ovsEstmtRqdcDtl/OvsEstmtRqdcDtl'
import { OvsEstmtRqdcDtl_CmdtyList } from '@/ui/biz/ex/ovsEstmtRqdcDtl/OvsEstmtRqdcDtl_CmdtyList'

// ── 탭 (slide49 탭 영역: 상세정보 · 물품목록) ────────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'cmdty', label: '물품목록' },
]

// ── 진행 단계 — 이행 상세는 '이행' 단계 고정(EX-01 과 동일). ─────────────────
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('이행')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function OvsEstmtRqdcDtlPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [printModalOpen, setPrintModalOpen] = useState(false)

  const { data: detail } = useOvsEstmtRqdcDtl(id)
  const steps = buildSteps()

  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 이행 정보 신청/수정은 PC 전용(slide49) */}
      <Notice type="urgent">이행 정보 신청, 수정은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소 + StepBar 접힘(EX-01 상세와 동일 방식) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.ntdcStts }].filter((b) => b.label)}
          subtitle={`견적번호 ${detail.clmSeq}`}
          title={detail.bizNm}
          actions={
            // 출력(slide53) — 견적의뢰서출력물(R85) OZ 리포트 연계 스텁.
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setPrintModalOpen(true)} />
          }
          rows={[
            { label: '항목 수', value: `${detail.itemSeq.toLocaleString()} 개` },
            { label: '무역대리점', value: detail.bzentyCd },
            { label: '납기일', value: detail.dudtYmd },
            { label: '작성일', value: detail.wrtYmd },
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
        {tab === 'detail' && <OvsEstmtRqdcDtl detail={detail} />}
        {tab === 'cmdty' && <OvsEstmtRqdcDtl_CmdtyList id={id} />}
      </div>

      {/* 출력(R85) — 확인 모달 → OZ 리포트 연계 스텁 */}
      <AlertModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[M72] 견적의뢰서출력물(R85) OZ리포트 연계'),
        }}
      />

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsEstmtRqdcDtlPage.displayName = 'OvsEstmtRqdcDtlPage'
