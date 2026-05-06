import { describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { effectScope, isRef, nextTick, shallowRef } from 'vue'

// Types
import type {
  DragDropAdapterContext,
  DragDropAdapterEmit,
  DragType,
} from './'

import { DragDropAdapter, KeyboardAdapter, PointerAdapter, useDragDrop } from './'

class CaptureAdapter<Z extends DragType = DragType> extends DragDropAdapter<Z> {
  emit!: DragDropAdapterEmit<Z>
  setup (context: DragDropAdapterContext<Z>): void {
    this.emit = context.emit
  }
}

describe('useDragDrop', () => {
  describe('factory', () => {
    it('should return a context with draggables, zones, active, isDragging, cancel', () => {
      const dnd = useDragDrop({ adapters: [] })

      expect(dnd.draggables).toBeDefined()
      expect(dnd.zones).toBeDefined()
      expect(dnd.active.value).toBeNull()
      expect(dnd.isDragging.value).toBe(false)
      expect(typeof dnd.cancel).toBe('function')
    })

    it('should construct both registries with events enabled', () => {
      const dnd = useDragDrop({ adapters: [] })

      expect(typeof dnd.draggables.on).toBe('function')
      expect(typeof dnd.zones.on).toBe('function')
    })

    it('should run plugins at install time and dispose on scope dispose', () => {
      const installed: string[] = []
      const disposed: string[] = []
      const scope = effectScope()

      scope.run(() => {
        useDragDrop({
          adapters: [],
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
      const dnd = useDragDrop({ adapters: [] })
      expect(() => dnd.cancel()).not.toThrow()
      expect(dnd.active.value).toBeNull()
    })
  })
})

describe('draggables.register', () => {
  it('should return a ticket with type, value, el, isDragging', () => {
    const dnd = useDragDrop<{ type: 'card', value: { id: number } }>({ adapters: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const ticket = dnd.draggables.register({ el, type: 'card', value: { id: 1 } })

    expect(ticket.type).toBe('card')
    expect(ticket.value).toEqual({ id: 1 })
    expect(isRef(ticket.el)).toBe(true)
    expect(isRef(ticket.isDragging)).toBe(true)
    expect(ticket.isDragging.value).toBe(false)
  })

  it('should expose isDragging false when no drag is active', () => {
    const dnd = useDragDrop({ adapters: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const ticket = dnd.draggables.register({ el, type: 'a', value: null })

    expect(ticket.isDragging.value).toBe(false)
  })

  it('should mark isDragging true while ticket is the active drag', async () => {
    const adapter = new CaptureAdapter()
    const dnd = useDragDrop({ adapters: [adapter] })
    const el = shallowRef<HTMLElement | null>(null)

    const ticket = dnd.draggables.register({ el, type: 'a', value: null })

    expect(ticket.isDragging.value).toBe(false)

    adapter.emit.start(ticket, { x: 0, y: 0 }, 'pointer')
    await nextTick()

    expect(ticket.isDragging.value).toBe(true)
  })

  it('should not start a drag when draggable is disabled', async () => {
    const cardEl = makeFocusableEl('disabled-drag-1')
    const disabled = shallowRef(true)

    const dnd = useDragDrop()
    dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null, disabled })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()

    expect(dnd.active.value).toBeNull()

    disabled.value = false
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()

    expect(dnd.active.value).not.toBeNull()

    cardEl.remove()
  })
})

describe('zones.register', () => {
  it('should return a ticket with el, isOver, willAccept, indicator', () => {
    const dnd = useDragDrop({ adapters: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const zone = dnd.zones.register({ el, accept: ['card'] })

    expect(isRef(zone.el)).toBe(true)
    expect(zone.isOver.value).toBe(false)
    expect(zone.willAccept.value).toBe(false)
    expect(zone.indicator.value).toBeNull()
  })

  it('should set willAccept when active drag matches accept array', () => {
    type Z = { type: 'card', value: null } | { type: 'column', value: null }
    const adapter = new CaptureAdapter<Z>()
    const dnd = useDragDrop<Z>({ adapters: [adapter] })
    const el = shallowRef<HTMLElement | null>(null)

    const zone = dnd.zones.register({ el, accept: ['card'] })
    const card = dnd.draggables.register({ el, type: 'card', value: null })
    const column = dnd.draggables.register({ el, type: 'column', value: null })

    expect(zone.willAccept.value).toBe(false)

    adapter.emit.start(card, { x: 0, y: 0 }, 'pointer')
    expect(zone.willAccept.value).toBe(true)

    adapter.emit.cancel()
    adapter.emit.start(column, { x: 0, y: 0 }, 'pointer')
    expect(zone.willAccept.value).toBe(false)
  })

  it('should call accept predicate when accept is a function', () => {
    const adapter = new CaptureAdapter()
    const dnd = useDragDrop({ adapters: [adapter] })
    const el = shallowRef<HTMLElement | null>(null)
    const accept = vi.fn(() => true)

    const zone = dnd.zones.register({ el, accept })
    const ticket = dnd.draggables.register({ el, type: 'a', value: null })

    adapter.emit.start(ticket, { x: 0, y: 0 }, 'pointer')

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

describe('keyboardAdapter', () => {
  it('should pick up focused draggable on Space', async () => {
    const cardEl = makeFocusableEl('card-key-1')

    const dnd = useDragDrop()
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

    const dnd = useDragDrop()
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
    const dnd = useDragDrop()

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

    const dnd = useDragDrop({ onCancel: onCancelGlobal })
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

    const realFromPoint = document.elementFromPoint.bind(document)
    document.elementFromPoint = () => zoneEl
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })) // drop attempt
    document.elementFromPoint = realFromPoint
    await nextTick()

    expect(onDrop).not.toHaveBeenCalled()
    expect(onCancelDraggable).toHaveBeenCalledTimes(1)
    expect(onCancelDraggable).toHaveBeenCalledWith(expect.any(Object), 'reject')
    expect(onCancelGlobal).toHaveBeenCalledTimes(1)
    expect(onCancelGlobal).toHaveBeenCalledWith(expect.any(Object), 'reject')
    expect(dnd.active.value).toBeNull()

    cardEl.remove()
    zoneEl.remove()
  })

  it('should fire onCancel when drop happens with no over-zone', async () => {
    const cardEl = makeFocusableEl('lc-3')

    const onCancelDraggable = vi.fn()
    const onCancelGlobal = vi.fn()

    const dnd = useDragDrop({ onCancel: onCancelGlobal })
    dnd.draggables.register({
      el: shallowRef(cardEl),
      type: 'a',
      value: null,
      onCancel: onCancelDraggable,
    })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()

    expect(onCancelDraggable).toHaveBeenCalledTimes(1)
    expect(onCancelDraggable).toHaveBeenCalledWith(expect.any(Object), 'cancel')
    expect(onCancelGlobal).toHaveBeenCalledTimes(1)
    expect(onCancelGlobal).toHaveBeenCalledWith(expect.any(Object), 'cancel')
    expect(dnd.active.value).toBeNull()

    cardEl.remove()
  })

  it('should fire onLeave / onEnter on zone change', async () => {
    const cardEl = makeFocusableEl('lc-4')
    const zoneA = document.createElement('div')
    const zoneB = document.createElement('div')
    document.body.append(zoneA, zoneB)

    const aEnter = vi.fn()
    const aLeave = vi.fn()
    const bEnter = vi.fn()
    const bLeave = vi.fn()

    const dnd = useDragDrop()
    dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })
    dnd.zones.register({ el: shallowRef(zoneA), onEnter: aEnter, onLeave: aLeave })
    dnd.zones.register({ el: shallowRef(zoneB), onEnter: bEnter, onLeave: bLeave })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    const realFromPoint = document.elementFromPoint.bind(document)

    document.elementFromPoint = () => zoneA
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()

    document.elementFromPoint = () => zoneB
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()

    document.elementFromPoint = realFromPoint

    expect(aEnter).toHaveBeenCalledTimes(1)
    expect(aLeave).toHaveBeenCalledTimes(1)
    expect(bEnter).toHaveBeenCalledTimes(1)
    expect(bLeave).not.toHaveBeenCalled()

    cardEl.remove()
    zoneA.remove()
    zoneB.remove()
  })

  it('should not install default adapters when adapters: []', () => {
    const cardEl = makeFocusableEl('lc-5')
    const dnd = useDragDrop({ adapters: [] })
    dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    expect(dnd.active.value).toBeNull()

    cardEl.remove()
  })
})

describe('pointerAdapter', () => {
  it('should emit start on pointerdown over a draggable element', async () => {
    const wrapper = mount({
      template: `<div ref="root"><div ref="card" /></div>`,
      setup () {
        const card = shallowRef<HTMLElement | null>(null)
        const dnd = useDragDrop()
        const ticket = dnd.draggables.register({ el: card, type: 'a', value: null })
        return { card, dnd, ticket }
      },
    }, { attachTo: document.body })

    await nextTick()

    const vm = wrapper.vm as unknown as {
      ticket: ReturnType<ReturnType<typeof useDragDrop>['draggables']['register']>
      dnd: ReturnType<typeof useDragDrop>
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

describe('drop', () => {
  it('should fire onDrop happy-path with drag and position; clears active afterward', async () => {
    const cardEl = makeFocusableEl('drop-happy-1')
    const zoneEl = document.createElement('div')
    document.body.append(zoneEl)

    const zoneOnDrop = vi.fn()
    const globalOnDrop = vi.fn()
    const onCancel = vi.fn()
    const onLeave = vi.fn()

    const dnd = useDragDrop({ onDrop: globalOnDrop, onCancel })
    dnd.draggables.register({
      el: shallowRef(cardEl),
      type: 'a',
      value: { name: 'card-1' },
    })
    dnd.zones.register({
      el: shallowRef(zoneEl),
      onDrop: zoneOnDrop,
      onLeave,
    })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    const realFromPoint = document.elementFromPoint.bind(document)
    document.elementFromPoint = () => zoneEl
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })) // drop
    document.elementFromPoint = realFromPoint
    await nextTick()

    expect(zoneOnDrop).toHaveBeenCalledTimes(1)
    expect(zoneOnDrop).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'a', value: { name: 'card-1' } }),
      expect.objectContaining({ pointer: expect.any(Object) }),
    )
    expect(globalOnDrop).toHaveBeenCalledTimes(1)
    expect(globalOnDrop).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'a', value: { name: 'card-1' } }),
      expect.objectContaining({ pointer: expect.any(Object) }),
    )
    expect(dnd.active.value).toBeNull()
    expect(onCancel).not.toHaveBeenCalled()
    expect(onLeave).not.toHaveBeenCalled()

    cardEl.remove()
    zoneEl.remove()
  })

  it('should resolve position.index to 0 with no indicator on empty oriented zone', async () => {
    const cardEl = makeFocusableEl('drop-empty-1')
    const zoneEl = document.createElement('div')
    document.body.append(zoneEl)

    const zoneOnDrop = vi.fn()

    const dnd = useDragDrop()
    dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })
    dnd.zones.register({
      el: shallowRef(zoneEl),
      orientation: 'vertical',
      onDrop: zoneOnDrop,
    })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    const realFromPoint = document.elementFromPoint.bind(document)
    document.elementFromPoint = () => zoneEl
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })) // drop
    document.elementFromPoint = realFromPoint
    await nextTick()

    expect(zoneOnDrop).toHaveBeenCalledTimes(1)
    const position = zoneOnDrop.mock.calls[0][1]
    expect(position.index).toBe(0)
    expect(position.indicator).toBeUndefined()

    cardEl.remove()
    zoneEl.remove()
  })

  it('should not list disabled zones as drop targets', async () => {
    const cardEl = makeFocusableEl('drop-disabled-zone-1')
    const zoneEl = document.createElement('div')
    document.body.append(zoneEl)

    const zoneOnDrop = vi.fn()
    const onCancel = vi.fn()

    const dnd = useDragDrop({ onCancel })
    dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })
    dnd.zones.register({
      el: shallowRef(zoneEl),
      disabled: true,
      onDrop: zoneOnDrop,
    })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    const realFromPoint = document.elementFromPoint.bind(document)
    document.elementFromPoint = () => zoneEl
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()

    expect(dnd.active.value?.over).toBeNull()

    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })) // drop
    document.elementFromPoint = realFromPoint
    await nextTick()

    expect(zoneOnDrop).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledTimes(1)

    cardEl.remove()
    zoneEl.remove()
  })
})

