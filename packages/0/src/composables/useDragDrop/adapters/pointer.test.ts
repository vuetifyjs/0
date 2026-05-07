import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { nextTick, shallowRef } from 'vue'

// Types
import type { DragDropAdapterContext, DragType } from '../'

import { PointerAdapter, useDragDrop } from '../'

describe('pointerAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('instantiation', () => {
    it('should construct without options', () => {
      const adapter = new PointerAdapter()

      expect(adapter).toBeInstanceOf(PointerAdapter)
      expect(typeof adapter.setup).toBe('function')
    })

    it('should accept threshold option', () => {
      const adapter = new PointerAdapter({ threshold: 16 })

      expect(adapter).toBeInstanceOf(PointerAdapter)
    })
  })

  describe('button gating', () => {
    it('should ignore non-primary mouse buttons (button !== 0)', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, button: 2, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 30, pointerId: 1, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value).toBeNull()

      wrapper.unmount()
    })

    it('should ignore subsequent pointerdown while a downSource is held', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 30, pointerId: 1, bubbles: true }))
      await nextTick()
      const idAfterFirst = vm.dnd.active.value?.id

      // Second pointerdown while we already have a downSource — should be ignored
      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 50, clientY: 50, pointerId: 2, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value?.id).toBe(idAfterFirst)

      wrapper.unmount()
    })
  })

  describe('locate failure', () => {
    it('should not start drag when pointerdown happens outside any draggable', async () => {
      const outside = document.createElement('div')
      document.body.append(outside)

      const dnd = useDragDrop()
      const cardEl = document.createElement('div')
      document.body.append(cardEl)
      dnd.draggables.register({ el: shallowRef(cardEl), type: 'a', value: null })

      outside.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, pointerId: 1, bubbles: true }))
      outside.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 0, pointerId: 1, bubbles: true }))
      await nextTick()

      expect(dnd.active.value).toBeNull()

      cardEl.remove()
      outside.remove()
    })
  })

  describe('pointerup', () => {
    it('should emit drop on pointerup after a started drag', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          dnd.zones.register({ el: card, onDrop: () => {} })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value).not.toBeNull()

      el.dispatchEvent(new PointerEvent('pointerup', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
      await nextTick()

      // No over zone — drop with no zone results in cancel chain, but active is cleared either way.
      expect(vm.dnd.active.value).toBeNull()

      wrapper.unmount()
    })

    it('should ignore pointerup with mismatched pointerId', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value).not.toBeNull()

      // Mismatched pointer id — should be ignored
      el.dispatchEvent(new PointerEvent('pointerup', { clientX: 20, clientY: 20, pointerId: 99, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value).not.toBeNull()

      // Real pointer up to clean up
      el.dispatchEvent(new PointerEvent('pointerup', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value).toBeNull()

      wrapper.unmount()
    })

    it('should reset state on pointerup without emitting drop when not started', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop({ adapters: [new PointerAdapter({ threshold: 100 })] })
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      // Move under threshold — drag never starts
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 12, clientY: 12, pointerId: 1, bubbles: true }))
      expect(vm.dnd.active.value).toBeNull()

      el.dispatchEvent(new PointerEvent('pointerup', { clientX: 12, clientY: 12, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value).toBeNull()

      // After reset, a fresh pointerdown / move should still work
      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, pointerId: 2, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 200, pointerId: 2, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value).not.toBeNull()

      wrapper.unmount()
    })
  })

  describe('pointercancel', () => {
    it('should emit cancel on pointercancel after a started drag', async () => {
      const onCancel = vi.fn()
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop({ onCancel })
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value).not.toBeNull()

      el.dispatchEvent(new PointerEvent('pointercancel', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value).toBeNull()
      expect(onCancel).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should ignore pointercancel with mismatched pointerId', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value).not.toBeNull()

      // Mismatched pointer id — should be ignored
      el.dispatchEvent(new PointerEvent('pointercancel', { clientX: 20, clientY: 20, pointerId: 99, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value).not.toBeNull()

      wrapper.unmount()
    })

    it('should not emit cancel on pointercancel when drag never started', async () => {
      const onCancel = vi.fn()
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop({
            adapters: [new PointerAdapter({ threshold: 100 })],
            onCancel,
          })
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      // Threshold not crossed
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 11, clientY: 11, pointerId: 1, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointercancel', { clientX: 11, clientY: 11, pointerId: 1, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value).toBeNull()
      expect(onCancel).not.toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  describe('move guards', () => {
    it('should ignore pointermove with mismatched pointerId', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true }))
      // Wrong pointerId
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, clientY: 100, pointerId: 99, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value).toBeNull()

      wrapper.unmount()
    })

    it('should ignore pointermove with no preceding pointerdown', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 50, pointerId: 1, bubbles: true }))
      await nextTick()

      expect(vm.dnd.active.value).toBeNull()

      wrapper.unmount()
    })
  })

  describe('move after start', () => {
    it('should keep emitting move on subsequent pointermove events after drag started', async () => {
      const wrapper = mount({
        template: `<div ref="card" />`,
        setup () {
          const card = shallowRef<HTMLElement | null>(null)
          const dnd = useDragDrop()
          dnd.draggables.register({ el: card, type: 'a', value: null })
          return { card, dnd }
        },
      }, { attachTo: document.body })

      await nextTick()
      const vm = wrapper.vm as unknown as { dnd: ReturnType<typeof useDragDrop>, card: HTMLElement }
      const el = vm.card

      el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, pointerId: 1, bubbles: true }))
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 0, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value?.current.x).toBe(10)

      // Subsequent move — !started branch is now false; continues straight to emit.move
      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 0, pointerId: 1, bubbles: true }))
      await nextTick()
      expect(vm.dnd.active.value?.current.x).toBe(50)

      wrapper.unmount()
    })
  })

  describe('setup-twice warning', () => {
    it('should warn and replace previous registration when setup called twice', () => {
      const adapter = new PointerAdapter()
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // First setup via useDragDrop
      useDragDrop({ adapters: [adapter] })
      // Second setup direct
      adapter.setup({} as unknown as DragDropAdapterContext<DragType>)

      expect(warn).toHaveBeenCalled()
      expect(warn.mock.calls[0]?.join(' ')).toContain('setup called twice')

      warn.mockRestore()
    })
  })
})
