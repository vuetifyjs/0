import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, shallowRef, toRef } from 'vue'

// Types
import type { StackContext } from '#v0/composables/useStack'

import { Scrim } from './index'

// Create a mock stack context for testing
function createMockStack (overrides: Partial<{
  isActive: boolean
  isBlocking: boolean
  scrimZIndex: number
}> = {}): StackContext {
  const isActive = shallowRef(overrides.isActive ?? false)
  const isBlocking = shallowRef(overrides.isBlocking ?? false)
  const scrimZIndex = shallowRef(overrides.scrimZIndex ?? 1999)
  const dismiss = vi.fn()

  return {
    registry: {} as any,
    isActive: toRef(() => isActive.value),
    top: toRef(() => undefined),
    scrimZIndex: toRef(() => scrimZIndex.value),
    isBlocking: toRef(() => isBlocking.value),
    dismiss,
    // Expose refs for test manipulation
    _refs: { isActive, isBlocking, scrimZIndex },
  } as StackContext & { _refs: any }
}

describe('scrim', () => {
  describe('rendering', () => {
    it('should render when stack is active', () => {
      const stack = createMockStack({ isActive: true })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: () => h('span', 'Scrim content'),
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
      expect(wrapper.find('span').text()).toBe('Scrim content')
    })

    it('should not render when stack is inactive', () => {
      const stack = createMockStack({ isActive: false })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: () => h('span', 'Scrim content'),
        },
      })

      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('should render as div by default', () => {
      const stack = createMockStack({ isActive: true })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
      })

      // Find the Atom inside the Transition
      const atom = wrapper.find('div')
      expect(atom.exists()).toBe(true)
    })

    it('should render as custom element when as prop is provided', () => {
      const stack = createMockStack({ isActive: true })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false, as: 'section' },
      })

      const atom = wrapper.find('section')
      expect(atom.exists()).toBe(true)
    })
  })

  describe('z-index', () => {
    it('should apply z-index from stack context', () => {
      const stack = createMockStack({ isActive: true, scrimZIndex: 2500 })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
      })

      const atom = wrapper.find('div')
      expect((atom.element as HTMLElement).style.zIndex).toBe('2500')
    })

    it('should update z-index when stack changes', async () => {
      const stack = createMockStack({ isActive: true, scrimZIndex: 1999 }) as any

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
      })

      const atom = wrapper.find('div')
      expect((atom.element as HTMLElement).style.zIndex).toBe('1999')

      stack._refs.scrimZIndex.value = 2099
      await nextTick()

      expect((atom.element as HTMLElement).style.zIndex).toBe('2099')
    })
  })

  describe('dismiss behavior', () => {
    it('should call stack.dismiss on click when not blocking', async () => {
      const stack = createMockStack({ isActive: true, isBlocking: false })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
      })

      const atom = wrapper.find('div')
      await atom.trigger('click')

      expect(stack.dismiss).toHaveBeenCalledTimes(1)
    })

    it('should NOT call stack.dismiss on click when blocking', async () => {
      const stack = createMockStack({ isActive: true, isBlocking: true })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
      })

      const atom = wrapper.find('div')
      await atom.trigger('click')

      expect(stack.dismiss).not.toHaveBeenCalled()
    })

    it('should respect blocking state changes', async () => {
      const stack = createMockStack({ isActive: true, isBlocking: false }) as any

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
      })

      const atom = wrapper.find('div')

      // First click - not blocking
      await atom.trigger('click')
      expect(stack.dismiss).toHaveBeenCalledTimes(1)

      // Change to blocking
      stack._refs.isBlocking.value = true
      await nextTick()

      // Second click - now blocking
      await atom.trigger('click')
      expect(stack.dismiss).toHaveBeenCalledTimes(1) // Still 1, not called again
    })
  })

  describe('teleport', () => {
    beforeEach(() => {
      // Clean up any teleported content
      document.body.innerHTML = ''
    })

    it('should teleport to body by default', async () => {
      const stack = createMockStack({ isActive: true })

      mount(Scrim, {
        props: { stack },
        attachTo: document.body,
        slots: {
          default: () => h('span', { class: 'scrim-content' }, 'Content'),
        },
      })

      await nextTick()

      // Content should be in body via teleport
      const content = document.body.querySelector('.scrim-content')
      expect(content).toBeTruthy()
    })

    it('should render inline when teleport is false', () => {
      const stack = createMockStack({ isActive: true })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: () => h('span', { class: 'scrim-content' }, 'Content'),
        },
      })

      expect(wrapper.find('.scrim-content').exists()).toBe(true)
    })

    it('should teleport to custom target', async () => {
      const stack = createMockStack({ isActive: true })

      // Create custom teleport target
      const target = document.createElement('div')
      target.id = 'custom-target'
      document.body.append(target)

      mount(Scrim, {
        props: { stack, teleportTo: '#custom-target' },
        attachTo: document.body,
        slots: {
          default: () => h('span', { class: 'scrim-content' }, 'Content'),
        },
      })

      await nextTick()

      const content = target.querySelector('.scrim-content')
      expect(content).toBeTruthy()

      target.remove()
    })
  })

  describe('slot props', () => {
    it('should expose isActive slot prop', () => {
      let slotProps: any
      const stack = createMockStack({ isActive: true })

      mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(slotProps).toBeDefined()
      expect(slotProps.isActive).toBe(true)
    })

    it('should expose isBlocking slot prop', () => {
      let slotProps: any
      const stack = createMockStack({ isActive: true, isBlocking: true })

      mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(slotProps.isBlocking).toBe(true)
    })

    it('should expose zIndex slot prop', () => {
      let slotProps: any
      const stack = createMockStack({ isActive: true, scrimZIndex: 3000 })

      mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(slotProps.zIndex).toBe(3000)
    })

    it('should expose dismiss function in slot props', async () => {
      let slotProps: any
      const stack = createMockStack({ isActive: true })

      mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(typeof slotProps.dismiss).toBe('function')

      // Call the slot prop dismiss
      slotProps.dismiss()
      expect(stack.dismiss).toHaveBeenCalledTimes(1)
    })
  })

  describe('transition', () => {
    it('should use fade transition by default', () => {
      const stack = createMockStack({ isActive: true })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
      })

      // Transition component should be rendered
      const transition = wrapper.findComponent({ name: 'Transition' })
      expect(transition.exists()).toBe(true)
      expect(transition.props('name')).toBe('fade')
    })

    it('should use custom transition when specified', () => {
      const stack = createMockStack({ isActive: true })

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false, transition: 'slide' },
      })

      const transition = wrapper.findComponent({ name: 'Transition' })
      expect(transition.props('name')).toBe('slide')
    })
  })

  describe('reactivity', () => {
    it('should show/hide when stack.isActive changes', async () => {
      const stack = createMockStack({ isActive: false }) as any

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: () => h('span', { class: 'scrim-content' }, 'Content'),
        },
      })

      // Initially hidden
      expect(wrapper.find('.scrim-content').exists()).toBe(false)

      // Activate stack
      stack._refs.isActive.value = true
      await nextTick()

      expect(wrapper.find('.scrim-content').exists()).toBe(true)

      // Deactivate stack
      stack._refs.isActive.value = false
      await nextTick()

      expect(wrapper.find('.scrim-content').exists()).toBe(false)
    })
  })

  describe('integration', () => {
    it('should work with multiple scrims using different stack contexts', () => {
      const stack1 = createMockStack({ isActive: true, scrimZIndex: 1999 })
      const stack2 = createMockStack({ isActive: true, scrimZIndex: 2999 })

      // Mount two scrims separately to verify each gets correct z-index
      const wrapper1 = mount(Scrim, {
        props: { stack: stack1, teleport: false },
      })
      const wrapper2 = mount(Scrim, {
        props: { stack: stack2, teleport: false },
      })

      const scrim1 = wrapper1.find('div')
      const scrim2 = wrapper2.find('div')

      expect(scrim1.exists()).toBe(true)
      expect(scrim2.exists()).toBe(true)
      expect((scrim1.element as HTMLElement).style.zIndex).toBe('1999')
      expect((scrim2.element as HTMLElement).style.zIndex).toBe('2999')
    })

    it('should handle rapid activation/deactivation', async () => {
      const stack = createMockStack({ isActive: false }) as any

      const wrapper = mount(Scrim, {
        props: { stack, teleport: false },
        slots: {
          default: () => h('span', 'Content'),
        },
      })

      // Rapid toggles
      stack._refs.isActive.value = true
      await nextTick()
      stack._refs.isActive.value = false
      await nextTick()
      stack._refs.isActive.value = true
      await nextTick()

      expect(wrapper.find('span').exists()).toBe(true)
    })
  })
})
