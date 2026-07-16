// MUI-CM-06-P03 세부 스텝 팝업 (MyPrgrsHstryDtl). 설계서 00.공통 v0.84 slide79. **디자인 없음 → 기존 StepBar 재사용.**
// 진행중인 공고의 "진행 단계"를 표시하는 팝업 콘텐츠. 각 단계 클릭 시 선택이 유지되고(부모가 selected 관리),
// 하단 [바로가기] 버튼으로 선택 단계에 해당하는 목록으로 이동한다(설계서 slide79).
//
// ⚠️ BottomSheet 컨테이너 + footer([바로가기][닫기])는 **부모(M02 MyPrgrsHstryPage)가 소유**한다(CLAUDE.md 규칙:
//    BottomSheet 는 전용 *Sheet 래퍼 금지, 콘텐츠만 분리). 이 파일은 StepBar 를 감싼 콘텐츠 컴포넌트다.
import type { ReactNode } from 'react'

import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'

interface MyPrgrsHstryDtlProps {
  /** 진행 단계 항목 — 부모가 onClick(선택) 을 배선해 넘긴다. */
  items: StepItem[]
  /** 현재 선택된 단계 라벨(표시용). 미선택이면 안내. */
  selectedLabel?: ReactNode
}

export function MyPrgrsHstryDtl({ items, selectedLabel }: MyPrgrsHstryDtlProps) {
  return (
    <div className="flex flex-col gap-krds-7">
      {/* 진행 단계 — 세로 StepBar(연속 rail). 각 단계 클릭 → 부모가 선택 유지. */}
      <StepBar orientation="vertical" items={items} />

      {/* 선택 안내 — '바로가기'가 이동할 단계. (설계서: 각 단계 클릭 시 선택 유지) */}
      <p className="text-krds-body-md leading-normal text-krds-text-muted">
        {selectedLabel != null ? (
          <>
            선택한 단계: <span className="font-bold text-krds-text-ink">{selectedLabel}</span>
          </>
        ) : (
          '이동할 진행 단계를 선택하세요.'
        )}
      </p>
    </div>
  )
}
MyPrgrsHstryDtl.displayName = 'MyPrgrsHstryDtl'
