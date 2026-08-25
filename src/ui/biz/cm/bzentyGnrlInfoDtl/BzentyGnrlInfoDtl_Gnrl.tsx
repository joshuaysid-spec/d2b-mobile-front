// 업체정보 상세 - '업체일반' 탭 콘텐츠 (MUI-CM-01-T01, 설계서 slide116~120 / 문서 P115~119).
// 아코디언(업체일반·상태/부정당·수의계약배제·대표자·입찰대리인) with 테이블.
//   - 상태/부정당·수의계약배제·대표자·입찰대리인은 목록형(dl_*) → 항목별 Table 반복.
//   - 수의계약배제는 기본 3개월 필터/전체(SegmentedControl). 없으면 안내 문구.
// 데이터는 목업(설계서 데이터영역 항목명·형식 그대로) — 추후 API(cmService.selectBzentyGnrlInfo)로 대체.
import { useState } from 'react'

import type {
  BzentyGnrlInfo,
  BzentyStts,
  BzentyRlsVltrnsRstric,
  BzentyRprsv,
  BzentyBidAgt,
} from '@/types/mock/cm'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 업체일반 (dm_bzentyGnrlInfo) — 설계서 slide116/118 예시값 ────────────────
const GNRL_INFO: BzentyGnrlInfo = {
  bzentyCd: '100F',
  bzentyNm: '조달테스트업체',
  bzentyEngNm: 'Jodal',
  brno: '123-45-67890',
  ntnCd: '대한민국',
  opbizYmd: '1999-12-31',
  hmpgAddr: 'www.dapa.go.kr',
  bzentyAddr: '[12345] 서울특별시 종로구 …',
  rprsvTelno: '02-1234-5678',
  rprsvFxno: '02-2345-6789',
  fndnYmd: '1999-12-31',
  crno: '123456-7890123',
  hdofcBrno: '123-45-67890',
  empCnt: '000 명',
  bizCd: ['물품(내자)', '공사', '용역', '일반용역', '외자'],
  entTpcd: '제조',
  entShcd1: '중소기업',
  entShcd2: '원호기업',
  entSeRlvtYr: '1999',
  rgnCd: '11-서울특별시',
  fctryFndnSpcsYn: '해당',
  bplcSecd: '1-본사',
}

// ── 상태/부정당 (dl_bzentySttsList) — 설계서 slide116/118 예시값 ─────────────
const STTS_LIST: BzentyStts[] = [
  {
    bzentyStcd: '03',
    bzentyStNm: '양도,양수',
    crtrYmd: '2022-01-01',
    bgngYmd: '2018-02-05',
    endYmd: '2021-10-17',
    rmrkCn: '양도',
  },
]

// ── 수의계약배제 (dl_bzentyRlsVltrnsRstricList) — 설계서 slide117/119 예시값 ──
const RLS_VLTRNS_LIST: BzentyRlsVltrnsRstric[] = [
  {
    pbancNo: '285608N',
    prcmNo: '5608N',
    pbancNm: '원격관제시스템',
    bdopnYmd: '2025-10-18',
    orderInstNm: '방위사업청',
    exclPrd: '1일',
    exclRsn: '포기합니다.',
    regDt: '2025-09-01',
  },
]

// ── 대표자 (dl_bzentyRprsvList) — 설계서 slide117/119 예시값 ─────────────────
const RPRSV_LIST: BzentyRprsv[] = [
  {
    rprsvYn: '대대표',
    rprsvNm: '홍길동',
    rprsvEngNm: 'Hong kil dong',
    rprsvEmlAddr: 'abcde@dapa.go.kr',
  },
]

// ── 입찰대리인 (dl_bzentyBidAgtList) — 설계서 slide117/120 예시값 ────────────
const BID_AGT_LIST: BzentyBidAgt[] = [
  { agtJbpsNm: '과장', agtNm: '김길동', agtEntlno: '02-1234-5678' },
]

function gnrlRows(d: BzentyGnrlInfo): TableRow[] {
  return [
    { label: '업체코드', value: d.bzentyCd },
    { label: '상호명', value: d.bzentyNm },
    { label: '영문상호명', value: d.bzentyEngNm },
    { label: '사업자등록번호', value: d.brno },
    { label: '국적', value: d.ntnCd },
    { label: '개업일자', value: d.opbizYmd },
    { label: '홈페이지주소', value: d.hmpgAddr },
    { label: '주소', value: d.bzentyAddr },
    { label: '전화번호', value: d.rprsvTelno },
    { label: '팩스번호', value: d.rprsvFxno },
    { label: '법인설립일자', value: d.fndnYmd },
    { label: '법인등록번호', value: d.crno },
    { label: '본사사업자번호', value: d.hdofcBrno },
    { label: '종업원수', value: d.empCnt },
    { label: '사업구분', value: d.bizCd.join(' | ') },
    { label: '제조구분', value: d.entTpcd },
    // 기업구분2(entShcd2)는 값이 있을 때만 함께 표시(설계서 "값이 있을때만 표시").
    { label: '기업구분', value: [d.entShcd1, d.entShcd2].filter(Boolean).join(' ') },
    { label: '기업구분해당년도', value: d.entSeRlvtYr },
    { label: '지역코드', value: d.rgnCd },
    { label: '공장설립특례해당여부', value: d.fctryFndnSpcsYn },
    { label: '본/지사', value: d.bplcSecd },
  ]
}

