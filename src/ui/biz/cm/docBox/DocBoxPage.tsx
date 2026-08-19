// 문서함 목록 (MUI-CM-06-M10 DocBoxPage). 설계서 00.공통 v0.84 slide90·91. **디자인 없음 → 기존 공통 재사용.**
// 웹경로: 메인 홈 > 마이페이지 > 문서함. 셸(AppLayout) 안 + sub헤더(뒤로+타이틀 '문서함'). 3뎁스라 BottomNav 숨김.
//
// 받은/보낸/임시저장/반려 문서를 하나의 목록으로 합쳐 표시하되, 상단 분기 탭(4구분)으로 필터한다.
//   (설계서는 검색필터 '문서 구분'으로 필터하나, 마이페이지 문서함 하위 메뉴(받은/보낸/반려/임시저장)와
//    동일하게 탭으로 노출 — 진입 시 마이페이지에서 넘어온 docType 으로 초기 탭 선택.)
// 구성(위→아래): 분기 탭(TabList button) → 상단바(총건수+표시개수) → 카드 리스트 → 더보기 → 맨위로 FAB.
//   카드 클릭 → 문서함 상세(M11)로 navigate(state 전달, CLAUDE.md "목록 → 상세 데이터 전달").
// 데이터=파일 내 목업(설계서 항목명/형식), 동작=API 경계 스텁(console.log + '// 추후: cmService.selectDocBoxXxx').
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Button } from '@/ui/common/base/Button'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { ROUTES } from '@/constants/routes'
import { docBadges, docOrgLine, docDateRows } from '@/ui/biz/cm/docBox/docBoxView'
import type { DocBoxItem, DocBoxSeCd } from '@/types/cm'

// 상단 분기 탭 — 문서구분 4가지(받은/보낸/반려/임시저장). docSeCd 로 목록 필터.
const DOC_TABS: TabItem[] = [
  { value: 'received', label: '받은 문서' },
  { value: 'sent', label: '보낸 문서' },
  { value: 'rejected', label: '반려 문서' },
  { value: 'temp', label: '임시저장' },
]

// ── 목업 (설계서 slide90 카드 예시 + 각 데이터영역 항목명/형식) ────────────────
// 문서구분별 대표 샘플. 아래 replicate 로 페이징용 목록을 만든다(id 재부여).
const DOC_SAMPLES: Record<DocBoxSeCd, Omit<DocBoxItem, 'id'>[]> = {
  received: [
    {
      docSeCd: 'received',
      docSeNm: '받은 문서',
      docNm: '2026년 K5방독면 구매 계약 통보서',
      trsmOgnzCd: '방위사업청',
      rcptnDt: '2026-03-10',
      rcptIdntyDt: '2026-03-11',
      addCn: '납품 일정 관련 협의가 필요하니 담당자에게 연락 바랍니다.',
      edmsDocId: 'EDMS20260310001',
    },
    {
      docSeCd: 'received',
      docSeNm: '받은 문서',
      docNm: '입찰참가 자격 확인 요청서',
      trsmOgnzCd: '화력총괄계약팀',
      rcptnDt: '2026-03-08',
      rcptIdntyDt: '2026-03-09',
      edmsDocId: 'EDMS20260308002',
    },
  ],
  sent: [
    {
      docSeCd: 'sent',
      docSeNm: '보낸 문서',
      docNm: '입찰참가신청서 제출',
      rcptnOgnzCd: '방위사업청',
      docWrtDt: '2026-03-07',
      rcptIdntyDt: '2026-03-08',
      addCn: '제출 서류 이상 유무를 확인 부탁드립니다.',
    },
    {
      docSeCd: 'sent',
      docSeNm: '보낸 문서',
      docNm: '견적서 제출 (26-물품-04)',
      rcptnOgnzCd: '제9911부대',
      docWrtDt: '2026-03-05',
      rcptIdntyDt: '2026-03-06',
      edmsDocId: 'EDMS20260305010',
    },
  ],
  rejected: [
    {
      docSeCd: 'rejected',
      docSeNm: '반려받은 문서',
      docNm: '입찰참가신청서 (첨부서류 누락)',
      trsmOgnzCd: '방위사업청',
      rjctYn: 'N',
      rcptnDt: '2026-03-04',
      rcptIdntyDt: '2026-03-05',
      rjctRsn: '사업자등록증 사본이 누락되어 반려합니다. 서류 보완 후 재제출 바랍니다.',
    },
    {
      docSeCd: 'rejected',
      docSeNm: '반려한 문서',
      docNm: '납품 검사 요청서 (기한 초과)',
      trsmOgnzCd: '피복관리팀',
      rjctYn: 'Y',
      docWrtDt: '2026-03-02',
      rturId: '홍길동',
      rjctRsn: '검사 요청 기한이 초과되어 반려 처리하였습니다.',
    },
  ],
  temp: [
    {
      docSeCd: 'temp',
      docSeNm: '임시저장',
      docNm: '입찰참가신청서 작성 중',
      wrtYmd: '2026-03-10',
    },
  ],
}

