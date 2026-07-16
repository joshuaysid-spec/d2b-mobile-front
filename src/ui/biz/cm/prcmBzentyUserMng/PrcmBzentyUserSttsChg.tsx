// MUI-CM-02-P08 사용자 상태 변경 — 업체소속사용자목록(M07)이 소유하는 BottomSheet 콘텐츠.
// CLAUDE.md BottomSheet 패턴: 컨테이너(BottomSheet)·footer·open 상태는 부모(M07 페이지)가 소유하고,
//   여기는 "콘텐츠"(대상 사용자 현재 상태 표시 + 상태 선택 RadioButtonGroup)만 담는다. (*Sheet 래퍼 금지)
//
// 상태 코드(설계서 P08): 사용=Y · 탈퇴=T · 사용중지=N · 미승인=M.
//   미승인(M)은 변경 불가라 선택지에서 제외(수정 가능 = 사용/탈퇴/사용중지 3개만).
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'

// 변경 가능한 상태 선택지(미승인 M 제외) — 설계서 P08.
const STTS_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'T', label: '탈퇴' },
  { value: 'N', label: '사용중지' },
]

export interface PrcmBzentyUserSttsChgProps {
  /** 대상 사용자명(예: 홍길동). */
  userNm: string
  /** 대상 사용자의 현재 상태명(사용/탈퇴/사용중지/미승인). */
  currentSttsNm: string
  /** 선택된 상태 코드(Y/T/N) — 부모가 소유(controlled). */
  value: string
  onValueChange: (value: string) => void
}

export function PrcmBzentyUserSttsChg({
  userNm,
  currentSttsNm,
  value,
  onValueChange,
}: PrcmBzentyUserSttsChgProps) {
  return (
    <div className="flex flex-col gap-krds-8 py-krds-5">
      {/* 대상 사용자 + 현재 상태 */}
      <div className="flex flex-col gap-krds-2">
        <span className="text-[17px] leading-normal text-krds-text-muted">
          {userNm} 님의 현재 상태
        </span>
        <span className="text-[19px] font-bold leading-normal text-krds-text-ink">
          {currentSttsNm}
        </span>
      </div>

      {/* 변경할 상태 선택(미승인 제외) */}
      <div className="flex flex-col gap-krds-5">
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
          변경할 상태
        </span>
        <RadioButtonGroup
          direction="vertical"
          showIndicator
          items={STTS_OPTIONS}
          value={value}
          onValueChange={onValueChange}
        />
      </div>
    </div>
  )
}
PrcmBzentyUserSttsChg.displayName = 'PrcmBzentyUserSttsChg'
