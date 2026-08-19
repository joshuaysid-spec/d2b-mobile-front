// 연관 진행 목록 (설계서 미정의 화면 — 260710 기획 확정: 페이지로 구성. docs/02-design/features/anl-prgrs-list.design.md)
// ⚠️ 모바일 화면설계서에 없는 화면(PC 설계 동선 준용) — 화면ID 미채번. 임시 ID anlPrgrsList('연관' Anl 접두 관례).
//   기획에서 화면ID 채번 시 폴더/파일명 교체할 것.
// 진입: 상세 화면들의 진행현황 바텀시트(StepBar ▾ → buildProgressSheet)에서 세부단계(2depth) 클릭
//   → 해당 단계의 "기준 건과 엮인(통합참조번호 등 동일 계열) 연관 건"만 목록으로 표시(대체로 1건, 더러 2건).
// 구성(기획 확정): 상단 스텝바(가로 StepBar) + 총건수(SectionTitle info) + 카드 UI 리스트.
// 데이터: 페이지 내 목업 — 추후 API: cmService.selectAnlPrgrsList(rfrncNo, substep) 등 연관 건 조회로 교체.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildAnlProgressSheet, stageOfSubstep } from '@/ui/common/composites/stepPresets'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'

// 가로 스텝바 — 기존 상세와 동일한 대단계 5칩(조달/입찰/계약/이행/대금청구).
// 표시 규칙(260710 확정): **doing(빨강) = 지금 보고 있는 단계 · done(체크) = 기준 건이 진행한 단계(prgrsStg 이하)**.
//   예) 계약까지 진행된 건에서 입찰 쪽 연관 목록을 보면 → 조달✓ 입찰(빨강) 계약✓ 이행/대금청구 todo.
// 시트(▾)에서 세부단계 클릭 시 즉시 시트가 닫히고 목록 전환(확인 버튼 불필요 — StepBar 가 자동 처리).
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const

function stepsFor(viewedStage: string, prgrsStg: string): StepItem[] {
  const prgrs = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: label === viewedStage ? 'doing' : prgrs >= 0 && i <= prgrs ? 'done' : 'todo',
  }))
}

/** 연관 건 1건 — 세부단계별 카드 표시용(항목명은 각 도메인 목록 아이템 항목명 재사용). */
interface AnlPrgrsItem {
  /** 상세 라우팅 키 */
  id: string
  /** 업무구분 (taskSeNm) */
  taskSeNm: string
  /** 통합참조번호 (rfrncNo) */
  rfrncNo: string
  /** 건명/사업명 (bizNm) */
  bizNm: string
  /** 정보행(라벨/값) — 세부단계별로 주요 일자·번호를 표시 */
  rows: { label: string; value: string }[]
}

// 연관 건 목업 — 기준 건(통합참조번호 2025LDG56349 계열)과 엮인 건들. 대체로 단건, 입찰공고만 2건(정정 재공고) 예시.
// 추후 API: 연관 건 조회 응답으로 교체(키/형식은 각 도메인 목록과 동일하게 유지).
const MOCK_ANL_ITEMS: Record<string, AnlPrgrsItem[]> = {
  조달계획: [
    {
      id: 'anl-op-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '조달계획번호', value: '2025LDG56349' },
        { label: '조달요구접수일자', value: '2025-10-02' },
      ],
    },
  ],
  사전규격: [
    {
      id: 'anl-spec-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '규격공개번호', value: '2025LDG56349-S1' },
        { label: '공개마감일시', value: '2025-11-14 17:00' },
      ],
    },
  ],
  입찰공고: [
    {
      id: 'anl-bd-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '공고번호', value: 'LDG0097-1' },
        { label: '입찰참가등록마감일시', value: '2025-12-23 17:00' },
        { label: '입찰서제출마감일시', value: '2025-12-24 10:00' },
      ],
    },
    {
      id: 'anl-bd-2',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기(재공고)',
      rows: [
        { label: '공고번호', value: 'LDG0097-2' },
        { label: '입찰참가등록마감일시', value: '2026-01-13 17:00' },
        { label: '입찰서제출마감일시', value: '2026-01-14 10:00' },
      ],
    },
  ],
  입찰진행: [
    {
      id: 'anl-prgrs-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '공고번호', value: 'LDG0097-2' },
        { label: '개찰일시', value: '2026-01-15 11:00' },
      ],
    },
  ],
  개찰: [
    {
      id: 'anl-opbid-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '공고번호', value: 'LDG0097-2' },
        { label: '개찰일시', value: '2026-01-15 11:00' },
        { label: '개찰결과', value: '낙찰' },
      ],
    },
  ],
  전자계약: [
    {
      id: 'anl-ct-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '계약번호', value: '2026-CT-00412' },
        { label: '계약체결일자', value: '2026-02-02' },
      ],
    },
  ],
  '검사 및 납품조서': [
    {
      id: 'anl-ex-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '계약번호', value: '2026-CT-00412' },
        { label: '납품기한', value: '2026-06-30' },
      ],
    },
  ],
  대금청구: [
    {
      id: 'anl-wm-1',
      taskSeNm: '물품',
      rfrncNo: '2025LDG56349',
      bizNm: '특수작전용대물타격무인항공기',
      rows: [
        { label: '계약번호', value: '2026-CT-00412' },
        { label: '청구상태', value: '미청구' },
      ],
    },
  ],
}

