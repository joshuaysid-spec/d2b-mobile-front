// 물품일반계약서상세 (MUI-CT-01-M05). 설계서 03.계약 v0.83 slide63~68.
// 계약통합목록 카드(물품 '계약최종' — 타 계약서) 클릭 → /ct/cmdtyGnrlCtrdocDtl 진입(식별자는 navigate state).
// 탭 없는 단일 콘텐츠: 중요안내 + 요약(SummaryInfo) + 스텝(StepBar) +
//   아코디언 4개(계약 상세정보 · 계약금액 · 계약대상자 · 담당자 정보) +
//   FAB '+' 바로가기(계약명세서 조회 → P14 물품일반계약명세서, slide64 1-1]) + 출력.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Notice } from '@/ui/common/composites/Notice'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { CmdtyCtrtDtstFullPopup } from '@/ui/biz/ct/cmdtyElctrCtrtPrgrsDtl/CmdtyCtrtDtstFullPopup'
import type { MockCtrtIntgListItem } from '@/types/mock/ct'

const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function CmdtyGnrlCtrdocDtlPage() {
  const stateItem = useLocation().state as MockCtrtIntgListItem | null
  const id = stateItem?.id ?? ''
  const navigate = useNavigate()
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기
  const [dtstOpen, setDtstOpen] = useState(false) // P14 물품일반계약명세서
  const [outputModalOpen, setOutputModalOpen] = useState(false)

  const { data: detail } = ctQueries.useSelectCtrdocDtlInq(id)
  const steps = stepsByStg('계약')

  // 식별자는 목록에서만 전달 — 직접 URL 진입(state 없음)은 목록으로 되돌린다.
  if (!stateItem) return <Navigate to="/ct" replace />
  if (!detail) return <PageLoading />

  // ── 계약 상세정보 (slide65 표 순서) ────────────────────────────────────────
  const detailRows: TableRow[] = [
    { label: '계약번호', value: `${detail.ctrtNo} (${detail.ctrtCycl})` },
    { label: '계약유형', value: detail.ctrdocTpcd },
    { label: '판단번호', value: detail.prcmNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '발주처', value: detail.orderInstNm },
    { label: '계약방법', value: detail.ctrtMthdCd },
    { label: '계약일자', value: detail.ctrtYmd },
    { label: '증권번호', value: detail.scrtNo ?? '-' },
    { label: '수의계약사유', value: detail.pvctRncd ?? '-' },
    { label: '납부방법', value: detail.depsPayMthdCd ?? '-' },
    { label: '납품일자', value: detail.dlvgdsYmd ?? '-' },
    { label: '납품장소', value: detail.dlvgdsPlcNm ?? '-' },
    { label: '물가변동계약금액 조정방법', value: detail.pfrAplcnMthdCd ?? '-' },
    { label: '기타사항', value: detail.etcMttr ?? '-' },
  ]

  // ── 계약금액 (slide65 — 본조/국채/합계/총제조부기금액/계약보증금/지체상금율) ──
  const amountRows: TableRow[] = [
    { label: '본조', value: `${detail.bscbgtCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '국채', value: `${detail.govbndCtrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '합계', value: `${detail.sumAmt.toLocaleString()} 원`, type: 'number' },
    {
      label: '총제조부기금액',
      value: `${detail.tcstrnBkpngAmt.toLocaleString()} 원`,
      type: 'number',
    },
    { label: '계약보증금', value: `${detail.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '지체상금율', value: `${detail.lqdmgRt} %`, type: 'number' },
  ]

  // ── 계약대상자(업체정보, slide65 4]) ──────────────────────────────────────
  const bzentyRows: TableRow[] = [
    { label: '상호', value: detail.bzenty.bzentyNm },
    { label: '사업자등록번호', value: detail.bzenty.brno },
    { label: '대표자', value: detail.bzenty.rprsvNm },
    { label: '전화번호', value: detail.bzenty.telno },
    { label: '주소', value: detail.bzenty.bzentyAddr },
    { label: '금융기관', value: detail.bzenty.fnstCd },
    { label: '계좌번호', value: detail.bzenty.actno },
    { label: '예금주', value: detail.bzenty.dpstrNm },
  ]

  // ── 담당자 정보 (slide67 1.2 — 구매/원가/계약담당) ──────────────────────────
  const managerRows: TableRow[] = detail.managers.flatMap((m) => [
    { label: '구분', value: m.tkcgSecd },
    { label: '성명/계급', value: m.picNm },
  ])

  const openFromSheet = (open: (v: boolean) => void) => {
    setShortcutOpen(false)
    open(true)
  }

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
          badges={[{ label: detail.taskSecd }, { label: detail.ctrtMthdCd }]}
          subtitle={`판단번호 ${detail.prcmNo} / 계약번호 ${detail.ctrtNo} - ${detail.ctrtCycl}`}
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
                  navigate('/anl-prgrs', { state: { substep, prgrsStg } }),
                )}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 단일 콘텐츠 — 탭 없음(slide63): 아코디언 4개 */}
      <div className="min-h-[100dvh]">
        <Accordion
          type="multiple"
          defaultValue={['detail', 'amount', 'bzenty', 'manager']}
          className="w-full"
        >
          <AccordionSection value="detail" title="계약 상세정보" borderTop={false}>
            <Table rows={detailRows} />
          </AccordionSection>
          <AccordionSection value="amount" title="계약금액">
            <Table rows={amountRows} />
          </AccordionSection>
          <AccordionSection value="bzenty" title="계약대상자">
            <Table rows={bzentyRows} />
          </AccordionSection>
          <AccordionSection value="manager" title="담당자 정보">
            <Table rows={managerRows} />
          </AccordionSection>
        </Accordion>
      </div>

      {/* FAB — 맨위로 + '+' 바로가기(상세 기능이 있는 페이지에만 노출, slide64) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 — 계약명세서 조회(slide64 1-1: 일반계약서 → P14 물품일반계약명세서) */}
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
            { id: 'dtst', label: '계약명세서 조회', onClick: () => openFromSheet(setDtstOpen) },
          ]}
        />
      </BottomSheet>

      {/* 출력 — 서류 출력 확인 모달(OZ 리포트 스텁) */}
      <AlertModal
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
        variant="info"
        title="서류 출력 확인"
        description="OZ 리포트가 실행되며, 로딩에 약간의 시간이 소요됩니다. 서류 출력을 진행할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => console.log('[CT-01-M05] 물품일반계약서 출력 → OZ 리포트 호출'),
        }}
      />

      {/* P14 물품일반계약명세서 — P11 팝업 재사용(데이터영역 동일, title 교체) */}
      <CmdtyCtrtDtstFullPopup
        id={id}
        open={dtstOpen}
        onOpenChange={setDtstOpen}
        title="물품일반계약명세서"
      />
    </div>
  )
}
CmdtyGnrlCtrdocDtlPage.displayName = 'CmdtyGnrlCtrdocDtlPage'
