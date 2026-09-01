// 법령조회 = 법령정보 — MUI-CM-04-M24 `SttInfoListPage`. 설계서 00.공통 v0.84 slide344·345.
// 고객센터 > 법령조회. 법령구분(싱글 셀렉트 탭) + 법령명 검색으로 법령 목록 조회.
//   카드 클릭 → 외부 브라우저로 법령 원문(sttUrl) 이동. 즐겨찾기(별) 토글(로컬 상태).
//   (요청 ID "P24" 는 오ID — 설계서/앱메뉴 실제 M24. 검색은 상단 인라인이라 검색필터 풀팝업/바텀시트 없음.)
// 데이터=파일 내 목업(dl_resultList 항목명/형식), 동작=API 경계 스텁. 관심법령 ItrstSttPage 레퍼런스.
import { useMemo, useState } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { STT_TYPES, type MockSttInfoItem, type MockSttType } from '@/types/mock/cm'

// 법령구분 탭 — '전체'(필터 전용) + 11종(STT_TYPES). 싱글 셀렉트(slide344).
const ALL = '전체'
const STT_TYPE_TABS: TabItem[] = [
  { value: ALL, label: ALL },
  ...STT_TYPES.map((t) => ({ value: t, label: t })),
]

// ── 목업 (설계서 slide344 예시 + 데이터영역 dl_resultList 항목명/형식) ────────────
// 법령구분별로 분포하도록 구성. API 연동 시 이 상수와 클라 필터/페이징을 조회로 교체.
const dl_resultList: MockSttInfoItem[] = [
  {
    id: '1',
    sttType: '법령',
    sttAbbrNm: '주요 법령 모음',
    sttNm: '방위사업법',
    sttEnfcYmd: '2025-01-01',
    sttUrl: 'https://www.law.go.kr/법령/방위사업법',
    sttItrst: true,
  },
  {
    id: '2',
    sttType: '훈령',
    sttAbbrNm: '방위사업법/국계법',
    sttNm: '방위사업법 시행규칙',
    sttEnfcYmd: '2024-07-01',
    sttUrl: 'https://www.law.go.kr/법령/방위사업법시행규칙',
    sttItrst: false,
  },
  {
    id: '3',
    sttType: '예규',
    sttAbbrNm: '방위사업청(중앙조달) 주요 규정',
    sttNm: '군수품조달 관리규정',
    sttEnfcYmd: '2024-03-20',
    sttUrl: 'https://www.law.go.kr/행정규칙/군수품조달관리규정',
    sttItrst: false,
  },
  {
    id: '4',
    sttType: '지침',
    sttAbbrNm: '국방부(부대조달) 주요 규정',
    sttNm: '군시설공사 입찰참가자격사전심사 세부운영 기준에 관한 훈령',
    sttEnfcYmd: '2023-12-15',
    sttUrl: 'https://www.law.go.kr/행정규칙/군시설공사입찰참가자격사전심사훈령',
    sttItrst: true,
  },
  {
    id: '5',
    sttType: '대통령령',
    sttAbbrNm: '국가계약법 시행령',
    sttNm: '국가를 당사자로 하는 계약에 관한 법률 시행령',
    sttEnfcYmd: '2025-02-10',
    sttUrl: 'https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행령',
    sttItrst: false,
  },
  {
    id: '6',
    sttType: '부령',
    sttAbbrNm: '국가계약법 시행규칙',
    sttNm: '국가를 당사자로 하는 계약에 관한 법률 시행규칙',
    sttEnfcYmd: '2024-11-05',
    sttUrl: 'https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행규칙',
    sttItrst: false,
  },
]

// ⚠️ 임시 목업 — API 연동 시 서버 조회(검색조건/page/pageSize)로 교체(목록 컨벤션).
const TOTAL = 42
const MOCK_LIST: MockSttInfoItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...dl_resultList[i % dl_resultList.length],
  id: String(i + 1),
}))