export function AnlPrgrsListPage() {
  const navigate = useNavigate()
  // 진입 state — 클릭한 세부단계(substep) + 기준 건의 실제 진행단계(prgrsStg) + 통합참조번호.
  // 직접 URL 진입이면 fallback. prgrsStg 는 세부단계 전환과 무관하게 고정(기준 건의 진행 상태).
  const passed = useLocation().state as {
    substep?: string
    prgrsStg?: string
    rfrncNo?: string
  } | null
  const [substep, setSubstep] = useState(passed?.substep ?? '입찰공고')
  const prgrsStg = passed?.prgrsStg ?? '입찰'

  // 진행단계(prgrsStg)를 넘는 세부단계는 연관 건이 있을 수 없음 — 목데이터도 진행 범위 안에서만 노출.
  // (시트에서 미진행 단계는 클릭 자체가 막혀 있지만, 직접 URL 진입 등 방어용 가드)
  const progressed =
    STEP_LABELS.indexOf(stageOfSubstep(substep) as (typeof STEP_LABELS)[number]) <=
    STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  const items = progressed ? (MOCK_ANL_ITEMS[substep] ?? []) : []

  // 카드 클릭 → 세부단계별 상세 라우팅(기존 상세 화면 재사용). URL 에 식별자를 두지 않으므로 항목을 state 로 넘긴다.
  // ⚠️ 연관 건 아이템(AnlPrgrsItem)은 각 도메인 상세가 기대하는 아이템 타입이 아니라 상단 요약 일부가 빈다.
  //    추후 API 연동 시 연관 건 조회 응답(도메인 아이템)을 state 로 전달해 상세 상단을 그 값으로 그린다.
  const goDetail = (it: AnlPrgrsItem) => {
    console.log('[AnlPrgrsList] 연관 건 상세 이동', substep, it.id)
    switch (substep) {
      case '조달계획':
        navigate('/op/prcmPlanDtl', { state: it })
        break
      case '사전규격':
        navigate('/op/bfhdSpcfctDtl', { state: it })
        break
      case '입찰공고':
        navigate('/bd/bidPbancDtl', { state: it })
        break
      case '입찰진행':
        navigate('/bd/bidPrgsDtlInq', { state: it })
        break
      case '개찰':
        navigate('/bd/bidRsltDtl', { state: it })
        break
      default:
        // 전자계약/검사 및 납품조서/대금청구 — 상세 화면 미구현. 추후 ct/ex/wm 상세 연결.
        console.log('[AnlPrgrsList] 상세 미구현 단계', substep)
    }
  }

  const cardItems: CardListItem[] = items.map((it) => ({
    id: it.id,
    badges: (
      <>
        <Badge>{it.taskSeNm}</Badge>
        <Badge type="pastel" color="blue">{substep}</Badge>
      </>
    ),
    subtitle: `통합참조번호 ${it.rfrncNo}`,
    title: it.bizNm,
    rows: it.rows,
    onClick: () => goDetail(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 상단 스텝바 — 보고 있는 단계 doing(빨강) + 진행된 단계 done(체크, prgrsStg 이하).
          시트(▾)에서 세부단계 클릭 시 즉시 닫히며 목록 전환 */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar
          orientation="horizontal"
          items={stepsFor(stageOfSubstep(substep), prgrsStg)}
          sheetItems={buildAnlProgressSheet(substep, prgrsStg, (next) => setSubstep(next))}
          className="bg-transparent"
        />
      </div>

      {/* 총건수 — "{세부단계} 총 N건" */}
      <SectionTitle as="h2" topDivider info={`총 ${items.length}건`}>
        {substep}
      </SectionTitle>

      {/* 연관 건 카드 리스트 — 카드 클릭 시 해당 단계 상세로 이동 */}
      <div className="flex flex-col gap-krds-7 px-4 pb-6 pt-krds-7">
        <CardList items={cardItems} emptyText="연관된 건이 없습니다." />
      </div>
    </div>
  )
}
AnlPrgrsListPage.displayName = 'AnlPrgrsListPage'
