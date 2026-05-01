import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createTooltipPlugin } from '#v0/composables/useTooltip'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

import { Tooltip } from './index'

const global = { plugins: [createTooltipPlugin()] }

describe('tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('compound shape', () => {
    it('should expose Root, Activator, Content as compound members', () => {
      expect(Tooltip.Root).toBeDefined()
      expect(Tooltip.Activator).toBeDefined()
      expect(Tooltip.Content).toBeDefined()
    })
  })

  describe('open and close', () => {
    it('should open after openDelay on activator pointerenter', async () => {
      const Harness = defineComponent({
        components: { TR: Tooltip.Root, TA: Tooltip.Activator, TC: Tooltip.Content },
        setup () {
          return () =>
            h(Tooltip.Root, { openDelay: 300, closeDelay: 100 }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      })

      const wrapper = mount(Harness, { attachTo: document.body, global })
      const activator = wrapper.find('button')
      await activator.trigger('pointerenter', { pointerType: 'mouse' })

      expect(activator.attributes('data-state')).toBe('closed')

      vi.advanceTimersByTime(300)
      await nextTick()

      expect(activator.attributes('data-state')).toBe('delayed-open')
      wrapper.unmount()
    })

    it('should suppress open on touch pointerenter', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { openDelay: 200 }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      }), { attachTo: document.body, global })

      await wrapper.find('button').trigger('pointerenter', { pointerType: 'touch' })
      vi.advanceTimersByTime(500)
      await nextTick()

      expect(wrapper.find('button').attributes('data-state')).toBe('closed')
      wrapper.unmount()
    })
  })

  describe('aria-describedby', () => {
    it('should link activator to content while open', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { defaultOpen: true }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      }), { attachTo: document.body, global })

      await nextTick()

      const activator = wrapper.find('button')
      const describedBy = activator.attributes('aria-describedby')
      expect(describedBy).toBeDefined()

      // The id matches the content's id
      const content = wrapper.find('[role="tooltip"]')
      expect(content.attributes('id')).toBe(describedBy)

      wrapper.unmount()
    })
  })

  describe('disabled', () => {
    it('should not open when disabled', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { disabled: true, openDelay: 100 }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      }), { attachTo: document.body, global })

      await wrapper.find('button').trigger('pointerenter', { pointerType: 'mouse' })
      vi.advanceTimersByTime(500)
      await nextTick()

      expect(wrapper.find('button').attributes('data-state')).toBe('closed')
      wrapper.unmount()
    })
  })
})
