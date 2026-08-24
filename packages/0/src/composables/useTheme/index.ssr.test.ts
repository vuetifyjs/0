/**
 * SSR-specific tests for useTheme composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { createTheme, useTheme } from './index'

describe('useTheme SSR', () => {
  it('does not throw when called without a provider', () => {
    expect(() => useTheme()).not.toThrow()
  })

  it('isDark defaults to false in SSR fallback', () => {
    const ctx = useTheme()

    expect(ctx.isDark.value).toBe(false)
  })

  it('colors returns an empty object in SSR fallback', () => {
    const ctx = useTheme()

    expect(ctx.colors.value).toEqual({})
  })

  it('two calls without a provider return distinct fallback instances', () => {
    const first = useTheme()
    const second = useTheme()

    expect(first).not.toBe(second)
  })

  it('should keep default selected while following system on the server', () => {
    const theme = createTheme({
      default: 'dark',
      system: { light: 'light', dark: 'dark' },
      themes: {
        light: { dark: false, colors: { primary: '#fff' } },
        dark: { dark: true, colors: { primary: '#000' } },
      },
    })

    expect(theme.isSystem.value).toBe(true)
    expect(theme.selectedId.value).toBe('dark')
  })
})
