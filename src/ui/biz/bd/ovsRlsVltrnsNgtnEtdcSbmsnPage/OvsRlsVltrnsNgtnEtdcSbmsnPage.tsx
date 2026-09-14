// 국외 공개수의협상 견적서 작성(제출) 마법사 - 스탭1 일반정보 + 셸 (MUI-BD-12-M74 컨테이너 · 스탭1 일반정보 T74(구 M74 탭 — v1.83 재편), 설계서 slide419~420).
// 진입: 공개수의협상계획상세 > 우측 하단 + 바로가기 > 견적서 작성. 레퍼런스: OvsTndrSbmsnPage.
// 셸: SummaryInfo + StepBar(신청서/서명/제출) + TabList(4스텝) + 스텝콘텐츠 + 하단 액션바(asymmetric). FAB 없음.
// ⚠️ 페이지(헤더) 타이틀 = '견적서 작성'(라우트 handle). 설계서 우선.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsRlsVltrnsNgtnEtdcSbmsn2 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn2'
import { OvsRlsVltrnsNgtnEtdcSbmsn3 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn3'
import { OvsRlsVltrnsNgtnEtdcSbmsn4 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn4'
import type { MockOvsRlsVltrnsGeneral, MockOvsRlsVltrnsSummary } from '@/types/mock/bd'

// 진행단계(설계서 slide419): 신청서 → 서명 → 제출. 견적서 작성은 '신청서' 단계.
const STEPS: StepItem[] = [
  { label: '신청서', state: 'doing' },
  { label: '서명', state: 'todo' },
  { label: '제출', state: 'todo' },
]

// 스텝 탭 (설계서 slide419: 1.일반정보 / 2.업체정보 / 3.입찰품목 / 4.첨부파일)
const TABS: TabItem[] = [
  { value: 'general', label: '1. 일반정보' },
  { value: 'bzenty', label: '2. 업체정보' },
  { value: 'item', label: '3. 입찰품목' },
  { value: 'file', label: '4. 첨부파일' },
]

// 상단 요약 fallback — 계획상세와 동일 값(설계서 slide411/419).
const MOCK_SUMMARY: MockOvsRlsVltrnsSummary = {
  taskSeNm: '국외',
  ctrtMthdNm: '수의계약',
  intgRfrncNo: 'BAD83990EFD',
  pbancNo: 'EFD0007-2',
  bizNm: '500MD 부품',
  prchsDmndNo: 'BAD839380-001',
  sumDrctnAmt: '$ 126,000.18',
  etdcDdlnDt: '2025-03-02 15:00:00',
  bdopnDt: '2025-03-02 15:00:00',
}

// 스탭1 일반정보 데이터 — 설계서 slide420 공고일반 값·형식 그대로.
const MOCK_GENERAL: MockOvsRlsVltrnsGeneral = {
  pbancNo: 'EFD0007-2',
  pbancType: '정상공고',
  pbancRqstYmd: '2022-11-12',
  prchsDmndNo: 'BAD839380-001',
  intgRfrncNo: 'BAD83990EFD',
  bizNm: '500MD 부품',
  ctrtMthdNm: '수의계약',
  sumDrctnAmt: '$ 126,000.18',
  itemQty: '100',
  exchrtAplcnYmd: '2025-03-02',
  bdopnDt: '2025-03-02 15:00:00',
  etdcDdlnDt: '2025-03-02 15:00:00',
  picDeptNm: '국제부품계약팀',
  picNm: '정영금',
  picTlno: '02-1234-5678',
  picMblTelno: '010-1234-5678',
}

const scrollTop = () => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })

