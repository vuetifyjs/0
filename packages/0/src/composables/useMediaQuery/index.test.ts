import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { nextTick, ref, shallowRef } from 'vue'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
  SUPPORTS_MATCH_MEDIA: true,
}))

vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: shallowRef(true),
  }),
}))

import { useMediaQuery, usePrefersContrast, usePrefersDark, usePrefersReducedMotion } from './index'

describe('useMediaQuery', () => {
  let originalWindow: typeof globalThis.window
  let mockMatchMedia: ReturnType<typeof vi.fn>
  let mockMediaQueryList: {
    matches: boolean
    media: string
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    originalWindow = globalThis.window

    mockMediaQueryList = {
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    mockMatchMedia = vi.fn((query: string) => {
      mockMediaQueryList.media = query
      return mockMediaQueryList
    })
    globalThis.window = {
      matchMedia: mockMatchMedia,
    } as any
  })

  afterEach(() => {
    globalThis.window = originalWindow
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should call matchMedia with the query string', () => {
      useMediaQuery('(min-width: 768px)')

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)')
    })

    it('should return initial matches value', () => {
      mockMediaQueryList.matches = true
      const { matches } = useMediaQuery('(min-width: 768px)')

      expect(matches.value).toBe(true)
    })

    it('should add change event listener', () => {
      useMediaQuery('(min-width: 768px)')

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      )
    })

    it('should expose the MediaQueryList', () => {
      const { mediaQueryList } = useMediaQuery('(min-width: 768px)')

      expect(mediaQueryList.value).toBe(mockMediaQueryList)
    })

    it('should expose the resolved query', () => {
      const { query } = useMediaQuery('(prefers-color-scheme: dark)')

      expect(query.value).toBe('(prefers-color-scheme: dark)')
    })

    it('should expose the media property on MediaQueryList', () => {
      const { mediaQueryList } = useMediaQuery('(min-width: 768px)')

      expect(mediaQueryList.value?.media).toBe('(min-width: 768px)')
    })
  })

  describe('reactive updates', () => {
    it('should update matches when media query changes', () => {
      const { matches } = useMediaQuery('(min-width: 768px)')

      expect(matches.value).toBe(false)

      // Simulate media query change
      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0]![1]
      changeHandler({ matches: true })

      expect(matches.value).toBe(true)
    })

    it('should handle reactive query string', async () => {
      const minWidth = ref(768)
      const { query } = useMediaQuery(() => `(min-width: ${minWidth.value}px)`)

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)')
      expect(query.value).toBe('(min-width: 768px)')

      // Change the query
      minWidth.value = 1024
      await nextTick()

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
      expect(query.value).toBe('(min-width: 1024px)')
    })

    it('should cleanup previous listener when query changes', async () => {
      const queryRef = ref('(min-width: 768px)')
      useMediaQuery(queryRef)

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledTimes(1)

      // Change the query
      queryRef.value = '(min-width: 1024px)'
      await nextTick()

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      )
    })
  })

  describe('lifecycle control', () => {
    it('should expose stop function', () => {
      const { stop } = useMediaQuery('(min-width: 768px)')

      expect(stop).toBeTypeOf('function')
    })

    it('should remove event listener when stop is called', () => {
      const { stop } = useMediaQuery('(min-width: 768px)')

      stop()

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      )
    })

    it('should not register new listeners after stop is called', async () => {
      const queryRef = ref('(min-width: 768px)')
      const { stop } = useMediaQuery(queryRef)

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledTimes(1)

      stop()

      // Change query after stop - should not add new listener
      queryRef.value = '(min-width: 1024px)'
      await nextTick()

      // Should still only have 1 addEventListener call (no new listener after stop)
      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple stop calls gracefully', () => {
      const { stop } = useMediaQuery('(min-width: 768px)')

      expect(() => {
        stop()
        stop()
        stop()
      }).not.toThrow()
    })
  })

  describe('convenience functions', () => {
    it('usePrefersDark should query prefers-color-scheme: dark', () => {
      usePrefersDark()

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })

    it('usePrefersReducedMotion should query prefers-reduced-motion: reduce', () => {
      usePrefersReducedMotion()

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    })

    it('usePrefersContrast should query prefers-contrast: more', () => {
      usePrefersContrast()

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-contrast: more)')
    })

    it('usePrefersDark should return matches when user prefers dark', () => {
      mockMediaQueryList.matches = true
      const { matches } = usePrefersDark()

      expect(matches.value).toBe(true)
    })
  })

  describe('practical examples', () => {
    it('should detect portrait orientation', () => {
      mockMediaQueryList.matches = true
      const { matches } = useMediaQuery('(orientation: portrait)')

      expect(mockMatchMedia).toHaveBeenCalledWith('(orientation: portrait)')
      expect(matches.value).toBe(true)
    })

    it('should detect hover capability', () => {
      mockMediaQueryList.matches = true
      const { matches } = useMediaQuery('(hover: hover)')

      expect(mockMatchMedia).toHaveBeenCalledWith('(hover: hover)')
      expect(matches.value).toBe(true)
    })

    it('should handle complex media queries', () => {
      useMediaQuery('(min-width: 768px) and (max-width: 1024px)')

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1024px)')
    })

    it('should respond to system dark mode toggle', () => {
      const { matches } = usePrefersDark()

      expect(matches.value).toBe(false)

      // User toggles system dark mode
      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0]![1]
      changeHandler({ matches: true })

      expect(matches.value).toBe(true)

      // User toggles back to light mode
      changeHandler({ matches: false })

      expect(matches.value).toBe(false)
    })
  })
})

