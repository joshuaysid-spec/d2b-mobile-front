/**
 * UsageGuidePage — 개발자용 "사용 가이드" (공통 컴포넌트를 쓰는 규약).
 * `/guide`(ComponentGuidePage)가 "모양 카탈로그"라면 이 화면은 "계약 · 규칙 · 코드".
 * 모바일 앱 셸(AppLayout) 밖의 최상위 라우트(`/guide/usage`) — PC 해상도 전용. 폐쇄망 반입본에도 함께 들어간다.
 *
 * 각 항목은 5블록 고정: ① 언제 쓰나 ② 최소 코드 ③ 동작 데모 ④ 규칙 · 금지 ⑤ 정본 화면.
 * 코드 스니펫 문자열은 usageGuideSnippets.ts (컴포넌트 파일에서 상수 export 시 react-refresh 경고).
 */
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Controller, useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import { focusField } from '@/utils/focusField'
import { formatFileSize } from '@/utils/format'
import { saveBlob } from '@/utils/download'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { TextArea } from '@/ui/common/base/TextArea'
import { AgreementList } from '@/ui/common/composites/AgreementList'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { CardList, type CardListItem } from '@/ui/common/composites/CardList'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { SearchCondition } from '@/ui/common/composites/SearchCondition'
import { StepBar, type StepItem } from '@/ui/common/composites/StepBar'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table } from '@/ui/common/composites/Table'
import { Toast } from '@/ui/common/composites/Toast'
import { FileAdd, type FileAddDoneFile, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import { OzReportFullPopup } from '@/ui/biz/cm/ozReport/OzReportFullPopup'
import { useOzReport } from '@/ui/biz/cm/ozReport/useOzReport'
import { SearchFilter } from '@/ui/biz/cm/search/SearchFilter'
import type { SearchFilterSchema, SearchFilterValue } from '@/types/search-filter'
import type { UploadedFile } from '@/types/file'
import {
  DIAGRAM_LIST_DETAIL,
  SNIPPET_AGREEMENT,
  SNIPPET_DATA_VIEWS,
  SNIPPET_FILE_ADD,
  SNIPPET_FILE_DOWNLOAD,
  SNIPPET_OZ_REPORT,
  SNIPPET_POPUPS,
  SNIPPET_QUERIES,
  SNIPPET_SEARCH_FILTER,
  SNIPPET_VALIDATION,
  SNIPPET_WIZARD,
} from '@/ui/dev/usageGuideSnippets'

const NAV = [
  { id: 'searchfilter', label: '1. SearchFilter' },
  { id: 'fileadd', label: '2. FileAdd' },
  { id: 'filedownload', label: '3. FileDownloadList' },
  { id: 'ozreport', label: '4. OzReport' },
  { id: 'popups', label: '5. 팝업 3종' },
  { id: 'wizard', label: '6. 스텝 마법사' },
  { id: 'agreement', label: '7. AgreementList' },
  { id: 'dataviews', label: '8. Table · CardList' },
  { id: 'validation', label: '9. 검증 · 포커스' },
  { id: 'queries', label: '10. Queries 훅' },
]

export function UsageGuidePage() {
  return (
    <div className="min-h-screen bg-muted">
      {/* 헤더 — 우측에 카탈로그/사용 가이드 상호 이동 링크 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1200px] items-baseline gap-3 px-8 py-5">
          <h1 className="text-krds-heading-md font-bold text-foreground">D2B 사용 가이드</h1>
          <span className="text-krds-body-sm text-krds-text-muted">
            공통 컴포넌트를 쓰는 규약 · 코드 · 동작
          </span>
          <nav className="ml-auto flex items-center gap-1 self-center">
            <Link
              to={ROUTES.GUIDE}
              className="rounded-krds-sm px-3 py-1 text-krds-body-sm text-krds-text-muted hover:bg-muted hover:text-krds-text-primary"
            >
              카탈로그
            </Link>
            <span className="text-krds-text-disabled">|</span>
            <Link
              to={ROUTES.GUIDE_USAGE}
              aria-current="page"
              className="rounded-krds-sm bg-krds-bg-primary-subtle px-3 py-1 text-krds-body-sm font-bold text-krds-text-primary"
            >
              사용 가이드
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] gap-8 px-8 py-10">
        {/* 좌측 목차 */}
        <nav className="sticky top-24 hidden h-fit w-44 shrink-0 lg:block">
          <p className="mb-3 text-krds-label-xs font-bold uppercase text-krds-text-subtle">Usage</p>
          <ul className="flex flex-col gap-0.5">
            {NAV.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-krds-sm px-3 py-1.5 text-krds-body-sm text-krds-text-muted hover:bg-muted hover:text-krds-text-primary"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 본문 */}
        <main className="flex min-w-0 flex-1 flex-col gap-12">
          <Section
            id="searchfilter"
            title="1. SearchFilter + SearchCondition"
            when="목록 화면의 상세 검색필터는 새로 만들지 않고 cm 의 SearchFilter 셸을 쓴다. 페이지는 어떤 필드를 그릴지 schema 로 선언만 하고, 컨트롤 렌더와 검증은 셸이 맡는다. 필드 정의의 required · minLength · maxLength · pattern 에서 zod 스키마가 자동 생성되므로 페이지에서 zod 를 직접 쓰지 않는다. [검색]이 통과하면 onSearch 로 확정값이 내려오고, 그 값이 곧 목록 조회 훅의 파라미터가 된다."
            code={SNIPPET_SEARCH_FILTER}
            rules={[
              '검색필터 페이지에서 zod 스키마를 직접 만들지 말 것 — required 를 쓰는 14개 화면이 무수정으로 유지되는 구조(셸 자동 생성)를 깬다.',
              'required 이상의 규칙이 필요하면 필드 정의 옵션 → cm/search/searchFilterSchema.ts 의 buildZodSchema 매핑에 추가한다(페이지에 규칙 로직 금지).',
              '공통 검색 바텀시트(품목별·생산자·발주부서 등)는 셸이 직접 소유 — 필드에 searchSheet 종류만 선언하고, 페이지는 시트를 import 하지 않는다.',
              "checkbox '전체' 칩은 PC 웹 전송 규격에 맞춰 selectAll: { value: '0' } 로 코드값을 갖는다.",
              '빠른검색(SearchCondition)은 입력 중 거르지 않고 검색 실행 시에만 appliedSearch 로 확정한다.',
              '페이지→셸 명령형 제어가 필요하면 SearchFilterHandle(ref — submit/reset)을 쓴다.',
              '[검색] 버튼은 draft 가 defaultValue 와 다를 때만 활성된다 — defaultValue 를 실제 초기 상태와 맞춰 둔다.',
              'text 필드 형식 검사는 pattern: { regex, message } 로 선언한다. 값이 있을 때만 검사하고 빈값은 required 만 본다(선택 항목을 비워 두면 통과).',
              '검사 시점은 두 가지다 — pattern 은 [검색] 누를 때, allowedChars(문자 클래스 /[A-Z0-9-]/i)는 타이핑 즉시 차단. 보통 같은 문자 집합으로 둘 다 준다. 전체 형식(^…$)은 타이핑 중 판정이 불가하니 pattern 에만.',
              '정규식에 g/y 플래그를 붙이지 말 것 — 마지막 매치 위치를 기억해 같은 객체로 반복 검사하면 결과가 번갈아 어긋난다(셸이 떼고 DEV 경고). i 는 괜찮다.',
              '검색어 필드는 일부 입력이 가능하므로 전체 형식(^…$ 고정)보다 허용 문자 집합으로 거는 편이 안전하다 — 적용 예: 국외 보관함 목록·품목 관리의 번호 필드.',
            ]}
            refs={[
              'src/ui/biz/cm/search/SearchFilter.tsx',
              'src/ui/biz/cm/search/searchFilterSchema.ts',
              'src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx',
            ]}
          >
            <SearchFilterDemo />
          </Section>

          <Section
            id="fileadd"
            title="2. FileAdd (파일 첨부)"
            when="파일 첨부가 필요한 모든 화면은 공통 FileAdd 콘텐츠를 BottomSheet 안에 넣어 쓴다. 파일을 고르는 즉시 RaonK 업로드가 시작되고(파일당 1요청 순차 큐) 응답 UploadedFile 이 항목의 uploaded 에 통째로 보관된다. [완료]는 업로드가 끝난 파일만 부모에게 넘기며, 부모는 거기서 guid 를 꺼내 등록 API 에 다른 항목과 함께 보낸다."
            code={SNIPPET_FILE_ADD}
            rules={[
              'BottomSheet 컨테이너 · 타이틀 · footer 는 부모가 소유한다 — FileAdd 전용 *Sheet 래퍼를 만들지 말 것.',
              'onComplete 의 files 는 uploaded 응답을 통째로 담고 있다. guid 만 뽑아 따로 보관하지 말고 응답 객체를 그대로 들고 다닌다(응답 필드가 늘면 types/file.ts 만 확장).',
              '서류명이 정해진 자리는 fixedDocNm, 항목이 정해진 자리는 docNmOptions, 자유 입력은 둘 다 생략한다.',
              '업로드 중 · 실패 건이 있으면 complete() 가 false 를 반환해 [완료]가 막힌다 — 부모는 반환값을 보고 닫는다.',
              '건당 10MB 검증은 services/tss/fb 의 validateFile 이 처리한다(화면에서 크기 검사 로직을 다시 쓰지 말 것).',
              '시트에서 X 삭제 시 이미 올라간 파일은 서버에서도 제거된다(useRemoveFile) — 화면이 별도로 정리할 필요 없다.',
            ]}
            refs={[
              'src/ui/biz/cm/fileAdd/FileAdd.tsx',
              'src/ui/biz/bd/ovsBidPrtcpAply/Stp3.tsx',
              'docs/02-design/features/file-upload.design.md',
            ]}
          >
            <FileAddDemo />
          </Section>

          <Section
            id="filedownload"
            title="3. FileDownloadList + fbQueries"
            when="첨부서류 목록과 내려받기는 FileDownloadList + fbQueries.useDownloadFile 조합 하나로 통일한다. 훅이 돌려준 Blob 을 utils/download 의 saveBlob 에 넘기면 저장이 끝난다. 하이브리드 앱 WebView 에서 blob: 다운로드가 막히면 saveBlob 안에서만 네이티브 브리지로 분기하면 되므로, 화면마다 저장 코드를 짜지 않는다."
            code={SNIPPET_FILE_DOWNLOAD}
            rules={[
              '저장 로직을 화면에 직접 쓰지 말 것 — createObjectURL/<a download> 는 saveBlob 안에만 존재한다.',
              'mutateAsync 는 실패 시 throw 한다 — try/catch 로 받아 Toast 나 AlertModal 로 안내한다.',
              '행 key 는 파일명이 아니라 고유 id(guid)를 쓴다. 파일명은 중복될 수 있다.',
              'GUID·응답 필드명은 아직 잠정이다 — 임시로 채워 넣은 자리에는 ⚠️ 주석을 남기고 반입 후 실응답으로 교체한다.',
              '용량 표시는 formatFileSize(bytes) 로 만든다(직접 KB/MB 계산 금지).',
              '업로드 목록 용도로 쓸 때는 항목에 onRemove / status / onRetry 를 주면 같은 컴포넌트가 진행·재시도 UI 를 그린다.',
            ]}
            refs={[
              'src/queries/tss/fb/fbQueries.ts',
              'src/utils/download.ts',
              'src/ui/common/composites/FileDownloadList.tsx',
            ]}
          >
            <FileDownloadDemo />
          </Section>

          <Section
            id="ozreport"
            title="4. OzReportFullPopup + useOzReport"
            when="[출력] · [등록증 발급] 처럼 OZ 리포트를 띄우는 자리는 전부 useOzReport 훅 + OzReportFullPopup 한 쌍으로 처리한다. 화면은 리포트 ID 와 파라미터만 알면 되고, 뷰어 스크립트 로드와 OZ 서버 통신은 OzReportViewer 안에 갇혀 있다. 개발망에서는 뷰어 환경변수가 비어 있어 요청 정보만 보여주는 자리 화면이 뜬다."
            code={SNIPPET_OZ_REPORT}
            rules={[
              '설계서에 출력 확인 팝업(P14 유형)이 있는 화면은 버튼에서 바로 열지 말고 AlertModal 확인을 거친 뒤 oz.open 한다.',
              '리포트 ID 가 설계서에 없으면 화면 ID 로 잠정 지정하고 ⚠️ 주석을 남긴다.',
              '뷰어 div id 는 OZ 규격상 고정이라 동시에 뷰어 1개만 뜬다 — 한 화면에서 팝업 인스턴스를 여럿 두지 말 것.',
              '반입 후 할 일은 .env.production 의 VITE_OZ_VIEWER_URL · VITE_OZ_SERVLET_URL 기입뿐이며 사용 화면은 무수정이다.',
              'oz.popupProps 를 그대로 펼쳐 넘긴다(request/onOpenChange 를 직접 조립하지 말 것).',
            ]}
            refs={[
              'src/ui/biz/cm/ozReport/useOzReport.ts',
              'src/ui/biz/cm/ozReport/OzReportFullPopup.tsx',
              'src/ui/biz/cm/ozReport/OzReportViewer.tsx',
            ]}
          >
            <OzReportDemo />
          </Section>

          <Section
            id="popups"
            title="5. BottomSheet / FullPopup / AlertModal"
            when="선택 · 검색 · 짧은 입력은 BottomSheet, 상세나 여러 섹션의 긴 폼은 FullPopup, 예/아니오 확인은 AlertModal 이다. 셋 다 컨테이너는 부모(페이지 또는 탭 콘텐츠)가 직접 렌더하고, 그 안에 콘텐츠만 분리한 컴포넌트를 끼워 넣는다. 셋은 Radix Dialog 라 서로 겹쳐 띄울 수 있고, 닫힘 경로는 dismissable 로 정해진다(BottomSheet · FullPopup 은 기본 true, AlertModal 은 기본 false)."
            code={SNIPPET_POPUPS}
            rules={[
              '새 BottomSheet · AlertModal 에 *Sheet 전용 래퍼를 만들지 말 것 — 래퍼를 만드는 컨테이너는 FullPopup 하나뿐이다.',
              'open · onOpenChange · title · footer 는 부모가 소유한다. 콘텐츠 컴포넌트는 이 props 를 갖지 않는다.',
              '액션 버튼은 footer 슬롯에 둔다 — 스크롤 본문에 두면 overflow 로 하단 border 가 잘린다.',
              'BottomSheet 본문에는 이미 좌우 16px 패딩이 있다 — 콘텐츠에 px-* 를 또 주지 말 것(SummaryInfo 는 flushX, AccordionSection 은 flush).',
              'AlertModal 의 primaryAction 은 선택이다. 미주입 시 버튼 영역이 사라지고 titleClose 의 X 닫기만 남는 안내형이 된다.',
              '단순 확인은 description 으로 끝내고 별도 콘텐츠 컴포넌트를 만들지 않는다.',
              'AlertModal 의 dismissable 은 기본 false — 확인 모달은 버튼으로만 닫힌다. Esc · 바깥클릭을 허용하려면 명시해야 한다.',
            ]}
            refs={[
              'src/ui/common/composites/BottomSheet.tsx',
              'src/ui/common/composites/FullPopup.tsx',
              'src/ui/biz/op/prcmPlanDtl/PrcmPlanDtl.tsx',
            ]}
          >
            <PopupDemo />
          </Section>

          <Section
            id="wizard"
            title="6. StepBar + 스텝 마법사 폼"
            when="탭이 곧 스텝인 신청서 화면(입찰참가신청서 등)은 폼을 페이지로 올리지 않는다. 입력 탭마다 자기 useForm 과 스키마를 갖고 submit() 만 ref 로 노출하며, 페이지의 [다음으로]는 현재 탭만 검증한다. 통과하면 페이지가 확정값을 보관하고 다음 탭으로 넘어가고, 되돌아오면 보관값을 defaultValues 로 재주입해 탭 언마운트로 값이 사라지지 않게 한다."
            code={SNIPPET_WIZARD}
            rules={[
              '탭별 스키마는 폴더 하나의 Xxx.schema.ts 에 모으고, 목업 · 초기값 상수는 xxxMock.ts 에 둔다(컴포넌트 파일에 상수를 두면 react-refresh 경고).',
              '검증 실패 시 탭을 이동하지 않는다 — 탭 안 첫 에러 필드로 포커스 + 스크롤만 한다.',
              '조회 전용 탭은 검증 없이 통과시킨다.',
              '신청 마법사 스텝(서약서→신청서→서명→제출)의 StepBar 는 expandable={false} — 진행현황 바텀시트를 띄우지 않는다.',
              '페이지는 확정값만 보관한다. 페이지에서 탭의 폼 상태를 들여다보거나 제어하지 말 것.',
              '탭 콘텐츠 파일명에 Page 접미사를 붙이지 않는다(페이지만 Page).',
            ]}
            refs={[
              'src/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAplyPage.tsx',
              'src/ui/biz/bd/ovsBidPrtcpAply/Stp3.tsx',
              'src/ui/biz/bd/ovsRlsVltrnsNgtnEtdcSbmsnPage/OvsRlsVltrnsNgtnEtdcSbmsn3.tsx',
            ]}
          >
            <WizardDemo />
          </Section>

          <Section
            id="agreement"
            title="7. AgreementList (동의 목록)"
            when="서약서 동의 · 약관 동의처럼 체크리스트를 확인받는 자리는 AgreementList 를 쓴다. 체크 목록도 폼 값이므로 useState 수동 검증이 아니라 zod 배열 refine 으로 필수 동의를 검사한다. 항목 행을 누르면 상세를 열어야 하는데, 동의서 본문 시트는 각 페이지가 소유하고 컴포넌트는 onView(id) 로 위임만 한다."
            code={SNIPPET_AGREEMENT}
            rules={[
              '필수 동의 검사는 z.array(z.string()).refine(...) — 체크 개수를 세는 if 문을 화면에 짜지 말 것.',
              'AgreementList 에는 RHF ref 가 없다 → shouldFocusError: false 로 끄고 focusField 앵커(div id="field-…")로 포커스를 통일한다.',
              'reValidateMode: onChange 로 두면 체크하는 즉시 에러가 사라진다.',
              '동의서 본문 바텀시트는 페이지가 소유한다 — 항목마다 전용 시트 컴포넌트를 만들지 않는다.',
              '항목 id 는 설계서 화면 P번호 등 안정적 식별자를 쓴다(인덱스 금지).',
              'requirement 를 생략하면 [필수]/[선택] 태그 없이 제목만 나온다.',
            ]}
            refs={[
              'src/ui/common/composites/AgreementList.tsx',
              'src/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAply.schema.ts',
              'src/utils/focusField.ts',
            ]}
          >
            <AgreementDemo />
          </Section>

          <Section
            id="dataviews"
            title="8. Table / CardList / SummaryInfo"
            when="표와 필드는 마크업을 복제하지 않고 데이터 배열로 구동한다. Table 은 행마다 type 으로 값 표현을 고르고, CardList 는 목록 데이터를 카드 props 로 바꾸는 매핑 함수 하나만 있으면 된다. 국내·국외·공사처럼 구조가 같고 값만 다른 화면은 페이지를 복제하지 말고 데이터만 갈아끼운다."
            code={SNIPPET_DATA_VIEWS}
            rules={[
              "Table 의 type: 'date' 는 숫자만 뽑아 8자리는 yyyy-mm-dd, 6자리는 yyyy-mm 으로 포맷한다 — 화면에서 날짜 문자열을 직접 자르지 말 것.",
              "값이 버튼 · 여러 줄 등 ReactNode 면 type: 'combination' 을 쓴다. 금액 · 수량은 'number'(우측 정렬).",
              'CardList 항목의 id 는 안정적 고유 식별자여야 한다 — key={i} 금지.',
              'loading 과 emptyText 는 CardList 가 같은 안내 화면으로 처리한다(페이지에서 빈 목록 분기를 다시 짜지 말 것).',
              '카드 클릭 라우팅은 데이터 필드로 분기한다 — 라벨 문자열 비교 분기 금지.',
              '다중 선택 카드는 Card 의 titleTrailing 슬롯에 Checkbox 를 넣는 형태 하나로 통일한다.',
            ]}
            refs={[
              'src/ui/common/composites/Table.tsx',
              'src/ui/common/composites/CardList.tsx',
              'src/ui/biz/op/prcmPlanIntgList/PrcmPlanIntgListPage.tsx',
            ]}
          >
            <DataViewsDemo />
          </Section>

          <Section
            id="validation"
            title="9. 검증 · 포커스 (RHF + zod 2레인)"
            when="검증 엔진은 react-hook-form + zod 하나이고 레인은 둘뿐이다. 입력 폼(신청서 · 의견등록 등)은 zod 스키마를 직접 작성하고, 검색필터는 셸이 필드 정의에서 스키마를 자동 생성한다. 제3의 방식(useState 수동 검증 등)을 만들지 않는다. 한 폼에 입력류와 Radix 그룹이 섞이면 자동 포커스를 끄고 focusField 한 경로로 통일한다."
            code={SNIPPET_VALIDATION}
            rules={[
              'zod v4 — 에러 메시지는 { error: "…" } 이다(구 message: 아님). 형식 검사는 z.email() 등 top-level.',
              "트리거는 mode: 'onSubmit' + reValidateMode: 'onBlur' 로 고정한다.",
              '네이티브 입력(InputBox/TextArea)은 register, Radix 그룹(Checkbox/RadioButtonGroup/CheckboxGroup)과 마스킹 입력은 Controller 로 연결한다.',
              'Radix 그룹 · 셀렉트 · 파일 행은 ref 가 없어 자동 포커스가 안 된다 → shouldFocusError: false + focusField 앵커. window.scrollTo 금지.',
              "숫자 · 전화 · 영문 입력은 InputBox 의 inputType('numeric' | 'tel' | 'english')만 넘긴다 — 거르기 · IME 가드 · 키패드는 내부 처리다.",
              'maxLength 는 InputBox 100 · TextArea 4000 이 기본값이다. 더 짧아야 하는 항목만 명시하고, 같은 값을 zod .max() 에도 둔다(붙여넣기는 타이핑 제한을 우회).',
            ]}
            refs={[
              'docs/rules/forms.md',
              'src/utils/focusField.ts',
              'src/ui/biz/op/prcmPlanDtl/PrcmPlan_NotiAply.schema.ts',
            ]}
          >
            <ValidationDemo />
          </Section>

          <Section
            id="queries"
            title="10. {도메인}Queries 훅 패턴"
            when="페이지는 서비스를 직접 import 하지 않는다. 모든 API 호출은 {도메인}Queries 훅을 거치며, 서비스 · 훅 · 쿼리키가 같은 함수명을 공유해 어느 층에서 grep 해도 1:1 로 추적된다. 목업과 실호출 전환은 서비스의 USE_MOCK 분기가 담당하므로 페이지에는 목업도 URL 도 남지 않는다."
            code={SNIPPET_QUERIES}
            rules={[
              '폴더는 services/{대메뉴}/{도메인}.ts · queries/{대메뉴}/{도메인}/{도메인}{Keys,Queries}.ts. 대메뉴는 백엔드 URL 1단(bds · cbs · cts · tss)이다.',
              '함수명 = 백엔드 메서드명(URL 마지막 세그먼트). 백엔드 오타도 그대로 보존해 추적을 깨지 않는다. 훅명은 use + 함수명.',
              '쿼리키는 [도메인, 함수명, 파라미터] 3단을 유지한다 — 도메인 전체 무효화와 함수 prefix 무효화가 모두 가능해야 한다.',
              '제출 성공 시 캐시 무효화는 mutation 훅의 onSuccess 에서 중앙 처리한다. 전역 staleTime 이 60초라 화면에서 재조회해도 갱신되지 않는다(목업 모드에선 안 드러나는 잠복 버그).',
              '일반 갱신은 invalidateQueries 를 쓴다. removeQueries 는 로그아웃처럼 더 보이면 안 되는 캐시 폐기 전용이다.',
              '사실상 불변인 공통코드 · 부서목록은 staleTime: Infinity 로 개별 오버라이드한다.',
              '상세 이동은 고정 경로 + navigate(state) — URL 에 식별자(path 변수 · 쿼리)를 노출하지 않는다.',
            ]}
            refs={[
              'src/queries/tss/cm/tssCmQueries.ts',
              'src/services/tss/cm.ts',
              'src/ui/biz/cm/noticeList/NoticeListPage.tsx',
            ]}
            extra={
              <Row label="목록 → 상세 흐름">
                <Code>{DIAGRAM_LIST_DETAIL}</Code>
              </Row>
            }
          />
        </main>
      </div>
    </div>
  )
}

/* ── 1. SearchFilter 데모 ──────────────────────────────────────────── */

const SF_DEFAULT: SearchFilterValue = {
  pbancDt: { start: '', end: '' },
  pbancNm: '',
  pbancNo: '',
  pbancNoFull: '',
}
const SF_SCHEMA: SearchFilterSchema = {
  title: '입찰공고 검색필터',
  sections: [
    {
      key: 'cond',
      title: '검색조건',
      fields: [
        { key: 'pbancDt', type: 'dateRange', label: '공고일자', required: true },
        {
          key: 'pbancNm',
          type: 'text',
          label: '공고명',
          placeholder: '공고명을 입력하세요.',
          minLength: 2,
          maxLength: 50,
        },
        {
          key: 'pbancNo',
          type: 'text',
          label: '공고번호',
          placeholder: '영문·숫자·하이픈만 통과 (예: 2026LGM-01)',
          allowedChars: /[A-Z0-9-]/i, // 타이핑 즉시 차단 — 한글·특수문자는 입력이 안 된다
          pattern: { regex: /^[A-Z0-9-]+$/i, message: '영문·숫자·하이픈(-)만 입력할 수 있습니다.' },
        },
        {
          // 전체 형식 고정 예 — 4자리 연도 + 영문 3 + 숫자 9(국내 공고번호 '2026LGM000604191').
          //   ^…$ 로 고정하면 일부 입력('2026LGM')은 통과하지 못한다 — 정확한 번호를 요구하는 자리에만.
          key: 'pbancNoFull',
          type: 'text',
          label: '공고번호(전체 형식)',
          placeholder: '2026LGM000604191 형식만 통과',
          pattern: {
            regex: /^\d{4}[A-Z]{3}\d{9}$/,
            message: "공고번호는 '2026LGM000604191' 형식(연도4+영문3+숫자9)으로 입력해주세요.",
          },
        },
      ],
    },
  ],
}
const SF_TARGETS = [
  { value: 'pbancNm', label: '공고명' },
  { value: 'pbancNo', label: '공고번호' },
]

function SearchFilterDemo() {
  const [open, setOpen] = useState(false)
  const [targets, setTargets] = useState<string[]>(['pbancNm'])
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<SearchFilterValue>(SF_DEFAULT)
  const [result, setResult] = useState<string | null>(null)

  return (
    <DemoFrame note="[검색]은 값이 기본값과 달라져야 활성된다. 공고명만 채우고 [검색]을 누르면 required 인 공고일자에서 셸이 자동 생성한 zod 가 막고, 공고명을 1자만 넣으면 minLength 2 에 걸린다.">
      <SearchCondition
        targets={SF_TARGETS}
        selectedTargets={targets}
        onTargetsChange={setTargets}
        keyword={keyword}
        onKeywordChange={setKeyword}
        onFilterClick={() => setOpen(true)}
        filterActive={result !== null}
        onSearch={() => setResult(JSON.stringify({ targets, keyword }, null, 2))}
      />
      <SearchFilter
        open={open}
        onOpenChange={setOpen}
        schema={SF_SCHEMA}
        value={filter}
        defaultValue={SF_DEFAULT}
        onSearch={(v) => {
          setFilter(v)
          setResult(JSON.stringify(v, null, 2))
        }}
      />
      {result && <Code>{`onSearch 확정값\n${result}`}</Code>}
    </DemoFrame>
  )
}

/* ── 2. FileAdd 데모 ──────────────────────────────────────────────── */

function FileAddDemo() {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileAddDoneFile[]>([])
  const fileAddRef = useRef<FileAddHandle>(null)

  return (
    <DemoFrame note="목업 업로드라 실제 서버 전송은 없고, 400ms 뒤 GUID 가 발급된다. [완료]는 업로드가 끝난 파일만 넘긴다.">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Icon name="Add" />
        파일 추가
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="파일 추가"
        footer={
          <ButtonGroup
            layout="split"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setOpen(false) },
              {
                label: '완료',
                variant: 'primary',
                onClick: () => {
                  if (fileAddRef.current?.complete()) setOpen(false)
                },
              },
            ]}
          />
        }
      >
        <FileAdd
          ref={fileAddRef}
          fixedDocNm="연대보증서"
          onComplete={({ files: done }) => setFiles(done)}
        />
      </BottomSheet>
      {files.length > 0 && (
        <Table
          rows={files.map((f) => ({
            label: f.uploaded.orgnlFileNm,
            value: f.uploaded.guid,
          }))}
        />
      )}
    </DemoFrame>
  )
}

