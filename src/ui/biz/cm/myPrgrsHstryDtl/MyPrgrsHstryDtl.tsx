// MUI-CM-06-P03 세부 스텝 팝업 (MyPrgrsHstryDtl). 설계서 00.공통 v0.84 slide79. **디자인 없음 → 기존 StepBar 재사용.**
// 진행중인 공고의 "진행 단계"를 표시하는 조회 전용 팝업 콘텐츠.
// (2026-08-25 사용자 확정 — 구 단계 선택 + '이동할 진행 단계를 선택하세요.' 안내 + footer [닫기][바로가기] 제거.)
//
// ⚠️ BottomSheet 컨테이너는 **부모(M02 MyPrgrsHstryPage)가 소유**한다(CLAUDE.md 규칙:
//    BottomSheet 는 전용 *Sheet 래퍼 금지, 콘텐츠만 분리). 이 파일은 StepBar 를 감싼 콘텐츠 컴포넌트다.
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'

interface MyPrgrsHstryDtlProps {
  /** 진행 단계 항목 — 부모가 currentStage 기준 done/doing/todo 로 구성해 넘긴다. */
  items: StepItem[]
}

export function MyPrgrsHstryDtl({ items }: MyPrgrsHstryDtlProps) {
  return (
    <div className="flex flex-col gap-krds-7">
      {/* 진행 단계 — 세로 StepBar(연속 rail). 조회 전용. */}
      <StepBar orientation="vertical" items={items} />
    </div>
  )
}
MyPrgrsHstryDtl.displayName = 'MyPrgrsHstryDtl'
