// MUI-CM-02-P08 사용자 상태 변경 — 업체소속사용자목록(M07)이 소유하는 BottomSheet 콘텐츠.
// CLAUDE.md BottomSheet 패턴: 컨테이너(BottomSheet)·footer·open 상태는 부모(M07 페이지)가 소유하고,
//   여기는 "콘텐츠"(대상 사용자 현재 상태 표시 + 상태 선택 RadioButtonGroup)만 담는다. (*Sheet 래퍼 금지)
//
// 상태 코드(설계서 P08): 사용=Y · 탈퇴=T · 사용중지=N · 미승인=M.
//   v0.87(08-28): 수정 가능한 상태는 사용/탈퇴/사용중지 — 미승인(M)은 변경 불가라 선택지에서 제외
//   (2026-08-05 '대표자 미승인' 라디오 추가는 v0.87 개정으로 재폐기).
//   탈퇴 상태 대상은 재변경 불가(PC 버전에서만 처리) — locked 시 안내 메시지 + 라디오 잠금.
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'

// 상태 선택지 — 설계서 v0.87 P08: 사용/탈퇴/사용중지만(미승인 변경 불가).
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
  /**
   * 탈퇴 상태 대상 잠금(v0.87 slide214) — 재변경 불가 안내를 표시하고 라디오를 비활성화한다.
   * (저장 버튼 숨김은 footer 소유자인 부모 페이지가 처리)
   */
  locked?: boolean
}

export function PrcmBzentyUserSttsChg({
  userNm,
  currentSttsNm,
  value,
  onValueChange,
  locked = false,
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

      {/* 탈퇴 대상 전용 안내(v0.87 slide214 — 상태가 탈퇴인 대상에게만 표시) */}
      {locked && (
        <p className="rounded-krds-8 bg-krds-bg-primary-faint p-krds-7 text-[17px] leading-normal text-krds-text-ink">
          퇴사자 원복은 PC 버전에서 확인하고, 신청이 가능합니다.
        </p>
      )}

      {/* 변경할 상태 선택 — 탈퇴 대상은 재변경 불가라 전체 비활성. */}
      <div className="flex flex-col gap-krds-5">
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
          변경할 상태
        </span>
        <RadioButtonGroup
          direction="vertical"
          showIndicator
          items={STTS_OPTIONS.map((o) => ({ ...o, disabled: locked }))}
          value={value}
          onValueChange={onValueChange}
        />
      </div>
    </div>
  )
}
PrcmBzentyUserSttsChg.displayName = 'PrcmBzentyUserSttsChg'
