import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, getCurrentScope, nextTick, shallowRef } from 'vue'

// Types
import type { DragDropAdapterContext, DragType, DraggableTicket } from '../'

import { KeyboardAdapter, useDragDrop as createDragDrop } from '../'

// useDragDrop installs document keydown listeners through KeyboardAdapter.
// Without an enclosing effectScope, every test leaks a document listener;
// across 18 callsites this stalls CI workers. Wrap so each call runs inside
// a tracked scope, stopped in afterEach.
const scopes: ReturnType<typeof effectScope>[] = []

function useDragDrop<Z extends DragType = DragType> (
  ...args: Parameters<typeof createDragDrop<Z>>
): ReturnType<typeof createDragDrop<Z>> {
  if (getCurrentScope()) return createDragDrop<Z>(...args)
  const scope = effectScope()
  scopes.push(scope)
  return scope.run(() => createDragDrop<Z>(...args))!
}

afterEach(() => {
  while (scopes.length > 0) {
    scopes.pop()!.stop()
  }
})

function makeFocusableEl (id: string): HTMLElement {
  const el = document.createElement('div')
  el.id = id
  el.tabIndex = 0
  document.body.append(el)
  return el
}

function makeRectStub (el: HTMLElement, x = 0, y = 0, width = 100, height = 100): void {
  el.getBoundingClientRect = () => ({
    top: y, bottom: y + height, left: x, right: x + width, width, height, x, y, toJSON: () => ({}),
  } as DOMRect)
}

