// 입찰참가신청서작성 - 문의 및 동의(MUI-BD-04-M14) 탭 콘텐츠.
// 호스트 페이지(BidPrtcpAperWrtPage)의 '문의 및 동의' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바·신청하기는 페이지 소유.
// 구성: 문의처 Table → 약관 동의 체크리스트(6항목, 각 행 '보기' Button → 동의서 바텀시트) → 사후심사대상 입찰안내 Infobox.
// 이 탭이 동의서 BottomSheet 컨테이너(선택 동의서 title, footer=저장 후 닫기/취소)와 저장 확인 AlertModal 을 직접 소유.
import { useState } from 'react'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { AgreementForm, AGREEMENTS, type AgreementData } from '@/ui/biz/bd/bidPrtcpAperWrt/AgreementForm'
import type { ApiError } from '@/types/api'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 문의처 — 설계서 '문의처 담당자 연락처 정보 표시'(slide112). 담당자 1건 = 기관/성명·직급 + 전화/이메일.
// 설계서는 담당자·연락처 2열 카드가 담당자 수만큼 반복되는 형태 → 담당자 1건당 Table 1개로 반복 렌더.
// 항목명은 설계서 데이터영역(slide122) 그대로 — 담당자 ofcctrNm(계약관명) · 연락처 ofcctrTelno(계약관전화번호).
// ⚠️ 기관명(instNm)·이메일(email)은 데이터영역 미정의 — 목업(slide112)에 표시된 값이라 임시 키로 둔다.
const CONTACTS = [
  { id: 'ofcctr1', instNm: '방위사업청', ofcctrNm: '홍길동 주무관', ofcctrTelno: '02-1234-5678', email: 'kukbang@g2b.go.kr' },
  { id: 'ofcctr2', instNm: '방위사업청', ofcctrNm: '홍길순 사무관', ofcctrTelno: '02-5678-4321', email: 'kukbang@g2b.go.kr' },
]

// 사후심사대상 입찰안내 — 설계서 안내사항 원문(6개 불릿).
const NOTICE_ITEMS = [
  '입찰전 꼭 확인 하시기 바랍니다.',
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '- 문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

// 담당자 1건 → Table rows(담당자/연락처). 각 셀 2줄이라 combination.
const contactRows = (c: (typeof CONTACTS)[number]): TableRow[] => [
  {
    label: '담당자',
    type: 'combination',
    value: (
      <>
        <span>{c.instNm}</span>
        <span>{c.ofcctrNm}</span>
      </>
    ),
  },
  {
    label: '연락처',
    type: 'combination',
    value: (
      <>
        <span>{c.ofcctrTelno}</span>
        <span>{c.email}</span>
      </>
    ),
  },
]

export function BidPrtcpAperWrtPage_Stp7({ detail }: { detail: MockBidPrgrsItem }) {
  void detail // 공고 식별값 표시에 사용 가능(현재 미사용)
  const [checked, setChecked] = useState<string[]>([]) // 동의 완료된 동의서 id
  const [selected, setSelected] = useState<AgreementData | null>(null) // 현재 열람 중인 동의서
  const [sheetOpen, setSheetOpen] = useState(false) // 동의서 바텀시트
  const [confirmOpen, setConfirmOpen] = useState(false) // 저장 확인 모달
  const [saveError, setSaveError] = useState<string | null>(null) // 동의서 저장 실패 안내(null=닫힘)
  const saveAgreement = bdQueries.useSaveAgreement()

  const toggle = (id: string, on: boolean) =>
    setChecked((prev) => (on ? [...new Set([...prev, id])] : prev.filter((v) => v !== id)))

  // 전체 동의 토글 — 전체 on·off(전체/부분 상태 계산은 AgreementList 내부).
  const toggleAll = (on: boolean) => setChecked(on ? AGREEMENTS.map((a) => a.id) : [])

  // 동의서 열람 — 본문은 설계서 원문(AGREEMENTS 로컬 상수)으로 렌더(getAgreement 목업은 단건 제네릭이라 다건 콘텐츠 미대체).
  const openAgreement = (a: AgreementData) => {
    setSelected(a)
    setSheetOpen(true)
  }

  // 저장 후 닫기 → 확인 모달 확정 시 mutation 훅 await, 성공 시 동의 완료 처리. 실패 시 AlertModal 안내.
  const confirmSave = async () => {
    if (!selected) {
      setSheetOpen(false)
      return
    }
    try {
      await saveAgreement.mutateAsync({ agreementId: selected.id })
      setChecked((prev) => [...new Set([...prev, selected.id])])
      setSheetOpen(false)
    } catch (err) {
      setSaveError(
        (err as ApiError | null)?.message ?? '동의서 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  }

  return (
    <>
      {/* 문의처 — 담당자 건별 Table 반복 */}
      <SectionTitle as="h3" topDivider>
        문의처
      </SectionTitle>
      <div className="flex flex-col gap-4 px-4 py-4">
        {CONTACTS.map((c) => (
          <Table key={c.id} rows={contactRows(c)} />
        ))}
      </div>

      {/* 약관 동의 — 공통 AgreementList(Figma m_agreemen). [필수]/[선택]은 variant 로 도출(select=하도급→선택).
          항목 행 클릭 → 동의서 바텀시트(AgreementForm) 는 이 탭이 소유. */}
      <SectionTitle as="h3" topDivider>
        약관 동의
      </SectionTitle>
      <AgreementList
        className="m-4"
        items={AGREEMENTS.map((a) => ({
          id: a.id,
          title: a.title,
          requirement: a.variant === 'select' ? 'optional' : 'required',
        }))}
        checked={checked}
        onToggle={toggle}
        onCheckAll={toggleAll}
        onView={(id) => {
          const a = AGREEMENTS.find((x) => x.id === id)
          if (a) openAgreement(a)
        }}
      />

      {/* 사후심사대상 입찰안내 */}
      <Infobox title="사후심사대상 입찰안내" items={NOTICE_ITEMS} />

      {/* 동의서 바텀시트 — 컨테이너/footer 는 이 탭이 소유, 콘텐츠만 AgreementForm */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={selected?.title ?? '동의서'}
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
        {selected && <AgreementForm key={selected.id} agreement={selected} />}
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

      {/* 동의서 저장 실패 안내 */}
      <AlertModal
        open={saveError !== null}
        onOpenChange={(open) => {
          if (!open) setSaveError(null)
        }}
        variant="error"
        title="동의서 저장 실패"
        description={saveError}
        primaryAction={{ label: '확인', onClick: () => setSaveError(null) }}
      />
    </>
  )
}
BidPrtcpAperWrtPage_Stp7.displayName = 'BidPrtcpAperWrtPage_Stp7'
