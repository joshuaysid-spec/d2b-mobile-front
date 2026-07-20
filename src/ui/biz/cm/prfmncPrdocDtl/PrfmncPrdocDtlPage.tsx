// 실적증명서 확인(상세) — MUI-CM-04-M07. 설계서 00.공통 v0.84 slide243 (항목 설명 slide266).
// 목록(M06 PrfmncPrdocPage) 카드 클릭 → 진입. 상세 컨벤션 레퍼런스 PrcmPlanDtlPage 조립:
//   sticky 요약(SummaryInfo, 스크롤 축소) + 탭(TabList: 계약정보/신청정보) + 탭별 콘텐츠 컴포넌트.
// Figma 전용 프레임 없음 → 내부 상세 컨벤션 준수.
// 상태별 액션(slide243, 표시 상태 prgrsStcd 구동):
//   - 하단 "실적증명서 발급" 버튼: '발급' 상태에서만 표시(발급 문서는 PDF 진본성 검사 대상 — 스텁)
//   - (+) 시트: 신청 및 수정='저장' · 발급/제출='발급'(제출→MUI-CM-04-P20 미구현 스텁) ·
//     삭제='반려'/'저장'/'회송'(확인 팝업 "정말 삭제하시겠습니까?")
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { Button } from '@/ui/common/base/Button'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup, type ButtonGroupItem } from '@/ui/common/composites/ButtonGroup'
import { PrfmncPrdocDtl_Cn } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_Cn'
import { PrfmncPrdocDtl_UnitB } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitB'
import { PrfmncPrdocSbmsnFullPopup } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocSbmsnFullPopup'
import type { PrfmncPrdocItem } from '@/types/cm'

// 직접 URL 진입(목록 state 없음) 대비 fallback 목업 — dl_resultList 항목명/형식 그대로(slide240).
const MOCK_PRFMNC_DETAIL: PrfmncPrdocItem = {
  prfmncRcptNo: '2025NC00179',
  ctrtNo: '2025093455',
  ctrtSe: '물품',
  ctrtNm: '파카,외피 구매계약',
  rprsItemNm: '파카,외피',
  ctrtAmt: 11616000,
  orderInst: '방위사업청',
  aplyYmd: '2026-03-05',
  prcsYmd: undefined,
  prgrsStcd: '발급',
}

// ── 탭 — 계약정보(T01) / 신청정보(계약구분 분기: T02 방위사업청 · T03 unitB · T04~ unitC…) ──
const TABS: TabItem[] = [
  { value: 'ctrt', label: '계약정보' },
  { value: 'aply', label: '신청정보' },
]

function renderTabContent(tab: string) {
  switch (tab) {
    case 'ctrt':
      return <PrfmncPrdocDtl_Cn />
    case 'aply':
      // 신청정보는 기관/계약에 따라 3분류(slide244): 방위사업청(T02)/부대+시설공사(T03 unitB)/
      // 부대+비시설공사. 현재 T03(unitB)만 구현 — 나머지 분기는 해당 탭 컴포넌트 추가 시 여기서 분기.
      return <PrfmncPrdocDtl_UnitB />
    default:
      return null
  }
}

export function PrfmncPrdocDtlPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('ctrt')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [actionOpen, setActionOpen] = useState(false) // (+) 상태별 액션 시트
  const [deleteOpen, setDeleteOpen] = useState(false) // 삭제 확인 팝업
  const [sbmsnOpen, setSbmsnOpen] = useState(false) // 실적증명서 제출 풀팝업(MUI-CM-04-P20)

  // 목록 → 상세 데이터 전달: navigate(state)로 넘어온 항목으로 상단을 그린다(표준).
  const detail = (useLocation().state as PrfmncPrdocItem | null) ?? MOCK_PRFMNC_DETAIL

  // (+) 액션 3종 — 항상 노출(2026-07-20 수정 요청. 설계서 원문의 상태별 노출 규칙
  //   — 신청및수정='저장'/발급·제출='발급'/삭제='반려·저장·회송' — 은 API 연동 시 재검토).
  const stcd = detail.prgrsStcd
  const actionItems: ButtonGroupItem[] = [
    {
      label: '실적증명서 신청 및 수정',
      variant: 'secondary' as const,
      onClick: () => {
        setActionOpen(false)
        // 실적증명서 신청 플로우(MUI-CM-04-M10 계약선택 → M12 → T12/T13)
        navigate(ROUTES.SUPPORT_PRFMNC_PRDOC_REG)
      },
    },
    {
      label: '실적증명서 제출',
      variant: 'secondary' as const,
      onClick: () => {
        setActionOpen(false)
        setSbmsnOpen(true) // 실적증명서 제출 풀팝업(MUI-CM-04-P20)
      },
    },
    {
      label: '실적증명서 삭제',
      variant: 'secondary' as const,
      onClick: () => {
        setActionOpen(false)
        setDeleteOpen(true)
      },
    },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky. 스크롤 시 요약(infolist) 축소(PrcmPlanDtlPage 동일 패턴). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.ctrtSe }, { label: detail.prgrsStcd }].filter((b) => b.label)}
          subtitle={`접수번호 ${detail.prfmncRcptNo} · 계약번호 ${detail.ctrtNo}`}
          title={detail.ctrtSe === '공사' ? detail.ctrtNm : detail.rprsItemNm}
          rows={[
            { label: '실적 신청금액', value: `${detail.ctrtAmt.toLocaleString()} 원` },
            { label: '발급기관', value: detail.orderInst },
            { label: '신청일자', value: detail.aplyYmd },
            { label: '처리일자', value: detail.prcsYmd ?? '-' },
          ]}
        />

        {/* 탭 — 전환 시 본문 맨 위로(접힘 유지) */}
        <div className="px-4">
          <TabList
            value={tab}
            onChange={(next) => {
              setTab(next)
              goToContentTop()
            }}
            items={TABS}
          />
        </div>
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지) */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 하단 발급 버튼 — '발급' 상태에서만(신청·저장 등 타 상태 숨김, slide243) */}
      {stcd === '발급' && (
        <div className="px-4 pb-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => console.log('[PrfmncPrdocDtl] 실적증명서 발급 — PDF(진본성) 스텁')}
          >
            실적증명서 발급
          </Button>
        </div>
      )}

      {/* 플로팅 버튼 — 맨위로 + 더하기(항상 노출, 시트 항목은 상태별) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setActionOpen(true)}
        plusLabel="실적증명서 액션"
      />

      {/* (+) 액션 바텀시트 — 컨테이너는 페이지 소유(공통 BottomSheet 조립).
          실적증명서 신청 및 수정 / 제출 / 삭제 3종 고정(2026-07-20 요청). */}
      <BottomSheet open={actionOpen} onOpenChange={setActionOpen} title="실적증명서">
        <ButtonGroup layout="vertical" items={actionItems} />
      </BottomSheet>

      {/* 삭제 확인 팝업 — "실적증명서를 삭제 하시겠습니까?" (아니오/삭제, 2026-07-20 요청) */}
      <AlertModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        variant="info"
        title="실적증명서 삭제"
        description="실적증명서를 삭제 하시겠습니까?"
        secondaryAction={{ label: '아니오' }}
        primaryAction={{
          label: '삭제',
          onClick: () => console.log('[PrfmncPrdocDtl] 삭제(API 미연동)', detail.prfmncRcptNo),
        }}
      />

      {/* 실적증명서 제출 풀팝업 (MUI-CM-04-P20) — (+)시트 [실적증명서 제출] */}
      <PrfmncPrdocSbmsnFullPopup open={sbmsnOpen} onOpenChange={setSbmsnOpen} />
    </div>
  )
}
PrfmncPrdocDtlPage.displayName = 'PrfmncPrdocDtlPage'
