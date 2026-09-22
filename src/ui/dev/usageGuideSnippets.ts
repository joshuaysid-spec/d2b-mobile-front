// UsageGuidePage 의 "최소 코드" 블록 문자열 — 복사해서 바로 쓰는 것이 목적이라 실제 시그니처 그대로.
// 컴포넌트 파일이 아닌 여기에 두는 이유: .tsx 에서 상수를 export 하면 react-refresh 경고(fast-refresh).
// 근거 파일은 각 상수의 주석에. 컴포넌트 props 가 바뀌면 여기도 함께 고친다.

/** 1. SearchFilter + SearchCondition — 근거: cm/search/SearchFilter.tsx · types/search-filter.ts · op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx */
export const SNIPPET_SEARCH_FILTER = `// 1) 검색조건 선언 — 페이지는 schema(데이터)만. 검증은 셸이 자동 생성(buildZodSchema).
const DEFAULT: SearchFilterValue = { pbancDt: { start: '', end: '' }, pbancNm: '', pbancNo: '', pbancNoFull: '' }
const SCHEMA: SearchFilterSchema = {
  title: '입찰공고 검색필터',
  sections: [
    {
      key: 'cond',
      title: '검색조건',
      fields: [
        { key: 'pbancDt', type: 'dateRange', label: '공고일자', required: true },
        { key: 'pbancNm', type: 'text', label: '공고명', minLength: 2, maxLength: 50 },
        // 형식 검사 — 값이 있을 때만. g/y 플래그는 붙이지 말 것(i 는 OK). 검색은 일부 입력이 가능하니
        // 전체 형식(^…$)보다 허용 문자 집합으로 거는 편이 안전하다.
        {
          key: 'pbancNo', type: 'text', label: '공고번호',
          allowedChars: /[A-Z0-9-]/i,   // 타이핑 즉시 차단(문자 클래스)
          pattern: { regex: /^[A-Z0-9-]+$/i, message: '영문·숫자·하이픈(-)만 입력할 수 있습니다.' }, // [검색] 시 검사
        },
        // 전체 형식을 강제해야 하는 자리(정확한 번호 입력)는 ^…$ 로 고정 — 일부 입력은 통과 못 함.
        {
          key: 'pbancNoFull', type: 'text', label: '공고번호(전체 형식)',
          pattern: { regex: /^\\d{4}[A-Z]{3}\\d{9}$/, message: '연도4+영문3+숫자9 형식으로 입력해주세요.' },
        },
      ],
    },
  ],
}

// 2) 페이지 — 빠른검색(SearchCondition) + 상세필터(SearchFilter 풀팝업).
const [filterOpen, setFilterOpen] = useState(false)
const [filter, setFilter] = useState<SearchFilterValue>(DEFAULT)
// 확정값(filter)을 도메인 요청 타입으로 옮겨 조회 훅 파라미터로 — 페이지는 서비스를 직접 부르지 않는다.
const list = bdQueries.useSelectBidPbancIntgList(toSrchMap(filter, appliedSearch))

<SearchCondition
  targets={TARGETS} selectedTargets={targets} onTargetsChange={setTargets}
  keyword={keyword} onKeywordChange={setKeyword}
  onFilterClick={() => setFilterOpen(true)}
  onSearch={() => setAppliedSearch({ targets, keyword })}
/>
<SearchFilter
  open={filterOpen} onOpenChange={setFilterOpen}
  schema={SCHEMA} value={filter} defaultValue={DEFAULT}
  onSearch={setFilter}   // 검증 통과 시에만 호출 + 팝업 닫힘
/>`

