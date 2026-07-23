// 물품총액계약서상세 (MUI-CT-01-M07) · 물품단가계약서상세 (MUI-CT-01-M08) — 1페이지 + type.
// 설계서 03.계약 v0.83 slide48~62. 두 화면은 같은 3탭 구조에 "부서명·조달판단번호만 상이"(slide57)
// + 계약명세서 항목 세트 차이 → CLAUDE.md '같은 구조 = 1페이지 + type 파라미터' 원칙 적용.
// 계약통합목록 카드(물품 계약최종 — 총액/단가 계약서) 클릭 → /ct/gramt/:id · /ct/untprc/:id.
// 탭: 상세정보(T13/T16 _Cn) · 계약명세서(T14/T17 _Ctrt) · 특수조건(T15/T18 — M06 _Spcl 재사용).
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCmdtyCtrdocDtl } from '@/queries/ct'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { CmdtyGramtCtrdocDtl_Cn } from '@/ui/biz/ct/cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Cn'
import { CmdtyGramtCtrdocDtl_Ctrt } from '@/ui/biz/ct/cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Ctrt'
import { CmdtyMdfcnCtrdocDtl_Spcl } from '@/ui/biz/ct/cmdtyMdfcnCtrdocDtl/CmdtyMdfcnCtrdocDtl_Spcl'
import type { CtCtrdocType } from '@/types/ct'

export interface CmdtyGramtCtrdocDtlPageProps {
  /** 총액제(gramt, M07 — 기본) / 단가제(untprc, M08). 라우트가 주입. */
  type?: CtCtrdocType
}

// ── 탭 (slide48·56 탭바: 상세정보/계약명세서/특수조건) ─────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'ctrt', label: '계약명세서' },
  { value: 'spcl', label: '특수조건' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function CmdtyGramtCtrdocDtlPage({ type = 'gramt' }: CmdtyGramtCtrdocDtlPageProps) {
  const { id = '' } = useParams()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [outputModalOpen, setOutputModalOpen] = useState(false)

  const { data: detail } = useCmdtyCtrdocDtl(id, type)
  const steps = stepsByStg('계약')

  if (!detail) return <PageLoading />

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <Notice type="urgent">계약 진행, 정보 등록 변경은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky(M03 과 동일 방식) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { label: detail.taskSecd },
            { label: detail.bidMthdCd },
            { label: detail.ctrtMthdCd },
            { label: detail.ctrtStatNm ?? '' },
          ].filter((b) => b.label)}
          subtitle={`공고번호 ${detail.pbancNo} / 계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.rprsItemNm}
          actions={
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setOutputModalOpen(true)} />
          }
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '발주기관', value: detail.orderInstNm },
            { label: '계약금액', value: `${detail.ctrtAmt.toLocaleString()} 원` },
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
                sheetItems={buildProgressSheet('계약', (substep, prgrsStg) =>
                  console.log('[CT-01-M07/M08] 연관 진행 이동(미배선)', substep, prgrsStg),
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

      {/* 탭 콘텐츠 — 특수조건(T15/T18)은 M06 특수조건 탭 재사용(동일 spclCnd 데이터영역) */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <CmdtyGramtCtrdocDtl_Cn detail={detail} />}
        {tab === 'ctrt' && <CmdtyGramtCtrdocDtl_Ctrt type={type} />}
        {tab === 'spcl' && <CmdtyMdfcnCtrdocDtl_Spcl />}
      </div>

      {/* FAB — 맨위로 */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />

      {/* 출력 — 물품구매계약서 출력물(R39~R42 계열) OZ 리포트 스텁 */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () =>
            console.log(`[CT-01-${type === 'gramt' ? 'M07' : 'M08'}] 계약서 출력 → OZ 리포트 호출`),
        }}
      />
    </div>
  )
}
CmdtyGramtCtrdocDtlPage.displayName = 'CmdtyGramtCtrdocDtlPage'
