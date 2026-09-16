// 입찰참가신청서작성 - 일반정보 (MUI-BD-04-M05, Figma 9300-37788 · 설계서 slide96~119).
// 접속: 홈 > 입찰진행 > 상세 > 입찰참가신청서 작성. 입찰진행 상세(M02) 바로가기 '입찰참가신청서 작성하기' → 이 화면.
// 레이아웃(Figma M05): 요약 → 진행단계(StepBar) → 업무도움(Infobox) → 신청서 탭(TabList)
//   → 일반정보(SectionTitle+Table) → 업체내역(SectionTitle+Table) → 입찰공고 첨부서류(SectionTitle+FileDownloadList 다운로드)
// ⚠️ 탭 하단에 탭명을 반복하는 페이지타이틀은 두지 않는다(전 탭 공통 — 사용자 지시 2026-08-10).
//   → 하단 액션바(이전/다음으로) + 맨위로 FAB.
// ⚠️ 설계서상 본 화면은 서약서동의→일반정보→품목내역→…→전자서명 7스텝 마법사다(탭=하위 스텝).
//    이번 범위는 (1) M05 '일반정보' 스텝 레이아웃 (2) 플로팅 [등록반려]/[반려신청조회] → 반려 팝업(P07) 연결.
//    나머지 탭/스텝(품목/공종/보증금/공동수급/파일첨부/문의·동의/서명)은 추후 제작(탭 클릭 스텁).
// 항목명/형식은 데이터영역(slide115 dmt_bidPbancInfo·dmt_bzentyInfo) 그대로 — 공고 식별값은 상세 항목, 나머지 목업.
// 반려 버튼은 진행상태(regRjctYn)로 분기: 신청 전=[등록반려](심사 전)·신청 후=[반려신청조회]. (설계서 slide119)
import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OzReportFullPopup } from '@/ui/biz/cm/ozReport/OzReportFullPopup'
import { useOzReport } from '@/ui/biz/cm/ozReport/useOzReport'
import {
  BidPrtcpAplyRjct,
  type BidPrtcpAplyRjctHandle,
} from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAplyRjct'
import { BidPrtcpAperWrtPage_Stp2 } from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp2'
import { BidPrtcpAperWrtPage_Stp3 } from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp3'
import { BidPrtcpAperWrtPage_Stp4 } from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp4'
import { BidPrtcpAperWrtPage_Stp5 } from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp5'
import {
  BidPrtcpAperWrtPage_Stp6,
  type BidPrtcpAperAtchFile,
} from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp6'
import { BidPrtcpAperWrtPage_Stp7 } from '@/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp7'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 항목명/형식 그대로.
const MOCK_DETAIL: MockBidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '긴급공고 LDG0097-1',
  prcmNo: '56349',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '031-940-0000',
  ctrtMthdNm: '경쟁입찰', // 요약 배지(입찰방식). 표의 '계약방법'(제한경쟁)과는 다른 항목.
  bidMthdNm: '총액제',
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

// 신청서 하위 탭(설계서 slide97). 일반정보만 구현, 나머지는 스텁.
const TABS: TabItem[] = [
  { value: '일반정보', label: '일반정보' },
  { value: '품목내역', label: '품목내역' },
  { value: '공종및면허', label: '공종 및 면허' },
  { value: '입찰보증금', label: '입찰보증금' },
  { value: '공동수급업체', label: '공동수급업체' },
  { value: '파일첨부', label: '파일첨부' },
  { value: '문의및동의', label: '문의 및 동의' },
]

// 입찰공고 첨부서류(다운로드) — 설계서 slide98 제안요청서/공고문.
const PBANC_FILES: FileDownloadItem[] = [
  { id: 'f1', name: '제안요청서.hwp', size: '786KB' },
  { id: 'f2', name: '공고문.hwp', size: '786KB' },
]

// 파일첨부 탭(Stp6) 초기 업로드 목록 목업 — 설계서 slide107 서류. guid 는 잠정 목업값(UUID형).
// 상태를 호스트가 소유 → 제출(전자서명) 시 fileGuids 로 전달.
const INITIAL_ATTACHED_FILES: BidPrtcpAperAtchFile[] = [
  {
    docNm: '청렴서약서',
    uploaded: {
      guid: '11111111-1111-4111-8111-att1att1att1',
      orgnlFileNm: '청렴서약서.hwp',
      fileSz: 512 * 1024,
    },
  },
  {
    docNm: '법인등기부등본',
    uploaded: {
      guid: '22222222-2222-4222-8222-att2att2att2',
      orgnlFileNm: '법인등기부등본.pdf',
      fileSz: Math.round(1.2 * 1024 * 1024),
    },
  },
]

