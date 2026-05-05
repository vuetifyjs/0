import { describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { effectScope, isRef, nextTick, shallowRef } from 'vue'

import { useDragDrop } from './'

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
    const dnd = useDragDrop({ adapters: [] })
    const el = shallowRef<HTMLElement | null>(null)

    const ticket = dnd.draggables.register({ el, type: 'a', value: null })

    expect(ticket.isDragging.value).toBe(false)

    ;(dnd.active as any).value = {
      id: ticket.id, type: 'a', value: null,
      origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, delta: { x: 0, y: 0 },
      over: null, willAccept: false, via: 'pointer',
    }
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
    type K = { type: 'card', value: null } | { type: 'column', value: null }
    const dnd = useDragDrop<K>({ adapters: [] })
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
    const dnd = useDragDrop({ adapters: [] })
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