describe('hook ordering', () => {
  it('should fire leave, enter, draggableMove, globalMove in order on zone change', async () => {
    const cardEl = makeFocusableEl('order-1')
    const zoneA = document.createElement('div')
    const zoneB = document.createElement('div')
    document.body.append(zoneA, zoneB)

    const sequence: string[] = []

    const dnd = useDragDrop({
      onMove: () => sequence.push('globalMove'),
    })
    dnd.draggables.register({
      el: shallowRef(cardEl),
      type: 'a',
      value: null,
      onMove: () => sequence.push('draggableMove'),
    })
    dnd.zones.register({
      el: shallowRef(zoneA),
      onEnter: () => sequence.push('enterA'),
      onLeave: () => sequence.push('leaveA'),
    })
    dnd.zones.register({
      el: shallowRef(zoneB),
      onEnter: () => sequence.push('enterB'),
      onLeave: () => sequence.push('leaveB'),
    })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    const realFromPoint = document.elementFromPoint.bind(document)

    document.elementFromPoint = () => zoneA
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()

    sequence.length = 0
    document.elementFromPoint = () => zoneB
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()

    document.elementFromPoint = realFromPoint

    expect(sequence).toEqual(['leaveA', 'enterB', 'draggableMove', 'globalMove'])

    cardEl.remove()
    zoneA.remove()
    zoneB.remove()
  })
})

