// 입찰서(견적서) 작성 - 약관동의 (MUI-BD-06-M07, Figma 9973-63762·9973-67681 · 설계서 02입찰 slide127)
// 컨테이너(TndrWrtPage)가 요약/탭/하단버튼([이전][신청])/FAB 를 소유 — 이 컴포넌트는 스텝7 '약관동의' 탭 본문만 렌더한다.
// 구성: 약관 동의 목록(AgreementList, 필요 시 노출 · 설계서 slide127) → 유의사항 Infobox(열림). 탭명과 중복되는 큰 타이틀은 제거(260709).
// 이 탭이 동의서 상세 BottomSheet 컨테이너(title='동의서 상세', footer=취소/저장 후 닫기)와 저장 확인 AlertModal 을 직접 소유.
//   동의 처리 패턴(라디오 동의안함/동의함 → 저장 후 닫기 → 확인)은 입찰참가신청서(BidPrtcpAperWrtPage_Stp7)와 동일.
import { useState } from 'react'

import { AgreementList } from '@/ui/common/composites/AgreementList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Infobox } from '@/ui/common/composites/Infobox'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import type { BidPrgrsItem } from '@/types/bd'

// 약관 동의 항목 — 설계서 slide127 "약관 동의 항목 필요에 따라 노출". 물품/부서부호(E·P) 등 조건에 따라 입찰보증금 지급확약서 노출.
const AGREEMENT_ID = 'depsPayCert'
const AGREEMENT_TITLE = '입찰보증금 지급확약서'

// 동의서 상세(Figma 9973-67681) — 입찰보증 지급 확약서 본문. 보증금액은 설계서 예시(금 일억구천구백구십만 원).
const BOND_AMOUNT = '₩199,900,000 (금 일억구천구백구십만 원)'
const AGREEMENT_BODY =
  '본인은 낙찰 후 계약 미체결시 귀부대(기관)에 상기의 입찰보증금을 현금으로 납부할 것을 확약합니다.'

// 유의사항 — 설계서 slide127 원문(공사 입찰유의서 확약 + 입찰포기/취소 유의).
const NOTICE_ITEMS = [
  '본인은 국가를 당사자로 하는 계약에 관한 법률시행규칙에 의한 공사 입찰유의서에 따라 응찰하여 이 입찰이 귀 기관에 의하여 수락되면 공사 계약일반조건, 계약특수조건, 설계서 및 현장 설명 사항에 따라 위의 입찰금액으로 준공기한내에 공사를 완공할 것을 확약하오며 입찰서를 제출합니다.',
  '입찰서는 포기 또는 취소 후 재입찰이 불가하니 [입찰포기] 또는 [입찰취소]시 유의하시기 바랍니다.',
]

const AGREE_OPTIONS = [
  { value: '동의안함', label: '동의안함' },
  { value: '동의함', label: '동의함' },
]

export function TndrWrt_Stp7({ detail }: { detail: BidPrgrsItem }) {
  void detail // 공고 식별값 표시에 사용 가능(현재 미사용)
  const [checked, setChecked] = useState<string[]>([]) // 동의 완료된 동의서 id
  const [sheetOpen, setSheetOpen] = useState(false) // 동의서 상세 바텀시트
  const [confirmOpen, setConfirmOpen] = useState(false) // 저장 확인 모달
  const [choice, setChoice] = useState('동의안함') // 시트 내 동의 선택(동의안함/동의함)

  const toggle = (id: string, on: boolean) =>
    setChecked((prev) => (on ? [...new Set([...prev, id])] : prev.filter((v) => v !== id)))

  const openAgreement = () => {
    // 목록에 저장된 동의 상태를 시트 라디오 초기값으로 반영.
    setChoice(checked.includes(AGREEMENT_ID) ? '동의함' : '동의안함')
    setSheetOpen(true)
    console.log('[M07] 동의서 열람', AGREEMENT_ID) // 추후 API: bdService.getAgreement
  }

  // 저장 후 닫기 → 확인 모달에서 확정 시 라디오 선택('동의함'만 동의 완료)으로 목록 체크 반영.
  const confirmSave = () => {
    toggle(AGREEMENT_ID, choice === '동의함')
    console.log('[M07] 동의서 저장', AGREEMENT_ID, choice) // 추후 API: bdService.saveAgreement
    setSheetOpen(false)
  }

  return (
    <>
      {/* 약관 동의 — 공통 AgreementList. 항목 1개(입찰보증금 지급확약서, 필수). 전체 동의 행은 단일 항목이라 숨김.
          항목 행 클릭 → 동의서 상세 바텀시트는 이 탭이 소유. */}
      <AgreementList
        className="m-4"
        checkAll={false}
        items={[{ id: AGREEMENT_ID, title: AGREEMENT_TITLE, requirement: 'required' }]}
        checked={checked}
        onToggle={toggle}
        onView={openAgreement}
      />

      {/* 유의사항 — 설계서 slide127 원문(열림 상태) */}
      <Infobox title="유의사항" items={NOTICE_ITEMS} defaultOpen />

      {/* 동의서 상세 바텀시트 — 컨테이너/footer 는 이 탭이 소유, 콘텐츠(확약서 본문 + 동의 선택)만 인라인 */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="동의서 상세"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setSheetOpen(false) },
              { label: '저장 후 닫기', variant: 'primary', onClick: () => setConfirmOpen(true) },
            ]}
          />
        }
      >
        <div className="flex flex-col gap-krds-7 py-2">
          {/* 확약서 본문 — Figma 9973-67681 */}
          <div className="flex flex-col gap-krds-5">
            <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
              입찰보증 지급 확약서
            </p>
            <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
              입찰보증금 {BOND_AMOUNT}
            </p>
            <p className="wrap-break-word text-[17px] leading-normal text-krds-text-ink">
              {AGREEMENT_BODY}
            </p>
          </div>

          {/* 동의 선택 */}
          <div className="flex flex-col gap-krds-5">
            <p className="text-[17px] font-bold leading-normal text-krds-text-ink">동의 선택</p>
            <RadioButtonGroup
              items={AGREE_OPTIONS}
              value={choice}
              onValueChange={(v) => {
                setChoice(v)
                console.log('[M07] 동의 선택', AGREEMENT_ID, v) // 추후 API: bdService.setAgreementChoice
              }}
            />
          </div>
        </div>
      </BottomSheet>

      {/* 저장 확인 모달 */}
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="check"
        title="동의하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: confirmSave }}
      />
    </>
  )
}
TndrWrt_Stp7.displayName = 'TndrWrt_Stp7'
