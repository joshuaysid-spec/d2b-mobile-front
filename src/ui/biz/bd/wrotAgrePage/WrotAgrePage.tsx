// 입찰참가신청서작성 - 서약서동의(MUI-BD-04-M01, 설계서 slide91). 입찰참가신청서 작성 마법사의 첫 스텝(서약서).
// 진입: 홈 > 입찰진행 > 상세 > 입찰참가신청서 작성 → 이 화면(서약서 동의) → '다음으로' → 신청서 작성(M05).
// 레이아웃: 요약 → 진행단계(StepBar) → 입찰안내(Infobox) → 페이지타이틀 → 서약서 동의 체크리스트(3행, '보기' → 서약서 바텀시트)
//   → 하단 액션바(취소/다음으로) + 맨위로 FAB.
// 항목명/형식은 BidPrtcpAperWrtPage 와 동일(공고 식별값은 상세 항목). 서약서 본문은 WrotAgreForm 의 WROTS(설계서 원문).
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { WrotAgreForm, WROTS, type WrotData } from '@/ui/biz/bd/wrotAgrePage/WrotAgreForm'
import type { BidPrgrsItem } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 항목명/형식 그대로(BidPrtcpAperWrtPage 와 동일 형태).
const MOCK_DETAIL: BidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '긴급공고 LDG0097-1',
  prcmNo: '56349',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '031-940-0000',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '총액제',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: false,
  techEvl: false,
  prdcpDcmntSbms: false,
  apfrStatNm: '신청',
  regRjctYn: false,
}

// 진행단계(설계서 slide92): 서약서 → 신청서 → 서명 → 제출. 진입은 서약서 단계.
const STEPS: StepItem[] = [
  { label: '서약서', state: 'doing' },
  { label: '신청서', state: 'todo' },
  { label: '서명', state: 'todo' },
  { label: '제출', state: 'todo' },
]

// 입찰안내(사후심사대상) — 설계서 안내사항 원문.
const NOTICE_ITEMS = [
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

// 서약서 동의 항목(설계서 slide91) — 필수/선택 + 본문은 WROTS(WrotAgreForm)와 id 로 연결.
const WROT_ITEMS: Array<{ id: string; required: boolean }> = [
  { id: 'w_p02', required: true }, // '조세포탈' 사실이 없음을 확약하는 서약서
  { id: 'w_p03', required: true }, // 청렴 계약 이행 서약서
  { id: 'w_p04', required: false }, // 하도급대금의 지급관련 확인 및 확약서
]
const ALL_IDS = WROT_ITEMS.map((i) => i.id) // 전체 동의 토글용 — 모듈 상수(매 렌더 재계산 방지)

export function WrotAgrePage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as BidPrgrsItem | null) ?? MOCK_DETAIL
  const [checked, setChecked] = useState<string[]>([]) // 동의 완료된 서약서 id
  const [selected, setSelected] = useState<WrotData | null>(null) // 현재 열람 중인 서약서
  const [sheetOpen, setSheetOpen] = useState(false) // 서약서 바텀시트

  const toggle = (id: string, on: boolean) =>
    setChecked((prev) => (on ? [...new Set([...prev, id])] : prev.filter((v) => v !== id)))

  // 전체 동의 토글 — 전체 on·off(전체/부분 상태 계산은 AgreementList 내부에서 처리).
  const toggleAll = (on: boolean) => setChecked(on ? [...ALL_IDS] : [])

  const openWrot = (w: WrotData) => {
    setSelected(w)
    setSheetOpen(true)
    console.log('[M01] 서약서 열람', w.id) // 추후 API: bdService.getWrot
  }

  // 저장 후 닫기 → 해당 서약서를 동의 완료 처리.
  const saveWrot = () => {
    if (selected) {
      setChecked((prev) => [...new Set([...prev, selected.id])])
      console.log('[M01] 서약서 저장', selected.id) // 추후 API: bdService.saveWrot
    }
    setSheetOpen(false)
  }

  const handleNext = () => {
    console.log('[M01] 다음으로(신청서 작성)', { pbancNo: detail.pbancNo, agreed: checked })
    // 추후: 필수 서약서 동의 검증 후 이동
    navigate(`/bd/prgrs/${detail.rNum}/apfr/form`, { state: detail })
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/계약방법 + 공고번호 + 입찰건명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />

      {/* 진행단계 표시기 — Figma: 배경 #ECF1FA(krds-bg-primary-faint) + px16/py16 */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
      </div>

      {/* 입찰안내(사후심사대상) */}
      <Infobox title="입찰안내" items={NOTICE_ITEMS} />

      {/* 서약서 동의 섹션 헤더 — Figma m_section title(9300-40694, borderTop, 19px Bold, 카운트 없음) */}
      <SectionTitle as="h2" topDivider>
        서약서 동의
      </SectionTitle>

      {/* 서약서 동의 카드 — 공통 AgreementList(Figma m_agreemen). 내용은 설계서(slide92) 3건 유지.
          항목 행 클릭 → 서약서 바텀시트(WrotAgreForm) 는 이 페이지가 소유. */}
      <AgreementList
        className="m-4"
        items={WROT_ITEMS.map((item) => ({
          id: item.id,
          title: WROTS.find((w) => w.id === item.id)?.title ?? '',
          requirement: item.required ? 'required' : 'optional',
        }))}
        checked={checked}
        onToggle={toggle}
        onCheckAll={toggleAll}
        onView={(id) => {
          const wrot = WROTS.find((w) => w.id === id)
          if (wrot) openWrot(wrot)
        }}
      />

      {/* 하단 액션바 — 취소/다음으로 */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '다음으로', variant: 'primary', onClick: handleNext },
          ]}
        />
      </div>

      {/* 맨위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 서약서 바텀시트 — 컨테이너/footer 는 페이지가 소유, 콘텐츠만 WrotAgreForm */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={selected?.title ?? '서약서'}
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setSheetOpen(false) },
              { label: '저장 후 닫기', variant: 'primary', onClick: saveWrot },
            ]}
          />
        }
      >
        {selected && <WrotAgreForm key={selected.id} wrot={selected} />}
      </BottomSheet>
    </div>
  )
}
WrotAgrePage.displayName = 'WrotAgrePage'
