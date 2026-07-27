// 실적정보(unitH) — MUI-CM-04-T19. 계약구분 부대+시설공사. 확인 탭(PrfmncPrdocDtl_UnitH, T09)의 입력판.
// 제출유형 "9. 건설공사기성실적증명(신청)서_세부공종(전문) [건설산업기본법 시행규칙/국토해양부]".
// 설계서 00.공통 v0.84 slide310~311(화면) · 항목 설명 slide288(1.30 신청인·1.31 공사내역).
// 항목명(키)은 설계서 영문 그대로. 금액 단위 천원. 필수 * 는 업종및등록번호.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { DateInput } from '@/ui/common/composites/DateInput'
import { YearInput } from '@/ui/common/composites/YearInput'
import {
  AmountField,
  TextAreaField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

export function PrfmncPrdocReg_UnitH() {
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
            <TextField label="공사유형" value={get('cstrnTypeNm')} onChange={set('cstrnTypeNm')} />
            <TextField
              label="인 허가 기관"
              value={get('lcpmtInstNm')}
              onChange={set('lcpmtInstNm')}
            />
            <TextField label="주력분야" value={get('mfrcFldNm')} onChange={set('mfrcFldNm')} />
            <DateInput
              label="인 허가 년월일"
              value={get('lcpmtYmd')}
              onChange={set('lcpmtYmd')}
              placeholder="선택해주세요."
            />
            <TextField
              label="세부공종(전문)"
              value={get('telgmDtlCnstpNm')}
              onChange={set('telgmDtlCnstpNm')}
            />
            <YearInput
              label="실적년도"
              value={get('prfmncYr')}
              onChange={set('prfmncYr')}
              placeholder="선택해주세요."
            />
          </div>
        </AccordionSection>

        {/* 복합공사종류 실적 명세 (단위: 천원, 부가세포함) */}
        <AccordionSection value="cost" title="복합공사종류 실적 명세 (단위: 천원, 부가세포함)">
          <div className="flex flex-col gap-krds-8">
            <DateInput
              label="계약연월"
              value={get('ctrtYmd')}
              onChange={set('ctrtYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="착공연월"
              value={get('bgncstYmd')}
              onChange={set('bgncstYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="준공연월"
              value={get('cmcnYmd')}
              onChange={set('cmcnYmd')}
              placeholder="선택해주세요."
            />
            <AmountField
              label="당년도 기성액"
              unit="천원"
              value={get('thyrPxcndAmt')}
              onChange={set('thyrPxcndAmt')}
            />
            <AmountField
              label="당년도 기성지급액"
              unit="천원"
              value={get('thyrPxcndGiveAmt')}
              onChange={set('thyrPxcndGiveAmt')}
            />
            <AmountField
              label="총계약금액"
              unit="천원"
              value={get('tctrtAmt')}
              onChange={set('tctrtAmt')}
            />
            <AmountField
              label="당년도 계약액 또는 이월금액"
              unit="천원"
              value={get('thyrCtrtAmt')}
              onChange={set('thyrCtrtAmt')}
            />
            <AmountField
              label="전년도까지 누계기성액"
              unit="천원"
              value={get('prvyrPxcndActotAmt')}
              onChange={set('prvyrPxcndActotAmt')}
            />
            <AmountField
              label="전년도까지 누계지급액"
              unit="천원"
              value={get('prvyrGiveActotAmt')}
              onChange={set('prvyrGiveActotAmt')}
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
PrfmncPrdocReg_UnitH.displayName = 'PrfmncPrdocReg_UnitH'