export function BidPrtcpAperWrtPage() {
  const navigate = useNavigate()
  const detail = (useLocation().state as MockBidPrgrsItem | null) ?? MOCK_DETAIL
  const [tab, setTab] = useState('일반정보')
  const [shortcutOpen, setShortcutOpen] = useState(false) // 플로팅 바로가기 시트
  const [rjctOpen, setRjctOpen] = useState(false) // 입찰참가등록반려 바텀시트(P07)
  const [attachedFiles, setAttachedFiles] = useState<BidPrtcpAperAtchFile[]>(INITIAL_ATTACHED_FILES) // 파일첨부 탭(Stp6) 업로드 목록 — 제출 시 fileGuids
  const rjctRef = useRef<BidPrtcpAplyRjctHandle>(null) // P07 apply 모드 제출 핸들
  const oz = useOzReport() // P07 view 모드 [출력] → OZ 리포트 뷰어(실연동은 OzReportFullPopup 안에서)

  // 일반정보(slide115 dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 나머지 일반정보 목업.
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: '육군 탄약지원사령부' },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '집행유형', value: '제조' },
    { label: '개찰일시', value: '2025-12-23 17:00' },
    { label: '계약방법', value: '제한경쟁' },
    { label: '입찰방법', value: detail.bidMthdNm },
    { label: '총수량/단가제유형', value: '유형' },
    { label: '예산금액', value: '563,200,000 원', type: 'number' },
    { label: '낙찰자결정방법', value: '적격심사제' },
    { label: '적격심사 여부', value: '대상' },
    { label: '낙찰자기준', value: '-' },
  ]

  // 업체내역(slide115 dmt_bzentyInfo)
  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: '1000909' },
    { label: '업체명', value: '업체명' },
    { label: '대표자', value: '김대표' },
    { label: '주민등록번호', value: '800110-1******' },
    { label: '사업자등록번호', value: '12345****' },
    { label: '전화번호', value: '031-940-****' },
    { label: '주소', value: '서울특별시 노량진구 노량진로 18로' },
  ]

  // 반려 버튼 라벨 — 신청 후면 '반려신청조회', 그 전이면 '등록반려'.
  const rjctMode = detail.regRjctYn ? 'view' : 'apply'
  const rjctLabel = detail.regRjctYn ? '반려신청조회' : '등록반려'

  // 탭 = 신청서 하위 스텝. 다음/이전 으로 탭 이동(설계서: 다음→다음 스텝). 마지막 탭(문의및동의)의 다음='신청하기'=전자서명.
  const tabOrder = TABS.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isLastTab = tabIdx === tabOrder.length - 1
  const goTab = (next: string) => {
    setTab(next)
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleNext = () => {
    if (!isLastTab) {
      goTab(tabOrder[tabIdx + 1])
      return
    }
    // 마지막 탭(문의및동의) 다음 = 전자서명(MUI-BD-04-M21). 실제 신청 제출은 전자서명(elsgn) 단계에서
    // bdService.signElsgn 으로 확정된다 — 첨부 GUID 목록(fileGuids)을 그 화면으로 넘긴다.
    const fileGuids = attachedFiles.map((f) => f.uploaded.guid)
    navigate('/bd/elsgn', { state: { detail, aplyType: 'apfr', fileGuids } })
  }
  const handlePrev = () => {
    if (tabIdx > 0) {
      goTab(tabOrder[tabIdx - 1])
      return
    }
    navigate(-1)
  }

  // 탭별 콘텐츠 — 일반정보(M05)는 페이지 인라인, 나머지는 스텝 컴포넌트(M06~M14).
  const renderTab = () => {
    switch (tab) {
      case '품목내역':
        return <BidPrtcpAperWrtPage_Stp2 detail={detail} />
      case '공종및면허':
        return <BidPrtcpAperWrtPage_Stp3 detail={detail} />
      case '입찰보증금':
        return <BidPrtcpAperWrtPage_Stp4 />
      case '공동수급업체':
        return <BidPrtcpAperWrtPage_Stp5 detail={detail} />
      case '파일첨부':
        return (
          <BidPrtcpAperWrtPage_Stp6
            detail={detail}
            files={attachedFiles}
            onFilesChange={setAttachedFiles}
          />
        )
      case '문의및동의':
        return <BidPrtcpAperWrtPage_Stp7 detail={detail} />
      default:
        return (
          <>
            {/* 일반정보 섹션 */}
            <SectionTitle as="h3" topDivider>
              일반정보
            </SectionTitle>
            <div className="px-4 py-4">
              <Table rows={pbancRows} />
            </div>

            {/* 업체내역 섹션 */}
            <SectionTitle as="h3" topDivider>
              업체내역
            </SectionTitle>
            <div className="px-4 py-4">
              <Table rows={bzentyRows} />
            </div>

            {/* 입찰공고 첨부서류 섹션 — 다운로드(읽기) */}
            <SectionTitle
              as="h3"
              topDivider
              info={`총 ${PBANC_FILES.length}건`}
              className="bg-white"
            >
              입찰공고 첨부서류
            </SectionTitle>
            <div className="px-4 py-4">
              {/* 일괄 다운로드 버튼 미노출 — onDownloadAll 미주입(개별 다운로드만) */}
              <FileDownloadList
                files={PBANC_FILES.map((f) => ({
                  ...f,
                  onDownload: () => console.log('[M05] 다운로드', f.name),
                }))}
              />
            </div>
          </>
        )
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/계약방법/신청유형 + 공고번호 + 입찰건명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />

      {/* 진행단계 표시기 — Figma: 배경 #ECF1FA(krds-bg-primary-faint) + px16/py16 */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar
          orientation="horizontal"
          items={STEPS}
          className="bg-transparent"
          expandable={false}
        />
      </div>

      {/* 업무도움 — 접힘 기본 */}
      <Infobox
        title="업무도움"
        items={[
          '입찰참가신청서를 작성하는 화면입니다. 단계별로 정보를 확인하고 다음으로 진행하세요.',
        ]}
      />

      {/* 신청서 하위 탭 — 다음/이전 으로 스텝 이동 */}
      <TabList items={TABS} value={tab} onChange={goTab} />

      {/* 탭별 콘텐츠(일반정보 M05 / 품목내역 M06 / … / 문의및동의 M14) */}
      {renderTab()}

      {/* 하단 액션바 — 이전/다음으로(마지막 탭=신청하기, 설계서 2026-07-02 '전자서명하기→신청하기' 변경) */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '이전', variant: 'secondary', onClick: handlePrev },
            {
              label: isLastTab ? '신청하기' : '다음으로',
              variant: 'primary',
              onClick: handleNext,
            },
          ]}
        />
      </div>

      {/* 플로팅 — 맨위로 + 바로가기(+). 바로가기에 반려 버튼(설계서 slide119) 노출. */}
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

      {/* 입찰참가등록반려(P07) — 바텀시트. footer 는 모드별: apply=제출하기/취소 · view=출력/닫기 */}
      <BottomSheet
        open={rjctOpen}
        onOpenChange={setRjctOpen}
        title="입찰참가등록반려"
        footer={
          rjctMode === 'apply' ? (
            <ButtonGroup
              layout="asymmetric"
              items={[
                { label: '취소', variant: 'secondary', onClick: () => setRjctOpen(false) },
                { label: '제출하기', variant: 'primary', onClick: () => rjctRef.current?.submit() },
              ]}
            />
          ) : (
            <ButtonGroup
              layout="asymmetric"
              items={[
                {
                  label: '출력',
                  variant: 'secondary',
                  // ⚠️ 리포트 코드 미확정(설계서 출력물 코드 확인 후 교체)
                  onClick: () =>
                    oz.open(
                      'MUI-BD-04-P07',
                      { pbancNo: detail.pbancNo },
                      '입찰참가등록반려 신청서',
                    ),
                },
                { label: '닫기', variant: 'primary', onClick: () => setRjctOpen(false) },
              ]}
            />
          )
        }
      >
        <BidPrtcpAplyRjct ref={rjctRef} detail={detail} onSubmitted={() => setRjctOpen(false)} />
      </BottomSheet>
      <OzReportFullPopup {...oz.popupProps} />
    </div>
  )
}
BidPrtcpAperWrtPage.displayName = 'BidPrtcpAperWrtPage'
