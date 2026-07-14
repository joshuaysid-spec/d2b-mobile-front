// MUI-MS-01-M09 통합검색(IntgSrch). 설계서 00공통 slide24~25.
// Figma 9304-77195(최근검색어) / 9304-77324(최근검색어 없음) / 9304-77443(자동완성 ON) / 9304-77553(자동완성 OFF).
// 헤더 util='search'(메인/서브) 클릭 시 AppLayout 이 여는 FullPopup 오버레이(라우트 아님 — M12 MenuPage 와 동일 패턴).
// 상태 분기(검색어 유무 + 자동완성 토글):
//   ① 검색어 없음             → 최근 검색어(TagList/Empty) + 자주 찾는 서비스(1~10)
//   ② 검색어 있음 · 자동완성 ON → 자동완성 6건(검색어 하이라이트) + 자동완성 토글 + 관련 서비스
//   ③ 검색어 있음 · 자동완성 OFF → 안내 Empty + 자동완성 토글 + 관련 서비스
// 데이터는 파일 내 목업 상수, 핸들러는 console.log + // 추후 API 주석으로 경계 표시. 실제 검색은 cmService.searchAll.
// common/(base·composites)만 조립 — 신규 공통 컴포넌트 없음.
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { Switch } from '@/ui/common/base/Switch'
import { Empty } from '@/ui/common/feedback/Empty'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { TagList } from '@/ui/common/composites/TagList'
import { IntgSrch_Rslt } from '@/ui/biz/cm/intgSrch/IntgSrch_Rslt'
import { cn } from '@/utils/cn'

export interface IntgSrchPageProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── 목업 데이터 ──────────────────────────────────────────────────────────────
// 최근 검색어(최대 10) — 추후 API: cmService.getRecentSearches() / localStorage.
interface RecentSearch {
  id: string
  keyword: string
}
const RECENT_SEARCHES_SEED: RecentSearch[] = [
  { id: 'r1', keyword: '방위사업청 물품' },
  { id: 'r2', keyword: '국방부' },
  { id: 'r3', keyword: '조달' },
  { id: 'r4', keyword: '민원서류' },
  { id: 'r5', keyword: '인증서 가져오기' },
]

// 자주 찾는 서비스(최대 10) — 추후 API: cmService.getFrequentServices().
interface FrequentService {
  id: string
  label: string
}
const FREQUENT_SERVICES: FrequentService[] = [
  { id: 'f1', label: '입찰 공고' },
  { id: 'f2', label: '대금청구' },
  { id: 'f3', label: '세금계산서' },
  { id: 'f4', label: '사전의향서' },
  { id: 'f5', label: '조달계획' },
  { id: 'f6', label: '계약현황' },
  { id: 'f7', label: '검사 및 납품조서' },
  { id: 'f8', label: '하자관리' },
  { id: 'f9', label: '전자보증' },
  { id: 'f10', label: '국민신문고' },
]

// 자동완성 후보 풀(메뉴명) — 추후 API: cmService.getAutocomplete(keyword).
const AUTOCOMPLETE_POOL: string[] = [
  '입찰 공고',
  '입찰참가신청',
  '입찰진행',
  '입찰서제출',
  '관심입찰공고',
  '입찰참가등록반려신청',
  '대금청구',
  '세금계산서 발급',
  '사전의향서',
  '조달계획관리',
  '전자계약',
  '검사 및 납품조서',
  '하자관리',
  '전자보증',
  '보증사용현황',
  '공지사항',
  '자료실',
  '법령조회',
  '용어사전',
]

// 관련 서비스 — 추후 API: cmService.getRelatedServices(keyword).
interface RelatedService {
  id: string
  label: string
}
const RELATED_SERVICES: RelatedService[] = [
  { id: 's1', label: '입찰참가 신청' },
  { id: 's2', label: '입찰서 제출' },
  { id: 's3', label: '대금청구 신청' },
  { id: 's4', label: '계약 체결' },
]

// 검색어가 포함된 부분을 굵게(파랑) 강조. Figma 자동완성 매칭 하이라이트.
function highlightMatch(text: string, keyword: string): ReactNode {
  const idx = text.indexOf(keyword)
  if (!keyword || idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-krds-text-primary-active">
        {text.slice(idx, idx + keyword.length)}
      </span>
      {text.slice(idx + keyword.length)}
    </>
  )
}

