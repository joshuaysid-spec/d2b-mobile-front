// 공개수의협상견적서취소신청서작성 (MUI-BD-12-P82, 설계서 slide438 · 항목설명 slide439).
// 견적서 상세(M78) 우측 하단 + 바로가기 '공개수의협상견적서 취소 신청서 작성' → 바텀시트
//   (풀팝업→바텀시트 전환 — 사용자 지시 2026-08-26).
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(M78 페이지)가 소유, 여기엔 본문만.
//    footer '제출하기' 는 부모가 ref(useImperativeHandle)로 submit() 호출 → 제출확인 모달(내부 소유).
// 섹션은 아코디언이 아니라 SectionTitle + Table 구조 — 시트 본문(px-16) 안이라 자체 좌우 패딩은 제거(px-0).
//    항목명 = 설계서 데이터영역 영문(dm_rtrcnAplyDsctn).
// 폼: RHF+zod — 사유 필수, submit() 시 검증 후 확인 모달.
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { TextArea } from '@/ui/common/base/TextArea'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockOvsRlsVltrnsSummary } from '@/types/mock/bd'
import { focusField } from '@/utils/focusField'

export interface OvsRlsVltrnsNgtnEtdcRtrcnApfrWrtHandle {
  /** 부모 BottomSheet footer '제출하기' 가 호출 — 제출확인 모달을 띄운다 */
  submit: () => void
}

