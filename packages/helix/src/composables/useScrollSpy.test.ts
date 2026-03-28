import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Mock v0 dependencies before importing the composable
vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    IN_BROWSER: true,
    useWindowEventListener: vi.fn(),
  }
})

// Composables
import { useScrollSpy } from './useScrollSpy'

describe('useScrollSpy', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
  })

  it('activeId starts as undefined', () => {
    scope.run(() => {
      const { activeId } = useScrollSpy()
      expect(activeId.value).toBeUndefined()
    })
  })

  it('register adds an element to tracking', () => {
    scope.run(() => {
      const { register, size } = useScrollSpy()
      const el = document.createElement('div')

      register('section-1', el)

      expect(size.value).toBe(1)
    })
  })

  it('register replaces an existing element with the same id', () => {
    scope.run(() => {
      const { register, size } = useScrollSpy()
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')

      register('section-1', el1)
      register('section-1', el2)

      expect(size.value).toBe(1)
    })
  })

  it('unregister removes an element and resets activeId if it matched', () => {
    scope.run(() => {
      const { register, unregister, size, activeId } = useScrollSpy()
      const el = document.createElement('div')

      register('section-1', el)
      expect(size.value).toBe(1)

      // Simulate activeId being set to this element
      // We can't trigger IntersectionObserver in happy-dom,
      // so we test that unregister clears activeId when it matches
      ;(activeId as { value: string | undefined }).value = 'section-1'
      unregister('section-1')

      expect(size.value).toBe(0)
      expect(activeId.value).toBeUndefined()
    })
  })

  it('unregister does nothing for unknown ids', () => {
    scope.run(() => {
      const { unregister, size } = useScrollSpy()

      unregister('nonexistent')

      expect(size.value).toBe(0)
    })
  })

  it('clear resets everything', () => {
    scope.run(() => {
      const { register, clear, size, activeId } = useScrollSpy()
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')

      register('section-1', el1)
      register('section-2', el2)
      expect(size.value).toBe(2)

      clear()

      expect(size.value).toBe(0)
      expect(activeId.value).toBeUndefined()
    })
  })

  it('size reflects registered element count', () => {
    scope.run(() => {
      const { register, unregister, size } = useScrollSpy()

      expect(size.value).toBe(0)

      register('a', document.createElement('div'))
      expect(size.value).toBe(1)

      register('b', document.createElement('div'))
      expect(size.value).toBe(2)

      unregister('a')
      expect(size.value).toBe(1)
    })
  })
})
