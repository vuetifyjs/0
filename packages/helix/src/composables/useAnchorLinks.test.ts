import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Mock v0 dependencies before importing the composable
vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    IN_BROWSER: true,
    useEventListener: vi.fn(),
    useWindowEventListener: vi.fn(),
  }
})

// Composables
import { useAnchorLinks } from './useAnchorLinks'

describe('useAnchorLinks', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
  })

  it('does not throw when called without options', () => {
    expect(() => {
      scope.run(() => {
        useAnchorLinks()
      })
    }).not.toThrow()
  })

  it('accepts empty options without error', () => {
    expect(() => {
      scope.run(() => {
        useAnchorLinks({})
      })
    }).not.toThrow()
  })
})
