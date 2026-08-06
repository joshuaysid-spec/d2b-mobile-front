// 입찰공고 상세 - '계약특수조건' 탭 (MUI-BD-01-T04(구 M10 — v1.83 재편), 설계서 slide46(화면구성)·slide47(데이터영역)).
// 섹션 2개(설계서 목업 타이틀 둘 다 '계약특수조건'): ① 계약특수조건 항목 정보 테이블 ② 전문(번호별, 축약 없이 전체 표시 — 없으면 '(없음)').
// 계약방법 '경쟁입찰' 중 계약특수조건 내용이 있는 경우에만 탭 노출(컨테이너에서 제어). 데이터는 목업(추후 bdService.getDetail).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 계약특수조건정보 데이터영역 (설계서 slide47 — 항목명(영문) 설계서 그대로. 탭 전용이라 인라인)
interface CtrtSpclCondInfo {
  /** 요구년도 (R, 4) */
  drctnYr: string
  /** 판단번호 (R, 38) */
  prcmNo: string
  /** 집행예정월 (R, 6, YYYYMM) */
  bidPrnmntYm: string
  /** 계약예정월 (R, 6, YYYYMM) */
  ctrtPrnmntYm: string
  /** 집행유형 (R, 1, 상위코드:ETC) — 목업은 표시명(ct 목업 선례: bizTpcd '구매') */
  bizTpcd: string
  /** 대표품명 (R, 200) */
  rprsItemNm: string
}

const INFO: CtrtSpclCondInfo = {
  drctnYr: '2026',
  prcmNo: '2024L0M0030',
  bidPrnmntYm: '202512',
  ctrtPrnmntYm: '202601',
  bizTpcd: '제조',
  rprsItemNm: '특수작전용대물타격무인항공기',
}

/** YYYYMM → YYYY-MM 표시. // ⚠️ 잠정 포맷: slide46 목업 라벨은 '집행예정일'(0000-00-00)이나 slide47 데이터영역은 월(YYYYMM) — 데이터영역 기준 */
const formatYm = (ym: string) => (ym.length === 6 ? `${ym.slice(0, 4)}-${ym.slice(4)}` : ym)

// 섹션 1 — 계약특수조건 항목 정보 (slide46 목업: 요구년도 '0000년도' 표기)
const INFO_ROWS: TableRow[] = [
  { label: '요구년도', value: `${INFO.drctnYr}년도` },
  { label: '판단번호', value: INFO.prcmNo },
  { label: '집행예정월', value: formatYm(INFO.bidPrnmntYm) },
  { label: '계약예정월', value: formatYm(INFO.ctrtPrnmntYm) },
  { label: '집행유형', value: INFO.bizTpcd },
  { label: '대표품명', value: INFO.rprsItemNm },
]

// 섹션 2 — 계약특수조건 전문(번호별) 목업. 실제 전문은 축약 없이 전체 표시(slide46 특이사항 2).
const TERMS: { no: number; text: string }[] = [
  { no: 1, text: '계약상대자는 계약문서에서 정하는 바에 따라 계약을 성실히 이행하여야 한다.' },
  { no: 2, text: '계약상대자는 납품 전 소요군 검사를 받아야 하며, 검사 불합격 시 재납품하여야 한다.' },
  { no: 3, text: '계약상대자는 품질보증요구사항(QAR)을 준수하여야 한다.' },
  { no: 4, text: '대금은 검사·검수 완료 후 관련 규정에 따라 지급한다.' },
  { no: 5, text: '계약상대자의 귀책사유로 인한 지체 시 지체상금을 부과한다.' },
  { no: 6, text: '기타 본 계약에 명시되지 않은 사항은 관계 법령 및 정부 입찰·계약 집행기준에 따른다.' },
]

export function BidPbancDtl_Tacpg04() {
  return (
    <>
      {/* 두 섹션 타이틀 모두 '계약특수조건' — 설계서 slide46 목업 그대로 */}
      <Accordion type="multiple" defaultValue={['info', 'terms']} className="w-full">
        <AccordionSection value="info" title="계약특수조건" borderTop={false}>
          <Table rows={INFO_ROWS} />
        </AccordionSection>
        <AccordionSection value="terms" title="계약특수조건">
          {TERMS.length === 0 ? (
            // 계약특수조건 항목 없음 표시 (slide46 특이사항 2)
            <p className="text-krds-body-md text-krds-text-ink">(없음)</p>
          ) : (
            <ol className="flex flex-col gap-krds-5">
              {TERMS.map((t) => (
                <li key={t.no} className="flex gap-2 text-krds-body-md text-krds-text-ink">
                  <span className="shrink-0 font-bold">{t.no}.</span>
                  <span>{t.text}</span>
                </li>
              ))}
            </ol>
          )}
        </AccordionSection>
      </Accordion>
    </>
  )
}
BidPbancDtl_Tacpg04.displayName = 'BidPbancDtl_Tacpg04'
