import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createTooltipPlugin } from '#v0/composables/useTooltip'

import { Tooltip } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

// Types
import type { MountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'

describe('tooltip', () => {
  let plugin: ReturnType<typeof createTooltipPlugin>

  function mountTooltip (component: Component, options: MountingOptions<any> = {}) {
    return mount(component, {
      ...options,
      global: {
        ...options.global,
        plugins: [...(options.global?.plugins ?? []), plugin],
      },
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
    plugin = createTooltipPlugin()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('compound shape', () => {
    it('should expose Root, Activator, Content as compound members', () => {
      expect(Tooltip.Root).toBeDefined()
      expect(Tooltip.Activator).toBeDefined()
      expect(Tooltip.Content).toBeDefined()
    })
  })

  describe('escape dismissal', () => {
    it('should close on Escape via the element-bound keydown', async () => {
      const wrapper = mountTooltip(defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { modelValue: true }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      }), { attachTo: document.body })

      await nextTick()

      const activator = wrapper.find('button')
      expect(activator.attributes('data-state')).not.toBe('closed')

      await activator.trigger('keydown', { key: 'Escape' })
      vi.advanceTimersByTime(150)
      await nextTick()

      expect(activator.attributes('data-state')).toBe('closed')
      wrapper.unmount()
    })
  })

  describe('instant open', () => {
    it('should skip the open delay when another tooltip is already open', async () => {
      const wrapper = mountTooltip(defineComponent({
        setup () {
          return () => [
            h(Tooltip.Root, { openDelay: 300 }, () => [
              h(Tooltip.Activator, null, () => 'First'),
              h(Tooltip.Content, null, () => 'Tip one'),
            ]),
            h(Tooltip.Root, { openDelay: 300 }, () => [
              h(Tooltip.Activator, null, () => 'Second'),
              h(Tooltip.Content, null, () => 'Tip two'),
            ]),
          ]
        },
      }), { attachTo: document.body })

      const activators = wrapper.findAll('button')
      const first = activators[0]
      const second = activators[1]

      await first.trigger('pointerenter', { pointerType: 'mouse' })
      vi.advanceTimersByTime(300)
      await nextTick()

      expect(first.attributes('data-state')).toBe('delayed-open')

      await second.trigger('pointerenter', { pointerType: 'mouse' })
      await nextTick()

      expect(second.attributes('data-state')).toBe('instant-open')
      wrapper.unmount()
    })
  })

  describe('open and close', () => {
    it('should open after openDelay on activator pointerenter', async () => {
      const Harness = defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { openDelay: 300, closeDelay: 100 }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      })

      const wrapper = mountTooltip(Harness, { attachTo: document.body })
      const activator = wrapper.find('button')
      await activator.trigger('pointerenter', { pointerType: 'mouse' })

      expect(activator.attributes('data-state')).toBe('closed')

      vi.advanceTimersByTime(300)
      await nextTick()

      expect(activator.attributes('data-state')).toBe('delayed-open')
      wrapper.unmount()
    })

    it('should suppress open on touch pointerenter', async () => {
      const wrapper = mountTooltip(defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { openDelay: 200 }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      }), { attachTo: document.body })

      await wrapper.find('button').trigger('pointerenter', { pointerType: 'touch' })
      vi.advanceTimersByTime(500)
      await nextTick()

      expect(wrapper.find('button').attributes('data-state')).toBe('closed')
      wrapper.unmount()
    })
  })

  describe('aria-describedby', () => {
    it('should link activator to content while open', async () => {
      const wrapper = mountTooltip(defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { modelValue: true }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      }), { attachTo: document.body })

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
      const wrapper = mountTooltip(defineComponent({
        setup () {
          return () =>
            h(Tooltip.Root, { disabled: true, openDelay: 100 }, () => [
              h(Tooltip.Activator, null, () => 'Trigger'),
              h(Tooltip.Content, null, () => 'Tip'),
            ])
        },
      }), { attachTo: document.body })

      await wrapper.find('button').trigger('pointerenter', { pointerType: 'mouse' })
      vi.advanceTimersByTime(500)
      await nextTick()

      expect(wrapper.find('button').attributes('data-state')).toBe('closed')
      wrapper.unmount()
    })
  })

  describe('multi-instance independence', () => {
    it('should isolate sibling Root instances', async () => {
      const wrapper = mountTooltip(defineComponent({
        setup () {
          return () => [
            h(Tooltip.Root, { modelValue: true }, () => [
              h(Tooltip.Activator, null, () => 'First'),
              h(Tooltip.Content, null, () => 'Tip one'),
            ]),
            h(Tooltip.Root, null, () => [
              h(Tooltip.Activator, null, () => 'Second'),
              h(Tooltip.Content, null, () => 'Tip two'),
            ]),
          ]
        },
      }), { attachTo: document.body })

      await nextTick()

      const activators = wrapper.findAll('button')
      const first = activators[0]
      const second = activators[1]

      // First Root is open and linked to its own content.
      expect(first.attributes('data-state')).not.toBe('closed')
      const firstDescribedBy = first.attributes('aria-describedby')
      expect(firstDescribedBy).toBeDefined()

      const firstContent = wrapper.findAll('[role="tooltip"]')[0]
      expect(firstContent.attributes('id')).toBe(firstDescribedBy)

      // Second Root stays closed and resolves its own context, so its
      // activator links to its own content id, never the first Root's.
      expect(second.attributes('data-state')).toBe('closed')
      const secondDescribedBy = second.attributes('aria-describedby')
      expect(secondDescribedBy).toBeDefined()
      expect(secondDescribedBy).not.toBe(firstDescribedBy)

      wrapper.unmount()
    })
  })
})
