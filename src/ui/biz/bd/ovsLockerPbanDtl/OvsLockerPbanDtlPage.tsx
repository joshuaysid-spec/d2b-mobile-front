// 국외 보관함 상세 - 일반정보 (MUI-CM-01-M72, 설계서 slide303~304). 보관함에 추가한 공고 상세 조회.
// 레퍼런스: 입찰공고 상세 BidPbancDtlPage (sticky 요약 + 콘텐츠 동일 패턴).
// 구성: sticky 요약(SummaryInfo, 스크롤 축소) + 일반정보 아코디언(Table) + 하단 액션 버튼 + FAB.
//   ※ 품목 목록 탭은 설계서 2026-06-22 수정으로 제거 — 품목은 '보관함 품목 관리(M73)'에서 일원 관리,
//     입찰내역은 '입찰내역 작성(M76)'에서 처리 → 탭 없이 일반정보 단일 콘텐츠.
// 데이터: 목록에서 navigate state 로 넘어온 항목으로 상단·본문을 그린다. 직접 URL 진입 시 페이지 fallback 목업.
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
// 보관함 공고 타입 — 목록 화면에서 정의(설계서 slide306 dl_resultList). // 추후 src/types/bd.ts 통합
import type { OvsLockerPbanItem } from '@/ui/biz/bd/ovsLockerPbanList/OvsLockerPbanListPage'

// 직접 URL 진입(목록 state 없음) 대비 fallback 목업 — 설계서 slide304 데이터영역 항목명/형식 그대로.
const MOCK_OVS_LOCKER_PBAN_DETAIL: OvsLockerPbanItem = {
  id: 'BDF01823EFE',
  intgRfrncNo: 'BDF01823EFE',
  pbancNo: 'EFE00012',
  pbancOd: '2',
  pbancYr: '2025',
  prchsDmndNo: 'BDF01823-002',
  bizNm: 'T-80U/TBE-3',
  tmprBidCnEn: 'N',
  splyBzentyNm: '미작성',
  bidPrtcpAplyYn: 'N',
  regDdlnDt: '2026-03-17 15:00',
  bdngDdlnDt: '2026-03-26 11:00',
  bdopnYmd: '2026-03-30',
  exchrtAplcnYmd: '2026-03-17',
  bidMth: '일반투찰',
  lockerItemQty: 100,
  bidPrcSysNm: '단가제',
  ctrtMthdNm: '일반경쟁',
}

// 담당자 정보 (설계서 slide303~304 표시 영역 — 데이터영역 미정의, 표시 항목 그대로 목업).
// 추후 API: bdService.getOvsLockerPbanDtl 응답의 담당자 영역으로 교체.
const CONTACT_ROWS: TableRow[] = [
  { label: '담당 부서명', value: '국제부품계약팀' },
  { label: '담당자', value: '정영금' },
  {
    label: '연락처',
    value: (
      <div className="flex flex-col gap-0.5">
        <span>02-1234-5678</span>
        <span>010-1234-5678</span>
      </div>
    ),
    type: 'combination',
  },
]

