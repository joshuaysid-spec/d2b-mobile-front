// 웹접근성 자동 스캔 — axe-core(WCAG 2.1 A/AA) 를 각 라우트에 실행. (검증용, 커밋 대상 아님)
import { chromium } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

const base = process.argv[2] || 'http://localhost:5175'
const routes = ['/', '/op', '/op/1', '/notice', '/notification', '/mypage', '/guide']

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})

for (const route of routes) {
  const page = await ctx.newPage()
  try {
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze()

    const v = results.violations
    console.log(`\n===== ${route}  (violations: ${v.length}) =====`)
    for (const item of v) {
      console.log(`  [${item.impact}] ${item.id} — ${item.help}`)
      console.log(`     ${item.helpUrl}`)
      for (const node of item.nodes.slice(0, 4)) {
        console.log(`     · ${node.target.join(' ')}`)
        const msg = (node.failureSummary || '').replace(/\n/g, ' ').slice(0, 160)
        if (msg) console.log(`       ${msg}`)
      }
      if (item.nodes.length > 4) console.log(`     · ...(+${item.nodes.length - 4} more)`)
    }
  } catch (e) {
    console.log(`\n===== ${route}  ERROR: ${e.message} =====`)
  }
  await page.close()
}

await browser.close()
console.log('\n[done]')
