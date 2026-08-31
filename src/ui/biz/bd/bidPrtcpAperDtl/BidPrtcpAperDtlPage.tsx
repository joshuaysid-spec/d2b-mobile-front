// 입찰진행상세 - 입찰참가신청조회(서약서) (MUI-BD-04-M22, 설계서 영문ID BidPrtcpAperDtl_WrotAgre · slide181).
// 접속: 홈 > 입찰 진행 상세 > 입찰참가신청서 [내용 보기] → 이 화면. 라우트 /bd/bidPrtcpAperDtl(식별자는 navigate state).
// 성격: 제출 완료된 입찰참가신청서를 읽기전용으로 조회. 작성판(bidPrtcpAperWrt, M01·M05~M14)과 탭 구성은 같지만
//   입력 컨트롤 → 값 표시, 다음/신청하기 → 탭 자유 이동으로 바뀌고 검증·저장이 없다.
// 구성: 요약(SummaryInfo, 스크롤 시 축소) + 탭 8개(0.서약서 + 1~7) sticky → 탭 콘텐츠 → 이전/다음으로 → 맨위로 FAB.
//   ⚠️ 진행단계(StepBar)는 두지 않는다 — 설계서 2026-08-18 개정 '조회화면에서 진행단계 삭제, 서약서 탭 버튼 추가'.
// 탭0(서약서)은 이 화면(M22) 자신의 본문이라 페이지가 직접 렌더하고, 탭1~7은 T01~T07 파일이 담당한다.
// 서약서 3건의 제목/본문은 작성판 서약서(P02~P04)와 동일 원문이라 WROTS(WrotAgreForm)를 재사용 — 조회판은
//   '동의 선택' 라디오 없이 본문만 바텀시트로 보여준다.
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { WROTS, type WrotData } from '@/ui/biz/bd/wrotAgrePage/WrotAgreForm'
import { BidPrtcpAperDtl_Tab1 } from '@/ui/biz/bd/bidPrtcpAperDtl/BidPrtcpAperDtl_Tab1'
import { BidPrtcpAperDtl_Tab2 } from '@/ui/biz/bd/bidPrtcpAperDtl/BidPrtcpAperDtl_Tab2'
import { BidPrtcpAperDtl_Tab3 } from '@/ui/biz/bd/bidPrtcpAperDtl/BidPrtcpAperDtl_Tab3'
import { BidPrtcpAperDtl_Tab4 } from '@/ui/biz/bd/bidPrtcpAperDtl/BidPrtcpAperDtl_Tab4'
import { BidPrtcpAperDtl_Tab5 } from '@/ui/biz/bd/bidPrtcpAperDtl/BidPrtcpAperDtl_Tab5'
import { BidPrtcpAperDtl_Tab6 } from '@/ui/biz/bd/bidPrtcpAperDtl/BidPrtcpAperDtl_Tab6'
import { BidPrtcpAperDtl_Tab7 } from '@/ui/biz/bd/bidPrtcpAperDtl/BidPrtcpAperDtl_Tab7'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 신청서 내역 탭(설계서 slide181 탭 버튼) — 0.서약서 + T01~T07.
const TABS: TabItem[] = [
  { value: 'wrot', label: '0. 서약서' },
  { value: 'tab1', label: '1. 일반정보' },
  { value: 'tab2', label: '2. 품목내역' },
  { value: 'tab3', label: '3. 공종 및 면허' },
  { value: 'tab4', label: '4. 입찰보증금' },
  { value: 'tab5', label: '5. 공동수급업체' },
  { value: 'tab6', label: '6. 파일첨부' },
  { value: 'tab7', label: '7. 문의 및 동의' },
]

