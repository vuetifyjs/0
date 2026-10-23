/**
 * SSR branch of PlainDateAdapter. `vi.mock` is file-wide, so this stays
 * out of plain.test.ts.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { PlainDateAdapter } from './plain'

describe('plainDateAdapter SSR', () => {
  it('should use local epoch midnight when there is no browser clock', () => {
    const date = new PlainDateAdapter().date()

    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(1970)
    expect(date!.getMonth()).toBe(0)
    expect(date!.getDate()).toBe(1)
    expect(date!.getHours()).toBe(0)
  })
})
