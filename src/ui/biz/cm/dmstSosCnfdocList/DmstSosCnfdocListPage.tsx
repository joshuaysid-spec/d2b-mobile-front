// 국내 조달원 확인서 신청 목록 (MUI-CM-01-M19, Figma 10020:82626 / empty 10020:82677).
// 설계서 00.공통 v0.84 slide131·132(문서 P130·131). 웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 국내조달원확인서신청목록.
// 구성(위→아래): 검색영역(신청기간*·신청인·[초기화][조회]) → 목록헤더(총건수·표시개수)
//   → 카드 리스트(발급 배지 + 접수번호 + 신청인/신청사유/신청일자/연락처) → 더보기 → 하단 [신청하기](→ P20 시트).
// 데이터/페이징/검색은 페이지가 소유. 목록은 목업(dl_resultList), 더보기·표시개수·검색은 API 경계 스텁
//   (핸들러 실행 + console.log). 신청 팝업(P20, DmstSosCnfdocAply)은 BottomSheet 컨테이너를 페이지가 소유.
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { DateRangeInput, type DateRange } from '@/ui/common/composites/DateRangeInput'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Toast } from '@/ui/common/composites/Toast'
import { DmstSosCnfdocAply } from '@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocAply'
import {
  dmstSosCnfdocAplySchema,
  type DmstSosCnfdocAplyForm,
} from '@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocAply.schema'
import type { DmstSosCnfdocItem } from '@/types/cm'

const DATE_FORMAT = 'YYYY-MM-DD'

// 로그인 사용자(신청인) 자동완성 값 — P20 신청 팝업 read-only 표시(설계서 slide133 '신청인 정보 자동완성').
//   추후 authStore(로그인 업체 담당자)에서 주입. 현재는 목업.
const APPLICANT = {
  aplcntNm: '홍길동',
  aplcntTelno: '010-1234-5678',
}

// 조달원확인서 신청 목록 데이터(dl_resultList, 설계서 slide134 항목명 영문) — 목업, 추후 API(cmService.getDmstSosCnfdocList).
//   상태(aplyRcptStts)는 '발급'으로 고정(신청 시 바로 발급, 설계서 slide134 비고). 신청사유(aplyRsn)=입찰참가용/확인용.
const dl_resultList: DmstSosCnfdocItem[] = [
  {
    id: '1',
    aplyRcptNo: '2026051812',
    aplcntNm: '홍길동',
    aplyRsn: '입찰참가용',
    edpPrcsYmd: '2026-05-18',
    aplcntTelno: '010-1234-5678',
    aplyRcptStts: '발급',
  },
  {
    id: '2',
    aplyRcptNo: '2026051745',
    aplcntNm: '고길동',
    aplyRsn: '확인용',
    edpPrcsYmd: '2026-05-17',
    aplcntTelno: '010-2345-6789',
    aplyRcptStts: '발급',
  },
  {
    id: '3',
    aplyRcptNo: '2026051602',
    aplcntNm: '홍길동',
    aplyRsn: '입찰참가용',
    edpPrcsYmd: '2026-05-16',
    aplcntTelno: '010-1234-5678',
    aplyRcptStts: '발급',
  },
  {
    id: '4',
    aplyRcptNo: '2026051533',
    aplcntNm: '김방산',
    aplyRsn: '확인용',
    edpPrcsYmd: '2026-05-15',
    aplcntTelno: '010-3456-7890',
    aplyRcptStts: '발급',
  },
  {
    id: '5',
    aplyRcptNo: '2026051421',
    aplcntNm: '홍길동',
    aplyRsn: '입찰참가용',
    edpPrcsYmd: '2026-05-14',
    aplcntTelno: '010-1234-5678',
    aplyRcptStts: '발급',
  },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 filteredList/visibleList 로직을 서버 조회로 교체.
//   보유한 5건을 TOTAL 건으로 부풀려 더보기(page*pageSize slice)를 시연한다(설계서 slide132 '더보기 (10/258)').
const TOTAL = 258
const MOCK_LIST: DmstSosCnfdocItem[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_resultList[i % dl_resultList.length]
  return { ...base, id: String(i + 1), aplyRcptNo: `${base.aplyRcptNo}${String(i + 1).padStart(2, '0')}`.slice(0, 12) }
})

const RECENT_1M = (): DateRange => ({
  start: dayjs().subtract(1, 'month').format(DATE_FORMAT),
  end: dayjs().format(DATE_FORMAT),
})

