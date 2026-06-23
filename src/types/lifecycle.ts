// 조달 생애주기 단계(단계표시기/StepBar) — 상세 화면 상단 진행단계 공통 모델.
// Design Ref: 설계서 단계표시기(조달→입찰→계약→이행→대금청구). 코드값은 백엔드 도메인 코드와 1:1
// (CLAUDE.md biz 도메인 폴더 코드: op 조달 · bd 입찰 · ct 계약 · ex 이행 · wm 대금청구/사후).
// 상세 페이지는 현재 단계 코드(LifecycleStage)만 받아서 buildLifecycleSteps 로 StepItem[] 을 만든다.
// (API 미연동 — 현재는 페이지에서 목업 단계값 주입. 추후 상세 응답의 단계 코드로 대체.)
import type { StepItem } from '@/ui/common/composites/StepBar'

/** 생애주기 단계 코드 — 백엔드 도메인 코드와 동일(op/bd/ct/ex/wm). */
export type LifecycleStage = 'op' | 'bd' | 'ct' | 'ex' | 'wm'

/** 단계 순서 + 표시 라벨 (설계서 단계표시기). */
export const LIFECYCLE_STEPS: { stage: LifecycleStage; label: string }[] = [
  { stage: 'op', label: '조달' },
  { stage: 'bd', label: '입찰' },
  { stage: 'ct', label: '계약' },
  { stage: 'ex', label: '이행' },
  { stage: 'wm', label: '대금청구' },
]

/**
 * 현재 단계 코드를 받아 StepBar 용 StepItem[] 생성.
 * 현재 단계 이전 = 'done', 현재 단계 = 'doing', 이후 = 'todo'.
 * 알 수 없는 코드면 전부 'todo'(진행 전)로 안전 처리.
 */
export function buildLifecycleSteps(current: LifecycleStage): StepItem[] {
  const idx = LIFECYCLE_STEPS.findIndex((s) => s.stage === current)
  return LIFECYCLE_STEPS.map((s, i) => ({
    label: s.label,
    state: idx < 0 ? 'todo' : i < idx ? 'done' : i === idx ? 'doing' : 'todo',
  }))
}
