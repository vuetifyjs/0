import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, shallowRef } from 'vue'

// Mock v0 dependencies
vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    IN_BROWSER: true,
    useWindowEventListener: vi.fn(),
  }
})

// Composables
import { usePopoverPosition } from './usePopoverPosition'

describe('usePopoverPosition', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
  })

  it('position has top and left strings', () => {
    scope.run(() => {
      const anchor = shallowRef<Element | undefined>(undefined)
      const content = shallowRef<Element | undefined>(undefined)

      const { position } = usePopoverPosition({ anchor, content })

      expect(position.value).toHaveProperty('top')
      expect(position.value).toHaveProperty('left')
      expect(typeof position.value.top).toBe('string')
      expect(typeof position.value.left).toBe('string')
    })
  })

  it('position defaults to 0px', () => {
    scope.run(() => {
      const anchor = shallowRef<Element | undefined>(undefined)
      const content = shallowRef<Element | undefined>(undefined)

      const { position } = usePopoverPosition({ anchor, content })

      expect(position.value.top).toBe('0px')
      expect(position.value.left).toBe('0px')
    })
  })

  it('calculate() does not throw when refs are undefined', () => {
    scope.run(() => {
      const anchor = shallowRef<Element | undefined>(undefined)
      const content = shallowRef<Element | undefined>(undefined)

      const { calculate } = usePopoverPosition({ anchor, content })

      expect(() => calculate()).not.toThrow()
    })
  })

  it('calculate() does not throw when only anchor is defined', () => {
    scope.run(() => {
      const anchor = shallowRef<Element | undefined>(document.createElement('div'))
      const content = shallowRef<Element | undefined>(undefined)

      const { calculate } = usePopoverPosition({ anchor, content })

      expect(() => calculate()).not.toThrow()
    })
  })

  it('flipped starts as false', () => {
    scope.run(() => {
      const anchor = shallowRef<Element | undefined>(undefined)
      const content = shallowRef<Element | undefined>(undefined)

      const { flipped } = usePopoverPosition({ anchor, content })

      expect(flipped.value).toBe(false)
    })
  })

  it('position and flipped are readonly', () => {
    scope.run(() => {
      const anchor = shallowRef<Element | undefined>(undefined)
      const content = shallowRef<Element | undefined>(undefined)

      const { position, flipped } = usePopoverPosition({ anchor, content })

      // Vue readonly() silently prevents mutation rather than throwing
      ;(position as any).value = { top: '10px', left: '10px' }
      expect(position.value.top).toBe('0px')

      ;(flipped as any).value = true
      expect(flipped.value).toBe(false)
    })
  })
})
