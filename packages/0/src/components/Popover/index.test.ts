import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'

import { Popover } from './index'

describe('popover', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should be renderless by default', () => {
        const wrapper = mount(Popover.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Popover.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.id).toBe('string')
        expect(typeof slotProps.isSelected).toBe('boolean')
        expect(typeof slotProps.toggle).toBe('function')
      })
    })

    describe('v-model', () => {
      it('should default to closed', () => {
        let slotProps: any

        mount(Popover.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.isSelected).toBe(false)
      })

      it('should support initial open state', () => {
        let slotProps: any

        mount(Popover.Root, {
          props: {
            modelValue: true,
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.isSelected).toBe(true)
      })

      it('should emit update:modelValue on toggle', async () => {
        let slotProps: any

        mount(Popover.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.isSelected).toBe(false)

        slotProps.toggle()
        await nextTick()

        expect(slotProps.isSelected).toBe(true)

        slotProps.toggle()
        await nextTick()

        expect(slotProps.isSelected).toBe(false)
      })
    })

    describe('id prop', () => {
      it('should use provided id', () => {
        let slotProps: any

        mount(Popover.Root, {
          props: {
            id: 'my-popover',
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.id).toBe('my-popover')
      })

      it('should auto-generate id if not provided', () => {
        let slotProps: any

        mount(Popover.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.id).toBeDefined()
        expect(typeof slotProps.id).toBe('string')
      })
    })
  })

  describe('anchor', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        const wrapper = mount(Popover.Root, {
          slots: {
            default: () =>
              h(Popover.Anchor, {}, () => 'Click me'),
          },
        })

        expect(wrapper.find('button').exists()).toBe(true)
      })

      it('should expose slot props', async () => {
        let anchorProps: any

        mount(Popover.Root, {
          slots: {
            default: () =>
              h(Popover.Anchor, {}, {
                default: (props: any) => {
                  anchorProps = props
                  return h('button', 'Click me')
                },
              }),
          },
        })

        await nextTick()

        expect(anchorProps).toBeDefined()
        expect(typeof anchorProps.isOpen).toBe('boolean')
        expect(anchorProps.attrs).toBeDefined()
        expect(typeof anchorProps.attrs.popovertarget).toBe('string')
        expect(anchorProps.attrs.type).toBe('button')
      })
    })

    describe('popovertarget', () => {
      it('should use parent popover id', async () => {
        let anchorProps: any

        mount(Popover.Root, {
          props: { id: 'test-popover' },
          slots: {
            default: () =>
              h(Popover.Anchor, {}, {
                default: (props: any) => {
                  anchorProps = props
                  return h('button', 'Click me')
                },
              }),
          },
        })

        await nextTick()

        expect(anchorProps.attrs.popovertarget).toBe('test-popover')
      })

      it('should allow override with target prop', async () => {
        let anchorProps: any

        mount(Popover.Root, {
          props: { id: 'parent-id' },
          slots: {
            default: () =>
              h(Popover.Anchor, { target: 'custom-target' }, {
                default: (props: any) => {
                  anchorProps = props
                  return h('button', 'Click me')
                },
              }),
          },
        })

        await nextTick()

        expect(anchorProps.attrs.popovertarget).toBe('custom-target')
      })
    })

    describe('open state', () => {
      it('should reflect closed state', async () => {
        let anchorProps: any

        mount(Popover.Root, {
          props: { modelValue: false },
          slots: {
            default: () =>
              h(Popover.Anchor, {}, {
                default: (props: any) => {
                  anchorProps = props
                  return h('button', 'Click me')
                },
              }),
          },
        })

        await nextTick()

        expect(anchorProps.isOpen).toBe(false)
        expect(anchorProps.attrs['data-popover-open']).toBeUndefined()
      })

      it('should reflect open state', async () => {
        let anchorProps: any

        mount(Popover.Root, {
          props: { modelValue: true },
          slots: {
            default: () =>
              h(Popover.Anchor, {}, {
                default: (props: any) => {
                  anchorProps = props
                  return h('button', 'Click me')
                },
              }),
          },
        })

        await nextTick()

        expect(anchorProps.isOpen).toBe(true)
        expect(anchorProps.attrs['data-popover-open']).toBe('')
      })
    })
  })

  describe('content', () => {
    describe('rendering', () => {
      it('should render with popover attribute', () => {
        const wrapper = mount(Popover.Root, {
          slots: {
            default: () =>
              h(Popover.Content, {}, () => 'Popover content'),
          },
        })

        const content = wrapper.find('[popover]')
        expect(content.exists()).toBe(true)
      })

      it('should expose slot props', async () => {
        let contentProps: any

        mount(Popover.Root, {
          slots: {
            default: () =>
              h(Popover.Content, {}, {
                default: (props: any) => {
                  contentProps = props
                  return h('div', 'Content')
                },
              }),
          },
        })

        await nextTick()

        expect(contentProps).toBeDefined()
        expect(typeof contentProps.isOpen).toBe('boolean')
        expect(contentProps.attrs).toBeDefined()
        expect(typeof contentProps.attrs.id).toBe('string')
        expect(contentProps.attrs.popover).toBe('')
      })
    })

    describe('id', () => {
      it('should use parent popover id', async () => {
        let contentProps: any

        mount(Popover.Root, {
          props: { id: 'test-popover' },
          slots: {
            default: () =>
              h(Popover.Content, {}, {
                default: (props: any) => {
                  contentProps = props
                  return h('div', 'Content')
                },
              }),
          },
        })

        await nextTick()

        expect(contentProps.attrs.id).toBe('test-popover')
      })

      it('should allow override with id prop', async () => {
        let contentProps: any

        mount(Popover.Root, {
          props: { id: 'parent-id' },
          slots: {
            default: () =>
              h(Popover.Content, { id: 'custom-id' }, {
                default: (props: any) => {
                  contentProps = props
                  return h('div', 'Content')
                },
              }),
          },
        })

        await nextTick()

        expect(contentProps.attrs.id).toBe('custom-id')
      })
    })

    describe('open state', () => {
      it('should reflect closed state', async () => {
        let contentProps: any

        mount(Popover.Root, {
          props: { modelValue: false },
          slots: {
            default: () =>
              h(Popover.Content, {}, {
                default: (props: any) => {
                  contentProps = props
                  return h('div', 'Content')
                },
              }),
          },
        })

        await nextTick()

        expect(contentProps.isOpen).toBe(false)
      })

      it('should reflect open state via context', async () => {
        // Note: Native showPopover() doesn't exist in happy-dom
        // This test verifies the context state is properly reflected
        let contentProps: any
        let rootProps: any

        mount(Popover.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Popover.Content, {}, {
                default: (p: any) => {
                  contentProps = p
                  return h('div', 'Content')
                },
              })
            },
          },
        })

        await nextTick()

        expect(contentProps.isOpen).toBe(false)

        // Toggle via root (bypasses native API)
        rootProps.toggle()
        await nextTick()

        expect(contentProps.isOpen).toBe(true)
      })
    })

    describe('beforetoggle event', () => {
      it('should emit beforetoggle event', async () => {
        const beforetoggle = vi.fn()

        const wrapper = mount(Popover.Root, {
          slots: {
            default: () =>
              h(Popover.Content, { onBeforetoggle: beforetoggle }, () => 'Content'),
          },
        })

        await nextTick()

        const content = wrapper.find('[popover]')
        await content.trigger('beforetoggle', { newState: 'open' })

        expect(beforetoggle).toHaveBeenCalled()
      })
    })
  })

  describe('integration', () => {
    it('should work as complete popover', async () => {
      let rootProps: any
      let anchorProps: any
      let contentProps: any

      mount(Popover.Root, {
        props: { id: 'my-popover' },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Popover.Anchor, {}, {
                default: (p: any) => {
                  anchorProps = p
                  return h('button', 'Toggle')
                },
              }),
              h(Popover.Content, {}, {
                default: (p: any) => {
                  contentProps = p
                  return h('div', 'Content')
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      // IDs should match
      expect(rootProps.id).toBe('my-popover')
      expect(anchorProps.attrs.popovertarget).toBe('my-popover')
      expect(contentProps.attrs.id).toBe('my-popover')

      // Initial state is closed
      expect(rootProps.isSelected).toBe(false)
      expect(anchorProps.isOpen).toBe(false)
      expect(contentProps.isOpen).toBe(false)

      // Toggle open
      rootProps.toggle()
      await nextTick()

      expect(rootProps.isSelected).toBe(true)
      expect(anchorProps.isOpen).toBe(true)
      expect(contentProps.isOpen).toBe(true)
    })

    it('should handle multiple popovers independently', async () => {
      let popover1Props: any
      let popover2Props: any

      mount(defineComponent({
        render: () => [
          h(Popover.Root, { id: 'popover-1' }, {
            default: (props: any) => {
              popover1Props = props
              return h('div', 'Popover 1')
            },
          }),
          h(Popover.Root, { id: 'popover-2' }, {
            default: (props: any) => {
              popover2Props = props
              return h('div', 'Popover 2')
            },
          }),
        ],
      }))

      await nextTick()

      expect(popover1Props.id).toBe('popover-1')
      expect(popover2Props.id).toBe('popover-2')

      // Toggle first popover
      popover1Props.toggle()
      await nextTick()

      expect(popover1Props.isSelected).toBe(true)
      expect(popover2Props.isSelected).toBe(false)

      // Toggle second popover
      popover2Props.toggle()
      await nextTick()

      expect(popover1Props.isSelected).toBe(true)
      expect(popover2Props.isSelected).toBe(true)
    })
  })

  describe('sSR/Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Popover.Root as any, { id: 'test-popover' }, {
            default: () => [
              h(Popover.Anchor as any, {}, () => 'Toggle'),
              h(Popover.Content as any, {}, () => 'Content'),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Toggle')
      expect(html).toContain('Content')
      expect(html).toContain('popovertarget="test-popover"')
      expect(html).toContain('id="test-popover"')
    })

    it('should render open state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Popover.Root as any, { id: 'test-popover', modelValue: true }, {
            default: () =>
              h(Popover.Anchor as any, {}, () => 'Toggle'),
          }),
      }))

      const html = await renderToString(app)

      // Boolean attributes may be rendered as just "data-popover-open" or "data-popover-open=''"
      expect(html).toMatch(/data-popover-open/)
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Popover.Root as any, { id: 'test-popover' }, {
            default: () => [
              h(Popover.Anchor as any, {}, () => 'Toggle'),
              h(Popover.Content as any, {}, () => 'Content'),
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

      expect(wrapper.text()).toContain('Toggle')
      expect(wrapper.text()).toContain('Content')

      wrapper.unmount()
    })
  })
})
