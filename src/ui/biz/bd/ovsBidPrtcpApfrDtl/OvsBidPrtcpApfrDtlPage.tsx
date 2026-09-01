// 국외 입찰참가신청서 상세 - 페이지 + 탭1 일반정보 (MUI-BD-04-M78(컨테이너) · 탭1 일반정보 T76(구 M78 탭 — v1.83 재편), 설계서 slide349·354~357).
// 접속: 홈 > 입찰 진행 > (국외) 입찰참가신청서 상세. 라우트 /bd/ovsBidPrtcpApfrDtl.
// 레퍼런스: 국내 입찰공고 상세 BidPbancDtlPage(요약+스텝바+탭 sticky 패턴) + 입찰진행 상세 BidPrgsDtlInqPage(FAB 바로가기 시트).
// 구성: 요약정보(SummaryInfo) + 진행단계(StepBar, 서약서→신청서→서명→제출) + 탭 4개(일반정보/업체정보/입찰 보증금/첨부파일)
//   + 탭 콘텐츠(renderTabContent switch, 탭2~4는 별도 파일) + 플로팅(맨위로 / + → 바로가기)
//   + 입찰참가신청서취소(P82)·사업별입찰등록결과조회(P83) 바텀시트(컨테이너/footer 는 페이지 소유).
// 데이터: 목업(항목명은 설계서 dm_bscPbancInfo·dm_sbtInfo·dm_splyInfo·dl_bizList·dl_bizExmptnList·dl_docList 그대로).
//   국외 입찰진행 상세에서 navigate state 로 일부 식별값이 넘어오면 목업 위에 병합 — 직접 URL 진입에도 완전 렌더.
// ⚠️ 설계서 미정의 임시 항목(상세설계 예정, BD 관례대로 임시 영문키+주석): pbancNm(공고명 표기),
//   pbancTpcd(공고유형 배지 — 국내 dlt_bidPbancIntgList 항목 재사용), grnteExmptnSe(입찰보증금 구분 라디오 값).
import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsBidPrtcpApfrDtlPage_Tab2 } from '@/ui/biz/bd/ovsBidPrtcpApfrDtl/Tab2'
import { OvsBidPrtcpApfrDtlPage_Tab3 } from '@/ui/biz/bd/ovsBidPrtcpApfrDtl/Tab3'
import { OvsBidPrtcpApfrDtlPage_Tab4 } from '@/ui/biz/bd/ovsBidPrtcpApfrDtl/Tab4'
import {
  OvsBidPrtcpRtrcnAply,
  type OvsBidPrtcpRtrcnAplyHandle,
} from '@/ui/biz/bd/ovsBidPrtcpApfrDtl/OvsBidPrtcpRtrcnAply'
import { OvsBidRegRsltByBiz } from '@/ui/biz/bd/ovsBidPrtcpApfrDtl/OvsBidRegRsltByBiz'
import type {
  MockOvsBidBizExmptnItem,
  MockOvsBidBizItem,
  MockOvsBidPrtcpApfrDetail,
  MockOvsRtrcnTarget,
  MockOvsSbtInfo,
  MockOvsSplyInfo,
} from '@/types/mock/bd'

// ── 타입 (설계서 데이터영역 항목명 그대로) — 공유 도메인 타입은 @/types/bd ──────────────

/**
 * 첨부서류 (dl_docList, slide355)
 * ⚠️ 작성 화면(ovsBidPrtcpAply)의 동명 OvsAtchDocItem 과 필드가 다름(그쪽은 목록 key 용 id 보유)
 *    — 설계서 기반 이름이라 개명하지 않고 화면별로 각자 유지.
 */
export interface OvsAtchDocItem {
  atchDocNm: string // 첨부서류명 (고유 — 목록 key)
  atchFileNm: string // 첨부파일명
  fileSz: string // 파일크기
}

// ── fallback 목업 (직접 URL 진입 대비 — 설계서 slide349·357 예시값 형식 그대로) ──────────

export const MOCK_OVS_BID_PRTCP_APFR_DTL: MockOvsBidPrtcpApfrDetail = {
  pbancNo: 'EFD0007',
  pbancOd: '25',
  bdopnYmd: '2025-12-24 10:30',
  bidGrnteAmt: 511.18,
  intgRfrncNo: 'BAD83990EFD',
  pbancNm: 'MD부품 국외경쟁입찰',
  pbancTpcd: '긴급공고',
}

export const MOCK_OVS_SBT_INFO: MockOvsSbtInfo = {
  sbtBzentyCd: '7001',
  sbtBzentyNm: 'FA무역대리점',
  sbtRprsvNm: '홍길동',
  sbtTlno: '02-1234-5678',
  sbtFxno: '02-2345-6789',
  sbtBzmnNo: '123-45-67890',
  sbtAddr: '서울특별시 종로구 세종대로 209',
}