/* ── 3. FileDownloadList 데모 ─────────────────────────────────────── */

// 목업 첨부 — 파일명에 '샘플' 표기(목업 모드에서도 실제로 디스크에 저장된다).
const DEMO_ATCH: UploadedFile[] = [
  {
    guid: '5f3c1d20-7a41-4b08-9f6d-2c1e8b0a44d1',
    orgnlFileNm: '샘플_입찰공고문.pdf',
    fileSz: 318_464,
  },
  {
    guid: '9b27e4a8-31c6-4e5f-8a70-6d4f2c9e1b03',
    orgnlFileNm: '샘플_물품규격서.hwp',
    fileSz: 1_258_291,
  },
]

function FileDownloadDemo() {
  const downloadFile = fbQueries.useDownloadFile()
  const [toastOpen, setToastOpen] = useState(false)

  const download = async (guid: string, fileName: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileName)
    } catch {
      setToastOpen(true)
    }
  }

  return (
    <DemoFrame note="목업 모드에서도 saveBlob 이 실제 저장을 트리거한다 — 내려받은 파일명은 '샘플_' 로 시작한다.">
      <FileDownloadList
        files={DEMO_ATCH.map((f) => ({
          id: f.guid,
          name: f.orgnlFileNm,
          size: formatFileSize(f.fileSz),
          onDownload: () => void download(f.guid, f.orgnlFileNm),
        }))}
        onDownloadAll={() => DEMO_ATCH.forEach((f) => void download(f.guid, f.orgnlFileNm))}
      />
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        파일을 내려받지 못했습니다.
      </Toast>
    </DemoFrame>
  )
}

