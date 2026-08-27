// MUI-CM-01-M01 업체정보관리 (BzentyGnrlInfoMngPage). 설계서 00.공통 v0.84 slide113.
// 업체정보 진입 버튼 목록(허브). 웹경로: 메인 홈 > 마이페이지 > 업체정보관리.
//   상단 현재 업체 정보 요약 + 하위 화면(상세/추가정보/추가등록/무역대리업/조달원확인서/국외등록증안내) 이동 버튼.
// 셸 안 + sub헤더. 3뎁스라 BottomNav 숨김. 데이터=목업(설계서 예시), 동작=navigate.
import { useNavigate } from 'react-router-dom'

import { Icon } from '@/ui/common/base/Icon'
import { BzentySummaryCard } from '@/ui/biz/cm/bzentyInfo/BzentySummaryCard'
import { ROUTES } from '@/constants/routes'

// ⚠️ 현재 로그인 업체 요약(설계서 slide113 예시) — 추후: 업체정보 API(로그인 업체)로 교체.
const MOCK_BZENTY = {
  bzentyNm: '주식회사 국방전자조달',
  brno: '123-45-67890',
  bzentyCd: '7004F',
  rprsvNm: '홍길동',
  regDt: '2026-02-02',
  crno: '123456-7890123',
}

// 진입 버튼 목록(설계서 slide113). 추가등록 3종(담당자/물품내자/국내소재상사)은 AddReg 라우트 매핑 준수.
// 2026-08-05 수정: 추가등록 3종은 '업체정보 추가등록' 섹션(마이페이지 '나의 진행업무현황' 패턴 —
//   섹션 헤더(bg-faint·우측 공백) + 하위 항목(화살표))으로 묶는다. 블록 위·아래 여백 없음.
const MENU_TOP: { label: string; to: string }[] = [
  { label: '업체 정보 상세보기', to: ROUTES.BZENTY_INFO_DTL }, // M02
  { label: '추가정보 신청 목록', to: ROUTES.ADD_REG_INFO_APLY }, // M03
]
const ADD_REG_ITEMS: { label: string; to: string }[] = [
  { label: '담당자 정보 추가등록', to: ROUTES.BZENTY_ADD_REG_PIC }, // M22
  { label: '물품(내자) 정보 추가등록', to: ROUTES.BZENTY_ADD_REG_CMDTY }, // M05
  { label: '국내소재상사 정보 추가등록', to: ROUTES.BZENTY_ADD_REG_DMS_AGT }, // M23
]
const MENU_BOTTOM: { label: string; to: string }[] = [
  { label: '군수품무역대리업 신청 및 발급 목록', to: ROUTES.DF_EQPMNT_TRADE_AGNC }, // M15
  { label: '국내 조달원 확인서 신청 목록', to: ROUTES.DMST_SOS_CNFDOC }, // M19
  { label: '국외 조달원등록증 신청 안내', to: ROUTES.OVS_DMST_SOS }, // P21
]

// 업체코드는 요약 카드 뱃지로 표시 — 행에서 제외(업체정보 상세 M02 와 동일).
const SUMMARY: { label: string; value: string }[] = [
  { label: '사업자등록번호', value: MOCK_BZENTY.brno },
  { label: '대표자', value: MOCK_BZENTY.rprsvNm },
  { label: '등록일', value: MOCK_BZENTY.regDt },
  { label: '법인등록번호', value: MOCK_BZENTY.crno },
]

// 이동 행 — 19px Bold + 우측 ArrowForwardIos 20px. 행 사이 구분선(border-t), 목록 마지막(last)은 border-b 로 닫음.
function MenuRow({ label, onClick, last }: { label: string; onClick: () => void; last?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[56px] w-full items-center gap-krds-8 border-t border-krds-border-divider px-krds-8 text-left focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden${last ? ' border-b' : ''}`}
    >
      <span className="min-w-px flex-1 text-krds-body-lg font-bold leading-normal text-krds-text-ink">
        {label}
      </span>
      <Icon name="ArrowForwardIos" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
    </button>
  )
}

export function BzentyGnrlInfoMngPage() {
  const navigate = useNavigate()
  return (
    <div className="flex w-full flex-col">
      {/* 현재 업체 정보 요약 — 업체정보 상세(M02) 리디자인과 동일한 요약 카드(260828 사용자 확정). */}
      <div className="p-4 pb-0">
        <BzentySummaryCard name={MOCK_BZENTY.bzentyNm} code={MOCK_BZENTY.bzentyCd} infos={SUMMARY} />
      </div>

      {/* 하위 화면 이동 버튼 — 19px Bold + 우측 ArrowForwardIos. 행 사이 구분선. */}
      <ul className="flex flex-col pt-4">
        {MENU_TOP.map((m) => (
          <li key={m.to}>
            <MenuRow label={m.label} onClick={() => navigate(m.to)} />
          </li>
        ))}
      </ul>

      {/* 업체정보 추가등록 섹션 — 헤더(bg-faint·우측 공백) + 하위 3항목(17px Bold + 화살표).
          마이페이지 '나의 진행업무현황' 하위 그룹 실측(px16 py16, 행 min-h 34·py 4·gap 8) 준수.
          블록 위·아래 여백 없음(2026-08-05) — 경계는 헤더 border-t 와 다음 행 border-t 가 담당. */}
      <div>
        <div className="flex min-h-[56px] w-full items-center gap-krds-8 border-t border-krds-border-divider bg-krds-bg-primary-faint px-krds-8">
          <span className="min-w-px flex-1 text-krds-body-lg font-bold leading-normal text-krds-text-ink">
            업체정보 추가등록
          </span>
        </div>
        <div className="flex flex-col gap-krds-5 px-krds-8 pb-krds-8 pt-krds-8">
          {ADD_REG_ITEMS.map((m) => (
            <button
              key={m.to}
              type="button"
              onClick={() => navigate(m.to)}
              className="flex min-h-[34px] w-full items-center gap-krds-5 rounded-krds-8 py-krds-3 text-left focus-visible:bg-krds-bg-primary-faint focus-visible:outline-hidden"
            >
              <span className="min-w-px flex-1 text-krds-body-md font-bold leading-normal text-krds-text-ink">
                {m.label}
              </span>
              <Icon name="ArrowForwardIos" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col">
        {MENU_BOTTOM.map((m, i) => (
          <li key={m.to}>
            <MenuRow
              label={m.label}
              onClick={() => navigate(m.to)}
              last={i === MENU_BOTTOM.length - 1}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
BzentyGnrlInfoMngPage.displayName = 'BzentyGnrlInfoMngPage'
