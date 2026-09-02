// 군수품무역대리업 변경 작성 (MUI-CM-01-M18, DfEqpmntTradeAgncChgPage).
// Figma 정본(M17 10020:83291·83358)과 동일 구조 1:1 — 첨부서류 목록만 변경(증빙서류*/등록증*/기타). 설계서 slide186~189 항목명 준수.
// 구성(위→아래): 나라장터(G2B) 갱신 밴드(수신일시+[갱신하기], 업체정보 상세 M02 UI 준용 — 사용자 확정 2026-08-24,
//   구 m_noticebox Notice 대체) → 사업자정보 카드([더보기]) → 첨부파일(총N건·+파일추가·안내·리스트)
//   → 보안측정인원(테이블·[더보기]) + 안내 불릿 → 행정정보 공동이용 동의(P13) → 상태 안내 불릿 → footer [저장하기][제출하기].
//   (2026-08-24 사용자 확정 — 구 [저장하고 제출하기]→선택 시트 + [목록] 구성을 직접 버튼 2개로 대체, 목록 버튼 삭제.)
// 데이터=목업(설계서 항목명 dm_dfEqpmntTradAgncAplyInfo / dl_*), 동작=console.log + '// 추후 …'. 제출 게이트=RHF+zod(동의).
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
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
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Toast } from '@/ui/common/composites/Toast'
import {
  dfEqpmntTradeAgncChgSchema,
  type DfEqpmntTradeAgncChgForm,
} from '@/ui/biz/cm/dfEqpmntTradeAgncChg/DfEqpmntTradeAgncChg.schema'
import type {
  MockDfEqpmntTradeAgncAplyInfo,
  MockDfEqpmntTradeAgncAtchFile,
  MockDfEqpmntScrtyMsrmtPrsnl,
} from '@/types/mock/cm'

// 나라장터(G2B) 조달업체정보 최근 수신 일시 — Figma m_noticebox 예시값(추후 API).
const G2B_LAST_RECV_DT = '2000-12-31 12:00'