/* ── 4. OzReport 데모 ─────────────────────────────────────────────── */

function OzReportDemo() {
  const oz = useOzReport()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <DemoFrame note="개발망에는 OZ 뷰어 환경변수가 없어 팝업 안에 요청 정보(리포트 ID · 파라미터)만 표시된다. 반입 후 같은 자리에 뷰어가 뜬다.">
      <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
        <Icon name="Print" />
        출력
      </Button>
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="출력하시겠습니까?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '확인',
          onClick: () => oz.open('PVB021', { rcptNo: '2026 120 0042' }, '군수품무역대리업 등록증'),
        }}
      />
      <OzReportFullPopup {...oz.popupProps} />
    </DemoFrame>
  )
}

/* ── 5. 팝업 3종 데모 ─────────────────────────────────────────────── */

const DEMO_ANL_ROWS = [
  { label: '판단번호', value: '4000A-2026-0117' },
  { label: '조달명', value: '2026 K5 방독면 수리부속(구매)' },
  { label: '발주예정월', value: '2026-03' },
]

function PopupDemo() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [stackedOpen, setStackedOpen] = useState(false)

  return (
    <DemoFrame note="시트를 열고 안에서 [삭제]를 누르면 AlertModal 이 시트 위에 스택된다. 모달은 dismissable 기본 false 라 Esc·바깥클릭으로 닫히지 않고 버튼으로만 닫힌다(시트는 기본 true).">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => setSheetOpen(true)}>
          BottomSheet
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setPopupOpen(true)}>
          FullPopup
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setAlertOpen(true)}>
          AlertModal
        </Button>
      </div>

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="연관 조달계획"
        footer={
          <ButtonGroup
            layout="split"
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => setSheetOpen(false) },
              { label: '삭제', variant: 'primary', onClick: () => setStackedOpen(true) },
            ]}
          />
        }
      >
        {/* 콘텐츠만 — 시트/footer/open 은 부모(여기)가 소유한다. */}
        <Table rows={DEMO_ANL_ROWS} />
      </BottomSheet>

      <FullPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        title="의견 등록"
        rightActions={[{ icon: 'Close', label: '닫기', onClick: () => setPopupOpen(false) }]}
        footer={
          <Button variant="primary" className="w-full" onClick={() => setPopupOpen(false)}>
            등록
          </Button>
        }
      >
        <div className="flex flex-col gap-2 p-4">
          <InputLabel required>의견 내용</InputLabel>
          <TextArea placeholder="의견을 입력하세요." rows={5} />
        </div>
      </FullPopup>

      <AlertModal
        open={alertOpen}
        onOpenChange={setAlertOpen}
        variant="check"
        title="의견이 등록되었습니다."
        primaryAction={{ label: '확인' }}
      />

      <AlertModal
        open={stackedOpen}
        onOpenChange={setStackedOpen}
        variant="error"
        title="삭제하시겠습니까?"
        description="삭제된 데이터는 복구할 수 없습니다."
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '삭제', onClick: () => setSheetOpen(false) }}
      />
    </DemoFrame>
  )
}

