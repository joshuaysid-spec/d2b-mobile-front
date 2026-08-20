// 입찰내역 작성 (MUI-BD-01-M76 컨테이너 · 탭 T74 일반정보 · T75·T76 입찰내역(구 M77·M78 — v1.83 재편), 설계서 07국외입찰공고상세 slide312~319)
// 접속: 홈 > 마이페이지 > 국외 보관함 > 국외 보관함 상세 > 입찰내역 작성 (/bd/ovsTmprBidCnReg)
// 구성(TndrWrtPage 패턴): 요약(SummaryInfo) → 탭(일반정보 | 품목 목록) → 탭 콘텐츠 + 맨위로 FAB.
//   - 일반정보 탭(M76): 공고일반(dm_bscPbancInfo) + 담당자 정보 — 본 파일 인라인(Table).
//   - 품목 목록 탭: 입찰방법에 따라 단가제(M77 BidDsctn) / 총액제(M78 BidDsctn2) 를 같은 페이지에서 분기(페이지 복제 금지).
// 단가제/총액제 분기 테스트: 직접 URL 진입 시 ?bidMthdNm=총액제 쿼리로 M78(총액제) 확인 가능.
import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { OvsBfrTmprBidBidCnRegFullPopup } from '@/ui/biz/bd/ovsBfrTmprBidBidCnReg/OvsBfrTmprBidBidCnRegFullPopup'
import { BidDsctn } from '@/ui/biz/bd/ovsTmprBidCnReg/BidDsctn'
import { BidDsctn2 } from '@/ui/biz/bd/ovsTmprBidCnReg/BidDsctn2'
import type { BscPbancInfo } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 slide312~313 예시값 그대로.
const MOCK_BSC_PBANC_INFO: BscPbancInfo = {
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

export function OvsTmprBidCnRegPage() {
  const [searchParams] = useSearchParams()

  // 보관함 상세에서 navigate state 로 넘어온 항목 — 다른 유닛 화면에서 부분 필드만 넘어올 수 있어
  // fallback 목업 위에 병합해 직접 URL 진입/새로고침에도 화면이 완전히 그려지게 한다.
  const stateItem = useLocation().state as Partial<BscPbancInfo> | null
  const modeOverride = searchParams.get('bidMthdNm') // 테스트용: ?bidMthdNm=총액제
  const detail: BscPbancInfo = {
    ...MOCK_BSC_PBANC_INFO,
    ...(stateItem ?? {}),
    ...(modeOverride === '총액제' || modeOverride === '단가제'
      ? { bidMthdNm: modeOverride }
      : {}),
  }

  const tabs: TabItem[] = [
    { value: '일반정보', label: '일반정보' },
    { value: '품목목록', label: '품목 목록' },
  ]
  const [tab, setTab] = useState('일반정보')
  const goTab = (next: string) => {
    setTab(next)
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 이전공고입찰내역 불러오기 → 이전공고입찰내역등록 풀팝업(MUI-BD-01-P79)
  const [bfrBidOpen, setBfrBidOpen] = useState(false)
  const handleBfrBidCn = () => {
    console.log('[M76] 이전공고입찰내역 불러오기', detail.intgRfrncNo)
    // 추후 API: bdService.selectOvsBfrPbancBidCnList(intgRfrncNo)
    setBfrBidOpen(true)
  }

  // ── 일반정보 탭(M76) — 공고일반(dm_bscPbancInfo) + 담당자 정보 ──
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
  const picRows: TableRow[] = [
    { label: '담당 부서명', value: detail.picDeptNm },
    { label: '담당자', value: detail.picNm },
    { label: '연락처', value: detail.picTlno },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 입찰방법/계약방법 배지 + 통합참조번호·공고번호 + 사업명 + 주요 일정(slide312) */}
      <SummaryInfo
        badges={[
          { key: 'bidMthd', label: detail.bidMthdNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={`통합참조번호 ${detail.intgRfrncNo} / 공고번호 ${detail.pbancNo}-${detail.pbancOd}`}
        title={detail.bizNm}
        rows={[
          { label: '입찰참가등록마감일시', value: detail.regDdlnDt },
          { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
          { label: '개찰일자', value: detail.bdopnDt },
        ]}
      />

      {/* 탭 — 일반정보(M76) | 품목 목록(M77 단가제 / M78 총액제) */}
      <TabList items={tabs} value={tab} onChange={goTab} />

      {tab === '일반정보' ? (
        <>
          <PageTitle as="h2" className="px-4 pb-2 pt-4">
            일반정보
          </PageTitle>

          <SectionTitle as="h3" topDivider>
            일반정보
          </SectionTitle>
          <div className="px-4 py-4">
            <Table rows={pbancRows} />
          </div>

          <SectionTitle as="h3" topDivider>
            담당자 정보
          </SectionTitle>
          <div className="px-4 py-4">
            <Table rows={picRows} />
          </div>

          {/* 다음 — 품목 목록 탭으로 이동(다음=다음탭 마법사 컨벤션) */}
          <div className="px-4 pb-6 pt-2">
            <Button variant="primary" className="w-full" onClick={() => goTab('품목목록')}>
              다음
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* 이전공고입찰내역 불러오기 — 이전공고입찰내역등록(/bfr-bid-cn) 이동 */}
          <div className="px-4 pt-4">
            <Button variant="secondary" className="w-full" onClick={handleBfrBidCn}>
              이전공고 입찰내역 불러오기
            </Button>
          </div>

          {/* 입찰방법에 따라 단가제(M77)/총액제(M78) 분기 — 같은 페이지, 데이터로 분기 */}
          {detail.bidMthdNm === '총액제' ? (
            <BidDsctn2 detail={detail} />
          ) : (
            <BidDsctn detail={detail} />
          )}
        </>
      )}

      {/* 이전공고입찰내역등록 (MUI-BD-01-P79) — 풀페이지 팝업 */}
      <OvsBfrTmprBidBidCnRegFullPopup
        open={bfrBidOpen}
        onOpenChange={setBfrBidOpen}
        lockerId={detail.intgRfrncNo}
      />

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
OvsTmprBidCnRegPage.displayName = 'OvsTmprBidCnRegPage'
