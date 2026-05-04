import { afterEach, describe, expect, it, vi } from 'vitest'

import { createFocusTraversal } from './index'

// Utilities
import { ref } from 'vue'

// Types
import type { TraversalItem } from './index'

function items (...ids: string[]): () => TraversalItem[] {
  return () => ids.map(id => ({ id }))
}

function itemsWithDisabled (...entries: [string, boolean?][]): () => TraversalItem[] {
  return () => entries.map(([id, disabled]) => ({
    id,
    ...(disabled == null ? {} : { disabled }),
  }))
}

function createKeyboardEvent (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key,
    ctrlKey: false,
    bubbles: true,
    ...options,
  })
}

function createRtlKeyboardEvent (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent {
  const el = document.createElement('div')
  el.style.direction = 'rtl'
  document.body.append(el)

  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    ...options,
  })

  Object.defineProperty(event, 'currentTarget', { value: el })
  return event
}

describe('createFocusTraversal', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  describe('step', () => {
    it('should step forward by 1', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'a'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('b')
      expect(activate).toHaveBeenCalledWith('b')
    })

    it('should step backward by 1', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'c'
      traversal.step(-1)

      expect(traversal.activeId.value).toBe('b')
      expect(activate).toHaveBeenCalledWith('b')
    })

    it('should step forward by arbitrary stride', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c', 'd', 'e'), activate)

      traversal.activeId.value = 'a'
      traversal.step(3)

      expect(traversal.activeId.value).toBe('d')
    })

    it('should step backward by arbitrary stride', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c', 'd', 'e'), activate)

      traversal.activeId.value = 'e'
      traversal.step(-3)

      expect(traversal.activeId.value).toBe('b')
    })

    it('should start from index -1 when no active id', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.step(1)

      expect(traversal.activeId.value).toBe('a')
    })

    it('should do nothing on empty list', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items(), activate)

      traversal.step(1)

      expect(traversal.activeId.value).toBeUndefined()
      expect(activate).not.toHaveBeenCalled()
    })
  })

  describe('next / prev', () => {
    it('should navigate forward with next', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'a'
      traversal.next()

      expect(traversal.activeId.value).toBe('b')
    })

    it('should navigate backward with prev', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'c'
      traversal.prev()

      expect(traversal.activeId.value).toBe('b')
    })
  })

  describe('first / last', () => {
    it('should activate first enabled item', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.first()

      expect(traversal.activeId.value).toBe('a')
      expect(activate).toHaveBeenCalledWith('a')
    })

    it('should activate last enabled item', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.last()

      expect(traversal.activeId.value).toBe('c')
      expect(activate).toHaveBeenCalledWith('c')
    })

    it('should skip disabled items for first', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', true], ['b', true], ['c', false]),
        activate,
      )

      traversal.first()

      expect(traversal.activeId.value).toBe('c')
    })

    it('should skip disabled items for last', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', false], ['b', true], ['c', true]),
        activate,
      )

      traversal.last()

      expect(traversal.activeId.value).toBe('a')
    })

    it('should do nothing when all items are disabled', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', true], ['b', true]),
        activate,
      )

      traversal.first()

      expect(traversal.activeId.value).toBeUndefined()
      expect(activate).not.toHaveBeenCalled()
    })

    it('should do nothing on empty list', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items(), activate)

      traversal.first()
      expect(traversal.activeId.value).toBeUndefined()

      traversal.last()
      expect(traversal.activeId.value).toBeUndefined()
    })
  })

  describe('disabled item skipping', () => {
    it('should skip disabled items when stepping forward', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', false], ['b', true], ['c', true], ['d', false]),
        activate,
      )

      traversal.activeId.value = 'a'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('d')
    })

    it('should skip disabled items when stepping backward', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', false], ['b', true], ['c', true], ['d', false]),
        activate,
      )

      traversal.activeId.value = 'd'
      traversal.step(-1)

      expect(traversal.activeId.value).toBe('a')
    })

    it('should support reactive disabled via MaybeRefOrGetter', () => {
      const disabled = ref(true)
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        () => [
          { id: 'a' },
          { id: 'b', disabled },
          { id: 'c' },
        ],
        activate,
      )

      traversal.activeId.value = 'a'
      traversal.step(1)
      expect(traversal.activeId.value).toBe('c')

      disabled.value = false
      traversal.activeId.value = 'a'
      traversal.step(1)
      expect(traversal.activeId.value).toBe('b')
    })

    it('should not move when all remaining items in direction are disabled', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', false], ['b', true], ['c', true]),
        activate,
      )

      traversal.activeId.value = 'a'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('a')
    })
  })

  describe('bounded navigation (circular: false)', () => {
    it('should not move past the end', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'c'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('c')
      expect(activate).not.toHaveBeenCalled()
    })

    it('should not move past the start', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'a'
      traversal.step(-1)

      expect(traversal.activeId.value).toBe('a')
      expect(activate).not.toHaveBeenCalled()
    })

    it('should not move with large stride past boundary', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'b'
      traversal.step(10)

      expect(traversal.activeId.value).toBe('b')
    })

    it('should stop at boundary when disabled items block the path', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', false], ['b', false], ['c', true]),
        activate,
      )

      traversal.activeId.value = 'b'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('b')
    })
  })

  describe('circular navigation', () => {
    it('should wrap from end to start', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { circular: true },
      )

      traversal.activeId.value = 'c'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('a')
    })

    it('should wrap from start to end', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { circular: true },
      )

      traversal.activeId.value = 'a'
      traversal.step(-1)

      expect(traversal.activeId.value).toBe('c')
    })

    it('should skip disabled items when wrapping forward', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', true], ['b', false], ['c', false]),
        activate,
        { circular: true },
      )

      traversal.activeId.value = 'c'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('b')
    })

    it('should skip disabled items when wrapping backward', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', false], ['b', false], ['c', true]),
        activate,
        { circular: true },
      )

      traversal.activeId.value = 'a'
      traversal.step(-1)

      expect(traversal.activeId.value).toBe('b')
    })

    it('should handle continuous wrapping', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { circular: true },
      )

      traversal.activeId.value = 'a'
      for (let index = 0; index < 10; index++) {
        traversal.next()
      }

      // 10 steps from index 0: (0 + 10) % 3 = 1 => 'b'
      expect(traversal.activeId.value).toBe('b')
    })

    it('should not move when all items are disabled', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        itemsWithDisabled(['a', true], ['b', true], ['c', true]),
        activate,
        { circular: true },
      )

      traversal.activeId.value = 'a'
      traversal.step(1)

      expect(traversal.activeId.value).toBe('a')
      expect(activate).not.toHaveBeenCalled()
    })
  })

  describe('single-item list', () => {
    it('should activate the only item', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a'), activate)

      traversal.first()

      expect(traversal.activeId.value).toBe('a')
    })

    it('should not move forward from single item (bounded)', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a'), activate)

      traversal.activeId.value = 'a'
      traversal.next()

      expect(traversal.activeId.value).toBe('a')
      expect(activate).not.toHaveBeenCalled()
    })

    it('should not move backward from single item (bounded)', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a'), activate)

      traversal.activeId.value = 'a'
      traversal.prev()

      expect(traversal.activeId.value).toBe('a')
      expect(activate).not.toHaveBeenCalled()
    })

    it('should wrap to itself when circular with single item', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a'),
        activate,
        { circular: true },
      )

      traversal.activeId.value = 'a'
      traversal.next()

      expect(traversal.activeId.value).toBe('a')
      expect(activate).toHaveBeenCalledWith('a')
    })
  })

  describe('onKeydown - vertical orientation (default)', () => {
    it('should move next on ArrowDown', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should move prev on ArrowUp', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'b'
      traversal.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(traversal.activeId.value).toBe('a')
    })

    it('should ignore ArrowLeft and ArrowRight', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowLeft'))
      traversal.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(traversal.activeId.value).toBe('a')
      expect(activate).not.toHaveBeenCalled()
    })

    it('should go to first on Home', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'c'
      traversal.onKeydown(createKeyboardEvent('Home'))

      expect(traversal.activeId.value).toBe('a')
    })

    it('should go to last on End', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('End'))

      expect(traversal.activeId.value).toBe('c')
    })

    it('should call preventDefault on handled keys', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)
      traversal.activeId.value = 'a'

      const event = createKeyboardEvent('ArrowDown')
      const spy = vi.spyOn(event, 'preventDefault')

      traversal.onKeydown(event)

      expect(spy).toHaveBeenCalled()
    })

    it('should not preventDefault on unhandled keys', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(items('a', 'b', 'c'), activate)

      const event = createKeyboardEvent('Tab')
      const spy = vi.spyOn(event, 'preventDefault')

      traversal.onKeydown(event)

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('onKeydown - horizontal orientation', () => {
    it('should move next on ArrowRight', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'horizontal' },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should move prev on ArrowLeft', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'horizontal' },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createKeyboardEvent('ArrowLeft'))

      expect(traversal.activeId.value).toBe('a')
    })

    it('should ignore ArrowUp and ArrowDown', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'horizontal' },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowUp'))
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(traversal.activeId.value).toBe('a')
      expect(activate).not.toHaveBeenCalled()
    })
  })

  describe('onKeydown - both orientation', () => {
    it('should move next on ArrowDown', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'both' },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should move next on ArrowRight', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'both' },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should move prev on ArrowUp', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'both' },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(traversal.activeId.value).toBe('a')
    })

    it('should move prev on ArrowLeft', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'both' },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createKeyboardEvent('ArrowLeft'))

      expect(traversal.activeId.value).toBe('a')
    })
  })

  describe('rTL direction handling', () => {
    it('should flip ArrowRight to prev in RTL horizontal mode', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'horizontal' },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createRtlKeyboardEvent('ArrowRight'))

      expect(traversal.activeId.value).toBe('a')
    })

    it('should flip ArrowLeft to next in RTL horizontal mode', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'horizontal' },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createRtlKeyboardEvent('ArrowLeft'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should not flip ArrowUp/ArrowDown in RTL vertical mode', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'vertical' },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createRtlKeyboardEvent('ArrowDown'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should flip both horizontal arrows in RTL both mode', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c'),
        activate,
        { orientation: 'both' },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createRtlKeyboardEvent('ArrowRight'))
      expect(traversal.activeId.value).toBe('a')

      traversal.onKeydown(createRtlKeyboardEvent('ArrowLeft'))
      expect(traversal.activeId.value).toBe('b')
    })
  })

  describe('grid mode', () => {
    // 3x3 grid: [a, b, c, d, e, f, g, h, i]
    // Row 0: a b c
    // Row 1: d e f
    // Row 2: g h i

    it('should step right by 1 with ArrowRight', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
        activate,
        { columns: 3 },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should step left by 1 with ArrowLeft', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
        activate,
        { columns: 3 },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createKeyboardEvent('ArrowLeft'))

      expect(traversal.activeId.value).toBe('a')
    })

    it('should step down by column count with ArrowDown', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
        activate,
        { columns: 3 },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(traversal.activeId.value).toBe('e')
    })

    it('should step up by column count with ArrowUp', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
        activate,
        { columns: 3 },
      )

      traversal.activeId.value = 'e'
      traversal.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(traversal.activeId.value).toBe('b')
    })

    it('should not move past bottom boundary with ArrowDown', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
        activate,
        { columns: 3 },
      )

      traversal.activeId.value = 'h'
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(traversal.activeId.value).toBe('h')
    })

    it('should not move past top boundary with ArrowUp', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
        activate,
        { columns: 3 },
      )

      traversal.activeId.value = 'b'
      traversal.onKeydown(createKeyboardEvent('ArrowUp'))

      expect(traversal.activeId.value).toBe('b')
      expect(activate).not.toHaveBeenCalled()
    })

    describe('home/End row scoping', () => {
      it('should go to row start on Home', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'f'
        traversal.onKeydown(createKeyboardEvent('Home'))

        expect(traversal.activeId.value).toBe('d')
      })

      it('should go to row end on End', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'd'
        traversal.onKeydown(createKeyboardEvent('End'))

        expect(traversal.activeId.value).toBe('f')
      })

      it('should skip disabled items in row start search', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          itemsWithDisabled(
            ['a', false], ['b', false], ['c', false],
            ['d', true], ['e', false], ['f', false],
          ),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'f'
        traversal.onKeydown(createKeyboardEvent('Home'))

        expect(traversal.activeId.value).toBe('e')
      })

      it('should skip disabled items in row end search', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          itemsWithDisabled(
            ['a', false], ['b', false], ['c', false],
            ['d', false], ['e', false], ['f', true],
          ),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'd'
        traversal.onKeydown(createKeyboardEvent('End'))

        expect(traversal.activeId.value).toBe('e')
      })
    })

    describe('ctrl+Home/End global navigation', () => {
      it('should go to absolute first on Ctrl+Home', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e', 'f'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'f'
        traversal.onKeydown(createKeyboardEvent('Home', { ctrlKey: true }))

        expect(traversal.activeId.value).toBe('a')
      })

      it('should go to absolute last on Ctrl+End', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e', 'f'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'a'
        traversal.onKeydown(createKeyboardEvent('End', { ctrlKey: true }))

        expect(traversal.activeId.value).toBe('f')
      })
    })

    describe('rTL in grid mode', () => {
      it('should flip ArrowRight to step -1 in RTL grid', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e', 'f'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'b'
        traversal.onKeydown(createRtlKeyboardEvent('ArrowRight'))

        expect(traversal.activeId.value).toBe('a')
      })

      it('should flip ArrowLeft to step +1 in RTL grid', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e', 'f'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'a'
        traversal.onKeydown(createRtlKeyboardEvent('ArrowLeft'))

        expect(traversal.activeId.value).toBe('b')
      })

      it('should not flip ArrowDown/ArrowUp in RTL grid', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e', 'f'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'a'
        traversal.onKeydown(createRtlKeyboardEvent('ArrowDown'))

        expect(traversal.activeId.value).toBe('d')
      })
    })

    describe('incomplete last row', () => {
      // Grid with 5 items, 3 columns:
      // Row 0: a b c
      // Row 1: d e

      it('should handle End on incomplete row', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'd'
        traversal.onKeydown(createKeyboardEvent('End'))

        expect(traversal.activeId.value).toBe('e')
      })

      it('should not ArrowDown into non-existent row', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          items('a', 'b', 'c', 'd', 'e'),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'c'
        traversal.onKeydown(createKeyboardEvent('ArrowDown'))

        expect(traversal.activeId.value).toBe('c')
      })
    })

    describe('disabled items in grid', () => {
      it('should skip disabled item when stepping right', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          itemsWithDisabled(
            ['a', false], ['b', true], ['c', false],
            ['d', false], ['e', false], ['f', false],
          ),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'a'
        traversal.onKeydown(createKeyboardEvent('ArrowRight'))

        expect(traversal.activeId.value).toBe('c')
      })

      it('should skip disabled item when stepping down', () => {
        const activate = vi.fn()
        const traversal = createFocusTraversal(
          itemsWithDisabled(
            ['a', false], ['b', false], ['c', false],
            ['d', true], ['e', false], ['f', false],
            ['g', false], ['h', false], ['i', false],
          ),
          activate,
          { columns: 3 },
        )

        traversal.activeId.value = 'a'
        traversal.onKeydown(createKeyboardEvent('ArrowDown'))

        expect(traversal.activeId.value).toBe('g')
      })
    })

    it('should support reactive column count', () => {
      const columns = ref(3)
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f'),
        activate,
        { columns },
      )

      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))
      expect(traversal.activeId.value).toBe('d')

      columns.value = 2
      traversal.activeId.value = 'a'
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))
      expect(traversal.activeId.value).toBe('c')
    })
  })

  describe('grid mode with circular navigation', () => {
    it('should wrap horizontally in circular grid', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f'),
        activate,
        { columns: 3, circular: true },
      )

      traversal.activeId.value = 'c'
      traversal.onKeydown(createKeyboardEvent('ArrowRight'))

      expect(traversal.activeId.value).toBe('d')
    })

    it('should wrap vertically in circular grid', () => {
      const activate = vi.fn()
      const traversal = createFocusTraversal(
        items('a', 'b', 'c', 'd', 'e', 'f'),
        activate,
        { columns: 3, circular: true },
      )

      traversal.activeId.value = 'd'
      traversal.onKeydown(createKeyboardEvent('ArrowDown'))

      expect(traversal.activeId.value).toBe('a')
    })
  })

  describe('return shape', () => {
    it('should return correct interface', () => {
      const traversal = createFocusTraversal(items('a'), vi.fn())

      expect(traversal).toHaveProperty('activeId')
      expect(traversal).toHaveProperty('step')
      expect(traversal).toHaveProperty('next')
      expect(traversal).toHaveProperty('prev')
      expect(traversal).toHaveProperty('first')
      expect(traversal).toHaveProperty('last')
      expect(traversal).toHaveProperty('onKeydown')
      expect(typeof traversal.step).toBe('function')
      expect(typeof traversal.next).toBe('function')
      expect(typeof traversal.prev).toBe('function')
      expect(typeof traversal.first).toBe('function')
      expect(typeof traversal.last).toBe('function')
      expect(typeof traversal.onKeydown).toBe('function')
    })

    it('should initialize activeId as undefined', () => {
      const traversal = createFocusTraversal(items('a'), vi.fn())

      expect(traversal.activeId.value).toBeUndefined()
    })
  })
})
