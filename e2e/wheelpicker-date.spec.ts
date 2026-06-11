import { test, expect, type Locator } from '@playwright/test'

// WheelPicker 날짜 데모(년/월/일) 거동 검증 — /guide 의 'WheelPicker > 년/월/일 (date)' 데모.
// 확인 항목:
//   1) 일 컬럼 항목 수가 선택된 년/월의 실제 일수(28~31, 윤년 반영)와 같다.
//   2) 년/월을 바꿔 현재 일이 말일을 넘으면 말일로 클램프된다.
// 휠 아이템은 onClick 으로 직접 onChange 를 호출하므로(스크롤 시뮬레이션 불필요) 결정적이다.
test.describe('/guide WheelPicker 날짜 휠', () => {
  test('년/월에 따라 일수 변동 + 말일 클램프(윤년 포함)', async ({ page }) => {
    await page.goto('/guide')
    await expect(page.locator('section[id]').first()).toBeVisible({ timeout: 15_000 })

    // '일' 컬럼을 가진 WheelPicker(날짜 데모) 루트로 스코프 — 년/월만 있는 데모와 구분.
    const wheel = page
      .locator('div.w-fit')
      .filter({ has: page.locator('[role="listbox"][aria-label="일"]') })
      .first()
    await expect(wheel).toBeVisible()

    const yearList = wheel.locator('[role="listbox"][aria-label="연도"]')
    const monthList = wheel.locator('[role="listbox"][aria-label="월"]')
    const dayList = wheel.locator('[role="listbox"][aria-label="일"]')
    // 데모 루트(WheelPicker + JSON code) → 상태값 code. 휠 루트의 부모.
    const code = wheel.locator('xpath=..').locator('code')
    const dayCount = () => dayList.getByRole('option').count()
    // 옵션 클릭 헬퍼 — 정확 일치(예: '1월' 이 '11월' 에 매칭되지 않게 exact).
    const pick = (list: Locator, name: string) =>
      list.getByRole('option', { name, exact: true }).click()

    // 초기: 2025-08(31일). 일 컬럼 31개.
    await expect(code).toContainText('"year":2025')
    await expect(code).toContainText('"month":8')
    expect(await dayCount()).toBe(31)

    // 일 = 31 선택.
    await pick(dayList, '31일')
    await expect(code).toContainText('"day":31')

    // 월 → 2월(2025, 평년) ⇒ 28일로 클램프 + 일 컬럼 28개.
    await pick(monthList, '2월')
    await expect(code).toContainText('"month":2')
    await expect(code).toContainText('"day":28')
    expect(await dayCount()).toBe(28)

    // 년 → 2024(윤년) ⇒ 2월 29일까지 ⇒ 일 컬럼 29개(현재 28일은 유지).
    await pick(yearList, '2024년')
    await expect(code).toContainText('"year":2024')
    expect(await dayCount()).toBe(29)

    // 29일 선택 후 다시 2025년(평년) ⇒ 28일로 클램프.
    await pick(dayList, '29일')
    await expect(code).toContainText('"day":29')
    await pick(yearList, '2025년')
    await expect(code).toContainText('"year":2025')
    await expect(code).toContainText('"day":28')
    expect(await dayCount()).toBe(28)

    // 월 → 4월(30일) ⇒ 일 컬럼 30개. (28일은 30 이하라 유지)
    await pick(monthList, '4월')
    await expect(code).toContainText('"month":4')
    expect(await dayCount()).toBe(30)
  })
})
