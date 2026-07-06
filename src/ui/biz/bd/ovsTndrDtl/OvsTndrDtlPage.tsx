// 국외 입찰서 상세 (MUI-BD-06-M75~M79, 설계서 국외입찰 slide375~379 · 항목설명 slide380~384).
// 진입: 국외 입찰진행 상세 → 입찰서 조회 → /bd/ovs/prgrs/:id/tndr (navigate state = 진행 항목).
// 레퍼런스(국내): BidRsltDtlPage(다중탭 상세 — useCollapsibleHeader + SummaryInfo/StepBar/TabList sticky)
//   + BidPrgsDtlInqPage(FAB 바로가기 시트, 조회/신청 바텀시트는 부모가 컨테이너/footer 소유).
// 탭: 1.일반정보(M75, 이 파일 인라인) / 2.업체정보(M76, Tab2) / 3.입찰참여품목(M77 단가제·M78 총액제, Tab3 분기)
//   / 4.첨부파일(M79, Tab4).
// 바로가기(FAB +): 입찰등록결과조회(M80)·기술평가결과조회(P71)=바텀시트(footer 닫기),
//   투찰취소 → 입찰취소신청서작성(P81)=바텀시트(footer 취소/제출하기, ref 핸들) — 설계서 slide385 이벤트.
import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Icon } from '@/ui/common/base/Icon'
import { SummaryInfo, type SummaryInfoBadge, type SummaryInfoRow } from '@/ui/common/composites/SummaryInfo'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { buildProgressSheet } from '@/ui/common/composites/stepPresets'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Tab2 } from '@/ui/biz/bd/ovsTndrDtl/Tab2'
import { Tab3 } from '@/ui/biz/bd/ovsTndrDtl/Tab3'
import { Tab4 } from '@/ui/biz/bd/ovsTndrDtl/Tab4'
import { OvsBidRegRslt } from '@/ui/biz/bd/ovsTndrDtl/OvsBidRegRslt'
import { OvsTechEvlRslt } from '@/ui/biz/bd/ovsTndrDtl/OvsTechEvlRslt'
import { OvsBidRtrcnAply, type OvsBidRtrcnAplyHandle } from '@/ui/biz/bd/ovsTndrDtl/OvsBidRtrcnAply'

/**
 * 국외 입찰서 상세 공고일반 항목 (설계서 slide380 데이터영역 dm_bscPbancInfo) — 항목명(영문) 설계서 그대로.
 * 국외 입찰진행 상세 → 이 화면 진입 시 navigate state 로 전달되는 항목 타입.
 * // 추후 src/types/bd.ts 통합
 */
export interface OvsTndrDtlItem {
  /** 공고번호 (pbancNo, 7) */
  pbancNo: string
  /** 공고차수 (pbancOd, 2) — 표시는 '공고번호-차수' */
  pbancOd: string
  /** 구매요청번호 (prchsDmndNo, 10) */
  prchsDmndNo: string
  /** 통합참조번호 (intgRfrncNo, 30) */
  intgRfrncNo: string
  /** 사업명 (bizNm, 100) */
  bizNm: string
  /** 입찰방식 (bidMth, 100) — 일반투찰 등 */
  bidMth: string
  /** 계약방법 (ctrtMthdNm, 100) */
  ctrtMthdNm: string
  /** 입찰참가등록마감일시 (regDdlnDt, 14) */
  regDdlnDt: string
  /** 입찰서제출마감일시 (bdngDdlnDt, 14) */
  bdngDdlnDt: string
  /** 개찰일시 (bdopnDt, 14) */
  bdopnDt: string
  /** 환율적용일자 (exchrtAplcnYmd, 8) */
  exchrtAplcnYmd: string
  /** 담당부서 (picDeptNm, 100) */
  picDeptNm: string
  /** 담당자 (picNm, 200) */
  picNm: string
  /** 연락처 (picTlno, 11) */
  picTlno: string

