// MUI-CM-02-M07 업체 소속 사용자 목록 (PrcmBzentyUserMngPage). 설계서 slide203.
// 경로: 마이페이지 > 사용자정보관리 > 업체 소속 사용자 목록. sub헤더 타이틀 '소속 사용자 목록'.
//
// 구성(위→아래): 업무도움(HelpDisclosure 퇴사자 계정 안내) → 검색바(검색기준 셀렉트 '사용자명' + 입력/X초기화)
//   → 목록헤더(ListSectionHeader 총 N명·표시개수) → 사용자 카드 목록(배지[사용자유형·상태] + 정보 + [상태변경])
//   → 더보기 → 맨위로 FAB → 상태변경 바텀시트(P08, 페이지가 컨테이너/footer/open 소유).
//
// - 카드 클릭(버튼 외 영역) → 사용자 정보 상세(MUI-CM-02-M03) navigate(state 로 항목 전달, from:'userList').
// - 카드 [상태변경] → 상태변경 바텀시트(대상 사용자 전달). 저장 시 목록 즉시 반영(console.log 스텁).
// 데이터=파일 내 목업(설계서 slide203 항목/형식), 동작=API 경계 스텁(console.log + '// 추후 API:').
//
// ⚠️ 항목명(userId/userNm/deptNm/telno/mbtlNo/rmrk/userTyNm/userSttsCd/userSttsNm)은 설계서 데이터영역
//    영문 항목명 확인 전 잠정 명명 — 실제 항목명 확정 시 교체(보고서 '남은 불확실점' 참고).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Badge, type BadgeProps } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { InputBox } from '@/ui/common/base/InputBox'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { ListSectionHeader } from '@/ui/common/composites/ListSectionHeader'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { PrcmBzentyUserSttsChg } from '@/ui/biz/cm/prcmBzentyUserMng/PrcmBzentyUserSttsChg'

// 상태 코드(설계서 P08): 사용=Y · 탈퇴=T · 사용중지=N · 미승인=M.
type UserSttsCd = 'Y' | 'T' | 'N' | 'M'
const STTS_NM: Record<UserSttsCd, string> = { Y: '사용', T: '탈퇴', N: '사용중지', M: '미승인' }

// 업체 소속 사용자 1건 — 설계서 slide203 카드 항목(잠정 영문 항목명).
interface BzentyUser {
  id: string // 고유 key (설계서 사용자 식별자 자리)
  userId: string // 아이디 (예: test1)
  userNm: string // 사용자명 (홍길동)
  deptNm: string // 부서명 (총무부)
  telno: string // 전화번호 (02-1234-5678)
  mbtlNo: string // 휴대전화 (010-1234-5678)
  rmrk: string // 비고 (-)
  userTyNm: string // 사용자유형 (대표자/입찰대리인/일반사용자)
  userSttsCd: UserSttsCd // 상태 코드
  userSttsNm: string // 상태명 (사용/탈퇴/사용중지/미승인)
}

// 사용자유형 배지 색 — 대표자=blue / 입찰대리인=green / 일반사용자=yellow.
function userTyColor(ty: string): BadgeProps['color'] {
  if (ty === '입찰대리인') return 'green'
  if (ty === '일반사용자') return 'yellow'
  return 'blue'
}
// 상태 배지 색 — 사용=green / 사용중지=yellow / 탈퇴=red / 미승인=blue.
function sttsColor(nm: string): BadgeProps['color'] {
  if (nm === '사용') return 'green'
  if (nm === '사용중지') return 'yellow'
  if (nm === '탈퇴') return 'red'
  return 'blue'
}

// 검색기준(셀렉트) — 기본값 '사용자명'(설계서 slide203).
const SEARCH_CRITERIA = [
  { value: 'userNm', label: '사용자명' },
  { value: 'userId', label: '아이디' },
  { value: 'deptNm', label: '부서명' },
]

// ── 목업(설계서 slide203 예시 2건: test1 홍길동 대표자 사용 / test2 홍길동 입찰대리인 사용) ──
const dl_prcmBzentyUserList: BzentyUser[] = [
  { id: '1', userId: 'test1', userNm: '홍길동', deptNm: '총무부', telno: '02-1234-5678', mbtlNo: '010-1234-5678', rmrk: '-', userTyNm: '대표자', userSttsCd: 'Y', userSttsNm: '사용' },
  { id: '2', userId: 'test2', userNm: '홍길동', deptNm: '총무부', telno: '02-1234-5678', mbtlNo: '010-1234-5678', rmrk: '-', userTyNm: '입찰대리인', userSttsCd: 'Y', userSttsNm: '사용' },
]

