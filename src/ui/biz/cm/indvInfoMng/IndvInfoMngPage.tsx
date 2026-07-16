// 사용자정보관리 — MUI-CM-02-M01 (IndvInfoMngPage). 설계서 00.공통 v0.84 slide65/76/238.
// 마이페이지 > 사용자 정보관리(허브). 상단 사용자 요약 + 하위 화면 진입 버튼 목록.
//   웹경로: 메인 홈 > 마이페이지 > 사용자 정보관리. 셸 안 + sub헤더. 3뎁스라 BottomNav 숨김.
//   데이터=목업(설계서 slide194 예시), 동작=navigate.
// ⚠️ 하위 메뉴 구성은 CM-02 클러스터(M03/M05/M06/M07/M09/P10) 기준으로 구성(설계서에 M01 메뉴 표가
//   명시되지 않아 클러스터 화면으로 도출). 2026-07-13 개정: 회원탈퇴가 사용자정보 화면으로 이동됨.
import { useNavigate } from 'react-router-dom'

import { Icon } from '@/ui/common/base/Icon'
import { ROUTES } from '@/constants/routes'

// ⚠️ 현재 로그인 사용자 요약(설계서 slide194 예시) — 추후: 회원정보 API 로 교체.
const MOCK_USER = {
  userNm: '홍길동',
  userId: 'Test1',
  deptNm: '총무팀',
  bzentyNm: '조달테스트',
}

const SUMMARY: { label: string; value: string }[] = [
  { label: '아이디', value: MOCK_USER.userId },
  { label: '부서명', value: MOCK_USER.deptNm },
  { label: '업체명', value: MOCK_USER.bzentyNm },
]

// 진입 버튼 목록(CM-02 클러스터). 개인정보는 본인 인증(M02) 게이트를 거쳐 상세(M03)로 진입.
const MENU: { label: string; to: string }[] = [
  { label: '개인정보 조회 및 수정', to: ROUTES.INDV_CERT }, // M02 인증 → M03 상세 → M04 수정
  { label: '비밀번호 변경', to: ROUTES.PSWD_CHG }, // M05
  { label: '개인 신원 확인', to: ROUTES.INDV_IDNT_IDNTY }, // M06
  { label: '업체 소속 사용자 목록', to: ROUTES.PRCM_BZENTY_USER_MNG }, // M07
  { label: '알림 서비스 신청 및 해지', to: ROUTES.NOTI_SRVC_APLY }, // M09
  { label: '회원탈퇴', to: ROUTES.MB_WITHDRAWAL }, // P10
]

export function IndvInfoMngPage() {
  const navigate = useNavigate()
  return (
    <div className="flex w-full flex-col">
      {/* 현재 사용자 정보 요약 */}
      <div className="mx-4 mt-4 flex flex-col gap-krds-5 rounded-krds-8 bg-krds-bg-primary-faint p-krds-8">
        <span className="text-krds-body-lg font-bold leading-normal text-krds-text-ink">
          {MOCK_USER.userNm} 님
        </span>
        <dl className="flex flex-col gap-krds-3">
          {SUMMARY.map((r) => (
            <div key={r.label} className="flex items-start gap-krds-5 text-krds-body-md leading-normal">
              <dt className="w-28 shrink-0 text-krds-text-muted">{r.label}</dt>
              <dd className="min-w-px flex-1 wrap-break-word text-krds-text-ink">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 하위 화면 이동 버튼 — 19px Bold + 우측 ArrowForwardIos. 행 사이 구분선. */}
      <ul className="flex flex-col pt-4">
        {MENU.map((m) => (
          <li key={m.to}>
            <button
              type="button"
              onClick={() => navigate(m.to)}
              className="flex min-h-[56px] w-full items-center gap-krds-8 border-t border-krds-border-divider px-krds-8 text-left last:border-b focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden"
            >
              <span className="min-w-px flex-1 text-krds-body-lg font-bold leading-normal text-krds-text-ink">
                {m.label}
              </span>
              <Icon name="ArrowForwardIos" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
IndvInfoMngPage.displayName = 'IndvInfoMngPage'
