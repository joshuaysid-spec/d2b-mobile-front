// 연간조달계획 상세 (경로 /op/ovs/:id) — 통합목록의 검색유형 '연간조달계획'(annual) 카드 진입.
// 탭 = 목록정보조회(군수품 목록) 3탭: 형상자료(MUI-OP-01-T73) / 식별자료(T74) / 참고자료(T75).
//   설계서 p75 는 이 진입을 P76 목록정보조회 '풀페이지 팝업' 으로 규정하나,
//   사용자 확정(2026-08-11)에 따라 이 페이지가 P76 컨테이너 역할을 겸한다(별도 WarSplList_Inq 없음).
// 셸(요약 SummaryInfo + 스텝 StepBar + 탭 + useCollapsibleHeader)은 조달계획 상세 컨벤션 그대로.
//   ⚠️ 구 탭 콘텐츠 OvsPrcmPlanDtl(T71 집행계획상세)·OvsPrcmPlanDtl_RsltList(T72 결과목록)는
//      이 경로에서 제거됐다. 설계서 정의 화면이라 파일은 보존 — 국외 조달계획 동선 확정 시 재연결.
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import type { OpPlanItem } from '@/types/op'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { WarSplList_Cnfg } from '@/ui/biz/op/ovsPrcmPlanDtl/WarSplList_Cnfg'
import { WarSplList_Idntf } from '@/ui/biz/op/ovsPrcmPlanDtl/WarSplList_Idntf'
import { WarSplList_Ref } from '@/ui/biz/op/ovsPrcmPlanDtl/WarSplList_Ref'

// ── 탭 (목록정보조회 — 형상자료 T73 / 식별자료 T74 / 참고자료 T75) ────────────
const TABS: TabItem[] = [
  { value: 'cnfg', label: '형상자료' },
  { value: 'idntf', label: '식별자료' },
  { value: 'ref', label: '참고자료' },
]

// ── 진행 단계 ──────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  { label: '조달', state: 'doing' },
  { label: '입찰', state: 'todo' },
  { label: '계약', state: 'todo' },
  { label: '이행', state: 'todo' },
  { label: '대금청구', state: 'todo' },
]

// ── 요약정보 (목업) ────────────────────────────────────────────────────────
const SUMMARY_ROWS: SummaryInfoRow[] = [
  { label: '지시년도', value: '2026' },
  { label: '발주기관', value: '해외조달팀' },
  { label: '계약방법', value: '일반경쟁' },
  { label: '지시예산(USD)', value: '$ 540,000.00' },
]

export function OvsPrcmPlanDtlPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('cnfg')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 연간조달계획 식별자 — 3탭의 디폴트 값 조회 기준(경로 /op/ovs/:id).
  const { id = '' } = useParams<{ id: string }>()

  // NIIN — 설계서 slide78 "다른 탭 페이지에서 NIIN 설정 시 탭에 모두 NIIN 유지" 규칙 때문에
  // 페이지가 소유하고 3탭에 그대로 내려준다. 검색 실행 시에만 appliedNiin 이 확정되고,
  // 각 탭은 디폴트 조회 결과 아래에 이 NIIN 의 검색 결과를 이어붙인다.
  const [niin, setNiin] = useState('')
  const [appliedNiin, setAppliedNiin] = useState('')
  const handleNiinSearch = () => setAppliedNiin(niin.trim())

  const renderTabContent = (current: string) => {
    // 3탭 공통 — 계획 id + NIIN 입력값/확정값과 핸들러를 동일하게 전달(탭 전환해도 값 유지).
    const tabProps = {
      planId: id,
      niin,
      onNiinChange: setNiin,
      onSearch: handleNiinSearch,
      appliedNiin,
    }
    switch (current) {
      case 'cnfg':
        return <WarSplList_Cnfg {...tabProps} />
      case 'idntf':
        return <WarSplList_Idntf {...tabProps} />
      case 'ref':
        return <WarSplList_Ref {...tabProps} />
      default:
        return null
    }
  }

  // 출력 버튼 — 서류 출력 확인 모달(MUI-BD-01-P14).
  const [outputModalOpen, setOutputModalOpen] = useState(false)
  const handleOutput = () => setOutputModalOpen(true)

  // 통합목록에서 국외 카드 클릭 시 navigate(state)로 넘어온 항목(OpPlanItem). 백엔드 미연동.
  //   국외 요약 전용필드(지시예산 USD·조달요구번호 등)는 통합목록 아이템에 없어 페이지 목업으로 보완.
  const passed = useLocation().state as OpPlanItem | null

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소. */}
      {/* 축소(collapsed=위에 붙음) 시 하단(=TabList 아래) 1px #D1D7E0 divider 노출.
          항상 border-b 를 두되 색만 transparent↔divider 로 전환(1px 점프 방지 + transition). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: '국외' }, { label: passed?.ctrtMthdCd ?? '일반경쟁' }]}
          subtitle="조달요구번호 A-2026-0001"
          title={passed?.prcmPlanNm ?? "'26년 야간투시경 해외구매"}
          actions={
            // 국외(M73)은 알림신청 없음 — 출력만.
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(상단 튕김 진동 방지, bd 상세와 동일) */}
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
          onClick: () => console.log('[출력] 국외 서류 출력 확인 → OZ 리포트 호출'),
        }}
      />

      {/* 플로팅 버튼 — 맨위로 */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsPrcmPlanDtlPage.displayName = 'OvsPrcmPlanDtlPage'
