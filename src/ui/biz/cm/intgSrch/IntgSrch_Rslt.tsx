// MUI-MS-01-M10 통합검색 결과목록(IntgSrch_Rslt). 설계서 00공통 / Figma 10020-84644(결과목록).
// M09 통합검색(IntgSrchPage)의 FullPopup 오버레이 안에서 "검색 실행 후" 본문에 렌더되는 결과목록
//   콘텐츠 컴포넌트다(라우트 아님 — 검색바/헤더는 부모 FullPopup 이 소유). 검색바 아래부터를 그린다:
//   ① {검색어} 검색결과 총 N개(SectionTitle) → ② 검색필터 버튼 + 정렬 셀렉트 →
//   ③ 결과 카테고리별(입찰공고·개찰결과) 섹션: 카테고리 총건수 + 카드 리스트 + 더보기.
// 데이터는 파일 내 목업 상수, 핸들러는 console.log + // 추후 API 주석으로 경계 표시.
//   실제 검색결과는 cmService.selectSearchAll(keyword) → 카테고리별 목록/총건수 반환.
// common/(base·composites)만 조립 — 신규 공통 컴포넌트 없음(정렬 셀렉트는 base SelectBox 로 근사).
//
// ⚠️ TODO(설계서 확인): M10 데이터영역의 영문 항목ID(카드 필드)가 설계서에서 미확정이라, 아래 목업은
//   입찰(BD) 설계서(src/types/bd.ts, dlt_bidPbancIntgList · 개찰목록)의 항목명을 그대로 재사용했다.
//   (taskSeNm · bidMthdNm · pbancTpcd · pbancNo · bidPbancNm · pbancDt · bidClrsDt · tndrSbmsnDdlnDt · opbidDt)
//   M10 설계서 데이터영역이 확정되면 키/라벨을 그에 맞춰 교체.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'

export interface IntgSrch_RsltProps {
  /** 실행된 검색어 — 결과 타이틀("{keyword} 검색결과")·목업 컨텍스트. */
  keyword: string
  /** 검색필터 버튼 클릭 → 상세필터(통합검색 필터, Figma 10020-84840) open. 부모 위임(옵션). */
  onFilterClick?: () => void
  /** 카드 이동 시 통합검색 FullPopup 오버레이를 닫는 훅(옵션). */
  onNavigate?: () => void
}

// ─── 목업 데이터 ──────────────────────────────────────────────────────────────
// 결과 카드 1건. 항목명은 입찰(BD) 설계서 그대로(위 상단 TODO 참고).
interface IntgSrchRsltItem {
  id: string
  /** 업무구분(taskSeNm) — 물품/용역/공사/국외. 배지 */
  taskSeNm: string
  /** 입찰방식(bidMthdNm) — 경쟁입찰/공개수의 등. 배지 */
  bidMthdNm: string
  /** 공고구분(pbancTpcd) — 정상공고/긴급공고 등. subtitle 접두 */
  pbancTpcd: string
  /** 공고번호(pbancNo) — subtitle */
  pbancNo: string
  /** 입찰건명(bidPbancNm) — 카드 제목(2줄 말줄임) */
  bidPbancNm: string
  /** 공고일자(pbancDt) */
  pbancDt: string
  /** 입찰참가등록마감일시(bidClrsDt) — Figma 라벨 '입찰참가신청 마감일시' */
  bidClrsDt: string
  /** 입찰서제출마감일시(tndrSbmsnDdlnDt) */
  tndrSbmsnDdlnDt: string
  /** 개찰일시(opbidDt) */
  opbidDt: string
}

// 결과 카테고리(입찰공고·개찰결과 …). 카테고리별로 총건수·상세경로가 다르다.
interface IntgSrchRsltGroup {
  /** 카테고리 키(더보기 페이지 상태 식별) */
  key: string
  /** 카테고리명 */
  title: string
  /** 카테고리 총건수(API total) */
  total: number
  /** 카드 → 상세 경로(고정 — 식별자는 navigate state). ⚠️ TODO(라우트 확인): 통합검색→도메인 상세 경로는 코디네이터가 라우터에 확정. */
  detailPath: string
  items: IntgSrchRsltItem[]
}