export const MOCK_OVS_SPLY_INFO: MockOvsSplyInfo = {
  splyBzentyCd: '7004',
  splyBzentyNm: 'FB해외업체',
  splyRprsvNm: '홍길동',
  splyEmlAddr: 'bid@fb-overseas.com',
  splyTlno: '02-1234-5678',
  splyFxno: '02-2345-6789',
  splyBzmnNo: '123-45-67890', // 사업자등록번호 또는 DUNS NUM
  splyAddr: '서울특별시 종로구 새문안로 68',
}

// 입찰참가사업 및 입찰보증금 — 보증금비면제(dl_bizList). 금액은 달러(소수 2자리).
export const MOCK_OVS_BIZ_LIST: MockOvsBidBizItem[] = [
  {
    prchsDmndNo: 'BAD839380-001',
    bizNm: 'MD부품 수리부속(엔진계통)',
    bdngItemQty: 6,
    bdngTccrAmt: 1250000.0,
    bidGrnteAmt: 62500.0,
    chckBidGrnteAmt: 62500.0,
    grntePayMth: '보증보험',
    wtgrNo: '1234567890abcedfg',
    grnteInstNm: '서울보증보험',
    grntePyslDocNo: 'File.pdf',
  },
  {
    prchsDmndNo: 'BAD839380-002',
    bizNm: 'MD부품 수리부속(유압계통)',
    bdngItemQty: 3,
    bdngTccrAmt: 480000.0,
    bidGrnteAmt: 24000.0,
    chckBidGrnteAmt: 24000.0,
    grntePayMth: '전자보증서',
    wtgrNo: 'EG-2026-0012345',
    grnteInstNm: '한국무역보험공사',
    grntePyslDocNo: 'File.pdf',
  },
  {
    prchsDmndNo: 'BAD839380-003',
    bizNm: 'MD부품 수리부속(전기계통)',
    bdngItemQty: 12,
    bdngTccrAmt: 2730000.0,
    bidGrnteAmt: 136500.0,
    chckBidGrnteAmt: 136500.0,
    grntePayMth: '보증보험',
    wtgrNo: '1015375183999',
    grnteInstNm: '서울보증보험',
    grntePyslDocNo: 'File.pdf',
  },
]

// 입찰참가사업 및 입찰보증금 — 보증금면제(dl_bizExmptnList).
export const MOCK_OVS_BIZ_EXMPTN_LIST: MockOvsBidBizExmptnItem[] = [
  {
    prchsDmndNo: 'BAD839380-004',
    bizNm: 'MD부품 수리부속(기체계통)',
    bdngItemQty: 2,
    bdngTccrAmt: 310000.0,
    bidGrnteAmt: 15500.0,
    chckBidGrnteAmt: 15500.0,
    gurnAgreDocNo: 'File.pdf',
    giveWrtprmDocNo: 'File.pdf',
  },
  {
    prchsDmndNo: 'BAD839380-005',
    bizNm: 'MD부품 수리부속(무장계통)',
    bdngItemQty: 5,
    bdngTccrAmt: 920000.0,
    bidGrnteAmt: 46000.0,
    chckBidGrnteAmt: 46000.0,
    gurnAgreDocNo: 'File.pdf',
    giveWrtprmDocNo: 'File.pdf',
  },
]

// 첨부서류(dl_docList) — 설계서 slide352 구비서류 그대로.
export const MOCK_OVS_DOC_LIST: OvsAtchDocItem[] = [
  { atchDocNm: '해외업체위임장', atchFileNm: '해외업체위임장.hwp', fileSz: '786KB' },
  { atchDocNm: '공급자증명서', atchFileNm: '공급자증명서.hwp', fileSz: '412KB' },
  { atchDocNm: '제작사증명서', atchFileNm: '제작사증명서.hwp', fileSz: '534KB' },
  { atchDocNm: '기타 공고요구서류', atchFileNm: '계약특수조건_동의서.hwp', fileSz: '1.2MB' },
]

// ── 페이지 상단 구성 ──────────────────────────────────────────────────────────

// 신청서 전체 진행단계(slide349 '신청서 전체 진행단계 표시') — 제출된 신청서 상세이므로 제출 단계 진행중.
const STEPS: StepItem[] = [
  { label: '서약서', state: 'done' },
  { label: '신청서', state: 'done' },
  { label: '서명', state: 'done' },
  { label: '제출', state: 'doing' },
]

// 신청서 내역 탭(M78~M81)
const TABS: TabItem[] = [
  { value: 'general', label: '1. 일반정보' },
  { value: 'bzenty', label: '2. 업체정보' },
  { value: 'grnte', label: '3. 입찰 보증금' },
  { value: 'atch', label: '4. 첨부파일' },
]

