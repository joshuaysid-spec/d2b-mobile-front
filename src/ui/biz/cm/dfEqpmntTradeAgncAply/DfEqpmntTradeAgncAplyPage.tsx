// 군수품무역대리업 신규(갱신) 작성 (MUI-CM-01-M17, DfEqpmntTradeAgncAplyPage).
// Figma 정본 10020:83291(접힘)·10020:83358(펼침) 1:1. 설계서 00.공통 v0.84 slide182~185 항목명 준수.
// 구성(위→아래, Figma): 나라장터 수신일자 Notice → 사업자정보 카드([더보기] 부분펼침) → 첨부파일(총N건·+파일추가·안내·파일리스트)
//   → 보안측정인원(테이블·[더보기]) + 안내 불릿 → 행정정보 공동이용 동의(P13) → 상태 안내 불릿 → footer [저장하고 제출하기][목록].
// 신규/갱신은 같은 화면 — navigate state {mode:'new'|'renew'} 로 사업자정보 배지(신청구분) 토글. 데이터=목업, 동작=console.log + '// 추후 …'.
// 폼 검증(제출 게이트)은 react-hook-form+zod — 조작값은 동의(agree)뿐(업체정보 ReadOnly). 첨부는 파일 상태로 관리.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ROUTES } from '@/constants/routes'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'
import { Notice } from '@/ui/common/composites/Notice'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Toast } from '@/ui/common/composites/Toast'
import {
  dfEqpmntTradeAgncAplySchema,
  type DfEqpmntTradeAgncAplyForm,
} from '@/ui/biz/cm/dfEqpmntTradeAgncAply/DfEqpmntTradeAgncAply.schema'
import type {
  DfEqpmntTradeAgncAplyInfo,
  DfEqpmntTradeAgncAtchFile,
  DfEqpmntScrtyMsrmtPrsnl,
} from '@/types/cm'

// 나라장터(G2B) 조달업체정보 최근 수신 일시 — Figma m_noticebox 예시값(추후 API).
const G2B_LAST_RECV_DT = '2000-12-31 12:00'

// ── 사업자정보(dm_dfEqpmntTradAgncAplyInfo, Figma 10020:83358 예시값, ReadOnly) — 추후 API. ──
const MOCK_INFO: DfEqpmntTradeAgncAplyInfo = {
  rcptNo: '2026-0020',
  rcptYmd: '2022-12-31',
  atrzYmd: '2022-12-31',
  atrzStcd: '신규',
  regAplySecd: '신규',
  bzstatCdNm: '공급업/군수품 무역대리업',
  bzentyNm: '조달테스트',
  rprsvNm: '홍길동',
  bzentyTelno: '02-1234-5678',
  bzentyFxno: '02-2345-6789',
  bzentyEmlAddr: 'test@dapa.go.kr',
  brno: '123-45-67890',
  fndnYmd: '1999-01-02',
  bzentyAddr: '대전광역시 서부 월평 종로 21 방위사업법',
}

// ── 첨부서류(dl_dfEqpmntTradAgncAplyAtchFileList, Figma 총 4건) — fileTtl 고정·fileNm 선택(Editable). 첨부일자(regYmd)는 Figma 표기. ──
const INITIAL_FILES: DfEqpmntTradeAgncAtchFile[] = [
  { id: '1', fileTtl: '등록신청서', fileNm: '첨부파일명.hwp', size: '786KB', regYmd: '2026-01-01', required: true },
  { id: '2', fileTtl: '이력서', fileNm: '첨부파일명.hwp', size: '786KB', regYmd: '2026-01-01', required: true },
  { id: '3', fileTtl: '청렴서약서', fileNm: '첨부파일명.hwp', size: '786KB', regYmd: '2026-01-01', required: true },
  { id: '4', fileTtl: '고용현황', fileNm: '첨부파일명.hwp', size: '786KB', regYmd: '2026-01-01', required: true },
]
// 미첨부 시 파일 추가 시트에서 고를 수 있는 서류명(설계서 slide182). 기타는 선택.
const DOC_TITLES = ['등록신청서', '이력서', '청렴서약서', '고용현황', '기타']

