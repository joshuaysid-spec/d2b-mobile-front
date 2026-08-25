// 국외 공개수의협상 견적서 조회(상세, 읽기전용) - 스탭1 일반정보 + 셸 (MUI-BD-12-M78 컨테이너 · 스탭1 일반정보 T78(구 M78 탭 — v1.83 재편), 설계서 slide429~430).
// 진입: 공개수의협상계획상세 > 우측 하단 + 바로가기 > 견적서 조회. 레퍼런스: OvsRlsVltrnsNgtnEtdcSbmsnPage(견적서 작성).
// 셸: SummaryInfo + StepBar(신청서/서명/제출, 전부 done) + TabList(4탭) + 탭콘텐츠(읽기전용). 하단 액션바·FAB 없음.
// ⚠️ 페이지(헤더) 타이틀 = '견적서 조회'(라우트 handle). 설계서 우선 — 설계서에 없는 요소는 제거.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsRlsVltrnsNgtnEtdcDtl2 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtl2'
import { OvsRlsVltrnsNgtnEtdcDtl3 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtl3'
import { OvsRlsVltrnsNgtnEtdcDtl4 } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcDtl4'
import { OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt } from '@/ui/biz/bd/ovsRlsVltrnsNgtnEtdcDtl/OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt'
import type { OvsRlsVltrnsGeneral, OvsRlsVltrnsSummary } from '@/types/mock/bd'

// 진행단계(설계서 slide429 "신청서 전체 진행단계 표시"): 신청서 → 서명 → 제출.
// 이미 제출된 견적서 조회이므로 전부 완료(done).
const STEPS: StepItem[] = [
  { label: '신청서', state: 'done' },
  { label: '서명', state: 'done' },
  { label: '제출', state: 'done' },
]

// 탭 (설계서 slide429: 1.일반정보 / 2.업체정보 / 3.입찰품목 / 4.첨부파일)
const TABS: TabItem[] = [
  { value: 'general', label: '1. 일반정보' },
  { value: 'bzenty', label: '2. 업체정보' },
  { value: 'item', label: '3. 입찰품목' },
  { value: 'file', label: '4. 첨부파일' },
]

// 상단 요약 fallback (직접 URL 진입/새로고침) — 계획상세와 동일 값(설계서 slide411/429).
const MOCK_SUMMARY: OvsRlsVltrnsSummary = {
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

// 스탭1 일반정보 데이터 — 설계서 slide430 공고일반 값·형식 그대로.
const MOCK_GENERAL: OvsRlsVltrnsGeneral = {
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

export function OvsRlsVltrnsNgtnEtdcDtlPage() {
  const navigate = useNavigate()
  const summary = (useLocation().state as OvsRlsVltrnsSummary | null) ?? MOCK_SUMMARY
  const [tab, setTab] = useState('general')
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 바텀시트
  const [rtrcnOpen, setRtrcnOpen] = useState(false) // 견적서 취소신청서작성(P82) 풀팝업

  const goTab = (next: string) => {
    setTab(next)
    scrollTop()
  }

  // 스탭1 일반정보 표 (slide430) — 계획상세 일반정보와 동일.
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
        return <OvsRlsVltrnsNgtnEtdcDtl2 />
      case 'item':
        return <OvsRlsVltrnsNgtnEtdcDtl3 />
      case 'file':
        return <OvsRlsVltrnsNgtnEtdcDtl4 />
      default:
        // 일반정보 → 담당자 정보 순서. Accordion 사용(계획상세 일반정보 탭과 동일 패턴).
        return (
          <div className="py-4">
            <Accordion type="multiple" defaultValue={['general', 'contact']} className="w-full">
              <AccordionSection value="general" title="일반정보" borderTop={false}>
                <Table rows={generalRows} />
              </AccordionSection>
              <AccordionSection value="contact" title="담당자 정보">
                <Table rows={picRows} />
              </AccordionSection>
            </Accordion>
          </div>
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

      {/* 진행단계 — 신청서 → 서명 → 제출 (설계서 slide429, 전부 완료) */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
      </div>

      {/* 탭 — 스크롤 시 상단 고정(sticky). 스크롤 주체는 AppLayout 의 #app-scroll. */}
      <div className="sticky top-0 z-20 bg-white">
        <TabList items={TABS} value={tab} onChange={goTab} />
      </div>

      {/* 탭 콘텐츠(읽기전용) */}
      {renderTab()}

      {/* 플로팅 버튼 — 맨위로 + 바로가기(+) (사용자 요청) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 바텀시트 — 견적서 취소 신청서 작성(P82) / 결과조회(M83). 해당 화면 미구현 → 스텁. */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={[
            {
              label: '공개수의협상견적서 취소 신청서 작성',
              variant: 'primary',
              onClick: () => {
                setShortcutOpen(false)
                setRtrcnOpen(true) // 공개수의협상견적서취소신청서작성(P82) 바텀시트
              },
            },
            {
              label: '공개수의협상 결과조회',
              variant: 'secondary',
              onClick: () => {
                setShortcutOpen(false)
                // 공개수의협상 결과조회(M83). 요약을 state 로 전달.
                navigate('/bd/ovsRlsVltrnsNgtnSrngRsltInq', { state: summary })
              },
            },
          ]}
        />
      </BottomSheet>

      {/* 견적서 취소신청서작성(P82) — 풀팝업(헤더/footer 자체 소유, 제출 → 확인 모달) */}
      <OvsRlsVltrnsNgtnEtdcRtrcnApfrWrt open={rtrcnOpen} onOpenChange={setRtrcnOpen} detail={summary} />
    </div>
  )
}
OvsRlsVltrnsNgtnEtdcDtlPage.displayName = 'OvsRlsVltrnsNgtnEtdcDtlPage'
