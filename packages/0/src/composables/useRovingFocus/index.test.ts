import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useRovingFocus } from './index'

// Utilities
import { effectScope, nextTick, ref } from 'vue'

// Types
import type { RovingItem } from './index'

function createKeyboardEvent (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key,
    ctrlKey: false,
    bubbles: true,
    ...options,
  })
}

function createItems (count: number, options: { disabled?: number[] } = {}): RovingItem[] {
  const { disabled = [] } = options
  return Array.from({ length: count }, (_, index) => {
    const el = document.createElement('button')
    el.textContent = `Item ${index + 1}`
    document.body.append(el)
    return {
      id: `item-${index + 1}`,
      el,
      disabled: disabled.includes(index),
    }
  })
}

function cleanup () {
  while (document.body.firstChild) {
    document.body.firstChild.remove()
  }
}

describe('useRovingFocus', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
    cleanup()
  })

  describe('focusedId', () => {
    it('should start undefined', () => {
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      expect(result.focusedId.value).toBeUndefined()
    })

    it('should update when navigating', () => {
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.first()

      expect(result.focusedId.value).toBe('item-1')
    })
  })

  describe('isTabbable', () => {
    it('should make first enabled item tabbable when no focus', () => {
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      expect(result.isTabbable('item-1')).toBe(true)
      expect(result.isTabbable('item-2')).toBe(false)
      expect(result.isTabbable('item-3')).toBe(false)
    })

    it('should make focused item tabbable', () => {
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.focus('item-2')

      expect(result.isTabbable('item-1')).toBe(false)
      expect(result.isTabbable('item-2')).toBe(true)
      expect(result.isTabbable('item-3')).toBe(false)
    })

    it('should skip disabled items for default tabbable', () => {
      const items = createItems(3, { disabled: [0] })
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      expect(result.isTabbable('item-1')).toBe(false)
      expect(result.isTabbable('item-2')).toBe(true)
    })

    it('should return false for all items when all are disabled', () => {
      const items = createItems(3, { disabled: [0, 1, 2] })
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      expect(result.isTabbable('item-1')).toBe(false)
      expect(result.isTabbable('item-2')).toBe(false)
      expect(result.isTabbable('item-3')).toBe(false)
    })

    it('should return false for empty items list', () => {
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => [])
      })

      expect(result.isTabbable('item-1')).toBe(false)
    })

    it('should return false for unknown id when no active id', () => {
      const items = createItems(2)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      expect(result.isTabbable('nonexistent')).toBe(false)
    })
  })

  describe('focus', () => {
    it('should set focusedId and focus the element', async () => {
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.focus('item-2')
      await nextTick()

      expect(result.focusedId.value).toBe('item-2')
      expect(document.activeElement).toBe(items[1]!.el)
    })

    it('should revert focusedId when element is missing', () => {
      const items: RovingItem[] = [
        { id: 'no-el' },
        { id: 'has-el', el: document.createElement('button') },
      ]
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.focus('has-el')
      expect(result.focusedId.value).toBe('has-el')

      result.focus('no-el')
      expect(result.focusedId.value).toBe('has-el')
    })

    it('should revert focusedId when id is not found', () => {
      const items = createItems(2)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.focus('item-1')
      expect(result.focusedId.value).toBe('item-1')

      result.focus('nonexistent')
      expect(result.focusedId.value).toBe('item-1')
    })

    it('should call onFocus callback', () => {
      const items = createItems(3)
      const spy = vi.fn()
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { onFocus: spy })
      })

      result.focus('item-2')

      expect(spy).toHaveBeenCalledWith('item-2')
    })

    it('should not call onFocus when element is missing', () => {
      const items: RovingItem[] = [{ id: 'no-el' }]
      const spy = vi.fn()
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { onFocus: spy })
      })

      result.focus('no-el')

      expect(spy).not.toHaveBeenCalled()
    })

    it('should handle ref-based el', async () => {
      const el = document.createElement('button')
      document.body.append(el)
      const elRef = ref(el)

      const items: RovingItem[] = [{ id: 'ref-item', el: elRef }]
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.focus('ref-item')
      await nextTick()

      expect(document.activeElement).toBe(el)
    })
  })

  describe('navigation', () => {
    describe('next', () => {
      it('should move to next item', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()
        expect(result.focusedId.value).toBe('item-1')

        result.next()
        expect(result.focusedId.value).toBe('item-2')

        result.next()
        expect(result.focusedId.value).toBe('item-3')
      })

      it('should skip disabled items', () => {
        const items = createItems(3, { disabled: [1] })
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()
        result.next()

        expect(result.focusedId.value).toBe('item-3')
      })

      it('should not wrap by default', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.last()
        result.next()

        expect(result.focusedId.value).toBe('item-3')
      })

      it('should select first item when nothing is focused', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.next()

        expect(result.focusedId.value).toBe('item-1')
      })
    })

    describe('prev', () => {
      it('should move to previous item', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.last()
        expect(result.focusedId.value).toBe('item-3')

        result.prev()
        expect(result.focusedId.value).toBe('item-2')

        result.prev()
        expect(result.focusedId.value).toBe('item-1')
      })

      it('should skip disabled items', () => {
        const items = createItems(3, { disabled: [1] })
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.last()
        result.prev()

        expect(result.focusedId.value).toBe('item-1')
      })

      it('should not wrap by default', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()
        result.prev()

        expect(result.focusedId.value).toBe('item-1')
      })
    })

    describe('first', () => {
      it('should focus first enabled item', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()

        expect(result.focusedId.value).toBe('item-1')
      })

      it('should skip disabled items', () => {
        const items = createItems(3, { disabled: [0] })
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()

        expect(result.focusedId.value).toBe('item-2')
      })

      it('should do nothing when all items disabled', () => {
        const items = createItems(3, { disabled: [0, 1, 2] })
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()

        expect(result.focusedId.value).toBeUndefined()
      })

      it('should do nothing when empty', () => {
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => [])
        })

        result.first()

        expect(result.focusedId.value).toBeUndefined()
      })
    })

    describe('last', () => {
      it('should focus last enabled item', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.last()

        expect(result.focusedId.value).toBe('item-3')
      })

      it('should skip disabled items', () => {
        const items = createItems(3, { disabled: [2] })
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.last()

        expect(result.focusedId.value).toBe('item-2')
      })
    })

    describe('circular', () => {
      it('should wrap forward', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items, { circular: true })
        })

        result.last()
        result.next()

        expect(result.focusedId.value).toBe('item-1')
      })

      it('should wrap backward', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items, { circular: true })
        })

        result.first()
        result.prev()

        expect(result.focusedId.value).toBe('item-3')
      })

      it('should skip disabled items when wrapping', () => {
        const items = createItems(3, { disabled: [0] })
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items, { circular: true })
        })

        result.last()
        result.next()

        expect(result.focusedId.value).toBe('item-2')
      })
    })
  })

  describe('onKeydown', () => {
    describe('vertical orientation (default)', () => {
      it('should move next on ArrowDown', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()
        result.onKeydown(createKeyboardEvent('ArrowDown'))

        expect(result.focusedId.value).toBe('item-2')
      })

      it('should move prev on ArrowUp', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.last()
        result.onKeydown(createKeyboardEvent('ArrowUp'))

        expect(result.focusedId.value).toBe('item-2')
      })

      it('should not respond to ArrowLeft or ArrowRight', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()
        result.onKeydown(createKeyboardEvent('ArrowRight'))

        expect(result.focusedId.value).toBe('item-1')

        result.onKeydown(createKeyboardEvent('ArrowLeft'))

        expect(result.focusedId.value).toBe('item-1')
      })

      it('should focus first on Home', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.last()
        result.onKeydown(createKeyboardEvent('Home'))

        expect(result.focusedId.value).toBe('item-1')
      })

      it('should focus last on End', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()
        result.onKeydown(createKeyboardEvent('End'))

        expect(result.focusedId.value).toBe('item-3')
      })

      it('should preventDefault on handled keys', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()

        const event = createKeyboardEvent('ArrowDown')
        const spy = vi.spyOn(event, 'preventDefault')
        result.onKeydown(event)

        expect(spy).toHaveBeenCalled()
      })

      it('should not preventDefault on unhandled keys', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items)
        })

        result.first()

        const event = createKeyboardEvent('Tab')
        const spy = vi.spyOn(event, 'preventDefault')
        result.onKeydown(event)

        expect(spy).not.toHaveBeenCalled()
      })
    })

    describe('horizontal orientation', () => {
      it('should move next on ArrowRight', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items, { orientation: 'horizontal' })
        })

        result.first()
        result.onKeydown(createKeyboardEvent('ArrowRight'))

        expect(result.focusedId.value).toBe('item-2')
      })

      it('should move prev on ArrowLeft', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items, { orientation: 'horizontal' })
        })

        result.last()
        result.onKeydown(createKeyboardEvent('ArrowLeft'))

        expect(result.focusedId.value).toBe('item-2')
      })

      it('should not respond to ArrowUp or ArrowDown', () => {
        const items = createItems(3)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items, { orientation: 'horizontal' })
        })

        result.first()
        result.onKeydown(createKeyboardEvent('ArrowUp'))

        expect(result.focusedId.value).toBe('item-1')

        result.onKeydown(createKeyboardEvent('ArrowDown'))

        expect(result.focusedId.value).toBe('item-1')
      })
    })

    describe('both orientation', () => {
      it('should respond to all arrow keys', () => {
        const items = createItems(5)
        let result!: ReturnType<typeof useRovingFocus>

        scope.run(() => {
          result = useRovingFocus(() => items, { orientation: 'both' })
        })

        result.first()

        result.onKeydown(createKeyboardEvent('ArrowDown'))
        expect(result.focusedId.value).toBe('item-2')

        result.onKeydown(createKeyboardEvent('ArrowRight'))
        expect(result.focusedId.value).toBe('item-3')

        result.onKeydown(createKeyboardEvent('ArrowUp'))
        expect(result.focusedId.value).toBe('item-2')

        result.onKeydown(createKeyboardEvent('ArrowLeft'))
        expect(result.focusedId.value).toBe('item-1')
      })
    })
  })

  describe('grid mode', () => {
    it('should move by columns on ArrowDown', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.first()
      result.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(result.focusedId.value).toBe('item-4')
    })

    it('should move by columns on ArrowUp', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.last()
      result.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(result.focusedId.value).toBe('item-6')
    })

    it('should move by 1 on ArrowRight', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.first()
      result.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(result.focusedId.value).toBe('item-2')
    })

    it('should move by 1 on ArrowLeft', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-3')
      result.onKeydown(createKeyboardEvent('ArrowLeft'))

      expect(result.focusedId.value).toBe('item-2')
    })

    it('should go to row start on Home', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-6')
      result.onKeydown(createKeyboardEvent('Home'))

      expect(result.focusedId.value).toBe('item-4')
    })

    it('should go to row end on End', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-4')
      result.onKeydown(createKeyboardEvent('End'))

      expect(result.focusedId.value).toBe('item-6')
    })

    it('should go to first overall on Ctrl+Home', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-5')
      result.onKeydown(createKeyboardEvent('Home', { ctrlKey: true }))

      expect(result.focusedId.value).toBe('item-1')
    })

    it('should go to last overall on Ctrl+End', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-5')
      result.onKeydown(createKeyboardEvent('End', { ctrlKey: true }))

      expect(result.focusedId.value).toBe('item-9')
    })

    it('should not move down past last row', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-7')
      result.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(result.focusedId.value).toBe('item-7')
    })

    it('should not move up past first row', () => {
      const items = createItems(9)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-2')
      result.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(result.focusedId.value).toBe('item-2')
    })

    it('should support reactive columns', () => {
      const items = createItems(12)
      const columns = ref(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns })
      })

      result.focus('item-1')
      result.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(result.focusedId.value).toBe('item-4')

      columns.value = 4
      result.focus('item-1')
      result.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(result.focusedId.value).toBe('item-5')
    })

    it('should skip disabled items in grid navigation', () => {
      const items = createItems(9, { disabled: [3] })
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { columns: 3 })
      })

      result.focus('item-1')
      result.onKeydown(createKeyboardEvent('ArrowDown'))

      // item-4 (index 3) disabled, next stride lands at item-7
      expect(result.focusedId.value).toBe('item-7')
    })
  })

  describe('target auto-binding', () => {
    it('should attach keydown listener to target', async () => {
      const container = document.createElement('div')
      document.body.append(container)
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { target: container })
      })

      result.first()
      await nextTick()

      container.dispatchEvent(createKeyboardEvent('ArrowDown'))
      await nextTick()

      expect(result.focusedId.value).toBe('item-2')
    })

    it('should support reactive target', async () => {
      const container = document.createElement('div')
      document.body.append(container)
      const target = ref<HTMLElement | null>(null)
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items, { target })
      })

      result.first()

      // No target yet — dispatch should not work
      container.dispatchEvent(createKeyboardEvent('ArrowDown'))
      await nextTick()
      expect(result.focusedId.value).toBe('item-1')

      // Set target
      target.value = container
      await nextTick()

      container.dispatchEvent(createKeyboardEvent('ArrowDown'))
      await nextTick()

      expect(result.focusedId.value).toBe('item-2')
    })
  })

  describe('focus application', () => {
    it('should focus the element on next tick', async () => {
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.first()
      await nextTick()

      expect(document.activeElement).toBe(items[0]!.el)
    })

    it('should move DOM focus when navigating', async () => {
      const items = createItems(3)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.first()
      await nextTick()
      expect(document.activeElement).toBe(items[0]!.el)

      result.next()
      await nextTick()
      expect(document.activeElement).toBe(items[1]!.el)

      result.next()
      await nextTick()
      expect(document.activeElement).toBe(items[2]!.el)
    })
  })

  describe('edge cases', () => {
    it('should handle single item', () => {
      const items = createItems(1)
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.first()
      expect(result.focusedId.value).toBe('item-1')

      result.next()
      expect(result.focusedId.value).toBe('item-1')

      result.prev()
      expect(result.focusedId.value).toBe('item-1')
    })

    it('should handle empty items list', () => {
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => [])
      })

      result.next()
      expect(result.focusedId.value).toBeUndefined()

      result.prev()
      expect(result.focusedId.value).toBeUndefined()

      result.first()
      expect(result.focusedId.value).toBeUndefined()

      result.last()
      expect(result.focusedId.value).toBeUndefined()
    })

    it('should handle all items disabled', () => {
      const items = createItems(3, { disabled: [0, 1, 2] })
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.next()
      expect(result.focusedId.value).toBeUndefined()

      result.first()
      expect(result.focusedId.value).toBeUndefined()
    })

    it('should handle only one enabled item among disabled', () => {
      const items = createItems(3, { disabled: [0, 2] })
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.first()
      expect(result.focusedId.value).toBe('item-2')

      result.next()
      expect(result.focusedId.value).toBe('item-2')

      result.prev()
      expect(result.focusedId.value).toBe('item-2')
    })

    it('should handle numeric ids', () => {
      const el = document.createElement('button')
      document.body.append(el)
      const items: RovingItem[] = [
        { id: 1, el },
        { id: 2, el: document.createElement('button') },
      ]
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.focus(1)
      expect(result.focusedId.value).toBe(1)
      expect(result.isTabbable(1)).toBe(true)
      expect(result.isTabbable(2)).toBe(false)
    })

    it('should handle reactive disabled via ref', () => {
      const disabled = ref(false)
      const el1 = document.createElement('button')
      const el2 = document.createElement('button')
      document.body.append(el1)
      document.body.append(el2)

      const items: RovingItem[] = [
        { id: 'a', el: el1, disabled },
        { id: 'b', el: el2 },
      ]
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.first()
      expect(result.focusedId.value).toBe('a')

      // Disable first item, isTabbable should now fall back
      disabled.value = true
      result.focusedId.value = undefined

      expect(result.isTabbable('a')).toBe(false)
      expect(result.isTabbable('b')).toBe(true)
    })

    it('should handle getter-based el', async () => {
      const el = document.createElement('button')
      document.body.append(el)
      const items: RovingItem[] = [{ id: 'getter', el: () => el }]
      let result!: ReturnType<typeof useRovingFocus>

      scope.run(() => {
        result = useRovingFocus(() => items)
      })

      result.focus('getter')
      await nextTick()

      expect(document.activeElement).toBe(el)
    })
  })
})
