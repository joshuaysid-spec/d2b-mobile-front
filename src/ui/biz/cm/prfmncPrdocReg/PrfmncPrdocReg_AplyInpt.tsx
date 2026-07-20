// 신청정보입력 — MUI-CM-04-M12 (실적증명서 신청 화면 – 신청 공통). 설계서 slide288.
// 폼은 부모(PrfmncPrdocRegPage)가 useForm 소유 → control 을 받아 Controller 로 연결(RHF+zod 표준).
// 계약구분 분기(slide286·288): 방위사업청 = 사용목적 select(기타 시 상세 내용) / 부대 = 제출유형 select.
import { Controller, type Control } from 'react-hook-form'

import { formatPhoneInput } from '@/utils/format'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SelectBox, type SelectBoxItem } from '@/ui/common/base/SelectBox'
import { Infobox } from '@/ui/common/composites/Infobox'
import type { AplyInptForm } from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocReg_AplyInpt.schema'

// 발급수량 — 1통 ~ 10통(slide288 "발급 수량 : 1 통 ~10 통")
const DMND_QTY_ITEMS: SelectBoxItem[] = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}통`,
}))

// 사용목적(방위사업청 계약) — slide288 A. 10종
const USE_PRPS_ITEMS: SelectBoxItem[] = [
  '세무서제출용-당해(납품)',
  '세무서제출용-당해(선금)',
  '세무서제출용-당해(착수금)',
  '세무서제출용-당해(중도금)',
  '세무서제출용-예정(납품)',
  '보증회사제출용-당해(납품)',
  '보증회사제출용-예정(납품)',
  '적격심사제출용',
  '입찰참가용',
  '기타',
].map((v) => ({ value: v, label: v }))

// 제출유형(부대 계약) — slide288 b. 10종. 영문 항목명 미정의 → usePrpsCd 필드에 겸용 저장(schema 주석).
const SBMSN_TYPE_ITEMS: SelectBoxItem[] = [
  '1.시공실적증명서 [군시설공사 적격심사기준에 관한 훈령/국방부]',
  '2.시공실적(기성율)증명서 [군시설공사입찰참가자격사전심사 세부운영기준에 관한 훈령/국방부]',
  '3.건설공사기성실적증명(신청)서_세부공종(종합) [건설산업기본법 시행규칙/국토해양부]',
  '4.건설폐기물처리용역이행 실적증명서 [건설폐기물처리용역 적격업체 평가기준/환경부]',
  '5.실적자료 발주기관 확인서 [최저가낙찰제 대상공사의 입찰금액 (원) 적정성 세부심사기준에 관한 훈령/국방부]',
  '6.정보통신공사 실적증명서 [정보통신공사업법 시행에 관한 규정/전기공제조합]',
  '7.소방시설공사 실적증명서 [소방시설공사업법 시행에 관한 규정/소방시설협회]',
  '8.전기공사 실적증명서 [전기공사업법 시행에 관한 규정/전기공사협회]',
  '9.건설공사기성실적증명(신청)서_세부공종(전문) [건설산업기본법 시행규칙/국토해양부]',
  '10.건설공사 직접시공분 기성실적증명(신청)서 [건설산업기본법 시행규칙/국토해양부]',
]
  .map((v) => ({ value: v, label: v }))

// 유의사항(slide288)
const NOTICE_ITEMS = [
  '납품실적증명서의 사용목적이 적격심사, 입찰참가용일 경우에는 대외기관제출용만 발급합니다.',
  '청 내부 부서는 해당부서 담당자가 관련 시스템을 통하여 직접 확인 가능하니, 담당자와 유선으로 협조하시기 바랍니다.',
  '실적증명서 발급 관련문의는 해당 군부대로 해주시기 바랍니다.',
  '해당 군부대의 연락처 확인이 어려울 경우에는 군전화안내센터로 문의하시면 안내 받으실 수 있습니다. (안내센터에서는 부대 연락처 확인만 가능하며, 실적증명서 발급 안내는 불가)',
  '군전화 안내센터 : 02-748-0114, 042-550-0114',
]

export interface PrfmncPrdocReg_AplyInptProps {
  /** 부모(페이지)가 소유한 react-hook-form control. */
  control: Control<AplyInptForm>
  /** 계약구분 분기 — 'd2b'(방위사업청)=사용목적 / 그 외(부대)=제출유형. */
  branch: 'd2b' | 'unitB' | 'other'
  /** 현재 사용목적 값(기타 입력 노출 판단) — 부모 watch. */
  usePrpsCd: string
}

export function PrfmncPrdocReg_AplyInpt({ control, branch, usePrpsCd }: PrfmncPrdocReg_AplyInptProps) {
  const isD2b = branch === 'd2b'
  const prpsLabel = isD2b ? '사용목적' : '제출유형'

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-[17px] leading-normal text-krds-text-ink">
        신청 정보를 입력해주시길 바랍니다.
      </p>
      <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">신청정보</h3>

      {/* 신청인 연락처* — tel 마스킹(InputBox 내장) */}
      <Controller
        control={control}
        name="entlno"
        render={({ field, fieldState }) => (
          <div id="field-entlno" className="flex flex-col gap-krds-5">
            <InputLabel htmlFor="reg-entlno" required>
              신청인 연락처
            </InputLabel>
            <InputBox
              id="reg-entlno"
              inputType="tel"
              format={formatPhoneInput}
              maxLength={13}
              placeholder="입력해주세요."
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              onClear={() => field.onChange('')}
              error={!!fieldState.error}
              aria-invalid={fieldState.error ? true : undefined}
            />
            {fieldState.error && (
              <InputMessage type="error">{fieldState.error.message}</InputMessage>
            )}
          </div>
        )}
      />

      {/* 발급수량* — 1통~10통 */}
      <Controller
        control={control}
        name="dmndQty"
        render={({ field, fieldState }) => (
          <div id="field-dmndQty" className="flex flex-col gap-krds-5">
            <InputLabel required>발급수량</InputLabel>
            <SelectBox
              items={DMND_QTY_ITEMS}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="선택해주세요."
              error={!!fieldState.error}
            />
            {fieldState.error && (
              <InputMessage type="error">{fieldState.error.message}</InputMessage>
            )}
          </div>
        )}
      />

      {/* 제출처* */}
      <Controller
        control={control}
        name="submOrgn"
        render={({ field, fieldState }) => (
          <div id="field-submOrgn" className="flex flex-col gap-krds-5">
            <InputLabel htmlFor="reg-submOrgn" required>
              제출처
            </InputLabel>
            <InputBox
              id="reg-submOrgn"
              placeholder="입력해주세요."
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              onClear={() => field.onChange('')}
              error={!!fieldState.error}
              aria-invalid={fieldState.error ? true : undefined}
            />
            {fieldState.error && (
              <InputMessage type="error">{fieldState.error.message}</InputMessage>
            )}
          </div>
        )}
      />

      {/* 사용목적(방위사업청)/제출유형(부대)* — 값에 따라 실적정보(step3) 노출 항목 변경 */}
      <Controller
        control={control}
        name="usePrpsCd"
        render={({ field, fieldState }) => (
          <div id="field-usePrpsCd" className="flex flex-col gap-krds-5">
            <InputLabel required>{prpsLabel}</InputLabel>
            <SelectBox
              items={isD2b ? USE_PRPS_ITEMS : SBMSN_TYPE_ITEMS}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="선택해주세요."
              error={!!fieldState.error}
            />
            {fieldState.error && (
              <InputMessage type="error">{fieldState.error.message}</InputMessage>
            )}
          </div>
        )}
      />

      {/* 기타 상세 내용(etcUsePrps) — 사용목적 '기타' 선택 시만(slide288) */}
      {isD2b && usePrpsCd === '기타' && (
        <Controller
          control={control}
          name="etcUsePrps"
          render={({ field, fieldState }) => (
            <div id="field-etcUsePrps" className="flex flex-col gap-krds-5">
              <InputBox
                placeholder="기타 내용을 입력해주세요."
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                onClear={() => field.onChange('')}
                error={!!fieldState.error}
                aria-invalid={fieldState.error ? true : undefined}
              />
              {fieldState.error && (
                <InputMessage type="error">{fieldState.error.message}</InputMessage>
              )}
            </div>
          )}
        />
      )}

      {/* 유의사항 */}
      <Infobox title="유의사항" collapsible={false} items={NOTICE_ITEMS} />
    </div>
  )
}
PrfmncPrdocReg_AplyInpt.displayName = 'PrfmncPrdocReg_AplyInpt'
