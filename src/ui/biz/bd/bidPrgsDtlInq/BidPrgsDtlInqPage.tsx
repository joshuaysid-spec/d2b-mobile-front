// 입찰진행 상세조회 (MUI-BD-03-M02, 설계서 slide66·67·68). 입찰진행 목록 카드 → /bd/prgrs/:id 진입.
// 구성: 요약 헤더(badges + 공고번호 + 출력 + 입찰건명) + 구분/내용 표 + 플로팅(맨위로/바로가기).
//   데이터는 목록에서 넘어온 항목(navigate state)으로 구동. 없으면(직접 URL 진입) 페이지 fallback 목업.
// 항목명은 설계서 dlt_bidPrgrsList(slide67) 기준. 등록확정여부(bidRegCfmtnYn,slide76)·등록심사시점(tndrSbmsnPntmCd,slide156)은
//   설계서 타 데이터영역 항목으로 입찰서 작성 분기(slide68)에 사용. 진행 상태값(apfrStatNm/tndrStatNm/regRjctYn/
//   bfhdSrngRsltYn/techEvlRsltYn)은 설계서 미정의(상세설계 예정) 임시 항목 — 상태별 버튼 노출(slide68)을 구동.
// ⚠️ 상태에 따라 표 행·플로팅(바로가기) 버튼이 분기된다. 결과조회(기술평가 P01·생산능력서류 P06)는 풀팝업.
//    입찰참가신청서 작성(M01)·사전심사 신청(M01)은 화면 이동. 반려(P07)는 입찰참가신청서 화면에 있다.
import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

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
import { PrdctnAbltDcmntSbmsn, type PrdctnAbltDcmntSbmsnHandle } from '@/ui/biz/bd/bfhdSrngRsltInq/PrdctnAbltDcmntSbmsn'
import { BidAbndAperWrt, type BidAbndAperWrtHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidAbndAperWrt'
import { BidRtrcnAperInq, type BidRtrcnAperInqHandle } from '@/ui/biz/bd/bidPrgsDtlInq/BidRtrcnAperInq'
import type { BidPrgrsItem, BidPrgrsDetail } from '@/types/bd'

// 직접 URL 진입(목록 state 없음) 대비 fallback 목업 — 설계서 dlt_bidPrgrsList 항목명/형식 그대로.
const MOCK_BID_PRGRS_DETAIL: BidPrgrsDetail = {
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

// 진행상태 배지(요약 헤더에서 상태를 알 수 있게) — 목록 카드와 동일 규칙.
function statusBadge(
  it: BidPrgrsItem,
): { label: string; color: 'blue' | 'green' | 'red' } | null {
  if (it.regRjctYn) return { label: '입찰참가등록반려', color: 'red' }
  if (it.tndrStatNm === '완료') return { label: '입찰서 완료', color: 'green' }
  if (it.tndrStatNm === '제출') return { label: '입찰서 제출', color: 'blue' }
  if (it.bidRegCfmtnYn === 'Y') return { label: '등록확정', color: 'green' }
  if (it.apfrStatNm) return { label: `입찰참가 ${it.apfrStatNm}`, color: 'blue' }
  return null
}

// 구분/내용 표(설계서 slide66) — 일부 행은 상태텍스트 + 보기 버튼(combination). 대상 아닌 항목 행은 숨김.
function buildRows(it: BidPrgrsDetail, onView: (key: string) => void): TableRow[] {
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
    {
      label: '공고번호',
      value: (
        <div className="flex flex-col items-start gap-krds-3">
          <span>{it.pbancNo}</span>
          <Button size="sm" variant="inner" onClick={() => onView('pbanc')}>
            공고 보기
          </Button>
        </div>
      ),
      type: 'combination',
    },
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
    rows.push({
      label: '입찰서',
      value: statusCell(it.tndrStatNm ?? '미제출', '내용 보기', 'tndr'),
      type: 'combination',
    })
  }
  if (it.bfhdSrng) {
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
  if (it.prdcpDcmntSbms) {
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

export function BidPrgsDtlInqPage() {
  const navigate = useNavigate()
  // 목록에서 navigate(state)로 넘어온 항목으로 상단/표/버튼을 그린다. 없으면(직접 URL 진입) 페이지 목업.
  const detail = (useLocation().state as BidPrgrsItem | null) ?? MOCK_BID_PRGRS_DETAIL
  const [shortcutOpen, setShortcutOpen] = useState(false) // 바로가기 시트
  const [exchrtOpen, setExchrtOpen] = useState(false) // 환율정보 조회(M74)
  const [abandonOpen, setAbandonOpen] = useState(false) // 입찰포기신청서(P03)
  const [cancelOpen, setCancelOpen] = useState(false) // 입찰취소신청서(P04)
  const [techEvlOpen, setTechEvlOpen] = useState(false) // 기술평가결과조회(P01)
  const [prdcpOpen, setPrdcpOpen] = useState(false) // 생산능력서류제출(P06)
  // P03/P04/P06 은 바텀시트 콘텐츠 전용 — 컨테이너/footer 는 여기(부모)가 소유, 제출은 ref 핸들로 호출.
  const abandonRef = useRef<BidAbndAperWrtHandle>(null)
  const cancelRef = useRef<BidRtrcnAperInqHandle>(null)
  const prdcpRef = useRef<PrdctnAbltDcmntSbmsnHandle>(null)

  // 보기 버튼 → 결과조회 연계. 기술평가/생산능력서류는 풀팝업(P01/P06), 그 외는 결과 화면 이동.
  const handleView = (key: string) => {
    if (key === 'apfr') navigate('/bd/reg-rslt', { state: detail })
    else if (key === 'pq') navigate('/bd/srng-rslt', { state: detail })
    else if (key === 'techEvl') setTechEvlOpen(true)
    else if (key === 'prdcp') setPrdcpOpen(true)
    else console.log('[M02] 보기', key) // 공고/입찰서 등 — 추후 연계
  }
  const rows = buildRows(detail, handleView)
  const status = statusBadge(detail)

  // 요약 헤더 배지 — 진행상태(색) + 업무구분 + 계약방법 + 신청유형.
  const summaryBadges: SummaryInfoBadge[] = [
    ...(status ? [{ key: 'status', label: status.label, type: 'solid' as const, color: status.color }] : []),
    { key: 'task', label: detail.taskSeNm },
    { key: 'ctrt', label: detail.ctrtMthdNm },
    ...(detail.bfhdSrng ? [{ key: 'bfhd', label: '사전심사' }] : []),
    ...(detail.bidPrgrsApfr ? [{ key: 'apfr', label: '입찰참가' }] : []),
  ]

  // 바로가기(플로팅) 버튼 — 진행 상태에 따라 분기(설계서 slide68 "이벤트 설명" 노출 조건).
  //   입찰참가신청서 작성: 입찰참가 대상(bidPrgrsApfr)이고 아직 등록확정 전(bidRegCfmtnYn!=='Y').
  //   사전심사 신청: 사전심사 대상(bfhdSrng)이고 결과 없음(미신청).
  //   입찰서 작성: 입찰서 대상(tndr)이고 (등록확정 bidRegCfmtnYn==='Y' 또는 사후등록심사 tndrSbmsnPntmCd==='post')이며 아직 완료 전.
  //     └ slide68 원문: "입찰참가신청 상태가 등록확정 또는 입찰등록심사 시점이 사후심사인 경우 버튼 보이기".
  //   입찰포기/취소: 입찰서를 제출한 경우(tndrStatNm==='제출').
  type Shortcut = { id: string; label: string; variant: 'primary' | 'secondary' | 'tertiary' }
  const shortcutItems: Shortcut[] = []
  if (detail.bidPrgrsApfr && detail.bidRegCfmtnYn !== 'Y') {
    shortcutItems.push({ id: 'apply', label: '입찰참가신청서 작성하기', variant: 'primary' })
  }
  if (detail.bfhdSrng && !detail.bfhdSrngRsltYn) {
    shortcutItems.push({ id: 'bfhdAply', label: '사전심사 신청하기', variant: 'primary' })
  }
  const canTender =
    detail.tndr &&
    (detail.bidRegCfmtnYn === 'Y' || detail.tndrSbmsnPntmCd === 'post') &&
    detail.tndrStatNm !== '완료'
  if (canTender) {
    shortcutItems.push({ id: 'bid', label: '입찰서(견적서) 작성하기', variant: 'primary' })
  }
  if (detail.tndrStatNm === '제출') {
    shortcutItems.push({ id: 'giveup', label: '입찰포기 신청서 작성하기', variant: 'secondary' })
    shortcutItems.push({ id: 'cancel', label: '입찰취소 신청서 작성하기', variant: 'secondary' })
  }
  shortcutItems.push({ id: 'fx', label: '환율정보 바로가기', variant: 'tertiary' })

  const handleShortcut = (id: string) => {
    setShortcutOpen(false)
    switch (id) {
      case 'apply': // 입찰참가신청서작성(M01) — 등록반려/반려신청조회 플로팅은 그 화면에 있다.
        navigate(`/bd/prgrs/${detail.rNum}/apfr`, { state: detail })
        break
      case 'bfhdAply': // 사전심사(PQ) 신청(M01)
        navigate('/bd/bfhd-srng-aply', { state: detail })
        break
      case 'bid': // 입찰서(견적서) 작성하기 → 전자서명(M21) → 신청완료(M08). 입찰서 작성 폼(M01~M07)은 추후.
        navigate(`/bd/prgrs/${detail.rNum}/elsgn`, { state: { detail, aplyType: 'tndr' } })
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
      default:
        console.log('[M02] 바로가기', id) // 입찰서 작성 등 — 추후 연계
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 헤더 — badges(상태/업무구분/계약방법/신청유형) + 공고번호 + 출력 + 입찰건명 */}
      <SummaryInfo
        badges={summaryBadges}
        subtitle={detail.pbancNo}
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
      {/* 기술평가결과조회(P01) — 바텀시트(읽기전용 조회, footer=닫기) */}
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
        <TechEvlRsltInq detail={detail} />
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
    </div>
  )
}
