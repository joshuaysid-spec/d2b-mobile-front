// 국외 보관함 목록 (MUI-CM-01-M71, 설계서 slide301·306·307 + 최종 와이어프레임 260709). 보관함에 추가한 국외 공고 목록 조회.
// 레퍼런스: 입찰공고 통합목록 BidPbancIntgListPage (구성·상태·페이징 동일 패턴).
// 구성: 검색조건(SearchCondition, 필터버튼→풀팝업) + 목록헤더(총건수·page size) + 카드 리스트 + 더보기 + FAB.
// 데이터/페이징/검색은 페이지 소유. 목록은 목업(dl_resultList, 항목명 설계서 그대로) — 추후 API: bdService.selectLockerPbancList.
// 카드 하단(2026-08-24 확정 — 설계서 slide409 "공고 신청 버튼으로 팝업 버튼 일원화(260709 개정)"):
//   [+ 공고 신청] 버튼 1개 → 바텀시트 호출. 시트 버튼 = 상태 버튼 1개 + 보관함 품목 관리(항시).
//   상태 버튼은 입찰내역작성여부(tmprBidCnStts)로만 분기(사용자 확정 2026-08-24 — 구 참가신청 우선순위 분기 대체):
//     작성(금액 작성/저장) → [입찰내역 작성수정] · 미작성(품목만 보관) → [입찰진행 바로가기]
//     완료(제출 완료) → [입찰내역 완료](비활성)
// 카드 배지 = 표시 레이블(slide409 ⑤) 중 입찰내역작성여부·입찰참가신청여부 2종만(사용자 확정 2026-08-24 — 입찰구분·가격제 제거).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ButtonGroup, type ButtonGroupItem } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type {
  DateRangePresetDef,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'

import type { BidPrgrsItem, OvsLockerPbanItem } from '@/types/bd'

// 빠른검색 대상 — 설계서 slide301 검색영역(통합참조번호/구매요청번호).
const SEARCH_TARGETS = [
  { value: 'intgRfrncNo', label: '통합참조번호' },
  { value: 'prchsDmndNo', label: '구매요청번호' },
]

// ── 상세필터 schema — 국외 개정판(v1.82_국외) slide26 검색필터(2026-07-06) 반영 ──
// 일자구분(srchYmdSe): 개찰일자/공고일자 토글(구판의 개찰일자/입찰참가/입찰서제출 3종에서 변경).
// 빠른 설정 칩 — slide26: 최근 1개월/최근 3개월/최근 6개월 (직접 입력·데이트피커는 DateRangeInput 자체 제공 — 기간검색 칩 제거).
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]
const LOCKER_FILTER_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    {
      key: 'date',
      title: '일자 설정',
      fields: [
        {
          type: 'segment',
          key: 'srchYmdSe',
          options: [
            { value: 'opbid', label: '개찰' },
            { value: 'pbanc', label: '공고' },
          ],
        },
        // 기준일자시작(srchEndYmd)~기준일자끝(srchBgngYmd) — value 는 { start, end } 로 관리.
        { type: 'dateRange', key: 'date', presets: DATE_PRESETS },
      ],
    },
    {
      key: 'keyword',
      title: '검색어 (일부 입력 가능)',
      fields: [
        { type: 'text', key: 'intgRfrncNo', label: '통합참조번호', placeholder: '번호를 입력하세요.' },
        { type: 'text', key: 'prchsDmndNo', label: '구매요청번호', placeholder: '번호를 입력하세요.' },
      ],
    },
    {
      // 참가신청상태(bidPrtcpAplyStts) — 구분(전체, 작성, 미작성). 설계서 slide410 1.1 — 셀렉트박스(사용자 확정).
      key: 'bidPrtcpAplyStts',
      title: '참가신청상태',
      fields: [
        {
          type: 'select',
          key: 'bidPrtcpAplyStts',
          options: [
            { value: 'all', label: '전체' },
            { value: 'written', label: '작성' },
            { value: 'unwritten', label: '미작성' },
          ],
        },
      ],
    },
  ],
}
const DEFAULT_FILTER: SearchFilterValue = {
  srchYmdSe: 'opbid',
  date: { start: '', end: '' },
  intgRfrncNo: '',
  prchsDmndNo: '',
  bidPrtcpAplyStts: 'all',
}

