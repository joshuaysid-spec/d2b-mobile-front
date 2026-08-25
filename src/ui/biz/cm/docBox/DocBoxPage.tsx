// 문서함 목록 (MUI-CM-06-M10 DocBoxPage). 설계서 00.공통 v0.84 slide90·91. **디자인 없음 → 기존 공통 재사용.**
// 웹경로: 메인 홈 > 마이페이지 > 문서함. 셸(AppLayout) 안 + sub헤더(뒤로+타이틀 '문서함'). 3뎁스라 BottomNav 숨김.
//
// 받은/보낸/임시저장/반려 문서를 하나의 목록으로 합쳐 표시하되, 상단 분기 탭(4구분)으로 필터한다.
//   (설계서는 검색필터 '문서 구분'으로 필터하나, 마이페이지 문서함 하위 메뉴(받은/보낸/반려/임시저장)와
//    동일하게 탭으로 노출 — 진입 시 마이페이지에서 넘어온 docType 으로 초기 탭 선택.
//    260825 통합 리스트로 갔다가 분기 탭 원복 — 사용자 확정.)
// 구성(위→아래): 분기 탭(TabList line) → 상단바(검색필터 버튼+표시개수, slide95 — 좌측 leftSlot 은 관심입찰공고
//   M05 와 동일 패턴) → 카드 리스트 → 더보기 → 맨위로 FAB → 검색필터 풀팝업(공통 SearchFilter 셸)
//   → 첨언/첨부파일 바텀시트(카드 버튼이 호출 — 컨테이너는 페이지 소유, CLAUDE.md).
// 검색필터(slide96, 2026-08-24 추가): 문서 구분(셀렉트) → 첨언·첨부 여부(셀렉트) → 기간 설정(dateRange+빠른칩 1/3/6개월).
//   초기값 = 문서구분 전체 · 첨언첨부 전체 · 기간 최근 1개월. 검색 실행 시 문서구분은 상단 분기 탭에 동기화
//   (반려 받은/반려한 → 반려 탭), 나머지 조건은 API 경계 스텁(서버 조회 파라미터 — 백엔드 연동 시 배선).
// 카드 클릭(260825 사용자 확정) — 문서함 상세(M11) 폐기. 카드 = 해당 문서가 발생한 공고 상세로 이동
//   (입찰신청서 → 입찰공고, 국내/국외 분기는 M05 와 동일 taskSeCd). 임시저장은 이동 없음(터치 이벤트 X).
//   첨언/첨부는 카드 하단 버튼(있을 때만 노출) → 바텀시트로 표시.
// 데이터=파일 내 목업(설계서 항목명/형식), 동작=API 경계 스텁(console.log + '// 추후: cmService.selectRcvDocBoxList/selectTrsmDocBoxList/selectTmprDocBoxList').
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Icon } from '@/ui/common/base/Icon'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Button } from '@/ui/common/base/Button'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import { TASK_SE_CD } from '@/constants/codes'
import { docBadges, docOrgLine, docDateRows } from '@/ui/biz/cm/docBox/docBoxView'
import type {
  DateRangePresetDef,
  SearchFilterSchema,
  SearchFilterValue,
} from '@/types/search-filter'
import type { DocBoxItem, DocBoxSeCd, DocBoxAtchFile } from '@/types/mock/cm'
import type { BidPbancItem } from '@/types/mock/bd'

// 상단 분기 탭 — 문서구분 4가지(받은/보낸/반려/임시저장). docSeCd 로 목록 필터.
const DOC_TABS: TabItem[] = [
  { value: 'received', label: '받은 문서' },
  { value: 'sent', label: '보낸 문서' },
  { value: 'rejected', label: '반려 문서' },
  { value: 'temp', label: '임시저장' },
]

