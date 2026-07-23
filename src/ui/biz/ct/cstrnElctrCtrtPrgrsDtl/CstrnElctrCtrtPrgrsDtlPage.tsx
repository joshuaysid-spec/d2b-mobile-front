// 공사전자계약진행상세 (MUI-CT-01-M09). 설계서 03.계약 v0.83 slide38~47.
// 계약통합목록 카드(공사 진행) 클릭 → /ct/cstrn/:id 진입. 물품 상세(M03)와 동일 셸 —
// 탭만 다름(상세정보 _Cn / 계약업체 _Artcl / 하자담보책임 _Flw / 첨부서류 = M03 _Adoc 재사용).
// 바로가기·보증서(M73)·인지세(M74) 팝업 재사용(진행단계별 매트릭스 slide47 = slide32 와 동일 구성).
// 계약명세서(P11)는 물품 전용 → 공사 바로가기에서 제외.
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCstrnCtrtPrgrsDtl } from '@/queries/ct'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Button } from '@/ui/common/base/Button'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { CstrnElctrCtrtPrgrsDtl_Cn } from '@/ui/biz/ct/cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtl_Cn'
import { CstrnElctrCtrtPrgrsDtl_Artcl } from '@/ui/biz/ct/cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtl_Artcl'
import { CstrnElctrCtrtPrgrsDtl_Flw } from '@/ui/biz/ct/cstrnElctrCtrtPrgrsDtl/CstrnElctrCtrtPrgrsDtl_Flw'
import { CmdtyElctrCtrtPrgrsDtl_Adoc } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Adoc'
import { GrnteCnfrmFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/GrnteCnfrmFullPopup'
import { StmtxCnfrmFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/StmtxCnfrmFullPopup'
import { CtrtPrgrsSttsInqFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CtrtPrgrsSttsInqFullPopup'

// ── 탭 (설계서 slide38 탭바: 상세정보/계약업체/하자담보책임/첨부서류) ──────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'bzenty', label: '계약업체' },
  { value: 'flw', label: '하자담보책임' },
  { value: 'adoc', label: '첨부서류' },
]

// ── 진행 단계 — M03 과 동일한 5단계 모델, 현재 '계약'. ─────────────────────────
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function CstrnElctrCtrtPrgrsDtlPage() {
  const { id = '' } = useParams()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트
  const [grnteOpen, setGrnteOpen] = useState(false) // 보증서 확인(M73)
  const [stmtxOpen, setStmtxOpen] = useState(false) // 인지세 확인(M74)
  const [prgrsSttsOpen, setPrgrsSttsOpen] = useState(false) // 계약진행상태(P17)
  const [outputModalOpen, setOutputModalOpen] = useState(false) // 출력 확인

  const { data: detail } = useCstrnCtrtPrgrsDtl(id)
  const steps = stepsByStg('계약')

  if (!detail) return <PageLoading />

  // 바로가기 항목 클릭 → 시트 닫고 해당 팝업 열기.
  const openFromSheet = (open: (v: boolean) => void) => {
    setShortcutOpen(false)
    open(true)
  }
  // 바로가기 — 진행단계별 버튼 매트릭스(slide47)의 목업 단계(40-계약체결의뢰 대표업체) 구성.
  // ⚠️ 단계·업체구분별 노출 분기는 백엔드 상태코드 확정 시 데이터 구동으로 확장.
  const shortcuts = [
    { id: 'grnte', label: '보증서 확인', onClick: () => openFromSheet(setGrnteOpen) },
    { id: 'stmtx', label: '인지세 확인', onClick: () => openFromSheet(setStmtxOpen) },
    // 계약진행상태(P17) — 진행상태 클릭 이벤트(slide22)의 모바일 진입점.
    { id: 'prgrsStts', label: '계약진행상태', onClick: () => openFromSheet(setPrgrsSttsOpen) },
    {
      id: 'docSbmsn',
      label: '계약서류 제출/전송',
      // 추후: 계약서류 제출 화면 연계(미구현 — slide47 매트릭스)
      onClick: () => console.log('[CT-01-M09] 계약서류 제출/전송(미구현)'),
    },
    {
      id: 'elsgn',
      label: '계약체결 [전자서명]',
      // 추후: 전자서명 프로세스 연계(미구현 — slide47 매트릭스)
      onClick: () => console.log('[CT-01-M09] 계약체결 전자서명(미구현)'),
    },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 계약 진행/등록 변경은 PC 전용(M03 과 동일, 전 탭 공통 상단) */}
      <Notice type="urgent">계약 진행, 정보 등록 변경은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소 + StepBar 접힘(M03 과 동일 방식) */}
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
            { label: detail.ctrtStatNm ?? '' },
          ].filter((b) => b.label)}
          subtitle={`판단번호 ${detail.prcmNo} / 계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
          title={detail.ctrtNm}
          actions={
            // 출력 — 공사도급계약서(R35)/기술용역계약서(R36) 출력물(slide46 이벤트)
            <SummaryUtilButton icon="Print" label="출력" onClick={() => setOutputModalOpen(true)} />
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
                sheetItems={buildProgressSheet('계약', (substep, prgrsStg) =>
                  console.log('[CT-01-M09] 연관 진행 이동(미배선)', substep, prgrsStg),
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(M03 과 동일) */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <CstrnElctrCtrtPrgrsDtl_Cn detail={detail} />}
        {tab === 'bzenty' && <CstrnElctrCtrtPrgrsDtl_Artcl />}
        {tab === 'flw' && <CstrnElctrCtrtPrgrsDtl_Flw />}
        {/* 첨부서류 — 국내 공통 구조(slide42 = slide27) → M03 첨부서류 탭 재사용 */}
        {tab === 'adoc' && <CmdtyElctrCtrtPrgrsDtl_Adoc />}
      </div>

      {/* 플로팅 버튼 — 맨위로(항상) + 상세정보 탭에서 '+' 바로가기 */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={tab === 'detail' ? () => setShortcutOpen(true) : undefined}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 — 컨테이너는 페이지 소유 + NavigationItemList 슬롯 조합 */}
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
        <NavigationItemList items={shortcuts} />
      </BottomSheet>

      {/* 출력 — 서류 출력 확인 모달. 확인 시 OZ 리포트 호출(스텁, R35/R36) */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-01-M09] 공사도급계약서 출력(R35/R36) → OZ 리포트 호출'),
        }}
      />

      {/* 보증서 확인(M73) · 인지세 확인(M74) · 계약진행상태(P17) 풀팝업 — M03 컴포넌트 재사용 */}
      <GrnteCnfrmFullPopup open={grnteOpen} onOpenChange={setGrnteOpen} />
      <StmtxCnfrmFullPopup open={stmtxOpen} onOpenChange={setStmtxOpen} />
      <CtrtPrgrsSttsInqFullPopup open={prgrsSttsOpen} onOpenChange={setPrgrsSttsOpen} />
    </div>
  )
}
CstrnElctrCtrtPrgrsDtlPage.displayName = 'CstrnElctrCtrtPrgrsDtlPage'