// 달러 금액 표기 — 설계서 '000,000,000,000.00' 형식(소수 2자리).
const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ── 탭1 일반정보 (M78) — 페이지 파일 내 로컬 콘텐츠 ─────────────────────────────
function Tab1({ detail, sbtInfo }: { detail: MockOvsBidPrtcpApfrDetail; sbtInfo: MockOvsSbtInfo }) {
  // 공고일반(dm_bscPbancInfo)
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: `${detail.pbancNo}-${detail.pbancOd}` },
    { label: '개찰일시', value: detail.bdopnYmd },
    { label: '입찰보증금 총액', value: `US$ ${fmtUsd(detail.bidGrnteAmt)}`, type: 'number' },
    // v0.87 검토93 — 공지사항 항목 추가(값은 설계서 형식 목업)
    { label: '공지사항', value: '입찰서 제출 전 공고문 및 입찰유의서를 반드시 확인하시기 바랍니다.' },
  ]
  // 신청업체(dm_sbtInfo)
  const sbtRows: TableRow[] = [
    { label: '업체코드', value: sbtInfo.sbtBzentyCd },
    { label: '업체명', value: sbtInfo.sbtBzentyNm },
    { label: '대표자', value: sbtInfo.sbtRprsvNm },
    { label: '전화번호', value: sbtInfo.sbtTlno },
    { label: '팩스', value: sbtInfo.sbtFxno },
    { label: '사업자등록번호', value: sbtInfo.sbtBzmnNo },
    { label: '주소', value: sbtInfo.sbtAddr },
  ]
  return (
    <>
      <Accordion type="multiple" defaultValue={['pbanc', 'sbt']} className="w-full">
        {/* 섹션명 '공고일반'→'일반정보'(사용자 지시 2026-08-26) — 데이터영역은 dm_bscPbancInfo 그대로 */}
        <AccordionSection value="pbanc" title="일반정보" borderTop={false}>
          <Table rows={pbancRows} />
        </AccordionSection>
        <AccordionSection value="sbt" title="신청업체">
          <Table rows={sbtRows} />
        </AccordionSection>
      </Accordion>
      {/* 서약문(slide349) — 입찰보증금 납부 서약. 색/배경은 토큰(OathBox 와 동일 스타일). */}
      <div className="px-4 pb-6 pt-2">
        <div className="flex flex-col items-center justify-center gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8 text-center">
          <p className="w-full text-[17px] font-bold leading-normal text-krds-text-info">
            본인은 낙찰 후 계약을 체결하지 아니하거나 서류제출 기피 등 귀사로부터 상기
            입찰보증금을 한도로 해당품목 입찰보증금액의 납입 요청 시 이견 없이 30일 이내 납부할
            것을 서약합니다.
          </p>
        </div>
      </div>
    </>
  )
}