/** 2. FileAdd — 근거: cm/fileAdd/FileAdd.tsx · docs/02-design/features/file-upload.design.md */
export const SNIPPET_FILE_ADD = `const fileAddRef = useRef<FileAddHandle>(null)
const [sheetOpen, setSheetOpen] = useState(false)
const [files, setFiles] = useState<FileAddDoneFile[]>([])

// 컨테이너(BottomSheet)·타이틀·footer 는 부모 소유 — FileAdd 는 콘텐츠만.
<BottomSheet
  open={sheetOpen} onOpenChange={setSheetOpen} title="파일 추가"
  footer={
    <ButtonGroup
      layout="split"
      items={[
        { label: '취소', variant: 'secondary', onClick: () => setSheetOpen(false) },
        {
          label: '완료',
          variant: 'primary',
          // complete() = 검증 통과 시 onComplete 실행 후 true → 부모가 닫는다.
          onClick: () => { if (fileAddRef.current?.complete()) setSheetOpen(false) },
        },
      ]}
    />
  }
>
  <FileAdd
    ref={fileAddRef}
    fixedDocNm="연대보증서"      // 서류명이 정해진 자리 — 입력 필드 숨김 (선택형은 docNmOptions)
    multiple={false}
    // 파일 선택 즉시 업로드(fbQueries.useUploadFile) → 응답(UploadedFile)이 uploaded 에 통째로.
    onComplete={({ docNm, files }) => {
      setFiles(files)                         // 등록 API 에는 f.uploaded.guid 를 전송
      console.log(docNm, files.map((f) => f.uploaded.guid))
    }}
  />
</BottomSheet>`

/** 3. FileDownloadList + fbQueries — 근거: queries/tss/fb/fbQueries.ts · utils/download.ts · common/composites/FileDownloadList.tsx */
export const SNIPPET_FILE_DOWNLOAD = `const downloadFile = fbQueries.useDownloadFile()
const [toastOpen, setToastOpen] = useState(false)

// 실패는 throw — 호출부에서 try/catch 하고 토스트/AlertModal 로 안내한다.
const download = async (guid: string, fileName: string) => {
  try {
    saveBlob(await downloadFile.mutateAsync(guid), fileName)  // 저장은 utils/download 하나만
  } catch {
    setToastOpen(true)
  }
}

<FileDownloadList
  files={atchList.map((f) => ({
    id: f.guid,                    // ⚠️ 목업 GUID — 실응답 확정 시 교체 (key 는 반드시 고유 id)
    name: f.orgnlFileNm,
    size: formatFileSize(f.fileSz),
    onDownload: () => void download(f.guid, f.orgnlFileNm),
  }))}
  onDownloadAll={() => atchList.forEach((f) => void download(f.guid, f.orgnlFileNm))}
/>
<Toast open={toastOpen} onClose={() => setToastOpen(false)}>파일을 내려받지 못했습니다.</Toast>`

/** 4. OzReportFullPopup + useOzReport — 근거: cm/ozReport/useOzReport.ts · OzReportFullPopup.tsx · OzReportViewer.tsx */
export const SNIPPET_OZ_REPORT = `const oz = useOzReport()
const [printConfirm, setPrintConfirm] = useState(false)

<Button variant="secondary" onClick={() => setPrintConfirm(true)}>출력</Button>

{/* P14 출력 확인 모달 — 설계서에 있는 화면이라 유지한다(바로 열지 않는다). */}
<AlertModal
  open={printConfirm} onOpenChange={setPrintConfirm}
  title="출력하시겠습니까?"
  secondaryAction={{ label: '취소' }}
  primaryAction={{
    label: '확인',
    // (리포트 ID, 리포트 파라미터, 팝업 타이틀)
    onClick: () => oz.open('PVB021', { rcptNo }, '군수품무역대리업 등록증'),
  }}
/>

{/* 팝업은 껍데기 — 뷰어 스크립트 로드·OZ 서버 통신은 전부 OzReportViewer 안. */}
<OzReportFullPopup {...oz.popupProps} />`

/** 5. BottomSheet / FullPopup / AlertModal — 근거: common/composites 3개 파일 · docs/rules/components.md */
export const SNIPPET_POPUPS = `// 선택·짧은 입력 → BottomSheet · 상세/긴 폼 → FullPopup · 예/아니오 → AlertModal.
// 컨테이너는 부모가 소유하고, 안에 "콘텐츠만 분리한 컴포넌트"를 끼운다(*Sheet 전용 래퍼 금지).
<BottomSheet
  open={sheetOpen} onOpenChange={setSheetOpen} title="연관 조달계획"
  footer={<ButtonGroup layout="split" items={[
    { label: '닫기', variant: 'secondary', onClick: () => setSheetOpen(false) },
    { label: '삭제', variant: 'primary', onClick: () => setConfirmOpen(true) },
  ]} />}
>
  <AnlPrcmPlanDtl items={rows} />   {/* 콘텐츠 컴포넌트 — 시트/footer/open 을 갖지 않는다 */}
</BottomSheet>

<FullPopup
  open={popupOpen} onOpenChange={setPopupOpen} title="의견 등록"
  rightActions={[
    { icon: 'Refresh', label: '초기화', onClick: reset },
    { icon: 'Close', label: '닫기', onClick: () => setPopupOpen(false) },
  ]}
  footer={<Button variant="primary" className="w-full">등록</Button>}
>
  <OpnnRegForm />
</FullPopup>

{/* 시트 위에 스택. AlertModal 은 dismissable 기본 false — 버튼으로만 닫힌다. */}
<AlertModal
  open={confirmOpen} onOpenChange={setConfirmOpen}
  variant="error" title="삭제하시겠습니까?" description="삭제된 데이터는 복구할 수 없습니다."
  secondaryAction={{ label: '취소' }}
  primaryAction={{ label: '삭제', onClick: handleDelete }}
/>`

