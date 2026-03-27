import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, ref } from 'vue'

// Capture the beforeunload handler
let beforeunloadHandler: (() => void) | undefined

const mockStorage = {
  get: vi.fn(() => ref(null)),
  set: vi.fn(),
  has: vi.fn(() => false),
  remove: vi.fn(),
  clear: vi.fn(),
}

vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    IN_BROWSER: true,
    createStorage: vi.fn(() => mockStorage),
    useWindowEventListener: vi.fn((_event: string, handler: () => void) => {
      beforeunloadHandler = handler
    }),
  }
})

// Composables
import { useScrollPersist } from './useScrollPersist'

describe('useScrollPersist', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
    beforeunloadHandler = undefined
    mockStorage.get.mockClear()
    mockStorage.set.mockClear()
    mockStorage.get.mockReturnValue(ref(null))
  })

  afterEach(() => {
    scope.stop()
  })

  it('calls restore on init', () => {
    scope.run(() => {
      useScrollPersist('test-page')
    })

    expect(mockStorage.get).toHaveBeenCalledWith('test-page', null)
  })

  it('saves position on beforeunload event', () => {
    scope.run(() => {
      useScrollPersist('test-page')
    })

    expect(beforeunloadHandler).toBeDefined()

    // Simulate beforeunload
    beforeunloadHandler!()

    expect(mockStorage.set).toHaveBeenCalledWith('test-page', {
      left: window.scrollX,
      top: window.scrollY,
    })
  })

  it('uses session storage', async () => {
    const { createStorage } = await import('@vuetify/v0')

    scope.run(() => {
      useScrollPersist('test-page')
    })

    expect(createStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        adapter: window.sessionStorage,
        prefix: 'scroll:',
      }),
    )
  })
})
