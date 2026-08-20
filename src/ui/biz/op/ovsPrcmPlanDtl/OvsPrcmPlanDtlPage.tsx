// 국외 연간조달계획 상세 (MUI-OP-01-M78, 설계서 01.조달계획 v0.84 slide76~77).
// 통합목록의 검색유형 '연간조달계획'(annual) 카드 클릭 → /op/ovsPrcmPlanDtl 진입(2026-08-14 화면 추가).
// 구성: 요약정보(SummaryInfo, '목록 표시 정보와 동일') + 업무도움 + 상세내용 + 연간조달계획 상세.
//   탭·단계표시기 없음 — 목록 데이터(dlt_anlPrcmPlanList) 전체를 두 섹션으로 펼쳐 보여주는 단일 화면.
//   재고번호 클릭 → 목록정보조회(MUI-OP-01-P76, WarSplList_Inq) 팝업(설계서 slide78 '팝업으로 통일').
// 식별자는 navigate state 로만 받는다(URL 미노출) — state 없이 직접 진입하면 목록으로 되돌린다.
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout) 담당.
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { opQueries } from '@/queries/bds/op/opQueries'
import type { OpAnlPrcmPlanItem } from '@/types/op'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageLoading } from '@/ui/common/feedback/PageLoading'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { WarSplList_Inq } from '@/ui/biz/op/warSplList_Inq/WarSplList_Inq'

export function OvsPrcmPlanDtlPage() {
  // 목록 → 상세 데이터 전달: 클릭 항목이 식별자 소스이자 placeholder(재조회 전 즉시 렌더).
  const stateItem = useLocation().state as OpAnlPrcmPlanItem | null
  const id = stateItem?.id ?? ''
  // 스크롤 시 상단 요약 블록 축소 + sticky — 로직은 훅에서(overflow-anchor 진동방지 포함).
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()
  // 목록정보조회(P76) 바텀시트 — 재고번호 [보기] 클릭 시 열림.
  // 컨테이너(BottomSheet)는 페이지가 소유하고 콘텐츠는 WarSplList_Inq(CLAUDE.md — *Sheet 래퍼 금지).
  const [warSplOpen, setWarSplOpen] = useState(false)

  const { data: detail } = opQueries.useSelectOvsPlanDtl(id, stateItem ?? undefined)

  // state 없이 직접 진입 = 식별자를 알 수 없음 → 통합목록으로.
  if (!stateItem) return <Navigate to="/op" replace />
  if (!detail) return <PageLoading />

  // ── 상세내용 (설계서 slide77 ②) — 재고번호는 [보기]로 목록정보조회(P76) 호출 ──
  const DETAIL_ROWS: TableRow[] = [
    { label: '진행상태', value: detail.frcptlItemMsprgStcd },
    { label: '군구분', value: detail.prcmRqtInstCd },
    { label: '조달요구번호', value: detail.prcmRqtNo },
    {
      label: '재고번호',
      type: 'combination',
      value: (
        <>
          <span>{detail.fscCdNtnItemIdntfNo}</span>
          <Button size="sm" variant="inner" onClick={() => setWarSplOpen(true)}>
            보기
          </Button>
        </>
      ),
    },
    { label: '부품번호', value: detail.prtsNo },
    { label: '품질 등급', value: detail.inspShcd },
    { label: '생산자 부호', value: detail.prdcrSgn },
    { label: '생산자 중복', value: detail.prdcrDpcn },
    { label: '단위', value: detail.unitCd },
  ]

  // ── 연간조달계획 상세 (설계서 slide77 ③) ──
  const PLAN_ROWS: TableRow[] = [
    { label: '수량', value: detail.drctnQty.toLocaleString(), type: 'number' },
    { label: '지시단가(USD)', value: detail.drctnUntprc.toLocaleString(), type: 'number' },
    { label: '지시예산(USD)', value: detail.drctnAmt.toLocaleString(), type: 'number' },
    { label: '품명', value: detail.itemNm },
    { label: '규격번호', value: detail.spcfctNo },
    { label: '장비부호', value: detail.aplcnEqpmntCd },
    { label: '장비명', value: detail.aplcnEqpmntNm },
    { label: '구매요청번호', value: detail.prgrNo },
    { label: '항목 번호', value: detail.clsfNo },
    { label: '기능', value: detail.functnNm },
    { label: '품류', value: detail.itemFwkCd },
  ]

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 요약 — sticky 고정. 스크롤 시 축소(높이 0)되며 하단 divider 노출. */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        {/* 설계서 slide77 '타이틀 표시 - 목록 표시 정보와 동일' */}
        <SummaryInfo
          collapsed={collapsed}
          badges={[{ label: detail.taskSeNm }, { label: detail.prcmRqtInstCd }]}
          title={`조달요구번호 ${detail.prcmRqtNo}`}
          rows={[
            { label: '재고번호', value: detail.fscCdNtnItemIdntfNo },
            { label: '부품번호', value: detail.prtsNo },
            { label: '품질등급', value: detail.inspShcd },
            { label: '생산자부호', value: detail.prdcrSgn },
            { label: '접수기간', value: detail.rcptPd },
          ]}
        />
      </div>

      {/* 업무도움 — full-bleed 블루 바(설계서 slide77) */}
      <Infobox
        className="rounded-none"
        title="업무도움"
        items={[
          '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
          '1577-1118 대표전화로 전화주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.',
        ]}
      />

      <section className="flex flex-col">
        <SectionTitle as="h2">상세내용</SectionTitle>
        <Table rows={DETAIL_ROWS} />
      </section>

      <section className="flex flex-col pb-[72px]">
        <SectionTitle as="h2" topDivider>
          연간조달계획 상세
        </SectionTitle>
        <Table rows={PLAN_ROWS} />
      </section>

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />

      {/* 목록정보 조회 (MUI-OP-01-P76) — 재고번호 [보기] 진입.
          컨테이너는 페이지 소유(*Sheet 래퍼 금지), 콘텐츠(탭 3개 + NIIN 상태)는 WarSplList_Inq. */}
      <BottomSheet
        open={warSplOpen}
        onOpenChange={setWarSplOpen}
        title="목록정보 조회"
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'secondary', onClick: () => setWarSplOpen(false) }]}
          />
        }
      >
        {warSplOpen && <WarSplList_Inq planId={id} />}
      </BottomSheet>
    </div>
  )
}
