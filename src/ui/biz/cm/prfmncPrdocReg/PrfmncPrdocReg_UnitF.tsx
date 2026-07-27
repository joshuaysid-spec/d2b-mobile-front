// 실적정보(unitF) — MUI-CM-04-T17. 계약구분 부대+시설공사. 확인 탭(PrfmncPrdocDtl_UnitF, T07)의 입력판.
// 제출유형 "7. 소방시설공사 실적증명서 [소방시설공사업법 시행에 관한 규정/소방시설협회]".
// 설계서 00.공통 v0.84 slide305~306(화면) · 항목 설명 slide280(1.20 신청인·1.21 공사내역)·
//   slide281(1.22 공사실적 금액)·slide282(1.23 복합공종 실적내용). 항목명(키)은 설계서 영문 그대로.
// 금액 단위 천원. 복합공종 필드는 소방 공사내역과 항목명(cstrnNm 등)이 겹쳐 record 키만 mlt_ 접두로 구분.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { DateInput } from '@/ui/common/composites/DateInput'
import {
  AmountField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

export function PrfmncPrdocReg_UnitF() {
  const { get, set } = useFieldRecord({
    bzentyNm: 'A 업체',
    rprsvNm: '홍길동',
    entlno: '02-1234-5678',
    lctnAddr: '서울특별시 종로구…',
  })

  return (
    <div className="flex w-full flex-col pb-2">
      <p className="px-4 pt-4 text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>

      <Accordion type="multiple" defaultValue={['aplcnt', 'cstrn', 'prfmnc', 'mlt']}>
        {/* 신청인 — 불러온 정보(읽기전용) */}
        <AccordionSection value="aplcnt" title="신청인" borderTop={false}>
          <div className="flex flex-col gap-krds-8">
            <TextField label="상호" value={get('bzentyNm')} onChange={set('bzentyNm')} disabled />
            <TextField label="대표자" value={get('rprsvNm')} onChange={set('rprsvNm')} disabled />
            <TextField label="전화번호" value={get('entlno')} onChange={set('entlno')} disabled />
            <TextField
              label="영업소 소재지"
              value={get('lctnAddr')}
              onChange={set('lctnAddr')}
              disabled
            />
          </div>
        </AccordionSection>

        {/* 소방시설 공사내역 */}
        <AccordionSection value="cstrn" title="소방시설 공사내역">
          <div className="flex flex-col gap-krds-8">
            <TextField label="공사명" value={get('cstrnNm')} onChange={set('cstrnNm')} />
            <TextField label="업종" value={get('tpbizNm')} onChange={set('tpbizNm')} />
            <TextField
              label="공사현장"
              value={get('cstrnGrndsAddr')}
              onChange={set('cstrnGrndsAddr')}
            />
            <TextField label="공사지역" value={get('cstrnRgnNm')} onChange={set('cstrnRgnNm')} />
            <TextField label="발주자" value={get('orderInstNm')} onChange={set('orderInstNm')} />
            <TextField label="원도급자" value={get('orgctrNm')} onChange={set('orgctrNm')} />
            <DateInput
              label="계약체결일"
              value={get('ctrtYmd')}
              onChange={set('ctrtYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="착공일"
              value={get('bgncstYmd')}
              onChange={set('bgncstYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="준공일"
              value={get('cmcnYmd')}
              onChange={set('cmcnYmd')}
              placeholder="선택해주세요."
            />
            <TextField label="계약방법" value={get('ctrtMthdNm')} onChange={set('ctrtMthdNm')} />
            <TextField label="도급종류" value={get('ctrcKndNm')} onChange={set('ctrcKndNm')} />
            <TextField label="공사종류" value={get('cstrnKndNm')} onChange={set('cstrnKndNm')} />
          </div>
        </AccordionSection>

        {/* 소방시설 공사실적 금액 (단위: 천원, 부가세포함) */}
        <AccordionSection value="prfmnc" title="소방시설 공사실적 금액 (단위: 천원, 부가세포함)">
          <div className="flex flex-col gap-krds-8">
            <AmountField
              label="총 도급계약금액"
              unit="천원"
              value={get('ctrcTctrtAmt')}
              onChange={set('ctrcTctrtAmt')}
            />
            <AmountField
              label="해당연도 계약액"
              unit="천원"
              value={get('thyrCtrtAmt')}
              onChange={set('thyrCtrtAmt')}
            />
            <AmountField
              label="해당연도 기성액"
              unit="천원"
              value={get('thyrPxcndAmt')}
              onChange={set('thyrPxcndAmt')}
            />
            <AmountField
              label="해당연도 미기성액"
              unit="천원"
              value={get('thyrNestblAmt')}
              onChange={set('thyrNestblAmt')}
            />
            <AmountField
              label="전년까지의 누계 기성액"
              unit="천원"
              value={get('prvyrPxcndActotAmt')}
              onChange={set('prvyrPxcndActotAmt')}
            />
            <AmountField
              label="전년까지의 미기성액"
              unit="천원"
              value={get('prvyrNestblAmt')}
              onChange={set('prvyrNestblAmt')}
            />
            <TextField
              label="하도급 업체명"
              value={get('sbctrBzentyNm')}
              onChange={set('sbctrBzentyNm')}
            />
            <TextField
              label="하도급 등록번호"
              value={get('sbctrRegNo')}
              onChange={set('sbctrRegNo')}
            />
            <AmountField
              label="하도급 금액"
              unit="천원"
              value={get('sbctrAmt')}
              onChange={set('sbctrAmt')}
            />
          </div>
        </AccordionSection>

        {/* 복합공종(타 공종 포함) 실적내용 (단위: 천원, 부가세포함) — 공사(종)명 1 */}
        <AccordionSection value="mlt" title="복합공종(타 공종 포함) 실적내용">
          <div className="flex flex-col gap-krds-8">
            <TextField
              label="공사(종)명"
              value={get('mlt_cstrnNm')}
              onChange={set('mlt_cstrnNm')}
            />
            <AmountField
              label="도급금액"
              unit="천원"
              value={get('mlt_ctrcAmt')}
              onChange={set('mlt_ctrcAmt')}
            />
            <AmountField
              label="전년까지의 기성액"
              unit="천원"
              value={get('mlt_prvyrPxcndAmt')}
              onChange={set('mlt_prvyrPxcndAmt')}
            />
            <AmountField
              label="금년도 기성액"
              unit="천원"
              value={get('mlt_thsyrPxcndAmt')}
              onChange={set('mlt_thsyrPxcndAmt')}
            />
            <AmountField
              label="미기성액"
              unit="천원"
              value={get('mlt_nestblAmt')}
              onChange={set('mlt_nestblAmt')}
            />
          </div>
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocReg_UnitF.displayName = 'PrfmncPrdocReg_UnitF'