  // ── 설계서 미정의(상세설계 예정) 임시 항목 — BD 진행 상태필드 임시 영문키 관례(사용자 승인)와 동일 ──
  /** 업무구분 (taskSeNm) — 국내 dlt_bidPrgrsList 항목 차용. 요약 배지(국외) */
  taskSeNm?: string
  /** 입찰서 상태 (tndrStatNm) — 국내 임시 항목과 동일. '제출' 일 때 투찰취소 바로가기 노출 */
  tndrStatNm?: '미제출' | '제출' | '완료' | '입찰취소'
  /** 총액제 여부 (alonbsYn) — ⚠️ 설계서 미정의. 입찰참여품목 탭 단가제(M77)/총액제(M78) 분기 구동
   *  (설계서 총액제 데이터영역 접두 dl_alonbs* 차용). 상세설계 확정 시 그 이름으로 교체 */
  alonbsYn?: 'Y' | 'N'
  /** 담당자 휴대전화 (picMblTelno) — ⚠️ 설계서 미정의. 레이아웃(slide375)의 연락처 2행 표시용 임시 항목 */
  picMblTelno?: string
}

// 직접 URL 진입(state 없음) 대비 페이지 fallback 목업 — 설계서 slide375 예시값 그대로.
const MOCK_OVS_TNDR_DETAIL: OvsTndrDtlItem = {
  pbancNo: 'EFD0007',
  pbancOd: '2',
  prchsDmndNo: 'BAD839380-001',
  intgRfrncNo: 'BAD83990EFD',
  bizNm: '500MD부품',
  bidMth: '일반투찰',
  ctrtMthdNm: '일반경쟁',
  regDdlnDt: '2025-03-02 15:00:00',
  bdngDdlnDt: '2025-03-12 15:00:00',
  bdopnDt: '2025-03-13 15:00:00',
  exchrtAplcnYmd: '2025-02-13',
  picDeptNm: '국제부품계약팀',
  picNm: '정영금',
  picTlno: '02-1234-5678',
  picMblTelno: '010-1234-5678',
  taskSeNm: '국외',
  tndrStatNm: '제출',
  alonbsYn: 'N',
}

// ── 탭 (설계서 slide375 신청서 내역 탭: 1.일반정보 / 2.업체정보 / 3.입찰참여품목 / 4.첨부파일) ──
const TABS: TabItem[] = [
  { value: 'general', label: '일반정보' },
  { value: 'bzenty', label: '업체정보' },
  { value: 'item', label: '입찰참여품목' },
  { value: 'attach', label: '첨부파일' },
]

// 단계표시기(StepBar) 5단계 — 입찰서 상세는 '입찰' 단계 (BidRsltDtlPage 동일 패턴).
const STEP_LABELS = ['조달', '입찰', '계약', '이행', '대금청구'] as const
function stepsByStg(prgrsStg: string): StepItem[] {
  const cur = STEP_LABELS.indexOf(prgrsStg as (typeof STEP_LABELS)[number])
  return STEP_LABELS.map((label, i) => ({
    label,
    state: cur < 0 ? 'todo' : i < cur ? 'done' : i === cur ? 'doing' : 'todo',
  }))
}

// ── 탭1 일반정보 (M75) — 공고일반(dm_bscPbancInfo) + 담당자 정보 ──────────────────
function GeneralInfo({ detail }: { detail: OvsTndrDtlItem }) {
  const generalRows: TableRow[] = [
    { label: '공고번호-차수', value: `${detail.pbancNo}-${detail.pbancOd}` },
    { label: '구매요청번호', value: detail.prchsDmndNo },
    { label: '통합참조번호', value: detail.intgRfrncNo },
    { label: '사업명', value: detail.bizNm },
    { label: '입찰방식', value: detail.bidMth },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '입찰참가등록마감일시', value: detail.regDdlnDt },
    { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
    { label: '개찰일자', value: detail.bdopnDt },
    { label: '환율적용일자', value: detail.exchrtAplcnYmd },
  ]
  // 담당자 정보 (slide375 — 담당 부서명/담당자/연락처)
  const contactRows: TableRow[] = [
    { label: '담당 부서명', value: detail.picDeptNm },
    { label: '담당자', value: detail.picNm },
    {
      label: '연락처',
      value: (
        <div className="flex flex-col gap-0.5">
          <span>{detail.picTlno}</span>
          {detail.picMblTelno && <span>{detail.picMblTelno}</span>}
        </div>
      ),
      type: 'combination',
    },
  ]

  return (
    <>
      <Accordion type="multiple" defaultValue={['general', 'contact']} className="w-full">
        <AccordionSection value="general" title="일반정보" borderTop={false}>
          <Table rows={generalRows} />
        </AccordionSection>
        <AccordionSection value="contact" title="담당자 정보">
          <Table rows={contactRows} />
        </AccordionSection>
      </Accordion>
    </>
  )
}