// 보관함 공고 목록(설계서 slide306 dl_resultList) — 목업, 추후 API: bdService.selectLockerPbancList.
// 필드명·형식은 설계서 그대로(통합참조번호 BDF01823EFE·공고번호 EFE00012-2·일시 14자리 표시형식).
const dl_resultList: OvsLockerPbanItem[] = [
  {
    id: 'BDF01823EFE',
    intgRfrncNo: 'BDF01823EFE',
    pbancNo: 'EFE00012',
    pbancOd: '2',
    pbancYr: '2025',
    prchsDmndNo: 'BDF01823-002',
    bizNm: 'T-80U/TBE-3',
    tmprBidCn: 'N',
    tmprBidCnStts: '미작성',
    splyBzentyNm: '미작성',
    bidPrtcpAply: 'N',
    creditYn: 'N',
    bidPrtcpAplyStts: '미신청',
    regDdlnDt: '2026-03-17 15:00',
    bdngDdlnDt: '2026-03-26 11:00',
    bdopnYmd: '2026-03-30',
    exchrtAplcnYmd: '2026-03-17',
    bidMth: '경쟁입찰',
    lockerItemQty: '100',
    bidPrcSysNm: '단가제',
    ctrtMthdNm: '일반경쟁',
  },
  {
    id: 'BDF01824EFE',
    intgRfrncNo: 'BDF01824EFE',
    pbancNo: 'EFE00013',
    pbancOd: '1',
    pbancYr: '2025',
    prchsDmndNo: 'BDF01824-001',
    bizNm: 'K-9 SELF-PROPELLED HOWITZER SPARE PARTS',
    tmprBidCn: 'Y',
    tmprBidCnStts: '완료',
    splyBzentyNm: 'A 업체',
    bidPrtcpAply: 'Y',
    creditYn: 'N',
    bidPrtcpAplyStts: '완료',
    regDdlnDt: '2026-03-17 15:00',
    bdngDdlnDt: '2026-03-26 11:00',
    bdopnYmd: '2026-03-30',
    exchrtAplcnYmd: '2026-03-17',
    bidMth: '경쟁입찰',
    lockerItemQty: '12',
    bidPrcSysNm: '단가제',
    ctrtMthdNm: '일반경쟁',
  },
  {
    id: 'BDF01931EFE',
    intgRfrncNo: 'BDF01931EFE',
    pbancNo: 'EFE00027',
    pbancOd: '1',
    pbancYr: '2026',
    prchsDmndNo: 'BDF01931-004',
    bizNm: 'F-15K AIRCRAFT RECOIL ASSEMBLY',
    tmprBidCn: 'Y',
    tmprBidCnStts: '작성',
    splyBzentyNm: 'C 물산',
    bidPrtcpAply: 'N',
    creditYn: 'N',
    bidPrtcpAplyStts: '미신청',
    regDdlnDt: '2026-04-02 15:00',
    bdngDdlnDt: '2026-04-10 11:00',
    bdopnYmd: '2026-04-14',
    exchrtAplcnYmd: '2026-04-02',
    bidMth: '공개수의',
    lockerItemQty: '3',
    bidPrcSysNm: '총액제',
    ctrtMthdNm: '수의계약',
  },
  {
    id: 'BDF02005EFE',
    intgRfrncNo: 'BDF02005EFE',
    pbancNo: 'EFE00031',
    pbancOd: '3',
    pbancYr: '2026',
    prchsDmndNo: 'BDF02005-001',
    bizNm: 'UH-60 HELICOPTER MAIN ROTOR BLADE',
    tmprBidCn: 'Y',
    tmprBidCnStts: '완료',
    splyBzentyNm: 'B 상사',
    bidPrtcpAply: 'N',
    creditYn: 'N',
    bidPrtcpAplyStts: '작성',
    regDdlnDt: '2026-04-20 15:00',
    bdngDdlnDt: '2026-04-28 11:00',
    bdopnYmd: '2026-05-01',
    exchrtAplcnYmd: '2026-04-20',
    bidMth: '사전심사',
    lockerItemQty: '27',
    bidPrcSysNm: '총액제',
    ctrtMthdNm: '제한경쟁',
  },
  {
    // 내역 제출완료 + 참가신청 전 → [입찰내역 완료](비활성) 상태 확인용
    id: 'BDF02112EFE',
    intgRfrncNo: 'BDF02112EFE',
    pbancNo: 'EFE00035',
    pbancOd: '1',
    pbancYr: '2026',
    prchsDmndNo: 'BDF02112-003',
    bizNm: 'KF-21 LANDING GEAR SEAL KIT',
    tmprBidCn: 'Y',
    tmprBidCnStts: '완료',
    splyBzentyNm: 'D 항공',
    bidPrtcpAply: 'N',
    creditYn: 'N',
    bidPrtcpAplyStts: '미신청',
    regDdlnDt: '2026-05-11 15:00',
    bdngDdlnDt: '2026-05-19 11:00',
    bdopnYmd: '2026-05-22',
    exchrtAplcnYmd: '2026-05-11',
    bidMth: '경쟁입찰',
    lockerItemQty: '8',
    bidPrcSysNm: '단가제',
    ctrtMthdNm: '일반경쟁',
  },
]

