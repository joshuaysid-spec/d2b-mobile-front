// 입찰서(견적서) 작성 - 복수예비가격 (MUI-BD-06-M04, Figma 9973-63541 · 설계서 02입찰 slide124·129)
// 컨테이너(TndrWrtPage)가 요약/탭/하단버튼/FAB 를 소유 — 이 컴포넌트는 스텝4 '복수예비가격' 탭 본문만 렌더한다.
// 구성(Figma M04): 안내사항(Infobox) → 1회/2회 아코디언(선택값 표시) + 1~15번 3열 그리드. 탭명과 중복되는 큰 타이틀은 제거(260709).
// 항목명은 데이터영역(slide129 dmt_rsrbPrcChc) 그대로: 1회=rsrvPrcChcNo1 · 2회=rsrvPrcChcNo2 (2개 추첨번호 선택).
// 동작(slide124): 1회 기본 열림 → 번호 선택 시 헤더에 값 표시+해당 아코디언 닫힘 → 2회 미선택이면 2회 자동 열림.
import { useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Infobox } from '@/ui/common/composites/Infobox'
import { cn } from '@/utils/cn'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 추첨 대상 번호 1~15 (설계서 slide124 — 사용자 선택 버튼 15개).
const PICK_NUMBERS = Array.from({ length: 15 }, (_, i) => String(i + 1))

// 회차 = 데이터영역 항목명(1회/2회). field 를 아코디언 식별자 겸 상태 키로 사용(TndrWrt_Stp6 과 동일 패턴).
const ROUNDS = [
  { field: 'rsrvPrcChcNo1', label: '1회' },
  { field: 'rsrvPrcChcNo2', label: '2회' },
] as const

/** 번호 선택 버튼 — 미선택=secondary(테두리) · 선택=배경 강조(bg-primary-faint). 새 variant 대신 도메인 내 className 오버라이드. */
function PickButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'w-full min-w-0',
        selected && 'bg-krds-bg-primary-faint font-bold text-krds-text-primary-active',
      )}
    >
      {children}
    </Button>
  )
}

export function TndrWrt_Stp4({ detail }: { detail: MockBidPrgrsItem }) {
  void detail // 상단 요약은 컨테이너 소유 — 본 탭은 복수예비가격 선택만 담당.

  // 복수예비가격 선택값(설계서 slide129 dmt_rsrbPrcChc) — 미선택 = ''.
  const [choices, setChoices] = useState<Record<string, string>>({
    rsrvPrcChcNo1: '',
    rsrvPrcChcNo2: '',
  })
  // 열린 아코디언(단일) — 1회 기본 열림.
  const [openRound, setOpenRound] = useState<string>(ROUNDS[0].field)

  // 선택 시 해당 회차 닫힘 → 미선택인 다른 회차가 있으면 자동 열림(slide124: 1회 선택 후 2회 미선택이면 2회 열림).
  const selectRound = (field: string, no: string) => {
    const next = { ...choices, [field]: no }
    setChoices(next)
    console.log('[TndrWrt] 복수예비가격 선택', field, no)
    // 추후 API: bdService.insertTndrSbmsn({ [field]: no })
    const unpicked = ROUNDS.find((r) => !next[r.field])
    setOpenRound(unpicked ? unpicked.field : '')
  }

  return (
    <>
      {/* 안내사항 — 복수예비가격 2개 추첨 안내(Figma M04) */}
      <Infobox
        title="안내사항"
        defaultOpen
        items={['예정가격 결정을 위한 복수예비가격 2개를 추첨합니다.']}
      />

      {/* 1회/2회 아코디언 — 단일 열림 제어. 헤더 우측에 선택 번호(없으면 '-') 표시. */}
      <Accordion type="single" collapsible value={openRound} onValueChange={setOpenRound}>
        {ROUNDS.map(({ field, label }) => (
          <AccordionSection
            key={field}
            value={field}
            title={label}
            titleInfo={choices[field] ? `${choices[field]}번` : '-'}
          >
            <div className="grid grid-cols-3 gap-krds-4">
              {PICK_NUMBERS.map((no) => (
                <PickButton
                  key={no}
                  selected={choices[field] === no}
                  onClick={() => selectRound(field, no)}
                >
                  {no}번
                </PickButton>
              ))}
            </div>
          </AccordionSection>
        ))}
      </Accordion>
    </>
  )
}
TndrWrt_Stp4.displayName = 'TndrWrt_Stp4'
