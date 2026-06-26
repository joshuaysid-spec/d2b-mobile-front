// 입찰참가신청서작성 (MUI-BD-04-M01, 설계서 영문ID BidPrtcpAperWrtPage · slide92·96~119).
// 접속: 홈 > 입찰진행 > 상세 > 입찰참가신청서 작성. 입찰진행 상세(M02) 바로가기 '입찰참가신청서 작성하기' → 이 화면.
// ⚠️ 설계서상 본 화면은 서약서동의→일반정보→품목내역→…→문의/동의→전자서명 7스텝 마법사다.
//    이번 작업 범위는 (1) 진행단계 표시 + 일반정보 스텝 골격 (2) 플로팅 [등록반려]/[반려신청조회] → 반려 팝업(P07) 연결.
//    나머지 스텝(품목/공종/보증금/공동수급/파일첨부/문의·동의/서명)은 추후 제작.
// 반려 버튼은 진행상태(regRjctYn)로 분기: 신청 전=[등록반려](심사 전 가능)·신청 후=[반려신청조회]. (설계서 slide119)
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { BidPrtcpAplyRjctFullPopup } from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAplyRjctFullPopup'
import type { BidPrgrsItem } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 항목명/형식 그대로.
const MOCK_DETAIL: BidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '2026LGM000604191-01',
  prcmNo: '2026LGM000604191',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '02-1234-5678',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '전자입찰',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: false,
  techEvl: false,
  prdcpDcmntSbms: false,
  apfrStatNm: '신청',
  regRjctYn: false,
}

// 진행단계(설계서 slide92): 서약서 → 신청서 → 서명 → 제출. 진입은 신청서 작성 단계.
const STEPS: StepItem[] = [
  { label: '서약서', state: 'done' },
  { label: '신청서', state: 'doing' },
  { label: '서명', state: 'todo' },
  { label: '제출', state: 'todo' },
]

export function BidPrtcpAperWrtPage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as BidPrgrsItem | null) ?? MOCK_DETAIL
  const [shortcutOpen, setShortcutOpen] = useState(false) // 플로팅 바로가기 시트
  const [rjctOpen, setRjctOpen] = useState(false) // 입찰참가등록반려 팝업(P07)

  // 일반정보(slide96·97) — 공고일반 + 업체내역. 항목명/형식 설계서 그대로(상세 항목 + 목업 보완).
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: '육군 탄약지원사령부' },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '집행유형', value: '제조' },
    { label: '개찰일시', value: '2026-03-26 11:00' },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '입찰방법', value: detail.bidMthdNm },
    { label: '총수량', value: '1 AY', type: 'number' },
    { label: '예산금액', value: '619,520,000 원', type: 'number' },
    { label: '낙찰자결정방법', value: '적격심사제' },
    { label: '적격심사 여부', value: '대상' },
  ]
  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: '00000' },
    { label: '업체명', value: '㈜업체명표기영역' },
    { label: '대표자', value: '홍길동' },
    { label: '사업자등록번호', value: '123-56-78901' },
    { label: '전화번호', value: '02-1234-5678' },
    { label: '주소', value: '서울특별시 …' },
  ]

  // 반려 버튼 라벨 — 신청 후면 '반려신청조회', 그 전이면 '등록반려'.
  const rjctMode = detail.regRjctYn ? 'view' : 'apply'
  const rjctLabel = detail.regRjctYn ? '반려신청조회' : '등록반려'

  return (
    <div className="flex w-full flex-col">
      {/* 진행단계 표시기 */}
      <div className="px-4 pt-4">
        <StepBar orientation="horizontal" items={STEPS} />
      </div>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <SummaryInfo
          badges={[
            { key: 'task', label: detail.taskSeNm },
            { key: 'ctrt', label: detail.ctrtMthdNm },
            { key: 'bfhd', label: '사전심사' },
            { key: 'apfr', label: '입찰참가' },
          ]}
          subtitle={detail.pbancNo}
          title={detail.bidNm}
        />

        <Accordion type="multiple" defaultValue={['pbanc', 'bzenty']}>
          <AccordionSection value="pbanc" title="일반정보" variant="blue" borderTop={false} flush>
            <Table rows={pbancRows} />
          </AccordionSection>
          <AccordionSection value="bzenty" title="업체내역" variant="blue" flush>
            <Table rows={bzentyRows} />
          </AccordionSection>
        </Accordion>

        {/* footer — 이전/다음으로 (스텝 이동 스텁) */}
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '이전', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '다음으로', variant: 'primary', onClick: () => console.log('[M01-입찰참가] 다음 스텝') },
          ]}
        />
      </div>

      {/* 플로팅 — 맨위로 + 바로가기(+). 바로가기에 반려 버튼 노출. */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={[
            {
              label: rjctLabel,
              variant: 'secondary',
              onClick: () => {
                setShortcutOpen(false)
                setRjctOpen(true) // 입찰참가등록반려 팝업(P07)
              },
            },
          ]}
        />
      </BottomSheet>

      {/* 입찰참가등록반려 팝업(P07) — 신청(등록반려)/조회(반려신청조회) 모드 */}
      <BidPrtcpAplyRjctFullPopup
        open={rjctOpen}
        onOpenChange={setRjctOpen}
        mode={rjctMode}
        detail={detail}
      />
    </div>
  )
}
BidPrtcpAperWrtPage.displayName = 'BidPrtcpAperWrtPage'
