import { defineConfig, devices } from '@playwright/test'

// E2E/접근성(axe) 검증 — 컴포넌트 카탈로그(/guide)를 타깃으로 한다(결정적 렌더, 라우팅/데이터 flakiness 없음).
// webServer 가 `npm run dev` 를 자동 기동하므로 `npx playwright test` 한 번으로 끝.
// 모바일 하이브리드 앱이라 모바일 뷰포트(Pixel 5, chromium)로 검증.
const PORT = 5173
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // CI: GitHub 어노테이션 + HTML 리포트(아티팩트로 업로드해 다운로드). 로컬: 간단 list.
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL: BASE_URL,
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
  ],
  // dev 서버 자동 기동 — 포트 고정(strictPort)으로 baseURL 과 일치 보장. 이미 떠 있으면 재사용.
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
