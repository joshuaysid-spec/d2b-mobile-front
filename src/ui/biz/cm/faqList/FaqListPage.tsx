// 자주묻는질문(FAQ) — MUI-CM-04-M03. Figma 10020-87508 / 설계서 00.공통 v0.83 slide232·233.
// 구성: 검색영역(검색범위 select + 검색어 + 검색) → 구분 탭 → 목록헤더(총건수·표시개수)
//   → 아코디언(FaqList, 질문 클릭 시 답변 펼침·다중 열림) → 더보기 → 맨위로 FAB.
// 별도 상세 화면·검색필터 풀팝업 없음(검색조건 dm_searchInfo = 제목/내용/구분이 모두 인라인·탭으로 표현).
import { useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { FaqList, type FaqItemView } from './FaqList'
import { FAQ_MOCK } from './faqMock'

// 검색범위 — 제목(qstnTtl)/내용(contsCn), '전체'는 둘 다. (설계서 검색조건 dm_searchInfo)
const SCOPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'qstnTtl', label: '제목' },
  { value: 'contsCn', label: '내용' },
]
// 구분(bizFldCd, FAQCD) 탭 — 전체 + 카테고리. value = bizFldCd(라벨과 동일).
const CATEGORY_TABS: TabItem[] = [
  { value: 'all', label: '전체' },
  { value: '전자입찰일반', label: '전자입찰일반' },
  { value: '업체등록', label: '업체등록' },
  { value: '인증관련문의', label: '인증관련문의' },
  { value: '입찰참가신청서제출', label: '입찰참가신청서제출' },
  { value: '입찰서제출', label: '입찰서제출' },
  { value: '홈페이지일반', label: '홈페이지일반' },
  { value: '전자문서유통', label: '전자문서유통' },
  { value: '지문인식관련', label: '지문인식관련' },
  { value: '전자계약', label: '전자계약' },
  { value: '기타', label: '기타' },
  { value: '윈도우10 PC환경설정', label: '윈도우10 PC환경설정' },
  { value: '납품대가(방위사업청)', label: '납품대가(방위사업청)' },
  { value: '선금(방위사업청)', label: '선금(방위사업청)' },
  { value: '착·중도금(방위사업청)', label: '착·중도금(방위사업청)' },
]

export function FaqListPage() {
  const [scope, setScope] = useState('all') // 검색범위(전체/제목/내용)
  const [keyword, setKeyword] = useState('') // 검색어(입력 중)
  const [applied, setApplied] = useState<{ keyword: string; scope: string }>({
    keyword: '',
    scope: 'all',
  })
  const [category, setCategory] = useState('all') // 구분 탭
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [openIds, setOpenIds] = useState<Set<string>>(new Set()) // 펼친 질문(다중)

  // ── API 경계 스텁 ──
  const handleSearch = () => {
    setApplied({ keyword: keyword.trim(), scope })
    setPage(1)
    console.log('[Faq] 검색', { keyword: keyword.trim(), scope })
    // cmService.getFaqList({ [scope]: keyword, bizFldCd: category, page: 1, ... })
  }
  const handleTab = (v: string) => {
    setCategory(v)
    setPage(1)
    console.log('[Faq] 구분', v)
  }
  const handlePageSize = (s: number) => {
    setPageSize(s)
    setPage(1)
  }
  const handleLoadMore = () => setPage((p) => p + 1)
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // ── ⚠️ 임시 목업 필터/페이징 (API 연동 시 교체) ⚠️ ──
  const filtered = useMemo(() => {
    let list = FAQ_MOCK
    if (category !== 'all') list = list.filter((it) => it.bizFldCd === category)
    const kw = applied.keyword.toLowerCase()
    if (kw) {
      list = list.filter((it) => {
        if (applied.scope === 'qstnTtl') return it.qstnTtl.toLowerCase().includes(kw)
        if (applied.scope === 'contsCn') return it.contsCn.toLowerCase().includes(kw)
        return (
          it.qstnTtl.toLowerCase().includes(kw) || it.contsCn.toLowerCase().includes(kw)
        )
      })
    }
    return list
  }, [category, applied])

  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const faqItems: FaqItemView[] = filtered.slice(0, loaded).map((it) => ({
    id: it.bbsId,
    category: it.bizFldCd,
    question: it.qstnTtl,
    answer: it.contsCn,
  }))

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 검색범위 select + 검색어 / 검색 버튼 */}
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <div className="flex items-center gap-krds-5">
          <div className="w-[96px] shrink-0">
            <SelectBox value={scope} onValueChange={setScope} items={SCOPE_OPTIONS} />
          </div>
          <InputBox
            className="min-w-px flex-1"
            value={keyword}
            placeholder="검색어를 입력하세요."
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            aria-label="자주묻는질문 검색어"
          />
        </div>
        <Button variant="primary" className="w-full" onClick={handleSearch}>
          <Icon name="Search" size={20} aria-hidden />
          검색
        </Button>
      </div>

      <SectionDivider />

      {/* 구분 탭 — 전체/조달계약/입찰/계약/이행 */}
      <div className="px-4">
        <TabList value={category} onChange={handleTab} items={CATEGORY_TABS} />
      </div>

      {/* 목록 헤더 — 총건수 + 표시개수 */}
      <div className="px-4">
        <ListSectionHeader total={total} pageSize={pageSize} onPageSizeChange={handlePageSize} />
      </div>

      {/* 아코디언 목록 */}
      <FaqList items={faqItems} openIds={openIds} onToggle={toggle} />

      {/* 더보기 */}
      {loaded < total && (
        <>
          <SectionDivider />
          <div className="px-4 py-4">
            <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
              더보기 ({loaded}/{total})
            </Button>
          </div>
        </>
      )}

      {/* 맨 위로 FAB */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  )
}
FaqListPage.displayName = 'FaqListPage'