// ── 보안측정인원(dl_scrtyMsrmtPrsnlList, Figma 예시값, ReadOnly) — 주민등록번호(rrno)는 Figma 표기(마스킹). ──
const MOCK_SCRTY: DfEqpmntScrtyMsrmtPrsnl[] = [
  {
    id: '1',
    taskHdlrNm: '홍길동',
    rrno: '260526-*******',
    taskHdlrRsltCd: '적격',
    taskHndlYmd: '2026-05-26',
    fileNm: '등록신청서.PDF',
    aprvSecdNm: '',
  },
]

// 행정정보 공동이용 동의서(MUI-CM-01-P13) 본문 — 설계서 slide183 '동의서 내용'.
const CONSENT_TEXT =
  '본인은 이 건 업무처리와 관련하여 담당 공무원이 "전자정부법" 제36조제1항에 따른 행정정보의 공동이용을 통하여 위의 담당공무원 확인사항 중 주민등록표 등본, 사업자등록증을 확인하는 것에 동의합니다. 동의하지 아니하는 경우에는 신청인이 직접 관련 서류를 제출하여야 합니다.'

const AGREE_ITEM = [{ id: 'P13', title: '행정정보 공동이용 동의' }]

// 페이지 내 불릿 안내(Figma disclosure) — ・ + muted 텍스트. (공통 HelpDisclosure 는 파란 '업무도움' 접힘 박스라 여기선 부적합)
function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-krds-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-krds-3 text-[15px] leading-normal text-krds-text-muted">
          <span aria-hidden className="mt-[0.5em] size-1 shrink-0 rounded-full bg-krds-text-muted" />
          <span className="min-w-px flex-1 wrap-break-word">{it}</span>
        </li>
      ))}
    </ul>
  )
}

// 더보기/접기 토글(부분 펼침) — Figma 카드/테이블 하단 중앙.
function MoreToggle({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="flex w-full items-center justify-center gap-krds-3 text-[15px] leading-normal text-krds-text-muted"
    >
      {expanded ? '접기' : '더보기'}
      <Icon
        name="ExpandMore"
        size={20}
        className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'}
        aria-hidden
      />
    </button>
  )
}

