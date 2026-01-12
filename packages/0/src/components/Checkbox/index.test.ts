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
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(false)

        rootProps.toggle()
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
      it('should have correct role on Root', async () => {
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

        expect(rootProps.attrs.role).toBe('checkbox')
      })

      it('should set aria-checked based on state', async () => {
        let rootProps: any

        const wrapper = mount(Checkbox.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['aria-checked']).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(rootProps.attrs['aria-checked']).toBe(true)
      })

      it('should set tabindex to 0 when enabled', async () => {
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

        expect(rootProps.attrs.tabindex).toBe(0)
      })

      it('should set data-state correctly', async () => {
        let rootProps: any

        const wrapper = mount(Checkbox.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['data-state']).toBe('unchecked')

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(rootProps.attrs['data-state']).toBe('checked')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when Root disabled=true', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isDisabled).toBe(true)
        expect(rootProps.attrs['aria-disabled']).toBe(true)
        expect(rootProps.attrs.tabindex).toBeUndefined()
        expect(rootProps.attrs['data-disabled']).toBe(true)
      })

      it('should not toggle when disabled', async () => {
        const checked = ref(false)
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'disabled': true,
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

        rootProps.toggle()
        await nextTick()

        expect(checked.value).toBe(false)
      })
    })

    describe('keyboard interaction', () => {
      it('should toggle on Space key press via click handler', async () => {
        const checked = ref(false)

        const wrapper = mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        // Root handles keyboard via onKeydown bound to Atom
        const button = wrapper.find('button')
        await button.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(checked.value).toBe(true)
      })

      it('should toggle on click', async () => {
        const checked = ref(false)

        const wrapper = mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        const button = wrapper.find('button')
        await button.trigger('click')
        await nextTick()

        expect(checked.value).toBe(true)
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
        expect(rootProps.attrs).toBeDefined()
      })

      it('should expose slot props on Indicator', async () => {
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

        expect(typeof indicatorProps.isChecked).toBe('boolean')
        expect(typeof indicatorProps.isMixed).toBe('boolean')
        expect(indicatorProps.attrs).toBeDefined()
        expect(indicatorProps.attrs['data-state']).toBeDefined()
        expect(indicatorProps.attrs.style).toBeDefined()
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
      it('should render Group with role="group"', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.attributes('role')).toBe('group')
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
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        rootProps.toggle()
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
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-2' }, {
                default: (props: any) => {
                  item2Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                },
              }),
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
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)
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

        expect(rootProps.attrs['aria-checked']).toBe('mixed')
        expect(rootProps.attrs['data-state']).toBe('indeterminate')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when Group is disabled', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isDisabled).toBe(true)
      })

      it('should be disabled when Root is disabled', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isDisabled).toBe(true)
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

    describe('mandatory prop', () => {
      it('should prevent deselecting last item when mandatory=true', async () => {
        const selected = ref<string[]>(['item-1'])
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            'mandatory': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)

        rootProps.toggle()
        await nextTick()

        // Should still be selected due to mandatory
        expect(rootProps.isChecked).toBe(true)
        expect(selected.value).toContain('item-1')
      })

      it('should auto-select first item when mandatory=force', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            mandatory: 'force',
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)
      })
    })

    describe('enroll prop', () => {
      it('should auto-select non-disabled items when enroll=true', async () => {
        let item1Props: any
        let item2Props: any

        mount(Checkbox.Group, {
          props: {
            enroll: true,
          },
          slots: {
            default: () => [
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-2', disabled: true }, {
                default: (props: any) => {
                  item2Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(item1Props.isChecked).toBe(true)
        expect(item2Props.isChecked).toBe(false)
      })
    })

    describe('batch operations with ID arrays', () => {
      it('should select multiple items by ID array', async () => {
        const selected = ref<string[]>([])
        let groupProps: any
        let item1Props: any
        let item2Props: any
        let item3Props: any

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
                h(Checkbox.Root as any, { id: 'id-1', value: 'item-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-2', value: 'item-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-3', value: 'item-3' }, {
                  default: (p: any) => {
                    item3Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 3')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        groupProps.select(['id-1', 'id-3'])
        await nextTick()

        expect(item1Props.isChecked).toBe(true)
        expect(item2Props.isChecked).toBe(false)
        expect(item3Props.isChecked).toBe(true)
      })

      it('should toggle multiple items by ID array', async () => {
        const selected = ref<string[]>([])
        let groupProps: any
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
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { id: 'id-1', value: 'item-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-2', value: 'item-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        groupProps.toggle(['id-1', 'id-2'])
        await nextTick()

        expect(item1Props.isChecked).toBe(true)
        expect(item2Props.isChecked).toBe(true)

        groupProps.toggle(['id-1', 'id-2'])
        await nextTick()

        expect(item1Props.isChecked).toBe(false)
        expect(item2Props.isChecked).toBe(false)
      })

      it('should unselect multiple items by ID array', async () => {
        const selected = ref<string[]>(['item-1', 'item-2', 'item-3'])
        let groupProps: any
        let item1Props: any
        let item2Props: any
        let item3Props: any

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
                h(Checkbox.Root as any, { id: 'id-1', value: 'item-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-2', value: 'item-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-3', value: 'item-3' }, {
                  default: (p: any) => {
                    item3Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 3')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        groupProps.unselect(['id-1', 'id-3'])
        await nextTick()

        expect(item1Props.isChecked).toBe(false)
        expect(item2Props.isChecked).toBe(true)
        expect(item3Props.isChecked).toBe(false)
      })
    })
  })

  describe('atom integration', () => {
    it('should render Root as button by default', () => {
      const wrapper = mount(Checkbox.Root, {
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Click me'),
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render Indicator as span by default', () => {
      const wrapper = mount(Checkbox.Root, {
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Check'),
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should render Root as specified element', () => {
      const wrapper = mount(Checkbox.Root, {
        props: {
          as: 'div',
        },
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Click me'),
        },
      })

      expect(wrapper.find('div[role="checkbox"]').exists()).toBe(true)
    })

    it('should apply attrs to rendered Root element', async () => {
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

  describe('SSR/Hydration', () => {
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

    it('should use provided id to avoid hydration mismatch', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, { id: 'stable-id', modelValue: true }, () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          ),
      }))

      const html = await renderToString(app)

      // With explicit id, the server render should be deterministic
      expect(html).toBeTruthy()

      // Mount client-side with same id and capture slot props
      let capturedProps: any
      mount(Checkbox.Root, {
        props: {
          id: 'stable-id',
          modelValue: true,
        },
        slots: {
          default: (props: any) => {
            capturedProps = props
            return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
          },
        },
      })

      await nextTick()

      // ID should match
      expect(capturedProps.id).toBe('stable-id')
    })

    it('should render hidden input in SSR output', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, { name: 'agree', value: 'yes', modelValue: true }, () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('type="checkbox"')
      expect(html).toContain('name="agree"')
      expect(html).toContain('value="yes"')
    })
  })

  describe('error conditions', () => {
    it('should throw when Indicator is used outside Root', () => {
      expect(() => {
        mount(Checkbox.Indicator as any, {
          slots: {
            default: () => 'Checkbox',
          },
        })
      }).toThrow(/Context.*not found/i)
    })

    it('should throw when HiddenInput is used outside Root', () => {
      expect(() => {
        mount(Checkbox.HiddenInput as any)
      }).toThrow(/Context.*not found/i)
    })
  })

  describe('form integration', () => {
    describe('auto-rendered hidden input', () => {
      it('should render hidden input when name prop is provided', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('name')).toBe('agree')
      })

      it('should not render hidden input when name prop is not provided', () => {
        const wrapper = mount(Checkbox.Root, {
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(false)
      })

      it('should sync checked state with hidden input', async () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            modelValue: false,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        let input = wrapper.find('input[type="checkbox"]')
        expect((input.element as HTMLInputElement).checked).toBe(false)

        // Update v-model
        await wrapper.setProps({ modelValue: true })
        await nextTick()

        input = wrapper.find('input[type="checkbox"]')
        expect((input.element as HTMLInputElement).checked).toBe(true)
      })

      it('should use value prop for hidden input value', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            value: 'yes',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('value')).toBe('yes')
      })

      it('should use default value "on" when value prop is not provided', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('value')).toBe('on')
      })

      it('should pass form prop to hidden input', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            form: 'my-form',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('form')).toBe('my-form')
      })

      it('should disable hidden input when checkbox is disabled', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            disabled: true,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('disabled')).toBeDefined()
      })

      it('should have aria-hidden and negative tabindex on hidden input', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('aria-hidden')).toBe('true')
        expect(input.attributes('tabindex')).toBe('-1')
      })
    })

    describe('explicit HiddenInput component', () => {
      it('should render when placed inside Root', () => {
        const wrapper = mount(Checkbox.Root, {
          slots: {
            default: () => [
              h(Checkbox.HiddenInput as any, { name: 'agree' }),
              h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
            ],
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('name')).toBe('agree')
      })

      it('should override context values with explicit props', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            value: 'context-value',
          },
          slots: {
            default: () => [
              h(Checkbox.HiddenInput as any, { name: 'agree', value: 'explicit-value' }),
              h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
            ],
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('value')).toBe('explicit-value')
      })
    })

    describe('form integration in group mode', () => {
      it('should render hidden inputs for multiple checkboxes', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.Root as any, { name: 'options', value: 'a' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Option A'),
              ),
              h(Checkbox.Root as any, { name: 'options', value: 'b' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Option B'),
              ),
            ],
          },
        })

        const inputs = wrapper.findAll('input[type="checkbox"]')
        expect(inputs).toHaveLength(2)
        expect(inputs[0]!.attributes('name')).toBe('options')
        expect(inputs[0]!.attributes('value')).toBe('a')
        expect(inputs[1]!.attributes('name')).toBe('options')
        expect(inputs[1]!.attributes('value')).toBe('b')
      })

      it('should sync checked state with group selection', async () => {
        const selected = ref<string[]>([])
        let item1Props: any

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.Root as any, { name: 'options', value: 'a' }, {
                default: (props: any) => {
                  item1Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Option A')
                },
              }),
              h(Checkbox.Root as any, { name: 'options', value: 'b' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Option B'),
              ),
            ],
          },
        })

        await nextTick()

        const inputs = wrapper.findAll('input[type="checkbox"]')
        expect((inputs[0]!.element as HTMLInputElement).checked).toBe(false)

        item1Props.toggle()
        await nextTick()

        expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true)
        expect((inputs[1]!.element as HTMLInputElement).checked).toBe(false)
      })
    })

    describe('formData population', () => {
      it('should populate FormData correctly when checked', async () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            value: 'yes',
            modelValue: true,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
          attachTo: document.body,
        })

        await nextTick()

        const input = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
        const formData = new FormData()

        // Simulate form data collection
        if (input.checked) {
          formData.append(input.name, input.value)
        }

        expect(formData.get('agree')).toBe('yes')

        wrapper.unmount()
      })

      it('should not populate FormData when unchecked', async () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            value: 'yes',
            modelValue: false,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
          attachTo: document.body,
        })

        await nextTick()

        const input = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
        const formData = new FormData()

        // Simulate form data collection
        if (input.checked) {
          formData.append(input.name, input.value)
        }

        expect(formData.get('agree')).toBeNull()

        wrapper.unmount()
      })
    })
  })
})