// ── 페이지 ───────────────────────────────────────────────────────────────────
export function OvsBidPrtcpApfrDtlPage() {
  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // + 버튼 → 바로가기 시트
  const [regRsltOpen, setRegRsltOpen] = useState(false) // P83 사업별입찰등록결과조회
  // P82 입찰참가신청서취소 — 대상 사업 목록(개별 1건 / 전체). null 이면 닫힘.
  const [rtrcnTargets, setRtrcnTargets] = useState<MockOvsRtrcnTarget[] | null>(null)
  const rtrcnRef = useRef<OvsBidPrtcpRtrcnAplyHandle>(null)

  // 국외 입찰진행 상세에서 navigate(state)로 넘어온 식별값을 목업 위에 병합.
  //   다른 화면(타 유닛) 아이템 타입과 필드가 다를 수 있어 누락 필드는 페이지 목업으로 보완 —
  //   직접 URL 진입/새로고침(state 없음)에도 완전히 그려진다.
  const stateItem = useLocation().state as Partial<MockOvsBidPrtcpApfrDetail> | null
  const detail: MockOvsBidPrtcpApfrDetail = { ...MOCK_OVS_BID_PRTCP_APFR_DTL, ...stateItem }
  const sbtInfo = MOCK_OVS_SBT_INFO
  const splyInfo = MOCK_OVS_SPLY_INFO

  // 선택 입찰취소(탭3 카드 다중 선택) → P82 (선택 건들)
  const handleRtrcnSelected = (targets: MockOvsRtrcnTarget[]) => setRtrcnTargets(targets)
  // 전체 입찰취소(탭3 하단 고정 버튼) → P82 (전체 건) — 면제/비면제 목록 합산.
  const handleRtrcnAll = () => {
    setRtrcnTargets([
      ...MOCK_OVS_BIZ_LIST.map((b) => ({
        prchsDmndNo: b.prchsDmndNo,
        bizNm: b.bizNm,
        rtrcnItemQty: b.bdngItemQty,
      })),
      ...MOCK_OVS_BIZ_EXMPTN_LIST.map((b) => ({
        prchsDmndNo: b.prchsDmndNo,
        bizNm: b.bizNm,
        rtrcnItemQty: b.bdngItemQty,
      })),
    ])
  }

  const renderTabContent = (current: string) => {
    switch (current) {
      case 'general':
        return <Tab1 detail={detail} sbtInfo={sbtInfo} />
      case 'bzenty':
        return <OvsBidPrtcpApfrDtlPage_Tab2 detail={detail} splyInfo={splyInfo} />
      case 'grnte':
        return (
          <OvsBidPrtcpApfrDtlPage_Tab3
            bizList={MOCK_OVS_BIZ_LIST}
            bizExmptnList={MOCK_OVS_BIZ_EXMPTN_LIST}
            onRtrcn={handleRtrcnSelected}
            onRtrcnAll={handleRtrcnAll}
          />
        )
      case 'atch':
        return <OvsBidPrtcpApfrDtlPage_Tab4 docList={MOCK_OVS_DOC_LIST} />
      default:
        return null
    }
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정, 스크롤 시 요약/스텝 축소 (BidPbancDtlPage 패턴) */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={[
            ...(detail.pbancTpcd ? [{ key: 'tpcd', label: detail.pbancTpcd, color: 'red' as const }] : []),
            { key: 'ovs', label: '국외' },
          ]}
          subtitle={`통합참조번호 ${detail.intgRfrncNo} / 공고번호 ${detail.pbancNo}-${detail.pbancOd}`}
          title={detail.pbancNm}
          rows={[
            { label: '개찰일시', value: detail.bdopnYmd },
            { label: '입찰보증금 총액', value: `US$ ${fmtUsd(detail.bidGrnteAmt)}` },
          ]}
        />

        {/* 신청서 전체 진행단계 — 스크롤 축소 시 함께 접힘 */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
            </div>
          </div>
        </div>

        {/* 신청서 내역 탭 */}
        <div className="px-4">
          <TabList
            value={tab}
            onChange={(next) => {
              setTab(next)
              goToContentTop()
            }}
            items={TABS}
          />
        </div>
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱하도록 min-h 확보(BidPbancDtlPage 참고).
          pt-4: 탭과 콘텐츠 사이 상단 여백 — 전 탭 공통(사용자 지시 2026-08-26). */}
      <div className="min-h-[100dvh] pt-4">{renderTabContent(tab)}</div>

      {/* 플로팅 — 맨위로 + 바로가기(+) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 시트 — 입찰등록결과 조회(P83).
          전체 입찰참가취소는 탭3 하단 고정 [전체 입찰취소]로 이관(사용자 지시 2026-08-26 — 플로팅에서 삭제) */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={[
            {
              label: '입찰등록결과 조회',
              variant: 'primary',
              onClick: () => {
                setShortcutOpen(false)
                setRegRsltOpen(true)
              },
            },
          ]}
        />
      </BottomSheet>

      {/* 입찰참가신청서취소(P82) — 바텀시트(컨테이너/footer 페이지 소유, 콘텐츠는 ref 핸들) */}
      <BottomSheet
        open={rtrcnTargets !== null}
        onOpenChange={(open) => {
          if (!open) setRtrcnTargets(null)
        }}
        title="입찰참가신청서 취소"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setRtrcnTargets(null) },
              { label: '제출하기', variant: 'primary', onClick: () => rtrcnRef.current?.submit() },
            ]}
          />
        }
      >
        {rtrcnTargets && (
          <OvsBidPrtcpRtrcnAply
            ref={rtrcnRef}
            detail={detail}
            sbtInfo={sbtInfo}
            splyInfo={splyInfo}
            targets={rtrcnTargets}
            onSubmitted={() => setRtrcnTargets(null)}
          />
        )}
      </BottomSheet>

      {/* 사업별입찰등록결과조회(P83) — 읽기전용 조회 바텀시트(footer=닫기) */}
      <BottomSheet
        open={regRsltOpen}
        onOpenChange={setRegRsltOpen}
        title="사업별 입찰등록결과 조회"
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setRegRsltOpen(false) }]}
          />
        }
      >
        <OvsBidRegRsltByBiz detail={detail} sbtInfo={sbtInfo} splyInfo={splyInfo} />
      </BottomSheet>
    </div>
  )
}
OvsBidPrtcpApfrDtlPage.displayName = 'OvsBidPrtcpApfrDtlPage'
