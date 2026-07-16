// MUI-CM-01-M01 업체정보관리 (BzentyGnrlInfoMngPage). 설계서 00.공통 v0.84 slide113.
// 업체정보 진입 버튼 목록(허브). 웹경로: 메인 홈 > 마이페이지 > 업체정보관리.
//   상단 현재 업체 정보 요약 + 하위 화면(상세/추가정보/추가등록/무역대리업/조달원확인서/국외등록증안내) 이동 버튼.
// 셸 안 + sub헤더. 3뎁스라 BottomNav 숨김. 데이터=목업(설계서 예시), 동작=navigate.
import { useNavigate } from 'react-router-dom'

import { Icon } from '@/ui/common/base/Icon'
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
const MENU: { label: string; to: string }[] = [
  { label: '업체 정보 상세보기', to: ROUTES.BZENTY_INFO_DTL }, // M02
  { label: '추가정보 신청 목록', to: ROUTES.ADD_REG_INFO_APLY }, // M03
  { label: '담당자 정보 추가등록', to: ROUTES.BZENTY_ADD_REG_PIC }, // M22
  { label: '물품(내자) 정보 추가등록', to: ROUTES.BZENTY_ADD_REG_CMDTY }, // M05
  { label: '국내소재상사 정보 추가등록', to: ROUTES.BZENTY_ADD_REG_DMS_AGT }, // M23
  { label: '군수품무역대리업 신청 및 발급 목록', to: ROUTES.DF_EQPMNT_TRADE_AGNC }, // M15
  { label: '국내 조달원 확인서 신청 목록', to: ROUTES.DMST_SOS_CNFDOC }, // M19
  { label: '국외 조달원등록증 신청 안내', to: ROUTES.OVS_DMST_SOS }, // P21
]

const SUMMARY: { label: string; value: string }[] = [
  { label: '사업자등록번호', value: MOCK_BZENTY.brno },
  { label: '업체코드', value: MOCK_BZENTY.bzentyCd },
  { label: '대표자', value: MOCK_BZENTY.rprsvNm },
  { label: '등록일', value: MOCK_BZENTY.regDt },
  { label: '법인등록번호', value: MOCK_BZENTY.crno },
]

export function BzentyGnrlInfoMngPage() {
  const navigate = useNavigate()
  return (
    <div className="flex w-full flex-col">
      {/* 현재 업체 정보 요약 */}
      <div className="mx-4 mt-4 flex flex-col gap-krds-5 rounded-krds-8 bg-krds-bg-primary-faint p-krds-8">
        <span className="text-krds-body-lg font-bold leading-normal text-krds-text-ink">
          {MOCK_BZENTY.bzentyNm}
        </span>
        <dl className="flex flex-col gap-krds-3">
          {SUMMARY.map((r) => (
            <div key={r.label} className="flex items-start gap-krds-5 text-krds-body-md leading-normal">
              <dt className="w-28 shrink-0 text-krds-text-muted">{r.label}</dt>
              <dd className="min-w-px flex-1 text-krds-text-ink wrap-break-word">{r.value}</dd>
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
BzentyGnrlInfoMngPage.displayName = 'BzentyGnrlInfoMngPage'
