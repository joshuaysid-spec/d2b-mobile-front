// 사용자정보관리 — MUI-CM-02-M01 (IndvInfoMngPage). 설계서 00.공통 v0.84 slide65/76/238.
// 마이페이지 > 사용자 정보관리(허브). 상단 사용자 요약 + 하위 화면 진입 버튼 목록.
//   웹경로: 메인 홈 > 마이페이지 > 사용자 정보관리. 셸 안 + sub헤더. 3뎁스라 BottomNav 숨김.
//   데이터=목업(설계서 slide194 예시), 동작=navigate.
// ⚠️ 하위 메뉴 구성은 CM-02 클러스터(M03/M05/M06/M07/M09/P10) 기준으로 구성(설계서에 M01 메뉴 표가
//   명시되지 않아 클러스터 화면으로 도출). 2026-07-13 개정: 회원탈퇴가 사용자정보 화면으로 이동됨.
import { useNavigate } from 'react-router-dom'

import { Icon } from '@/ui/common/base/Icon'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { ROUTES } from '@/constants/routes'

// ⚠️ 업체정보(dm_bzentyInfo, 설계서 v0.86 slide195·196 예시값 그대로) — 추후: 회원정보 API 로 교체.
//   구 사용자 요약 카드(홍길동 님/아이디/부서명)는 설계서 미표기라 제거(사용자 확정 2026-08-25 — 설계서와 동일 구성).
const MOCK_BZENTY = {
  bzentyNm: '주식회사 국방전자조달', // 업체명
  brno: '123-45-67890', // 사업자등록번호
  bzentyCd: '7004F', // 업체코드
  rprsvNm: '홍길동', // 대표자명
  bzentyRgstrtYmd: '2026-02-02', // 등록일
  crno: '123456-7890123', // 법인등록번호
}

// 업체정보 행 — 설계서 slide196 항목설명(dm_bzentyInfo) 순서 그대로.
const BZENTY_ROWS: { label: string; value: string }[] = [
  { label: '업체명', value: MOCK_BZENTY.bzentyNm },
  { label: '사업자등록번호', value: MOCK_BZENTY.brno },
  { label: '업체코드', value: MOCK_BZENTY.bzentyCd },
  { label: '대표자명', value: MOCK_BZENTY.rprsvNm },
  { label: '등록일', value: MOCK_BZENTY.bzentyRgstrtYmd },
  { label: '법인등록번호', value: MOCK_BZENTY.crno },
]

// 진입 버튼 목록(설계서 v0.86 slide195 메뉴 구성). 개인정보는 본인 인증(M02) 게이트를 거쳐 상세(M03)로 진입.
// '알림 서비스 신청 및 해지'(M09)는 이 화면에서 제외(사용자 확정 2026-08-25) — 마이페이지/앱 설정에서 진입.
const MENU: { label: string; to: string }[] = [
  { label: '개인정보 상세', to: ROUTES.INDV_CERT }, // M02 인증 → M03 상세 → M04 수정 (메뉴명 설계서 slide195 표기)
  { label: '비밀번호 변경', to: ROUTES.PSWD_CHG }, // M05
  { label: '개인 신원 확인', to: ROUTES.INDV_IDNT_IDNTY }, // M06
  { label: '소속 사용자 목록', to: ROUTES.PRCM_BZENTY_USER_MNG }, // M07
  { label: '회원탈퇴', to: ROUTES.MB_WITHDRAWAL }, // P10
]

export function IndvInfoMngPage() {
  const navigate = useNavigate()
  return (
    <div className="flex w-full flex-col">
      {/* 업체정보(dm_bzentyInfo) — 상단 배치(사용자 확정 2026-08-25). 항목·예시값은 설계서 slide195·196 그대로. */}
      <div className="mx-4 mt-4 flex flex-col gap-krds-5 rounded-krds-8 bg-krds-bg-primary-faint p-krds-8">
        <span className="text-krds-body-lg font-bold leading-normal text-krds-text-ink">업체정보</span>
        <dl className="flex flex-col gap-krds-3">
          {BZENTY_ROWS.map((r) => (
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

      {/* 하단 도움말 — 설계서 v0.85 slide196(M01) 문구 그대로. */}
      <div className="pt-4 pb-4">
        <HelpDisclosure
          title="도움말"
          items={['퇴사자 원복은 PC 버전에서 확인하고, 신청이 가능합니다.']}
        />
      </div>
    </div>
  )
}
IndvInfoMngPage.displayName = 'IndvInfoMngPage'
