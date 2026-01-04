import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

import { Dialog } from './index'

// Mock showModal and close for happy-dom
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
})

describe('dialog', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as renderless by default', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h('div', { class: 'test-child' }, 'Content'),
          },
        })

        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.element.tagName).toBe('DIV')
      })

      it('should render children in default slot', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h('span', { class: 'test-child' }, 'Child content'),
          },
        })

        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.find('.test-child').text()).toBe('Child content')
      })
    })

    describe('v-model', () => {
      it('should support v-model for open state', async () => {
        const isOpen = ref(false)

        const wrapper = mount(Dialog.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => [
              h(Dialog.Trigger, {}, () => 'Open'),
              h(Dialog.Content, {}, () => 'Content'),
            ],
          },
        })

        expect(isOpen.value).toBe(false)

        await wrapper.findComponent(Dialog.Trigger as any).trigger('click')
        expect(isOpen.value).toBe(true)
      })

      it('should open dialog when modelValue becomes true', async () => {
        const wrapper = mount(Dialog.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: () => h(Dialog.Content, {}, () => 'Content'),
          },
        })

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
      })

      it('should default to closed', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => 'Content'),
          },
        })

        expect(wrapper.findComponent(Dialog.Content as any).exists()).toBe(true)
      })
    })

    describe('context provision', () => {
      it('should provide context with default namespace', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => [
              h(Dialog.Trigger, {}, () => 'Open'),
              h(Dialog.Content, {}, () => 'Content'),
            ],
          },
        })

        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        const content = wrapper.findComponent(Dialog.Content as any)
        expect(trigger.exists()).toBe(true)
        expect(content.exists()).toBe(true)
      })

      it('should provide context with custom namespace', () => {
        const wrapper = mount(Dialog.Root, {
          props: {
            namespace: 'custom-dialog',
          },
          slots: {
            default: () => [
              h(Dialog.Trigger, { namespace: 'custom-dialog' }, () => 'Open'),
              h(Dialog.Content, { namespace: 'custom-dialog' }, () => 'Content'),
            ],
          },
        })

        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.exists()).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose isOpen, open, close, and id in slot props', () => {
        let slotProps: any

        mount(Dialog.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isOpen).toBe('boolean')
        expect(typeof slotProps.open).toBe('function')
        expect(typeof slotProps.close).toBe('function')
        expect(typeof slotProps.id).toBe('string')
      })
    })
  })

  describe('trigger', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Trigger, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.element.tagName).toBe('BUTTON')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Trigger, { as: 'div' }, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.element.tagName).toBe('DIV')
      })

      it('should set type=button when as=button', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Trigger, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.attributes('type')).toBe('button')
      })
    })

    describe('accessibility', () => {
      it('should have aria-haspopup=dialog', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Trigger, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.attributes('aria-haspopup')).toBe('dialog')
      })

      it('should have aria-expanded=false when closed', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Trigger, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.attributes('aria-expanded')).toBe('false')
      })

      it('should have aria-expanded=true when open', async () => {
        const wrapper = mount(Dialog.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(Dialog.Trigger, {}, () => 'Open'),
          },
        })

        await nextTick()
        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.attributes('aria-expanded')).toBe('true')
      })

      it('should set data-dialog-open when open', async () => {
        const wrapper = mount(Dialog.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(Dialog.Trigger, {}, () => 'Open'),
          },
        })

        await nextTick()
        const trigger = wrapper.findComponent(Dialog.Trigger as any)
        expect(trigger.attributes('data-dialog-open')).toBe('')
      })
    })

    describe('click handling', () => {
      it('should open dialog on click', async () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => [
              h(Dialog.Trigger, {}, () => 'Open'),
              h(Dialog.Content, {}, () => 'Content'),
            ],
          },
        })

        await wrapper.findComponent(Dialog.Trigger as any).trigger('click')
        await nextTick()

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
      })
    })
  })

  describe('content', () => {
    describe('rendering', () => {
      it('should render as dialog by default', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => 'Content'),
          },
        })

        const content = wrapper.findComponent(Dialog.Content as any)
        expect(content.element.tagName).toBe('DIALOG')
      })

      it('should render children in default slot', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => h('p', 'Dialog content')),
          },
        })

        expect(wrapper.find('p').text()).toBe('Dialog content')
      })
    })

    describe('accessibility', () => {
      it('should have role=dialog', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => 'Content'),
          },
        })

        const content = wrapper.findComponent(Dialog.Content as any)
        expect(content.attributes('role')).toBe('dialog')
      })

      it('should have aria-modal=true', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => 'Content'),
          },
        })

        const content = wrapper.findComponent(Dialog.Content as any)
        expect(content.attributes('aria-modal')).toBe('true')
      })

      it('should have aria-labelledby pointing to title', () => {
        const wrapper = mount(Dialog.Root, {
          props: { id: 'test-dialog' },
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Title, {}, () => 'Title'),
            ]),
          },
        })

        const content = wrapper.findComponent(Dialog.Content as any)
        expect(content.attributes('aria-labelledby')).toBe('test-dialog-title')
      })

      it('should have aria-describedby pointing to description', () => {
        const wrapper = mount(Dialog.Root, {
          props: { id: 'test-dialog' },
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Description, {}, () => 'Description'),
            ]),
          },
        })

        const content = wrapper.findComponent(Dialog.Content as any)
        expect(content.attributes('aria-describedby')).toBe('test-dialog-description')
      })
    })

    describe('modal behavior', () => {
      it('should call showModal when opened', async () => {
        mount(Dialog.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(Dialog.Content, {}, () => 'Content'),
          },
        })

        await nextTick()
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
      })

      it('should call close when closed', async () => {
        const wrapper = mount(Dialog.Root, {
          props: {
            modelValue: true,
          },
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()

        await wrapper.setProps({ modelValue: false })
        await nextTick()

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
      })
    })

    describe('events', () => {
      it('should emit cancel event', async () => {
        const onCancel = vi.fn()

        const wrapper = mount(Dialog.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(Dialog.Content, { onCancel }, () => 'Content'),
          },
        })

        await nextTick()
        const content = wrapper.findComponent(Dialog.Content as any)
        await content.trigger('cancel')

        expect(onCancel).toHaveBeenCalled()
      })

      it('should emit close event', async () => {
        const onClose = vi.fn()

        const wrapper = mount(Dialog.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(Dialog.Content, { onClose }, () => 'Content'),
          },
        })

        await nextTick()
        const content = wrapper.findComponent(Dialog.Content as any)
        await content.trigger('close')

        expect(onClose).toHaveBeenCalled()
      })
    })
  })

  describe('close', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Close, {}, () => 'Close'),
            ]),
          },
        })

        const close = wrapper.findComponent(Dialog.Close as any)
        expect(close.element.tagName).toBe('BUTTON')
      })

      it('should set type=button when as=button', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Close, {}, () => 'Close'),
            ]),
          },
        })

        const close = wrapper.findComponent(Dialog.Close as any)
        expect(close.attributes('type')).toBe('button')
      })
    })

    describe('accessibility', () => {
      it('should have aria-label=Close', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Close, {}, () => 'Close'),
            ]),
          },
        })

        const close = wrapper.findComponent(Dialog.Close as any)
        expect(close.attributes('aria-label')).toBe('Close')
      })
    })

    describe('click handling', () => {
      it('should close dialog on click', async () => {
        const isOpen = ref(true)

        const wrapper = mount(Dialog.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        expect(isOpen.value).toBe(true)

        await wrapper.findComponent(Dialog.Close as any).trigger('click')
        expect(isOpen.value).toBe(false)
      })
    })
  })

  describe('title', () => {
    describe('rendering', () => {
      it('should render as h2 by default', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Title, {}, () => 'Title'),
            ]),
          },
        })

        const title = wrapper.findComponent(Dialog.Title as any)
        expect(title.element.tagName).toBe('H2')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Title, { as: 'span' }, () => 'Title'),
            ]),
          },
        })

        const title = wrapper.findComponent(Dialog.Title as any)
        expect(title.element.tagName).toBe('SPAN')
      })
    })

    describe('accessibility', () => {
      it('should have correct id for aria-labelledby', () => {
        const wrapper = mount(Dialog.Root, {
          props: { id: 'test-dialog' },
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Title, {}, () => 'Title'),
            ]),
          },
        })

        const title = wrapper.findComponent(Dialog.Title as any)
        expect(title.attributes('id')).toBe('test-dialog-title')
      })
    })
  })

  describe('description', () => {
    describe('rendering', () => {
      it('should render as p by default', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Description, {}, () => 'Description'),
            ]),
          },
        })

        const description = wrapper.findComponent(Dialog.Description as any)
        expect(description.element.tagName).toBe('P')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(Dialog.Root, {
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Description, { as: 'span' }, () => 'Description'),
            ]),
          },
        })

        const description = wrapper.findComponent(Dialog.Description as any)
        expect(description.element.tagName).toBe('SPAN')
      })
    })

    describe('accessibility', () => {
      it('should have correct id for aria-describedby', () => {
        const wrapper = mount(Dialog.Root, {
          props: { id: 'test-dialog' },
          slots: {
            default: () => h(Dialog.Content, {}, () => [
              h(Dialog.Description, {}, () => 'Description'),
            ]),
          },
        })

        const description = wrapper.findComponent(Dialog.Description as any)
        expect(description.attributes('id')).toBe('test-dialog-description')
      })
    })
  })

  describe('integration', () => {
    it('should work as complete dialog with all sub-components', async () => {
      let isOpen = false

      const wrapper = mount(Dialog.Root, {
        props: {
          'id': 'complete-dialog',
          'modelValue': isOpen,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen = v as boolean
            wrapper.setProps({ modelValue: v as boolean })
          },
        },
        slots: {
          default: () => [
            h(Dialog.Trigger, {}, () => 'Open'),
            h(Dialog.Content, {}, () => [
              h(Dialog.Title, {}, () => 'Dialog Title'),
              h(Dialog.Description, {}, () => 'Dialog Description'),
              h('p', 'Dialog content'),
              h(Dialog.Close, {}, () => 'Close'),
            ]),
          ],
        },
      })

      // Initially closed
      expect(isOpen).toBe(false)

      // Open via trigger
      await wrapper.findComponent(Dialog.Trigger as any).trigger('click')
      await nextTick()
      expect(isOpen).toBe(true)
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()

      // Close via close button
      await wrapper.findComponent(Dialog.Close as any).trigger('click')
      await nextTick()
      expect(isOpen).toBe(false)
    })

    it('should use custom namespace for isolation', () => {
      const wrapper = mount(defineComponent({
        render: () => [
          h(Dialog.Root, { namespace: 'dialog-1' }, () => [
            h(Dialog.Trigger, { namespace: 'dialog-1' }, () => 'Open 1'),
            h(Dialog.Content, { namespace: 'dialog-1' }, () => 'Content 1'),
          ]),
          h(Dialog.Root, { namespace: 'dialog-2' }, () => [
            h(Dialog.Trigger, { namespace: 'dialog-2' }, () => 'Open 2'),
            h(Dialog.Content, { namespace: 'dialog-2' }, () => 'Content 2'),
          ]),
        ],
      }))

      const triggers = wrapper.findAllComponents(Dialog.Trigger as any)
      expect(triggers).toHaveLength(2)
      expect(triggers[0]?.text()).toBe('Open 1')
      expect(triggers[1]?.text()).toBe('Open 2')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid open/close cycles', async () => {
      const wrapper = mount(Dialog.Root, {
        props: {
          modelValue: false,
        },
        slots: {
          default: () => h(Dialog.Content, {}, () => 'Content'),
        },
      })

      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      await nextTick()
      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    })

    it('should handle missing title and description', () => {
      const wrapper = mount(Dialog.Root, {
        props: { id: 'no-title-dialog' },
        slots: {
          default: () => h(Dialog.Content, {}, () => 'Just content'),
        },
      })

      const content = wrapper.findComponent(Dialog.Content as any)
      // Should still have aria attributes pointing to potentially missing elements
      expect(content.attributes('aria-labelledby')).toBe('no-title-dialog-title')
      expect(content.attributes('aria-describedby')).toBe('no-title-dialog-description')
    })

    it('should handle dialog without trigger (controlled)', async () => {
      const isOpen = ref(true)

      const wrapper = mount(Dialog.Root, {
        props: {
          modelValue: isOpen.value,
        },
        slots: {
          default: () => h(Dialog.Content, {}, () => [
            h(Dialog.Close, {}, () => 'Close'),
          ]),
        },
      })

      await nextTick()
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()

      const close = wrapper.findComponent(Dialog.Close as any)
      expect(close.exists()).toBe(true)
    })
  })
})
