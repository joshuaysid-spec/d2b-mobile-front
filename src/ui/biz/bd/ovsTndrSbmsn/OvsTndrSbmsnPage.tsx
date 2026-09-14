// 국외 입찰서제출 - 스탭1 일반정보 (MUI-BD-06-M71 컨테이너 · 스탭1 일반정보 T71(구 M71 탭 — v1.83 재편), 설계서 v1.88 slide476).
// 일반정보 탭 = 일반정보 → 담당자 정보 아코디언(설계서 순서 — 2026-08-26 사용자 지시로 순서 교체 + 아코디언 전환).
// 접속: 홈 > 입찰 진행 > 입찰서제출 (/bd/ovsTndrSbmsn).
// 레이아웃(국내 TndrWrtPage·BidPrtcpAperWrtPage 패턴 그대로): 요약(SummaryInfo) → 진행단계(StepBar)
//   → 업무도움(Infobox) → 스탭 탭(TabList: 1.일반정보 / 2.입찰참여품목 / 3.첨부파일) → 탭 콘텐츠
//   → 하단 액션바(이전/다음으로, 마지막 탭=신청하기) + 맨위로 FAB.
// 스탭1(일반정보)은 페이지 인라인, 스탭2(M72/M73)·스탭3(M74)은 Stp2/Stp3 컴포넌트.
// 마지막 탭 [신청하기] → 신청완료(M08, 기존 aplyCmptn 재사용).
//   (설계서 slide369 2026-07-02 화면 수정: '전자서명하기' → '신청하기' — 전자서명 단계 없이 신청완료로 이동)
// 행정정보 공동이용 사전동의서 영역(2026-09-14, PC 개정 메모 정정분 — 국외 입찰서에만, 국내 입찰서 미적용):
//   마지막 탭(첨부파일) 하단에 동의 목록(AgreementList, [필수]) + 동의서 상세 바텀시트(본문 + 동의 선택, 페이지 소유).
//   [신청하기] 시 동의 필수 검증(페이지 소형 RHF 폼 ovsTndrAgreSchema) — 미동의면 차단 + 목록 아래 에러 + 포커스.
//   본문 문구 미확보 → ADM_INFO_AGRE_BODY 자리 문구, 수령 시 교체.
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'

import { focusField } from '@/utils/focusField'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { Infobox } from '@/ui/common/composites/Infobox'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { OvsTndrSbmsnPage_Stp2 } from '@/ui/biz/bd/ovsTndrSbmsn/Stp2'
import { OvsTndrSbmsnPage_Stp3 } from '@/ui/biz/bd/ovsTndrSbmsn/Stp3'
import {
  ADM_INFO_AGRE_ID,
  ovsTndrAgreSchema,
  type OvsTndrAgreValues,
} from '@/ui/biz/bd/ovsTndrSbmsn/OvsTndrSbmsn.schema'
import type { MockBidPrgrsItem, MockOvsTndrSbmsnDetail } from '@/types/mock/bd'

// 행정정보 공동이용 사전동의서 — 국외 입찰서 전용(국내 미적용). ⚠️ 본문 문구 미확보: 문구 수령 시 이 상수만 교체.
const ADM_INFO_AGRE_TITLE = '행정정보 공동이용 사전동의서'
const ADM_INFO_AGRE_BODY = [
  '행정정보 공동이용 사전동의서 본문은 문구 확보 후 변경 예정입니다.',
  '(PC 개정분 사전동의서 영역 문구를 수령하면 이 안내를 원문으로 교체합니다.)',
]
const AGREE_OPTIONS = [
  { value: '동의안함', label: '동의안함' },
  { value: '동의함', label: '동의함' },
]

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 slide366 예시값 그대로.
const MOCK_OVS_TNDR_DETAIL: MockOvsTndrSbmsnDetail = {
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
  bidMthdNm: '단가제',
}

// 진행단계(설계서 slide366): 신청서 → 서명 → 제출. 진입은 신청서 작성 단계.
const STEPS: StepItem[] = [
  { label: '신청서', state: 'doing' },
  { label: '서명', state: 'todo' },
  { label: '제출', state: 'todo' },
]

