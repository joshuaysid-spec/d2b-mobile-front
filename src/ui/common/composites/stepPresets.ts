// 진행현황 팝업(가로 StepBar 우측 ▾ → 바텀시트)용 1·2depth 혼합 목록 생성기.
// StepBar 가이드의 "orientation='vertical' (혼합 depth — 진행현황 예시)" 규격을 페이지 단계에 맞춰 생성한다.
// 생애주기 5단계(조달→입찰→계약→이행→대금사후) 상세화면 공통 — 신청 마법사(서약서/신청서/서명/제출) 스텝바에는 쓰지 않는다.
import type { StepItem } from '@/ui/common/composites/StepBar'

// 대단계 순서 — 페이지의 STEP_LABELS(조달/입찰/계약/이행/대금청구)와 인덱스 정렬.
const STAGE_ORDER = ['조달', '입찰', '계약', '이행', '대금청구'] as const

// 생애주기 1·2depth 구조 (StepBar 진행현황 예시) — 1depth 대단계 + 2depth 세부단계.
const LIFECYCLE: { label: string; children: string[] }[] = [
  { label: '조달계획', children: ['조달계획', '사전규격'] },
  { label: '입찰', children: ['입찰공고', '입찰진행', '개찰'] },
  { label: '계약', children: ['전자계약'] },
  { label: '이행', children: ['검사 및 납품조서'] },
  { label: '대금사후', children: ['대금청구'] },
]

/**
 * 현재 대단계 기준 진행현황(1·2depth 혼합) StepItem 목록 생성.
 * @param currentStage 페이지가 stepsByStg 에 넘기는 값과 동일 (조달/입찰/계약/이행/대금청구). 매칭 안되면 전부 todo.
 * 규칙: 이전 단계 done · 현재 단계 doing(자식은 마지막만 doing, 나머지 done) · 이후 단계 todo.
 */
export function buildProgressSheet(currentStage: string): StepItem[] {
  const cur = STAGE_ORDER.indexOf(currentStage as (typeof STAGE_ORDER)[number])
  const out: StepItem[] = []
  LIFECYCLE.forEach((stage, i) => {
    const phase: 'done' | 'doing' | 'todo' =
      cur < 0 || i > cur ? 'todo' : i < cur ? 'done' : 'doing'
    out.push({ label: stage.label, state: phase, depth: 1 })
    stage.children.forEach((c, j) => {
      const s: StepItem['state'] =
        phase === 'done'
          ? 'done'
          : phase === 'todo'
            ? 'todo'
            : j === stage.children.length - 1
              ? 'doing' // 현재 단계: 마지막 세부단계 진행 중
              : 'done'
      out.push({ label: c, state: s, depth: 2 })
    })
  })
  return out
}
