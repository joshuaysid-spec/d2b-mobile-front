// 업체정보 상세 - '업체일반' 탭 콘텐츠 (MUI-CM-01-T01, 설계서 v0.86 slide126~131 / Figma 10020:82706·82764).
// 260827 Figma 리디자인 반영: 아코디언+파란라벨 테이블 → 섹션 카드(InfoAccordionCard) 5장.
//   사업자정보 · 법인정보 · 상태/부정당 · 수의계약배제(전체/3개월 토글 유지 — 설계서) · 대표자 및 입찰 대리인.
//   각 카드 접힘 시 4행 + [더보기](Figma 10020:82706). 주민등록번호는 설계서 260713 개정(삭제)에 따라 미표시(사용자 확정).
// 데이터는 목업(설계서 데이터영역 항목명·형식 그대로) — 추후 API(cmService.selectBzentyGnrlInfo)로 대체.
import { useState } from 'react'

import type {
  BzentyGnrlInfo,
  BzentyStts,
  BzentyRlsVltrnsRstric,
  BzentyRprsv,
  BzentyBidAgt,
} from '@/types/mock/cm'
import { Badge } from '@/ui/common/base/Badge'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import {
  InfoAccordionCard,
  type InfoCardRowInput,
} from '@/ui/biz/cm/bzentyInfo/InfoAccordionCard'

// ── 업체일반 (dm_bzentyGnrlInfo) — 설계서 slide126/128 예시값 ────────────────
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

// ── 상태/부정당 (dl_bzentySttsList) — 설계서 slide126/129 예시값 ─────────────
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

// ── 수의계약배제 (dl_bzentyRlsVltrnsRstricList) — 설계서 slide127/129 예시값 ──
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

// ── 대표자 (dl_bzentyRprsvList) — 설계서 slide127/129 예시값 ─────────────────
const RPRSV_LIST: BzentyRprsv[] = [
  {
    rprsvYn: '대대표',
    rprsvNm: '홍길동',
    rprsvEngNm: 'Hong kil dong',
    rprsvEmlAddr: 'abcde@dapa.go.kr',
  },
]

// ── 입찰대리인 (dl_bzentyBidAgtList) — 설계서 slide127/130 예시값 ────────────
const BID_AGT_LIST: BzentyBidAgt[] = [
  { agtJbpsNm: '과장', agtNm: '김길동', agtEntlno: '02-1234-5678' },
]

// 사업자정보 — Figma 행 구성(업체코드는 요약 카드 뱃지로 이동, 사업구분도 요약 카드로).
function bizRows(d: BzentyGnrlInfo): InfoCardRowInput[] {
  return [
    { label: '상호명', value: d.bzentyNm },
    { label: '영문상호명', value: d.bzentyEngNm },
    { label: '사업자등록번호', value: d.brno },
    { label: '개업일자', value: d.opbizYmd },
    { label: '국적', value: d.ntnCd },
    { label: '홈페이지', value: d.hmpgAddr },
    { label: '주소', value: d.bzentyAddr },
    { label: '연락처', value: d.rprsvTelno },
    { label: '팩스번호', value: d.rprsvFxno },
  ]
}

// 법인정보 — 기업구분(entShcd1·2)은 뱃지 나열, 공장설립특례해당여부는 '해당' 뱃지(Figma).
function corpRows(d: BzentyGnrlInfo): InfoCardRowInput[] {
  return [
    { label: '법인설립일자', value: d.fndnYmd },
    { label: '법인등록번호', value: d.crno },
    { label: '본사사업자번호', value: d.hdofcBrno },
    { label: '종업원수', value: d.empCnt },
    { label: '제조구분', value: d.entTpcd },
    {
      label: '기업구분',
      valueIsNode: true,
      value: (
        <>
          {[d.entShcd1, d.entShcd2].filter(Boolean).map((v) => (
            <Badge key={v} type="pastel" color="blue">
              {v}
            </Badge>
          ))}
        </>
      ),
    },
    { label: '기업구분해당년도', value: `${d.entSeRlvtYr}년` },
    { label: '지역코드', value: d.rgnCd },
    {
      label: '공장설립특례해당여부',
      valueIsNode: true,
      value: (
        <Badge type="pastel" color="blue">
          {d.fctryFndnSpcsYn}
        </Badge>
      ),
    },
    { label: '본/지사', value: d.bplcSecd },
  ]
}

