// 국외전자계약진행상세 (MUI-CT-01-M71 OvsElctrCtrtPrgrsDtlPage). 설계서 03.계약 v0.83 slide149~169.
// 계약통합목록 카드(국외) 클릭 → /ct/ovs/:id 진입.
// 탭 6개: 일반현황(T71) · 계좌정보(T72) · 보증서(T73 — M73 데이터 재사용) · 인지세(T74 — M74 재사용)
//   · 계약명세서(T75) · 첨부서류(T76 — 국내 구조 + 직인등록정보).
// M72 국외전자계약확정상세 겸용 — 설계서 slide146 '탭은 국외전자계약진행상세와 동일함'(같은 구조 = 1페이지).
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useOvsCtrtDtl } from '@/queries/ct'
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
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Button } from '@/ui/common/base/Button'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { OvsElctrCtrtPrgrsDtlTab } from '@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlTab'
import { OvsBacntInfoTab } from '@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsBacntInfoTab'
import { OvsWtgrTab } from '@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsWtgrTab'
import { OvsStmtxTab } from '@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsStmtxTab'
import { OvsCtrtDtstTab } from '@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsCtrtDtstTab'
import { OvsElctrCtrtPrgrsDtlTab_Adoc } from '@/ui/biz/ct/ovsElctrCtrtPrgrsDtl/OvsElctrCtrtPrgrsDtlTab_Adoc'

// ── 탭 (slide149 탭바 + slide155 탭 이벤트: 일반현황~계약명세서 + 첨부서류) ────
const TABS: TabItem[] = [
  { value: 'gnrl', label: '일반현황' },
  { value: 'bacnt', label: '계좌정보' },
  { value: 'wtgr', label: '보증서' },
  { value: 'stmtx', label: '인지세' },
  { value: 'dtst', label: '계약명세서' },
  { value: 'adoc', label: '첨부서류' },
]

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function OvsElctrCtrtPrgrsDtlPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const [tab, setTab] = useState('gnrl')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기
  const [outputModalOpen, setOutputModalOpen] = useState(false)

  const { data: detail } = useOvsCtrtDtl(id)
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
          badges={[{ label: detail.taskSecd }, { label: detail.elctrCtrtPrgrsSttsCd }].filter(
            (b) => b.label,
          )}
          subtitle={`공고번호 ${detail.pbancNo ?? '-'} / 계약번호 ${detail.ctrtNo} (${detail.ctrtCycl})`}
          title={detail.ctrtNm}
          actions={
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setOutputModalOpen(true)} />
          }
          rows={[
            { label: '계약일자', value: detail.ctrtYmd },
            { label: '발주기관', value: detail.orderInstNm },
            { label: '계약금액', value: detail.summaryAmt },
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
                  navigate('/anl-prgrs', { state: { substep, prgrsStg } }),
                )}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* 탭 — 6개(가로 스와이프) */}
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

      {/* 탭 콘텐츠 */}
      <div className="min-h-[100dvh]">
        {tab === 'gnrl' && <OvsElctrCtrtPrgrsDtlTab detail={detail} />}
        {tab === 'bacnt' && <OvsBacntInfoTab />}
        {tab === 'wtgr' && <OvsWtgrTab />}
        {tab === 'stmtx' && <OvsStmtxTab />}
        {tab === 'dtst' && <OvsCtrtDtstTab />}
        {tab === 'adoc' && <OvsElctrCtrtPrgrsDtlTab_Adoc />}
      </div>

      {/* FAB — 맨위로 + '+' 바로가기(일반현황 탭) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={tab === 'gnrl' ? () => setShortcutOpen(true) : undefined}
        plusLabel="바로가기"
      />

      {/* 바로가기 — 상업계약서 상세(M77, 흐름도 slide147) */}
      <BottomSheet
        open={shortcutOpen}
        onOpenChange={setShortcutOpen}
        title="바로가기"
        footer={
          <Button variant="secondary" className="w-full" onClick={() => setShortcutOpen(false)}>
            확인
          </Button>
        }
      >
        <NavigationItemList
          items={[
            {
              id: 'cmbz',
              label: '상업계약서 상세',
              onClick: () => {
                setShortcutOpen(false)
                navigate(`/ct/ovs/cmbz/${id}`)
              },
            },
          ]}
        />
      </BottomSheet>

      {/* 출력 — 상업계약서 출력물 OZ 리포트 스텁 */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-01-M71] 국외 계약서 출력 → OZ 리포트 호출'),
        }}
      />
    </div>
  )
}
OvsElctrCtrtPrgrsDtlPage.displayName = 'OvsElctrCtrtPrgrsDtlPage'