/** 6. StepBar + 스텝 마법사 폼 — 근거: bd/ovsBidPrtcpAply/{OvsBidPrtcpAplyPage,Stp3}.tsx · docs/rules/forms.md */
export const SNIPPET_WIZARD = `// ── 탭(스텝) — 자기 useForm 을 갖고 submit() 만 노출. 폼을 페이지로 올리지 않는다. ──
export interface Stp2Handle { submit: () => void }

const Stp2 = forwardRef<Stp2Handle, Stp2Props>(({ defaultValues, onSubmit }, ref) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Stp2Values>({
    resolver: zodResolver(stp2Schema),
    mode: 'onSubmit', reValidateMode: 'onBlur',
    shouldFocusError: false,          // 포커스는 focusField 한 경로로 통일
    defaultValues,                    // 되돌아왔을 때 확정값 재주입
  })
  useImperativeHandle(ref, () => ({
    submit: () => void handleSubmit(onSubmit, () => focusField('field-bzentyNm'))(),
  }))
  return <form onSubmit={handleSubmit(onSubmit)}>{/* 폼 내 제출 버튼 없음 */}</form>
})

// ── 페이지 — 현재 탭만 검증하고, 확정값만 보관한다. ──
const [stp2Values, setStp2Values] = useState<Stp2Values>(STP2_DEFAULT)
const stp2Ref = useRef<Stp2Handle>(null)

const handleNext = () => {
  if (tab === '업체정보') return stp2Ref.current?.submit()  // 통과 → onSubmit 에서 다음 탭
  goNextTab()                                              // 조회 전용 탭은 검증 없이 통과
}

<StepBar orientation="horizontal" expandable={false} items={steps} />
<Stp2 ref={stp2Ref} defaultValues={stp2Values}
      onSubmit={(v) => { setStp2Values(v); goNextTab() }} />`

/** 7. AgreementList — 근거: common/composites/AgreementList.tsx · bd/ovsBidPrtcpAply/OvsBidPrtcpAply.schema.ts */
export const SNIPPET_AGREEMENT = `// 필수 동의는 배열 refine 으로 — 체크 목록도 폼 값이다(useState 수동 검증 금지).
export const wrotAgreSchema = (requiredIds: string[]) =>
  z.object({
    wrotChecked: z.array(z.string()).refine((ids) => requiredIds.every((id) => ids.includes(id)), {
      error: '서약서에 동의해주세요.',     // zod v4 — message: 아님
    }),
  })

const form = useForm<WrotAgreValues>({
  resolver: zodResolver(wrotAgreSchema(REQUIRED_IDS)),
  mode: 'onSubmit', reValidateMode: 'onChange',  // 체크 즉시 에러 해제
  shouldFocusError: false,                       // AgreementList 에는 RHF ref 가 없다
  defaultValues: { wrotChecked: [] },
})
const handleNext = form.handleSubmit(onValid, () => focusField('field-wrotChecked'))

<div id="field-wrotChecked">
  <AgreementList
    items={WROT_ITEMS} checked={form.watch('wrotChecked')}
    onToggle={(id, on) => form.setValue('wrotChecked', next(id, on), { shouldValidate: true })}
    onCheckAll={(on) => form.setValue('wrotChecked', on ? allIds : [], { shouldValidate: true })}
    onView={(id) => setDetailTarget(id)}   {/* 상세 시트는 페이지가 소유 */}
  />
</div>
{form.formState.errors.wrotChecked && (
  <InputMessage type="error">{form.formState.errors.wrotChecked.message}</InputMessage>
)}`