describe('scope teardown', () => {
  it('should remove document listeners after scope.stop()', () => {
    const scope = effectScope()
    let dnd: ReturnType<typeof useDragDrop> | undefined

    scope.run(() => {
      dnd = useDragDrop()
    })

    const cardEl = makeFocusableEl('teardown-1')
    dnd!.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

    scope.stop()

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    cardEl.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 0, clientY: 0, pointerId: 1, bubbles: true }),
    )

    expect(dnd!.active.value).toBeNull()

    cardEl.remove()
  })
})

describe('cancel chain', () => {
  it('should fire cancel chain when cancel() called during active drag', () => {
    const adapter = new CaptureAdapter()
    const onCancel = vi.fn()
    const onLeave = vi.fn()

    const dnd = useDragDrop({ adapters: [adapter], onCancel })
    const ticket = dnd.draggables.register({ el: shallowRef(null), type: 'a', value: null, onCancel })
    dnd.zones.register({ el: shallowRef(null), onLeave })

    adapter.emit.start(ticket, { x: 0, y: 0 }, 'pointer')
    expect(dnd.active.value).not.toBeNull()

    dnd.cancel()

    expect(onCancel).toHaveBeenCalledTimes(2) // per-draggable + global
    expect(onCancel).toHaveBeenCalledWith(expect.any(Object), 'cancel')
    expect(dnd.active.value).toBeNull()
  })

  it('should swallow throwing hook and continue via logger.error', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const adapter = new CaptureAdapter()
    const onMove = vi.fn(() => {
      throw new Error('boom')
    })
    const globalMove = vi.fn()

    const dnd = useDragDrop({ adapters: [adapter], onMove: globalMove })
    const ticket = dnd.draggables.register({ el: shallowRef(null), type: 'a', value: null, onMove })

    adapter.emit.start(ticket, { x: 0, y: 0 }, 'pointer')
    expect(() => adapter.emit.move({ x: 5, y: 5 })).not.toThrow()
    expect(onMove).toHaveBeenCalledTimes(1)
    expect(globalMove).toHaveBeenCalledTimes(1)
    expect(error).toHaveBeenCalledTimes(1)
    error.mockRestore()
  })
})

