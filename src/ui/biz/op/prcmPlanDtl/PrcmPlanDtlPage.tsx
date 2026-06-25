// 조달계획 상세 (MUI-OP-01-M03, Figma 9300-37444). 카드 클릭 → /op/:id 진입.
// 구성(Figma contents area): 요약정보(SummaryInfo) + 스텝바(StepBar) + 탭(TabList)
//   + 탭 콘텐츠(탭별 컴포넌트 분리: PrcmPlanDtl / PrcmPlanDtl_PrdList / PrcmPlanDtl_OpnnList / PrcmPlanDtl_spclCtrt / PrcmPlanDtl_Doc).
// 데이터는 목업(상단=목록에서 넘어온 항목, 없으면 페이지 fallback 목업). 백엔드 미연동.
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout) 담당이라 본문은 콘텐츠만 렌더.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { OpPlanItem, OpPlanDetail } from '@/types/op'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Button } from '@/ui/common/base/Button'
import { SummaryUtilButton } from '@/ui/common/composites/SummaryUtilButton'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { PrcmPlan_NotiAply } from '@/ui/biz/op/prcmPlanDtl/PrcmPlan_NotiAply'
import {
  notiAplySchema,
  type NotiAplyForm,
} from '@/ui/biz/op/prcmPlanDtl/PrcmPlan_NotiAply.schema'
import { PrcmPlanDtl } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl'
import { PrcmPlanDtl_PrdList } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_PrdList'
import { PrcmPlanDtl_OpnnList } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_OpnnList'
import { PrcmPlanDtl_spclCtrt } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_spclCtrt'
import { PrcmPlanDtl_Doc } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_Doc'

// 직접 URL 진입(목록 state 없음) 대비 fallback 목업 — 설계서 dlt_prcmPlanList 항목명/형식 그대로.
// 평소엔 목록에서 navigate(state)로 받은 항목으로 상단을 그린다(아래 detail).
const MOCK_PLAN_DETAIL: OpPlanDetail = {
  id: '0',
  srchType: 'plan',
  no: 1,
  taskSeNm: '물품',
  prcmNo: '6000A',
  orderPrnmntYm: '2026-03',
  prcmPlanNm: "'26년 K5방독면",
  deptCd: '화력총괄계약팀',
  userNm: '홍길동',
  ctrtMthdCd: '수의계약',
  bidMthdCd: '전자입찰',
  drctnAmt: 11616000,
  implPrgrsStcd: '조달계획',
  prgrsStg: '조달',
}

// ── 탭 (Figma m_tab) ──────────────────────────────────────────────────────
const TABS: TabItem[] = [
  { value: 'detail', label: '상세내용' },
  { value: 'item', label: '품목명세서' },
  { value: 'opinion', label: '업체의견' },
  { value: 'contract', label: '계약특수조건' },
  { value: 'file', label: '첨부파일' },
]

// 탭 value → 콘텐츠 컴포넌트
function renderTabContent(tab: string) {
  switch (tab) {
    case 'detail':
      return <PrcmPlanDtl />
    case 'item':
      return <PrcmPlanDtl_PrdList />
    case 'opinion':
      return <PrcmPlanDtl_OpnnList />
    case 'contract':
      return <PrcmPlanDtl_spclCtrt />
    case 'file':
      return <PrcmPlanDtl_Doc />
    default:
      return null
  }
}

// ── 진행 단계 (단계표시기) — 아이템 속성 prgrsStg(진행단계) 로 구동. ──────────────
// 5단계(조달→입찰→계약→이행→대금청구). prgrsStg 는 설계서 데이터영역 미정의(상세설계 예정) —
// 단계표시기 구동용 항목으로 추가(사용자 승인). 진행상태 implPrgrsStcd(조달계획/공고게시/계약대기/
// 계약완료)는 조달 세부상태로 의미가 달라 StepBar 구동값이 아님.
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

/** 진행단계(prgrsStg)로 StepBar items 생성 — 이전 done / 현재 doing / 이후 todo. */
function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