/* ── 6. 스텝 마법사 데모 ──────────────────────────────────────────── */

const demoStp1Schema = z.object({
  bzentyNm: z.string().min(1, { error: '업체명을 입력해주세요.' }),
  bzentyCd: z
    .string()
    .min(1, { error: '업체코드를 입력해주세요.' })
    .max(5, { error: '업체코드는 5자리 이내로 입력해주세요.' }),
})
type DemoStp1Values = z.infer<typeof demoStp1Schema>
const DEMO_STP1_DEFAULT: DemoStp1Values = { bzentyNm: '', bzentyCd: '' }

interface DemoStp1Handle {
  submit: () => void
}
interface DemoStp1Props {
  defaultValues: DemoStp1Values
  onSubmit: (values: DemoStp1Values) => void
}

// 스텝(탭) — 자기 useForm 을 갖고 submit() 만 노출. 페이지는 확정값만 받는다.
const DemoStp1 = forwardRef<DemoStp1Handle, DemoStp1Props>(function DemoStp1(
  { defaultValues, onSubmit },
  ref,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoStp1Values>({
    resolver: zodResolver(demoStp1Schema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    defaultValues,
  })
  const onInvalid = (errs: FieldErrors<DemoStp1Values>) =>
    focusField(`field-${errs.bzentyNm ? 'bzentyNm' : 'bzentyCd'}`)

  useImperativeHandle(ref, () => ({
    submit: () => void handleSubmit(onSubmit, onInvalid)(),
  }))

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <div id="field-bzentyNm" className="flex flex-col gap-2">
        <InputLabel required>업체명</InputLabel>
        <InputBox
          {...register('bzentyNm')}
          error={Boolean(errors.bzentyNm)}
          placeholder="업체명을 입력하세요."
        />
        {errors.bzentyNm && <InputMessage type="error">{errors.bzentyNm.message}</InputMessage>}
      </div>
      <div id="field-bzentyCd" className="flex flex-col gap-2">
        <InputLabel required>업체코드</InputLabel>
        <InputBox
          {...register('bzentyCd')}
          error={Boolean(errors.bzentyCd)}
          inputType="english"
          maxLength={5}
          placeholder="5자리"
        />
        {errors.bzentyCd && <InputMessage type="error">{errors.bzentyCd.message}</InputMessage>}
      </div>
    </form>
  )
})

