// 민원서류발급신청 — MUI-CM-04-M04. 설계서 00.공통 v0.84 slide238(2026-07-13 화면 추가) /
// Figma 10020-87972(MUI-CM-04-M13 카드 버튼 스타일 참조 — 요청에 따라 선행 아이콘 제외).
// 업체정보(MUI-CM-02-M01 dm_bzentyInfo 재사용) 아코디언 + 하위 화면 바로가기 카드 메뉴 화면.
// 검색조건·데이터영역(목록) 없음(메뉴 화면) → 검색필터/바텀시트 미생성.
// 하위 화면 5종 전부 미구현 → 클릭 시 console.log 스텁(라우트 확정 시 navigate 로 교체).
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Icon } from '@/ui/common/base/Icon'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBzentyInfo } from '@/types/mock/cm'

// 업체정보 목업 — 설계서 slide238 표시값 그대로 (추후: 로그인 업체 정보 API)
const MOCK_BZENTY_INFO: MockBzentyInfo = {
  bzentyNm: '주식회사 국방전자조달',
  brno: '123-45-67890',
  bzentyCd: '7004F',
  rprsvNm: '홍길동',
  bzentyRgstrtYmd: '2026-02-02',
  crno: '123456-7890123',
}

// 업체정보 표 행 — 항목명(한글)은 설계서 slide191 dm_bzentyInfo 순서 그대로
const BZENTY_ROWS: TableRow[] = [
  { label: '업체명', value: MOCK_BZENTY_INFO.bzentyNm },
  { label: '사업자등록번호', value: MOCK_BZENTY_INFO.brno },
  { label: '업체코드', value: MOCK_BZENTY_INFO.bzentyCd },
  { label: '대표자명', value: MOCK_BZENTY_INFO.rprsvNm },
  { label: '등록일', value: MOCK_BZENTY_INFO.bzentyRgstrtYmd },
  { label: '법인등록번호', value: MOCK_BZENTY_INFO.crno },
]

interface DcmntMenu {
  id: string
  label: string
  onClick: () => void
}

export function DcmntIssuAplyPage() {
  const navigate = useNavigate()

  // 설계서 slide238 순서 — 미구현 하위 화면은 스텁. 화면 목록 영문 ID 는 주석 참조.
  const dcmntMenus: DcmntMenu[] = [
    {
      id: 'aplyStepInfo',
      label: '신청 절차 및 안내',
      // 신청절차및안내(MUI-CM-04-M05, AplyStepInfoPage)
      onClick: () => navigate(ROUTES.SUPPORT_APLY_STEP_INFO),
    },
    {
      id: 'prfmncPrdocList',
      label: '실적 증명서 신청 목록',
      // 실적증명서신청목록(MUI-CM-04-M06, PrfmncPrdocPage)
      onClick: () => navigate(ROUTES.SUPPORT_PRFMNC_PRDOC),
    },
    {
      id: 'prfmncPrdocReg',
      label: '실적 증명서 신청',
      // 실적증명서 신청 플로우(MUI-CM-04-P21 계약선택 → M12 → T12/T13)
      onClick: () => navigate(ROUTES.SUPPORT_PRFMNC_PRDOC_REG),
    },
    {
      id: 'ovsSosCnfdocList',
      label: '국외 조달원 등록증 신청 목록',
      // 국외조달원등록증신청목록(MUI-CM-04-M21, OvsSosCnfdocListPage)
      onClick: () => navigate(ROUTES.SUPPORT_OVS_SOS_CNFDOC),
    },
    {
      id: 'ovsSosCnfdocReg',
      label: '국외 조달원 등록증 신청',
      // 국외조달원등록증신청(MUI-CM-04-M22, OvsSosCnfdocRegPage) — 메뉴에서 바로 신청(slide340).
      onClick: () => navigate(ROUTES.SUPPORT_OVS_SOS_CNFDOC_REG),
    },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 업체정보 — MUI-CM-02-M01 dm_bzentyInfo 재사용, 아코디언(기본 열림) */}
      <Accordion type="single" collapsible defaultValue="bzentyInfo">
        <AccordionSection
          value="bzentyInfo"
          title="업체정보"
          variant="blue"
          borderTop={false}
          contentClassName="pt-krds-7"
        >
          <Table rows={BZENTY_ROWS} />
        </AccordionSection>
      </Accordion>

      {/* 바로가기 카드 — Figma m_button_(10020-87975) 스타일, 선행 아이콘 제외(요청) */}
      <div className="flex w-full flex-col gap-4 px-4 py-5">
        {dcmntMenus.map((menu) => (
          <button
            key={menu.id}
            type="button"
            onClick={menu.onClick}
            className="flex h-[74px] w-full items-center gap-2 rounded-[12px] border border-krds-border-divider bg-background px-6 text-left shadow-krds-card focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
          >
            <span className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink">
              {menu.label}
            </span>
            <Icon name="TrendingFlat" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
          </button>
        ))}
      </div>
    </div>
  )
}
DcmntIssuAplyPage.displayName = 'DcmntIssuAplyPage'
