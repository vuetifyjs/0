import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Selection } from './index'

describe('selection', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should be renderless by default', () => {
        const wrapper = mount(Selection.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Selection.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.multiple).toBe('boolean')
        expect(typeof slotProps.select).toBe('function')
        expect(typeof slotProps.unselect).toBe('function')
        expect(typeof slotProps.toggle).toBe('function')
        expect(slotProps.attrs['aria-multiselectable']).toBe(false)
      })
    })

    describe('single selection mode', () => {
      it('should only allow one item selected at a time', async () => {
        const selected = ref<string>()

        let item1Props: any
        let item2Props: any

        mount(Selection.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () => [
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h('div', 'Item 1')
                },
              }),
              h(Selection.Item as any, { value: 'item-2' }, {
                default: (props: any) => {
                  item2Props = props
                  return h('div', 'Item 2')
                },
              }),
            ],
          },
        })

        await nextTick()

        // Select first item
        item1Props.select()
        await nextTick()

        expect(selected.value).toBe('item-1')
        expect(item1Props.isSelected).toBe(true)
        expect(item2Props.isSelected).toBe(false)

        // Select second item (should deselect first)
        item2Props.select()
        await nextTick()

        expect(selected.value).toBe('item-2')
        expect(item1Props.isSelected).toBe(false)
        expect(item2Props.isSelected).toBe(true)
      })

      it('should set aria-multiselectable to false', () => {
        let slotProps: any

        mount(Selection.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.attrs['aria-multiselectable']).toBe(false)
      })
    })

    describe('multi selection mode', () => {
      it('should allow multiple items selected', async () => {
        const selected = ref<string[]>([])

        let item1Props: any
        let item2Props: any

        mount(Selection.Root, {
          props: {
            'multiple': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h('div', 'Item 1')
                },
              }),
              h(Selection.Item as any, { value: 'item-2' }, {
                default: (props: any) => {
                  item2Props = props
                  return h('div', 'Item 2')
                },
              }),
            ],
          },
        })

        await nextTick()

        // Select first item
        item1Props.select()
        await nextTick()

        expect(selected.value).toContain('item-1')
        expect(item1Props.isSelected).toBe(true)

        // Select second item (first should stay selected)
        item2Props.select()
        await nextTick()

        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
        expect(item1Props.isSelected).toBe(true)
        expect(item2Props.isSelected).toBe(true)
      })

      it('should set aria-multiselectable to true', () => {
        let slotProps: any

        mount(Selection.Root, {
          props: {
            multiple: true,
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.attrs['aria-multiselectable']).toBe(true)
      })
    })

    describe('disabled prop', () => {
      it('should disable all items when root is disabled', async () => {
        let itemProps: any

        mount(Selection.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
      })
    })

    describe('mandatory prop', () => {
      it('should prevent deselecting last item when mandatory=true', async () => {
        const selected = ref<string>('item-1')

        let itemProps: any

        mount(Selection.Root, {
          props: {
            'mandatory': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        // Try to unselect the only selected item
        itemProps.unselect()
        await nextTick()

        // Should still be selected
        expect(itemProps.isSelected).toBe(true)
      })

      it('should auto-select first item when mandatory=force', async () => {
        let itemProps: any

        mount(Selection.Root, {
          props: {
            mandatory: 'force',
          },
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(true)
      })
    })

    describe('enroll prop', () => {
      it('should auto-select items on registration when enroll=true', async () => {
        let itemProps: any

        mount(Selection.Root, {
          props: {
            enroll: true,
          },
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(true)
      })
    })
  })

  describe('item', () => {
    describe('slot props', () => {
      it('should expose correct slot props', async () => {
        let itemProps: any

        mount(Selection.Root, {
          slots: {
            default: () =>
              h(Selection.Item as any, { id: 'my-id', value: 'my-value', label: 'My Label' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.id).toBe('my-id')
        expect(itemProps.label).toBe('My Label')
        expect(itemProps.value).toBe('my-value')
        expect(typeof itemProps.isSelected).toBe('boolean')
        expect(typeof itemProps.isDisabled).toBe('boolean')
        expect(typeof itemProps.select).toBe('function')
        expect(typeof itemProps.unselect).toBe('function')
        expect(typeof itemProps.toggle).toBe('function')
      })

      it('should expose correct attrs', async () => {
        let itemProps: any

        mount(Selection.Root, {
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(typeof itemProps.attrs['aria-selected']).toBe('boolean')
        expect(typeof itemProps.attrs['aria-disabled']).toBe('boolean')
      })
    })

    describe('selection', () => {
      it('should select item with select()', async () => {
        let itemProps: any

        mount(Selection.Root, {
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(false)

        itemProps.select()
        await nextTick()

        expect(itemProps.isSelected).toBe(true)
      })

      it('should unselect item with unselect()', async () => {
        let itemProps: any

        mount(Selection.Root, {
          props: {
            modelValue: 'item-1',
          },
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(true)

        itemProps.unselect()
        await nextTick()

        expect(itemProps.isSelected).toBe(false)
      })

      it('should toggle item with toggle()', async () => {
        let itemProps: any

        mount(Selection.Root, {
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(false)

        itemProps.toggle()
        await nextTick()

        expect(itemProps.isSelected).toBe(true)

        itemProps.toggle()
        await nextTick()

        expect(itemProps.isSelected).toBe(false)
      })
    })

    describe('disabled state', () => {
      it('should be disabled when item disabled=true', async () => {
        let itemProps: any

        mount(Selection.Root, {
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
        expect(itemProps.attrs['aria-disabled']).toBe(true)
      })
    })

    describe('registration lifecycle', () => {
      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)
        const selected = ref<string>('item-1')

        mount(Selection.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              showItem.value
                ? h(Selection.Item as any, { value: 'item-1' }, () => 'Item 1')
                : null,
          },
        })

        await nextTick()

        showItem.value = false
        await nextTick()

        // Selection should be cleared after unmount
        expect(selected.value).toBeUndefined()
      })

      it('should generate ID if not provided', async () => {
        let itemProps: any

        mount(Selection.Root, {
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.id).toBeDefined()
        expect(typeof itemProps.id).toBe('string')
      })
    })

    describe('data attributes', () => {
      it('should set data-selected when selected', async () => {
        let itemProps: any

        mount(Selection.Root, {
          props: {
            modelValue: 'item-1',
          },
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.attrs['data-selected']).toBe(true)
      })

      it('should set data-disabled when disabled', async () => {
        let itemProps: any

        mount(Selection.Root, {
          slots: {
            default: () =>
              h(Selection.Item as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.attrs['data-disabled']).toBe(true)
      })
    })
  })

  describe('integration', () => {
    it('should use custom namespace for isolation', async () => {
      let sel1ItemProps: any
      let sel2ItemProps: any

      mount(defineComponent({
        render: () => [
          h(Selection.Root as any, { namespace: 'selection-1' }, () =>
            h(Selection.Item as any, { value: 'item-1', namespace: 'selection-1' }, {
              default: (props: any) => {
                sel1ItemProps = props
                return h('div', 'Selection 1 Item')
              },
            }),
          ),
          h(Selection.Root as any, { namespace: 'selection-2' }, () =>
            h(Selection.Item as any, { value: 'item-1', namespace: 'selection-2' }, {
              default: (props: any) => {
                sel2ItemProps = props
                return h('div', 'Selection 2 Item')
              },
            }),
          ),
        ],
      }))

      await nextTick()

      // Select in selection 1
      sel1ItemProps.select()
      await nextTick()

      // Only selection 1 item should be selected
      expect(sel1ItemProps.isSelected).toBe(true)
      expect(sel2ItemProps.isSelected).toBe(false)
    })
  })

  describe('sSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Selection.Root as any, {}, {
            default: () => [
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 1'),
              }),
              h(Selection.Item as any, { value: 'item-2' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 2'),
              }),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Item 1')
      expect(html).toContain('Item 2')
    })

    it('should render selected state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Selection.Root as any, { modelValue: 'item-1' }, {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 1'),
              }),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-selected="true"')
      expect(html).toContain('data-selected="true"')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Selection.Root as any, {}, {
            default: () =>
              h(Selection.Item as any, { value: 'item-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 1'),
              }),
          }),
      })

      const ssrApp = createSSRApp(Component)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(Component, {
        attachTo: container,
      })

      await nextTick()

      expect(wrapper.text()).toContain('Item 1')

      wrapper.unmount()
    })
  })
})
