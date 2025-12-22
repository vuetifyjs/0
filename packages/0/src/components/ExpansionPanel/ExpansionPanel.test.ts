import { mount } from '@vue/test-utils'

// Utilities
import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
// Components
import { ExpansionPanel } from './index'

describe('expansionPanel', () => {
  describe('root', () => {
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header'),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header 1'),
              ),
              h(
                ExpansionPanel.Item as any,
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header'),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)

        await activator.trigger('click')
        await nextTick()

        expect(selected.value).toBe('value-1')
      })
    })

    describe('disabled prop', () => {
      it('should expose disabled state via native disabled attribute on buttons', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, {}, () => 'Header'),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.attributes('tabindex')).toBe('-1')
        expect(activator.attributes('disabled')).toBe('')
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

        expect(capturedProps.isDisabled.value).toBe(true)
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

        expect(capturedProps.isDisabled.value).toBe(false)
        expect(typeof capturedProps.select).toBe('function')
        expect(typeof capturedProps.unselect).toBe('function')
        expect(typeof capturedProps.toggle).toBe('function')
      })
    })
  })

  describe('item', () => {
    describe('registration lifecycle', () => {
      it('should register with parent on mount', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
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
                    ExpansionPanel.Item as any,
                    { id: 'item-1', value: 'value-1' },
                    () => h(ExpansionPanel.Activator),
                  )
                : null,
          },
        })

        expect(wrapper.findComponent(ExpansionPanel.Activator as any).exists()).toBe(true)

        showItem.value = false
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent(ExpansionPanel.Activator as any).exists()).toBe(false)
      })

      it('should use provided ID when given', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'custom-id', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.attributes('id')).toBe('custom-id-header')
      })
    })

    describe('context provision', () => {
      it('should provide correct headerId and contentId', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'panel-123', value: 'value' },
                () => [h(ExpansionPanel.Activator), h(ExpansionPanel.Content)],
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        const content = wrapper.findComponent(ExpansionPanel.Content as any)

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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1', disabled: false },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.attributes('disabled')).toBe('')
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1', disabled: true },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.attributes('disabled')).toBe('')
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1', disabled: false },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.attributes('disabled')).toBeUndefined()
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'custom-value' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        await activator.trigger('click')
        await nextTick()

        expect(selected.value).toBe('custom-value')
      })
    })
  })

  describe('activator', () => {
    describe('aRIA attributes', () => {
      it('should set correct ARIA attributes when not expanded', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)

        expect(activator.attributes('id')).toBe('item-1-header')
        // Native button doesn't need role="button"
        expect(activator.attributes('role')).toBeUndefined()
        expect(activator.attributes('tabindex')).toBe('0')
        expect(activator.attributes('aria-expanded')).toBe('false')
        expect(activator.attributes('aria-controls')).toBe('item-1-content')
        // Native button uses disabled attribute, not aria-disabled
        expect(activator.attributes('disabled')).toBeUndefined()
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        await nextTick()

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.attributes('aria-expanded')).toBe('true')
      })

      it('should set disabled attribute when item is disabled', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1', disabled: true },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        // Native button uses disabled attribute, not aria-disabled
        expect(activator.attributes('disabled')).toBe('')
        expect(activator.attributes('tabindex')).toBe('-1')
      })

      it('should not set ARIA attributes when renderless=true', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, { renderless: true }),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)

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
                ExpansionPanel.Item as any,
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
        expect(slotProps.isDisabled).toBe(false)
        expect(slotProps.isSelected).toBe(false)
        expect(typeof slotProps.toggle).toBe('function')
        // attrs for v-bind
        expect(slotProps.attrs.id).toBe('item-1-header')
        // Native button doesn't get role="button"
        expect(slotProps.attrs.role).toBeUndefined()
        expect(slotProps.attrs.tabindex).toBe(0)
        expect(slotProps.attrs['aria-expanded']).toBe(false)
        expect(slotProps.attrs['aria-controls']).toBe('item-1-content')
        expect(slotProps.attrs['aria-disabled']).toBe(false)
        expect(typeof slotProps.attrs.onClick).toBe('function')
        expect(typeof slotProps.attrs.onKeydown).toBe('function')
      })
    })

    describe('as prop', () => {
      it('should render as button by default', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.element.tagName).toBe('BUTTON')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Activator, { as: 'div' }),
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        expect(activator.element.tagName).toBe('DIV')
      })
    })
  })

  describe('content', () => {
    describe('aRIA attributes', () => {
      it('should set correct ARIA attributes', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content as any)

        expect(content.attributes('id')).toBe('item-1-content')
        expect(content.attributes('role')).toBe('region')
        expect(content.attributes('aria-labelledby')).toBe('item-1-header')
      })

      it('should not set ARIA attributes when renderless=true', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content, { renderless: true }),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content as any)
        expect(content.attributes('id')).toBeUndefined()
        expect(content.attributes('role')).toBeUndefined()
        expect(content.attributes('aria-labelledby')).toBeUndefined()
      })

      it('should use correct IDs for ARIA relationship', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'custom-panel', value: 'value' },
                () => [h(ExpansionPanel.Activator), h(ExpansionPanel.Content)],
              ),
          },
        })

        const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
        const content = wrapper.findComponent(ExpansionPanel.Content as any)

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
                ExpansionPanel.Item as any,
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
        expect(slotProps.isSelected).toBe(false)
        // attrs for v-bind
        expect(slotProps.attrs.id).toBe('item-1-content')
        expect(slotProps.attrs.role).toBe('region')
        expect(slotProps.attrs['aria-labelledby']).toBe('item-1-header')
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
                ExpansionPanel.Item as any,
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
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content as any)
        expect(content.element.tagName).toBe('DIV')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(ExpansionPanel.Root, {
          slots: {
            default: () =>
              h(
                ExpansionPanel.Item as any,
                { id: 'item-1', value: 'value-1' },
                () => h(ExpansionPanel.Content, { as: 'section' }),
              ),
          },
        })

        const content = wrapper.findComponent(ExpansionPanel.Content as any)
        expect(content.element.tagName).toBe('SECTION')
      })
    })
  })

  describe('integration', () => {
    it('should have matching ARIA relationship between Activator and Content', () => {
      const wrapper = mount(ExpansionPanel.Root, {
        slots: {
          default: () =>
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => [h(ExpansionPanel.Activator), h(ExpansionPanel.Content)],
            ),
        },
      })

      const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
      const content = wrapper.findComponent(ExpansionPanel.Content as any)

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
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => [
                h(ExpansionPanel.Activator, {}, () => 'Panel 1'),
                h(ExpansionPanel.Content, {}, () => 'Content 1'),
              ],
            ),
            h(
              ExpansionPanel.Item as any,
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

  describe('sSR/Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(ExpansionPanel.Root as any, { modelValue: 'value-1' }, () =>
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => [
                h(ExpansionPanel.Activator as any, {}, () => 'Header'),
                h(ExpansionPanel.Content as any, {}, () => 'Content'),
              ],
            ),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('panel-1-header')
      expect(html).toContain('panel-1-content')
      expect(html).toContain('Header')
      expect(html).toContain('Content')
    })

    it('should render ARIA attributes on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(ExpansionPanel.Root as any, { modelValue: 'value-1' }, () =>
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => h(ExpansionPanel.Activator as any, {}, () => 'Header'),
            ),
          ),
      }))

      const html = await renderToString(app)

      // Native button doesn't need role="button"
      expect(html).toContain('aria-expanded="true"')
      expect(html).toContain('aria-controls="panel-1-content"')
      expect(html).toContain('id="panel-1-header"')
      expect(html).toContain('tabindex="0"')
      expect(html).toContain('type="button"')
    })

    it('should render collapsed state correctly on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(ExpansionPanel.Root as any, {}, () =>
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => h(ExpansionPanel.Activator as any, {}, () => 'Header'),
            ),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-expanded="false"')
    })

    it('should render disabled state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(ExpansionPanel.Root as any, { disabled: true }, () =>
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => h(ExpansionPanel.Activator as any, {}, () => 'Header'),
            ),
          ),
      }))

      const html = await renderToString(app)

      // Native button uses disabled attribute, not aria-disabled
      expect(html).toContain('disabled')
      expect(html).toContain('tabindex="-1"')
    })

    it('should render multiple panels on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(ExpansionPanel.Root as any, { modelValue: ['value-1', 'value-2'], multiple: true }, () => [
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => h(ExpansionPanel.Activator as any, {}, () => 'Panel 1'),
            ),
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-2', value: 'value-2' },
              () => h(ExpansionPanel.Activator as any, {}, () => 'Panel 2'),
            ),
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-3', value: 'value-3' },
              () => h(ExpansionPanel.Activator as any, {}, () => 'Panel 3'),
            ),
          ]),
      }))

      const html = await renderToString(app)

      expect(html).toContain('Panel 1')
      expect(html).toContain('Panel 2')
      expect(html).toContain('Panel 3')
    })

    it('should render Content region with proper ARIA on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(ExpansionPanel.Root as any, {}, () =>
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => [
                h(ExpansionPanel.Activator as any, {}, () => 'Header'),
                h(ExpansionPanel.Content as any, {}, () => 'Panel content here'),
              ],
            ),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('role="region"')
      expect(html).toContain('aria-labelledby="panel-1-header"')
      expect(html).toContain('id="panel-1-content"')
      expect(html).toContain('Panel content here')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(ExpansionPanel.Root as any, { modelValue: 'value-1' }, () =>
            h(
              ExpansionPanel.Item as any,
              { id: 'panel-1', value: 'value-1' },
              () => [
                h(ExpansionPanel.Activator as any, {}, () => 'Header'),
                h(ExpansionPanel.Content as any, {}, () => 'Content'),
              ],
            ),
          ),
      })

      const ssrApp = createSSRApp(Component)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(Component, {
        attachTo: container,
      })

      await nextTick()

      const activator = wrapper.findComponent(ExpansionPanel.Activator as any)
      expect(activator.attributes('id')).toBe('panel-1-header')
      expect(activator.attributes('aria-expanded')).toBe('true')

      wrapper.unmount()
    })
  })
})
