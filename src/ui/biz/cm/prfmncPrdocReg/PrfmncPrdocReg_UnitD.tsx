// 실적정보(unitD) — MUI-CM-04-T15. 계약구분 부대+시설공사. 확인 탭(PrfmncPrdocDtl_UnitD, T05)의 입력판.
// 제출유형 "4. 건설폐기물처리용역이행 실적증명서 [건설폐기물처리용역 적격업체 평가기준/환경부]".
// 설계서 00.공통 v0.84 slide303~304(화면) · 항목 설명 slide278(1.15 신청인·1.16 수집운반·1.17 중간처리).
// 항목명(키)은 설계서 영문 항목명 그대로. 금액 단위 천원. 필수 * 는 허가번호·증명서용도(slide303).
// 설계서상 수집/운반·중간처리 실적 표 각 3건(연도 선택) — 목업/입력 UI 는 대표 1건(API 연동 시 확장).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { DateInput } from '@/ui/common/composites/DateInput'
import {
  AmountField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

export function PrfmncPrdocReg_UnitD() {
  const { get, set } = useFieldRecord({
    bzentyNm: 'A 업체',
    rprsvNm: '홍길동',
    lctnAddr: '서울특별시 종로구…',
  })

  return (
    <div className="flex w-full flex-col pb-2">
      <p className="px-4 pt-4 text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>

      <Accordion type="multiple" defaultValue={['aplcnt', 'clct', 'mdprcs']}>
        {/* 신청인 — 상호/대표자/소재지는 불러온 정보(읽기전용), 허가번호·증명서용도만 입력 */}
        <AccordionSection value="aplcnt" title="신청인" borderTop={false}>
          <div className="flex flex-col gap-krds-8">
            <TextField label="상호" value={get('bzentyNm')} onChange={set('bzentyNm')} disabled />
            <TextField
              label="허가번호"
              required
              value={get('lcnsNoVl')}
              onChange={set('lcnsNoVl')}
            />
            <TextField label="대표자" value={get('rprsvNm')} onChange={set('rprsvNm')} disabled />
            <TextField label="소재지" value={get('lctnAddr')} onChange={set('lctnAddr')} disabled />
            <TextField
              label="증명서 용도"
              required
              value={get('prdocUsgCn')}
              onChange={set('prdocUsgCn')}
            />
          </div>
        </AccordionSection>

        {/* 건설폐기물 수집/운반용역 이행실적 */}
        <AccordionSection value="clct" title="건설폐기물 수집/운반용역 이행실적">
          <div className="flex flex-col gap-krds-8">
            <TextField
              label="용역명"
              value={get('clctCnvncLbsvcNm')}
              onChange={set('clctCnvncLbsvcNm')}
            />
            <DateInput
              label="계약일자"
              value={get('clctCnvncCtrtYmd')}
              onChange={set('clctCnvncCtrtYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="계약기간"
              value={get('clctCnvncCtrtBgngYmd')}
              onChange={set('clctCnvncCtrtBgngYmd')}
              placeholder="선택해주세요."
            />
            <TextField
              label="건설폐기물의 종류"
              value={get('clctCnvncCndspKndNm')}
              onChange={set('clctCnvncCndspKndNm')}
            />
            <AmountField
              label="위탁량(톤)"
              unit="톤"
              value={get('clctCnvncCnsgnQtyCn')}
              onChange={set('clctCnvncCnsgnQtyCn')}
            />
            <AmountField
              label="계약금액"
              unit="천원"
              value={get('clctCnvncCtrtAmt')}
              onChange={set('clctCnvncCtrtAmt')}
            />
            <AmountField
              label="기성실적"
              unit="천원"
              value={get('clctCnvncPxcndPrfmncAmt')}
              onChange={set('clctCnvncPxcndPrfmncAmt')}
            />
            <TextField
              label="비고"
              value={get('clctCnvncRmrkCn')}
              onChange={set('clctCnvncRmrkCn')}
            />
          </div>
        </AccordionSection>

        {/* 건설폐기물 중간처리용역 이행실적 */}
        <AccordionSection value="mdprcs" title="건설폐기물 중간처리용역 이행실적">
          <div className="flex flex-col gap-krds-8">
            <TextField
              label="용역명"
              value={get('mdPrcsLbsvcNm')}
              onChange={set('mdPrcsLbsvcNm')}
            />
            <DateInput
              label="계약일자"
              value={get('mdPrcsCtrtYmd')}
              onChange={set('mdPrcsCtrtYmd')}
              placeholder="선택해주세요."
            />
            <TextField
              label="계약기간"
              value={get('mdPrcsCtprCn')}
              onChange={set('mdPrcsCtprCn')}
            />
            <TextField
              label="건설폐기물의 종류"
              value={get('mdPrcsCndspKndNm')}
              onChange={set('mdPrcsCndspKndNm')}
            />
            <AmountField
              label="위탁량(톤)"
              unit="톤"
              value={get('mdPrcsCnSgnQtyCn')}
              onChange={set('mdPrcsCnSgnQtyCn')}
            />
            <AmountField
              label="계약금액"
              unit="천원"
              value={get('mdPrcsCtrtAmt')}
              onChange={set('mdPrcsCtrtAmt')}
            />
            <AmountField
              label="기성실적"
              unit="천원"
              value={get('mdPrcsPxCndPrfmncAmt')}
              onChange={set('mdPrcsPxCndPrfmncAmt')}
            />
            <TextField label="비고" value={get('mdPrcsRmrkCn')} onChange={set('mdPrcsRmrkCn')} />
          </div>
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocReg_UnitD.displayName = 'PrfmncPrdocReg_UnitD'
