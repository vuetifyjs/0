import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { computed, h, nextTick, shallowRef } from 'vue'

// Types
import type { StackTicket } from '#v0/composables/useStack'

import { Scrim } from './index'

// Mock useStack
const mockSelectedItems = shallowRef(new Set<StackTicket>())

vi.mock('#v0/composables/useStack', () => ({
  useStack: () => ({
    selectedItems: computed(() => mockSelectedItems.value),
  }),
}))

function createMockTicket (overrides: {
  id?: string
  zIndex?: number
  blocking?: boolean
} = {}): StackTicket {
  const dismiss = vi.fn()
  return {
    id: overrides.id ?? 'ticket-1',
    zIndex: computed(() => overrides.zIndex ?? 2000),
    blocking: overrides.blocking ?? false,
    dismiss,
    // Minimal ticket properties for testing
    index: 0,
    value: undefined,
    valueIsIndex: true,
    isSelected: computed(() => true),
    select: vi.fn(),
    unselect: vi.fn(),
    toggle: vi.fn(),
    disabled: false,
    globalTop: computed(() => true),
  } as unknown as StackTicket
}

describe('scrim', () => {
  beforeEach(() => {
    mockSelectedItems.value = new Set()
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('should render one scrim per selected ticket', async () => {
      const ticket1 = createMockTicket({ id: 'ticket-1', zIndex: 2000 })
      const ticket2 = createMockTicket({ id: 'ticket-2', zIndex: 2010 })
      mockSelectedItems.value = new Set([ticket1, ticket2])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: () => h('span', 'Scrim content'),
        },
      })

      await nextTick()
      expect(wrapper.findAll('span').length).toBe(2)
    })

    it('should not render when no tickets are selected', () => {
      mockSelectedItems.value = new Set()

      const wrapper = mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: () => h('span', 'Scrim content'),
        },
      })

      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('should render as div by default', async () => {
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
      })

      await nextTick()
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render as custom element when as prop is provided', async () => {
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false, as: 'section' },
      })

      await nextTick()
      expect(wrapper.find('section').exists()).toBe(true)
    })
  })

  describe('z-index', () => {
    it('should apply z-index one below the ticket zIndex', async () => {
      const ticket = createMockTicket({ zIndex: 2500 })
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
      })

      await nextTick()
      const atom = wrapper.find('div')
      expect((atom.element as HTMLElement).style.zIndex).toBe('2499')
    })

    it('should apply different z-indexes for each ticket', async () => {
      const ticket1 = createMockTicket({ id: 'ticket-1', zIndex: 2000 })
      const ticket2 = createMockTicket({ id: 'ticket-2', zIndex: 2010 })
      mockSelectedItems.value = new Set([ticket1, ticket2])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
      })

      await nextTick()
      const atoms = wrapper.findAll('div')
      expect(atoms.length).toBe(2)
      expect((atoms[0]!.element as HTMLElement).style.zIndex).toBe('1999')
      expect((atoms[1]!.element as HTMLElement).style.zIndex).toBe('2009')
    })
  })

  describe('dismiss behavior', () => {
    it('should call ticket.dismiss on click when not blocking', async () => {
      const ticket = createMockTicket({ blocking: false })
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
      })

      await nextTick()
      await wrapper.find('div').trigger('click')

      expect(ticket.dismiss).toHaveBeenCalledTimes(1)
    })

    it('should NOT call ticket.dismiss on click when blocking', async () => {
      const ticket = createMockTicket({ blocking: true })
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
      })

      await nextTick()
      await wrapper.find('div').trigger('click')

      expect(ticket.dismiss).not.toHaveBeenCalled()
    })

    it('should dismiss correct ticket when multiple exist', async () => {
      const ticket1 = createMockTicket({ id: 'ticket-1', zIndex: 2000, blocking: false })
      const ticket2 = createMockTicket({ id: 'ticket-2', zIndex: 2010, blocking: false })
      mockSelectedItems.value = new Set([ticket1, ticket2])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
      })

      await nextTick()
      const atoms = wrapper.findAll('div')

      // Click second scrim
      await atoms[1]!.trigger('click')

      expect(ticket1.dismiss).not.toHaveBeenCalled()
      expect(ticket2.dismiss).toHaveBeenCalledTimes(1)
    })
  })

  describe('teleport', () => {
    it('should teleport to body by default', async () => {
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      mount(Scrim, {
        attachTo: document.body,
        slots: {
          default: () => h('span', { class: 'scrim-content' }, 'Content'),
        },
      })

      await nextTick()
      const content = document.body.querySelector('.scrim-content')
      expect(content).toBeTruthy()
    })

    it('should render inline when teleport is false', async () => {
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: () => h('span', { class: 'scrim-content' }, 'Content'),
        },
      })

      await nextTick()
      expect(wrapper.find('.scrim-content').exists()).toBe(true)
    })

    it('should teleport to custom target', async () => {
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      const target = document.createElement('div')
      target.id = 'custom-target'
      document.body.append(target)

      mount(Scrim, {
        props: { teleportTo: '#custom-target' },
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
    it('should expose ticket in slot props', async () => {
      let slotProps: any
      const ticket = createMockTicket({ id: 'test-ticket' })
      mockSelectedItems.value = new Set([ticket])

      mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()
      expect(slotProps).toBeDefined()
      expect(slotProps.ticket.id).toBe('test-ticket')
    })

    it('should expose zIndex in slot props', async () => {
      let slotProps: any
      const ticket = createMockTicket({ zIndex: 3000 })
      mockSelectedItems.value = new Set([ticket])

      mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()
      expect(slotProps.zIndex).toBe(2999)
    })

    it('should expose isBlocking in slot props', async () => {
      let slotProps: any
      const ticket = createMockTicket({ blocking: true })
      mockSelectedItems.value = new Set([ticket])

      mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()
      expect(slotProps.isBlocking).toBe(true)
    })

    it('should expose dismiss function in slot props', async () => {
      let slotProps: any
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()
      expect(typeof slotProps.dismiss).toBe('function')

      slotProps.dismiss()
      expect(ticket.dismiss).toHaveBeenCalledTimes(1)
    })
  })

  describe('transition', () => {
    it('should use fade transition by default', async () => {
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
      })

      await nextTick()
      const transition = wrapper.findComponent({ name: 'TransitionGroup' })
      expect(transition.exists()).toBe(true)
      expect(transition.props('name')).toBe('fade')
    })

    it('should use custom transition when specified', async () => {
      const ticket = createMockTicket()
      mockSelectedItems.value = new Set([ticket])

      const wrapper = mount(Scrim, {
        props: { teleport: false, transition: 'slide' },
      })

      await nextTick()
      const transition = wrapper.findComponent({ name: 'TransitionGroup' })
      expect(transition.props('name')).toBe('slide')
    })
  })

  describe('reactivity', () => {
    it('should add/remove scrims when tickets change', async () => {
      const ticket1 = createMockTicket({ id: 'ticket-1' })
      mockSelectedItems.value = new Set([ticket1])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
        slots: {
          default: () => h('span', 'Content'),
        },
      })

      await nextTick()
      expect(wrapper.findAll('span').length).toBe(1)

      // Add second ticket
      const ticket2 = createMockTicket({ id: 'ticket-2' })
      mockSelectedItems.value = new Set([ticket1, ticket2])
      await nextTick()

      expect(wrapper.findAll('span').length).toBe(2)

      // Remove first ticket
      mockSelectedItems.value = new Set([ticket2])
      await nextTick()

      expect(wrapper.findAll('span').length).toBe(1)

      // Remove all
      mockSelectedItems.value = new Set()
      await nextTick()

      expect(wrapper.findAll('span').length).toBe(0)
    })
  })

  describe('cumulative opacity', () => {
    it('should render multiple scrims allowing visual stacking', async () => {
      const ticket1 = createMockTicket({ id: 'ticket-1', zIndex: 2000 })
      const ticket2 = createMockTicket({ id: 'ticket-2', zIndex: 2010 })
      const ticket3 = createMockTicket({ id: 'ticket-3', zIndex: 2020 })
      mockSelectedItems.value = new Set([ticket1, ticket2, ticket3])

      const wrapper = mount(Scrim, {
        props: { teleport: false },
        attrs: { class: 'scrim-layer' },
      })

      await nextTick()
      const layers = wrapper.findAll('.scrim-layer')
      expect(layers.length).toBe(3)

      // Each should have its own z-index
      expect((layers[0]!.element as HTMLElement).style.zIndex).toBe('1999')
      expect((layers[1]!.element as HTMLElement).style.zIndex).toBe('2009')
      expect((layers[2]!.element as HTMLElement).style.zIndex).toBe('2019')
    })
  })
})