function WizardDemo() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<DemoStp1Values>(DEMO_STP1_DEFAULT)
  const stp1Ref = useRef<DemoStp1Handle>(null)

  const steps: StepItem[] = [
    { label: '업체정보', state: step === 0 ? 'doing' : 'done' },
    { label: '확인', state: step === 0 ? 'todo' : 'doing' },
  ]

  return (
    <DemoFrame note="스텝1을 비우고 [다음으로]를 누르면 이동하지 않고 첫 에러로 포커스된다. 통과 후 [이전]으로 돌아오면 입력값이 그대로 남는다.">
      <StepBar orientation="horizontal" expandable={false} items={steps} />
      {step === 0 ? (
        <DemoStp1
          ref={stp1Ref}
          defaultValues={values}
          onSubmit={(v) => {
            setValues(v)
            setStep(1)
          }}
        />
      ) : (
        <Table
          rows={[
            { label: '업체명', value: values.bzentyNm },
            { label: '업체코드', value: values.bzentyCd },
          ]}
        />
      )}
      <ButtonGroup
        layout="split"
        items={[
          {
            label: '이전',
            variant: 'secondary',
            disabled: step === 0,
            onClick: () => setStep(0),
          },
          {
            label: step === 0 ? '다음으로' : '제출',
            variant: 'primary',
            onClick: () => (step === 0 ? stp1Ref.current?.submit() : setStep(0)),
          },
        ]}
      />
    </DemoFrame>
  )
}

