import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, ref } from 'vue'

// Types
import type { VirtualFocusItem } from './index'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

import { useVirtualFocus } from './index'

function createElement (id: string): HTMLElement {
  const el = document.createElement('div')
  el.setAttribute('id', id)
  return el
}

function createKeyboardEvent (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    bubbles: true,
    ...options,
  })
}

describe('useVirtualFocus', () => {
  let scope: ReturnType<typeof effectScope>
  let control: HTMLElement
  let elements: HTMLElement[]
  let items: VirtualFocusItem[]

  beforeEach(() => {
    scope = effectScope()
    control = createElement('control')
    elements = [
      createElement('item-0'),
      createElement('item-1'),
      createElement('item-2'),
      createElement('item-3'),
    ]
    items = elements.map((el, index) => ({
      id: `item-${index}`,
      el,
    }))

    for (const el of elements) {
      el.scrollIntoView = vi.fn()
    }
  })

  afterEach(() => {
    scope.stop()
  })

  describe('highlight', () => {
    it('should set highlightedId', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-1')

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('should set aria-activedescendant on control', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-1')

      expect(control.getAttribute('aria-activedescendant')).toBe('item-1')
    })

    it('should set data-highlighted on the element', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')

      expect(elements[0].dataset.highlighted).toBe('')
    })

    it('should remove data-highlighted from previous element', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')
      expect(elements[0].dataset.highlighted).toBe('')

      result!.highlight('item-2')
      expect(elements[0].dataset.highlighted).toBeUndefined()
      expect(elements[2].dataset.highlighted).toBe('')
    })

    it('should call scrollIntoView on highlighted element', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-1')

      expect(elements[1].scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' })
    })

    it('should call onHighlight callback', () => {
      const onHighlight = vi.fn()
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, onHighlight })
      })

      result!.highlight('item-2')

      expect(onHighlight).toHaveBeenCalledWith('item-2')
    })

    it('should not change highlightedId when item has no element', () => {
      const noElItems: VirtualFocusItem[] = [
        { id: 'a', el: undefined },
        { id: 'b', el: elements[1] },
      ]
      elements[1].scrollIntoView = vi.fn()

      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => noElItems, { control })
      })

      result!.highlight('b')
      expect(result!.highlightedId.value).toBe('b')

      result!.highlight('a')
      expect(result!.highlightedId.value).toBe('b')
    })

    it('should support reactive element refs', () => {
      const elRef = ref<HTMLElement | null>(elements[0])
      elements[0].scrollIntoView = vi.fn()

      const refItems: VirtualFocusItem[] = [
        { id: 'ref-item', el: elRef },
      ]

      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => refItems, { control })
      })

      result!.highlight('ref-item')

      expect(result!.highlightedId.value).toBe('ref-item')
      expect(elements[0].dataset.highlighted).toBe('')
    })
  })

  describe('clear', () => {
    it('should reset highlightedId to undefined', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-1')
      result!.clear()

      expect(result!.highlightedId.value).toBeUndefined()
    })

    it('should remove aria-activedescendant from control', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')
      expect(control.hasAttribute('aria-activedescendant')).toBe(true)

      result!.clear()
      expect(control.hasAttribute('aria-activedescendant')).toBe(false)
    })

    it('should remove data-highlighted from previous element', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-2')
      expect(elements[2].dataset.highlighted).toBe('')

      result!.clear()
      expect(elements[2].dataset.highlighted).toBeUndefined()
    })

    it('should be safe to call when nothing is highlighted', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      expect(() => result!.clear()).not.toThrow()
      expect(result!.highlightedId.value).toBeUndefined()
    })
  })

  describe('navigation', () => {
    it('next should highlight first item when nothing is active', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.next()

      expect(result!.highlightedId.value).toBe('item-0')
    })

    it('next should advance to the next item', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')
      result!.next()

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('prev should move to the previous item', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-2')
      result!.prev()

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('first should highlight the first item', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-3')
      result!.first()

      expect(result!.highlightedId.value).toBe('item-0')
    })

    it('last should highlight the last item', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')
      result!.last()

      expect(result!.highlightedId.value).toBe('item-3')
    })

    it('should skip disabled items', () => {
      const disabledItems: VirtualFocusItem[] = [
        { id: 'a', el: elements[0] },
        { id: 'b', el: elements[1], disabled: true },
        { id: 'c', el: elements[2] },
      ]

      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => disabledItems, { control })
      })

      result!.highlight('a')
      result!.next()

      expect(result!.highlightedId.value).toBe('c')
    })

    it('should not wrap without circular option', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-3')
      result!.next()

      expect(result!.highlightedId.value).toBe('item-3')
    })

    it('should wrap with circular option', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, circular: true })
      })

      result!.highlight('item-3')
      result!.next()

      expect(result!.highlightedId.value).toBe('item-0')
    })

    it('should wrap backward with circular option', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, circular: true })
      })

      result!.highlight('item-0')
      result!.prev()

      expect(result!.highlightedId.value).toBe('item-3')
    })
  })

  describe('keyboard events', () => {
    it('should navigate with ArrowDown in vertical mode', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, orientation: 'vertical' })
      })

      result!.highlight('item-0')
      result!.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('should navigate with ArrowUp in vertical mode', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, orientation: 'vertical' })
      })

      result!.highlight('item-2')
      result!.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('should navigate with ArrowRight in horizontal mode', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, orientation: 'horizontal' })
      })

      result!.highlight('item-0')
      result!.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('should navigate with ArrowLeft in horizontal mode', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, orientation: 'horizontal' })
      })

      result!.highlight('item-2')
      result!.onKeydown(createKeyboardEvent('ArrowLeft'))

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('should not respond to ArrowLeft/ArrowRight in vertical mode', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, orientation: 'vertical' })
      })

      result!.highlight('item-1')
      result!.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('should not respond to ArrowUp/ArrowDown in horizontal mode', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, orientation: 'horizontal' })
      })

      result!.highlight('item-1')
      result!.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(result!.highlightedId.value).toBe('item-1')
    })

    it('should respond to all arrows in both mode', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control, orientation: 'both' })
      })

      result!.highlight('item-0')
      result!.onKeydown(createKeyboardEvent('ArrowDown'))
      expect(result!.highlightedId.value).toBe('item-1')

      result!.onKeydown(createKeyboardEvent('ArrowRight'))
      expect(result!.highlightedId.value).toBe('item-2')

      result!.onKeydown(createKeyboardEvent('ArrowUp'))
      expect(result!.highlightedId.value).toBe('item-1')

      result!.onKeydown(createKeyboardEvent('ArrowLeft'))
      expect(result!.highlightedId.value).toBe('item-0')
    })

    it('should navigate to first with Home key', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-3')
      result!.onKeydown(createKeyboardEvent('Home'))

      expect(result!.highlightedId.value).toBe('item-0')
    })

    it('should navigate to last with End key', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')
      result!.onKeydown(createKeyboardEvent('End'))

      expect(result!.highlightedId.value).toBe('item-3')
    })

    it('should preventDefault on navigation keys', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')

      const event = createKeyboardEvent('ArrowDown')
      const spy = vi.spyOn(event, 'preventDefault')
      result!.onKeydown(event)

      expect(spy).toHaveBeenCalled()
    })

    it('should not preventDefault on non-navigation keys', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      const event = createKeyboardEvent('a')
      const spy = vi.spyOn(event, 'preventDefault')
      result!.onKeydown(event)

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('grid mode', () => {
    let gridElements: HTMLElement[]
    let gridItems: VirtualFocusItem[]

    beforeEach(() => {
      // 3x3 grid = 9 items
      gridElements = Array.from({ length: 9 }, (_, index) => {
        const el = createElement(`grid-${index}`)
        el.scrollIntoView = vi.fn()
        return el
      })
      gridItems = gridElements.map((el, index) => ({
        id: `g-${index}`,
        el,
      }))
    })

    it('should navigate right with ArrowRight', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      result!.highlight('g-0')
      result!.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(result!.highlightedId.value).toBe('g-1')
    })

    it('should navigate left with ArrowLeft', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      result!.highlight('g-1')
      result!.onKeydown(createKeyboardEvent('ArrowLeft'))

      expect(result!.highlightedId.value).toBe('g-0')
    })

    it('should navigate down one row with ArrowDown', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      result!.highlight('g-1')
      result!.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(result!.highlightedId.value).toBe('g-4')
    })

    it('should navigate up one row with ArrowUp', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      result!.highlight('g-4')
      result!.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(result!.highlightedId.value).toBe('g-1')
    })

    it('should navigate to row start with Home', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      // Middle of second row (index 4)
      result!.highlight('g-4')
      result!.onKeydown(createKeyboardEvent('Home'))

      expect(result!.highlightedId.value).toBe('g-3')
    })

    it('should navigate to row end with End', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      // Start of second row (index 3)
      result!.highlight('g-3')
      result!.onKeydown(createKeyboardEvent('End'))

      expect(result!.highlightedId.value).toBe('g-5')
    })

    it('should navigate to first item with Ctrl+Home', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      result!.highlight('g-7')
      result!.onKeydown(createKeyboardEvent('Home', { ctrlKey: true }))

      expect(result!.highlightedId.value).toBe('g-0')
    })

    it('should navigate to last item with Ctrl+End', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      result!.highlight('g-1')
      result!.onKeydown(createKeyboardEvent('End', { ctrlKey: true }))

      expect(result!.highlightedId.value).toBe('g-8')
    })

    it('should not navigate past grid boundary with ArrowDown', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => gridItems, { control, columns: 3 })
      })

      // Last row, index 7
      result!.highlight('g-7')
      result!.onKeydown(createKeyboardEvent('ArrowDown'))

      // No item at index 10 — stays put
      expect(result!.highlightedId.value).toBe('g-7')
    })
  })

  describe('control focus retention', () => {
    it('should not move DOM focus away from control during navigation', () => {
      const spies = elements.map(el => vi.spyOn(el, 'focus'))
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')
      result!.next()
      result!.next()

      // Virtual focus does NOT call element.focus() — that's useRovingFocus.
      for (const spy of spies) {
        expect(spy).not.toHaveBeenCalled()
      }
    })
  })

  describe('target option', () => {
    it('should attach keydown listener to target when provided', () => {
      const target = createElement('target')
      target.scrollIntoView = vi.fn()
      const spy = vi.spyOn(target, 'addEventListener')

      scope.run(() => {
        useVirtualFocus(() => items, { control, target })
      })

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)
    })

    it('should attach keydown listener to control when target is not provided', () => {
      const spy = vi.spyOn(control, 'addEventListener')

      scope.run(() => {
        useVirtualFocus(() => items, { control })
      })

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)
    })

    it('should support reactive target ref', () => {
      const target = ref<HTMLElement | null>(null)

      scope.run(() => {
        useVirtualFocus(() => items, { control, target })
      })

      // No crash with null target
      expect(control.getAttribute('aria-activedescendant')).toBeNull()
    })
  })

  describe('empty items', () => {
    it('should handle empty item list gracefully', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => [], { control })
      })

      expect(() => result!.next()).not.toThrow()
      expect(() => result!.prev()).not.toThrow()
      expect(() => result!.first()).not.toThrow()
      expect(() => result!.last()).not.toThrow()
      expect(result!.highlightedId.value).toBeUndefined()
    })
  })

  describe('disabled items', () => {
    it('first should skip disabled items', () => {
      const disabledItems: VirtualFocusItem[] = [
        { id: 'a', el: elements[0], disabled: true },
        { id: 'b', el: elements[1] },
        { id: 'c', el: elements[2] },
      ]

      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => disabledItems, { control })
      })

      result!.first()

      expect(result!.highlightedId.value).toBe('b')
    })

    it('last should skip disabled items', () => {
      const disabledItems: VirtualFocusItem[] = [
        { id: 'a', el: elements[0] },
        { id: 'b', el: elements[1] },
        { id: 'c', el: elements[2], disabled: true },
      ]

      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => disabledItems, { control })
      })

      result!.last()

      expect(result!.highlightedId.value).toBe('b')
    })

    it('should support reactive disabled state', () => {
      const disabled = ref(false)
      const reactiveItems: VirtualFocusItem[] = [
        { id: 'a', el: elements[0] },
        { id: 'b', el: elements[1], disabled },
        { id: 'c', el: elements[2] },
      ]

      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => reactiveItems, { control })
      })

      result!.highlight('a')
      result!.next()
      expect(result!.highlightedId.value).toBe('b')

      disabled.value = true
      result!.highlight('a')
      result!.next()
      expect(result!.highlightedId.value).toBe('c')
    })
  })

  describe('aria-activedescendant', () => {
    it('should use the element id attribute for aria-activedescendant', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-2')

      expect(control.getAttribute('aria-activedescendant')).toBe('item-2')
    })

    it('should not set aria-activedescendant when element has no id', () => {
      const noIdEl = document.createElement('div')
      noIdEl.scrollIntoView = vi.fn()
      const noIdItems: VirtualFocusItem[] = [
        { id: 'x', el: noIdEl },
      ]

      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => noIdItems, { control })
      })

      result!.highlight('x')

      expect(control.getAttribute('aria-activedescendant')).toBeNull()
    })

    it('should update aria-activedescendant when highlight changes', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-0')
      expect(control.getAttribute('aria-activedescendant')).toBe('item-0')

      result!.highlight('item-3')
      expect(control.getAttribute('aria-activedescendant')).toBe('item-3')
    })
  })

  describe('scope disposal', () => {
    it('should clean up highlighted state and aria on scope dispose', () => {
      let result: ReturnType<typeof useVirtualFocus>

      scope.run(() => {
        result = useVirtualFocus(() => items, { control })
      })

      result!.highlight('item-1')
      expect(elements[1]!.dataset.highlighted).toBe('')
      expect(control.getAttribute('aria-activedescendant')).toBe('item-1')

      scope.stop()

      expect(elements[1]!.dataset.highlighted).toBeUndefined()
      expect(control.hasAttribute('aria-activedescendant')).toBe(false)
    })
  })
})