// ⚠️ 임시 목업 — API 연동 시 이 상수와 아래 페이징/필터를 통째로 교체(userService.getBzentyUserList).
//   설계서 slide203 '총 2,010 명' 시연 위해 2건을 2,010건으로 부풀린다.
const TOTAL = 2010
const MOCK_USERS: BzentyUser[] = Array.from({ length: TOTAL }, (_, i) => {
  const base = dl_prcmBzentyUserList[i % dl_prcmBzentyUserList.length]
  return { ...base, id: String(i + 1), userId: `test${i + 1}` }
})

// 업무도움(HelpDisclosure) — 퇴사자 계정 즉시 삭제 안내(설계서 slide203).
const HELP_ITEMS = [
  '퇴사자 계정 즉시 삭제 요망 — 퇴사자의 계정을 방치할 경우, 타사 이직 후 기존 ID를 통한 입찰/계약 정보 무단 열람 및 영업비밀 유출 사고가 발생할 수 있습니다.',
]

export function PrcmBzentyUserMngPage() {
  const navigate = useNavigate()
  const [criteria, setCriteria] = useState('userNm') // 검색기준(기본 사용자명)
  const [keyword, setKeyword] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const [users, setUsers] = useState<BzentyUser[]>(MOCK_USERS)

  // 상태변경 바텀시트(P08) — 대상 사용자(open) + 선택 코드. 컨테이너/footer 는 페이지가 소유.
  const [sttsTarget, setSttsTarget] = useState<BzentyUser | null>(null)
  const [sttsValue, setSttsValue] = useState('')

  // ── 검색(목업 부분일치 필터, 검색기준별) — API 연동 시 교체 ──
  const filtered = useMemo(() => {
    const kw = keyword.trim()
    if (!kw) return users
    return users.filter((u) => {
      const field = criteria === 'userId' ? u.userId : criteria === 'deptNm' ? u.deptNm : u.userNm
      return field.includes(kw)
    })
  }, [users, keyword, criteria])

  const total = filtered.length
  const loaded = Math.min(page * pageSize, total)
  const visibleList = filtered.slice(0, loaded)

  // ── 동작 스텁 ──
  const handleClearKeyword = () => {
    setKeyword('') // 내용 지우면 즉시 목록 초기화(설계서 slide203)
    setPage(1)
  }
  const handleKeyword = (v: string) => {
    setKeyword(v)
    setPage(1)
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    console.log('[PrcmBzentyUserMng] pageSize →', size)
  }
  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    console.log('[PrcmBzentyUserMng] loadMore → page', next)
  }
  // 카드 클릭 → 사용자 정보 상세(MUI-CM-02-M03). 클릭 항목을 state 로 전달(상단 즉시표시).
    // 사용자 정보 상세(M03) — 목록 진입이라 state.from='userList'(상세가 수신설정/버튼 숨김 분기에 사용).
  const handleOpenDetail = (user: BzentyUser) => {
    navigate(ROUTES.INDV_INFO_DTL, { state: { ...user, from: 'userList' } })
    console.log('[PrcmBzentyUserMng] 사용자 상세 이동', user.userId) // 추후 API/라우트: 메인 배선
  }
  // 상태변경 시트 오픈 — 대상 사용자 전달. 현재가 미승인(M)이면 선택 없음으로 시작(M 은 선택지 제외).
  const openSttsChg = (user: BzentyUser) => {
    setSttsTarget(user)
    setSttsValue(user.userSttsCd === 'M' ? '' : user.userSttsCd)
  }
  const closeSttsChg = () => setSttsTarget(null)
  const handleSaveStts = () => {
    if (!sttsTarget || !sttsValue) return
    const code = sttsValue as UserSttsCd
    setUsers((prev) =>
      prev.map((u) =>
        u.id === sttsTarget.id ? { ...u, userSttsCd: code, userSttsNm: STTS_NM[code] } : u,
      ),
    )
    console.log('[PrcmBzentyUserMng] 상태변경 저장', sttsTarget.userId, '→', code) // 추후 API: userService.changeStatus(userId, code)
    closeSttsChg()
  }

  return (
    <div className="flex w-full flex-col">
      {/* 업무도움 — 퇴사자 계정 즉시 삭제 안내(기본 펼침). */}
      <HelpDisclosure title="소속 사용자 관리 안내" items={HELP_ITEMS} defaultOpen />

      {/* 검색바 — 검색기준 셀렉트(기본 사용자명) + 입력(placeholder, X 초기화 → 즉시 목록 초기화). */}
      <div className="flex items-center gap-krds-5 px-4 pt-4">
        <div className="w-[120px] shrink-0">
          <SelectBox items={SEARCH_CRITERIA} value={criteria} onValueChange={setCriteria} />
        </div>
        <InputBox
          className="min-w-px flex-1"
          value={keyword}
          placeholder="검색할 내용을 입력하세요."
          onChange={(e) => handleKeyword(e.target.value)}
          onClear={handleClearKeyword}
        />
      </div>

      {/* 목록 헤더 — 총 N명 + 표시개수. */}
      <ListSectionHeader
        className="mt-4"
        variant="background"
        total={total}
        unit="명"
        pageSize={pageSize}
        onPageSizeChange={handlePageSize}
      />

      {/* 사용자 카드 목록 (px-4 인셋, 카드 간 16=krds-8). */}
      <div className="flex flex-col gap-krds-8 px-4 pb-4 pt-krds-7">
        {visibleList.length === 0 ? (
          <p className="py-10 text-center text-krds-body-md text-krds-text-subtle">
            소속 사용자가 없습니다.
          </p>
        ) : (
          visibleList.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onOpen={() => handleOpenDetail(user)}
              onSttsChg={() => openSttsChg(user)}
            />
          ))
        )}
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
        className="fixed bottom-20 right-4 z-40"
        onTop={() => document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 상태변경 바텀시트(P08) — 컨테이너/footer/open 은 페이지 소유, 콘텐츠만 PrcmBzentyUserSttsChg. */}
      <BottomSheet
        open={sttsTarget !== null}
        onOpenChange={(open) => !open && closeSttsChg()}
        title="사용자 상태 변경"
        footer={
          <ButtonGroup
            layout="split"
            items={[
              { label: '닫기', variant: 'secondary', onClick: closeSttsChg },
              { label: '저장', variant: 'primary', onClick: handleSaveStts },
            ]}
          />
        }
      >
        {sttsTarget && (
          <PrcmBzentyUserSttsChg
            userNm={sttsTarget.userNm}
            currentSttsNm={sttsTarget.userSttsNm}
            value={sttsValue}
            onValueChange={setSttsValue}
          />
        )}
      </BottomSheet>
    </div>
  )
}
PrcmBzentyUserMngPage.displayName = 'PrcmBzentyUserMngPage'