// 카테고리별 목업 6건씩 — 추후 API: cmService.selectSearchAll(keyword).category(items/total).
function mockItems(prefix: string): IntgSrchRsltItem[] {
  const seed: Omit<IntgSrchRsltItem, 'id' | 'pbancNo'>[] = [
    {
      taskSeNm: '물품',
      bidMthdNm: '경쟁입찰',
      pbancTpcd: '긴급공고',
      bidPbancNm: '특수작전용 대물타격 무인항공기',
      pbancDt: '2025-12-22',
      bidClrsDt: '2025-12-23 17:00',
      tndrSbmsnDdlnDt: '2025-12-24 10:00',
      opbidDt: '2025-12-24 10:30',
    },
    {
      taskSeNm: '용역',
      bidMthdNm: '공개수의',
      pbancTpcd: '정상공고',
      bidPbancNm: '2026년 정보체계 유지보수 용역',
      pbancDt: '2025-12-20',
      bidClrsDt: '2025-12-22 18:00',
      tndrSbmsnDdlnDt: '2025-12-23 10:00',
      opbidDt: '2025-12-23 11:00',
    },
    {
      taskSeNm: '공사',
      bidMthdNm: '경쟁입찰',
      pbancTpcd: '정정공고',
      bidPbancNm: '군 정비고 증축 공사',
      pbancDt: '2025-12-18',
      bidClrsDt: '2025-12-21 17:00',
      tndrSbmsnDdlnDt: '2025-12-22 10:00',
      opbidDt: '2025-12-22 14:00',
    },
    {
      taskSeNm: '물품',
      bidMthdNm: '경쟁입찰',
      pbancTpcd: '재공고',
      bidPbancNm: '전투피복 세트 구매',
      pbancDt: '2025-12-15',
      bidClrsDt: '2025-12-18 17:00',
      tndrSbmsnDdlnDt: '2025-12-19 10:00',
      opbidDt: '2025-12-19 11:00',
    },
    {
      taskSeNm: '국외',
      bidMthdNm: '경쟁입찰',
      pbancTpcd: '정상공고',
      bidPbancNm: '야간투시경 해외구매',
      pbancDt: '2025-12-12',
      bidClrsDt: '2025-12-16 17:00',
      tndrSbmsnDdlnDt: '2025-12-17 10:00',
      opbidDt: '2025-12-17 15:00',
    },
    {
      taskSeNm: '용역',
      bidMthdNm: '공개수의',
      pbancTpcd: '정상공고',
      bidPbancNm: '통신장비 정비 지원 용역',
      pbancDt: '2025-12-10',
      bidClrsDt: '2025-12-13 17:00',
      tndrSbmsnDdlnDt: '2025-12-14 10:00',
      opbidDt: '2025-12-14 11:30',
    },
  ]
  return seed.map((s, i) => ({
    ...s,
    id: `${prefix}-${i + 1}`,
    pbancNo: `LDG${String(97 + i).padStart(4, '0')}-1`,
  }))
}

// 검색결과 카테고리 목업(입찰공고·개찰결과) — total 은 실제 API total(카드 수와 무관하게 큼).
const RESULT_GROUPS: IntgSrchRsltGroup[] = [
  {
    key: 'bidPbanc',
    title: '입찰공고',
    total: 533,
    detailPath: '/bd/bidPbancDtl',
    items: mockItems('bp'),
  },
  {
    key: 'bdopn',
    title: '개찰결과',
    total: 27,
    // ⚠️ TODO(라우트 확인): 개찰결과 상세 경로 미확정 — 입찰공고 상세로 임시 라우팅.
    detailPath: '/bd/bidPbancDtl',
    items: mockItems('bo'),
  },
]

// 전체 검색결과 총건수(Figma 2,010개) — 카테고리 합(560)과 별개(시스템 전체 매칭 건수).
const TOTAL_ALL = 2010

// 정렬 옵션(Figma 10020-84737) — 관련도순/최신순/인기순.
const SORT_OPTIONS = [
  { value: 'relevance', label: '관련도순' },
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
]

// 한 카테고리에서 처음 노출 + 더보기 1회당 추가되는 카드 수(Figma: 3장 후 더보기).
const GROUP_PAGE_SIZE = 3

