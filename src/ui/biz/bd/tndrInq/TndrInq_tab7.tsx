// 입찰진행상세 - 입찰서(견적서)조회 약관동의 (MUI-BD-06-T07, 설계서 영문ID TndrInq_tab7 · 02입찰 v1.88 slide178).
// 호스트 페이지(TndrInqPage)의 '7. 약관동의' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 조회판이라 작성판(M07)의 동의 라디오/저장이 없고 제출 시 동의한 결과만 표시한다(내용 보기 = 본문 열람).
// 구성(설계서 slide178): 약관 동의 표 → 유의사항 → 전자 서명 완료(사용한 인증서 목록).
// ⚠️ 확약서 본문·유의사항 원문은 작성판(TndrWrt_Stp7)과 동일 — 작성판 스텝 파일을 import 하면 조회 청크에
//   작성 UI(AgreementList·RadioButtonGroup·AlertModal)까지 딸려오므로 원문만 옮겨 적었다(AplyCmptnPage 선례).
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 약관 동의 항목 — 설계서 slide178(입찰보증금 지급확약서, 동의 체크 표기).
const AGREEMENT_TITLE = '입찰보증금 지급확약서'
const BOND_AMOUNT = '₩199,900,000 (금 일억구천구백구십만 원)'
const AGREEMENT_BODY =
  '본인은 낙찰 후 계약 미체결시 귀부대(기관)에 상기의 입찰보증금을 현금으로 납부할 것을 확약합니다.'

// 유의사항 — 설계서 slide178 원문.
const NOTICE_ITEMS = [
  '본인은 국가를 당사자로 하는 계약에 관한 법률시행규칙에 의한 공사 입찰유의서에 따라 응찰하여 이 입찰이 귀 기관에 의하여 수락되면 공사 계약일반조건, 계약특수조건, 설계서 및 현장 설명 사항에 따라 위의 입찰금액으로 준공기한내에 공사를 완공할 것을 확약하오며 입찰서를 제출합니다.',
  '입찰서는 포기 또는 취소 후 재입찰이 불가하니 [입찰포기] 또는 [입찰취소]시 유의하시기 바랍니다.',
]

// 전자 서명 완료 — 제출 시 사용한 인증서(설계서 slide178 '인증서 1~3' 체크 표기).
// ⚠️ 인증서 항목명은 데이터영역 미정의(상세설계 예정) — 표시 라벨만 설계서 그대로 둔다.
const CERTS = [
  { id: 'cert1', label: '인증서 1' },
  { id: 'cert2', label: '인증서 2' },
  { id: 'cert3', label: '인증서 3' },
]

export function TndrInq_tab7() {
  const [sheetOpen, setSheetOpen] = useState(false) // 확약서 내용 바텀시트

  // 약관 동의 1건 → 번호/약관명(+보기)/동의여부. 제출된 입찰서라 '동의' 고정(설계서 slide178 체크 표기).
  const agreementRows: TableRow[] = [
    { label: '번호', value: '1' },
    {
      label: '약관명',
      type: 'combination',
      value: (
        <div className="flex flex-col items-start gap-krds-3">
          <span>{AGREEMENT_TITLE}</span>
          <Button size="sm" variant="inner" onClick={() => setSheetOpen(true)}>
            내용 보기
          </Button>
        </div>
      ),
    },
    { label: '동의여부', value: '동의' },
  ]

  const certRows: TableRow[] = CERTS.map((c) => ({ label: c.label, value: '서명 완료' }))

  return (
    <>
      {/* 약관 동의 — 조회 전용이라 체크리스트가 아닌 동의결과 표. */}
      <SectionTitle as="h3" topDivider>
        약관 동의
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={agreementRows} />
      </div>

      {/* 유의사항 — 설계서 slide178 원문(열림 상태) */}
      <Infobox title="유의사항" items={NOTICE_ITEMS} defaultOpen />

      {/* 전자 서명 완료 — 제출에 사용한 인증서 */}
      <SectionTitle as="h3" topDivider>
        전자 서명 완료
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={certRows} />
      </div>

      {/* 확약서 내용 — 조회 전용이라 본문만(동의 선택 라디오 없음). 컨테이너는 이 탭이 소유. */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={AGREEMENT_TITLE}
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setSheetOpen(false) }]}
          />
        }
      >
        <div className="flex flex-col gap-krds-5 py-2">
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
      </BottomSheet>
    </>
  )
}
TndrInq_tab7.displayName = 'TndrInq_tab7'