export function OvsTndrDtlPage() {
  const { id } = useParams()
  // 국외 입찰진행에서 넘어온 항목으로 상단(요약)을 그린다. 직접 URL 진입(state 없음)이면 페이지 목업.
  //   id 끝자리 '2' 는 총액제(M78) 데모, 그 외 단가제(M77) — 목업 단계 분기 확인용.
  const state = useLocation().state as OvsTndrDtlItem | null
  const detail: OvsTndrDtlItem =
    state ?? { ...MOCK_OVS_TNDR_DETAIL, alonbsYn: id?.endsWith('2') ? 'Y' : 'N' }

  const [tab, setTab] = useState('general')
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()
  const [shortcutOpen, setShortcutOpen] = useState(false) // 바로가기 시트
  const [regRsltOpen, setRegRsltOpen] = useState(false) // 입찰등록결과조회(M80)
  const [techEvlOpen, setTechEvlOpen] = useState(false) // 기술평가결과조회(P71)
  const [rtrcnOpen, setRtrcnOpen] = useState(false) // 입찰취소신청서작성(P81)
  // P81 은 바텀시트 콘텐츠 전용 — 컨테이너/footer 는 여기(부모)가 소유, 제출은 ref 핸들로 호출.
  const rtrcnRef = useRef<OvsBidRtrcnAplyHandle>(null)

  useEffect(() => {
    console.log('[M75] 국외 입찰서 상세 조회', id) // 추후 API: bdService.getOvsTndrDtl(id) — 입찰서조회, 입찰서품목조회
  }, [id])

  // 요약 헤더 배지 — 입찰서 상태(색) + 업무구분 + 입찰방식 + 계약방법.
  const summaryBadges: SummaryInfoBadge[] = [
    ...(detail.tndrStatNm
      ? [
          {
            key: 'status',
            label: `입찰서 ${detail.tndrStatNm}`,
            type: 'solid' as const,
            color: detail.tndrStatNm === '제출' ? ('blue' as const) : ('green' as const),
          },
        ]
      : []),
    { key: 'task', label: detail.taskSeNm ?? '국외' },
    { key: 'mth', label: detail.bidMth },
    { key: 'ctrt', label: detail.ctrtMthdNm },
  ]
  const summaryRows: SummaryInfoRow[] = [
    { label: '입찰서제출마감일시', value: detail.bdngDdlnDt },
    { label: '개찰일시', value: detail.bdopnDt },
  ]
  const steps = stepsByStg('입찰')

  // 바로가기(플로팅 +) — 등록결과/기술평가 조회 + 투찰취소(제출 상태일 때, 설계서 slide385 이벤트).
  type Shortcut = { id: string; label: string; variant: 'primary' | 'secondary' | 'tertiary' }
  const shortcutItems: Shortcut[] = [
    { id: 'regRslt', label: '입찰등록결과 조회', variant: 'primary' },
    { id: 'techEvl', label: '기술평가결과 조회', variant: 'primary' },
  ]
  if (detail.tndrStatNm === '제출') {
    shortcutItems.push({ id: 'rtrcn', label: '투찰취소 (입찰취소 신청서 작성)', variant: 'secondary' })
  }

  const handleShortcut = (key: string) => {
    setShortcutOpen(false)
    switch (key) {
      case 'regRslt':
        setRegRsltOpen(true)
        break
      case 'techEvl':
        setTechEvlOpen(true)
        break
      case 'rtrcn':
        setRtrcnOpen(true)
        break
      default:
        console.log('[M75] 바로가기', key)
    }
  }

  const renderTabContent = (current: string) => {
    switch (current) {
      case 'general':
        return <GeneralInfo detail={detail} />
      case 'bzenty':
        return <Tab2 />
      case 'item':
        return <Tab3 alonbsYn={detail.alonbsYn ?? 'N'} />
      case 'attach':
        return <Tab4 />
      default:
        return null
    }
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약정보/스텝 축소. */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={summaryBadges}
          subtitle={`통합참조번호 ${detail.intgRfrncNo} / 공고번호 ${detail.pbancNo}-${detail.pbancOd}`}
          title={detail.bizNm}
          actions={
            <button
              type="button"
              aria-label="출력"
              onClick={() => console.log('[M75] 출력')}
              className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
            >
              <Icon name="Print" size={24} aria-hidden />
            </button>
          }
          rows={summaryRows}
        />

        {/* 진행 단계 — 스크롤 축소 시 함께 접힘 */}
        <div
          aria-hidden={collapsed}
          className={`grid transition-all duration-200 ease-out motion-reduce:transition-none
            ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
            `}
        >
          <div className="overflow-hidden">
            <div className="bg-krds-bg-primary-faint px-4 py-4">
              <StepBar
                orientation="horizontal"
                items={steps}
                sheetItems={buildProgressSheet('입찰')}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* 탭 */}
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

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘 지탱 위해 최소 높이 확보(진동 방지). */}
      <div className="min-h-[100dvh]">{renderTabContent(tab)}</div>

      {/* 플로팅 — 맨위로 + 바로가기(+) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={scrollToTop}
        onPlus={() => setShortcutOpen(true)}
        plusLabel="바로가기"
      />

      {/* 바로가기 시트 — 조회/취소 세로 버튼 리스트 */}
      <BottomSheet open={shortcutOpen} onOpenChange={setShortcutOpen} title="바로가기">
        <ButtonGroup
          layout="vertical"
          items={shortcutItems.map((it) => ({
            label: it.label,
            variant: it.variant,
            onClick: () => handleShortcut(it.id),
          }))}
        />
      </BottomSheet>

      {/* 입찰등록결과조회(M80) — 읽기전용 조회 바텀시트(footer=닫기, 부모 소유) */}
      <BottomSheet
        open={regRsltOpen}
        onOpenChange={setRegRsltOpen}
        title="입찰등록결과조회"
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setRegRsltOpen(false) }]}
          />
        }
      >
        <OvsBidRegRslt detail={detail} />
      </BottomSheet>

      {/* 기술평가결과조회(P71) — 읽기전용 조회 바텀시트(footer=닫기, 부모 소유) */}
      <BottomSheet
        open={techEvlOpen}
        onOpenChange={setTechEvlOpen}
        title="기술평가결과조회"
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setTechEvlOpen(false) }]}
          />
        }
      >
        <OvsTechEvlRslt detail={detail} />
      </BottomSheet>

      {/* 입찰취소신청서작성(P81) — 바텀시트(컨테이너/footer 부모 소유, 제출은 ref 핸들 → 확인 모달) */}
      <BottomSheet
        open={rtrcnOpen}
        onOpenChange={setRtrcnOpen}
        title="입찰취소 신청서"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setRtrcnOpen(false) },
              { label: '제출하기', variant: 'primary', onClick: () => rtrcnRef.current?.submit() },
            ]}
          />
        }
      >
        <OvsBidRtrcnAply ref={rtrcnRef} detail={detail} onSubmitted={() => setRtrcnOpen(false)} />
      </BottomSheet>
    </div>
  )
}
OvsTndrDtlPage.displayName = 'OvsTndrDtlPage'
