import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// 광역 그물 — 컴포넌트 카탈로그(/guide)를 한 번에 검사.
// /guide 는 모든 base/composites 컴포넌트의 모든 상태를 한 페이지에 결정적으로 렌더하므로,
// 이 스펙 하나로 "전 컴포넌트가 터지지 않고 렌더되는지 + 접근성 위반이 없는지"를 커버한다.
// 컴포넌트를 새로 추가해도 /guide 에 등록만 하면 이 그물에 자동 포함된다.
test.describe('/guide 광역 스모크', () => {
  test('전 컴포넌트 섹션 렌더 + 런타임 에러 없음', async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text())
    })
    page.on('pageerror', (e) => pageErrors.push(e.message))

    await page.goto('/guide')

    // /guide 는 lazy 라우트(Suspense) → 첫 섹션이 실제로 렌더될 때까지 대기.
    const sections = page.locator('section[id]')
    await expect(sections.first()).toBeVisible({ timeout: 15_000 })

    // 모든 컴포넌트 섹션(<section id>)이 DOM 에 렌더됐는지.
    const count = await sections.count()
    expect(count).toBeGreaterThan(10) // 카탈로그가 정상 렌더됐다는 하한선

    // 각 섹션이 비어있지 않게 렌더(빈 노드/언마운트 아님).
    for (let i = 0; i < count; i++) {
      await expect(sections.nth(i)).toBeVisible()
    }

    // 렌더 중 미처리 예외(컴포넌트 크래시)는 0 이어야 한다.
    expect(pageErrors, pageErrors.join('\n')).toEqual([])
    // React 경고 포함 콘솔 에러도 0 (key 누락·prop 타입 등 회귀 감지).
    expect(consoleErrors, consoleErrors.join('\n')).toEqual([])
  })

  // 접근성(axe) — critical 차단 게이트. 단 'button-name' 은 제외한다:
  // /guide 가 컨트롤(Switch/Select 등)을 라벨 없이 단독 시연해 생기는 카탈로그 노이즈이며,
  // 실제 앱에선 InputLabel 연결로 이름이 생겨 위반이 아니다. serious 이하는 리포트(비차단).
  const CATALOG_NOISE_RULES = ['button-name']

  test('접근성(axe) — critical 차단 [button-name 제외]', async ({ page }) => {
    await page.goto('/guide')
    await expect(page.locator('section[id]').first()).toBeVisible({ timeout: 15_000 })
    const results = await new AxeBuilder({ page }).analyze()

    const by = (impact: string) => results.violations.filter((v) => v.impact === impact)
    const fmt = (vs: typeof results.violations) =>
      vs.map((v) => `${v.id}(${v.nodes.length})`).join(', ') || '없음'

    // 차단 대상 = critical 중 카탈로그 노이즈 제외.
    const blocking = by('critical').filter((v) => !CATALOG_NOISE_RULES.includes(v.id))

    // 리포트(비차단) — 가시화만.
    console.log(
      [
        '[axe /guide a11y]',
        `  차단(critical, button-name 제외): ${fmt(blocking)}`,
        `  비차단 button-name: ${fmt(by('critical').filter((v) => CATALOG_NOISE_RULES.includes(v.id)))}`,
        `  비차단 serious : ${fmt(by('serious'))}`,
        `  비차단 moderate: ${fmt(by('moderate'))}`,
      ].join('\n'),
    )

    expect(blocking, fmt(blocking)).toEqual([])
  })
})