// 섹션 제목(+우측 액션) — 페이지 로컬 소형 헤딩(공통 컴포넌트 아님).
function SectionHeading({
  title,
  action,
}: {
  title: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[17px] font-bold leading-normal text-krds-text-ink">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-[15px] leading-normal text-krds-text-muted underline underline-offset-2 focus-visible:outline-hidden active:opacity-70"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

function IntgSrchPage({ open, onOpenChange }: IntgSrchPageProps) {
  const [keyword, setKeyword] = useState('')
  // 실행된 검색어 — 검색 버튼/Enter/자동완성 선택 시 확정. 이 값이 있고 현재 입력과 같으면
  //   결과목록(MUI-MS-01-M10, IntgSrch_Rslt)을 본문에 렌더한다(검색어를 다시 고치면 자동완성으로 복귀).
  const [executed, setExecuted] = useState<string | null>(null)
  const [recent, setRecent] = useState<RecentSearch[]>(RECENT_SEARCHES_SEED)
  const [autoComplete, setAutoComplete] = useState(true)
  // 자동완성 토글 라벨 연결용 id(접근성).
  const autoCompleteId = useId()
  // 진입 시 검색 영역 포커스 — Radix 가 기본으로 헤더 닫기버튼에 포커스를 주므로(본문보다 앞),
  // open 될 때마다 한 틱 뒤 입력에 명시 포커스(설계서 slide24 "검색 영역으로 포커스 이동").
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(t)
  }, [open])

  const trimmed = keyword.trim()
  const isSearching = trimmed.length > 0
  // 검색 실행 후 & 입력을 고치지 않았을 때만 결과목록 노출.
  const showResults = executed !== null && executed === trimmed && isSearching

  // 자동완성 후보(검색어 포함 메뉴명, 최대 6) — 클라이언트 필터(목업).
  const suggestions = useMemo(
    () => (isSearching ? AUTOCOMPLETE_POOL.filter((n) => n.includes(trimmed)).slice(0, 6) : []),
    [isSearching, trimmed],
  )
  // 관련 서비스(검색어 포함) — 목업.
  const related = useMemo(
    () => (isSearching ? RELATED_SERVICES.filter((s) => s.label.includes(trimmed)) : []),
    [isSearching, trimmed],
  )

  // 닫을 때 검색어/결과 초기화(재진입 시 깨끗한 상태 + 진입 포커스).
  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setKeyword('')
      setExecuted(null)
    }
    onOpenChange(o)
  }

  const handleSearch = (kw?: string) => {
    const q = (kw ?? keyword).trim()
    if (!q) return
    setExecuted(q) // 결과목록(IntgSrch_Rslt) 노출 트리거
    console.log('[intgSrch] 통합검색', q)
    // 추후 API: cmService.searchAll(q) → 카테고리별 결과목록(MUI-MS-01-M10)
  }

  const handleRemoveRecent = (id: string | number) => {
    setRecent((prev) => prev.filter((r) => r.id !== id))
    console.log('[intgSrch] 최근 검색어 삭제', id)
    // 추후 API: cmService.removeRecentSearch(id)
  }
  const handleClearRecent = () => {
    setRecent([])
    console.log('[intgSrch] 최근 검색어 전체삭제')
    // 추후 API: cmService.clearRecentSearches()
  }
  const handleSelectSuggestion = (s: string) => {
    setKeyword(s)
    handleSearch(s)
  }
  const handleSelectService = (label: string) => {
    console.log('[intgSrch] 서비스 이동', label)
    // 추후 라우팅: navigate(서비스 화면)
  }

  return (
    <FullPopup open={open} onOpenChange={handleOpenChange} title="통합검색">
      {/* 히어로 + 검색 행 — 상단 고정(스크롤 시 유지). Figma bg-primary-faint. */}
      <div className="sticky top-0 z-10 flex flex-col gap-krds-7 bg-krds-bg-primary-faint px-krds-8 pt-krds-7 pb-krds-8">
        <p className="text-[20px] font-bold leading-snug text-krds-text-ink">
          국방전자조달시스템,
          <br />
          이제 한 곳에서 찾아보세요.
        </p>
        <div className="flex items-center gap-krds-5">
          <InputBox
            ref={inputRef}
            className="flex-1"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            placeholder="검색할 내용을 입력하세요."
            aria-label="통합검색"
          />
          <Button
            variant="secondary"
            size="icon"
            aria-label="검색"
            onClick={() => handleSearch()}
          >
            <Icon name="Search" size={20} aria-hidden />
          </Button>
        </div>
      </div>

      {/* 본문 — 검색 실행 시 결과목록(M10), 그 외 검색 입력 상태 분기.
          결과목록은 자체 섹션타이틀/카드가 full-bleed 라 px-8 패딩 컨테이너 밖에서 렌더. */}
      {showResults ? (
        <IntgSrch_Rslt keyword={executed} onNavigate={() => handleOpenChange(false)} />
      ) : (
      <div className="flex flex-col gap-krds-9 px-krds-8 py-krds-8">
        {!isSearching ? (
          <>
            {/* 최근 검색어 */}
            <section className="flex flex-col gap-krds-6">
              <SectionHeading
                title="최근 검색어"
                action={
                  recent.length > 0
                    ? { label: '전체삭제', onClick: handleClearRecent }
                    : undefined
                }
              />
              {recent.length > 0 ? (
                <TagList
                  items={recent.map((r) => ({ id: r.id, label: r.keyword }))}
                  onRemove={handleRemoveRecent}
                />
              ) : (
                <Empty className="py-krds-8">최근 검색어가 없습니다.</Empty>
              )}
            </section>

            {/* 자주 찾는 서비스 — 2열(좌 1~5 / 우 6~10), 상위 3위 파랑 강조. */}
            <section className="flex flex-col gap-krds-6">
              <SectionHeading title="자주 찾는 서비스" />
              <ul
                aria-label="자주 찾는 서비스 목록"
                className="grid grid-flow-col grid-cols-2 grid-rows-5 gap-x-krds-7"
              >
                {FREQUENT_SERVICES.map((svc, i) => (
                  <li key={svc.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectService(svc.label)}
                      className="flex min-h-[44px] w-full items-center gap-krds-5 py-krds-4 text-left focus-visible:outline-hidden active:opacity-70"
                    >
                      <span
                        className={cn(
                          'w-5 shrink-0 text-[17px] font-bold',
                          i < 3 ? 'text-krds-text-primary-active' : 'text-krds-text-ink',
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="truncate text-[17px] text-krds-text-ink">{svc.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <>
            {/* 자동완성 ON → 후보 목록(없으면 결과 없음) · OFF → 안내 메시지 */}
            {autoComplete ? (
              suggestions.length > 0 ? (
                <ul aria-label="검색 자동완성 목록" className="flex flex-col">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(s)}
                        className="flex min-h-[44px] w-full items-center gap-krds-5 py-krds-5 text-left focus-visible:outline-hidden active:opacity-70"
                      >
                        <Icon
                          name="Search"
                          size={20}
                          className="shrink-0 text-krds-text-muted"
                          aria-hidden
                        />
                        <span className="truncate text-[17px] text-krds-text-ink">
                          {highlightMatch(s, trimmed)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty className="py-krds-9">검색 결과가 없습니다.</Empty>
              )
            ) : (
              <Empty className="py-krds-9" description="보다 빠른 검색을 위해 자동완성 기능을 켜주세요">
                자동완성 기능이 꺼져 있습니다.
              </Empty>
            )}

            {/* 자동완성 토글 — 우측 정렬, 상단 1px divider. */}
            <div className="flex items-center justify-end border-t border-krds-border-divider pt-krds-7">
              <Switch
                id={autoCompleteId}
                checked={autoComplete}
                onCheckedChange={setAutoComplete}
                label="자동완성"
              />
            </div>

            {/* 관련 서비스 — 검색어 매칭 시에만 노출. */}
            {related.length > 0 && (
              <section className="flex flex-col gap-krds-6">
                <SectionHeading title="관련 서비스" />
                <NavigationItemList
                  items={related.map((s) => ({
                    id: s.id,
                    label: s.label,
                    onClick: () => handleSelectService(s.label),
                  }))}
                />
              </section>
            )}
          </>
        )}
      </div>
      )}
    </FullPopup>
  )
}
IntgSrchPage.displayName = 'IntgSrchPage'

export { IntgSrchPage }
