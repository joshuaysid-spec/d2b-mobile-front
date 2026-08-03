// 착·중도금신청서상세 — MUI-WM-01-M03 DpsmnItrpyApfrDtl. 설계서 05.대금청구및사후 v0.83 slide29~35.
// P13 대금청구신청목록에서 착중도금신청서 카드 클릭 → /wm/dpsmn-itrpy/:id 진입.
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T03 신청정보 · T04 세부신청내역 · T23 지급상태(공용))
//   — 선금(M02) 셸과 동일, 탭 콘텐츠·데이터만 다름(설계서 별도 화면 ID·폴더).
// 데이터: useDpsmnItrpyApfrDtl — 조회 완료까지 PageLoading.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useDpsmnItrpyApfrDtl } from '@/queries/wm'
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
import { DpsmnItrpyApfrDtl } from '@/ui/biz/wm/dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtl'
import { DpsmnItrpyApfrDtl_AplyDtsm } from '@/ui/biz/wm/dpsmnItrpyApfrDtl/DpsmnItrpyApfrDtl_AplyDtsm'
import { PrpayDpsmnItrpyGiveStts } from '@/ui/biz/wm/prpayDpsmnItrpyGiveStts/PrpayDpsmnItrpyGiveStts'

// ── 탭 (slide29 탭 영역: 신청정보 · 세부 신청내역 · 지급상태) ────────────────
const TABS: TabItem[] = [
  { value: 'aply', label: '신청정보' },
  { value: 'dtsm', label: '세부 신청내역' },
  { value: 'give', label: '지급상태' },
]

// ── 진행 단계 — 대금/사후 상세는 '대금청구' 단계 고정(M02 와 동일). ──────────
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('대금청구')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function DpsmnItrpyApfrDtlPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const [tab, setTab] = useState('aply')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [printModalOpen, setPrintModalOpen] = useState(false)

  const { data: detail } = useDpsmnItrpyApfrDtl(id)
  const steps = buildSteps()

  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 대금 신청/청구는 PC 전용(slide29) */}
      <Notice type="urgent">대금 신청, 청구는 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소 + StepBar 접힘(M02 와 동일 방식) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.taskSeCd }, { label: detail.ctrtMthdCd }].filter(
            (b) => b.label,
          )}
          subtitle={`계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.ctrtNm}
          actions={
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setPrintModalOpen(true)} />
          }
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '발주기관', value: detail.orderInstNm },
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
                sheetItems={buildProgressSheet('대금청구', (substep, prgrsStg) =>
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
        {tab === 'aply' && <DpsmnItrpyApfrDtl detail={detail} />}
        {tab === 'dtsm' && <DpsmnItrpyApfrDtl_AplyDtsm id={id} />}
        {tab === 'give' && <PrpayDpsmnItrpyGiveStts id={id} />}
      </div>

      {/* 인쇄 — 증명서 출력 확인 모달(스텁) */}
      <AlertModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[M03] 증명서출력 OZ리포트 연계'),
        }}
      />

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
DpsmnItrpyApfrDtlPage.displayName = 'DpsmnItrpyApfrDtlPage'
