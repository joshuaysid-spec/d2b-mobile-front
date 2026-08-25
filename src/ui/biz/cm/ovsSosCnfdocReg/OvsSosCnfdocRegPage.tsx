// 국외조달원등록증신청 — MUI-CM-04-M22 `ovsSosCnfdocReg`. 설계서 00.공통 v0.84 slide339~341.
// 고객센터 > 민원서류발급신청 > 국외 조달원 등록증 목록(M21) > [신청] 진입 페이지.
//   (slide339 "2026-07-20 화면 수정: 팝업에서 페이지로 변경" — 구 풀팝업 폐기, 라우트 페이지.)
// 신청인(회사명/성명 자동완성 readonly + 직위*/연락처* 편집) + 조달원 등록증(업체명1*/업체명2* 선택 + 발급신청사유*).
// [업체선택] → 조달업체선택(MUI-CM-04-P23 OvsSosCnfdocChc) 바텀시트(컨테이너는 이 페이지가 소유).
// [신청하기] → 검증 통과 시 완료 토스트 "신청 되었습니다." → 목록(M21) 이동. [취소] → 뒤로.
// Figma 전용 프레임 없음 → 내부 폼 컨벤션(RHF+zod, InputBox/SelectionFieldBox/TextArea/InputLabel/InputMessage).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectionFieldBox } from '@/ui/common/base/SelectionFieldBox'
import { TextArea } from '@/ui/common/base/TextArea'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Toast } from '@/ui/common/composites/Toast'
import { OvsSosCnfdocChc } from '@/ui/biz/cm/ovsSosCnfdocReg/OvsSosCnfdocChc'
import {
  ovsSosCnfdocRegSchema,
  type OvsSosCnfdocRegForm,
} from '@/ui/biz/cm/ovsSosCnfdocReg/OvsSosCnfdocReg.schema'
import { ROUTES } from '@/constants/routes'
import { formatPhoneInput } from '@/utils/format'
import type { OvsSosAplyInfo, OvsSosBzentyChcItem } from '@/types/mock/cm'

// 신청인 자동완성(dm_ovsSosAplyInfo) — 회사명·성명은 개인정보에서 자동완성(readonly).
//   직위·연락처는 비어 있으면 빈 상태로 자동완성(편집 가능) — slide340. API 연동 시 조회로 교체.
const MOCK_APLY_INFO: OvsSosAplyInfo = {
  empNm: '홍길동',
  bzentyNm: '조달테스트 업체',
  aplcntJbgdNm: '',
  aplcntEntlno: '',
}

// 업체명 선택 대상 필드(업체명1/업체명2) — [업체선택] 이 어느 필드를 채울지.
type CompanyField = 'bzentyNm1' | 'bzentyNm2'

