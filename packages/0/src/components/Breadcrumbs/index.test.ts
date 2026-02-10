import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'

// Types
import type { BreadcrumbsPageSlotProps, BreadcrumbsRootSlotProps } from './index'

import { Breadcrumbs } from './index'

describe('breadcrumbs', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as nav element by default', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        expect(wrapper.find('nav').exists()).toBe(true)
      })

      it('should render with custom element via as prop', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          props: { as: 'div' },
          slots: {
            default: () => h('span', 'Content'),
          },
        })

        expect(wrapper.find('div').exists()).toBe(true)
        expect(wrapper.find('nav').exists()).toBe(false)
      })

      it('should expose slot props', async () => {
        let slotProps: BreadcrumbsRootSlotProps | undefined

        mount(Breadcrumbs.Root, {
          slots: {
            default: (props: BreadcrumbsRootSlotProps) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(typeof slotProps!.isOverflowing).toBe('boolean')
        expect(typeof slotProps!.capacity).toBe('number')
        expect(typeof slotProps!.total).toBe('number')
        expect(typeof slotProps!.depth).toBe('number')
        expect(typeof slotProps!.isRoot).toBe('boolean')
        expect(typeof slotProps!.first).toBe('function')
        expect(typeof slotProps!.prev).toBe('function')
        expect(typeof slotProps!.select).toBe('function')
      })
    })

    describe('accessibility', () => {
      it('should have aria-label="Breadcrumb"', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
      })

      it('should not have role="navigation" when as="nav"', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        // nav element is already a landmark, role would be redundant
        expect(wrapper.find('nav').attributes('role')).toBeUndefined()
      })

      it('should have role="navigation" when as is not nav', async () => {
        let slotProps: BreadcrumbsRootSlotProps | undefined

        mount(Breadcrumbs.Root, {
          props: { as: 'div' },
          slots: {
            default: (props: BreadcrumbsRootSlotProps) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        expect(slotProps!.attrs.role).toBe('navigation')
      })
    })

    describe('default props', () => {
      it('should use default divider "/"', async () => {
        let dividerProps: Record<string, unknown> | undefined

        mount(Breadcrumbs.Root, {
          slots: {
            default: () => h(Breadcrumbs.Divider as never, {}, {
              default: (props: Record<string, unknown>) => {
                dividerProps = props
                return h('span', String(props.divider))
              },
            }),
          },
        })

        await nextTick()

        expect(dividerProps).toBeDefined()
        expect(dividerProps!.divider).toBe('/')
      })

      it('should use custom divider prop', async () => {
        let dividerProps: Record<string, unknown> | undefined

        mount(Breadcrumbs.Root, {
          props: { divider: '>' },
          slots: {
            default: () => h(Breadcrumbs.Divider as never, {}, {
              default: (props: Record<string, unknown>) => {
                dividerProps = props
                return h('span', String(props.divider))
              },
            }),
          },
        })

        await nextTick()

        expect(dividerProps).toBeDefined()
        expect(dividerProps!.divider).toBe('>')
      })
    })
  })

  describe('list', () => {
    it('should render as ol by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, {}, () => h('li', 'Item')),
        },
      })

      await nextTick()

      expect(wrapper.find('ol').exists()).toBe(true)
    })

    it('should have role="list"', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, {}, () => h('li', 'Item')),
        },
      })

      await nextTick()

      expect(wrapper.find('ol').attributes('role')).toBe('list')
    })

    it('should render with custom element via as prop', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, { as: 'ul' }, () => h('li', 'Item')),
        },
      })

      await nextTick()

      expect(wrapper.find('ul').exists()).toBe(true)
    })
  })

  describe('item', () => {
    it('should render as li by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Item as never, {}, () => 'Home'),
        },
      })

      await nextTick()

      expect(wrapper.find('li').exists()).toBe(true)
    })

    it('should expose slot props', async () => {
      let itemProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Item as never, {}, {
            default: (props: Record<string, unknown>) => {
              itemProps = props
              return h('span', 'Home')
            },
          }),
        },
      })

      await nextTick()

      expect(itemProps).toBeDefined()
      expect(itemProps!.id).toBeDefined()
      expect(typeof itemProps!.isSelected).toBe('boolean')
      expect(itemProps!.attrs).toBeDefined()
    })
  })

  describe('link', () => {
    it('should render as anchor by default', () => {
      const wrapper = mount(Breadcrumbs.Link, {
        props: { href: '/home' },
        slots: {
          default: () => 'Home',
        },
      })

      expect(wrapper.find('a').exists()).toBe(true)
    })

    it('should set href attribute', () => {
      const wrapper = mount(Breadcrumbs.Link, {
        props: { href: '/products' },
        slots: {
          default: () => 'Products',
        },
      })

      expect(wrapper.find('a').attributes('href')).toBe('/products')
    })

    it('should render with custom element via as prop', () => {
      const wrapper = mount(Breadcrumbs.Link, {
        props: { as: 'button' },
        attrs: { href: '/home' },
        slots: {
          default: () => 'Home',
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('a').exists()).toBe(false)
    })
  })

  describe('page', () => {
    it('should render as span by default', () => {
      const wrapper = mount(Breadcrumbs.Page, {
        slots: {
          default: () => 'Current Page',
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should have aria-current="page"', () => {
      const wrapper = mount(Breadcrumbs.Page, {
        slots: {
          default: () => 'Current Page',
        },
      })

      expect(wrapper.find('span').attributes('aria-current')).toBe('page')
    })

    it('should expose slot props with attrs', () => {
      let pageProps: BreadcrumbsPageSlotProps | undefined

      mount(Breadcrumbs.Page, {
        slots: {
          default: (props: BreadcrumbsPageSlotProps) => {
            pageProps = props
            return h('span', 'Current')
          },
        },
      })

      expect(pageProps).toBeDefined()
      expect(pageProps!.attrs['aria-current']).toBe('page')
    })

    it('should render with custom element via as prop', () => {
      const wrapper = mount(Breadcrumbs.Page, {
        props: { as: 'strong' },
        slots: {
          default: () => 'Current Page',
        },
      })

      expect(wrapper.find('strong').exists()).toBe(true)
      expect(wrapper.find('strong').attributes('aria-current')).toBe('page')
    })
  })

  describe('divider', () => {
    it('should render as li by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, () => '/'),
        },
      })

      await nextTick()

      expect(wrapper.find('li').exists()).toBe(true)
    })

    it('should have aria-hidden="true"', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never),
        },
      })

      await nextTick()

      const li = wrapper.find('li')
      expect(li.attributes('aria-hidden')).toBe('true')
    })

    it('should expose slot props with divider text', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', String(props.divider))
            },
          }),
        },
      })

      await nextTick()

      expect(dividerProps).toBeDefined()
      expect(dividerProps!.divider).toBe('/')
      expect(typeof dividerProps!.isSelected).toBe('boolean')
      expect(dividerProps!.id).toBeDefined()
    })

    it('should allow override divider character', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, { divider: '>' }, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', String(props.divider))
            },
          }),
        },
      })

      await nextTick()

      expect(dividerProps!.divider).toBe('>')
    })

    it('should expose attrs with aria-hidden', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', '/')
            },
          }),
        },
      })

      await nextTick()

      const attrs = dividerProps!.attrs as Record<string, unknown>
      expect(attrs['aria-hidden']).toBe('true')
    })
  })

  describe('ellipsis', () => {
    it('should render as li by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never),
        },
      })

      await nextTick()

      expect(wrapper.find('li').exists()).toBe(true)
    })

    it('should have aria-hidden="true"', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never),
        },
      })

      await nextTick()

      const li = wrapper.find('li')
      expect(li.attributes('aria-hidden')).toBe('true')
    })

    it('should expose slot props', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, {}, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', String(props.ellipsis))
            },
          }),
        },
      })

      await nextTick()

      expect(ellipsisProps).toBeDefined()
      expect(typeof ellipsisProps!.isSelected).toBe('boolean')
      expect(ellipsisProps!.id).toBeDefined()
      expect(ellipsisProps!.ellipsis).toBeDefined()
    })

    it('should use default ellipsis from root', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        props: { ellipsis: '---' },
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, {}, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', String(props.ellipsis))
            },
          }),
        },
      })

      await nextTick()

      expect(ellipsisProps!.ellipsis).toBe('---')
    })

    it('should allow override ellipsis character', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        props: { ellipsis: '...' },
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, { ellipsis: '***' }, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', String(props.ellipsis))
            },
          }),
        },
      })

      await nextTick()

      expect(ellipsisProps!.ellipsis).toBe('***')
    })

    it('should expose attrs with aria-hidden', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, {}, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', '\u2026')
            },
          }),
        },
      })

      await nextTick()

      const attrs = ellipsisProps!.attrs as Record<string, unknown>
      expect(attrs['aria-hidden']).toBe('true')
    })
  })

  describe('integration', () => {
    it('should render a complete breadcrumbs trail', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, {}, () => [
            h(Breadcrumbs.Item as never, {}, () =>
              h(Breadcrumbs.Link as never, { href: '/' }, () => 'Home'),
            ),
            h(Breadcrumbs.Divider as never),
            h(Breadcrumbs.Item as never, {}, () =>
              h(Breadcrumbs.Link as never, { href: '/products' }, () => 'Products'),
            ),
            h(Breadcrumbs.Divider as never),
            h(Breadcrumbs.Item as never, {}, () =>
              h(Breadcrumbs.Page as never, {}, () => 'Electronics'),
            ),
          ]),
        },
      })

      await nextTick()

      // Verify structure
      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.find('ol').exists()).toBe(true)
      expect(wrapper.findAll('li').length).toBeGreaterThan(0)
      expect(wrapper.find('[aria-label="Breadcrumb"]').exists()).toBe(true)
      expect(wrapper.find('[role="list"]').exists()).toBe(true)
    })

    it('should work with namespace isolation', async () => {
      let rootProps1: Record<string, unknown> | undefined
      let rootProps2: Record<string, unknown> | undefined

      mount(defineComponent({
        render: () => [
          h(Breadcrumbs.Root as never, { namespace: 'nav-1' }, {
            default: (props: Record<string, unknown>) => {
              rootProps1 = props
              return h(Breadcrumbs.Item as never, { namespace: 'nav-1' }, () => 'Item 1')
            },
          }),
          h(Breadcrumbs.Root as never, { namespace: 'nav-2' }, {
            default: (props: Record<string, unknown>) => {
              rootProps2 = props
              return h(Breadcrumbs.Item as never, { namespace: 'nav-2' }, () => 'Item 2')
            },
          }),
        ],
      }))

      await nextTick()

      // Both roots should be independent
      expect(rootProps1).toBeDefined()
      expect(rootProps2).toBeDefined()
      expect(rootProps1!.depth).toBe(1)
      expect(rootProps2!.depth).toBe(1)
    })
  })

  describe('sSR/Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Breadcrumbs.Root as never, {}, {
            default: () =>
              h(Breadcrumbs.List as never, {}, () => [
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Link as never, { href: '/' }, () => 'Home'),
                ),
                h(Breadcrumbs.Divider as never),
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Page as never, {}, () => 'Current'),
                ),
              ]),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Home')
      expect(html).toContain('Current')
      expect(html).toContain('aria-label="Breadcrumb"')
      expect(html).toContain('role="list"')
      expect(html).toContain('aria-current="page"')
    })

    it('should render accessibility attributes on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Breadcrumbs.Root as never, {}, {
            default: () => [
              h(Breadcrumbs.Divider as never),
              h(Breadcrumbs.Ellipsis as never),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-hidden="true"')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Breadcrumbs.Root as never, {}, {
            default: () =>
              h(Breadcrumbs.List as never, {}, () => [
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Link as never, { href: '/' }, () => 'Home'),
                ),
                h(Breadcrumbs.Divider as never),
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Page as never, {}, () => 'Current'),
                ),
              ]),
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

      expect(wrapper.text()).toContain('Home')
      expect(wrapper.text()).toContain('Current')

      wrapper.unmount()
    })
  })
})
