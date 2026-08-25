// 입찰서(견적서) 작성 - 동가낙찰 선추첨 (MUI-BD-06-M06, Figma 9973-63684 · 설계서 02입찰 slide126·130)
// 컨테이너(TndrWrtPage)가 요약/탭/하단버튼/FAB 를 소유 — 이 컴포넌트는 스텝6 '동가낙찰 선추첨' 탭 본문만 렌더한다.
// 구성(Figma M06): 안내사항(Infobox) → 1차~5차 아코디언(선택값 표시) + [가위][바위][보] 3열. 탭명과 중복되는 큰 타이틀은 제거(260709).
// 항목명은 데이터영역(slide130 dmt_smprcScsbdChc) 그대로: 1차~5차 = smprcScsbdChcCd1~smprcScsbdChcCd5. 기본값 미선택('-').
// 조건부 노출(계약방법 F/J/P·공고일자 20210415 이전 등, slide126) 은 컨테이너(TndrWrtPage)가 탭 자체를 분기 → 여기선 다루지 않음.
import { useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Infobox } from '@/ui/common/composites/Infobox'
import { cn } from '@/utils/cn'
import type { BidPrgrsItem } from '@/types/mock/bd'

// 차수 = 데이터영역 항목명(1차~5차). field 를 아코디언 식별자 겸 상태 키로 사용.
const ROUNDS = [
  { field: 'smprcScsbdChcCd1', label: '1차' },
  { field: 'smprcScsbdChcCd2', label: '2차' },
  { field: 'smprcScsbdChcCd3', label: '3차' },
  { field: 'smprcScsbdChcCd4', label: '4차' },
  { field: 'smprcScsbdChcCd5', label: '5차' },
] as const

// 선택 항목 — 가위/바위/보. 값은 표시 라벨로 저장(smprcScsbdChcCd 자리수 1 의 실제 코드값은 상세설계 예정).
const CHOICES = ['가위', '바위', '보'] as const

/** 선택 버튼 — 미선택=secondary(테두리) · 선택=배경 강조(bg-primary-faint). 새 variant 대신 도메인 내 className 오버라이드. */
function ChoiceButton({
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

export function TndrWrt_Stp6({ detail }: { detail: BidPrgrsItem }) {
  void detail // 상단 요약은 컨테이너 소유 — 본 탭은 동가낙찰 선추첨 선택만 담당.

  // 1차~5차 선추첨 선택값(설계서 slide130 dmt_smprcScsbdChc) — 미선택 = ''.
  const [choices, setChoices] = useState<Record<string, string>>({
    smprcScsbdChcCd1: '',
    smprcScsbdChcCd2: '',
    smprcScsbdChcCd3: '',
    smprcScsbdChcCd4: '',
    smprcScsbdChcCd5: '',
  })

  const selectChoice = (field: string, value: string) => {
    setChoices((prev) => ({ ...prev, [field]: value }))
    console.log('[TndrWrt] 동가낙찰 선추첨 선택', field, value)
    // 추후 API: bdService.insertTndrSbmsn({ [field]: value })
  }

  return (
    <>
      {/* 안내사항 — 동가입찰 시 낙찰자 결정을 위한 5차 선택 안내(Figma M06) */}
      <Infobox
        title="안내사항"
        defaultOpen
        items={['동가입찰시 낙찰자 결정을 위해 [가위, 바위, 보]를 5차까지 선택합니다.']}
      />

      {/* 1차~5차 아코디언 — 다중 열림(기본 전체 열림). 헤더 우측에 선택값(없으면 '-') 표시. */}
      <Accordion type="multiple" defaultValue={ROUNDS.map((r) => r.field)}>
        {ROUNDS.map(({ field, label }) => (
          <AccordionSection
            key={field}
            value={field}
            title={label}
            titleInfo={choices[field] || '-'}
          >
            <div className="grid grid-cols-3 gap-krds-4">
              {CHOICES.map((choice) => (
                <ChoiceButton
                  key={choice}
                  selected={choices[field] === choice}
                  onClick={() => selectChoice(field, choice)}
                >
                  {choice}
                </ChoiceButton>
              ))}
            </div>
          </AccordionSection>
        ))}
      </Accordion>
    </>
  )
}
TndrWrt_Stp6.displayName = 'TndrWrt_Stp6'