export function OvsSosCnfdocRegPage() {
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeField, setActiveField] = useState<CompanyField>('bzentyNm1')
  const [toastOpen, setToastOpen] = useState(false)

  const form = useForm<OvsSosCnfdocRegForm>({
    resolver: zodResolver(ovsSosCnfdocRegSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      aplcntJbgdNm: MOCK_APLY_INFO.aplcntJbgdNm,
      aplcntEntlno: MOCK_APLY_INFO.aplcntEntlno,
      bzentyNm1: '',
      bzentyNm2: '',
      aplyRsn: '',
    },
  })
  const { control, setValue, handleSubmit } = form

  const openSheet = (field: CompanyField) => {
    setActiveField(field)
    setSheetOpen(true)
  }

  // 조달업체선택(P23) 결과 반영 — 선택 업체명을 활성 필드에 반영 후 시트 닫힘.
  const handleSelectCompany = (item: OvsSosBzentyChcItem) => {
    setValue(activeField, item.bzentyNm, { shouldValidate: true, shouldDirty: true })
    setSheetOpen(false)
  }

  const onSubmit = handleSubmit(
    () => {
      // TODO(백엔드 확정): scwin.btn_aply — 국외조달원 등록증 신청 전송(services/cm.ts EP 추가 후 await).
      setToastOpen(true) // 완료 토스트 → onClose 에서 목록 이동
    },
    (errors) => {
      // 첫 에러 필드로 스크롤(입력류는 RHF 자동 포커스, SelectionField/TextArea 안전용).
      const order: (keyof OvsSosCnfdocRegForm)[] = [
        'aplcntJbgdNm',
        'aplcntEntlno',
        'bzentyNm1',
        'bzentyNm2',
        'aplyRsn',
      ]
      const first = order.find((k) => errors[k])
      if (!first) return
      requestAnimationFrame(() => {
        document
          .getElementById(`field-${first}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    },
  )

  const sheetTitle = useMemo(() => '조달업체 선택', [])

  return (
    <div className="flex min-h-full w-full flex-col">
      {/* 스크롤 본문 — 신청인 / 조달원 등록증 섹션 */}
      <div className="flex flex-1 flex-col">
        {/* ── 신청인 (Applicant) ─────────────────────────────── */}
        <SectionTitle>신청인 (Applicant)</SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4 py-krds-7">
          {/* 회사명 (Company Name) — bzentyNm (readonly 자동완성) */}
          <div className="flex flex-col gap-krds-5">
            <InputLabel htmlFor="ovs-bzentyNm">회사명 (Company Name)</InputLabel>
            <InputBox id="ovs-bzentyNm" value={MOCK_APLY_INFO.bzentyNm} disabled readOnly />
          </div>

          {/* 성명 (Name) — empNm (readonly 자동완성) */}
          <div className="flex flex-col gap-krds-5">
            <InputLabel htmlFor="ovs-empNm">성명 (Name)</InputLabel>
            <InputBox id="ovs-empNm" value={MOCK_APLY_INFO.empNm} disabled readOnly />
          </div>

          {/* 직위(급) (Position) * — aplcntJbgdNm */}
          <Controller
            control={control}
            name="aplcntJbgdNm"
            render={({ field, fieldState }) => (
              <div id="field-aplcntJbgdNm" className="flex flex-col gap-krds-5">
                <InputLabel htmlFor="ovs-aplcntJbgdNm" required>
                  직위(급) (Position)
                </InputLabel>
                <InputBox
                  id="ovs-aplcntJbgdNm"
                  value={field.value}
                  maxLength={100}
                  placeholder="직위를 입력해주세요."
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onClear={() => field.onChange('')}
                  error={!!fieldState.error}
                  aria-invalid={fieldState.error ? true : undefined}
                  aria-describedby="ovs-aplcntJbgdNm-msg"
                />
                {fieldState.error && (
                  <InputMessage type="error" id="ovs-aplcntJbgdNm-msg">
                    {fieldState.error.message}
                  </InputMessage>
                )}
              </div>
            )}
          />

          {/* 연락처 (Phone Number) * — aplcntEntlno (tel + 하이픈 포맷) */}
          <Controller
            control={control}
            name="aplcntEntlno"
            render={({ field, fieldState }) => (
              <div id="field-aplcntEntlno" className="flex flex-col gap-krds-5">
                <InputLabel htmlFor="ovs-aplcntEntlno" required>
                  연락처 (Phone Number)
                </InputLabel>
                <InputBox
                  id="ovs-aplcntEntlno"
                  inputType="tel"
                  format={formatPhoneInput}
                  value={field.value}
                  maxLength={13}
                  placeholder="번호를 입력하세요."
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onClear={() => field.onChange('')}
                  error={!!fieldState.error}
                  aria-invalid={fieldState.error ? true : undefined}
                  aria-describedby="ovs-aplcntEntlno-msg"
                />
                {fieldState.error && (
                  <InputMessage type="error" id="ovs-aplcntEntlno-msg">
                    {fieldState.error.message}
                  </InputMessage>
                )}
              </div>
            )}
          />
        </div>

        {/* ── 조달원 등록증 (Certificate of Registration) ────────── */}
        <SectionTitle topDivider>조달원 등록증 (Certificate of Registration)</SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4 py-krds-7">
          {/* 업체명1 (Company Name) * — bzentyNm1 (조달업체선택 P23) */}
          <Controller
            control={control}
            name="bzentyNm1"
            render={({ field, fieldState }) => (
              <div id="field-bzentyNm1" className="flex flex-col gap-krds-5">
                <InputLabel required>업체명1 (Company Name)</InputLabel>
                <SelectionFieldBox
                  value={field.value}
                  placeholder="업체를 선택해주세요."
                  onClick={() => openSheet('bzentyNm1')}
                  onClear={() => field.onChange('')}
                  error={!!fieldState.error}
                  aria-label="업체명1 선택"
                />
                {fieldState.error && (
                  <InputMessage type="error">{fieldState.error.message}</InputMessage>
                )}
              </div>
            )}
          />

          {/* 업체명2 (Company Name) * — bzentyNm2 (조달업체선택 P23) */}
          <Controller
            control={control}
            name="bzentyNm2"
            render={({ field, fieldState }) => (
              <div id="field-bzentyNm2" className="flex flex-col gap-krds-5">
                <InputLabel required>업체명2 (Company Name)</InputLabel>
                <SelectionFieldBox
                  value={field.value}
                  placeholder="업체를 선택해주세요."
                  onClick={() => openSheet('bzentyNm2')}
                  onClear={() => field.onChange('')}
                  error={!!fieldState.error}
                  aria-label="업체명2 선택"
                />
                {fieldState.error && (
                  <InputMessage type="error">{fieldState.error.message}</InputMessage>
                )}
              </div>
            )}
          />

          {/* 발급신청사유 (Reason of Application) * — aplyRsn (4000자) */}
          <Controller
            control={control}
            name="aplyRsn"
            render={({ field, fieldState }) => (
              <div id="field-aplyRsn" className="flex flex-col gap-krds-5">
                <InputLabel htmlFor="ovs-aplyRsn" required>
                  발급신청사유 (Reason of Application)
                </InputLabel>
                <TextArea
                  id="ovs-aplyRsn"
                  value={field.value}
                  maxLength={4000}
                  placeholder="사유를 입력해주세요."
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  aria-invalid={fieldState.error ? true : undefined}
                  aria-describedby="ovs-aplyRsn-msg"
                />
                {fieldState.error && (
                  <InputMessage type="error" id="ovs-aplyRsn-msg">
                    {fieldState.error.message}
                  </InputMessage>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* 하단 sticky 액션 바 — [취소 | 신청하기].
          safe-area: pb 는 max(12px, env(safe-area-inset-bottom)) — Tailwind 가 env() 콤마를 못 다뤄 inline style. */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="split"
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '신청하기', variant: 'primary', onClick: onSubmit },
          ]}
        />
      </div>

      {/* 조달업체선택(MUI-CM-04-P23) — 컨테이너/타이틀은 이 페이지가 소유. 콘텐츠만 OvsSosCnfdocChc. */}
      <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} title={sheetTitle}>
        <OvsSosCnfdocChc onSelect={handleSelectCompany} />
      </BottomSheet>

      {/* 완료 토스트 → 닫힘 시 목록(M21) 이동 (slide340 — 신청 후 신청목록으로 이동) */}
      <Toast
        open={toastOpen}
        duration={1500}
        onClose={() => {
          setToastOpen(false)
          navigate(ROUTES.SUPPORT_OVS_SOS_CNFDOC)
        }}
      >
        신청 되었습니다.
      </Toast>
    </div>
  )
}
OvsSosCnfdocRegPage.displayName = 'OvsSosCnfdocRegPage'