// 상태/부정당 — 상태명 행에 상태코드 뱃지(Figma). 다건이면 divider 로 항목 구분.
function sttsRows(list: BzentyStts[]): InfoCardRowInput[] {
  return list.flatMap((s, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    {
      label: '상태명',
      value: s.bzentyStNm,
      badge: (
        <Badge type="pastel" color="blue">
          상태코드{s.bzentyStcd}
        </Badge>
      ),
    },
    { label: '발생일자', value: s.crtrYmd },
    { label: '시작일자', value: s.bgngYmd },
    { label: '종료일자', value: s.endYmd },
    { label: '비고', value: s.rmrkCn },
  ])
}

// 수의계약배제 — 공고번호/판단번호 합침 행(Figma). 다건이면 divider.
function rlsVltrnsRows(list: BzentyRlsVltrnsRstric[]): InfoCardRowInput[] {
  return list.flatMap((e, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    { label: '공고번호 / 판단번호', value: `${e.pbancNo} / ${e.prcmNo}` },
    { label: '개찰일자', value: e.bdopnYmd },
    { label: '공고명', value: e.pbancNm },
    { label: '발주기관', value: e.orderInstNm },
    { label: '수의계약배제기간', value: e.exclPrd },
    { label: '계약포기사유', value: e.exclRsn },
    { label: '등록일', value: e.regDt },
  ])
}

// 대표자 및 입찰 대리인 — 통합 카드(Figma). 주민등록번호는 설계서 260713 삭제 개정에 따라 미표시.
function rprsvAgtRows(rprsvList: BzentyRprsv[], agtList: BzentyBidAgt[]): InfoCardRowInput[] {
  const rows: InfoCardRowInput[] = rprsvList.flatMap((r, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    { label: '대표자 (영문)', value: `${r.rprsvNm} (${r.rprsvEngNm})` },
    { label: '이메일', value: r.rprsvEmlAddr },
  ])
  agtList.forEach((a, i) => {
    if (rows.length > 0 || i > 0) rows.push('divider')
    rows.push(
      { label: '대리인 (직위)', value: `${a.agtNm} (${a.agtJbpsNm})` },
      { label: '연락처', value: a.agtEntlno },
    )
  })
  return rows
}

export function BzentyGnrlInfoDtl_Gnrl() {
  // 수의계약배제 조회 조건 — 기본 3개월(설계서 slide127 "기본 값 : 3개월"), 전체 토글(리디자인에도 유지 — 사용자 확정).
  const [exclPeriod, setExclPeriod] = useState<'3m' | 'all'>('3m')
  // 목업이라 실제 필터링은 하지 않고 조회 조건만 표시(추후 API: cmService.selectBzentyRlsVltrnsRstrcList(period)).
  const exclList = RLS_VLTRNS_LIST

  return (
    <div className="flex w-full flex-col gap-krds-8 px-4 py-5">
      <InfoAccordionCard title="사업자정보" rows={bizRows(GNRL_INFO)} previewCount={4} />
      <InfoAccordionCard title="법인정보" rows={corpRows(GNRL_INFO)} previewCount={4} />

      <InfoAccordionCard title="상태/부정당" rows={sttsRows(STTS_LIST)} previewCount={4}>
        {STTS_LIST.length === 0 && (
          // ⚠️ 설계서 "상태/부정당 데이터가 없는 경우 표시 정보 데이터 확인이 필요함" — 안내 문구 상세설계 확정 시 교체.
          <p className="text-[17px] leading-normal text-krds-text-muted">
            상태/부정당 내역이 없습니다.
          </p>
        )}
      </InfoAccordionCard>

      <InfoAccordionCard title="수의계약배제" rows={rlsVltrnsRows(exclList)} previewCount={4}>
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
        {exclList.length === 0 && (
          <p className="text-[17px] leading-normal text-krds-text-muted">
            수의계약에 배제된 사실이 없습니다.
          </p>
        )}
      </InfoAccordionCard>

      <InfoAccordionCard
        title="대표자 및 입찰 대리인"
        rows={rprsvAgtRows(RPRSV_LIST, BID_AGT_LIST)}
        previewCount={4}
      />
    </div>
  )
}
BzentyGnrlInfoDtl_Gnrl.displayName = 'BzentyGnrlInfoDtl_Gnrl'
