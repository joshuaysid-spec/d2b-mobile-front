// 실적증명서 제출 — MUI-CM-04-P20 (PrfmncPrdocSbmsn). 설계서 00.공통 v0.84 slide335~336.
// 실적증명서 확인(M07) (+)시트 [실적증명서 제출]에서 여는 바텀시트의 **콘텐츠 전용** 컴포넌트.
//   컨테이너(BottomSheet)·footer·선택 상태는 부모(PrfmncPrdocDtlPage)가 소유한다
//   — CLAUDE.md "BottomSheet·AlertModal 은 전용 래퍼(*Sheet)를 만들지 않는다".
//
// Figma(5M6FlyQBdHgeNrgIG2XhIN) 10064-16185(선택 전)/16229(선택)/16278(다중)/16332(키패드).
// 카드(m_checkcard)는 공통 컴포넌트가 아닌 P20 전용 로컬 조립물 — get_metadata 실측 1:1:
//   카드 gap 16 · padding 16 · radius 8 · 체크박스 24 → 협회명 gap 8 → 뱃지 gap 8
//   card title(29) →12→ divider(1) →12→ 비고행(48)   [펼침 134 / 접힘 61]
//   헤딩(17 Bold, h26) →8→ 카드목록
// 타이포는 line-box 실측 + 글자폭 교차검증으로 확정(line-height 1.5 = KRDS body):
//   협회명 h29·6자 99px → 19(body-lg) · 헤딩 h26 → 17(body-md) · 비고 h26·2자 30px → 17(body-md).
// ⚠️ 좌측 패딩 없음 — BottomSheet 본문이 px-16 을 제공(2중 패딩 금지).
//    우측은 **스크롤이 생겼을 때만** pr-8 (스크롤바 거터, useHasScroll):
//    Figma contents+scroll 328 = 콘텐츠 312 + gap 8 + 스크롤바 8.
//    globals.css 가 스크롤바를 8px classic 으로 그려 이미 8px 를 차지하므로 추가분은 8px 이다
//    (312 + 8 pr + 8 바 = 328). 스크롤이 없으면 거터 없이 328 전폭을 쓴다.
import { useEffect, useRef, useState } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { InputBox } from '@/ui/common/base/InputBox'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { cn } from '@/utils/cn'
import type { MockSbmsnAsctnItem } from '@/types/mock/cm'

// 상태(sttsVl) → 뱃지 색. Figma 확인분: 송신완료(pastel blue) · 제출취소(pastel red).
// 전송중/실패는 Figma 미표기 → 의미상 근접색 매핑(design 문서 §7 미결 2).
const BADGE_COLOR: Record<string, 'blue' | 'red'> = {
  전송중: 'blue',
  송신완료: 'blue',
  실패: 'red',
  제출취소: 'red',
}

/** 가장 가까운 스크롤 조상(BottomSheet 본문 = overflow-y-auto)을 찾는다. */
function findScroller(from: HTMLElement | null): HTMLElement | null {
  let el = from?.parentElement ?? null
  while (el) {
    const overflowY = getComputedStyle(el).overflowY
    if (overflowY === 'auto' || overflowY === 'scroll') return el
    el = el.parentElement
  }
  return null
}

/**
 * 스크롤 발생 여부. 스크롤이 있을 때만 우측 거터를 주기 위한 감지.
 * 카드 펼침/접힘으로 본문 높이가 바뀌므로 ResizeObserver 로 콘텐츠·스크롤러 양쪽을 관찰한다.
 * 거터는 스크롤이 "있을 때만" 붙으므로 폭↔높이 되먹임으로 인한 진동이 생기지 않는다
 * (거터 없이 들어가면 그대로 유지, 거터를 달면 더 좁아져 스크롤이 유지됨).
 */
