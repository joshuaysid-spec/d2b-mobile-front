// 실적증명서 확인(상세) — MUI-CM-04-M07. 설계서 00.공통 v0.84 slide243 (항목 설명 slide266).
// 목록(M06 PrfmncPrdocPage) 카드 클릭 → 진입. 상세 컨벤션 레퍼런스 PrcmPlanDtlPage 조립:
//   sticky 요약(SummaryInfo, 스크롤 축소) + 탭(TabList: 계약정보/신청정보) + 탭별 콘텐츠 컴포넌트.
// Figma 전용 프레임 없음 → 내부 상세 컨벤션 준수.
// 상태별 액션(slide243, 표시 상태 prgrsStcd 구동):
//   - 하단 "실적증명서 발급" 버튼: '발급' 상태에서만 표시(발급 문서는 PDF 진본성 검사 대상 — 스텁)
//   - (+) 시트: 신청 및 수정='저장' · 발급/제출='발급'(제출→MUI-CM-04-P20 제출 바텀시트) ·
//     삭제='반려'/'저장'/'회송'(확인 팝업 "정말 삭제하시겠습니까?")
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { useSbmsnAsctnList } from '@/queries/cm'
import { prfmncPrdocService } from '@/services/cm'
import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { Button } from '@/ui/common/base/Button'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup, type ButtonGroupItem } from '@/ui/common/composites/ButtonGroup'
import { PrfmncPrdocDtl_Cn } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_Cn'
import { PrfmncPrdocDtl_D2b } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_D2b'
import { PrfmncPrdocDtl_UnitB } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitB'
import { PrfmncPrdocDtl_UnitC } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitC'
import { PrfmncPrdocDtl_UnitD } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitD'
import { PrfmncPrdocDtl_UnitE } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitE'
import { PrfmncPrdocDtl_UnitF } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitF'
import { PrfmncPrdocDtl_UnitG } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitG'
import { PrfmncPrdocDtl_UnitH } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitH'
import { PrfmncPrdocDtl_UnitI } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_UnitI'
import { PrfmncPrdocDtl_AplyInfo } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocDtl_AplyInfo'
import { PrfmncPrdocSbmsn } from '@/ui/biz/cm/prfmncPrdocDtl/PrfmncPrdocSbmsn'
import type { PrfmncPrdocItem, SbmsnAsctnItem } from '@/types/cm'
import type { ApiError } from '@/types/api'

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

// 신청정보 탭 분기(slide243~271) — 기관/계약구분/제출유형(증명서 종류)으로 결정.
//   방위사업청 → D2b(T02) · 부대+시설공사 → 제출유형별 unitB~I(T03~T10) · 부대+비시설공사 → AplyInfo(T11).
// 제출유형 코드(sbmsnTyCd)는 설계서 항목명 미정의(TODO) — 값이 없으면 시설공사 기본 unitB.
// ⚠️ 2026-07-30 요청: 퍼블 확인용으로 신청정보 탭은 데이터와 무관하게 항상 unitB(MUI-CM-04-T03)
//   내용 전체를 표시한다. API 연동 시 FORCE_UNITB 를 false 로 되돌려 설계서 분기를 복원할 것.
const FORCE_UNITB = true
function resolveAplyBranch(detail: PrfmncPrdocItem) {
  if (FORCE_UNITB) return 'unitB'
  if (detail.orderInst === '방위사업청') return 'd2b'
  if (detail.ctrtSe !== '공사') return 'aplyInfo' // 부대+비시설공사
  switch (detail.sbmsnTyCd) {
    case '3':
      return 'unitC'
    case '4':
      return 'unitD'
    case '6':
      return 'unitE'
    case '7':
      return 'unitF'
    case '8':
      return 'unitG'
    case '9':
      return 'unitH'
    case '10':
      return 'unitI'
    default:
      return 'unitB' // 유형 1/2/5 및 미지정
  }
}

function renderAplyTab(detail: PrfmncPrdocItem) {
  switch (resolveAplyBranch(detail)) {
    case 'd2b':
      return <PrfmncPrdocDtl_D2b />
    case 'unitC':
      return <PrfmncPrdocDtl_UnitC />
    case 'unitD':
      return <PrfmncPrdocDtl_UnitD />
    case 'unitE':
      return <PrfmncPrdocDtl_UnitE />
    case 'unitF':
      return <PrfmncPrdocDtl_UnitF />
    case 'unitG':
      return <PrfmncPrdocDtl_UnitG />
    case 'unitH':
      return <PrfmncPrdocDtl_UnitH />
    case 'unitI':
      return <PrfmncPrdocDtl_UnitI />
    case 'aplyInfo':
      return <PrfmncPrdocDtl_AplyInfo />
    default:
      return <PrfmncPrdocDtl_UnitB />
  }
}

