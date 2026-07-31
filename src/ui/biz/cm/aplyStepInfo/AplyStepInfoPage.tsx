// 신청절차 및 안내 — MUI-CM-04-M05. 설계서 00.공통 v0.84 slide239 (화면 목록 slide212).
// 고객센터 > 민원서류발급신청(M04 허브) 하위의 정적 안내 페이지. 고정 안내 문구라 목업/API 경계 없음.
// Figma 전용 프레임 없음 → 안내 페이지 컨벤션(Domestic01Page 계열: SecTitle + ● 불릿, KRDS 토큰) 준수.
// 담당부서 및 연락처는 공통 Table 사용(요청). 검색조건·데이터영역 없음 → 검색필터/바텀시트 미생성.
import type { ReactNode } from 'react'

import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 안내 페이지 로컬 조립물 (Domestic01Page 컨벤션) ──────────────────────────
function SecTitle({ children }: { children: ReactNode }) {
  return <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{children}</p>
}

// ● 채움 불릿 — bold=절차 플로우 강조, 기본 Regular.
function Bullet({ t, bold }: { t: ReactNode; bold?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-krds-text-ink" aria-hidden />
      <span
        className={`min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word ${
          bold ? 'font-bold' : ''
        }`}
      >
        {t}
      </span>
    </div>
  )
}

// ── 콘텐츠 (설계서 slide239 문구 그대로) ─────────────────────────────────────
const PRCDR_FLOW =
  '국방전자조달 로그인 > 고객센터 > 민원서류발급신청 > 실적증명서 > 실적증명서 신청에서 납품 계약정보 목록에서 원하는 계약 선택 > 신청정보 입력 > 미리보기 및 신청 > 실적증명 확인 및 신청'

const GUIDE_ITEMS: string[] = [
  '증명원의 사용목적에 따라서 방위사업청 계약건에 대한 실적증명서의 경우 납품, 정산, 선착중도금을 넣을 수 있으며, 국방부 및 각군 계약건에 대한 실적증명서의 경우 실적비율 및 실적금액을 넣을 수 있습니다.',
  '실적증명 확인 후 반드시 신청을 하셔야 방위사업청 또는 국방부 및 각군에서 처리됩니다.',
  '접수번호를 클릭하여 상세정보를 확인합니다.',
  '실적증명서는 상세정보 하단의 발급버튼을 클릭하여 가능합니다.',
]

// 담당부서 및 연락처 — 공통 Table 행(요청). 발급담당자 2명은 combination(2줄).
const CONTACT_ROWS: TableRow[] = [
  { label: '방위사업청 계약', value: '1577-1118(①번)' },
  {
    label: '방위사업청 계약 발급담당자',
    value: (
      <>
        <span>
          기반전력사업총괄팀
          <br />
          윤준혁 주무관 (☎02-2079-4793)
        </span>
        <span>
          미래전력사업총괄팀
          <br />
          서정화 주무관 (☎02-2079-4021)
        </span>
      </>
    ),
    type: 'combination',
  },
  { label: '국방부 및 각 군 계약', value: '국방부 및 각 군 계약담당부서' },
]

const CAUTION_ITEMS: string[] = [
  '국방부 및 각군에서 발급된 실적증명서는 진본성 정보가 포함되어 있으며, 진본성 정보를 확인하려면 해당 프로그램을 설치하셔야 합니다. (PDF 진본성 파일 미검증시 조치 방법)',
  '물품(내자) 납품실적증명서 발급은 방위사업청과 계약한 건에 한해 방위사업청에서 처리 가능하며, 타 기관 및 부대와의 계약건은 국방부 및 각군의 계약담당부서로 요청하셔야 합니다.',
]

export function AplyStepInfoPage() {
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {/* 실적증명서 신청 절차 및 안내 (절차 플로우 + 안내 + 유의사항) */}
      <div className="flex flex-col gap-2">
        <SecTitle>실적증명서 신청 절차 및 안내</SecTitle>
        <Bullet bold t={PRCDR_FLOW} />
        {GUIDE_ITEMS.map((t) => (
          <Bullet key={t} t={t} />
        ))}
        {CAUTION_ITEMS.map((t) => (
          <Bullet key={t} t={t} />
        ))}
      </div>

      {/* 담당부서 및 연락처 — 공통 Table. 요청(2026-07-27)에 따라 제일 하단에 배치. */}
      <div className="flex flex-col gap-2">
        <SecTitle>담당부서 및 연락처</SecTitle>
        <Table rows={CONTACT_ROWS} />
      </div>
    </div>
  )
}
AplyStepInfoPage.displayName = 'AplyStepInfoPage'
