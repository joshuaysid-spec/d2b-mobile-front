// 입찰서(견적서) 작성 (MUI-BD-06-M01~M07, Figma 9973-62571~9973-67681 · 설계서 02입찰 slide121~131).
// 접속: 홈 > 입찰진행 > 상세 > 입찰서(견적서) 작성하기. 입찰진행 상세(M02) 바로가기 → 이 화면.
// 레이아웃(Figma M01): 요약 → 업무도움(Infobox) → 탭(TabList) → 탭 콘텐츠 → 하단 액션바(취소·이전/다음으로·신청) + 맨위로 FAB.
// 탭 = 하위 스텝(설계서 slide121): 일반정보 → 품목내역(단가제만) → 투찰내역 → 복수예비가격 → 파일첨부
//   → 동가낙찰 선추첨(조건부) → 약관동의. 마지막 탭 [신청] → 전자서명(M21) → 신청완료(M08).
// 탭 노출 조건(설계서): 품목내역 = 입찰방법이 단가제인 경우(slide121). 동가낙찰 선추첨 = 20210415 이전 공고이고
//   적격심사 'Y' 또는 계약방법 F/J/P 가 아닌 경우 보이기(slide126·130) — 목업은 모두 노출.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { TndrWrt_Stp1 } from '@/ui/biz/bd/tndrWrt/TndrWrt_Stp1'
import { TndrWrt_Stp2 } from '@/ui/biz/bd/tndrWrt/TndrWrt_Stp2'
import { TndrWrt_Stp3 } from '@/ui/biz/bd/tndrWrt/TndrWrt_Stp3'
import { TndrWrt_Stp4 } from '@/ui/biz/bd/tndrWrt/TndrWrt_Stp4'
import { TndrWrt_Stp5 } from '@/ui/biz/bd/tndrWrt/TndrWrt_Stp5'
import { TndrWrt_Stp6 } from '@/ui/biz/bd/tndrWrt/TndrWrt_Stp6'
import { TndrWrt_Stp7 } from '@/ui/biz/bd/tndrWrt/TndrWrt_Stp7'
import type { ApiError } from '@/types/api'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 slide121 예시값 그대로.
// 입찰방법(bidMthdNm) 단가제 → 품목내역 탭 노출(설계서 slide121).
const MOCK_DETAIL: MockBidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '긴급공고 LDG0097-1',
  prcmNo: '56349',
  bidNm: '특수작전용대물타격무인향',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '031-940-0000',
  ctrtMthdNm: '경쟁입찰', // 요약 배지(입찰방식). 표의 '계약방법'(일반확정계약)과는 다른 항목.
  bidMthdNm: '단가제',
  bidClrsDt: '2025-12-24 10:30',
  tndrSbmsnDdlnDt: '2025-12-24 10:30',
  bzentySeNm: '대표',
  bfhdSrng: false,
  bidPrgrsApfr: true,
  tndr: true,
  techEvl: false,
  prdcpDcmntSbms: false,
  apfrStatNm: '신청',
  bidRegCfmtnYn: 'Y',
  tndrStatNm: '미제출',
}

export function TndrWrtPage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as MockBidPrgrsItem | null) ?? MOCK_DETAIL

  // 탭 노출 조건 — 품목내역: 입찰방법 단가제(slide121). 동가낙찰 선추첨: 공고일자·계약방법 조건(slide126·130, 목업 노출).
  const isUntprc = detail.bidMthdNm?.includes('단가제')
  const showSmprcScsbd = true // 추후 API: 공고일자(20210415 이전)·적격심사·계약방법(F/J/P) 조건 분기
  const tabs: TabItem[] = [
    { value: '일반정보', label: '일반정보' },
    ...(isUntprc ? [{ value: '품목내역', label: '품목내역' }] : []),
    { value: '투찰내역', label: '투찰내역' },
    { value: '복수예비가격', label: '복수예비가격' },
    { value: '파일첨부', label: '파일첨부' },
    ...(showSmprcScsbd ? [{ value: '동가낙찰선추첨', label: '동가낙찰 선추첨' }] : []),
    { value: '약관동의', label: '약관동의' },
  ]
  const [tab, setTab] = useState('일반정보')
  const [submitError, setSubmitError] = useState<string | null>(null) // 입찰서 저장 실패 안내(null=닫힘)
  const insertTndrSbmsn = bdQueries.useInsertTndrSbmsn()

  // 탭 = 하위 스텝. 다음/이전으로 탭 이동, 마지막 탭(약관동의)의 [신청] = 전자서명(M21) → 신청완료(M08).
  const tabOrder = tabs.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isFirstTab = tabIdx === 0
  const isLastTab = tabIdx === tabOrder.length - 1
  const goTab = (next: string) => {
    setTab(next)
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleNext = async () => {
    if (!isLastTab) {
      goTab(tabOrder[tabIdx + 1])
      return
    }
    // 신청(설계서 slide131 제출 클릭) — 입찰서 저장 후 전자서명(M21). 실패 시 AlertModal 안내.
    try {
      await insertTndrSbmsn.mutateAsync({ pbancNo: detail.pbancNo })
      navigate('/bd/elsgn', { state: { detail, aplyType: 'tndr' } })
    } catch (err) {
      setSubmitError(
        (err as ApiError | null)?.message ?? '입찰서 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  }
  const handlePrev = () => {
    if (!isFirstTab) {
      goTab(tabOrder[tabIdx - 1])
      return
    }
    navigate(-1) // 첫 탭 = 취소(작성 중단)
  }

  // 탭별 콘텐츠(M01 일반정보 ~ M07 약관동의)
  const renderTab = () => {
    switch (tab) {
      case '품목내역':
        return <TndrWrt_Stp2 detail={detail} />
      case '투찰내역':
        return <TndrWrt_Stp3 detail={detail} />
      case '복수예비가격':
        return <TndrWrt_Stp4 detail={detail} />
      case '파일첨부':
        return <TndrWrt_Stp5 detail={detail} />
      case '동가낙찰선추첨':
        return <TndrWrt_Stp6 detail={detail} />
      case '약관동의':
        return <TndrWrt_Stp7 detail={detail} />
      default:
        return <TndrWrt_Stp1 detail={detail} />
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/입찰방식 배지 + 공고번호 + 입찰건명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />

      {/* 업무도움 — 접힘 기본 */}
      <Infobox
        title="업무도움"
        items={['입찰서(견적서)를 작성하는 화면입니다. 단계별로 정보를 확인하고 다음으로 진행하세요.']}
      />

      {/* 입찰서 하위 탭 — 다음/이전으로 스텝 이동 */}
      <TabList items={tabs} value={tab} onChange={goTab} />

      {/* 탭별 콘텐츠 */}
      {renderTab()}

      {/* 하단 액션바 — 첫 탭=취소/다음으로 · 중간=이전/다음으로 · 마지막=이전/신청(Figma M07) */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: isFirstTab ? '취소' : '이전', variant: 'secondary', onClick: handlePrev },
            { label: isLastTab ? '신청' : '다음으로', variant: 'primary', onClick: handleNext },
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

      {/* 입찰서 저장(신청) 실패 안내 */}
      <AlertModal
        open={submitError !== null}
        onOpenChange={(open) => {
          if (!open) setSubmitError(null)
        }}
        variant="error"
        title="입찰서 신청 실패"
        description={submitError}
        primaryAction={{ label: '확인', onClick: () => setSubmitError(null) }}
      />
    </div>
  )
}
TndrWrtPage.displayName = 'TndrWrtPage'