function renderTabContent(tab: string, detail: PrfmncPrdocItem) {
  switch (tab) {
    case 'ctrt':
      return <PrfmncPrdocDtl_Cn />
    case 'aply':
      return renderAplyTab(detail)
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

  // 목록 → 상세 데이터 전달: navigate(state)로 넘어온 항목으로 상단을 그린다(표준).
  const detail = (useLocation().state as PrfmncPrdocItem | null) ?? MOCK_PRFMNC_DETAIL

  // ── 실적증명서 제출(MUI-CM-04-P20) — 컨테이너/상태는 부모가 소유(전용 래퍼 없음) ──
  const [sbmsnOpen, setSbmsnOpen] = useState(false) // 제출 바텀시트
  const [sbmsnConfirmOpen, setSbmsnConfirmOpen] = useState(false) // 제출 확인 모달
  const [sbmsnError, setSbmsnError] = useState<string | null>(null)
  const [sbmsnItems, setSbmsnItems] = useState<SbmsnAsctnItem[]>([])
  const [sbmsnSelected, setSbmsnSelected] = useState<string[]>([]) // 선택 협회명(멀티)

  // On-Load(slide336 scwin.onpageload) — 시트가 열릴 때만 조회.
  const { data: sbmsnAsctnList } = useSbmsnAsctnList(detail.prfmncRcptNo, sbmsnOpen)

  // 조회 결과를 편집 가능한 로컬 상태로 반영(비고 rmrkCn 는 입력 대상).
  useEffect(() => {
    if (sbmsnAsctnList) setSbmsnItems(sbmsnAsctnList)
  }, [sbmsnAsctnList])

  // 송신완료 건이 선택되면 footer '제출하기' → '제출취소'(slide335 기능 버튼).
  const hasSentSelected = sbmsnItems.some(
    (it) => it.sttsVl === '송신완료' && sbmsnSelected.includes(it.sbmsnSttsNm),
  )

  const closeSbmsn = (open: boolean) => {
    setSbmsnOpen(open)
    if (!open) setSbmsnSelected([]) // 닫으면 선택 초기화
  }

  // 제출하기 / 제출취소 실행 — 확인 모달 [확인] 이후.
  const runSbmsn = async () => {
    try {
      if (hasSentSelected) {
        // 제출취소 — 비고(취소사유)와 함께 협회로 재전송
        await prfmncPrdocService.cancelSubmit({
          prfmncRcptNo: detail.prfmncRcptNo,
          items: sbmsnItems
            .filter((it) => sbmsnSelected.includes(it.sbmsnSttsNm))
            .map((it) => ({ sbmsnSttsNm: it.sbmsnSttsNm, rmrkCn: it.rmrkCn })),
        })
      } else {
        await prfmncPrdocService.submit({
          prfmncRcptNo: detail.prfmncRcptNo,
          sbmsnSttsNms: sbmsnSelected,
        })
      }
      closeSbmsn(false)
    } catch (err) {
      closeSbmsn(false)
      setSbmsnError(
        (err as ApiError | null)?.message ?? '실적증명서 제출에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  }

  // (+) 액션 3종 — 항상 노출(2026-07-20 수정 요청. 설계서 원문의 상태별 노출 규칙
  //   — 신청및수정='저장'/발급·제출='발급'/삭제='반려·저장·회송' — 은 API 연동 시 재검토).
  const stcd = detail.prgrsStcd
  const actionItems: ButtonGroupItem[] = [
    {
      label: '실적증명서 신청 및 수정',
      variant: 'secondary' as const,
      onClick: () => {
        setActionOpen(false)
        // 실적증명서 신청 플로우(MUI-CM-04-P21 계약선택 → M12 → T12/T13)
        navigate(ROUTES.SUPPORT_PRFMNC_PRDOC_REG)
      },
    },
    {
      label: '실적증명서 제출',
      variant: 'secondary' as const,
      onClick: () => {
        setActionOpen(false)
        setSbmsnOpen(true) // 실적증명서 제출 바텀시트(MUI-CM-04-P20)
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
      <div className="min-h-[100dvh]">{renderTabContent(tab, detail)}</div>

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

      {/* 실적증명서 제출 (MUI-CM-04-P20) — 컨테이너는 페이지 소유, 콘텐츠만 PrfmncPrdocSbmsn.
          footer 는 송신완료 선택 시 '제출하기' → '제출취소'(slide335). */}
      <BottomSheet
        open={sbmsnOpen}
        onOpenChange={closeSbmsn}
        title="실적증명서 제출"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => closeSbmsn(false) },
              {
                label: hasSentSelected ? '제출취소' : '제출하기',
                variant: 'primary',
                onClick: () => {
                  if (sbmsnSelected.length === 0) return // 미선택 클릭 처리는 설계서 미정의(plan 미결 1)
                  setSbmsnConfirmOpen(true)
                },
              },
            ]}
          />
        }
      >
        <PrfmncPrdocSbmsn
          items={sbmsnItems}
          selected={sbmsnSelected}
          onToggle={(name, checked) =>
            setSbmsnSelected((prev) =>
              checked ? [...prev, name] : prev.filter((n) => n !== name),
            )
          }
          onRmrkChange={(name, rmrkCn) =>
            setSbmsnItems((prev) =>
              prev.map((it) => (it.sbmsnSttsNm === name ? { ...it, rmrkCn } : it)),
            )
          }
        />
      </BottomSheet>

      {/* 제출 확인 모달 (Figma 10064-16388) */}
      <AlertModal
        open={sbmsnConfirmOpen}
        onOpenChange={setSbmsnConfirmOpen}
        variant="check"
        title="실적증명서를 제출하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: runSbmsn }}
      />

      {/* 제출/제출취소 실패 안내 */}
      <AlertModal
        open={!!sbmsnError}
        onOpenChange={(open) => !open && setSbmsnError(null)}
        variant="error"
        title="실적증명서 제출"
        description={sbmsnError ?? ''}
        primaryAction={{ label: '확인' }}
      />
    </div>
  )
}
PrfmncPrdocDtlPage.displayName = 'PrfmncPrdocDtlPage'