// 입찰서 스탭 탭(설계서 slide366): 1. 일반정보 / 2. 입찰참여품목 / 3. 첨부파일.
const TABS: TabItem[] = [
  { value: '일반정보', label: '1. 일반정보' },
  { value: '입찰참여품목', label: '2. 입찰참여품목' },
  { value: '첨부파일', label: '3. 첨부파일' },
]

export function OvsTndrSbmsnPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // 목록(국외 입찰진행)에서 넘어온 항목으로 상단을 그린다 — 넘어온 항목에 없는 항목(담당자 등)은 목업 보완.
  // 직접 URL 진입(새로고침) 시에도 화면이 완전히 그려지도록 목업과 병합.
  //   rNum(진행 항목 번호)은 URL 미포함 — 진입 화면이 state 로 함께 넘긴다(신청완료 요약 구동용).
  const stateItem = (location.state ?? null) as (Partial<MockOvsTndrSbmsnDetail> & { rNum?: string }) | null
  // 테스트용 입찰방법 오버라이드 — ?bidMthdNm=총액제 로 직접 진입해 M73(총액제) 확인 가능.
  const bidMthdParam = new URLSearchParams(location.search).get('bidMthdNm')
  const detail: MockOvsTndrSbmsnDetail = {
    ...MOCK_OVS_TNDR_DETAIL,
    ...stateItem,
    ...(bidMthdParam === '단가제' || bidMthdParam === '총액제'
      ? { bidMthdNm: bidMthdParam }
      : {}),
  }

  const [tab, setTab] = useState('일반정보')

  // ── 사전동의서 동의 폼(페이지 소유) — [신청하기] 때 필수 동의 검증. AgreementList 는 RHF ref 없음 → focusField. ──
  const agreeForm = useForm<OvsTndrAgreValues>({
    resolver: zodResolver(ovsTndrAgreSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange', // 체크 즉시 에러 해제
    shouldFocusError: false,
    defaultValues: { agreed: [] },
  })
  const agreeError = agreeForm.formState.errors.agreed?.message
  const [agreeOpen, setAgreeOpen] = useState(false) // 동의서 상세 바텀시트
  const [agreeChoice, setAgreeChoice] = useState('동의안함') // 시트 내 동의 선택(기본 동의안함)
  const openAgreement = () => {
    // 목록에 저장된 동의 상태를 시트 라디오 초기값으로 반영(국내 입찰서 약관동의 패턴).
    setAgreeChoice(agreeForm.getValues('agreed').includes(ADM_INFO_AGRE_ID) ? '동의함' : '동의안함')
    setAgreeOpen(true)
    console.log('[M71] 사전동의서 열람', ADM_INFO_AGRE_ID) // 추후 API: bdService.selectAgreement
  }
  // 저장 후 닫기 — '동의함'일 때만 활성(국외 서약서 P03 패턴). 목록 체크 반영 + 재검증으로 에러 해제.
  const saveAgreement = () => {
    const prev = agreeForm.getValues('agreed')
    agreeForm.setValue('agreed', [...new Set([...prev, ADM_INFO_AGRE_ID])], { shouldValidate: true })
    setAgreeOpen(false)
    console.log('[M71] 사전동의서 저장(동의)', ADM_INFO_AGRE_ID) // 추후 API: bdService.saveAgreement
  }

  // 일반정보(설계서 slide476 dm_bscPbancInfo) — 항목명/형식 설계서 그대로.
  const pbancRows: TableRow[] = [
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

  // 담당자 정보(설계서 slide476) — 담당 부서명/담당자/연락처(dm_bscPbancInfo picDeptNm·picNm·picTlno).
  const picRows: TableRow[] = [
    { label: '담당 부서명', value: detail.picDeptNm },
    { label: '담당자', value: detail.picNm },
    { label: '연락처', value: detail.picTlno },
  ]

  // 탭 = 하위 스텝. 다음/이전으로 탭 이동, 마지막 탭(첨부파일)의 [신청하기] = 신청완료(M08).
  const tabOrder = TABS.map((t) => t.value)
  const tabIdx = tabOrder.indexOf(tab)
  const isFirstTab = tabIdx === 0
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
    // 신청하기 — 사전동의서 동의 검증 통과 시에만 제출. 실패 시 목록 아래 에러 + 목록으로 포커스.
    void agreeForm.handleSubmit(submitTndr, () => focusField('field-admInfoAgre'))()
  }
  const submitTndr = () => {
    // 신청하기(설계서 slide369·373 투찰 클릭) — 입찰 작성내역 암호화 저장(모의입찰 상태면 모의투찰).
    console.log('[M74] 국외 입찰서 제출(투찰)', detail.pbancNo, detail.pbancOd)
    // 추후 API: bdService.insertOvsTndrSbmsn(pbancNo, pbancOd, ...)
    // 신청완료(M08) 요약 헤더 구동용 — 기존 AplyCmptnPage(MockBidPrgrsItem 기반) 재사용을 위한 매핑.
    const aplyDetail: MockBidPrgrsItem = {
      rNum: stateItem?.rNum ?? '0',
      taskSeNm: '국외',
      pbancNo: `${detail.pbancNo}-${detail.pbancOd}`,
      prcmNo: detail.prchsDmndNo,
      bidNm: detail.bizNm,
      rfrncNo: detail.intgRfrncNo,
      orderInstTelno: detail.picTlno,
      ctrtMthdNm: detail.ctrtMthdNm,
      bidMthdNm: detail.bidMthdNm ?? '단가제',
      bidClrsDt: detail.regDdlnDt,
      tndrSbmsnDdlnDt: detail.bdngDdlnDt,
      bzentySeNm: '대표',
      bfhdSrng: false,
      bidPrgrsApfr: true,
      tndr: true,
      techEvl: false,
      prdcpDcmntSbms: false,
      tndrStatNm: '제출',
    }
    navigate('/bd/aplyCmptn', {
      state: {
        detail: aplyDetail,
        aplyType: 'tndr',
        rcptNo: '0000 000 0000',
        rcptDt: '2025-03-12 12:30',
      },
    })
  }
  const handlePrev = () => {
    if (!isFirstTab) {
      goTab(tabOrder[tabIdx - 1])
      return
    }
    navigate(-1) // 첫 탭 = 이전(작성 중단, 이전 화면으로)
  }

  // 탭별 콘텐츠 — 스탭1(M71)은 인라인, 스탭2(M72/M73)·스탭3(M74)은 컴포넌트.
  const renderTab = () => {
    switch (tab) {
      case '입찰참여품목':
        return <OvsTndrSbmsnPage_Stp2 detail={detail} />
      case '첨부파일':
        return <OvsTndrSbmsnPage_Stp3 detail={detail} />
      default:
        return (
          <>
            {/* 탭명 반복 타이틀 없음(전 탭 공통 규칙) — 공지사항 영역은 설계서상 "있는 경우 표시" 조건부. 목업 생략. */}

            {/* 일반정보 → 담당자 정보 아코디언(설계서 slide476 순서) — 국외 입찰서 상세(M75) 일반정보 탭과 동일 패턴 */}
            <Accordion type="multiple" defaultValue={['general', 'contact']} className="w-full">
              <AccordionSection value="general" title="일반정보" borderTop={false}>
                <Table rows={pbancRows} />
              </AccordionSection>
              <AccordionSection value="contact" title="담당자 정보">
                <Table rows={picRows} />
              </AccordionSection>
            </Accordion>
          </>
        )
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/계약방법 배지 + 통합참조번호·공고번호 + 사업명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: '국외' },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={`통합참조번호 ${detail.intgRfrncNo} / 공고번호 ${detail.pbancNo}-${detail.pbancOd}`}
        title={detail.bizNm}
      />

      {/* 진행단계 표시기 — 신청서 → 서명 → 제출 (설계서 slide366) */}
      <div className="bg-krds-bg-primary-faint px-4 py-4">
        <StepBar orientation="horizontal" items={STEPS} className="bg-transparent" />
      </div>

      {/* 업무도움 — 접힘 기본 */}
      <Infobox
        title="업무도움"
        items={[
          '일반경쟁 공고에 참가신청한 품목을 조회하고 각 품목별로 금액 제출 및 필요한 문서를 제출하는 화면입니다.',
        ]}
      />

      {/* 입찰서 스탭 탭 — 다음/이전으로 스텝 이동 */}
      <TabList items={TABS} value={tab} onChange={goTab} />

      {/* 탭별 콘텐츠(M71 일반정보 / M72·M73 입찰참여품목 / M74 첨부파일) */}
      {renderTab()}

      {/* 행정정보 공동이용 사전동의서 영역 — 마지막 탭(첨부파일) 하단, [신청하기] 전 필수 동의(국외 입찰서 전용).
          목록 행 클릭 → 동의서 상세 바텀시트(페이지 소유). 에러는 목록 아래 + 앵커 블록 포커스. */}
      {isLastTab && (
        <>
          <SectionTitle as="h3" topDivider>
            동의
          </SectionTitle>
          <div id="field-admInfoAgre" className="m-4 flex flex-col gap-krds-3">
            <Controller
              control={agreeForm.control}
              name="agreed"
              render={({ field }) => (
                <AgreementList
                  checkAll={false}
                  items={[{ id: ADM_INFO_AGRE_ID, title: ADM_INFO_AGRE_TITLE, requirement: 'required' }]}
                  checked={field.value}
                  onToggle={(id, on) =>
                    field.onChange(
                      on ? [...new Set([...field.value, id])] : field.value.filter((v) => v !== id),
                    )
                  }
                  onView={openAgreement}
                />
              )}
            />
            {agreeError && <InputMessage type="error">{agreeError}</InputMessage>}
          </div>
        </>
      )}

      {/* 하단 액션바 — 이전/다음으로(마지막 탭=신청하기, 설계서 slide369).
          전 탭 asymmetric(이전 좁게 + 다음으로/신청하기 넓게 — 사용자 지시 2026-08-26). */}
      <div className="border-t border-krds-border-divider bg-krds-bg-primary-faint px-4 py-4">
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '이전', variant: 'secondary', onClick: handlePrev },
            { label: isLastTab ? '신청하기' : '다음으로', variant: 'primary', onClick: handleNext },
          ]}
        />
      </div>

      {/* 플로팅 — 맨위로 */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 사전동의서 상세 바텀시트 — 컨테이너/footer 는 페이지 소유, 콘텐츠(본문 + 동의 선택)는 인라인.
          저장 후 닫기는 '동의함' 선택 시에만 활성(국외 서약서 P03 패턴). */}
      <BottomSheet
        open={agreeOpen}
        onOpenChange={setAgreeOpen}
        title="동의서 상세"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setAgreeOpen(false) },
              {
                label: '저장 후 닫기',
                variant: 'primary',
                disabled: agreeChoice !== '동의함',
                onClick: saveAgreement,
              },
            ]}
          />
        }
      >
        <div className="flex flex-col gap-krds-7 py-2">
          <p className="text-center text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
            {ADM_INFO_AGRE_TITLE}
          </p>
          {/* 본문 — 문구 확보 후 교체(ADM_INFO_AGRE_BODY) */}
          <div className="flex flex-col gap-krds-5 text-[17px] leading-normal text-krds-text-ink">
            {ADM_INFO_AGRE_BODY.map((p, i) => (
              <p key={i} className="wrap-break-word">
                {p}
              </p>
            ))}
          </div>
          {/* 동의 선택 — 기본 동의안함 */}
          <div className="flex flex-col gap-krds-5">
            <p className="text-[17px] font-bold leading-normal text-krds-text-ink">동의 선택</p>
            <RadioButtonGroup
              items={AGREE_OPTIONS}
              value={agreeChoice}
              onValueChange={(v) => {
                setAgreeChoice(v)
                console.log('[M71] 사전동의서 동의 선택', v) // 추후 API: bdService.setAgreementChoice
              }}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
OvsTndrSbmsnPage.displayName = 'OvsTndrSbmsnPage'