/* ── 7. AgreementList 데모 ────────────────────────────────────────── */

const DEMO_AGREE_ITEMS = [
  { id: 'P03', title: '청렴 계약 이행 서약서', requirement: 'required' as const },
  { id: 'P04', title: '국방규격 및 계약이행 가능성 확인 동의', requirement: 'required' as const },
  { id: 'P05', title: '하도급대금의 지급관련 확인 및 확약서', requirement: 'optional' as const },
]
const DEMO_AGREE_REQUIRED = DEMO_AGREE_ITEMS.filter((i) => i.requirement === 'required').map(
  (i) => i.id,
)
const demoAgreeSchema = z.object({
  agreed: z.array(z.string()).refine((ids) => DEMO_AGREE_REQUIRED.every((id) => ids.includes(id)), {
    error: '필수 서약서에 동의해주세요.',
  }),
})
type DemoAgreeValues = z.infer<typeof demoAgreeSchema>

function AgreementDemo() {
  const [viewTarget, setViewTarget] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const { watch, setValue, handleSubmit, formState } = useForm<DemoAgreeValues>({
    resolver: zodResolver(demoAgreeSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: { agreed: [] },
  })
  const agreed = watch('agreed')
  const setAgreed = (next: string[]) => setValue('agreed', next, { shouldValidate: true })
  const error = formState.errors.agreed?.message
  const onSubmit = handleSubmit(
    () => setDone(true),
    () => focusField('field-agreed'),
  )

  return (
    <DemoFrame note="필수 2건을 모두 체크해야 제출된다. 항목 행을 누르면 본문 시트가 열리고, 시트는 이 데모(부모)가 소유한다.">
      <div id="field-agreed">
        <AgreementList
          items={DEMO_AGREE_ITEMS}
          checked={agreed}
          onToggle={(id, on) =>
            setAgreed(on ? [...new Set([...agreed, id])] : agreed.filter((v) => v !== id))
          }
          onCheckAll={(on) => setAgreed(on ? DEMO_AGREE_ITEMS.map((i) => i.id) : [])}
          onView={(id) => setViewTarget(id)}
        />
      </div>
      {error && <InputMessage type="error">{error}</InputMessage>}
      <Button variant="primary" onClick={() => void onSubmit()}>
        제출
      </Button>

      <BottomSheet
        open={viewTarget !== null}
        onOpenChange={(o) => !o && setViewTarget(null)}
        title={DEMO_AGREE_ITEMS.find((i) => i.id === viewTarget)?.title ?? ''}
        onConfirm={() => {
          if (viewTarget) setAgreed([...new Set([...agreed, viewTarget])])
        }}
        confirmLabel="동의"
      >
        <p className="py-4 text-krds-body-sm leading-relaxed text-krds-text-muted">
          본 서약서 본문은 각 페이지가 소유하는 콘텐츠 자리입니다. [동의]를 누르면 목록 체크가
          반영되고 폼 값이 갱신되어 에러가 즉시 해제됩니다.
        </p>
      </BottomSheet>

      <AlertModal
        open={done}
        onOpenChange={setDone}
        variant="check"
        title="동의가 완료되었습니다."
        primaryAction={{ label: '확인' }}
      />
    </DemoFrame>
  )
}

/* ── 8. Table / CardList / SummaryInfo 데모 ───────────────────────── */

interface DemoPbanc {
  pbancNo: string
  pbancNm: string
  taskSeNm: string
  pbancDt: string
  clsgDt: string
}
const DEMO_PBANC_LIST: DemoPbanc[] = [
  {
    pbancNo: '2026A1200042',
    pbancNm: '2026 K5 방독면 수리부속(구매)',
    taskSeNm: '국내',
    pbancDt: '2026-03-12',
    clsgDt: '2026-03-26 11:00',
  },
  {
    pbancNo: '2026A1200078',
    pbancNm: '전술차량용 타이어 정비부속 구매',
    taskSeNm: '국외',
    pbancDt: '2026-03-15',
    clsgDt: '2026-03-30 11:00',
  },
]
const toCard = (it: DemoPbanc): CardListItem => ({
  id: it.pbancNo,
  badges: (
    <Badge type="pastel" color={it.taskSeNm === '국외' ? 'red' : 'blue'}>
      {it.taskSeNm}
    </Badge>
  ),
  subtitle: `공고번호 ${it.pbancNo}`,
  title: it.pbancNm,
  rows: [
    { label: '공고일자', value: it.pbancDt },
    { label: '마감일시', value: it.clsgDt },
  ],
})

function DataViewsDemo() {
  const [loading, setLoading] = useState(false)
  return (
    <DemoFrame note="같은 데이터 배열이 Table · CardList · SummaryInfo 세 표현을 모두 구동한다. [로딩 전환]은 CardList 의 loading 안내를 보여준다.">
      <SummaryInfo
        badges={[
          { key: 'task', label: '국내' },
          { key: 'ctrt', label: '수의계약', color: 'red' },
        ]}
        subtitle="판단번호 4000A-2026-0117"
        title="2026 K5 방독면 수리부속(구매)"
        rows={[
          { label: '발주예정월', value: '2026-03' },
          { label: '예산금액', value: '225,337,550 원' },
        ]}
      />
      <Table
        rows={[
          { label: '공고번호', value: '2026A1200042' },
          { label: '공고일자', value: '20260312', type: 'date' },
          { label: '추정가격', value: '225,337,550 원', type: 'number' },
          {
            label: '첨부',
            value: (
              <Button size="sm" variant="inner">
                보기
              </Button>
            ),
            type: 'combination',
          },
        ]}
      />
      <Button variant="secondary" size="sm" onClick={() => setLoading((v) => !v)}>
        로딩 전환
      </Button>
      <CardList
        items={DEMO_PBANC_LIST.map(toCard)}
        loading={loading}
        emptyText="조회된 공고가 없습니다."
      />
    </DemoFrame>
  )
}

/* ── 9. 검증 · 포커스 데모 ────────────────────────────────────────── */

const DEMO_OPNN_SE = [
  { value: 'spec', label: '규격 의견' },
  { value: 'price', label: '가격 의견' },
  { value: 'etc', label: '기타' },
]
const demoOpnnSchema = z.object({
  opnnSeCd: z.string().min(1, { error: '의견구분을 선택해주세요.' }),
  opnnCn: z
    .string()
    .min(10, { error: '의견은 10자 이상 입력해주세요.' })
    .max(4000, { error: '4000자 이내로 입력해주세요.' }),
})
type DemoOpnnValues = z.infer<typeof demoOpnnSchema>
const DEMO_OPNN_ORDER = ['opnnSeCd', 'opnnCn'] as const

function ValidationDemo() {
  const [saved, setSaved] = useState<DemoOpnnValues | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoOpnnValues>({
    resolver: zodResolver(demoOpnnSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    // 라디오(Controller)와 텍스트(register)가 섞여 있어 자동 포커스를 끄고 focusField 한 경로로 통일.
    shouldFocusError: false,
    defaultValues: { opnnSeCd: '', opnnCn: '' },
  })
  const onInvalid = (errs: FieldErrors<DemoOpnnValues>) => {
    const first = DEMO_OPNN_ORDER.find((k) => errs[k])
    if (first) focusField(`field-${first}`)
  }

  return (
    <DemoFrame note="아무것도 입력하지 않고 [등록]을 누르면 첫 에러(의견구분 라디오)로 포커스 + 스크롤된다. 라디오만 고르고 다시 누르면 다음 에러로 옮겨간다.">
      <div id="field-opnnSeCd" className="flex flex-col gap-2">
        <InputLabel required>의견구분</InputLabel>
        <Controller
          name="opnnSeCd"
          control={control}
          render={({ field }) => (
            <RadioButtonGroup
              aria-label="의견구분"
              items={DEMO_OPNN_SE}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        {errors.opnnSeCd && <InputMessage type="error">{errors.opnnSeCd.message}</InputMessage>}
      </div>
      <div id="field-opnnCn" className="flex flex-col gap-2">
        <InputLabel required>의견 내용</InputLabel>
        <TextArea
          {...register('opnnCn')}
          error={Boolean(errors.opnnCn)}
          rows={4}
          placeholder="10자 이상 입력하세요."
        />
        {errors.opnnCn && <InputMessage type="error">{errors.opnnCn.message}</InputMessage>}
      </div>
      <Button variant="primary" onClick={() => void handleSubmit(setSaved, onInvalid)()}>
        등록
      </Button>
      {saved && <Code>{JSON.stringify(saved, null, 2)}</Code>}
    </DemoFrame>
  )
}

/* ── 내부 레이아웃 헬퍼 ─────────────────────────────────────────── */

interface SectionProps {
  id: string
  title: string
  /** ① 언제 쓰나 */
  when: string
  /** ② 최소 코드 */
  code: string
  /** ④ 규칙 · 금지 */
  rules: string[]
  /** ⑤ 정본 화면(파일 경로) */
  refs: string[]
  /** ③ 동작 데모 — 없는 항목은 생략 */
  children?: React.ReactNode
  /** 5블록 외 추가 Row(흐름 다이어그램 등) */
  extra?: React.ReactNode
}

function Section({ id, title, when, code, rules, refs, children, extra }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="text-krds-heading-xs font-bold text-foreground">{title}</h3>
      <div className="mt-4 rounded-krds-lg border border-border bg-background px-6">
        <Row label="언제 쓰나">
          <p className="text-krds-body-sm leading-relaxed text-krds-text-muted">{when}</p>
        </Row>
        <Row label="최소 코드">
          <Code>{code}</Code>
        </Row>
        {children && <Row label="동작 데모">{children}</Row>}
        <Row label="규칙 · 금지">
          <ul className="flex flex-col gap-1.5">
            {rules.map((r) => (
              <li
                key={r}
                className="flex gap-2 text-krds-body-sm leading-relaxed text-krds-text-muted"
              >
                <span aria-hidden className="text-krds-text-disabled">
                  ·
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Row>
        <Row label="정본 화면">
          <ul className="flex flex-col gap-1">
            {refs.map((f) => (
              <li key={f} className="font-mono text-krds-label-xs text-krds-text-subtle">
                {f}
              </li>
            ))}
          </ul>
        </Row>
        {extra}
      </div>
    </section>
  )
}

interface RowProps {
  label: string
  children: React.ReactNode
}

function Row({ label, children }: RowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 last:border-0 md:flex-row md:gap-6">
      <div className="w-32 shrink-0 pt-1 text-krds-label-sm font-bold text-krds-text-subtle">
        {label}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
    </div>
  )
}

// 코드/다이어그램 블록 — 문법 강조 라이브러리 없이 문자열 그대로.
// 코드 블록 — 어두운 배경(krds-bg-inverse) + 흰 글자(krds-text-on-inverse), 15px 고정폭.
//   전체 줄 주석은 흐리게 낮춰 코드가 먼저 읽히게 한다(문법 강조 라이브러리 없이 줄 단위 판정 —
//   행 시작만 보므로 문자열 안의 '//'(URL 등)는 건드리지 않는다).
const COMMENT_LINE = /^\s*(\/\/|\/\*|\*)/

function Code({ children }: { children: string }) {
  return (
    <pre className="w-full overflow-x-auto rounded-krds-sm bg-krds-bg-inverse p-5 font-mono text-krds-label-sm leading-relaxed text-krds-text-on-inverse">
      <code>
        {/* 정적 문자열을 줄로 분해 — 행 순서가 바뀌지 않아 index key 사용(목록 데이터 아님).
            줄바꿈은 텍스트 노드로 유지해 빈 줄·복사 붙여넣기가 원본 그대로 나온다. */}
        {children.split('\n').map((line, i) => (
          <span
            key={`${i}:${line}`}
            className={cn(COMMENT_LINE.test(line) && 'text-krds-text-on-inverse/55')}
          >
            {line}
            {'\n'}
          </span>
        ))}
      </code>
    </pre>
  )
}

// 데모 틀 — 모바일 폭(360)으로 좁혀 실제 화면과 같은 조건에서 보이게 하고, 아래에 관전 포인트 한 줄.
function DemoFrame({ note, children }: { note: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          'flex w-full max-w-[360px] flex-col gap-4 rounded-krds-lg border border-border bg-background p-4',
        )}
      >
        {children}
      </div>
      <p className="text-krds-label-xs leading-relaxed text-krds-text-subtle">{note}</p>
    </div>
  )
}
