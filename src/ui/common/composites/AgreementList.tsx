// 동의 목록 카드 — Figma m_agreemen(9300-40702) 1:1.
// 테두리 카드(radius 12 · padding 16 · gap 16) 안에 전체 동의 → 구분선 → 항목 리스트.
// 각 항목 행: 사각 체크박스(box) + [필수]/[선택] 색상 텍스트 + 제목 + ArrowForwardIos(행 클릭=상세 열기).
//   - [필수] = #ff265e(action-danger) · [선택] = #0f316e(action-primary-active) · 제목 = #1d1d1d(text-ink)
// 서약서 동의(WrotAgrePage)·약관 동의(BidPrtcpAperWrtPage_Stp7) 등 동의 체크리스트 화면 공용.
//   콘텐츠(서약서/동의서 본문)는 각 페이지가 바텀시트로 소유 — 이 컴포넌트는 목록만 담당, onView(id) 로 위임.
import { Checkbox } from '@/ui/common/base/Checkbox'
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'

export interface AgreementListItem {
  /** 안정적 고유 식별자(화면 P번호 등). */
  id: string
  /** 항목 제목. */
  title: string
  /** [필수]/[선택] 색상 태그. 생략 시 태그 없이 제목만. */
  requirement?: 'required' | 'optional'
}

export interface AgreementListProps {
  items: AgreementListItem[]
  /** 동의 완료된 항목 id 목록(부모 소유). */
  checked: string[]
  /** 개별 항목 체크 토글. */
  onToggle: (id: string, checked: boolean) => void
  /** 항목 행(체크박스 제외) 클릭 → 상세/동의서 열기. */
  onView: (id: string) => void
  /** 전체 동의 토글. checkAll 일 때만 필요. */
  onCheckAll?: (checked: boolean) => void
  /** 상단 '전체 동의' 행 노출(기본 true). */
  checkAll?: boolean
  className?: string
}

export function AgreementList({
  items,
  checked,
  onToggle,
  onView,
  onCheckAll,
  checkAll = true,
  className,
}: AgreementListProps) {
  // 전체 동의 상태 — 모두 체크=true / 일부=indeterminate / 없음=false.
  const allChecked = items.length > 0 && items.every((it) => checked.includes(it.id))
  const someChecked = items.some((it) => checked.includes(it.id))
  const allState: boolean | 'indeterminate' = allChecked
    ? true
    : someChecked
      ? 'indeterminate'
      : false

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-krds-xl border border-krds-border-divider bg-background p-4',
        className,
      )}
    >
      {checkAll && (
        <>
          <Checkbox
            variant="box"
            label="전체 동의"
            checked={allState}
            onCheckedChange={(c) => onCheckAll?.(c === true)}
            className="font-bold"
          />
          {/* 구분선 — Figma m_section divider(#d1d7e0) */}
          <div className="h-px w-full bg-krds-border-divider" />
        </>
      )}

      {/* 항목 리스트 — gap 16, 행 상단 정렬(긴 제목 2줄 대응) */}
      <div className="flex flex-col gap-4">
        {items.map((it) => (
          <div key={it.id} className="flex items-start gap-2">
            <Checkbox
              variant="box"
              aria-label={`${it.title} 동의`}
              checked={checked.includes(it.id)}
              onCheckedChange={(c) => onToggle(it.id, c === true)}
              className="shrink-0"
            />
            <button
              type="button"
              onClick={() => onView(it.id)}
              aria-label={`${it.title} 보기`}
              className="flex min-w-0 flex-1 items-center gap-4 text-left"
            >
              <span className="min-w-0 flex-1 text-krds-body-md leading-normal text-krds-text-ink">
                {it.requirement && (
                  <span
                    className={
                      it.requirement === 'required'
                        ? 'text-krds-action-danger'
                        : 'text-krds-action-primary-active'
                    }
                  >
                    {it.requirement === 'required' ? '[필수] ' : '[선택] '}
                  </span>
                )}
                {it.title}
              </span>
              <Icon
                name="ArrowForwardIos"
                size={20}
                className="shrink-0 text-krds-text-ink"
                aria-hidden
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
AgreementList.displayName = 'AgreementList'
