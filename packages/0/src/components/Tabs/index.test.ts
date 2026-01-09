import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Tabs } from './index'

describe('tabs', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should be renderless by default', () => {
        const wrapper = mount(Tabs.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Tabs.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(slotProps.orientation).toBe('horizontal')
        expect(slotProps.activation).toBe('automatic')
        expect(typeof slotProps.first).toBe('function')
        expect(typeof slotProps.last).toBe('function')
        expect(typeof slotProps.next).toBe('function')
        expect(typeof slotProps.prev).toBe('function')
        expect(typeof slotProps.step).toBe('function')
        expect(typeof slotProps.select).toBe('function')
        expect(typeof slotProps.unselect).toBe('function')
        expect(typeof slotProps.toggle).toBe('function')
      })
    })

    describe('orientation prop', () => {
      it('should default to horizontal', () => {
        let listProps: any

        mount(Tabs.Root, {
          slots: {
            default: () => h(Tabs.List as any, {}, {
              default: (props: any) => {
                listProps = props
                return h('div', 'List')
              },
            }),
          },
        })

        expect(listProps.orientation).toBe('horizontal')
        expect(listProps.attrs['aria-orientation']).toBe('horizontal')
      })

      it('should support vertical orientation', () => {
        let listProps: any

        mount(Tabs.Root, {
          props: {
            orientation: 'vertical',
          },
          slots: {
            default: () => h(Tabs.List as any, {}, {
              default: (props: any) => {
                listProps = props
                return h('div', 'List')
              },
            }),
          },
        })

        expect(listProps.orientation).toBe('vertical')
        expect(listProps.attrs['aria-orientation']).toBe('vertical')
      })
    })

    describe('mandatory prop', () => {
      it('should auto-select first tab when mandatory=force (default)', async () => {
        let tabProps: any

        mount(Tabs.Root, {
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        expect(tabProps.isSelected).toBe(true)
      })

      it('should not auto-select when mandatory=false', async () => {
        let tabProps: any

        mount(Tabs.Root, {
          props: {
            mandatory: false,
          },
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        expect(tabProps.isSelected).toBe(false)
      })
    })
  })

  describe('list', () => {
    it('should render with tablist role', async () => {
      const wrapper = mount(Tabs.Root, {
        slots: {
          default: () => h(Tabs.List as any, { as: 'div' }, () => 'Tabs'),
        },
      })

      await nextTick()

      expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    })

    it('should accept aria-label via label prop', async () => {
      let listProps: any

      mount(Tabs.Root, {
        slots: {
          default: () => h(Tabs.List as any, { label: 'Navigation' }, {
            default: (props: any) => {
              listProps = props
              return h('div', 'List')
            },
          }),
        },
      })

      await nextTick()

      expect(listProps.attrs['aria-label']).toBe('Navigation')
    })
  })

  describe('tab', () => {
    describe('aria attributes', () => {
      it('should have correct ARIA attributes', async () => {
        let tabProps: any

        mount(Tabs.Root, {
          props: {
            mandatory: false,
          },
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        expect(tabProps.attrs.role).toBe('tab')
        expect(tabProps.attrs['aria-selected']).toBe(false)
        expect(tabProps.attrs['aria-controls']).toContain('-panel-')
        expect(tabProps.attrs.tabindex).toBe(-1)
      })

      it('should update aria-selected when selected', async () => {
        let tabProps: any

        mount(Tabs.Root, {
          props: {
            modelValue: 'tab-1',
          },
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        expect(tabProps.attrs['aria-selected']).toBe(true)
        expect(tabProps.attrs.tabindex).toBe(0)
      })
    })

    describe('roving tabindex', () => {
      it('should have tabindex=0 only on selected tab', async () => {
        let tab1Props: any
        let tab2Props: any

        mount(Tabs.Root, {
          props: {
            modelValue: 'tab-1',
          },
          slots: {
            default: () => [
              h(Tabs.Tab as any, { value: 'tab-1' }, {
                default: (props: any) => {
                  tab1Props = props
                  return h('button', 'Tab 1')
                },
              }),
              h(Tabs.Tab as any, { value: 'tab-2' }, {
                default: (props: any) => {
                  tab2Props = props
                  return h('button', 'Tab 2')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(tab1Props.attrs.tabindex).toBe(0)
        expect(tab2Props.attrs.tabindex).toBe(-1)
      })
    })

    describe('selection', () => {
      it('should select tab on click', async () => {
        const selected = ref<string>()
        let tabProps: any

        mount(Tabs.Root, {
          props: {
            'mandatory': false,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        expect(tabProps.isSelected).toBe(false)

        tabProps.attrs.onClick()
        await nextTick()

        expect(selected.value).toBe('tab-1')
        expect(tabProps.isSelected).toBe(true)
      })
    })

    describe('disabled state', () => {
      it('should not select when disabled', async () => {
        const selected = ref<string>()
        let tabProps: any

        mount(Tabs.Root, {
          props: {
            'mandatory': false,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1', disabled: true }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        tabProps.attrs.onClick()
        await nextTick()

        expect(selected.value).toBeUndefined()
        expect(tabProps.isDisabled).toBe(true)
        expect(tabProps.attrs['aria-disabled']).toBe(true)
      })

      it('should allow selection after disabled prop changes to false', async () => {
        const selected = ref<string>()
        const disabled = ref(true)
        let tabProps: any

        // Pass the ref directly - component accepts MaybeRef<boolean>
        mount(Tabs.Root, {
          props: {
            'mandatory': false,
            'modelValue': selected.value,
            'onUpdate:modelValue': (v: unknown) => {
              selected.value = v as string
            },
          },
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1', disabled }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        // Initially disabled
        expect(tabProps.isDisabled).toBe(true)
        tabProps.attrs.onClick()
        await nextTick()
        expect(selected.value).toBeUndefined()

        // Enable the tab
        disabled.value = false
        await nextTick()

        // Now should allow selection
        expect(tabProps.isDisabled).toBe(false)
        tabProps.attrs.onClick()
        await nextTick()
        expect(selected.value).toBe('tab-1')
      })

      it('should retain selection when selected tab becomes disabled', async () => {
        const selected = ref('tab-1')
        const disabled = ref(false)
        let tabProps: any

        // Pass the ref directly - component accepts MaybeRef<boolean>
        mount(Tabs.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (v: unknown) => {
              selected.value = v as string
            },
          },
          slots: {
            default: () => h(Tabs.Tab as any, { value: 'tab-1', disabled }, {
              default: (props: any) => {
                tabProps = props
                return h('button', 'Tab 1')
              },
            }),
          },
        })

        await nextTick()

        expect(tabProps.isSelected).toBe(true)
        expect(tabProps.isDisabled).toBe(false)

        // Disable the selected tab
        disabled.value = true
        await nextTick()

        // Selection retained, but now disabled
        expect(tabProps.isSelected).toBe(true)
        expect(tabProps.isDisabled).toBe(true)
      })

      it('should skip newly disabled tab during keyboard navigation', async () => {
        const selected = ref('tab-1')
        const tab2Disabled = ref(false)
        let tab1Props: any

        // Pass the ref directly - component accepts MaybeRef<boolean>
        mount(Tabs.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (v: unknown) => {
              selected.value = v as string
            },
          },
          slots: {
            default: () => [
              h(Tabs.Tab as any, { value: 'tab-1' }, {
                default: (props: any) => {
                  tab1Props = props
                  return h('button', 'Tab 1')
                },
              }),
              h(Tabs.Tab as any, { value: 'tab-2', disabled: tab2Disabled }, () => h('button', 'Tab 2')),
              h(Tabs.Tab as any, { value: 'tab-3' }, () => h('button', 'Tab 3')),
            ],
          },
        })

        await nextTick()

        // Navigate right - tab-2 is enabled
        const event1 = new KeyboardEvent('keydown', { key: 'ArrowRight' })
        Object.defineProperty(event1, 'preventDefault', { value: () => {} })
        tab1Props.attrs.onKeydown(event1)
        await nextTick()
        expect(selected.value).toBe('tab-2')

        // Reset to tab-1 and disable tab-2
        selected.value = 'tab-1'
        tab2Disabled.value = true
        await nextTick()

        // Navigate right - should skip disabled tab-2
        const event2 = new KeyboardEvent('keydown', { key: 'ArrowRight' })
        Object.defineProperty(event2, 'preventDefault', { value: () => {} })
        tab1Props.attrs.onKeydown(event2)
        await nextTick()
        expect(selected.value).toBe('tab-3')
      })
    })
  })

  describe('panel', () => {
    describe('aria attributes', () => {
      it('should have correct ARIA attributes', async () => {
        let panelProps: any

        mount(Tabs.Root, {
          props: {
            modelValue: 'tab-1',
          },
          slots: {
            default: () => [
              h(Tabs.Tab as any, { value: 'tab-1' }, () => h('button', 'Tab 1')),
              h(Tabs.Panel as any, { value: 'tab-1' }, {
                default: (props: any) => {
                  panelProps = props
                  return h('div', 'Panel 1')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(panelProps.attrs.role).toBe('tabpanel')
        expect(panelProps.attrs['aria-labelledby']).toContain('-tab-')
        expect(panelProps.attrs.tabindex).toBe(0)
        expect(panelProps.attrs.hidden).toBe(false)
      })

      it('should be hidden when not selected', async () => {
        let panelProps: any

        mount(Tabs.Root, {
          props: {
            modelValue: 'tab-2',
          },
          slots: {
            default: () => [
              h(Tabs.Tab as any, { value: 'tab-1' }, () => h('button', 'Tab 1')),
              h(Tabs.Tab as any, { value: 'tab-2' }, () => h('button', 'Tab 2')),
              h(Tabs.Panel as any, { value: 'tab-1' }, {
                default: (props: any) => {
                  panelProps = props
                  return h('div', 'Panel 1')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(panelProps.isSelected).toBe(false)
        expect(panelProps.attrs.hidden).toBe(true)
        expect(panelProps.attrs.tabindex).toBe(-1)
      })
    })

    describe('tab-panel relationship', () => {
      it('should match aria-controls and aria-labelledby', async () => {
        let tabProps: any
        let panelProps: any

        mount(Tabs.Root, {
          props: {
            modelValue: 'profile',
          },
          slots: {
            default: () => [
              h(Tabs.Tab as any, { value: 'profile' }, {
                default: (props: any) => {
                  tabProps = props
                  return h('button', 'Profile')
                },
              }),
              h(Tabs.Panel as any, { value: 'profile' }, {
                default: (props: any) => {
                  panelProps = props
                  return h('div', 'Profile content')
                },
              }),
            ],
          },
        })

        await nextTick()

        // aria-controls on tab should match panel id
        expect(tabProps.attrs['aria-controls']).toBe(panelProps.attrs.id)
        // aria-labelledby on panel should match tab id
        expect(panelProps.attrs['aria-labelledby']).toBe(tabProps.attrs.id)
      })

      it('should fallback to ID-based lookup when value not found in registry', async () => {
        const selected = ref('tab-1')
        let panelProps: any
        let tabId: string | undefined

        const Component = defineComponent({
          render: () => h(Tabs.Root as any, {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          }, () => [
            h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tabId = props.id
                return h('button', 'Tab 1')
              },
            }),
            // Panel that tries to match by value but falls back to ID lookup
            h(Tabs.Panel as any, { value: 'tab-1' }, {
              default: (props: any) => {
                panelProps = props
                return h('div', 'Panel content')
              },
            }),
          ]),
        })

        mount(Component)
        await nextTick()

        // Panel should render with correct ID even if browse returns empty
        expect(panelProps).toBeDefined()
        expect(panelProps.attrs.id).toBeDefined()
        // Panel's aria-labelledby should reference the tab's ID
        expect(panelProps.attrs['aria-labelledby']).toBe(tabId)
      })
    })
  })

  describe('keyboard navigation', () => {
    async function setupTabs (orientation: 'horizontal' | 'vertical' = 'horizontal') {
      const selected = ref('tab-1')
      let tab1Props: any
      let tab2Props: any
      let tab3Props: any

      mount(Tabs.Root, {
        props: {
          orientation,
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => [
            h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tab1Props = props
                return h('button', 'Tab 1')
              },
            }),
            h(Tabs.Tab as any, { value: 'tab-2' }, {
              default: (props: any) => {
                tab2Props = props
                return h('button', 'Tab 2')
              },
            }),
            h(Tabs.Tab as any, { value: 'tab-3' }, {
              default: (props: any) => {
                tab3Props = props
                return h('button', 'Tab 3')
              },
            }),
          ],
        },
      })

      await nextTick()

      return { selected, tab1Props, tab2Props, tab3Props }
    }

    it('should navigate with ArrowRight in horizontal mode', async () => {
      const { selected, tab1Props } = await setupTabs('horizontal')

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab1Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-2')
    })

    it('should navigate with ArrowLeft in horizontal mode', async () => {
      const { selected, tab2Props } = await setupTabs('horizontal')

      // First select tab-2
      tab2Props.select()
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab2Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-1')
    })

    it('should navigate with ArrowDown in vertical mode', async () => {
      const { selected, tab1Props } = await setupTabs('vertical')

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab1Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-2')
    })

    it('should navigate with ArrowUp in vertical mode', async () => {
      const { selected, tab2Props } = await setupTabs('vertical')

      // First select tab-2
      tab2Props.select()
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab2Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-1')
    })

    it('should navigate to first tab with Home', async () => {
      const { selected, tab3Props } = await setupTabs()

      // First select tab-3
      tab3Props.select()
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Home' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab3Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-1')
    })

    it('should navigate to last tab with End', async () => {
      const { selected, tab1Props } = await setupTabs()

      const event = new KeyboardEvent('keydown', { key: 'End' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab1Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-3')
    })

    it('should wrap navigation when loop is enabled (default)', async () => {
      const { selected, tab3Props } = await setupTabs()

      // Select last tab
      tab3Props.select()
      await nextTick()
      expect(selected.value).toBe('tab-3')

      // Navigate right from last tab should wrap to first
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab3Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-1')
    })
  })

  describe('activation modes', () => {
    it('should select on focus in automatic mode (default)', async () => {
      const selected = ref<string>()
      let tab2Props: any

      mount(Tabs.Root, {
        props: {
          'mandatory': false,
          'activation': 'automatic',
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => [
            h(Tabs.Tab as any, { value: 'tab-1' }, () => h('button', 'Tab 1')),
            h(Tabs.Tab as any, { value: 'tab-2' }, {
              default: (props: any) => {
                tab2Props = props
                return h('button', 'Tab 2')
              },
            }),
          ],
        },
      })

      await nextTick()

      // Simulate focus on tab 2
      tab2Props.attrs.onFocus()
      await nextTick()

      expect(selected.value).toBe('tab-2')
    })

    it('should not select on focus in manual mode', async () => {
      const selected = ref<string>()
      let tab2Props: any

      mount(Tabs.Root, {
        props: {
          'mandatory': false,
          'activation': 'manual',
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => [
            h(Tabs.Tab as any, { value: 'tab-1' }, () => h('button', 'Tab 1')),
            h(Tabs.Tab as any, { value: 'tab-2' }, {
              default: (props: any) => {
                tab2Props = props
                return h('button', 'Tab 2')
              },
            }),
          ],
        },
      })

      await nextTick()

      // Simulate focus on tab 2
      tab2Props.attrs.onFocus()
      await nextTick()

      expect(selected.value).toBeUndefined()
    })

    it('should select with Enter in manual mode', async () => {
      const selected = ref<string>()
      let tab1Props: any

      mount(Tabs.Root, {
        props: {
          'mandatory': false,
          'activation': 'manual',
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => h(Tabs.Tab as any, { value: 'tab-1' }, {
            default: (props: any) => {
              tab1Props = props
              return h('button', 'Tab 1')
            },
          }),
        },
      })

      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab1Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-1')
    })

    it('should select with Space in manual mode', async () => {
      const selected = ref<string>()
      let tab1Props: any

      mount(Tabs.Root, {
        props: {
          'mandatory': false,
          'activation': 'manual',
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => h(Tabs.Tab as any, { value: 'tab-1' }, {
            default: (props: any) => {
              tab1Props = props
              return h('button', 'Tab 1')
            },
          }),
        },
      })

      await nextTick()

      const event = new KeyboardEvent('keydown', { key: ' ' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab1Props.attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('tab-1')
    })
  })

  describe('integration', () => {
    it('should skip disabled tabs during navigation', async () => {
      const selected = ref('tab-1')
      let tab1Props: any

      mount(Tabs.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => [
            h(Tabs.Tab as any, { value: 'tab-1' }, {
              default: (props: any) => {
                tab1Props = props
                return h('button', 'Tab 1')
              },
            }),
            h(Tabs.Tab as any, { value: 'tab-2', disabled: true }, () => h('button', 'Tab 2')),
            h(Tabs.Tab as any, { value: 'tab-3' }, () => h('button', 'Tab 3')),
          ],
        },
      })

      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab1Props.attrs.onKeydown(event)
      await nextTick()

      // Should skip disabled tab-2 and go to tab-3
      expect(selected.value).toBe('tab-3')
    })

    it('should use loop prop for wrapping navigation', async () => {
      const selected = ref('tab-3')
      let tab3Props: any

      mount(Tabs.Root, {
        props: {
          'loop': true,
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => [
            h(Tabs.Tab as any, { value: 'tab-1' }, () => h('button', 'Tab 1')),
            h(Tabs.Tab as any, { value: 'tab-2' }, () => h('button', 'Tab 2')),
            h(Tabs.Tab as any, { value: 'tab-3' }, {
              default: (props: any) => {
                tab3Props = props
                return h('button', 'Tab 3')
              },
            }),
          ],
        },
      })

      await nextTick()

      // When loop is true and at the last tab, right arrow should wrap to first
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      Object.defineProperty(event, 'preventDefault', { value: () => {} })

      tab3Props.attrs.onKeydown(event)
      await nextTick()

      // The context's loop property enables this wrapping behavior
      expect(selected.value).toBe('tab-1')
    })

    it('should support non-button tab elements', async () => {
      let tabProps: any

      mount(Tabs.Root, {
        props: {
          modelValue: 'tab-1',
        },
        slots: {
          default: () => h(Tabs.Tab as any, { value: 'tab-1', as: 'a' }, {
            default: (props: any) => {
              tabProps = props
              return h('a', { href: '#' }, 'Tab 1')
            },
          }),
        },
      })

      await nextTick()

      // When as='a', disabled and type should be undefined
      expect(tabProps.attrs.disabled).toBeUndefined()
      expect(tabProps.attrs.type).toBeUndefined()
    })

    it('should use custom namespace for isolation', async () => {
      let tabs1Props: any
      let tabs2Props: any

      mount(defineComponent({
        render: () => [
          h(Tabs.Root as any, { namespace: 'tabs-1', mandatory: false }, () =>
            h(Tabs.Tab as any, { value: 'item', namespace: 'tabs-1' }, {
              default: (props: any) => {
                tabs1Props = props
                return h('button', 'Tab 1')
              },
            }),
          ),
          h(Tabs.Root as any, { namespace: 'tabs-2', mandatory: false }, () =>
            h(Tabs.Tab as any, { value: 'item', namespace: 'tabs-2' }, {
              default: (props: any) => {
                tabs2Props = props
                return h('button', 'Tab 2')
              },
            }),
          ),
        ],
      }))

      await nextTick()

      // Select in tabs 1
      tabs1Props.select()
      await nextTick()

      // Only tabs 1 item should be selected
      expect(tabs1Props.isSelected).toBe(true)
      expect(tabs2Props.isSelected).toBe(false)
    })
  })

  describe('sSR/Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Tabs.Root as any, { modelValue: 'tab-1' }, {
            default: () => [
              h(Tabs.List as any, { label: 'Tabs' }, () => [
                h(Tabs.Tab as any, { value: 'tab-1' }, {
                  default: (props: any) => h('button', { ...props.attrs }, 'Tab 1'),
                }),
                h(Tabs.Tab as any, { value: 'tab-2' }, {
                  default: (props: any) => h('button', { ...props.attrs }, 'Tab 2'),
                }),
              ]),
              h(Tabs.Panel as any, { value: 'tab-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Panel 1'),
              }),
              h(Tabs.Panel as any, { value: 'tab-2' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Panel 2'),
              }),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Tab 1')
      expect(html).toContain('Tab 2')
      expect(html).toContain('Panel 1')
      expect(html).toContain('role="tablist"')
      expect(html).toContain('role="tab"')
      expect(html).toContain('role="tabpanel"')
    })

    it('should render selected state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Tabs.Root as any, { modelValue: 'tab-1' }, {
            default: () =>
              h(Tabs.Tab as any, { value: 'tab-1' }, {
                default: (props: any) => h('button', { ...props.attrs }, 'Tab 1'),
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
          h(Tabs.Root as any, { modelValue: 'tab-1' }, {
            default: () => [
              h(Tabs.Tab as any, { value: 'tab-1' }, {
                default: (props: any) => h('button', { ...props.attrs }, 'Tab 1'),
              }),
              h(Tabs.Panel as any, { value: 'tab-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Panel 1'),
              }),
            ],
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

      expect(wrapper.text()).toContain('Tab 1')
      expect(wrapper.text()).toContain('Panel 1')

      wrapper.unmount()
    })
  })
})