// 문서구분별 총 건수(목업 — slide91 '더보기 10/258' 반영). API 연동 시 실제 total 로 교체.
const DOC_TOTALS: Record<DocBoxSeCd, number> = {
  received: 258,
  sent: 42,
  rejected: 13,
  temp: 3,
}

// ⚠️ 임시 목업 — API 연동 시 이 상수·페이징 로직을 통째로 교체(cmService.selectDocBoxList).
const MOCK_DOCS: DocBoxItem[] = (Object.keys(DOC_SAMPLES) as DocBoxSeCd[]).flatMap((se) => {
  const samples = DOC_SAMPLES[se]
  return Array.from({ length: DOC_TOTALS[se] }, (_, i) => ({
    ...samples[i % samples.length],
    id: `${se}-${i + 1}`,
  }))
})

export function DocBoxPage() {
  const navigate = useNavigate()
  // 마이페이지에서 넘어온 초기 문서구분(받은/보낸/반려/임시저장). 없으면 '받은 문서'.
  const initTab = (useLocation().state as { docType?: DocBoxSeCd } | null)?.docType ?? 'received'
  const [tab, setTab] = useState<DocBoxSeCd>(initTab)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // 탭(문서구분) 필터 → 페이징.
  const filtered = useMemo(() => MOCK_DOCS.filter((it) => it.docSeCd === tab), [tab])
  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visible = filtered.slice(0, loaded)

  // ── 동작 스텁 ──
  const handleTab = (next: string) => {
    setTab(next as DocBoxSeCd)
    setPage(1)
    console.log('[DocBox] 탭', next) // 추후: cmService.selectDocBoxList({ docSeCd: next })
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[DocBox] pageSize →', size)
  }
  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[DocBox] loadMore')
  }
  const handleCardClick = (it: DocBoxItem) => {
    // 클릭한 항목을 state 로 전달 — 문서함 상세(M11) 상단 즉시표시.
    navigate(ROUTES.DOC_BOX_DETAIL, { state: it })
  }

  const cardItems: CardListItem[] = visible.map((it) => ({
    id: it.id,
    badges: (
      <>
        {docBadges(it).map((b) => (
          <Badge key={b.label} type="pastel" color={b.color}>
            {b.label}
          </Badge>
        ))}
      </>
    ),
    subtitle: docOrgLine(it),
    title: it.docNm,
    rows: docDateRows(it),
    onClick: () => handleCardClick(it),
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 상단 분기 탭 — 4구분(받은/보낸/반려/임시저장). 라벨이 360px 폭에 안 들어가면 가로 스크롤. */}
      <TabList variant="button" value={tab} onChange={handleTab} items={DOC_TABS} scrollButtons="auto" />

      {/* 상단바 — 총건수 + 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 카드 리스트 — px16, 카드 간 16(krds-8). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        <CardList items={cardItems} emptyText="문서가 없습니다." />
      </div>

      {/* 더보기 (loaded/total). 모두 노출되면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  )
}
DocBoxPage.displayName = 'DocBoxPage'
