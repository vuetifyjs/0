import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, shallowRef } from 'vue'

// Mock v0 dependencies
vi.mock('@vuetify/v0', () => {
  const storage = new Map<string, unknown>()

  return {
    createContext: (key: string) => {
      let stored: unknown
      return [
        // useContext — returns the stored value
        () => {
          if (!stored) throw new Error(`Context "${key}" not provided`)
          return stored
        },
        // provideContext — stores and returns the value
        (value: unknown) => {
          stored = value
          return value
        },
      ] as const
    },
    isNullOrUndefined: (v: unknown) => v === null || v === undefined,
    useStorage: () => ({
      get: <T>(key: string) => shallowRef(storage.get(key) as T ?? null),
      set: <T>(key: string, value: T) => storage.set(key, value),
      remove: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      has: (key: string) => storage.has(key),
    }),
    usePrefersReducedMotion: () => ({
      matches: shallowRef(false),
    }),
  }
})

describe('useSettings', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
    vi.resetModules()
  })

  afterEach(() => {
    scope.stop()
  })

  it('has correct default values', async () => {
    const { provideSettings } = await import('./useSettings')
    scope.run(() => {
      const settings = provideSettings()

      expect(settings.lineWrap.value).toBe(false)
      expect(settings.reduceMotion.value).toBe('system')
      expect(settings.packageManager.value).toBe('pnpm')
    })
  })

  it('open() sets isOpen to true', async () => {
    const { provideSettings } = await import('./useSettings')
    scope.run(() => {
      const settings = provideSettings()

      expect(settings.isOpen.value).toBe(false)
      settings.open()
      expect(settings.isOpen.value).toBe(true)
    })
  })

  it('close() sets isOpen to false', async () => {
    const { provideSettings } = await import('./useSettings')
    scope.run(() => {
      const settings = provideSettings()

      settings.open()
      expect(settings.isOpen.value).toBe(true)

      settings.close()
      expect(settings.isOpen.value).toBe(false)
    })
  })

  it('toggle() flips isOpen', async () => {
    const { provideSettings } = await import('./useSettings')
    scope.run(() => {
      const settings = provideSettings()

      expect(settings.isOpen.value).toBe(false)

      settings.toggle()
      expect(settings.isOpen.value).toBe(true)

      settings.toggle()
      expect(settings.isOpen.value).toBe(false)
    })
  })

  it('reset() restores defaults', async () => {
    const { provideSettings } = await import('./useSettings')
    scope.run(() => {
      const settings = provideSettings()

      settings.lineWrap.value = true
      settings.reduceMotion.value = 'on'
      settings.packageManager.value = 'yarn'

      settings.reset()

      expect(settings.lineWrap.value).toBe(false)
      expect(settings.reduceMotion.value).toBe('system')
      expect(settings.packageManager.value).toBe('pnpm')
    })
  })

  it('hasChanges reflects drift from defaults', async () => {
    const { provideSettings } = await import('./useSettings')
    scope.run(() => {
      const settings = provideSettings()

      expect(settings.hasChanges.value).toBe(false)

      settings.lineWrap.value = true
      expect(settings.hasChanges.value).toBe(true)

      settings.lineWrap.value = false
      expect(settings.hasChanges.value).toBe(false)

      settings.packageManager.value = 'npm'
      expect(settings.hasChanges.value).toBe(true)

      settings.reset()
      expect(settings.hasChanges.value).toBe(false)
    })
  })
})