// 서약서 3건(설계서 slide181) — 제출 시 동의한 값이라 조회는 '동의' 고정 표시.
//   본문은 WROTS(작성판 P02~P04 원문)와 id 로 연결.
const WROT_ITEMS: Array<{ id: string; no: string; argeYn: 'Y' | 'N' }> = [
  { id: 'w_p02', no: '1', argeYn: 'Y' }, // '조세포탈' 사실이 없음을 확약하는 서약서
  { id: 'w_p03', no: '2', argeYn: 'Y' }, // 청렴 계약 이행 서약서
  { id: 'w_p04', no: '3', argeYn: 'Y' }, // 하도급대금의 지급관련 확인 및 확약서
]

// 사후심사대상 입찰안내 — 설계서 slide181 안내사항 원문.
const NOTICE_ITEMS = [
  '입찰전 꼭 확인 하시기 바랍니다.',
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '- 문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

export function BidPrtcpAperDtlPage() {
  // 훅은 state 가드보다 위에서 무조건 호출(hooks-order).
  const stateItem = useLocation().state as MockBidPrgrsItem | null
  const [tab, setTab] = useState('wrot')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [selected, setSelected] = useState<WrotData | null>(null) // 열람 중인 서약서(바텀시트)

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

  // 서약서 목록(탭0) — 번호/서약서명(+보기)/동의여부.
  const wrotRows = (item: (typeof WROT_ITEMS)[number]): TableRow[] => {
    const wrot = WROTS.find((w) => w.id === item.id)
    return [
      { label: '번호', value: item.no },
      {
        label: '서약서명',
        type: 'combination',
        value: (
          <div className="flex flex-col items-start gap-krds-3">
            <span>{wrot?.title ?? ''}</span>
            <Button size="sm" variant="inner" onClick={() => wrot && setSelected(wrot)}>
              내용 보기
            </Button>
          </div>
        ),
      },
      { label: '동의여부', value: item.argeYn === 'Y' ? '동의' : '미동의' },
    ]
  }

  const renderTabContent = (current: string) => {
    switch (current) {
      case 'tab1':
        return <BidPrtcpAperDtl_Tab1 detail={detail} />
      case 'tab2':
        return <BidPrtcpAperDtl_Tab2 detail={detail} />
      case 'tab3':
        return <BidPrtcpAperDtl_Tab3 />
      case 'tab4':
        return <BidPrtcpAperDtl_Tab4 />
      case 'tab5':
        return <BidPrtcpAperDtl_Tab5 detail={detail} />
      case 'tab6':
        return <BidPrtcpAperDtl_Tab6 />
      case 'tab7':
        return <BidPrtcpAperDtl_Tab7 />
      default:
        return (
          <>
            <SectionTitle as="h3" topDivider>
              서약서 동의
            </SectionTitle>
            <div className="flex flex-col gap-krds-7 px-4 py-4">
              {WROT_ITEMS.map((item) => (
                <Table key={item.id} rows={wrotRows(item)} />
              ))}
            </div>
            <Infobox title="사후심사대상 입찰안내" items={NOTICE_ITEMS} />
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

      {/* 하단 액션바 — 조회 전용이라 탭 이동만 한다(제출 없음). 첫 탭의 '이전'은 이전 화면으로. */}
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

      {/* 서약서 내용(P02~P04) — 조회 전용이라 본문만(동의 선택 라디오 없음). 컨테이너는 페이지 소유. */}
      <BottomSheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        title={selected?.title ?? '서약서'}
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setSelected(null) }]}
          />
        }
      >
        {selected && (
          <div className="flex flex-col gap-krds-7 py-2">
            <div className="flex flex-col gap-krds-5 text-[17px] leading-normal text-krds-text-ink">
              {selected.body.map((p, i) => (
                <p key={`${selected.id}-${i}`} className="wrap-break-word">
                  {p}
                </p>
              ))}
            </div>
            {selected.signature && (
              <div className="flex flex-col gap-krds-2 text-center text-[17px] leading-normal text-krds-text-ink">
                {selected.signature.map((line, i) => (
                  <p key={`${selected.id}-sig-${i}`} className="wrap-break-word">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
BidPrtcpAperDtlPage.displayName = 'BidPrtcpAperDtlPage'
