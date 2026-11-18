/**
 * @vitest-environment node
 *
 * Non-iso8601 calendars stay on @js-temporal/polyfill until V8 implements
 * calendar duration math. happy-dom has no Temporal, so the unit project never
 * sees the native engine. This file opts into Node so a persian adapter that
 * stays on globalThis.Temporal fails here. Skips when the runtime has no
 * Temporal of its own (Node 22).
 */
import { Temporal as polyfill } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'

import { Temporal, V0DateAdapter } from './v0'

// Utilities
import { isNullOrUndefined } from '#v0/utilities'

const native = (globalThis as unknown as { Temporal?: typeof polyfill }).Temporal
const hasNative = !isNullOrUndefined(native) && native !== polyfill

describe.skipIf(!hasNative)('v0DateAdapter calendar engine', () => {
  it('should keep iso8601 on the runtime Temporal', () => {
    expect(Temporal).toBe(native)

    const adapter = new V0DateAdapter('en-US')
    const date = adapter.date('2025-06-15T00:00:00')!
    const foreign = polyfill.PlainDateTime.from('2025-06-15T08:00:00')
    const copied = adapter.date(foreign)!

    expect(date).toBeInstanceOf(native!.PlainDateTime)
    expect(adapter.toISO(adapter.addDays(date, 1))).toBe('2025-06-16')
    expect(adapter.isValid(foreign)).toBe(true)
    expect(copied).toBeInstanceOf(native!.PlainDateTime)
    expect(copied.hour).toBe(8)
    expect(adapter.toISO(copied)).toBe('2025-06-15')
  })

  it('should compute a non-iso8601 calendar with the polyfill until V8 implements calendar duration math', () => {
    const persian = new V0DateAdapter('en-US', { calendar: 'persian' })
    const date = persian.date('2025-03-21')!
    const nativeDate = native!.PlainDateTime.from('2025-03-21T15:30:45')
    const adopted = persian.date(nativeDate)!

    expect(date).toBeInstanceOf(polyfill.PlainDateTime)
    expect(date).not.toBeInstanceOf(native!.PlainDateTime)
    expect(persian.isValid(date)).toBe(true)
    expect(persian.isValid(nativeDate)).toBe(true)
    expect(persian.toISO(persian.addMonths(persian.date('2025-02-19')!, 1))).toBe('2025-03-21')
    expect(adopted).toBeInstanceOf(polyfill.PlainDateTime)
    expect([adopted.year, adopted.month, adopted.day, adopted.hour]).toEqual([1404, 1, 1, 15])

    const hebrew = new V0DateAdapter('en-US', { calendar: 'hebrew' })
    const leap = hebrew.date('2024-03-15')!

    expect(hebrew.getMonthArray(leap).map(month => month.monthCode)).toEqual([
      'M01', 'M02', 'M03', 'M04', 'M05', 'M05L', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12',
    ])
    expect(hebrew.toISO(hebrew.endOfYear(leap))).toBe('2024-10-02')
  })
})
