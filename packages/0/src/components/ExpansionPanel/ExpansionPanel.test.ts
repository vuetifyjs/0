// Components
import { ExpansionPanel } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, ref, nextTick } from 'vue'

describe('ExpansionPanel', () => {
  describe('Root', () => {
    describe('v-model binding', () => {
      it('should update v-model when panel is clicked (single mode)', async () => {
        const selected = ref<string>()

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header'),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        await activator.trigger('click')
        await nextTick()

        expect(selected.value).toBe('value-1')
      })

      it('should support multiple selected panels (multiple mode)', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            'multiple': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header 1'),
              ),
              h(
                ExpansionPanel.Item,
                { id: 'item-2', value: 'value-2' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header 2'),
              ),
            ],
          },
        })

        const activators = wrapper.findAllComponents(ExpansionPanel.Activator)
        await activators[0]?.trigger('click')
        await activators[1]?.trigger('click')
        await nextTick()

        expect(selected.value).toContain('value-1')
        expect(selected.value).toContain('value-2')
      })
    })

    describe('mandatory prop', () => {
      it('should prevent collapsing last panel when mandatory=true', async () => {
        const selected = ref('value-1')

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            'mandatory': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header'),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)

        await activator.trigger('click')
        await nextTick()

        expect(selected.value).toBe('value-1')
      })
    })

    describe('disabled prop', () => {
      it('should expose disabled state via ARIA attributes', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header'),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('tabindex')).toBe('-1')
        expect(activator.attributes('aria-disabled')).toBe('true')
      })

      it('should expose disabled state in slot props', () => {
        let capturedProps: any

        mount(ExpansionPanel.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: (props: any) => {
              capturedProps = props
              return ''
            },
          },
        })

        expect(capturedProps.disabled).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose correct slot props', () => {
        let capturedProps: any

        mount(ExpansionPanel.Root, {
          props: {
            multiple: true,
            disabled: false,
          },
          slots: {
            default: (props: any) => {
              capturedProps = props
              return ''
            },
          },
        })

        expect(capturedProps.disabled).toBe(false)
        expect(capturedProps.multiple).toBe(true)
        expect(typeof capturedProps.select).toBe('function')
        expect(typeof capturedProps.unselect).toBe('function')
        expect(typeof capturedProps.toggle).toBe('function')
        expect(capturedProps.ariaMultiselectable).toBe(true)
      })
    })

    describe('ARIA attributes', () => {
      it('should set aria-multiselectable when multiple=true', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            multiple: true,
          },
        })

        expect(wrapper.attributes('aria-multiselectable')).toBe('true')
      })

      it('should not set aria-multiselectable when renderless=true', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            multiple: true,
            renderless: true,
          },
        })

        expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
      })
    })
  })

  describe('Item', () => {
    describe('registration lifecycle', () => {
      it('should register with parent on mount', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.exists()).toBe(true)
        expect(activator.attributes('id')).toBe('item-1-header')
      })

      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)

        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              showItem.value
                ? h(
                    ExpansionPanel.Item,
                    { id: 'item-1', value: 'value-1' },
                    () => h(ExpansionPanel.Activator),
                  )
                : null,
          },
        })

        expect(wrapper.findComponent(ExpansionPanel.Activator).exists()).toBe(true)

        showItem.value = false
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent(ExpansionPanel.Activator).exists()).toBe(false)
      })

      it('should use provided ID when given', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'custom-id', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('id')).toBe('custom-id-header')
      })
    })

    describe('context provision', () => {
      it('should provide correct headerId and contentId', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'panel-123', value: 'value' },
                () => [h(ExpansionPanel.Activator), h(ExpansionPanel.Content)],
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        const content = wrapper.findComponent(ExpansionPanel.Content)

        expect(activator.attributes('id')).toBe('panel-123-header')
        expect(content.attributes('id')).toBe('panel-123-content')
        expect(activator.attributes('aria-controls')).toBe('panel-123-content')
        expect(content.attributes('aria-labelledby')).toBe('panel-123-header')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when root is disabled', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1', disabled: false },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('aria-disabled')).toBe('true')
        expect(activator.attributes('tabindex')).toBe('-1')
      })

      it('should be disabled when item disabled=true', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            disabled: false,
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1', disabled: true },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('aria-disabled')).toBe('true')
        expect(activator.attributes('tabindex')).toBe('-1')
      })

      it('should not be disabled when both are false', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            disabled: false,
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1', disabled: false },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('aria-disabled')).toBe('false')
        expect(activator.attributes('tabindex')).toBe('0')
      })
    })

    describe('value prop', () => {
      it('should use value for v-model binding', async () => {
        const selected = ref<string>()

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'custom-value' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        await activator.trigger('click')
        await nextTick()

        expect(selected.value).toBe('custom-value')
      })
    })
  })

  describe('Activator', () => {
    describe('ARIA attributes', () => {
      it('should set correct ARIA attributes when not expanded', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)

        expect(activator.attributes('id')).toBe('item-1-header')
        expect(activator.attributes('role')).toBe('button')
        expect(activator.attributes('tabindex')).toBe('0')
        expect(activator.attributes('aria-expanded')).toBe('false')
        expect(activator.attributes('aria-controls')).toBe('item-1-content')
        expect(activator.attributes('aria-disabled')).toBe('false')
      })

      it('should set aria-expanded=true when panel is expanded', async () => {
        const selected = ref('value-1')

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            modelValue: selected.value,
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        await nextTick()

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('aria-expanded')).toBe('true')
      })

      it('should set aria-disabled=true when item is disabled', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1', disabled: true },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('aria-disabled')).toBe('true')
        expect(activator.attributes('tabindex')).toBe('-1')
      })

      it('should not set ARIA attributes when renderless=true', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, { renderless: true }),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.attributes('id')).toBeUndefined()
        expect(activator.attributes('aria-expanded')).toBeUndefined()
        expect(activator.attributes('aria-controls')).toBeUndefined()
      })
    })

    describe('keyboard handling', () => {
      it('should toggle on Enter key', async () => {
        const selected = ref<string>()

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        await activator.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(selected.value).toBe('value-1')
      })

      it('should toggle on Space key', async () => {
        const selected = ref<string>()

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        await activator.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(selected.value).toBe('value-1')
      })
    })

    describe('click handling', () => {
      it('should toggle panel on click', async () => {
        const selected = ref<string>()

        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)

        await activator.trigger('click')
        await nextTick()
        expect(selected.value).toBe('value-1')

        await activator.trigger('click')
        await nextTick()
        expect(selected.value).toBeUndefined()
      })
    })

    describe('slot props', () => {
      it('should expose correct bindable props in slot', () => {
        let slotProps: any

        mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () =>
                  h(ExpansionPanel.Activator, {}, {
                    default: (props: any) => {
                      slotProps = props
                      return h('span', 'Activator')
                    },
                  }),
              ),
          },
        })

        expect(slotProps).toBeDefined()
        expect(slotProps.id).toBe('item-1-header')
        expect(slotProps.role).toBe('button')
        expect(slotProps.tabindex).toBe(0)
        expect(slotProps['aria-expanded']).toBe(false)
        expect(slotProps['aria-controls']).toBe('item-1-content')
        expect(slotProps['aria-disabled']).toBe(false)
        expect(slotProps.isSelected).toBe(false)
        expect(typeof slotProps.toggle).toBe('function')
        expect(typeof slotProps.onClick).toBe('function')
        expect(typeof slotProps.onKeydown).toBe('function')
      })
    })

    describe('as prop', () => {
      it('should render as button by default', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.element.tagName).toBe('BUTTON')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, { as: 'div' }),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        expect(activator.element.tagName).toBe('DIV')
      })
    })
  })

  describe('Content', () => {
    describe('ARIA attributes', () => {
      it('should set correct ARIA attributes', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content)

        expect(content.attributes('id')).toBe('item-1-content')
        expect(content.attributes('role')).toBe('region')
        expect(content.attributes('aria-labelledby')).toBe('item-1-header')
      })

      it('should not set ARIA attributes when renderless=true', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content, { renderless: true }),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content)
        expect(content.attributes('id')).toBeUndefined()
        expect(content.attributes('role')).toBeUndefined()
        expect(content.attributes('aria-labelledby')).toBeUndefined()
      })

      it('should use correct IDs for ARIA relationship', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'custom-panel', value: 'value' },
                () => [h(ExpansionPanel.Activator), h(ExpansionPanel.Content)],
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator)
        const content = wrapper.findComponent(ExpansionPanel.Content)

        expect(activator.attributes('id')).toBe('custom-panel-header')
        expect(content.attributes('id')).toBe('custom-panel-content')
        expect(activator.attributes('aria-controls')).toBe('custom-panel-content')
        expect(content.attributes('aria-labelledby')).toBe('custom-panel-header')
      })
    })

    describe('slot props', () => {
      it('should expose correct bindable props in slot', () => {
        let slotProps: any

        mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () =>
                  h(ExpansionPanel.Content, {}, {
                    default: (props: any) => {
                      slotProps = props
                      return h('div', 'Content')
                    },
                  }),
              ),
          },
        })

        expect(slotProps).toBeDefined()
        expect(slotProps.id).toBe('item-1-content')
        expect(slotProps.role).toBe('region')
        expect(slotProps['aria-labelledby']).toBe('item-1-header')
        expect(slotProps.isSelected).toBe(false)
      })

      it('should expose isSelected=true when panel is expanded', async () => {
        let slotProps: any
        const selected = ref('value-1')

        mount(ExpansionPanel.Root, {
          props: {
            modelValue: selected.value,
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () =>
                  h(ExpansionPanel.Content, {}, {
                    default: (props: any) => {
                      slotProps = props
                      return h('div', 'Content')
                    },
                  }),
              ),
          },
        })

        await nextTick()

        expect(slotProps.isSelected).toBe(true)
      })
    })

    describe('as prop', () => {
      it('should render as div by default', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content)
        expect(content.element.tagName).toBe('DIV')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content, { as: 'section' }),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content)
        expect(content.element.tagName).toBe('SECTION')
      })
    })
  })

  describe('Integration', () => {
    it('should have matching ARIA relationship between Activator and Content', () => {
      const wrapper = mount(ExpansionPanel.Root, {
        slots: {
          default: () =>
            h(
              ExpansionPanel.Item,
              { id: 'panel-1', value: 'value-1' },
              () => [h(ExpansionPanel.Activator), h(ExpansionPanel.Content)],
            ),
        },
      })

      const activator = wrapper.findComponent(ExpansionPanel.Activator)
      const content = wrapper.findComponent(ExpansionPanel.Content)

      const activatorId = activator.attributes('id')
      const contentId = content.attributes('id')
      const ariaControls = activator.attributes('aria-controls')
      const ariaLabelledby = content.attributes('aria-labelledby')

      expect(ariaControls).toBe(contentId)
      expect(ariaLabelledby).toBe(activatorId)
    })

    it('should work as full accordion', async () => {
      const selected = ref<string>()

      const wrapper = mount(ExpansionPanel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => [
            h(
              ExpansionPanel.Item,
              { id: 'panel-1', value: 'value-1' },
              () => [
                h(ExpansionPanel.Activator, {}, () => 'Panel 1'),
                h(ExpansionPanel.Content, {}, () => 'Content 1'),
              ],
            ),
            h(
              ExpansionPanel.Item,
              { id: 'panel-2', value: 'value-2' },
              () => [
                h(ExpansionPanel.Activator, {}, () => 'Panel 2'),
                h(ExpansionPanel.Content, {}, () => 'Content 2'),
              ],
            ),
          ],
        },
      })

      const activators = wrapper.findAllComponents(ExpansionPanel.Activator)

      await activators[0]?.trigger('click')
      await nextTick()
      expect(selected.value).toBe('value-1')

      await activators[1]?.trigger('click')
      await nextTick()
      expect(selected.value).toBe('value-2')
    })
  })
})
