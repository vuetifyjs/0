/**
 * SSR tests for createCalendar.
 *
 * `vi.mock` is file-wide, so the `IN_BROWSER` stub stays out of the browser tests.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', async () => ({
  ...await vi.importActual('#v0/constants/globals'),
  IN_BROWSER: false,
}))

import { createCalendar } from './index'

describe('createCalendar SSR', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 4, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should open on the clock date when the month is omitted', () => {
    const calendar = createCalendar()

    expect(calendar.anchor.value).toBe('2026-08')
    expect(calendar.focused.value).toBe('2026-08-04')
  })
})