describe('accepts predicate', () => {
  it('should reject when predicate returns false', () => {
    const adapter = new CaptureAdapter()
    const dnd = useDragDrop({ adapters: [adapter] })
    const accept = vi.fn(() => false)

    const zone = dnd.zones.register({ el: shallowRef(null), accept })
    const ticket = dnd.draggables.register({ el: shallowRef(null), type: 'a', value: null })

    adapter.emit.start(ticket, { x: 0, y: 0 }, 'pointer')

    expect(zone.willAccept.value).toBe(false)
    expect(accept).toHaveBeenCalledTimes(1)
  })
})

describe('indicator', () => {
  it('should resolve index against child rects on oriented zone', async () => {
    const adapter = new CaptureAdapter()
    const cardEl = makeFocusableEl('indicator-1')
    const zoneEl = document.createElement('div')
    const child = document.createElement('div')
    zoneEl.append(child)
    document.body.append(zoneEl)

    child.getBoundingClientRect = () => ({
      top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect)

    const dnd = useDragDrop({ adapters: [adapter] })
    const ticket = dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })
    const zone = dnd.zones.register({ el: shallowRef(zoneEl), orientation: 'vertical' })

    await nextTick()

    adapter.emit.start(ticket, { x: 0, y: 0 }, 'pointer')

    const realFromPoint = document.elementFromPoint.bind(document)
    document.elementFromPoint = () => zoneEl

    adapter.emit.move({ x: 50, y: 25 }) // upper half → before
    expect(zone.indicator.value?.edge).toBe('before')
    expect(zone.indicator.value?.index).toBe(0)

    adapter.emit.move({ x: 50, y: 75 }) // lower half → after
    expect(zone.indicator.value?.edge).toBe('after')
    expect(zone.indicator.value?.index).toBe(1)

    document.elementFromPoint = realFromPoint
    cardEl.remove()
    zoneEl.remove()
  })
})