// ── 사업자정보(dm_dfEqpmntTradAgncAplyInfo, ReadOnly) — 추후 API. ──
const MOCK_INFO: MockDfEqpmntTradeAgncAplyInfo = {
  rcptNo: '2026-0020',
  rcptYmd: '2022-12-31',
  atrzYmd: '2022-12-31',
  atrzStcd: '신규',
  regAplySecd: '변경',
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

// ── 변경 첨부서류(dl_dfEqpmntTradAgncAplyAtchFileList, 설계서 slide186) — 증빙서류*·등록증*·기타. 초기: 증빙서류만 첨부. ──
const INITIAL_FILES: MockDfEqpmntTradeAgncAtchFile[] = [
  { id: '1', fileTtl: '변경사항을 입증할 수 있는 증빙서류', fileNm: '첨부파일명.hwp', size: '786KB', regYmd: '2026-01-01', required: true },
  { id: '2', fileTtl: '등록증(등록증 기재사항을 변경하는 경우만 해당)', fileNm: '', required: true },
  { id: '3', fileTtl: '기타(파일이 여러 개일 경우 압축해서 첨부 가능)', fileNm: '' },
]
const DOC_TITLES = INITIAL_FILES.map((f) => f.fileTtl)

// ── 보안측정인원(dl_scrtyMsrmtPrsnlList, ReadOnly) — 주민등록번호(rrno)는 Figma 표기(마스킹). ──
const MOCK_SCRTY: MockDfEqpmntScrtyMsrmtPrsnl[] = [
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

// 행정정보 공동이용 동의서(MUI-CM-01-P13) 본문 — 설계서 slide187 '동의서 내용'.
const CONSENT_TEXT =
  '본인은 이 건 업무처리와 관련하여 담당 공무원이 "전자정부법" 제36조제1항에 따른 행정정보의 공동이용을 통하여 위의 담당공무원 확인사항 중 주민등록표 등본, 사업자등록증을 확인하는 것에 동의합니다. 동의하지 아니하는 경우에는 신청인이 직접 관련 서류를 제출하여야 합니다.'

const AGREE_ITEM = [{ id: 'P13', title: '행정정보 공동이용 동의' }]

// 페이지 내 불릿 안내(Figma disclosure) — ・ + muted 텍스트.
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

// 더보기/접기 토글(부분 펼침).
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

export function DfEqpmntTradeAgncChgPage() {
  const [bizExpanded, setBizExpanded] = useState(false)
  const [scrtyExpanded, setScrtyExpanded] = useState(false)
  const [files, setFiles] = useState<MockDfEqpmntTradeAgncAtchFile[]>(INITIAL_FILES)
  const [addOpen, setAddOpen] = useState(false) // 파일첨부 시트(83432)
  const [addTarget, setAddTarget] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null) // 파일삭제 확인(83442)
  const [consentOpen, setConsentOpen] = useState(false) // 동의 시트(83444)
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false) // 제출 확인(83449)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const { control, handleSubmit, setValue } = useForm<DfEqpmntTradeAgncChgForm>({
    resolver: zodResolver(dfEqpmntTradeAgncChgSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { agree: false as unknown as true },
  })

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제. 기존 토스트 재사용.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const downloadFileMut = fbQueries.useDownloadFile()
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFileMut.mutateAsync(guid), fileNm)
    } catch {
      setToastMsg('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

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
      // 파일 UI FileDownloadList 통일(2026-09-01 사용자 확정) — 구 파일명+[보기] 버튼 대체.
      label: '첨부파일',
      value: (
        <FileDownloadList
          files={[
            {
              id: p.id,
              name: p.fileNm,
              size: '2.01MB',
              onDownload: () => handleDownload(p.id, p.fileNm),
            },
          ]}
        />
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
        { id: `${Date.now()}`, fileTtl: addTarget, fileNm: '첨부파일명.hwp', size: '786KB', regYmd: today },
      ]
    })
    console.log('[M18] 파일첨부하기', addTarget) // 추후: 파일 선택기 오픈 → fbService.upload
    setAddOpen(false)
  }
  const confirmDelete = () => {
    if (!deleteId) return
    setFiles((prev) => prev.map((f) => (f.id === deleteId ? { ...f, fileNm: '', size: undefined, regYmd: undefined } : f)))
    console.log('[M18] 첨부 삭제', deleteId)
    setDeleteId(null)
  }

  // ── 나라장터(G2B) 갱신 — 1일 1회 제한(업체정보 상세 M02 와 동일 스텁) ──
  const [refreshedToday, setRefreshedToday] = useState(false)
  const handleRefreshG2b = () => {
    if (refreshedToday) {
      setToastMsg('갱신은 1일 1회로 제한됩니다.')
      return
    }
    console.log('[M18] 나라장터(G2B) 조달업체정보 갱신') // 추후 API: cmService.refreshG2b
    setRefreshedToday(true)
    setToastMsg('갱신되었습니다.')
  }

  // ── 저장/제출 — footer 직접 버튼(구 83451 선택 시트 폐기, 사용자 확정 2026-08-24) ──
  const handleSave = () => {
    setToastMsg('저장되었습니다.')
    console.log('[M18] 저장하기', { files }) // 추후: cmService.updateDfEqpmntTradeAgnc(payload)
  }
  // 제출하기 → 제출 확인 모달(83449) 오픈.
  const openSubmitConfirm = () => setSubmitConfirmOpen(true)
  const onSubmitValid = () => {
    const missing = files.filter((f) => f.required && !f.fileNm)
    if (missing.length > 0) {
      setToastMsg(`필수 첨부서류를 첨부해주세요. (${missing.map((m) => m.fileTtl).join(', ')})`)
      return
    }
    setToastMsg('제출되었습니다.')
    console.log('[M18] 제출하기', { files }) // 추후: cmService.submitDfEqpmntTradeAgncChg(payload)
  }
  const onInvalid = () => {
    document.getElementById('field-agree')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="flex w-full flex-col gap-krds-8 pb-4 pt-4">
      {/* 나라장터(G2B) 갱신 밴드 — 업체정보 상세(M02) UI 준용(사용자 확정 2026-08-24, 구 m_noticebox Notice 대체). */}
      <div className="flex flex-col gap-krds-5 bg-krds-bg-primary-faint px-4 py-4">
        <p className="text-[15px] leading-normal text-krds-text-muted wrap-break-word">
          나라장터(G2B) 조달업체정보 최근 수신(갱신) 일시 : {G2B_LAST_RECV_DT}
        </p>
        <Button variant="secondary" className="w-full" onClick={handleRefreshG2b}>
          갱신하기
        </Button>
      </div>

      {/* 사업자정보 카드 — 배지(변경) + 접수번호 + 테이블 + 더보기. */}
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
              <Badge color="yellow">변경</Badge>
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

      {/* footer — [저장하기](secondary) / [제출하기](primary). 목록 버튼 삭제(사용자 확정 2026-08-24). */}
      <div
        className="sticky bottom-0 z-30 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '저장하기', variant: 'secondary', onClick: handleSave },
            { label: '제출하기', variant: 'primary', onClick: openSubmitConfirm },
          ]}
        />
      </div>

      {/* 파일첨부 바텀시트(Figma 10020:83432) — 서류종류 라디오 + [파일첨부하기][나중에](세로). */}
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
            items={DOC_TITLES.map((t) => ({ value: t, label: t }))}
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

      {/* 행정정보 공동이용 동의 바텀시트(Figma 10020:83444) — 본문 + [취소][동의하기]. */}
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


      {/* 제출 확인 모달(Figma 10020:83449) — [취소][확인]. */}
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
DfEqpmntTradeAgncChgPage.displayName = 'DfEqpmntTradeAgncChgPage'
