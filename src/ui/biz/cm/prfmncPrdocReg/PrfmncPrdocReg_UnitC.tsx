// 실적정보(unitC) — MUI-CM-04-T14. 계약구분 부대+시설공사. 확인 탭(PrfmncPrdocDtl_UnitC, T04)의 입력판.
// 제출유형 "3. 건설공사기성실적증명(신청)서_세부공종(종합) [건설산업기본법 시행규칙/국토해양부]".
// 설계서 00.공통 v0.84 slide301~302(화면) · 항목 설명 slide276~277(1.13 신청인·1.14 공사내역).
// 항목명(키)은 설계서 영문 항목명 그대로. 금액 단위는 설계서 표기 백만원. 검증 규칙 미정 → 입력 UI 만
// (필수 * 는 업종및등록번호 — slide301). 값 수집은 저장/신청(부모 footer) 스텁.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { DateInput } from '@/ui/common/composites/DateInput'
import { YearInput } from '@/ui/common/composites/YearInput'
import {
  AmountField,
  TextAreaField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

export function PrfmncPrdocReg_UnitC() {
  // 초기값 — slide301 표시값(불러온 정보 기반). API 연동 시 조회값으로 교체.
  const { get, set } = useFieldRecord({
    bzentyNm: 'A 업체',
    rprsvNm: '홍길동',
    salsLctnAddr: '서울특별시 종로구…',
    cstrnNm: '국방전자조달고도화',
  })

  return (
    <div className="flex w-full flex-col pb-2">
      <p className="px-4 pt-4 text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>

      <Accordion type="multiple" defaultValue={['aplcnt', 'cstrn', 'cost']}>
        {/* 신청인 — 상호/대표자/영업소재지는 불러온 정보(읽기전용), 업종및등록번호만 입력 */}
        <AccordionSection value="aplcnt" title="신청인" borderTop={false}>
          <div className="flex flex-col gap-krds-8">
            <TextField label="상호" value={get('bzentyNm')} onChange={set('bzentyNm')} disabled />
            <TextField label="대표자" value={get('rprsvNm')} onChange={set('rprsvNm')} disabled />
            <TextField
              label="영업소재지"
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
              unit="백만원"
              value={get('tcstrnAmt')}
              onChange={set('tcstrnAmt')}
            />
            <TextField
              label="현장 소재지 (번지까지 기재)"
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
              label="세부공종(종합)"
              value={get('snthsDtlCnstpNm')}
              onChange={set('snthsDtlCnstpNm')}
            />
            <YearInput
              label="실적년도"
              value={get('prfmncYr')}
              onChange={set('prfmncYr')}
              placeholder="선택해주세요."
            />
          </div>
        </AccordionSection>

        {/* 비용정보 — 금액 단위 백만원 */}
        <AccordionSection value="cost" title="비용정보">
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
              label="준공(예정)연월"
              value={get('cmcnYmd')}
              onChange={set('cmcnYmd')}
              placeholder="선택해주세요."
            />
            <AmountField
              label="당년도 기성액"
              unit="백만원"
              value={get('thyrPxcndAmt')}
              onChange={set('thyrPxcndAmt')}
            />
            <AmountField
              label="당년도 기성지급액"
              unit="백만원"
              value={get('thyrPxcndGiveAmt')}
              onChange={set('thyrPxcndGiveAmt')}
            />
            <AmountField
              label="총 계약금액"
              unit="백만원"
              value={get('tctrtAmt')}
              onChange={set('tctrtAmt')}
            />
            <AmountField
              label="당년도 계약액 또는 이월금액"
              unit="백만원"
              value={get('thyrCtrtAmt')}
              onChange={set('thyrCtrtAmt')}
            />
            <AmountField
              label="당년도 발주자공급자재액"
              unit="백만원"
              value={get('thyrOdrSplyMtrlAmt')}
              onChange={set('thyrOdrSplyMtrlAmt')}
            />
            <AmountField
              label="전년도까지 누계기성액"
              unit="백만원"
              value={get('prvyrPxcndActotAmt')}
              onChange={set('prvyrPxcndActotAmt')}
            />
            <AmountField
              label="전년도까지 누계지급액"
              unit="백만원"
              value={get('prvyrGiveActotAmt')}
              onChange={set('prvyrGiveActotAmt')}
            />
            <AmountField
              label="전년도까지 누계관급자재액"
              unit="백만원"
              value={get('prvyrGvspMtrlActotAmt')}
              onChange={set('prvyrGvspMtrlActotAmt')}
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
PrfmncPrdocReg_UnitC.displayName = 'PrfmncPrdocReg_UnitC'