export function OvsLockerPbanDtlPage() {
  const navigate = useNavigate()
  const { collapsed, rootRef, scrollToTop } = useCollapsibleHeader()

  // 목록 → 상세 데이터 전달: navigate state 항목으로 상단/본문을 그린다. state 없으면 페이지 목업.
  const { id } = useParams()
  const detail = (useLocation().state as OvsLockerPbanItem | null) ?? MOCK_OVS_LOCKER_PBAN_DETAIL

  // 일반정보 (설계서 slide304 공고일반 데이터 영역) — detail 필드로 구동.
  const generalRows: TableRow[] = [
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '공고번호-차수', value: `${detail.pbancNo}-${detail.pbancOd}` },
    { label: '공고년도', value: detail.pbancYr },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '사업명', value: detail.bizNm },
    { label: '입찰내역작성여부', value: detail.tmprBidCnEn === 'Y' ? '작성' : '미작성' },
    { label: '입찰업체', value: detail.splyBzentyNm },
    { label: '입찰참가신청여부', value: detail.bidPrtcpAplyYn === 'Y' ? '신청' : '미신청' },
    { label: '입찰참가등록마감일시', value: detail.regDdlnDt },
    { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
    { label: '개찰일자', value: detail.bdopnYmd },
    { label: '환율일자', value: detail.exchrtAplcnYmd },
    { label: '입찰방식', value: detail.bidMth },
    { label: '계약방식', value: detail.ctrtMthdNm },
    { label: '보관품목수', value: detail.lockerItemQty.toLocaleString(), type: 'number' },
  ]

  // ── 액션 (설계서 slide307 이벤트) — 라우트 계획 경로로 이동. state 로 현재 항목 전달 ──
  const handleBidCn = () => {
    // btn_moveBidDetail_onclick → 입찰내역 작성(MUI-BD-01-M76)
    console.log('[OvsLockerDtl] 입찰내역 작성 이동', detail.intgRfrncNo)
    navigate(`/bd/ovs/locker/${id ?? detail.id}/bid-cn`, { state: detail })
  }
  const handleItemMng = () => {
    // btn_openLockerItemMng_onclick → 보관함 품목 관리(MUI-CM-01-M73)
    console.log('[OvsLockerDtl] 보관함 품목 관리 이동', detail.intgRfrncNo)
    navigate(`/bd/ovs/locker/${id ?? detail.id}/items`, { state: detail })
  }
  const handleApfr = () => {
    // btn_moveApplFormEdit_onlick → 국외 입찰참가신청서 작성. 청렴계약이행서약서동의(P71)는 신청서 화면에서 처리.
    console.log('[OvsLockerDtl] 입찰참가신청서 작성 이동', detail.intgRfrncNo)
    navigate(`/bd/ovs/prgrs/${id ?? detail.id}/aply`, { state: detail })
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 요약 — sticky 고정, 스크롤 시 축소(infolist 숨김). 표시 레이블은 목록 카드와 동일(slide303 ①). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            { key: 'bidMth', label: detail.bidMth },
            { key: 'bidPrcSysNm', label: detail.bidPrcSysNm },
            detail.bidPrtcpAplyYn === 'Y'
              ? { key: 'apply', label: '입찰참가 신청', type: 'solid' as const, color: 'blue' as const }
              : { key: 'apply', label: '입찰참가 미신청', color: 'red' as const },
            detail.tmprBidCnEn === 'Y'
              ? { key: 'bidCn', label: '입찰내역 완료', type: 'solid' as const, color: 'green' as const }
              : { key: 'bidCn', label: '입찰내역 미작성', color: 'yellow' as const },
          ]}
          subtitle={`통합참조번호 ${detail.intgRfrncNo} / 공고번호 ${detail.pbancNo}-${detail.pbancOd}`}
          title={detail.bizNm}
          rows={[
            { label: '입찰업체', value: detail.splyBzentyNm },
            { label: '구매요청번호', value: detail.prchsDmndNo },
            { label: '입찰참가등록마감일시', value: detail.regDdlnDt },
            { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
            { label: '개찰일자', value: detail.bdopnYmd },
          ]}
        />
      </div>

      {/* 본문 — 짧은 콘텐츠도 헤더 접힘을 지탱할 스크롤 높이 확보(접힘 진동 방지). */}
      <div className="min-h-[100dvh]">
        <PageTitle as="h2">일반정보</PageTitle>
        <Accordion type="multiple" defaultValue={['general', 'contact']} className="w-full">
          <AccordionSection value="general" title="일반정보" borderTop={false}>
            <Table rows={generalRows} />
          </AccordionSection>
          <AccordionSection value="contact" title="담당자 정보">
            <Table rows={CONTACT_ROWS} />
          </AccordionSection>
        </Accordion>

        {/* 액션 — 설계서 slide307 이벤트(입찰내역작성/보관함품목관리/입찰참가신청작성).
            부정당내역(P73)·입찰진행(BD-03-M01)·모의투찰은 타 유닛/추후 연결. */}
        <div className="flex flex-col gap-krds-5 px-4 pb-6 pt-4">
          <ButtonGroup
            layout="vertical"
            items={[
              {
                label: detail.tmprBidCnEn === 'Y' ? '입찰내역 수정' : '입찰내역 작성',
                variant: 'primary',
                onClick: handleBidCn,
              },
              {
                label:
                  detail.bidPrtcpAplyYn === 'Y' ? '입찰참가신청서 수정' : '입찰참가신청서 작성',
                variant: 'secondary',
                onClick: handleApfr,
              },
              {
                label: `보관함 품목 관리 (${detail.lockerItemQty.toLocaleString()}품목)`,
                variant: 'secondary',
                onClick: handleItemMng,
              },
            ]}
          />
        </div>
      </div>

      {/* 맨 위로 FAB */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
OvsLockerPbanDtlPage.displayName = 'OvsLockerPbanDtlPage'
