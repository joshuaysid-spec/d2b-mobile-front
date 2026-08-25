// 입찰진행상세 - 입찰서(견적서)조회 (MUI-BD-06-M09, 설계서 영문ID TndrInqPage · 02입찰 v1.88 slide172).
// 접속: 홈 > 입찰 진행 > 상세 > 입찰서 [내용 보기] → 이 화면. 라우트 /bd/tndrInq(식별자는 navigate state).
// 성격: 제출 완료된 입찰서를 읽기전용으로 조회. 작성판(tndrWrt, M01~M07)과 탭 구성은 같지만
//   입력 컨트롤 → 값 표시, 신청/전자서명 → 탭 자유 이동으로 바뀌고 검증·저장이 없다.
// 구성: 요약(SummaryInfo, 스크롤 시 축소) + 탭 7개 sticky → 탭 콘텐츠 → 이전/다음으로 → 맨위로 FAB.
// 탭1(일반정보)은 M09 자신의 본문(설계서 slide172 "입찰서작성중 일반정보(MUI-BD-06-M01)")이라 페이지가 직접
//   렌더하고 신청 번호/신청 완료 일시를 함께 노출한다. 탭2~7 은 T02~T07 파일이 담당한다.
// ⚠️ 탭 노출 조건(품목내역=단가제 · 동가낙찰 선추첨=공고일자/계약방법)은 작성판에만 두고 조회판은 7탭 고정 —
//   설계서 slide172~178 의 탭 번호(1~7)가 고정 표기라 탭이 빠지면 번호가 어긋난다.
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { ROUTES } from '@/constants/routes'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { TndrInq_tab2 } from '@/ui/biz/bd/tndrInq/TndrInq_tab2'
import { TndrInq_tab3 } from '@/ui/biz/bd/tndrInq/TndrInq_tab3'
import { TndrInq_tab4 } from '@/ui/biz/bd/tndrInq/TndrInq_tab4'
import { TndrInq_tab5 } from '@/ui/biz/bd/tndrInq/TndrInq_tab5'
import { TndrInq_tab6 } from '@/ui/biz/bd/tndrInq/TndrInq_tab6'
import { TndrInq_tab7 } from '@/ui/biz/bd/tndrInq/TndrInq_tab7'
import type { BidPrgrsDetail } from '@/types/mock/bd'

// 입찰서 내역 탭(설계서 slide172 탭 버튼) — 1.일반정보 + T02~T07.
const TABS: TabItem[] = [
  { value: 'tab1', label: '1. 일반정보' },
  { value: 'tab2', label: '2. 품목내역' },
  { value: 'tab3', label: '3. 투찰내역' },
  { value: 'tab4', label: '4. 복수예비가격' },
  { value: 'tab5', label: '5. 파일첨부' },
  { value: 'tab6', label: '6. 동가낙찰 선추첨' },
  { value: 'tab7', label: '7. 약관동의' },
]

// 진입 state — 입찰진행 상세(M02)에서 넘어온 항목 + 신청완료(M08)와 동일한 접수 항목(rcptNo/rcptDt).
type TndrInqState = BidPrgrsDetail & { rcptNo?: string; rcptDt?: string }

export function TndrInqPage() {
  // 훅은 state 가드보다 위에서 무조건 호출(hooks-order).
  const stateItem = useLocation().state as TndrInqState | null
  const [tab, setTab] = useState('tab1')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 직접 URL 진입·새로고침으로 state 가 없으면 입찰진행 목록으로 되돌린다.
  if (!stateItem) return <Navigate to={ROUTES.BD_PRGRS} replace />
  const detail = stateItem

  const tabOrder = TABS.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isLastTab = tabIdx === tabOrder.length - 1
  const goTab = (next: string) => {
    setTab(next)
    goToContentTop()
  }

  // 입찰서 조회(설계서 slide172) — 신청 번호/신청 완료 일시. 항목명은 신청완료(M08)와 동일한 임시키 rcptNo/rcptDt.
  const aplyRows: TableRow[] = [
    { label: '신청 번호', value: detail.rcptNo ?? '0000 000 0000' },
    { label: '신청 완료 일시', value: detail.rcptDt ?? '2025-10-31 12:30' },
  ]

  // 일반정보(slide172 dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 나머지는 설계서 예시값 목업.
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: '육군 탄약지원사령부' },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '집행유형', value: '제조' },
    { label: '개찰일시', value: detail.bdopnDt ?? '2025-12-24 10:30' },
    { label: '계약방법', value: '일반확정계약' },
    { label: '입찰방법', value: detail.bidMthdNm },
    { label: '총수량', value: '1 AY', type: 'number' },
    { label: '예산금액', value: '619,520,000 원', type: 'number' },
    { label: '낙찰자결정방법', value: '적격심사제' },
    { label: '적격심사 여부', value: '대상' },
    { label: '기초예비가격', value: '619,520,000 원', type: 'number' },
    { label: '사정률(%)', value: '±2 %' },
    { label: '업체입찰보증금', value: '30,976,000 원', type: 'number' },
    { label: '2단계경쟁 전자파일 제출 가능', value: '대상' },
  ]

  // 업체내역(slide172 dmt_bzentyInfo)
  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: '00000' },
    { label: '업체명', value: '㈜업체명표기영역' },
    { label: '대표자', value: '홍길동' },
    { label: '사업자등록번호', value: '123-56-78901' },
    { label: '전화번호', value: '02-1234-5678' },
    { label: '주소', value: '서울특별시 용산구 이태원로 22' },
  ]

  const renderTabContent = (current: string) => {
    switch (current) {
      case 'tab2':
        return <TndrInq_tab2 detail={detail} />
      case 'tab3':
        return <TndrInq_tab3 detail={detail} />
      case 'tab4':
        return <TndrInq_tab4 />
      case 'tab5':
        return <TndrInq_tab5 />
      case 'tab6':
        return <TndrInq_tab6 />
      case 'tab7':
        return <TndrInq_tab7 />
      default:
        return (
          <>
            <SectionTitle as="h3" topDivider>
              입찰서 조회
            </SectionTitle>
            <div className="px-4 py-4">
              <Table rows={aplyRows} />
            </div>

            <SectionTitle as="h3" topDivider>
              일반정보
            </SectionTitle>
            <div className="px-4 py-4">
              <Table rows={pbancRows} />
            </div>

            <SectionTitle as="h3" topDivider>
              업체내역
            </SectionTitle>
            <div className="px-4 py-4">
              <Table rows={bzentyRows} />
            </div>
          </>
        )
    }
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정, 스크롤 시 요약 축소 */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { key: 'task', label: detail.taskSeNm },
            { key: 'ctrt', label: detail.ctrtMthdNm },
          ]}
          subtitle={detail.pbancNo}
          title={detail.bidNm}
        />
        <div className="px-4">
          <TabList items={TABS} value={tab} onChange={goTab} />
        </div>
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱하도록 min-h 확보 */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 하단 액션바 — 조회 전용이라 탭 이동만 한다(제출 없음). */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout={isLastTab ? 'single' : 'asymmetric'}
          items={[
            {
              label: '이전',
              variant: 'secondary',
              onClick: () => tabIdx > 0 && goTab(tabOrder[tabIdx - 1]),
              disabled: tabIdx === 0,
            },
            ...(isLastTab
              ? []
              : [
                  {
                    label: '다음으로',
                    variant: 'primary' as const,
                    onClick: () => goTab(tabOrder[tabIdx + 1]),
                  },
                ]),
          ]}
        />
      </div>

      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
TndrInqPage.displayName = 'TndrInqPage'
