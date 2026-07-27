// 실적정보(unitI) — MUI-CM-04-T20. 계약구분 부대+시설공사. 확인 탭(PrfmncPrdocDtl_UnitI, T10)의 입력판.
// 제출유형 "10. 건설공사 직접시공분 기성실적증명(신청)서 [건설산업기본법 시행규칙/국토해양부]".
// 설계서 00.공통 v0.84 slide312~313(화면) · 항목 설명 slide289(1.32 신청인·1.33 공사내역).
// 항목명(키)은 설계서 영문 그대로. 금액 단위 천원. 설계서상 비용정보 3건 — 입력 UI 는 대표 1건.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { DateInput } from '@/ui/common/composites/DateInput'
import { YearInput } from '@/ui/common/composites/YearInput'
import {
  AmountField,
  TextAreaField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

export function PrfmncPrdocReg_UnitI() {
  const { get, set } = useFieldRecord({
    bzentyNm: 'A 업체',
    rprsvNm: '홍길동',
    salsLctnAddr: '서울특별시 종로구…',
    cstrnNm: '공사 명칭 표시 영역',
  })

  return (
    <div className="flex w-full flex-col pb-2">
      <p className="px-4 pt-4 text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>

      <Accordion type="multiple" defaultValue={['aplcnt', 'cstrn', 'cost']}>
        {/* 신청인 — 상호/대표자/영업소소재지 읽기전용, 업종및등록번호만 입력 */}
        <AccordionSection value="aplcnt" title="신청인" borderTop={false}>
          <div className="flex flex-col gap-krds-8">
            <TextField label="상호" value={get('bzentyNm')} onChange={set('bzentyNm')} disabled />
            <TextField label="대표자" value={get('rprsvNm')} onChange={set('rprsvNm')} disabled />
            <TextField
              label="영업소 소재지"
              value={get('salsLctnAddr')}
              onChange={set('salsLctnAddr')}
              disabled
            />
            <TextField
              label="업종 및 등록번호"
              required
              value={get('lcnsNoVl')}
              onChange={set('lcnsNoVl')}
            />
          </div>
        </AccordionSection>

        {/* 공사내역 */}
        <AccordionSection value="cstrn" title="공사내역">
          <div className="flex flex-col gap-krds-8">
            <TextField label="공사명" value={get('cstrnNm')} onChange={set('cstrnNm')} />
            <AmountField
              label="총공사금액"
              unit="천원"
              value={get('tcstrnAmt')}
              onChange={set('tcstrnAmt')}
            />
            <TextField
              label="현장소재지"
              value={get('grndsLctnAddr')}
              onChange={set('grndsLctnAddr')}
            />
            <TextField label="공종" value={get('cnstpNm')} onChange={set('cnstpNm')} />
            <TextField
              label="인 허가 기관"
              value={get('lcpmtInstNm')}
              onChange={set('lcpmtInstNm')}
            />
            <YearInput
              label="실적년도"
              value={get('prfmncYr')}
              onChange={set('prfmncYr')}
              placeholder="선택해주세요."
            />
          </div>
        </AccordionSection>

        {/* 비용정보 (단위: 천원, 부가세포함) */}
        <AccordionSection value="cost" title="비용정보 (단위: 천원, 부가세포함)">
          <div className="flex flex-col gap-krds-8">
            <YearInput
              label="연도"
              value={get('year')}
              onChange={set('year')}
              placeholder="선택해주세요."
            />
            <AmountField
              label="해당연도 기성액"
              unit="천원"
              value={get('thyrPxcndAmt')}
              onChange={set('thyrPxcndAmt')}
            />
            <DateInput
              label="계약연월일"
              value={get('ctrtYmd')}
              onChange={set('ctrtYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="착공연월일"
              value={get('bgncstYmd')}
              onChange={set('bgncstYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="준공연월일"
              value={get('cmcnYmd')}
              onChange={set('cmcnYmd')}
              placeholder="선택해주세요."
            />
            <TextField
              label="해당연도 직접시공분 세부공종(전문공사)"
              value={get('telgmDtlCnstpNm')}
              onChange={set('telgmDtlCnstpNm')}
            />
            <AmountField
              label="해당연도 직접시공분 기성액"
              unit="천원"
              value={get('pxcndAmt')}
              onChange={set('pxcndAmt')}
            />
          </div>
        </AccordionSection>
      </Accordion>

      {/* 그 밖의 사항 — 텍스트 입력 */}
      <div className="px-krds-8 py-krds-7">
        <TextAreaField
          label="그 밖의 사항 (공사의 규모 공법, 공동 도급내역 등)"
          value={get('etcMttr')}
          onChange={set('etcMttr')}
        />
      </div>
    </div>
  )
}
PrfmncPrdocReg_UnitI.displayName = 'PrfmncPrdocReg_UnitI'