describe('keyboardAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('instantiation', () => {
    it('should construct without options', () => {
      const adapter = new KeyboardAdapter()

      expect(adapter).toBeInstanceOf(KeyboardAdapter)
      expect(typeof adapter.setup).toBe('function')
    })

    it('should accept custom activate keys and step', () => {
      const adapter = new KeyboardAdapter({ activate: ['x', 'y'], step: 32 })

      expect(adapter).toBeInstanceOf(KeyboardAdapter)
    })
  })

  describe('arrow key directions', () => {
    it('should nudge upward on ArrowUp', async () => {
      const cardEl = makeFocusableEl('kb-up-1')
      makeRectStub(cardEl, 0, 100, 0, 0)

      const dnd = useDragDrop({ adapters: [new KeyboardAdapter({ step: 16 })] })
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()
      const startY = dnd.active.value!.current.y

      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      await nextTick()

      expect(dnd.active.value?.current.y).toBe(startY - 16)
      expect(dnd.active.value?.current.x).toBe(0)

      cardEl.remove()
    })

    it('should nudge leftward on ArrowLeft', async () => {
      const cardEl = makeFocusableEl('kb-left-1')
      makeRectStub(cardEl, 100, 0, 0, 0)

      const dnd = useDragDrop({ adapters: [new KeyboardAdapter({ step: 16 })] })
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()
      const startX = dnd.active.value!.current.x

      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      await nextTick()

      expect(dnd.active.value?.current.x).toBe(startX - 16)
      expect(dnd.active.value?.current.y).toBe(0)

      cardEl.remove()
    })

    it('should nudge rightward on ArrowRight', async () => {
      const cardEl = makeFocusableEl('kb-right-1')
      makeRectStub(cardEl, 0, 0, 0, 0)

      const dnd = useDragDrop({ adapters: [new KeyboardAdapter({ step: 16 })] })
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()
      const startX = dnd.active.value!.current.x

      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      await nextTick()

      expect(dnd.active.value?.current.x).toBe(startX + 16)
      expect(dnd.active.value?.current.y).toBe(0)

      cardEl.remove()
    })

    it('should ignore arrow keys when no drag is active', async () => {
      const cardEl = makeFocusableEl('kb-noarr-1')
      const dnd = useDragDrop()
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      cardEl.remove()
    })
  })

  describe('modifier keys', () => {
    it('should ignore Space when ctrlKey is held', async () => {
      const cardEl = makeFocusableEl('kb-mod-ctrl')
      const dnd = useDragDrop()
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', ctrlKey: true, bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      cardEl.remove()
    })

    it('should ignore Space when metaKey is held', async () => {
      const cardEl = makeFocusableEl('kb-mod-meta')
      const dnd = useDragDrop()
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', metaKey: true, bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      cardEl.remove()
    })

    it('should ignore Space when altKey is held', async () => {
      const cardEl = makeFocusableEl('kb-mod-alt')
      const dnd = useDragDrop()
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', altKey: true, bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      cardEl.remove()
    })

    it('should ignore Space when shiftKey is held', async () => {
      const cardEl = makeFocusableEl('kb-mod-shift')
      const dnd = useDragDrop()
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      cardEl.focus()
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', shiftKey: true, bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      cardEl.remove()
    })
  })

  describe('editable element guards', () => {
    it('should ignore Space inside an INPUT element', async () => {
      const input = document.createElement('input')
      input.tabIndex = 0
      document.body.append(input)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-input')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      input.focus()
      input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      input.remove()
      card.remove()
    })

    it('should ignore Space inside a TEXTAREA element', async () => {
      const textarea = document.createElement('textarea')
      textarea.tabIndex = 0
      document.body.append(textarea)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-textarea')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      textarea.focus()
      textarea.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      textarea.remove()
      card.remove()
    })

    it('should ignore Space inside a SELECT element', async () => {
      const select = document.createElement('select')
      select.tabIndex = 0
      document.body.append(select)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-select')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      select.focus()
      select.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      select.remove()
      card.remove()
    })

    it('should ignore Space inside a contentEditable element', async () => {
      const editable = document.createElement('div')
      editable.tabIndex = 0
      editable.setAttribute('contenteditable', 'true')
      document.body.append(editable)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-ce')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      editable.focus()
      editable.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      editable.remove()
      card.remove()
    })

    it('should ignore Space inside an element with role=textbox', async () => {
      const textbox = document.createElement('div')
      textbox.tabIndex = 0
      textbox.setAttribute('role', 'textbox')
      document.body.append(textbox)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-textbox')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      textbox.focus()
      textbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      textbox.remove()
      card.remove()
    })

    it('should ignore Space inside an element with role=searchbox', async () => {
      const searchbox = document.createElement('div')
      searchbox.tabIndex = 0
      searchbox.setAttribute('role', 'searchbox')
      document.body.append(searchbox)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-searchbox')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      searchbox.focus()
      searchbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      searchbox.remove()
      card.remove()
    })

    it('should ignore Space inside an element with role=combobox', async () => {
      const combobox = document.createElement('div')
      combobox.tabIndex = 0
      combobox.setAttribute('role', 'combobox')
      document.body.append(combobox)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-combobox')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      combobox.focus()
      combobox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      combobox.remove()
      card.remove()
    })

    it('should ignore Space inside an element with role=spinbutton', async () => {
      const spinbutton = document.createElement('div')
      spinbutton.tabIndex = 0
      spinbutton.setAttribute('role', 'spinbutton')
      document.body.append(spinbutton)

      const dnd = useDragDrop()
      const card = makeFocusableEl('kb-edit-spin')
      dnd.draggables.register({ el: shallowRef(card), type: 'a', value: null })

      spinbutton.focus()
      spinbutton.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      spinbutton.remove()
      card.remove()
    })
  })

  describe('null focused element', () => {
    it('should still process keyboard event when activeElement is null', async () => {
      const cardEl = makeFocusableEl('kb-null-active')
      const dnd = useDragDrop()
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      // Don't focus card. Dispatch on document so focused element is body or null.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      // No matching draggable focused — no drag should start.
      expect(dnd.active.value).toBeNull()

      cardEl.remove()
    })

    it('should not crash when document.activeElement is null', async () => {
      const cardEl = makeFocusableEl('kb-null-ae')
      const dnd = useDragDrop()
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      // Force activeElement to be null via property override
      const original = Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement')
      Object.defineProperty(document, 'activeElement', {
        configurable: true,
        get: () => null,
      })

      try {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
        await nextTick()

        expect(dnd.active.value).toBeNull()
      } finally {
        if (original) {
          Object.defineProperty(Document.prototype, 'activeElement', original)
        } else {
          Reflect.deleteProperty(document, 'activeElement')
        }
      }

      cardEl.remove()
    })
  })

  describe('start guards', () => {
    it('should warn and short-circuit when located ticket has null el', () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const adapter = new KeyboardAdapter()
      const start = vi.fn()
      const fakeTicket = {
        id: 'fake',
        el: shallowRef<HTMLElement | null>(null),
      } as unknown as DraggableTicket<DragType>

      // Subclass to override locate so we can return a ticket whose el is null.
      class StubAdapter extends KeyboardAdapter {
        protected locate (): DraggableTicket<DragType> | null {
          return fakeTicket
        }
      }

      const stub = new StubAdapter()
      const ctx: DragDropAdapterContext<DragType> = {
        draggables: { values: () => [] } as unknown as DragDropAdapterContext<DragType>['draggables'],
        zones: { values: () => [], get: () => undefined } as unknown as DragDropAdapterContext<DragType>['zones'],
        active: shallowRef(null) as unknown as DragDropAdapterContext<DragType>['active'],
        isDragging: shallowRef(false) as unknown as DragDropAdapterContext<DragType>['isDragging'],
        cancel: vi.fn(),
        emit: { start, move: vi.fn(), drop: vi.fn(), cancel: vi.fn() },
      }

      stub.setup(ctx)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

      expect(start).not.toHaveBeenCalled()
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0]?.join(' ')).toContain('cannot start drag')

      stub.dispose()
      adapter.dispose()
    })
  })
})
