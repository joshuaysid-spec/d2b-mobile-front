// 입찰진행 상세조회 (MUI-BD-03-M02, 설계서 slide66·67·68). 입찰진행 목록 카드 → /bd/bidPrgsDtlInq 진입.
// 구성: 요약 헤더(badges + 공고번호 + 출력 + 입찰건명) + 구분/내용 표 + 플로팅(맨위로/바로가기).
//   데이터는 목록에서 넘어온 항목(navigate state)으로 구동. 없으면(직접 URL 진입) 페이지 fallback 목업.
// 항목명은 설계서 dlt_bidPrgrsList(slide67) 기준. 등록확정여부(bidRegCfmtnYn,slide76)·등록심사시점(tndrSbmsnPntmCd,slide156)은
//   설계서 타 데이터영역 항목으로 입찰서 작성 분기(slide68)에 사용. 진행 상태값(apfrStatNm/tndrStatNm/regRjctYn/
//   bfhdSrngRsltYn/techEvlRsltYn)은 설계서 미정의(상세설계 예정) 임시 항목 — 상태별 버튼 노출(slide68)을 구동.
// ⚠️ 상태에 따라 표 행·플로팅(바로가기) 버튼이 분기된다. 결과조회(기술평가 P01·생산능력서류 P06)는 풀팝업.
//    입찰참가신청서 작성(M01)·사전심사 신청(M01)은 화면 이동. 반려(P07)는 입찰참가신청서 화면에 있다.
//    플로팅 바로가기는 국내/국외 분기 — 국내: 기존 상태별 구성 유지 · 국외: 입찰서 작성하기(M71)+
//    입찰취소(국외 전용 P81)+환율정보(M74) 3종(사용자 확정 2026-08-26). 생산능력서류제출(P06)·
//    입찰참가등록반려신청(P07)·입찰포기(P03)는 국외 챕터(slide432~435)에 화면 미정의(국외 미사용)라 제외.
//    표도 국외 분기 — 사전심사(PQ)·생산능력서류 행(+사전심사 배지)은 국외 미사용으로 숨김,
//    기술평가 [내용 보기]는 국외 전용 조회(MUI-BD-07-P71 OvsTechEvlRslt)로 연결(사용자 확정 2026-08-26).
import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo, type SummaryInfoBadge } from '@/ui/common/composites/SummaryInfo'
import { OvsExchrtListFullPopup } from '@/ui/biz/bd/ovsExchrtList/OvsExchrtListFullPopup'
import { TechEvlRsltInq } from '@/ui/biz/bd/bfhdSrngRsltInq/TechEvlRsltInq'
import { OvsTechEvlRslt } from '@/ui/biz/bd/ovsTndrDtl/OvsTechEvlRslt'
import { PrdctnAbltDcmntSbmsn, type PrdctnAbltDcmntSbmsnHandle } from '@/ui/biz/bd/bfhdSrngRsltInq/PrdctnAbltDcmntSbmsn'
import { OvsBidRtrcnAply, type OvsBidRtrcnAplyHandle } from '@/ui/biz/bd/ovsTndrDtl/OvsBidRtrcnAply'
import { BidAbndAperWrt, type BidAbndAperWrtHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidAbndAperWrt'
import { BidAbndAperDtl } from '@/ui/biz/bd/bidPrgsDtlInq/BidAbndAperDtl'
import { BidRtrcnAperInq, type BidRtrcnAperInqHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidRtrcnAperInq'
import { BidRtrcnAperInqDtl } from '@/ui/biz/bd/bidPrgsDtlInq/BidRtrcnAperInqDtl'
import type { MockBidPrgrsItem, MockBidPrgrsDetail, MockOvsTndrDtlItem } from '@/types/mock/bd'

// 직접 URL 진입(목록 state 없음) 대비 fallback 목업 — 설계서 dlt_bidPrgrsList 항목명/형식 그대로.
const MOCK_BID_PRGRS_DETAIL: MockBidPrgrsDetail = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '2026LGM000604191-01',
  prcmNo: '2026LGM000604191',
  clsfNo: '001',
  bidNm: '간편한 아침식 제조 및 납품',
  rfrncNo: '2026LGM56349',
  orderInstTelno: '02-1234-5678',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '전자입찰',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: true,
  techEvl: true,
  prdcpDcmntSbms: true,
  bidRegCfmtnYn: 'Y',
  tndrStatNm: '미제출',
  tndrSbmsnPntmCd: 'pre',
  regRjctYn: false,
  bfhdSrngRsltYn: true,
  techEvlRsltYn: true,
}

// 입찰참가신청서 [내용 보기] 목적지 판정(설계서 slide66 상태값) — 제출은 끝났고 등록심사 전/동의 단계면
// 신청서 자체를 읽기전용 조회(M22), 등록확정·반려 등 심사 결과가 나온 건은 결과조회(M05).
const APFR_SUBMITTED_STATS = ['신청완료', '미동의', '동의완료']
function isApfrSubmitted(it: MockBidPrgrsDetail) {
  if (it.bidRegCfmtnYn === 'Y' || it.regRjctYn) return false
  return Boolean(it.apfrStatNm && APFR_SUBMITTED_STATS.includes(it.apfrStatNm))
}

// 진행상태 배지(요약 헤더에서 상태를 알 수 있게) — 목록 카드와 동일 규칙.
function statusBadge(
  it: MockBidPrgrsItem,
): { label: string; color: 'blue' | 'green' | 'red' } | null {
  if (it.regRjctYn) return { label: '입찰참가등록반려', color: 'red' }
  if (it.tndrStatNm === '완료') return { label: '입찰서 완료', color: 'green' }
  if (it.tndrStatNm === '제출') return { label: '입찰서 제출', color: 'blue' }
  if (it.bidRegCfmtnYn === 'Y') return { label: '등록확정', color: 'green' }
  if (it.apfrStatNm) return { label: `입찰참가 ${it.apfrStatNm}`, color: 'blue' }
  return null
}

// 구분/내용 표(설계서 slide66) — 일부 행은 상태텍스트 + 보기 버튼(combination). 대상 아닌 항목 행은 숨김.
// 국외(isOvs)는 사전심사(PQ)·생산능력서류 행을 국외 미사용으로 숨긴다(국외 챕터 slide432~435 에 해당 화면
// 미정의 — 사용자 확정 2026-08-26). 기술평가는 국외 전용 조회(P71)가 있어 유지.
function buildRows(it: MockBidPrgrsDetail, onView: (key: string) => void, isOvs: boolean): TableRow[] {
  // 상태 + 버튼 셀("신청/미동의/등록확정" 위, [내용 보기] 아래)
  const statusCell = (status: string, btnLabel: string, key: string) => (
    <div className="flex flex-col items-start gap-krds-3">
      <span>{status}</span>
      <Button size="sm" variant="inner" onClick={() => onView(key)}>
        {btnLabel}
      </Button>
    </div>
  )
  const rows: TableRow[] = [
    { label: '번호', value: it.rNum },
    { label: '업무구분', value: it.taskSeNm },
    // 공고번호 — 없이 진입(업무이력 카드 매핑)한 건은 '-' 표기(보기 버튼 미노출).
    it.pbancNo
      ? {
          label: '공고번호',
          value: (
            <div className="flex flex-col items-start gap-krds-3">
              <span>{it.pbancNo}</span>
              <Button size="sm" variant="inner" onClick={() => onView('pbanc')}>
                공고 보기
              </Button>
            </div>
          ),
          type: 'combination' as const,
        }
      : { label: '공고번호', value: '-' },
    { label: '판단번호', value: it.prcmNo },
    { label: '항목번호', value: it.clsfNo ?? '-' },
    { label: '입찰건명', value: it.bidNm },
    { label: '통합참조번호', value: it.rfrncNo },
    { label: '발주기관 연락처', value: it.orderInstTelno },
    { label: '계약방법', value: it.ctrtMthdNm },
    { label: '입찰방법', value: it.bidMthdNm },
    { label: '업체구분', value: it.bzentySeNm },
  ]
  // 대상(플래그)인 항목만 상태/보기 행 노출
  if (it.bidPrgrsApfr) {
    rows.push({
      label: '입찰참가신청서',
      value: statusCell(
        it.bidRegCfmtnYn === 'Y' ? '등록확정' : (it.apfrStatNm ?? '신청'),
        '내용 보기',
        'apfr',
      ),
      type: 'combination',
    })
  }
  if (it.tndr) {
    // 미제출이면 조회할 입찰서가 없으므로 [내용 보기] 미노출 — 설계서 slide172 입찰서조회(M09) 진입 조건이
    //   '입찰서 제출완료상태'. 작성은 바로가기('입찰서(견적서) 작성하기')가 담당한다.
    const tndrStat = it.tndrStatNm ?? '미제출'
    rows.push(
      tndrStat === '미제출'
        ? { label: '입찰서', value: tndrStat }
        : {
            label: '입찰서',
            value: statusCell(tndrStat, '내용 보기', 'tndr'),
            type: 'combination',
          },
    )
  }
  if (it.bfhdSrng && !isOvs) {
    rows.push({
      label: '사전심사(PQ)',
      value: statusCell(it.bfhdSrngRsltYn ? '결과' : '진행중', '내용 보기', 'pq'),
      type: 'combination',
    })
  }
  if (it.techEvl) {
    rows.push({
      label: '기술평가',
      value: statusCell(it.techEvlRsltYn ? '결과' : '진행중', '내용 보기', 'techEvl'),
      type: 'combination',
    })
  }
  if (it.prdcpDcmntSbms && !isOvs) {
    rows.push({
      label: '생산능력서류',
      value: statusCell('제출', '내용 보기', 'prdcp'),
      type: 'combination',
    })
  }
  rows.push(
    { label: '입찰참가등록 마감일시', value: it.bidClrsDt },
    { label: '입찰서제출 마감일시', value: it.tndrSbmsnDdlnDt },
  )
  return rows
}

// 진입 유형별 state — 입찰진행 목록(M01)=MockBidPrgrsItem 전체 / 나의 업무이력(CM-06-M04)=카드 매핑 값
//   (+현황명 taskSttsNm — 카드 1번 뱃지 그대로 노출, 공고번호 등 카드에 없는 항목은 ''/'-').
type BidPrgsDtlState = MockBidPrgrsDetail & { taskSttsNm?: string }

export function BidPrgsDtlInqPage() {
  const navigate = useNavigate()
  // 목록에서 navigate(state)로 넘어온 항목으로 상단/표/버튼을 그린다. 없으면(직접 URL 진입) 페이지 목업.
  const detail: BidPrgsDtlState =
    (useLocation().state as BidPrgsDtlState | null) ?? MOCK_BID_PRGRS_DETAIL
  const [shortcutOpen, setShortcutOpen] = useState(false) // 바로가기 시트
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보 조회(M74)
  const [abandonOpen, setAbandonOpen] = useState(false) // 입찰포기신청서(P03)
  const [cancelOpen, setCancelOpen] = useState(false) // 입찰취소신청서(P04)
  const [abandonDtlOpen, setAbandonDtlOpen] = useState(false) // 입찰포기신청서조회(P09)
  const [cancelDtlOpen, setCancelDtlOpen] = useState(false) // 입찰취소신청서조회(P10)
  const [techEvlOpen, setTechEvlOpen] = useState(false) // 기술평가결과조회(P01)
  const [prdcpOpen, setPrdcpOpen] = useState(false) // 생산능력서류제출(P06)
  const [ovsRtrcnOpen, setOvsRtrcnOpen] = useState(false) // 국외 입찰취소신청서작성(MUI-BD-06-P81)
  // P03/P04/P06/P81 은 바텀시트 콘텐츠 전용 — 컨테이너/footer 는 여기(부모)가 소유, 제출은 ref 핸들로 호출.
  const abandonRef = useRef<BidAbndAperWrtHandle>(null)
  const cancelRef = useRef<BidRtrcnAperInqHandle>(null)
  const prdcpRef = useRef<PrdctnAbltDcmntSbmsnHandle>(null)
  const ovsRtrcnRef = useRef<OvsBidRtrcnAplyHandle>(null)

  // 업무구분(taskSeNm) 데이터 필드로 국내/국외 화면 분기 — 목록(M01)·상세(M02)는 국내외 공용(설계서 slide324).
  const isOvs = detail.taskSeNm === '국외'

  // 보기 버튼 → 결과조회 연계. 기술평가/생산능력서류는 풀팝업(P01/P06), 그 외는 결과 화면 이동.
  const handleView = (key: string) => {
    if (key === 'apfr') {
      // 국외: 입찰참가신청서 상세(MUI-BD-04-M78, /bd/ovsBidPrtcpApfrDtl — state 는 목업 위 병합).
      // 국내: 설계서 slide66 '입찰참가신청서 상태값' 흐름대로 분기 —
      //   신청완료/미동의/동의완료 → 입찰참가신청조회(MUI-BD-04-M22)
      //   등록불가/등록확정/반려   → 입찰등록심사 결과조회(MUI-BD-03-M05)
      if (isOvs) navigate('/bd/ovsBidPrtcpApfrDtl', { state: detail })
      else if (isApfrSubmitted(detail)) navigate('/bd/bidPrtcpAperDtl', { state: detail })
      else navigate('/bd/reg-rslt', { state: detail })
    } else if (key === 'tndr') {
      // 국외 입찰서 상세(MUI-BD-06-M75, /bd/ovsTndrDtl) — state 미전달(페이지가 MockOvsTndrDtlItem 전체를
      // 기대하므로 MockBidPrgrsItem 을 넘기면 상단이 깨짐 → fallback 목업으로 렌더. API 연동 시 조회로 대체).
      // 국내: 제출 완료된 입찰서를 읽기전용 조회(MUI-BD-06-M09, /bd/tndrInq). 미제출 건은 위 buildRows 에서
      //   [내용 보기] 자체를 노출하지 않는다.
      if (isOvs) navigate('/bd/ovsTndrDtl')
      else navigate('/bd/tndrInq', { state: detail })
    } else if (key === 'pq') {
      // 사전심사(PQ) — 결과 있으면 결과조회(M02), 심사 전이면 신청조회(M03, v1.86 신규).
      navigate(detail.bfhdSrngRsltYn ? '/bd/srng-rslt' : '/bd/srng-aply-inq', { state: detail })
    }
    else if (key === 'techEvl') setTechEvlOpen(true)
    else if (key === 'prdcp') setPrdcpOpen(true)
    else console.log('[M02] 보기', key) // 공고/국내 입찰서 등 — 추후 연계
  }
  const rows = buildRows(detail, handleView, isOvs)
  const status = statusBadge(detail)

  // 국외 조회/신청(P71 기술평가·P81 입찰취소) 콘텐츠에 넘길 항목 — 상세(dlt_bidPrgrsList)에서 매핑 가능한 값
  //   + 미보유 필드 목업. (구매요청번호/공고차수/입찰방식/담당자 등은 M02 항목에 없음 — API 연동 시 조회로 대체)
  const ovsDetail: MockOvsTndrDtlItem = {
    pbancNo: detail.pbancNo,
    pbancOd: '1',
    prchsDmndNo: 'BAD839380-001',
    intgRfrncNo: detail.rfrncNo,
    bizNm: detail.bidNm,
    bidMth: '일반투찰',
    ctrtMthdNm: detail.ctrtMthdNm,
    regDdlnDt: detail.bidClrsDt,
    bdngDdlnDt: detail.tndrSbmsnDdlnDt,
    bdopnDt: detail.tndrSbmsnDdlnDt,
    exchrtAplcnYmd: '2026-02-13',
    picDeptNm: '국제부품계약팀',
    picNm: '정영금',
    picTlno: '02-1234-5678',
    taskSeNm: detail.taskSeNm,
    tndrStatNm: detail.tndrStatNm,
  }

  // 요약 헤더 배지 — (업무이력 진입 시 현황명) + 진행상태(색) + 업무구분 + 계약방법 + 신청유형.
  const summaryBadges: SummaryInfoBadge[] = [
    // 업무이력(CM-06-M04) 카드 진입 — 카드의 현황 뱃지(입찰참가신청/입찰서제출/공개수의협상)를 그대로 노출.
    ...(detail.taskSttsNm ? [{ key: 'stts', label: detail.taskSttsNm }] : []),
    ...(status ? [{ key: 'status', label: status.label, type: 'solid' as const, color: status.color }] : []),
    { key: 'task', label: detail.taskSeNm },
    { key: 'ctrt', label: detail.ctrtMthdNm },
    // 사전심사 배지 — 국외는 사전심사 미사용(표 행과 동일 기준)이라 숨김.
    ...(detail.bfhdSrng && !isOvs ? [{ key: 'bfhd', label: '사전심사' }] : []),
    ...(detail.bidPrgrsApfr ? [{ key: 'apfr', label: '입찰참가' }] : []),
  ]

  // 바로가기(플로팅) 버튼 — 국내/국외 분기.
  //   [국외] 입찰서 작성하기(국외 입찰서제출 M71) + 입찰취소(국외 전용 P81) + 환율정보 바로가기(M74) 3종
  //     (사용자 확정 2026-08-26). 생산능력서류제출(P06)·입찰참가등록반려신청(P07)·입찰포기(P03)는
  //     국외 챕터(slide432~435)에 화면 미정의(국외 미사용)라 제외.
  //   [국내] 기존 구성 유지 — 진행 상태에 따라 분기(구 slide68 "이벤트 설명" 노출 조건).
  //     입찰참가신청서 작성: 입찰참가 대상(bidPrgrsApfr)이고 아직 등록확정 전(bidRegCfmtnYn!=='Y').
  //     사전심사 신청: 사전심사 대상(bfhdSrng)이고 결과 없음(미신청).
  //   [공통] 입찰서 작성: 입찰서 대상(tndr)이고 (등록확정 bidRegCfmtnYn==='Y' 또는 사후등록심사 tndrSbmsnPntmCd==='post')이며 아직 완료 전.
  //       └ slide68 원문: "입찰참가신청 상태가 등록확정 또는 입찰등록심사 시점이 사후심사인 경우 버튼 보이기".
  //     입찰포기/취소: 입찰서를 제출한 경우(tndrStatNm==='제출'). 즉 제출 전=작성하기 · 제출 후=취소가 노출된다.
  type Shortcut = { id: string; label: string; variant: 'primary' | 'secondary' | 'tertiary' }
  const shortcutItems: Shortcut[] = []
  const canTender =
    detail.tndr &&
    (detail.bidRegCfmtnYn === 'Y' || detail.tndrSbmsnPntmCd === 'post') &&
    detail.tndrStatNm !== '완료'
  // 국외 마감 경과 — 서버에 경과 플래그·상태 반영이 미확정이라 클라 시계로 판정
  //   (기존 유일 선례 BidPrgrsListForBzentyPage pbancYmd 체크와 동일 방식, 사용자 확정 2026-09-02).
  //   입찰서제출마감일시(tndrSbmsnDdlnDt) 경과 시 [입찰서 작성하기] 숨김.
  const ovsDdlnPassed =
    isOvs && !!detail.tndrSbmsnDdlnDt && dayjs().isAfter(dayjs(detail.tndrSbmsnDdlnDt))
  if (isOvs) {
    if (canTender && !ovsDdlnPassed) {
      shortcutItems.push({ id: 'ovsBid', label: '입찰서 작성하기', variant: 'primary' })
    }
    if (detail.tndrStatNm === '제출') {
      shortcutItems.push({ id: 'ovsRtrcn', label: '입찰취소', variant: 'secondary' })
    }
    shortcutItems.push({ id: 'fx', label: '환율정보 바로가기', variant: 'tertiary' })
  } else {
    if (detail.bidPrgrsApfr && detail.bidRegCfmtnYn !== 'Y') {
      shortcutItems.push({ id: 'apply', label: '입찰참가신청서 작성하기', variant: 'primary' })
    }
    if (detail.bfhdSrng && !detail.bfhdSrngRsltYn) {
      shortcutItems.push({ id: 'bfhdAply', label: '사전심사 신청하기', variant: 'primary' })
    }
    if (canTender) {
      shortcutItems.push({ id: 'bid', label: '입찰서(견적서) 작성하기', variant: 'primary' })
    }
    if (detail.tndrStatNm === '제출') {
      shortcutItems.push({ id: 'giveup', label: '입찰포기 신청서 작성하기', variant: 'secondary' })
      shortcutItems.push({ id: 'cancel', label: '입찰취소 신청서 작성하기', variant: 'secondary' })
    }
    // 이미 포기/취소를 신청한 건은 제출한 신청서를 읽기전용으로 호출(P09/P10, slide109·112).
    if (detail.tndrStatNm === '입찰포기') {
      shortcutItems.push({ id: 'giveupDtl', label: '입찰포기 신청서 조회하기', variant: 'secondary' })
    }
    if (detail.tndrStatNm === '입찰취소') {
      shortcutItems.push({ id: 'cancelDtl', label: '입찰취소 신청서 조회하기', variant: 'secondary' })
    }
    shortcutItems.push({ id: 'fx', label: '환율정보 바로가기', variant: 'tertiary' })
  }

  const handleShortcut = (id: string) => {
    setShortcutOpen(false)
    switch (id) {
      case 'apply': // 입찰참가신청서작성 — 국내(M01, 등록반려/반려신청조회 플로팅은 그 화면에 있다).
        navigate('/bd/wrotAgre', { state: detail })
        break
      case 'bfhdAply': // 사전심사(PQ) 신청(M01)
        navigate('/bd/bfhd-srng-aply', { state: detail })
        break
      case 'bid': // 입찰서 작성 — 국내 마법사(MUI-BD-06-M01~M07) → 전자서명 → 신청완료.
        navigate('/bd/tndrWrt', { state: detail })
        break
      case 'ovsBid': // 국외 입찰서 작성 — 입찰서제출(MUI-BD-06-M71, /bd/ovsTndrSbmsn)
        navigate('/bd/ovsTndrSbmsn', { state: detail })
        break
      case 'fx':
        setExchrtOpen(true)
        break
      case 'giveup':
        setAbandonOpen(true)
        break
      case 'cancel':
        setCancelOpen(true)
        break
      case 'ovsRtrcn': // 국외 입찰취소신청서작성(P81) — 바텀시트(콘텐츠는 ovsTndrDtl 의 P81 공유)
        setOvsRtrcnOpen(true)
        break
      case 'giveupDtl':
        setAbandonDtlOpen(true)
        break
      case 'cancelDtl':
        setCancelDtlOpen(true)
        break
      default:
        console.log('[M02] 바로가기', id) // 추후 연계
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 헤더 — badges(상태/업무구분/계약방법/신청유형) + 공고번호 + 출력 + 입찰건명 */}
      <SummaryInfo
        badges={summaryBadges}
        // 공고번호 없이 진입(업무이력 카드 매핑)한 건은 카드 부제와 동일하게 '판단번호 …'로 표기.
        subtitle={detail.pbancNo || `판단번호 ${detail.prcmNo}`}
        title={detail.bidNm}
        actions={
          <button
            type="button"
            aria-label="출력"
            onClick={() => console.log('[M02] 출력')}
            className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <Icon name="Print" size={24} aria-hidden />
          </button>
        }
      />

      {/* 구분/내용 단일 표 */}
      <PageTitle as="h2" className="sr-only">
        입찰진행 상세정보
      </PageTitle>
      <div className="px-4 pb-4">
        <Table rows={rows} />
      </div>

      {/* 플로팅 — 맨위로 + 바로가기(+) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 시트 — 상태에 따라 분기된 세로 버튼 리스트 */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={shortcutItems.map((it) => ({
            label: it.label,
            variant: it.variant,
            onClick: () => handleShortcut(it.id),
          }))}
        />
      </BottomSheet>

      {/* 환율정보 조회 풀팝업 (M74) */}
      <OvsExchrtListFullPopup open={exchrtOpen} onOpenChange={setExchrtOpen} />
      {/* 기술평가결과조회 — 바텀시트(읽기전용 조회, footer=닫기). 콘텐츠는 국내 P01 / 국외 P71 분기 */}
      <BottomSheet
        open={techEvlOpen}
        onOpenChange={setTechEvlOpen}
        title="기술평가결과조회"
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setTechEvlOpen(false) }]}
          />
        }
      >
        {isOvs ? <OvsTechEvlRslt detail={ovsDetail} /> : <TechEvlRsltInq detail={detail} />}
      </BottomSheet>

      {/* 생산능력서류제출(P06) — 바텀시트(컨테이너/footer 부모 소유, 콘텐츠는 ref 핸들) */}
      <BottomSheet
        open={prdcpOpen}
        onOpenChange={setPrdcpOpen}
        title="생산능력서류 제출"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setPrdcpOpen(false) },
              { label: '제출하기', variant: 'primary', onClick: () => prdcpRef.current?.submit() },
            ]}
          />
        }
      >
        <PrdctnAbltDcmntSbmsn ref={prdcpRef} detail={detail} onSubmitted={() => setPrdcpOpen(false)} />
      </BottomSheet>

      {/* 국외 입찰취소신청서작성(P81) — 바텀시트(컨테이너/footer 부모 소유, 콘텐츠는 ovsTndrDtl 의 P81 공유).
          P81 콘텐츠는 MockOvsTndrDtlItem 을 기대 — 상세 항목에서 매핑 가능한 값만 넘기고 나머지는 목업
          (M02→국외 화면 연계의 기존 관례: API 연동 시 조회로 대체). */}
      <BottomSheet
        open={ovsRtrcnOpen}
        onOpenChange={setOvsRtrcnOpen}
        title="입찰취소 신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setOvsRtrcnOpen(false) },
              { label: '제출하기', variant: 'primary', onClick: () => ovsRtrcnRef.current?.submit() },
            ]}
          />
        }
      >
        <OvsBidRtrcnAply
          ref={ovsRtrcnRef}
          detail={ovsDetail}
          onSubmitted={() => setOvsRtrcnOpen(false)}
        />
      </BottomSheet>

      {/* 입찰포기신청서(P03) — 바텀시트(컨테이너/footer 부모 소유, 콘텐츠는 ref 핸들) */}
      <BottomSheet
        open={abandonOpen}
        onOpenChange={setAbandonOpen}
        title="입찰포기신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setAbandonOpen(false) },
              { label: '제출하기', variant: 'primary', onClick: () => abandonRef.current?.submit() },
            ]}
          />
        }
      >
        <BidAbndAperWrt ref={abandonRef} detail={detail} onSubmitted={() => setAbandonOpen(false)} />
      </BottomSheet>

      {/* 입찰취소신청서(P04) — 바텀시트(제출확인 모달은 콘텐츠 내부) */}
      <BottomSheet
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="입찰취소신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setCancelOpen(false) },
              { label: '제출', variant: 'primary', onClick: () => cancelRef.current?.submit() },
            ]}
          />
        }
      >
        <BidRtrcnAperInq ref={cancelRef} detail={detail} onSubmitted={() => setCancelOpen(false)} />
      </BottomSheet>

      {/* 입찰포기신청서조회(P09) — 읽기전용 조회(footer=닫기, 부모 소유) */}
      <BottomSheet
        open={abandonDtlOpen}
        onOpenChange={setAbandonDtlOpen}
        title="입찰포기신청서"
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setAbandonDtlOpen(false) }]}
          />
        }
      >
        <BidAbndAperDtl detail={detail} />
      </BottomSheet>

      {/* 입찰취소신청서조회(P10) — 읽기전용 조회(footer=닫기, 부모 소유) */}
      <BottomSheet
        open={cancelDtlOpen}
        onOpenChange={setCancelDtlOpen}
        title="입찰취소신청서"
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setCancelDtlOpen(false) }]}
          />
        }
      >
        <BidRtrcnAperInqDtl detail={detail} />
      </BottomSheet>
    </div>
  )
}