/** 8. Table / CardList / SummaryInfo — 근거: common/composites/{Table,CardList,Card,SummaryInfo}.tsx · docs/rules/screens.md */
export const SNIPPET_DATA_VIEWS = `// 표·필드는 전부 데이터 배열 구동 — 마크업 복제 금지(국내/국외 변형은 데이터만 교체).
<Table rows={[
  { label: '공고번호', value: detail.pbancNo },
  { label: '공고일자', value: detail.pbancDt, type: 'date' },        // 20260312 → 2026-03-12
  { label: '추정가격', value: '225,337,550 원', type: 'number' },     // 우측 정렬
  { label: '첨부', value: <Button size="sm" variant="inner">보기</Button>, type: 'combination' },
]} />

// 목록 → 카드 매핑은 함수 하나로. key 는 CardList 가 item.id 로 처리(인덱스 key 금지).
const toCard = (it: BidPbancItem): CardListItem => ({
  id: it.pbancNo,
  badges: <Badge type="pastel" color="blue">{it.taskSeNm}</Badge>,
  subtitle: \`공고번호 \${it.pbancNo}\`,
  title: it.pbancNm,
  rows: [
    { label: '공고일자', value: it.pbancDt },
    { label: '마감일시', value: it.clsgDt },
  ],
  onClick: () => navigate(ROUTES.BD_DETAIL, { state: it }),
})

<CardList items={list.map(toCard)} loading={isLoading} emptyText="조회된 공고가 없습니다." />

<SummaryInfo
  badges={[{ key: 'task', label: '국내' }, { key: 'ctrt', label: '수의계약', color: 'red' }]}
  subtitle="판단번호 4000A" title="2026 K5 방독면 수리부속(구매)"
  rows={[{ label: '발주예정월', value: '2026-03' }, { label: '예산금액', value: '225,337,550 원' }]}
/>`

/** 9. RHF + zod 2레인 · focusField — 근거: docs/rules/forms.md · utils/focusField.ts · base/{InputBox,InputMessage}.tsx */
export const SNIPPET_VALIDATION = `// 입력 폼 레인 = 스키마를 직접 작성 (검색필터 레인은 셸이 자동 생성 — 섞지 말 것).
export const opnnRegSchema = z.object({
  opnnSeCd: z.string().min(1, { error: '의견구분을 선택해주세요.' }),
  opnnCn: z.string().min(1, { error: '의견을 입력해주세요.' }).max(4000, { error: '4000자 이내로 입력해주세요.' }),
})

const { register, control, handleSubmit, formState: { errors } } = useForm<OpnnRegValues>({
  resolver: zodResolver(opnnRegSchema),
  mode: 'onSubmit', reValidateMode: 'onBlur',
  shouldFocusError: false,   // 라디오/셀렉트/파일 행은 ref 가 없어 자동 포커스가 안 됨 → 한 경로로 통일
  defaultValues: { opnnSeCd: '', opnnCn: '' },
})

// 첫 에러 필드 하나만 focusField — 앵커는 <div id={\`field-\${name}\`}>. window.scrollTo 금지.
const onInvalid = (errs: FieldErrors<OpnnRegValues>) => {
  const first = (['opnnSeCd', 'opnnCn'] as const).find((k) => errs[k])
  if (first) focusField(\`field-\${first}\`)
}

<div id="field-opnnSeCd">
  <InputLabel required>의견구분</InputLabel>
  <Controller name="opnnSeCd" control={control} render={({ field }) => (   // Radix 그룹은 Controller
    <RadioButtonGroup items={OPNN_SE} value={field.value} onValueChange={field.onChange} />
  )} />
  {errors.opnnSeCd && <InputMessage type="error">{errors.opnnSeCd.message}</InputMessage>}
</div>

<div id="field-opnnCn">
  {/* 네이티브 입력은 register. maxLength 는 내장 기본값(InputBox 100 / TextArea 4000) */}
  <TextArea {...register('opnnCn')} error={Boolean(errors.opnnCn)} />
  {errors.opnnCn && <InputMessage type="error">{errors.opnnCn.message}</InputMessage>}
</div>

<Button variant="primary" onClick={handleSubmit(onValid, onInvalid)}>등록</Button>`

