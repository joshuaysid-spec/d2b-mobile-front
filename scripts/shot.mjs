// 임시 스크린샷 스크립트 — 모바일 뷰포트로 페이지 캡처. (시각 점검용, 커밋 대상 아님)
import { chromium } from '@playwright/test'

const url = process.argv[2] || 'http://localhost:5174/'
const out = process.argv[3] || 'shot.png'
const height = Number(process.argv[4] || 844)

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 390, height },
  deviceScaleFactor: 2,
})
const scrollY = Number(process.argv[5] || 0)
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
if (scrollY) {
  await page.evaluate((y) => {
    document.getElementById('app-scroll')?.scrollTo({ top: y })
  }, scrollY)
  await page.waitForTimeout(400)
}
await page.screenshot({ path: out, fullPage: false })
await browser.close()
console.log('saved', out)
