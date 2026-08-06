// 신청 완료 (MUI-BD-06-M08, 영문ID AplyCmptn · 설계서 02입찰 slide133).
// 접속: 홈 > 입찰 진행 > 입찰서(견적서)작성 - 신청완료.
// 용도: 사전심사(PQ)/입찰참가신청/입찰서 작성 완료 공통 화면 — aplyType 에 따라 완료 제목 텍스트만 분기(설계서 slide133).
// 레이아웃: 요약(공고) → 완료 hero(CheckCircle + 완료 제목) → 신청정보(신청 번호/신청 완료 일시)
//   → 유의사항(SectionTitle + 본문 박스) → 하단 액션바([작성 내용 확인]/[목록]).
// 진입: 전자서명(M21) → 견적서/입찰참가신청서 제출 → 이 화면(navigate state = AplyFlowState).
//   상단(요약)은 넘어온 detail 로 그린다. 직접 URL 진입(state 없음)이면 MOCK_DETAIL fallback.
import { useLocation, useNavigate } from 'react-router-dom'

import { Icon } from '@/ui/common/base/Icon'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { AplyFlowState, BidPrgrsItem } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 slide133 값/형식 그대로.
const MOCK_DETAIL: BidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '긴급공고 LDG0097-1',
  prcmNo: '56349',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '031-940-0000',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '총액제',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: false,
  bidPrgrsApfr: true,
  tndr: true,
  techEvl: false,
  prdcpDcmntSbms: false,
}

// 유의사항 본문(설계서 slide133 원문 그대로) — 2단락.
const PRECAUTIONS: string[] = [
  '본인은 국가를 당사자로 하는 계약에 관한 법률시행규칙에 의한 공사 입찰유의서에 따라 응찰하여 이 입찰이 귀 기관에 의하여 수락되면 공사 계약일반조건, 계약특수조건, 설계서 및 현장 설명 사항에 따라 위의 입찰금액으로 준공기한내에 공사를 완공할 것을 확약하오며 입찰서를 제출합니다.',
  '입찰서는 포기 또는 취소 후 재입찰이 불가하니 [입찰포기] 또는 [입찰취소]시 유의하시기 바랍니다.',
]

export function AplyCmptnPage() {
  const navigate = useNavigate()
  const state = useLocation().state as AplyFlowState | null
  const detail = state?.detail ?? MOCK_DETAIL
  const aplyType = state?.aplyType ?? 'tndr'
  const rcptNo = state?.rcptNo ?? '0000 000 0000'
  const rcptDt = state?.rcptDt ?? '2025-10-31 12:30'

  // 완료 제목 — 유형별(설계서 slide133): pq=사전심사(PQ) / apfr=입찰참가신청 / tndr=입찰서(견적서).
  const completeTitle =
    aplyType === 'pq'
      ? '사전심사(PQ) 신청 완료'
      : aplyType === 'apfr'
        ? '입찰참가신청 완료'
        : '입찰서(견적서) 신청 완료'

  // 신청정보(신청 번호/신청 완료 일시) — 라벨/형식 설계서 그대로.
  const aplyRows: TableRow[] = [
    { label: '신청 번호', value: rcptNo },
    { label: '신청 완료 일시', value: rcptDt },
  ]

  // 작성 내용 확인 → 입찰공고 통합목록(MUI-BD-01-M01, 2026-08-06 요청: 진행 상세 대신 공고 목록으로).
  const handleConfirmContent = () => {
    navigate('/bd')
  }
  const handleList = () => {
    navigate('/bd/prgrs') // 입찰진행 목록으로
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약(공고) — 업무구분/입찰방식 + 공고번호 + 입찰건명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />

      {/* 완료 hero — CheckCircle(primary) + 완료 제목 */}
      <div className="flex flex-col items-center gap-krds-7 px-4 py-10 text-center">
        <Icon name="CheckCircle" size={64} className="text-krds-text-primary" aria-hidden />
        <p className="text-[22px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {completeTitle}
        </p>
      </div>

      {/* 신청정보 — 신청 번호 / 신청 완료 일시 */}
      <div className="px-4 pb-4">
        <Table rows={aplyRows} />
      </div>

      {/* 유의사항 — 섹션 제목 + 본문 박스(보조 톤, 좌측정렬) */}
      <SectionTitle as="h2" topDivider>
        유의사항
      </SectionTitle>
      <div className="px-4 py-4">
        <div className="flex flex-col gap-krds-7 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8">
          {PRECAUTIONS.map((text, i) => (
            <p
              key={i}
              className="text-left text-[15px] leading-relaxed text-krds-text-info wrap-break-word"
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* 하단 액션바 — 목록 / 작성 내용 확인 (2026-08-06 요청: 위치 교체) */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="split"
          items={[
            { label: '목록', variant: 'secondary', onClick: handleList },
            { label: '작성 내용 확인', variant: 'primary', onClick: handleConfirmContent },
          ]}
        />
      </div>
    </div>
  )
}
AplyCmptnPage.displayName = 'AplyCmptnPage'
