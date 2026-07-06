import { test, expect } from '@playwright/test'

// 라우트 광역 스모크 — router.tsx 의 모든 앱 라우트를 URL 로 직접 열어
//   ① 컴포넌트 크래시(pageerror) ② 콘솔 에러(key 누락·prop 타입 등) ③ ErrorPage/404 폴백
// 세 가지를 라우트별 개별 테스트로 검증한다. "화면 하나가 빠졌거나(라우트 미등록→404),
// 열자마자 터지는지(런타임 에러)"를 한 번에 훑는 그물.
//
// 목록→상세는 navigate state 로 항목을 넘기지만, 모든 상세는 직접 URL 진입(state 없음)
// 대비 fallback 목업을 갖도록 설계돼 있어(CLAUDE.md "목록→상세 데이터 전달" 표준),
// URL 직접 진입만으로 상단·본문이 렌더된다 → state 없이도 이 스모크가 유효.

// :id 는 목업 fallback 이 도는 임의값(형식만 맞으면 됨).
const ID = '1'

// router.tsx children 의 앱 라우트 전량(경로 = 화면). '/guide' 는 guide-smoke 가 커버하므로 제외.
const ROUTES: { path: string; name: string }[] = [
  { path: '/', name: '홈(HomePage)' },
  // 조달(op)
  { path: '/op', name: '조달계획 통합목록' },
  { path: `/op/${ID}`, name: '조달계획 상세' },
  { path: `/op/spec/${ID}`, name: '사전규격 상세' },
  { path: `/op/ovs/${ID}`, name: '국외 조달계획 상세' },
  // 입찰(bd) — 국내
  { path: '/bd', name: '입찰공고 통합목록' },
  { path: '/bd/opbid', name: '개찰목록' },
  { path: '/bd/prgrs', name: '입찰진행 목록' },
  { path: `/bd/prgrs/${ID}`, name: '입찰진행 상세' },
  { path: `/bd/prgrs/${ID}/apfr`, name: '서약서동의' },
  { path: `/bd/prgrs/${ID}/apfr/form`, name: '입찰참가신청서 작성' },
  { path: `/bd/prgrs/${ID}/tndr-wrt`, name: '입찰서 작성' },
  { path: `/bd/prgrs/${ID}/elsgn`, name: '전자서명' },
  { path: `/bd/prgrs/${ID}/aply-cmptn`, name: '신청 완료' },
  { path: '/bd/bfhd-srng-aply', name: '사전심사(PQ) 신청' },
  { path: '/bd/reg-rslt', name: '입찰등록심사 결과조회' },
  { path: '/bd/srng-rslt', name: '사전심사(PQ) 결과조회' },
  { path: `/bd/result/${ID}`, name: '입찰결과 상세' },
  { path: `/bd/implt/${ID}`, name: '이행/적격심사 상세' },
  { path: `/bd/${ID}`, name: '입찰공고 상세' },
  // 입찰(bd) — 국외(ovs)
  { path: '/bd/ovs/goal-prc-items', name: '국외 목표가공개품목조회' },
  { path: '/bd/ovs/locker', name: '국외 보관함 목록' },
  { path: `/bd/ovs/locker/${ID}`, name: '국외 보관함 상세' },
  { path: `/bd/ovs/locker/${ID}/items`, name: '보관함 품목 관리' },
  { path: `/bd/ovs/locker/${ID}/bid-cn`, name: '입찰내역 작성' },
  { path: `/bd/ovs/locker/${ID}/bfr-bid-cn`, name: '이전공고입찰내역등록' },
  { path: `/bd/ovs/prgrs/${ID}/aply`, name: '국외 입찰참가신청서 작성' },
  { path: `/bd/ovs/prgrs/${ID}/apfr`, name: '국외 입찰참가신청서 상세' },
  { path: `/bd/ovs/prgrs/${ID}/tndr-sbmsn`, name: '국외 입찰서제출' },
  { path: `/bd/ovs/prgrs/${ID}/tndr`, name: '국외 입찰서 상세' },
  { path: `/bd/ovs/${ID}`, name: '국외 입찰공고 상세' },
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
