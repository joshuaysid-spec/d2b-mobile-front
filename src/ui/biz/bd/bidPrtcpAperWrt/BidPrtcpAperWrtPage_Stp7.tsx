// 입찰참가신청서작성 - 문의 및 동의(MUI-BD-04-M14) 탭 콘텐츠.
// 호스트 페이지(BidPrtcpAperWrtPage)의 '문의 및 동의' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바·전자서명하기는 페이지 소유.
// 구성: PageTitle → 문의처/담당자 Table → 약관 동의 체크리스트(6항목, 각 행 '보기' Button → 동의서 바텀시트) → 입찰안내 Infobox.
// 이 탭이 동의서 BottomSheet 컨테이너(선택 동의서 title, footer=저장 후 닫기/취소)와 저장 확인 AlertModal 을 직접 소유.
import { useState } from 'react'

import { useSaveAgreement } from '@/queries/bd'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { AgreementForm, AGREEMENTS, type AgreementData } from '@/ui/biz/bd/bidPrtcpAperWrt/AgreementForm'
import type { ApiError } from '@/types/api'
import type { BidPrgrsItem } from '@/types/bd'

// 문의처 / 담당자 — 설계서 '문의처 담당자 연락처 정보 표시'.
const CONTACT_ROWS: TableRow[] = [
  { label: '문의처', value: '1577-1118(①) 전자입찰서비스 데스크' },
  { label: '담당자', value: '홍길동' },
  { label: '연락처', value: '031-940-0000' },
]

// 입찰안내(사후심사대상) — 설계서 안내사항 원문.
const NOTICE_ITEMS = [
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

export function BidPrtcpAperWrtPage_Stp7({ detail }: { detail: BidPrgrsItem }) {
  void detail // 공고 식별값 표시에 사용 가능(현재 미사용)
  const [checked, setChecked] = useState<string[]>([]) // 동의 완료된 동의서 id
  const [selected, setSelected] = useState<AgreementData | null>(null) // 현재 열람 중인 동의서
  const [sheetOpen, setSheetOpen] = useState(false) // 동의서 바텀시트
  const [confirmOpen, setConfirmOpen] = useState(false) // 저장 확인 모달
  const [saveError, setSaveError] = useState<string | null>(null) // 동의서 저장 실패 안내(null=닫힘)
  const saveAgreement = useSaveAgreement()

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
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        문의 및 동의
      </PageTitle>

      {/* 문의처 / 담당자 */}
      <SectionTitle as="h3" topDivider>
        문의처 / 담당자
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={CONTACT_ROWS} />
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

      {/* 입찰안내(사후심사대상) */}
      <Infobox title="입찰안내" items={NOTICE_ITEMS} />

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
