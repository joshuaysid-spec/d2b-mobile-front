// 이행/적격심사상세 컨테이너(MUI-BD-10-M01, 설계서 02입찰 v1.83). 입찰결과상세 > 일반정보 > '이행적격심사 신청하기' → /bd/implt.
// 레퍼런스: 입찰결과상세 BidRsltDtlPage (요약정보+스텝바+탭+탭콘텐츠 동일 패턴).
// 구성: 요약정보(SummaryInfo) + 스텝바(StepBar, 입찰) + 탭4(일반정보/입찰·반려정보/파일첨부/심사결과)
//   + 탭 콘텐츠(일반정보=Implt1 T01 / 입찰·반려정보=Implt2 T02 / 파일첨부=Implt3 T03 / 심사결과=유형별 T04~T21)
//   + 탭별 하단 액션(다음으로/이전/취소/제출하기/목록) + 맨위로 FAB.
// 심사결과 탭은 유형(srngTyCd)별 18종(T04~T21)으로 갈림 — 물품(T05)=Implt, 그 외는 ImpltElgblRslt_* 로 분기(renderResultTab).
// 상세화면이라 검색필터 없음. 상단은 개찰목록 항목(navigate state)으로 그림 + 직접진입 fallback 목업.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Implt1 } from '@/ui/biz/bd/bidRsltDtl/Implt1'
import { Implt2 } from '@/ui/biz/bd/bidRsltDtl/Implt2'
import { Implt3 } from '@/ui/biz/bd/bidRsltDtl/Implt3'
import { Implt } from '@/ui/biz/bd/bidRsltDtl/Implt'
// 심사결과 탭 유형별(MUI-BD-10-T06~T21) — 유형 판별 임시 키 srngTyCd 로 분기. T04 통사(g2b)는 설계서 부재로 보류.
import { ImpltElgblRslt_Lbsvc } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_Lbsvc'
import { ImpltElgblRslt_ItemsUnderKrw1B } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_ItemsUnderKrw1B'
import { ImpltElgblRslt_ManufacturingofItemsUnderKrw1B } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_ManufacturingofItemsUnderKrw1B'
import { ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2015 } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2015'
import { ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2018 } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2018'
import { ImpltElgblRslt_PurchaseofItemsUnderKrw1B } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_PurchaseofItemsUnderKrw1B'
import { ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2015 } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2015'
import { ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2018 } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2018'
import { ImpltElgblRslt_BelowThreshold } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_BelowThreshold'
import { ImpltElgblRslt_ThresholdKrw1B } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_ThresholdKrw1B'
import { ImpltElgblRslt_OverKrw1B } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_OverKrw1B'
import { ImpltElgblRslt_Cstrn } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_Cstrn'
import { ImpltElgblRslt_TechLbsvc } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_TechLbsvc'
import { ImpltElgblRslt_Krw300MCstrn } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_Krw300MCstrn'
import { ImpltElgblRslt_BelowThresholdLbsvc } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_BelowThresholdLbsvc'
import { ImpltElgblRslt_BelowThresholdDspLbsvc } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRslt_BelowThresholdDspLbsvc'
import type { BdopnItem, ImpltElgbSrngTyCd } from '@/types/bd'

// ── 탭 (설계서 v1.83 slide138 화면목록 — 컨테이너 M01 · 탭 T01~T03(구 M01~M03) · 심사결과 T04~T21) ──
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'bidRjct', label: '입찰/반려 정보' },
  { value: 'file', label: '파일첨부' },
  { value: 'result', label: '심사결과' },
]
const TAB_ORDER = TABS.map((t) => t.value)

// 단계표시기(StepBar) 5단계 — 조달→입찰→계약→이행→대금청구. 이행/적격심사상세는 '입찰'(개찰/낙찰) 단계.
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const
function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

// 직접 URL 진입(state 없음)·목업 미존재 대비 fallback (설계서 slide162 값·항목명 형식 그대로).
const MOCK_DETAIL: BdopnItem = {
  id: '0',
  bidPbancNo: 'LDG0097-1',
  bidPbancNm: '특수작전용대물타격무인향',
  pbancStasNm: '긴급공고',
  taskSeNm: '물품',
  bidMthdNm: '경쟁입찰',
  pbancDt: '2025-12-22',
  opbidDt: '2025-12-24 10:30',
}

// 심사결과 탭(T04~T21) 유형별 렌더 — 유형 판별 임시 키 srngTyCd 로 18종 분기.
// ⚠️ T04 통사(g2b)는 설계서(02.입찰 v1.83) 디자인 슬라이드 부재로 보류(추후 설계 보강 시 추가).
//    값 없음/통사(t04)/미지정은 물품(T05=Implt) 기본 폴백.
function renderResultTab(srngTyCd?: ImpltElgbSrngTyCd) {
  switch (srngTyCd) {
    case 't06':
      return <ImpltElgblRslt_Lbsvc />
    case 't07':
      return <ImpltElgblRslt_ItemsUnderKrw1B />
    case 't08':
      return <ImpltElgblRslt_ManufacturingofItemsUnderKrw1B />
    case 't09':
      return <ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2015 />
    case 't10':
      return <ImpltElgblRslt_PurchaseofItemsUnderKrw1B />
    case 't11':
      return <ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2015 />
    case 't12':
      return <ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2018 />
    case 't13':
      return <ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2018 />
    case 't14':
      return <ImpltElgblRslt_BelowThreshold />
    case 't15':
      return <ImpltElgblRslt_ThresholdKrw1B />
    case 't16':
      return <ImpltElgblRslt_OverKrw1B />
    case 't17':
      return <ImpltElgblRslt_Cstrn />
    case 't18':
      return <ImpltElgblRslt_TechLbsvc />
    case 't19':
      return <ImpltElgblRslt_Krw300MCstrn />
    case 't20':
      return <ImpltElgblRslt_BelowThresholdLbsvc />
    case 't21':
      return <ImpltElgblRslt_BelowThresholdDspLbsvc />
    // t04(통사·보류) · t05(물품) · undefined → 물품 기본
    default:
      return <Implt />
  }
}