function useHasScroll(ref: React.RefObject<HTMLElement | null>) {
  const [hasScroll, setHasScroll] = useState(false)

  useEffect(() => {
    const el = ref.current
    const scroller = findScroller(el)
    if (!el || !scroller) return

    const measure = () => setHasScroll(scroller.scrollHeight > scroller.clientHeight)
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(scroller)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  return hasScroll
}

export interface PrfmncPrdocSbmsnProps {
  /** 제출 협회 목록(dl_sbmsnAsctnList). */
  items: MockSbmsnAsctnItem[]
  /** 선택된 제출협회명(sbmsnSttsNm) 목록 — 멀티 선택(slide336 이벤트 설명). */
  selected: string[]
  onToggle: (sbmsnSttsNm: string, checked: boolean) => void
  /** 비고(rmrkCn) 입력 — 제출취소 사유. */
  onRmrkChange: (sbmsnSttsNm: string, rmrkCn: string) => void
}

export function PrfmncPrdocSbmsn({
  items,
  selected,
  onToggle,
  onRmrkChange,
}: PrfmncPrdocSbmsnProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const hasScroll = useHasScroll(rootRef)

  return (
    // 스크롤이 생길 때만 우측 거터 8px — 없을 때는 전폭(원래 여백) 유지.
    <div ref={rootRef} className={cn('flex flex-col gap-krds-5', hasScroll && 'pr-krds-5')}>
      <h3 className="text-krds-body-md font-bold text-krds-text-ink">온라인 제출 가능 협회 목록</h3>

      <div className="flex flex-col gap-krds-8">
        {items.map((it) => {
          const isSelected = selected.includes(it.sbmsnSttsNm)
          // 비고는 상태(sttsVl) 유무와 무관하게 **선택된 카드면 모두** 노출(2026-07-29 요청).
          const showRmrk = isSelected

          return (
            <div
              key={it.sbmsnSttsNm}
              className={cn(
                'flex flex-col gap-krds-7 rounded-krds-8 bg-background p-krds-8 transition-colors',
                // 기본 1px 보더 → 선택 시 색 변경 + inset 1px 로 시각 2px(레이아웃 시프트 없음, Checkbox 칩과 동일 기법)
                'border border-krds-border-field',
                // 선택 배경은 blue-faint(#ecf1fa) — subtle(#bcd4ff)은 Figma 대비 과하게 진하다.
                isSelected &&
                  'border-krds-border-primary bg-krds-bg-primary-faint shadow-[inset_0_0_0_1px_var(--krds-border-primary)]',
              )}
            >
              {/* card title — [체크박스 24 →8→ 협회명] →8→ 상태 뱃지(미제출이면 미표시, slide335).
                  뱃지는 라벨 밖에 둔다 — 상태 표시일 뿐이라 클릭 시 선택 토글 대상이 아니다. */}
              <div className="flex items-center gap-krds-5">
                <Checkbox
                  variant="box"
                  className="items-center gap-krds-5"
                  checked={isSelected}
                  onCheckedChange={(c) => onToggle(it.sbmsnSttsNm, c === true)}
                  label={
                    <span className="text-krds-body-lg font-bold text-krds-text-ink">
                      {it.sbmsnSttsNm}
                    </span>
                  }
                />
                {it.sttsVl && (
                  <Badge type="pastel" color={BADGE_COLOR[it.sttsVl] ?? 'blue'}>
                    {it.sttsVl}
                  </Badge>
                )}
              </div>

              {showRmrk && (
                <>
                  <SectionDivider />
                  {/* 비고(rmrkCn) — 클릭 시 가상 키패드 활성(slide335). 라벨 30px + gap 8 + 입력 flex */}
                  <div className="flex items-center gap-krds-5">
                    <span className="shrink-0 text-krds-body-md text-krds-text-muted">비고</span>
                    <InputBox
                      className="flex-1"
                      placeholder="입력해주세요."
                      aria-label={`${it.sbmsnSttsNm} 비고`}
                      value={it.rmrkCn ?? ''}
                      onChange={(e) => onRmrkChange(it.sbmsnSttsNm, e.target.value)}
                      onClear={() => onRmrkChange(it.sbmsnSttsNm, '')}
                    />
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
PrfmncPrdocSbmsn.displayName = 'PrfmncPrdocSbmsn'