function IntgSrch_Rslt({ keyword, onFilterClick, onNavigate }: IntgSrch_RsltProps) {
  const navigate = useNavigate()
  const [sort, setSort] = useState('relevance')
  // 카테고리별 더보기 페이지(기본 1 = GROUP_PAGE_SIZE 장). key → page.
  const [pages, setPages] = useState<Record<string, number>>({})

  const handleSort = (value: string) => {
    setSort(value)
    console.log('[intgSrchRslt] 정렬', value)
    // 추후 API: cmService.selectSearchAll(keyword, { sort: value }) 재조회
  }

  const handleFilter = () => {
    console.log('[intgSrchRslt] 검색필터')
    onFilterClick?.()
    // 추후: 통합검색 상세필터(Figma 10020-84840) 풀팝업 open
  }

  const handleLoadMore = (group: IntgSrchRsltGroup) => {
    setPages((prev) => ({ ...prev, [group.key]: (prev[group.key] ?? 1) + 1 }))
    console.log('[intgSrchRslt] 더보기', group.key)
    // 추후 API: cmService.selectSearchAll(keyword).category(group.key).nextPage() 누적
  }

  const handleCardClick = (group: IntgSrchRsltGroup, item: IntgSrchRsltItem) => {
    console.log('[intgSrchRslt] 카드 이동', group.key, item.id)
    onNavigate?.() // 통합검색 오버레이 닫기
    // 클릭 항목을 state 로 전달(목록 → 상세 표준). ⚠️ TODO(라우트 확인): 카테고리별 상세 경로 확정 필요.
    navigate(group.detailPath, { state: item })
  }

  // 카드 props 매핑(Figma m_card): 배지(업무구분·입찰방식) + subtitle(공고구분 공고번호) + title(입찰건명) + 4행.
  const toCardItems = (group: IntgSrchRsltGroup): CardListItem[] => {
    const loaded = (pages[group.key] ?? 1) * GROUP_PAGE_SIZE
    return group.items.slice(0, loaded).map((it) => ({
      id: it.id,
      badges: (
        <>
          <Badge>{it.taskSeNm}</Badge>
          <Badge>{it.bidMthdNm}</Badge>
        </>
      ),
      subtitle: `${it.pbancTpcd} ${it.pbancNo}`,
      title: it.bidPbancNm,
      rows: [
        { label: '공고일자', value: it.pbancDt },
        { label: '입찰참가신청 마감일시', value: it.bidClrsDt },
        { label: '입찰서제출 마감일시', value: it.tndrSbmsnDdlnDt },
        { label: '개찰일시', value: it.opbidDt },
      ],
      onClick: () => handleCardClick(group, it),
    }))
  }

  return (
    <div className="flex w-full flex-col">
      {/* 검색결과 타이틀 — "{검색어} 검색결과 총 N개"(검색어 강조). */}
      <SectionTitle info={`총 ${TOTAL_ALL.toLocaleString()}개`}>
        <span className="text-krds-text-primary-active">{keyword}</span> 검색결과
      </SectionTitle>

      {/* 검색필터 버튼 + 정렬 셀렉트 바 */}
      <div className="flex items-center justify-between gap-krds-5 px-4 py-krds-6">
        <Button variant="secondary" onClick={handleFilter}>
          <Icon name="Tune" size={20} aria-hidden />
          검색필터
        </Button>
        {/* Figma 정렬은 컴팩트 네이비 pill(m_select_text) — 전용 공통 컴포넌트가 없어 base SelectBox 로 근사. */}
        <div className="w-32 shrink-0">
          <SelectBox
            items={SORT_OPTIONS}
            value={sort}
            onValueChange={handleSort}
            aria-label="정렬"
          />
        </div>
      </div>

      {/* 카테고리별 결과 섹션 */}
      {RESULT_GROUPS.map((group) => {
        const cardItems = toCardItems(group)
        // 로컬 목업이 더 남아 있으면 더보기 노출(실제로는 loaded < total 로 서버 페이징 판단).
        const hasMore = cardItems.length < group.items.length
        return (
          <section key={group.key} className="flex w-full flex-col">
            <SectionTitle info={`총 ${group.total.toLocaleString()}건`}>
              {group.title}
            </SectionTitle>
            <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
              <CardList items={cardItems} />
              {hasMore && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleLoadMore(group)}
                >
                  더보기
                </Button>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
IntgSrch_Rslt.displayName = 'IntgSrch_Rslt'

export { IntgSrch_Rslt }