function sttsRows(d: BzentyStts): TableRow[] {
  return [
    { label: '상태코드', value: d.bzentyStcd },
    { label: '상태명', value: d.bzentyStNm },
    { label: '발생일자', value: d.crtrYmd },
    { label: '시작일자', value: d.bgngYmd },
    { label: '종료일자', value: d.endYmd },
    { label: '비고', value: d.rmrkCn },
  ]
}

function rlsVltrnsRows(d: BzentyRlsVltrnsRstric): TableRow[] {
  return [
    { label: '공고번호', value: d.pbancNo },
    { label: '판단번호', value: d.prcmNo },
    { label: '공고명', value: d.pbancNm },
    { label: '개찰일자', value: d.bdopnYmd },
    { label: '발주기관', value: d.orderInstNm },
    { label: '수의계약 배제기간', value: d.exclPrd },
    { label: '계약포기사유', value: d.exclRsn },
    { label: '등록일자', value: d.regDt },
  ]
}

function rprsvRows(d: BzentyRprsv): TableRow[] {
  return [
    { label: '대표대표자여부', value: d.rprsvYn },
    { label: '대표자명', value: d.rprsvNm },
    { label: '대표자영문', value: d.rprsvEngNm },
    { label: '이메일주소', value: d.rprsvEmlAddr },
  ]
}

function bidAgtRows(d: BzentyBidAgt): TableRow[] {
  return [
    { label: '직위', value: d.agtJbpsNm },
    { label: '성명', value: d.agtNm },
    { label: '전화번호', value: d.agtEntlno },
  ]
}

// 목록형 데이터가 없을 때 안내 문구.
function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 py-2 text-[17px] leading-normal text-krds-text-muted">{children}</p>
  )
}

export function BzentyGnrlInfoDtl_Gnrl() {
  // 수의계약배제 조회 조건 — 기본 3개월(설계서 slide117 "기본 값 : 3개월"), 전체 토글.
  const [exclPeriod, setExclPeriod] = useState<'3m' | 'all'>('3m')
  // 목업이라 실제 필터링은 하지 않고 조회 조건만 표시(추후 API: cmService.selectBzentyRlsVltrnsRstrcList(period)).
  const exclList = RLS_VLTRNS_LIST

  return (
    <Accordion
      type="multiple"
      defaultValue={['gnrl', 'stts', 'excl', 'rprsv', 'agt']}
      className="w-full"
    >
      <AccordionSection value="gnrl" title="업체일반" borderTop={false}>
        <Table rows={gnrlRows(GNRL_INFO)} />
      </AccordionSection>

      <AccordionSection value="stts" title="상태/부정당">
        {STTS_LIST.length > 0 ? (
          <div className="flex flex-col gap-krds-8">
            {STTS_LIST.map((s) => (
              <Table key={`${s.bzentyStcd}-${s.crtrYmd}`} rows={sttsRows(s)} />
            ))}
          </div>
        ) : (
          // ⚠️ 설계서 "상태/부정당 데이터가 없는 경우 표시 정보 데이터 확인이 필요함" — 안내 문구 상세설계 확정 시 교체.
          <EmptyRow>상태/부정당 내역이 없습니다.</EmptyRow>
        )}
      </AccordionSection>

      <AccordionSection value="excl" title="수의계약배제">
        <div className="flex flex-col gap-krds-7">
          <SegmentedControl
            items={[
              { value: '3m', label: '3개월' },
              { value: 'all', label: '전체' },
            ]}
            value={exclPeriod}
            onValueChange={(v) => {
              setExclPeriod(v as '3m' | 'all')
              console.log('[T01] 수의계약배제 조회기간 →', v) // 추후 API: cmService.selectBzentyRlsVltrnsRstrcList
            }}
          />
          {exclList.length > 0 ? (
            <div className="flex flex-col gap-krds-8">
              {exclList.map((e) => (
                <Table key={`${e.pbancNo}-${e.prcmNo}`} rows={rlsVltrnsRows(e)} />
              ))}
            </div>
          ) : (
            <EmptyRow>수의계약에 배제된 사실이 없습니다.</EmptyRow>
          )}
        </div>
      </AccordionSection>

      <AccordionSection value="rprsv" title="대표자">
        <div className="flex flex-col gap-krds-8">
          {RPRSV_LIST.map((r) => (
            <Table key={r.rprsvNm} rows={rprsvRows(r)} />
          ))}
        </div>
      </AccordionSection>

      <AccordionSection value="agt" title="입찰대리인">
        {BID_AGT_LIST.length > 0 ? (
          <div className="flex flex-col gap-krds-8">
            {BID_AGT_LIST.map((a) => (
              <Table key={`${a.agtNm}-${a.agtEntlno}`} rows={bidAgtRows(a)} />
            ))}
          </div>
        ) : (
          <EmptyRow>입찰대리인 정보가 없습니다.</EmptyRow>
        )}
      </AccordionSection>
    </Accordion>
  )
}
BzentyGnrlInfoDtl_Gnrl.displayName = 'BzentyGnrlInfoDtl_Gnrl'