// ── 사용자 카드(도메인 전용 조립물, 페이지 내부) ─────────────────────────────
// 카드 전체 클릭=상세 이동 + 카드 내 [상태변경] 버튼 두 액션 → 중첩 <button> 회피 위해
// stretched-link 패턴: 전면 nav <button>(z-0) + 콘텐츠(pointer-events-none) + 상태변경 <button>(pointer-events-auto).
function UserCard({
  user,
  onOpen,
  onSttsChg,
}: {
  user: BzentyUser
  onOpen: () => void
  onSttsChg: () => void
}) {
  const rows = [
    { label: '부서명', value: user.deptNm },
    { label: '전화번호', value: user.telno },
    { label: '휴대전화', value: user.mbtlNo },
    { label: '비고', value: user.rmrk || '-' },
  ]
  return (
    <div className="relative flex w-full flex-col gap-krds-5 rounded-[12px] border border-krds-border-divider bg-background p-krds-8 shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]">
      {/* 전면 nav 버튼 — 카드 전체 클릭(상세 이동). 콘텐츠(pointer-events-none) 뒤(z-0)에서 클릭을 받는다. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${user.userNm}(${user.userId}) 상세보기`}
        className="absolute inset-0 z-0 rounded-[12px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
      />

      {/* 콘텐츠 — pointer-events-none 로 클릭을 뒤의 nav 버튼으로 통과, 상태변경만 pointer-events-auto. */}
      <div className="pointer-events-none relative z-10 flex flex-col gap-krds-5">
        {/* 배지 — 사용자유형 + 상태 */}
        <div className="flex flex-wrap items-center gap-krds-5">
          <Badge type="pastel" color={userTyColor(user.userTyNm)}>
            {user.userTyNm}
          </Badge>
          <Badge type="pastel" color={sttsColor(user.userSttsNm)}>
            {user.userSttsNm}
          </Badge>
        </div>

        {/* 사용자명(Bold ink) + 아이디(Medium muted) */}
        <div className="flex flex-col gap-krds-2">
          <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
            {user.userNm}
          </span>
          <span className="text-[17px] font-medium leading-normal text-krds-text-muted">
            {user.userId}
          </span>
        </div>

        {/* 정보 행 — 부서명/전화번호/휴대전화/비고 */}
        <div className="flex flex-col gap-krds-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-krds-5">
              <span className="w-[72px] shrink-0 text-[17px] leading-normal text-krds-text-muted">
                {row.label}
              </span>
              <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* [상태변경] — 카드 클릭(상세)과 분리(pointer-events-auto). */}
        <div className="pointer-events-auto pt-krds-2">
          <Button variant="secondary" className="w-full" onClick={onSttsChg}>
            상태변경
          </Button>
        </div>
      </div>
    </div>
  )
}
UserCard.displayName = 'UserCard'
