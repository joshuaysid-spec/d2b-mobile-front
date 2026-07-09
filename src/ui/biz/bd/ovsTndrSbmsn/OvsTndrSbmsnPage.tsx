// 국외 입찰서제출 - 스탭1 일반정보 (MUI-BD-06-M71, 설계서 08국외입찰진행 slide366·370).
// 접속: 홈 > 입찰 진행 > 입찰서제출 (/bd/ovs/prgrs/:id/tndr-sbmsn).
// 레이아웃(국내 TndrWrtPage·BidPrtcpAperWrtPage 패턴 그대로): 요약(SummaryInfo) → 진행단계(StepBar)
//   → 업무도움(Infobox) → 스탭 탭(TabList: 1.일반정보 / 2.입찰참여품목 / 3.첨부파일) → 탭 콘텐츠
//   → 하단 액션바(이전/다음으로, 마지막 탭=신청하기) + 맨위로 FAB.
// 스탭1(일반정보)은 페이지 인라인, 스탭2(M72/M73)·스탭3(M74)은 Stp2/Stp3 컴포넌트.
// 마지막 탭 [신청하기] → 신청완료(M08, 기존 aplyCmptn 재사용).
//   (설계서 slide369 2026-07-02 화면 수정: '전자서명하기' → '신청하기' — 전자서명 단계 없이 신청완료로 이동)
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsTndrSbmsnPage_Stp2 } from '@/ui/biz/bd/ovsTndrSbmsn/Stp2'
import { OvsTndrSbmsnPage_Stp3 } from '@/ui/biz/bd/ovsTndrSbmsn/Stp3'
import type { BidPrgrsItem, OvsTndrSbmsnDetail } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 slide366 예시값 그대로.
const MOCK_OVS_TNDR_DETAIL: OvsTndrSbmsnDetail = {
  pbancNo: 'EFD0007',
  pbancOd: '2',
  prchsDmndNo: 'BAD839380-001',
  intgRfrncNo: 'BAD83990EFD',
  bizNm: '500MD부품',
  bidMth: '일반투찰',
  ctrtMthdNm: '일반경쟁',
  regDdlnDt: '2025-03-02 15:00:00',
  bdngDdlnDt: '2025-03-12 15:00:00',
  bdopnDt: '2025-03-13 15:00:00',
  exchrtAplcnYmd: '2025-02-13',
  picDeptNm: '국제부품계약팀',
  picNm: '정영금',
  picTlno: '02-1234-5678',
  bidMthdNm: '단가제',
}

// 진행단계(설계서 slide366): 신청서 → 서명 → 제출. 진입은 신청서 작성 단계.
const STEPS: StepItem[] = [
  { label: '신청서', state: 'doing' },
  { label: '서명', state: 'todo' },
  { label: '제출', state: 'todo' },
]

// 입찰서 스탭 탭(설계서 slide366): 1. 일반정보 / 2. 입찰참여품목 / 3. 첨부파일.
const TABS: TabItem[] = [
  { value: '일반정보', label: '1. 일반정보' },
  { value: '입찰참여품목', label: '2. 입찰참여품목' },
  { value: '첨부파일', label: '3. 첨부파일' },
]

