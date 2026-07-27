// 실적증명서 확인(상세) — 신청정보 탭 · unitH(T09, MUI-CM-04-T09). 계약구분 부대+시설공사.
// 제출유형 "9. 건설공사기성실적증명(신청)서_세부공종(전문) [건설산업기본법 시행규칙/국토해양부]".
// 설계서 00.공통 v0.84 slide267~268(화면) · 항목 설명 slide288(1.30 신청인·1.31 공사내역).
// 표/필드는 데이터 구동. 제출유형에 따라 하단 표시 정보 변경(신청도 동일) — API 연동 시 반영.
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PrfmncPrdocAplcntInfo, PrfmncPrdocCstrnDsctnInfoH } from '@/types/cm'

const twon = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 천원`)
const SBMSN_TYPE =
  '9. 건설공사기성실적증명(신청)서_세부공종(전문) [건설산업기본법 시행규칙/국토해양부]'

// ── 목업 (설계서 표시값 그대로 — API 연동 시 교체) ───────────────────────────
const APLCNT: PrfmncPrdocAplcntInfo = {
  bzentyNm: 'A 업체',
  rprsvNm: '홍길동',
  salsLctnAddr: '서울특별시 종로구…',
  lcnsNoVl: '11111',
}

const CSTRN: PrfmncPrdocCstrnDsctnInfoH = {
  cstrnNm: '공사 명칭 표시 영역',
  tcstrnAmt: 100000,
  grndsLctnAddr: '경기도 과천시…',
  cstrnTypeNm: '신설공사',
  lcpmtInstNm: '방위사업청',
  mfrcFldNm: '무기',
  lcpmtYmd: '2010-01-01',
  telgmDtlCnstpNm: '공항',
  prfmncYr: '2023',
  ctrtYmd: '2020-01',
  bgncstYmd: '2020-01',
  cmcnYmd: '2020-01',
  thyrPxcndAmt: 1000,
  thyrPxcndGiveAmt: 1000,
  tctrtAmt: 1000,
  thyrCtrtAmt: 1000,
  prvyrPxcndActotAmt: 1000,
  prvyrGiveActotAmt: 1000,
}

// 그 밖의 사항 — 화면(slide268)엔 표시되나 항목 설명 1.31 미정의 → 임시 표시. TODO(설계서 영문ID 미확인).
const ETC_MTTR = '내용 표시 영역은 내용에 맞춰 높이를 조정하여 표시'

const APLY_ROWS: TableRow[] = [
  {
    label: '제출유형',
    value: <span className="whitespace-pre-wrap">{SBMSN_TYPE}</span>,
    type: 'combination',
  },
  { label: '신청인 연락처', value: '02-1234-5678' },
  { label: '제출처', value: '방위사업청' },
  { label: '발급수량', value: '1부' },
]

const APLCNT_ROWS: TableRow[] = [
  { label: '상호', value: APLCNT.bzentyNm ?? '-' },
  { label: '대표자', value: APLCNT.rprsvNm ?? '-' },
  { label: '영업소 소재지', value: APLCNT.salsLctnAddr ?? '-' },
  { label: '업종 및 등록번호', value: APLCNT.lcnsNoVl ?? '-' },
]

const CSTRN_ROWS: TableRow[] = [
  { label: '공사명', value: CSTRN.cstrnNm ?? '-' },
  { label: '총공사금액', value: twon(CSTRN.tcstrnAmt), type: 'number' },
  { label: '현장소재지', value: CSTRN.grndsLctnAddr ?? '-' },
  { label: '공사유형', value: CSTRN.cstrnTypeNm ?? '-' },
  { label: '인 허가 기관', value: CSTRN.lcpmtInstNm ?? '-' },
  { label: '주력분야', value: CSTRN.mfrcFldNm ?? '-' },
  { label: '인 허가 년월일', value: CSTRN.lcpmtYmd ?? '-' },
  { label: '세부공종(전문)', value: CSTRN.telgmDtlCnstpNm ?? '-' },
  { label: '실적년도', value: CSTRN.prfmncYr ?? '-' },
]

// 복합공사종류(다른 공사 종류 포함) 실적 명세(단위: 천원, 부가세포함)
const COST_ROWS: TableRow[] = [
  { label: '계약연월', value: CSTRN.ctrtYmd ?? '-' },
  { label: '착공연월', value: CSTRN.bgncstYmd ?? '-' },
  { label: '준공연월', value: CSTRN.cmcnYmd ?? '-' },
  { label: '당년도 기성액', value: twon(CSTRN.thyrPxcndAmt), type: 'number' },
  { label: '당년도 기성지급액', value: twon(CSTRN.thyrPxcndGiveAmt), type: 'number' },
  { label: '총계약금액', value: twon(CSTRN.tctrtAmt), type: 'number' },
  { label: '당년도 계약액 또는 이월금액', value: twon(CSTRN.thyrCtrtAmt), type: 'number' },
  { label: '전년도까지 누계기성액', value: twon(CSTRN.prvyrPxcndActotAmt), type: 'number' },
  { label: '전년도까지 누계지급액', value: twon(CSTRN.prvyrGiveActotAmt), type: 'number' },
]

export function PrfmncPrdocDtl_UnitH() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['aply', 'aplcnt', 'cstrn', 'cost']}>
        <AccordionSection value="aply" title="신청정보" borderTop={false}>
          <Table rows={APLY_ROWS} />
        </AccordionSection>
        <AccordionSection value="aplcnt" title="신청인">
          <Table rows={APLCNT_ROWS} />
        </AccordionSection>
        <AccordionSection value="cstrn" title="공사내역">
          <Table rows={CSTRN_ROWS} />
        </AccordionSection>
        <AccordionSection value="cost" title="복합공사종류 실적 명세 (단위: 천원, 부가세포함)">
          <Table rows={COST_ROWS} />
        </AccordionSection>
      </Accordion>

      {/* 그 밖의 사항 — 내용에 맞춰 높이 조정(정보 없으면 숨김) */}
      {ETC_MTTR && (
        <div className="flex flex-col gap-2 border-t border-krds-border-divider px-krds-8 py-krds-7">
          <p className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
            그 밖의 사항 (공사의 규모 공법, 공동 도급내역 등)
          </p>
          <div className="whitespace-pre-wrap rounded-krds-8 border border-krds-border-field px-krds-7 py-krds-5 text-[17px] leading-normal text-krds-text-ink">
            {ETC_MTTR}
          </div>
        </div>
      )}
    </div>
  )
}
PrfmncPrdocDtl_UnitH.displayName = 'PrfmncPrdocDtl_UnitH'
