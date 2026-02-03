import { describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, watch } from 'vue'

// Types
import type { StackContext } from '.'

import {
  createStack,
  createStackContext,
  createStackPlugin,
  useStack,
} from '.'

describe('useStack', () => {
  describe('createStack', () => {
    it('should create stack with default options', () => {
      const stack = createStack()

      expect(stack.isActive.value).toBe(false)
      expect(stack.top.value).toBeUndefined()
      expect(stack.scrimZIndex.value).toBe(0)
      expect(stack.isBlocking.value).toBe(false)
    })

    it('should register tickets', () => {
      const stack = createStack()

      const ticket = stack.register()

      expect(ticket).toBeDefined()
      expect(ticket.id).toBeDefined()
      expect(ticket.blocking).toBe(false)
    })

    it('should register tickets with options', () => {
      const onDismiss = vi.fn()
      const stack = createStack()

      const ticket = stack.register({ onDismiss, blocking: true })

      expect(ticket.blocking).toBe(true)
      expect(ticket.onDismiss).toBe(onDismiss)
    })

    it('should track selection with select/unselect', async () => {
      const stack = createStack()
      const ticket = stack.register()

      expect(ticket.isSelected.value).toBe(false)
      expect(stack.isActive.value).toBe(false)

      ticket.select()
      await nextTick()

      expect(ticket.isSelected.value).toBe(true)
      expect(stack.isActive.value).toBe(true)

      ticket.unselect()
      await nextTick()

      expect(ticket.isSelected.value).toBe(false)
      expect(stack.isActive.value).toBe(false)
    })

    it('should use custom baseZIndex', () => {
      const stack = createStack({ baseZIndex: 1000 })
      const ticket = stack.register()

      ticket.select()

      expect(ticket.zIndex.value).toBe(1000)
    })

    it('should increment z-index for multiple selected tickets', async () => {
      const stack = createStack()

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      ticket1.select()
      await nextTick()

      expect(ticket1.zIndex.value).toBe(2000)

      ticket2.select()
      await nextTick()

      expect(ticket1.zIndex.value).toBe(2000)
      expect(ticket2.zIndex.value).toBe(2010)
    })

    it('should use custom increment', async () => {
      const stack = createStack({ increment: 5 })

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      ticket1.select()
      ticket2.select()
      await nextTick()

      expect(ticket1.zIndex.value).toBe(2000)
      expect(ticket2.zIndex.value).toBe(2005)
    })

    it('should update globalTop when stack changes', async () => {
      const stack = createStack()

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      ticket1.select()
      await nextTick()

      expect(ticket1.globalTop.value).toBe(true)

      ticket2.select()
      await nextTick()

      expect(ticket1.globalTop.value).toBe(false)
      expect(ticket2.globalTop.value).toBe(true)

      ticket2.unselect()
      await nextTick()

      expect(ticket1.globalTop.value).toBe(true)
    })

    it('should track top ticket', async () => {
      const stack = createStack()

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      expect(stack.top.value).toBeUndefined()

      ticket1.select()
      await nextTick()

      expect(stack.top.value?.id).toBe(ticket1.id)

      ticket2.select()
      await nextTick()

      expect(stack.top.value?.id).toBe(ticket2.id)
    })

    it('should provide scrim z-index below top overlay', async () => {
      const stack = createStack()

      const ticket = stack.register()
      ticket.select()
      await nextTick()

      expect(stack.scrimZIndex.value).toBe(1999) // 2000 - 1
    })

    it('should track blocking state', async () => {
      const stack = createStack()

      expect(stack.isBlocking.value).toBe(false)

      const ticket = stack.register({ blocking: true })
      ticket.select()
      await nextTick()

      expect(stack.isBlocking.value).toBe(true)
    })

    it('should call onDismiss when ticket.dismiss is called', async () => {
      const onDismiss = vi.fn()
      const stack = createStack()

      const ticket = stack.register({ onDismiss })
      ticket.select()
      await nextTick()

      ticket.dismiss()

      expect(onDismiss).toHaveBeenCalled()
      expect(ticket.isSelected.value).toBe(false)
    })

    it('should not dismiss when blocking', async () => {
      const onDismiss = vi.fn()
      const stack = createStack()

      const ticket = stack.register({ onDismiss, blocking: true })
      ticket.select()
      await nextTick()

      ticket.dismiss()

      expect(onDismiss).not.toHaveBeenCalled()
      expect(ticket.isSelected.value).toBe(true)
    })

    it('should generate unique ids', () => {
      const stack = createStack()

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      expect(ticket1.id).not.toBe(ticket2.id)
    })

    it('should handle toggle', async () => {
      const stack = createStack()
      const ticket = stack.register()

      expect(ticket.isSelected.value).toBe(false)

      ticket.toggle()
      await nextTick()

      expect(ticket.isSelected.value).toBe(true)

      ticket.toggle()
      await nextTick()

      expect(ticket.isSelected.value).toBe(false)
    })

    it('should update z-index when selection order changes', async () => {
      const stack = createStack()

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      ticket1.select()
      ticket2.select()
      await nextTick()

      expect(ticket1.zIndex.value).toBe(2000)
      expect(ticket2.zIndex.value).toBe(2010)

      // Unselect and reselect first ticket
      ticket1.unselect()
      await nextTick()
      ticket1.select()
      await nextTick()

      // Now ticket1 is on top
      expect(ticket2.zIndex.value).toBe(2000)
      expect(ticket1.zIndex.value).toBe(2010)
    })

    it('should safely handle dismiss when not selected', () => {
      const onDismiss = vi.fn()
      const stack = createStack()

      const ticket = stack.register({ onDismiss })

      // Should not throw
      expect(() => ticket.dismiss()).not.toThrow()
      expect(onDismiss).toHaveBeenCalled()
    })
  })

  describe('createStackContext', () => {
    it('should create context trinity', () => {
      const [useCtx, provideCtx, ctx] = createStackContext()

      expect(useCtx).toBeTypeOf('function')
      expect(provideCtx).toBeTypeOf('function')
      expect(ctx).toBeDefined()
      expect(ctx.isActive.value).toBe(false)
    })

    it('should use custom namespace', () => {
      const [, , ctx] = createStackContext({ namespace: 'my:stack' })

      expect(ctx).toBeDefined()
    })

    it('should pass options to createStack', () => {
      const [, , ctx] = createStackContext({ baseZIndex: 5000 })

      const ticket = ctx.register()
      ticket.select()

      expect(ticket.zIndex.value).toBe(5000)
    })
  })

  describe('createStackPlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createStackPlugin()

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should provide context at app level', () => {
      const plugin = createStackPlugin()

      let contextFound = false
      const TestComponent = defineComponent({
        setup () {
          try {
            const ctx = useStack()
            contextFound = !!ctx
          } catch {
            contextFound = false
          }
          return () => null
        },
      })

      mount(TestComponent, {
        global: {
          plugins: [plugin],
        },
      })

      expect(contextFound).toBe(true)
    })
  })

  describe('useStack', () => {
    it('should return context from provider', () => {
      const plugin = createStackPlugin()

      let stack: StackContext | undefined

      const TestComponent = defineComponent({
        setup () {
          stack = useStack()
          return () => null
        },
      })

      mount(TestComponent, {
        global: { plugins: [plugin] },
      })

      expect(stack).toBeDefined()
      expect(stack!.isActive.value).toBe(false)
    })
  })

  describe('integration with watch', () => {
    it('should work with watch for reactive toggling', async () => {
      const stack = createStack()
      const isOpen = ref(false)

      const ticket = stack.register({
        onDismiss: () => {
          isOpen.value = false
        },
      })

      // Typical component pattern
      watch(isOpen, v => v ? ticket.select() : ticket.unselect(), { immediate: true })

      expect(ticket.isSelected.value).toBe(false)
      expect(stack.isActive.value).toBe(false)

      isOpen.value = true
      await nextTick()

      expect(ticket.isSelected.value).toBe(true)
      expect(stack.isActive.value).toBe(true)

      isOpen.value = false
      await nextTick()

      expect(ticket.isSelected.value).toBe(false)
      expect(stack.isActive.value).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should maintain correct order with many overlays', async () => {
      const stack = createStack()

      const tickets = Array.from({ length: 10 }, () => stack.register())

      // Select all
      for (const ticket of tickets) {
        ticket.select()
      }
      await nextTick()

      // Verify z-index order
      for (const [index, ticket] of tickets.entries()) {
        expect(ticket.zIndex.value).toBe(2000 + index * 10)
      }

      // Only last should be globalTop
      for (const [index, ticket] of tickets.entries()) {
        expect(ticket.globalTop.value).toBe(index === 9)
      }

      // Unselect some
      tickets[3]!.unselect()
      tickets[7]!.unselect()
      tickets[1]!.unselect()
      await nextTick()

      // Last remaining should still be globalTop
      expect(tickets[9]!.globalTop.value).toBe(true)
    })

    it('should handle rapid toggle cycles', async () => {
      const stack = createStack()

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      ticket1.select()
      await nextTick()

      // Rapid toggle
      ticket2.select()
      ticket2.unselect()
      ticket2.select()
      await nextTick()

      // Both should be selected, ticket2 on top
      expect(ticket1.isSelected.value).toBe(true)
      expect(ticket2.isSelected.value).toBe(true)
      expect(ticket1.globalTop.value).toBe(false)
      expect(ticket2.globalTop.value).toBe(true)
    })

    it('should handle concurrent selection in same tick', async () => {
      const stack = createStack()

      const ticket1 = stack.register()
      const ticket2 = stack.register()

      // Select both in same tick
      ticket1.select()
      ticket2.select()

      await nextTick()

      expect(stack.selectedIds.size).toBe(2)
      expect(ticket1.zIndex.value).toBe(2000)
      expect(ticket2.zIndex.value).toBe(2010)
    })

    it('should handle unregister while selected', async () => {
      const stack = createStack()

      const ticket = stack.register()
      ticket.select()
      await nextTick()

      expect(stack.isActive.value).toBe(true)
      expect(stack.size).toBe(1)

      stack.unregister(ticket.id)

      expect(stack.size).toBe(0)
      expect(stack.isActive.value).toBe(false)
    })

    it('should handle dismiss that opens another overlay', async () => {
      const stack = createStack()
      const isOpen2 = ref(false)

      const ticket1 = stack.register({
        onDismiss: () => {
          isOpen2.value = true
        },
      })
      const ticket2 = stack.register()

      watch(isOpen2, v => v ? ticket2.select() : ticket2.unselect())

      ticket1.select()
      await nextTick()

      expect(stack.selectedIds.size).toBe(1)

      // Dismiss should trigger callback which opens ticket2
      ticket1.dismiss()
      await nextTick()

      expect(isOpen2.value).toBe(true)
      expect(ticket2.isSelected.value).toBe(true)
    })

    it('should handle multiple blocking overlays correctly', async () => {
      const onDismiss1 = vi.fn()
      const onDismiss2 = vi.fn()
      const stack = createStack()

      const ticket1 = stack.register({ onDismiss: onDismiss1, blocking: true })
      const ticket2 = stack.register({ onDismiss: onDismiss2, blocking: true })

      ticket1.select()
      ticket2.select()
      await nextTick()

      expect(stack.isBlocking.value).toBe(true)

      // Dismiss should not work on blocking
      ticket2.dismiss()
      expect(onDismiss2).not.toHaveBeenCalled()
      expect(ticket2.isSelected.value).toBe(true)
    })
  })
})