describe('useMediaQuery hydration', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should defer updates until hydration completes', async () => {
    const hydrationState = shallowRef(false)

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
      SUPPORTS_MATCH_MEDIA: true,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: hydrationState,
      }),
    }))

    const mockMediaQueryList = {
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    globalThis.window = {
      matchMedia: vi.fn(() => mockMediaQueryList),
    } as any

    const { useMediaQuery: useMediaQueryHydration } = await import('./index')
    const { matches } = useMediaQueryHydration('(min-width: 768px)')

    // Before hydration, matches should be false (initial value)
    expect(matches.value).toBe(false)
    expect(window.matchMedia).not.toHaveBeenCalled()

    // Simulate hydration completing
    hydrationState.value = true
    await nextTick()

    // After hydration, matches should update to actual value
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)')
    expect(matches.value).toBe(true)
  })

  it('should apply queued query changes after hydration', async () => {
    const hydrationState = shallowRef(false)

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
      SUPPORTS_MATCH_MEDIA: true,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: hydrationState,
      }),
    }))

    const mockMediaQueryList = {
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    const mockMatchMedia = vi.fn((query: string) => {
      mockMediaQueryList.media = query
      return mockMediaQueryList
    })
    globalThis.window = { matchMedia: mockMatchMedia } as any

    const { useMediaQuery: useMediaQueryHydration } = await import('./index')
    const queryRef = ref('(min-width: 768px)')
    const { query } = useMediaQueryHydration(queryRef)

    // Change query before hydration
    queryRef.value = '(min-width: 1024px)'
    await nextTick()

    // Should not have called matchMedia yet
    expect(mockMatchMedia).not.toHaveBeenCalled()
    expect(query.value).toBe('(min-width: 1024px)')

    // Simulate hydration completing
    hydrationState.value = true
    await nextTick()

    // Should use the latest query value
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
  })
})

describe('useMediaQuery SSR', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return false during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
      SUPPORTS_MATCH_MEDIA: false,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: shallowRef(false),
      }),
    }))

    const { useMediaQuery: useMediaQuerySSR } = await import('./index')
    const { matches } = useMediaQuerySSR('(min-width: 768px)')

    expect(matches.value).toBe(false)
  })

  it('should return null mediaQueryList during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
      SUPPORTS_MATCH_MEDIA: false,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: shallowRef(false),
      }),
    }))

    const { useMediaQuery: useMediaQuerySSR } = await import('./index')
    const { mediaQueryList } = useMediaQuerySSR('(min-width: 768px)')

    expect(mediaQueryList.value).toBe(null)
  })

  it('should not throw when window is undefined', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
      SUPPORTS_MATCH_MEDIA: false,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: shallowRef(false),
      }),
    }))

    const originalWindow = globalThis.window
    delete (globalThis as any).window

    const { useMediaQuery: useMediaQuerySSR } = await import('./index')

    expect(() => {
      useMediaQuerySSR('(min-width: 768px)')
    }).not.toThrow()

    globalThis.window = originalWindow
  })

  it('usePrefersDark should return false during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
      SUPPORTS_MATCH_MEDIA: false,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: shallowRef(false),
      }),
    }))

    const { usePrefersDark: usePrefersDarkSSR } = await import('./index')
    const { matches } = usePrefersDarkSSR()

    expect(matches.value).toBe(false)
  })

  it('should expose stop function during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
      SUPPORTS_MATCH_MEDIA: false,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: shallowRef(false),
      }),
    }))

    const { useMediaQuery: useMediaQuerySSR } = await import('./index')
    const { stop } = useMediaQuerySSR('(min-width: 768px)')

    expect(stop).toBeTypeOf('function')
    expect(() => stop()).not.toThrow()
  })
})

describe('useMediaQuery without matchMedia support', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return false when matchMedia is not supported', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
      SUPPORTS_MATCH_MEDIA: false,
    }))
    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: shallowRef(true),
      }),
    }))

    const { useMediaQuery: useMediaQueryNoSupport } = await import('./index')
    const { matches, mediaQueryList } = useMediaQueryNoSupport('(min-width: 768px)')

    expect(matches.value).toBe(false)
    expect(mediaQueryList.value).toBe(null)
  })
})
