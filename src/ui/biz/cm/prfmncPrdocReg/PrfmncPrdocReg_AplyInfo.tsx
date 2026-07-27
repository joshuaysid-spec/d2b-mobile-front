// 실적정보 — 부대+비시설공사(T21, MUI-CM-04-T21). 확인 탭(PrfmncPrdocDtl_AplyInfo, T11)의 입력판.
// 설계서 00.공통 v0.84 slide314(화면) · 항목 설명 slide290(1.34 추가사항 dm_prfmncPrdocAplyAddMttrInfo).
// 항목명(키)은 설계서 영문 그대로. 금액 단위 원. 필수 * 는 실적년도·실적구분·실적금액(slide314).
//
// ⚠️ 노출항목 활성/비활성 규칙(slide314, "노차장님 확인 필요"로 설계 미확정 — API/상세설계 시 반영):
//   물품/군수품: 단위·규모·비고=readonly, 규격·납품일자·단위·수량=active, 실적구분 value 3 disable
//   그 외: 실적구분·단위=active, 규격·납품일자·단위·수량=readonly, 실적구분 value 1,2 disable
//   → 현재는 조건 분기 없이 전 항목 입력 가능(목업). 값 수집은 저장/신청(부모 footer) 스텁.
import { DateInput } from '@/ui/common/composites/DateInput'
import { YearInput } from '@/ui/common/composites/YearInput'
import {
  AmountField,
  TextField,
  useFieldRecord,
} from '@/ui/biz/cm/prfmncPrdocReg/PrfmncPrdocRegFields'

export function PrfmncPrdocReg_AplyInfo() {
  const { get, set } = useFieldRecord()

  return (
    <div className="flex w-full flex-col gap-krds-8 p-4 pb-2">
      <p className="text-[17px] leading-normal text-krds-text-ink">
        실적 정보를 입력해주시길 바랍니다.
      </p>
      <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">추가사항</h3>

      {/* 실적년도 (시작 ~ 종료) */}
      <div className="flex items-end gap-krds-3">
        <YearInput
          className="flex-1"
          label="실적년도"
          required
          value={get('prfmncYr1')}
          onChange={set('prfmncYr1')}
          placeholder="선택"
        />
        <span className="pb-3 text-[17px] text-krds-text-muted">~</span>
        <YearInput
          className="flex-1"
          label={<span className="sr-only">실적년도 종료</span>}
          value={get('prfmncYr2')}
          onChange={set('prfmncYr2')}
          placeholder="선택"
        />
      </div>

      <TextField
        label="실적구분"
        required
        value={get('prfmncSeCd')}
        onChange={set('prfmncSeCd')}
      />
      <AmountField
        label="실적비율(%)"
        unit="%"
        value={get('PrfmncDmndRt')}
        onChange={set('PrfmncDmndRt')}
      />
      <AmountField
        label="실적금액"
        required
        unit="원"
        value={get('PrfmncDmndAmt')}
        onChange={set('PrfmncDmndAmt')}
      />
      <TextField label="규격 (품질, 성능통)" value={get('spcfct')} onChange={set('spcfct')} />
      <DateInput
        label="납품일자"
        value={get('dlvgdsYmd')}
        onChange={set('dlvgdsYmd')}
        placeholder="선택해주세요."
      />
      <TextField label="단위" value={get('unitNm')} onChange={set('unitNm')} />
      <TextField label="수량" value={get('prfmncQty')} onChange={set('prfmncQty')} />
      <TextField label="규모" value={get('scl')} onChange={set('scl')} />
      <TextField
        label="용역범위 및 기준 (면적, 금액(원) 등)"
        value={get('lbsvcScp')}
        onChange={set('lbsvcScp')}
      />
      <TextField label="비고" value={get('etcCn')} onChange={set('etcCn')} />
    </div>
  )
}
PrfmncPrdocReg_AplyInfo.displayName = 'PrfmncPrdocReg_AplyInfo'
