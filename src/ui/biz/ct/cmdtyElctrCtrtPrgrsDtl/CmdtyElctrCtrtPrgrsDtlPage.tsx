// 물품전자계약진행상세 (MUI-CT-01-M03, Figma 10020-154603/154708/154930/154807 + 바로가기 155209).
// 설계서 03.계약 v0.83 slide23~32. 계약통합목록 카드(물품 진행) 클릭 → /ct/:id 진입.
// ⚠️ M04 물품전자계약확정상세 겸용 — 설계서 slide33 참고사항 '물품전자계약진행상세와 화면이 동일함'
//   (같은 구조 = 1페이지 원칙). 확정 상태는 상세 조회 응답(ctrtStatNm/ctrtPrgrsStcd)으로 구분되며,
//   바로가기 '계약명세서'가 확정 시 P12 물품최종계약명세서로 분기된다.
// 구성: 중요 안내(Notice urgent, PC 안내) + sticky(요약 SummaryInfo + 스텝 StepBar + 탭 TabList)
//   + 탭 콘텐츠(상세정보 _Cn / 계약업체 _Artcl / 반송·취소사유 _RjctRsn / 첨부서류 _Adoc)
//   + FAB(맨위로 + 상세정보 탭에서 '+' 바로가기 바텀시트) + 팝업(보증서 M73 · 인지세 M74 · 계약명세서 P11).
// 데이터: useCtrtPrgrsDtl — 목록 state 는 요약 즉시표시에 안 쓰고 조회로 확정(필드 구성이 목록과 달라
//   placeholder 부적합) → 조회 완료까지 PageLoading. 목업/실연동은 ctService(USE_MOCK)가 전환.
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCtrtPrgrsDtl } from '@/queries/ct'
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
import { CmdtyElctrCtrtPrgrsDtl_Cn } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Cn'
import { CmdtyElctrCtrtPrgrsDtl_Artcl } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Artcl'
import { CmdtyElctrCtrtPrgrsDtl_RjctRsn } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_RjctRsn'
import { CmdtyElctrCtrtPrgrsDtl_Adoc } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyElctrCtrtPrgrsDtl_Adoc'
import { GrnteCnfrmFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/GrnteCnfrmFullPopup'
import { StmtxCnfrmFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/StmtxCnfrmFullPopup'
import { CmdtyCtrtDtstFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyCtrtDtstFullPopup'
import { CmdtyLastCtrdocDtstFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyLastCtrdocDtstFullPopup'
import { CtrtPrgrsSttsInqFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CtrtPrgrsSttsInqFullPopup'

// ── 탭 (Figma 154930 tab bar — 화면목록 T03=특수조건은 레이아웃과 불일치, 레이아웃 기준) ──
const TABS: TabItem[] = [
  { value: 'detail', label: '상세정보' },
  { value: 'bzenty', label: '계약업체' },
  { value: 'rjctRsn', label: '반송/취소 사유' },
  { value: 'adoc', label: '첨부서류' },
]

// ── 진행 단계 — OP 상세와 동일한 5단계 모델(조달→입찰→계약→이행→대금청구), 현재 '계약'. ──
// Figma(154603)는 3단계+스와이프 노출 — StepBar 가로 스크롤로 뒷단계 노출(동일 컴포넌트).
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function CmdtyElctrCtrtPrgrsDtlPage() {
  const { id = '' } = useParams()
  const [tab, setTab] = useState('detail')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트(155209)
  const [grnteOpen, setGrnteOpen] = useState(false) // 보증서 확인(M73)
  const [stmtxOpen, setStmtxOpen] = useState(false) // 인지세 확인(M74)
  const [dtstOpen, setDtstOpen] = useState(false) // 물품계약명세서(P11 — 진행)
  const [lastDtstOpen, setLastDtstOpen] = useState(false) // 물품최종계약명세서(P12 — 확정)
  const [prgrsSttsOpen, setPrgrsSttsOpen] = useState(false) // 계약진행상태(P17)
  const [outputModalOpen, setOutputModalOpen] = useState(false) // 출력 확인(MUI-BD-01-P14 패턴)

  const { data: detail } = useCtrtPrgrsDtl(id)
  // 진행 단계 — 계약 도메인 상세는 '계약' 단계(설계서 slide23 단계표시기).
  const steps = stepsByStg('계약')

  if (!detail) return <PageLoading />

  // 바로가기 항목 클릭 → 시트 닫고 해당 팝업 열기.
  const openFromSheet = (open: (v: boolean) => void) => {
    setShortcutOpen(false)
    open(true)
  }
  // 바로가기(이벤트) 목록 — 진행단계별 버튼 매트릭스(slide32)의 목업 단계(40-계약체결의뢰 대표업체) 구성.
  // ⚠️ 단계·업체구분별 노출 분기(slide32 전체 매트릭스)는 백엔드 상태코드 확정 시 데이터 구동으로 확장.
  const shortcuts = [
    { id: 'grnte', label: '보증서 확인', onClick: () => openFromSheet(setGrnteOpen) },
    { id: 'stmtx', label: '인지세 확인', onClick: () => openFromSheet(setStmtxOpen) },
    {
      id: 'dtst',
      label: '계약명세서',
      // 계약확정(M04 겸용) → P12 물품최종계약명세서 · 진행 → P11 물품계약명세서(slide31 유형별 호출)
      onClick: () =>
        openFromSheet(detail.ctrtStatNm === '계약확정' ? setLastDtstOpen : setDtstOpen),
    },
    // 계약진행상태(P17) — 진행상태 클릭 이벤트(slide22 그리드-진행상태)의 모바일 진입점.
    { id: 'prgrsStts', label: '계약진행상태', onClick: () => openFromSheet(setPrgrsSttsOpen) },
    {
      id: 'docSbmsn',
      label: '계약서류 제출/전송',
      // 추후: 계약서류 제출 화면 연계(미구현 — slide32 매트릭스)
      onClick: () => console.log('[CT-01-M03] 계약서류 제출/전송(미구현)'),
    },
    {
      id: 'elsgn',
      label: '계약체결 [전자서명]',
      // 추후: 전자서명 프로세스 연계(미구현 — slide32 매트릭스)
      onClick: () => console.log('[CT-01-M03] 계약체결 전자서명(미구현)'),
    },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 중요 안내 — 계약 진행/등록 변경은 PC 전용(Figma m_notice_urgent, 전 탭 공통 상단) */}
      <Notice type="urgent">계약 진행, 정보 등록 변경은 PC 버전에서 가능합니다.</Notice>

      {/* 상단 블록 — sticky. 스크롤 시 요약 축소(collapsed) + StepBar 접힘(OP 상세와 동일 방식) */}
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
            // 출력(print) — 출력이 있는 계약: 계약서표지 출력물(R37~R46, slide23) OZ 리포트 연계
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
                  console.log('[CT-01-M03] 연관 진행 이동(미배선)', substep, prgrsStg),
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지, OP 상세와 동일) */}
      <div className="min-h-[100dvh]">
        {tab === 'detail' && <CmdtyElctrCtrtPrgrsDtl_Cn detail={detail} />}
        {tab === 'bzenty' && <CmdtyElctrCtrtPrgrsDtl_Artcl />}
        {tab === 'rjctRsn' && <CmdtyElctrCtrtPrgrsDtl_RjctRsn />}
        {tab === 'adoc' && <CmdtyElctrCtrtPrgrsDtl_Adoc />}
      </div>

      {/* 플로팅 버튼 — 맨위로(항상) + 상세정보 탭에서 '+' 바로가기(slide23: 현 상세내용 탭에서는 + 버튼) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={tab === 'detail' ? () => setShortcutOpen(true) : undefined}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트(Figma 155209) — 컨테이너는 페이지 소유 + NavigationItemList 슬롯 조합 */}
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

      {/* 출력 — 서류 출력 확인 모달(MUI-BD-01-P14 패턴). 확인 시 OZ 리포트 호출(스텁, R37~R46) */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-01-M03] 계약서표지 출력(R37~R46) → OZ 리포트 호출'),
        }}
      />

      {/* 보증서 확인(M73) · 인지세 확인(M74) · 물품계약명세서(P11) · 물품최종계약명세서(P12) 풀팝업 */}
      <GrnteCnfrmFullPopup open={grnteOpen} onOpenChange={setGrnteOpen} />
      <StmtxCnfrmFullPopup open={stmtxOpen} onOpenChange={setStmtxOpen} />
      <CmdtyCtrtDtstFullPopup open={dtstOpen} onOpenChange={setDtstOpen} />
      <CmdtyLastCtrdocDtstFullPopup open={lastDtstOpen} onOpenChange={setLastDtstOpen} />
      <CtrtPrgrsSttsInqFullPopup open={prgrsSttsOpen} onOpenChange={setPrgrsSttsOpen} />
    </div>
  )
}
CmdtyElctrCtrtPrgrsDtlPage.displayName = 'CmdtyElctrCtrtPrgrsDtlPage'