export function OvsTndrSbmsnPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  // 목록(국외 입찰진행)에서 넘어온 항목으로 상단을 그린다 — 넘어온 항목에 없는 항목(담당자 등)은 목업 보완.
  // 직접 URL 진입(새로고침) 시에도 화면이 완전히 그려지도록 목업과 병합.
  const stateItem = (location.state ?? null) as Partial<OvsTndrSbmsnDetail> | null
  // 테스트용 입찰방법 오버라이드 — ?bidMthdNm=총액제 로 직접 진입해 M73(총액제) 확인 가능.
  const bidMthdParam = new URLSearchParams(location.search).get('bidMthdNm')
  const detail: OvsTndrSbmsnDetail = {
    ...MOCK_OVS_TNDR_DETAIL,
    ...stateItem,
    ...(bidMthdParam === '단가제' || bidMthdParam === '총액제'
      ? { bidMthdNm: bidMthdParam }
      : {}),
  }

  const [tab, setTab] = useState('일반정보')

  // 담당자 정보(설계서 slide366) — 담당 부서명/담당자/연락처(dm_bscPbancInfo picDeptNm·picNm·picTlno).
  const picRows: TableRow[] = [
    { label: '담당 부서명', value: detail.picDeptNm },
    { label: '담당자', value: detail.picNm },
    { label: '연락처', value: detail.picTlno },
  ]

  // 일반정보(설계서 slide366·370 dm_bscPbancInfo) — 항목명/형식 설계서 그대로.
  const pbancRows: TableRow[] = [
    { label: '공고번호-차수', value: `${detail.pbancNo}-${detail.pbancOd}` },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '사업명', value: detail.bizNm },
    { label: '입찰방식', value: detail.bidMth },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '입찰참가등록마감일시', value: detail.regDdlnDt },
    { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
    { label: '개찰일자', value: detail.bdopnDt },
    { label: '환율적용일자', value: detail.exchrtAplcnYmd },
  ]

  // 탭 = 하위 스텝. 다음/이전으로 탭 이동, 마지막 탭(첨부파일)의 [신청하기] = 신청완료(M08).
  const tabOrder = TABS.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isFirstTab = tabIdx === 0
  const isLastTab = tabIdx === tabOrder.length - 1
  const goTab = (next: string) => {
    setTab(next)
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleNext = () => {
    if (!isLastTab) {
      goTab(tabOrder[tabIdx + 1])
      return
    }
    // 신청하기(설계서 slide369·373 투찰 클릭) — 입찰 작성내역 암호화 저장(모의입찰 상태면 모의투찰).
    console.log('[M74] 국외 입찰서 제출(투찰)', detail.pbancNo, detail.pbancOd)
    // 추후 API: bdService.submitOvsTndr(pbancNo, pbancOd, ...)
    // 신청완료(M08) 요약 헤더 구동용 — 기존 AplyCmptnPage(BidPrgrsItem 기반) 재사용을 위한 매핑.
    const aplyDetail: BidPrgrsItem = {
      rNum: id ?? '0',
      taskSeNm: '국외',
      pbancNo: `${detail.pbancNo}-${detail.pbancOd}`,
      prcmNo: detail.prchsDmndNo,
      bidNm: detail.bizNm,
      rfrncNo: detail.intgRfrncNo,
      orderInstTelno: detail.picTlno,
      ctrtMthdNm: detail.ctrtMthdNm,
      bidMthdNm: detail.bidMthdNm ?? '단가제',
      bidClrsDt: detail.regDdlnDt,
      tndrSbmsnDdlnDt: detail.bdngDdlnDt,
      bzentySeNm: '대표',
      bfhdSrng: false,
      bidPrgrsApfr: true,
      tndr: true,
      techEvl: false,
      prdcpDcmntSbms: false,
      tndrStatNm: '제출',
    }
    navigate(`/bd/prgrs/${id ?? '0'}/aply-cmptn`, {
      state: {
        detail: aplyDetail,
        aplyType: 'tndr',
        rcptNo: '0000 000 0000',
        rcptDt: '2025-03-12 12:30',
      },
    })
  }
  const handlePrev = () => {
    if (!isFirstTab) {
      goTab(tabOrder[tabIdx - 1])
      return
    }
    navigate(-1) // 첫 탭 = 이전(작성 중단, 이전 화면으로)
  }

  // 탭별 콘텐츠 — 스탭1(M71)은 인라인, 스탭2(M72/M73)·스탭3(M74)은 컴포넌트.
  const renderTab = () => {
    switch (tab) {
      case '입찰참여품목':
        return <OvsTndrSbmsnPage_Stp2 detail={detail} />
      case '첨부파일':
        return <OvsTndrSbmsnPage_Stp3 detail={detail} />
      default:
        return (
          <>
            {/* 페이지 타이틀 */}
            <PageTitle as="h2" className="px-4 pb-2 pt-4">
              일반정보
            </PageTitle>

            {/* 공지사항 영역 — 설계서상 "공지사항이 있는 경우 표시" 조건부. 목업 생략. */}

            {/* 담당자 정보 섹션 */}
            <SectionTitle as="h3" topDivider>
              담당자 정보
            </SectionTitle>
            <div className="px-4 py-4">
              <Table rows={picRows} />
            </div>

            {/* 일반정보 섹션 */}
            <SectionTitle as="h3" topDivider>
              일반정보
            </SectionTitle>
            <div className="px-4 py-4">
              <Table rows={pbancRows} />
            </div>
          </>
        )
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/계약방법 배지 + 통합참조번호·공고번호 + 사업명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: '국외' },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={`통합참조번호 ${detail.intgRfrncNo} / 공고번호 ${detail.pbancNo}-${detail.pbancOd}`}
        title={detail.bizNm}
      />

      {/* 진행단계 표시기 — 신청서 → 서명 → 제출 (설계서 slide366) */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
      </div>

      {/* 업무도움 — 접힘 기본 */}
      <Infobox
        title="업무도움"
        items={[
          '일반경쟁 공고에 참가신청한 품목을 조회하고 각 품목별로 금액 제출 및 필요한 문서를 제출하는 화면입니다.',
        ]}
      />

      {/* 입찰서 스탭 탭 — 다음/이전으로 스텝 이동 */}
      <TabList items={TABS} value={tab} onChange={goTab} />

      {/* 탭별 콘텐츠(M71 일반정보 / M72·M73 입찰참여품목 / M74 첨부파일) */}
      {renderTab()}

      {/* 하단 액션바 — 이전/다음으로(마지막 탭=신청하기, 설계서 slide369) */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '이전', variant: 'secondary', onClick: handlePrev },
            { label: isLastTab ? '신청하기' : '다음으로', variant: 'primary', onClick: handleNext },
          ]}
        />
      </div>

      {/* 플로팅 — 맨위로 */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
OvsTndrSbmsnPage.displayName = 'OvsTndrSbmsnPage'
