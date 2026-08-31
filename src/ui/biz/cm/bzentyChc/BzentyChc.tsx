// MUI-MS-01-P14 업체 설정(로그인 업체 선택) — BzentyChc (Figma 10020:87467)
// 소속 업체가 여럿인 사용자가 로그인 이후 사용할 업체를 선택하는 바텀시트의 "콘텐츠"만 담당한다.
// 설계서 동작: "선택하신 업체 정보로 국방전자조달시스템을 사용합니다. 업체를 변경하려면 재로그인이 필요합니다."
//   업체 목록(라디오 카드: 업체명 + 사업자등록번호) 중 하나 선택 → [선택 로그인].
//
// ★ 컨테이너(BottomSheet)·footer 는 부모가 소유한다 (`*Sheet` 래퍼 금지 규칙).
//   이 파일은 시트 본문 콘텐츠(안내문 + 라디오 카드 목록)만 렌더하는 controlled 컴포넌트다.
//   선택 상태(value)와 footer 버튼(로그아웃 / 선택 로그인)은 부모가 소유한다 —
//   footer 의 [선택 로그인] 이 선택된 업체코드를 필요로 하므로 상태를 부모가 들고 있어야 하기 때문.
//
//   부모(페이지) 조립 예시 — 적용: idPswdLogin/IdPswdLoginPage(로그인 응답 bzentyList 주입):
//   ┌───────────────────────────────────────────────────────────────────────────
//   │ <BottomSheet open={open} onOpenChange={setOpen} title="업체 설정" footer={...로그아웃/선택 로그인}>
//   │   <BzentyChc items={loginResult.bzentyList} value={bzentyCd} onValueChange={setBzentyCd} />
//   │ </BottomSheet>
//   └───────────────────────────────────────────────────────────────────────────
//
// 필드명은 코드베이스 확립 규약을 따름(설계서 항목명 기준):
//   업체코드=bzentyCd · 업체명=bzentyNm · 사업자등록번호=bizRegNo (src/types/bd.ts 선례).
import { RadioGroup, RadioGroupItem } from '@/ui/raw/radio-group'
import { cn } from '@/utils/cn'
import type { MockBzentyChcItem } from '@/types/mock/domain'

// 업체 목록 데이터는 로그인 응답(LoginResult.bzentyList, @/types/domain MockBzentyChcItem)으로 주입된다.
// (구 페이지 내 MOCK_BZENTY_LIST 는 mocks/auth.ts 로 이관 — 목업 로그인 응답이 공급)
export interface BzentyChcProps {
  /** 선택 대상 업체 목록 — 로그인 응답 bzentyList. */
  items: MockBzentyChcItem[]
  /** 선택된 업체코드 (controlled) */
  value: string
  /** 선택 변경 콜백 */
  onValueChange: (bzentyCd: string) => void
  className?: string
}

/**
 * 업체 설정(P14) 바텀시트 콘텐츠 — 안내문 + 라디오 카드 목록.
 * 라디오 시맨틱은 raw/radio-group(RadioGroup Root) 컨텍스트로 처리하고,
 * 카드(label) 시각은 raw 의 data-state 를 group-has-* 로 따라간다(RadioButton 파일럿 패턴 동일).
 */
export function BzentyChc({ items, value, onValueChange, className }: BzentyChcProps) {
  return (
    <div className={cn('flex flex-col gap-krds-8', className)}>
      {/* 안내문 — 설계서 문구 그대로 */}
      <p className="text-krds-body-md leading-normal text-krds-text-ink">
        선택하신 업체 정보로 국방전자조달시스템을 사용합니다. 업체를 변경하려면 재로그인이 필요합니다.
      </p>

      {/* 업체 라디오 카드 목록 — key = 업체코드(안정 고유값) */}
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex flex-col gap-krds-7"
        aria-label="로그인 업체 선택"
      >
        {items.map((item) => (
          <label
            key={item.bzentyCd}
            className={cn(
              'group flex items-center gap-krds-7 rounded-krds-xl border p-krds-8 transition-colors',
              'border-krds-border-divider bg-background',
              // 선택됨 — raw 의 data-state=checked 를 따라감(테두리 primary + 옅은 파랑 배경)
              'has-data-[state=checked]:border-primary has-data-[state=checked]:bg-krds-bg-primary-subtle',
              // 키보드 포커스 — 내부 radio item 이 focus-visible 일 때 카드에 링
              'has-focus-visible:outline-hidden has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2',
            )}
          >
            {/* 실제 라디오 컨트롤 — 시각은 카드가 담당하므로 숨김(RadioButton 동일: size-px/border-0/opacity-0/clip). */}
            <RadioGroupItem
              value={item.bzentyCd}
              className="absolute size-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]"
            />
            {/* 라디오 원형(장식) — 카드(group)의 raw 상태를 group-has 로 따라감 */}
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                'border-krds-border-field',
                'group-has-data-[state=checked]:border-primary',
              )}
              aria-hidden
            >
              <span className="hidden size-3 rounded-full bg-primary group-has-data-[state=checked]:block" />
            </span>
            {/* 텍스트 — 업체명(굵게) + 사업자등록번호(보조) */}
            <span className="flex min-w-0 flex-1 flex-col gap-krds-3">
              <span className="text-krds-body-lg font-bold text-krds-text-ink">{item.bzentyNm}</span>
              <span className="text-krds-body-md text-krds-text-muted">{item.bizRegNo}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
BzentyChc.displayName = 'BzentyChc'