export function DfEqpmntTradeAgncAplyPage() {
  const navigate = useNavigate()
  // 신규/갱신 모드 — navigate state 로 전달(없으면 신규). 사업자정보 배지(신청구분) 토글.
  const mode = ((useLocation().state as { mode?: 'new' | 'renew' } | null)?.mode) ?? 'new'
  const kindLabel = mode === 'renew' ? '갱신' : '신규'

  const [bizExpanded, setBizExpanded] = useState(false) // 사업자정보 더보기
  const [scrtyExpanded, setScrtyExpanded] = useState(false) // 보안측정인원 더보기
  const [files, setFiles] = useState<DfEqpmntTradeAgncAtchFile[]>(INITIAL_FILES)
  const [addOpen, setAddOpen] = useState(false) // 파일첨부 시트(83432)
  const [addTarget, setAddTarget] = useState('') // 선택된 서류명
  const [deleteId, setDeleteId] = useState<string | null>(null) // 파일삭제 확인 모달(83442)
  const [consentOpen, setConsentOpen] = useState(false) // 행정정보 공동이용 동의 시트(83444)
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false) // 제출 확인 모달(83449)
  const [saveSubmitOpen, setSaveSubmitOpen] = useState(false) // 저장/제출 선택 시트(83451)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const { control, handleSubmit, setValue } = useForm<DfEqpmntTradeAgncAplyForm>({
    resolver: zodResolver(dfEqpmntTradeAgncAplySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { agree: false as unknown as true },
  })

  // ── 사업자정보 테이블 rows(요약 4행 + 더보기 4행) ──
  const bizSummary: TableRow[] = [
    { label: '업태', value: MOCK_INFO.bzstatCdNm },
    { label: '상호', value: MOCK_INFO.bzentyNm },
    { label: '대표자성명', value: MOCK_INFO.rprsvNm },
    { label: '연락처', value: MOCK_INFO.bzentyTelno },
  ]
  const bizMore: TableRow[] = [
    { label: '팩스', value: MOCK_INFO.bzentyFxno },
    { label: '이메일', value: MOCK_INFO.bzentyEmlAddr },
    { label: '사업자번호', value: MOCK_INFO.brno },
    { label: '주소', value: MOCK_INFO.bzentyAddr },
  ]
  const bizRows = bizExpanded ? [...bizSummary, ...bizMore] : bizSummary

  // ── 보안측정인원 테이블 rows(요약 5행 + 더보기 1행 첨부파일) ──
  const p = MOCK_SCRTY[0]
  const scrtySummary: TableRow[] = [
    { label: '성명', value: p.taskHdlrNm },
    { label: '주민등록번호', value: p.rrno ?? '-' },
    { label: '적격여부', value: p.taskHdlrRsltCd },
    { label: '보안측정일', value: p.taskHndlYmd },
    { label: '구분', value: p.aprvSecdNm || '-' },
  ]
  const scrtyMore: TableRow[] = [
    {
      label: '첨부파일',
      type: 'combination',
      value: (
        <div className="flex items-center gap-krds-5">
          <span className="min-w-px flex-1 truncate">
            {p.fileNm} <span className="text-krds-text-muted">[2.01MB]</span>
          </span>
          <Button size="sm" variant="inner" onClick={() => console.log('[M17] 보안측정 첨부 보기', p.fileNm)}>
            보기
          </Button>
        </div>
      ),
    },
  ]
  const scrtyRows = scrtyExpanded ? [...scrtySummary, ...scrtyMore] : scrtySummary

  // ── 첨부파일 추가(83432)/삭제(83442) ──
  const attachedCount = files.filter((f) => f.fileNm).length
  const openAddSheet = () => {
    setAddTarget(DOC_TITLES[0])
    setAddOpen(true)
  }
  // 파일첨부하기 — 선택 서류에 목업 파일 첨부(추후: 파일 선택기 + fileService.upload). 같은 서류명 슬롯 있으면 교체, 없으면 새 행.
  const handleAttach = () => {
    if (!addTarget) return
    setFiles((prev) => {
      const today = new Date().toISOString().slice(0, 10)
      const slot = prev.find((f) => f.fileTtl === addTarget)
      if (slot) {
        return prev.map((f) =>
          f === slot ? { ...f, fileNm: '첨부파일명.hwp', size: '786KB', regYmd: today } : f,
        )
      }
      return [
        ...prev,
        { id: `${Date.now()}`, fileTtl: addTarget, fileNm: '첨부파일명.hwp', size: '786KB', regYmd: today, required: addTarget !== '기타' },
      ]
    })
    console.log('[M17] 파일첨부하기', addTarget) // 추후: 파일 선택기 오픈 → fileService.upload
    setAddOpen(false)
  }
  // X 클릭 → 삭제 확인 모달(83442) → 삭제 확정.
  const confirmDelete = () => {
    if (!deleteId) return
    setFiles((prev) => prev.map((f) => (f.id === deleteId ? { ...f, fileNm: '', size: undefined, regYmd: undefined } : f)))
    console.log('[M17] 첨부 삭제', deleteId)
    setDeleteId(null)
  }

  // ── 저장/제출(83451 시트 → 83449 확인) ──
  const handleSave = () => {
    setSaveSubmitOpen(false)
    setToastMsg('저장되었습니다.')
    console.log('[M17] 저장하기', { mode, files }) // 추후: cmService.saveDfEqpmntTradeAgnc(payload)
  }
  // 제출하기 → 저장/제출 시트 닫고 제출 확인 모달 오픈.
  const openSubmitConfirm = () => {
    setSaveSubmitOpen(false)
    setSubmitConfirmOpen(true)
  }
  // 제출 확인 [확인] — 검증(동의/필수첨부) 후 제출.
  const onSubmitValid = () => {
    const missing = files.filter((f) => f.required && !f.fileNm)
    if (missing.length > 0) {
      setToastMsg(`필수 첨부서류를 첨부해주세요. (${missing.map((m) => m.fileTtl).join(', ')})`)
      return
    }
    setToastMsg('제출되었습니다.')
    console.log('[M17] 제출하기', { mode, files }) // 추후: cmService.submitDfEqpmntTradeAgncAply(payload)
  }
  const onInvalid = () => {
    document.getElementById('field-agree')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="flex w-full flex-col gap-krds-8 pb-4">
      {/* 나라장터(G2B) 최근 수신일자 Notice(Figma m_noticebox). */}
      <div className="px-4 pt-4">
        <Notice icon="Schedule">
          최근 수신일자
          <br />
          {G2B_LAST_RECV_DT} (나라장터)
        </Notice>
      </div>

      {/* 사업자정보 카드 — 배지(신청구분) + 접수번호 + 테이블 + 더보기(팩스/이메일/사업자번호/주소). */}
      <div className="mx-4 flex flex-col gap-krds-7 rounded-krds-8 border border-krds-border-field bg-background p-krds-8 shadow-krds-card">
        <div className="flex items-start gap-krds-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-krds-8 bg-krds-bg-primary-faint text-krds-text-primary-active">
            <Icon name="Apartment" size={22} aria-hidden />
          </span>
          <div className="flex min-w-px flex-1 flex-col gap-krds-3">
            <div className="flex items-center gap-krds-3">
              <span className="text-[17px] font-medium leading-normal text-krds-text-muted">접수번호</span>
              <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink">
                {MOCK_INFO.rcptNo}
              </span>
              <Icon name="Info" size={18} className="shrink-0 text-krds-text-disabled-soft" aria-hidden />
            </div>
            <div>
              <Badge color="yellow">{kindLabel}</Badge>
            </div>
          </div>
        </div>
        <Table rows={bizRows} />
        <MoreToggle expanded={bizExpanded} onClick={() => setBizExpanded((v) => !v)} />
      </div>

      {/* 첨부파일 — 섹션 타이틀(총 N건) + [+ 파일 추가] + 안내 불릿 + 파일 리스트(서류명·일자·삭제). */}
      <section className="flex flex-col">
        <SectionTitle topDivider info={`총 ${attachedCount}건`}>
          첨부파일
        </SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4 pt-krds-7">
          <Button variant="secondary" className="w-full" onClick={openAddSheet}>
            <Icon name="Add" size={20} aria-hidden />
            파일 추가
          </Button>
          <Bullets
            items={[
              '파일 용량은 최대 10MB 입니다',
              '최대 5개까지 등록 가능 합니다',
              '파일 형식은 JPG, PDF만 첨부 가능 합니다',
            ]}
          />
          {/* 파일 리스트 — 서류명 + 첨부일자(우) + FileDownloadList(파일명/용량 박스 + X 삭제). */}
          <div className="flex flex-col gap-krds-8">
            {files.filter((f) => f.fileNm).map((f) => (
              <div key={f.id} className="flex flex-col gap-krds-3">
                <div className="flex items-center justify-between gap-krds-5">
                  <span className="text-[17px] font-medium leading-normal text-krds-text-ink">{f.fileTtl}</span>
                  <span className="shrink-0 text-[15px] leading-normal text-krds-text-muted">{f.regYmd}</span>
                </div>
                <FileDownloadList
                  files={[{ id: f.id, name: f.fileNm as string, size: f.size, onRemove: () => setDeleteId(f.id) }]}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 보안측정인원 — 섹션 타이틀 + 테이블 + 더보기(첨부파일) + 안내 불릿. */}
      <section className="flex flex-col">
        <SectionTitle topDivider>보안측정인원</SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4 pt-krds-7">
          <Table rows={scrtyRows} />
          <MoreToggle expanded={scrtyExpanded} onClick={() => setScrtyExpanded((v) => !v)} />
          <Bullets
            items={[
              '보안측정인원은 업체등록에서 등록하시기 바랍니다.',
              '보안측정인원 등록경로 : 로그인 > 마이페이지 > 업체정보관리 > 업체추가정보등록',
            ]}
          />
        </div>
      </section>

      {/* 행정정보 공동이용 동의서 — 동의 체크(box) + 본문 보기(P13 시트). */}
      <section className="flex flex-col">
        <SectionTitle topDivider>행정정보 공동이용 동의서</SectionTitle>
        <div className="px-4 pt-krds-7">
          <Controller
            control={control}
            name="agree"
            render={({ field, fieldState }) => (
              <div id="field-agree" className="flex flex-col gap-krds-5">
                <AgreementList
                  items={AGREE_ITEM}
                  checkAll={false}
                  checked={field.value ? ['P13'] : []}
                  onToggle={(_, c) => field.onChange(c)}
                  onView={() => setConsentOpen(true)}
                />
                {fieldState.error && (
                  <InputMessage type="error">{fieldState.error.message}</InputMessage>
                )}
              </div>
            )}
          />
        </div>
      </section>

      {/* 상태 안내 불릿(Figma disclosure). */}
      <div className="px-4">
        <Bullets
          items={[
            '심사대기 : 군수품무역대리업 신청 후 심사대기 상태',
            '수정대기 : 군수품무역대리업 신청 후 보안측정정보 첨부 후 수정대기 상태',
            '승인완료 : 군수품무역대리업 신청 후 발급 완료 상태',
          ]}
        />
      </div>

      {/* footer — [저장하고 제출하기](primary) / [목록](secondary). */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="vertical"
          items={[
            { label: '저장하고 제출하기', variant: 'primary', onClick: () => setSaveSubmitOpen(true) },
            { label: '목록', variant: 'secondary', onClick: () => navigate(ROUTES.DF_EQPMNT_TRADE_AGNC) },
          ]}
        />
      </div>

      {/* 파일첨부 바텀시트(Figma 10020:83432) — 서류종류 5개 라디오 + [파일첨부하기][나중에](세로). */}
      <BottomSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        title="파일첨부"
        footer={
          <ButtonGroup
            layout="vertical"
            items={[
              { label: '파일첨부하기', variant: 'primary', onClick: handleAttach },
              { label: '나중에', variant: 'secondary', onClick: () => setAddOpen(false) },
            ]}
          />
        }
      >
        <div className="py-krds-5">
          <RadioButtonGroup
            direction="vertical"
            showIndicator
            value={addTarget}
            onValueChange={setAddTarget}
            items={DOC_TITLES.map((t) => ({ value: t, label: t === '기타' ? '기타 (선택)' : t }))}
          />
        </div>
      </BottomSheet>

      {/* 파일삭제 확인 모달(Figma 10020:83442). */}
      <AlertModal
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        variant="error"
        title="첨부파일을 삭제하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '삭제', onClick: confirmDelete }}
      />

      {/* 행정정보 공동이용 동의 바텀시트(Figma 10020:83444) — 본문 + [취소][동의하기]. 동의하기=agree 체크. */}
      <BottomSheet
        open={consentOpen}
        onOpenChange={setConsentOpen}
        title="행정정보 공동이용 동의"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setConsentOpen(false) },
              {
                label: '동의하기',
                variant: 'primary',
                onClick: () => {
                  setValue('agree', true as unknown as true, { shouldValidate: true })
                  setConsentOpen(false)
                },
              },
            ]}
          />
        }
      >
        <p className="py-krds-5 text-[17px] leading-relaxed text-krds-text-ink wrap-break-word">
          {CONSENT_TEXT}
        </p>
      </BottomSheet>

      {/* 저장/제출 선택 바텀시트(Figma 10020:83451) — 저장하기/제출하기 네비 + [확인]. */}
      <BottomSheet
        open={saveSubmitOpen}
        onOpenChange={setSaveSubmitOpen}
        title="저장하고 제출하기"
        footer={
          <Button variant="primary" className="w-full" onClick={() => setSaveSubmitOpen(false)}>
            확인
          </Button>
        }
      >
        <div className="py-krds-3">
          <NavigationItemList
            items={[
              { id: 'save', label: '저장하기', onClick: handleSave },
              { id: 'submit', label: '제출하기', onClick: openSubmitConfirm },
            ]}
          />
        </div>
      </BottomSheet>

      {/* 제출 확인 모달(Figma 10020:83449) — [취소][확인]. 확인=검증 후 제출. */}
      <AlertModal
        open={submitConfirmOpen}
        onOpenChange={setSubmitConfirmOpen}
        variant="check"
        title="제출하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: handleSubmit(onSubmitValid, onInvalid) }}
      />

      {/* 저장/제출 결과 토스트. */}
      <Toast open={toastMsg !== null} onClose={() => setToastMsg(null)} duration={2000}>
        {toastMsg}
      </Toast>
    </div>
  )
}
DfEqpmntTradeAgncAplyPage.displayName = 'DfEqpmntTradeAgncAplyPage'