describe('pointerAdapter threshold', () => {
  it('should defer start until threshold distance is exceeded', async () => {
    const wrapper = mount({
      template: `<div ref="root"><div ref="card" /></div>`,
      setup () {
        const card = shallowRef<HTMLElement | null>(null)
        const dnd = useDragDrop({ adapters: [new PointerAdapter({ threshold: 10 })] })
        const ticket = dnd.draggables.register({ el: card, type: 'a', value: null })
        return { card, dnd, ticket }
      },
    }, { attachTo: document.body })

    await nextTick()

    const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
    const el = vm.card

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, pointerId: 1, bubbles: true }))
    el.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 0, pointerId: 1, bubbles: true }))

    expect(vm.dnd.active.value).toBeNull() // under threshold

    el.dispatchEvent(new PointerEvent('pointermove', { clientX: 12, clientY: 0, pointerId: 1, bubbles: true }))

    expect(vm.dnd.active.value).not.toBeNull() // crossed threshold

    wrapper.unmount()
  })
})

describe('keyboardAdapter options', () => {
  it('should honour custom activate keys', async () => {
    const cardEl = makeFocusableEl('kb-custom-1')
    const dnd = useDragDrop({ adapters: [new KeyboardAdapter({ activate: ['x'] })] })
    const ticket = dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(dnd.active.value).toBeNull() // Space is no longer the activate key

    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    await nextTick()
    expect(dnd.active.value?.id).toBe(ticket.id)

    cardEl.remove()
  })

  it('should nudge by custom step on arrow keys', async () => {
    const cardEl = makeFocusableEl('kb-step-1')
    const dnd = useDragDrop({ adapters: [new KeyboardAdapter({ step: 50 })] })
    dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

    cardEl.getBoundingClientRect = () => ({
      top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect)

    cardEl.focus()
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()

    expect(dnd.active.value?.current.y).toBe(50)

    cardEl.remove()
  })

  it('should warn and short-circuit when adapter setup is called twice', () => {
    const adapter = new KeyboardAdapter()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    useDragDrop({ adapters: [adapter] })
    adapter.setup({} as unknown as DragDropAdapterContext<DragType>)

    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
