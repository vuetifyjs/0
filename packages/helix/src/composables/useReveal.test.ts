import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Mock IntersectionObserver as a class
const mockDisconnect = vi.fn()
const mockObserve = vi.fn()
let capturedOptions: IntersectionObserverInit | undefined

class MockIntersectionObserver {
  observe = mockObserve
  unobserve = vi.fn()
  disconnect = mockDisconnect

  constructor (_callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    capturedOptions = options
  }

  takeRecords () {
    return [] as IntersectionObserverEntry[]
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// Mock v0 dependencies
vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    IN_BROWSER: true,
  }
})

// Mock onMounted to run callback immediately (no component context needed)
vi.mock('vue', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    onMounted: (fn: () => void) => fn(),
  }
})

// Composables
import { useReveal } from './useReveal'

describe('useReveal', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
    mockDisconnect.mockClear()
    mockObserve.mockClear()
    capturedOptions = undefined
  })

  afterEach(() => {
    scope.stop()
  })

  it('does not throw when called', () => {
    expect(() => {
      scope.run(() => {
        useReveal()
      })
    }).not.toThrow()
  })

  it('default selector is [data-reveal]', () => {
    const spy = vi.spyOn(document, 'querySelectorAll')

    scope.run(() => {
      useReveal()
    })

    expect(spy).toHaveBeenCalledWith('[data-reveal]')
    spy.mockRestore()
  })

  it('default threshold is 0.1', () => {
    scope.run(() => {
      useReveal()
    })

    expect(capturedOptions?.threshold).toBe(0.1)
  })

  it('cleans up observer on scope dispose', () => {
    scope.run(() => {
      useReveal()
    })

    scope.stop()

    expect(mockDisconnect).toHaveBeenCalled()
  })
})
