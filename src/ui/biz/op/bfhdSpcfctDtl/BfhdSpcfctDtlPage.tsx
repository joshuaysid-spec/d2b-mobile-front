// 사전규격 상세 (MUI-OP-01-M11, bfhdSpcfctDtl). 검색유형=사전규격 진입.
// 조달계획상세(M03)와 레이아웃 동일하나 탭 3개(상세내용/업체의견/첨부서류) — 품목명세서·계약특수조건·알림신청 없음.
// 구성: 요약정보(SummaryInfo) + 스텝바(StepBar) + 탭(TabList) + 탭 콘텐츠(BfhdSpcfctDtl / BfhdSpcfctDtl_OpnnList / BfhdSpcfctDtl_Doc).
// 데이터는 목업 — 추후 API(opService.selectSpecDtl)로 대체. 헤더는 전역 Header(AppLayout) 담당.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { BfhdSpcfctDtl } from '@/ui/biz/op/bfhdSpcfctDtl/BfhdSpcfctDtl'
import { BfhdSpcfctDtl_OpnnList } from '@/ui/biz/op/bfhdSpcfctDtl/BfhdSpcfctDtl_OpnnList'
import { BfhdSpcfctDtl_Doc } from '@/ui/biz/op/bfhdSpcfctDtl/BfhdSpcfctDtl_Doc'

// ── 탭 (Figma m_tab) ──────────────────────────────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세내용' },
  { value: 'opinion', label: '업체의견' },
  { value: 'file', label: '첨부파일' },
]

// 탭 value → 콘텐츠 컴포넌트
function renderTabContent(tab: string) {
  switch (tab) {
    case 'detail':
      return <BfhdSpcfctDtl />
    case 'opinion':
      return <BfhdSpcfctDtl_OpnnList />
    case 'file':
      return <BfhdSpcfctDtl_Doc />
    default:
      return null
  }
}

// ── 진행 단계 (Figma m_stepbar_horizontal_1depth) — 조달 진행 중 ──────────────
const STEPS: StepItem[] = [
  { label: '조달', state: 'doing' },
  { label: '입찰', state: 'todo' },
  { label: '계약', state: 'todo' },
  { label: '이행', state: 'todo' },
  { label: '대금청구', state: 'todo' },
]

// ── 요약정보 (목업) ────────────────────────────────────────────────────────
const SUMMARY_ROWS: SummaryInfoRow[] = [
  { label: '발주예정월', value: '2026-03' },
  { label: '발주기관', value: '화력총괄계약팀' },
  { label: '계약방법', value: '총액제' },
  { label: '예산금액', value: '11,616,000 원' },
]

export function BfhdSpcfctDtlPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('detail')
  // 스크롤 시 상단 블록(요약+스텝+탭) 축소 + sticky 동작 — 로직은 훅에서. (overflow-anchor 진동방지 포함)
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 출력 버튼 — 서류 출력 확인 모달(MUI-BD-01-P14) 표시. 확인 시 OZ 리포트 호출(콘솔 스텁).
  const [outputModalOpen, setOutputModalOpen] = useState(false)
  const handleOutput = () => setOutputModalOpen(true)

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보가 축소(infolist 숨김)되며 높이 감소. */}
      {/* 축소(collapsed=위에 붙음) 시 하단(=TabList 아래) 1px #D1D7E0 divider 노출.
          항상 border-b 를 두되 색만 transparent↔divider 로 전환(1px 점프 방지 + transition). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: '물품' }, { label: '수의계약' }]}
          subtitle="판단번호 6000A"
          title="'26년 K5방독면"
          actions={
            // 사전규격(M11)은 알림신청(P10) 없음 — 출력만.
            <SummaryUtilButton icon="Print" label="출력" onClick={handleOutput} />
          }
          rows={SUMMARY_ROWS}
        />

        {/* 진행 단계 — 스크롤 축소(collapsed) 시 StepBar 도 함께 접힘(grid-rows 0fr 전환, SummaryInfo 와 동일 방식).
            배경 #ECF1FA 밴드(패딩 포함). StepBar 루트는 흰 bg 라 bg-transparent 로 덮어 밴드가 비치게.
            (조달계획 상세 PrcmPlanDtlPage 와 동일 — 2026-08-11 통일) */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none ${
            collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
          }`}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar
                orientation="horizontal"
                items={STEPS}
                sheetItems={buildProgressSheet('조달', (substep, prgrsStg) => navigate('/anl-prgrs', { state: { substep, prgrsStg } }))}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="px-4">
          {/* 탭 전환 시 본문을 맨 위로 — 단, 접힘(collapsed) 상태였으면 헤더는 접힌 채 유지(goToContentTop). */}
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

      {/* 탭 콘텐츠 (탭별 컴포넌트) — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(상단 튕김 진동 방지, bd 상세와 동일) */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 출력 — 서류 출력 확인 모달 (MUI-BD-01-P14) */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[출력] 서류 출력 확인 → OZ 리포트 호출 (loginYn = y 상태)'),
        }}
      />

      {/* 플로팅 버튼 — 맨위로(사전규격은 품목명세서 출력 FAB 없음). */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
