/**
 * SSR branch of V0PlainDateAdapter. `vi.mock` is file-wide, so this stays
 * out of plain.test.ts.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { V0PlainDateAdapter } from './plain'

describe('v0PlainDateAdapter SSR', () => {
  it('should use local epoch midnight when there is no browser clock', () => {
    const date = new V0PlainDateAdapter().date()

    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(1970)
    expect(date!.getMonth()).toBe(0)
    expect(date!.getDate()).toBe(1)
    expect(date!.getHours()).toBe(0)

    const parsed = new V0PlainDateAdapter().date('2026-02-01')

    expect(parsed!.getFullYear()).toBe(2026)
    expect(parsed!.getMonth()).toBe(1)
    expect(parsed!.getDate()).toBe(1)
  })
})
