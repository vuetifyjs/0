import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Checkbox } from './index'

describe('checkbox', () => {
  describe('standalone mode (Checkbox.Root without Group)', () => {
    describe('v-model binding', () => {
      it('should bind to v-model boolean', async () => {
        let rootProps: any
        let indicatorProps: any
        let emittedValue: boolean | undefined

        mount(Checkbox.Root, {
          props: {
            'onUpdate:modelValue': (value: unknown) => {
              emittedValue = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, {
                default: (iProps: any) => {
                  indicatorProps = iProps
                  return 'Checkbox'
                },
              })
            },
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(false)
        expect(indicatorProps.isChecked).toBe(false)

        indicatorProps.toggle()
        await nextTick()

        expect(emittedValue).toBe(true)
        expect(rootProps.isChecked).toBe(true)
      })

      it('should reflect initial true value', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            modelValue: true,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)
      })

      it('should check with check()', async () => {
        const checked = ref(false)
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        rootProps.check()
        await nextTick()

        expect(checked.value).toBe(true)
      })

      it('should uncheck with uncheck()', async () => {
        const checked = ref(true)
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        rootProps.uncheck()
        await nextTick()

        expect(checked.value).toBe(false)
      })
    })

    describe('a11y attrs', () => {
      it('should have correct role on Indicator', async () => {
        let indicatorProps: any

        mount(Checkbox.Root, {
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        expect(indicatorProps.attrs.role).toBe('checkbox')
      })

      it('should set aria-checked based on state', async () => {
        let indicatorProps: any

        const wrapper = mount(Checkbox.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        expect(indicatorProps.attrs['aria-checked']).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(indicatorProps.attrs['aria-checked']).toBe(true)
      })

      it('should set tabindex to 0 when enabled', async () => {
        let indicatorProps: any

        mount(Checkbox.Root, {
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        expect(indicatorProps.attrs.tabindex).toBe(0)
      })

      it('should set data-state correctly', async () => {
        let indicatorProps: any

        const wrapper = mount(Checkbox.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        expect(indicatorProps.attrs['data-state']).toBe('unchecked')

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(indicatorProps.attrs['data-state']).toBe('checked')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when Root disabled=true', async () => {
        let indicatorProps: any

        mount(Checkbox.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        expect(indicatorProps.isDisabled).toBe(true)
        expect(indicatorProps.attrs['aria-disabled']).toBe(true)
        expect(indicatorProps.attrs.tabindex).toBeUndefined()
        expect(indicatorProps.attrs['data-disabled']).toBe('')
      })

      it('should not toggle when disabled', async () => {
        const checked = ref(false)
        let indicatorProps: any

        mount(Checkbox.Root, {
          props: {
            'disabled': true,
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        indicatorProps.toggle()
        await nextTick()

        expect(checked.value).toBe(false)
      })
    })

    describe('slot props', () => {
      it('should expose all required slot props on Root', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            id: 'my-checkbox',
            label: 'My Label',
            value: 'my-value',
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.id).toBe('my-checkbox')
        expect(rootProps.label).toBe('My Label')
        expect(rootProps.value).toBe('my-value')
        expect(typeof rootProps.isChecked).toBe('boolean')
        expect(typeof rootProps.isMixed).toBe('boolean')
        expect(typeof rootProps.isDisabled).toBe('boolean')
        expect(typeof rootProps.check).toBe('function')
        expect(typeof rootProps.uncheck).toBe('function')
        expect(typeof rootProps.toggle).toBe('function')
        expect(typeof rootProps.mix).toBe('function')
        expect(typeof rootProps.unmix).toBe('function')
      })

      it('should expose slot props on Indicator', async () => {
        let indicatorProps: any

        mount(Checkbox.Root, {
          props: {
            id: 'my-checkbox',
            label: 'My Label',
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        expect(indicatorProps.id).toBe('my-checkbox')
        expect(indicatorProps.label).toBe('My Label')
        expect(typeof indicatorProps.toggle).toBe('function')
        expect(indicatorProps.attrs).toBeDefined()
      })

      it('should generate id if not provided', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.id).toBeDefined()
        expect(typeof rootProps.id).toBe('string')
      })
    })

    describe('isMixed in standalone', () => {
      it('should always be false in standalone mode', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isMixed).toBe(false)

        // mix() should be a no-op in standalone mode
        rootProps.mix()
        await nextTick()

        expect(rootProps.isMixed).toBe(false)
      })
    })
  })

  describe('group mode (Checkbox.Group > Checkbox.Root > Checkbox.Indicator)', () => {
    describe('rendering', () => {
      it('should render Group as renderless', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose Group slot props', () => {
        let groupProps: any

        mount(Checkbox.Group, {
          slots: {
            default: (props: any) => {
              groupProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(groupProps).toBeDefined()
        expect(typeof groupProps.isDisabled).toBe('boolean')
        expect(typeof groupProps.isNoneSelected).toBe('boolean')
        expect(typeof groupProps.isAllSelected).toBe('boolean')
        expect(typeof groupProps.isMixed).toBe('boolean')
        expect(typeof groupProps.select).toBe('function')
        expect(typeof groupProps.unselect).toBe('function')
        expect(typeof groupProps.toggle).toBe('function')
        expect(typeof groupProps.selectAll).toBe('function')
        expect(typeof groupProps.unselectAll).toBe('function')
        expect(typeof groupProps.toggleAll).toBe('function')
        expect(groupProps.attrs['aria-multiselectable']).toBe(true)
      })
    })

    describe('v-model binding', () => {
      it('should update v-model when items are selected', async () => {
        const selected = ref<string[]>([])
        let indicatorProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    indicatorProps = props
                    return 'Item 1'
                  },
                }),
              ),
          },
        })

        await nextTick()

        indicatorProps.toggle()
        await nextTick()

        expect(selected.value).toContain('item-1')
      })

      it('should support multiple selections', async () => {
        const selected = ref<string[]>([])
        let item1Props: any
        let item2Props: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    item1Props = props
                    return 'Item 1'
                  },
                }),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    item2Props = props
                    return 'Item 2'
                  },
                }),
              ),
            ],
          },
        })

        await nextTick()

        item1Props.toggle()
        item2Props.toggle()
        await nextTick()

        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })

      it('should reflect initial model value', async () => {
        let indicatorProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    indicatorProps = props
                    return 'Item 1'
                  },
                }),
              ),
          },
        })

        await nextTick()

        expect(indicatorProps.isChecked).toBe(true)
      })
    })

    describe('batch operations', () => {
      it('should select all items with selectAll', async () => {
        const selected = ref<string[]>([])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
                h(Checkbox.Root as any, { value: 'item-3' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 3'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.selectAll()
        await nextTick()

        expect(selected.value).toHaveLength(3)
      })

      it('should unselect all with unselectAll', async () => {
        const selected = ref<string[]>(['item-1', 'item-2', 'item-3'])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
                h(Checkbox.Root as any, { value: 'item-3' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 3'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.unselectAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })

      it('should toggle all with toggleAll', async () => {
        const selected = ref<string[]>([])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(2)

        groupProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })
    })

    describe('tri-state (mixed/indeterminate)', () => {
      it('should set mixed state with mix()', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isMixed).toBe(false)

        rootProps.mix()
        await nextTick()

        expect(rootProps.isMixed).toBe(true)
      })

      it('should clear mixed state with unmix()', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item')
                },
              }),
          },
        })

        await nextTick()

        rootProps.mix()
        await nextTick()

        expect(rootProps.isMixed).toBe(true)

        rootProps.unmix()
        await nextTick()

        expect(rootProps.isMixed).toBe(false)
      })

      it('should set aria-checked to mixed when in mixed state', async () => {
        let rootProps: any
        let indicatorProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, {
                    default: (iProps: any) => {
                      indicatorProps = iProps
                      return 'Item'
                    },
                  })
                },
              }),
          },
        })

        await nextTick()

        rootProps.mix()
        await nextTick()

        expect(indicatorProps.attrs['aria-checked']).toBe('mixed')
        expect(indicatorProps.attrs['data-state']).toBe('indeterminate')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when Group is disabled', async () => {
        let indicatorProps: any

        mount(Checkbox.Group, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    indicatorProps = props
                    return 'Item 1'
                  },
                }),
              ),
          },
        })

        await nextTick()

        expect(indicatorProps.isDisabled).toBe(true)
      })

      it('should be disabled when Root is disabled', async () => {
        let indicatorProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1', disabled: true }, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    indicatorProps = props
                    return 'Item 1'
                  },
                }),
              ),
          },
        })

        await nextTick()

        expect(indicatorProps.isDisabled).toBe(true)
      })
    })

    describe('registration lifecycle', () => {
      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)
        let groupProps: any

        mount(Checkbox.Group, {
          slots: {
            default: (props: any) => {
              groupProps = props
              return showItem.value
                ? h(Checkbox.Root as any, { value: 'item-1' }, () =>
                    h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                  )
                : null
            },
          },
        })

        await nextTick()

        groupProps.selectAll()
        await nextTick()

        showItem.value = false
        await nextTick()

        expect(groupProps.isNoneSelected).toBe(true)
      })
    })

    describe('namespace isolation', () => {
      it('should use custom namespace for isolation', async () => {
        let group1RootProps: any
        let group2RootProps: any

        mount(defineComponent({
          render: () => [
            h(Checkbox.Group as any, { namespace: 'checkbox-1' }, () =>
              h(Checkbox.Root as any, { value: 'item-1', namespace: 'checkbox-1' }, {
                default: (props: any) => {
                  group1RootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Group 1 Item')
                },
              }),
            ),
            h(Checkbox.Group as any, { namespace: 'checkbox-2' }, () =>
              h(Checkbox.Root as any, { value: 'item-1', namespace: 'checkbox-2' }, {
                default: (props: any) => {
                  group2RootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Group 2 Item')
                },
              }),
            ),
          ],
        }))

        await nextTick()

        group1RootProps.toggle()
        await nextTick()

        expect(group1RootProps.isChecked).toBe(true)
        expect(group2RootProps.isChecked).toBe(false)
      })
    })
  })

  describe('atom integration', () => {
    it('should render Indicator as button by default', () => {
      const wrapper = mount(Checkbox.Root, {
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Click me'),
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render Indicator as specified element', () => {
      const wrapper = mount(Checkbox.Root, {
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, { as: 'div' }, () => 'Click me'),
        },
      })

      expect(wrapper.find('div[role="checkbox"]').exists()).toBe(true)
    })

    it('should apply attrs to rendered element', async () => {
      const wrapper = mount(Checkbox.Root, {
        props: {
          modelValue: true,
        },
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
        },
      })

      await nextTick()

      const button = wrapper.find('button')
      expect(button.attributes('role')).toBe('checkbox')
      expect(button.attributes('aria-checked')).toBe('true')
      expect(button.attributes('tabindex')).toBe('0')
      expect(button.attributes('data-state')).toBe('checked')
    })
  })

  describe('sSR/Hydration', () => {
    it('should render standalone to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, { modelValue: true }, () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('role="checkbox"')
      expect(html).toContain('aria-checked="true"')
      expect(html).toContain('data-state="checked"')
    })

    it('should render group to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Group as any, {}, () => [
            h(Checkbox.Root as any, { value: 'item-1' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 1'),
            ),
            h(Checkbox.Root as any, { value: 'item-2' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 2'),
            ),
          ]),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Item 1')
      expect(html).toContain('Item 2')
      expect(html).toContain('role="checkbox"')
    })

    it('should render selected state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Group as any, { modelValue: ['item-1'] }, () =>
            h(Checkbox.Root as any, { value: 'item-1' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 1'),
            ),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-checked="true"')
      expect(html).toContain('data-state="checked"')
    })

    it('should render disabled state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Group as any, { disabled: true }, () =>
            h(Checkbox.Root as any, { value: 'item-1' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 1'),
            ),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-disabled="true"')
      expect(html).toContain('data-disabled')
    })
  })
})