const TOTAL = 258 // 총 건수(목업 — 설계서 slide301 '더보기(10/258)'. 실제 API total)
// 목업 확장 — 보유 4건을 인덱스로 복제해 TOTAL 건 구성(통합참조번호·id 는 고유하게).
const MOCK_LIST: OvsLockerPbanItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_resultList[i % dl_resultList.length]
  const intgRfrncNo = i < dl_resultList.length ? base.intgRfrncNo : `BDF${String(1823 + i).padStart(5, '0')}EFE`
  return { ...base, id: intgRfrncNo, intgRfrncNo }
})

export function OvsLockerPbanListPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // 상세필터 풀팝업
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  const [keyword, setKeyword] = useState('') // 빠른검색어(입력 중)
  const [targets, setTargets] = useState<string[]>(['intgRfrncNo']) // 빠른검색 대상(single)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  // 빠른검색 '적용' 상태 — 검색 버튼(또는 Enter) 실행 시에만 확정.
  const [appliedSearch, setAppliedSearch] = useState<{ keyword: string; target: string } | null>(
    null,
  )

  // ── API 경계 스텁 (백엔드 연동 시 services/bd 로 대체) ──
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    setKeyword('')
    setAppliedSearch(null)
    console.log('[OvsLockerList] 상세필터 검색', value) // 추후 API: bdService.selectLockerPbancList(toRequest(value))
  }
  const handleQuickSearch = () => {
    const target = targets[0] ?? 'intgRfrncNo'
    setAppliedSearch({ keyword: keyword.trim(), target })
    setPage(1)
    console.log('[OvsLockerList] 빠른검색', { keyword, target }) // 추후 API: bdService.selectLockerPbancList
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[OvsLockerList] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[OvsLockerList] loadMore → page', next)
  }
  // 진행 화면들(신청서/진행 상세)은 입찰진행 아이템(BidPrgrsItem) 형태의 state 를 기대 — 보관함 항목을 매핑.
  // 보관함 항목에 없는 필드(판단번호·연락처·진행 플래그)는 목업으로 보완(추후 API 응답으로 교체).
  const toPrgrsItem = (it: OvsLockerPbanItem): BidPrgrsItem => ({
    rNum: it.id,
    taskSeNm: '국외',
    pbancNo: `${it.pbancNo}-${it.pbancOd}`,
    prcmNo: '-',
    bidNm: it.bizNm,
    rfrncNo: it.intgRfrncNo,
    orderInstTelno: '02-2079-5100',
    ctrtMthdNm: it.bidMth,
    bidMthdNm: it.bidPrcSysNm,
    bidClrsDt: it.regDdlnDt,
    tndrSbmsnDdlnDt: it.bdngDdlnDt,
    bzentySeNm: '대표',
    bfhdSrng: false,
    bidPrgrsApfr: true,
    tndr: true,
    techEvl: false,
    prdcpDcmntSbms: false,
    tndrSbmsnPntmCd: 'post', // 국외 = 사후등록심사(입찰진행 목록 국외 목업과 동일)
  })

  // 입찰내역 작성수정 (설계서 이벤트 btn_moveBidDetail_onclick → MUI-BD-01-M76)
  const goBidCn = (it: OvsLockerPbanItem) => {
    console.log('[OvsLockerList] 입찰내역 작성수정 이동', it.intgRfrncNo)
    navigate('/bd/ovsTmprBidCnReg', { state: it })
  }
  // 입찰진행 바로가기 — 해당 공고 입찰진행 상세(/bd/bidPrgsDtlInq) 직행(260709 확정).
  const goBidPrgrs = (it: OvsLockerPbanItem) => {
    console.log('[OvsLockerList] 입찰진행 바로가기', it.intgRfrncNo)
    navigate('/bd/bidPrgsDtlInq', { state: toPrgrsItem(it) })
  }
  // 보관함 품목 관리 (MUI-CM-01-M74) — 항시 노출.
  const goItemMng = (it: OvsLockerPbanItem) => {
    console.log('[OvsLockerList] 보관함 품목 관리 이동', it.intgRfrncNo)
    navigate('/bd/ovsLockerItemReg', { state: it })
  }

  // ── 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 교체) ──
  const filteredList = useMemo(() => {
    if (!appliedSearch || !appliedSearch.keyword) return MOCK_LIST
    const kw = appliedSearch.keyword.toLowerCase()
    return MOCK_LIST.filter((it) => {
      const field = appliedSearch.target === 'prchsDmndNo' ? it.prchsDmndNo : it.intgRfrncNo
      return field.toLowerCase().includes(kw)
    })
  }, [appliedSearch])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)


  // 목업 → Card props 매핑. 표시 레이블(최종 와이어프레임 ⑤ 순서 그대로):
  //   입찰내역작성여부(작성/미작성/완료) · 입찰참가신청여부(신청/미신청) · 입찰구분(경쟁입찰/공개수의/사전심사) · 가격제(단가제/총액제).
  const cardItems: CardListItem[] = visibleList.map((it) => {
    // 상태 버튼 1개 (260709 확정 — 우선순위 분기):
    //   ① 참가신청 완료 → [입찰진행 바로가기] ② 참가신청 작성(저장) → [입찰참가신청 작성수정]
    //   ③ 내역 제출완료 → [입찰내역 완료](비활성 표시) ④ 그 외(내역 미작성/작성) → [입찰내역 작성수정]
    const statusBtn: ButtonGroupItem =
      it.bidPrtcpAplyStts === '완료'
        ? { label: '입찰진행 바로가기', variant: 'primary', onClick: () => goBidPrgrs(it) }
        : it.bidPrtcpAplyStts === '작성'
          ? { label: '입찰참가신청 작성수정', variant: 'primary', onClick: () => goPrtcpAply(it) }
          : it.tmprBidCnStts === '완료'
            ? { label: '입찰내역 완료', variant: 'primary', disabled: true }
            : { label: '입찰내역 작성수정', variant: 'primary', onClick: () => goBidCn(it) }
    return {
      id: it.id,
      badges: (
        <>
          {it.tmprBidCnStts === '완료' ? (
            <Badge type="solid" color="green">입찰내역 완료</Badge>
          ) : it.tmprBidCnStts === '작성' ? (
            <Badge type="pastel" color="blue">입찰내역 작성</Badge>
          ) : (
            <Badge type="pastel" color="yellow">입찰내역 미작성</Badge>
          )}
          {it.bidPrtcpAply === 'Y' ? (
            <Badge type="solid" color="blue">입찰참가 신청</Badge>
          ) : (
            <Badge type="pastel" color="red">입찰참가 미신청</Badge>
          )}
          <Badge>{it.bidMth}</Badge>
          <Badge>{it.bidPrcSysNm}</Badge>
        </>
      ),
      subtitle: `통합참조번호 ${it.intgRfrncNo} / 공고번호 ${it.pbancNo}-${it.pbancOd}`,
      title: it.bizNm,
      rows: [
        { label: '입찰업체', value: it.splyBzentyNm },
        { label: '구매요청번호', value: it.prchsDmndNo },
        { label: '입찰참가등록마감일시', value: it.regDdlnDt },
        { label: '입찰서제출마감일시', value: it.bdngDdlnDt },
        { label: '개찰일자', value: it.bdopnYmd },
      ],
      footer: (
        // 총 2개 버튼(260709 확정): 상태 버튼 1개 + 보관함 품목 관리(항시)
        <ButtonGroup
          layout="vertical"
          items={[
            statusBtn,
            { label: '보관함 품목 관리', variant: 'secondary', onClick: () => goItemMng(it) },
          ]}
        />
      ),
    }
  })

  // [+ 공고 신청] 바텀시트 — 카드별 버튼 팝업(설계서 slide409 "공고 신청 버튼으로 팝업 버튼 일원화").
  // 컨테이너는 페이지 소유(*Sheet 래퍼 금지), null 이면 닫힘.
  const [sheetItem, setSheetItem] = useState<OvsLockerPbanItem | null>(null)
  // 시트 상태 버튼 — 입찰내역작성여부(tmprBidCnStts)로만 분기(사용자 확정 2026-08-24):
  //   작성 → [입찰내역 작성수정] · 미작성 → [입찰진행 바로가기] · 완료 → [입찰내역 완료](비활성)
  const statusBtnFor = (it: OvsLockerPbanItem): ButtonGroupItem =>
    it.tmprBidCnStts === '완료'
      ? { label: '입찰내역 완료', variant: 'primary', disabled: true }
      : it.tmprBidCnStts === '작성'
        ? {
            label: '입찰내역 작성수정',
            variant: 'primary',
            onClick: () => {
              setSheetItem(null)
              goBidCn(it)
            },
          }
        : {
            label: '입찰진행 바로가기',
            variant: 'primary',
            onClick: () => {
              setSheetItem(null)
              goBidPrgrs(it)
            },
          }

  // 목업 → Card props 매핑. 배지 = 표시 레이블(slide409 ⑤) 중
  //   입찰내역작성여부(작성/미작성/완료) · 입찰참가신청여부(신청/미신청) 2종만(사용자 확정 2026-08-24).
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: (
      <>
        {it.tmprBidCnStts === '완료' ? (
          <Badge type="solid" color="green">입찰내역 완료</Badge>
        ) : it.tmprBidCnStts === '작성' ? (
          <Badge type="pastel" color="blue">입찰내역 작성</Badge>
        ) : (
          <Badge type="pastel" color="yellow">입찰내역 미작성</Badge>
        )}
        {it.bidPrtcpAplyYn === 'Y' ? (
          <Badge type="solid" color="blue">입찰참가 신청</Badge>
        ) : (
          <Badge type="pastel" color="red">입찰참가 미신청</Badge>
        )}
      </>
    ),
    subtitle: `통합참조번호 ${it.intgRfrncNo} / 공고번호 ${it.pbancNo}-${it.pbancOd}`,
    title: it.bizNm,
    rows: [
      { label: '입찰업체', value: it.splyBzentyNm },
      { label: '구매요청번호', value: it.prchsDmndNo },
      { label: '입찰참가등록마감일시', value: it.regDdlnDt },
      { label: '입찰서제출마감일시', value: it.bdngDdlnDt },
      { label: '개찰일자', value: it.bdopnYmd },
    ],
    footer: (
      // 구 버튼 2개 자리 → [+ 공고 신청] 버튼 1개(바텀시트 호출, 설계서 slide409 260709 개정)
      <Button variant="secondary" className="w-full" onClick={() => setSheetItem(it)}>
        <Icon name="Add" size={20} aria-hidden />
        공고 신청
      </Button>
    ),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색조건 — 블루 바(full-bleed) + 폼(px-4 인셋) */}
      <SectionTitle as="h2" bgColor="blue">
        검색조건
      </SectionTitle>
      <div className="px-4 py-4">
        <SearchCondition
          targets={SEARCH_TARGETS}
          selectedTargets={targets}
          onTargetsChange={setTargets}
          keyword={keyword}
          onKeywordChange={setKeyword}
          placeholder="검색할 내용을 입력하세요."
          onFilterClick={() => setOpen(true)}
          onSearch={handleQuickSearch}
        />
      </div>

      {/* 목록 헤더 — 총건수·표시개수 */}
      <ListSectionHeader
        variant="background"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />
      {/* 카드 (px-4 인셋) */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} />
      </div>

      {/* 더보기 — 모두 노출됐으면 숨김 */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* [+ 공고 신청] 바텀시트 — 상태 버튼(입찰내역작성여부 분기) + 보관함 품목 관리(항시). 컨테이너는 페이지 소유 */}
      <BottomSheet
        open={sheetItem !== null}
        onOpenChange={(o) => {
          if (!o) setSheetItem(null)
        }}
        title="공고 신청"
      >
        {sheetItem && (
          <ButtonGroup
            layout="vertical"
            items={[
              statusBtnFor(sheetItem),
              {
                label: '보관함 품목 관리',
                variant: 'secondary',
                onClick: () => {
                  setSheetItem(null)
                  goItemMng(sheetItem)
                },
              },
            ]}
          />
        )}
      </BottomSheet>

      {/* 상세필터 풀팝업 — 공통 SearchFilter 셸(설계서 slide302 검색필터) */}
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={LOCKER_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />
    </div>
  )
}
OvsLockerPbanListPage.displayName = 'OvsLockerPbanListPage'