export function OvsRlsVltrnsNgtnEtdcSbmsnPage() {
  const navigate = useNavigate()
  const summary = (useLocation().state as MockOvsRlsVltrnsSummary | null) ?? MOCK_SUMMARY
  const [tab, setTab] = useState('general')

  const tabOrder = TABS.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isFirst = tabIdx === 0
  const isLast = tabIdx === tabOrder.length - 1
  const goTab = (next: string) => {
    setTab(next)
    scrollTop()
  }
  const handlePrev = () => (isFirst ? navigate(-1) : goTab(tabOrder[tabIdx - 1]))
  const handleNext = () => {
    if (!isLast) {
      goTab(tabOrder[tabIdx + 1])
      return
    }
    console.log('[M74] 공개수의협상 견적서 제출', summary.intgRfrncNo) // 추후 API: bdService.insertEtdcSbmsn
  }

  // 스탭1 일반정보 표 (slide420) — 계획상세 일반정보와 동일.
  const g = MOCK_GENERAL
  const generalRows: TableRow[] = [
    { label: '공고번호', value: g.pbancNo },
    { label: '공고구분', value: g.pbancType },
    { label: '공고일자', value: g.pbancRqstYmd },
    { label: '구매요청번호', value: g.prchsDmndNo },
    { label: '통합참조번호', value: g.intgRfrncNo },
    { label: '사업명', value: g.bizNm },
    { label: '계약방법', value: g.ctrtMthdNm },
    { label: '총금액', value: g.sumDrctnAmt, type: 'number' },
    { label: '공고품목수', value: g.itemQty, type: 'number' },
    { label: '환율적용일자', value: g.exchrtAplcnYmd },
    { label: '개찰일시', value: g.bdopnDt },
    { label: '견적서제출마감일시', value: g.etdcDdlnDt },
  ]
  const picRows: TableRow[] = [
    { label: '담당 부서명', value: g.picDeptNm },
    { label: '담당자', value: g.picNm },
    {
      label: '연락처',
      value: (
        <div className="flex flex-col gap-0.5">
          <span>{g.picTlno}</span>
          <span>{g.picMblTelno}</span>
        </div>
      ),
      type: 'combination',
    },
  ]

  const renderTab = () => {
    switch (tab) {
      case 'bzenty':
        return <OvsRlsVltrnsNgtnEtdcSbmsn2 />
      case 'item':
        return <OvsRlsVltrnsNgtnEtdcSbmsn3 />
      case 'file':
        return <OvsRlsVltrnsNgtnEtdcSbmsn4 />
      default:
        return (
          <>
            <SectionTitle as="h3" topDivider>담당자 정보</SectionTitle>
            <div className="px-4 py-4">
              <Table rows={picRows} />
            </div>
            <SectionTitle as="h3" topDivider>일반정보</SectionTitle>
            <div className="px-4 py-4">
              <Table rows={generalRows} />
            </div>
          </>
        )
    }
  }

  return (
    <div className="flex w-full flex-col">
      <SummaryInfo
        badges={[{ key: 'task', label: summary.taskSeNm }, { key: 'ctrt', label: summary.ctrtMthdNm }]}
        subtitle={`통합참조번호 ${summary.intgRfrncNo} / 공고번호 ${summary.pbancNo}`}
        title={summary.bizNm}
      />

      {/* 진행단계 — 신청서 → 서명 → 제출 (설계서 slide419) */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
      </div>

      {/* 공지사항(v0.87 검토 107번) — 국외 공고 상세 dm_ntcInfo 패턴의 상단 Infobox 공지 박스. 내역 없으면 미표시.
          목업 1건 — 추후 API 응답(공지 목록)으로 교체. */}
      <div className="px-4 pb-2 pt-4">
        <Infobox
          title="공지사항"
          items={['[2025-12-22] 견적서 제출 전 공개수의협상 공고문 및 견적 유의사항을 반드시 확인하시기 바랍니다.']}
        />
      </div>

      {/* 스텝 탭 — 스크롤 시 상단 고정(sticky). 스크롤 주체는 AppLayout 의 #app-scroll. */}
      <div className="sticky top-0 z-20 bg-white">
        <TabList items={TABS} value={tab} onChange={goTab} />
      </div>

      {/* 스텝 콘텐츠 */}
      {renderTab()}

      {/* 하단 액션바 — 이전/다음으로(마지막=제출하기). 비율 asymmetric(이전 100px + 우측 flex-1). */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '이전', variant: 'secondary', onClick: handlePrev },
            { label: isLast ? '제출하기' : '다음으로', variant: 'primary', onClick: handleNext },
          ]}
        />
      </div>

      {/* 플로팅 버튼 — 맨위로(사용자 요청). 상세와 달리 + 없음. */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollTop} />
    </div>
  )
}
OvsRlsVltrnsNgtnEtdcSbmsnPage.displayName = 'OvsRlsVltrnsNgtnEtdcSbmsnPage'