export function DmstSosCnfdocListPage() {
  // 검색조건(dm_searchInfo) — 신청기간(edpPrcsYmdFrom/To)·신청인(aplcntNm). 입력 중 상태.
  const [period, setPeriod] = useState<DateRange>(RECENT_1M)
  const [aplcntNm, setAplcntNm] = useState('')
  // 검색 '적용' — [조회](또는 초기화) 시에만 확정. 입력 중에는 목록이 걸러지지 않는다.
  const [appliedNm, setAppliedNm] = useState('')
  // 정렬(목록 헤더 우측, Figma "최신순 ▼") — 신청날짜 기준 최신순/과거순. pageSize(10)는 더보기 슬라이스용 고정.
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest')
  const pageSize = 10
  const [page, setPage] = useState(1)

  // P20 신청 팝업(BottomSheet) — 컨테이너/폼은 페이지가 소유(설계서 slide133).
  const [aplyOpen, setAplyOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<DmstSosCnfdocAplyForm>({
    resolver: zodResolver(dmstSosCnfdocAplySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { aplyRsn: '' },
  })

  // ── API 경계 스텁 (백엔드 연동 시 services/cm·queries/cm 로 대체). console 로 동작 확인 ──
  const handleSearch = () => {
    setAppliedNm(aplcntNm.trim())
    setPage(1)
    console.log('[DmstSosCnfdoc] 조회', { period, aplcntNm })
    // cmService.getDmstSosCnfdocList({ edpPrcsYmdFrom: period.start, edpPrcsYmdTo: period.end, aplcntNm })
  }
  const handleReset = () => {
    setPeriod(RECENT_1M())
    setAplcntNm('')
    setAppliedNm('')
    setPage(1)
    console.log('[DmstSosCnfdoc] 초기화')
  }
  const handleSort = (value: string) => {
    setSort(value as 'latest' | 'oldest')
    setPage(1)
    console.log('[DmstSosCnfdoc] 정렬 →', value)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[DmstSosCnfdoc] loadMore → page', next)
  }
  // 카드 클릭 → OZ 리포트 조달원 확인서 연결 > 서류 확인 팝업(MUI-BD-01-P14) 호출(설계서 slide132). 현재 스텁.
  const handleCardClick = (item: DmstSosCnfdocItem) => {
    console.log('[DmstSosCnfdoc] 조달원 확인서 출력(OZ리포트/서류확인 P14)', item.aplyRcptNo)
    // 추후: OZ 리포트 실행 + 서류확인 팝업(MUI-BD-01-P14)
  }
  // 하단 [신청하기] → P20 신청 팝업 오픈(폼 초기화 후).
  const openAply = () => {
    resetForm({ aplyRsn: '' })
    setAplyOpen(true)
  }
  // P20 [신청하기] 제출 성공 → 팝업 닫기 > 완료 토스트 > 목록 리프래시(발급 가능 상태)(설계서 slide133).
  const onAplySubmit = (values: DmstSosCnfdocAplyForm) => {
    setAplyOpen(false)
    setToastOpen(true)
    console.log('[DmstSosCnfdoc] 신청', { ...APPLICANT, aplyRsn: values.aplyRsn })
    // cmService.applyDmstSosCnfdoc({ aplcntNm, aplcntTelno, aplyRsn }) → 성공 시 목록 재조회
  }
  // 제출 실패(신청사유 미입력) — 시트 스크롤 컨테이너에서 첫 에러 필드로 스크롤.
  const onAplyInvalid = () => {
    document.getElementById('field-aplyRsn')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // ── ⚠️ 임시 목업 검색/페이징 (API 연동 시 이 블록 통째로 삭제 후 재작성) ⚠️ ──────────
  //   신청인(aplcntNm) 부분일치로 거른다(대소문자 무시). 검색 실행 전이거나 검색어가 비면 전체.
  //   신청기간(edpPrcsYmd)은 목업 단계에선 필터하지 않는다(API 연동 시 FROM~TO 범위 조회).
  //   정렬(sort): 신청날짜(edpPrcsYmd) 기준 최신순(desc)/과거순(asc).
  const filteredList = useMemo(() => {
    const base = appliedNm ? MOCK_LIST.filter((it) => it.aplcntNm.includes(appliedNm)) : MOCK_LIST
    return [...base].sort((a, b) =>
      sort === 'latest'
        ? b.edpPrcsYmd.localeCompare(a.edpPrcsYmd)
        : a.edpPrcsYmd.localeCompare(b.edpPrcsYmd),
    )
  }, [appliedNm, sort])

  const total = filteredList.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filteredList.slice(0, loaded)

  // 목업 → Card props 매핑. 접수번호(제목)는 번호만 primary 색(Figma), 상태(aplyRcptStts=발급)는 배지.
  const cardItems: CardListItem[] = visibleList.map((it) => ({
    id: it.id,
    badges: <Badge>{it.aplyRcptStts}</Badge>,
    title: (
      <>
        접수번호 <span className="text-krds-text-primary-active">{it.aplyRcptNo}</span>
      </>
    ),
    rows: [
      { label: '신청인', value: it.aplcntNm },
      { label: '신청사유', value: it.aplyRsn },
      { label: '신청일자', value: it.edpPrcsYmd },
      { label: '연락처', value: it.aplcntTelno },
    ],
    onClick: () => handleCardClick(it),
  }))

  // 검색 결과 없음 — 검색한 신청인 기준 안내(Figma empty 10020:82677 '"가나다"에 대한 / 검색 결과가 없습니다.').
  const emptyText = appliedNm ? (
    <>
      &ldquo;{appliedNm}&rdquo;에 대한
      <br />
      검색 결과가 없습니다.
    </>
  ) : (
    '신청 내역이 없습니다.'
  )

  return (
    <div className="flex w-full flex-col">
      {/* 검색영역 — 신청기간*(기간 트리거) + 신청인 + [초기화][조회] */}
      <div className="flex flex-col gap-4 px-4 py-4">
        {/* 신청기간 — 프리셋 칩 없이 트리거 박스만(Figma 1:1). 기간은 시트 캘린더에서 선택.
            시트(P17 기간선택, Figma 82689/82694): 타이틀 '기간 선택'(기본) + 확정 버튼 '저장'. */}
        <DateRangeInput
          label="신청기간"
          required
          showPresets={false}
          value={period}
          onChange={setPeriod}
          confirmLabel="저장"
        />

        {/* 신청인 */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="srch-aplcntNm">신청인</InputLabel>
          <InputBox
            id="srch-aplcntNm"
            placeholder="내용을 입력하세요."
            value={aplcntNm}
            maxLength={100}
            onChange={(e) => setAplcntNm(e.target.value)}
            onClear={() => setAplcntNm('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
        </div>

        {/* [초기화](secondary) [조회](primary) — asymmetric(초기화 100px 고정 + 조회 flex) */}
        <ButtonGroup
          items={[
            {
              label: (
                <>
                  <Icon name="Autorenew" size={20} aria-hidden />
                  초기화
                </>
              ),
              variant: 'secondary',
              onClick: handleReset,
            },
            {
              label: (
                <>
                  <Icon name="Search" size={20} aria-hidden />
                  조회
                </>
              ),
              variant: 'primary',
              onClick: handleSearch,
            },
          ]}
        />
      </div>

      {/* 목록 헤더 — 총건수 + 정렬 셀렉트(Figma 10020:82626 "최신순 ▼"). 신청날짜 기준 최신순/과거순. */}
      <ListSectionHeader
        variant="background"
        total={total}
        sortValue={sort}
        sortOptions={[
          { value: 'latest', label: '최신순' },
          { value: 'oldest', label: '과거순' },
        ]}
        onSortChange={handleSort}
      />

      {/* 카드 목록 (px-4 인셋). 빈 목록은 CardList emptyText(검색어 기준 안내). */}
      <div className="flex flex-col gap-krds-7 px-4 pb-4 pt-krds-7">
        <CardList items={cardItems} emptyText={emptyText} />
      </div>

      {/* 더보기 (loaded/total — 스텁). 모두 노출됐으면 숨김. */}
      {loaded < total && (
        <div className="px-4 pb-4">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total})
          </Button>
        </div>
      )}

      {/* 하단 액션 바 — [신청하기](→ P20 신청 팝업). sticky 로 하단 고정(BottomNav 없음).
          safe-area: pb 는 max(12px, env(safe-area-inset-bottom)) — Tailwind 가 env() 콤마를 못 다뤄 inline style. */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <Button variant="primary" className="w-full" onClick={openAply}>
          신청하기
        </Button>
      </div>

      {/* P20 신청사유 바텀시트(Figma 10020:82699) — 컨테이너/footer 는 페이지 소유. 콘텐츠는 DmstSosCnfdocAply.
          타이틀 '신청사유' · footer [취소][등록하기]. */}
      <BottomSheet
        open={aplyOpen}
        onOpenChange={setAplyOpen}
        title="신청사유"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setAplyOpen(false) },
              { label: '등록하기', variant: 'primary', onClick: handleSubmit(onAplySubmit, onAplyInvalid) },
            ]}
          />
        }
      >
        <DmstSosCnfdocAply
          control={control}
          aplcntNm={APPLICANT.aplcntNm}
          aplcntTelno={APPLICANT.aplcntTelno}
        />
      </BottomSheet>

      {/* 신청 완료 토스트(설계서 slide133 '신청 되었습니다.') */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        신청 되었습니다.
      </Toast>
    </div>
  )
}
DmstSosCnfdocListPage.displayName = 'DmstSosCnfdocListPage'
