import { test, expect } from '@playwright/test'

// 라우트 광역 스모크 — router.tsx 의 모든 앱 라우트를 URL 로 직접 열어
//   ① 컴포넌트 크래시(pageerror) ② 콘솔 에러(key 누락·prop 타입 등) ③ ErrorPage/404 폴백
// 세 가지를 라우트별 개별 테스트로 검증한다. "화면 하나가 빠졌거나(라우트 미등록→404),
// 열자마자 터지는지(런타임 에러)"를 한 번에 훑는 그물.
//
// 목록→상세는 navigate state 로 항목을 넘긴다(2026-08-12 URL 식별자 제거 — 상세 라우트는
// 파일명 기반 고정 경로). state 없이 직접 URL 진입하면 fallback 목업이 렌더되거나
// 목록으로 <Navigate> 리다이렉트된다 — 어느 쪽이든 ErrorPage/크래시 없음이 이 스모크의 검증 대상.

// router.tsx children 의 op/bd 전 라우트 + 공통 대표(경로 = 화면). '/guide' 는 guide-smoke 가 커버.
const ROUTES: { path: string; name: string }[] = [
  { path: '/', name: '홈(HomePage)' },
  // 조달(op)
  { path: '/op', name: '조달계획 통합목록' },
  { path: '/op/prcmPlanDtl', name: '조달계획 상세' },
  { path: '/op/bfhdSpcfctDtl', name: '사전규격 상세' },
  { path: '/op/ovsPrcmPlanDtl', name: '국외 연간조달계획 상세' },
  // 입찰(bd) — 국내
  { path: '/bd', name: '입찰공고 통합목록' },
  { path: '/bd/opbid', name: '개찰목록' },
  { path: '/bd/prgrs', name: '입찰진행 목록' },
  { path: '/bd/bidPrgsDtlInq', name: '입찰진행 상세' },
  { path: '/bd/wrotAgre', name: '서약서동의' },
  { path: '/bd/bidPrtcpAperWrt', name: '입찰참가신청서 작성' },
  { path: '/bd/bidPrtcpAperDtl', name: '입찰참가신청조회' },
  { path: '/bd/tndrWrt', name: '입찰서 작성' },
  { path: '/bd/tndrInq', name: '입찰서 조회' },
  { path: '/bd/elsgn', name: '전자서명' },
  { path: '/bd/aplyCmptn', name: '신청 완료' },
  { path: '/bd/bfhd-srng-aply', name: '사전심사(PQ) 신청' },
  { path: '/bd/reg-rslt', name: '입찰등록심사 결과조회' },
  { path: '/bd/srng-rslt', name: '사전심사(PQ) 결과조회' },
  { path: '/bd/srng-aply-inq', name: '사전심사신청서 조회' },
  { path: '/bd/bidRsltDtl', name: '입찰결과 상세' },
  { path: '/bd/implt', name: '이행/적격심사 상세' },
  { path: '/bd/bidPbancDtl', name: '입찰공고 상세' },
  // 입찰(bd) — 국외(ovs)
  { path: '/bd/ovs/goal-prc-items', name: '국외 목표가공개품목조회' },
  { path: '/bd/ovs/locker', name: '국외 보관함 목록' },
  { path: '/bd/ovsLockerPbanDtl', name: '국외 보관함 상세' },
  { path: '/bd/ovsLockerItemReg', name: '보관함 품목 관리' },
  { path: '/bd/ovsTmprBidCnReg', name: '입찰내역 작성' },
  { path: '/bd/ovsBidPrtcpAply', name: '국외 입찰참가신청서 작성' },
  { path: '/bd/ovsBidPrtcpApfrDtl', name: '국외 입찰참가신청서 상세' },
  { path: '/bd/ovsTndrSbmsn', name: '국외 입찰서제출' },
  { path: '/bd/ovsTndrDtl', name: '국외 입찰서 상세' },
  { path: '/bd/ovsBidPbancDtl', name: '국외 입찰공고 상세' },
  { path: '/bd/ovsBidRsltDtl', name: '국외 입찰결과 상세' },
  // 대금(wm) — 국외 신규(2026-08-19)
  { path: '/wm/ovsCmdtyRcvCnfdocList', name: '물품수령확인서 목록' },
  { path: '/wm/ovsElcrtTxivDtl', name: '전자계산서 상세' },
  { path: '/wm/ovsRtnPymtDfryInfo', name: '대금지불정보(국외)' },
  { path: '/wm/ovsPymtPrgrsList', name: '대금지급현황' },
  // 공통(cm)
  { path: '/notification', name: '알림현황' },
  { path: '/support', name: '고객센터' },
  { path: '/mypage', name: '마이페이지' },
]

// ErrorPage(에러/404 폴백)가 떴는지 판별하는 타이틀 문구(ErrorPage.tsx).
const ERROR_TITLES = ['페이지를 찾을 수 없습니다.', '페이지를 불러오지 못했습니다.']

test.describe('라우트 광역 스모크', () => {
  for (const { path, name } of ROUTES) {
    test(`${name}  [${path}]`, async ({ page }) => {
      const consoleErrors: string[] = []
      const pageErrors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error') consoleErrors.push(m.text())
      })
      page.on('pageerror', (e) => pageErrors.push(e.message))

      await page.goto(path)

      // lazy 라우트(Suspense) → 페이지 본문(#app-scroll 내부)이 실제로 그려질 때까지 대기.
      // main#app-scroll 은 AppLayout 스크롤 셸 — 라우트가 렌더되면 그 안에 콘텐츠가 붙는다.
      await page.waitForLoadState('networkidle')

      // ① ErrorPage/404 폴백이면 = 라우트 미등록/element 오류/청크 로드 실패.
      for (const t of ERROR_TITLES) {
        await expect(
          page.getByText(t, { exact: true }),
          `ErrorPage 폴백 노출됨 — 라우트 미등록/렌더 실패 의심: ${path}`,
        ).toHaveCount(0)
      }

      // ② 렌더 중 미처리 예외(컴포넌트 크래시)는 0.
      expect(pageErrors, `[${path}] pageerror:\n${pageErrors.join('\n')}`).toEqual([])

      // ③ 콘솔 에러(React key 누락·prop 타입 경고 등 회귀)도 0.
      expect(consoleErrors, `[${path}] console.error:\n${consoleErrors.join('\n')}`).toEqual([])
    })
  }
})
