// 조달업체 선택 — MUI-CM-04-P23 `ovsSosCnfdocChc`. 설계서 00.공통 v0.84 slide342~343.
// 국외조달원등록증신청(M22)의 [업체선택] 버튼이 여는 바텀시트의 "콘텐츠"만 담당한다.
//
// ★ 컨테이너(BottomSheet)·타이틀은 부모(M22 페이지)가 소유한다(`*Sheet` 래퍼 금지 규칙).
//   이 파일은 시트 본문(검색조건 + 결과 목록)만 렌더하고, row 클릭 시 onSelect 로 선택 업체를 방출한다.
//   선택하면 부모가 필드에 반영 + 시트를 닫는다.
//
// 설계서 동작(slide342): 오픈 시 검색 입력 포커스 → 업체명/업체코드 Like 검색 → 결과 클릭 → 상위 반영·시트 닫힘.
// 검색조건(slide343 dm_searchInfo): 업체코드 bzentyCd(5) · 업체명 bzentyNm(100).
// 결과(dl_resultList): 업체코드 bzentyCd · 업체명 bzentyNm · 대표자명 rprsvNm · 대표전화 rprsvTelno.
// Figma 전용 프레임 없음 → 내부 컨벤션(SegmentedControl + InputBox + Button + ListSectionHeader) 조립.
import { useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SegmentedControl } from '@/ui/common/base/SegmentedControl'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import type { OvsSosBzentyChcItem } from '@/types/mock/cm'

// 검색 대상(slide342 두 상태) — 업체명 / 업체코드
type SearchTarget = 'bzentyNm' | 'bzentyCd'

// ── 목업 (dl_resultList — 항목명/형식 설계서 그대로. API 연동 시 조회로 교체) ──
// slide342 예시(업체명 NN / 대표자명 / 02-1234-5678 / 업체코드 0NN)를 실제 응답처럼 구성.
const MOCK_BZENTY_LIST: OvsSosBzentyChcItem[] = [
  { bzentyCd: '099', bzentyNm: '업체명 99', rprsvNm: '홍길동', rprsvTelno: '02-1234-5678' },
  { bzentyCd: '098', bzentyNm: '업체명 98', rprsvNm: '김길순', rprsvTelno: '02-1234-5679' },
  { bzentyCd: '097', bzentyNm: '업체명 97', rprsvNm: '박길동', rprsvTelno: '02-1234-5680' },
  { bzentyCd: '096', bzentyNm: '대한조달', rprsvNm: '이순신', rprsvTelno: '031-222-3456' },
  { bzentyCd: '095', bzentyNm: '한빛물산', rprsvNm: '강감찬', rprsvTelno: '051-333-4567' },
  { bzentyCd: '094', bzentyNm: '조달테스트 업체', rprsvNm: '유관순', rprsvTelno: '02-9876-5432' },
  { bzentyCd: '093', bzentyNm: '가온방산', rprsvNm: '신사임당', rprsvTelno: '042-555-6789' },
  { bzentyCd: '092', bzentyNm: '누리테크', rprsvNm: '정약용', rprsvTelno: '062-777-8901' },
]

export interface OvsSosCnfdocChcProps {
  /** 결과 row 선택 시 호출 — 부모가 필드 반영 + 시트 닫음. */
  onSelect: (item: OvsSosBzentyChcItem) => void
}

/**
 * 조달업체 선택(P23) 바텀시트 콘텐츠 — 검색 대상(업체명/업체코드) 전환 + 입력 + 결과 목록.
 * row 클릭 → onSelect(선택 업체). 컨테이너/타이틀/닫힘은 부모(M22)가 소유.
 */
export function OvsSosCnfdocChc({ onSelect }: OvsSosCnfdocChcProps) {
  const [target, setTarget] = useState<SearchTarget>('bzentyNm')
  const [keyword, setKeyword] = useState('') // 입력 중
  const [applied, setApplied] = useState('') // 검색 실행 시 확정
  const [pageSize, setPageSize] = useState(10)

  // Like 검색 — 검색 실행(applied) 기준. 미검색 시 전체 노출.
  const results = useMemo(() => {
    const q = applied.trim()
    if (!q) return MOCK_BZENTY_LIST
    return MOCK_BZENTY_LIST.filter((it) => it[target].includes(q))
  }, [applied, target])

  const visible = results.slice(0, pageSize)

  const handleSearch = () => {
    setApplied(keyword)
    // 추후 API: scwin.btn_bzentySrch — 검색조건(bzentyCd/bzentyNm)으로 조달업체 검색
  }

  // 대상 전환 시 입력/결과 초기화(대상별 형식·키패드가 달라 혼선 방지)
  const handleTargetChange = (v: string) => {
    setTarget(v as SearchTarget)
    setKeyword('')
    setApplied('')
  }

  const isCd = target === 'bzentyCd'

  return (
    <div className="flex flex-col gap-krds-7 pb-krds-5">
      {/* 검색 대상 전환 (slide342 — 업체명 / 업체코드) */}
      <SegmentedControl
        items={[
          { value: 'bzentyNm', label: '업체명' },
          { value: 'bzentyCd', label: '업체코드' },
        ]}
        value={target}
        onValueChange={handleTargetChange}
        itemClassName="flex-1"
        aria-label="검색 대상"
      />

      {/* 검색 입력 + 버튼 */}
      <div className="flex items-center gap-krds-5">
        <InputBox
          className="flex-1"
          // 업체코드는 숫자 5자, 업체명은 자유 입력
          inputType={isCd ? 'numeric' : 'text'}
          maxLength={isCd ? 5 : 100}
          value={keyword}
          placeholder={isCd ? '업체코드를 입력해주세요.' : '업체명을 입력해주세요.'}
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
          }}
          aria-label={isCd ? '업체코드' : '업체명'}
        />
        <Button variant="primary" size="icon" onClick={handleSearch} aria-label="검색">
          <Icon name="Search" size={20} aria-hidden />
        </Button>
      </div>

      {/* 총건수 · 표시개수 */}
      <ListSectionHeader
        variant="background"
        total={results.length}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      {/* 결과 목록 — key = 업체코드(안정 고유값). row 클릭 → onSelect */}
      {visible.length > 0 ? (
        <ul className="flex flex-col gap-krds-5">
          {visible.map((it) => (
            <li key={it.bzentyCd}>
              <button
                type="button"
                onClick={() => onSelect(it)}
                className="flex w-full flex-col gap-krds-3 rounded-krds-8 border border-krds-border-divider bg-background p-krds-8 text-left transition-colors active:bg-krds-bg-primary-subtle focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
              >
                <span className="flex items-center justify-between gap-krds-5">
                  <span className="min-w-0 flex-1 truncate text-krds-body-lg font-bold text-krds-text-ink">
                    {it.bzentyNm}
                  </span>
                  <span className="shrink-0 text-krds-body-sm text-krds-text-muted">
                    {it.bzentyCd}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-x-krds-5 gap-y-krds-2 text-krds-body-md text-krds-text-muted">
                  <span>{it.rprsvNm}</span>
                  <span aria-hidden>·</span>
                  <span>{it.rprsvTelno}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-krds-9 text-center text-krds-body-md text-krds-text-muted">
          검색 결과가 없습니다.
        </p>
      )}
    </div>
  )
}
OvsSosCnfdocChc.displayName = 'OvsSosCnfdocChc'
