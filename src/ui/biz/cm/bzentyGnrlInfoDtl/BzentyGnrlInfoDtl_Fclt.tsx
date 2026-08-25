// 업체정보 상세 - '시설' 탭 콘텐츠 (MUI-CM-01-T03, 설계서 slide124~125 / 문서 P123~124).
// 아코디언(시설정보·시설면허정보·주력분야) with 테이블 + 시공능력평가액 안내(Infobox).
//   - 시설면허정보(dl_bzentyFcltLcnsList)·주력분야(dl_bzentyFcltMfrcFldList)는 목록형 → 항목별 Table 반복.
// 데이터는 목업(설계서 데이터영역 항목명·형식 그대로) — 추후 API(cmService.selectBzentyFcltInfo)로 대체.
import type { MockBzentyFcltInfo, MockBzentyFcltLcns, MockBzentyFcltMfrcFld } from '@/types/mock/cm'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 시설정보 (dm_bzentyFcltInfo) — 설계서 slide124/125 예시값 ────────────────
const FCLT_INFO: MockBzentyFcltInfo = {
  bzstatCdNm: '제조',
  lcofcTelno: '02-1234-5678',
}

// ── 시설면허정보 (dl_bzentyFcltLcnsList) — 설계서 slide124/125 예시값 ─────────
const LCNS_LIST: MockBzentyFcltLcns[] = [
  {
    cnstpCdNm: '소방공사업',
    cnstpCd: '0001',
    lcnsNo: '1000',
    cnstAbltEvlAmt: '1,000,000 원',
    lcnsAcqsYmd: '1999-12-31',
    lcnsExpryYmd: '2000-01-01',
    bzentyStcd: '정상',
  },
]

// ── 주력분야 (dl_bzentyFcltMfrcFldList) — 설계서 slide124/125 예시값 ──────────
const MFRC_LIST: MockBzentyFcltMfrcFld[] = [
  {
    cnstpCdNm: '총탄',
    cnstpCd: '60',
    mfrcFldNm: '이불',
    mfrcFldCd: '001',
    mfrcFldRmvYmd: '-',
    cnstAbltEvlAmt: '1,000,000 원',
    evlAmtCrtrYr: '2025',
    mfrcFldDsgnYmd: '2020-01-01',
    mdfcnDt: '2025-01-01 12:00',
    excptnMttrCd: '적격',
  },
]

function lcnsRows(d: MockBzentyFcltLcns): TableRow[] {
  return [
    { label: '공종[업종코드]', value: `${d.cnstpCdNm} [${d.cnstpCd}]` },
    { label: '면허번호', value: d.lcnsNo },
    { label: '시공능력 공시액', value: d.cnstAbltEvlAmt, type: 'number' },
    { label: '면허유효기간', value: `${d.lcnsAcqsYmd} ~ ${d.lcnsExpryYmd}` },
    { label: '폐업여부', value: d.bzentyStcd },
  ]
}

function mfrcRows(d: MockBzentyFcltMfrcFld): TableRow[] {
  return [
    { label: '공종명[업종코드]', value: `${d.cnstpCdNm} [${d.cnstpCd}]` },
    { label: '주력분야[코드]', value: `${d.mfrcFldNm} [${d.mfrcFldCd}]` },
    { label: '해제일', value: d.mfrcFldRmvYmd },
    { label: '시공능력 공시액', value: d.cnstAbltEvlAmt, type: 'number' },
    { label: '평가액 기준년도', value: d.evlAmtCrtrYr },
    { label: '지정일자', value: d.mfrcFldDsgnYmd },
    { label: '갱신일시', value: d.mdfcnDt },
    { label: '입찰제한대상', value: d.excptnMttrCd },
  ]
}

export function BzentyGnrlInfoDtl_Fclt() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['info', 'lcns', 'mfrc']} className="w-full">
        <AccordionSection value="info" title="시설정보" borderTop={false}>
          <Table
            rows={[
              { label: '대표업태', value: FCLT_INFO.bzstatCdNm },
              { label: '연락소(전화번호)', value: FCLT_INFO.lcofcTelno },
            ]}
          />
        </AccordionSection>

        <AccordionSection value="lcns" title="시설면허정보">
          <div className="flex flex-col gap-krds-8">
            {LCNS_LIST.map((l) => (
              <Table key={`${l.cnstpCd}-${l.lcnsNo}`} rows={lcnsRows(l)} />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection value="mfrc" title="주력분야">
          <div className="flex flex-col gap-krds-8">
            {MFRC_LIST.map((m) => (
              <Table key={`${m.cnstpCd}-${m.mfrcFldCd}`} rows={mfrcRows(m)} />
            ))}
          </div>
        </AccordionSection>
      </Accordion>

      {/* 시공능력평가액 안내 (설계서 slide124) — 하단 여백도 좌우(16px)와 동일하게. */}
      <div className="px-4 py-4">
        <Infobox title="안내사항" collapsible={false}>
          시공능력평가액은 해당협회에 등록된 금액과 동일하지 않을 수 있습니다.
        </Infobox>
      </div>
    </>
  )
}
BzentyGnrlInfoDtl_Fclt.displayName = 'BzentyGnrlInfoDtl_Fclt'