export function SttInfoListPage() {
  const [sttType, setSttType] = useState<MockSttType | typeof ALL>(ALL) // 법령구분 탭(전체 기본)
  const [keyword, setKeyword] = useState('') // 법령명 입력 중
  const [applied, setApplied] = useState('') // 검색 실행 시 확정
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<MockSttInfoItem[]>(MOCK_LIST)

  // 법령구분 + 법령명(Like) 필터 — 검색 실행(applied)/탭 기준.
  const filtered = useMemo(() => {
    const q = applied.trim()
    return items.filter(
      (it) =>
        (sttType === ALL || it.sttType === sttType) &&
        (q === '' || it.sttNm.includes(q) || it.sttAbbrNm.includes(q)),
    )
  }, [items, sttType, applied])

  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visible = useMemo(() => filtered.slice(0, loaded), [filtered, loaded])

  const handleTabChange = (v: string) => {
    setSttType(v as MockSttType | typeof ALL)
    setPage(1)
    // 추후 API: 법령구분 변경 시 목록 재조회
  }
  const handleSearch = () => {
    setApplied(keyword)
    setPage(1)
    // 추후 API: scwin.grd_sttList — 검색조건(sttType/sttNm)으로 법령정보 조회
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }
  // 항목 클릭 — 외부 브라우저로 법령 원문(sttUrl) 이동(추후 하이브리드 외부 브라우저 브릿지).
  const handleOpen = (it: MockSttInfoItem) => {
    window.open(it.sttUrl, '_blank', 'noopener,noreferrer')
  }
  // 즐겨찾기 토글 — 별 하이라이트 on/off(로컬). 해제해도 페이지 유지 중엔 목록 잔류(관심법령 선례).
  const handleToggleStar = (it: MockSttInfoItem) => {
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, sttItrst: !x.sttItrst } : x)))
    // 추후 API: scwin.grd_sttItrst — 즐겨찾기 등록/해제
  }

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 자주묻는질문(M03) 포맷 통일(v0.87 검토 63번 기획 확정):
          검색범위(법령명) 셀렉트 + 검색어 + 풀폭 검색 버튼이 상단, 구분 탭이 아래. */}
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <div className="flex items-center gap-krds-5">
          <div className="w-[96px] shrink-0">
            <SelectBox
              aria-label="검색범위"
              value="sttNm"
              onValueChange={() => {}}
              items={[{ value: 'sttNm', label: '법령명' }]}
            />
          </div>
          <InputBox
            className="min-w-px flex-1"
            value={keyword}
            maxLength={300}
            placeholder="검색어를 입력하세요."
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
            aria-label="법령명 검색어"
          />
        </div>
        <Button variant="primary" className="w-full" onClick={handleSearch}>
          <Icon name="Search" size={20} aria-hidden />
          검색
        </Button>
      </div>

      <div className="h-px w-full bg-krds-border-divider" aria-hidden />

      {/* 법령구분 탭(싱글 셀렉트) — 검색영역 아래(M03 포맷). */}
      <TabList
        variant="button"
        scrollButtons="auto"
        value={sttType}
        onChange={handleTabChange}
        items={STT_TYPE_TABS}
        aria-label="법령구분"
        className="pt-krds-7"
      />

      {/* 총건수 + 표시개수 */}
      <ListSectionHeader
        className="px-4 pt-4"
        total={total}
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 법령 카드 리스트 — 카드 전체 클릭=외부 링크, 별 클릭=즐겨찾기 토글(stretched-link). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-4">
        {visible.length > 0 ? (
          visible.map((it) => (
            <div
              key={it.id}
              className="relative flex w-full flex-col gap-krds-5 rounded-[12px] border border-krds-border-divider bg-background p-krds-8 shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]"
            >
              {/* 전면 nav 버튼 — 카드 전체 클릭(외부 링크) */}
              <button
                type="button"
                onClick={() => handleOpen(it)}
                aria-label={`${it.sttNm} 법령 열기`}
                className="absolute inset-0 z-0 rounded-[12px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
              />
              <div className="pointer-events-none relative z-10 flex flex-col gap-krds-5">
                <div className="flex items-start gap-krds-8">
                  <div className="flex min-w-px flex-1 flex-col gap-krds-2">
                    <div className="flex flex-wrap items-center gap-krds-5">
                      <Badge type="pastel" color="blue">
                        {it.sttType}
                      </Badge>
                      <Badge type="pastel" color="green">
                        {it.sttAbbrNm}
                      </Badge>
                    </div>
                    <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                      {it.sttNm}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleStar(it)}
                    aria-pressed={it.sttItrst}
                    aria-label={it.sttItrst ? '즐겨찾기 해제' : '즐겨찾기 등록'}
                    className="pointer-events-auto -m-1 shrink-0 rounded-full p-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
                  >
                    <Icon
                      name="KidStar"
                      size={24}
                      fill={it.sttItrst ? 1 : 0}
                      aria-hidden
                      className={it.sttItrst ? 'text-krds-text-primary' : 'text-krds-text-disabled-soft'}
                    />
                  </button>
                </div>
                <div className="flex items-start gap-krds-5">
                  <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted">
                    시행일자
                  </span>
                  <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-muted">
                    {it.sttEnfcYmd}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="py-krds-9 text-center text-krds-body-md text-krds-text-muted">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {/* 더보기 (loaded/total) */}
      {loaded < total && (
        <div className="px-4 pb-6">
          <Button variant="secondary" className="w-full" onClick={() => setPage((p) => p + 1)}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
SttInfoListPage.displayName = 'SttInfoListPage'
