import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, shallowRef } from 'vue'

// Mock v0 dependencies
const mockIsDark = shallowRef(false)
const mockSelect = vi.fn((name: string) => {
  mockIsDark.value = name === 'dark'
})

vi.mock('@vuetify/v0', () => ({
  IN_BROWSER: true,
  useTheme: () => ({
    isDark: mockIsDark,
    select: mockSelect,
    cycle: () => {
      mockIsDark.value = !mockIsDark.value
    },
  }),
  useStorage: () => ({
    get: () => shallowRef(null),
    set: vi.fn(),
  }),
  usePrefersDark: () => ({
    matches: shallowRef(false),
  }),
}))

describe('useThemeToggle', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
    mockIsDark.value = false
    mockSelect.mockClear()

    // Reset singleton state by re-importing
    // The module uses a shared `initialized` flag, so we reset it
    vi.resetModules()
  })

  afterEach(() => {
    scope.stop()
  })

  it('mode starts as system', async () => {
    const { useThemeToggle: fresh } = await import('./useThemeToggle')
    scope.run(() => {
      const { mode } = fresh()
      expect(mode.value).toBe('system')
    })
  })

  it('toggle() cycles system → light → dark → system', async () => {
    const { useThemeToggle: fresh } = await import('./useThemeToggle')
    scope.run(() => {
      const { mode, toggle } = fresh()

      expect(mode.value).toBe('system')

      toggle()
      expect(mode.value).toBe('light')

      toggle()
      expect(mode.value).toBe('dark')

      toggle()
      expect(mode.value).toBe('system')
    })
  })

  it('setMode() sets a specific mode', async () => {
    const { useThemeToggle: fresh } = await import('./useThemeToggle')
    scope.run(() => {
      const { mode, setMode } = fresh()

      setMode('dark')
      expect(mode.value).toBe('dark')

      setMode('light')
      expect(mode.value).toBe('light')

      setMode('system')
      expect(mode.value).toBe('system')
    })
  })

  it('isDark reflects resolved dark state', async () => {
    const { useThemeToggle: fresh } = await import('./useThemeToggle')
    scope.run(() => {
      const { isDark, setMode } = fresh()

      // System mode with prefersDark false → not dark
      expect(isDark.value).toBe(false)

      // Set to dark mode — mock select will set mockIsDark
      setMode('dark')
      // The watch is async, but isDark reads from theme.isDark directly
      // Force the mock state
      mockIsDark.value = true
      expect(isDark.value).toBe(true)

      mockIsDark.value = false
      expect(isDark.value).toBe(false)
    })
  })
})
