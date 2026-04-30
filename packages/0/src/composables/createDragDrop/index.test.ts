import { describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { effectScope, isRef, nextTick, shallowRef } from 'vue'

import { createDragDrop } from './'

describe('createDragDrop', () => {
  describe('factory', () => {
    it('should return a context with draggables, zones, active, isDragging, cancel', () => {
      const dnd = createDragDrop({ transports: [] })

      expect(dnd.draggables).toBeDefined()
      expect(dnd.zones).toBeDefined()
      expect(dnd.active.value).toBeNull()
      expect(dnd.isDragging.value).toBe(false)
      expect(typeof dnd.cancel).toBe('function')
    })

    it('should construct both registries with events enabled', () => {
      const dnd = createDragDrop({ transports: [] })

      expect(typeof dnd.draggables.on).toBe('function')
      expect(typeof dnd.zones.on).toBe('function')
    })

    it('should run plugins at install time and dispose on scope dispose', () => {
      const installed: string[] = []
      const disposed: string[] = []
      const scope = effectScope()

      scope.run(() => {
        createDragDrop({
          transports: [],
          plugins: [
            () => {
              installed.push('a')
              return () => disposed.push('a')
            },
            () => {
              installed.push('b')
            },
          ],
        })
      })

      expect(installed).toEqual(['a', 'b'])
      expect(disposed).toEqual([])

      scope.stop()

      expect(disposed).toEqual(['a'])
    })
  })

  describe('cancel', () => {
    it('should not throw when no active drag', () => {
      const dnd = createDragDrop({ transports: [] })
      expect(() => dnd.cancel()).not.toThrow()
      expect(dnd.active.value).toBeNull()
    })
  })
})

describe('draggables.register', () => {
  it('should return a ticket with type, value, attrs, el, isDragging', () => {
    const dnd = createDragDrop<{ type: 'card', value: { id: number } }>({ transports: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const ticket = dnd.draggables.register({ el, type: 'card', value: { id: 1 } })

    expect(ticket.type).toBe('card')
    expect(ticket.value).toEqual({ id: 1 })
    expect(isRef(ticket.attrs)).toBe(true)
    expect(isRef(ticket.el)).toBe(true)
    expect(ticket.isDragging.value).toBe(false)
  })

  it('should populate attrs with data-draggable, aria-roledescription, touch-action', () => {
    const dnd = createDragDrop({ transports: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const ticket = dnd.draggables.register({ el, type: 'a', value: null })

    expect(ticket.attrs.value['data-draggable']).toBe('')
    expect(ticket.attrs.value['aria-roledescription']).toBe('draggable')
    expect(ticket.attrs.value.style).toEqual({ touchAction: 'none' })
  })

  it('should mark data-dragging while ticket is the active drag', async () => {
    const dnd = createDragDrop({ transports: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const ticket = dnd.draggables.register({ el, type: 'a', value: null })

    expect(ticket.attrs.value['data-dragging']).toBeUndefined()

    ;(dnd.active as any).value = {
      id: ticket.id, type: 'a', value: null,
      origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, delta: { x: 0, y: 0 },
      over: null, willAccept: false, via: 'pointer',
    }
    await nextTick()

    expect(ticket.isDragging.value).toBe(true)
    expect(ticket.attrs.value['data-dragging']).toBe('')
  })

  it('should drop touchAction style when disabled', () => {
    const dnd = createDragDrop({ transports: [] })
    const el = shallowRef<HTMLElement | null>(null)
    const disabled = shallowRef(false)

    const ticket = dnd.draggables.register({ el, type: 'a', value: null, disabled })

    expect(ticket.attrs.value.style).toEqual({ touchAction: 'none' })

    disabled.value = true
    expect(ticket.attrs.value.style).toBeUndefined()
  })
})

describe('zones.register', () => {
  it('should return a ticket with attrs, isOver, willAccept, indicator', () => {
    const dnd = createDragDrop({ transports: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const zone = dnd.zones.register({ el, accept: ['card'] })

    expect(zone.attrs.value['data-dropzone']).toBe('')
    expect(zone.isOver.value).toBe(false)
    expect(zone.willAccept.value).toBe(false)
    expect(zone.indicator.value).toBeNull()
  })

  it('should set willAccept when active drag matches accept array', () => {
    type K = { type: 'card', value: null } | { type: 'column', value: null }
    const dnd = createDragDrop<K>({ transports: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const zone = dnd.zones.register({ el, accept: ['card'] })

    expect(zone.willAccept.value).toBe(false)

    ;(dnd.active as any).value = {
      id: 'd1',
      type: 'card',
      value: null,
      origin: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
      over: null,
      willAccept: false,
      via: 'pointer',
    }

    expect(zone.willAccept.value).toBe(true)

    ;(dnd.active as any).value = { ...dnd.active.value, type: 'column' }
    expect(zone.willAccept.value).toBe(false)
  })

  it('should call accept predicate when accept is a function', () => {
    const dnd = createDragDrop({ transports: [] })
    const el = shallowRef<HTMLElement | null>(null)
    const accept = vi.fn(() => true)

    const zone = dnd.zones.register({ el, accept })

    ;(dnd.active as any).value = {
      id: 'd1',
      type: 'a',
      value: null,
      origin: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
      over: null,
      willAccept: false,
      via: 'pointer',
    }

    expect(zone.willAccept.value).toBe(true)
    expect(accept).toHaveBeenCalledTimes(1)
  })
})

function makeFocusableEl (id: string): HTMLElement {
  const el = document.createElement('div')
  el.id = id
  el.tabIndex = 0
  document.body.append(el)
  return el
}

describe('keyboardTransport', () => {
  it('should pick up focused draggable on Space', async () => {
    const cardEl = makeFocusableEl('card-key-1')

    const dnd = createDragDrop()
    const card = dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()

    expect(dnd.active.value?.id).toBe(card.id)
    expect(dnd.active.value?.via).toBe('keyboard')

    cardEl.remove()
  })

  it('should cancel drag on Escape', async () => {
    const cardEl = makeFocusableEl('card-key-2')

    const dnd = createDragDrop()
    dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()

    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(dnd.active.value).toBeNull()

    cardEl.remove()
  })
})

describe('lifecycle hooks', () => {
  it('should not start when draggable.onBeforeStart returns false', async () => {
    const cardEl = makeFocusableEl('lc-1')
    const dnd = createDragDrop()

    dnd.draggables.register({
      el: shallowRef(cardEl),
      type: 'a',
      value: null,
      onBeforeStart: () => false,
    })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()

    expect(dnd.active.value).toBeNull()
    cardEl.remove()
  })

  it('should fire onCancel chain when zone.onBeforeDrop returns false', async () => {
    const cardEl = makeFocusableEl('lc-2')
    const zoneEl = document.createElement('div')
    document.body.append(zoneEl)

    const onCancelDraggable = vi.fn()
    const onCancelGlobal = vi.fn()
    const onDrop = vi.fn()

    const dnd = createDragDrop({ onCancel: onCancelGlobal })
    dnd.draggables.register({
      el: shallowRef(cardEl),
      type: 'a',
      value: null,
      onCancel: onCancelDraggable,
    })
    dnd.zones.register({
      el: shallowRef(zoneEl),
      onBeforeDrop: () => false,
      onDrop,
    })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    // Force the next move to consider zoneEl as `over` by stubbing elementFromPoint.
    const realFromPoint = document.elementFromPoint.bind(document)
    document.elementFromPoint = () => zoneEl
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })) // drop attempt
    document.elementFromPoint = realFromPoint
    await nextTick()

    expect(onDrop).not.toHaveBeenCalled()
    expect(onCancelDraggable).toHaveBeenCalledTimes(1)
    expect(onCancelGlobal).toHaveBeenCalledTimes(1)
    expect(dnd.active.value).toBeNull()

    cardEl.remove()
    zoneEl.remove()
  })
})

describe('pointerTransport', () => {
  it('should emit start on pointerdown over a draggable element', async () => {
    const wrapper = mount({
      template: `<div ref="root"><div ref="card" /></div>`,
      setup () {
        const card = shallowRef<HTMLElement | null>(null)
        const dnd = createDragDrop()
        const ticket = dnd.draggables.register({ el: card, type: 'a', value: null })
        return { card, dnd, ticket }
      },
    }, { attachTo: document.body })

    await nextTick()

    const vm = wrapper.vm as unknown as {
      ticket: ReturnType<ReturnType<typeof createDragDrop>['draggables']['register']>
      dnd: ReturnType<typeof createDragDrop>
    }

    const el = vm.ticket.el.value!
    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
    el.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
    await nextTick()

    expect(vm.dnd.active.value?.id).toBe(vm.ticket.id)
    expect(vm.dnd.active.value?.via).toBe('pointer')

    wrapper.unmount()
  })
})