// 탭 콘텐츠 렌더 (설계서 탭별 화면: 일반정보 T01 / 입찰·반려정보 T02 / 파일첨부 T03 / 심사결과 T04~T21)
function renderTabContent(tab: string, srngTyCd?: ImpltElgbSrngTyCd) {
  switch (tab) {
    case 'general':
      return <Implt1 />
    case 'bidRjct':
      return <Implt2 />
    case 'file':
      return <Implt3 />
    case 'result':
      return renderResultTab(srngTyCd)
    default:
      return null
  }
}

export function ImpltPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 상단(요약/헤더) — 입찰결과상세에서 넘어온 개찰목록 항목(navigate state). 직접 진입(state 없음)은 fallback 목업.
  const stateItem = useLocation().state as BdopnItem | null
  const detail = stateItem ?? MOCK_DETAIL

  const summaryRows: SummaryInfoRow[] = [
    { label: '공고일자', value: detail.pbancDt },
    { label: '개찰일시', value: detail.opbidDt },
  ]
  // 진행단계(prgrsStg) — 이행/적격심사상세이므로 '입찰'. 추후 bdService 응답으로 대체.
  const steps = stepsByStg('입찰')

  // 탭 이동 헬퍼 — 하단 다음으로/이전 버튼 구동(탭 순서 = TAB_ORDER).
  const goTab = (next: string) => {
    setTab(next)
    goToContentTop()
  }
  const goStep = (dir: 1 | -1) => {
    const idx = TAB_ORDER.indexOf(tab)
    const nextIdx = idx + dir
    if (nextIdx >= 0 && nextIdx < TAB_ORDER.length) goTab(TAB_ORDER[nextIdx])
  }

  // 탭별 하단 액션 (설계서: M01 다음으로/취소 · M02 다음으로/이전 · M03 제출하기/이전 · M04 목록)
  const footer = (() => {
    const wrap = 'h-auto min-h-12 whitespace-normal break-keep py-2 text-center leading-tight'
    switch (tab) {
      case 'general':
        return (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', itemClassName: wrap, onClick: () => navigate(-1) },
              { label: '다음으로', variant: 'primary', itemClassName: wrap, onClick: () => goStep(1) },
            ]}
          />
        )
      case 'bidRjct':
        return (
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '이전', variant: 'secondary', itemClassName: wrap, onClick: () => goStep(-1) },
              { label: '다음으로', variant: 'primary', itemClassName: wrap, onClick: () => goStep(1) },
            ]}
          />
        )
      case 'file':
        // 저장하기(임시저장)는 이전/제출하기 상단에 풀폭으로 배치.
        return (
          <div className="flex flex-col gap-krds-9">
            <ButtonGroup
              layout="single"
              items={[
                {
                  label: '저장하기',
                  variant: 'primary',
                  itemClassName: wrap,
                  // 추후 API: scwin.btn_strg_onclick (이행/적격심사 신청 내역 임시 저장)
                  onClick: () => console.log('[Implt] 이행/적격심사 임시 저장', detail.id),
                },
              ]}
            />
            <ButtonGroup
              layout="asymmetric"
              items={[
                { label: '이전', variant: 'secondary', itemClassName: wrap, onClick: () => goStep(-1) },
                {
                  label: '제출하기',
                  variant: 'primary',
                  itemClassName: wrap,
                  // 추후 API: scwin.btn_elgbSrngAply_onclick (이행/적격심사 신청 처리)
                  onClick: () => console.log('[Implt] 이행/적격심사 제출하기', detail.id),
                },
              ]}
            />
          </div>
        )
      case 'result':
        // 심사결과 탭은 하단 버튼 없음.
        return null
      default:
        return null
    }
  })()

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보 축소(infolist 숨김). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.pbancStasNm }, { label: detail.taskSeNm }, { label: detail.bidMthdNm }]}
          subtitle={`입찰공고번호 ${detail.bidPbancNo}`}
          title={detail.bidPbancNm}
          rows={summaryRows}
        />

        {/* 진행 단계 — 스크롤 축소 시 함께 접힘 */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar
                orientation="horizontal"
                items={steps}
                sheetItems={buildProgressSheet('입찰', (substep, prgrsStg) => navigate('/anl-prgrs', { state: { substep, prgrsStg } }))}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="px-4">
          <TabList value={tab} onChange={goTab} items={TABS} />
        </div>
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘 지탱 위해 최소 높이 확보(진동 방지). */}
      <div className="min-h-[100dvh]">
        {renderTabContent(tab, detail.srngTyCd)}

        {/* 탭별 하단 액션 — 우측 플로팅 버튼(48px + 하단 10px + safe-area)에 안 가리도록 여백 확보. */}
        {footer && (
          <div
            className="px-4 pt-krds-8"
            style={{ paddingBottom: 'calc(48px + 10px + 16px + env(safe-area-inset-bottom))' }}
          >
            {footer}
          </div>
        )}
      </div>

      {/* 맨위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
ImpltPage.displayName = 'ImpltPage'
