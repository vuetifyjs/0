import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Step } from './index'

describe('step', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should be renderless by default', () => {
        const wrapper = mount(Step.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Step.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.first).toBe('function')
        expect(typeof slotProps.last).toBe('function')
        expect(typeof slotProps.next).toBe('function')
        expect(typeof slotProps.prev).toBe('function')
        expect(typeof slotProps.step).toBe('function')
        expect(typeof slotProps.select).toBe('function')
        expect(typeof slotProps.unselect).toBe('function')
        expect(typeof slotProps.toggle).toBe('function')
        expect(slotProps.attrs['aria-multiselectable']).toBe(false)
      })
    })

    describe('navigation', () => {
      it('should navigate to first item with first()', async () => {
        const selected = ref<string>()

        let rootProps: any
        let item1Props: any
        let item2Props: any
        let item3Props: any

        mount(Step.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Step.Item as any, { value: 'step-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h('div', 'Step 1')
                  },
                }),
                h(Step.Item as any, { value: 'step-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h('div', 'Step 2')
                  },
                }),
                h(Step.Item as any, { value: 'step-3' }, {
                  default: (p: any) => {
                    item3Props = p
                    return h('div', 'Step 3')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        // Select last item first
        item3Props.select()
        await nextTick()
        expect(selected.value).toBe('step-3')

        // Navigate to first
        rootProps.first()
        await nextTick()

        expect(selected.value).toBe('step-1')
        expect(item1Props.isSelected).toBe(true)
        expect(item2Props.isSelected).toBe(false)
        expect(item3Props.isSelected).toBe(false)
      })

      it('should navigate to last item with last()', async () => {
        const selected = ref<string>()

        let rootProps: any
        let item1Props: any
        let item2Props: any
        let item3Props: any

        mount(Step.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Step.Item as any, { value: 'step-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h('div', 'Step 1')
                  },
                }),
                h(Step.Item as any, { value: 'step-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h('div', 'Step 2')
                  },
                }),
                h(Step.Item as any, { value: 'step-3' }, {
                  default: (p: any) => {
                    item3Props = p
                    return h('div', 'Step 3')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        // Select first item
        item1Props.select()
        await nextTick()
        expect(selected.value).toBe('step-1')

        // Navigate to last
        rootProps.last()
        await nextTick()

        expect(selected.value).toBe('step-3')
        expect(item1Props.isSelected).toBe(false)
        expect(item2Props.isSelected).toBe(false)
        expect(item3Props.isSelected).toBe(true)
      })

      it('should navigate to next item with next()', async () => {
        const selected = ref<string>()

        let rootProps: any
        let item1Props: any
        let item2Props: any

        mount(Step.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Step.Item as any, { value: 'step-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h('div', 'Step 1')
                  },
                }),
                h(Step.Item as any, { value: 'step-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h('div', 'Step 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        // Select first item
        item1Props.select()
        await nextTick()
        expect(item1Props.isSelected).toBe(true)

        // Navigate to next
        rootProps.next()
        await nextTick()

        expect(selected.value).toBe('step-2')
        expect(item1Props.isSelected).toBe(false)
        expect(item2Props.isSelected).toBe(true)
      })

      it('should navigate to previous item with prev()', async () => {
        const selected = ref<string>()

        let rootProps: any
        let item1Props: any
        let item2Props: any

        mount(Step.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Step.Item as any, { value: 'step-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h('div', 'Step 1')
                  },
                }),
                h(Step.Item as any, { value: 'step-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h('div', 'Step 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        // Select second item
        item2Props.select()
        await nextTick()
        expect(item2Props.isSelected).toBe(true)

        // Navigate to prev
        rootProps.prev()
        await nextTick()

        expect(selected.value).toBe('step-1')
        expect(item1Props.isSelected).toBe(true)
        expect(item2Props.isSelected).toBe(false)
      })

      it('should step forward/backward by count with step()', async () => {
        const selected = ref<string>()

        let rootProps: any
        let item1Props: any
        let item2Props: any
        let item3Props: any

        mount(Step.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Step.Item as any, { value: 'step-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h('div', 'Step 1')
                  },
                }),
                h(Step.Item as any, { value: 'step-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h('div', 'Step 2')
                  },
                }),
                h(Step.Item as any, { value: 'step-3' }, {
                  default: (p: any) => {
                    item3Props = p
                    return h('div', 'Step 3')
                  },
                }),
                h(Step.Item as any, { value: 'step-4' }, () => h('div', 'Step 4')),
              ]
            },
          },
        })

        await nextTick()

        // Select first item
        item1Props.select()
        await nextTick()
        expect(item1Props.isSelected).toBe(true)

        // Step forward by 2
        rootProps.step(2)
        await nextTick()

        expect(selected.value).toBe('step-3')
        expect(item3Props.isSelected).toBe(true)

        // Step backward by 1
        rootProps.step(-1)
        await nextTick()

        expect(selected.value).toBe('step-2')
        expect(item2Props.isSelected).toBe(true)
      })
    })

    describe('disabled prop', () => {
      it('should disable all items when root is disabled', async () => {
        let itemProps: any

        mount(Step.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Step 1')
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
        const selected = ref<string>('step-1')

        let itemProps: any

        mount(Step.Root, {
          props: {
            'mandatory': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Step 1')
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

        mount(Step.Root, {
          props: {
            mandatory: 'force',
          },
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Step 1')
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

        mount(Step.Root, {
          props: {
            enroll: true,
          },
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Step 1')
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

        mount(Step.Root, {
          slots: {
            default: () =>
              h(Step.Item as any, { id: 'my-id', value: 'my-value', label: 'My Label' }, {
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

        mount(Step.Root, {
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
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

        mount(Step.Root, {
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
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

        mount(Step.Root, {
          props: {
            modelValue: 'step-1',
          },
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
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

        mount(Step.Root, {
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
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

        mount(Step.Root, {
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1', disabled: true }, {
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

    describe('data attributes', () => {
      it('should set data-selected when selected', async () => {
        let itemProps: any

        mount(Step.Root, {
          props: {
            modelValue: 'step-1',
          },
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
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

        mount(Step.Root, {
          slots: {
            default: () =>
              h(Step.Item as any, { value: 'step-1', disabled: true }, {
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
    it('should skip disabled items during navigation', async () => {
      const selected = ref<string>()

      let rootProps: any
      let item1Props: any
      let item2Props: any
      let item3Props: any

      mount(Step.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Step.Item as any, { value: 'step-1' }, {
                default: (p: any) => {
                  item1Props = p
                  return h('div', 'Step 1')
                },
              }),
              h(Step.Item as any, { value: 'step-2', disabled: true }, {
                default: (p: any) => {
                  item2Props = p
                  return h('div', 'Step 2')
                },
              }),
              h(Step.Item as any, { value: 'step-3' }, {
                default: (p: any) => {
                  item3Props = p
                  return h('div', 'Step 3')
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      // Select first item
      item1Props.select()
      await nextTick()
      expect(item1Props.isSelected).toBe(true)

      // Navigate next (should skip disabled step-2)
      rootProps.next()
      await nextTick()

      expect(selected.value).toBe('step-3')
      expect(item1Props.isSelected).toBe(false)
      expect(item2Props.isSelected).toBe(false)
      expect(item3Props.isSelected).toBe(true)
    })

    it('should use custom namespace for isolation', async () => {
      let step1ItemProps: any
      let step2ItemProps: any

      mount(defineComponent({
        render: () => [
          h(Step.Root as any, { namespace: 'step-1' }, () =>
            h(Step.Item as any, { value: 'item-1', namespace: 'step-1' }, {
              default: (props: any) => {
                step1ItemProps = props
                return h('div', 'Step 1 Item')
              },
            }),
          ),
          h(Step.Root as any, { namespace: 'step-2' }, () =>
            h(Step.Item as any, { value: 'item-1', namespace: 'step-2' }, {
              default: (props: any) => {
                step2ItemProps = props
                return h('div', 'Step 2 Item')
              },
            }),
          ),
        ],
      }))

      await nextTick()

      // Select in step 1
      step1ItemProps.select()
      await nextTick()

      // Only step 1 item should be selected
      expect(step1ItemProps.isSelected).toBe(true)
      expect(step2ItemProps.isSelected).toBe(false)
    })
  })

  describe('sSR/Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Step.Root as any, {}, {
            default: () => [
              h(Step.Item as any, { value: 'step-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Step 1'),
              }),
              h(Step.Item as any, { value: 'step-2' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Step 2'),
              }),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Step 1')
      expect(html).toContain('Step 2')
    })

    it('should render selected state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Step.Root as any, { modelValue: 'step-1' }, {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Step 1'),
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
          h(Step.Root as any, {}, {
            default: () =>
              h(Step.Item as any, { value: 'step-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Step 1'),
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

      expect(wrapper.text()).toContain('Step 1')

      wrapper.unmount()
    })
  })
})
