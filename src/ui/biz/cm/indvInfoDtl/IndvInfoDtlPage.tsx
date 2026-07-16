// 개인정보 상세 — MUI-CM-02-M03. 마이페이지 > 사용자정보관리 > 개인정보 상세. (공통설계서 v0.84 slide194)
// 조회 전용(수정 불가). 기본정보 표시 + 수신설정(조회만) + 도움말 + 개인정보 수정하기 버튼.
// 분기: 사용자 관리 목록(M07)에서 진입(navigate state { from: 'userList' }) → 헤더 타이틀 '사용자 상세정보',
//       수신설정·도움말·개인정보 수정하기 버튼 모두 미표시. 기본(마이페이지 진입)은 전체 표시.
// 헤더(뒤로/타이틀)는 전역 Header(AppLayout, router handle) 담당 → 본문은 콘텐츠만 렌더. 데이터는 목업(백엔드 미연동).
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Switch } from '@/ui/common/base/Switch'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { Table } from '@/ui/common/composites/Table'

// ── 기본정보(설계서 slide194 예시값 — 추후 회원정보 API) ──────────────────────
const BASIC_INFO: { label: string; value: string }[] = [
  { label: '아이디', value: 'Test1' },
  { label: '사용자명', value: '홍길동' },
  { label: '사용자 유형', value: '일반사용자' },
  { label: '실명인증여부', value: '실명인증이 필요합니다.' },
  { label: '부서명', value: '총무팀' },
  { label: '이메일 주소', value: 'abcde@dapa.go.kr' },
  { label: '휴대전화번호', value: '010-1234-5678' },
  { label: '전화번호', value: '02-1234-5678' },
  { label: '팩스번호', value: '02-2345-6789' },
  { label: '업체명', value: '조달테스트' },
]

// ── 수신 설정(조회만, 수정 불가 — disabled Switch 로 현재 상태만 표시) ──────────
// 실제 설정 변경은 알림서비스신청(M09) 화면에서(아래 도움말 안내).
const RECV_SETTINGS: { id: string; label: string; on: boolean }[] = [
  { id: 'mbtlnum', label: '휴대전화 수신', on: true },
  { id: 'email', label: '이메일 수신', on: true },
]

export function IndvInfoDtlPage() {
  const navigate = useNavigate()
  // 진입 출처 판별 — 사용자 관리 목록(M07)에서 진입 시 { from: 'userList' } state 전달.
  const fromUserList = (useLocation().state as { from?: string } | null)?.from === 'userList'

  const goEdit = () => {
    // 개인정보수정(M04) 이동.
    navigate(ROUTES.INDV_INFO_MDFCN) // 추후 API 불필요(라우팅). 인증 게이트는 대상 화면이 소유.
  }

  return (
    <div className="flex w-full flex-col pb-6">
      {/* 기본정보 */}
      <SectionTitle>기본정보</SectionTitle>
      <div className="px-4">
        <Table rows={BASIC_INFO} />
      </div>

      {/* 수신 설정 — 마이페이지 진입 시에만 표시(목록 진입 시 숨김) */}
      {!fromUserList && (
        <>
          <SectionTitle className="mt-2">수신 설정</SectionTitle>
          <div className="flex flex-col gap-1 px-4">
            {RECV_SETTINGS.map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-krds-5 py-krds-5">
                <span className="min-w-px flex-1 text-[17px] font-medium leading-normal text-krds-text-ink">
                  {row.label}
                </span>
                {/* 조회 전용 — disabled 로 수정 불가 표시(설정 변경은 알림서비스신청 화면) */}
                <Switch checked={row.on} disabled aria-label={row.label} className="shrink-0" />
              </div>
            ))}
          </div>

          {/* 도움말 — 수신 설정 변경 안내 */}
          <div className="mt-2">
            <HelpDisclosure
              items={[
                'SMS 수신서비스 설정은 홈 > 마이페이지 > 알림서비스신청 화면에서 가능합니다.',
              ]}
            />
          </div>

          {/* 개인정보 수정하기 → 개인정보수정(M04) */}
          <div className="mt-6 px-4">
            <Button variant="primary" size="lg" className="w-full" onClick={goEdit}>
              개인정보 수정하기
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
IndvInfoDtlPage.displayName = 'IndvInfoDtlPage'