/** 10. {도메인}Queries 훅 패턴 — 근거: queries/tss/cm/{tssCmKeys,tssCmQueries}.ts · services/tss/cm.ts · docs/rules/api.md */
export const SNIPPET_QUERIES = `// ── services/tss/cm.ts — URL 은 서비스 함수 안에만(EP 맵 없음). USE_MOCK 로 목업/실호출 분기. ──
export const tssCmService = {
  /** no.925 공지사항목록조회(MUI-CM-04-M01) */
  async selectNoticeList(params: MockBoardListRequest): Promise<MockNoticeListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.noticeList)
    return apiClient.post<MockNoticeListItem[], MockNoticeListItem[]>(
      '/tss/cm/board/selectNoticeList.do', params)   // 전 API POST 통일
  },
}

// ── queries/tss/cm/tssCmKeys.ts — ['{도메인}', 함수명, 파라미터] 3단. ──
export const tssCmKeys = {
  selectNoticeList: (req: MockBoardListRequest) => ['tssCm', 'selectNoticeList', req] as const,
  selectNoticeDtl: (contsNo: string) => ['tssCm', 'selectNoticeDtl', contsNo] as const,
}

// ── queries/tss/cm/tssCmQueries.ts — 훅명 = use + 서비스 함수명. ──
export const tssCmQueries = {
  useSelectNoticeList(req: MockBoardListRequest = {}) {
    return useQuery({ queryKey: tssCmKeys.selectNoticeList(req), queryFn: () => tssCmService.selectNoticeList(req) })
  },
  useSelectNoticeDtl(contsNo: string) {
    return useQuery({
      queryKey: tssCmKeys.selectNoticeDtl(contsNo),
      queryFn: () => tssCmService.selectNoticeDtl(contsNo),
      enabled: Boolean(contsNo),        // state 유실 시 빈 id 로 요청 나가지 않게
    })
  },
}

// ── 저장/제출은 useMutation — 무효화는 훅의 onSuccess 에서 중앙 처리한다. ──
// (실제 사례: queries/bds/bd/bdQueries.ts useSignElsgn — 서명 성공 시 입찰진행목록 캐시 무효화)
export const bdQueries = {
  useSignElsgn() {
    return useMutation({
      mutationFn: ({ certId, pbancNo }: { certId: string; pbancNo: string }) =>
        bdService.signElsgn(certId, pbancNo),
      // 전역 staleTime 60s 라 화면에서 재조회해도 안 바뀐다 → 변경 지점에서 무효화.
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: bdKeys.selectBidPrgrsListForBzentyAll }),
    })
  },
}

// ── 페이지 — 서비스/URL 직접 import 금지. 훅만 쓴다. ──
const { data: list, isLoading } = tssCmQueries.useSelectNoticeList()
const stateItem = useLocation().state as MockNoticeListItem | null
const { data: detail } = tssCmQueries.useSelectNoticeDtl(stateItem?.contsNo ?? '')`

/** 10. 목록 → 상세 흐름 다이어그램(텍스트) — 근거: docs/rules/api.md "목록 → 상세 데이터 전달" */
export const DIAGRAM_LIST_DETAIL = `[목록 페이지]  NoticeListPage
     │  tssCmQueries.useSelectNoticeList(req)
     │      └─ tssCmKeys.selectNoticeList(req) → tssCmService.selectNoticeList(req)
     │             └─ USE_MOCK ? MOCK_CM.noticeList : POST /tss/cm/board/selectNoticeList.do
     │  CardList items={list.map(toCard)} loading={isLoading}
     │
     ▼  카드 클릭 — navigate(ROUTES.NOTICE_DTL, { state: item })
        ※ URL 에 식별자 금지(고정 경로 + state). 상세 라우트는 path 변수·쿼리를 쓰지 않는다.

[상세 페이지]  NoticeDtlPage
     │  const stateItem = useLocation().state as MockNoticeListItem | null
     │  ① state 항목으로 제목·작성일 즉시 렌더(placeholder)
     │  ② tssCmQueries.useSelectNoticeDtl(stateItem?.contsNo ?? '')  → 본문·첨부 채움
     │     (훅은 가드보다 위에서 무조건 호출 — hooks-order)
     ▼  state 없으면(직접 URL 진입) <Navigate to={ROUTES.NOTICE_LIST} replace />

[저장/제출]  useMutation 훅 → await mutateAsync(payload)
     └─ onSuccess 에서 invalidateQueries(['tssCm', 'selectNoticeList']) — 목록 캐시 갱신`