// ── 검색필터 (MUI-CM-06-M10 검색필터, 설계서 slide96) — 공통 SearchFilter 셸 schema ──
const DATE_PRESETS: DateRangePresetDef[] = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
]
const DOCBOX_FILTER_SCHEMA: SearchFilterSchema = {
  title: '검색필터',
  sections: [
    // 섹션 순서 = 설계서 slide96 항목 순서(사용자 확정 2026-08-24): 문서 구분 → 첨언·첨부 여부 → 기간 설정.
    {
      key: 'docSe',
      title: '문서 구분',
      fields: [
        {
          type: 'select',
          key: 'docSe',
          options: [
            { value: 'all', label: '전체' },
            { value: 'received', label: '받은 문서' },
            { value: 'sent', label: '보낸 문서' },
            { value: 'rejectedReceived', label: '반려 받은 문서' },
            { value: 'rejectedSent', label: '반려한 문서' },
            { value: 'temp', label: '임시 저장' },
          ],
        },
      ],
    },
    {
      key: 'addAtch',
      title: '첨언, 첨부 여부',
      fields: [
        {
          type: 'select',
          key: 'addAtchSe',
          options: [
            { value: 'all', label: '전체' },
            { value: 'add', label: '첨언' },
            { value: 'atch', label: '첨부' },
          ],
        },
      ],
    },
    {
      key: 'date',
      title: '기간 설정',
      fields: [{ type: 'dateRange', key: 'date', presets: DATE_PRESETS }],
    },
  ],
}
// 초기값(설계서 slide96): 문서구분 전체 · 첨언첨부 여부 전체 · 기간 최근 1개월.
const DEFAULT_FILTER: SearchFilterValue = {
  addAtchSe: 'all',
  date: {
    start: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
  },
  docSe: 'all',
}
// 필터 문서구분 → 상단 분기 탭 매핑(반려 받은/반려한 → 반려 탭).
const TAB_BY_DOC_SE: Record<string, DocBoxSeCd> = {
  received: 'received',
  sent: 'sent',
  rejectedReceived: 'rejected',
  rejectedSent: 'rejected',
  temp: 'temp',
}

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
      pbancNo: '2026-0179',
      taskSeCd: TASK_SE_CD.GOODS,
    },
    {
      docSeCd: 'received',
      docSeNm: '받은 문서',
      docNm: '입찰참가 자격 확인 요청서',
      trsmOgnzCd: '화력총괄계약팀',
      rcptnDt: '2026-03-08',
      rcptIdntyDt: '2026-03-09',
      edmsDocId: 'EDMS20260308002',
      pbancNo: '2026-0142',
      taskSeCd: TASK_SE_CD.OVERSEAS, // 국외 샘플 — 국외 공고 상세 분기 확인용
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
      pbancNo: '2026-0163',
      taskSeCd: TASK_SE_CD.GOODS,
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

// ⚠️ 임시 목업 — API 연동 시 이 상수·페이징 로직을 통째로 교체(cmService.selectRcvDocBoxList).
const MOCK_DOCS: DocBoxItem[] = (Object.keys(DOC_SAMPLES) as DocBoxSeCd[]).flatMap((se) => {
  const samples = DOC_SAMPLES[se]
  return Array.from({ length: DOC_TOTALS[se] }, (_, i) => ({
    ...samples[i % samples.length],
    id: `${se}-${i + 1}`,
  }))
})

// 첨부파일 바텀시트 목업 — 첨부문서다운로드 데이터영역(dl_atchDocList) 형식. 추후 edmsDocId 로 조회.
const MOCK_ATCH_FILES: DocBoxAtchFile[] = [
  { fileTtl: '계약통보서', fileNm: '계약통보서.hwp', fileSize: '786KB', edmsDocId: 'EDMS20260310001-1' },
  { fileTtl: '품목명세서', fileNm: '품목명세서.pdf', fileSize: '1.2MB', edmsDocId: 'EDMS20260310001-2' },
]

export function DocBoxPage() {
  const navigate = useNavigate()
  // 마이페이지에서 넘어온 초기 문서구분(받은/보낸/반려/임시저장). 없으면 '받은 문서'.
  const initTab = (useLocation().state as { docType?: DocBoxSeCd } | null)?.docType ?? 'received'
  const [tab, setTab] = useState<DocBoxSeCd>(initTab)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false) // 검색필터 풀팝업(slide96)
  const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT_FILTER)
  // 첨언/첨부파일 바텀시트 — 카드 하단 버튼이 연다(해당 데이터가 있는 카드에서만 버튼 노출).
  const [addCnItem, setAddCnItem] = useState<DocBoxItem | null>(null)
  const [atchOpen, setAtchOpen] = useState(false)

  // 탭(문서구분) 필터 → 페이징. 최신순은 목업 배열 순서 유지.
  const filtered = useMemo(() => MOCK_DOCS.filter((it) => it.docSeCd === tab), [tab])
  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visible = filtered.slice(0, loaded)

  // ── 동작 스텁 ──
  const handleTab = (next: string) => {
    setTab(next as DocBoxSeCd)
    setPage(1)
    console.log('[DocBox] 탭', next) // 추후: cmService.selectRcvDocBoxList({ docSeCd: next })
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
  // 검색필터 실행 — '문서 구분' 값을 상단 분기 탭에 동기화, 나머지 조건은 API 경계 스텁.
  const handleFilterSearch = (value: SearchFilterValue) => {
    setFilter(value)
    setPage(1)
    const next = TAB_BY_DOC_SE[value.docSe as string]
    if (next) setTab(next)
    console.log('[DocBox] 검색필터', value) // 추후 API: cmService.selectRcvDocBoxList(toRequest(value))
  }
  // 카드 클릭 = 해당 문서가 발생한 공고 상세로 이동(문서함 상세(M11) 폐기 — 260825 사용자 확정).
  //   국내/국외 분기는 M05 와 동일(taskSeCd). 상세는 state placeholder 렌더 후 pbancNo 로 조회.
  //   ⚠️ 개발계 실응답(260825)에는 공고 식별자가 없음 — 문서유형 ctgrIden(예: DP201Z)·catName 과
  //   mainNumb/subNumb(문서번호)만 존재. 이동처 매핑(ctgrIden→화면)과 공고 조회키 확보는
  //   백엔드 확인 필요(closed-network-checklist). 그때까지 pbancNo·taskSeCd 는 임시키.
  const handleCardClick = (it: DocBoxItem) => {
    const to = it.taskSeCd === TASK_SE_CD.OVERSEAS ? '/bd/ovsBidPbancDtl' : '/bd/bidPbancDtl'
    navigate(to, { state: { pbancNo: it.pbancNo, taskSeCd: it.taskSeCd } as BidPbancItem })
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
    // 임시저장은 원천 공고가 없어 이동 없음(터치 이벤트 X — 260825 사용자 확정).
    onClick: it.docSeCd === 'temp' ? undefined : () => handleCardClick(it),
    // 첨언/첨부파일 버튼 2개 디폴트(항상 노출) — 해당 데이터 없으면 disable(260825 사용자 확정).
    //   실응답(개발계): 첨언=message · 첨부=edmsIden(null 여부) — 폐쇄망 배선 시 이 필드로 교체.
    //   카드 자체가 button 이라 클릭 전파 차단(disabled 버튼은 클릭 이벤트 자체가 안 뜸).
    footer: (
      <div className="flex gap-krds-5">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          disabled={!it.addCn}
          onClick={(e) => {
            e.stopPropagation()
            setAddCnItem(it)
          }}
        >
          첨언
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          disabled={!it.edmsDocId}
          onClick={(e) => {
            e.stopPropagation()
            setAtchOpen(true)
          }}
        >
          첨부파일
        </Button>
      </div>
    ),
  }))

  // 첨부문서(dl_atchDocList) → FileDownloadList 항목. 개별 다운로드는 콘솔 스텁.
  const atchFiles: FileDownloadItem[] = MOCK_ATCH_FILES.map((f, i) => ({
    id: f.edmsDocId ?? `${f.fileNm}-${i}`,
    name: f.fileNm,
    size: f.fileSize,
    onDownload: () => console.log('[DocBox] 첨부 다운로드', f.fileNm), // 추후: cmService.downloadAtchFile
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 상단 분기 탭 — 4구분(받은/보낸/반려/임시저장). 라벨이 360px 폭에 안 들어가면 가로 스크롤. */}
      <TabList value={tab} onChange={handleTab} items={DOC_TABS} scrollButtons="auto" />

      {/* 상단바(slide95) — 좌: 검색필터 버튼(leftSlot, 관심입찰공고 M05 패턴) / 우: 표시개수 셀렉트. */}
      <ListSectionHeader
        className="px-4 pt-4"
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
        leftSlot={
          <Button variant="secondary" onClick={() => setFilterOpen(true)}>
            <Icon name="Tune" aria-hidden />
            검색필터
          </Button>
        }
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

      {/* 검색필터 풀팝업(slide96) — 공통 SearchFilter 셸. 첨언·첨부 여부 → 기간 설정 → 문서 구분. */}
      <SearchFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        schema={DOCBOX_FILTER_SCHEMA}
        value={filter}
        defaultValue={DEFAULT_FILTER}
        onSearch={handleFilterSearch}
      />

      {/* 첨언 바텀시트 — 카드 [첨언] 버튼. 콘텐츠는 첨언(addCn) 전문. */}
      <BottomSheet
        open={addCnItem !== null}
        onOpenChange={(open) => {
          if (!open) setAddCnItem(null)
        }}
        title="첨언"
      >
        <p className="whitespace-pre-line pb-4 text-krds-body-md leading-relaxed text-krds-text-ink">
          {addCnItem?.addCn}
        </p>
      </BottomSheet>

      {/* 첨부파일 바텀시트 — 카드 [첨부파일] 버튼. 파일명+크기+개별 다운로드(FileDownloadList). */}
      <BottomSheet open={atchOpen} onOpenChange={setAtchOpen} title="첨부파일">
        <div className="pb-4">
          <FileDownloadList files={atchFiles} />
        </div>
      </BottomSheet>
    </div>
  )
}
DocBoxPage.displayName = 'DocBoxPage'