export interface OvsRlsVltrnsNgtnEtdcRtrcnApfrWrtProps {
  /** 견적서 상세에서 넘어온 요약 — 취소신청내역(공고 식별값)을 이 값으로 그린다. */
  detail: MockOvsRlsVltrnsSummary
  /** 제출 완료(확인) 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

// 취소사유(rsn) — 필수, 자리수 4000 (설계서 slide439 dm_rtrcnAplyDsctn).
const RTRCN_RSN_MAX = 4000

// 취소사유 검증 — 공백만 입력은 미입력으로 본다(trim). maxLength 는 타이핑만 막으므로 .max 가 최종 방어.
const rsnSchema = z.object({
  rsn: z
    .string()
    .trim()
    .min(1, { error: '취소사유를 입력해주세요.' })
    .max(RTRCN_RSN_MAX, { error: `취소사유는 ${RTRCN_RSN_MAX}자 이내로 입력해주세요.` }),
})

// 신청업체 (sbt*, 설계서 slide438~439) — 로그인 업체 정보라 목업.
const MOCK_SBT_INFO = {
  sbtBzentyCd: '7001F',
  sbtBzentyNm: 'A 무역대리점',
  sbtRprsvNm: '홍길동',
  sbtBzmnNo: '123-45-67890',
}

// 입찰업체 - 제작자/공급자 (sply*, 설계서 slide438~439) — 목업.
const MOCK_SPLY_INFO = {
  splyBzentyCd: '7004F',
  splyBzentyNm: 'B 해외업체',
  splyRprsvNm: '홍길동',
  splyBzmnNo: '123-45-67890',
}

// 서약문 날짜 — 오늘 날짜(제출일). 'YYYY 년 MM 월 DD 일'.
function todayLabel() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()} 년 ${mm} 월 ${dd} 일`
}

const OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt = forwardRef<
  OvsRlsVltrnsNgtnEtdcRtrcnApfrWrtHandle,
  OvsRlsVltrnsNgtnEtdcRtrcnApfrWrtProps
>(({ detail, onSubmitted }, ref) => {
  // 취소사유(rsn) — 필수 입력. shouldFocusError 끄고 focusField 한 경로로 포커스(forms.md).
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<{ rsn: string }>({
    resolver: zodResolver(rsnSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: { rsn: '' },
  })
  const rsn = watch('rsn')
  const [confirmOpen, setConfirmOpen] = useState(false)

  // footer '제출하기' → 검증 통과 시 제출확인 모달 오픈, 실패 시 사유 필드 포커스
  useImperativeHandle(
    ref,
    () => ({
      submit: () =>
        void handleSubmit(
          () => setConfirmOpen(true),
          () => focusField('field-rsn'),
        )(),
    }),
    [handleSubmit],
  )

  // 취소신청내역 — 공고 식별값(pbancNo/bizNm/prchsDmndNo/intgRfrncNo)은 상세 요약으로 구동.
  const pbancRows: TableRow[] = [
    { label: '공고번호-차수', value: detail.pbancNo },
    { label: '사업명', value: detail.bizNm },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
  ]
  const sbtRows: TableRow[] = [
    { label: '업체코드', value: MOCK_SBT_INFO.sbtBzentyCd },
    { label: '업체명', value: MOCK_SBT_INFO.sbtBzentyNm },
    { label: '대표자', value: MOCK_SBT_INFO.sbtRprsvNm },
    { label: '사업자번호 (DUNS NUM)', value: MOCK_SBT_INFO.sbtBzmnNo },
  ]
  const splyRows: TableRow[] = [
    { label: '업체코드', value: MOCK_SPLY_INFO.splyBzentyCd },
    { label: '업체명', value: MOCK_SPLY_INFO.splyBzentyNm },
    { label: '대표자', value: MOCK_SPLY_INFO.splyRprsvNm },
    { label: '사업자번호 (DUNS NUM)', value: MOCK_SPLY_INFO.splyBzmnNo },
  ]

  const handleConfirm = () => {
    console.log('[P82] 견적서 취소 신청서 제출', { rsn: getValues('rsn') }) // 추후 API: bdService.cancelEtdcRtrcnApfrSbmsn
    setConfirmOpen(false)
    onSubmitted()
  }

  return (
    <div className="flex flex-col">
      {/* 취소신청내역 / 신청업체 / 입찰업체 — 섹션 제목 + 표.
          px-0/py-4: 시트 본문(px-16) 안이라 자체 좌우 패딩 제거(이중 패딩 방지) */}
      <SectionTitle as="h3" className="px-0">
        취소신청내역
      </SectionTitle>
      <div className="py-4">
        <Table rows={pbancRows} />
      </div>

      <SectionTitle as="h3" className="px-0">
        신청업체
      </SectionTitle>
      <div className="py-4">
        <Table rows={sbtRows} />
      </div>

      <SectionTitle as="h3" className="px-0">
        입찰업체 - 제작자/공급자
      </SectionTitle>
      <div className="py-4">
        <Table rows={splyRows} />
      </div>

      {/* 취소사유 — 필수, 최대 4000자 */}
      <div id="field-rsn" className="flex flex-col gap-krds-5 py-4">
        <InputLabel htmlFor="ovsEtdcRtrcnRsn" required>
          취소사유
        </InputLabel>
        <TextArea
          id="ovsEtdcRtrcnRsn"
          maxLength={RTRCN_RSN_MAX}
          placeholder="내용을 입력하세요."
          error={!!errors.rsn}
          aria-invalid={!!errors.rsn}
          aria-describedby={errors.rsn ? 'ovsEtdcRtrcnRsn-error' : undefined}
          {...register('rsn')}
        />
        {errors.rsn && (
          <InputMessage type="error" id="ovsEtdcRtrcnRsn-error">
            {errors.rsn.message}
          </InputMessage>
        )}
        <div className="text-right text-krds-body-sm text-krds-text-muted tabular-nums">
          {rsn.length} / {RTRCN_RSN_MAX}
        </div>
      </div>

      {/* 서약문 박스 — 설계서 slide438 원문(귀 청 / 방위사업청장 귀하), 날짜=오늘(제출일) */}
      <div className="pb-krds-8 pt-krds-5">
        <div className="flex flex-col items-center justify-center gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8 text-center">
          <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
            우리 회사가 귀 청에 제출한 전자입찰서를 취소하오니, 무효 처리하여 주시기 바랍니다.
          </p>
          <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
            {todayLabel()}
          </p>
          <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
            방위사업청장 귀하
          </p>
        </div>
      </div>

      {/* 제출확인 — 설계서 제출 이벤트 알럿(Figma 9973-132885, check variant) */}
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="check"
        title="견적서 취소 신청서를 제출하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: handleConfirm }}
      />
    </div>
  )
})
OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt.displayName = 'OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt'

export { OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt }
