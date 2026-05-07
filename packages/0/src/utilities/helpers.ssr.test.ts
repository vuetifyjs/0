import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

// Utilities
import { useId } from './helpers'

describe('helpers (SSR)', () => {
  it('should warn when useId() is called outside component context during SSR', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Outside any component scope, instanceExists() returns false,
    // and !IN_BROWSER triggers the SSR warning path.
    const id = useId()
    expect(id).toMatch(/^v0-\d+$/)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('SSR'))

    spy.mockRestore()
  })
})