export function PrcmPlanDtlPage() {
  const [tab, setTab] = useState('detail')
  // 스크롤 시 상단 블록(요약+스텝+탭) 축소 + sticky 동작 — 로직은 훅에서. (overflow-anchor 진동방지 포함)
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [outputOpen, setOutputOpen] = useState(false) // + 버튼 → 출력물 바텀시트(P17)
  const [notifyOpen, setNotifyOpen] = useState(false) // 알림 아이콘 → 알림신청 바텀시트(P10)
  // 알림신청 폼 — 페이지가 useForm 소유(footer 신청하기가 제출). 검증 = zod 스키마 + react-hook-form.
  // mode:onSubmit + reValidateMode:onBlur → 제출 시 전체 검증, 이후 에러 필드는 blur 시 재검증.
  const notiForm = useForm<NotiAplyForm>({
    resolver: zodResolver(notiAplySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { phone: '', agree: 'no' },
  })
  const handleNotifyApply = notiForm.handleSubmit(
    (data) => {
      console.log('[P10] 입찰공고 알림신청', data) // 추후 API: opService.applyNotify
      setNotifyOpen(false)
      notiForm.reset()
    },
    (errors) => {
      // 첫 에러 필드로 스크롤(Radix 그룹은 자동 포커스 불가 → 수동). main#app-scroll 셸 기준.
      const first = Object.keys(errors)[0]
      requestAnimationFrame(() =>
        document
          .getElementById(`field-${first}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    },
  )

  // 출력 버튼 — 서류 출력 확인 모달(MUI-BD-01-P14) 표시. 확인 시 OZ 리포트 호출(콘솔 스텁).
  const [outputModalOpen, setOutputModalOpen] = useState(false)
  const handleOutput = () => setOutputModalOpen(true)

  // 목록 → 상세 데이터 전달: 목록에서 navigate(state)로 넘어온 항목으로 상단을 그린다.
  //   직접 URL 진입(state 없음)이면 페이지 목업(MOCK_PLAN_DETAIL)으로 대체. (백엔드 미연동)
  const detail = (useLocation().state as OpPlanItem | null) ?? MOCK_PLAN_DETAIL
  // 진행단계(아이템 속성 prgrsStg) — detail 로 구동(없으면 '조달' fallback).
  const steps = stepsByStg(detail.prgrsStg ?? '조달')

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
          badges={[{ label: detail?.taskSeNm ?? '' }, { label: detail?.ctrtMthdCd ?? '' }].filter(
            (b) => b.label,
          )}
          subtitle={`판단번호 ${detail?.prcmNo ?? ''}`}
          title={detail?.prcmPlanNm ?? ''}
          actions={
            <>
              <SummaryUtilButton
                icon="NotificationAdd"
                label="알림 신청"
                onClick={() => setNotifyOpen(true)}
              />
              <SummaryUtilButton icon="Print" label="출력" onClick={handleOutput} />
            </>
          }
          rows={[
            { label: '발주예정월', value: detail?.orderPrnmntYm ?? '-' },
            { label: '발주기관', value: detail?.deptCd ?? '-' },
            { label: '입찰방법', value: detail?.bidMthdCd ?? '-' },
            { label: '예산금액', value: detail ? `${detail.drctnAmt.toLocaleString()} 원` : '-' },
          ]}
        />

        {/* 진행 단계 — 스크롤 축소(collapsed) 시 StepBar 도 함께 접힘(grid-rows 0fr 전환, SummaryInfo 와 동일 방식).
            배경 #ECF1FA 밴드(패딩 포함). StepBar 루트는 흰 bg 라 bg-transparent 로 덮어 밴드가 비치게. */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none 
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar orientation="horizontal" items={steps} className="bg-transparent" />
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

      {/* 탭 콘텐츠 (탭별 컴포넌트) */}
      {renderTabContent(tab)}

      {/* 알림 아이콘 → 입찰공고 알림신청 바텀시트 (P10) — 컨테이너는 페이지가 직접 조립, 콘텐츠만 분리 */}
      <BottomSheet
        open={notifyOpen}
        onOpenChange={setNotifyOpen}
        title="입찰공고 알림신청"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setNotifyOpen(false) },
              { label: '신청하기', variant: 'primary', onClick: handleNotifyApply },
            ]}
          />
        }
      >
        <PrcmPlan_NotiAply control={notiForm.control} />
      </BottomSheet>

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

      {/* 플로팅 버튼 — 맨위로(항상) + 추가(품목명세서 탭: 출력물 바텀시트) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={tab === 'item' ? () => setOutputOpen(true) : undefined}
        plusLabel="출력물"
      />

      {/* + 출력물 바텀시트 (MUI-BD-01-P17) — 출력물 명칭 버튼(품목명세서 출력 → OZ리포트 R10 연계 스텁).
          액션 버튼은 footer 슬롯에 배치(스크롤 본문의 overflow 클리핑으로 하단 border 잘리는 문제 방지). */}
      <BottomSheet
        open={outputOpen}
        onOpenChange={setOutputOpen}
        title="출력물"
        footer={
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              console.log('[M04] 품목명세서 출력(R10) OZ리포트 연계')
              setOutputOpen(false)
            }}
          >
            품목명세서 출력
          </Button>
        }
      />
    </div>
  )
}
