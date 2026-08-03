// 발주의뢰서상세 — MUI-EX-02-M76 OvsOrderRqdcDtl. 설계서 04.이행 v0.83 slide68~73.
// 발주의뢰서목록(M75) 카드 클릭 → /ex/order-rqdc/:id 진입.
// 구성: 중요 안내 + sticky(요약 + 스텝 + 탭) + 탭(T75 상세정보 · T76 물품목록) — M72 셸 준용.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useOvsOrderRqdcDtl } from '@/queries/ex'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { OvsOrderRqdcDtl } from '@/ui/biz/ex/ovsOrderRqdcDtl/OvsOrderRqdcDtl'
import { OvsOrderRqdcDtl_CmdtyList } from '@/ui/biz/ex/ovsOrderRqdcDtl/OvsOrderRqdcDtl_CmdtyList'

const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'cmdty', label: '물품목록' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function buildSteps(): StepItem[] {
  const cur = STEP_LABELS.indexOf('이행')
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function OvsOrderRqdcDtlPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  const { data: detail } = useOvsOrderRqdcDtl(id)
  const steps = buildSteps()

  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <Notice type="urgent">이행 정보 신청, 수정은 PC 버전에서 가능합니다.</Notice>

      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.ntdcStts }].filter((b) => b.label)}
          subtitle={`발주번호 ${detail.orderSeq}`}
          title={detail.bizNm}
          rows={[
            { label: '항목 수', value: `${detail.itemSeq.toLocaleString()} 개` },
            { label: '화폐단위', value: detail.crncCd },
            { label: '계약금액', value: detail.ctrtAmt.toLocaleString() },
            { label: '납기일', value: detail.dudtYmd },
          ]}
        />

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

      <div className="min-h-[100dvh]">
        {tab === 'detail' && <OvsOrderRqdcDtl detail={detail} />}
        {tab === 'cmdty' && <OvsOrderRqdcDtl_CmdtyList id={id} />}
      </div>

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsOrderRqdcDtlPage.displayName = 'OvsOrderRqdcDtlPage'
