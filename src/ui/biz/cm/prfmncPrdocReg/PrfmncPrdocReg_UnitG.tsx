// 실적정보(unitG) — MUI-CM-04-T18. 계약구분 부대+시설공사. 확인 탭(PrfmncPrdocDtl_UnitG, T08)의 입력판.
// 제출유형 "8. 전기공사 실적증명서 [전기공사업법 시행에 관한 규정/전기공사협회]".
// 설계서 00.공통 v0.84 slide307~309(화면) · 항목 설명 slide283(1.24 신청인·1.25 전기공사내역)·
//   slide284(1.26 실적금액·1.27 하도급·1.28 시공규모)·slide285(1.29 복합공사종류 실적명세).
// 항목명(키)은 설계서 영문 그대로. 금액 단위 천원. 하도급 2건·복합공사종류 4건(전기/소방/기계설비/그 밖의)
// 은 항목명이 반복돼 record 키만 sub{i}_·mlt{i}_ 접두로 구분. 3개 업체 이상이면 "○○ 외 ○개 업체" 합산(slide308).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { DateInput } from '@/ui/common/composites/DateInput'
import { YearInput } from '@/ui/common/composites/YearInput'
import {
  AmountField,
  TextAreaField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

const SBCTR_SEQ = [0, 1] // 하도급 업체 2건(slide308)
const MLT_KINDS = ['전기공사', '소방공사', '기계설비공사', '그 밖의 공사'] // 복합공사종류 4건(slide309)

export function PrfmncPrdocReg_UnitG() {
  const { get, set } = useFieldRecord({
    bzentyNm: 'A 업체',
    rprsvNm: '홍길동',
    entlno: '02-1234-5678',
    lctnAddr: '서울특별시 종로구…',
    orgctrNm: '김길동 주무관',
    orgctrRegNo: '111111',
  })

  return (
    <div className="flex w-full flex-col pb-2">
      <p className="px-4 pt-4 text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>

      <Accordion type="multiple" defaultValue={['aplcnt', 'cstrn', 'prfmnc', 'sbctr', 'mlt']}>
        {/* 신청인 — 상호/대표자/전화번호/영업소소재지 읽기전용, 등록번호만 입력 */}
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
            <TextField
              label="등록번호"
              required
              value={get('bldrRegNo')}
              onChange={set('bldrRegNo')}
            />
          </div>
        </AccordionSection>

        {/* 전기 공사 내역 */}
        <AccordionSection value="cstrn" title="전기 공사 내역">
          <div className="flex flex-col gap-krds-8">
            <TextField label="공사명" value={get('cstrnNm')} onChange={set('cstrnNm')} />
            <TextField label="공사종류" value={get('cstrnKndNm')} onChange={set('cstrnKndNm')} />
            <TextField
              label="공사현장"
              value={get('cstrnGrndsNm')}
              onChange={set('cstrnGrndsNm')}
            />
            <TextField label="원도급자" value={get('orgctrNm')} onChange={set('orgctrNm')} />
            <TextField label="발주자" value={get('orderIntstNm')} onChange={set('orderIntstNm')} />
            <TextField
              label="등록번호(원도급자)"
              value={get('orgctrRegNo')}
              onChange={set('orgctrRegNo')}
            />
            <DateInput
              label="계약체결일자"
              value={get('ctrtYmd')}
              onChange={set('ctrtYmd')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="착공일자"
              value={get('bgncstYmd8')}
              onChange={set('bgncstYmd8')}
              placeholder="선택해주세요."
            />
            <DateInput
              label="준공일자"
              value={get('cmcnYmd')}
              onChange={set('cmcnYmd')}
              placeholder="선택해주세요."
            />
            <YearInput
              label="실적년도"
              value={get('prfmncYr')}
              onChange={set('prfmncYr')}
              placeholder="선택해주세요."
            />
            <TextField label="계약방법" value={get('ctrtMthdNm')} onChange={set('ctrtMthdNm')} />
            <TextField label="도급종류" value={get('ctrcKndNm')} onChange={set('ctrcKndNm')} />
          </div>
        </AccordionSection>

        {/* 전기공사실적 금액 (단위: 천원, 부가세포함) */}
        <AccordionSection value="prfmnc" title="전기공사실적 금액 (단위: 천원, 부가세포함)">
          <div className="flex flex-col gap-krds-8">
            <AmountField
              label="총 도급계약금액"
              unit="천원"
              value={get('ctrcTctrtAmt')}
              onChange={set('ctrcTctrtAmt')}
            />
            <AmountField
              label="전년도 이월액"
              unit="천원"
              value={get('prvyrCrfwAmt')}
              onChange={set('prvyrCrfwAmt')}
            />
            <AmountField
              label="해당연도 기성액"
              unit="천원"
              value={get('thyrPxcndAmt')}
              onChange={set('thyrPxcndAmt')}
            />
            <AmountField
              label="하도급 금액"
              unit="천원"
              value={get('sbctrAmt')}
              onChange={set('sbctrAmt')}
            />
            <AmountField
              label="미기성액"
              unit="천원"
              value={get('thyrNestblAmt')}
              onChange={set('thyrNestblAmt')}
            />
            <AmountField
              label="관급자재액"
              unit="천원"
              value={get('gvspMtrlAmt')}
              onChange={set('gvspMtrlAmt')}
            />
            <AmountField
              label="전년까지의 누계 기성액"
              unit="천원"
              value={get('prvyrPxcndActotAmt')}
              onChange={set('prvyrPxcndActotAmt')}
            />
            <AmountField
              label="기성액(다른공사포함)"
              unit="천원"
              value={get('etcCstrnKndPxcndAmt')}
              onChange={set('etcCstrnKndPxcndAmt')}
            />
            <AmountField
              label="계약액(추가 또는 변경분)"
              unit="천원"
              value={get('thyrCtrtAmt')}
              onChange={set('thyrCtrtAmt')}
            />
          </div>
        </AccordionSection>

        {/* 하도급내역(원도급자가 작성) — 2건 */}
        <AccordionSection value="sbctr" title="하도급내역 (원도급자가 작성)">
          {SBCTR_SEQ.map((i) => (
            <div
              key={`sbctr-${i}`}
              className={
                i > 0
                  ? 'flex flex-col gap-krds-8 border-t border-krds-border-divider pt-krds-8'
                  : 'flex flex-col gap-krds-8'
              }
            >
              <TextField
                label={`하도급업체명 ${i + 1}`}
                value={get(`sub${i}_sbctrBzentyNm`)}
                onChange={set(`sub${i}_sbctrBzentyNm`)}
              />
              <AmountField
                label="하도금액"
                unit="천원"
                value={get(`sub${i}_sbctrAmt`)}
                onChange={set(`sub${i}_sbctrAmt`)}
              />
              <TextField
                label="등록번호"
                value={get(`sub${i}_sbctrRegNo`)}
                onChange={set(`sub${i}_sbctrRegNo`)}
              />
              <TextField
                label="대표자"
                value={get(`sub${i}_sbctrRprsvNm`)}
                onChange={set(`sub${i}_sbctrRprsvNm`)}
              />
            </div>
          ))}
        </AccordionSection>

        {/* 복합공사종류(다른 공사 종류 포함) 실적 명세 (단위: 천원, 부가세포함) — 4건 */}
        <AccordionSection value="mlt" title="복합공사종류 실적 명세 (단위: 천원, 부가세포함)">
          {MLT_KINDS.map((kind, i) => (
            <div
              key={`mlt-${i}`}
              className={
                i > 0
                  ? 'flex flex-col gap-krds-8 border-t border-krds-border-divider pt-krds-8'
                  : 'flex flex-col gap-krds-8'
              }
            >
              <TextField
                label="공사(종)명"
                value={get(`mlt${i}_cstrnKndNm`)}
                onChange={set(`mlt${i}_cstrnKndNm`)}
                placeholder={kind}
              />
              <AmountField
                label="계약액"
                unit="천원"
                value={get(`mlt${i}_ctrtAmt`)}
                onChange={set(`mlt${i}_ctrtAmt`)}
              />
              <DateInput
                label="착공연월일"
                value={get(`mlt${i}_bgncstYmd`)}
                onChange={set(`mlt${i}_bgncstYmd`)}
                placeholder="선택해주세요."
              />
              <DateInput
                label="준공연월일"
                value={get(`mlt${i}_cmcnYmd`)}
                onChange={set(`mlt${i}_cmcnYmd`)}
                placeholder="선택해주세요."
              />
              <AmountField
                label="지난연도 기성액"
                unit="천원"
                value={get(`mlt${i}_prvyrPxcndAmt`)}
                onChange={set(`mlt${i}_prvyrPxcndAmt`)}
              />
              <AmountField
                label="해당연도 기성액"
                unit="천원"
                value={get(`mlt${i}_thyrPxcndAmt`)}
                onChange={set(`mlt${i}_thyrPxcndAmt`)}
              />
              <AmountField
                label="하도급금액"
                unit="천원"
                value={get(`mlt${i}_sbctrAmt`)}
                onChange={set(`mlt${i}_sbctrAmt`)}
              />
              <AmountField
                label="미기성금액"
                unit="천원"
                value={get(`mlt${i}_nestblAmt`)}
                onChange={set(`mlt${i}_nestblAmt`)}
              />
            </div>
          ))}
        </AccordionSection>
      </Accordion>

      {/* 시공규모 — 텍스트 입력 */}
      <div className="px-krds-8 py-krds-7">
        <TextAreaField
          label="시공규모"
          value={get('cnstSclExpln')}
          onChange={set('cnstSclExpln')}
        />
      </div>
    </div>
  )
}
PrfmncPrdocReg_UnitG.displayName = 'PrfmncPrdocReg_UnitG'
