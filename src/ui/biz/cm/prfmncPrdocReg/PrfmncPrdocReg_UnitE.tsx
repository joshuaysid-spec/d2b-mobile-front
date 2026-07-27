// 실적정보(unitE) — MUI-CM-04-T16. 계약구분 부대+시설공사. 확인 탭(PrfmncPrdocDtl_UnitE, T06)의 입력판.
// 제출유형 "6. 정보통신공사 실적증명서 [정보통신공사업법 시행에 관한 규정/전기공제조합]".
// 설계서 00.공통 v0.84 slide304(화면) · 항목 설명 slide279(1.18 신청인·1.19 공사내역).
// 항목명(키)은 설계서 영문 항목명 그대로. 금액 단위 천원. 필수 * 는 등록번호(slide304).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { DateInput } from '@/ui/common/composites/DateInput'
import {
  AmountField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

export function PrfmncPrdocReg_UnitE() {
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

      <Accordion type="multiple" defaultValue={['aplcnt', 'cstrn']}>
        {/* 신청인 — 상호/대표자/영업소재지는 불러온 정보(읽기전용), 등록번호만 입력 */}
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
              label="등록번호"
              required
              value={get('lcnsNoVl')}
              onChange={set('lcnsNoVl')}
            />
          </div>
        </AccordionSection>

        {/* 공사내역 — 금액 단위 천원 */}
        <AccordionSection value="cstrn" title="공사내역">
          <div className="flex flex-col gap-krds-8">
            <TextField label="공사명" value={get('cstrnNm')} onChange={set('cstrnNm')} />
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
              label="전년도 이월공사액"
              unit="천원"
              value={get('prvyrPxcndActotAmt')}
              onChange={set('prvyrPxcndActotAmt')}
            />
            <AmountField
              label="당년도 계약액"
              unit="천원"
              value={get('tctrtAmt')}
              onChange={set('tctrtAmt')}
            />
            <AmountField
              label="당년도 기성액"
              unit="천원"
              value={get('thyrPxcndAmt')}
              onChange={set('thyrPxcndAmt')}
            />
            <AmountField
              label="당년도 미기성액"
              unit="천원"
              value={get('prvyrGiveActotAmt')}
              onChange={set('prvyrGiveActotAmt')}
            />
            <AmountField
              label="하도급금액"
              unit="천원"
              value={get('thyrPxcndGiveAmt')}
              onChange={set('thyrPxcndGiveAmt')}
            />
          </div>
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocReg_UnitE.displayName = 'PrfmncPrdocReg_UnitE'
